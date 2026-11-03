Ext.apply(Ext.form.VTypes, {
    daterange : function(val, field) {
        var date = field.parseDate(val);

        if(!date){
            return false;
        } 
        if (field.startDateField) {
            var start = Ext.getCmp(field.startDateField);
            if (!start.maxValue || (date.getTime() != start.maxValue.getTime())) {
                start.setMaxValue(date);
                start.validate();
            }
        }
        else if (field.endDateField) {
            var end = Ext.getCmp(field.endDateField);
            if (!end.minValue || (date.getTime() != end.minValue.getTime())) {
                end.setMinValue(date);
                end.validate();
            }
        }
        return true;
    }
});

LOG.produccion.ordenproduccion.View = Ext.extend(LOG.produccion.documento.View, {
    name: 'OrdenProduccion',
    dirReport: '/logistica/produccion/ordenproduccion/',
    /**
     * @param {Object} config
     */
    usarAbrir: false,
    constructor: function (config) {
        this.busquedaBasica = true;
        this.busquedaAvanzada = true;
        config.idioma = LOG.produccion.ordenproduccion.Idioma;
        this.modoSeleccion = 1;
        config.model = new LOG.produccion.ordenproduccion.Model({
            idioma: config.idioma
        });
        LOG.produccion.ordenproduccion.View.superclass.constructor.call(this, config);
        this.winGestionarDocumento = new LOG.produccion.ordenproduccion.ventanaGestionDocumentos({
            idioma: config.idioma,
            modelo: this.modelo,
            scope: this, //this,//this o  _this.scope,
            acciones: this.acciones,
            usuarios: this.usuarios,
            height: 580,
            title: (config.idioma.tlAdicionar) ? config.idioma.tlAdicionar : config.idioma.tlVentanaGestion,
            width: 750
            
        });
    },
    initVentanaGestion: function (d, tipoVentana) {
        var  _this = this;
        LOG.produccion.ordenproduccion.View.superclass.initVentanaGestion.createDelegate(this, [d, tipoVentana]).call();
        _this.habilitarElementosWindow();
        this.winGestionarDocumento.doLayout();
    },
    initDefaultColumns: function () {
        var _this = this;
        LOG.produccion.ordenproduccion.View.superclass.initDefaultColumns.call(this);
        this.insertGridColumn({
            header: 'Producto',
            dataIndex: 'idcartatecnologica',
            default: true,
            width: 150,
            renderer:function(v){
                if(v && !Ext.isEmpty(_this.cmbCartaTecnologica.getStore().getById(v))){
                    return _this.cmbCartaTecnologica.getStore().getById(v).get('denominacionindicador');
                }
                return "";
            }
        }, 4);
        this.insertGridColumn({
            header: 'Concepto',
            dataIndex: 'denominacion',
            default: true,
            width: 150
        }, 5);
        this.insertGridColumn({
            header: 'Fecha de cierre',
            dataIndex: 'fechacierre',
            default: true,
            width: 150,
            renderer:  function(val){
                if (val != '')
                    return val;
                else return '-';
            }
        }, 6);

        this.addGridColumn({
            header:'Desagregado',
            width: 110,
            dataIndex: 'desagregado',
            hidden:(this.grantedAction('RDesagregacion') ? false : true),
            renderer: function (value, metaData) {
                if (value == 1) {
                    metaData.css = 'icondistra-aceptar verde';
                    metaData.attr = 'ext:qtip="' + 'Habilitado' + '"';
                } 
                    else{
                     metaData.css = 'icondistra-aceptar rojo';
                     metaData.attr = 'ext:qtip="' + 'Deshabiltado' + '"';
                    }
                    
                
                return '';
            },
            filter: {
                type: 'boolean',
                yesText: 'Habilitado',
                noText: 'Deshabilitado',
                dataIndex: 'desagregado'
            }
        },5);
      
        this.insertGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: 'Cantidad planificada',
            dataIndex: 'cantidadun',
            type:'float',
            align: 'right',
            default: true,
            width: 150,
            renderer:  function(v,md,record){
                if(!Ext.isEmpty(_this.cmbCartaTecnologica.getStore().getById(record.data.idcartatecnologica))){
                    return _this.cmbCartaTecnologica.getStore().getById(record.data.idcartatecnologica).json.cantidad;
                }
                return 0;
            }
        }), 7);
        this.insertGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: 'Cantidad a producir',
            dataIndex: 'cantidad',
            align: 'right',
            type:'float',
            default: true,
            width: 150
        }), 8);
        this.insertGridColumn(new Ext.ux.grid.ProgressColumn({
            header: 'Cant. real/Cant. demandada',
            width: 105,
            dataIndex: 'cumplimiento',
            align: 'center',
            textPst: '%',
            actionEvent: 'click',
            renderer: function(v,md,record){
                return  parseFloat(v).toFixed(2);// parseFloat((100 * parseFloat(record.data.cantidadtotal)) / parseFloat(record.json.cantidad)).toFixed(2);
            }
        }), 9);
        this.addGridColumn({
            header: 'Cerrado por',
            dataIndex: 'cerradopor',
            default: true,
            width: 150,
           renderer: function (v) {
               return _this.getUsuarioById(v);
           }
        });

        this.listaColumnas.getBy('dataIndex', 'cantproductos').hidden = true;
        this.addGridColumn({
            dataIndex: 'cantidadtotal',
            type:'float',
            hideable: false
        });
        this.addGridColumn({
            dataIndex: 'close',
            hideable: false
        });
        this.addGridColumn({
            dataIndex: 'iddocumento',
            hidden: true,
            hideable: false
        });
        this.addGridColumn({
            dataIndex: 'idordenproduccion',
            hidden: true,
            hideable: false
        });
        this.addGridColumn({
            dataIndex: 'idcliente',
            hidden: true,
            hideable: false
        });
        this.addGridColumn({
            dataIndex: 'idalmacendestino',
            hidden: true,
            hideable: false
        });
        this.addGridColumn({
            dataIndex: 'idnomconcepto',
            hidden: true,
            hideable: false
        });
        this.addGridColumn({
            dataIndex: 'idcartatecnologica',
            hidden: true,
            hideable: false
        });
        this.addGridColumn({
            dataIndex: 'idcartatecindustrial',
            hidden: true,
            hideable: false
        });
        this.addGridColumn({
            dataIndex: 'idcentrogrupo',
            hidden: true,
            hideable: false
        });
        this.addGridColumn({
            dataIndex: 'idcontrato',
            hidden: true,
            hideable: false
        });
        this.addGridColumn({
            dataIndex: 'nrolote',
            hidden: true,
            hideable: false
        });
        this.addGridColumn({
            dataIndex: 'fechainicio',
            hidden: true,
            hideable: false
        });
        this.addGridColumn({
            dataIndex: 'fechafin',
            hidden: true,
            hideable: false
        });
        this.addGridColumn({
            dataIndex: 'desviacion',
            hidden: true,
            hideable: false
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        LOG.produccion.ordenproduccion.View.superclass.initDefaultButtons.call(this);//
        Ext.apply(this.listaBotones.getItem(3), {
            tooltip: this.idioma.ttBtnConfirmar,
            isContextual: true,
            itemId:'confirmar',
            disabled: true,
            handler: function () {
                _this.model.confirmar();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            b.setDisabled(!(this.getCount() == 1 && (this.getSelected().data.estado == 1 || this.getSelected().data.estado == 13)/* && this.getSelected().data.confirmar == 1*/));
                        }
                    }, 'confirmarDocumento1');
                } else {
                    b.setVisible(false);
                }
            }
        });
        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'anulardocumento',
            text: this.idioma.lbBtnAnularDocumento,
            tooltip: this.idioma.ttBtnAnularDocumento,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.anular({idestructuracomun: _this.idDeposito});
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAnularDocumento')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            b.setDisabled(!(this.getCount() == 1 && (this.getSelected().data.estado == 3 || this.getSelected().data.estado == 9)));
                        }
                    }, 'anularDocumento1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 5);

        this.insertToolbarButton(new Ext.Button({
            text: 'Cerrar',
            itemId: 'cerrar',
            disabled: true,
            iconCls: 'cerrar',
            isContextual: true,
            handler: function () {
                _this.model.cerrar({}, function (resp) {
                  //  _this.model.fireEvent('cerrado',this,resp);
                });
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            b.setDisabled(!(this.getCount() == 1 && this.getSelected().data.estado == 3));
                        }
                    }, 'cerrarDocumento');
                } else {
                    b.setVisible(false);
                }
            }
        }), 7);
        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'estado',
            text: this.idioma.lbBtnEstadoEjecucion,
            tooltip: this.idioma.ttBtnEstadoEjecucion,
            isContextual: true,
            disabled: true,
            handler: function () {
                var winEstadoEjecucion = new LOG.produccion.ordenproduccion.winEstadoEjecucion({
                    _parent: _this,
                    record: _this.getSmPrincipal().getSelected(),
                    idioma: _this.idioma,
                    modelo: _this.modelo,
                    datos: (_this.getGridPrincipal().getSelectionModel().getSelected()) ? _this.getGridPrincipal().getSelectionModel().getSelected().data : null
                });
                winEstadoEjecucion.init();
                _this.vistaEstadoEjecucion = winEstadoEjecucion.view();
                _this.vistaEstadoEjecucion.show();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RB')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            b.setDisabled(!(this.getCount() == 1));
                        }
                    }, 'estadoEjecucion1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 8);
      
        // Ext.apply(this.listaBotones.getItem(8), {
        //     tooltip: this.idioma.ttBtnAprobar,
        //     isContextual: true,
        //     itemId:'aprobar',
        //     disabled: true,
        //     handler: function () {
        //         _this.modelo.aprobar(); 
        //        _this.winGestionarDocumento.gridMateriaPrima.load();
              
        
        //     },
        //     controlFn: function (b, _caller) {
        //         if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAprobar')) {
        //             b.setVisible(true);
        //             LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
        //                 if (e == 'selectionchange') {
        //                     b.setDisabled(!(this.getCount() == 1 && ( this.getSelected().data.estado == 2)/* && this.getSelected().data.confirmar == 1*/));
        //                 }
        //             }, 'aprobarDocumento1');
        //         } else {
        //             b.setVisible(false);
        //         }
        //     }
        // });
        this.insertToolbarButton(new Ext.Button({
            text: 'Ficha de costo',
            itemId: 'costo',
            iconCls: 'revisar',
            isContextual: true,
            disabled: false,
            handler: function () {
                _this.getFicha(_this);
            
            }, 
         
        }), 9);
        Ext.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(1), {
            handler: function () {
                _this.modelo.confirmar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "2"
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = "2";
                    }
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementosWindow();
                    _this.winGestionarDocumento.doLayout();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                    let disabled;
                    try{
                        disabled = !(Object.entries(_this.winGestionarDocumento.record).length > 0 && (_this.winGestionarDocumento.record.data.estado == 1 || _this.winGestionarDocumento.record.data.estado == 13));                    
                    } catch(e){
                        disabled = true;
                    }
                    b.setDisabled(disabled);
                } else {
                    b.setVisible(false);
                }
            }
        });

        Ext.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(2), {
            handler: function () {
                _this.modelo.anularestado({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "1"
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = "1";
                    }
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementosWindow();
                    _this.winGestionarDocumento.doLayout();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularestado')) {
                    b.setVisible(true);
                    let disabled;
                    try{
                        disabled = !(Object.entries(_this.winGestionarDocumento.record).length > 0 && (_this.winGestionarDocumento.record.data.estado == 2));
                    } catch(e){
                        disabled = true;
                    }
                    b.setDisabled(disabled);
                } else {
                    b.setVisible(false);
                }
            }
        });
    },
    render: function () {
        var _this = this;
        var p = LOG.produccion.ordenproduccion.View.superclass.render.call(this);
        /*this.getPanelBusqueda().setColumns(1);
        var clsDatos = LOG.util.UIManager.initColumnForm({
            columnas: 2,
         
        });
        clsDatos.addComponent(new LOG.util.ComboBox({
                fieldLabel: this.idioma.cmEstado,
                hiddenName: 'estado',
                valueField: 'idestado',
                displayField: 'estado',
                triggerAction: 'all',
                editable: false,
                mode: 'local',
                store: new Ext.data.SimpleStore({
                    fields: ['idestado', 'estado'],
                    data: [
                        [13, LOG.lb.documento.Estado[13]],
                        [1, LOG.lb.documento.Estado[1]],
                        [2, LOG.lb.documento.Estado[2]],
                        [4, LOG.lb.documento.Estado[4]],
                        [7, LOG.lb.documento.Estado[7]],
                        [6, LOG.lb.documento.Estado[6]],
                        [5, LOG.lb.documento.Estado[5]]
                    ]
                })
            })
        );
        clsDatos.addComponent(new LOG.util.ComboBox({
            name: 'idcartatecnologica',
            fieldLabel: 'Producto',
            hiddenName: 'idcartatecnologica',
            displayField: 'denominacionindicador',
            valueField: 'idcartatecindustrial',
            autoLoad: true,
            pageSize: 20,
           //allowBlank: false,
            campo: true,
            mode: 'local',
            baseParams: {
            },
            otherFields:[
                'denominacion',
                'idindicadorsalida',
            ],
            url:'/planificacion/planindustrial/index.php/cartatecnologicaindustrial/listarCartatecnologica',// '/planificacion/producciones/index.php/producciones/listarProducciones',
            initStore: function () {
                var storeFields = [
                    {name: this.valueField},
                    {name: this.displayField},
                ];
                if (typeof this.otherFields != 'undefined') {
                    storeFields = storeFields.concat(this.otherFields);
                }

                return this.store || new Ext.data.Store({
                    url: this.url,
                    autoLoad: this.autoLoad,
                    baseParams: this.baseParams,
                    reader: new Ext.data.JsonReader({
                        root: 'data',
                        totalProperty: 'total',
                        idProperty: this.valueField//,
                         //id: this.valueField,
                    }, storeFields)
                })
            }
        }));
        clsDatos.addComponent(this.cmbConcepto = new LOG.util.ComboBox({
            url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomenclador',
            name: 'idnomconcepto',
            valueField:'idnomconcepto',
            hiddenName: 'idnomconcepto',
            displayField:'denominacion',
            baseParams:{
                modelo: 'NomConcepto',
                idnom: 'idnomconcepto',
            },
            fieldLabel: 'Concepto',
            emptyText: 'Seleccione',            
            autoLoad: true,
            pageSize: 20,
            //allowBlank: false,
            campo: true,
            mode: 'local',
            forceSelection: true
        }));
        clsDatos.addComponent(new LOG.util.ComboBox({
            name: 'idcliente',
            fieldLabel: 'Clientes',
            hiddenName: 'idcliente',
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            autoLoad: true,
            pageSize: 10,
            //allowBlank: false,
            campo: true,
            baseParams: {
            },
            mode: 'local',
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarProveedores',
            //url: '/configuracion/clientesyproveedores/index.php/clientesyproveedores/cargarclientesproveedor',
            editable: false
        }));
       
        _this.addFilterComponent(clsDatos);*/
    
       this.getStorePrincipal().on({
        load:function(){
            this.each(function(p,index){
                if(p.json.desviacion == 1){
                    Ext.fly(_this.getGridPrincipal().getView().getRow(index)).addClass('red-row');
                }
            })
        }
    })
        return p;
    },
    buildMgm: function () {
        var _this = this;
        var clsDatosGenerales = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });

        clsDatosGenerales.addComponent(this.cmbCartaTecnologica = new LOG.util.ComboBox({
      name: 'idcartatecnologica',
            fieldLabel: 'Producto',
            hiddenName: 'idcartatecnologica',
            displayField: 'denominacionindicador',
            valueField: 'idcartatecindustrial',
            autoLoad: true,
            pageSize: 20,
            allowBlank: false,
            editable:false,
            campo: true,
            itemSelector: 'div.search-item',
            tpl:new Ext.XTemplate(
                '<tpl for="."><div class="search-item">',
                '{denominacionindicador}: ({denominacion})',
                '</div></tpl>'
            ),
            mode: 'local',
            baseParams: {
            },
            otherFields:[
                'denominacion',
                'idindicadorsalida',
            ],
            url:'/logistica/produccion/maestros/configuracion/index.php/configuracionprod/cargaractividades',
            initStore: function () {
                var storeFields = [
                    {name: this.valueField},
                    {name: this.displayField},
                ];
                if (typeof this.otherFields != 'undefined') {
                    storeFields = storeFields.concat(this.otherFields);
                }

                return this.store || new Ext.data.Store({
                    url: this.url,
                    autoLoad: this.autoLoad,
                    baseParams: this.baseParams,
                    reader: new Ext.data.JsonReader({
                        root: 'datos',
                        totalProperty: 'total',
                        idProperty: this.valueField
                    }, storeFields)
                })
            },
            listeners: {
                select : function(cmb, rd) {
                    /*_this.winGestionarDocumento.materialesView.getStorePrincipal().baseParams.idcartatecindustrial = cmb.getValue();
                    _this.winGestionarDocumento.materialesView.getStorePrincipal().initBaseParams.idcartatecindustrial = cmb.getValue();  */
                    _this.idcartatecnologica = cmb.getValue();
                }
            }
        }));
        this.stUnidadMedida = new Ext.data.Store({
            url: '/planificacion/planindustrial/index.php/cartatecnologicaindustrial/cargarunidadmedida',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total',
                idProperty: 'idunidadmedida'
            }, 
            ['idunidadmedida','abreviaturaunidadmedida'])
        });


        clsDatosGenerales.addComponent(this.dateInicio = new Ext.form.DateField({
            name: 'fechainicio',
            fieldLabel: 'Fecha inicio',
            format: 'd/m/Y',
            id: 'fechainicio',
            vtype: 'daterange',
            endDateField: 'fechafin',
            allowBlank: false
        }));
        clsDatosGenerales.addComponent(this.dateFin = new Ext.form.DateField({
            name: 'fechafin',
            fieldLabel: 'Fecha fin',
            format: 'd/m/Y',
            id: 'fechafin',
            vtype: 'daterange',
            startDateField: 'fechainicio',
            allowBlank: true
        }));
        clsDatosGenerales.addComponent(this.cmbCentroCosto = new LOG.util.ComboBox({
            name: 'idcentrogrupo',
            hiddenName: 'idcentrogrupo',
            displayField: 'text',
            valueField: 'idcentrogrupo',
            fieldLabel: 'Centro de costo',
            allowBlank: false,
            autoLoad: true,
            pageSize: 10,
            campo: true,
            mode: 'local',
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarCentroCostos'
        }));
        _this.cmbCentroCosto.getStore().load();
        clsDatosGenerales.addComponent({
            xtype: 'compositefield',
            items:[
                this.ieCantidad = new LOG.util.Prototipos.inputDecimal({
                    name: 'cantidad',
                    fieldLabel: 'Cantidad a producir',
                    allowBlank: false,
                    flex      : 1,
                    campo: true,
                    setValue: Ext.form.NumberField.prototype.setValue.createInterceptor(function (value) {                        
                        this.fireEvent('valuechange', value);
                    }) ,                   
                }),
                this.itUM = new Ext.form.Label({
                    width : 20
                })
            ]
        });
        this.ieCantidad.on({
            'valuechange':function(v){     
                if(v && _this.cmbCartaTecnologica.getValue()){
                    _this.modelo.cantidad = v; 
                   // _this.newidcartatecindustrial = _this.idcartatecnologica;
                    /*_this.winGestionarDocumento.materialesView.getStorePrincipal().initBaseParams.idcartatecindustrial = (_this.idcartatecnologica) ? _this.idcartatecnologica : _this.modelo.idcartatecnologica;
                    _this.winGestionarDocumento.materialesView.getStorePrincipal().baseParams.idcartatecindustrial = (_this.idcartatecnologica) ? _this.idcartatecnologica : _this.modelo.idcartatecnologica;*/
                  _this.winGestionarDocumento.materialesView.getStorePrincipal().reload();   
                  _this.winGestionarDocumento.btnSalvar.enable();
                  
                }
            },
            'keyup' : function(nf,v){
                if(v && _this.cmbCartaTecnologica.getValue()){
                    _this.modelo.cantidad = v; 
                    _this.winGestionarDocumento.materialesView.getStorePrincipal().reload();   
                }
            }
        });
        clsDatosGenerales.addComponent(this.itLote = new LOG.util.Prototipos.inputTexto({
            name: 'nrolote',
            fieldLabel: 'Lote',
            allowBlank: true,
            campo: true
        }));

        clsDatosGenerales.addComponent(this.cmbAlmacen = new LOG.util.ComboBox({
            fieldLabel: 'Almacén destino',
            name: 'idalmacendestino',
            hiddenName: 'idalmacendestino',
            displayField: 'denominacion',
            valueField: 'idconfalmacen',
            autoLoad: true,
            //   autoSelect: true,
            baseParams:{
                tipoalmacen:2,
                start:0,
                limit:100
            },
            pageSize: 10,
            allowBlank: false,
            campo: true,
            mode: 'local',
            url: '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/depositosconfigurados'
        }));

        clsDatosGenerales.addComponent(this.cmbConcepto = new LOG.util.ComboBox({
            url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomenclador',
            name: 'idnomconcepto',
            valueField:'idnomconcepto',
            displayField:'denominacion',
            baseParams:{                
                modelo: 'NomConcepto',
                idnom: 'idnomconcepto',
                usarentidad: true
            },
            fieldLabel: 'Concepto',
            emptyText: 'Seleccione',            
            autoLoad: true,
            pageSize: 20,
            allowBlank: false,
            campo: true,
            mode: 'local',
            forceSelection: true
        }));

        if (_this.mostrarDesagregacion()) {
            clsDatosGenerales.addComponent(this.desagregacion = new Ext.form.Checkbox({
                boxLabel:'Desagregación de productos',
                name: 'desagregado',
                hideLabel: false,
                height: 40
            }));

        }
        
        this.formularioGeneral = new LOG.util.UIManager.initPanel({
            layout: 'form',
            itemId:'form',
            labelAlign: 'top',
            frame: true,
            items: [clsDatosGenerales,
                new Ext.form.TextArea({
                    fieldLabel: _this.idioma.lbObservaciones,
                    name: 'observaciones',
                    width: '98%',
                    height: '40px',
                    minLength: 2,
                    maxLength: 255,
                    campo: true
                })
            ]
        });

    },
    mostrarDesagregacion: function () {
        var _this = this
        if (_this.grantedAction('RDesagregacion')){
            return true;
        } 
        return false;
    },
    habilitarElementosWindow: function () {
        if (this.winGestionarDocumento.tipoVentana == 3) {
            Ext.each(this.winGestionarDocumento.panelSuperior.findByType('combo'), function (_item) {
                _item.setDisabled(true);
            });
            Ext.each(this.winGestionarDocumento.panelSuperior.findByType('datefield'), function (_item) {
                _item.setDisabled(true);
            });
           // this.winGestionarDocumento.panelSuperior.findByType('compositefield')[0].setDisabled(true);
           Ext.each(this.winGestionarDocumento.panelSuperior.findByType('textfield'), function (_item) {
                _item.setDisabled(true);
            });
            this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(true);
            this.winGestionarDocumento.panelSuperior.findByType('checkbox')[0].setDisabled(true);
            this.winGestionarDocumento.doLayout();
            this.winGestionarDocumento.buttons[1].hide();
            this.winGestionarDocumento.buttons[2].hide();
        } else {
            this.winGestionarDocumento.doLayout();
            if (this.winGestionarDocumento.record) {
                if (this.winGestionarDocumento.record.data.estado == 1) {
                    Ext.each(this.winGestionarDocumento.panelSuperior.findByType('combo'), function (_item) {
                        _item.setDisabled(false);
                    });
                    Ext.each(this.winGestionarDocumento.panelSuperior.findByType('datefield'), function (_item) {
                        _item.setDisabled(false);
                    });
                    //this.winGestionarDocumento.panelSuperior.findByType('compositefield')[0].setDisabled(false);
                    if (this.grantedAction('RDesagregacion')) {
                        this.winGestionarDocumento.panelSuperior.findByType('checkbox')[0].setDisabled(false);
                    }
                    Ext.each(this.winGestionarDocumento.panelSuperior.findByType('textfield'), function (_item) {
                        _item.setDisabled(false);
                    });
              this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(false);
                    this.winGestionarDocumento.buttons[2].show();
                } else {
                    Ext.each(this.winGestionarDocumento.panelSuperior.findByType('combo'), function (_item) {
                        _item.setDisabled(true);
                    });
                    Ext.each(this.winGestionarDocumento.panelSuperior.findByType('datefield'), function (_item) {
                        _item.setDisabled(true);
                    });
                  //  this.winGestionarDocumento.panelSuperior.findByType('compositefield')[0].setDisabled(true);
              Ext.each(this.winGestionarDocumento.panelSuperior.findByType('textfield'), function (_item) {
                        _item.setDisabled(true);
                    });
                    this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(true);
                    if (this.grantedAction('RDesagregacion')) {
                       this.winGestionarDocumento.panelSuperior.findByType('checkbox')[0].setDisabled(true);
                    }
                    
                    this.winGestionarDocumento.buttons[2].hide();
                    this.winGestionarDocumento.buttons[1].hide();
                }
                if (this.winGestionarDocumento.record.data.estado > 3) {
                    this.winGestionarDocumento.buttons[2].hide();
                    this.winGestionarDocumento.buttons[1].hide();
                }
                else {
                    this.winGestionarDocumento.buttons[2].show();
                    this.winGestionarDocumento.buttons[1].show();
                }
            } else {
                this.winGestionarDocumento.setTitle(this.idioma.tlVentanaAdicionar);
                Ext.each(this.winGestionarDocumento.panelSuperior.findByType('combo'), function (_item) {
                    _item.setDisabled(false);
                });
                Ext.each(this.winGestionarDocumento.panelSuperior.findByType('datefield'), function (_item) {
                    _item.setDisabled(false);
                });
               //this.winGestionarDocumento.panelSuperior.findByType('compositefield')[0].setDisabled(false);
                Ext.each(this.winGestionarDocumento.panelSuperior.findByType('textfield'), function (_item) {
                    _item.setDisabled(false);
                });
                if (this.grantedAction('RDesagregacion')) {
                    Ext.each(this.winGestionarDocumento.panelSuperior.findByType('checkbox'), function (_item) {
                        _item.setDisabled(false);
                    });
                }
                this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(false);
                if (this.grantedAction('RDesagregacion')) {
                    Ext.each(this.winGestionarDocumento.panelSuperior.findByType('checkbox'), function (_item) {
                        _item.setDisabled(false);
                    });
                }
                if (this.grantedAction('RDesagregacion')) {
                this.winGestionarDocumento.panelSuperior.findByType('checkbox')[0].setDisabled(false);
                }
                this.winGestionarDocumento.buttons[1].show();
                this.winGestionarDocumento.buttons[2].show();
            }
        }
    },
    getParamsReport: function (record, btn) {
        var _this = this;
        return btn.isList ? _this.getStorePrincipal().baseParams : {
            iddocumento: record.get("iddocumento") || null,
            idcartatecindustrial: record.get("idcartatecnologica") || null,
            idalmacenorigen: _this.cmbAlmacen.getValue() || null,
        
        };
    },
    getFicha:function(_this,record,btn){
        this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                dirReport: '/distra/logistica/produccion/ordenproduccion/FichaCosto',
                isList:true,
                params: {
                   iddocumento:_this.getGridPrincipal().getSelectionModel().getSelected().data.iddocumento,
                    idcartatecindustrial:_this.getGridPrincipal().getSelectionModel().getSelected().data.idcartatecnologica,
                    //idalmacenorigen: _this.cmbAlmacen.getValue() || null,

                }
                }
                ]
        });this.tipoReportes.view();
    }

});

Ext.namespace('Ext.ux.grid');
Ext.ux.grid.ProgressColumn = Ext.extend(Ext.util.Observable, {
    /**
     * @cfg {String} colored determines whether use special progression coloring
     *      or the standard Ext.ProgressBar coloring for the bar (defaults to
     *      false)
     */
    textPst: '%',
    /**
     * @cfg {String} colored determines whether use special progression coloring
     *      or the standard Ext.ProgressBar coloring for the bar (defaults to
     *      false)
     */
    colored: false,
    /**
     * @cfg {String} actionEvent Event to trigger actions, e.g. click, dblclick,
     *      mouseover (defaults to 'dblclick')
     */
    actionEvent: 'dblclick',

    constructor: function (config) {
        Ext.apply(this, config);
        this.renderer = this.renderer.createDelegate(this);
        this.addEvents('action');
        Ext.ux.grid.ProgressColumn.superclass.constructor.call(this);
    },
    init: function (grid) {
        this.grid = grid;
        this.view = grid.getView();

        if (this.editor && grid.isEditor) {
            var cfg = {
                scope: this
            };
            cfg[this.actionEvent] = this.onClick;
            grid.afterRender = grid.afterRender.createSequence(function () {
                this.view.mainBody.on(cfg);
            }, this);
        }
    },

    onClick: function (e, target) {
        var rowIndex = e.getTarget('.x-grid3-row').rowIndex;
        var colIndex = this.view.findCellIndex(target.parentNode.parentNode);

        var t = e.getTarget('.x-progress-text');
        if (t) {
            this.grid.startEditing(rowIndex, colIndex);
        }
    },

    renderer: function (v, p, record) {
        var style = '';
        var textClass = (v < 55) ? 'x-progress-text-back' : 'x-progress-text-front' + (Ext.isIE6 ? '-ie6' : '');
        if (v == 0)
            textClass = 'x-progress-text-wrong';
        //ugly hack to deal with IE6 issue
        var text = String.format('</div><div class="x-progress-text {0}" style="width:100%;" id="{1}">{2}</div></div>',
            textClass, Ext.id(), v + this.textPst
        );
        text = (v < 96) ? text.substring(0, text.length - 6) : text.substr(6);

        if (this.colored == true) {
            if (v <= 50 && v >= 0)
                style = '-red';
            if (v < 70 && v > 50)
                style = '-orange';
            if (v > 70)
                style = '-green';
        }
        p.css += ' x-grid3-progresscol';
        return String.format(
            '<div class="x-progress-wrap"><div class="x-progress-inner"><div class="x-progress-bar{0}" style="width:{1}%;">{2}</div>' +
            '</div>', style, v, text
        );
    }
});