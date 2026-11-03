/**
 * Created by madrid on 16/11/2016.
 */


var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('gestionarconceptosdeaportes', cargarInterfaz);
var accionConcepAporte = "";
var myMaskConceptaporte = new Ext.LoadMask(Ext.getBody(), {
    msg: 'Cargando...'
});
var contAplicar = 0;
var accionAcepApli = "";
UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function () {
    for (i in acciones_reportes) {
        if (acciones_reportes[i].abreviatura == 'rector') {
            esRector = true;
            break;
        } else {
            esRector = false;
        }

    }
})


function cargarInterfaz() {

    filtrosgestionarconcepaportes = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'denominacion'
            },
            {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'numeric',
                dataIndex: 'valor'
            }
        ]
    });

    smConcepAportes = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, row_index, record) {
                if (sm.getSelections().length == 1) {
                    Ext.getCmp('idbtnModificarConcepAportes').enable();
                } else {
                    Ext.getCmp('idbtnModificarConcepAportes').disable();
                }

                Ext.getCmp('idbtnEliminarConcepAportes').enable();
            },
            rowdeselect: function (sm, row_index, record) {
                Ext.getCmp('idbtnModificarConcepAportes').disable();
                Ext.getCmp('idbtnEliminarConcepAportes').disable();
            }
        }
    });

    cmConcepAportes = new Ext.grid.ColumnModel([
        {
            id: 'iddenominacion',
            header: "Denominaci&oacute;n",
            dataIndex: 'denominacion',
            width: 90,
            sortable: true
        },
        {
            header: "Descripci&oacute;n",
            dataIndex: 'descripcion',
            width: 90,
            sortable: true
        },
        {
            header: "Valor",
            dataIndex: 'valor',
            width: 90,
            sortable: true
        }
    ]);

    storeConcepAportes = new Ext.data.Store({
        autoLoad: true,
        url: 'listarConceptosDeAportes',
        listeners: {
            beforeload: function (_this, options) {

            },
            load: function (_this, records, options) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [
            {
                name: 'idconceptoaporte'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'descripcion'
            },
            {
                name: 'valor'
            }
        ])
    });

//botones del tbar

    btnAdicionarConcepAportes = new Ext.Button({
        id: 'idbtnAdicionarConcepAportes',
        iconCls: 'adicionar',
        tooltip: 'Adicionar un Concepto de Aporte <b>(Alt + A)<b>',
        handler: function () {
            accionConcepAporte = 'adicionar';
            wAdicConceptoAporte.show();
        }
    });

    btnModificarConcepAportes = new Ext.Button({
        id: 'idbtnModificarConcepAportes',
        iconCls: 'modificar',
        tooltip: 'Modificar un Concepto de Aporte <b>(Alt + M)<b>',
        disabled: true,
        handler: function () {
            accionConcepAporte = 'modificar';
            wAdicConceptoAporte.show();
        }
    });

    btnEliminarConcepAportes = new Ext.Button({
        id: 'idbtnEliminarConcepAportes',
        iconCls: 'eliminar',
        tooltip: 'Eliminar un Concepto de Aporte <b>(DEl)<b>',
        disabled: true,
        handler: function () {
            if (smConcepAportes.getSelections().length == 1) {
                mostrarMensaje(2, '\xBFEst&aacute; seguro que quiere eliminar el concepto  seleccionado?', eliminarConcepAporte);
            } else {
                mostrarMensaje(2, '\xBFEst&aacute; seguro que quiere eliminar los conceptos seleccionados?', eliminarConcepAporte);
            }
        }
    });

    btnLimpiarConcepAportes = new Ext.Button({
        id: 'idbtnLimpiarConcepAportes',
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtros <b>(Alt + L)<b>',
        handler: function () {

        }
    });


    /**
     * menu del click derecho del grid
     */
    menuConceptoAporte = new Ext.menu.Menu({
        id: 'menuConceptoAporte',
        //disabled: true,
        listeners: {},
        items: [{
            text: 'Eliminar',
            iconCls: 'eliminar',
            id: 'mdEliminarDesglose',
            tooltip: 'Eliminar concepto de aporte',
            handler: function () {

            }
        }]
    });


    gridConcepAportes = new Ext.grid.EditorGridPanel({
        autoExpandColumn: 'iddenominacion',
        plugins: filtrosgestionarconcepaportes,
        listeners: {
            rowcontextmenu: function (g, r, e) {

                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());

            },
            afteredit: function (e) {

            }
        },
        store: storeConcepAportes,
        cm: cmConcepAportes,
        sm: smConcepAportes,
        md:menuConceptoAporte,
        loadMask: true,
        id: 'idgridConcepAportes',
        frame: true,
        tbar: [btnAdicionarConcepAportes, btnModificarConcepAportes, btnEliminarConcepAportes],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: storeConcepAportes,
            displayInfo: true,
            items: [btnLimpiarConcepAportes]
        })
    });


//ventanas adicionar y modificar

    btnCancelarAdicConcAporte = new Ext.Button({
        text: 'Cancelar',
        disabled: false,
        id: 'idbtnCancelarAdicConcAporte',
        iconCls: 'cancelar',
        tooltip: 'Cerrar ventana sin guardar los datos',
        handler: function () {
            fpAdicModifConceptoAporte.getForm().reset();
            wAdicConceptoAporte.hide();
        }
    });

    btnAplicarAdicConcAporte = new Ext.Button({
        text: 'Aplicar',
        disabled: true,
        id: 'idbtnAplicarAdicConcAporte',
        iconCls: 'aplicar',
        tooltip: 'Guardar datos y limpiar los campos',
        handler: function () {
            myMaskConceptaporte.show();
            accionAcepApli = "aplicar";
            adicionarConcepAporte();
        }
    });

    btnAceptarAdicConcAporte = new Ext.Button({
        text: 'Aceptar',
        disabled: true,
        id: 'idbtnAceptarAdicConcAporte',
        iconCls: 'aceptar',
        tooltip: 'Guardar los datos y cerrar la ventana',
        handler: function () {
            myMaskConceptaporte.show();
            accionAcepApli = "aceptar";
            if (accionConcepAporte == "adicionar") {
                adicionarConcepAporte();
            } else {
                modificarConcepAporte();
            }

        }
    });

    txfDenominacion = new Ext.form.TextField({
        id: 'idtxfDenominacion',
        anchor: '95%',
        align: 'right',
        fieldLabel: 'Denominaci&oacute;n',
        allowBlank: false
    });

    txfValor = new Ext.form.NumberField({
        id: 'idtxfValor',
        anchor: '95%',
        align: 'right',
        fieldLabel: 'Valor',
        allowBlank: false,
        maxLength : 3,
        maxLengthText: 'El tama\xF1o m&aacute;ximo requerido es 3 d&iacute;gitos.'
    });

    txaDescripcion = new Ext.form.TextArea({
        id: 'idtxaDescripcion',
        anchor: '100%',
        fieldLabel: 'Descripci&oacute;n'
    });

    fpAdicModifConceptoAporte = new Ext.FormPanel({
        frame: true,
        labelAlign: 'top',
        id: 'idfpAdicModifConceptoAporte',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .8,
                layout: 'form',
                items: [txfDenominacion]
            }, {
                columnWidth: .2,
                layout: 'form',
                items: [txfValor]
            }]
        }, txaDescripcion],
        listeners: {
            clientvalidation: function () {
                if (accionConcepAporte == "adicionar") {
                    if (Ext.getCmp('idfpAdicModifConceptoAporte').getForm().isValid()) {
                        Ext.getCmp('idbtnAplicarAdicConcAporte').enable();
                        Ext.getCmp('idbtnAceptarAdicConcAporte').enable();
                    } else {
                        Ext.getCmp('idbtnAplicarAdicConcAporte').disable();
                        Ext.getCmp('idbtnAceptarAdicConcAporte').disable();
                    }
                } else {
                    if (Ext.getCmp('idfpAdicModifConceptoAporte').getForm().isValid()) {
                        Ext.getCmp('idbtnAceptarAdicConcAporte').enable();
                    } else {
                        Ext.getCmp('idbtnAceptarAdicConcAporte').disable();
                    }
                }
            }
        }
    });

    wAdicConceptoAporte = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        constrain: true,
        layout: 'fit',
        autoValidate: false,
        items: fpAdicModifConceptoAporte,
        resizable: false,
        width: 450,
        height: 205,
        listeners: {
            beforeshow: function (win) {
                contAplicar = 0;
                Ext.getCmp('idtxfDenominacion').focus(true, 500);
                if (accionConcepAporte == "adicionar") {
                    smConcepAportes.clearSelections();
                    btnAplicarAdicConcAporte.show();
                    win.setTitle('Adicionar Concepto de Aporte');
                } else {
                    Ext.getCmp('idtxfDenominacion').setValue(smConcepAportes.getSelected().data.denominacion);
                    Ext.getCmp('idtxaDescripcion').setValue(smConcepAportes.getSelected().data.descripcion);
                    Ext.getCmp('idtxfValor').setValue(smConcepAportes.getSelected().data.valor);
                    btnAplicarAdicConcAporte.hide();
                    win.setTitle('Modificar Concepto de Aporte');
                }
            },
            hide: function () {
                Ext.getCmp('idbtnModificarConcepAportes').disable();
                Ext.getCmp('idbtnEliminarConcepAportes').disable();

            }
        },
        buttons: [btnCancelarAdicConcAporte, btnAplicarAdicConcAporte, btnAceptarAdicConcAporte]
    });


    pPrincipalConcepAportes = new Ext.Panel({
        layout: 'fit',
        items: [gridConcepAportes]
    });


    vpPrincipalConcepAportes = new Ext.Viewport({
        id: 'vpprincipal',
        layout: 'fit',
        items: [pPrincipalConcepAportes]
    });
}

function adicionarConcepAporte() {
    Ext.Ajax.request({
        url: 'adicionarConceptoDeAporte',
        params: {
            denominacion: Ext.getCmp('idtxfDenominacion').getValue(),
            descripcion: Ext.getCmp('idtxaDescripcion').getValue(),
            valor: Ext.getCmp('idtxfValor').getValue()
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.adiciono == 1) {
                if (accionAcepApli == "aceptar") {
                    if (contAplicar > 0) {
                        mostrarMensaje(1, 'Los conceptos de aporte han sido adicionados satisfactoriamente.');
                    } else {
                        mostrarMensaje(1, 'El concepto de aporte ha sido adicionado satisfactoriamente.');
                    }
                    myMaskConceptaporte.hide();
                    wAdicConceptoAporte.hide();
                    storeConcepAportes.reload();
                    fpAdicModifConceptoAporte.getForm().reset();
                } else {
                    myMaskConceptaporte.hide();
                    contAplicar++;
                    fpAdicModifConceptoAporte.getForm().reset();
                }
            } else {
                mostrarMensaje(1, 'El concepto de aporte no se ha podido adicionar debido a un error interno del sistema.');
            }
        }
    });
}

function modificarConcepAporte() {
    Ext.Ajax.request({
        url: 'modificarConceptoDeAporte',
        params: {
            denominacion: Ext.getCmp('idtxfDenominacion').getValue(),
            descripcion: Ext.getCmp('idtxaDescripcion').getValue(),
            valor: Ext.getCmp('idtxfValor').getValue(),
            idconceptoaporte: smConcepAportes.getSelected().data.idconceptoaporte
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);

            if (responseData.modifico == 1) {
                if (accionAcepApli == "aceptar") {
                    fpAdicModifConceptoAporte.getForm().reset();
                    wAdicConceptoAporte.hide();
                    storeConcepAportes.reload();
                    myMaskConceptaporte.hide();
                }
                mostrarMensaje(1, 'El concepto de aporte ha sido modificado satisfactoriamente.');
            } else {
                mostrarMensaje(1, 'El concepto de aporte no se ha podido modificar debido a un error interno del sistema.');
            }
        }
    });
}

function eliminarConcepAporte(btn) {
    myMaskConceptaporte.show();
    if (btn == 'ok') {
        var valInsertar = [];
        var selecciones = smConcepAportes.getSelections();
        for (var i = 0; i < selecciones.length; i++) {
            valInsertar[i] = selecciones[i].data.idconceptoaporte;
        }

        Ext.Ajax.request({
            url: 'eliminarConceptoDeAporte',
            params: {
                idconceptosaportes: Ext.encode(valInsertar)
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.elimino == 1) {
                    if (selecciones.length == 1) {
                        mostrarMensaje(1, 'El concepto de aporte ha sido eliminado satisfactoriamente.');
                        storeConcepAportes.reload();
                        myMaskConceptaporte.hide();
                    } else {
                        mostrarMensaje(1, 'Los conceptos de aportes han sido eliminados satisfactoriamente.');
                        storeConcepAportes.reload();
                        myMaskConceptaporte.hide();
                    }
                }

            }
        });
    }
}