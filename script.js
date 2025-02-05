// Demo product database
const productDatabase = {
    '123456789': {
        name: 'Sample Product',
        price: '$9.99',
        expiry: '2024-12-31',
        instructions: 'Store in a cool, dry place',
        allergies: 'Contains nuts, dairy'
    },
    'DEMO_PRODUCT': {
        name: 'Demo Chocolate Bar',
        price: '$2.99',
        expiry: '2024-06-30',
        instructions: 'Keep in cool place. Consume within 3 days of opening.',
        allergies: 'Contains milk, soy, and may contain traces of nuts',
        image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=600'
    }
};

document.getElementById('startButton').addEventListener('click', startScanner);
document.getElementById('readAloud').addEventListener('click', readProductInfo);
document.getElementById('stopButton').addEventListener('click', stopScanner);

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

function updateProductInfo(code) {
    const product = productDatabase[code] || {
        name: 'Product Not Found',
        price: 'N/A',
        expiry: 'N/A',
        instructions: 'N/A',
        allergies: 'N/A',
        image: ''
    };

    // Update product details
    document.getElementById('productName').textContent = `Name: ${product.name}`;
    document.getElementById('productPrice').textContent = `Price: ${product.price}`;
    document.getElementById('productExpiry').textContent = `Expiration Date: ${product.expiry}`;
    document.getElementById('productInstructions').textContent = `Usage Instructions: ${product.instructions}`;
    document.getElementById('productAllergies').textContent = `Allergies: ${product.allergies}`;

    // Update product image
    const viewport = document.querySelector('.viewport');
    const productImage = document.getElementById('productImage');
    
    if (product.image) {
        productImage.src = product.image;
        viewport.classList.add('product-detected');
        // Stop the scanner after detecting product
        Quagga.stop();
    } else {
        viewport.classList.remove('product-detected');
        productImage.src = '';
    }
}

function readProductInfo() {
    const productInfo = document.getElementById('productDetails').textContent;
    const utterance = new SpeechSynthesisUtterance(productInfo);
    speechSynthesis.speak(utterance);
}
