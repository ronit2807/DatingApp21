using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;
        private readonly IPhotoService photoService;

        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            this.photoService = photoService;
            this.mapper = mapper;
            this.userRepository = userRepository;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUser([FromQuery]UserParams userParams)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var user = await userRepository.GetUserByUsername(username);

            userParams.CurrentUser = user.UserName;
            if(string.IsNullOrEmpty(userParams.Gender)){
                userParams.Gender = user.Gender == "male"? "female":"male";
            }
            // var users = mapper.Map<IEnumerable<MemberDTO>>(await userRepository.GetAllUsersAsync());
            var users = await userRepository.GetAllUsersAsync(userParams);
            Response.AddPaginationHeader(users.CurrentPage,users.PageSize,users.TotalCount,users.TotalPages);
            var users2 = mapper.Map<IEnumerable<MemberDTO>>(users);
            return Ok(users2);
        }


        // [HttpGet("{id}")]
        // public async Task<ActionResult<AppUser>> GetUser(int id)
        // {
        //     return await userRepository.GetUserById(id);
        // }

        [HttpGet("{username}",Name ="GetUser")]
        
        public async Task<ActionResult<MemberDTO>> GetUser(string username)
        {
            var user = mapper.Map<MemberDTO>(await userRepository.GetUserByUsername(username));
            return user;
        }

        [HttpPut]
        public async Task<ActionResult<MemberUpdateDTO>> UpdateUser(MemberUpdateDTO memberUpdateDTO)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var user = await userRepository.GetUserByUsername(username);

            mapper.Map(memberUpdateDTO, user);
            userRepository.Update(user);

            if (await userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update.");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDTO>> AddPhoto(IFormFile file)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var user = await userRepository.GetUserByUsername(username);

            var result = await photoService.AddPhotoAsync(file);

            if(result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo {
                Url = result.SecureUrl.AbsoluteUri,
                publicId = result.PublicId
            };

            if(user.Photos.Count <= 0){
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if(await userRepository.SaveAllAsync()){
                // return mapper.Map<PhotoDTO>(photo);
                return CreatedAtRoute("GetUser",new {username = user.UserName},mapper.Map<PhotoDTO>(photo));
            }

            return BadRequest("Problem adding photo.");
            
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> setMainPhoto(int photoId){
            var username = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            AppUser user =await userRepository.GetUserByUsername(username);
            
            var photo = user.Photos.FirstOrDefault(x=>x.Id == photoId);

            if(photo.IsMain) return BadRequest("Image is already set to main.");

            var mainPhoto = user.Photos.FirstOrDefault(x=>x.IsMain == true);
            if(mainPhoto !=null) {
                mainPhoto.IsMain = false;
            }
            photo.IsMain = true;

            if(await userRepository.SaveAllAsync()){
                return NoContent();
            }

            return BadRequest();
        }

        [HttpDelete("delete-photo/{id}")]
        public async Task<ActionResult> DeletePhoto(int id){

            var username = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            AppUser user =await userRepository.GetUserByUsername(username);

            var photo = user.Photos.FirstOrDefault(x=>x.Id ==id);

            if(photo == null) return NotFound();
            if(photo.IsMain) return BadRequest("You cannot delete your main photo");
            // user.Photos.Remove(photo);

            if(photo.publicId != null){
                var result = await photoService.DeletePhotoAsync(photo.publicId);
                if(result.Error != null) return BadRequest();

            }

            user.Photos.Remove(photo);

            if(await userRepository.SaveAllAsync()){
                return Ok();
            }

            return BadRequest();


        }
    }
}