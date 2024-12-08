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
        headers: {
            'Cookie': `token_cookie=${req.cookies.token_cookie}`
        }
    });
    const data = await response.json();

    res.locals.logged = data.status === 200;

    next();
})




// LITE DE TOUTES LES ROUTES
app.get("/", (req, res) => {
    const registered = req.query.registered === 'true';
    res.render("pages/home", { active: "home", registered });
});


app.get("/contact", (req, res) => {
    res.render("pages/contact", { active: "contact" })
});

app.get("/login", (req, res) => {
    res.render("pages/login", { active: "login" })
});

app.get("/profile", async (req, res) => {
    if (!res.locals.logged) {
        res.redirect("/login");
    }

    // Make the request to the api to get the user's information
    let response = await fetch(`http://localhost:3000/api/v1/users/me`, {
        method: 'GET',
        headers: {
            'Cookie': `token_cookie=${req.cookies.token_cookie}`
        }
    });
    const infos = await response.json();

    // Get the user's orders
    response = await fetch(`http://localhost:3000/api/v1/orders/history`, {
        method: 'GET',
        headers: {
            'Cookie': `token_cookie=${req.cookies.token_cookie}`
        }
    });
    const orders = await response.json();


    res.render("pages/profile", { active: "profile", infos, orders: orders.content });
})




// Démarrage du serveur
const PORT = Bun.env.PORT
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
