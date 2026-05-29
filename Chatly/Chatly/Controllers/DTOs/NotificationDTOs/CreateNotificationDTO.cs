using Chatly.Models;

namespace Chatly.Controllers.DTOs
{
    public class CreateNotificationDto
    {
        public string UserId { get; set; } = null!;
        public NotificationType Type { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public string? ActionUrl { get; set; }
    }
}