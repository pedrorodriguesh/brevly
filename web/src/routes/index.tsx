import { createFileRoute } from '@tanstack/react-router'
import logo from '../assets/logo.svg'
import { CreateLinkSection } from '../components/create-link-section'
import { LinkListSection } from '../components/links-list-section'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col justify-center items-center px-4 py-8 md:py-0">
      <div className="flex flex-col gap-6 md:gap-8 w-full max-w-6xl">
        <div className="flex justify-center md:justify-start">
          <img src={logo} alt="logo" className="w-28 h-auto" />
        </div>
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-start">
          <CreateLinkSection />
          <LinkListSection />
        </div>
      </div>
    </div>
  )
}
