using Ecommerce.Services.Common;
using Ecommerce.Services.DTOs.Shop;

namespace Ecommerce.Services.Interfaces;

public interface IProductService
{
    Task<string> CreateProduct(Guid userId, CreateProductDto product);
    Task<string> EditProduct(Guid userId, Guid productId, EditProductDto product);
    Task<string> DeleteProduct(Guid userId, Guid productId);

    Task<PageList<ProductResponseModel>> GetAllProductsOfShop(Guid shopId,
        RequestParameters parameters);

    Task<ProductResponseModel> GetProduct(Guid productId);
    Task<string> MarkedOutOfStock(Guid userId, Guid productId);
    Task<string> Reviews(Guid userId, Guid productId, ReviewsProduct review);
    Task<string> EditReviews(Guid userId, Guid productId, ReviewsProduct review);
}