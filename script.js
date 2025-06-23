document.addEventListener('DOMContentLoaded', function() {
    // scroll per capitoli
    document.querySelectorAll('.capitolo_link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // trasparenza scroll
    const pngTitolo = document.querySelector('.png_titolo');
    const navigazione = document.querySelector('.navigazione');
    
    window.addEventListener('scroll', function() {
        // parallasse png titolo
        const scrollPosition = window.scrollY;
        pngTitolo.style.transform = `translateY(${scrollPosition * 0.3}px)`;
        
        // opacità navigazione
        if (scrollPosition > 100) {
            navigazione.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            navigazione.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        }
    });

    // trasparenza interattiva
    const trasparenza = document.querySelector('.trasparenza');
    if (trasparenza) {
        trasparenza.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
            const opacity = 1 - (distance / maxDistance);
            
            this.style.opacity = opacity;
        });
        
        trasparenza.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
        });
    }

    // Initialize compression explorer
    setupCompressionExplorer();
    
    // Initialize alpha channel studio
    setupAlphaStudio();
});

function setupCompressionExplorer() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.compression-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filterType = this.getAttribute('data-filter');
            updateFilterDemo(filterType);
        });
    });
    
    // Compression slider
    const compressionSlider = document.querySelector('.compression-slider');
    if (compressionSlider) {
        compressionSlider.addEventListener('input', function() {
            updateCompressionStats(this.value);
        });
    }
    
    // Initialize
    updateFilterDemo('none');
    updateCompressionStats(6);
}

function updateFilterDemo(filterType) {
    const originalGrid = document.querySelector('.pixel-grid.original');
    const filteredGrid = document.querySelector('.pixel-grid.filtered');
    const explanationText = document.querySelector('.explanation-text');
    const meterBar = document.querySelector('.meter-bar');
    const efficiencyValue = document.querySelector('.efficiency-value');
    
    // Clear grids
    originalGrid.innerHTML = '';
    filteredGrid.innerHTML = '';
    
    // Generate sample pixels
    const rows = 8;
    const cols = 8;
    let efficiency = 0;
    
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            // Original pixel
            const originalPixel = document.createElement('div');
            originalPixel.classList.add('pixel');
            
            // Filtered pixel
            const filteredPixel = document.createElement('div');
            filteredPixel.classList.add('pixel');
            
            // Apply different colors based on filter type
            let r, g, b;
            let filteredValue = 0;
            
            switch(filterType) {
                case 'none':
                    r = x * 36;
                    g = y * 36;
                    b = 128;
                    filteredValue = (r + g + b) / 3;
                    explanationText.textContent = "Nessun filtraggio. I dati originali vengono inviati direttamente al compressore.";
                    efficiency = 0;
                    break;
                case 'sub':
                    r = x * 36;
                    g = y * 36;
                    b = 128;
                    filteredValue = x > 0 ? (r + g + b) / 3 - ((x-1) * 36 + y * 36 + 128) / 3 : 0;
                    explanationText.textContent = "Sottrae il valore del pixel a sinistra. Efficace per gradienti orizzontali.";
                    efficiency = 30;
                    break;
                case 'up':
                    r = y * 36;
                    g = x * 36;
                    b = 128;
                    filteredValue = y > 0 ? (r + g + b) / 3 - (y * 36 + (x-1) * 36 + 128) / 3 : 0;
                    explanationText.textContent = "Sottrae il valore del pixel sopra. Efficace per gradienti verticali.";
                    efficiency = 40;
                    break;
                case 'average':
                    r = Math.floor((x + y) * 18);
                    g = Math.floor((x + y) * 18);
                    b = 128;
                    filteredValue = (r + g + b) / 3;
                    explanationText.textContent = "Media dei pixel a sinistra e sopra. Buon compromesso generale.";
                    efficiency = 60;
                    break;
                case 'paeth':
                    r = Math.abs(x - y) * 36;
                    g = Math.abs(8 - x - y) * 36;
                    b = 128;
                    filteredValue = (r + g + b) / 3;
                    explanationText.textContent = "Predittore Paeth (sinistra, sopra, diagonale). Spesso il più efficiente.";
                    efficiency = 80;
                    break;
            }
            
            // Set pixel colors
            originalPixel.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            filteredPixel.style.backgroundColor = `rgb(${filteredValue}, ${filteredValue + 50}, ${filteredValue + 100})`;
            
            originalGrid.appendChild(originalPixel);
            filteredGrid.appendChild(filteredPixel);
        }
    }
    
    // Update efficiency meter
    meterBar.style.width = `${efficiency}%`;
    efficiencyValue.textContent = efficiency;
}

function updateCompressionStats(level) {
    const statValues = document.querySelectorAll('.stat-value');
    
    // Calculate values based on level
    const reduction = 70 - (level * 5);
    const ratio = (1 + (level * 0.2)).toFixed(2);
    
    statValues[0].textContent = reduction;
    statValues[1].textContent = ratio;
}

function setupAlphaStudio() {
    // Background selector
    const bgBtns = document.querySelectorAll('.bg-btn');
    const canvasBgs = document.querySelectorAll('.canvas-bg');
    
    bgBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const bgType = this.getAttribute('data-bg');
            
            // Update active button
            bgBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected background
            canvasBgs.forEach(bg => {
                bg.classList.remove('active');
                if (bg.classList.contains(bgType)) {
                    bg.classList.add('active');
                }
            });
        });
    });
    
    // Shape selector
    const shapeSelect = document.querySelector('.shape-select');
    const alphaObject = document.querySelector('.alpha-object');
    
    shapeSelect.addEventListener('change', function() {
        alphaObject.className = 'alpha-object';
        alphaObject.classList.add(this.value);
    });
    
    // Opacity slider
    const opacitySlider = document.querySelector('.opacity-slider');
    const opacityValue = document.querySelector('.opacity-value');
    
    opacitySlider.addEventListener('input', function() {
        const value = this.value;
        opacityValue.textContent = value;
        alphaObject.style.opacity = value / 100;
    });
    
    // Export button
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            alert('Esportazione PNG simulata. In un\'applicazione reale, verrebbe generato un file PNG con le impostazioni correnti.');
        });
    }
    
    // Initialize
    canvasBgs[0].classList.add('active');
}