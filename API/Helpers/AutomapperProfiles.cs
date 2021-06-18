using System.Linq;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers
{
    public class AutomapperProfiles : Profile
    {
        public AutomapperProfiles()
        {
            CreateMap<AppUser,MemberDTO>().ForMember(dest => dest.PhotoUrl,
            opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<Photo,PhotoDTO>();
            CreateMap<MemberUpdateDTO,AppUser>();
            CreateMap<RegisterUserDTO,AppUser>();
            CreateMap<Message,MessageDto>().
            ForMember(dest=>dest.SenderPhotoUrl,opt => opt.MapFrom(src=>
                src.Sender.Photos.FirstOrDefault(x=>x.IsMain).Url)).
            ForMember(dest => dest.RecipientPhotoUrl,opt=> opt.MapFrom
                (src => src.Recipient.Photos.FirstOrDefault(r=>r.IsMain).Url));
            

        }
    }
}