using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Chatly.Models;

namespace Chatly.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Chat> Chat {  get; set; }
        public DbSet<Media> Media { get; set; }
        public DbSet<Message> Message { get; set; }
        public DbSet<Participant> Participant { get; set; }
        public DbSet<Reaction> Reaction { get; set; }
        public DbSet<Topic> Topic { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Participant>()
                .HasKey(x => new { x.UserId, x.ChatId });

            modelBuilder.Entity<Participant>()
                .HasOne(x => x.User)
                .WithMany(x => x.ChatUsers)
                .HasForeignKey(x => x.UserId);

            modelBuilder.Entity<Participant>()
                .HasOne(x => x.Chat)
                .WithMany(x => x.Participants)
                .HasForeignKey(x => x.ChatId);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.CreatedBy)
                .WithMany(u => u.Messages)
                .HasForeignKey(m => m.CreatedById)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Topic)
                .WithMany(t => t.Messages)
                .HasForeignKey(m => m.TopicId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Topic>()
                .HasOne(t => t.Chat)
                .WithMany(c => c.Topics)
                .HasForeignKey(t => t.ChatId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Media>()
                .HasOne(m => m.Message)
                .WithMany(msg => msg.Media)
                .HasForeignKey(m => m.MessageId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Media>()
                .HasOne(m => m.User)
                .WithMany(u => u.Media)
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Participant>()
                .HasOne(x => x.Chat)
                .WithMany(x => x.Participants)
                .HasForeignKey(x => x.ChatId)
                .OnDelete(DeleteBehavior.NoAction);


        }
    }
}
