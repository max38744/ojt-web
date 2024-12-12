// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// 서버에서 데이터를 가져오는 함수
async function fetchChartData() {
  try {
    const response = await fetch('/data_response'); // 서버 엔드포인트로 요청
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json(); // JSON 형식으로 데이터 파싱
    return data; // 데이터를 반환
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return null;
  }
}


// Area Chart Example
async function renderChart() {
  const ctx = document.getElementById("myAreaChart");

  // 서버로부터 데이터 가져오기
  const chartData = await fetchChartData();

  // 서버에서 데이터가 정상적으로 받아진 경우만 차트 렌더링
  if (chartData) {
    const myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.labels, // 서버에서 받은 라벨 데이터
        datasets: [{
          label: "Sessions",
          lineTension: 0.3,
          backgroundColor: "rgba(2,117,216,0.2)",
          borderColor: "rgba(2,117,216,1)",
          pointRadius: 5,
          pointBackgroundColor: "rgba(2,117,216,1)",
          pointBorderColor: "rgba(255,255,255,0.8)",
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(2,117,216,1)",
          pointHitRadius: 50,
          pointBorderWidth: 2,
          data: chartData.values, // 서버에서 받은 데이터 값
        }],
      },
      options: {
        scales: {
          xAxes: [{
            time: {
              unit: 'date'
            },
            gridLines: {
              display: false
            },
            ticks: {
              maxTicksLimit: 7
            }
          }],
          yAxes: [{
            ticks: {
              min: 0,
              max: 100,
              maxTicksLimit: 5
            },
            gridLines: {
              color: "rgba(0, 0, 0, .125)",
            }
          }],
        },
        legend: {
          display: false
        }
      }
    });
  }
}

// 차트 렌더링 실행
renderChart();
