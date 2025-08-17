using Ecommerce.Services.Common;
using Ecommerce.Services.DTOs.Shop;

namespace Ecommerce.Services.Interfaces;

public interface IShopService
{
    Task<string> AddShop(AddShopDto addShopDto);
    Task<PageList<ShopResponseModel>> GetAllShops(RequestParameters shopParameters);
    Task<ShopResponseModel> GetShopById(Guid id);
    Task<string> EditShop(Guid shopId, EditShopDto shopDto);
    Task<string> ChangeTypeShop(Guid shopId, EditTypeShopDto shopDto);
    Task<string> DeleteShop(Guid shopId);
    Task<string> FollowShop(Guid shopId, Guid userId);
}