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
      id: "ai-solutionism", cn: "人工智能：热望与局限", en: "Artificial Intelligence — Hype vs Reality", group: "tech", essaySlug: "ai-society",
      pros: [
        { en: "May help cure diseases and speed up medical research", cn: "有望助力攻克疾病、加速医学研究" },
        { en: "Accelerates innovation and boosts human creativity", cn: "加速创新、激发人类创造力" },
        { en: "Excels at narrow, well-defined everyday tasks", cn: "擅长具体、界定清晰的日常任务" },
        { en: "Processes vast datasets far beyond human capacity", cn: "处理远超人力的海量数据" },
        { en: "Frees human experts to focus on judgement", cn: "把专家解放去做判断与决策" },
      ],
      cons: [
        { en: "AI solutionism — the myth that more data solves everything", cn: "「AI 万能论」：以为数据够多就能解决一切" },
        { en: "There is no single AI solution for every problem", cn: "没有能解决一切问题的万用 AI 方案" },
        { en: "The public sector lacks the data infrastructure and talent to use it", cn: "公共部门缺乏可用的数据基础设施与人才" },
        { en: "Highly vulnerable to adversarial attacks, yet security is overlooked", cn: "易受对抗性攻击，安全却常被忽视" },
        { en: "Real-world deployment takes far longer than the hype suggests", cn: "真正落地远比炒作慢得多" },
        { en: "Can amplify bias and lose trust — biased sentencing tools and IBM Watson for Oncology were abandoned", cn: "可能放大偏见、遭人不信任（有偏见的量刑工具、IBM Watson 肿瘤项目都被弃用）" },
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
      id: "remote-work", cn: "远程办公 / 居家学习", en: "Working & Studying from Home", group: "society", essaySlug: "working-from-home",
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
      id: "advertising", cn: "广告与消费主义", en: "Advertising & Consumerism", group: "culture", essaySlug: "advertising-consumerism",
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
    {
      id: "crime-punishment", cn: "严厉惩罚 vs 预防改造", en: "Tough Punishment vs Prevention", group: "society", essaySlug: "prison-sentences",
      pros: [
        { en: "Longer sentences deter potential offenders", cn: "更长刑期威慑潜在罪犯" },
        { en: "Removing dangerous criminals protects the public", cn: "隔离危险罪犯、保护公众" },
        { en: "Firm punishment delivers justice for victims", cn: "严惩为受害者伸张正义" },
        { en: "Clear consequences uphold the rule of law", cn: "明确后果维护法治" },
      ],
      cons: [
        { en: "Prison often fails to reform and hardens offenders", cn: "监狱难改造、甚至使人更冷硬" },
        { en: "High reoffending rates after release", cn: "出狱后重犯率高" },
        { en: "Tackling root causes (poverty, education) works better", cn: "治理根源（贫困、教育）更有效" },
        { en: "Rehabilitation and community service reintegrate offenders", cn: "改造与社区服务助其回归社会" },
      ],
    },
    {
      id: "climate-change", cn: "气候变化与清洁能源", en: "Climate Change & Clean Energy", group: "nature", essaySlug: "renewable-energy",
      pros: [
        { en: "Cuts greenhouse gases and slows global warming", cn: "减少温室气体、减缓全球变暖" },
        { en: "Renewable energy is now cheap and creates jobs", cn: "可再生能源已便宜且创造就业" },
        { en: "Reduces reliance on finite fossil fuels", cn: "降低对有限化石燃料的依赖" },
        { en: "Improves air quality and public health", cn: "改善空气质量与公共健康" },
      ],
      cons: [
        { en: "High upfront cost of new infrastructure", cn: "新基础设施前期成本高" },
        { en: "Solar and wind are intermittent and need storage", cn: "风光间歇性、需储能" },
        { en: "Job losses in traditional fossil-fuel industries", cn: "传统化石能源行业失业" },
        { en: "Requires global cooperation that is hard to secure", cn: "需难以达成的全球合作" },
      ],
    },
    {
      id: "health-government", cn: "政府与公众健康", en: "Government & Public Health", group: "culture", essaySlug: "preventive-health",
      pros: [
        { en: "Prevention is cheaper than treating illness later", cn: "预防比日后治疗更省钱" },
        { en: "Taxing junk food cuts obesity and disease", cn: "对垃圾食品征税可降低肥胖与疾病" },
        { en: "Public campaigns promote healthier habits", cn: "公共宣传推广健康习惯" },
        { en: "Eases the long-term burden on hospitals", cn: "减轻医院的长期负担" },
      ],
      cons: [
        { en: "Diet and lifestyle are personal choices", cn: "饮食与生活方式是个人选择" },
        { en: "Food taxes hit poorer families hardest", cn: "食品税对穷人打击最大" },
        { en: "Governments have more urgent priorities", cn: "政府有更紧迫的优先事项" },
        { en: "Heavy control feels like a nanny state", cn: "过度干预像保姆式国家" },
      ],
    },
    {
      id: "fitness-lifestyle", cn: "运动与久坐生活", en: "Exercise & Sedentary Lifestyles", group: "culture", essaySlug: "physical-activity",
      pros: [
        { en: "Prevents obesity, heart disease and diabetes", cn: "预防肥胖、心脏病与糖尿病" },
        { en: "Improves mental health and reduces stress", cn: "改善心理健康、缓解压力" },
        { en: "Team sport builds discipline and friendships", cn: "团队运动培养自律与友谊" },
        { en: "Lowers long-term healthcare costs", cn: "降低长期医疗成本" },
      ],
      cons: [
        { en: "Desk jobs and screens keep people seated", cn: "办公室与屏幕让人久坐" },
        { en: "Cars and lifts replace daily walking", cn: "汽车电梯取代日常步行" },
        { en: "Long working hours leave little time to exercise", cn: "长工时挤占运动时间" },
        { en: "Cheap fast food and convenience culture", cn: "廉价快餐与便利文化" },
      ],
    },
    {
      id: "subject-choice", cn: "大学专业：实用 vs 兴趣", en: "University: Vocational vs Academic", group: "education", essaySlug: "subject-choice",
      pros: [
        { en: "Job-focused subjects boost employability", cn: "就业导向的专业提升就业力" },
        { en: "Meets the economy's demand for STEM skills", cn: "满足经济对理工技能的需求" },
        { en: "Faster return on tuition investment", cn: "学费投资回报更快" },
        { en: "Helps reduce graduate unemployment", cn: "有助减少毕业生失业" },
      ],
      cons: [
        { en: "Arts and humanities build critical thinking", cn: "人文艺术培养批判性思维" },
        { en: "Passion drives better results than pressure", cn: "兴趣比压力更能出成绩" },
        { en: "Job markets change; broad education adapts", cn: "就业市场多变，通识更能适应" },
        { en: "Society also needs artists and thinkers", cn: "社会也需要艺术家与思想者" },
      ],
    },
    {
      id: "free-university", cn: "大学是否应免费", en: "Free University Education", group: "education", essaySlug: "university-tuition",
      pros: [
        { en: "Equal opportunity regardless of family income", cn: "不论家庭收入的机会平等" },
        { en: "Boosts social mobility and cuts inequality", cn: "提升社会流动、缩小不平等" },
        { en: "A skilled population benefits the economy", cn: "高素质人口惠及整个经济" },
        { en: "Graduates avoid huge student debt", cn: "毕业生不背巨额债务" },
      ],
      cons: [
        { en: "Heavy burden on taxpayers who never attend", cn: "纳税人负担重，许多人没上过大学" },
        { en: "Subsidises wealthy families who can pay", cn: "补贴本可负担的富裕家庭" },
        { en: "Free places may lower motivation and quality", cn: "免费可能降低动力与质量" },
        { en: "Means-tested support is fairer than free-for-all", cn: "按需资助比全免更公平" },
      ],
    },
    {
      id: "online-learning", cn: "在线学习 vs 传统课堂", en: "Online vs Classroom Learning", group: "education", essaySlug: "online-education",
      pros: [
        { en: "Flexible — study anytime, anywhere", cn: "灵活：随时随地学习" },
        { en: "Cheaper and reaches remote learners", cn: "更便宜、覆盖偏远学习者" },
        { en: "Huge range of courses and recorded lessons", cn: "课程丰富、可回放" },
        { en: "Learners progress at their own pace", cn: "按自己节奏学习" },
      ],
      cons: [
        { en: "Face-to-face interaction aids understanding", cn: "面对面互动助理解" },
        { en: "Classroom routine and discipline keep focus", cn: "课堂作息与纪律助专注" },
        { en: "Immediate feedback from teachers", cn: "老师即时反馈" },
        { en: "Social skills develop better in person", cn: "社交能力当面更易培养" },
      ],
    },
    {
      id: "work-life-balance", cn: "工作与生活平衡", en: "Work–Life Balance & Long Hours", group: "society", essaySlug: "long-working-hours",
      pros: [
        { en: "Rest boosts productivity and creativity", cn: "休息提升效率与创造力" },
        { en: "Better mental and physical health", cn: "更好的身心健康" },
        { en: "More time for family and community", cn: "更多时间陪家人与社区" },
        { en: "Reduces burnout and staff turnover", cn: "减少倦怠与离职" },
      ],
      cons: [
        { en: "Some jobs and deadlines demand long hours", cn: "有些工作与截止期需长时间投入" },
        { en: "Overwork can raise short-term output and pay", cn: "加班短期提高产出与收入" },
        { en: "Competitive economies pressure people to work more", cn: "竞争经济迫人多干" },
        { en: "Technology extends the working day", cn: "技术延长了工作日" },
      ],
    },
    {
      id: "ageing-population", cn: "人口老龄化", en: "Ageing Population", group: "society", essaySlug: "ageing-population",
      pros: [
        { en: "Longer, healthier lives are an achievement", cn: "更长寿更健康是人类成就" },
        { en: "Experienced older workers and volunteers add value", cn: "有经验的老年劳动者与志愿者有价值" },
        { en: "Grandparents provide childcare and support", cn: "祖辈提供育儿与家庭支持" },
        { en: "A growing silver economy creates markets", cn: "银发经济创造新市场" },
      ],
      cons: [
        { en: "Fewer workers must support more retirees", cn: "更少劳动者供养更多退休者" },
        { en: "Rising pension and healthcare costs", cn: "养老金与医疗成本上升" },
        { en: "Strain on hospitals and eldercare", cn: "医院与养老服务压力大" },
        { en: "Labour shortages may slow the economy", cn: "劳动力短缺或拖慢经济" },
      ],
    },
    {
      id: "public-transport", cn: "公共交通 vs 私家车", en: "Public Transport vs Private Cars", group: "city", essaySlug: "traffic-congestion",
      pros: [
        { en: "Cuts congestion and saves commuting time", cn: "减少拥堵、节省通勤时间" },
        { en: "Lowers emissions and air pollution", cn: "降低排放与空气污染" },
        { en: "Cheaper for users than owning a car", cn: "比养车更省钱" },
        { en: "Uses road and parking space efficiently", cn: "更高效利用道路与停车空间" },
      ],
      cons: [
        { en: "Cars offer door-to-door convenience", cn: "私家车门到门便利、自由" },
        { en: "Public transport is poor in rural areas", cn: "乡村公共交通差" },
        { en: "Building transit systems is slow and costly", cn: "建轨道交通慢且贵" },
        { en: "Essential for families and carrying goods", cn: "对家庭与运货必要" },
      ],
    },
    {
      id: "heritage-buildings", cn: "保护老建筑 vs 重建", en: "Preserving Old Buildings vs Redevelopment", group: "city", essaySlug: "historic-buildings",
      pros: [
        { en: "Preserves cultural heritage and identity", cn: "保存文化遗产与身份认同" },
        { en: "Historic landmarks attract tourists", cn: "历史地标吸引游客" },
        { en: "Connects people to their history", cn: "让人与历史相连" },
        { en: "Adds character that modern towers lack", cn: "赋予现代高楼欠缺的韵味" },
      ],
      cons: [
        { en: "Old buildings are costly to maintain", cn: "老建筑维护昂贵" },
        { en: "They often lack modern facilities and safety", cn: "常缺现代设施与安全" },
        { en: "They waste valuable land in crowded cities", cn: "在拥挤城市浪费宝贵土地" },
        { en: "New buildings serve growing populations better", cn: "新建筑更好服务增长人口" },
      ],
    },
    {
      id: "parenting-children", cn: "孩子成长：父母 vs 社会影响", en: "Children: Parents vs Wider Influences", group: "society", essaySlug: "children-upbringing",
      pros: [
        { en: "Parents shape early values and behaviour", cn: "父母塑造早期价值观与行为" },
        { en: "A stable home builds confidence and security", cn: "稳定家庭培养自信与安全感" },
        { en: "Parents model habits children copy", cn: "父母是孩子模仿的榜样" },
        { en: "Early parental support predicts later success", cn: "早期父母支持预示日后成功" },
      ],
      cons: [
        { en: "Teachers and schools shape knowledge and discipline", cn: "老师与学校塑造知识与纪律" },
        { en: "Peers strongly influence teenagers", cn: "同伴对青少年影响巨大" },
        { en: "Media and the internet shape children's views", cn: "媒体与网络塑造孩子观念" },
        { en: "Parents cannot control every outside factor", cn: "父母无法掌控一切外部因素" },
      ],
    },
    {
      id: "news-media", cn: "新闻媒体与名人文化", en: "News Media & Celebrity Culture", group: "culture", essaySlug: "news-media",
      pros: [
        { en: "Keeps citizens informed and holds power to account", cn: "让公民知情、监督权力" },
        { en: "Spreads awareness of important issues fast", cn: "快速传播重要议题" },
        { en: "Educates and entertains a mass audience", cn: "教育并娱乐大众" },
        { en: "Gives a platform to different views", cn: "为不同声音提供平台" },
      ],
      cons: [
        { en: "Sensationalism and fake news mislead people", cn: "煽情与假新闻误导公众" },
        { en: "Celebrity obsession sets poor role models", cn: "追星文化树立不良榜样" },
        { en: "Constant bad news raises anxiety", cn: "负面新闻不断加剧焦虑" },
        { en: "Media bias can manipulate public opinion", cn: "媒体偏见操纵舆论" },
      ],
    },
    {
      id: "government-spending", cn: "政府开支优先什么", en: "Government Spending Priorities", group: "society", essaySlug: "arts-funding",
      pros: [
        { en: "Arts, science and sport enrich life and identity", cn: "艺术、科研、体育丰富生活与认同" },
        { en: "They boost tourism, jobs and national prestige", cn: "带动旅游、就业与国家声誉" },
        { en: "Long-term research drives future breakthroughs", cn: "长期研究推动未来突破" },
        { en: "A balanced society needs more than basics", cn: "平衡的社会不只需要基本温饱" },
      ],
      cons: [
        { en: "Health, education and housing must come first", cn: "医疗、教育、住房应优先" },
        { en: "Limited budgets force hard trade-offs", cn: "预算有限、须艰难取舍" },
        { en: "Luxury spending seems unfair amid poverty", cn: "贫困之中投奢侈显不公" },
        { en: "Some projects have uncertain payoffs", cn: "有些项目回报不确定" },
      ],
    },
    {
      id: "wealth-inequality", cn: "贫富差距与对外援助", en: "Wealth Inequality & Foreign Aid", group: "society", essaySlug: "wealth-gap",
      pros: [
        { en: "Reducing gaps lowers poverty, crime and unrest", cn: "缩小差距降低贫困、犯罪与动荡" },
        { en: "Fairer societies are more stable and healthy", cn: "更公平的社会更稳定健康" },
        { en: "Helping poorer nations is a moral duty", cn: "帮助贫国是道义责任" },
        { en: "Aid can build long-term trade partners", cn: "援助能培养长期贸易伙伴" },
      ],
      cons: [
        { en: "High taxes may discourage effort and investment", cn: "高税可能打击努力与投资" },
        { en: "Aid can be wasted through corruption", cn: "援助或因腐败被浪费" },
        { en: "Countries should fix their own problems first", cn: "国家应先解决本国问题" },
        { en: "Some inequality rewards talent and hard work", cn: "一定程度的不平等奖励才干与努力" },
      ],
    },
    {
      id: "endangered-species", cn: "濒危动物保护", en: "Protecting Endangered Species", group: "nature", essaySlug: "zoos-animals",
      pros: [
        { en: "Every species plays a role in the ecosystem", cn: "每个物种在生态中都有作用" },
        { en: "Biodiversity supports food, medicine and tourism", cn: "生物多样性支撑食物、医药与旅游" },
        { en: "Humans have a moral duty to prevent extinction", cn: "人类有防止灭绝的道义责任" },
        { en: "Lost species can never be recovered", cn: "灭绝的物种无法复原" },
      ],
      cons: [
        { en: "Protection is expensive and can limit development", cn: "保护成本高、可能限制发展" },
        { en: "Human needs for land and jobs may take priority", cn: "人类对土地与就业的需求或应优先" },
        { en: "Poaching is hard to police globally", cn: "全球反盗猎难以执行" },
        { en: "Some argue extinction is a natural process", cn: "有人认为灭绝是自然过程" },
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
