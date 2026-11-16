/* Menu Catalog Data */
let MENU_DATA = [
  // --- ESPRESSO-BASED ---
  {
    id: 'esp-1',
    category: 'espresso',
    name: 'Americano',
    desc: 'Rich espresso diluted with hot water or chilled over ice.',
    basePrice: 95,
    price8oz: 95,
    price12oz: 115,
    price16oz: 135,
    hasSizes: true,
    hasMilk: false,
    hasSyrups: true,
    hasExtraShot: true,
    pairingRecommendation: 'Pairs nicely with Special Cassava!'
  },
  {
    id: 'esp-2',
    category: 'espresso',
    name: 'Biscoff Latte',
    desc: 'Signature espresso blended with cookie butter syrup and textured milk.',
    basePrice: 145,
    price8oz: 145,
    price12oz: 165,
    price16oz: 185,
    hasSizes: true,
    hasMilk: true,
    hasSyrups: true,
    hasExtraShot: true,
    pairingRecommendation: 'Pairs perfectly with Creamy Carbonara!'
  },
  {
    id: 'esp-3',
    category: 'espresso',
    name: 'Cafe Latte',
    desc: 'Classic smooth espresso topped with silky microfoam.',
    basePrice: 105,
    price8oz: 105,
    price12oz: 125,
    price16oz: 145,
    hasSizes: true,
    hasMilk: true,
    hasSyrups: true,
    hasExtraShot: true,
    pairingRecommendation: 'Great accompaniment to Ham & Cheese toast.'
  },
  {
    id: 'esp-4',
    category: 'espresso',
    name: 'Cafe Mocha',
    desc: 'Rich dark chocolate cocoa combined with espresso and steamed milk.',
    basePrice: 115,
    price8oz: 115,
    price12oz: 135,
    price16oz: 155,
    hasSizes: true,
    hasMilk: true,
    hasSyrups: true,
    hasExtraShot: true,
    pairingRecommendation: 'Try with Pinoy Spaghetti!'
  },
  {
    id: 'esp-5',
    category: 'espresso',
    name: 'Cappuccino',
    desc: 'Equal parts bold espresso, warm milk, and deep velvet foam layer.',
    basePrice: 105,
    price8oz: 105,
    price12oz: 125,
    price16oz: 145,
    hasSizes: true,
    hasMilk: true,
    hasSyrups: true,
    hasExtraShot: true,
    pairingRecommendation: 'Complements our Special Cassava cake.'
  },
  {
    id: 'esp-6',
    category: 'espresso',
    name: 'Caramel Macchiato',
    desc: 'Vanilla-infused milk marked with espresso and buttery caramel drizzle.',
    basePrice: 125,
    price8oz: 125,
    price12oz: 145,
    price16oz: 165,
    hasSizes: true,
    hasMilk: true,
    hasSyrups: true,
    hasExtraShot: true,
    pairingRecommendation: 'Customer favorite with Creamy Carbonara!'
  },
  {
    id: 'esp-7',
    category: 'espresso',
    name: 'Dirty Matcha',
    desc: 'Premium ceremonial grade matcha latte spiked with a fresh espresso shot.',
    basePrice: 155,
    price8oz: 155,
    price12oz: 175,
    price16oz: 195,
    hasSizes: true,
    hasMilk: true,
    hasSyrups: true,
    hasExtraShot: true,
    pairingRecommendation: 'A unique boost alongside Ham & Cheese.'
  },
  {
    id: 'esp-8',
    category: 'espresso',
    name: 'Salted Caramel Macchiato',
    desc: 'Sweet caramel latte finished with sea salt cream accents.',
    basePrice: 125,
    price8oz: 125,
    price12oz: 145,
    price16oz: 165,
    hasSizes: true,
    hasMilk: true,
    hasSyrups: true,
    hasExtraShot: true,
    pairingRecommendation: 'Pairs delightfully with Pinoy Spaghetti.'
  },
  {
    id: 'esp-9',
    category: 'espresso',
    name: 'Hazelnut Mocha',
    desc: 'Chocolate mocha enhanced with nutty hazelnut syrup.',
    basePrice: 125,
    price8oz: 125,
    price12oz: 145,
    price16oz: 165,
    hasSizes: true,
    hasMilk: true,
    hasSyrups: true,
    hasExtraShot: true,
    pairingRecommendation: 'Satisfying drink with Special Cassava.'
  },
  {
    id: 'esp-10',
    category: 'espresso',
    name: 'Spanish Latte',
    desc: 'Creamy espresso sweetened with condensed milk for a rich velvet finish.',
    basePrice: 125,
    price8oz: 125,
    price12oz: 145,
    price16oz: 165,
    hasSizes: true,
    hasMilk: true,
    hasSyrups: true,
    hasExtraShot: true,
    pairingRecommendation: 'Top bestseller paired with Creamy Carbonara!'
  },
  {
    id: 'esp-11',
    category: 'espresso',
    name: 'Pistachio Latte',
    desc: 'Luxurious espresso with roasted pistachio cream flavor.',
    basePrice: 155,
    price8oz: 155,
    price12oz: 175,
    price16oz: 195,
    hasSizes: true,
    hasMilk: true,
    hasSyrups: true,
    hasExtraShot: true,
    pairingRecommendation: 'Pairs wonderfully with Ham & Cheese.'
  },
  {
    id: 'esp-12',
    category: 'espresso',
    name: 'White Chocolate Mocha',
    desc: 'Espresso with sweet white chocolate sauce and creamy milk.',
    basePrice: 125,
    price8oz: 125,
    price12oz: 145,
    price16oz: 165,
    hasSizes: true,
    hasMilk: true,
    hasSyrups: true,
    hasExtraShot: true,
    pairingRecommendation: 'Great treat alongside Pinoy Spaghetti.'
  },

  // --- MILK-BASED ---
  {
    id: 'milk-1',
    category: 'milk',
    name: 'Biscoff Cheesecake w/scc',
    desc: 'Creamy milk with Lotus Biscoff flavor topped with salted cream cheese.',
    basePrice: 155,
    price8oz: 155,
    price12oz: 155,
    price16oz: 175,
    hasSizes: true,
    hasMilk: true,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Decadent pairing with Ham & Cheese!'
  },
  {
    id: 'milk-2',
    category: 'milk',
    name: 'Milo Dinosaur',
    desc: 'Iced chocolate malt milk crowned with extra rich Milo powder.',
    basePrice: 115,
    price8oz: 115,
    price12oz: 135,
    price16oz: 155,
    hasSizes: true,
    hasMilk: true,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Classic favorite for Pinoy Spaghetti lovers.'
  },
  {
    id: 'milk-3',
    category: 'milk',
    name: 'Dark Chocolate Lava',
    desc: 'Deep dark chocolate infusion melted into chilled whole milk.',
    basePrice: 115,
    price8oz: 115,
    price12oz: 135,
    price16oz: 155,
    hasSizes: true,
    hasMilk: true,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Pairs great with Special Cassava!'
  },
  {
    id: 'milk-4',
    category: 'milk',
    name: 'Matcha Latte',
    desc: 'Smooth japanese green tea matcha whisked with fresh milk.',
    basePrice: 125,
    price8oz: 125,
    price12oz: 145,
    price16oz: 165,
    hasSizes: true,
    hasMilk: true,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Refreshing with Creamy Carbonara.'
  },
  {
    id: 'milk-5',
    category: 'milk',
    name: 'Matcha Cheesecake w/scc',
    desc: 'Japanese matcha with cheesecake notes & salted cream cheese layer.',
    basePrice: 165,
    price8oz: 165,
    price12oz: 165,
    price16oz: 185,
    hasSizes: true,
    hasMilk: true,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Try with Special Cassava!'
  },
  {
    id: 'milk-6',
    category: 'milk',
    name: 'Nutella Cheesecake w/scc',
    desc: 'Hazelnut Nutella cheesecake milk drink topped with salted cream cheese.',
    basePrice: 155,
    price8oz: 155,
    price12oz: 155,
    price16oz: 175,
    hasSizes: true,
    hasMilk: true,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Delicious alongside Ham & Cheese.'
  },
  {
    id: 'milk-7',
    category: 'milk',
    name: 'Pistachio Cheesecake w/scc',
    desc: 'Rich pistachio milk blend crowned with savory salted cream cheese.',
    basePrice: 175,
    price8oz: 175,
    price12oz: 175,
    price16oz: 195,
    hasSizes: true,
    hasMilk: true,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Premium indulge with Creamy Carbonara!'
  },

  // --- ICECREAM-BASED FRAPPE ---
  {
    id: 'frappe-1',
    category: 'frappe',
    name: 'Dark Mocha Frappe',
    desc: 'Blended ice cream frappe with espresso shot and rich dark mocha.',
    basePrice: 175,
    price8oz: null,
    price12oz: 175,
    price16oz: 205,
    hasSizes: true,
    hasMilk: false,
    hasSyrups: false,
    hasExtraShot: true,
    pairingRecommendation: 'Perfect cold treat with Ham & Cheese!'
  },
  {
    id: 'frappe-2',
    category: 'frappe',
    name: 'Espresso Vanilla Frappe',
    desc: 'Vanilla ice cream blended with fresh espresso shot.',
    basePrice: 165,
    price8oz: null,
    price12oz: 165,
    price16oz: 195,
    hasSizes: true,
    hasMilk: false,
    hasSyrups: false,
    hasExtraShot: true,
    pairingRecommendation: 'Pairs with Special Cassava!'
  },
  {
    id: 'frappe-3',
    category: 'frappe',
    name: 'Chocolate Chips Frappe',
    desc: 'Creamy chocolate ice cream blended with crunchy chocolate chips.',
    basePrice: 165,
    price8oz: null,
    price12oz: 165,
    price16oz: 195,
    hasSizes: true,
    hasMilk: false,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Great combo with Pinoy Spaghetti.'
  },
  {
    id: 'frappe-4',
    category: 'frappe',
    name: 'Biscoff Cheesecake Frappe',
    desc: 'Blended ice cream frappe loaded with Lotus Biscoff and cheesecake.',
    basePrice: 175,
    price8oz: null,
    price12oz: 175,
    price16oz: 205,
    hasSizes: true,
    hasMilk: false,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Indulgent match with Creamy Carbonara!'
  },
  {
    id: 'frappe-5',
    category: 'frappe',
    name: 'Oreo Tiramisu Frappe',
    desc: 'Crushed Oreo cookies and coffee tiramisu blended ice cream frappe.',
    basePrice: 165,
    price8oz: null,
    price12oz: 165,
    price16oz: 195,
    hasSizes: true,
    hasMilk: false,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Awesome dessert frappe!'
  },
  {
    id: 'frappe-6',
    category: 'frappe',
    name: 'Ube Cheese Frappe',
    desc: 'Filipino purple yam (ube) and cheese blended ice cream frappe.',
    basePrice: 165,
    price8oz: null,
    price12oz: 165,
    price16oz: 195,
    hasSizes: true,
    hasMilk: false,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Authentic Pinoy flavor pairing with Special Cassava!'
  },
  {
    id: 'frappe-7',
    category: 'frappe',
    name: 'Strawberry & Cream Frappe',
    desc: 'Real strawberry puree blended with vanilla ice cream and cream topping.',
    basePrice: 175,
    price8oz: null,
    price12oz: 175,
    price16oz: 205,
    hasSizes: true,
    hasMilk: false,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Fruity favorite with Ham & Cheese!'
  },
  {
    id: 'frappe-8',
    category: 'frappe',
    name: 'Nutella Cheesecake Frappe',
    desc: 'Rich Nutella chocolate hazelnut and cheesecake ice cream blend.',
    basePrice: 175,
    price8oz: null,
    price12oz: 175,
    price16oz: 205,
    hasSizes: true,
    hasMilk: false,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Decadent delight with Creamy Carbonara.'
  },
  {
    id: 'frappe-9',
    category: 'frappe',
    name: 'Matchamisu Frappe',
    desc: 'Matcha green tea meets tiramisu ice cream frappe fusion.',
    basePrice: 165,
    price8oz: null,
    price12oz: 165,
    price16oz: 195,
    hasSizes: true,
    hasMilk: false,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Pairs nicely with Special Cassava!'
  },
  {
    id: 'frappe-10',
    category: 'frappe',
    name: 'Mango Graham Frappe',
    desc: 'Tropical Philippine mango blended with graham crumbs and cream.',
    basePrice: 165,
    price8oz: null,
    price12oz: 165,
    price16oz: 195,
    hasSizes: true,
    hasMilk: false,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Top Pinoy favorite with Pinoy Spaghetti!'
  },
  {
    id: 'frappe-11',
    category: 'frappe',
    name: 'Pistachio Cheesecake Frappe',
    desc: 'Premium pistachio nuts blended with cheesecake ice cream.',
    basePrice: 195,
    price8oz: null,
    price12oz: 195,
    price16oz: 225,
    hasSizes: true,
    hasMilk: false,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Ultra rich frappe treat!'
  },

  // --- QUICK BITES ---
  {
    id: 'bites-1',
    category: 'quickbites',
    name: 'Creamy Carbonara',
    desc: 'Rich pasta in savory white cream sauce topped with parmesan and crisp bacon bits.',
    basePrice: 135,
    price8oz: null,
    price12oz: null,
    price16oz: null,
    hasSizes: false,
    hasMilk: false,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Pairs amazingly with Spanish Latte or Biscoff Latte!'
  },
  {
    id: 'bites-2',
    category: 'quickbites',
    name: 'Pinoy Spaghetti',
    desc: 'Classic Filipino style sweet savory spaghetti topped with hotdogs & melted cheese.',
    basePrice: 125,
    price8oz: null,
    price12oz: null,
    price16oz: null,
    hasSizes: false,
    hasMilk: false,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Great match with Milo Dinosaur or Mango Graham Frappe!'
  },
  {
    id: 'bites-3',
    category: 'quickbites',
    name: 'Special Cassava',
    desc: 'Traditional baked Filipino cassava cake topped with rich caramel cheese glaze.',
    basePrice: 85,
    price8oz: null,
    price12oz: null,
    price16oz: null,
    hasSizes: false,
    hasMilk: false,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Enjoy with Americano or Ube Cheese Frappe!'
  },
  {
    id: 'bites-4',
    category: 'quickbites',
    name: 'Ham & Cheese',
    desc: 'Warm toasted sandwich stuffed with savory ham slices and melted cheddar cheese.',
    basePrice: 115,
    price8oz: null,
    price12oz: null,
    price16oz: null,
    hasSizes: false,
    hasMilk: false,
    hasSyrups: false,
    hasExtraShot: false,
    pairingRecommendation: 'Best pairing with Cafe Latte or Dirty Matcha!'
  }
];

const TAX_RATE = 0.12; // 12% VAT in Philippines
const DELIVERY_FEE = 49.00; // PHP 49 Delivery fee
const API_BASE_URL = window.location.protocol.startsWith('http')
  ? `${window.location.origin}/api`
  : 'http://127.0.0.1:5000/api';

/* App State */
let OrderState = {
  cart: [],
  fulfillmentMode: 'pickup', // 'pickup' or 'delivery'
  selectedOptions: {} // tracks temporary size/milk selection per item card
};

/* View Switcher State & Handler */
let currentViewMode = 'menu'; // 'menu', 'cart', 'split'

function setViewMode(mode, shouldScroll = true) {
  currentViewMode = mode;
  const gridContainer = document.getElementById('order-grid-container');
  const pillMenu = document.getElementById('view-pill-menu');
  const pillCart = document.getElementById('view-pill-cart');
  const splitToggleText = document.getElementById('split-toggle-text');
  const floatingBar = document.getElementById('floating-order-bar');
  if (!gridContainer) return;

  gridContainer.classList.remove('view-mode-menu-only', 'view-mode-cart-only');
  pillMenu?.classList.remove('active');
  pillCart?.classList.remove('active');

  const totalCount = OrderState.cart.reduce((sum, item) => sum + item.qty, 0);

  if (mode === 'menu') {
    gridContainer.classList.add('view-mode-menu-only');
    pillMenu?.classList.add('active');
    if (splitToggleText) splitToggleText.textContent = 'Side-by-Side';
    if (floatingBar && totalCount > 0) floatingBar.style.display = 'block';
  } else if (mode === 'cart') {
    gridContainer.classList.add('view-mode-cart-only');
    pillCart?.classList.add('active');
    if (splitToggleText) splitToggleText.textContent = 'Side-by-Side';
    if (floatingBar) floatingBar.style.display = 'none';
    setTimeout(() => {
      if (typeof deliveryLeafletMap !== 'undefined' && deliveryLeafletMap) {
        deliveryLeafletMap.invalidateSize();
      }
    }, 150);
  } else if (mode === 'split') {
    pillMenu?.classList.add('active');
    pillCart?.classList.add('active');
    if (splitToggleText) splitToggleText.textContent = 'Separate Views';
    if (floatingBar) floatingBar.style.display = 'none';
    setTimeout(() => {
      if (typeof deliveryLeafletMap !== 'undefined' && deliveryLeafletMap) {
        deliveryLeafletMap.invalidateSize();
      }
    }, 150);
  }

  if (shouldScroll) {
    const switcher = document.getElementById('view-switcher-bar');
    if (switcher) {
      switcher.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 80, behavior: 'smooth' });
    }
  }
}

function initViewSwitcher() {
  const pillMenu = document.getElementById('view-pill-menu');
  const pillCart = document.getElementById('view-pill-cart');
  const btnToggleSplit = document.getElementById('btn-toggle-split');
  const btnCartBackMenu = document.getElementById('btn-cart-back-menu');
  const btnFloatingViewOrder = document.getElementById('btn-floating-view-order');

  pillMenu?.addEventListener('click', () => setViewMode('menu'));
  pillCart?.addEventListener('click', () => setViewMode('cart'));
  btnCartBackMenu?.addEventListener('click', () => setViewMode('menu'));
  btnFloatingViewOrder?.addEventListener('click', () => setViewMode('cart'));

  btnToggleSplit?.addEventListener('click', () => {
    if (currentViewMode === 'split') {
      setViewMode('menu');
      showToast('Switched to Separate View tabs');
    } else {
      setViewMode('split');
      showToast('Switched to Side-by-Side View');
    }
  });

  // Default to menu view so products and cart are cleanly separated
  setViewMode('menu', false);
}

/* DOM Initialization */
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initNavigation();
  initFulfillmentToggle();
  initBYOCBuilder();
  renderMenu('all');
  initCategoryTabs();
  renderCart();
  initCheckoutForm();
  updateCheckoutFieldLabels(OrderState.fulfillmentMode);
  initMenuSearch();
  initViewSwitcher();
  initOrderTracker();
  fetchMenuFromDatabase();
});

async function fetchMenuFromDatabase() {
  try {
    const response = await fetch(`${API_BASE_URL}/menu`);
    if (response.ok) {
      const dbMenu = await response.json();
      if (Array.isArray(dbMenu) && dbMenu.length > 0) {
        MENU_DATA = dbMenu;
        const activeTab = document.querySelector('.cat-tab.active');
        const activeCat = activeTab ? activeTab.dataset.category : 'all';
        renderMenu(activeCat);
        console.log('Successfully loaded menu from Python Database API.');
      }
    }
  } catch (err) {
    console.warn('Could not connect to Python Database API, using local menu state:', err.message);
  }
}

/* LocalStorage Sync */
function loadState() {
  const savedCart = localStorage.getItem('jules_cafe_cart');
  if (savedCart) {
    try {
      OrderState.cart = JSON.parse(savedCart);
    } catch (e) {
      OrderState.cart = [];
    }
  }
}

function saveCart() {
  localStorage.setItem('jules_cafe_cart', JSON.stringify(OrderState.cart));
}

/* Navbar & Mobile Drawer */
function initNavigation() {
  const hamburger = document.getElementById('hamburger-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');

  hamburger.addEventListener('click', () => drawer.classList.add('open'));
  drawerClose.addEventListener('click', () => drawer.classList.remove('open'));
}

/* Pickup / Delivery Toggle Switcher */
function initFulfillmentToggle() {
  const btnPickup = document.getElementById('toggle-pickup');
  const btnDelivery = document.getElementById('toggle-delivery');
  const textMode = document.getElementById('current-fulfillment-text');
  const deliveryFeeRow = document.getElementById('delivery-fee-row');
  const switchBtn = document.getElementById('switch-mode-btn');

  btnPickup.addEventListener('click', () => setFulfillmentMode('pickup'));
  btnDelivery.addEventListener('click', () => setFulfillmentMode('delivery'));
  switchBtn.addEventListener('click', () => {
    const target = OrderState.fulfillmentMode === 'pickup' ? 'delivery' : 'pickup';
    setFulfillmentMode(target);
  });

  function setFulfillmentMode(mode) {
    OrderState.fulfillmentMode = mode;
    if (mode === 'pickup') {
      btnPickup.classList.add('active');
      btnDelivery.classList.remove('active');
      textMode.textContent = 'Pickup at Cafe';
      deliveryFeeRow.style.display = 'none';
      updateCheckoutFieldLabels('pickup');
    } else {
      btnDelivery.classList.add('active');
      btnPickup.classList.remove('active');
      textMode.textContent = 'Delivery';
      deliveryFeeRow.style.display = 'flex';
      updateCheckoutFieldLabels('delivery');
    }
    renderCart();
  }
}

/* Category Filtering & BYOC Toggle */
function initCategoryTabs() {
  const tabs = document.querySelectorAll('.cat-tab');
  const byocContainer = document.getElementById('byoc-builder-container');
  const menuContainer = document.getElementById('menu-items-container');

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      const targetBtn = e.target.closest('.cat-tab') || e.target;
      targetBtn.classList.add('active');
      const cat = targetBtn.dataset.category;

      if (cat === 'byoc') {
        if (byocContainer) byocContainer.style.display = 'block';
        if (menuContainer) menuContainer.style.display = 'none';
        updateBYOCState();
      } else {
        if (byocContainer) byocContainer.style.display = 'none';
        if (menuContainer) menuContainer.style.display = 'grid';
        renderMenu(cat);
      }
    });
  });

  // Check URL parameters for direct byoc link
  if (window.location.search.includes('byoc') || window.location.hash.includes('byoc')) {
    const byocTab = document.querySelector('.cat-tab[data-category="byoc"]');
    if (byocTab) byocTab.click();
  }
}

/* BUILD YOUR OWN COFFEE (BYOC) CUSTOMIZER LAB */
let BYOCState = {
  name: 'My Signature Brew',
  base: 'Single Espresso',
  basePrice: 95,
  temp: 'Hot Steamed',
  tempPrice: 0,
  size: '12oz Medium',
  sizePrice: 20,
  milk: 'Whole Milk',
  milkPrice: 0,
  syrup: 'No Syrup',
  syrupPrice: 0,
  topping: 'No Topping',
  toppingPrice: 0,
  extraShot: false,
  extraShotPrice: 30
};

function initBYOCBuilder() {
  const byocNameInput = document.getElementById('byoc-name');
  if (byocNameInput) {
    byocNameInput.addEventListener('input', (e) => {
      BYOCState.name = e.target.value.trim() || 'My Signature Brew';
      updateBYOCState();
    });
  }

  // Handle option button groups
  const optionGroups = ['base', 'temp', 'size', 'milk', 'syrup', 'topping'];
  optionGroups.forEach(groupKey => {
    const container = document.getElementById(`byoc-${groupKey}-options`);
    if (!container) return;

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.byoc-btn');
      if (!btn) return;

      container.querySelectorAll('.byoc-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const val = btn.dataset.val;
      const price = parseFloat(btn.dataset.price || 0);

      BYOCState[groupKey] = val;
      BYOCState[`${groupKey}Price`] = price;

      updateBYOCState();
    });
  });

  // Extra Shot Checkbox
  const extraShotChk = document.getElementById('byoc-extra-shot');
  if (extraShotChk) {
    extraShotChk.addEventListener('change', (e) => {
      BYOCState.extraShot = e.target.checked;
      updateBYOCState();
    });
  }

  // Add Custom Brew to Cart Button
  const addBtn = document.getElementById('byoc-add-cart-btn');
  if (addBtn) {
    addBtn.addEventListener('click', addBYOCToCart);
  }

  // Enter key inside AI prompt input
  const aiInput = document.getElementById('ai-coffee-prompt');
  if (aiInput) {
    aiInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitAiPrompt();
      }
    });
  }

  updateBYOCState();
}

/* AI Barista Recipe Generator & Auto-Selector */
window.askAiBarista = async function(moodKey) {
  const promptInput = document.getElementById('ai-coffee-prompt');
  const prompt = promptInput ? promptInput.value.trim() : '';
  await fetchAndApplyAiRecipe(prompt, moodKey);
};

window.submitAiPrompt = async function() {
  const promptInput = document.getElementById('ai-coffee-prompt');
  const prompt = promptInput ? promptInput.value.trim() : '';
  if (!prompt) {
    showToast('Please describe your coffee mood or craving first! ☕');
    return;
  }
  await fetchAndApplyAiRecipe(prompt, '');
};

async function fetchAndApplyAiRecipe(prompt, mood) {
  const btn = document.getElementById('btn-ai-generate');
  const originalHTML = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Barista Thinking...`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/ai-coffee-suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, mood })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      applyAiRecipe(data);
    } else {
      showToast('AI Barista is busy. Try another prompt!');
    }
  } catch (err) {
    console.warn('AI Barista API offline, using smart local generator:', err);
    applyFallbackAiRecipe(prompt, mood);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }
  }
}

function applyAiRecipe(data) {
  const nameInput = document.getElementById('byoc-name');
  if (nameInput) {
    nameInput.value = data.name;
    BYOCState.name = data.name;
  }

  const selectGroupOption = (groupId, groupKey, valName) => {
    const container = document.getElementById(groupId);
    if (!container) return;
    const btn = Array.from(container.querySelectorAll('.byoc-btn')).find(b => b.dataset.val === valName);
    if (btn) {
      container.querySelectorAll('.byoc-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      BYOCState[groupKey] = btn.dataset.val;
      BYOCState[`${groupKey}Price`] = parseFloat(btn.dataset.price || 0);
    }
  };

  if (data.base) selectGroupOption('byoc-base-options', 'base', data.base);
  if (data.temp) selectGroupOption('byoc-temp-options', 'temp', data.temp);
  if (data.size) selectGroupOption('byoc-size-options', 'size', data.size);
  if (data.milk) selectGroupOption('byoc-milk-options', 'milk', data.milk);
  if (data.syrup) selectGroupOption('byoc-syrup-options', 'syrup', data.syrup);
  if (data.topping) selectGroupOption('byoc-topping-options', 'topping', data.topping);

  const extraShotChk = document.getElementById('byoc-extra-shot');
  if (extraShotChk) {
    extraShotChk.checked = Boolean(data.extraShot);
    BYOCState.extraShot = Boolean(data.extraShot);
  }

  updateBYOCState();

  const rationaleBox = document.getElementById('ai-rationale-box');
  const recipeTitle = document.getElementById('ai-recipe-title');
  const recipeReason = document.getElementById('ai-recipe-reason');

  if (rationaleBox && recipeTitle && recipeReason) {
    const aiTag = data.ai_powered_by ? ` • ${data.ai_powered_by}` : '';
    recipeTitle.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> ${escapeHtml(data.name)} <small style="font-size:0.75rem; color:#d4a373; font-weight:normal;">${escapeHtml(aiTag)}</small>`;
    recipeReason.textContent = data.reason;
    rationaleBox.classList.remove('hidden');
  }

  showToast(`🤖 AI Barista created: "${data.name}"!`);
}

function applyFallbackAiRecipe(prompt, mood) {
  const fallbackData = {
    success: true,
    name: '🤖 AI Barista Specialty Blend',
    reason: 'AI Pick: Double Espresso + Oat Milk + Salted Cream Cheese Foam over ice for a smooth, refreshing boost.',
    base: 'Double Espresso',
    temp: 'Over Ice',
    size: '16oz Large',
    milk: 'Oat Milk',
    syrup: 'Caramel Syrup',
    topping: 'Salted Cream Cheese Foam',
    extraShot: true
  };
  applyAiRecipe(fallbackData);
}

function updateBYOCState() {
  // Calculate total price
  let total = BYOCState.basePrice + BYOCState.tempPrice + BYOCState.sizePrice +
              BYOCState.milkPrice + BYOCState.syrupPrice + BYOCState.toppingPrice;
  if (BYOCState.extraShot) total += BYOCState.extraShotPrice;

  // Update total DOM
  const totalElem = document.getElementById('byoc-total-price');
  if (totalElem) totalElem.textContent = `₱${total.toFixed(2)}`;

  // Update recipe summary list
  const summaryList = document.getElementById('byoc-summary-list');
  if (summaryList) {
    let itemsHTML = `
      <li><span>Base:</span> <strong>${BYOCState.base} (₱${BYOCState.basePrice})</strong></li>
      <li><span>Prep Style:</span> <strong>${BYOCState.temp} ${BYOCState.tempPrice ? `(+₱${BYOCState.tempPrice})` : ''}</strong></li>
      <li><span>Size:</span> <strong>${BYOCState.size} ${BYOCState.sizePrice ? `(+₱${BYOCState.sizePrice})` : ''}</strong></li>
      <li><span>Milk:</span> <strong>${BYOCState.milk} ${BYOCState.milkPrice ? `(+₱${BYOCState.milkPrice})` : ''}</strong></li>
      <li><span>Syrup:</span> <strong>${BYOCState.syrup} ${BYOCState.syrupPrice ? `(+₱${BYOCState.syrupPrice})` : ''}</strong></li>
      <li><span>Topping:</span> <strong>${BYOCState.topping} ${BYOCState.toppingPrice ? `(+₱${BYOCState.toppingPrice})` : ''}</strong></li>
    `;
    if (BYOCState.extraShot) {
      itemsHTML += `<li><span>Extra Shot:</span> <strong>Yes (+₱30)</strong></li>`;
    }
    summaryList.innerHTML = itemsHTML;
  }

  // Update virtual cup graphic & labels
  const labelElem = document.getElementById('cup-name-label');
  if (labelElem) labelElem.textContent = BYOCState.name;

  const iceElem = document.getElementById('cup-ice');
  const steamElem = document.getElementById('cup-steam');
  const liquidElem = document.getElementById('cup-liquid');
  const foamElem = document.getElementById('cup-foam');

  if (iceElem) {
    iceElem.style.display = (BYOCState.temp.includes('Ice') || BYOCState.temp.includes('Frappe')) ? 'block' : 'none';
  }
  if (steamElem) {
    steamElem.style.display = BYOCState.temp.includes('Hot') ? 'flex' : 'none';
  }

  // Liquid color based on milk / cold brew
  if (liquidElem) {
    if (BYOCState.milk.includes('Whole')) {
      liquidElem.style.background = '#8a5a36';
    } else if (BYOCState.milk.includes('Oat') || BYOCState.milk.includes('Almond')) {
      liquidElem.style.background = '#a67c52';
    } else if (BYOCState.milk.includes('Black')) {
      liquidElem.style.background = '#1f130b';
    } else {
      liquidElem.style.background = '#582f0e';
    }
  }

  // Foam layer
  if (foamElem) {
    if (BYOCState.topping !== 'No Topping' || BYOCState.milk !== 'Black / No Milk') {
      foamElem.style.height = BYOCState.topping.includes('Foam') ? '35px' : '20px';
      foamElem.style.display = 'block';
    } else {
      foamElem.style.display = 'none';
    }
  }
}

function addBYOCToCart() {
  let total = BYOCState.basePrice + BYOCState.tempPrice + BYOCState.sizePrice +
              BYOCState.milkPrice + BYOCState.syrupPrice + BYOCState.toppingPrice;
  if (BYOCState.extraShot) total += BYOCState.extraShotPrice;

  const descParts = [
    BYOCState.base,
    BYOCState.temp,
    BYOCState.size,
    BYOCState.milk,
    BYOCState.syrup !== 'No Syrup' ? BYOCState.syrup : null,
    BYOCState.topping !== 'No Topping' ? BYOCState.topping : null,
    BYOCState.extraShot ? '+Extra Shot' : null
  ].filter(Boolean);

  const cItemId = `byoc-${Date.now()}`;
  const customItem = {
    cartItemId: cItemId,
    id: cItemId,
    name: `🛠️ ${BYOCState.name}`,
    price: total,
    qty: 1,
    category: 'espresso',
    customText: descParts.join(', ')
  };

  // Push to cart
  const existingIdx = OrderState.cart.findIndex(c => c.name === customItem.name && c.customText === customItem.customText);
  if (existingIdx > -1) {
    OrderState.cart[existingIdx].qty += 1;
  } else {
    OrderState.cart.push(customItem);
  }

  saveCart();
  renderCart();
  showToast(`Added "${BYOCState.name}" to cart! ☕`);
}

/* Helper to get sizes available per item */
function getItemAvailableSizes(item) {
  if (!item.hasSizes) return [];
  if (item.category === 'frappe') {
    return ['12oz', '16oz'];
  } else if (item.category === 'espresso') {
    return ['8oz', '12oz', '16oz'];
  } else {
    return ['8oz', '12oz', '16oz'];
  }
}

/* Search text highlighting helper */
function highlightSearchMatch(text, query) {
  if (!text) return '';
  if (!query || !query.trim()) return escapeHtml(text);
  const q = query.trim();
  const lowerText = text.toLowerCase();
  const lowerQ = q.toLowerCase();
  const idx = lowerText.indexOf(lowerQ);
  if (idx === -1) return escapeHtml(text);

  const before = text.substring(0, idx);
  const match = text.substring(idx, idx + q.length);
  const after = text.substring(idx + q.length);
  return escapeHtml(before) + `<mark class="menu-search-highlight">${escapeHtml(match)}</mark>` + highlightSearchMatch(after, query);
}

/* Helper to get currently active category tab */
function getActiveCategory() {
  const activeTab = document.querySelector('.cat-tab.active');
  return activeTab ? activeTab.dataset.category : 'all';
}

/* Render Menu Cards with Stepper & Option Controls & Live Search */
function renderMenu(category = null) {
  if (!category) {
    category = getActiveCategory();
  }

  const container = document.getElementById('menu-items-container');
  if (!container) return;
  container.innerHTML = '';

  const searchInput = document.getElementById('menu-search-input');
  const clearBtn = document.getElementById('menu-search-clear');
  const statusBar = document.getElementById('search-status-bar');
  const statusText = document.getElementById('search-status-text');

  const query = (searchInput ? searchInput.value : '').trim().toLowerCase();

  // Toggle clear button
  if (clearBtn) {
    clearBtn.style.display = query ? 'flex' : 'none';
  }

  const CATEGORY_HEADERS = {
    'espresso': '<i class="fa-solid fa-mug-hot"></i> Espresso-Based',
    'milk': '<i class="fa-solid fa-glass-water"></i> Milk-Based',
    'frappe': '<i class="fa-solid fa-ice-cream"></i> Frappe',
    'quickbites': '<i class="fa-solid fa-utensils"></i> Quick Bites'
  };

  const allCategories = ['espresso', 'milk', 'frappe', 'quickbites'];
  const isSpecificCat = category && category !== 'all' && category !== 'byoc';

  // Filter condition: Match only item name, description, or category (DO NOT match pairing recommendations)
  const matchesQuery = (item) => {
    if (!query) return true;
    const nameMatch = (item.name || '').toLowerCase().includes(query);
    const descMatch = (item.desc || '').toLowerCase().includes(query);
    const catMatch = (item.category || '').toLowerCase().includes(query);
    return nameMatch || descMatch || catMatch;
  };

  // If specific category selected, check items in that category
  let categoriesToScan = isSpecificCat ? [category] : allCategories;
  let filteredItems = MENU_DATA.filter(item => categoriesToScan.includes(item.category) && matchesQuery(item));

  // Prioritize direct name matches at the top of search results
  if (query) {
    filteredItems.sort((a, b) => {
      const aName = (a.name || '').toLowerCase().includes(query) ? 1 : 0;
      const bName = (b.name || '').toLowerCase().includes(query) ? 1 : 0;
      return bName - aName;
    });
  }

  // Count items across all categories for cross-category hints
  let totalCrossMatches = 0;
  if (query && isSpecificCat && filteredItems.length === 0) {
    totalCrossMatches = MENU_DATA.filter(item => matchesQuery(item)).length;
  }

  // Update search status bar
  if (statusBar && statusText) {
    if (query) {
      statusBar.style.display = 'flex';
      const catName = CATEGORY_HEADERS[category] ? category.toUpperCase() : category;
      if (filteredItems.length > 0) {
        statusText.innerHTML = `Showing <strong>${filteredItems.length}</strong> ${filteredItems.length === 1 ? 'item' : 'items'} for "<strong>${escapeHtml(query)}</strong>"${isSpecificCat ? ` in ${catName}` : ''}`;
      } else if (totalCrossMatches > 0) {
        statusText.innerHTML = `No results in ${catName}, but found <strong>${totalCrossMatches}</strong> matches in other categories. <button type="button" class="btn-reset-search" style="margin-left: 8px; display: inline-flex;" onclick="switchToAllAndSearch()">View All ${totalCrossMatches} Matches</button>`;
      } else {
        statusText.innerHTML = `No menu items found matching "<strong>${escapeHtml(query)}</strong>"`;
      }
    } else {
      statusBar.style.display = 'none';
    }
  }

  // Empty state handling
  if (filteredItems.length === 0) {
    container.innerHTML = `
      <div class="menu-empty-search">
        <i class="fa-solid fa-mug-hot"></i>
        <h3>No menu items found</h3>
        <p>We couldn't find any drinks or bites matching "<strong>${escapeHtml(query)}</strong>". Try checking for Americano, Biscoff, Cheesecake, or Carbonara.</p>
        <button type="button" class="btn-clear-empty" onclick="clearMenuSearch()">
          <i class="fa-solid fa-rotate-left"></i> View Full Menu
        </button>
      </div>
    `;
    return;
  }

  // Render items grouped by category
  const categoriesToRender = allCategories.filter(catKey => filteredItems.some(i => i.category === catKey));

  categoriesToRender.forEach(catKey => {
    const catItems = filteredItems.filter(i => i.category === catKey);
    if (catItems.length === 0) return;

    if (category === 'all' || query || categoriesToRender.length > 1) {
      const headerDiv = document.createElement('div');
      headerDiv.className = 'category-section-title';
      headerDiv.style.cssText = 'grid-column: 1 / -1; margin-top: 1.5rem; margin-bottom: 0.5rem; border-bottom: 2px solid #d4a373; padding-bottom: 0.5rem; font-family: "Fraunces", serif; font-size: 1.3rem; color: #d4a373; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;';
      headerDiv.innerHTML = `
        <span>${CATEGORY_HEADERS[catKey] || catKey.toUpperCase()}</span>
        <span style="font-size: 0.85rem; font-family: var(--font-body); color: var(--text-muted); font-weight: normal;">${catItems.length} ${catItems.length === 1 ? 'item' : 'items'}</span>
      `;
      container.appendChild(headerDiv);
    }

    catItems.forEach(item => {
      const sizes = getItemAvailableSizes(item);
      const defaultSize = sizes.length > 0 ? (sizes.includes('12oz') ? '12oz' : sizes[0]) : null;

      // Initialize default options
      if (!OrderState.selectedOptions[item.id]) {
        OrderState.selectedOptions[item.id] = {
          qty: 1,
          size: defaultSize,
          milk: item.hasMilk ? 'Whole' : null,
          syrup: item.hasSyrups ? 'None' : null,
          extraShot: false
        };
      }

      const optState = OrderState.selectedOptions[item.id];
      const card = document.createElement('div');
      card.className = 'menu-card';

      let optionsHTML = '';
      if (sizes.length > 0 || item.hasMilk || item.hasSyrups || item.hasExtraShot) {
        optionsHTML += '<div class="options-wrapper">';
        
        if (sizes.length > 0) {
          optionsHTML += `
            <div class="option-row">
              <span class="option-group-label">Size:</span>
              ${sizes.map(size => `
                <button class="option-pill ${optState.size === size ? 'selected' : ''}" 
                  onclick="selectOption('${item.id}', 'size', '${size}')">${size}</button>
              `).join('')}
            </div>
          `;
        }

        if (item.hasMilk) {
          optionsHTML += `
            <div class="option-row">
              <span class="option-group-label">Milk:</span>
              ${['Whole', 'Oat (+₱25)', 'Almond (+₱25)'].map(milk => {
                const rawMilk = milk.split(' ')[0];
                return `
                  <button class="option-pill ${optState.milk === rawMilk ? 'selected' : ''}" 
                    onclick="selectOption('${item.id}', 'milk', '${rawMilk}')">${rawMilk}</button>
                `;
              }).join('')}
            </div>
          `;
        }

        if (item.hasSyrups) {
          optionsHTML += `
            <div class="option-row">
              <span class="option-group-label">Syrup (+₱20):</span>
              ${['None', 'Vanilla', 'Caramel', 'Hazelnut'].map(syrup => `
                <button class="option-pill ${optState.syrup === syrup ? 'selected' : ''}" 
                  onclick="selectOption('${item.id}', 'syrup', '${syrup}')">${syrup}</button>
              `).join('')}
            </div>
          `;
        }

        if (item.hasExtraShot) {
          optionsHTML += `
            <div class="option-row">
              <span class="option-group-label">Boost:</span>
              <button class="option-pill ${optState.extraShot ? 'selected' : ''}" 
                onclick="toggleOptionFlag('${item.id}', 'extraShot')">
                <i class="fa-solid fa-bolt"></i> + Extra Shot (+₱30)
              </button>
            </div>
          `;
        }

        optionsHTML += '</div>';
      }

      let baristaBadgeHTML = '';
      if (item.pairingRecommendation) {
        baristaBadgeHTML = `
          <div class="barista-rec-badge">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>${escapeHtml(item.pairingRecommendation)}</span>
          </div>
        `;
      }

      const highlightedName = highlightSearchMatch(item.name, query);
      const highlightedDesc = highlightSearchMatch(item.desc, query);

      const categoryMeta = {
        'espresso': { icon: 'fa-mug-hot', label: 'Espresso' },
        'milk': { icon: 'fa-glass-water', label: 'Milk-Based' },
        'frappe': { icon: 'fa-ice-cream', label: 'Frappe' },
        'quickbites': { icon: 'fa-utensils', label: 'Quick Bite' }
      };
      const catMeta = categoryMeta[item.category] || { icon: 'fa-mug-hot', label: 'Item' };

      const isOut = (item.isAvailable === false || item.isAvailable === 0);
      const outBadgeHTML = isOut ? `
        <span class="out-of-stock-pill" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; margin-left: 6px;">
          <i class="fa-solid fa-ban"></i> Out of Stock
        </span>
      ` : '';

      card.innerHTML = `
        <div class="item-info">
          <div class="item-card-top-tag">
            <i class="fa-solid ${catMeta.icon}"></i> <span>${catMeta.label}</span>
            ${outBadgeHTML}
          </div>
          <div class="item-title-row">
            <h4 class="item-name" style="${isOut ? 'opacity: 0.6;' : ''}">${highlightedName}</h4>
            <span class="item-price">₱${calculateItemUnitPrice(item, optState).toFixed(2)}</span>
          </div>
          <p class="item-desc" title="${escapeHtml(item.desc || '')}">${highlightedDesc}</p>
          ${baristaBadgeHTML}
          ${optionsHTML}
        </div>

        <div class="item-actions">
          <div class="stepper">
            <button type="button" class="step-btn" ${isOut ? 'disabled style="opacity:0.4;"' : `onclick="adjustStepper('${item.id}', -1)"`} aria-label="Decrease quantity">-</button>
            <span class="step-val" id="step-val-${item.id}">${optState.qty}</span>
            <button type="button" class="step-btn" ${isOut ? 'disabled style="opacity:0.4;"' : `onclick="adjustStepper('${item.id}', 1)"`} aria-label="Increase quantity">+</button>
          </div>
          <button type="button" class="btn-add-item" ${isOut ? 'disabled style="opacity:0.5; cursor:not-allowed; background:#6b7280;"' : `onclick="addItemToCart('${item.id}')"`}>
            ${isOut ? '<i class="fa-solid fa-ban"></i> Sold Out' : '<i class="fa-solid fa-plus"></i> Add'}
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  });
}

/* Initialize Menu Search Bar & Filter Chips */
function initMenuSearch() {
  const searchInput = document.getElementById('menu-search-input');
  const clearBtn = document.getElementById('menu-search-clear');
  const resetBtn = document.getElementById('btn-clear-search-filter');
  const chips = document.querySelectorAll('.quick-chip-btn');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      // If currently in BYOC view, switch to menu view
      const byocContainer = document.getElementById('byoc-builder-container');
      const menuContainer = document.getElementById('menu-items-container');
      const activeTab = document.querySelector('.cat-tab.active');
      if (activeTab && activeTab.dataset.category === 'byoc') {
        document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
        const allTab = document.querySelector('.cat-tab[data-category="all"]');
        if (allTab) allTab.classList.add('active');
        if (byocContainer) byocContainer.style.display = 'none';
        if (menuContainer) menuContainer.style.display = 'grid';
      }

      // Sync active chips state
      const val = searchInput.value.trim().toLowerCase();
      chips.forEach(chip => {
        const chipVal = chip.dataset.search.toLowerCase();
        chip.classList.toggle('active', val === chipVal);
      });

      renderMenu();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        clearMenuSearch();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', clearMenuSearch);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', clearMenuSearch);
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const term = chip.dataset.search;
      if (searchInput) {
        if (searchInput.value.trim().toLowerCase() === term.toLowerCase()) {
          searchInput.value = '';
          chip.classList.remove('active');
        } else {
          searchInput.value = term;
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
        }
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
      }
    });
  });

  // Check URL query parameters for ?search= or ?q=
  const urlParams = new URLSearchParams(window.location.search);
  const queryParam = urlParams.get('search') || urlParams.get('q');
  if (queryParam && searchInput) {
    searchInput.value = queryParam;
    searchInput.dispatchEvent(new Event('input'));
  }
}

window.clearMenuSearch = function() {
  const searchInput = document.getElementById('menu-search-input');
  if (searchInput) {
    searchInput.value = '';
    document.querySelectorAll('.quick-chip-btn').forEach(c => c.classList.remove('active'));
    renderMenu();
    searchInput.focus();
  }
};

window.switchToAllAndSearch = function() {
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  const allTab = document.querySelector('.cat-tab[data-category="all"]');
  if (allTab) allTab.classList.add('active');
  const byocContainer = document.getElementById('byoc-builder-container');
  const menuContainer = document.getElementById('menu-items-container');
  if (byocContainer) byocContainer.style.display = 'none';
  if (menuContainer) menuContainer.style.display = 'grid';
  renderMenu('all');
};

/* Dynamic Option Selection & Price Calculation */
function selectOption(itemId, optType, value) {
  if (!OrderState.selectedOptions[itemId]) return;
  OrderState.selectedOptions[itemId][optType] = value;
  const activeTab = document.querySelector('.cat-tab.active');
  renderMenu(activeTab ? activeTab.dataset.category : 'all');
}

function toggleOptionFlag(itemId, optType) {
  if (!OrderState.selectedOptions[itemId]) return;
  OrderState.selectedOptions[itemId][optType] = !OrderState.selectedOptions[itemId][optType];
  const activeTab = document.querySelector('.cat-tab.active');
  renderMenu(activeTab ? activeTab.dataset.category : 'all');
}

function adjustStepper(itemId, delta) {
  if (!OrderState.selectedOptions[itemId]) return;
  const current = OrderState.selectedOptions[itemId].qty;
  const next = Math.max(1, current + delta);
  OrderState.selectedOptions[itemId].qty = next;
  const valEl = document.getElementById(`step-val-${itemId}`);
  if (valEl) valEl.textContent = next;
}

function calculateItemUnitPrice(item, optState) {
  let price = item.basePrice;

  if (optState && optState.size) {
    if (optState.size === '8oz' && item.price8oz) price = item.price8oz;
    else if (optState.size === '12oz' && item.price12oz) price = item.price12oz;
    else if (optState.size === '16oz' && item.price16oz) price = item.price16oz;
  }

  if (optState) {
    if (optState.milk === 'Oat' || optState.milk === 'Almond') price += 25;
    if (optState.syrup && optState.syrup !== 'None') price += 20;
    if (optState.extraShot) price += 30;
  }

  return price;
}

/* Cart Management Logic */
function addItemToCart(itemId) {
  const item = MENU_DATA.find(i => i.id === itemId);
  if (!item) return;

  const opts = OrderState.selectedOptions[itemId] || { qty: 1 };
  const unitPrice = calculateItemUnitPrice(item, opts);

  // Build custom title for cart
  let customDetails = [];
  if (opts.size) customDetails.push(opts.size);
  if (opts.milk) customDetails.push(`${opts.milk} Milk`);
  if (opts.syrup && opts.syrup !== 'None') customDetails.push(`${opts.syrup} Syrup`);
  if (opts.extraShot) customDetails.push('+ Extra Shot');

  const cartItemId = `${itemId}-${opts.size || 'def'}-${opts.milk || 'def'}-${opts.syrup || 'none'}-${opts.extraShot ? 'shot' : 'noshot'}`;

  const existing = OrderState.cart.find(ci => ci.cartItemId === cartItemId);
  if (existing) {
    existing.qty += opts.qty;
  } else {
    OrderState.cart.push({
      cartItemId: cartItemId,
      id: item.id,
      name: item.name,
      price: unitPrice,
      qty: opts.qty,
      customText: customDetails.join(', ')
    });
  }

  // Reset quantity back to 1 for this card after adding
  if (OrderState.selectedOptions[itemId]) {
    OrderState.selectedOptions[itemId].qty = 1;
    const valEl = document.getElementById(`step-val-${itemId}`);
    if (valEl) valEl.textContent = 1;
  }

  saveCart();
  renderCart();
  showToast(`Added ${opts.qty}x ${item.name} to cart`);
}

function addRecommendedItem(itemId) {
  const item = MENU_DATA.find(i => i.id === itemId);
  if (!item) return;

  const sizes = getItemAvailableSizes(item);
  const defaultSize = sizes.length > 0 ? (sizes.includes('12oz') ? '12oz' : sizes[0]) : null;

  const defaultOpts = {
    qty: 1,
    size: defaultSize,
    milk: item.hasMilk ? 'Whole' : null,
    syrup: item.hasSyrups ? 'None' : null,
    extraShot: false
  };

  const unitPrice = calculateItemUnitPrice(item, defaultOpts);
  let customDetails = [];
  if (defaultOpts.size) customDetails.push(defaultOpts.size);
  if (defaultOpts.milk) customDetails.push(`${defaultOpts.milk} Milk`);
  if (defaultOpts.syrup && defaultOpts.syrup !== 'None') customDetails.push(`${defaultOpts.syrup} Syrup`);

  const cartItemId = `${itemId}-${defaultOpts.size || 'def'}-${defaultOpts.milk || 'def'}-${defaultOpts.syrup || 'none'}-${defaultOpts.extraShot ? 'shot' : 'noshot'}`;
  const existing = OrderState.cart.find(ci => ci.cartItemId === cartItemId);

  if (existing) {
    existing.qty += 1;
  } else {
    OrderState.cart.push({
      cartItemId: cartItemId,
      id: item.id,
      name: item.name,
      price: unitPrice,
      qty: 1,
      customText: customDetails.join(', ')
    });
  }

  saveCart();
  renderCart();
  showToast(`Added ${item.name} pairing to cart!`);
}

function removeFromCart(cartItemId) {
  OrderState.cart = OrderState.cart.filter(ci => (ci.cartItemId || ci.id) !== cartItemId);
  saveCart();
  renderCart();
}

function renderCart() {
  const listContainer = document.getElementById('cart-items-list');
  const emptyState = document.getElementById('cart-empty-state');
  const checkoutBtn = document.getElementById('checkout-btn');
  const badge = document.getElementById('cart-count-badge');

  listContainer.innerHTML = '';
  const totalCount = OrderState.cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = `${totalCount} item${totalCount !== 1 ? 's' : ''}`;

  const isLoggedIn = (window.JulesAuth && window.JulesAuth.isLoggedIn()) || !!localStorage.getItem('jules_auth_token');
  const authGateBox = document.getElementById('cart-auth-gate-box');

  if (OrderState.cart.length === 0) {
    emptyState.classList.remove('hidden');
    checkoutBtn.disabled = true;
    if (authGateBox) authGateBox.classList.add('hidden');
  } else {
    emptyState.classList.add('hidden');
    checkoutBtn.disabled = false;

    if (!isLoggedIn) {
      if (authGateBox) authGateBox.classList.remove('hidden');
      checkoutBtn.innerHTML = 'Proceed to Checkout <i class="fa-solid fa-arrow-right"></i>';
      checkoutBtn.classList.remove('btn-checkout-login-required');
    } else {
      if (authGateBox) authGateBox.classList.add('hidden');
      checkoutBtn.innerHTML = 'Proceed to Checkout <i class="fa-solid fa-arrow-right"></i>';
      checkoutBtn.classList.remove('btn-checkout-login-required');
    }

    OrderState.cart.forEach(item => {
      const cId = item.cartItemId || item.id;
      const li = document.createElement('li');
      li.className = 'cart-line-item';
      li.innerHTML = `
        <div class="cart-line-info">
          <span class="cart-line-title">${item.qty}x ${escapeHtml(item.name)}</span>
          ${item.customText ? `<span class="cart-line-option">${escapeHtml(item.customText)}</span>` : ''}
        </div>
        <div class="cart-line-right">
          <span class="cart-line-price">₱${(item.price * item.qty).toFixed(2)}</span>
          <button class="btn-remove-item" onclick="removeFromCart('${escapeHtml(cId)}')">Remove</button>
        </div>
      `;
      listContainer.appendChild(li);
    });
  }

  // Cost Calculations
  const subtotal = OrderState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * TAX_RATE;
  const isDelivery = OrderState.fulfillmentMode === 'delivery';
  const deliveryFee = (subtotal > 0 && isDelivery) ? DELIVERY_FEE : 0;
  const grandTotal = subtotal > 0 ? subtotal + tax + deliveryFee : 0;

  document.getElementById('subtotal-val').textContent = `₱${subtotal.toFixed(2)}`;
  document.getElementById('tax-val').textContent = `₱${tax.toFixed(2)}`;
  document.getElementById('total-val').textContent = `₱${grandTotal.toFixed(2)}`;

  // Synchronize Tab Badge and Floating Bottom Bar
  const viewCartBadge = document.getElementById('view-cart-counter-badge');
  if (viewCartBadge) {
    viewCartBadge.textContent = `${totalCount} item${totalCount !== 1 ? 's' : ''}`;
  }

  const floatingBar = document.getElementById('floating-order-bar');
  const floatingCount = document.getElementById('floating-item-count');
  const floatingTotal = document.getElementById('floating-total-price');
  if (floatingBar) {
    if (totalCount > 0 && currentViewMode !== 'cart') {
      floatingBar.style.display = 'block';
    } else {
      floatingBar.style.display = 'none';
    }
    if (floatingCount) floatingCount.textContent = `${totalCount} item${totalCount !== 1 ? 's' : ''}`;
    if (floatingTotal) floatingTotal.textContent = `₱${grandTotal.toFixed(2)}`;
  }

  renderSmartRecommendations();
}

/* Automated Smart Recommendations Renderer (Backend Engine) */
async function renderSmartRecommendations() {
  const recContainer = document.getElementById('cart-recommendations-container');
  if (!recContainer) return;

  try {
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart: OrderState.cart })
    });

    if (response.ok) {
      const recs = await response.json();
      if (Array.isArray(recs) && recs.length > 0) {
        recContainer.innerHTML = recs.map(rec => `
          <div class="rec-card-box">
            <div class="rec-header">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
              <span>${escapeHtml(rec.badge || 'Barista Recommendation')}</span>
            </div>
            <p class="rec-desc">${escapeHtml(rec.reason || rec.name)}</p>
            <button class="rec-add-btn" onclick="addRecommendedItem('${rec.id}')">
              <i class="fa-solid fa-plus"></i> Add ${escapeHtml(rec.name)} (₱${Number(rec.basePrice).toFixed(2)})
            </button>
          </div>
        `).join('');
        return;
      }
    }
  } catch (err) {
    console.warn('Backend recommendation API offline, using local recommendation rules:', err.message);
  }

  // Fallback client-side rules if backend API offline
  const hasEspresso = OrderState.cart.some(ci => ci.id.startsWith('esp'));
  const hasBites = OrderState.cart.some(ci => ci.id.startsWith('bites'));

  let recHTML = '';

  if (OrderState.cart.length > 0) {
    if (hasEspresso && !hasBites) {
      recHTML = `
        <div class="rec-card-box">
          <div class="rec-header">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>Automated Barista Pairing</span>
          </div>
          <p class="rec-desc">Complete your coffee with <strong>Creamy Carbonara</strong>!</p>
          <button class="rec-add-btn" onclick="addRecommendedItem('bites-1')">
            <i class="fa-solid fa-plus"></i> Add Creamy Carbonara (₱135.00)
          </button>
        </div>
      `;
    } else if (hasBites && !hasEspresso) {
      recHTML = `
        <div class="rec-card-box">
          <div class="rec-header">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>Automated Coffee Recommendation</span>
          </div>
          <p class="rec-desc">Enjoy your meal with our bestselling <strong>Spanish Latte</strong>!</p>
          <button class="rec-add-btn" onclick="addRecommendedItem('esp-10')">
            <i class="fa-solid fa-plus"></i> Add Spanish Latte (₱125.00)
          </button>
        </div>
      `;
    } else {
      recHTML = `
        <div class="rec-card-box">
          <div class="rec-header">
            <i class="fa-solid fa-mug-saucer"></i>
            <span>Barista Special</span>
          </div>
          <p class="rec-desc">Try adding our delicious <strong>Mango Graham Frappe</strong> to your order.</p>
          <button class="rec-add-btn" onclick="addRecommendedItem('frappe-10')">
            <i class="fa-solid fa-plus"></i> Add Mango Graham (₱165.00)
          </button>
        </div>
      `;
    }
  } else {
    recHTML = `
      <div class="rec-card-box empty-rec">
        <div class="rec-header">
          <i class="fa-solid fa-star"></i>
          <span>Popular House Pick</span>
        </div>
        <p class="rec-desc"><strong>Spanish Latte</strong> with rich condensed milk & espresso.</p>
        <button class="rec-add-btn" onclick="addRecommendedItem('esp-10')">
          <i class="fa-solid fa-plus"></i> Quick Order (₱125.00)
        </button>
      </div>
    `;
  }

  recContainer.innerHTML = recHTML;
}

/* ==========================================
   INTERACTIVE DELIVERY MAP & LOCATION LOGIC
   ========================================== */
const JULES_CAFE_COORDS = { lat: 7.1420, lng: 125.6265, name: 'Jules Cafe (PRK-2, Communal Road)' };
let deliveryLeafletMap = null;
let customerDeliveryMarker = null;
let cafeStoreMarker = null;
let reverseGeocodeTimeout = null;

const DAVAO_PRESETS = {
  communal: { lat: 7.1420, lng: 125.6265, name: 'PRK-2, Communal Road, Davao City' },
  buhangin: { lat: 7.1128, lng: 125.6174, name: 'Buhangin Central, Davao City' },
  lanang: { lat: 7.1009, lng: 125.6373, name: 'Lanang Premier Area, Davao City' }
};

function initDeliveryLeafletMap() {
  if (typeof L === 'undefined') return;

  const mapElem = document.getElementById('delivery-leaflet-map');
  if (!mapElem) return;

  if (deliveryLeafletMap) {
    setTimeout(() => {
      try {
        deliveryLeafletMap.invalidateSize();
      } catch (e) {}
    }, 150);
    return;
  }

  try {
    deliveryLeafletMap = L.map('delivery-leaflet-map', {
      center: [JULES_CAFE_COORDS.lat, JULES_CAFE_COORDS.lng],
      zoom: 15,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(deliveryLeafletMap);

    // Cafe Store Icon & Marker
    const cafeIcon = L.divIcon({
      className: 'custom-map-pin cafe-pin',
      html: '<div style="background:#2E1B10; color:#D9A75C; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid #D9A75C; box-shadow:0 2px 8px rgba(0,0,0,0.3); font-size:16px;">☕</div>',
      iconSize: [34, 34],
      iconAnchor: [17, 34]
    });

    cafeStoreMarker = L.marker([JULES_CAFE_COORDS.lat, JULES_CAFE_COORDS.lng], { icon: cafeIcon })
      .addTo(deliveryLeafletMap)
      .bindPopup('<strong>🏠 Jules Cafe (Store Origin)</strong><br>PRK-2, Communal Road, Davao City');

    // Customer Delivery Draggable Marker
    const customerIcon = L.divIcon({
      className: 'custom-map-pin customer-pin',
      html: '<div style="background:#e63946; color:#fff; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid #fff; box-shadow:0 3px 10px rgba(230,57,70,0.5); font-size:18px;"><i class="fa-solid fa-location-dot"></i></div>',
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    customerDeliveryMarker = L.marker([JULES_CAFE_COORDS.lat, JULES_CAFE_COORDS.lng], {
      draggable: true,
      icon: customerIcon
    }).addTo(deliveryLeafletMap);

    // Event on dragging pin
    customerDeliveryMarker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      handleDeliveryLocationUpdate(pos.lat, pos.lng);
    });

    // Event on clicking anywhere on the map
    deliveryLeafletMap.on('click', (e) => {
      customerDeliveryMarker.setLatLng(e.latlng);
      handleDeliveryLocationUpdate(e.latlng.lat, e.latlng.lng);
    });

    // Initial update
    handleDeliveryLocationUpdate(JULES_CAFE_COORDS.lat, JULES_CAFE_COORDS.lng, 'PRK-2, Communal Road, Davao City');

    // Bind Search and Presets
    initMapControls();

    setTimeout(() => {
      try {
        deliveryLeafletMap.invalidateSize();
      } catch (e) {}
    }, 200);
  } catch (e) {
    console.warn("Leaflet map initialization error:", e);
  }
}

function initMapControls() {
  // GPS Locate Button
  const btnGps = document.getElementById('btn-locate-gps');
  if (btnGps) {
    btnGps.addEventListener('click', () => {
      if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser.', 'error');
        return;
      }
      btnGps.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Locating...';
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          btnGps.innerHTML = '<i class="fa-solid fa-crosshairs"></i> Use GPS Location';
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          if (deliveryLeafletMap && customerDeliveryMarker) {
            deliveryLeafletMap.setView([lat, lng], 17);
            customerDeliveryMarker.setLatLng([lat, lng]);
            handleDeliveryLocationUpdate(lat, lng);
            showToast('📍 Delivery pin placed at your current GPS location!', 'success');
          }
        },
        (err) => {
          btnGps.innerHTML = '<i class="fa-solid fa-crosshairs"></i> Use GPS Location';
          showToast('Could not access GPS. Please pin your location on the map.', 'info');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  // Address Search Button & Enter Key
  const searchInput = document.getElementById('delivery-address-search');
  const searchBtn = document.getElementById('btn-search-address');

  async function performAddressSearch() {
    const query = searchInput?.value.trim();
    if (!query) return;
    searchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Davao City, Philippines')}&limit=1`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const displayName = data[0].display_name;
        if (deliveryLeafletMap && customerDeliveryMarker) {
          deliveryLeafletMap.setView([lat, lng], 16);
          customerDeliveryMarker.setLatLng([lat, lng]);
          handleDeliveryLocationUpdate(lat, lng, displayName);
          showToast(`📍 Found: ${displayName.split(',')[0]}`, 'success');
        }
      } else {
        showToast('Address not found. You can drag the pin on the map.', 'info');
      }
    } catch (e) {
      showToast('Search service busy. Drag the pin to your location.', 'info');
    } finally {
      searchBtn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
    }
  }

  if (searchBtn) searchBtn.addEventListener('click', performAddressSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performAddressSearch();
      }
    });
  }

  // Preset Location Buttons
  document.querySelectorAll('.btn-locate-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.dataset.preset;
      if (DAVAO_PRESETS[presetKey]) {
        const p = DAVAO_PRESETS[presetKey];
        if (deliveryLeafletMap && customerDeliveryMarker) {
          deliveryLeafletMap.setView([p.lat, p.lng], 16);
          customerDeliveryMarker.setLatLng([p.lat, p.lng]);
          handleDeliveryLocationUpdate(p.lat, p.lng, p.name);
        }
      }
    });
  });
}

function handleDeliveryLocationUpdate(lat, lng, knownAddress = null) {
  const distKm = calculateDistanceKm(JULES_CAFE_COORDS.lat, JULES_CAFE_COORDS.lng, lat, lng);
  const etaMins = Math.max(15, Math.round(15 + (distKm * 3.5)));

  // Update hidden inputs
  const latInput = document.getElementById('delivery-lat-val');
  const lngInput = document.getElementById('delivery-lng-val');
  const urlInput = document.getElementById('delivery-gmaps-url-val');
  
  if (latInput) latInput.value = lat.toFixed(6);
  if (lngInput) lngInput.value = lng.toFixed(6);

  // Direct turn-by-turn navigation URL in Google Maps
  const gmapsDirUrl = `https://www.google.com/maps/dir/?api=1&origin=${JULES_CAFE_COORDS.lat},${JULES_CAFE_COORDS.lng}&destination=${lat.toFixed(6)},${lng.toFixed(6)}`;
  if (urlInput) urlInput.value = gmapsDirUrl;

  const gmapsPreview = document.getElementById('preview-gmaps-link');
  if (gmapsPreview) gmapsPreview.href = gmapsDirUrl;

  // Update Distance Badge & ETA
  const distBadge = document.getElementById('delivery-dist-badge');
  if (distBadge) {
    distBadge.innerHTML = `<i class="fa-solid fa-motorcycle"></i> ${distKm.toFixed(1)} km from Cafe`;
  }

  const etaText = document.getElementById('delivery-eta-text');
  if (etaText) {
    etaText.textContent = `${etaMins}–${etaMins + 10} mins`;
  }

  const coordsDisplay = document.getElementById('loc-coords-display');
  if (coordsDisplay) {
    coordsDisplay.textContent = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
  }

  const addrDisplay = document.getElementById('loc-address-display');

  if (knownAddress) {
    if (addrDisplay) addrDisplay.textContent = knownAddress;
    return;
  }

  // Reverse Geocoding with Debounce
  if (addrDisplay) addrDisplay.textContent = "Looking up address...";
  clearTimeout(reverseGeocodeTimeout);
  reverseGeocodeTimeout = setTimeout(async () => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        const parts = data.display_name.split(',');
        const simplified = parts.slice(0, 3).join(', ');
        if (addrDisplay) addrDisplay.textContent = simplified || data.display_name;
      } else {
        if (addrDisplay) addrDisplay.textContent = `Davao Delivery Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      }
    } catch (e) {
      if (addrDisplay) addrDisplay.textContent = `Davao Delivery Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    }
  }, 400);
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/* Inline Checkout Form Handlers */
let uploadedReceiptBase64 = '';

function initCheckoutForm() {
  const checkoutBtn = document.getElementById('checkout-btn');
  const cartContent = document.getElementById('cart-content-panel');
  const checkoutPanel = document.getElementById('checkout-form-panel');
  const backBtn = document.getElementById('back-to-cart-btn');
  const form = document.getElementById('inline-checkout-form');
  const confirmScreen = document.getElementById('order-confirmed-screen');
  const btnNewOrder = document.getElementById('btn-new-order');

  // Payment method options
  const payCardCash = document.getElementById('pay-card-cash');
  const payCardGcash = document.getElementById('pay-card-gcash');
  const gcashPaymentBox = document.getElementById('gcash-payment-box');
  const btnCopyGcash = document.getElementById('btn-copy-gcash-num');
  const receiptInput = document.getElementById('cust-gcash-receipt');
  const receiptPreviewBox = document.getElementById('receipt-preview-box');
  const receiptPreviewThumb = document.getElementById('receipt-preview-thumb');
  const btnClearReceipt = document.getElementById('btn-clear-receipt');

  function setPaymentMethod(method) {
    const cashRadio = document.querySelector('input[name="checkout_payment_mode"][value="Cash"]');
    const gcashRadio = document.querySelector('input[name="checkout_payment_mode"][value="GCash"]');

    if (method === 'GCash') {
      if (gcashRadio) gcashRadio.checked = true;
      payCardCash?.classList.remove('active');
      payCardGcash?.classList.add('active');
      gcashPaymentBox?.classList.remove('hidden');
      updateGcashDueAmount();
    } else {
      if (cashRadio) cashRadio.checked = true;
      payCardCash?.classList.add('active');
      payCardGcash?.classList.remove('active');
      gcashPaymentBox?.classList.add('hidden');
    }
  }

  payCardCash?.addEventListener('click', () => setPaymentMethod('Cash'));
  payCardGcash?.addEventListener('click', () => setPaymentMethod('GCash'));

  // Copy GCash phone number
  btnCopyGcash?.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const phone = document.getElementById('gcash-phone-text')?.textContent.replace(/\s+/g, '') || '09082789023';
    try {
      await navigator.clipboard.writeText(phone);
      const label = document.getElementById('copy-btn-label');
      if (label) label.textContent = 'Copied!';
      btnCopyGcash.classList.add('copied');
      showToast('GCash number copied to clipboard! (0908 278 9023)', 'success');
      setTimeout(() => {
        if (label) label.textContent = 'Copy';
        btnCopyGcash.classList.remove('copied');
      }, 2000);
    } catch (err) {
      showToast('Please manual copy: 0908 278 9023', 'info');
    }
  });

  // QR Code Zoom Modal
  const btnZoomQr = document.getElementById('btn-zoom-qr');
  const qrModal = document.getElementById('qr-zoom-modal');
  const btnCloseQrModal = document.getElementById('btn-close-qr-modal');
  const qrBackdrop = document.getElementById('qr-modal-backdrop');

  btnZoomQr?.addEventListener('click', () => qrModal?.classList.remove('hidden'));
  btnCloseQrModal?.addEventListener('click', () => qrModal?.classList.add('hidden'));
  qrBackdrop?.addEventListener('click', () => qrModal?.classList.add('hidden'));

  // Receipt image upload preview
  receiptInput?.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image screenshot.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = function(evt) {
        uploadedReceiptBase64 = evt.target.result;
        if (receiptPreviewThumb) receiptPreviewThumb.src = uploadedReceiptBase64;
        if (receiptPreviewBox) receiptPreviewBox.classList.remove('hidden');
        showToast('Receipt attached successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  });

  btnClearReceipt?.addEventListener('click', () => {
    uploadedReceiptBase64 = '';
    if (receiptInput) receiptInput.value = '';
    if (receiptPreviewBox) receiptPreviewBox.classList.add('hidden');
  });

  checkoutBtn.addEventListener('click', () => {
    cartContent.classList.add('hidden');
    checkoutPanel.classList.remove('hidden');
    updateCheckoutFieldLabels(OrderState.fulfillmentMode);
    updateGcashDueAmount();

    // Prefill name & phone if available from auth or storage
    const authUser = window.JulesAuth?.getUser();
    const nameInput = document.getElementById('cust-name');
    const phoneInput = document.getElementById('cust-phone');
    if (authUser) {
      if (nameInput && !nameInput.value) nameInput.value = authUser.full_name || '';
      if (phoneInput && !phoneInput.value && authUser.phone) phoneInput.value = authUser.phone;
    } else {
      const savedName = localStorage.getItem('jules_customer_name');
      if (nameInput && !nameInput.value && savedName && savedName !== 'Guest') {
        nameInput.value = savedName;
      }
    }

    // If delivery mode, ensure Leaflet map computes viewport correctly
    if (OrderState.fulfillmentMode === 'delivery') {
      setTimeout(() => {
        initDeliveryLeafletMap();
        if (deliveryLeafletMap) deliveryLeafletMap.invalidateSize();
      }, 150);
    }
  });

  backBtn.addEventListener('click', () => {
    checkoutPanel.classList.add('hidden');
    cartContent.classList.remove('hidden');
  });

  // Real-time digit restriction & max length caps
  const phoneInputEl = document.getElementById('cust-phone');
  const gcashRefInputEl = document.getElementById('cust-gcash-ref');

  phoneInputEl?.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11);
  });

  gcashRefInputEl?.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 13);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('cust-name').value.trim();
    const phone = phoneInputEl ? phoneInputEl.value.trim() : '';
    const fulfillmentInfo = document.getElementById('cust-fulfillment-info') ? document.getElementById('cust-fulfillment-info').value.trim() : '';

    if (!name) {
      showToast('Please enter your name.', 'error');
      document.getElementById('cust-name')?.focus();
      return;
    }

    const isDelivery = OrderState.fulfillmentMode === 'delivery';

    // Validate Phone Number (must be exactly 11 digits)
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 11) {
      showToast('Please enter a valid 11-digit phone number (e.g., 09123456789).', 'error');
      phoneInputEl?.focus();
      return;
    }

    const selectedPaymentMethod = document.querySelector('input[name="checkout_payment_mode"]:checked')?.value || 'Cash';
    const gcashRef = gcashRefInputEl ? gcashRefInputEl.value.trim() : '';

    // Validate GCash Reference Number if paying with GCash (must be exactly 13 digits)
    if (selectedPaymentMethod === 'GCash') {
      const cleanRef = gcashRef.replace(/\D/g, '');
      if (!cleanRef) {
        showToast('GCash Reference Number is required for GCash payments.', 'error');
        gcashRefInputEl?.focus();
        return;
      }
      if (cleanRef.length !== 13) {
        showToast(`GCash Reference Number must be exactly 13 digits (you entered ${cleanRef.length} digits).`, 'error');
        gcashRefInputEl?.focus();
        return;
      }
    }

    const deliveryAddress = isDelivery ? (document.getElementById('loc-address-display')?.textContent || 'Davao City') : '';
    const deliveryLat = isDelivery ? parseFloat(document.getElementById('delivery-lat-val')?.value || JULES_CAFE_COORDS.lat) : null;
    const deliveryLng = isDelivery ? parseFloat(document.getElementById('delivery-lng-val')?.value || JULES_CAFE_COORDS.lng) : null;
    const deliveryMapsUrl = isDelivery ? (document.getElementById('delivery-gmaps-url-val')?.value || `https://www.google.com/maps?q=${deliveryLat},${deliveryLng}`) : '';
    const deliveryNotes = isDelivery ? (document.getElementById('delivery-notes')?.value.trim() || '') : '';

    const paymentSummaryText = selectedPaymentMethod === 'GCash' 
      ? `GCash (Ref #${gcashRef})`
      : (isDelivery ? 'Cash on Delivery (COD)' : 'Cash on Pickup');

    const combinedContact = isDelivery 
      ? `Phone: ${phone} | 💳 ${paymentSummaryText} | 📍 ${deliveryAddress} ${deliveryNotes ? `(${deliveryNotes})` : ''}`
      : (phone ? `Phone: ${phone} | 💳 ${paymentSummaryText}${fulfillmentInfo ? ' | ' + fulfillmentInfo : ''}` : `${fulfillmentInfo} | 💳 ${paymentSummaryText}`);

    const subtotal = OrderState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * TAX_RATE;
    const deliveryFee = (subtotal > 0 && isDelivery) ? DELIVERY_FEE : 0;
    const grandTotal = subtotal > 0 ? subtotal + tax + deliveryFee : 0;

    const orderPayload = {
      customer_name: name,
      fulfillment_mode: OrderState.fulfillmentMode,
      contact_info: combinedContact,
      delivery_address: deliveryAddress,
      delivery_lat: deliveryLat,
      delivery_lng: deliveryLng,
      delivery_maps_url: deliveryMapsUrl,
      delivery_notes: deliveryNotes,
      cart: OrderState.cart,
      subtotal: subtotal,
      tax: tax,
      total: grandTotal,
      payment_method: selectedPaymentMethod,
      payment_reference: selectedPaymentMethod === 'GCash' ? gcashRef : '',
      payment_status: selectedPaymentMethod === 'GCash' ? 'Pending Verification' : 'Pending',
      payment_receipt: uploadedReceiptBase64
    };

    let refNumber = null;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Order...';
    }

    try {
      const orderHeaders = { 'Content-Type': 'application/json' };
      const authToken = localStorage.getItem('jules_auth_token');
      if (authToken && authToken !== 'null' && authToken !== 'undefined') {
        orderHeaders['Authorization'] = `Bearer ${authToken}`;
        orderHeaders['X-Auth-Token'] = authToken;
      }
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: orderHeaders,
        body: JSON.stringify(orderPayload)
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
        showToast(result.error || 'Failed to place order. Please try again.', 'error');
        if (response.status === 401 && window.JulesAuth) {
          window.JulesAuth.openLogin();
        }
        return;
      }

      refNumber = result.order_id;
      localStorage.setItem('jules_last_order_id', refNumber);
      if (name) localStorage.setItem('jules_customer_name', name);
    } catch (err) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
      console.error('Error posting order:', err);
      showToast('Could not connect to the server. Please check your connection and try again.', 'error');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }

    checkoutPanel.classList.add('hidden');
    confirmScreen.classList.remove('hidden');
    
    document.getElementById('confirm-name').textContent = name;
    document.getElementById('confirm-ref').textContent = refNumber;

    // Update Confirmation Payment Banner
    const confirmPaySummary = document.getElementById('confirm-payment-summary');
    if (confirmPaySummary) {
      if (selectedPaymentMethod === 'GCash') {
        confirmPaySummary.innerHTML = `<strong>GCash Express</strong> &bull; Ref #${escapeHtml(gcashRef)} <span style="display:inline-block; font-size:0.75rem; background:#fef3c7; color:#b45309; padding:1px 6px; border-radius:10px; margin-left:4px;">Pending Verification</span>`;
      } else {
        confirmPaySummary.innerHTML = `<strong>${isDelivery ? 'Cash on Delivery (COD)' : 'Cash on Pickup'}</strong> &bull; Total: ₱${grandTotal.toFixed(2)}`;
      }
    }
    
    const confirmDeliverySection = document.getElementById('confirm-delivery-details');
    const confirmDeliveryAddr = document.getElementById('confirm-delivery-addr');
    const confirmGmapsLink = document.getElementById('confirm-gmaps-link');
    const confirmInstructions = document.getElementById('confirm-instructions');

    if (isDelivery) {
      if (confirmDeliverySection) confirmDeliverySection.classList.remove('hidden');
      if (confirmDeliveryAddr) confirmDeliveryAddr.textContent = `${deliveryAddress} ${deliveryNotes ? `(Notes: ${deliveryNotes})` : ''}`;
      if (confirmGmapsLink) confirmGmapsLink.href = deliveryMapsUrl;
      if (confirmInstructions) confirmInstructions.textContent = "Your barista is crafting your order. Rider will deliver to your pinned location.";
    } else {
      if (confirmDeliverySection) confirmDeliverySection.classList.add('hidden');
      if (confirmInstructions) confirmInstructions.textContent = "We'll have your order ready for pickup in 15–20 minutes.";
    }

    // Attach Track Order button dynamically to confirmation screen if not present
    let trackCtaBtn = document.getElementById('confirm-track-cta-btn');
    if (!trackCtaBtn && confirmScreen) {
      const ctaWrap = document.createElement('div');
      ctaWrap.style.marginTop = '20px';
      ctaWrap.style.textAlign = 'center';
      ctaWrap.innerHTML = `
        <button type="button" id="confirm-track-cta-btn" class="btn-action" style="padding: 12px 24px; font-size: 1.05rem;">
          <i class="fa-solid fa-location-crosshairs"></i> Track Order #${refNumber} Live Status &rarr;
        </button>
      `;
      confirmScreen.appendChild(ctaWrap);
      document.getElementById('confirm-track-cta-btn')?.addEventListener('click', () => {
        if (window.openOrderTrackerModalWithId) {
          window.openOrderTrackerModalWithId(refNumber);
        }
      });
    } else if (trackCtaBtn) {
      trackCtaBtn.innerHTML = `<i class="fa-solid fa-location-crosshairs"></i> Track Order #${refNumber} Live Status &rarr;`;
      trackCtaBtn.onclick = () => {
        if (window.openOrderTrackerModalWithId) {
          window.openOrderTrackerModalWithId(refNumber);
        }
      };
    }

    // Reset payment fields & clear cart state
    uploadedReceiptBase64 = '';
    if (receiptInput) receiptInput.value = '';
    if (gcashRefInput) gcashRefInput.value = '';
    if (receiptPreviewBox) receiptPreviewBox.classList.add('hidden');
    setPaymentMethod('Cash');

    OrderState.cart = [];
    saveCart();
  });

  btnNewOrder.addEventListener('click', () => {
    OrderState.cart = [];
    saveCart();
    renderCart();
    confirmScreen.classList.add('hidden');
    cartContent.classList.remove('hidden');
    setViewMode('menu', true);
  });
}

function updateGcashDueAmount() {
  const isDelivery = OrderState.fulfillmentMode === 'delivery';
  const subtotal = OrderState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * TAX_RATE;
  const deliveryFee = (subtotal > 0 && isDelivery) ? DELIVERY_FEE : 0;
  const grandTotal = subtotal > 0 ? subtotal + tax + deliveryFee : 0;

  const dueEl = document.getElementById('gcash-due-total');
  if (dueEl) dueEl.textContent = `₱${grandTotal.toFixed(2)}`;

  const stepEl = document.getElementById('gcash-step-amount');
  if (stepEl) stepEl.textContent = `${grandTotal.toFixed(2)}`;
}

function updateCheckoutFieldLabels(mode) {
  const label = document.getElementById('fulfillment-input-label');
  const input = document.getElementById('cust-fulfillment-info');
  const fieldGroup = document.getElementById('fulfillment-field-group');
  const deliveryMapSection = document.getElementById('delivery-map-section');
  const payBtn = document.getElementById('pay-now-btn');

  // Update payment titles based on pickup vs delivery
  const cashTitle = document.getElementById('cash-option-title');
  const cashSub = document.getElementById('cash-option-sub');

  if (mode === 'delivery') {
    if (cashTitle) cashTitle.textContent = 'Cash on Delivery (COD)';
    if (cashSub) cashSub.textContent = 'Pay rider cash upon delivery';

    if (fieldGroup) fieldGroup.classList.add('hidden');
    if (input) {
      input.removeAttribute('required');
      input.required = false;
    }
    if (deliveryMapSection) deliveryMapSection.classList.remove('hidden');
    setTimeout(() => {
      initDeliveryLeafletMap();
      if (deliveryLeafletMap) deliveryLeafletMap.invalidateSize();
    }, 100);
  } else {
    if (cashTitle) cashTitle.textContent = 'Cash on Pickup';
    if (cashSub) cashSub.textContent = 'Pay cashier at counter';

    if (fieldGroup) fieldGroup.classList.remove('hidden');
    if (input) {
      input.setAttribute('required', 'true');
      input.required = true;
    }
    if (deliveryMapSection) deliveryMapSection.classList.add('hidden');
    if (label) label.textContent = 'Pickup Time *';
    if (input) input.placeholder = 'e.g., ASAP (approx 15 mins)';
  }

  updateGcashDueAmount();
}

/* Toast Utility */
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast-message');
  if (!toast) return;
  const toastText = document.getElementById('toast-text');
  if (toastText) toastText.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* Order Tracker System */
let trackerInterval = null;

function initOrderTracker() {
  const btnOpen = document.getElementById('btn-open-tracker');
  const btnOpenMobile = document.getElementById('btn-open-tracker-mobile');
  const modal = document.getElementById('order-tracker-modal');
  const btnClose = document.getElementById('btn-close-tracker-modal');
  const backdrop = document.getElementById('tracker-modal-backdrop');
  const searchBtn = document.getElementById('tracker-search-btn');
  const input = document.getElementById('tracker-id-input');

  const openTracker = (orderId = '') => {
    if (modal) {
      modal.classList.remove('hidden');
      const targetId = orderId || localStorage.getItem('jules_last_order_id') || '';
      if (input && targetId) input.value = targetId;
      if (targetId) {
        fetchOrderTrackerStatus(targetId);
      }
    }
  };

  btnOpen?.addEventListener('click', () => openTracker());
  btnOpenMobile?.addEventListener('click', () => openTracker());

  const closeTracker = () => {
    if (modal) modal.classList.add('hidden');
    if (trackerInterval) {
      clearInterval(trackerInterval);
      trackerInterval = null;
    }
  };

  btnClose?.addEventListener('click', closeTracker);
  backdrop?.addEventListener('click', closeTracker);

  searchBtn?.addEventListener('click', () => {
    const id = input ? input.value.trim() : '';
    if (id) fetchOrderTrackerStatus(id);
    else showToast('Please enter an Order ID to track.', 'error');
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const id = input.value.trim();
      if (id) fetchOrderTrackerStatus(id);
    }
  });

  window.openOrderTrackerModalWithId = openTracker;
}

async function fetchOrderTrackerStatus(orderId) {
  const container = document.getElementById('tracker-result-container');
  if (!container) return;

  container.style.display = 'block';
  container.innerHTML = `<div class="tracker-loading"><i class="fa-solid fa-circle-notch fa-spin"></i> Fetching live status for Order #${escapeHtml(orderId)}...</div>`;

  try {
    const res = await fetch(`${API_BASE_URL}/orders/track/${orderId}`);
    if (!res.ok) {
      if (trackerInterval) {
        clearInterval(trackerInterval);
        trackerInterval = null;
      }
      container.innerHTML = `
        <div class="tracker-error">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p>Order #${escapeHtml(orderId)} was not found. Please double check your Order ID.</p>
        </div>
      `;
      return;
    }

    const order = await res.json();
    renderTrackerStatus(order);

    // Auto refresh status every 5s while tracker is active
    if (trackerInterval) clearInterval(trackerInterval);
    trackerInterval = setInterval(async () => {
      try {
        const r = await fetch(`${API_BASE_URL}/orders/track/${orderId}`);
        if (r.ok) {
          const updated = await r.json();
          renderTrackerStatus(updated);
        }
      } catch (e) {}
    }, 5000);

  } catch (err) {
    if (trackerInterval) {
      clearInterval(trackerInterval);
      trackerInterval = null;
    }
    container.innerHTML = `
      <div class="tracker-error">
        <i class="fa-solid fa-wifi"></i>
        <p>Could not connect to live order server.</p>
      </div>
    `;
  }
}

function renderTrackerStatus(order) {
  const container = document.getElementById('tracker-result-container');
  if (!container) return;

  const statusMap = {
    'Pending': 1,
    'Preparing': 2,
    'Ready': 3,
    'Completed': 4,
    'Cancelled': 0
  };

  const currentStep = statusMap[order.status] || 1;
  const isCancelled = order.status === 'Cancelled';

  const itemsHtml = (order.items || []).map(item => `
    <div class="tracker-item-row">
      <span><strong>${item.quantity}x</strong> ${escapeHtml(item.item_name)} ${item.custom_options ? `<small>(${escapeHtml(item.custom_options)})</small>` : ''}</span>
      <span>₱${(item.unit_price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="tracker-card-content">
      <div class="tracker-order-info">
        <div>
          <h4>Order #${order.id}</h4>
          <span class="tracker-cust-name"><i class="fa-solid fa-user"></i> ${escapeHtml(order.customer_name)}</span>
        </div>
        <div class="tracker-time-badge">
          <i class="fa-solid fa-clock"></i> Est: <strong>${order.estimated_time}</strong>
        </div>
      </div>

      ${isCancelled ? `
        <div class="tracker-cancelled-banner">
          <i class="fa-solid fa-circle-xmark"></i> This order has been cancelled.
        </div>
      ` : `
        <div class="tracker-steps-bar">
          <div class="step-item ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}">
            <div class="step-icon"><i class="fa-solid fa-receipt"></i></div>
            <span class="step-label">Placed</span>
          </div>
          <div class="step-line ${currentStep >= 2 ? 'completed' : ''}"></div>
          <div class="step-item ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}">
            <div class="step-icon"><i class="fa-solid fa-fire-burner"></i></div>
            <span class="step-label">Preparing</span>
          </div>
          <div class="step-line ${currentStep >= 3 ? 'completed' : ''}"></div>
          <div class="step-item ${currentStep >= 3 ? 'completed' : ''} ${currentStep === 3 ? 'active' : ''}">
            <div class="step-icon"><i class="fa-solid ${order.fulfillment_mode === 'delivery' ? 'fa-motorcycle' : 'fa-bell-concierge'}"></i></div>
            <span class="step-label">${order.fulfillment_mode === 'delivery' ? 'Delivering' : 'Ready'}</span>
          </div>
          <div class="step-line ${currentStep >= 4 ? 'completed' : ''}"></div>
          <div class="step-item ${currentStep >= 4 ? 'completed' : ''} ${currentStep === 4 ? 'active' : ''}">
            <div class="step-icon"><i class="fa-solid fa-circle-check"></i></div>
            <span class="step-label">Completed</span>
          </div>
        </div>
      `}

      ${order.fulfillment_mode === 'delivery' ? `
        <div class="tracker-delivery-box" style="background: rgba(217, 167, 92, 0.08); border: 1px solid rgba(217, 167, 92, 0.3); border-radius: 10px; padding: 14px; margin: 15px 0; text-align: left;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <strong style="color:#d9a75c; font-size:0.9rem; display:flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-motorcycle"></i> Delivery Details
            </strong>
            <span style="font-size:0.75rem; background:#24160d; color:#d9a75c; padding:2px 8px; border-radius:12px; border:1px solid #d9a75c;">
              ${order.status === 'Ready' ? 'Rider on the Way' : (order.status === 'Completed' ? 'Delivered' : 'Preparing Order')}
            </span>
          </div>
          <p style="margin:4px 0; font-size:0.85rem; color:#fff;">
            <i class="fa-solid fa-location-dot" style="color:#e63946; margin-right:6px;"></i>
            <strong>Address:</strong> ${escapeHtml(order.delivery_address || 'Davao City')}
          </p>
          ${order.delivery_notes ? `
            <p style="margin:4px 0; font-size:0.8rem; color:#d4a373;">
              <i class="fa-solid fa-pen-to-square" style="margin-right:6px;"></i> Notes: ${escapeHtml(order.delivery_notes)}
            </p>
          ` : ''}
          ${order.delivery_maps_url ? `
            <div style="margin-top:10px;">
              <a href="${order.delivery_maps_url}" target="_blank" class="btn-action" style="display:inline-flex; align-items:center; gap:8px; padding:8px 16px; font-size:0.85rem; text-decoration:none; border-radius:6px; background:#d9a75c; color:#18110e; font-weight:600;">
                <i class="fa-solid fa-map-location-dot"></i> View Delivery Route in Google Maps &rarr;
              </a>
            </div>
          ` : ''}
        </div>
      ` : `
        <div class="tracker-pickup-box" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 12px; margin: 15px 0; font-size: 0.85rem; text-align: left;">
          <p style="margin:0; color:#fff;">
            <i class="fa-solid fa-store" style="color:#d9a75c; margin-right:6px;"></i>
            <strong>Pickup Location:</strong> Jules Cafe &bull; PRK-2, Communal Road, Davao City
          </p>
          <div style="margin-top:8px;">
            <a href="https://www.google.com/maps/search/?api=1&query=PRK-2+Communal+Road+Davao+City" target="_blank" style="color:#d9a75c; font-size:0.8rem; text-decoration:underline;">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> View Store Location on Google Maps
            </a>
          </div>
        </div>
      `}

      <div class="tracker-details-box">
        <h5><i class="fa-solid fa-bag-shopping"></i> Order Items</h5>
        <div class="tracker-items-list">${itemsHtml}</div>
        <div class="tracker-total-row">
          <span>Total (${order.payment_method || 'Cash'})</span>
          <strong>₱${(order.total || 0).toFixed(2)}</strong>
        </div>
      </div>
      <div class="tracker-footer-note">
        <i class="fa-solid fa-arrows-rotate fa-spin text-gold"></i> Live status updates automatically every 5 seconds
      </div>
    </div>
  `;
}

/* Daily Specials & Coffee of the Day */
async function fetchAndRenderDailySpecials() {
  const container = document.getElementById('specials-banner-card');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE_URL}/specials`);
    if (res.ok) {
      const data = await res.json();
      const coffee = data.coffeeOfTheDay;
      if (!coffee) {
        container.style.display = 'none';
        return;
      }

      container.innerHTML = `
        <div class="specials-top-bar">
          <span class="specials-badge-tag"><i class="fa-solid fa-fire"></i> ${escapeHtml(coffee.badge)}</span>
          <span style="font-size: 0.8rem; color: #D9A75C; font-weight: 600;"><i class="fa-solid fa-tag"></i> Code: <strong>${escapeHtml(coffee.promoCode)}</strong></span>
        </div>
        <div class="specials-content-row">
          <div class="specials-info-col">
            <h3>☕ ${escapeHtml(coffee.name)}</h3>
            <p>${escapeHtml(coffee.desc)}</p>
            <div class="specials-price-row">
              <span class="specials-curr-price">₱${coffee.specialPrice.toFixed(2)}</span>
              <span class="specials-orig-price">₱${coffee.originalPrice.toFixed(2)}</span>
            </div>
          </div>
          <button type="button" class="btn-claim-special" onclick="claimDailySpecial('${coffee.id}', '${escapeHtml(coffee.name)}', ${coffee.specialPrice}, '${escapeHtml(coffee.promoCode)}')">
            <i class="fa-solid fa-bolt"></i> Claim Special
          </button>
        </div>
      `;
    }
  } catch (err) {
    console.log("Specials banner notice:", err);
  }
}

function claimDailySpecial(itemId, name, price, promoCode) {
  const cItemId = `special-${itemId}`;
  const specialItem = {
    cartItemId: cItemId,
    id: cItemId,
    name: `🔥 ${name} (Daily Special)`,
    price: price,
    qty: 1,
    category: 'espresso',
    customText: '12oz Medium, Daily Barista Special Discount'
  };

  const existingIdx = OrderState.cart.findIndex(c => (c.cartItemId || c.id) === specialItem.cartItemId);
  if (existingIdx > -1) {
    OrderState.cart[existingIdx].qty += 1;
  } else {
    OrderState.cart.push(specialItem);
  }

  const promoInput = document.getElementById('promo-code-input');
  if (promoInput) {
    promoInput.value = promoCode;
  }

  saveCart();
  renderCart();
  showToast(`Added Daily Special "${name}" for ₱${price.toFixed(2)}! ☕`);
}

window.claimDailySpecial = claimDailySpecial;

document.addEventListener('DOMContentLoaded', () => {
  fetchAndRenderDailySpecials();
});

window.addEventListener('jules-auth-changed', () => {
  renderCart();
});
