export default function TypingIndicator() {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-300" />
      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-black/5">
        <div className="flex items-center gap-1">
          <div 
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <div 
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <div 
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}