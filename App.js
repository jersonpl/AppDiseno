import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import dgram from 'dgram';
var num = 1;
var format = '';
var format2 = '';
var lat1 = '';
var lng1 = '';
var sgn = '';


export default class App extends Component {
  state = {
    location: null,
    errorMessage: null,
    lat: null,
    lng: null,
    date: '',
    data: ''
  };

  Armar = _ => {
    num += 1;
    this.setState({
      entra: 'entró' + num.toString(),
    });
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
        year + '-' + month + '-' + date + ' ' + hours + ':' + min + ':' + sec,

    });
    function calcular() {
      var fechaini = new Date('1980-01-06');
      var fechafin = new Date();
      var diasem = fechafin.getDay();
      var diasdif = fechafin.getTime() - fechaini.getTime();
      var contdias = Math.round(diasdif / (1000 * 60 * 60 * 24));
      var contsem = Math.round(contdias / 7);
      var hora = Math.round(hours * 3600 + min * 60 + sec + 18000);
      format = '>REV44' + contsem + diasem + hora;
    }
    calcular()
    this._getLocationAsync();
    if (this.state.errorMessage) {
    } else if (this.state.location) {
      this.setState({
        lat : this.state.location.coords.latitude
      })
      if (Math.sign(this.state.lat) == 1) {
        lat1 = Math.round(this.state.lat * 100000);
        sgn = '+'
        lat1 = sgn + lat1;
      } else {
        lat1 = Math.round(this.state.lat * 100000);
        sgn = '-'
        lat1 = sgn + lat1;
      }
      this.setState({
        lng : this.state.location.coords.longitude
      })
      if (Math.sign(this.state.lng) == 1) {
        lng1 = Math.round(this.state.lng * 100000);
        sgn = '+0'
        lng1 = sgn + lng1;
      } else {
        lng1 = Math.round(this.state.lng * -100000);
        sgn = '-0'
        lng1 = sgn + lng1;
      }
      format2 = format + lat1 + lng1 + '00014612;ID=357042062915567<';
      SendUDP();
    }
  }
  SendUDP = _ => {
    const socket = dgram.createSocket('udp4');
    socket.bind(12345)
    socket.once('listening', function(){
      var message = Buffer(format2);  
      socket.send(message,0,message.length,'45826','3.95.47.65', function(err){
        if(err) throw err
        console.log('message was sent')
      });
    })
  }
  componentDidMount() {
    this.Armar();
    this.interval = setInterval(() => this.SendUDP(), 5000);
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
    clearInterval(this.interval);
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
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          Latitud:{this.state.lat}{'\n'}
          Longitud:{this.state.lng}{'\n'}
          {this.state.date}{'\n'}
          {format2}
        </Text>
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