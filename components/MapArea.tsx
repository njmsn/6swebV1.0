
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_MAP_POINTS } from '../constants.tsx';

declare const L: any;

const toQuadKey = (x: number, y: number, z: number) => {
  let quadKey = '';
  for (let i = z; i > 0; i--) {
    let digit = 0;
    const mask = 1 << (i - 1);
    if ((x & mask) !== 0) digit++;
    if ((y & mask) !== 0) digit += 2;
    quadKey += digit.toString();
  }
  return quadKey;
};

interface LayerItem {
  id: string;
  label: string;
  checked: boolean;
  icon: React.ReactNode;
}

interface LayerGroup {
  id: string;
  label: string;
  items: LayerItem[];
  isOpen: boolean;
  checked: boolean;
}

const PersonnelPopup: React.FC<{ 
  person: any; 
  position: { x: number, y: number }; 
  onClose: () => void;
}> = ({ person, position, onClose }) => {
  const [activeTab, setActiveTab] = useState('实时');
  
  const InfoRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex items-center py-1 border-b border-slate-50 last:border-0">
      <span className="text-[#94a3b8] font-bold shrink-0 w-[60px] text-[12px]">{label}</span>
      <span className="text-[#334155] font-black truncate flex-1 pl-2 text-[12px]">{value || '--'}</span>
    </div>
  );

  const getGpsStatus = () => {
    if (person.status === 'normal') return '正常';
    if (person.status === 'warning') return '异常';
    return '离线';
  };

  const statusDotColor = person.status === 'normal' ? 'bg-[#10b981]' : person.status === 'warning' ? 'bg-[#f59e0b]' : 'bg-[#f43f5e]';

  const historyData = [
    { time: '2026/01/15: 09:08 - 12:51', desc: '刘长青2026/01/01的计划,刘长青2026/01/01的计划' },
    { time: '2026/01/15: 09:08 - 12:51', desc: '刘长青2026/01/01的计划,刘长青2026/01/01的计划' },
    { time: '2026/01/14: 08:30 - 11:20', desc: '场站常规巡检计划,包含阀门与压力监测' },
    { time: '2026/01/13: 14:00 - 17:45', desc: '滨海新区泰达大街地下管网测绘与记录' },
    { time: '2026/01/12: 09:00 - 16:30', desc: '全区管网例行压力测试报告上传' }
  ];

  return (
    <div className="absolute bg-white rounded-2xl shadow-[0_35px_80px_-15px_rgba(0,0,0,0.25)] border border-slate-100 z-[1000] overflow-visible flex flex-col animate-in zoom-in-95 fade-in duration-500 ease-out"
      style={{ width: '330px', height: '430px', left: `${position.x}px`, top: `${position.y - 28}px`, transform: 'translate(-50%, -100%)' }}>
      
      <div className="absolute bottom-[-11px] left-1/2 -translate-x-1/2 w-0 h-0" style={{ borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '12px solid white', filter: 'drop-shadow(0 5px 3px rgba(0,0,0,0.08))' }}></div>
      
      <div className="h-10 px-4 flex items-center justify-between border-b border-slate-50 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-3.5 bg-primary rounded-full"></div>
          <span className="text-[12px] font-black text-slate-700 tracking-tight">员工详细档案</span>
        </div>
        <button onClick={onClose} className="text-slate-300 hover:text-rose-500 transition-all p-1 hover:bg-rose-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
      </div>
      
      <div className="px-4 pt-4 pb-2 shrink-0">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col">
            <h2 className="text-[17px] font-black text-[#1e293b] tracking-tight mb-0.5">董仲良</h2>
            <div className="flex items-center space-x-2">
               <span className="text-primary text-[12px] font-bold opacity-80 tracking-widest">ID: 325</span>
               <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
               <span className="text-emerald-500 text-[12px] font-black uppercase tracking-tight">On duty</span>
            </div>
          </div>
          <img src={person.image} className="w-11 h-11 rounded-xl border-2 border-white shadow-lg object-cover" />
        </div>
        
        <div className="flex bg-slate-50 p-1 rounded-xl mb-1 border border-slate-100 shrink-0">
          {['实时', '计划', '历史'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-1.5 text-[12px] font-black rounded-lg transition-all ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}>{tab}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4">
        {activeTab === '实时' && (
          <div className="animate-in fade-in duration-300 space-y-1">
            <InfoRow label="职位" value="管网安检员" />
            <InfoRow label="版本号" value="v6.168.229" />
            <InfoRow label="IMEI" value="864502041234567" />
            <InfoRow label="电话" value="15002299778" />
            <InfoRow label="位置" value="天津市滨海新区泰达大街" />
            <InfoRow label="状态" value="巡检中 (正常)" />
            <InfoRow label="上班" value="2025-05-22 08:30:12" />
            <InfoRow label="下班" value="2025-05-22 17:30:00" />
            <InfoRow label="同步" value="2025-05-22 11:20:45" />
            <div className="flex items-center py-1 border-b border-slate-50 last:border-0">
              <span className="text-[#94a3b8] font-bold shrink-0 w-[60px] text-[12px]">角色</span>
              <span className="text-primary font-black truncate flex-1 pl-2 text-[12px]">巡检组长</span>
            </div>
          </div>
        )}

        {activeTab === '历史' && (
          <div className="space-y-0 divide-y divide-slate-100 animate-in fade-in duration-300">
            {historyData.map((item, index) => (
              <div key={index} className="py-3 first:pt-1 last:pb-0">
                <div className="text-[12px] font-black text-slate-600 mb-1">{item.time}</div>
                <div className="text-[12px] font-medium text-slate-400 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === '计划' && (
          <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-2 opacity-60 animate-in fade-in duration-300 min-h-[150px]">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
             <span className="text-[12px] font-bold">暂无今日排班计划</span>
          </div>
        )}
      </div>
      
      {activeTab === '实时' && (
        <div className="border-t border-slate-50 px-5 py-4 flex flex-col bg-[#fcfdfe] rounded-b-2xl shrink-0 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-black text-[#94a3b8] uppercase tracking-[0.05em]">PROGRESS</span>
            <div className="flex items-center">
               <div className="flex items-center space-x-3 pr-3">
                  <div className="flex items-center">
                    <svg className={`w-3 h-3 ${person.battery < 20 ? 'text-[#f43f5e]' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <rect x="2" y="7" width="16" height="10" rx="1.5" />
                      <path d="M20 10v4" />
                    </svg>
                    <span className="text-[12px] font-black ml-1 text-slate-500">{person.battery}%</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-1.5 h-1.5 rounded-full ${statusDotColor}`}></div>
                    <span className="text-[12px] font-black ml-1 text-slate-500">GPS: {getGpsStatus()}</span>
                  </div>
               </div>
               <div className="flex items-center space-x-3 border-l border-slate-100 pl-3">
                 <span className="text-[12px] font-black text-primary">{person.progress}%</span>
               </div>
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-1000 ease-out rounded-full" style={{ width: `${person.progress}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export const MapArea: React.FC = () => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);
  const baseLayersRef = useRef<{ [key: string]: any }>({});
  
  const [selectedPersonnel, setSelectedPersonnel] = useState<any>(null);
  const [selectedLatLng, setSelectedLatLng] = useState<any>(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [mapType, setMapType] = useState<string>('vec');

  const [layers, setLayers] = useState<LayerGroup[]>([
    {
      id: 'basic',
      label: '基本图层',
      isOpen: true,
      checked: true,
      items: [
        { id: 'corp', label: '公司', checked: true, icon: <svg className="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L4 9v12h16V9l-8-6zm0 2.2l6 4.5V19h-3v-6H9v6H6v-7.3l6-4.5z"/></svg> },
        { id: 'person', label: '人员', checked: true, icon: <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
        { id: 'station', label: '基站', checked: true, icon: <div className="w-4 h-4 rounded-full border-2 border-emerald-500"></div> },
        { id: 'task', label: '计划任务', checked: true, icon: <div className="w-4 h-4 rounded-full bg-lime-500"></div> },
      ]
    },
    {
      id: 'gis',
      label: 'GIS图层',
      isOpen: true,
      checked: true,
      items: [
        { id: 'pipe', label: '管线', checked: true, icon: <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 12c4-4 8-4 12 0s8 4 12 0" transform="scale(0.8)"/></svg> },
        { id: 'valve', label: '阀门', checked: true, icon: <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l-4 4h8l-4-4zm0 20l4-4H8l4 4zM4 12l4-4v8l-4-4zm16 0l-4 4V8l4 4z"/></svg> },
      ]
    }
  ]);

  useEffect(() => {
    if (!mapRef.current) return;
    const updatePopupPosition = () => {
      if (selectedLatLng) {
        const point = mapRef.current.latLngToContainerPoint(selectedLatLng);
        setPopupPos({ x: point.x, y: point.y });
      }
    };
    mapRef.current.on('move zoom viewreset', updatePopupPosition);
    return () => {
      mapRef.current?.off('move zoom viewreset', updatePopupPosition);
    };
  }, [selectedLatLng]);

  useEffect(() => {
    if (typeof L === 'undefined' || !mapContainerRef.current || mapRef.current) return;
    mapRef.current = L.map(mapContainerRef.current, { center: [39.0145, 117.7126], zoom: 14, zoomControl: false, attributionControl: false });
    
    const BingTileLayer = L.TileLayer.extend({ 
      getTileUrl: function(coords: any) { 
        return L.Util.template(this._url, { s: this._getSubdomain(coords), quadkey: toQuadKey(coords.x, coords.y, coords.z) }); 
      } 
    });

    baseLayersRef.current = { 
      vec: new (BingTileLayer as any)('https://t{s}.tiles.virtualearth.net/tiles/r{quadkey}.jpeg?g=129&mkt=zh-cn&shading=hill', { subdomains: ['0', '1', '2', '3'] }),
      sat: new (BingTileLayer as any)('https://t{s}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=129&mkt=zh-cn&shading=hill', { subdomains: ['0', '1', '2', '3'] })
    };

    baseLayersRef.current.vec.addTo(mapRef.current);
    renderMarkers();
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !baseLayersRef.current) return;
    Object.values(baseLayersRef.current).forEach(layer => {
      if (mapRef.current.hasLayer(layer)) mapRef.current.removeLayer(layer);
    });
    if (mapType === 'vec') baseLayersRef.current.vec.addTo(mapRef.current);
    else if (mapType === 'sat') baseLayersRef.current.sat.addTo(mapRef.current);
  }, [mapType]);

  const renderMarkers = () => {
    if (!mapRef.current) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    MOCK_MAP_POINTS.forEach((point) => {
      const lat = 39.0145 + (point.y - 50) * 0.001;
      const lng = 117.7126 + (point.x - 50) * 0.002;
      // 使用 CSS 变量获取当前主色，或者根据 point 状态映射
      const currentPrimaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
      const statusColor = point.status === 'normal' ? currentPrimaryColor : point.status === 'warning' ? '#f59e0b' : '#f43f5e';
      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="relative flex items-center justify-center"><div class="absolute w-12 h-12 rounded-full opacity-40 ping-animation" style="background-color: ${statusColor}"></div><div class="w-10 h-10 rounded-lg border-2 border-white overflow-hidden shadow-xl bg-white relative z-10" style="border-color: ${statusColor}"><img src="${point.image}" class="w-full h-full object-cover" /></div></div>`,
        iconSize: [40, 40], iconAnchor: [20, 20]
      });
      const marker = L.marker([lat, lng], { icon }).addTo(mapRef.current);
      marker.on('click', (e: any) => { 
        const latlng = e.target.getLatLng();
        setSelectedPersonnel(point);
        setSelectedLatLng(latlng);
        const currentZoom = mapRef.current.getZoom();
        const markerProjected = mapRef.current.project(latlng, currentZoom);
        const targetProjected = markerProjected.subtract([0, 240]); 
        const targetLatLng = mapRef.current.unproject(targetProjected, currentZoom);
        mapRef.current.setView(targetLatLng, currentZoom, { animate: true });
        const pos = mapRef.current.latLngToContainerPoint(latlng);
        setPopupPos({ x: pos.x, y: pos.y }); 
      });
      markersRef.current.push(marker);
    });
  };

  const handleRefresh = () => {
    renderMarkers();
    mapRef.current?.setView([39.0145, 117.7126], 14, { animate: true });
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else if (document.exitFullscreen) document.exitFullscreen();
  };

  const toggleGroupFold = (id: string) => setLayers(prev => prev.map(g => g.id === id ? { ...g, isOpen: !g.isOpen } : g));
  const handleGroupCheck = (id: string) => setLayers(prev => prev.map(g => g.id === id ? { ...g, checked: !g.checked, items: g.items.map(i => ({ ...i, checked: !g.checked })) } : g));
  const handleItemCheck = (groupId: string, itemId: string) => setLayers(prev => prev.map(g => g.id === groupId ? { ...g, items: g.items.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i) } : g));

  const MapControlButton = ({ icon, label, onClick, isActive = false, children }: { icon: React.ReactNode, label: string, onClick: () => void, isActive?: boolean, children?: React.ReactNode }) => (
    <div className="relative group/tool">
      <button 
        onClick={onClick}
        className={`w-11 h-11 rounded-xl shadow-lg flex items-center justify-center transition-all border active:scale-95 ${
          isActive 
          ? 'bg-primary text-white border-primary shadow-primary/30' 
          : 'bg-white text-slate-500 hover:text-primary border-slate-50 hover:shadow-xl'
        }`}
      >
        {icon}
      </button>
      {!isActive && (
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover/tool:opacity-100 transition-all duration-200 translate-x-1 group-hover/tool:translate-x-0 z-[100] pointer-events-none">
          <div className="tooltip-bubble tooltip-arrow-left">{label}</div>
        </div>
      )}
      {isActive && children}
    </div>
  );

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-50">
      <div ref={mapContainerRef} className="w-full h-full z-0 transition-all duration-500 ease-in-out"></div>
      
      {selectedPersonnel && (
        <PersonnelPopup 
          person={selectedPersonnel} 
          position={popupPos} 
          onClose={() => { setSelectedPersonnel(null); setSelectedLatLng(null); }} 
        />
      )}

      <div className="absolute top-6 right-6 z-40 flex flex-col items-end">
        <button onClick={() => setIsLayerPanelOpen(!isLayerPanelOpen)} className={`w-11 h-11 rounded-xl shadow-lg flex items-center justify-center transition-all active:scale-95 group border border-slate-50 ${isLayerPanelOpen ? 'bg-primary text-white shadow-primary/30' : 'bg-white text-slate-500 hover:text-primary hover:shadow-xl'}`}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 12 12 17 22 12" /><polyline points="2 17 12 22 22 17" />
          </svg>
        </button>
        <div className={`mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 transform origin-top-right ${isLayerPanelOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}>
          <div className="p-4 py-6 max-h-[70vh] overflow-y-auto custom-scrollbar select-none">
            {layers.map((group) => (
              <div key={group.id} className="mb-1">
                <div className="flex items-center group/title relative">
                  <button onClick={() => toggleGroupFold(group.id)} className="w-4 h-4 border border-slate-300 bg-white flex items-center justify-center text-[12px] text-slate-400 hover:text-slate-600 transition-colors mr-1.5 relative z-10">{group.isOpen ? '-' : '+'}</button>
                  <div onClick={() => handleGroupCheck(group.id)} className={`w-4 h-4 rounded border transition-colors flex items-center justify-center cursor-pointer mr-3 ${group.checked ? 'bg-[#3b82f6] border-[#3b82f6] text-white' : 'bg-white border-slate-300 hover:border-[#3b82f6]'}`}><svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg></div>
                  <span className="text-[12px] font-bold text-slate-700 tracking-tight">{group.label}</span>
                </div>
                {group.isOpen && (
                  <div className="relative ml-2 pt-1">
                    <div className="absolute left-[7px] top-0 bottom-[14px] w-px border-l border-dashed border-slate-300"></div>
                    {group.items.map((item) => (
                      <div key={item.id} className="relative flex items-center py-1.5 pl-6">
                        <div className="absolute left-[7px] top-1/2 -translate-y-1/2 w-4 h-px border-t border-dashed border-slate-300"></div>
                        <div onClick={() => handleItemCheck(group.id, item.id)} className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer mr-3 shrink-0 ${item.checked ? 'bg-[#3b82f6] border-[#3b82f6] text-white' : 'bg-white border-slate-300'}`}><svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg></div>
                        <div className="flex items-center space-x-2.5 overflow-hidden">
                          <div className="w-4 h-4 flex items-center justify-center shrink-0">{item.icon}</div>
                          <span className={`text-[12px] font-medium transition-colors truncate ${item.checked ? 'text-slate-700' : 'text-slate-400'}`}>{item.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-40 flex flex-col space-y-2">
        <MapControlButton label="刷新" onClick={handleRefresh} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2" /></svg>} />
        <MapControlButton label="总览" onClick={() => mapRef.current?.setView([39.0145, 117.7126], 14, { animate: true })} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeWidth="2"/></svg>} />
        <MapControlButton label="测量" isActive={activeTool === 'measure'} onClick={() => setActiveTool(activeTool === 'measure' ? null : 'measure')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.3 4.7a3.1 3.1 0 0 1 0 4.3L8.7 21.6a3.1 3.1 0 0 1-4.3 0L2.4 19.6a3.1 3.1 0 0 1 0-4.3L15.1 2.7a3.1 3.1 0 0 1 4.3 0l1.9 2z" /><path d="M7.5 10.5l2 2M10.5 7.5l2 2M13.5 4.5l2 2" /></svg>}>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 flex flex-row items-center bg-white rounded-lg shadow-xl border border-slate-100 p-1.5 animate-in fade-in slide-in-from-left-3 duration-300 whitespace-nowrap">
            {['测距', '面积', '角度'].map((tool) => (
              <button key={tool} onClick={(e) => { e.stopPropagation(); }} className="px-4 py-2 rounded-md text-[12px] font-bold text-slate-500 hover:bg-primary/10 hover:text-primary transition-all">{tool}</button>
            ))}
          </div>
        </MapControlButton>
        <MapControlButton label="统计" isActive={activeTool === 'stats'} onClick={() => setActiveTool(activeTool === 'stats' ? null : 'stats')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeWidth="2"/></svg>}>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 flex flex-row items-center bg-white rounded-lg shadow-xl border border-slate-100 p-1.5 animate-in fade-in slide-in-from-left-3 duration-300 whitespace-nowrap">
            {['绘图', '计算', '清除'].map((tool) => (
              <button key={tool} onClick={(e) => { e.stopPropagation(); }} className="px-4 py-2 rounded-md text-[12px] font-bold text-slate-500 hover:bg-primary/10 hover:text-primary transition-all">{tool}</button>
            ))}
          </div>
        </MapControlButton>
        <MapControlButton label="要素识别" isActive={activeTool === 'identify'} onClick={() => setActiveTool(activeTool === 'identify' ? null : 'identify')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V6a2 2 0 012-2h3M15 4h3a2 2 0 012 2v3M20 15v3a2 2 0 01-2 2h-3M9 20H6a2 2 0 01-2-2v-3" /><path d="M7 12h10" /></svg>} />
        <MapControlButton label="全屏" isActive={isFullscreen} onClick={handleFullscreen} icon={isFullscreen ? (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 14h6v6M20 10h-6V4M14 20v-6h6M10 4v6H4" /></svg>) : (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 3h6v6M9 21H3v-6M21 15v6h-6M3 9V3h6" /></svg>)} />
        <MapControlButton label="地图" isActive={activeTool === 'mapType'} onClick={() => setActiveTool(activeTool === 'mapType' ? null : 'mapType')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" strokeWidth="2"/></svg>} >
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 flex flex-row items-center bg-white rounded-lg shadow-xl border border-slate-100 p-1.5 animate-in fade-in slide-in-from-left-3 duration-300 whitespace-nowrap">
            {[{ id: 'vec', label: '道路图' }, { id: 'sat', label: '卫星图' }, { id: 'white', label: '白板' }].map((sub) => (
              <button key={sub.id} onClick={(e) => { e.stopPropagation(); setMapType(sub.id); }} className={`px-4 py-2 rounded-md text-[12px] font-bold transition-all ${mapType === sub.id ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}>{sub.label}</button>
            ))}
          </div>
        </MapControlButton>
      </div>
    </div>
  );
};
