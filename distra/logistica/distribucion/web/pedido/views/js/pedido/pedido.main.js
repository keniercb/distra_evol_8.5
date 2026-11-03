Ext.ns('LOG.dist.pedido');
UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var vistaPedido = new LOG.dist.pedido.View({
        acciones: acciones_reportes,
        busquedaBasica: true,
        busquedaAvanzada: true,
        usarObservaciones:true,
        idioma: LOG.util.UIManager.apply(LOG.dist.pedido.Idioma, LOG.util.Idioma)
    });
    //vistaPedido.attachPlugin(new LOG.dist.pedido.ComboEntidades);
    vistaPedido.init();
    vistaPedido.getPanelBusqueda().setColumns(1);
    var fpDatosBusquedaAvanzada = LOG.util.UIManager.initColumnForm({
        columnas: 1
    });

    var fpDatosBusqueda = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    this.tipoReclamoAvan = new Ext.erp.comboNomenclador({
        controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
        modelo: 'NomTiporeclamo',
        idnom: 'idtiporeclamo',
        name: 'idtiporeclamo',
        anchor: '90%',
        allowBlank: true,
        editable: false,
        autoCargar: true,
        fieldLabel: vistaPedido.idioma.lbTipoReclamo,
        emptyText: vistaPedido.idioma.lbSeleccione
    });

    Ext.apply(this.tipoReclamoAvan, {
        editable: false
    });

    fpDatosBusqueda.addComponent(this.tipoReclamoAvan);


    fpDatosBusqueda.addComponent(new Ext.form.DateField({
        fieldLabel: vistaPedido.idioma.lbFechaVencimiento,
        name: 'fechavencimiento',
        editable: false
    }));

    fpDatosBusqueda.addComponent(new LOG.util.ComboBox({
        fieldLabel: vistaPedido.idioma.lbEstado,
        hiddenName: 'estado',
        emptyText: vistaPedido.idioma.lbSeleccione,
        store: new Ext.data.SimpleStore({
            fields: ['idestado', 'estado'],
            data: [
                [1, LOG.lb.documento.Estado[1]],
                [2, LOG.lb.documento.Estado[2]],
                [3, LOG.lb.documento.Estado[3]],
                [9, LOG.lb.documento.Estado[9]]
            ]
        }),
        valueField: 'idestado',
        displayField: 'estado',
        editable: false
    }));

    fpDatosBusqueda.addComponent(new LOG.util.ComboBox({
        fieldLabel: vistaPedido.idioma.lbEstadoEjecucion,
        emptyText: vistaPedido.idioma.lbSeleccione,
        hiddenName: 'estadoejecucion',
        store: new Ext.data.SimpleStore({
            fields: ['idestadoejecucion', 'estadoejecucion'],
            data: [
                [1, LOG.dist.pedido.EstadoPedido[1]],
                [2, LOG.dist.pedido.EstadoPedido[2]],
                [3, LOG.dist.pedido.EstadoPedido[3]],
                [4, LOG.dist.pedido.EstadoPedido[4]]
            ]
        }),
        valueField: 'idestadoejecucion',
        displayField: 'estadoejecucion',
        editable: false
    }));

    fpDatosBusqueda.addComponent(new LOG.util.Prototipos.inputEntero({
        fieldLabel: vistaPedido.idioma. lbDocOrigen,
        emptyText: vistaPedido.idioma.lbSeleccione,
        name: 'nroDoc',
        editable: false
    }));

    fpDatosBusqueda.addComponent(new LOG.util.ComboBox({
        fieldLabel: vistaPedido.idioma. lbTipoDocOrigen,
        emptyText: vistaPedido.idioma.lbSeleccione,
        store: new Ext.data.SimpleStore({
            fields: ['idtipodoc', 'tipodoc'],
            data: [
                [1, LOG.dist.pedido.TipoDocumento[1]],
                [2, LOG.dist.pedido.TipoDocumento[2]],
                [3, LOG.dist.pedido.TipoDocumento[3]],
                [4, LOG.dist.pedido.TipoDocumento[4]],
                [5, LOG.dist.pedido.TipoDocumento[5]]
            ]
        }),
        valueField: 'idtipodoc',
        displayField: 'tipodoc',
        hiddenName: 'tipodoc',
        editable: false
    }));
    var txtNroContrato = new LOG.util.Prototipos.inputEntero({
        fieldLabel: vistaPedido.idioma.lbContrato,
        name: 'avanidcontrato',
        allowBlank: true
    });

    var clientes = new LOG.util.ComboBox({
        fieldLabel: vistaPedido.idioma.lbCliente,
        url: 'cargarClientes',
        hiddenName: 'idcliente',
        valueField: 'idclientesproveedores',
        displayField: 'nombre',
        loadingText: vistaPedido.idioma.lbCargando,
        hideTrigger: false,
        readOnly: false,
        triggerAction: 'all',
        enableQtip: true,
        pageSize: 10,
        emptyText: vistaPedido.idioma.lbSeleccione,
        minChars: 0,
        mode: 'remote'//,
    });

    var tipopedido = new LOG.util.ComboBox({
        fieldLabel: 'Tipo de pedido',
        url: 'cargarNomtipopedido',
        hiddenName: 'idnomconcepto',
        valueField: 'idnomconcepto',
        displayField: 'denomtipopedido',
        loadingText: vistaPedido.idioma.lbCargando,
        hideTrigger: false,
        readOnly: false,
        triggerAction: 'all',
        enableQtip: true,
        pageSize: 10,
        emptyText: vistaPedido.idioma.lbSeleccione,
        minChars: 0,
        mode: 'remote'//,
    });

    var clsFecha = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    clsFecha.addComponent(
        new Ext.form.DateField({
            fieldLabel: 'Desde',
            name: 'desde',
            vtype: 'daterange',
            id: 'desde',
            endDateField: 'hasta',
            editable: false
        })
    );

    clsFecha.addComponent(
        new Ext.form.DateField({
            fieldLabel: 'Hasta',
            name: 'hasta',
            vtype: 'daterange',
            id: 'hasta',
            startDateField: 'desde',
            editable: false
        })
    );

    var fpDatosClientes = LOG.util.UIManager.initColumnForm({
        columnas: 1
    });

    Ext.Ajax.request({
        url: 'getTipopedido',
        callback: function(opt, scs, resp) {
            respMsg = Ext.decode(resp.responseText);
            if (respMsg.datos[0]) {
                if (respMsg.datos[0].tipopedido == 1) {
                    fpDatosBusqueda.addComponent(txtNroContrato);
                    fpDatosBusqueda.addComponent(clientes);
                    fpDatosBusquedaAvanzada.addComponent(fpDatosBusqueda);
                } else {
                    fpDatosClientes.addComponent(clientes);
                    fpDatosBusquedaAvanzada.addComponent(fpDatosBusqueda);
                    fpDatosBusquedaAvanzada.addComponent(fpDatosClientes);
                }
                fpDatosBusquedaAvanzada.addComponent(tipopedido);
                fpDatosBusquedaAvanzada.addComponent(new Ext.form.FieldSet({
                    title: 'Rango de fecha',
                    items: [clsFecha]
                }));
            }
        }
    });

    vistaPedido.addFilterComponent(fpDatosBusquedaAvanzada);
    vistaPedido.view();

});