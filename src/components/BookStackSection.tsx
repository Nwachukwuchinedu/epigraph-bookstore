import { useRef, useEffect, type FC, type MutableRefObject } from 'react';
import { motion, useScroll, useSpring, useInView, useTransform } from 'framer-motion';
import * as THREE from 'three';
import SectionHeader from './ui/SectionHeader';
import { Layers, Glasses, BookMarked, Sparkles } from 'lucide-react';
import { featuredBooks } from '../data/mockData';

// --- HELPER: DYNAMIC TEXTURE GENERATOR ---
const createBookTexture = (title: string, author: string, color: number) => {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background
  const hex = '#' + color.toString(16).padStart(6, '0');
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Spine effect
  const gradient = ctx.createLinearGradient(0, 0, 60, 0);
  gradient.addColorStop(0, 'rgba(0,0,0,0.4)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 60, canvas.height);

  // Text Styling
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';

  // Title (Top)
  ctx.font = '500 42px Inter, system-ui, sans-serif';
  const words = title.split(' ');
  let y = 180;
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > 420 && n > 0) {
      ctx.fillText(line.trim(), canvas.width / 2, y);
      line = words[n] + ' ';
      y += 50;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), canvas.width / 2, y);

  // Author (Bottom)
  ctx.font = '300 28px Inter, system-ui, sans-serif';
  ctx.globalAlpha = 0.6;
  ctx.fillText(author.toUpperCase(), canvas.width / 2, canvas.height - 140);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
};

interface ThreeBookStackProps { 
  scrollProgress: any; 
  hoveredCard: MutableRefObject<boolean>; 
  isInView: boolean;
}

// --- THREE.JS SCENE COMPONENT ---
const ThreeBookStack: FC<ThreeBookStackProps> = ({ scrollProgress, hoveredCard, isInView }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Fix 1: Cache scrollProgress in a ref for smooth updates in Three.js
    const progressRef = { current: scrollProgress.get() };
    const unsubscribe = scrollProgress.on("change", (v: number) => {
      progressRef.current = v;
    });

    // Fix 3: Reuse vectors/quaternions outside the loop to prevent GC spikes
    const tempVec = new THREE.Vector3();
    const tempQuat1 = new THREE.Quaternion();
    const tempQuat2 = new THREE.Quaternion();
    const tempQuat3 = new THREE.Quaternion();

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#fafafa');

    // Fix 4: Guard canvas size for initial render
    const width = mountRef.current.clientWidth || window.innerWidth;
    const height = mountRef.current.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 5, 14); 
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: window.innerWidth > 768, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(10, 20, 10);
    scene.add(light);

    // 3. Groups
    const presentationGroup = new THREE.Group();
    scene.add(presentationGroup);

    const floatGroup = new THREE.Group();
    presentationGroup.add(floatGroup);

    // 4. Books
    const books: THREE.Mesh[] = [];
    const booksData: any[] = [];
    
    const colors = [0x1c1917, 0xfb923c, 0x059669, 0x78716c, 0x1e1b4b, 0xb45309, 0x155e75, 0xe11d48];
    
    let cumulativeHeight = -1.8; // Lower start point

    // Stagger texture creation to prevent frame drops
    featuredBooks.forEach((book, i) => {
      setTimeout(() => {
        const thickness = 0.22 + Math.random() * 0.1;
        const width = 1.7;
        const height = 2.5;

        const coverTexture = createBookTexture(book.title, book.author, colors[i % colors.length]);
        const coverMat = new THREE.MeshPhysicalMaterial({ map: coverTexture, roughness: 0.4, metalness: 0.1 });
        const paperMat = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, roughness: 0.8 });

        const geom = new THREE.BoxGeometry(width, height, thickness);
        const materials = [paperMat, paperMat, paperMat, paperMat, coverMat, coverMat];

        const mesh = new THREE.Mesh(geom, materials);
        floatGroup.add(mesh);
        books.push(mesh);

        const stackY = cumulativeHeight + thickness / 2;
        cumulativeHeight += thickness + 0.15;

        const angle = (i / featuredBooks.length) * Math.PI * 2;
        const radius = 5.0;

        booksData.push({
          stackPos: new THREE.Vector3((Math.random() - 0.5) * 0.3, stackY, (Math.random() - 0.5) * 0.3),
          stackRot: new THREE.Euler(-Math.PI / 2, 0, (Math.random() - 0.5) * 0.4),
          orbitPos: new THREE.Vector3(Math.cos(angle) * radius, (Math.random() - 0.5) * 6, Math.sin(angle) * radius),
          orbitRot: new THREE.Euler(Math.random() * Math.PI, angle + Math.PI / 2, Math.random() * Math.PI)
        });
      }, i * 20); // 20ms stagger
    });

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      if (!isInView) {
        animId = requestAnimationFrame(animate);
        return;
      }
      
      animId = requestAnimationFrame(animate);
      // Fix: Clamp s to ensure it stays in 0-1 range
      const s = Math.min(Math.max(progressRef.current, 0), 1);
      const elapsed = clock.getElapsedTime();

      floatGroup.rotation.y += (hoveredCard.current ? 1.0 : 0.1) * 0.01;

      books.forEach((book, i) => {
        const data = booksData[i];
        
        // Fix 3 continued: Use reused objects for interpolation
        tempVec.copy(data.stackPos).lerp(data.orbitPos, s);
        tempVec.y += Math.sin(elapsed * 1.2 + i) * 0.05; // Float bob
        book.position.lerp(tempVec, 0.1);

        tempQuat1.setFromEuler(data.stackRot);
        tempQuat2.setFromEuler(data.orbitRot);
        tempQuat3.copy(tempQuat1).slerp(tempQuat2, s);
        book.quaternion.slerp(tempQuat3, 0.1);
      });

      renderer.render(scene, camera);
    };

    animate();

    const onRes = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', onRes);

    return () => {
      window.removeEventListener('resize', onRes);
      cancelAnimationFrame(animId);
      unsubscribe();
      renderer.dispose();
      if (mountRef.current) mountRef.current.innerHTML = '';
    };
  }, [scrollProgress, isInView]);

  return <div ref={mountRef} className="w-full h-full relative" />;
};

// --- BENTO CARD COMPONENT ---
const BentoCard = ({ title, subtitle, desc, icon: Icon, delay, setHovered, yOffset }: any) => (
  <motion.div
    style={{ y: yOffset }}
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    className="group relative overflow-hidden rounded-[3rem] bg-white/50 backdrop-blur-2xl border border-white/20 p-12 lg:p-16 transition-all duration-700 hover:bg-white/80 hover:shadow-[0_60px_100px_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[550px] cursor-none"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-stone-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
    
    <div className="flex justify-between items-start mb-24 relative z-10">
      <div className="flex flex-col gap-2">
        <span className="text-stone-400 text-[10px] tracking-[0.5em] font-bold">{subtitle}</span>
        <div className="h-0.5 w-8 bg-stone-200 group-hover:w-12 group-hover:bg-stone-900 transition-all duration-700" />
      </div>
      <div className="p-6 rounded-2xl bg-white shadow-sm border border-stone-100 group-hover:bg-stone-900 group-hover:text-white transition-all duration-500 transform group-hover:rotate-12">
        <Icon size={32} strokeWidth={1} />
      </div>
    </div>
    
    <div className="relative z-10">
      <h3 className="text-5xl lg:text-8xl font-medium tracking-tighter text-stone-900 mb-10 leading-[0.9] overflow-hidden">
        <motion.span 
          initial={{ y: "100%" }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
          className="block"
        >
          {title}
        </motion.span>
      </h3>
      <p className="text-stone-500/80 text-2xl leading-relaxed max-w-md font-light tracking-tight">
        {desc}
      </p>
    </div>
  </motion.div>
);

const BookStackSection: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use scroll with window container for maximum stability, targeted to this section's bounds
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  
  const smoothProgress = useSpring(scrollYProgress, { damping: 50, stiffness: 70 });
  const hoveredCard = useRef(false);
  const setHovered = (val: boolean) => { hoveredCard.current = val; };
  
  // Parallax offsets for the Cards
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  
  const isInView = useInView(containerRef, { margin: "200px" });

  return (
    <section 
      ref={containerRef} 
      id="archives"
      className="relative w-full bg-[#fafafa]"
      style={{ minHeight: '200vh' }} // Fix: Moderate height for 3D transition
    >
      <div className="flex flex-col lg:flex-row w-full relative">
        
        {/* Fix 5: Simplified sticky wrapper for better scroll tracking */}
        <div className="w-full lg:w-1/2 relative">
          <div className="sticky top-0 h-screen z-0 overflow-hidden bg-stone-50/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_50%,rgba(250,250,250,0)_0%,rgba(220,220,220,0.3)_100%)] pointer-events-none z-10" />
            
            <ThreeBookStack scrollProgress={smoothProgress} hoveredCard={hoveredCard} isInView={isInView} />
            
            <div className="absolute top-16 left-16 z-20 pointer-events-none">
              <h2 className="text-stone-900 text-sm tracking-[0.5em] font-bold uppercase opacity-20">Archives</h2>
              <div className="h-px w-16 bg-stone-200 mt-4 rounded-full" />
            </div>
          </div>
        </div>

        {/* Right: Scrolling Bento Section */}
        <div className="w-full lg:w-1/2 relative z-10 px-6 py-32 lg:px-24 lg:py-80 flex flex-col">
          <div className="max-w-2xl mx-auto flex flex-col gap-20 lg:gap-40">
            
            <div className="mb-32 relative">
              <div className="absolute -left-12 top-0 bottom-0 w-px bg-stone-200 hidden lg:block" />
              <SectionHeader 
                eyebrow="The Catalog"
                title="Luminous"
                subtitle="Form."
                align="left"
                className="mb-0 lg:mb-0 scale-90 origin-left lg:scale-100"
              />
              <div className="max-w-md mt-16">
                <p className="text-stone-500 text-3xl font-light leading-snug tracking-tight mb-8">
                  Simulating the tactile weight of literature through structural deconstruction.
                </p>
                <div className="flex items-center gap-4 text-[10px] tracking-[0.4em] uppercase text-stone-300 font-bold">
                  <span className="w-12 h-px bg-stone-200" />
                  Scroll to Explore
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-32 lg:gap-64">
              <BentoCard 
                title="The Vault"
                subtitle="01 // Edition"
                desc="Discover rare editions, meticulously selected for the modern intellectual and bibliophile."
                icon={Layers}
                delay={0.1}
                setHovered={setHovered}
                yOffset={y1}
              />
              <BentoCard 
                title="Tactility"
                subtitle="02 // Weight"
                desc="Bridging the gap between the ephemeral digital plane and the eternal weight of matter."
                icon={Glasses}
                delay={0.2}
                setHovered={setHovered}
                yOffset={y2}
              />
              <BentoCard 
                title="Volumetric"
                subtitle="03 // Depth"
                desc="Every book is a world with structural depth. We visualize narratives as architecture."
                icon={Sparkles}
                delay={0.3}
                setHovered={setHovered}
                yOffset={y3}
              />
              <BentoCard 
                title="Journal"
                subtitle="04 // Insights"
                desc="Access in-depth analyses and designer insights into the preservation of modern thought."
                icon={BookMarked}
                delay={0.4}
                setHovered={setHovered}
                yOffset={y4}
              />
            </div>
            
            <div className="h-[50vh]" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default BookStackSection;
