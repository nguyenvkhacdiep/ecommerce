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
    public static void ServiceConfiguration(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAutoMapper(cfg => { cfg.AddCollectionMappers(); },
            typeof(MappingProfile));

        services.AddSwaggerGen(c =>
        {
            c.OperationFilter<FileUploadOperationFilter>();

            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Nhập vào dạng: Bearer {token}"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });

            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Ecommerce API",
                Version = "1.0.0",
                Description = "API cho hệ thống thương mại điện tử",
                Contact = new OpenApiContact
                {
                    Name = "Your Name",
                    Email = "your.email@example.com"
                }
            });
        });


        services.Configure<JwtSettings>(
            configuration.GetSection("JwtSettings"));
        services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IShopService, ShopService>();
        services.AddScoped<ICategoryProductService, CategoryProductService>();
        services.AddScoped<IFirebaseStorageService, FirebaseStorageService>();
        services.AddScoped<JwtTokenGenerator>();
    }

    public static void RepositoryConfiguration(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IAuthRepository, AuthRepository>();
        services.AddScoped<ITokenUserRepository, TokenUserRepository>();
        services.AddScoped<IShopRepository, ShopRepository>();
        services.AddScoped<IShopFollowerRepository, ShopFollowerRepository>();
        services.AddScoped<ICategoryProductRepository, CategoryProductRepository>();
    }
}