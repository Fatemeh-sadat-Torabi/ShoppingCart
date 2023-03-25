
let allProducts = [];
const filters = {
    searchItems : "",
}
let searchInput = document.querySelector("#filterItems");
searchInput.addEventListener('input',(e)=>{
    console.log(e.target.value);
    filters.searchItems = e.target.value;
    renderProducts(allProducts,filters);
});
let productsDom = document.querySelector(".products");
let btns = document.querySelectorAll(".btn-groups");

document.addEventListener("DOMContentLoaded",()=>{
    axios
    .get("http://localhost:3000/items")
    .then((response)=>{
        allProducts = response.data;
        // Render Products On DOM:
        renderProducts(allProducts,filters);

    })
    .catch((error)=>{
        console.log(error);
    })
});

// filter by buttons: 
btns.forEach((btn)=>{
    btn.addEventListener("click",(e)=>{
        // console.log(e.target.dataset.filter);
        filters.searchItems = e.target.dataset.filter;
        renderProducts(allProducts,filters);

    })
})




function renderProducts (_products,_filters){
    const filteredProducts = _products.filter((item)=>{
        return item.class.toLowerCase().includes(_filters.searchItems.toLowerCase());
    })
    console.log(filteredProducts);
    // return filteredProducts;
    // Render to DOM:
    let result = "";
    filteredProducts.forEach(item => {

        // create
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
        // content

        // append
    });
}