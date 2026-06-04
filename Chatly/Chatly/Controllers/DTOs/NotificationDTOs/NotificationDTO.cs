using System.ComponentModel.DataAnnotations;

namespace Chatly.Controllers.DTOs
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;
        [MaxLength(100)]
        public string Description { get; set; } = string.Empty;

        public string? ActionUrl { get; set; }

        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}