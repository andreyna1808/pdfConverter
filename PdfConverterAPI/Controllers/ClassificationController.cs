using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PdfConverterAPI.Services;

namespace PdfConverterAPI.Controllers
{
    [ApiController]
    [Route("api/classification")]
    public class ClassificationController : ControllerBase
    {
        private readonly ClassificationService _classificationService;

        public ClassificationController(ClassificationService classificationService)
        {
            _classificationService = classificationService;
        }

        [HttpPost("get-result")]
        public async Task<IActionResult> UploadPdf([FromForm] IFormFile[] files)
        {
            if (files.Length == 0 || files.Length > 2)
                return BadRequest("Envie um ou dois arquivos PDF.");

            var classification = await _classificationService.ProcessFiles(files);
            return Ok(classification);
        }
    }
}
