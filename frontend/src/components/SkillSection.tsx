import { Code, Database, Brain, Cloud } from "lucide-react";

const SkillSection = () => {
  return (
    <section className="py-20 border-t-4 border-double border-gray-800 dark:border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold font-mono vintage-headline mb-4">
            TECHNICAL EXPERTISE
          </h3>
          <div className="h-0.5 w-24 bg-gray-800 dark:bg-gray-200 mx-auto"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Database,
              title: "Big Data",
              desc: "Apache Spark, Hadoop, ETL Pipelines",
            },
            {
              icon: Brain,
              title: "Machine Learning",
              desc: "TensorFlow, XGBoost, Computer Vision",
            },
            {
              icon: Code,
              title: "Full-Stack",
              desc: "React, Node.js, Python, TypeScript",
            },
            {
              icon: Cloud,
              title: "Cloud & DevOps",
              desc: "AWS, Docker, Kubernetes, CI/CD",
            },
          ].map((skill, index) => (
            <div
              key={index}
              className="text-center glass-card vintage-card p-8"
            >
              <div className="w-16 h-16 border-2 border-gray-800 dark:border-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <skill.icon
                  className="text-gray-800 dark:text-gray-200"
                  size={28}
                />
              </div>
              <h4 className="font-bold mb-3 font-mono vintage-text">
                {skill.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">
                {skill.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default SkillSection;
