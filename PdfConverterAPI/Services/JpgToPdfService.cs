using System.IO;
using iText.IO.Image;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;

namespace PdfConverterAPI.Services
{
    public class JpgToPdfService
    {
        public byte[] ConvertJpgToPdf(byte[] imageBytes)
        {
            using (var outputStream = new MemoryStream())
            {
                var writer = new PdfWriter(outputStream);
                var pdfDocument = new PdfDocument(writer);
                var document = new Document(pdfDocument);

                var image = new Image(ImageDataFactory.Create(imageBytes));
                document.Add(image);

                document.Close();
                return outputStream.ToArray();
            }
        }
    }
}
