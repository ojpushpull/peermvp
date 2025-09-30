import Image from "next/image";
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';


export default function Homepage() {
  return (
    <main className="min-h-screen">
      
      <Hero />
      <Features />
      
    </main>
  );
}