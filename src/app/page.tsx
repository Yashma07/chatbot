"use client";

import { MeshGradient } from "@/components/mesh-gradient";
import { ChatLayout } from "@/components/chat-layout";

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
        height: '100%',
        padding: '1rem'
      }}>
        <ChatLayout />
      </div>
    </div>
  );
}

