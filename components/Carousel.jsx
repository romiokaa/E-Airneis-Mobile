import React, { useRef, useState } from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window'); // Largeur de l'écran

const Carousel = ({ data }) => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSlideChange = (index) => {
    setCurrentIndex(index);
  };

  return (
    <View style={styles.carouselContainer}>
      <Slider
        ref={sliderRef}
        style={styles.slider}
        loop={true}
        autoplay={true}
        autoplayDelay={3000} // Délai entre les diapositives (en ms)
        onMomentumScrollEnd={handleSlideChange}
      >
        {data.map((item, index) => (
          <View key={index} style={styles.slide}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </View>
        ))}
      </Slider>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    width,
    height: 200, // Ajustez la hauteur selon vos besoins
  },
  slider: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default Carousel;
