(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "station_id",
            alias: "Station ID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "num_bikes_available",
            alias: "Number of Bikes Available Now",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "last_reported",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "station_status",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "Station_Status",
            alias: "Status of Stations, Bikes Available",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://gbfs.citibikenyc.com/gbfs/es/station_status.json", function(resp) {
            var feat = resp.data.stations,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "station_id": feat[i].station_id,
                    "num_bikes_available": feat[i].num_bikes_available,
                    "last_reported": feat[i].last_reported,
                    "station_status": feat[i].station_status
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "CitiBike_Station_Status"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
