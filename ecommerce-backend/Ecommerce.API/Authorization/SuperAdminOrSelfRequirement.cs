using Microsoft.AspNetCore.Authorization;

namespace Ecommerce.API.Authorization;

public class SuperAdminOrSelfRequirement : IAuthorizationRequirement
{
}