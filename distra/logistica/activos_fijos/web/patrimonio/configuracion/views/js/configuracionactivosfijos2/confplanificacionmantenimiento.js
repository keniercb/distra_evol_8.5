Ext.ns('Ext.erp');
Ext.ns('Ext.aft.Conf');
//Panel general
Ext.erp.confplanificacionmantenimiento = Ext.extend(LOG.util.Panel, {
    vistaGridActvPlanf: undefined,
    gridActividadesPlanificacion: undefined,
    modelo:undefined,
    constructor: function (config) {
        var _this = this;
        this.region = 'center';
        this.idioma = config.idioma;
        this.title = 'Planificación del mantenimiento';
        this.modelo = new Ext.aft.Conf.PlanificacionMantenimientoModel({idioma: this.idioma});
        this.bildComponents();
        Ext.apply(this, {
            tbar:['->',LOG.util.Prototipos.botonAyuda({})],
            layout: 'border',
            items: [this.panelContenedor ]
        });
        Ext.erp.confplanificacionmantenimiento.superclass.constructor.call(this, config);

        var _this = this;
        this.on({
            render: function () {
                this.on({
                    'resize':function(){
                        _this.vistaGridPlanificacion.setHeight(_this.getHeight()-30);
                    }
                })
            }
        });
    },
    bildComponents: function () {
        var _this = this;

        this.GridPlanificacion = new Ext.aft.Conf.gridPlanificacionMantenimiento({idioma: this.idioma});
        this.GridPlanificacion.init();
        this.vistaGridPlanificacion = this.GridPlanificacion.view();

        this.panelContenedor =  new LOG.util.UIManager.initPanel({
            region:'center'
        });
        this.panelContenedor.add(this.vistaGridPlanificacion);

    }
});
//GridPrincipal
Ext.aft.Conf.gridPlanificacionMantenimiento = Ext.extend(LOG.util.UITemplate, {
    idnomsistemamedio:undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 2;
        this.busquedaBasica = true;
        this.autoLoad = true;
        this.idioma = config.idioma;
        this.dirController = '/logistica/activos_fijos/configuracion/index.php/confplanificacionmantenimiento';
        this.urlBusquedaGridPrincipal = 'cargarPlanificaciones';
        this.modelo = new Ext.aft.Conf.PlanificacionMantenimientoModel({idioma: this.idioma});
        Ext.aft.Conf.gridPlanificacionMantenimiento.superclass.constructor.call(this, config);

    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idplanificacionmantenimiento',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'denominacion',
            header: this.idioma.cgMedio,
            hidden:true,
           // id: 'denominacionMedio',
            agrupador:true,
            default: true,
			renderer:function(val, d, t){
			   return val + '  ' + t.json.marca  + '  ' + t.json.modelo;
			}
        });

        this.addGridColumn({
            dataIndex: 'periodo',
            header: this.idioma.cgPeriodo,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'recursoconsumido',
            header: this.idioma.cgRecursoConsumido,
            width:120,
            default: true
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'adicionar',
            text: this.idioma.lbBtnAdicionar,
            tooltip: this.idioma.ttBtnAdicionarActvidades,
            handler: function () {
                _this.showVentanaGestion();
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonAbrir({
            tooltip: this.idioma.ttBtnAbrirPlanificacion,
            isContextual: true,
            handler: function() {
                _this.showVentanaGestion(true);
            },
            controlFn: function(b, _caller) {
                b.disable();
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'ver');
            }
        }));
        this.addToolbarButton(new Ext.Button({
                tooltip: this.idioma.ttBtnEliminarActvidades,
                iconCls: 'eliminar',
                text: this.idioma.lbBtnEliminar,
                handler: function () {
                    var records = _this.getSmPrincipal().getSelections();
                    var arr = new Array();
                    Ext.each(records, function (record) {
                        arr.push(record.data.idplanificacionmantenimiento);
                    });
                    _this.modelo.eliminarPlanificacion(arr)
                },
                controlFn: function (b, _caller) {
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'del');
                }
            })
        );


    },
    render: function () {
        var _this = this;
        var render = Ext.aft.Conf.gridPlanificacionMantenimiento.superclass.render.call(this);
       // this.gpPrincipal.autoExpandColumn = 'denominacionMedio';
        this.getStorePrincipal().on({
            'beforeload':function(st){
                //st.initBaseParams = {idnomsistemamedio:_this.idnomsistemamedio}
            }
        });
        return render;
    },
    showVentanaGestion:function(up){
        var _this = this;
        var ventana = new Ext.aft.Conf.VentanaGestion({idioma:_this.idioma,
            record:(up)?_this.getSmPrincipal().getSelected():undefined});
        ventana.show();
        ventana.aceptarFn = function(){
            var arr = ventana.salvarDatos();
            _this.modelo.adicionarPlanificacion(arr);
        };
    }
});
//Ventana Gestion
Ext.aft.Conf.VentanaGestion = Ext.extend(LOG.util.Window, {
    vistaGridActvPlanf: undefined,
    gridActividadesPlanificacion: undefined,
    record:undefined,
    modelo:undefined,
    constructor: function (config) {
        var _this = this;
        this.region = 'center';
        this.idioma = config.idioma;
        config.resizable = false;
        this.usarAplicar =false;
        this.record = config.record;
        this.maskDisabled = false;
        this.title = 'Planificación del mantenimiento';
        this.modelo = new Ext.aft.Conf.PlanificacionMantenimientoModel({idioma: this.idioma});
        this.bildComponents();
        Ext.apply(this, {
            layout: 'border',
            items: [this.panelContenedor ]
        });
        Ext.aft.Conf.VentanaGestion.superclass.constructor.call(this, config);
        this.height = 600;
        this.width = 800;
        _this.listaBotones.getItem(2).disable();
    },
    bildComponents: function () {
        var _this = this;
        this.panelSuperior = new Ext.aft.Conf.panelDatosPlanificacion({idioma:this.idioma, height:90});
        this.gridActividadesPlanificacion = new Ext.aft.Conf.gridActividadesPlanificacion({
            idioma: this.idioma,
            modelo:this.modelo
        });
        this.gridActividadesPlanificacion.init();
        this.vistaGridActvPlanf = this.gridActividadesPlanificacion.view();
        _this.vistaGridActvPlanf.setHeight(445);
        this.vistaGridActvPlanf.region = 'sout';
        this.panelContenedor =  new LOG.util.UIManager.initPanel({
            region:'center'
        });
        this.panelContenedor.add(this.panelSuperior);
        this.panelContenedor.add(this.vistaGridActvPlanf);
        this.panelSuperior.on({
            'changemedio':function(idpadre, idindicador){
                _this.gridActividadesPlanificacion.setIdPadre(idpadre);
            },
            'validar':function(val){
                if(val &&  _this.gridActividadesPlanificacion.getStorePrincipal().getCount() >0)
                    _this.listaBotones.getItem(2).enable();
                else _this.listaBotones.getItem(2).disable();
            }
        });
        this.gridActividadesPlanificacion.on({
            'changestore':function(cant){
                if(_this.panelSuperior.isValid() && cant>0){
                    _this.listaBotones.getItem(2).enable();
                }
                else _this.listaBotones.getItem(2).disable();
            }
        });
        this.loadDatos();
    },
    salvarDatos:function(){
        if(this.panelSuperior.isValid()){
            var records = this.gridActividadesPlanificacion.getStorePrincipal().getRange();
            var arr = new Array();
            Ext.each(records, function(rec){
                if(!rec.data.idactividadplanificacion) {
                    arr.push(rec.data.idconfactividadsistemamedio)
                }
            });
            var aux = {};
            if(this.record){
                aux['idplanificacionmantenimiento'] = this.record.data.idplanificacionmantenimiento;
            }
            aux['periodo'] = this.panelSuperior.getPeriodo();
            aux['recursoconsumido'] = this.panelSuperior.getRecursoConsumido();
            aux['idindicador'] = this.panelSuperior.getMedio();
            aux['actividades'] = Ext.encode(arr);
            return aux;
        } else return;
    },
    loadDatos:function(){
        this.panelSuperior.loadDatos(this.record);
        if(this.record) {
            this.gridActividadesPlanificacion.getStorePrincipal().initBaseParams =
            {
               idplanificacionmantenimiento: this.record.data.idplanificacionmantenimiento
            };
            this.gridActividadesPlanificacion.getStorePrincipal().load();
        }
    }
});
Ext.aft.Conf.panelDatosPlanificacion = Ext.extend(LOG.util.Panel, {
    idioma: undefined,
    formularioGeneral:undefined,
    constructor: function (config) {
        var _this = this;
        this.region = 'center';
        this.frame = true;
        this.idioma = config.idioma;
        this.bildComponents();
        Ext.apply(this, {
            items: [this.formularioGeneral]
        });
        Ext.aft.Conf.panelDatosPlanificacion.superclass.constructor.call(this, config);
        this.addEvents('changemedio');
        this.addEvents('validar');
    },
    bildComponents:function() {
        var _this = this;
        this.comboMedios = new LOG.util.ComboBox({
            name : 'idmedio' ,
            autoLoad: false,
            url : '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador',
            displayField : 'descripcionmarcamodelo',
            valueField : 'idindicador',
            fieldLabel : this.idioma.lbMedio ,
            allowBlank : false,
            mode:'remote',
            queryParam:'criterio',
            minChar:2,
            pageSize : 15,
            resizable: true,
            minListWidth : 300,
            listeners:{
                'select':function(cb, rec){
                    _this.fireEvent('changemedio',rec.json.idpadre, rec.data.idindicador);
                },
                keyup : function(){
                    if(_this.isValid()){
                        _this.fireEvent('validar',true);
                    }
                    else
                        _this.fireEvent('validar',false);
                }

            }
        });
        this.comboMedios.store.on({
            'beforeload':function(st, obj){
                Ext.apply(obj.params,{explotacion:1});
            }
        });
        this.tfPeriodo = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbPeriodo,
            allowBlank:false,
            enableKeyEvents:true,
            hiddenName: 'periodo',
            valueField: 'periodo',
            displayField: 'denominacion',
            editable: false,
            mode: 'local',
            store: new Ext.data.SimpleStore({
                fields: ['periodo', 'denominacion'],
                data: [
                    [1, '1'],
                    [2, '2' ],
                    [3, '3'],
                    [4, '4'],
                    [5, '5'],
                    [6, '6'],
                    [7, '7'],
                    [8, '8'],
                    [9, '9'],
                    [10,'10'],
                    [11,'11'],
                    [12,'12']
                ]
            }),
            listeners:{
                select : function(){
                    if(_this.isValid()){
                        _this.fireEvent('validar', true);
                    }
                    else
                        _this.fireEvent('validar', false);

                }
            },
            resizable: true,
            minListWidth : 300
        });
        //this.tfPeriodo = new LOG.util.ComboBox({
        //    fieldLabel: this.idioma.lbPeriodo,
        //    allowBlank:false,
        //    enableKeyEvents:true,
        //    minValue:0,
        //    listeners:{
        //        keyup : function(){
        //            if(_this.isValid()){
        //                _this.fireEvent('validar', true);
        //            }
        //            else
        //                _this.fireEvent('validar', false);
        //
        //        }
        //    }
        //});
        this.tfRecursoConsumido = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.idioma.lbRecursoConsumido,
            allowBlank:false,
            enableKeyEvents:true,
            minValue:0,
            listeners:{
                keyup : function(){
                    if(_this.isValid()){
                        _this.fireEvent('validar',true);
                    }
                    else
                        _this.fireEvent('validar',false);
                }
            }
        });
        contenedor = new LOG.util.UIManager.initColumnForm({
            columnas:4
        });
        contenedor.addComponent(this.comboMedios);
        contenedor.addComponent(this.tfPeriodo);
        contenedor.addComponent(this.tfRecursoConsumido);
        this.formularioGeneral = new LOG.util.UIManager.initPanel({
            items:[contenedor]
        });
    },
    isValid: function () {
        return this.tfPeriodo.isValid()
        && this.tfRecursoConsumido.isValid()
        && this.comboMedios.isValid();
    },
    getPeriodo:function(){
        return this.tfPeriodo.getValue();
    },
    getRecursoConsumido:function(){
        return this.tfRecursoConsumido.getValue();
    },
    getMedio:function(){
        return this.comboMedios.getValue();
    },
    loadDatos:function(record){
        var _this = this;
        if(record){
            this.tfRecursoConsumido.setValue(record.data.recursoconsumido);
            this.tfPeriodo.setValue(record.data.periodo);
            this.comboMedios.store.load({params:{idindicador:record.data.idindicador}, callback :function(val){
                _this.comboMedios.setValue(record.data.idindicador);
                _this.comboMedios.disable();
                _this.fireEvent('changemedio',val[0].json.idpadre, record.data.idindicador);
            }
            });
        }
    }
});
Ext.aft.Conf.gridActividadesPlanificacion = Ext.extend(LOG.util.UITemplate, {
    idPadreIndicador:undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 2;
        this.busquedaBasica = true;
        this.autoLoad = false;
        this.dirController = '/logistica/activos_fijos/configuracion/index.php/confplanificacionmantenimiento';
        this.urlBusquedaGridPrincipal = 'cargarActvidadesPlanificadas';
        Ext.aft.Conf.gridActividadesPlanificacion.superclass.constructor.call(this, config);
        this.addEvents('changestore');

    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idactividadplanificacion',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idconfactividadsistemamedio',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idnomsistemamedio',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'denominacion',
            header: this.idioma.cgDenominacion,
            id: 'denominacionActv',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'sistema',
            header: this.idioma.cgSistema,
            default: true
        });

    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'adicionar',
            text: this.idioma.lbBtnAdicionar,
            tooltip: this.idioma.ttBtnAdicionarActvidades,
            disabled:true,
            handler: function () {
                var added = new Array();
                Ext.each(_this.getStorePrincipal().getRange(), function(rec){
                    added.push(rec.json.idconfactividadsistemamedio);
                });
                var select = new Ext.aft.Conf.gridActividadesPlanificacion({
                    formaVisualizacion: 'ventana',
                    idioma: _this.idioma,
                    autoLoad: false,
                    idPadreIndicador:_this.idPadreIndicador,
                    panelBotonesVisible: false,
                    usarAplicar: false,
                    excluir:added,
                    dirController: '/logistica/activos_fijos/configuracion/index.php/confplanificacionmantenimiento',
                    urlBusquedaGridPrincipal: 'cargarActvidadesSistemasMedio',
                    initDefaultButtons: function () {
                    },
                    render: function () {
                        var _this = this;
                        var render = Ext.aft.Conf.gridActividadesPlanificacion.superclass.render.call(this);
                        this.gpPrincipal.autoExpandColumn = 'denominacionActv';
                        this.getStorePrincipal().on({
                            'beforeload':function(st){
                                st.initBaseParams = {idpadre:_this.idPadreIndicador, excluir:Ext.encode(_this.excluir)}
                            }
                        });
                        return render;
                    }
                });
                select.init();
                select.view();
                select.getVistaPrincipal().setHeight(400);
                select.getVistaPrincipal().setWidth(600);
                select.getVistaPrincipal().listaBotones.getItem(1).hide();
                select.getVistaPrincipal().setTitle(_this.idioma.tlSelecionarActividades);
                select.getVistaPrincipal().aceptarFn = function () {
                    var records = select.getSmPrincipal().getSelections();
                    var aux = new Array();
                    Ext.each(records, function(rec){
                        aux.push(rec.data.idactividad);
                    });
                    _this.getStorePrincipal().add(records);
                };
                select.getStorePrincipal().load();
            }
        }));
        this.addToolbarButton(new Ext.Button({
                tooltip: this.idioma.ttBtnEliminarActvidades,
                iconCls: 'eliminar',
                text: this.idioma.lbBtnEliminar,
                disabled:true,
                handler: function () {
                    var records = _this.getSmPrincipal().getSelections();
                    var aux = new Array();
                    mostrarMensaje(2, _this.idioma.msgEliminarActividades, function(btn) {
                        if (btn == 'ok') {
                            Ext.each(records, function (rec) {
                                if (rec.data.idactividadplanificacion) {
                                    aux.push(rec.data.idactividadplanificacion);
                                }
                                else _this.getStorePrincipal().remove(rec);
                            });
                            if(aux.length >0) {
                                _this.modelo.eliminarActividad(aux,
                                    function (val) {
                                        _this.getStorePrincipal().load();
                                    })
                            }
                        }});
                },
                controlFn: function (b, _caller) {
                    b.disable();
                        _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                            if (e == 'rowselect') {
                                b.enable();
                            }
                            if (e == 'rowdeselect' && this.getCount() == 0) {
                                b.disable();
                            }
                        });
                }
            })
        );

    },
    render: function () {
        var _this = this;
        var render = Ext.aft.Conf.gridActividadesPlanificacion.superclass.render.call(this);
        this.gpPrincipal.autoExpandColumn = 'denominacionActv';
        this.getStorePrincipal().on({
            'load':function(st) {
                if (st.getCount()== 0){
                    _this.listaBotones.getItem(1).disable();
                }
                _this.fireEvent('changestore', st.getCount());
            },
            'add':function(st, records){
                _this.fireEvent('changestore', st.getCount());
            },
            'remove':function(st, rec){
                _this.fireEvent('changestore', st.getCount());
            }

        });
        return render;
    },
    setIdPadre:function(value){
        this.idPadreIndicador = value;
        if(value){
            this.listaBotones.getItem(0).enable();
        }
        else {
            this.listaBotones.getItem(0).disable();
            this.listaBotones.getItem(1).disable();
        }
    }
});

//Modelo
Ext.aft.Conf.PlanificacionMantenimientoModel =  Ext.extend(LOG.util.Model , {
    urlAccionAdicionarSistemas:undefined,
    urlAccionEliminarPlanificacion:undefined,
    urlAccionAdicionarActividades:undefined,
    urlAccionEliminarActividades:undefined,
    constructor: function (config) {
        config.urlController = '/logistica/activos_fijos/configuracion/index.php/confplanificacionmantenimiento';
        this.urlAccionAdicionarPlanificacion = '/adicionarPlanificacion';
        this.urlAccionEliminarPlanificacion = '/eliminarPlanif';
        this.urlAccionAdicionarActividades = '/adicionarActividades';
        this.urlAccionEliminarActividades = '/eliminarActvidades';
        if (!config.fields) {
            config.fields = [];
        }
        Ext.aft.Conf.PlanificacionMantenimientoModel.superclass.constructor.call(this, config);
    },
    adicionarPlanificacion: function(parametros, _fn, _fnfail) {
        var _this = this;
            Ext.MessageBox.wait(this.idioma.msgGuardandoPlanificacion, this.idioma.msgEspere || '...');
            var objSubmit = parametros ||{};
            Ext.Ajax.request({
                url: _this.urlController + _this.urlAccionAdicionarPlanificacion,
                method: 'POST',
                params: objSubmit,
                callback: function(o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    this.apply(resp);
                    if (resp.success) {
                        if (s) {
                            mostrarMensaje(1, _this.idioma.lbMsgPlanificacionSalvada);
                            if(this.st){
                                this.st.reload();
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
    },
    eliminarPlanificacion: function(parametros, _fn, loadStore) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgEliminarPlanificacion, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoPlanificacion, this.idioma.msgEspere || '...');
                var objSubmit = {};
                objSubmit.planificaciones = Ext.encode(parametros);
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminarPlanificacion,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgPlanificacionEliminada);
                                if(this.st){
                                    this.st.reload();
                                }
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
    },
    eliminarActividad: function(parametros, _fn, loadStore) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgEliminandoActividad, this.idioma.msgEspere || '...');
        var objSubmit = {};
        objSubmit.actividades =  Ext.encode(parametros);
        Ext.Ajax.request({
            url: _this.urlController + _this.urlAccionEliminarActividades,
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, this.idioma.msgActividadEliminada);
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    }
});
