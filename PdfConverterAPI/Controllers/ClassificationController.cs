using Microsoft.AspNetCore.Mvc;
using PdfConverterAPI.Models;
using PdfConverterAPI.Services;

namespace PdfConverterAPI.Controllers
{
    [ApiController]
    [Route("api/classification")]
    public class ClassificationController : ControllerBase
    {
        private readonly ClassificationService _classificationService;
        private readonly ExtractionService _extractionService;

        public ClassificationController(
            ClassificationService classificationService,
            ExtractionService extractionService
        )
        {
            _classificationService = classificationService;
            _extractionService = extractionService;
        }

        [HttpPost("extract-data")]
        public async Task<IActionResult> ExtractData([FromForm] IFormFile file)
        {
            if (file == null)
                return BadRequest("É necessário enviar um arquivo PDF.");

            var extractedData = await _extractionService.ProcessFiles(file);
            return Ok(extractedData);
        }

        [HttpPost("get-result")]
        public async Task<IActionResult> UploadPdf(
            [FromForm] IFormFile file,
            [FromForm] string requestJson
        )
        {
            if (file == null)
            {
                return BadRequest("Envie pelo menos UM arquivo PDF.");
            }

            if (string.IsNullOrEmpty(requestJson))
                return BadRequest("Os critérios de classificação são obrigatórios.");

            var request = System.Text.Json.JsonSerializer.Deserialize<ClassificationCriteriaModel>(
                requestJson
            );

            if (request == null)
                return BadRequest("Erro ao interpretar os critérios de classificação.");

            var classification = await _classificationService.ProcessFiles(file, request);
            return Ok(classification);
        }
    }
}
