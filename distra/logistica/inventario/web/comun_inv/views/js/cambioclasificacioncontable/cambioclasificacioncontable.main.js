LOG.inv.cambioclasificacioncontable.Loader = {
    init: function(cb) {
        var loader = new Ext.ux.ScriptManager();
        loader.loadJs({
            scripts: [
                '/configuracion/nomgenerales/views/js/comun/comboNomenclador.component.js'
            ],
            debug: true,
            callback: cb
        });
    }
};
LOG.inv.cambioclasificacioncontable.Loader.init();

UCID.portal.cargarAcciones(window.frameElement.id, function() {
    //console.info(LOG.inv.comun_inv.cambioclasificacioncontable.Idioma)
    var gridPlugins = new LOG.util.List();
    gridPlugins.add(new Ext.Cont.Plugins.GridColumnComprobanteReporte({
        textIndex: 'nrocomprobante',
        idComprobantesCSVIndex: 'idcomprobante',
    }));
    var idioma = LOG.util.UIManager.apply(LOG.inv.comun_inv.cambioclasificacioncontable.Idioma, LOG.util.Idioma.init());
    var cambioclasificacioncontable = new LOG.inv.cambioclasificacioncontable({
        acciones: acciones_reportes,
        busquedaAvanzada: true,
        idioma: idioma,
        gridPlugins: gridPlugins
    });
    cambioclasificacioncontable.attachPlugin(new LOG.lb.plugin.ComboDepositos());
    cambioclasificacioncontable.attachPlugin(new LOG.lb.documento.PluginFirmaDocumentos({
        columnas : 2,
        firmas: [
            'creadopor',
            'aprobadopor'
        ]
    }));
    
    cambioclasificacioncontable.init();
     //Creando la busqueda avanzada
    cambioclasificacioncontable.getPanelBusqueda().setColumns(1);
    var cls = LOG.util.UIManager.initColumnForm({
        columnas: 1
    });
    var comboestado = new LOG.util.ComboBox({
        fieldLabel: cambioclasificacioncontable.idioma.lbEstado,
        hiddenName: 'estado',
        anchor: '98%',
        store: new Ext.data.SimpleStore({
            fields: ['idestado', 'estado'],
            data: [
                [1, LOG.lb.documento.Estado[1]],
                [2, LOG.lb.documento.Estado[2]],
                [3, LOG.lb.documento.Estado[3]],
                [4, LOG.lb.documento.Estado[4]],
                [5, LOG.lb.documento.Estado[5]]
            ]
        }),
        valueField: 'idestado',
        displayField: 'estado',
        editable: false
    });

    var comobocreadopor = new LOG.lb.documento.ComboUsuarios({
        fieldLabel: cambioclasificacioncontable.idioma.lbCreadoPor,
        hiddenName: 'idusuario',
        anchor: '98%',
        alias: 'ajusteLog',
        subsistema: 10
    });
    var comboaprodado = new LOG.lb.documento.ComboUsuarios({
        fieldLabel: cambioclasificacioncontable.idioma.lbAprobadoPor,
        campo: 'aprobadopor',
        anchor: '98%',
        hiddenName: 'aprobadopor',
        alias: 'ajusteLog',
        subsistema: 10
    }) ;
    // _this.combocontabilizado = new LOG.lb.documento.ComboUsuarios({
    //     fieldLabel: this.idioma.lbContabilizadoPor,
    //     url: 'cargarUsuarios',
    //     campo: 'contabilizadopor',
    //     hiddenName: 'contabilizadopor',
    //     alias: 'ajusteLog',
    //     subsistema: 10
    // });
    var fpFechas = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    fpFechas.addComponent( new Ext.form.DateField({
        fieldLabel: cambioclasificacioncontable.idioma.lbDesde,
        name: 'desde',
        xtype: 'datefield',
        vtype: 'daterange',
        id: 'desde',
        endDateField: 'hasta',
        editable: false
    }));
    fpFechas.addComponent(new Ext.form.DateField({
        fieldLabel: cambioclasificacioncontable.idioma.lbHasta,
        name: 'hasta',
        xtype: 'datefield',
        vtype: 'daterange',
        id: 'hasta',
        startDateField: 'desde',
        editable: false
    }));
    var Fechafielset = new Ext.form.FieldSet({
        title: cambioclasificacioncontable.idioma.tlRangoFecha,
        items: [fpFechas]
    });
    var Filclasificador = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    Filclasificador.addComponent(new LOG.util.ComboBox({
        name:'clasificacionanterior',
        url: 'cargarClasificacion',
        displayField: 'denominacion',
        valueField : 'idclasificacioncontable',
        fieldLabel : cambioclasificacioncontable.idioma.lbClasificacionAnt,
        mode: 'remote',
        minChars: 1,
        pageSize: 20
    }));
    Filclasificador.addComponent(new LOG.util.ComboBox({
        name:'clasificacionactual',
        url: 'cargarClasificacion',
        displayField: 'denominacion',
        valueField : 'idclasificacioncontable',
        fieldLabel : cambioclasificacioncontable.idioma.lbClasificacionAct,
        mode: 'remote',
        minChars: 1,
        pageSize: 20
    }));
    var cmbDenomProducto = new Ext.form.TriggerField({
        fieldLabel: cambioclasificacioncontable.idioma.cmbProducto,
        disabled: false,
        emptyText: cambioclasificacioncontable.idioma.lbSeleccione,
        triggerClass: 'x-form-cliente-trigger',
        tabular: true,
        name: 'producto',
        anchor: '98%',
        editable: false
    });

    cmbDenomProducto.onTriggerClick = function (e) {
        if(cambioclasificacioncontable.idDeposito){
            var  winProd = new LOG.lb.documento.VentanaProductos({
                idioma: cambioclasificacioncontable.idioma,
                _parent: cambioclasificacioncontable,
                usarFiltroArea: false,
                usarAplicar: false,
                usarFiltroDeposito: false,
                modoSeleccion: 1,
                parametros: {
                    idestructura: Ext.encode([cambioclasificacioncontable.idDeposito]),
                    conexistencia: 1,
                    condisponible: 1,
                    comprometida: true
                },
                doAction: function (r) {
                    cmbDenomProducto.setValue(r[0].json.idproducto);
                    cmbDenomProducto.setRawValue(r[0].json.denominacion);
                    cambioclasificacioncontable.getPanelBusqueda().parametros['idproducto'] = r[0].json.idproducto;
                    cmbDenomProducto.clearInvalid();
                    cmbDenomProducto.focus();
                }
            });
    
            winProd.init();
            cambioclasificacioncontable.vistaProductos = winProd.view();
            winProd.getVistaPrincipal().listaBotones.getItem(1).hide();
            LOG.util.UIManager.apply( winProd.getVistaPrincipal().listaBotones.getItem(1), {
                handler: function() {
                    cambioclasificacioncontable.getPanelBusqueda().parametros['idproducto'] = undefined;
                    cambioclasificacioncontable.getPanelBusqueda().onLimpiarHandler();
                }
            });
            cambioclasificacioncontable.vistaProductos.show();
            winProd.getGridPrincipal().on({
                rowdblclick: function (grid, rowIndex, e) {
                    cmbDenomProducto.value = winProd.getGridPrincipal().getSelectionModel().getSelected().data.idproducto;
                    cmbDenomProducto.setRawValue(winProd.getGridPrincipal().getSelectionModel().getSelected().data.denominacion);
                    cambioclasificacioncontable.getPanelBusqueda().parametros['idproducto'] = winProd.getGridPrincipal().getSelectionModel().getSelected().data.idproducto;
                    cmbDenomProducto.clearInvalid();
                    cambioclasificacioncontable.vistaProductos.close();
                    cmbDenomProducto.focus();
                }
            });
            winProd.getStorePrincipal().load();
        }
       
        // Ext.MessageBox.wait(cambioclasificacioncontable.idioma.msgLoadProductos, cambioclasificacioncontable.idioma.msgEspere || '...');
        // Ext.Ajax.request({
        //     url: 'getSubordinacionEntidad',
        //     callback: function (o, s, resp) {
        //         Ext.MessageBox.hide();
        //         var respMsg = Ext.decode(resp.responseText);
        //         if (respMsg.datos) {
                  
        //         }
        //     }
        // });
    };
    var Observaciones = new Ext.form.TextArea({
        fieldLabel: 'Observaciones',
        name: 'observaciones',
        maxLength: 255,
        minLength: 2,
        width: '100%',
        enableKeyEvents: true
      });     

    var Filclasificadorfieldset = new Ext.form.FieldSet({
        title: cambioclasificacioncontable.idioma.tlRangoClasificador,
        items: [Filclasificador]
    });
    var Mainfieldset = new Ext.form.FieldSet({
        items: [comboestado,comobocreadopor,comboaprodado,cmbDenomProducto,Observaciones]
    });
    cls.addComponent(Mainfieldset);
    cls.addComponent(Fechafielset);
    cls.addComponent(Filclasificadorfieldset);
    cambioclasificacioncontable.addFilterComponent(cls);
    //fin de la busqueda avanzada
    cambioclasificacioncontable.view();
});
