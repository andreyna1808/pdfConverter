using System.Text.RegularExpressions;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using PdfConverterAPI.Models;

namespace PdfConverterAPI.Services
{
    public class ExtractionService
    {
        public async Task<List<ProfessionDataModel>> ProcessFiles(IFormFile file)
        {
            var professions = new List<ProfessionDataModel>();
            var existingProfessions = new HashSet<string>();

            using var stream = file.OpenReadStream();
            var text = ReadPdfText(stream);
            ExtractProfessions(text, professions, existingProfessions);

            return professions;
        }

        public static string ReadPdfText(Stream stream)
        {
            using var pdfReader = new PdfReader(stream);
            using var pdfDoc = new PdfDocument(pdfReader);
            var text = "";

            for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)
            {
                text += PdfTextExtractor.GetTextFromPage(pdfDoc.GetPage(i)) + "\n";
            }

            return text;
        }

        private void ExtractProfessions(
            string text,
            List<ProfessionDataModel> professions,
            HashSet<string> existingProfessions
        )
        {
            var lines = text.Split('\n')
                .Select(l => l.Trim())
                .Where(l => !string.IsNullOrEmpty(l))
                .ToList();

            ProfessionDataModel? currentProfession = null;

            foreach (var line in lines)
            {
                // Identifica a profissão e verifica se já foi salva
                if (
                    (
                        Regex.IsMatch(line, @"^\d{3} - [A-ZÀ-Ú\s-]+$")
                        || line.Contains("ANALISTA JUDICIÁRIO")
                    ) && !existingProfessions.Contains(line)
                )
                {
                    currentProfession = new ProfessionDataModel
                    {
                        Profession = line,
                        Values = new List<string>(),
                    };
                    professions.Add(currentProfession);
                    existingProfessions.Add(line);
                }
                else if (
                    currentProfession != null
                    && currentProfession.Values.Count == 0
                    && Regex.IsMatch(line, @"[A-ZÀ-Ú\s]+")
                )
                {
                    var headers = line.Split(' ', StringSplitOptions.RemoveEmptyEntries).ToList();
                    currentProfession.Values = headers;
                }
            }
        }
    }
}
