// public/script.js
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // tampilkan pesan user
  const userMsg = document.createElement("div");
  userMsg.className = "bg-blue-500 text-white p-2 rounded-lg self-end mb-2";
  userMsg.textContent = message;
  chatBox.appendChild(userMsg);

  userInput.value = "";

  try {
    // kirim pesan ke server backend
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) throw new Error("Gagal terhubung ke server");

    const data = await res.json();

    // tampilkan balasan dari server
    const botMsg = document.createElement("div");
    botMsg.className = "bg-gray-200 text-black p-2 rounded-lg self-start mb-2";
    botMsg.textContent = data.reply || "Tidak ada respons 😅";
    chatBox.appendChild(botMsg);

    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    console.error("Error:", error);
    const errMsg = document.createElement("div");
    errMsg.className = "bg-red-500 text-white p-2 rounded-lg self-start mb-2";
    errMsg.textContent = "Terjadi kesalahan koneksi 😢";
    chatBox.appendChild(errMsg);
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
