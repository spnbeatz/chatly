namespace Chatly.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedById { get; set; }
        public User CreatedBy { get; set; }
        public int TopicId { get; set; }
        public Topic Topic { get; set; }
        public List<Media> Media { get; set; }
        public List<Reaction> Reactions { get; set; }
    }
}