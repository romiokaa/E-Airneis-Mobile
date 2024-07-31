import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import Menu from './Menu';

const Navbar = () => {
  const navigation = useNavigation();
  const [panierCount, setPanierCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchPanierCount = async () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData && userData.user && userData.user.id) {
        try {
          const response = await fetch(`http://localhost:8000/api/panier/${userData.user.id}`);
          if (response.ok) {
            const data = await response.json();
            const count = data.length;
            setPanierCount(count);
          } else {
            console.error("Erreur lors de la récupération du panier:", response.statusText);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du nombre d\'articles :', error);
        }
      } else {
        const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
        const count = guestCart.reduce((total, item) => total + item.quantite, 0);
        setPanierCount(count);
      }
    };

    fetchPanierCount();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchClick = () => {
    navigation.navigate('SearchScreen'); 
  };

  const handleCartClick = () => {
    navigation.navigate('CartScreen'); 
  };

  return (
    <SafeAreaView style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}> 
        <Text style={styles.logo}>ÀIRNEIS</Text>
      </TouchableOpacity>

      <View style={styles.icons}>
        <TouchableOpacity onPress={handleSearchClick}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCartClick}>
          <Ionicons name="cart-outline" size={24} color="black" />
          {panierCount > 0 && <View style={styles.cartDot} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>

        {isMenuOpen && <Menu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />} 
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f0f0f0', 
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginLeft: 10, 
  },
  cartDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default Navbar;
