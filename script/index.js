import Products from "./Products.js";

const shopItems = Products;

//open and close cart bar
openCart();
function openCart(){
    const shopTab = document.querySelector("header .checkout");

    document.querySelector("header .cart-btn").addEventListener('click', () => {
        if(shopTab.className === "checkout") {
            shopTab.classList.add("open");
        } else {
            shopTab.classList.remove("open");
        };
    });
};


//render all products in the page
renderProducts();
function renderProducts(){
    document.querySelector(".products").innerHTML = shopItems.map(item => {
        return `
            <div class="shop-item">
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
        <div class="item">
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
    console.log(convertedItem)

    if(searchForDuplicates(convertedItem)){
        container.innerHTML += getCartItemHtml(convertedItem);
    } else{
        console.error("Item already in the cart")
        buttonAnimation(itemTag);
    }

    quantityController();
    //removeCartItem(cart);
};

function convertTagIntoObject(itemTag){
    const name = itemTag.children[1].innerHTML;
    return shopItems.find(item => item.name === name);
}

function searchForDuplicates(item){
    const itemsTags = document.querySelectorAll(".checkout .cart-items .item");
    if(itemsTags.length > 0){
        //search for possible match (duplicate items)
        itemsTags.map(itemTag => {
            const name = itemTag.firstElementChild.innerHTML;
            if(item.name === name){
                return false;
            } else{
                console.log("passed")
                return true;
            };
        })
    } else{
        //add first item
        return true;
    };
}

function removeCartItem(cart){
    const items = document.querySelectorAll(".checkout .cart-items .item");

    for(let item of items){
        item.addEventListener('click', event => {
            if(event.target.matches(".rm-icon")){
                const itemName = item.firstElementChild.innerHTML;
                event.target.parentNode.remove(); 
                refreshTotalPrice();     
                //remove also from cart array
                const match = cart.indexOf(itemName);
                if(match > -1){
                    cart.splice(match, 1);
                };
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
    }
};

function refreshItemPrice(quantityTag, itemPrice){
    return quantityTag.value * itemPrice;    
}


function quantityController(){
    const items = document.querySelectorAll(".cart-items .item");
    refreshTotalPrice(items);
    

    items.forEach(item => {        
        const priceTag = item.children[1].children[2];
        const itemPrice = Number(priceTag.innerHTML);
        const quantityTag = item.children[1].children[1];

        
        if(quantityTag.value == ""){
            quantityTag.value = 1;
        };

        quantityTag.addEventListener('change', event => {
            console.log(event.target.value)
        });

        quantityTag.addEventListener('keydown', event => {
            if(event.key.match("Backspace")){
                if(quantityTag.value.length == 1){
                    quantityTag.value = 0;
                    priceTag.innerHTML = refreshItemPrice(quantityTag, itemPrice);
                    refreshTotalPrice(items);
                };
            };
            if(event.key.match("Del")){
                if(quantityTag.value.length == 1){
                    quantityTag.value = 0;
                    priceTag.innerHTML = refreshItemPrice(quantityTag, itemPrice);
                    refreshTotalPrice(items);
                };
            };
        });

        quantityTag.addEventListener('input', event => {
            let filteredInput = Number(event.target.value);
            
            if(event.target.value.match(filteredInput)){
                let price = refreshItemPrice(quantityTag, itemPrice)
                priceTag.innerHTML = Number(price).toFixed(2);
                refreshTotalPrice();
            };
        });
    });
};


function buttonAnimation(item){
    const btn = item.lastElementChild.lastElementChild;
    if(!btn.matches(".rejected")){
        btn.classList.add("rejected");        
        setTimeout(() => btn.classList.remove("rejected"), 1000);
    };
};