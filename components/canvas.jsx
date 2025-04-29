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
      setDragOffset({
        x: clientX - element.position.x,
        y: clientY - element.position.y,
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
    <div className="flex flex-col h-full">
      {!readOnly && (
        <div className="flex gap-2 mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un élément
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="grid gap-2">
                <Button variant="ghost" onClick={addTextElement}>
                  <Type className="h-4 w-4 mr-2" />
                  {translations.editor.addText}
                </Button>
                <Button variant="ghost" onClick={addLinkElement}>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  {translations.editor.addLink}
                </Button>
                <Button variant="ghost" onClick={addImageElement}>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  {translations.editor.addImage}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      <div ref={canvasRef} className="relative border rounded-lg bg-white min-h-[500px] w-full overflow-hidden">
        {elements.map((element) => {
          const isSelected = selectedElement === element.id

          return (
            <div
              key={element.id}
              className={`absolute ${!readOnly && isSelected ? "ring-2 ring-primary" : ""}`}
              style={{
                left: `${element.position.x}px`,
                top: `${element.position.y}px`,
              }}
              onClick={() => !readOnly && setSelectedElement(element.id)}
            >
              {!readOnly && isSelected && (
                <div className="absolute -top-8 right-0 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 bg-background shadow-sm"
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      handleDragStart(e, element.id, e.clientX, e.clientY)
                    }}
                    onTouchStart={(e) => {
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
                    className="h-6 w-6 bg-background shadow-sm"
                    onClick={(e) => {
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
                <LinkElement
                  element={element}
                  isSelected={isSelected}
                  readOnly={readOnly}
                  updateElement={updateElement}
                  isValidYoutubeUrl={isValidYoutubeUrl}
                />
              )}

              {element.type === "image" && (
                <ImageElement
                  element={element}
                  isSelected={isSelected}
                  readOnly={readOnly}
                  updateElement={updateElement}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
