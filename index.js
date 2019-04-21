import "babel-polyfill";
import Chart from "chart.js";


const meteoURL = "/xml.meteoservice.ru/export/gismeteo/point/140.xml";

async function loadCurrency() {
 
  const response = await fetch(meteoURL);
  const xmlTest = await response.text();
  const parser = new DOMParser();
  
  const temperatureData = parser.parseFromString(xmlTest, "text/xml"); 
  
  const rates = temperatureData.querySelectorAll("TEMPERATURE[max][min]");

  const dateData = parser.parseFromString(xmlTest, "text/xml"); 
  
  const dates = dateData.querySelectorAll("FORECAST[day][month][year][hour][tod][predict][weekday]");

  const result = Object.create(null);
  for (let i = 0; i < rates.length; i++) {

    const rateTag = rates.item(i);
    const rate = String( ( (1 * rateTag.getAttribute("max")) + (1 * rateTag.getAttribute("min")) ) / 2 );
    const dateTag = dates.item(i);
    const date = dateTag.getAttribute("hour");
    result[date] = rate;
  }
  return result;
}

async function loadCurrency1() {
  
  const response = await fetch(meteoURL);
  const xmlTest = await response.text();
  const parser = new DOMParser();
  

  const temperatureData = parser.parseFromString(xmlTest, "text/xml"); 
 
  const rates = temperatureData.querySelectorAll("HEAT[max][min]");
  const dateData = parser.parseFromString(xmlTest, "text/xml"); 
  
  const dates = dateData.querySelectorAll("FORECAST[day][month][year][hour][tod][predict][weekday]");

  const result = Object.create(null);
  for (let i = 0; i < rates.length; i++) {

    const rateTag = rates.item(i);
    const rate = String( ( (1 * rateTag.getAttribute("max")) + (1 * rateTag.getAttribute("min")) ) / 2 );
    const dateTag = dates.item(i);
    const date = dateTag.getAttribute("hour");
    result[date] = rate;
  }
  return result;
}

const buttonBuild = document.getElementById("btn");
const canvasCtx = document.getElementById("out").getContext("2d");
buttonBuild.addEventListener("click", async function() {
  const currencyData = await loadCurrency();

  const keys = Object.keys(currencyData);
  const plotData = keys.map(key => currencyData[key]);

  const currencyData1 = await loadCurrency1();
  const keys1 = Object.keys(currencyData1);
  const plotData1 = keys1.map(key => currencyData1[key]);

  const chartConfig = {
    type: "line",

    data: {
      labels: keys,
      datasets: [
        {
          label: "Температура",
          backgroundColor: "rgb(255, 200, 20)",
          borderColor: "rgb(180, 20, 0)",
          data: plotData
        },
        {
          label: "Температура по ощущениям",
          backgroundColor: "rgb(20, 130, 50)",
          borderColor: "rgb(10, 200, 50)",
          data: plotData1
        }
      ]
    }
  };

  if (window.chart) {
    chart.data.labels = chartConfig.data.labels;
    chart.data.datasets[0].data = chartConfig.data.datasets[0].data;
    chart.update({
      duration: 800,
      easing: "easeOutBounce"
    });
  } else {
    window.chart = new Chart(canvasCtx, chartConfig);
  }
  
});

function compare(a, b) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}
