/**
 *
 * @description Class which when instanciated create the ColorLevelAdjusterProject controller
 *  
 * @class Clap
 */
class Clap{

    constructor(container, counter=1, defaults={}){
        this.colorLevels = { 
            "red":  {
                "in":{
                    "min":0,
                    "max":255
                },
                "out":{
                    "min":0,
                    "max":255
                },
                "color_value":"#FF0000",
                "active":true,
                "label":"red",
                "mode":"screen"
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
                "color_value":"#00FF00",
                "active":true,
                "label":"green",
                "mode":"screen"
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
                "color_value":"#0000FF",
                "active":true,
                "label":"blue",
                "mode":"screen"
            },
            "alpha": {
                "in":{
                    "min":0,
                    "max":255
                },
                "out":{
                    "min":0,
                    "max":255
                },
                "color_value":"#FFFFFF",
                "active":true,
                "label":"alpha",
                "mode":"multiply"
            }
        }

        if (defaults != {}){
            this.initDefaults(defaults);
        }
        else{
            this.width=120;
            this.height=120;
            this.background="#AAAAAA";
            this.margin=10;
        }
        this.container = container
        this.slider = document.createElement("canvas");
        this.slider.id = "color_level_"+counter
        this.container.appendChild(this.slider);
        this.draw(this.slider);
        this.showHideBoxes(this.container);
    }

    initDefaults(defaults){
        if (typeof(defaults)!='object'){
            throw new Error('Default is not an object');
        }
        if (defaults.hasOwnProperty('width')){
            this.width = defaults.width;
        }
        if (defaults.hasOwnProperty('height')){
            this.height = defaults.height;
        }
        if (defaults.hasOwnProperty('background')){
            this.background = defaults.background;
        }
        if (defaults.hasOwnProperty('margin')){
            this.margin = defaults.margin;
        }
    }

    draw(elem){
        let ctx = elem.getContext('2d');
        try{
            ctx.canvas.width = this.width;
            ctx.canvas.height = this.height;
            this.draw_levels(ctx);
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = this.background;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }catch(e){
            console.log(e);
        }
    }
    
    draw_levels(ctx){
        for (let color in this.colorLevels){
            if (!this.colorLevels[color].active){
                continue
            }
            ctx.globalCompositeOperation = this.colorLevels[color].mode;
            this.draw_level(ctx, this.colorLevels[color]);
        }
    }
    
    draw_level(ctx, color){
        ctx.fillStyle=color.color_value;
        ctx.beginPath();
        let vertices = {
            "nw" : [(color.in.min*(this.width-2*this.margin))/255 + this.margin,
                0 + this.margin],
            "ne" : [(color.in.max*(this.width-2*this.margin))/255 + this.margin,
                0 + this.margin],
            "se" : [(color.out.max*(this.width-2*this.margin))/255 + this.margin,
                this.height - this.margin],
            "sw" : [(color.out.min*(this.width-2*this.margin))/255 + this.margin,
                this.height - this.margin]
        }
        ctx.moveTo(vertices.nw[0], vertices.nw[1]);
        ctx.lineTo(vertices.ne[0], vertices.ne[1]);
        ctx.lineTo(vertices.se[0], vertices.se[1]);
        ctx.lineTo(vertices.sw[0], vertices.sw[1]);
        ctx.closePath();
        ctx.fill();
        this.draw_vertices(ctx, color.color_value, vertices);
    }
    
    draw_vertices(ctx, color, vertices){
        console.log(vertices);
        for (let vertex in vertices){
            console.log(vertices[vertex], typeof(vertices[vertex]));
            console.log('hello')
            this.draw_vertex(ctx, color, vertices[vertex]);
        }
    }
    
    draw_vertex(ctx, color, vertex){
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(vertex[0]-5, vertex[1]-5);
        ctx.lineTo(vertex[0]+5, vertex[1]-5);
        ctx.lineTo(vertex[0]+5, vertex[1]+5);
        ctx.lineTo(vertex[0]-5, vertex[1]+5);
        ctx.closePath();
        ctx.stroke();
    }
    
    showHideBoxes(container){
        for (let color in this.colorLevels){
            let box = document.createElement("input");
            let label = document.createElement("label");
            box.type = "checkbox";
            box.value = this.colorLevels[color].label;
            box.id = "cb-"+this.colorLevels[color].label;
            if (this.colorLevels[color].active){
                box.checked=true;
            }
            box.addEventListener('change', (evt)=>{
                let current_canvas = container.getElementsByTagName('canvas')[0];
                let current_color = evt.target.value;
                if (evt.target.checked){
                    this.colorLevels[current_color].active = true;
                }else{
                    this.colorLevels[current_color].active = false;
                }
                this.draw(current_canvas);
            });
            label.for = box.id;
            label.innerHTML = this.colorLevels[color].label;
            container.appendChild(box);
            container.appendChild(label);
        }
    }
    
}