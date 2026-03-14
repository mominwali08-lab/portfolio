import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, AnimatePresence } from 'motion/react';
import { MousePointer2, Box, Cpu, Database, Binary, Sigma, ArrowRight, Github, Instagram, Mail, Phone } from 'lucide-react';

// --- Types ---
interface Project {
  title: string;
  desc: string;
  tags: string[];
  id: string;
  link?: string;
}

// --- Components ---

/**
 * WarpGrid: Animated Canvas that creates a "Space-Time" curvature effect
 * based on mouse movement.
 */
const WarpGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let mouse = { x: 0, y: 0 };
    let animationFrameId: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(60, 50, 30, 0.25)';
      ctx.lineWidth = 0.5;

      const spacing = 50;
      for (let x = 0; x < canvas.width; x += spacing) {
        ctx.beginPath();
        for (let y = 0; y < canvas.height; y += 10) {
          const dist = Math.hypot(x - mouse.x, y - mouse.y);
          const warp = Math.exp(-dist / 300) * 60;
          const offsetX = dist === 0 ? 0 : ((x - mouse.x) / dist) * warp;
          const offsetY = dist === 0 ? 0 : ((y - mouse.y) / dist) * warp;
          ctx.lineTo(x + offsetX, y + offsetY);
        }
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += spacing) {
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 10) {
          const dist = Math.hypot(x - mouse.x, y - mouse.y);
          const warp = Math.exp(-dist / 300) * 60;
          const offsetX = dist === 0 ? 0 : ((x - mouse.x) / dist) * warp;
          const offsetY = dist === 0 ? 0 : ((y - mouse.y) / dist) * warp;
          ctx.lineTo(x + offsetX, y + offsetY);
        }
        ctx.stroke();
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

/**
 * ProjectCard: 3D Tilt Glassmorphism effect
 */
const ProjectCard = ({ project }: { project: Project }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  return (
    <motion.div
      style={{ perspective: 1000 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="relative group"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="bg-white/20 backdrop-blur-xl border border-white/30 p-8 rounded-sm shadow-2xl transition-all duration-200"
      >
        <div className="absolute top-4 right-4 font-mono text-[10px] opacity-30 italic">
          REF_NO: {project.id}
        </div>
        <h3 className="text-3xl font-serif italic mb-4 text-stone-800">{project.title}</h3>
        <p className="text-stone-600 font-sans text-sm leading-relaxed mb-6">
          {project.desc}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span key={tag} className="px-2 py-1 text-[9px] uppercase tracking-widest border border-stone-400/30 text-stone-500">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
          {project.link ? (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#8b0000] transition-colors">
              View Schematic <ArrowRight size={14} />
            </a>
          ) : (
            <span className="flex items-center gap-2">View Schematic <ArrowRight size={14} /></span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * WaxSeal: The Crimson 3D Seal for Contact
 */
const WaxSeal = () => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, rotate: 5 }}
      whileTap={{ scale: 0.95, y: 2 }}
      className="relative w-32 h-32 cursor-pointer z-50"
    >
      <div className="absolute inset-0 bg-[#8b0000] rounded-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.4),5px_10px_20px_rgba(0,0,0,0.3)] border-2 border-[#6b0000]">
        <div className="w-full h-full rounded-full bg-[url('https://www.transparenttextures.com/patterns/rock.png')] opacity-40 mix-blend-overlay" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <span className="text-[#f4f1ea] font-serif text-[10px] font-bold tracking-tighter leading-none">
          SEAL OF<br/>voidboy0
        </span>
      </div>
      {/* Hand-drawn accent circle */}
      <svg className="absolute -inset-2 w-36 h-36 animate-spin-slow pointer-events-none opacity-40">
        <circle cx="72" cy="72" r="68" fill="none" stroke="#4a0000" strokeWidth="0.5" strokeDasharray="4 8" />
      </svg>
    </motion.div>
  );
};

/**
 * Main Portfolio Page
 */
export default function App() {
  const [mirrorMode, setMirrorMode] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    document.title = "voidboy0 | The Scholar's Blueprint";
  }, []);

  const projects: Project[] = [
    { id: "002", title: "Human Intelligence Prediction", desc: "Regressive neural networks modeling cognitive output based on multifaceted input vectors.", tags: ["Scikit-learn", "Streamlit", "Data Cleaning"], link: "https://github.com/mominwali08-lab/iq-intelligence-predictor" },
    { id: "003", title: "Fuel Price Dashboard", desc: "Real-time algorithmic monitoring of energy market volatility and predictive forecasting.", tags: ["SQL", "Plotly", "Time-Series"], link: "https://claude.ai/public/artifacts/d4037d9b-f913-4e2d-8713-68ab27252abe" },
  ];

  return (
    <div className={`selection:bg-red-200 selection:text-red-900 ${mirrorMode ? 'scale-x-[-1]' : ''} transition-transform duration-1000 ease-in-out min-h-screen bg-[#f4f1ea] text-[#2d2d2d] overflow-x-hidden font-serif`}>
      <WarpGrid />

      {/* Progress Bar */}
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-[2px] bg-stone-800 z-[100] origin-left" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          {/* Vitruvian-style Background SVG */}
          <svg width="600" height="600" viewBox="0 0 100 100" className="opacity-[0.15] text-stone-900">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.2" />
            <rect x="22" y="22" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="0.2" />
            <path d="M50 10 L50 90 M10 50 L90 50 M20 20 L80 80 M80 20 L20 80" stroke="currentColor" strokeWidth="0.1" />
          </svg>
        </motion.div>

        <div className="z-10 text-center">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-[10px] uppercase tracking-[0.5em] mb-4 text-stone-500"
          >
            Established 2024 • Data Science Scholar
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-8xl md:text-[12rem] leading-none italic font-medium tracking-tighter"
          >
            voidboy0
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-[1px] bg-stone-400 my-8 mx-auto"
          />
          <p 
            className="text-xl md:text-2xl italic text-stone-700 inline-block scale-x-[-1] hover:scale-x-100 transition-transform duration-700 cursor-help"
            title="Da Vinci's Mirror Writing"
          >
            Wali Majid Momin
          </p>
          <p className="font-mono text-xs uppercase tracking-widest mt-2 opacity-60">BK Birla College, Kalyan (2027)</p>
        </div>

        {/* Self-drawing Mouse Hint */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10"
        >
          <MousePointer2 size={20} className="opacity-20" />
        </motion.div>
      </section>

      {/* Projects Section */}
      <section className="relative py-32 px-6 max-w-6xl mx-auto">
        <div className="mb-20">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-5xl font-serif italic"
          >
            The Project Journals
          </motion.h2>
          <div className="w-24 h-1 bg-red-900/20 mt-4" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      </section>

      {/* Technical Skills: Mathematical Transition */}
      <section className="relative py-40 overflow-hidden bg-[#f4f1ea] text-stone-900">
        <div className="absolute inset-0 opacity-30 text-stone-800">
          {/* Floating symbols background */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: Math.random() * 1000 }}
              animate={{ y: -1000 }}
              transition={{ duration: Math.random() * 20 + 10, repeat: Infinity, ease: "linear" }}
              className="absolute font-mono text-4xl"
              style={{ left: `${Math.random() * 100}%` }}
            >
              {['Σ', '∫', 'Δ', 'π', '∞', 'λ'][Math.floor(Math.random() * 6)]}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl italic mb-16">Technical Axioms</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            {[
              { icon: <Binary />, name: "Python" },
              { icon: <Database />, name: "SQL" },
              { icon: <Cpu />, name: "Machine Learning" },
              { icon: <Sigma />, name: "Data Cleaning" },
              { icon: <Box />, name: "Streamlit" },
              { icon: <AnimatePresence />, name: "NLP" },
            ].map((skill, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1, color: "#8b0000" }}
                className="flex flex-col items-center gap-4 group"
              >
                <div className="p-4 border border-stone-900/10 rounded-full group-hover:border-red-900/50 transition-colors">
                  {skill.icon}
                </div>
                <span className="font-mono text-xs uppercase tracking-widest">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer & Easter Egg */}
      <footer className="relative py-40 flex flex-col items-center justify-center overflow-hidden bg-stone-900 text-[#f4f1ea]">
        {/* Fibonacci Spiral Interaction */}
        <div className="mb-20 group relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[9px] uppercase tracking-tighter w-max">
            Da Vinci's Signature: Long Press
          </div>
          <motion.svg 
            width="80" height="80" viewBox="0 0 100 100" 
            className="cursor-help opacity-30 hover:opacity-100 transition-opacity"
            onPointerDown={(e) => {
              const timer = setTimeout(() => setMirrorMode(!mirrorMode), 1500);
              e.currentTarget.onpointerup = () => clearTimeout(timer);
            }}
          >
            <motion.path
              d="M0,100 Q100,100 100,0 Q100,61 38,61 Q61,61 61,23 Q40,23 40,46 Q53,46 53,32"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 3 }}
            />
          </motion.svg>
        </div>

        {/* The Wax Seal Button */}
        <div className="flex flex-col items-center gap-6">
          <WaxSeal />
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-40">
            Contact voidboy0
          </p>
          
          {/* Contact Links */}
          <div className="flex flex-col items-center gap-6 mt-8 z-10">
            <div className="flex flex-wrap justify-center gap-8">
              <motion.a 
                whileHover={{ y: -2 }}
                href="https://mail.google.com/mail/?view=cm&fs=1&to=mominwali08@gmail.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-stone-400 hover:text-red-400 transition-colors"
              >
                <Mail size={18} />
                <span className="font-mono text-[10px] uppercase tracking-widest">mominwali08@gmail.com</span>
              </motion.a>
              
              <motion.a 
                whileHover={{ y: -2 }}
                href="tel:+910000000000" 
                className="flex items-center gap-3 text-stone-400 hover:text-red-400 transition-colors"
              >
                <Phone size={18} />
                <span className="font-mono text-[10px] uppercase tracking-widest">+91 00000 00000</span>
              </motion.a>
            </div>

            <div className="w-24 h-[1px] bg-white/10" />

            <div className="flex flex-wrap justify-center gap-8">
              <motion.a 
                whileHover={{ y: -2 }}
                href="https://github.com/mominwali08-lab?tab=repositories" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-stone-400 hover:text-red-400 transition-colors"
              >
                <Github size={18} />
                <span className="font-mono text-[10px] uppercase tracking-widest">GitHub</span>
              </motion.a>
              
              <motion.a 
                whileHover={{ y: -2 }}
                href="https://instagram.com/voidboy0" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-stone-400 hover:text-red-400 transition-colors"
              >
                <Instagram size={18} />
                <span className="font-mono text-[10px] uppercase tracking-widest">Instagram</span>
              </motion.a>
            </div>
          </div>
        </div>

        <div className="mt-40 text-[9px] font-mono uppercase tracking-[0.5em] opacity-30">
          © {new Date().getFullYear()} — Codex Momin — v.2.0.4-β
        </div>
      </footer>
    </div>
  );
}
