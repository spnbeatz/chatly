using Chatly.Data;
using Chatly.Models;
using Chatly.Controllers.DTOs;
using Microsoft.EntityFrameworkCore;
using Chatly.Interfaces;

namespace Chatly.Services
{
    public class RequestService : IRequestService
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public RequestService(
            ApplicationDbContext context,
            INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }
        

        public async Task CreateAsync(string fromUserId, CreateRequestDto dto)
        {
            var exists = await _context.Request.AnyAsync(r =>
                r.FromUserId == fromUserId &&
                r.ToUserId == dto.ToUserId &&
                r.Type == dto.Type &&
                r.ChatId == dto.ChatId &&
                r.Status == RequestStatus.Pending
            );

            if (exists)
            {
                throw new InvalidOperationException("Request already exists");
            }
            var request = new Request
            {
                FromUserId = fromUserId,
                ToUserId = dto.ToUserId,
                Type = dto.Type,
                ChatId = dto.ChatId,
                Status = RequestStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _context.Request.Add(request);
            await _context.SaveChangesAsync();

            var full = await _context.Request
                .Include(r => r.FromUser)
                .Include(r => r.ToUser)
                .Include(r => r.Chat)
                .FirstAsync(r => r.Id == request.Id);

            if(dto.ToUserId != null)
            {
                var (title, description, type) = BuildNotification(full);

                await _notificationService.CreateAndSendAsync(new CreateNotificationDto
                {
                    UserId = full.ToUserId,
                    Type = type,
                    Title = title,
                    Description = description,
                    ActionUrl = $"/requests/{full.Id}/accept"
                });
            }
            
        }

        public async Task<List<IncomingRequestDto>> GetIncomingAsync(string userId)
        {
            return await _context.Request
                .Include(r => r.FromUser)
                .Where(r => r.ToUserId == userId && r.Status == RequestStatus.Pending)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new IncomingRequestDto
                {
                    Id = r.Id,
                    Type = r.Type.ToString(),
                    ChatId = r.ChatId,
                    ChatName = r.Chat == null ? null : r.Chat.Name,
                    CreatedAt = r.CreatedAt,
                    FromUser = new UserMiniDto
                    {
                        Id = r.FromUser.Id,
                        Email = r.FromUser.Email,
                        AvatarUrl = r.FromUser.AvatarUrl
                    }
                })
                .ToListAsync();
        }

        public async Task<List<IncomingRequestDto>> GetChatIncomingAsync(int chatId)
        {
            return await _context.Request
                .Include(r => r.FromUser)
                .Where(r => r.ChatId == chatId && r.Status == RequestStatus.Pending)
                .Select(r => new IncomingRequestDto
                {
                    Id = r.Id,
                    Type = r.Type.ToString(),
                    ChatId = r.ChatId,
                    ChatName = (r.Chat == null) ? null : r.Chat.Name,
                    CreatedAt = r.CreatedAt,
                    FromUser = new UserMiniDto
                    {
                        Id = r.FromUser.Id,
                        Email = r.FromUser.Email,
                        AvatarUrl = r.FromUser.AvatarUrl
                    }
                })
                .ToListAsync();
        }

        public async Task<List<OutgoingRequestDto>> GetOutgoingAsync(string userId)
        {
            return await _context.Request
                .Where(r => r.FromUserId == userId && r.Status == RequestStatus.Pending)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new OutgoingRequestDto
                {
                    Id = r.Id,
                    Type = r.Type.ToString(),
                    Status = r.Status,
                    CreatedAt = r.CreatedAt,
                    ToUser = new UserMiniDto
                    {
                        Id = r.ToUser.Id,
                        Email = r.ToUser.Email,
                        AvatarUrl = r.ToUser.AvatarUrl
                    },
                    Chat = r.Chat != null ? new ChatMiniDTO(r.Chat) : null
                })
                .ToListAsync();
        }

        public async Task<RequestCheckDto> CheckRequested(int chatId, string userId)
        {
            return await _context.Request
                .Where(r =>
                    (r.FromUserId == userId || r.ToUserId == userId) &&
                    r.ChatId == chatId &&
                    r.Status == RequestStatus.Pending
                )
                .Select(r => new RequestCheckDto()
                {
                    Id = r.Id,
                    Type = r.Type

                })
                .FirstOrDefaultAsync();
        }

        public async Task<int?> AcceptAsync(int requestId, string userId)
        {
            var request = await _context.Request
                .Include(r => r.FromUser)
                .Include(r => r.ToUser)
                .FirstOrDefaultAsync(r => r.Id == requestId);

            if (request == null)
                throw new Exception("Invalid request");

            request.Status = RequestStatus.Accepted;
            request.RespondedAt = DateTime.UtcNow;

            int? chatId = null;

            switch (request.Type)
            {
                case RequestType.FriendRequest:
                    chatId = await HandleFriendRequest(request);
                    break;

                case RequestType.ChatInvite:
                    await HandleChatInvite(request);
                    break;

                case RequestType.ChatRequest:
                    await HandleChatJoinRequest(request);
                    break;
            }

            await _context.SaveChangesAsync();

            return chatId;
        }

        public async Task<bool> RejectAsync(int requestId, string userId)
        {
            var request = await _context.Request
                .FirstOrDefaultAsync(r =>
                    r.Id == requestId);

            if (request == null)
                return false;

            request.Status = RequestStatus.Rejected;
            request.RespondedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int requestId, string userId)
        {
            var request = await _context.Request
                .FirstOrDefaultAsync(r =>
                    r.Id == requestId &&
                    (r.FromUserId == userId || r.ToUserId == userId));

            if (request == null)
                return false;

            _context.Request.Remove(request);
            await _context.SaveChangesAsync();



            return true;
        }

        private static (
            string Title,
            string Description,
            NotificationType Type
        ) BuildNotification(Request request)
        {
            var email = request.FromUser?.Email ?? "User";
            var chatName = request.Chat?.Name ?? "chat";

            return request.Type switch
            {
                RequestType.FriendRequest => (
                    "Friend request",
                    $"{email} wants to be your friend",
                    NotificationType.FriendRequest
                ),

                RequestType.ChatInvite => (
                    "Chat invite",
                    $"{email} invited you to chat \"{chatName}\"",
                    NotificationType.ChatInvite
                ),

                _ => (
                    "New request",
                    $"{email} sent you a request",
                    NotificationType.System
                )
            };
        }

        private async Task<int> HandleFriendRequest(Request request)
        {
            var chat = new Chat
            {
                Type = ChatType.Direct,
                ChatPrivacy = ChatPrivacy.Private
            };

            _context.Chat.Add(chat);
            await _context.SaveChangesAsync();

            _context.Participant.AddRange(
                new Participant { ChatId = chat.Id, UserId = request.FromUserId, Role = "Admin" },
                new Participant { ChatId = chat.Id, UserId = request.ToUserId, Role = "Admin" }
            );

            await _notificationService.CreateAndSendAsync(new CreateNotificationDto
            {
                UserId = request.FromUserId,
                Type = NotificationType.FriendRequest,
                Title = "Friend Request Accepted",
                Description = $"{request.ToUser?.Email} accepted your friend request",
                ActionUrl = $"/requests/{request.Id}/accept"
            });

            return chat.Id;
        }

        private async Task HandleChatInvite(Request request)
        {
            _context.Participant.Add(new Participant
            {
                ChatId = request.ChatId!.Value,
                UserId = request.ToUserId,
                Role = "Member"
            });
        }

        private async Task HandleChatJoinRequest(Request request)
        {
            if (request.ChatId != null)
            {
                _context.Participant.Add(new Participant
                {
                    ChatId = (int)request.ChatId,
                    UserId = request.FromUserId,
                    Role = "Member"
                });

                await _notificationService.CreateAndSendAsync(new CreateNotificationDto
                {
                    UserId = request.FromUserId,
                    Type = NotificationType.ChatRequest,
                    Title = "Chat join request accepted",
                    Description = $"You have joined to {request.Chat.Name} chat.",
                    ActionUrl = $"/requests/{request.Id}/accept"
                });
            }


        }
    }
}