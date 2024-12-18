// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

let myPieChart; // 파이 차트 변수

// 서버에서 데이터를 가져오는 함수
async function fetchPieData(label = null) {
  try {
    // label이 존재하면 쿼리 파라미터로 서버에 전달
    const url = label
    ? `/process_response?resource=${encodeURIComponent(ResourceManager.getResource())}&label=${encodeURIComponent(label)}`
    : `/process_response?resource=${encodeURIComponent(ResourceManager.getResource())}`;

    const response = await fetch(url);

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

// 파이 차트를 그리는 함수
async function renderPieChart(chartData) {
  const ctx = document.getElementById("myPieChart");
  if (chartData) {
    // 기존 차트가 존재하면 삭제 후 다시 그리기
    if (myPieChart) {
      myPieChart.destroy();
    }

    // Chart.js 초기화
    myPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: chartData.labels, // 서버에서 받은 라벨 데이터
        datasets: [{
          data: chartData.values, // 서버에서 받은 데이터 값
          backgroundColor: chartData.colors || ['#007bff', '#dc3545', '#ffc107', '#28a745'], // 색상 설정
        }],
      },
    });
  } else {
    console.error("Chart data is not available. Unable to render pie chart.");
  }
}

// 라벨을 기반으로 파이 차트를 업데이트하는 함수
async function updateChartData(label) {
  console.log(`Updating chart for label: ${label}`);

  // 서버로부터 새로운 데이터를 요청 (label 파라미터 전달)
  const chartData = await fetchPieData(label);

  if (chartData) {
    // 새 데이터로 파이 차트 다시 그리기
    renderPieChart(chartData);
  } else {
    console.error("Failed to update chart data.");
  }
}

// 초기 차트 렌더링 실행
(async () => {
  const initialChartData = await fetchPieData();
  renderPieChart(initialChartData);
})();
