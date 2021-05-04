function forward (x, y, step_size) {
    console.log('dddd');
    return {x, y: y + step_size};
}

function left (x, y, step_size) {
    return {x: x - step_size, y};
}

function right (x, y, step_size) {
    return {x: x + step_size, y};
}