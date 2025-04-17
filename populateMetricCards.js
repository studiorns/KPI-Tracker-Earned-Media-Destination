/**
 * Creates total metric cards for mentions, reach, and sentiment
 */
function createTotalMetricCards() {
  try {
    console.log('Creating total metric cards...');
    
    // Get the total metrics container
    const totalMetricsContainer = document.getElementById('total-metrics-container');
    if (!totalMetricsContainer) {
      console.error("Element with ID 'total-metrics-container' not found");
      return;
    }
    
    // Clear existing cards
    totalMetricsContainer.innerHTML = '';
    
    // Define metrics to display
    const metricsToDisplay = ['Mentions', 'Reach', 'Sentiment'];
    
    // Create YTD cards for each metric FIRST
    metricsToDisplay.forEach(metric => {
      try {
        console.log(`Creating YTD total card for ${metric}...`);
        
        if (!totalMetrics[metric]) {
          console.warn(`No total data found for metric: ${metric}`);
          return;
        }
        
        // Get YTD actual and forecast values
        const ytdActual = totalMetrics[metric].ytdActual[LATEST_MONTH] || 0;
        const ytdForecast = totalMetrics[metric].ytdForecast[LATEST_MONTH] || 0;
        
        // Calculate variance and achievement percentage
        const ytdVariance = ytdActual - ytdForecast;
        const ytdVariancePercent = ytdForecast !== 0 ? (ytdVariance / ytdForecast) * 100 : 0;
        const ytdAchievement = ytdForecast !== 0 ? (ytdActual / ytdForecast) * 100 : 0;
        
        // Create YTD card element
        const ytdCard = document.createElement('div');
        ytdCard.className = 'metric-card total-metric-card ytd-metric-card';
        
        // Determine status classes based on performance
        const ytdVarianceClass = ytdVariancePercent >= 0 ? 'positive' : 'negative';
        const ytdAchievementClass = ytdAchievement >= 100 ? 'positive' : ytdAchievement >= 90 ? 'warning' : 'negative';
        
        // Define icons for each metric
        const metricIcons = {
          'Mentions': 'fa-comment-dots',
          'Reach': 'fa-globe',
          'Sentiment': 'fa-smile'
        };
        
        // Create card content
        ytdCard.innerHTML = `
          <div class="metric-name"><i class="fas ${metricIcons[metric] || 'fa-chart-line'}"></i> YTD Total ${metric}</div>
          <div class="metric-value">${formatNumber(ytdActual, metric)}</div>
          <div class="metric-stats">
            <div class="metric-stat">
              <span class="stat-label">vs YTD Forecast:</span>
              <span class="stat-value ${ytdVarianceClass}">
                ${ytdVariancePercent >= 0 ? '+' : ''}${ytdVariancePercent.toFixed(1)}%
              </span>
            </div>
            <div class="metric-stat">
              <span class="stat-label">YTD Achievement:</span>
              <span class="stat-value ${ytdAchievementClass}">
                ${ytdAchievement.toFixed(1)}%
              </span>
            </div>
          </div>
        `;
        
        // Add card to container
        totalMetricsContainer.appendChild(ytdCard);
        console.log(`Successfully created YTD total card for ${metric}`);
      } catch (error) {
        console.error(`Error creating YTD total card for ${metric}:`, error);
      }
    });
    
    // THEN create a monthly card for each metric
    metricsToDisplay.forEach(metric => {
      try {
        console.log(`Creating total card for ${metric}...`);
        
        if (!totalMetrics[metric]) {
          console.warn(`No total data found for metric: ${metric}`);
          return;
        }
        
        // Get actual and forecast values for the latest month
        const actual = totalMetrics[metric].actual[LATEST_MONTH] || 0;
        const forecast = totalMetrics[metric].forecast[LATEST_MONTH] || 0;
        
        // Get YTD actual and forecast values
        const ytdActual = totalMetrics[metric].ytdActual[LATEST_MONTH] || 0;
        const ytdForecast = totalMetrics[metric].ytdForecast[LATEST_MONTH] || 0;
        
        // Calculate variance and achievement percentage
        const variance = actual - forecast;
        const variancePercent = forecast !== 0 ? (variance / forecast) * 100 : 0;
        const achievement = ytdForecast !== 0 ? (ytdActual / ytdForecast) * 100 : 0;
        
        // Get MoM change
        const momChange = totalMetrics[metric].momChange[LATEST_MONTH] || 0;
        
        // Create card element
        const card = document.createElement('div');
        card.className = 'metric-card total-metric-card';
        
        // Determine status classes based on performance
        const varianceClass = variancePercent >= 0 ? 'positive' : 'negative';
        const achievementClass = achievement >= 100 ? 'positive' : achievement >= 90 ? 'warning' : 'negative';
        const momClass = momChange >= 0 ? 'positive' : 'negative';
        
        // Define icons for each metric
        const metricIcons = {
          'Mentions': 'fa-comment-dots',
          'Reach': 'fa-globe',
          'Sentiment': 'fa-smile'
        };
        
        // Create card content
        card.innerHTML = `
          <div class="metric-name"><i class="fas ${metricIcons[metric] || 'fa-chart-line'}"></i> Monthly Total ${metric}</div>
          <div class="metric-value">${formatNumber(actual, metric)}</div>
          <div class="metric-stats">
            <div class="metric-stat">
              <span class="stat-label">vs Forecast:</span>
              <span class="stat-value ${varianceClass}">
                ${variancePercent >= 0 ? '+' : ''}${variancePercent.toFixed(1)}%
              </span>
            </div>
            <div class="metric-stat">
              <span class="stat-label">MoM:</span>
              <span class="stat-value ${momClass}">
                ${momChange >= 0 ? '+' : ''}${momChange.toFixed(1)}%
              </span>
            </div>
          </div>
        `;
        
        // Add card to container
        totalMetricsContainer.appendChild(card);
        console.log(`Successfully created total card for ${metric}`);
      } catch (error) {
        console.error(`Error creating total card for ${metric}:`, error);
      }
    });
    
    console.log('Total metric cards created successfully');
  } catch (error) {
    console.error('Error in createTotalMetricCards function:', error);
    throw new Error(`Failed to create total metric cards: ${error.message}`);
  }
}

/**
 * Populates the metrics container with cards for each initiative, sub-initiative, metric combination
 */
function populateMetricCards() {
  try {
    console.log('Starting to populate metric cards...');
    
    // Get metrics container
    const metricsContainer = document.getElementById(METRICS_CONTAINER_ID);
    if (!metricsContainer) {
      console.error(`Element with ID '${METRICS_CONTAINER_ID}' not found`);
      return;
    }
    
    // Clear existing cards
    metricsContainer.innerHTML = '';
    
    // Log data structure for debugging
    console.log('Dashboard data structure:', {
      initiatives: dashboardData.initiatives,
      subInitiatives: dashboardData.subInitiatives,
      metrics: dashboardData.metrics
    });
    
    // Create cards for each initiative, sub-initiative, metric combination
    let cardCount = 0;
    
    dashboardData.initiatives.forEach(initiative => {
      console.log(`Processing initiative: ${initiative}`);
      
      if (!dashboardData.structured[initiative]) {
        console.warn(`No structured data found for initiative: ${initiative}`);
        return;
      }
      
      const subInitiatives = Object.keys(dashboardData.structured[initiative]);
      console.log(`Found ${subInitiatives.length} sub-initiatives for ${initiative}`);
      
      subInitiatives.forEach(subInitiative => {
        console.log(`Processing sub-initiative: ${subInitiative}`);
        
        if (!dashboardData.structured[initiative][subInitiative]) {
          console.warn(`No data found for sub-initiative: ${subInitiative}`);
          return;
        }
        
        const metrics = Object.keys(dashboardData.structured[initiative][subInitiative]);
        console.log(`Found ${metrics.length} metrics for ${subInitiative}`);
        
        metrics.forEach(metric => {
          try {
            console.log(`Creating card for ${initiative} - ${subInitiative} - ${metric}`);
            
            const metricData = dashboardData.structured[initiative][subInitiative][metric];
            if (!metricData) {
              console.warn(`No data found for metric: ${metric}`);
              return;
            }
            
            // Get actual and forecast values for the latest month
            const actual = metricData.actual[LATEST_MONTH] || 0;
            const forecast = metricData.forecast[LATEST_MONTH] || 0;
            
            // Get YTD actual and forecast values
            const ytdActual = metricData.ytdActual[LATEST_MONTH] || 0;
            const ytdForecast = metricData.ytdForecast[LATEST_MONTH] || 0;
            
            // Calculate variance and achievement percentage
            const variance = actual - forecast;
            const variancePercent = forecast !== 0 ? (variance / forecast) * 100 : 0;
            const achievement = ytdForecast !== 0 ? (ytdActual / ytdForecast) * 100 : 0;
            
            // Get MoM change
            if (!momChanges[initiative]) {
              console.warn(`No MoM changes found for initiative: ${initiative}`);
              return;
            }
            
            if (!momChanges[initiative][subInitiative]) {
              console.warn(`No MoM changes found for sub-initiative: ${subInitiative}`);
              return;
            }
            
            if (!momChanges[initiative][subInitiative][metric]) {
              console.warn(`No MoM changes found for metric: ${metric}`);
              return;
            }
            
            const momChange = momChanges[initiative][subInitiative][metric][LATEST_MONTH] || 0;
            
            // Create card element
            const card = document.createElement('div');
            card.className = 'metric-card';
            
            // Determine status classes based on performance
            const varianceClass = variancePercent >= 0 ? 'positive' : 'negative';
            const achievementClass = achievement >= 100 ? 'positive' : achievement >= 90 ? 'warning' : 'negative';
            const momClass = momChange >= 0 ? 'positive' : 'negative';
            
            // Define icons for each metric
            const metricIcons = {
              'Mentions': 'fa-comment-dots',
              'Reach': 'fa-globe',
              'Sentiment': 'fa-smile'
            };
            
            // Create card content
            card.innerHTML = `
              <div class="metric-name"><i class="fas ${metricIcons[metric] || 'fa-chart-line'}"></i> ${subInitiative} - ${metric}</div>
              <div class="metric-value">${formatNumber(actual, metric)}</div>
              <div class="metric-stats">
                <div class="metric-stat">
                  <span class="stat-label">vs Forecast:</span>
                  <span class="stat-value ${varianceClass}">
                    ${variancePercent >= 0 ? '+' : ''}${variancePercent.toFixed(1)}%
                  </span>
                </div>
                <div class="metric-stat">
                  <span class="stat-label">MoM:</span>
                  <span class="stat-value ${momClass}">
                    ${momChange >= 0 ? '+' : ''}${momChange.toFixed(1)}%
                  </span>
                </div>
                <div class="metric-stat">
                  <span class="stat-label">YTD Achievement:</span>
                  <span class="stat-value ${achievementClass}">
                    ${achievement.toFixed(1)}%
                  </span>
                </div>
              </div>
            `;
            
            // Add card to container
            metricsContainer.appendChild(card);
            cardCount++;
          } catch (error) {
            console.error(`Error creating card for ${initiative} - ${subInitiative} - ${metric}:`, error);
          }
        });
      });
    });
    
    console.log(`Successfully created ${cardCount} metric cards`);
    
    // If no cards were created, show a message
    if (cardCount === 0) {
      metricsContainer.innerHTML = `
        <div class="metric-card">
          <div class="metric-name"><i class="fas fa-info-circle"></i> No Data</div>
          <div class="metric-value">No metrics available</div>
          <div class="metric-stats">
            <div class="metric-stat">
              <span class="stat-label">Please check the data source.</span>
            </div>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error in populateMetricCards function:', error);
    throw new Error(`Failed to populate metric cards: ${error.message}`);
  }
}
