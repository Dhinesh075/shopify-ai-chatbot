(function () {

    const css = document.createElement("link");

    css.rel = "stylesheet";

    css.href = "http://localhost:5500/assets/chatbot.css";

    document.head.appendChild(css);

    const script = document.createElement("script");

    script.src = "http://localhost:5500/assets/chatbot.js";

    document.body.appendChild(script);

})();