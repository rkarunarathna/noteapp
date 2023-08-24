
import LoginPage from './screens/LoginPage'
import HomePage from './screens/HomePage';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import {Provider as PaperProvider } from 'react-native-paper';
import AboutUs from './screens/AboutUs';

//const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const App = () => {

  const [loggedIn, setLoggedIn] = useState(false); // Track login state
  const [user_id, setUserId] = useState(null); // Track user id

  const handleLogin = (success,user_id) => {
    if (success) {
      setLoggedIn(true);
      setUserId(user_id);
    } else {
      Alert.alert('Login Failed', 'Invalid username or password.');
    }
  };
  const handleLogout = () => {
    setLoggedIn(false);
  };


  return (
    <PaperProvider>
    <NavigationContainer>
      <Drawer.Navigator>
        {loggedIn ? (
          <Drawer.Screen name="Home">
            {(props) => (
              <HomePage {...props} onLogout={handleLogout} user_id={user_id} />
            )}
          </Drawer.Screen>
        ) : (
          <Drawer.Screen name="Login" options={{ headerShown: false }}>
            {(props) => (
              <LoginPage {...props} onLogin={handleLogin} user_id={user_id} />
            )}
          </Drawer.Screen>
        )}
         <Drawer.Screen name="AboutUs" component={AboutUs}/>
         
      
      </Drawer.Navigator>
    </NavigationContainer>
  </PaperProvider>
  );
};

export default App;