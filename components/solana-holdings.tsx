"use client"

import { useEffect, useState } from "react"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { fetchSolanaPrice } from "@/lib/api"
import { ArrowDown, ArrowUp, Clock, DollarSign, Info, RefreshCw } from "lucide-react"

export default function SolanaHoldings() {
  // Initial values
  const quantity = 0.025465
  const bookCost = 6.24
  const averagePricePaid = 245.04
  const portfolioPercentage = 100

  // State for values that update
  const [marketValue, setMarketValue] = useState<number | null>(null)
  const [totalReturnValue, setTotalReturnValue] = useState<number | null>(null)
  const [totalReturnPercent, setTotalReturnPercent] = useState<number | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>("Fetching data...")
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Live clock component
  const LiveClock = () => {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
      const timer = setInterval(() => {
        setTime(new Date())
      }, 1000)

      return () => {
        clearInterval(timer)
      }
    }, [])

    return (
      <div className="flex items-center gap-2 text-indigo-700 font-mono bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-lg shadow-sm border border-indigo-100">
        <Clock className="h-4 w-4" />
        <span>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
      </div>
    )
  }

  // Function to update the display with real data
  const updateValues = async () => {
    try {
      setIsLoading(true)
      setRefreshing(true)
      setError(null)

      // Fetch real Solana price data
      const solPrice = await fetchSolanaPrice()
      setCurrentPrice(solPrice)

      // Calculate actual market value and returns
      const newMarketValue = quantity * solPrice
      const newTotalReturnValue = newMarketValue - bookCost
      const newTotalReturnPercent = (newTotalReturnValue / bookCost) * 100

      // Update state
      setMarketValue(newMarketValue)
      setTotalReturnValue(newTotalReturnValue)
      setTotalReturnPercent(newTotalReturnPercent)

      // Update timestamp
      const now = new Date()
      setLastUpdated(now.toLocaleTimeString())
      setIsLoading(false)

      // Reset refreshing state after a short delay for animation
      setTimeout(() => setRefreshing(false), 500)
    } catch (err) {
      setError("Failed to fetch price data. Please try again later.")
      setIsLoading(false)
      setRefreshing(false)
      console.error("Error fetching Solana price:", err)
    }
  }

  // Update values on component mount and every 60 seconds (to avoid API rate limits)
  useEffect(() => {
    updateValues()
    const interval = setInterval(updateValues, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  // Helper function to determine the color class based on value
  const getValueColorClass = (value: number | null) => {
    if (!value) return "text-slate-500"
    if (value > 0) return "text-emerald-500"
    if (value < 0) return "text-rose-500"
    return "text-slate-500"
  }

  // Helper function to get the appropriate arrow icon
  const getArrowIcon = (value: number | null) => {
    if (!value) return null
    if (value > 0) return <ArrowUp className="h-4 w-4 text-emerald-500" />
    if (value < 0) return <ArrowDown className="h-4 w-4 text-rose-500" />
    return null
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-100">
      {/* Header with Solana Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 rounded-full shadow-md mb-6">
          <svg className="w-16 h-16 text-white" viewBox="0 0 397.7 311.7" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
              fill="currentColor"
            />
            <path
              d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
              fill="currentColor"
            />
            <path
              d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">
          Solana Holdings Overview
        </h1>
        <div className="h-1 w-40 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-6"></div>
      </div>

      <div className="flex justify-end mb-6">
        <LiveClock />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-lg animate-pulse">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            <p className="font-medium">{error}</p>
          </div>
          <button
            onClick={updateValues}
            className="mt-3 px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-md transition-colors duration-200 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Current Price Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl shadow-sm border border-indigo-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-indigo-800 uppercase tracking-wider">Current SOL Price</h3>
            <DollarSign className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-indigo-900">
              {isLoading ? (
                <span className="text-indigo-400">Loading...</span>
              ) : currentPrice ? (
                formatCurrency(currentPrice)
              ) : (
                "N/A"
              )}
            </p>
            <p className="text-sm text-indigo-600 mb-1">CAD</p>
          </div>
        </div>

        {/* Holdings Value Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl shadow-sm border border-indigo-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-indigo-800 uppercase tracking-wider">Your Holdings</h3>
            <span className="text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
              {quantity} SOL
            </span>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-indigo-900">
              {isLoading ? (
                <span className="text-indigo-400">Loading...</span>
              ) : marketValue ? (
                formatCurrency(marketValue)
              ) : (
                "N/A"
              )}
            </p>
            <p className="text-sm text-indigo-600 mb-1">CAD</p>
          </div>
        </div>

        {/* Return Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl shadow-sm border border-indigo-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-indigo-800 uppercase tracking-wider">Total Return</h3>
            {totalReturnValue !== null && getArrowIcon(totalReturnValue)}
          </div>
          <div className="flex flex-col">
            <div className="flex items-end gap-2">
              <p className={`text-2xl font-bold ${getValueColorClass(totalReturnValue)}`}>
                {isLoading ? (
                  <span className="text-indigo-400">Loading...</span>
                ) : totalReturnValue !== null ? (
                  formatCurrency(totalReturnValue)
                ) : (
                  "N/A"
                )}
              </p>
              <p className="text-sm text-indigo-600 mb-1">CAD</p>
            </div>
            <p className={`text-sm font-medium ${getValueColorClass(totalReturnPercent)}`}>
              {isLoading ? (
                <span className="text-indigo-400">Loading...</span>
              ) : totalReturnPercent !== null ? (
                formatPercentage(totalReturnPercent)
              ) : (
                "N/A"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-8 transition-all duration-300 hover:shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <th className="text-left p-4 font-medium">Metric</th>
                <th className="text-left p-4 font-medium">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50 transition-colors duration-150">
                <td className="p-4 text-slate-700">Quantity of SOL held</td>
                <td className="p-4 font-mono font-medium text-slate-900">{quantity}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors duration-150">
                <td className="p-4 text-slate-700">Current SOL Price (in CAD)</td>
                <td className="p-4 font-mono font-medium text-indigo-600">
                  {isLoading ? (
                    <span className="text-slate-400 flex items-center gap-2">
                      <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Loading...
                    </span>
                  ) : currentPrice ? (
                    formatCurrency(currentPrice)
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors duration-150">
                <td className="p-4 text-slate-700">Current Market Value (in CAD)</td>
                <td className="p-4 font-mono font-medium text-indigo-600">
                  {isLoading ? (
                    <span className="text-slate-400 flex items-center gap-2">
                      <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Loading...
                    </span>
                  ) : marketValue ? (
                    formatCurrency(marketValue)
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors duration-150">
                <td className="p-4 text-slate-700">Book Cost (in CAD)</td>
                <td className="p-4 font-mono font-medium text-slate-900">{formatCurrency(bookCost)}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors duration-150">
                <td className="p-4 text-slate-700">Average Price Paid (per SOL in CAD)</td>
                <td className="p-4 font-mono font-medium text-slate-900">{formatCurrency(averagePricePaid)}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors duration-150">
                <td className="p-4 text-slate-700">Percentage of Crypto Account</td>
                <td className="p-4 font-mono font-medium text-slate-900">{portfolioPercentage}%</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors duration-150">
                <td className="p-4 text-slate-700">Total Return (in CAD)</td>
                <td
                  className={`p-4 font-mono font-medium flex items-center gap-2 ${getValueColorClass(totalReturnValue)}`}
                >
                  {isLoading ? (
                    <span className="text-slate-400 flex items-center gap-2">
                      <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Loading...
                    </span>
                  ) : totalReturnValue !== null ? (
                    <>
                      {getArrowIcon(totalReturnValue)}
                      {formatCurrency(totalReturnValue)}
                    </>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors duration-150">
                <td className="p-4 text-slate-700">Total Return (as a percentage)</td>
                <td
                  className={`p-4 font-mono font-medium flex items-center gap-2 ${getValueColorClass(totalReturnPercent)}`}
                >
                  {isLoading ? (
                    <span className="text-slate-400 flex items-center gap-2">
                      <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Loading...
                    </span>
                  ) : totalReturnPercent !== null ? (
                    <>
                      {getArrowIcon(totalReturnPercent)}
                      {formatPercentage(totalReturnPercent)}
                    </>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Understanding Section */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-indigo-600" />
          Understanding Your Holdings
        </h2>
        <ul className="space-y-3 pl-5 list-disc text-slate-700">
          <li>
            <strong className="text-indigo-900">Quantity of SOL held</strong>: This is the amount of Solana
            cryptocurrency you own.
          </li>
          <li>
            <strong className="text-indigo-900">Current SOL Price (in CAD)</strong>: The current market price of one
            Solana token in Canadian dollars.
          </li>
          <li>
            <strong className="text-indigo-900">Current Market Value (in CAD)</strong>: The current worth of your Solana
            holdings in Canadian dollars.
          </li>
          <li>
            <strong className="text-indigo-900">Book Cost (in CAD)</strong>: The total amount you paid to acquire your
            Solana holdings in Canadian dollars.
          </li>
          <li>
            <strong className="text-indigo-900">Average Price Paid (per SOL in CAD)</strong>: The average price you paid
            for each unit of Solana in Canadian dollars.
          </li>
          <li>
            <strong className="text-indigo-900">Percentage of Crypto Account</strong>: The portion of your
            cryptocurrency portfolio that Solana represents.
          </li>
          <li>
            <strong className="text-indigo-900">Total Return (in CAD)</strong>: The profit or loss on your Solana
            investment in Canadian dollars.
          </li>
          <li>
            <strong className="text-indigo-900">Total Return (as a percentage)</strong>: Your profit or loss expressed
            as a percentage of your initial investment.
          </li>
        </ul>
      </div>

      {/* Live Feed Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl shadow-md text-white">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
          Real-time Updates
        </h2>
        <p className="mb-3 text-indigo-100">
          The values for Current Market Value, Total Return (in CAD), and Total Return (as a percentage) update
          automatically to reflect the latest market data.
        </p>
        <div className="flex justify-end items-center mt-4">
          <p className="text-sm text-indigo-100 bg-white/10 px-4 py-2 rounded-lg">Last updated: {lastUpdated}</p>
        </div>
      </div>
    </div>
  )
}
