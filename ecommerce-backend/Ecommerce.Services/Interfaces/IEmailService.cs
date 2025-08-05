namespace Ecommerce.Services.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true);
    Task SendAccountActivationEmailAsync(string toEmail, string username, string activationLink);
    Task SendForgotPasswordEmailAsync(string toEmail, string username, string resetLink);
}