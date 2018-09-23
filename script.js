let containers = document.getElementsByClassName('colorLevel');
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

for (let container of containers){
    let slider= document.createElement("canvas");
    container.appendChild(slider);
    draw(slider);
}

function draw(elem){
    console.log(elem)
    let ctx = elem.getContext('2d');
    try{
        ctx.canvas.width = 120;
        ctx.canvas.height = 120;
        ctx.canvas.style.background = "#000000";
    }catch(e){
        console.log(e);
    }
}