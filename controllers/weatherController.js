const Weather = require("../model/weatherModel");
const WeatherError = require("../helpers/errorClass");
const checkDate = require("../helpers/checkDate");

exports.getWeather = async (req, res, next) => {
  try {
    const dateString = checkDate(req.params, next);
    if (!dateString) return;
    const weather = await Weather.findOne({ date: dateString });
    if (!weather) {
      return next(new WeatherError("not found", 404));
    }
    res.status(200).json({
      status: "200",
      data: weather,
    });
  } catch (err) {
    next(new WeatherError(err.message, 500));
  }
};

exports.createWeather = async (req, res, next) => {
  try {
    const dateString = checkDate(req.params, next);
    if (!dateString) return;
    const weather = await Weather.findOne({ date: dateString });
    if (weather) {
      console.log("duplicate record!!");
      next(new WeatherError("find an existing record. Cannot override!!", 403));
      return;
    }
    req.body.date = dateString;
    const newWeather = await Weather.create(req.body);
    res.status(200).json({
      status: "200",
      okay: "record added",
      data: newWeather,
    });
  } catch (err) {
    next(new WeatherError(err.message, 500));
  }
};
