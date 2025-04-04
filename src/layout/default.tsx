import SearchBar from '®components/search/bar'

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <SearchBar />
        </>
    )
}
