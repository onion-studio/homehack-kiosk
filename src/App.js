import React, { Component } from "react";
import "./App.css";

const dayStrings = ["일", "월", "화", "수", "목", "금", "토"];
class App extends Component {
  state = {
    time: new Date(),
    temp: 0,
    humid: 0,
    highestTempForecast: 0,
    lowestTempForecast: 0,
    rainPercentForecast: 0
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
  // FIXME: CORS 이슈 => 서버 쪽에서 해결 후 다시 보는 것으로.
  // updateWeatherForecast = async () => {
  //   const date = "20190402";
  //   const baseTime = "0500";
  //   const serviceKey =
  //     "M1H2H0qNrZAPKGCU1Jpba5Pwfnf%2FI23wWwqDCvaKxoO3TmuN2lul8NG1NF7DmC1LxByhjgb8RrcZDhS7r6mVwA%3D%3D";
  //   const locationX = "59";
  //   const locationY = "125";
  //   const numOfRows = "10";
  //   const url = `http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData?serviceKey=${serviceKey}&base_date=${date}&base_time=${baseTime}&nx=${locationX}&ny=${locationY}&numOfRows=${numOfRows}&_type=json`;
  //   const res = await fetch(url, { cors: true });
  //   console.log(res.body.item);
  // };
  componentDidMount() {
    this.updateTime();
    this.updateSensor();
    // this.updateWeatherForecast();
    this.timerId = setInterval(this.updateTime, 1000);
    this.sensorUpdaterId = setInterval(this.updateSensor, 10000);
  }
  componentWillUnmount() {
    clearInterval(this.timerId);
    clearInterval(this.sensorUpdaterId);
  }
  render() {
    const { time, temp, humid } = this.state;
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
          <div>
            <div>오늘의 최저 기온: {}</div>
            <div>오늘의 최고 기온: {}</div>
            <div>강수 확률: {}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
