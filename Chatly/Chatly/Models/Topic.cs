namespace Chatly.Models
{
    public class Topic
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public List<Message> Messages { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedById { get; set; }
        public User CreatedBy { get; set; }
        public int ChatId { get; set; }
        public Chat Chat { get; set; }
    }
}