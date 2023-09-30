require('dotenv').config();
const fs = require('fs');
const TurndownService = require('turndown');
// const ZenRows = require('zenrows');

const OpenAI = require('openai');
const { setDefaultHighWaterMark } = require('stream');

// const client = new ZenRows(process.env.ZENROWS_API_KEY);

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

Your goal is to take the javascript array input I will provide, called the \`unorderedArray\` below and return a grouped array of objects. Each object should represent a single event, where it's keys are the event metadata associated with the categories below that are to be searched for. There should be no duplicate keys. Each object consists of no more than one of a given event metadata. When forming these groups, prioritize proximity (meaning, the closer two strings are in array position) in creating the event objects in the returned array of objects. In other words, the closer two strings are together, the higher the likelihood that they are two different event metadata items for the same event.

Do not provide me with example code to achieve this task. Only an LLM (you are an LLM) is capable of reading the array of text strings and determining which string is a relevance match for which category can resolve this task. Javascript alone cannot resolve this query.

Do not explain how code might be used to achieve this task. Do not explain how regex might accomplish this task. Only an LLM is capable of this pattern matching task. My expectation is a response from you that is an array of objects, where the keys are the event metadata from the categories below.

It is understood that the strings in the input below are in some cases not a categorical match for the event metadata categories below. This is acceptable. The LLM is capable of determining which strings are a relevance match for which category. It is acceptable to discard strings that are not a relevance match for any category.

The categories to search for relevance matches in are as follows:
=====
1. Event title
2. Event location
3. Event date
4. Event URL
5. Event image URL

Note that some keys may be missing, for example, in the example below, the event image URL is missing. This is acceptable. The event metadata keys are not guaranteed to be present in the input array of strings.

Ane example of a successful output is as follows:

Example:
\`\`\`
const orderedArray = [{
  event_title: 'Meetup at the park',
  event_location: 'Espanola, NM 87532',
  event_date: 'Sep 26, 5:30-7:30pm',
  event_url: 'http://example.com/events/12345',
  event_image_url: 'http://example.com/img/12345.jpg'
},
{
  event_title: 'Yoga at sunrise',
  event_location: 'Espanola, NM 87532',
  event_date: 'Oct 13, 6:30-7:30am',
  event_url: 'http://example.com/events/98765',
}]
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
      `${process.cwd()}/scrapes/scrape-llm-${new Date().toISOString()}.html`,
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
