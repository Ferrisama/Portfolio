import { Github, Mail, Linkedin } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 glass-header backdrop-blur-xl border-b border-gray-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-6">
            <h1 className="text-3xl font-bold font-mono tracking-wider vintage-text">
              THE ASMIT GHOSH
            </h1>
            <div className="hidden md:block text-sm text-gray-600 dark:text-gray-400 font-mono border-l border-gray-400/40 pl-6">
              <div>EST. 2023</div>
              <div className="text-xs">DIGITAL CRAFTSMAN</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="mailto:asmitghosh3@gmail.com" className="vintage-link">
              <Mail size={20} />
            </a>
            <a
              href="https://linkedin.com/in/asmit-ghosh"
              className="vintage-link"
            >
              <Linkedin size={20} />
            </a>
            <a href="https://github.com/Ferrisama" className="vintage-link">
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
