"use client";

import { MeshGradient } from "@/components/mesh-gradient";

export default function Home() {
  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      <MeshGradient />
      <div style={{ 
        position: 'relative', 
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}>
        <h1 style={{ color: 'white', fontSize: '48px' }}>Test with MeshGradient</h1>
      </div>
    </div>
  );
}
