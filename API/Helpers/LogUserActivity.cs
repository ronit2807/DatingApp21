using System;
using System.Security.Claims;
using System.Threading.Tasks;
using API.interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            if(!resultContext.HttpContext.User.Identity.IsAuthenticated) return;
            var username = resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            //var userId = int.Parse(resultContext.HttpContext.User.FindFirst(ClaimTypes.Name).Value);
            var repo = resultContext.HttpContext.RequestServices.GetService<IUserRepository>();
            var user = await repo.GetUserByUsername(username);
            
            user.LastActive = DateTime.Now;
            await repo.SaveAllAsync();
        }
    }
}