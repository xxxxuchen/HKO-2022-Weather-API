# HKO-2022-Weather-API

This API provides information of Hong Kong weather in the year of 2022.

### Usage
- GET 
  - get all the weather information: http://localhost:8000/weather/YYYY/MM/DD
  - get the weather summary(temp, humidity or rainfall): http://localhost:8000/weather/{summary}/YYYY/MM
- POST
  - post the weather information of a specific date: http://localhost:8000/weather/YYYY/MM/DD
