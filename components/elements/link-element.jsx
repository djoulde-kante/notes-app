"use client"

import { useState, useEffect } from "react"
import { translations } from "@/lib/translations"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRef } from "react"


export default function LinkElement({ element, isSelected, readOnly, updateElement, isValidYoutubeUrl }) {
  const [showModal, setShowModal] = useState(!element.url)
  const [pendingUrl, setPendingUrl] = useState(element.url || "")
  const [pendingText, setPendingText] = useState(element.text || "")
  const [error, setError] = useState("")
  const urlInputRef = useRef(null)

  useEffect(() => {
    if (showModal && urlInputRef.current) {
      urlInputRef.current.focus()
    }
  }, [showModal])

  useEffect(() => {
    setPendingUrl(element.url || "")
    setPendingText(element.text || "")
  }, [element.url, element.text])

  const handleOpenModal = () => {
    setPendingUrl(element.url || "")
    setPendingText(element.text || "")
    setShowModal(true)
  }
  const handleCancel = () => {
    setShowModal(false)
    setError("")
  }
  const handleAdd = () => {
    if (!pendingUrl) {
      setError(translations.common.required)
      return
    }
    let newUrl = pendingUrl
    if (!newUrl.startsWith("http")) newUrl = `https://${newUrl}`
    updateElement(element.id, { url: newUrl, text: pendingText })
    setShowModal(false)
    setError("")
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

  const url = element.url;
  const text = element.text;
  const youtubeVideoId = getYoutubeVideoId(url);
  const isYoutubeUrl = isValidYoutubeUrl(url);

  return (
    <div className="min-w-[200px]">
      {/* MODALE POPUP POUR AJOUT/EDITION */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" style={{pointerEvents:'auto'}}>
          {/* Overlay qui bloque l'interaction avec le canvas */}
          <div style={{position:'fixed', inset:0, zIndex:49, pointerEvents:'auto'}}></div>
          <div
            className="rounded-2xl shadow-2xl bg-white px-8 py-7 w-full max-w-md relative animate-fade-in"
            style={{
              backdropFilter:'blur(2px)',
              pointerEvents:'auto',
              userSelect:'auto',
              minWidth: 340,
              maxWidth: 420,
              boxSizing: 'border-box',
              transition:'none',
              willChange:'auto'
            }}
            onMouseDown={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
            onDragStart={e => e.preventDefault()}
          >
            <h2 className="text-xl font-bold mb-5 text-primary">Ajouter un lien</h2>
            <label className="block text-sm font-medium mb-1">URL</label>
            <Input
              ref={urlInputRef}
              value={pendingUrl}
              onChange={e => { setPendingUrl(e.target.value); setError(""); }}
              placeholder="https://..."
              className="mb-3"
            />
            <label className="block text-sm font-medium mb-1">Texte du lien (optionnel)</label>
            <Input
              value={pendingText}
              onChange={e => setPendingText(e.target.value)}
              placeholder="Mon inspiration"
              className="mb-5"
            />
            {error && <div className="text-red-500 mb-3 text-sm">{error}</div>}
            <div className="flex gap-4 justify-end mt-2">
              <button className="rounded-full px-6 py-2 font-bold text-white" style={{background:'linear-gradient(90deg,#4f8cff,#7c3aed)'}} onClick={handleAdd}>Ajouter</button>
              <button className="rounded-full px-6 py-2 font-bold text-white" style={{background:'linear-gradient(90deg,#a18cd1,#fbc2eb)'}} onClick={handleCancel}>Annuler</button>
            </div>
          </div>
        </div>
      )}
      {/* AFFICHAGE NORMAL */}
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
              style={{borderRadius:12, background:'#000'}}
            ></iframe>
          </div>
        ) : (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-base font-medium" style={{wordBreak:'break-all'}}>
            {text ? text : url}
          </a>
        )
      ) : (
        !readOnly && (
          <button className="rounded-lg px-4 py-2 bg-primary text-white font-bold" onClick={handleOpenModal}>
            + Ajouter un lien
          </button>
        )
      )}
      {/* BOUTON POUR MODIFIER LE LIEN (sauf YouTube) */}
      {!readOnly && url && !(isYoutubeUrl && youtubeVideoId) && (
        <button className="ml-2 text-xs text-blue-600 underline" onClick={handleOpenModal}>Modifier</button>
      )}
    </div>
  )
}
