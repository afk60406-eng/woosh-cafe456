import { MenuCategory } from '../types';

export const MENU_DATA: MenuCategory[] = [
  {
    title: "義式咖啡 (Espresso, Milk)",
    items: [
      { name: "燕麥拿鐵", price: 170, tags: ["H", "I"] },
      { name: "岩鹽拿鐵", price: 170, tags: ["H", "I"] },
      { name: "拿鐵", price: 160, tags: ["H", "I"] },
      { name: "西西里變奏", price: 160, tags: ["I"] },
      { name: "西西里", price: 140, tags: ["I"] },
      { name: "美式", price: 120, tags: ["H", "I"] },
      { name: "美式氣泡", price: 120, tags: ["I"] },
      { name: "濃縮", price: 90, tags: ["H"], description: "雙倍濃縮 +$40 / 咖啡品項加 $40 可享切片法式長棍" },
    ]
  },
  {
    title: "手沖精品咖啡 (Pour Over)",
    items: [
      { name: "嘉義 阿里山 卓武山莊園 [厭氧日曬]", price: 300 },
      { name: "衣索比亞 班奇馬吉 寶貝藝妓 [水洗]", price: 200 },
      { name: "肯亞 琪瑪安圖處理場 珍珠圓豆 [水洗]", price: 190 },
      { name: "哥倫比亞 蒙特拿莊園 [酵素氧氣日曬]", price: 220 },
      { name: "哥斯大黎加 咖啡花莊園 [黃蜜處理]", price: 180 },
      { name: "巴拿馬 波奎特 凱薩路易斯 [水洗]", price: 160 },
      { name: "秘魯 庫斯料 約克之星 [水洗]", price: 0, soldOut: true },
      { name: "巴布亞新幾內亞 亞黑十字 [水洗]", price: 180 },
      { name: "印尼 曼特寧 G1 [濕制]", price: 160 },
      { name: "冰滴 (夏季限定)", price: "洽櫃台" },
    ]
  },
  {
    title: "特調飲品與果汁",
    items: [
      { name: "小情歌 莓果茶", price: 200, tags: ["H", "I"] },
      { name: "花園派對 蘋果花茶", price: 200, tags: ["H", "I"] },
      { name: "漫遊花園 綠博士茶", price: 200, tags: ["H", "I"] },
      { name: "香料可爾必思特調", price: 200, tags: ["I"] },
      { name: "白桃蘋果氣泡飲", price: 160, tags: ["I"] },
      { name: "黑醋栗薄荷氣泡飲", price: 160, tags: ["I"] },
      { name: "荔枝玫瑰氣泡飲", price: 160, tags: ["I"] },
      { name: "康普茶", price: 150, tags: ["罐"] },
      { name: "Granini 西洋梨汁", price: 120, tags: ["罐"] },
      { name: "Granini 葡萄汁", price: 120, tags: ["罐"] },
    ]
  },
  {
    title: "其他飲品",
    items: [
      { name: "抹茶歐蕾", price: 140, tags: ["H", "I"] },
      { name: "法芙娜可可歐蕾", price: 140, tags: ["H", "I"] },
      { name: "燕麥奶", price: 80, tags: ["H", "I"] },
      { name: "鮮奶", price: 70, tags: ["H", "I"] },
    ]
  },
  {
    title: "輕食、披薩與甜點",
    items: [
      { name: "葛瑪蘭黑豚火腿法棍", price: 350 },
      { name: "煙燻牛肉法棍", price: 300 },
      { name: "冷燻鮭魚小餐包", price: 300 },
      { name: "蛋沙拉小餐包", price: 250 },
      { name: "白松露焗烤馬鈴薯", price: 180 },
      { name: "蘑菇洋蔥佛卡夏", price: 150 },
      { name: "法式長棍麵包", price: 150 },
      { name: "慕尼黑德腸薄片 Pizza (8吋)", price: 220 },
      { name: "墨西哥雞肉薄片 Pizza (8吋)", price: 220 },
      { name: "田園派對薄片 Pizza (素, 8吋)", price: 220 },
      { name: "AFFOGATO 阿芙佳朵", price: 150, tags: ["夏季限定"] },
      { name: "自製優格 (搭配四種當季水果)", price: 150 },
      { name: "其他自製甜點、蛋糕", price: "洽櫃台" },
    ]
  }
];