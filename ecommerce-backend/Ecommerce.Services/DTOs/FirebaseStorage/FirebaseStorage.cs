using Microsoft.AspNetCore.Http;

namespace Ecommerce.Services.DTOs.FirebaseStorage;

public class FileUploadRequest
{
    public IFormFile File { get; set; }
}