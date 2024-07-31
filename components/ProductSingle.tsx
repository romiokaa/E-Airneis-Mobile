import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel'; 
import { ToastContainer, toast } from 'react-native-toast-message';

const baseUrl = 'http://192.168.1.110:8081/assets/images/';
const { width } = Dimensions.get('window');

const ProductSingle: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const productId = route.params?.productId;

  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/produit/${productId}`);
        setProduct(response.data);
        setCategoryId(response.data.category?.categoryId || null);
      } catch (err) {
        console.error("Erreur lors du chargement du produit :", err);
        setError("Erreur lors du chargement du produit");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (categoryId) {
        try {
          const responseSimilar = await axios.get(`http://localhost:8000/api/categories/${categoryId}/produits`);
          const filteredSimilarProducts = responseSimilar.data.filter(
            (p: { productId: number }) => p.productId !== parseInt(productId, 10)
          );
          setSimilarProducts(filteredSimilarProducts);
        } catch (err) {
          console.error("Erreur lors de la récupération des produits similaires :", err);
          setSimilarProducts([]);
        }
      } else {
        setSimilarProducts([]);
      }
    };

    fetchSimilarProducts();
  }, [categoryId, productId]);

  const handleAddToCart = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData && userData.user && userData.user.id) {
        const userId = userData.user.id;
        const response = await axios.post(`http://localhost:8000/panier/add/${productId}/${userId}`);
        toast.show({
          type: 'success',
          text1: 'Produit ajouté au panier !',
        });
      } else {
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      toast.show({
        type: 'error',
        text1: 'Une erreur est survenue lors de l\'ajout au panier.',
      });
    }
  };

  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselSlide}>
      <Image 
        source={{ uri: item.photoUrl ? baseUrl + item.photoUrl : 'votre_image_par_defaut' }} 
        style={styles.carouselImage} 
      />
    </View>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
      style={styles.productItem}
    >
      <Image source={{ uri: item.productPhotos[0]?.photoUrl ? baseUrl + item.productPhotos[0]?.photoUrl : 'votre_image_par_defaut' }} style={styles.productImage} />
      <Text style={styles.productName}>{item.Nom}</Text>
      <Text style={styles.productPrice}>{item.prix} €</Text>
    </TouchableOpacity>
  );

  if (loading) return <Text>Chargement...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <ScrollView style={styles.container}>
      <ToastContainer />
      {product && (
        <>
          <Carousel
            data={product.productPhotos} 
            renderItem={renderCarouselItem}
            sliderWidth={width}
            itemWidth={width}
            autoplay={true}
            autoplayInterval={3000}
            loop={true}
          />

          <View style={styles.productDetails}>
            <Text style={styles.productName}>{product.Nom}</Text>
            <Text style={styles.productPrice}>{product.prix} €</Text>
            <Text style={styles.productStock}>
              {product.Stock > 0 ? "En stock" : "Stock épuisé"}
            </Text>
            <Text style={styles.productDescription}>{product.Description}</Text>
            <TouchableOpacity
              onPress={handleAddToCart}
              disabled={product.Stock === 0}
              style={[styles.addToCartButton, product.Stock === 0 && styles.disabledButton]}
            >
              <Text style={styles.buttonText}>
                {product.Stock === 0 ? "STOCK ÉPUISÉ" : "AJOUTER AU PANIER"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.similarProducts}>
            <Text style={styles.similarProductsTitle}>Produits similaires</Text>
            {similarProducts.length > 0 ? (
              <FlatList
                data={similarProducts.slice(0, 4)} 
                renderItem={renderProductItem}
                keyExtractor={(item) => item.productId.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <Text>Aucun produit similaire trouvé</Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
});

export default ProductSingle;
