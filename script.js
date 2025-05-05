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
            
            // Calculate investment growth
            function calculateInvestmentGrowth(initialInvestment, monthlyContribution, avgAnnualReturn, returnVariance, years) {
                const monthlyRate = avgAnnualReturn / 100 / 12;
                const totalMonths = years * 12;
                
                let balance = initialInvestment;
                let totalContributions = initialInvestment;
                const yearlyData = [{
                    year: 0,
                    balance: balance,
                    contributions: totalContributions,
                    interest: 0
                }];
                
                for (let year = 1; year <= years; year++) {
                    const yearReturn = getRandomReturn(avgAnnualReturn, returnVariance) / 100;
                    const monthlyReturnRate = yearReturn / 12;
                    
                    let yearStartBalance = balance;
                    
                    for (let month = 1; month <= 12; month++) {
                        // Add monthly contribution
                        balance += monthlyContribution;
                        totalContributions += monthlyContribution;
                        
                        // Apply monthly return
                        const interestEarned = balance * monthlyReturnRate;
                        balance += interestEarned;
                    }
                    
                    yearlyData.push({
                        year: year,
                        balance: balance,
                        contributions: totalContributions,
                        interest: balance - totalContributions
                    });
                }
                
                return {
                    finalBalance: balance,
                    totalContributions: totalContributions,
                    totalInterest: balance - totalContributions,
                    roi: ((balance - totalContributions) / totalContributions) * 100,
                    yearlyData: yearlyData
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
                chartContainer.innerHTML = '';
                chartContainer.appendChild(ctx);
                
                const years = data.yearlyData.map(d => `Year ${d.year}`);
                const balances = data.yearlyData.map(d => d.balance);
                const contributions = data.yearlyData.map(d => d.contributions);
                
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
                                fill: true
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
                                position: 'top'
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
            
            // Handle calculation
            calculateBtn.addEventListener('click', function() {
                // Get input values
                const initialInvestment = parseFloat(initialInvestmentInput.value) || 0;
                const monthlyContribution = parseFloat(monthlyContributionInput.value) || 0;
                const annualReturn = parseFloat(annualReturnInput.value) || 0;
                const returnVariance = parseFloat(returnVarianceInput.value) || 0;
                const investmentPeriod = parseInt(investmentPeriodInput.value) || 0;
                
                // Validate inputs
                if (initialInvestment < 0 || monthlyContribution < 0 || annualReturn < 0 || returnVariance < 0 || investmentPeriod <= 0) {
                    alert('Please enter valid values.');
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
                
                // Show results card
                resultsCard.style.display = 'block';
                
                // Create chart
                createChart(result);
                
                // Scroll to results
                resultsCard.scrollIntoView({ behavior: 'smooth' });
            });
            
            // Initialize with default calculation
            calculateBtn.click();
        });
