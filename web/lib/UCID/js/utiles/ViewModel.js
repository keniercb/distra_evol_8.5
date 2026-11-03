function addMethod(object, name, fn){
    if ( !object[ name ] )
        object[ name ] = function(){
            if ( object[ "_ovld_"+name+"_"+arguments.length ] ){
                return object[ "_ovld_"+name+"_"+arguments.length ].apply( this, arguments )
            }
            return null;
        }

    object[ "_ovld_"+name+"_"+fn.length ] = fn;

}
//ViewModel
ViewModel = function(config){
    /**
    config = {
        fields:[{
            name:<Nombre del campo~String~>,
            type:<Tipo de dato~String~>,
            pk:<Si es llave~Boolean~>,
            fk:{
                parentClass:<Nombre de la clase padre>,
                fieldParent:<Nombre del atributo que es llave dl padre>
            },
            index:<Alias del campo~String~>,
            notNull:<Si el campo admite valores nullos~Boolean~>
        }],
        insUrl:<url de la funcion de insercion~String~>,
        updUrl:<url de la funcion de actualizacion~String~>,
        delUrl:<url de la funcion de supresion~String~>,
        findUrl:<url de la funcion de busqueda unica~String~>,
        findByUrl:<url de la funcion de busqueda por filtro~String~>
    }
    */
    var object 		= null;
    var isAsync		= (config.asyncObject) ? true: false;

    var insUrl		= (config.insUrl) 	? config.insUrl 	: null;
    var updUrl		= (config.updUrl || config.insUrl) ? ((config.updUrl) ? config.updUrl : config.insUrl) : null;
    var delUrl		= (config.delUrl) 	? config.delUrl 	: null;
    var findUrl		= (config.findUrl) 	? config.findUrl 	: null;
    var findByUrl	= (config.findByUrl)? config.findByUrl          : null;
    var fields 		= config.fields;
    var EVT_MANAGER	= new Ext.util.Observable();
    this.errorReport    = [];
    this.listaErrores   = [
    'Sin errores',
    'No admite valores nulos',
    'El valor no es soportado',
    'El tama&ntildeo es superior al permitido',
    'El tama&ntildeo es inferior al permitido',
    'Error de configuraci&oacute;n'
    ];
    EVT_MANAGER.addEvents({
        "objetoencontrado"	:true,
        "objetonoencontrado"    :true,
        "objetoguardado"	:true,
        "objetoactualizado"	:true,
        "errorguardar"		:true,
        "erroractualizar"		:true,
        "erroreliminar"		:true,
        "objetoeliminado"	:true,
        "falloalguardar"	:true,
        "falloaleliminar"	:true,
        "escritura"		:true,
        "falloenescritura"	:true,
        "actualizado"           :true
    });
    this.getEventManager = function(){
        return EVT_MANAGER;
    };
    this.getName = function(){
        return this.constructor.name;
    };
    this.getClassInstance = function(){
        var className = this.getName();
        var instantiation = 'new '+className+'();';
        return eval(instantiation);
    };
    this.getNewInstance = function(){
        var className = this.getName();
        var instantiation = 'new '+className+'();';
        return eval(instantiation);
    };
    this.on = function(evt,fn,scope){
        EVT_MANAGER.on(evt,fn,scope);
    };
    /*this.fireEvent = function(){
        var eventName   = arguments[0];
        var fireEvt     = "EVT_MANAGER.fireEvent('"+eventName+"'";
        for(var i = 1 ; i < arguments.length ; i ++ ){
            fireEvt     += ",arguments[i]";
        }
        fireEvt     += ")";
        eval(fireEvt);
    };*/
    this.fireEvent = function(evntName,arg1,arg2,arg3,arg4){
        EVT_MANAGER.fireEvent(evntName,arg1,arg2,arg3,arg4);
    };
    this.constructField = function(field){
        if(field.pk && !field.fk){
            object.primaryKeys[field.index] = true;
            field.notNull = true;
        }
        if(field.pk && field.fk){
            field.notNull = true;
        }
        if(field.fk){
            /*var objName		= new field['type']();
			var classBase 	= field['type'];//objName+'()';*/
            var type = (field['type'].name) ? field['type'].name : field['type'];
            object.fields[field.index] = {
                name	:field.name,
                hidden	:false,
                value	:(field.value) ? field.value : null,//(this instanceof objName) ? new classBase : null,//new classBase(),
                isForeing	:true,
                isAsync	:(field.asyncObject) ? true : false,
                type	:(field.type) ? field.type : null,
                notNull	:(field.notNull || field.pk) ? true : false
            };
            if(!object.foreingKeys[type])
                object.foreingKeys[type] 	= [];
            object.foreingKeys[type][field.index]	= [];
            if(field['fk'].length){
                for(var j = 0 ; j < field['fk'].length ; j ++){
                    object.foreingKeys[type][field.index].push({
                        local:field.fk[j].local,
                        foreing:field.fk[j].foreing
                    });
                    fields.push({
                        index	:field.fk[j].local,
                        name	:type,
                        foreing	:true,
                        asociate:field.index,
                        cls	:field.type,
                        hidden	:true,
                        type	:'Numeric',//(fieldType) ? fieldType : null,
                        notNull	:(field.notNull) ? true : false
                    });
                    if(field.pk){
                        object.primaryKeys[field.fk[j].local] = true;
                    }
                    //var fieldType = object.fields[field.index]['value'].getFieldType(field.fk[j].foreing);
                    var valOld      = null;
                    if(object.fields[field.fk[j].local] && object.fields[field.fk[j].local]['value']){
                        valOld  = object.fields[field.fk[j].local]['value'];
                    }
                    object.fields[field.fk[j].local] = {
                        name	:field.fk[j].local,
                        hidden	:true,
                        foreing	:true,
                        asociate    :field.index,
                        cls         :field.type,
                        value	:valOld,
                        type	:'Numeric',//(fieldType) ? fieldType : null,
                        notNull	:(field.notNull) ? true : false
                    };

                }
            }else if(field['fk'] instanceof Object){
                object.foreingKeys[type][field.index].push({
                    local:field.fk.local,
                    foreing:field.fk.foreing
                });
                fields.push({
                    index	:field.fk.local,
                    name	:type,
                    hidden	:true,
                    foreing	:true,
                    asociate:field.index,
                    cls	:field.type,
                    type	:'Numeric',//(fieldType) ? fieldType : null,
                    notNull	:(field.notNull) ? true : false
                });
                if(field.pk){
                    object.primaryKeys[field.fk.local] = true;
                }
                var valOld      = null;
                if(object.fields[field.fk[j].local] && object.fields[field.fk[j].local]['value']){
                    valOld  = object.fields[field.fk[j].local]['value'];
                }
                //var fieldType = object.fields[field.index]['value'].getFieldType(field.fk[j].foreing);
                object.fields[field.fk.local] = {
                    name	:field.fk.local,
                    hidden	:true,
                    foreing	:true,
                    asociate:field.index,
                    cls	:field.type,
                    value	:valOld,
                    type	:'Numeric',//(fieldType) ? fieldType : null,
                    notNull	:(field.notNull) ? true : false
                };
            }
        }else if(field.type == 'file'){
            if(!object.files){
                object.files = {};
            }
            object.files[field.index]  = {
                file    : null,
                url     : field.url
            };
            object.fields[field.index] = {
                name		:field.name,
                hidden		:((field.pk || field.hidden) ? true : false),
                value		:(field.value) ? field.value : null,
                type		:(field.type) ? field.type : null,
                notNull		:(field.notNull || field.pk) ? true : false
            };
        }else{
            object.fields[field.index] = {
                name		:field.name,
                hidden		:((field.pk || field.hidden) ? true : false),
                value		:(field.value) ? field.value : null,
                type		:(field.type) ? field.type : null,
                notNull		:(field.notNull || field.pk) ? true : false
            };
        }
        return true;
    };
    this.constructObject = function(){
        object                      = {};
        if(fields.length > 0){
            object.primaryKeys      = {};
            object.foreingKeys      = {};
            object.asyncObjectsAdd  = [];
            object.asyncObjectsDel  = [];
            object.asyncTypes       = [];
            object.fields           = {};
            object.files            = false;
            for(var i = 0 ; i < fields.length ; i ++){
                this.constructField(fields[i]);
            }
        }
        return true;
    };
    this.updateObject = function(){
        if(fields.length > 0){
            object.primaryKeys 	= {};
            object.foreingKeys	= {};
            object.asyncObjectsAdd	= [];
            object.asyncObjectsDel	= [];
            object.asyncTypes	= [];
            //object.fields		= [];
            for(var i = 0 ; i < fields.length ; i ++){
                this.constructField(fields[i]);
            }
        }
        return true;
    };
    this.constructObject();
    this.addField = function(fieldConf,valor){
        var findField = false;
        if(fields.length > 0){
            for(var i = 0 ; i < fields.length ; i ++){
                if(fields[i].index == fieldConf.index){
                    findField 	= true;
                    fields[i]	= fieldConf
                }
            }
        }
        var value = null;
        if(findField){
            value = (valor) ? valor : object.fields[fieldConf.index].value;
        }else{
            value = (valor) ? valor : null;
            fields.push(fieldConf);
        }
        this.constructField(fieldConf);
        this.set(fieldConf.index,value);
        return true;
    };
    this.removeField = function(index){
        var copyFields              = [];
        if(object.fields[index] && object.fields[index].isForeing){
        //Aqui hay q quitar la llave foranea
        }
        if(object.files && object.files[fields[0].index]){
            object.files[index]     = null;
        }
        object.fields[index]        = null;
        object.primaryKeys[index]   = false;
        if(fields.length > 0){
            for(var i = 0 ; i < fields.length ; i ++){
                if(fields[i].index != index){
                    fields[i].value = object.fields[fields[i].index].value;
                    copyFields.push(fields[i]);
                }else{

            }
            }
        }
        fields  = copyFields;
    };
    this.removeAsyncField = function(type,fieldSync){
        var tmpAsyncType 		= [];
        var tmpAsycObjectsAdd	= [];
        var tmpAsycObjectsDel	= [];
        if(object['asyncTypes'].length > 0){
            for(var i = 0 ; i < object['asyncTypes'].length ; i ++){
                if(object['asyncTypes'][i] != type && object.asyncObjectsAdd[object['asyncTypes'][i]]){
                    tmpAsyncType.push(object['asyncTypes'][i]);
                    tmpAsycObjectsAdd[object['asyncTypes'][i]] 	= object.asyncObjectsAdd[object['asyncTypes'][i]];
                    tmpAsycObjectsDel[object['asyncTypes'][i]] 	= object.asyncObjectsDel[object['asyncTypes'][i]];
                }else if(object['asyncTypes'][i] == type && object.asyncObjectsAdd[object['asyncTypes'][i]] && recursive){
                    for(var a = 0 ; a < object.asyncObjectsAdd[object['asyncTypes'][i]].length ; a ++){
                        object.asyncObjectsAdd[object['asyncTypes'][i]][a].setSync(fieldSync,true);
                    }
                    for(var a = 0 ; a < object.asyncObjectsDel[object['asyncTypes'][i]].length ; a ++){
                        object.asyncObjectsDel[object['asyncTypes'][i]][a].setSync(fieldSync,true);
                    }
                }
            }
        }
        object.asyncObjectsAdd = tmpAsycObjectsAdd;
        object.asyncObjectsDel = tmpAsycObjectsDel;
        object.asyncTypes	= tmpAsyncType;
        return true;
    };
    this.removeAsyncObject = function(type,fieldSync){
        var tmpAsyncType 		= [];
        var tmpAsycObjectsAdd	= [];
        var tmpAsycObjectsDel	= [];
        if(object['asyncTypes'].length > 0){
            for(var i = 0 ; i < object['asyncTypes'].length ; i ++){
                if(object['asyncTypes'][i] != type && object.asyncObjectsAdd[object['asyncTypes'][i]]){
                    tmpAsyncType.push(object['asyncTypes'][i]);
                    tmpAsycObjectsAdd[object['asyncTypes'][i]] 	= object.asyncObjectsAdd[object['asyncTypes'][i]];
                    tmpAsycObjectsDel[object['asyncTypes'][i]] 	= object.asyncObjectsDel[object['asyncTypes'][i]];
                }else if(object['asyncTypes'][i] == type && object.asyncObjectsAdd[object['asyncTypes'][i]] && recursive){
                    for(var a = 0 ; a < object.asyncObjectsAdd[object['asyncTypes'][i]].length ; a ++){
                        object.asyncObjectsAdd[object['asyncTypes'][i]][a].setSync(fieldSync,true);
                    }
                    for(var a = 0 ; a < object.asyncObjectsDel[object['asyncTypes'][i]].length ; a ++){
                        object.asyncObjectsDel[object['asyncTypes'][i]][a].setSync(fieldSync,true);
                    }
                }
            }
        }
        object.asyncObjectsAdd = tmpAsycObjectsAdd;
        object.asyncObjectsDel = tmpAsycObjectsDel;
        object.asyncTypes	= tmpAsyncType;
        return true;
    };
    this.setSync = function(campo,sync){
        if(object.fields[campo]){
            object.fields[campo].isAsync = !sync;
        /*if(object.fields[campo].value)
				object.fields[campo].value.removeAsyncField(this.getName());*/
        }
        return true;
    };
    this.setFK = function(classBase,value){
        if(fields.length > 0){
            for(var i  = 0 ; i < fields.length ; i++){
                if(object.foreingKeys[fields[i].type] && object.foreingKeys[fields[i].type][fields[i].index] && object.foreingKeys[fields[i].type][fields[i].index].classParent == classBase){
                    object.fields[fields[i].index].value	= value;
                    return true;
                }
            }
        }
        return false;
    }
    this.evalType = function(type,val){
        if(type instanceof String){
            switch(type.toLowerCase()){
                case 'String' : {
                    return new String (val);
                };

                break;
                case 'Numeric' : {
                    return new Number (val);
                };

                break;
                case 'Boolean' : {
                    return new Boolean (val);
                };

                break;
                case 'Array' : {
                    if(val instanceof Array)
                        return val;
                    return new Array (val);
                };

                break;
                case 'Object' : {
                    return new Object (val);
                };

                break;
                case 'ViewModel' : {
                    return new ViewModel(val);
                };

                break;
                case 'XTObjectsAsosiation' : {
                    return new XTObjectsAsosiation(this,val);
                };

                break;
                default : {
                    return val;
                };

                break;
            }
        }else
            return val;
    };
    addMethod(this, "set", function(campo,valor){
        var valueFinal = valor;
        var _this = this;
        if(object.fields[campo] && object.fields[campo]['type'] != 'file'){
            var type = object.fields[campo]['type'];
            if(object.fields[campo].isForeing){
                var objectTmp = new object.fields[campo]['type']();
                type = objectTmp.getName();
                if(object.foreingKeys[type] && object.foreingKeys[type][campo]){
                    if(object.fields[campo].isAsync && valor && valor.superClass && valor.superClass == ViewModel){
                        valor.addAsyncObj(this);
                        for(var a = 0 ; a < object.foreingKeys[type][campo].length ; a++){
                            var fieldObj = object.foreingKeys[type][campo][a].local;
                            var valueField	= valor.get(object.foreingKeys[type][campo][a].foreing);
                            this.set(fieldObj,valueField);
                        }
                    }else if(valor instanceof Object && !valor.superClass){
                        var newObj = new object.fields[campo]['type']();
                        newObj.set(valor);
                        valueFinal = newObj;
                        for(var a = 0 ; a < object.foreingKeys[type][campo].length ; a++){
                            var fieldObj = object.foreingKeys[type][campo][a].local;
                            var valueField	= newObj.get(object.foreingKeys[type][campo][a].foreing);
                            this.set(fieldObj,valueField);
                        }
                    }else if(valor instanceof Object && valor.superClass){
                        newObj = valor;
                        valueFinal = newObj;
                        for(var a = 0 ; a < object.foreingKeys[type][campo].length ; a++){
                            var fieldObj = object.foreingKeys[type][campo][a].local;
                            var valueField	= newObj.get(object.foreingKeys[type][campo][a].foreing);
                            this.set(fieldObj,valueField);
                        }
                    }else if(!valor){
                        var valorAnt = object.fields[campo].value;
                        if(valorAnt && valorAnt.superClass && valorAnt.superClass == ViewModel){
                            valorAnt.removeAsyncObj(this);
                        }
                        for(var a = 0 ; a < object.foreingKeys[type][campo].length ; a++){
                            var fieldObj    = object.foreingKeys[type][campo][a].local;
                            this.set(fieldObj,null);
                        }
                    }else{
                        var valorAnt = object.fields[campo].value;
                        if(valorAnt && valorAnt.superClass && valorAnt.superClass == ViewModel){
                            valorAnt.removeAsyncObj(this);
                        }
                    }
                }
            }else if(object.fields[campo].foreing){
                var objAsociate = this.get(object.fields[campo].asociate);
                if(objAsociate == null){
                    objAsociate = new object.fields[campo]['cls']();
                }
                var fielRemote		= null;
                var fieldsAsoc		= object.foreingKeys[objAsociate.getName()][object.fields[campo].asociate];
                for(var a = 0 ; a < fieldsAsoc.lenght ; a++){
                    if(fieldsAsoc[a]['local'] == campo)
                        fielRemote	= fieldsAsoc[a]['foreing'];
                }
                if(fielRemote){
                    objAsociate.set(fielRemote,valor);
                    this.set(object.fields[campo].asociate,objAsociate);
                }
            }else{
                valueFinal = this.evalType(object.fields[campo].type,valor);
            }
            object.fields[campo].value	= valueFinal;
        }else if(object.fields[campo] && object.fields[campo]['type'] == 'file'){
            object.files[campo].file = null;
            object.fields[campo].value = {};
            object.fields[campo].value = {
                title     : valor.title,
                iddocument: valor.iddocument,
                metadata  : valor.metadata,
                workspace : valor.workspace
            };
            if(valor.form && valor.form instanceof Ext.FormPanel)
                object.files[campo].file = valor.form;
        }
        if(object.fields[campo] && object.fields[campo].isForeing){
            object.fields[campo].value.on('validate',function(obj,val,all){
                if(!val){
                    if(object.fields[campo].notNull)
                        EVT_MANAGER.fireEvent('validate',_this,false,true);
                }else{
                    _this.isValid();
                }
            })
        }
        this.isValid();
        //this.isValidWithOutPK()
        return true;
    });
    addMethod(this, "set", function(array){
        if(array.length > 0){
            if(array[0][0]){
                for(var i = 0 ; i < array.length ; i ++){
                    if(object.fields[array[i][0]]){
                        this.set(array[i][0],array[i][1]);
                    }
                }
            }else if(array[0].campo){
                for(var i = 0 ; i < array.length ; i ++){
                    if(object.fields[array[i].campo]){
                        this.set(array[i].campo,array[i].valor);
                    }
                }
            }
        }else if(array instanceof Object){//Arreglo asociativo
            if(array.data && array.data instanceof Object){
                for(var i = 0 ; i < fields.length ; i ++){
                    if(array.data[fields[i].index]){ //|| array[fields[i].index] == null){
                        this.set(fields[i].index,array.data[fields[i].index]);
                    }
                }
            }
            for(var i = 0 ; i < fields.length ; i ++){
                if(array[fields[i].index]){ //|| array[fields[i].index] == null){
                    this.set(fields[i].index,array[fields[i].index]);
                }
            }
        }
        return true;
    });
    //this.setFromRecord
    this.hasListeners = function(evtName){
        EVT_MANAGER.hasListener(evtName);
    };
    this.addAsyncObj = function(AsyncObject){
        var type = AsyncObject.getName();
        if(object && !object.asyncObjectsAdd[type]){
            object.asyncTypes.push(type);
            object.asyncObjectsAdd[type]	= [];
            object.asyncObjectsDel[type]	= [];
        }
        var find = false;
        for(var i = 0 ; i < object.asyncObjectsAdd[type].length ; i ++){
            if(object.asyncObjectsAdd[type][i].getPKValues() == AsyncObject.getPKValues()){
                find = true;
                object.asyncObjectsAdd[type][i] = AsyncObject.getPKValues();
            }
        }
        if(!find)
            object.asyncObjectsAdd[type].push(AsyncObject);

        var asyncObjectsDelTmp 		= [];
        for(var i = 0 ; i < object.asyncObjectsDel[type].length ; i ++){
            if(object.asyncObjectsDel[type][i].getPKValues() != AsyncObject.getPKValues()){
                asyncObjectsDelTmp.push(object.asyncObjectsDel[type][i]);
            }
        }
        object.asyncObjectsDel[type] = asyncObjectsDelTmp;
        return true;
    };
    this.removeAsyncObj = function(AsyncObject){
        var type = AsyncObject.getName();
        if(object && !object.asyncObjectsDel[type]){
            object.asyncTypes.push(type);
            object.asyncObjectsDel[type]	= [];
        }
        var find = false;
        for(var i = 0 ; i < object.asyncObjectsDel[type].length ; i ++){
            if(object.asyncObjectsDel[type][i].getObject() == AsyncObject.getObject()){
                find = true;
                object.asyncObjectsDel[type][i] = AsyncObject;
            }
        }
        if(!find)
            object.asyncObjectsDel[type].push(AsyncObject);

        var asyncObjectsAddTmp 		= [];
        if(object.asyncObjectsAdd && object.asyncObjectsAdd[type]){
            for(var i = 0 ; i < object.asyncObjectsAdd[type].length ; i ++){
                if(object.asyncObjectsAdd[type][i].getObject() != AsyncObject.getObject()){
                    asyncObjectsAddTmp.push(object.asyncObjectsAdd[type][i]);
                }
            }
        }else{
            object.asyncObjectsAdd[type] = [];
        }
        object.asyncObjectsAdd[type] = asyncObjectsAddTmp;
        return true;
    };
    this.getAsyncObj = function(type){
        if(!object.asyncObjectsAdd[type]){
            return {
                adicionados:object.asyncObjectsAdd[type],
                eliminados:object.asyncObjectsDel[type]
            };
        }
        return false;
    };
    this.getObject = function(){
        return object;
    };
    this.setUrl = function(urlType,url){
        switch(urlType){
            case 'insertar':{
                insUrl = url;
            };

            break;
            case 'modificar':{
                updUrl = url;
            };

            break;
            case 'eliminar':{
                delUrl = url;
            };

            break;
            case 'encontrar':{
                findUrl = url;
            };

            break;
            case 'filtrar':{
                findByUrl = url;
            };

            break;
        }
    };
    this.getUrl = function(urlType){
        switch(urlType){
            case 'insertar':{
                return insUrl;
            };
            break;
            case 'modificar':{
                return updUrl;
            };
            break;
            case 'eliminar':{
                return delUrl;
            };
            break;
            case 'encontrar':{
                return findUrl;
            };
            break;
            case 'filtrar':{
                return findByUrl;
            };
            break;
        }
    };
    this.get = function(valores){
        var objeto = null;
        if(valores){
            if(valores.length > 0){
                if(valores.charAt(0)){
                    if(object.fields[valores]){
                        if(object.fields[valores]['type'].name){
                            object.fields[valores].value = (object.fields[valores].value) ? object.fields[valores].value : new object.fields[valores]['type']();
                        }
                        return object.fields[valores].value;
                    }
                    return null;
                }else if(valores[0].campo){
                    for(var i = 0 ; i < valores.length ; i ++){
                        if(object.fields[valores[i]]){
                            if(!objeto)
                                objeto = {};
                            objeto[valores[i]] = this.get(valores[i]);
                        }
                    }
                }
            }
        }else{
            for(var i = 0 ; i < fields.length ; i ++){
                if(fields[i]){
                    if(!objeto)
                        objeto = {};
                    objeto[fields[i].index] = this.get(fields[i].index);
                }
            }
        }
        return objeto;
    };
    this.getAsRecord = function(){
        var recObj = this.getRecord();
        var fieldRec = [];
        if(fields.length > 0){
            for(var i = 0 ; i < fields.length ; i ++ ){
                fieldRec[fields[i].index] = object.fields[fields[i].index].value;
            }
        }
        return new recObj(fieldRec);
    };
    this.save = function(metavalues, fixed_params){
        if(this.isValidWithOutPK()){
            var objSubmit = fixed_params ? fixed_params : {};
            objSubmit.objeto = Ext.encode(this.encode());
            if(metavalues)
                objSubmit.metadata = Ext.encode(metavalues);
            if(insUrl){
                Ext.Ajax.request({
                    url:insUrl,
                    params:objSubmit,
                    success:function(resp,obj){
                        var response= Ext.decode(resp.responseText);
                        if(!response.codMsg || response.codMsg != 3){
                            this.set(response);
                            if(this.isValid()){
                                if(this.hasFileField()){
                                    this.saveFile(response.insertar);
                                }else
                                    this.getEventManager().fireEvent('objetoguardado',this,response);
                            }else{
                                var errors = this.getErrorReporter();
                                response.error = errors[errors.length - 1];
                                this.getEventManager().fireEvent('errorguardar',this,response);
                            }
                        }else{
                            this.getEventManager().fireEvent('errorguardar',this,response);
                        }
                    }.createDelegate(this),
                    failure: function(resp,op){
                        var response= Ext.decode(resp.responseText);
                        this.getEventManager().fireEvent('errorguardar',this,response);
                    }.createDelegate(this)
                })
            }else{
                var objError = {
                    mensaje     : "Falta la url de inserci&oacute;n del objeto.",
                    codMsg	: 3,
                    type	: "configuracion"
                };
                this.getEventManager().fireEvent("errorguardar",this,objError);
            }
        }else{
            var detalles = "Existen campos inv&aacute;lidos:";
            for(var i = 0 ; i < this.errorReport.length ; i ++){
                detalles += "-Nombre del campo:"+this.errorReport[i].campo+". -Tipo de error:"+this.listaErrores[this.errorReport[i].error]+".";
            }
            var objError = {
                mensaje : "Hay datos obligatorios sin llenar.",
                codMsg	: 3,
                type	: "acceso",
                detalles:detalles
            };
            this.getEventManager().fireEvent("errorguardar",this,objError);
        }
        this.errorReport = [];
    };
    this.update = function(metavalues,fixed_params){
        if(this.isValid()){
            var objSubmit = fixed_params ? fixed_params : {};
            objSubmit.objeto = Ext.encode(this.encode());
            if(metavalues)
                objSubmit.metadata = Ext.encode(metavalues);
            if(updUrl){
                Ext.Ajax.request({
                    url:updUrl,
                    params:objSubmit,
                    success:function(resp,obj){
                        var response= Ext.decode(resp.responseText);
                        if(!response.codMsg || response.codMsg != 3){
                            this.set(response);
                            if(this.isValid()){
                                if(this.hasFileField())
                                    this.saveFile(response.insertar);
                                else
                                    this.getEventManager().fireEvent('objetoactualizado',this,response);
                            }else
                                this.getEventManager().fireEvent('erroractualizar',this,response);
                        }else{
                            this.getEventManager().fireEvent('erroractualizar',this,response);
                        }
                    }.createDelegate(this),
                    failure: function(resp,op){
                        var response= Ext.decode(resp.responseText);
                        this.getEventManager().fireEvent('erroractualizar',this,response);
                    }.createDelegate(this)
                })
            }else{
                var objError = {
                    mensaje     : "Falta la url de inserci&oacute;n del objeto.",
                    codMsg	: 3,
                    type	: "configuracion"
                };
                this.getEventManager().fireEvent("erroractualizar",this,objError);
            }
        }else{
            var detalles = "Existen campos inv&aacute;lidos:";
            for(var i = 0 ; i < this.errorReport.length ; i ++){
                detalles += "-Nombre del campo:"+this.errorReport[i].campo+". -Tipo de error:"+this.listaErrores[this.errorReport[i].error]+".";
            }
            var objError = {
                mensaje : "Hay datos obligatorios sin llenar.",
                codMsg	: 3,
                type	: "acceso",
                detalles:detalles
            };
            this.getEventManager().fireEvent("erroractualizar",this,objError);
        }
        this.errorReport = [];
    };
    this.eliminar = function(params,fixed_params){
        if(this.isValidPK()){
            //var objSubmit = this.encodeObject();
            var objSubmit = fixed_params ? fixed_params : {};
            objSubmit.objeto = Ext.encode(this.encode());
            if(params)
                objSubmit.params = Ext.encode(params);
            if(delUrl){
                Ext.Ajax.request({
                    url: delUrl,
                    params:objSubmit,
                    success : function(resp,obj){
                        var response= Ext.decode(resp.responseText);
                        if(response.codMsg != 3){
                            this.getEventManager().fireEvent('objetoeliminado',this,response);
                        }else{
                            this.getEventManager().fireEvent('erroreliminar',this,response);
                        }
                    }.createDelegate(this),
                    failure: function(resp,op){
                        var response= Ext.decode(resp.responseText);
                        this.getEventManager().fireEvent('erroreliminar',this,response);
                    }.createDelegate(this)
                })
            }else{
                var mensaje = "Falta la url de supresi&oacute;n del objeto";
                this.getEventManager().fireEvent("erroreliminar",this,{
                    codMsg:3,
                    mensaje:mensaje
                });
            }
        }else if(params){
            var objSubmit = {
                objeto:Ext.encode(params)
            };
            if(delUrl){
                Ext.Ajax.request({
                    url: delUrl,
                    params:objSubmit,
                    success : function(resp,obj){
                        var response= Ext.decode(resp.responseText);
                        if(response.codMsg != 3){
                            this.getEventManager().fireEvent('objetoeliminado',response);
                            delete this;
                        }else{
                            this.getEventManager().fireEvent('erroreliminar',this,response);
                        }
                    }.createDelegate(this),
                    failure: function(resp,op){
                        var response= Ext.decode(resp.responseText);
                        this.getEventManager().fireEvent('erroreliminar',this,response);
                    }.createDelegate(this)
                })
            }
        }else{
            var mensaje = "Objeto no v&aacute;lido.";
            this.getEventManager().fireEvent("erroreliminar",this,{
                codMsg:3,
                mensaje:mensaje
            });
        }
        this.errorReport = [];
    };
    this.saveFile = function(ins){
        this.cantFileSubmit = this.hasFileField();
        var _this           = this;
        var objeto          = object;
        if(this.hasFileField()){
            for(var a in object.files){
                if(object.files[a].file && object.files[a].file instanceof Ext.FormPanel){
                    object.files[a].file.getForm().submit({
                        url:object.files[a].url,
                        params:{
                            iddocument:object.fields[a].value.iddocument,
                            title:object.fields[a].value.title,
                            workspace:object.fields[a].value.workspace,
                            insert:ins,
                            metadata:Ext.encode(object.fields[a].value.metadata),
                            objeto:Ext.encode(_this.encode())
                        },
                        success:function(form,act){
                            if(act.result.codMsg != 3){
                                if(_this.cantFileSubmit == 1){
                                    this.set(act.result);
                                    _this.getEventManager().fireEvent('objetoguardado',_this,act.result);
                                }else{
                                    _this.cantFileSubmit --;
                                }
                            }else{
                                var objError = {
                                    mensaje : "Error al subir el archivo.",
                                    codMsg	: 3,
                                    type	: "configuracion"
                                };
                                _this.getEventManager().fireEvent("errorguardar",_this,objError);
                            }
                        },
                        failure:function(form,act){
                            if(act.result.codMsg != 3){
                                if(_this.cantFileSubmit == 1){
                                    _this.set(act.result);
                                    _this.getEventManager().fireEvent('objetoguardado',_this,act.result);
                                }else{
                                    _this.cantFileSubmit --;
                                }
                            }else{
                                var objError = {
                                    mensaje : "Error al subir el archivo.",
                                    codMsg	: 3,
                                    type	: "configuracion"
                                };
                                _this.getEventManager().fireEvent("errorguardar",_this,objError);
                            }
                        }
                    })
                }else{
                    _this.cantFileSubmit --;
                }
            }
        }
        return true;
    };
    this.hasFileField = function(){
        var fileCant = 0;
        if(!object.files)
            return false;
        for(var a in object.files){
            if(object.files[a] && object.files[a].file)
                fileCant++;
        }
        if(fileCant == 0){
            object.files = null;
            return false;
        }else{
            return fileCant > 0 ? fileCant : false;
        }
    };
    this.find = function(params){
        if(findUrl){
            Ext.Ajax.request({
                url: findUrl,
                params:params,
                success : function(resp,obj){
                    var objFind= Ext.decode(resp.responseText);
                    if(objFind.codMsg != 3){
                        var objTmp = object;
                        this.set(((objFind[0]) ? objFind[0] : objFind));
                        if(this.isValid())
                            this.getEventManager().fireEvent('objetocargado',this,objFind);
                        else
                            object = objTmp;
                    }else{
                        this.getEventManager().fireEvent('objetonoencontrado',this,objFind);
                    }
                }.createDelegate(this),
                failure: function(resp,op){
                    var response= Ext.decode(resp.responseText);
                    this.getEventManager().fireEvent('objetonoencontrado',this,response);
                }.createDelegate(this)
            })
        }else{
            var mensaje = "Falta la url de busqueda del objeto";
            this.getEventManager().fireEvent("errorconfiguracion",this,mensaje);
        }
    };
    this.findBy = function(params){
        var params = {
            objeto:Ext.encode(this.encode()),
            params:params ? Ext.encode(params) : null
        };
        if(findByUrl){
            Ext.Ajax.request({
                url: findByUrl,
                params:params,
                success : function(resp,obj){
                    var objFind= Ext.decode(resp.responseText);
                    if(objFind.codMsg != 3){
                        var objTmp = object;
                        this.set(((objFind[0]) ? objFind[0] : objFind));
                        if(this.isValid()){
                            this.getEventManager().fireEvent('objetocargado',this,objFind);
                        }else{
                            object = objTmp;
                            this.getEventManager().fireEvent('objetonoencontrado',this,object);
                        }
                    }else{
                        this.getEventManager().fireEvent('objetonoencontrado',this,objFind);
                    }
                }.createDelegate(this),
                failure: function(resp,op){
                    var response= Ext.decode(resp.responseText);
                    this.getEventManager().fireEvent('objetonoencontrado',this,response);
                }.createDelegate(this)
            })
        }else{
            var mensaje = "Falta la url de busqueda filtrada del objeto";
            this.getEventManager().fireEvent("errorconfiguracion",this,mensaje);
        }
    };
    this.isValid = function(){
        this.errorReport    = [];
        if(fields.length > 0){
            for(var i = 0 ; i < fields.length ; i ++){
                if(fields[i] && object.fields[fields[i].index].notNull && !object.fields[fields[i].index].isForeing){
                    if(!object.fields[fields[i].index].value || object.fields[fields[i].index].value == null)
                        this.errorReport.push({
                            campo:object.fields[fields[i].index].name,
                            error:1
                        });
                //return false;
                }
            }
        }
        var _this = this;
        if(this.errorReport.length > 0){
            EVT_MANAGER.fireEvent('invalid',_this,_this.errorReport,true);
            EVT_MANAGER.fireEvent('validate',_this,false,true);
            return false;
        }
        EVT_MANAGER.fireEvent('valid',_this,_this.errorReport,true);
        EVT_MANAGER.fireEvent('validate',_this,true,true);
        return true;
    };
    this.isValidWithOutPK = function(){
        this.errorReport = [];
        if(fields.length > 0){
            for(var i = 0 ; i < fields.length ; i ++){
                if(object.primaryKeys[fields[i].index] && !object.fields[fields[i].index].isForeing){

                }else if(fields[i].pk && object.fields[fields[i].index].isForeing){
                    if(!object.fields[fields[i].index].value || !object.fields[fields[i].index].value.isValidWithOutPK()){
                        this.errorReport.push({
                            campo:object.fields[fields[i].index].name,
                            error:1
                        });
                    //return false;
                    }
                }else{
                    if(fields[i] && object.fields[fields[i].index].notNull && !object.fields[fields[i].index].isForeing){
                        if(!object.fields[fields[i].index].value){//object.fields[fields[i].index].value.toString() == "")
                            this.errorReport.push({
                                campo:object.fields[fields[i].index].name,
                                error:1
                            });
                        //return false;
                        }
                    }else if(object.fields[fields[i].index].isForeing && object.fields[fields[i].index].notNull){
                        if(!object.fields[fields[i].index].value){
                            this.errorReport.push({
                                campo:object.fields[fields[i].index].name,
                                error:1
                            });
                        //return false;
                        }else
                        if(!object.fields[fields[i].index].value.isValidWithOutPK()){
                            this.errorReport.push({
                                campo:object.fields[fields[i].index].name,
                                error:1
                            });
                        //return false;
                        }
                    }else if(object.fields[fields[i].index].notNull && !object.fields[fields[i].index].value){
                        this.errorReport.push({
                            campo:object.fields[fields[i].index].name,
                            error:1
                        });
                    //return false;
                    }
                }
            }
        }
        var _this = this;
        if(this.errorReport.length > 0){
            //EVT_MANAGER.fireEvent('invalid',_this,_this.errorReport,false);
            //EVT_MANAGER.fireEvent('validate',_this,false,false);
            return false;
        }
        // EVT_MANAGER.fireEvent('valid',_this,_this.errorReport,false);
        // EVT_MANAGER.fireEvent('validate',_this,true,false);
        return true;
    };
    this.isValidPK = function(){
        this.errorReport = [];
        if(fields.length > 0){
            for(var i = 0 ; i < fields.length ; i ++){
                if(fields[i] && object.primaryKeys[fields[i].index]){
                    if(!object.fields[fields[i].index].value){
                        this.errorReport.push({
                            campo:object.fields[fields[i].index].name,
                            error:1
                        });
                    }
                }
            }
        }
        var _this = this;
        if(this.errorReport.length > 0){
            EVT_MANAGER.fireEvent('invalidpk',_this,_this.errorReport);
            return false;
        }
        EVT_MANAGER.fireEvent('validpk',_this,_this.errorReport);
        return true;
    };
    this.encodeObject = function(){
        var encodeText = this.encode();
        var encodeRet	= encodeText;

        if(encodeText['objeto']){
            encodeRet	= Ext.encode(encodeText);
        }
        return encodeRet;
    },
    this.encode = function(sync){//AREGLAR PARA TODOS
        //var encodeObj = this.get();
        var encodeText = new Object();
        if(fields.length > 0){
            if((object.fields[fields[0].index].value && object.fields[fields[0].index].value.superClass == ViewModel) && !sync){
                encodeText[fields[0].index] = object.fields[fields[0].index].value.encode();
                encodeText['objeto'] = true;
            }else if(object.files && object.files[fields[0].index]){
                encodeText[fields[0].index] = object.fields[fields[0].index].value;
            }else if(object.fields[fields[0].index].value && object.fields[fields[0].index].value.superClass == ViewModel && sync){
            //encodeText[fields[0].index] = null;
            }else if(object.fields[fields[0].index].value && fields[0].type == 'Array'){
                // encodeText[fields[0].index] = Ext.encode(object.fields[fields[0].index].value);
                encodeText[fields[0].index] = object.fields[fields[0].index].value;
            }else{
                encodeText[fields[0].index] = (object.fields[fields[0].index].value) ? object.fields[fields[0].index].value : 0;
            }/*else if(object.fields[fields[0].index].value && object.fields[fields[0].index].value != null){
				encodeText[fields[0].index] =  object.fields[fields[0].index].value;
			}*/
            for(var i = 1 ; i < fields.length ; i ++){
                if(object.fields[fields[i].index].value){
                    if((object.fields[fields[i].index].value && object.fields[fields[i].index].value.superClass == ViewModel) && !sync){
                        encodeText[fields[i].index] = object.fields[fields[i].index].value.encode();
                        encodeText['objeto'] = true;
                    }else if(object.files && object.files[fields[i].index]){
                        encodeText[fields[i].index] = object.fields[fields[i].index].value;
                    }else if(object.fields[fields[i].index].value && object.fields[fields[i].index].value.superClass == ViewModel && sync){
                    //encodeText[fields[i].index] = null;
                    }else if(object.fields[fields[i].index].value && fields[i].type == 'Array'){
                        //encodeText[fields[i].index] = Ext.encode(object.fields[fields[i].index].value);
                        encodeText[fields[i].index] = object.fields[fields[i].index].value;
                    }else{
                        encodeText[fields[i].index] = (object.fields[fields[i].index].value) ? object.fields[fields[i].index].value : 0;
                    }/*else if(object.fields[fields[i].index].value && object.fields[fields[i].index].value != null){
						encodeText[fields[i].index] =  object.fields[fields[i].index].value;
					}*/
                }
            }
        }
        if(object['asyncTypes'].length > 0){
            for(var r = 0 ; r < object['asyncTypes'].length ; r ++){
                encodeText[object['asyncTypes'][r]]	= {};
                var encodeTextAdd		= '';
                if(object['asyncObjectsAdd'][object['asyncTypes'][r]]){
                    if(object['asyncObjectsAdd'][object['asyncTypes'][r]].length > 0){
                        encodeText['objeto']	= true;
                        var tmpAdd = [];
                        tmpAdd.push(object['asyncObjectsAdd'][object['asyncTypes'][r]][0].encode(true));
                        for(var x = 1 ; x < object['asyncObjectsAdd'][object['asyncTypes'][r]].length ; x ++){
                            tmpAdd.push(object['asyncObjectsAdd'][object['asyncTypes'][r]][x].encode(true));
                        }
                        //encodeText[object['asyncTypes'][r]]["adicionados"]	= Ext.encode(tmpAdd);
                        encodeText[object['asyncTypes'][r]]["adicionados"]	= tmpAdd;
                        encodeText['objeto']	= true;
                    }
                }
                if(object['asyncObjectsDel'][object['asyncTypes'][r]]){
                    if(object['asyncObjectsDel'][object['asyncTypes'][r]].length > 0){
                        var tmpDel	= [];
                        tmpDel.push(object['asyncObjectsDel'][object['asyncTypes'][r]][0].encode(true));
                        for(var x = 1 ; x < object['asyncObjectsDel'][object['asyncTypes'][r]].length ; x ++){
                            tmpDel.push(object['asyncObjectsDel'][object['asyncTypes'][r]][x].encode(true));
                        }
                        //encodeText[object['asyncTypes'][r]]["eliminados"]	= Ext.encode(tmpDel);
                        encodeText[object['asyncTypes'][r]]["eliminados"]	= tmpDel;
                        encodeText['objeto']	= true;
                    }
                }
            }
        }
        return encodeText;
    //return Ext.encode(encodeText);
    };
    this.create = function(params){
        if(params.length > 0){
            for(var i = 0 ; i < fields.length ; i ++ ){
                if(params[i][fields[i].index]){
                    object.fields[fields[i].index].value = params[i][fields[i].index];
                }
            }
        }
        return true;
    };
    this.getConfig = function(){
        return this.config;
    };
    this.getRecord = function(notDisable){
        var fieldRec = [];
        if(fields.length > 0){
            for(var i = 0 ; i < fields.length ; i ++ ){
                fieldRec.push({
                    name:fields[i].index,
                    mapping:fields[i].index
                });
            }
        }
        if(!notDisable){
            fieldRec.push({
                name:'disabledField',
                mapping:'disabledField'
            });
            fieldRec.push({
                name:'disabledMsg',
                mapping:'disabledMsg'
            });
        }
        return new Ext.data.Record.create(fieldRec);
    };
    this.getPKValues = function(){
        var pkValues = new Object();
        if(fields.length > 0){
            for(var i = 0 ; i < fields.length ; i ++ ){
                if(object.primaryKeys[fields[i].index])
                    pkValues[fields[i].index] = object.fields[fields[i].index].value;
            }
        }
        return pkValues;
    };
    this.getErrorReporter = function(){
        return this.errorReport;
    };
    this.setNullable = function(campo,nullable){
        object.fields[campo].notNull = nullable;
        if(object.fields[campo].isForeing){
            var field = null;
            for(var a = 0 ; a < fields.length ; a ++){
                if(fields[a].index == campo){
                    field = fields[a];
                    a = fields.length;
                }
            }
            var keys = (field) ? field.fk : null;
            if(keys instanceof Array){
                for(var i = 0 ; i < keys.length ; i ++){
                    object.fields[keys[i].local].notNull = nullable;
                }
            }else if(keys instanceof Object){
                object.fields[keys.local].notNull = nullable;
            }
        }
    };
    this.reset = function(){
        this.constructObject();
    }
}