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
        const label = `The ${enablev2} feature flag evaluates to ${enablev2}.`;
        const white = '#ffffff';
        const dark = '#373841';
        console.log(darkMode)
        
    

        document.body.style.background = darkMode ?  dark : white;
        document.body.style.color = darkMode ? white : dark;

        // When we set the dark mode flag, we want to change the color of the page dynamically.
        document.getElementById('board-banner').style.color = darkMode ? white : dark;

        // When we set the feature flag enable_v2, it enables V2 of the code dynamically.
        if (enablev2) {
          document.getElementById('board-banner').textContent = 'Airport departure board V2.0';
        } else {
            document.getElementById('board-banner').textContent = 'Airport departure board V1.0';
        };
        

      }

      // When the page is ready, or the flag is changed then render the page
      ldclient.on('ready', render);
      ldclient.on('change', render);
    }
    main();


    function getAllFlightData() {
        fetch('http://127.0.0.1:8080/flights/')
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log('Data:', data);
                // displayGenericDepartureData(data);
                displayVIPDepartureData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    
    getAllFlightData();
    
    document.getElementById('terminal-select').addEventListener('change', function() {
        let terminal = this.value;
        console.log(terminal);
        // Clear the table
        let tbody = document.querySelector('table tbody');
        let thead = document.querySelector('table thead');
        tbody.innerHTML = '';
        thead.innerHTML = '';
        
    });
    
    function displayGenericDepartureData(data) {
        /*
        This function will display the data in the table for standard users.
        */
        console.log(data);
    
        document.getElementById('board-banner').textContent = 'Airport Departure Board (Standard edition)';
    
        let datalist = Object.values(data);
        let tbody = document.querySelector('table tbody');
        // Update the thead table with the key names for each item in datalist
        let thead = document.querySelector('table thead');
        let headerRow = document.createElement('tr');
        let keys = Object.keys(datalist[0]);
    
        //headerRow.appendChild(document.createElement('th'));
    
        headers = ["Airline", "Flight Number", "Destination", "Expected Departure Time", "Cancelled",];
        headers.forEach(header => {
            let th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
    
        thead.appendChild(headerRow);
    
        // Populate the tbody with flight data
        datalist.forEach(flight => {
            let row = document.createElement('tr');
            keys = ["airline_name","flight_number","airport_ICAO", "expected_departure_time","cancelled"];
            keys.forEach(key => {
                //console.log(flight[key]);
                let cell = document.createElement('td');
                cell.textContent = flight[key];
               // cell.textContent = Object.keys(flight);
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });
    
     
    }
    
    function displayVIPDepartureData(data) {
        /*
        This function will display the data in the table for VIP users.
        */
        console.log(data);
        document.getElementById('board-banner').textContent = 'Airport Departure Board (VIP edition)';
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