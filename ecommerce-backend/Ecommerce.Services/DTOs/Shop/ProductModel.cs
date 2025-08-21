namespace Ecommerce.Services.DTOs.Shop;

public class CreateProductDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public bool AvailabilityStatus { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid ShopId { get; set; }
    public List<string> ImageUrls { get; set; } = new();
}

public class EditProductDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public bool AvailabilityStatus { get; set; }
    public Guid? CategoryId { get; set; }
    public List<string> ImageUrls { get; set; } = new();
}

public class ProductImagesResponse
{
    public Guid Id { get; set; }
    public string ImageUrl { get; set; } = null!;
    public bool IsPrimary { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ProductReviewImageResponse
{
    public Guid Id { get; set; }
    public Guid ReviewId { get; set; }
    public string ImageUrl { get; set; } = null!;
}

public class ProductReviewResponse
{
    public Guid Id { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<ProductReviewImageResponse> Images { get; set; } = new();
}

public class ProductResponseModel
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public bool AvailabilityStatus { get; set; }
    public double Rating { get; set; }
    public int SoldCount { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public CategoryProductResponseModel? CategoryProduct { get; set; }
    public List<ProductImagesResponse> Images { get; set; } = new();
    public List<ProductReviewResponse> Reviews { get; set; } = new();
}

public class ReviewsProduct
{
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public List<string> ImageUrls { get; set; } = new();
}