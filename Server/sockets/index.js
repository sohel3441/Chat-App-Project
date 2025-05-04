import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import { getRandomQuote } from '../utils/quotes.js';

const socketSetup = (io) => {
  io.on('connection', (socket) => {
    console.log(`⚡ New client connected: ${socket.id}`);

    // Join specific chat room
    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat room: ${chatId}`);
    });

    // Real-time message sending
    socket.on('sendMessage', async ({ chatId, text }) => {
      const userMsg = await Message.create({
        chat: chatId,
        text,
        sender: 'user',
      });

      await Chat.findByIdAndUpdate(chatId, { $push: { messages: userMsg._id } });

      io.to(chatId).emit('message', userMsg);

      // Bot auto-response after 3 sec using local quote
      setTimeout(async () => {
        const quote = getRandomQuote();

        const botMsg = await Message.create({
          chat: chatId,
          text: quote,
          sender: 'bot',
        });

        await Chat.findByIdAndUpdate(chatId, { $push: { messages: botMsg._id } });

        io.to(chatId).emit('message', botMsg);
      }, 3000);
    });

    // Auto bot to random chat every 10s
    socket.on('startRandomBot', () => {
      const intervalId = setInterval(async () => {
        const chats = await Chat.find();
        if (!chats.length) return;

        const randomChat = chats[Math.floor(Math.random() * chats.length)];
        const quote = getRandomQuote();

        const autoMsg = await Message.create({
          chat: randomChat._id,
          text: quote,
          sender: 'bot',
        });

        await Chat.findByIdAndUpdate(randomChat._id, {
          $push: { messages: autoMsg._id },
        });

        io.to(randomChat._id.toString()).emit('message', autoMsg);
      }, 10000); // every 10 seconds

      socket.on('stopRandomBot', () => clearInterval(intervalId));
    });

    socket.on('disconnect', () => {
      console.log(`🛑 Client disconnected: ${socket.id}`);
    });
  });
};

export default socketSetup;























// import Chat from '../models/Chat.js';
// import Message from '../models/Message.js';
// import axios from 'axios';

// const socketSetup = (io) => {
//   io.on('connection', (socket) => {
//     console.log(`⚡ New client connected: ${socket.id}`);

//     // Join specific chat room
//     socket.on('joinChat', (chatId) => {
//       socket.join(chatId);
//       console.log(`User joined chat room: ${chatId}`);
//     });

//     // Real-time message sending
//     socket.on('sendMessage', async ({ chatId, text }) => {
//       const userMsg = await Message.create({
//         chat: chatId,
//         text,
//         sender: 'user',
//       });

//       await Chat.findByIdAndUpdate(chatId, { $push: { messages: userMsg._id } });

//       // Emit user message to that room
//       io.to(chatId).emit('message', userMsg);

//       // Auto response in 3 sec
//       setTimeout(async () => {
//         const { data } = await axios.get('https://api.quotable.io/random');
//         const botMsg = await Message.create({
//           chat: chatId,
//           text: data.content,
//           sender: 'bot',
//         });

//         await Chat.findByIdAndUpdate(chatId, { $push: { messages: botMsg._id } });

//         io.to(chatId).emit('message', botMsg);
//       }, 3000);
//     });

//     // Toggle on: auto-send message to random chat every 10s
//     socket.on('startRandomBot', () => {
//       const intervalId = setInterval(async () => {
//         const chats = await Chat.find();
//         if (!chats.length) return;

//         const randomChat = chats[Math.floor(Math.random() * chats.length)];
//         const { data } = await axios.get('https://api.quotable.io/random');

//         const autoMsg = await Message.create({
//           chat: randomChat._id,
//           text: data.content,
//           sender: 'bot',
//         });

//         await Chat.findByIdAndUpdate(randomChat._id, {
//           $push: { messages: autoMsg._id },
//         });

//         io.to(randomChat._id.toString()).emit('message', autoMsg);
//       }, 10000); // every 10 seconds

//       // Stop interval if needed
//       socket.on('stopRandomBot', () => clearInterval(intervalId));
//     });

//     socket.on('disconnect', () => {
//       console.log(`🛑 Client disconnected: ${socket.id}`);
//     });
//   });
// };

// export default socketSetup;