import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TituloParticulas({ texto }) {
    const canvasRef = useRef(null);
    const textContainerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const textContainer = textContainerRef.current;

        // --- 1. Sincronizar Canvas con la Ventana Total ---
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawInitialText();
        }

        // Función para dibujar el texto original en su posición central
        function drawInitialText() {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia frame anterior
            
            const fontSize = 'clamp(2.5rem, 10vw, 6rem)';
            ctx.font = `bold ${fontSize} 'Playfair Display', serif`;
            ctx.fillStyle = '#0D6E6E'; // Deep Teal
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Dibujar el texto justo donde está su contenedor invisible
            const rect = textContainer.getBoundingClientRect();
            // Sumamos el scroll actual para obtener coordenadas absolutas
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2 + window.scrollY;
            
            ctx.fillText(texto, centerX, centerY);
            if (!isVisible) setIsVisible(true);
        }

        resizeCanvas(); // Ejecución inicial
        window.addEventListener('resize', resizeCanvas); // Adaptar a cambios de pantalla

        // --- 2. Captura de Datos de Partículas ---
        // Usamos una pequeña pausa para asegurar que la fuente cargó
        setTimeout(() => {
            if (!ctx) return;
            
            // Capturamos *toda* la pantalla para obtener las coordenadas absolutas
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const particles = [];

            // Aumentamos el "step" (píxeles por partícula) para performance al ser pantalla completa
            const step = 4; 
            for (let y = 0; y < canvas.height; y += step) {
                for (let x = 0; x < canvas.width; x += step) {
                    const alpha = data[((y * canvas.width) + x) * 4 + 3];
                    if (alpha > 128) {
                        particles.push({
                            x: x, y: y,
                            originX: x, originY: y,
                            color: '#0D6E6E',
                            alpha: 1 // Capacidad de desaparecer individualmente
                        });
                    }
                }
            }

            // --- 3. Animación de Scroll con GSAP (El Códice Digital) ---
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: textContainer, // Usamos el contenedor de texto invisible como activador
                    start: "top -10%",
                    end: "+=600",
                    scrub: 1.5, // Suavizado para efecto cuántico
                    pin: true, // "Congela" el texto original en su lugar
                    anticipatePin: 1
                }
            });

            // Dispersar partículas por toda la pantalla y desaparecerlas
            particles.forEach((p) => {
                tl.to(p, {
                    // Rango de dispersión masivo
                    x: () => p.originX + (Math.random() - 0.5) * window.innerWidth * 1.5,
                    y: () => p.originY - (Math.random() * window.innerHeight * 1.5),
                    alpha: 0, // Desaparecer por entropía
                    scale: 0.2, // Encogerse
                    duration: 1,
                    ease: "power2.inOut",
                    // Redibujar Canvas en cada frame
                    onUpdate: () => {
                        // Limpiamos el Canvas una sola vez por frame para performance
                        if (p === particles[0]) ctx.clearRect(0, 0, canvas.width, canvas.height);
                        
                        // Redibuja cada partícula
                        ctx.fillStyle = `rgba(13, 110, 110, ${p.alpha})`; // Usamos RGBA con su alpha dinámico
                        ctx.fillRect(p.x, p.y, 2, 2); // Redibuja el píxel
                    }
                }, Math.random() * 0.1); // Delay aleatorio para desintegración no uniforme
            });

        }, 200); // Pausa mínima para carga de fuente

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            // Matar triggers si se desmonta el componente
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [texto]);

    return (
        <>
            {/* 1. El Canvas Global que cubre toda la pantalla */}
            <canvas 
                ref={canvasRef} 
                style={{ 
                    position: 'fixed', // Siempre visible en pantalla
                    top: 0, left: 0,
                    width: '100vw', height: '100vh', 
                    zIndex: -1, // Por detrás del contenido (Botones, etc.)
                    pointerEvents: 'none' // No intercepta clicks
                }} 
            />

            {/* 2. Un Contenedor de Texto Invisible para que GSAP tenga un Trigger en el DOM */}
            <div ref={textContainerRef} style={{ 
                height: '100vh', // Ocupa toda la altura inicial
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'transparent' // Invisible, no tapa el Canvas
            }}>
                {/* Texto invisible que usamos para obtener el tamaño y posición central */}
                <h1 style={{ opacity: 0, fontSize: 'clamp(2.5rem, 10vw, 6rem)', visibility: 'hidden' }}>{texto}</h1>
            </div>
        </>
    );
}
