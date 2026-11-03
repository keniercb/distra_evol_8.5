if (winReporte1)
    winReporte1.destroy();
{
    CrearWinReporte1();
}
EscogerReporte();

function EscogerReporte()
{

    switch (reporte) {
        case 1:

            {
                Ext.getCmp('cbEjercicio').enable();
                Ext.getCmp('cbGasto').disable();
                Ext.getCmp('cbNivel').enable();
                Ext.getCmp('txforganoD').enable();
                Ext.getCmp('cbCB').enable();
                Ext.getCmp('cbVia').enable();
                Ext.getCmp('cbOACE').disable();
                Ext.getCmp('cbSector').disable();

                Ext.getCmp('IcbEjercicio').show();
                Ext.getCmp('IcbGasto').hide();
                Ext.getCmp('IcbNivel').show();
                Ext.getCmp('ItxforganoD').show();
                Ext.getCmp('IcbPlanes').show();
                Ext.getCmp('IcbCB').show();
                Ext.getCmp('IcbVia').show();
                Ext.getCmp('IcbOACE').hide();
                Ext.getCmp('IcbSector').hide();
            }
            break;
        case 2:
            {
                Ext.getCmp('cbEjercicio').enable();
                Ext.getCmp('cbGasto').disable();
                Ext.getCmp('cbNivel').enable();
                Ext.getCmp('txforganoD').enable();
                Ext.getCmp('cbCB').enable();
                Ext.getCmp('cbVia').disable();
                Ext.getCmp('cbOACE').enable();
                Ext.getCmp('cbSector').enable();

                Ext.getCmp('IcbEjercicio').show();
                Ext.getCmp('IcbGasto').hide();
                Ext.getCmp('IcbNivel').show();
                Ext.getCmp('ItxforganoD').show();
                Ext.getCmp('IcbPlanes').show();
                Ext.getCmp('IcbCB').show();
                Ext.getCmp('IcbVia').hide();
                Ext.getCmp('IcbOACE').show();
                Ext.getCmp('IcbSector').show();
            }
            break;
        case 3:
            {
                Ext.getCmp('cbEjercicio').enable();
                Ext.getCmp('cbGasto').enable();
                Ext.getCmp('cbNivel').disable();
                Ext.getCmp('txforganoD').enable();
                Ext.getCmp('cbCB').enable();
                Ext.getCmp('cbVia').disable();
                Ext.getCmp('cbOACE').disable();
                Ext.getCmp('cbSector').disable();

                Ext.getCmp('IcbEjercicio').show();
                Ext.getCmp('IcbGasto').show();
                Ext.getCmp('IcbNivel').hide();
                Ext.getCmp('ItxforganoD').show();
                Ext.getCmp('IcbPlanes').show();
                Ext.getCmp('IcbCB').show();
                Ext.getCmp('IcbVia').hide();
                Ext.getCmp('IcbOACE').hide();
                Ext.getCmp('IcbSector').hide();
            }
            break;
        case 4:
            {
                Ext.getCmp('cbEjercicio').enable();
                Ext.getCmp('cbGasto').disable();
                Ext.getCmp('cbNivel').enable();
                Ext.getCmp('txforganoD').enable();
                Ext.getCmp('cbCB').enable();
                Ext.getCmp('cbVia').enable();
                Ext.getCmp('cbOACE').enable();
                Ext.getCmp('cbSector').disable();

                Ext.getCmp('IcbEjercicio').show();
                Ext.getCmp('IcbGasto').hide();
                Ext.getCmp('IcbNivel').show();
                Ext.getCmp('ItxforganoD').show();
                Ext.getCmp('IcbPlanes').show();
                Ext.getCmp('IcbCB').show();
                Ext.getCmp('IcbVia').show();
                Ext.getCmp('IcbOACE').show();
                Ext.getCmp('IcbSector').hide();
            }
            break;
    }

    winReporte1.show();
}

function CrearWinReporte1() {
    //TExfield que va a lebantar la ventana del treepanel .

    txforganoD = new Ext.form.TextField({
        id: 'txforganoD',
        readOnly: true,
        disabled: false,
        fieldLabel: perfil.etiquetas.lbOrganoDemandante,
        xtype: 'textfield',
        allowBlank: true,
        anchor: '100%',
        listeners: {
            focus: function() {
                ConstruirWinArbolOrgDemandante();
            }
        }


    });



    stEjercicio = new Ext.data.Store({
        url: 'listarEjercicios',
        id: 'idstEjercicio',
        autoLoad: false,
        reader: new Ext.data.JsonReader({}, [{
                name: 'ejercicio'
            }, {
                name: 'idejercicio'
            }])
    });

    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stEjercicio,
        displayField: 'ejercicio',
        valueField: 'idejercicio',
        fieldLabel: perfil.etiquetas.lbEjercicio,
        mode: 'remote',
        anchor: '95%',
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        allowBlank: false,
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            select: function(combo, record, index) {
                Ext.getCmp('cbPlanes').enable();
            }
        }

    });

    stGasto = [[1, 'Capital'], [2, 'Corriente']];

    cbGasto = new Ext.form.ComboBox({
        id: 'cbGasto',
        store: stGasto,
        fieldLabel: perfil.etiquetas.lbGasto,
        mode: 'remote',
        anchor: '95%',
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione

    });

    stNivel = new Ext.data.Store({
        url: 'listarNivel',
        id: 'idstNivel',
        autoLoad: false,
        reader: new Ext.data.JsonReader({
            id: 'value',
            root: 'data'
        },
        [{
                name: 'idnivelarbol'
            }, {
                name: 'nivelarbol'
            }])
    });

    cbNivel = new Ext.form.ComboBox({
        id: 'cbNivel',
        store: stNivel,
        valueField: 'idnivelarbol',
        displayField: 'nivelarbol',
        fieldLabel: perfil.etiquetas.lbNivel,
        mode: 'remote',
        anchor: '95%',
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione

    });


    stPlanes = new Ext.data.Store({
        id: 'idstPlanes',
        url: 'obtenerPlanesPorEjercicio',
        autoLoad: false,
        reader: new Ext.data.JsonReader({}, [{
                name: 'denominacion'
            }, {
                name: 'idmodelo'
            }]),
        listeners: {
            beforeload: function(st, opt) {
                st.baseParams.idejercicio = Ext.getCmp('cbEjercicio').getValue();

            }
        }
    });

    cbPlanes = new Ext.ux.form.LovCombo({
        xtype: 'combo',
        id: 'cbPlanes',
        disabled: true,
        store: stPlanes,
        displayField: 'denominacion',
        valueField: 'idmodelo',
        listWidth: 250,
        fieldLabel: perfil.etiquetas.lbPlan,
        mode: 'remote',
        anchor: '95%',
        typeAhead: true,
        triggerAction: 'all',
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            select: function(combo, record, index) {

            }
        }

    });



    stCB = new Ext.data.Store({
        url: 'listarCentrobalance',
        id: 'idstCB',
        autoLoad: false,
        reader: new Ext.data.JsonReader({}, [{
                name: 'denominacion'
            }, {
                name: 'identidad'
            }])
    });

    cbCB = new Ext.ux.form.LovCombo({
        xtype: 'combo',
        id: 'cbCB',
        store: stCB,
        displayField: 'denominacion',
        valueField: 'identidad',
        listWidth: 250,
        fieldLabel: perfil.etiquetas.lbCB,
        readOnly: true,
        mode: 'remote',
        anchor: '95%',
        typeAhead: true,
        triggerAction: 'all',
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione

    });




    stVia = new Ext.data.Store({
        url: 'listarViasadquisicion',
        id: 'idstVia',
        autoLoad: false,
        reader: new Ext.data.JsonReader({}, [{
                name: 'denominacion'
            }, {
                name: 'idviaadquisicion'
            }])
    });
    cbVia = new Ext.ux.form.LovCombo({
        xtype: 'combo',
        id: 'cbVia',
        store: stVia,
        displayField: 'denominacion',
        valueField: 'idviaadquisicion',
        fieldLabel: perfil.etiquetas.lbVia,
        listWidth: 250,
        mode: 'remote',
        anchor: '95%',
        typeAhead: true,
        triggerAction: 'all',
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione

    });

    stOACE = new Ext.data.Store({
        url: 'listarOACE',
        id: 'idstOACE',
        autoLoad: false,
        reader: new Ext.data.JsonReader({}, [{
                name: 'denominacion'
            }, {
                name: 'idorganosatisface'
            }])
    });

    cbOACE = new Ext.form.ComboBox({
        id: 'cbOACE',
        store: stOACE,
        displayField: 'denominacion',
        valueField: 'idorganosatisface',
        listWidth: 250,
        fieldLabel: perfil.etiquetas.lbOACE,
        readOnly: true,
        mode: 'remote',
        anchor: '95%',
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione

    });

    stSector = new Ext.data.Store({
        url: 'listarSR',
        id: 'idstSector',
        autoLoad: false,
        reader: new Ext.data.JsonReader({}, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'nom_datosnomenclador_denominacion'
            }])
    });


    cbSector = new Ext.form.ComboBox({
        id: 'cbSector',
        store: stSector,
        displayField: 'nom_datosnomenclador_denominacion',
        valueField: 'iddatosnomenclador',
        listWidth: 250,
        fieldLabel: perfil.etiquetas.lbSector,
        readOnly: true,
        mode: 'remote',
        anchor: '95%',
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        loadingText: perfil.etiquetas.lbCargando,
        emptyText: perfil.etiquetas.lbSeleccione

    });

    fpReporte1 = new Ext.FormPanel({
        id: 'fpReporte1',
        enableKeyEvents: true,
        frame: true,
        autoHeight: true,
        autoWidth: true,
        labelAlign: 'top',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: .33,
                        id: 'IcbEjercicio',
                        layout: 'form',
                        bodyStyle: 'padding:5px 5px 5px',
                        items: [cbEjercicio]
                    }, {
                        columnWidth: .33,
                        id: 'IcbGasto',
                        layout: 'form',
                        bodyStyle: 'padding:5px 5px 5px',
                        items: [cbGasto]
                    }, {
                        columnWidth: .33,
                        id: 'IcbNivel',
                        layout: 'form',
                        bodyStyle: 'padding:5px 5px 5px',
                        items: [cbNivel]
                    }, {
                        columnWidth: .33,
                        id: 'ItxforganoD',
                        layout: 'form',
                        bodyStyle: 'padding:5px 5px 5px',
                        items: [txforganoD]
                    }, {
                        columnWidth: .33,
                        id: 'IcbPlanes',
                        layout: 'form',
                        bodyStyle: 'padding:5px 5px 5px',
                        items: [cbPlanes]
                    }, {
                        columnWidth: .33,
                        id: 'IcbCB',
                        layout: 'form',
                        bodyStyle: 'padding:5px 5px 5px',
                        items: [cbCB]
                    }, {
                        columnWidth: .33,
                        id: 'IcbVia',
                        layout: 'form',
                        bodyStyle: 'padding:5px 5px 5px',
                        items: [cbVia]
                    }, {
                        columnWidth: .33,
                        id: 'IcbOACE',
                        layout: 'form',
                        bodyStyle: 'padding:5px 5px 5px',
                        items: [cbOACE]
                    }, {
                        columnWidth: .33,
                        id: 'IcbSector',
                        layout: 'form',
                        bodyStyle: 'padding:5px 5px 5px',
                        items: [cbSector]
                    }]
            }]
    });

    btnAceptar = new Ext.Button({
        id: 'btnAceptar',
        icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'btn',
        text: perfil.etiquetas.lbBtnAceptar,
        handler: function() {
            envioDatos();
        }
    });

    btnCancelar = new Ext.Button({
        id: 'btnCancelar',
        icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'btn',
        text: perfil.etiquetas.lbBtnCancelar,
        handler: function() {
            winReporte1.hide();
        }
    });

    winReporte1 = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        title: perfil.etiquetas.titReporte1,
        layout: 'fit',
        constrain: true,
        width: 450,
        autoHeight: true,
        items: [fpReporte1],
        buttons: [btnCancelar, btnAceptar]
    });



}

function envioDatos() {
    if (fpReporte1.getForm().isValid()) {
        switch (reporte) {

            case 1:

                {
                    idejercicio = Ext.getCmp('cbEjercicio').getValue();
                    idnivel = Ext.getCmp('cbNivel').getValue();
                    idplanes = Ext.getCmp('cbPlanes').getCheckedValue();
                    idcentrobalance = Ext.getCmp('cbCB').getValue();
                    idvia = Ext.getCmp('cbVia').getValue();
                    mostrarMensaje(1, 'Se configuró el reporte satisfactoriamente.', function() {
                        winReporte1.hide();
                        btnEjecutar.enable();
                    })
                }
                break;
            case 2:
                {
                    idejercicio = Ext.getCmp('cbEjercicio').getValue();
                    idnivel = Ext.getCmp('cbNivel').getValue();
                    idplanes = Ext.getCmp('cbPlanes').getValue();
                    idcentrobalance = Ext.getCmp('cbCB').getValue();
                    idoace = Ext.getCmp('cbOACE').getValue();
                    idsector = Ext.getCmp('cbSector').getValue();
                    mostrarMensaje(1, 'Se configuró el reporte satisfactoriamente.', function() {
                        winReporte1.hide();
                        btnEjecutar.enable();
                    })
                }
                break;
            case 3:
                {
                    idejercicio = Ext.getCmp('cbEjercicio').getValue();
                    idtipogasto = Ext.getCmp('cbGasto').getValue();
                    idplanes = Ext.getCmp('cbPlanes').getValue();
                    idcentrobalance = Ext.getCmp('cbCB').getValue();
                    mostrarMensaje(1, 'Se configuró el reporte satisfactoriamente.', function() {
                        winReporte1.hide();
                        btnEjecutar.enable();
                    })

                }
                break;
            case 4:
                {
                    idejercicio = Ext.getCmp('cbEjercicio').getValue();
                    idnivel = Ext.getCmp('cbNivel').getValue();
                    idplanes = Ext.getCmp('cbPlanes').getValue();
                    idcentrobalance = Ext.getCmp('cbCB').getValue();
                    idvia = Ext.getCmp('cbVia').getValue();
                    idoace = Ext.getCmp('cbOACE').getValue();
                    mostrarMensaje(1, 'Se configuró el reporte satisfactoriamente.', function() {
                        winReporte1.hide();
                        btnEjecutar.enable();
                    })

                }
                break;


        }
    } else
        mostrarMensaje(3, 'Por favor verifique, hay campos con valores incorrectos o vacíos.')
}


