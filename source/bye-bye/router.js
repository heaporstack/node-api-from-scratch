import router from "#source/core.js";

router.get("/bye-bye", (req, res) => {
  res.writeHead(200, {
    "date": "xxx"
  });
  res.end();
});
