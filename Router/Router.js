import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

const route404 = new Route("404", "Page introuvable", "./pages/404.html");

const getRouteByUrl = (url) => {
  let currentRoute = null;
  allRoutes.forEach((element) => {
    if (element.url == url) {
      currentRoute = element;
    }
  });
  return currentRoute != null ? currentRoute : route404;
};

const LoadContentPage = async () => {
  const path = window.location.pathname.replace("/index.html", "/") || "/";
  console.log("1. path:", path);

  const actualRoute = getRouteByUrl(path);
  console.log("2. route trouvée:", actualRoute);
  console.log("3. pathHtml:", actualRoute.pathHtml);

  let html;
  try {
    const response = await fetch(actualRoute.pathHtml);
    console.log("4. response.ok:", response.ok, "| status:", response.status, "| url:", response.url);

    if (response.ok) {
      html = await response.text();
    } else {
      const fallback = await fetch(route404.pathHtml);
      html = fallback.ok ? await fallback.text() : "<h1>404 - Page introuvable</h1>";
      document.title = route404.title + " - " + websiteName;
      document.getElementById("main-page").innerHTML = html;
      return;
    }
  } catch (e) {
    console.log("5. ERREUR catch:", e);
    html = "<h1>404 - Page introuvable</h1>";
  }

  document.getElementById("main-page").innerHTML = html;

  if (actualRoute.pathJS != "") {
    var scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", actualRoute.pathJS);
    document.querySelector("body").appendChild(scriptTag);
  }

  document.title = actualRoute.title + " - " + websiteName;

};

window.onpopstate = LoadContentPage;

window.route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  LoadContentPage();
};

window.LoadContentPage = LoadContentPage;
LoadContentPage();

document.addEventListener("click", (event) => {
  console.log("CLIC détecté sur:", event.target); // ✅ en dehors du if
  const link = event.target.closest("a");
  if (link && link.origin === window.location.origin) {
    console.log("CLIC intercepté sur:", link.href);
    event.preventDefault();
    window.history.pushState({}, "", link.href);
    LoadContentPage();
  }
});