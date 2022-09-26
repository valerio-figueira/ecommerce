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
                    <p class="item-price">${item.price}</p>
                    <button class="fas fa-shopping-bag add-cart-btn"></button>
                </div>
            </div>
        `;
    }).join('');
};


addItemsToCart();
function addItemsToCart(){    
    const shopContainer = document.querySelectorAll("section .shop-item");
    shopContainer.forEach(shopItem => {
        shopItem.addEventListener('click', event => {
            if(event.target.matches(".add-cart-btn")){
                setCart(shopItem);
            } else{
                console.log(event.target)
            };
        });
    });
};

function setCart(item){
    const cartItems = document.querySelector(".checkout .cart-items");
    const items = document.querySelectorAll(".checkout .cart-items .item");

    const name = item.firstElementChild.nextElementSibling;
    const img = item.firstElementChild;
    const price = item.lastElementChild.firstElementChild;
    //console.log(name.innerHTML);
    //console.log(img.getAttribute("src"));
    //console.log(price.innerHTML);

    const html = `
        <div class="item">
            <h3 class="item-name">${name.innerHTML}</h3>
            <div class="flex">
                <img src="${img.getAttribute("src")}" alt="${name.innerHTML}">
                <input type="number" name="" id="" class="quantity" min="0">
                <p class="item-price">${price.innerHTML}</p>
            </div>
        </div>
    `;
    console.log(name.innerHTML + " name on click")
    if(items.length > 0){
        for(let item of items){
            let itemName = item.firstElementChild.innerHTML;
            console.log(itemName + " name in loop")
            if(itemName !== name.innerHTML){
                cartItems.innerHTML += html;
            } else{
                console.error("Item Already")
            };
        }
    } else{
        console.log("No entries");
        cartItems.innerHTML += html;
    };




};
function getItemHtml(){

}

