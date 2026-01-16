
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

export const MOCK_VEHICLES: Personnel[] = [
  {
    id: 'v1',
    name: '津A·D3921',
    role: '抢修工程车',
    location: '泰达运维站',
    progress: 25,
    tasks: 2,
    avatar: 'https://img.icons8.com/color/100/delivery-truck.png',
    status: 'online'
  },
  {
    id: 'v2',
    name: '津B·K9012',
    role: '巡线车',
    location: '滨海中心站',
    progress: 78,
    tasks: 5,
    avatar: 'https://img.icons8.com/color/100/truck.png',
    status: 'online'
  },
  {
    id: 'v3',
    name: '津A·F8822',
    role: '应急指挥车',
    location: '城北运维中心',
    progress: 40,
    tasks: 1,
    avatar: 'https://img.icons8.com/color/100/suv.png',
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
