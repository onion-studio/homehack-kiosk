import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const dayStrings = ['일', '월', '화', '수', '목', '금', '토']
class App extends Component {
  state = {
    time: new Date(),
    temp: 0,
    humid: 0
  }
  updateTime = () => {
    this.setState({
      time: new Date()
    })
  }
  updateSensor = async () => {
    const res = await fetch('//localhost:3030')
    const [temp, humid] = await res.json()
    this.setState({temp, humid})
  }
  componentDidMount() {
    this.updateTime()
    this.updateSensor()
    this.timerId = setInterval(this.updateTime, 1000)
    this.sensorUpdaterId = setInterval(this.updateSensor, 60000)
  }
  componentWillUnmount() {
    clearInterval(this.timerId)
    clearInterval(this.sensorUpdaterId)
  }
  render() {
    const {time, temp, humid} = this.state
    const year = time.getFullYear()
    const month = time.getMonth() + 1
    const date = time.getDate()
    const hour = (time.getHours() % 12).toString().padStart(2, '0')
    const minute = (time.getMinutes()).toString().padStart(2, '0')
    const day = dayStrings[time.getDay()]
    return (
      <div className="App" style={{fontFamily: 'Noto Sans KR'}}>
        <p style={{fontSize: 100, lineHeight: 1, margin: 0}}>{hour}:{minute}</p>
        <p>{year}년 {month}월 {date}일 {day}요일</p>
        <p>온도: {temp.toFixed(1)}</p>
        <p>습도: {humid.toFixed(1)}</p>
        <p>날씨</p>
        <p>작업</p>
      </div>
    );
  }
}

export default App;
