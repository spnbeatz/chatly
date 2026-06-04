using Chatly.Controllers.DTOs;
using Chatly.Data;
using Chatly.Interfaces;
using Chatly.Models;
using Humanizer;
using Microsoft.EntityFrameworkCore;

namespace Chatly.Services
{
    public class MessageService: IMessageService
    {
        private readonly ApplicationDbContext _context;

        public MessageService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<ShowMessageDTO>> GetChatMessages(int chatId)
        {
            var messages = await _context.Message
                .Where(m => m.ChatId == chatId)
                .OrderByDescending(m => m.CreatedAt)
                .Take(20)
                .Select(m => new ShowMessageDTO(m))
                .ToListAsync();

            return messages;
        }

        public async Task<ShowMessageDTO> GetMessage(int id)
        {
            var message = await _context.Message
                .Where(m => m.Id == id)
                .Select(m => new ShowMessageDTO(m))
                .FirstOrDefaultAsync();

            return message;
        }

        public async Task<Message> SaveMessage(int chatId, string userId, string content)
        {
            var msg = new Message
            {
                ChatId = chatId,
                CreatedById = userId,
                Content = content,
                Status = MessageStatus.Active
            };

            _context.Message.Add(msg);
            await _context.SaveChangesAsync();

            return msg;
        }

        public async Task UpdateMessage(int messageId, UpdateMessageDTO dto)
        {
            var message = await _context.Message
            .FirstOrDefaultAsync(m => m.Id == messageId);

            if (message == null)
            {
                throw new Exception("No message to edit");
            }

                var updatedMessage = new Message()
                {
                    Id = messageId,
                    Content = dto.Content ?? message.Content,
                    CreatedAt = message.CreatedAt,
                    CreatedBy = message.CreatedBy,
                    UpdatedAt = DateTime.UtcNow,
                    ChatId = message.ChatId,
                    Status = MessageStatus.Edited
                };

            _context.Entry(updatedMessage).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }


        }

        public async Task DeleteMessage(int id)
        {
            var message = await _context.Message
                .FirstOrDefaultAsync(m => m.Id == id);

            if (message == null)
            {
                throw new Exception("No message to delete");
            }

            var updatedMessage = new Message()
            {
                Id = id,
                Content = message.Content,
                CreatedAt = message.CreatedAt,
                CreatedBy = message.CreatedBy,
                UpdatedAt = DateTime.UtcNow,
                ChatId = message.ChatId,
                Status = MessageStatus.Deleted
            };

            _context.Entry(updatedMessage).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }


        }
    }
}
