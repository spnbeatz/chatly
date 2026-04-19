namespace Chatly.Controllers.DTOs
{
    public class TopicDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public LastMessageDto LastMessage { get; set; }
        public int? Unread {  get; set; }
    }
}
