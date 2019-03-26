# ol-featuretooltip
Customizable feature tooltip for OpenLayers vector features
## Usage
- Download ol-featuretooltip.js and ol-featuretooltip.css and include them in your html
```html
<link rel="stylesheet" href="ol-featuretooltip.css" type="text/css">
<script src="ol-featuretooltip.js"></script>
```
- Create a FeatureTooltip object. Options are given as an object literal:
```javascript
var tt=new FeatureTooltip({
    map: map,
    showAttrNames: false,
    attrs: [ 'name' ]
});
```
## Options
`map` - the ol.Map object to display tooltips in. This is the only obligatory option.

`showAll` - whether to include all features under the pointer or only the first one found (default `false`)

`attrs` - an array of attribute names to show or false if all attributes is shown (default `false`)

`showAttrNames` - should attribute names be shown (default `true`)

`highlightStyle` - style to highlight feature. Falsey value means no highlight (default `false`)

`layers` - a layer or an array of layers or false if tooltips are to be displayed for all layers (default: `false`)

`text` - user-defined tooltip function. A `function(Array<Feature>)` that returns a string. If set, it overrides the default tooltip text function, therefore `showAll`, `attrs` and `showAttrNames` takes no effect
