import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AutoPromotion from '../../src/components/AutoPromotion.tsx'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'

describe('AutoPromotion Component', () => {
  it('should render without crashing', () => {
    render(<AutoPromotion promotions={[]} />)
    expect(screen.getByTestId('auto-promotion')).toBeInTheDocument()
  })

  it('should show loading state initially', () => {
    render(<AutoPromotion promotions={[]} />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should display error when no products are selected', () => {
    render(<AutoPromotion promotions={[]} />)
    expect(screen.getByTestId('no-products-error')).toHaveTextContent('没有选中的商品')
  })
})