import { genkit, z } from 'genkit';
import { googleAI, gemini15Flash } from '@genkit-ai/googleai'
import * as cheerio from 'cheerio'

const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
})

const webLoader = ai.defineTool(
  {
    name: "webLoader",
    description:
      "When a URL is received, it accesses the URL and retrieves the content inside.",
    inputSchema: z.object({ url: z.string() }),
    outputSchema: z.string(),
  },
  async ({ url }) => {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    $("script, style, noscript").remove();
    if ($("article")) {
      return $("article").text();
    }
    return $("body").text();
  },
)

const mainFlow = ai.defineFlow({
  name: 'mainFlow',
  inputSchema: z.string(),
}, async (input) => {
  const { text } = await ai.generate({
    prompt: input,
    tools: [webLoader],
  })
  return text
})

ai.startFlowServer({ flows: [mainFlow] })