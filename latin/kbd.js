/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

var IME = (function () {
  var layouts = {
    // common is the base for every layout and is always applied first
    common: {
      alt: {
        a: "àáâãäåæ",
        e: "èéêë",
        i: "ìíîï",
        o: "òóôõöœø",
        u: "ùúûü",
        s: "§ß",
        n: "ñ",
        c: "ç",
        y: "ýÿ"
      },
      text: [
        ["q","w","e","r","t","y","u","i","o","p"],
        ["a","s","d","f","g","h","j","k","l"],
        ["shift","z","x","c","v","b","n","m","delete"],
        ["symbol","space","return"]
      ]
    },
    en: {
      alt: {
        a: "àáâãäåāæ",
        e: "èéêëē",
        i: "ìíîïī",
        o: "òóôõöōœø",
        u: "ùúûüū",
      }
    },
    de: {
      alt: {
        a: "ä",
        o: "ö"
      },
      text: [
        ["q","w","e","r","t","z","u","i","o","p"],
        ["a","s","d","f","g","h","j","k","l"],
        ["shift","y","x","c","v","b","n","m","delete"]
      ]
    },
    fr: {
      alt: {
        a: "àáâãäåæ",
        e: "èéêë",
        o: "òóôõöœø"
      },
      text: [
        ["a","z","e","r","t","y","u","i","o","p"],
        ["q","s","d","f","g","h","j","k","l","m"],
        ["shift","w","x","c","v","b","n","'","delete"]
      ]
    },
    iw: {
      alt: {
      },
      text: [
        ["ק","ר","א","ט","ו","ו","ם","פ","delete"],  
        ["ש","ד","ג","כ","ע","י","ח","ל","ך","ף"],
        ["ז","ס","ב","ה","נ","מ","צ","ת","ץ"]
      ]
    },
    nb: {
      alt: {
        a: "äáàâąã",
        e: "éèêëę€",
        i: "íìîï",
        o: "öóòôõ",
        u: "üúùûū",
        s: "śšşß",
        n: "ńñň",
        c: "çćč",
        d: "ðď",
        r: "ř",
        t: "ťþ",
        z: "źžż",
        l: "ł",
        v: "w",
        "æ": "œ",
      },
      text: [
        ["q","w","e","r","t","y","u","i","o","p","å"],
        ["a","s","d","f","g","h","j","k","l","ø","æ"],
        ["shift","z","x","c","v","b","n","m","delete"]
      ]
    },
    ru: {
      alt: {
        a: "àáâãäåæ",
        e: "èéêë",
        i: "ìíîï",
        o: "òóôõöœø",
        u: "ùúûü",
        s: "§ß",
        n: "ñ",
        "ç": "ç",
        y: "ýÿ",
        е: "ё",
        "ь": "ъ",
      },
      text: [
        ["й","ц","у","к","е","н","г","ш","щ","з","х"],
        ["ф","ы","в","а","п","р","о","л","д","ж","э"],
        ["shift","я","ч","с","м","и","т","ь","б","ю","delete"]
      ]
    },
    sr: {
      alt: {
      },
      text: [
        ["љ","њ","е","р","т","з","у","и","о","п","ш"],
        ["а","с","д","ф","г","х","ј","к","л","ч","ћ","ђ"],
        ["shift","ж","џ","ц","в","б","н","м","delete"]
      ]
    },
    sv: {
      alt: {
        a: "áàâąã",
        e: "éèêëę€",
        o: "óòôõ",
        s: "śšşß",
        n: "ńñň",
        c: "çćč",
        y: "ýÿü",
        d: "ðď",
        r: "ř",
        t: "ťþ",
        z: "źžż",
        l: "ł",
        v: "w",
        "ä": "æ",
        "ö": "øœ",
      },
      text: [
        ["q","w","e","r","t","y","u","i","o","p","å"],
        ["a","s","d","f","g","h","j","k","l","ö","ä"],
        ["shift","z","x","c","v","b","n","m","delete"]
      ]
    }
  };

  function merge(from, into) {
    for (var key in from)
      if (!into[key])
        into[key] = from[key];
  }

  var specialKeys = {
    space: true,
    shift: true,
    delete: true,
    return: true,
    symbol: true
  };

  function keyWidth(label, unit) {
    if (!(label in specialKeys))
      return unit;
    if (label == "space")
      return unit * 7.3;
    return unit * 1.5;
  }

  // Merge the common base keyboard layout into all derived layouts.
  var common = layouts.common;
  if (common) {
    delete layouts.common;

    for (var lang in layouts) {
      var layout = layouts[lang];
      merge(common, layout);
      for (var table in common)
        merge(common[table], layout[table]);
    }
  }

  // returns true if a special key is active (on)
  function isOn(element) {
      return element.className.search("_on") != -1;
  }

  // toggle a special key on/off
  function toggle(element) {
      if (isOn(element)) {
	  element.className = element.className.replace("_on", "_off");
	  return;
      }
      element.className = element.className.replace("_off", "_on");
  }

  // turn all regular keys into upper case
  function toggleAllKeys() {
      var keys = document.getElementsByClassName("key");
      for (var n = 0; n < keys.length; ++n) {
	  var textContent = keys[n].textContent;
	  if (textContent.toUpperCase() == textContent)
	      textContent = textContent.toLowerCase();
	  else
	      textContent = textContent.toUpperCase();
	  keys[n].textContent = textContent;
      }
  }

  // onclick handler
  function onclick(e) {
      var label = this.id;
      switch (label) {
      case "shift":
	  toggle(this);
	  toggleAllKeys();
	  break;
      }
      e.preventDefault();
  }

  return {
    display: function(container, mode, lang) {
      if (!mode)
        mode = "text";
      if (!lang)
        lang = navigator.language.substr(0, 2);
      if (!lang)
        lang = "en";
      var layout = layouts[lang] || lang.en;
      var keyboard = layout[mode] || layout.text;
      var rows = document.createElement('ul');
      rows.className = "keyboard-" + mode;

      // calculate the max number of non-special keys in a row
      var max = 0;
      for (var n = 0; n < keyboard.length; ++n) {
        var keys = keyboard[n];
        var width = 0;
        for (var m = 0; m < keys.length; ++m)
          width += keyWidth(keys[m], 1);
        if (width > max)
          max = width;
      }
      var unit = 94 / max;

      for (var n = 0; n < keyboard.length; ++n) {
        var row = document.createElement('li');
        rows.appendChild(row);
        var keys = keyboard[n];
        for (var m = 0; m < keys.length; ++m) {
          var key = document.createElement('div');
          var label = keys[m];
	  key.id = label;
          if (label in specialKeys) {
            key.className = "key special_off " + label;
            key.innerHTML = "&nbsp;";
          } else {
	    key.className = "key";
            key.textContent = label;
          }
          key.style.minWidth = keyWidth(label, unit) + "%";
	  key.onclick = onclick;
          row.appendChild(key);
        }
      }
      container.appendChild(rows);
    }
  };
})();

function OnLoad() {
  var languages = ["en", "de", "fr", "iw", "nb", "ru", "sr", "sv"];
  for (var n = 0; n < languages.length; ++n) {
    var lang = languages[n];
    var div = document.createElement("div");
    IME.display(div, "text", lang);
    document.body.appendChild(div);
  }
}
