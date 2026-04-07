// server.js

require("dotenv").config(); // temporary for testing
const http = require("http");
const utilsService = require("./services/utils.service");

async function startServer() {
	const PORT = Number(process.env.PORT);
	const server = http.createServer((req, res) => {
		if (!utilsService.validateCORS(req.headers.origin))
			return utilsService.sendJSON(res, 200, { ok: true, message: "Invalid CORS." });

		const url = new URL(req.url, `https://${req.headers.host}`);

		if (req.method === "GET" && url.pathname === "/api/index")
			return utilsService.sendJSON(res, 200, { ok: true, message: "Server OK." });

		return utilsService.sendJSON(res, 404, { ok: false, message: "Route not found." });
	});

	server.listen(PORT);
}

startServer();