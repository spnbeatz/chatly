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

        public async Task<int> CreateChat(int participantsCount)
        {
            var chat = new Chat() { 
                Type = participantsCount > 1 ? ChatType.Group : ChatType.User
            };

            _context.Chat.Add(chat);
            await _context.SaveChangesAsync();

            return chat.Id;
        }

        public async Task<bool> IsChatCreated(string participant, string userId)
        {

            return await _context.Chat
                .AnyAsync(c =>
                    c.Type == ChatType.User &&
                    c.Participants.Count == 2 &&
                    c.Participants.Any(p => p.UserId == participant) &&
                    c.Participants.Any(p => p.UserId == userId)
                );
        }

        public async Task<bool> AddParticipant(string participantId, int chatId)
        {
            Participant participant = new Participant()
            {
                UserId = participantId,
                ChatId = chatId,
                Role = "Admin"
            };

            _context.Participant.Add(participant);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddTopic(string userId, int chatId)
        {
            Topic topic = new Topic()
            {
                Title = "Main",
                CreatedById = userId,
                ChatId = chatId,
            };

            _context.Topic.Add(topic);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsUserInChat(string userId, int chatId)
        {
            
            return await _context.Participant
                .AnyAsync(x => x.UserId == userId && x.ChatId == chatId);
        }

        public async Task<Message> SaveMessage(int topicId, string userId, string content)
        {
            var msg = new Message
            {
                TopicId = topicId,
                CreatedById = userId,
                Content = content
            };

            _context.Message.Add(msg);
            await _context.SaveChangesAsync();

            return msg;
        }
        public async Task<int> GetChatIdFromTopic(int topicId)
        {
            return await _context.Topic
                .Where(t => t.Id == topicId)
                .Select(t => t.ChatId)
                .FirstAsync();
        }

        public async Task<List<int>> GetUserChats(string userId)
        {
            return await _context.Participant
                .Where(x => x.UserId == userId)
                .Select(x => x.ChatId)
                .ToListAsync();
        }

        public async Task<List<ChatListDto>> GetChats(string userId)
        {
            var chats = await _context.Chat
                .Include(c => c.Participants)
                    .ThenInclude(p => p.User)
                .Include(c => c.Topics)
                    .ThenInclude(t => t.Messages)
                        .ThenInclude(m => m.CreatedBy)
                .Where(c => c.Participants.Any(p => p.UserId == userId))
                .ToListAsync();

            return chats.Select(c => new ChatListDto
            {
                ChatId = c.Id,
                Name = c.Name,

                OtherUser = c.Participants
                    .Where(p => p.UserId != userId)
                    .Select(p => new UserDto
                    {
                        Id = p.User.Id,
                        Email = p.User.Email,
                        AvatarUrl = p.User.AvatarUrl
                    })
                    .FirstOrDefault(),

                LastMessage = c.Topics
                    .SelectMany(t => t.Messages)
                    .OrderByDescending(m => m.CreatedAt)
                    .Select(m => new LastMessageDto
                    {
                        Id = m.Id,
                        Content = m.Content,
                        CreatedAt = m.CreatedAt,
                        CreatedById = m.CreatedById,
                        TopicId = m.TopicId,
                        ChatId = c.Id
                    })
                    .FirstOrDefault()
            }).ToList();
        }

        public async Task<List<TopicDTO>> GetChatTopics(int chatId)
        {
            return await _context.Topic
                .Where(t => t.ChatId == chatId)
                .Select(t => new TopicDTO()
                {
                    Id = t.Id,
                    Title = t.Title,
                    LastMessage = t.Messages
                        .OrderByDescending(m => m.CreatedAt)
                        .Select(m => new LastMessageDto()
                        {
                            Id = m.Id,
                            Content = m.Content,
                            CreatedAt = m.CreatedAt,
                            CreatedById = m.CreatedById,
                            TopicId = m.TopicId,
                            ChatId = chatId
                        })
                        .FirstOrDefault()
                })
                .ToListAsync();
        }

        public async Task<List<Message>> GetTopicMessages(int topicId)
        {
            var messages = await _context.Message
                .Where(m => m.TopicId == topicId)
                .Include(m => m.Reactions)
                .Take(20)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();

            return messages;
        }
    }
}
