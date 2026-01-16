
import React, { useState, useRef, useEffect } from 'react';

export const Header: React.FC = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  return (
    <header className="h-14 bg-white border border-slate-100 rounded-xl px-6 flex items-center justify-between shadow-sm shrink-0">
      {/* 左侧：系统名称 */}
      <div className="flex items-center">
        <h1 className="text-[15px] font-bold text-[#334155] tracking-tight">
          智慧能源综合监管平台
        </h1>
      </div>

      {/* 右侧：功能组件 */}
      <div className="flex items-center space-x-2">
        {/* 天气信息 */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
          <svg className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-700 leading-none">26℃</span>
            <span className="text-[9px] text-slate-400 font-medium">晴天 / 滨海新区</span>
          </div>
        </div>

        {/* 联系客服 - 优化弹窗内对齐与尺寸 */}
        <div className="relative group flex items-center">
          <button className="p-2 text-slate-400 hover:text-[#9a6bff] hover:bg-[#9a6bff]/5 rounded-lg transition-all flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" strokeWidth="2" />
              <path strokeLinecap="round" strokeWidth="2" d="M14.83 9.17l2.83-2.83M9.17 14.83l-2.83 2.83M9.17 9.17L6.34 6.34M14.83 14.83l2.83 2.83" />
            </svg>
          </button>
          
          {/* 客服悬浮弹窗 */}
          <div className="absolute top-full right-[-8px] mt-2 w-52 bg-white rounded-2xl shadow-[0_15px_45px_-10px_rgba(0,0,0,0.12)] border border-slate-100 p-4 z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto translate-y-2 group-hover:translate-y-0">
            <div className="space-y-4">
              {/* 微信 - 优化垂直居中 */}
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-[#64748b] shrink-0 border border-slate-100/50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-[10px] font-bold text-slate-400 leading-tight">客服微信</div>
                  <div className="text-[12px] font-black text-slate-700 tracking-tight leading-normal">604038645</div>
                </div>
              </div>
              
              {/* QQ */}
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-[#64748b] shrink-0 border border-slate-100/50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6.111 8.963 8.963 0 003 10.5c0 4.97 4.03 9 9 9s9-4.03 9-9c0-1.563-.399-3.032-1.104-4.31a11.961 11.961 0 01-8.298-3.036z" />
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-[10px] font-bold text-slate-400 leading-tight">QQ客服</div>
                  <div className="text-[12px] font-black text-slate-700 tracking-tight leading-normal">2682774211</div>
                </div>
              </div>

              {/* 电话 */}
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-[#64748b] shrink-0 border border-slate-100/50">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-[10px] font-bold text-slate-400 leading-tight">客服电话</div>
                  <div className="text-[12px] font-black text-slate-700 tracking-tight leading-normal whitespace-nowrap">025-57916333-888</div>
                </div>
              </div>

              {/* 工作时间 */}
              <div className="border-t border-slate-50 pt-3.5 mt-1.5">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-[#64748b] shrink-0 border border-slate-100/50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="text-[10px] font-bold text-slate-400 leading-tight">工作时间</div>
                    <div className="text-[10px] font-bold text-slate-600 leading-tight mt-0.5">周一 - 周五<br/>(08:30-17:30)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 通知图标 */}
        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all group">
          <svg className="w-5 h-5 group-hover:shake transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        {/* 垂直分割线 */}
        <div className="h-6 w-px bg-slate-100 mx-2"></div>

        {/* 用户信息区 */}
        <div className="relative" ref={userMenuRef}>
          <div 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`flex items-center space-x-3 cursor-pointer group px-2 py-1 rounded-lg transition-all ${isUserMenuOpen ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
          >
            <img 
              src="https://picsum.photos/seed/admin/100/100" 
              className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-100 shadow-sm" 
              alt="Avatar" 
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-700 leading-tight">系统管理员</span>
              <span className="text-[10px] text-slate-400 font-medium">管网运维中心</span>
            </div>
            <svg 
              className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180 text-[#9a6bff]' : 'group-hover:text-slate-500'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* 用户下拉菜单 */}
          <div className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.15)] border border-slate-100 py-1.5 z-50 transition-all duration-200 origin-top-right ${
            isUserMenuOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'
          }`}>
            <button className="w-full flex items-center px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-[#9a6bff] transition-colors group">
              <svg className="w-4 h-4 mr-3 text-slate-400 group-hover:text-[#9a6bff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span className="text-xs font-bold">主题色</span>
            </button>
            <button className="w-full flex items-center px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-[#9a6bff] transition-colors group">
              <svg className="w-4 h-4 mr-3 text-slate-400 group-hover:text-[#9a6bff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs font-bold">修改密码</span>
            </button>
            <div className="mx-2 my-1 border-t border-slate-50"></div>
            <button className="w-full flex items-center px-4 py-2.5 text-rose-500 hover:bg-rose-50 transition-colors group">
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-xs font-bold">退出登录</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
