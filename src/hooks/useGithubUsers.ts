import { useQuery } from "@tanstack/react-query"
import { queryClient } from "../utils/queryClient"
import { GithubUser } from "../types"

// Hook that exposes the github users fetch call
// we are using the react-query library to handle the caching and refetching
// this provides a cleaner way to do API calls
export function useGithubUsers() {

  return useQuery({
    queryFn: async () => {
      const response = await fetch('https://api.github.com/orgs/mozilla/members?per_page=50')
      // Nessecary evil to get the types to match
      return response.json() as unknown as GithubUser[]
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
    queryKey: ['github-posts'],

  }, queryClient)

}