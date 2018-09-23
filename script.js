let containers = document.getElementsByClassName('colorLevel');
let canvas_default ={
                        "width":120,
                        "height":120,
                        "background":"#000000",
                        "margin":10
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
        draw_levels(ctx);
    }catch(e){
        console.log(e);
    }
}

function draw_levels(ctx){
    for (let color in colorLevels){
        draw_level(ctx, colorLevels[color]);
    }
}

function draw_level(ctx, color){
    console.log((color.in.min*(canvas_default.width-2*canvas_default.margin))/255,(color.in.max*(canvas_default.width-2*canvas_default.margin))/255, (color.out.max*(canvas_default.width-2*canvas_default.margin))/255, (color.out.min*(canvas_default.width-2*canvas_default.margin))/255)
    ctx.fillStyle=color.color_value;
    ctx.beginPath();
    ctx.moveTo((color.in.min*(canvas_default.width-2*canvas_default.margin))/255 + canvas_default.margin,
                0 + canvas_default.margin);
    ctx.lineTo((color.in.max*(canvas_default.width-2*canvas_default.margin))/255 + canvas_default.margin,
                0 + canvas_default.margin);
    ctx.lineTo((color.out.max*(canvas_default.width-2*canvas_default.margin))/255 + canvas_default.margin,
                canvas_default.height - canvas_default.margin);
    ctx.lineTo((color.out.min*(canvas_default.width-2*canvas_default.margin))/255 + canvas_default.margin,
                canvas_default.height - canvas_default.margin);
    ctx.closePath();
    ctx.fill();
}