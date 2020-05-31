import React from 'react';
import { View, Text, Button } from 'react-native';
import { Styles } from '../theme/Styles';

//the first page - choose between register and login
const Home = ({navigation})=>{
    return (
        <View style={Styles.view}>
            <Text style={Styles.text}>Please Register</Text>
            <Button title='Register'
                onPress={()=> navigation.navigate('Register')}
                color={Styles.color}
            />
            <Text style={Styles.text}>Already registered? Please login</Text>
            <Button title='Login'
                onPress={()=> navigation.navigate('Login')}
                color={Styles.color}
            />
        </View >
    )
};

export default Home;
