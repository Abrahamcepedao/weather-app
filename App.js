import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
//import { Location } from 'expo';
import * as Location from 'expo-location';
import WeatherInfo from './components/WeatherInfo';
import UnitsPicker from './components/UnitsPicker';
import ReloadIcon from './components/ReloadIcon';
import WeatherDetails from './components/WeatherDetails';
import {colors} from './utils/index'

const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?'
const WEATHER_API_KEY = '052fd58ed5af623026760974f847c016'

export default function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [units, setUnits] = useState('metric');

  useEffect(() => {
    load()
  }, [units])
  
  async function load(){
    try{
      setCurrentWeather(null);
      setErrorMessage(null);
      let { status } = await Location.requestPermissionsAsync()
      if(status != 'granted'){
        setErrorMessage('Acces to location is empirical..')
        return;
      }
      let { status2 } = await Location.getPermissionsAsync()
      console.log("status", status)
      const location = await Location.getCurrentPositionAsync({
          maximumAge: 60000,
          accuracy: Location.Accuracy.Lowest, 
      })
      //console.log("location: ",location)
      const lat = location.coords.latitude;
      const lon = location.coords.longitude;
      const weatherUrl = `${BASE_WEATHER_URL}lat=${lat}&lon=${lon}&units=${units}&appid=${WEATHER_API_KEY}`
      //console.log("url: ", weatherUrl)
      const response = await fetch(weatherUrl);
      const result = await response.json();
      //console.log("result: ", result)
      if(response.ok){
        setCurrentWeather(result);
      } else{
        setErrorMessage(result.message)
      }
    } catch(error) {
      setErrorMessage(error.message)
    }
  }
  if(currentWeather){
    
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <UnitsPicker unitsSystem={units} setUnitsSystem={setUnits} />
          <ReloadIcon load={load}/>
          <WeatherInfo currentWeather={currentWeather}/>
        </View>
        <WeatherDetails currentWeather={currentWeather} units={units}/>
      </View>
    );
  } else  if (errorMessage){
    return (
      <View style={styles.container}>
        <ReloadIcon load={load}/>
        <Text style={styles.h1}>{errorMessage}</Text>
        <StatusBar style="auto" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.PRIMARY_COLOR}/>
        <StatusBar style="auto" />
      </View>
    )
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(247,247,255)',
    justifyContent: 'center',
  },
  h1: {
    fontWeight: "bold",
    color: "black",
    textAlign: 'center'
  },
  main: {
    justifyContent: "center",
    flex: 1
  }
});
