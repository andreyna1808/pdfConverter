using iText.IO.Image;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Xobject;

namespace PdfConverterAPI.Services
{
    public class CompressPdfService
    {
        public byte[] CompressPdf(byte[] pdfBytes)
        {
            using (var inputStream = new MemoryStream(pdfBytes))
            using (var outputStream = new MemoryStream())
            {
                var reader = new PdfReader(inputStream);
                var writer = new PdfWriter(
                    outputStream,
                    new WriterProperties().SetCompressionLevel(9)
                );
                var pdfDoc = new PdfDocument(reader, writer);

                for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)
                {
                    var page = pdfDoc.GetPage(i);
                    var resources = page.GetResources();
                    var xObjects = resources.GetResource(PdfName.XObject);

                    if (xObjects != null)
                    {
                        foreach (var key in xObjects.KeySet())
                        {
                            var obj = xObjects.GetAsStream(key);
                            if (obj != null && obj.IsStream())
                            {
                                var xImage = new PdfImageXObject(obj);
                                var imageData = ImageDataFactory.Create(xImage.GetImageBytes());

                                var newImage = new PdfImageXObject(imageData);
                                xObjects.Put(key, newImage.GetPdfObject());
                            }
                        }
                    }
                }

                pdfDoc.Close();
                return outputStream.ToArray();
            }
        }
    }
}
