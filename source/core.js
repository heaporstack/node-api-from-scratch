import http from "node:http";

global.hasValue = (variable) => {
  return variable !== undefined && variable !== null;
};

global.utcDateString = () => {
  return new Date().toISOString().replace("T", " ").split("Z")[0];
};

const router = {
  middlewares: [],
  routes: {
    connect: {},
    delete: {},
    get: {},
    head: {},
    options: {},
    post: {},
    patch: {},
    put: {},
    trace: {}
  },
  connect: (uri, handler) => router.routes.connect[uri] = handler,
  delete: (uri, handler) => router.routes.delete[uri] = handler,
  get: (uri, handler) => router.routes.get[uri] = handler,
  head: (uri, handler) => router.routes.head[uri] = handler,
  options: (uri, handler) => router.routes.options[uri] = handler,
  post: (uri, handler) => router.routes.post[uri] = handler,
  patch: (uri, handler) => router.routes.patch[uri] = handler,
  put: (uri, handler) => router.routes.put[uri] = handler,
  trace: (uri, handler) => router.routes.trace[uri] = handler,
};

export default router;

const api = http.createServer(async (req, res) => {
  const method = req.method.toLowerCase();
  const endpoint = req.url;

  res.removeHeader("connection");
  res.removeHeader("content-length");
  res.removeHeader("content-type");
  res.removeHeader("date");
  res.removeHeader("keep-alive");
  res.removeHeader("transfer-encoding");

  const handler = router?.routes?.[method]?.[endpoint];
  if (!hasValue(handler)) {
    res.writeHead(404, {
      "date": new Date().getTime()
    });
    res.end();
    console.log(`${utcDateString()} ${method.toUpperCase()} ${endpoint} 404`);
  } else {
    try {
      await handler(req, res);
      console.log(`${utcDateString()} ${method.toUpperCase()} ${endpoint}`);
    } catch (err) {
      console.error(`${utcDateString()} ${method.toUpperCase()} ${endpoint} 500\n${err.stack}`);
      try {
        // try to set header 500
        res.writeHead(500, {
          "date": new Date().getTime()
        });
        res.end();
      } catch (err) {
        console.error(`${err.stack}`);
      }
    }
  }
});

const port = 3000;
api.listen(port);
