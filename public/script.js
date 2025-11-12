const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function createBubble(text, sender = "user") {
  const bubble = document.createElement("div");
  const wrapper = document.createElement("div");
  
  bubble.innerHTML = text;
  bubble.classList.add(
    "max-w-xs",                // lebar menyesuaikan isi
    "break-words",             // teks panjang akan turun otomatis
    "p-3",
    "rounded-2xl",
    "shadow-md",
    "text-sm",
    "leading-relaxed",
    "whitespace-pre-line",     // biar line break dan list tetap rapi
    "animate-fadeIn"
  );

  wrapper.classList.add("flex", "mb-3", "items-end");

  if (sender === "user") {
    wrapper.classList.add("justify-end");
    bubble.classList.add("bg-sky-400", "text-white", "rounded-br-none");
  } else {
    wrapper.classList.add("justify-start");
    bubble.classList.add("bg-white/80", "text-gray-700", "border", "border-gray-200", "rounded-bl-none");
  }

  wrapper.appendChild(bubble);
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // tampilkan pesan user
  createBubble(message, "user");
  userInput.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) throw new Error("Gagal terhubung ke server");

    const data = await res.json();

    // tampilkan balasan bot
    const reply = formatBotMessage(data.reply || "Tidak ada respons 😅");
    createBubble(reply, "bot");
  } catch (error) {
    console.error("Error:", error);
    createBubble("Terjadi kesalahan koneksi 😢", "bot");
  }
}

function formatBotMessage(text) {
  // ubah list dan newline biar rapi
  const formatted = text
    .replace(/\n{2,}/g, "\n\n") // jaga jarak antar paragraf
    .replace(/- (.+)/g, "• $1"); // ubah tanda '-' jadi bullet
  return formatted;
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
