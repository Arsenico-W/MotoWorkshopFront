'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

//Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Items() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleChange = useDebouncedCallback((limit) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', '1')
    if (limit) {
      params.set('limit', limit)
    } else {
      params.delete('limit')
    }
    replace(`${pathname}?${params.toString()}`)
  },0)

  return (
    <div>
      <Select
        onValueChange={handleChange}
        defaultValue={searchParams.get('limit') || ''}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Items por página" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5 items</SelectItem>
          <SelectItem value="10">10 items</SelectItem>
          <SelectItem value="15">15 items</SelectItem>
          <SelectItem value="20">20 items</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
