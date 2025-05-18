/**
 * Fetches the current Solana price in CAD from the CoinGecko API
 * @returns Promise<number> - The current price of Solana in CAD
 */
export async function fetchSolanaPrice(): Promise<number> {
  try {
    // CoinGecko API endpoint for Solana price in CAD
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=cad", {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Check if the response contains the expected data
    if (!data.solana || !data.solana.cad) {
      throw new Error("Invalid response format from CoinGecko API")
    }

    return data.solana.cad
  } catch (error) {
    console.error("Error fetching Solana price:", error)
    throw error
  }
}
