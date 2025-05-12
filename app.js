const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/IPL';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Player Schema
const playerSchema = new mongoose.Schema({
  team: String,
  year: Number,
  players: [
    {
      name: String,
      role: String,
      image: String,
      matches: Number,
      runs: Number,
      best_performance: String,
    },
  ],
});

const Player = mongoose.model('Player', playerSchema);

// Add Player Endpoint
app.post('/api/players', async (req, res) => {
  try {
    const { team, year, players } = req.body;
    const newPlayer = new Player({ team, year, players });
    await newPlayer.save();
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(500).send('Error inserting player');
  }
});

// Delete Player Endpoint
app.delete('/api/players/:id', async (req, res) => {
  try {
    const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
    if (!deletedPlayer) return res.status(404).send('Player not found');
    res.json({ message: 'Player deleted successfully' });
  } catch (err) {
    res.status(500).send('Error deleting player');
  }
});

// Search Best Player by Role (Bowler, Batsman, All-rounder)
app.get('/api/players/search', async (req, res) => {
  const { role } = req.query;
  try {
    const bestPlayer = await Player.find({ 'players.role': role })
      .sort({ 'players.best_performance': -1 })
      .limit(1);
    res.json(bestPlayer);
  } catch (err) {
    res.status(500).send('Error searching for best player');
  }
});
// Route to update a player's record
app.post("/updatePlayer", async (req, res) => {
  const { playerId, score, team } = req.body;
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Define the filter and update for the player
    const filter = { playerId: parseInt(playerId) }; // Assumes playerId is a unique identifier and a number
    const updateFields = {};
    if (score) updateFields.score = parseInt(score);
    if (team) updateFields.team = team;
    const update = { $set: updateFields };

    // Perform the update operation
    const result = await collection.updateOne(filter, update);

    if (result.matchedCount > 0) {
      res.json({ message: `Player record with ID ${playerId} updated successfully.` });
    } else {
      res.json({ message: `No player found with ID ${playerId}.` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating player record", error });
  } finally {
    await client.close();
  }
});


// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

