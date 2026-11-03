Ext.ns('Ext.erp');
Ext.erp.configuraciontalleres = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    listaBotonesPanel: undefined,
    listaAcciones:undefined,
    constructor: function (config) {
        var _this = this;
        this.listaAcciones = new LOG.util.List(UCID.portal.getAccionesReportes());
        Ext.MessageBox.wait(config.idioma.msgCargandoDatosIniciales, config.idioma.msjLoadMask);
        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.listaBotonesPanel = new LOG.util.List();
        this.addButtonPanel('->');
        this.idioma = config.idioma;
        this.urlController = '/logistica/talleres/configuracion/index.php/configuraciontalleres/';
        this.btnGuardar = LOG.util.Prototipos.botonGuardar({
            text: config.idioma.lbBtnGuardar,
            tooltip: config.idioma.ttlBtnGuardar,
            disabled: true,
            key: {
                alt: true,
                key: 'G'
            },
            handler: function () {
                _this.salvarConfiguracion();
            }
        });
        this.addButtonPanel(this.btnGuardar);
        this.documentKeyMap = new Ext.KeyMap(document,
            [{
                alt: true,
                key: 'G',
                fn: function () {
                    if (_this.isVisible()) {
                        _this.salvarConfiguracion();
                    }
                }
            }]);
        this.addToolbarButtonPanel('->');

        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({
            id: 'ayudaconfiguraciontalleres'
        }));

        this.chxContratoObligatorio = new Ext.form.Checkbox({
            boxLabel: config.idioma.lbBoxContratoObligatorio,
            name: 'contratoobligatorio',
            height: 40,
            hideLabel: true,
            inputValue: 0,
            listeners: {
                check: function(_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if ((!_checkbox.startValue || _checkbox.startValue) && (checked == true || checked == false)) {
                        _this.listaBotonesPanel.arrayData[1].enable();
                    } else {
                        _this.listaBotonesPanel.arrayData[1].disable();
                    }
                }
            }
        });

        this.chxCentroCostosPorActividad = new Ext.form.Checkbox({
            boxLabel: 'Centro de costo por actividad',
            name: 'centrocostosporactividad',
            height: 40,
            hideLabel: true,
            inputValue: 0,
            listeners: {
                check: function(_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if ((!_checkbox.startValue || _checkbox.startValue) && (checked == true || checked == false)) {
                        _this.listaBotonesPanel.arrayData[1].enable();
                    } else {
                        _this.listaBotonesPanel.arrayData[1].disable();
                    }
                }
            }
        });

        this.chxComprobanteCerrar = new Ext.form.Checkbox({
            boxLabel: 'Generar comprobante al cerrar OT',
            name: 'comprobante',
            height: 40,
            hideLabel: true,
            inputValue: 0,
            listeners: {
                check: function(_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if ((!_checkbox.startValue || _checkbox.startValue) && (checked == true || checked == false)) {
                        _this.listaBotonesPanel.arrayData[1].enable();
                    } else {
                        _this.listaBotonesPanel.arrayData[1].disable();
                    }
                }
            }
        });

        this.chxCerrarDiferencia = new Ext.form.Checkbox({
            boxLabel:'Cerrar per\xedodo con diferencia',
            name: 'cierrecondiferencia',
            height: 40,
            hideLabel: true,
            inputValue: 0,
            listeners: {
                check: function(_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if ((!_checkbox.startValue || _checkbox.startValue) && (checked == true || checked == false)) {
                        _this.listaBotonesPanel.arrayData[1].enable();
                    } else {
                        _this.listaBotonesPanel.arrayData[1].disable();
                    }
                }
                
                    // Ext.Ajax.request({
                    //     url: 'adicionarServicioAlArea', 
                    //     method: 'POST',
                    //     callback: function (opt, scs, resp) {
                    //         Ext.getBody().unmask();
                    //         var data = Ext.decode(resp.responseText);
                    //         console.log(data)
                    //         if (data.codigoMsg == 1) {
                    //             if (typeof _fn == 'function') {
                    //                 _fn.createDelegate(this, [data]).call();
                    //             }
                    //            // mostrarMensaje(1, _this.idioma.msjOkCierreP(data.periodo));
                    //         } else if (data.codMsg == 4) {
                    //             mostrarMensaje(4, data.mensaje);
                    //         }  else {
                    //             mostrarMensaje(3, _this.idioma.msjNoCiereP);
                    //         }
                    //         if (data.diferencia == 1) {
                    //             mostrarMensaje(3, _this.idioma.msjCierreDiferencia);
                    //         }
                    //     }
                    // });
                
            }
        });
        this.chxCerraroperarios = new Ext.form.Checkbox({
            boxLabel:'Cerrar orden con operarios asignados',
            name: 'cierreconoperarios',
            height: 40,
            hideLabel: true,
            inputValue: 0,
            listeners: {
                check: function(_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0)
                    if ((!_checkbox.startValue || _checkbox.startValue) && (checked == true || checked == false)) {
                        _this.listaBotonesPanel.arrayData[1].enable();
                    } else {
                        _this.listaBotonesPanel.arrayData[1].disable();
                    };
                }
                
            }
        });

        this.panelCheckBox = new LOG.util.ColumnForm({columnas: 4});
        this.panelCheckBox.addComponent(this.chxContratoObligatorio);
        this.panelCheckBox.addComponent(this.chxCentroCostosPorActividad);
        this.panelCheckBox.addComponent(this.chxComprobanteCerrar);
        this.panelCheckBox.addComponent(this.chxCerrarDiferencia);
        this.panelCheckBox.addComponent(this.chxCerraroperarios);


        this.comboArea = new LOG.util.ComboBox({
            fieldLabel: config.idioma.lbComboArea,
            url: _this.urlController + 'cargarAreasDelTaller',
            valueField: 'id',
            displayField: 'text',
            mode: 'remote',
            //allowBlank: false,
            minChars:1,
            pageSize : 15,
            resizable:true
        });
        this.cmbOrdenProducto = new LOG.util.ComboBox({
            store: new Ext.data.SimpleStore({
                fields:['ordenproducto','denomorden'],
                data: [ [1,'Ordenar por C�digo'],
                        [2,'Ordenar por Denominaci�n'],
                        [3,'�rden de inserci�n de los productos'],
                        [4,'Ordenar por C�digo fabricante'],
                        [5,'Ordenar por Naturaleza']]
            }),
            fieldLabel: config.idioma.lbOrdenproducto/*'Forma de visualizaci\xf3n de los productos'*/,
            hiddenName: "ordenproducto",
            valueField: "ordenproducto",
            displayField: "denomorden",
            editable: false,
            allowBlank: true,
           // hidden:(!_this.grantedAction("CFORDENPROD")),
            //anchor: "20%",
            listeners: {
              select: function () {
                if (
                  _this.frmDesglose.getForm().isValid() &&
                  _this.frmDesglose.getForm().isDirty()
                ) {
                  _this.listaBotonesPanel.arrayData[1].enable();
                } else {
                  // _this.listaBotonesPanel.arrayData[1].disable();
                }
              },
           },
          });
        this.fsComboArea = new Ext.form.FieldSet({
            name: 'name',
            layout: 'form',
            items: [this.comboArea,this.cmbOrdenProducto]
        });

        this.comboCentroCosto = new LOG.util.ComboBox({
            autoLoad: true,
            disabled: false,
            mode: 'local',
            // fieldLabel: this.idioma.lbCentroCosto,
            name: 'idcentrocosto',
            url: '/logistica/talleres/configuracion/index.php/configuraciontalleres/cargarComboCentroCosto',
            valueField: 'idcentrogrupo',
            displayField: 'text',
            queryParam: 'criterio',
            // width: '98%',
            allowBlank: true,
            forceSelection: true,
            // validarEnFormBasico: true,
            campo: true,
            listeners: {
                'keyup': function (cb, e) {
                    if (cb.getRawValue() == "") {
                        cb.setValue("");
                    }
                },
                select: function (cb, record, index) {
                    // console.log(a, b, c);
                    // console.log(this.getRecordSelected());
                    var a = _this.relacionador.gridDerecho.getSelectionModel().getSelected();
                    a.set('denomcentrodecosto', record.get('text'));
                }
            },
            resizable: true
        });

        var columnasActividadesIzq = [
            {
                header: config.idioma.cgDenominacion,
                dataIndex: 'denominacion',
                width: 150,
                align: 'left',
                id: 'idexpandir'
            },
            {
                header: 'Codigo',
                dataIndex: 'codigo',
                width: 80,
                align: 'left',
            },
            {
                dataIndex: 'idservicio',
                hidden: true,
                hideable: false,
            },
            {
                dataIndex: 'idservicioarea',
                hidden: true,
                hideable: false,
            }
        ];

        var columnasActividadesDer = [
            {
                header: config.idioma.cgDenominacion,
                dataIndex: 'denominacion',
                width: 150,
                align: 'left',
                id: 'idexpandir'
            },
            {
                header: 'Codigo',
                dataIndex: 'codigo',
                width: 80,
                hidden: true,
                align: 'left',
            },
            {
                header: 'Centro costo',
                dataIndex: 'idcentrodecosto',
                width: 150,
                align: 'left',
                editor: this.comboCentroCosto,
                renderer: function (v, m, r) {
                    if (v) {
                        return r.get('denomcentrodecosto');
                    }
                }
            },
            {
                dataIndex: 'idservicio',
                hidden: true,
                hideable: false,
            },
            {
                dataIndex: 'idservicioarea',
                hidden: true,
                hideable: false,
            }
        ];

        var fieldsIzqActividades = [{
            name: 'denominacion'
        }, {
            name: 'idservicio'
        }, {
            name: 'codigo'
        }];

        var fieldsDerActividades = [{
            name: 'denominacion'
        }, {
            name: 'idservicio'
        }, {
            name: 'idservicioarea'
        }, {
            name: 'idcentrodecosto'
        }, {
            name: 'denomcentrodecosto'
        }, {
            name: 'codigo'
        }];

        this.relacionador = new Ext.erp.configuraciontalleres.relacionador({
            tituloIzq: config.idioma.tlGridIzquierdo,
            tituloDer: config.idioma.tlGridDerecho,
            idIzq: 'idservicio',
            idDer: 'idservicioarea',
            region: 'center',
            idioma: config.idioma,
            columnsFieldsIzq: columnasActividadesIzq,
            columnsFieldsDer: columnasActividadesDer,
            storeFieldsIzq: fieldsIzqActividades,
            storeFieldsDer: fieldsDerActividades,
            height: 300,
            arrAplicarTodos: ['idcentrodecosto', 'denomcentrodecosto'],
            busquedaSimpleText: 'Denominaci\xf3n'
        });

        var columnasPersonas = [
            {
                header: 'Nombre y apellidos',
                dataIndex: 'nombreapellidos',
                width: 150,
                align: 'left',
                id: 'idexpandir'
            },
            {
                header: 'CI',
                width: 150,
                align: 'left',
                dataIndex: 'numid',
                hidden: false
            },
            {
                dataIndex: 'idpersona',
                hidden: true,
                hideable: false,
            },
            {
                dataIndex: 'idpersonaarea',
                hidden: true,
                hideable: false,
            }
        ];

        var fieldsIzqPersonas = [{
            name: 'nombreapellidos'
        }, {
            name: 'idpersona'
        }, {
            name: 'numid'
        }];

        var fieldsDerPersonas = [{
            name: 'nombreapellidos'
        }, {
            name: 'idpersona'
        }, {
            name: 'idpersonaarea'
        }, {
            name: 'numid'
        }];

        this.relacionadorPersonas = new Ext.erp.configuraciontalleres.relacionador({
            tituloIzq: 'Personas',
            tituloDer: 'Persona asociadas al \xe1rea',
            idIzq: 'idpersona',
            idDer: 'idpersonaarea',
            region: 'center',
            idioma: config.idioma,
            columnsFieldsIzq: columnasPersonas,
            columnsFieldsDer: columnasPersonas,
            storeFieldsIzq: fieldsIzqPersonas,
            storeFieldsDer: fieldsDerPersonas,
            height: 300,
            urlGridIzq: 'cargarPersonas',
            urlGridDer: 'cargarPersonasArea',
            busquedaSimpleText: 'Nombre y apellidos, CI'
        });

        this.comboArea.on('select', function (cb, record, index) {
            _this.relacionador.inicializarRelacionador({
                idarea: record.data.id
            });
            _this.relacionadorPersonas.inicializarRelacionador({
                idarea: record.data.id
            });
            // _this.relacionador.setIdArea(record.data.id);
            // _this.relacionador.stGridIzquierdo.load();
            // _this.relacionador.stGridDerecho.load();
            // _this.relacionador.setValor();
            _this.listaBotonesPanel.getItem(1).disable();
            _this.records = undefined;
        });

        this.comboArea.store.on({
            'beforeload':function(st,obj){
                obj.params.usarsubordinacion = (_this.grantedAction('RUsarSubordinacion'))?1:0;
            }
        })
        _this.relacionador.on({
            'modificado': function () {
                _this.listaBotonesPanel.getItem(1).enable();
            }
        });

        _this.relacionadorPersonas.on({
            'modificado': function () {
                _this.listaBotonesPanel.getItem(1).enable();
            }
        });
        // _this.relacionador.stGridIzquierdo.on({
        //     'beforeload': function (st, obj) {
        //         if (_this.comboArea.getValue()) {
        //             obj.params.idarea = _this.comboArea.getValue();
        //         }
        //     },
        //     'load': function (st) {
        //         Ext.MessageBox.hide();
        //         if (st.getCount() == 0 && !_this.comboArea.getValue()) {
        //             mostrarMensaje(1, config.idioma.lbMsgNoExistenServicio);
        //         }
        //     }
        // });
        // _this.relacionador.stGridDerecho.on({
        //     'beforeload': function (st, obj) {
        //         if (_this.comboArea.getValue()) {
        //             obj.params.idarea = _this.comboArea.getValue();
        //         }
        //     }
        // });

        this.frmDesglose = LOG.util.UIManager.initForm({
            items: [this.panelCheckBox, this.fsComboArea, this.relacionador, this.relacionadorPersonas]
        });

        this.pGeneral = new Ext.erp.configuraciontalleres.RelacionadorAreaServicio({
            frame: true,
            // region: 'center',
            combo: this.comboArea,
            relacionador: this.relacionador,
            items: [this.frmDesglose]
        });

        // config.panelConfiguracion = LOG.util.UIManager.initPanel({
        //     region: 'center',
        //     labelAlign: 'left',
        //     layout: 'form',
        //     items: [this.panelCheckBox, this.pGeneral]
        // });
        //
        // config.fpConfiguracion = LOG.util.UIManager.initForm({
        //     region: 'center',
        //     style: '-moz-border-radius:20px',
        //     bodyStyle: 'padding:10px 10px 0',
        //     layout: 'form',
        //     items: [config.panelConfiguracion]
        // });

        config.layout = 'border';
        config.items = [
            {
                region: 'north',
                tbar: [this.listaBotonesVentanaToolbar.getArray()]
            },
            {
                region: 'center',
                frame: true,
                autoScroll: true,
                items: [this.pGeneral]
            },
            {
                region: 'south',
                tbar: [this.listaBotonesPanel.getArray()]
            }
        ];
        Ext.erp.configuraciontalleres.superclass.constructor.call(this, config);
        _this.on({
            'show': function () {
                   _this.cargarConfiguracionInicial();
            }
        })
    },

    addToolbarButtonPanel: function (b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    addButtonPanel: function (b, f) {
        this.listaBotonesPanel.add(LOG.util.UIManager.reconfigureButton(b));
    },

    cargarConfiguracionInicial: function () {
        var _this = this;
        Ext.getBody().mask(_this.idioma.lbCargandoCfg);
        Ext.Ajax.request({
            url: this.urlController + 'cargarConfiguracionTalleres',
            method: 'POST',
            callback: function (opt, scs, resp) {
                Ext.getBody().unmask();
                if (scs) {
                    aux = Ext.decode(resp.responseText);
                    var record = {
                        data: aux.datos
                    };
                    _this.frmDesglose.getForm().loadRecord(record);
                    Ext.MessageBox.hide();
                }
            }
        });
    },
    salvarConfiguracion: function () {
        var _this = this;
        var evaluar = false;
        var parametros = {};
        // var parametros = _this.relacionador.salvarDatos();
        if (_this.comboArea.isValid()) {
            evaluar = true;
            parametros.idarea = _this.comboArea.getValue();
        }

        var relactividades = _this.relacionador.salvarDatos();
        if (relactividades.isValid()) {
            evaluar = true;
            parametros.relactividades = Ext.encode(relactividades.getDatos());
        } else {
            mostrarMensaje(1, this.idioma.lbMsgNoExisteRelacion);
        }

        var relpersonas = _this.relacionadorPersonas.salvarDatos();
        if (relpersonas.isValid()) {
            evaluar = true;
            parametros.relpersonas = Ext.encode(relpersonas.getDatos());
        }

        if (_this.chxContratoObligatorio.isValid()) {
            evaluar = true;
            parametros.contratoobligatorio = (_this.chxContratoObligatorio.getValue() == true) ? 1 : 0;
        }

        if (_this.chxCentroCostosPorActividad.isValid()) {
            evaluar = true;
            parametros.centrocostosporactividad = (_this.chxCentroCostosPorActividad.getValue() == true) ? 1 : 0;
        }

        if (_this.chxComprobanteCerrar.isValid()) {
            evaluar = true;
            parametros.comprobante = (_this.chxComprobanteCerrar.getValue() == true) ? 1 : 0;
        }

        if (_this.chxCerrarDiferencia.isValid()) {
            evaluar = true;
            parametros.cerrarcondiferencia = (_this.chxCerrarDiferencia.getValue() == true) ? 1 : 0;
        }
        if (_this.chxCerraroperarios.isValid()) {
            evaluar = true;
            parametros.Cerraroperarios = (_this.chxCerraroperarios.getValue() == true) ? 1 : 0;
        }

        if (_this.cmbOrdenProducto.getValue() > 0) {
            evaluar = true;
            parametros.ordenproducto = (_this.cmbOrdenProducto.getValue()> 0) ? _this.cmbOrdenProducto.getValue() : 0;
        }

        // parametros = {
        //     idarea: _this.comboArea.getValue(),
        //     adicionados: Ext.encode(parametros['adicionados']),
        //     eliminados: Ext.encode(parametros['eliminados']),
        //     contratoobligatorio: (_this.chxContratoObligatorio.getValue() == true) ? 1 : 0
        // };

        if (evaluar) {
            Ext.MessageBox.wait('Guardando los datos', 'Espere por favor...');
            Ext.Ajax.request({
                url: this.urlController + 'adicionarServiciosAlArea',
                method: 'POST',
                params: parametros,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    if (resp.success) {
                        if (s) {
                            mostrarMensaje(1, this.idioma.lbMsgObjetoSalvado);
                            _this.btnGuardar.disable();
                            _this.relacionador.inicializarRelacionador({
                                idarea: _this.comboArea.getValue()
                            });
                            _this.relacionadorPersonas.inicializarRelacionador({
                                idarea: _this.comboArea.getValue()
                            });
                            // _this.relacionador.setValor();
                            // _this.relacionador.stGridIzquierdo.load({params: {idarea: _this.comboArea.getValue()}});
                            // _this.relacionador.stGridDerecho.load({params: {idarea: _this.comboArea.getValue()}});
                        }
                    } else {
                        if (typeof _fnfail == 'function') {
                            _fnfail.createDelegate(this, [resp]).call();
                        }
                    }
                }.createDelegate(this)
            });
        }
    },
    grantedAction: function(idAccion) {
        var existe = false;
        this.listaAcciones.each(function(a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    }
});

Ext.erp.configuraciontalleres.relacionador = Ext.extend(Ext.Panel, {
    defaultController: '/logistica/talleres/configuracion/index.php/configuraciontalleres/',
    urlGridIzq: 'cargarServiciosExistentes',
    urlGridDer: 'cargarServiciosArea',
    // valorCampo: 0,
    adicionados: [],
    eliminados: [],
    parametrosBase: {},
    modify: false,
    idIzq: 'id',
    idDer: 'id',
    arrAplicarTodos: [],
    busquedaSimple: true,
    busquedaSimpleText: 'Busqueda',
    constructor: function (config) {
        var _this = this;
        Ext.apply(this, config);
        Ext.erp.configuraciontalleres.relacionador.superclass.constructor.call(this, config);
        this.on({
            'bodyresize': function (panel, width, height) {
                if (!width)
                    width = 385 * 2 + 20;
                var widthNew = 370 + (width / 2 - 370 - 20);
                _this.gridIzquierdo.setWidth(widthNew);
                _this.gridDerecho.setWidth(widthNew);
            }
        });
        this.addEvents('modificado');
    },
    setParametrosBase: function (parametros) {
        this.parametrosBase = parametros;
    },
    getParametrosBase: function () {
        return this.parametrosBase;
    },
    inicializarRelacionador: function (parametros) {

        this.setParametrosBase(parametros);
        this.stGridIzquierdo.initBaseParams = parametros;
        this.stGridDerecho.initBaseParams = parametros;

        this.stGridIzquierdo.load();
        this.stGridDerecho.load();

        this.setValor();
    },
    crearComponenteCentro: function () {
        var _this = this;
        /*
         * Definimos los botones de las operaciones
         */
        this.btnAdicionarTodos = new Ext.Button({
            iconCls: 'ultimapagina',
            tooltip: _this.idioma.ttPasarTodos,
            hidden: false,
            disabled: true
        });

        this.btnAdicionar = new Ext.Button({
            iconCls: 'siguiente',
            tooltip: _this.idioma.ttPasarSeleccion,
            hidden: false,
            disabled: true
        });

        this.btnEliminar = new Ext.Button({
            iconCls: 'anterior',
            tooltip: _this.idioma.ttQuitarSeleccion,
            hidden: false,
            disabled: true
        });

        this.btnEliminarTodos = new Ext.Button({
            iconCls: 'primerapagina',
            tooltip: _this.idioma.ttQuitarTodos,
            hidden: false,
            disabled: true
        });

        this.btnAdicionar.on({
            'click': function () {
                _this.onBtnbtaddClick();
            }
        });

        this.btnAdicionarTodos.on({
            'click': function () {
                _this.onBtnbtaddallClick();
            }
        });

        this.btnEliminar.on({
            'click': function () {
                _this.onBtnbtdelClick();
            }
        });

        this.btnEliminarTodos.on({
            'click': function () {
                _this.onBtnbtdelallClick();
            }
        });

        this.panelOperaciones = new Ext.Panel({
            // layout: 'fit',
            region: 'center',
            frame: true,
            border: false,
            layout: 'form',
            bodyStyle: 'margin-top:10px',
            items: [
                {
                    columnWidth: 1,
                    layout: 'form',
                    items: [{
                        xtype: 'panel',
                        height: 40,
                        // width: 20
                    },
                        this.btnAdicionarTodos
                    ]
                },
                {
                    columnWidth: 1,
                    layout: 'form',
                    items: [{
                        xtype: 'panel',
                        height: 10,
                        // width: 20
                    },
                        this.btnAdicionar
                    ]
                },
                {
                    columnWidth: 1,
                    layout: 'form',
                    items: [{
                        xtype: 'panel',
                        height: 10,
                        // width: 20
                    },
                        this.btnEliminar
                    ]
                },
                {
                    columnWidth: 1,
                    layout: 'form',
                    items: [
                        {
                            xtype: 'panel',
                            height: 10,
                            // width: 20
                        },
                        this.btnEliminarTodos
                    ]
                }]
        });

    },
    crearComponenteIzq: function () {
        var _this = this;
        this.smIzquierdo = new Ext.grid.RowSelectionModel({});

        var fieldsIzq = [];
        if (this.storeFieldsIzq) {
            fieldsIzq = fieldsIzq.concat(_this.storeFieldsIzq);
        }
        this.RecordGridIzquierdo = new Ext.data.Record.create(fieldsIzq);

        /*
         * Creamos el datastore donde se van a almacenar los datos de la tabla
         */
        this.stGridIzquierdo = new Ext.data.Store({
            autoLoad: false,
            idPrimarioDato: this.idIzq,
            url: this.defaultController + this.urlGridIzq,
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: 'datos',
                // id: this.idIzq
            }, this.RecordGridIzquierdo)
        });

        this.stGridIzquierdo.on({
            'beforeload': function () {
                // _this.stGridIzquierdo.baseParams = _this.onStIzqBeforeLoad();
            }
        });

        // var idexpandirizq = this.getTime() + 'expandirizq';
        var columnasIzq = [
            new Ext.LOG.PagingRowNumberer(),

        ];

        if (this.columnsFieldsIzq) {
            columnasIzq = columnasIzq.concat(_this.columnsFieldsIzq);
        }
        this.cmIzquierdo = new Ext.grid.ColumnModel({
            defaults: {
                sortable: true
            },
            columns: columnasIzq
        });

        this.gridIzquierdo = LOG.util.UIManager.initGrid(
            this.cmIzquierdo,
            this.stGridIzquierdo,
            _this.smIzquierdo,
            {
                frame: true,
                region: 'west',
                title: this.tituloIzq,
                autoScroll: true,
                iconCls: 'icon-grid',
                autoExpandColumn: 'idexpandir',
                width: 375,
                nobbar: false
            }
        );

        // this.gridIzquierdo.getTopToolbar().add('->');

        if (this.busquedaSimple) {
            LOG.util.UIManager.initFilterGrid(this.gridIzquierdo, this.busquedaSimpleText);
        }

        // this.gridIzquierdo = new Ext.grid.GridPanel({
        //     frame: true,
        //     region: 'west',
        //     title: this.tituloIzq,
        //     autoScroll: true,
        //     iconCls: 'icon-grid',
        //     autoExpandColumn: 'idexpandir',
        //     loadMask: {
        //         store: _this.stGridIzquierdo
        //     },
        //     width: 375,
        //     store: this.stGridIzquierdo,
        //     cm: this.cmIzquierdo,
        //     sm: _this.smIzquierdo,
        //     bbar: new Ext.PagingToolbar({
        //         pageSize: 30,
        //         store: this.stGridIzquierdo,
        //         displayInfo: false
        //     })
        // });

        // this.gridIzquierdo.on({
        //     'render': function () {
        //         _this.stGridIzquierdo.reload();
        //     }
        // });

        this.stGridIzquierdo.on({
            'load': function (st) {
                _this.activarBtns();
            }
        });

        this.smIzquierdo.on({
            'rowselect': function () {
                _this.activarBtns();
            },
            'rowdeselect': function () {
                _this.activarBtns();
            }
        });
    },
    crearComponenteDer: function () {
        var _this = this;
        this.smDerecho = new Ext.grid.RowSelectionModel({});

        var fieldsDer = [];
        if (this.storeFieldsDer) {
            fieldsDer = fieldsDer.concat(_this.storeFieldsDer);
        }

        this.RecordGridDerecho = new Ext.data.Record.create(fieldsDer);

        this.stGridDerecho = new Ext.data.Store({
            autoLoad: false,
            idPrimarioDato: this.idDer,
            pruneModifiedRecords: true,
            url: this.defaultController + this.urlGridDer,
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos',
                // id: this.idDer
            }, _this.RecordGridDerecho)
        });
        this.stGridDerecho.on({
            'beforeload': function () {
                // _this.stGridDerecho.baseParams = _this.onStDerBeforeLoad();
            }
        });


        var columnasDer = [
            new Ext.LOG.PagingRowNumberer(),

        ];

        if (this.columnsFieldsDer) {
            columnasDer = columnasDer.concat(_this.columnsFieldsDer);
        }

        this.cmDerecho = new Ext.grid.ColumnModel({
            defaults: {
                sortable: true
            },
            columns: columnasDer
        });
        var arrBtns = [];
        if (this.arrAplicarTodos.length) {
            arrBtns.push(
                LOG.util.Prototipos.botonGeneral({
                    text: 'Replicar',
                    tooltip: 'Replicar',
                })
            );

            this.smDerecho.on({
                selectionchange: function (sm) {
                    var records = sm.getSelections();
                    if (records.length === 1) {
                        arrBtns[0].enable();
                    } else {
                        arrBtns[0].disable();
                    }
                }
            })

            arrBtns[0].on({
                'click': function () {
                    var record = _this.smDerecho.getSelected();
                    var otrrecords = _this.stGridDerecho.getRange();
                    var idPrimarioDato = _this.stGridDerecho.idPrimarioDato;

                    Ext.each(otrrecords, function (r) {
                        if (record.get(idPrimarioDato) != r.get(idPrimarioDato)) {
                            Ext.each(_this.arrAplicarTodos, function (apl) {
                                r.set(apl, record.get(apl));
                            });
                        }
                    });
                }
            });
        }

        this.gridDerecho = LOG.util.UIManager.initEditableGridPanel(
            this.cmDerecho,
            this.stGridDerecho,
            _this.smDerecho,
            {
                // id: 'idgriderecho',
                frame: true,
                region: 'east',
                title: this.tituloDer,
                autoScroll: true,
                iconCls: 'icon-grid',
                autoExpandColumn: 'idexpandir',
                width: 375,
                clicksToEdit: 1,
                // tbar: arrBtns,
                nobbar: false
            }
        );

        if (arrBtns[0]) {
            var tBar = this.gridDerecho.getTopToolbar();
            tBar.add(arrBtns[0], '->');
        }

        if (this.busquedaSimple) {
            LOG.util.UIManager.initFilterGrid(this.gridDerecho, this.busquedaSimpleText);
        }


        // this.gridDerecho = new Ext.grid.EditorGridPanel({
        //     id: 'idgriderecho',
        //     frame: true,
        //     region: 'east',
        //     title: this.tituloDer,
        //     autoScroll: true,
        //     iconCls: 'icon-grid',
        //     autoExpandColumn: 'idexpandir',
        //     width: 375,
        //     clicksToEdit: 1,
        //     loadMask: {
        //         store: _this.stGridDerecho
        //     },
        //     store: this.stGridDerecho,
        //     cm: this.cmDerecho,
        //     sm: _this.smDerecho,
        //     //~ columnWidth: .47,
        //     // bbar: new Ext.PagingToolbar({
        //     //     pageSize: 30,
        //     //     store: _this.stGridDerecho,
        //     //     displayInfo: false
        //     // })
        // });

        this.gridDerecho.on({
            // 'render': function () {
            //     _this.stGridDerecho.reload();
            // }
            afteredit: function (e) {
                _this.fireEvent('modificado');
                // console.log(e);
            }
        });

        this.stGridDerecho.on({
            'load': function (st) {
                _this.activarBtns();
            }
        });

        this.smDerecho.on({
            'rowselect': function () {
                _this.activarBtns();
            },
            'rowdeselect': function () {
                _this.activarBtns();
            }
        });
    },
    initComponent: function () {
        this.crearComponenteCentro();
        this.crearComponenteIzq();
        this.crearComponenteDer();



        Ext.applyIf(this, {
            height: 400,
            layout: 'border',
            items: [this.gridIzquierdo, this.panelOperaciones, this.gridDerecho],
            region: 'center'
        });

        Ext.erp.configuraciontalleres.relacionador.superclass.initComponent.call(this);
    },
    activarBtns: function () {
        var cantI = this.stGridIzquierdo.getCount();
        var cantD = this.stGridDerecho.getCount();
        if (cantI > 0) {
            this.btnAdicionarTodos.enable();
            if (this.smIzquierdo.hasSelection()) {
                this.btnAdicionar.enable();
            } else {
                this.btnAdicionar.disable();
            }
        } else {
            this.btnAdicionarTodos.disable();
        }
        if (cantD > 0) {
            this.btnEliminarTodos.enable();
            if (this.smDerecho.hasSelection()) {
                this.btnEliminar.enable();
            } else {
                this.btnEliminar.disable();
            }
        } else {
            this.btnEliminarTodos.disable();
        }
    },
    onBtnbtaddClick: function () {
        var _this = this;
        var arr = this.smIzquierdo.getSelections();
        var arreglo = [];
        if (arr) {
            var idPrimarioDato = this.stGridIzquierdo.idPrimarioDato;
            var actual = _this.stGridDerecho.getRange();
            Ext.each(arr, function (r, pos) {
                if (_this.findRecordEnStore(actual, r.data, idPrimarioDato) == -1) {
                    arreglo.push(r);
                }
                _this.stGridIzquierdo.remove(r);
            });
            _this.adicionarRecords(arreglo);
            _this.fireEvent('modificado');
            _this.modify = true;
        }
    },
    onBtnbtaddallClick: function () {
        var _this = this;
        var arr = _this.stGridIzquierdo.getRange();
        var arreglo = [];
        if (arr.length > 0) {
            var actual = _this.stGridDerecho.getRange();
            var idPrimarioDato = this.stGridIzquierdo.idPrimarioDato;
            Ext.each(arr, function (r, pos) {
                if (_this.findRecordEnStore(actual, r.data, idPrimarioDato) == -1) {
                    arreglo.push(r);
                }
                _this.stGridIzquierdo.remove(r);
            });
            _this.adicionarRecords(arreglo);
            _this.fireEvent('modificado');
            _this.modify = true;
        }
        else {
            mostrarMensaje(1, 'No hay elementos que relacionar.');
        }
    },
    onBtnbtdelClick: function () {
        var _this = this;
        var arr = this.smDerecho.getSelections();
        var arreglo = [];
        if (arr.length > 0) {
            var actual = _this.stGridIzquierdo.getRange();
            var idPrimarioDatoIzq = this.stGridIzquierdo.idPrimarioDato;
            var idPrimarioDatoDer = this.stGridDerecho.idPrimarioDato;
            Ext.each(arr, function (r, pos) {
                if (_this.findRecordEnStore(actual, r.data, idPrimarioDatoIzq) == -1) {
                    arreglo.push(r);
                }
                _this.stGridDerecho.remove(r);
                if (r.data[idPrimarioDatoDer]) {
                    _this.eliminados.push(r.data[idPrimarioDatoDer]);
                }
            });
            _this.eliminarRecords(arreglo);
            _this.fireEvent('modificado');
            _this.modify = true;
        }
        else {
            mostrarMensaje(1, 'Seleccione los datos correctamente.');
        }
    },
    onBtnbtdelallClick: function () {
        var _this = this;
        var arr = _this.stGridDerecho.getRange();
        var arreglo = [];
        if (arr.length > 0) {
            var actual = _this.stGridIzquierdo.getRange();
            var idPrimarioDatoIzq = this.stGridIzquierdo.idPrimarioDato;
            var idPrimarioDatoDer = this.stGridDerecho.idPrimarioDato;
            Ext.each(arr, function (r, pos) {
                if (_this.findRecordEnStore(actual, r.data, idPrimarioDatoIzq) == -1) {
                    arreglo.push(r);
                }
                _this.stGridDerecho.remove(r);
                if (r.data[idPrimarioDatoDer]) {
                    _this.eliminados.push(r.data[idPrimarioDatoDer]);
                }
            });
            _this.eliminarRecords(arreglo);
            _this.fireEvent('modificado');
            _this.modify = true;
        }
        else {
            mostrarMensaje(1, 'No hay elementos que relacionar.');
        }
    },
    adicionarRecords: function (arreglo) {
        this.stGridDerecho.add(arreglo, false);
        this.activarBtns();
    },
    eliminarRecords: function (arreglo) {
        // Ext.each(arreglo, function(r){
        //     if(r.data.idservicioarea){
        //         r.data.idservicioarea = null;
        //         r.json.idservicioarea = null;
        //     }
        // });
        if (arreglo.length) {
            this.stGridIzquierdo.add(arreglo, false);
        }
        this.activarBtns();
    },
    // setValorCampo: function (newValor) {
    //     this.valorCampo = newValor;
    // },
    setValor: function () {
        this.adicionados = [];
        this.eliminados = [];
    },
    // adicionadosActuales: function () {
    //     var records = this.stGridDerecho.getRange();
    //     var arr = [];
    //     Ext.each(records, function (r) {
    //         arr.push(r.data.idactividad);
    //     });
    //     return arr;
    // },
    // onStIzqBeforeLoad: function () {
    //     var baseParams = {
    //         grid: 'izq'
    //     };
    //     return baseParams;
    // },
    // onStDerBeforeLoad: function () {
    //     var baseParams = {
    //         grid: 'der'
    //     };
    //     return baseParams;
    // },
    // loadDatos: function () {
    //     this.stGridIzquierdo.reload();
    //     if (this.valorCampo > 0) {
    //         this.stGridDerecho.reload();
    //     }
    // },
    findRecordEnStore: function (arreglo, valor, id) {
        for (var i = 0; i < arreglo.length; i++) {
            if (arreglo[i].data[id] == valor[id]) {
                return 1;
            }
        }
        // Ext.each(arreglo, function (record) {
        //     console.log(id, record.data[id], valor[id]);
        //     // console.log(id, record, valor);
        //     if (record.data[id] == valor[id]) {
        //         return 1;
        //     }
        // });
        return -1;
    },
    salvarDatos: function () {
        var _this = this;
        var modificados = [];
        var records = this.stGridDerecho.getRange();
        var aux = {
            isValid: function () {
                if (
                    this.adicionados.length > 0 ||
                    this.eliminados.length > 0 ||
                    this.modificados.length > 0
                ) {
                    return true;
                }
                return false;
            },
            getDatos: function () {
                return {
                    adicionados: this.adicionados,
                    eliminados: this.eliminados,
                    modificados: this.modificados,
                    baseParams: this.baseParams,
                };
            }
        };
        var idPrimarioDatoDer = this.stGridDerecho.idPrimarioDato;

        Ext.each(records, function (r) {
            if (!r.data[idPrimarioDatoDer])
                _this.adicionados.push(r.data);
        });
        Ext.each(this.stGridDerecho.getModifiedRecords(), function (r) {
            modificados.push(r.data);
        });
        aux.adicionados = this.adicionados;
        aux.eliminados = this.eliminados;
        aux.modificados = modificados;
        aux.baseParams = this.getParametrosBase();
        return aux;
    }
});

Ext.erp.configuraciontalleres.RelacionadorAreaServicio = Ext.extend(LOG.util.Panel, {
    comboArea: undefined,
    constructor: function (config) {
        var me = this;
        this.idioma = config.idioma;
        this.relacionador = config.relacionador;
        config.region = 'center';
        config.frame = true;
        config.name = 'panelAreaServicio';
        this.comboArea = config.combo;
        Ext.erp.configuraciontalleres.RelacionadorAreaServicio.superclass.constructor.call(this, config);
    }

});