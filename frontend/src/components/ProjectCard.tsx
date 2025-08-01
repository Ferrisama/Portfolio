import { useState, useEffect, type JSX } from "react";
import {
  Github,
  ExternalLink,
  Code,
  Database,
  Globe,
  Cpu,
  Star,
  Calendar,
  Search,
  Filter,
  Download,
  Moon,
  Sun,
  GitFork,
  Eye,
  FileText,
} from "lucide-react";

type GitHubRepo = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage?: string;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  language: string;
  languages_url: string;
};

type Project = {
  id: number;
  name: string;
  description: string;
  tags: string[];
  technologies: string[];
  stars: number;
  forks: number;
  lastUpdated: string;
  demoUrl?: string;
  githubUrl: string;
  features: string[];
  architecture: string;
  language: string;
  isSpotlight?: boolean;
};

const ProjectCard = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Your selected repositories - customize this list
  const selectedRepos = [
    "Indian-Road-Accident-Geospatial-Analytics-Platform",
    "Smart-Agriculture-IoT",
    "DeFS",
    "Collaborative-Code-Editor",
    "Rust-KV-Database",
  ];

  // Custom project data for spotlight features
  const customProjectData: Record<string, Partial<Project>> = {
    "Indian-Road-Accident-Geospatial-Analytics-Platform": {
      features: [
        "Process millions of accident records with Apache Spark + Sedona",
        "H3 Spatial Indexing for efficient geographic analysis",
        "89% accuracy XGBoost classifier for accident severity prediction",
        "Real-time heatmaps and temporal analysis dashboard",
      ],
      architecture: "spark-postgis-streamlit",
      technologies: [
        "Python",
        "Apache Spark",
        "PostGIS",
        "Streamlit",
        "FastAPI",
        "XGBoost",
      ],
      isSpotlight: true,
    },
    "Smart-Agriculture-IoT": {
      features: [
        "Computer vision pest detection with 85% accuracy",
        "Multi-sensor network with I2C and SPI protocols",
        "LoRaWAN for long-range data transmission",
        "70% reduction in cloud dependency with edge computing",
      ],
      architecture: "iot-edge-computing",
      technologies: [
        "ESP8266",
        "OpenCV",
        "TensorFlow Lite",
        "LoRaWAN",
        "Python",
      ],
      isSpotlight: true,
    },
    DeFS: {
      features: [
        "IPFS-based decentralized file storage",
        "Smart contracts for file ownership and access control",
        "AES-256 encryption for file protection",
        "React.js frontend with drag-and-drop functionality",
      ],
      architecture: "blockchain-ipfs",
      technologies: ["IPFS", "Ethereum", "Solidity", "Web3.js", "React.js"],
      isSpotlight: true,
    },
    "Collaborative-Code-Editor": {
      features: [
        "50+ concurrent users with live synchronization",
        "Operational transformation for conflict resolution",
        "90% data consistency achievement",
        "JWT-based authentication and session management",
      ],
      architecture: "websocket-collaboration",
      technologies: ["Node.js", "WebSockets", "MongoDB", "Socket.io", "JWT"],
      isSpotlight: true,
    },
    "Rust-KV-Database": {
      features: [
        "100,000+ operations per second",
        "Thread-safe architecture with lock-free data structures",
        "Sub-millisecond response times",
        "Efficient serialization and compression",
      ],
      architecture: "rust-database",
      technologies: [
        "Rust",
        "B-Trees",
        "Memory Mapping",
        "Concurrent Programming",
      ],
      isSpotlight: true,
    },
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const fetchGitHubRepos = async () => {
    try {
      setLoading(true);

      // Replace 'YOUR_GITHUB_USERNAME' with your actual GitHub username
      const response = await fetch("http://localhost:3001/api/github/repos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repos: selectedRepos }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const repos: GitHubRepo[] = await response.json();

      const transformedProjects: Project[] = repos.map((repo) => {
        const customData = customProjectData[repo.name] || {};

        return {
          id: repo.id,
          name: repo.name
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          description: repo.description || "No description available",
          tags: repo.topics || [],
          technologies:
            customData.technologies || [repo.language].filter(Boolean),
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          lastUpdated: new Date(repo.updated_at).toISOString().split("T")[0],
          demoUrl: repo.homepage || undefined,
          githubUrl: repo.html_url,
          features: customData.features || [],
          architecture: customData.architecture || "standard",
          language: repo.language || "Unknown",
          isSpotlight: customData.isSpotlight || false,
          ...customData,
        };
      });

      setProjects(transformedProjects);

      // Extract unique tags
      const allTags = transformedProjects.flatMap((p) => p.tags);
      setAvailableTags([...new Set(allTags)]);
    } catch (error) {
      console.error("Error fetching GitHub repos:", error);
      // Fallback to mock data if API fails
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubRepos();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesFilter =
      selectedFilter === "all" || project.tags.includes(selectedFilter);
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  // Separate spotlight and regular projects
  const spotlightProjects = filteredProjects.filter((p) => p.isSpotlight);
  const regularProjects = filteredProjects.filter((p) => !p.isSpotlight);

  const getTechIcon = (tech: string) => {
    const iconMap = {
      Python: "🐍",
      JavaScript: "🟨",
      TypeScript: "🔷",
      React: "⚛️",
      "React.js": "⚛️",
      "Node.js": "🟢",
      "Apache Spark": "⚡",
      MongoDB: "🍃",
      PostgreSQL: "🐘",
      PostGIS: "🗺️",
      Rust: "🦀",
      Blockchain: "⛓️",
      IPFS: "🌐",
      Ethereum: "💎",
      Solidity: "💎",
      AI: "🤖",
      IoT: "📡",
      WebSocket: "🔌",
      WebSockets: "🔌",
      "Socket.io": "🔌",
      Streamlit: "🔥",
      FastAPI: "⚡",
      OpenCV: "👁️",
      TensorFlow: "🧠",
      "TensorFlow Lite": "🧠",
      ESP8266: "📟",
      LoRaWAN: "📡",
      JWT: "🔐",
      XGBoost: "📊",
      "Web3.js": "🌐",
    };
    return iconMap[tech as keyof typeof iconMap] || "⚙️";
  };

  const getArchitectureDiagram = (type: string): JSX.Element | null => {
    const diagrams: Record<string, JSX.Element> = {
      "spark-postgis-streamlit": (
        <div className="glass-card p-4 rounded-lg border border-gray-300/20 mb-4">
          <h6 className="text-xs font-mono font-bold mb-3 text-gray-600 dark:text-gray-400">
            ARCHITECTURE FLOW
          </h6>
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="text-center">
              <Database className="mx-auto mb-1 text-blue-600" size={16} />
              <div>Raw Data</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="text-center">
              <Cpu className="mx-auto mb-1 text-orange-600" size={16} />
              <div>Spark ETL</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="text-center">
              <Database className="mx-auto mb-1 text-green-600" size={16} />
              <div>PostGIS</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="text-center">
              <Globe className="mx-auto mb-1 text-purple-600" size={16} />
              <div>Dashboard</div>
            </div>
          </div>
        </div>
      ),
      "blockchain-ipfs": (
        <div className="glass-card p-4 rounded-lg border border-gray-300/20 mb-4">
          <h6 className="text-xs font-mono font-bold mb-3 text-gray-600 dark:text-gray-400">
            DECENTRALIZED ARCHITECTURE
          </h6>
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="text-center">
              <Globe className="mx-auto mb-1 text-blue-600" size={16} />
              <div>React UI</div>
            </div>
            <div className="text-gray-400">↔</div>
            <div className="text-center">
              <Code className="mx-auto mb-1 text-yellow-600" size={16} />
              <div>Smart Contract</div>
            </div>
            <div className="text-gray-400">↔</div>
            <div className="text-center">
              <Database className="mx-auto mb-1 text-green-600" size={16} />
              <div>IPFS</div>
            </div>
          </div>
        </div>
      ),
      "iot-edge-computing": (
        <div className="glass-card p-4 rounded-lg border border-gray-300/20 mb-4">
          <h6 className="text-xs font-mono font-bold mb-3 text-gray-600 dark:text-gray-400">
            IOT EDGE ARCHITECTURE
          </h6>
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="text-center">
              <span className="block mx-auto mb-1 text-green-600">📟</span>
              <div>Sensors</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="text-center">
              <Cpu className="mx-auto mb-1 text-blue-600" size={16} />
              <div>Edge AI</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="text-center">
              <span className="block mx-auto mb-1 text-purple-600">📡</span>
              <div>LoRaWAN</div>
            </div>
          </div>
        </div>
      ),
      "websocket-collaboration": (
        <div className="glass-card p-4 rounded-lg border border-gray-300/20 mb-4">
          <h6 className="text-xs font-mono font-bold mb-3 text-gray-600 dark:text-gray-400">
            REAL-TIME COLLABORATION
          </h6>
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="text-center">
              <Globe className="mx-auto mb-1 text-blue-600" size={16} />
              <div>Client</div>
            </div>
            <div className="text-gray-400">⚡</div>
            <div className="text-center">
              <span className="block mx-auto mb-1 text-green-600">🔌</span>
              <div>WebSocket</div>
            </div>
            <div className="text-gray-400">⚡</div>
            <div className="text-center">
              <Database className="mx-auto mb-1 text-orange-600" size={16} />
              <div>MongoDB</div>
            </div>
          </div>
        </div>
      ),
      "rust-database": (
        <div className="glass-card p-4 rounded-lg border border-gray-300/20 mb-4">
          <h6 className="text-xs font-mono font-bold mb-3 text-gray-600 dark:text-gray-400">
            HIGH-PERFORMANCE STORAGE
          </h6>
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="text-center">
              <Code className="mx-auto mb-1 text-orange-600" size={16} />
              <div>API</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="text-center">
              <span className="block mx-auto mb-1 text-red-600">🦀</span>
              <div>Rust Engine</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="text-center">
              <Database className="mx-auto mb-1 text-blue-600" size={16} />
              <div>B-Tree</div>
            </div>
          </div>
        </div>
      ),
    };

    return diagrams[type] || null;
  };

  const downloadResume = () => {
    // Replace with your actual resume URL
    const resumeUrl = "/resume.pdf";
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = "resume.pdf";
    link.click();
  };

  return (
    <section
      className={`py-20 min-h-screen transition-colors duration-300 ${"dark bg-gray-900"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Controls */}
        <div className="text-center mb-16">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={downloadResume}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-mono text-sm"
              >
                <Download size={16} />
                <span>RESUME</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">ALL TAGS</option>
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    #{tag.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <h3 className="text-4xl font-bold font-mono vintage-headline mb-4">
            FEATURED WORKS
          </h3>
          <div className="h-0.5 w-24 bg-gray-800 dark:bg-gray-200 mx-auto"></div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="glass-card vintage-card p-8 animate-pulse bg-white dark:bg-gray-800 rounded-lg"
              >
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="flex space-x-2 mb-4">
                  <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Spotlight Projects */}
            {spotlightProjects.length > 0 && (
              <div className="mb-16">
                <h4 className="text-2xl font-bold font-mono mb-8 text-center">
                  🌟 SPOTLIGHT PROJECTS
                </h4>
                <div className="grid md:grid-cols-2 gap-8">
                  {spotlightProjects.map((project) => (
                    <article
                      key={project.id}
                      className="vintage-card glass-card group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="p-8">
                        <header className="mb-6">
                          <div className="flex justify-between items-start mb-4">
                            <h5 className="text-xl font-bold font-mono leading-tight text-gray-900 dark:text-gray-100">
                              {project.name}
                            </h5>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Star size={14} />
                                <span className="font-mono">
                                  {project.stars}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <GitFork size={14} />
                                <span className="font-mono">
                                  {project.forks}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="h-px bg-gray-400/40 mb-4"></div>
                        </header>

                        <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm leading-relaxed font-mono">
                          {project.description}
                        </p>

                        {getArchitectureDiagram(project.architecture)}

                        <div className="mb-6">
                          <h6 className="font-bold mb-3 text-sm font-mono text-gray-900 dark:text-gray-100">
                            KEY FEATURES:
                          </h6>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 font-mono">
                            {project.features
                              .slice(0, 3)
                              .map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-blue-600 dark:text-blue-400 mr-3 font-bold">
                                    •
                                  </span>
                                  {feature}
                                </li>
                              ))}
                          </ul>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.technologies.slice(0, 5).map((tech) => (
                            <span
                              key={tech}
                              className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-mono"
                            >
                              <span>{getTechIcon(tech)}</span>
                              <span>{tech}</span>
                            </span>
                          ))}
                          {project.technologies.length > 5 && (
                            <span className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-mono">
                              +{project.technologies.length - 5}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-mono"
                            >
                              #{tag.toUpperCase()}
                            </span>
                          ))}
                        </div>

                        <footer className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-2 text-xs text-gray-500 font-mono">
                            <Calendar size={12} />
                            <span>{project.lastUpdated}</span>
                          </div>
                          <div className="flex space-x-3">
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              title="View on GitHub"
                            >
                              <Github size={16} />
                            </a>
                            {project.demoUrl && (
                              <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 transition-colors"
                                title="Live Demo"
                              >
                                <ExternalLink size={16} />
                              </a>
                            )}
                          </div>
                        </footer>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Projects */}
            {regularProjects.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularProjects.map((project) => (
                  <article
                    key={project.id}
                    className="vintage-card glass-card group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-6">
                      <header className="mb-4">
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="text-lg font-bold font-mono leading-tight text-gray-900 dark:text-gray-100">
                            {project.name}
                          </h5>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Star size={12} />
                            <span className="font-mono">{project.stars}</span>
                          </div>
                        </div>
                      </header>

                      <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed font-mono">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-mono"
                          >
                            <span>{getTechIcon(tech)}</span>
                            <span>{tech}</span>
                          </span>
                        ))}
                      </div>

                      <footer className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2 text-xs text-gray-500 font-mono">
                          <Calendar size={10} />
                          <span>{project.lastUpdated}</span>
                        </div>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          title="View on GitHub"
                        >
                          <Github size={14} />
                        </a>
                      </footer>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 font-mono text-lg">
              NO PROJECTS FOUND IN ARCHIVES
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectCard;
