using Microsoft.AspNetCore.Mvc;
using PdfConverterAPI.Services;

namespace PdfConverterAPI.Controllers
{
    [Route("api/pdf")]
    [ApiController]
    public class PdfController : ControllerBase
    {
        private readonly MergePdfService _pdfService;
        private readonly RemovePagesService _removePagesService;
        private readonly CompressPdfService _compressPdfService;
        private readonly PdfToJpgService _pdfToJpgService;
        private readonly PdfToWordService _pdfToWordService;
        private readonly WordToPdfService _wordToPdfService;

        public PdfController()
        {
            _pdfService = new MergePdfService();
            _removePagesService = new RemovePagesService();
            _compressPdfService = new CompressPdfService();
            _pdfToJpgService = new PdfToJpgService();
            _pdfToWordService = new PdfToWordService();
            _wordToPdfService = new WordToPdfService();
        }

        [HttpPost("merge")]
        public async Task<IActionResult> MergePdfs([FromForm] List<IFormFile> files)
        {
            if (files == null || files.Count < 2)
                return BadRequest("Envie pelo menos dois arquivos PDF.");

            var pdfBytesList = new List<byte[]>();

            foreach (var file in files)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    pdfBytesList.Add(memoryStream.ToArray());
                }
            }

            var mergedPdf = _pdfService.MergePdfs(pdfBytesList);

            return File(mergedPdf, "application/pdf", "merged.pdf");
        }

        [HttpPost("remove-pages")]
        public IActionResult RemovePages([FromForm] IFormFile file, [FromForm] List<int> pages)
        {
            if (file == null || pages == null || pages.Count == 0)
                return BadRequest("Envie um arquivo PDF e pelo menos uma página para remover.");

            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);
                var pdfBytes = memoryStream.ToArray();
                var modifiedPdf = _removePagesService.RemovePages(pdfBytes, pages);
                return File(modifiedPdf, "application/pdf", "modified.pdf");
            }
        }

        [HttpPost("compress")]
        public IActionResult CompressPdf(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Arquivo inválido.");

            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);
                var compressedPdf = _compressPdfService.CompressPdf(memoryStream.ToArray());

                return File(compressedPdf, "application/pdf", "compressed.pdf");
            }
        }

        [HttpPost("pdf-to-jpg")]
        public IActionResult ConvertPdfToJpg(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Arquivo inválido.");

            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);
                var images = _pdfToJpgService.ConvertPdfToJpg(memoryStream.ToArray());

                var zipFile = new MemoryStream();
                using (
                    var archive = new System.IO.Compression.ZipArchive(
                        zipFile,
                        System.IO.Compression.ZipArchiveMode.Create,
                        true
                    )
                )
                {
                    for (int i = 0; i < images.Count; i++)
                    {
                        var entry = archive.CreateEntry($"page_{i + 1}.jpg");
                        using (var entryStream = entry.Open())
                        {
                            entryStream.Write(images[i], 0, images[i].Length);
                        }
                    }
                }

                zipFile.Position = 0;
                return File(zipFile.ToArray(), "application/zip", "converted_images.zip");
            }
        }

        [HttpPost("pdf-to-word")]
        public IActionResult ConvertPdfToWord([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Nenhum arquivo foi enviado.");
            }

            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);
                byte[] pdfBytes = memoryStream.ToArray();

                // Converte para Word
                byte[] wordBytes = _pdfToWordService.ConvertPdfToWord(pdfBytes);

                // Retorna como um arquivo .docx para download
                return File(
                    wordBytes,
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "arquivo_convertido.docx"
                );
            }
        }
    }
}
