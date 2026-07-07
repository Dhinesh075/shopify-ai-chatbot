const chatBox = document.getElementById("chat-box");

let conversationHistory = [];

const input = document.getElementById("message");

const send = document.getElementById("send");

const toggle = document.getElementById("chat-toggle");

const container = document.getElementById("chat-container");

const closeBtn = document.getElementById("close-chat");

const typing = document.createElement("div");

const history = localStorage.getItem("chatHistory");

if (history) {

   chatBox.innerHTML = history;

}

toggle.addEventListener("click", () => {

   container.classList.toggle("hidden");

   input.focus();

});

typing.className = "bot-message";

typing.id = "typing";

typing.innerHTML = "🤖 Typing...";

chatBox.appendChild(typing);

chatBox.scrollTop = chatBox.scrollHeight;

document.getElementById("typing").remove();

closeBtn.addEventListener("click", () => {

   container.classList.add("hidden");

});

send.addEventListener("click", sendMessage);

input.addEventListener("keypress", (e) => {

   if (e.key === "Enter") {

      sendMessage();

   }

});

localStorage.setItem(
   "chatHistory",
   chatBox.innerHTML
);

async function sendMessage() {

   const message = input.value.trim();

   if (message === "") return;
   conversationHistory.push({
      role: "user",
      content: message
   });

   chatBox.innerHTML += `

<div class="user-message">
${message}
</div>

`;

   input.value = "";

   chatBox.scrollTop = chatBox.scrollHeight;

   try {
      const response = await fetch("http://localhost:3000/api/chat", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            message,
            history: conversationHistory
         })
      });

      if (!response.ok) {
         const errorBody = await response.text();
         throw new Error(`Server returned ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      if (data.reply) {
         conversationHistory.push({
            role: "assistant",
            content: data.reply
         });
      }

      if (!data.success) {
         throw new Error(data.error || "No reply received from server.");
      }

      if (data.type === "products") {
         if (data.products.length === 0) {
            chatBox.innerHTML += `
            <div class="bot-message">
                Sorry, I couldn't find any products matching that.
                <div class="time">${new Date().toLocaleTimeString()}</div>
            </div>
            `;
         } else {
            data.products.forEach(product => {
               chatBox.innerHTML += `
               <div class="product-card">
                   <img src="${product.image}" alt="${product.title}" />
                   <h3>${product.title}</h3>
                   <p>$${product.price}</p>
                   <div class="product-buttons">
                       <a href="${product.url}" target="_blank">
                           View
                       </a>
                       <button onclick="addToCart(${product.variantId})">
                           Add to Cart
                       </button>
                       <button onclick="saveProduct(
                        '${product.id}',
                        '${product.title}',
                        '${product.price}',
                        '${product.image}'
                        )">
                        ❤️ Save
                        </button>
                   </div>
               </div>
               `;
            });
         }
      } else {
         chatBox.innerHTML += `
         <div class="bot-message">
             ${data.reply}
             <div class="time">${new Date().toLocaleTimeString()}</div>
         </div>
         `;
      }

      localStorage.setItem("chatHistory", chatBox.innerHTML);
      chatBox.scrollTop = chatBox.scrollHeight;
   } catch (error) {
      chatBox.innerHTML += `
      <div class="bot-message error">
         Sorry, I couldn't get a reply. ${error.message}
      </div>
      `;
      chatBox.scrollTop = chatBox.scrollHeight;
   }
}

function addToCart(variantId) {
   const cartUrl = `https://dhinesh075.myshopify.com/cart/${variantId}:1`;
   window.open(cartUrl, "_blank");
}
