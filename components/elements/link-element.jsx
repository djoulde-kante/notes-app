"use client"

import { useState, useEffect } from "react"
import { translations } from "@/lib/translations"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LinkElement({ element, isSelected, readOnly, updateElement, isValidYoutubeUrl }) {
  const [url, setUrl] = useState(element.url)
  const [error, setError] = useState("")

  useEffect(() => {
    setUrl(element.url)
  }, [element.url])

  const handleUrlChange = (e) => {
    setUrl(e.target.value)
    setError("")
  }

  const handleUrlBlur = () => {
    if (url && !url.startsWith("http")) {
      const newUrl = `https://${url}`
      setUrl(newUrl)
      updateElement(element.id, { url: newUrl })
    } else {
      updateElement(element.id, { url })
    }
  }

  // Extraire l'ID de la vidéo YouTube
  const getYoutubeVideoId = (url) => {
    if (!url) return null

    let videoId = null

    // Format: youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/)
    if (watchMatch) {
      videoId = watchMatch[1]
    }

    // Format: youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
    if (shortMatch) {
      videoId = shortMatch[1]
    }

    return videoId
  }

  const youtubeVideoId = getYoutubeVideoId(url)
  const isYoutubeUrl = isValidYoutubeUrl(url)

  return (
    <div className="min-w-[200px]">
      {readOnly ? (
        <>
          {url ? (
            isYoutubeUrl && youtubeVideoId ? (
              <div className="w-full max-w-[320px]">
                <iframe
                  width="100%"
                  height="180"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {url}
              </a>
            )
          ) : (
            <span className="text-muted-foreground">{translations.editor.linkPlaceholder}</span>
          )}
        </>
      ) : (
        <>
          <Input
            value={url}
            onChange={handleUrlChange}
            onBlur={handleUrlBlur}
            placeholder={translations.editor.linkPlaceholder}
            className="mb-2"
          />

          {error && (
            <Alert variant="destructive" className="mb-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {url && isYoutubeUrl && youtubeVideoId && (
            <div className="w-full max-w-[320px] mt-2">
              <iframe
                width="100%"
                height="180"
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {url && !isYoutubeUrl && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block mt-2">
              {url}
            </a>
          )}
        </>
      )}
    </div>
  )
}
