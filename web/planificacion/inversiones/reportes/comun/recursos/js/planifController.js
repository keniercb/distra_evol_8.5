/**
 * Created by Ariel on 11/04/2016.
 */
Ext.ns('Planif.Base');
Planif.Base.Controller = Ext.extend(Function,{
    protected_elements : new Object(),
    items : new Object(),
    data : new Object(),
    stores : new Object(),
    globals : new Object(),
    labels : new Object(),
    errors : new Object(),
    model_instances : new Object(),
    EVT_MANAGER : new Ext.util.Observable(),
    constructor: function(config){
        this.init(config);
    },
    init: function(config){
        Ext.id(this,'std-base-controller');
        this.addEvents({
            "initcontroller" : true,
            "insertitem" : true,
            "deleteitem" : true,
            "insertglobal" : true,
            "deleteglobal" : true,
            "insertstore" : true,
            "deletestore" : true,
            "insertlabel" : true,
            "deletelabel" : true,
            "insertdata" : true,
            "deletedata" : true,
            "pusherror" : true,
            "clearerrorlist" : true,
            "insertmodelinstance" : true,
            "deletemodelinstance" : true
        });
        if(config){
            this._setItems(config.items);
            this._setData(config.data);
            this._setStores(config.stores);
            this._setGlobals(config.globals);
            this._setLabels(config.labels);
            this._setModelInstances(config.model_instances);
        }
        this._clearErrors();

        var perfil = this._getGlobals('perfil') ? this._getGlobals('perfil') : window.perfil;
        if(perfil){
            var _globals = config.globals ? config.globals : {};
            for(var opt in perfil){
                if(!_globals[opt] && opt != 'etiquetas')
                    _globals[opt] = perfil[opt];
            }

            this._insertGlobals(_globals);
        }
        this.fireEvent('initcontroller', this, config);
    },
    _getConfigOpt:function(config){
        var config_opt = config ? config : {};
        config_opt.controller = this;
        return config_opt;
    },
    _getItem : function(uri){
        return uri ? this.items[uri] : this.items;
    },
    _setItems : function(items){
        this.items = items ? items : new Object();
        return;
    },
    _insertItem : function(uri,item){
        if(uri && item != undefined){
            this.items[uri] = item;
            this.fireEvent('insertitem', this, uri, item);
            var _this = this;
            if(this.items[uri].on){
                this.items[uri].on('destroy',function(){
                    _this._deleteItem(uri);
                })
            }
        }
        return;
    },
    _insertItems : function(items){
        if(items && (items instanceof Object)){
            for(var index in items){
                if(items[index] != undefined)
                    this._insertItem(index,items[index]);
            }
        }
        return;
    },
    _deleteItem : function(uri){
        delete this.items[uri];
        this.fireEvent('deleteitem', this, uri);
        return;
    },
    _getData : function(uri){
        return uri ? this.data[uri] : this.data;
    },
    _setData : function(data){
        this.data = data ? data : new Object();
        return true;
    },
    _insertData : function(uri,data){
        if(uri && data !== undefined){
            this.data[uri] = data;
            this.fireEvent('insertdata', this, uri, data);
        }
        return;
    },
    _insertDatas : function(data){
        if(data && (data instanceof Object)){
            for(var index in data){
                if(data[index] != undefined)
                    this._insertData(index,data[index]);
            }
        }
        return;
    },
    _deleteData : function(uri){
        delete this.data[uri];
        this.fireEvent('deletedata', this, uri);
        return;
    },
    _getStore : function(uri){
        return uri ? this.stores[uri] : this.stores;
    },
    _setStores : function(stores){
        this.stores = stores ? stores : new Object();
        return;
    },
    _insertStore : function(uri,store){
        if(uri && store != undefined){
            this.stores[uri] = store;
            this.fireEvent('insertstore', this, uri, store);
        }
        return;
    },
    _insertStores : function(stores){
        if(stores && (stores instanceof Object)){
            for(var index in stores){
                if(stores[index] != undefined)
                    this._insertStore(index,stores[index]);
            }
        }
        return;
    },
    _deleteStore : function(uri){
        delete this.stores[uri];
        this.fireEvent('deletestore', this, uri);
        return;
    },
    _getGlobals : function(uri){
        return uri ? this.globals[uri] : this.globals;
    },
    _setGlobals : function(globals){
        this.globals = globals ? globals : new Object();
    },
    _insertGlobal : function(uri,global){
        if(uri && global !== undefined){
            this.globals[uri] = global;
            this.fireEvent('insertglobal', this, uri, global);
        }
        return;
    },
    _insertGlobals : function(globals){
        if(globals && (globals instanceof Object)){
            for(var index in globals){
                if(globals[index] != undefined)
                    this._insertGlobal(index,globals[index]);
            }
        }
        return;
    },
    _deleteGlobal : function(uri){
        delete this.globals[uri];
        this.fireEvent('deleteglobal', this, uri);
        return;
    },
    _pushError : function(uri,error){
        this._clearErrors(uri);
        this.errors[uri].push(error);
        this.fireEvent('pusherror', this, uri, error);
        return;
    },
    _getErrors : function(uri){
        return uri ? this.errors[uri] : this.errors;
    },
    _clearErrors : function(uri){
        if(uri)
            this.errors[uri] = new Array();
        else
            this.errors = new Object();
        this.fireEvent('clearerrors', this, uri);
        return;
    },
    _getLabel : function(uri){
        var idioma = this._getGlobals('idioma') ? this._getGlobals('idioma') : 'es';
        return uri ? this.labels[idioma][uri] : this.labels[idioma];
    },
    _setLabels : function(labels){
        this.labels = labels ? labels : new Object();
        return;
    },
    _insertLabel : function(uri,label){
        var idioma = this._getGlobals('idioma') ? this._getGlobals('idioma') : 'es';
        if(uri && label != undefined){
            this.labels[idioma][uri] = label;
            this.fireEvent('insertlabel', this, uri, idioma, label);
        }
        return;
    },
    _insertLabels : function(labels){
        var idioma = this._getGlobals('idioma') ? this._getGlobals('idioma') : 'es';
        if(labels && (labels instanceof Object)){
            for(var index in labels){
                if(labels[index] != undefined){
                    this.labels[idioma][index] = labels[index];
                    this.fireEvent('insertlabel', this, index, idioma, labels[index]);
                }
            }
        }
        return;
    },
    _deleteLabel : function(uri){
        var idioma = this._getGlobals('idioma') ? this._getGlobals('idioma') : 'es';
        delete this.labels[idioma][uri];
        this.fireEvent('deletelabel', this, uri, idioma);
        return;
    },
    _getModelInstance : function(uri){
        return uri ? this.model_instances[uri] : this.models_instances;
    },
    _setModelInstances : function(instances){
        this.model_instances = instances ? instances : new Object();
        return;
    },
    _suscribeEvents : function(instance){
        instance.on('objetoguardado',function(obj,resp){
            this._modelInstanceEventsMgr('objetoguardado',instance,resp);
        }.createDelegate(this));
        instance.on('errorguardar',function(obj,resp){
            this._modelInstanceEventsMgr('errorguardar',instance,resp);
        }.createDelegate(this));
        instance.on('erroreliminar',function(obj,resp){
            this._modelInstanceEventsMgr('erroreliminar',instance,resp);
        }.createDelegate(this));
        instance.on('objetoeliminado',function(obj,resp){
            this._modelInstanceEventsMgr('objetoeliminado',instance,resp);
        }.createDelegate(this));
        return instance;
    },
    _modelInstanceEventsMgr : function(evt,obj,resp){
        switch(evt){
            case 'objetoguardado' : {
                this._showMessage(resp);
                this.fireEvent('model_saved', this, obj, resp);
            };

                break;
            case 'errorguardar' : {
                this._showMessage(resp);
                this.fireEvent('model_save_error', this, obj, resp);
            };

                break;
            case 'objetoactualizado' : {
                this._showMessage(resp);
                this.fireEvent('model_updated', this, obj, resp);
            };

                break;
            case 'erroractualizar' : {
                this._showMessage(resp);
                this.fireEvent('model_update_error', this, obj, resp);
            };

                break;
            case 'erroreliminar' : {
                this._showMessage(resp);
                this.fireEvent('model_delete_error', this, obj, resp);
            };

                break;
            case 'objetoeliminado' : {
                this._showMessage(resp);
                this.fireEvent('model_deleted', this, obj, resp);
            };

                break;
            case 'objetocargado' : {

            };

                break;
            case 'objetonoencontrado' : {

            };

                break;
            case 'errorconfiguracion' : {

            };

                break;
            case 'validate' : {

            };

                break;
            case 'invalid' : {

            };

                break;
            case 'valid' : {

            };

                break;
            case 'invalidpk' : {

            };

                break;
            case 'validpk' : {

            };

                break;
        }
    },
    _insertModelInstance : function(uri,instance){
        if(uri && instance){
            this.model_instances[uri] = this._suscribeEvents(instance);
            this.fireEvent('insertmodelinstance', this, uri, instance);
        }
        return;
    },
    _insertModelInstances : function(instances){
        if(instances && (instances instanceof Object)){
            for(var index in instances){
                if(instances[index])
                    this._insertModelInstance(index,instances[index]);
            }
        }
        return;
    },
    _saveModelInstance : function(uri,metavalues,fixed_params){
        var instance = this._getModelInstance(uri);
        if(instance && instance.save){
            instance.save(metavalues,fixed_params);
        }else{
            this.fireEvent('not_model_instance', this, instance);
            this._showMessage({
                codMsg : 3,
                msg : 'La instancia del modelo que desea salvar no existe o no es un objeto del tipo v&aacute;lido.'
            })
            return false;
        }
    },
    _updateModelInstance : function(uri,metavalues,fixed_params){
        var instance = this._getModelInstance(uri);
        if(instance && instance.update){
            instance.update(metavalues,fixed_params);
        }else{
            this.fireEvent('not_model_instance', this, instance);
            this._showMessage({
                codMsg : 3,
                msg : 'La instancia del modelo que desea salvar no existe o no es un objeto del tipo v&aacute;lido.'
            })
            return false;
        }
    },
    _deleteModelInstance : function(uri){
        delete this.model_instances[uri];
        this.fireEvent('deletemodelinstance', this, uri);
        return;
    },
    _loadIUConfig:function(action){

    },
    mostrarMascara : function(uri,title,mensaje,fn){
        Std.Base.Utiles.mostrarMascara(uri, title, mensaje, fn);
    },
    ocultarMascara : function(uri){
        Std.Base.Utiles.ocultarMascara(uri);
    },
    fireEvent : function(event_name, arg1, arg2, arg3, arg4, arg5){
        this._getEventManager().fireEvent(event_name, arg1, arg2, arg3, arg4, arg5);
    },
    on : function(event_name, fn, scope, options){
        this._getEventManager().on(event_name, fn, scope, options);
    },
    addEvents: function(object){
        this._getEventManager().addEvents(object);
    },
    _getEventManager : function(){
        return this.EVT_MANAGER;
    },
    _showMessage : function(response){
        Std.Base.Utiles.Message.showMessage(response);
    },
    _suscribeObjectEvent : function(object, event_name, fn, scope, opt){
        object.on(event_name, fn, scope, opt);
    }
});
