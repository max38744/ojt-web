// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

let myBarChart; // 전역 변수로 차트 인스턴스 저장

// 서버에서 데이터를 가져오는 함수
async function fetchBarData(label = null) {
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

// Bar Chart 그리는 함수
async function renderBarChart(chartData) {
  const ctx = document.getElementById("myBarChart");

  if (chartData) {
    // 기존 차트가 있으면 삭제
    if (myBarChart) {
      myBarChart.destroy();
    }

    // 새 차트 생성
    myBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.labels, // 서버에서 받은 라벨 데이터
        datasets: [{
          label: "Revenue",
          backgroundColor: "rgba(2,117,216,1)",
          borderColor: "rgba(2,117,216,1)",
          data: chartData.values, // 서버에서 받은 데이터 값
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
              max: Math.max(...chartData.values) || 100, // 데이터 값 기반으로 y축 최대값 설정
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

// 특정 라벨로 차트를 업데이트하는 함수
async function updateBarChart(label) {
  console.log(`Updating bar chart for label: ${label}`);

  // 서버에 요청을 보내고 데이터 가져오기
  const updatedChartData = await fetchBarData(label);

  if (updatedChartData) {
    // 가져온 데이터로 차트 다시 그리기
    renderBarChart(updatedChartData);
  } else {
    console.error("Failed to fetch updated data for the chart.");
  }
}

// 초기 차트 렌더링 실행
(async () => {
  const initialChartData = await fetchBarData();
  renderBarChart(initialChartData);
})();
