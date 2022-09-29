import Products from "./Products.js";

const shopItems = Products;

//open and close cart bar
openCart();
function openCart(){
    const shopTab = document.querySelector("header .checkout");
    const closeBtn = document.querySelector(".checkout .close-btn");
    document.querySelector("header .cart-btn").addEventListener('click', () => {
        if(!shopTab.matches(".open")) {
            shopTab.classList.add("open");            
        };
    });
    closeCart(shopTab, closeBtn);
};
function closeCart(shopTab, closeBtn){
    closeBtn.addEventListener('click', () => {
        shopTab.classList.remove("open");
    });
};

//render all products in the page
renderProducts();
function renderProducts(){
    document.querySelector(".total-price").innerHTML = "0.00";
    document.querySelector(".products").innerHTML = shopItems.map(item => {
        return `
            <div class="shop-item" id="${item.id}">
                <img src="${item.img}" alt="${item.name}">
                <h2 class="item-name">${item.name}</h2>
                <div class="flex">                  
                    <p class="item-price">${item.price.toFixed(2)}</p>
                    <button class="fas fa-shopping-bag add-cart-btn"></button>
                </div>
            </div>
        `;
    }).join('');
};


function getCartItemHtml(item){
    return `
        <div class="item" id="${item.id}">
            <h3 class="item-name">${item.name}</h3>
            <div class="flex">
                <img src="${item.img}" alt="${item.name}">
                <input type="number" class="quantity" min="1" required>
                <p class="item-price">${item.price.toFixed(2)}</p>
            </div>
            <span class="fa fa-close rm-icon"></span>
        </div>
    `;
};




pushItemToCart();
function pushItemToCart(){
    const itemsTags = document.querySelectorAll("section .shop-item");
    itemsTags.forEach(itemTag => {
        itemTag.addEventListener('click', event => {
            //if add button is clicked
            if(event.target.matches(".add-cart-btn")){
                setCart(itemTag);
            }
        });
    });
};

function setCart(itemTag){
    const container = document.querySelector(".checkout .cart-items");
    const convertedItem = convertTagIntoObject(itemTag);

    if(searchForDuplicates(convertedItem)){
        container.innerHTML += getCartItemHtml(convertedItem);
    } else{
        console.error("Item already in the cart")
        buttonAnimation(itemTag);
    }

    quantityController();
    removeCartItem();
};


function convertTagIntoObject(itemTag){    
    return shopItems.find(item => item.id == itemTag.id);
}

function searchForDuplicates(item){
    const itemsTags = document.querySelectorAll(".checkout .cart-items .item");
    if(itemsTags.length > 0){
        //search for possible match (duplicate items)
        for(let itemTag of itemsTags){
            if(itemTag.id.match(item.id)){
                return false;
            };
        };
        return true;
    } else{
        //add first item
        return true;
    };
};

function removeCartItem(){
    const items = document.querySelectorAll(".checkout .cart-items .item");

    for(let item of items){
        item.addEventListener('click', event => {
            if(event.target.matches(".rm-icon")){
                const convertedItem = convertTagIntoObject(item);
                const index = shopItems.indexOf(convertedItem);
                event.target.parentNode.remove();
                refreshPricePerItem(index);
                refreshTotalPrice();
            };
        });
    };
};

function refreshTotalPrice(){
    const items = document.querySelectorAll(".cart-items .item");
    const totalElement = document.querySelector(".checkout .total-price");
    let total = 0;
    if(items.length > 0){
        items.forEach(item => {   
            const priceTag = item.children[1].children[2];
            total += Number(priceTag.innerHTML);
            totalElement.innerHTML = Number(total).toFixed(2);
        });
    } else{
        totalElement.innerHTML = 0;
    };
};


function quantityController(){
    const items = document.querySelectorAll(".cart-items .item");

    refreshTotalPrice(items);    

    items.forEach(item => { 
        const itemObject = convertTagIntoObject(item);
        const index = shopItems.indexOf(itemObject);
        const priceTag = item.children[1].children[2];
        const quantityTag = item.children[1].children[1];

        priceTag.innerHTML = Number(shopItems[index].total).toFixed(2);
        quantityTag.value = shopItems[index].quantity;

        quantityTag.addEventListener('keydown', event => {
            if(event.key.match("Backspace")){
                if(quantityTag.value.length == 1){
                    document.addEventListener('click', event => {
                        if(event.target != quantityTag){
                            if(quantityTag.value == ""){
                                quantityTag.value = shopItems[index].quantity;                                
                            };
                        };
                    });
                };
            };
            if(event.key.match("Del")){
                if(quantityTag.value.length == 1){
                    document.addEventListener('click', event => {
                        if(event.target != quantityTag){
                            if(quantityTag.value == ""){
                                quantityTag.value = shopItems[index].quantity;                                
                            };
                        };
                    });
                };
            };
        });

        quantityTag.addEventListener('input', event => {
            let filteredInput = Number(event.target.value);
            
            if(event.target.value.match(filteredInput)){
                document.addEventListener('click', event => {
                    if(filteredInput === 0){
                        if(event.target != quantityTag){
                            quantityTag.value = 1;
                            filteredInput = quantityTag.value;
                            refreshPricePerItem(index, filteredInput, priceTag);
                            refreshTotalPrice();
                        };
                    };
                });
                refreshPricePerItem(index, filteredInput, priceTag);
                refreshTotalPrice();
            };
        });
    });
};

function refreshPricePerItem(index, quantity = 1, priceTag = undefined){
    shopItems[index].quantity = quantity;
    shopItems[index].total = 
    shopItems[index].quantity * 
    shopItems[index].price;
    if(priceTag !== undefined){
        priceTag.innerHTML = 
        Number(shopItems[index].total).toFixed(2);
    }
}


function buttonAnimation(item){
    const btn = item.lastElementChild.lastElementChild;
    if(!btn.matches(".rejected")){
        btn.classList.add("rejected");        
        setTimeout(() => btn.classList.remove("rejected"), 1000);
    };
};



//COPYRIGHT DATE
let year = new Date().getFullYear();
document.querySelector(".copyright")
.innerHTML = `\u00A9 All rights reserved ${year} - Ecommerce`;