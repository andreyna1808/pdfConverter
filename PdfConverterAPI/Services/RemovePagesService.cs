using System.IO;
using iText.Kernel.Pdf;

namespace PdfConverterAPI.Services
{
    public class RemovePagesService
    {
        public byte[] RemovePages(byte[] file, List<int> pagesToRemove)
        {
            using (var inputStream = new MemoryStream(file))
            using (var reader = new PdfReader(inputStream))
            using (var outputStream = new MemoryStream())
            using (var writer = new PdfWriter(outputStream))
            using (var pdfDocument = new PdfDocument(reader, writer))
            {
                pagesToRemove.Sort((a, b) => b.CompareTo(a));

                foreach (var page in pagesToRemove)
                {
                    if (page > 0 && page <= pdfDocument.GetNumberOfPages())
                    {
                        pdfDocument.RemovePage(page);
                    }
                }

                pdfDocument.Close();
                return outputStream.ToArray();
            }
        }
    }
}
