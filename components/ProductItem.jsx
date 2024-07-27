import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importez useNavigation

const ProductItem = ({ product }) => {
  const navigation = useNavigation(); // Obtenez la fonction de navigation

  return (
    <TouchableOpacity 
      style={styles.productItem} 
      onPress={() => navigation.navigate('ProductDetails', { product })} // Naviguez vers l'écran de détails
    >
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
    </TouchableOpacity>
  );
};

export default ProductItem;