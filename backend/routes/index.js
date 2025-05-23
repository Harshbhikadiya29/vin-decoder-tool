const vinRoutes = require("./vinRoutes.js");

const constructorMethod = (app) => {
  app.use("/api/vin", vinRoutes);
  app.use("/api/health", (req, res) => {
    return res.status(200).json({ status: "OK" });
  });

  app.use(/.*/, (req, res) => {
    return res.status(404).json({ error: "This route does not exist!" });
  });
};

module.exports = constructorMethod;
