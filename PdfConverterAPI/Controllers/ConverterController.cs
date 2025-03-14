using Microsoft.AspNetCore.Mvc;
using PdfConverterAPI.Models.Responses;
using PdfConverterAPI.Services;

namespace PdfConverterAPI.Controllers
{
    [Route("api/converter")]
    [ApiController]
    public class ConverterController : ControllerBase
    {
        private readonly JpgToPdfService _jpgToPdfService;

        public ConverterController()
        {
            _jpgToPdfService = new JpgToPdfService();
        }

        [HttpPost("img-to-pdf")]
        public IActionResult ConvertJpgToPdf([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new ErrorResponse(400, "Nenhuma imagem foi enviada."));
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
