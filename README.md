Demo & discussion
=================

Visit: [http://www.daviddurman.com/flexi-color-picker](http://www.daviddurman.com/flexi-color-picker)

Features
========

- no Flash, images or 1px divs
- no dependency on an external JavaScript library
- dimensions of both the picker and the slider areas can be adjusted arbitrarily
- minimalistic (about 400 loc including comments)
- support for a large scale of browsers (including mobile browsers)
- understandable (no magic behind, code can be easily read and therefore adjusted)
- styleable in CSS
- position of the slider and the picker areas is not hardcoded and can be changed in CSS
- HSV, RGB and HEX output/input
- indicators (pointers to the slider and picker areas) can be arbitrary HTML elements (images, divs, spans, ...) styleable in CSS
- ready-to-use themes (stored in one CSS stylesheet)


Description
===========

FlexiColorPicker is based on HSV color model. The only two parts of the color picker are therefore
the **slider** for selecting _hue_ value and the **picker** for selecting _saturation_ and _value_. Both
the **slider** and **picker** are HTML elements (usually `<div>`'s) that serve as wrappers for SVG/VML gradient
rectangles. The **slider** gradient rectangle represents the _hue_ value (gradient with 9 `stop-color`s). The
two overlapping black and white gradient rectangles of the **picker** represent the _saturation_ and _value_ values.
The top level elements (`<svg>` in case of SVG enabled browser and `<div>` in case of VML enabled browser) 
that wrap each of the **slider** and **picker** gradient rectangles have set `width` and `height` to `100%` which
means that the color picker components (slider and picker) adjust themselfs automatically to the dimensions of the **slider** and **picker**
HTML elements.


API
===

**`ColorPicker(colorPickerElement, function(hex, hsv, rgb) { /*do something when the color changes */ })`**

This is the no-hassle form of creating the color picker. This is the recommended call.

Example:

        <div id="mycolorpicker" class="cp-default"></div>
        <script>
            ColorPicker(document.getElementById('mycolorpicker'), function(hex, hsv, rgb) {
                document.body.style.backgroundColor = hex;
            });
        </script>


**`ColorPicker.prototype.setHsv(hsv)`**

Sets HSV value.

Example:

        var cp = ColorPicker(document.getElementById('mycolorpicker'), function() {});
        cp.setHsv({ h: 180, s: .2, v: .7 });

**`ColorPicker.prototype.setRgb(rgb)`**

Sets RGB value.

Example:

        var cp = ColorPicker(document.getElementById('mycolorpicker'), function() {});
        cp.setRgb({ r: 120, g: 205, b: 18 });


**`ColorPicker.prototype.setHex(hex)`**

Sets HEX value.

Example:

        var cp = ColorPicker(document.getElementById('mycolorpicker'), function() {});
        cp.setHex('#AB12FE');


**`ColorPicker.positionIndicators(sliderIndicator, pickerIndicator, sliderCoordinate, pickerCoordinate)`**

Positions indicators in the slider and the picker. This is a helper function that is supposed to be called
in the callback function passed as the fourth argument to the `ColorPicker` function. The only thing it does is
setting the `top` and `left` CSS coordinate on the `sliderIndicator` and `pickerIndicator` HTML elements.
If you use the no-hassle form (see above), you don't have to deal with this function at all.

Example:

                ColorPicker(
                        document.getElementById('slider'), 
                        document.getElementById('picker'), 

                        function(hex, hsv, rgb, pickerCoordinate, sliderCoordinate) {
        
                            ColorPicker.positionIndicators(
                                document.getElementById('slider-indicator'),
                                document.getElementById('picker-indicator'),
                                sliderCoordinate, pickerCoordinate
                            );
        
                            document.body.style.backgroundColor = hex;
                    });


**`ColorPicker.fixIndicators(sliderIndicator, pickerIndicator)`**

This helper function just sets the `pointer-events` CSS property to `'none'` on both the `sliderIndicator` and
`pickerIndicator`. This is necessary otherwise any mouse event (click, mousedown, mousemove) triggered
on the `sliderIndicator` or `pickerIndicator` HTML elements would be cought instead of bypassed to
the slider and the picker area, hence preventing the color picker to catch these UI events in order to change
color. As `pointer-events` CSS property is not supported in all browsers, this function might workaround
this issue in the future. At this time, setting `pointer-events: none` in CSS on the slider and picker indicators
is equivalent.

Again, if you use the no-hassle form (see above), you don't have to deal with this function at all.


Examples
========

The basic example demonstrates the minimalism of the FlexiColorPicker. More useful examples follow.

Basic
-----

            <html>
              <head>
                <script type="text/javascript" src="colorpicker.js"></script>
                <style type="text/css">
                  #picker { width: 200px; height: 200px }
                  #slider { width: 30px; height: 200px }
                </style>
              </head>
              <body>

                <div id="picker"></div>
                <div id="slider"></div>

                <script type="text/javascript">

                  ColorPicker(

                    document.getElementById('slider'),
                    document.getElementById('picker'),

                    function(hex, hsv, rgb) {
                      console.log(hsv.h, hsv.s, hsv.v);         // [0-359], [0-1], [0-1]
                      console.log(rgb.r, rgb.g, rgb.b);         // [0-255], [0-255], [0-255]
                      document.body.style.backgroundColor = hex;        // #HEX
                    });

                </script>
              </body>
            </html>


Note that you can set arbitrary dimensions, position, border and other CSS properties on the slider and picker 
elements as you would do with any other HTML element on the page.


Advanced
--------

This is an advanced example showing how to work with custom indicators.

        <html>
          <head>
            <script type="text/javascript" src="../colorpicker.js"></script>
            <style type="text/css">
        
                #picker-wrapper {
                    width: 200px;
                    height: 200px;
                    position: relative;
                }
                #slider-wrapper {
                    width: 30px;
                    height: 200px;
                    position: relative;
                }
                #picker-indicator {
                    width: 3px;
                    height: 3px;
                    position: absolute;
                    border: 1px solid white;
                }
                #slider-indicator {
                    width: 100%;
                    height: 10px;
                    position: absolute;
                    border: 1px solid black;
                }
            </style>
          </head>
          <body>
        
              <div id="picker-wrapper">
                  <div id="picker"></div>
                  <div id="picker-indicator"></div>
              </div>
              <div id="slider-wrapper">
                  <div id="slider"></div>
                  <div id="slider-indicator"></div>
              </div>
        
              <script type="text/javascript">
        
                ColorPicker.fixIndicators(
                        document.getElementById('slider-indicator'),
                        document.getElementById('picker-indicator'));
        
                ColorPicker(
                        document.getElementById('slider'), 
                        document.getElementById('picker'), 

                        function(hex, hsv, rgb, pickerCoordinate, sliderCoordinate) {
        
                            ColorPicker.positionIndicators(
                                document.getElementById('slider-indicator'),
                                document.getElementById('picker-indicator'),
                                sliderCoordinate, pickerCoordinate
                            );
        
                            document.body.style.backgroundColor = hex;
                    });
        
              </script>
          </body>
        </html>



Note how the indicators work. There is no built-in indicators in FlexiColorPicker, instead, the user
has a freedom to set their own indicators as normal HTML elements styled in CSS (or use one of the ready-to-use themes packaged with FlexiColorPicker). 


No hassle
---------

If you don't want to deal with any of the above mentioned details and you're just looking for a copy-paste
(one function call-like) color picker, see this example.

        <html>
          <head>
            <script type="text/javascript" src="../colorpicker.js"></script>
            <link rel="stylesheet" type="text/css" href="../themes.css" />
          </head>
          <body>
        
            <div id="color-picker" class="cp-default"></div>
        
            <script type="text/javascript">
        
              ColorPicker(
        
                document.getElementById('color-picker'),
        
                function(hex, hsv, rgb) {
                    console.log(hsv.h, hsv.s, hsv.v);         // [0-359], [0-1], [0-1]
                    console.log(rgb.r, rgb.g, rgb.b);         // [0-255], [0-255], [0-255]
                    document.body.style.backgroundColor = hex;        // #HEX
                });
        
            </script>
          </body>
        </html>


The ColorPicker function has recognized only two arguments which means that it builds the HTML needed for you
and also fixes and positions indicators automatically.


License
========

FlexiColorPicker is licensed under the MIT license:

Copyright (c) 2011 - 2012 David Durman 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: 

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. 

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/DavidDurman/flexicolorpicker/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

