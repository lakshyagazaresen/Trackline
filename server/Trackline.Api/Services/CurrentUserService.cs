using System.Security.Claims;

namespace Trackline.Api.Services;

public class CurrentUserService : ICurrentUserService
{
    private const string ObjectIdClaim =
        "http://schemas.microsoft.com/identity/claims/objectidentifier";

    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(
        IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string UserId
    {
        get
        {
            var user =
                _httpContextAccessor.HttpContext?.User;

            var userId =
                user?.FindFirstValue(ObjectIdClaim);

            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new InvalidOperationException(
                    "Authenticated user ID was not found."
                );
            }

            return userId;
        }
    }
}