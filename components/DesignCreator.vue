<template>
  <div class="container mx-auto px-6 py-12">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Designer</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Tools Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white p-4 rounded-lg shadow-md">
            <h2 class="font-semibold mb-4">Werkzeuge</h2>
            <div class="space-y-2">
              <button 
                v-for="tool in ['text', 'image', 'shape']" 
                :key="tool"
                @click="selectedTool = tool"
                :class="['w-full p-2 rounded', selectedTool === tool ? 'bg-[#D8127D] text-white' : 'bg-gray-100']"
              >
                {{ tool.charAt(0).toUpperCase() + tool.slice(1) }}
              </button>
            </div>
          </div>

          <!-- Text Options -->
          <div v-if="selectedTool === 'text'" class="bg-white p-4 rounded-lg shadow-md">
            <h2 class="font-semibold mb-4">Text Optionen</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Farbe</label>
                <input type="color" v-model="textColor" class="w-full h-10">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Größe</label>
                <input type="range" v-model="fontSize" min="8" max="72" class="w-full">
                <span class="text-sm text-gray-500">{{ fontSize }}px</span>
              </div>
              <button @click="addText" class="btn bg-[#D8127D] text-white w-full">
                Text hinzufügen
              </button>
            </div>
          </div>

          <!-- Image Upload -->
          <div v-if="selectedTool === 'image'" class="bg-white p-4 rounded-lg shadow-md">
            <h2 class="font-semibold mb-4">Bild hochladen</h2>
            <input 
              type="file" 
              accept="image/*" 
              @change="handleImageUpload"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D8127D] file:text-white hover:file:bg-[#b30f68]"
            >
          </div>

          <!-- Shape Options -->
          <div v-if="selectedTool === 'shape'" class="bg-white p-4 rounded-lg shadow-md">
            <h2 class="font-semibold mb-4">Formen</h2>
            <div class="space-y-2">
              <button 
                v-for="shape in ['rect', 'circle', 'triangle']" 
                :key="shape"
                @click="addShape(shape)"
                class="w-full p-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                {{ shape.charAt(0).toUpperCase() + shape.slice(1) }}
              </button>
            </div>
          </div>
        </div>

        <!-- Canvas -->
        <div class="lg:col-span-2">
          <div class="bg-white p-4 rounded-lg shadow-md">
            <canvas ref="canvas" id="creator-canvas"></canvas>
          </div>
        </div>

        <!-- Preview & Actions -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white p-4 rounded-lg shadow-md">
            <h2 class="font-semibold mb-4">Vorschau</h2>
            <div class="aspect-square bg-gray-100 rounded-lg mb-4">
              <!-- Preview will be rendered here -->
            </div>
            <div class="space-y-4">
              <button @click="clearCanvas" class="btn border-2 border-gray-300 w-full">
                Neu starten
              </button>
              <button @click="saveDesign" class="btn bg-[#D8127D] text-white w-full">
                Design speichern
              </button>
            </div>
          </div>

          <!-- Object Properties -->
          <div v-if="selectedObject" class="bg-white p-4 rounded-lg shadow-md">
            <h2 class="font-semibold mb-4">Eigenschaften</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Farbe</label>
                <input 
                  type="color" 
                  v-model="textColor" 
                  @input="selectedObject.set('fill', textColor)"
                  class="w-full h-10"
                >
              </div>
              <div v-if="selectedObject.type === 'i-text'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Größe</label>
                <input 
                  type="range" 
                  v-model="fontSize" 
                  min="8" 
                  max="72" 
                  @input="selectedObject.set('fontSize', fontSize)"
                  class="w-full"
                >
                <span class="text-sm text-gray-500">{{ fontSize }}px</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import 'fabric';
const fabric = window.fabric;

const canvas = ref(null);
const selectedTool = ref('text');
const textColor = ref('#000000');
const fontSize = ref(40);
const fontFamily = ref('Arial');
const textContent = ref('');
const uploadedImage = ref(null);
const selectedObject = ref(null);
const history = ref([]);
const historyIndex = ref(-1);

let fabricCanvas = null;

onMounted(() => {
  initCanvas();
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  if (fabricCanvas) {
    fabricCanvas.dispose();
  }
  window.removeEventListener('keydown', handleKeyDown);
});

const initCanvas = async () => {
  await nextTick();
  if (canvas.value) {
    fabricCanvas = new fabric.Canvas('creator-canvas', {
      width: 500,
      height: 500,
      backgroundColor: '#ffffff'
    });

    // Add event listeners
    fabricCanvas.on('selection:created', handleSelection);
    fabricCanvas.on('selection:updated', handleSelection);
    fabricCanvas.on('selection:cleared', () => {
      selectedObject.value = null;
    });

    // Add history tracking
    fabricCanvas.on('object:modified', saveToHistory);
    fabricCanvas.on('object:added', saveToHistory);
    fabricCanvas.on('object:removed', saveToHistory);
  }
};

const handleSelection = (e) => {
  selectedObject.value = e.selected[0];
};

const handleKeyDown = (e) => {
  if (!fabricCanvas) return;

  // Delete selected object
  if (e.key === 'Delete' && selectedObject.value) {
    fabricCanvas.remove(selectedObject.value);
    saveToHistory();
  }

  // Undo/Redo
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
    }
  }
};

const saveToHistory = () => {
  const json = fabricCanvas.toJSON();
  history.value = history.value.slice(0, historyIndex.value + 1);
  history.value.push(json);
  historyIndex.value = history.value.length - 1;
};

const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--;
    fabricCanvas.loadFromJSON(history.value[historyIndex.value], () => {
      fabricCanvas.renderAll();
    });
  }
};

const redo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++;
    fabricCanvas.loadFromJSON(history.value[historyIndex.value], () => {
      fabricCanvas.renderAll();
    });
  }
};

const addText = () => {
  if (!textContent.value || !fabricCanvas) return;
  
  const text = new fabric.Text(textContent.value, {
    left: 100,
    top: 100,
    fontFamily: fontFamily.value,
    fontSize: fontSize.value,
    fill: textColor.value
  });
  
  fabricCanvas.add(text);
  fabricCanvas.setActiveObject(text);
  textContent.value = '';
  saveToHistory();
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file || !fabricCanvas) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    fabric.Image.fromURL(e.target.result, (img) => {
      img.scaleToWidth(200);
      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
      saveToHistory();
    });
  };
  reader.readAsDataURL(file);
};

const clearCanvas = () => {
  fabricCanvas.clear();
  fabricCanvas.backgroundColor = '#ffffff';
  saveToHistory();
};

const saveDesign = () => {
  if (!fabricCanvas) return;
  const dataURL = fabricCanvas.toDataURL({
    format: 'png',
    quality: 1
  });
  // Here you would typically save to your backend
  console.log('Design saved:', dataURL);
  
  // Create a download link
  const link = document.createElement('a');
  link.download = 'design.png';
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Add shape functionality
const addShape = (type) => {
  let shape;
  switch (type) {
    case 'rect':
      shape = new fabric.Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        fill: textColor.value
      });
      break;
    case 'circle':
      shape = new fabric.Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: textColor.value
      });
      break;
    case 'triangle':
      shape = new fabric.Triangle({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        fill: textColor.value
      });
      break;
  }
  if (shape) {
    fabricCanvas.add(shape);
    fabricCanvas.setActiveObject(shape);
    saveToHistory();
  }
};
</script>

<style scoped>
#creator-canvas {
  width: 100% !important;
  height: 500px !important;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}
</style> 