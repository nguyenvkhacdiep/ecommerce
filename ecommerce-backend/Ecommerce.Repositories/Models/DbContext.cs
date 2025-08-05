using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Repositories.Models;

public class AppDbContext : DbContext 
{
    public AppDbContext(DbContextOptions options): base(options){}
    
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
}