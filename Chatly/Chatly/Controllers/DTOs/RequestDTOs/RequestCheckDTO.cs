using Chatly.Models;

namespace Chatly.Controllers.DTOs
{
    public class RequestCheckDto
    {
        public int Id { get; set; }
        public RequestType Type { get; set; }
    }
}
