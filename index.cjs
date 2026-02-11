const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// 🔐 VERIFY TOKEN (para Meta)
const VERIFY_TOKEN = "mitoken123";

// 🔑 PONÉ TUS DATOS REALES
const TOKEN = "EAAXITZBZAZBjwoBQulVayjwPOTCpHMKgNUKM8ZAkui8bGjCaZCdsSE8WRsWTPhlsXmLL8amaGmD7MiNr0uZBz0H26enGiwuuGNDrYiXATbvDLWR2SvNLtqZBRIpW94UcvXZCuSfbkRYJ1BFlKWmK6t1sOA33s8ZCds5hZADxSZB1l3GpCnaeqjf5uHj65zZCR2jUBE8ILQZDZD";
const PHONE_NUMBER_ID = "676134415527310";

/**
 * GET /webhook
 * Verificación inicial
 */
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    return res.status(200).send(challenge);
  }

  console.log("❌ Falló la verificación del webhook");
  return res.sendStatus(403);
});

/**
 * POST /webhook
 * Mensajes entrantes
 */
app.post("/webhook", async (req, res) => {

  const message =
    req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!message) {
    return res.sendStatus(200);
  }

  const from = message.from;
  const text = message.text?.body;

  console.log("📩 Mensaje recibido:", text);

  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: { body: "🚀 Cloud API funcionando perfecto Nico." }
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Respuesta enviada");
  } catch (error) {
    console.error("❌ Error enviando mensaje:");
    console.error(error.response?.data || error.message);
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
