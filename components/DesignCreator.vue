<template>
  <div class="container mx-auto px-6 py-12">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Design Canvas -->
      <div class="lg:col-span-8">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-[#0a3a47]">Shirt Designer</h2>
            <div class="flex gap-2">
              <button @click="zoomIn" class="btn-secondary">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                </svg>
              </button>
              <button @click="zoomOut" class="btn-secondary">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10v3m0-3H7"/>
                </svg>
              </button>
              <button @click="resetView" class="btn-secondary">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
              <button @click="exportDesign" class="btn-secondary" title="Design exportieren">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </button>
              <button @click="testCanvas" class="btn-secondary" title="Test Canvas">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </button>
              <button @click="togglePlacementGuides" class="btn-secondary" :class="{'bg-[#D8127D] text-white': showPlacementGuides}" title="Placement Guides">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </button>
              <button @click="togglePolygonMode" class="btn-secondary" :class="{'bg-[#0a3a47] text-white': isDrawingPolygon}" title="Custom Polygon">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4l16 16M4 20L20 4"/>
                </svg>
              </button>
              <button v-if="isDrawingPolygon" @click="finishPolygon" class="btn-secondary bg-green-600 text-white">Polygon fertig</button>
            </div>
          </div>
          
          <!-- Canvas Container -->
          <div class="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            <canvas 
              ref="canvasRef" 
              class="w-full h-[600px] cursor-crosshair"
              @mousedown="onMouseDown"
              @mousemove="onMouseMove"
              @mouseup="onMouseUp"
              @wheel="onWheel"
              @keydown="onKeyDown"
              tabindex="0"
            ></canvas>
            
            <!-- Warning Message -->
            <div v-if="showWarning" class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-10">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <span class="text-sm font-medium">{{ warningMessage }}</span>
              </div>
            </div>
            
            <!-- Canvas Overlay for Instructions -->
            <div v-if="!hasDesign" class="absolute inset-0 flex items-center justify-center">
              <div class="text-center text-gray-500">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                <p class="text-lg font-semibold">Ziehen Sie Ihr Design hierher</p>
                <p class="text-sm">oder klicken Sie auf "Bild hochladen"</p>
                <div class="mt-4 text-xs text-gray-400">
                  <p>⌘+Z: Rückgängig | ⌘+Y: Wiederholen | Delete: Löschen</p>
                  <p>Alt+Drag: Verschieben | Ctrl+Scroll: Zoomen</p>
                </div>
              </div>
            </div>
          </div>
      </div>
      </div>

      <!-- Design Tools Sidebar -->
      <div class="lg:col-span-4">
        <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">
          <!-- Product Info -->
        <div>
          <h1 class="text-2xl font-bold mb-1">Unisex Basic T-Shirt <span class="text-xs text-gray-400">#E150</span></h1>
          <div class="text-sm text-[#D8127D] font-semibold mb-2 flex items-center gap-2">
              <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M12 12a4 4 0 01-4-4V4a4 4 0 018 0v4a4 4 0 01-4 4z"/>
              </svg>
            Partner-Artikel: <span class="text-gray-600">Frauen | Kinder | Teenager | Übergrößen</span>
          </div>
        </div>

          <!-- Upload Section -->
          <div>
            <h3 class="font-semibold mb-3 text-[#0a3a47]">Design hinzufügen</h3>
            <div class="space-y-3">
              <button @click="openFileInput" class="btn w-full bg-[#D8127D] hover:bg-[#b0105f] text-white">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                Bild hochladen
              </button>
              <input 
                ref="fileInput" 
                type="file" 
                accept="image/*,.svg" 
                @change="handleFileUpload" 
                class="hidden"
              />
              <button @click="addText" class="btn w-full bg-[#ff7a00] hover:bg-[#ffa940] text-white">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Text hinzufügen
              </button>
              <button @click="testCanvas" class="btn w-full bg-gray-600 hover:bg-gray-700 text-white">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Test Canvas (Red Rectangle)
              </button>
            </div>
          </div>

          <!-- Templates Section -->
          <div>
            <h3 class="font-semibold mb-3 text-[#0a3a47]">Vorlagen</h3>
            <div class="grid grid-cols-2 gap-2">
              <button @click="addSampleText" class="btn-secondary text-xs">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Text Vorlage
              </button>
              <button @click="addSampleLogo" class="btn-secondary text-xs">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                Logo Vorlage
              </button>
            </div>
          </div>

          <!-- Placement Guide Info -->
          <div v-if="showPlacementGuides" class="bg-blue-50 rounded-lg p-3">
            <h4 class="font-semibold text-sm text-[#0a3a47] mb-2">Design-Bereiche</h4>
            <div class="text-xs space-y-1">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-[#D8127D] rounded"></div>
                <span>Front-Bereich (groß)</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-[#ff7a00] rounded"></div>
                <span>Rücken-Bereich (mittel)</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-[#0a3a47] rounded"></div>
                <span>Ärmel-Bereiche (klein)</span>
              </div>
            </div>
          </div>

        <!-- Color Swatches -->
        <div>
            <div class="font-semibold mb-2 text-[#0a3a47]">Shirt Farbe</div>
          <div class="grid grid-cols-8 gap-2 mb-2">
              <button 
                v-for="(color, i) in colors" 
                :key="color.name" 
                :title="color.name" 
                @click="changeShirtColor(i)" 
                :class="['w-7 h-7 rounded-full border-2', selectedColor === i ? 'border-[#D8127D] ring-2 ring-[#ffd44d]' : 'border-gray-200']" 
                :style="{backgroundColor: color.hex}"
              ></button>
          </div>
          <div class="text-xs text-gray-500">Gewählte Farbe: <span class="font-semibold text-[#0a3a47]">{{ colors[selectedColor].name }}</span></div>
        </div>

          <!-- Design Tools -->
          <div v-if="selectedObject">
            <h3 class="font-semibold mb-3 text-[#0a3a47]">Design bearbeiten</h3>
            <div class="space-y-3">
              <!-- Layer Controls -->
              <div class="flex gap-2">
                <button @click="bringToFront" class="btn-secondary flex-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                  </svg>
                </button>
                <button @click="sendToBack" class="btn-secondary flex-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <button @click="deleteObject" class="btn-secondary">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>

              <!-- Text Controls -->
              <div v-if="selectedObject.type === 'text'" class="space-y-3">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Text</label>
                  <input 
                    v-model="selectedObject.text" 
                    @input="updateText"
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D8127D]"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Schriftgröße</label>
                  <input 
                    v-model="selectedObject.fontSize" 
                    @input="updateText"
                    type="range" 
                    min="12" 
                    max="72" 
                    class="w-full"
                  />
                  <div class="text-xs text-gray-500 text-center">{{ selectedObject.fontSize }}px</div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Farbe</label>
                  <div class="grid grid-cols-6 gap-1">
                    <button 
                      v-for="color in textColors" 
                      :key="color.name"
                      @click="changeTextColor(color.hex)"
                      :class="['w-6 h-6 rounded border', selectedObject.fill === color.hex ? 'border-[#D8127D] ring-2' : 'border-gray-200']"
                      :style="{backgroundColor: color.hex}"
                      :title="color.name"
                    ></button>
                  </div>
                </div>
              </div>

              <!-- Image Controls -->
              <div v-if="selectedObject.type === 'image'" class="space-y-3">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Transparenz</label>
                  <input 
                    v-model="selectedObject.opacity" 
                    @input="updateImage"
                    type="range" 
                    min="0.1" 
                    max="1" 
                    step="0.1" 
                    class="w-full"
                  />
                  <div class="text-xs text-gray-500 text-center">{{ Math.round(selectedObject.opacity * 100) }}%</div>
                </div>
              </div>
            </div>
          </div>

        <!-- Product Info -->
        <div>
          <details class="mb-2">
            <summary class="cursor-pointer font-semibold text-[#D8127D]">Produktinformationen</summary>
            <div class="text-xs text-gray-600 mt-2">100% Baumwolle, Regular Fit, B&C Collection, waschbar bis 40°C, Unisex.</div>
          </details>
          <details>
            <summary class="cursor-pointer font-semibold text-[#D8127D]">Aktueller Lagerbestand</summary>
            <div class="text-xs text-gray-600 mt-2">Viele Größen und Farben sofort verfügbar.</div>
          </details>
        </div>

        <!-- Price & Delivery -->
        <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <span class="font-semibold text-[#0a3a47]">Gesamtsumme</span>
            <span class="text-lg font-bold text-[#D8127D]">11,90 €</span>
          </div>
          <div class="text-xs text-gray-500">inkl. MwSt. EU / inkl. Druckkosten / zzgl. <a href="#" class="underline text-[#D8127D]">Versand</a></div>
          <div class="text-sm text-[#0a3a47] font-semibold mt-2">Lieferung in der Regel innerhalb von 4 Werktagen</div>
        </div>

        <!-- Action Button -->
          <button class="btn w-full bg-[#ff7a00] hover:bg-[#ffa940] text-white text-lg font-bold py-3 rounded-lg mt-2">
            Größe und Menge wählen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'

// Canvas and Fabric.js setup
const canvasRef = ref(null)
const fileInput = ref(null)
let canvas = null
let fabric = null

// State
const selectedColor = ref(2)
const selectedObject = ref(null)
const hasDesign = ref(false)
const showPlacementGuides = ref(true)
const showWarning = ref(false)
const warningMessage = ref('')
const customPolygon = ref([]) // Array of {x, y}
const isDrawingPolygon = ref(false)
let polygonOverlay = null

// Shirt colors
const colors = [
  { name: 'Weiß', hex: '#f5f5f5' },
  { name: 'Schwarz', hex: '#222' },
  { name: 'Atoll', hex: '#1cc6ea' },
  { name: 'Gelb', hex: '#ffe600' },
  { name: 'Pink', hex: '#D8127D' },
  { name: 'Grün', hex: '#6bbf59' },
  { name: 'Rot', hex: '#e53935' },
  { name: 'Blau', hex: '#1976d2' },
  { name: 'Grau', hex: '#bdbdbd' },
  { name: 'Navy', hex: '#0a3a47' },
  { name: 'Orange', hex: '#ff7a00' },
  { name: 'Lila', hex: '#8e24aa' },
  { name: 'Beige', hex: '#f5e9da' },
  { name: 'Oliv', hex: '#808000' },
  { name: 'Bordeaux', hex: '#800020' },
  { name: 'Türkis', hex: '#30d5c8' },
]

// Text colors
const textColors = [
  { name: 'Schwarz', hex: '#000000' },
  { name: 'Weiß', hex: '#ffffff' },
  { name: 'Rot', hex: '#e53935' },
  { name: 'Blau', hex: '#1976d2' },
  { name: 'Grün', hex: '#6bbf59' },
  { name: 'Gelb', hex: '#ffe600' },
  { name: 'Orange', hex: '#ff7a00' },
  { name: 'Pink', hex: '#D8127D' },
  { name: 'Lila', hex: '#8e24aa' },
  { name: 'Grau', hex: '#666666' },
  { name: 'Navy', hex: '#0a3a47' },
  { name: 'Türkis', hex: '#30d5c8' },
]

// Helper function to ensure fabric is loaded
const ensureFabric = async () => {
  if (!fabric) {
    const fabricModule = await import('fabric')
    fabric = fabricModule.default || fabricModule
  }
  return fabric
}

// Initialize canvas
const initCanvas = async () => {
  if (!canvasRef.value) {
    console.warn('Canvas ref not available')
    return
  }

  try {
    // Dynamically import fabric.js to avoid SSR issues
    if (!fabric) {
      const fabricModule = await import('fabric')
      fabric = fabricModule.default || fabricModule
      console.log('Fabric.js loaded successfully:', fabric)
    }

    // Create canvas
    canvas = new fabric.Canvas(canvasRef.value, {
      width: canvasRef.value.offsetWidth,
      height: 600,
      backgroundColor: '#fff',
      selection: true,
      preserveObjectStackingOrder: true
    })

    // Load shirt PNG as background and create mask
    await setShirtBackgroundAndMask()

    // Add shirt outline with placement guides (optional, for visual help)
    addShirtOutline()

    // Event listeners
    canvas.on('selection:created', onSelection)
    canvas.on('selection:updated', onSelection)
    canvas.on('selection:cleared', onSelectionCleared)
    canvas.on('object:modified', onObjectModified)
    canvas.on('object:added', onObjectAdded)
    canvas.on('object:removed', onObjectRemoved)
    canvas.on('object:moving', onObjectMoving)
    canvas.on('object:scaling', onObjectScaling)
    canvas.on('object:rotating', onObjectRotating)

    // Enable drag and drop
    setupDragAndDrop()
    
    console.log('Canvas initialized successfully')
  } catch (error) {
    console.error('Error initializing canvas:', error)
  }
}

// Set shirt PNG as background and create mask
const setShirtBackgroundAndMask = async () => {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // Set as fabric background
      const fabricImg = new fabric.Image(img, {
        left: 0,
        top: 0,
        originX: 'left',
        originY: 'top',
        selectable: false,
        evented: false,
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height
      })
      canvas.backgroundImage = fabricImg;
      canvas.requestRenderAll();

      // Create mask canvas
      maskCanvas = document.createElement('canvas')
      maskCanvas.width = canvas.width
      maskCanvas.height = canvas.height
      maskCtx = maskCanvas.getContext('2d')
      // Draw scaled PNG to mask
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height)
      maskCtx.drawImage(img, 0, 0, maskCanvas.width, maskCanvas.height)
      resolve()
    }
    img.onerror = (e) => {
      console.error('Failed to load shirt PNG', e)
      reject(e)
    }
    img.src = 'https://png.pngtree.com/png-vector/20230902/ourmid/pngtree-black-t-shirt-mockup-hanging-realistic-t-shirt-png-image_9823288.png' // Use a local image in public/ for reliable loading
  })
}

// Add shirt outline with placement guides
const addShirtOutline = () => {
  if (!fabric) return
  
  try {
    // Remove all non-user objects (guides, outlines) first
    const objects = canvas.getObjects()
    objects.forEach(obj => {
      if (obj.selectable === false && obj.evented === false) {
        canvas.remove(obj)
      }
    })

    // Shirt body (outline, not background)
    const body = new fabric.Rect({
      left: canvas.width / 2 - 150,
      top: 50,
      width: 300,
      height: 400,
      fill: 'transparent',
      stroke: '#333',
      strokeWidth: 2,
      rx: 20,
      ry: 20,
      selectable: false,
      evented: false
    })

    // Sleeves
    const leftSleeve = new fabric.Rect({
      left: canvas.width / 2 - 180,
      top: 100,
      width: 60,
      height: 80,
      fill: 'transparent',
      stroke: '#333',
      strokeWidth: 2,
      rx: 30,
      ry: 30,
      selectable: false,
      evented: false
    })

    const rightSleeve = new fabric.Rect({
      left: canvas.width / 2 + 120,
      top: 100,
      width: 60,
      height: 80,
      fill: 'transparent',
      stroke: '#333',
      strokeWidth: 2,
      rx: 30,
      ry: 30,
      selectable: false,
      evented: false
    })

    // Placement guides (all selectable: false, evented: false)
    const frontGuide = new fabric.Rect({
      left: canvas.width / 2 - 120,
      top: 80,
      width: 240,
      height: 320,
      fill: 'rgba(212, 18, 125, 0.1)',
      stroke: '#D8127D',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      rx: 10,
      ry: 10,
      selectable: false,
      evented: false
    })
    const backGuide = new fabric.Rect({
      left: canvas.width / 2 - 100,
      top: 100,
      width: 200,
      height: 280,
      fill: 'rgba(255, 122, 0, 0.1)',
      stroke: '#ff7a00',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      rx: 8,
      ry: 8,
      selectable: false,
      evented: false
    })
    const leftSleeveGuide = new fabric.Rect({
      left: canvas.width / 2 - 170,
      top: 110,
      width: 40,
      height: 60,
      fill: 'rgba(10, 58, 71, 0.1)',
      stroke: '#0a3a47',
      strokeWidth: 1,
      strokeDashArray: [3, 3],
      rx: 5,
      ry: 5,
      selectable: false,
      evented: false
    })
    const rightSleeveGuide = new fabric.Rect({
      left: canvas.width / 2 + 130,
      top: 110,
      width: 40,
      height: 60,
      fill: 'rgba(10, 58, 71, 0.1)',
      stroke: '#0a3a47',
      strokeWidth: 1,
      strokeDashArray: [3, 3],
      rx: 5,
      ry: 5,
      selectable: false,
      evented: false
    })
    const frontLabel = new fabric.Text('Front Design Area', {
      left: canvas.width / 2,
      top: 60,
      fontSize: 12,
      fill: '#D8127D',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    })
    const backLabel = new fabric.Text('Back Design Area', {
      left: canvas.width / 2,
      top: 420,
      fontSize: 12,
      fill: '#ff7a00',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    })
    const sleeveLabel = new fabric.Text('Sleeve Areas', {
      left: canvas.width / 2,
      top: 480,
      fontSize: 10,
      fill: '#0a3a47',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    })

    // Add all guides and outlines first
    canvas.add(body)
    canvas.add(leftSleeve)
    canvas.add(rightSleeve)
    if (showPlacementGuides.value) {
      canvas.add(frontGuide)
      canvas.add(backGuide)
      canvas.add(leftSleeveGuide)
      canvas.add(rightSleeveGuide)
      canvas.add(frontLabel)
      canvas.add(backLabel)
      canvas.add(sleeveLabel)
    }

    // Move all user objects to the top of the stack
    canvas.getObjects().forEach(obj => {
      if (obj.selectable !== false || obj.evented !== false) {
        canvas.bringToFront(obj)
      }
    })

    console.log('Shirt outline with placement guides added successfully')
  } catch (error) {
    console.error('Error adding shirt outline:', error)
  }
}

// Setup drag and drop
const setupDragAndDrop = () => {
  const canvasElement = canvasRef.value

  canvasElement.addEventListener('dragover', (e) => {
    e.preventDefault()
    canvasElement.style.borderColor = '#D8127D'
  })

  canvasElement.addEventListener('dragleave', (e) => {
    e.preventDefault()
    canvasElement.style.borderColor = '#e5e7eb'
  })

  canvasElement.addEventListener('drop', async (e) => {
    e.preventDefault()
    canvasElement.style.borderColor = '#e5e7eb'
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      await handleFile(files[0])
    }
  })
}

// File handling
const openFileInput = () => {
  fileInput.value.click()
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (file) {
    await handleFile(file)
  }
}

const handleFile = async (file) => {
  if (!file) {
    console.warn('No file provided')
    return
  }

  try {
    const fabricInstance = await ensureFabric()
    console.log('Fabric instance loaded for file handling:', fabricInstance)
    
    const reader = new FileReader()
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error)
    }
    
    if (file.type.startsWith('image/')) {
      console.log('Processing image file:', file.type, file.name)
      reader.onload = (e) => {
        try {
          console.log('Creating fabric image from URL')
          const imgUrl = e.target.result
          console.log('Image URL created:', imgUrl.substring(0, 50) + '...')
          
          // Use native Image constructor approach which is more reliable
          const img = new Image()
          img.crossOrigin = 'anonymous'
          
          img.onload = () => {
            console.log('Native image loaded successfully, dimensions:', img.width, 'x', img.height)
            try {
              const fabricImg = new fabricInstance.Image(img, {
                left: canvas.width / 2,
                top: canvas.height / 2,
                originX: 'center',
                originY: 'center'
              })
              console.log('Fabric image created:', fabricImg)
              addImageToCanvas(fabricImg)
            } catch (fabricError) {
              console.error('Error creating fabric image:', fabricError)
            }
          }
          
          img.onerror = (error) => {
            console.error('Error loading native image:', error)
          }
          
          img.src = imgUrl
          
        } catch (error) {
          console.error('Error in image processing:', error)
        }
      }
      reader.readAsDataURL(file)
    } else if (file.name.endsWith('.svg')) {
      console.log('Processing SVG file:', file.name)
      reader.onload = (e) => {
        try {
          console.log('Loading SVG from URL')
          fabricInstance.loadSVGFromURL(e.target.result, (objects, options) => {
            console.log('SVG loaded, objects:', objects)
            if (objects.length > 0) {
              const svgGroup = fabricInstance.util.groupSVGElements(objects, options)
              console.log('SVG group created:', svgGroup)
              addImageToCanvas(svgGroup)
            } else {
              console.warn('No SVG objects found')
            }
          })
        } catch (error) {
          console.error('Error loading SVG:', error)
        }
      }
      reader.readAsText(file)
    } else {
      console.warn('Unsupported file type:', file.type)
    }
  } catch (error) {
    console.error('Error in handleFile:', error)
  }
}

const addImageToCanvas = (fabricObject) => {
  try {
    if (!fabricObject) {
      console.warn('No fabric object provided to addImageToCanvas')
      return
    }

    console.log('Adding image to canvas:', fabricObject)
    console.log('Fabric object properties:', {
      width: fabricObject.width,
      height: fabricObject.height,
      type: fabricObject.type,
      left: fabricObject.left,
      top: fabricObject.top
    })
    
    // Check if the object has valid dimensions
    if (!fabricObject.width || !fabricObject.height) {
      console.warn('Fabric object has no dimensions, setting defaults')
      fabricObject.set({
        width: 200,
        height: 200
      })
    }
    
    // Scale and position the object
    const maxSize = 200
    const scaleX = maxSize / fabricObject.width
    const scaleY = maxSize / fabricObject.height
    const scale = Math.min(scaleX, scaleY, 1) // Don't scale up, only down
    
    console.log('Scaling object with scale:', scale, 'original size:', fabricObject.width, 'x', fabricObject.height)
    
    fabricObject.set({
      left: canvas.width / 2,
      top: canvas.height / 2,
      originX: 'center',
      originY: 'center',
      scaleX: scale,
      scaleY: scale
    })

    console.log('Adding object to canvas with properties:', {
      left: fabricObject.left,
      top: fabricObject.top,
      scaleX: fabricObject.scaleX,
      scaleY: fabricObject.scaleY
    })

    // Add to canvas
    canvas.add(fabricObject)
    console.log('Object added to canvas')
    
    // Set as active object
    canvas.setActiveObject(fabricObject)
    console.log('Object set as active')
    
    // Check placement and update border
    updateObjectBorder(fabricObject)
    
    // Render canvas
    canvas.renderAll()
    console.log('Canvas rendered')
    
    hasDesign.value = true
    
    console.log('Image added to canvas successfully')
    console.log('Canvas objects count:', canvas.getObjects().length)
    
    // Force a re-render after a short delay to ensure everything is displayed
    setTimeout(() => {
      canvas.renderAll()
      console.log('Canvas re-rendered after timeout')
    }, 100)
    
  } catch (error) {
    console.error('Error adding image to canvas:', error)
    console.error('Error stack:', error.stack)
  }
}

// Text handling
const addText = async () => {
  const fabricInstance = await ensureFabric()
  
  const text = new fabricInstance.Text('Text eingeben', {
    left: canvas.width / 2,
    top: canvas.height / 2,
    fontSize: 24,
    fill: '#000000',
    fontFamily: 'Arial',
    originX: 'center',
    originY: 'center'
  })

  canvas.add(text)
  canvas.setActiveObject(text)
  updateObjectBorder(text)
  canvas.renderAll()
  hasDesign.value = true
}

// Sample designs
const addSampleText = async () => {
  const fabricInstance = await ensureFabric()
  
  const text = new fabricInstance.Text('Sample Text', {
    left: canvas.width / 2,
    top: canvas.height / 2,
    fontSize: 30,
    fill: '#000000',
    fontFamily: 'Arial',
    originX: 'center',
    originY: 'center'
  })
  canvas.add(text)
  canvas.setActiveObject(text)
  updateObjectBorder(text)
  canvas.renderAll()
  hasDesign.value = true
}

const addSampleLogo = async () => {
  try {
    const fabricInstance = await ensureFabric()
    
    // Create individual logo elements instead of a group
    
    // Create a circle
    const circle = new fabricInstance.Circle({
      left: canvas.width / 2,
      top: canvas.height / 2,
      radius: 30,
      fill: '#D8127D',
      stroke: '#0a3a47',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center'
    })

    // Create text
    const text = new fabricInstance.Text('LOGO', {
      left: canvas.width / 2,
      top: canvas.height / 2,
      fontSize: 12,
      fill: 'white',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      originX: 'center',
      originY: 'center'
    })

    canvas.add(circle)
    canvas.add(text)
    
    // Select the circle as the active object
    canvas.setActiveObject(circle)
    updateObjectBorder(circle)
    canvas.renderAll()
    hasDesign.value = true
    
    console.log('Sample logo added successfully')
  } catch (error) {
    console.error('Error adding sample logo:', error)
  }
}

// Color handling
const changeShirtColor = (index) => {
  selectedColor.value = index
  canvas.backgroundColor = colors[index].hex
  canvas.renderAll()
}

const changeTextColor = (color) => {
  if (selectedObject.value && selectedObject.value.type === 'text') {
    selectedObject.value.fill = color
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      activeObject.set('fill', color)
      canvas.renderAll()
    }
  }
}

// Object selection
const onSelection = (e) => {
  const activeObject = canvas.getActiveObject()
  if (activeObject) {
    selectedObject.value = {
      type: activeObject.type,
      text: activeObject.text || '',
      fontSize: activeObject.fontSize || 24,
      fill: activeObject.fill || '#000000',
      opacity: activeObject.opacity || 1
    }
  }
}

const onSelectionCleared = () => {
  selectedObject.value = null
}

const onObjectModified = () => {
  // Update selectedObject when object is modified
  const activeObject = canvas.getActiveObject()
  if (activeObject && selectedObject.value) {
    selectedObject.value.text = activeObject.text || selectedObject.value.text
    selectedObject.value.fontSize = activeObject.fontSize || selectedObject.value.fontSize
    selectedObject.value.fill = activeObject.fill || selectedObject.value.fill
    selectedObject.value.opacity = activeObject.opacity || selectedObject.value.opacity
  }
  // Check placement after modification
  if (activeObject) {
    updateObjectBorder(activeObject)
  }
}

const onObjectAdded = () => {
  hasDesign.value = true
  // Check placement for newly added objects
  const activeObject = canvas.getActiveObject()
  if (activeObject) {
    updateObjectBorder(activeObject)
  }
}

const onObjectRemoved = () => {
  hasDesign.value = canvas.getObjects().length > 1 // More than just the shirt outline
  // Clear warning if no objects left
  if (canvas.getObjects().length <= 1) {
    showWarning.value = false
  }
}

// Update functions
const updateText = () => {
  const activeObject = canvas.getActiveObject()
  if (activeObject && activeObject.type === 'text' && selectedObject.value) {
    activeObject.set({
      text: selectedObject.value.text,
      fontSize: parseInt(selectedObject.value.fontSize),
      fill: selectedObject.value.fill
    })
    canvas.renderAll()
  }
}

const updateImage = () => {
  const activeObject = canvas.getActiveObject()
  if (activeObject && activeObject.type === 'image' && selectedObject.value) {
    activeObject.set('opacity', parseFloat(selectedObject.value.opacity))
    canvas.renderAll()
  }
}

// Layer controls
const bringToFront = () => {
  const activeObject = canvas.getActiveObject()
  if (activeObject) {
    try {
      // Simple approach: remove and add back to bring to front
      canvas.remove(activeObject)
      canvas.add(activeObject)
      canvas.renderAll()
    } catch (error) {
      console.error('Error bringing to front:', error)
    }
  }
}

const sendToBack = () => {
  const activeObject = canvas.getActiveObject()
  if (activeObject) {
    try {
      // Simple approach: remove and insert at beginning
      canvas.remove(activeObject)
      canvas.insertAt(activeObject, 0)
      canvas.renderAll()
    } catch (error) {
      console.error('Error sending to back:', error)
    }
  }
}

const deleteObject = () => {
  const activeObject = canvas.getActiveObject()
  if (activeObject) {
    canvas.remove(activeObject)
    selectedObject.value = null
    canvas.renderAll()
  }
}

// Zoom controls
const zoomIn = () => {
  const zoom = canvas.getZoom()
  canvas.setZoom(Math.min(zoom * 1.1, 3))
  canvas.renderAll()
}

const zoomOut = () => {
  const zoom = canvas.getZoom()
  canvas.setZoom(Math.max(zoom / 1.1, 0.5))
  canvas.renderAll()
}

const resetView = () => {
  canvas.setZoom(1)
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
  canvas.renderAll()
}

// Export function
const exportDesign = () => {
  if (!canvas) {
    console.warn('Canvas not initialized')
    return
  }

  const canvasElement = canvasRef.value
  const scale = canvas.getZoom()
  const vpt = canvas.viewportTransform

  const options = {
    scale: scale,
    left: vpt[4],
    top: vpt[5],
    width: canvasElement.offsetWidth,
    height: canvasElement.offsetHeight,
    backgroundColor: canvas.backgroundColor,
    quality: 0.9,
    format: 'png'
  }

  canvas.toDataURL(options, (dataUrl) => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'design_export.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

// Mouse events for panning
let isDragging = false
let lastPosX = 0
let lastPosY = 0

const onMouseDown = (e) => {
  if (e.altKey) {
    isDragging = true
    lastPosX = e.clientX
    lastPosY = e.clientY
    canvas.defaultCursor = 'grabbing'
  }
}

const onMouseMove = (e) => {
  if (isDragging) {
    const deltaX = e.clientX - lastPosX
    const deltaY = e.clientY - lastPosY
    const vpt = canvas.viewportTransform
    vpt[4] += deltaX
    vpt[5] += deltaY
    canvas.setViewportTransform(vpt)
    lastPosX = e.clientX
    lastPosY = e.clientY
  }
}

const onMouseUp = () => {
  isDragging = false
  canvas.defaultCursor = 'default'
}

const onWheel = (e) => {
  if (e.ctrlKey) {
    e.preventDefault()
    const delta = e.deltaY
    const zoom = canvas.getZoom()
    const newZoom = zoom * (1 - delta / 1000)
    canvas.setZoom(Math.min(Math.max(newZoom, 0.5), 3))
    canvas.renderAll()
  }
}

// Keyboard shortcuts
const onKeyDown = (e) => {
  if (!canvas) return
  
  if (e.key === 'z' && e.ctrlKey) {
    e.preventDefault()
    // Note: fabric.js doesn't have built-in undo/redo, but we can implement it
    console.log('Undo requested')
  } else if (e.key === 'y' && e.ctrlKey) {
    e.preventDefault()
    console.log('Redo requested')
  } else if (e.key === 'Delete' || e.key === 'Backspace') {
    e.preventDefault()
    deleteObject()
  }
}

// Test function to verify canvas is working
const testCanvas = () => {
  if (!canvas) {
    console.error('Canvas not initialized')
    return
  }
  
  try {
    console.log('Testing canvas with a simple rectangle')
    const testRect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 2
    })
    
    canvas.add(testRect)
    canvas.renderAll()
    console.log('Test rectangle added successfully')
    console.log('Canvas objects count:', canvas.getObjects().length)
  } catch (error) {
    console.error('Error in testCanvas:', error)
  }
}

// Toggle placement guides
const togglePlacementGuides = () => {
  showPlacementGuides.value = !showPlacementGuides.value
  
  if (showPlacementGuides.value) {
    // Re-add guides
    addShirtOutline()
  } else {
    // Remove only the guide objects (not user designs)
    const objects = canvas.getObjects()
    const guidesToRemove = objects.filter(obj => 
      obj.selectable === false && 
      obj.evented === false && 
      (obj.fill === 'rgba(212, 18, 125, 0.1)' || 
       obj.fill === 'rgba(255, 122, 0, 0.1)' || 
       obj.fill === 'rgba(10, 58, 71, 0.1)' ||
       obj.text === 'Front Design Area' ||
       obj.text === 'Back Design Area' ||
       obj.text === 'Sleeve Areas')
    )
    
    guidesToRemove.forEach(guide => {
      canvas.remove(guide)
    })
    
    // Clear warnings and red borders when guides are hidden
    showWarning.value = false
    objects.forEach(obj => {
      if (obj.stroke === '#e53e3e') {
        obj.set('stroke', null)
        obj.set('strokeWidth', 0)
      }
    })
    
    canvas.renderAll()
  }
}

// Toggle polygon drawing mode
const togglePolygonMode = () => {
  isDrawingPolygon.value = !isDrawingPolygon.value
  if (!isDrawingPolygon.value) {
    customPolygon.value = []
    removePolygonOverlay()
  }
}

// Finish polygon
const finishPolygon = () => {
  isDrawingPolygon.value = false
  drawPolygonOverlay()
}

// Canvas click handler for polygon drawing
const onCanvasClick = (e) => {
  if (!isDrawingPolygon.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  customPolygon.value.push({ x, y })
  drawPolygonOverlay()
}

// Draw polygon overlay
const drawPolygonOverlay = () => {
  removePolygonOverlay()
  if (customPolygon.value.length < 2) return
  const points = customPolygon.value.map(pt => ({ x: pt.x, y: pt.y }))
  polygonOverlay = new fabric.Polygon(points, {
    fill: 'rgba(0, 150, 255, 0.1)',
    stroke: '#0a3a47',
    strokeWidth: 2,
    selectable: false,
    evented: false
  })
  canvas.add(polygonOverlay)
  canvas.bringToFront(polygonOverlay)
  // Bring user objects to front
  canvas.getObjects().forEach(obj => {
    if (obj.selectable !== false || obj.evented !== false) {
      canvas.bringToFront(obj)
    }
  })
  canvas.renderAll()
}

const removePolygonOverlay = () => {
  if (polygonOverlay) {
    canvas.remove(polygonOverlay)
    polygonOverlay = null
    canvas.renderAll()
  }
}

// Point-in-polygon algorithm
function pointInPolygon(x, y, polygon) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y
    const xj = polygon[j].x, yj = polygon[j].y
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi + 0.00001) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

// Update checkPlacement to use polygon if defined
const checkPlacement = (object) => {
  if (!object || !showPlacementGuides.value || typeof maskCtx === 'undefined' || !maskCtx) return true;
  // If custom polygon exists, use it
  if (customPolygon.value.length >= 3) {
    const objBounds = object.getBoundingRect()
    const points = [
      [objBounds.left, objBounds.top],
      [objBounds.left + objBounds.width, objBounds.top],
      [objBounds.left, objBounds.top + objBounds.height],
      [objBounds.left + objBounds.width, objBounds.top + objBounds.height],
      [objBounds.left + objBounds.width / 2, objBounds.top + objBounds.height / 2]
    ]
    for (const [x, y] of points) {
      if (!pointInPolygon(x, y, customPolygon.value)) {
        return false
      }
    }
    return true
  }
  // Get object bounds
  const objBounds = object.getBoundingRect()
  // Check corners and center
  const points = [
    [objBounds.left, objBounds.top],
    [objBounds.left + objBounds.width, objBounds.top],
    [objBounds.left, objBounds.top + objBounds.height],
    [objBounds.left + objBounds.width, objBounds.top + objBounds.height],
    [objBounds.left + objBounds.width / 2, objBounds.top + objBounds.height / 2]
  ]
  for (const [x, y] of points) {
    const pixel = maskCtx.getImageData(Math.round(x), Math.round(y), 1, 1).data
    if (pixel[3] < 128) {
      return false // Transparent pixel
    }
  }
  return true
}

// Update object border based on placement
const updateObjectBorder = (object) => {
  if (!object) return
  
  const isInSafeArea = checkPlacement(object)
  
  if (isInSafeArea) {
    // Remove red border if it exists
    object.set('stroke', null)
    object.set('strokeWidth', 0)
    showWarning.value = false
  } else {
    // Add red border
    object.set('stroke', '#e53e3e')
    object.set('strokeWidth', 3)
    showWarning.value = true
    warningMessage.value = 'Bitte platziere deine Inhalte innerhalb des Rahmens'
  }
  
  canvas.renderAll()
}

// Event listeners for object movement, scaling, rotating
const onObjectMoving = (e) => {
  updateObjectBorder(e.target)
}

const onObjectScaling = (e) => {
  updateObjectBorder(e.target)
}

const onObjectRotating = (e) => {
  updateObjectBorder(e.target)
}

// Lifecycle
onMounted(async () => {
  await nextTick()
  await initCanvas()
  
  // Add resize listener
  window.addEventListener('resize', handleResize)
  // Add click event for polygon drawing
  canvasRef.value.addEventListener('click', onCanvasClick)
})

onUnmounted(() => {
  if (canvas) {
    canvas.dispose()
  }
  window.removeEventListener('resize', handleResize)
  if (canvasRef.value) canvasRef.value.removeEventListener('click', onCanvasClick)
})

// Handle canvas resize
const handleResize = () => {
  if (canvas && canvasRef.value) {
    const newWidth = canvasRef.value.offsetWidth
    canvas.setWidth(newWidth)
    canvas.renderAll()
  }
}
</script>

<style scoped>
.btn {
  @apply transition font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 rounded-lg;
}

.btn-secondary {
  @apply transition font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700;
}

input[type="range"] {
  @apply w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none h-4 w-4 rounded-full bg-[#D8127D] cursor-pointer;
}

input[type="range"]::-moz-range-thumb {
  @apply h-4 w-4 rounded-full bg-[#D8127D] cursor-pointer border-0;
}
</style> 