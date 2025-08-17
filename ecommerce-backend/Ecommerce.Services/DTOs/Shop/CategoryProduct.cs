namespace Ecommerce.Services.DTOs.Shop;

public class AddCategoryProductDto
{
    public string Name { get; set; } = null!;
    public Guid ShopId { get; set; }
}

public class EditCategoryProduct
{
    public string Name { get; set; } = null!;
}

public class CategoryProductResponseModel
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public Guid ShopId { get; set; }
}