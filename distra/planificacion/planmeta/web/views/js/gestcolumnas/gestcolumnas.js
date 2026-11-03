var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('gestcolumnas', cargarInterfaz);
var winAddColumnas;
var flag;
var cambio = 0, rsel;
var mensaje, mensaje1;
var accion_col;
var controlaraccion = 0;
var mensajeConfEliminar = false;


//inicio de cargar interfaz
function cargarInterfaz() {

    Ext.apply(Ext.form.VTypes, {
        validarEspaciosEnBlanco: function (value, field) {
            return (!(/^\s+|\s+$/.test(value)));
        },
        validarEspaciosEnBlancoText: 'No se admite el uso del espacio antes ni después del valor del campo.'
    });

    //Mascara para visualizar indistintamente
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando
    });
    btnAyuda = new Ext.Toolbar.Button({
        id: 'btnAyudaColumna',
        tabIndex: 6,
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtbtnAyu
    });
    btnAdd = new Ext.Toolbar.Button({
        id: 'btnAdd',
        tabIndex: 1,
        iconCls: 'adicionar',
        tooltip: perfil.etiquetas.lbTtbtnAdicionarColumna,
        handler: function() {
            accionAdicionar();
        }
    });
    btnMod = new Ext.Toolbar.Button({
        id: 'btnMod',
        tabIndex: 2,
        disabled: true,
        iconCls: 'modificar',
        tooltip: perfil.etiquetas.lbTtbtnModificarColumna,
        handler: function() {
            accionModificar();
        }
    });
    btnDel = new Ext.Toolbar.Button({
        id: 'btnDel',
        tabIndex: 3,
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.lbTtElimColumna,
        disabled: true,
        handler: function() {
            accionEliminar();
        }
    });
    btnAplicar = new Ext.Toolbar.Button({
        id: 'btnAplicar',
        iconCls: 'aplicar',
        text: perfil.etiquetas.lbBtnAplicar
    });

    btnLimpiar = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtLimpiar,
        id: 'btntodos',
        disabled: false,
        handler: function() {
            accionLimpiar();
        }

    });
    //***************************Filtros*********************************
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    filtroscolumnas = new Ext.grid.GridFilters({
        filters: [
            {
                id: 'denomcolumna',
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            },
            {
                type: 'list',
                dataIndex: 'enuso',
                options: [perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbNo]
            }]
    });

    /** **************** Fin de filtros por columna ************************ */
    //inicio del grid de datos
    stGridpcolumna = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: 'listarColumnas',
        listeners: {
            beforeload: function() {
                cambiarTituloFiltrarColumnas();
            },
            load: function() {
                siexistecolumFiltrada();
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idcolumna',
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'idcolumna'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'enuso'
            }])
    });

    menuConfig = new Ext.menu.Menu({
        id: 'menuConfig',
        listeners: {
        },
        items: [{
                text: 'Eliminar',
                iconCls: 'eliminar',
                id: 'mdEliminarColumna',
                tooltip: 'Eliminar colunma(s)',
                handler: function() {
                }
            }
        ]
    });
    smGridpcolumna = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function() {
                valordenominacion = smGridpcolumna.getSelected().get('denominacion');
                valordescripcion = smGridpcolumna.getSelected().get('descripcion');
                btnDel.enable();
                var long = smGridpcolumna.getSelections().length;
                if (long > 1) {
                    btnMod.disable();
                } else {
                    btnDel.enable();
                    btnMod.enable();
                    btnAdd.enable();
                    rsel = smGridpcolumna.getSelected();
                    if (smGridpcolumna.getSelected().get('enuso') == 0) {
                        btnMod.enable();
                        btnDel.enable();
                    } else {
                        btnMod.disable();
                        btnDel.disable();
                    }
                }
            },
            rowdeselect: function(s, n, r) {
                if (smGridpcolumna.getSelections().length > 1 || smGridpcolumna.getSelections().length == 1) {
                    btnDel.enable();
                } else {
                    btnDel.disable();
                }
                if (smGridpcolumna.getSelections().length == 1) {
                    if (smGridpcolumna.getSelected().data.enuso == 0)
                        btnMod.enable();
                    else
                        btnMod.disable();
                } else {
                    btnMod.disable();
                }
            }
        }
    });
    //inicio del grid columnas
    Gridpcolumna = new Ext.grid.GridPanel({
        loadMask: {
            store: stGridpcolumna
        },
        store: stGridpcolumna,
        plugins: filtroscolumnas,
        master_column_id: 'expandir',
        sm: smGridpcolumna,
        root_title: perfil.etiquetas.lbColumnas,
        autoExpandColumn: 'expandir',
        stripeRows: true,
        height: 600,
        columns: [
            {
                id: 'expandir',
                header: perfil.etiquetas.lbDenominacion,
                tooltip: perfil.etiquetas.lbDenominacion,
                sortable: true,
                dataIndex: 'denominacion',
                renderer: crearToolTip
            },
            {
                id: 'auto',
                header: perfil.etiquetas.lbDescripcion,
                tooltip: perfil.etiquetas.lbDescripcion,
                width: 270,
                sortable: true,
                dataIndex: 'descripcion',
                renderer: crearToolTip
            },
            {
                header: perfil.etiquetas.lbEnUso,
                tooltip: perfil.etiquetas.lbEnUso,
                width: 60,
                sortable: true,
                align: 'center',
                dataIndex: 'enuso',
                renderer: modificarEstado
            }
        ],
        md: menuConfig,
        bbar: new Ext.ux.maximgb.treegrid.PagingToolbar({
            pageSize: 20,
            store: stGridpcolumna,
            displayInfo: true,
            items: [btnLimpiar]
        }),
        listeners: {
            rowcontextmenu: function(g, r, e) {
                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());
            }
        }
    });
    Gridpcolumna.getStore().reload({
        params: {
            limit: 20,
            start: 0
        }
    });

    ////View port para la interfaz
    MiView = new Ext.Viewport({
        layout: 'fit',
        items: new Ext.Panel({
            title: perfil.etiquetas.titGpColumnas,
            layout: 'fit',
            items: Gridpcolumna,
            tbar: [btnAdd, btnMod, btnDel, '-', '->', btnAyuda],
            listeners: {
                'afterlayout': function() {
                    Ext.getCmp('btnAyudaColumna').focus();
                }
            }
        })
    });

    MiView.focus(true, 500);

    upFpGest = function() {
        fp_Add_Columnas.getForm().reset();
        if (add) {
            Ext.getCmp('btnApl').show();
        } else {
            Ext.getCmp('btnApl').hide();
        }
    }

    denominacion = new Ext.form.TextField({
        id: 'denominacionAddColunmas',
        tabIndex: 11,
        prevTab: 'idaceptar',
        fieldLabel: perfil.etiquetas.lbDenominacion,
        anchor: '100%',
        maxLength: 100,
        maxLengthText: perfil.etiquetas.msgMaxLengthTextDenominacion,
        //regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])+$/,
        //maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])$/,
        regex: /^([a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.])*$/,
        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
        vtype: 'validarEspaciosEnBlanco',
        regexText: perfil.etiquetas.lbMsgSoloALfa,
        listeners: {
            change: function() {
                cambio = 1;
            }
        },
        allowBlank: false,
        blankText: perfil.etiquetas.lbmsgCampoObligatorio

    });
    descripcion = new Ext.form.TextArea({
        id: 'descripcionAddColunmas',
        tabIndex: 12,
        // name: 'descripcion',
        maxLength: 255,
        //regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])+$/,
        //maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])$/,
        regex: /^([a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.])*$/,
        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
        vtype: 'validarEspaciosEnBlanco',
        regexText: perfil.etiquetas.lbMsgSoloALfa,
        maxLengthText: perfil.etiquetas.msgMaxLengthTextDescripcion,
        fieldLabel: perfil.etiquetas.lbDescripcion,
        anchor: '100%'
    });

    denominacionmod = new Ext.form.TextField({
        id: 'iddenominacionmod',
        prevTab: 'idaceptarmod',
        tabIndex: 11,
        fieldLabel: perfil.etiquetas.lbDenominacion,
        anchor: '100%',
        maxLength: 100,
        maxLengthText: perfil.etiquetas.msgMaxLengthTextIddenominacion,
        //regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])+$/,
        //maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])$/,
        regex: /^([a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.])*$/,
        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
        vtype: 'validarEspaciosEnBlanco',
        regexText: perfil.etiquetas.lbMsgSoloALfa,
        listeners: {
            change: function() {
                cambio = 1;
            }
        },
        allowBlank: false,
        blankText: perfil.etiquetas.lbmsgCampoObligatorio

    });
    descripcionmod = new Ext.form.TextArea({
        id: 'iddescripcionmod',
        tabIndex: 12,
        maxLength: 255,
        maxLengthText: perfil.etiquetas.msgMaxLengthTextIddescripcionmod,
        regex: /^([a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.])*$/,
        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
        vtype: 'validarEspaciosEnBlanco',
        regexText: perfil.etiquetas.lbMsgSoloALfa,
        fieldLabel: perfil.etiquetas.lbDescripcion,
        anchor: '100%'
    });

    fp_Add_Columnas = new Ext.FormPanel({
        id: 'fp_Add_Columnas',
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
                        items: [denominacion, descripcion]
                    },
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                xtype: 'hidden',
                                id: 'idcolumna'
                            }]
                    }]

            }]
    });
    fp_Mod_Columnas = new Ext.FormPanel({
        id: 'fp_Mod_Columnas',
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
                        items: [denominacionmod, descripcionmod]
                    },
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                xtype: 'hidden',
                                id: 'idcolumna'
                            }]
                    }]
            }],
        listeners: {
            /*'clientvalidation': function(fm, valid) {

                if (Ext.getCmp('iddescripcionmod').getValue() == "") {
                    descripcion = null;
                } else {
                    descripcion = Ext.getCmp('iddescripcionmod').getValue();
                }

                if ((Ext.getCmp('iddenominacionmod').getValue() != valordenominacion ||
                        descripcion != valordescripcion) && fm.getForm().isValid()) {
                    Ext.getCmp('idaceptarmod').enable();
                } else {
                    Ext.getCmp('idaceptarmod').disable();
                }
            }*/
        }
    });

    btnCancelarCol = new Ext.Button({
        iconCls: 'cancelar',
        tabIndex: 14,
        id: 'idcancel',
        text: perfil.etiquetas.lbBtnCancelar,
        tooltip: perfil.etiquetas.lbTtbtnCancelar,
        handler: function() {
            winAddColumnas.hide();
        }
    });
    btnAplicarCol = new Ext.Button({
        iconCls: 'aplicar',
        tabIndex: 13,
        text: perfil.etiquetas.lbBtnAplicar,
        tooltip: perfil.etiquetas.lbTtbtnAplicar,
        id: 'btnApl',
        handler: function() {
            adicionarColumnas('apl');
        }
    });
    btnAceptarCol = new Ext.Button({
        iconCls: 'aceptar',
        tabIndex: 12,
        id: 'idaceptar',
        nextTab: 'denominacion',
        text: perfil.etiquetas.lbBtnAceptar,
        tooltip: perfil.etiquetas.lbTtbtnAceptar,
        handler: function() {
            adicionarColumnas();
        }
    });
    btnCancelarColMod = new Ext.Button({
        iconCls: 'cancelar',
        tabIndex: 14,
        id: 'idcancelmod',
        text: perfil.etiquetas.lbBtnCancelar,
        tooltip: perfil.etiquetas.lbTtbtnCancelar,
        handler: function() {
            winModColumnas.hide();
        }
    });
    btnAceptarColMod = new Ext.Button({
        iconCls: 'aceptar',
        tabIndex: 12,
        disabled: true,
        id: 'idaceptarmod',
        nextTab: 'iddenominacionmod',
        text: perfil.etiquetas.lbBtnAceptar,
        tooltip: perfil.etiquetas.lbTtbtnAceptar,
        handler: function() {
            adicionarColumnas();
        }
    });
    winAddColumnas = new Ext.Window({
        title: perfil.etiquetas.titAddcolumnas,
        modal: true,
        closeAction: 'hide',
        constrain: true,
        layout: 'fit',
        width: 320,
        autoHeight: true,
        items: fp_Add_Columnas,
        buttons: [btnCancelarCol, btnAplicarCol, btnAceptarCol],
        listeners: {
            beforeshow: function() {
                flag = true;
            },
            beforeclose: function() {
                flag = false;
            }
        }
    });
    winModColumnas = new Ext.Window({
        title: perfil.etiquetas.titModcolumnas,
        modal: true,
        closeAction: 'hide',
        layout: 'fit',
        constrain: true,
        width: 320,
        autoValidate: false,
        autoHeight: true,
        items: fp_Mod_Columnas,
        buttons: [btnCancelarColMod, btnAceptarColMod],
        listeners: {
            beforeshow: function() {
                flag = true;
                Ext.getCmp('idaceptarmod').disable();
            },
            beforeclose: function() {
                flag = false;
            }
        }
    });
    stGridpcolumna.load({
        params: {
            start: 0,
            limit: 20
        }
    });
    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'iI',
            alt: true,
            fn: function() {
                if (!btnAdd.hidden && !btnAdd.disabled && !winAddColumnas.isVisible() && !winModColumnas.isVisible() && !mensajeConfEliminar)
                    accionAdicionar();
            }
        }, {
            key: 46,
            fn: function() {
                if (!btnDel.hidden && !btnDel.disabled && !winAddColumnas.isVisible() && !winModColumnas.isVisible())
                    accionEliminar();
            }
        }, {
            key: 'Mm',
            alt: true,
            fn: function() {
                if (!btnMod.hidden && !btnMod.disabled && !winAddColumnas.isVisible() && !winModColumnas.isVisible() && !mensajeConfEliminar)
                    accionModificar();
            }
        }, {
            key: 'Ll',
            alt: true,
            fn: function() {
                if (!winAddColumnas.isVisible() && !winModColumnas.isVisible()) {
                    accionLimpiar();
                }
            }
        }, {
            key: 'Hh',
            alt: true,
            fn: function() {
            }
        }, {
            key: 'Xx',
            alt: true,
            fn: function() {
                if (winAddColumnas) {
                    if (!Ext.getCmp('idcancel').hidden) {
                        if (!Ext.getCmp('idcancel').disabled) {
                            winAddColumnas.hide();
                        }
                    }
                } else {
                    if (winModColumnas) {
                        if (!Ext.getCmp('idcancel').hidden) {
                            if (!Ext.getCmp('idcancel').disabled) {
                                winModColumnas.hide();
                            }
                        }
                    }
                }
            }
        }
        , {
            key: 'Pp',
            alt: true,
            Ctrl: true,
            fn: function() {
                if (!Ext.getCmp('btnApl').hidden) {
                    if (!Ext.getCmp('btnApl').disabled) {
                        adicionarColumnas('apl');
                    }
                }
            }

        }
    ]);
}//fin de caragar interfaz


/****************Funciones*********************************/
//funcion para validar operaciones sobre columnas determinadas
function validar() {
    Ext.Ajax.request({
        url: 'validarOperaciones',
        params: {
            idcolumna: smGridpcolumna.getSelected().data.idcolumna,
            operacion: accion_col
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg == 22) {
                switch (accion_col) {
                    case 'del':
                        {
                            eliminarColumnas();
                        }
                        break;
                    case 'mod':
                        {
                            ModificarColumna();
                        }
                }
            } else if (responseData.codMsg == 20)
                mostrarMensaje(1, perfil.etiquetas.msgErrorColumnasFijasMod);
            else if (responseData.codMsg == 21 && smGridpcolumna.getSelections().length == 1)
                mostrarMensaje(1, perfil.etiquetas.msgErrorEnUsoSin);
            else if (responseData.codMsg == 21 && smGridpcolumna.getSelections().length > 1)
                mostrarMensaje(1, perfil.etiquetas.msgErrorEnUsoPlural);
            else
                (mostrarMensaje(3, perfil.etiquetas.msgErrorAction));
        }
    });
}

//funcion adionar columnas
function adicionarColumnas(apl) {
    if (controlaraccion == 1)
        var mensa = perfil.etiquetas.msgAdicionando;
    else {
        if (controlaraccion == 2)
            var mensa = perfil.etiquetas.msgModificando;
    }
    if (accion_col == "mod") {
        var denominacion = Gridpcolumna.getSelectionModel().getSelected().json.denominacion;
        var descripcion = Gridpcolumna.getSelectionModel().getSelected().json.descripcion;
        if (Ext.getCmp('iddenominacionmod').getValue() != denominacion || Ext.getCmp('iddescripcionmod').getValue() != descripcion) {
            if (fp_Mod_Columnas.getForm().isValid()) {
                fp_Mod_Columnas.getForm().submit({
                    url: 'adicionarColumna',
                    waitMsg: mensa,
                    failure: function(form, action) {

                        responseData = action.result;

                        if (responseData.mensaje == 'add') {

                            if (responseData.codMsgP == 1) {
                                upFpGest();
                                if (!apl)
                                    winModColumnas.hide();
                                mensaje1 = perfil.etiquetas.msgAdicionado;
                                if (!apl)
                                    winModColumnas.hide();
                                mostrarMensaje(1, mensaje1);
                                btnMod.disable();
                                btnDel.disable();

                            } else if (responseData.codMsgP == 2) {
                                mostrarMensaje(1, perfil.etiquetas.msgDenominacionYaExiste);
                            }
                            Gridpcolumna.getStore().reload();
                        } else if (action.result.mensaje == 'mod') {
                            if (responseData.codMsgP == 1) {
                                upFpGest();
                                mensaje1 = perfil.etiquetas.msgModificado;
                                if (!apl)
                                    winModColumnas.hide();
                                mostrarMensaje(1, mensaje1);
                                btnMod.disable();
                                btnDel.disable();
                            } else if (responseData.codMsgP == 2) {
                                mostrarMensaje(1, perfil.etiquetas.msgDenominacionYaExiste);
                            }
                            Gridpcolumna.getStore().reload();
                        }
                    }
                })
            } else {
                if (!Ext.getCmp('iddenominacionmod').getRawValue())
                    mostrarMensaje(1, perfil.etiquetas.msgBlanco);
                else
                    mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);
            }
        } else {
            mostrarMensaje(1, perfil.etiquetas.msgRealizarModificacion);
        }
    } else {

        if (fp_Add_Columnas.getForm().isValid()) {
            fp_Add_Columnas.getForm().submit({
                url: 'adicionarColumna',
                waitMsg: mensa,
                failure: function(form, action) {
                    responseData = action.result;
                    if (responseData.mensaje == 'add') {
                        if (responseData.codMsgP == 1) {
                            upFpGest();
                            if (!apl)
                                winAddColumnas.hide();
                            mensaje1 = perfil.etiquetas.msgAdicionado;
                            if (!apl)
                                winAddColumnas.hide();
                            mostrarMensaje(1, mensaje1);
                            btnMod.disable();
                            btnDel.disable();

                        } else if (responseData.codMsgP == 2) {
                            mostrarMensaje(1, perfil.etiquetas.msgDenominacionYaExiste);
                        }
                        Gridpcolumna.getStore().reload();
                    } else if (action.result.mensaje == 'mod') {

                        if (responseData.codMsgP == 1) {
                            upFpGest();
                            mensaje1 = perfil.etiquetas.msgModificado;
                            if (!apl)
                                winAddColumnas.hide();
                            mostrarMensaje(1, mensaje1);
                            btnMod.disable();
                            btnDel.disable();

                        } else if (responseData.codMsgP == 2) {
                            mostrarMensaje(1, perfil.etiquetas.msgDenominacionYaExiste);
                        }
                        Gridpcolumna.getStore().reload();
                    }
                }
            })
        } else {
            if (!Ext.getCmp('denominacionAddColunmas').getRawValue())
                mostrarMensaje(1, perfil.etiquetas.msgBlanco);
            else
                mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);
        }
    }
}

// function eliminar columnas

function eliminarColumnas() {
    mensajeConfEliminar = true;
    if (Gridpcolumna.getSelectionModel().getSelections().length == 1) {
        mostrarMensaje(2, perfil.etiquetas.lbmsg4Singular, elimina);
    } else {
        mostrarMensaje(2, perfil.etiquetas.lbmsg4Plural, elimina);
    }

    function elimina(btnPresionado) {
        if (btnPresionado == 'ok') {
            mensajeConfEliminar = true;
            var aux = Gridpcolumna.getSelectionModel().getSelections();
            var els = new Array();
            for (var i = 0; i < aux.length; i++) {
                els.push(aux[i].id);
            }
            Ext.MessageBox.show({
                title: perfil.etiquetas.msgEspere,
                msg: perfil.etiquetas.msgEliminando,
                width: 250,
                wait: true,
                progress: true,
                closable: false
            });

            Ext.Ajax.request({
                url: 'eliminarColumna',
                params: {
                    idcolumna: Ext.encode(els)

                },
                callback: function(options, success, response) {

                    var responseData = Ext.decode(response.responseText);
                    switch (responseData.codMsgP) {
                        case 1:
                            mostrarMensaje(1, perfil.etiquetas.lbMsgEliminado);
                            Gridpcolumna.getStore().reload();
                            break;
                        case 2:
                            mostrarMensaje(1, perfil.etiquetas.lbEliminadoAlg);
                            Gridpcolumna.getStore().reload();
                            break;
                        case 4:
                            mostrarMensaje(1, perfil.etiquetas.lbNoEliminado);

                            break;
                        default:
                            mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                            break;
                    }
                    Ext.MessageBox.hide();
                    btnDel.disable();
                    smGridpcolumna.clearSelections();
                }

            });
        } else {
            mensajeConfEliminar = false;
        }
    }

}

function modificarEstado(val, m) {
    if (val == 1) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde';
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo';
    }
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

onkyupbusqueda = function(c, e) {
    if (e.getKey() == 13) {
        smGridpcolumna.clearSelections();
        stGridpcolumna.load({
            params: {
                start: 0,
                limit: 20
            }
        });
    }
}

function ModificarColumna() {
    add = false;
    addhijo = false;
    mensaje = perfil.etiquetas.msgGuardandoModificar;
    winModColumnas.show();
    upFpGest();
    Ext.getCmp('iddenominacionmod').setValue(Gridpcolumna.getSelectionModel().getSelected().data.denominacion);
    Ext.getCmp('iddescripcionmod').setValue(Gridpcolumna.getSelectionModel().getSelected().data.descripcion);
    Ext.getCmp('idcolumna').setValue(Gridpcolumna.getSelectionModel().getSelected().data.idcolumna);
}

function conformarMensaje(mesg) {
    mesg = perfil.etiquetas.msg1 + mesg + perfil.etiquetas.msg2;
    return mesg;
}

function cambiarTituloFiltrarColumnas() {
    var filtrado_por = "";
    var sep = "/";
    if (filtroscolumnas.getFiltrosActivos() == undefined || filtroscolumnas.getFiltrosActivos().length == 0) {
        Gridpcolumna.setTitle(perfil.etiquetas.lbColumnas);
    } else {
        for (i = 0; i < filtroscolumnas.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtroscolumnas.getFiltrosActivos()[i].dataIndex == "denominacion") {
                aux = perfil.etiquetas.lbDenominacion;
            } else if (filtroscolumnas.getFiltrosActivos()[i].dataIndex == "descripcion") {
                aux = perfil.etiquetas.lbDescripcion;
            } else if (filtroscolumnas.getFiltrosActivos()[i].dataIndex == "enuso") {
                aux = perfil.etiquetas.lbEnUso;
            }

            if (i == filtroscolumnas.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }

        Gridpcolumna.setTitle(perfil.etiquetas.lbFiltradoPorCol + filtrado_por + '</i>');

        filtrado_por = "";
    }
}

function accionAdicionar() {
    controlaraccion = 1;
    add = true;
    addhijo = false;
    accion_col = 'add';
    mensaje = perfil.etiquetas.msgGuardandoAdicionar;
    winAddColumnas.on('beforeshow', function() {
        denominacion.focus(true, 500);
    });
    winAddColumnas.show();
    smGridpcolumna.clearSelections();
    upFpGest();
}

function accionModificar() {
    denominacionmod.focus(true, 500);
    controlaraccion = 2;
    accion_col = 'mod';
    validar()
}
function accionEliminar() {
    accion_col = 'del';
    validar()
}

function accionLimpiar() {
    filtroscolumnas.clearFilters();
}
function siexistecolumFiltrada() {
    if (filtroscolumnas.getFiltrosActivos().length > 0 && stGridpcolumna.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
}

function formIsDirty(form) {
    for (var i = 0; i < form.elements.length; i++) {
        var element = form.elements[i];
        var type = element.type;
        if (type == "checkbox" || type == "radio") {
            if (element.checked != element.defaultChecked) {
                return true;
            }
        } else if (type == "hidden" || type == "password" ||
                type == "text" || type == "textarea") {
            if (element.value != element.defaultValue) {
                return true;
            }
        } else if (type == "select-one" || type == "select-multiple") {
            for (var j = 0; j < element.options.length; j++) {
                if (element.options[j].selected !=
                        element.options[j].defaultSelected) {
                    return true;
                }
            }
        }
    }
    return false;
}


