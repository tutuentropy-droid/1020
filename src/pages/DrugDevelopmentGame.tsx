import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Trophy,
  History,
  Coins,
  Clock,
  Target,
  FlaskConical,
  Stethoscope,
  FileCheck,
  Sparkles,
  ArrowRight,
  BookOpen,
  Dice6,
  Info,
  X,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import {
  gameStages,
  getDecisionsByStage,
  getKnowledgeById,
  drugCategories,
  drugNamePrefixes,
  drugNameSuffixes,
} from "@/data/drugDevGame";
import { GameDecision, GameKnowledgePopup, GameResult } from "@/types";
import GameStageCard from "@/components/DrugDevGame/GameStageCard";
import DecisionModal from "@/components/DrugDevGame/DecisionModal";
import KnowledgePopup from "@/components/DrugDevGame/KnowledgePopup";
import AchievementBadge from "@/components/DrugDevGame/AchievementBadge";
import GameResultModal from "@/components/DrugDevGame/GameResultModal";

export default function DrugDevelopmentGame() {
  const navigate = useNavigate();
  const {
    gameState,
    gameHistory,
    gameAchievements,
    viewedKnowledgePopups,
    startGame,
    makeDecision,
    advanceStage,
    finishGame,
    resetGame,
    markKnowledgeViewed,
    checkStageSuccess,
  } = useStore();

  const [showStartModal, setShowStartModal] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [currentDecision, setCurrentDecision] = useState<GameDecision | null>(null);
  const [currentKnowledge, setCurrentKnowledge] = useState<GameKnowledgePopup | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [selectedDrugName, setSelectedDrugName] = useState("");
  const [selectedDrugCategory, setSelectedDrugCategory] = useState(drugCategories[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stageMessage, setStageMessage] = useState<string | null>(null);

  const currentStageData = gameState.currentStage
    ? gameStages.find((s) => s.id === gameState.currentStage)
    : null;

  const currentStageDecisions = gameState.currentStage
    ? getDecisionsByStage(gameState.currentStage)
    : [];

  const currentDecisionData =
    currentStageDecisions[gameState.currentDecisionIndex] || null;

  const totalGames = gameHistory.length;
  const successGames = gameHistory.filter((h) => h.result === "success").length;
  const unlockedAchievements = gameAchievements.filter((a) => a.unlocked).length;

  const generateRandomDrugName = () => {
    const prefix = drugNamePrefixes[Math.floor(Math.random() * drugNamePrefixes.length)];
    const suffix = drugNameSuffixes[Math.floor(Math.random() * drugNameSuffixes.length)];
    setSelectedDrugName(prefix + suffix);
  };

  const handleStartGame = () => {
    if (!selectedDrugName.trim()) {
      generateRandomDrugName();
      return;
    }
    startGame(selectedDrugName, selectedDrugCategory);
    setShowStartModal(false);
    setGameResult(null);
    setNewAchievements([]);
  };

  const handleOpenDecision = () => {
    if (currentDecisionData) {
      setCurrentDecision(currentDecisionData);
      setShowDecisionModal(true);
    }
  };

  const handleSelectOption = (option: typeof currentDecisionData.options[0]) => {
    makeDecision(option.id, option.costModifier, option.timeModifier, option.successRateModifier);
    setShowDecisionModal(false);

    const knowledge = getKnowledgeById(option.knowledgePopupId);
    if (knowledge) {
      setCurrentKnowledge(knowledge);
      setShowKnowledgeModal(true);
      markKnowledgeViewed(option.knowledgePopupId);
    }
  };

  const handleCloseKnowledge = () => {
    setShowKnowledgeModal(false);
    setCurrentKnowledge(null);
  };

  const handleCompleteStage = () => {
    if (!gameState.currentStage) return;

    setIsProcessing(true);
    setStageMessage(null);

    setTimeout(() => {
      const success = checkStageSuccess();
      const isLastStage = gameState.currentStage === "regulatory-approval";

      if (success) {
        if (isLastStage) {
          setGameResult("success");
          const achievementsBefore = gameAchievements.filter((a) => a.unlocked).map((a) => a.id);
          finishGame("success");
          setTimeout(() => {
            const state = useStore.getState();
            const newUnlocked = state.gameAchievements
              .filter((a) => a.unlocked && !achievementsBefore.includes(a.id))
              .map((a) => a.id);
            setNewAchievements(newUnlocked);
            setShowResultModal(true);
          }, 100);
        } else {
          setStageMessage("阶段成功！进入下一阶段...");
          setTimeout(() => {
            advanceStage();
            setIsProcessing(false);
            setStageMessage(null);
          }, 1500);
        }
      } else {
        setGameResult("failed");
        const achievementsBefore = gameAchievements.filter((a) => a.unlocked).map((a) => a.id);
        finishGame("failed");
        setTimeout(() => {
          const state = useStore.getState();
          const newUnlocked = state.gameAchievements
            .filter((a) => a.unlocked && !achievementsBefore.includes(a.id))
            .map((a) => a.id);
          setNewAchievements(newUnlocked);
          setShowResultModal(true);
        }, 100);
      }
    }, 1000);
  };

  const handlePlayAgain = () => {
    setShowResultModal(false);
    resetGame();
    setSelectedDrugName("");
    generateRandomDrugName();
    setShowStartModal(true);
  };

  const handleBackToHome = () => {
    setShowResultModal(false);
    resetGame();
    navigate("/");
  };

  const canCompleteStage =
    gameState.gameActive &&
    gameState.currentDecisionIndex >= currentStageDecisions.length &&
    !isProcessing;

  const isInsufficientFunds = gameState.funds <= 0;

  useEffect(() => {
    if (isInsufficientFunds && gameState.gameActive && !showResultModal) {
      setGameResult("failed");
      finishGame("failed");
      setShowResultModal(true);
    }
  }, [isInsufficientFunds, gameState.gameActive, showResultModal, finishGame]);

  useEffect(() => {
    if (!gameState.gameActive && totalGames === 0) {
      generateRandomDrugName();
    }
  }, []);

  if (!gameState.gameActive && !showResultModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 animate-fade-in">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>沉浸式学习体验</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
              药物研发之路
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              体验从靶点发现到上市审批的完整药物研发过程。在每个阶段做出关键决策，
              平衡成本、时间和成功率，学习专业药理知识。
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 rounded-3xl p-8 md:p-12 mb-12 text-white shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">开启你的研发之旅</h2>
                <p className="text-white/90 mb-6 leading-relaxed">
                  作为药物研发项目负责人，你将带领团队经历4个关键阶段。
                  每个决策都将影响研发成本、周期和最终成功率。
                  在游戏中学习真实的药理学和药物开发知识。
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-sm">
                    <Target className="w-4 h-4" />
                    <span>4个研发阶段</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-sm">
                    <Dice6 className="w-4 h-4" />
                    <span>10个决策点</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>28个知识弹窗</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-sm">
                    <Trophy className="w-4 h-4" />
                    <span>12个成就</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowStartModal(true)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Play className="w-5 h-5" />
                  开始新游戏
                </button>
              </div>
              <div className="hidden md:block">
                <div className="grid grid-cols-2 gap-4">
                  {gameStages.map((stage, index) => {
                    const Icon = [Target, FlaskConical, Stethoscope, FileCheck][index];
                    return (
                      <div
                        key={stage.id}
                        className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center mb-3`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold mb-1">{stage.name}</h3>
                        <p className="text-sm text-white/70">{stage.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">成就系统</h3>
                  <p className="text-sm text-gray-500">
                    已解锁 {unlockedAchievements}/{gameAchievements.length} 个成就
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                {gameAchievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    size="sm"
                    onClick={() => setShowAchievementModal(true)}
                  />
                ))}
              </div>
              <button
                onClick={() => setShowAchievementModal(true)}
                className="mt-6 w-full py-3 bg-gray-50 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <Info className="w-4 h-4" />
                查看全部成就
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <History className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">研发记录</h3>
                  <p className="text-sm text-gray-500">
                    成功 {successGames}/{totalGames} 次
                  </p>
                </div>
              </div>
              {gameHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>暂无研发记录</p>
                  <p className="text-sm">开始你的第一次药物研发之旅吧</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {gameHistory.slice(0, 5).map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            record.result === "success"
                              ? "bg-green-100"
                              : "bg-orange-100"
                          }`}
                        >
                          {record.result === "success" ? (
                            <Trophy className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {record.drugName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {record.drugCategory}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {record.finalSuccessRate}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(record.date).toLocaleDateString("zh-CN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {showStartModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
              <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">开始新游戏</h3>
                <p className="text-white/80">为你的新药命名并选择分类</p>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    药物名称
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedDrugName}
                      onChange={(e) => setSelectedDrugName(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                      placeholder="输入药物名称"
                    />
                    <button
                      onClick={generateRandomDrugName}
                      className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                      title="随机生成"
                    >
                      <Dice6 className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    药物分类
                  </label>
                  <select
                    value={selectedDrugCategory}
                    onChange={(e) => setSelectedDrugCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                  >
                    {drugCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowStartModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleStartGame}
                    className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    开始研发
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAchievementModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-7 h-7" />
                    <div>
                      <h3 className="text-xl font-bold">成就系统</h3>
                      <p className="text-white/80 text-sm">
                        已解锁 {unlockedAchievements}/{gameAchievements.length} 个成就
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAchievementModal(false)}
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {gameAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-2xl border-2 text-center ${
                        achievement.unlocked
                          ? "border-amber-200 bg-amber-50"
                          : "border-gray-100 bg-gray-50 opacity-60"
                      }`}
                    >
                      <AchievementBadge
                        achievement={achievement}
                        size="md"
                        showDetails
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {achievement.unlockCondition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 animate-fade-in">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 font-serif">
                  {gameState.drugName}
                </h1>
                <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
                  {gameState.drugCategory}
                </span>
              </div>
              <p className="text-gray-500">
                研发进行中 · 第 {currentStageData?.order || 1}/4 阶段
              </p>
            </div>
            <button
              onClick={() => {
                resetGame();
                navigate("/");
              }}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              退出游戏
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">研发资金</p>
                  <p
                    className={`text-2xl font-bold ${
                      gameState.funds < 200 ? "text-red-500" : "text-gray-900"
                    }`}
                  >
                    {gameState.funds} <span className="text-sm font-normal text-gray-500">万</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">研发周期</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {gameState.totalTime} <span className="text-sm font-normal text-gray-500">月</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">成功概率</p>
                  <p
                    className={`text-2xl font-bold ${
                      gameState.currentSuccessRate < 30
                        ? "text-red-500"
                        : gameState.currentSuccessRate < 60
                        ? "text-amber-500"
                        : "text-green-600"
                    }`}
                  >
                    {gameState.currentSuccessRate}
                    <span className="text-sm font-normal text-gray-500">%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            {gameStages.map((stage) => (
              <GameStageCard
                key={stage.id}
                stage={stage}
                isActive={gameState.currentStage === stage.id}
                isCompleted={
                  currentStageData ? stage.order < currentStageData.order : false
                }
                isLocked={
                  currentStageData ? stage.order > currentStageData.order : false
                }
              />
            ))}
          </div>
        </div>

        {currentStageData && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={`bg-gradient-to-r ${currentStageData.color} p-6 text-white`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  {currentStageData.id === "target-discovery" && (
                    <Target className="w-6 h-6" />
                  )}
                  {currentStageData.id === "lead-optimization" && (
                    <FlaskConical className="w-6 h-6" />
                  )}
                  {currentStageData.id === "clinical-trial" && (
                    <Stethoscope className="w-6 h-6" />
                  )}
                  {currentStageData.id === "regulatory-approval" && (
                    <FileCheck className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{currentStageData.name}</h2>
                  <p className="text-white/80">{currentStageData.description}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  阶段决策进度
                </h3>
                <div className="flex gap-2">
                  {currentStageDecisions.map((_, index) => (
                    <div
                      key={index}
                      className={`flex-1 h-3 rounded-full transition-all duration-500 ${
                        index < gameState.currentDecisionIndex
                          ? "bg-green-500"
                          : index === gameState.currentDecisionIndex
                          ? "bg-primary-500 animate-pulse"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  已完成 {gameState.currentDecisionIndex}/{currentStageDecisions.length} 个决策
                </p>
              </div>

              {stageMessage && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl text-center">
                  <p className="text-blue-600 font-medium">{stageMessage}</p>
                </div>
              )}

              {isProcessing && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">正在评估阶段结果...</p>
                </div>
              )}

              {!isProcessing && !stageMessage && (
                <div className="space-y-4">
                  {currentDecisionData ? (
                    <button
                      onClick={handleOpenDecision}
                      className="w-full p-6 bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-200 rounded-2xl text-left hover:border-primary-400 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
                              待决策
                            </span>
                            <span className="text-sm text-gray-500">
                              决策 {gameState.currentDecisionIndex + 1}/
                              {currentStageDecisions.length}
                            </span>
                          </div>
                          <h4 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                            {currentDecisionData.title}
                          </h4>
                          <p className="text-gray-600">
                            {currentDecisionData.description}
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all">
                          <ArrowRight className="w-6 h-6" />
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className="p-6 bg-green-50 rounded-2xl text-center">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        所有决策已完成
                      </h4>
                      <p className="text-gray-600 mb-6">
                        确认完成本阶段，系统将根据当前成功率计算阶段结果
                      </p>
                      <button
                        onClick={handleCompleteStage}
                        disabled={isProcessing}
                        className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          "处理中..."
                        ) : (
                          <>
                            完成{currentStageData?.name}阶段
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {canCompleteStage && (
                    <button
                      onClick={handleCompleteStage}
                      disabled={isProcessing}
                      className="w-full py-4 bg-gray-100 text-gray-500 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Target className="w-5 h-5" />
                      跳过剩余决策，直接完成阶段
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {showDecisionModal && currentDecision && (
          <DecisionModal
            decision={currentDecision}
            onSelect={handleSelectOption}
            onClose={() => setShowDecisionModal(false)}
          />
        )}

        {showKnowledgeModal && currentKnowledge && (
          <KnowledgePopup
            popup={currentKnowledge}
            onClose={handleCloseKnowledge}
          />
        )}

        {showResultModal && gameResult && (
          <GameResultModal
            result={gameResult}
            drugName={gameState.drugName}
            drugCategory={gameState.drugCategory}
            finalFunds={gameState.funds}
            totalTime={gameState.totalTime}
            finalSuccessRate={gameState.currentSuccessRate}
            newAchievements={gameAchievements.filter((a) =>
              newAchievements.includes(a.id)
            )}
            onPlayAgain={handlePlayAgain}
            onBackToHome={handleBackToHome}
          />
        )}
      </div>
    </div>
  );
}
