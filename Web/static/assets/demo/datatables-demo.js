// Call the dataTables jQuery plugin
$(document).ready(function() {
  $('#dataTable').DataTable();
});


document.addEventListener("DOMContentLoaded", async () => {
  const tableElement = document.getElementById("datatablesSimple");

  // 서버로부터 데이터를 가져오는 함수
  async function fetchTableData() {
      try {
          const response = await fetch('/table_response'); // 서버 API URL 입력
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json(); // JSON 데이터 파싱
          return data;
      } catch (error) {
          console.error('Error fetching data:', error);
          return [];
      }
  }

  // 테이블 초기화 및 데이터 채우기
  async function renderTable() {
      const data = await fetchTableData();

      if (data.length === 0) {
          console.warn("No data available to display.");
          return;
      }

      // 테이블의 헤더와 데이터 구조 설정
      const tableHeaders = Object.keys(data[0]); // 첫 번째 항목의 키를 헤더로 사용
      const tableRows = data.map(item => Object.values(item)); // 모든 항목의 값을 배열로 변환

      // 테이블 헤더 추가
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      tableHeaders.forEach(header => {
          const th = document.createElement("th");
          th.textContent = header;
          headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      // 테이블 바디 추가
      const tbody = document.createElement("tbody");
      tableRows.forEach(rowData => {
          const row = document.createElement("tr");
          rowData.forEach(cellData => {
              const td = document.createElement("td");
              td.textContent = cellData;
              row.appendChild(td);
          });
          tbody.appendChild(row);
      });

      // 기존 테이블 내용 초기화 후 새로운 데이터 삽입
      tableElement.innerHTML = ""; 
      tableElement.appendChild(thead);
      tableElement.appendChild(tbody);

      // DataTables 초기화
      new simpleDatatables.DataTable(tableElement);
  }

  // 테이블 렌더링 실행
  await renderTable();
});
