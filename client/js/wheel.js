function wheel(categories){
    let segments = []
    // loop through each category
    // add a segment with a random color
    categories.forEach(cat => {
        let randomColor = "#";
        for (let i = 0; i < 3; i++){randomColor += ("0" + Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)).slice(-2);}        
        segments.push({'fillStyle': randomColor, 'text': cat});
    })
    let theWheel = new Winwheel({
        'canvasId': 'canvas',
        'numSegments': categories.length,
        'outerRadius': 212,
        'textFontSize': 20,
        'segments':segments,
        'animation':{
            'type': 'spinToStop',
            'duration': 5,
            'spins' : 8,
            'callbackFinished': postSpin
        }
    });
    return theWheel;
}
function startSpin(theWheel){
    theWheel.animation.spins = 5;
    theWheel.startAnimation();
}
function postSpin(wheel){
    // remove spinner from view
    // update the bottom element with Number of questions and the category
    // question flow
        // show question and options (disabled)
        // wait 3 seconds
        // allow to buzz in
        // first person to buzz in
            // updates current player in server
            // server broadcasts
            // the player that buzzed in can answer within 5 seconds or current player spins wheel again
    indicatedSegment = wheel.getIndicatedSegment()
    update_category(indicatedSegment.text);
    wheel.rotationAngle = 0;
}