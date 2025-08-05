namespace Ecommerce.Base.Exceptions;

public class BadRequestException : Exception
{
    public BadRequestException(string message, Dictionary<string, string[]>? errors = null) : base(message)
    {
        Errors = errors;
    }

    public Dictionary<string, string[]>? Errors { get; }
}