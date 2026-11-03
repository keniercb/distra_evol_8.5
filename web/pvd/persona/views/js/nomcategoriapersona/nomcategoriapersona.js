/**
 * Nomenclador de la situacion de la persona
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomCategoriaPersona');
PVD.Persona.NomCategoriaPersona.Lang = {
    label: 'Categorías de persona',
    titleGrid: 'Listado de categorías de persona',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar categorías de persona',
    titleWindMod: 'Modificar categorías de persona',
    btnAcept: 'Aceptar',
    btnApply: 'Aplicar',
    btnCancel: 'Cancelar',
    btnAdd: 'Adicionar',
    btnChange: 'Modificar',
    btnRemove: 'Eliminar',
    btnExport: 'Exportar',
    btnHelp: 'Ayuda',

    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar categorías de persona <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar categorías de persona <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar categorías de persona <b>(DEL)</b>',
    ttBtnAcept: 'Guardar datos y cerrar ventana <b>(Enter)</b>',
    ttBtnApply: 'Guardar datos y limpiar los campos <b>(Alt+P)</b>',
    ttBtnCancel: 'Cerrar ventana sin guardar datos <b>(Alt+X)</b>',
    ttBtnExport: 'Exportar datos del nomenclador <b>(Alt+E)</b>',
    ttBtnHelp: 'Ayuda de la funcionalidad <b>(Alt+H)</b>',

    /**
     * Formulario
     */
    tfDenomination: 'Denominación',
    taDescription: 'Descripción',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    chbxCargoAsoc: 'Cargo Asociado',
    colDenominacion: 'Denominación',
    searchText: 'Criterio a buscar...',
    displayMsg: 'Mostrando ',
    emptyMsg: 'No hay resultados para mostrar.',

    /**
     * Mensages de las acciones.
     */
    loadMask: 'Cargando...',
    msgDel: 'La(s) categoría(s) de persona ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'La categorías de persona seleccionada no se puede eliminar debido a que está en uso.',
    msgAdd: 'La categorías de persona ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La categorías de persona que quiere adicionar ya existe.',
    msgNotMod: 'La categorías de persona ya existe.',
    msgMod: 'La categorías de persona ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del Categorías de persona',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar la(las) categoría(s) de persona seleccionada(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar la categoría de persona seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las categorías de persona seleccionadas?',
    msgDelS: 'La categoría de persona ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las categorías de persona han sido eliminadas satisfactoriamente.'

};

PVD.Persona.NomCategoriaPersona.ViewForm = Ext.extend(Ext.Window, {
    border: false,
    modal: true,
    closeAction: 'hide',
    autoHeigth: true,
    width: 420,
    resizable: false,
    initComponent: function () {
        var self = this;
        var lang = PVD.Persona.NomCategoriaPersona.Lang;

        this.btnAcept = new Ext.Button({
            id: 'btnAcept' + self.id,
            nextTab: 'tfDenomination' + self.id,
            prevTab: 'btnApply' + self.id,
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana <b>(Enter)</b>',
            iconCls: 'aceptar'
        });

        this.btnApply = new Ext.Button({
            id: 'btnApply' + self.id,
            nextTab: 'btnAcept' + self.id,
            prevTab: 'btnCancel' + self.id,
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos <b>(Alt+P)</b>',
            iconCls: 'aplicar'
        });

        this.btnCancel = new Ext.Button({
            id: 'btnCancel' + self.id,
            nextTab: 'btnApply' + self.id,
            prevTab: 'taDescription' + self.id,
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar datos <b>(Alt+X)</b>',
            iconCls: 'cancelar',
        });

        this.tfDenomination = this.tfDenomination || new Ext.form.TextField({
                id: 'tfDenomination' + self.id,
                nextTab: 'tfAlia' + self.id,
                prevTab: 'btnAcept' + self.id,
                fieldLabel: 'Denominación',
                name: 'denominacion',
                allowBlank: false,
                anchor: '100%',
                vtype: 'denominacion'
            });

        this.tfAlia = this.tfAlia || new Ext.form.TextField({
                id: 'tfAlia' + self.id,
                fieldLabel: 'Alias',
                nextTab: 'fdesde' + self.id,
                prevTab: 'tfDenomination' + self.id,
                name: 'alia',
                allowBlank: false,
                anchor: '100%'
            });

        this.taDescription = this.taDescription || new Ext.form.TextArea({
                id: 'taDescription' + self.id,
                nextTab: 'btnCancel' + self.id,
                prevTab: 'fhasta' + self.id,
                fieldLabel: 'Descripción',
                name: 'descripcion',
                anchor: '100%',
                height: 90
            });

        this.dfFrom = this.dfFrom || new Ext.form.DateField({
                name: 'fdesde',
                id: 'fdesde' + self.id,
                nextTab: 'fhasta' + self.id,
                prevTab: 'tfDenomination' + self.id,
                fieldLabel: 'Fecha inicio',
                anchor: '90%',
                allowBlank: false,
                format: 'd/m/Y',
                value: new Date().format('d/m/Y'),
                vtype: 'daterange',
                endDateField: 'fhasta' + self.id
            });

        this.dfUp = this.dfUp || new Ext.form.DateField({
                name: 'fhasta',
                id: 'fhasta' + self.id,
                nextTab: 'taDescription' + self.id,
                prevTab: 'fdesde' + self.id,
                fieldLabel: 'Fecha fin',
                anchor: '100%',
                format: 'd/m/Y',
                value: '',
                vtype: 'daterange',
                startDateField: 'fdesde' + self.id
            });

        this.form = new Ext.form.FormPanel({
            frame: true,
            region: 'center',
            bodyStyle: 'padding: 5px 5px 0',
            border: false,
            autoHeigth: true,
            labelWidth: 90, //Con esto hacemos mas pequeñas las etiquetas
            labelAlign: 'top',
            items: this.itemsForm || [
                self.tfDenomination, self.tfAlia, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [self.dfFrom]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [self.dfUp]
                        }
                    ]
                }
            ]

        });

        this.items = [this.form];

        this.buttons = [this.btnCancel, this.btnApply, this.btnAcept];

        this.keys = [
            {
                key: Ext.EventObject.ENTER,
                stopEvent: true,
                fn: function () {
                    self.btnAcept.handler();
                }
            },
            {
                key: 'p',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnApply.disabled) {
                        self.btnApply.handler();
                    }
                }
            },
            {
                key: 'x',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnCancel.disabled) {
                        self.btnCancel.handler();
                    }
                }
            }
        ];
        PVD.Persona.NomCategoriaPersona.ViewForm.superclass.initComponent.call(this);
    }
});
PVD.Persona.NomCategoriaPersona.Model = function (url) {

    this.store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        autoLoad: false,
        remoteSort: true,
        url: url,
        listeners: {
            beforeexpandnode: function (st, record) {
                st.baseParams.idcategoriapersona = record.get('idcategoriapersona');
            },
            beforeload: function (st, options) {
                //Validacion para que no expanda los nodos hijos
                if (st.active_node && st.active_node.data._is_leaf) {
                    return false;
                }
            }
        },
        reader: new Ext.data.JsonReader({
                id: 'idcategoriapersona',
                root: 'data',
                total: 'quantity',
                successProperty: 'success'
            },
            [
                {
                    name: 'idcategoriapersona'
                },
                {
                    name: 'idpadre'
                },
                {
                    name: '_parent'
                },
                {
                    name: '_is_leaf'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'alia'
                },
                {
                    name: 'fhasta'
                },
                {
                    name: 'fhasta'
                }

            ]
        )
    });

};

PVD.Persona.NomCategoriaPersona.ViewGrid = Ext.extend(Ext.tree.TreeGrid, {
    border: false,
    rootVisible: false,
    initComponent: function () {
        //Variables
        var self = this;
        var idpadre;
        this.referencia = 'nomcategoriapersona';
        var lang = PVD.Persona.NomCategoriaPersona.Lang;

        this.btnAdd = new Ext.Button({
            id: 'btnAdd' + self.id,
            text: 'Ad<u>i</u>cionar',
            nextTab: 'btnChange' + self.id,
            prevTab: 'btnHelp' + self.id,
            tooltip: 'Adicionar Categorías de persona<b>(Alt+I)</b>',
            iconCls: 'adicionar'
        });

        this.btnChange = new Ext.Button({
            disabled: true,
            id: 'btnChange' + self.id,
            nextTab: 'btnRemove' + self.id,
            prevTab: 'btnAdd' + self.id,
            text: '<u>M</u>odificar',
            tooltip: 'Modificar Categorías de persona<b>(Alt+M)</b>',
            iconCls: 'modificar'
        });

        this.btnRemove = new Ext.Button({
            disabled: true,
            id: 'btnRemove' + self.id,
            nextTab: 'search' + self.id,
            prevTab: 'btnChange' + self.id,
            text: 'Eliminar',
            tooltip: 'Eliminar Categorías de persona<b>(DEL)</b>',
            iconCls: 'eliminar'

        });

        this.btnHelp = new Ext.Button({
            id: 'btnHelp' + self.id,
            text: 'Ayuda',
            nextTab: 'btnAdd' + self.id,
            prevTab: 'search' + self.id,
            tooltip: 'Ayuda de la funcionalidad <b>(Alt+H)</b>',
            iconCls: 'ayuda'

        });

        /**
         * Expande todos los nodos
         * @type {Button}
         */
        this.btnExpandAll = new Ext.Button({
            iconCls: 'expandir',
            tooltip: 'Expandir <b>(Alt+Abajo)</b>',
            scope: this

        });

        /**
         * Contrae a todos los nodos
         * @type {Button}
         */
        this.btnCollapseAll = new Ext.Button({
            iconCls: 'contraer',
            tooltip: 'Contraer <b>(Alt+Arriba)</b>',
            scope: this
        });

        this.btnUpdate = new Ext.Button({
            iconCls: 'actualizar',
            //icon: perfil.dirImg + 'actualizar.png',
            tooltip: 'Actualizar<b>(Ctrl+Alt+Z)</b>',
            scope: this
        });

        this.columns = [
            {
                header: 'Denominación',
                dataIndex: 'denominacion',
                width: 450
            },
            {
                header: 'Alias',
                dataIndex: 'alia',
                width: 100
            },
            {
                header: 'Fecha inicio',
                width: 100,
                dataIndex: 'fdesde',
                align: 'center'
            },
            {
                header: 'Fecha fin',
                width: 100,
                align: 'center',
                dataIndex: 'fhasta',
                tpl: new Ext.XTemplate('{fhasta:this.clearDate}', {
                    clearDate: function (v, rec) {
                        if (Ext.isEmpty(v)) {
                            return '';
                        } else {
                            return v;
                        }

                    }
                })
            },
        ];

        this.dataUrl = '/pvd/persona/index.php/nomcategoriapersona/getCategorias';

        this.root = new Ext.tree.AsyncTreeNode({
            id: 'root',
            denominacion: 'Categorías de personal',

            expanded: true,
            uiProvider: Ext.ux.tree.TreeGridNodeUI
        });

        this.tbar = [this.btnAdd, this.btnChange, this.btnRemove, '-', this.btnExpandAll, this.btnCollapseAll, this.btnUpdate, '->', this.btnHelp];

        this.keys = [
            {
                key: 'i',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnAdd.disabled) {
                        self.btnAdd.handler();
                    }

                }
            },
            {
                key: 'm',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnChange.disabled) {
                        self.btnChange.handler();
                    }
                }
            },
            {
                key: 46,//Eliminar
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnRemove.disabled) {
                        self.btnRemove.handler();
                    }
                }
            },
            {
                key: 38,//Contrar
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnCollapseAll.disabled) {
                        self.btnCollapseAll.handler();
                    }
                }
            },
            {
                key: 40,//Expnadir
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnExpandAll.disabled) {
                        self.btnExpandAll.handler();
                    }
                }
            },
            {
                key: 'h',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnHelp.disabled) {
                        self.btnHelp.handler();
                    }
                }
            },
            {
                key: 'z',
                alt: true,
                ctrl: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnUpdate.disabled) {
                        self.btnUpdate.handler();
                    }
                }
            }
        ];

        PVD.Persona.NomCategoriaPersona.ViewGrid.superclass.initComponent.call(this);
        this.winGestion = new PVD.Persona.NomCategoriaPersona.ViewForm({
            lang: lang
        });
        var controller = new PVD.Persona.NomCategoriaPersona.Controller(this, lang, null);
    },
    enfocar: function () {
    }
});


PVD.Persona.NomCategoriaPersona.Controller = function (view, lang, urls) {

    /**
     *Variables necesarias
     *
     */
    var variables = {
        accion: 'add',
        btnpress: 'acp',
        url: null,
        record: null,
        idpadre: null
    };
    var idpadre;

    view.on('expandnode', function (n) {
        delete n.attributes.children;
    });

    /**
     *Mantener controlar el foco del boton adicionar del gridpanel al renderizar
     */
    view.on('render', function (cmp) {
        view.btnAdd.focus();
        view.myMask = new Ext.LoadMask(cmp.body.dom, {
            msg: "Cargando..."
        });

    });

    view.getLoader().on('load', function () {
        view.myMask.hide();
    });

    view.getLoader().on('beforeload', function () {
        view.myMask.show();
    });

    /**
     *  Dispara cuando hay al cambio en la seleccion delos elemtos
     */
    view.getSelectionModel().on('selectionchange', function (sm, node) {


        if (node) { //Verifica que exista algun nodo seleccionado
            variables.record = node.attributes;
            if (node == view.getRootNode()) {
                variables.record = null
                view.btnAdd.enable();
                view.btnChange.disable();
                view.btnRemove.disable();
            } else {
                view.btnAdd.enable();
                view.btnChange.enable();
                view.btnRemove.enable();
            }

        } else {
            view.btnAdd.disable();
            view.btnRemove.disable();
            view.btnChange.disable();
            variables.record = null;
        }
    });

    /**
     * Evento para controlar el foco del boton adicionar al cerrar la ventana
     */
    view.winGestion.on('hide', function () {
        view.btnAdd.focus();
    });

    view.btnExpandAll.setHandler(function () {
        view.expandAll();

    });

    view.btnCollapseAll.setHandler(function () {
        view.collapseAll();
    });

    view.btnUpdate.setHandler(function () {
        view.getLoader().load(view.getRootNode());
        view.expandAll();
    });

    /**
     *Handler del boton Adicionar del gridpanel
     *
     */
    view.btnAdd.setHandler(function () {
        variables.accion = 'add';
        variables.url = '/pvd/persona/index.php/nomcategoriapersona/addCategorias';
        if (variables.record == null) {
            view.winGestion.setTitle('Adicionar categoría de persona');
            view.winGestion.show();
            view.winGestion.btnApply.setVisible(true);
            view.winGestion.form.getForm().reset();
            view.winGestion.tfDenomination.focus(true, 100);
        }
        else {
            view.winGestion.setTitle('Adicionar categoría de persona específica');
            view.winGestion.show();
            view.winGestion.btnApply.setVisible(true);
            view.winGestion.form.getForm().reset();
            view.winGestion.tfDenomination.focus(true, 100);
            var xy = view.winGestion.getPosition();
            var wh = view.winGestion.getSize();
            view.winGestion.updateBox({
                x: xy[0],
                y: xy[1],
                width: wh.width,
                height: wh.height
            });
        }
    });

    /**
     *Handler del boton Modificar del gridpanel
     *
     */
    view.btnChange.setHandler(function () {
        variables.accion = 'mod';
        variables.url = '/pvd/persona/index.php/nomcategoriapersona/modCategorias';
        if (!Ext.isEmpty(variables.record)) {
            if (variables.record.idpadre == variables.record.idcategoriapersona) {
                view.winGestion.setTitle('Modificar categorías de persona');
                view.winGestion.show();
                view.winGestion.btnApply.hide();
                view.winGestion.tfDenomination.setValue(variables.record.denominacion);
                view.winGestion.tfAlia.setValue(variables.record.alia);
                view.winGestion.dfFrom.setRawValue(variables.record.fdesde);
                view.winGestion.dfUp.setRawValue(variables.record.fhasta);
                view.winGestion.form.getForm().loadRecord(view.getSelectionModel().getSelectedNode());
            } else {
                view.winGestion.setTitle('Modificar categorías de persona específico');
                view.winGestion.show();
                view.winGestion.btnApply.hide();
                view.winGestion.tfDenomination.setValue(variables.record.denominacion);
                view.winGestion.tfAlia.setValue(variables.record.alia);
                view.winGestion.dfFrom.setRawValue(variables.record.fdesde);
                view.winGestion.dfUp.setRawValue(variables.record.fhasta);
                view.winGestion.form.getForm().loadRecord(view.getSelectionModel().getSelectedNode());
                var xy = view.winGestion.getPosition();
                var wh = view.winGestion.getSize();
                view.winGestion.updateBox({
                    x: xy[0],
                    y: xy[1],
                    width: wh.width,
                    height: wh.height
                });
            }
        }
    });

    /**
     *Handler del boton Eliminar del gridpanel
     *
     */
    view.btnRemove.setHandler(function () {
        variables.url = '/pvd/persona/index.php/nomcategoriapersona/delCategorias';
        removeNomenclador(variables.url);
    });

    /**
     *Handler del boton Cancelar de la ventana
     *
     */
    view.winGestion.btnCancel.setHandler(function () {
        view.winGestion.hide();
    });

    /**
     *Handler del boton Aceptar de la ventana
     * @param accion='add'
     */
    view.winGestion.btnAcept.setHandler(function () {
        variables.btnpress = 'acp';
        addOrChangeNomenclador(variables.accion, variables.btnpress);
    });

    /**
     *Handler del boton Aplicar de la ventana
     * @param accion='apl'
     */
    view.winGestion.btnApply.setHandler(function () {
        variables.btnpress = 'apl';
        addOrChangeNomenclador(variables.accion, variables.btnpress);
    });

    /**
     *Funcion para eliminar la situacion seleccionada
     */
    function removeNomenclador(url) {
        mostrarMensaje(2, '¿Está seguro que quiere eliminar la categoría de persona seleccionada?', function (btn) {
            if (btn == 'ok') {
                var arr = new Array();
                Ext.each(view.getSelectionModel().getSelectedNode(), function (rec) {
                    arr.push(rec.id);
                });
                PVD.mostrarMascara('mask', 'Por favor espere...', 'Eliminando datos de la categoría de persona.');
                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    params: {
                        idcategoriapersona: Ext.encode(arr)
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('mask');
                        if (responseData.success) {
                            mostrarMensaje('1', 'La categoría de persona ha sido eliminado satisfactoriamente.');
                            view.getLoader().load(view.getRootNode());
                            view.expandAll();
                            view.btnChange.disable();
                            view.btnRemove.disable();
                            view.btnAdd.focus();
                        } else {
                            if (!responseData.success) {
                                mostrarMensaje('3', 'La categoría de persona no se puede eliminar debido a que está en uso.');
                            }
                        }
                    }
                });
            }
        });
    }

    /**
     * Funcion para adicionar o modificar  nacionalidad
     * @param accion Especifica la accion requerida(add,mod)
     * @param btnpress Especifica el boton precionado de la ventena (acp,apl)
     */
    function addOrChangeNomenclador(accion, btnpress) {
        var nom_node = view.getSelectionModel().getSelectedNode();
        if (accion == 'add' || accion == 'mod') {
            if (view.winGestion.form.getForm().isValid()) {
                PVD.mostrarMascara('mask', 'Por favor espere..', 'Enviando datos al servidor.');
                var values = view.winGestion.form.getForm().getValues();
                if (accion == 'add') {
                    values.idpadre = nom_node != null ? nom_node.id : idpadre;
                }
                Ext.Ajax.request({
                    url: variables.url,
                    method: 'POST',
                    params: {
                        idcategoriapersona: (accion != 'add') ? nom_node.id : null,
                        values: Ext.encode(values)
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('mask');
                        if (responseData.success) {
                            var msg = (accion == 'add') ? 'La categoría de persona ha sido adicionado satisfactoriamente.' : 'La categoría de persona ha sido modifcado satisfactoriamente.';
                            mostrarMensaje('1', msg);
                            if (btnpress == 'acp') {
                                view.winGestion.hide();
                                view.winGestion.form.getForm().reset();
                                idpadre=null;
                            } else {
                                    if(view.getSelectionModel().getSelectedNode()){
                                        if(!idpadre){
                                        idpadre=view.getSelectionModel().getSelectedNode().id;
                                        }

                                    }
                                view.winGestion.form.getForm().reset();
                                view.winGestion.tfDenomination.focus(true, 100);
                            }
                            view.getLoader().load(view.getRootNode());
                            view.expandAll();
                        } else {
                            msg = (accion == 'add') ? 'La categoría de persona que quiere adicionar ya existe.' : 'La categoría de persona ya existe.';
                            mostrarMensaje('3', msg);
                        }
                    }
                });
            }
        } else {
            view.winGestion.hide();
            view.winGestion.form.getForm().reset();
        }
    }

    /**
     * Funcion para mostrar el reporte de los nomecladores
     */
    /* function showReport(reporturl, headerdoc) {
     var header = new Array();
     header[0] = 'No.';
     header[headerdoc.length - 1] = 'Descripci&oacute;n';
     for (var i = 1; i < headerdoc.length - 1; i++
     ) {
     header[i] = headerdoc[parseInt(i) + 1];
     }
     var win = new Ext.components.winReporte({
     title: 'Configuración del reporte',
     modal: true,
     layout: 'border',
     params: {
     url: reporturl,
     tiporeporte: 'listado',
     columns: header
     }
     });
     win.show();
     }*/

};
PVD.Persona.NomCategoriaPersona.ViewCombo = Ext.extend(Ext.components.Tree_ComboBox, {
    fieldLabel: PVD.Persona.NomCategoriaPersona.Lang.label,
    lazyInit: false,
    treeConfig: {
        loader: {
            dataUrl: '/pvd/persona/index.php/nomcategoriapersona/getCategorias'
        },
        border: false,
        autoScroll: true,
        rootVisible: false,
        root: {
            text: 'Categorías de persona',
            animate: false,
            draggable: false,
            expanded: false
        }
    },
    clickNode: function (node, e) {
        if (node.isLeaf()) {
            var text = node.text;
            this.setValue(text);
            this.fireEvent('selectNode', node);
            this.collapse();
        }
    },
    initComponent: function () {
        PVD.Persona.NomCategoriaPersona.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_categoriapersona', PVD.Persona.NomCategoriaPersona.ViewCombo);


