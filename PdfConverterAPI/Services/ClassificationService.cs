using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using Microsoft.AspNetCore.Http;

namespace PdfConverterAPI.Services
{
    public class ClassificationService
    {
        public static List<Candidate> candidates = new List<Candidate>();

        public async Task<List<Candidate>> ProcessFiles(IFormFile[] files)
        {
            candidates.Clear();

            foreach (var file in files)
            {
                using var stream = file.OpenReadStream();
                var text = ReadPdfText(stream);
                ProcessCandidate(text);
            }

            var rankedCandidates = candidates
                .OrderBy(c => c.IsEliminated)
                .ThenByDescending(c => c.TotalScore)
                .ThenByDescending(c => c.CEPE)
                .ThenByDescending(c => c.LPFS)
                .Select(
                    (c, index) =>
                    {
                        if (c.IsEliminated)
                        {
                            c.Position = -1;
                            c.Status = "Eliminado por ter zerado ou estar abaixo dos 25 pontos";
                        }
                        else
                        {
                            c.Position = index + 1;
                            c.Status = "Classificado";
                        }

                        return c;
                    }
                )
                .ToList();

            for (int i = 1; i < rankedCandidates.Count; i++)
            {
                var prev = rankedCandidates[i - 1];
                var curr = rankedCandidates[i];

                if (
                    !curr.IsEliminated
                    && prev.TotalScore == curr.TotalScore
                    && prev.CEPE == curr.CEPE
                    && prev.LPFS == curr.LPFS
                )
                {
                    curr.Status = "Aguardar prova de título";
                    prev.Status = "Aguardar prova de título";
                }
            }

            return rankedCandidates;
        }

        public string ReadPdfText(Stream stream)
        {
            using var pdfReader = new PdfReader(stream);
            using var pdfDoc = new PdfDocument(pdfReader);
            string text = "";
            for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)
            {
                text += PdfTextExtractor.GetTextFromPage(pdfDoc.GetPage(i));
            }
            return text;
        }

        public void ProcessCandidate(string text)
        {
            Console.WriteLine("======================================");
            Console.WriteLine("Texto extraído do PDF:\n" + text);

            var candidateMatches = Regex.Matches(
                text,
                @"(?<Registration>\d{9})\s+(?<Name>[A-ZÀ-Ú ]+)\s+(?<LPFS>\d+,\d+|\d+\.\d+|\d+)\s+(?<RLFS>\d+,\d+|\d+\.\d+|\d+)\s+(?<NIFS>\d+,\d+|\d+\.\d+|\d+)\s+(?<CEAS>\d+,\d+|\d+\.\d+|\d+)\s+(?<Score>\d+,\d+|\d+\.\d+|\d+)",
                RegexOptions.Multiline
            );

            if (candidateMatches.Count == 0)
            {
                Console.WriteLine("⚠️ Nenhum candidato encontrado!");
                return;
            }

            foreach (Match match in candidateMatches)
            {
                string registrationNumber = match.Groups["Registration"].Value.Trim();
                string name = match.Groups["Name"].Value.Trim();
                double lpfs = double.Parse(match.Groups["LPFS"].Value.Replace(",", "."));
                double rlfs = double.Parse(match.Groups["RLFS"].Value.Replace(",", "."));
                double cped = double.Parse(match.Groups["NIFS"].Value.Replace(",", "."));
                double cepe = double.Parse(match.Groups["CEAS"].Value.Replace(",", "."));
                double score = double.Parse(match.Groups["Score"].Value.Replace(",", "."));

                Console.WriteLine(
                    $"✅ Processando: {name} | Inscrição: {registrationNumber} | Nota: {score} | CEPE: {cepe} | LPFS: {lpfs}"
                );

                bool eliminado = (lpfs == 0 || rlfs == 0 || cped == 0 || cepe == 0 || score < 2500);

                var candidate = candidates.FirstOrDefault(c =>
                    c.RegistrationNumber == registrationNumber
                );
                if (candidate != null)
                {
                    candidate.TotalScore += score;
                    candidate.CEPE = cepe;
                    candidate.LPFS = lpfs;
                    candidate.IsEliminated = eliminado;
                }
                else
                {
                    candidates.Add(
                        new Candidate
                        {
                            Name = name,
                            RegistrationNumber = registrationNumber,
                            TotalScore = score,
                            LPFS = lpfs,
                            RLFS = rlfs,
                            CPED = cped,
                            CEPE = cepe,
                            IsEliminated = eliminado,
                        }
                    );
                }
            }

            Console.WriteLine($"✅ Total de candidatos processados: {candidates.Count}");
        }
    }
}

public class Candidate
{
    public string Name { get; set; }
    public string RegistrationNumber { get; set; }
    public double TotalScore { get; set; }
    public int Position { get; set; }

    public double LPFS { get; set; } = 0;
    public double RLFS { get; set; } = 0;
    public double CPED { get; set; } = 0;
    public double CEPE { get; set; } = 0;

    public bool IsEliminated { get; set; } = false;
    public string Status { get; set; } = "Classificado";
}
