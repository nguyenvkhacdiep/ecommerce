namespace Ecommerce.Repositories.Models;

public class SaleCampaign
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string DiscountType { get; set; } = "Percent";
    public decimal DiscountValue { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<ProductSaleCampaign> ProductSaleCampaigns { get; set; }
        = new List<ProductSaleCampaign>();
}