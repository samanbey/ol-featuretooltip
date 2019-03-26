/**
 * ol-featuretooltip.js
 *
 * class FeatureToolTip 
 * Displays tooltip for vector features
 * 
 * MIT License
 * Copyright (c) 2018 Gede Mátyás
 * 
 */
function FeatureTooltip(options) {
    var opts=options||{};
    this_=this;
    //
    // default options
    //
    // show all features (if false, only the first feature is shown)
    this.showAll=false;
    // a list of attribute names to show or false if all attributes is shown
    this.attrs=false;
    // should attribute names be shown
    this.showAttrNames=true;
    // layer, array of layers or false if tooltips are to be displayed for all layers
    this.layers=false;
    // default tooltip function. can be overridden by any function(Array<Feature>) that returns a string.
    this.text=function(f) {
        var t='';
        for (var i=0;i<f.length;i++) {
            t+='<table class="ol-featuretooltip-table">';
            var ps=f[i].getProperties();
            for (var j in ps)
                if (j!='geometry'&&(!this.attrs||this.attrs.indexOf(j)>=0))
                    t+=(this.showAttrNames?('<tr><th>'+j+'</th>'):'')+'<td>'+ps[j]+'</td></tr>';
            t+='</table>';
            if (!this.showAll)
                break;
        }
        return t;    
    }
    // style to highlight feature. Falsey value means no highlight
    this.highlightStyle=false;
    
    // merge options
    for (var i in opts)
        this[i]=opts[i];
    // create div for tooltip
    var d=document.createElement('div');
    this.div=d;
    d.className='ol-featuretooltip';
    // create overlay
    var o=new ol.Overlay({
        element: d,
        offset: [10,0],
        positioning: 'bottom-left'
    });
    this.ovl=o;
    this.map.addOverlay(o);
    
    // array to store highlighted features and their original styles
    this.hlf=[];
    
    // true if f is contained by one of the layers listed in this_.layers
    function layersContain(f) {
        // if a single layer is used, it is simple
        if (!Array.isArray(this_.layers))
            return this_.layers.getSource().hasFeature(f);
        // otherways iterate over layer sources and return true if found something
        for (var i=0;i<this_.layers.length;i++)
            if (this_.layers[i].getSource().hasFeature(f))
                return true;
        // return false if no results
        return false;
    }
    
    this.show=function(e) {
        var fs=[];
        if (e!==false)
            this_.map.forEachFeatureAtPixel(e.pixel,
                function(f) {
                    if (!this_.layers||layersContain(f))
                        fs.push(f);
                });
        // restore style of no longer highlighted features and highlight current ones
        if (this_.highlightStyle) {
            while(this_.hlf.length>0) {
                var ff=this_.hlf.shift();
                ff.f.setStyle(ff.s);
            }
            for (var i=0;i<fs.length;i++) {
                this_.hlf.push({f:fs[i],s:fs[i].getStyle()});
                fs[i].setStyle(this_.highlightStyle);
                if (!this_.showAll)
                    break;
            }
        }
        // set tooltip content
        var cont=this_.text(fs);
        this_.div.style.display=cont?'':'none';
        if (cont) {
            this_.ovl.setPosition(e.coordinate);
            this_.div.innerHTML=cont;
        }
    };
    /** enable tooltips */
    this.enable=function() {
        this.map.on('pointermove', this.show);
    };
    /** disable tooltips */
    this.disable=function() {
        this.map.un('pointermove', this.show);
        this.show(false);
    };
    
    this.enable();               
}  