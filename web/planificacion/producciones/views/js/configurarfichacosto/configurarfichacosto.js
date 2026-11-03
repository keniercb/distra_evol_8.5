var perfil = eval(uneval(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = {};
UCID.portal.cargarEtiquetas('configurarfichacosto', preCargarInterfaz);
offsetNaturalezaFicha = 0;
offsetFicha = 0;
offsetAutor = 0;
autorficha = null;

function preCargarInterfaz() {
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando
    });
    stNaturalezaFicha = new Ext.data.Store({
        url: 'listarnaturalezasficha',
        id: 'stNaturalezaFicha',
        autoLoad: false,
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'naturaleza'
        }, [{
            name: 'naturaleza'
        }, {
            name: 'denominacion'
        }]),

        listeners: {
            beforeload: function () {
                stNaturalezaFicha.baseParams.start = offsetNaturalezaFicha;

                cambiarTituloFiltrar(gpAddNaturaleza, filtrosNaturaleza, perfil.etiquetas.lbNaturalezas);

            }, load: function () {
                smAddNaturaleza.clearSelections();
            }
        }
    });

    stNaturaleza = new Ext.data.Store({
        url: 'listarnaturalezas',
        id: 'stNaturaleza',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'naturaleza'
        }, [{
            name: 'naturaleza'
        }, {
            name: 'denominacion'
        }]),
        listeners: {
            load: function () {
                stDatosNomConcepto.reload();

            }
            , beforeload: function () {

            }
        }
    });


    stFichaCosto = new Ext.data.Store({
        url: 'listarfichacosto',
        id: 'stFichaCosto',
        //autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idfichacosto'
        }, [{
            name: 'idfichacosto'
        }, {
            name: 'iddatosnomenclador'
        }, {
            name: 'idnaturaleza'
        }]), listeners: {
            beforeload: function () {
                stFichaCosto.baseParams.start = offsetFicha;
                cambiarTituloFiltrar(gpFichacosto, filtrosFicha, perfil.etiquetas.TitConfNaturalezas);
            }, load: function () {

            }
        }
    });
    stAutorFicha = new Ext.data.Store({
        url: 'listarautorficha',
        id: 'stAutorFicha',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'iddatosautorficha'
        }, [{
            name: 'iddatosautorficha'
        }, {
            name: 'empresasubordinada'
        }, {
            name: 'confeccionada'
        }, {
            name: 'aprobada'
        }, {
            name: 'cargoconf'
        }, {
            name: 'cargoaprob'
        }, {
            name: 'telefonoaprob'
        }, {
            name: 'telefonoconf'
        }]), listeners: {
            beforeload: function () {
                stAutorFicha.baseParams.start = offsetAutor;
                cambiarTituloFiltrar(gpAutorFichacosto, filtrosAutor, perfil.etiquetas.TitConfAutorFicha);
            }, load: function () {

            }
        }
    });
    stDatosNomConcepto = new Ext.data.Store({
        url: 'listardatnomconceptos',
        id: 'stDatosNomConcepto',
        // autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'iddatosnomenclador'
        }, [{
            name: 'iddatosnomenclador'
        }, {
            name: 'uridatosnomenclador'
        }, {
            name: 'denominacion'
        }, {
            name: 'idtiponomenclador'
        }])
        ,
        listeners: {
            load: function () {
                stFichaCosto.reload();
                stAutorFicha.reload();
            }
        }
    });

    btnAyuda = new Ext.Toolbar.Button({
        id: 'btnAyudaFichaCostoa',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbBtnAyudaCtTtip
    });

    cmFichaCosto = new Ext.grid.ColumnModel([

        {
            header: "Naturaleza",
            width: 200,
            sortable: true,
            dataIndex: 'idnaturaleza',
            renderer: renderNaturaleza
        },
        {
            header: "Nomenclador de Gasto",
            width: 250,
            sortable: true,
            dataIndex: 'iddatosnomenclador',
            renderer: renderDatosNomConcepto,
            editor: new Ext.form.ComboBox({
                id: 'cbNomencladorGasto',
                xtype: 'combo',
                emptyText: perfil.etiquetas.lbSeleccione,
                store: stDatosNomConcepto,
                valueField: 'iddatosnomenclador',
                hiddenName: 'iddatosnomenclador',
                displayField: 'denominacion',
                anchor: '93%',
                allowBlank: true,
                enableKeyEvents: true,
                mode: 'local',
                typeAhead: true,
                triggerAction: 'all'
            })
        }
    ]);
    smFichaCosto = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function () {
                var selected = smFichaCosto.getSelections();
                if (selected.length > 0) {
                    btnEliminarRelNaturaleza.enable();
                }
            }, rowdeselect: function () {
                var selected = smFichaCosto.getSelections();
                if (selected.length == 0) {
                    btnEliminarRelNaturaleza.disable();
                }
            }
        }
    });
    checkAddNaturaleza = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });
    cmAddNaturaleza = new Ext.grid.ColumnModel([checkAddNaturaleza,
        new Ext.grid.RowNumberer(), {
            header: "Denominación",
            width: 250,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }

    ]);
    smAddNaturaleza = new Ext.grid.RowSelectionModel({
        id: 'smAddNaturaleza',
        singleSelect: false,
        listeners: {
            rowselect: function () {
                var selected = smAddNaturaleza.getSelections();
                if (selected.length > 0) {
                    btnAplicarAddNaturaleza.enable();
                    btnAceptarAddNaturaleza.enable();
                }
            }, rowdeselect: function () {
                var selected = smAddNaturaleza.getSelections();
                if (selected.length == 0) {
                    btnAplicarAddNaturaleza.disable();
                    btnAceptarAddNaturaleza.disable();
                }
            }
        }
    });


    btnAceptarAddNaturaleza = new Ext.Button({
        id: 'btnAceptarAddNaturaleza',
        iconCls: 'aceptar',
        disabled: true,
        text: perfil.etiquetas.lbAceptar,
        tooltip: perfil.etiquetas.lbBtnAceptarTtip,
        handler: function () {
            crearRelNaturaleza(false);
        }
    });
    btnCancelarAddNaturaleza = new Ext.Button({
        id: 'btnAceptarNaturaleza',
        iconCls: 'cancelar',
        text: perfil.etiquetas.lbCancelar,
        tooltip: perfil.etiquetas.lbCancelar,
        handler: function () {
            winAddNaturaleza.hide();
        }
    });
    btnAplicarAddNaturaleza = new Ext.Button({
        id: 'btnAplicarAddNaturaleza',
        iconCls: 'aplicar',
        disabled: true,
        text: perfil.etiquetas.lbAplicar,
        tooltip: perfil.etiquetas.msgGuardarSinCerrar,
        handler: function () {
            crearRelNaturaleza(true);
        }
    });
    filtrosNaturaleza = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'naturaleza'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    btnLimpiarNaturaleza = new Ext.Button({
        id: 'btnLimpiarNaturaleza',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosNaturaleza.clearFilters();
        }
    });
    gpAddNaturaleza = new Ext.grid.GridPanel({
        title: perfil.etiquetas.lbNaturalezas,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        store: stNaturalezaFicha,
        cm: cmAddNaturaleza,
        sm: smAddNaturaleza,
        buttons: [btnAceptarAddNaturaleza, btnAplicarAddNaturaleza, btnCancelarAddNaturaleza],
        plugins: filtrosNaturaleza,
        listeners: {
            select: function (r) {

            }
        },
        bbar: new Ext.PagingToolbar({
            store: stNaturalezaFicha,
            displayInfo: true,
            items: ['-', btnLimpiarNaturaleza],
            listeners: {
                beforechange: function (p, e) {
                    offsetNaturalezaFicha = e.start;
                }
            }

        })
    });
    winAddNaturaleza = new Ext.Window({

        id: 'winAddNaturaleza',
        title: perfil.etiquetas.TtlwinAddNaturaleza,
        modal: true,
        closeAction: 'hide',
        width: 450,
        layout: 'fit',
        resizable: false,
        items: [gpAddNaturaleza],
        height: 600
    });
    btnAddRelNaturaleza = new Ext.Button({
        id: 'btnAddRelNaturaleza',
        iconCls: 'adicionar',
        text: perfil.etiquetas.lbBtnAdd,
        tooltip: perfil.etiquetas.lbBtnAddRelNaturalezaTtip,
        handler: function () {
            stNaturalezaFicha.reload();
            winAddNaturaleza.show();
        }
    });
    btnGuardarRelNaturaleza = new Ext.Button({
        id: 'btnGuardarRelNaturaleza',
        disabled: true,
        iconCls: 'guardar',
        text: perfil.etiquetas.lbBtnGuardar,
        tooltip: perfil.etiquetas.lbBtnGuardarRelNaturalezaTtip,
        handler: function () {
            guardarConfig();
        }
    });
    btnEliminarRelNaturaleza = new Ext.Button({
        id: 'btnEliminarRelNaturaleza',
        iconCls: 'eliminar',
        disabled: true,
        text: perfil.etiquetas.lbBtnEliminar,
        tooltip: perfil.etiquetas.lbBtnEliminarRelNaturalezaTtip,
        handler: function () {
            eliminarRelFicha();
        }
    });
    btnAddAutorFicha = new Ext.Button({
        id: 'btnAddAutorFicha',
        iconCls: 'adicionar',
        text: perfil.etiquetas.lbBtnAdd,
        tooltip: perfil.etiquetas.lbBtnAddAutorFichaTtip,
        handler: function () {
            crearVentanaAddMod();
            winAddAutorFicha.setTitle(perfil.etiquetas.lbBtnAdd + perfil.etiquetas.TtlwinAddAutorFicha);
            winAddAutorFicha.show();
        }
    });
    btnModAutorFicha = new Ext.Button({
        id: 'btnModAutorFicha',
        iconCls: 'modificar',
        text: perfil.etiquetas.lbBtnModificar,
        tooltip: perfil.etiquetas.lbBtnModificarAutorFichaTtip,
        disabled: true,
        handler: function () {
            crearVentanaAddMod();
            winAddAutorFicha.setTitle(perfil.etiquetas.lbBtnModificar + perfil.etiquetas.TtlwinAddAutorFicha);
            modificarAutor();
        }
    });
    btnGuardarAutorFicha = new Ext.Button({
        id: 'btnGuardarAutorFicha',
        disabled: true,
        iconCls: 'guardar',
        text: perfil.etiquetas.lbBtnGuardar,
        tooltip: perfil.etiquetas.lbBtnGuardarRelNaturalezaTtip,
        handler: function () {
            guardarConfig();
        }
    });
    btnEliminarAutorFicha = new Ext.Button({
        id: 'btnEliminarAutorFicha',
        iconCls: 'eliminar',
        disabled: true,
        text: perfil.etiquetas.lbBtnEliminar,
        tooltip: perfil.etiquetas.lbBtnEliminarAutorFichaTtip,
        handler: function () {
            eliminarAutorFicha();
        }
    });
    btnLimpiarFichacosto = new Ext.Button({
        id: 'btnLimpiarFichacosto',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosFicha.clearFilters();
        }
    });
    btnLimpiarAutorFicha = new Ext.Button({
        id: 'btnLimpiarAutorFicha',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosAutor.clearFilters();
        }
    });
    filtrosFicha = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'listado',
                dataIndex: 'idnaturaleza',
                valueFieldcb: 'naturaleza',
                displayFieldcb: 'denominacion',
                st: stNaturaleza,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'iddatosnomenclador',
                valueFieldcb: 'iddatosnomenclador',
                displayFieldcb: 'denominacion',
                st: stDatosNomConcepto,
                autoload: false,
                mode: 'local'
            }]
    });
    filtrosAutor = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'empresasubordinada'
            }, {
                type: 'string',
                dataIndex: 'confeccionada'
            },
            {
                type: 'string',
                dataIndex: 'cargoconf'
            }, {
                type: 'string',
                dataIndex: 'telefonoconf'
            }, {
                type: 'string',
                dataIndex: 'aprobada'
            }, {
                type: 'string',
                dataIndex: 'aprobador'
            }, {
                type: 'string',
                dataIndex: 'cargoaprob'
            }, {
                type: 'string',
                dataIndex: 'telefonoaprob'
            }]
    });
    gpFichacosto = new Ext.grid.EditorGridPanel({
        layout: 'fit',
        region: 'west',
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        title: perfil.etiquetas.TitConfNaturalezas,
        plugins: filtrosFicha,
        store: stFichaCosto,
        cm: cmFichaCosto,
        sm: smFichaCosto,
        clicksToEdit: 2,
        tbar: [btnAddRelNaturaleza, btnGuardarRelNaturaleza, btnEliminarRelNaturaleza],
        bbar: new Ext.PagingToolbar({
            store: stFichaCosto,
            displayInfo: true,
            items: ['-', btnLimpiarFichacosto],
            listeners: {
                beforechange: function (p, e) {
                    offsetFicha = e.start;
                }

            }
        }),
        listeners: {
            afteredit: function (e) {
                btnGuardarRelNaturaleza.enable();
            }
        }
    });
    cmAutorFicha = new Ext.grid.ColumnModel([

        {
            header: "Subordinada a",
            width: 200,
            sortable: true,
            dataIndex: 'empresasubordinada',
            renderer: crearToolTip
        },
        {
            header: "Confeccionado por",
            width: 200,
            sortable: true,
            dataIndex: 'confeccionada',
            renderer: crearToolTip
        },
        {
            header: "Cargo del confeccionador",
            width: 200,
            sortable: true,
            dataIndex: 'cargoconf',
            renderer: crearToolTip
        },
        {
            header: "Teléfono del confeccionador",
            width: 200,
            sortable: true,
            dataIndex: 'telefonoconf',
            renderer: crearToolTip
        },
        {
            header: "Aprobado por",
            width: 200,
            sortable: true,
            dataIndex: 'aprobada',
            renderer: crearToolTip
        }, {
            header: "Cargo del aprobador",
            width: 200,
            sortable: true,
            dataIndex: 'cargoaprob',
            renderer: crearToolTip
        },
        {
            header: "Teléfono del aprobador",
            width: 200,
            sortable: true,
            dataIndex: 'telefonoaprob',
            renderer: crearToolTip
        }
    ]);
    smAutorFicha = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function () {
                var selected = smAutorFicha.getSelections();
                if (selected.length > 0) {
                    btnEliminarAutorFicha.enable();
                    if (selected.length == 1) {
                        btnModAutorFicha.enable();
                    } else {
                        btnModAutorFicha.disable();
                    }
                }
            }, rowdeselect: function () {
                var selected = smAutorFicha.getSelections();
                if (selected.length == 0) {
                    btnEliminarAutorFicha.disable();
                }
                if (selected.length == 1) {
                    btnModAutorFicha.enable();
                } else {
                    btnModAutorFicha.disable();
                }
            }
        }
    });
    gpAutorFichacosto = new Ext.grid.GridPanel({
        layout: 'fit',
        region: 'center',
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        title: perfil.etiquetas.TitConfAutorFicha,
        plugins: filtrosAutor,
        store: stAutorFicha,
        cm: cmAutorFicha,
        sm: smAutorFicha,
        clicksToEdit: 2,
        tbar: [btnAddAutorFicha, btnModAutorFicha, btnEliminarAutorFicha],
        bbar: new Ext.PagingToolbar({
            store: stAutorFicha,
            displayInfo: true,
            items: ['-', btnLimpiarAutorFicha],
            listeners: {
                beforechange: function (p, e) {
                    offsetAutor = e.start;
                }

            }
        }),
        listeners: {}
    });

    pView = new Ext.Panel({
        id: 'pView',
        layout: 'border',
        tbar: ['->', btnAyuda],
        items: [gpFichacosto, gpAutorFichacosto]
    });
    vpFC = new Ext.Viewport({
        layout: 'fit',
        id: 'vpFC',
        items: [pView]
    });
}

function crearVentanaAddMod() {
    fpAutorFicha = new Ext.FormPanel({
            labelWidth: 75,
            frame: true,
            height: 200,
            labelAlign: 'top',
            labelWidth: 75,
            buttonAlign: 'right',
            items: [{

                layout: 'column',
                items: [{
                    columnWidth: 0.4,
                    layout: 'form',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: perfil.etiquetas.lbSubordinada,
                        id: 'subordinada',
                        regex: /^([a-zA-Z0-9áéíóúñüÑ]+?[a-zA-Z0-9áéíóúñüÑ]*|\s[a-zA-Z0-9áéíóúñüÑ]+)+$/,
                        maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ\.])$/,
                        regexText: perfil.etiquetas.lbregexText,
                        anchor: '95%',
                        maxLength: 100,
                        maxLengthText: perfil.etiquetas.lbMsgmaxLengthText,
                        allowBlank: false
                    }]
                }]

            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.4,
                    layout: 'form',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: perfil.etiquetas.lbConfeccionado,
                        id: 'confeccionado',
                        //regex: /^([a-zA-Z0-9áéíóúñüÑ]+?[a-zA-Z0-9áéíóúñüÑ]*|\.\s[a-zA-Z0-9áéíóúñüÑ]+|\s[a-zA-Z0-9áéíóúñüÑ]+)+$/, //para permitir los puntos de los titulos
                        //maskRe: /^([\.a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
                        regex: /^([a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9()_\-/,.])*$/,
                        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ ,./()_-])$/,
                        regexText: perfil.etiquetas.lbregexText,
                        anchor: '95%',
                        maxLength: 100,
                        maxLengthText: perfil.etiquetas.lbMsgmaxLengthText,
                        allowBlank: false
                    }]
                }, {
                    columnWidth: 0.4,
                    layout: 'form',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: perfil.etiquetas.lbCargo,
                        id: 'cargoConfeccionado',
                        //regex: /^([a-zA-Z0-9áéíóúñüÑ]+?[a-zA-Z0-9áéíóúñüÑ]*|\.\s[a-zA-Z0-9áéíóúñüÑ]+|\s[a-zA-Z0-9áéíóúñüÑ]+)+$/,
                        //maskRe: /^([\.a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
                        regex: /^([a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9()_\-/,.])*$/,
                        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ ,./()_-])$/,
                        regexText: perfil.etiquetas.lbregexText,
                        anchor: '95%',
                        maxLength: 100,
                        maxLengthText: perfil.etiquetas.lbMsgmaxLengthText,
                        allowBlank: false
                    }]

                }, {
                    columnWidth: 0.2,
                    layout: 'form',
                    items: [{
                        xtype: 'numberfield',
                        fieldLabel: perfil.etiquetas.lbTelefono,
                        id: 'telefonoConfeccionado',
                        anchor: '95%',
                        maxLength: 8,
                        maxValue: 99999999,
                        maxLengthText: perfil.etiquetas.lbMsgmaxLengthText,
                        allowBlank: true
                    }]

                }]

            }, {
                layout: 'column',
                items: [{
                    columnWidth: 0.4,
                    layout: 'form',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: perfil.etiquetas.lbAprobado,
                        id: 'aprobado',
                        //regex: /^([a-zA-Z0-9áéíóúñüÑ]+?[a-zA-Z0-9áéíóúñüÑ]*|\.\s[a-zA-Z0-9áéíóúñüÑ]+|\s[a-zA-Z0-9áéíóúñüÑ]+)+$/,
                        //maskRe: /^([\.a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
                        regex: /^([a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9()_\-/,.])*$/,
                        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ ,./()_-])$/,
                        regexText: perfil.etiquetas.lbregexText,
                        anchor: '95%',
                        maxLength: 100,
                        maxLengthText: perfil.etiquetas.lbMsgmaxLengthText,
                        allowBlank: false
                    }]
                }, {
                    columnWidth: 0.4,
                    layout: 'form',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: perfil.etiquetas.lbCargo,
                        id: 'cargoAprobado',
                        //regex: /^([a-zA-Z0-9áéíóúñüÑ]+?[a-zA-Z0-9áéíóúñüÑ]*|\.\s[a-zA-Z0-9áéíóúñüÑ]+|\s[a-zA-Z0-9áéíóúñüÑ]+)+$/,
                        //maskRe: /^([\.a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
                        regex: /^([a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9()_\-/,.])*$/,
                        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ ,./()_-])$/,
                        regexText: perfil.etiquetas.lbregexText,
                        anchor: '95%',
                        maxLength: 100,
                        maxLengthText: perfil.etiquetas.lbMsgmaxLengthText,
                        allowBlank: false
                    }]

                }, {
                    columnWidth: 0.2,
                    layout: 'form',
                    items: [{
                        xtype: 'numberfield',
                        fieldLabel: perfil.etiquetas.lbTelefono,
                        id: 'telefonoAprobado',
                        anchor: '95%',
                        maxLength: 8,
                        maxValue: 99999999,
                        maxLengthText: perfil.etiquetas.lbMsgmaxLengthText,
                        allowBlank: true
                    }]

                }]

            }]
            ,

            listeners: {
                'render':

                    function () {
                    }
            }
        }
    );
    fpAutorFicha.doLayout();
    winAddAutorFicha = new Ext.Window({
        title: perfil.etiquetas.lbBtnAdd + perfil.etiquetas.TtlwinAddAutorFicha,
        id: 'winAddAutorFicha',
        modal: true,
        closeAction: 'destroy',
        width: 600,
        layout: 'fit',
        resizable: false,
        items: [fpAutorFicha],
        height: 250,
        buttons: [{
            id: 'btnAceptarAutorFicha',
            iconCls: 'aceptar',
            text: perfil.etiquetas.lbAceptar,
            tooltip: perfil.etiquetas.lbBtnAceptarTtip,
            handler: function () {
                guardarConfigAutor();

            }
        }, {
            id: 'btnCancelarrAutorFicha',
            iconCls: 'cancelar',
            text: perfil.etiquetas.lbCancelar,
            tooltip: perfil.etiquetas.lbBtnCancelarTtip,
            handler: function () {
                winAddAutorFicha.close();

            }
        }]
    });
}

function modificarAutor() {
    recordsSel = smAutorFicha.getSelections();
    fpAutorFicha.findById('subordinada').setValue(recordsSel[0].data.empresasubordinada);
    fpAutorFicha.findById('confeccionado').setValue(recordsSel[0].data.confeccionada);
    fpAutorFicha.findById('cargoConfeccionado').setValue(recordsSel[0].data.cargoconf);
    fpAutorFicha.findById('telefonoConfeccionado').setValue(recordsSel[0].data.telefonoconf);
    fpAutorFicha.findById('aprobado').setValue(recordsSel[0].data.aprobada);
    fpAutorFicha.findById('cargoAprobado').setValue(recordsSel[0].data.cargoaprob);
    fpAutorFicha.findById('telefonoAprobado').setValue(recordsSel[0].data.telefonoaprob);
    autorficha = recordsSel[0].data.iddatosautorficha;
    fpAutorFicha.doLayout();
    winAddAutorFicha.show();

}

function guardarConfig() {
    recordsMod = stFichaCosto.getModifiedRecords();
    var confnaturaleza = [];
    for (i = 0; i < recordsMod.length; i++) {
        confnaturaleza.push(recordsMod[i].data)
    }


    Ext.Ajax.request({
        url: 'guardarConfiguracion',
        waitMsg: perfil.etiquetas.msgGuardarConf,
        params: {
            confnaturaleza: Ext.encode(confnaturaleza)
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN > 0) {
                mostrarMensaje(2, perfil.etiquetas.msgGuardarConfSi);
            } else {
                mostrarMensaje(2, perfil.etiquetas.msgGuardarConfSNo);
            }
            stFichaCosto.reload();
            btnGuardarRelNaturaleza.disable();

        }
    });


}

function crearToolTip(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}

function renderNaturaleza(value, m) {

    for (i = 0; i < stNaturaleza.data.length; i++) {

        if (stNaturaleza.data.items[i].data.hasOwnProperty('naturaleza') && stNaturaleza.data.items[i].data.naturaleza == value) {
            m.attr = 'ext:qtip="' + stNaturaleza.data.items[i].data.denominacion + '"';
            return stNaturaleza.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip=""';
    return '';
}

function renderDatosNomConcepto(value, m) {

    for (i = 0; i < stDatosNomConcepto.data.length; i++) {

        if (stDatosNomConcepto.data.items[i].data.hasOwnProperty('iddatosnomenclador') && stDatosNomConcepto.data.items[i].data.iddatosnomenclador == value) {
            m.attr = 'ext:qtip="' + stDatosNomConcepto.data.items[i].data.denominacion + '"';
            return stDatosNomConcepto.data.items[i].data.denominacion;
        }
    }
    m.attr = 'ext:qtip=""';
    return '';
}

function eliminarRelFicha() {
    mostrarMensaje(2, perfil.etiquetas.msgConfirmarEliminarRelacion, eliminarObjetoRelacion);

    function eliminarObjetoRelacion(btnPresionado) {
        if (btnPresionado == 'ok') {
            recordsAdd = smFichaCosto.getSelections();
            relFicha = [];
            if (recordsAdd.length > 0) {
                for (var i = 0; i < recordsAdd.length; i++) {
                    relFicha.push({
                        idfichacosto: recordsAdd[i].data.idfichacosto
                    });
                }
                mymask.show();
                Ext.Ajax.request({
                    url: 'eliminarrelacionficha',
                    params: {
                        relaciones: Ext.encode(relFicha)

                    },
                    callback: function (options, success, response) {
                        mymask.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgN) {

                            stFichaCosto.reload();
                            stNaturalezaFicha.reload();


                            mostrarMensaje(2, perfil.etiquetas.msgEliminarRelacionSi);
                        } else {
                            mostrarMensaje(2, perfil.etiquetas.msgEliminarRelacionNo);
                        }
                    }
                });
                smFichaCosto.clearSelections();

            }
        }


    }

}

function guardarConfigAutor() {
    mymask.show();
    Ext.Ajax.request({
        url: 'guardarconfautor',
        params: {
            iddatosautorficha: (null) ? undefined : autorficha,
            subordinada: Ext.getCmp('subordinada').getValue(),
            confeccionado: Ext.getCmp('confeccionado').getValue(),
            cargoConfeccionado: Ext.getCmp('cargoConfeccionado').getValue(),
            telefonoConfeccionado: Ext.getCmp('telefonoConfeccionado').getValue(),
            aprobado: Ext.getCmp('aprobado').getValue(),
            cargoAprobado: Ext.getCmp('cargoAprobado').getValue(),
            telefonoAprobado: Ext.getCmp('telefonoAprobado').getValue()

        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgN == 'add') {
                mostrarMensaje(2, perfil.etiquetas.msgAddAutorSi);
            } else if (responseData.codMsgN == 'update') {
                mostrarMensaje(2, perfil.etiquetas.msgUpdateAutorSi);
            } else {
                mostrarMensaje(2, perfil.etiquetas.msgAddUpdateAutorNo);
            }
            stAutorFicha.reload();
            winAddAutorFicha.close();
            autorficha = null;
        }
    });
    smAutorFicha.clearSelections();


}

function crearRelNaturaleza(apl) {
    recordsAdd = smAddNaturaleza.getSelections();
    naturalezasAdd = [];
    if (recordsAdd.length > 0) {
        for (var i = 0; i < recordsAdd.length; i++) {
            naturalezasAdd.push({
                idnaturaleza: recordsAdd[i].data.naturaleza
            });
        }
        mymask.show();
        Ext.Ajax.request({
            url: 'addnaturalezaficha',
            params: {
                naturalezas: Ext.encode(naturalezasAdd)

            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN > 0) {
                    stNaturalezaFicha.reload();
                    stFichaCosto.reload();
                    if (!apl) {
                        winAddNaturaleza.hide();
                    }
                    mostrarMensaje(2, perfil.etiquetas.msgAdicionarNaturalezaSi);
                } else {
                    mostrarMensaje(2, perfil.etiquetas.msgAdicionarNaturalezaNo);
                }
            }
        });
        smAddNaturaleza.clearSelections();

    }
}

function eliminarAutorFicha() {
    mostrarMensaje(2, perfil.etiquetas.msgConfirmarEliminarAutor, eliminarDatosAutor);

    function eliminarDatosAutor(btnPresionado) {
        if (btnPresionado == 'ok') {
            recordsSel = smAutorFicha.getSelections();
            iddatosautorficha = [];
            if (recordsSel.length > 0) {
                for (var i = 0; i < recordsSel.length; i++) {
                    iddatosautorficha.push({
                        iddatosautorficha: recordsSel[i].data.iddatosautorficha
                    });
                }

            }
            mymask.show();
            Ext.Ajax.request({
                url: 'eliminarconfautor',
                params: {
                    datosautorficha: Ext.encode(iddatosautorficha)

                },
                callback: function (options, success, response) {
                    mymask.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgN > 0) {
                        stAutorFicha.reload();
                        mostrarMensaje(2, perfil.etiquetas.msgEliminarFirmaSi);
                    } else {
                        mostrarMensaje(2, perfil.etiquetas.msgEliminarFirmaNo);
                    }

                }
            });
            smAutorFicha.clearSelections();

        }
    }
}

function cambiarTituloFiltrar(gridPanel, filtro, etiqueta) {
    var filtrado_por = perfil.etiquetas.lbFiltradoPor;
    var sep = "/";
    if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {
        gridPanel.setTitle(etiqueta);
    } else {
        for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
            var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
            if (i == filtro.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        gridPanel.setTitle(etiqueta + " - <i> " + filtrado_por + '</i>');
        filtrado_por = "";
    }
}
