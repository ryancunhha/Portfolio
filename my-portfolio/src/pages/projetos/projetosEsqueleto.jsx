export default function Esqueleto() {
    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from({ length: 9 }).map((_, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        <div className="aspect-video w-full bg-gray-400 rounded-lg" />
                        <div className="h-5 bg-gray-400 rounded w-full mt-1" />
                        <div className="h-4 bg-gray-400 rounded w-3/4" />
                    </div>
                ))}
            </div>
        </div>
    )
}