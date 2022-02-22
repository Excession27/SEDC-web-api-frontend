const container = document.querySelector(".container");

const btnEmployee = document.querySelector("#btn-employee");
const btnCustomer = document.querySelector("#btn-customer");
const btnProduct = document.querySelector("#btn-product");

const productSection = document.querySelector(".product-section");

const loginButton = document.querySelector(".login-button");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const loginForm = document.querySelector(".login-form");

const shoppingCartIcon = document.querySelector(".shopping-cart-icon");
const orderItemsDisplay = document.querySelector(".order-items");
const addItem = document.querySelector(".add-item");
const clearCart = document.querySelector(".clear-cart")
const createOrder = document.querySelector(".create-order");

const totalSum = document.querySelector(".total-sum");
const searchBar = document.querySelector(".search-input");

const profileIcon = document.querySelector(".profile-icon");
const profileModal = document.querySelector(".profile-modal");
const profileOrders = document.querySelector(".profile-orders");
const closeModal = document.querySelector(".profile-modal .close");

let newOrder = new Object();
newOrder.orderItems = [];


let newOrderItems = [];

let authorizationToken = "";
let arrayOfProducts = [];
let jwtToken = "";

async function fetchFunction(endpoint, options) {
    let request = new Request(endpoint, (options));
    let response = await fetch(request);
    console.log(response);
    let data = await response.json();
    console.log(data);
    return data;
}

let homeUrl = "https://localhost:44394/api/";




// Search bar

searchBar.addEventListener('input', function (evt) {
    console.log(searchBar.value);
    let searchedFor = [];
    if (searchBar.value.length > 2) {
        searchedFor = arrayOfProducts.filter((item) => {
            
            let term = searchBar.value.toLowerCase().split(" ");
            
            let boolean = false;

            boolean = search(item, term[0]) > -1; //|| search(item, term[1]) > -1;
            console.log("boolean");
            console.log(boolean);
            

            return boolean;
        });
        if (searchedFor.length <= 0) {
            console.log("Nothing found");
            return
        } else {
            displayProducts(searchedFor, productSection);
        }
    } else {
        displayProducts(arrayOfProducts, productSection);
    }

  });


function search (item, string) {
    return (item.productName.toLowerCase()
            + " " + item.description.toLowerCase()
            + " " + String(item.unitPrice).toLowerCase()
            + " " + item.size.toLowerCase()).search(string)
};




// Update customer
// Get all my orders
// Filter order (size, price)
function displayProducts(array, place) {
    place.innerHTML = "<span></span>";
    array.forEach(item => {
                    
        place.lastElementChild.insertAdjacentHTML("afterend",
            `
        <div class="card" id="product-id-${item.productId}">
            <img src="${item.imagePath}" alt="">
            <div class="card-text">
                <h2>${item.productName}</h2>
                <p class="product-description">${(item.description).substr(0, 130)}...</p>
                <p class="product-size">Size: ${item.size}</p>
                <p class="product-price">${item.unitPrice} din</p><span class="discounted"></span>
            </div>
            <div class="order-controls">
                <input type="number" name="" id="" class="item-qty" step="1" min="0" value="1">
                <button class="add-item">Add to cart</button>
            </div>
        </div>
        `);
    
    });

    setTimeout(() => {
        const addItem = document.querySelectorAll(".add-item");
    
        addItem.forEach(addToCartButton => {
            addToCartButton.addEventListener("click", (product) => {
                //console.log(product);
    
                let productQty = product.target.previousElementSibling.value;
                if (productQty > 0) {
                    let productId = product.target.parentElement.parentElement.id.split ("-").pop();
                
                    clickedItem = array.find( product => product.productId == productId);                               
                    
                    let orderEntryDisplay = new Object();
    
                    orderEntryDisplay.name = clickedItem.productName;
                    orderEntryDisplay.quantity = Number(productQty);
                    orderEntryDisplay.price = clickedItem.unitPrice;
                    orderEntryDisplay.totalSum = orderEntryDisplay.quantity * orderEntryDisplay.price;
                    orderEntryDisplay.productId = clickedItem.productId;
                    
                    newOrderItems.push(orderEntryDisplay);
    
                    addOrderItems(newOrderItems);
                }
    
            });
        });
    }, 50)


}


function ordered(orderList) {
    let checkedItem;
    let sortedList = [];

    if (orderList.length > 1) {

        let i = 0;
        for (i; orderList.length > i; i++) {

            checkedItem = orderList[i];

            for (let j = 0; orderList.length + 1 > j; j++) {
                
                //console.log("orderList[j]", orderList[j]);
                if (checkedItem) {
                    if (orderList[j] && checkedItem.productId == orderList[j].productId && j > i) {
                        checkedItem.quantity += orderList[j].quantity;
                        checkedItem.totalSum = checkedItem.quantity * checkedItem.price;
                        orderList.splice(j, 1);
                    };
                };
            };   
            sortedList.push(checkedItem); 
        };
        return sortedList;
    } else {
      return orderList;
    };
};

function addOrderItems (orderList) {
    // Function to display added order items in the shopping cart
    let finalSum = 0;
    let orderHtml = "";

    //console.log(orderList);

    let list = ordered(orderList);

    
        list.forEach(orderItem => {
            finalSum = finalSum + orderItem.totalSum;
            orderHtml += `
            <li>
                <span class="item-name"><span class="android-green-text">Name:</span> ${orderItem.name}</span>
                <span class="item-quantity"><span class="android-green-text">Quantity:</span> ${orderItem.quantity}</span>
                <span class="item-price"><span class="android-green-text">Price:</span> ${orderItem.price}</span>
                <span class="item-price-total"><span class="android-green-text">Total:</span> ${orderItem.totalSum}</span>
                <span class="remove-item order-buttons">X</span>
            </li>
            `;
            
        });
 
    // Draw changes
    orderItemsDisplay.querySelector(".order-list").innerHTML = orderHtml;
    orderItemsDisplay.querySelector(".total-sum").innerHTML = `Final sum: ${finalSum}`;

    // Add event listener for each remove button in the Shopping Cart - after being drawn
    setTimeout(() => {
        orderItemsDisplay.querySelectorAll(".remove-item").forEach((removeItem, index) => {
            removeItem.addEventListener("click", (target) => {
                newOrderItems.splice(index, 1);
                addOrderItems(newOrderItems);
            });
        });
    }, 50);
}



loginButton.addEventListener("click", () => {

    let data = new Object();
    data.username = username.value;
    data.password = password.value;

    

    let loginOptions = {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin":"*"
        },
        body: JSON.stringify(data)
      };


    fetchFunction(`${homeUrl}User/`, loginOptions).then( res => {
        // On login show product list
        if (res.token) {
            jwtToken = res.token;
            
            const getOptions = {method: 'GET',
                    
                    headers: {
                            "accept": "*/*",
                            "Authorization": `Bearer ${jwtToken}`, 
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin":"*"
                        }
                        }; 
    
            
            
            container.classList.remove("hidden");
            loginForm.classList.add("hidden");
            
            newOrder.customerId = res.userId;
            // Temporary solution - implement on backend to provide an employeeId
            newOrder.employeeId = 7;
            
                let productData = fetchFunction(`${homeUrl}product/`, getOptions).then(receivedProducts => {
                    
                    arrayOfProducts = receivedProducts;

                    //Display received products

                    displayProducts(receivedProducts, productSection);

                })
                // TODO: Impelement wrong login credentials message
        } else {

        }

    });
});



// Show shopping cart
shoppingCartIcon.addEventListener("click", () => {
    orderItemsDisplay.classList.toggle("hidden");

    addOrderItems(newOrderItems);
});

// Clear shopping cart
clearCart.addEventListener("click", () => {
    newOrderItems = [];
    finalSum = 0;
    orderItemsDisplay.querySelector(".total-sum").innerHTML = `Final sum: ${finalSum}`
    orderItemsDisplay.querySelector(".order-list").innerHTML = "";
});


let notLoadedProfileOrders = true;

// Show profile modal
profileIcon.addEventListener("click", () => {
    profileModal.classList.toggle("hidden");
    const allInputs = document.querySelectorAll(".order-controls input");
    allInputs.forEach(item => {
        item.classList.toggle("hidden");
    });

    const getOptions = {method: 'GET',
                    
    headers: {
            "WWW-Authenticate" : "Bearer",
            "Authorization": `Bearer ${jwtToken}`, 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":"*"
        }
        }; 
    
    // Fetch order data for logged in user
    if (notLoadedProfileOrders) {
        fetchFunction(`${homeUrl}Order/orders`, getOptions).then( res => {
        
            displayPreviousOrders(res, profileOrders);
            notLoadedProfileOrders = false;
    

        });
    }

});




// Hide modal
closeModal.addEventListener("click", () => {
    const allInputs = document.querySelectorAll(".order-controls input");
    profileModal.classList.toggle("hidden");
    allInputs.forEach(item => {
        item.classList.toggle("hidden");
    });
});

if (profileModal.classList.contains("hidden")) {

}


// Create the order
createOrder.addEventListener("click", () => {
    newOrder.orderItems = [];

    newOrderItems.forEach(item => {
        newOrder.orderItems.push(
            {"productId": item.productId,
             "quantity": item.quantity}
                            );
    });

    let orderOptions = {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            "accept": "*/*",
            "Authorization": `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":"*"
        },
        body: JSON.stringify(newOrder)
      };

    
    fetchFunction(`${homeUrl}Order`, orderOptions).then(response => {
        console.log(`Your order has been successfully processed. Final sum is ${orderItemsDisplay.querySelector(".total-sum").innerHTML.split(" ")[2]}`);
        newOrderItems = [];
        addOrderItems(newOrderItems);
    }, reject => {
        console.log("Your order was not processed. Something went wrong with the order.");
    });
});

