Ext.namespace('Ext.WinConfImportEnzona');
Ext.WinConfImportEnzona = Ext.extend(Ext.Window, {
    etiquetas: undefined,
    model: undefined,
    viewport: undefined,
    constructor: function(model, params)
    {
        this.crearSetsAndGets();
        // this.setEtiquetas(params.etiquetas);
        this.initializeView();
        Ext.WinConfImportEnzona.superclass.constructor.call(this);
    },
    initializeView: function () {
        this.initializeFunctions();
        var items = this.initializeItems();
        var titulo = 'Ventana';
        Ext.apply(this, {
            autoValidate: false,
            modal: true,
            constrain: true,
            width: Ext.lib.Dom.getViewWidth() * 0.50,
            closeAction: 'destroy',
            frame: true,
            height: 400,
            // layout: 'fit',
            // plugins: a,
            resizable: false,
            title: titulo,
            items: items,
            listeners: {
                scope: this,
                show: function () {
                },
                close: function () {
                }
            }
        });
    },
    initializeItems: function () {
        this.createButtons();
        return [this.crearForm/*, this.crearGrid()*/];
    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            // tooltip: scope.etiquetas.lbToolCancelar,
            text: 'Cancelar',
            iconCls: 'cancelar',
            scope: this,
            handler: function (btn) {
                this.close();
            }
        });

        this.btnAceptar = new Ext.Button({
            // tooltip: scope.etiquetas.lbToolAceptar,
            text: 'Aceptar',
            iconCls: 'Aceptar',
            // disabled: true
        });

        this.buttons = [this.btnCancelar, this.btnAceptar];
    },
    initializeFunctions: function () {

        this.crearGrid = function () {

            this.recordGrid = new Ext.data.Record.create([
                {name: 'id', mapping: 'id'},
                {name: 'idpersona', mapping: 'responsable'},
                {name: 'nombrecompleto', mapping: 'nombrecompleto'},
                {name: 'estado', mapping: 'estado'},
                {name: 'idcomprobante', mapping: 'idcomprobante'},
                {name: 'fechacontable', mapping: 'fechacontable'},
                {name: 'fechasistema', mapping: 'fechasistema'},
                {name: 'idoperacion', mapping: 'idoperacion'},
                {name: 'comentario', mapping: 'comentario'},
                {name: 'numcomprobante', mapping: 'numcomprobante'},
                {name: 'showCmp', mapping: 'showCmp'}
            ]);

            this.rdGrid = new Ext.data.JsonReader({
                    root: 'datos',
                    totalProperty: 'cantidad_filas'
                },
                this.recordGrid
            );

            var stGrid = new Ext.data.Store({
                url: '',
                reader: this.rdGrid,
                autoLoad: false
            });

            var selModel = new Ext.grid.RowSelectionModel();
            var columns = [
                {
                    header: 'Fecha',
                    dataIndex: 'fechasistema',
                    width: 50,
                    hidden: false,
                    align: 'left',
                },
                {
                    id: 'expandirddd',
                    header: 'Descripcion',
                    dataIndex: 'descripcion',
                    width: 100,
                    hidden: false,
                    align: 'left',
                },
                {
                    header: 'Origen',
                    dataIndex: 'origen',
                    width: 150,
                    hidden: false,
                    align: 'left',
                },
            ];
            this.grid = new Ext.grid.GridPanel({
                title: 'Supergrid',
                // region: 'center',
                frame: true,
                height: 400,
                autoExpandColumn: 'expandirddd',
                // view: new Ext.grid.GroupingView({
                //     // forceFit: true,
                //     groupTextTpl: "{[values.rs[0].data.clienteproveedor]}"
                // }),
                columns: columns,
                store: stGrid,
                sm: selModel,
                // plugins: this.filters,
                loadMask: true,
                // height: 500,
                // tbar: [],
                // bbar: new Ext.Cont.PagingToolbar({
                //     pageSize: 20,
                //     clearFilter: true,
                //     autoHeight: true,
                //     store: model.getStore(),
                //     // displayInfo: true,
                //     listeners: {
                //         'beforechange': function () {
                //             model.getStore().baseParams = me.baseParams;
                //         }
                //     }
                // })
            });
            return this.grid;
        };

        this.crearForm = function () {
            this.stmovimientooper = new Ext.data.Store({
                url: 'cargarmovimientos',
                reader: new Ext.data.JsonReader({
                    root: 'datos',
                    // totalProperty: 'cantidad',
                    id: 'idoperacion'
                }, [
                    {
                        name: 'idoperacion',
                        type: 'string'
                    },
                    {
                        name: 'denominacion'
                    },
                    {
                        name: 'idnomoperaciones',
                        type: 'string'
                    },
                    {
                        name: 'idcuenta',
                        type: 'string'
                    },
                    {
                        name: 'signo'
                    }
                ]),
                sortInfo: {
                    field: 'denominacion',
                    direction: 'ASC'
                },
                listeners: {
                    scope: this,
                    beforeload: function (s, options) {
                        this.stmovimientooper.clearFilter(true);
                        this.stmovimientooper.removeAll();
                    }
                }
            });

            this.cbmovimientooper = new Ext.form.ComboBox({
                fieldLabel: 'Operaci\xF3n', //perfil.etiquetas.lbcbMovimiento,
                disabledClass: 'disabled-component',
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>', // Paramostrar los datos como detalle
                //emptyText: 'Seleccione...',
                editable: true,
                resizable: true,
                store: this.stmovimientooper, // lo toma del store de liquidacion, solo cambia en el momento que se manda a cargar
                valueField: 'idoperacion',
                displayField: 'denominacion',
                hiddenName: 'idoperacion',
                forceSelection: true,
                anchor: '100%',
                triggerAction: 'all',
                enableKeyEvents: true,
                typeAhead: true,
                /*maskRe : /^([0-9a-zA-Z \(\)\-\+\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n?meros y espacios
                 regex : /^([0-9a-zA-Z \(\)\-\+\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
                 regexText : 'Este campo solo permite letras y n&uacute;meros.',*/
                allowBlank: false,
                blankText: 'Este campo es obligatorio.',
                listeners: {
                    scope: this,
                    select: function () {

                        var index = cbmovimientooper.store.find('idoperacion', cbmovimientooper.getValue());
                        var objsel = cbmovimientooper.store.getAt(index).data;
                        // buscarcuentaoperacion(cbmovimientooper.getValue(), 'oper', objsel);

                        var idmoneda = stmonedatasa.getAt(0).get('idmoneda');

                        var params = {
                            idoperacion: cbmovimientooper.getValue(),
                            tipoOperacion: cbtipoOpInstr.getValue(),
                            idmoneda: idmoneda,
                            signo: objsel.signo
                        };
                        cbcuentaacreditaroper.setBaseParams(params);

                        if (this.cbcuentaacreditaroper.tree.rendered) {
                            this.cbcuentaacreditaroper.load();
                        }
                    },
                    keypress: function (t, e) {
                        if ((e.getKey() == 46)/*|| (e.getKey() == 8) */)
                            this.cbmovimientooper.clearValue();
                    }
                }
            });

            this.stbeneficia = new Ext.data.Store({
                url: 'buscarbeneficiario',
                //autoLoad: true,
                baseParams: {
                    tipo: 3
                },
                reader: new Ext.data.JsonReader({
                        root: 'datos',
                        totalProperty: 'cantidad'
                    },
                    [{
                        name: 'id'
                    }, {
                        name: 'tipo'
                    }, {
                        name: 'denomtipo',
                        type: 'string'
                    }, {
                        name: 'nombre'
                    }
                    ])
            });

            // stbeneficia.on('beforeload', function () {
            //     stbeneficia.baseParams.tipo = cbxtipobeneficiario.getValue();
            //     stbeneficia.baseParams.tipoOperacion = cbtipoOpInstr.getValue();
            // });

            this.cbxbeneficia = new Ext.form.ComboBox({
                fieldLabel: 'Acreedor/Deudor',
                disabledClass: 'disabled-component',
                tpl: '<tpl for="."><div ext:qtip="{denomtipo}" class="x-combo-list-item">{nombre}</div></tpl>', // Paramostrar los datos como detalle
                resizable: true,
                mode: 'remote',
                allowBlank: false,
                hideTrigger: false,
                //disabled: true,
                editable: true,
                readOnly: false,
                selectOnFocus: true,
                store: this.stbeneficia,
                valueField: 'id',
                displayField: 'nombre',
                disabled: false,
                //hiddenName: 'id',
                forceSelection: true,
                minChars: 3, //Para la nueva busqueda poner contraria esta linea
                pageSize: 10, //Para la nueva busqueda poner contraria esta linea
                anchor: '99%',
                enableKeyEvents: true,
                triggerAction: 'all',
                //typeAhead: true,
                listeners: {
                    change: function (cbx, newValue, oldValue) {
                        // if (acc == 'mod')
                        //     cbxbeneficiario.setRawValue(stinstrumentobanc.data.items[idgridI].get('beneficiario'));
                    },
                    keypress: function (t, e) {
//                 if (soloLectura || acc == 'mod')
//                     e.stopEvent();
//                 /*else if ((e.getKey() == 8) || (e.getKey() == 46)) { // Limpiar el combo
//                     cbxbeneficiario.clearValue();
//                     //selectcasetipodoc(0);
//                     validatePrincipalForm();
//                 }*/ else if (e.getKey() == 13) { // Buscar con enter
//                     if (!cbxbeneficiario.getValue()) {
//                         // buscargenerico(stbeneficiario, cbxbeneficiario, 5);
//                         cbxbeneficiario.expand();
//                     } else {
// //                        cbrecibidopor.focus(false, 100);
//                         cbEspecialidad2.focus(false, 100);
//                     }
//                 }
                    },
                    beforeselect: function (combo, record, index) {
                    },
                    select: function () {
                    },
                    focus: function () {
                    },
                    render: function (component) {
                    }
                }
            });

            this.stcuentaacreditar = new Ext.data.Store({
                url: 'cargarcuentaxoperacion',
                reader: new Ext.data.JsonReader({
                    root: 'datos',
                    id: 'idcuenta'
                }, [{
                    name: 'idcuenta'
                },
                    {
                        name: 'text'
                    }, {
                        name: 'idmovimientocaja'
                    }, {
                        name: 'idanticipo'
                    }
                ])
            });

            this.cbcuentaacreditaroper = new Ext.contabilidad.util.linkedCombo({
                fieldLabel: 'Cuenta contrapartida',
                store: this.stcuentaacreditar,
                disabledClass: 'disabled-component',
                displayField: 'text',
                valueField: 'idcuenta',
                allowBlank: false,
                listHeight: 200,
                singleSelection: false,
                lazyRender: true,
                fnCreateNew: Ext.emptyFn,
                enableKeyEvents: true,
                anchor: '100%',
                disabled: true,
                hideTbar: true,
                listeners: {
                    load: function (response) {
                        var res = Ext.decode(response.responseText);
                        if (res.datos.length === 0) {
                            mostrarMensaje(1, 'El modelo contable asociado a la operaci&oacute;n no est&aacute; configurado correctamente.');
                        }
                    }
                }
            });


            this.formUI = new Ext.FormPanel({
                frame: true,
                layout: 'form',
                maskDisabled: false,
                autoHeight: true,
                labelWidth: 50,
                labelAlign: 'top',
                trackResetOnLoad: true,
                items: [{
                    labelAlign: 'top',
                    layout: 'column',
                    autoHeight: true,
                    items: [{
                        style: 'margin:0 0 0 5',
                        layout: 'form',
                        columnWidth: .5,
                        items: [this.cbmovimientooper]
                    },{
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .5,
                        // items: [this.cbcuentaacreditaroper]
                    }]
                }/*, {
                    labelAlign: 'top',
                    autoHeight: true,
                    layout: 'column',
                    items: [{
                        style: 'margin:0 0 0 5',
                        layout: 'form',
                        columnWidth: 1,
                        items: [this.cbxbeneficia]
                    }]
                }*/
                ]
            });
            return this.formUI;
        };

    },
    crearSetsAndGets: function () {
        this.setEtiquetas = function (etiquetas) {
            this.etiquetas = etiquetas;
        };

        this.getEtiquetas = function () {
            return this.etiquetas;
        };


    }
});