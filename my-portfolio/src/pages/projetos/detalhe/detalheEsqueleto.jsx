export default function Esqueleto() {
    return (
        <div className="w-full mx-auto max-w-4xl p-4 animate-pulse">
            <div className="h-5 mb-1 bg-gray-400 rounded w-15" />

            <div className="flex flex-col gap-2">
                <div className="h-5 bg-gray-400 rounded w-full mt-1" />
                <div className="h-3 bg-gray-400 rounded w-3/4" />
            </div>

            <div className="mt-2 aspect-video w-full bg-gray-400 rounded-lg" />
        </div>
    )
}