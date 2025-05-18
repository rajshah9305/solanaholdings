"use client"

import { useEffect, useState } from "react"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { fetchSolanaPrice } from "@/lib/api"

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

    return <span>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
  }

  // Function to update the display with real data
  const updateValues = async () => {
    try {
      setIsLoading(true)
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
    } catch (err) {
      setError("Failed to fetch price data. Please try again later.")
      setIsLoading(false)
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
    if (!value) return "text-gray-500"
    if (value > 0) return "text-green-500"
    if (value < 0) return "text-red-500"
    return "text-gray-500"
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
      {/* Solana Logo */}
      <svg className="w-20 h-20 mx-auto mb-6" viewBox="0 0 397.7 311.7" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
          fill="#9945FF"
        />
        <path
          d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
          fill="#9945FF"
        />
        <path
          d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
          fill="#9945FF"
        />
      </svg>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-[#1E2A5E] mb-4 pb-3 border-b-2 border-[#9945FF]">
          Solana Holdings Overview
        </h1>

        <div className="flex justify-end mb-4">
          <div className="text-sm text-blue-700 font-mono bg-blue-100 px-3 py-1 rounded shadow-sm">
            <LiveClock />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
          <button onClick={updateValues} className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded">
            Try Again
          </button>
        </div>
      )}

      {/* Holdings Table */}
      <div className="overflow-x-auto">
        <table className="w-full mb-8">
          <thead>
            <tr>
              <th className="text-left p-3 bg-gray-50 border-b">Metric</th>
              <th className="text-left p-3 bg-gray-50 border-b">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border-b">Quantity of SOL held</td>
              <td className="p-3 border-b font-mono">{quantity}</td>
            </tr>
            <tr>
              <td className="p-3 border-b">Current SOL Price (in CAD)</td>
              <td className="p-3 border-b font-mono font-bold text-teal-600">
                {isLoading ? (
                  <span className="text-gray-400">Loading...</span>
                ) : currentPrice ? (
                  formatCurrency(currentPrice)
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
            <tr>
              <td className="p-3 border-b">Current Market Value (in CAD)</td>
              <td className="p-3 border-b font-mono font-bold text-teal-600">
                {isLoading ? (
                  <span className="text-gray-400">Loading...</span>
                ) : marketValue ? (
                  formatCurrency(marketValue)
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
            <tr>
              <td className="p-3 border-b">Book Cost (in CAD)</td>
              <td className="p-3 border-b font-mono">{formatCurrency(bookCost)}</td>
            </tr>
            <tr>
              <td className="p-3 border-b">Average Price Paid (per SOL in CAD)</td>
              <td className="p-3 border-b font-mono">{formatCurrency(averagePricePaid)}</td>
            </tr>
            <tr>
              <td className="p-3 border-b">Percentage of Crypto Account</td>
              <td className="p-3 border-b font-mono">{portfolioPercentage}%</td>
            </tr>
            <tr>
              <td className="p-3 border-b">Total Return (in CAD)</td>
              <td className={`p-3 border-b font-mono font-bold ${getValueColorClass(totalReturnValue)}`}>
                {isLoading ? (
                  <span className="text-gray-400">Loading...</span>
                ) : totalReturnValue !== null ? (
                  formatCurrency(totalReturnValue)
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
            <tr>
              <td className="p-3 border-b">Total Return (as a percentage)</td>
              <td className={`p-3 border-b font-mono font-bold ${getValueColorClass(totalReturnPercent)}`}>
                {isLoading ? (
                  <span className="text-gray-400">Loading...</span>
                ) : totalReturnPercent !== null ? (
                  formatPercentage(totalReturnPercent)
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Understanding Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#1E2A5E] mb-4">Understanding Your Holdings</h2>
        <ul className="space-y-2 pl-5 list-disc">
          <li>
            <strong>Quantity of SOL held</strong>: This is the amount of Solana cryptocurrency you own.
          </li>
          <li>
            <strong>Current SOL Price (in CAD)</strong>: The current market price of one Solana token in Canadian
            dollars.
          </li>
          <li>
            <strong>Current Market Value (in CAD)</strong>: The current worth of your Solana holdings in Canadian
            dollars.
          </li>
          <li>
            <strong>Book Cost (in CAD)</strong>: The total amount you paid to acquire your Solana holdings in Canadian
            dollars.
          </li>
          <li>
            <strong>Average Price Paid (per SOL in CAD)</strong>: The average price you paid for each unit of Solana in
            Canadian dollars.
          </li>
          <li>
            <strong>Percentage of Crypto Account</strong>: The portion of your cryptocurrency portfolio that Solana
            represents.
          </li>
          <li>
            <strong>Total Return (in CAD)</strong>: The profit or loss on your Solana investment in Canadian dollars.
          </li>
          <li>
            <strong>Total Return (as a percentage)</strong>: Your profit or loss expressed as a percentage of your
            initial investment.
          </li>
        </ul>
      </div>

      {/* Live Feed Section */}
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <h2 className="text-xl font-bold text-[#1E2A5E] mb-2">Real-time Updates</h2>
        <p className="mb-2">
          The values for Current Market Value, Total Return (in CAD), and Total Return (as a percentage) update
          automatically to reflect the latest market data from CoinGecko API.
        </p>
        <div className="flex justify-end items-center mt-3">
          <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </div>
      </div>
    </div>
  )
}
