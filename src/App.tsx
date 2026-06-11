import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import DrugList from "@/pages/DrugList";
import DrugDetail from "@/pages/DrugDetail";
import DrugInteractionPage from "@/pages/DrugInteraction";
import CaseLibrary from "@/pages/CaseLibrary";
import LearnList from "@/pages/LearnList";
import LearnDetail from "@/pages/LearnDetail";
import QuizHome from "@/pages/QuizHome";
import QuizActive from "@/pages/QuizActive";
import QuizResult from "@/pages/QuizResult";
import Progress from "@/pages/Progress";
import WrongBook from "@/pages/WrongBook";
import KnowledgeGraphPage from "@/pages/KnowledgeGraph";
import PharmacologyCalculators from "@/pages/PharmacologyCalculators";
import ADRSimulation from "@/pages/ADRSimulation";
import CaseConsultation from "@/pages/CaseConsultation";
import TDMExercise from "@/pages/TDMExercise";
import Layout from "@/components/Layout/Layout";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/drugs" element={<DrugList />} />
          <Route path="/drugs/:id" element={<DrugDetail />} />
          <Route path="/interactions" element={<DrugInteractionPage />} />
          <Route path="/calculators" element={<PharmacologyCalculators />} />
          <Route path="/tdm-exercise" element={<TDMExercise />} />
          <Route path="/adr-simulation" element={<ADRSimulation />} />
          <Route path="/case-consultation" element={<CaseConsultation />} />
          <Route path="/cases" element={<CaseLibrary />} />
          <Route path="/learn" element={<LearnList />} />
          <Route path="/learn/:chapterId" element={<LearnDetail />} />
          <Route path="/quiz" element={<QuizHome />} />
          <Route path="/quiz/active" element={<QuizActive />} />
          <Route path="/quiz/result" element={<QuizResult />} />
          <Route path="/wrong-book" element={<WrongBook />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
