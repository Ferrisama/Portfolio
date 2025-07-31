import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProjectCard from "./components/ProjectCard";
import SkillSection from "./components/SkillSection";

import { Mail, Phone, Search } from "lucide-react";

const Portfolio = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Typewriter effect

  return (
    <div
      className={`min-h-screen font-mono transition-all duration-500 ${"dark bg-gray-900 text-gray-100"}`}
    >
      {/* Paper texture background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
            radial-gradient(circle at 25px 25px, rgba(0,0,0,.1) 2%, transparent 0%),
            radial-gradient(circle at 75px 75px, rgba(0,0,0,.1) 2%, transparent 0%)
          `,
            backgroundSize: "100px 100px",
          }}
        ></div>
      </div>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* News-style divider */}
      <div className="border-t-4 border-double border-gray-800 dark:border-gray-200 mx-8"></div>

      {/* Filters Section */}
      <section className="py-12 border-b border-gray-400/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            <div className="flex flex-wrap gap-3">
              {[
                "all",
                "bigdata",
                "ai",
                "blockchain",
                "iot",
                "realtime",
                "rust",
                "python",
              ].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`vintage-filter-button ${
                    selectedFilter === filter ? "active" : ""
                  }`}
                >
                  #{filter.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="SEARCH ARCHIVES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="vintage-search"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <ProjectCard />

      {/* Skills Section */}
      <SkillSection />

      {/* Architecture Diagrams */}

      {/* Contact Section */}
      <section className="py-20 border-t-4 border-double border-gray-800 dark:border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold font-mono vintage-headline mb-8">
            CORRESPONDENCE
          </h3>
          <p className="text-xl mb-12 text-gray-700 dark:text-gray-300 font-mono leading-relaxed">
            Ready to collaborate on groundbreaking projects that push the
            boundaries of technology.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8">
            <a
              href="mailto:asmitghosh3@gmail.com"
              className="vintage-contact-button"
            >
              <Mail size={18} />
              <span>asmitghosh3@gmail.com</span>
            </a>
            <a
              href="tel:+919672023768"
              className="vintage-contact-button-secondary"
            >
              <Phone size={18} />
              <span>+91-9672023768</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t-4 border-double border-gray-800 dark:border-gray-200 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="font-mono text-sm text-gray-600 dark:text-gray-400">
              © MMXXV ASMIT GHOSH • HANDCRAFTED WITH PRECISION
            </p>
          </div>
          <div className="flex justify-center space-x-8">
            {[
              { href: "https://github.com/Ferrisama", label: "GITHUB" },
              {
                href: "https://linkedin.com/in/asmit-ghosh",
                label: "LINKEDIN",
              },
              { href: "mailto:asmitghosh3@gmail.com", label: "CORRESPONDENCE" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="vintage-footer-link"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
