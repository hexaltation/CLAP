let containers = document.getElementsByClassName('colorLevel');
let canvas_default = {
                        "width":120,
                        "height":120,
                        "background":"#000000"
}
let colorLevels =   { 
                        "red":  {
                                "in":{
                                    "min":0,
                                    "max":255
                                },
                                "out":{
                                    "min":0,
                                    "max":255
                                },
                                "color_value":"#FF0000"
                        },
                        "green":{
                                "in":{
                                    "min":0,
                                    "max":255
                                },
                                "out":{
                                    "min":0,
                                    "max":255
                                },
                                "color_value":"#00FF00"
                        },
                        "blue": {
                                "in":{
                                    "min":0,
                                    "max":255
                                },
                                "out":{
                                    "min":0,
                                    "max":255
                                },
                                "color_value":"#0000FF"
                        }
                    }

var counter = 0
for (let container of containers){
    counter ++;
    let slider = document.createElement("canvas");
    slider.id = "color_level_"+counter
    container.appendChild(slider);
    draw(slider);
}

function draw(elem){
    let ctx = elem.getContext('2d');
    try{
        ctx.canvas.width = canvas_default.width;
        ctx.canvas.height = canvas_default.height;
        ctx.canvas.style.background = canvas_default.background;
    }catch(e){
        console.log(e);
    }
}