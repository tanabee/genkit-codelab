import { genkit, z } from 'genkit'
import { googleAI, gemini15Flash } from '@genkit-ai/googleai'
import { logger } from 'genkit/logging'
logger.setLogLevel('debug')

const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash.withConfig({ codeExecution: true }),
})

const mainFlow = ai.defineFlow({
  name: 'mainFlow',
  inputSchema: z.string(),
}, async (input) => {
  const { text } = await ai.generate(input)
  return text
})

ai.startFlowServer({ flows: [mainFlow] })