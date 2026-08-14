import { Hero } from "@/components/home/Hero";
import { Gallery } from "@/components/home/Gallery";
import { Amenities } from "@/components/home/Amenities";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { Pricing } from "@/components/home/Pricing";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaBand } from "@/components/home/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <Gallery />
      <Amenities />
      <ProcessSteps />
      <Pricing />
      <Testimonials />
      <CtaBand />
    </>
  );
}
