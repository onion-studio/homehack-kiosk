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
    lowestTempForTomorrow: 0,
    dust: 0,
    fineDust: 0
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
    const reducer = (end, start = -1) => (acc, obj, index) => {
      if (index > start && index <= end) {
        if (acc < obj.fcstValue) {
          acc = obj.fcstValue;
        }
      }
      return acc;
    };
    const precipitationForToday = POP.reduce(reducer(5), 0);
    const skyForToday = SKY.reduce(reducer(5), 0);
    const highestTempForToday = TMX[0].fcstValue;
    const lowestTempForToday = TMN[0].fcstValue;
    const precipitationForTomorrow = POP.reduce(reducer(13, 5), 0);
    const skyForTomorrow = SKY.reduce(reducer(13, 5), 0);
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
  updateDustForecast = async () => {
    const res = await fetch("http://192.168.21.4:3030/weather/dust");
    const { dust, fineDust } = await res.json();
    this.setState({
      dust: parseInt(dust),
      fineDust: parseInt(fineDust)
    })
  }
  componentDidMount() {
    this.updateTime();
    this.updateSensor();
    this.updateWeatherForecast();
    this.updateDustForecast();
    this.timerId = setInterval(this.updateTime, 1000);
    this.sensorUpdaterId = setInterval(this.updateSensor, 10000);
    this.weatherUpdaterId = setInterval(this.updateWeatherForecast, 3600000);
    this.dustUpdaterId = setInterval(this.updateDustForecast, 1800000)
  }
  componentWillUnmount() {
    clearInterval(this.timerId);
    clearInterval(this.sensorUpdaterId);
    clearInterval(this.weatherUpdaterId);
    clearInterval(this.dustUpdaterId);
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
  getFineDust(state) {
    return state >= 75
      ? "매우 나쁨"
      : state >= 35
      ? "나쁨"
      : state >= 15
      ? "보통"
      : "좋음"
  }
  getClassForFineDust(state) {
    return state >= 75
      ? "lv4"
      : state >= 35
      ? "lv3"
      : state >= 15
      ? "lv2"
      : "lv1"
  }
  getDust(state) {
    return state >= 150
      ? "매우 나쁨"
      : state >= 80
      ? "나쁨"
      : state >= 30
      ? "보통"
      : "좋음"
  }
  getClassForDust(state) {
    return state >= 150
      ? "lv4"
      : state >= 80
      ? "lv3"
      : state >= 30
      ? "lv2"
      : "lv1"
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
      lowestTempForTomorrow,
      dust,
      fineDust
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
          <h1>
            {year}년 {month}월 {date}일 {day}요일
          </h1>
          <p className="current">
            {temp.toFixed(1)}℃ / {humid.toFixed(1)}%
          </p>
          <div className="App-weather">
            <section>
              <h2>오늘</h2>
              <p>{this.getSky(skyForToday)}</p>
              <p>
                {lowestTempForToday}℃ / {highestTempForToday}℃
              </p>
              <p>강수확률: {precipitationForToday}%</p>
            </section>
            <section>
              <h2>내일</h2>
              <p>{this.getSky(skyForTomorrow)}</p>
              <p>
                {lowestTempForTomorrow}℃ / {highestTempForTomorrow}℃
              </p>
              <p>강수확률: {precipitationForTomorrow}%</p>
            </section>
          </div>
          <div className="App-dust">
            <p>미세먼지: <span className={this.getClassForDust(dust)}>{this.getDust(dust)}</span> {dust}㎍/㎥</p>
            <p>초미세먼지: <span className={this.getClassForFineDust(fineDust)}>{this.getFineDust(fineDust)}</span> {fineDust}㎍/㎥</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
