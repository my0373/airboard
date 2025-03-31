function main()
    {
      // Set clientSideID to your LaunchDarkly client-side ID
      const clientSideID = "67cb545f36950609a8fdca60";


      // Set flagKey to the feature flag key you want to evaluate
      const flagKey = 'enable_v2';

      // Set up the evaluation context. This context should appear on your
      // LaunchDarkly contexts dashboard soon after you run the demo.
      const context = {
        kind: 'location',
        key: 'lounge-key',
        name: 'lounge'
      };


      // Initialize the LaunchDarkly client
      const ldclient = LDClient.initialize(clientSideID, context);



      function render() {
        /*
        This function renders the page.
        */
        const enablev2 = ldclient.variation(flagKey, false);
        const darkMode = ldclient.variation('dark_mode', false);
        const version = ldclient.variation('website_version', '1.0');
        // const label = `The ${enablev2} feature flag evaluates to ${enablev2}.`;
        const white = '#ffffff';
        const dark = '#373841';
        console.log(`debug dark mode setting is: ${darkMode}`);
        // console.log(`debug v2mode setting is: ${enablev2}`);
        console.log(`debug website version is: ${version}`);

        
    

        document.body.style.background = darkMode ?  dark : white;
        document.body.style.color = darkMode ? white : dark;

        // When we set the dark mode flag, we want to change the color of the page dynamically.
        document.getElementById('board-banner').style.color = darkMode ? white : dark;

        // When we set the feature flag enable_v2, it enables V2 of the code dynamically.
        if (version === 1) {
          displayV1();
        } else if (version === 2) {
            displayV2();
        } else if (version === 3) {
            displayV3();
        } else {
            displayError();
        }
        

      }

      // When the page is ready, or the flag is changed then render the page
      ldclient.on('ready', render);
      ldclient.on('change', render);
    }



    function displayError() {
        document.getElementById('board-banner').textContent = 'Airboard: There is an error with the version number';
    }

    function displayV3() {
        document.getElementById('board-banner').textContent = 'Airport departure board V3.0';
        getAllFlightData(3);
    }

    function displayV2() {
        document.getElementById('board-banner').textContent = 'Airport departure board V2.0';
        getAllFlightData(2);
    }

    function displayV1() {
        document.getElementById('board-banner').textContent = 'Airport departure board V1.0';
        getAllFlightData(1);
    }

    function getAllFlightData(version) {
        /*
        Display the version of the application requested.
        */
        clearAllFlightData();
        if (version === 1) {
            console.log('Fetching flight data for version 1...');
        } else if (version === 2) {
            console.log('Fetching flight data for version 2...');
        } else if (version === 3) {
            console.log('Fetching flight data for version 3...');
        } else {
            console.error('Invalid version number provided.');
            return;
        }

        fetch('http://127.0.0.1:8080/flights/')
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log('Data:', data);

                if (version === 1) {
                    displayDepartureDatav1(data);
                } else if (version === 2) {
                    displayDepartureDatav2(data);
                } else if  (version === 3) {
                    displayDepartureDatav3(data);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    
    function clearAllFlightData() {
        /*
        Clear the contents of the flights table.
        */
        console.log('Clearing all flight data...');
        let table = document.getElementById('flights-table');


        console.log('table :' + table);
        let thead = table.querySelector('thead');
        console.log('thead :' + thead);
        thead.innerHTML = '';
        let tbody = table.querySelector('tbody');
        console.log('tbody :' + tbody);
        tbody.innerHTML = '';
    }
    
    function displayDepartureDatav1(data) {
        /*
        This function will display the data in the table for VIP users.
        */
        console.log(data);
        //document.getElementById('board-banner').textContent = 'Airport Departure Board (VIP edition)';
        let datalist = Object.values(data);
        let tbody = document.querySelector('table tbody');
        // Update the thead table with the key names for each item in datalist
        let thead = document.querySelector('table thead');
        let headerRow = document.createElement('tr');
        let keys = Object.keys(datalist[0]);
    
        //headerRow.appendChild(document.createElement('th'));
    
        headers = ["Airline", "Flight Number", "Gate", "Destination", "Expected Departure Time"];
        headers.forEach(header => {
            let th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
    
        thead.appendChild(headerRow);
    
        // Populate the tbody with flight data
        datalist.forEach(flight => {
            let row = document.createElement('tr');
            keys = ["airline_name","flight_number","gate","airport_ICAO", "expected_departure_time"];
            keys.forEach(key => {
                //console.log(flight[key]);
                let cell = document.createElement('td');
                cell.textContent = flight[key];
                cell.setAttribute('class', 'departure');
               // cell.textContent = Object.keys(flight);
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });
    
     
    }

    function displayDepartureDatav2(data) {
        /*
        This function will display the data in the table for VIP users.
        */
        console.log(data);
        //document.getElementById('board-banner').textContent = 'Airport Departure Board (VIP edition)';
        let datalist = Object.values(data);
        let tbody = document.querySelector('table tbody');
        // Update the thead table with the key names for each item in datalist
        let thead = document.querySelector('table thead');
        let headerRow = document.createElement('tr');
        let keys = Object.keys(datalist[0]);
    
        //headerRow.appendChild(document.createElement('th'));
    
        headers = ["Airline", "Flight Number", "Gate", "Destination", "Expected Departure Time",  "Delayed"];
        headers.forEach(header => {
            let th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
    
        thead.appendChild(headerRow);
    
        // Populate the tbody with flight data
        datalist.forEach(flight => {
            let row = document.createElement('tr');
            keys = ["airline_name","flight_number","gate","airport_ICAO", "expected_departure_time","delayed"];
            keys.forEach(key => {
                //console.log(flight[key]);
                let cell = document.createElement('td');
                cell.textContent = flight[key];
                cell.setAttribute('class', 'departure');
               // cell.textContent = Object.keys(flight);
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });
    
     
    }
    
    function displayDepartureDatav3(data) {
        /*
        This function will display the data in the table for VIP users.
        */
        console.log(data);
        //document.getElementById('board-banner').textContent = 'Airport Departure Board (VIP edition)';
        let datalist = Object.values(data);
        let tbody = document.querySelector('table tbody');
        // Update the thead table with the key names for each item in datalist
        let thead = document.querySelector('table thead');
        let headerRow = document.createElement('tr');
        let keys = Object.keys(datalist[0]);
    
        //headerRow.appendChild(document.createElement('th'));
    
        headers = ["Airline", "Flight Number", "Gate", "Destination", "Expected Departure Time", "Cancelled", "Delayed"];
        headers.forEach(header => {
            let th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
    
        thead.appendChild(headerRow);
    
        // Populate the tbody with flight data
        datalist.forEach(flight => {
            let row = document.createElement('tr');
            keys = ["airline_name","flight_number","gate","airport_ICAO", "expected_departure_time","cancelled","delayed"];
            keys.forEach(key => {
                //console.log(flight[key]);
                let cell = document.createElement('td');
                cell.textContent = flight[key];
                cell.setAttribute('class', 'departure');
               // cell.textContent = Object.keys(flight);
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });
    
     
    }



    
    function displayFlightData(data) {
        console.log(data);
    
        let datalist = Object.values(data);
        let tbody = document.querySelector('table tbody');
        // Update the thead table with the key names for each item in datalist
        let thead = document.querySelector('table thead');
        let headerRow = document.createElement('tr');
        let keys = Object.keys(datalist[0]);
    
    
        keys.forEach(key => {
            let th = document.createElement('th');
            th.textContent = key;
            headerRow.appendChild(th);
        });
    
        thead.appendChild(headerRow);
    
        // Populate the tbody with flight data
        datalist.forEach(flight => {
            let row = document.createElement('tr');
            keys.forEach(key => {
                let cell = document.createElement('td');
                cell.textContent = flight["delayed"];
               // cell.textContent = Object.keys(flight);
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });
    

     
    }

    // Start of script

    main();
    //getAllFlightData();