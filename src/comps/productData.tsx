
import { Product } from "./types";

export const productData: Product[] = [
    { id: 1, name: "ATL", photoUrl: "/image/ATL.jpeg", size: 42, price: 35000 },
    { id: 2, name: "bla", photoUrl: "/image/bla.jpeg", size: 44, price: 35000 },
    { id: 3, name: "black", photoUrl: "/image/blacksfit.jpeg", size: 44, price: 35000 },
    { id: 4, name: "blanck", photoUrl: "/image/blank.jpeg", size: 44, price: 35000 },
    { id: 5, name: "eyo", photoUrl: "/image/eyo.jpeg", size: 44, price: 35000 },
    { id: 6, name: "ibadan", photoUrl: "/image/ibadan.jpeg", size: 44, price: 35000 },
    { id: 7, name: "kwara", photoUrl: "/image/kwara.jpeg", size: 44, price: 35000 },
    { id: 8, name: "lagos", photoUrl: "/image/lagos.jpeg", size: 44, price: 35000 },
    { id: 9, name: "map", photoUrl: "/image/map.jpeg", size: 44, price: 35000 },
    { id: 10, name: "ogun", photoUrl: "/image/ogun.jpeg", size: 44, price: 35000 },
    { id: 11, name: "bus", photoUrl: "/image/bus.jpeg", size: 44, price: 35000 },
];
console.log('Product image URLs:', productData.map(p => ({ name: p.name, url: p.photoUrl })));