import { useState, useEffect } from "react";

import { Download, Mail } from "lucide-react";

const Hero = () => {
  const [typewriterText, setTypewriterText] = useState("");

  const typewriterTexts = [
    "Building the Future with Data & Code",
    "Crafting Digital Solutions",
    "Engineering Tomorrow's Technology",
  ];

  // Typewriter effect
  useEffect(() => {
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let timeout: string | number | NodeJS.Timeout | undefined = undefined;

    const typeWriter = () => {
      const currentText = typewriterTexts[currentTextIndex];

      if (isDeleting) {
        setTypewriterText(currentText.substring(0, currentCharIndex - 1));
        currentCharIndex--;
      } else {
        setTypewriterText(currentText.substring(0, currentCharIndex + 1));
        currentCharIndex++;
      }

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && currentCharIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % typewriterTexts.length;
        typeSpeed = 500;
      }

      timeout = setTimeout(typeWriter, typeSpeed);
    };

    typeWriter();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <h2 className="text-6xl md:text-8xl font-bold mb-4 vintage-headline">
              PORTFOLIO
            </h2>
            <div className="h-1 w-32 bg-gray-800 dark:bg-gray-200 mx-auto mb-8"></div>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl md:text-4xl font-mono mb-6 h-16">
              {typewriterText}
              <span className="animate-pulse">|</span>
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-mono">
              Full-Stack Software Engineer specializing in Big Data Analytics,
              Web Automation, and Blockchain Technologies. Experienced in
              processing 14,000+ data points and building scalable systems that
              impact millions.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              "⚡ Apache Spark",
              "🤖 Machine Learning",
              "⛓️ Blockchain",
              "🐍 Python",
            ].map((skill) => (
              <span key={skill} className="vintage-badge">
                {skill}
              </span>
            ))}
          </div>

          <div className="flex justify-center space-x-6">
            <button className="vintage-button-primary">
              <Download size={18} />
              <span>Download Resume</span>
            </button>
            <button className="vintage-button-secondary">
              <Mail size={18} />
              <span>Get in Touch</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
