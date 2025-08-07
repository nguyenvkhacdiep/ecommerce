using AutoMapper.EquivalencyExpression;
using Ecommerce.Base.Helpers;
using Ecommerce.Repositories.Interfaces;
using Ecommerce.Repositories.Models;
using Ecommerce.Repositories.Repositories;
using Ecommerce.Services.Interfaces;
using Ecommerce.Services.Profiles;
using Ecommerce.Services.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;
using JwtSettings = Ecommerce.Services.Services.JwtSettings;

namespace Ecommerce.API.Extensions;

public static class ServiceExtensions
{
    public static void ServiceConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAutoMapper(cfg => { cfg.AddCollectionMappers(); }, typeof(MappingProfile));

        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Ecommerce API",
                Version = "v1",
                Description = "API cho hệ thống thương mại điện tử",
                Contact = new OpenApiContact
                {
                    Name = "Your Name",
                    Email = "your.email@example.com"
                }
            });
        });

        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IAuthService, AuthService>();
        services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));
        services.AddScoped<JwtTokenGenerator>();
        services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
    }

    public static void RepositoryConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IAuthRepository, AuthRepository>();
    }
}