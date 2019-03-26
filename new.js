import dgram from 'react-native-udp';

class rctsockets extends Component {
    constructor(props) {
      super(props);}
    componentDidMount() {
    var message = new Buffer(">REV442039316285+1002174-0748386700014612;ID=357042062915567<");
    var client = dgram.createSocket("udp4");
    client.send(message, '45826', '3.95.47.65');
    client.close();
    this.setState({var1:'2'});
     }
    }