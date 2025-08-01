// server.js or app.js - Add these routes to your existing Express server

const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// GitHub API configuration
const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "YOUR_GITHUB_USERNAME"; // Replace with your username
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Optional: Add your GitHub token for higher rate limits

// Create axios instance with GitHub token if available
const githubApi = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: GITHUB_TOKEN
    ? {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      }
    : {
        Accept: "application/vnd.github.v3+json",
      },
});

// GitHub API Routes

// Get specific repositories
app.post("/api/github/repos", async (req, res) => {
  try {
    const { repos } = req.body;

    if (!repos || !Array.isArray(repos)) {
      return res
        .status(400)
        .json({ error: "Please provide an array of repository names" });
    }

    // Fetch each repository
    const repoPromises = repos.map(async (repoName) => {
      try {
        const response = await githubApi.get(
          `/repos/${GITHUB_USERNAME}/${repoName}`
        );
        return response.data;
      } catch (error) {
        console.error(`Error fetching repo ${repoName}:`, error.message);
        return null;
      }
    });

    const repoResults = await Promise.all(repoPromises);
    const validRepos = repoResults.filter((repo) => repo !== null);

    res.json(validRepos);
  } catch (error) {
    console.error("Error fetching repositories:", error.message);
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
});

// Get all public repositories for the user
app.get("/api/github/repos/all", async (req, res) => {
  try {
    const { page = 1, per_page = 30, sort = "updated" } = req.query;

    const response = await githubApi.get(`/users/${GITHUB_USERNAME}/repos`, {
      params: {
        page: parseInt(page),
        per_page: parseInt(per_page),
        sort,
        type: "public",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching all repositories:", error.message);
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
});

// Get repository languages
app.get("/api/github/repos/:repoName/languages", async (req, res) => {
  try {
    const { repoName } = req.params;

    const response = await githubApi.get(
      `/repos/${GITHUB_USERNAME}/${repoName}/languages`
    );
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching languages for ${repoName}:`, error.message);
    res.status(500).json({ error: "Failed to fetch repository languages" });
  }
});

// Get repository README
app.get("/api/github/repos/:repoName/readme", async (req, res) => {
  try {
    const { repoName } = req.params;

    const response = await githubApi.get(
      `/repos/${GITHUB_USERNAME}/${repoName}/readme`
    );

    // Decode base64 content
    const content = Buffer.from(response.data.content, "base64").toString(
      "utf-8"
    );

    res.json({
      content,
      encoding: response.data.encoding,
      size: response.data.size,
      name: response.data.name,
      path: response.data.path,
    });
  } catch (error) {
    console.error(`Error fetching README for ${repoName}:`, error.message);
    res.status(404).json({ error: "README not found" });
  }
});

// Get repository commits (recent activity)
app.get("/api/github/repos/:repoName/commits", async (req, res) => {
  try {
    const { repoName } = req.params;
    const { per_page = 10 } = req.query;

    const response = await githubApi.get(
      `/repos/${GITHUB_USERNAME}/${repoName}/commits`,
      {
        params: {
          per_page: parseInt(per_page),
        },
      }
    );

    // Return simplified commit data
    const commits = response.data.map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author,
      date: commit.commit.author.date,
      url: commit.html_url,
    }));

    res.json(commits);
  } catch (error) {
    console.error(`Error fetching commits for ${repoName}:`, error.message);
    res.status(500).json({ error: "Failed to fetch repository commits" });
  }
});

// Get GitHub user profile
app.get("/api/github/user", async (req, res) => {
  try {
    const response = await githubApi.get(`/users/${GITHUB_USERNAME}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Get repository contributors
app.get("/api/github/repos/:repoName/contributors", async (req, res) => {
  try {
    const { repoName } = req.params;

    const response = await githubApi.get(
      `/repos/${GITHUB_USERNAME}/${repoName}/contributors`
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      `Error fetching contributors for ${repoName}:`,
      error.message
    );
    res.status(500).json({ error: "Failed to fetch repository contributors" });
  }
});

// Get repository releases
app.get("/api/github/repos/:repoName/releases", async (req, res) => {
  try {
    const { repoName } = req.params;

    const response = await githubApi.get(
      `/repos/${GITHUB_USERNAME}/${repoName}/releases`
    );
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching releases for ${repoName}:`, error.message);
    res.status(500).json({ error: "Failed to fetch repository releases" });
  }
});

// Search repositories
app.get("/api/github/search", async (req, res) => {
  try {
    const { q, sort = "stars", order = "desc" } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchQuery = `${q} user:${GITHUB_USERNAME}`;

    const response = await githubApi.get("/search/repositories", {
      params: {
        q: searchQuery,
        sort,
        order,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error searching repositories:", error.message);
    res.status(500).json({ error: "Failed to search repositories" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    github_username: GITHUB_USERNAME,
    has_token: !!GITHUB_TOKEN,
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Portfolio API server running on port ${port}`);
  console.log(`📊 GitHub username: ${GITHUB_USERNAME}`);
  console.log(
    `🔑 GitHub token: ${
      GITHUB_TOKEN
        ? "Configured"
        : "Not configured (using rate-limited requests)"
    }`
  );
});
