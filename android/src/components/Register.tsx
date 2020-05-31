import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { HelperText, TextInput } from 'react-native-paper';
import { Styles } from '../theme/Styles';
import { validateEmail, validatePassword } from '../Validation';

//page for user registration
const Register = ({navigation})=>{
  const [submit, setSubmit ] = useState(false);
  //the password given by the user
  const [password, setPassword ] = useState('');
  //the emailgiven by the user
  const [email, setEmail ] = useState('');
  //the error to show for the email
  const [ errorMessageEmail, setErrorMessageEmail ] = useState('');
  //the error to show for the password
  const [ errorMessagePassword, setErrorMessagePassword ] = useState('');
  //the error to show for whatever google returns
  const [ googleError, setGoogleError ] = useState('');
  
  //validates the email
  const validateEmailHandler = (emailText)=>{
   setEmail(emailText);
    if (validateEmail(emailText) === false) {      
      setErrorMessageEmail('Email address is invalid!');
      return false;
    }
      return true;
  }
  //validates the password
  const validatePasswordHandler = (passwordText)=>{
   setPassword(passwordText);
    if (validatePassword(passwordText) === false) {           
      setErrorMessagePassword('Password must have minimum eight characters, one letter and one number');
      return false;
    }
      return true;
  }

  useEffect(()=>{
      if(submit === true){
          setSubmit(false);
          let e = validateEmailHandler(email);
          let p = validatePasswordHandler(password);
          if( e && p){
              signUp();
          }
      }

  })
  //signing up the user
  const signUp =()=>{
          auth()
          .createUserWithEmailAndPassword(email, password)
          .then(() => {
              console.log('User account created & signed in!');
              const user = auth().currentUser;
              //adding the user to the users collection
              firestore().collection("users").add({
                  email: email,
                  password: password,
                  userId: user.uid,
              })
              .then(()=>{
                  navigation.navigate('RecoveryDaysForm')
              })
              .catch(function (err) {
                  console.error(err);
              })
             
          })
          .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              setGoogleError('That email address is already in use!');
            }
        
            if (error.code === 'auth/invalid-email') {
              setGoogleError('That email address is invalid!');
            }
        
          });
   
  };
 
  return (
      <View style={Styles.view}>
          <Text style={Styles.text} >Register</Text>
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
              color={Styles.color}
              title='Register'
              onPress={() => {
                 setSubmit(true);
              }}
          />
           <HelperText
              type="error"
          >
        {googleError}
        </HelperText>
      </View>
    );
 
};

export default Register;
