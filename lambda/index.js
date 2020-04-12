const Influx = require('influx');

//This code writes data from IoT core rule via Lambda into InfluxDB 

exports.handler = async (event, context, callback) => {

    var randnum1 = Math.floor( Math.random() * 100 );
    var randnum2 = Math.floor( Math.random() * 100 );
    const baseValue = 30;
    const valueRange = 5;
    var seconds = new Date().getTime() / 1000;
    var randnum3 = Math.floor(baseValue + Math.sin(seconds * (Math.PI / 180)) * valueRange)

    var result = writeToInfluxDB(randnum1, randnum2, randnum3);

    callback(null, result);

};

function writeToInfluxDB(randnum1, randnum2, randnum3) {
    console.log("Executing Iflux insert");

    const postData = {
        database: process.env.INFLUXDB,
        username: process.env.INFLUXDBUSRNAME,
        password: process.env.INFLUXDBPWD,
        port: process.env.INFLUXDBPORT,
        hosts: [{ host: process.env.INFLUXDBHOST }],
        schema: [{
            measurement: 'mymeas',

            fields: {
                val_1: Influx.FieldType.FLOAT,
                val_2: Influx.FieldType.FLOAT,
                val_3: Influx.FieldType.FLOAT,
            },

            tags: ['mytag']
        }]
    }
    console.log(postData);
    const client = new Influx.InfluxDB(postData);

    client.writePoints([{
        measurement: 'mymeas', fields: { val_1: randnum1, val_2: randnum2, val_3: randnum3, },
        tags: {mytag: 'xyz'},
    }])
    console.log("Finished executing");
}

