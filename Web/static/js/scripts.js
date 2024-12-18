/*!
    * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2023 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    // 
// Scripts
// 

// selectedResource 관리용 클로저
const ResourceManager = (() => {
    let selectedResource = 'resource_1'; // 초기값
  
    // 초기화 함수
    function initialize(resource) {
      if (selectedResource === null) {
        selectedResource = resource;
        console.log(`selectedResource 초기화됨: ${selectedResource}`);
      } else {
        console.warn('selectedResource는 이미 초기화되었습니다.');
      }
    }
  
    // 값 변경 함수
    function setResource(resource) {
      selectedResource = resource;
      console.log(`selectedResource 변경됨: ${selectedResource}`);
    }
  
    // 값 가져오기 함수
    function getResource() {
      return selectedResource;
    }
  
    return {
      initialize,
      setResource,
      getResource,
    };
  })();

window.addEventListener('DOMContentLoaded', event => {

    ResourceManager.initialize('resource_1'); // 초기값 설정
    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }
});




// 모든 차트를 업데이트하는 함수
async function updateAllCharts() {
    //const pirData = await fetchChartData();
    //const barData = await fetchChartData();
    if (document.getElementById("datatablesSimple")) {
        console.log("");
    } else {
        console.log("Different Page Detected!");
        const initialChartData = await fetchPieData();
        renderChart();
        renderPieChart(initialChartData);
        const initialBarData = await fetchBarData(); // Bar Chart 데이터 가져오기
        renderBarChart(initialBarData); // Bar Chart 렌더링

    }
}
  

// 드롭다운 변경 이벤트 리스너
document.getElementById("resourceSelector").addEventListener("change", (event) => {
    ResourceManager.setResource(event.target.value);   // 선택된 값 저장
    // 차트 데이터 새로 가져오기 (모든 차트 업데이트)
    updateAllCharts();
});

  