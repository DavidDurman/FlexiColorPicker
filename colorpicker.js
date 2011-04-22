/**
 * ColorPicker - pure JavaScript color picker without using images, external CSS or 1px divs.
 * Copyright © 2011 David Durman, All rights reserved.
 */
(function(window, document, undefined) {

    var type = (window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML"),
        picker, slide, hueOffset = 15;

    /**
     * Return mouse position relative to the element el.
     */
    function mousePosition(evt, el) {
        // IE:
        if (window.event && window.event.contentOverflow !== undefined) {
            return { x: window.event.offsetX, y: window.event.offsetY };
        }
        
        // Webkit:
        if (evt.offsetX !== undefined && evt.offsetY !== undefined) {
            return { x: evt.offsetX, y: evt.offsetY };
        }

        // Firefox:
        
        // get position relative to the whole document
        // note that it also counts on scrolling (as opposed to clientX/Y).
        var pageX = evt.pageX,
            pageY = evt.pageY,
            // get position of the element relative to its offsetParent
            offsetLeft = el.offsetLeft,
            offsetTop = el.offsetTop,
            offsetParent = el.offsetParent,
        
            offsetX = pageX - offsetLeft,
            offsetY = pageY - offsetTop;

        // climb up positioned elements to sum up their offsets
        while (offsetParent) {
            offsetX += offsetParent.offsetLeft;
            offsetY += offsetParent.offsetTop;
            offsetParent = offsetParent.offsetParent;
        }
        return { x: offsetX, y: offsetY };
    }

    var gradients = {
        hsv: [
            { offset: '100%', color: '#FF0000', opacity: '1' },
            { offset: '88%', color: '#FFFF00', opacity: '1' },
            { offset: '75%', color: '#0BED00', opacity: '1' },
            { offset: '63%', color: '#00FF40', opacity: '1' },
            { offset: '50%', color: '#00FFFF', opacity: '1' },
            { offset: '38%', color: '#0040FF', opacity: '1' },
            { offset: '25%', color: '#8000FF', opacity: '1' },
            { offset: '13%', color: '#FF00FF', opacity: '1' },
            { offset: '0%', color: '#FF0000', opacity: '1' }
        ],
        black: [
            { offset: '100%', color: '#CC9A81', opacity: '0' },
            { offset: '0%', color: '#000000', opacity: '1' }
        ],
        white: [
            { offset: '100%', color: '#CC9A81', opacity: '0' },
            { offset: '0%', color: '#FFFFFF', opacity: '1' }
        ]
    };

    /**
     * Replace every {property}-like mark in tpl with the corresponding property
     * from the data object. Example: fill('My name is {first} {last}.', { first: 'John', last: 'Malkovich' });
     */
    function fill(tpl, data) {
        if (Object.prototype.toString.call(data) != '[object Array]') data = [data];

        var regexp = [], ret = [];
        for (var key in data[0]) regexp.push('{' + key + '}');
        regexp = new RegExp(regexp.join('|'), 'g');

        function replacer(data) {
            return function(match) { return data[match.substr(1, match.length - 2)]; }
        }
        
        var idx = data.length;
        while (idx--) ret.push(tpl.replace(regexp, replacer(data[idx])));
        return ret.join('');
    }

    /**
     * Create slide and picker markup depending on the supported technology.
     */
    if (type == 'SVG') {
        var svg = {
            doc: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%"><desc>Created by David Durman</desc>{content}</svg>',
            gradient: '<lineargradient id="{id}" x1="0%" y1="100%" x2="{x2}" y2="{y2}">{stopColors}</lineargradient>',
            stopColor: '<stop offset="{offset}" stop-color="{color}" stop-opacity="{opacity}"></stop>',
            rect: '<rect x="0" y="0" width="100%" height="100%" fill="url(#{gradientId})"></rect>'
        };
        
        slide = fill(svg.doc, {
            content: '<defs>'
                + fill(svg.gradient, { id: 'gradient-hsv', x2: '0%', y2: '0%', stopColors: fill(svg.stopColor, gradients.hsv) })
                + '</defs>'
                + fill(svg.rect, { gradientId: 'gradient-hsv' })
        });

        picker = fill(svg.doc, {
            content: '<defs>' 
                + fill(svg.gradient, { id: 'gradient-black', x2: '0%', y2: '0%', stopColors: fill(svg.stopColor, gradients.black) })
                + fill(svg.gradient, { id: 'gradient-white', x2: '100%', y2: '100%', stopColors: fill(svg.stopColor, gradients.white) })
                + '</defs>'
                + fill(svg.rect, { gradientId: 'gradient-white' })
                + fill(svg.rect, { gradientId: 'gradient-black' })
        });
        
    } else if (type == 'VML') {
        slide = [
            '<DIV style="position: relative; width: 100%; height: 100%">',
            '<v:rect style="position: absolute; top: 0; left: 0; width: 100%; height: 100%" stroked="f" filled="t">',
            '<v:fill type="gradient" method="none" angle="0" color="red" color2="red" colors="8519f fuchsia;.25 #8000ff;24903f #0040ff;.5 aqua;41287f #00ff40;.75 #0bed00;57671f yellow"></v:fill>',
            '</v:rect>',
            '</DIV>'
        ].join('');

        picker = [
            '<DIV style="position: relative; width: 100%; height: 100%">',
            '<v:rect style="position: absolute; left: -1px; top: -1px; width: 101%; height: 101%" stroked="f" filled="t">',
            '<v:fill type="gradient" method="none" angle="270" color="#FFFFFF" opacity="100%" color2="#CC9A81" o:opacity2="0%"></v:fill>',
            '</v:rect>',
            '<v:rect style="position: absolute; left: 0px; top: 0px; width: 100%; height: 101%" stroked="f" filled="t">',
            '<v:fill type="gradient" method="none" angle="0" color="#000000" opacity="100%" color2="#CC9A81" o:opacity2="0%"></v:fill>',
            '</v:rect>',
            '</DIV>'
        ].join('');
        
        if (!document.namespaces['v'])
            document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', '#default#VML');
    }

    /**
     * Convert HSV representation to RGB HEX string.
     */
    function hsv2rgb(h, s, v) {
        var R, G, B, X, C;
        h = (h % 360) / 60;
            C = v * s;
        X = C * (1 - Math.abs(h % 2 - 1));
        R = G = B = v - C;

        h = ~~h;
        R += [C, X, 0, 0, X, C][h];
        G += [X, C, C, X, 0, 0][h];
        B += [0, 0, X, C, C, X][h];

        var r = R * 255,
            g = G * 255,
            b = B * 255;
        return { r: r, g: g, b: b, hex: "#" + (16777216 | b | (g << 8) | (r << 16)).toString(16).slice(1) };
    }

    /**
     * Return click event handler for the slider.
     * Sets picker background color and calls ctx.callback if provided.
     */  
    function slideListener(ctx, slideElement, pickerElement) {
        return function(evt) {
            evt = evt || window.event;
            var mouse = mousePosition(evt, slideElement);
            ctx.h = mouse.y / slideElement.offsetHeight * 360 + hueOffset;
            var c = hsv2rgb(ctx.h, 1, 1);
            pickerElement.style.backgroundColor = c.hex;
            ctx.callback && ctx.callback(c.hex, { h: ctx.h - hueOffset, s: ctx.s, v: ctx.v }, { r: c.r, g: c.g, b: c.b });
        }
    };

    /**
     * Return click event handler for the picker.
     * Calls ctx.callback if provided.
     */  
    function pickerListener(ctx, slideElement, pickerElement) {
        return function(evt) {
            evt = evt || window.event;
            var mouse = mousePosition(evt, pickerElement),
                width = pickerElement.offsetWidth,            
                height = pickerElement.offsetHeight;

            ctx.s = mouse.x / width;
            ctx.v = (height - mouse.y) / height;
            var c = hsv2rgb(ctx.h, ctx.s, ctx.v);
            ctx.callback && ctx.callback(c.hex, { h: ctx.h - hueOffset, s: ctx.s, v: ctx.v }, { r: c.r, g: c.g, b: c.b });
        }
    };

    /**
     * ColorPicker.
     * @param {DOMElement} slideElement HSV slide element.
     * @param {DOMElement} pickerElement HSV picker element.
     * @param {Function} callback Called whenever the color is changed provided chosen color in RGB HEX format as the only argument.
     */
    function ColorPicker(slideElement, pickerElement, callback) {
        if (!(this instanceof ColorPicker)) return new ColorPicker(slideElement, pickerElement, callback);
        
        this.callback = callback;
        this.h = 0;
        this.s = 1;
        this.v = 1;
        
        slideElement.innerHTML = slide;
        pickerElement.innerHTML = picker;

        if (slideElement.attachEvent) {
            slideElement.attachEvent('onclick', slideListener(this, slideElement, pickerElement));
            pickerElement.attachEvent('onclick', pickerListener(this, slideElement, pickerElement));
        } else if (slideElement.addEventListener) {
            slideElement.addEventListener('click', slideListener(this, slideElement, pickerElement), false);
            pickerElement.addEventListener('click', pickerListener(this, slideElement, pickerElement), false);
        }
    };

    window.ColorPicker = ColorPicker;

})(window, window.document);
