namespace Ecommerce.Repositories.Models;

public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string? Password { get; set; }
    public string Email { get; set; }
    public bool IsActive { get; set; }
    public string? UrlAvatar { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid RoleId { get; set; }
    public virtual Role Role { get; set; } = null!;
    public ICollection<TokenUser> TokenUsers { get; set; } = new List<TokenUser>();
    public virtual Shop? Shop { get; set; }

    public virtual ICollection<ProductReview> ProductReviews { get; set; } =
        new List<ProductReview>();
}