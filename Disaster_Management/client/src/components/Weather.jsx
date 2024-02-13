import React, { useEffect, useRef, useState } from "react";
import Search from "../assets/search.png";
import clouds from "../assets/clouds.png";
import drizzle from "../assets/drizzle.png";
import humidity from "../assets/humidity.png";
import mist from "../assets/mist.png";
import rain from "../assets/rain.png";
import snow from "../assets/snow.png";
import wind from "../assets/wind.png";
import clear from "../assets/clear.png";

const Weather = () => {
  const apiKey = "4aa20621789ca336dbdb9ae9a3de6159";
  const apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
  const [search, setsearch] = useState("Mumbai");
  const [res, setRes] = useState();
  const [src, setsrc] = useState();

  useEffect(() => {
    // checkWeather("Satara").then((res) => setRes(res));
  }, []);

  async function checkWeather(city) {
    try {
      const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
      const data = await response.json();
      if (data.weather[0].main == "Clouds" || data.weather[0].main == "Smoke") {
        setsrc(clouds);
      } else if (data.weather[0].main == "Clear") {
        setsrc(clear);
      } else if (data.weather[0].main == "Rain") {
        setsrc(rain);
      } else if (data.weather[0].main == "Drizzle") {
        setsrc(drizzle);
      } else if (data.weather[0].main == "Mist") {
        setsrc(mist);
      }
      setsearch("");
      return data;
    } catch (error) {
      return response.error();
    }
  }
  return (
    <div class="relative w-full h-[420px] max-w-[870px] mx-auto bg-gradient-to-br from-[#1e4356] to-[rgba(30,67,86,0.5)] text-white rounded-lg p-10 text-center mt-20">
      <div className="text-center bg-gray-100 w-full h-[5.2rem] absolute z-10 -top-[5.2rem] flex items-center justify-center text-2xl font-bold text-black">
        Weather Index
      </div>
      <div class=" flex items-center justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => setsearch(e.target.value)}
          placeholder=""
          spellCheck={false}
          class="border-0 outline-none bg-teal-50 text-gray-700 px-6 py-2 h-12 rounded-full flex-1 mr-4 text-base"
        />
        <button
          onClick={() => checkWeather(search).then((res) => setRes(res))}
          class="border-0 outline-none bg-teal-50 rounded-full w-12 h-12 cursor-pointer"
        >
          <img src={Search} alt="Search" class="w-4 h-4" />
        </button>
      </div>
      <div class=" text-left ml-4 text-2xl mt-4 hidden">
        <p>Please Enter Correct City Name</p>
      </div>
      {res && (
        <div class="mt-8">
          <div className="flex items-center justify-around">
            <img src={src} alt="Rain" class=" w-[150px] h-32 " />
            <div>
              <h1 class="text-5xl font-semibold">{res.main.temp} °C</h1>
              <h2 class="text-3xl font-normal mt-2">{res.name}</h2>
            </div>
          </div>
          <div class=" flex items-center justify-between px-4 mt-10">
            <div class=" flex items-center text-left">
              <img src={humidity} alt="Humidity" class="w-10 mr-10" />
              <div>
                <p class=" text-2xl mt-1">{res.main.humidity} %</p>
                <p class="text-xs">Humidity</p>
              </div>
            </div>
            <div class=" flex items-center text-left">
              <img src={wind} alt="Wind" class="w-10 mr-10" />
              <div>
                <p class=" text-2xl mt-1">{res.wind.speed} kmph</p>
                <p class="text-xs">Wind Speed</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
