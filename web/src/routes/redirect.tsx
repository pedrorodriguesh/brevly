
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import notFound from '../assets/404.svg'
import logoIcon from '../assets/logo-icon.svg'

export const Route = createFileRoute('/redirect')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      url: (search.url as string) || '',
    }
  },
})

function RouteComponent() {
  const { url } = Route.useSearch()
  const [countdown, setCountdown] = useState(2)

  useEffect(() => {
    if (!url) {
      return
    }

    // Countdown de 3 segundos antes de redirecionar
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }

    // Redireciona após o countdown
    window.location.href = url
  }, [url, countdown])

  if (!url) {
    return (
      <div className="min-h-screen bg-gray-200 flex justify-center items-center px-4 py-8">
        <div className="bg-white py-12 px-6 sm:py-20 sm:px-16 max-w-2xl w-full rounded-lg shadow-md text-center flex flex-col items-center gap-4">
          <img src={notFound} alt="not-found-error" className="w-36 sm:w-48" />

          <h2 className="text-xl sm:text-2xl font-bold">Link não encontrado</h2>

          <p className="text-gray-700 text-sm sm:text-base">
            O link que você está tentando acessar não existe, foi removido ou é
            uma URL inválida. Saiba mais em{' '}
            <a
              href={import.meta.env.VITE_APP_URL}
              className="text-blue-600 hover:underline"
            >
              brev.ly
            </a>
            .
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col justify-center items-center px-4 py-8">
      <div className="bg-white p-8 sm:p-16 gap-6 rounded-lg shadow-md max-w-xl w-full text-center">
        <div className="flex justify-center mb-4">
          <img src={logoIcon} alt="logo" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Redirecionando...</h1>
        <p className="text-gray-700 mb-2 text-sm sm:text-base">
          O link será aberto automaticamente em alguns instantes.
        </p>
        <p className="text-sm text-gray-500">
          Não foi redirecionado?{' '}
          <a href={url} className="text-blue-600 hover:underline">
            Acesse aqui
          </a>
        </p>
      </div>
    </div>
  )
}
