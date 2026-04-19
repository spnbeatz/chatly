namespace Chatly.Models
{
    public class Reaction
    {
        public int Id { get; set; }
        public ReactionType Type { get; set; } = ReactionType.Like;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedById { get; set; }
        public User CreatedBy { get; set; }
        public int MessageId { get; set; }
        public Message Message { get; set; }

    }
}

public enum ReactionType
{
    Like,
    Dislike,
    Laugh,
    Sad,
    Angry
}