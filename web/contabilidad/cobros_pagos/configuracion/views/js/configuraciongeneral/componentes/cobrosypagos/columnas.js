Ext.ns('Ext.Copa.Configuracion');

Ext.Copa.Configuracion.ColumnaCopa = Ext.extend(Ext.Panel, {
    title: 'Copa',
    layout: 'border',
    url: '/contabilidad/cobros_pagos/configuracion/index.php/gestconfcolumncopa/',
    // frame: true,
    constructor: function (config) {
        this.crearFunciones();
        this.crearGrid();
        Ext.Copa.Configuracion.ColumnaCopa.superclass.constructor.call(this);
        this.crearEventos();
    },
    loadMessageBox: function (msg = 'Cargando...', title = 'Por favor espere...') {
        Ext.MessageBox.show({
            title: title,
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });//manera de ocultarlo Ext.MessageBox.hide();
        var f = function (v) {
            return function () {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++)
            setTimeout(f(i), i * 500);
    },
    hideMessageBox: function () {
        Ext.MessageBox.hide();
    },
    adicionarItem: function (item) {
        this.selectTab(item);
    },
    crearFunciones: function () {
        var _this = this;

        this.showBanderas = function (value, metaData, record, rowIndex, colIndex, store) {
            if (value == 0) {
                // metaData.attr = 'ext:qtip="' + '<b>' + self.perfil.etiquetas.lbPrivada + '</b>"';
                // metaData.css = 'icondistra-seleccion rojo';
                metaData.css = 'icondistra-bandera rojo';
            } else {
                // metaData.attr = 'ext:qtip="' + '<b>' + self.perfil.etiquetas.lbPublica + '</b>"';
                metaData.css = 'icondistra-bandera verde';
            }
        };

        this.crearGrid = function () {
            var columns = [
                {
                    // id: 'iddocumento',
                    header: 'Orden',
                    dataIndex: 'orden',
                    width: 50,
                    hidden: false,
                    align: 'center',
                },
                {
                    id: 'idexpandir',
                    header: 'Nombre de columna',
                    dataIndex: 'header',
                    width: 100,
                    hidden: false,
                    align: 'left',
                },
                {
                    header: 'Ancho',
                    dataIndex: 'width',
                    width: 70,
                    hidden: false,
                    align: 'center',
                },
                {
                    // id: 'iddocumento',
                    header: 'Alineamiento',
                    dataIndex: 'align',
                    width: 100,
                    hidden: false,
                    align: 'center',
                },
                {
                    // id: 'iddocumento',
                    header: 'Fuente de los datos',
                    dataIndex: 'dataIndex',
                    width: 110,
                    hidden: false,
                    align: 'left',
                },
                {
                    // id: 'iddocumento',
                    header: 'Tipo de datos',
                    dataIndex: 'type',
                    width: 100,
                    hidden: false,
                    align: 'center',
                },
                {
                    // id: 'iddocumento',
                    header: 'Identificador de columna',
                    dataIndex: 'identificador',
                    width: 110,
                    hidden: false,
                    align: 'left',
                },
                {
                    // id: 'iddocumento',
                    header: 'Modificador',
                    dataIndex: 'render',
                    width: 100,
                    hidden: false,
                    align: 'left',
                },
                {
                    // id: 'iddocumento',
                    header: 'Oculto',
                    dataIndex: 'hidden',
                    width: 70,
                    hidden: false,
                    align: 'center',
                    renderer: this.showBanderas
                },
                {
                    // id: 'iddocumento',
                    header: 'Ocultable',
                    dataIndex: 'hideable',
                    width: 70,
                    hidden: false,
                    align: 'center',
                    renderer: this.showBanderas
                },
                {
                    // id: 'iddocumento',
                    header: 'Organizable',
                    dataIndex: 'sortable',
                    width: 70,
                    hidden: false,
                    align: 'center',
                    renderer: this.showBanderas
                },
                {
                    // id: 'iddocumento',
                    header: 'Expandir',
                    dataIndex: 'autoexpandir',
                    width: 70,
                    hidden: false,
                    align: 'center',
                    renderer: this.showBanderas
                },
                {
                    // id: 'iddocumento',
                    header: 'Filtrar',
                    dataIndex: 'filtrar',
                    width: 70,
                    hidden: false,
                    align: 'center',
                    renderer: this.showBanderas
                },
                {
                    // id: 'iddocumento',
                    header: 'Default',
                    dataIndex: 'default',
                    width: 70,
                    hidden: true,
                    align: 'center',
                    renderer: this.showBanderas
                },
            ];

            var store = new Ext.data.Store({
                url: this.url + 'cargarDatosColumn',
                reader: new Ext.data.JsonReader({
                    // root: 'datos'
                }, [
                    {name: 'idcolumna', mapping: 'idcolumn'},
                    {name: 'orden'},
                    {name: 'width'},
                    {name: 'hidden'},
                    {name: 'hideable'},
                    {name: 'align'},
                    {name: 'dataIndex', mapping: 'dataindex'},
                    {name: 'sortable'},
                    {name: 'type'},
                    {name: 'autoexpandir'},
                    {name: 'identificador'},
                    {name: 'render'},
                    {name: 'header'},
                    {name: 'filtrar'},
                    {name: 'default', mapping: 'defaultt'},
                ])
            });


            this.gridColumna = new Ext.grid.GridPanel({
                title: 'Columnas',
                region: 'center',
                frame: true,
                autoExpandColumn: 'idexpandir',
                view: new Ext.grid.GridView({
                    // forceFit: true,
                }),
                // tbar: new Ext.Toolbar(),
                autoScroll: true,
                columns: columns,
                store: store,
                tbar: this.crearBtns(),
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect: true
                }),
                loadMask: true,
            });

            this.items = [this.gridColumna];
        };

        this.crearBtns = function () {
            this.btnAdicionar = new Ext.Button({
                text: 'Adicionar',
                disabled: false,
                iconCls: 'adicionar',
                handler: this.onAdicionar
            });
            this.btnEliminar = new Ext.Button({
                text: 'Eliminar',
                disabled: true,
                iconCls: 'eliminar',
                handler: this.onEliminar
            });
            this.btnMod = new Ext.Button({
                text: 'Modificar',
                disabled: true,
                iconCls: 'modificar',
                handler: this.onModificar
            });
            this.btnUp = new Ext.Button({
                text: 'UP',
                disabled: true,
                iconCls: 'exportar',
                handler: this.onMovUp
            });
            this.btnDown = new Ext.Button({
                text: 'DOWN',
                disabled: true,
                iconCls: 'importar',
                handler: this.onMovDown
            });
            this.btnOrden = new Ext.Button({
                text: 'Actualizar Orden',
                disabled: false,
                iconCls: 'actualizar',
                handler: this.onActOrden
            });
            this.btnPasarAEntidad = new Ext.Button({
                text: 'Pasar a Entidades',
                disabled: true,
                iconCls: 'heredar',
                handler: this.onPasarAEntidad
            });
            return [this.btnAdicionar, this.btnMod, this.btnEliminar, this.btnPasarAEntidad, this.btnUp, this.btnDown, this.btnOrden];
        };

        this.onAdicionar = function () {

            var win = new Ext.Copa.Configuracion.AddColumnaCopa();
            win.show();
            var forstep = win.crearFormSteps();
            forstep.on({
                scope: _this,
                Crear: function (fnCrear, cerrarVentana, fnDesabilitarForm, fnDesabilitarGrid) {
                    // win.obtenerDatosForm();
                    var fn = function () {
                        fnCrear();
                        win.close();
                    };
                    _this.addModColumna(win, win.obtenerDatosForm('add'), fn);
                }
            });

        };
        this.onModificar = function () {

            var win = new Ext.Copa.Configuracion.AddColumnaCopa();
            win.loadDataMod(_this.gridColumna.getSelectionModel().getSelected());
            // win.show();
            var forstep = win.crearFormSteps();
            forstep.on({
                scope: _this,
                Crear: function (fnCrear, cerrarVentana, fnDesabilitarForm, fnDesabilitarGrid) {
                    // win.obtenerDatosForm();
                    var fn = function () {
                        fnCrear();
                        win.close();
                    };
                    _this.addModColumna(win, win.obtenerDatosForm('mod'), fn);
                }
            });

        };

        this.onEliminar = function () {
            this.loadMessageBox();

            Ext.Ajax.request({
                url: _this.url + 'eliminarColumna',
                method: 'POST',
                scope: _this,
                params: {
                    idcolumna: _this.gridColumna.getSelectionModel().getSelected().get('idcolumna')
                },
                callback: function(options, success, response)
                {
                    var responseData = Ext.decode(response.responseText);
                    this.hideMessageBox();
                    _this.gridColumna.getStore().load();
                    if (responseData.codMsg === 1) {
                        mostrarMensaje(1, 'La columna se elimino correctamente.');
                    }
                }
            });
        };

        this.onMovUp = function () {
            var st = _this.gridColumna.getStore();
            var sm = _this.gridColumna.getSelectionModel();
            var selectrecord = sm.getSelected();
            var index = st.indexOf(selectrecord);
            if (index > 0) {
                st.remove(selectrecord);
                st.insert(index - 1, selectrecord);
                sm.selectRow(index - 1);
            }/* else {
                st.insert(index, selectrecord);
                sm.selectRow(index - 1);
            }*/
        };

        this.onMovDown = function () {
            var st = _this.gridColumna.getStore();
            var sm = _this.gridColumna.getSelectionModel();
            var selectrecord = sm.getSelected();
            var index = st.indexOf(selectrecord);
            if (index < st.getCount() - 1) {
                st.remove(selectrecord);
                st.insert(index + 1, selectrecord);
                sm.selectRow(index + 1);
            }/* else {
                st.insert(index, selectrecord);
                sm.selectRow(index - 1);
            }*/
        };

        this.onActOrden = function () {
            _this.loadMessageBox();
            var arrColumnas = [];
            var records = _this.gridColumna.getStore().getRange();

            for (var i = 0; i < records.length; i++) {
                arrColumnas.push(records[i].get('idcolumna'));
            }

            Ext.Ajax.request({
                url: _this.url + 'actualizarOrden',
                method: 'POST',
                scope: _this,
                params: {
                    idcolumnas: Ext.encode(arrColumnas)
                },
                callback: function(options, success, response)
                {
                    var responseData = Ext.decode(response.responseText);
                    _this.hideMessageBox();
                    _this.gridColumna.getStore().load();
                    if (responseData.codMsg === 1) {
                        mostrarMensaje(1, 'El orden de las columnas se actualizo correctamente.');
                    }
                }
            });
        };

        this.onPasarAEntidad = function () {

            var cbxEntidad = new Ext.CONT.UIXCombo({
                emptyText: 'Seleccione...',
                allowBlank: false,
                fieldLabel: 'Entidad',
                // tabIndex: 1
            }, {
                identificador: 'Entidad',
                displayText: 'Entidad',
                url: _this.url + 'obtenerEntidadesParaBusqueda',
                autoLoad: true,
                singleSelect: false,
                reader: new Ext.data.JsonReader({
                    id: 'idestructurae',
                    root: 'datos'
                }, [{
                    name: '_parent',
                    mapping: 'idestructuraepadre'
                }, {
                    name: '_is_leaf',
                    mapping: 'leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idestructurae'
                }, {
                    name: 'id',
                    mapping: 'idestructuracomun'
                }, {
                    name: 'idestructuraepadre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }, {
                    name: 'ordenizq'
                }, {
                    name: 'ordender'
                }])
            });

            var form = new Ext.FormPanel({
                frame: true,
                layout: 'form',
                autoHeight: true,
                labelWidth: 50,
                labelAlign: 'top',
                trackResetOnLoad: true,
                items: [
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: 1,
                                layout: 'form',
                                items: [cbxEntidad]
                            },
                        ]
                    },
                ]
            });

            var btnCancelar = new Ext.Button({
                iconCls: 'cancelar',
                selectOnFocus: true,
                text: 'Cancelar',
            });

            var btnAceptar = new Ext.Button({
                iconCls: 'aceptar',
                text: 'Aceptar',
            });

            var win = new Ext.Window({
                autoValidate: false,
                modal: true,
                constrain: true,
                width: Ext.lib.Dom.getViewWidth() * 0.3,
                closeAction: 'destroy',
                frame: true,
                resizable: false,
                title: 'Add',
                items: [form],
                buttons: [btnCancelar, btnAceptar],
                listeners: {
                    scope: this,
                    show: function () {
                    },
                    close: function () {
                    }
                }
            });

            btnCancelar.setHandler(function () {
                win.close();
            });

            btnAceptar.setHandler(function () {
                _this.loadMessageBox();
                var records = Ext.getCmp('gpEntidad').getSelectionModel().getSelections();
                var arrIdEstructuras = [];
                var idcolumna = _this.gridColumna.getSelectionModel().getSelected().get('idcolumna');
                for (var i = 0; i < records.length; i++) {
                    arrIdEstructuras.push(records[i].get('id'));
                }
                console.log(arrIdEstructuras);
                Ext.Ajax.request({
                    url: _this.url + 'pasarColumnaAEntidadesHijas',
                    method: 'POST',
                    scope: _this,
                    params: {
                        arrIdEstructuras: Ext.encode(arrIdEstructuras),
                        idcolumna: idcolumna
                    },
                    callback: function(options, success, response)
                    {
                        var responseData = Ext.decode(response.responseText);
                        _this.hideMessageBox();
                        win.close();
                        _this.gridColumna.getStore().load();
                        if (responseData.codMsg === 1) {
                            mostrarMensaje(1, 'La operacion se completo correctamente.');
                        }
                    }
                });
            });

            win.show();

            // var formSteps = new CON.Util.FormSteps({
            //     arrForm: form,
            //     arrBtn: win.buttons
            // });
            //
            // formSteps.on({
            //     Crear: function (fnCrear, cerrarVentana, fnDesabilitarForm, fnDesabilitarGrid) {
            //         // _this.loadMessageBox();
            //         var records = Ext.getCmp('gpEntidad').getSelectionModel().getSelections();
            //         console.log(records);
            //         // Ext.Ajax.request({
            //         //     url: _this.url + 'pasarColumnaAEntidadesHijas',
            //         //     method: 'POST',
            //         //     scope: _this,
            //         //     params: {
            //         //         arrIdEstructuras: Ext.encode(),
            //         //     },
            //         //     callback: function(options, success, response)
            //         //     {
            //         //         var responseData = Ext.decode(response.responseText);
            //         //         _this.hideMessageBox();
            //         //         _this.gridColumna.getStore().load();
            //         //         if (responseData.codMsg === 1) {
            //         //             mostrarMensaje(1, 'La operacion se completo correctamente.');
            //         //         }
            //         //     }
            //         // });
            //     }
            // });

        };

        this.addModColumna = function (ventana, datos, fn) {
            this.loadMessageBox();
            Ext.Ajax.request({
                url: _this.url + 'addModColumna',
                method: 'POST',
                scope: _this,
                params: datos,
                callback: function(options, success, response)
                {
                    var responseData = Ext.decode(response.responseText);
                    this.hideMessageBox();
                    if (typeof fn === 'function') {
                        fn();
                    }
                    _this.gridColumna.getStore().load();
                    if (responseData.codMsg === 1) {
                        mostrarMensaje(1, 'La operacion se completo correctamente.');
                    }
                }
            });
        };

    },
    crearEventos: function () {
        this.on({
            scope: this,
            show: function () {
                this.gridColumna.getStore().load();
            }
        });

        this.gridColumna.getSelectionModel().on({
            scope: this,
            selectionchange: function (sel) {
                var records = sel.getSelections();
                if (records.length === 1) {
                    this.btnMod.enable();
                    this.btnUp.enable();
                    this.btnDown.enable();
                    if (records[0].get('default') == 0 || validate.checkByAbreviatura('power')) {
                        this.btnPasarAEntidad.enable();
                        this.btnEliminar.enable();
                    } else {
                        this.btnEliminar.disable();
                    }
                } else {
                    this.btnMod.disable();
                    this.btnEliminar.disable();
                    this.btnUp.disable();
                    this.btnDown.disable();
                    this.btnPasarAEntidad.disable();
                }
            }
        });
    }
});


Ext.Copa.Configuracion.AddColumnaCopa = Ext.extend(Ext.Window, {
    constructor: function (config) {
        Ext.apply(this, {
            autoValidate: false,
            modal: true,
            constrain: true,
            width: Ext.lib.Dom.getViewWidth() * 0.50,
            closeAction: 'destroy',
            frame: true,
            resizable: false,
            title: 'Add',
            // items: items,
            listeners: {
                scope: this,
                show: function () {
                },
                close: function () {
                }
            }
        });
        this.crearFunciones();
        this.crearBtns();
        this.crearForm();
        Ext.Copa.Configuracion.AddColumnaCopa.superclass.constructor.call(this);
    },
    crearFunciones: function (grid) {

        this.crearBtns = function () {
            this.btnCancelar = new Ext.Button({
                iconCls: 'cancelar',
                selectOnFocus: true,
                text: 'Cancelar',
                scope: this,
                handler: function () {
                    this.close();
                }
            });

            this.btnAceptar = new Ext.Button({
                iconCls: 'aceptar',
                text: 'Aceptar',
            });
            this.buttons = [this.btnCancelar, this.btnAceptar];
        };

        this.crearForm = function () {

            this.nfidcolumna = new Ext.form.NumberField({
                // fieldLabel: idioma.lbDisponible,
                name: 'idcolumna',
                allowBlank: true,
                // hidden: false,
                anchor: '100%',
            });

            this.nfAncho = new Ext.form.NumberField({
                fieldLabel: 'Ancho',
                name: 'width',
                allowBlank: false,
                allowDecimals: false,
                // hidden: false,
                anchor: '100%',
            });

            this.tfFuente = new Ext.form.TextField({
                fieldLabel: 'Fuente de los datos',
                name: 'dataIndex',
                allowBlank: false,
                anchor: '100%',
                // editable: false,
                // disabledClass: 'disabled-component',
                // selectOnFocus: true,
                maxLength: 16,
                // maskRe: /^([a-zA-Z0-9-_/ \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
                // maxLengthText: 'El tamaño m&aacute;ximo requerido es 16 caracteres.',
                enableKeyEvents: true
            });

            this.tfIdentificador = new Ext.form.TextField({
                fieldLabel: 'Identificador',
                name: 'identificador',
                allowBlank: true,
                anchor: '100%',
                // editable: false,
                // disabledClass: 'disabled-component',
                // selectOnFocus: true,
                maxLength: 16,
                // maskRe: /^([a-zA-Z0-9-_/ \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
                // maxLengthText: 'El tamaño m&aacute;ximo requerido es 16 caracteres.',
                enableKeyEvents: true
            });

            this.tfRender = new Ext.form.TextField({
                fieldLabel: 'Modificador',
                name: 'render',
                allowBlank: true,
                anchor: '100%',
                // editable: false,
                // disabledClass: 'disabled-component',
                // selectOnFocus: true,
                maxLength: 16,
                // maskRe: /^([a-zA-Z0-9-_/ \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
                // maxLengthText: 'El tamaño m&aacute;ximo requerido es 16 caracteres.',
                enableKeyEvents: true
            });

            this.tfHeader = new Ext.form.TextField({
                fieldLabel: 'Nombre de columna',
                name: 'header',
                allowBlank: false,
                anchor: '100%',
                // editable: false,
                // disabledClass: 'disabled-component',
                // selectOnFocus: true,
                maxLength: 16,
                // maskRe: /^([a-zA-Z0-9-_/ \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
                // maxLengthText: 'El tamaño m&aacute;ximo requerido es 16 caracteres.',
                enableKeyEvents: true
            });

            this.ckbOculto = new Ext.form.Checkbox({
                name: 'hidden',
                hideLabel: true,
                boxLabel: 'Oculto',
                disabled: false,
                inputValue: 1,
            });

            this.ckbOcultable = new Ext.form.Checkbox({
                name: 'hideable',
                hideLabel: true,
                boxLabel: 'Ocultable',
                disabled: false,
                checked: true,
                inputValue: 1,
            });

            this.ckbOrganizable = new Ext.form.Checkbox({
                name: 'sortable',
                hideLabel: true,
                boxLabel: 'Organizable',
                disabled: false,
                inputValue: 1,
            });

            this.ckbAutoexpandir = new Ext.form.Checkbox({
                name: 'autoexpandir',
                hideLabel: true,
                boxLabel: 'Autoexpandir',
                disabled: false,
                inputValue: 1,
            });

            this.ckbDefault = new Ext.form.Checkbox({
                name: 'default',
                hideLabel: true,
                boxLabel: 'Default',
                disabled: true,
                inputValue: 1,
            });

            this.ckbFiltrar = new Ext.form.Checkbox({
                name: 'filtrar',
                hideLabel: true,
                boxLabel: 'Filtrar',
                disabled: true,
                inputValue: 1,
            });

            var stType = new Ext.data.SimpleStore({
                fields: [
                    'id',
                    'type',
                ],
                data: [
                    ['string', 'String'],
                    ['numeric', 'Numeric'],
                    ['boolean', 'Boolean'],
                    ['date', 'Date'],
                    // ['list', 'List'],
                ]
            });

            this.cbType = new Ext.form.ComboBox({
                fieldLabel: 'Tipo de datos',
                // editable: true,
                forceSelection: true,
                store: stType,
                // disabled: true,
                valueField: 'id',
                displayField: 'type',
                hiddenName: 'type',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                selectOnFocus: true,
                anchor: '100%',
                allowBlank: false,
            });

            var stAlign = new Ext.data.SimpleStore({
                fields: [
                    'id',
                    'align',
                ],
                data: [
                    ['left', 'Izquierda'],
                    ['center', 'Centro'],
                    ['right', 'Derecha'],
                ]
            });

            this.cbAlign = new Ext.form.ComboBox({
                fieldLabel: 'Alineamiento',
                // editable: true,
                forceSelection: true,
                store: stAlign,
                // disabled: true,
                valueField: 'id',
                displayField: 'align',
                hiddenName: 'align',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                selectOnFocus: true,
                anchor: '100%',
                allowBlank: false,
            });

            this.form = new Ext.FormPanel({
                frame: true,
                layout: 'form',
                autoHeight: true,
                labelWidth: 50,
                labelAlign: 'top',
                trackResetOnLoad: true,
                items: [
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: 0,
                                layout: 'form',
                                hidden: true,
                                items: [this.nfidcolumna]
                            },
                            {
                                columnWidth: .25,
                                layout: 'form',
                                items: [this.cbType]
                            },
                            {
                                style: 'margin: 0 0 0 10',
                                columnWidth: .25,
                                layout: 'form',
                                items: [this.tfHeader]
                            },
                            {
                                style: 'margin: 0 0 0 10',
                                columnWidth: .25,
                                layout: 'form',
                                items: [this.nfAncho]
                            },
                            {
                                style: 'margin: 0 0 0 10',
                                columnWidth: .25,
                                layout: 'form',
                                items: [this.cbAlign]
                            },
                        ]
                    },
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: .25,
                                layout: 'form',
                                items: [this.tfFuente]
                            },
                            {
                                style: 'margin: 0 0 0 10',
                                columnWidth: .25,
                                layout: 'form',
                                items: [this.tfIdentificador]
                            },
                            {
                                style: 'margin: 0 0 0 10',
                                columnWidth: .25,
                                layout: 'form',
                                items: [this.tfRender]
                            },
                            {
                                style: 'margin: 0 0 0 10',
                                columnWidth: .25,
                                layout: 'form',
                                items: [this.ckbAutoexpandir]
                            },
                        ]
                    },
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: .20,
                                layout: 'form',
                                items: [this.ckbOculto]
                            },
                            {
                                style: 'margin: 0 0 0 10',
                                columnWidth: .20,
                                layout: 'form',
                                items: [this.ckbOcultable]
                            },
                            {
                                style: 'margin: 0 0 0 10',
                                columnWidth: .20,
                                layout: 'form',
                                items: [this.ckbOrganizable]
                            },
                            {
                                style: 'margin: 0 0 0 10',
                                columnWidth: .20,
                                layout: 'form',
                                items: [this.ckbDefault]
                            },
                            {
                                style: 'margin: 0 0 0 10',
                                columnWidth: .20,
                                layout: 'form',
                                items: [this.ckbFiltrar]
                            },
                        ]
                    },
                ]
            });

            this.items = this.form;
        };

        this.crearFormSteps = function () {
            this.formSteps = new CON.Util.FormSteps({
                arrForm: this.form,
                arrBtn: this.buttons
            });
            return this.formSteps;
        };

        this.obtenerDatosForm = function (oper = 'add') {
            var valores = this.form.getForm().getValues();
            valores.autoexpandir = valores.autoexpandir ? 1 : 0;
            valores.hidden = valores.hidden ? 1 : 0;
            valores.hideable = valores.hideable ? 1 : 0;
            valores.sortable = valores.sortable ? 1 : 0;
            valores.oper = oper;
            console.log(valores);
            return valores;
        };

        this.loadDataMod = function (record) {
            this.show();
            this.nfidcolumna.setValue(record.get('idcolumna'));
            this.cbType.setValue(record.get('type'));
            this.tfFuente.setValue(record.get('dataIndex'));
            this.tfIdentificador.setValue(record.get('identificador'));
            this.tfRender.setValue(record.get('render'));
            this.ckbDefault.setValue(record.get('default'));
            this.ckbFiltrar.setValue(record.get('filtrar'));

            this.tfHeader.setValue(record.get('header'));
            this.cbAlign.setValue(record.get('align'));
            this.nfAncho.setValue(record.get('width'));

            this.ckbOculto.setValue(record.get('hidden'));
            this.ckbOcultable.setValue(record.get('hideable'));
            this.ckbOrganizable.setValue(record.get('sortable'));
            this.ckbAutoexpandir.setValue(record.get('autoexpandir'));

            if (record.get('default') == 1 && !validate.checkByAbreviatura('power')) {
                this.nfidcolumna.disable();
                this.cbType.disable();
                this.tfFuente.disable();
                this.tfIdentificador.disable();
                this.tfRender.disable();
                this.ckbDefault.disable();
                this.ckbFiltrar.disable();
            } else {
                this.nfidcolumna.enable();
                this.cbType.enable();
                this.tfFuente.enable();
                this.tfIdentificador.enable();
                this.tfRender.enable();
                this.ckbDefault.enable();
                this.ckbFiltrar.enable();
            }
        };

    }
});