using System.Collections.Generic;
using System.IO;
using iText.IO.Image;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Kernel.Pdf.Xobject;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace PdfConverterAPI.Services
{
    public class PdfToJpgService
    {
        public List<byte[]> ConvertPdfToJpg(byte[] pdfBytes)
        {
            var images = new List<byte[]>();

            using (var inputStream = new MemoryStream(pdfBytes))
            {
                var pdfDoc = new PdfDocument(new PdfReader(inputStream));

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
                                var pdfImage = new PdfImageXObject(obj);
                                var imgData = pdfImage.GetImageBytes();

                                using (var image = Image.Load<Rgba32>(imgData))
                                {
                                    image.Mutate(x => x.Resize(image.Width, image.Height));

                                    using (var outputStream = new MemoryStream())
                                    {
                                        image.Save(outputStream, new JpegEncoder { Quality = 90 });
                                        images.Add(outputStream.ToArray());
                                    }
                                }
                            }
                        }
                    }
                }
                pdfDoc.Close();
            }

            return images;
        }
    }
}
