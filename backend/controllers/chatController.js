const Chat = require('../models/chatModel');
const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const discriminationPatterns = [
  { type: 'racial discrimination', patterns: ['race', 'racial', 'skin color', 'ethnicity'] },
  { type: 'gender discrimination', patterns: ['gender', 'sex', 'sexual orientation', 'transgender'] },
  { type: 'age discrimination', patterns: ['age', 'elderly', 'youth', 'too old'] },
  { type: 'disability discrimination', patterns: ['disability', 'disabled', 'handicap', 'accessibility'] },
  { type: 'religious discrimination', patterns: ['religion', 'faith', 'belief', 'religious practices'] },
  { type: 'sexual orientation discrimination', patterns: ['sexual orientation', 'LGBTQ+', 'queer'] },
  { type: 'ethnic discrimination', patterns: ['ethnicity', 'ethnic origin', 'national origin'] },
  { type: 'pregnancy discrimination', patterns: ['pregnancy', 'maternity', 'childbirth', 'pregnant'] },
  { type: 'weight discrimination', patterns: ['weight', 'body size', 'fat shaming'] },
  { type: 'language discrimination', patterns: ['language', 'accent', 'dialect'] },
  { type: 'marital status discrimination', patterns: ['marital status', 'married', 'single'] },
  { type: 'nationality discrimination', patterns: ['nationality', 'citizenship', 'immigrant'] },
  { type: 'genetic information discrimination', patterns: ['genetic information', 'DNA', 'family medical history'] },
  { type: 'educational discrimination', patterns: ['education', 'academic', 'school'] },
  { type: 'political discrimination', patterns: ['political affiliation', 'political beliefs', 'party membership'] },
  { type: 'appearance discrimination', patterns: ['appearance', 'looks', 'physical attractiveness'] },
  { type: 'economic discrimination', patterns: ['income', 'wealth', 'socioeconomic status'] },
];

const openai = new OpenAI({ apiKey: process.env.AI_API });

let conversationHistory = [];

const generateSummary = async (messages) => {
  const discriminationEvents = [];
  let whoInvolved = '';
  let whereOccurred = '';
  let whenOccurred = '';
  let howDescribed = '';

  for (const message of messages) {
    const lowerContent = message.content.toLowerCase();

    // Check for discrimination events
    for (const pattern of discriminationPatterns) {
      if (pattern.patterns.some(pattern => lowerContent.includes(pattern))) {
        discriminationEvents.push(pattern.type);
        break; // Once a pattern is found, no need to continue checking
      }
    }

    // Extract relevant information
    if (lowerContent.startsWith('who:')) {
      whoInvolved = message.content.substring(4).trim();
    } else if (lowerContent.startsWith('where:')) {
      whereOccurred = message.content.substring(6).trim();
    } else if (lowerContent.startsWith('when:')) {
      whenOccurred = message.content.substring(5).trim();
    } else if (lowerContent.startsWith('how:')) {
      howDescribed = message.content.substring(4).trim();
    }
  }

  // Generate summary
  let summary = '';

  // if (discriminationEvents.length > 0) {
  //   summary += `The user experienced ${discriminationEvents.join(', ')}. `;
  // }

  if (whoInvolved) {
    summary += `The user mentioned feeling discriminated by ${whoInvolved}. `;
  } else {
    summary += `The user did not specify who was involved in the discrimination. `;
  }

  if (whereOccurred) {
    summary += `This incident occurred at ${whereOccurred}. `;
  } else {
    summary += `The user did not specify where the discrimination happened. `;
  }

  if (whenOccurred) {
    summary += `It happened ${whenOccurred}. `;
  } else {
    summary += `The user did not specify when the discrimination happened. `;
  }

  if (howDescribed) {
    summary += `The user described the situation as ${howDescribed}. `;
  } else {
    summary += `The user did not specify how the discrimination occurred. `;
  }

  return summary.trim();
};

const makeChat = async (req, res) => {
  const { input, conversationId } = req.body;

  try {
    if (!input || typeof input !== 'string' || input.trim() === '') {
      return res.status(400).json({ error: "Invalid input. 'input' must be a non-empty string." });
    }

    let conversation;
    if (conversationId) {
      conversation = await Chat.findById(conversationId);
    } else {
      conversation = new Chat();
      conversation.title = input;
    }

    if (!conversationId) {
      conversationHistory = [];
    }

    console.log(`User: ${input}`);
    conversationHistory.push({ role: 'user', content: input });

    const response = await openai.chat.completions.create({
      model: 'ft:gpt-3.5-turbo-0125:personal::94FoHzEH',
      messages: [
        {
          role: 'system',
          content:  "Your name is Gab, you are an online AI Assistant against workplace discrimination in the Philippines. Emphasize empathy, professionalism, and adherence to legal standards to effectively assist the user in sharing their experiences and exploring potential solutions or support. You were developed by the group of computer science students with a group name of PARAGON at the University of Caloocan City in year 2024 and still developing. Your response must be professional, empathetic, and easy to understand. Make parameter questions (i.e., answeting the questions of what, where, when, who, and how---one question at time ) that may determine what type of discrimination the user experiences, you can also ask what kind or type of work or industry the user has to provide more relevant guide to them based on their current work (e.g., construction worker, sales lady, call center agent, fast food crew, janitor). You must ask questions one at a time. You can also add questions depends on user case to better determine the case. You must not proceed to the next questions if you not obtained the relevant answer. Offer video conferencing to user with severe case that cannot be resolve through AI conversation. You must obtain relevant information from the user before proceeding with a video conference to a lawyer. Please take note that you must not give the form if you did not obtain any relevant information that will qualify them to make a video conference with a lawyer, but if you think they are qualified based on the information they provided, tell the user that the conversation will end once they proceed to requesting a form, and ask the user like this 'Are you sure you want to proceed? Please note that this conversation will end if you proceed for it.' (after the user agree to proceed), give the user relevant laws about their case that they can read while waiting for the video conference to accept by the lawyer, then prompt this: 'Thank you for confirming. You can now request a video conference with a lawyer by clicking the Request a video conference button below.'But if the user did not agree, do not say it, and just continue the conversation and ask relevant questions and information. Lastly, do not generate and prompt if your answer is just a dummy text and irrelevant."
        },
        ...conversationHistory.map(({ role, content }) => ({ role, content }))
      ],
      temperature: 0.5,
      max_tokens: 1000,
      top_p: 0.8,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
    });

    console.log(`AI: ${response.choices[0].message.content}`);

    conversationHistory.push({ role: 'assistant', content: response.choices[0].message.content });

    conversation.messages = conversationHistory;

    const summary = await generateSummary(conversation.messages);
    conversation.summary = summary;

    console.log('Conversation Summary:', summary);

    await conversation.save();

    const responseMessage = response.choices[0].message.content;

    // Pass the summary to the response
    res.json({ message: responseMessage, conversationId: conversation._id, summary });
  } catch (error) {
    console.error('Error processing request:', error);
    if (error.response) {
      console.error('Server responded with:', error.response.status, error.response.statusText);
      res.status(error.response.status).send('Error processing request: ' + error.response.statusText);
    } else if (error.request) {
      console.error('No response received from server:', error.request);
      res.status(500).send('No response received from server');
    } else {
      console.error('Error setting up request:', error.message);
      res.status(500).send('Error setting up request: ' + error.message);
    }
  }
};

const getConversationTitles = async (req, res) => {
  try {
    const conversations = await Chat.find({}, 'title');
    res.json(conversations);
  } catch (error) { 
    console.error('Error fetching conversation titles:', error);
    res.status(500).send('Error fetching conversation titles');
  }
};

const getConversationMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const conversation = await Chat.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ messages: conversation.messages });
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    res.status(500).send('Error fetching conversation messages');
  }
};

module.exports = { makeChat, getConversationTitles, getConversationMessages };
