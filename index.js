const express = require("express");
const app = express();
app.use(express.json());

const { Client, GatewayIntentBits, ChannelType, PermissionsBitField } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`✅ Bot online als ${client.user.tag}`);
});

app.post("/webhook", async (req, res) => {
  try {
    const data = req.body;

    const guild = client.guilds.cache.get("1484956843016061008");
    const category = guild.channels.cache.get("1484956849257054210");

    const channel = await guild.channels.create({
      name: `ticket-${Date.now()}`,
      type: ChannelType.GuildText,
      parent: category.id,
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: [PermissionsBitField.Flags.ViewChannel],
        }
      ]
    });

    await channel.send(`🛒 **Neue Bestellung!**

📦 Produkt: ${data.product_name || "Unbekannt"}
👤 Kunde: ${data.customer_email || "Unbekannt"}

💰 **Zahlung:**
Sende das Geld hierhin:
👉 PAYPAL / CRYPTO / etc

📩 Nach Zahlung bitte hier schreiben!
    `);

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/", (req, res) => {
  res.send("Bot läuft!");
});

app.listen(3000, () => {
  console.log("🌐 Webserver läuft auf Port 3000");
});

client.login(process.env.TOKEN);