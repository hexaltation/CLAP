/**
 *
 * @description Class which when instanciated create the ColorLevelAdjusterProject controller
 *  
 * @class Clap
 */
class Clap{

    constructor(container, id="id", defaults={}){
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
                "displayed":true,
                "active":false,
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
                "displayed":true,
                "active":false,
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
                "displayed":true,
                "active":false,
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
                "displayed":true,
                "active":false,
                "label":"alpha",
                "mode":"multiply"
            }
        }

        if (!(container instanceof Element)){
            throw new Error("First Parameter in Clap instanciation must be instance of Element");
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
        this.clicked = false;
        this.selectedVertice = null;
        this.container = container
        this.slider = document.createElement("canvas");
        this.slider.id = "color_level_"+id;
        this.container.appendChild(this.slider);
        this.event = new Event('change');
        this.draw(this.slider);
        this.slider.origin = this.slider.getBoundingClientRect();
        this.selector = document.createElement("div");
        this.container.appendChild(this.selector);
        this.showHideBoxes(this.selector);
        this.slider.onmousedown = (evt)=>{
            this.clicked = true;
            this.isVerticeSelected(evt);
        };
        this.slider.onmouseup = ()=>{
            this.clicked = false;
            this.selectedVertice = null;
        };
        this.slider.onmousemove = (evt)=>{
            if (this.clicked && this.active_layer!=null && this.selectedVertice!=null){ 
                let value = Math.floor((evt.clientX - this.slider.origin.x - this.margin)*255/(this.width-2*this.margin));
                if (value < 0){
                    this.selectedVertice.obj[this.selectedVertice.key]=0;
                }else if(this.selectedVertice.key==="min" && value >= this.selectedVertice.obj["max"]){
                    this.selectedVertice.obj[this.selectedVertice.key]=this.selectedVertice.obj["max"]-1;
                }else if(this.selectedVertice.key==="max" && value <= this.selectedVertice.obj["min"]){
                    this.selectedVertice.obj[this.selectedVertice.key]=this.selectedVertice.obj["min"]+1;
                }else{
                    this.selectedVertice.obj[this.selectedVertice.key]=value;
                }
                this.draw(this.slider);
            }
        }
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
            elem.dispatchEvent(this.event);
        }catch(e){
            console.log(e);
        }
    }
    
    draw_levels(ctx){
        for (let color in this.colorLevels){
            if (!this.colorLevels[color].displayed){
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
        for (let vertex in vertices){
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
    
    showHideBoxes(selector){
        selector.innerHTML = "";
        for (let color in this.colorLevels){
            let box = document.createElement("input");
            let label = document.createElement("label");
            box.type = "checkbox";
            box.value = this.colorLevels[color].label;
            box.id = "cb-"+this.colorLevels[color].label;
            if (this.colorLevels[color].displayed){
                box.checked = true;
            }
            box.addEventListener('change', (evt)=>{
                let current_color = evt.target.value;
                if (evt.target.checked){
                    this.colorLevels[current_color].displayed = true;
                }else{
                    this.colorLevels[current_color].displayed = false;
                }
                this.draw(this.slider);
            });
            label.for = box.id;
            label.innerHTML = this.colorLevels[color].label;
            if (this.colorLevels[color].active){
                label.style.textDecoration = "underline";
            }
            label.ondblclick = (e)=>{
                this.selectActive(this.colorLevels[color]);
            }
            selector.appendChild(box);
            selector.appendChild(label);
        }
        this.container.dispatchEvent(this.event);
    }
    
    selectActive(active_color){
        for (let color in this.colorLevels){
            if (this.colorLevels[color]===active_color && this.colorLevels[color].active==false){
                this.colorLevels[color].active = true;
                this.active_layer = this.colorLevels[color];
            }else if(this.colorLevels[color]===active_color && this.colorLevels[color].active==true){
                this.colorLevels[color].active = false;
                this.active_layer = null;
            }else{
                this.colorLevels[color].active = false;
            }
        }
        this.showHideBoxes(this.selector);
    }

    isVerticeSelected(evt){
        if (this.active_layer != null){
            let vertices = [
                {"obj":this.active_layer.in, "key":"min"}, 
                {"obj":this.active_layer.in, "key":"max"}, 
                {"obj":this.active_layer.out, "key":"min"}, 
                {"obj":this.active_layer.out, "key":"max"}
            ];
            let position = [
                [(this.active_layer.in.min*(this.width-2*this.margin))/255 + this.margin + this.slider.origin.x, 0 + this.margin + this.slider.origin.y],
                [(this.active_layer.in.max*(this.width-2*this.margin))/255 + this.margin + this.slider.origin.x, 0 + this.margin + this.slider.origin.y],
                [(this.active_layer.out.min*(this.width-2*this.margin))/255 + this.margin + this.slider.origin.x, this.height - this.margin + this.slider.origin.y],
                [(this.active_layer.out.max*(this.width-2*this.margin))/255 + this.margin + this.slider.origin.x, this.height - this.margin + this.slider.origin.y]
            ];
            for (let i = 0; i < position.length; i++){
                if ((position[i][0] - 5 < evt.clientX && evt.clientX < position[i][0] + 5) && (position[i][1] - 5 < evt.clientY && evt.clientY < position[i][1] + 5)){
                    this.selectedVertice = vertices[i]
                    break
                }
            }
        }
    }
}