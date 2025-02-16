using iText.Kernel.Pdf;
using iText.Kernel.Utils;

namespace PdfConverterAPI.Services
{
    public class MergePdfService
    {
        public byte[] MergePdfs(List<byte[]> files)
        {
            using (var outputStream = new MemoryStream())
            {
                var writerProperties = new WriterProperties();
                writerProperties.SetCompressionLevel(9);
                writerProperties.SetStandardEncryption(
                    null,
                    null,
                    0,
                    EncryptionConstants.STANDARD_ENCRYPTION_40
                );

                using (var pdfWriter = new PdfWriter(outputStream, writerProperties))
                using (var pdfDocument = new PdfDocument(pdfWriter))
                {
                    var merger = new PdfMerger(pdfDocument);

                    foreach (var file in files)
                    {
                        using (var inputStream = new MemoryStream(file))
                        using (var reader = new PdfReader(inputStream))
                        using (var pdf = new PdfDocument(reader))
                        {
                            merger.Merge(pdf, 1, pdf.GetNumberOfPages());
                        }
                    }
                }

                return outputStream.ToArray();
            }
        }
    }
}
