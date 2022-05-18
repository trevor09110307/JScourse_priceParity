const url = "https://hexschool.github.io/js-filter-data/data.json";
let data = [];
let newData = [];
let page = "1";
let filterValue = "無";
const searchIuput = document.querySelector(".rounded-end");
const searh = document.querySelector(".search");
const showList = document.querySelector(".showList");
const btnGroup = document.querySelector(".button-group");
const pcSelect = document.querySelector("#js-select");
const mbSelect = document.querySelector("#js-moblie-select");
const sortAdvanced = document.querySelectorAll(".sort-advanced");
const jsCropName = document.querySelector("#js-crop-name");
const showPages = document.querySelector(".showPages");
const nowPage = document.querySelector("#now-page");
const nowFilter = document.querySelector("#now-filter");
// -----------

//從api抓回資料並存回變數data,然後呼叫渲染畫面的func
function getData(sortValue) {
  showList.innerHTML = `<tr><td colspan="7" class="text-center p-3">資料載入中.....</td></tr>`;
  axios.get(url).then(function (res) {
    // api抓回資料後執行
    data = res.data; //全部的資料
    let searchName = searchIuput.value.trim();
    let category;

    // 判斷目前是哪個分類-------------------------
    Array.from(btnGroup.children).forEach((item) => {
      if (Array.from(item.classList).indexOf("active") !== -1) {
        category = item.textContent;
      }
    });

    // 判斷search的內容--------------------------
    if (searchName === "") {
      //若沒輸入作物名稱
      if (category === "蔬果") {
        newData = data.filter((item) => {
          return item["種類代碼"] === "N04";
        });
      } else if (category === "水果") {
        newData = data.filter((item) => {
          return item["種類代碼"] === "N05";
        });
      } else if (category === "花卉") {
        newData = data.filter((item) => {
          return item["種類代碼"] === "N06";
        });
      }

      jsCropName.textContent = "";
    } else {
      //有輸入作物名稱
      if (category === "蔬果") {
        newData = data.filter((item) => {
          return (
            item["種類代碼"] === "N04" &&
            item["作物名稱"].indexOf(searchName) !== -1
          );
        });
      } else if (category === "水果") {
        newData = data.filter((item) => {
          return (
            item["種類代碼"] === "N05" &&
            item["作物名稱"].indexOf(searchName) !== -1
          );
        });
      } else if (category === "花卉") {
        newData = data.filter((item) => {
          return (
            item["種類代碼"] === "N06" &&
            item["作物名稱"].indexOf(searchName) !== -1
          );
        });
      }

      jsCropName.textContent = `查看「${searchName}」的比價結果`;
    }
    // ------------------畫面上要render的newData已完成

    //用.sort()把newData排序
    switch (filterValue) {
      case "依上價排序":
      case "上價":
        newData.sort((a, b) => {
          return a["上價"] - b["上價"];
        });
        break;
      case "依中價排序":
      case "中價":
        newData.sort((a, b) => {
          return a["中價"] - b["中價"];
        });
        break;
      case "依下價排序":
      case "下價":
        newData.sort((a, b) => {
          return a["下價"] - b["下價"];
        });
        break;
      case "依平均價排序":
      case "平均價":
        newData.sort((a, b) => {
          return a["平均價"] - b["平均價"];
        });
        break;
      case "依交易量排序":
      case "交易量":
        newData.sort((a, b) => {
          return a["交易量"] - b["交易量"];
        });
        break;
    }

    renderData();
  });
}

// newData中每筆資料組成一個tr
function renderData() {
  let str = "";
  let pagesStr = "";
  let totalPages = Math.ceil(newData.length / 30); //一頁顯示30筆,會有幾頁
  let num = 0; //perPageData二維陣列初始化會用到
  let perPageData = new Array(); // [[第幾頁,第幾筆資料],[第幾頁,第幾筆資料],[第幾頁,第幾筆資料]]
  for (var i = 0; i < totalPages; i++) {
    perPageData[i] = new Array();
    for (var j = 0; j < 30; j++) {
      perPageData[i][j] = newData[num];
      num += 1;
    }
  }
  // 一組資料都沒
  if (newData.length === 0) {
    showList.innerHTML = `<tr><td colspan="7" class="text-center p3">查詢不到當日的交易資訊QQ</td></tr>`;
    pcSelect.value = "排序篩選";
    pagesStr += `<a href="##" class="active" data-page="1">1</a>`;
    showPages.innerHTML = pagesStr;
    return;
  }
  newData = perPageData[page - 1]; //根據來的page參數把newData賦予該頁的資料

  newData.forEach((item) => {
    if (item) {
      //有些最後一頁的資料,陣列中有幾筆會是undefined 加入if判斷式排除undefined的資料
      str += `<tr>
      <td>${item["作物名稱"]}</td>
      <td>${item["市場名稱"]}</td>
      <td>${item["上價"]}</td>
      <td>${item["中價"]}</td>
      <td>${item["下價"]}</td>
      <td>${item["平均價"]}</td>
      <td>${item["交易量"]}</td>
      </tr>`;
    }
  });
  // 根據頁數動態生成page連結，若頁碼跟當前的page一樣就新增active屬性
  if (page > 1) {
    pagesStr += `<a href="##"data-page="${Number(page) - 1}">←</a>`;
  }

  for (i = 1; i <= totalPages; i++) {
    if (i === Number(page) - 2) {
      pagesStr += `<a href="##" data-page="${i}">${i}</a>`;
    } else if (i === Number(page) - 1) {
      pagesStr += `<a href="##" data-page="${i}">${i}</a>`;
    } else if (i === Number(page)) {
      pagesStr += `<a href="##" class="active" data-page="${i}">${i}</a>`;
    } else if (i === Number(page) + 1) {
      pagesStr += `<a href="##" data-page="${i}">${i}</a>`;
    } else if (i === Number(page) + 2) {
      pagesStr += `<a href="##" data-page="${i}">${i}</a>`;
    }
  }

  if (page < totalPages) {
    pagesStr += `<a href="##"data-page="${Number(page) + 1}">→</a`;
  }

  showList.innerHTML = str;
  showPages.innerHTML = pagesStr;
  pcSelect.value = "排序篩選";
  totalPages = 1;
  nowPage.textContent = `目前在第${page}頁`;
  nowFilter.textContent = `目前篩選分類：${filterValue}`;
}

// 點擊分類加上active class
btnGroup.addEventListener("click", (e) => {
  if (e.target.nodeName === "BUTTON") {
    Array.from(btnGroup.children).forEach((item) => {
      item.classList.remove("active");
    });
    e.target.classList += " active";
  }
  filterValue = "無";
  page = "1";
  searchIuput.value = "";
  getData();
});

// 點擊搜尋;
searh.addEventListener("click", (e) => {
  page = "1";
  getData();
});
//切換篩選值
pcSelect.addEventListener("change", (e) => {
  filterValue = e.target.value;
  getData();
});
mbSelect.addEventListener("change", (e) => {
  filterValue = e.target.value;
  getData();
});
// 切換頁碼
showPages.addEventListener("click", (e) => {
  if (e.target.nodeName === "A") {
    page = e.target.getAttribute("data-page");
    getData();
  }
});
