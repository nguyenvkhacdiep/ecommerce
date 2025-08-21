using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Repositories.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<TokenUser> TokenUsers { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductImages> ProductImages { get; set; }
    public DbSet<CategoryProduct> CategoryProducts { get; set; }
    public DbSet<ProductReview> ProductReviews { get; set; }
    public DbSet<ProductReviewImage> ProductReviewImages { get; set; }
    public DbSet<ProductSaleCampaign> ProductSaleCampaigns { get; set; }
    public DbSet<SaleCampaign> SaleCampaign { get; set; }
    public DbSet<Shop> Shops { get; set; }
    public DbSet<ShopFollower> ShopFollowers { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderAddress> OrderAddresses { get; set; }
    public DbSet<OrderCharge> OrderCharges { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User → Role (Restrict)
        modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany(r => r.User)
            .HasForeignKey(u => u.RoleId)
            .OnDelete(DeleteBehavior.Restrict);

        // User ↔ Shop (1-1, Restrict)
        modelBuilder.Entity<User>()
            .HasOne(u => u.Shop)
            .WithOne(s => s.User)
            .HasForeignKey<Shop>(s => s.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Shop → Categories (Cascade)
        modelBuilder.Entity<CategoryProduct>()
            .HasOne(c => c.Shop)
            .WithMany(s => s.Categories)
            .HasForeignKey(c => c.ShopId)
            .OnDelete(DeleteBehavior.Cascade);

        // Shop → Products (Cascade delete)
        modelBuilder.Entity<Product>()
            .HasOne(p => p.Shop)
            .WithMany(s => s.Products)
            .HasForeignKey(p => p.ShopId)
            .OnDelete(DeleteBehavior.Cascade);

        // Category → Products (SetNull, không xóa Product)
        modelBuilder.Entity<Product>()
            .HasOne(p => p.CategoryProduct)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        // Product → ProductImages (Cascade)
        modelBuilder.Entity<ProductImages>()
            .HasOne(pi => pi.Product)
            .WithMany(p => p.Images)
            .HasForeignKey(pi => pi.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Product → ProductReviews (Cascade)
        modelBuilder.Entity<ProductReview>()
            .HasOne(pr => pr.Product)
            .WithMany(p => p.Reviews)
            .HasForeignKey(pr => pr.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // User → ProductReviews (Restrict)
        modelBuilder.Entity<ProductReview>()
            .HasOne(pr => pr.User)
            .WithMany(u => u.ProductReviews)
            .HasForeignKey(pr => pr.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // ProductReview → ProductReviewImages (Cascade)
        modelBuilder.Entity<ProductReviewImage>()
            .HasOne(pri => pri.ProductReview)
            .WithMany(pr => pr.Images)
            .HasForeignKey(pri => pri.ReviewId)
            .OnDelete(DeleteBehavior.Cascade);

        // Precision cho Product.Price
        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasPrecision(18, 2);

        // Precision cho Shop.Rating
        modelBuilder.Entity<Shop>()
            .Property(s => s.Rating)
            .HasPrecision(3, 2);

        modelBuilder.Entity<Order>()
            .HasMany(o => o.Items)
            .WithOne(i => i.Order)
            .HasForeignKey(i => i.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Order>()
            .HasMany(o => o.Charges)
            .WithOne(c => c.Order)
            .HasForeignKey(c => c.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Order>()
            .HasMany(o => o.Addresses)
            .WithOne(a => a.Order)
            .HasForeignKey(a => a.OrderId)
            .OnDelete(DeleteBehavior.Cascade);


        // Seed Roles
        modelBuilder.Entity<Role>().HasData(
            new Role
            {
                Id = Guid.Parse("8f3e1a29-2b6f-4c7a-91c0-1f2b3d4e5a6b"),
                Name = "Super Admin",
                CreatedAt = DateTime.Parse("2025-08-16T00:00:00Z")
            },
            new Role
            {
                Id = Guid.Parse("3d2f5b1c-7a8e-4b2d-9f1a-0c3d4e5f6b7a"),
                Name = "Admin",
                CreatedAt = DateTime.Parse("2025-08-16T00:00:00Z")
            },
            new Role
            {
                Id = Guid.Parse("5a1c2e3d-4b6f-7a8d-9e0f-1b2c3d4e5f6a"),
                Name = "Shop",
                CreatedAt = DateTime.Parse("2025-08-16T00:00:00Z")
            },
            new Role
            {
                Id = Guid.Parse("9e0f1a2b-3c4d-5e6f-7a8b-1c2d3e4f5a6b"),
                Name = "Customer",
                CreatedAt = DateTime.Parse("2025-08-16T00:00:00Z")
            }
        );
    }
}