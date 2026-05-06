export default async function handler(req, res) {
  // Gestione preflight per CORS (opzionale su Vercel ma buona pratica)
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metodo non consentito" });
  }

  const { texts, targetLang, userApiKey } = req.body;

  // Controllo che la chiave sia stata inviata dal frontend
  if (!userApiKey) {
    return res.status(400).json({
      message: "DeepL API Key mancante. Inseriscila nelle impostazioni.",
    });
  }

  try {
    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        // Usiamo la chiave passata dall'utente
        Authorization: `DeepL-Auth-Key ${userApiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: texts,
        target_lang: targetLang.toUpperCase(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Se DeepL risponde con errore (es. chiave invalida), lo giriamo al FE
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Errore durante la traduzione" });
  }
}
