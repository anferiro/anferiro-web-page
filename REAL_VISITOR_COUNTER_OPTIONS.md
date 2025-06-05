# Implementación de Contador Real con GoatCounter

## 🚀 Setup GoatCounter (5 minutos)

### 1. Crear Cuenta
1. Ve a: https://www.goatcounter.com/signup
2. Crea cuenta con:
   - **Site code**: `anferiro` (esto será anferiro.goatcounter.com)
   - **Domain**: `anferiro.me`

### 2. Agregar a tu Sitio
Agrega este código antes del `</body>` en index.html:
```html
<script data-goatcounter="https://anferiro.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
```

### 3. API para Contador Visible
GoatCounter tiene API pública para obtener estadísticas:
```javascript
// Obtener conteo total de visitas
fetch('https://anferiro.goatcounter.com/api/v0/stats/total')
  .then(response => response.json())
  .then(data => {
    document.getElementById('visitor-count').textContent = data.count;
  });
```

---

## 🎯 Opción B: Contador Custom con Firebase (Gratis)

Firebase Realtime Database para contador en tiempo real:

### 1. Setup Firebase
```bash
# Instalar Firebase
npm install firebase
```

### 2. Código JavaScript
```javascript
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, runTransaction } from 'firebase/database';

const firebaseConfig = {
  // Tu config de Firebase
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Incrementar contador
function incrementVisitorCount() {
  const visitorRef = ref(db, 'visitorCount');
  runTransaction(visitorRef, (currentData) => {
    return (currentData || 0) + 1;
  });
}

// Leer contador en tiempo real
function getVisitorCount() {
  const visitorRef = ref(db, 'visitorCount');
  onValue(visitorRef, (snapshot) => {
    const count = snapshot.val();
    document.getElementById('visitor-count').textContent = count;
  });
}
```

---

## 🎯 Opción C: CountAPI (Super Fácil - Gratis)

Servicio simple sin registro:

### JavaScript
```javascript
// Incrementar y obtener contador
async function updateVisitorCount() {
  try {
    const response = await fetch('https://api.countapi.xyz/hit/anferiro.me/visits');
    const data = await response.json();
    document.getElementById('visitor-count').textContent = data.value;
  } catch (error) {
    console.log('Error loading counter:', error);
    document.getElementById('visitor-count').textContent = '247+';
  }
}
```

---

## 🏆 Recomendación

**Para tu sitio, recomiendo GoatCounter porque:**
- ✅ Gratis
- ✅ Sin tracking personal
- ✅ Dashboard completo de analytics
- ✅ API para contador visible
- ✅ GDPR compliant
- ✅ Open source

**Setup más rápido: CountAPI** (1 línea de código)
**Más completo: GoatCounter** (analytics + contador)
**Más control: Firebase** (tu propia base de datos)

¿Cuál prefieres que implemente?
