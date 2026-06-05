import { useState, useEffect, useRef } from 'react';
import { draggable, dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { 
  Film, Camera, RotateCcw, HelpCircle, 
  Award, Play, BookOpen, X, 
  Hourglass, ChevronLeft, ChevronRight, Info
} from 'lucide-react';
import { allScenes } from './scenesData';
import type { Scene } from './scenesData';
import './App.css';

// Helper to convert index to Roman Numerals (1 to 31)
function getRomanNumeral(num: number): string {
  const tens = Math.floor(num / 10);
  const units = num % 10;
  let result = 'X'.repeat(tens);
  const unitMap = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
  result += unitMap[units];
  return result;
}

// ----------------------------------------------------
// SUB-COMPONENTS FOR DRAG & DROP
// ----------------------------------------------------

interface DraggableCardProps {
  scene: Scene;
  index: number;
  location: 'pool' | 'slot';
  onRemove?: () => void;
  onClick?: () => void;
}

function DraggableCard({ scene, index, location, onRemove, onClick }: DraggableCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Only make the card draggable if it is in the film strip slots
    if (location !== 'slot') return;

    const el = ref.current;
    if (!el) return;

    return draggable({
      element: el,
      getInitialData: () => ({ sceneId: scene.id, sourceLocation: location, sourceIndex: index }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [scene.id, index, location]);

  const handleCardClick = () => {
    if (location === 'pool' && onClick) {
      onClick();
    }
  };

  return (
    <div 
      ref={ref} 
      className={`scene-card ${isDragging ? 'is-dragging' : ''} ${location === 'pool' ? 'clickable-pool-card' : ''}`}
      title={location === 'pool' ? "Haz clic para añadir al siguiente slot libre" : scene.title}
      onClick={handleCardClick}
      style={{ cursor: location === 'pool' ? 'pointer' : 'grab' }}
    >
      <div className="scene-image-container">
        <img 
          src={`/${scene.filename}`} 
          alt={scene.title} 
          className="scene-card-img" 
          draggable={false}
        />
        <div className="scene-card-overlay">
          <span className="scene-card-title">{scene.title}</span>
        </div>
        
        {location === 'slot' && (
          <button 
            className="remove-card-btn" 
            onClick={(e) => {
              e.stopPropagation();
              if (onRemove) onRemove();
            }}
            title="Quitar escena"
          >
            <X size={10} />
          </button>
        )}
      </div>
    </div>
  );
}

interface FilmSlotProps {
  index: number;
  card: Scene | null;
  onRemove: () => void;
  validationStatus: 'correct' | 'incorrect' | null;
}

function FilmSlot({ index, card, onRemove, validationStatus }: FilmSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      getData: () => ({ targetLocation: 'slot', targetIndex: index }),
      onDragEnter: () => setIsDraggingOver(true),
      onDragLeave: () => setIsDraggingOver(false),
      onDrop: () => setIsDraggingOver(false),
    });
  }, [index]);

  return (
    <div
      ref={ref}
      className={`film-slot ${isDraggingOver ? 'is-dragging-over' : ''} ${
        validationStatus === 'correct' 
          ? 'verified-correct' 
          : validationStatus === 'incorrect' 
            ? 'verified-incorrect' 
            : ''
      }`}
    >
      <span className="film-slot-number">{getRomanNumeral(index + 1)}</span>
      <span className="film-slot-label">Slot {index + 1}</span>
      
      {card && (
        <DraggableCard 
          scene={card} 
          index={index} 
          location="slot" 
          onRemove={onRemove} 
        />
      )}
    </div>
  );
}



// ----------------------------------------------------
// MAIN APPLICATION
// ----------------------------------------------------

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [pool, setPool] = useState<Scene[]>(() => {
    return [...allScenes].sort(() => Math.random() - 0.5);
  });
  const [slots, setSlots] = useState<(Scene | null)[]>(() => Array(31).fill(null));
  const [validation, setValidation] = useState<('correct' | 'incorrect' | null)[]>(() => Array(31).fill(null));
  
  // Hints state (Exactly 3 hints total)
  const [hintsLeft, setHintsLeft] = useState(3);

  // Statistics
  const [moveCount, setMoveCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // UI states
  const [flashActive, setFlashActive] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [viewMode, setViewMode] = useState<'game' | 'glossary'>('game');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobileStatus = window.innerWidth < 768;
      setIsMobile(mobileStatus);
      if (mobileStatus) {
        setViewMode('game');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filmStripRef = useRef<HTMLDivElement>(null);

  // Scroll the film strip programmatically
  const scrollFilmStrip = (direction: 'left' | 'right') => {
    if (filmStripRef.current) {
      // scroll by a step suitable for mobile and desktop
      const scrollStep = direction === 'left' ? -240 : 240;
      filmStripRef.current.scrollBy({ left: scrollStep, behavior: 'smooth' });
    }
  };

  // Initialize all 31 scenes shuffled in the pool
  const initGame = () => {
    setValidation(Array(31).fill(null));
    
    // Shuffle the global scenes
    const shuffled = [...allScenes].sort(() => Math.random() - 0.5);

    setPool(shuffled);
    setSlots(Array(31).fill(null));
  };

  // Timer side-effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameStarted && !showVictoryModal) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, showVictoryModal]);



  // Click handler to automatically place negative cards into the first available slot
  const addCardToNextAvailableSlot = (scene: Scene) => {
    const firstEmptyIndex = slots.findIndex(s => s === null);
    if (firstEmptyIndex === -1) {
      alert("¡Todos los slots están llenos! Quita alguna escena antes de agregar más.");
      return;
    }

    setValidation(Array(31).fill(null));
    setMoveCount(m => m + 1);

    setSlots(prevSlots => {
      const nextSlots = [...prevSlots];
      nextSlots[firstEmptyIndex] = scene;
      return nextSlots;
    });

    setPool(prevPool => prevPool.filter(p => p.id !== scene.id));
  };

  // Monitor drag-and-drop globally (Slot to Slot only)
  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const sourceData = source.data as { sceneId: string; sourceLocation: 'slot'; sourceIndex: number };
        const destData = destination.data as { targetLocation: 'slot'; targetIndex: number };

        const { sourceIndex } = sourceData;
        const { targetIndex } = destData;

        if (sourceIndex === undefined || targetIndex === undefined) return;
        if (sourceIndex === targetIndex) return;

        setValidation(Array(31).fill(null));
        setMoveCount(m => m + 1);

        setSlots(prevSlots => {
          const nextSlots = [...prevSlots];
          const sourceItem = nextSlots[sourceIndex];
          const targetItem = nextSlots[targetIndex];

          nextSlots[sourceIndex] = targetItem;
          nextSlots[targetIndex] = sourceItem;

          return nextSlots;
        });
      }
    });
  }, [slots]);

  // Click handler to remove cards easily
  const removeCardFromSlot = (index: number) => {
    const card = slots[index];
    if (!card) return;

    setValidation(Array(31).fill(null));
    setSlots(prevSlots => {
      const nextSlots = [...prevSlots];
      nextSlots[index] = null;
      return nextSlots;
    });
    setPool(prevPool => {
      if (!prevPool.some(s => s.id === card.id)) {
        return [...prevPool, card];
      }
      return prevPool;
    });
  };

  // Verify chronology of all 31 scenes
  const verifyThread = () => {
    const hasEmpty = slots.some(s => s === null);
    if (hasEmpty) {
      alert("¡Coloca todas las 31 escenas en el rollo de película antes de verificar!");
      return;
    }

    // Camera flash effect
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 400);

    const nextValidation = slots.map((card, idx) => {
      const expectedScene = allScenes[idx];
      return card?.id === expectedScene.id ? 'correct' : 'incorrect';
    });

    setValidation(nextValidation);
    const isAllCorrect = nextValidation.every(v => v === 'correct');

    if (isAllCorrect) {
      setTimeout(() => {
        setShowVictoryModal(true);
      }, 500);
    }
  };

  // Autocomplete one scene in its correct slot (Limit to 3)
  const handleUseHint = () => {
    if (hintsLeft <= 0) return;

    // Find the first slot that is empty or incorrect
    let hintTargetSlotIndex = -1;
    for (let i = 0; i < 31; i++) {
      const expectedScene = allScenes[i];
      if (!slots[i] || slots[i]?.id !== expectedScene.id) {
        hintTargetSlotIndex = i;
        break;
      }
    }

    if (hintTargetSlotIndex === -1) return;

    const correctScene = allScenes[hintTargetSlotIndex];
    const currentSlotIndex = slots.findIndex(s => s?.id === correctScene.id);
    
    setValidation(Array(31).fill(null));
    setHintsLeft(h => h - 1);

    if (currentSlotIndex !== -1) {
      // Swapping slots
      setSlots(prevSlots => {
        const nextSlots = [...prevSlots];
        const targetCard = nextSlots[hintTargetSlotIndex];
        nextSlots[hintTargetSlotIndex] = correctScene;
        nextSlots[currentSlotIndex] = targetCard;
        return nextSlots;
      });
    } else {
      // Swapping pool with slot
      setSlots(prevSlots => {
        const nextSlots = [...prevSlots];
        const occupiedCard = nextSlots[hintTargetSlotIndex];
        nextSlots[hintTargetSlotIndex] = correctScene;

        setPool(prevPool => {
          let nextPool = prevPool.filter(s => s.id !== correctScene.id);
          if (occupiedCard) {
            nextPool = [...nextPool, occupiedCard];
          }
          return nextPool;
        });

        return nextSlots;
      });
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setValidation(Array(31).fill(null));
    setSlots(Array(31).fill(null));
    setMoveCount(0);
    setElapsedTime(0);
    setHintsLeft(3);
    setShowVictoryModal(false);
    setViewMode('game');
    initGame();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isMobile && !gameStarted) {
    return (
      <div className="modal-overlay">
        <div className="modal-content" style={{ maxWidth: '600px' }}>
          <div className="modal-icon">
            <Film size={28} />
          </div>
          <h1 className="app-subtitle">LA VENTANA INDISCRETA</h1>
          <h2 className="modal-title" style={{ fontFamily: 'var(--heading)' }}>Hilo Narrativo</h2>
          <p className="modal-text">
            El fotógrafo L.B. Jefferies observa a sus vecinos de Greenwich Village desde su silla de ruedas. Sospecha que Lars Thorwald ha asesinado a su esposa.
            <br /><br />
            Las 31 escenas de esta intriga están desordenadas en tu mesa de negativos. Tu misión es arrastrarlas y colocarlas secuencialmente en el rollo de película.
          </p>

          <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.25)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '24px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Reglas del juego:</span>
            <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)' }}>
              <li>Monta la película ordenando cronológicamente las 31 escenas.</li>
              <li>Tienes un límite de <strong>3 pistas</strong> para autocompletar escenas complicadas.</li>
              <li>Verifica tu secuencia para descubrir qué fotogramas coinciden.</li>
            </ul>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ margin: '0 auto', fontSize: '1rem', width: 'auto', padding: '12px 28px' }}
            onClick={() => setGameStarted(true)}
          >
            <Play size={16} />
            Iniciar Investigación
          </button>
        </div>
      </div>
    );
  }

  const renderDesktopQRView = () => {
    const currentUrl = window.location.href;
    return (
      <div className="desktop-qr-container">
        <div className="desktop-qr-card">
          <div className="qr-camera-lens">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=d4af37&bgcolor=12141c&data=${encodeURIComponent(currentUrl)}`} 
              alt="Código QR del Juego" 
              className="qr-code-img"
            />
          </div>
          <div className="desktop-qr-content">
            <h2 className="desktop-qr-title">Experiencia de Montaje Móvil</h2>
            <p className="desktop-qr-text">
              Esta investigación está optimizada exclusivamente para dispositivos móviles y pantallas táctiles (Mobile-First).
            </p>
            <div className="desktop-qr-instructions">
              <div className="qr-step">
                <span className="qr-step-num">1</span>
                <span>Abre la cámara de tu celular.</span>
              </div>
              <div className="qr-step">
                <span className="qr-step-num">2</span>
                <span>Escanea el código QR de la lente.</span>
              </div>
              <div className="qr-step">
                <span className="qr-step-num">3</span>
                <span>Comienza a ordenar las 31 escenas.</span>
              </div>
            </div>
            <a href={currentUrl} className="desktop-link-fallback" target="_blank" rel="noreferrer">
              O haz clic aquí para abrir el enlace
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`shutter-flash ${flashActive ? 'flash-active' : ''}`} />

      <header className="app-header">
        <p className="app-subtitle">LA VENTANA INDISCRETA</p>
        <h1 className="app-title">El Hilo Narrativo</h1>
        <p className="app-description">
          Reconstruye el montaje cinematográfico de Alfred Hitchcock ordenando las 31 escenas del misterio.
        </p>
      </header>

      {/* Navigation and Global Controls */}
      <div style={{ display: 'flex', gap: '8px', width: '100%', marginBottom: '20px', justifyContent: 'flex-end' }}>
        {!isMobile ? (
          <>
            <button 
              className={`btn ${viewMode === 'game' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('game')}
              style={{ flex: 1 }}
            >
              <Film size={16} />
              Mesa de Montaje
            </button>
            <button 
              className={`btn ${viewMode === 'glossary' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('glossary')}
              style={{ flex: 1 }}
            >
              <BookOpen size={16} />
              Glosario de Escenas (31)
            </button>
            <button className="btn btn-danger" onClick={resetGame} style={{ flex: '0 0 auto' }} title="Reiniciar Juego">
              <RotateCcw size={16} />
            </button>
          </>
        ) : (
          <button className="btn btn-danger" onClick={resetGame} style={{ width: 'auto', marginLeft: 'auto' }}>
            <RotateCcw size={14} />
            Reiniciar Investigación
          </button>
        )}
      </div>

      {viewMode === 'game' ? (
        isMobile ? (
        <div className="game-layout">
          <main>
            {/* Film Strip Timeline Wrapper with buttons */}
            <div className="film-strip-wrapper">
              <button 
                className="film-scroll-btn left" 
                onClick={() => scrollFilmStrip('left')}
                title="Scroll Izquierda"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="film-strip" ref={filmStripRef}>
                {slots.map((card, idx) => (
                  <FilmSlot
                    key={`slot-${idx}`}
                    index={idx}
                    card={card}
                    onRemove={() => removeCardFromSlot(idx)}
                    validationStatus={validation[idx]}
                  />
                ))}
              </div>

              <button 
                className="film-scroll-btn right" 
                onClick={() => scrollFilmStrip('right')}
                title="Scroll Derecha"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Unsorted Pool Section */}
            <div className="pool-section">
              <div className="pool-header">
                <h2 className="pool-title">
                  <Film size={18} className="gold" />
                  Mesa de Negativos
                </h2>
                <span className="pool-counter">{pool.length} restantes</span>
              </div>
              
              <div className="pool-container">
                {pool.map((scene, idx) => (
                  <div key={scene.id} className="pool-card-wrapper">
                    <DraggableCard 
                      scene={scene} 
                      index={idx} 
                      location="pool" 
                      onClick={() => addCardToNextAvailableSlot(scene)}
                    />
                  </div>
                ))}
                {pool.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '100px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    ¡Has ubicado todos los fotogramas! Haz clic en Verificar Hilo.
                  </div>
                )}
              </div>
            </div>

            {/* Verification and Hint Buttons */}
            <div className="action-controls">
              <button 
                className="btn btn-secondary" 
                onClick={handleUseHint}
                disabled={hintsLeft <= 0 || slots.every((s, i) => s?.id === allScenes[i].id)}
              >
                <HelpCircle size={16} />
                Pista ({hintsLeft} restantes)
              </button>
              
              <button 
                className="btn btn-primary"
                onClick={verifyThread}
                disabled={slots.some(s => s === null)}
              >
                <Camera size={16} />
                Verificar Hilo
              </button>
            </div>
          </main>

          {/* Sidebar (Stacked on mobile, side-by-side on desktop) */}
          <aside className="sidebar">
            <section className="info-card">
              <h2 className="info-card-title">
                <Hourglass size={16} className="gold" />
                Estadísticas
              </h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-label">Tiempo</div>
                  <div className="stat-value gold">{formatTime(elapsedTime)}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Movimientos</div>
                  <div className="stat-value">{moveCount}</div>
                </div>
              </div>
            </section>

            <section className="info-card">
              <h2 className="info-card-title">
                <Info size={16} className="gold" />
                Instrucciones
              </h2>
              <ul className="instructions-list">
                <li>
                  <span className="instruction-num">1</span>
                  <span>Haz <strong>clic</strong> en los negativos para colocarlos secuencialmente en el rollo de película.</span>
                </li>
                <li>
                  <span className="instruction-num">2</span>
                  <span><strong>Arrastra</strong> los fotogramas en el rollo de película para intercambiar posiciones y ordenarlos.</span>
                </li>
                <li>
                  <span className="instruction-num">3</span>
                  <span>Pulsa <strong>Verificar Hilo</strong> para validar. Los correctos brillarán en verde, los incorrectos temblarán en rojo.</span>
                </li>
              </ul>
            </section>
            </aside>
          </div>
        ) : (
          renderDesktopQRView()
        )
      ) : (
        /* Glossary Reference Panel */
        <div style={{ backgroundColor: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
            <h2 style={{ fontFamily: 'var(--heading)', fontSize: '1.5rem', color: '#fff' }}>Glosario Narrativo</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              La secuencia exacta de las 31 escenas de la obra de Alfred Hitchcock.
            </p>
          </div>

          <div className="glossary-grid">
            {allScenes.map((scene, index) => (
              <div key={scene.id} className="glossary-card">
                <div className="glossary-image-wrapper">
                  <img 
                    src={`/${scene.filename}`} 
                    alt={scene.title} 
                    className="glossary-card-img"
                  />
                </div>
                <div className="glossary-card-content">
                  <span className="glossary-card-num">Escena {index + 1}</span>
                  <h3 className="glossary-card-title">{scene.title}</h3>
                  <p className="glossary-card-desc">{scene.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Victory Modal */}
      {showVictoryModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ border: '2px solid var(--accent-gold)' }}>
            <div className="modal-icon" style={{ background: 'rgba(212, 175, 55, 0.2)' }}>
              <Award size={28} />
            </div>
            <h2 className="modal-title" style={{ fontFamily: 'var(--heading)' }}>¡Investigación Resuelta!</h2>
            <p className="modal-text">
              ¡Excelente trabajo de montaje! Has ordenado las 31 escenas de <strong>La Ventana Indiscreta</strong> en el hilo conductor cronológico original de la obra maestra. Lars Thorwald ha sido atrapado gracias a tu secuencia temporal de pruebas.
            </p>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>Informe de Investigación</h3>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Tiempo</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>{formatTime(elapsedTime)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Movimientos</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>{moveCount}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowVictoryModal(false);
                  setViewMode('glossary');
                }}
                style={{ flex: 1 }}
              >
                Glosario
              </button>
              <button className="btn btn-primary" onClick={resetGame} style={{ flex: 1 }}>
                Volver a Jugar
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <div>
          Juego interactivo inspirado en la obra de <strong>Alfred Hitchcock</strong>.
        </div>
        <div>
          Desarrollado con <a href="https://atlassian.design/components/pragmatic-drag-and-drop/" target="_blank" rel="noreferrer">Pragmatic Drag and Drop</a> y React.
        </div>
      </footer>
    </>
  );
}
