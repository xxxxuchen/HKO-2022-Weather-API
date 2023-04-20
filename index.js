const express = require("express");
const weatherController = require("./controllers/weatherController");
const summaryController = require("./controllers/summaryController");
const WeatherError = require("./helpers/errorClass");
const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//connect to MongoDB
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://mongodb/weather", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongodb connect successfully"))
  .catch((err) => {
    console.log("mongodb connection error", err);
    server.close(() => {
      process.exit(1);
    });
  });

//http://localhost:8000/weather/{temp}/YYYY/MM
app.get("/weather/temp/:year/:month", summaryController.getTemp);
app.get("/weather/humi/:year/:month", summaryController.getHumi);
app.get("/weather/rain/:year/:month", summaryController.getRain);

//http://localhost:8000/weather/YYYY/MM/DD
app
  .route("/weather/:year/:month/:day")
  .get(weatherController.getWeather)
  .post(weatherController.createWeather);

// any non matching routers
app.all("*", (req, res, next) => {
  next(new WeatherError(`Cannot ${req.method} ${req.originalUrl} !`, 404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

const server = app.listen(8000, () => {
  console.log("Weather app listening on port 8000!");
});
