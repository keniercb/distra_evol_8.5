/**
 * @author Miguel GÃ³mez LeÃ³n
 * @class Genesig.Componentes.FormValidator
 * Componente para la validaciÃ³n de un formulario..
 */
var Utils = {

  specialChars: [
    {val: "a", let: "Ã¡Ã Ã£Ã¢Ã¤"},
    {val: "e", let: "Ã©Ã¨ÃªÃ«"},
    {val: "i", let: "Ã­Ã¬Ã®Ã¯"},
    {val: "o", let: "Ã³Ã²ÃµÃ´Ã¶"},
    {val: "u", let: "ÃºÃ¹Ã»Ã¼"},

    {val: "A", let: "ÃÃ€ÃƒÃ‚Ã„"},
    {val: "E", let: "Ã‰ÃˆÃŠÃ‹"},
    {val: "I", let: "ÃÃŒÃŽÃ"},
    {val: "O", let: "Ã“Ã’Ã•Ã”Ã–"},
    {val: "U", let: "ÃšÃ™Ã›Ãœ"}
  ],

  replaceSpecialChars: function(str){
    //var $spaceSymbol = '-';
    var regex;
    var returnString = str;
    for(var i = 0; i < this.specialChars.length; i++){
      regex = new RegExp("[" + this.specialChars[i].let + "]", "g");
      returnString = returnString.replace(regex, this.specialChars[i].val);
      regex = null;
    }
    return returnString;/*returnString.replace(/\s/g, $spaceSymbol)*/
  },

  printHotKeyDescription: function(keyObj){
    var htk = ' (';
    if(keyObj.key){
      var ly = {
        13: 'Enter',
        46: 'DEL'
      };

      if(keyObj.ctrl){
        htk += 'Ctrl';
      }

      if(keyObj.shift){
        htk += keyObj.ctrl ? '+Shift' : 'Shift';
      }

      if(keyObj.alt){
        htk += keyObj.ctrl || keyObj.shift ? '+Alt' : 'Alt';
      }

      var valKey = ly[keyObj.key] ? ly[keyObj.key] : keyObj.key.toUpperCase();
      htk += keyObj.ctrl || keyObj.shift || keyObj.alt ? '+' + valKey : valKey;

      htk += ')';
    }
    else
      htk = '';
    return htk;
  },

  getTooltip: function(keyObj){
    if(typeof keyObj == 'object' && keyObj.key){

      var defStyle = Ext.apply(keyObj.style ? keyObj.style : {}, {
        'font-weight': 'bold'
      });

      function buildStyle(styleObj){
        var style = '';
        for(var st in styleObj){
          if(styleObj.hasOwnProperty(st)){
            style += st + ':' + styleObj[st] + ';';
          }
        }
        return style;
      }

      return '<span style="' + buildStyle(defStyle) + '">' + this.printHotKeyDescription(keyObj) + '</span>';
    }
    return '';

  },

  copyTo: function(dest, source, names){
    if(typeof names == 'string'){
      names = names.split(/[,;\s]/);
    }
    Ext.each(names, function(name){
      if(source.hasOwnProperty(name)){
        dest[name] = source[name];
      }
    }, this);
    return dest;
  },

  /**
   * FunciÃ³n para aplicar a un contenedor las key de de varios botones verificando si el contenedor esta rendered.
   * @public
   * @param {Ext.Button/Array} buttons Boton Ã³ botones que contiene los handler.
   * @param {Ext.Panel} keyContainer contenedor de las key.
   */
  applyButtonsKey: function(buttons, keyContainer){
    var _this = this;
    if(keyContainer){
      if(keyContainer.rendered){
        if(this.isArray(buttons)){
          for(var i = 0; i < buttons.length; i++){
            _this.applyButtonsKey(buttons[i], keyContainer);
          }
        }
        else{
          if(buttons && buttons.key && keyContainer && buttons.handler){
            if(!keyContainer.keyMap){ //si no tiene keyMap se lo creo.
              keyContainer.getKeyMap();
            }

            buttons.key.stopEvent = true;
            buttons.key.scope = buttons;

            buttons.key.handler = function(k, e){
              e.stopPropagation();
              e.preventDefault();

              if(!this.disabled)
                this.handler.call(this.scope || this, buttons);
            };

            if(!buttons.underline && buttons.getText){
              var newText = _this.irreplaceStyle(buttons.getText(), buttons.key.key, 'span', 'text-decoration: underline;');
              buttons.setText(newText);
              buttons.underline = true; //para que no se repita el subrayado.
            }

            keyContainer.keyMap.addBinding(buttons.key);
          }
        }
      }
      else{
        keyContainer.on('render', function(){
          _this.applyButtonsKey(buttons, keyContainer);
        });
      }
    }
  },

  /**
   * FunciÃ³n para aplicar a un estilo a una cadena contenida dentro de otra sin importar minusculas o mayusculas.
   * @public
   * @param {String} cadena Cadena en la que se quiere remplazar.
   * @param {String} remp Cadena coincidente.
   * @param {String} tag Etiqueta HTML contenedora del estilo, por lo general es un (span).
   * @param {String} sty Estilo que se desea aplicar a la subcadena.
   * @return {String} Cadena donde se le aplica a la subcadena el estilo
   */
  irreplaceStyle: function(cadena, remp, tag, sty){
    if(typeof(remp) != 'string')
      return cadena;
    if(!sty)
      sty = '';
    var valueLower = cadena.toLowerCase();
    var valueSearchLower = remp.toLowerCase();

    /*para que no sea sensible a mayusculas*/
    valueLower = Utils.replaceSpecialChars(valueLower);
    valueSearchLower = Utils.replaceSpecialChars(valueSearchLower);

    var indexOf = valueLower.indexOf(valueSearchLower);
    if(indexOf >= 0){
      var substr = cadena.substr(indexOf, valueSearchLower.length);
      return cadena.replace(substr, '<' + tag + ' style="' + sty + '">' + substr + '</' + tag + '>');
    }
    return cadena;
  },

  isArray: ('isArray' in Array) ? Array.isArray : function(value){
    return Object.prototype.toString.call(value) === '[object Array]';
  },

  isObject: ((Object.prototype.toString.call(null) === '[object Object]') ?
    function(value){
      return value !== null && value !== undefined && Object.prototype.toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
    } :
    function(value){
      return Object.prototype.toString.call(value) === '[object Object]';
    }),

  isNumber: function(e){
    return typeof e === "number" && isFinite(e);
  }
};

var FormValidator = function(config){
  var buttons = config.buttons;
  var fields = config.fields;
  var start = (config.autoStartValidator !== false); //por defecto es true
  var keyMapContainer = config.keyMapContainer; //componente contenedor del keymap.
  var buttonsRegister = config.buttonsRegister; //componente contenedor del keymap.
  var otherIsValid = config.otherIsValid;

  var checkDirty = (config.checkDirty !== false);

  /**
   * Activar los eventos segun los tipos de componentes por los cuales se va a probar los cambios en estos
   * @type {{combobox: {evt: string}, combo: {evt: string}, textarea: {evt: string}, textfield: {evt: string}, numberfield: {evt: string}, radio: {evt: string}}}
   */

  var xtypes = {
    checkbox: {
      evt: ['check']
    },
    combobox: {
      evt: ['select']
    },
    combo: {
      evt: ['select']
    },
    textarea: {
      evt: ['keyup']
    },
    textfield: {
      evt: ['keyup']
    },
    numberfield: {
      evt: ['keyup']
    },
    radio: {
      evt: ['check']
    },
    field: {
      evt: ['keyup']
    },
    simplespinnerfield: {
      evt: ['keyup', 'spin']
    },
    colorfield: {
      evt: ['keyup']
    }
  };

  /**
   * FUNCION PARA COMENZAR EL SEGUIMIENTO DE LOS EVENTOS DE LOS CAMPOS.
   * @public
   */
  this.init = function(){
    this.initButtons();
    this.initFields();
  };

  /**
   * FUNCION PARA configurar los botones.
   * @public
   */
  this.initButtons = function(){
    if(buttons){
      var buttonsLength = buttons.length;
      //noinspection JSDuplicatedDeclaration
      for(var i = 0; i < buttonsLength; i++){
        var button = buttons[i];

        if(button && button.handler && !button.reconfiguredHandler){
          button.reconfiguredHandler = true;
          button.fn = button.handler;
          button.handler = function(b){
            if(!b.disabled){
              b.fn.apply(b.scope || b, arguments);
            }
          }
        }
      }
    }

    if(keyMapContainer){
      this.applyButtonsKey(buttons, keyMapContainer);
      if(buttonsRegister){
        this.applyButtonsKey(buttonsRegister, keyMapContainer);
      }
    }
  };

  /**
   * FUNCION PARA COMENZAR EL SEGUIMIENTO DE LOS EVENTOS DE LOS CAMPOS.
   * @public
   */
  this.initFields = function(){
    if(fields){
      this.resetOriginalValues();
      var fieldsLength = fields.length;
      //noinspection JSDuplicatedDeclaration
      for(var i = 0; i < fieldsLength; i++){
        if(fields[i].getXType() && xtypes[ fields[i].getXType()]){
          // Habilitar el trabajo con los eventos de las teclas
          this.initializeEvent(fields[i]);
        }
      }
    }
  };

  /**
   * FunciÃ³n para aplicar a un contenedor las key de de varios botones verificando si el contenedor esta rendered.
   * @public
   * @param {Ext.Button/Array} buttons Boton Ã³ botones que contiene los handler.
   * @param {Ext.Panel} keyContainer contenedor de las key.
   */
  this.applyButtonsKey = function(buttons, keyContainer){
    Utils.applyButtonsKey(buttons, keyContainer);
  };

  /**
   * FunciÃ³n para resetear los valores originales de los campos por los actuales.
   * @public
   */
  this.resetOriginalValues = function(){
    if(fields){
      //--------------------------DESHABILITO TODOS LOS BOTONES------------------------------
      if(buttons){
        habilitarBotones(buttons, false);
      }

      if(!checkDirty){
        //habilitarBotones(buttons, true);
        return;
      }

      for(var i = 0; i < fields.length; i++){
        this.resetOriginalValue(fields[i]);
      }
    }
  };

  /**
   * FunciÃ³n para resetear el valor original de un campo por el actual.
   * @public
   */
  this.resetOriginalValue = function(field){
    if(field.getValue){
      field.originalValue = field.getValue();
    }
    /*if (field.clearInvalid) {
     field.clearInvalid();
     }*/
  };

  /**
   * FUNCION PARA REGISTRAR UN NUEVO XTYPE CON SU EVENTO.
   * @public
   * @param {String} name xtype del elemento.
   * @param {String/Object} props propiedades, si es obj dentro un evt, si no xtypes del padre.
   */
  this.registrarNuevoXtype = function(name, props){
    if(props){
      if(Object.prototype.toString.call(props) === '[object Object]'){
        if(xtypes.hasOwnProperty(name)){
          var addEvent = true;
          for(var j = 0; j < xtypes[name].evt.length; j++){
            if(xtypes[name].evt[j] == props.evt){
              addEvent = false;
              break;
            }
          }

          if(addEvent)
            xtypes[name].evt.push(props.evt);
        }
        else{
          xtypes[name] = {
            evt: [props.evt]
          };
        }
      }
      else if(typeof(props) == 'string' && xtypes[props]){
        xtypes[name] = {
          evt: xtypes[props].evt
        };
      }

      for(var i = 0; i < fields.length; i++){
        if(fields[i].getXType() && xtypes[fields[i].getXType()] && fields[i].getXType() == name){
          // Habilitar el trabajo con los eventos de las teclas para este fild
          this.initializeEvent(fields[i]);
        }
      }
    }
  };

  /**
   * FUNCION PARA HABILITAR o DESABILITAR LOS BOTONES.
   * @public
   * @param {Array} arrayButtons arreglo de botones.
   * @param {boolean} enable propiedad PARA HABILITAR o DESABILITAR.
   */
  var habilitarBotones = function(arrayButtons, enable){
    for(var i = 0; i < arrayButtons.length; i++){
      var button = arrayButtons[i];
      if(button && button.disabled == enable)
        button.setDisabled(!enable);
    }
  };

  /**
   * FUNCION PARA INICIALIZAR EL EVENTO EN UN FIELD....
   * @public
   * @param {Field} field arreglo de botones.
   */
  this.initializeEvent = function(field){
    if(xtypes.hasOwnProperty(field.getXType()) && xtypes[field.getXType()].hasOwnProperty('evt')){
      // Habilitar el trabajo con los eventos de las teclas
      for(var i = 0; i < xtypes[field.getXType()].evt.length; i++){
        if(xtypes[field.getXType()].evt[i] == 'keyup' && !field.enableKeyEvents){
          field.enableKeyEvents = true;

          if(field.rendered){
            field.mon(field.el, 'keyup', field.onKeyUp, field);
            field.mon(field.el, 'keydown', field.onKeyDown, field);
            field.mon(field.el, 'keypress', field.onKeyPress, field);
          }
          else{
            field.on('afterrender', function(){
              this.mon(this.el, 'keyup', this.onKeyUp, this);
              this.mon(this.el, 'keydown', this.onKeyDown, this);
              this.mon(this.el, 'keypress', this.onKeyPress, this);
            });
          }
          break;
        }
      }

      //------------------AGREGO EVENTO A CADA CAMPO DEPENDIENDO DEL XTYPE DEL MISMO--------------
      for(var j = 0; j < xtypes[field.getXType()].evt.length; j++){
        field.on(xtypes[field.getXType()].evt[j], this.check);
      }

      if(!field.isDirty){
        field.isDirty = function(){
          return (this.getValue() != this.originalValue);
        }
      }
    }
  };

  /**
   * FUNCION PARA CHEQUEAR EN TODOS LOS FIELDS SU ESTADO...
   * @public
   */
  this.check = function(){
    if(!start){
      return;
    }

    var fnIsValid = otherIsValid ? otherIsValid : 'isValid';

    var visible;
    for(var i = 0; i < fields.length; i++){
      if(!fields[i].isVisible){
        visible = true;
      }
      else{
        visible = fields[i].isVisible();
      }
      if(!fields[i].disabled && visible && fields[i][fnIsValid] && !fields[i][fnIsValid]()){
        habilitarBotones(buttons, false);
        return;
      }
    }

    if(!checkDirty){
      habilitarBotones(buttons, true);
      return;
    }
    else{
      for(var j = 0; j < fields.length; j++){
        if(!fields[j].isVisible){
          visible = true;
        }
        else{
          visible = fields[j].isVisible();
        }

        if(!fields[j].disabled && visible && fields[j].isDirty()){
          habilitarBotones(buttons, true);
          return;
        }
      }
    }

    habilitarBotones(buttons, false);
  };

  /**
   * FUNCION PARA activar la validaciÃ³n....
   * @public
   */
  this.startValidator = function(){
    start = true;
  };

  /**
   * FUNCION PARA desactivar la validaciÃ³n....
   * @public
   */
  this.stopValidator = function(){
    start = false;
  };

  /**
   * FUNCION para agregar un boton a la validaciÃ³n....
   * @public
   * @param {Button} button Boton que se desea agregar.
   */
  this.addButton = function(button){
    buttons.push(button);
  };

  /**
   * FUNCION cambiar todos los botones del validador.
   * @public
   * @param {Array} pbuttons Botons que se desean agregar.
   */
  this.setButtons = function(pbuttons){
    buttons = pbuttons;
    this.initButtons();
  };

  /**
   * FUNCION para agregar un boton a la validaciÃ³n....
   * @public
   * @param {Field} field Field que se desea agregar.
   */
  this.addField = function(field){
    fields.push(field);
  };

  /**
   * FUNCION que retorna todos los xtypes registrados en el validador....
   * @public
   * @return {{combobox: {evt: string}, combo: {evt: string}, textarea: {evt: string}, textfield: {evt: string}, numberfield: {evt: string}, radio: {evt: string}}}
   */
  this.getXTypes = function(){
    return xtypes;
  };

  this.resetFieldsValues = function(){
    if(fields.length > 0){
      for(var i = 0; i < fields.length; i++){
        fields[i].setValue ? fields[i].setValue(fields[i].originalValue) : '';
        fields[i].clearInvalid ? fields[i].clearInvalid() : '';
      }
      habilitarBotones(buttons, false);
    }
  };

  this.init();
};

