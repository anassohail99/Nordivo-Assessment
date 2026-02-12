import dotenv from 'dotenv';
dotenv.config();

import { connectDatabase } from '../utils/database';
import AddOn from '../models/AddOn';

const addOnsData = [
  {
    name: 'Small Popcorn',
    description: 'Classic buttered popcorn',
    price: 5,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400',
    available: true
  },
  {
    name: 'Large Popcorn',
    description: 'Large buttered popcorn',
    price: 8,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400',
    available: true
  },
  {
    name: 'Small Soda',
    description: 'Chilled soft drink',
    price: 4,
    category: 'beverage',
    image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400',
    available: true
  },
  {
    name: 'Large Soda',
    description: 'Large chilled soft drink',
    price: 6,
    category: 'beverage',
    image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400',
    available: true
  },
  {
    name: 'Nachos with Cheese',
    description: 'Crispy nachos with melted cheese',
    price: 7,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400',
    available: true
  },
  {
    name: 'Hot Dog',
    description: 'Classic hot dog with toppings',
    price: 6,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1612392062422-ef19b42f74df?w=400',
    available: true
  },
  {
    name: 'Candy Mix',
    description: 'Assorted movie theater candy',
    price: 4,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400',
    available: true
  },
  {
    name: 'Bottled Water',
    description: 'Pure mineral water',
    price: 3,
    category: 'beverage',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
    available: true
  },
  {
    name: '3D Glasses',
    description: 'Reusable 3D cinema glasses',
    price: 3,
    category: 'accessory',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400',
    available: true
  },
  {
    name: 'Premium Sound',
    description: 'Upgrade to Dolby Atmos sound',
    price: 5,
    category: 'upgrade',
    image: 'https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=400',
    available: true
  },
  {
    name: 'Combo Deal 1',
    description: 'Large popcorn + Large soda',
    price: 12,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400',
    available: true
  },
  {
    name: 'Combo Deal 2',
    description: 'Hot dog + Small soda + Candy',
    price: 11,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1612392062422-ef19b42f74df?w=400',
    available: true
  }
];

const seedAddOns = async () => {
  try {
    await connectDatabase();

    console.log('Clearing existing add-ons...');
    await AddOn.deleteMany({});

    console.log('Seeding add-ons data...');
    await AddOn.insertMany(addOnsData);

    console.log(`Successfully seeded ${addOnsData.length} add-ons!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding add-ons:', error);
    process.exit(1);
  }
};

seedAddOns();
