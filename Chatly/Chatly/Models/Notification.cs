namespace Chatly.Models
{
    public class Notification
    {
        public int Id { get; set; }

        public string UserId { get; set; } = null!;
        public virtual User User { get; set; } = null!;

        public NotificationType Type { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ActionUrl { get; set; }

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum NotificationType
    {
        FriendRequest,
        ChatInvite,
        ChatRequest,
        Message,
        System
    }
}