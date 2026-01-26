
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_PERSONNEL, MOCK_VEHICLES, MOCK_DRONES, MOCK_SITES_LIST, SiteListItem } from '../../constants.tsx';

interface InspectionPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onTaskClick?: (task: any) => void;
  onViewAllTasks?: (data: any) => void;
  onSiteClick?: (site: SiteListItem) => void;
  onPlaybackToggle?: (isOpen: boolean, trajectoryId: string) => void; 
  onPreviewImage?: (urls: string[], idx: number) => void;
}

type SubTab = 'personnel' | 'vehicle' | 'drone' | 'hazard' | 'alarm' | 'site' | 'droneLeak' | 'vehicleLeak';
type DetailTab = 'trajectory' | 'task' | 'alarm' | 'log';
type SortField = 'status' | 'name';
type SortOrder = 'asc' | 'desc' | null;
type PickerMode = 'day' | 'month' | 'year';

interface TrajectoryItem {
  time: string;
  dist: string;
  dur: string;
}

interface TaskRecord {
  id: string;
  address: string;
  time: string;
  status: 'completed' | 'pending';
}

interface LogRecord {
  id: string;
  title: string;
  time: string;
}

const DRONE_PATH = `
  M7 10h10l1.5 2.5l-1.5 2.5h-10l-1.5-2.5z
  M5.5 11.5l-4 1 M18.5 11.5l4 1
  M1 11.5h1 M22 11.5h1
  M8 10l-3-3 M16 10l3-3
  M4 6.5h2 M18 6.5h2
  M11 15v2a1 1 0 0 0 2 0v-2 M10 18h4
`;

const SITE_ICON_PATH = `M12 3a9 9 0 0 0-9 9c0 .18.01.35.03.53A4 4 0 0 1 7 16h10a4 4 0 0 1 3.97-3.47c.02-.18.03-.35.03-.53a9 9 0 0 0-9-9zM12 5v4m-4-3l1.5 2.5m6.5-2.5L14.5 9`;

const VEHICLE_SOLID_PATH = "M17.34 5.97l.35 1.01c.04.11.01.24-.06.33-.07.09-.18.14-.3.14H6.67c-.12 0-.23-.05-.3-.14-.07-.09-.1-.22-.06-.33l.35-1.01c.1-.28.36-.47.66-.47h9.36c.3 0 .56.19.66.47zM19 12v7c0 .55-.45 1-1 1h-1c-.55 0-1-.45-1-1v-1H7v1c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1v-7c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2zm-4.5 2c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z";
const TRUCK_SOLID_PATH = "M20 10V19C20 20.1 19.1 21 18 21H17C15.9 21 15 20.1 15 19V18H9V19C9 20.1 8.1 21 7 21H6C4.9 21 4 20.1 4 19V10L3 9V7C3 5.9 3.9 5 5 5H19C20.1 5 21 5.9 21 7V9L20 10ZM18 8H6V13H18V8ZM7 15.5C7.83 15.5 8.5 14.83 8.5 14S7.83 12.5 7 12.5 5.5 13.17 5.5 14 6.17 15.5 7 15.5ZM17 15.5C17.83 15.5 18.5 14.83 18.5 14S17.83 12.5 17 12.5 15.5 13.17 15.5 14 16.17 15.5 17 15.5Z";

export const InspectionPanel: React.FC<InspectionPanelProps> = ({ isOpen, onToggle, onTaskClick, onViewAllTasks, onSiteClick, onPlaybackToggle, onPreviewImage }) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('personnel');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>('trajectory');
  
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  
  const [isTaskPlanExpanded, setIsTaskPlanExpanded] = useState(true);
  
  const [selectedTrajectoryAction, setSelectedTrajectoryAction] = useState<string | null>(null);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<PickerMode>('day');
  const calendarRef = useRef<HTMLDivElement>(null);

  const [unreadTabs, setUnreadTabs] = useState<Set<SubTab>>(new Set(['hazard', 'alarm', 'site', 'droneLeak', 'vehicleLeak']));
  const [readItemIds, setReadItemIds] = useState<Set<string>>(new Set());

  // 用于工地轮播图的当前索引状态
  const [siteCarouselIndex, setSiteCarouselIndex] = useState(0);
  
  const getTodayDate = () => new Date();
  const formatToYMD = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const [selectedDate, setSelectedDate] = useState(formatToYMD(getTodayDate()));
  const [viewDate, setViewDate] = useState(new Date(selectedDate.replace(/-/g, '/'))); 

  const handleDateSelect = (date: Date) => {
    setSelectedDate(formatToYMD(date));
    setIsCalendarOpen(false);
  };

  const handleTodayClick = () => {
    const today = getTodayDate();
    setSelectedDate(formatToYMD(today));
    setViewDate(today);
    setPickerMode('day');
    setIsCalendarOpen(false);
  };

  const handleClearClick = () => {
    setSelectedDate('');
    setIsCalendarOpen(false);
  };

  const changeView = (offset: number) => {
    if (pickerMode === 'day') {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    } else if (pickerMode === 'month') {
      setViewDate(new Date(viewDate.getFullYear() + offset, viewDate.getMonth(), 1));
    } else if (pickerMode === 'year') {
      setViewDate(new Date(viewDate.getFullYear() + offset * 10, viewDate.getMonth(), 1));
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(viewDate.getFullYear(), monthIndex, 1);
    setViewDate(newDate);
    setPickerMode('day');
  };

  const handleMonthPickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPickerMode('month');
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, viewDate.getMonth(), 1);
    setViewDate(newDate);
    setPickerMode('month');
  };

  const generateCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    let firstDayOfWeek = firstDayOfMonth.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false
      });
    }
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDayOfMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    const totalDays = 42; 
    const remainingDays = totalDays - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    return days;
  };

  const generateYears = () => {
    const startYear = Math.floor(viewDate.getFullYear() / 10) * 10;
    const years = [];
    for (let i = -1; i < 11; i++) {
      years.push(startYear + i);
    }
    return years;
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '请选择日期';
    const d = new Date(dateStr.replace(/-/g, '/'));
    return `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, '0')}月${String(d.getDate()).padStart(2, '0')}日`;
  };

  const handlePrevDay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedDate) return;
    const d = new Date(selectedDate.replace(/-/g, '/'));
    d.setDate(d.getDate() - 1);
    setSelectedDate(formatToYMD(d));
    setViewDate(d);
  };

  const handleNextDay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedDate) return;
    const d = new Date(selectedDate.replace(/-/g, '/'));
    d.setDate(d.getDate() + 1);
    setSelectedDate(formatToYMD(d));
    setViewDate(d);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
        setPickerMode('day'); 
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSortClick = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else if (sortOrder === 'desc') {
        setSortField(null);
        setSortOrder(null);
      }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const [selectedTrajectoryKeys, setSelectedTrajectoryKeys] = useState<Set<string>>(new Set());
  
  const toggleTrajectory = (itemId: string, index: number) => {
    const key = `${itemId}-${index}`;
    const newSet = new Set(selectedTrajectoryKeys);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setSelectedTrajectoryKeys(newSet);
  };

  const handleToggleAllTrajectories = (itemId: string) => {
    const newSet = new Set(selectedTrajectoryKeys);
    const itemSegments = trajectoryData.map((_, idx) => `${itemId}-${idx}`);
    const isAllSelected = itemSegments.every(key => newSet.has(key));
    
    if (isAllSelected) {
      itemSegments.forEach(key => newSet.delete(key));
    } else {
      itemSegments.forEach(key => newSet.add(key));
    }
    setSelectedTrajectoryKeys(newSet);
  };

  const subTabMapping: Record<string, SubTab[]> = {
    personnel: ['personnel', 'hazard', 'alarm', 'site'],
    vehicle: ['vehicle', 'drone', 'droneLeak', 'vehicleLeak']
  };

  const isPersonnelRelated = subTabMapping.personnel.includes(activeSubTab);
  const isDroneRelated = activeSubTab === 'drone' || activeSubTab === 'droneLeak';

  const handleTabClick = (tab: SubTab) => {
    if (unreadTabs.has(tab)) {
      const nextUnread = new Set(unreadTabs);
      nextUnread.delete(tab);
      setUnreadTabs(nextUnread);
    }
    if (!isOpen) {
      setActiveSubTab(tab);
      onToggle();
    } else {
      if (activeSubTab === tab) {
        onToggle();
      } else {
        const nextIsPersonnel = subTabMapping.personnel.includes(tab);
        if (nextIsPersonnel && activeDetailTab === 'alarm') setActiveDetailTab('trajectory');
        setActiveSubTab(tab);
        setExpandedItemId(null); 
      }
    }
  };

  const toggleExpand = (id: string) => {
    setReadItemIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    if (expandedItemId !== id) {
      setExpandedItemId(id);
      setSiteCarouselIndex(0); 
      setIsTaskPlanExpanded(true);
    } else {
      setExpandedItemId(null);
    }
  };

  const trajectoryData: TrajectoryItem[] = [
    { time: '08:30 - 09:15', dist: '2.4km', dur: '45min' },
    { time: '09:30 - 10:45', dist: '5.1km', dur: '75min' },
    { time: '11:00 - 12:00', dist: '3.8km', dur: '60min' }
  ];

  const mockTasks: TaskRecord[] = [
    { id: 't1', address: '天津市滨海新区顺民早点（百姓号）', time: '01/04 10:39', status: 'completed' },
    { id: 't2', address: '天津市滨海新区冯师傅纯碱馒头', time: '01/04 10:31', status: 'completed' },
    { id: 't3', address: '天津市滨海新区凱德米粉店（北区）', time: '01/05 09:20', status: 'pending' },
    { id: 't4', address: '天津市滨海新区万达广场商业街C区', time: '01/05 14:15', status: 'pending' },
    { id: 't5', address: '天津市滨海新区凯德广场西门', time: '01/05 15:30', status: 'pending' },
  ];

  const PERSONNEL_LOGS: LogRecord[] = [
    { id: 'pl1', title: '程序调至前台', time: '16:29' },
    { id: 'pl2', title: '解锁', time: '16:28' },
    { id: 'pl3', title: '锁屏', time: '16:28' },
  ];

  const VEHICLE_LOGS: LogRecord[] = [
    { id: 'vl1', title: '熄火', time: '11:06' },
    { id: 'vl2', title: '点火', time: '10:52' },
  ];

  const FilterCheckbox = ({ label, checked = true }: { label: string; checked?: boolean }) => (
    <label className="flex items-center space-x-1.5 cursor-pointer group select-none">
      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-all ${checked ? 'bg-[#3b82f6] text-white' : 'border border-slate-200 bg-white group-hover:border-[#3b82f6]'}`}>
        {checked && <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
      </div>
      <span className="text-[12px] font-normal text-slate-700 group-hover:text-slate-900 transition-colors">{label}</span>
    </label>
  );

  const renderItemList = (data: any[]) => (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-1.5 pb-12 pt-1 relative z-10 mt-2">
      {data.map((item) => {
        const isExpanded = expandedItemId === item.id;
        
        if (activeSubTab === 'site') {
          const site = item as SiteListItem;
          const isUnread = !readItemIds.has(site.id);
          const siteImages = [
            site.image,
            site.image.replace('seed/s', 'seed/site_alt_'),
            site.image.replace('seed/s', 'seed/site_env_')
          ];
          
          return (
            <div 
              key={site.id} 
              className={`group cursor-pointer py-2.5 px-2 -mx-2 rounded-2xl transition-all duration-300 border ${
                isExpanded 
                  ? 'bg-white border-[#9a6bff]/20 shadow-[0_20px_50px_-12px_rgba(154,107,255,0.12)] mb-3 z-10' 
                  : isUnread
                    ? 'animate-alert-flash border-transparent'
                    : 'border-transparent hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.06)] hover:bg-slate-50/50'
              }`}
              onClick={() => { toggleExpand(site.id); onSiteClick?.(site); }}
            >
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-sm border border-slate-100 mt-0.5">
                  <img src={site.image} className="w-full h-full object-cover" alt={site.name} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-slate-800 truncate pr-4">{site.name}</h3>
                    <span className="text-[12px] font-medium text-slate-600 font-mono tracking-tight shrink-0">{site.time.split(' ')[1] || site.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[12px] text-slate-600 truncate pr-4">
                      <svg className="w-3.5 h-3.5 mr-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      {site.address}
                    </div>
                    <div className="flex items-center text-[12px] font-medium text-slate-600 shrink-0">{site.manager}</div>
                  </div>
                </div>
              </div>
              {isExpanded && (
                <div className="mt-4 border-t border-slate-50 pt-3 px-1 space-y-3.5 animate-in slide-in-from-top-2 duration-300" onClick={(e) => e.stopPropagation()}>
                  <div 
                    className="relative rounded-xl overflow-hidden shadow-sm border border-slate-100/60 aspect-video mb-4 group/carousel cursor-zoom-in"
                    onClick={() => onPreviewImage?.(siteImages, siteCarouselIndex)}
                  >
                    <div 
                      className="w-full h-full flex transition-transform duration-500 ease-out"
                      style={{ transform: `translateX(-${siteCarouselIndex * 100}%)` }}
                    >
                      {siteImages.map((img, i) => (
                        <img key={i} src={img} className="w-full h-full object-cover shrink-0" alt={`工地预览图 ${i + 1}`} />
                      ))}
                    </div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSiteCarouselIndex(prev => prev > 0 ? prev - 1 : siteImages.length - 1); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/40 z-10"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSiteCarouselIndex(prev => (prev + 1) % siteImages.length); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/40 z-10"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
                      {siteImages.map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 h-1.5 rounded-full transition-all ${siteCarouselIndex === i ? 'bg-white w-4' : 'bg-white/40'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }

        const tabs: DetailTab[] = isDroneRelated ? ['trajectory', 'alarm', 'log'] : isPersonnelRelated ? ['trajectory', 'task', 'log'] : ['trajectory', 'task', 'alarm', 'log'];
        const itemSegments = trajectoryData.map((_, idx) => `${item.id}-${idx}`);
        const isAllTrajectoriesSelected = itemSegments.every(key => selectedTrajectoryKeys.has(key));
        const segmentColors = ['bg-blue-400', 'bg-amber-400', 'bg-purple-400'];

        return (
          <div 
            key={item.id} 
            className={`group cursor-pointer py-2 px-2 -mx-2 rounded-2xl transition-all duration-300 border ${
              isExpanded ? 'bg-white border-[#9a6bff]/20 shadow-[0_20px_50px_-12px_rgba(154,107,255,0.12)] mb-3 z-10' : 'border-transparent hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.06)] hover:bg-slate-50/50'
            }`}
            onClick={() => toggleExpand(item.id)}
          >
            <div className="flex items-center space-x-2 mb-1.5">
              <div className="relative shrink-0">
                <img src={item.avatar} className="w-12 h-12 rounded-xl object-contain bg-slate-50 p-1 shadow-sm transition-transform duration-300" alt={item.name} />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${item.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <h3 className={`font-bold text-slate-800 truncate shrink-0 ${activeSubTab === 'personnel' ? 'text-[14px] w-[62px]' : 'text-[12px] max-w-[180px]'}`}>
                      {item.name}
                    </h3>
                    {activeSubTab === 'personnel' && (
                      <div className="w-32 relative h-[14.5px] bg-white rounded-full overflow-hidden border shrink-0 transition-colors flex items-center justify-center" style={{ borderColor: '#7edc89' }}>
                        <div className="absolute left-0 h-full transition-all duration-1000 ease-out" style={{ width: `${item.progress}%`, backgroundColor: '#ccedd0' }}></div>
                        <span style={{ color: '#10b924' }} className="relative text-[10px] font-bold leading-none pointer-events-none">{item.progress}%</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    {activeSubTab === 'personnel' && <div className="flex items-center text-[12px] font-bold tracking-tight"><span className="text-[#9a6bff]">1</span><span className="mx-1 text-slate-400 font-normal">-</span><span className="text-[#3b82f6]">35</span></div>}
                    <svg className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
                {!isDroneRelated && (
                  <div className="flex items-center mt-1 text-[12px] text-slate-600 font-normal space-x-1.5">
                    <span className="truncate">{item.role}</span><span className="text-slate-500">•</span>
                    <div className="flex items-center truncate max-w-[120px]"><svg className="w-3.5 h-3.5 mr-1 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5" /></svg><span className="truncate">{item.location}</span></div>
                  </div>
                )}
              </div>
            </div>
            {isExpanded && (
              <div className="mt-3 border-t border-slate-50 pt-2" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-around mb-2.5 border-b border-slate-50">
                  {tabs.map((tab) => (
                    <button key={tab} onClick={() => setActiveDetailTab(tab)} className={`px-4 py-1.5 text-[12px] font-medium transition-all relative ${activeDetailTab === tab ? 'text-[#9a6bff]' : 'text-slate-500 hover:text-slate-700'}`}>{tab === 'trajectory' ? '轨迹' : tab === 'task' ? '任务' : tab === 'alarm' ? (isDroneRelated ? '隐患' : '报警') : '日志'}{activeDetailTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#9a6bff] rounded-full"></div>}</button>
                  ))}
                </div>
                {activeDetailTab === 'trajectory' && (
                  <div className="space-y-4 px-2">
                    <div className="bg-[#9a6bff]/5 rounded-xl py-2 px-4 flex items-center justify-between border border-[#9a6bff]/10">
                      <div className="space-y-0.5">
                        <span className="text-[11px] text-[#9a6bff]/60 font-medium uppercase tracking-wider">总公里数</span>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-[16px] font-black text-[#9a6bff]">11.3</span>
                          <span className="text-[11px] text-[#9a6bff] font-bold">km</span>
                        </div>
                      </div>
                      <div className="w-px h-6 bg-[#9a6bff]/10"></div>
                      <div className="space-y-0.5 text-right">
                        <span className="text-[11px] text-[#9a6bff]/60 font-medium uppercase tracking-wider">总用时区间</span>
                        <div className="text-[12px] font-bold text-slate-700">08:30 - 12:00</div>
                      </div>
                    </div>
                    <div className="pt-0.5">
                      <div className="flex items-center justify-between mb-3 px-1">
                        <div className="flex items-center space-x-2 group/all" onClick={() => handleToggleAllTrajectories(item.id)}>
                          <div className={`w-5 h-5 rounded-md border transition-all duration-200 flex items-center justify-center cursor-pointer ${isAllTrajectoriesSelected ? 'bg-[#7c4dff] border-[#7c4dff] text-white shadow-sm shadow-[#7c4dff]/20' : 'bg-white border-slate-300 group-hover/all:border-slate-400'}`}>
                            {isAllTrajectoriesSelected && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3"/></svg>}
                          </div>
                          <span className="text-[12px] font-normal text-slate-700 uppercase tracking-[0.15em] select-none cursor-pointer group-hover/all:text-slate-900 transition-colors">轨迹分段</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="relative"><button onClick={() => { const next = selectedTrajectoryAction === 'track' ? null : 'track'; setSelectedTrajectoryAction(next); onPlaybackToggle?.(next === 'track', item.id); }} className={`peer w-8 h-8 rounded-lg flex items-center justify-center transition-all border active:scale-90 z-20 relative ${selectedTrajectoryAction === 'track' ? 'bg-[#9a6bff] text-white shadow-lg shadow-[#9a6bff]/30' : 'bg-white text-slate-500 hover:bg-slate-50'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M10 8l6 4-6 4z" fill="currentColor"/></svg></button><div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 peer-hover:opacity-100 transition-all duration-200 translate-y-2 peer-hover:translate-y-0 z-50 pointer-events-none"><div className="tooltip-bubble tooltip-arrow-bottom text-nowrap">轨迹回放</div></div></div>
                        </div>
                      </div>
                      <div className="space-y-4 px-1">{trajectoryData.map((traj, idx) => { const isSelected = selectedTrajectoryKeys.has(`${item.id}-${idx}`); return (<div key={idx} onClick={() => toggleTrajectory(item.id, idx)} className="flex items-center justify-between group/line cursor-pointer select-none"><div className="flex items-center space-x-3.5"><div className={`w-5 h-5 rounded-md border transition-all duration-200 flex items-center justify-center ${isSelected ? 'bg-[#7c4dff] border-[#7c4dff] text-white shadow-sm' : 'bg-white border-slate-200'}`}>{isSelected && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3"/></svg>}</div><div className="flex items-center"><div className={`w-3.5 h-3.5 mr-2.5 rounded-sm shrink-0 shadow-sm ${segmentColors[idx % segmentColors.length]}`}></div><span className={`text-[12px] font-normal ${isSelected ? 'text-slate-800' : 'text-slate-700'}`}>{traj.time}</span></div></div><div className="flex items-center space-x-3"><span className={`px-2 py-0.5 rounded text-[12px] font-normal ${isSelected ? 'bg-[#7c4dff]/10 text-[#7c4dff]' : 'bg-slate-50 text-slate-400'}`}>{traj.dist}</span><span className="text-[12px] text-slate-500 font-normal w-12 text-right">{traj.dur}</span></div></div>); })}</div>
                    </div>
                  </div>
                )}
                {activeDetailTab === 'task' && !isDroneRelated && (
                  <div className="space-y-1.5 pt-0 pb-1.5 px-2">
                    <div onClick={() => setIsTaskPlanExpanded(!isTaskPlanExpanded)} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 py-1 px-2 -mx-2 rounded-lg transition-colors"><span className="text-[12px] font-normal text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis">{isPersonnelRelated ? '用户安检' : '抢修作业'}-{item.name}{selectedDate ? selectedDate.replace(/-/g, '/') : '未选日期'}的计划</span><svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isTaskPlanExpanded ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" strokeWidth="2"/></svg></div>
                    {isTaskPlanExpanded && (
                      <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="pl-4 pr-1 flex items-center justify-between"><div className="flex items-center space-x-12"><div className="flex items-center space-x-2"><span className="text-[12px] text-slate-500 font-normal">总计</span><span className="text-[12px] font-normal text-slate-800 leading-none">48</span></div><div className="flex items-center space-x-2"><span className="text-[12px] text-[#10b981] font-normal">已完成</span><span className="text-[12px] font-normal text-[#10b981] leading-none">32</span></div></div><button onClick={() => onViewAllTasks?.({ name: item.name, tasks: mockTasks })} className="px-4 py-1 bg-[#9a6bff]/5 text-[#9a6bff] rounded-full text-[12px] font-normal hover:bg-[#9a6bff]/10 transition-colors shadow-sm shrink-0">查看全部</button></div>
                        <div className="space-y-0 border-t border-slate-50 pt-0.5 pl-4">{mockTasks.slice(0, 4).map((task) => (<div key={task.id} className="flex items-center justify-between py-1.5 group/task-item border-b border-slate-50/50 last:border-0 pr-1 cursor-pointer hover:bg-slate-50 rounded-md transition-colors" onClick={() => onTaskClick?.(task)}><div className="flex items-center space-x-3 overflow-hidden flex-1"><div className={`w-2 h-2 rounded-full shrink-0 ${task.status === 'completed' ? 'bg-[#10b981]' : 'bg-slate-300'}`}></div><span title={task.address} className="text-[12px] font-normal text-slate-700 truncate group-hover/task-item:text-[#9a6bff] transition-colors">{task.address}</span></div><div className="shrink-0 ml-4"><span className="text-[12px] font-normal text-slate-400 font-mono">{task.time}</span></div></div>))}</div>
                      </div>
                    )}
                  </div>
                )}
                {activeDetailTab === 'log' && (
                  <div className="pt-4 px-5 relative">
                    <div className="absolute left-[23px] top-6 bottom-4 w-0.5 bg-slate-100 rounded-full"></div>
                    <div className="space-y-5">
                      {(isPersonnelRelated ? PERSONNEL_LOGS : VEHICLE_LOGS).map((log, idx) => (
                        <div key={log.id} className="flex items-center relative pl-8 group/log">
                          <div className={`absolute left-0 w-3 h-3 rounded-full border-2 bg-white transition-all z-10 ${idx === 0 ? 'border-primary shadow-[0_0_8px_rgba(154,107,255,0.5)] scale-110' : 'border-slate-300'}`}></div>
                          <div className="flex-1 flex items-center justify-between"><span className={`text-[13px] font-medium ${idx === 0 ? 'text-primary' : 'text-slate-600'}`}>{log.title}</span><span className="text-[12px] text-slate-400 font-mono">{log.time}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const dataToRender = activeSubTab === 'personnel' ? MOCK_PERSONNEL : isDroneRelated ? MOCK_DRONES : activeSubTab === 'site' ? MOCK_SITES_LIST : MOCK_VEHICLES;

  return (
    <div className="flex h-full bg-white overflow-visible flex-row">
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none w-0'}`}>
        <div className="pt-2 pb-1 px-4 border-b border-slate-50 relative z-50">
          <div className="flex items-center justify-between bg-white border border-slate-100/60 rounded-xl px-3 py-2 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] relative">
            <button onClick={handlePrevDay} className="text-slate-500 hover:text-[#7c4dff] hover:bg-slate-50 p-1 rounded-md transition-all active:scale-90"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
            <div onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="flex items-center space-x-2.5 cursor-pointer group px-2 py-1"><svg className="w-4 h-4 text-[#7c4dff] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg><span className="text-[13px] font-normal text-slate-700">{formatDisplayDate(selectedDate)}</span><svg className={`w-3 h-3 text-slate-500 group-hover:text-[#7c4dff] transition-all ${isCalendarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
            <button onClick={handleNextDay} className="text-slate-500 hover:text-[#7c4dff] hover:bg-slate-50 p-1 rounded-md transition-all active:scale-90"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" /></svg></button>
            {isCalendarOpen && (
              <div ref={calendarRef} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-slate-100 z-[100] p-4 animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4 px-1"><div className="flex items-center space-x-2">{pickerMode === 'day' ? (<div className="flex items-center space-x-1.5 group cursor-pointer" onClick={() => setPickerMode('year')}><span className="text-[14px] font-bold text-slate-800 hover:text-[#3b82f6] transition-colors">{viewDate.getFullYear()}年</span><span className="text-[14px] font-bold text-slate-800 hover:text-[#3b82f6] transition-colors" onClick={handleMonthPickerClick}>{String(viewDate.getMonth() + 1).padStart(2, '0')}月</span><svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2.5" /></svg></div>) : (<div className="flex items-center space-x-1.5 group cursor-pointer" onClick={() => setPickerMode('year')}><span className="text-[14px] font-bold text-slate-800 hover:text-[#3b82f6] transition-colors">{viewDate.getFullYear()}年</span><svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2.5" /></svg></div>)}</div><div className="flex items-center space-x-3"><button onClick={() => changeView(-1)} className="p-1 text-slate-500 hover:text-slate-700 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg></button><button onClick={() => changeView(1)} className="p-1 text-slate-500 hover:text-slate-700 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" /></svg></button></div></div>
                {pickerMode === 'day' && (<><div className="grid grid-cols-7 mb-2 border-b border-slate-50 pb-2">{['一', '二', '三', '四', '五', '六', '日'].map(w => (<span key={w} className="text-center text-[12px] font-normal text-slate-500">{w}</span>))}</div><div className="grid grid-cols-7 gap-y-1">{generateCalendarDays().map((day, idx) => { const ymd = formatToYMD(day.date); return (<div key={idx} onClick={() => handleDateSelect(day.date)} className={`aspect-square flex items-center justify-center text-[12px] font-normal rounded-lg cursor-pointer transition-all ${day.isCurrentMonth ? 'text-slate-700' : 'text-slate-400'} ${ymd === selectedDate ? 'bg-[#3b82f6] text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)]' : 'hover:bg-slate-50'} ${ymd === formatToYMD(getTodayDate()) && ymd !== selectedDate ? 'border border-[#3b82f6] text-[#3b82f6]' : ''}`}>{day.date.getDate()}</div>); })}</div></>)}
                {pickerMode === 'month' && (<div className="grid grid-cols-3 gap-x-2 gap-y-6 py-4">{['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'].map((m, idx) => (<div key={m} onClick={() => handleMonthSelect(idx)} className={`flex items-center justify-center py-2.5 rounded-xl text-[13px] font-bold cursor-pointer transition-all ${viewDate.getMonth() === idx ? 'bg-[#3b82f6] text-white shadow-lg' : 'text-slate-700 hover:bg-slate-50 hover:text-[#3b82f6]'}`}>{m}</div>))}</div>)}
                {pickerMode === 'year' && (<div className="grid grid-cols-3 gap-x-2 gap-y-6 py-4">{generateYears().map((y, idx) => (<div key={y} onClick={() => handleYearSelect(y)} className={`flex items-center justify-center py-2.5 rounded-xl text-[13px] font-bold cursor-pointer transition-all ${(idx === 0 || idx === 11) ? 'text-slate-400' : viewDate.getFullYear() === y ? 'bg-[#3b82f6] text-white shadow-lg' : 'text-slate-700 hover:bg-slate-50 hover:text-[#3b82f6]'}`}>{y}</div>))}</div>)}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50"><button onClick={handleClearClick} className="text-[12px] font-normal text-[#3b82f6] hover:underline px-1">清除</button><button onClick={handleTodayClick} className="text-[12px] font-normal text-[#3b82f6] hover:underline px-1">今天</button></div>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0 relative">
          {activeSubTab !== 'site' && (
            <div className="px-5 mt-2 space-y-3 relative z-30" ref={filterRef}>
              <div className="flex space-x-3">
                <div className="relative flex-1">
                  <input type="text" placeholder={activeSubTab === 'personnel' ? "搜索人员..." : isDroneRelated ? "搜索无人机..." : "搜索车辆..."} className="w-full h-10 pl-10 pr-4 bg-slate-50/50 border border-slate-100 rounded-lg text-[12px] font-normal focus:ring-2 focus:ring-[#9a6bff]/20 focus:border-[#9a6bff] outline-none transition-all placeholder:text-slate-500" />
                  <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`w-10 h-10 flex items-center justify-center border rounded-lg transition-all active:scale-95 shadow-sm ${isFilterOpen ? 'bg-[#9a6bff] border-[#9a6bff] text-white' : 'bg-white border-slate-100 text-slate-600 hover:text-[#9a6bff]'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg></button>
              </div>
              <div className="flex space-x-2.5 pb-1">
                <button onClick={() => handleSortClick('status')} className={`flex-1 h-9 flex items-center justify-between px-3 border rounded-lg transition-all group ${sortField === 'status' ? 'bg-[#9a6bff]/5 border-[#9a6bff]/30' : 'bg-white border-slate-100 hover:border-[#9a6bff]/40 hover:bg-slate-50/50'}`}><div className="flex items-center space-x-2"><svg className={`w-3.5 h-3.5 transition-colors ${sortField === 'status' ? 'text-[#9a6bff]' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" strokeWidth="2"/></svg><span className={`text-[12px] font-normal transition-colors ${sortField === 'status' ? 'text-[#9a6bff]' : 'text-slate-700 group-hover:text-slate-900'}`}>按状态</span></div><div className={`transition-all duration-300 ${sortField === 'status' && sortOrder === 'desc' ? 'rotate-180' : ''}`}><svg className={`w-3 h-3 ${sortField === 'status' ? 'text-[#9a6bff]' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2.5" /></svg></div></button>
                <button onClick={() => handleSortClick('name')} className={`flex-1 h-9 flex items-center justify-between px-3 border rounded-lg transition-all group ${sortField === 'name' ? 'bg-[#9a6bff]/5 border-[#9a6bff]/30' : 'bg-white border-slate-100 hover:border-[#9a6bff]/40 hover:bg-slate-50/50'}`}><div className="flex items-center space-x-2"><svg className={`w-3.5 h-3.5 transition-colors ${sortField === 'name' ? 'text-[#9a6bff]' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" strokeWidth="2"/></svg><span className={`text-[12px] font-normal transition-colors ${sortField === 'name' ? 'text-[#9a6bff]' : 'text-slate-700 group-hover:text-slate-900'}`}>按姓名</span></div><div className={`transition-all duration-300 ${sortField === 'name' && sortOrder === 'desc' ? 'rotate-180' : ''}`}><svg className={`w-3 h-3 ${sortField === 'name' ? 'text-[#9a6bff]' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2.5" /></svg></div></button>
              </div>
            </div>
          )}
          {renderItemList(dataToRender)}
        </div>
      </div>
      <div className="w-16 h-full border-l border-slate-100 bg-white flex flex-col items-center py-6 shrink-0 relative z-20 overflow-visible">
        <div className="flex flex-col items-center space-y-4 pb-10">
          <SidebarButton active={activeSubTab === 'personnel'} onClick={() => handleTabClick('personnel')} label="人员" icon={<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />} />
          <SidebarButton active={activeSubTab === 'vehicle'} onClick={() => handleTabClick('vehicle')} label="车辆" icon={<path d={VEHICLE_SOLID_PATH} fill="currentColor" />} />
          <SidebarButton active={activeSubTab === 'drone'} onClick={() => handleTabClick('drone')} label="无人机" icon={<path d={DRONE_PATH} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />} />
          <SidebarButton active={activeSubTab === 'hazard'} isFlashing={unreadTabs.has('hazard') && activeSubTab !== 'hazard'} onClick={() => handleTabClick('hazard')} label="隐患" icon={<path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z" />} />
          <SidebarButton active={activeSubTab === 'alarm'} isFlashing={unreadTabs.has('alarm') && activeSubTab !== 'alarm'} onClick={() => handleTabClick('alarm')} label="报警" icon={<path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />} />
          <SidebarButton active={activeSubTab === 'site'} isFlashing={unreadTabs.has('site') && activeSubTab !== 'site'} onClick={() => handleTabClick('site')} label="工地" icon={<path d={SITE_ICON_PATH} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />} />
          <SidebarButton active={activeSubTab === 'droneLeak'} isFlashing={unreadTabs.has('droneLeak') && activeSubTab !== 'droneLeak'} onClick={() => handleTabClick('droneLeak')} label="无人机漏点" icon={<g><path d={DRONE_PATH} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/><circle cx="12" cy="12" r="2" fill="currentColor" className="opacity-40" /></g>} />
          <SidebarButton active={activeSubTab === 'vehicleLeak'} isFlashing={unreadTabs.has('vehicleLeak') && activeSubTab !== 'vehicleLeak'} onClick={() => handleTabClick('vehicleLeak')} label="测漏车漏点" icon={<g><path d={TRUCK_SOLID_PATH} fill="currentColor" opacity="0.6" /><circle cx="12" cy="14" r="1.5" fill="white" className="opacity-90" /></g>} />
        </div>
        <div className="mt-auto space-y-3 pb-2 shrink-0"><div className="w-1 h-1 rounded-full bg-slate-400 mx-auto"></div><div className="w-1 h-1 rounded-full bg-slate-400 mx-auto"></div></div>
      </div>
    </div>
  );
};

const SidebarButton: React.FC<{ active: boolean; isFlashing?: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, isFlashing, onClick, icon, label }) => (
  <div className="relative group/btn"><button onClick={(e) => { e.stopPropagation(); onClick(); }} className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-300 relative z-10 ${active ? 'text-[#9a6bff] scale-110' : isFlashing ? 'animate-alert-flash text-slate-500' : 'text-slate-500 hover:text-[#9a6bff]'}`}><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">{icon}</svg>{isFlashing && !active && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white"></span>}</button><div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover/btn:opacity-100 transition-all duration-200 translate-x-2 group-hover/btn:translate-x-0 z-[9999] pointer-events-none"><div className="tooltip-bubble relative shadow-2xl">{label}<div className="absolute top-1/2 -translate-y-1/2 -right-[4px] w-2 h-2 bg-[#080b1a] rotate-45"></div></div></div></div>
);
