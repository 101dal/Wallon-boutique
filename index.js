import { fetch } from "bun";
import cookieParser from "cookie-parser";
import createProductsRouter from "./fillProducts";

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

// CONFIGURATION
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(expressLayouts);
app.set("layout", "./components/layout");
app.use(cookieParser());

const API_URL = Bun.env.API_URL;

const errorMessages = await (await fetch(`${API_URL}/api/v1/errors`)).json();


// Checks if the user is logged in for each request to the pages
app.use(async (req, res, next) => {
    const response_profile = await fetch(`${API_URL}/api/v1/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Cookie': `token_cookie=${req.cookies.token_cookie}` }
    });
    const data = await response_profile.json();



    res.locals.errorMessages = JSON.stringify(errorMessages);
    res.locals.logged = data.status === 200;
    res.locals.profile = data.content;
    res.locals.numberOfProducts = data.content.cart_amount || 0;
    res.locals.API_URL = API_URL;

    next();
});

// LISTE DE TOUTES LES ROUTES
app.get("/", async (req, res) => {
    const registered = req.query.registered === 'true';
    const disconnected = req.query.disconnected === 'true';

    try {
        // Appel à l'API pour récupérer tous les produits
        const response = await fetch(`${API_URL}/api/v1/products`, {
            method: 'GET',
        });
        const data = await response.json();

        // Tri décroissant selon le nombre de produits vendus (champ sold)
        let bestSellers = data.content
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 3); // On garde uniquement les trois premiers

        // Réordonner : échanger le 1er et le 2e éléments
        if (bestSellers.length >= 2) {
            [bestSellers[0], bestSellers[1]] = [bestSellers[1], bestSellers[0]];
        }

        // On passe bestSellers à la vue home.ejs
        res.render("pages/home", { active: "home", container: "home", registered, disconnected, bestSellers });
    } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
        res.render("pages/home", { active: "home", container: "home", registered, disconnected, bestSellers: [] });
    }
});

app.get("/charte-du-site", (req, res) => {
    res.render("pages/charte", { active: "charte", container: "charte" })
})

app.use("/database", createProductsRouter);


app.get("/products", async (req, res) => {
    // Récupère les produits
    const productsResponse = await fetch(`${API_URL}/api/v1/products`);
    const products = await productsResponse.json();

    // Récupère tous les types
    const typesResponse = await fetch(`${API_URL}/api/v1/products/types`);
    const typesData = await typesResponse.json();

    let filteredTypes = [];
    if (products.status === 200 && products.content?.length) {
        // Ajoute la propriété 'type' correspondant au typeId
        products.content.forEach(product => product.type = product.typeId);

        // Filtre les types ayant des produits associés
        const usedTypeIds = new Set(products.content.map(p => p.typeId));
        filteredTypes = typesData.content.filter(type => usedTypeIds.has(type.id));
    }

    res.render("pages/products", {
        active: "products",
        container: "product",
        products,
        types: filteredTypes
    });
});

app.get("/products/:id", async (req, res) => {
    let response = await fetch(`${API_URL}/api/v1/products/get/${req.params.id}`, {
        method: 'GET'
    });
    const product = await response.json();

    if (product.status !== 200) {
        res.redirect("/products");
    }

    response = await fetch(`${API_URL}/api/v1/reviews/product/${req.params.id}`, {
        method: 'GET',
    });
    const reviews = await response.json();


    res.render("pages/product-details", { active: "product-detail", container: "product-detail", product, reviews })
})


app.get("/contact", (req, res) => {
    res.render("pages/contact", { active: "contact", container: "contact" })
});

app.get("/login", (req, res) => {
    res.render("pages/login", { active: "login", container: "auth" })
});

app.get("/register", async (req, res) => {
    const request = await fetch(`${API_URL}/api/v1/users/classes`, {
        method: 'GET',
    });
    const classes = await request.json();

    let classesMap = {};

    classes.content.forEach(([name, amount]) => {
        classesMap[name] = amount;
    });

    classesMap = JSON.stringify(classesMap);

    res.render("pages/register", { active: false, container: "auth", classes, classesMap })
});

app.get("/profile", async (req, res) => {
    if (!res.locals.logged) {
        res.render("pages/404", { active: "404", container: "404" });
    }

    // If the user is an admin then you redirect him to 

    // Get the user's orders
    let response;
    response = await fetch(`${API_URL}/api/v1/orders/history`, {
        method: 'GET',
        headers: { 'Cookie': `token_cookie=${req.cookies.token_cookie}` }
    });
    const orders = await response.json();

    res.render("pages/profile", { active: "profile", container: "profile", orders });
});

app.get("/panier", async (req, res) => {
    if (!res.locals.logged) {
        res.render("pages/404", { active: "404", container: "404" });
    }

    // Get the user's carts
    let response = await fetch(`${API_URL}/api/v1/carts/get`, {
        method: 'GET',
        headers: { 'Cookie': `token_cookie=${req.cookies.token_cookie}` }
    });
    const carts = await response.json();


    res.render("pages/panier", { active: "panier", container: "cart", carts: carts })
});

app.get("/dashboard", async (req, res) => {
    if (!res.locals.logged) {
        res.render("pages/404", { active: "404", container: "404" });
    }

    if (res.locals.profile.role === "ADMIN") {
        res.render("pages/dashboard/dashboard-admin", { active: "dashboard-admin", container: "dashboard" });
    } else if (res.locals.profile.role === "EMPLOYEE") {
        // Get a list of all the products
        const response = await fetch(`${API_URL}/api/v1/orders/all`, {
            method: 'GET',
            headers: { 'Cookie': `token_cookie=${req.cookies.token_cookie}` }
        });
        const orders = await response.json();

        res.render("pages/dashboard/dashboard-employee", { active: "dashboard-employee", container: "orders", orders });
    } else {
        res.render("pages/404", { active: "404", container: "404" });
    }

});

app.get("/dashboard/:type", async (req, res) => {
    if (!res.locals.logged) {
        res.render("pages/404", { active: "404", container: "404" });
    }

    if (res.locals.profile.role !== "ADMIN") {
        res.render("pages/404", { active: "404", container: "404" });
    }

    if (req.params.type === "products") {
        // Get a list of all the products
        const response = await fetch(`${API_URL}/api/v1/products`, {
            method: 'GET',
        });
        const products = await response.json();

        const listOfTypeLogos = [
            "phone-portrait-outline",
            "shirt-outline",
            "book-outline",
            "home-outline",
            "fast-food-outline",
            "fitness-outline",
            "color-palette-outline",
            "laptop-outline",
            "cut-outline",
            "beaker-outline",
            "game-controller-outline"
        ];

        res.render("pages/dashboard/dashboard-products", { active: "dashboard-admin", container: "products", products, listOfTypeLogos });
    }

    if (req.params.type === "users") {
        // Get a list of all the products
        const response = await fetch(`${API_URL}/api/v1/users/all`, {
            method: 'GET',
            headers: { 'Cookie': `token_cookie=${req.cookies.token_cookie}` }
        });
        const users = await response.json();

        res.render("pages/dashboard/dashboard-users", { active: "dashboard-admin", container: "users", users });
    }

    if (req.params.type === "orders") {
        // Get a list of all the products
        const response = await fetch(`${API_URL}/api/v1/orders/all`, {
            method: 'GET',
            headers: { 'Cookie': `token_cookie=${req.cookies.token_cookie}` }
        });
        const orders = await response.json();

        res.render("pages/dashboard/dashboard-orders", { active: "dashboard-admin", container: "orders", orders });
    }

    if (req.params.type === "carts") {
        // Get a list of all the products
        const response = await fetch(`${API_URL}/api/v1/carts/all`, {
            method: 'GET',
            headers: { 'Cookie': `token_cookie=${req.cookies.token_cookie}` }
        });
        const carts = await response.json();

        res.render("pages/dashboard/dashboard-carts", { active: "dashboard-admin", container: "carts", carts });
    }

    if (req.params.type === "reviews") {
        // Get a list of all the products
        const response = await fetch(`${API_URL}/api/v1/reviews/all`, {
            method: 'GET',
            headers: { 'Cookie': `token_cookie=${req.cookies.token_cookie}` }
        });
        const reviews = await response.json();

        res.render("pages/dashboard/dashboard-reviews", { active: "dashboard-admin", container: "reviews", reviews });
    }

    if (req.params.type === "supports") {
        res.render("pages/dashboard/dashboard-supports", { active: "dashboard-admin", container: "supports" });
    }
});

app.all("*", async (req, res) => {
    res.render("pages/404", { active: "404", container: "404" });
})


// Démarrage du serveur
const PORT = Bun.env.PORT
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
