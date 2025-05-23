import { useState, useRef, useEffect } from 'react';
import { 
  Pencil, Square, Circle, Triangle, AlertTriangle, Anchor,
   Share2, Star, Trash2, Undo,
  Redo, Save, ChevronRight, ChevronLeft, Move, Palette
} from 'lucide-react';

const MAPS = [
  { id: 'bind', name: 'BIND', image: '/api/placeholder/800/600' },
  { id: 'haven', name: 'HAVEN', image: '/api/placeholder/800/600' },
  { id: 'split', name: 'SPLIT', image: '/api/placeholder/800/600' },
  { id: 'ascent', name: 'ASCENT', image: '/api/placeholder/800/600' },
  { id: 'icebox', name: 'ICEBOX', image: '/api/placeholder/800/600' },
  { id: 'breeze', name: 'BREEZE', image: '/api/placeholder/800/600' },
  { id: 'fracture', name: 'FRACTURE', image: '/api/placeholder/800/600' },
  { id: 'pearl', name: 'PEARL', image: '/api/placeholder/800/600' },
  { id: 'lotus', name: 'LOTUS', image: '/api/placeholder/800/600' },
  { id: 'sunset', name: 'SUNSET', image: '/api/placeholder/800/600' },
  { id: 'abyss', name: 'ABYSS', image: '/api/placeholder/800/600' }
];
/* 
const AGENTS = [
  { id: 'astra', name: 'Astra', image: '/api/placeholder/48/48' },
  { id: 'breach', name: 'Breach', image: '/api/placeholder/48/48' },
  { id: 'brimstone', name: 'Brimstone', image: '/api/placeholder/48/48' },
  { id: 'chamber', name: 'Chamber', image: '/api/placeholder/48/48' },
  { id: 'cypher', name: 'Cypher', image: '/api/placeholder/48/48' },
  { id: 'fade', name: 'Fade', image: '/api/placeholder/48/48' },
  { id: 'gekko', name: 'Gekko', image: '/api/placeholder/48/48' },
  { id: 'harbor', name: 'Harbor', image: '/api/placeholder/48/48' },
  { id: 'jett', name: 'Jett', image: '/api/placeholder/48/48' },
  { id: 'kayo', name: 'KAY/O', image: '/api/placeholder/48/48' },
  { id: 'killjoy', name: 'Killjoy', image: '/api/placeholder/48/48' },
  { id: 'neon', name: 'Neon', image: '/api/placeholder/48/48' },
  { id: 'omen', name: 'Omen', image: '/api/placeholder/48/48' },
  { id: 'phoenix', name: 'Phoenix', image: '/api/placeholder/48/48' },
  { id: 'raze', name: 'Raze', image: '/api/placeholder/48/48' }
]; */

const TOOLS = [
  { id: 'move', icon: Move, label: 'Move', color: '#ffffff' },
  { id: 'draw', icon: Pencil, label: 'Draw', color: '#00ff99' },
  { id: 'square', icon: Square, label: 'Square', color: '#00ff99' },
  { id: 'circle', icon: Circle, label: 'Circle', color: '#00ff99' },
  { id: 'triangle', icon: Triangle, label: 'Triangle', color: '#00ff99' },
  { id: 'warning', icon: AlertTriangle, label: 'Warning', color: '#ff3333' },
  { id: 'anchor', icon: Anchor, label: 'Anchor', color: '#3366ff' },
  { id: 'star', icon: Star, label: 'Star', color: '#ffcc00' }
];

const COLOR_PALETTE = [
  '#00ff99', '#ff3333', '#3366ff', '#ffcc00', '#ff6600', 
  '#9933ff', '#33ffff', '#ff33cc', '#66ff33', '#ffffff',
  '#cccccc', '#666666', '#ff9999', '#99ccff', '#ffff99'
];



interface DrawingElement {
  id: string;
  type: string;
  points?: { x: number; y: number }[];
  x?: number;
  y?: number;
  color: string;
  size?: number;
}

function BlueprintPage() {
  const [selectedMap, setSelectedMap] = useState(MAPS[0]);
  const [selectedTool, setSelectedTool] = useState('move');
  const [selectedColor, setSelectedColor] = useState('#00ff99');
  const [showMapList, setShowMapList] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);
  const [history, setHistory] = useState<DrawingElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragElement, setDragElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    const tool = TOOLS.find(t => t.id === toolId);
    if (tool && toolId !== 'move') {
      setSelectedColor(tool.color);
    }
  };

  const getElementAtPosition = (x: number, y: number): DrawingElement | null => {
    // Check elements in reverse order (top to bottom)
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      if (element.type !== 'draw' && element.x && element.y) {
        const size = element.size || 30;
        const distance = Math.sqrt(Math.pow(x - element.x, 2) + Math.pow(y - element.y, 2));
        if (distance <= size / 2) {
          return element;
        }
      }
    }
    return null;
  };

  const startDrawing = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === 'move') {
      const elementAtPosition = getElementAtPosition(x, y);
      if (elementAtPosition) {
        setIsDragging(true);
        setDragElement(elementAtPosition.id);
        setDragOffset({
          x: x - (elementAtPosition.x || 0),
          y: y - (elementAtPosition.y || 0)
        });
        return;
      }
    }

    if (selectedTool === 'draw') {
      const newElement: DrawingElement = {
        id: generateId(),
        type: 'draw',
        points: [{ x, y }],
        color: selectedColor
      };
      setCurrentElement(newElement);
      setElements([...elements, newElement]);
    } else if (selectedTool !== 'move') {
      const newElement: DrawingElement = {
        id: generateId(),
        type: selectedTool,
        x,
        y,
        color: selectedColor,
        size: 30
      };
      setElements([...elements, newElement]);
      addToHistory([...elements, newElement]);
    }

    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging && dragElement) {
      const newElements = elements.map(element => {
        if (element.id === dragElement) {
          return {
            ...element,
            x: x - dragOffset.x,
            y: y - dragOffset.y
          };
        }
        return element;
      });
      setElements(newElements);
      return;
    }

    if (!isDrawing || !currentElement) return;

    if (selectedTool === 'draw' && currentElement.points) {
      const newPoints = [...currentElement.points, { x, y }];
      const newElement = { ...currentElement, points: newPoints };
      setCurrentElement(newElement);
      setElements(elements.map((el) => 
        el.id === currentElement.id ? newElement : el
      ));
    }
  };

  const stopDrawing = () => {
    if (isDrawing && selectedTool === 'draw') {
      addToHistory(elements);
    }
    if (isDragging) {
      addToHistory(elements);
    }
    setIsDrawing(false);
    setIsDragging(false);
    setDragElement(null);
    setCurrentElement(null);
  };

  const addToHistory = (newElements: DrawingElement[]) => {
    const newHistory = [...history.slice(0, historyIndex + 1), [...newElements]];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
    }
  };

  const clearCanvas = () => {
    setElements([]);
    addToHistory([]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  return (
    <div className="h-screen bg-slate-900 flex">
      {/* Left Sidebar - Maps & Sequences */}
      <div className={`w-64 bg-slate-800 transition-all duration-300 ${showMapList ? 'translate-x-0' : '-translate-x-56'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-medium">Maps</h2>
            <button 
              onClick={() => setShowMapList(!showMapList)}
              className="text-white hover:text-gray-300"
            >
              {showMapList ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
          
          <div className="space-y-2">
            {MAPS.map(map => (
              <button
                key={map.id}
                onClick={() => setSelectedMap(map)}
                className={`w-full text-left p-2 rounded transition-colors ${
                  selectedMap.id === map.id 
                    ? 'bg-green-400 bg-opacity-20 text-green-400' 
                    : 'text-white hover:bg-slate-700'
                }`}
              >
                {map.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Map */}
      <div className="flex-1 flex flex-col">
        <div className="bg-slate-800 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl text-white font-medium">{selectedMap.name}</h1>
            <div className="flex items-center space-x-2">
              <button 
                className="p-2 rounded bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50"
                onClick={undo}
                disabled={historyIndex <= 0}
              >
                <Undo size={18} />
              </button>
              <button 
                className="p-2 rounded bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
              >
                <Redo size={18} />
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-slate-700 text-white hover:bg-slate-600 rounded flex items-center">
              <Save size={18} className="mr-2" />
              Save
            </button>
            <button className="px-4 py-2 bg-slate-700 text-white hover:bg-slate-600 rounded flex items-center">
              <Share2 size={18} className="mr-2" />
              Share
            </button>
            <button 
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded flex items-center"
              onClick={clearCanvas}
            >
              <Trash2 size={18} className="mr-2" />
              Clear
            </button>
          </div>
        </div>

        <div className="flex-1 relative bg-slate-900 p-4">
          <div 
            ref={canvasRef}
            className={`w-full h-full bg-slate-800 rounded-lg overflow-hidden relative ${
              selectedTool === 'move' ? 'cursor-grab' : 'cursor-crosshair'
            } ${isDragging ? 'cursor-grabbing' : ''}`}
            style={{
              backgroundImage: `url(${selectedMap.image})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          >
            {/* Map overlay with grid */}
            <div className="absolute inset-0 bg-slate-900 bg-opacity-90">
              <svg width="100%" height="100%" className="stroke-slate-700 stroke-1">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Render drawn elements */}
            <svg className="absolute inset-0 pointer-events-none">
              {elements.map((element) => {
                if (element.type === 'draw' && element.points) {
                  return (
                    <polyline
                      key={element.id}
                      points={element.points.map(point => `${point.x},${point.y}`).join(' ')}
                      fill="none"
                      stroke={element.color}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  );
                } else if (element.type === 'square' && element.x && element.y) {
                  return (
                    <rect
                      key={element.id}
                      x={element.x - (element.size || 15)}
                      y={element.y - (element.size || 15)}
                      width={element.size || 30}
                      height={element.size || 30}
                      fill={element.color}
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth="1"
                    />
                  );
                } else if (element.type === 'circle' && element.x && element.y) {
                  return (
                    <circle
                      key={element.id}
                      cx={element.x}
                      cy={element.y}
                      r={element.size ? element.size / 2 : 15}
                      fill={element.color}
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth="1"
                    />
                  );
                } else if (element.type === 'triangle' && element.x && element.y) {
                  const size = element.size || 30;
                  const points = `${element.x},${element.y - size/2} ${element.x - size/2},${element.y + size/2} ${element.x + size/2},${element.y + size/2}`;
                  return (
                    <polygon
                      key={element.id}
                      points={points}
                      fill={element.color}
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth="1"
                    />
                  );
                } else if (element.type === 'star' && element.x && element.y) {
                  const size = (element.size || 30) / 2;
                  const points = Array.from({ length: 10 }, (_, i) => {
                    const angle = (i * Math.PI) / 5;
                    const radius = i % 2 === 0 ? size : size / 2;
                    return `${element.x! + radius * Math.cos(angle - Math.PI / 2)},${element.y! + radius * Math.sin(angle - Math.PI / 2)}`;
                  }).join(' ');
                  return (
                    <polygon
                      key={element.id}
                      points={points}
                      fill={element.color}
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth="1"
                    />
                  );
                } else if (element.type === 'warning' && element.x && element.y) {
                  const size = element.size || 30;
                  const points = `${element.x},${element.y - size/2} ${element.x - size/2},${element.y + size/2} ${element.x + size/2},${element.y + size/2}`;
                  return (
                    <polygon
                      key={element.id}
                      points={points}
                      fill={element.color}
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth="1"
                    />
                  );
                } else if (element.type === 'anchor' && element.x && element.y) {
                  return (
                    <circle
                      key={element.id}
                      cx={element.x}
                      cy={element.y}
                      r={element.size ? element.size / 2 : 15}
                      fill={element.color}
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth="2"
                    />
                  );
                }
                return null;
              })}
            </svg>
          </div>
        </div>


        {/* Agent Selection */}
        <div className="bg-slate-800 p-4">
          <div className="flex items-center space-x-2 overflow-x-auto">
          </div>
        </div>
      </div>

      {/* Right Sidebar - Tools & Colors */}
      <div className="w-16 bg-slate-800 p-2 flex flex-col">
        <div className="space-y-2 mb-4">
          {TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => handleToolSelect(tool.id)}
              className={`w-full aspect-square rounded-lg flex items-center justify-center transition-colors ${
                selectedTool === tool.id 
                  ? 'bg-green-400 text-slate-900' 
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
              title={tool.label}
            >
              <tool.icon size={24} />
            </button>
          ))}
        </div>

        {/* Color Picker */}
        <div className="mt-4">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-full aspect-square rounded-lg flex items-center justify-center bg-slate-700 text-white hover:bg-slate-600 mb-2"
            title="Color Picker"
          >
            <Palette size={24} />
          </button>
          
          {showColorPicker && (
            <div className="absolute right-20 bottom-4 bg-slate-700 p-2 rounded-lg shadow-lg z-10">
              <div className="grid grid-cols-3 gap-1 w-24">
                {COLOR_PALETTE.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      setShowColorPicker(false);
                    }}
                    className={`w-6 h-6 rounded border-2 ${
                      selectedColor === color ? 'border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Current Color Display */}
          <div 
            className="w-full aspect-square rounded-lg border-2 border-slate-600"
            style={{ backgroundColor: selectedColor }}
            title={`Current Color: ${selectedColor}`}
          />
        </div>
      </div>
    </div>
  );
}

export default BlueprintPage;