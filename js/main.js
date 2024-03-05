const themeBtn = document.getElementById('themeBtn'),
    debitForm = document.getElementById('debitForm'),
    creditForm = document.getElementById('creditForm'),
    newDebit = document.getElementById('newDebit'),
    newCredit = document.getElementById('newCredit'),
    removers = Array.from(document.querySelectorAll('.remover')),
    info = document.getElementById('info'),
    genarateLedger = document.getElementById('sum'),
    tableArea = document.querySelector('.tableArea'),
    ledgerTable = document.getElementById('ledgerTable'),
    result = document.getElementById('result'),
    transactionText = document.getElementById('transactionText'),
    chartContainer = document.getElementById('charts'),
    auditContainer = document.querySelector('.auditContainer'),
    report = document.getElementById('report'),
    auditDisplayBtn = document.getElementById('displayReport');

window.addEventListener('load', function () {
    var loaderContainer = document.querySelector('.preloader');
    var blur = 10;
    var interval = setInterval(function () {
        blur -= 1;
        loaderContainer.style.backdropFilter = `blur(${blur}px)`;
        if (blur <= 0) clearInterval(interval);
        if (blur <= 0) loaderContainer.style.display = 'none';
    }, 50);
});


let debitArray = [],
    creditArray = [];

let total,
    creditTotal,
    debitTotal,
    grossProfit;

themeBtn.addEventListener('click', function () {
    // This function listenes for a click event on the theme button on top of the page
    // It changes to light and dark theme
    const themeIcon = document.querySelector('.themeIcon');
    document.body.classList.toggle('dark-theme'); // this toggles the dark-theme class from the style sheet on the body tag
    themeBtn.classList.toggle('dark-theme'); // this toggles the dark theme class on the theme changer button
    if (themeBtn.classList.contains('dark-theme')) {
        themeIcon.classList.replace('fa-sun', 'fa-moon'); // when the theme is in dark mode it will change the icon to a moon
    } else {
        themeIcon.classList.replace('fa-moon', 'fa-sun'); //when the theme is in light mode t will change the icon to a sun
    }
});

hideOrShow(transactionText, document.cookie);

if (document.cookie.length > 0) {
    cookieToData(); // If there is any transaction saved then we will show the pie charts
}

function cookieToData() {
    // In this function we are getting all saved transactions and sending the required data to the generateData function for display
    const browserCookies = document.cookie;
    const cookiesArrray = browserCookies.split('; ');
    hideOrShow(transactionText, browserCookies);

    for (var i = 0; i < cookiesArrray.length; i++) {
        const cookie = cookiesArrray[i].split('=');
        const cookieValues = cookie[1].split(',');

        if (cookieValues[0]) {
            const cookieName = cookie[0],
                cookieDebit = cookieValues[1],
                cookieCredit = cookieValues[2],
                cookieTotal = cookieValues[3],
                cookieGross = cookieValues[4],
                cookieDate = cookieValues[5],
                cookieTime = cookieValues[6];

            generateData(cookieName, cookieDebit, cookieCredit, cookieTotal, cookieGross, cookieDate, cookieTime);
        }
    }
}

function hideOrShow(object, array) {
    // This is just a helper function that when called it will take two parameters
    // the object(which is the element we will work on) and the array
    if (array.length > 0) {
        // if the array length is more than Nothing (0) then we will remove the display none on that element
        object.classList.remove('d-none');
    } else {
        // if the array length is 0 then we will add display none on that element
        object.classList.add("d-none");
    }
}

function checkDebitRemovers() {
    // This function is for checking for the number of removers on the debit side
    let debitRemovers = Array.from(document.querySelectorAll('.debitRemover'));

    debitRemovers.forEach(debitRemover => {
        if (debitRemovers.length > 1) {
            // 1. if the number of the removers are more than one then we check
            // 2. if the display none class is on any of the removers then we remove it
            if (debitRemover.classList.contains('d-none')) {
                debitRemover.classList.remove('d-none');
            }
        } else {
            // else if the length is equal to or less than 1 then we add the display none to that remover
            debitRemover.classList.add('d-none');
        }
    });
}

function checkCreditRemovers() {
    // This function is for checking for the number of removers on the credit side
    let creditRemovers = Array.from(document.querySelectorAll('.creditRemover'));

    creditRemovers.forEach(creditRemover => {
        if (creditRemovers.length > 1) {
            // 1. if the number of the removers are more than one then we check
            // 2. if the display none class is on any of the removers then we remove it
            if (creditRemover.classList.contains('d-none')) {
                creditRemover.classList.remove('d-none');
            }
        } else {
            // else if the length is equal to or less than 1 then we add the display none to that remover
            creditRemover.classList.add('d-none');
        }
    });
}

function removeItem(remover) {
    // this function is for the remover
    // when an action is passed on the remover we call this action send actual remover that was clicked
    // now we now get the grand parent element and remove it fron the HTML document
    remover.parentElement.parentElement.remove();
    // Here we call the debit and credit remove checkers to check for number of removers present on the debit and the credit side
    checkDebitRemovers();
    checkCreditRemovers();
}


let countDebitItems = 2,
    countCreditItems = 2;

function newItem(button, type) {
    // This function here is for adding new elements for input of sales
    //  It takes two parameters the [1] button the action was performed on and the [2] the side{Debit or Credit} it was performed 
    if (type == 'debit') {
        let html = `
            <div class="form-group" id="db_${countDebitItems}">
                    <div class="labs">
                        <button type="button" class="remover debitRemover" title="Remove this" onclick="removeItem(this)"><i
                                class="fa fa-times"></i></button>
                    </div>

                    <div class="inputs">
                        <input type="text" class="input labelInput labelDebit" placeholder="Label e.g Sale" oninput="inputation(this)">
                        <input type="number" class="input amountInput amountDebit" placeholder="Amount" oninput="inputation(this)">
                    </div>
                </div>
        `;

        button.parentElement.querySelector('form').insertAdjacentHTML('beforeend', html);
        checkDebitRemovers();
        countDebitItems += 1;
    } else {
        let html = `
        <div class="form-group" id="cr_${countCreditItems}">
                <div class="labs">
                    <button type="button" class="remover creditRemover" title="Remove this" onclick="removeItem(this)"><i
                            class="fa fa-times"></i></button>
                </div>

                <div class="inputs">
                    <input type="text" class="input labelInput labelCredit" placeholder="Label e.g Sale" oninput="inputation(this)">
                    <input type="number" class="input amountInput amountCredit" placeholder="Amount" oninput="inputation(this)">
                </div>
            </div>
    `;

        button.parentElement.querySelector('form').insertAdjacentHTML('beforeend', html);
        checkCreditRemovers();
        countCreditItems += 1;
    }
}

function inputation(input) {
    if (!tableArea.classList.contains('d-none')) {
        tableArea.classList.add('d-none')
    }
    if (!result.classList.contains('d-none')) {
        result.classList.add('d-none')
    }

    if (input.classList.contains('amountInput')) {
        var digitsOnly = input.value.replace(/\D/g, '');

        var digitalChars = '';
        for (let i = 0; i < digitsOnly.length; i++) {
            digitalChars += digitsOnly[i];
        }
        input.value = digitalChars;
    }

}

function noDisplay(html) {
    html.classList.remove('d-none');
    setTimeout(() => {
        html.classList.add('d-none');
    }, 4000)
}

function updateTable(debits, credits) {
    var i, count = Math.max(debits.length, credits.length);
    // console.log(count);

    for (i = 0; i < count; i++) {
        const tableRow = document.createElement('tr'),
            serialNumber = document.createElement('td'),
            debitLabel = document.createElement('td'),
            debitAmount = document.createElement('td'),
            creditLabel = document.createElement('td'),
            creditAmount = document.createElement('td');

        serialNumber.innerHTML = i + 1;

        if (debits[i]) {
            debitLabel.innerHTML = debits[i].key;
            debitAmount.innerHTML = debits[i].value;
        } else {
            debitArray.push({
                key: '',
                value: ''
            });

            debitLabel.innerHTML = '';
            debitAmount.innerHTML = '';
        }

        if (credits[i]) {
            creditLabel.innerHTML = credits[i].key;
            creditAmount.innerHTML = credits[i].value;
        } else {
            creditArray.push({
                key: '',
                value: ''
            });
            creditLabel.innerHTML = '';
            creditAmount.innerHTML = '';
        }
        tableRow.appendChild(serialNumber);
        tableRow.appendChild(debitLabel);
        tableRow.appendChild(debitAmount);
        tableRow.appendChild(creditLabel);
        tableRow.appendChild(creditAmount);
        ledgerTable.appendChild(tableRow);
    }

    document.getElementById('totalDebit').innerHTML = '<i class="fa fa-long-arrow-alt-down"></i> &#8358;' + addCommasToNumber(debitTotal);
    document.getElementById('totalCredit').innerHTML = '<i class="fa fa-long-arrow-alt-up"></i> &#8358;' + addCommasToNumber(creditTotal);

    if (tableArea.classList.contains('d-none')) {
        tableArea.classList.remove('d-none')
    }
    if (result.classList.contains('d-none')) {
        result.classList.remove('d-none')
    }
}

function scrollToPosition(object) {
    const targetPosition = object.offsetTop;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
    });
}

function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

newDebit.addEventListener('click', () => {
    newItem(newDebit, 'debit');
});

newCredit.addEventListener('click', () => {
    newItem(newCredit, 'credit');
});

genarateLedger.addEventListener('click', () => {

    // if (confirm('Generate ledger?')) {

    let inputElements = Array.from(document.querySelectorAll('.input'));
    let isNotEmpty = true;
    inputElements.forEach(inputElement => {

        if (inputElement.value.trim().length < 1) {
            isNotEmpty = false;
            return;
        }
    });

    if (!isNotEmpty) {
        noDisplay(info);
        return;
    } else {
        total = 0,
            creditTotal = 0,
            debitTotal = 0,
            grossProfit = 0,
            debitArray = [],
            creditArray = [];
        ledgerTable.innerHTML = '';

        // For Debit Amounts
        let debitLables = Array.from(document.querySelectorAll('.labelDebit'));
        let debitAmounts = Array.from(document.querySelectorAll('.amountDebit'));

        debitAmounts.forEach(debit => {
            debitTotal += parseFloat(debit.value);
        });

        for (let i = 0; i < debitLables.length; i++) {

            var label = debitLables[i].value;
            var amount = '&#8358;' + addCommasToNumber(debitAmounts[i].value);

            var pair = {
                key: label,
                value: amount
            }
            debitArray.push(pair);
        }

        //  For Credit Amounts

        let creditLables = Array.from(document.querySelectorAll('.labelCredit'));
        let creditAmounts = Array.from(document.querySelectorAll('.amountCredit'));

        creditAmounts.forEach(credit => {
            creditTotal += parseFloat(credit.value);
        });

        for (let i = 0; i < creditLables.length; i++) {
            var label = creditLables[i].value;
            var amount = '&#8358;' + addCommasToNumber(creditAmounts[i].value);

            var pair = {
                key: label,
                value: amount
            }
            creditArray.push(pair);
        }

        updateTable(debitArray, creditArray);
        total = debitTotal + creditTotal;
        grossProfit = creditTotal - debitTotal;
        // For Totals and Gross Income
        const grossIncome = document.getElementById('grossIncome'),
            sumTotal = document.getElementById('sumTotal'),
            summary = document.getElementById('summary'),
            summaryInfo = summary.querySelector('a'),
            summaryText = summary.querySelector('span');

        sumTotal.classList = "";
        grossIncome.classList = "";
        summaryInfo.classList = "";
        summaryText.classList = "";

        sumTotal.innerHTML = '&#8358;' + addCommasToNumber(total);
        grossIncome.innerHTML = '&#8358;' + addCommasToNumber(grossProfit);

        if (debitTotal > creditTotal) {
            grossIncome.classList.add('text-red');
            document.getElementById('summary').classList.add('text-red');
            summaryInfo.innerText = 'Loss: ';
            summaryText.innerText = 'Debit is higher than credit';
        } else if (debitTotal < creditTotal) {
            grossIncome.classList.add('text-green');
            summary.classList.add('text-green');
            summaryInfo.innerText = 'Profit: ';
            summaryText.innerText = 'Debit is less than credit';
        } else {
            grossIncome.classList.add('text-green');
            summary.classList.add('text-green');
            summaryInfo.innerText = 'Balance: ';
            summaryText.innerText = 'Debit is equal to credit';
        }

        ledgerTable.scrollIntoView({
            behavior: 'smooth'
        });
    }
    // }
});
// 
function setCookie(name, value) {
    const date = new Date();
    date.setTime(date.getTime() + (60 * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + '=' + value + '; ' + expires + '; path=/';
}

function saveTransaction() {
    if (debitTotal !== undefined && creditTotal !== undefined && total !== undefined && grossProfit !== undefined) {
        const confirmSave = confirm('Do you want to save?');
        if (!confirmSave) return;

        const identifier = true;
        const date = new Date();
        const dateName = date.toUTCString().toString();

        const clause = (debitTotal > creditTotal) ? 'LOSS' : 'PROFIT';

        const currrentDate = date.toDateString();
        const currrentTime = date.toLocaleTimeString();
        const value = [
            identifier,
            debitTotal,
            creditTotal,
            total,
            grossProfit,
            currrentDate,
            currrentTime,
        ];

        setCookie(dateName, value);
        generateData(dateName, debitTotal, creditTotal, total, grossProfit, currrentDate, currrentTime);
        report.innerHTML = '';
        generateAudit(dateName, currrentDate, currrentTime, total, grossProfit, clause);

        if (auditContainer.classList.contains('d-none')) {
            auditContainer.classList.remove('d-none');
        }

        auditContainer.scrollIntoView({
            behavior: 'smooth',
        });
    }
}

function generateData(cookieName, cookieDebit, cookieCredit, cookieTotal, cookieGross, cookieDate, cookieTime) {
    const chartDisplay = document.createElement('div'),
        canvas = document.createElement('canvas'),
        statementsContainer = document.createElement('div'),
        dateContainer = document.createElement('div'),
        dateHead = document.createElement('b'),
        dateInfo = document.createElement('span'),

        timeContainer = document.createElement('div'),
        timeHead = document.createElement('b'),
        timeInfo = document.createElement('span'),

        totalContainer = document.createElement('div'),
        totalHead = document.createElement('b'),
        totalInfo = document.createElement('span'),

        grossContainer = document.createElement('div'),
        grossHead = document.createElement('b'),
        grossInfo = document.createElement('span'),

        deleteButton = document.createElement('button');

    chartDisplay.classList.add('chart');
    statementsContainer.classList.add('statements');

    totalHead.textContent = 'Total: ';
    totalInfo.innerHTML = '&#8358;' + addCommasToNumber(parseInt(cookieTotal));
    totalContainer.appendChild(totalHead);
    totalContainer.appendChild(totalInfo);

    grossHead.textContent = 'Gross Profit: ';
    grossInfo.innerHTML = '&#8358;' + addCommasToNumber(parseInt(cookieGross));
    grossContainer.appendChild(grossHead);
    grossContainer.appendChild(grossInfo);

    dateHead.textContent = 'Date: ';
    dateInfo.textContent = cookieDate;
    dateContainer.appendChild(dateHead);
    dateContainer.appendChild(dateInfo);

    timeHead.textContent = 'Time: ';
    timeInfo.textContent = cookieTime;
    timeContainer.appendChild(timeHead);
    timeContainer.appendChild(timeInfo);

    deleteButton.classList.add('deleteBtn');
    deleteButton.id = cookieName;
    deleteButton.type = 'button';
    deleteButton.title = 'Delete this from browser memory';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('onclick', 'deleteData(this)');

    statementsContainer.appendChild(dateContainer);
    statementsContainer.appendChild(timeContainer);
    statementsContainer.appendChild(totalContainer);
    statementsContainer.appendChild(grossContainer);
    statementsContainer.appendChild(deleteButton);

    const variable1 = parseInt(cookieDebit);
    const variable2 = parseInt(cookieCredit);

    const ctx = canvas.getContext('2d');

    const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Debit Total', 'Credit Total'],
            datasets: [{
                label: cookieDate,
                data: [variable1, variable2],
                backgroundColor: ['#FF6384', '#36A2EB'],
                hoverBackgroundColor: ['#c41239', '#1680c7'],
                borderWidth: 3,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    if (variable1 > variable2) {
        chartDisplay.style.border = '1px solid #f3050562';
    } else {
        chartDisplay.style.border = '1px solid #1fb90075';
    }
    chartDisplay.appendChild(canvas);
    chartDisplay.appendChild(statementsContainer);
    chartContainer.insertAdjacentElement('afterbegin', chartDisplay);
}

function deleteData(button) {
    var confrimDelete = confirm("Are you sure you want to delete this data?");

    if (confrimDelete) {
        document.cookie = button.id + "=; expires=Wed, 01 Jan 2001 00:00:00 UTC; path=/";
        button.parentElement.parentElement.remove();
        hideOrShow(transactionText, document.cookie);
    }
}

auditDisplayBtn.addEventListener('click', () => {
    report.classList.toggle('hide');

    if (report.classList.contains('hide')) {
        auditDisplayBtn.textContent = 'Show report';
    } else {
        auditDisplayBtn.textContent = 'Hide report';
    }
});

function generateAudit(name, date, time, total, gross, clause) {
    total = addCommasToNumber(total);
    gross = addCommasToNumber(gross);

    const audit = `
            <div class="audit">
                    <h3 style="color: black; margin-bottom: 
                    45px; letter-spacing: 2px; 
                    font-weight: 500;
                     word-spacing: 3px; 
                     text-align: center; 
                     text-decoration: underline;">Daily Financial Audit Report</h3>

                    <div class="head-audit" style="display: flex;
                    flex-direction: column;
                    gap: 15px;
                    font-weight: 600;
                    letter-spacing: 2px;
                    margin-bottom: 30px;">
                        <p>Audit Name: <span style="font-weight: 500;"> ${name}</span></p>
                        <p>Audit Type: <span style="font-weight: 500;">Computer Based </span></p>
                        <p>Audit Date: <span style="font-weight: 500;">${date}</span></p>
                        <p>Audit Time: <span style="font-weight: 500;">${time}</span></p>
                    </div>

                    <div class="findings" style=" display: flex;
                    flex-direction: column;
                    gap: 5px;
                    margin-bottom: 30px;">
                        <h4>&bull; Findings</h4>
                        <p>1. In the course of the audit we found out that the Total is: #${total}</p>
                        <p>2. In the course of the audit we found out that the Gross Income is: #${gross}</p>
                        <p>The Summary shows that the today we had a ${clause} in the income</p>
                    </div>

                    <div class="audit-footer">
                        <div class="comment" style="display: flex;
                        flex-direction: column;
                        gap: 20px;
                        margin-bottom: 30px;">

                            <b>Comment : </b>
                            <div class="box" style="width: 100%;
                            height: 50px;
                            border: 1px solid #ccc;
                            padding: 10%;"></div>
                        </div>

                        <div class="signature" style="display: flex;
                        flex-direction: column;
                        gap: 20px;">
                            <b>Authorised signature : </b>
                            <span>______________________</span>
                        </div>
                    </div>
                </div>
                <button type="button" id="download" title="Download audit report" onclick="downloadAudit('${name}')">Download</button>
                <em>Remember to download audit report before refreshing the page hence data would be lost</em>
            `;

    report.insertAdjacentHTML('afterbegin', audit);
}

function clearAll() {
    // --- THIS FUNCTION WILL BE USED BY THE CLEAR ALL BUTTON IN THE TRANSACTION SECTION
    // TO CLEAR ALL SAVED TRANSACTIONS [COOKIES]
    var confrimDelete = confirm("Are you sure you want to delete all data? It cannot be recovered after deletion");

    if (confrimDelete) {
        const cookiesArrray = document.cookie.split('; ');
        for (var i = 0; i < cookiesArrray.length; i++) {
            const cookie = cookiesArrray[i].split('=');
            document.cookie = cookie[0] + "=; expires=Wed, 01 Jan 2001 00:00:00 UTC; path=/";
        }
        window.location.reload();
    }

}

function downloadAudit(name) {
    const element = document.querySelector(".audit");

    const pdfOptions = {
        margin: 20,
        image: {
            type: 'jpeg',
            quality: 0.98
        },
        html2canvas: {
            scale: 2
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        },
    };

    html2pdf().from(element).set(pdfOptions).save(`${name}.pdf`);
}