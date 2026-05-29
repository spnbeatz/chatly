namespace Chatly.Models
{
    public class Request
    {
        public int Id { get; set; }

        public RequestType Type { get; set; }
        public RequestStatus Status { get; set; } = RequestStatus.Pending;

        public string FromUserId { get; set; } = null!;
        public virtual User FromUser { get; set; } = null!;

        public string? ToUserId { get; set; }
        public virtual User? ToUser { get; set; }

        public int? ChatId { get; set; }
        public virtual Chat? Chat { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? RespondedAt { get; set; }
    }

    public enum RequestType
    {
        FriendRequest,
        ChatInvite,
        ChatRequest
    }

    public enum RequestStatus
    {
        Pending,
        Accepted,
        Rejected
    }
}
