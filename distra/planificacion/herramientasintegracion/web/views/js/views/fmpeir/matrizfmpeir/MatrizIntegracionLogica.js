Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.MatrizIntegracionLogica = ExtExtend.Class({
    $extend: Ext.Panel,
    region: 'center',
    frame: true,
    layout: 'border',
    autoHeigth: true,
    border: false,
    initComponent: function () {
        var me = this;
        me.idfuente = false;
        me.fuente = '';
        var elemen = [];
        var array = [];
        comps = ExtExtend.Components;
        me.validatorProyecto = new ExtExtend.FormValidator();
        me.denominacion = (me.denominacion) ? me.denominacion : false;
        me.idproyecto = (me.idproyecto) ? me.idproyecto : false;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.FmpeirmatrizController();
        me.etiquetas = me.controller._getLabel('Fmpeir');
        me.directorioImagenes = me.controller._getGlobals('dirImg');

        me.btnAyuda = new comps.buttons.btnAyuda({
            tooltip: me.etiquetas.ttpAyuda,
            handler: function () {
                me.controller.mostrarAyuda('integracion_logica');
            }
        });
        me.btnSeleccionarElemento = new Ext.Button({
            icon: perfil.dirImg + 'seleccion.png',
            text: 'Seleccionar elementos',
            tooltip: 'Seleccionar elementos del estudio',
            iconCls: 'btn',
            handler: function () {
                var SeleccionarElemento = new Planificacion.Integracion.SeleccionarElemento({
                    controller: me.controller,
                    idproyecto: me.idproyecto,
                    closable: true
                });

                SeleccionarElemento.show();
                SeleccionarElemento.on('elementoseleccionado', function (elementos) {
                    elemen = elementos;
                    var agua = new Ext.data.Record({
                        elemento: 'Agua',
                        presion: '',
                        valor: '',
                        estado: '',
                        valor1: '',
                        impacto: '',
                        valor2: '',
                        respuesta: '',
                        valor3: ''
                    });
                    var aire = new Ext.data.Record({
                        elemento: 'Aire',
                        presion: '',
                        valor: '',
                        estado: '',
                        valor1: '',
                        impacto: '',
                        valor2: '',
                        respuesta: '',
                        valor3: ''
                    });
                    var suelo = new Ext.data.Record({
                        elemento: 'Suelo',
                        presion: '',
                        valor: '',
                        estado: '',
                        valor1: '',
                        impacto: '',
                        valor2: '',
                        respuesta: '',
                        valor3: ''
                    });
                    var biodiversidad = new Ext.data.Record({
                        elemento: 'Biodiversidad Flora/Fauna',
                        presion: '',
                        valor: '',
                        estado: '',
                        valor1: '',
                        impacto: '',
                        valor2: '',
                        respuesta: '',
                        valor3: ''
                    });
                    var ambiente = new Ext.data.Record({
                        elemento: 'Ambiente construido',
                        presion: '',
                        valor: '',
                        estado: '',
                        valor1: '',
                        impacto: '',
                        valor2: '',
                        respuesta: '',
                        valor3: ''
                    });

                    if (elemen[1])
                        array.push(agua);
                    if (elemen[2])
                        array.push(aire);
                    if (elemen[3])
                        array.push(suelo);
                    if (elemen[4])
                        array.push(biodiversidad);
                    if (elemen[5])
                        array.push(ambiente);
                    me.stVariables.add(array);
                });
            }
        });

        me.btnExportar = new comps.buttons.btnExportar({
            tooltip: 'Exportar matriz de integración lógica',
            handler: function () {

                params = {
                    idproyecto: me.idproyecto,
                    denominacion: me.denominacion,
                    descripcion: me.taDescripcion.getValue() ? me.taDescripcion.getValue() : undefined
                }
                me.controller.obtenerReporte(params);

            }
        });
        me.btnGuardar = new comps.buttons.btnGuardar({
            tooltip: 'Guardar descripción de los resultados',
            handler: function () {
                me.controller.guardarDatos(me);
            }
        });

        me.tfDenoPresion = new Ext.form.TextField({
            name: 'tfDenoPresion',
            anchor: '80%',
            readOnly: true,
            listeners: {
                focus: function (tf) {

                    if (me.smVariables.getSelected().get('idelementopeir') == '') {
                        mostrarMensaje(1, 'Debe estar seleccionado el elemento antes.', function () {
                        });
                    } else {
                        var presion = (me.smVariables.getSelected().get('presion')) ? me.smVariables.getSelected().data : [];
                        me.Indicadorselect = new Planificacion.Integracion.SeleccionarIndicador({
                            closable: true,
                            autoShow: false,
                            extendCmp: me.extendCmp,
                            controller: me.controller,
                            idproyecto: me.idproyecto,
                            store: me.stVariables,
                            orden: me.stVariables.indexOf(me.smVariables.getSelected()),
                            idfuerzamotriz: 1,
                            idelementopeir: me.smVariables.getSelected().get('idelementopeir'),
                            record: (me.smVariables.getSelected().get('presion')) ? me.smVariables.getSelected().data : []
                        });
                        me.Indicadorselect.show();
                        me.Indicadorselect.on('indicadorseleccionado', function (objIndicador, valor) {
                            var record = me.smVariables.getSelected();
                            record.set('valor', valor);
                            record.set('presion', objIndicador);
                            record.commit();
                        })
                    }
                }
            }
        });

        me.tfDenoEstado = new Ext.form.TextField({
            name: 'tfDenoEstado',
            anchor: '80%',
            readOnly: true,
            listeners: {
                focus: function (tf) {
                    if (me.smVariables.getSelected().get('idelementopeir') == '') {
                        mostrarMensaje(1, 'Debe estar seleccionado el elemento antes.', function () {
                        });
                    } else {
                        me.Indicadorselect = new Planificacion.Integracion.SeleccionarIndicador({
                            closable: true,
                            autoShow: false,
                            extendCmp: me.extendCmp,
                            controller: me.controller,
                            idproyecto: me.idproyecto,
                            store: me.stVariables,
                            orden: me.stVariables.indexOf(me.smVariables.getSelected()),
                            idfuerzamotriz: 2,
                            idelementopeir: me.smVariables.getSelected().get('idelementopeir'),
                            record: (me.smVariables.getSelected().get('estado')) ? me.smVariables.getSelected().data : []

                        });
                        me.Indicadorselect.show();
                        me.Indicadorselect.on('indicadorseleccionado', function (objIndicador, valor) {

                            var record = me.smVariables.getSelected();
                            record.set('estado', objIndicador);
                            record.set('valor1', valor);
                            record.commit();

                        });
                    }
                }
            }
        });

        me.tfDenoImpacto = new Ext.form.TextField({
            name: 'tfDenoImpacto',
            anchor: '80%',
            readOnly: true,
            listeners: {
                focus: function (tf) {
                    if (me.smVariables.getSelected().get('idelementopeir') == '') {
                        mostrarMensaje(1, 'Debe estar seleccionado el elemento antes.', function () {
                        });
                    } else {
                        me.Indicadorselect = new Planificacion.Integracion.SeleccionarIndicador({
                            closable: true,
                            autoShow: false,
                            extendCmp: me.extendCmp,
                            controller: me.controller,
                            idfuerzamotriz: 3,
                            store: me.stVariables,
                            orden: me.stVariables.indexOf(me.smVariables.getSelected()),
                            idproyecto: me.idproyecto,
                            idelementopeir: me.smVariables.getSelected().get('idelementopeir'),
                            record: (me.smVariables.getSelected().get('impacto')) ? me.smVariables.getSelected().data : []

                        });
                        me.Indicadorselect.show();
                        me.Indicadorselect.on('indicadorseleccionado', function (objIndicador, valor) {
                            var record = me.smVariables.getSelected();
                            record.set('impacto', objIndicador);
                            record.set('valor2', valor);
                            record.commit();
                        });
                    }
                }
            }
        });

        me.tfDenoRespuesta = new Ext.form.TextField({
            name: 'tfDenoRespuesta',
            anchor: '80%',
            readOnly: true,
            listeners: {
                focus: function (tf) {
                    if (me.smVariables.getSelected().get('idelementopeir') == '') {
                        mostrarMensaje(1, 'Debe estar seleccionado el elemento antes.', function () {
                        });
                    } else {
                        me.Indicadorselect = new Planificacion.Integracion.SeleccionarIndicador({
                            closable: true,
                            autoShow: false,
                            extendCmp: me.extendCmp,
                            controller: me.controller,
                            idproyecto: me.idproyecto,
                            store: me.stVariables,
                            orden: me.stVariables.indexOf(me.smVariables.getSelected()),
                            idfuerzamotriz: 4,
                            idelementopeir: me.smVariables.getSelected().get('idelementopeir'),
                            record: (me.smVariables.getSelected().get('respuesta')) ? me.smVariables.getSelected().data : []

                        });
                        me.Indicadorselect.show();
                        me.Indicadorselect.focus();
                        me.Indicadorselect.on('indicadorseleccionado', function (objIndicador, valor) {
                            var record = me.smVariables.getSelected();
                            record.set('respuesta', objIndicador);
                            record.set('valor3', valor);
                            record.commit();
                        })
                    }
                }
            }
        });

        me.nfValorPresion = new Ext.form.TextField({
            name: 'nfValorPresion',
            anchor: '20%',
            readOnly: true
        });
        me.nfValorEstado = new Ext.form.TextField({
            name: 'nfValorEstado',
            anchor: '20%',
            readOnly: true
        });
        me.nfValorImpacto = new Ext.form.TextField({
            name: 'nfValorImpacto',
            anchor: '20%',
            readOnly: true
        });
        me.nfValorRespuesta = new Ext.form.TextField({
            name: 'nfValorRespuesta',
            anchor: '20%',
            readOnly: true
        });


//-----------------------------------------------------------------------------------------

        // record de grid de variables
        me.recordVariables = Ext.data.Record.create([


            {name: 'idelementopeir'},
            {name: 'elemento'},
            {name: 'presion'},
            {name: 'estado'},
            {name: 'impacto'},
            {name: 'respuesta'},
            {name: 'valor'},
            {name: 'valor1'},
            {name: 'valor2'},
            {name: 'valor3'}
        ]);
        me.stVariables = new Ext.data.Store({
            autoLoad: true,
            url: Planificacion.Integracion.UrlModulo + 'fmpeirmatriz/obtenerMatriz',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'cantidad_filas'
            }, me.recordVariables),
            listeners: {
                beforeload: function (thisst, obj) {
                    thisst.baseParams = {
                        idproyecto: me.idproyecto
                    };
                }
            }
        });
        me.smVariables = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        me.recIndicador = new Ext.data.Record.create([
            {name: 'idelementopeir'},
            {name: 'idestrategia'},
            {name: 'descripcionpresion'},
            {name: 'descripcionestado'},
            {name: 'descripcionimpacto'},
            {name: 'descripcionrespuesta'},
            {name: 'denominacion'},
            {name: 'fechaini'},
            {name: 'fechafin'}
        ]);
        me.stIndicador = new Ext.data.Store({
            url: Planificacion.Integracion.UrlModulo + 'fmpeir/getNomenclador',
            reader: new Ext.data.JsonReader({
                root: 'root',
                totalProperty: 'cantidad_filas'
            }, me.recIndicador),
            listeners: {
                beforeload: function (thisst, obj) {
                    thisst.baseParams = {};
                },
                load: function () {
                    if (!me.smVariables.hasSelection()) {
                        if (me.stIndicador.getCount() == 0) {
                            mostrarMensaje(1, 'No existen datos que mostrar.', function () {
                            });

                        }
                    }
                }
            }
        });
        me.stIndicador.load();
        me.cbElemento = new comps.fields.simpleComboBox({
            store: me.stIndicador,
            triggerAction: 'all',
            editable: false,
            //emptyText: me.etiquetas.emptyText,
            displayField: 'denominacion',
            valueField: 'denominacion',
            extendField: 'descripcion',
            allowBlank: false,
            enableQtip: true,
            disableBanned: true,
            mode: 'local',
            listeners: {
                select: function (cb, rec, ind) {
                    var record = me.smVariables.getSelected();
                    record.set('idelementopeir', rec.data.idelementopeir)
                }.createDelegate(this)
            }
        });

        me.cmVariables = new Ext.grid.ColumnModel([
            {dataIndex: 'idelementofuerzamotriz', hidden: true, hideable: false},
            {dataIndex: 'idelementopeir', hidden: true, hideable: false},

            {
                header: 'Elemento',
                width: 100,
                dataIndex: 'elemento',
                editor: me.cbElemento,
                id: 'Elemento' + me.id,
                sortable: false
            },
            {header: 'Estado', width: 225, dataIndex: 'estado', editor: me.tfDenoEstado, sortable: false},
            {
                header: 'Valor',
                width: 50,
                dataIndex: 'valor1',
                editor: me.nfValorEstado,
                sortable: false,
                editable: false
            },
            {header: 'Presión', width: 225, dataIndex: 'presion', editor: me.tfDenoPresion, sortable: false},
            {
                header: 'Valor',
                width: 50,
                dataIndex: 'valor',
                editor: me.nfValorPresion,
                sortable: false,
                editable: false
            },
            {header: 'Impacto', width: 225, dataIndex: 'impacto', editor: me.tfDenoImpacto, sortable: false},
            {
                header: 'Valor',
                width: 50,
                dataIndex: 'valor2',
                editor: me.nfValorEstado,
                sortable: false,
                editable: false
            },

            {header: 'Respuesta', width: 225, dataIndex: 'respuesta', editor: me.tfDenoRespuesta, sortable: false},
            {
                header: 'Valor',
                width: 50,
                dataIndex: 'valor3',
                editor: me.nfValorRespuesta,
                sortable: false,
                editable: false
            }
        ]);
        me.cmVariables.defaultSortable = true;

        /**
         * GRID PANEL
         * @type {Ext.grid.GridPanel}
         */
        me.gpVariables = new comps.containers.grids.rowEditorGrid({
            store: me.stVariables,
            id: "gridfmpeir",
            region: 'center',
            showAddDelButtons: true,
            addButtonTTip: 'elemento',
            delButtonTTip: 'elemento',
            cm: me.cmVariables,
            plugins: [new comps.plugins.grid.changesValidator],
            sm: me.smVariables,
            stripeRows: true,
            clicksToEdit: 2,
            editable: true,
            border: false,
            cls: 'MseceezsRowWrap',
            loadMask: new Ext.LoadMask(Ext.getBody(),
                {msg: 'Cargando...'}),
            autoExpandColumn: 'Elemento' + me.id,
            iconCls: 'icon-grid',
            overCls: 'x-grid3-row-over',
            ctCls: 'x-grid3-row-selected',
            anchor: '100%',
            width: '100%',
            defaults: {autoScroll: true}
        });
        me.gpVariables.on('delete', function () {
            me.controller.adicionarmatrizlogica({
                idproyecto: me.idproyecto,
                store: me.stVariables,
                orden: me.stVariables.indexOf(me.smVariables.getSelected()),
                idelementopeir: me.smVariables.getSelected().get('idelementopeir'),
                delete: true
            });

        });

        me.taDescripcion = new comps.fields.fieldDescripcion({
            fieldLabel: 'Descripción ',
            anchor: '100%',
            maxLength: 5000,
            listeners: {
                valid: function (tf) {
                    //if (me.ventana == 'opcestrategica') {
                    //    me.objopcionestrategica.set('descripcionviabilidad', tf.getValue());
                    //}
                    //if (me.ventana == 'politica') {
                    //    me.politica.set('descripcionviabilidad', tf.getValue());
                    //}

                },
                invalid: function (tf) {
                    //if (me.ventana == 'opcestrategica') {
                    //    me.objopcionestrategica.set('descripcionviabilidad', null);
                    //}
                    //if (me.ventana == 'politica') {
                    //    me.politica.set('descripcionviabilidad', null);
                    //}


                }
            }
        });

        me.pnsurViabilidad = new Ext.Panel({
            frame: true,
            height: 150,
            region: 'south',
            bbar: ['->', me.btnGuardar],
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            layout: 'form',
                            labelAlign: 'top',
                            columnWidth: 1,
                            items: [me.taDescripcion]
                        }

                    ]
                }
            ]
        });

//-----------------------------------------------------------------------------------           

        me.tbar = ['->', me.btnExportar, me.btnAyuda];
        me.items = [me.gpVariables, me.pnsurViabilidad];

        me.keys = [
            {
                key: 'h',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function () {
                    me.btnAyuda.handler.call();
                }
            },
            {
                key: 'e',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function () {
                    me.btnExportar.handler.call();
                }
            }
        ];
        me.on('render', function (p) {
            Secodena.mostrarMascara('indicador1', '', 'Cargando datos');
            Ext.Ajax.request({
                url: Planificacion.Integracion.UrlModulo + 'fmpeirmatriz/obtenerDatosEstudios',
                params: {
                    idproyecto: me.idproyecto
                },
                success: function (resp, obj) {
                    var responseData = Ext.decode(resp.responseText);
                    me.taDescripcion.setValue((responseData.descripcion) ? responseData.descripcion : null);
                    me.initValidatorIndicadores();
                    Secodena.ocultarMascara('indicador1');

                },
                failure: function (resp, obj) {
                    Secodena.ocultarMascara('indicaciones');

                }
            })
            ;
        });

        Planificacion.Integracion.MatrizIntegracionLogica.superclass.initComponent.call(me);
    },
    initValidatorIndicadores: function () {
        var me = this;
        var fields = [me.taDescripcion];
        var botones = [me.btnGuardar];
        me.initValidator(me.validatorProyecto, fields, botones);
    },
    initValidator: function (validator, fields, buttons) {
        var res = [];
        ExtExtend.Utils.each(fields, function (i, v) {
            res.push(v);
        });
        validator = new ExtExtend.FormValidator({
            buttons: buttons,
            fields: res
        });
    }
});
Ext.reg('Planificacion.Integracion.MatrizIntegracionLogica', Planificacion.Integracion.MatrizIntegracionLogica);


