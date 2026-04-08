import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import * as THREE from 'three';
import { Layers, Glasses, BookMarked, Sparkles } from 'lucide-react';
import { featuredBooks } from '../data/mockData';

// --- HELPER: DYNAMIC TEXTURE GENERATOR ---
const createBookTexture = (title: string, author: string, color: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background
  const hex = '#' + color.toString(16).padStart(6, '0');
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Spine effect (left shadow)
  const gradient = ctx.createLinearGradient(0, 0, 50, 0);
  gradient.addColorStop(0, 'rgba(0,0,0,0.3)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 50, canvas.height);

  // Text Styling
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff'; // Off-white for readability

  // Title (Top)
  ctx.font = '500 48px Inter, sans-serif';
  const words = title.split(' ');
  let y = 140;
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 400 && n > 0) {
      ctx.fillText(line.trim(), canvas.width / 2, y);
      line = words[n] + ' ';
      y += 60;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), canvas.width / 2, y);

  // Author (Bottom)
  ctx.font = '300 32px Inter, sans-serif';
  ctx.globalAlpha = 0.8;
  ctx.fillText(author.toUpperCase(), canvas.width / 2, canvas.height - 100);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
};

// --- THREE.JS SCENE COMPONENT ---
const ThreeBookStack = ({ scrollProgress, hoveredCard }: { scrollProgress: any; hoveredCard: React.MutableRefObject<boolean> }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#fafafa');

    const camera = new THREE.PerspectiveCamera(40, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 100);
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const softLight = new THREE.DirectionalLight(0xffffff, 1.2);
    softLight.position.set(5, 10, 5);
    scene.add(softLight);

    const fillLight = new THREE.PointLight(0xffffff, 0.5);
    fillLight.position.set(-5, -5, 5);
    scene.add(fillLight);

    // 3. Groups
    const presentationGroup = new THREE.Group();
    scene.add(presentationGroup);

    const floatGroup = new THREE.Group();
    presentationGroup.add(floatGroup);

    // 4. Books (Using Real Data & Non-Intersecting Stacks)
    const books: THREE.Mesh[] = [];
    const booksData: any[] = [];
    
    // Core color matching from featuredBooks palette strings
    const colors = [0x1c1917, 0xfb923c, 0x059669, 0x78716c, 0x1e1b4b, 0xb45309, 0x155e75, 0xe11d48];

    let currentY = -2; // Start from bottom
    const totalBooks = featuredBooks.length;

    featuredBooks.forEach((book, i) => {
      const thickness = 0.18 + Math.random() * 0.15;
      const width = 1.6 + Math.random() * 0.3;
      const height = 2.4 + Math.random() * 0.2;

      // Materials: Multi-material for front cover and sides
      const coverTexture = createBookTexture(book.title, book.author, colors[i % colors.length]);
      const coverMat = new THREE.MeshPhysicalMaterial({ 
        map: coverTexture, 
        roughness: 0.3, 
        metalness: 0.1,
        clearcoat: 0.2
      });
      const sideMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xffffff, // Paper edges
        roughness: 0.8 
      });

      const geom = new THREE.BoxGeometry(width, height, thickness);
      
      // Face logic: front(4) and back(5) use cover texture, others use sideMat
      const materials = [
        sideMat, sideMat, sideMat, sideMat, coverMat, coverMat
      ];

      const mesh = new THREE.Mesh(geom, materials);
      floatGroup.add(mesh);
      books.push(mesh);

      // Collision-Free Stacking Logic
      const stackY = currentY + thickness / 2;
      currentY += thickness + 0.02; // Small gap for realism

      const angle = (i / totalBooks) * Math.PI * 2;
      const radius = 3.5;
      const orbitY = (Math.random() - 0.5) * 5;

      booksData.push({
        stackPos: new THREE.Vector3(
          (Math.random() - 0.5) * 0.3, // Slight jitter in x
          stackY, 
          (Math.random() - 0.5) * 0.3  // Slight jitter in z
        ),
        stackRot: new THREE.Euler(
          -Math.PI / 2, // Laying flat
          0, 
          (Math.random() - 0.5) * 0.4 // Slight rotation jitter
        ),
        orbitPos: new THREE.Vector3(Math.cos(angle) * radius, orbitY, Math.sin(angle) * radius),
        orbitRot: new THREE.Euler(Math.random() * Math.PI, angle + Math.PI / 2, Math.random() * 0.5)
      });
    });

    // 5. Interaction
    let mX = 0, mY = 0, tMX = 0, tMY = 0;
    const onMM = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      tMX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      tMY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener('mousemove', onMM);

    const onRes = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', onRes);

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const s = scrollProgress.get();
      const isH = hoveredCard.current;

      mX += (tMX - mX) * 0.05;
      mY += (tMY - mY) * 0.05;

      presentationGroup.rotation.x += (-mY * 0.1 - presentationGroup.rotation.x) * 0.05;
      presentationGroup.rotation.y += (mX * 0.1 - presentationGroup.rotation.y) * 0.05;

      floatGroup.rotation.y += (isH ? 0.8 : 0.2) * delta;
      floatGroup.position.y = Math.sin(elapsed * 0.8) * 0.1;

      books.forEach((book, i) => {
        const data = booksData[i];
        
        // Position
        const targetPos = new THREE.Vector3().copy(data.stackPos).lerp(data.orbitPos, s);
        const bob = Math.sin(elapsed * 1.2 + i) * 0.1 * s;
        targetPos.y += bob;
        book.position.lerp(targetPos, 0.08);

        // Rotation
        const q1 = new THREE.Quaternion().setFromEuler(data.stackRot);
        const q2 = new THREE.Quaternion().setFromEuler(data.orbitRot);
        const tQ = new THREE.Quaternion().copy(q1).slerp(q2, s);
        book.quaternion.slerp(tQ, 0.08);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMM);
      window.removeEventListener('resize', onRes);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [scrollProgress]);

  return <div ref={containerRef} className="w-full h-full" />;
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
    className="group relative overflow-hidden rounded-[2.5rem] bg-stone-50/50 backdrop-blur-sm border border-stone-200 p-10 lg:p-12 transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[400px]"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-stone-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    
    <div className="flex justify-between items-start mb-20 relative z-10">
      <span className="text-stone-400 text-xs tracking-[0.3em] uppercase font-medium">{subtitle}</span>
      <div className="p-4 rounded-full bg-white border border-stone-100 group-hover:bg-stone-900 group-hover:text-white transition-all duration-500 shadow-sm">
        <Icon className="transition-colors duration-500" size={24} strokeWidth={1.5} />
      </div>
    </div>
    
    <div className="relative z-10">
      <h3 className="text-3xl lg:text-4xl font-medium tracking-tight text-stone-900 mb-6">{title}</h3>
      <p className="text-stone-500/80 text-lg leading-relaxed max-w-sm">
        {desc}
      </p>
    </div>
  </motion.div>
);

const BookStackSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, { damping: 30, stiffness: 50 });
  const hoveredCard = useRef(false);
  const setHovered = (val: boolean) => { hoveredCard.current = val; };

  return (
    <div ref={containerRef} className="relative w-full bg-[#fafafa]">
      <div className="flex flex-col lg:flex-row w-full relative">
        
        {/* Left: Sticky 3D Canvas */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen sticky top-0 z-0 overflow-hidden bg-stone-50/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,250,250,0)_0%,rgba(220,220,220,0.3)_100%)] pointer-events-none z-10" />
          
          <ThreeBookStack scrollProgress={smoothProgress} hoveredCard={hoveredCard} />
          
          <div className="absolute top-12 left-12 z-20 pointer-events-none">
            <h2 className="text-stone-900 text-sm tracking-[0.4em] font-medium uppercase">Epigraph Archive</h2>
            <p className="text-stone-400 text-xs tracking-widest mt-2">Physical Exploration v2.0</p>
          </div>
        </div>

        {/* Right: Scrolling Bento Content */}
        <div className="w-full lg:w-1/2 relative z-10 px-6 py-24 lg:px-20 lg:py-48">
          <div className="max-w-xl mx-auto flex flex-col gap-12 lg:gap-16">
            
            <motion.div 
              initial={{ opacity: 0, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="mb-12 lg:mb-20"
            >
              <h2 className="text-5xl lg:text-7xl font-medium tracking-tighter mb-8 leading-[1.05] text-stone-900">
                The architecture <br/>
                <span className="italic text-stone-400 font-light text-zinc-400">of literary form.</span>
              </h2>
              <p className="text-stone-500 text-xl max-w-md leading-relaxed">
                Experience literature as a structural phenomenon. Our digital archive preserves the tactile weight of the written word.
              </p>
            </motion.div>

            <div className="flex flex-col gap-8 lg:gap-12">
              
              <BentoCard 
                title="Curated Vault"
                subtitle="01 // Collection"
                desc="Discover rare editions, meticulously selected for the modern intellectual and bibliophile."
                icon={Layers}
                delay={0.1}
                setHovered={setHovered}
              />

              <BentoCard 
                title="Tactile Philosophy"
                subtitle="02 // Matter"
                desc="Bridging the gap between the ephemeral digital plane and the eternal weight of bound matter."
                icon={Glasses}
                delay={0.2}
                setHovered={setHovered}
              />

              <BentoCard 
                title="Volumetric Story"
                subtitle="03 // Structure"
                desc="Every book is a world with depth. We visualize narratives as architectural constructs."
                icon={Sparkles}
                delay={0.3}
                setHovered={setHovered}
              />
              
              <BentoCard 
                title="Editorial Journal"
                subtitle="04 // Insights"
                desc="Access in-depth analyses and designer insights into the preservation of modern thought."
                icon={BookMarked}
                delay={0.4}
                setHovered={setHovered}
              />

            </div>
            
            <div className="h-[20vh]" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookStackSection;
