export const DIPS = [
  { id: 'milk', label: 'Milk Chocolate', color: '#8B5A3C', shine: '#A9714F' },
  { id: 'dark', label: 'Dark Chocolate', color: '#4A2C2A', shine: '#6B4540' },
  { id: 'white', label: 'White Chocolate', color: '#F6EAD7', shine: '#FFF8EC' },
  { id: 'ruby', label: 'Pink Ruby', color: '#F4A7BB', shine: '#FBC4D2' },
]

export const DRIZZLES = [
  { id: 'none', label: 'No Drizzle', color: null },
  { id: 'white', label: 'White Drizzle', color: '#FFF6EC' },
  { id: 'pink', label: 'Pink Drizzle', color: '#FF9EC0' },
  { id: 'caramel', label: 'Caramel Drizzle', color: '#D99A4E' },
  { id: 'dark', label: 'Dark Drizzle', color: '#4A2C2A' },
]

export const TOPPINGS = [
  { id: 'none', label: 'Keep it Classic', colors: [] },
  { id: 'sprinkles', label: 'Rainbow Sprinkles', colors: ['#FF7BAC', '#7BD8FF', '#FFD37B', '#9BE89B', '#C89BFF'] },
  { id: 'oreo', label: 'Crushed Oreo', colors: ['#2E2520', '#443830', '#1F1813'] },
  { id: 'coconut', label: 'Coconut Snow', colors: ['#FFFDF8', '#FFF3E2', '#FAEFDF'] },
  { id: 'gold', label: 'Gold Dust', colors: ['#F5C84C', '#FFE08A', '#E8B62E'] },
]

export const TREAT_TYPES = [
  {
    id: 'strawberry',
    name: 'Chocolate Strawberry',
    short: 'Strawberry',
    emoji: '🍓',
    price: 3.5,
    blurb: 'Plump, juicy berries hand-dipped in silky chocolate. The signature.',
    preview: { dip: 'milk', drizzle: 'white', topping: 'none' },
  },
  {
    id: 'cakepop',
    name: 'Cake Pop',
    short: 'Cake Pop',
    emoji: '🍭',
    price: 3.0,
    blurb: 'Moist cake rolled, dipped and dressed on a cute little stick.',
    preview: { dip: 'ruby', drizzle: 'white', topping: 'sprinkles' },
  },
  {
    id: 'cupcake',
    name: 'Dipped Cupcake',
    short: 'Cupcake',
    emoji: '🧁',
    price: 3.75,
    blurb: 'Fluffy cupcakes crowned with a swirl of chocolate frosting & a cherry.',
    preview: { dip: 'ruby', drizzle: 'dark', topping: 'sprinkles' },
  },
  {
    id: 'oreo',
    name: 'Chocolate Oreo',
    short: 'Oreo',
    emoji: '🍪',
    price: 2.75,
    blurb: 'Classic sandwich cookies dunked in chocolate and drizzled to match.',
    preview: { dip: 'dark', drizzle: 'white', topping: 'none' },
  },
  {
    id: 'crispy',
    name: 'Crispy Treat',
    short: 'Crispy',
    emoji: '🍫',
    price: 4.0,
    blurb: 'Gooey marshmallow crispy squares blanketed in chocolate.',
    preview: { dip: 'dark', drizzle: 'white', topping: 'none' },
  },
  {
    id: 'pretzel',
    name: 'Chocolate Pretzel',
    short: 'Pretzel',
    emoji: '🥨',
    price: 2.5,
    blurb: 'Salty-sweet twists drenched in chocolate with the perfect snap.',
    preview: { dip: 'milk', drizzle: 'pink', topping: 'none' },
  },
]

export const BOX_SIZES = [
  { id: 'sweetie', name: 'The Sweetie', slots: 4, cols: 2, tagline: 'A little treat for a little moment', base: 2 },
  { id: 'lovely', name: 'The Lovely', slots: 6, cols: 3, tagline: 'The fan favourite — perfect for gifting', base: 3 },
  { id: 'deluxe', name: 'The Deluxe', slots: 12, cols: 4, tagline: 'Go big. Celebrations deserve it', base: 5 },
]

export const findDip = (id) => DIPS.find((d) => d.id === id) || DIPS[0]
export const findDrizzle = (id) => DRIZZLES.find((d) => d.id === id) || DRIZZLES[0]
export const findTopping = (id) => TOPPINGS.find((t) => t.id === id) || TOPPINGS[0]
export const findTreat = (id) => TREAT_TYPES.find((t) => t.id === id) || TREAT_TYPES[0]
