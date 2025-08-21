using AutoMapper;
using Ecommerce.Repositories.Models;
using Ecommerce.Services.DTOs;
using Ecommerce.Services.DTOs.Shop;
using Ecommerce.Services.DTOs.Users;

namespace Ecommerce.Services.Profiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserModel>();
        CreateMap<Role, RoleModel>();
        CreateMap<User, UserResponseModel>();
        CreateMap<Shop, ShopResponseModel>();
        CreateMap<CategoryProduct, CategoryProductResponseModel>();
        CreateMap<Product, ProductResponseModel>();
        CreateMap<ProductImages, ProductImagesResponse>();
        CreateMap<Cart, CartResponseModel>();
        CreateMap<CartItem, CartItemResponseDto>()
            .ForMember(dest => dest.ProductName,
                opt => opt.MapFrom(src => src.Product.Name))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Product.Price))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src =>
                src.Product.Images.FirstOrDefault() != null
                    ? src.Product.Images.FirstOrDefault().ImageUrl
                    : null));
        ;
    }
}