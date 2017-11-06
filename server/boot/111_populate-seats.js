'use strict';

module.exports = function populateSeatStatus(app) {

  let SeatModel = app.models.Seat,
      seatEntities = [];

  for(let i = 0; i < 50; i++) {
    seatEntities.push({
      id: i,
      seq: "#" + i,
      status: "A"
    });
  }

  SeatModel.count({}, {}, function (err, count) {
    console.info("initial count " + count);

    SeatModel.create(seatEntities, {}, function () {
      //console.info(arguments);
      SeatModel.count({}, {}, function (err, count) {
        console.info("final count " + count);
      });

    });
  });

};

