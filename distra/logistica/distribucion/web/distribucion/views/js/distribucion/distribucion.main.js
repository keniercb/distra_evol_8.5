UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var vistaAutorizacionEntrega = new LOG.dist.distribucion.View({
        acciones: acciones_reportes,
        busquedaBasica: true,
        busquedaAvanzada: true,
        idioma: LOG.util.UIManager.apply(LOG.dist.distribucion.Idioma, LOG.util.Idioma)
    });
    if(typeof esminfar !== 'undefined' && esminfar){
        vistaAutorizacionEntrega.attachPlugin(new LOG.lb.documento.PluginFirmaDocumentos({
            columnas : 3,
            firmas: [
                'creadopor',
                'recibido',
                'autorizadopor',
            ]
        }));
    }else{
        vistaAutorizacionEntrega.attachPlugin(new LOG.lb.documento.PluginFirmaDocumentos({
            columnas : 2,
            firmas: [
                'entregadopor',
                'recibido',
            ]
        }));
    }
    vistaAutorizacionEntrega.init();
    vistaAutorizacionEntrega.getPanelBusqueda().setColumns(1);

    var fpDatosBusqueda = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    var stTipoDocumento = new Ext.data.SimpleStore({
        fields: ['tipodistribucion', 'descripcion'],
        data: [
            [1, LOG.lb.documento.TipoDistribucion[1]],
            [2, LOG.lb.documento.TipoDistribucion[2]],
            [3, LOG.lb.documento.TipoDistribucion[3]],
            [4, LOG.lb.documento.TipoDistribucion[4]]
        ]
    });

    Ext.Ajax.request({
        url: 'getDistribucionPedido',
        callback: function (opt, scs, resp) {
            var respMsg = Ext.decode(resp.responseText);
            if (respMsg.datos[0]) {
                if (respMsg.datos[0].reserva == 0) {
                    stTipoDocumento.remove(stTipoDocumento.data.items[3]);
                }
                if (respMsg.datos[0].tipodistribucion == "2" || respMsg.datos[0].tipodistribucion == "0") {
                    stTipoDocumento.remove(stTipoDocumento.data.items[1]);
                }
                if (respMsg.datos[0].tipodistribucion == "1" || respMsg.datos[0].tipodistribucion == "0") {
                    stTipoDocumento.remove(stTipoDocumento.data.items[0]);
                }
            }
        }
    });

    fpDatosBusqueda.addComponent(new LOG.util.ComboBox({
        fieldLabel: vistaAutorizacionEntrega.idioma.lbTipoDocumento,
        hiddenName: 'tipodistribucion',
        store: stTipoDocumento,
        valueField: 'tipodistribucion',
        displayField: 'descripcion',
        editable: false
    }));

    fpDatosBusqueda.addComponent(new LOG.util.ComboBox({
        fieldLabel: vistaAutorizacionEntrega.idioma.lbEstado,
        hiddenName: 'estado',
        store: new Ext.data.SimpleStore({
            fields: ['idestado', 'estado'],
            data: [
                [1, LOG.lb.documento.Estado[1]],
                [2, LOG.lb.documento.Estado[2]],
                [3, LOG.lb.documento.Estado[3]],
                [5, LOG.lb.documento.Estado[5]],
                [7, LOG.lb.documento.Estado[7]],
                [10, LOG.lb.documento.Estado[10]]
            ]
        }),
        valueField: 'idestado',
        displayField: 'estado',
        editable: false
    }));

    fpDatosBusqueda.addComponent(new LOG.lb.documento.ComboUsuarios({
        fieldLabel: vistaAutorizacionEntrega.idioma.lbCreadoPor,
        hiddenName: 'idusuario',
        alias: 'entregaLog',
        subsistema: 10
    }));

    fpDatosBusqueda.addComponent(new LOG.lb.documento.ComboUsuarios({
        fieldLabel: vistaAutorizacionEntrega.idioma.lbAprobadoPor,
        hiddenName: 'aprobadopor',
        alias: 'entregaLog',
        subsistema: 10
    }));

    fpDatosBusqueda.addComponent(new LOG.util.ComboBox({
        fieldLabel: vistaAutorizacionEntrega.idioma.cmbEstadoDeEjecucion,
        hiddenName: 'estadoejecucion',
        store: new Ext.data.SimpleStore({
            fields: ['estadoejecucion', 'descripcion'],
            data: [
                [1, vistaAutorizacionEntrega.idioma.lbNoProcesado],
                [2, vistaAutorizacionEntrega.idioma.lbEnProceso],
                [3, vistaAutorizacionEntrega.idioma.lbCumplimentado]
            ]
        }),
        valueField: 'estadoejecucion',
        displayField: 'descripcion',
        editable: false
    }));

    var stDepositos = new Ext.data.Store({
        url: 'cargarEstructuras',
        reader: new Ext.data.JsonReader({
            id: "iddeposito",
            root: "datos"
        }, [
            {name: 'iddeposito'},
            {name: 'nombre'}
        ])
    });

    stDepositos.load({
        params: {
            depositosprod: true
        }
    });

    fpDatosBusqueda.addComponent(new LOG.util.ComboBox({
        fieldLabel: vistaAutorizacionEntrega.idioma.cmbDeposito,
        store: stDepositos,
        hiddenName: 'iddeposito',
        valueField: 'iddeposito',
        displayField: 'nombre',
        editable: false
    }));

    var stClientes = new Ext.data.Store({
        url: 'cargarClientes',
        reader: new Ext.data.JsonReader({
            id: "idclientesproveedores",
            root: "datos"
        }, [
            {name: 'idclientesproveedores'},
            {name: 'nombre'}
        ])
    });


    var cmbEntragarACliente = new LOG.util.ComboBox({
        fieldLabel: vistaAutorizacionEntrega.idioma.lbEntregarA,
        disabled: true,
        store: stClientes,
        valueField: 'idclientesproveedores',
        displayField: 'nombre',
        editable: true,
        pageSize: 30,
        mode: 'remote',
        listeners: {
            'select': function () {
                Ext.getCmp('idhdclienteavan').setValue(this.getValue());
            }
        }
    });

    var stCentrosCosto = new Ext.data.Store({
        url: 'cargarCentrosCosto',
        reader: new Ext.data.JsonReader({
            id: "idcentrogrupo",
            root: "datos"
        }, [
            {name: 'idcentrogrupo'},
            {name: 'descripcioncentrogrupo'}
        ])
    });
    var cmbEntragarACentroCosto = new LOG.util.ComboBox({
        fieldLabel: vistaAutorizacionEntrega.idioma.lbEntregarA,
        store: stCentrosCosto,
        valueField: 'idcentrogrupo',
        displayField: 'descripcioncentrogrupo',        
        editable: true,
        pageSize: 30,
        mode: 'remote',
        listeners: {
            'select': function () {
                Ext.getCmp('idhdclienteavan').setValue(this.getValue());
            }
        }
    });

    var stDeposito = new Ext.data.Store({
        url: 'cargarEstructuras',
        reader: new Ext.data.JsonReader({
            id: "idestructuraop",
            root: "datos"
        }, [
            {name: 'idestructuraop'},
            {name: 'nombre'}
        ])
    });
    var cmbEntragarADeposito = new LOG.util.ComboBox({
        fieldLabel: vistaAutorizacionEntrega.idioma.lbEntregarA,
        store: stDeposito,
        valueField: 'idestructuraop',
        displayField: 'nombre',
        editable: true,
        pageSize: 30,
        mode: 'remote',
        listeners: {
            'select': function () {
                Ext.getCmp('idhdclienteavan').setValue(this.getValue());
            }
        }
    });

    fpDatosBusqueda.addComponent(new LOG.util.ComboBox({
        fieldLabel: vistaAutorizacionEntrega.idioma.cmbDestino,
        hiddenName: 'tipocliente',
        store: new Ext.data.SimpleStore({
            fields: ['tipocliente', 'descripcion'],
            data: [
                [1, vistaAutorizacionEntrega.idioma.lbCliente],
                [2, vistaAutorizacionEntrega.idioma.lbCentroDeCosto],
                [3, vistaAutorizacionEntrega.idioma.lbDeposito]
            ]
        }),
        valueField: 'tipocliente',
        displayField: 'descripcion',
        editable: false,
        listeners: {
            'select': function (combo, record, index) {
                if (record.data.tipocliente == 1) {
                    cmbEntragarACliente.reset();
                    cmbEntragarACliente.enable();
                    stClientes.load();
                    panelEntregar.getLayout().setActiveItem(0);
                }
                if (record.data.tipocliente == 2) {
                    cmbEntragarACentroCosto.reset();
                    cmbEntragarACentroCosto.enable();
                    stCentrosCosto.load();
                    panelEntregar.getLayout().setActiveItem(1);
                }
                if (record.data.tipocliente == 3){
                    cmbEntragarADeposito.reset();
                    cmbEntragarADeposito.enable();
                    stDeposito.load();
                    panelEntregar.getLayout().setActiveItem(2);
                }
            }
        }
    }));

    var panelEntregar = LOG.util.UIManager.initPanel({
        activeItem: cmbEntragarACliente,
        labelAling: true,
        layout: 'card',
        items: [cmbEntragarACliente, cmbEntragarACentroCosto, cmbEntragarADeposito]
    });

    var panel = LOG.util.UIManager.initPanel({
        items: [{html: '<p style="font-size:12px; padding: 0px 0px 4px 0px;">' + 'Entregar a' + ": </p>"},panelEntregar]
    });

    fpDatosBusqueda.addComponent(panel);

    var fpFechas = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    var fpFechaRango = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    fpFechaRango.addComponent(new Ext.form.DateField({
        fieldLabel: vistaAutorizacionEntrega.idioma.lbDesde,
        name: 'desde',
        xtype: 'datefield',
        vtype: 'daterange',
        id: 'desde',
        endDateField: 'hasta',
        editable: false
    }));

    fpFechaRango.addComponent(new Ext.form.DateField({
        fieldLabel: vistaAutorizacionEntrega.idioma.lbHasta,
        name: 'hasta',
        xtype: 'datefield',
        vtype: 'daterange',
        id: 'hasta',
        startDateField: 'desde',
        editable: false
    }));

    fpDatosBusqueda.addComponent({
        xtype: 'hidden',
        name: 'idcliente',
        id: 'idhdclienteavan'
    });

    fpFechas.addComponent(new Ext.form.FieldSet({
        title: vistaAutorizacionEntrega.idioma.tlRangofecha,
        items: [fpFechaRango]
    }));

    var cmbCriterio = new LOG.util.ComboBox({
        fieldLabel: 'Criterio',
        hiddenName: 'idcriterio',
        store: new Ext.data.SimpleStore({
            fields: ['idcriterio', 'criterio'],
            data: [
                [1, 'Ordenado > Entregado'],
                [2, 'Ordenado < Entregado'],
                [3, 'Ordenado = Entregado']
            ]
        }),
        anchor: '98%',
        valueField: 'idcriterio',
        displayField: 'criterio',
        editable: false,
        listeners: {
            'select': function (combo, record, index) {
                if (record.data.idcriterio) {
                    cmbDenomProducto.enable();
                } else {
                    cmbDenomProducto.disable();
                }
            }
        }
    });

    var cmbDenomProducto = new Ext.form.TriggerField({
        fieldLabel: vistaAutorizacionEntrega.idioma.cmbProducto,
        disabled: true,
        emptyText: vistaAutorizacionEntrega.idioma.lbSeleccione,
        triggerClass: 'x-form-cliente-trigger',
        tabular: true,
        name: 'producto',
        anchor: '98%',
        editable: false
    });

    cmbDenomProducto.onTriggerClick = function (e) {
        //var _scope = vistaAutorizacionEntrega.winGestionarDocumento.scope;
        Ext.MessageBox.wait(vistaAutorizacionEntrega.idioma.msgLoadProductos, vistaAutorizacionEntrega.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: 'getSubordinacionEntidad',
            callback: function (o, s, resp) {
                Ext.MessageBox.hide();
                var respMsg = Ext.decode(resp.responseText);
                if (respMsg.datos) {
                    var  winProd = new LOG.lb.documento.VentanaProductos({
                        idioma: vistaAutorizacionEntrega.idioma,
                        _parent: vistaAutorizacionEntrega,
                        usarFiltroArea: false,
                        usarAplicar: false,
                        usarFiltroDeposito: false,
                        modoSeleccion: 1,
                        parametros: {
                            idestructura: Ext.encode(respMsg.datos),
                            conexistencia: 1,
                            condisponible: 1,
                            comprometida: true
                        },
                        doAction: function (r) {
                            cmbDenomProducto.setValue(r[0].json.idproducto);
                            cmbDenomProducto.setRawValue(r[0].json.denominacion);
                            vistaAutorizacionEntrega.getPanelBusqueda().parametros['idproducto'] = r[0].json.idproducto;
                            cmbDenomProducto.clearInvalid();
                            cmbDenomProducto.focus();
                        }
                    });

                    winProd.init();
                    vistaAutorizacionEntrega.vistaProductos = winProd.view();
                    winProd.getVistaPrincipal().listaBotones.getItem(1).hide();
                    LOG.util.UIManager.apply( winProd.getVistaPrincipal().listaBotones.getItem(1), {
                        handler: function() {
                           vistaAutorizacionEntrega.getPanelBusqueda().parametros['idproducto'] = undefined;
                           vistaAutorizacionEntrega.getPanelBusqueda().onLimpiarHandler();
                        }
                    });
                    vistaAutorizacionEntrega.vistaProductos.show();
                    winProd.getGridPrincipal().on({
                        rowdblclick: function (grid, rowIndex, e) {
                            cmbDenomProducto.value = winProd.getGridPrincipal().getSelectionModel().getSelected().data.idproducto;
                            cmbDenomProducto.setRawValue(winProd.getGridPrincipal().getSelectionModel().getSelected().data.denominacion);
                            vistaAutorizacionEntrega.getPanelBusqueda().parametros['idproducto'] = winProd.getGridPrincipal().getSelectionModel().getSelected().data.idproducto;
                            cmbDenomProducto.clearInvalid();
                            vistaAutorizacionEntrega.vistaProductos.close();
                            cmbDenomProducto.focus();
                        }
                    });
                }
            }
        });
    };

    var fpProductos = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    fpProductos.addComponent(cmbCriterio);

    fpProductos.addComponent(cmbDenomProducto);

    var fpProductodistribucion = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    fpProductodistribucion.addComponent(new Ext.form.FieldSet({
        title: 'Producto en distribuciones',
        items: [fpProductos]
    }));

    fpFechas.getColumn(0).columnWidth = 1;
    fpFechas.getColumn(0).getComponent(0).anchor = '99%';
    fpProductodistribucion.getColumn(0).columnWidth = 1;
    fpProductodistribucion.getColumn(0).getComponent(0).anchor = '99%';
    vistaAutorizacionEntrega.addFilterComponent(fpDatosBusqueda);
    vistaAutorizacionEntrega.addFilterComponent(fpFechas);
    vistaAutorizacionEntrega.addFilterComponent(fpProductodistribucion);
    vistaAutorizacionEntrega.view();
});