const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

// Function to process text and generate a word cloud
async function processText() {
  try {
    const apiKey = "PTptKAkW811u4DGCY9hS2gip2WgEFLsG";
    const response = await axios.get(
      `https://api.nytimes.com/svc/topstories/v2/us.json?api-key=${apiKey}`
    );

    const stopWords = new Set([
      "and",
      "is",
      "it",
      "are",
      "the",
      "of",
      "in",
      "to",
      "for",
      "on",
      "at",
      "a",
      ",",
    ]);

    // Map articles to words with URLs
    const words = response.data.results.flatMap((article) => {
      const titleWords = article.title
        .split(/\s+/)
        .filter((word) => !stopWords.has(word.toLowerCase()));

      return titleWords.map((word) => ({
        word,
        url: article.url,
      }));
    });

    // Count occurrences of each word along with URL
    const wordCount = {};
    words.forEach(({ word, url }) => {
      const lowercaseWord = word.toLowerCase();
      wordCount[lowercaseWord] = {
        count:
          (wordCount[lowercaseWord] && wordCount[lowercaseWord].count + 1) || 1,
        url,
      };
    });

    // Create an array of unique words with their counts and URLs
    const uniqueWords = Object.keys(wordCount).map((word) => ({
      word,
      count: wordCount[word].count,
      url: wordCount[word].url,
    }));

    // uniqueWords.sort((a, b) => b.count - a.count);

    return uniqueWords;
  } catch (error) {
    console.error("Error fetching top stories:", error.message);
    throw error;
  }
}

// Route to get processed words from the New York Times API and generate word cloud
app.get("/api/word-cloud", async (req, res) => {
  try {
    const processedWords = await processText();
    res.json({ words: processedWords });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to render the main page
app.get("/", async (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
