
namespace Chatly.Models
{
    public class Chat
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<Participant> Participants { get; set; } = new();
        public List<Message> Messages { get; set; } = new();
        public ChatType Type { get; set; } = ChatType.Direct;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt {  get; set; } = DateTime.UtcNow;
        public ChatPrivacy ChatPrivacy { get; set; }

        public void Update(string name, ChatPrivacy Privacy)
        {
            Name = name;
            UpdatedAt = DateTime.UtcNow;
            ChatPrivacy = Privacy;
        }
    }

    public enum ChatType
    {
        Direct,
        Group
    }

    public enum ChatPrivacy
    {
        Public,
        Private
    }
}