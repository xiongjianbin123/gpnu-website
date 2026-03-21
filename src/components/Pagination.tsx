interface PaginationProps {
  current: number
  total: number
  onChange: (page: number) => void
}

export default function Pagination({ current, total, onChange }: PaginationProps) {
  if (total <= 1) return null

  const getPages = () => {
    const pages: (number | '...')[] = []
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      if (current > 3) pages.push('...')
      const start = Math.max(2, current - 1)
      const end = Math.min(total - 1, current + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (current < total - 2) pages.push('...')
      pages.push(total)
    }
    return pages
  }

  return (
    <div className="pagination">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current <= 1}
      >
        ‹
      </button>

      {getPages().map((page, idx) =>
        page === '...' ? (
          <span key={`dots-${idx}`} style={{ padding: '0 4px', color: '#999' }}>···</span>
        ) : (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={current === page ? 'active' : ''}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current >= total}
      >
        ›
      </button>
    </div>
  )
}
