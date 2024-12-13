// Calculation History Array
let calculationHistory = [];

// Regular Expression for Date Validation
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validate a single date input
 * @param {string} dateString - Date to validate
 * @param {string} inputId - ID of the input field
 * @returns {boolean} - Validation result
 */
function validateDate(dateString, inputId) {
    const errorSpan = document.getElementById(`${inputId}Error`);
    errorSpan.textContent = '';

    // Check regex pattern
    if (!dateRegex.test(dateString)) {
        errorSpan.textContent = 'Invalid date format. Use YYYY-MM-DD';
        return false;
    }

    // Check if date is valid
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        errorSpan.textContent = 'Invalid date';
        return false;
    }

    return true;
}

/**
 * Calculate days between two dates
 * @param {string} date1 - First date string
 * @param {string} date2 - Second date string
 * @returns {number} - Number of days between dates
 */
function calculateDateDifference(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Update calculation history
 * @param {string} date1 - First date
 * @param {string} date2 - Second date
 * @param {number} difference - Days difference
 */
function updateCalculationHistory(date1, date2, difference) {
    const calculation = { date1, date2, difference };
    calculationHistory.unshift(calculation);
    
    // Keep only last 5 calculations
    calculationHistory = calculationHistory.slice(0, 5);

    // Update history display
    const historyList = document.getElementById('calculationHistory');
    historyList.innerHTML = '';
    calculationHistory.forEach(calc => {
        const li = document.createElement('li');
        li.textContent = `${calc.date1} to ${calc.date2}: ${calc.difference} days`;
        historyList.appendChild(li);
    });

    // Save to localStorage
    localStorage.setItem('dateCalculationHistory', JSON.stringify(calculationHistory));
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dateDiffForm');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultContainer = document.getElementById('resultContainer');

    // Retrieve stored history
    const storedHistory = localStorage.getItem('dateCalculationHistory');
    if (storedHistory) {
        calculationHistory = JSON.parse(storedHistory);
        const historyList = document.getElementById('calculationHistory');
        calculationHistory.forEach(calc => {
            const li = document.createElement('li');
            li.textContent = `${calc.date1} to ${calc.date2}: ${calc.difference} days`;
            historyList.appendChild(li);
        });
    }

    // Real-time input validation
    ['date1', 'date2'].forEach(id => {
        document.getElementById(id).addEventListener('input', (e) => {
            validateDate(e.target.value, id);
        });
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const date1 = document.getElementById('date1').value;
        const date2 = document.getElementById('date2').value;

        // Validate both dates
        const date1Valid = validateDate(date1, 'date1');
        const date2Valid = validateDate(date2, 'date2');

        if (date1Valid && date2Valid) {
            // Show loading spinner
            loadingSpinner.style.display = 'block';
            resultContainer.innerHTML = '';

            // Simulate server processing
            setTimeout(() => {
                const daysDifference = calculateDateDifference(date1, date2);
                
                // Update result
                resultContainer.innerHTML = `
                    <div class="result-box">
                        <p>Dates: ${date1} to ${date2}</p>
                        <p>Days Difference: <strong>${daysDifference} days</strong></p>
                    </div>
                `;

                // Update history
                updateCalculationHistory(date1, date2, daysDifference);

                // Hide loading spinner
                loadingSpinner.style.display = 'none';
            }, 500);
        }
    });

    // Reset Form
    document.getElementById('resetBtn').addEventListener('click', () => {
        ['date1', 'date2'].forEach(id => {
            document.getElementById(`${id}Error`).textContent = '';
        });
        resultContainer.innerHTML = '';
    });
});