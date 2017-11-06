'use strict';

const log = require('./../../dd-srvcommon/log-manager').getLogger(__filename);

module.exports = function (Seat) {

  Seat.book = function (id, cb) {

    (async function () {
      console.info("book: param -> id: ", id);
      let data = await Seat.find({where: {id: id}});
      let seat = data[0];
      console.info("book: found seat data: ", data, " And seat is: ", seat);

      if (!seat) {
        console.info("book: The seat id is invalid.");
        cb(null, {
          isBooked: false,
          errors: ["The seat id is invalid."]
        });
        return "seat seq: " + seat.id + " Not Available. ";
      } else if (seat.status === 'P') {
        console.info("book: The seat booking is already in progress. Sorry please try again in some time.");
        cb(null, {
          isBooked: false,
          errors: ["The seat booking is already in progress. Sorry please try again in some time."]
        });
        return "seat seq: " + seat.id + " had status `P`." + false;
      } else if (seat.status === 'B') {
        console.info("book: The seat is already booked. Please try some other show/seat.");
        cb(null, {
          isBooked: false,
          errors: ["The seat is already booked. Please try some other show/seat."]
        });
        return "seat seq: " + seat.id + " status is `B`: " + false;
      } else {
        let updatePStatus = await Seat.update({id: id}, {status: "P"});
        console.info("book: updated seat data: ", seat, seat.status, updatePStatus);
        setTimeout(async function () {
          let updateFlag2 = await Seat.update({id: id}, {status: "B"});
          console.info("book: inside setTimeout: ", updateFlag2);
          cb(null, {
            isBooked: true,
            errors: ["The seat is booked."]
          });
        }, 10000);
        return true;
      }
    })().then(function () {
      console.info("book success:: ", arguments);
    }, function () {
      console.info("book reject:: ", arguments);
    }).catch(function () {
      console.error("book catch:: ", arguments);
      cb(null, {
        isBooked: false,
        errors: arguments
      });
    });

  };

  Seat.remoteMethod('book', {
    accepts: [{
      arg: 'id',
      type: 'string',
      required: true
    }],
    returns: {
      arg: 'response',
      type: 'object'
    },
    http: {
      verb: 'post'
    },
    description: 'Book a seat and send is-successful status'
  });


  Seat.cancel = function (id, cb) {

    (async function () {
      console.debug("cancel: param -> id: ", id);
      let data = await Seat.find({where: {id: id}});
      let seat = data[0];
      console.debug("cancel: found seat data: ", data, " And seat is: ", seat);

      if (!seat) {
        console.info("cancel: The seat id is invalid.");
        cb(null, {
          isCancelled: false,
          errors: ["The seat id is invalid."]
        });
      } else if (seat.status === 'P') {
        console.info("cancel: The seat booking is already in progress, invalid request.");
        cb(null, {
          isCancelled: false,
          errors: ["The seat booking is already in progress, invalid request."]
        });
      } else if (seat.status === 'A') {
        console.info("cancel: The seat is already available, invalid request.");
        cb(null, {
          isCancelled: false,
          errors: ["The seat is already available, invalid request."]
        });
      } else {
        setTimeout(async function () {
          let updateFlag2 = await Seat.update({id: id}, {status: "A"});
          console.debug("cancel: inside setTimeout: ", updateFlag2);
          cb(null, {
            isCancelled: true,
            error: null
          });
        }, 3000);
      }
    })().then(function () {
      console.info("cancel success:: ", arguments);
    }, function () {
      console.info("cancel reject:: ", arguments);
    }).catch(function () {
      console.error("cancel catch:: ", arguments);
      cb(null, {
        isCancelled: false,
        errors: arguments
      });
    });

  };

  Seat.remoteMethod('cancel', {
    accepts: [{
      arg: 'id',
      type: 'string',
      required: true
    }],
    returns: {
      arg: 'response',
      type: 'object'
    },
    http: {
      verb: 'post'
    },
    description: 'Cancel a seat and send is-successful status'
  });

};
