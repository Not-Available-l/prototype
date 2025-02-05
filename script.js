// Demo product database with Korean entries
const productDatabase = {
    '123456789': {
        name: '샘플 제품',
        price: '₩12,000',
        expiry: '2024-12-31',
        instructions: '서늘하고 건조한 곳에 보관하세요',
        allergies: '견과류, 유제품 포함',
        language: 'ko'
    },
    'DEMO_PRODUCT': {
        name: '데모 초콜릿 바',
        price: '₩3,500',
        expiry: '2024-06-30',
        instructions: '시원한 곳에 보관하세요. 개봉 후 3일 이내 섭취하세요.',
        allergies: '우유, 대두 함유, 견과류 흔적이 있을 수 있음',
        language: 'ko',
        image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=600'
    }
};

document.getElementById('startButton').addEventListener('click', startScanner);
document.getElementById('readAloud').addEventListener('click', readProductInfo);
document.getElementById('stopButton').addEventListener('click', stopScanner);

// Add this variable at the top of the file to store current product code
let currentProductCode = null;

function startScanner() {
    const statusMessage = document.getElementById('statusMessage');
    const scanningAnimation = document.getElementById('scanningAnimation');
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');

    statusMessage.textContent = 'Starting camera...';
    scanningAnimation.style.display = 'block'; // Show animation immediately
    
    // Demo mode: Simulate scanning after 3 seconds
    setTimeout(() => {
        statusMessage.textContent = 'Product detected!';
        scanningAnimation.style.display = 'none'; // Hide animation after detection
        updateProductInfo('DEMO_PRODUCT');
        // Play success sound
        new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV').play();
    }, 3000);

    // Still initialize camera for demo purposes
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#interactive"),
            constraints: {
                facingMode: "environment"
            },
        },
        decoder: {
            readers: ["ean_reader", "ean_8_reader", "code_128_reader", "qr_reader"]
        }
    }, function(err) {
        if (err) {
            statusMessage.textContent = 'Camera starting in demo mode...';
            return;
        }
        Quagga.start();
        startButton.style.display = 'none';
        stopButton.style.display = 'block';
    });

    Quagga.onDetected(function(result) {
        const code = result.codeResult.code;
        statusMessage.textContent = `Code detected: ${code}`;
        scanningAnimation.style.display = 'none'; // Hide animation after detection
        updateProductInfo(code);
        // Optional: Play a success sound
        new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV').play();
    });
}

function stopScanner() {
    Quagga.stop();
    document.getElementById('statusMessage').textContent = 'Scanner stopped';
    document.getElementById('scanningAnimation').style.display = 'none';
    document.getElementById('startButton').style.display = 'block';
    document.getElementById('stopButton').style.display = 'none';
    document.querySelector('.viewport').classList.remove('product-detected');
    document.getElementById('productImage').src = '';
}

async function updateProductInfo(code) {
    currentProductCode = code; // Store the current product code
    const product = productDatabase[code] || {
        name: 'Product Not Found',
        price: 'N/A',
        expiry: 'N/A',
        instructions: 'N/A',
        allergies: 'N/A',
        image: '',
        language: 'en'
    };

    // Show language selection if product is in Korean
    const languageSelector = document.getElementById('languageSelector');
    if (product.language === 'ko') {
        languageSelector.style.display = 'block';
    } else {
        languageSelector.style.display = 'none';
    }

    // Update product details based on selected language
    await updateProductDisplay(product);

    // Update product image
    const viewport = document.querySelector('.viewport');
    const productImage = document.getElementById('productImage');
    
    if (product.image) {
        productImage.src = product.image;
        viewport.classList.add('product-detected');
        Quagga.stop();
    } else {
        viewport.classList.remove('product-detected');
        productImage.src = '';
    }
}

// Mock translations for demo (bidirectional)
const mockTranslations = {
    // Korean to English
    '샘플 제품': 'Sample Product',
    '서늘하고 건조한 곳에 보관하세요': 'Store in a cool, dry place',
    '견과류, 유제품 포함': 'Contains nuts, dairy products',
    '데모 초콜릿 바': 'Demo Chocolate Bar',
    '시원한 곳에 보관하세요. 개봉 후 3일 이내 섭취하세요.': 'Keep in a cool place. Consume within 3 days after opening.',
    '우유, 대두 함유, 견과류 흔적이 있을 수 있음': 'Contains milk, soy, and may contain traces of nuts',
    // English to Korean (reverse mapping)
    'Sample Product': '샘플 제품',
    'Store in a cool, dry place': '서늘하고 건조한 곳에 보관하세요',
    'Contains nuts, dairy products': '견과류, 유제품 포함',
    'Demo Chocolate Bar': '데모 초콜릿 바',
    'Keep in a cool place. Consume within 3 days after opening.': '시원한 곳에 보관하세요. 개봉 후 3일 이내 섭취하세요.',
    'Contains milk, soy, and may contain traces of nuts': '우유, 대두 함유, 견과류 흔적이 있을 수 있음'
};

async function translateText(text, targetLang) {
    // Simulate network delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTranslations[text] || text;
}

async function updateProductDisplay(product) {
    const selectedLang = document.getElementById('languageSelector').value;
    let displayProduct = { ...product };
    
    // Store original Korean text if not already stored
    if (!displayProduct.originalText) {
        displayProduct.originalText = {
            name: displayProduct.name,
            instructions: displayProduct.instructions,
            allergies: displayProduct.allergies
        };
    }
    
    if (selectedLang === 'en' && product.language === 'ko') {
        // Translate to English
        displayProduct.name = await translateText(displayProduct.originalText.name);
        displayProduct.instructions = await translateText(displayProduct.originalText.instructions);
        displayProduct.allergies = await translateText(displayProduct.originalText.allergies);
    } else if (selectedLang === 'ko' && product.language === 'ko') {
        // Restore original Korean text
        displayProduct.name = displayProduct.originalText.name;
        displayProduct.instructions = displayProduct.originalText.instructions;
        displayProduct.allergies = displayProduct.originalText.allergies;
    }

    // Update display
    document.getElementById('productName').textContent = `Name: ${displayProduct.name}`;
    document.getElementById('productPrice').textContent = `Price: ${displayProduct.price}`;
    document.getElementById('productExpiry').textContent = `Expiration Date: ${displayProduct.expiry}`;
    document.getElementById('productInstructions').textContent = `Usage Instructions: ${displayProduct.instructions}`;
    document.getElementById('productAllergies').textContent = `Allergies: ${displayProduct.allergies}`;
}

// Replace the language selector event listener with this:
document.getElementById('languageSelector').addEventListener('change', function() {
    if (currentProductCode) {
        updateProductInfo(currentProductCode);
    }
});

function readProductInfo() {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const productInfo = document.getElementById('productDetails').textContent;
    const selectedLang = document.getElementById('languageSelector').value;
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(productInfo);
    
    // Function to set voice
    const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        
        if (selectedLang === 'ko') {
            // Find Korean voice
            const koreanVoice = voices.find(voice => 
                voice.lang.includes('ko') || 
                voice.name.includes('Korean') || 
                voice.name.includes('한국')
            );
            
            utterance.voice = koreanVoice;
            utterance.lang = 'ko-KR';
            utterance.rate = 0.9;
        } else {
            // Default English voice
            const englishVoice = voices.find(voice => 
                voice.lang.includes('en') || 
                voice.name.includes('English')
            );
            
            utterance.voice = englishVoice;
            utterance.lang = 'en-US';
            utterance.rate = 1.0;
        }
        
        // Speak the text
        window.speechSynthesis.speak(utterance);
    };

    // Check if voices are already loaded
    if (speechSynthesis.getVoices().length) {
        setVoiceAndSpeak();
    } else {
        // Wait for voices to be loaded
        speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
    }
}
