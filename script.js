document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Retrieve cart from localStorage
    const cartIcon = document.querySelector(".icons span:nth-child(2)"); // Shopping bag icon

    // Function to save cart data to localStorage
    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Function to update cart display (only needed in cart.html)
    function updateCartDisplay() {
        const cartContainer = document.getElementById("cart-items");
        const totalAmountElement = document.getElementById("total-amount");
        if (!cartContainer) return; // Prevent error if not on cart.html

        cartContainer.innerHTML = "";
        let totalAmount = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty</p>";
        } else {
            cart.forEach((item, index) => {
                totalAmount += item.price * item.quantity;
                cartContainer.innerHTML += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" width="50">
                        <p>${item.name} - Rs.${item.price} x ${item.quantity}</p>
                        <button class="remove-item" data-index="${index}">Remove</button>
                    </div>
                `;
            });
        }

        totalAmountElement.innerHTML = `Total: Rs.${totalAmount}`;

        attachRemoveEvent();
        attachCheckoutEvent();
    }

    // Function to attach event listeners to remove buttons
    function attachRemoveEvent() {
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                cart.splice(index, 1);
                saveCart(); // Save updated cart to localStorage
                updateCartDisplay();
            });
        });
    }

    // Function to attach checkout event
    function attachCheckoutEvent() {
        const checkoutBtn = document.getElementById("checkout-btn");
        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", function () {
                generateReceipt();
                cart = []; // Empty cart after checkout
                saveCart(); // Clear cart in localStorage
                updateCartDisplay();
            });
        }
    }

    // Function to generate receipt
    function generateReceipt() {
        let receiptContent = "<h2>Receipt</h2><ul>";
        let totalAmount = 0;
        cart.forEach(item => {
            totalAmount += item.price * item.quantity;
            receiptContent += `<li>${item.name} - Rs.${item.price} x ${item.quantity}</li>`;
        });
        receiptContent += `</ul><h3>Total: Rs.${totalAmount}</h3>`;

        const receiptWindow = window.open("", "_blank");
        receiptWindow.document.write(`<html><head><title>Receipt</title></head><body>${receiptContent}</body></html>`);
        receiptWindow.document.close();
    }

    // Add to Cart Functionality
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const name = this.getAttribute("data-name");
            const price = parseInt(this.getAttribute("data-price"));
            const image = this.getAttribute("data-image");

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, image, quantity: 1 });
            }
            saveCart(); // Save updated cart to localStorage
        });
    });

    // Redirect to Cart Page when clicking on the shopping icon
    cartIcon.addEventListener("click", function () {
        window.location.href = "cart.html"; // Redirect to cart page
    });

    // Check if we're on cart.html and update display
    if (window.location.pathname.includes("cart.html")) {
        updateCartDisplay();
    }
});
