Utilidades.Cmp.Cmpcrudmonitoreo = function (opciones) {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    var valorfecha = true;
    this.BarraProgreso = new BarraEstado();
    this.url = '/planificacion/pdo/plan/index.php/cmpgestionarmonitoreo/'
    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();
    this.formatohora = 'H:i';
    this.hvalorminimo = '00:00';
    this.hvalormaximo = '23:45';
    var arr_dates, arrayalarma = [];
    var arr_hour = [];
    var pgactual = 0;
    var operador = '';

    this.CrearWinPrincipal = function (idelemento, stTGCmpActividades) {
        var _this = this;
        this.btnAdicionar = new Ext.Button({
            handler: function () {
                _this.CrearWinMonitoreo(idelemento, stTGCmpActividades)
            },
            disabled: false,
            iconCls: 'adicionar',
            tooltip: 'Adicionar alarma',
            key: {
                alt: true,
                key: 'I'
            },
            scope: this
        });
        this.btnModificar = new Ext.Button({
            handler: function () {

            },
            disabled: true,
            id: 'edilio',
            iconCls: 'modificar',
            tooltip: 'Modificar alarma',
            key: {
                alt: true,
                key: 'M'
            },
            scope: this
        });
        this.btnEliminar = new Ext.Button({
            handler: function () {
                _this.EliminarAlarma(_this.stAlarma);
            },
            disabled: true,
            iconCls: 'eliminar',
            tooltip: 'Eliminar alarma',
            key: {
                key: Ext.EventObject.DELETE
            },
            scope: this
        });

        this.stAlarma = new Ext.data.Store({
            autoLoad: false,
            remoteSort: true,
            url: '/planificacion/pdo/plan/index.php/cmpgestionarmonitoreo/cargarAlarmas',
            //   autoLoad: opcionesConfig.cargarDatos,
            baseParams: {
                idelemento: idelemento
            },
            reader: new Ext.data.JsonReader({
                id: 'idalarma',
                root: "campos",
                totalProperty: "total"
            }, [
                {
                    name: 'expregular'
                }, {
                    name: 'textoperador'
                },
                {
                    name: 'idoperador'
                },
                {
                    name: 'operador'
                },
                {
                    name: 'involucrados'
                },
                {
                    name: 'cantdias'
                },
                {
                    name: 'via'
                },
                {
                    name: 'tipoaviso'
                },
                {
                    name: 'asunto'
                },
                {
                    name: 'fecha'
                }, {
                    name: 'hora'
                }, {
                    name: 'porciento'
                },
                {
                    name: 'idelem'
                }, {
                    name: 'hora'
                },
                {
                    name: 'cumplimiento'
                },
                {
                    name: 'aprobacion'
                }
            ]),
            listeners: {
                beforeload: function (s) {
                    _this.BarraProgreso.show('Cargando');
                    s.baseParams.start = pgactual;
                    s.baseParams.limit = _this.paginadoAlarma.pageSize;
                },
                load: function (st) {
                    _this.BarraProgreso.hide();
                    //_this.stPuntualizaciones.clearSelections();
                }
            }
        });
        this.smAlarma = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, ri, record) {
                    arrayalarma.push(record.id);
                    _this.ActualizarEstadoBarraHerramientas();
                },
                rowdeselect: function (sm, ri, record) {
                    arrayalarma.remove(record.id);
                    _this.ActualizarEstadoBarraHerramientas();
                }
            }
        });
        this.cmAlarma = [
            _this.smAlarma,
            {
                id: 'expandir',
                header: "Expresión regular",
                width: 470,
                sortable: true,
                dataIndex: 'expregular'
                /* renderer: MostrarImagenTipoElemento*/
            }
        ];

        this.paginadoAlarma = new Ext.PagingToolbar({
            id: "paginadoAlarma",
            pageSize: 15,
            store: _this.stAlarma,
            displayInfo: true,
            listeners: {
                beforechange: function (paginado, evento) {
                    _this.start = evento.start;
                }
            }
        });

        this.gdAlarma = new Ext.grid.GridPanel({
            //region: 'center',
            frame: true,
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            //plugins: _this.filtrosPuntualizaciones,
            autoExpandColumn: 'expandir',
            store: _this.stAlarma,
            sm: _this.smAlarma,
            columns: _this.cmAlarma,
            bbar: _this.paginadoAlarma,
            listeners: {
                rowdblclick: function (t, ri, event) {
                },
                rowcontextmenu: function (t, ri, e) {
                },
                cellclick: function (grid, rowIndex, columnIndex, e) {
                }
            }
        });
        _this.stAlarma.load();
        this.PanPrincipal = new Ext.Panel({
            layout: 'fit',
            //title: opcionesConfig.nombrePanel,
            //region: 'center',
            usarKeymap: true,
            botonesKeymap: [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar],
            tbar: [_this.btnAdicionar, ' ', /*_this.btnModificar, */' ', _this.btnEliminar],
            items: [_this.gdAlarma]
        });

        this.winMon = new Ext.Window({
            modal: true,
            layout: 'fit',
            title: 'Registro de alarmas',
            width: 900,
            height: 500,
            resizable: false,
            listeners: {
                beforeshow: function (win) {
                }
            },
            items: [_this.PanPrincipal]
            /*  buttons: [
                  {
                      //icon: perfil.dirImg + 'cerrar.png',
                      iconCls: 'cerrar',
                      text: 'Cerrar',
                      tooltip: 'Cerrar ventana',
                      handler: function() {
                          _this.winMonitoreo.destroy();
                          valorfecha = true;
                      }
                  }, {
                      //icon: perfil.dirImg + 'aplicar.png',
                      iconCls: 'aplicar',
                      text: 'Aplicar',
                      tooltip: 'Guardar datos y limpiar los campos',
                      id: 'btnaplicar',
                      handler: function() {
                          _this.Gestionaralarma(idelemento);
                          valorfecha = true;


                      }
                  }, {
                      //icon: perfil.dirImg + 'aceptar.png',
                      iconCls: 'aceptar',
                      text: 'Aceptar',
                      tooltip: 'Guardar datos y cerrar ventana',
                      handler: function() {

                          _this.Gestionaralarma(idelemento);
                          valorfecha = true;

                          stTGCmpActividades.reload();
                      }
                  }
              ]*/
        });
        _this.winMon.show();
    };
    this.CrearWinMonitoreo = function (idelemento, stTGCmpActividades) {
        this.arraydest = [];
        this.cdias = new Ext.form.Label({
            text: 'Cantidad de días'
        });
        this.lfecha = new Ext.form.Label({
            text: 'Fecha'
        });

        this.dffecha = new Ext.form.DateField({
            hideLabel: true,
            fieldLabel: 'Fecha',
            format: 'd/m/Y',
            name: 'fecha',
            allowBlank: false,
            invalidText: 'Formato: dd/mm/aaaa.',
            width: 150,
            menuListeners: {
                select: function (df, date) {
                    this.setValue(date);
                }
            }
        });
        this.tcantidaddedias = new Ext.form.NumberField({
            hideLabel: true,
            maxLength: 3,
            maxValue: 365,
            minValue: 1,
            value: 0,
            disabled: true,
            fieldLabel: 'Cantidad de días',
            regex: /^([0-9]+)+$/,
            /// regexText: 'Solo admite caracteres alfanuméricos y el(los) carácter(es) especial(es) (-, _, "", ()).',
            allowBlank: false,
            width: 150
        });
        this.rdantes = new Ext.form.Radio({
            id: 'rdantes',
            boxLabel: 'Antes  ',
            listeners: {
                'check': function (ck, tp) {
                    if (tp) {
                        _this.rddespues.setValue(false);
                        _this.tcantidaddedias.enable();
                    }
                }
            }
        });
        this.rddespues = new Ext.form.Radio({
            boxLabel: 'Después',
            listeners: {
                'check': function (ck, tp) {
                    if (tp) {
                        _this.rdantes.setValue(false);
                        _this.tcantidaddedias.enable();

                    }
                }
            }
        });
        this.fsfechas = new Ext.form.FieldSet({
            title: 'Condiciones para la fecha',
            width: '90%',
            height: 100,
            checkboxToggle: true,
            layout: 'fit',
            collapsible: false,
            items: [
                {
                    layout: 'column',
                    border: false,
                    items: [
                        {
                            columnWidth: 0.50,
                            items: [_this.lfecha, _this.dffecha]
                        },
                        {
                            columnWidth: 0.50,
                            items: [_this.cdias, _this.tcantidaddedias,
		                            {
				                            layout: 'column',
				                            border: false,
				                            items: [
		                            {
				                            columnWidth: 0.5,
				                            items: [_this.rdantes]
		                            },
		                            {
				                            columnWidth: 0.5,
				                            items: [_this.rddespues]
		                            }]}

                                // _this.rdantes, _this.rddespues

                            ]
                        }



                    ]
                }
            ]
        });
        this.chigualporc = new Ext.form.Checkbox({
            boxLabel: 'Igual <b>(=)</b>  ',
            listeners: {
                'check': function (ck, tp) {
                    if (tp) {
                        _this.tporciento.enable();
                        if (operador != '=' && operador.length == 1)
                            operador = operador + '=';
                        if (operador.length == 0)
                            operador = '=';
                    }
                    else {
                        if (!_this.chmayorporc.getValue() && !_this.chmenorporc.getValue()) {
                            _this.tporciento.disable();
                            operador = '';
                        }
                    }
                }
            }
        });
        this.chmayorporc = new Ext.form.Checkbox({
            boxLabel: 'Mayor <b>(>)</b>  ',
            listeners: {
                'check': function (ck, tp) {
                    if (tp) {
                        _this.tporciento.enable();
                        _this.chmenorporc.setValue(false);
                        if (operador == '=')
                            operador = '>=';
                        if (operador.length == 0)
                            operador = '>';
                    }
                    else {
                        if (!_this.chigualporc.getValue() && !_this.chmenorporc.getValue()) {
                            _this.tporciento.disable();
                            operador = '';
                        }
                    }
                }
            }
        });
        this.chmenorporc = new Ext.form.Checkbox({
            id: 'chmenor',
            boxLabel: 'Menor <b>(<)</b>',
            listeners: {
                'check': function (ck, tp) {
                    if (tp) {
                        _this.tporciento.enable();
                        _this.chmayorporc.setValue(false);
                        if (operador == '=')
                            operador = '<=';
                        if (operador.length == 0)
                            operador = '<';
                    }
                    else {
                        if (!_this.chmayorporc.getValue() && !_this.chigualporc.getValue()) {
                            _this.tporciento.disable();
                            operador = '';
                        }
                    }
                }
            }
        });
        this.tporciento = new Ext.form.NumberField({
            hideLabel: false,
            maxLength: 3,
            maxValue: 100,
            disabled: true,
            fieldLabel: 'Porciento',
            regex: /^([0-9]+)+$/,
            allowBlank: true,
            width: '90%'
        });
        this.fsporc = new Ext.form.FieldSet({
            title: 'Condiciones para el % de cumplimiento',
            width: '90%',
            height: 80,
            checkboxToggle: true,
            layout: 'fit',
            collapsible: false,
            items: [
                {
                    layout: 'column',
                    border: false,
                    items: [
                        {
                            columnWidth: 1,
                            items: [_this.tporciento]
                        },
                        {
                            columnWidth: 0.33,
                            items: [_this.chigualporc]
                        },
                        {
                            columnWidth: 0.33,
                            items: [_this.chmayorporc]
                        },
                        {
                            columnWidth: 0.33,
                            items: [_this.chmenorporc]
                        }
                    ]
                }
            ]
        });

        this.tmfhora = new Ext.form.TimeField({
            fieldLabel: 'Hora ',
            format: _this.formatohora,
            minValue: _this.hvalorminimo,
            maxValue: _this.hvalormaximo,
            increment: 15,
            value: '8:00',
            id: 'tmfhoraact',
            editable: true,
            emptyText: 'Seleccione...',
            allowBlank: true,
            anchor: '50%'


        });
        this.fshora = new Ext.form.FieldSet({
            title: 'Condiciones para la hora',
            width: '90%',
            height: 70,
            checkboxToggle: true,
            layout: 'fit',
            collapsible: false,
            items: [
                _this.tmfhora
            ]
        });
        this.stcbestadocumpl = new Ext.data.SimpleStore({
            fields: ['idestado', 'denominacion'],
            data: [
                ['Ninguno', 'Ninguno'],
                ['Sin cumplir', 'Sin cumplir'],
                ['Parcialmente cumplido', 'Parcialmente cumplido'],
                ['Cumplido', 'Cumplido']
            ]
        });
        this.cbestadocumpl = new Ext.form.ComboBox({
            fieldLabel: 'Estado de cumplimiento',
            store: _this.stcbestadocumpl,
            displayField: 'denominacion',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            hiddenName: 'idestado',
            valueField: 'idestado',
            readOnly: true,
            width: 50,
            anchor: '100%',
            allowBlank: true,
            emptyText: 'Seleccione...',
            listeners: {
                select: function (cb, record, index) {
                }
            }
        });
        this.fcump = new Ext.form.FieldSet({
            title: 'Condiciones para el estado de cumplimiento',
            width: '90%',
            height: 75,
            checkboxToggle: true,
            layout: 'fit',
            collapsible: false,
            items: [
                _this.cbestadocumpl
            ]
        });
        this.stcbestadoaprob = new Ext.data.Store({
            //autoLoad: true,
            url: 'cargarcmbestados',
            reader: new Ext.data.JsonReader({
                root: "data",
                id: "idestado"
            }, [{
                name: 'idestado'
            }, {
                name: 'denominacion'
            }])
        });
        this.stcbestadoaprob.load();
        this.cbestadoaprob = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',
            fieldLabel: 'Estado de aprobaci&oacute;n',
            store: _this.stcbestadoaprob,
            hiddenName: 'idestado',
            valueField: 'idestado',
            displayField: 'denominacion',
            triggerAction: 'all',
            loadingText: 'Cargando estados',
            editable: true,
            mode: 'remote',
            anchor: '95%',
            allowBlank: true,
            selectOnFocus: true,
            typeAhead: true,
            listeners: {
                expand: function (combo) {
                    _this.stcbestadoaprob.reload();
                },
                select: function (cb, record, index) {
                }
            }
        });
        this.festcump = new Ext.form.FieldSet({
            title: 'Condiciones para el estado de aprobación',
            width: '90%',
            height: 75,
            checkboxToggle: true,
            layout: 'fit',
            collapsible: false,
            items: [
                _this.cbestadoaprob
            ]
        });
        this.pconfiguraciongeneral = new Ext.Panel({
            title: 'Configuración general',
            frame: true,
            layout: 'form',
            items: [_this.fsfechas, _this.fshora, _this.fsporc, _this.fcump, _this.festcump]

        });
        this.tamensaje = new Ext.form.TextArea({
            anchor: '100%',
            fieldLabel: 'Asunto',
            height: 250,
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es de 255 caracteres.'
        });
        this.stvianotif = new Ext.data.SimpleStore({
            fields: ['idvianot', 'denominacion'],
            data: [
                //[4, 'SMS'],
                [3, 'Correo'],
                //[1, 'Jabber'],
                [2, 'Sistema']
            ]
        });
        _this.cbViaNotificacion = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            fieldLabel: 'Vía de notificación',
            id: 'cbViaNotificacion',
            store: _this.stvianotif,
            displayField: 'denominacion',
            mode: 'local',
            readOnly: true,
            allowBlank: false,
            valueField: 'idvianot',
            width: 50,
            anchor: '100%',
            emptyText: 'Seleccione...',
            listeners: {
                select: function (cb, record, index) {
                }
            }
        });
        this.sttipoaviso = new Ext.data.SimpleStore({
            fields: ['idtipoaviso', 'denominacion'],
            data: [
                [1, 'Alerta'],
                [3, 'Advertencia'],
                [4, 'Error'],
                [2, 'Información']
            ]
        });
        this.cbtipoaviso = new Ext.form.ComboBox({
            fieldLabel: 'Tipo de aviso',
            store: _this.sttipoaviso,
            displayField: 'denominacion',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            hiddenName: 'idtipoaviso',
            valueField: 'idtipoaviso',
            readOnly: true,
            width: 50,
            anchor: '100%',
            emptyText: 'Seleccione...',
            listeners: {
                select: function (cb, record, index) {
                }
            }
        });
        this.pmensaje = new Ext.Panel({
            title: 'Mensaje de la alarma',
            // width: 400,
            frame: true,
            layout: 'form',
            labelAlign: 'top',
            items: [_this.tamensaje, _this.cbtipoaviso, _this.cbViaNotificacion]
            // height: 100
        });
        this.smdestina = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, ri, record) {
                    _this.arraydest.push(record.json)
                },
                rowdeselect: function (sm, ri, record) {
                    _this.arraydest.remove(record.json)
                }
            }
        });
        //store del grid donde muestro los involucrados
        _this.stGInvolucrados = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/mostrarInvolucradosGrupos',
            reader: new Ext.data.JsonReader(
                {
                    id: "idinvolucrado",
                    root: 'campos',
                    totalProperty: 'total'
                }, [{
                    name: 'idinvolucrado'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'llaveinvolucrado'
                }, {
                    name: 'tipo'
                }, {
                    name: 'idusuario'
                }, {
                    name: 'idestructura'
                }, {
                    name: 'nombretipo'
                }, {
                    name: 'idgrupo'
                }, {
                    name: 'tipoinvol'
                }, {
                    name: 'tipoinvolucrado'
                }, {
                    name: 'idtipoinvolucrado'
                }, {
                    name: 'incidencia'
                }, {
                    name: 'actualiza'
                }]
            )
        });
        _this.stGInvolucrados.reload({
            params: {
                idelemento: idelemento,
                idtipoelemento: 3
            }
        });

        _this.GInvolucrados = new Ext.grid.GridPanel({
            title: 'Listado de involucrados seleccionados',
            frame: true,
            //    width: (_this.tipoelemento == 'cargas' || _this.tipoelemento == 'calendario') ? 270 : 350,
            //  clicksToEdit: 1,

            height: 400,
            region: 'east',
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            sm: _this.smdestina,
            viewConfig: {
                forcefit: true
            },
            loadMask: {
                msg: 'Cargando involucrados'
            },
            stripeRows: true,
            columns: [
                _this.smdestina,
                {
                    id: 'expandir',
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    width: 110
                }
            ],
            store: _this.stGInvolucrados
        });

        //panel con layout column
        this.stinvol = new Ext.data.Store({
            autoLoad: false,
            remoteSort: true,
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargaralarmas',
            //   autoLoad: opcionesConfig.cargarDatos,
            baseParams: {
                idelemento: 7
            },
            reader: new Ext.data.JsonReader({
                id: 'idalarma',
                root: "campos",
                totalProperty: "total"
            }, [
                {
                    name: 'condiciones'
                }, {
                    name: 'idcomparacion'
                }, {
                    name: 'fecha'
                }, {
                    name: 'hora'
                }, {
                    name: 'gradocumplimiento'
                },
                {
                    name: 'aprobacion'
                },
                {
                    name: 'idaprobacion'
                },
                {
                    name: 'autor'
                }, {
                    name: 'hora'
                },
                {
                    name: 'estadocumplimiento'
                }
            ]),
            listeners: {
                beforeload: function (s) {
                    _this.BarraProgreso.show('Cargando');
                    s.baseParams.start = pgactual;
                    s.baseParams.limit = _this.paginadoAlarma.pageSize;
                },
                load: function (st) {
                    _this.BarraProgreso.hide();

                    //_this.stPuntualizaciones.clearSelections();
                }
            }
        });
        this.cminvol = [
            _this.smAlarma,
            {
                id: 'expandir',
                header: "",
                width: 470,
                sortable: true,
                dataIndex: 'condiciones'
                /* renderer: MostrarImagenTipoElemento*/
            }, {
                header: "Autor",
                width: 150,
                dataIndex: 'autor',
                sortable: true
            }
        ];

        this.paginadoinvol = new Ext.PagingToolbar({
            id: "paginadoAlarma",
            pageSize: 15,
            store: _this.smAlarma,
            displayInfo: true,
            listeners: {
                beforechange: function (paginado, evento) {
                    _this.start = evento.start;
                }
            }
        });

        this.gdinvol = new Ext.grid.GridPanel({
            height: 400,
            frame: true,
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            store: _this.stinvol,
            sm: _this.sminvol,
            columns: _this.cminvol,
            bbar: _this.paginadoinvol,
            listeners: {
                rowdblclick: function (t, ri, event) {
                },
                rowcontextmenu: function (t, ri, e) {
                },
                cellclick: function (grid, rowIndex, columnIndex, e) {
                }
            }
        });
        this.pdest = new Ext.Panel({
            title: 'Destinatarios',
            // width: 400,
            frame: true,
            layout: 'form',
            items: [_this.GInvolucrados]//_this.gdinvol]
        });
        this.pdatosgenerales = new Ext.FormPanel({
            // title: 'Datos generales',
            frame: true, border: false,
            column: 2,
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'tabpanel',
                                    activeTab: 0,
                                    height: 500,
                                    items: [_this.pconfiguraciongeneral, _this.pmensaje, _this.pdest
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        //fin del panel
        this.winMonitoreo = new Ext.Window({
            modal: true,
            layout: 'fit',
            title: 'Adicionar Alarma',
            width: 500,
            height: 560,
            resizable: false,
            listeners: {
                beforeshow: function (win) {
                }
            },
            items: [_this.pdatosgenerales],
            buttons: [
                {
                    //icon: perfil.dirImg + 'cerrar.png',
                    iconCls: 'cerrar',
                    text: 'Cerrar',
                    tooltip: 'Cerrar ventana',
                    handler: function () {
                        _this.winMonitoreo.destroy();
                        valorfecha = true;
                    }
                }, {
                    //icon: perfil.dirImg + 'aplicar.png',
                    iconCls: 'aplicar',
                    text: 'Aplicar',
                    tooltip: 'Guardar datos y limpiar los campos',
                    id: 'btnaplicar',
                    handler: function () {
                        _this.Gestionaralarma(idelemento);
                        valorfecha = true;


                    }
                }, {
                    //icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    tooltip: 'Guardar datos y cerrar ventana',
                    handler: function () {

                        _this.Gestionaralarma(idelemento);
                        valorfecha = true;

                        stTGCmpActividades.reload();
                    }
                }
            ]
        });

        _this.winMonitoreo.show();
    }
    this.EliminarAlarma = function (st) {
        mostrarMensaje(2, '¿Está seguro que quiere eliminar todas las alarmas de la actividad seleccionada?', function (btnoprimido) {
            if (btnoprimido == 'ok') {
                var mensajeMascara = 'Eliminando alarmas';
                _this.BarraProgreso.show(mensajeMascara);
                Ext.Ajax.request({
                    url: _this.url + 'eliminaralarma',
                    params: {
                        arrayalarmas: Ext.encode(arrayalarma)
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData == 1) {
                            mostrarMensaje(1, " Las alarmas han sido eliminadas satisfactoriamente.");
                            var mensajeMascara = 'Adicionando alarma';
                            _this.BarraProgreso.hide();
                            st.reload();
                        }
                    }
                });
            }
        });
    }
    this.Gestionaralarma = function (idelemento) {
        var mensajeMascara = 'Adicionando alarma';
        _this.BarraProgreso.show(mensajeMascara);
        if (!_this.pdatosgenerales.getForm().isValid() || _this.arraydest.length == 0) {
            mostrarMensaje(1, 'Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).');
            _this.BarraProgreso.hide();
        } else {
            var cantdias = _this.tcantidaddedias.getValue();
            if (_this.rdantes.getValue())
                cantdias = cantdias * -1;
            Ext.Ajax.request({
                url: _this.url + 'insertaralarma',
                params: {
                    cantdias: cantdias,
                    hora: _this.tmfhora.getValue(),
                    fecha: _this.dffecha.value,
                    idelemento: idelemento,
                    /*  fecharesultante:fechafinal,*/
                    operad: operador,
                    igualporc: (_this.chigualporc.getValue()) ? 1 : 0,
                    mayorporc: (_this.chmayorporc.getValue()) ? 1 : 0,
                    menorporc: (_this.chmenorporc.getValue()) ? 1 : 0,
                    /*  antesfecha: (_this.rdantes.getValue())? '-':'+',*/
                    estadoaprov: _this.cbestadoaprob.getValue(),
                    porciento: _this.tporciento.getValue(),
                    estadocump: _this.cbestadocumpl.getValue(),
                    asunto: _this.tamensaje.getValue(),
                    tipoaviso: _this.cbtipoaviso.getValue(),
                    vianotificacion: _this.cbViaNotificacion.getValue(),
                    involucrados: Ext.encode(_this.arraydest)
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData == 0) {
                        mostrarMensaje(1, "Ha ocurrido un error al adicionar la alarma.");
                    } else if (responseData == 1) {
                        mostrarMensaje(1, " La alarma ha sido adicionada satisfactoriamente.");
                    } else if (responseData == 2) {
                        mostrarMensaje(1, " La alarma ha sido adicionada satisfactoriamente. Ha ocurrido un error al generar la notificación de la alarma.");
                    } else if (responseData == 3) {
                        mostrarMensaje(1, "Ha ocurrido un error al adicionar la alarma. No existen datos en el nomenclador de operador.");
                    } else if (responseData == 4) {
                        mostrarMensaje(1, "La alarma ha sido adicionada satisfactoriamente. La alarma no va a generar notificacion(es) porque el(los) usuario(s) no tiene(n) perfil(es) asociado(s).");
                    }

                    _this.BarraProgreso.hide();
                    _this.stAlarma.reload();
                    _this.winMonitoreo.destroy();
                }
            });
        }
    };
    this.ActualizarEstadoBarraHerramientas = function () {
        _this.btnEliminar.disable();
        _this.btnModificar.disable();
        if (_this.smAlarma.hasSelection()) {
            var totalrecords = _this.smAlarma.getSelections().length;
            if (totalrecords > 0) {
                _this.btnEliminar.enable();
                if (totalrecords == 1) {
                    _this.btnModificar.enable();
                }
            }
        }
    };
};

// Utilidades.Cmp.Cmpcrudmonitoreo = function (opciones) {
//
//     //captura del puntero de la clase para poder referenciarlo desde otras funciones
//     var _this = this;
//     var valorfecha = true;
//     this.BarraProgreso = new BarraEstado();
//     this.url = '/planificacion/pdo/plan/index.php/cmpgestionarmonitoreo/'
//     //componente para el manejo de los mensajes de errores de texto regido
//     this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();
//     this.formatohora = 'H:i';
//     this.hvalorminimo = '00:00';
//     this.hvalormaximo = '23:45';
//     var arr_dates = [];
//     var arr_hour = [];
//     var pgactual = 0;
//
//     this.CrearWinPrincipal = function (idelemento, stTGCmpActividades) {
//         var _this = this;
//         this.btnAdicionar = new Ext.Button({
//             handler: function () {
//                 _this.CrearWinMonitoreo(idelemento, stTGCmpActividades)
//             },
//             disabled: false,
//             iconCls: 'adicionar',
//             tooltip: 'Adicionar alarma',
//             key: {
//                 alt: true,
//                 key: 'I'
//             },
//             scope: this
//         });
//         this.btnModificar = new Ext.Button({
//             handler: function () {
//
//             },
//             disabled: true,
//             id: 'edilio',
//             iconCls: 'modificar',
//             tooltip: 'Modificar alarma',
//             key: {
//                 alt: true,
//                 key: 'M'
//             },
//             scope: this
//         });
//         this.btnEliminar = new Ext.Button({
//             handler: function () {
//             },
//             disabled: true,
//             iconCls: 'eliminar',
//             tooltip: 'Eliminar alarma',
//             key: {
//                 key: Ext.EventObject.DELETE
//             },
//             scope: this
//         });
//
//         this.stAlarma = new Ext.data.Store({
//             autoLoad: true,
//             remoteSort: true,
//             url: this.url + 'cargarAlarmas',
//             //   autoLoad: opcionesConfig.cargarDatos,
//             baseParams: {
//                 idelemento: idelemento
//             },
//             reader: new Ext.data.JsonReader({
//                 id: 'idalarma',
//                 root: "campos",
//                 totalProperty: "total"
//             }, [
//                 {
//                     name: 'condiciones'
//                 }, {
//                     name: 'idcomparacion'
//                 }, {
//                     name: 'fecha'
//                 }, {
//                     name: 'hora'
//                 }, {
//                     name: 'gradocumplimiento'
//                 },
//                 {
//                     name: 'autor'
//                 }, {
//                     name: 'hora'
//                 },
//                 {
//                     name: 'estadocumplimiento'
//                 }
//             ]),
//             listeners: {
//                 beforeload: function (s) {
//                     _this.BarraProgreso.show('Cargando datos...');
//                     s.baseParams.start = pgactual;
//                     s.baseParams.limit = _this.paginadoAlarma.pageSize;
//                 },
//                 load: function (st) {
//                     _this.BarraProgreso.hide();
//
//                     //_this.stPuntualizaciones.clearSelections();
//                 }
//             }
//         });
//         this.smAlarma = new Ext.grid.CheckboxSelectionModel({
//             singleSelect: true,
//             listeners: {
//                 rowselect: function (sm, ri, record) {
//                     _this.ActualizarEstadoBarraHerramientas();
//                 },
//                 rowdeselect: function (sm, ri, record) {
//                     _this.ActualizarEstadoBarraHerramientas();
//                 }
//             }
//         });
//         this.cmAlarma = [
//             _this.smAlarma,
//             {
//                 id: 'expandir',
//                 header: "Condiciones",
//                 width: 470,
//                 sortable: true,
//                 dataIndex: 'condiciones'
//                 /* renderer: MostrarImagenTipoElemento*/
//             }, {
//                 header: "Autor",
//                 width: 150,
//                 dataIndex: 'autor',
//                 sortable: true
//             }
//         ];
//
//         this.paginadoAlarma = new Ext.PagingToolbar({
//             id: "paginadoAlarma",
//             pageSize: 1000,
//             store: _this.smAlarma,
//             displayInfo: true,
//             listeners: {
//                 beforechange: function (paginado, evento) {
//                     _this.start = evento.start;
//                 }
//             }
//         });
//
//         this.gdAlarma = new Ext.grid.GridPanel({
//             //region: 'center',
//             frame: true,
//             iconCls: 'icon-grid',
//             master_column_id: 'expandir',
//             //plugins: _this.filtrosPuntualizaciones,
//             autoExpandColumn: 'expandir',
//             store: _this.stAlarma,
//             sm: _this.smAlarma,
//             columns: _this.cmAlarma,
//             bbar: _this.paginadoAlarma,
//             listeners: {
//                 rowdblclick: function (t, ri, event) {
//                 },
//                 rowcontextmenu: function (t, ri, e) {
//                 },
//                 cellclick: function (grid, rowIndex, columnIndex, e) {
//                 }
//             }
//         });
//         this.PanPrincipal = new Ext.Panel({
//             layout: 'fit',
//             //title: opcionesConfig.nombrePanel,
//             //region: 'center',
//             usarKeymap: true,
//             botonesKeymap: [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar],
//             tbar: [_this.btnAdicionar, ' ', _this.btnModificar, ' ', _this.btnEliminar],
//             items: [_this.gdAlarma]
//         });
//
//         this.winMon = new Ext.Window({
//             modal: true,
//             layout: 'fit',
//             title: 'Registro de alarmas',
//             width: 700,
//             height: 500,
//             resizable: false,
//             listeners: {
//                 beforeshow: function (win) {
//                 }
//             },
//             items: [_this.PanPrincipal]
//             /*  buttons: [
//                   {
//                       //icon: perfil.dirImg + 'cerrar.png',
//                       iconCls: 'cerrar',
//                       text: 'Cerrar',
//                       tooltip: 'Cerrar ventana',
//                       handler: function() {
//                           _this.winMonitoreo.destroy();
//                           valorfecha = true;
//                       }
//                   }, {
//                       //icon: perfil.dirImg + 'aplicar.png',
//                       iconCls: 'aplicar',
//                       text: 'Aplicar',
//                       tooltip: 'Guardar datos y limpiar los campos',
//                       id: 'btnaplicar',
//                       handler: function() {
//                           _this.Gestionaralarma(idelemento);
//                           valorfecha = true;
//
//
//                       }
//                   }, {
//                       //icon: perfil.dirImg + 'aceptar.png',
//                       iconCls: 'aceptar',
//                       text: 'Aceptar',
//                       tooltip: 'Guardar datos y cerrar ventana',
//                       handler: function() {
//
//                           _this.Gestionaralarma(idelemento);
//                           valorfecha = true;
//
//                           stTGCmpActividades.reload();
//                       }
//                   }
//               ]*/
//         });
//         _this.winMon.show();
//     };
//     this.CrearWinMonitoreo = function (idelemento, stTGCmpActividades) {
//         this.arraydest = [];
//         this.cdias = new Ext.form.Label({
//             text: 'Cantidad de días'
//         });
//         this.lfecha = new Ext.form.Label({
//             text: 'Fecha'
//         });
//
//         this.dffecha = new Ext.form.DateField({
//             hideLabel: true,
//             fieldLabel: 'Fecha',
//             format: 'd/m/Y',
//             name: 'fecha',
//             allowBlank: false,
//             invalidText: 'El formato establecido: dd/mm/aaaa.',
//             width: 150,
//             menuListeners: {
//                 select: function (df, date) {
//                     this.setValue(date);
//                 }
//             }
//         });
//         this.tcantidaddedias = new Ext.form.NumberField({
//             hideLabel: true,
//             maxLength: 3,
//             maxValue: 365,
//             minValue: 1,
//             value: 0,
//             disabled: true,
//             fieldLabel: 'Cantidad de días',
//             regex: /^([0-9]+)+$/,
//             allowBlank: false,
//             width: 150
//         });
//         this.rdantes = new Ext.form.Radio({
//             id: 'rdantes',
//             boxLabel: 'Antes  ',
//             listeners: {
//                 'check': function (ck, tp) {
//                     if (tp) {
//                         _this.rddespues.setValue(false);
//                         _this.tcantidaddedias.enable();
//                     }
//                 }
//             }
//         });
//         this.rddespues = new Ext.form.Radio({
//             boxLabel: 'Después',
//             listeners: {
//                 'check': function (ck, tp) {
//                     if (tp) {
//                         _this.rdantes.setValue(false);
//                         _this.tcantidaddedias.enable();
//
//                     }
//                 }
//             }
//         });
//         this.fsfechas = new Ext.form.FieldSet({
//             title: 'Condiciones para la fecha',
//             width: '90%',
//             height: 100,
//             checkboxToggle: true,
//             layout: 'fit',
//             collapsible: false,
//             items: [{
//                 layout: 'column',
//                 border: false,
//                 items: [{
//                     columnWidth: 0.50,
//                     items: [_this.lfecha, _this.dffecha]
//                 }, {
//                     columnWidth: 0.50,
//                     items: [_this.cdias, _this.tcantidaddedias]
//                 }, {
//                     columnWidth: 0.5,
//                     items: [_this.rdantes]
//                 }, {
//                     columnWidth: 0.5,
//                     items: [_this.rddespues]
//                 }]
//             }]
//         });
//         this.chigualporc = new Ext.form.Checkbox({
//             boxLabel: 'Igual <b>(=)</b>  ',
//             listeners: {
//                 'check': function (ck, tp) {
//                     if (tp) {
//                         _this.tporciento.enable();
//                     }
//                     else {
//                         if (!_this.chmayorporc.getValue() && !_this.chmenorporc.getValue()) {
//                             _this.tporciento.disable();
//                         }
//                     }
//                 }
//             }
//         });
//         this.chmayorporc = new Ext.form.Checkbox({
//             boxLabel: 'Mayor <b>(>)</b>  ',
//             listeners: {
//                 'check': function (ck, tp) {
//                     if (tp) {
//                         _this.tporciento.enable();
//                         _this.chmenorporc.setValue(false);
//                     }
//                     else {
//                         if (!_this.chigualporc.getValue() && !_this.chmenorporc.getValue()) {
//                             _this.tporciento.disable();
//                         }
//                     }
//                 }
//             }
//         });
//         this.chmenorporc = new Ext.form.Checkbox({
//             id: 'chmenor',
//             boxLabel: 'Menor <b>(<)</b>',
//             listeners: {
//                 'check': function (ck, tp) {
//                     if (tp) {
//                         _this.tporciento.enable();
//                         _this.chmayorporc.setValue(false);
//                     }
//                     else {
//                         console.log(_this.chmayorporc.getValue())
//                         if (!_this.chmayorporc.getValue() && !_this.chigualporc.getValue()) {
//                             _this.tporciento.disable();
//                         }
//                     }
//                 }
//             }
//         });
//         this.tporciento = new Ext.form.NumberField({
//             hideLabel: false,
//             maxLength: 3,
//             maxValue: 100,
//             disabled: true,
//             fieldLabel: 'Porciento',
//             regex: /^([0-9]+)+$/,
//             allowBlank: true,
//             width: '90%'
//         });
//         this.fsporc = new Ext.form.FieldSet({
//             title: 'Condiciones para el % de cumplimiento',
//             width: '90%',
//             height: 80,
//             checkboxToggle: true,
//             layout: 'fit',
//             collapsible: false,
//             items: [
//                 {
//                     layout: 'column',
//                     border: false,
//                     items: [
//                         {
//                             columnWidth: 1,
//                             items: [_this.tporciento]
//                         },
//                         {
//                             columnWidth: 0.33,
//                             items: [_this.chigualporc]
//                         },
//                         {
//                             columnWidth: 0.33,
//                             items: [_this.chmayorporc]
//                         },
//                         {
//                             columnWidth: 0.33,
//                             items: [_this.chmenorporc]
//                         }
//                     ]
//                 }
//             ]
//         });
//
//         this.tmfhora = new Ext.form.TimeField({
//             fieldLabel: 'Hora ',
//             format: _this.formatohora,
//             minValue: _this.hvalorminimo,
//             maxValue: _this.hvalormaximo,
//             increment: 15,
//             value: '8:00',
//             id: 'tmfhoraact',
//             editable: false,
//             emptyText: 'Seleccione...',
//             allowBlank: true,
//             anchor: '50%'
//
//
//         });
//         this.fshora = new Ext.form.FieldSet({
//             title: 'Condiciones para la hora',
//             width: '90%',
//             height: 70,
//             checkboxToggle: true,
//             layout: 'fit',
//             collapsible: false,
//             items: [
//                 _this.tmfhora
//             ]
//         });
//         this.stcbestadocumpl = new Ext.data.SimpleStore({
//             fields: ['idestado', 'denominacion'],
//             data: [
//                 [0, 'Ninguno'],
//                 [1, 'Sin cumplir'],
//                 [2, 'Parcialmente cumplido'],
//                 [3, 'Cumplido']
//             ]
//         });
//         this.cbestadocumpl = new Ext.form.ComboBox({
//             fieldLabel: 'Estado de cumplimiento',
//             store: _this.stcbestadocumpl,
//             displayField: 'denominacion',
//             typeAhead: true,
//             mode: 'local',
//             triggerAction: 'all',
//             selectOnFocus: true,
//             hiddenName: 'idestado',
//             valueField: 'idestado',
//             readOnly: true,
//             width: 50,
//             anchor: '100%',
//             allowBlank: true,
//             emptyText: 'Seleccione...',
//             listeners: {
//                 select: function (cb, record, index) {
//                 }
//             }
//         });
//         this.fcump = new Ext.form.FieldSet({
//             title: 'Condiciones para el estado de cumplimiento',
//             width: '90%',
//             height: 75,
//             checkboxToggle: true,
//             layout: 'fit',
//             collapsible: false,
//             items: [
//                 _this.cbestadocumpl
//             ]
//         });
//         this.stcbestadoaprob = new Ext.data.Store({
//             //autoLoad: true,
//             url: 'cargarcmbestados',
//             reader: new Ext.data.JsonReader({
//                 root: "data",
//                 id: "idestado"
//             }, [{
//                 name: 'idestado'
//             }, {
//                 name: 'denominacion'
//             }])
//         });
//         this.stcbestadoaprob.load();
//         this.cbestadoaprob = new Ext.form.ComboBox({
//             emptyText: 'Seleccione...',
//             fieldLabel: 'Estado de aprobaci&oacute;n',
//             store: _this.stcbestadoaprob,
//             hiddenName: 'idestado',
//             valueField: 'idestado',
//             displayField: 'denominacion',
//             triggerAction: 'all',
//             loadingText: 'Cargando estados...',
//             editable: true,
//             mode: 'remote',
//             anchor: '95%',
//             allowBlank: true,
//             selectOnFocus: true,
//             typeAhead: true,
//             listeners: {
//                 expand: function (combo) {
//                     _this.stcbestadoaprob.reload();
//                 },
//                 select: function (cb, record, index) {
//                 }
//             }
//         });
//         this.festcump = new Ext.form.FieldSet({
//             title: 'Condiciones para el estado de aprobación',
//             width: '90%',
//             height: 75,
//             checkboxToggle: true,
//             layout: 'fit',
//             collapsible: false,
//             items: [
//                 _this.cbestadoaprob
//             ]
//         });
//         this.pconfiguraciongeneral = new Ext.Panel({
//             title: 'Configuración General',
//             frame: true,
//             layout: 'form',
//             items: [_this.fsfechas, _this.fshora, _this.fsporc, _this.fcump, _this.festcump]
//
//         });
//         this.tamensaje = new Ext.form.TextArea({
//             anchor: '100%',
//             fieldLabel: 'Asunto',
//             height: 250,
//             maxLength: 255,
//             maxLengthText: 'El tamaño máximo requerido es de 255 caracteres.'
//         });
//         this.stvianotif = new Ext.data.SimpleStore({
//             fields: ['idvianot', 'denominacion'],
//             data: [
//                 [4, 'SMS'],
//                 [3, 'Correo'],
//                 [1, 'Jabber'],
//                 [2, 'Sistema']
//             ]
//         });
//         _this.cbViaNotificacion = new Ext.ux.form.LovCombo({
//             xtype: 'combo',
//             fieldLabel: 'Vía de notificación',
//             id: 'cbViaNotificacion',
//             store: _this.stvianotif,
//             displayField: 'denominacion',
//             mode: 'local',
//             readOnly: true,
//             allowBlank: false,
//             valueField: 'idvianot',
//             width: 50,
//             anchor: '100%',
//             emptyText: 'Seleccione...',
//             listeners: {
//                 select: function (cb, record, index) {
//                 }
//             }
//         });
//         this.sttipoaviso = new Ext.data.SimpleStore({
//             fields: ['idtipoaviso', 'denominacion'],
//             data: [
//                 [1, 'Alerta'],
//                 [3, 'Advertencia'],
//                 [4, 'Error'],
//                 [2, 'Información']
//             ]
//         });
//         this.cbtipoaviso = new Ext.form.ComboBox({
//             fieldLabel: 'Tipo de aviso',
//             store: _this.sttipoaviso,
//             displayField: 'denominacion',
//             typeAhead: true,
//             mode: 'local',
//             triggerAction: 'all',
//             selectOnFocus: true,
//             hiddenName: 'idtipoaviso',
//             valueField: 'idtipoaviso',
//             readOnly: true,
//             width: 50,
//             anchor: '100%',
//             emptyText: 'Seleccione...',
//             listeners: {
//                 select: function (cb, record, index) {
//                 }
//             }
//         });
//         this.pmensaje = new Ext.Panel({
//             title: 'Mensaje de la Alarma',
//             // width: 400,
//             frame: true,
//             layout: 'form',
//             labelAlign: 'top',
//             items: [_this.tamensaje, _this.cbtipoaviso, _this.cbViaNotificacion]
//             // height: 100
//         });
//         this.smdestina = new Ext.grid.CheckboxSelectionModel({
//             singleSelect: false,
//             listeners: {
//                 rowselect: function (sm, ri, record) {
//                     _this.arraydest.push(record.json)
//                 },
//                 rowdeselect: function (sm, ri, record) {
//                     _this.arraydest.remove(record.json)
//                 }
//             }
//         });
//         //store del grid donde muestro los involucrados
//         _this.stGInvolucrados = new Ext.data.Store({
//             url: '/planificacion/pdo/plan/index.php/cmpclasificadorinvol/mostrarinvolucrados',
//             reader: new Ext.data.JsonReader(
//                 {
//                     id: "idinvolucrado",
//                     root: 'campos',
//                     totalProperty: 'total'
//                 }, [{
//                     name: 'idinvolucrado'
//                 }, {
//                     name: 'denominacion'
//                 }, {
//                     name: 'llaveinvolucrado'
//                 }, {
//                     name: 'tipo'
//                 }, {
//                     name: 'idusuario'
//                 }, {
//                     name: 'idestructura'
//                 }, {
//                     name: 'nombretipo'
//                 }, {
//                     name: 'idgrupo'
//                 }, {
//                     name: 'tipoinvol'
//                 }, {
//                     name: 'tipoinvolucrado'
//                 }, {
//                     name: 'idtipoinvolucrado'
//                 }, {
//                     name: 'incidencia'
//                 }, {
//                     name: 'actualiza'
//                 }]
//             )
//         });
//         _this.stGInvolucrados.reload({
//             params: {
//                 idelemento: idelemento,
//                 idtipoelemento: 3
//             }
//         });
//
//         _this.GInvolucrados = new Ext.grid.GridPanel({
//             title: 'Listado de involucrados seleccionados',
//             frame: true,
//             //    width: (_this.tipoelemento == 'cargas' || _this.tipoelemento == 'calendario') ? 270 : 350,
//             //  clicksToEdit: 1,
//
//             height: 400,
//             region: 'east',
//             iconCls: 'icon-grid',
//             master_column_id: 'expandir',
//             autoExpandColumn: 'expandir',
//             sm: _this.smdestina,
//             viewConfig: {
//                 forcefit: true
//             },
//             loadMask: {
//                 msg: 'Cargando involucrados'
//             },
//             stripeRows: true,
//             columns: [
//                 _this.smdestina,
//                 {
//                     id: 'expandir',
//                     header: "Denominaci&oacute;n",
//                     sortable: true,
//                     dataIndex: 'denominacion',
//                     width: 110
//                 }
//             ],
//             store: _this.stGInvolucrados
//         });
//
//         //panel con layout column
//         this.stinvol = new Ext.data.Store({
//             autoLoad: false,
//             remoteSort: true,
//             url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargaralarmas',
//             //   autoLoad: opcionesConfig.cargarDatos,
//             baseParams: {
//                 idelemento: 7
//             },
//             reader: new Ext.data.JsonReader({
//                 id: 'idalarma',
//                 root: "campos",
//                 totalProperty: "total"
//             }, [
//                 {
//                     name: 'condiciones'
//                 }, {
//                     name: 'idcomparacion'
//                 }, {
//                     name: 'fecha'
//                 }, {
//                     name: 'hora'
//                 }, {
//                     name: 'gradocumplimiento'
//                 },
//                 {
//                     name: 'autor'
//                 }, {
//                     name: 'hora'
//                 },
//                 {
//                     name: 'estadocumplimiento'
//                 }
//             ]),
//             listeners: {
//                 beforeload: function (s) {
//                     _this.BarraProgreso.show('Cargando datos...');
//                     s.baseParams.start = pgactual;
//                     s.baseParams.limit = _this.paginadoAlarma.pageSize;
//                 },
//                 load: function (st) {
//                     _this.BarraProgreso.hide();
//
//                     //_this.stPuntualizaciones.clearSelections();
//                 }
//             }
//         });
//         this.cminvol = [
//             _this.smAlarma,
//             {
//                 id: 'expandir',
//                 header: "",
//                 width: 470,
//                 sortable: true,
//                 dataIndex: 'condiciones'
//                 /* renderer: MostrarImagenTipoElemento*/
//             }, {
//                 header: "Autor",
//                 width: 150,
//                 dataIndex: 'autor',
//                 sortable: true
//             }
//         ];
//
//         this.paginadoinvol = new Ext.PagingToolbar({
//             id: "paginadoAlarma",
//             pageSize: 1000,
//             store: _this.smAlarma,
//             displayInfo: true,
//             listeners: {
//                 beforechange: function (paginado, evento) {
//                     _this.start = evento.start;
//                 }
//             }
//         });
//
//         this.gdinvol = new Ext.grid.GridPanel({
//             height: 400,
//             frame: true,
//             iconCls: 'icon-grid',
//             master_column_id: 'expandir',
//             autoExpandColumn: 'expandir',
//             store: _this.stinvol,
//             sm: _this.sminvol,
//             columns: _this.cminvol,
//             bbar: _this.paginadoinvol,
//             listeners: {
//                 rowdblclick: function (t, ri, event) {
//                 },
//                 rowcontextmenu: function (t, ri, e) {
//                 },
//                 cellclick: function (grid, rowIndex, columnIndex, e) {
//                 }
//             }
//         });
//         this.pdest = new Ext.Panel({
//             title: 'Destinatarios',
//             // width: 400,
//             frame: true,
//             layout: 'form',
//             items: [_this.GInvolucrados]//_this.gdinvol]
//         });
//         this.pdatosgenerales = new Ext.FormPanel({
//             // title: 'Datos generales',
//             frame: true, border: false,
//             column: 2,
//             items: [
//                 {
//                     layout: 'column',
//                     items: [
//                         {
//                             columnWidth: 1,
//                             layout: 'form',
//                             items: [
//                                 {
//                                     xtype: 'tabpanel',
//                                     activeTab: 0,
//                                     height: 500,
//                                     items: [_this.pconfiguraciongeneral, _this.pmensaje, _this.pdest
//                                     ]
//                                 }
//                             ]
//                         }
//                     ]
//                 }
//             ]
//         });
//
//         //fin del panel
//         this.winMonitoreo = new Ext.Window({
//             modal: true,
//             layout: 'fit',
//             title: 'Adicionar Alarma',
//             width: 500,
//             height: 560,
//             resizable: false,
//             listeners: {
//                 beforeshow: function (win) {
//                 }
//             },
//             items: [_this.pdatosgenerales],
//             buttons: [
//                 {
//                     //icon: perfil.dirImg + 'cerrar.png',
//                     iconCls: 'cerrar',
//                     text: 'Cerrar',
//                     tooltip: 'Cerrar ventana',
//                     handler: function () {
//                         _this.winMonitoreo.destroy();
//                         valorfecha = true;
//                     }
//                 }, {
//                     //icon: perfil.dirImg + 'aplicar.png',
//                     iconCls: 'aplicar',
//                     text: 'Aplicar',
//                     tooltip: 'Guardar datos y limpiar los campos',
//                     id: 'btnaplicar',
//                     handler: function () {
//                         _this.Gestionaralarma(idelemento);
//                         valorfecha = true;
//
//
//                     }
//                 }, {
//                     //icon: perfil.dirImg + 'aceptar.png',
//                     iconCls: 'aceptar',
//                     text: 'Aceptar',
//                     tooltip: 'Guardar datos y cerrar ventana',
//                     handler: function () {
//
//                         _this.Gestionaralarma(idelemento);
//                         valorfecha = true;
//
//                         stTGCmpActividades.reload();
//                     }
//                 }
//             ]
//         });
//
//         _this.winMonitoreo.show();
//     }
//     this.EliminarAlarma = function (idelemento, stTGCmpActividades) {
//         mostrarMensaje(2, '¿Está seguro que quiere eliminar todas las alarmas de la actividad seleccionada?', function (btnoprimido) {
//             if (btnoprimido == 'ok') {
//                 var mensajeMascara = 'Eliminando alarmas';
//                 _this.BarraProgreso.show(mensajeMascara);
//                 Ext.Ajax.request({
//                     url: _this.url + 'eliminaralarma',
//                     params: {
//                         idelemento: idelemento
//                     },
//                     callback: function (options, success, response) {
//                         responseData = Ext.decode(response.responseText);
//                         if (responseData == 1) {
//                             mostrarMensaje(1, " Las alarmas han sido eliminadas satisfactoriamente.");
//                             var mensajeMascara = 'Adicionando alarma';
//                             _this.BarraProgreso.hide();
//                             stTGCmpActividades.reload();
//                         }
//                     }
//                 });
//             }
//         });
//     }
//     this.Gestionaralarma = function (idelemento) {
//         var mensajeMascara = 'Adicionando alarma';
//         _this.BarraProgreso.show(mensajeMascara);
//         if (!_this.pdatosgenerales.getForm().isValid() || _this.arraydest.length == 0) {
//             mostrarMensaje(1, 'Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(sa).');
//             _this.BarraProgreso.hide();
//         } else {
//             var cantdias = _this.tcantidaddedias.getValue();
//             if (_this.rdantes.getValue())
//                 cantdias = cantdias * -1;
//
//             /* var fechafinal=new Date();
//              var fechafinact = _this.dffecha.getValue();
//              fechafinact.format('Y-m-d')
//             var fechafinactmasundia = new Date(fechafinact).add(Date.DAY, 1);
//             fechafinal.setDate((_this.dffecha.getValue()).getDate()+cantdias);
//
//              console.log(fechafinal.toString());*/
//             Ext.Ajax.request({
//                 url: _this.url + 'insertaralarma',
//                 params: {
//                     cantdias: cantdias,
//                     hora: _this.tmfhora.getValue(),
//                     fecha: _this.dffecha.value,
//                     idelemento: idelemento,
//                     /*  fecharesultante:fechafinal,*/
//                     igualporc: (_this.chigualporc.getValue()) ? 1 : 0,
//                     mayorporc: (_this.chmayorporc.getValue()) ? 1 : 0,
//                     menorporc: (_this.chmenorporc.getValue()) ? 1 : 0,
//                     /*  antesfecha: (_this.rdantes.getValue())? '-':'+',*/
//                     estadoaprov: _this.cbestadoaprob.getValue(),
//                     porciento: _this.tporciento.getValue(),
//                     estadocump: _this.cbestadocumpl.getValue(),
//                     asunto: _this.tamensaje.getValue(),
//                     tipoaviso: _this.cbtipoaviso.getValue(),
//                     vianotificacion: _this.cbViaNotificacion.getValue(),
//                     involucrados: Ext.encode(_this.arraydest)
//                 },
//                 callback: function (options, success, response) {
//                     responseData = Ext.decode(response.responseText);
//                     if (responseData == 1) {
//                         mostrarMensaje(1, " La alarma ha sido adicionada satisfactoriamente.");
//                         _this.BarraProgreso.hide();
//                         _this.winMonitoreo.destroy();
//                     }
//                 }
//             });
//         }
//     }
//
//
// }
