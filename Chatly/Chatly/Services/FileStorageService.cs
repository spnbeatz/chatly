using Chatly.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Chatly.Services
{
    public class FileStorageService : IFileStorageService
    {
        private readonly string _basePath;

        public FileStorageService(IWebHostEnvironment env)
        {
            _basePath = Path.Combine(env.WebRootPath, "files");
        }

        public async Task<string> SaveFileAsync(IFormFile file, string folder)
        {
            var folderPath = Path.Combine(_basePath, folder);

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var fullPath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/files/{folder}/{fileName}";
        }

        public async Task<string> SaveImageAsync(IFormFile file, string folder)
        {
            ValidateImage(file);

            return await SaveFileAsync(file, folder);
        }

        private void ValidateImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty");

            // max 2MB
            if (file.Length > 2 * 1024 * 1024)
                throw new ArgumentException("File too large (max 2MB)");

            var allowedMimeTypes = new[]
            {
                "image/jpeg",
                "image/png"
            };

            if (!allowedMimeTypes.Contains(file.ContentType))
                throw new ArgumentException("Invalid file type");

            var extension = Path.GetExtension(file.FileName).ToLower();

            var allowedExtensions = new[]
            {
                ".jpg", ".jpeg", ".png"
            };

            if (!allowedExtensions.Contains(extension))
                throw new ArgumentException("Invalid file extension");
        }
    }
}
