namespace PdfConverterAPI.Models;

public class CandidateDataModel
{
    public string Name { get; set; }
    public string RegistrationNumber { get; set; }
    public Dictionary<string, double> Scores { get; set; } = new();
    public double TotalScore { get; set; }
    public int Position { get; set; }
    public bool IsEliminated { get; set; }
    public string Status { get; set; }
}
