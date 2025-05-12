// Add a new player
document.getElementById('addPlayerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const team = document.getElementById('team').value;
    const year = parseInt(document.getElementById('year').value);
    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
  
    try {
      const response = await axios.post('http://localhost:4000/api/players', {
        team, year, players: [{ name, role }]
      });
      alert('Player added successfully!');
    } catch (error) {
      alert('Error adding player');
    }
  });
  
  document.getElementById("updatePlayerForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get form data
    const team = document.getElementById("team").value;
    const year = document.getElementById("year").value;
    const name = document.getElementById("name").value;
    const role = document.getElementById("role").value;

    // Prepare data for sending
    const data = {
        team: team,
        year: year,
        name: name,
        role: role
    };

    try {
        // Send a POST request to the server
        const response = await fetch("http://localhost:3000/updatePlayer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        // Get the JSON response
        const result = await response.json();
        document.getElementById("responseMessage").innerText = result.message;
    } catch (error) {
        document.getElementById("responseMessage").innerText = "Error updating player records.";
        console.error("Error:", error);
    }
});

  // Delete a player
  document.getElementById('deletePlayerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const playerId = document.getElementById('playerId').value;
    try {
      const response = await axios.delete(`http://localhost:4000/api/players/${playerId}`);
      alert('Player deleted successfully');
    } catch (error) {
      alert('Error deleting player');
    }
  });
  
  // Search best players by role
  document.getElementById('searchPlayerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const role = document.getElementById('searchRole').value;
    try {
      const response = await axios.get(`http://localhost:4000/api/players/search?role=${role}`);
      const player = response.data[0]?.players[0];
      document.getElementById('playerResults').innerHTML = player ? `
        <h4>Best ${role}: ${player.name}</h4>
        <p>Best Performance: ${player.best_performance}</p>
      ` : 'No players found';
    } catch (error) {
      alert('Error fetching players');
    }
  });
  