import React, { useState } from 'react';
import { CampusLocation, NavigationTab } from '../types';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Building2, 
  Clock, 
  Phone, 
  Footprints, 
  Compass, 
  Layers, 
  CheckCircle, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

interface CampusNavViewProps {
  locations: CampusLocation[];
  selectedLocationId?: string | null;
  onSelectLocation?: (id: string) => void;
  setActiveTab: (tab: NavigationTab) => void;
  onAskAI: (prompt: string) => void;
}

export const CampusNavView: React.FC<CampusNavViewProps> = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  setActiveTab,
  onAskAI,
}) => {
  const [selectedLoc, setSelectedLoc] = useState<CampusLocation>(
    locations.find((l) => l.id === selectedLocationId) || locations[1] // Block B default
  );

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Route Finder state
  const [startPointId, setStartPointId] = useState<string>('gate_north');
  const [endPointId, setEndPointId] = useState<string>(selectedLoc.id);
  const [showRoutePath, setShowRoutePath] = useState(false);

  // Sync if parent updates selectedLocationId
  React.useEffect(() => {
    if (selectedLocationId) {
      const match = locations.find((l) => l.id === selectedLocationId);
      if (match) {
        setSelectedLoc(match);
        setEndPointId(match.id);
      }
    }
  }, [selectedLocationId, locations]);

  const categories = ['All', 'Academic', 'Administrative', 'Food', 'Recreation', 'Hostel', 'Utility'];

  const filteredLocations = locations.filter((loc) => {
    const matchesCat = categoryFilter === 'All' || loc.category === categoryFilter;
    const matchesSearch = 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.keyFacilities.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handlePinClick = (loc: CampusLocation) => {
    setSelectedLoc(loc);
    setEndPointId(loc.id);
    if (onSelectLocation) onSelectLocation(loc.id);
  };

  const handleCalculateRoute = () => {
    setShowRoutePath(true);
  };

  // Coordinates for Route path drawing
  const startCoords = startPointId === 'gate_north' 
    ? { x: 15, y: 15 } 
    : locations.find(l => l.id === startPointId)?.coordinates || { x: 15, y: 15 };
  
  const endCoords = locations.find(l => l.id === endPointId)?.coordinates || { x: 50, y: 50 };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            Interactive Campus Navigation & Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Apex Institute of Science & Technology Campus • 120-Acre Smart Campus
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onAskAI(`Give me directions and visiting information for ${selectedLoc.name}`);
              setActiveTab('assistant');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Ask AI Directions</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive SVG Map (Left) & Building Deep-Dive + Route Finder (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive SVG Campus Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              Live Interactive Map (Click pins to inspect)
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-block w-3 h-3 rounded-full bg-indigo-600" /> Academic
              <span className="inline-block w-3 h-3 rounded-full bg-amber-500" /> Food
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" /> Sports
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner select-none">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
            >
              {/* Campus Grounds Background */}
              <defs>
                <pattern id="lawnPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <rect width="10" height="10" fill="#0f172a" />
                  <circle cx="2" cy="2" r="0.8" fill="#1e293b" />
                </pattern>
                <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
              </defs>

              {/* Base terrain */}
              <rect width="100" height="100" fill="url(#lawnPattern)" />

              {/* Lawns and Green Parks */}
              <path d="M 20 25 Q 35 15 50 25 T 80 25 L 80 40 Q 50 50 20 40 Z" fill="#064e3b" opacity="0.4" />
              <path d="M 15 50 Q 30 40 45 52 T 75 52 L 75 75 Q 45 80 15 75 Z" fill="#064e3b" opacity="0.3" />
              
              {/* Central Plaza Oval */}
              <ellipse cx="50" cy="50" rx="16" ry="12" fill="#1e1b4b" stroke="#4338ca" strokeWidth="0.6" strokeDasharray="1.5,1.5" />
              <circle cx="50" cy="50" r="3" fill="#6366f1" opacity="0.6" />
              <text x="50" y="50.8" fill="#c7d2fe" fontSize="1.8" textAnchor="middle" fontWeight="bold">Central Plaza</text>

              {/* Main Ring Road & Walkways */}
              <path
                d="M 12 15 L 88 15 L 88 85 L 12 85 Z"
                fill="none"
                stroke="#475569"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 12 50 L 88 50 M 50 15 L 50 85"
                fill="none"
                stroke="#334155"
                strokeWidth="1.8"
                strokeDasharray="2,2"
              />

              {/* Gates */}
              <rect x="8" y="12" width="8" height="6" fill="#4f46e5" rx="1" />
              <text x="12" y="16" fill="#ffffff" fontSize="1.6" textAnchor="middle" fontWeight="bold">North Gate</text>

              <rect x="84" y="82" width="8" height="6" fill="#4f46e5" rx="1" />
              <text x="88" y="86" fill="#ffffff" fontSize="1.6" textAnchor="middle" fontWeight="bold">South Gate</text>

              {/* Render Animated Route if Active */}
              {showRoutePath && (
                <g>
                  {/* Glowing line */}
                  <path
                    d={`M ${startCoords.x} ${startCoords.y} Q ${(startCoords.x + endCoords.x) / 2} 50 ${endCoords.x} ${endCoords.y}`}
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="2.2"
                    strokeDasharray="3,2"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                  {/* Start Point Marker */}
                  <circle cx={startCoords.x} cy={startCoords.y} r="2.5" fill="#10b981" stroke="#ffffff" strokeWidth="0.8" />
                  <text x={startCoords.x} y={startCoords.y - 3} fill="#a7f3d0" fontSize="2" textAnchor="middle" fontWeight="bold">START</text>
                  {/* End Point Marker */}
                  <circle cx={endCoords.x} cy={endCoords.y} r="2.5" fill="#ef4444" stroke="#ffffff" strokeWidth="0.8" />
                  <text x={endCoords.x} y={endCoords.y - 3} fill="#fecaca" fontSize="2" textAnchor="middle" fontWeight="bold">DESTINATION</text>
                </g>
              )}

              {/* Building Pins on SVG */}
              {locations.map((loc) => {
                const isSelected = selectedLoc.id === loc.id;
                const pinColor = 
                  loc.category === 'Academic' ? '#6366f1' :
                  loc.category === 'Food' ? '#f59e0b' :
                  loc.category === 'Recreation' ? '#10b981' :
                  loc.category === 'Administrative' ? '#8b5cf6' :
                  loc.category === 'Hostel' ? '#ec4899' : '#06b6d4';

                return (
                  <g
                    key={loc.id}
                    onClick={() => handlePinClick(loc)}
                    className="cursor-pointer transition-transform hover:scale-110"
                    transform={`translate(${loc.coordinates.x}, ${loc.coordinates.y})`}
                  >
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <circle
                        cx="0"
                        cy="0"
                        r="5.5"
                        fill="none"
                        stroke={pinColor}
                        strokeWidth="0.8"
                        opacity="0.8"
                        className="animate-ping"
                      />
                    )}

                    {/* Building Footprint Box */}
                    <rect
                      x="-4"
                      y="-3.5"
                      width="8"
                      height="7"
                      rx="1"
                      fill="#1e293b"
                      stroke={isSelected ? '#ffffff' : pinColor}
                      strokeWidth={isSelected ? '0.9' : '0.6'}
                    />

                    {/* Pin Circle */}
                    <circle
                      cx="0"
                      cy="0"
                      r="2"
                      fill={pinColor}
                    />

                    {/* Code label */}
                    <text
                      x="0"
                      y="6.2"
                      fill={isSelected ? '#ffffff' : '#cbd5e1'}
                      fontSize="1.8"
                      textAnchor="middle"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="pointer-events-none"
                    >
                      {loc.code}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Quick map overlay badge */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700 text-[10px] text-slate-300">
              Selected: <strong className="text-white">{selectedLoc.name}</strong>
            </div>
          </div>

          {/* Search & Category Filter Pills */}
          <div className="mt-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search departments, GPU cluster, library pods, food court..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 border ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Building Deep-Dive Card & Route Finder (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Selected Building Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="relative h-40 overflow-hidden">
              <img
                src={selectedLoc.image}
                alt={selectedLoc.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-600/90 text-white">
                  {selectedLoc.category} • {selectedLoc.code}
                </span>
                <h3 className="font-extrabold text-base leading-snug mt-1">
                  {selectedLoc.name}
                </h3>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedLoc.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Floors</span>
                    <strong className="text-slate-800">{selectedLoc.floors} Levels</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Access Hours</span>
                    <strong className="text-slate-800 text-[11px] truncate block">{selectedLoc.timing}</strong>
                  </div>
                </div>
              </div>

              {/* Key Facilities Directory */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Floor Facilities & Labs
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {selectedLoc.keyFacilities.map((fac, i) => (
                    <div
                      key={i}
                      className="text-xs p-2 rounded-lg bg-indigo-50/50 text-indigo-950 border border-indigo-100/60 font-medium flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact: {selectedLoc.headOrContact}</span>
              </div>
            </div>
          </div>

          {/* Interactive Route Finder */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Footprints className="w-4 h-4 text-emerald-600" />
              Walking Route Path & ETA
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Starting Point
                </label>
                <select
                  value={startPointId}
                  onChange={(e) => {
                    setStartPointId(e.target.value);
                    setShowRoutePath(false);
                  }}
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none"
                >
                  <option value="gate_north">North Gate / Main Shuttle Stop</option>
                  <option value="loc_dorms">Hostel Quad (Residential Halls)</option>
                  <option value="loc_admin">Administrative Block (Admin 104)</option>
                  <option value="loc_sports">Olympus Sports Arena</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Target Destination
                </label>
                <select
                  value={endPointId}
                  onChange={(e) => {
                    setEndPointId(e.target.value);
                    const match = locations.find(l => l.id === e.target.value);
                    if (match) setSelectedLoc(match);
                    setShowRoutePath(false);
                  }}
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none"
                >
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.code})</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCalculateRoute}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Calculate Walk Route on Map</span>
              </button>

              {showRoutePath && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-emerald-900">Estimated Walk: 3 mins (240m)</span>
                    <span className="text-[11px] text-emerald-700 font-semibold">18 kcal • Flat terrain</span>
                  </div>
                  <ol className="text-xs text-emerald-950 space-y-1 list-decimal list-inside leading-relaxed">
                    <li>Exit towards Central Lawn boulevard.</li>
                    <li>Head south past the Innovation Pod.</li>
                    <li>Enter through the East Glass Atrium (Elevators on left).</li>
                  </ol>
                  <p className="text-[10px] text-emerald-700 font-medium pt-1 border-t border-emerald-200/60">
                    ♿ Wheelchair ramp and elevator access verified.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
