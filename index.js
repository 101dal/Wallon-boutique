import { fetch } from "bun";
import cookieParser from "cookie-parser";

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


// Checks if the user is logged in for each request to the pages
app.use(async (req, res, next) => {
    const response = await fetch(`http://localhost:3000/api/v1/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Cookie': `token_cookie=${req.cookies.token_cookie}` }
    });
    const data = await response.json();

    res.locals.logged = data.status === 200;

    next();
})




// LISTE DE TOUTES LES ROUTES
app.get("/", (req, res) => {
    const registered = req.query.registered === 'true';
    const disconnected = req.query.disconnected === 'true';
    res.render("pages/home", { active: "home", container: "home", registered, disconnected });
});


app.get("/contact", (req, res) => {
    res.render("pages/contact", { active: "contact", container: "contact" })
});

app.get("/login", (req, res) => {
    res.render("pages/login", { active: "login", container: "auth" })
});

app.get("/register", (req, res) => {
    res.render("pages/register", { active: false, container: "auth" })
});

app.get("/profile", async (req, res) => {
    if (!res.locals.logged) {
        res.redirect("/login");
    }

    // Make the request to the api to get the user's information
    let response = await fetch(`http://localhost:3000/api/v1/users/me`, {
        method: 'GET',
        headers: { 'Cookie': `token_cookie=${req.cookies.token_cookie}` }
    });
    const infos = await response.json();

    // Get the user's orders
    response = await fetch(`http://localhost:3000/api/v1/orders/history`, {
        method: 'GET',
        headers: { 'Cookie': `token_cookie=${req.cookies.token_cookie}` }
    });
    const orders = await response.json();

    res.render("pages/profile", { active: "profile", container: "profile", infos, orders });
});

app.get("/panier", async (req, res) => {
    if (!res.locals.logged) {
        res.redirect("/login");
    }

    // Get the user's carts
    let response = await fetch(`http://localhost:3000/api/v1/carts/get`, {
        method: 'GET',
        headers: { 'Cookie': `token_cookie=${req.cookies.token_cookie}` }
    });
    const carts = await response.json();


    res.render("pages/panier", { active: "panier", container: "cart", carts: carts })
});




// Démarrage du serveur
const PORT = Bun.env.PORT
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
