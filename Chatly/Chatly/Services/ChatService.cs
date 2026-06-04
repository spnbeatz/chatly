using Chatly.Models;
using System;
using Chatly.Interfaces;
using Chatly.Data;
using Microsoft.EntityFrameworkCore;
using Chatly.Controllers.DTOs;

namespace Chatly.Services
{
    public class ChatService: IChatService
    {
        private readonly ApplicationDbContext _context;

        public ChatService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ShowChatDTO?> GetChat(int id)
        {
            return await _context.Chat
                .Where(c => c.Id == id)
                .Select(c => new ShowChatDTO(c)
                {
                    Members = c.Participants
                        .Select(p => new MemberDTO(
                            p.User,
                            p.Role
                        ))
                        .ToList(),
                })
                .FirstOrDefaultAsync();
        }

        public async Task<int> CreateChat(string creatorId,CreateChatDTO dto)
        {
            var isDirectChat = dto.Participants.Count == 1;

            if (isDirectChat)
            {
                bool exists = await IsChatCreated(
                    dto.Participants[0],
                    creatorId
                );

                if (exists)
                    throw new InvalidOperationException(
                        "Chat already exists"
                    );
            }

            await using var transaction =
                await _context.Database.BeginTransactionAsync();

            try
            {
                var chat = new Chat
                {
                    Name = dto.Name,
                    Type = isDirectChat
                        ? ChatType.Direct
                        : ChatType.Group,
                    ChatPrivacy = dto.ChatPrivacy
                };

                _context.Chat.Add(chat);
                await _context.SaveChangesAsync();

                _context.Participant.Add(new Participant
                {
                    ChatId = chat.Id,
                    UserId = creatorId,
                    Role = "Admin"
                });

                foreach (var participantId in dto.Participants)
                {
                    _context.Participant.Add(new Participant
                    {
                        ChatId = chat.Id,
                        UserId = participantId,

                        Role = isDirectChat
                            ? "Admin"
                            : "Member"
                    });
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return chat.Id;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> UpdateChat(int id, UpdateChatDTO dto)
        {
            var chat = await _context.Chat.FindAsync(id);

            if (chat == null)
                throw new Exception("Chat not found");

            chat.Update(
                dto.Name, 
                dto.ChatPrivacy ?? chat.ChatPrivacy
            );

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task DeleteChat(int id)
        {
            var chat = await _context.Chat
                .Include(c => c.Participants)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (chat == null)
                throw new Exception("Chat not found");
            _context.Participant.RemoveRange(chat.Participants);
            _context.Chat.Remove(chat);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> LeaveChat(string userId, int chatId)
        {
            var member = await _context.Participant
                .FirstOrDefaultAsync(p =>
                    p.UserId == userId &&
                    p.ChatId == chatId
                );

            if (member == null)
                return false;

            _context.Participant.Remove(member);

            var hasParticipants = await _context.Participant
                .AnyAsync(p =>
                    p.ChatId == chatId &&
                    p.UserId != userId
                );

            if (!hasParticipants)
            {
                var chat = await _context.Chat
                    .FirstOrDefaultAsync(c => c.Id == chatId);

                if (chat != null)
                {
                    _context.Chat.Remove(chat);
                }
            }

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> IsChatCreated(string participant, string userId)
        {

            return await _context.Chat
                .AnyAsync(c =>
                    c.Type == ChatType.Direct &&
                    c.Participants.Count == 2 &&
                    c.Participants.Any(p => p.UserId == participant) &&
                    c.Participants.Any(p => p.UserId == userId)
                );
        }

        public async Task<bool> AddParticipant(string participantId, int chatId, string role)
        {
            Participant participant = new Participant()
            {
                UserId = participantId,
                ChatId = chatId,
                Role = role
            };

            _context.Participant.Add(participant);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> IsUserInChat(string userId, int chatId)
        {
            
            return await _context.Participant
                .AnyAsync(x => x.UserId == userId && x.ChatId == chatId);
        }


        public async Task<List<int>> GetUserChats(string userId)
        {
            return await _context.Participant
                .Where(x => x.UserId == userId)
                .Select(x => x.ChatId)
                .ToListAsync();
        }

        public async Task<List<ChatItemDto>> GetChats(string userId)
        {
            return await _context.Chat
                .Where(c => c.Participants.Any(p => p.UserId == userId))
                .Select(c => new ChatItemDto
                {
                    ChatId = c.Id,
                    Name = c.Name,
                    Type = c.Type,
                    User = c.Participants
                        .Where(p => p.UserId != userId)
                        .Select(p => new UserDto
                        {
                            Id = p.User.Id,
                            Email = p.User.Email,
                            AvatarUrl = p.User.AvatarUrl
                        })
                        .FirstOrDefault(),

                    LastMessage = c.Messages
                        .OrderByDescending(m => m.CreatedAt)
                        .Select(m => new LastMessageDto
                        {
                            Id = m.Id,
                            Content = m.Content,
                            CreatedAt = m.CreatedAt,
                            CreatedById = m.CreatedById,
                            ChatId = c.Id
                        })
                        .FirstOrDefault()
                })
                .ToListAsync();
        }

        public async Task<List<MemberDTO>> GetMembers(int chatId)
        {
            return await _context.Participant
                .Where(p => p.ChatId == chatId)
                .Select(p => new MemberDTO(p.User, p.Role) { ChatId = p.ChatId }).ToListAsync();
        }

        public async Task<List<ChatMiniDTO>> GetGroupChats(string name, string userId)
        {
            return await _context.Chat
                .Where(
                    c => c.Name.Contains(name) && 
                    c.Type == ChatType.Group &&
                    !c.Participants.Any(p => p.UserId == userId)
                    )
                .Select(c => new ChatMiniDTO(c)
                {
                    ParticipantsCount = c.Participants.Count()
                })
                .ToListAsync();
        }

        public async Task PromoteParticipant(int chatId, string participantId)
        {
            var participant = await _context.Participant
                .Where(p => p.ChatId == chatId && p.UserId == participantId)
                .FirstOrDefaultAsync();

            var currentRole = participant.Role;

            participant.Role = currentRole == "Admin" ? "Member" : "Admin";

            await _context.SaveChangesAsync();
        }
    }
}
