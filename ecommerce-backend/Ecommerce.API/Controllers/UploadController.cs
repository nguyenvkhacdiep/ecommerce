using Ecommerce.Services.DTOs.FirebaseStorage;
using Ecommerce.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IFirebaseStorageService _firebaseStorage;

    public UploadController(IFirebaseStorageService firebaseStorage)
    {
        _firebaseStorage = firebaseStorage;
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Upload([FromForm] FileUploadRequest request)
    {
        if (request.File == null || request.File.Length == 0)
            return BadRequest("No file uploaded");

        using var stream = request.File.OpenReadStream();
        var response = await _firebaseStorage.UploadFileAsync(stream, request.File.FileName,
            request.File.ContentType);

        return Ok(response);
    }

    [HttpDelete("{fileName}")]
    public async Task<IActionResult> Delete(string fileName)
    {
        var result = await _firebaseStorage.DeleteFileAsync(fileName);
        if (!result)
            return NotFound(new { message = "File not found or delete failed" });

        return Ok(new { message = "File deleted successfully" });
    }
}