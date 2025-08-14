namespace Ecommerce.Repositories.Models;

public class TokenUser
{
    public Guid Id { get; set; }
    public string Token { get; set; }
    public string Type { get; set; }
    public DateTime? ExpiredAt { get; set; }
    public bool IsUsed { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UsedAt { get; set; }

    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
}