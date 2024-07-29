import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; // Ou votre bibliothèque d'icônes préférée
import { Linking } from 'react-native'; // Pour ouvrir les liens externes

function Footer() {
  const handleIconPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.footer}>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('CGU')}> 
          <Text style={styles.footerText}>CGU</Text>
        </TouchableOpacity>
        <Text style={styles.separator}> - </Text>
        <TouchableOpacity onPress={() => navigation.navigate('MentionsLegales')}>
          <Text style={styles.footerText}>Mentions légales</Text>
        </TouchableOpacity>
        <Text style={styles.separator}> - </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
          <Text style={styles.footerText}>Contact</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.icones}>
        <TouchableOpacity onPress={() => handleIconPress('https://www.instagram.com/')}>
          <Ionicons name="logo-instagram" size={24} color="#3f729b" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleIconPress('https://www.linkedin.com/')}>
          <Ionicons name="logo-linkedin" size={24} color="#0077b5" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleIconPress('https://www.facebook.com/')}>
          <Ionicons name="logo-facebook" size={24} color="#3b5998" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row', // Alignez les éléments horizontalement
    justifyContent: 'space-around', // Espacez-les uniformément
    alignItems: 'center', // Alignez-les verticalement
    padding: 15,
    backgroundColor: '#f0f0f0', // Couleur de fond (exemple)
  },
  textContainer: {
    flexDirection: 'row', // Alignez les textes horizontalement
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: 'blue', // Couleur du texte des liens (exemple)
  },
  separator: {
    marginHorizontal: 5, // Espace autour du séparateur
  },
  icones: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Footer;
