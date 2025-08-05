namespace Ecommerce.Repositories.Models;

public class Role
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    public virtual ICollection<User> User { get; set; } = new List<User>();
}