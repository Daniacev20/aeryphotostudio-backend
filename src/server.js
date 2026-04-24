// server.js

const http = require("http");
const utilsService = require("./services/utils.service");
const initDB = require("./config/initdb");

async function startServer() {
	await initDB(); // init everything, including dotenv

	const PORT = Number(process.env.PORT);
	const routersFiles = await utilsService.getDirFilesPaths("routers");
	const routers = [];

	const server = http.createServer(async (req, res) => {
		if (!utilsService.validateCORS(req.headers.origin))
			utilsService.sendJSON(res, 200, { ok: true, message: "Invalid CORS." });

		for (const file of routersFiles) {
			if (!file.endsWith(".routes.js")) continue;
			
			const f = require(file);

			if (typeof f === "function")
				routers.push(f);
		}

		for (const router of routers)
			if (await router(req, res)) return;

		return utilsService.sendJSON(res, 404, { ok: false, message: "Route not found." });
	});

	server.listen(PORT);
}

startServer();