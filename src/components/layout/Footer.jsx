export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
        <span>⌨️ Typing Dojo — 개발자 코드 타이핑 수련장</span>
        <div className="flex items-center gap-3">
          <span className="text-gray-600">Made with 🥤 and 💙</span>
          <a
            href="https://github.com/Dev-2A/typing-dojo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
