import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native'; 

const baseUrl = 'http://192.168.1.110:8081/assets/images/';

const CategoryPage = () => {
  const navigation = useNavigation();
  const route = useRoute(); 
  const categoryId = route.params?.categoryId; 

  const [category, setCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const defaultImage = baseUrl + 'React-JS'; 

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/categories/${categoryId}`);
        setCategory(response.data);

        const productsResponse = await axios.get(`http://localhost:8000/api/categories/${categoryId}/produits`);
        setCategoryProducts(productsResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      } finally {
        setIsLoading(false); 
      }
    };
    fetchCategoryDetails(); 
  }, [categoryId]); 

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', { product: item })} 
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
          numColumns={2} 
          contentContainerStyle={styles.productGrid}
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
});

export default CategoryPage;
