using System.IO;
using Spire.Pdf;

namespace PdfConverterAPI.Services
{
    public class PdfToWordService
    {
        public byte[] ConvertPdfToWord(byte[] pdfBytes)
        {
            using (var inputStream = new MemoryStream(pdfBytes))
            using (var outputStream = new MemoryStream())
            {
                var pdfDoc = new PdfDocument();
                pdfDoc.LoadFromStream(inputStream);
                pdfDoc.SaveToStream(outputStream, Spire.Pdf.FileFormat.DOCX);

                return outputStream.ToArray();
            }
        }
    }
}
