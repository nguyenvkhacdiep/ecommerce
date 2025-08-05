namespace Ecommerce.Services.DTOs.Users
{
    public class RoleModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}

