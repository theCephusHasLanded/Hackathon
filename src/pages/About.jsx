import { motion } from 'framer-motion'
import { Trophy, Users, Code, Lightbulb } from 'lucide-react'
import './About.css'

const About = () => {
  const features = [
    {
      icon: Trophy,
      title: "Win Amazing Prizes",
      description: "Compete for a $100K prize pool with rewards for innovation, technical excellence, and impact."
    },
    {
      icon: Users,
      title: "Connect with Builders",
      description: "Join a community of 50K+ developers, designers, and entrepreneurs from around the world."
    },
    {
      icon: Code,
      title: "Build Real Solutions",
      description: "Work on meaningful projects that solve real-world problems using cutting-edge technologies."
    },
    {
      icon: Lightbulb,
      title: "Learn from Experts",
      description: "Get mentorship from industry leaders and gain valuable experience in collaborative development."
    }
  ]

  const timeline = [
    { phase: "Registration", date: "Jan 1 - 15", description: "Sign up and form your team" },
    { phase: "Project Selection", date: "Jan 16 - 20", description: "Choose your project and connect with mentors" },
    { phase: "Development Phase", date: "Jan 21 - Mar 15", description: "Build your solution with team collaboration" },
    { phase: "Final Presentations", date: "Mar 16 - 20", description: "Present your project to judges" },
    { phase: "Awards Ceremony", date: "Mar 25", description: "Celebrate winners and innovations" }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="about-page"
    >
      <div className="container">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="about-header"
        >
          <h1>About LKHN Hackathon</h1>
          <p>Empowering the next generation of innovators to build the future through collaborative technology development</p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mission-section"
        >
          <h2>Our Mission</h2>
          <p>
            The LKHN Technologies Hackathon is more than just a competition—it's a platform for innovation, 
            learning, and community building. We believe that the most impactful solutions emerge when 
            talented individuals from diverse backgrounds come together to tackle meaningful challenges.
          </p>
          <p>
            Our hackathon focuses on creating real-world solutions using cutting-edge technologies 
            while fostering an environment of collaboration, mentorship, and continuous learning.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="features-section"
        >
          <h2>Why Join Us?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="feature-card"
              >
                <div className="feature-icon">
                  <feature.icon size={32} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="timeline-section"
        >
          <h2>Hackathon Timeline</h2>
          <div className="timeline">
            {timeline.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                className="timeline-item"
              >
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>{phase.phase}</h3>
                  <span className="timeline-date">{phase.date}</span>
                  <p>{phase.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2 }}
          className="cta-section"
        >
          <h2>Ready to Build the Future?</h2>
          <p>Join thousands of innovators in creating solutions that matter</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cta-button-large"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Get Started Today
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default About