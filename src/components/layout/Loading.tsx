export function Loading() {
    return (
        <main className="w-full">
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
                </div>
                <p className="text-gray-600 text-sm font-medium">読み込み中...</p>
            </div>
        </main>
    );
}