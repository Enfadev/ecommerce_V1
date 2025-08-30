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
    image: "",
    category: "Fashion",
    stock: 50,
  },
  {
    id: 2,
    name: "Sneakers Sporty",
    price: 350000,
    image: "",
    category: "Fashion",
    stock: 30,
  },
  {
    id: 3,
    name: "Wireless Headphone",
    price: 450000,
    image: "",
    category: "Electronics",
    stock: 25,
  },
  {
    id: 4,
    name: "Smart Watch",
    price: 280000,
    image: "",
    category: "Electronics",
    stock: 40,
  },
  {
    id: 5,
    name: "Denim Jacket",
    price: 275000,
    image: "/placeholder-image.svg",
    category: "Fashion",
    stock: 35,
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 320000,
    image: "/placeholder-image.svg",
    category: "Electronics",
    stock: 20,
  },
  {
    id: 7,
    name: "Running Shoes",
    price: 425000,
    image: "/placeholder-image.svg",
    category: "Fashion",
    stock: 28,
  },
  {
    id: 8,
    name: "Laptop Stand",
    price: 150000,
    image: "/placeholder-image.svg",
    category: "Electronics",
    stock: 45,
  },
];
