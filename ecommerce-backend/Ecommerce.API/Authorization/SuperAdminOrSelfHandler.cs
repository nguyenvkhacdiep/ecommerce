using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Ecommerce.API.Authorization;

public class SuperAdminOrSelfHandler : AuthorizationHandler<SuperAdminOrSelfRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        SuperAdminOrSelfRequirement requirement)
    {
        var httpContext = context.Resource as DefaultHttpContext ??
                          (context.Resource as AuthorizationFilterContext)?.HttpContext;

        var routeId = httpContext?.GetRouteValue("id")?.ToString();

        var userIdClaim =
            context.User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ??
            context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var roleClaim = context.User.FindFirst(ClaimTypes.Role)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
        {
            context.Fail();
            return Task.CompletedTask;
        }

        if (roleClaim == "Super Admin" || string.Equals(userIdClaim, routeId, StringComparison.OrdinalIgnoreCase))
            context.Succeed(requirement);
        else
            context.Fail();

        return Task.CompletedTask;
    }
}