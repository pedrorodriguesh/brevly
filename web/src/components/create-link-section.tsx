import { CreateLinkForm } from './create-link-form'

export function CreateLinkSection() {
  return (
    <div className="bg-white p-6 md:p-8 w-full lg:w-md rounded-lg lg:shrink-0">
      <div>
        <h1 className="text-xl text-gray-600 font-bold pb-6">Novo Link</h1>
        <CreateLinkForm />
      </div>
    </div>
  )
}
