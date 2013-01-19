// Color pickers in different flavors.
// -----------------------------------

var cpDefault = ColorPicker(document.getElementById('default'), updateInputs);
var cpSmall = ColorPicker(document.getElementById('small'), updateInputs);
var cpFancy = ColorPicker(document.getElementById('fancy'), updateInputs);

// Inputs.
// -------

var iHex = document.getElementById('hex');
var iR = document.getElementById('rgb_r');
var iG = document.getElementById('rgb_g');
var iB = document.getElementById('rgb_b');
var iH = document.getElementById('hsv_h');
var iS = document.getElementById('hsv_s');
var iV = document.getElementById('hsv_v');

var rgbCSS = document.getElementById('rgb_css');
var hsvCSS = document.getElementById('hsv_css');

var color = document.getElementById('color');
var textColor = document.getElementById('text-color');

function updateInputs(hex) {

    var rgb = ColorPicker.hex2rgb(hex);
    var hsv = ColorPicker.hex2hsv(hex);

    iHex.value = hex;
    
    iR.value = rgb.r;
    iG.value = rgb.g;
    iB.value = rgb.b;

    iH.value = hsv.h.toFixed(2);
    iS.value = hsv.s.toFixed(2);
    iV.value = hsv.v.toFixed(2);

    rgbCSS.innerHTML = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
    hsvCSS.innerHTML = 'hsv(' + hsv.h.toFixed(2) + ', ' + hsv.s.toFixed(2) + ', ' + hsv.v.toFixed(2) + ')';
    
    color.style.backgroundColor = hex;
    textColor.style.color = hex;
}

function updateColorPickers(hex) {
    
    cpDefault.setHex(hex);
    cpSmall.setHex(hex);
    cpFancy.setHex(hex);
}


var initialHex = '#f4329c';
updateColorPickers(initialHex);


iHex.onchange = function() { updateColorPickers(iHex.value); };

iR.onchange = function() { updateColorPickers(ColorPicker.rgb2hex({ r: iR.value, g: iG.value, b: iB.value })); }
iG.onchange = function() { updateColorPickers(ColorPicker.rgb2hex({ r: iR.value, g: iG.value, b: iB.value })); }
iB.onchange = function() { updateColorPickers(ColorPicker.rgb2hex({ r: iR.value, g: iG.value, b: iB.value })); }

iH.onchange = function() { updateColorPickers(ColorPicker.hsv2hex({ h: iH.value, s: iS.value, v: iV.value })); }
iS.onchange = function() { updateColorPickers(ColorPicker.hsv2hex({ h: iH.value, s: iS.value, v: iV.value })); }
iV.onchange = function() { updateColorPickers(ColorPicker.hsv2hex({ h: iH.value, s: iS.value, v: iV.value })); }
