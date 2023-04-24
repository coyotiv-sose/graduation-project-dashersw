const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

module.exports = async function ({ name, location, date }) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Create a description for a picnic event.
Title: ${name}
Location: ${location}
Date: ${date}
Description:`,
    temperature: 0.2,
    max_tokens: 1000,
  })

  return response.data?.choices?.[0]?.text || ''
}
