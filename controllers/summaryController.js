const Weather = require("../model/weatherModel");
const WeatherError = require("../helpers/errorClass");
const checkDate = require("../helpers/checkDate");

const initSummaryObj = (dateString) => {
  const year = dateString.slice(0, 4);
  const month = dateString.slice(4);
  const summaryObj = { Year: year, Month: month };
  return summaryObj;
};

const getSummary = async (dateString, name) => {
  const regExpress = "^" + dateString;
  let [summary] = await Weather.aggregate([
    {
      $match: { date: { $regex: regExpress } },
    },
    {
      $group: {
        _id: null,
        [`Avg ${name}`]: { $avg: name === "Temp" ? "$meanT" : "$humidity" },
        [`Max ${name}`]: { $max: name === "Temp" ? "$maxT" : "$humidity" },
        [`Min ${name}`]: { $min: name === "Temp" ? "$minT" : "$humidity" },
      },
    },
    {
      $project: { _id: 0 },
    },
  ]);
  return summary;
};

exports.getTemp = async (req, res, next) => {
  try {
    const dateString = checkDate(req.params, next);
    if (!dateString) return;
    let tempSummary = await getSummary(dateString, "Temp");
    if (!tempSummary) {
      return next(new WeatherError("not found", 404));
    }
    tempSummary = { ...initSummaryObj(dateString), ...tempSummary };
    res.status(200).json({
      status: "200",
      data: tempSummary,
    });
  } catch (err) {
    next(new WeatherError(err.message, 500));
  }
};

exports.getHumi = async (req, res, next) => {
  try {
    const dateString = checkDate(req.params, next);
    if (!dateString) return;
    let humiSummary = await getSummary(dateString, "Humi");
    if (!humiSummary) {
      return next(new WeatherError("not found", 404));
    }
    humiSummary = { ...initSummaryObj(dateString), ...humiSummary };
    res.status(200).json({
      status: "200",
      data: humiSummary,
    });
  } catch (err) {
    next(new WeatherError(err.message, 500));
  }
};

exports.getRain = async (req, res, next) => {
  try {
    const dateString = checkDate(req.params, next);
    if (!dateString) return;
    const regExpress = "^" + dateString;
    let [rainSummary] = await Weather.aggregate([
      {
        $match: { date: { $regex: regExpress } },
      },
      {
        $group: {
          _id: null,
          "Avg Rainfull": { $avg: "$rain" },
          "Max Daily Rainfull": { $max: "$rain" },
        },
      },
      {
        $project: { _id: 0 },
      },
    ]);
    if (!rainSummary) {
      return next(new WeatherError("not found", 404));
    }
    rainSummary = { ...initSummaryObj(dateString), ...rainSummary };
    res.status(200).json({
      status: "200",
      data: rainSummary,
    });
  } catch (err) {
    next(new WeatherError(err.message, 500));
  }
};
