import products from "./Products.js";

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

renderProducts();
function renderProducts(){
    document.querySelector(".products").innerHTML = products.map(item => {
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





addItemsToCart();
function addItemsToCart(){   
    const cart = []; 
    const shopContainer = document.querySelectorAll("section .shop-item");
    shopContainer.forEach(shopItem => {
        shopItem.addEventListener('click', event => {
            if(event.target.matches(".add-cart-btn")){
                setCart(shopItem, cart);
            } else{
                console.log(event.target)
            };
        });
    });
};

function setCart(item, cart){
    const container = document.querySelector(".checkout .cart-items");
    const items = document.querySelectorAll(".checkout .cart-items .item");

    const name = item.firstElementChild.nextElementSibling.innerHTML;
    const img = item.firstElementChild.getAttribute("src");
    const price = item.lastElementChild.firstElementChild.innerHTML;

    console.log(name + " name on click")

    if(items.length > 0){
        if(!cart.find(item => item === name)){
            cart.push(name);
            container.innerHTML += getItemHtml(name, img, price);
        } else{
            console.log("Item already in the cart")
            buttonAnimation(item);
        }
    } else{
        cart.push(name);
        container.innerHTML += getItemHtml(name, img, price);
    };

    quantityController();
};

function getItemHtml(name, img, price){
    return `
        <div class="item">
            <h3 class="item-name">${name}</h3>
            <div class="flex">
                <img src="${img}" alt="${name}">
                <input type="number" class="quantity" min="1" value="1">
                <p class="item-price">${price}</p>
            </div>
        </div>
    `;
};

function quantityController(){
    const items = document.querySelectorAll(".cart-items .item");
    const totalPriceTag = document.querySelector(".checkout .total-price");

    let total = 0;
    items.forEach(item => {        
        const priceTag = item.lastElementChild.lastElementChild;
        total += Number(priceTag.innerHTML);
        totalPriceTag.innerHTML = Number(total).toFixed(2);
    })

    items.forEach(item => {        
        const priceTag = item.lastElementChild.lastElementChild;
        const itemPrice = Number(priceTag.innerHTML);
        const quantityTag = item.lastElementChild.children[1];
        
        let quantity;
        let totalPerItem;
        

        quantityTag.addEventListener('input', event => {
            let filteredInput = Number(event.target.value);
            let total = 0;
            if(event.target.value.match(filteredInput)){
                console.log("Filtered with success")
                quantity = filteredInput;
                totalPerItem = itemPrice * quantity;
                priceTag.innerHTML = Number(totalPerItem).toFixed(2);
                total = totalPerItem;
                totalPriceTag.innerHTML = total;
            } else{
                console.error("It must be a number");
            };
        });
    });
};


function buttonAnimation(item){
    const btn = item.lastElementChild.lastElementChild;
    console.log(btn);
    if(!btn.matches(".rejected")){
        btn.classList.add("rejected");        
        setTimeout(() => btn.classList.remove("rejected"), 1000);
    };
};