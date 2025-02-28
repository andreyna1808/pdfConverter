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
        public async Task<IActionResult> ExtractData([FromForm] List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
                return BadRequest("Envie pelo menos um arquivo PDF.");

            var extractedData = await _extractionService.ProcessFiles(files);
            return Ok(extractedData);
        }

        [HttpPost("get-result")]
        public async Task<IActionResult> UploadPdf(
            [FromForm] IFormFile[] files,
            [FromForm] string requestJson
        )
        {
            if (files.Length == 0)
                return BadRequest("Envie pelo menos um arquivo PDF.");

            if (string.IsNullOrEmpty(requestJson))
                return BadRequest("Os critérios de classificação são obrigatórios.");

            var request = System.Text.Json.JsonSerializer.Deserialize<ClassificationCriteriaModel>(
                requestJson
            );

            if (request == null)
                return BadRequest("Erro ao interpretar os critérios de classificação.");

            var classification = await _classificationService.ProcessFiles(files, request);
            return Ok(classification);
        }
    }
}
