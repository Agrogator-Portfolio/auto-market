export function useToast() {
  const message = useState<string | null>('app-toast-message', () => null)
  const type = useState<'success' | 'error'>('app-toast-type', () => 'success')

  let timer: ReturnType<typeof setTimeout> | undefined

  function show(text: string, kind: 'success' | 'error' = 'success') {
    message.value = text
    type.value = kind
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      message.value = null
    }, 3500)
  }

  return { message, type, show }
}
