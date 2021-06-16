using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext context;
        public LikesRepository(DataContext context)
        {
            this.context = context;
        }

        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            return await context.Likes.FindAsync(sourceUserId,likedUserId);
        }

        public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
        {
            var users = context.Users.OrderBy(m=>m.UserName).AsQueryable();
            var likes = context.Likes.AsQueryable();

            if(likesParams.Predicate.Equals("Liked", StringComparison.InvariantCultureIgnoreCase))
            {
                likes = likes.Where(like=>like.SourceUserId == likesParams.UserId);
                users = likes.Select(like => like.LikedUser);
            }

            else if(likesParams.Predicate.Equals("LikedBy", StringComparison.InvariantCultureIgnoreCase))
            {
                likes = likes.Where(like=>like.LikedUserId == likesParams.UserId);
                users = likes.Select(like=>like.SourceUser);
            }

            var likedUsers= users.Select(user => new LikeDto{
                Username = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.GetAge(),
                City = user.City,
                Id = user.Id,
                PhotoUrl = user.Photos.FirstOrDefault(m=>m.IsMain == true).Url
            });

            return await PagedList<LikeDto>.CreateAsync(likedUsers,likesParams.PageNumber,likesParams.PageSize);
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await context.Users.Include(x=>x.LikedUsers).FirstOrDefaultAsync(m=>m.Id == userId);
        }
    }
}