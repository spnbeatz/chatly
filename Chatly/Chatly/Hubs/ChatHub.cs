
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using Chatly.Interfaces;
using Chatly.Controllers.DTOs;

namespace Chatly.Hubs
{
    [Authorize]
    public class ChatHub: Hub
    {
        private readonly IChatService _chatService;
        private readonly IMessageService _messageService;

        public ChatHub(IChatService chatService, IMessageService messageService)
        {
            _chatService = chatService;
            _messageService = messageService;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            Console.WriteLine("userId websokce: ", userId);

            var chats = await _chatService.GetUserChats(userId);

            foreach (var chatId in chats)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, chatId.ToString());
            }

            await base.OnConnectedAsync();
        }

        public async Task SendMessage(int chatId, string content)
        {
            var userId = Context.UserIdentifier;

            if (!await _chatService.IsUserInChat(userId, chatId))
                throw new Exception("Brak dostępu do chatu");

            var message = await _messageService.SaveMessage(chatId, userId, content);

            await Clients.Group(chatId.ToString()).SendAsync("ReceiveMessage", new ShowMessageDTO(message));
        }
    }
}
