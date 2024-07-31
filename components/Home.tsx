import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator, FlatList, Animated, Easing } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import FastImage from 'react-native-fast-image'; 

interface Category {
  categoryId: number;
  categoryName: string;
  defaultPhotoUrl: string | null;
}

interface Product {
  productId: number;
  Nom: string;
  Description: string;
  prix: number;
  Stock: number;
  productPhotos: { photoUrl: string }[];
  category: Category;
  materiaux: any[];
}

const { width } = Dimensions.get('window');

const Home = ({ navigation }: { navigation: NavigationProp<ParamListBase> }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const baseUrl = 'http://192.168.1.110:8081/assets/images/'
  const [currentItems, setCurrentItems] = useState<Array<Category | Product>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const opacity = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get('http://192.168.1.110:8000/api/produits'),
          axios.get('http://192.168.1.110:8000/api/categories'),
        ]);
        console.log('Réponse produits:', productsResponse);
        console.log('Réponse catégories:', categoriesResponse);

        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);

        const user = JSON.parse(await AsyncStorage.getItem('user') || 'null');
        if (user) {
          setIsLoggedIn(true);
          setShowPopup(true);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
      style={styles.productItem}
    >
      <Image

        source={{ uri: item.productPhotos[0] ? baseUrl + item.productPhotos[0].photoUrl : 'default_image' }}

        style={styles.productImage}
        resizeMode="contain"
        onLoadStart={() => {
          console.log("Contenu de l'objet item :", item);
          console.log("URL de l'image :", baseUrl + item.productPhotos[0].photoUrl); 
          console.log("Contenu de item.productPhotos :", item.productPhotos); 

        }}
      />
      <Text style={styles.productText}>{item.Nom}</Text>
      <Text style={styles.productPrice}>Prix : {item.prix} €</Text>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('CategoryDetails', { category: item })}
      style={styles.categoryItem}
    >
      <Image
        source={{ uri: item.defaultPhotoUrl ? baseUrl + item.defaultPhotoUrl : 'default_image' }}
        style={styles.categoryImage}
        resizeMode="contain"
      />
      <Text style={styles.categoryText}>{item.categoryName}</Text>
    </TouchableOpacity>
  );

  const combinedData = [...categories, ...products];

  const renderItem = ({ item, index }: { item: Product | Category; index: number }) => {
    if ('categoryName' in item) {
      return renderCategoryItem({ item: item as Category });
    } else {
      return renderProductItem({ item: item as Product });
    }
  };
  useEffect(() => {
    if (currentIndex < currentItems.length) {
      startAnimation();
    } else if (currentIndex === 3 && products.length > 0) {
      setCurrentItems(products.slice(0, 3));
      setCurrentIndex(0);
      startAnimation();
    }
  }, [currentIndex, currentItems]);

  const startAnimation = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(() => {
      setTimeout(() => {
        opacity.setValue(0);
        setCurrentIndex(currentIndex + 1);
      }, 500);
    });
  };
  return (
    <ScrollView style={styles.homePage}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

  
      {!isLoading && (
        <>
          <Text style={styles.slogan}>
            VENANT DES HAUTES TERRES D'ECOSSE{"\n"}
            NOS MEUBLES SONT IMMORTELS
          </Text>

          <FlatList
            data={categories.slice(0, 3)}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.categoryId.toString()}
            contentContainerStyle={styles.categoryGrid} 
          />

          <Text style={styles.slogan}>Les Highlanders du moment</Text>

          {/* Grille des produits (limitée à 3) */}
          <FlatList
            data={products.slice(0, 3)}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.productId.toString()}
            contentContainerStyle={styles.productGrid} 

          />
        </>
      )}
    </ScrollView>

  );
};
const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center', 
    alignItems: 'center',   
  },
  homePage: {
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  popupText: {
    fontSize: 16,
    marginBottom: 10,
  },
  popupClose: {
    color: 'blue',
    textAlign: 'center',
  },
  slogan: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', 
  },
  categoryItem: {
    width: width - 40, 
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  categoryImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  categoryText: {
    textAlign: 'center',
  },

  highlandersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productItem: {
    width: width - 40, 
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  productText: {
    textAlign: 'center',
  },
  productPrice: {
    textAlign: 'center',
    color: 'green',
  },
  

});


export default Home;

