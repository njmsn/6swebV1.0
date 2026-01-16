
import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { MapArea } from './components/MapArea.tsx';
import { InspectionPanel } from './components/InspectionPanel.tsx';
import { SiteManagementContent } from './components/SiteManagementContent.tsx';
import { NavigationTab } from './types.ts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.RealTime);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 初始页签仅保留实时监控中心
  const [openTabs, setOpenTabs] = useState([
    { id: NavigationTab.RealTime, label: '实时监控中心', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )}
  ]);

  const getLabel = (tabId: NavigationTab) => {
    return openTabs.find(t => t.id === tabId)?.label || '工作台';
  };

  // 关闭页签处理逻辑
  const handleCloseTab = (tabId: NavigationTab, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止冒泡，防止触发页签切换
    
    // 如果只有一个页签，通常不允许全部关闭
    if (openTabs.length <= 1) return;

    const newTabs = openTabs.filter(tab => tab.id !== tabId);
    setOpenTabs(newTabs);

    // 如果关闭的是当前选中的页签，则需要激活另一个页签
    if (activeTab === tabId) {
      const closedIndex = openTabs.findIndex(tab => tab.id === tabId);
      const nextActiveTab = newTabs[closedIndex - 1] || newTabs[0];
      if (nextActiveTab) {
        setActiveTab(nextActiveTab.id);
      }
    }
  };

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTabDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-[#f1f3f6] overflow-hidden font-sans">
      {/* 侧边栏 - 全屏时隐藏 */}
      {!isFullscreen && (
        <Sidebar activeTab={activeTab} onTabChange={(tabId) => {
          // 查找是否已在打开的页签中
          const isAlreadyOpen = openTabs.some(t => t.id === tabId);
          if (!isAlreadyOpen) {
            const labels: Record<string, string> = {
              [NavigationTab.RealTime]: '实时监控中心',
              [NavigationTab.TerminalStatus]: '手持终端状态',
              [NavigationTab.TrajectoryAnalysis]: '人员轨迹分析',
              [NavigationTab.SiteManagement]: '工地管理',
              [NavigationTab.SiteReports]: '工地查询报表',
            };
            setOpenTabs([...openTabs, { id: tabId, label: labels[tabId] || '新模块', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /></svg> }]);
          }
          setActiveTab(tabId);
        }} />
      )}

      {/* 右侧主容器 */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 gap-2.5 overflow-hidden ${isFullscreen ? 'p-0' : 'py-2.5 pr-2.5 pl-2.5'}`}>
        {/* 顶部栏 - 全屏时隐藏 */}
        {!isFullscreen && <Header />}

        {/* 核心内容容器 */}
        <div className={`flex-1 flex flex-col bg-white border border-slate-200/50 overflow-hidden relative transition-all duration-300 ${isFullscreen ? 'rounded-none border-none' : 'rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]'}`}>
          
          {/* 标签切换栏 - 全屏时隐藏 */}
          {!isFullscreen && (
            <div className="h-12 border-b border-slate-100 flex items-center justify-between px-4 bg-[#fcfdfe] shrink-0">
              <div className="flex items-center h-full">
                <div className="flex items-center h-full pt-2">
                  {openTabs.map((tab) => (
                    <div 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group flex items-center h-full px-4 rounded-t-xl transition-all cursor-pointer border-t border-x relative -mb-[1px] ${
                        activeTab === tab.id 
                        ? 'bg-white border-slate-100 text-[#9a6bff] z-10 shadow-[0_-2px_10px_-4px_rgba(0,0,0,0.05)]' 
                        : 'bg-transparent border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <span className={`mr-2 transition-colors ${activeTab === tab.id ? 'text-[#9a6bff]' : 'text-slate-300'}`}>
                        {tab.icon}
                      </span>
                      <span className="text-[10px] font-bold whitespace-nowrap">{tab.label}</span>
                      <button 
                        onClick={(e) => handleCloseTab(tab.id, e)}
                        className={`ml-3 p-0.5 hover:bg-slate-100 rounded-full transition-opacity ${activeTab === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`}
                      >
                        <svg className="w-3 h-3 text-slate-300 hover:text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center pr-2 relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsTabDropdownOpen(!isTabDropdownOpen)}
                  className={`p-1.5 rounded-lg transition-all ${
                    isTabDropdownOpen 
                    ? 'text-[#9a6bff] bg-[#9a6bff]/5' 
                    : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <svg className={`w-4 h-4 transition-transform duration-300 ${isTabDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className={`absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.15)] border border-slate-100 py-1.5 z-50 transition-all duration-200 origin-top-right ${
                  isTabDropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                }`}>
                  <div className="px-3 py-1 mb-1 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">已打开的页签</span>
                  </div>
                  {openTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsTabDropdownOpen(false);
                      }}
                      className={`w-full flex items-center px-3 py-2 text-left transition-colors group ${
                        activeTab === tab.id 
                        ? 'bg-[#9a6bff]/5 text-[#9a6bff]' 
                        : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`mr-2.5 ${activeTab === tab.id ? 'text-[#9a6bff]' : 'text-slate-300'}`}>
                        {tab.icon}
                      </span>
                      <span className="text-[10px] font-bold flex-1">{tab.label}</span>
                      <div className="flex items-center">
                        {activeTab === tab.id && (
                          <div className="w-1 h-1 bg-[#9a6bff] rounded-full mr-2"></div>
                        )}
                        <div 
                          onClick={(e) => handleCloseTab(tab.id, e)}
                          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded transition-all"
                        >
                          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 内容区 */}
          <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 relative bg-white">
              {activeTab === NavigationTab.RealTime ? (
                <MapArea />
              ) : activeTab === NavigationTab.SiteManagement ? (
                <SiteManagementContent />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/40">
                  <div className="p-10 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center max-w-sm text-center">
                    <div className="w-20 h-20 bg-[#9a6bff]/5 rounded-3xl flex items-center justify-center mb-6 text-[#9a6bff]/40">
                      {openTabs.find(t => t.id === activeTab)?.icon}
                    </div>
                    <h3 className="text-slate-800 font-black text-lg mb-2 tracking-tight">{getLabel(activeTab)}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">模块数据正由运维中心同步至云端，请稍后刷新查看。</p>
                  </div>
                </div>
              )}
            </main>

            {activeTab === NavigationTab.RealTime && (
              <aside 
                className={`transition-all duration-500 ease-in-out border-l border-slate-50 bg-white flex flex-col relative z-20 ${
                  isPanelOpen 
                    ? 'w-[400px] shadow-[-25px_0_50px_-20px_rgba(0,0,0,0.1)]' 
                    : 'w-16 shadow-none'
                }`}
              >
                <InspectionPanel isOpen={isPanelOpen} onToggle={() => setIsPanelOpen(!isPanelOpen)} />
              </aside>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
