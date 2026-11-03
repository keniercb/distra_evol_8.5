Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.SeleccionarIndicador = Ext.extend(Ext.Window, {
    $extend: Ext.Panel,
    title: 'Seleccionar indicador',
    layout: 'border',
    width: '70%',
    height: 500,
    closeAction: 'destroy',
    initComponent: function() {
        var me = this;
        var bandera = true;
        me.fuente = '';
        me.idfuerzamotriz = (me.idfuerzamotriz) ? me.idfuerzamotriz : false;
        me.idelementopeir = (me.idelementopeir) ? me.idelementopeir : false;
        me.idproyecto = (me.idproyecto) ? me.idproyecto : false;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.FmpeirmatrizController();
        me.etiquetas = me.controller._getLabel('Fmpeir');
        me.directorioImagenes = me.controller._getGlobals('dirImg');


        me.btnAyuda = new comps.buttons.btnAyuda({
            tooltip: me.etiquetas.ttpAyuda,
            handler: function() {
                alert('Mostrar ayuda de la funcionalidad');
            }
        });
        me.btnAceptar = new comps.buttons.btnAceptar({
            disabled: true,
            tooltip: 'Aceptar seleccion del indcador',
            handler: function() {
                me.controller.adicionarmatrizlogica({
                    controller: me.controller,
                    idfuerzamotriz: me.idfuerzamotriz,
                    idelementopeir: me.idelementopeir,
                    idproyecto: me.idproyecto,
                    orden: me.orden,
                    record: me.record,
                    store: me.store,
                    idindicadorfmpeir: me.smIndicadorsel.getSelected().get('idindicadorfmpeir'),
                    idelementofuerzamotriz: me.smIndicadorsel.getSelected().get('idelementofuerzamotriz'),
                    valor: me.nfValor.getValue()
                });

                me.disparaEvento(me.smIndicadorsel.getSelected().get('denominacion'), me.nfValor.getValue());
                me.close();

            }
        });
        me.btnCancelar = new comps.buttons.btnCancelar({
            tooltip: 'Cancelar seleccion del indicador',
            handler: function() {
                me.destroy();
            }
        });

        me.btnBuscar = new Ext.Button({
            icon: perfil.dirImg + 'buscar.png',
            text: me.etiquetas.btnBuscar,
            tooltip: me.etiquetas.ttpBuscard,
            disabled: true,
            iconCls: 'btn',
            handler: function() {
                if (me.btnBuscar.disabled === false) {
                    me.stIndicadorsel.reload();
                    bandera = false;
                }
            }
        });
        me.btnLimpiar = new Ext.Button({
            icon: perfil.dirImg + 'limpiar.png',
            text: "<u>L</u>impiar",
            tooltip: "Limpiar filtros",
            disabled: true,
            iconCls: 'btn',
            handler: function() {
                if (me.btnLimpiar.disabled === false) {
                    me.tfDenominacion.reset();
                    me.tfFiltroFuente.reset();
                    me.fuente = '';
                    me.stIndicadorsel.reload();
                    bandera = true;
                    me.filtros();
                }

            }
        });

        me.nfValor = new Ext.form.TextField({
            name: 'nfValor',
            width: 200,
            allowBlank: true
        });
        
        me.nfValor.focus();

        me.tfIndicador = new Ext.form.TextField({
            fieldLabel: 'Indicador',
            name: 'tfIndicador',
            anchor: '98%',
            allowBlank: false,
            maxLength: 100
        });

        me.tfFuente = new Ext.form.TextField({
            name: 'tfFuente',
            anchor: '98%',
            readOnly: true,
            enableKeyEvents: true
        })


        me.tfDenominacion = new Ext.form.TextField({
            fieldLabel: 'Denominación del indicador',
            name: 'tfDenominacion',
            anchor: '98%',
            enableKeyEvents: true,
            listeners: {
                specialkey: function(tf, evt) {
                    if (evt.getKey() == 13) {
                        me.stIndicadorsel.reload();
                        bandera = false;
                    }
                },
                keyUp: function(tx, ev) {
                    me.filtros();
                }
            }
        });

        me.tfFiltroFuente = new Ext.form.TextField({
            name: 'tfFiltroFuente',
            anchor: '98%',
            readOnly: true,
            enableKeyEvents: true,
            listeners: {
                focus: function(tf) {
                    var winBuscarFuentes = new Ext.actores.comun.window.WinBuscarActorIncidencia({
                        title: 'Buscar fuentes',
                        constrain: true,
                        height: 520,
                        id: 'winBuscarFuentesFiltro',
                        verpersona: false
                    });
                    winBuscarFuentes.show();
                    winBuscarFuentes.on('actorseleccionado', function(th, objActor, obj) {
                        if (objActor.getName() === 'DatActor') {
                            me.denominacion = objActor.get('DatEstructura').get('rutaDenom');
                            ;
                        } else if (objActor.getName() === 'DatActorpersona') {
                            var name = objActor.get('DatActor').get('DatEstructura')
                                    .get('denominacion')
                                    + ': ' + objActor.get('DatPersona').get('pnombre') + ' ';
                            name += (objActor.get('DatPersona').get('snombre')) ? objActor
                                    .get('DatPersona').get('snombre')
                                    + ' ' : '';
                            name += (objActor.get('DatPersona').get('papellido')) ? objActor
                                    .get('DatPersona').get('papellido')
                                    + ' ' : '';
                            name += (objActor.get('DatPersona').get('sapellido')) ? objActor
                                    .get('DatPersona').get('sapellido') : '';
                            me.denominacion = name;


                        }
                        me.fuente = obj.idactor;
                        tf.setValue(me.denominacion);
                    });
                },
                specialkey: function(tf, evt) {
                    if (evt.getKey() == 13) {
                        me.stIndicadorsel.reload();
                    }
                },
                valid: function(tx) {
                    if (!tx) {
                        me.btnBuscar.disable();
                        me.btnLimpiar.disable();
                    }
                    else {
                        me.btnBuscar.enable();
                        me.btnLimpiar.enable();
                    }
                }
            }
        });

        me.smIndicadorsel = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                selectionchange: function(el) {
                    if (el.hasSelection()) {
                        if (me.smIndicadorsel.getSelected().get('idindicadorfmpeir') != '')
                        {
                            me.btnAceptar.enable();
                        } else
                            me.btnAceptar.disable();
                    }
                }
            }
        });

        me.cmIndicadoressel = new Ext.grid.ColumnModel([
            {hidden: true, dataIndex: 'idindicadorfmpeir'},
            {
                header: 'Denominación del indicador',
                dataIndex: 'denominacion',
                width: '50',
                editor: me.tfIndicador

            }, {
                header: 'Fuente',
                dataIndex: 'fuente',
                width: '50',
                editor: me.tfFuente

            }
        ]);

        me.recIndicadorsel = new Ext.data.Record.create([
            {name: 'idindicadorfmpeir'},
            {name: 'idfuente'},
            {name: 'idproyecto'},
            {name: 'denominacion'},
            {name: 'fuente'},
            {name: 'descripcionind'}
        ]);


        me.stIndicadorsel = new Ext.data.Store({
            url: Planificacion.Integracion.UrlModulo + 'fmpeirmatriz/obtenerindicadordeintegracion',
            reader: new Ext.data.JsonReader({
                root: 'data',
                id: 'idindicadorfmpeir',
                totalProperty: 'cantidad'
            }, me.recIndicadorsel),
            listeners: {
                beforeload: function(thisst, obj) {
                    thisst.baseParams = {
                        denominacion: me.tfDenominacion.getValue(),
                        fuente: me.fuente,
                        idfuerzamotriz: me.idfuerzamotriz,
                        idelementopeir: me.idelementopeir

                    };
                },
                load: function() {
                    if (!me.smIndicadorsel.hasSelection()) {
                        if (me.stIndicadorsel.getCount() == 0) {
                            if (((me.tfDenominacion.getValue != "" && me.tfDenominacion.getValue != undefined) || me.tfFiltroFuente.getValue() != "") && !bandera) {
                                mostrarMensaje(1, "No existen datos que se correspondan con los criterios de búsqueda especificados.", function() {
                                });
                            } else {
                                mostrarMensaje(1, 'No existen datos que mostrar.', function() {
                                });
                            }
                        }
                    }

                }
            }
        });
        me.stIndicadorsel.reload();


        // create the Grid
        var grid = new Ext.grid.GridPanel({
            store: me.stIndicadorsel,
            region: 'center',
            id: 'prueba',
            sm: me.smIndicadorsel,
            columns: [
                {hidden: true, dataIndex: 'idindicador'},
                {header: 'Denominación del indicador', dataIndex: 'denominacion', sortable: true, width: 350},
                {id: 'autoExpand', header: 'Fuente', dataIndex: 'fuente', sortable: true}

            ],
            autoExpandColumn: 'autoExpand',
            height: 350,
            width: 600,
            tbar: ['Valor :', me.nfValor],
            bbar: new Ext.PagingToolbar({
                displayInfo: true,
                store: me.stIndicadorsel,
                displayMsg: 'Mostrando de {0} - {1} de {2}',
                emptyMsg: "No hay resultados para mostrar."
            })
        });

        //-----------------------------------------------------------------------------------------------------------------------


        me.panel = new Ext.Panel({
            id: 'panelseleccion',
            layout: 'border',
            region: 'center',
            width: 400,
            height: 500,
            items: [grid],
            tbar: ['Denominación del indicador:', me.tfDenominacion, '', 'Fuente: ', me.tfFiltroFuente, '-', me.btnBuscar, me.btnLimpiar, '->', me.btnAyuda],

        });
        me.keys = [
            {
                key: 'x',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnCancelar.handler.call();
                }
            },
            {
                key: 'h',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnAyuda.handler.call();
                }
            },
            {
                key: Ext.EventObject.ENTER,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnAceptar.handler.call();
                }
            }
        ];
        me.items = [me.panel];
        me.bbar = ['->', me.btnCancelar, me.btnAceptar]

        Planificacion.Integracion.SeleccionarIndicador.superclass.initComponent.call(me);
    },
    filtros: function() {
        if (((this.tfDenominacion.getValue() != '') || (this.tfFiltroFuente.getRawValue() != '')) && (this.tfFiltroFuente.isValid() && this.tfDenominacion.isValid())) {
            this.btnBuscar.enable();
        } else {
            this.btnBuscar.disable();
        }
        if (((this.tfDenominacion.getValue() === '') && (this.tfFiltroFuente.getRawValue() === '') && !this.search)) {
            this.btnLimpiar.disable();
        } else {
            this.btnLimpiar.enable();
        }

    },
    disparaEvento: function(objIndicador, valor) {
        this.fireEvent('indicadorseleccionado', objIndicador, valor);
    }


});
Ext.reg('Planificacion.Integracion.SeleccionarIndicador', Planificacion.Integracion.SeleccionarIndicador);