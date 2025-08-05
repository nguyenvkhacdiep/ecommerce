public static class TemplateHelper
{
    public static string LoadTemplate(string path, Dictionary<string, string> replacements)
    {
        var html = File.ReadAllText(path);
        foreach (var (key, value) in replacements) html = html.Replace($"{{{{{key}}}}}", value);
        return html;
    }
}