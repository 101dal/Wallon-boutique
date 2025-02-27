const express = require("express");

const createProductsRouter = express.Router();

async function createProduct_request(TOKEN_COOKIE, { name, description, colors, sizes, price, inventory, type_id, imagesFiles }) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('colors', colors);
    formData.append('sizes', sizes);
    formData.append('price', price);
    formData.append('inventory', inventory);
    formData.append('type_id', type_id);

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

async function createType_request(TOKEN_COOKIE, { name, logoUrl }) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('logoUrl', logoUrl);
    const response = await fetch(`http://localhost:3000/api/v1/types/create`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        headers: { 'Cookie': `token_cookie=${TOKEN_COOKIE}` }
    });
    const data = await response.json();
    return data;
}
// Create all the types
const TYPES = [
    {
        name: "totebag",
        logoUrl: "bag-outline"
    },
    {
        name: "tee-shirt",
        logoUrl: "shirt-outline"
    },
];

// Create all the products
const PRODUCTS = [
    {
        name: "Totebag",
        description: "Un magnifique sac pour vos usages (un peu cher mais qu'importe!)",
        colors: "WHITE",
        sizes: "",
        price: "216",
        inventory: "20",
        type_id: '1',
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
        type_id: '2',
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
        type_id: '2',
        imagesFiles: [
            Bun.file('./createProductsImages/Tee-Shirt femme/tshirtfemme.png'),
            Bun.file('./createProductsImages/Tee-Shirt femme/tshirtfemme2.png'),
        ]
    },
]

createProductsRouter.get("/fill", async (req, res) => {
    let ALL_RESPONSES = [];

    const COOKIE = req.cookies.token_cookie

    for (const type of TYPES) {
        const response = await createType_request(COOKIE, type);

        ALL_RESPONSES.push(response)
    }

    for (const product of PRODUCTS) {
        const response = await createProduct_request(COOKIE, product);

        ALL_RESPONSES.push(response);
    }

    res.send(ALL_RESPONSES);
});

module.exports = createProductsRouter;