using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            this.mapper = mapper;
            this.userRepository = userRepository;

        }

        [HttpGet]

        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUser()
        {
            var users = mapper.Map<IEnumerable<MemberDTO>>(await userRepository.GetAllUsersAsync());
            return Ok(users);
        }


        // [HttpGet("{id}")]
        // public async Task<ActionResult<AppUser>> GetUser(int id)
        // {
        //     return await userRepository.GetUserById(id);
        // }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDTO>> GetUser(string username)
        {
            var user = mapper.Map<MemberDTO>(await userRepository.GetUserByUsername(username));
            return user;
        }
    }
}