'use client'

import { useState, useMemo } from 'react'
import { useLang } from '@/lib/LanguageContext'

const EUR_TO_PLN = 4.3

export default function Calculator() {
  const [monthlyOrders, setMonthlyOrders] = useState(500)
  const [avgOrderValue, setAvgOrderValue] = useState(40)
  const [returnRate, setReturnRate] = useState(30)
  const { t } = useLang()
  const ca = t.calculator

  const results = useMemo(() => {
    const returnsPerMonth = Math.round(monthlyOrders * (returnRate / 100))
    const currentCost = returnsPerMonth * 7
    const recovoCostPerItem = 14 / EUR_TO_PLN + 0.5
    const recovoCost = Math.round(returnsPerMonth * recovoCostPerItem)
    const monthlySavings = Math.round(currentCost - recovoCost)
    const annualSavings = monthlySavings * 12
    return { returnsPerMonth, currentCost, recovoCost, monthlySavings, annualSavings }
  }, [monthlyOrders, returnRate])

  // avgOrderValue is collected but not used in formula — kept for UX context
  void avgOrderValue

  return (
    <section id="calculator" className="py-24 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E8512A]">
            {ca.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] mt-3">
            {ca.title}
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl">{ca.sub}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-8">
            {/* Monthly orders */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-[#1A1A1A]">{ca.slider1}</label>
                <span className="text-sm font-bold text-[#E8512A]">{monthlyOrders.toLocaleString()}</span>
              </div>
              <input type="range" min={100} max={2000} step={50} value={monthlyOrders}
                onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                className="w-full accent-[#E8512A]" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>100</span><span>2,000</span>
              </div>
            </div>

            {/* Average order value */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-[#1A1A1A]">{ca.slider2}</label>
                <span className="text-sm font-bold text-[#E8512A]">€{avgOrderValue}</span>
              </div>
              <input type="range" min={10} max={100} step={5} value={avgOrderValue}
                onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                className="w-full accent-[#E8512A]" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>€10</span><span>€100</span>
              </div>
            </div>

            {/* Return rate */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-[#1A1A1A]">{ca.slider3}</label>
                <span className="text-sm font-bold text-[#E8512A]">{returnRate}%</span>
              </div>
              <input type="range" min={10} max={60} step={1} value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className="w-full accent-[#E8512A]" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>10%</span><span>60%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 flex flex-col gap-5">
            <ResultRow label={ca.row1} value={`${results.returnsPerMonth.toLocaleString()} items`} />
            <ResultRow label={ca.row2} value={`€${results.currentCost.toLocaleString()}`} sub={ca.row2sub} />
            <ResultRow label={ca.row3} value={`€${results.recovoCost.toLocaleString()}`} sub={ca.row3sub} />

            <div className="border-t border-gray-100 pt-5 mt-2">
              <p className="text-sm text-gray-500 mb-1">{ca.monthlySavings}</p>
              <p className={`text-4xl font-extrabold ${results.monthlySavings > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {results.monthlySavings > 0 ? '+' : ''}€{results.monthlySavings.toLocaleString()}
              </p>
            </div>

            <div className="bg-[#FFF3EF] rounded-lg px-4 py-3">
              <p className="text-sm text-gray-600">
                {ca.annualSavings}:{' '}
                <span className="font-bold text-[#E8512A]">€{results.annualSavings.toLocaleString()}</span>
              </p>
            </div>

            <a href="#contact"
              className="mt-2 bg-[#E8512A] text-white text-sm font-semibold py-3.5 rounded-lg text-center hover:bg-[#d14420] transition-colors">
              {ca.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function ResultRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="text-right">
        <span className="text-sm font-semibold text-[#1A1A1A]">{value}</span>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  )
}
