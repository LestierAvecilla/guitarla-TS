//Hook global

import { useState, useEffect ,useMemo} from "react"
import {db} from '../data/db'
import type { Guitar,CartItem } from "../types"


export const useCart = ()  => {

    const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    //state
    const [data] = useState(db)
    const [cart , setCart] = useState(initialCart)

    const MAX_ITEMS = 5
    const MIN_ITEMS = 1

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))  //para que se guarde info en local storage
    }, [cart])

    function addToCart(item : Guitar ){

        const itemExists = cart.findIndex(guitar => guitar.id === item.id)// findIndex devuelve el indice del elemento que cumpla la condicion
        
        if(itemExists >= 0) { //Existe en el carrito 
            if (cart[itemExists].quantity >= MAX_ITEMS) return
            const updatedCard = [...cart]
            updatedCard[itemExists].quantity++
            setCart(updatedCard)
        }else{
            const newItem : CartItem = {...item, quantity: 1}
            setCart([...cart, newItem])
        }
    }
    function removeFromCart(id: Guitar ['id']){
     setCart(prevCart => prevCart.filter(guitar => guitar.id !==id) )
    }

    function increaseQuantity(id: Guitar ['id']){
        const updatedCart = cart.map(item => {
            if(item.id === id && item.quantity < MAX_ITEMS){
                return{
                    ...item,
                    quantity: item.quantity + 1
                }
            }  
            return item
        })
        setCart(updatedCart)
    }

    function decreaseQuantity(id: Guitar ['id']){
        const updatedCart = cart.map(item => {
            if(item.id === id && item.quantity > MIN_ITEMS){
                return{
                    ...item,
                    quantity: item.quantity - 1
                }
            }  
            return item
        })
        setCart(updatedCart)
    }

    function clearCart(){
        setCart([])
    }

     // State Derivado

    //const isEmpty = () => cart.length === 0 
    const isEmpty = useMemo(() => cart.length === 0, [cart])
    //const cartTotal = () => cart.reduce((total, item) => total + (item.quantity * item.price), 0)
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])
    
    return{
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }

}