const fs = require("fs");
const http = require("http");
const path = require("path");

const root = path.resolve(__dirname, "..");
const allowedRoots = {
  "/site/": path.join(root, "site"),
  "/outputs/": path.join(root, "outputs"),
};

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type, "X-Content-Type-Options": "nosniff" });
  res.end(body);
}

function resolveRequest(urlPath) {
  const normalized = urlPath === "/" ? "/site/index.html" : decodeURIComponent(urlPath);
  for (const [prefix, directory] of Object.entries(allowedRoots)) {
    if (!normalized.startsWith(prefix)) continue;
    const relative = normalized.slice(prefix.length);
    const filePath = path.resolve(directory, relative || "index.html");
    if (!filePath.startsWith(directory + path.sep) && filePath !== directory) return null;
    return filePath;
  }
  return null;
}

const port = Number(process.env.PORT || 4173);

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const filePath = resolveRequest(url.pathname);
    if (!filePath) return send(res, 404, "Not found");

    fs.stat(filePath, (statError, stat) => {
      if (statError || !stat.isFile()) return send(res, 404, "Not found");
      const type = types[path.extname(filePath).toLowerCase()] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": type, "X-Content-Type-Options": "nosniff" });
      fs.createReadStream(filePath).pipe(res);
    });
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Preview: http://127.0.0.1:${port}/site/`);
  });
