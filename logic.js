const ASCII_START = 32;
const ASCII_END = 126;
const ASCII_RANGE = ASCII_END - ASCII_START + 1;

/**
 * @param {string} value
 * @returns {string|null} 
 */
function findUnsupportedCharacter(value) {
    for (const character of value) {
        const code = character.charCodeAt(0);

        if (
            character !== "\n" &&
            (code < ASCII_START || code > ASCII_END)
        ) {
            return character;
        }
    }

    return null;
}

/**
 * Validates the input text and key.
 * @param {string} text
 * @param {string} key
 */
function validateTextAndKey(text, key) {
    if (!text) {
        throw new Error("Input text is required.");
    }

    if (!key) {
        throw new Error("A key is required.");
    }

    const unsupportedText = findUnsupportedCharacter(text);
    const unsupportedKey = findUnsupportedCharacter(key);

    if (unsupportedText) {
        throw new Error(
            `Unsupported input character: ${JSON.stringify(unsupportedText)}`
        );
    }

    if (unsupportedKey || key.includes("\n")) {
        throw new Error(
            "The key must contain printable ASCII characters only."
        );
    }
}

/**
 * Core shifting algorithm for encryption and decryption.
 * @param {string} text
 * @param {string} key
 * @param {number} direction 
 * @returns {string} 
 */
function shiftText(text, key, direction) {
    let result = "";
    let keyPosition = 0;

    for (const character of text) {

        if (character === "\n") {
            result += character;
            continue;
        }

        const value = character.charCodeAt(0) - ASCII_START;


        const keyCharacter = key[keyPosition % key.length];
        const shift = keyCharacter.charCodeAt(0) - ASCII_START + 1;

        const transformed =
            (value + direction * shift + ASCII_RANGE) % ASCII_RANGE;

        result += String.fromCharCode(transformed + ASCII_START);

        keyPosition += 1;
    }

    return result;
}

/**
 * Encrypts plaintext using the repeating key cipher.
 * @param {string} text
 * @param {string} key
 * @returns {string}
 */
function encryptText(text, key) {
    validateTextAndKey(text, key);
    return shiftText(text, key, 1);
}

/**
 * Decrypts ciphertext using the repeating key cipher.
 * @param {string} text
 * @param {string} key
 * @returns {string}
 */
function decryptText(text, key) {
    validateTextAndKey(text, key);
    return shiftText(text, key, -1);
}

const TEST_PRESETS = {
    moonBase: {
        message: "Meet me by the moon base at 21:45.",
        key: "ORBIT-7"
    },
    starship: {
        message: "Cargo secured. Set course for Zephyria!",
        key: "NOVA"
    }
};

if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        const inputField = document.getElementById("input-text");
        const outputField = document.getElementById("output-text");
        const keyField = document.getElementById("cipher-key");
        const charCounter = document.getElementById("char-counter") ||
            document.querySelector("span:has-text('CHARS')") ||
            document.querySelector(".space-y-4 span");

        const encryptBtn = document.getElementById("encrypt-btn") ||
            document.querySelector("button.bg-\\[\\#75F0C6\\]");
        const decryptBtn = document.getElementById("decrypt-btn") ||
            document.querySelector("button.bg-\\[\\#7EB6FF\\]");
        const clearBtn = document.getElementById("clear-btn") ||
            document.querySelector("button.bg-\\[\\#FF8C82\\]");

        const moonBaseBtn = document.getElementById("btn-moon-base");
        const starshipBtn = document.getElementById("btn-starship");

        function updateCharCount() {
            if (charCounter && inputField) {
                const count = inputField.value.length;
                charCounter.textContent = `${String(count).padStart(3, "0")} CHARS`;
            }
        }

        if (inputField) {
            inputField.addEventListener("input", updateCharCount);
        }

        if (encryptBtn) {
            encryptBtn.addEventListener("click", () => {
                try {
                    const text = inputField ? inputField.value : "";
                    const key = keyField ? keyField.value : "";
                    const result = encryptText(text, key);
                    if (outputField) outputField.value = result;
                } catch (error) {
                    if (outputField) outputField.value = `[ERROR]: ${error.message}`;
                }
            });
        }

        if (decryptBtn) {
            decryptBtn.addEventListener("click", () => {
                try {
                    const text = inputField ? inputField.value : "";
                    const key = keyField ? keyField.value : "";
                    const result = decryptText(text, key);
                    if (outputField) outputField.value = result;
                } catch (error) {
                    if (outputField) outputField.value = `[ERROR]: ${error.message}`;
                }
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                if (inputField) inputField.value = "";
                if (outputField) outputField.value = "";
                if (keyField) keyField.value = "";
                updateCharCount();
            });
        }

        if (moonBaseBtn) {
            moonBaseBtn.addEventListener("click", () => {
                if (inputField) inputField.value = TEST_PRESETS.moonBase.message;
                if (keyField) keyField.value = TEST_PRESETS.moonBase.key;
                if (outputField) outputField.value = "";
                updateCharCount();
            });
        }

        if (starshipBtn) {
            starshipBtn.addEventListener("click", () => {
                if (inputField) inputField.value = TEST_PRESETS.starship.message;
                if (keyField) keyField.value = TEST_PRESETS.starship.key;
                if (outputField) outputField.value = "";
                updateCharCount();
            });
        }

        updateCharCount();
    });
}


if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        ASCII_START,
        ASCII_END,
        ASCII_RANGE,
        findUnsupportedCharacter,
        validateTextAndKey,
        shiftText,
        encryptText,
        decryptText,
        TEST_PRESETS
    };
}

