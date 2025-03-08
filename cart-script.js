document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cart-items");
    const totalAmount = document.getElementById("total-amount");
    const checkoutBtn = document.getElementById("checkout-btn");

    // Function to display cart items
    function displayCart() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p class='empty-cart'>Your cart is empty.</p>";
            totalAmount.textContent = "Total: Rs. 0";
            return;
        }

        cart.forEach((item, index) => {
            total += item.price * item.quantity;

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <img src="${item.image}" class="cart-img">
                <div class="cart-details">
                    <p>${item.name}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: Rs. ${item.price * item.quantity}</p>
                </div>
                <button class="remove-item" data-index="${index}">Remove</button>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        totalAmount.textContent = `Total: Rs. ${total}`;
    }

    // Function to handle checkout and generate receipt
    function checkout() {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        let receiptContent = `<h2>Receipt</h2>`;
        let total = 0;

        cart.forEach((item) => {
            total += item.price * item.quantity;
            receiptContent += `
                <p>${item.name} - ${item.quantity} x Rs. ${item.price} = Rs. ${item.price * item.quantity}</p>
            `;
        });

        receiptContent += `<h3>Total: Rs. ${total}</h3>`;
        receiptContent += `<p>Thank you for shopping with us!</p>`;

        // Open a new window for receipt
        let receiptWindow = window.open("", "_blank");
        receiptWindow.document.write(`<html><head><title>Receipt</title></head><body>${receiptContent}</body></html>`);
        receiptWindow.document.close();

        // Empty the cart
        localStorage.removeItem("cart");
        cart = [];
        displayCart();
    }

    // Remove item from cart
    cartItemsContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("remove-item")) {
            const index = e.target.dataset.index;
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
        }
    });

    // Attach checkout function to the button
    checkoutBtn.addEventListener("click", checkout);

    // Initial display
    displayCart();
});
