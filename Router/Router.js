import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

const route404 = new Route("404", "Page introuvable", "./pages/404.html", []);

// ── Loader ──────────────────────────────────────────────────────────────────
const showLoader = () => {
  let loader = document.getElementById("page-loader");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "page-loader";
    loader.innerHTML = `<div class="page-loader__spinner"></div>`;
    loader.style.cssText = `
      position: fixed; inset: 0;
      display: flex; align-items: center; justify-content: center;
      background: rgba(255, 255, 255, 0.85);
      z-index: 9999;
      transition: opacity 0.3s ease;
    `;
    loader.querySelector(".page-loader__spinner").style.cssText = `
      width: 48px; height: 48px;
      border: 5px solid #e0e0e0;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: page-loader-spin 0.8s linear infinite;
    `;
    if (!document.getElementById("page-loader-style")) {
      const style = document.createElement("style");
      style.id = "page-loader-style";
      style.textContent = `
        @keyframes page-loader-spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
    document.body.appendChild(loader);
  }
  loader.style.opacity = "1";
  loader.style.display = "flex";
};

const hideLoader = () => {
  const loader = document.getElementById("page-loader");
  if (!loader) return;
  loader.style.opacity = "0";
  setTimeout(() => (loader.style.display = "none"), 300);
};
// ────────────────────────────────────────────────────────────────────────────

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
  showLoader(); // ← affiche le loader dès le début du chargement

  const path = window.location.pathname.replace("/index.html", "/") || "/";
  console.log("1. path:", path);
  const actualRoute = getRouteByUrl(path);
  console.log("2. route trouvée:", actualRoute);
  console.log("3. pathHtml:", actualRoute.pathHtml);

  // Vérification de l'autorisation d'accès à la page
  const allRolesArray = actualRoute.authorize;
  if (allRolesArray.length > 0) {
    if (allRolesArray.includes("disconnected")) {
      if (isConnected()) {
        window.location.replace("/");
      }
    } else {
      const roleUser = getRole();
      if (!allRolesArray.includes(roleUser)) {
        window.location.replace("/");
      }
    }
  }

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
      hideLoader(); // ← masque le loader en cas d'erreur 404
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

  // Met à jour le titre de la page
  document.title = actualRoute.title + " - " + websiteName;

  // Affiche ou masque les éléments en fonction du rôle de l'utilisateur
  showAndHideElementsForRoles();

  hideLoader(); // ← masque le loader une fois tout prêt
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
  console.log("CLIC détecté sur:", event.target);
  const link = event.target.closest("a");
  if (link && link.origin === window.location.origin) {
    console.log("CLIC intercepté sur:", link.href);
    event.preventDefault();
    window.history.pushState({}, "", link.href);
    LoadContentPage();
  }
});