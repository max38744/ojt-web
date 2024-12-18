// UNIX time을 한국시간으로 변환하는 함수
function convertUnixToKoreanTime(unixTime) {
  const date = new Date(unixTime * 1000); // UNIX time을 밀리초로 변환
  const koreanOffset = 9 * 60 * 60 * 1000; // UTC+9 시간 (밀리초)
  const koreanTime = new Date(date.getTime() + koreanOffset);

  // 한국시간을 'YYYY-MM-DD HH:mm:ss' 형식으로 변환
  const year = koreanTime.getFullYear();
  const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
  const day = String(koreanTime.getDate()).padStart(2, '0');
  const hours = String(koreanTime.getHours()).padStart(2, '0');
  const minutes = String(koreanTime.getMinutes()).padStart(2, '0');
  const seconds = String(koreanTime.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Dictionary 자료형 생성
const timeDictionary = {};
let myLineChart;

async function fetchChartData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return null;
  }
}

async function renderChart() {
  const ctx = document.getElementById("myAreaChart");

  const url = `/data_response?resource=${encodeURIComponent(ResourceManager.getResource())}`;
  const chartData = await fetchChartData(url);
  console.log("Chart data:", chartData);

  if (chartData) {
    if (myLineChart) {
      myLineChart.destroy();
    }

    const utc_label = [];
    chartData.labels.forEach((unixTime) => {
      const koreanTime = convertUnixToKoreanTime(unixTime); // 한국시간으로 변환
      utc_label.push(koreanTime);
      timeDictionary[koreanTime] = unixTime; // 변환된 값을 저장
    });

    myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: utc_label,
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
          data: chartData.values,
        }],
      },
      options: {
        scales: {
          xAxes: [{
            time: { unit: 'date' },
            gridLines: { display: false },
            ticks: { maxTicksLimit: 7 },
          }],
          yAxes: [{
            ticks: { min: 0, max: 100, maxTicksLimit: 5 },
            gridLines: { color: "rgba(0, 0, 0, .125)" },
          }],
        },
        legend: { display: false },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const elementIndex = elements[0]._index; // 최신 Chart.js 버전에 맞게 수정
            const label = timeDictionary[utc_label[elementIndex]];
            console.log(label);
            console.log("utc_label", utc_label);
            console.log("이벤트 요소 : ",elements);
            const value = chartData.values[elementIndex];

            console.log('Clicked data point:', { label, value });

            if (typeof updateChartData === "function") {
              updateChartData(label, value);
              updateBarChart(label, value);
            } else {
              console.error("updateChartData or updateBarChart not defined.");
            }
          }
        },
      },
    });
  } else {
    console.error("Chart data is not available.");
  }
}

// 차트 렌더링 실행
renderChart();
