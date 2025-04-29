"use client"

import { useState, useRef, useEffect } from "react"
import { translations } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Type, LinkIcon, ImageIcon, Plus, X, Move } from "lucide-react"
import TextElement from "@/components/elements/text-element"
import LinkElement from "@/components/elements/link-element"
import ImageElement from "@/components/elements/image-element"

export default function Canvas({ elements = [], setElements, readOnly = false }) {
  const [selectedElement, setSelectedElement] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef(null)

  // Fonction pour ajouter un nouvel élément texte
  const addTextElement = () => {
    const newElement = {
      id: Date.now().toString(),
      type: "text",
      content: "",
      position: { x: 50, y: 50 },
      style: {
        fontWeight: "normal",
        fontStyle: "normal",
        fontSize: 16,
        color: "#000000",
      },
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
  }

  // Fonction pour ajouter un nouvel élément lien
  const addLinkElement = () => {
    const newElement = {
      id: Date.now().toString(),
      type: "link",
      url: "",
      position: { x: 50, y: 50 },
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
  }

  // Fonction pour ajouter un nouvel élément image
  const addImageElement = () => {
    const newElement = {
      id: Date.now().toString(),
      type: "image",
      src: "",
      position: { x: 50, y: 50 },
      size: { width: 200, height: 150 },
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
  }

  // Fonction pour mettre à jour un élément
  const updateElement = (id, updates) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, ...updates } : el)))
  }

  // Fonction pour supprimer un élément
  const deleteElement = (id) => {
    setElements(elements.filter((el) => el.id !== id))
    setSelectedElement(null)
  }

  // Gestionnaire de début de glissement
  const handleDragStart = (e, id, clientX, clientY) => {
    if (readOnly) return

    setSelectedElement(id)
    setIsDragging(true)

    const element = elements.find((el) => el.id === id)
    if (element) {
      // On récupère la position du curseur à l'intérieur de l'élément (en tenant compte du padding)
      const elemRect = e.target.getBoundingClientRect();
      const padding = 16; // même valeur que dans le style
      setDragOffset({
        x: clientX - elemRect.left + padding,
        y: clientY - elemRect.top + padding
      })
    }
  }

  // Gestionnaire de glissement
  const handleDrag = (clientX, clientY) => {
    if (!isDragging || readOnly) return

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const x = Math.max(0, clientX - canvasRect.left - dragOffset.x)
    const y = Math.max(0, clientY - canvasRect.top - dragOffset.y)

    updateElement(selectedElement, {
      position: { x, y },
    })
  }

  // Gestionnaire de fin de glissement
  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Gestionnaires d'événements tactiles et souris
  useEffect(() => {
    const handleMouseMove = (e) => {
      handleDrag(e.clientX, e.clientY)
    }

    const handleMouseUp = () => {
      handleDragEnd()
    }

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        handleDrag(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleTouchEnd = () => {
      handleDragEnd()
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging])

  // Fonction pour valider une URL YouTube
  const isValidYoutubeUrl = (url) => {
    return url.includes("youtube.com/watch") || url.includes("youtu.be/")
  }

  return (
    <div className="flex flex-col h-full relative">
      {!readOnly && (
        <div className="absolute right-6 top-2 flex gap-2 z-20">
          <Button variant="ghost" size="icon" aria-label="Ajouter texte" style={{background:'rgba(255,255,255,0.22)'}} onClick={() => {
            const newElement = {
              id: Date.now().toString(),
              type: "text",
              content: "",
              position: { x: 80, y: 80 },
              style: { fontWeight: "normal", fontStyle: "normal", fontSize: 16, color: "#000" }
            };
            setElements([...elements, newElement]);
          }}><span style={{fontWeight:600, color:'#4f8cff', fontSize:'1.15rem'}}>A</span></Button>
          <Button variant="ghost" size="icon" aria-label="Ajouter image" style={{background:'rgba(255,255,255,0.22)'}} onClick={() => {
            const newElement = {
              id: Date.now().toString(),
              type: "image",
              src: "",
              position: { x: 120, y: 120 },
              size: { width: 200, height: 150 }
            };
            setElements([...elements, newElement]);
          }}><span role="img" aria-label="image" style={{fontSize:'1.13rem', color:'#4f8cff'}}>🖼️</span></Button>
          <Button variant="ghost" size="icon" aria-label="Ajouter lien" style={{background:'rgba(255,255,255,0.22)'}} onClick={() => {
            const newElement = {
              id: Date.now().toString(),
              type: "link",
              url: "",
              position: { x: 160, y: 160 }
            };
            setElements([...elements, newElement]);
          }}><span role="img" aria-label="lien" style={{fontSize:'1.13rem', color:'#4f8cff'}}>🔗</span></Button>
        </div>
      )}

      <div ref={canvasRef} className="relative border rounded-lg bg-white min-h-[500px] w-full overflow-hidden">
        {elements.map((element) => {
          const isSelected = selectedElement === element.id

          return (
            <div
              key={element.id}
              tabIndex={!readOnly ? 0 : undefined}
              aria-label={element.type === 'text' ? 'Élément texte' : element.type === 'image' ? 'Élément image' : 'Élément lien'}
              className={`absolute group transition-transform duration-150 ${!readOnly && isSelected ? "ring-2 ring-primary z-30 scale-105 shadow-2xl" : "z-10"} ${isDragging && selectedElement === element.id ? "scale-110 shadow-2xl" : ""}`}
              style={{
                left: `${element.position.x}px`,
                top: `${element.position.y}px`,
                cursor: !readOnly ? (isDragging && selectedElement === element.id ? "grabbing" : "move") : "default",
                boxShadow: "0 4px 24px #b993f840, 0 1.5px 4px #b993f822",
                borderRadius: 18,
                background: "#fff",
                minWidth: 120,
                minHeight: 36,
                outline: isSelected ? "2px solid #7c3aed" : "none",
                transition: "box-shadow 0.18s, transform 0.18s, outline 0.18s, left 0.13s cubic-bezier(.4,1,.7,1), top 0.13s cubic-bezier(.4,1,.7,1)",
                padding: '16px'
              }}
              onClick={() => !readOnly && setSelectedElement(element.id)}
              onMouseDown={e => {
                if (!readOnly && e.button === 0 && !e.target.closest('.canvas-action-btn')) {
                  handleDragStart(e, element.id, e.clientX, e.clientY)
                }
              }}
              onTouchStart={e => {
                if (!readOnly && e.touches.length > 0 && !e.target.closest('.canvas-action-btn')) {
                  handleDragStart(e, element.id, e.touches[0].clientX, e.touches[0].clientY)
                }
              }}
              onKeyDown={e => {
                if (!readOnly && (e.key === 'Enter' || e.key === ' ')) setSelectedElement(element.id)
              }}
            >
              {!readOnly && isSelected && (
                <div className="absolute -top-8 right-0 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 bg-background shadow-sm canvas-action-btn"
                    title="Déplacer"
                    aria-label="Déplacer"
                    style={{cursor:'grab'}}
                    onMouseDown={e => {
                      e.stopPropagation()
                      handleDragStart(e, element.id, e.clientX, e.clientY)
                    }}
                    onTouchStart={e => {
                      e.stopPropagation()
                      if (e.touches.length > 0) {
                        handleDragStart(e, element.id, e.touches[0].clientX, e.touches[0].clientY)
                      }
                    }}
                  >
                    <Move className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 bg-background shadow-sm canvas-action-btn"
                    title="Supprimer"
                    aria-label="Supprimer"
                    style={{cursor:'pointer'}}
                    onClick={e => {
                      e.stopPropagation()
                      deleteElement(element.id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              {element.type === "text" && (
                <TextElement
                  element={element}
                  isSelected={isSelected}
                  readOnly={readOnly}
                  updateElement={updateElement}
                />
              )}
              {element.type === "link" && (
                <div style={{pointerEvents: isDragging && selectedElement === element.id ? 'none' : 'auto'}}>
                  <LinkElement
                    element={element}
                    isSelected={isSelected}
                    readOnly={readOnly}
                    updateElement={updateElement}
                    isValidYoutubeUrl={isValidYoutubeUrl}
                  />
                </div>
              )}
              {element.type === "image" && (
                <ImageElement
                  element={element}
                  isSelected={isSelected}
                  readOnly={readOnly}
                  updateElement={updateElement}
                  isDragging={isDragging && selectedElement === element.id}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
