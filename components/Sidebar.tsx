
import React, { useState, useMemo } from 'react';
import { NavigationTab } from '../types.ts';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

interface SubItem {
  id: NavigationTab;
  label: string;
  icon: React.ReactNode;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ReactNode;
  subItems?: SubItem[];
  isFixed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const [hoveredItem, setHoveredItem] = useState<NavigationTab | null>(null);
  const [favorites, setFavorites] = useState<Set<NavigationTab>>(new Set([NavigationTab.RealTime]));

  // 定义所有可用的功能模块
  const allModules: NavItem[] = [
    { 
      id: NavigationTab.RealTime, 
      label: '监控中心', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      subItems: [
        { 
          id: NavigationTab.RealTime, 
          label: '实时监控', 
          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg> 
        },
        { 
          id: NavigationTab.TerminalStatus, 
          label: '终端状态', 
          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg> 
        },
        { 
          id: NavigationTab.TrajectoryAnalysis, 
          label: '轨迹分析', 
          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg> 
        }
      ]
    },
    {
      id: NavigationTab.SiteManagement,
      label: '工地管理',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 20h10M12 16v4" />
        </svg>
      ),
      subItems: [
        { 
          id: NavigationTab.SiteManagement, 
          label: '工地管理', 
          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg> 
        },
        { 
          id: NavigationTab.SiteReports, 
          label: '查询报表', 
          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> 
        }
      ]
    }
  ];

  // 计算已收藏的子项
  const favoritedSubItems = useMemo(() => {
    const result: SubItem[] = [];
    allModules.forEach(mod => {
      mod.subItems?.forEach(sub => {
        if (favorites.has(sub.id)) {
          result.push(sub);
        }
      });
    });
    return result;
  }, [favorites, allModules]);

  // 包含“我的收藏”的完整导航列表
  const navItems: NavItem[] = [
    {
      id: NavigationTab.Favorites,
      label: '我的收藏',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      ),
      subItems: favoritedSubItems
    },
    ...allModules
  ];

  const isParentActive = (item: NavItem) => {
    if (activeTab === item.id) return true;
    return item.subItems?.some(sub => sub.id === activeTab);
  };

  const toggleFavorite = (e: React.MouseEvent, tabId: NavigationTab) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(tabId)) next.delete(tabId);
      else next.add(tabId);
      return next;
    });
  };

  const currentHoveredNav = navItems.find(n => n.id === hoveredItem);

  const logoUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 256'%3E%3Cpath fill='white' d='M110 40c-35 0-66 14-88 37 18-11 39-17 61-17 66 0 120 54 120 120s-54 120-120 120c-22 0-43-6-61-17 22 23 53 37 88 37 66 0 120-54 120-120S176 40 110 40z'/%3E%3Cpath fill='white' d='M30.4 156.6c0-67.8 55-122.8 122.8-122.8 34.3 0 65.4 14 87.9 36.7-17.7-11-38.7-17.4-61.2-17.4-66.2 0-121.2 55-121.2 122.8 0 20.2 4.8 39.2 13.4 56L30.4 211.5c-15.6-20.7-24.8-46.4-24.8-74.2z'/%3E%3Ctext x='160' y='165' font-family='Arial, sans-serif' font-weight='900' font-size='120' fill='white'%3EMDS%3C/text%3E%3C/svg%3E";

  return (
    <div 
      className="relative z-50 flex h-full"
      onMouseLeave={() => setHoveredItem(null)}
    >
      <aside className="w-20 bg-[#080b1a] flex flex-col h-full rounded-none border-r border-white/5 shadow-2xl items-center py-8 shrink-0 relative z-50">
        <div className="mb-10 px-2 cursor-pointer transition-all hover:scale-110 active:scale-95 group">
          <div className="w-16 h-12 flex items-center justify-center">
            <img 
              src={logoUrl} 
              alt="MDS Logo" 
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]" 
            />
          </div>
        </div>

        <nav className="flex-1 w-full px-3 space-y-6 flex flex-col items-center">
          {navItems.map((item) => {
            const isActive = isParentActive(item);
            const isFavIcon = item.id === NavigationTab.Favorites;
            return (
              <div 
                key={item.id}
                onMouseEnter={() => setHoveredItem(item.id)}
                className="relative w-full flex justify-center group"
              >
                <button
                  className={`relative z-50 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? `text-white ${isFavIcon ? 'bg-[#fbbf24] shadow-[0_8px_20px_-4px_rgba(251,191,36,0.4)]' : 'bg-[#7c4dff] shadow-[0_8px_20px_-4px_rgba(124,77,255,0.4)]'}` 
                      : `text-slate-500 hover:bg-white/5 ${isFavIcon ? 'hover:text-[#fbbf24]' : 'hover:text-[#c4b5fd]'}`
                  }`}
                >
                  {item.icon}
                </button>

                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-1 group-hover:translate-x-0 z-[60]">
                  <div className="tooltip-bubble tooltip-arrow-left">
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* 二级菜单抽屉 - 加宽至 w-96 */}
      <div 
        className={`absolute left-20 top-0 h-full bg-[#121629] border-r border-white/5 shadow-[20px_0_50px_-20px_rgba(0,0,0,0.5)] transition-all duration-300 origin-left backdrop-blur-3xl overflow-hidden z-40 ${
          currentHoveredNav
            ? 'w-96 opacity-100 translate-x-0' 
            : 'w-0 opacity-0 -translate-x-4 pointer-events-none'
        }`}
      >
        <div className="w-96 h-full py-8 flex flex-col">
          <div className="px-6 mb-8 mt-2">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
              {currentHoveredNav?.label || '模块详情'}
            </h4>
            <div className={`w-6 h-1 rounded-full ${currentHoveredNav?.id === NavigationTab.Favorites ? 'bg-[#fbbf24]' : 'bg-[#7c4dff]'}`}></div>
          </div>

          {/* 二级子项列表 - 优化为水平居中对齐 */}
          <nav className="flex-1 px-4 grid grid-cols-2 gap-2.5 content-start">
            {currentHoveredNav?.subItems && currentHoveredNav.subItems.length > 0 ? (
              currentHoveredNav.subItems.map((sub) => {
                const isFav = favorites.has(sub.id);
                return (
                  <div
                    key={sub.id}
                    onClick={() => onTabChange(sub.id)}
                    className={`flex flex-row items-center justify-center px-2 py-3.5 rounded-xl transition-all group/sub cursor-pointer relative ${
                      activeTab === sub.id 
                      ? 'bg-white/10 text-white shadow-lg' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {/* 功能图标 */}
                    <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center mr-2 transition-colors ${
                      activeTab === sub.id ? 'bg-[#7c4dff] text-white' : 'bg-white/5 group-hover/sub:bg-white/10'
                    }`}>
                      {sub.icon}
                    </div>

                    {/* 文字标签 - 取消截断，确保显示完整 */}
                    <span className="text-[11px] font-bold tracking-tight mr-1">
                      {sub.label}
                    </span>

                    {/* 收藏按钮 - 紧跟在文字右侧，保持水平对齐 */}
                    <button 
                      onClick={(e) => toggleFavorite(e, sub.id)}
                      className={`p-1 rounded-md transition-all shrink-0 hover:bg-white/10 ${isFav ? 'text-[#fbbf24] opacity-100' : 'text-white/20 opacity-0 group-hover/sub:opacity-100'}`}
                    >
                      <svg className="w-3 h-3" fill={isFav ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" strokeWidth="2" />
                      </svg>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 py-10 flex flex-col items-center justify-center text-slate-600">
                <svg className="w-10 h-10 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
                <span className="text-[10px] font-bold tracking-widest opacity-40">暂无收藏内容</span>
              </div>
            )}
          </nav>

          <div className="px-6 mt-auto opacity-10 flex justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
