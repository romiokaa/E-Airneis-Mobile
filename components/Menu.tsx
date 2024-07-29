import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Menu = ({ isMenuOpen, toggleMenu }) => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigation.navigate('Home');
  };

  return (
    <View style={[styles.menu, isMenuOpen && styles.menuOpen]}>
      {isLoggedIn ? (
        <>
          <TouchableOpacity onPress={() => navigation.navigate('AccountSettings')} style={styles.menuItem}>
            <Text style={styles.menuText}>Mes paramètres</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
            <Text style={styles.menuText}>Déconnexion</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.menuItem}>
            <Text style={styles.menuText}>Connexion</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.menuItem}>
            <Text style={styles.menuText}>Inscription</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Autres éléments du menu */}
      <TouchableOpacity onPress={() => navigation.navigate('OrderHistory')} style={styles.menuItem}>
        <Text style={styles.menuText}>Mes commandes</Text>
      </TouchableOpacity>
      {/* ... */}
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    // Styles pour le menu fermé (par exemple, positionné hors de l'écran)
  },
  menuOpen: {
    // Styles pour le menu ouvert (par exemple, visible à l'écran)
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
  },
  // ... autres styles
});

export default Menu;
