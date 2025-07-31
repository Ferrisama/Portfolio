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
} from "lucide-react";

const ProjectCard = () => {
  const [selectedFilter] = useState("all");
  const [searchQuery] = useState("");
  type Project = {
    id: number;
    name: string;
    description: string;
    tags: string[];
    technologies: string[];
    stars: number;
    lastUpdated: string;
    demoUrl?: string;
    githubUrl: string;
    features: string[];
    architecture: string;
  };

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Typewriter effect

  // Mock projects data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mockProjects = [
    {
      id: 1,
      name: "AccidentIQ: AI-Powered Road Safety Analytics",
      description:
        "Comprehensive geospatial big data analytics platform processing road accident data across Indian cities with AI-powered insights for urban planning and traffic optimization.",
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
      stars: 45,
      lastUpdated: "2025-01-15",
      demoUrl: "https://accidentiq-demo.herokuapp.com",
      githubUrl:
        "https://github.com/Ferrisama/Indian-Road-Accident-Geospatial-Analytics-Platform",
      features: [
        "Process millions of accident records with Apache Spark + Sedona",
        "H3 Spatial Indexing for efficient geographic analysis",
        "89% accuracy XGBoost classifier for accident severity prediction",
        "Real-time heatmaps and temporal analysis dashboard",
      ],
      architecture: "spark-postgis-streamlit",
    },
    {
      id: 2,
      name: "Smart Agriculture IoT System",
      description:
        "Cost-effective IoT agricultural monitoring system using ESP8266 microcontrollers with computer vision-based pest detection achieving 85% accuracy.",
      tags: [
        "iot",
        "computer-vision",
        "edge-computing",
        "python",
        "tensorflow",
      ],
      technologies: [
        "ESP8266",
        "OpenCV",
        "TensorFlow Lite",
        "LoRaWAN",
        "ZigBee",
        "Python",
        "MQTT",
      ],
      stars: 32,
      lastUpdated: "2023-12-10",
      githubUrl: "https://github.com/Ferrisama/Smart-Agriculture-IoT",
      features: [
        "Computer vision pest detection with 85% accuracy",
        "Multi-sensor network with I2C and SPI protocols",
        "LoRaWAN for long-range data transmission",
        "70% reduction in cloud dependency with edge computing",
      ],
      architecture: "iot-edge-computing",
    },
    {
      id: 3,
      name: "Decentralized File Storage System (DeFS)",
      description:
        "Distributed file storage system using IPFS for decentralized data storage, handling 1TB+ of distributed content with blockchain-based ownership.",
      tags: ["blockchain", "web3", "ipfs", "ethereum", "javascript"],
      technologies: [
        "IPFS",
        "Ethereum",
        "Solidity",
        "Web3.js",
        "Node.js",
        "React.js",
      ],
      stars: 28,
      lastUpdated: "2024-08-22",
      demoUrl: "https://defs-demo.vercel.app",
      githubUrl: "https://github.com/Ferrisama/DeFS",
      features: [
        "IPFS-based decentralized file storage",
        "Smart contracts for file ownership and access control",
        "AES-256 encryption for file protection",
        "React.js frontend with drag-and-drop functionality",
      ],
      architecture: "blockchain-ipfs",
    },
    {
      id: 4,
      name: "Real-Time Collaborative Code Editor",
      description:
        "Real-time collaborative code editor supporting 50+ concurrent users with live synchronization using WebSockets and operational transformation algorithms.",
      tags: [
        "realtime",
        "websockets",
        "collaboration",
        "javascript",
        "mongodb",
      ],
      technologies: [
        "Node.js",
        "WebSockets",
        "MongoDB",
        "Socket.io",
        "Vite",
        "JWT",
      ],
      stars: 67,
      lastUpdated: "2024-11-30",
      demoUrl: "https://collab-editor-demo.netlify.app",
      githubUrl: "https://github.com/Ferrisama/Collaborative-Code-Editor",
      features: [
        "50+ concurrent users with live synchronization",
        "Operational transformation for conflict resolution",
        "90% data consistency achievement",
        "JWT-based authentication and session management",
      ],
      architecture: "websocket-collaboration",
    },
    {
      id: 5,
      name: "High-Performance Key-Value Database",
      description:
        "Custom key-value database implemented in Rust with B-tree indexing, supporting 100,000+ operations per second with sub-millisecond response times.",
      tags: ["rust", "database", "performance", "systems-programming"],
      technologies: [
        "Rust",
        "B-Trees",
        "Memory Mapping",
        "Concurrent Programming",
      ],
      stars: 89,
      lastUpdated: "2024-09-15",
      githubUrl: "https://github.com/Ferrisama/Rust-KV-Database",
      features: [
        "100,000+ operations per second",
        "Thread-safe architecture with lock-free data structures",
        "Sub-millisecond response times",
        "Efficient serialization and compression",
      ],
      architecture: "rust-database",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, [mockProjects]);

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

  const getTechIcon = (tech: string) => {
    const iconMap = {
      Python: "🐍",
      JavaScript: "🟨",
      React: "⚛️",
      "Node.js": "🟢",
      "Apache Spark": "⚡",
      MongoDB: "🍃",
      PostgreSQL: "🐘",
      Rust: "🦀",
      Blockchain: "⛓️",
      AI: "🤖",
      IoT: "📡",
      WebSocket: "🔌",
    };
    return iconMap[tech as keyof typeof iconMap] || "⚙️";
  };

  const getArchitectureDiagram = (
    type: "spark-postgis-streamlit" | "blockchain-ipfs" | string
  ) => {
    const diagrams: Record<
      "spark-postgis-streamlit" | "blockchain-ipfs",
      JSX.Element
    > = {
      "spark-postgis-streamlit": (
        <div className="glass-card p-4 rounded-lg border border-gray-300/20">
          <div className="flex items-center justify-between text-sm font-mono">
            <div className="text-center">
              <Database
                className="mx-auto mb-1 text-gray-700 dark:text-gray-300"
                size={18}
              />
              <div>Raw Data</div>
            </div>
            <div className="text-gray-500">→</div>
            <div className="text-center">
              <Cpu
                className="mx-auto mb-1 text-gray-700 dark:text-gray-300"
                size={18}
              />
              <div>Spark ETL</div>
            </div>
            <div className="text-gray-500">→</div>
            <div className="text-center">
              <Database
                className="mx-auto mb-1 text-gray-700 dark:text-gray-300"
                size={18}
              />
              <div>PostGIS</div>
            </div>
            <div className="text-gray-500">→</div>
            <div className="text-center">
              <Globe
                className="mx-auto mb-1 text-gray-700 dark:text-gray-300"
                size={18}
              />
              <div>Streamlit UI</div>
            </div>
          </div>
        </div>
      ),
      "blockchain-ipfs": (
        <div className="glass-card p-4 rounded-lg border border-gray-300/20">
          <div className="flex items-center justify-between text-sm font-mono">
            <div className="text-center">
              <Globe
                className="mx-auto mb-1 text-gray-700 dark:text-gray-300"
                size={18}
              />
              <div>React UI</div>
            </div>
            <div className="text-gray-500">→</div>
            <div className="text-center">
              <Code
                className="mx-auto mb-1 text-gray-700 dark:text-gray-300"
                size={18}
              />
              <div>Smart Contract</div>
            </div>
            <div className="text-gray-500">→</div>
            <div className="text-center">
              <Database
                className="mx-auto mb-1 text-gray-700 dark:text-gray-300"
                size={18}
              />
              <div>IPFS Storage</div>
            </div>
          </div>
        </div>
      ),
    };
    return type in diagrams ? diagrams[type as keyof typeof diagrams] : null;
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
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
                className="glass-card vintage-card p-8 animate-pulse"
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="vintage-card glass-card group"
              >
                <div className="p-8">
                  <header className="mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-bold font-mono leading-tight vintage-text">
                        {project.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Star size={14} />
                        <span className="font-mono">{project.stars}</span>
                      </div>
                    </div>
                    <div className="h-px bg-gray-400/40 mb-4"></div>
                  </header>

                  <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm leading-relaxed font-mono">
                    {project.description}
                  </p>

                  {getArchitectureDiagram(project.architecture)}

                  <div className="mb-6 mt-6">
                    <h5 className="font-bold mb-3 text-sm font-mono vintage-text">
                      KEY FEATURES:
                    </h5>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 font-mono">
                      {project.features.slice(0, 2).map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-gray-800 dark:text-gray-200 mr-3 font-bold">
                            •
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="vintage-tech-badge">
                        <span>{getTechIcon(tech)}</span>
                        <span>{tech}</span>
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="vintage-tech-badge text-gray-500">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span key={tag} className="vintage-tag">
                        #{tag.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  <footer className="flex justify-between items-center pt-6 border-t border-gray-400/30">
                    <div className="flex items-center space-x-2 text-xs text-gray-500 font-mono">
                      <Calendar size={12} />
                      <span>{project.lastUpdated}</span>
                    </div>
                    <div className="flex space-x-3">
                      <a
                        href={project.githubUrl}
                        className="vintage-icon-button"
                        title="View on GitHub"
                      >
                        <Github size={16} />
                      </a>
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          className="vintage-icon-button vintage-demo-button"
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
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 font-mono text-lg">
              NO ARTICLES FOUND IN ARCHIVES
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
export default ProjectCard;
