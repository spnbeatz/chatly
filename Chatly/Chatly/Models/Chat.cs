
namespace Chatly.Models
{
    public class Chat
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<Participant> Participants { get; set; } = new();
        public List<Topic> Topics { get; set; } = new();
        public ChatType Type { get; set; } = ChatType.User;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum ChatType
    {
        User,
        Group
    }
}