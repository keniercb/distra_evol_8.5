/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


/**
 * Esta clase define el conjunto de métodos estáticos para el trabajo con AOP
 */

Ext.namespace('uci.aop.AOPHelper');

uci.aop.AOPHelper.MSG_ERR_JOINPOIN = 'Tipo de joinpoint no válido';
uci.aop.AOPHelper.MSG_ERR_PARSE = 'Error del formato del archivo de configuración';
uci.aop.AOPHelper.MSG_ERR_PARSE.JOINTPOINT_NOT_FOUND = 'No se especificó joinpoint'
uci.aop.AOPHelper.MSG_ERR_PARSE.TARGET_NOT_FOUND = 'No se encontró el destino del consejo';
uci.aop.AOPHelper.MSG_ERR_PARSE.PATTER_REQUIRED = 'Se requiere un patron de nombre de función para aplicar los consejos';
uci.aop.AOPHelper.MSG_ERR_PARSE.POINTCUT_NOT_FOUND = 'No se encontró el pointcut';
uci.aop.AOPHelper.MSG_ERR_PARSE.INVALID_POINTCUT = 'El pointcut no es válido';
uci.aop.AOPHelper.MSG_ERR_PARSE.ADVICE_NOT_FOUND = 'No se encontró el advice';
uci.aop.AOPHelper.MSG_ERR_PARSE.INVALID_ADVICE = 'El advice no es válido, debe ser una función'


/**
 * Agrega un consejo anterior a la ejecución de la(s) función(s)
 *
 * @param {Object/Function}
 *            target
 * @param {String}
 *            method
 * @param {Function}
 *            advice
 * @return {Number}
 */
uci.aop.AOPHelper.addAfterAdvice = function(target, method, advice) {
    target = (target.prototype != null) ? target.prototype : target;
    if (target[method] != null) {
        var aspect, old = target[method];

        aspect = function() {

            var retValue = old.apply(this, arguments);
            advice.apply(this, [arguments, retValue, method]);
            //target[method] = old;
            return retValue;
        }

        aspect.unWave = function() {
            target[method] = old;
        }

        aspect.unWaveAll = function() {
            aspect.unWave();
            if (target[method].unWave)
                target[method].unWaveAll();
        }

        target[method] = aspect;

        return 1;

    } else

        return 0;
}

/**
 * Agrega un consejo posterior a la ejecución del la(s) función(es)
 *
 * @param {Object/Function}
 *            target
 * @param {String}
 *            method
 * @param {Function}
 *            advice
 * @return {Number}
 */
uci.aop.AOPHelper.addBeforeAdvice = function(target, method, advice) {
    target = (target.prototype != null) ? target.prototype : target;
    if (target[method] != null) {
        var aspect, old = target[method];

        aspect = function() {
//            console.log("Antes del aspecto "+ method +" " +this.$className)
            var retValue = advice.apply(this, arguments);
//            console.log("Despues del aspecto "+ method +" " + this.$className);
            var ret = old.apply(this, arguments);
//             console.log("Despues de la funcion "+ method +" " + this.$className);
            return ret;
        }

        aspect.unWave = function() {
            target[method] = old;
        }

        aspect.unWaveAll = function() {
            aspect.unWave();
            if (target[method].unWave)
                target[method].unWaveAll();
        }

        target[method] = aspect;

        return 1;

    } else

        return 0;
}

/**
 * Agrega un consejo cubridor de la(s) función(es)
 *
 * @param {Object/Function}
 *            target
 * @param {String}
 *            method
 * @param {Function}
 *            advice
 * @return {Number}
 */
uci.aop.AOPHelper.addAroundAdvice = function(target, method, advice) {
    target = (target.prototype != null) ? target.prototype : target;
    if (target[method] != null) {
        var aspect, old = target[method];

        aspect = function() {
            return advice.apply(this, [arguments, old]);
        }

        aspect.unWave = function() {
            target[method] = old;
        }

        aspect.unWaveAll = function() {
            aspect.unWave();
            if (target[method].unWave)
                target[method].unWaveAll();
        }

        target[method] = aspect;

        return 1;

    } else

        return 0;
}

/**
 * Agrega un consejo cubridor que se invoca si ocurre excepción en la(s)
 * función(es)
 *
 * @param {Object/Function}
 *            target
 * @param {String}
 *            method
 * @param {Function}
 *            advice
 * @return {Number}
 */
uci.aop.AOPHelper.addAfterThrowingAdvice = function(target, method, advice) {
    target = (target.prototype != null) ? target.prototype : target;
    if (target[method] != null) {
        var aspect, old = target[method];

        aspect = function() {
            try {
                old.apply(this, arguments);
            } catch (except) {
                advice.apply(this, [except]);
            }
        }

        aspect.unWave = function() {
            target[method] = old;
        }

        aspect.unWaveAll = function() {
            aspect.unWave();
            if (target[method].unWave)
                target[method].unWaveAll();
        }

        target[method] = aspect;

        return 1;

    } else

        return 0;
}

/**
 * Inyecta una propiedad (Objeto/Funcion) en el destinatario
 *
 * @param {Object/Function}
 *            target
 * @param {String}
 *            propertyName
 * @param {Object/Function}
 *            initialValue
 * @return {Number}
 */
uci.aop.AOPHelper.addProperty = function(target, propertyName, initialValue) {
    target[propertyName] = initialValue;

    target[propertyName].unWave = function() {
        target[propertyName] = undefined;
    }

    target[propertyName].unWaveAll = function() {
        target[propertyName].unWave();
    }
}


/**
 * Aplica tejido para el pointcut dado, en el joinpoint especificado aplicado el
 * advice
 *
 * @param {uci.aop.Pointcut}
 *            pointcut
 * @param {uci.aop.JoinpointType}
 *            joinpoint
 * @param {Function}
 *            advice
 * @return {Number}
 */
uci.aop.AOPHelper.weave = function(pointcut, joinpoint, advice) {
    var target = (pointcut.target.prototype != null)
        ? pointcut.target.prototype
        : pointcut.target;

    if ((joinpoint != uci.aop.JoinPointType.INTRODUCTION)
        && (typeof(target[pointcut.pattern]) == 'undefined')) {
        var count = 0;
        for (var property in target) {
            if ((property != null) && (property instanceof Function)
                && (property.match(pointcut.pattern))) {
                switch (joinpoint) {
                    case uci.aop.JoinPointType.BEFORE :
                        count++;
                        uci.aop.AOPHelper.addBeforeAdvice(pointcut.target,
                            property, advice);
                        break;
                    case uci.aop.JoinPointType.AFTER :
                        count++;
                        uci.aop.AOPHelper.addAfterAdvice(pointcut.target,
                            property, advice);
                        break;
                    case uci.aop.JoinPointType.AROUND :
                        count++;
                        uci.aop.AOPHelper.addAroundAdvice(pointcut.target,
                            property, advice);
                        break;
                    case uci.aop.JoinPointType.AFTER_THROW :
                        count++;
                        uci.aop.AOPHelper.addAfterThrowingAdvice(
                            pointcut.target, property, advice);
                        break;
                    default :
                        throw new Error(uci.aop.AOPHelper.MSG_ERR_JOINPOIN);
                        break;
                }
            }
        }
        return count;
    } else if (joinpoint != uci.aop.JoinPointType.INTRODUCTION) {
        uci.aop.AOPHelper
            .addProperty(pointcut.target, pointcut.pattern, advice);
        return 1;
    }
    return 0;
}

/**
 * Recorre un objeto o función buscando las anotaciones y activando las mismas.
 * Pueden ser anotados los objetos y sus propiedades, para ello es necesario
 * que el miembro anotado posea una propiedad $AOPAnnotations que representa el arreglo
 * de anotaciones aplicadas.
 * Una anotación válida puede ser aquella que herede de la clase uci.aop.Annotation o un objeto
 * con la función init(reference) donde reference recive el miembro al que se aplica la anotación
 * @param {Function/Object} target
 * @param {String} memberName (Opcional)
 */
uci.aop.AOPHelper.parseAOPAnnotations = function(target, memberName) {
    if (target.$AOPAnnotations != null)
        Ext.each(target.$AOPAnnotations, function(annotation) {
            annotation.init(target, memberName);
        }, this);

    for (var property in target) {
        if (property != null)
            uci.aop.parseAOPAnnotations(target[property], property);
    }
}

uci.aop.AOPHelper.parseAOPConfig = function(config) {
    if (config != null) {
        if (config instanceof String)
            config = Ext.decode(config);

        if (config.aspect != null) {
            Ext.each(config.aspect, function(aspect) {
                if (aspect.pointcut.target == null)
                    throw new Error("");
                uci.aop.AOPHelper.weave(aspect.pointcut, aspect.joinpoint, aspect.advice);
            }, this);
        }
    }
}


Ext.ns("Ext.form.field")
Ext.form.field.Text = Ext.form.TextField;
Ext.tab.Panel = Ext.TabPanel;
Ext.grid.Panel = Ext.extend(Ext.grid.GridPanel,{

    constructor: function(config){
        config = config || {};
        if(config.columns){
            var col = config.columns;
            Ext.each(col,function(index){
                    if(index.text)
                        index["header"]=index.text;

            })
        }
        if(config.store && typeof(config.store)=="string"){
            config.store = Ext.StoreManager.get(config.store);
        }
        Ext.apply(this, config);
        Ext.grid.Panel.superclass.constructor.call(this, config);
    }
})
/*uci.aop.AOPHelper.addBeforeAdvice(Ext.grid.GridPanel,"initComponent",function(){
    console.log(arguments)
})*/



Ext.namespace("Zeolides.app");
Zeolides.app.Standalone = Ext.extend(Ext.util.Observable, {
	constructor: function(config) {
        config = config || {};        
        Ext.apply(this, config);
        Zeolides.app.Standalone.superclass.constructor.call(this, config);
        this.addEvents({
            ready: true,
            beforeunload: true,
            unload: true
        });        
        Ext.onReady(this.on_ready.createDelegate(this));
    }, 
    on_ready:function(){
        if(this.main){
            this.main.call(this);
        }

	},
	loadLanguage:function(){
		
	},
    addMainView:function(view){
        this.view = new Ext.Viewport({
            layout: "fit",
           items:[view]
        });
       // this.startApp();
    },
	on_beforeunload:function(){
	}
	
    
});


