using System.IO;
using Spire.Doc;

namespace PdfConverterAPI.Services
{
    public class WordToPdfService
    {
        public byte[] ConvertWordToPdf(byte[] wordBytes)
        {
            using (var inputStream = new MemoryStream(wordBytes))
            using (var outputStream = new MemoryStream())
            {
                var doc = new Document();
                doc.LoadFromStream(inputStream, FileFormat.Docx);
                doc.SaveToStream(outputStream, FileFormat.PDF);

                return outputStream.ToArray();
            }
        }
    }
}
