using System.Text.RegularExpressions;
using PdfConverterAPI.Models;

namespace PdfConverterAPI.Services
{
    public class ClassificationService
    {
        public async Task<List<CandidateDataModel>> ProcessFiles(
            IEnumerable<IFormFile> files,
            ClassificationCriteriaModel request
        )
        {
            var candidates = new List<CandidateDataModel>();

            foreach (var file in files)
            {
                using var stream = file.OpenReadStream();
                var text = ExtractionService.ReadPdfText(stream);
                ProcessCandidate(text, request, candidates);
            }

            return RankCandidates(candidates, request);
        }

        private void ProcessCandidate(
            string text,
            ClassificationCriteriaModel request,
            List<CandidateDataModel> candidates
        )
        {
            var candidateMatches = Regex.Matches(
                text,
                GetRegexPattern(request.Values),
                RegexOptions.Multiline
            );

            foreach (Match match in candidateMatches)
            {
                var candidate = new CandidateDataModel
                {
                    RegistrationNumber = match.Groups[request.Values[0]].Value.Trim(),
                    Name = match.Groups[request.Values[1]].Value.Trim(),
                };

                foreach (var value in request.Values.Skip(2))
                {
                    if (
                        double.TryParse(
                            match.Groups[value].Value.Replace(",", "."),
                            out double result
                        )
                    )
                    {
                        candidate.Scores[value] = result;
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

                    foreach (var criterion in request.TiebreakerCriterion.OrderBy(tc => tc.Key))
                    {
                        double currentValue = currentCandidate.Scores.ContainsKey(criterion.Value)
                            ? currentCandidate.Scores[criterion.Value]
                            : 0;
                        double previousValue = previousCandidate.Scores.ContainsKey(criterion.Value)
                            ? previousCandidate.Scores[criterion.Value]
                            : 0;

                        if (currentValue != previousValue)
                        {
                            isTied = false;
                            break;
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

        private string GetRegexPattern(List<string> values)
        {
            return $@"(?<{values[0]}>[\d]+)\s+(?<{values[1]}>[A-ZÀ-Ú ]+)\s+"
                + string.Join(
                    @"\s+",
                    values.Skip(2).Select(v => $"(?<{v}>\\d+,\\d+|\\d+\\.\\d+|\\d+)")
                );
        }
    }
}
