namespace PdfConverterAPI.Models;

public class ClassificationCriteriaModel
{
    public required string Profession { get; set; }
    public required List<string> Values { get; set; }
    public required string BasisAssessment { get; set; }
    public Dictionary<int, string>? TiebreakerCriterion { get; set; }
    public bool? EliminatedByZero { get; set; }
    public int? ElimitedByPercent { get; set; }
    public required int FullScore { get; set; }
}
