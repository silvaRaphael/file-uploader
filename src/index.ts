import { randomUUID } from "node:crypto";

Bun.serve({
	port: 4000,
	hostname: "0.0.0.0",
	async fetch(request, server) {
		const { method } = request;
		const {
			url: { pathname },
		} = server;

		try {
			if (method === "POST") {
				if (pathname === "/") {
					const data = await request.formData();

					const name = data.get("name");
					const file = data.get("file");

					if (!file) throw new Error("Must upload a file.");

					const fileKey = randomUUID()
						.concat("-")
						.concat(name?.toString() || "");

					await Bun.write("files/".concat(fileKey), file as unknown as Blob);

					return new Response(JSON.stringify({ fileKey }));
				}
			}

			if (method === "GET") {
				const fullParams = request.url.split("http://0.0.0.0:4000/");
				const params = fullParams.length ? fullParams[1].split("/") : [];

				if (params[0] === "files") {
					if (!params.length || !params[1]) throw new Error("");

					const file = Bun.file("files/".concat(params[1]));

					if (!file) throw new Error("");

					return new Response(file);
				}

				return new Response(null, { status: 404 });
			}
		} catch (error) {
			return new Response(JSON.stringify(error), { status: 404 });
		}

		return new Response();
	},
});

console.log(`🔥 Server is up on http://0.0.0.0:4000`);
