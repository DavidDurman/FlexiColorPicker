module('Color conversion', {

    setup: function() {

        
    },

    teardown: function() {
    }
    
});

test('from hex and back', function() {

    var hex = '#123321';

    var rgb = ColorPicker.hex2rgb(hex);

    equal(ColorPicker.rgb2hex(rgb), hex, 'conversion from hex to rgb and back must equal');

    var hsv = ColorPicker.hex2hsv(hex);

    equal(ColorPicker.hsv2hex(hsv), hex, 'conversion from hex to hsv and back must equal');
    
});

test('from rgb and back', function() {

    var rgb = { r: 100, g: 20, b: 180 };

    var hex = ColorPicker.rgb2hex(rgb);

    deepEqual(ColorPicker.hex2rgb(hex), rgb, 'conversion from rgb to hex and back must equal');

    var hsv = ColorPicker.rgb2hsv(rgb);

    deepEqual(ColorPicker.hsv2rgb(hsv), rgb, 'conversion from rgb to hsv and back must equal');
    
});

test('from hsv and back', function() {

    var hsv = { h: 195, s: .2, v: .8 };

    var hex = ColorPicker.hsv2hex(hsv);

    deepEqual(ColorPicker.hex2hsv(hex), hsv, 'conversion from hsv to hex and back must equal');

    var rgb = ColorPicker.hsv2rgb(hsv);

    deepEqual(ColorPicker.rgb2hsv(rgb), hsv, 'conversion from hsv to rgb and back must equal');
    
});
