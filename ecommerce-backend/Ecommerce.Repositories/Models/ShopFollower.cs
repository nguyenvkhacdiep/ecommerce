namespace Ecommerce.Repositories.Models;

public class ShopFollower
{
    public Guid Id { get; set; }

    public Guid ShopId { get; set; }
    public Guid UserId { get; set; }

    public DateTime FollowedAt { get; set; } = DateTime.UtcNow;

    public virtual Shop Shop { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}