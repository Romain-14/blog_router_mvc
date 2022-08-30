import express from 'express';
import 'dotenv/config';
import {fileURLToPath} from 'url';
import path from 'path';
import parseurl from 'parseurl';
import session from 'express-session';

import router from './router/index.js';
import {PORT} from './lib/index.js';

const app = express();
// définition de l'emplacement de notre dossier contenant les vues(views)
app.set("views", "./views");
// définition du moteur de rendu --> ejs
app.set("view engine", "ejs");

// définition de la route static public
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
app.use(express.static(path.join(__dirname + "/public")));

// middleware express natif qui permets de récupérer les données post afin de les parser
app.use(express.json()); // pour parser le content-type application/json
app.use(express.urlencoded({extended: true})); // pour parser les données formulaire post 
// anciennement librairie body-parser qu'il fallait import en tant que module avant la version 4.x d'express

// EXPRESS-SESSION mise en place
app.use(session({
    secret: "j'aime les chats bien cuits",
    // true permets de forcer la sauvegarder de la session même sans modification, évite de créer des conflit en cas de requête parallèle
    resave: true, // par default c'est save mais on le doit spécifier même si on veut la valeur à true
    // comme resave mais joue sur une nouvelle instance de la session 
    saveUninitialized: true, // par default c'est save mais on le doit spécifier même si on veut la valeur à true
    proxy: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // durée de vie de 1 journée -> 86 400 000 secondes
        secure: process.env.NOVE_ENV && process.env.NOVE_ENV === "production" ? true : false,
    },
}));

app.use((req, res, next)=>{
    // console.log("req.session ----->",req.session);
    res.locals.session = req.session;
    res.locals.error = null;
    
    if(!req.session.user){
        req.session.user = null;
        req.session.isLogged = false;
    }
    
    console.log("res.locals.session ---->",res.locals.session);
    next();
});

app.use(router);

app.listen(PORT, ()=> {
    console.log(`Listening at http://localhost:${PORT}`)
});