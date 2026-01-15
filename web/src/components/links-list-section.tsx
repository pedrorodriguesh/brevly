import { DownloadSimpleIcon } from '@phosphor-icons/react'
import { LinkIcon, SpinnerGapIcon } from '@phosphor-icons/react/dist/ssr'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useApiClient } from '../hooks/http/useApiClient'
import type { GetLinksResponse } from '../types/get-links'
import { ShortenedLinkItem } from './shortened-link-item'
import { Button } from './ui/button'

interface ExportCsvResponse {
  reportUrl: string
}

export function LinkListSection() {
  const { apiCall } = useApiClient()

  const { data: links, isPending } = useQuery({
    queryKey: ['links'],
    queryFn: () =>
      apiCall<GetLinksResponse>('links', {
        method: 'GET',
      }),
    select: (data) => data.links,
  })

  const exportCsv = useMutation({
    mutationFn: () =>
      apiCall<ExportCsvResponse>('export', {
        method: 'GET',
      }),
    onSuccess: (data) => {
      window.open(data.reportUrl, '_blank')
      toast.success('CSV exportado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao exportar CSV.')
    },
  })

  const hasLinks = links && links.length > 0

  return (
    <div className="bg-white p-6 md:p-8 w-full lg:grow rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between gap-3 pb-6">
        <h1 className="text-xl text-gray-600 font-bold">Meus Links</h1>
        <Button
          color="icon"
          size="iconLabel"
          disabled={!hasLinks || exportCsv.isPending}
          onClick={() => exportCsv.mutate()}
        >
          <DownloadSimpleIcon color="#000000" weight="bold" />
          {exportCsv.isPending ? 'Exportando...' : 'Baixar CSV'}
        </Button>
      </div>
      <div className="divide-y divide-gray-200 border-t border-gray-200 max-h-96 overflow-y-auto custom-scrollbar pr-3">
        {isPending ? (
          <div className="flex flex-col items-center justify-center gap-4 p-12">
            <SpinnerGapIcon
              size={42}
              color="#74798B"
              className="animate-spin"
            />
            <p className="text-gray-400">Carregando links...</p>
          </div>
        ) : (
          <>
            {' '}
            {hasLinks ? (
              links.map((link) => (
                <ShortenedLinkItem
                  key={link.shortCode}
                  shortCode={link.shortCode}
                  fullUrl={link.fullUrl}
                  accessCount={link.accessCount}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 p-12">
                <LinkIcon size={42} color="#74798B" />
                <p className="text-gray-400">
                  Você ainda não tem nenhum link cadastrado.
                </p>
              </div>
            )}{' '}
          </>
        )}
      </div>
    </div>
  )
}
