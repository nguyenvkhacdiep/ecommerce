using AutoMapper;
using Ecommerce.Repositories.Models;
using Ecommerce.Services.DTOs.Users;

namespace Ecommerce.Services.Profiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserModel>();
        CreateMap<Role, RoleModel>();
        CreateMap<User, UserResponseModel>();
    }
}