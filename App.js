import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { Constants, Location, Permissions } from 'expo';


export default class App extends Component {
  state = {
    location: null,
    errorMessage: null,
    lat: null,
    lng: null,
    date: '',
    data:'',
  };
  
  holi(){
    var dgram = require('dgram');
    var message = new Buffer("REV442039316285+1002174-0748386700014612;ID=357042062915567");
    var client = dgram.createSocket("udp4");
    client.send(message, '45826', '3.95.47.65');
    client.close();
     }
  componentDidMount() {
    
    //let b = dgram.createSocket('udp4');
    //let data= '>REV442039316285+'+lat+lng+'00014612;ID=357042062915567<'
    //b.send(data, 0, data.length, '45826', '3.95.47.65')
    var that = this;
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    that.setState({
      //Setting the value of the date time
      date:
        date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec,
    });
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    
  };

  render() {
    let text = 'Waiting..';
    let lat = '';
    let lng ='';
    let data='';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text='';
      lat = this.state.location.coords.latitude;
      lng = this.state.location.coords.longitude;
      data= '>REV442039316285+'+lat+lng+'00014612;ID=357042062915567<'
     
    }
    
      
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}{'\n'}Latitud: 
        {lat}{'\n'}Longitud: {lng} {'\n'} {this.state.date}{'\n'}{data} </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});