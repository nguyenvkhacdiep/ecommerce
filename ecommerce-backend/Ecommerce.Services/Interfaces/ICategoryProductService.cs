using Ecommerce.Services.Common;
using Ecommerce.Services.DTOs.Shop;

namespace Ecommerce.Services.Interfaces;

public interface ICategoryProductService
{
    Task<string> AddCategory(Guid userId, AddCategoryProductDto addShopDto);
    Task<string> EditCategory(Guid userId, Guid categoryId, EditCategoryProduct addShopDto);
    Task<string> DeleteCategory(Guid userId, Guid categoryId);

    Task<PageList<CategoryProductResponseModel>> GetAllCategories(Guid shopId,
        RequestParameters parameter);

    Task<CategoryProductResponseModel> GetCategory(Guid categoryId);
}