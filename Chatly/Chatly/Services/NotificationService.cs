using Chatly.Controllers.DTOs;
using Chatly.Data;
using Chatly.Hubs;
using Chatly.Interfaces;
using Chatly.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Chatly.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<NotifyHub> _hub;

        public NotificationService(
            ApplicationDbContext context,
            IHubContext<NotifyHub> hub)
        {
            _context = context;
            _hub = hub;
        }

        public async Task<NotificationDto> CreateAsync(CreateNotificationDto dto)
        {
            var notification = new Notification
            {
                UserId = dto.UserId,
                Type = dto.Type,
                Title = dto.Title,
                Description = dto.Description,
                ActionUrl = dto.ActionUrl,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Notification.Add(notification);
            await _context.SaveChangesAsync();

            return Map(notification);
        }

        public async Task SendAsync(Notification notification)
        {
            await _hub.Clients
                .Group($"user-{notification.UserId}")
                .SendAsync("notification", Map(notification));
        }

        public async Task CreateAndSendAsync(CreateNotificationDto dto)
        {
            var notification = new Notification
            {
                UserId = dto.UserId,
                Type = dto.Type,
                Title = dto.Title,
                Description = dto.Description,
                ActionUrl = dto.ActionUrl,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Notification.Add(notification);
            await _context.SaveChangesAsync();

            await SendAsync(notification);
        }

        public async Task<List<NotificationDto>> GetUserNotifications(string userId)
        {
            return await _context.Notification
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NotificationDto
                {
                    Id = n.Id,
                    Type = n.Type.ToString(),
                    Title = n.Title,
                    Description = n.Description,
                    ActionUrl = n.ActionUrl,
                    IsRead = n.IsRead,
                    CreatedAt = n.CreatedAt
                })
                .ToListAsync();
        }

        public async Task MarkAsRead(int id, string userId)
        {
            var notification = await _context.Notification
                .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

            if (notification == null)
                return;

            notification.IsRead = true;

            await _context.SaveChangesAsync();
        }

        public async Task MarkAllAsRead(string userId)
        {
            var notifications = await _context.Notification
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            foreach (var n in notifications)
                n.IsRead = true;

            await _context.SaveChangesAsync();
        }
        private static NotificationDto Map(Notification n)
        {
            return new NotificationDto
            {
                Id = n.Id,
                Type = n.Type.ToString(),
                Title = n.Title,
                Description = n.Description,
                ActionUrl = n.ActionUrl,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            };
        }

    }
}
