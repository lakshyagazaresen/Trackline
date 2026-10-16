export type DateFormat =
  | 'short'
  | 'medium'
  | 'long'

const dateFormatOptions: Record<
  DateFormat,
  Intl.DateTimeFormatOptions
> = {
  short: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },

  medium: {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  },

  long: {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  },
}

export function formatDate(
  value: string | null | undefined,
  format: DateFormat = 'medium',
): string {
  if (!value) {
    return '—'
  }

  const [year, month, day] =
    value.split('-').map(Number)

  const date = new Date(
    year,
    month - 1,
    day,
  )

  return new Intl.DateTimeFormat(
    'en-GB',
    dateFormatOptions[format],
  ).format(date)
}

export function parseDateValue(
  value: string | null | undefined,
): Date | undefined {
  if (!value) {
    return undefined
  }

  const [year, month, day] =
    value.split('-').map(Number)

  return new Date(
    year,
    month - 1,
    day,
  )
}

export function toDateValue(
  date: Date,
): string {
  const year =
    date.getFullYear()

  const month =
    String(date.getMonth() + 1)
      .padStart(2, '0')

  const day =
    String(date.getDate())
      .padStart(2, '0')

  return `${year}-${month}-${day}`
}