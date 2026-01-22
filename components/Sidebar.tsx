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
          label: '实时监控中心', 
          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg> 
        },
        { 
          id: NavigationTab.TerminalStatus, 
          label: '终端在线状态', 
          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg> 
        },
        { 
          id: NavigationTab.TrajectoryAnalysis, 
          label: '人员轨迹分析', 
          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg> 
        }
      ]
    },
    {
      id: NavigationTab.SiteManagement,
      label: '工地管理',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5" />
        </svg>
      ),
      subItems: [
        { 
          id: NavigationTab.SiteManagement, 
          label: '全区工地概况', 
          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5"/></svg> 
        },
        { 
          id: NavigationTab.SiteReports, 
          label: '工地数据报表', 
          icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> 
        }
      ]
    }
  ];

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
  
  // 重绘后的 Logo SVG：包含弧形旋涡背景与斜体 MDS 文字
  const logoUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 256'%3E%3Cdefs%3E%3ClinearGradient id='logoGrad' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%2360a5fa;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%232563eb;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='none' stroke='url(%23logoGrad)' stroke-width='18' stroke-linecap='round'%3E%3Cpath d='M120 50 A85 85 0 1 0 120 206' opacity='0.3' /%3E%3Cpath d='M110 80 A55 55 0 1 0 110 176' opacity='0.6' /%3E%3Cpath d='M100 110 A25 25 0 1 0 100 146' /%3E%3C/g%3E%3Ctext x='160' y='175' font-family='Arial Black, system-ui, sans-serif' font-weight='900' font-size='160' fill='url(%23logoGrad)' font-style='italic' letter-spacing='-8'%3EMDS%3C/text%3E%3C/svg%3E";

  return (
    <div 
      className="relative z-[1000] flex h-full"
      onMouseLeave={() => setHoveredItem(null)}
    >
      <aside 
        style={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}
        className="w-20 flex flex-col h-full rounded-none border-r shadow-2xl items-center py-6 shrink-0 relative z-[1001] transition-colors duration-300"
      >
        <div className="mb-10 px-1 cursor-pointer transition-all hover:scale-105 active:scale-95 group">
          <div className="w-16 h-10 flex items-center justify-center overflow-visible" style={{ filter: 'var(--logo-filter)' }}>
            <img 
              src={logoUrl} 
              alt="MDS Logo" 
              className="w-full h-full object-contain" 
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
                  style={{ backgroundColor: isActive ? (isFavIcon ? '#fbbf24' : 'var(--primary-color)') : 'transparent' }}
                  className={`relative z-50 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? `text-white ${isFavIcon ? 'shadow-[0_8px_20px_-4px_rgba(251,191,36,0.4)]' : 'shadow-[0_8px_20px_-4px_rgba(var(--primary-color),0.4)]'}` 
                      : `hover:bg-[var(--sidebar-item-hover)] ${isFavIcon ? 'text-slate-500 hover:text-[#fbbf24]' : 'text-[var(--sidebar-text)] hover:text-primary'}`
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

      <div 
        style={{ backgroundColor: 'var(--submenu-bg)', borderColor: 'var(--sidebar-border)' }}
        className={`absolute left-20 top-0 h-full border-r shadow-[25px_0_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-300 origin-left backdrop-blur-3xl overflow-hidden z-[999] ${
          currentHoveredNav
            ? 'w-[460px] opacity-100 translate-x-0' 
            : 'w-0 opacity-0 -translate-x-4 pointer-events-none'
        }`}
      >
        <div className="w-[460px] h-full py-8 flex flex-col">
          <div className="px-6 mb-10 mt-2">
            <h4 style={{ color: 'var(--submenu-title)' }} className="text-[16px] font-black tracking-wider mb-2">
              {currentHoveredNav?.label || '模块详情'}
            </h4>
            <div 
              style={{ backgroundColor: currentHoveredNav?.id === NavigationTab.Favorites ? '#fbbf24' : 'var(--primary-color)' }}
              className="w-10 h-1.5 rounded-full"
            ></div>
          </div>

          <nav className="flex-1 px-4 grid grid-cols-2 gap-3 content-start">
            {currentHoveredNav?.subItems && currentHoveredNav.subItems.length > 0 ? (
              currentHoveredNav.subItems.map((sub) => {
                const isFav = favorites.has(sub.id);
                const isActive = activeTab === sub.id;
                return (
                  <div
                    key={sub.id}
                    onClick={() => onTabChange(sub.id)}
                    style={{ 
                      backgroundColor: isActive ? 'var(--submenu-item-active)' : 'transparent',
                      borderColor: isActive ? 'var(--sidebar-border)' : 'transparent'
                    }}
                    className={`flex flex-row items-center px-3 py-4 rounded-xl transition-all group/sub cursor-pointer relative border ${
                      isActive 
                      ? 'shadow-xl' 
                      : 'text-[var(--submenu-text)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--submenu-title)]'
                    }`}
                  >
                    <div 
                      style={{ 
                        backgroundColor: isActive ? 'var(--primary-color)' : 'var(--sidebar-item-hover)',
                        color: isActive ? 'white' : 'var(--sidebar-text)'
                      }}
                      className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center mr-3 transition-all ${
                        isActive ? 'shadow-[0_5px_15px_rgba(var(--primary-color),0.3)]' : 'group-hover/sub:bg-[var(--submenu-item-active)]'
                      }`}
                    >
                      {sub.icon}
                    </div>

                    <div className="flex items-center flex-1 min-w-0 pr-1">
                      <span 
                        style={{ color: isActive ? 'var(--submenu-title)' : 'inherit' }}
                        className="text-[14px] font-black tracking-tight whitespace-nowrap"
                      >
                        {sub.label}
                      </span>
                    </div>

                    {isFav && (
                      <div className="absolute top-1 right-1 text-[#fbbf24] animate-in zoom-in-50 duration-300">
                        <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                      </div>
                    )}

                    {!isFav && (
                      <button 
                        onClick={(e) => toggleFavorite(e, sub.id)}
                        className="absolute top-1 right-1 p-1 rounded-lg transition-all text-slate-400 opacity-0 group-hover/sub:opacity-100 hover:text-[#fbbf24] hover:bg-[var(--sidebar-item-hover)]"
                      >
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 py-20 flex flex-col items-center justify-center opacity-30" style={{ color: 'var(--sidebar-text)' }}>
                <svg className="w-16 h-16 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
                <span className="text-[13px] font-bold tracking-[0.2em]">暂无收藏内容</span>
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};