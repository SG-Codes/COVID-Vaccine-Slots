import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import DatePicker from 'react-native-datepicker';

class App extends React.Component {
  state = {
    pinCode: null,
    date: null,
    locations: [],
  };

  handlePinCode = value => {
    this.setState({
      pinCode: value,
    });
  };

  submit = () => {
    fetch(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${this.state.pinCode}&date=${this.state.date}`,
      {
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
        },
      },
    )
      .then(res => {
        return res.json();
      })
      .then(response => {
        this.setState({
          locations: response['sessions'],
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <View>
        <View style={{alignItems: 'center'}}>
          <TextInput
            placeholder="Enter the pincode"
            keyboardType={'number-pad'}
            style={styles.inputField}
            onChangeText={this.handlePinCode}
          />
          <DatePicker
            style={{width: 200}}
            date={this.state.date}
            mode="date"
            placeholder="select date"
            format="DD-MM-YYYY"
            minDate="01-01-2020"
            maxDate="31-12-2022"
            confirmBtnText="Ok"
            cancelBtnText="Cancel"
            onDateChange={date => {
              this.setState({date: date});
            }}
          />
          <TouchableOpacity onPress={this.submit}>
            <Text style={styles.btn}>Get the Centers</Text>
          </TouchableOpacity>

          {this.state.locations.length === 0 ? (
            <Text style={{ fontSize: 19, fontWeight: 'bold', marginVertical: 10 }}>No Centers Found</Text>
          ) : (
            <ScrollView>
              <View>
                {this.state.locations.map((location, index) => {
                  return (
                    <View key={index} style={styles.card}>
                      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{location.name}</Text>
                      <Text>{location.vaccine}</Text>
                      <Text>
                        Available Vaccines: {location.available_capacity}
                      </Text>
                      <Text>Min. Age: {location.min_age_limit}</Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputField: {
    width: 400,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: 30,
    paddingLeft: 30,
  },
  btn: {
    backgroundColor: 'black',
    color: 'white',
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
    elevation: 4,
  },
  card: {
    width: 450,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 4,
    margin: 10,
    padding: 10,
  },
});

export default App;
