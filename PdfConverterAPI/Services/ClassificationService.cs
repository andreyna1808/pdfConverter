using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using PdfConverterAPI.Models;

namespace PdfConverterAPI.Services
{
    public class ClassificationService
    {
        public async Task<List<CandidateDataModel>> ProcessFiles(
            IFormFile file,
            ClassificationCriteriaModel request
        )
        {
            var candidates = new List<CandidateDataModel>();

            using var stream = file.OpenReadStream();
            var text = ExtractionService.ReadPdfText(stream);

            string[] pages = Regex.Split(text, @"Página \d+ de \d+");

            foreach (var page in pages)
            {
                string header = page.Substring(0, Math.Min(300, page.Length));

                string normalizedHeader = NormalizeText(header);
                string normalizedProfession = NormalizeText(request.Profession);

                if (!normalizedHeader.Contains(normalizedProfession))
                {
                    continue;
                }

                List<string> detectedHeaders = DetectHeaders(page, request.Values);
                if (!detectedHeaders.Any())
                {
                    continue;
                }

                string regexPattern = GetRegexPattern(detectedHeaders);

                ProcessCandidate(
                    page,
                    regexPattern,
                    detectedHeaders,
                    candidates,
                    request.FullScore
                );
            }

            return RankCandidates(candidates, request);
        }

        private List<string> DetectHeaders(string text, List<string> expectedValues)
        {
            string[] lines = text.Split('\n');

            List<string> headers = new();

            foreach (string line in lines)
            {
                if (expectedValues.All(v => line.Contains(v, StringComparison.OrdinalIgnoreCase)))
                {
                    headers = expectedValues;
                    break;
                }
            }

            return headers;
        }

        private void ProcessCandidate(
            string text,
            string regexPattern,
            List<string> headers,
            List<CandidateDataModel> candidates,
            double fullScore
        )
        {
            var candidateMatches = Regex.Matches(text, regexPattern, RegexOptions.Multiline);

            if (candidateMatches.Count == 0)
            {
                return;
            }

            foreach (Match match in candidateMatches)
            {
                var candidate = new CandidateDataModel
                {
                    RegistrationNumber = match.Groups[headers[0]].Value.Trim(),
                    Name = match.Groups[headers[1]].Value.Trim(),
                    Scores = new Dictionary<string, double>(),
                };

                foreach (var header in headers.Skip(2))
                {
                    if (
                        double.TryParse(
                            match.Groups[header].Value.Replace(",", "."),
                            out double result
                        )
                    )
                    {
                        if (result > fullScore)
                        {
                            result /= 100;
                        }
                        candidate.Scores[header] = result;
                    }
                }

                candidates.Add(candidate);
            }
        }

        private List<CandidateDataModel> RankCandidates(
            List<CandidateDataModel> candidates,
            ClassificationCriteriaModel request
        )
        {
            foreach (var candidate in candidates)
            {
                var totalScore = candidate.Scores.ContainsKey(request.BasisAssessment)
                    ? candidate.Scores[request.BasisAssessment]
                    : 0;
                candidate.TotalScore = totalScore;

                bool eliminatedByZero =
                    request.EliminatedByZero.HasValue
                    && request.EliminatedByZero.Value
                    && candidate.Scores.Any(s => s.Value == 0);

                bool eliminatedByPercent =
                    request.ElimitedByPercent.HasValue
                    && candidate.TotalScore
                        < (request.ElimitedByPercent.Value / 100.0 * request.FullScore);

                if (eliminatedByZero)
                {
                    candidate.Status = "Eliminado por zerar algum conteúdo";
                }
                else if (eliminatedByPercent)
                {
                    candidate.Status =
                        $"Eliminado por tirar abaixo de {request.ElimitedByPercent}%";
                }
                else
                {
                    candidate.Status = "Classificado";
                }

                candidate.IsEliminated = eliminatedByZero || eliminatedByPercent;
            }

            var rankedCandidates = candidates
                .OrderBy(c => c.IsEliminated)
                .ThenByDescending(c => c.TotalScore);

            if (request.TiebreakerCriterion != null && request.TiebreakerCriterion.Any())
            {
                foreach (var criterion in request.TiebreakerCriterion.OrderBy(tc => tc.Key))
                {
                    rankedCandidates = rankedCandidates.ThenByDescending(c =>
                        c.Scores.ContainsKey(criterion.Value) ? c.Scores[criterion.Value] : 0
                    );
                }
            }

            var finalRanking = rankedCandidates.ToList();

            for (int i = 0; i < finalRanking.Count; i++)
            {
                var currentCandidate = finalRanking[i];
                currentCandidate.Position = currentCandidate.IsEliminated ? -1 : i + 1;

                if (i > 0)
                {
                    var previousCandidate = finalRanking[i - 1];

                    bool isTied =
                        !currentCandidate.IsEliminated
                        && !previousCandidate.IsEliminated
                        && currentCandidate.TotalScore == previousCandidate.TotalScore;

                    if (request.TiebreakerCriterion != null && request.TiebreakerCriterion.Any())
                    {
                        foreach (var criterion in request.TiebreakerCriterion.OrderBy(tc => tc.Key))
                        {
                            double currentValue = currentCandidate.Scores.ContainsKey(
                                criterion.Value
                            )
                                ? currentCandidate.Scores[criterion.Value]
                                : 0;
                            double previousValue = previousCandidate.Scores.ContainsKey(
                                criterion.Value
                            )
                                ? previousCandidate.Scores[criterion.Value]
                                : 0;

                            if (currentValue != previousValue)
                            {
                                isTied = false;
                                break;
                            }
                        }
                    }

                    if (isTied)
                    {
                        currentCandidate.Status =
                            "Classificado: Aguardar outro critério de desempate para prova de título";
                        previousCandidate.Status =
                            "Classificado: Aguardar outro critério de desempate para prova de título";
                    }
                }
            }

            return finalRanking;
        }

        private string GetRegexPattern(List<string> headers)
        {
            var sanitizedHeaders = headers.Select(h => SanitizeGroupName(h)).ToList();

            return $@"(?<{sanitizedHeaders[0]}>[\d]+)\s+(?<{sanitizedHeaders[1]}>[A-ZÀ-Úa-zçãõ ]+)\s+"
                + string.Join(
                    @"\s+",
                    sanitizedHeaders.Skip(2).Select(h => $"(?<{h}>\\d+,\\d+|\\d+\\.\\d+|\\d+)")
                );
        }

        private string SanitizeGroupName(string name)
        {
            return Regex.Replace(name, @"\s+", "_");
        }

        private string NormalizeText(string text)
        {
            if (string.IsNullOrEmpty(text))
                return "";

            text = text.Normalize(NormalizationForm.FormD);
            text = new string(
                text.Where(c =>
                        CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark
                    )
                    .ToArray()
            );

            text = Regex.Replace(text, @"[^a-zA-Z0-9]", " ").ToLower().Trim();

            text = Regex.Replace(text, @"\s+", " ");

            return text;
        }
    }
}
