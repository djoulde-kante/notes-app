"use client"

import { useState, useEffect } from "react"
import { translations } from "@/lib/translations"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Bold, Italic, Type } from "lucide-react"

export default function TextElement({ element, isSelected, readOnly, updateElement }) {
  const [content, setContent] = useState(element.content)

  useEffect(() => {
    setContent(element.content)
  }, [element.content])

  const handleContentChange = (e) => {
    setContent(e.target.value)
  }

  const handleContentBlur = () => {
    updateElement(element.id, { content })
  }

  const toggleBold = () => {
    updateElement(element.id, {
      style: {
        ...element.style,
        fontWeight: element.style.fontWeight === "bold" ? "normal" : "bold",
      },
    })
  }

  const toggleItalic = () => {
    updateElement(element.id, {
      style: {
        ...element.style,
        fontStyle: element.style.fontStyle === "italic" ? "normal" : "italic",
      },
    })
  }

  const changeFontSize = (value) => {
    updateElement(element.id, {
      style: {
        ...element.style,
        fontSize: value[0],
      },
    })
  }

  const changeColor = (color) => {
    updateElement(element.id, {
      style: {
        ...element.style,
        color,
      },
    })
  }

  return (
    <div className="min-w-[100px]">
      {readOnly ? (
        <div
          style={{
            fontWeight: element.style.fontWeight,
            fontStyle: element.style.fontStyle,
            fontSize: `${element.style.fontSize}px`,
            color: element.style.color,
          }}
        >
          {content || translations.editor.textPlaceholder}
        </div>
      ) : (
        <>
          <Textarea
            value={content}
            onChange={handleContentChange}
            onBlur={handleContentBlur}
            placeholder={translations.editor.textPlaceholder}
            className="min-h-[60px] resize-none border-none focus-visible:ring-0 p-0"
            style={{
              fontWeight: element.style.fontWeight,
              fontStyle: element.style.fontStyle,
              fontSize: `${element.style.fontSize}px`,
              color: element.style.color,
            }}
          />

          {isSelected && (
            <div className="flex items-center gap-1 mt-2">
              <Button
                variant={element.style.fontWeight === "bold" ? "default" : "outline"}
                size="icon"
                className="h-7 w-7"
                onClick={toggleBold}
              >
                <Bold className="h-3 w-3" />
              </Button>
              <Button
                variant={element.style.fontStyle === "italic" ? "default" : "outline"}
                size="icon"
                className="h-7 w-7"
                onClick={toggleItalic}
              >
                <Italic className="h-3 w-3" />
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="h-7 w-7">
                    <Type className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{translations.editor.textSize}</span>
                        <span className="text-sm text-muted-foreground">{element.style.fontSize}px</span>
                      </div>
                      <Slider
                        defaultValue={[element.style.fontSize]}
                        min={10}
                        max={36}
                        step={1}
                        onValueChange={changeFontSize}
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm font-medium">{translations.editor.textColor}</span>
                      <div className="flex flex-wrap gap-2">
                        {["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"].map((color) => (
                          <div
                            key={color}
                            className={`h-6 w-6 rounded-full cursor-pointer ${
                              element.style.color === color ? "ring-2 ring-primary ring-offset-2" : ""
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => changeColor(color)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </>
      )}
    </div>
  )
}
