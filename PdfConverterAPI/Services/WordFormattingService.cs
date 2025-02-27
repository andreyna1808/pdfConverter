using System;
using System.IO;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;

namespace PdfConverterAPI.Services
{
    public class WordFormattingService
    {
        private const string DefaultFont = "Times New Roman";
        private const int DefaultFontSize = 24; // OpenXML usa meio pontos, 24 = 12pt
        private const int DefaultLineSpacing = 360; // 1.5 espaçamento em Twips

        public byte[] FormatWordDocument(
            byte[] fileBytes,
            string? font,
            int? fontSize,
            int? lineSpacing
        )
        {
            font ??= DefaultFont;
            fontSize ??= DefaultFontSize;
            lineSpacing ??= DefaultLineSpacing;

            using var memoryStream = new MemoryStream();
            memoryStream.Write(fileBytes, 0, fileBytes.Length);
            memoryStream.Position = 0;

            using (var wordDoc = WordprocessingDocument.Open(memoryStream, true))
            {
                var body = wordDoc.MainDocumentPart.Document.Body;

                foreach (var paragraph in body.Elements<Paragraph>())
                {
                    ApplyFormatting(paragraph, font, fontSize.Value, lineSpacing.Value);
                }

                wordDoc.MainDocumentPart.Document.Save();
            }

            return memoryStream.ToArray();
        }

        private void ApplyFormatting(
            Paragraph paragraph,
            string font,
            int fontSize,
            int lineSpacing
        )
        {
            // Propriedades do parágrafo
            var paragraphProperties = paragraph.ParagraphProperties ?? new ParagraphProperties();
            paragraphProperties.RemoveAllChildren<SpacingBetweenLines>();
            paragraphProperties.AppendChild(
                new SpacingBetweenLines
                {
                    Line = lineSpacing.ToString(),
                    LineRule = LineSpacingRuleValues.Auto,
                }
            );

            // Propriedades do texto dentro do parágrafo
            foreach (var run in paragraph.Elements<Run>())
            {
                var runProperties = run.RunProperties ?? new RunProperties();
                runProperties.RemoveAllChildren<RunFonts>();
                runProperties.AppendChild(new RunFonts { Ascii = font, HighAnsi = font });

                runProperties.RemoveAllChildren<FontSize>();
                runProperties.AppendChild(new FontSize { Val = fontSize.ToString() });

                run.RunProperties = runProperties;
            }

            paragraph.ParagraphProperties = paragraphProperties;
        }
    }
}
