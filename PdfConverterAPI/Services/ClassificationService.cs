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

                // Preenche dinamicamente os valores
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

                candidate.IsEliminated = eliminatedByZero || eliminatedByPercent;
                candidate.Status = candidate.IsEliminated ? "Eliminado" : "Classificado";
            }

            var rankedCandidates = candidates
                .OrderBy(c => c.IsEliminated)
                .ThenByDescending(c => c.TotalScore);

            // Verifica se há critério de desempate antes de ordená-lo
            if (request.TiebreakerCriterion != null && request.TiebreakerCriterion.Any())
            {
                rankedCandidates = rankedCandidates.ThenBy(c =>
                    request
                        .TiebreakerCriterion.OrderBy(tc => tc.Key)
                        .Select(tc => c.Scores.ContainsKey(tc.Value) ? c.Scores[tc.Value] : 0)
                        .Aggregate((a, b) => a + b) // Soma os valores para gerar um único número
                );
            }

            var finalRanking = rankedCandidates.ToList();

            for (int i = 0; i < finalRanking.Count; i++)
            {
                finalRanking[i].Position = finalRanking[i].IsEliminated ? -1 : i + 1;
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
