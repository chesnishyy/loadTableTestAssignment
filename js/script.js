(function () {
    let wrapper = document.getElementById('wrapper');
    let loading = document.createElement('div');
    let table = document.getElementById('table');

    loading.classList.add('loading');
    wrapper.appendChild(loading);

    let request = new XMLHttpRequest();
    const apiAdress = "https://api.github.com/search/repositories?q=api&per_page=20&page=";
    let pageIndex = 1;
    let url = apiAdress + pageIndex;


    request.open("GET", url, true);
    request.send();
    request.onload = () => {
        if(request.readyState != 4) return;
            if(request.status == 200){

                let data = JSON.parse(request.responseText).items;
                let newData = data.map( item => [item.id, item.full_name, item.owner.login, item.language, item.forks, item.score]);
                loading.classList.add('hide');
                table.classList.remove('hide');
                createTable(newData);
            }
            else {
                handleError(request.statusText);
            }
    }

    let createTable = (data) => {
        let tbody = document.createElement('tbody');
        table.appendChild(tbody);
        data.forEach((item) => {
            let tr = document.createElement('tr');

            tbody.appendChild(tr);
            item.forEach((it) => {
                let td = document.createElement('td');
                td.innerHTML = it;
                tr.appendChild(td);
            });
        });
        wrapper.appendChild(table);
    }

    let handleError = (message) => alert("Error: " + message);
    let thead = document.getElementById('table-head');

    thead.addEventListener('click', (e) => {
        if(e.target.tagName != 'TH') return;
        sortTable(e.target.cellIndex, e.target.getAttribute('data-type'));
    });

    let sortTable = (colNum, type) => {
        let tbody = table.getElementsByTagName('tbody')[0];
        let rowsArray = [].slice.call(tbody.rows);
        let compare;

        switch (type) {
            case 'number':
                compare = (rowA, rowB) => rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
                break;
            case 'string':
                compare = (rowA, rowB) => rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
                break;
        }

        rowsArray.sort(compare);
        rowsArray.forEach(item => tbody.appendChild(item));
        table.appendChild(tbody);
    }


    let loadNext = (adress, index) => {

        if(pageIndex >= 1){
            prev.classList.remove('disabled');
            prev.addEventListener('click', handlerPrev);
        }

        let nextUrl = adress + (index + 1);

        let request = new XMLHttpRequest();
        request.open("GET", nextUrl, true);
        request.send();
        request.onload = () => {
            if(request.readyState != 4) return;
            if(request.status == 200){
                let data = JSON.parse(request.responseText).items;
                let newData = data.map( item => [item.id, item.full_name, item.owner.login, item.language, item.forks, item.score]);
                let tbody = document.getElementsByTagName('tbody')[0];
                pageIndex++;
                url = nextUrl;
                page.innerHTML = '-' + pageIndex + '-';
                table.removeChild(tbody);
                loading.classList.add('hide');
                createTable(newData);

            }
            else {
                handleError(request.statusText);
            }
        }
    }

    let loadPrev = (adress, index) => {

        if(pageIndex <= 2){
            prev.classList.add('disabled');
            prev.removeEventListener('click',handlerPrev);
        }
        let prevUrl = adress + (index - 1);

        let request = new XMLHttpRequest();
        request.open("GET", prevUrl, true);
        request.send();
        request.onload = () => {
            if(request.readyState != 4) return;
            if(request.status == 200){
                let data = JSON.parse(request.responseText).items;
                let newData = data.map( item => [item.id, item.full_name, item.owner.login, item.language, item.forks, item.score]);
                let tbody = document.getElementsByTagName('tbody')[0];
                pageIndex--;
                url = prevUrl;
                page.innerHTML = '-' + pageIndex + '-';
                table.removeChild(tbody);
                loading.classList.add('hide');
                createTable(newData);
            }
            else {
                handleError(request.statusText);
            }
        }
    }
    let prev = document.getElementsByClassName('pagination')[0].children[0];
    let next = document.getElementsByClassName('pagination')[0].children[2];
    let page = document.getElementsByClassName('pagination')[0].children[1];

    next.addEventListener('click', () => {
        loading.classList.remove('hide');
        loadNext(apiAdress, pageIndex);
    });

    let handlerPrev = () => {
        loading.classList.remove('hide');
        loadPrev(apiAdress, pageIndex);
    }

})();
