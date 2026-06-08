import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Real-time Agent Conversational QA Endpoint backed by Gemini
app.post("/api/gemini/agent-chat", async (req, res) => {
  try {
    const { 
      agent, 
      industry, 
      products, 
      orders, 
      metrics,
      messages 
    } = req.body;

    if (!agent || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing required fields and message history thread." });
    }

    // Format current store state text for the LLM
    const storeStateText = `
CURRENT STORE STATE AND ENVIRONMENT DATA:
- Industry Track: ${industry || 'General Retail'}
- Core Connected metrics:
${(metrics || []).map((m: any) => `  * ${m.name}: ${m.value} (${m.change})`).join('\n')}

- Active Inventory & Products:
${(products || []).map((p: any) => `  * SKU: ${p.sku} | Name: ${p.name} | Stock: ${p.stock} | Price: $${p.price} | Status: ${p.status}`).join('\n')}

- Direct Orders:
${(orders || []).map((o: any) => `  * OrderID: ${o.id} | Customer: ${o.customerName} | Total: $${o.total} | Status: ${o.status} | Risk Score: ${o.riskScore}/100`).join('\n')}
`;

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.content || "";

    // Build model role prompt
    const systemInstruction = `
${agent.systemPrompt}
You are registered inside the "AI Commerce OS" platform.
Your title is: "${agent.title}".
Your detailed capability profile:
- Description: ${agent.description}
- Capabilities: ${(agent.capabilities || []).join(', ')}

You have read-only access to the live store systems. Here is your current business data:
${storeStateText}

INSTRUCTIONS FOR YOUR RESPONSE:
1. Speak strictly in-character as ${agent.name}. Use your specialized title tone.
2. Ground your comments and advice in the direct quantities, SKU codes, prices, and order data supplied above. For example, if low stock is listed, coordinate stock.
3. Be professional, direct, analytical, and actionable. Avoid generic fluff.
4. Answer short and concisely. Maximize readability via clear spacing or bold highlights.
`;

    const ai = getGeminiClient();

    if (!ai) {
      // Graceful fallback dialogue if API key is not yet set
      console.log("No valid GEMINI_API_KEY found. Utilizing simulated agent prompt.");
      
      const responses: Record<string, string> = {
        Sophia: `[AI Commerce OS Simulation - System Key Pending]
Hello! I am **Sophia**, your Operating CEO. I notice you haven't configured your real **GEMINI_API_KEY** in the Secrets panel, so I am running in local simulation mode. 

Looking at our current ${industry} data, here is my direct assessment:
- We have ${products.filter((p:any)=>p.stock <= p.minStockThreshold).length} low stock SKUs that require immediate attention from our procurement workflow.
- Our orders are processing smoothly, but order audit workflows should remain active. 
Configure your Gemini Key in the **Secrets** panel to unlock full responsive decision-making!`,
        Emma: `[AI Commerce OS Simulation] Welcome! I am **Emma**, your Diner Concierge. I am operating in simulation mode. If you have questions about allergen safety or delivery timing delays, let me know!`,
        Emily: `[AI Commerce OS Simulation] Hello, I am **Emily** from Customer Experience. I see our order list above! If you need me to inspect Order #ORD-9839 or audit high-risk claims, let me know!`,
        Oliver: `[AI Commerce OS Simulation] **Oliver** here. I am monitoring the active WMS levels for our ${industry} catalog. Let's trigger a procurement run to safeguard stock thresholds.`,
        Marcus: `[AI Commerce OS Simulation] **Marcus** here! I am analyzing our active ad spends. Let's launch a coupon code or boost Meta ROI. Ask me details!`,
        Clara: `[AI Commerce OS Simulation] Welcome to EduAcademy! I am **Clara**, your Academic Dean. Tracking student progress and churn prevention. Let's make learning engaging!`,
        Luke: `[AI Commerce OS Simulation] Hello, **Luke** here representing Student Success. I am checking on students lesson completions. Ask me anything about the module syllabus!`
      };

      const foundName = agent.name;
      const responseText = responses[foundName] || `Hello, I am ${agent.name} (${agent.title}). I am currently active in simulation mode. Set your GEMINI_API_KEY to let me solve production goals with live intelligence!`;

      // Simulate a small delay for authenticity
      await new Promise(resolve => setTimeout(resolve, 800));

      return res.json({
        text: responseText,
        simulated: true
      });
    }

    // Call the genuine Gemini 3.5 Flash Model
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "I apologize, I searched the internal logs but could not construct a standard operational response.";

    return res.json({
      text: replyText,
      simulated: false
    });

  } catch (error: any) {
    console.error("Gemini Agent Chat Error:", error);
    return res.status(500).json({ 
      error: "Failed to communicate with the Agent via Gemini API.",
      details: error.message
    });
  }
});

// AI-powered product sourcing recommendations backed by Gemini
app.post("/api/gemini/source-products", async (req, res) => {
  try {
    const { industry, products } = req.body;
    if (!industry) {
      return res.status(400).json({ error: "Missing required industry field." });
    }

    const ai = getGeminiClient();

    if (!ai) {
      console.log(`Utilizing high-fidelity fallback presets for industry: ${industry}`);
      
      const fallbackDatabase: Record<string, any[]> = {
        retail: [
          {
            name: "UltraSlim Foldable Dual-Screen Keyboard",
            sku: "SKU-R-AI01",
            price: 89.00,
            wholesaleCost: 35.00,
            marginPct: 60.7,
            targetDemand: "High",
            trendReason: "Popularized by desk setup TikTok viral loops and minimal remote workspace aesthetic trends.",
            audience: "Freelancers, Remote designers, digital nomads",
            profitabilityAnalysis: "Extremely low delivery cost and high turnover rate. Earns up to $5,400 monthly profit.",
            estMonthlySales: 150
          },
          {
            name: "MagSafe Multi-Device Charging Stand",
            sku: "SKU-R-AI02",
            price: 69.00,
            wholesaleCost: 26.00,
            marginPct: 62.3,
            targetDemand: "Extreme",
            trendReason: "Clean-desk trends show consumer search volumes peaking. Broad lifestyle appeal.",
            audience: "Smartphones owners, minimal productivity designers",
            profitabilityAnalysis: "Compact box enables cheaper ocean freight options. Return rate is historically lower than 1.1%.",
            estMonthlySales: 220
          },
          {
            name: "Professional Podcasting Lapel Mic Kit",
            sku: "SKU-R-AI03",
            price: 45.00,
            wholesaleCost: 15.00,
            marginPct: 66.7,
            targetDemand: "High",
            trendReason: "Mass expansion of short-form video UGC creators requiring budget clear audio captures.",
            audience: "TikTok/Reels creators, online tutors, podcasters",
            profitabilityAnalysis: "Over 66% heavy markup potential. High-density shipping allows bulk lower cost stock margins.",
            estMonthlySales: 185
          }
        ],
        food: [
          {
            name: "Korean BBQ Bulgogi Fusion Slider Bundle",
            sku: "SKU-F-AI01",
            price: 18.99,
            wholesaleCost: 5.50,
            marginPct: 71.0,
            targetDemand: "High",
            trendReason: "K-Food and western barbecue fusion cuisine trending heavily in culinary index searches.",
            audience: "Lunch crowds, couples ordering food online, late-night snacking",
            profitabilityAnalysis: "Average prep time under 4 minutes means fast table turns and minimal staffing time.",
            estMonthlySales: 350
          },
          {
            name: "Sea Salt Pistachio Boba Tea Pitcher",
            sku: "SKU-F-AI02",
            price: 7.50,
            wholesaleCost: 1.80,
            marginPct: 76.0,
            targetDemand: "Extreme",
            trendReason: "Matcha-pistachio cold beverage hashtag queries up +250% this quarter.",
            audience: "Urban tea lovers, student groups, business meeting lunch orders",
            profitabilityAnalysis: "Extreme raw margin potential. Liquid inventory leverages existing prep infrastructure.",
            estMonthlySales: 580
          },
          {
            name: "Plant-Based Crispy Truffle Wings Set",
            sku: "SKU-F-AI03",
            price: 15.50,
            wholesaleCost: 4.50,
            marginPct: 71.0,
            targetDemand: "High",
            trendReason: "Vegan fast-casual trend with an upscale black truffle flavor spin.",
            audience: "Vegetarians, gourmet fast food seekers, flexitarians",
            profitabilityAnalysis: "Utilizes standard fryer. Frozen ingredient longevity limits spoilage risks.",
            estMonthlySales: 280
          }
        ],
        education: [
          {
            name: "LangChain & Autonomous AI Agent Coding Bootcamp",
            sku: "SKU-E-AI01",
            price: 349.00,
            wholesaleCost: 0.00,
            marginPct: 100.0,
            targetDemand: "Extreme",
            trendReason: "Developers are moving heavily towards agent architectures rather than basic RAG models.",
            audience: "Software developers, technical student groups, tech managers",
            profitabilityAnalysis: "Zero supply chain shipping constraints. Virtually 100% markup goes straight to gross profits.",
            estMonthlySales: 120
          },
          {
            name: "AI Business Automation Playbook for Executives",
            sku: "SKU-E-AI02",
            price: 199.00,
            wholesaleCost: 0.00,
            marginPct: 100.0,
            targetDemand: "High",
            trendReason: "Operations directors looking to implement workflow logic instead of writing python scripts.",
            audience: "Project managers, SME owners, business process consultants",
            profitabilityAnalysis: "Includes self-serve curriculum blocks. High LTV matching student success tracks.",
            estMonthlySales: 85
          },
          {
            name: "Multi-Agent Systems & MCP Integration Seminar Pack",
            sku: "SKU-E-AI03",
            price: 499.00,
            wholesaleCost: 0.00,
            marginPct: 100.0,
            targetDemand: "High",
            trendReason: "Emergence of the Model Context Protocol standard triggering academic software restructuring.",
            audience: "Enterprise developers, research labs, tech startups",
            profitabilityAnalysis: "Instant downloadable resource, infinite stock leverage, zero logistical hurdles.",
            estMonthlySales: 50
          }
        ],
        healthcare: [
          {
            name: "Continuous Glucose Metabolism Longevity Package",
            sku: "SKU-H-AI01",
            price: 299.00,
            wholesaleCost: 110.00,
            marginPct: 63.2,
            targetDemand: "High",
            trendReason: "Longevity clinicians and tech leaders propagating biofeedback metabolism tracking.",
            audience: "Health enthusiasts, longevity practitioners, diabetic patients",
            profitabilityAnalysis: "Creates recurring subscription dependency for continuous sensor patch refills.",
            estMonthlySales: 95
          },
          {
            name: "Anti-Stress Ashwagandha Sleep Drops (Pack of 3)",
            sku: "SKU-H-AI02",
            price: 42.00,
            wholesaleCost: 12.50,
            marginPct: 70.2,
            targetDemand: "High",
            trendReason: "Natural supplements for stress reduction holding heavy trending streams on lifestyle portals.",
            audience: "Anxious professionals, organic supplement users",
            profitabilityAnalysis: "Sturdy glass bottles with long expiration cycles. High storage density.",
            estMonthlySales: 310
          },
          {
            name: "Clinical Biomarker Deep Sleep Saliva Kit",
            sku: "SKU-H-AI03",
            price: 189.00,
            wholesaleCost: 75.00,
            marginPct: 60.3,
            targetDemand: "High",
            trendReason: "Custom biomarkers and functional medicine testing demand rising across general populations.",
            audience: "Insomniacs, clinical patients, biohackers",
            profitabilityAnalysis: "Sealed packaging allows drop-shipping from central medical diagnostics labs.",
            estMonthlySales: 140
          }
        ],
        service: [
          {
            name: "Cryotherapy Cold-Plunge Recovery 45m Session",
            sku: "SKU-S-AI01",
            price: 65.00,
            wholesaleCost: 10.00,
            marginPct: 84.6,
            targetDemand: "High",
            trendReason: "Extreme physical health cold therapy trending strongly among gym and spa users.",
            audience: "Athletes, rehabilitation cases, corporate athletes",
            profitabilityAnalysis: "Requires minor initial capital expenditure. Marginal utility expense is only $1.20 per customer.",
            estMonthlySales: 180
          },
          {
            name: "Laser Skin Resurfacing Express Facial Consultation",
            sku: "SKU-S-AI02",
            price: 145.00,
            wholesaleCost: 35.00,
            marginPct: 75.9,
            targetDemand: "Extreme",
            trendReason: "Non-invasive laser beauty peels with 0 downtime up +220% across local directories.",
            audience: "Local professionals, skin care aficionados",
            profitabilityAnalysis: "Highly effective at upselling guests into recurring high-end annual memberships.",
            estMonthlySales: 110
          },
          {
            name: "Advanced Infra-Red Chromotherapy Sauna Block",
            sku: "SKU-S-AI03",
            price: 49.00,
            wholesaleCost: 8.00,
            marginPct: 83.7,
            targetDemand: "High",
            trendReason: "Light therapies popularization for toxin clearing and lymphatic fluid system resets.",
            audience: "Working executives, stress-sensitive professionals",
            profitabilityAnalysis: "Zero therapist labor required. Customer occupies pre-configured chamber independently.",
            estMonthlySales: 195
          }
        ],
        manufacturing: [
          {
            name: "UAV Custom Carbon Aerospace Gear Brackets",
            sku: "SKU-M-AI01",
            price: 245.00,
            wholesaleCost: 85.00,
            marginPct: 65.3,
            targetDemand: "Extreme",
            trendReason: "Logistics shipping drone manufacturers seeking lightweight, rigid carbon fiber mounting braces.",
            audience: "B2B UAV assemblers, warehouse automated robotics ventures",
            profitabilityAnalysis: "Commands high bespoke fee due to specialized ASTM-certified composition ratios.",
            estMonthlySales: 120
          },
          {
            name: "NEMA-23 Recycled Copper Core Servo Motors",
            sku: "SKU-M-AI02",
            price: 110.00,
            wholesaleCost: 42.00,
            marginPct: 61.8,
            targetDemand: "High",
            trendReason: "Domestic equipment builders shifting back to copper materials amid micro-supply disruptions.",
            audience: "CNC builders, robotics integrators, heavy machine factories",
            profitabilityAnalysis: "Excellent bulk shipping item. Consistent repeat reorders safeguard production runs.",
            estMonthlySales: 260
          },
          {
            name: "Tough-Grip Fiber Structural Tubes (Pack of 50)",
            sku: "SKU-M-AI03",
            price: 380.00,
            wholesaleCost: 140.00,
            marginPct: 63.2,
            targetDemand: "Medium",
            trendReason: "Industrial rack structural reinforcing mandates inside shipping logistic routes.",
            audience: "Warehouse installation crews, shipping managers",
            profitabilityAnalysis: "High average transaction value. Direct B2B billing makes invoice auditing fast.",
            estMonthlySales: 75
          }
        ]
      };

      const finalRecommendations = fallbackDatabase[industry] || fallbackDatabase.retail;
      return res.json({
        recommendations: finalRecommendations,
        simulated: true
      });
    }

    // Call genuine Gemini model if API key connected
    const existingProductsText = (products || [])
      .map((p: any) => `* SKU: ${p.sku} | Name: ${p.name} | Current Price: $${p.price}`)
      .join("\n");

    const promptText = `
    Analyze the product catalog and sales trends for an enterprise SaaS business inside the "${industry}" category.
    Your objective is to recommend exactly 3 highly trending, high-profit products that fit this merchant's catalog perfectly, but are NOT already stocked.
    
    Here is the list of existing products that they ALREADY stock (DO NOT recommend any of these):
    ${existingProductsText}

    Please perform a deep analytical assessment on recent social media indicators (TikTok shop, Meta, Google trends), logistics volume margins, and B2B pricing to suggest 3 new items. Each item must feature:
    1. A beautiful, concise, realistic human product name.
    2. A unique SKU code starting with "SKU-${industry[0].toUpperCase()}-AI" followed by double digits (e.g., SKU-R-AI55).
    3. Suggested MSRP Retail Price (greater than zero, and realistic for this category).
    4. Suggested Wholesale Unit Cost (at least 35% to 75% lower than MSRP to define healthy margins).
    5. marginPct: precise pre-calculated percentage of gross margin based on price and cost (e.g. ((price - wholesaleCost) / price) * 100).
    6. targetDemand: "High", "Extreme", "Critical" or "Exceptional".
    7. trendReason: Clear 1-2 sentence market analysis citing a real trend (e.g. search spikes, social media video virality, regional supply shifts).
    8. audience: Who is buying this product.
    9. profitabilityAnalysis: Detailed margin explanation and estimated monthly net profit calculations for stocking and selling 100 units.
    10. estMonthlySales: Predicted monthly unit selling volume (typically between 50 and 500).

    You must adhere to the provided JSON Schema. Do not return extra text. Return strictly a JSON array of the 3 recommendations.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are an elite, mathematical SaaS corporate advisory consultant. You analyze retail, B2B, healthcare, diner, and manufacturing operations to discover maximum volume margin potentials.",
        temperature: 0.85,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "An array of 3 recommended trendy products fitting the given SaaS store segment perfectly",
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Catcy and realistic product name." },
              sku: { type: Type.STRING, description: "Unique custom SKU representation." },
              price: { type: Type.NUMBER, description: "MSRP selling price in USD." },
              wholesaleCost: { type: Type.NUMBER, description: "Estimated procurement unit price in USD." },
              marginPct: { type: Type.NUMBER, description: "Profit margin percent (0-100)." },
              targetDemand: { type: Type.STRING, description: "Demand tier - High, Extreme, Critical" },
              trendReason: { type: Type.STRING, description: "Why is it trending? Real-world signals." },
              audience: { type: Type.STRING, description: "Target demographics." },
              profitabilityAnalysis: { type: Type.STRING, description: "Profit and expense analysis summary." },
              estMonthlySales: { type: Type.NUMBER, description: "Estimated monthly retail sales volume of units." }
            },
            required: ["name", "sku", "price", "wholesaleCost", "marginPct", "targetDemand", "trendReason", "audience", "profitabilityAnalysis", "estMonthlySales"]
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || "[]");
    return res.json({
      recommendations: parsedData,
      simulated: false
    });

  } catch (err: any) {
    console.error("AI Sourcing Error:", err);
    return res.status(500).json({
      error: "Sourcing analysis failed.",
      details: err.message
    });
  }
});

// Shopify developer documents lookup QA endpoint backed by Gemini
app.post("/api/gemini/shopify-docs", async (req, res) => {
  try {
    const { query, category } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required for Shopify documentation lookup." });
    }

    const ai = getGeminiClient();

    if (!ai) {
      console.log(`[Shopify Docs] No Gemini API key - utilising local simulation responses`);
      const responses: Record<string, string> = {
        graphql: `### Shopify GraphQL Admin API Example
To query products and legacy variants in Shopify using GraphQL Admin API, issue a \`POST\` request to \`/admin/api/2024-04/graphql.json\`:

\`\`\`graphql
query GetProductsWithVariants {
  products(first: 10) {
    edges {
      node {
        id
        title
        status
        variants(first: 5) {
          edges {
            node {
              id
              title
              price
              inventoryQuantity
            }
          }
        }
      }
    }
  }
}
\`\`\`

**Response Payload Example:**
\`\`\`json
{
  "data": {
    "products": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Product/123456789",
            "title": "Sustainable Bamboo Coffee Mug",
            "status": "ACTIVE",
            "variants": {
              "edges": [
                {
                  "node": {
                    "id": "gid://shopify/ProductVariant/987654321",
                    "title": "Default Title",
                    "price": "29.99",
                    "inventoryQuantity": 150
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }
}
\`\`\`

*Note: Register a genuine \`GEMINI_API_KEY\` to run high-intelligence dynamic doc lookup query generations!*`,
        webhooks: `### Shopify Webhooks & Signature Verification (Express Node.js)
To verify incoming Shopify webhook requests, compute the SHA256 HMAC of the raw request payload and verify it against Shopify's signature header:

\`\`\`javascript
const crypto = require('crypto');

function verifyShopifyWebhook(req, res, next) {
  const hmacHeader = req.get('X-Shopify-Hmac-Sha256');
  // Note: req.rawBody must be populated containing the unparsed raw string body
  const body = req.rawBody || JSON.stringify(req.body); 
  
  const calculatedHash = crypto
    .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
    .update(body, 'utf8')
    .digest('base64');

  if (calculatedHash === hmacHeader) {
    next();
  } else {
    res.status(401).send('Validation failed. Unauthorized Hook origin.');
  }
}
\`\`\`

**Active Webhook Topics:**
- \`products/update\` : Trigger WMS sync when titles or stock shifts.
- \`orders/create\` : Intercept checkout to evaluate AI risk parameters.
- \`customers/redact\` : Compliance eraser hook (GDPR compliance).`,
        liquid: `### Shopify Liquid Theme Elements & Dynamic Inventories
Here is an elegant snippet to insert inside a custom \`product-info.liquid\` file to display high-fidelity dynamic inventory status highlights:

\`\`\`liquid
{% comment %}
  Dynamic stock threshold rules. Renders a warning box when inventories run low.
{% endcomment %}
{%- if product.available -%}
  {%- for variant in product.variants -%}
    {%- if variant.inventory_management == 'shopify' -%}
      {%- if variant.inventory_quantity <= 15 and variant.inventory_quantity > 0 -%}
        <div class="stock-badge stock-badge--warning" style="margin: 1rem 0; padding: 12px; background-color: #fffbfa; border: 1px solid #fed7d7; border-radius: 8px;">
          <span style="color: #c53030; font-weight: 700; font-size: 13px;">
            ⚠️ Only {{ variant.inventory_quantity }} left of {{ variant.title }} in stock! Order soon!
          </span>
        </div>
      {%- endif -%}
    {%- endif -%}
  {%- endfor -%}
{%- endif -%}
\`\`\`

*Tip: Save this under your project's theme templates directory and include it via \`{% render 'product-stock-warning' %}\`*`
      };

      const matchedKey = (category || 'graphql').toLowerCase();
      let fallbackText = responses[matchedKey];
      if (!fallbackText) {
        if (query.toLowerCase().includes('webhook')) {
          fallbackText = responses.webhooks;
        } else if (query.toLowerCase().includes('liquid')) {
          fallbackText = responses.liquid;
        } else {
          fallbackText = responses.graphql;
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      return res.json({
        text: `### 🎯 Simulated Shopify Developer Hub (Simulated Answer)\n\nWe found the following relevant developer resource matching your instruction for \`"${query}"\`:\n\n${fallbackText}`,
        simulated: true
      });
    }

    const systemInstruction = `
    You are a distinguished Shopify Staff Architect and senior developer advocate.
    Your objective is to provide elite, accurate, modern, and highly precise documentation lookups and code templates.
    Focus strictly on:
    1. Shopify GraphQL Admin API (latest quarterly release syntax). Always provide valid GraphQL queries or mutations.
    2. Shopify REST Admin API endpoints and request headers.
    3. Liquid syntax, loops, and conditions for Shopify Online Store 2.0 themes.
    4. Shopify webhook validation (HMAC verification and security best practices).
    5. App Bridge, checkout extensibility, and theme app blocks.

    Rules:
    - Never include useless conversational greetings (e.g., "Sure, here is"). Jump straight into the code or technical explanation.
    - Format response in high quality Markdown with bold highlights and structured code blocks.
    - Highlight whether your solution uses GraphQL or REST, and outline why.
    `;

    const promptText = `
    The developer is asking for Shopify documentation/guides regarding:
    "${query}"
    
    Identified context category: ${category || 'General'}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.15
      }
    });

    return res.json({
      text: response.text || "Consulted internal manuals but no exact reference structures were returned. Refine your query parameters.",
      simulated: false
    });

  } catch (err: any) {
    console.error("Shopify Docs Lookup Error:", err);
    return res.status(500).json({
      error: "Failed to consult Shopify documentation hub.",
      details: err.message
    });
  }
});

// Integrate Vite middleware for development or serve production builds
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    app.use(vite.middlewares);
    
    console.log("Vite middleware mounted for local development.");
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    
    console.log(`Serving static production files from: ${distPath}`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AI Commerce OS Server] started successfully on port ${PORT}`);
    console.log(`Available on http://0.0.0.0:${PORT}`);
  });
}

startServer();
