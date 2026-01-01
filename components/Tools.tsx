import React from 'react';
import { MENU_DATA } from '../data/menu';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, TrendingUp, AlertCircle, DollarSign, Leaf, Users } from './icons';

interface ToolsProps {
  activeTab: string;
  isGuest: boolean;
}

// Simulated data for charts
const DAILY_SALES = [
  { time: '10:00', sales: 4000 },
  { time: '12:00', sales: 8500 },
  { time: '14:00', sales: 6000 },
  { time: '16:00', sales: 9200 },
  { time: '18:00', sales: 5000 },
];

const ITEM_PROFIT = MENU_DATA[0].items.slice(0, 5).map(item => ({
  name: item.name,
  price: typeof item.price === 'number' ? item.price : 0,
  cost: typeof item.price === 'number' ? Math.floor(item.price * 0.35) : 0,
}));

export const Tools: React.FC<ToolsProps> = ({ activeTab, isGuest }) => {
  
  // -- GUEST VIEW: MENU --
  if (isGuest && activeTab === 'menu') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-12 animate-fade-in">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl font-serif font-bold text-stone-800">WOOSH CAFE</h2>
          <p className="text-stone-500 italic">讓時間慢下來的咖啡角落</p>
        </div>

        {MENU_DATA.map((category, idx) => (
          <section key={idx} className="space-y-6">
            <h3 className="text-xl font-bold border-b border-stone-200 pb-2 text-stone-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#b45309] rounded-full"></span>
              {category.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {category.items.map((item, itemIdx) => (
                <div key={itemIdx} className={`flex justify-between items-start group p-2 rounded-lg hover:bg-stone-100 transition-colors ${item.soldOut ? 'opacity-50' : ''}`}>
                  <div className="space-y-1">
                    <div className="font-medium text-stone-800 flex items-center gap-2">
                      {item.name}
                      {item.soldOut && <span className="text-xs bg-stone-200 text-stone-500 px-1.5 py-0.5 rounded">售完</span>}
                    </div>
                    {item.description && <div className="text-xs text-stone-500">{item.description}</div>}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-serif font-bold text-stone-600">
                        {typeof item.price === 'number' ? `$${item.price}` : item.price}
                    </span>
                    <div className="flex gap-1 mt-1">
                      {item.tags?.map(tag => (
                        <span key={tag} className="text-[10px] border border-stone-300 text-stone-400 px-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
        
        <div className="text-center text-xs text-stone-400 mt-12 pb-8">
          - 內用低消一杯飲品，禁帶外食 -
        </div>
      </div>
    );
  }

  // -- MANAGER VIEW: MENU PROFIT ANALYSIS --
  if (!isGuest && activeTab === 'menu') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#78350f]">菜單獲利分析</h2>
            <div className="text-sm text-[#78350f]/60">資料更新: 今日 14:30</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#78350f]/10">
              <div className="text-sm text-gray-500 mb-1">平均毛利率</div>
              <div className="text-3xl font-bold text-[#3f6212]">68.4%</div>
           </div>
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#78350f]/10">
              <div className="text-sm text-gray-500 mb-1">高利潤商品數</div>
              <div className="text-3xl font-bold text-[#b45309]">12 項</div>
           </div>
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#78350f]/10">
              <div className="text-sm text-gray-500 mb-1">需優化成本商品</div>
              <div className="text-3xl font-bold text-red-600">3 項</div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#78350f]/10 h-[400px]">
            <h3 className="font-bold text-[#78350f] mb-4">熱門義式咖啡：售價 vs 成本</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ITEM_PROFIT} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="cost" stackId="a" fill="#d6d3d1" name="成本" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="price" stackId="a" fill="#b45309" name="毛利" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // -- MANAGER VIEW: DAILY --
  if (!isGuest && activeTab === 'daily') {
      return (
          <div className="p-6 space-y-8">
              <header>
                  <h2 className="text-2xl font-bold text-[#78350f] mb-2">早安，店長！</h2>
                  <p className="text-[#78350f]/70">今天是個晴朗的週二，預計下午 2 點會有客流高峰。</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                      { label: "今日營收", val: "$28,450", icon: DollarSign, color: "bg-green-100 text-green-700" },
                      { label: "來客數", val: "142 人", icon: Users, color: "bg-blue-100 text-blue-700" },
                      { label: "平均客單", val: "$200", icon: TrendingUp, color: "bg-orange-100 text-orange-700" },
                      { label: "待辦事項", val: "3 項", icon: AlertCircle, color: "bg-red-100 text-red-700" },
                  ].map((stat, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-[#78350f]/10 flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${stat.color}`}>
                              <stat.icon size={20} />
                          </div>
                          <div>
                              <div className="text-xs text-gray-500">{stat.label}</div>
                              <div className="text-xl font-bold text-gray-800">{stat.val}</div>
                          </div>
                      </div>
                  ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#78350f]/10 shadow-sm">
                      <h3 className="font-bold text-[#78350f] mb-6 flex items-center gap-2">
                          <TrendingUp size={18} /> 即時營收走勢
                      </h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={DAILY_SALES}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="sales" stroke="#b45309" strokeWidth={3} dot={{r: 4, fill: '#b45309', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                      </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-[#78350f]/10 shadow-sm space-y-6">
                      <h3 className="font-bold text-[#78350f] mb-4 flex items-center gap-2">
                          <Package size={18} /> 低庫存預警
                      </h3>
                      <div className="space-y-4">
                          {[
                              { name: "燕麥奶 (Oatside)", remain: "2 瓶", status: "Critical" },
                              { name: "耶加雪菲 咖啡豆", remain: "0.5 kg", status: "Warning" },
                              { name: "外帶紙杯 (12oz)", remain: "1 條", status: "Critical" },
                          ].map((item, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-[#fdfbf7] rounded-lg">
                                  <div>
                                      <div className="font-medium text-[#78350f]">{item.name}</div>
                                      <div className="text-xs text-[#78350f]/60">剩餘: {item.remain}</div>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                      {item.status === 'Critical' ? '緊急' : '注意'}
                                  </span>
                              </div>
                          ))}
                      </div>
                      <button className="w-full py-2 text-sm text-[#b45309] border border-[#b45309] rounded-lg hover:bg-[#b45309]/5 transition-colors">
                          一鍵補貨通知
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  // -- GENERIC PLACEHOLDER FOR OTHER TABS --
  return (
    <div className="flex flex-col items-center justify-center h-full text-[#78350f]/40 space-y-4">
        <Leaf size={48} />
        <p className="text-lg">此功能模組 ({activeTab}) 正在開發中</p>
        <p className="text-sm">Woosh Cafe 數位轉型持續進行...</p>
    </div>
  );
};