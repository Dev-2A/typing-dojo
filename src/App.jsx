import { useState } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import PracticePage from "./pages/PracticePage";
import DailyPage from "./pages/DailyPage";
import StatsPage from "./pages/StatsPage";

function App() {
  const [currentPage, setCurrentPage] = useState("practice");

  const renderPage = () => {
    switch (currentPage) {
      case "daily":
        return <DailyPage key="daily" />;
      case "stats":
        return <StatsPage key="stats" />;
      case "practice":
      default:
        return <PracticePage key="practice" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="animate-fade-in">{renderPage()}</div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
