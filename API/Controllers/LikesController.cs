using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class LikesController : BaseApiController
    {
        private readonly IUserRepository userRepository;
        private readonly ILikesRepository likesRepository;
        public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
        {
            this.likesRepository = likesRepository;
            this.userRepository = userRepository;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var username1 = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var user = await userRepository.GetUserByUsername(username1);
            var sourceUserId = user.Id;
            var likedUser = await userRepository.GetUserByUsername(username);
            var SourceUser = await likesRepository.GetUserWithLikes(sourceUserId);

            if(likedUser == null) return NotFound();

            if(SourceUser.UserName == username) return BadRequest("You cannot like yourself");

            var userLike = await likesRepository.GetUserLike(sourceUserId,likedUser.Id);

            if(userLike != null) return BadRequest("You have already liked the user");

            userLike = new UserLike{
                SourceUserId = sourceUserId,
                LikedUserId = likedUser.Id
            };

            SourceUser.LikedUsers.Add(userLike);

            if(await userRepository.SaveAllAsync()){
                return Ok();
            }

            return BadRequest("Failed to like user");


        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetUserLikes([FromQuery]LikesParams likesParams)
        {
            var username1 = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var user = await userRepository.GetUserByUsername(username1);
            likesParams.UserId = user.Id;
            var users = await likesRepository.GetUserLikes(likesParams);
            Response.AddPaginationHeader(users.CurrentPage,users.PageSize,users.TotalCount,users.TotalPages);
            return Ok(users);
        }
    }
}