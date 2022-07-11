import axios from 'axios';
import { useEffect, useState } from 'react';
import './app.css';

function App() {
  const [data, setData] = useState({});

  const getAlerts = () => {
    console.log(data);
    if (data.alerts) {
      let id = 0;
      return data.alerts.alert.map((item) => {
        id++;
        if (item.msgtype === 'Alert') {
          return (
            <div className="alert-notif" key={id}>
              {item.event} - {item.areas}: {item.instruction}
            </div>
          );
        }
        return (
          <div key={id} className="alert-none">
            No Alert
          </div>
        );
      });
    }
  };

  const getForecast = () => {
    if (data.forecast) {
      return data.forecast.forecastday.map((e) => {
        return (
          <button key={e.date_epoch}>
            {new Date(e.date).toDateString()}
            <span className="temperatures">H: {e.day.maxtemp_f}</span>
            <span className="temperatures">L: {e.day.mintemp_f}</span>
          </button>
        );
      });
    }
    // else {
    //   let DATE_CURRENT = new Date();
    //   return (
    //     <div className="condensed-forecast">
    //       <button>{DATE_CURRENT.toDateString()}</button>
    //       <button>{(DATE_CURRENT.getDate() + 1).toDateString()}</button>
    //       <button>{(DATE_CURRENT.getDate() + 2).toDateString()}</button>
    //     </div>
    //   );
    // }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          'http://api.weatherapi.com/v1/forecast.json?key=54159b05af584cbfb53174253221107&q=New York City&days=7&aqi=no&alerts=yes'
        );
        setData(res.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="App">
      <div className="alerts">{getAlerts()}</div>
      <div className="condensed-forecast">{getForecast()}</div>
    </div>
  );
}

export default App;
