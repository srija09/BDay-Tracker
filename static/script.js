document.addEventListener("DOMContentLoaded", function () {
    populateDateSelectors();
    loadTopBirthdays();
});

function populateDateSelectors() {
    let daySelect = document.getElementById("day");
    let monthSelect = document.getElementById("month");
    let yearSelect = document.getElementById("year");

    // Populate days (1 to 31)
    for (let i = 1; i <= 31; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
    }

    // Populate months (January to December)
    let months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];
    
    months.forEach((month, index) => {
        let option = document.createElement("option");
        option.value = index + 1; // Months are 1-12
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    // Populate years (1900 to current year)
    let currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1900; i--) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }
}

function submitBirthdate() {
    let day = document.getElementById("day").value;
    let month = document.getElementById("month").value;
    let year = document.getElementById("year").value;
    
    let birthdate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    // if (sessionStorage.getItem("submitted")) {
    //     alert("You have already submitted your birthday.");
    //     return;
    // }

    fetch("/add_birthday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthdate })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            sessionStorage.setItem("submitted", "true");
            loadTopBirthdays();
        }
    });
}

function loadTopBirthdays() {
    fetch("/top_birthdays")
    .then(response => response.json())
    .then(data => {
        const calendarDiv = document.getElementById("calendar");
        calendarDiv.innerHTML = "";

        const topBirthdays = data.top_birthdays.map(entry => entry[0]); // Extract dates
        topBirthdays.forEach((date, index) => {
            let div = document.createElement("div");
            div.classList.add("birthday-entry");
            div.textContent = `${date}`;
            calendarDiv.appendChild(div);
        });

        const selectedBirthdate = `${document.getElementById("year").value}-${document.getElementById("month").value}-${document.getElementById("day").value}`;
        if (topBirthdays.includes(selectedBirthdate)) {
            document.getElementById("status").innerText = "🎉 Your birthday is in the Top 100!";
        } else {
            document.getElementById("status").innerText = "Your birthday is not in the Top 100.";
        }
    });
}
