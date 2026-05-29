using Chatly.Models;

namespace Chatly.Controllers.DTOs
{
    public class UpdateChatDTO
    {
        public string Name { get; set; } = string.Empty;
        public ChatPrivacy? ChatPrivacy { get; set; }

    }
}
