# CLAP ColorLevelAdjusterProject

Welcome to clap. A front JS Selector for rgba color level manipulation.

## Integrating

Add clap.js in your sources and call it in your code.
Add a div that will be populated by the controller.

```html
<div id='colorLevel'></div>
<script src="clap.js"></script>
<script>
    let container = document.getElementsById('colorLevel');
    let id = "YourCustomId";
    let settings ={
          "width":1200,
          "height":50,
          "background":"#000000",
          "margin":15
      }
    new Clap(container, id, settings);
</script>
```

The instanciation of the class takes 3 parameters.  
**container** *DOM obj* (mandatory): The DOM element that will contain the Clap Controller.  
**id** *String* (not mandatory but you must pass one): The id given to the instance will take the form "color_level_"+id.  
**settings** *Object*: object containing the customized values. 

### Customizing

You can customize the following settings.  
Only one or some of the values can be passed as parameter.  

The other ones will take the defaults values :
```javascript
width=120;
height=120;
background="#AAAAAA";
margin=10;
```

**width** *Int*: width of the containing canvas.  
**height** *Int*: height of the containing canvas.  
**background** *String*: Color in HEX format.  
**margin** *Int*: Value in pixel of the margin around sliders.  

### Event Binding

On change the Clap instance triggers a custom event in the DOM.  
You can subscribe to this event as follow :

```javascript
elem.addEventListener('change');
```
You can get event.target.colorLevels to get the values.  
For now you can interract with rgba values (in and out).  
The min value is 0.  
The max value is 255.  

## Visual Interaction

Checkbox are for hide/display mechanism purpose.  
If you want to interact with a layer, double-click on its name.  
When selected it will be underlined.  
Click on the handlers drawn on vertices and move the mouse while holding mouse down to move it.  

## How contibute

You can read TODO.md to see what have to be done and contribute.  
