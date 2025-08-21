namespace Ecommerce.Repositories.Models;

public class ProductReview
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public Guid UserId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public virtual Product Product { get; set; } = null!;
    public virtual User User { get; set; } = null!;

    public virtual ICollection<ProductReviewImage>? Images { get; set; } =
        new List<ProductReviewImage>();
}