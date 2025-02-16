using Microsoft.AspNetCore.Mvc;
using PdfConverterAPI.Services;

namespace PdfConverterAPI.Controllers
{
    [Route("api/converter")]
    [ApiController]
    public class ConverterController : ControllerBase
    {
        private readonly JpgToPdfService _jpgToPdfService;
        private readonly WordToPdfService _wordToPdfService;

        public ConverterController()
        {
            _jpgToPdfService = new JpgToPdfService();
            _wordToPdfService = new WordToPdfService();
        }

        [HttpPost("img-to-pdf")]
        public IActionResult ConvertJpgToPdf([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Nenhuma imagem foi enviada.");
            }

            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);
                byte[] imageBytes = memoryStream.ToArray();
                byte[] pdfBytes = _jpgToPdfService.ConvertJpgToPdf(imageBytes);

                return File(pdfBytes, "application/pdf", "imagem_convertida.pdf");
            }
        }
    }
}
