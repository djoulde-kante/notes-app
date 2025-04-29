"use client"

import { useState, useEffect, useRef } from "react"
import { translations } from "@/lib/translations"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageIcon, Upload } from "lucide-react"

export default function ImageElement({ element, isSelected, readOnly, updateElement, isDragging }) {
  const [src, setSrc] = useState(element.src)
  const [error, setError] = useState("")
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 })
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 })
  const fileInputRef = useRef(null)

  useEffect(() => {
    setSrc(element.src)
  }, [element.src])

  const handleSrcChange = (e) => {
    setSrc(e.target.value)
    setError("")
  }

  const handleSrcBlur = () => {
    updateElement(element.id, { src })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(translations.editor.imageTooBig)
      return
    }

    // Vérifier le type de fichier (jpg/png)
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError(translations.editor.invalidImageType)
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const newSrc = event.target.result
      setSrc(newSrc)
      updateElement(element.id, { src: newSrc })
    }
    reader.readAsDataURL(file)
  }

  // Gestionnaire de début de redimensionnement
  const handleResizeStart = (e) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({ x: e.clientX, y: e.clientY })
    setInitialSize({ width: element.size.width, height: element.size.height })
  }

  // Gestionnaire de redimensionnement
  const handleResize = (e) => {
    if (!isResizing) return

    const deltaX = e.clientX - resizeStart.x
    const deltaY = e.clientY - resizeStart.y

    const newWidth = Math.max(50, initialSize.width + deltaX)
    const newHeight = Math.max(50, initialSize.height + deltaY)

    updateElement(element.id, {
      size: { width: newWidth, height: newHeight },
    })
  }

  // Gestionnaire de fin de redimensionnement
  const handleResizeEnd = () => {
    setIsResizing(false)
  }

  // Gestionnaires d'événements tactiles et souris pour le redimensionnement
  useEffect(() => {
    const handleMouseMove = (e) => {
      handleResize(e)
    }

    const handleMouseUp = () => {
      handleResizeEnd()
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing])

  return (
    <div
      className="relative"
      style={{
        width: `${element.size?.width || 200}px`,
        height: `${element.size?.height || 150}px`,
      }}
    >
      {readOnly ? (
        src ? (
          <img src={src || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )
      ) : (
        <>
          {src ? (
            <div className="relative w-full h-full">
              <img src={src || "/placeholder.svg"} alt="" className="w-full h-full object-cover" style={isDragging ? {pointerEvents:'none'} : {}} />
              {isSelected && (
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 bg-primary cursor-se-resize"
                  onMouseDown={handleResizeStart}
                ></div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted p-4">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Télécharger une image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="text-xs text-muted-foreground text-center">JPG ou PNG, max 5MB</span>
            </div>
          )}

          {isSelected && src && (
            <div className="absolute -bottom-10 left-0 right-0 flex gap-2">
              <Input
                value={src}
                onChange={handleSrcChange}
                onBlur={handleSrcBlur}
                placeholder="URL de l'image"
                className="text-xs h-8"
              />
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  )
}
