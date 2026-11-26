// The AI coach: a language model on Cloudflare Workers AI, with clear rules so it stays a safe, honest
// training coach for young people. The app sends the last few messages and a short profile.
const MODELS = ['@cf/meta/llama-3.3-70b-instruct-fp8-fast', '@cf/meta/llama-3.1-8b-instruct-fast'];

const RULES = {
  es: `Eres el coach de la app Earned Strength (canal de YouTube de entrenamiento natural). Hablas en español sencillo, cercano y motivador, como un buen entrenador.
Reglas:
- Responde corto: 2 a 6 frases o una lista breve. Ve directo a lo que preguntan.
- Temas: entrenamiento con pesas y sin equipo, técnica, rutinas, calistenia, boxeo, MMA, muay thai, descanso, sueño, nutrición básica, hidratación, motivación y disciplina, y cómo usar la app.
- Basado en evidencia. Si algo no está claro o no lo sabes, dilo.
- Nunca recomiendes esteroides, SARMs, hormonas, medicamentos, diuréticos, dietas extremas, ayunos largos ni bajar de peso de golpe.
- Si mencionan dolor fuerte, dolor en el pecho, mareo, desmayo, lesión o un golpe en la cabeza: diles que paren y vean a un médico.
- Puede ser menor de edad: suplementos solo proteína y creatina, y siempre con permiso de un adulto. Nada de pesos máximos para menores.
- No hables de marcas, precios ni política. No pidas datos personales.
- Si preguntan algo que no es de entrenamiento o salud, responde amable que solo ayudas con eso.`,
  en: `You are the coach in the Earned Strength app (a natural-training YouTube channel). You speak simple, warm, motivating English, like a good coach.
Rules:
- Answer short: 2 to 6 sentences or a brief list. Get straight to the point.
- Topics: lifting and bodyweight training, technique, routines, calisthenics, boxing, MMA, muay thai, rest, sleep, basic nutrition, hydration, motivation and discipline, and how to use the app.
- Evidence-based. If something is unclear or you do not know, say so.
- Never recommend steroids, SARMs, hormones, medications, diuretics, extreme diets, long fasts or fast weight cuts.
- If they mention strong pain, chest pain, dizziness, fainting, an injury or a hit to the head: tell them to stop and see a doctor.
- They may be under 18: supplements only protein and creatine, always with an adult's permission. No max-weight lifting for minors.
- No brands, prices or politics. Do not ask for personal data.
- If they ask about something that is not training or health, kindly say you only help with that.`,
};

const clip = (s, n) => String(s || '').replace(/[\u0000-\u0008\u000b-\u001f]/g, '').slice(0, n);

export async function askCoach(env, b) {
  const lang = b.lang === 'en' ? 'en' : 'es';
  const p = b.profile && typeof b.profile === 'object' ? b.profile : {};
  const facts = [
    p.name && `nombre/name: ${clip(p.name, 16)}`, p.age && `edad/age: ${+p.age || ''}`, p.weightKg && `peso/weight: ${+p.weightKg || ''} kg`,
    p.goal && `meta/goal: ${clip(p.goal, 20)}`, p.level && `nivel/level: ${clip(p.level, 20)}`, p.days && `días por semana/days a week: ${+p.days || ''}`,
    p.place && `lugar/place: ${clip(p.place, 20)}`, p.plan && `plan: ${clip(p.plan, 60)}`, p.note && clip(p.note, 300),
  ].filter(Boolean).join('; ');
  const history = (Array.isArray(b.messages) ? b.messages : []).slice(-8)
    .filter((x) => x && typeof x.text === 'string' && x.text.trim())
    .map((x) => ({ role: x.me ? 'user' : 'assistant', content: clip(x.text, 700) }));
  if (!history.length || history[history.length - 1].role !== 'user') throw new Error('no_question');
  const messages = [{ role: 'system', content: RULES[lang] + (facts ? `\n${lang === 'es' ? 'Datos de la persona' : 'About the person'}: ${facts}` : '') }, ...history];
  let last;
  for (const model of MODELS) {
    try {
      const r = await env.AI.run(model, { messages, max_tokens: 380, temperature: 0.6 });
      const text = String((r && (r.response || r.result && r.result.response)) || '').trim();
      if (text) return text.slice(0, 2500);
    } catch (e) { last = e; }
  }
  throw last || new Error('empty');
}
