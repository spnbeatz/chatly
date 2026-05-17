using Microsoft.AspNetCore.Identity;

namespace Chatly.Models
{
    public class User: IdentityUser
    {
        public List<Media> Media { get; set; } = new();
        public List<Reaction> Reactions { get; set; } = new();
        public List<Participant> ChatUsers { get; set; } = new();
        public List<Message> Messages { get; set; } = new();
        public string? AvatarUrl { get; set; } 
    }
}
