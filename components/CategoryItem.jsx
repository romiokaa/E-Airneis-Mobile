import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importez useNavigation

const CategoryItem = ({ category }) => {
  const navigation = useNavigation(); // Obtenez la fonction de navigation

  return (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate('CategoryDetails', { category })}
    >
      <Image source={{ uri: category.image }} style={styles.categoryImage} />
      {/* <Text style={styles.categoryName}>{category.name}</Text> */}
      <Text style={styles.categoryName}>{category.name || 'Nom de catégorie par défaut'}</Text>
    </TouchableOpacity>
  );
};

export default CategoryItem;