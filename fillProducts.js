const express = require("express");

const createProductsRouter = express.Router();

async function createProduct_request(TOKEN_COOKIE, { name, description, colors, sizes, price, inventory, type, imagesFiles }) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('colors', colors);
    formData.append('sizes', sizes);
    formData.append('price', price);
    formData.append('inventory', inventory);
    formData.append('type', type);

    for (const fileItem of imagesFiles) {
        formData.append('images', fileItem);
    }
    const response = await fetch(`${Bun.env.API_URL}/api/v1/products/create`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        headers: { 'Cookie': `token_cookie=${TOKEN_COOKIE}` }
    });
    const data = await response.json();
    return data;
}

const PRODUCTS = [
    {
        name: "Totebag",
        description: "Un magnifique sac pour vos usages (un peu cher mais qu'importe!)",
        colors: "WHITE",
        sizes: "",
        price: "216",
        inventory: "20",
        type: '{"name": "totebag","logoUrl": "laptop-outline"}',
        imagesFiles: [
            Bun.file('./createProductsImages/Totebag/totebag.jpg'),
        ]
    },
    {
        name: "Tee-Shirt",
        description: "Tee-Sheurt",
        colors: "WHITE,GRAY,BLACK",
        sizes: "S,L,M",
        price: "20",
        inventory: "100",
        type: '{"name": "tee-shirt","logoUrl": "shirt-outline"}',
        imagesFiles: [
            Bun.file('./createProductsImages/Tee-Shirt/tshirtblanc.png'),
            Bun.file('./createProductsImages/Tee-Shirt/tshirtgris.png'),
            Bun.file('./createProductsImages/Tee-Shirt/tshirtnoir.png'),
        ]
    },
    {
        name: "Tee-Shirt femme",
        description: "Tee-Sheurt mais pour les femmes (pourquoi faire la séparation, Je Ne Sais Pas)",
        colors: "GRAY, GRAY aussi mais plus BLUE",
        sizes: "S,L,M, XS,XL",
        price: "42",
        inventory: "420",
        type: '2',
        imagesFiles: [
            Bun.file('./createProductsImages/Tee-Shirt femme/tshirtfemme.png'),
            Bun.file('./createProductsImages/Tee-Shirt femme/tshirtfemme2.png'),
        ]
    },
]

createProductsRouter.get("/products", async (req, res) => {
    let responses = [];

    for (const product of PRODUCTS) {
        const response = await createProduct_request(req.cookies.token_cookie, product);

        responses.push(response);
    }

    res.send(responses);
});

module.exports = createProductsRouter;