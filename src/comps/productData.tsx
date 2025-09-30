
import { Product } from "./types";

export const productData: Product[] = [
    { id: 1, name: "The Atlantic City piece ", photoUrl: "/image/ATL.jpeg", fullimage:"/image/FULLATL.jpg", size: 42, price: 40000 },
     { id: 2, name: "Eyo Adimu piece", photoUrl: "/image/eyofront.png", fullimage:"/image/eyo.jpeg", size: 44, price: 40000 },
    // { id: 4, name: "Blacksfit Peice III", photoUrl: "/image/blank.jpeg", fullimage:"/image/FULLATL.jpg",size: 44, price: 35000 },

    { id: 6, name: "Ibadan brown roof piece", photoUrl: "/image/ibadan.png",fullimage:"/image/FULLIB.jpg", size: 44, price: 40000 },

   
    { id: 9, name: "Kwara state piece", photoUrl: "/image/map.jpeg", fullimage:"/image/mapk.jpeg",size: 44, price: 40000 },
    { id: 10, name: "Ogun piece", photoUrl: "/image/ogun.jpeg", fullimage:"/image/FULLOGUN.jpg",size: 44, price: 40000 },
    { id: 11, name: "Lagos street piece", photoUrl: "/image/bus.jpeg",fullimage:"/image/FULLBUS.png", size: 44, price:40000 },
    { id: 12, name: "Kurmi piece ", photoUrl: "/image/kurmifront.png",fullimage:"/image/newfullk.png", size: 44, price: 40000 },

]
// console.log('Product image URLs:', productData.map(p => ({ name:p.name, url: p.photoUrl }))) //