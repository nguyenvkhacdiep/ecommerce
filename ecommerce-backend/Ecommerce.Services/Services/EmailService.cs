using Ecommerce.Services.Interfaces;
using Ecommerce.Services.Profiles;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Ecommerce.Services.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public EmailService(IOptions<EmailSettings> options)
    {
        _settings = options.Value;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = subject;

        email.Body = new TextPart(isHtml ? "html" : "plain") { Text = body };

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(_settings.SmtpServer, _settings.Port, SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_settings.Username, _settings.Password);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }

    public async Task SendAccountActivationEmailAsync(string toEmail, string username, string activationLink)
    {
        var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "ActivateAccountTemplate.html");
        var replacements = new Dictionary<string, string>
        {
            { "USERNAME", username },
            { "ACTIVATION_LINK", activationLink },
            { "APP_NAME", "Ecommerce System" },
            { "YEAR", DateTime.UtcNow.Year.ToString() }
        };

        var html = TemplateHelper.LoadTemplate(templatePath, replacements);

        await SendEmailAsync(toEmail, "Activate Your Account", html);
    }

    public async Task SendForgotPasswordEmailAsync(string toEmail, string username, string resetLink)
    {
        var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "ResetPasswordTemplate.html");
        var replacements = new Dictionary<string, string>
        {
            { "USERNAME", username },
            { "RESET_LINK", resetLink },
            { "APP_NAME", "Ecommerce System" },
            { "YEAR", DateTime.UtcNow.Year.ToString() }
        };

        var html = TemplateHelper.LoadTemplate(templatePath, replacements);

        await SendEmailAsync(toEmail, "Activate Your Account", html);
    }
}