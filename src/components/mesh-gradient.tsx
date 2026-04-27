"use client"

import { useEffect, useRef } from "react"

export function MeshGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const createGradient = (x: number, y: number, time: number) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 800)
      
      const hue1 = (time * 0.5) % 360
      const hue2 = (time * 0.3 + 120) % 360
      const hue3 = (time * 0.7 + 240) % 360
      
      gradient.addColorStop(0, `hsla(${hue1}, 70%, 50%, 0.3)`)
      gradient.addColorStop(0.5, `hsla(${hue2}, 60%, 40%, 0.2)`)
      gradient.addColorStop(1, `hsla(${hue3}, 80%, 30%, 0.1)`)
      
      return gradient
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      
      // Create multiple animated gradients
      const gradient1 = createGradient(
        centerX + Math.sin(time * 0.001) * 200,
        centerY + Math.cos(time * 0.001) * 200,
        time
      )
      
      const gradient2 = createGradient(
        centerX + Math.sin(time * 0.001 + 2) * 300,
        centerY + Math.cos(time * 0.001 + 2) * 300,
        time + 100
      )
      
      const gradient3 = createGradient(
        centerX + Math.sin(time * 0.001 + 4) * 250,
        centerY + Math.cos(time * 0.001 + 4) * 250,
        time + 200
      )
      
      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = gradient3
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      time += 1
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)" }}
    />
  )
}
