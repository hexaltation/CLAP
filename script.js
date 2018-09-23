let containers = document.getElementsByClassName('colorLevel');
let colorLevels =   {
                    "in":
                        {  
                        "red":  {
                                "min":0,
                                "max":255
                                },
                        "green":{
                                "min":0,
                                "max":255
                                },
                        "blue": {
                                "min":0,
                                "max":255
                                }
                        },
                    "out":
                        {
                        "red":  {
                                "min":0,
                                "max":255
                                },
                        "green":{
                                "min":0,
                                "max":255
                                },
                        "blue": {
                                "min":0,
                                "max":255
                                }
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