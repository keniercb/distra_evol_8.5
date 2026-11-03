/*
 * Componente para gestinar el DPA.
 * 
 * @package configsecodena @copyright UCID Cuba @author Livan A Capote Valdes
 * 
 * @version 1.0-0
 */
if (window.parent.parent.UCID.portal.perfil)
    var perfil = window.parent.parent.UCID.portal.perfil;
else
    perfil = {};
perfil.etiquetas = Object();
var windowParent;
if (window.idwiniframe)
    windowParent = window.parent.Ext.getCmp(window.idwiniframe);
UCID.portal.cargarEtiquetas('gestdpa', cargarInterfaz);
Ext.QuickTips.init();
/*---capturo el idzonaseguridad---*/
var idarea;
var dirpropia = '../../../comun/recursos/iconos/';
var winEditar;
var titulo, idpais, title;
var MenuArbol, res;
var idconceptoestructural;
function cargarInterfaz(perfil, etiquetas) {
    var keyMap = new Ext.KeyMap(Ext.getBody(), [
        {
            key: 'g',
            alt: true,
            ctrl: true,
            fn: function () {
                var btn = btnConfigNivel;
                if (!btn.disabled && !btn.hidden) {
                    btn.handler.call();
                }
            }
        }
    ]);

    actionValidate.validate();

    var btnConfigNivel = new Ext.Button({
        id: 'btnGestionarRelaciones',
        disabled: true,
        hidden: true,
        iconCls: 'gestionarrelaciones',
        text: etiquetas.lbbtnconfNiv,
        tooltip: etiquetas.lbttipconfNiv,
        handler: function () {
            insertarConceptoestructural();
        }
    });
    btnAyudaDPA = new Ext.Button({
        iconCls: 'ayuda',
        id: 'bntAyudaDPA',
        text: etiquetas.lbbtnHelp,
        nextTab: 'cbPais',
        tooltip: etiquetas.lbttipHelp
        /*handler: function() {
         //var title = etiquetas.titleH1;
         //var referencia = 'confin/Configuracion/DP/gestionardpt';
         //help.show(title, referencia);
         help.show(etiquetas.titleH1, 'CG/dpa/gestdpa');

         }*/
    });

    /*----------------------------------------------------------------------------*/
    /*--------------------------Declaración de variables--------------------------*/

    var periodos, panel, rootPerio, nodoAc;
    var Tree = Ext.tree;
    var record, textomenu;
    var arreglo = [];
    var titlee;

    /*----------------------------------------------------------------------------*/
    /*---------Declaracion del store para cargar el nomenclador de niveles--------*/
    var stPaises = new Ext.data.Store({
        url: 'getPaises',
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad_filas",
            root: "root",
            id: "idpais"
        }, [{
            name: 'idpais'
        }, {
            name: 'nombrepais'
        }])
    });
    stPaises.load();
    var cbPais = new Ext.form.ComboBox({
        emptyText: etiquetas.seleccione,
        allowBlank: true,
        id: 'cbPais',
        width: '90%',
        store: stPaises,
        editable: true,
        valueField: 'idpais',
        displayField: 'nombrepais',
        hiddenName: 'idpais',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        forceSelection: true,
        tpl: '<tpl for="."><div ext:qtip="{nombrepais}" class="x-combo-list-item">{nombrepais}</div></tpl>',
        listeners: {
            select: function () {

                titulo = cbPais.getRawValue();
                idpais = cbPais.getValue();

                var tree = Ext.getCmp('periodos');
                tree.getRootNode().setText(titulo);
                tree.getRootNode().enable();
                /* Mando a recargar el árbol */
                periodos.getRootNode().reload();
            }
        }
    });
    var myTreeLoader = new Tree.TreeLoader({
        dataUrl: 'cargarEstructuraplan',
        listeners: {
            beforeload: function (jaja, node, callback) {
                this.baseParams.idpais = idpais;
                if (node.text == etiquetas.lbtitlePer) {
                    mostrarMensaje(1, etiquetas.NodelPais);
                }
            }
        }
    });
    /*----------------------------------------------------------------------------*/
    /*----------------Declaración del árbol del plan de ordenamiento--------------*/

    periodos = new Tree.TreePanel({
        useArrows: true,
        margins: '5 0 5 5',
        id: 'periodos',
        title: etiquetas.lbtitlePer,
        autoScroll: true,
        region: 'west',
        height: 500,
        width: 270,
        animate: true,
        enableDD: false,
        containerScroll: true,
        tbar: [etiquetas.lbtext, '-', cbPais],
        loader: myTreeLoader,
        listeners: {
            click: function (nodo) {
                nodosel = nodo;
                if ((nodo.text != etiquetas.lbtitlePer)
                    && (nodo.text == titulo)) {
                    btnConfigNivel.enable();
                } else {
                    btnConfigNivel.disable();
                }
                if (nodoAc != nodo) {
                    idarea = nodo.id;
                    panel.enable();
                    stestructurabaselegal.load({
                        params: {
                            /*start: 0,
                             limit: 20,
                             */idpadre: idarea
                        }
                    });
                }
            }
        }
    });
    rootPerio = new Tree.AsyncTreeNode({
        text: etiquetas.lbtitlePer,
        draggable: false,
        id: 'idpadre',
        disabled: true
    });
    periodos.setRootNode(rootPerio);


    periodos.on('contextmenu', function (n, e) {
        var aux = (n.id == 'idpadre') ? n.id : n.attributes.idnivelestructural;
        accion = "Adicionar";
        sufix = "";
        idop = "";
        nodosel = n;
        selccUltimo = "estructura";
        textomenu = n.text;
        title = textomenu;
        var contextMenu;
        if (n.attributes.raiz == 1 || n.id == 'idpadre') {
            Ext.Ajax.request({
                url: 'construirMenu',
                success: function (resp, obj) {
                    res = resp.responseText;
                    eval("var oRes=" + res);
                    MenuArbol = oRes;
                    var temp = dameGridMenu(MenuArbol);
                    contextMenu = new Ext.menu.Menu({
                        items: [{
                            text: etiquetas.lbAccionAdd,
                            iconCls: '',
                            menu: temp,
                            scope: this

                        }, {
                            text: etiquetas.lbAccionSet,
                            handler: function () {
                                accion = 'Modificar';
                                mod();
                            }
                        }, {
                            text: etiquetas.lbAccionDel,
                            handler: function () {
                                accion = 'Eliminar';
                                id = 'elimNEI';
                                elim();
                                stestructurabaselegal.reload();

                            }
                        }]
                    });
                    if (n.id == "idpadre") {
                        if (temp.items.length == 0)
                            contextMenu.items.items[0].disable();
                        else {
                            contextMenu.items.items[0].enable();
                        }

                        contextMenu.items.items[1].disable();
                        contextMenu.items.items[2].disable();
                    }
                    else {
                        contextMenu.items.items[1].enable();
                        contextMenu.items.items[2].enable();
                    }


                    if (temp.items.length > 0) {
                        contextMenu.items.items[0].enable();
                    }
                    else {
                        contextMenu.items.items[0].disable();
                    }
                    contextMenu.showAt(e.getXY());
                },
                params: {
                    idtabla: aux,
                    tipo: titulo
                }
            })


        } else {

            Ext.Ajax.request({
                url: 'construirMenu',
                success: function (resp, obj) {

                    res = resp.responseText;
                    eval("var oRes=" + res);
                    MenuArbol = oRes;
                    var temp = dameGridMenu(MenuArbol);
                    contextMenu = new Ext.menu.Menu({
                        items: [{
                            text: etiquetas.lbAccionAdd,
                            iconCls: '',
                            menu: temp,
                            scope: this

                        }, {
                            text: etiquetas.lbAccionSet,
                            handler: function () {
                                accion = 'Modificar';
                                mod();

                            }
                        }, {
                            text: etiquetas.lbAccionDel,
                            id: 'elimNEI',
                            handler: function () {
                                accion = 'Eliminar';
                                elim();
                            }
                        }]
                    });
                    ///...Verificar los items...///
                    if (temp.items.length > 0) {
                        contextMenu.items.items[0].enable();
                    }
                    else {
                        contextMenu.remove(contextMenu.items.items[0]);
//                        contextMenu.items.items[0].disable();
                    }
                    contextMenu.showAt(e.getXY());
                },
                params: {
                    idtabla: aux,
                    tipo: titulo
                }
            })
        }

        if (!Encontrado(n.id)) {
            arreglo = Ext.encode(arreglo)
            nsl = n;
        }
    });
    /*----------------------------------------------------------------------------*/
    /*----Declaración de los componentes del grid de actividades permitidas-------*/

    /*----------------------------------------------------------------------------*/
    /*-----Declaración del SelectionModel del grid de actividades permitidas------*/
    var smestructurabaselegal = new Ext.grid.RowSelectionModel({
        singleSelection: true,
        listeners: {
            rowselect: function (sm, rowI, record) {
                Ext.getCmp('idgridestructuralegal').getView().addRowClass(rowI, "negrita");
                gridActual = record;
            },
            rowdeselect: function (selectioModel, rowIndex, record) {
                Ext.getCmp('idgridestructuralegal').getView().removeRowClass(rowIndex, "negrita");
            }
        }
    });

    /*---------------------------------------------------------------------------*/
    /*--------Declaración del Store del grid de actividades permitidas------------*/
    stestructurabaselegal = new Ext.data.Store({
        url: 'cargarDpa',
        baseParams: {
            start: 0,
            limit: 20,
            idpadre: null,
            idpais: null
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad_filas",
            root: 'root',
            id: 'idbaselegal'
        }, [{
            name: 'idbaselegal'
        }, {
            name: 'abreviatura'
        }, {
            name: 'denominacion'
        }, {
            name: 'fechainicio'
        }, {
            name: 'fechafin'
        }, {
            name: 'codigo'
        }, {
            name: 'conceptonivel'
        }
        ]),
        listeners: {
            beforeload: function (st, opt) {
                st.baseParams.idpadre = idarea;
                st.baseParams.idpais = idpais;
            }
        }
    });

    function coloresSituacion(val, metaData, record, rowIndex, colIndex, store) {
        if (record.get('fechafin') != null && val != null) {
            return '<span style="color:red;">' + val + '</span>';
        }
        return val;
    }

    /*-------------------------------------------------------------*/
    /*--------------------Declaración del grid---------------------*/
    var gridestructurabaselegal = new Ext.grid.GridPanel({
        border: false,
        title: etiquetas.lbtitleListDPT,
        region: 'center',
        id: 'idgridestructuralegal',
        viewConfig: {forceFit: true},
        autoExpandColumn: 'expandir',
        store: stestructurabaselegal,
        loadMask: {
            msg: etiquetas.msg
        },
        columns: [{
            hidden: true,
            hideable: false,
            renderer: coloresSituacion,
            dataIndex: 'idbaselegal'
        }, {
            id: 'expandir',
            header: etiquetas.lbheaderDen,
            renderer: coloresSituacion,
            dataIndex: 'denominacion'
        }, {
            header: 'C&oacute;digo',
            renderer: coloresSituacion,
            dataIndex: 'codigo'
        }, {
            width: 160,
            header: etiquetas.lbheaderAbre,
            renderer: coloresSituacion,
            dataIndex: 'abreviatura'
        }, {
            width: 160,
            header: 'Tipo',
            renderer: coloresSituacion,
            dataIndex: 'conceptonivel'
        }, {
            width: 100,
            header: etiquetas.lbheaderFechai,
            renderer: coloresSituacion,
            dataIndex: 'fechainicio'
        },
            {
                width: 100,
                header: etiquetas.lbheaderFechaf,
                renderer: coloresSituacion,
                dataIndex: 'fechafin'
            }],
        sm: smestructurabaselegal,
        tbar: [
            '->',
            sfDpa = new Ext.Cont.SearchField({
                id: 'sfDpa',
                width: 250,
                regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,]+ ?[a-zA-Z0-9\s]*)+$/,
                maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,]+ ?[a-zA-Z0-9\s]*)+$/,
                emptyText: 'Criterio a buscar...',
                //clearTooltip: etiquetas.lbclearTooltip,
                searchTooltip: 'Buscar divisiones pol&iacute;tico-administrativas',
                fnOnSearch: function () {
//            var st = gridestructurabaselegal.getStore();
                    stestructurabaselegal.baseParams.filter = this.getValue();
                    stestructurabaselegal.reload();
                },
                fnOnClear: function () {
//            var st = gridestructurabaselegal.getStore();
                    delete stestructurabaselegal.baseParams.filter;
                    stestructurabaselegal.load();
                }
            })
        ],
        bbar: new Ext.Cont.PagingToolbar({
            pageSize: 20,
            store: stestructurabaselegal,
            displayInfo: true,
            displayMsg: etiquetas.displayMsg,
            emptyMsg: 'Ning&uacute;n resultado que mostrar.',
            prevText: etiquetas.beforePageText,
            nextText: etiquetas.afterPageText,
            firstText: etiquetas.firstPageText,
            lastText: etiquetas.lastPageText
        })

    });
    /*----------------------------------------------------------------------------*/
    /*--------------------------Declaración del panel-----------------------------*/
    panel = new Ext.Panel({
        tbar: [btnConfigNivel, '->', btnAyudaDPA],
        layout: 'border',
        region: 'center',
        items: gridestructurabaselegal,
        margins: '5 5 5 5',
        disabled: false,
        keys: [
            new Ext.KeyMap(document, [{
                key: "h",
                alt: true,
                fn: function () {
                    cargarAyuda();
                }
            }, {
                key: 'b',
                alt: true,
                fn: function () {
                    if (Ext.getCmp('sfDpa').getRawValue().length > 0) {
                        Ext.getCmp('sfDpa').onTrigger2Click();
                    } else {
                        Ext.getCmp('sfDpa').focus();
                    }
                }
            }, {
                key: 'l',
                alt: true,
                fn: function () {
                    if (Ext.getCmp('sfDpa').getRawValue().length > 0) {
                        Ext.EventObject.stopEvent();
                        Ext.getCmp('sfDpa').onTrigger1Click();
                    }
                }
            }])]
    });
    panel.on('afterlayout', function () {
        cbPais.focus(false, 10);
    });

    /*----------------------------------------------------------------------------*/
    /*-----------------------Declaración del Viewport-----------------------------*/
    var vpGestSistema = new Ext.Viewport({
        layout: 'border',
        items: [periodos, panel]
    });

    function dameGridMenu(aJSonGrid1) {

        var json = aJSonGrid1.menu;

        var menu = new Ext.menu.Menu();
        for (i = 0; i < json.length; i++) {

            menu.add({
                text: json[i].text,
                id: json[i].id,
                handler: function () {
                    textomenu = this.text;
                    title = textomenu;
                    var temp = this.text.toLowerCase();
                    textomenu = temp;


                    idtabla = this.getId();
                    traerJsonAjaxForm("construirformularioinsercion", {
                        idtabla: this.getId(),
                        text: textomenu
                    });

                }
            });
        }

        return menu;
    }

    function Encontrado(nodeid) {
        for (i in arreglo) {
            if (arreglo[i] == nodeid)
                return true;
        }
        return false;
    }

    function mostrarVCompGen(aJSonItems) {
        var desabilitado;
        if (accion == "Modificar") {
            desabilitado = true;
            isOpenWI = false;
            isOpenWM = true;
        } else {
            desabilitado = false;
            isOpenWI = true;
            isOpenWM = false;

        }

        if (aJSonItems.codMsg) {
            return;
        }
        urlForm = aJSonItems[1].url;
        var items = creaArrayItems(aJSonItems);

        formulario = new Ext.FormPanel({
            labelAlign: 'top',
            bodyStyle: 'padding:5px 5px 0',
            autoHeight: true,
            frame: true,
            items: {
                layout: 'column',
                items: items
            }
        });
        Ext.getCmp('denominacion').addListener('keyup', function () {
            activarBotonesWin(aJSonItems);
        });
        Ext.getCmp('codigo').addListener('keyup', function () {
            activarBotonesWin(aJSonItems);
        });
        Ext.getCmp('abreviatura').addListener('keyup', function () {
            activarBotonesWin(aJSonItems);
        });
        Ext.getCmp('fechainicio').addListener('keyup', function () {
            activarBotonesWin(aJSonItems);
        });
        Ext.getCmp('fechafin').addListener('keyup', function () {
            activarBotonesWin(aJSonItems);
        });
        Ext.getCmp('denominacion').addListener('change', function () {
            activarBotonesWin(aJSonItems);
        });
        Ext.getCmp('codigo').addListener('change', function () {
            activarBotonesWin(aJSonItems);
        });
        Ext.getCmp('abreviatura').addListener('change', function () {
            activarBotonesWin(aJSonItems);
        });
        Ext.getCmp('fechainicio').addListener('change', function () {
            activarBotonesWin(aJSonItems);
        });
        Ext.getCmp('fechafin').addListener('change', function () {
            activarBotonesWin(aJSonItems);
        });

        vCompGenDPA = new Ext.Window({
            title: '',
            layout: 'fit',
            width: 560,
            constrain: true,
            autoHeight: true,
            modal: true,
            height: 200,
            items: formulario,
            buttons: [{
                text: etiquetas.lbbtnCancel,
                tooltip: etiquetas.lbttipCancel,
                iconCls: 'cancelar',
                handler: function () {
                    Ext.getCmp('idbtnAceptarDPA').disable();
                    Ext.getCmp('btnAplicarDPA').disable();
                    vCompGenDPA.destroy();
                    stestructurabaselegal.reload();
                    isOpenWI = false;
                    isOpenWM = false;

                }
            }, {
                text: etiquetas.lbbtnApl,
                tooltip: etiquetas.lbttipApl,
                id: 'btnAplicarDPA',
                disabled: true,
                iconCls: 'aplicar',
                hidden: desabilitado,
                handler: function () {
                    adicionarDatos('apl')
                }
            }, {
                text: etiquetas.lbbtnAcep,
                tooltip: etiquetas.lbttipAcep,
                id: 'idbtnAceptarDPA',
                disabled: true,
                iconCls: 'aceptar',
                nextTab: 'denominacion',
                handler: function () {

                    if (accion == "Modificar") {
                        if (aJSonItems[6].value != null) {
                            if (aJSonItems[2].value == Ext.getCmp('denominacion').getValue()
                                && aJSonItems[3].value.toString() == Ext.getCmp('codigo').getValue().toString()
                                && aJSonItems[4].value.toString() == Ext.getCmp('abreviatura').getValue().toString()
                                && aJSonItems[5].value.toString() == Ext.getCmp('fechainicio').getRawValue().toString()
                                && aJSonItems[6].value.toString() == Ext.getCmp('fechafin').getRawValue().toString()
                            ) {
                                mostrarMensaje(1, etiquetas.msgEpaMod);
                            } else
                                adicionarDatos();
                        } else {
                            if (aJSonItems[2].value.toString() == Ext.getCmp('denominacion').getValue().toString()
                                && aJSonItems[3].value.toString() == Ext.getCmp('codigo').getValue().toString()
                                && aJSonItems[4].value.toString() == Ext.getCmp('abreviatura').getValue().toString()
                                && aJSonItems[5].value.toString() == Ext.getCmp('fechainicio').getRawValue().toString()
                                && Ext.getCmp('fechafin').getRawValue().toString() == ''
                            ) {
                                mostrarMensaje(1, etiquetas.msgDpaNoMod);
                            } else
                                adicionarDatos();
                        }
                    } else
                        adicionarDatos();
                }
            }]
        });
        vCompGenDPA.setTitle(accion + ' ' + title);
        vCompGenDPA.show(this);
        Ext.getCmp('denominacion').focus(false, 10);
        document.getElementsByName('nom_organo').value = 5;
    }

    var isOpenWI = false;
    var isOpenWM = false;

    function activarBotonesWin(aJSonItems) {
        if (formulario.getForm().isValid()) {
            if (isOpenWI) {
                Ext.getCmp('idbtnAceptarDPA').enable();
                Ext.getCmp('btnAplicarDPA').enable();
            } else if (isOpenWM) {
                if (aJSonItems[2].value != Ext.getCmp('denominacion').getValue().toString()
                    || aJSonItems[5].value.toString() != Ext.getCmp('fechainicio').getRawValue().toString()
                    || aJSonItems[3].value.toString() != Ext.getCmp('codigo').getValue().toString()
                    || aJSonItems[4].value.toString() != Ext.getCmp('abreviatura').getValue().toString()) {
                    Ext.getCmp('idbtnAceptarDPA').enable();
                } else {
                    if (!aJSonItems[6].value && !Ext.getCmp('fechafin').getRawValue()) {
                        Ext.getCmp('idbtnAceptarDPA').disable();
                    } else if (aJSonItems[6].value.toString() != Ext.getCmp('fechafin').getRawValue().toString()) {
                        Ext.getCmp('idbtnAceptarDPA').enable();
                    } else {
                        Ext.getCmp('idbtnAceptarDPA').disable();
                    }
                }
            }
        } else {
            if (isOpenWI) {
                Ext.getCmp('idbtnAceptarDPA').disable();
                Ext.getCmp('btnAplicarDPA').disable();
            } else if (isOpenWM) {
                Ext.getCmp('idbtnAceptarDPA').disable();
            }
        }
    }

    /*----------------------------------------------------------------------------*/
    /*-------------------Función para traer el formulario-------------------------*/
    function traerJsonAjaxForm(url, params) {
        Ext.Ajax.request({
            url: url,
            success: function (resp, obj) {
                res = resp.responseText;
                eval("var oRes=" + res);
                mostrarVCompGen(oRes);
            },
            params: params
        })
    }

    if (windowParent)
        Ext.UCID.integraInterfaz(tpArbolEstructurae, windowParent);
    /*----------------------------------------------------------------------------*/
    /*------------------Función para adicionar los datos--------------------------*/
    function adicionarDatos(apl) {
        Ext.getCmp('denominacion').setValue(Ext.getCmp('denominacion').getValue().trim());
        Ext.getCmp('codigo').setValue(Ext.getCmp('codigo').getValue().trim());
        Ext.getCmp('abreviatura').setValue(Ext.getCmp('abreviatura').getValue().trim());
        if (Ext.getCmp('denominacion').getValue().toString().length < Ext.getCmp('abreviatura').getValue().toString().length) {
            mostrarMensaje(1, etiquetas.msgAbrvMayorDenominacion);
            if (accion == "Adicionar") {
                Ext.getCmp('btnAplicarDPA').disable();
            }
            Ext.getCmp('idbtnAceptarDPA').disable();
            Ext.getCmp('abreviatura').focus();
            Ext.getCmp('abreviatura').selectText();
            return;
        }
        if (formulario.getForm().isValid()) {
            var parametros;
            switch (accion) {
                case "Adicionar" :
                {
                    parametros = {
                        idpadre: nodosel.id,
                        idtabla: idtabla,
                        SUFIX: sufix,
                        idpais: idpais

                    };

                    break;
                }
                case "Modificar" :
                {
                    if (modificarNodoFilaGrid == "nodo")
                        idfilaOidnodo = idnodo;
                    if (modificarNodoFilaGrid == "fila")
                        idfilaOidnodo = filaSelecGrid;
                    parametros = {
                        idfila: idfilaOidnodo,
                        SUFIX: sufix,
                        idop: idop,
                        iddpa: idLugar
                    };
                    break;
                }
            }
            formulario.getForm().submit({
                url: urlForm,
                params: parametros,
                waitTitle: etiquetas.waitTitle,
                waitMsg: etiquetas.waitMsg,
                failure: function (form, action) {
                    if (accion == "Adicionar") {
                        switch (action.result.codMsgg) {
                            case -1 :
                                mostrarMensaje(1, etiquetas.msgDpaAdd1);
                                break;
                            case -2 :
                                mostrarMensaje(1, etiquetas.msgDpaAdd4);
                                break;
                            case -4 :
                                mostrarMensaje(1, etiquetas.msgDpaAdd2);
                                break;
                            case -3 :
                                mostrarMensaje(1, etiquetas.msgDpaAdd3);
//                                periodos.getRootNode().reload();
                                var tmp = nodosel;
                                periodos.getLoader().load(nodosel, function () {
                                    tmp.expand();
                                });
                                if (!apl) {
                                    vCompGenDPA.destroy();
                                    stestructurabaselegal.reload();
                                } else {
                                    var form = formulario.getForm();
                                    form.reset();
                                }
                                break;
                        }
                    } else if (accion == "Modificar") {
                        switch (action.result.codMsgg) {
                            case -1 :
                                mostrarMensaje(1, etiquetas.msgDpaDel1);
                                break;
                            case -2 :
                                mostrarMensaje(1, etiquetas.msgDpaDel2);
                                break;
                            case -3 :
                                mostrarMensaje(1, etiquetas.msgDpaDel3);
                                break;
                            case -4 :
                                mostrarMensaje(1, etiquetas.msgDpaAdd2);
                                break;
                            case -5 :
                                mostrarMensaje(1, etiquetas.msgDpaAdd4);
                                break;
                            case -6 :
                                mostrarMensaje(1, etiquetas.msgDpaDel4);
                                //periodos.getRootNode().reload();
                                var tmp = nodosel.parentNode;
                                periodos.getLoader().load(nodosel.parentNode, function () {
                                    tmp.expand();
                                });
                                if (!apl) {
                                    vCompGenDPA.destroy();
                                    stestructurabaselegal.reload();
                                } else {
                                    var form = formulario.getForm();
                                    form.reset();
                                }
                                break;
                        }
                    }
                },
                success: function (form, action) {
                    mostrarMensaje(action.result.codMsgg, action.result.mensaje);
                    if (!apl) {
                        vCompGenDPA.destroy();
                        stestructurabaselegal.reload();
                    } else {
                        var form = formulario.getForm();
                        if (accion == "Adicionar")
                            form.reset();
                    }
                    switch (accion) {
                        case "Adicionar" :
                            var nod = nodosel.parentNode;
                            nod.attributes.leaf = false;
//                            loaderEstructura.load(nodosel);
                            loaderEstructura.load(nodosel.parentNode);
                            nod.expand();
                            break;
                        case "Modificar" :
                            switch (selccUltimo) {
                                case "estructura" :
                                    nod = nodosel.parentNode;
                                    loaderEstructura.load(nodosel.parentNode);
                                    nod.expand();
                                    break;
                                case "composicion" :
                                    recargarNodoEstructuraOp();
                                    break;
                            }
                            break;
                    }
                }
            });

        } else {
            if (accion == "Adicionar") {
                Ext.getCmp('btnAplicarDPA').disable();
            }
            Ext.getCmp('idbtnAceptarDPA').disable();
            mostrarMensaje(1, etiquetas.lbmostrarMensaje);

        }
    }

    var modificarNodoFilaGrid;
    /*----------------------------------------------------------------------------*/
    mod = function () {
        modificarNodoFilaGrid = "nodo";
        idnodo = null;

        if (selccUltimo == "estructura")
            idnodo = nodosel.id;
        if (selccUltimo == "composicion")
            idnodo = nodoop.id;
        if (selccUltimo == "composicion" && idnodo.charAt(0) == "c") {
            modificarCargo(nodoop)
        } else
            traerJsonAjaxForm("construirformulariomodificar", {
                idfila: idnodo,
                SUFIX: sufix
            });
    };

    elim = function () {
        var idelim;
        var eliminar;

        eliminarNodoFilaGrid = "nodo";
        idnodo = null;
        if (selccUltimo == "estructura") {
            idnodo = nodosel.id;
            textoNodo = nodosel.text;
        }
        if (selccUltimo == "composicion") {
            idnodo = nodoop.id;
            textoNodo = nodoop.text;
        }
        eliminar = textoNodo;

        idelim = idnodo;

        var msg = etiquetas.lbmostrarMensaje1
        mostrarMensaje(2, msg, function (btn) {

                if (btn == 'ok') {
                    Ext.Msg.wait(etiquetas.waitMsg1, etiquetas.waitTitle);
                    Ext.Ajax.request({
                        url: 'eliminarDpa',
                        success: function () {
                        },
                        failure: function () {
                        },
                        params: {
                            idfila: idelim,
                            SUFIX: sufix
                        },
                        callback: function (options, success, response) {
                            Ext.Msg.hide();

                            responseData = Ext.decode(response.responseText);
                            Ext.Msg.hide();
                            switch (responseData.codMsgg) {
                                case -1:
                                    mostrarMensaje(1, etiquetas.msgDptDel);
                                    periodos.getRootNode().reload();
                                    break;
                                case -3:
                                    mostrarMensaje(1, etiquetas.msgBaseLegalExiste);
                                    break;
                                default:
                                    break;
                            }

                        }
                    })
                }
            }
        );
    };
    /*----------------------------------------------------------------------*/
    /*------Mando a comprobar la existencia del concepto estructural--------*/
    function insertarConceptoestructural() {
        Secodena.mostrarMascara('maskComprobar', '', "");
        Ext.Ajax.request({
            url: 'insertarConceptoEstructural',
            callback: function (options, success, response) {
                Secodena.ocultarMascara('maskComprobar');
                var responseData = Ext.decode(response.responseText),
                    idFuncionalidad = responseData.idfuncionalidad ? responseData.idfuncionalidad[0] ? responseData.idfuncionalidad[0].idfuncionalidad : 300000003969 : 300000003969;
                idconceptoestructural = responseData.idconceptoestructural;
                var url = '../../index.php/gestnivelestructural/gestnivelestructural';
                Cargarniveles(url, idFuncionalidad);
            },
            params: {
                tipo: titulo
            }
        });
    }

    function cargarAyuda() {
        alert('En desarrollo..');
    }

    /*----------------------------------------------------------------------------*/
    /*----------------Para cargar los niveles estructurales-----------------------*/
    function Cargarniveles(direc, idFuncionalidad) {
        vpSize = vpGestSistema.getSize();
        var panelin = new Ext.Panel({
            layout: 'fit',
            region: 'center',
            html: '<iframe id="' + idFuncionalidad + '" style="width:100%; height: 100%; border:none;"></iframe>'
        });
        var winEscl = new Ext.Window({
            layout: 'form',
            width: vpSize.width - 200,
            title: etiquetas.lbGestStructureOf,
            height: vpSize.height - 100,
            constrain: true,
            minimizable: false,
            maximizable: true,
            resizable: false,
            modal: true,
            closeAction: 'destroy',
            listeners: {
                show: function () {
                    winEscl.setTitle(etiquetas.lbGestStructureOf);
                    document.getElementById(idFuncionalidad).src = direc;
                    winEscl.maximize();
                }, destroy: function () {
                    periodos.getRootNode().reload();

                }
            },
            items: [panelin]
        });
        winEscl.show();
    }

    Ext.apply(Ext.form.VTypes, {
        daterange2: function (val, field) {
            var date = field.parseDate(val);
            var dispUpd = function (picker) {
                var ad = picker.activeDate;
                picker.activeDate = null;
                picker.update(ad);
            };
            if (field.startDateField) {
                var sd = Ext.getCmp(field.startDateField);
                sd.maxValue = date;
                if (sd.menu && sd.menu.picker) {
                    sd.menu.picker.maxDate = date;
                    dispUpd(sd.menu.picker);
                }
            } else if (field.endDateField) {
                var ed = Ext.getCmp(field.endDateField);
                ed.minValue = date;
                if (ed.menu && ed.menu.picker) {
                    ed.menu.picker.minDate = date;
                    dispUpd(ed.menu.picker);
                }
            }
            return true;

        }
    });
}
