document.addEventListener("DOMContentLoaded", async () => {
    const tableElement = document.getElementById("datatablesSimple");
    const tbody = tableElement.querySelector("tbody");
    let dataTable;

    // 서버로부터 데이터를 가져오는 함수
    async function fetchTableData() {
        try {
            console.log("Fetching table data...");
            const response = await fetch("/table_response"); // 서버 API 경로
            if (!response.ok) throw new Error("Failed to fetch data");
            const data = await response.json();
            console.log("Data fetched successfully:", data);
            return data || []; // 빈 데이터 방지
        } catch (error) {
            console.error("Error fetching table data:", error);
            return [];
        }
    }

    // 데이터를 기반으로 테이블 렌더링
    async function renderTable() {
        const data = await fetchTableData();

        if (data.length === 0) {
            console.warn("No data available.");
            return;
        }

        // 테이블 초기화
        tbody.innerHTML = "";

        // 데이터 추가
        data.forEach((item, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.time_stamp ?? 'N/A'}</td>
                <td>${index + 1}</td>
                <td>${item.cpu_percent ?? 'N/A'}</td>
                <td>${item.ram_percent ?? 'N/A'}</td>
                <td>${item.read_bytes ?? 'N/A'}</td>
                <td>${item.write_bytes ?? 'N/A'}</td>
                <td>${item.read_count ?? 'N/A'}</td>
                <td>${item.write_count ?? 'N/A'}</td>
                <td>${item.sort_key ?? 'N/A'}</td>
            `;
            tbody.appendChild(tr);
        });

        // 기존 DataTable 인스턴스 제거 및 재생성
        if (dataTable) {
            console.log("Destroying previous DataTable instance...");
            dataTable.destroy();
        }
        console.log("Initializing new DataTable...");
        dataTable = new simpleDatatables.DataTable(tableElement);
    }

    // 초기 테이블 렌더링 실행
    await renderTable();
});
