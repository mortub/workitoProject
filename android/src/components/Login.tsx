import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { HelperText, TextInput } from 'react-native-paper';
import { Styles } from '../theme/Styles';
import { validateEmail, validatePassword } from '../Validation';

//page for login
const Login = ({navigation})=>{
    const [submit, setSubmit ] = useState(false);
    //the password givn from the user
    const [password, setPassword ] = useState('');
    //the email given from the user
    const [email, setEmail ] = useState('');
    //the error to show for the email
    const [ errorMessageEmail, setErrorMessageEmail ] = useState('');
    //the error to show for the password
    const [ errorMessagePassword, setErrorMessagePassword ] = useState('');
    //the error to show for when the user doesn't exist on the database
    const [ googleError, setGoogleError ] = useState('');

    //validates email
    const validateEmailHandler = (emailText)=>{
      setEmail(emailText);
      if (validateEmail(emailText) === false) {
        setErrorMessageEmail('Email address is invalid!');
        return false;
      } else{
        return true;
      }
        

    }
    const validatePasswordHandler = (passwordText)=>{
      setPassword(passwordText);
      if (validatePassword(passwordText) === false) {    
        setErrorMessagePassword('Password must have minimum eight characters, one letter and one number');
        return false;
      }
        else{
          return true;
        }
    }

  useEffect(() => {
    if (submit === true) {
      setSubmit(false);
      let e = validateEmailHandler(email);
      let p = validatePasswordHandler(password);
      if (e && p) {
        checkIfUserExists().then((res) => {
          if (res === true) {
            navigation.navigate('RecoveryDaysForm');
          } else {
            setGoogleError('user does not exist with these email and password');
          }
        })
      }
    }
  })
   
    //checks if the user exists in order to let him in or not
  const checkIfUserExists = () => {
    return firestore().collection('users')
      .get()
      .then((users) => {
        var res =false;
          users.forEach((user) => {         
          if (user._data.email === email && user._data.password === password) {
            setGoogleError('');   
            res = true;   
            return res;
          }
        }) 
        return res;       
      }).catch((err) => {
        console.log(err)
      })
      
      
  }

    return (
        <View style={Styles.view}>
            <Text style={Styles.text}>Login</Text>
            <TextInput
                label="Email"
                placeholder='Email'
                onChangeText={val => {
                    setErrorMessageEmail('');
                    setEmail(val);
                    validateEmailHandler(val);
                    setGoogleError('');
                }}
                value={email}
            />
            <HelperText
                type="error"
            >
          {errorMessageEmail}
        </HelperText>
            <TextInput
                label="Password"
                placeholder='Password'
                secureTextEntry={true}
                onChangeText={val => {
                    setErrorMessagePassword('')
                    setPassword(val);
                    validatePasswordHandler(val);
                    setGoogleError('');
                }}
                value={password}
            />
            <HelperText
                type="error"
            >
          {errorMessagePassword}
          </HelperText>
         
            <Button
                title='Login'
                onPress={() => {
                  setSubmit(true);
                }}
                color={Styles.color}
            />
             <HelperText
                type="error"
            >
          {googleError}
          </HelperText>
        </View>
      );
 
};

export default Login;
