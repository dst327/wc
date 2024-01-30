const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;


app.set("view engine", "ejs");
app.use(express.static("public"));

// Route to get top stories from the New York Times API
app.get("/api/popular-articles", async (req, res) => {
  try {
    // Replace 'YOUR_NYT_API_KEY' with your actual New York Times API key
    const apiKey = "PTptKAkW811u4DGCY9hS2gip2WgEFLsG";
    const response = await axios.get(
      `https://api.nytimes.com/svc/topstories/v2/us.json?api-key=${apiKey}`
    );

    const articles = response.data.results.map((article) => {
      return {
        title: article.title,
        url: article.url,
      };
    });

    res.json({ articles });
  } catch (error) {
    console.error("Error fetching top stories:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to render the main page
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
