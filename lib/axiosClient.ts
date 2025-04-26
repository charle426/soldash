import axios from "axios"
import axiosRetry from "axios-retry"

const axiosInstance = axios.create()

axiosRetry(axiosInstance, {
  retries: 3, // How many times to retry
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) || 
      error.response?.status === 429 // Retry on rate limits
    )
  }
})

// import axios from "axios"
// import axiosRetry from "axios-retry"
// import { applyConcurrency } from "axios-concurrency"

// const MAX_CONCURRENT_REQUESTS = 5

// const axiosInstance = axios.create()

// // Limit concurrency
// applyConcurrency(axiosInstance, MAX_CONCURRENT_REQUESTS)

// // Add retry logic
// axiosRetry(axiosInstance, {
//   retries: 4,
//   retryDelay: axiosRetry.exponentialDelay,
//   retryCondition: (error) => {
//     return (
//       axiosRetry.isNetworkOrIdempotentRequestError(error) ||
//       error.response?.status === 429
//     )
//   },
// })

// export default axiosInstance

export default axiosInstance