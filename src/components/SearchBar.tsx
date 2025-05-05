'use client'
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const router = useRouter()

    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) return
        
        setIsSearching(true)
        try {
            // Use the server API route instead of directly calling Notion
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
            
            if (!response.ok) {
                throw new Error('Search request failed');
            }
            
            const data = await response.json();
            console.log("Search results:", data.results);
            
            // Redirect to search results page
            if (data.results.length > 0) {
                router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            } else {
                // Still redirect to show "no results found"
                router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            }
            
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setIsSearching(false);
        }
    }

    return (
        <form className="flex items-center gap-2 text-xs"
         onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchQuery);
         }}
        >
            <Search className="w-6 h-6" />
            <Input
                type="text"
                placeholder="Search"
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isSearching}
            />
            <Button variant='outline' type='submit' disabled={isSearching} className="cursor-pointer"   >
                {isSearching ? 'loading...' : 'search'}
            </Button>
        </form>
    )
}

export default SearchBar;