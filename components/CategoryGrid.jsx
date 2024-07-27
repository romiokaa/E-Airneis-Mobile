import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native'; // Import View
import CategoryItem from './CategoryItem';

const CategoryGrid = ({ categories, navigation }) => {
  return (
    <View style={styles.gridContainer}> {/* Ajout d'un container pour la grille */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CategoryItem category={item} navigation={navigation} />}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: { // Styles pour le container de la grille
    // Ajoutez ici les styles pour le container, par exemple :
    marginBottom: 20,
  },
  grid: { // Styles pour le contenu de la FlatList
    // Ajoutez ici les styles pour le contenu de la grille, par exemple :
    paddingHorizontal: 10,
  },
  // ... (autres styles pour les éléments de la grille)
});

export default CategoryGrid;
