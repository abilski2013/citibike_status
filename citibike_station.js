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
            id: "name",
            alias: "Station Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "capacity",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "lat",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "lon",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "station_type",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "region_id",
            dataType: tableau.dataTypeEnum.float
        }];

        var tableSchema = {
            id: "Station_information",
            alias: "Stations names, coordinates, info",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://gbfs.citibikenyc.com/gbfs/en/station_information.json", function(resp) {
            var feat = resp.data.stations,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "station_id": feat[i].station_id,
                    "name": feat[i].name,
                    "capacity": feat[i].capacity,
                    "lat": feat[i].lat,
                    "lon": feat[i].lon,
                    "station_type": feat[i].station_type,
                    "region_id": feat[i].region_id
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
            tableau.connectionName = "CitiBike_Station_Information"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
