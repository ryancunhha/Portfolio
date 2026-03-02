export default async function handler(request, response) {
    const { lat, lon } = request.query

    if (!lat || !lon) {
        return response.status(400).json({ error: "Latitude e Longitude não fornecidos" });
    }

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=weathercode&timezone=auto`;
        const resClima = await fetch(url)
        const data = await resClima.json()

        return response.status(200).json(data)
    } catch (error) {
        console.error(error)
        return response.status(500).json({ error: "Falha no servidor" })
    }
}