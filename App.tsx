import React, { useState, useEffect } from 'react';
//Firebase
import auth from '@react-native-firebase/auth';
//Pages
import Home from './android/src/components/Home';
import Register from './android/src/components/Register';
import Login from './android/src/components/Login';
import RecoveryDaysForm from './android/src/components/RecoveryDaysForm';
//Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//the main application
function App() { 
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
       <Stack.Navigator>     
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
         <Stack.Screen name="RecoveryDaysForm" component={RecoveryDaysForm} options={{headerTitle: 'Recovery Days Calculation'}}/>     
      </Stack.Navigator>    
    </NavigationContainer>  
  );
}

export default App;