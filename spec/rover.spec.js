const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');


describe("Rover class", function() {

  //TEST 7
  test("constructor sets position and default values for mode and generatorWatts", function() {
    let testPosition = 98382;
    let marsRover = new Rover(testPosition);
    expect(marsRover.position).toEqual(testPosition)
    expect(marsRover.mode).toEqual("NORMAL")
    expect(marsRover.generatorWatts).toEqual(110)
  });
 
    //TEST 8
    test("response returned by receiveMessage contains the name of the message", function() {
      let statusCommand = [new Command("MODE_CHANGE", "LOW_POWER"), new Command("STATUS_CHECK")];
      let statusMessage = new Message ("self check", statusCommand);
      let marsRover = new Rover(98382);
      let statusResponse = marsRover.receiveMessage(statusMessage);
      expect(statusResponse.marsRover).toEqual(marsRover.name);
   });

    //TEST 9
    test("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
      let statusCommand = [new Command("MODE_CHANGE", "LOW_POWER"), new Command("STATUS_CHECK")];
      let statusMessage = new Message ("NAME", statusCommand);
      let marsRover = new Rover(98382);
      let statusResponse = marsRover.receiveMessage(statusMessage);
      expect(statusResponse.results.length).toEqual(2);
   });

    //TEST 10
    test("responds correctly to the status check command", function() {
      let statusCommand = [new Command("STATUS_CHECK")];
      let statusMessage = new Message ("self check", statusCommand);
      let marsRover = new Rover(98382);
      let statusResponse = marsRover.receiveMessage(statusMessage);
      expect(statusResponse.results[0].roverStatus.position).toEqual(98382);
      expect(statusResponse.results[0].roverStatus.mode).toEqual("NORMAL");
      expect(statusResponse.results[0].roverStatus.generatorWatts).toEqual(110);
      expect(statusResponse.results[0].completed).toEqual(true);; 
    })

    //TEST 11
    test("responds correctly to the mode change command", function() {
      let modeCommand = [new Command("MODE_CHANGE", "LOW_POWER")];
      let modeMessage = new Message ("losing power", modeCommand);
      let marsRover = new Rover(98382);
      let modeResponse = marsRover.receiveMessage(modeMessage);
      expect(modeResponse.results[0].completed).toEqual(true);
      expect(marsRover.mode).toEqual("LOW_POWER");
    })

    //TEST 12
    test("responds with a false completed value when attempting to move in LOW_POWER mode", function() {
      let stillCommand = [new Command("MODE_CHANGE", "LOW_POWER") , new Command("MOVE", 100000)];
      let stillMessage = new Message ("do not move", stillCommand);
      let stoppedPosition = 95000;
      let marsRover = new Rover(stoppedPosition);
      let stillResponse = marsRover.receiveMessage(stillMessage);
      expect(stillResponse.results[1].completed).toEqual(false);
      expect(marsRover.position).toEqual(stoppedPosition);   
    })

    //TEST 13
    test("responds with the position for the move command", function() {
      let startPosition = 10000;
      let newPosition = 12000;
      let marsRover = new Rover(startPosition);
      let moveCommand = [new Command("MOVE", newPosition)];
      let moveMessage = new Message ("start moving", moveCommand);
      let moveRover = marsRover.receiveMessage(moveMessage);
      expect(moveRover.results[0].completed).toEqual(true);
      expect(marsRover.position).toEqual(newPosition); 
    })
   
  });

  

