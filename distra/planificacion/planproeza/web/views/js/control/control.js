//var perfil = eval(uneval(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('control', cargarInterfazPrincipalControl);
var nodoEntidadControl;
var usuario;
var denomEntidadSelecionada = "";
var offsetControlRector = 0, offsetControlProductor = 0, offsetControlProductorDesglose = 0, offsetControlEmpresa = 0,
        offsetControlEmpresaTaller = 0, offsetIndicadoresDemandaExtraPlan = 0, offsetAdicionarDesgloseDemandaExtraplan = 0,
        offsetPlanControlEmpresaTaller = 0;
var idusariologueado;
function cargarInterfazPrincipalControl() {
    stum = new Ext.data.Store({
        autoLoad: true,
        url: 'cargarUnidadMedida',
        id: 'stum',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idunidadmedida'
        }, [{
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }, {
                name: 'abreviaturaunidadmedida'
            }])
    });
    stUsuarios = new Ext.data.Store({
        url: 'cargarUsuarios',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idusuario'
        }, [{
                name: 'idusuario'
            }, {
                name: 'nombreusuario'
            }]),
        listeners: {
            load: function(t) {
               idusariologueado = t.reader.jsonData.idusariologueado;                
            }
        }
    });
    stEntidadesEjecutor = new Ext.data.Store({
        url: 'listarEntidadesDadoComp',
        id: 'stEntidadesEjecutor',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idestructura'
        }, [{
                name: 'idestructura'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            beforeload: function () {
                stEntidadesEjecutor.baseParams.comp = 'ejecutor';
            }
        }
    });
    stEntidadesEmpresa = new Ext.data.Store({
        url: 'listarEntidadesDadoComp',
        id: 'stEntidadesEmpresa',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idestructura'
        }, [{
                name: 'idestructura'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            beforeload: function () {
                stEntidadesEmpresa.baseParams.comp = 'organoempresarial';
            }
        }
    });
    stEntidadesCliente = new Ext.data.Store({
        url: 'listarEntidadesDadoComp',
        id: 'stEntidadesCliente',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idestructura'
        }, [{
                name: 'idestructura'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            beforeload: function () {
                stEntidadesCliente.baseParams.comp = 'organoconsumidor';
            }
        }
    });
    stPrograma = new Ext.data.Store({
        autoLoad: true,
        url: 'cargarProgramas',
        id: 'stPrograma',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'iddatosnomenclador'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }])
    });
    stDestino = new Ext.data.Store({
        autoLoad: true,
        url: 'cargarDestinos',
        id: 'stDestino',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'iddatosnomenclador'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }])
    });
    cargarControlFunciones();
    cargarControlProductor();
    cargarControlEmpresa();
    cargarControlRector();
    cargarInterfazControl();
}
function cargarInterfazControl() {
    var temp = window.location.pathname;
    var url = temp.substr(1);
    UCID.portal.cargarAccionesXUri(url);
    // Máscara común
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando
    });
    //Combo de los ejercicios
    stCbejercicioControl = new Ext.data.Store({
        url: 'cargarEjercicios',
        autoLoad: true,
        listeners: {
            load: function (t) {
                cbEjercicioControl.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                Ext.getCmp('editorFecha').setMinValue('01/01/' + cbEjercicioControl.getRawValue());
                Ext.getCmp('editorFecha').setMaxValue('31/12/' + cbEjercicioControl.getRawValue());
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'estado'
            }, {
                name: 'uridatosnomenclador'
            }, {
                name: 'denominacion'
            }])
    });
    cbEjercicioControl = new Ext.form.ComboBox({
        id: 'cbEjercicioControl',
        store: stCbejercicioControl,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        disabled: true,
        editable: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        width: 140,
        listeners: {
            select: function () {
                if (Ext.getCmp('tabPanelControl').getActiveTab().id == 'tabControlRector')
                    stControlRector.reload();
                if (Ext.getCmp('tabPanelControl').getActiveTab().id == 'tabControlEmpresa')
                    stControlEmpresa.reload();
                if (Ext.getCmp('tabPanelControl').getActiveTab().id == 'tabControlProductor')
                    stPlanControl.reload();
                Ext.getCmp('editorFecha').setMinValue('01/01/' + cbEjercicioControl.getRawValue());
                Ext.getCmp('editorFecha').setMaxValue('31/12/' + cbEjercicioControl.getRawValue());
            }
        }
    });
    //Combo de los comportamientos
    stTipoComportamientoControl = new Ext.data.Store({
        url: 'obtenerComportamientosControl',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idtipocomportamiento'
        }, [{
                name: 'idtipocomportamiento'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            beforeload: function () {
                mymask.show();
            },
            load: function () {
                if (stTipoComportamientoControl.getCount() != 0) {
                    cbComportamientoControl.setValue(stTipoComportamientoControl.getAt(0).get('idtipocomportamiento'));
                    cambiarPaneles(cbComportamientoControl.getValue());
                    if (cbComportamientoControl.getValue() == 1) {
                        //productor
                        stPlanControl.reload();
                    }
                    if (cbComportamientoControl.getValue() == 2) {
                        //empresa
                        stControlEmpresa.reload();
                    }
                    if (cbComportamientoControl.getValue() == 3) {
                        //rector
                        stControlRector.reload();
                    }
                } else {
                    Ext.getCmp('tabPanelControl').hide();
                    mostrarMensaje(2, perfil.etiquetas.msgEntidadNoOD);
                }
                mymask.hide();
            }
        }
    });
    cbComportamientoControl = new Ext.form.ComboBox({
        id: 'cbComportamientoControl',
        store: stTipoComportamientoControl,
        valueField: 'idtipocomportamiento',
        hiddenName: 'idtipocomportamiento',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        disabled: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        width: 140,
        listeners: {
            select: function () {
                cambiarPaneles(cbComportamientoControl.getValue());
                if (cbComportamientoControl.getValue() == 1) {
                    //productor
                    stPlanControl.reload();
                }
                if (cbComportamientoControl.getValue() == 2) {
                    //empresa
                    stControlEmpresa.reload();
                }
                if (cbComportamientoControl.getValue() == 3) {
                    //rector
                    stControlRector.reload();
                }
            }
        }
    });
    btnExportarControl = new Ext.Toolbar.MenuButton({
        id: 'btnExportarControl',
        disabled: true,
        tooltip: perfil.etiquetas.lbExportar,
        iconCls: 'exportar',
        menu: {
            items: [{
                    id: 'btnExportarControlEmpresa',
                    iconCls: 'exportar',
                    text: 'Exportar control de la empresa',
                    handler: function () {
                        window.open('exportarControlEmpresaTallerRector?identidad=' + nodoEntidadControl.id +
                                '&denoentidad=' + nodoEntidadControl.attributes.text +
                                '&idejercicio=' + cbEjercicioControl.getValue() +
                                '&denoejercicio=' + cbEjercicioControl.getRawValue() +
                                '&tipo=' + cbComportamientoControl.getValue() +
                                '&denotipo=' + cbComportamientoControl.getRawValue() +
                                '&panel=' + 'empresa' +
                                '&filtros=' + Ext.encode(filtrosControlEmpresa.getFilterData()));
                    }
                }, {
                    id: 'btnExportarControlRector',
                    iconCls: 'exportar',
                    //Rector
                    text: 'Exportar control',
                    handler: function () {
                        window.open('exportarControlEmpresaTallerRector?identidad=' + nodoEntidadControl.id +
                                '&denoentidad=' + nodoEntidadControl.attributes.text +
                                '&idejercicio=' + cbEjercicioControl.getValue() +
                                '&denoejercicio=' + cbEjercicioControl.getRawValue() +
                                '&tipo=' + cbComportamientoControl.getValue() +
                                '&denotipo=' + cbComportamientoControl.getRawValue() +
                                '&panel=' + 'rector' +
                                '&filtros=' + Ext.encode(filtrosControlRector.getFilterData()));
                    }
                }, {
                    id: 'btnExportarControlProductor',
                    iconCls: 'exportar',
                    text: 'Exportar control del ejecutor',
                    handler: function () {
                        window.open('exportarControlEmpresaTallerRector?identidad=' + nodoEntidadControl.id +
                                '&denoentidad=' + nodoEntidadControl.attributes.text +
                                '&idejercicio=' + cbEjercicioControl.getValue() +
                                '&denoejercicio=' + cbEjercicioControl.getRawValue() +
                                '&tipo=' + cbComportamientoControl.getValue() +
                                '&denotipo=' + cbComportamientoControl.getRawValue() +
                                '&panel=' + 'taller' +
                                '&filtros=' + Ext.encode(filtrosPlanControl.getFilterData()));
                    }
                }]
        }
    });
    //Panel de estructuras
    panelEntidadesControl = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false
            });
    panelEntidadesControl.btnBuscar.setText("");
    panelEntidadesControl.btnLimpiar.setText("");
    panelEntidadesControl = panelEntidadesControl.items.items[0];
    panelEntidadesControl.getRootNode().expand();
    panelEntidadesControl.split = true;
    panelEntidadesControl.region = 'west';
    panelEntidadesControl.width = 250;
    panelEntidadesControl.collapsible = true;
    panelEntidadesControl.getRootNode().attributes.text = perfil.etiquetas.lbEntidades;
    panelEntidadesControl.getRootNode().text = perfil.etiquetas.lbEntidades;
    panelEntidadesControl.addListener('click', function (n) {
        nodoEntidadControl = n;
        if (n.id != 'Estructuras') {
            denomEntidadSelecionada = ": " + n.attributes.denominacion;
            stTipoComportamientoControl.baseParams.identidad = nodoEntidadControl.id;
            stTipoComportamientoControl.reload();
        } else {
            Ext.getCmp('tabPanelControl').setActiveTab('tabDefecto');
            Ext.getCmp('tabDefecto').setTitle('Control');
        }
    });
    //TabPanel de control
    tabPanelControl = new Ext.TabPanel({
        activeTab: 3,
        id: 'tabPanelControl',
        region: 'center',
        disabled: true,
        plain: true,
        defaults: {autoScroll: true},
        tbar: [{
                xtype: 'tbtext',
                text: perfil.etiquetas.lbEjercicio + ': '
            }, cbEjercicioControl, {
                xtype: 'tbtext',
                text: perfil.etiquetas.lbComportamiento + ': '
            }, cbComportamientoControl, btnExportarControl, btnGestionarObservacion, btnGestionarObservacionEmpresa, btnGestionarObservacionRector],
        items: [{
                id: 'tabControlProductor',
                title: 'Control: ' + denomEntidadSelecionada,
                layout: 'fit',
                hidden: true,
                items: [panelControlProductor],
                listeners: {
                    activate: function () {
                        Ext.getCmp('tabControlProductor').setTitle('Control' + denomEntidadSelecionada);
                        btnGestionarObservacionEmpresa.hide();
                        btnGestionarObservacionRector.hide();
                        btnGestionarObservacion.show();
                        cbEjercicioControl.enable();
                        cbComportamientoControl.enable();
                        btnExportarControl.enable();
                    }
                }
            }, {
                id: 'tabControlEmpresa',
                title: 'Control: ' + denomEntidadSelecionada,
                layout: 'fit',
                hidden: true,
                items: [panelControlEmpresa],
                listeners: {
                    activate: function () {
                        Ext.getCmp('tabControlEmpresa').setTitle('Control' + denomEntidadSelecionada);
                        btnGestionarObservacion.hide();
                        btnGestionarObservacionRector.hide();
                        btnGestionarObservacionEmpresa.show();
                        cbEjercicioControl.enable();
                        cbComportamientoControl.enable();
                        btnExportarControl.enable();
                    }
                }
            },
            {
                id: 'tabControlRector',
                title: 'Control: ' + denomEntidadSelecionada,
                layout: 'fit',
                hidden: true,
                items: [panelControlRector],
                listeners: {
                    activate: function () {
                        Ext.getCmp('tabControlRector').setTitle('Control' + denomEntidadSelecionada);
                        btnGestionarObservacion.hide();
                        btnGestionarObservacionEmpresa.hide();
                        btnGestionarObservacionRector.show();
                        cbEjercicioControl.enable();
                        cbComportamientoControl.enable();
                        btnExportarControl.enable();
                    }
                }
            },
            {
                id: 'tabDefecto',
                disabled: true,
                layout: 'fit',
                listeners: {
                    activate: function () {
                        Ext.getCmp('tabDefecto').setTitle('Control');
                        cbEjercicioControl.disable();
                        cbComportamientoControl.disable();
                        btnExportarControl.disable();
                    }
                }
            }
        ]
    });
    panelGeneralControl = new Ext.Panel({
        id: 'panelGeneralControl',
        layout: 'border',
        items: [panelEntidadesControl, tabPanelControl]
    });
    viewControl = new Ext.Viewport({
        layout: 'fit',
        items: [panelGeneralControl]
    });

}
