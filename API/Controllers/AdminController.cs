using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> userManager;
        public AdminController(UserManager<AppUser> userManager)
        {
            this.userManager = userManager;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult<AppUser[]>> GetUsersWithRoles()
        {
            var users = await userManager.Users.Include(u=>u.UserRoles)
            .ThenInclude(r=>r.Role)
            .OrderBy(u => u.UserName)
            .Select( u => new {
                u.Id,
                Username = u.UserName,
                Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
            })
            .ToListAsync();

            return Ok(users);
        }

        [Authorize(Policy = "ModeratorPhotoRole")]
        [HttpGet("photos-to-moderate")]
        public ActionResult GetPhotosForModeration()
        {
            return Ok("Only admin or moderators can see this");
        }

        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username,[FromQuery] string roles)
        {
            var selectedRoles = roles.Split(",").ToArray();
            var user = await userManager.FindByNameAsync(username);
            if(user == null) return NotFound("No user found");
            var userRoles = await userManager.GetRolesAsync(user);
            var result = await userManager.AddToRolesAsync(user,selectedRoles.Except(userRoles));

            if(!result.Succeeded) return BadRequest("Failed to add roles");
            result = await userManager.RemoveFromRolesAsync(user,userRoles.Except(selectedRoles));

            if(!result.Succeeded) return BadRequest("Failed to remove role");
            return Ok(await userManager.GetRolesAsync(user));
        }


    }
}