const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Enhanced project mapping with your specific projects
const projectEnhancements = {
  AccidentIQ: {
    featured: true,
    category: "bigdata",
    tags: ["bigdata", "spark", "ai", "geospatial", "python", "streamlit"],
    technologies: [
      "Python",
      "Apache Spark",
      "PostGIS",
      "Streamlit",
      "FastAPI",
      "XGBoost",
      "LightGBM",
    ],
    highlights: [
      "Process millions of accident records with Apache Spark + Sedona",
      "H3 Spatial Indexing for efficient geographic analysis",
      "89% accuracy XGBoost classifier for accident severity prediction",
      "Real-time heatmaps and temporal analysis dashboard",
    ],
    architecture: "spark-postgis-streamlit",
    demoDescription: "Comprehensive geospatial big data analytics platform",
  },
  "Smart-Agriculture-IoT": {
    featured: true,
    category: "iot",
    tags: ["iot", "computer-vision", "edge-computing", "python", "tensorflow"],
    technologies: [
      "ESP8266",
      "OpenCV",
      "TensorFlow Lite",
      "LoRaWAN",
      "ZigBee",
      "Python",
      "MQTT",
    ],
    highlights: [
      "Computer vision pest detection with 85% accuracy",
      "Multi-sensor network with I2C and SPI protocols",
      "LoRaWAN for long-range data transmission",
      "70% reduction in cloud dependency with edge computing",
    ],
    architecture: "iot-edge-computing",
  },
  DeFS: {
    featured: true,
    category: "blockchain",
    tags: ["blockchain", "web3", "ipfs", "ethereum", "javascript"],
    technologies: [
      "IPFS",
      "Ethereum",
      "Solidity",
      "Web3.js",
      "Node.js",
      "React.js",
    ],
    highlights: [
      "IPFS-based decentralized file storage",
      "Smart contracts for file ownership and access control",
      "AES-256 encryption for file protection",
      "React.js frontend with drag-and-drop functionality",
    ],
    architecture: "blockchain-ipfs",
  },
  "Collaborative-Code-Editor": {
    featured: true,
    category: "realtime",
    tags: ["realtime", "websockets", "collaboration", "javascript", "mongodb"],
    technologies: [
      "Node.js",
      "WebSockets",
      "MongoDB",
      "Socket.io",
      "Vite",
      "JWT",
    ],
    highlights: [
      "50+ concurrent users with live synchronization",
      "Operational transformation for conflict resolution",
      "90% data consistency achievement",
      "JWT-based authentication and session management",
    ],
    architecture: "websocket-collaboration",
  },
  "Rust-KV-Database": {
    featured: true,
    category: "systems",
    tags: ["rust", "database", "performance", "systems-programming"],
    technologies: [
      "Rust",
      "B-Trees",
      "Memory Mapping",
      "Concurrent Programming",
    ],
    highlights: [
      "100,000+ operations per second",
      "Thread-safe architecture with lock-free data structures",
      "Sub-millisecond response times",
      "Efficient serialization and compression",
    ],
    architecture: "rust-database",
  },
};

const getRepositories = async (req, res) => {
  try {
    const { data: repos } = await octokit.rest.repos.listForUser({
      username: process.env.GITHUB_USERNAME,
      sort: "updated",
      per_page: 100,
      type: "owner",
    });

    // Enhanced repository processing
    const processedRepos = await Promise.all(
      repos
        .filter((repo) => !repo.fork && !repo.archived)
        .map(async (repo) => {
          // Get languages for each repo
          let languages = {};
          try {
            const { data: languageData } =
              await octokit.rest.repos.listLanguages({
                owner: process.env.GITHUB_USERNAME,
                repo: repo.name,
              });
            languages = languageData;
          } catch (error) {
            console.log(`Could not fetch languages for ${repo.name}`);
          }

          // Get enhancement data
          const enhancement = projectEnhancements[repo.name] || {};

          return {
            id: repo.id,
            name: repo.name,
            description:
              repo.description ||
              enhancement.demoDescription ||
              "No description available",
            html_url: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            languages,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            topics: repo.topics || [],
            updated_at: repo.updated_at,
            created_at: repo.created_at,
            size: repo.size,
            default_branch: repo.default_branch,
            // Enhanced fields
            featured: enhancement.featured || false,
            category: enhancement.category || "other",
            tags: enhancement.tags || repo.topics || [],
            technologies:
              enhancement.technologies || [repo.language].filter(Boolean),
            highlights: enhancement.highlights || [],
            architecture: enhancement.architecture || null,
            last_updated: new Date(repo.updated_at).toLocaleDateString(),
          };
        })
    );

    // Sort: featured first, then by stars, then by update date
    const sortedRepos = processedRepos.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.stargazers_count !== b.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

    res.json({
      success: true,
      data: sortedRepos,
      total: sortedRepos.length,
      featured: sortedRepos.filter((repo) => repo.featured).length,
    });
  } catch (error) {
    console.error("GitHub API Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch repositories",
      details:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};
module.exports = {
  getRepositories,
};
