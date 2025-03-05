using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PdfConverterAPI.Models.Responses;
using PdfConverterAPI.Services;

namespace PdfConverterAPI.Controllers
{
    [Route("api/format")]
    [ApiController]
    public class FormatABNTController : ControllerBase
    {
        private readonly WordFormattingService _wordFormattingService;

        public FormatABNTController(WordFormattingService wordFormattingService)
        {
            _wordFormattingService = wordFormattingService;
        }

        [HttpPost("abnt")]
        public async Task<IActionResult> FormatDocument(
            IFormFile file,
            [FromQuery] string? font,
            [FromQuery] int? fontSize,
            [FromQuery] int? lineSpacing
        )
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new ErrorResponse(400, "Nenhum arquivo enviado."));
            }

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);

            byte[] formattedDocument = _wordFormattingService.FormatWordDocument(
                memoryStream.ToArray(),
                font,
                fontSize,
                lineSpacing
            );

            return File(
                formattedDocument,
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Documento_Formatado.docx"
            );
        }
    }
}
