using Chatly.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using Chatly.Models;
using System.Security.Claims;
using System.Diagnostics;
using Chatly.Interfaces;

namespace Chatly.Hubs
{
    [Authorize]
    public class ChatHub: Hub
    {
        private readonly IChatService _chatService;

        public ChatHub(IChatService chatService)
        {
            _chatService = chatService;
        }

        // 🔹 Po połączeniu dodaj usera do wszystkich jego chatów
        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            Console.WriteLine($"userId websocket: {userId}");

            var chats = await _chatService.GetUserChats(userId);

            foreach (var chatId in chats)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, chatId.ToString());
            }

            await base.OnConnectedAsync();
        }

        // 🔹 Wysyłanie wiadomości
        public async Task SendMessage(int topicId, string content)
        {
            var userId = Context.UserIdentifier;

            //Walidacja danych przed wysłaniem wiadomości
            if (string.IsNullOrEmpty(userId))
                throw new HubException("User is not authenticated");

            if (string.IsNullOrWhiteSpace(content))
                throw new HubException("Message cannot be empty");

            // 1. znajdź chatId
            var chatId = await _chatService.GetChatIdFromTopic(topicId);

            // 2. walidacja
            if (!await _chatService.IsUserInChat(userId, chatId))
                throw new Exception("Brak dostępu do chatu");

            // 3. zapis
            var message = await _chatService.SaveMessage(topicId, userId, content);

            // 4. broadcast
            await Clients.Group(chatId.ToString()).SendAsync("ReceiveMessage", new
            {
                message.Id,
                message.TopicId,
                message.CreatedById,
                message.Content,
                message.CreatedAt,
                chatId
            });


        }
        // Dodawanie i usuwanie reakcji do wiadomości
        public async Task ToggleReaction(int messageId, ReactionType type)
        {
            var userId = Context.UserIdentifier;

            if (string.IsNullOrEmpty(userId))
                throw new HubException("User is not authenticated");

            var chatId = await _chatService.GetChatIdFromMessage(messageId);

            if (!await _chatService.IsUserInChat(userId, chatId))
                throw new HubException("Brak dostępu do chatu");

            var reaction = await _chatService.ToggleReaction(messageId, userId, type);

            await Clients.Group(chatId.ToString()).SendAsync("ReactionUpdated", new
            {
                MessageId = messageId,
                CreatedById = userId,
                Type = reaction?.Type.ToString(),
                Removed = reaction == null
            });
        }
    }
}
