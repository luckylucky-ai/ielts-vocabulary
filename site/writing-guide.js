// 雅思写作方法论 · 手写静态数据（不经构建脚本生成，避免被覆盖）
window.IELTS_WRITING_GUIDE = {
  // ---------------- Task 2 题型攻略 ----------------
  task2: {
    intro: "先判断题型，再套对应结构与连接词。立场要清晰、贯穿全篇；每个主体段一个中心论点，先解释再举例。",
    types: [
      {
        id: "opinion",
        cn: "观点类（同意与否）",
        en: "Opinion · Agree or Disagree",
        cueEn: "To what extent do you agree or disagree?",
        when: "题目给一个陈述，让你表明态度：同意 / 不同意 / 在多大程度上同意。",
        stance: "选一个清晰立场并全文保持一致。可「完全同意」或「部分同意」，但不要骑墙、不要两段互相矛盾。",
        structure: [
          { p: "引言", d: "改写题目背景 + 明确表明你的立场（thesis）。" },
          { p: "主体 1", d: "支持立场的理由一 + 解释 + 例子。" },
          { p: "主体 2", d: "理由二；或先让步对方一个点，再反驳回到自己立场。" },
          { p: "结论", d: "重申立场，呼应两个理由，不加新观点。" },
        ],
        connectors: ["In my opinion", "I firmly believe that", "The main reason is that", "Moreover", "For instance", "Admittedly", "In conclusion"],
        skeleton: [
          "It is often argued that … . While I accept … , I largely (dis)agree because … .",
          "The main reason is that … . For example, … .",
          "A further reason is that … . Admittedly, … , but … .",
          "In conclusion, although … , I believe … .",
        ],
      },
      {
        id: "discussion",
        cn: "讨论双方 + 观点",
        en: "Discussion · Both Views + Opinion",
        cueEn: "Discuss both views and give your own opinion.",
        when: "题目给出两种对立看法，要求讨论双方、并给出你自己的观点。",
        stance: "两方都要写，但你的立场要在引言点明、在其中一段清楚偏向一方（别只客观复述而不表态）。",
        structure: [
          { p: "引言", d: "改写背景 + 提到双方 + 一句话点明你的立场。" },
          { p: "主体 1", d: "一方观点：他们为什么这么认为 + 支撑。" },
          { p: "主体 2", d: "另一方观点 + 支撑，并说明你更认同哪一方及原因。" },
          { p: "结论", d: "概述双方，重申你的立场。" },
        ],
        connectors: ["On the one hand", "Those who … argue that", "On the other hand", "However", "From my perspective", "I am inclined to believe", "On balance"],
        skeleton: [
          "People disagree about whether … . This essay will discuss both views before explaining why I believe … .",
          "On the one hand, some argue that … . This is because … .",
          "On the other hand, others believe … . Personally, I side with this view because … .",
          "In conclusion, while both sides have merit, I believe … .",
        ],
      },
      {
        id: "advantage",
        cn: "利弊类 / 利弊权衡",
        en: "Advantages & Disadvantages",
        cueEn: "Do the advantages outweigh the disadvantages?",
        when: "两种问法：①只让「讨论利弊」（不需表态）；②问「利是否大于弊」（需要给结论表态）。",
        stance: "若问 outweigh，一定要在引言和结论明确「利大于弊」或「弊大于利」，别只罗列。",
        structure: [
          { p: "引言", d: "改写背景 + （若问 outweigh）表明利弊哪个更大。" },
          { p: "主体 1", d: "优点：1–2 个，展开解释 + 例子。" },
          { p: "主体 2", d: "缺点：1–2 个，展开解释 + 例子。" },
          { p: "结论", d: "总结，并（若需要）给出利大于弊 / 弊大于利的判断。" },
        ],
        connectors: ["One major advantage", "A key benefit is that", "On the downside", "A significant drawback", "Nevertheless", "Overall", "the benefits outweigh the drawbacks"],
        skeleton: [
          "… has become increasingly common. Although it brings some drawbacks, I believe its benefits are greater.",
          "The most obvious advantage is that … . For instance, … .",
          "On the downside, however, … . This can lead to … .",
          "In conclusion, despite … , the advantages of … clearly outweigh the disadvantages.",
        ],
      },
      {
        id: "problem",
        cn: "问题 / 对策类",
        en: "Problem–Solution · Cause–Solution",
        cueEn: "What problems does this cause and what measures can solve them?",
        when: "常见变体：problems + solutions / causes + solutions / causes + effects。",
        stance: "不需要个人立场，但要「问什么答什么」，每个对策最好对应一个问题/原因。",
        structure: [
          { p: "引言", d: "改写背景 + 预告要谈的问题(原因)与对策。" },
          { p: "主体 1", d: "问题 / 原因：1–2 个，说清是什么、为什么。" },
          { p: "主体 2", d: "对策 / 影响：针对上面逐一给出可行方案。" },
          { p: "结论", d: "重申问题严重性，概述对策。" },
        ],
        connectors: ["The main problem is that", "This is largely caused by", "As a result", "One effective solution is to", "could be tackled by", "To address this", "In conclusion"],
        skeleton: [
          "In recent years, … has become a serious problem. This essay will examine its causes and suggest solutions.",
          "The primary cause is … , which leads to … .",
          "The most effective solution would be to … . In addition, governments could … .",
          "In conclusion, although … is a complex issue, it can be alleviated by … .",
        ],
      },
      {
        id: "twopart",
        cn: "双问类 / 直接问题",
        en: "Two-part · Direct Question",
        cueEn: "Why is this happening? Is it a positive or negative development?",
        when: "题目抛出两个直接问题（通常各问一件事），要求分别回答。",
        stance: "两个问题都要正面回答；若第二问是「积极还是消极」，要明确选边。",
        structure: [
          { p: "引言", d: "改写背景 + 一句话分别回应两个问题。" },
          { p: "主体 1", d: "回答第一个问题（如原因），展开 + 例子。" },
          { p: "主体 2", d: "回答第二个问题（如评价），展开 + 例子。" },
          { p: "结论", d: "把两个答案合起来收束。" },
        ],
        connectors: ["There are two main reasons", "The primary reason is", "As for whether …", "In my view", "On the whole", "a positive/negative development"],
        skeleton: [
          "More and more people … . This is driven mainly by … , and in my view it is a largely positive/negative trend.",
          "The main reason for this is that … .",
          "As for whether this is positive or negative, I believe … because … .",
          "In conclusion, … happens because … , and overall it is … .",
        ],
      },
      {
        id: "posneg",
        cn: "积极还是消极",
        en: "Positive or Negative Development",
        cueEn: "Is this a positive or negative development?",
        when: "让你评价某个趋势/现象是好是坏（有时与双问合并出现）。",
        stance: "明确选边（积极/消极/总体积极但有代价），别两段完全对半、结论含糊。",
        structure: [
          { p: "引言", d: "改写背景 + 明确表态这是积极还是消极。" },
          { p: "主体 1", d: "支撑你判断的主要方面 + 例子。" },
          { p: "主体 2", d: "第二个方面；或让步相反面再拉回。" },
          { p: "结论", d: "重申总体判断。" },
        ],
        connectors: ["a welcome development", "a worrying trend", "On the positive side", "Conversely", "Admittedly", "On balance", "outweigh"],
        skeleton: [
          "In recent years, … . In my opinion, this is a largely positive/negative development.",
          "On the positive side, … . For example, … .",
          "Admittedly, there are concerns that … , but these are outweighed by … .",
          "In conclusion, despite … , I regard … as a positive/negative change overall.",
        ],
      },
    ],
    // 按功能分类的连接词库
    connectors: [
      { fn: "表达观点", items: ["In my opinion", "From my perspective", "I firmly believe that", "It seems to me that", "I am convinced that"] },
      { fn: "递进 / 补充", items: ["Furthermore", "Moreover", "In addition", "What is more", "Additionally", "Besides this"] },
      { fn: "转折 / 对比", items: ["However", "Nevertheless", "On the other hand", "In contrast", "Whereas", "While"] },
      { fn: "让步", items: ["Admittedly", "Although", "Even though", "Despite the fact that", "While it is true that"] },
      { fn: "因果", items: ["Therefore", "As a result", "Consequently", "This leads to", "Owing to", "Thus"] },
      { fn: "举例", items: ["For instance", "For example", "such as", "To illustrate", "A case in point is"] },
      { fn: "排序 / 列举", items: ["Firstly", "Secondly", "Finally", "First of all", "Subsequently"] },
      { fn: "总结 / 收尾", items: ["In conclusion", "To sum up", "On balance", "All things considered", "In summary"] },
    ],
  },

  // ---------------- 话题观点库（正反观点） ----------------
  ideaBanks: [
    {
      id: "ai-education", cn: "AI / 科技用于教育", en: "AI & Technology in Education", group: "education", essaySlug: "ai-education",
      pros: [
        { en: "Personalised learning at each student's own pace", cn: "按每个学生的节奏个性化学习" },
        { en: "Instant access to vast online resources", cn: "即时获取海量在线资源" },
        { en: "Automates marking, freeing teachers for real teaching", cn: "自动批改，把老师解放去真正教学" },
        { en: "Makes education accessible in remote or poor areas", cn: "让偏远或贫困地区也能获得教育" },
        { en: "Interactive tools boost motivation and engagement", cn: "互动工具提升学习动机与参与度" },
      ],
      cons: [
        { en: "Over-reliance may weaken independent thinking", cn: "过度依赖可能削弱独立思考" },
        { en: "Widens the gap between rich and poor students", cn: "拉大贫富学生之间的数字鸿沟" },
        { en: "Reduces valuable face-to-face interaction", cn: "减少宝贵的师生面对面互动" },
        { en: "Risk of plagiarism and academic dishonesty", cn: "抄袭与学术不诚信的风险" },
        { en: "Data privacy and screen-time concerns for children", cn: "儿童数据隐私与屏幕时间的担忧" },
      ],
    },
    {
      id: "social-media", cn: "社交媒体", en: "Social Media", group: "tech", essaySlug: "social-media-communication",
      pros: [
        { en: "Keeps people connected across long distances", cn: "让人跨越距离保持联系" },
        { en: "Free platform for small businesses and creators", cn: "为小商家和创作者提供免费平台" },
        { en: "Spreads news and raises social awareness fast", cn: "快速传播资讯、提升社会意识" },
        { en: "Helps shy people express themselves", cn: "帮助内向者表达自己" },
      ],
      cons: [
        { en: "Encourages superficial, face-to-face-replacing contact", cn: "助长肤浅交流、取代当面接触" },
        { en: "Spreads misinformation and fake news", cn: "传播错误信息与假新闻" },
        { en: "Harms mental health through comparison and addiction", cn: "攀比与成瘾损害心理健康" },
        { en: "Serious privacy and data-misuse risks", cn: "严重的隐私与数据滥用风险" },
      ],
    },
    {
      id: "remote-work", cn: "远程办公 / 居家学习", en: "Working & Studying from Home", group: "society",
      pros: [
        { en: "Saves commuting time and transport costs", cn: "省下通勤时间与交通成本" },
        { en: "Flexible schedule improves work–life balance", cn: "弹性时间改善工作与生活平衡" },
        { en: "Widens the talent pool beyond one city", cn: "把人才库扩大到一座城市之外" },
        { en: "Fewer commuters means lower carbon emissions", cn: "通勤减少、碳排放降低" },
      ],
      cons: [
        { en: "Blurs the line between work and personal life", cn: "模糊工作与私人生活的界限" },
        { en: "Isolation weakens teamwork and belonging", cn: "孤立感削弱团队协作与归属感" },
        { en: "Home distractions can lower productivity", cn: "居家干扰可能降低效率" },
        { en: "Unequal access to quiet space and fast internet", cn: "安静空间与网络条件不平等" },
      ],
    },
    {
      id: "tourism", cn: "国际旅游", en: "International Tourism", group: "culture", essaySlug: "international-tourism",
      pros: [
        { en: "Creates jobs and brings in foreign currency", cn: "创造就业、带来外汇" },
        { en: "Funds infrastructure that locals also use", cn: "资助基础设施，居民同样受益" },
        { en: "Promotes cultural exchange and understanding", cn: "促进文化交流与相互理解" },
        { en: "Encourages preservation of heritage sites", cn: "促使遗产地得到保护" },
      ],
      cons: [
        { en: "Over-tourism causes crowding and pollution", cn: "过度旅游造成拥挤与污染" },
        { en: "Commercialises and dilutes local traditions", cn: "使当地传统商业化、被稀释" },
        { en: "Seasonal, low-paid and unstable jobs", cn: "季节性、低薪、不稳定的就业" },
        { en: "Pushes up local prices and housing costs", cn: "推高当地物价与房价" },
      ],
    },
    {
      id: "globalisation", cn: "全球化与本土文化", en: "Globalisation & Local Culture", group: "culture", essaySlug: "globalisation-culture",
      pros: [
        { en: "Access to global goods, ideas and technology", cn: "接触全球商品、思想与技术" },
        { en: "Boosts trade, investment and economic growth", cn: "促进贸易、投资与经济增长" },
        { en: "Cross-cultural understanding and tolerance", cn: "增进跨文化理解与包容" },
        { en: "Spreads useful innovation faster", cn: "让有用的创新更快扩散" },
      ],
      cons: [
        { en: "Erodes local languages and traditions", cn: "侵蚀本土语言与传统" },
        { en: "Cultural homogenisation — cities look the same", cn: "文化同质化，城市千篇一律" },
        { en: "Dominance of powerful Western brands", cn: "强势西方品牌的主导" },
        { en: "Widens inequality between and within nations", cn: "拉大国与国、国内的不平等" },
      ],
    },
    {
      id: "environment-responsibility", cn: "环境责任：个人 vs 政府", en: "Protecting the Environment", group: "nature", essaySlug: "environment-responsibility",
      pros: [
        { en: "Individual habits (saving energy, less plastic) add up", cn: "个人习惯（节能、少塑料）累积起来有效" },
        { en: "Public pressure pushes companies to go green", cn: "公众压力促使企业变绿" },
        { en: "Governments can legislate, tax and penalise polluters", cn: "政府能立法、征税、惩罚污染者" },
        { en: "Companies have the tech and funds to change at scale", cn: "企业有技术与资金做规模化改变" },
      ],
      cons: [
        { en: "Individual effort alone is too small for global problems", cn: "仅靠个人对全球问题杯水车薪" },
        { en: "Major pollution comes from industry, not households", cn: "主要污染来自工业而非家庭" },
        { en: "Green choices are often expensive for ordinary people", cn: "环保选择对普通人往往很贵" },
        { en: "Without regulation, firms cut corners to save cost", cn: "缺乏监管时企业为省钱走捷径" },
      ],
    },
    {
      id: "automation", cn: "自动化与就业", en: "Automation & the Job Market", group: "tech", essaySlug: "automation-employment",
      pros: [
        { en: "Higher productivity and lower costs", cn: "提高生产率、降低成本" },
        { en: "Takes over dangerous and repetitive tasks", cn: "接手危险与重复性工作" },
        { en: "Creates new jobs in tech and maintenance", cn: "在技术与维护领域创造新岗位" },
        { en: "Frees people for creative, human-centred work", cn: "把人解放去做创造性、以人为本的工作" },
      ],
      cons: [
        { en: "Mass unemployment among low-skilled workers", cn: "低技能工人大规模失业" },
        { en: "Widens income inequality", cn: "加剧收入不平等" },
        { en: "Costly, difficult retraining for displaced workers", cn: "被取代者再培训成本高、难度大" },
        { en: "Over-reliance on machines is risky if they fail", cn: "过度依赖机器，一旦故障风险大" },
      ],
    },
    {
      id: "online-shopping", cn: "网购 vs 实体店", en: "Online Shopping", group: "society", essaySlug: "online-shopping",
      pros: [
        { en: "Convenient — order anytime, delivered to the door", cn: "便利——随时下单、送货上门" },
        { en: "Wider choice and easy price comparison", cn: "选择更广、比价方便" },
        { en: "Often cheaper due to lower overheads", cn: "成本低，往往更便宜" },
        { en: "Valuable for the elderly and remote areas", cn: "对老人与偏远地区很有价值" },
      ],
      cons: [
        { en: "Decline of high-street shops and town centres", cn: "实体店与市中心衰落" },
        { en: "Deliveries and returns raise the carbon footprint", cn: "配送与退货增加碳足迹" },
        { en: "Cannot try or inspect products first", cn: "无法先试用或查验商品" },
        { en: "Risk of fraud and data theft", cn: "欺诈与数据被盗的风险" },
      ],
    },
    {
      id: "space", cn: "太空探索", en: "Space Exploration", group: "tech", essaySlug: "space-exploration",
      pros: [
        { en: "Spin-off tech: satellites, GPS, medical advances", cn: "衍生技术：卫星、GPS、医学进步" },
        { en: "Deepens scientific knowledge of the universe", cn: "加深对宇宙的科学认识" },
        { en: "May secure humanity's long-term survival", cn: "或关乎人类的长期存续" },
        { en: "Inspires young people into science", cn: "激励年轻人投身科学" },
      ],
      cons: [
        { en: "Extremely expensive while Earth has urgent needs", cn: "极其昂贵，而地球仍有紧迫需求" },
        { en: "Money could fund healthcare, education, poverty", cn: "这些钱可投向医疗、教育、扶贫" },
        { en: "Creates space debris and pollution", cn: "制造太空垃圾与污染" },
        { en: "Benefits are uncertain and very long-term", cn: "收益不确定且极为长远" },
      ],
    },
    {
      id: "advertising", cn: "广告与消费主义", en: "Advertising & Consumerism", group: "culture",
      pros: [
        { en: "Informs buyers about new products and choices", cn: "让消费者了解新产品与选择" },
        { en: "Funds free media, sport and entertainment", cn: "资助免费的媒体、体育与娱乐" },
        { en: "Drives competition, quality and lower prices", cn: "推动竞争、质量与更低价格" },
        { en: "Supports jobs in a large creative industry", cn: "支撑庞大创意产业的就业" },
      ],
      cons: [
        { en: "Creates artificial wants and over-consumption", cn: "制造虚假需求与过度消费" },
        { en: "Can be misleading or manipulate emotions", cn: "可能误导或操纵情绪" },
        { en: "Pressures children and fuels materialism", cn: "对儿童施压、助长物质主义" },
        { en: "Promotes unrealistic body and lifestyle images", cn: "宣扬不切实际的身材与生活方式" },
      ],
    },
  ],

  // ---------------- Task 1 小作文题型 ----------------
  task1: {
    intro: "小作文 20 分钟、至少 150 词。四段最稳：改写题目 → 概述总体特征（Overview，最重要）→ 两段细节。用词客观，不表达个人观点。",
    types: [
      {
        id: "line", cn: "折线图", en: "Line Graph", focus: "随时间的变化趋势：升/降/波动/持平，找出最高点、最低点、交叉点。",
        structure: [
          { p: "引言", d: "改写题目：什么数据、时间范围、单位。" },
          { p: "概述", d: "总体趋势：多数上升还是下降？谁最高谁最低？" },
          { p: "细节 1", d: "描述其中一两条线的关键变化 + 数据。" },
          { p: "细节 2", d: "其余线条或交叉、反超等突出点 + 数据。" },
        ],
        language: [
          { label: "上升", items: ["increase", "rise", "grow", "climb", "surge", "soar"] },
          { label: "下降", items: ["decrease", "fall", "decline", "drop", "plummet", "dip"] },
          { label: "平稳 / 波动", items: ["remain stable", "level off", "plateau", "fluctuate", "peak at", "reach a low of"] },
          { label: "程度副词", items: ["sharply", "dramatically", "steadily", "gradually", "slightly", "marginally"] },
        ],
      },
      {
        id: "bar", cn: "柱状图", en: "Bar Chart", focus: "类别之间的比较：谁最高谁最低、差距大小；若含时间也看趋势。",
        structure: [
          { p: "引言", d: "改写题目：比较的是什么类别与指标。" },
          { p: "概述", d: "最突出的比较：最大 / 最小 / 明显差距。" },
          { p: "细节 1", d: "一组类别的具体数值比较。" },
          { p: "细节 2", d: "另一组或剩余类别的比较。" },
        ],
        language: [
          { label: "比较", items: ["higher than", "lower than", "twice as high as", "far more than", "slightly less than"] },
          { label: "最高 / 最低", items: ["the highest", "the lowest", "the largest", "the smallest", "the second highest"] },
          { label: "占比", items: ["accounted for", "made up", "represented", "the majority of", "a small proportion of"] },
        ],
      },
      {
        id: "pie", cn: "饼图", en: "Pie Chart", focus: "各部分占整体的比例；常需比较两个饼图之间的变化。",
        structure: [
          { p: "引言", d: "改写题目：整体是什么、按什么分类。" },
          { p: "概述", d: "占比最大 / 最小的部分；若两图则总体变化方向。" },
          { p: "细节 1", d: "主要几块的百分比。" },
          { p: "细节 2", d: "次要几块，或两图对比的增减。" },
        ],
        language: [
          { label: "比例", items: ["accounted for", "made up", "represented", "a quarter", "one third", "the largest share"] },
          { label: "变化（两图）", items: ["rose from … to …", "fell by … percentage points", "remained unchanged", "overtook"] },
        ],
      },
      {
        id: "table", cn: "表格", en: "Table", focus: "多组数据，需自己挑重点：找最大、最小、明显趋势，别逐格照抄。",
        structure: [
          { p: "引言", d: "改写题目：表格呈现什么信息。" },
          { p: "概述", d: "最显著的 1–2 个特征 / 极值。" },
          { p: "细节 1", d: "一行或一列的关键数据。" },
          { p: "细节 2", d: "另一行 / 列或对比。" },
        ],
        language: [
          { label: "极值", items: ["the highest figure", "the lowest figure", "peaked at", "as little as", "as much as"] },
          { label: "比较", items: ["compared with", "in contrast", "whereas", "similarly", "by comparison"] },
        ],
      },
      {
        id: "process", cn: "流程图", en: "Process Diagram", focus: "描述步骤/阶段，按顺序走一遍；多用被动语态，不写数据趋势。",
        structure: [
          { p: "引言", d: "改写题目：这是什么过程、共几个阶段。" },
          { p: "概述", d: "起点与终点、总共几步、是否循环。" },
          { p: "细节 1", d: "前半程步骤，按顺序。" },
          { p: "细节 2", d: "后半程步骤直到结束。" },
        ],
        language: [
          { label: "顺序", items: ["First", "Then", "Next", "After that", "Subsequently", "Finally", "Once … is done"] },
          { label: "被动语态", items: ["is collected", "are processed", "is transported", "are converted into", "is then heated"] },
        ],
      },
      {
        id: "map", cn: "地图", en: "Map", focus: "两幅地图对比某地随时间的变化：新增、拆除、扩建、改建、位置关系。",
        structure: [
          { p: "引言", d: "改写题目：哪个地方、哪两个时间点。" },
          { p: "概述", d: "总体变化：从乡村变城镇 / 更工业化 / 更现代等。" },
          { p: "细节 1", d: "某一区域的具体变化。" },
          { p: "细节 2", d: "其余区域的变化。" },
        ],
        language: [
          { label: "方位", items: ["to the north of", "in the south-east", "adjacent to", "opposite", "surrounded by"] },
          { label: "变化", items: ["was demolished", "was replaced by", "a new … was constructed", "was expanded", "was converted into"] },
        ],
      },
      {
        id: "multiple", cn: "混合图", en: "Multiple / Mixed", focus: "两种图一起给（如饼图 + 表格）：先各自概述，再分别取重点，注意留够时间。",
        structure: [
          { p: "引言", d: "改写题目：一共给了哪两类图、分别是什么。" },
          { p: "概述", d: "两张图各自最突出的特征，各一句。" },
          { p: "细节 1", d: "第一张图的关键数据。" },
          { p: "细节 2", d: "第二张图的关键数据，可点出两者关联。" },
        ],
        language: [
          { label: "衔接两图", items: ["Regarding the first chart", "Turning to the table", "As for …", "In terms of"] },
          { label: "关联", items: ["This corresponds to", "which may explain", "in line with", "reflecting"] },
        ],
      },
    ],
  },
};
