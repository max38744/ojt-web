// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';


// 서버에서 데이터를 가져오는 함수
async function fetchChartData() {
  try {
    const response = await fetch('/process_response'); // 서버 엔드포인트로 요청
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

// Bar Chart Example
async function renderBarChart() {
  const ctx = document.getElementById("myBarChart");

  // 서버로부터 데이터 가져오기
  const chartBarData = await fetchChartData();

  if (chartBarData) {
    // Chart.js 초기화
    var myBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartBarData.labels, // 서버에서 받은 라벨 데이터
        datasets: [{
          label: "Revenue",
          backgroundColor: "rgba(2,117,216,1)",
          borderColor: "rgba(2,117,216,1)",
          data: chartBarData.values, // 서버에서 받은 데이터 값
        }],
      },
      options: {
        scales: {
          xAxes: [{
            time: {
              unit: 'month'
            },
            gridLines: {
              display: false
            },
            ticks: {
              maxTicksLimit: 6
            }
          }],
          yAxes: [{
            ticks: {
              min: 0,
              max: Math.max(...chartBarData.values), // 데이터 값 기반으로 y축 최대값 설정
              maxTicksLimit: 5
            },
            gridLines: {
              display: true
            }
          }],
        },
        legend: {
          display: false
        }
      }
    });
  } else {
    console.error("Chart data is not available. Unable to render chart.");
  }
}

// 차트 렌더링 실행
renderBarChart();
