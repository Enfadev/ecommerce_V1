export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "T-shirt Unisex",
    price: 120000,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    category: "Fashion",
    stock: 50,
  },
  {
    id: 2,
    name: "Sneakers Sporty",
    price: 350000,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    category: "Fashion",
    stock: 30,
  },
  {
    id: 3,
    name: "Wireless Headphone",
    price: 450000,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "Electronics",
    stock: 25,
  },
  {
    id: 4,
    name: "Smart Watch",
    price: 280000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "Electronics",
    stock: 40,
  },
  {
    id: 5,
    name: "Denim Jacket",
    price: 275000,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    category: "Fashion",
    stock: 35,
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 320000,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    category: "Electronics",
    stock: 20,
  },
  {
    id: 7,
    name: "Running Shoes",
    price: 425000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "Fashion",
    stock: 28,
  },
  {
    id: 8,
    name: "Laptop Stand",
    price: 150000,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    category: "Electronics",
    stock: 45,
  },
];
