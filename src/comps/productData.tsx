
import { Product } from "./types";

export const productData: Product[] = [
    { id: 1, name: "Blacksfit The Lagos Atlantic City piece", photoUrl: "/image/ATL.jpeg", fullimage:"/image/FULLATL.jpg", size: 42, price: 35000 },

    { id: 4, name: "Blacksfit Peice III", photoUrl: "/image/blank.jpeg", fullimage:"/image/FULLATL.jpg",size: 44, price: 35000 },

    { id: 6, name: " Blacksfit Ibadan Piece", photoUrl: "/image/ibadan.png",fullimage:"/image/FULLIB.jpg", size: 44, price: 35000 },

   
    { id: 9, name: "Blacksfit Peice IV", photoUrl: "/image/map.jpeg", fullimage:"/image/mapk.jpeg",size: 44, price: 35000 },
    { id: 10, name: "Blacksfit Ogun piece", photoUrl: "/image/ogun.jpeg", fullimage:"/image/FULLOGUN.jpg",size: 44, price: 35000 },
    { id: 11, name: "Blacksfit Peice V", photoUrl: "/image/bus.jpeg",fullimage:"/image/FULLBUS.png", size: 44, price: 35000 },
    { id: 12, name: "Blacksfit Big Wiz Peice ", photoUrl: "/image/Bigwiz.png",fullimage:"/image/wizB.jpg", size: 44, price: 35000 }
];
// console.log('Product image URLs:', productData.map(p => ({ name: p.name, url: p.photoUrl })));