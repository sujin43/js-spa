import Dashboard from "./views/Dashboard.js";
import Posts from "./views/Posts.js";
import PostView from "./views/PostView.js";
import Settings from "./views/Settings.js";

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$")
//path에서 "/"가 들어가있으면 \\/로 바꾸고, :로 시작하는 단어 영문자가 있으면 (.+)로 바꿔라
const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    console.log(Array.from(match.route.path.matchAll(/:(\w+)/g)));
    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]] 
    }));
}

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
}

const router = async () => {
    console.log(pathToRegex("/post/2"))
    // /posts/:id
    // /^ \/post\/(.+) $/
    const routes = [
        { path: "/", view: Dashboard },
        { path: "/posts", view: Posts },
        { path: "/posts/:id", view: PostView },
        { path: "/settings", view: Settings },
    ];

    //Test each route for potential match
    const potentialMatches = routes.map(route => {
        console.log(route.path)
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        }
    });
    console.log(potentialMatches)

    let match = potentialMatches.find(potentialMatche => potentialMatche.result !== null);

    if(!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));

    document.querySelector("#app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if(e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    })
    router();
})