import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { z } from 'zod'
import { useApiClient } from '../hooks/http/useApiClient'
import type { CreateShortenedLink } from '../types/create-shortened-link'
import { Button } from './ui/button'
import { Input } from './ui/input'

export function CreateLinkForm() {
  const { apiCall } = useApiClient()
  const queryClient = useQueryClient()

  const createShortenedLink = useMutation({
    mutationFn: (data: CreateShortenedLink) =>
      apiCall('/link', {
        method: 'POST',
        data,
      }),
    onSuccess: () => {
      toast.success('Link encurtado criado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
    onError: () => {
      toast.error('Erro ao criar link encurtado.')
    },
  })

  const form = useForm({
    defaultValues: {
      short_code: '',
      full_url: '',
    },
    onSubmit: async ({ value }) => {
      createShortenedLink.mutate(value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col gap-4"
    >
      <form.Field
        name="full_url"
        validators={{
          onChange: z
            .url('Por favor, insira uma URL válida')
            .min(1, 'Link original é obrigatório'),
        }}
      >
        {(field) => {
          const error = field.state.meta.errors[0]
          const errorMessage =
            typeof error === 'string' ? error : error?.message

          return (
            <Input
              label="LINK ORIGINAL"
              placeholder="https://exemplo.com/"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={errorMessage}
            />
          )
        }}
      </form.Field>

      <form.Field
        name="short_code"
        validators={{
          onChange: z
            .string()
            .min(1, 'Link encurtado é obrigatório')
            .regex(
              /^[a-zA-Z0-9-_]+$/,
              'Use apenas letras, números, hífens e underscores',
            ),
        }}
      >
        {(field) => {
          const error = field.state.meta.errors[0]
          const errorMessage =
            typeof error === 'string' ? error : error?.message

          return (
            <Input
              label="LINK ENCURTADO"
              value={field.state.value}
              prefix="brev.ly/"
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={errorMessage}
            />
          )
        }}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            size="default"
            color="primary"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar link'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
