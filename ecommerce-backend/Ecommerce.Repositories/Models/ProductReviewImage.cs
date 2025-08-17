namespace Ecommerce.Repositories.Models;

public class ProductReviewImage
{
    public Guid Id { get; set; }
    public Guid ReviewId { get; set; }

    public string ImageUrl { get; set; } = null!;

    public virtual ProductReview ProductReview { get; set; } = null!;
}