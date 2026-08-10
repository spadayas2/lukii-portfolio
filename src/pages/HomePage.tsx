import { Hero } from '../components/Hero'
import {
  GamesSection,
  CraftSection,
  OpsSection,
  ContactSection,
} from '../components/Sections'

export function HomePage() {
  return (
    <>
      <Hero />
      <GamesSection />
      <CraftSection />
      <OpsSection />
      <ContactSection />
    </>
  )
}
