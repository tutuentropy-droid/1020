import { Drug, Chapter, MindMapData, MindMapNode, MindMapNodeType } from "@/types";
import { drugs } from "@/data/drugs";
import { chapters } from "@/data/chapters";
import { drugInteractions } from "@/data/drugInteractions";

const generateId = (): string => {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const createNode = (
  name: string,
  type: MindMapNodeType,
  description?: string,
  parentId?: string
): MindMapNode => ({
  id: generateId(),
  name,
  type,
  description,
  parentId,
  children: [],
});

export const generateDrugMindMap = (drug: Drug): MindMapData => {
  const rootId = generateId();

  const rootNode: MindMapNode = {
    id: rootId,
    name: drug.name,
    type: "root",
    description: drug.description,
    children: [],
  };

  const categoryNode = createNode(drug.category, "category", "药物分类", rootId);
  rootNode.children?.push(categoryNode);

  const mechanismNode = createNode("作用机制", "mechanism", drug.mechanism, rootId);
  rootNode.children?.push(mechanismNode);

  const indicationNode = createNode("适应症", "indication", undefined, rootId);
  drug.indications.forEach((indication) => {
    indicationNode.children?.push(
      createNode(indication, "indication", undefined, indicationNode.id)
    );
  });
  rootNode.children?.push(indicationNode);

  const adverseNode = createNode("不良反应", "adverseReaction", undefined, rootId);
  drug.adverseReactions.forEach((reaction) => {
    adverseNode.children?.push(
      createNode(reaction, "adverseReaction", undefined, adverseNode.id)
    );
  });
  rootNode.children?.push(adverseNode);

  const contraindicationNode = createNode("禁忌症", "contraindication", undefined, rootId);
  drug.contraindications.forEach((contra) => {
    contraindicationNode.children?.push(
      createNode(contra, "contraindication", undefined, contraindicationNode.id)
    );
  });
  rootNode.children?.push(contraindicationNode);

  const dosageNode = createNode("用法用量", "dosage", drug.dosage, rootId);
  rootNode.children?.push(dosageNode);

  const pharmacokineticsNode = createNode("药代动力学", "pharmacokinetics", undefined, rootId);
  pharmacokineticsNode.children?.push(
    createNode(`半衰期: ${drug.halfLife}`, "pharmacokinetics", undefined, pharmacokineticsNode.id)
  );
  pharmacokineticsNode.children?.push(
    createNode(`代谢: ${drug.metabolism}`, "pharmacokinetics", undefined, pharmacokineticsNode.id)
  );
  rootNode.children?.push(pharmacokineticsNode);

  const interactions = drugInteractions.filter(
    (di) => di.drugAId === drug.id || di.drugBId === drug.id
  );
  if (interactions.length > 0) {
    const interactionNode = createNode("药物相互作用", "interaction", undefined, rootId);
    interactions.forEach((interaction) => {
      const otherDrugId = interaction.drugAId === drug.id ? interaction.drugBId : interaction.drugAId;
      const otherDrug = drugs.find((d) => d.id === otherDrugId);
      if (otherDrug) {
        const node = createNode(
          `${otherDrug.name} - ${interaction.description}`,
          "interaction",
          interaction.mechanism,
          interactionNode.id
        );
        interactionNode.children?.push(node);
      }
    });
    rootNode.children?.push(interactionNode);
  }

  return {
    id: `mindmap_${rootId}`,
    title: `${drug.name} - 药物思维导图`,
    sourceType: "drug",
    sourceId: drug.id,
    sourceName: drug.name,
    rootNode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generateChapterMindMap = (chapter: Chapter): MindMapData => {
  const rootId = generateId();

  const rootNode: MindMapNode = {
    id: rootId,
    name: chapter.title,
    type: "root",
    description: chapter.description,
    children: [],
  };

  const categoryNode = createNode(chapter.category, "category", "章节分类", rootId);
  rootNode.children?.push(categoryNode);

  const contentLines = chapter.content.split("\n").filter((line) => line.trim());
  let currentMainNode: MindMapNode | null = null;

  for (const line of contentLines) {
    if (line.startsWith("### ")) {
      const sectionName = line.replace("### ", "").trim();
      currentMainNode = createNode(sectionName, "category", undefined, rootId);
      rootNode.children?.push(currentMainNode);
    } else if (line.startsWith("**") && line.endsWith("**") && currentMainNode) {
      const subSection = line.replace(/\*\*/g, "").trim();
      const subNode = createNode(subSection, "mechanism", undefined, currentMainNode.id);
      currentMainNode.children?.push(subNode);
    } else if (line.startsWith("- **") && currentMainNode) {
      const match = line.match(/- \*\*(.+?)\*\*：(.+)/);
      if (match) {
        const [, key, value] = match;
        const nodeType: MindMapNodeType = key.includes("不良反应")
          ? "adverseReaction"
          : key.includes("禁忌症")
          ? "contraindication"
          : key.includes("适应症")
          ? "indication"
          : key.includes("机制")
          ? "mechanism"
          : key.includes("剂量") || key.includes("用法")
          ? "dosage"
          : "category";
        const node = createNode(`${key}: ${value.trim()}`, nodeType, undefined, currentMainNode.id);
        currentMainNode.children?.push(node);
      }
    } else if (line.startsWith("- ") && currentMainNode) {
      const content = line.replace("- ", "").trim();
      if (content.includes("——")) {
        const [name, desc] = content.split("——");
        const node = createNode(name.trim(), "category", desc.trim(), currentMainNode.id);
        currentMainNode.children?.push(node);
      } else if (content.includes("：")) {
        const [key, value] = content.split("：");
        const nodeType: MindMapNodeType = key.includes("不良反应")
          ? "adverseReaction"
          : key.includes("禁忌症")
          ? "contraindication"
          : key.includes("适应症")
          ? "indication"
          : key.includes("机制")
          ? "mechanism"
          : "category";
        const node = createNode(
          `${key.trim()}: ${value.trim()}`,
          nodeType,
          undefined,
          currentMainNode.id
        );
        currentMainNode.children?.push(node);
      } else {
        const node = createNode(content, "category", undefined, currentMainNode.id);
        currentMainNode.children?.push(node);
      }
    }
  }

  if (chapter.quizzes.length > 0) {
    const quizNode = createNode("章节测验", "note", undefined, rootId);
    chapter.quizzes.forEach((quiz, index) => {
      const node = createNode(
        `题目${index + 1}: ${quiz.question}`,
        "note",
        `正确答案: ${quiz.options[quiz.correctAnswer]}`,
        quizNode.id
      );
      quizNode.children?.push(node);
    });
    rootNode.children?.push(quizNode);
  }

  return {
    id: `mindmap_${rootId}`,
    title: `${chapter.title} - 章节思维导图`,
    sourceType: "chapter",
    sourceId: chapter.id,
    sourceName: chapter.title,
    rootNode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generateMindMap = (
  sourceType: "drug" | "chapter",
  sourceId: string
): MindMapData | null => {
  if (sourceType === "drug") {
    const drug = drugs.find((d) => d.id === sourceId);
    if (drug) {
      return generateDrugMindMap(drug);
    }
  } else {
    const chapter = chapters.find((c) => c.id === sourceId);
    if (chapter) {
      return generateChapterMindMap(chapter);
    }
  }
  return null;
};

export const flattenMindMapNodes = (node: MindMapNode): MindMapNode[] => {
  let nodes: MindMapNode[] = [{ ...node, children: undefined }];
  if (node.children) {
    for (const child of node.children) {
      nodes = [...nodes, ...flattenMindMapNodes(child)];
    }
  }
  return nodes;
};

export const mindMapNodeTypeConfig: Record<MindMapNodeType, { color: string; label: string }> = {
  root: { color: "#6366F1", label: "中心主题" },
  category: { color: "#8B5CF6", label: "分类" },
  mechanism: { color: "#06B6D4", label: "作用机制" },
  indication: { color: "#10B981", label: "适应症" },
  adverseReaction: { color: "#F59E0B", label: "不良反应" },
  contraindication: { color: "#EF4444", label: "禁忌症" },
  interaction: { color: "#EC4899", label: "药物相互作用" },
  dosage: { color: "#14B8A6", label: "用法用量" },
  pharmacokinetics: { color: "#3B82F6", label: "药代动力学" },
  note: { color: "#6B7280", label: "笔记" },
};
