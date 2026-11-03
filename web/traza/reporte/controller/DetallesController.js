Ext.define('Traces.controller.Detalles', {
    extend: 'Ext.app.Controller',

    models: [
        'TipoTrazaModel', 'SubsistemaModel', 'IpModel', 'UsuarioModel', 'TreeModel', 'DetallesModel'
    ],
    stores: [
        'TipoTrazaStore', 'SubsistemaStore', 'IpStore', 'UsuarioStore'
    ],
    refs: [{
        ref: 'panelDetalles',
        selector: 'panelDetalles'
    }],

    init: function () {
        var _this = this;

        _this.control({

            'panelDetalles': {
                render: function () {
                    _this.keyMap = new Ext.util.KeyMap(Ext.get('panelDetalles'), [
                        {
                            key: "b",
                            alt: true,
                            fn: function (e, a) {
                                a.browserEvent.preventDefault();
                                if (!Ext.getCmp('btnBuscar').disabled) {
                                    _this.buscarConFiltro();
                                }
                            }
                        },
                        {
                            key: "l",
                            alt: true,
                            fn: function (e, a) {
                                a.browserEvent.preventDefault();
                                if (!Ext.getCmp('btnLimpiar').disabled) {
                                    _this.limpiarFiltro();
                                }
                            }
                        },
                        {
                            key: "e",
                            alt: true,
                            fn: function (e, a) {
                                a.browserEvent.preventDefault();
                                if (!Ext.getCmp('btnExportar').disabled) {
                                    var arreglo = [];
                                    arreglo.push(Ext.getCmp('grid').getSelectionModel().getSelection()[0].data.tipotraza);
                                    arreglo.push(Ext.getCmp('grid').getSelectionModel().getSelection()[0].data.identidad);
                                    window.open('exportarxml?datos=' + Ext.JSON.encode(arreglo));
                                }
                            }
                        }
                    ]);
                }
            },

            'panelDetalles #filtroSearch': {
                afterrender: _this.listenChange
            },

            'panelDetalles button[action=buscar]': {
                click: _this.buscarConFiltro
            },

            'panelDetalles button[action=limpiar]': {
                click: _this.limpiarFiltro
            },

            'panelDetalles #grid': {
                cellclick: function (el, td, cellIndex, record) {
                    if (record.data.tipo == 'trace')
                        Ext.getCmp('btnExportar').enable();
                    else
                        Ext.getCmp('btnExportar').disable()
                },
                celldblclick: function (el, td, cellIndex, record) {
                    _this.renderVentana(record);
                }
            }
        });

    },

    listenChange: function (_t) {
        Ext.Array.forEach(_t.items.items, function (item) {
            if (item.id != 'btnBuscar' && item.id != 'btnLimpiar') {
                item.addListener('change', function (t) {
                    Ext.getCmp('btnBuscar').enable();
                    Ext.getCmp('btnLimpiar').enable();
                }, this);
            }
        }, this);
    },

    limpiarCargarNodos: function () {
        var delNode;
        var grid = Ext.getCmp('grid');

        while (delNode = grid.getRootNode().childNodes[0])
            grid.getRootNode().removeChild(delNode);

        grid.getStore().load();
    },

    buscarConFiltro: function () {

        function compararFechas(fechadesde, fechahasta) {
            return (new Date(fechadesde)) <= (new Date(fechahasta));
        }

        function obtenerParametros() {
            return {
                fechainicio: Ext.getCmp('iddesde').value || null,
                fechafin: Ext.getCmp('idhasta').value || null,
                idcategoriatraza: Ext.getCmp('combosubsistema').value || null,
                usuario: Ext.getCmp('combousuario').value || [],
                ippc: Ext.getCmp('comboip').value || null,
                idtipotraza: Ext.getCmp('combotipo').value || []
            };
        }

        if (!compararFechas(Ext.getCmp('iddesde').getValue(), Ext.getCmp('idhasta').getValue())) {
            mostrarMensaje(1, perfil.etiquetas.texts.warningFecha + Ext.getCmp('iddesde').value);
            return;
        }
        var params = obtenerParametros();
        if (params.fechainicio == '' && params.fechafin == '' && params.usuario.length == 0 && params.idcategoriatraza == '' && params.ippc == '' && params.idtipotraza.length == 0) {
            mostrarMensaje(6, perfil.etiquetas.texts.warningFiltroVacio);
            return;
        }

        Ext.getCmp('btnExportar').disable();
        this.limpiarCargarNodos();
        Ext.getCmp('btnBuscar').disable();
    },

    limpiarFiltro: function () {
        Ext.getCmp('iddesde').setValue(new Date());
        Ext.getCmp('idhasta').setValue(new Date());
        Ext.getCmp('combousuario').setValue([]);
        Ext.getCmp('combotipo').setValue([]);
        Ext.getCmp('combosubsistema').setValue(null);
        Ext.getCmp('comboip').setValue(null);
        Ext.getCmp('btnExportar').disable();
        this.limpiarCargarNodos();
        Ext.getCmp('btnLimpiar').disable();
        Ext.getCmp('btnBuscar').disable();
    },

    renderVentana: function (record) {
        if (record.data.tipo != 'trace')
            return false;

        var ventana = Ext.getCmp('detallesWindow');

        switch (record.data.tipotraza) {
            case 'Acción':
                ventana.setTitle(perfil.etiquetas.titles.ventanaTrazaAccion);
                ventana.form = formDetallesTrazaAccion();
                ventana.add(ventana.form);
                break;
            case 'Excepción':
                ventana.setTitle(perfil.etiquetas.titles.ventanaTrazaExcepcion);
                ventana.form = formDetallesTrazaExcepcion();
                ventana.add(ventana.form);
                break;
            case 'Dato':
                ventana.setTitle(perfil.etiquetas.titles.ventanaTrazaDatos);
                ventana.form = formDetallesTrazaDatos();
                ventana.add(ventana.form);
                break;
            case 'Integración':
                ventana.setTitle(perfil.etiquetas.titles.ventanaTrazaIntegracion);
                ventana.form = formDetallesTrazaIntegracion();
                ventana.add(ventana.form);
                break;
            case 'Bloqueo':
                ventana.setTitle(perfil.etiquetas.titles.ventanaTrazaBloqueo);
                ventana.form = formDetallesTrazaBloqueo();
                ventana.add(ventana.form);
                break;
        }
        if (ventana.form == null) {
            return;
        }
        ventana.show();
        ventana.getEl().mask(perfil.etiquetas.texts.loadingText, 'x-loading');
        Ext.Ajax.request({
            url: 'mostrarDetalles',
            params: {
                tipotraza: record.data.tipotraza,
                identidad: record.data.identidad
            },

            callback: function (options, success, response) {

                ventana.getEl().unmask();
                var res = Ext.JSON.decode(response.responseText);
                var rds = Ext.create('Traces.model.DetallesModel', res[0]);
                ventana.form.getForm().loadRecord(rds);

                if (ventana.form.tipo == 'detallesTrazaDatos') {
                    var dataGrid = [];
                    var datos = rds.data.dato;
                    for (var i in datos) {
                        if (datos.hasOwnProperty(i)) {
                            dataGrid.push({atributo: i, valor: datos[i]});
                        }
                    }
                    dataGrid.forEach(function (data) {
                        Ext.getCmp('gridDatos').getStore().add(Ext.create('Traces.model.DetallesModel', data));
                    });
                }
            }
        });
    }
});

