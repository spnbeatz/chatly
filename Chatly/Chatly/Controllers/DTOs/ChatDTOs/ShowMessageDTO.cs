using Chatly.Models;

namespace Chatly.Controllers.DTOs
{
    public class ShowMessageDTO
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string CreatedById { get; set; }
        public int ChatId { get; set; }
        public bool IsPinned { get; set; }
        public MessageStatus Status { get; set; }

        public ShowMessageDTO() { }
        public ShowMessageDTO(Message message)
        {
            Id = message.Id;
            Content = message.Content;
            CreatedAt = message.CreatedAt;
            UpdatedAt = message.UpdatedAt;
            CreatedById = message.CreatedById;
            ChatId = message.ChatId;
            IsPinned = message.IsPinned;
            Status = message.Status;

        }
    }
}
