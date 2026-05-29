using Chatly.Controllers.DTOs;
using Chatly.Models;

namespace Chatly.Interfaces
{
    public interface INotificationService
    {
        Task<NotificationDto> CreateAsync(CreateNotificationDto dto);

        Task SendAsync(Notification notification);

        Task CreateAndSendAsync(CreateNotificationDto dto);

        Task<List<NotificationDto>> GetUserNotifications(string userId);

        Task MarkAsRead(int id, string userId);

        Task MarkAllAsRead(string userId);
    }
}
