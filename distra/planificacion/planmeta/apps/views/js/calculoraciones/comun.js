var add, winAddModComun;

var rdComun, urlStGpComun, cmComun, upFpGestComun, addUrl, recargaComun, urlDelComun;
var parametroEliminar, gpComun, parametro;
var titVentana, titAddComun, titModComun, idtipo, idbalance, idconftiponomesp, idtipobalance, btnAdicionarComun, idsubtipobalance;

function ConfiguracionGlobal()
{

    stTipobalanceSub = new Ext.data.Store({
        url: 'cargartbcombotipobalance',
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: "data"
        }, [{
                name: 'idtipobalance'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            beforeload: function() {

                this.baseParams.idconftiponomesp = cbComponente.getValue();
                this.baseParams.idbalance = idbalance
            },
            load: function(st, rc, obj) {


            }
        }
    });

    stTipobalanceSub.reload({
        params: {
            idconftiponomesp: cbComponente.getValue(),
            start: 0,
            limit: 10
        }
    });

    tipo = {
        xtype: 'tbtext',
        text: "Tipos de balances"
    };
    btnAdicionarComun = new Ext.Button({
        text: perfil.etiquetas.lbBtnAdicionar,
        id: 'btnAdicionarComun',
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn',
        tooltip: 'Adicionar (<b>Alt+I</b>)',
        disabled: true,
        handler: function() {
            adicionarElemento();
        }
    });

    btnLimpiar = new Ext.Toolbar.Button({
        id: 'btnLimpiarCalcNiv',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        disabled: true,
        hidden: true,
        tooltip: "Limpiar combo",
        text: perfil.etiquetas.lbLimpiar,
        handler: function() {
            cbTipobalanceSub.clearValue();
            stGridComun.removeAll();
        }
    });

    cbTipobalanceSub = new Ext.form.ComboBox({
        width: 200,
        listWidth: 400,
        fieldLabel: 'Tipos de balances',
        loadingText: 'Cargando...',
        store: stTipobalanceSub,
        displayField: 'denominacion',
        valueField: 'idtipobalance',
        id: 'cbTipobalanceSub',
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Seleccione...',
        selectOnFocus: true,
        listeners: {
            select: function(c, rc) {
                idtipobalance = c.getValue();
                Ext.getCmp('btnAdicionarComun').enable();
                stGridComun.reload({
                    params: {
                        idbalance: cbTipobalanceSub.getValue(),
                        start: 0,
                        limit: 10
                    }
                });
            }
        }
    });

    //para crear la ventana de balances
    if (gestor == 'balances')
    {
        Ext.getCmp('cbTipobalanceSub').hide();
        btnAdicionarComun.enable();

        tipo.text = '  ';
        titVentana = perfil.etiquetas.titGestionarBalances;
        titAddComun = 'Adicionar balances'
        titModComun = 'Modificar balances';

        addUrl = 'adicionarBalance';
        urlDelComun = 'eliminar';
        urlStGpComun = 'listarBalance';

        parametroEliminar = function() {
            return {
                idbalance: gpComun.getSelectionModel().getSelected().data.idbalance
            };

        };


        rdComun = new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'
        }, [{
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'idbalance'
            }]);

        cmComun = new Ext.grid.ColumnModel([
            {
                header: perfil.etiquetas.lbDenominacion,
                width: 250,
                dataIndex: 'denominacion',
                sortable: true
            },
            {
                header: perfil.etiquetas.lbDescripcion,
                id: 'expandir',
                dataIndex: 'descripcion'
            }]);

        upFpGestComun = function() {
            fpComun.getForm().reset();
        }

        recargaComun = function() {

            stGridComun.reload({
                params: {
                    identidad: identidad,
                    idconftiponomesp: idconftiponomesp,
                    idbalance: cbTipobalanceSub.getValue(),
                    start: 0,
                    limit: 10
                }
            });
        };

    }

    else if (gestor == 'subtipos')
    {
        Ext.getCmp('btnLimpiarCalcNiv').enable();
        Ext.getCmp('btnLimpiarCalcNiv').setVisible(true);
        stTipobalanceSub.reload({
            params: {
                idconftiponomesp: cbComponente.getValue(),
                start: 0,
                limit: 10

            }
        });

        tipo.text = "Tipos de balances";
        function NomTipobalance(val) {
            return val.denominacion;
        }

        titVentana = perfil.etiquetas.titGestionarSubTipos;
        titAddComun = perfil.etiquetas.titAddSubTipos;
        titModComun = perfil.etiquetas.titModSubTipos;

        addUrl = 'adicionarSubtipbalance';
        urlDelComun = 'eliminar';
        urlStGpComun = 'listarSubtipobalance';

        parametroEliminar = function() {
            return {
                idsubtipobalance: gpComun.getSelectionModel().getSelected().data.idsubtipobalance
            };

        };

        rdComun = new Ext.data.JsonReader({
            totalProperty: 'total',
            root: "data"
        },
        [{
                name: 'idsubtipobalance'
            }, {
                name: 'idtipobalance'
            }, {
                name: 'denominacion'
            }, {
                name: 'NomTipobalance'
            }, {
                name: 'descripcion'
            }]);

        cmComun = new Ext.grid.ColumnModel([
            {
                header: perfil.etiquetas.lbDenominacion,
                width: 250,
                dataIndex: 'denominacion',
                sortable: true
            },
            {
                header: perfil.etiquetas.lbTipoBalance,
                dataIndex: 'NomTipobalance',
                width: 200,
                renderer: NomTipobalance,
                sortable: true
            },
            {
                header: perfil.etiquetas.lbDescripcion,
                id: 'expandir',
                dataIndex: 'descripcion'
            }]);

        upFpGestComun = function() {
            fpComun.getForm().reset();
        }

        recargaComun = function() {
            stGridComun.reload();
            stTipobalance.reload();
            if (Ext.getCmp('idtipobalance').getValue()) {
                stSubtipobalance.reload();
            }
        };

    }

    else if (gestor == 'tipos')
    {
        Ext.getCmp('cbTipobalanceSub').hide();
        btnAdicionarComun.enable();
        tipo.text = "  ";
        titVentana = perfil.etiquetas.titGestionarTipos;
        titAddComun = perfil.etiquetas.titAddTipos;
        titModComun = perfil.etiquetas.titModTipos;

        addUrl = 'adicionarTipobalance';
        urlDelComun = 'eliminar';
        urlStGpComun = 'listarTipobalance';

        parametroEliminar = function() {
            return {
                idtipobalance: gpComun.getSelectionModel().getSelected().data.idtipobalance
            };

        };


        rdComun = new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'
        }, [{
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'idtipobalance'
            }]);

        cmComun = new Ext.grid.ColumnModel([
            {
                header: perfil.etiquetas.lbDenominacion,
                width: 250,
                dataIndex: 'denominacion',
                sortable: true,
                maxLength: 2,
                maxLengthText: perfil.etiquetas.lbmaxLengthText
            },
            {
                header: perfil.etiquetas.lbDescripcion,
                id: 'expandir',
                dataIndex: 'descripcion'
            }]);

        upFpGestComun = function() {
            fpComun.getForm().reset();
        }

        recargaComun = function() {
            stGridComun.reload();
            stTipobalance.reload();
        };

    }


}


function gestComun() {
    gestorOLD = gestor;
    ConfiguracionGlobal();


    btnEliminarComun = new Ext.Button({
        text: perfil.etiquetas.lbBtnEliminar,
        id: 'btnEliminarComun',
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn',
        tooltip: 'Eliminar  (<b>DEL</b>)',
        disabled: true,
        handler: function() {
            eliminarComun();
        }
    });

    btnModificarComun = new Ext.Button({
        text: perfil.etiquetas.lbBtnModificar,
        id: 'btnModificarComun',
        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'btn',
        tooltip: 'Modificar  (<b>Alt+M</b>)',
        disabled: true,
        handler: function() {
            modificarElemento();
        }
    })

    //creo el Store
    stGridComun = new Ext.data.Store(
            {
                url: urlStGpComun,
                reader: rdComun,
                remoteSort: true, //siempre trabaja sobro lo de la bd
                listeners: {
                    beforeload: function() {
                        gpComun.getSelectionModel().clearSelections();
                        stGridComun.baseParams.idconftiponomesp = idconftiponomesp;
                    }
                }
            });

    //Defino el paginado
    pgCumun = new Ext.PagingToolbar({
        pageSize: 10,
        store: stGridComun,
        displayInfo: true,
        displayMsg: 'Resultados de {0} - {1} de {2}'
    });

    smComun = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(sm) {
                idtipobalance = sm.getSelected().data.idtipobalance;
                HabilitarGestion();
            },
            rowdeselect: function() {

                HabilitarGestion();
            }
        }
    });
    Ext.menu.RangeMenu.prototype.icons = {
        gt: perfil.dirImg + 'greater_then.png',
        lt: perfil.dirImg + 'less_then.png',
        eq: perfil.dirImg + 'equals.png'
    };

    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';

    //filtros del grid de comun
    filtroscalcomun = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'listado',
                dataIndex: 'NomTipobalance',
                idcombo: 'cbTipobalanceSub',
                urlcb: 'cargartbcombotipobalance',
                valueFieldcb: 'idtipobalance',
                displayFieldcb: 'denominacion'
            }]
    });

    /**
     * menu del click derecho del grid
     */
    menuComun = new Ext.menu.Menu({
        id: 'menuComun',
        //disabled: true,
        listeners: {},
        items: [{
            text: 'Eliminar',
            iconCls: 'eliminar',
            id: 'mdEliminarComun',
            tooltip: 'Eliminar tipo de balance',
            handler: function () {

            }
        }]
    });


    //Defino el Grid
    gpComun = new Ext.grid.GridPanel({
        store: stGridComun,
        loadMask: {
            store: stGridComun
        }, //Espera a que se cargue el store
        cm: cmComun,
        plugins: filtroscalcomun,
        sm: smComun, //definir el seleccion model
        md:menuComun,
        width: 500,
        autoExpandColumn: 'expandir',
        height: 200,
        frame: true,
        id: 'gpComun',
        bbar: pgCumun,
        listeners:{
            rowcontextmenu: function (g, r, e) {
                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());

            }
        }
    });





    winComun = new Ext.Window({
        title: titVentana,
        width: 600,
        layout: 'fit',
        height: 400,
        closeAction: 'close',
        constrain: true,
        modal: true,
        tbar: [btnAdicionarComun, btnModificarComun, btnEliminarComun, '->', tipo, cbTipobalanceSub, '-', btnLimpiar],
        items: [gpComun]
    })

}//Fin de la funcion gestComun


function fnWinAddModComun(data)
{
    btnCancelarComun = new Ext.Button({
        text: perfil.etiquetas.lbBtnCancelar,
        id: 'btnCancelarComun',
        icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'btn',
        disabled: false,
        tooltip: perfil.etiquetas.lbBtnCancelar,
        handler: function() {
            Ext.getCmp('winAddModComun').close();

        }
    });
    btnAplicarComun = new Ext.Button({
        text: perfil.etiquetas.lbBtnAplicar,
        id: 'btnAplicarComun',
        icon: perfil.dirImg + 'aplicar.png',
        iconCls: 'btn',
        disabled: false,
        tooltip: 'Aplicar',
        hidden: data ? data.modificando : false,
        handler: function() {
            AdicionarComun(true, data.modificando)
        }
    });
    btnAceptarComun = new Ext.Button({
        text: perfil.etiquetas.lbBtnAceptar,
        id: 'btnAceptarComun',
        icon: perfil.dirImg + 'aceptar.png',
        tooltip: 'Aceptar',
        iconCls: 'btn',
        enable: false,
        handler: function() {
            AdicionarComun(false, data.modificando)
        }
    });

    tfDenComun = new Ext.form.TextField({
        id: 'tfDenComun',
        name: 'denominacion',
        tabIndex: 11,
        fieldLabel: perfil.etiquetas.lbDenominacion,
        anchor: '100%',
        value: data ? data.denom : '',
        maxLength: 255,
        maxLengthText: perfil.etiquetas.lbmaxLengthText,
        regex: /^([a-zA-ZáéíóúñüÑÁÉÍÓÚ0-9\-\ \:\/\,\_\-\.\d()"'.]+ ?[a-zA-ZáéíóúñüÑÁÉÍÓÚ0-9\-\:\/\,\_\-\.\d()"'.]*)+$/,
        maskRe: /^([a-zA-ZáéíóúñüÑÁÉÍÓÚ0-9\-\ \:\/\,\_\-\.\d()"'.]+ ?[a-zA-ZáéíóúñüÑÁÉÍÓÚ0-9\-\:\/\,\_\-\.\d()"'.]*)+$/,
        allowBlank: false,
        blankText: perfil.etiquetas.lbmsgCampoObligatorio
    });

    taDesComun = new Ext.form.TextArea({
        id: 'taDesComun',
        tabIndex: 12,
        name: 'descripcion',
        fieldLabel: perfil.etiquetas.lbDescripcion,
        value: data ? data.descripcion : '',
        regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]*)+$/,
        allowBlank: false,
        blankText: perfil.etiquetas.lbmsgCampoObligatorio,
        anchor: '100%',
        maxLength: 255,
        maxLengthText: perfil.etiquetas.lbmaxLengthText
    });

    fpComun = new Ext.FormPanel({
        id: 'fpComun',
        region: 'center',
        autoHeight: true,
        autoWidth: true,
        frame: true,
        labelAlign: 'top',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        style: 'margin:0 10 0 10;',
                        layout: 'form',
                        items: [tfDenComun, taDesComun]
                    },
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                xtype: 'hidden',
                                id: 'idtipobalance1'
                            }

                        ]
                    }]

            }]
    });

    winAddModComun = new Ext.Window({
        width: 400,
        autoHeight: true,
        id: 'winAddModComun',
        title: data.title,
        constrain: true,
        layout: 'fit',
        closeAction: 'destroy',
        modal: true,
        buttons: [btnCancelarComun, btnAplicarComun, btnAceptarComun],
        items: [fpComun],
        listeners: {
            'beforeshow': function() {
                Ext.getCmp('tfDenComun').focus(true, 500);
            }
        }
    }).show();

}// fin de la funcion winAddModComun

function HabilitarGestion()
{

    if (gpComun.getSelectionModel().hasSelection())
    {
        btnEliminarComun.enable()
        btnModificarComun.enable();
    }
    else {
        btnEliminarComun.disable()
        btnModificarComun.disable();
    }
}

gestComun();

winComun.show();
if (gestor != 'subtipos')
    stGridComun.load({
        params: {
            start: 0,
            limit: 10
        }
    });

gpComun.getSelectionModel().clearSelections();
HabilitarGestion();


function adicionarElemento() {
    stTipobalanceSub.reload({
        params: {
            idconftiponomesp: Ext.getCmp('idconftiponomesp').getValue(),
            start: 0,
            limit: 10
        }
    });

    fnWinAddModComun({
        title: titAddComun,
        modificando: false
    });
    upFpGestComun();
}

function modificarElemento() {
    fnWinAddModComun({
        showAplicar: true,
        title: titModComun,
        descripcion: gpComun.getSelectionModel().getSelected().data.descripcion,
        denom: gpComun.getSelectionModel().getSelected().data.denominacion,
        modificando: true
    });


    upFpGestComun();
}



function AdicionarComun(apli, modificando)
{

    if (fpComun.getForm().isValid()) {

        var idsubtipobalance = 0;
        if (modificando)
        {
            idsubtipobalance = gpComun.getSelectionModel().getSelected().data.idsubtipobalance;
            idtipo = gpComun.getSelectionModel().getSelected().data.idtipobalance;
            idbalance = smComun.getSelected().data.idbalance
        } else {
            idtipo = "";
            idsubtipobalance = "";
            idbalance = "";
        }
        if (cbTipobalanceSub.getValue()) {
            idtipo = cbTipobalanceSub.getValue();
        }
        fpComun.getForm().submit({
            url: addUrl,
            params: {
                idconftiponomesp: idconftiponomesp,
                start: 0,
                limit: 10,
                idtipobalance: cbTipobalanceSub.getValue() ? cbTipobalanceSub.getValue() : idtipo,
                idbalance: idbalance,
                idsubtipobalance: idsubtipobalance


            },
            failure: function(form, action) {
                myMask.hide();
                responseData = action.result;
                if (responseData.codMsgA == 1) {
                    if (!apli) {
                        Ext.getCmp('winAddModComun').close();
                    }
                    if (responseData.mensaje == 'add' && gestor == 'tipos') {
                        mostrarMensaje(1, 'El tipo de balance ha sido adicionado satisfactoriamente.');
                    }
                    else if (responseData.mensaje == 'add' && gestor == 'subtipos') {
                        mostrarMensaje(1, 'El subtipo de balance ha sido adicionado satisfactoriamente.');
                    }
                    else if (responseData.mensaje == 'add' && gestor == 'balances') {
                        mostrarMensaje(1, 'El balance ha sido adicionado satisfactoriamente.');
                    }
                    else if (action.result.mensaje == 'mod' && gestor == 'tipos') {
                        mostrarMensaje(1, 'El tipo de balance ha sido modificado satisfactoriamente.');
                    }
                    else if (action.result.mensaje == 'mod' && gestor == 'subtipos') {
                        mostrarMensaje(1, 'El subtipo de balance ha sido modificado satisfactoriamente.');
                    }
                    else if (action.result.mensaje == 'mod' && gestor == 'balances') {
                        mostrarMensaje(1, 'El balance ha sido modificado satisfactoriamente.');
                    }
                    recargaComun();
                    fpComun.getForm().reset();
                }
                else if (responseData.codMsgA == 3) {
                    mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.msgDenominacion);
            }
        })
    }
}

function eliminarComun()
{
    if (gestor == 'tipos') {
        mostrarMensaje(2, '¿Está seguro que quiere eliminar el tipo de balance deseado?', elimina);
    } else if (gestor == 'subtipos') {
        mostrarMensaje(2, '¿Está seguro que quiere eliminar el subtipo de balance deseado?', elimina);
    } else {
        mostrarMensaje(2, '¿Está seguro que quiere eliminar el balance deseado?', elimina);
    }

    function elimina(btnPresionado) {
        if (btnPresionado == 'ok') {
            myMask.show();
            Ext.Ajax.request({
                url: urlDelComun,
                params: (parametroEliminar()),
                callback: function(options, success, response) {
                    myMask.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgE == 1 && gestor == 'tipos') {
                        mostrarMensaje(1, 'El tipo de balance ha sido eliminado satisfactoriamente.');
                    }
                    else if (responseData.codMsgE == 1 && gestor == 'subtipos') {
                        mostrarMensaje(1, 'El subtipo de balance ha sido eliminado satisfactoriamente.');
                    }
                    else if (responseData.codMsgE == 1 && gestor == 'balances') {
                        mostrarMensaje(1, 'El balance ha sido eliminado satisfactoriamente.');
                    }
                    else if (responseData.codMsgE == 3) {
                        mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                    }
                    else
                        mostrarMensaje(3, perfil.etiquetas.msgUtilizado);
                    recargaComun();
                }
            }
            );
        }
    }

}
