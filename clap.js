/**
 *
 * @description Class which when instanciated create the ColorLevelAdjusterProject controller
 *  
 * @class Clap
 */
class Clap{

    constructor(container, id="id", settings={}){
        this.width = 120;
        this.height = 120;
        this.background = "#AAAAAA";
        this.margin = 10;
        this.min = 0;
        this.max = 255;
        this.lineWidth = 2;
        this.handlerSize = 10;
        this.boundary = false;
        this.boundaryColor = "#FFFFFF";
        this.gradient = false;
        this.customisable = [{"key":"width","type":"int"}, {"key":"height","type":"int"}, {"key":"background","type":"hexString"}, {"key":"margin","type":"int"}, {"key":"min","type":"int"}, {"key":"max","type":"int"}, {"key":"linewidth","type":"int"}, {"key":"handlerSize","type":"int"}, {"key":"boundary","type":"boolean"}, {"key":"boundaryColor","type":"hexString"}, {"key":"gradient","type":"boolean"}]

        if (settings != {}){
            this.initSettings(settings);
        }
        if(this.min>=this.max){
            throw new Error("min must be strictly inferior to max");
        }

        this.colorLevels = { 
            "red":  {
                "in":{
                    "min":this.min,
                    "max":this.max
                },
                "out":{
                    "min":this.min,
                    "max":this.max
                },
                "color_value":"#FF0000",
                "displayed":true,
                "active":false,
                "label":"red",
                "mode":"screen"
            },
            "green":{
                "in":{
                    "min":this.min,
                    "max":this.max
                },
                "out":{
                    "min":this.min,
                    "max":this.max
                },
                "color_value":"#00FF00",
                "displayed":true,
                "active":false,
                "label":"green",
                "mode":"screen"
            },
            "blue": {
                "in":{
                    "min":this.min,
                    "max":this.max
                },
                "out":{
                    "min":this.min,
                    "max":this.max
                },
                "color_value":"#0000FF",
                "displayed":true,
                "active":false,
                "label":"blue",
                "mode":"screen"
            },
            "alpha": {
                "in":{
                    "min":this.min,
                    "max":this.max
                },
                "out":{
                    "min":this.min,
                    "max":this.max
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
        this.container = container

        this.slider = document.createElement("canvas");
        this.slider.id = "color_level_"+id;
        this.container.appendChild(this.slider);
        this.event = new Event('clap_change', {bubbles: true});
        this.event.colorLevels = this.colorLevels;
        this.draw(this.slider);
        this.slider.origin = this.slider.getBoundingClientRect();
        this.selector = document.createElement("div");
        this.container.appendChild(this.selector);
        this.showHideBoxes(this.selector);
        this.clicked = false;
        this.selectedVertice = null;

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
                let value = Math.floor((evt.pageX-this.slider.origin.x-this.margin)*(Math.abs(this.max-this.min))/(this.width-2*this.margin)+this.min);
                if(this.selectedVertice.key==="min" && value >= this.selectedVertice.obj["max"]){
                    this.selectedVertice.obj[this.selectedVertice.key]=this.selectedVertice.obj["max"]-1;
                }else if(this.selectedVertice.key==="max" && value <= this.selectedVertice.obj["min"]){
                    this.selectedVertice.obj[this.selectedVertice.key]=this.selectedVertice.obj["min"]+1;
                }else if (value < this.min){
                    this.selectedVertice.obj[this.selectedVertice.key]=this.min;
                }else if (value > this.max){
                    this.selectedVertice.obj[this.selectedVertice.key]=this.max;
                }else{
                    this.selectedVertice.obj[this.selectedVertice.key]=value;
                }
                this.draw(this.slider);
            }
        }
    }

    initSettings(settings){
        if (typeof(settings)!='object'){
            throw new Error('settings must be an object');
        }
        this.customisable.forEach((setting)=>{
            if (settings.hasOwnProperty(setting.key)){
                this.typeChecking(settings[setting.key], setting);
                this[setting.key] = settings[setting.key];
            }
        })
    }

    typeChecking(value, setting){
        if (typeof(value)!==setting.type && (setting.type !== "hexString" && setting.type !== "int")){
            throw new TypeError(setting.key+" must be of type "+setting.type+". Here it's "+"'"+typeof(value)+"'.");
        }
        if (typeof(value)==='number' && setting.type === 'int'){
            if (!Number.isInteger(value)){
                throw new TypeError(setting.key+" must be of type "+setting.type+". Here it's a vulgar 'number'.");
            }
        }
        if (typeof(value)==='string' && setting.type === 'hexString'){
            if (!/^#[0-9A-F]{6}$/i.test(value)){
                throw new TypeError(setting.key+" must be of type "+setting.type+". Here it's a vulgar 'string'.");
            }
        }
    }

    draw(elem){
        let ctx = elem.getContext('2d');
        try{
            ctx.canvas.width = this.width;
            ctx.canvas.height = this.height;
            this.draw_levels(ctx);
            if(this.gradient){
                ctx.globalCompositeOperation = 'multiply';
                this.draw_gradient(ctx);
            }
            ctx.globalCompositeOperation = 'destination-over';
            if (this.boundary){
                ctx.strokeStyle = this.boundaryColor;
                ctx.strokeRect(this.margin, this.margin, this.width-2*this.margin, this.height-2*this.margin);
            }
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
        let points = [color.in.min,color.in.max,color.out.max,color.out.min]
        let vertices = this.draw_from_points(ctx, points);
        this.draw_vertices(ctx, color.color_value, vertices);
    }

    draw_from_points(ctx, points){
        ctx.beginPath();
        let vertices = {
            "nw" : [((points[0]-this.min)*(this.width-2*this.margin))/(Math.abs(this.max-this.min)) + this.margin,
                0 + this.margin],
            "ne" : [((points[1]-this.min)*(this.width-2*this.margin))/(Math.abs(this.max-this.min)) + this.margin,
                0 + this.margin],
            "se" : [((points[2]-this.min)*(this.width-2*this.margin))/(Math.abs(this.max-this.min)) + this.margin,
                this.height - this.margin],
            "sw" : [((points[3]-this.min)*(this.width-2*this.margin))/(Math.abs(this.max-this.min)) + this.margin,
                this.height - this.margin]
        }
        ctx.moveTo(vertices.nw[0], vertices.nw[1]);
        ctx.lineTo(vertices.ne[0], vertices.ne[1]);
        ctx.lineTo(vertices.se[0], vertices.se[1]);
        ctx.lineTo(vertices.sw[0], vertices.sw[1]);
        ctx.closePath();
        ctx.fill();
        return vertices;
    }
    
    draw_vertices(ctx, color, vertices){
        for (let vertex in vertices){
            this.draw_vertex(ctx, color, vertices[vertex]);
        }
    }
    
    draw_vertex(ctx, color, vertex){
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(vertex[0]-this.handlerSize/2, vertex[1]-this.handlerSize/2);
        ctx.lineTo(vertex[0]+this.handlerSize/2, vertex[1]-this.handlerSize/2);
        ctx.lineTo(vertex[0]+this.handlerSize/2, vertex[1]+this.handlerSize/2);
        ctx.lineTo(vertex[0]-this.handlerSize/2, vertex[1]+this.handlerSize/2);
        ctx.closePath();
        ctx.stroke();
    }

    draw_gradient(ctx){
        let grd=ctx.createLinearGradient(0,0,this.width,0);
        grd.addColorStop(0,"black");
        grd.addColorStop(1,"white");
        ctx.fillStyle=grd;
        let points = this.get_externals_vertices();
        console.log(points)
        this.draw_from_points(ctx, points);
    }

    get_externals_vertices(){
        let inmin;
        let inmax;
        let outmin;
        let outmax;
        for (let color in this.colorLevels){
            if (this.colorLevels[color].in.min < inmin || inmin===undefined){
                inmin = this.colorLevels[color].in.min;
            }
            if (this.colorLevels[color].in.max < inmax || inmax===undefined){
                inmax = this.colorLevels[color].in.max;
            }
            if (this.colorLevels[color].out.min < outmin || outmin===undefined){
                outmin = this.colorLevels[color].out.min;
            }
            if (this.colorLevels[color].out.max < outmax || outmax===undefined){
                outmax = this.colorLevels[color].out.max;
            }
        }
        return [inmin, inmax, outmax, outmin];
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
                [((this.active_layer.in.min-this.min)*(this.width-2*this.margin))/(Math.abs(this.max-this.min)) + this.margin + this.slider.origin.x, 0 + this.margin + this.slider.origin.y],
                [((this.active_layer.in.max-this.min)*(this.width-2*this.margin))/(Math.abs(this.max-this.min)) + this.margin + this.slider.origin.x, 0 + this.margin + this.slider.origin.y],
                [((this.active_layer.out.min-this.min)*(this.width-2*this.margin))/(Math.abs(this.max-this.min)) + this.margin + this.slider.origin.x, this.height - this.margin + this.slider.origin.y],
                [((this.active_layer.out.max-this.min)*(this.width-2*this.margin))/(Math.abs(this.max-this.min)) + this.margin + this.slider.origin.x, this.height - this.margin + this.slider.origin.y]
            ];
            for (let i = 0; i < position.length; i++){
                if ((position[i][0] - this.handlerSize/2 < evt.pageX && evt.pageX < position[i][0] + this.handlerSize/2) && (position[i][1] - this.handlerSize/2 < evt.pageY && evt.pageY < position[i][1] + this.handlerSize/2)){
                    this.selectedVertice = vertices[i]
                    break
                }
            }
        }
    }
}