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

// Pie Chart Example
async function renderPieChart() {
  const ctx = document.getElementById("myPieChart");

  // 서버로부터 데이터 가져오기
  const chartData = await fetchChartData();

  if (chartData) {
    // Chart.js 초기화
    var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: chartData.labels, // 서버에서 받은 라벨 데이터
        datasets: [{
          data: chartData.values, // 서버에서 받은 데이터 값
          backgroundColor: chartData.colors || ['#007bff', '#dc3545', '#ffc107', '#28a745'], // 기본 색상 또는 서버에서 받은 색상
        }],
      },
    });
  } else {
    console.error("Chart data is not available. Unable to render pie chart.");
  }
}

// 차트 렌더링 실행
renderPieChart();
