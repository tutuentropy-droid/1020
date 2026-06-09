import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import DrugList from "@/pages/DrugList";
import DrugDetail from "@/pages/DrugDetail";
import LearnList from "@/pages/LearnList";
import LearnDetail from "@/pages/LearnDetail";
import QuizHome from "@/pages/QuizHome";
import QuizActive from "@/pages/QuizActive";
import QuizResult from "@/pages/QuizResult";
import Progress from "@/pages/Progress";
import Layout from "@/components/Layout/Layout";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/drugs" element={<DrugList />} />
          <Route path="/drugs/:id" element={<DrugDetail />} />
          <Route path="/learn" element={<LearnList />} />
          <Route path="/learn/:chapterId" element={<LearnDetail />} />
          <Route path="/quiz" element={<QuizHome />} />
          <Route path="/quiz/active" element={<QuizActive />} />
          <Route path="/quiz/result" element={<QuizResult />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </Layout>
    </Router>
  );
}
