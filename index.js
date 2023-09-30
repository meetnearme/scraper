require('dotenv').config();
const fs = require('fs');
const TurndownService = require('turndown');

const OpenAI = require('openai');
const { setDefaultHighWaterMark } = require('stream');

const client = new ZenRows(process.env.ZENROWS_API_KEY);

(async () => {
  // Create an instance of OpenAI using your key
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // zernrows parse fetch

  // const url =
  //   'https://www.rei.com/events/search?previousLocation=87501&cm_mmc=email_com_rm-_-StoreEvents_GeneralAwareness-_-092223-_-opo_mod4_cta&ev36=34175338&rmid=20230922_FEE_FeaturedEventsSeptember2&rrid=424901195&ev11=&mi_u=424901195&course.session.anyLocation=200.000000~35.713544~-105.840772;geo_r';

  // try {
  //   const { data } = await client.get(url, {
  //     js_render: 'true',
  //     wait: '2500',
  //     // we might want html mode instead, for markdown parsing
  //     // autoparse: 'true',
  //   });
  // } catch (error) {
  //   console.error(error.message);
  //   if (error.response) {
  //     console.error(error.response.data);
  //   }
  // }

  // read from the filesystem temporarily to avoid using zenrows credits
  const data = fs.readFileSync(
    `${process.cwd()}/scrapes/scrape-2023-09-26T01:02:44.513Z.html`
  );
  const turndownService = new TurndownService();
  turndownService.keep(['body']);
  turndownService.remove(['script', 'style']);
  try {
    const markdown = turndownService.turndown(data.toString());
    const arrOfLines = markdown
      .replace(/\n\s*\n/g, '\n')
      ?.split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const config = {
      messages: [
        {
          role: 'user',
          content: `You are a helpful LLM capable of accepting an array of strings and reordering them according to patterns only an LLM is capable of recognizing.

Your goal is to take the javascript array input I will provide below and return a re-ordered array from most relevant to least relevant in priority order. The matching priority is the degree to which the array item is a match for any of the event categories in the example below.

Do not provide me with example code to achieve this task. Only an LLM like OpenAI is capable of reading the array of text strings and determining which string is a relevance match for which category can resolve this task. Javascript alone cannot resolve this query.

Do not explain how code might be used to achieve this task. Only an LLM is capable of the pattern matching task. My expectation is an response from you that is an array of strings in the order of most relevant to least relevant.

The categories to search for relevance matches in are as follows:
=====
1. Event title
2. Event location
3. Event date
4. Event URL
5. Event image URL

When you have prioritized the array, prefix each with the relevant category and return the array to me in the following format.

Example:
\`\`\`
const orderedArray = [
'Event title: Meetup at the park',
'Event location: Espanola, NM 87532',
'Event date: Sep 26, 5:30-7:30pm',
'Event URL: http://example.com/events/12345',
'Event image URL: http://example.com/img/12345.jpg',
\`\`\`


The input is:
=====
const unorderedArray = ${JSON.stringify(arrOfLines)}
`,
        },
      ],
      model: 'gpt-3.5-turbo-16k',
    };

    const chatCompletion = await openai.chat.completions.create(config);
    fs.writeFileSync(
      `${process.cwd()}/scrapes/array-of-lines-${new Date().toISOString()}.html`,
      JSON.stringify(arrOfLines) +
        '\n\n\n========== openAI config ============\n\n\n\n' +
        JSON.stringify(config) +
        '\n\n\n========== response ============\n\n\n\n' +
        JSON.stringify(chatCompletion),
      'utf8'
    );
  } catch (error) {
    console.error(error.message);
    if (error.response) {
      console.error(error.response.data);
    }
  }
})();
