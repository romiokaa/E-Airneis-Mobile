import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Accueil from '../../screens/Accueil'; // Assurez-vous que le nom du composant est correct
// import CategoryDetailsScreen from '../screens/CategoryDetailsScreen'; // Créez ce composant
// import ProductDetailsScreen from '../screens/ProductDetailsScreen'; // Créez ce composant

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Accueil" component={Accueil} />
        {/* <Stack.Screen name="CategoryDetails" component={CategoryDetailsScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} /> */}
      </Stack.Navigator>
  );
}
