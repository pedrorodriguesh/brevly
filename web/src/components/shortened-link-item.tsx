import { CopyIcon, TrashIcon } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { env } from '../env'
import { useApiClient } from '../hooks/http/useApiClient'
import { Button } from './ui/button'

interface ShortenedLinkItemProps {
  shortCode: string
  fullUrl: string
  accessCount: number
}

export function ShortenedLinkItem({
  shortCode,
  fullUrl,
  accessCount,
}: ShortenedLinkItemProps) {
  const queryClient = useQueryClient()
  const { apiCall } = useApiClient()

  const deleteLink = useMutation({
    mutationFn: (short_code: string) =>
      apiCall(`/link/${short_code}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      toast.success('Link removido com sucesso.')
      queryClient.invalidateQueries({ queryKey: ['links'] })
      queryClient.refetchQueries({ queryKey: ['links'] })
    },
    onError: () => {
      toast.error('Erro ao remover link.')
    },
  })

  function copyLink() {
    navigator.clipboard.writeText(`https://brev.ly/${shortCode}`)
    toast.info('Link copiado para seu clipboard!')
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 gap-3">
      <div className="flex flex-col gap-1 min-w-0">
        <Link
          to={`${env.VITE_API_BASE_URL}redirect/${shortCode}`}
          className="text-blue-base font-semibold text-base"
        >
          brev.ly/{shortCode}
        </Link>
        <span className="text-gray-400 text-sm truncate">{fullUrl}</span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <span className="text-gray-400 text-sm sm:text-base">{accessCount} acessos</span>
        <Button size="iconOnly" color="icon" onClick={copyLink}>
          <CopyIcon color="#000000" />
        </Button>
        <Button
          onClick={() => deleteLink.mutate(shortCode)}
          size="iconOnly"
          color="icon"
        >
          <TrashIcon color="#000000" />
        </Button>
      </div>
    </div>
  )
}
