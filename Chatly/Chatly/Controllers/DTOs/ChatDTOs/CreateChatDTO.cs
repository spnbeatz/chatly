using Chatly.Models;

namespace Chatly.Controllers.DTOs
{
    public class CreateChatDTO
    {
        public List<string> Participants { get; set; }
        public string? Name { get; set; }
        public ChatPrivacy ChatPrivacy { get; set; }
    }
}
