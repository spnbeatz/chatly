using Chatly.Models;

namespace Chatly.Controllers.DTOs
{
    public class MemberDTO
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string AvatarUrl { get; set; }
        public string Role { get; set; }
        public int ChatId { get; set; }

        public MemberDTO() { }
        public MemberDTO(User user, string role)
        {
            Id = user.Id;
            Email = user.Email;
            AvatarUrl = user.AvatarUrl;
            Role = role;

        }
    }
}
