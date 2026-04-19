namespace Chatly.Models
{
    public class Media
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }

        public int? MessageId { get; set; }
        public Message? Message { get; set; }

        public string? UserId { get; set; }
        public User? User { get; set; }
    }
}