import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const PASTELS = [0xff7bac, 0xa78bfa, 0x5cc9a7, 0xf5b94c, 0xffd3e3, 0x7bd8ff]

/**
 * Soft 3D backdrop: drifting candy sprinkles, glossy bonbon spheres and a
 * couple of donut toruses, with gentle mouse parallax.
 */
export default function HeroCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0xfff0f5, 14, 36)

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.set(0, 0, 16)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 1.1))
    const key = new THREE.DirectionalLight(0xfff0e0, 1.6)
    key.position.set(6, 8, 10)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffd3e3, 0.8)
    fill.position.set(-8, -4, 6)
    scene.add(fill)

    const drifters = []
    const rand = (a, b) => a + Math.random() * (b - a)

    // sprinkles
    const sprinkleGeo = new THREE.CapsuleGeometry(0.09, 0.5, 4, 10)
    for (let i = 0; i < 70; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: PASTELS[i % PASTELS.length],
        roughness: 0.4,
        metalness: 0.05,
      })
      const m = new THREE.Mesh(sprinkleGeo, mat)
      m.position.set(rand(-13, 13), rand(-8, 8), rand(-12, 4))
      m.rotation.set(rand(0, Math.PI), rand(0, Math.PI), rand(0, Math.PI))
      scene.add(m)
      drifters.push({
        mesh: m,
        baseY: m.position.y,
        speed: rand(0.3, 0.9),
        amp: rand(0.3, 0.9),
        spin: rand(0.2, 0.7),
        phase: rand(0, Math.PI * 2),
      })
    }

    // glossy bonbons
    const ballGeo = new THREE.SphereGeometry(1, 40, 40)
    const ballSpecs = [
      { p: [-9, 3.4, -4], s: 1.6, c: 0xffd3e3 },
      { p: [9.5, -2.6, -5], s: 2.1, c: 0xe6dbff },
      { p: [-7.5, -4.2, -7], s: 1.3, c: 0xd2f3e5 },
      { p: [7.8, 4.4, -8], s: 1.7, c: 0xffeac2 },
    ]
    for (const spec of ballSpecs) {
      const m = new THREE.Mesh(
        ballGeo,
        new THREE.MeshPhysicalMaterial({
          color: spec.c,
          roughness: 0.18,
          clearcoat: 1,
          clearcoatRoughness: 0.25,
        })
      )
      m.position.set(...spec.p)
      m.scale.setScalar(spec.s)
      scene.add(m)
      drifters.push({ mesh: m, baseY: spec.p[1], speed: rand(0.2, 0.4), amp: rand(0.4, 0.7), spin: 0.1, phase: rand(0, 6) })
    }

    // chocolate donuts
    const torusGeo = new THREE.TorusGeometry(0.9, 0.42, 24, 48)
    const torusSpecs = [
      { p: [-11, -1, -6], c: 0x8b5a3c },
      { p: [11.5, 1.4, -7], c: 0xf4a7bb },
    ]
    for (const spec of torusSpecs) {
      const m = new THREE.Mesh(
        torusGeo,
        new THREE.MeshStandardMaterial({ color: spec.c, roughness: 0.35 })
      )
      m.position.set(...spec.p)
      m.rotation.set(rand(0, 1), rand(0, 1), 0)
      scene.add(m)
      drifters.push({ mesh: m, baseY: spec.p[1], speed: rand(0.2, 0.35), amp: 0.6, spin: 0.25, phase: rand(0, 6) })
    }

    const mouse = { x: 0, y: 0 }
    const onMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    const clock = new THREE.Clock()
    let raf
    const tick = () => {
      const t = clock.getElapsedTime()
      for (const d of drifters) {
        d.mesh.position.y = d.baseY + Math.sin(t * d.speed + d.phase) * d.amp
        d.mesh.rotation.x += d.spin * 0.004
        d.mesh.rotation.y += d.spin * 0.006
      }
      camera.position.x += (mouse.x * 1.4 - camera.position.x) * 0.04
      camera.position.y += (-mouse.y * 1.0 - camera.position.y) * 0.04
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
      if (!reduced) raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      sprinkleGeo.dispose()
      ballGeo.dispose()
      torusGeo.dispose()
      scene.traverse((o) => {
        if (o.isMesh) o.material.dispose()
      })
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="hero-canvas" ref={mountRef} aria-hidden="true" />
}
