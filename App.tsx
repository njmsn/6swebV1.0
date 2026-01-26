
import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { MapArea } from './components/realTime/MapArea.tsx';
import { InspectionPanel } from './components/realTime/InspectionPanel.tsx';
import { SiteManagementContent } from './components/dataMain/SiteManagementContent.tsx';
import { NavigationTab } from './types.ts';

// 全局大图预览组件
const ImagePreviewer: React.FC<{ 
  urls: string[]; 
  initialIndex: number; 
  onClose: () => void 
}> = ({ urls, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : urls.length - 1));
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % urls.length);
  };

  useEffect(() => {
    const activeThumb = scrollContainerRef.current?.children[currentIndex] as HTMLElement;
    if (activeThumb && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = activeThumb.offsetLeft - container.offsetWidth / 2 + activeThumb.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [currentIndex]);

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div className="absolute top-0 inset-x-0 h-16 flex items-center justify-between px-8 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-50">
        <span className="text-white font-mono text-[15px] font-bold pointer-events-auto">
          {currentIndex + 1} / {urls.length}
        </span>
        <button 
          className="text-white/60 hover:text-white transition-all p-2 pointer-events-auto hover:bg-white/10 rounded-full"
          onClick={onClose}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <button 
        onClick={showPrev}
        className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all group active:scale-90 z-[60]"
      >
        <svg className="w-10 h-10 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
      </button>

      <button 
        onClick={showNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all group active:scale-90 z-[60]"
      >
        <svg className="w-10 h-10 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
      </button>

      <div className="flex-1 w-full flex items-center justify-center p-4 relative z-40" onClick={(e) => e.stopPropagation()}>
        <img 
          key={currentIndex} 
          src={urls[currentIndex]} 
          className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-[0_40px_120px_rgba(0,0,0,0.8)] select-none animate-in zoom-in-95 duration-500" 
          alt="预览大图" 
        />
      </div>

      <div className="w-full max-w-[1200px] h-24 mb-10 px-10 flex items-center justify-center pointer-events-none z-50">
        <div 
          ref={scrollContainerRef}
          className="flex space-x-3 overflow-x-auto custom-scrollbar p-2 pointer-events-auto snap-x"
          onClick={(e) => e.stopPropagation()}
        >
          {urls.map((url, idx) => (
            <div 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-all snap-center border-2 ${
                currentIndex === idx 
                ? 'border-primary scale-110 shadow-lg shadow-primary/20 ring-4 ring-primary/10' 
                : 'border-transparent opacity-40 hover:opacity-100 hover:border-white/50'
              }`}
            >
              <img src={url} className="w-full h-full object-cover" alt={`缩略图 ${idx + 1}`} />
              {currentIndex === idx && <div className="absolute inset-0 bg-primary/10"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TAB_METADATA: Record<string, { label: string; icon: React.ReactNode }> = {
  [NavigationTab.RealTime]: {
    label: '实时监控中心',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
      </svg>
    )
  },
  [NavigationTab.TerminalStatus]: {
    label: '终端在线状态',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
      </svg>
    )
  },
  [NavigationTab.TrajectoryAnalysis]: {
    label: '人员轨迹分析',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
      </svg>
    )
  },
  [NavigationTab.SiteManagement]: {
    label: '工地管理',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5"/>
      </svg>
    )
  },
  [NavigationTab.SiteReports]: {
    label: '工地数据报表',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    )
  }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.RealTime);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<any>(null);
  const [allTasksViewData, setAllTasksViewData] = useState<any>(null);
  const [selectedSiteDetail, setSelectedSiteDetail] = useState<any>(null);
  const [playbackState, setPlaybackState] = useState<{ isOpen: boolean; trajectoryId?: string } | null>(null);
  
  // 全局预览状态
  const [globalPreview, setGlobalPreview] = useState<{ urls: string[], index: number } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const [openTabs, setOpenTabs] = useState([
    { 
      id: NavigationTab.RealTime, 
      label: TAB_METADATA[NavigationTab.RealTime].label, 
      icon: TAB_METADATA[NavigationTab.RealTime].icon 
    }
  ]);

  const getLabel = (tabId: NavigationTab) => {
    return openTabs.find(t => t.id === tabId)?.label || '工作台';
  };

  const handleCloseTab = (tabId: NavigationTab, e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (openTabs.length <= 1) return;
    const closedIndex = openTabs.findIndex(tab => tab.id === tabId);
    const newTabs = openTabs.filter(tab => tab.id !== tabId);
    setOpenTabs(newTabs);
    if (activeTab === tabId) {
      const nextActiveTab = newTabs[closedIndex - 1] || newTabs[0];
      if (nextActiveTab) setActiveTab(nextActiveTab.id);
    }
  };

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
      {/* 预览大图模态层 - 置于最顶层 */}
      {globalPreview && (
        <ImagePreviewer 
          urls={globalPreview.urls} 
          initialIndex={globalPreview.index} 
          onClose={() => setGlobalPreview(null)} 
        />
      )}

      {!isFullscreen && (
        <Sidebar activeTab={activeTab} onTabChange={(tabId) => {
          const isAlreadyOpen = openTabs.some(t => t.id === tabId);
          if (!isAlreadyOpen) {
            const metadata = TAB_METADATA[tabId] || { 
              label: '新模块', 
              icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /></svg> 
            };
            setOpenTabs([...openTabs, { id: tabId, ...metadata }]);
          }
          setActiveTab(tabId);
        }} />
      )}

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 gap-1 overflow-hidden ${isFullscreen ? 'p-0' : 'py-1 pr-2.5 pl-2.5'}`}>
        {!isFullscreen && <Header />}

        <div className={`flex-1 flex flex-col bg-white border border-slate-200/50 overflow-hidden relative transition-all duration-300 ${isFullscreen ? 'rounded-none border-none' : 'rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]'}`}>
          {!isFullscreen && (
            <div className="h-12 border-b border-slate-100 flex items-center justify-between px-4 bg-[#fcfdfe] shrink-0">
              <div className="flex items-center h-full">
                <div className="flex items-center h-full pt-2">
                  {openTabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <div 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`group flex items-center h-full px-4 rounded-t-xl transition-all cursor-pointer border-t border-x relative -mb-[1px] ${
                          isActive 
                          ? 'bg-white border-slate-100 text-primary z-10 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.03)]' 
                          : 'bg-transparent border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <span className={`mr-2.5 transition-colors ${isActive ? 'text-primary' : 'text-slate-300'}`}>
                          {tab.icon}
                        </span>
                        <span className={`text-[12.5px] whitespace-nowrap transition-colors ${isActive ? 'font-black' : 'font-bold'}`}>
                          {tab.label}
                        </span>
                        <button 
                          onClick={(e) => handleCloseTab(tab.id, e)}
                          className={`ml-2.5 w-4.5 h-4.5 flex items-center justify-center rounded-full hover:bg-slate-100 transition-all duration-200 ${
                            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <svg className={`w-3 h-3 ${isActive ? 'text-primary/40 hover:text-rose-500' : 'text-slate-300 hover:text-rose-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center pr-2 relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsTabDropdownOpen(!isTabDropdownOpen)}
                  className={`p-1.5 rounded-lg transition-all ${
                    isTabDropdownOpen 
                    ? 'text-primary bg-primary/5' 
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
                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">视图管理</span>
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
                        ? 'bg-primary/5 text-primary' 
                        : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`mr-2.5 ${activeTab === tab.id ? 'text-primary' : 'text-slate-300'}`}>
                        {tab.icon}
                      </span>
                      <span className="text-[12px] font-bold flex-1">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 relative bg-white">
              {activeTab === NavigationTab.RealTime ? (
                <MapArea 
                  selectedTaskDetail={selectedTaskDetail} 
                  onTaskClose={() => setSelectedTaskDetail(null)} 
                  allTasksViewData={allTasksViewData}
                  onAllTasksClose={() => setAllTasksViewData(null)}
                  selectedSiteDetail={selectedSiteDetail}
                  onSiteClose={() => setSelectedSiteDetail(null)}
                  playbackState={playbackState}
                  onPlaybackClose={() => setPlaybackState(null)}
                  onPreviewImage={(urls, idx) => setGlobalPreview({ urls, index: idx })}
                />
              ) : activeTab === NavigationTab.SiteManagement ? (
                <SiteManagementContent />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/40">
                  <div className="p-10 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center max-w-sm text-center">
                    <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-6 text-primary/40">
                      {TAB_METADATA[activeTab]?.icon || <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /></svg>}
                    </div>
                    <h3 className="text-slate-800 font-black text-lg mb-2 tracking-tight">{getLabel(activeTab)}</h3>
                    <p className="text-[12px] text-slate-400 leading-relaxed font-medium">模块数据正由运维中心同步至云端，请稍后刷新查看。</p>
                  </div>
                </div>
              )}
            </main>

            {activeTab === NavigationTab.RealTime && (
              <aside 
                className={`transition-all duration-500 ease-in-out border-l border-slate-50 bg-white flex flex-col relative z-[50] overflow-visible ${
                  isPanelOpen 
                    ? 'w-[400px] shadow-[-25px_0_50px_-20px_rgba(0,0,0,0.1)]' 
                    : 'w-16 shadow-none'
                }`}
              >
                <InspectionPanel 
                  isOpen={isPanelOpen} 
                  onToggle={() => setIsPanelOpen(!isPanelOpen)} 
                  onTaskClick={(task) => setSelectedTaskDetail(task)} 
                  onViewAllTasks={(data) => setAllTasksViewData(data)}
                  onSiteClick={(site) => setSelectedSiteDetail(site)}
                  onPlaybackToggle={(isOpen, trajId) => setPlaybackState(isOpen ? { isOpen, trajectoryId: trajId } : null)}
                  onPreviewImage={(urls, idx) => setGlobalPreview({ urls, index: idx })}
                />
              </aside>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
