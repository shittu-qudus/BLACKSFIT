export interface Product {
    id: number;
    name: string;
    photoUrl: string;
    size: number;
    price: number;
    fullimage:string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Api {
    id: number;
    title: string;
    body: string;
}