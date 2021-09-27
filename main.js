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

let newOrder = new Object();
newOrder.orderItems = [];


let newOrderItems = [];

const getOptions = {method: 'GET',
                    credentials: 'same-origin',
                    headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin":"*"
  }
}; 


async function fetchFunction(endpoint, options) {
    let request = new Request(endpoint, (options));
    let response = await fetch(request);
    let data = await response.json();
    console.log(data);
    return data;
}

let homeUrl = "https://localhost:44394/api/";


// btnEmployee.addEventListener("click", () => {
//     let finalUrl = homeUrl + "employee/";

//     fetchFunction(finalUrl, getOptions);
// });

// btnCustomer.addEventListener("click", () => {
//     let finalUrl = homeUrl + "customer/";

//     fetchFunction(finalUrl, getOptions);
// });

// btnProduct.addEventListener("click", () => {
//     let finalUrl = homeUrl + "product/";

//     fetchFunction(finalUrl, getOptions);
// });


let observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.target.childElementCount == 0) {
            console.log("Cart is empty");
        }
    });
    
});

observer.observe(document.querySelector(".order-list"), {
    childList: true
});

// async function ordered(orderList) {
//     let checkedItem;
//     let sortedList = [];
//     console.log(orderList);
//     if (orderList.length > 1) {
//     orderList.forEach((item, index) => {
//         checkedItem = orderList[index];
//         if (checkedItem) {
//             console.log("entered second forEach");
//             orderList.forEach((item, index) => {
//                 if( checkedItem.productId == item.productId) {
//                     checkedItem.quantity += item.quantity;
                    
//                 }
//             });
//             console.log(checkedItem);
//             sortedList.push(checkedItem);
//         }
//     });

//     return sortedList;
// }
//     else {
//         return orderList;
//     }
// };



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
            
            container.classList.remove("hidden");
            loginForm.classList.add("hidden");
            
            newOrder.customerId = res.userId;
            //Temporary solution
            newOrder.employeeId = 7;

                //let employeeData = fetchFunction(`${homeUrl}employee/`, getOptions);
                //let customerData = fetchFunction(`${homeUrl}customer/`, getOptions);
            
                let productData = fetchFunction(`${homeUrl}product/`, getOptions).then(arrayOfProducts => {
                    //Display received products
                    arrayOfProducts.forEach(item => {
                        
                        productSection.lastElementChild.insertAdjacentHTML("afterend",
                            `
                        <div class="card" id="product-id-${item.productId}">
                            <img src="${item.imagePath}" alt="">
                            <div class="card-text">
                                <h2>${item.productName}</h2>
                                <p class="product-description">${(item.description).substr(0, 160)}...</p>
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
                    return arrayOfProducts;
                }).then(arrayOfProducts => {
                    // Add event listener to each product
                    const addItem = document.querySelectorAll(".add-item");

                    addItem.forEach(addToCartButton => {
                        addToCartButton.addEventListener("click", (product) => {
                            console.log(product);

                            let productQty = product.target.previousElementSibling.value;
                            if (productQty > 0) {
                                let productId = product.target.parentElement.parentElement.id.split ("-").pop();
                            
                                clickedItem = arrayOfProducts.find( product => product.productId == productId);                               
                                
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
                });
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
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin":"*"
        },
        body: JSON.stringify(newOrder)
      };

    
    fetchFunction(`${homeUrl}Order`, orderOptions).then(response => {
        console.log(`Your order has been successfully processed. Final sum is ${orderItemsDisplay.querySelector(".total-sum").innerHTML.split(" ")[2]}`);
        newOrderItems = [];
        addOrderItems(newOrderItems);
    });
});

