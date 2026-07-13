import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1595995477361-41d9a34e7a38?w=400&h=600&fit=crop',

  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1506629905607-d9c297d4f2f1?w=400&h=600&fit=crop',
];

const IMAGE_WIDTH = 175;
const IMAGE_HEIGHT = 220;
const SCROLL_WIDTH = PRODUCT_IMAGES.length * IMAGE_WIDTH;


function RetryImage({ uri, style }) {
  const [attempt, setAttempt] = useState(0);
  const maxRetries = 3;

  return (
    <Image
      key={attempt}
      source={{ uri: `${uri}&retry=${attempt}` }}
      style={style}
      resizeMode="cover"
      onError={() => {
        if (attempt < maxRetries) {
          setTimeout(() => {
            setAttempt((a) => a + 1);
          }, 800);
        }
      }}
    />
  );
}


export default function HeroCarousel() {

  const scrollAnim1 = useRef(new Animated.Value(0)).current;
  const scrollAnim2 = useRef(new Animated.Value(0)).current;


  useEffect(() => {

    const animate = () => {
      scrollAnim1.setValue(0);

      Animated.timing(scrollAnim1, {
        toValue: -SCROLL_WIDTH,
        duration: 45000,
        useNativeDriver: true,
      }).start(() => animate());
    };

    animate();

  }, [scrollAnim1]);



  useEffect(() => {

    const animate = () => {
      scrollAnim2.setValue(-SCROLL_WIDTH);

      Animated.timing(scrollAnim2, {
        toValue: 0,
        duration: 45000,
        useNativeDriver: true,
      }).start(() => animate());
    };

    animate();

  }, [scrollAnim2]);



  const renderImages = () => (
    <>
      {PRODUCT_IMAGES.map((uri, i) => (
        <RetryImage
          key={`img1-${i}`}
          uri={uri}
          style={styles.scrollImage}
        />
      ))}

      {PRODUCT_IMAGES.map((uri, i) => (
        <RetryImage
          key={`img2-${i}`}
          uri={uri}
          style={styles.scrollImage}
        />
      ))}
    </>
  );


  return (

    <View style={styles.gridSection}>

      <View style={styles.scrollRow}>
        <Animated.View
          style={[
            styles.row,
            {
              transform:[
                {translateX:scrollAnim1}
              ]
            }
          ]}
        >
          {renderImages()}
        </Animated.View>
      </View>



      <View style={styles.scrollRow}>
        <Animated.View
          style={[
            styles.row,
            {
              transform:[
                {translateX:scrollAnim2}
              ]
            }
          ]}
        >
          {renderImages()}
        </Animated.View>
      </View>


    </View>

  );
}



const styles = StyleSheet.create({

  gridSection:{
    flex:1,
    backgroundColor:COLORS.white,
    justifyContent:'center',
    paddingVertical:8,
  },


  row:{
    flexDirection:'row',
  },


  scrollRow:{
    height:IMAGE_HEIGHT,
    marginVertical:5,
    overflow:'hidden',
  },


  scrollImage:{
    width:IMAGE_WIDTH,
    height:IMAGE_HEIGHT,
    marginRight:10,
    borderRadius:14,
    backgroundColor:COLORS.lightGray,
  },

});