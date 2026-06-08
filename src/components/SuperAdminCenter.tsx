import React, { useState } from 'react';
import { 
  BarChart3, Users, Layers, ShieldCheck, Bot, Store, Settings, 
  Database, RefreshCw, Plus, ToggleLeft, ToggleRight, Trash2, 
  Send, AlertTriangle, Key, Sliders, Check, Network, Activity,
  CreditCard, Mail, SlidersHorizontal, Eye, Play, Pause, Trash, ArrowRight, Shield, FileText, Globe
} from 'lucide-react';
import { TenantConfig, AppMarketItem, IndustryType } from '../types';

interface SuperAdminCenterProps {
  activeSubTab?: 'stats' | 'tenants' | 'billing' | 'settlement' | 'gateways' | 'channels' | 'ai-ops' | 'marketplace' | 'dev' | 'roles' | 'logs' | 'settings';
  tenants: TenantConfig[];
  onUpdateTenantStatus: (tenantId: string, status: 'active' | 'suspended') => void;
  onUpdateTenantAiBudget: (tenantId: string, budget: number) => void;
  marketItems: AppMarketItem[];
  onAddMarketItem: (item: AppMarketItem) => void;
  globalDefaultModel: string;
  onChangeGlobalModel: (model: string) => void;
  onAddSystemLog: (module: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  activeAgents?: any[];
  onUpdateAgents?: (agents: any[]) => void;
}

export default function SuperAdminCenter({
  activeSubTab = 'stats',
  tenants,
  onUpdateTenantStatus,
  onUpdateTenantAiBudget,
  marketItems,
  onAddMarketItem,
  globalDefaultModel,
  onChangeGlobalModel,
  onAddSystemLog,
  activeAgents = [],
  onUpdateAgents
}: SuperAdminCenterProps) {

  // Multi-tenant isolation presets
  const [tenantsExtended, setTenantsExtended] = useState<TenantConfig[]>(tenants);

  // SaaS Plans state
  const [plans, setPlans] = useState([
    { id: 'starter', name: 'Starter (起步版)', price: 99, commission: 2.0, apiLimit: 10000, storage: 10, aiToken: 1000000 },
    { id: 'professional', name: 'Professional (专业版)', price: 299, commission: 1.0, apiLimit: 50000, storage: 50, aiToken: 5000000 },
    { id: 'enterprise', name: 'Enterprise (企业旗舰版)', price: 999, commission: 0.5, apiLimit: 500000, storage: 1000, aiToken: 50000000 }
  ]);
  const [selectedPlanId, setSelectedPlanId] = useState('starter');
  const [planForm, setPlanForm] = useState({ price: 99, commission: 2.0, apiLimit: 10000, storage: 10, aiToken: 1000000 });

  // Gateway state
  const [gateways, setGateways] = useState([
    { id: 'stripe', name: 'Stripe Global Credit Gateway', key: 'sk_live_51Msz...', status: true, sharePct: 1.5, region: '欧洲与北美' },
    { id: 'adyen', name: 'Adyen Local Payments Gateway', key: 'ws_prod_z87y...', status: true, sharePct: 1.2, region: '欧洲本地区域' },
    { id: 'crypto', name: 'Base Crypto USDC Multi-Router', key: '0x9E3c...88f4', status: false, sharePct: 0.2, region: '全球去中心化' }
  ]);

  // Communication channels
  const [smsChannel, setSmsChannel] = useState({ provider: 'Twilio Multi-Route', apiKey: 'AC8837e409...', senderId: 'SHOPIFY_EU', balance: 94820, latencyAlert: 200, status: true });
  const [mailChannel, setMailChannel] = useState({ provider: 'SendGrid Web-Relay', apiKey: 'SG.y827xH...', senderId: 'noreply@shopifySaaS.eu', balance: 418200, status: true });

  // Global settings
  const [settingsForm, setSettingsForm] = useState({
    maxCommissionCap: 5.0,
    maxFreeQuota: 100,
    isMaintenanceMode: false,
    routingLoc: '瑞士苏黎世双备节点',
    sessionTimeout: 3600,
    forceSecuritySign: true
  });

  // AI Center Sub-Tabs (State-managed inside 'ai-brain')
  const [aiSubTab, setAiSubTab] = useState<'tasks' | 'workflow' | 'rules' | 'knowledge' | 'monitor'>('tasks');

  // AI center - 智能任务 state
  const [aiTasks, setAiTasks] = useState([
    { id: 'categorization', name: '自动商品分类', status: '运行中', successRate: 99.2, totalRuns: 158000 },
    { id: 'translation', name: '自动商品翻译', status: '运行中', successRate: 98.8, totalRuns: 72000 },
    { id: 'labeling', name: '自动商品打标签', status: '运行中', successRate: 99.5, totalRuns: 104000 },
    { id: 'risk_check', name: '自动订单风险检查', status: '运行中', successRate: 99.7, totalRuns: 480000 },
    { id: 'customer_seg', name: '自动客户分群', status: '运行中', successRate: 97.4, totalRuns: 34000 },
    { id: 'feedback_analysis', name: '自动评价分析', status: '运行中', successRate: 98.6, totalRuns: 122000 }
  ]);

  // AI center - 智能工作流 state
  const [workflows, setWorkflows] = useState([
    { 
      id: 'wf_prod', 
      name: '新商品发布自动化工作流', 
      description: '新商品创建 ➔ 自动翻译 ➔ 自动生成SEO ➔ 自动打标签 ➔ 发布系统前台',
      steps: ['新商品创建 (触发器)', '自动翻译语言 (执行器)', '自动优化SEO描述 (执行器)', '自动关联多维标签 (执行器)', '发布前台门店 (状态更改)'],
      active: true,
      executionCount: 28410
    },
    { 
      id: 'wf_stock', 
      name: '订单库存警戒核销工作流', 
      description: '订单支付成功 ➔ 库存调拨核对 ➔ 若库存低于阀值 ➔ 自动启动采购流程+发送邮件提醒',
      steps: ['订单创建 (触发器)', '物理库房锁定 (执行器)', '库存极限检查 (条件分支)', 'IF FAIL: 紧急采购单下发+预警推送 (执行流)'],
      active: true,
      executionCount: 14930
    }
  ]);

  // AI center - 智能规则 state
  const [rules, setRules] = useState([
    { id: 'rule_1', ifCondition: '库存量 < 20', thenAction: '创建采购补货清单任务', active: true, runs: 850 },
    { id: 'rule_2', ifCondition: '买家注册满 30天 且未下过任何订单', thenAction: '自动投放 15% 催付挽留优惠券', active: true, runs: 4210 },
    { id: 'rule_3', ifCondition: '订单结算交易额 > 1000 EUR', thenAction: '系统自动将客户提权至黄金VIP等级', active: true, runs: 1240 },
    { id: 'rule_4', ifCondition: '订单风险评级指数 > 80 分', thenAction: '自动挂起资金拦截并转人工财务核账主管', active: true, runs: 180 }
  ]);
  const [newRuleIf, setNewRuleIf] = useState('');
  const [newRuleThen, setNewRuleThen] = useState('');

  // AI center - 知识库管理 state
  const [knowledgeBases, setKnowledgeBases] = useState([
    { id: 'kb_prod', name: '商品描述与规格知识库', category: '商品知识', entryCount: 1284, path: '/iso/knowledge/products_db' },
    { id: 'kb_cust', name: '高潜买家标签与画像归纳库', category: '客户知识', entryCount: 541, path: '/iso/knowledge/customers_profiles' },
    { id: 'kb_ship', name: '欧洲跨境物流与保税监管规则', category: '物流知识', entryCount: 390, path: '/iso/knowledge/logistics_eu' },
    { id: 'kb_after', name: '多行业无理由退换及欧洲质保约束规程', category: '售后知识', entryCount: 215, path: '/iso/knowledge/refund_slas' },
    { id: 'kb_brand', name: '合规公关言论及高奢品牌调性指令库', category: '品牌知识', entryCount: 88, path: '/iso/knowledge/brand_tone' }
  ]);
  const [syncingKbId, setSyncingKbId] = useState<string | null>(null);

  // AI center - 执行监控审批与异常 state
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 'appr_1', tenant: '米兰风尚服装批发集团 (retail)', action: '特批退款 €1,490 (超出前置理赔阀值)', reason: '大宗定制类纺织品尺寸纠纷，判定无责', time: '2026-06-08 05:01' },
    { id: 'appr_2', tenant: '慕尼黑私房菜配送店 (food)', action: '自动配送调度异常补偿支出 €320', reason: '送餐路途中配送员车轮损坏导致食品变质', time: '2026-06-08 05:11' }
  ]);
  const [exceptionTasks, setExceptionTasks] = useState([
    { id: 'exc_1', task: '服装品类属性深度分发', tenant: '米兰风尚服装批发集团', error: '标签推理响应非JSON异常载荷 [502 Remote Server Error]', time: '12分钟前', resolved: false },
    { id: 'exc_2', task: '欧洲异地海运物流价格分发', tenant: '百货电器销售链', error: '物流基础公式接口参数校验缺失 [Missing schema attributes]', time: '34分钟前', resolved: false }
  ]);

  // Operational state for 🧠 智能操作中心
  const [aiOpsSubTab, setAiOpsSubTab] = useState<'agents' | 'workflows' | 'automations' | 'kb' | 'rules' | 'events' | 'tasks' | 'monitor'>('agents');

  const [agents, setAgents] = useState([
    { id: 'agent_1', name: '全域定价智能体 (Pricing Agent)', role: '自动监控欧洲竞品并对标最利零售公式调价', budget: 1500, status: '运行中', successRate: 99.1, runs: 12400 },
    { id: 'agent_2', name: '买家挽留跟进商控智能体 (Retention Agent)', role: '捕捉30天未买高潜买家并自动对账发放回流折扣', budget: 800, status: '运行中', successRate: 98.4, runs: 8520 },
    { id: 'agent_3', name: '多语语系本地化智能体 (Localization Agent)', role: '商品德、意、法、西多语种对账式全量秒级合规翻译', budget: 2000, status: '运行中', successRate: 99.8, runs: 41200 },
    { id: 'agent_4', name: '交易防欺诈智能体 (Anti-Fraud Agent)', role: '三维风险评估欧洲异地套现卡并实施冻扣拦截', budget: 3000, status: '运行中', successRate: 99.9, runs: 94800 },
    { id: 'agent_5', name: '缺货自动采购规划智能体 (Procurement Agent)', role: '监控各库房SKU配额并向欧洲保税配给点下达采购单', budget: 2500, status: '运行中', successRate: 97.6, runs: 3410 }
  ]);

  const [eventStream, setEventStream] = useState<Array<{
    id: string;
    timestamp: string;
    eventName: string;
    tenant: string;
    payload: any;
  }>>([
    { id: 'ev_tx_901a', timestamp: '2026-06-08 05:18:22', eventName: 'ORDER_PAID', tenant: 'tenant_retail_milan', payload: { orderId: 'ord_eu_8297x', amount: 1490.00, currency: 'EUR', isVip: true } },
    { id: 'ev_tx_8912', timestamp: '2026-06-08 05:15:30', eventName: 'SKU_INVENTORY_LOW', tenant: 'tenant_healthcare_pos', payload: { sku: 'SKU-VITA-C-500', stockLeft: 12, triggerPoint: 20 } },
    { id: 'ev_tx_8830', timestamp: '2026-06-08 05:12:11', eventName: 'RECALIBRATE_RAG_INDEX', tenant: 'system_global_overseer', payload: { triggerMode: 'CRON_JOB_DAILY', targetKb: 'kb_prod' } },
    { id: 'ev_tx_8754', timestamp: '2026-06-08 05:08:45', eventName: 'STRIPE_PAYOUT_TRIGGERED', tenant: 'tenant_food_munich', payload: { splitRatio: 0.012, platformFeeAmount: 3.84, bankChannel: 'CH-Zurich' } }
  ]);

  const [settlements, setSettlements] = useState([
    { id: 'set_98210', tenantName: '米兰风尚服装批发集团', count: 482, totalGmv: 154800, commissionRate: 0.5, feeEarned: 774.00, status: '已打款至商家承兑账户', date: '2026-06-08 05:00' },
    { id: 'set_98209', tenantName: '慕尼黑私房菜配送店', count: 1294, totalGmv: 42100, commissionRate: 1.0, feeEarned: 421.00, status: '已打款至商家承兑账户', date: '2026-06-08 04:30' },
    { id: 'set_98208', tenantName: '美容店连锁专区', count: 215, totalGmv: 19800, commissionRate: 2.0, feeEarned: 396.00, status: '结算待触发', date: '2026-06-08 04:00' },
    { id: 'set_98207', tenantName: '百货电器销售链', count: 88, totalGmv: 284000, commissionRate: 0.5, feeEarned: 1420.00, status: '结算待触发', date: '2026-06-07 18:00' }
  ]);

  const [webhooks, setWebhooks] = useState([
    { id: 'wh_1', url: 'https://api.milanstyle.it/webhooks/orders', event: 'order.created', secret: 'whsec_98A2f...', active: true },
    { id: 'wh_2', url: 'https://erp.munichdish.de/payouts/receiver', event: 'payout.succeeded', secret: 'whsec_01Baa...', active: true }
  ]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvent, setNewWebhookEvent] = useState('order.created');

  // Input states for custom agent creation
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('');
  const [newAgentBudget, setNewAgentBudget] = useState(1000);

  // Roles permission center state
  const [roles, setRoles] = useState([
    { id: 'op_1', name: '林克凡 (Platform Admin)', role: '平台超级操盘管理员', permissions: ['全网商户封停', '支付清算结算', '底座底层中继调配', '安全规则重置'], scope: '全域资源所有权', status: '正常' },
    { id: 'op_2', name: '索菲亚·洛伦 (Financial Auditor)', role: '清算结算审计主管', permissions: ['支付网关分成划拨', '商户账单强制特批', '套餐费率轮替配置'], scope: '财务/结算中心', status: '正常' },
    { id: 'op_3', name: '马克斯·莫勒 (Operator Staff)', role: '多租户保障专员', permissions: ['通信通道监控', '知识库合规入库审核', '自动化规则审计'], scope: '通信/知识库中心', status: '就绪' }
  ]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Operator Staff');

  // App Market form states
  const [newAppName, setNewAppName] = useState('');
  const [newAppDeveloper, setNewAppDeveloper] = useState('');
  const [newAppPrice, setNewAppPrice] = useState('Free');
  const [newAppCategory, setNewAppCategory] = useState<'Agent' | 'Workflow' | 'Plugin' | 'Knowledge Pack'>('Plugin');
  const [newAppDesc, setNewAppDesc] = useState('');
  const [appScopes, setAppScopes] = useState('read_products,write_orders');

  // Dynamic token input budgets
  const [tokenAdjustments, setTokenAdjustments] = useState<Record<string, number>>({});

  // Subscriptions Overriding states
  const [manualTenantId, setManualTenantId] = useState('');
  const [manualPlanType, setManualPlanType] = useState('enterprise');
  const [manualMonths, setManualMonths] = useState(12);

  const handleUpdatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setPlans(prev => prev.map(p => {
      if (p.id === selectedPlanId) {
        return { ...p, ...planForm };
      }
      return p;
    }));
    onAddSystemLog('Billing Controller', '套餐更新', `更新套餐「${selectedPlanId}」规则：费率 ${planForm.price} USD，佣金扣点 ${planForm.commission}%`, 'success');
  };

  const handleSaveGateway = (id: string, updatedFields: Partial<typeof gateways[0]>) => {
    setGateways(prev => prev.map(g => g.id === id ? { ...g, ...updatedFields } : g));
    onAddSystemLog('Payment Router', '网关配置修改', `修改支付网关「${id}」状态/费率`, 'info');
  };

  const handleRegisterApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName) return;
    const newItem: AppMarketItem = {
      id: `app_${Date.now()}`,
      name: newAppName,
      developer: newAppDeveloper || 'SaaS Operator Lab',
      icon: '🧩',
      price: newAppPrice,
      rating: 5.0,
      category: newAppCategory,
      description: `${newAppDesc} | Scopes: ${appScopes}`,
      installed: false
    };
    onAddMarketItem(newItem);
    setNewAppName('');
    setNewAppDeveloper('');
    setNewAppDesc('');
    onAddSystemLog('App Store Registrar', '上架全新插件', `成功在全局应用市场注册并开启权限隔离模型插件「${newAppName}」`, 'success');
  };

  const handleManualSubscriptionOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTenantId) return;
    const target = tenants.find(t => t.id === manualTenantId);
    if (!target) return;
    onAddSystemLog('Tenant Billing', '强制授权订阅', `手动绕过账单网关，对商家「${target.companyName}」强制开通「${manualPlanType}」套餐 ${manualMonths} 个月`, 'success');
    setManualTenantId('');
    alert(`商户 [${target.companyName}] 已被成功特批开通 [${manualPlanType}] 套餐！`);
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleIf || !newRuleThen) return;
    const newRule = {
      id: `rule_${Date.now()}`,
      ifCondition: newRuleIf,
      thenAction: newRuleThen,
      active: true,
      runs: 0
    };
    setRules(prev => [...prev, newRule]);
    onAddSystemLog('AI Flows', '注入新智能决策流规则', `添加规程: IF ${newRuleIf} THEN ${newRuleThen}`, 'success');
    setNewRuleIf('');
    setNewRuleThen('');
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName) return;
    const newPrsn = {
      id: `op_${Date.now()}`,
      name: newStaffName,
      role: newStaffRole,
      permissions: newStaffRole === '平台超级操盘管理员' ? ['全网商户封停', '底层鉴权重置'] : ['通信监控', '审计日志审核'],
      scope: '分配子域资源访问',
      status: '正常'
    };
    setRoles(prev => [...prev, newPrsn]);
    onAddSystemLog('Permissions Controller', '添加运维主管职位', `成功添加运维工作人员 [${newStaffName}]，角色归属于 [${newStaffRole}]`, 'success');
    setNewStaffName('');
  };

  const syncKnowledgeIndexed = (id: string, name: string) => {
    setSyncingKbId(id);
    onAddSystemLog('Knowledge Engine', '同步知识索引', `对知识分类模块「${name}」执行了强制再合并索引分词并写入物理物理节点`, 'info');
    setTimeout(() => {
      setSyncingKbId(null);
      setKnowledgeBases(prev => prev.map(kb => kb.id === id ? { ...kb, entryCount: kb.entryCount + Math.floor(Math.random() * 15) } : kb));
      alert(`「${name}」知识索引同步成功！多租户隔离层读写权重验证 100% 完整。`);
    }, 1000);
  };

  // Modern Audit logger list
  const auditLogsList = [
    { time: '2026-06-08 05:12:01', module: '多租户路由', desc: '米兰风尚服装批发集团 数据库物理集群网格隔离鉴权通过', status: '成功', type: 'success' },
    { time: '2026-06-08 05:10:49', module: '账款分流', desc: '通过 Adyen 拆分欧洲零售账户 1.2% 并提划入平台瑞士公账', status: '结算完成', type: 'success' },
    { time: '2026-06-08 05:08:12', module: '底座安全机制', desc: '检查慕尼黑私房菜配送店 智能自动化频段触发每分钟 50k 限制阈值 - 未触发阻断', status: '正常运行', type: 'info' },
    { time: '2026-06-08 05:05:18', module: '短信分路', desc: 'Twilio 下发订单催付通知 3500 封分发载荷成功', status: '投递完毕', type: 'success' },
    { time: '2026-06-08 04:59:30', module: '规则决策引擎', desc: '检测到服装商户 SKU: SE-BLU-L 降至警戒线，IF-THEN 触发自动采购任务', status: '自动流转', type: 'warning' },
    { time: '2026-06-08 04:55:41', module: 'AI审计中心', desc: '平台安全审计机制全量核检，防任务调用溢出及越权提权监测已生效', status: '核监安全', type: 'info' }
  ];

  return (
    <div className="w-full space-y-6 text-slate-800 font-sans animate-fadeIn">
      
      {/* SUBTAB 1: STATISTICS DASHBOARD - 📊 平台总览 */}
      {activeSubTab === 'stats' && (
        <div className="space-y-6 text-left">
          
          {/* Top Info Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">SaaS 全局主引擎监测大盘</h2>
              <p className="text-xs text-slate-500 mt-1">实时汇总多租户流水、系统结算、AI推理额度及网络路由状态</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-2.5 py-1">SYS_STATUS: ACTIVE</span>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase">全网交易总额 (GMV)</span>
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
              <p className="text-2xl font-black mt-2 font-mono text-slate-900">
                € {settlements.reduce((acc, s) => acc + s.totalGmv, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <div className="mt-2 text-[10px] text-emerald-600 font-bold">↑ +14.2% 全网实时清账流水</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase">月度软件订阅估值 (MRR)</span>
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
              <p className="text-2xl font-black mt-2 font-mono text-slate-900">
                $ {(tenants.filter(t => t.status === 'active').length * 299).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <div className="mt-2 text-[10px] text-emerald-600 font-bold">↑ 活跃商户 × 均价 $299/月</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase">活跃商户总数 (Tenants)</span>
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
              <p className="text-2xl font-black mt-2 font-mono text-slate-900">
                {tenants.filter(t => t.status === 'active').length} <span className="text-sm font-bold text-slate-400 font-sans">/ {tenants.length}</span>
              </p>
              <div className="mt-2 text-[10px] text-amber-600 font-bold">⚠️ {tenants.filter(t => t.status === 'suspended').length} 家商户违规/欠缴锁定停运</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase">平台已计税扣扣佣金</span>
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
              <p className="text-2xl font-black mt-2 font-mono text-indigo-600">
                € {settlements.reduce((acc, s) => acc + s.feeEarned, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <div className="mt-2 text-[10px] text-indigo-600 font-bold">100% 自动清水分成自入瑞士行</div>
            </div>

          </div>

          {/* Active isolation structures */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-left">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">多租户平台数据与安全隔离运行网格 (Multi-Tenant Routing Grid)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              {tenants.map(t => (
                <div key={t.id} className={`p-4 rounded-xl border transition-all ${t.status === 'suspended' ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono text-slate-405 font-bold">{t.id}</span>
                    <span className={`w-2 h-2 rounded-full ${t.status === 'suspended' ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                  </div>
                  <p className="text-xs font-bold text-slate-950 truncate">{t.companyName}</p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold font-mono">{t.industry}</p>
                  <div className="mt-3 text-[10px] font-bold text-slate-600 flex justify-between">
                    <span>隔离网格:</span>
                    <span className="text-indigo-700 font-mono">Node_{t.id.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gateways and SMTP short cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-left">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">现行通道承载机制</h3>
              <div className="space-y-2">
                {gateways.map(g => (
                  <div key={g.id} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/50 rounded-lg border border-slate-150 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{g.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">分成比例: {g.sharePct}% | 承载地域: {g.region}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${g.status ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {g.status ? '已启用' : '暂停服务'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-left">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">系统通信核心转发监控</h3>
              <div className="space-y-3 text-xs font-medium text-slate-705">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                  <span className="text-slate-500">Twilio SMS 国际通道</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 rounded px-2 py-0.5 text-[10px]">
                    可用余额: {smsChannel.balance} 条 | 负载均衡良好
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                  <span className="text-slate-500">SendGrid 核心邮件中继</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 rounded px-2 py-0.5 text-[10px]">
                    SMTP通道已就绪 | 送达率 99.85%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">多租户逻辑数据库安全边界</span>
                  <span className="text-indigo-700 font-extrabold uppercase bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5 text-[10px]">
                    瑞士独立沙箱防渗
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB 2: TENANT & MERCHANT REGISTRY - 👥 租户管理 */}
      {activeSubTab === 'tenants' && (
        <div className="space-y-6 text-left">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">商户租户隔离控制中心</h2>
            <p className="text-xs text-slate-500 mt-1">全局管理物理隔离在底座上的企业商户，设置其每月智能自动化运行额度，并执行封存/解冻底层操作</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="p-4">租户 ID</th>
                    <th className="p-4">企业主体名称</th>
                    <th className="p-4">注册对应行业</th>
                    <th className="p-4">入驻签约时刻</th>
                    <th className="p-4">已消耗智能开店调度额 / 月度触顶额</th>
                    <th className="p-4">隔离运行状态</th>
                    <th className="p-4 text-center">自动化限额调配与物理隔离</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {tenants.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-indigo-600">{t.id.toUpperCase()}</td>
                      <td className="p-4 font-bold text-slate-800">{t.companyName}</td>
                      <td className="p-4 font-semibold uppercase">{t.industry === 'retail' ? '👕 零售服装' : t.industry === 'food' ? '🍔 外卖餐饮' : t.industry === 'service' ? '💅 美容预约' : t.industry === 'healthcare' ? '🏪 POS门店' : '🔋 百货电器'}</td>
                      <td className="p-4">{t.createdAt}</td>
                      <td className="p-4 font-mono font-semibold">
                        <span className="text-emerald-750 font-bold">${t.aiSpent.toFixed(2)}</span>
                        <span className="text-slate-300 mx-1">/</span>
                        <span className="text-slate-450">${t.aiBudget}</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                          t.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                          {t.status === 'active' ? '独立核算运行' : '权限强制阻断'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          
                          {/* Token adjustment */}
                          <div className="flex items-center gap-1">
                            <input 
                              type="number" 
                              placeholder="配额($)"
                              value={tokenAdjustments[t.id] ?? ''} 
                              onChange={e => setTokenAdjustments({ ...tokenAdjustments, [t.id]: Number(e.target.value) })}
                              className="w-20 bg-white border border-slate-200 text-slate-800 text-[11px] px-2 py-1 rounded font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                            <button 
                              onClick={() => {
                                const adj = tokenAdjustments[t.id];
                                if (adj !== undefined && adj > 0) {
                                  onUpdateTenantAiBudget(t.id, adj);
                                  setTokenAdjustments({ ...tokenAdjustments, [t.id]: 0 });
                                  onAddSystemLog('Tenant Control', '调整自动化额度', `调整租户「${t.companyName}」月度自动化运行预算最高额度为: $${adj}`, 'success');
                                  alert(`商户 [${t.companyName}] 月度最大自动化调度预算调整为 $${adj}`);
                                }
                              }}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2 py-1.5 rounded text-[10px] transition-colors cursor-pointer"
                            >
                              调配
                            </button>
                          </div>

                          {/* Suspension Toggle */}
                          <button 
                            onClick={() => {
                              const targetStatus = t.status === 'active' ? 'suspended' : 'active';
                              onUpdateTenantStatus(t.id, targetStatus);
                              onAddSystemLog('Multi-Tenant Core', '紧急强关或解冻', `由于策略重置，手动置商户「${t.companyName}」状态为 ${targetStatus === 'active' ? '激活' : '强制挂起停运'}`, targetStatus === 'active' ? 'success' : 'warning');
                            }}
                            className={`px-2.5 py-1.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                              t.status === 'active'
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {t.status === 'active' ? '🚨 强制封停' : '🔓 一键恢复'}
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2">🔐 多租户逻辑沙箱隔离与数据库分区规程</h3>
            <p className="text-xs text-slate-550 mb-4 leading-relaxed">平台全面杜绝共享同一个非隔离数据库。每个商户在注册时，底层将触发独立的空间分配、物理密钥对及独立的数据库集群格栅，有效规避跨商户越权防渗攻击。</p>
            <button 
              onClick={() => {
                onAddSystemLog('Platform Core Sec', '物理集群防渗透重构性校验', '重新全网物理鉴权密钥对及签名证书', 'warning');
                alert('全网多租户数据库物理鉴权对已重置重新哈希，各个分区均处于100%安全封闭阻隔状态下。');
              }}
              className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Key className="w-4 h-4 text-yellow-400" />
              <span>全量重签多租户物理格栅密钥证书</span>
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 3: SUBSCRIPTIONS & PLANS CONFIGS - 💳 套餐管理 */}
      {activeSubTab === 'billing' && (
        <div className="space-y-6 text-left">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">SaaS 现行业务套餐控制</h2>
            <p className="text-xs text-slate-500 mt-1">自主管理供商户开店前置签约的阶梯版本规格，控制商户佣金扣点、接口API限流以及云存储容量</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Manual Subscription Override Form */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm h-full">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                <span>战略特批/商期特批强行注入</span>
              </h3>
              <form onSubmit={handleManualSubscriptionOverride} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">选定目标商户</label>
                  <select 
                    value={manualTenantId} 
                    onChange={e => setManualTenantId(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">-- 请选择受批商户 --</option>
                    {tenants.map(t => (
                      <option key={t.id} value={t.id}>{t.companyName} ({t.id.toUpperCase()})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">强开目标级别</label>
                  <select 
                    value={manualPlanType} 
                    onChange={e => setManualPlanType(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="starter">Starter (标准基础起跑版)</option>
                    <option value="professional">Professional (专业进阶版)</option>
                    <option value="enterprise">Enterprise (企业级旗舰专线)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">签署开通期限 (月)</label>
                  <select 
                    value={manualMonths} 
                    onChange={e => setManualMonths(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="3">3 个月（集团测试用途）</option>
                    <option value="12">12 个月（年度战略协议）</option>
                    <option value="36">36 个月（三载巨量长期合约）</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  强制向目标数据库注册授权
                </button>
              </form>
            </div>

            {/* Plans List Table and Custom Form */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-5 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">阶梯版本底座规格参数列表</h3>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider">PLATFORM CORE TIERS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {plans.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => {
                      setSelectedPlanId(p.id);
                      setPlanForm({ price: p.price, commission: p.commission, apiLimit: p.apiLimit, storage: p.storage, aiToken: p.aiToken });
                    }}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${selectedPlanId === p.id ? 'bg-indigo-50/50 border-indigo-500 shadow-sm' : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-700 uppercase">{p.name}</span>
                      {selectedPlanId === p.id && <span className="text-[9px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded leading-none">设置中</span>}
                    </div>
                    <p className="text-xl font-black font-mono text-slate-900">${p.price} <span className="text-[10px] text-slate-400 font-medium">/月</span></p>
                    
                    <div className="mt-3.5 space-y-1.5 text-[10px] font-bold text-slate-600 font-sans">
                      <p>流水扣点佣金: <span className="text-slate-900 font-mono">{p.commission}%</span></p>
                      <p>API限额/月: <span className="text-slate-900 font-mono">{p.apiLimit.toLocaleString()}</span></p>
                      <p>前置预配存储: <span className="text-slate-900 font-mono">{p.storage} GB</span></p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Editing Form */}
              <form onSubmit={handleUpdatePlan} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>修改所选套餐规格: {plans.find(p => p.id === selectedPlanId)?.name}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">价格月租 ($)</label>
                    <input 
                      type="number" 
                      value={planForm.price} 
                      onChange={e => setPlanForm({ ...planForm, price: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">交易流水扣点 (%)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={planForm.commission} 
                      onChange={e => setPlanForm({ ...planForm, commission: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">月并发API阈值(次)</label>
                    <input 
                      type="number" 
                      value={planForm.apiLimit} 
                      onChange={e => setPlanForm({ ...planForm, apiLimit: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">云文件隔离存储 (GB)</label>
                    <input 
                      type="number" 
                      value={planForm.storage} 
                      onChange={e => setPlanForm({ ...planForm, storage: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button 
                    type="submit" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer"
                  >
                    立即下发覆盖此套餐
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 3.5: FINANCIAL SETTLEMENT COMMISSION BILLS - 💰 财务结算 */}
      {activeSubTab === 'settlement' && (
        <div className="space-y-6 text-left animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">全网商户清算与分成对账中心</h2>
              <p className="text-xs text-slate-500 mt-1">
                根据商户开店所属套餐扣点级别，秒级清算交易结算款，并一键调拨下发至商户对应的欧洲承兑银行。
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  // 1-click settle all pending
                  const updated = settlements.map(s => s.status === '结算待触发' ? { ...s, status: '已打款至商家承兑账户' } : s);
                  setSettlements(updated);
                  onAddSystemLog('Settlement Auditor', '全网一键对账与清结算', '将所有待结算的商户分成指令全部物理下发下派完毕', 'success');
                  alert('全网待结算流水清结算打款指令已通过安全校验，成功汇出至各商户承兑行！');
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer animate-pulse"
              >
                ⚡ 全网一键交公交核
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <span className="text-[10px] font-bold text-slate-505 uppercase">当前全店 GMV 总成对账款</span>
              <p className="text-lg font-black text-slate-900 mt-1 font-mono">
                € {settlements.reduce((acc, s) => acc + s.totalGmv, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-indigo-50 border border-indigo-150 rounded-xl p-4">
              <span className="text-[10px] font-bold text-indigo-805 uppercase">已入瑞士瑞士公账 (SaaS 净佣金)</span>
              <p className="text-lg font-black text-indigo-700 mt-1 font-mono">
                € {settlements.reduce((acc, s) => acc + s.feeEarned, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-4">
              <span className="text-[10px] font-bold text-emerald-805 uppercase">实予商户分成代发行 (Net Merchant Pay)</span>
              <p className="text-lg font-black text-emerald-700 mt-1 font-mono">
                € {settlements.reduce((acc, s) => acc + s.totalGmv - s.feeEarned, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Table List of Settlements */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="p-4">账房打款标号 ID</th>
                    <th className="p-4">对应企业主商户</th>
                    <th className="p-4">本周期交易单量</th>
                    <th className="p-4">全周期商户 GMV</th>
                    <th className="p-4">套餐签约佣金扣点</th>
                    <th className="p-4">测算平台分成利润</th>
                    <th className="p-4">实发打款佣金 (商户净得)</th>
                    <th className="p-4">对账时间</th>
                    <th className="p-4 text-center">打款分账执行状态 / 控制器</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {settlements.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-indigo-600">{s.id.toUpperCase()}</td>
                      <td className="p-4 font-bold text-slate-800">{s.tenantName}</td>
                      <td className="p-4 font-mono font-semibold">{s.count} 笔订单</td>
                      <td className="p-4 font-mono font-bold text-slate-900">€{s.totalGmv.toLocaleString()}</td>
                      <td className="p-4 font-mono text-indigo-700 font-bold">{s.commissionRate}%</td>
                      <td className="p-4 font-mono text-indigo-600 font-bold">€{s.feeEarned.toFixed(2)}</td>
                      <td className="p-4 font-mono text-emerald-700 font-bold">
                        €{(s.totalGmv - s.feeEarned).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-slate-500">{s.date}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2 font-sans">
                          {s.status === '已打款至商家承兑账户' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold text-[10px]">
                              ● 已下发至商户承兑户
                            </span>
                          ) : (
                            <div className="flex gap-1">
                              <button 
                                onClick={() => {
                                  const updated = settlements.map(item => item.id === s.id ? { ...item, status: '已打款至商家承兑账户' } : item);
                                  setSettlements(updated);
                                  onAddSystemLog('Settlement Engine', '手动对账打款确认', `成功汇款商户「${s.tenantName}」分成货款 €${(s.totalGmv - s.feeEarned).toFixed(2)}`, 'success');
                                  alert(`商户 [${s.tenantName}] 账期货款对账完毕，已打款对公账户！`);
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2 py-1.5 rounded text-[10px] cursor-pointer transition-colors"
                              >
                                ✅ 确认并汇出货款
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Policy Auditing Information block */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5 text-xs text-amber-900 leading-relaxed font-semibold">
            🛡️ 根据欧盟《PSD2 支付服务指令》和《反洗钱 (AML5)》监管规约，平台所有分成打款均由瑞士联合苏黎世银行作为第三方托管进行结算拆分，支持实时商户VAT抵扣对账。平台不进行任何资金囤积。
          </div>
        </div>
      )}

      {/* SUBTAB 4: PAYMENT GATEWAY ROUTING - 🔗 支付管理 */}
      {activeSubTab === 'gateways' && (
        <div className="space-y-6 text-left">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">支付网关合规中转分配</h2>
            <p className="text-xs text-slate-500 mt-1">统配全店前台买家结算付款时底座支持的支付中继，动态拆出结算流水佣金转入平台瑞士中心账户</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gateways.map(g => (
              <div key={g.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">网关标号: {g.id.toUpperCase()}</span>
                  <button 
                    onClick={() => handleSaveGateway(g.id, { status: !g.status })}
                    className="cursor-pointer"
                  >
                    {g.status ? (
                      <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                        <span>网关正常就绪</span>
                        <ToggleRight className="w-6 h-6 text-emerald-500" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-400 font-bold text-xs">
                        <span>网关物理关停</span>
                        <ToggleLeft className="w-6 h-6 text-slate-300" />
                      </div>
                    )}
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{g.name}</h3>
                  <p className="text-[10px] text-indigo-700 font-bold font-mono mt-0.5">主结算交收区: {g.region}</p>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">主用物理 API Key 凭证</label>
                    <input 
                      type="password" 
                      value={g.key} 
                      onChange={e => handleSaveGateway(g.id, { key: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-2.5 py-1.5 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">平台佣金自吸抽成比 (%)</label>
                    <input 
                      type="number" 
                      step="0.05"
                      value={g.sharePct} 
                      onChange={e => handleSaveGateway(g.id, { sharePct: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-850 text-xs px-2.5 py-1.5 rounded font-mono"
                    />
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-150 font-bold">
                  ℹ️ 平台拆成公式会自动应用前台。消费者结账后，付款网关在扣除结算网关费率后，1.5%或指定比例自动下发，无需商户提现手动划拨！
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: COMMUNICATIONS CHANNELS - 📨 通信管理 */}
      {activeSubTab === 'channels' && (
        <div className="space-y-6 text-left">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">通信平台网关与告警配制</h2>
            <p className="text-xs text-slate-500 mt-1">集中设定买家订单自动催收、物流动态分发、两步登录令牌调用的国际 Twilio 及 SendGrid 中继秘钥</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Twilio Carrier */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-indigo-600" />
                  <span>Twilio 国际高流量短信网卡端口</span>
                </h3>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 border border-emerald-100 rounded-full font-mono">STATUS: HIGH CAPACITY ON</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">CARRIER PROVIDER SID</label>
                  <input 
                    type="text" 
                    value={smsChannel.provider}
                    onChange={e => setSmsChannel({ ...smsChannel, provider: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">SMS ACCESS TOKEN KEY</label>
                  <input 
                    type="password" 
                    value={smsChannel.apiKey}
                    onChange={e => setSmsChannel({ ...smsChannel, apiKey: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">SMS DISPLAY HEADER</label>
                    <input 
                      type="text" 
                      value={smsChannel.senderId}
                      onChange={e => setSmsChannel({ ...smsChannel, senderId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">TIMEOUT BOUNDS ALIGN (MS)</label>
                    <input 
                      type="number" 
                      value={smsChannel.latencyAlert}
                      onChange={e => setSmsChannel({ ...smsChannel, latencyAlert: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 font-sans mt-2">
                  <span className="text-xs font-bold text-indigo-800">平台短信池可用余量计费包:</span>
                  <span className="font-mono text-xs text-indigo-700 font-black">{smsChannel.balance.toLocaleString()} 条</span>
                </div>
              </div>
            </div>

            {/* SendGrid */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>SendGrid SMTP 邮件发送中继</span>
                </h3>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 border border-emerald-100 rounded-full font-mono">STATUS: RUNNING</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">EMAIL HOST SERVER URL</label>
                  <input 
                    type="text" 
                    value={mailChannel.provider}
                    onChange={e => setMailChannel({ ...mailChannel, provider: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">SECRET MAIL API AUTH KEY</label>
                  <input 
                    type="password" 
                    value={mailChannel.apiKey}
                    onChange={e => setMailChannel({ ...mailChannel, apiKey: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">SYSTEM DISPLAY EMAIL ID</label>
                  <input 
                    type="text" 
                    value={mailChannel.senderId}
                    onChange={e => setMailChannel({ ...mailChannel, senderId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 text-xs font-mono"
                  />
                </div>

                <div className="flex items-center justify-between bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 font-sans mt-2">
                  <span className="text-xs font-bold text-indigo-800">本投单周期累计发出欧洲保单/对账单:</span>
                  <span className="font-mono text-xs text-indigo-700 font-black">{mailChannel.balance.toLocaleString()} 封</span>
                </div>
              </div>
            </div>

          </div>

          <div className="flex justify-end mt-4">
            <button 
              onClick={() => {
                onAddSystemLog('SMTP SMS Carriers', '保存信道核心参数', '全网底层网关路由参数更新完成', 'success');
                alert('底座通信参数保存并生效！已通过安全防越权防伪装审查机制。');
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              保存全局底层通信服务器参数
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 6: INTELLIGENT OPERATIONS CONTROL - 🧠 智能操作中心 */}
      {activeSubTab === 'ai-ops' && (
        <div className="space-y-6 text-left animate-fadeIn">
          
          <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">🧠 平台型智能操作中心 (SaaS Intelligent Operations Control Center)</h2>
              <p className="text-xs text-slate-500 mt-1">控制、配置并审计整个 SaaS 平台中多租户隔离的 AI 智能体、工作流拓扑、自动化规则、事件网格与执行健康状况</p>
            </div>
          </div>

          {/* 8 Operational Subtabs Row */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
            {[
              { id: 'agents', name: '🧠 智能体管理' },
              { id: 'workflows', name: '🔄 工作流管理' },
              { id: 'automations', name: '⚡ 自动化管理' },
              { id: 'kb', name: '📚 知识库管理' },
              { id: 'rules', name: '📏 规则管理' },
              { id: 'events', name: '📡 事件管理' },
              { id: 'tasks', name: '✅ 任务管理' },
              { id: 'monitor', name: '📈 执行监控' }
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => setAiOpsSubTab(sub.id as any)}
                className={`px-3 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${aiOpsSubTab === sub.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          {/* PART 1: 🧠 智能体管理 */}
          {aiOpsSubTab === 'agents' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 p-4 rounded-xl text-xs leading-relaxed font-semibold">
                ℹ️ 平台级智能体独立核算：每个运行于商户店内的智能体均被赋予指定的月度运行资金与频次配额上限，防止由于调用流量泛洪造成过度扣费。您可在下方直接调配各核心智能体硬顶，运行诊断以校验多租户容器沙箱的活性。
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Agent lists table */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm lg:col-span-2 space-y-4 p-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">当前存活的系统级智能体注册表</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                          <th className="p-3">智能体名称</th>
                          <th className="p-3">主责运维范畴</th>
                          <th className="p-3">资金月配额</th>
                          <th className="p-3">调用健康度</th>
                          <th className="p-3">操盘</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-755">
                        {agents.map(ag => (
                          <tr key={ag.id} className="hover:bg-slate-50/50">
                            <td className="p-3">
                              <p className="font-bold text-slate-900">{ag.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{ag.id.toUpperCase()}</p>
                            </td>
                            <td className="p-3 text-slate-550 font-medium">{ag.role}</td>
                            <td className="p-3 text-slate-800 font-bold font-mono">${ag.budget}</td>
                            <td className="p-3">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5">
                                <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                                {ag.successRate}% ({ag.runs.toLocaleString()} runs)
                              </span>
                            </td>
                            <td className="p-3">
                              <button 
                                onClick={() => {
                                  onAddSystemLog('Agent Supervisor', '智能体诊断', `对智能体 「${ag.name}」 进行多租户沙箱隔离诊断：通信反馈良好、可用。`, 'info');
                                  alert(`智能体 [${ag.name}] 诊断完成！\n- 沙箱物理隔离评估：100% 隔离\n- API 响应延迟：48ms\n- 当前状态：极佳`);
                                }}
                                className="bg-slate-100 hover:bg-slate-200 border border-slate-250 font-bold text-[10px] px-2 py-1 rounded cursor-pointer animate-pulse"
                              >
                                沙箱诊断
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Merchant Live Agents fleet list - Direct Connection */}
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-100 pt-6 pb-2">🏬 活跃租户店内部署运行中的多智能体员工</h3>
                  {activeAgents.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 font-semibold">暂无活跃的商户在店内召唤智能服务员工...</p>
                  ) : (
                    <div className="overflow-x-auto text-left font-sans">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                            <th className="p-3">部署智能体姓名</th>
                            <th className="p-3">所属微服务归属</th>
                            <th className="p-3">大业务职责描述</th>
                            <th className="p-3">自动化战果 (完成任务)</th>
                            <th className="p-3 text-center">超级管理员物理控制</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-705">
                          {activeAgents.map(ag => (
                            <tr key={ag.id} className="hover:bg-slate-50/50">
                              <td className="p-3 flex items-center gap-2">
                                <span className="text-base">{ag.emoji}</span>
                                <div>
                                  <p className="font-bold text-slate-900">{ag.name}</p>
                                  <p className="text-[10px] text-indigo-600 font-mono">{ag.id}</p>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded font-bold text-[9px] bg-slate-100 text-slate-600">
                                  Default Live Store
                                </span>
                              </td>
                              <td className="p-3 text-slate-500 max-w-[200px] truncate">{ag.role}</td>
                              <td className="p-3">
                                <span className="font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                                  {ag.tasksCompleted || 0} 笔对账
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex gap-1.5 justify-center font-sans">
                                  <button
                                    onClick={() => {
                                      onAddSystemLog('Agent Supervisor', '智能体热重启', `热重启商户店内智能体 「${ag.name}」 运行容器。`, 'info');
                                      alert(`智能体 [${ag.name}] 的隔离沙箱容器热重载完成，各微服务端口正常，状态：活跃。`);
                                    }}
                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] px-2 py-1 rounded border border-indigo-100 cursor-pointer"
                                  >
                                    物理重启
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (onUpdateAgents) {
                                        const filtered = activeAgents.filter(item => item.id !== ag.id);
                                        onUpdateAgents(filtered);
                                        onAddSystemLog('Agent Supervisor', '人工热停关断', `由于超配限制，超管操作撤回租户智能体 「${ag.name}」 系统承销授权。`, 'warning');
                                        alert(`商户店内智能体 [${ag.name}] 已被平台超管强制关闭物理吊销，运行资金已释放退回。`);
                                      }
                                    }}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] px-2 py-1 rounded border border-rose-100 cursor-pointer"
                                  >
                                    物理关断
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Provision custom core-agent */}
                <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm h-full">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">➕ 开通全新全局核心智能体</h3>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newAgentName) return;
                      const newAg = {
                        id: `agent_${Date.now()}`,
                        name: newAgentName,
                        role: newAgentRole || '通用智能自动化对账跟进',
                        budget: Number(newAgentBudget),
                        status: '运行中',
                        successRate: 100.0,
                        runs: 0
                      };
                      setAgents(prev => [...prev, newAg]);
                      onAddSystemLog('Agent Registry', '注册全新运维级智能体', `将智能体 「${newAgentName}」 注册至系统全局微内核`, 'success');
                      setNewAgentName('');
                      setNewAgentRole('');
                      setNewAgentBudget(1000);
                      alert(`全新超级智能体 [${newAgentName}] 已成功挂载，并推入全网商户可用租户集！`);
                    }}
                    className="space-y-4 text-xs font-semibold"
                  >
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">智能体英文与中文描述名</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. 邮件情绪风险阻断智能体" 
                        value={newAgentName}
                        onChange={e => setNewAgentName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">运维主责与数据流向归属</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. 自动评估跨境买家退款诉求真实情绪并挂起" 
                        value={newAgentRole}
                        onChange={e => setNewAgentRole(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">月度自动调度最高消费预算限额 ($)</label>
                      <input 
                        type="number" 
                        required 
                        value={newAgentBudget}
                        onChange={e => setNewAgentBudget(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 font-mono"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-xs"
                    >
                      向物理计算底座挂载此智能体
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* PART 2: 🔄 工作流管理 */}
          {aiOpsSubTab === 'workflows' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 p-4 rounded-xl text-xs font-bold leading-relaxed">
                ⚙️ 系统工作流拓扑拓补图 (Active Topologies)：每个商户都可以安装公共工作流，或利用开发者 SDK 注册新拓扑。点击「运行测试执行流」可产生一笔不影响商户资产的仿真流量对账流。
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {workflows.map(wf => (
                  <div key={wf.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wide font-mono">{wf.id.toUpperCase()}</h4>
                      <button 
                        onClick={() => {
                          setWorkflows(prev => prev.map(w => w.id === wf.id ? { ...w, active: !w.active } : w));
                          onAddSystemLog('AI Topology Controller', '工作流活性切换', `置「${wf.name}」活性状态为 ${!wf.active ? '激活' : '禁用'}`, 'warning');
                        }}
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border transition-colors cursor-pointer ${wf.active ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
                      >
                        {wf.active ? '活性就绪运行中' : '暂停调度'}
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{wf.name}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{wf.description}</p>

                    <div className="bg-slate-50 border border-slate-150 p-4 rounded-lg space-y-2.5 text-xs font-semibold">
                      <p className="text-[10px] font-extrabold uppercase text-slate-400">隔离数据流向拓扑序列</p>
                      <div className="space-y-2">
                        {wf.steps.map((st, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-[9px] font-mono">{sIdx + 1}</span>
                            <span className="text-slate-800">{st}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-150 pt-3">
                      <div className="font-mono text-[10px] font-bold text-slate-400">
                        累计成功执行数: <span className="text-slate-850 text-xs font-black">{wf.executionCount.toLocaleString()} Runs</span>
                      </div>
                      <button 
                        onClick={() => {
                          // Change the counter
                          setWorkflows(prev => prev.map(w => w.id === wf.id ? { ...w, executionCount: w.executionCount + 1 } : w));
                          onAddSystemLog('AI Simulator Feed', '仿真运行工作流', `对拓扑「${wf.id}」触发了无损沙箱试运行。`, 'success');
                          // Push new item into eventStream
                          const rHexId = `ev_tx_${Math.random().toString(16).substr(2, 4)}`;
                          const mockEv = {
                            id: rHexId,
                            timestamp: new Date().toISOString().replace('T', ' ').substr(0, 19),
                            eventName: wf.id === 'wf_prod' ? 'PRODUCT_LAUNCHED' : 'LOW_INVENTORY_TRIGGERED',
                            tenant: 'simulation_control_operator',
                            payload: { workflowId: wf.id, simulationStatus: 'SUCCESS_AUDITED', executionCostSec: 0.14 }
                          };
                          setEventStream(prev => [mockEv, ...prev]);
                          alert(`数据仿真流成功跑通！\n- 工作流 ID: ${wf.id}\n- 已自动向「📡 事件管理」推入一笔带有散列加密标记的核验日志，以便审计。`);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10.5px] px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        ⚡ 运行测试执行流
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PART 3: ⚡ 自动化管理 */}
          {aiOpsSubTab === 'automations' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 p-4 rounded-xl text-xs font-bold leading-relaxed">
                🤖 自动化通道及 Cron / Webhook 智能调校：监控和调校从外部支付或物流回调中注入的多租户后台自动数据流。
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">全网数据注入自动化中继网格</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                  {[
                    { name: '外部商品发布图文 RAG 自动化监听渠道', rate: '5回执 / 秒', latency: '42ms', desc: '监听商户通过 ERP 推送的新商品，一旦发现即激活自动翻译及分类决策树', active: true },
                    { name: 'Adyen / Stripe 分成账账期清结算触发器', rate: '每日1次 (04:00 触发)', latency: '120ms', desc: '每日凌晨自动统计多租户昨日佣金，汇总分割到平台和商家账户', active: true },
                    { name: '欧洲各海运港口物流汇率配额拉取触发器', rate: '每4小时1次', latency: '280ms', desc: '拉取最新瑞士与法兰克福海关最新货柜起运关税并更新多租户物流总表', active: false }
                  ].map((auto, aIdx) => (
                    <div key={aIdx} className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3 hover:border-slate-350 transition-colors flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 mb-2">
                          <span className="font-bold text-slate-800">{auto.name}</span>
                          <span className={`w-2 h-2 rounded-full ${auto.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                        </div>
                        <p className="text-[11px] text-slate-450 leading-relaxed font-semibold">{auto.desc}</p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 font-bold">
                          <span>频率: {auto.rate}</span>
                          <span>平均中后延时: {auto.latency}</span>
                        </div>
                        <button 
                          onClick={() => {
                            onAddSystemLog('Webhook Automation Regulator', '调试通道', `对「${auto.name}」下发并重新校准通信网络`, 'info');
                            alert(`调试连接正常！信道承载负荷均衡。`);
                          }}
                          className="w-full text-center py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[#9F7AEA] font-bold text-[10px] cursor-pointer"
                        >
                          下发测试 ping 信号
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PART 4: 📚 知识库管理 */}
          {aiOpsSubTab === 'kb' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-xs flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>多租户底层 RAG 知识合并中继</span>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    客服大脑、智能描述撰写、多语系翻译模块均建立在合规的分类知识库中。点击强制同步可将其持久化序列哈希重新加载。
                  </p>
                </div>
                <button 
                  onClick={() => {
                    onAddSystemLog('RAG Overseer', '全量知识对账', '重新检索合并全库 5 大类知识点索引', 'info');
                    alert('全域商品、物流、售后知识索引一致性校验正常。');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 font-bold text-xs text-white px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>全量再校哈希</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {knowledgeBases.map(kb => (
                  <div key={kb.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-350 transition-all flex flex-col justify-between h-40">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
                        <span className="text-[10px] bg-indigo-50 text-indigo-750 font-bold px-1.5 py-0.5 rounded leading-none">{kb.category}</span>
                        <span className="font-mono text-[9px] text-slate-400">隔离层</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{kb.name}</h4>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-sans text-slate-450 font-bold">
                        <span>规格索引词项:</span>
                        <span className="font-mono text-slate-800">{kb.entryCount} 词条</span>
                      </div>
                      <button 
                        disabled={syncingKbId === kb.id}
                        onClick={() => syncKnowledgeIndexed(kb.id, kb.name)}
                        className={`w-full text-center py-1 rounded text-[10px] font-extrabold cursor-pointer border ${
                          syncingKbId === kb.id 
                            ? 'bg-slate-100 text-slate-400 border-slate-200 animate-pulse' 
                            : 'bg-slate-50 hover:bg-indigo-50 border-slate-200 text-slate-700 hover:text-indigo-700 hover:border-indigo-200'
                        } transition-colors`}
                      >
                        {syncingKbId === kb.id ? '索引重建中...' : '🔄 强制合并同步'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PART 5: 📏 规则管理 */}
          {aiOpsSubTab === 'rules' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm h-full font-semibold">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">➕ 注入系统全局默认 IF-THEN 自动规程</h3>
                <form onSubmit={handleAddRule} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 mb-1">IF（当触发指定业务界定警戒）</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 客户消费金额累计超过 500 EUR"
                      value={newRuleIf}
                      onChange={e => setNewRuleIf(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-[11px] text-slate-800 focus:outline-[#9F7AEA]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 mb-1">THEN（自动下发特批任务）</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 分配专属客户跟进并下发专属关怀邮件"
                      value={newRuleThen}
                      onChange={e => setNewRuleThen(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-[11px] text-slate-800 focus:outline-[#9F7AEA]"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-slate-900 hover:bg-black text-white py-2 rounded-md font-bold text-[11px] cursor-pointer transition-colors"
                  >
                    注入全局决策数据库
                  </button>
                </form>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm lg:col-span-2 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  🛡️ 规则数据库 (Rule Presets - 类似于 Shopify Flow )
                </h3>

                <div className="space-y-2">
                  {rules.map(rule => (
                    <div key={rule.id} className="p-3.5 bg-slate-50 border border-slate-150 rounded-lg flex items-center justify-between text-xs">
                      <div className="space-y-1.5 pr-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="bg-indigo-600 text-white font-extrabold px-1.5 py-0.5 rounded text-[9px] font-mono leading-none">IF</span>
                          <span className="text-slate-900 font-bold">{rule.ifCondition}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded text-[9px] font-mono leading-none">THEN</span>
                          <span className="text-slate-700 font-semibold">{rule.thenAction}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 font-mono text-[10px] font-bold">
                        <div>
                          <p className="text-slate-400 text-right">触发行数</p>
                          <p className="text-indigo-700 text-right text-xs font-black">{rule.runs.toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => {
                            setRules(prev => prev.filter(r => r.id !== rule.id));
                            onAddSystemLog('Rule Engine', '删除系统默认规则', `剥离系统规则IF: ${rule.ifCondition}`, 'warning');
                          }}
                          className="text-rose-650 hover:text-rose-800 p-1 rounded hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PART 6: 📡 事件管理 */}
          {aiOpsSubTab === 'events' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900 text-white p-5 rounded-xl flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
                    <span>SaaS 底座全网实时事件流 (Real-time Event Bus Tracer)</span>
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    追踪各物理隔离租户发生的关键交易、库存警戒或 RAG 任务。您可以模拟下发特定的业务事件，验证底层流转规则链对于此事件的捕获及下发。
                  </p>
                </div>

                {/* Quick fake trigger injection */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const rHex = `ev_tx_${Math.random().toString(16).substr(2, 4)}`;
                      const newE = {
                        id: rHex,
                        timestamp: new Date().toISOString().replace('T', ' ').substr(0, 19),
                        eventName: 'ORDER_PAID',
                        tenant: 'tenant_retail_milan',
                        payload: { orderId: `ord_tr_${Math.floor(Math.random() * 9000 + 1000)}`, amount: parseFloat((Math.random() * 800 + 200).toFixed(2)), currency: 'EUR', isVip: Math.random() > 0.5 }
                      };
                      setEventStream(prev => [newE, ...prev]);
                      onAddSystemLog('Event Router', '下发业务模拟事件', '触发全局 ORDER_PAID 监听单元并通过', 'success');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all"
                  >
                    🚀 注入模拟 ORDER_PAID 事件
                  </button>
                  <button 
                    onClick={() => {
                      const rHex = `ev_tx_${Math.random().toString(16).substr(2, 4)}`;
                      const newE = {
                        id: rHex,
                        timestamp: new Date().toISOString().replace('T', ' ').substr(0, 19),
                        eventName: 'SKU_INVENTORY_LOW',
                        tenant: 'tenant_healthcare_pos',
                        payload: { sku: 'SKU-HEALTH-OMEGA3', stockLeft: 4, triggerPoint: 15 }
                      };
                      setEventStream(prev => [newE, ...prev]);
                      onAddSystemLog('Event Router', '下发库存警戒模拟事件', '触发全局 SKU_INVENTORY_LOW 监听单元', 'warning');
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all"
                  >
                    ⚠️ 注入模拟 SKU_INVENTORY_LOW 事件
                  </button>
                </div>
              </div>

              {/* Event Streams Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                        <th className="p-3 font-mono">事件 Hex_ID</th>
                        <th className="p-3">事件戳记</th>
                        <th className="p-3">触发事件名 (eventName)</th>
                        <th className="p-3">事件引发租户</th>
                        <th className="p-3">承载 JSON 载荷 (payload)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-slate-700 text-[11px]">
                      {eventStream.map(evt => (
                        <tr key={evt.id} className="hover:bg-slate-50/50">
                          <td className="p-3 text-[#9F7AEA] font-bold">{evt.id}</td>
                          <td className="p-3 text-slate-400">{evt.timestamp}</td>
                          <td className="p-3 font-bold text-slate-900">
                            <span className={`px-2 py-0.5 rounded border font-sans text-[10px] ${
                              evt.eventName === 'ORDER_PAID' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                              evt.eventName === 'SKU_INVENTORY_LOW' ? 'bg-rose-50 text-rose-800 border-rose-100' :
                              'bg-slate-100 text-slate-800 border-slate-200'
                            }`}>
                              {evt.eventName}
                            </span>
                          </td>
                          <td className="p-3 font-sans font-semibold text-slate-550">{evt.tenant}</td>
                          <td className="p-3">
                            <pre className="text-[10px] bg-slate-50 border border-slate-100 text-slate-500 rounded p-1.5 overflow-x-auto max-w-[400px]">
                              {JSON.stringify(evt.payload, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PART 7: ✅ 任务管理 */}
          {aiOpsSubTab === 'tasks' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 p-4 rounded-xl text-xs font-semibold leading-relaxed">
                ℹ️ 系统任务分类与异步执行：下方表格追踪了多租户核心流程中异步消费的高频分析计算。作为控制台运维，您有权在这里对其强制启用或暂停，重置后台调用计数。
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <th className="p-4">任务名称</th>
                      <th className="p-4">对应计算范围</th>
                      <th className="p-4">任务底层可用状态</th>
                      <th className="p-4 font-mono">推理对账成功率</th>
                      <th className="p-4 font-mono">全网调用计数</th>
                      <th className="p-4 text-right">人工操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {aiTasks.map(task => (
                      <tr key={task.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-slate-900">{task.name}</td>
                        <td className="p-4 text-slate-550 font-medium">
                          {task.id === 'categorization' && '商品分类哈希分发与 Shopify Category 转换目录'}
                          {task.id === 'translation' && '德言意法语种全自动秒级合规对照映射'}
                          {task.id === 'labeling' && '产品描述提取买家搜索标签分值对账'}
                          {task.id === 'risk_check' && '账期清结算高危信用卡反套利套卡筛查'}
                          {task.id === 'customer_seg' && '回流促活消费模型分群对账'}
                          {task.id === 'feedback_analysis' && '评论语境提取情绪对账'}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                            task.status === '运行中' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-150 text-slate-600 border-slate-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${task.status === '运行中' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                            {task.status}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-indigo-700">{task.successRate}%</td>
                        <td className="p-4 font-mono font-bold text-slate-700">{task.totalRuns.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              const newStatus = task.status === '运行中' ? '被关断' : '运行中';
                              setAiTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
                              onAddSystemLog('Task Administrator', '切换任务状态', `强制设置「${task.name}」可用性为 ${newStatus}`, newStatus === '运行中' ? 'success' : 'warning');
                            }}
                            className={`px-3 py-1 bg-white hover:bg-slate-100 text-xs font-bold border rounded-lg cursor-pointer ${
                              task.status === '运行中' ? 'text-rose-600 border-rose-200' : 'text-emerald-600 border-emerald-250'
                            }`}
                          >
                            {task.status === '运行中' ? '🔴 紧急闭停' : '🟢 恢复调度'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PART 8: 📈 执行监控 */}
          {aiOpsSubTab === 'monitor' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
              
              {/* Approvals */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
                <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                  <h3 className="text-xs font-extrabold text-[#9F7AEA] uppercase tracking-wider flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>特批任务流核定 (Pending Approvals)</span>
                  </h3>
                  <span className="font-mono text-[10.5px] text-[#9F7AEA] font-bold">({pendingApprovals.length}) 条待审</span>
                </div>

                {pendingApprovals.length === 0 ? (
                  <p className="text-xs text-slate-450 font-medium py-6 text-center">🎉 无高危挂起待核准事务，符合系统预设</p>
                ) : (
                  <div className="space-y-3">
                    {pendingApprovals.map(apr => (
                      <div key={apr.id} className="p-3 bg-indigo-50/40 border border-[#9F7AEA]/20 rounded-lg text-xs space-y-2">
                        <div className="flex justify-between font-bold text-slate-500 text-[10px]">
                          <span className="truncate max-w-[150px]">{apr.tenant}</span>
                          <span>{apr.time}</span>
                        </div>
                        <p className="font-bold text-slate-900">{apr.action}</p>
                        <p className="text-[10px] text-slate-500 italic mt-1 font-medium bg-white p-1.5 rounded">{apr.reason}</p>
                        <div className="flex justify-end gap-2 pt-1">
                          <button 
                            onClick={() => {
                              setPendingApprovals(prev => prev.filter(p => p.id !== apr.id));
                              onAddSystemLog('Rules Approver', '特批驳回关断', `驳回特批流: ${apr.action}`, 'warning');
                            }}
                            className="bg-white hover:bg-rose-50 text-rose-600 font-extrabold px-2.5 py-1 rounded text-[10px] border border-rose-250 cursor-pointer transition-colors"
                          >
                            阻断驳回
                          </button>
                          <button 
                            onClick={() => {
                              setPendingApprovals(prev => prev.filter(p => p.id !== apr.id));
                              onAddSystemLog('Rules Approver', '特批授权放行', `批准放行特批流: ${apr.action}`, 'success');
                              alert('特批放行指令发送成功！数据逻辑已自动对账写入对应企业账房。');
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-2.5 py-1 rounded text-[10px] cursor-pointer transition-colors"
                          >
                            核准通过
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Exception Automation Tasks */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm lg:col-span-2">
                <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                  <h3 className="text-xs font-extrabold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>执行层异常任务告警 (Infrastructure Exception Logs)</span>
                  </h3>
                  <span className="font-mono text-[10.5px] text-rose-600 font-bold">({exceptionTasks.filter(e=>!e.resolved).length}) 条阻断警告</span>
                </div>

                <div className="space-y-2">
                  {exceptionTasks.map(exc => (
                    <div key={exc.id} className={`p-3 rounded-lg border text-xs flex items-center justify-between ${exc.resolved ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-rose-50/50 border-rose-200'}`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded text-[9px] uppercase leading-none font-mono">FAILS</span>
                          <span className="font-bold text-slate-900">{exc.task}</span>
                          <span className="text-slate-400">|</span>
                          <span className="text-slate-550 font-semibold">{exc.tenant}</span>
                        </div>
                        <p className="font-mono text-[11px] text-rose-600 font-bold bg-white/70 p-1.5 rounded border border-rose-100/40">{exc.error}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{exc.time}</p>
                      </div>

                      <div className="shrink-0">
                        {exc.resolved ? (
                          <span className="text-slate-500 font-bold text-[10px]">已标记解决</span>
                        ) : (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                  setExceptionTasks(prev => prev.map(e => e.id === exc.id ? { ...e, resolved: true } : e));
                                  onAddSystemLog('Exception Handler', '消除告警', `手动将「${exc.task}」告警标记为已清除`, 'info');
                                }}
                              className="bg-white hover:bg-slate-105 text-slate-600 font-bold px-2.5 py-1 rounded text-[10px] border border-slate-200 cursor-pointer"
                            >
                              忽略置灰
                            </button>
                            <button 
                              onClick={() => {
                                  onAddSystemLog('Exception Handler', '重试自动化任务', `重新序列下发「${exc.task}」至多租户隔离计算池`, 'info');
                                  setExceptionTasks(prev => prev.map(e => e.id === exc.id ? { ...e, resolved: true } : e));
                                  alert('执行层任务重试成功！下游反馈已经顺利通过。');
                                }}
                              className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-2.5 py-1 rounded text-[10px] cursor-pointer transition-colors"
                            >
                              立即重试
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* SUBTAB 7: APP MARKETPLACE PLUGINS REGISTRY - 🧩 应用市场 */}
      {activeSubTab === 'marketplace' && (
        <div className="space-y-6 text-left">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">应用市场插件审核与隔离发布</h2>
            <p className="text-xs text-slate-500 mt-1">审核并向各租户分发全网级 SaaS 插件。每个应用自动拥有指定的 API 数据存取权限隔离边界</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quick adding plugin item */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm h-full">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">➕ 在全网应用市场发布新上架插件</h3>
              <form onSubmit={handleRegisterApp} className="space-y-3.5 text-xs font-semibold">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1 font-bold">应用插件名称</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 自动报关货运单 ERP 同步"
                    value={newAppName} 
                    onChange={e => setNewAppName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1 font-bold">开发者团队</label>
                    <input 
                      type="text" 
                      placeholder="e.g. SAP Cloud Center"
                      value={newAppDeveloper} 
                      onChange={e => setNewAppDeveloper(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1 font-bold">定价收费计费包</label>
                    <input 
                      type="text" 
                      placeholder="e.g. $19/mo"
                      value={newAppPrice} 
                      onChange={e => setNewAppPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1 font-bold">归属大类</label>
                    <select 
                      value={newAppCategory} 
                      onChange={e => setNewAppCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none font-sans"
                    >
                      <option value="Plugin">🧩 常规功能插件</option>
                      <option value="Agent">🤖 智能AI代理</option>
                      <option value="Workflow">⚙️ 智能工作流套件</option>
                      <option value="Knowledge Pack">📚 细分行业知识包</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1 font-bold">授权隔离访问 API</label>
                    <input 
                      type="text" 
                      placeholder="e.g. read_products,write_orders"
                      value={appScopes} 
                      onChange={e => setAppScopes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 mb-1 font-bold">功能描述</label>
                  <textarea 
                    rows={2}
                    placeholder="简短描述该插件的隔离逻辑..."
                    value={newAppDesc} 
                    onChange={e => setNewAppDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs cursor-pointer transition-colors"
                >
                  通过隔离审计并发布上架
                </button>
              </form>
            </div>

            {/* Current Apps in Market */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                📦 现行全网应用市场数据库 (Plugin Registry Index)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto">
                {marketItems.map(item => (
                  <div key={item.id} className="p-3.5 bg-slate-55 border border-slate-200 rounded-xl space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-900 font-bold text-xs">{item.name}</span>
                        <span className="text-[10px] bg-slate-100/85 text-slate-600 font-bold px-1.5 py-0.5 rounded leading-none">{item.price}</span>
                      </div>
                      <p className="text-[9px] text-indigo-705 font-mono pt-0.5">DEV: {item.developer} | ID: {item.id}</p>
                      <p className="text-[10.5px] text-slate-500 mt-2 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 text-[10px] font-bold">
                      <span className="text-[#9F7AEA]">类别: {item.category}</span>
                      <span className="text-emerald-700">底座合规鉴章 ✔</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 8: ROLES PERMISSIONS CENTER - 🔐 权限中心 */}
      {activeSubTab === 'roles' && (
        <div className="space-y-6 text-left">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">🔐 全网运维与财务大权限控制中心</h2>
            <p className="text-xs text-slate-500 mt-1">控制能够进入此总后台的运维工程师及财务审计专员等人员，进行精细权限分配和异地登录审计</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Adding staff form */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm h-full">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">➕ 分派全新运维审计职等权限</h3>
              <form onSubmit={handleAddStaff} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1 font-bold">真实姓名</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 刘维斯"
                    value={newStaffName} 
                    onChange={e => setNewStaffName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 mb-1 font-bold">指派角色职系</label>
                  <select 
                    value={newStaffRole} 
                    onChange={e => setNewStaffRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none text-xs font-sans"
                  >
                    <option value="平台超级操盘管理员">平台超级操盘管理员</option>
                    <option value="清算结算审计主管">清算结算审计主管</option>
                    <option value="多租户保障专员">多租户保障专员</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg text-slate-500 text-[10.5px] leading-relaxed font-bold border border-slate-150">
                  ℹ️ 每一个分发的账号均绑定了 Mfa（多因子验证码登录卡），其进入本系统总平台后，系统将自动使用欧洲本地签名机制监查。
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-[11px] cursor-pointer"
                >
                  签署并分发身份指纹秘钥
                </button>
              </form>
            </div>

            {/* Staff permissions table */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                📋 内部持印大特权工作人员清单 (Staff Master Registry)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="bg-slate-55 border-b border-slate-150 text-slate-500 font-bold">
                      <th className="p-3">大宗管理姓名</th>
                      <th className="p-3">被指派职衔</th>
                      <th className="p-3">允许管辖资源域</th>
                      <th className="p-3">关键特权指令列表</th>
                      <th className="p-3 text-right">操盘</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {roles.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{r.name}</td>
                        <td className="p-3 font-semibold text-[#9F7AEA]">{r.role}</td>
                        <td className="p-3 font-semibold font-mono uppercase text-slate-551">{r.scope}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {r.permissions.map((p, pIdx) => (
                              <span key={pIdx} className="bg-slate-100 border border-slate-200 text-slate-600 rounded px-1.5 py-0.5 text-[9px] font-bold">
                                {p}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => {
                              onAddSystemLog('Permissions Controller', '强制注销工作人员', `回收并废除 [${r.name}] 持有的所有运维证书`, 'error');
                              setRoles(prev => prev.filter(st => st.id !== r.id));
                              alert(`[${r.name}] 的全部安全访问证书及大管辖特权已被瞬间吊销废止！`);
                            }}
                            className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 cursor-pointer"
                            title="一键吊销所有特权"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 9: LIVE LOGS EVENT BUS - 📜 审计中心 */}
      {activeSubTab === 'logs' && (
        <div className="space-y-6 text-left animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">底座合规对账与一致性安全审计</h2>
              <p className="text-xs text-slate-500 mt-1">实时追踪涉及全网分流划拨、数据库强制关断、多租户自动化及系统配额调整的底座对账流</p>
            </div>
            <button 
              onClick={() => {
                onAddSystemLog('Security Audit', '全链日志校验完成', '底座与各租户隔离空间证书校对完成，指纹吻合。', 'success');
                alert('物理级别证书一致性完整，哈希签名通过率 100%！系统安全防篡改。');
              }}
              className="bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>重新校验服务器签名一致性</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <th className="p-4">时刻</th>
                  <th className="p-4">归属底座子系统</th>
                  <th className="p-4">对账审计细节</th>
                  <th className="p-4">最终处理结果</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-705">
                {auditLogsList.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono text-slate-400 font-bold">{log.time}</td>
                    <td className="p-4 font-bold text-indigo-700">{log.module}</td>
                    <td className="p-4 font-bold text-slate-800">{log.desc}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        log.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        log.type === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-indigo-50 text-indigo-700 border-indigo-100'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 10: SYSTEMS SETTINGS - ⚙️ 系统设置 */}
      {activeSubTab === 'settings' && (
        <div className="space-y-6 text-left animate-fadeIn">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">⚙️ SaaS 全局大系统规程开关</h2>
            <p className="text-xs text-slate-500 mt-1">控制此多租户SaaS软件的主路线、最大佣金阀值限制、容灾备用中心备置及系统级维护模式</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-650" />
                <span>全局资费及策略硬顶控制</span>
              </h3>

              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1 font-bold">平台交易抽点佣金最高限额顶 (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={settingsForm.maxCommissionCap}
                    onChange={e => setSettingsForm({ ...settingsForm, maxCommissionCap: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 font-mono"
                  />
                  <p className="text-[9.5px] text-slate-400 mt-1">限制清算中心内，全网任何商家套餐设定的 transaction cut-off 抽点最大不能溢出于此区间。</p>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 mb-1 font-bold">最高允许免费入驻/零元购测试配额数量</label>
                  <input 
                    type="number" 
                    value={settingsForm.maxFreeQuota}
                    onChange={e => setSettingsForm({ ...settingsForm, maxFreeQuota: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 mb-1 font-bold">底层多租户异地灾备及中心主路由</label>
                  <select 
                    value={settingsForm.routingLoc}
                    onChange={e => setSettingsForm({ ...settingsForm, routingLoc: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 font-sans"
                  >
                    <option value="瑞士苏黎世双备节点">🇨🇭 瑞士苏黎世（最高银行级物理隐私隔离节点）</option>
                    <option value="爱尔兰都柏林主服务中心">🇮🇪 爱尔兰都柏林（主服务及自动化分发多租户中继点）</option>
                    <option value="德国法兰克福灾备节点">🇩🇪 德国法兰克福（异地低延迟灾备容灾网络路由点）</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-indigo-650" />
                <span>物理灾备与维护强制开关</span>
              </h3>

              <div className="space-y-4 text-xs font-bold">
                
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="text-xs text-slate-900">平台级维护模式启用 (Maintenance Mode)</h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">
                      启动后，除超级平台管理员以外的所有商户后台、以及前台结账橱窗均将被 503 Overload 阻断。
                    </p>
                  </div>
                  <button 
                    onClick={() => setSettingsForm({ ...settingsForm, isMaintenanceMode: !settingsForm.isMaintenanceMode })}
                    className="cursor-pointer shrink-0"
                  >
                    {settingsForm.isMaintenanceMode ? (
                      <ToggleRight className="w-10 h-10 text-rose-500" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-slate-300" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="text-xs text-slate-900">锁定商户底层 RAG 上传合规对账验证</h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">
                      强制对商家上传的退货规定、商品图文资料进行防虚假、防违禁品、防泛洪黑客语句扫描。
                    </p>
                  </div>
                  <button 
                    onClick={() => setSettingsForm({ ...settingsForm, forceSecuritySign: !settingsForm.forceSecuritySign })}
                    className="cursor-pointer shrink-0"
                  >
                    {settingsForm.forceSecuritySign ? (
                      <ToggleRight className="w-10 h-10 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-slate-300" />
                    )}
                  </button>
                </div>

                <button 
                  onClick={() => {
                    onAddSystemLog('Global System Conf', '全局底座策略覆盖', '管理员对平台资费硬顶、限制阈值执行了安全改动并重新持久化', 'success');
                    alert('SaaS 平台级全局配置已通过隔离持久化安全机制同步至多租户容灾分区中。');
                  }}
                  className="w-full bg-slate-900 hover:bg-black text-white text-center py-2.5 rounded-lg text-xs cursor-pointer transition-all"
                >
                  保存并全网同步底座策略配置
                </button>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
