var perfil = eval(uneval(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = {};
UCID.portal.cargarEtiquetas('caracterizacionentidades', cargarInterfaz);
//variables
objci = {};
objci.acciones = [];
var offset = 0, recordsFallidos = [], identidad, idelemento,
        idunidadmedida, attributesElem, is_leaf, coldin, columna, gpCaracterizacion,
        arrayIndexDinamicosTodos, arrayIndexDinamicosNum, contJRGrid = 0;
function cargarInterfaz() {

    //*********mascaras****************************************************
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCarg
    });

    //*********botones****************************************************
    btnLimpiarcaract = new Ext.Button({
        tooltip: perfil.etiquetas.lbLimpiar,
        id: 'btnLimpiarcaract',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        handler: function () {
            accionbtnLimpiarcaract();
        }
    });
    btnAyuda = new Ext.Button({
        disabled: false,
        id: 'btnAyuda',
        iconCls: 'ayuda',
        tooltip: perfil.etiquetas.lbBtnAyuda
    });
    btnGuardarCaract = new Ext.Button({
        tooltip: perfil.etiquetas.lbBtnGuardar,
        hidden: true,
        id: 'btnGuardarCaract',
        iconCls: 'guardar',
        handler: function () {
            Guardar();
        }
    });

    btnAdicionarAgrupacion = new Ext.Button({
        iconCls: 'adicionar',
        id: 'btnAdicionarAgrupacion',
        disabled: true,
        tooltip: perfil.etiquetas.lbTtbtnAddAgr,
        handler: function () {
            adicionarmodificarElemento('a', 'a');
        }
    });
    btnAdicionarVariable = new Ext.Button({
        iconCls: 'adicionar',
        id: 'btnAdicionarVariable',
        disabled: true,
        tooltip: perfil.etiquetas.lbTtbtnAddVar,
        handler: function () {
            adicionarmodificarElemento('v', 'a');
        }
    });
    btnModificarVariable = new Ext.Button({
        iconCls: 'modificar',
        id: 'btnModificarVariable',
        disabled: true,
        tooltip: perfil.etiquetas.titModVar,
        handler: function () {
            if (attributesElem.variable == 1) {
                adicionarmodificarElemento('v', 'm');
            } else {
                adicionarmodificarElemento('a', 'm');
            }
        }
    });

    btnEliminarVariable = new Ext.Button({
        iconCls: 'eliminar',
        id: 'btnEliminarVariable',
        disabled: true,
        tooltip: perfil.etiquetas.lbTtbtnDelVar,
        handler: function () {
            if (attributesElem.variable == 1) {
                eliminarElemento('v');
            } else {
                eliminarElemento('a');
            }
        }
    });
    btnAsociarVariable = new Ext.Button({
        iconCls: 'asociar',
        id: 'btnAsociarVariable',
        disabled: true,
        tooltip: perfil.etiquetas.lbTtbtnAscVar,
        handler: function () {
            asociarDeasociarElemento('a');
        }
    });
    btnDesasociarVariable = new Ext.Button({
        iconCls: 'deshacer',
        id: 'btnDesasociarVariable',
        disabled: true,
        tooltip: perfil.etiquetas.lbTtbtnDesVar,
        handler: function () {
            asociarDeasociarElemento('d');
        }
    });
    //********teclas calientes********************************************
    map = new Ext.KeyMap(Ext.getDoc(),
            [
                {
                    key: 'Ll',
                    alt: true,
                    fn: function () {
                        if (!btnLimpiarcaract.hidden && !btnLimpiarcaract.disabled)
                            accionbtnLimpiarcaract();
                    }
                }
            ]);

    //****************************entidades********************************
    trEntidadcaract = new Ext.estructura.panel.PanelEstructura({
        cargos: false,
        menu: false,
        width: 250

    });
    trEntidadcaract.btnBuscar.setText("");
    trEntidadcaract.btnLimpiar.setText("");
    trEntidadcaract = trEntidadcaract.items.items[0];
    trEntidadcaract.getRootNode().expand();
    trEntidadcaract.addListener('click', function (node, event) {
        trEntidadcaract.getSelectionModel().select(node);

        if (pgridCracterizacion) {
            pgridCracterizacion.disable();
            if (typeof (stCaracterizacion) != 'undefined')
                stCaracterizacion.removeAll();
        }

        if (node.text != "Estructuras") {
            identidad = node.id;
            is_leaf = node.leaf;
            tpVariables.enable();
            if (isNaN(identidad) == false) {
                loaderTreeBase.baseParams.identidad = identidad;
                ptVariables.expand(true);
                tpVariables.getRootNode().reload();
                ptVariables.enable();
            }
        } else {
            tpVariables.root.collapse();
            tpVariables.disable();
            stCaracterizacion.loadData({"data": [], "total": 0});
            pgridCracterizacion.disable();
        }


    });
    pEntidadcaract = new Ext.Panel({
        title: perfil.etiquetas.lbEntidades,
        id: 'pEntidadcaract',
        region: 'west',
        collapsible: true,
        titleCollapse: true,
        split: true,
        width: 250,
        layout: 'fit',
        items: trEntidadcaract
    });

    //***************************variables*****************************
    loaderTreeBase = new Ext.tree.TreeLoader({
        dataUrl: 'listarVariables',
        listeners: {
            scope: this,
            beforeload: function (loader, treeNode) {

                loader.baseParams = {
                    identidad: identidad
                };
                mymask.show();
            },
            load: function (loader, nodo, respuesta) {
                if (nodo.id == 0) {
                    nodo.expandChildNodes();
                }

                mymask.hide();
            }
        }
    });

    tpVariables = new Ext.tree.TreePanel({
        autoScroll: true,
        layout: 'fit',
        height: 200,
        border: false,
        listeners: {
            click: function (n, e) {
                idelemento = n.id;
                attributesElem = n.attributes;
                controlarBtnTpVariable(attributesElem);
                if (attributesElem.variable == 1) {
                    cargarconfgrid(attributesElem.idtipomodelo);
                } else {
                    pgridCracterizacion.disable();
                    if (typeof (stCaracterizacion) != 'undefined')
                        stCaracterizacion.removeAll();
                }

            }
        },
        loader: loaderTreeBase,
        root: {
            nodeType: 'async',
            id: '0',
            text: 'Conceptos',
            tipo: 0,
            leaf: false
        }
    });
    ptVariables = new Ext.Panel({
        title: perfil.etiquetas.lbTtConceptos,
        id: 'pt',
        disabled: true,
        region: 'center',
        collapsible: true,
        titleCollapse: true,
        split: true,
        width: 250,
        layout: 'fit',
        tbar: [btnAdicionarAgrupacion, btnAdicionarVariable, btnModificarVariable, btnEliminarVariable, '-',
            btnAsociarVariable, btnDesasociarVariable],
        items: tpVariables
    });

    //***************************variables y entidades*************************
    pEntVar = new Ext.Panel({
        id: 'pEntVar',
        region: 'west',
        width: 500,
        layout: 'border',
        items: [pEntidadcaract, ptVariables]
    });

    //**************grid panel caracterizacion****************************
    pgridCracterizacion = new Ext.Panel({
        id: 'pgridCaracterizacion',
        title: perfil.etiquetas.lbInfProd,
        region: 'center',
        layout: 'fit',
        disabled: true,
        tbar: [{
                xtype: 'checkbox',
                boxLabel: 'Global',
                id: 'chkglobalGI',
                listeners: {
                    check: function (ck, t) {
                        if (Ext.getCmp('chkglobalGI').getValue() == true) {
                            HabilitarEditores(false);
                            btnGuardarCaract.disable();
                        } else {
                            HabilitarEditores(true);
                            btnGuardarCaract.enable();
                        }
                        stCaracterizacion.reload();
                    }
                }
            }, btnGuardarCaract]
    });

    //****************panel principal*******************
    pGeneral = new Ext.Panel({
        id: 'pGeneral',
        layout: 'border',
        tbar: ['->', btnAyuda],
        items: [pEntVar, pgridCracterizacion]
    });

    //******************viewport*****************
    vCaracterizacion = new Ext.Viewport({
        items: [pGeneral],
        layout: 'fit',
        id: 'vCaracterizacion'
    });

    //*****************datos de carga inicial*************
    stTipoModel = new Ext.data.Store({
        autoLoad: true,
        //url: '../comun/listarTiposModelosActivos',
        url: 'listarTiposModelosActivos',
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "idtipomodelo"
        }, [{
                name: 'idtipomodelo'
            }, {
                name: 'denominacion'
            }]
                )
    });
    stComboUniMed = new Ext.data.Store({
        //url: '../comun/cargarunidadmedida',
        url: 'cargarunidadmedida',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            id: 'idunidadmedida',
            root: 'data'
        }, [{
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }])
    });
    stComboEntidades = new Ext.data.Store({
        url: 'listarFiltrosEntidades',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idestructura'
            }, {
                name: 'denominacion'
            }])
    });
    smCaracterizacion = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
}

function adicionarmodificarElemento(tipo, accion) {

    btnCancelarElemento = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarElemento',
        text: perfil.etiquetas.lbBtnCancelar,
        tooltip: perfil.etiquetas.lbTtbtnCancelar,
        handler: function () {
            winAddElemento.destroy();
            pgridCracterizacion.disable();
        }
    });
    btnAplicarElemento = new Ext.Button({
        iconCls: 'aplicar',
        text: perfil.etiquetas.lbBtnAplicar,
        tooltip: perfil.etiquetas.lbTtbtnAplicar,
        id: 'btnAplicarElemento',
        handler: function () {
            adicionarmodificarElementoPeticion(tipo, accion, 'apl');
        }
    });
    btnAceptarElemento = new Ext.Button({
        iconCls: 'aceptar',
        id: 'btnAceptarElemento',
        nextTab: 'denominacion',
        text: perfil.etiquetas.lbBtnAceptar,
        tooltip: perfil.etiquetas.lbTtbtnAceptar,
        handler: function () {
            adicionarmodificarElementoPeticion(tipo, accion, 'acp');
            pgridCracterizacion.disable();
        }
    });
    denominacion = new Ext.form.TextField({
        id: 'denominacion',
        fieldLabel: perfil.etiquetas.lbDenominacion,
        anchor: '100%',
        maxLength: 100,
        maxLengthText: perfil.etiquetas.msgMaxLengthTextDenominacion,
        regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])+$/,
        maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])$/,
        regexText: perfil.etiquetas.lbMsgSoloALfa,
        allowBlank: false,
        blankText: perfil.etiquetas.lbmsgCampoObligatorio

    });
    descripcion = new Ext.form.TextArea({
        id: 'descripcion',
        maxLength: 255,
        regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d']*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])+$/,
        maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ\_\-\d'])$/,
        regexText: perfil.etiquetas.lbMsgSoloALfa,
        maxLengthText: perfil.etiquetas.msgMaxLengthTextDescripcion,
        fieldLabel: perfil.etiquetas.lbDescripcion,
        allowBlank: false,
        blankText: perfil.etiquetas.lbmsgCampoObligatorio,
        anchor: '100%'
    });
    var tituloventana = "";
    if (tipo == 'a')
        if (accion == 'a')
            tituloventana = perfil.etiquetas.lbTtbtnAddAgr;
        else
            tituloventana = perfil.etiquetas.titModAgr;
    else
    if (accion == 'a')
        tituloventana = perfil.etiquetas.lbTtbtnAddVar;
    else
        tituloventana = perfil.etiquetas.titModVar;

    var itemsfpAdd = [denominacion, descripcion];

    if (tipo == 'v') {
        if (accion == 'a') {
            cbTipomodelo = new Ext.form.ComboBox({
                displayField: 'denominacion',
                id: 'cbTipomodelo',
                valueField: 'idtipomodelo',
                hiddenName: 'idtipomodelo',
                typeAhead: true,
                editable: true,
                forceSelection: true,
                triggerAction: 'all',
                validateOnBlur: true,
                loadingText: 'Cargando...',
                mode: 'local',
                anchor: '100%',
                fieldLabel: perfil.etiquetas.lbTipodemodelo,
                allowBlank: false,
                blankText: perfil.etiquetas.msgErrorCargaNula,
                emptyText: perfil.etiquetas.lbSeleccione,
                store: stTipoModel
            });
        }
        cmUidMed = new Ext.form.ComboBox({
            store: stComboUniMed,
            width: 100,
            forceSelection: true,
            fieldLabel: perfil.etiquetas.lbUnidadMedida,
            allowBlank: false,
            emptyText: perfil.etiquetas.lbSeleccione,
            valueField: 'idunidadmedida',
            displayField: 'denominacionunidadmedida',
            id: 'cmUidMed',
            triggerAction: 'all',
            mode: 'local',
            anchor: '95%',
            enableKeyEvents: true,
            listeners: {
                select: function (cb, record, index) {
                    idunidadmedida = cb.getValue();
                }
            }
        });
        if (accion == 'a')
            itemsfpAdd = [denominacion, descripcion, cbTipomodelo, cmUidMed];
        else
            itemsfpAdd = [denominacion, descripcion, cmUidMed];
    }
    fpAdd = new Ext.FormPanel({
        id: 'fpAdd',
        region: 'center',
        autoHeight: true,
        autoDestroy: true,
        autoWidth: true,
        frame: true,
        labelAlign: 'top',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        style: 'margin:0 10 0 10;',
                        layout: 'form',
                        items: itemsfpAdd
                    }]
            }]
    });

    if (accion == 'm') {
        Ext.getCmp('denominacion').setValue(attributesElem.text);
        Ext.getCmp('descripcion').setValue(attributesElem.descripcion);
        if (tipo == 'v') {
            Ext.getCmp('cmUidMed').setValue(attributesElem.idunidadmedida);
        }
    }
    if (accion == 'a')
        var buttons = [btnCancelarElemento, btnAplicarElemento, btnAceptarElemento];
    else
        var buttons = [btnCancelarElemento, btnAceptarElemento];
    winAddElemento = new Ext.Window({
        title: tituloventana,
        modal: true,
        closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        width: 320,
        autoHeight: true,
        items: fpAdd,
        buttons: buttons
    });
    winAddElemento.show();
    pgridCracterizacion.enable();
}
function adicionarmodificarElementoPeticion(tipo, accion, apl) {
    var variable = 0;
    var mensa = "";
    if (tipo == 'a') {
        if (accion == 'a') {
            mensa = perfil.etiquetas.msgAdicionandoAgr;
        } else
            mensa = perfil.etiquetas.msgModificandoAgr;
    } else {
        variable = 1;
        if (accion == 'a') {
            mensa = perfil.etiquetas.msgAdicionandoVar;
        } else
            mensa = perfil.etiquetas.msgModificandoVar;
    }
    Ext.Ajax.timeout = 60000;
    if (fpAdd.getForm().isValid()) {
        fpAdd.getForm().submit({
            url: 'adicionarmodificarElemento',
            params: {
                idelemento: idelemento,
                identidad: identidad,
                accion: accion,
                variable: variable,
                idunidadmedida: idunidadmedida,
                tipo: tipo
            },
            waitMsg: mensa,
            failure: function (form, action) {
                responseData = action.result;
                if (accion == 'a') {
                    if (tipo == 'a') {
                        mostrarMensaje(1, perfil.etiquetas.msgAgrAdicionado);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgVarAdicionado);
                    }
                } else {
                    if (tipo == 'a') {
                        mostrarMensaje(1, perfil.etiquetas.msgAgrModificado);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgVarModificado);
                    }
                }
                if (apl != 'apl') {
                    winAddElemento.destroy();
                } else {
                    if (tipo == 'v') {
                        denominacion.reset();
                        descripcion.reset();
                        cmUidMed.clearValue();
                        cbTipomodelo.clearValue();
                    } else {
                        denominacion.reset();
                        descripcion.reset();
                    }
                }
                tpVariables.getRootNode().reload();
            }
        });
    } else {
        mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);
    }

}
function eliminarElemento(tipo) {
    if (attributesElem.identidadcrea == identidad) {
        pgridCracterizacion.enable();
        if (tipo == 'a')
            mostrarMensaje(2, perfil.etiquetas.lbEliminarAgr, elimina);
        else
            mostrarMensaje(2, perfil.etiquetas.lbEliminarVar, elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                Ext.Ajax.request({
                    url: 'eliminarElemento',
                    params: {
                        idelemento: idelemento
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgM == 1) {
                            if (tipo == 'a')
                                mostrarMensaje(1, perfil.etiquetas.lbEliminarAgrOk);
                            else
                                mostrarMensaje(1, perfil.etiquetas.lbEliminarVarOk);
                            tpVariables.getRootNode().reload();
                        } else
                        if (tipo == 'a')
                            mostrarMensaje(1, perfil.etiquetas.lbEliminarAgrNo);
                        else
                            mostrarMensaje(1, perfil.etiquetas.lbEliminarVarNo);
                    }
                });
            }
        }
    } else
    if (tipo == 'a')
        mostrarMensaje(1, perfil.etiquetas.lbNoPermisoAgr);
    else
        mostrarMensaje(1, perfil.etiquetas.lbNoPermisoVar);
}
function cambiarTituloFiltrarEntidades() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosCaracterizacion.getFiltrosActivos() == undefined || filtrosCaracterizacion.getFiltrosActivos().length == 0) {
        pgridCracterizacion.setTitle(perfil.etiquetas.lbInfProd);
    } else {
        for (i = 0; i < filtrosCaracterizacion.getFiltrosActivos().length; i++) {
            var numberCol = cmCaracterizacion.findColumnIndex(filtrosCaracterizacion.getFiltrosActivos()[i].dataIndex);
            if (i == filtrosCaracterizacion.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += cmCaracterizacion.getColumnHeader(numberCol) + sep;
        }
        pgridCracterizacion.setTitle(perfil.etiquetas.lbInfProd + "<i> " + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}
function accionbtnLimpiarcaract() {
    filtrosCaracterizacion.clearFilters();
}

function controlarBtnTpVariable(attributesElem) {

    btnAsociarVariable.disable();
    btnDesasociarVariable.disable();
    btnAdicionarAgrupacion.disable();
    btnAdicionarVariable.disable();
    btnModificarVariable.disable();
    btnEliminarVariable.disable();
    if (attributesElem.id == 0) {
        btnAdicionarAgrupacion.enable();
        btnAdicionarVariable.enable();
    } else {
        if (attributesElem.variable == 0) {
            if (attributesElem.identidadcrea == identidad) {
                btnAsociarVariable.enable();
                btnAdicionarAgrupacion.enable();
                btnAdicionarVariable.enable();
                btnModificarVariable.enable();
                if (attributesElem.enuso == 0) {
                    btnDesasociarVariable.enable();
                    btnEliminarVariable.enable();
                }
            }
        } else {
            if (attributesElem.identidadcrea == identidad) {
                if (attributesElem.enuso == 0) {
                    btnModificarVariable.enable();
                    btnDesasociarVariable.enable();
                    btnEliminarVariable.enable();
                }
                btnAsociarVariable.enable();
            }
        }
    }
}
function crearToolTip(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    return val;
}
function getRawValue(v, cmb, g, c) {
    var arrid = (v != null) ? v.split(",") : '';

    var str = '';
    if (v != '') {
        str += ((cmb.store.find(cmb.valueField, arrid[0]) != -1)
                ? cmb.store.getAt(cmb.store.find(cmb.valueField, arrid[0])).data[cmb.displayField]
                : '');
    }
    return str;
}
function renderUM(value, m) {
    m.attr = 'ext:qtip="' + value + '"';

    for (var i = 0; i < stComboUniMed.data.items.length; i++) {
        if (stComboUniMed.data.items[i].data.idunidadmedida == value) {
            m.attr = 'ext:qtip="' + stComboUniMed.data.items[i].data.denominacionunidadmedida + '"';
            return stComboUniMed.data.items[i].data.denominacionunidadmedida;
        }
    }
}
function renderEnt(value, m) {
    m.attr = 'ext:qtip="' + value + '"';

    for (var i = 0; i < stComboEntidades.data.items.length; i++) {
        if (stComboEntidades.data.items[i].data.idestructura == value) {
            m.attr = 'ext:qtip="' + stComboEntidades.data.items[i].data.denominacion + '"';
            return stComboEntidades.data.items[i].data.denominacion;
        }
    }
}
function cargarconfgrid(tipomodelo) {
    Ext.getCmp('btnGuardarCaract').show();
    Ext.Ajax.request({
        url: 'obtenerColumnasDinamicas',
        params: {
            idtipomodelo: tipomodelo
        },
        callback: function (options, success, response) {
            var responseData = Ext.decode(response.responseText);
            if (responseData.cm) {
                reconfgrid(responseData);
                pgridCracterizacion.add(crearGrid(filtrosCaracterizacion, stCaracterizacion, cmCaracterizacion, pggpCaracterizacion, smCaracterizacion));
                pgridCracterizacion.doLayout();
                stCaracterizacion.reload();
            } else {
                reconfgrid();
            }
            pgridCracterizacion.enable();
        }
    });
}
function reconfgrid(cf) {
    filterDinamico = [];
    filterDinamico.push({
        type: 'numeric',
        dataIndex: 'valor'
    }, {
        type: 'listado',
        dataIndex: 'idestructura',
        idcombo: 'idcbEntidad',
        valueFieldcb: 'idestructura',
        displayFieldcb: 'denominacion',
        st: stComboEntidades,
        autoload: false,
        mode: 'local'
    }, {
        type: 'listado',
        dataIndex: 'idunidadmedida',
        idcombo: 'idcbunidadmedidaTC',
        valueFieldcb: 'idunidadmedida',
        displayFieldcb: 'denominacionunidadmedida',
        st: stComboUniMed,
        autoload: false,
        mode: 'local'
    });
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    var arrayIndexDinamicos = new Array();
    arrayIndexDinamicosTodos = new Array();
    arrayIndexDinamicosNum = new Array();
    arrayIndexDinamicosCad = new Array();

    readerdina = [];
    readerdina.push({
        name: 'idestructura'
    });
    readerdina.push({
        name: 'valor'
    });
    readerdina.push({
        name: 'idunidadmedida'
    });
    readerdina.push({
        name: 'idvariablecontrolentidad'
    });
    //variable para controlar los editores dinamicos de los combos
    //1-es la diferencia entre posicion del arreglo y longitud
    //3-numero de columnas fijas antes de la 1er columna dinamica
    contJRGrid = readerdina.length + 1 - 3;
    cmdina = [];
    cmdina.push({
        header: perfil.etiquetas.lbDenominacionEnt,
        tooltip: perfil.etiquetas.lbDenominacionEnt,
        id: 'expandir',
        allowBlank: false,
        dataIndex: 'idestructura',
        renderer: renderEnt
    });
    cmdina.push({
        header: perfil.etiquetas.lbValor,
        tooltip: perfil.etiquetas.lbValor,
        allowBlank: false,
        align: 'right',
        dataIndex: 'valor',
        renderer: crearToolTip,
        editor: new Ext.form.NumberField({
            name: 'valor',
            allowBlank: false,
            decimalPrecision: 6,
            minValue: 0,
            listeners: {
                focus: function (f) {
                    f.selectText();
                }
            }
        })
    });
    cmdina.push({
        header: perfil.etiquetas.lbUM,
        tooltip: perfil.etiquetas.lbUnidadMedida,
        sortable: true,
        dataIndex: 'idunidadmedida',
        renderer: renderUM

    });

    if (cf) {
        for (var index = 0; index < cf.cm.length; index++) {
            if (cf.cm[index].edit.xtype) {
                switch (cf.cm[index].edit.xtype) {
                    case 'numberfield':
                        {
                            cf.cm[index].editor = new Ext.form.NumberField(cf.cm[index].edit);
                            cf.cm[index].tooltip = cf.cm[index].header;
                            cf.cm[index].align = 'right';
                            cf.cm[index].editor.on('focus', function (f) {
                                f.selectText();
                            });

                            var itemsNum = cf.cm;
                            filterDinamico.push({
                                type: 'numeric',
                                dataIndex: itemsNum[index].dataIndex
                            });
                            arrayIndexDinamicosTodos.push(itemsNum[index].dataIndex);
                            arrayIndexDinamicosNum.push(itemsNum[index].dataIndex);
                        }
                        break;
                    case 'datefield':
                        {
                            cf.cm[index].editor = new Ext.form.DateField(cf.cm[index].edit);
                            cf.cm[index].editor.format = 'd/m/Y';
                            cf.cm[index].tooltip = cf.cm[index].header;
                            filterDinamico.push({
                                type: 'date',
                                dataIndex: cf.cm[index].dataIndex
                            });
                            cf.cm[index].renderer = function (v, m, r, ri, ci, st) {
                                if (v) {
                                    if (typeof (v) == 'string') {
                                        var arreg = v.split('-');
                                        v = arreg[2] + '/' + arreg[1] + '/' + arreg[0];
                                        m.attr = 'ext:qtip="' + v + '"';
                                        return v;
                                    } else {
                                        m.attr = 'ext:qtip="' + v.format('d/m/Y') + '"';
                                        return v.format('d/m/Y');
                                    }
                                }
                                return '';
                            }
                        }
                        break;
                    case 'combo':
                        {
                            var item = cf.cm[index].edit;
                            var items = cf.cm;
                            var almacen = new Ext.data.SimpleStore({fields: ['iddatosnomenclador', item.displayField]});
                            var valores = [];

                            for (var j = 0; j < cf.cm[index].edit.store.length; j++) {
                                valores.push(new Ext.data.Record(cf.cm[index].edit.store[j]));
                            }
                            almacen.add(valores);
                            //arreglos de index dinamicos para despues trabajar con ellos
                            arrayIndexDinamicos.push(items[index].dataIndex);
                            arrayIndexDinamicosTodos.push(items[index].dataIndex);

                            cf.cm[index] = {
                                id: items[index].edit.id,
                                header: items[index].header,
                                dataIndex: items[index].dataIndex,
                                sortable: true,
                                width: 180,
                                tooltip: items[index].header,
                                renderer: function (value, cell, rec, row, col) {
                                    var col = col;

                                },
                                editor: new Ext.form.ComboBox({
                                    id: item.id,
                                    hiddenName: item.hiddenName,
                                    name: item.hiddenName,
                                    mode: 'local',
                                    triggerAction: 'all',
                                    allowBlank: item.allowBlank,
                                    emptyText: item.emptyText,
                                    width: 180,
                                    typeAhead: item.typeAhead,
                                    valueField: item.valueField,
                                    displayField: item.displayField,
                                    renderer: crearToolTip,
                                    store: almacen,
                                    listeners: {
                                        select: function (a, b, c) {
                                            for (var i = 0; i < smCaracterizacion.getSelections().length; i++) {
                                                stCaracterizacion.getById(smCaracterizacion.getSelections()[i].id).set(stCaracterizacion.getById(smCaracterizacion.getSelections()[i].id).fields.items[columna + contJRGrid/*3*/].name, a.getValue());
                                            }
                                        }
                                    }
                                })
                            };
                            filterDinamico.push({
                                type: 'listado',
                                dataIndex: items[index].dataIndex,
                                valueFieldcb: 'iddatosnomenclador',
                                st: almacen,
                                displayFieldcb: item.displayField,
                                autoload: false
                            });
                        }
                        break;
                    default:
                        {
                            arrayIndexDinamicosCad.push(cf.cm[index].dataIndex);
                            //Hubo que reimplementar el editor porque daba error con las comillas del regex
                            //cf.cm[index].editor = new Ext.form.TextField({cf.cm[index].edit});
                            cf.cm[index].editor = new Ext.form.TextField({
                                allowBlank: cf.cm[index].edit.allowBlank,
                                anchor: cf.cm[index].edit.anchor,
                                fieldLabel: cf.cm[index].edit.fieldLabel,
                                id: cf.cm[index].edit.id,
                                maxLength: cf.cm[index].edit.maxLength,
                                name: cf.cm[index].edit.name,
                                regex: new RegExp(cf.cm[index].edit.regex.substring(1, cf.cm[index].edit.regex.length - 1)),
                                store: cf.cm[index].edit.store,
                                xtype: cf.cm[index].edit.xtype
                            });
                            cf.cm[index].editor.on('focus', function (f) {
                                f.selectText();
                            });
                            cf.cm[index].tooltip = cf.cm[index].header;
                            filterDinamico.push({
                                type: 'string',
                                dataIndex: cf.cm[index].dataIndex
                            });
                        }
                        break;
                }
                cmdina.push(cf.cm[index]);
            }
        }

        for (var index = 0; index < cf.rd.length; index++) {
            readerdina.push(cf.rd[index]);

        }
    }


    jrstCaracterizacion = new Ext.data.JsonReader({
        totalProperty: 'total',
        root: 'data',
        id: 'jrstCaracterizacion',
        llave: 'llave',
        llaveprimaria: 'llaveprimaria',
        fields: readerdina
    });

    cmCaracterizacion = new Ext.grid.ColumnModel(cmdina);

//para recorrer los indices dinamicos y trabajar con el render
    for (var i = 0; i < arrayIndexDinamicos.length; i++) {
        var indiceColumn = cmCaracterizacion.findColumnIndex(arrayIndexDinamicos[i]);
        cmCaracterizacion.setRenderer(indiceColumn, function (value, m, rec, row, col) {
            m.attr = 'ext:qtip="' + getRawValue(value, cmCaracterizacion.getCellEditor(col, row).field, cmCaracterizacion, col) + '"';
            return getRawValue(value, cmCaracterizacion.getCellEditor(col, row).field, cmCaracterizacion, col);
        });
    }
    for (var i = 0; i < arrayIndexDinamicosNum.length; i++) {
        var indiceColumn = cmCaracterizacion.findColumnIndex(arrayIndexDinamicosNum[i]);
        cmCaracterizacion.setRenderer(indiceColumn, function (value, m) {
            if (value != null) {
                m.attr = 'ext:qtip="' + value + '"';
                return value;
            } else {
                m.attr = 'ext:qtip="' + 0 + '"';
                return 0;
            }

        });
    }
    for (var i = 0; i < arrayIndexDinamicosCad.length; i++) {
        var indiceColumn = cmCaracterizacion.findColumnIndex(arrayIndexDinamicosCad[i]);
        cmCaracterizacion.setRenderer(indiceColumn, function (value, m) {
            if (value != null) {
                m.attr = 'ext:qtip="' + value + '"';
                return value;
            } else {
                m.attr = 'ext:qtip=""';
                return '';
            }
        });
    }
    stCaracterizacion = new Ext.data.Store({
        url: 'listarDatosEntidadVariable',
        listeners: {
            beforeLoad: function () {
                this.baseParams.identidad = identidad;
                this.baseParams.idvariable = attributesElem.id;
                this.baseParams.idtipomodelo = attributesElem.idtipomodelo;
                this.baseParams.start = offset;
                this.baseParams.global = Ext.getCmp('chkglobalGI').getValue();
                this.baseParams.filtrosD = Ext.encode(filtrosCaracterizacion.getFilterData());
                cambiarTituloFiltrarEntidades();
            },
            load: function (st, rec, obj) {
            },
            loadexception: function () {
                mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
            }
        },
        reader: jrstCaracterizacion
    });
    filtrosCaracterizacion = new Ext.grid.GridFilters({
        filters: filterDinamico
    });
    btnLimpiarcaract = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarcaract',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            accionbtnLimpiarcaract();
        }
    });
    pggpCaracterizacion = new Ext.PagingToolbar({
        pageSize: 20,
        store: stCaracterizacion,
        displayInfo: true,
        items: [btnLimpiarcaract],
        listeners: {
            beforechange: function (p, e) {
                offset = e.start;
            }
        }
    });
}
function crearGrid(filtrosCaracterizacion, stCaracterizacion, cmCaracterizacion, pggpCaracterizacion, smCaracterizacion) {
    return new Ext.grid.EditorGridPanel({
        store: stCaracterizacion,
        id: 'gpCaracterizacion',
        region: 'center',
        sm: smCaracterizacion,
        cm: cmCaracterizacion,
        frame: true,
        plugins: filtrosCaracterizacion,
        margins: '2 2 2 -4',
        clicksToEdit: 2,
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        bbar: pggpCaracterizacion,
        listeners: {
            beforeedit: function (e) {
                columna = e.column;
                //para el renderer luego
                cmCaracterizacion.getCellEditor(e.column, e.row).field.renderiza = true;
            },
            validateedit: function (e) {
                if (e.originalValue != e.value)
                    cmCaracterizacion.getCellEditor(e.column, e.row).field.renderiza = true;
            }
        }
    });
}
function Guardar() {
    var editadas = stCaracterizacion.getModifiedRecords();
    var count = 0;
    var obj = {};
    var arreglo = [];
    var llave = jrstCaracterizacion.jsonData.llave;
    var llaveprimaria = jrstCaracterizacion.jsonData.llaveprimaria;
    while (editadas.length > 0) {
        var record = editadas.pop();
        var rec = record.getChanges();
        for (k in rec) {
            if (typeof (rec[k]) == 'object') {
                if (rec[k]) {
                    rec[k] = rec[k].format('d/m/Y');
                }
            }
        }

        if ((Object.keys(rec).length > 0 && !rec['valor']) || Object.keys(rec).length > 1) {
            rec[llaveprimaria] = record.data[llaveprimaria];
            rec['insertarenmeta'] = true;
        }

        rec['idvariablecontrolentidad'] = record.data['idvariablecontrolentidad'];
        count++;
        arreglo.push(rec);
    }
    obj['idtipomodelo'] = attributesElem.idtipomodelo;
    obj.filas = Ext.encode(arreglo);
    Ext.Ajax.request({
        url: 'Guardar',
        params: obj,
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgM) {
                if (responseData.codMsgM == 20) {
                    mostrarMensaje(1, perfil.etiquetas.msgGuardados);
                    stCaracterizacion.reload();
                } else {
                    editadas.push(record);
                    if (responseData.codMsgM == 3) {
                        mostrarMensaje(3, perfil.etiquetas.msgErrorAction)
                    }
                }
            } else {
                editadas.push(record);
                mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
            }
        }
    });
}
function HabilitarEditores(varbool) {
    var ind = cmCaracterizacion.findColumnIndex('valor');
    cmCaracterizacion.setEditable(ind, varbool);
    for (var i = 0; i < arrayIndexDinamicosTodos.length; i++) {
        var indiceColumn = cmCaracterizacion.findColumnIndex(arrayIndexDinamicosTodos[i]);
        cmCaracterizacion.setEditable(indiceColumn, varbool);
    }
}
function asociarDeasociarElemento(accion) {
    btnCancelarElemento = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarElemento',
        text: perfil.etiquetas.lbBtnCancelar,
        tooltip: perfil.etiquetas.lbTtbtnCancelar,
        handler: function () {
            winAsociar.destroy();
        }
    });
    btnAceptarElemento = new Ext.Button({
        iconCls: 'aceptar',
        id: 'btnAceptarElemento',
        nextTab: 'denominacion',
        text: perfil.etiquetas.lbBtnAceptar,
        tooltip: perfil.etiquetas.lbTtbtnAceptar,
        handler: function () {
            asociarDeasociarElementoPeticion(accion);
        }
    });
    var tituloventana = "";
    if (accion == 'a')
        tituloventana = perfil.etiquetas.lbTtbtnAscVar;
    else
        tituloventana = perfil.etiquetas.lbTtbtnDesVar;

    stAsociarentidades = new Ext.data.Store({
        url: 'listarEntidadesAsociar',
        listeners: {
            beforeLoad: function () {
                this.baseParams.accion = accion;
                this.baseParams.idvariable = attributesElem.id;
                this.baseParams.identidadcrea = attributesElem.identidadcrea;
            },
            load: function () {
                if (stAsociarentidades.totalLength == 0) {
                    winAsociar.destroy();
                    mostrarMensaje(1, perfil.etiquetas.msgErrorNoEntidades);
                }
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idestructura'
            }, {
                name: 'denominacion'
            }])
    });
    stAsociarentidades.reload();

    cbAsociarentidades = new Ext.ux.form.LovCombo({
        xtype: 'combo',
        fieldLabel: perfil.etiquetas.lbTtEntidades,
        displayField: 'denominacion',
        id: 'cbAsociarentidades',
        valueField: 'idestructura',
        store: stAsociarentidades,
        autoCreate: true,
        typeAhead: true,
        hiddenName: 'idestructura',
        triggerAction: 'all',
        editable: true,
        anchor: '100%',
        mode: 'local',
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            select: function () {
            }
        }
    });
    fpAsc = new Ext.FormPanel({
        id: 'fpAsc',
        region: 'center',
        autoHeight: true,
        autoDestroy: true,
        autoWidth: true,
        frame: true,
        labelAlign: 'top',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        style: 'margin:0 10 0 10;',
                        layout: 'form',
                        items: cbAsociarentidades
                    }]
            }]
    });
    winAsociar = new Ext.Window({
        title: tituloventana,
        modal: true,
        closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        width: 320,
        autoHeight: true,
        items: fpAsc,
        buttons: [btnCancelarElemento, btnAceptarElemento]
    });
    winAsociar.show();
    pgridCracterizacion.enable();
}
function asociarDeasociarElementoPeticion(accion) {

    var mensa = "";
    if (accion == 'a') {
        mensa = perfil.etiquetas.msgAsociandoVar;
    } else {
        mensa = perfil.etiquetas.msgDesasociandoVar;
    }
    if (fpAsc.getForm().isValid()) {
        fpAsc.getForm().submit({
            url: 'asociarDesasociarElemento',
            params: {
                accion: accion,
                identidad: Ext.encode(cbAsociarentidades.getCheckedValue()),
                idelemento: idelemento,
                idtipomodelo: attributesElem.idtipomodelo,
                idpadre: attributesElem._parent,
                idarbol: attributesElem.idarbol,
                leaf: attributesElem.leaf
            },
            waitMsg: mensa,
            failure: function (form, action) {
                responseData = action.result;
                if (accion == 'a') {
                    mostrarMensaje(1, perfil.etiquetas.msgVarAsociado);
                } else {
                    mostrarMensaje(1, perfil.etiquetas.msgVarDesasociado);
                }
                mostrarMensaje(1, perfil.etiquetas.msgVarDesasociado);
                winAsociar.destroy();
            }
        });
    } else {
        mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);
    }

}






