import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native'; 

const baseUrl = '/img/'; // Assurez-vous que cette URL est correcte pour React Native

const CategoryPage = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Obtenez les paramètres de la route
  const categoryId = route.params?.categoryId; 

  const [category, setCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const defaultImage = baseUrl + 'React-JS'; // Image par défaut

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        // Récupérer les informations de la catégorie
        const response = await axios.get(`http://localhost:8000/api/categories/${categoryId}`);
        setCategory(response.data);

        // Récupérer les produits de la catégorie
        const productsResponse = await axios.get(`http://localhost:8000/api/categories/${categoryId}/produits`);
        setCategoryProducts(productsResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      } finally {
        setIsLoading(false); 
      }
    };
    fetchCategoryDetails(); 
  }, [categoryId]); // Exécutez l'effet à chaque fois que categoryId change

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', { product: item })} // Navigation vers le détail du produit
      style={styles.productCard}
    >
      <Image 
        source={{ uri: item.productPhotos[0]?.photoUrl ? baseUrl + item.productPhotos[0]?.photoUrl : defaultImage }}
        style={styles.productImage}
      />
      <View style={styles.productCardDetails}>
        <Text style={styles.productCardTitle}>{item.Nom}</Text>
        <Text style={styles.productCardPrice}>{item.prix} €</Text>
        <Text style={styles.productCardStock}>
          {item.Stock > 0 ? "En stock" : "Stock épuisé"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.categoryPage}>
      {category && (
        <View style={styles.categoryTitleContainer}>
          {categoryProducts.length > 0 && (
            <Image
              source={{ uri: categoryProducts[0].productPhotos[0]?.photoUrl ? baseUrl + categoryProducts[0].productPhotos[0]?.photoUrl : defaultImage }}
              style={styles.categoryImage}
            />
          )}
          <View style={styles.categoryTitleOverlay}>
            <Text style={styles.categoryTitle}>{category.categoryName}</Text>
            <Text style={styles.categoryDescription}>{category.description}</Text>
          </View>
        </View>
      )}

      {isLoading ? (
        <Text>Chargement en cours...</Text>
      ) : (
        <FlatList
          data={categoryProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.productId.toString()}
          numColumns={2} // Grille à deux colonnes
          contentContainerStyle={styles.productGrid}
        />
      )}
    </View>
  );
};

// Styles (à personnaliser)
const styles = StyleSheet.create({
  // ... styles pour les éléments de la page ...
});

export default CategoryPage;
