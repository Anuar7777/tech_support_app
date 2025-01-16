const fetch = require("node-fetch");

async function getVector(text) {
  try {
    const response = await fetch("http://localhost:8000/vectorize/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.vector;
  } catch (error) {
    console.error("Ошибка при запросе: ", error.message);
    throw error;
  }
}

module.exports = getVector;
