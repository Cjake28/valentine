import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import confetti from 'canvas-confetti';
import celebrationGif from './assets/200w.gif';

gsap.registerPlugin(useGSAP);

function App() {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const yesBtnRef = useRef<HTMLButtonElement>(null);

  // Animation for opening the envelope
  useGSAP(() => {
    if (envelopeOpen) {
      const tl = gsap.timeline({
        onComplete: () => setLetterVisible(true)
      });

      // Flap opening
      tl.to('.envelope-flap', {
        duration: 0.4,
        rotateX: 180,
        ease: 'back.in(1.5)'
      })
        .set('.envelope-flap', { zIndex: 0 })
        // Letter sliding out
        .to('.letter-mock', {
          duration: 0.6,
          y: -120,
          scaleY: 1.1,
          ease: 'power2.out'
        })
        // Envelope interaction - Scale down and fade
        .to('.envelope-full', {
          duration: 0.5,
          scale: 0.8,
          opacity: 0,
          ease: 'power2.in',
          delay: 0.1
        });
    }
  }, { scope: containerRef, dependencies: [envelopeOpen] });

  // Animation for showing the full letter and typing effect
  useEffect(() => {
    if (letterVisible && !questionVisible) {
      // Transition letter to full view
      const tl = gsap.timeline();

      tl.fromTo(letterRef.current,
        { scale: 0.5, opacity: 0, y: 100 },
        {
          duration: 0.8,
          opacity: 1,
          y: 0,
          scale: 1,
          display: 'flex',
          ease: 'elastic.out(1, 0.6)'
        }
      );

      // Reveal text paragraphs with stagger
      tl.fromTo('.letter-text > p',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 1.5, // Increased stagger for better readability
          duration: 1.0, // Slightly slower fade in
          ease: 'power2.out',
        }
        , '-=0.4');

      // Add a pause before showing the question
      tl.to({}, { duration: 2.0 }); // 2 second pause after text is fully revealed
      tl.call(() => setQuestionVisible(true));
    }
  }, [letterVisible]);

  const handleOpenEnvelope = () => {
    setEnvelopeOpen(true);
  };

  const handleNoHover = () => {
    if (noBtnRef.current && yesBtnRef.current) {
      // Mobile-friendly swap or random move
      const xRange = window.innerWidth * 0.3; // 30% of screen width
      const yRange = window.innerHeight * 0.2; // 20% of screen height

      const randomX = (Math.random() - 0.5) * xRange;
      const randomY = (Math.random() - 0.5) * yRange;

      gsap.to(noBtnRef.current, {
        x: randomX,
        y: randomY,
        rotation: (Math.random() - 0.5) * 30,
        duration: 0.3,
        ease: 'circ.out'
      });
    }
  };

  const handleYesClick = () => {
    setAccepted(true);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff9a9e', '#fad0c4', '#ffdde1']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff9a9e', '#fad0c4', '#ffdde1']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-pink-50 relative selection:bg-pink-200">

      {/* Background decoration - Soft globs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-pink-200/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vh] h-[60vh] bg-red-100/50 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-[40%] left-[60%] w-[30vh] h-[30vh] bg-pink-300/20 rounded-full blur-[80px]"></div>
      </div>

      {!accepted ? (
        <>
          {/* Envelope Container */}
          <div
            className={`envelope-full relative cursor-pointer z-20 transition-transform duration-300 hover:scale-105 ${envelopeOpen ? 'pointer-events-none' : ''}`}
            onClick={handleOpenEnvelope}
          >
            {/* Main Envelope Body */}
            <div className="relative w-80 h-56 group">
              {/* Paper inside (Letter Mock) */}
              <div className="letter-mock absolute left-4 right-4 h-48 bg-white rounded-lg shadow-sm z-10 transition-transform top-2"></div>

              {/* Envelope Back/Inside Color */}
              <div className="absolute inset-0 bg-pink-200 rounded-xl shadow-2xl z-0"></div>

              {/* Envelope Front Folds (The Body) */}
              <div className="absolute bottom-0 w-full h-full z-20 pointer-events-none">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 320 224" preserveAspectRatio="none">
                  {/* Left Triangle */}
                  <path d="M0,0 L160,130 L0,224 Z" fill="#fbcfe8" />
                  {/* Right Triangle */}
                  <path d="M320,0 L160,130 L320,224 Z" fill="#fbcfe8" />
                  {/* Bottom Triangle */}
                  <path d="M0,224 L160,130 L320,224 Z" fill="#f9a8d4" />
                </svg>
              </div>

              {/* Flap */}
              <div className="envelope-flap absolute top-0 w-full h-1/2 z-30 origin-top pointer-events-none">
                <svg className="w-full h-full overflow-visible drop-shadow-md" viewBox="0 0 320 112" preserveAspectRatio="none">
                  <path d="M0,0 L160,112 L320,0 Z" fill="#f472b6" />
                </svg>
              </div>

              {/* Cute Face (The Character) */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex flex-col items-center gap-1 transition-opacity duration-300">
                <div className="flex gap-8">
                  <div className="w-4 h-4 bg-gray-800 rounded-full animate-look"></div>
                  <div className="w-4 h-4 bg-gray-800 rounded-full animate-look"></div>
                </div>
                <div className="w-3 h-2 bg-transparent border-b-2 border-gray-800 rounded-full"></div>
              </div>


            </div>

            {!envelopeOpen && (
              <div className="text-center mt-16 space-y-2">
                <p className="text-pink-600 font-sans font-semibold tracking-wide uppercase text-sm opacity-80">You have one unread letter</p>
                <p className="text-xs text-pink-400 font-hand animate-pulse">(Tap to open)</p>
              </div>
            )}
          </div>

          {/* Actual Letter Content */}
          <div
            ref={letterRef}
            className="hidden fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-pink-50/30"
          >
            <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl max-w-lg w-full min-h-[500px] flex flex-col relative border-2 border-pink-100 rotate-1">
              {/* Paper Texture/Lines */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:100%_2rem]"></div>

              {!questionVisible ? (
                <div className="letter-text font-hand text-2xl md:text-3xl text-gray-700 space-y-8 flex-grow leading-loose relative z-10">
                  <p className="font-bold text-pink-500">Dear Trizia,</p>
                  <p>
                    I’ve been wanting to tell you this for a while.
                    Every time I see you, my world gets a little brighter.
                  </p>
                  <p>
                    I like your smile, your laugh, and everything about you.
                  </p>
                  <p>
                    So, I have an important question...
                  </p>
                </div>
              ) : (
                <div className="mt-8 pt-6 relative z-10 flex-grow flex flex-col justify-center animate-in fade-in zoom-in duration-500">
                  <h2 className="text-3xl md:text-4xl font-bold text-pink-500 font-sans text-center mb-10 drop-shadow-sm">
                    Will you be my Valentine?
                  </h2>
                  <div className="flex justify-center items-center gap-8 h-20 relative">
                    <button
                      ref={yesBtnRef}
                      className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold shadow-pink-200 shadow-xl transform transition-all hover:scale-110 active:scale-95 font-sans text-xl z-20"
                      onClick={handleYesClick}
                    >
                      Yes!
                    </button>

                    <button
                      ref={noBtnRef}
                      className="px-8 py-3 bg-white text-gray-500 border-2 border-gray-200 rounded-full font-bold shadow-sm font-sans text-xl transition-all cursor-pointer"
                      onMouseEnter={handleNoHover}
                      onTouchStart={handleNoHover}
                      onClick={(e) => { e.preventDefault(); handleNoHover(); }}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Celebration Screen */
        <div className="text-center space-y-6 z-50 p-8 max-w-md mx-4 animate-in fade-in zoom-in duration-700">
          <div className="flex justify-center mb-4">
            <img
              src={celebrationGif}
              alt="Celebration"
              className="w-64 h-64 object-contain filter drop-shadow-xl "
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-pink-600 font-sans drop-shadow-sm">Yay!</h1>
          <p className="text-3xl md:text-4xl text-pink-500 font-hand leading-relaxed">
            Best. Valentine. Ever.
          </p>
          <p className="text-xl text-gray-500 font-sans bg-white/50 py-2 px-4 rounded-full inline-block mt-4">
            See you soon! 💘
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
