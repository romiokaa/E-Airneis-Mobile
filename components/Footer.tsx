import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import { Linking } from 'react-native'; 

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
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    padding: 15,
    backgroundColor: '#f0f0f0',
  },
  textContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: 'blue', 
  },
  separator: {
    marginHorizontal: 5, 
  },
  icones: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Footer;
