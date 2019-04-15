import React, { Component } from "react";
import "./App.css";

const dayStrings = ["일", "월", "화", "수", "목", "금", "토"];
class App extends Component {
  state = {
    time: new Date(),
    temp: 0,
    humid: 0,
    precipitationForToday: 0,
    skyForToday: "",
    highestTempForToday: 0,
    lowestTempForToday: 0,
    precipitationForTomorrow: 0,
    skyForTomorrow: "",
    highestTempForTomorrow: 0,
    lowestTempForTomorrow: 0
  };
  updateTime = () => {
    this.setState({
      time: new Date()
    });
  };
  updateSensor = async () => {
    const res = await fetch("//localhost:3333");
    const [temp, humid] = await res.json();
    this.setState({ temp, humid });
  };
  updateWeatherForecast = async () => {
    const res = await fetch("http://192.168.21.4:3030/weather");
    const { POP, SKY, TMN, TMX } = await res.json();
    const precipitationForToday = POP.reduce((acc, obj, index) => {
      if (index <= 5) {
        if (acc < obj.fcstValue) {
          acc = obj.fcstValue;
        }
      }
      return acc;
    }, 0);
    const skyForToday = SKY.reduce((acc, obj, index) => {
      if (index <= 5) {
        if (acc < obj.fcstValue) {
          acc = obj.fcstValue;
        }
      }
      return acc;
    }, 0);
    const highestTempForToday = TMX[0].fcstValue;
    const lowestTempForToday = TMN[0].fcstValue;
    const precipitationForTomorrow = POP.reduce((acc, obj, index) => {
      if (index > 5 && index <= 13) {
        if (acc < obj.fcstValue) {
          acc = obj.fcstValue;
        }
      }
      return acc;
    }, 0);
    const skyForTomorrow = SKY.reduce((acc, obj, index) => {
      if (index > 5 && index <= 13) {
        if (acc < obj.fcstValue) {
          acc = obj.fcstValue;
        }
      }
      return acc;
    }, 0);
    const highestTempForTomorrow = TMX[1].fcstValue;
    const lowestTempForTomorrow = TMN[1].fcstValue;

    this.setState({
      precipitationForToday,
      skyForToday,
      highestTempForToday,
      lowestTempForToday,
      precipitationForTomorrow,
      skyForTomorrow,
      highestTempForTomorrow,
      lowestTempForTomorrow
    });
  };
  componentDidMount() {
    this.updateTime();
    this.updateSensor();
    this.updateWeatherForecast();
    this.timerId = setInterval(this.updateTime, 1000);
    this.sensorUpdaterId = setInterval(this.updateSensor, 10000);
  }
  componentWillUnmount() {
    clearInterval(this.timerId);
    clearInterval(this.sensorUpdaterId);
  }
  getSky(code) {
    return code === 1
      ? "맑음"
      : code === 2
      ? "구름 조금"
      : code === 3
      ? "구름 많음"
      : "흐림";
  }
  render() {
    const {
      time,
      temp,
      humid,
      precipitationForToday,
      skyForToday,
      highestTempForToday,
      lowestTempForToday,
      precipitationForTomorrow,
      skyForTomorrow,
      highestTempForTomorrow,
      lowestTempForTomorrow
    } = this.state;
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const date = time.getDate();
    const hour = time
      .getHours()
      .toString()
      .padStart(2, "0");
    const minute = time
      .getMinutes()
      .toString()
      .padStart(2, "0");
    const day = dayStrings[time.getDay()];
    return (
      <div className="App">
        <div className="App-wall" />
        <div className="App-info">
          <div className="App-clock">
            {hour}:{minute}
          </div>
          <div>
            {year}년 {month}월 {date}일 {day}요일
          </div>
          <div>
            {temp.toFixed(1)}℃ / {humid.toFixed(1)}%
          </div>
          <div className="App-weather">
            <div>
              <div>오늘</div>
              <div>{this.getSky(skyForToday)}</div>
              <div>
                {lowestTempForToday}℃ / {highestTempForToday}℃
              </div>
              <div>강수확률: {precipitationForToday}%</div>
            </div>
            <div>
              <div>내일</div>
              <div>{this.getSky(skyForTomorrow)}</div>
              <div>
                {lowestTempForTomorrow}℃ / {highestTempForTomorrow}℃
              </div>
              <div>강수확률: {precipitationForTomorrow}%</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
