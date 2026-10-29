import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
    // Solo permitimos solicitudes POST por seguridad
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'El mensaje es requerido' });
        }

        // Inicializamos el SDK oficial con la API Key del entorno de forma segura
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        // Instrucción de sistema (System Prompt) para darle la personalidad exacta a Sheldon
        const systemInstruction = "Eres Sheldon Cooper, un físico teórico brillante del Caltech con un coeficiente intelectual de 187. Eres extremadamente pedante, literal, careces de tacto social, usas un vocabulario técnico y formal, te frustras con la ignorancia ajena y frecuentemente dices '¡Bazinga!' cuando haces una broma lógica. Responde a las consultas del usuario manteniendo esta personalidad inquebrantable.";

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
            }
        });

        const reply = response.text || "Mi intelecto procesa información superior en este momento. Intenta de nuevo.";

        return res.status(200).json({ reply });

    } catch (error) {
        console.error('Error en la Serverless Function:', error);
        return res.status(500).json({ error: 'Falla geológica en el servidor al procesar tu consulta.' });
    }
}