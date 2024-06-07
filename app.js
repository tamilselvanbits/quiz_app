const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors({
    origin: 'http://localhost:3000'
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('submit_answer', async (data) => {
    try {
      // Send the answer to the Django API
      const response = await axios.post('http://127.0.0.1:8003/user-scores/submit_answer/', data);
      const { is_correct } = response.data;

      // Fetch the updated scores from the Django API if the answer is correct
      if (is_correct) {
        const scoresResponse = await axios.get(`http://127.0.0.1:8003/user-scores/get_scores/?quiz_id=${data.quiz_id}`);
        io.emit('score_update', scoresResponse.data);
      } else {
        io.emit('score_update', response.data);
      }
    } catch (error) {
      console.error('Error handling submit_answer:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
