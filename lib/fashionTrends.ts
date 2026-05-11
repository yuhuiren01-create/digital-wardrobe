export type TrendCategory = "色彩" | "单品" | "风格" | "面料" | "配饰";

export type FashionTrend = {
  id: string;
  title: string;
  category: TrendCategory;
  description: string;
  tip: string;
  source: string;
  season: "春" | "夏";
  imageUrl: string;
};

export const FASHION_TRENDS_2026_SS: readonly FashionTrend[] = [
  {
    id: "ft-001",
    title: "云上舞白 / 白玛瑙",
    category: "色彩",
    description:
      "Pantone 2026 年度代表色之一，透光灰白色，柔和空灵，象征「重新开始」的纯净画布。极简主义者的新主色。",
    tip: "用一件剪裁精良的白色衬衫搭配同色系阔腿裤，打造 effortless chic。",
    source: "Pantone 2026春夏 · Vogue",
    season: "春",
    imageUrl:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop&q=80",
  },
  {
    id: "ft-002",
    title: "变革蓝绿 / 紫翠玉青色",
    category: "色彩",
    description:
      "介于蓝与绿之间的中性色调，兼具蓝色的沉静理性与绿色的生机活力。WGSN 2026 年度趋势主色，强调可持续再生。",
    tip: "一条丝质醋酸连衣裙用此色最显格调，适合晚宴与日常两穿。",
    source: "WGSN 2026 · Pantone",
    season: "春",
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop&q=80",
  },
  {
    id: "ft-003",
    title: "低腰垮裙 / Drop-Waist Skirt",
    category: "单品",
    description:
      "1920s 爵士时代复兴的重要单品。低腰、及踝或中长，增添慵懒优雅的复古气息。Chanel、Bode 等秀场重点。",
    tip: "搭配修身短款上衣或丝质衬衫，用腰带强调腰线平衡低腰效果。",
    source: "Vogue · Spring 2026 Trends",
    season: "春",
    imageUrl:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop&q=80",
  },
  {
    id: "ft-004",
    title: "粉色衬衫 / Pink Shirting",
    category: "单品",
    description:
      "本季经典衬衫的颠覆性更新。粉色调从浅粉到暗粉全覆盖，Bottega Veneta、Chanel 均以此作为关键单品。",
    tip: "取代白衬衫，搭配深色丹宁或卡其色西裤，既有职业感又不失柔软。",
    source: "Vogue · SS 2026 Must-Haves",
    season: "春",
    imageUrl:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=300&fit=crop&q=80",
  },
  {
    id: "ft-005",
    title: "鼠尾草绿 / Sage Green",
    category: "色彩",
    description:
      "灰调哑光绿，带来平衡与放松感。从秋冬延续至春夏，用于外套、针织衫时最显气质。",
    tip: "一件鼠尾草绿廓形西装外套，内搭白色 T 恤和深色牛仔裤，通勤休闲皆宜。",
    source: "Pantone · 2026春夏中性色",
    season: "夏",
    imageUrl:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=300&fit=crop&q=80",
  },
  {
    id: "ft-006",
    title: "丝巾变主角 / Scarf Dressing",
    category: "风格",
    description:
      "丝巾从配饰升级为造型核心。可作吊带上衣、腰封、头巾，或与西装叠穿。Celine、Hermès、Dries Van Noten 重点趋势。",
    tip: "选一条大印花丝巾，系在腰间作为腰带，或绕在包柄上增添亮点。",
    source: "Vogue · SS 2026 Trends",
    season: "夏",
    imageUrl:
      "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&h=300&fit=crop&q=80",
  },
  {
    id: "ft-007",
    title: "番茄红 / Tomato Red",
    category: "色彩",
    description:
      "比正红温暖、比霓虹实穿。Chanel 秀场关键色，适合格纹、印花或纯色单品，怀旧又现代。",
    tip: "用番茄红半裙搭配基础白 T 或米色针织衫，一件单品点亮全身。",
    source: "CFW 时尚 · 2026春夏女装色彩",
    season: "夏",
    imageUrl:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=300&fit=crop&q=80",
  },
  {
    id: "ft-008",
    title: "天丝羊毛系列",
    category: "面料",
    description:
      "2026 春夏面料新宠。柔软可机洗、天然温和、抗皱透气，将奢华触感与日常实穿性合二为一。",
    tip: "优先投资天丝羊毛针织上衣，质感高级且无需繁琐打理。",
    source: "Vogue · 面料趋势报告",
    season: "夏",
    imageUrl:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop&q=80",
  },
] as const;
