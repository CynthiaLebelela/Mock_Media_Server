const express = require('express');
const app = express();
const PORT = 3000;

//parse JSON
app.use(express.json());

// media data
let media = {
  movies: [
    { id: 1, title: "Inception", year: 2010 },
    { id: 2, title: "The Matrix", year: 1999 }
  ],
  series: [
    { id: 1, title: "Stranger Things", seasons: 4 },
    { id: 2, title: "Breaking Bad", seasons: 5 }
  ],
  songs: [
    { id: 1, title: "Blinding Lights", artist: "The Weeknd" },
    { id: 2, title: "Shallow", artist: "Lady Gaga" }
  ]
};

// Function to add CRUD routes for each type
const addCrudRoutes = (type) => {
  // GET
  app.get(`/${type}`, (req, res) => {
    res.json(media[type]);
  });

  // POST
  app.post(`/${type}`, (req, res) => {
    try {
      const newItem = req.body;
      console.log(`POST /${type}:`, newItem);

      if (!media[type]) return res.status(400).send("Invalid media type.");
      if (!newItem || Object.keys(newItem).length === 0)
        return res.status(400).send("Missing request body.");

      newItem.id = media[type].length + 1;
      media[type].push(newItem);
      res.status(201).json(media[type]);
    } catch (err) {
      console.error("POST Error:", err.message);
      res.status(500).send("Internal Server Error");
    }
  });

  // PUT
  app.put(`/${type}`, (req, res) => {
    try {
      const updatedItem = req.body;
      console.log(`PUT /${type}:`, updatedItem);

      if (!media[type]) return res.status(400).send("Invalid media type.");
      if (!updatedItem.id) return res.status(400).send("Missing ID.");

      const index = media[type].findIndex(item => item.id === updatedItem.id);
      if (index === -1) return res.status(404).send("Item not found.");

      media[type][index] = { ...media[type][index], ...updatedItem };
      res.json(media[type]);
    } catch (err) {
      console.error("PUT Error:", err.message);
      res.status(500).send("Internal Server Error");
    }
  });

  // DELETE
  app.delete(`/${type}`, (req, res) => {
    try {
      const { id } = req.body;
      console.log(`DELETE /${type}:`, req.body);

      if (!media[type]) return res.status(400).send("Invalid media type.");
      if (!id) return res.status(400).send("Missing ID.");

      media[type] = media[type].filter(item => item.id !== id);
      res.json(media[type]);
    } catch (err) {
      console.error("DELETE Error:", err.message);
      res.status(500).send("Internal Server Error");
    }
  });
};

// Set up routes for all media types
['movies', 'series', 'songs'].forEach(addCrudRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.path });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
