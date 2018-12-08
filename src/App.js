import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

const dayStrings = ["일", "월", "화", "수", "목", "금", "토"];
class App extends Component {
  state = {
    time: new Date(),
    temp: 0,
    humid: 0
  };
  updateTime = () => {
    this.setState({
      time: new Date()
    });
  };
  updateSensor = async () => {
    const res = await fetch("//localhost:3030");
    const [temp, humid] = await res.json();
    this.setState({ temp, humid });
  };
  componentDidMount() {
    this.updateTime();
    this.updateSensor();
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
    const hour = (time.getHours() % 12).toString().padStart(2, "0");
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
          <div>{temp.toFixed(1)}℃ / {humid.toFixed(1)}%</div>
          <div>TODO: 날씨, 작업</div>
        </div>
      </div>
    );
  }
}

export default App;
