Ext.ns('Ext.erp');
Ext.ns('Ext.farm.confareasalud');
//Contenedor general
Ext.farm.confareasalud.Tab = Ext.extend(LOG.util.Panel, {
    panelTipoEntidad:undefined,
    panelCentral:undefined,
    title:'Asociar tipo de entidad',
    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.doFocus = true;
        this.layout = 'border';
        var _this = this;
        this.idioma = LOG.farm.configuracion.Idioma;
        this.modelo = new Ext.farm.conf.ModeloAsociados({idioma:this.idioma});
        this.bildComponents();
        this.btnAceptar = new LOG.util.Prototipos.botonAceptar({
            text:'Guardar',
            tooltip:'Guardar los datos',
            handler: function(){
                var idUS =  _this.comboTipoUnidadSalud.getValue();
                var records = _this.gridEnt.getSmPrincipal().getSelections();
                var ids = new Array();
                Ext.each(records,function(rec){
                    ids.push(rec.data.idorgano);
                });
                _this.modelo.guardar({idtipounidadsalud:idUS, idtipoentidad:Ext.encode(ids)});
            }
        });
        Ext.apply(this, {
            bbar:['->', this.btnAceptar],
            layout: 'border',
            items: [this.panelCentral, this.panelTipoEntidad]
        });
        Ext.farm.confareasalud.Tab.superclass.constructor.call(this, config);
    },
    bildComponents: function () {
        var _this= this;
        this.panelCentral = new LOG.util.UIManager.initColumnForm({
            columnas:3,
            region:'north',
            frame:true,
            height:85
        });
        this.comboTipoUnidadSalud = new LOG.util.ComboBox({
            name: 'idtipounidadsalud',
            url: '/logistica/farmacia/configuracion/index.php/configuracionfarmacia/cargarTipoCuadroBasico',
            valueField: 'idtipounidadsalud',
            displayField: 'denominacion',
            autoSelect:true,
            forceSelection:true,
            fieldLabel: this.idioma.cgTipoUnidadSalud,
            queryParam: 'criterio',
            mode: 'local',
            store: new Ext.data.SimpleStore({
                fields: ['idtipounidadsalud', 'denominacion'],
                data: [
                    [0,'FCIA Farmacia comunitaria'],
                    [1,'UEI']
                ]
            }),
            width: '98%',
            allowBlank: true,
            minChars: 1,
            resizable: true,
            listeners:{
                select:function(cb,rec){
                    //pasar id al grid para q recargue y seleccione los q estan guardados para el
                    _this.gridEnt.getStorePrincipal().load();
                    _this.gridEnt.idtipounidadsalud = _this.comboTipoUnidadSalud.getValue();
                }
            }
        });
        this.panelCentral.addComponent(this.comboTipoUnidadSalud);
        this.gridEnt = new Ext.farm.conf.gridTipoEntidad({idioma:this.idioma});
        this.gridEnt.init();
        this.panelTipoEntidad = this.gridEnt.view();
        this.gridEnt.getStorePrincipal().on({
            beforeload:function(st,obj) {
                obj.params.idtipounidadsalud = _this.comboTipoUnidadSalud.getValue();
            }
        });
        this.comboTipoUnidadSalud.setValue(0);
        this.gridEnt.getStorePrincipal().load();
        this.panelTipoEntidad.height = 300;
        this.panelTipoEntidad.region = 'center';
    }
});

//Grid central de cuadro basicos
Ext.farm.conf.gridTipoEntidad = Ext.extend(LOG.util.UITemplate, {
    idtipounidadsalud:0,
    constructor: function (config) {
        this.autoSelect = false;
        this.formaVisualizacion = 'panel';
        this.dirController = '/logistica/farmacia/configuracion/index.php/configuracionfarmacia';
        this.urlBusquedaGridPrincipal = 'cargarTipoEntidadAsociadas';
        this.idioma = config.idioma;
        this.autoLoad = false;
        Ext.farm.conf.gridTipoEntidad.superclass.constructor.call(this, config);

    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            hidden: true,
            dataIndex: 'idorgano'
        });
        this.addGridColumn({
            hidden: true,
            dataIndex: 'idtipounidadsalud'
        });
        this.addGridColumn({
            header: this.idioma.lbTipoEntidad,
            width: 300,
            dataIndex: 'denominacion',
            default: true
        });
    },
    render:function(){
        var _this =  this;
        var vista = Ext.farm.conf.gridTipoEntidad.superclass.render.call(this);
        this.getGridPrincipal().initialConfig.bbar.cbPageSize.setValue(100);
        this.getStorePrincipal().on({
            beforeload:function(st, obj) {
                obj.params.clase = "organo";
                var arrAux = new Array();
                arrAux.push(1);
                obj.params.parametros = Ext.encode(arrAux);
                obj.params.start = _this.getGridPrincipal().initialConfig.bbar.cursor;
                obj.params.limit = _this.getGridPrincipal().initialConfig.bbar.pageSize;
            },
            load:function(st, resp) {
                var arr = new Array();
                Ext.each(resp, function(rec){
                    if ( rec.json.tiene > 0 ) {
                        arr.push(rec);
                    }
                });
                _this.getSmPrincipal().selectRecords(arr);
            }
        });
        _this.getSmPrincipal().fireEvent = _this.getSmPrincipal().fireEvent.createSequence(function(e,obj) {
             if(e == 'rowselect'){
                var rec = obj.selections.items[obj.selections.length-1];
                if(rec.data.idtipounidadsalud && rec.data.idtipounidadsalud != _this.idtipounidadsalud ){
                    _this.getSmPrincipal().deselectRow(obj.last);
                }
            }
        });
        Ext.apply(this.gpPrincipal, {
            viewConfig: {
                getRowClass: function(rec, index, rowParams, store) {
                    if(rec.json.idtipounidadsalud && rec.json.idtipounidadsalud != _this.idtipounidadsalud )
                        return 'redrow-text';
                }
            }
        });
        return vista;
    }
});

//Modelo
Ext.farm.conf.ModeloAsociados =  Ext.extend(LOG.util.Model , {
    urlAccionAdicionarAnno:undefined,
    urlAccionEliminarAnno: undefined,
    urlAccionDuplicarAnno: undefined,
    urlAccionEliminarActividades:undefined,
    urlAccionAdicionarMedios: undefined,
    urlAccionEliminarMedios:  undefined,
    constructor: function (config) {
        config.urlController = '/logistica/farmacia/configuracion/index.php/configuracionfarmacia';
        this.urlAccionGuardar = '/guardarTipoEntidadAsociadas';

        if (!config.fields) {
            config.fields = [];
        }
        Ext.farm.conf.ModeloAsociados.superclass.constructor.call(this, config);
    },
    guardar: function(parametros, _fn, _fnfail) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgGuardandoDatos, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        Ext.Ajax.request({
            url: _this.urlController + '/guardarTipoEntidadAsociadas',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, _this.idioma.lbMsgDatosGuardados);
                        if (this.st) {
                            _this.st.reload();
                        }
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    }

});