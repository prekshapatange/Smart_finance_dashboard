import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function HarryPotterBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    /* ================= SCENE ================= */
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x050510, 0.025)

    /* ================= CAMERA ================= */
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 14)

    /* ================= RENDERER ================= */
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mountRef.current.appendChild(renderer.domElement)

    /* ================= STAR FIELD ================= */
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 6000
    const positions = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 300
      positions[i3 + 1] = (Math.random() - 0.5) * 300
      positions[i3 + 2] = -Math.random() * 300
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    const starMaterial = new THREE.PointsMaterial({
      color: 0xb9a6ff,
      size: 0.12,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    /* ================= MAGIC DUST ================= */
    const dustGeometry = new THREE.BufferGeometry()
    const dustCount = 4000
    const dustPositions = new Float32Array(dustCount * 3)

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3
      dustPositions[i3] = (Math.random() - 0.5) * 80
      dustPositions[i3 + 1] = (Math.random() - 0.5) * 80
      dustPositions[i3 + 2] = (Math.random() - 0.5) * 80
    }

    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3))

    const dustMaterial = new THREE.PointsMaterial({
      color: 0xffd28a,
      size: 0.18,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const dust = new THREE.Points(dustGeometry, dustMaterial)
    scene.add(dust)

    /* ================= LIGHTING ================= */
    scene.add(new THREE.AmbientLight(0x8b5cf6, 0.35))

    const pointLight = new THREE.PointLight(0xffcc88, 1.2, 60)
    pointLight.position.set(0, 0, 20)
    scene.add(pointLight)

    /* ================= ANIMATION ================= */
    const clock = new THREE.Clock()

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      /* star depth motion */
      const starPos = starGeometry.attributes.position.array as Float32Array
      for (let i = 0; i < starCount; i++) {
        const z = i * 3 + 2
        starPos[z] += 0.25
        if (starPos[z] > 20) starPos[z] = -300
      }
      starGeometry.attributes.position.needsUpdate = true

      /* dust swirl */
      dust.rotation.y += 0.0015
      dust.rotation.x += 0.0008

      /* slow cinematic drift */
      scene.rotation.y += 0.0003
      scene.rotation.x += 0.0001

      /* subtle camera breathing */
      camera.position.x = Math.sin(time * 0.1) * 0.6
      camera.position.y = Math.cos(time * 0.08) * 0.4
      camera.position.z = 14 + Math.sin(time * 0.05) * 0.5
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    animate()

    /* ================= RESIZE ================= */
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    /* ================= CLEANUP ================= */
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      starGeometry.dispose()
      starMaterial.dispose()
      dustGeometry.dispose()
      dustMaterial.dispose()
      renderer.dispose()
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 -z-10"
      style={{
        background: `
          radial-gradient(circle at bottom,
            #2a1b4d 0%,
            #0b0b1f 55%,
            #03030a 100%
          )
        `
      }}
    />
  )
}
