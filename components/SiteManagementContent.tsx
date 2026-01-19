
import React, { useState } from 'react';

interface SiteRecord {
  id: string;
  reporter: string;
  reportDate: string;
  status: 'pending' | 'monitoring' | 'error';
  siteName: string;
  address: string;
  grade: '1' | '2' | '3';
  industry: string;
  method: string;
  days: number;
  dangerDesc: string;
}

const MOCK_SITES: SiteRecord[] = [
  { id: '1', reporter: '胡影', reportDate: '2025/05/19 11:55', status: 'pending', siteName: '中南路雨水管网改造工程(建邱段)', address: '江苏省南京市建邺区沙洲街道停车场', grade: '2', industry: '市政工程', method: '明挖回填', days: 347, dangerDesc: '土方塌陷、管线受损' },
  { id: '2', reporter: '三商', reportDate: '2025/05/07 13:30', status: 'monitoring', siteName: '建邱中心4012地块桩基施工', address: '江苏省南京市建邺区沙洲街道江东中路363号新华传媒...', grade: '2', industry: '建筑工程', method: '静压桩', days: 609, dangerDesc: '震动沉降' },
  { id: '3', reporter: '王建国', reportDate: '2025/05/20 09:15', status: 'monitoring', siteName: '鼓楼北扩容及道路硬化二期', address: '南京市鼓楼区中山路18号', grade: '1', industry: '市政设施', method: '非开挖顶管', days: 12, dangerDesc: '沉井风险' },
  { id: '4', reporter: '李秀才', reportDate: '2025/05/21 14:20', status: 'error', siteName: '河西金鹰世界外围绿化提升', address: '南京市建邺区江东中路金鹰世界', grade: '3', industry: '园林绿化', method: '小型机具', days: 5, dangerDesc: '浅层光缆' },
];

export const SiteManagementContent: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['1']));

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] p-2.5 gap-2.5 overflow-hidden items-center">
      {/* 顶部工具栏 */}
      <div className="w-full max-w-[1550px] flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm shrink-0">
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-[#9a6bff] text-white text-xs font-bold rounded-lg hover:bg-[#8558eb] transition-colors flex items-center">
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            新增
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors">修改</button>
          <button className="px-4 py-2 bg-white border border-slate-200 text-rose-500 text-xs font-bold rounded-lg hover:bg-rose-50 hover:border-rose-100 transition-colors">删除</button>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center">
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 8l-4 4m0 0l-4-4m4 4V4" /></svg>
            导出
          </button>
        </div>
        
        {/* 优化后的搜索框 - 圆角弧度已调整为与下方按钮一致的 rounded-lg */}
        <div className="relative group">
          <input 
            type="text" 
            placeholder="搜索工地名称..." 
            className="w-64 h-9 pl-10 pr-4 bg-slate-50/50 border border-slate-200/80 rounded-lg text-[12px] font-medium text-slate-600 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-[#9a6bff]/10 focus:border-[#9a6bff]/50 outline-none transition-all duration-300"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#9a6bff] transition-colors duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 下方三栏布局 */}
      <div className="w-full max-w-[1550px] flex-1 flex gap-2.5 min-h-0 overflow-hidden">
        
        {/* 左侧：查询条件卡片 */}
        <div className="w-60 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col shrink-0">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            多维度查询
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-slate-500">工地名称</label>
              <input type="text" className="w-full h-8 px-3 bg-slate-50 border border-slate-100 rounded text-xs outline-none focus:border-[#9a6bff]/50 transition-colors" placeholder="输入名称关键字" />
            </div>
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-slate-500">施工单位</label>
              <input type="text" className="w-full h-8 px-3 bg-slate-50 border border-slate-100 rounded text-xs outline-none focus:border-[#9a6bff]/50 transition-colors" placeholder="搜索单位名称" />
            </div>
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-slate-500">监护等级</label>
              <select className="w-full h-8 px-2 bg-slate-50 border border-slate-100 rounded text-xs outline-none text-slate-600">
                <option>全部等级</option>
                <option>一级</option>
                <option>二级</option>
                <option>三级</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-slate-500">当前状态</label>
              <div className="grid grid-cols-2 gap-2">
                {['待处理', '监护中', '已完工', '异常'].map(s => (
                  <label key={s} className="flex items-center space-x-2 cursor-pointer group">
                    <div className="w-3.5 h-3.5 rounded border border-slate-200 group-hover:border-[#9a6bff] transition-colors"></div>
                    <span className="text-[12px] font-medium text-slate-600">{s}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* 操作按钮组：查询与重置 */}
          <div className="flex gap-2.5 mt-4">
            <button className="flex-1 py-2 bg-[#9a6bff] text-white text-xs font-bold rounded-lg hover:bg-[#8558eb] transition-all active:scale-95 shadow-md shadow-[#9a6bff]/20">
              查询
            </button>
            <button className="flex-1 py-2 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95">
              重置
            </button>
          </div>
        </div>

        {/* 中间：表格卡片 */}
        <div className="flex-1 min-w-0 max-w-[1200px] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full border-collapse min-w-[1250px]">
              <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 border-b border-slate-100">
                <tr className="text-left">
                  <th className="p-3 w-12 text-center">
                    <div className="w-4 h-4 border border-slate-300 rounded mx-auto cursor-pointer"></div>
                  </th>
                  <th className="p-3 text-[12px] font-black text-slate-400 uppercase tracking-wider w-16 text-center">序号</th>
                  <th className="p-3 text-[12px] font-black text-slate-400 uppercase tracking-wider">最后回报人</th>
                  <th className="p-3 text-[12px] font-black text-slate-400 uppercase tracking-wider">最后回报日期</th>
                  <th className="p-3 text-[12px] font-black text-slate-400 uppercase tracking-wider">状态</th>
                  <th className="p-3 text-[12px] font-black text-slate-400 uppercase tracking-wider w-56">工地名称</th>
                  <th className="p-3 text-[12px] font-black text-slate-400 uppercase tracking-wider w-64">工地地址</th>
                  <th className="p-3 text-[12px] font-black text-slate-400 uppercase tracking-wider text-center">监护等级</th>
                  <th className="p-3 text-[12px] font-black text-slate-400 uppercase tracking-wider">施工行业</th>
                  <th className="p-3 text-[12px] font-black text-slate-400 uppercase tracking-wider">施工方式</th>
                  <th className="p-3 text-[12px] font-black text-slate-400 uppercase tracking-wider text-center">累计监护(天)</th>
                  <th className="p-3 text-[12px] font-black text-slate-400 uppercase tracking-wider">危险描述</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_SITES.map((site, index) => {
                  const isSelected = selectedIds.has(site.id);
                  return (
                    <tr 
                      key={site.id} 
                      className={`hover:bg-slate-50/50 transition-colors group ${isSelected ? 'bg-blue-50/30' : ''}`}
                      onClick={() => toggleSelect(site.id)}
                    >
                      <td className="p-3 text-center">
                        <div className={`w-4 h-4 border rounded mx-auto flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[#3b82f6] border-[#3b82f6] text-white' : 'border-slate-300 group-hover:border-[#3b82f6]'
                        }`}>
                          {isSelected && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                      </td>
                      <td className="p-3 text-center text-xs font-bold text-slate-400">{index + 1}</td>
                      <td className="p-3 text-xs font-bold text-slate-700">{site.reporter}</td>
                      <td className="p-3 text-xs text-slate-400 font-medium font-mono whitespace-nowrap">{site.reportDate}</td>
                      <td className="p-3">
                        {site.status === 'pending' && <span className="px-2.5 py-0.5 bg-blue-50 text-[#3b82f6] text-[12px] font-bold rounded-full border border-blue-100/50">待处理</span>}
                        {site.status === 'monitoring' && <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[12px] font-bold rounded-full border border-emerald-100/50">监护中</span>}
                        {site.status === 'error' && <span className="px-2.5 py-0.5 bg-rose-50 text-rose-500 text-[12px] font-bold rounded-full border border-rose-100/50">异常</span>}
                      </td>
                      <td className="p-3 text-xs font-bold text-slate-900 leading-relaxed">{site.siteName}</td>
                      <td className="p-3 text-xs text-slate-500 leading-relaxed font-medium">{site.address}</td>
                      <td className="p-3 text-center">
                        {site.grade === '1' && <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-500 border border-rose-200 text-[12px] font-black rounded-md">一级</span>}
                        {site.grade === '2' && <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-500 border border-amber-200 text-[12px] font-black rounded-md">二级</span>}
                        {site.grade === '3' && <span className="inline-block px-2 py-0.5 bg-sky-50 text-sky-500 border border-sky-200 text-[12px] font-black rounded-md">三级</span>}
                      </td>
                      <td className="p-3 text-xs text-slate-600 font-medium">{site.industry}</td>
                      <td className="p-3 text-xs text-slate-600 font-medium">{site.method}</td>
                      <td className="p-3 text-center text-xs font-black text-slate-800 font-mono">{site.days}</td>
                      <td className="p-3 text-xs text-slate-400 font-medium leading-relaxed">{site.dangerDesc}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {/* 表格底部分页预览 */}
          <div className="h-11 border-t border-slate-50 flex items-center justify-between px-6 bg-slate-50/30 shrink-0">
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">共 4 条记录</span>
            <div className="flex space-x-1">
              <button className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white transition-colors"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5" /></svg></button>
              <button className="w-7 h-7 rounded bg-[#9a6bff] text-white flex items-center justify-center text-xs font-bold shadow-sm">1</button>
              <button className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white transition-colors"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2.5" /></svg></button>
            </div>
          </div>
        </div>

        {/* 右侧：固定导航栏卡片 */}
        <div className="w-14 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center py-4 shrink-0">
          <div className="flex flex-col items-center space-y-4">
            <button className="w-10 h-10 rounded-xl bg-[#9a6bff] text-white shadow-lg shadow-[#9a6bff]/30 flex items-center justify-center transition-all active:scale-95">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-xl text-slate-300 hover:text-slate-500 hover:bg-slate-50 flex items-center justify-center transition-all active:scale-95">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125-1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.806H8.002c-.822 0-1.585.391-2.074 1.047l-2.623 3.525a1.214 1.214 0 01-.673.465m0 0A1.23 1.23 0 003.375 14.25h15.75" />
              </svg>
            </button>
          </div>
          <div className="mt-auto space-y-3">
             <div className="w-1 h-1 rounded-full bg-slate-200 mx-auto"></div>
             <div className="w-1 h-1 rounded-full bg-slate-200 mx-auto"></div>
          </div>
        </div>

      </div>
    </div>
  );
};
