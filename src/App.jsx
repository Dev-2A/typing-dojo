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
        return <DailyPage />;
      case "stats":
        return <StatsPage />;
      case "practice":
      default:
        return <PracticePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
