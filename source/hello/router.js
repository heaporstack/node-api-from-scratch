import router from "#source/core.js";

router.get("/hello", async (req, res) => {
  res.writeHead(200, {
    "date": "yyy"
  });
  res.end();
});
