

function updateCartUI() {
    const cartContainer = document.querySelector('.cart-items');
    cartContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <h4>${item.name}</h4>
            <p>Preço: ${item.price}</p>
        `;
        cartContainer.appendChild(cartItem);
    });
}


const express = require('express');
const app = express();
const products = require('./data/products');

app.get('/products', (req, res) => {
    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const productId = req.params.id;
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});





const stripe = require('stripe')('chave-secreta');
app.post('/checkout', async (req, res) => {
    const { items } = req.body;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map(item => ({
            price_data: {
                currency: 'kz',
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: 'https://seusite.com/sucesso',
        cancel_url: 'https://seusite.com/cancelar',
    });

    res.json({ url: session.url });
});




// Modal do Carrinho
const cartModal = document.getElementById("cart-modal");
const cartLink = document.getElementById("cart-link");
const closeModal = document.querySelector(".close");
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalContainer = document.getElementById('cart-total');
let cart = [];

// Abrir Modal
cartLink.addEventListener("click", () => {
    cartModal.style.display = "block";
});

// Fechar Modal
closeModal.addEventListener("click", () => {
    cartModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

function addToCart(productName, price) {
    const product = { name: productName, price: price };
    cart.push(product);
    updateCartDisplay();
}

function updateCartDisplay() {
    cartItemsContainer.innerHTML = ''; // Limpa a lista de produtos
    let total = 0;

    cart.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price} KZ`;
        cartItemsContainer.appendChild(li);
        total += item.price;
    });

    cartTotalContainer.textContent = total;
}

document.getElementById('checkout-button').addEventListener('click', function() {
    alert('Compra finalizada! Total: ' + cartTotalContainer.textContent + ' KZ');
});
