# 🚀 Zustand State Management Setup Guide

## مقدمة

هذا الدليل يشرح كيفية استخدام Zustand لـ state management في React Native/Expo.

---

## 📦 التثبيت

```bash
npm install zustand immer
# أو
yarn add zustand immer
```

---

## 📁 بنية المشروع

```
lib/
├── stores/
│   ├── authStore.js          # تسجيل الدخول والمستخدم
│   ├── cartStore.js          # السلة والمشتريات
│   ├── productsStore.js      # المنتجات والبحث
│   └── uiStore.js            # حالة الـ UI والـ notifications
├── hooks/
│   └── useErrorHandler.js    # معالجة الأخطاء
├── components/
│   └── Toast.js              # إشعارات الـ toast
└── examples/
    └── ProductsScreenExample.js  # مثال الاستخدام
```

---

## 📚 دليل الاستخدام

### **1. Auth Store - تسجيل الدخول**

```javascript
import { useAuthStore } from '../stores/authStore';

export default function LoginScreen() {
  const { signIn, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    const result = await signIn(email, password);
    
    if (result.success) {
      // يذهب للـ home screen
      navigation.replace('Home');
    } else {
      // عرض خطأ
      Alert.alert('خطأ', result.error);
    }
  };

  return (
    <View>
      {/* ... form ... */}
      <TouchableOpacity 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text>{isLoading ? 'جاري...' : 'دخول'}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

### **2. Products Store - جلب المنتجات**

```javascript
import { useProductsStore } from '../stores/productsStore';

export default function BrowseScreen() {
  const { products, isLoading, fetchProducts } = useProductsStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}
```

---

### **3. Cart Store - إدارة السلة**

```javascript
import { useCartStore } from '../stores/cartStore';

export default function ProductDetailsScreen({ route }) {
  const { addItem, removeItem, updateQuantity } = useCartStore();

  const handleAddToCart = () => {
    addItem(product);
    // تحفظ تلقائياً في AsyncStorage
  };

  const handleRemove = (productId) => {
    removeItem(productId);
  };

  return (
    <View>
      {/* ... product details ... */}
      <TouchableOpacity onPress={handleAddToCart}>
        <Text>أضف للسلة</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

### **4. UI Store - Notifications والإشعارات**

```javascript
import { useUIStore } from '../stores/uiStore';

export default function SettingsScreen() {
  const { showToast, setLanguage, selectedLanguage } = useUIStore();

  const handleChangeLanguage = (lang) => {
    setLanguage(lang);
    showToast(`تم تغيير اللغة إلى ${lang}`, 'success');
  };

  return (
    <View>
      <TouchableOpacity onPress={() => handleChangeLanguage('ar')}>
        <Text>العربية</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleChangeLanguage('en')}>
        <Text>English</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

### **5. Error Handler Hook - معالجة الأخطاء**

```javascript
import { useErrorHandler } from '../hooks/useErrorHandler';

export default function SellScreen() {
  const { handleError, handleSuccess, handleWarning } = useErrorHandler();

  const handlePublishProduct = async () => {
    try {
      const result = await publishProduct(formData);
      
      if (result.success) {
        handleSuccess('تم نشر المنتج بنجاح');
        navigation.goBack();
      } else {
        handleError(new Error(result.error));
      }
    } catch (err) {
      handleError(err, 'فشل نشر المنتج');
    }
  };

  return (
    // ...
  );
}
```

---

### **6. Toast Component - في الـ App.js**

```javascript
import Toast from './components/Toast';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      {/* باقي التطبيق */}
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>

      {/* Toast في الأعلى */}
      <Toast />
    </View>
  );
}
```

---

## 🎯 Best Practices

### ✅ افعل:

```javascript
// ✅ استخدم الـ store مباشرة
const { products, isLoading } = useProductsStore();

// ✅ استخدم async/await
const result = await fetchProducts();
if (result.success) { /* ... */ }

// ✅ استخدم Error Handler hook
const { handleError } = useErrorHandler();
handleError(err, 'رسالة مخصصة');

// ✅ Cleanup في useEffect
useEffect(() => {
  return () => clearCart(); // cleanup
}, []);
```

### ❌ لا تفعل:

```javascript
// ❌ لا تنسخ state
const products = useProductsStore().products;
const { products: productsCopy } = useProductsStore(); // ❌

// ❌ لا تحفظ أخطاء في global state
useProductsStore.setState({ error: err }); // ❌

// ❌ لا تنسى معالجة الأخطاء
const result = await fetchProducts(); // ❌ بدون check

// ❌ لا تستخدم state بدون subscription
if (useProductsStore.getState().products.length > 0) { // ❌
```

---

## 🔄 حياة الـ State

```javascript
// 1. Create store
export const useAuthStore = create((set) => ({
  user: null,
  signIn: async (email, password) => {
    // ...
    set((state) => { state.user = user; });
  },
}));

// 2. Use in component
export default function LoginScreen() {
  const { user, signIn } = useAuthStore(); // subscribe to changes
}

// 3. When user changes
// الـ component يتحدث تلقائياً (no re-render unnecessary)

// 4. Cleanup
// عند unmount الـ component، الـ subscription تنقطع تلقائياً
```

---

## 📝 Common Patterns

### Pattern 1: Async Loading

```javascript
const { products, isLoading, error } = useProductsStore();

// في الـ render
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
return <ProductsList products={products} />;
```

### Pattern 2: Form Handling

```javascript
// Store
const useFormStore = create((set) => ({
  formData: {},
  setField: (field, value) => {
    set((state) => {
      state.formData[field] = value;
    });
  },
}));

// Component
const { formData, setField } = useFormStore();
<TextInput value={formData.email} onChangeText={(text) => setField('email', text)} />
```

### Pattern 3: Caching

```javascript
const useCacheStore = create((set) => ({
  cache: {},
  getCached: (key) => {
    const store = get();
    if (store.cache[key]) {
      return store.cache[key]; // من الـ cache
    }
    // fetch from API
  },
  setCached: (key, value) => {
    set((state) => {
      state.cache[key] = value;
    });
  },
}));
```

---

## 🧪 Testing

```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCartStore } from '../stores/cartStore';

test('add to cart', async () => {
  const { result } = renderHook(() => useCartStore());

  act(() => {
    result.current.addItem({ id: '1', name: 'Product', price: 100 });
  });

  expect(result.current.items).toHaveLength(1);
  expect(result.current.total).toBe(100);
});
```

---

## 🐛 Debugging

### في Console:

```javascript
// شوف الـ store الكامل
useProductsStore.getState()

// تابع التغييرات
useProductsStore.subscribe(
  (state) => console.log('State changed:', state)
)
```

### Redux DevTools (optional):

```bash
npm install zustand-redux-devtools
```

---

## 📊 Performance Tips

### 1. Selective Subscription

```javascript
// ❌ يعيد render لكل تغيير
const store = useAuthStore();

// ✅ يعيد render فقط لما user يتغير
const user = useAuthStore((state) => state.user);
```

### 2. Memoization

```javascript
import { useMemo } from 'react';

export default function ProductList() {
  const products = useProductsStore((state) => state.products);
  
  // Memoize expensive calculations
  const filtered = useMemo(() => {
    return products.filter(/* ... */);
  }, [products]);
}
```

---

## 🚀 الخلاصة

| الـ Feature | الفائدة |
|-----------|--------|
| **Zustand** | إدارة الـ state بسهولة |
| **Immer** | تعديل الـ state بشكل آمن |
| **Error Handling** | رسائل خطأ للمستخدم |
| **Toast Component** | إشعارات بصرية |
| **AsyncStorage** | حفظ البيانات |

---

## 📚 المراجع

- Zustand Docs: https://zustand-demo.vercel.app/
- Immer Docs: https://immerjs.github.io/immer/
- React Native Docs: https://reactnative.dev/

---

**Ready to use! ابدأ بـ stores الأساسية وطور من هناك.** 🎯
