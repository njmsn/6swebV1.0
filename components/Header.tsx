import React, { useState, useRef, useEffect } from 'react';

export const Header: React.FC = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeNotifTab, setActiveNotifTab] = useState<'通知' | '提醒'>('通知');
  const userMenuRef = useRef<HTMLDivElement>(null);

  // 主题色配置选项 - 包含紫色、蓝色和红色
  const themes = [
    { id: 'default', color: '#9a6bff', hover: '#8558eb', isLightSidebar: false, label: '暗夜紫' },
    { id: 'blue', color: '#008fff', hover: '#007adb', isLightSidebar: true, label: '企业蓝' },
    { id: 'pink', color: '#f01260', hover: '#d11054', isLightSidebar: true, label: '焕新红' },
  ];

  const handleThemeChange = (theme: typeof themes[0]) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.color);
    root.style.setProperty('--primary-hover', theme.hover);

    if (theme.isLightSidebar) {
      // 浅色主题设置
      const lightBg = `${theme.color}1a`; // 主题色 10% 透明度作为主侧边栏背景
      root.style.setProperty('--sidebar-bg', lightBg);
      
      // 关键修改：二级菜单背景色设为纯白色
      root.style.setProperty('--submenu-bg', '#ffffff');
      
      // 浅色模式细节微调
      root.style.setProperty('--sidebar-border', 'rgba(0, 0, 0, 0.06)');
      root.style.setProperty('--sidebar-item-hover', 'rgba(0, 0, 0, 0.04)');
      root.style.setProperty('--sidebar-text', '#64748b');
      root.style.setProperty('--submenu-item-active', 'rgba(0, 0, 0, 0.03)');
      root.style.setProperty('--submenu-text', '#475569');
      root.style.setProperty('--submenu-title', '#1e293b');
      root.style.setProperty('--logo-filter', 'none');
    } else {
      // 深色侧边栏设置 (恢复默认紫色主题对应的深色背景)
      root.style.setProperty('--sidebar-bg', '#080b1a');
      root.style.setProperty('--submenu-bg', '#121629');
      root.style.setProperty('--sidebar-border', 'rgba(255, 255, 255, 0.05)');
      root.style.setProperty('--sidebar-item-hover', 'rgba(255, 255, 255, 0.05)');
      root.style.setProperty('--sidebar-text', '#64748b');
      root.style.setProperty('--submenu-item-active', '#1e253c');
      root.style.setProperty('--submenu-text', '#94a3b8');
      root.style.setProperty('--submenu-title', '#cbd5e1');
      root.style.setProperty('--logo-filter', 'drop-shadow(0 0 8px rgba(255,255,255,0.15))');
    }
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: '设备维护通知', content: '城北运维中心2号泵站将于明日进行例行检查。', time: '10分钟前' },
    { id: 2, title: '任务分配', content: '您有一条新的安检任务待处理。', time: '1小时前' },
  ];

  const reminders = [
    { id: 1, title: '待办确认', content: '确认滨海新区泰达大街管网测绘报告。', time: '今天' },
    { id: 2, title: '过期提醒', content: '5号车辆保险即将到期，请及时续费。', time: '昨天' },
  ];

  return (
    <header className="h-16 bg-white border border-slate-100 rounded-xl px-8 flex items-center justify-between shadow-sm shrink-0 relative z-[100]">
      {/* 左侧：系统名称 */}
      <div className="flex items-center">
        <h1 className="text-[17px] font-bold text-[#334155] tracking-tight">
          智慧能源综合监管平台
        </h1>
      </div>

      {/* 右侧：功能组件 */}
      <div className="flex items-center space-x-4">
        {/* 天气信息 */}
        <div className="flex items-center space-x-3.5 px-4 py-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
          <svg className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-slate-700 leading-none">26℃</span>
            <span className="text-[12px] text-slate-400 font-medium mt-1">晴天 / 滨海新区</span>
          </div>
        </div>

        {/* 联系客服 */}
        <div className="relative group flex items-center h-full">
          <button className="w-11 h-11 rounded-full border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center shrink-0 shadow-sm bg-white">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
            </svg>
          </button>
          
          <div className="absolute top-full right-[-10px] w-52 pt-2 z-[9999] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto translate-y-2 group-hover:translate-y-0">
            <div className="bg-white rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] border border-slate-100 p-4 space-y-4">
              <div className="flex items-center space-x-3.5 group/item">
                <div className="w-9 h-9 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#64748b] shrink-0 border border-slate-50 transition-colors group-hover/item:bg-primary/5 group-hover/item:text-primary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-[#94a3b8] leading-tight">客服微信</span>
                  <span className="text-[13px] font-black text-[#334155] tracking-tight">604038645</span>
                </div>
              </div>
              <div className="flex items-center space-x-3.5 group/item">
                <div className="w-9 h-9 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#64748b] shrink-0 border border-slate-50 transition-colors group-hover/item:bg-primary/5 group-hover/item:text-primary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6.111 8.963 8.963 0 003 10.5c0 4.97 4.03 9 9 9s9-4.03 9-9c0-1.563-.399-3.032-1.104-4.31a11.961 11.961 0 01-8.298-3.036z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-[#94a3b8] leading-tight">QQ客服</span>
                  <span className="text-[13px] font-black text-[#334155] tracking-tight">2682774211</span>
                </div>
              </div>
              <div className="flex items-center space-x-3.5 group/item">
                <div className="w-9 h-9 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#64748b] shrink-0 border border-slate-50 transition-colors group-hover/item:bg-primary/5 group-hover/item:text-primary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-[#94a3b8] leading-tight">客服电话</span>
                  <span className="text-[13px] font-black text-[#334155] tracking-tight whitespace-nowrap">025-57916333-888</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 通知图标与弹窗 */}
        <div className="relative group flex items-center h-full">
          <button className="relative w-11 h-11 rounded-full border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center shrink-0 shadow-sm bg-white">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm"></span>
          </button>

          <div className="absolute top-full right-[-8px] w-64 pt-2 z-[9999] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto translate-y-1 group-hover:translate-y-0">
            <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden">
              <div className="flex bg-slate-50 border-b border-slate-100">
                <button 
                  onClick={() => setActiveNotifTab('通知')}
                  className={`flex-1 py-3 text-[12px] font-black transition-all ${activeNotifTab === '通知' ? 'bg-white text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  通知
                </button>
                <button 
                  onClick={() => setActiveNotifTab('提醒')}
                  className={`flex-1 py-3 text-[12px] font-black transition-all ${activeNotifTab === '提醒' ? 'bg-white text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  提醒
                </button>
              </div>
              <div className="p-2 max-h-72 overflow-y-auto custom-scrollbar">
                {(activeNotifTab === '通知' ? notifications : reminders).map(item => (
                  <div key={item.id} className="p-3 hover:bg-slate-50 rounded-xl transition-colors group/item cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[12px] font-black text-slate-700 group-hover/item:text-primary">{item.title}</span>
                      <span className="text-[12px] text-slate-300 font-medium">{item.time}</span>
                    </div>
                    <p className="text-[12px] text-slate-400 leading-relaxed truncate">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-100 mx-3"></div>

        {/* 用户信息区 */}
        <div className="relative" ref={userMenuRef}>
          <div 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`flex items-center space-x-3 cursor-pointer group px-3 py-1.5 rounded-lg transition-all ${isUserMenuOpen ? 'bg-slate-50/80 shadow-inner' : 'hover:bg-slate-50/50'}`}
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-full border-[2.5px] border-[#3b82f6] shadow-sm bg-white flex items-center justify-center overflow-hidden">
                <svg className="w-7 h-7 text-[#3b82f6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col min-w-[70px]">
              <span className="text-[14px] font-black text-[#1e293b] leading-tight tracking-tight">系统管理员</span>
              <span className="text-[12px] text-[#94a3b8] font-bold mt-1 tracking-tight">管网运维中心</span>
            </div>
            <svg 
              className={`w-4 h-4 text-[#cbd5e1] transition-transform duration-500 ease-out ${isUserMenuOpen ? 'rotate-180 text-primary' : 'group-hover:text-slate-400'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* 用户下拉菜单 */}
          <div className={`absolute top-full right-0 mt-3 w-56 bg-white rounded-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] border border-slate-100 py-2.5 z-[100] transition-all duration-300 origin-top-right ${
            isUserMenuOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'
          }`}>
            <div className="py-2">
              <div className="flex items-center mb-2.5 px-4 text-slate-600">
                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center mr-2.5">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <span className="text-[12px] font-bold">主题色配置</span>
              </div>
              <div className="flex px-6 justify-around mb-1.5">
                {themes.map((t) => (
                  <button 
                    key={t.id}
                    onClick={() => handleThemeChange(t)}
                    className="w-4 h-4 rounded-sm shadow-sm border border-black/5 hover:scale-125 active:scale-90 transition-all shrink-0"
                    style={{ backgroundColor: t.color }}
                    title={t.label}
                  />
                ))}
              </div>
            </div>
            <div className="mx-3 my-2 border-t border-slate-50"></div>
            <button className="w-full flex items-center px-4 py-2 text-slate-600 hover:bg-primary/5 hover:text-primary transition-colors group text-left">
              <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center mr-2.5 group-hover:bg-primary/10 transition-colors">
                <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-[12px] font-bold">修改密码</span>
            </button>
            <div className="mx-3 my-2 border-t border-slate-50"></div>
            <button className="w-full flex items-center px-4 py-2 text-rose-500 hover:bg-rose-50/50 transition-colors group text-left">
              <div className="w-7 h-7 rounded-lg bg-rose-50/30 flex items-center justify-center mr-2.5 group-hover:bg-rose-50 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="text-[12px] font-bold">退出系统</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};