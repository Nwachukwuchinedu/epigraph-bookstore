import { useRef, useEffect, type FC, type MutableRefObject } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import * as THREE from 'three';
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
}

// --- THREE.JS SCENE COMPONENT ---
const ThreeBookStack: FC<ThreeBookStackProps> = ({ scrollProgress, hoveredCard }) => {
  const mountRef = useRef<HTMLDivElement>(null);

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

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

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

    featuredBooks.forEach((book, i) => {
      const thickness = 0.22 + Math.random() * 0.1;
      const width = 1.7;
      const height = 2.5;

      const coverTexture = createBookTexture(book.title, book.author, colors[i % colors.length]);
      const coverMat = new THREE.MeshPhysicalMaterial({ map: coverTexture, roughness: 0.4, metalness: 0.1 });
      const paperMat = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, roughness: 0.8 });

      // BoxGeometry(x:width, y:height, z:thickness)
      const geom = new THREE.BoxGeometry(width, height, thickness);
      const materials = [paperMat, paperMat, paperMat, paperMat, coverMat, coverMat];

      const mesh = new THREE.Mesh(geom, materials);
      floatGroup.add(mesh);
      books.push(mesh);

      // --- STACKING POSITION (FLAT PILE) ---
      // We rotate -PI/2 on X. thickness (z) becomes vertical extent.
      const stackY = cumulativeHeight + thickness / 2;
      cumulativeHeight += thickness + 0.15; // GENEROS GAP TO PREVENT MERGING

      const angle = (i / featuredBooks.length) * Math.PI * 2;
      const radius = 5.0;

      booksData.push({
        stackPos: new THREE.Vector3((Math.random() - 0.5) * 0.3, stackY, (Math.random() - 0.5) * 0.3),
        stackRot: new THREE.Euler(-Math.PI / 2, 0, (Math.random() - 0.5) * 0.4),
        orbitPos: new THREE.Vector3(Math.cos(angle) * radius, (Math.random() - 0.5) * 6, Math.sin(angle) * radius),
        orbitRot: new THREE.Euler(Math.random() * Math.PI, angle + Math.PI / 2, Math.random() * Math.PI)
      });
    });

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
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
  }, [scrollProgress]);

  return <div ref={mountRef} className="w-full h-full relative" />;
};

// --- BENTO CARD COMPONENT ---
const BentoCard = ({ title, subtitle, desc, icon: Icon, delay, setHovered }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    className="group relative overflow-hidden rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-stone-200/50 p-10 lg:p-14 transition-all duration-700 hover:bg-white/60 hover:shadow-[0_40px_80px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[500px]"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-stone-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    
    <div className="flex justify-between items-start mb-24 relative z-10">
      <span className="text-stone-400 text-xs tracking-[0.4em] uppercase font-semibold">{subtitle}</span>
      <div className="p-5 rounded-full bg-white border border-stone-100 group-hover:bg-stone-900 group-hover:text-white transition-all duration-500 shadow-sm">
        <Icon size={28} strokeWidth={1.5} />
      </div>
    </div>
    
    <div className="relative z-10">
      <h3 className="text-4xl lg:text-7xl font-medium tracking-tighter text-stone-900 mb-8 leading-[1]">{title}</h3>
      <p className="text-stone-500/90 text-2xl leading-relaxed max-w-sm font-light">
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
            
            <ThreeBookStack scrollProgress={smoothProgress} hoveredCard={hoveredCard} />
            
            <div className="absolute top-16 left-16 z-20 pointer-events-none">
              <h2 className="text-stone-900 text-sm tracking-[0.5em] font-bold uppercase opacity-20">Archives</h2>
              <div className="h-px w-16 bg-stone-200 mt-4 rounded-full" />
            </div>
          </div>
        </div>

        {/* Right: Scrolling Bento Section */}
        <div className="w-full lg:w-1/2 relative z-10 px-6 py-32 lg:px-24 lg:py-80 flex flex-col">
          <div className="max-w-2xl mx-auto flex flex-col gap-20 lg:gap-40">
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12"
            >
              <h2 className="text-6xl lg:text-[10rem] font-medium tracking-tighter mb-16 leading-[0.85] text-stone-900">
                Luminous <br/>
                <span className="italic text-stone-400 font-light selection:text-white">Form.</span>
              </h2>
              <p className="text-stone-500 text-3xl max-w-md font-light leading-snug tracking-tight">
                Simulating the tactile weight of literature through structural deconstruction.
              </p>
            </motion.div>

            <div className="flex flex-col gap-16 lg:gap-32">
              <BentoCard 
                title="The Vault"
                subtitle="01 // Edition"
                desc="Discover rare editions, meticulously selected for the modern intellectual and bibliophile."
                icon={Layers}
                delay={0.1}
                setHovered={setHovered}
              />
              <BentoCard 
                title="Tactility"
                subtitle="02 // Weight"
                desc="Bridging the gap between the ephemeral digital plane and the eternal weight of matter."
                icon={Glasses}
                delay={0.2}
                setHovered={setHovered}
              />
              <BentoCard 
                title="Volumetric"
                subtitle="03 // Depth"
                desc="Every book is a world with structural depth. We visualize narratives as architecture."
                icon={Sparkles}
                delay={0.3}
                setHovered={setHovered}
              />
              <BentoCard 
                title="Journal"
                subtitle="04 // Insights"
                desc="Access in-depth analyses and designer insights into the preservation of modern thought."
                icon={BookMarked}
                delay={0.4}
                setHovered={setHovered}
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
