using System.ComponentModel.DataAnnotations;

namespace Chatly.Models
{
    public class Message
    {
        public int Id { get; set; }
        [MaxLength(255)]
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedById { get; set; }
        public virtual User? CreatedBy { get; set; }
        public int ChatId { get; set; }
        public virtual Chat Chat { get; set; }
        public MessageStatus Status { get; set; } = MessageStatus.Active;

    }

    public enum MessageStatus
    {
        Active,
        Edited,
        Deleted
    }
}
