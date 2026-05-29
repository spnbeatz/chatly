using Microsoft.AspNetCore.SignalR;

namespace Chatly.Hubs
{
    public class NotifyHub: Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;

            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(
                    Context.ConnectionId,
                    $"user-{userId}"
                );
            }

            await base.OnConnectedAsync();
        }
    }
}
