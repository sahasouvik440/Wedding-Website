Add-Type -TypeDefinition @"
using System;
using System.IO;
using System.Net;
using System.Threading;

public class SimpleHttpServer
{
    private HttpListener listener;
    private string rootDir;

    public SimpleHttpServer(string prefix, string root)
    {
        rootDir = root;
        listener = new HttpListener();
        listener.Prefixes.Add(prefix);
    }

    public void Start()
    {
        listener.Start();
        Console.WriteLine("Server running on " + rootDir);
        while (listener.IsListening)
        {
            try
            {
                var context = listener.GetContext();
                ThreadPool.QueueUserWorkItem(ProcessRequest, context);
            }
            catch {}
        }
    }

    private void ProcessRequest(object state)
    {
        var context = (HttpListenerContext)state;
        try
        {
            string urlPath = context.Request.Url.LocalPath;
            if (urlPath == "/" || string.IsNullOrEmpty(urlPath)) urlPath = "/index.html";
            string filePath = Path.Combine(rootDir, urlPath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

            if (File.Exists(filePath))
            {
                string ext = Path.GetExtension(filePath).ToLower();
                string mime = "application/octet-stream";
                if (ext == ".html") mime = "text/html; charset=utf-8";
                else if (ext == ".css") mime = "text/css; charset=utf-8";
                else if (ext == ".js") mime = "application/javascript; charset=utf-8";
                else if (ext == ".jpg" || ext == ".jpeg") mime = "image/jpeg";
                else if (ext == ".png") mime = "image/png";
                else if (ext == ".svg") mime = "image/svg+xml";
                else if (ext == ".mp3") mime = "audio/mpeg";

                context.Response.ContentType = mime;
                using (var fs = File.OpenRead(filePath))
                {
                    context.Response.ContentLength64 = fs.Length;
                    context.Response.StatusCode = 200;
                    fs.CopyTo(context.Response.OutputStream);
                }
            }
            else
            {
                context.Response.StatusCode = 404;
                byte[] notFound = System.Text.Encoding.UTF8.GetBytes("404 Not Found");
                context.Response.OutputStream.Write(notFound, 0, notFound.Length);
            }
        }
        catch {}
        finally
        {
            try { context.Response.OutputStream.Close(); } catch {}
        }
    }
}
"@

$server = New-Object SimpleHttpServer("http://localhost:8080/", $PSScriptRoot)
$server.Start()
