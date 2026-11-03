Ext.ns('Ext.erp.hojasconteo');
Ext.erp.hojasconteo = Ext.extend(LOG.util.UITemplate, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        var _this = this;
        config.dirController = '/logistica/inventario/recuperaciones/index.php/hojasconteo';
        config.urlBusquedaGridPrincipal = 'cargarHojasconteo';
        config.modoSeleccion = 1;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = true;
        //config.foreceFitView = false;
        config.idioma = {};
        Ext.erp.hojasconteo.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, log.inv.hojasconteo.Idioma);
        _this.concepto = this.idioma.depositos;
        _this.textBusquedaSimple = this.idioma.txtBusquedaSimple;
        _this.criterio = null;
        _this.valuedetalle = 0;
        //_this.cmbEstructura = 0;


    },
    init: function () {
        var _this = this;
        Ext.erp.hojasconteo.superclass.init.call(this);
       
        // LOG.util.UIManager.apply(_this.getVistaPrincipal().listaBotones.getItem(0), LOG.util.Prototipos.botonCancelar({
        //     text: 'Cerrar'
        // }, true));
        //this.getVistaPrincipal().listaBotones.getItem(1).hide();
        //this.getVistaPrincipal().listaBotones.getItem(2).hide();
        this.getVistaPrincipal().maximized = true;
        this.getVistaPrincipal().resizable = false;
    },

    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({dataIndex: 'iddeposito'});
        this.addGridColumn({
            header: 'Depositos',
            dataIndex: 'deposito',
            width: 220,
           // agrupador:(_this.grantedAction('REntidad')) ? true : false,
            agrupador:true,
            hidden: true,
            default: true
        });
       
        this.addGridColumn({
            header: 'No.de hoja de conteo',
            dataIndex: 'numeroref',
            default: true
        });
        
        this.addGridColumn({
            header: 'Estado',
            dataIndex: 'estado',
            default: true
        });
        this.addGridColumn({
            header: 'Fecha de apertura',
            dataIndex: 'fechaadicionado',
            align: 'right',
            default: true
        });
        this.addGridColumn({
            header: 'Fecha de aprobación',
            dataIndex: 'fechaaprobado',
            align: 'right',
            default: true
        });
      
        this.addGridColumn({
            header: 'Días diferencia',
            dataIndex: 'dif',
            align: 'right',
            default: true
        });
        this.addGridColumn({
            header: 'Tipo de conteo',
            dataIndex: 'tipoinventario',
            default: true,
            filter: {
                type: 'list',
                options: [[1, 'Inventario diario'], [2, 'Inventario mensual'], [3, 'Inventario parcial'], [4,'Inventario general']],
                dataIndex: 'tipoinventario'
            }
           
        });
        
        this.addGridColumn({
            header: 'Total de items contados',
            dataIndex: 'productos',
            align: 'right',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header:'Importe de costo total',
            dataIndex: 'importetotal',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: 'Importe sobrante',
            dataIndex: 'importesobrante',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: 'Importe faltante',
            dataIndex: 'importefaltante',
            align: 'right',
            default: true
        }));
         this.addGridColumn({
            //header: 'Total de items contados',
            dataIndex: 'estructura',
          //  align: 'right',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idestructura',
            default: true
        });
        this.onGridDobleClick = function () {
                var winVentana = new Ext.erp.hojasconteo.VentanaA({
                    idioma: _this.idioma,
                    _parent: _this
                });
            
         
            winVentana.init();
            _this.vistaVentana = winVentana.view();
            _this.vistaVentana.show();
        };
       
    },
    initDefaultButtons: function () {
        var _this = this;

        this.addToolbarButton(LOG.util.Prototipos.botonAbrir({
            tooltip: 'Abrir para ver naturalezas',
           // text: _this.idioma.btnLimpiar,
            handler: function () {
                _this.onGridDobleClick();
            }
        }));
        // this.addToolbarButton(LOG.util.Prototipos.botonGeneral({
        //     text: 'Exportar hojas de conteo',
        //     tooltip: 'Exportar hojas de conteo',
        //     iconCls: 'exportar',
        //     disabled: false,
        //     handler: function () {
        //         var _this = this;
        //         console.info(this)
        //         Ext.MessageBox.wait(LOG.util.Idioma.msgExportando, LOG.util.Idioma.msgEspere);
        //         Ext.Ajax.request({
        //             url:'/logistica/inventario/recuperaciones/index.php/hojasconteo/imprimirExcel',
        //             method: 'POST',
        //             //  params: {
        //             //    // fechainicio:(_this.textDesde.getValue()) ? _this.textDesde.getValue().format('d-m-Y') : null,
        //             //     //fechafin:(_this.textHasta.getValue()) ? _this.textHasta.getValue().format('d-m-Y') : null,
        //             //     estructura: (_this.cmbEstructura.getValue()) ? _this.cmbEstructura.getValue() : null,
        //             //     depositos:(_this.comboDepositos.getValue()) ? _this.comboDepositos.getValue() : null,
        //             //     checkDeposito : _this.checkDeposito.getValue(),
        //             // },
        //             callback: function (o, s, r) {
        //                 Ext.MessageBox.hide();
        //                 var resp = LOG.util.UIManager.decodeAjaxResponse(r);
        //                 var wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=' + 1 + ',menubar = yes';
        //                 window.open(resp.dirFichero, 'ventana', wCfg);
        //             }.createDelegate(_this)
        //         });
        //     }
        // }), 2);
        this.addToolbarButton( new LOG.util.Prototipos.botonBuscar({
            text: this.idioma.lbBtnBuscar,
            tooltip: this.idioma.ttBtnBuscar,
            // disabled: true,
            handler: function() {
                _this.btnBuscar();
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonLimpiar({
            //tooltip: _this.idioma.ttBtnLimpiar,
            text: _this.idioma.btnLimpiar,
            handler: function () {
                _this.btnLimpiar();
            }
        }));
        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            disabled: true,
            handler: function () {
                _this.getReportes(_this);
            },
            controlFn: function (b, _caller) {
                _caller.getGridPrincipal().store.fireEvent = _caller.getGridPrincipal().store.fireEvent.createSequence(function (e) {
                    if (e == 'load') {
                        if (_caller.getStorePrincipal().getCount() != 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }));
     
    },
    getReportes: function (data) {
        var _this = this;
       
        this.tipoReportes = new LOG.util.Report({
            
            reports: [
                {
                    dirReport: '/distra/logistica/inventario/recuperaciones/HojaConteo/HojasConteo' ,
                    name: 'HojasConteo',
                    isList: true,
                    params: {
                        entidad: (_this.grantedAction('REntidad') && _this.cmbEstructura.getValue())?_this.cmbEstructura.getValue():null,
                       // entidadLogueada:
                        depositos:_this.comboDepositos.getValue()?_this.comboDepositos.getValue(): null,
                        checkDeposito: (_this.checkDeposito.getValue() > 0) ? _this.getStorePrincipal().reader.jsonData.alldepositos : null,
                        fechainicio:(_this.textDesde.getValue()) ? _this.textDesde.getValue().format('d/m/Y'): null,
                        fechafin:(_this.textHasta.getValue()) ? _this.textHasta.getValue().format('d/m/Y'): null,
                        idperiodo:_this.getStorePrincipal().reader.jsonData.periodo,
                        idestado:(_this.comboEstado.getValue())?_this.comboEstado.getValue():null,
                        idnaturaleza:(_this.cmbNaturaleza.getValue())?_this.cmbNaturaleza.getValue():null,
                        idproductos:(_this.gpPrincipal.store.baseParams.idproductos)?_this.gpPrincipal.store.baseParams.idproductos:null
                    }
                }
            ]
        });
        this.tipoReportes.view();
    },
    btnLimpiar:function(){
        var _this=this;
        _this.textDesde.setValue(null);
        _this.textHasta.setValue(null);
        _this.textDesde.setMaxValue(null);
        _this.textHasta.setMinValue(null);
        (_this.grantedAction('REntidad')) ? _this.cmbEstructura.clearValue(): '';
        _this.comboDepositos.clearValue();
        _this.cmbNaturaleza.clearValue();
        _this.comboEstado.clearValue();
        _this.storePrincipal.removeAll();
        _this.checkDeposito.reset();
        (_this.grantedAction('REntidad')) ? _this.cmbEstructura.reset(): '';
        _this.comboDepositos.reset();
        _this.getStorePrincipal().initBaseParams.iddepositos = '';
        _this.getStorePrincipal().initBaseParams.idproductos = '';
        _this.getStorePrincipal().load();
    },
    btnBuscar: function (){
        var _this=this;
        _this.getStorePrincipal().load();
             
     }, 
     grantedAction: function(idAccion) {
        var existe = false;
        Ext.each(acciones_reportes, function(a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },
    render: function(config) {
        var render = Ext.erp.hojasconteo.superclass.render.call(this, config);
        var _this = this;
          _this.onLoadMask('Cargando...');

        this.comboDepositos = new LOG.util.LovCombo({
            fieldLabel:'Depósitos',
            mode: 'local',
            url: '/logistica/inventario/recuperaciones/index.php/hojasconteo/cargardepositos',
            displayField: 'denominacion',
            valueField: 'idestructura',
            autoLoad: true,
            multiSelect:false,
            editable:false,
            width:400,
            listeners:{
                select: function (cb) {
                    if(cb.getValue() > 0){
                        _this.getStorePrincipal().initBaseParams.iddepositos = cb.getValue();
                       // _this.getStorePrincipal().load();
                        
                    }
                    else{
                        _this.getStorePrincipal().initBaseParams.iddepositos = '';
                       
                    }
                }
            }
        });
        this.comboEstado = new LOG.util.ComboBox({
            fieldLabel: '',
            mode: 'local',
            displayField: 'estado',
            valueField: 'idestado',
            autoload: true,
            editable: false,
            store: new Ext.data.SimpleStore({
                fields: ['idestado', 'estado'],
                data: [
                    [1, LOG.lb.documento.Estado[1]],
                    [2, LOG.lb.documento.Estado[2]],
                    [3, LOG.lb.documento.Estado[3]],
                    [5, LOG.lb.documento.Estado[5]]
                   
                ]
            }),listeners:{
                select: function (cb) {
                    if(cb.getValue() > 0){
                        _this.getStorePrincipal().initBaseParams.estado = cb.getValue();
                        _this.getStorePrincipal().load();
                        
                    }else{
                        _this.getStorePrincipal().initBaseParams.estado = '';
                       
                    }
                }
            }
        });
        
        this.lbPeriodo = new Ext.form.Label({
            text: 'Período:'
        });
         _this.textDesde = new Ext.form.DateField({
            fieldLabel: 'Fecha inicio',
            name: 'desdeLV',
            default:true,
            width: 100,
            editable: false,
            vtype: 'daterange',
            id: 'desdeLV',
            endDateField: 'hastaLV'
        });
        _this.textHasta = new Ext.form.DateField({
            fieldLabel: 'Fecha fin',
            name: 'hastaLV',
            width: 100,
            editable: false,
            vtype: 'daterange',
            id: 'hastaLV',
            startDateField: 'desdeLV',
            default:true,
        });
        _this.textMes = new Ext.form.DateField({
            fieldLabel: 'Mes',
            name: 'desdeLV',
            width: 100,
            editable: false,
            vtype: 'daterange',
            id: 'desdeLV',
            default:true,
        });
        _this.textAño = new Ext.form.DateField({
            fieldLabel: 'Año',
            name: 'desdeLV',
            width: 100,
            editable: false,
            vtype: 'daterange',
            id: 'desdeLV',
           default:true,
        });

        if(_this.grantedAction('REntidad')){
            this.cmbEstructura = new LOG.util.ComboBox({
                editable:false,
                fieldLabel: 'Entidades',
                mode: 'local',
                url:'getEstructuras',
                name:'idestructura',
                displayField : 'denominacion',
                valueField : 'idestructura',
                resizable:true,
                width:200, 
                //emptyText:
                listeners:{
                select:function(cb){
                        if (cb.getValue() != '') {
                            _this.cmGridPrincipal.setHidden(1, false);
                            _this.comboDepositos.getStore().reload();
                             _this.getStorePrincipal().load();
                        } else {
                           cb = _this.storePrincipal.data.items[0].data.idestructura;
                            _this.cmGridPrincipal.setHidden(1, true);      
                        }
                    }
                }       
            });
        }
           
       
        this.checkDeposito = new Ext.form.Checkbox({
            boxLabel: 'Todos',
            name: 'detallado',
            hidden:true,
            style: 'margin:3px 0px 0px 35px',
            height: 20,
            width:200
           
        });
    
        this.addToolbarButton(new Ext.form.Label({
            text: 'Naturaleza:'
        }));
        this.addToolbarButton( this.cmbNaturaleza = new LOG.util.ComboBox({
             text:'Naturaleza',
              default: true,
              url:'/logistica/facturacion/facturacion/configuracion/index.php/Conffacturacion/obtenerNaturaleza',
              name: 'idnaturaleza',
              valueField: 'idnaturaleza',
              displayField: 'codigo',
              selectOnlyLeaf: true,
              resizable:true,
               listeners:{
                select: function (cb) {
                    if(cb.getValue()){
                        _this.getStorePrincipal().initBaseParams.idnaturaleza = cb.getValue();
                        _this.getStorePrincipal().load();
                        
                    }else{
                        _this.getStorePrincipal().initBaseParams.idnaturaleza = '';
                       
                    }
                }
            }
          
     }));
    // identidad:_this.storePrincipal.data.items[0].data.idestructura
     var btnProductos = LOG.util.UIManager.createBtn({
        btnProd: true,
        iconCls: 'producto',
        text: 'Productos',
        tooltip: 'Productos',
        handler: function () {
            var winProductos = new LOG.lb.documento.VentanaProductos({
                idioma: _this.idioma,
                busquedaAvanzada:false,
                _parent: _this,
                parametros: {
                  idestructura:(_this.grantedAction('REntidad') && _this.comboDepositos.getValue() == '') ? Ext.encode(_this.cmbEstructura.getValue()) : Ext.encode(_this.comboDepositos.getValue().split(',')),
                    //iddocumento: 1001626694,
                    asentado : -1,
                    entrada: 1
                },
                doAction: function (r) {
                    var _t = this;
                    //if (_this.winGestionarDocumento != undefined) {
                        var _productos = new Array();
                        Ext.each(r, function (rec) {
                            _productos.push(rec.get('idproducto'));
                        });
                        _this.getStorePrincipal().initBaseParams.idproductos = _productos,
                        _this.getStorePrincipal().load();

                        // if (_this.modelo.iddocumento == null) {
                        //     _this.modelo.salvar({
                        //         idestructuracomun: 200531041,
                        //         idproductos: Ext.encode(_productos)
                        //     }, function (resp) {
                        //         _t.postSalvar.createDelegate(_this.winGestionarDocumento, [resp]).call();
                        //     });
                        // } else {
                        //     _this.modelo.adicionarMovimientos({
                        //         idproductos: Ext.encode(_productos)
                        //     }, function (resp) {
                        //         _t.postSalvar.createDelegate(_this.winGestionarDocumento, [resp]).call();
                        //     });
                        // }
                   // }
                },
                // postSalvar: function (r) {
                //     _this.winGestionarDocumento.cargarProductos();
                //     if (_this.winGestionarDocumento.record == null) {
                //         _this.winGestionarDocumento.record = {};
                //         Ext.apply(_this.winGestionarDocumento.record, {
                //             data: {
                //                 iddocumento: r.iddocumento,
                //                 estado: 1,/*_this.porfactura ? "13" : "1",*/
                //                 cantproductos: r.cantproductos,
                //                 idpadre: r.idpadre
                //             }
                //         });
                //     } else {
                //         _this.winGestionarDocumento.record.data.cantproductos = r.cantproductos;
                //     }
                //     _this.winGestionarDocumento.getTitleDocumento(_this.winGestionarDocumento.record.data.iddocumento);
                //     _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                //         LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                //         if (typeof b.controlFn == 'function') {
                //             b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                //         }
                //     }, _this.winGestionarDocumento);
                //     winProductos.getStorePrincipal().reload({params: {iddocumento: r.iddocumento}});
                //     _this.winGestionarDocumento.modelo.getStore().reload();
                //     _this.habilitarElementos();
                // }
            });
            winProductos.init();
            _this.vistaProductos = winProductos.view();
            _this.vistaProductos.show();
        },
        fnEspecialCondition: function () {
            /*if ((!_this.winGestionarDocumento.record || (_this.winGestionarDocumento.record &&
                (_this.porfactura && _this.winGestionarDocumento.record.data.estado == '13') ||
                (!_this.porfactura && _this.winGestionarDocumento.record.data.estado == '1'))) &&
                (_this.modelo.basicForm && _this.modelo.basicForm.isValid())) {
                return false;
            }*/
            
            if ((!_this.winGestionarDocumento.record || _this.winGestionarDocumento.record.data.estado == '1') &&
                (_this.modelo.basicForm && _this.modelo.basicForm.isValid())) {
                return false;
            }
            return true;
        },
        controlFn: function (b) {
            if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                b.setVisible(true);
            } else {
                b.setVisible(false);
            }
        }
    });
        _this.textDesde.endDateField = _this.textHasta.id; //-------validacion de fecha
        _this.textHasta.startDateField = _this.textDesde.id;
        
        this.gpPrincipal.getTopToolbar().add(
            (_this.grantedAction('REntidad')) ? 'Entidad:' : '',
            (_this.grantedAction('REntidad')) ? '-' : '',
            (_this.grantedAction('REntidad')) ? this.cmbEstructura : '',
            '-',
            'Depósitos:',
            this.comboDepositos,
            '-',
            'Estado',
            this.comboEstado,
            this.checkDeposito,
            '-',
            this.lbPeriodo,
            _this.textDesde,
            '-',
             _this.textHasta,
             '-',
             'Naturaleza',
             '-',
             this.cmbNaturaleza,
             '-',
             btnProductos
            );
        
            this.getStorePrincipal().on({
                beforeload:function(st, obj){
                        Ext.apply(obj.params,  {data:Ext.encode(_this.params),
                            fechainicio:(_this.textDesde.getValue()) ? _this.textDesde.getValue().format('d-m-Y') : null,
                            fechafin:(_this.textHasta.getValue()) ? _this.textHasta.getValue().format('d-m-Y') : null,
                            estructura: (_this.grantedAction('REntidad')) ? _this.cmbEstructura.getValue() : null,
                            checkDeposito : (_this.checkDeposito.getValue())? 1 : 0,
                            iddepositos:(_this.comboDepositos) ? _this.comboDepositos.getValue() : null,
                            estado:(_this.comboEstado.getValue())?_this.comboEstado.getValue(): null
                        })
                },
                load:function(st,obj){
                     _this.onUnMask();
                     if(_this.grantedAction('REntidad')){
                        if (st.data.items[0] && !_this.cmbEstructura.getValue()) {
                            _this.cmbEstructura.setValue(st.data.items[0].data.idestructura);
                            _this.cmbEstructura.setRawValue(st.data.items[0].data.estructura);
                        }
                    }
                }
              
            });
        
            _this.comboDepositos.store.on({
                beforeload:function(st, obj){
                    Ext.apply(obj.params,  {data:Ext.encode(_this.params),
                        estructura: (_this.grantedAction('REntidad')) ? _this.cmbEstructura.getValue() : null
                    });
                }
            });

            
        return render;

    },
    onLoadMask: function(msg) {
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: msg});
        myMask.show();
    },
    onUnMask: function() {
       var myMask = new Ext.LoadMask(Ext.getBody());
       myMask.hide();
    }
  
});

Ext.erp.hojasconteo.VentanaA = Ext.extend(LOG.util.UITemplate, {
    record: undefined,
    constructor: function (config) {
        this.listaCheckBoxs = new LOG.util.List();
        config.idioma = LOG.util.UIManager.apply(Ext.erp.hojasconteo.Idioma, LOG.util.Idioma);
       this.urlBusquedaGridPrincipal = '/logistica/inventario/recuperaciones/index.php/hojasconteo/listarProductos';
        this.autoLoad = false;
        this.modoSeleccion = 1;
        this.autoSelect = false;
        this.formaVisualizacion = 'ventana';
        LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma);
        this.record = config.record;
        this.panelBotonesVisible = true;
        Ext.erp.hojasconteo.VentanaA.superclass.constructor.call(this, config);
        this.setTitulo();
    },
    init: function () {
        var _this = this;
        Ext.erp.hojasconteo.VentanaA.superclass.init.call(this);
       
        LOG.util.UIManager.apply(_this.getVistaPrincipal().listaBotones.getItem(0), LOG.util.Prototipos.botonCancelar({
            text: 'Cerrar'
        }, true));
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
        this.getVistaPrincipal().maximized = true;
        this.getVistaPrincipal().resizable = false;
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(new Ext.form.Label({
            text: 'Naturaleza:'
        }));
        this.addToolbarButton( this.cmbNaturaleza = new LOG.util.ComboBox({
             text:'Naturaleza',
              default: true,
              url:'/logistica/facturacion/facturacion/configuracion/index.php/Conffacturacion/obtenerNaturaleza',
              name: 'idnaturaleza',
              valueField: 'idnaturaleza',
              displayField: 'codigo',
              selectOnlyLeaf: true,
              resizable:true,
               listeners:{
                select: function (cb) {
                    if(cb.getValue()){
                        _this.getStorePrincipal().initBaseParams.idnaturaleza = cb.getValue();
                        _this.getStorePrincipal().load();
                        
                    }else{
                        _this.getStorePrincipal().initBaseParams.idnaturaleza = '';
                       
                    }
                }
            }
          
     }));
     this.addToolbarButton('-');
     
    //  this.addToolbarButton( new LOG.util.Prototipos.botonBuscar({
    //     text: this.idioma.lbBtnBuscar,
    //     tooltip: this.idioma.ttBtnBuscar,
    //     handler: function() {
    //        _this.BuscarNaturaleza();
    //     }
    // }));
    this.addToolbarButton(LOG.util.Prototipos.botonLimpiar({
        tooltip: _this.idioma.ttBtnLimpiar,
        text: _this.idioma.btnLimpiar,
        handler: function () {
            _this.LimpiarNaturaleza();
        }
    }));
    this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
        tooltip: this.idioma.ttImprimir,
        disabled: true,
        handler: function () {
            _this.getReportesNaturaleza(_this);
        },
        controlFn: function (b, _caller) {
            _caller.getGridPrincipal().store.fireEvent = _caller.getGridPrincipal().store.fireEvent.createSequence(function (e) {
                if (e == 'load') {
                    if (_caller.getStorePrincipal().getCount() != 0) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                }
            });
        }
    }));
    },
    initDefaultColumns: function () {
        var _this = this;
            this.addGridColumn({
                header: 'C&oacute;digo',
                width: 100,
                dataIndex: 'codigo',
                default: true,
                filter: {
                    type: 'string',
                    dataIndex: 'codigo'
                }
            });
    
            this.addGridColumn({
                header: 'C&oacute;digo del proveedor',
                width: 100,
                dataIndex: 'codigoproveedor',
                default: true,
                filter: {
                    type: 'string',
                    dataIndex: 'codigoproveedor'
                }

            });
            this.addGridColumn({
                header: 'Denominaci&oacute;n',
                width: 210,
                dataIndex: 'text',
                default: true,
                filter: {
                    type: 'string',
                    dataIndex: 'text'
                }
            });
            this.addGridColumn({
                header: 'UM',
                width: 160,
                dataIndex: 'umedida',
                default: true
            });
           
            this.addGridColumn({
                header: 'Conteo',
                dataIndex: 'conteo',
                align: 'right',
                default: true,
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    if (record.json.conteo == -1 /*&& record.json.idproducto > 0*/) {
                        return 'Sin conteo';
                    } else {
                        return parseFloat(value).toFixed(0);
                    }
               }
            });


            this.addGridColumn({
                header: 'Naturaleza',
                width: 160,
                dataIndex: 'naturaleza',
                default: true,
               agrupador:true
            });

        this.addGridColumn({dataIndex: 'iddocumento'});
        this.addGridColumn({dataIndex: 'idproducto'});

       
     },
    BuscarNaturaleza: function (){
        var _this=this;
        _this.getStorePrincipal().load(
        );
             
     },
     LimpiarNaturaleza:function(){
        var _this=this;
        _this.cmbNaturaleza.clearValue();
        _this.storePrincipal.removeAll();
        _this.cmbNaturaleza.reset();
        _this.gpPrincipal.filters.clearFilters();
        _this.getStorePrincipal().filtrado = false;
        _this.getStorePrincipal().load();
    },
    getReportesNaturaleza: function (data) {
        
        var _this = this;
        this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/inventario/recuperaciones/HojaConteo/HojasConteoNaturaleza' ,
                    name: 'HojasConteoNaturaleza',
                    isList: true,
                    params: {
                        iddocumento: _this._parent.smGridPrincipal.getSelections()[0].json.iddocumento,
                        idnaturaleza:(_this.cmbNaturaleza.getValue())?_this.cmbNaturaleza.getValue():null
                    }
                }
            ]
        });
        this.tipoReportes.view();
    },
    render: function () {
        var _this = this;
       
        var render = Ext.erp.hojasconteo.VentanaA.superclass.render.call(this);
       
        this.getStorePrincipal().on({
            beforeload:function(st, obj){
                Ext.apply(obj.params,  {data:Ext.encode(_this.params),
                    iddocumento: _this._parent.smGridPrincipal.getSelections()[0].json.iddocumento,
                    idnaturaleza:(_this.cmbNaturaleza.getValue())?_this.cmbNaturaleza.getValue():null
                });
            }
        });
        
        this.getStorePrincipal().load();
        return render;
    },
    setTitulo: function () {
        var _this = this;
        this.getVistaPrincipal().setTitle(String.format('Nº hoja de conteo ' +  _this._parent.smGridPrincipal.getSelections()[0].json.numeroref));
    }
   
    
});

