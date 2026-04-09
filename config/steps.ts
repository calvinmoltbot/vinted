import type { Step } from "@/types";

export const steps: Step[] = [
  // ── Section 1: Core Business ──────────────────────────────────────
  {
    id: "core_intro",
    section: "core-business",
    type: "section-intro",
    question: "Let's start with what you do",
    subtitle:
      "First, we'll capture the basics — what you sell, who you sell to, and what makes your shop stand out.",
  },
  {
    id: "core_what_sells",
    section: "core-business",
    type: "text",
    question: "What do you primarily sell on Vinted?",
    subtitle: "Think about the categories and types of items you focus on.",
    placeholder: "e.g. Women's vintage clothing, designer bags, kids' shoes...",
    required: true,
  },
  {
    id: "core_sourcing",
    section: "core-business",
    type: "select",
    question: "Where do you source most of your items?",
    subtitle: "Pick the main way you find stock to sell.",
    options: [
      { value: "charity", label: "Charity shops", icon: "Heart" },
      { value: "carboot", label: "Car boot sales", icon: "Car" },
      { value: "wholesale", label: "Wholesale / bulk lots", icon: "Package" },
      { value: "own-wardrobe", label: "Own wardrobe", icon: "Shirt" },
      { value: "online-auctions", label: "Online auctions", icon: "Gavel" },
      { value: "mixed", label: "Mix of sources", icon: "Shuffle" },
    ],
    required: true,
  },
  {
    id: "core_customers",
    section: "core-business",
    type: "multi-select",
    question: "Who is your ideal customer?",
    subtitle: "Select all that apply — you can pick more than one.",
    options: [
      { value: "students", label: "Fashion-conscious students" },
      { value: "bargain-hunters", label: "Bargain hunters" },
      { value: "sustainable", label: "Sustainable shoppers" },
      { value: "designer-seekers", label: "Designer brand seekers" },
      { value: "vintage-lovers", label: "Vintage lovers" },
      { value: "parents", label: "Parents (kids' clothing)" },
    ],
    required: true,
  },
  {
    id: "core_pricing",
    section: "core-business",
    type: "select",
    question: "How do you set your prices?",
    subtitle: "What's your main pricing strategy right now?",
    options: [
      { value: "original-price", label: "Based on original retail price" },
      { value: "condition", label: "Based on condition" },
      { value: "brand-value", label: "Based on brand value" },
      { value: "market-research", label: "Based on market research" },
      { value: "gut-feeling", label: "Gut feeling + experience" },
    ],
    required: true,
  },
  {
    id: "core_differentiator",
    section: "core-business",
    type: "textarea",
    question: "What makes your shop different from other sellers?",
    subtitle:
      "Your unique angle — it could be your style, curation, speed, packaging, anything.",
    placeholder:
      "e.g. I curate a specific aesthetic, I include handwritten thank-you notes, I specialise in rare finds...",
  },

  // ── Section 2: Goals & Financials ─────────────────────────────────
  {
    id: "goals_intro",
    section: "goals-financials",
    type: "section-intro",
    question: "Now let's talk money",
    subtitle:
      "Understanding your numbers is key. Let's map out your financial goals and current position.",
  },
  {
    id: "goals_monthly_revenue",
    section: "goals-financials",
    type: "number",
    question: "What's your monthly revenue target?",
    subtitle: "How much do you want to bring in per month from Vinted sales?",
    prefix: "£",
    min: 0,
    max: 50000,
    required: true,
  },
  {
    id: "goals_profit_margin",
    section: "goals-financials",
    type: "slider",
    question: "What profit margin are you aiming for?",
    subtitle:
      "After sourcing costs, shipping, and fees — what percentage profit do you want per item?",
    min: 10,
    max: 80,
    step: 5,
    suffix: "%",
    required: true,
  },
  {
    id: "goals_startup_cost",
    section: "goals-financials",
    type: "number",
    question: "How much have you invested to start?",
    subtitle:
      "Total money spent so far on stock, supplies, and equipment.",
    prefix: "£",
    min: 0,
    max: 10000,
  },
  {
    id: "goals_monthly_costs",
    section: "goals-financials",
    type: "number",
    question: "What are your monthly running costs?",
    subtitle: "Shipping supplies, packaging, sourcing budget, petrol, etc.",
    prefix: "£",
    min: 0,
    max: 5000,
  },
  {
    id: "goals_six_months",
    section: "goals-financials",
    type: "textarea",
    question: "Where do you see your revenue in 6 months?",
    subtitle: "Paint a picture of what success looks like financially by month 6.",
    placeholder:
      "e.g. I want to be making £1,500/month profit, with 50+ sales per month...",
    required: true,
  },

  // ── Section 3: Operations ─────────────────────────────────────────
  {
    id: "ops_intro",
    section: "operations",
    type: "section-intro",
    question: "How you run the day-to-day",
    subtitle:
      "Let's look at the practical side — your workflow, processes, and how you spend your time.",
  },
  {
    id: "ops_hours",
    section: "operations",
    type: "slider",
    question: "Hours per week you dedicate to Vinted?",
    subtitle: "Including sourcing, listing, packing, and posting.",
    min: 1,
    max: 40,
    step: 1,
    suffix: "hrs/week",
    required: true,
  },
  {
    id: "ops_photography",
    section: "operations",
    type: "select",
    question: "How do you photograph your items?",
    subtitle: "Good photos are everything on Vinted. What's your setup?",
    options: [
      { value: "phone-natural", label: "Phone + natural light", icon: "Sun" },
      { value: "phone-ring", label: "Phone + ring light", icon: "Circle" },
      { value: "dedicated", label: "Dedicated camera setup", icon: "Camera" },
      { value: "flat-lay", label: "Flat lay only", icon: "LayoutGrid" },
      {
        value: "mannequin",
        label: "Mannequin / on model",
        icon: "PersonStanding",
      },
    ],
    required: true,
  },
  {
    id: "ops_shipping",
    section: "operations",
    type: "select",
    question: "How do you handle shipping?",
    subtitle: "How do parcels get to your buyers?",
    options: [
      { value: "royal-mail", label: "Royal Mail drop-off", icon: "Mail" },
      { value: "courier", label: "Courier pickup", icon: "Truck" },
      { value: "inpost", label: "InPost lockers", icon: "Box" },
      { value: "mixed", label: "Mix of methods", icon: "Shuffle" },
    ],
    required: true,
  },
  {
    id: "ops_inventory",
    section: "operations",
    type: "select",
    question: "How do you track your inventory?",
    subtitle: "How do you keep tabs on what you have in stock?",
    options: [
      { value: "spreadsheet", label: "Spreadsheet", icon: "Table" },
      { value: "notes", label: "Notes app", icon: "StickyNote" },
      { value: "memory", label: "In my head", icon: "Brain" },
      { value: "vinted-tools", label: "Vinted's own tools", icon: "Monitor" },
      { value: "dedicated-app", label: "Dedicated app", icon: "Smartphone" },
    ],
    required: true,
  },
  {
    id: "ops_workflow",
    section: "operations",
    type: "textarea",
    question: "Describe your typical daily workflow",
    subtitle:
      "Walk us through a typical day — when do you source, list, pack, and post?",
    placeholder:
      "e.g. Morning: photograph new items. Afternoon: write listings. Evening: pack orders for next-day post...",
  },

  // ── Section 4: Growth & Brand ─────────────────────────────────────
  {
    id: "growth_intro",
    section: "growth-brand",
    type: "section-intro",
    question: "Growing your brand",
    subtitle:
      "Time to think bigger — your brand identity, where you want to expand, and your ambitions.",
  },
  {
    id: "growth_shop_name",
    section: "growth-brand",
    type: "text",
    question: "What's your shop name / brand name?",
    subtitle: "The name your customers know you by (or want to be known by).",
    placeholder: "e.g. VintageVibes, ThriftQueen, PrelovedLuxe...",
    required: true,
  },
  {
    id: "growth_platforms",
    section: "growth-brand",
    type: "multi-select",
    question: "Which platforms do you plan to use?",
    subtitle: "Select everywhere you sell or want to sell.",
    options: [
      { value: "vinted", label: "Vinted" },
      { value: "depop", label: "Depop" },
      { value: "ebay", label: "eBay" },
      { value: "instagram", label: "Instagram" },
      { value: "tiktok", label: "TikTok" },
      { value: "own-website", label: "Own website" },
    ],
    required: true,
  },
  {
    id: "growth_brand_importance",
    section: "growth-brand",
    type: "rating",
    question: "How important is building a brand vs. just selling?",
    subtitle:
      "1 = Just want to sell items, 5 = Building a recognisable brand is my priority.",
    min: 1,
    max: 5,
    required: true,
  },
  {
    id: "growth_goals",
    section: "growth-brand",
    type: "textarea",
    question: "What are your biggest goals for the next year?",
    subtitle:
      "Dream big — where do you want this business to be in 12 months?",
    placeholder:
      "e.g. Quit my day job, hit £3k/month, launch my own brand, open a market stall...",
    required: true,
  },
];

export const TOTAL_STEPS = steps.length;

export const INPUT_STEPS = steps.filter((s) => s.type !== "section-intro");
