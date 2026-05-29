using Chatly.Models;

namespace Chatly.Controllers.DTOs
{
    public class ChatItemDto
    {
        public int ChatId { get; set; }
        public string Name { get; set; }

        public UserDto User { get; set; }
        public LastMessageDto LastMessage { get; set; }
        public ChatType Type { get; set; }
    }

    public class UserDto
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string AvatarUrl { get; set; }
    }

    public class LastMessageDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }

        public string CreatedById { get; set; }
        public int ChatId { get; set; }
        
    }
}
