const next = require("next");

// note the "https" not "http" required module. You will get an error if trying to connect with https
const https = require("https");
const { parse } = require("url");

const fs = require("fs");

const hostname = "localhost";
const port = process.env.NEXT_PUBLIC_PORT || 3000;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev, hostname, port });

const sslOptions = {
    key: fs.readFileSync("./ssl/server.key"),
    cert: fs.readFileSync("./ssl/server.cert"),
};

const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = https.createServer(sslOptions, (req, res) => {
        // custom api middleware
        if (req.url.startsWith("/")) {
            return handle(req, res);
        } else {
            // Handle Next.js routes
            return handle(req, res);
        }
    });
    server.listen(port, (err) => {
        if (err) throw err;
        console.log("> Ready on https://localhost:" + port);
    });
});
