//selector
const showModalBtn = document.querySelector(".fa-cart-shopping");
const modal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModalBtn = document.querySelector(".cart-confirm");
const clearModalBtn = document.querySelector(".cart-clear");
const productsDom = document.querySelector(".products");
const cartItemsDom = document.querySelector(".cart-content");
let cartTotal = document.querySelector(".cart-total");
let cartItems = document.querySelector(".cart-items");

import {productsData} from "./products.js";
let cart = [];

// Get Product
class Product{
    // get from api end point!
    getProduct(){
        return productsData ; 
    }
}

let buttonsDom = [];
// Display Product
class Ui{
    displayProducts(products){
        let result = "";
        products.forEach(item => {
            result += `
            <article class="product">
                    <img class="product-img" src=${item.imageURL} alt="">
                    <div class="product-content">
                        <div class="product-description">
                            <p class="price">${item.price} $</p>
                            <p class="name">${item.title}</p>
                        </div>
                        <button class="inCartBTN" data-id=${item.id}> Add To Cart</button>
                    </div>
                </article>
            `
            productsDom.innerHTML = result;
       }); 
    }
    getAddToCardBtns(){
        const addToCartBtns = document.querySelectorAll(".inCartBTN");
        const addToCartBtnsArray = [...addToCartBtns];
        buttonsDom = addToCartBtnsArray;

        addToCartBtnsArray.forEach((btn)=>{
            const dataIds = btn.dataset.id;
            // Check if this product id is in cart or not!
            const isInCart = cart.find((p) => p.id === parseInt(dataIds));
            if (isInCart){
                btn.innerText = "In Cart";
                btn.disabled = true ; 
            }
            btn.addEventListener("click",(event)=>{
                //  console.log(event.target.dataset.id);
                event.target.innerText = "In Cart";
                event.target.disabled = true ; 
                //  TODO: Get product from products in local staorage
                let selectedProduct = { ...Storage.getProducts(dataIds) , quantity:1};
                console.log(selectedProduct);
                //  TODO: Add this product to cart 
                cart = [...cart , selectedProduct];
                //  TODO: Save Cart to Local Storage
                Storage.saveCart(cart); 
                //  TODO: Update Cart Value
                this.setCartValue(cart);
                //  TODO: Add to Cart Items in Modal
                this.addCartItem(selectedProduct);
                //  TODO: Get cart from storage when application is loading for first time.

                
            })
        })
    }
    setCartValue(cart){
        // 1. How many Items is in cart?
        // 2. How much is cart Total? 
        let tempItems = 0;
        let cartTotalValue = cart.reduce((acc,curr)=>{
            tempItems += curr.quantity;
            return acc + curr.quantity * curr.price ; 
            
        },0)
        cartTotal.innerText =`total price: ${cartTotalValue.toFixed(2)} $` ; 
        cartItems.innerText = tempItems;
        console.log(tempItems);
        
    }
    addCartItem(item){
        const cartItemsDiv = document.createElement("div");
        cartItemsDiv.classList.add("cart-item");
        cartItemsDiv.innerHTML = `
                    <img class="cart-item-image" src=${item.imageURL} alt="" >
                    <div class="cart-item-description">
                        <h4>${item.title}</h4>
                        <h5>${item.price} $</h5>
                    </div>
                    <div class="cart-item-controller">
                        <i class="fa-solid fa-angle-up" data-id=${item.id}></i>
                        <p>${item.quantity}</p>
                        <i class="fa-solid fa-angle-down" data-id=${item.id}></i>
                    </div>
                    <div class="remove-item">
                        <i class="fa-solid fa-trash-alt" data-id=${item.id}></i>
                    </div>        
        `
        cartItemsDom.appendChild(cartItemsDiv);
    }
    setUpApp(){
        // TODO: get cart from storage ->
        cart = Storage.getCart();
        // TODO: addCartItem() and show these items in modal!
        cart.forEach((item)=> this.addCartItem(item));
        // TODO: set values ( price , items)!
        this.setCartValue(cart);
    }
    cartLogic(){
        // clear cart:
        clearModalBtn.addEventListener("click",()=>{
            // Remove
            console.log("Clear!");
            cart.forEach(item => this.removeItem(item.id));
            while(cartItemsDom.children.length){
                cartItemsDom.removeChild(cartItemsDom.children[0]);
            };
            closeCart();
        });
        //cart functionality:
        cartItemsDom.addEventListener('click', (event)=>{
            console.log(event.target);
            if(event.target.classList.contains("fa-angle-up")){
                console.log(event.target.dataset.id);
                const addQuantity = event.target;
                // Get item from cart
                const addedItem = cart.find( cItem => cItem.id == parseInt(addQuantity.dataset.id) );
                // update cart value
                addedItem.quantity ++;
                this.setCartValue(cart);
                // Save cart 
                Storage.saveCart(cart);
                // Update Cart Item in UI: 
                addQuantity.nextElementSibling.innerText = addedItem.quantity;
            }else if(event.target.classList.contains("fa-trash-alt")){
                const removeItem = event.target;
                // Remove from cart
                const _removedItem = cart.find( c => c.id == removeItem.dataset.id);
                this.removeItem(_removedItem.id);
                Storage.saveCart(cart);
                cartItemsDom.removeChild(removeItem.parentElement.parentElement);

                // Update local storage

                // Call remove Method

            }else if(event.target.classList.contains("fa-angle-down")){
                console.log(event.target.dataset.id);
                const subQuantity = event.target;
                // Get item from cart
                const subtractedItem = cart.find( cItem => cItem.id == parseInt(subQuantity.dataset.id) );
                // update cart value
                if (subtractedItem.quantity === 1){
                    this.removeItem(subtractedItem.id);
                    cartItemsDom.removeChild(subQuantity.parentElement.parentElement);
                    return;
                }
                subtractedItem.quantity --;
                this.setCartValue(cart);
                // Save cart 
                Storage.saveCart(cart);
                // Update Cart Item in UI: 
                subQuantity.previousElementSibling.innerText = subtractedItem.quantity;
            }
        })
    }
    removeItem(id){
        // update cart
        cart = cart.filter(cItem => cItem.id !== id);
        // update totalPrice & items
        this.setCartValue(cart);
        // update Storage
        Storage.saveCart(cart);

        // Get add-to-card buttons and update their text and disables :
        console.log("buttonsDom is:")
        console.log(buttonsDom);
        const button = buttonsDom.find(btn => btn.dataset.id == parseInt(id));
        console.log("button is : ")
        console.log(button);
        button.innerText = 'Add To Card';
        buttonsDom.disabled = false;
        console.log(buttonsDom);
    
    
    }    
    }
    
        
        
    
    

// Local Storage
class Storage{
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products));
    }
    static saveCart(cart){
        localStorage.setItem("cart",JSON.stringify(cart));
    }
    static getCart(){
        return (JSON.parse(localStorage.getItem("cart")) ? 
        JSON.parse(localStorage.getItem("cart")):  [] ) ;
    }
    static getProducts(id){
        let thisProducts = JSON.parse(localStorage.getItem("products"));
        return thisProducts.find((p) => p.id === parseInt(id));
    }
    
    
}

// functions
function showCart(){
    modal.style.opacity ="1";
    modal.style.top="20%";
    backDrop.style.display = "block";
    backDrop.style.opacity="0.5";
}
function closeCart(){
    backDrop.style.display= "none";
    modal.style.opacity="0";
    modal.style.top="-100%";
}

// event listener
showModalBtn.addEventListener("click",showCart);
closeModalBtn.addEventListener("click",closeCart);
backDrop.addEventListener("click",closeCart);
document.addEventListener("DOMContentLoaded",()=>{

    const products = new Product;
    const productsInData = products.getProduct();
    console.log(productsInData);
    const ui = new Ui;
    // set up application : get cart items
    ui.setUpApp();
    ui.displayProducts(productsInData);
    ui.getAddToCardBtns();
    ui.cartLogic();
    Storage.saveProducts(productsInData);
    // ui.setCartValue()
})

















