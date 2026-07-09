import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, I18nManager } from 'react-native';
import { COLORS } from './theme/colors';
import WelcomeScreen from './screens/welcomescreen';
import HomeScreen from './screens/HomeScreen';
import ProductDetailsScreen from './screens/ProductDetailsScreen';
import SellScreen from './screens/SellScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatListScreen from './screens/ChatListScreen';
import ChatScreen from './screens/ChatScreen';
import OrdersScreen from './screens/OrdersScreen';
import { onAuthStateChange } from './services/auth';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [lang, setLang] = useState('ar');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setCurrentScreen('home');
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  const navigateTo = (screen, params = null) => {
    if (screen === 'productDetails') setSelectedProduct(params);
    if (screen === 'chat') setSelectedChat(params);
    setCurrentScreen(screen);
  };

  return (
<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, paddingTop: 16 }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {currentScreen === 'welcome' && (
        <WelcomeScreen
          lang={lang}
          setLang={setLang}
          onNavigateHome={() => navigateTo('home')}
        />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          lang={lang}
          user={user}
          onNavigateProduct={(product) => navigateTo('productDetails', product)}
          onNavigateSell={() => navigateTo('sell')}
          onNavigateProfile={() => navigateTo('profile')}
          onNavigateChats={() => navigateTo('chatList')}
        />
      )}

      {currentScreen === 'productDetails' && (
        <ProductDetailsScreen
          product={selectedProduct}
          lang={lang}
          user={user}
          onBack={() => navigateTo('home')}
          onBuy={(product) => navigateTo('orders')}
          onChat={(chat) => navigateTo('chat', chat)}
        />
      )}

      {currentScreen === 'sell' && (
        <SellScreen
          lang={lang}
          user={user}
          onBack={() => navigateTo('home')}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen
          lang={lang}
          user={user}
          onBack={() => navigateTo('home')}
          onLogout={() => navigateTo('welcome')}
          onNavigateOrders={() => navigateTo('orders')}
        />
      )}

      {currentScreen === 'chatList' && (
        <ChatListScreen
          lang={lang}
          user={user}
          onBack={() => navigateTo('home')}
          onOpenChat={(chat) => navigateTo('chat', chat)}
        />
      )}

      {currentScreen === 'chat' && (
        <ChatScreen
          lang={lang}
          user={user}
          chat={selectedChat}
          onBack={() => navigateTo('chatList')}
        />
      )}

      {currentScreen === 'orders' && (
        <OrdersScreen
          lang={lang}
          user={user}
          onBack={() => navigateTo('home')}
        />
      )}
    </SafeAreaView>
  );
}