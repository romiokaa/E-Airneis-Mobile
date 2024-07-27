import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native'; // Import View
import ProductItem from './ProductItem';

const ProductGrid = ({ products, navigation }) => {
  return (
    <View style={styles.gridContainer}> {/* Ajout d'un container pour la grille */}
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ProductItem product={item} navigation={navigation} />}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles similaires à CategoryGrid, mais adaptés pour une grille à 2 colonnes
});

export default ProductGrid;
