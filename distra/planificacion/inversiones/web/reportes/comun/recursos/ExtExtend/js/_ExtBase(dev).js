/**

 * Created by jp on 28/01/14.
 */

/**
 * Script con la configuracion basica del objeto
 */

var ExtExtend = (function(){

    if(!Ext) return;

    var _ = {
        ExtVersion : Ext.version[0],

        Utils : {

            specialChars: [
                {val: "a", let: "áàãâä"},
                {val: "e", let: "éèêë"},
                {val: "i", let: "íìîï"},
                {val: "o", let: "óòõôö"},
                {val: "u", let: "úùûü"},

                {val: "A", let: "ÁÀÃÂÄ"},
                {val: "E", let: "ÉÈÊË"},
                {val: "I", let: "ÍÌÎÏ"},
                {val: "O", let: "ÓÒÕÔÖ"},
                {val: "U", let: "ÚÙÛÜ"}
            ],

            replaceSpecialChars: function (str) {
                //var $spaceSymbol = '-';
                var regex;
                var returnString = str;
                for (var i = 0; i < this.specialChars.length; i++) {
                    regex = new RegExp("[" + this.specialChars[i].let + "]", "g");
                    returnString = returnString.replace(regex, this.specialChars[i].val);
                    regex = null;
                }
                return returnString;
                /*returnString.replace(/\s/g, $spaceSymbol)*/
            },

            // Devuelve una copia de una cadena con texto reemplazado, insensible a mayúsculas y minúsculas
            ireplace: function (cadena, rgExp, reemplazo) {
                if (typeof rgExp != 'string')
                    return cadena.replace(rgExp, reemplazo);

                var cadenaLower = cadena.toLowerCase();
                var rgExpLower = rgExp.toLowerCase();

                var indexOf = cadenaLower.indexOf(rgExpLower);
                if (indexOf >= 0) {
                    var substr = cadena.substr(indexOf, rgExpLower.length);

                    return cadena.replace(substr, reemplazo);
                }
                else {
                    return cadena;
                }
            },

            /**
             * Función para aplicar a un estilo a una cadena contenida dentro de otra sin importar minusculas o mayusculas.
             * @public
             * @param {String} cadena Cadena en la que se quiere remplazar.
             * @param {String} remp Cadena coincidente.
             * @param {String} tag Etiqueta HTML contenedora del estilo, por lo general es un (span).
             * @param {String} sty Estilo que se desea aplicar a la subcadena.
             * @return {String} Cadena donde se le aplica a la subcadena el estilo
             */
            ireplaceStyle: function (cadena, remp, tag, sty) {
                if (!cadena || !cadena.toLowerCase) {
                    cadena = '';
                }
                if (typeof(remp) != 'string')
                    return cadena;
                if (!sty)
                    sty = '';
                var valueLower = cadena.toLowerCase();
                var valueSearchLower = remp.toLowerCase();

                var indexOf = valueLower.indexOf(valueSearchLower);
                if (indexOf >= 0) {
                    var substr = cadena.substr(indexOf, valueSearchLower.length);

                    //return cadena.replace(substr, '<span style="text-decoration: underline;">' + substr + '</span>');
                    return cadena.replace(substr, '<' + tag + ' style="' + sty + '">' + substr + '</' + tag + '>');
                }

                return cadena;
            },

            /**
             * Función para aplicar a un contenedor las key de un botón.
             * @public
             * @param {Ext.Button} button Boton que contiene el handler.
             * @param {Ext.Panel} keyContainer Contenedor de la key.
             */
            applyKey: function (button, keyContainer) {
                if (button && keyContainer && button.key && button.handler) {
                    if (!keyContainer.keyMap) { //si no tiene keyMap se lo creo.
                        keyContainer.getKeyMap();
                    }

                    button.key.stopEvent = true;
                    button.key.scope = button;

                    button.key.handler = function (k, e) {
                        e.stopPropagation();
                        e.preventDefault();

                        if (!this.disabled)
                            this.handler.call(this.scope || this, button);
                    };

                    if (!button.underline && button.getText) {
                        var newText = _.Utils.ireplaceStyle(button.getText(), button.key.key, 'span', 'text-decoration: underline;');
                        button.setText(newText);
                        button.underline = true; //para que no se repita el subrayado.
                    }

                    keyContainer.keyMap.addBinding(button.key);
                }
            },

            /**
             * Función para aplicar a un contenedor las key de de varios botones verificando si el contenedor esta rendered.
             * @public
             * @param {Ext.Button/Array} buttons Boton ó botones que contiene los handler.
             * @param {Ext.Panel} keyContainer contenedor de las key.
             */
            applyButtonsKey: function (buttons, keyContainer) {
                var me = this;

                if (keyContainer) {
                    if (keyContainer.rendered) {
                        if (Ext.isArray(buttons)) {
                            for (var i = 0; i < buttons.length; i++) {
                                var button = buttons[i];
                                this.applyKey(button, keyContainer);
                            }
                        }
                        else {
                            this.applyKey(buttons, keyContainer);
                        }
                    }
                    else {
                        keyContainer.on('afterrender', function () {
                            if (Ext.isArray(buttons)) {
                                for (var i = 0; i < buttons.length; i++) {
                                    var button = buttons[i];
                                    me.applyKey(button, keyContainer);
                                }
                            }
                            else {
                                me.applyKey(buttons, keyContainer);
                            }
                        });
                    }
                }
            },

            /*
             @Funcion que devuelve descripcion de las teclas calientes
             @param      keyObj  {Ext.Binding object}    Objeto con la configuracion de binding
             @return {string}
             */
            printHotKeyDescription: function (keyObj) {
                var htk = '(';
                if (keyObj.key) {
                    var ly = {
                        13: 'Enter',
                        46: 'DEL'
                    };

                    if (keyObj.ctrl) {
                        htk += 'Ctrl';
                    }

                    if (keyObj.shift) {
                        htk += keyObj.ctrl ? '+Shift' : 'Shift';
                    }

                    if (keyObj.alt) {
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

            /*
             @Funcion que devuelve estilo del tooltip con descripcion de las teclas calientes
             @param      keyObj  {Ext.Binding object}    Objeto con la configuracion de binding
             @attribute   style   {object}    Objeto con los estilos que se le aplicaran a la descripcion de la tecla caliente    defaultValue={'font-weight': 'bold'}
             @return {string}
             */
            getTooltip: function (keyObj) {
                if (_.Utils.isObject(keyObj) && keyObj.key) {

                    var defStyle = Ext.apply(keyObj.style ? keyObj.style : {}, {
                        'font-weight': 'bold'
                    });

                    function buildStyle(styleObj) {
                        var style = '';
                        for (var st in styleObj) {
                            if (styleObj.hasOwnProperty(st))
                                style += st + ':' + styleObj[st] + ';';
                        }
                        return style;
                    }

                    return ' <span style="' + buildStyle(defStyle) + '">' + this.printHotKeyDescription(keyObj) + '</span>';
                }
                return '';
            },

            strPad: function (input, pad_length, pad_string, pad_type) {
                var half = '',
                    pad_to_go;

                var str_pad_repeater = function (s, len) {
                    var collect = '';

                    while (collect.length < len) {
                        collect += s;
                    }
                    collect = collect.substr(0, len);

                    return collect;
                };

                input += '';
                pad_string = pad_string !== undefined ? pad_string : ' ';

                if (pad_type !== 'STR_PAD_LEFT' && pad_type !== 'STR_PAD_RIGHT' && pad_type !== 'STR_PAD_BOTH') {
                    pad_type = 'STR_PAD_RIGHT';
                }
                if ((pad_to_go = pad_length - input.length) > 0) {
                    if (pad_type === 'STR_PAD_LEFT') {
                        input = str_pad_repeater(pad_string, pad_to_go) + input;
                    }
                    else if (pad_type === 'STR_PAD_RIGHT') {
                        input = input + str_pad_repeater(pad_string, pad_to_go);
                    }
                    else if (pad_type === 'STR_PAD_BOTH') {
                        half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
                        input = half + input + half;
                        input = input.substr(0, pad_length);
                    }
                }

                return input;
            },

            hex2Dec: function (pV) {
                return parseInt(pV, 16);
            },

            dec2Hex: function (pV) {
                var hexadecimal = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"],
                    hexaDec = Math.floor(pV / 16),
                    hexaUni = pV - (hexaDec * 16);

                return hexadecimal[hexaDec] + hexadecimal[hexaUni];
            },

            rgb2Hex: function (pRGB) {
                /*var hex = "#";

                 hex += this.strPad(this.dec2Hex(pRGB[0]), 2, "0", 'STR_PAD_LEFT');

                 hex += this.strPad(this.dec2Hex(pRGB[1]), 2, "0", 'STR_PAD_LEFT');

                 hex += this.strPad(this.dec2Hex(pRGB[2]), 2, "0", 'STR_PAD_LEFT');*/

                return '#' +
                    this.strPad(this.dec2Hex(pRGB[0]), 2, "0", 'STR_PAD_LEFT') +
                    this.strPad(this.dec2Hex(pRGB[1]), 2, "0", 'STR_PAD_LEFT') +
                    this.strPad(this.dec2Hex(pRGB[2]), 2, "0", 'STR_PAD_LEFT');
            },

            hex2rgb: function (hex) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : false;
            },

            createColorGradient: function (pInitial, pFinal, pClasses) {
                var gradColors = [],
                    actualColor = [],
                    iter = 1, i,
                    dif = [];
                for (i = 0; i < 3; i++) {
                    dif[i] = Math.floor((pFinal[i] - pInitial[i]) / pClasses);
                }

                while (iter < pClasses) {
                    for (i = 0; i < 3; i++) {
                        actualColor[i] = (iter * dif[i]) + pInitial[i];
                    }
                    gradColors.push(this.rgb2Hex(actualColor));
                    iter++;
                }
                for (i = 0; i < 3; i++) {
                    actualColor[i] = pFinal[i] - ((iter - pClasses) * dif[i]);
                }

                gradColors.push(this.rgb2Hex(actualColor));

                return gradColors;
            },

            exists: function (variableName) {
                eval('var variableType = typeof(' + variableName + ')');
                return variableType != 'undefined';
            },

            array_unshift: function (array) {
                //  discuss at: http://phpjs.org/functions/array_unshift/
                // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                // improved by: Martijn Wieringa
                // improved by: jmweb
                //        note: Currently does not handle objects
                //   example 1: array_unshift(['van', 'Zonneveld'], 'Kevin');
                //   returns 1: 3

                var i = arguments.length;

                while (--i !== 0) {
                    arguments[0].unshift(arguments[i]);
                }

            },

            //------------------------------------------

            /**
             * Funcion que verifica si el parametro es un Objeto(Object)
             * @param p
             * @returns {boolean}
             */
            isObject : function(p){
                return _.Utils.getTypeOf(p) == 'Object';
            },

            /**
             * Funcion que verifica si el parametro es un Array
             * @param p
             * @returns {boolean}
             */
            isArray : function(p){
                return _.Utils.getTypeOf(p) == 'Array';
            },

            /**
             * Funcion que verifica si el parametro es un String
             * @param p
             * @returns {boolean}
             */
            isString : function(p){
                return _.Utils.getTypeOf(p) == 'String';
            },

            /**
             * Funcion que verifica si el parametro es un Number
             * @param p
             * @returns {boolean}
             */
            isNumber : function(p){
                return _.Utils.getTypeOf(p) == 'Number';
            },

            /**
             * Funcion que verifica si el parametro es una funcion
             * @param p
             * @returns {boolean}
             */
            isFunction : function(p){
                return _.Utils.getTypeOf(p) == 'Function';
            },

            /**
             * Funcion que verifica si el parametro es una expresion regular
             * @param p
             * @returns {boolean}
             */
            isRegExp : function(p){
                return _.Utils.getTypeOf(p) == 'RegExp';
            },

            /**
             * Funcion que retorna tipo de objeto pasado por parametro
             * @param p
             * @returns {string}(Object|Array|String|Number.....)
             */
            getTypeOf : function(p){
                return (Object.prototype.toString.apply(p)).replace('[object ','').replace(']','');
            },

            /**
             * Funcion que clona un objeto
             * @param pO Objeto a clonar puede ser Object o Array
             * @param pCloneProto Define se se clonara el prototipo del objeto default=True
             * @returns {*}
             */
            cloneObj : function(pO,pCloneProto){
                var newO = pO,
                    hasProto = false,
                    clonePrt = pCloneProto == undefined ? true : pCloneProto;

                switch(_.Utils.getTypeOf(pO)){
                    case 'Array':{
                        newO = [];
                        for (var i = 0; i < pO.length; i++) {
                            newO.push(pO[i]);
                        }
                    }break;
                    case 'Object':{
                        newO = {};
                        for (var prop in pO) {
                            if(pO.hasOwnProperty(prop))
                                newO[prop] = pO[prop];
                            else
                                hasProto = true;
                        }
                        newO.__proto__ = hasProto && clonePrt  ? _.Utils.cloneObj(newO.__proto__) : newO.__proto__;
                    }break;
                }

                return newO;
            },

            /**
             * Funcion retorna funcion que ejecuta funciones pasadas por parametros de manera secuencial
             * @returns {Function}
             */
            concatFns : function(){
                var th = _.Utils,
                    fns = arguments;

                return function(){
                    var args = arguments;
                    th.each(fns,function(pIndex,pFn){
                        pFn.apply(this,args);
                    },this)
                };
            },

            /**
             * Funcion que Aplica propiedades al primer objeto parametro de los demas objetos pasados por parametros
             * @returns {*}
             */
            apply :function(){
                return _.Utils.applyIf.apply(this,Array.prototype.slice.call(arguments).concat(function(){
                    return true;
                }));
            },

            /**
             * Realiza la misma funcion que "apply" solo que aplicando los cambios solo cuando la funcion pasada como ultimo parametro retorna true,
             * a la funcion se le pasa como parametros la propiedad, objeto destino y como segundo objeto origen
             * @returns {*}
             */
            applyIf : function(){
                var to = arguments[0],
                    utls = _.Utils,
                    isFunction = utls.isFunction,
                    each = utls.each,
                    args = Array.prototype.slice.call(arguments,1),
                    validationFn = args.pop();

                if(!isFunction(validationFn)) return false;

                each(args,function(index,val){
                    each(val,function(prop,objVal){
                        to[prop] = validationFn(prop, to[prop],objVal) ? objVal : to[prop];
                    });
                });

                return to;
            },

            /**
             * "apply" de manera recursiva cada vez que encuentra una propiedad en el objeto destino de tipo Object
             * @returns {*}
             */
            rapply : function(){
                var to = arguments[0],
                    utls = _.Utils,
                    isObject = utls.isObject,
                    each = utls.each,
                    args = Array.prototype.slice.call(arguments,1);

                each(args,function(i,v){
                    each(v,function(prop,val){
                        to[prop] = isObject(to[prop]) && isObject(val) ? utls.rapply(to[prop],val) : val;
                    });
                });

                return to;
            },

            applyTo : function(dest, source, names){

                if(typeof names == 'string'){
                    names = names.split(/[,;\s]/);
                }
                _.Utils.each(names, function(i,name){
                    if(source.hasOwnProperty(name)){
                        dest[name] = source[name];
                    }
                }, this);
                return dest;
            },

            /**
             * Funcion que llama a la sentencia new <Function> pasandole por parametros un Array de parametros como en la sentencia apply
             * @param pObj Clase que se desea crear nueva instancia
             * @param pArgs Parametros contenidos en un array.
             * @returns {Object}
             */
            callNewWithArgs : function(pObj,pArgs){
                var tmpObj = {};

                if(!_.Utils.isFunction(pObj)) return false;

                tmpObj.__proto__ = pObj.prototype;

                pObj.apply(tmpObj,pArgs);

                return tmpObj;
            },

            /**
             * Funcion que ordena un Array a partide de una funcion, si la misma retorna True, procede a intercambiar los elementos pasados por parametros
             * @param pArr
             * @param pFn
             * @returns {Array}
             */
            sort : function(pArr,pFn){
                var tmp;
                for (var i = 0; i < pArr.length; i++) {
                    for (var j = i; j < pArr.length; j++) {
                        if(pFn(pArr[i],pArr[j])){
                            tmp = pArr[i];
                            pArr[i] = pArr[j];
                            pArr[j] = tmp;
                        }
                    }
                }
                return pArr;
            },

            /**
             * Funcion que recorre el objeto pasado por parametro y ejecuta una funcion en cada iteración
             * @param pObj {Object|Array|String} Objeto que se desea recorrer
             * @param pFn {Function} Funcion que se ejecutara, recibe como parametro indice y valor asociado al mismo
             * @param pScope {Object} Ambito en el que se ejecutara la funcion
             */
            each : function(pObj,pFn,pScope){
                switch(_.Utils.getTypeOf(pObj)){
                    case 'Object':{
                        for (var o in pObj) {
                            if(pFn.call((pScope ? pScope : pObj),o,pObj[o]) === null) break;
                        }
                    }break;
                    case 'String':
                    case 'Arguments':
                    case 'Array':{
                        for (var i = 0; i < pObj.length; i++) {
                            if(pFn.call((pScope ? pScope : pObj),i,pObj[i]) === null) break;
                        }
                    }break;
                }
            },

            /**
             * @author: Juan Pablo Bacallao Castillo
             * Funcion para parametrizar una cadena
             * @param pStr 		{string}		Cadena que se desea parametrizar
             * @param pParams	{Object|Array}	Objeto que contiene los parametros de la cadena
             * @return {string}
             *
             * @leyenda
             * 		{<identificador>}	->	Reemplaza esta cadena por el valor del <identificador> en el objeto con los parametros o por nulo en caso de no existir
             * 		{!<identificador>!}	->  Solo verifica si existe el identificador en el objeto con parametros (no lo reemplaza en la cadena)
             * 		{?texto1 <identificador1><identificador1>?}	 -> Elimina toda esta cadena en caso de que no se encuentre algun identificador
             */
            formatStr : function(pStr,pParams){

                var str = pStr, tmpArr, pattern , id, tmpStr,
                    isInitial = arguments.length == 2,
                    tmpRdm = isInitial ? 'tmpStr-'+Math.random() : arguments[2],
                    paramReg = new RegExp('\\{([^\\{\\}]*?)\\}'),
                    isConditional = str.match(new RegExp('^\\?(.*)\\?$')),
                    isCheckingId = str.match(new RegExp('^\\!(.*)\\!$'));

                if(isConditional){
                    tmpArr = isConditional[1].split('|');
                    for(var i = 0 ; i < tmpArr.length ; i ++){
                        tmpStr = tmpArr[i];
                        if(tmpArr[i].indexOf(tmpRdm) == -1){
                            return tmpArr[i];
                        }
                    }
                    return tmpRdm;
                }else{
                    while(tmpArr = str.match(paramReg)){
                        pattern = tmpArr[0];
                        id = tmpArr[1];

                        tmpStr = this.formatStr(id,pParams,tmpRdm);

                        str = str.replace(pattern,tmpStr != undefined ? tmpStr : tmpRdm);
                    }

                    while(str.indexOf(tmpRdm) != -1){
                        str = str.replace(tmpRdm,'');
                    }

                    if(isCheckingId){
                        str = isCheckingId[1];
                    }
                    return isInitial ? str : (pParams[str] ? (isCheckingId ? '' : pParams[str]) : undefined);
                }
            },

            /** todo
             * Funcion que comprueba si un parametro es de un tipo especifico
             * @param pParam
             * @param pValidValue
             * @param pDefaultValue
             * @returns {*}
             */
            checkDataType : function(pParam,pValidValue,pDefaultValue){
                var utl = _.Utils,
                    typeFn = utl.getTypeOf,
                    validType = typeFn(pValidValue),
                    paramType = typeFn(pParam),
                    defVal = pDefaultValue === undefined ? pValidValue : pDefaultValue;

                return validType === paramType ? pParam : (paramType === 'Object' && validType === 'Function' ? (pParam instanceof pValidValue ? pParam : (pDefaultValue != undefined ? pDefaultValue : null)) : defVal);
            },

            /**
             * Funcion que lanza un error a partir del cumplimiento de una condicion pasada
             * @param pErrorCondition {bool}  Condicion para que se emita el mensaje de error  defaultValue=true
             * @param pMessage {string}  Mensaje de error que se lanzará si se cumple la condicion
             */
            throwError : function(pErrorCondition, pMessage){
                var hasCond= arguments.length > 1,
                    cond = hasCond ? pErrorCondition : true,
                    msg = hasCond ? pMessage : pErrorCondition;

                if(cond) throw new Error(msg);
            },

            /**
             * Funcion que lanza un comentario a partir del cumplimiento de una condicion pasada
             * @param pCommentCondition {bool}  Condicion para que se emita el mensaje de comentario  defaultValue=true
             * @param pMessage {string}  Mensaje de comentario que se lanzará si se cumple la condicion
             */
            throwComment : function(pCommentCondition, pMessage){
                var hasCond= arguments.length > 1,
                    cond = hasCond ? pCommentCondition : true,
                    msg = hasCond ? pMessage : pCommentCondition;

                if(cond) throw new Comment(msg);
            },

            wrapObject : function(pWrapperObj,pTarget){
                if(_.Utils.isObject(pWrapperObj) || _.Utils.isObject(pTarget)) return;

                _.Utils.each(pTarget, function(i,v){
                    if(_.Utils.isFunction(v) && i != 'constructor'){
                        pWrapperObj[i] = function(){
                            return v.apply(pTarget,arguments);
                        };
                    }
                });

                return pWrapperObj;
            }
        }
    };

    _.Class = function(pObjectProto){
        var utils = _.Utils,
            fnCheckDataType = utils.checkDataType,
            fnGetAbstractMethod = function(pObj){
                var regIsAbstract = new RegExp('^function \\((.*)\\)\\{\\}$'),
                    res = false;

                utils.each(pObj,function(i,v){
                     if(utils.isFunction(v) && regIsAbstract.test(v.toString())){
                         res = i;
                         return null;
                     }
                });

                return res;
            },
            implementApplyIfFn = function(p){
                return p != 'constructor';
            },
            fnCreateFunctionFromObject = function(obj){
                var funct = function(){};
                funct.prototype = obj;
                return funct;
            },
            fnGetImplementProto = function(pObj){
                var res = [];
                if(utils.isArray(pObj)){
                    utils.each(pObj,function(i,v){
                        res.push(fnGetImplementProto(v));
                    });
                }else{
                    res.push(utils.isFunction(pObj) ? pObj.prototype : (utils.isObject(pObj) ? pObj : {}))
                }
                return res;
            },
            emptyConstructor = function(){},
            proto = fnCheckDataType(pObjectProto,{}),
            abstract = proto.$abstract = fnCheckDataType(proto.$abstract,false),
            parent = proto.$extend != undefined ? proto.$extend : false,
            parent = !parent ? emptyConstructor : (utils.isFunction(parent) ? parent : (utils.isObject(parent) ? (fnCreateFunctionFromObject(parent)) : emptyConstructor)),
            implement = fnGetImplementProto(proto.$implement),


            //tmpImplement = utils.applyIf({},implement,implementApplyIfFn),
            tmpImplement = utils.applyIf.apply(this,((([{}]).concat(implement)).concat(implementApplyIfFn))),

            proto = utils.apply(tmpImplement,proto),

            //proto = utils.apply(implement,proto),

            classFn = Ext.extend(parent,proto), abstractMethod;

        utils.apply(classFn,{
            $abstract : abstract,
            $implement : implement.length == 1 ? implement[0] : implement,
            $parent : parent,
            $parentProto : classFn.superclass
        });
            /*implement = fnGetImplementProto(proto.$implement),
            //tmpProtoImplement = utils.applyIf.apply(this,( ( ([{}]).concat(implement) ).concat([implementApplyIfFn]) )),
            tmpProtoImplement = utils.applyIf({},implement[0],implementApplyIfFn),
            abstract = proto.$abstract = fnCheckDataType(proto.$abstract,false),
            proto = utils.apply(tmpProtoImplement,proto),
            classFn = Ext.extend(parent,proto), abstractMethod;

        utils.apply(classFn,{
            $abstract : abstract,
            $implement : tmpProtoImplement,
            $parent : parent,
            $parentProto : classFn.superclass
        });*/

        if(!abstract && classFn.$parent.$abstract){
            abstractMethod = fnGetAbstractMethod(classFn.prototype);
            _.Utils.throwError(utils.isString(abstractMethod),'Redefine method: ' + abstractMethod + '.');
        }

        return classFn;
    };

    _.FacadeFactory = _.Class({
        facadeObjParent : null,
        facadeObj : null,
        objects : null,
        addObject : function(pId,pObj){
            var th = this,
                utls = _.Utils,
                isObjObj = utls.isObject(pObj);

            if(!pId && !pObj) return false;

            if(utls.isObject(pId)){
                utls.each(pId,function(prop,val){
                    th.addObject(prop,val) ? val : false;
                });
                return true;
            }else{
                if(isObjObj){
                    th.objects[pId] = pObj;
                    return true;
                }else{
                    return false;
                }
            }
        },
        getObject : function(pId,pAbstract){
            var th = this,
                abstract = _.Utils.checkDataType(pAbstract,false),
                obj = th.objects[pId],
                facadeBaseClass = th.getFacadeObjClass(pId);

            if(obj){
                obj.$extend = facadeBaseClass;
                obj.$abstract = abstract ? true : undefined;
            }
            return (obj ? _.Class(obj) : facadeBaseClass);
        },
        getFacadeObjClass : function(pId){
            var th = this,
                facadeObj = th.facadeObj,
                parent = th.facadeObjParent,
                parent = parent ? (parent instanceof _.FacadeFactory ? parent.getObject(pId) : parent) : false,
                isFacade = facadeObj instanceof _.FacadeFactory;

            facadeObj.$abstract = true;
            facadeObj.$extend = parent ? parent : facadeObj.$extend;

            return facadeObj ? _.Class(facadeObj) : false;
        },
        build : function(pId){
            var th = this,
                args = Array.prototype.slice.call(arguments,1),
                obj = th.getObject(pId);

            return obj ? _.Utils.callNewWithArgs(obj,args) : false;
        },
        constructor: function(pFacadeProto,pConfig){
            var th = this,
                utls = _.Utils,
                facadeObj = th.facadeObj = utls.checkDataType(pFacadeProto,{}),
                config = utls.checkDataType(pConfig,{});

            utls.apply(th,config);
            th.objects = th.addObject(th.objects) ? th.objects : {};
        }
    });

    return _;
})();


