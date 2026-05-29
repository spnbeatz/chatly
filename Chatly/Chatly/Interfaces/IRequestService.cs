using Chatly.Controllers.DTOs;

namespace Chatly.Interfaces
{
    public interface IRequestService
    {
        Task CreateAsync(string fromUserId, CreateRequestDto dto);

        Task<List<IncomingRequestDto>> GetIncomingAsync(string userId);
        Task<List<IncomingRequestDto>> GetChatIncomingAsync(int chatId);

        Task<List<OutgoingRequestDto>> GetOutgoingAsync(string userId);

        Task<int?> AcceptAsync(int requestId, string userId);

        Task<bool> RejectAsync(int requestId, string userId);

        Task<bool> DeleteAsync(int requestId, string userId);
        Task<RequestCheckDto> CheckRequested(int chatId, string userId);
    }
}
