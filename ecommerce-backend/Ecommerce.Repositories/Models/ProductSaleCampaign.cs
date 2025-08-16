namespace Ecommerce.Repositories.Models;

public class ProductSaleCampaign
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public Guid ProductId { get; set; }
    public Guid SaleCampaignId { get; set; }

    public virtual Product Product { get; set; } = null!;
    public virtual SaleCampaign SaleCampaign { get; set; } = null!;
}