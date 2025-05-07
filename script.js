// script.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const initialInvestmentInput = document.getElementById('initial-investment');
    const monthlyContributionInput = document.getElementById('monthly-contribution');
    const annualReturnInput = document.getElementById('annual-return');
    const returnVarianceInput = document.getElementById('return-variance');
    const investmentPeriodInput = document.getElementById('investment-period');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsCard = document.getElementById('results-card');
    
    // Results Elements
    const finalBalanceEl = document.getElementById('final-balance');
    const totalContributionsEl = document.getElementById('total-contributions');
    const totalInterestEl = document.getElementById('total-interest');
    const roiEl = document.getElementById('roi');
    const chartContainer = document.getElementById('chart-container');
    
    // Chart instance
    let investmentChart = null;
    
    // Save form state to localStorage
    function saveFormState() {
        const formState = {
            initialInvestment: initialInvestmentInput.value,
            monthlyContribution: monthlyContributionInput.value,
            annualReturn: annualReturnInput.value,
            returnVariance: returnVarianceInput.value,
            investmentPeriod: investmentPeriodInput.value
        };
        localStorage.setItem('investmentCalculatorState', JSON.stringify(formState));
    }
    
    // Load form state from localStorage
    function loadFormState() {
        const savedState = localStorage.getItem('investmentCalculatorState');
        if (savedState) {
            try {
                const formState = JSON.parse(savedState);
                initialInvestmentInput.value = formState.initialInvestment || 10000;
                monthlyContributionInput.value = formState.monthlyContribution || 500;
                annualReturnInput.value = formState.annualReturn || 10;
                returnVarianceInput.value = formState.returnVariance || 4;
                investmentPeriodInput.value = formState.investmentPeriod || 20;
            } catch (e) {
                console.error('Error loading saved state:', e);
            }
        }
    }
    
    // Function to get random return based on average and variance
    function getRandomReturn(avgReturn, variance) {
        // Using normal distribution approximation
        const min = avgReturn - variance;
        const max = avgReturn + variance;
        return Math.random() * (max - min) + min;
    }
    
    // Format currency
    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    }
    
    // Format percentage
    function formatPercentage(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(value / 100);
    }
    
    // Calculate investment growth with maximum and minimum scenarios
    function calculateInvestmentGrowth(initialInvestment, monthlyContribution, avgAnnualReturn, returnVariance, years) {
        // Calculate base scenario
        let balance = initialInvestment;
        let totalContributions = initialInvestment;
        const yearlyData = [{
            year: 0,
            balance: balance,
            contributions: totalContributions,
            interest: 0
        }];
        
        // Calculate optimistic scenario (average return + variance)
        let maxBalance = initialInvestment;
        let maxTotalContributions = initialInvestment;
        const maxYearlyData = [{
            year: 0,
            balance: maxBalance,
            contributions: maxTotalContributions
        }];
        
        // Calculate pessimistic scenario (average return - variance)
        let minBalance = initialInvestment;
        let minTotalContributions = initialInvestment;
        const minYearlyData = [{
            year: 0,
            balance: minBalance,
            contributions: minTotalContributions
        }];
        
        for (let year = 1; year <= years; year++) {
            // Base scenario with random fluctuation
            const yearReturn = getRandomReturn(avgAnnualReturn, returnVariance) / 100;
            const monthlyReturnRate = yearReturn / 12;
            
            // Max scenario - use the average return plus variance
            const maxYearReturn = (avgAnnualReturn + returnVariance) / 100;
            const maxMonthlyReturnRate = maxYearReturn / 12;
            
            // Min scenario - use the average return minus variance
            // Make sure we don't go below 0% return
            const minYearReturn = Math.max((avgAnnualReturn - returnVariance), 0) / 100;
            const minMonthlyReturnRate = minYearReturn / 12;
            
            for (let month = 1; month <= 12; month++) {
                // Base scenario
                balance += monthlyContribution;
                totalContributions += monthlyContribution;
                balance += balance * monthlyReturnRate;
                
                // Max scenario
                maxBalance += monthlyContribution;
                maxTotalContributions += monthlyContribution;
                maxBalance += maxBalance * maxMonthlyReturnRate;
                
                // Min scenario
                minBalance += monthlyContribution;
                minTotalContributions += monthlyContribution;
                minBalance += minBalance * minMonthlyReturnRate;
            }
            
            yearlyData.push({
                year: year,
                balance: balance,
                contributions: totalContributions,
                interest: balance - totalContributions
            });
            
            maxYearlyData.push({
                year: year,
                balance: maxBalance,
                contributions: maxTotalContributions
            });
            
            minYearlyData.push({
                year: year,
                balance: minBalance,
                contributions: minTotalContributions
            });
        }
        
        return {
            finalBalance: balance,
            totalContributions: totalContributions,
            totalInterest: balance - totalContributions,
            roi: ((balance - totalContributions) / totalContributions) * 100,
            yearlyData: yearlyData,
            maxYearlyData: maxYearlyData,
            minYearlyData: minYearlyData,
            maxFinalBalance: maxBalance,
            minFinalBalance: minBalance
        };
    }
    
    // Create a chart to visualize investment growth
    function createChart(data) {
        if (investmentChart) {
            investmentChart.destroy();
        }
        
        const ctx = document.createElement('canvas');
        ctx.id = 'investment-chart';
        ctx.width = 400;
        ctx.height = 200;
        // Add alt text for better accessibility and SEO
        ctx.setAttribute('aria-label', 'Investment growth chart showing balance, maximum potential, and minimum potential over time');
        
        chartContainer.innerHTML = '';
        chartContainer.appendChild(ctx);
        
        const years = data.yearlyData.map(d => `Year ${d.year}`);
        const balances = data.yearlyData.map(d => d.balance);
        const contributions = data.yearlyData.map(d => d.contributions);
        const maxBalances = data.maxYearlyData.map(d => d.balance);
        const minBalances = data.minYearlyData.map(d => d.balance);
        
        investmentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Total Balance',
                        data: balances,
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        tension: 0.1,
                        fill: false
                    },
                    {
                        label: 'Maximum Potential',
                        data: maxBalances,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderDash: [5, 5],
                        tension: 0.1,
                        fill: false
                    },
                    {
                        label: 'Minimum Potential',
                        data: minBalances,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderDash: [5, 5],
                        tension: 0.1,
                        fill: false
                    },
                    {
                        label: 'Total Contributions',
                        data: contributions,
                        borderColor: '#4ade80',
                        backgroundColor: 'rgba(74, 222, 128, 0.1)',
                        tension: 0.1,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + formatCurrency(context.raw);
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                        onClick: function(e, legendItem, legend) {
                            // Default toggle behavior
                            Chart.defaults.plugins.legend.onClick.call(this, e, legendItem, legend);
                            // Track user interaction for analytics (if implemented)
                            if (typeof gtag !== 'undefined') {
                                gtag('event', 'toggle_chart_data', {
                                    'dataset': legendItem.text
                                });
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000000) {
                                    return '$' + (value / 1000000).toFixed(1) + 'M';
                                } else if (value >= 1000) {
                                    return '$' + (value / 1000).toFixed(1) + 'K';
                                }
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Form validation
    function validateInputs() {
        const initialInvestment = parseFloat(initialInvestmentInput.value) || 0;
        const monthlyContribution = parseFloat(monthlyContributionInput.value) || 0;
        const annualReturn = parseFloat(annualReturnInput.value) || 0;
        const returnVariance = parseFloat(returnVarianceInput.value) || 0;
        const investmentPeriod = parseInt(investmentPeriodInput.value) || 0;
        
        // Create validation feedback divs if they don't exist
        const inputs = [initialInvestmentInput, monthlyContributionInput, annualReturnInput, returnVarianceInput, investmentPeriodInput];
        
        let isValid = true;
        
        // Remove any existing error messages
        document.querySelectorAll('.validation-message').forEach(el => el.remove());
        
        if (initialInvestment < 0) {
            addValidationMessage(initialInvestmentInput, 'Initial investment cannot be negative');
            isValid = false;
        }
        
        if (monthlyContribution < 0) {
            addValidationMessage(monthlyContributionInput, 'Monthly contribution cannot be negative');
            isValid = false;
        }
        
        if (annualReturn < 0) {
            addValidationMessage(annualReturnInput, 'Annual return cannot be negative');
            isValid = false;
        }
        
        if (returnVariance < 0) {
            addValidationMessage(returnVarianceInput, 'Return variance cannot be negative');
            isValid = false;
        }
        
        if (investmentPeriod <= 0) {
            addValidationMessage(investmentPeriodInput, 'Investment period must be greater than 0');
            isValid = false;
        }
        
        return isValid;
    }
    
    function addValidationMessage(inputElement, message) {
        const validationDiv = document.createElement('div');
        validationDiv.className = 'validation-message';
        validationDiv.textContent = message;
        validationDiv.style.color = '#e11d48';
        validationDiv.style.fontSize = '0.75rem';
        validationDiv.style.marginTop = '0.25rem';
        
        // Add after the input wrapper
        inputElement.closest('.form-group').appendChild(validationDiv);
    }
    
    // Handle calculation
    calculateBtn.addEventListener('click', function() {
        // Change button state to show processing
        const originalButtonText = calculateBtn.textContent;
        calculateBtn.textContent = 'Calculating...';
        calculateBtn.disabled = true;
        
        // Wait a brief moment to show the calculating state
        setTimeout(function() {
            // Get input values
            const initialInvestment = parseFloat(initialInvestmentInput.value) || 0;
            const monthlyContribution = parseFloat(monthlyContributionInput.value) || 0;
            const annualReturn = parseFloat(annualReturnInput.value) || 0;
            const returnVariance = parseFloat(returnVarianceInput.value) || 0;
            const investmentPeriod = parseInt(investmentPeriodInput.value) || 0;
            
            // Validate inputs
            if (!validateInputs()) {
                calculateBtn.textContent = originalButtonText;
                calculateBtn.disabled = false;
                return;
            }
            
            // Calculate growth
            const result = calculateInvestmentGrowth(
                initialInvestment,
                monthlyContribution,
                annualReturn,
                returnVariance,
                investmentPeriod
            );
            
            // Update results
            finalBalanceEl.textContent = formatCurrency(result.finalBalance);
            totalContributionsEl.textContent = formatCurrency(result.totalContributions);
            totalInterestEl.textContent = formatCurrency(result.totalInterest);
            roiEl.textContent = formatPercentage(result.roi);
            
            // Add elements to display max and min potential
            const resultGrid = document.querySelector('.results-grid');
            
            // Check if max/min elements already exist and remove them if they do
            const existingMaxMin = document.getElementById('max-min-container');
            if (existingMaxMin) {
                existingMaxMin.remove();
            }
            
            // Create max/min container
            const maxMinContainer = document.createElement('div');
            maxMinContainer.id = 'max-min-container';
            maxMinContainer.className = 'result-section';
            maxMinContainer.style.marginTop = '2rem';
            
            // Create max/min content
            maxMinContainer.innerHTML = `
                <div class="result-header">
                    <h3 class="result-title">Potential Range (Based on ${returnVariance}% Variance)</h3>
                </div>
                <div class="results-grid">
                    <div class="result-card">
                        <div class="result-label">Maximum Potential</div>
                        <div class="result-value" style="color: #10b981;">${formatCurrency(result.maxFinalBalance)}</div>
                    </div>
                    <div class="result-card">
                        <div class="result-label">Minimum Potential</div>
                        <div class="result-value" style="color: #ef4444;">${formatCurrency(result.minFinalBalance)}</div>
                    </div>
                </div>
            `;
            
            // Append max/min container after the chart container
            document.querySelector('#chart-container').parentNode.appendChild(maxMinContainer);
            
            // Save form state
            saveFormState();
            
            // Show results card
            resultsCard.style.display = 'block';
            
            // Create chart
            createChart(result);
            
            // Scroll to results
            resultsCard.scrollIntoView({ behavior: 'smooth' });
            
            // Track successful calculation for analytics (if implemented)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'calculate_investment', {
                    'investment_period': investmentPeriod,
                    'initial_investment_range': getInvestmentRange(initialInvestment),
                    'monthly_contribution_range': getInvestmentRange(monthlyContribution)
                });
            }
            
            // Reset button state
            calculateBtn.textContent = originalButtonText;
            calculateBtn.disabled = false;
        }, 300);
    });
    
    // Helper function for analytics
    function getInvestmentRange(amount) {
        if (amount < 1000) return 'under_1k';
        if (amount < 10000) return '1k_10k';
        if (amount < 100000) return '10k_100k';
        return 'over_100k';
    }
    
    // Add event listeners to inputs for UX improvement
    [initialInvestmentInput, monthlyContributionInput, annualReturnInput,
     returnVarianceInput, investmentPeriodInput].forEach(input => {
        input.addEventListener('input', function() {
            // Clear validation messages when user types
            const validationMessage = this.parentElement.parentElement.querySelector('.validation-message');
            if (validationMessage) {
                validationMessage.remove();
            }
        });
    });
    
    // Load saved form state
    loadFormState();
    
    // Add schema.org structured data for rich results
    function addStructuredData() {
        const scriptElement = document.createElement('script');
        scriptElement.type = 'application/ld+json';
        scriptElement.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialCalculator",
            "name": "S&P 500 Investment Calculator",
            "description": "Calculate potential returns on your investments with our free S&P 500 Investment Calculator based on historical market data."
        });
        document.head.appendChild(scriptElement);
    }
    
    // Add structured data
    addStructuredData();
});
