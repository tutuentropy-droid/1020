import {
  PediatricDoseParams,
  PediatricDoseResult,
  CreatinineClearanceParams,
  CreatinineClearanceResult,
  BodySurfaceAreaParams,
  BodySurfaceAreaResult,
  LoadingDoseParams,
  MaintenanceDoseParams,
  DoseResult,
  TDMSimulationParams,
  TDMSimulationResult,
  PKCurveData,
} from "@/types";
import { tdmDrugs } from "@/data/tdmDrugs";

export function formatNumber(num: number, decimals: number = 2): string {
  return Number.isInteger(num) ? num.toString() : num.toFixed(decimals);
}

export function calculatePediatricDose(
  params: PediatricDoseParams
): PediatricDoseResult {
  const { adultDose, childWeight } = params;
  const childDose = (adultDose * childWeight) / 70;

  const derivation = [
    "使用Clark法则（按体重比例换算）：",
    `儿童剂量 = 成人剂量 × 儿童体重(kg) / 70`,
    `儿童剂量 = ${adultDose} mg × ${childWeight} kg / 70 kg`,
    `儿童剂量 = ${adultDose} × ${formatNumber(childWeight / 70, 4)}`,
    `儿童剂量 ≈ ${formatNumber(childDose)} mg`,
  ];

  return {
    childDose,
    formula: "儿童剂量 = 成人剂量 × 儿童体重(kg) / 70 kg",
    derivation,
  };
}

export function calculateCreatinineClearance(
  params: CreatinineClearanceParams
): CreatinineClearanceResult {
  const { age, weight, gender, creatinine, unit } = params;

  let scrMgDl = creatinine;
  let unitConversionStep = "";

  if (unit === "μmol/L") {
    scrMgDl = creatinine / 88.4;
    unitConversionStep = `单位换算：${creatinine} μmol/L ÷ 88.4 = ${formatNumber(
      scrMgDl
    )} mg/dL`;
  }

  const maleCrcl = ((140 - age) * weight) / (72 * scrMgDl);
  const crcl = gender === "female" ? maleCrcl * 0.85 : maleCrcl;
  const egfr = (crcl / 1.73).toFixed(1);

  const derivation: string[] = [];

  if (unitConversionStep) {
    derivation.push(unitConversionStep);
  }

  derivation.push(
    "使用Cockcroft-Gault公式："
  );

  if (gender === "male") {
    derivation.push(
      `CrCl = (140 - 年龄) × 体重(kg) / (72 × SCr(mg/dL))`
    );
    derivation.push(
      `CrCl = (140 - ${age}) × ${weight} / (72 × ${formatNumber(scrMgDl, 2)})`
    );
    derivation.push(
      `CrCl = ${140 - age} × ${weight} / ${formatNumber(72 * scrMgDl, 2)}`
    );
    derivation.push(`CrCl = ${formatNumber((140 - age) * weight)} / ${formatNumber(72 * scrMgDl, 2)}`);
  } else {
    derivation.push(
      `男性: CrCl = (140 - 年龄) × 体重 / (72 × SCr)`
    );
    derivation.push(`女性: CrCl = 男性值 × 0.85`);
    derivation.push(
      `男性基础值 = (140 - ${age}) × ${weight} / (72 × ${formatNumber(scrMgDl, 2)}) = ${formatNumber(maleCrcl)} mL/min`
    );
    derivation.push(`女性校正值 = ${formatNumber(maleCrcl)} × 0.85`);
  }

  derivation.push(`CrCl ≈ ${formatNumber(crcl)} mL/min`);
  derivation.push(`eGFR ≈ ${egfr} mL/min/1.73m²`);

  let stage = "";
  let stageColor = "";
  const egfrNum = parseFloat(egfr);

  if (egfrNum >= 90) {
    stage = "CKD 1期 - 肾功能正常或升高";
    stageColor = "bg-green-50 text-green-700 border-green-200";
  } else if (egfrNum >= 60) {
    stage = "CKD 2期 - 肾功能轻度下降";
    stageColor = "bg-lime-50 text-lime-700 border-lime-200";
  } else if (egfrNum >= 45) {
    stage = "CKD 3a期 - 肾功能轻中度下降";
    stageColor = "bg-yellow-50 text-yellow-700 border-yellow-200";
  } else if (egfrNum >= 30) {
    stage = "CKD 3b期 - 肾功能中重度下降";
    stageColor = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (egfrNum >= 15) {
    stage = "CKD 4期 - 肾功能重度下降";
    stageColor = "bg-orange-50 text-orange-700 border-orange-200";
  } else {
    stage = "CKD 5期 - 肾衰竭";
    stageColor = "bg-red-50 text-red-700 border-red-200";
  }

  return {
    crcl,
    egfr: parseFloat(egfr),
    formula:
      "Cockcroft-Gault公式：CrCl = (140-年龄)×体重/(72×SCr) [×0.85（女性）]",
    derivation,
    stage,
    stageColor,
  };
}

export function calculateBodySurfaceArea(
  params: BodySurfaceAreaParams
): BodySurfaceAreaResult {
  const { height, weight } = params;

  const bsa = 0.007184 * Math.pow(height, 0.725) * Math.pow(weight, 0.425);
  const bsaMosteller = Math.sqrt((height * weight) / 3600);

  const derivation = [
    "使用Du Bois公式（最经典方法）：",
    "BSA (m²) = 0.007184 × 身高(cm)^0.725 × 体重(kg)^0.425",
    `身高^0.725 = ${height}^0.725 ≈ ${formatNumber(
      Math.pow(height, 0.725),
      2
    )}`,
    `体重^0.425 = ${weight}^0.425 ≈ ${formatNumber(
      Math.pow(weight, 0.425),
      2
    )}`,
    `BSA = 0.007184 × ${formatNumber(Math.pow(height, 0.725), 2)} × ${formatNumber(
      Math.pow(weight, 0.425),
      2
    )}`,
    `BSA = 0.007184 × ${formatNumber(
      Math.pow(height, 0.725) * Math.pow(weight, 0.425),
      2
    )}`,
    `BSA ≈ ${formatNumber(bsa)} m²`,
    "",
    `Mosteller简化公式验证：√(身高×体重/3600) ≈ ${formatNumber(
      bsaMosteller
    )} m²`,
  ];

  return {
    bsa,
    formula: "Du Bois公式：BSA = 0.007184 × H^0.725 × W^0.425",
    derivation,
    method: "Du Bois法",
  };
}

export function calculateLoadingDose(
  params: LoadingDoseParams
): { loadingDose: number; derivation: string[]; formula: string } {
  const { targetConcentration, volumeOfDistribution, bioavailability } = params;

  const loadingDose =
    (targetConcentration * volumeOfDistribution) / bioavailability;

  const derivation = [
    "负荷剂量公式：",
    "LD = Ctarget × Vd / F",
    "其中：Ctarget = 目标血药浓度，Vd = 分布容积，F = 生物利用度",
    `LD = ${targetConcentration} × ${volumeOfDistribution} / ${bioavailability}`,
    `LD = ${formatNumber(targetConcentration * volumeOfDistribution)} / ${bioavailability}`,
    `LD ≈ ${formatNumber(loadingDose)}`,
  ];

  return {
    loadingDose,
    derivation,
    formula: "负荷剂量 LD = Ctarget × Vd / F",
  };
}

export function calculateMaintenanceDose(
  params: MaintenanceDoseParams
): DoseResult {
  const { targetConcentration, clearance, bioavailability, dosingInterval } =
    params;

  const maintenanceDose =
    (targetConcentration * clearance * dosingInterval) / bioavailability;
  const dailyDose = (maintenanceDose * 24) / dosingInterval;

  const derivation = [
    "维持剂量公式（基于清除率）：",
    "MD = Css,avg × Cl × τ / F",
    "其中：Css,avg = 平均稳态浓度，Cl = 清除率，τ = 给药间隔，F = 生物利用度",
    `MD = ${targetConcentration} × ${clearance} × ${dosingInterval} / ${bioavailability}`,
    `MD = ${formatNumber(
      targetConcentration * clearance * dosingInterval
    )} / ${bioavailability}`,
    `MD ≈ ${formatNumber(maintenanceDose)}`,
    `日剂量 = MD × (24h / τ) = ${formatNumber(maintenanceDose)} × ${formatNumber(
      24 / dosingInterval,
      2
    )} ≈ ${formatNumber(dailyDose)}`,
  ];

  return {
    maintenanceDose,
    dailyDose,
    formula: "维持剂量 MD = Css × Cl × τ / F",
    derivation,
  };
}

export function calculateDoses(
  loadingParams: LoadingDoseParams,
  maintenanceParams: MaintenanceDoseParams
): DoseResult {
  const loading = calculateLoadingDose(loadingParams);
  const maintenance = calculateMaintenanceDose(maintenanceParams);

  return {
    loadingDose: loading.loadingDose,
    maintenanceDose: maintenance.maintenanceDose,
    dailyDose: maintenance.dailyDose,
    formula: `${loading.formula}\n${maintenance.formula}`,
    derivation: [...loading.derivation, "", ...maintenance.derivation],
  };
}

export function simulateTDM(
  params: TDMSimulationParams
): TDMSimulationResult {
  const {
    drugId,
    dose,
    dosingInterval,
    administrationTime,
    sampleTime,
    infusionDuration,
    dosesGiven,
  } = params;

  const drug = tdmDrugs.find((d) => d.id === drugId);
  if (!drug) {
    return {
      predictedConcentration: 0,
      interpretation: "未找到该药物参数",
      status: "subtherapeutic",
      statusColor: "bg-gray-50 text-gray-700 border-gray-200",
      formula: "",
      derivation: [],
      recommendations: ["请选择有效的药物"],
    };
  }

  const timeSinceDose = sampleTime - administrationTime;
  const kel = 0.693 / drug.halfLife;
  const vdTotal = drug.volumeOfDistribution * 70;
  const cl = drug.clearance * 70;

  let predictedConcentration: number;
  const derivation: string[] = [];

  derivation.push(`药物：${drug.name}（治疗窗：${drug.therapeuticRange} ${drug.unit}）`);
  derivation.push("");

  if (dosesGiven >= 4) {
    derivation.push("假设已达稳态（给药≥4剂，约4个半衰期）");
    derivation.push("稳态血药浓度估算：");

    if (timeSinceDose <= infusionDuration) {
      derivation.push("采样时机：输注期间");
      predictedConcentration =
        (dose / (cl * dosingInterval)) *
        (1 - Math.exp(-kel * timeSinceDose)) /
        (1 - Math.exp(-kel * dosingInterval));
      derivation.push(
        `C(输注中) = (D / Cl×τ) × (1 - e^(-k×t)) / (1 - e^(-k×τ))`
      );
    } else {
      const timeAfterInfusion = timeSinceDose - infusionDuration;
      derivation.push(`采样时机：输注结束后${formatNumber(timeAfterInfusion)}小时`);
      const peakConc =
        (dose / (vdTotal * infusionDuration * kel)) *
        (1 - Math.exp(-kel * infusionDuration)) /
        (1 - Math.exp(-kel * dosingInterval));
      predictedConcentration = peakConc * Math.exp(-kel * timeAfterInfusion);
      derivation.push(`Cpeak ≈ ${formatNumber(peakConc, 2)} ${drug.unit}`);
      derivation.push(
        `C = Cpeak × e^(-k×t) = ${formatNumber(peakConc, 2)} × e^(-${formatNumber(
          kel,
          4
        )}×${formatNumber(timeAfterInfusion)})`
      );
    }
  } else {
    derivation.push("未达稳态（给药<4剂），使用单剂量模型估算");
    predictedConcentration =
      (dose * drug.bioavailability) /
      vdTotal *
      Math.exp(-kel * timeSinceDose);
    derivation.push("单剂量静脉给药后浓度：");
    derivation.push(`C = (F×D / Vd) × e^(-k×t)`);
    derivation.push(
      `C = (${drug.bioavailability}×${dose} / ${formatNumber(vdTotal)}) × e^(-${formatNumber(
        kel,
        4
      )}×${formatNumber(timeSinceDose)})`
    );
  }

  derivation.push(
    `C = ${formatNumber(predictedConcentration, 2)} ${drug.unit}`
  );

  let status: "subtherapeutic" | "therapeutic" | "toxic";
  let statusColor: string;
  let interpretation: string;
  let recommendations: string[] = [];

  if (predictedConcentration < drug.therapeuticMin) {
    status = "subtherapeutic";
    statusColor = "bg-blue-50 text-blue-700 border-blue-200";
    interpretation = "血药浓度低于治疗窗，可能疗效不足";
    recommendations = [
      "考虑增加给药剂量或缩短给药间隔",
      "评估患者依从性和吸收情况",
      "确认采样时机是否正确",
      "加强临床疗效监测",
    ];
  } else if (predictedConcentration > drug.toxicLevel) {
    status = "toxic";
    statusColor = "bg-red-50 text-red-700 border-red-200";
    interpretation = "血药浓度超出中毒阈值，存在中毒风险";
    recommendations = [
      "立即停药或暂停给药",
      "评估中毒症状和体征",
      "考虑给予解毒或支持治疗",
      "待浓度下降后调整方案重新开始",
      "增加监测频率",
    ];
  } else if (predictedConcentration > drug.therapeuticMax) {
    status = "toxic";
    statusColor = "bg-orange-50 text-orange-700 border-orange-200";
    interpretation = "血药浓度超过治疗上限，需警惕不良反应";
    recommendations = [
      "考虑适当减少剂量或延长给药间隔",
      "密切观察是否出现药物不良反应",
      "1-2个剂量间隔后复查血药浓度",
      "评估患者肝肾功能状态",
    ];
  } else {
    status = "therapeutic";
    statusColor = "bg-green-50 text-green-700 border-green-200";
    interpretation = "血药浓度处于治疗窗内，方案适宜";
    recommendations = [
      "维持当前给药方案",
      "按常规频率继续监测",
      "关注临床疗效和不良反应",
      "肝肾功能变化时重新评估",
    ];
  }

  return {
    predictedConcentration,
    interpretation,
    status,
    statusColor,
    formula:
      "稳态浓度：Css = F×D / (Cl×τ)；峰谷浓度：C = Cpeak × e^(-k×t)",
    derivation,
    recommendations,
  };
}

export function generatePKCurve(params: {
  drugId: string;
  dose: number;
  dosingInterval: number;
  numDoses?: number;
  infusionDuration?: number;
  weight?: number;
}): PKCurveData {
  const {
    drugId,
    dose,
    dosingInterval,
    numDoses = 5,
    infusionDuration = 0.5,
    weight = 70,
  } = params;

  const drug = tdmDrugs.find((d) => d.id === drugId);
  if (!drug) {
    return { points: [], cmax: 0, cmin: 0, cssAvg: 0, timeToSteadyState: 0 };
  }

  const kel = 0.693 / drug.halfLife;
  const vdTotal = drug.volumeOfDistribution * weight;
  const F = drug.bioavailability;
  const tau = dosingInterval;

  const timeToSteadyState = 4 * drug.halfLife;

  const isIV = infusionDuration > 0 && drug.bioavailability >= 0.9;
  const tInf = isIV ? infusionDuration : 0;

  const totalTime = numDoses * tau;
  const dt = totalTime > 100 ? 0.5 : 0.25;
  const points: { time: number; concentration: number }[] = [];

  for (let t = 0; t <= totalTime + 0.001; t += dt) {
    let conc = 0;

    for (let n = 0; n < numDoses; n++) {
      const tSinceDose = t - n * tau;

      if (tSinceDose < 0) continue;

      if (isIV && tInf > 0) {
        const r0 = (F * dose) / (vdTotal * tInf);

        if (tSinceDose <= tInf) {
          const term1 = (1 - Math.exp(-kel * tSinceDose)) / kel;
          conc += r0 * term1 * (n === 0 ? 1 : (1 - Math.exp(-kel * (t - n * tau + tau))) / (1 - Math.exp(-kel * tau)));
        } else {
          const term1 = (1 - Math.exp(-kel * tInf)) / kel;
          const concAtEndInf = r0 * term1;
          conc += concAtEndInf * Math.exp(-kel * (tSinceDose - tInf));
        }
      } else {
        const ka = 2.0;
        const ke = kel;

        if (tSinceDose > 0) {
          const term = Math.exp(-ke * tSinceDose) - Math.exp(-ka * tSinceDose);
          if (term > 0) {
            const doseConc = (F * dose * ka) / (vdTotal * (ka - ke)) * term;
            conc += doseConc;
          }
        }
      }
    }

    if (conc < 0) conc = 0;
    points.push({ time: Math.round(t * 1000) / 1000, concentration: conc });
  }

  const cssAvg = (F * dose) / (drug.clearance * weight * tau);

  let cmax = 0;
  let cmin = Infinity;
  const lastIntervalStart = (numDoses - 1) * tau;
  for (const p of points) {
    if (p.time >= lastIntervalStart) {
      if (p.concentration > cmax) cmax = p.concentration;
      if (p.concentration < cmin) cmin = p.concentration;
    }
  }
  if (!isFinite(cmin)) cmin = 0;

  return {
    points,
    cmax,
    cmin,
    cssAvg,
    timeToSteadyState,
  };
}
