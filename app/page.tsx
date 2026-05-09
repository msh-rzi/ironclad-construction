"use client";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Services from "./components/Services";
import Pricing from "./components/Pricing";
import Estimator from "./components/Estimator";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { SiteDataProvider } from "./components/SiteDataProvider";

export default function Home() {
  return (
    <SiteDataProvider>
      <main>
        <Navbar />
        <Hero />
        <Projects />
        <Services />
        <Pricing />
        <Estimator />
        <Contact />
        <Footer />
      </main>
    </SiteDataProvider>
  );
}
