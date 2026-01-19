
import { Personnel, MapPoint } from './types.ts';

export const MOCK_PERSONNEL: Personnel[] = [
  {
    id: '1',
    name: '张洁',
    role: '场站角色',
    location: '城北运维中心',
    progress: 10,
    tasks: 1,
    avatar: 'https://picsum.photos/seed/p1/100/100',
    status: 'online'
  },
  {
    id: '2',
    name: '陈晨',
    role: '调度人员',
    location: '城南运维中心',
    progress: 60,
    tasks: 1,
    avatar: 'https://picsum.photos/seed/p2/100/100',
    status: 'online'
  },
  {
    id: '3',
    name: '郭腾蛟',
    role: '场站角色',
    location: '城北运维中心',
    progress: 85,
    tasks: 3,
    avatar: 'https://picsum.photos/seed/p3/100/100',
    status: 'online'
  },
  {
    id: '4',
    name: '张志轩',
    role: '调度人员',
    location: '城南运维中心',
    progress: 45,
    avatar: 'https://picsum.photos/seed/p4/100/100',
    tasks: 1,
    status: 'online'
  },
  {
    id: '5',
    name: '李建华',
    role: '高级维护员',
    location: '西部变电站',
    progress: 95,
    tasks: 4,
    avatar: 'https://picsum.photos/seed/p5/100/100',
    status: 'online'
  }
];

// 车辆图标 SVG Data URIs，匹配用户提供的 PNG 风格
const BLUE_CAR_SVG = `data:image/svg+xml;utf8,<svg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><rect x='5' y='5' width='90' height='90' rx='28' fill='%23dbeafe' stroke='%233b82f6' stroke-width='2'/><path d='M28 62h44v10H28zM34 50l6-18h20l6 18z' fill='none' stroke='%233b82f6' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/><circle cx='38' cy='72' r='5' fill='%233b82f6'/><circle cx='62' cy='72' r='5' fill='%233b82f6'/></svg>`;

const RED_CAR_SVG = `data:image/svg+xml;utf8,<svg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><rect x='5' y='5' width='90' height='90' rx='28' fill='%23fee2e2' stroke='%23ef4444' stroke-width='2'/><path d='M28 62h44v10H28zM34 50l6-18h20l6 18z' fill='none' stroke='%23ef4444' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/><circle cx='38' cy='72' r='5' fill='%23ef4444'/><circle cx='62' cy='72' r='5' fill='%23ef4444'/></svg>`;

const BLUE_TRUCK_SVG = `data:image/svg+xml;utf8,<svg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><rect x='5' y='5' width='90' height='90' rx='28' fill='%23dbeafe' stroke='%233b82f6' stroke-width='2'/><path d='M30 65h40v8H30zM35 65V52h18v13M53 58l10 7h7v8h-7M30 52l12-14h10l5 14' fill='none' stroke='%233b82f6' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/><circle cx='38' cy='73' r='5' fill='%233b82f6'/><circle cx='65' cy='73' r='5' fill='%233b82f6'/></svg>`;

export const MOCK_VEHICLES: Personnel[] = [
  {
    id: 'v1',
    name: '津A·D3921',
    role: '常规巡逻车',
    location: '泰达运维站',
    progress: 25,
    tasks: 2,
    avatar: BLUE_CAR_SVG,
    status: 'online'
  },
  {
    id: 'v2',
    name: '津B·K9012',
    role: '紧急调度车',
    location: '滨海中心站',
    progress: 78,
    tasks: 5,
    avatar: RED_CAR_SVG,
    status: 'online'
  },
  {
    id: 'v3',
    name: '津A·F8822',
    role: '抢修工程车',
    location: '城北运维中心',
    progress: 40,
    tasks: 1,
    avatar: BLUE_TRUCK_SVG,
    status: 'online'
  }
];

export const MOCK_MAP_POINTS: MapPoint[] = [
  { id: 'm1', x: 25, y: 30, image: 'https://picsum.photos/seed/m1/200/200', status: 'normal', progress: 10, battery: 71 },
  { id: 'm2', x: 45, y: 40, image: 'https://picsum.photos/seed/m2/200/200', status: 'warning', progress: 60, battery: 45 },
  { id: 'm3', x: 60, y: 55, image: 'https://picsum.photos/seed/m3/200/200', status: 'error', progress: 85, battery: 12 },
  { id: 'm4', x: 75, y: 65, image: 'https://picsum.photos/seed/m4/200/200', status: 'normal', progress: 45, battery: 88 },
  { id: 'm5', x: 90, y: 75, image: 'https://picsum.photos/seed/m5/200/200', status: 'normal', progress: 95, battery: 92 },
];
