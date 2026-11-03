Ext.ns('Ext.Person');
/**
 * Componente para gestionar los conceptos y campos del proyecto de persona
 * @type {extend|*|void|extend|extend|extend}
 * @author Ing. Javier Rodriguez Lopez
 */
Ext.Person.WinImportarPersona = Ext.extend(Ext.Window, {
    modal: true,
    closeAction: 'hide',
    constrain: true,
    autoHeight: true,
    resizable: false,
    layout: 'fit',
    border: false,
    initComponent: function () {

        this.title = 'Importar datos';

        this.initButtons();
        this.initForm();

        Ext.Person.WinImportarPersona.superclass.initComponent.call(this);
    },
    initButtons: function () {
        var me = this;

        me.btnCancel = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar'

        });

        me.btnAccept = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar'

        });

        me.buttons = [me.btnCancel, me.btnAccept];
    },
    initForm: function () {
        var me = this;

        me.fufArchivo = new Ext.form.FileUploadField({
            width: '100%',
            fieldLabel: 'Fichero',
            emptyText: 'Seleccione...',
            regex: /^.+\.(zip)$/i,
            regexText: 'Formato inválido, soloa admite *.zip',
            allowBlank: false,
            name: 'conceptfile',
            buttonCfg: {
                text: 'Buscar',
                iconCls: 'buscar'
            }
        });

        me.form = new Ext.FormPanel({
            frame: true,
            fileUpload: true,
            labelAlign: 'top',
            bodyStyle: {padding: '10px 10px 10px 10px'},
            width: 300,
            autoHeight: true,
            items: [me.fufArchivo]
        });

        me.items = [me.form];
    }
});

Ext.Person.TreeConcept = new Ext.extend(Ext.tree.TreePanel, {
    autoScroll: true,
    containerScroll: true,
    animate: true,
    enableDD: true,
    root: {
        text: 'Raiz',
        idproyectoconcepto: 'root',
        expandable: true,
        expanded: true
    },
    initComponent: function () {
        var self = this;

        var duplicatedConcept = [];

        this.btnAdd = new Ext.Button({
            text: 'Ad<u>i</u>cionar',
            iconCls: 'adicionar',
            scope: this,
            handler: this.addNodeHandler
        });

        /**
         * Eliminar concepto
         * @type {Button}
         */
        this.btnDel = new Ext.Button({
            text: 'Eliminar',
            iconCls: 'eliminar',
            disabled: true,
            scope: this,
            handler: this.delNodeHandler
        });

        /**
         * Expande todos los nodos
         * @type {Button}
         */
        this.btnExpandAll = new Ext.Button({
            iconCls: 'expandir',
            tooltip: 'Expandir',
            scope: this,
            handler: function () {
                this.expandAll();
            }
        });

        /**
         * Contrae a todos los nodos
         * @type {Button}
         */
        this.btnCollapseAll = new Ext.Button({
            iconCls: 'contraer',
            tooltip: 'Contraer',
            scope: this,
            handler: function () {
                this.collapseAll();
            }
        });

        this.loader = new Ext.tree.TreeLoader({
            dataUrl: 'loadConcepts',
            listeners: {
                beforeload: function (loader, node, response) {
                    loader.baseParams.idproyecto = this.idproyecto;
                    loader.baseParams.idproyectoconcepto = node.attributes.idproyectoconcepto;
                }.createDelegate(this)
            }
        });

        this.tbar = [this.btnAdd, this.btnDel, '->', this.btnExpandAll, this.btnCollapseAll];
        Ext.Person.TreeConcept.superclass.initComponent.call(this);

        this.getSelectionModel().on('selectionchange', function (sm, node) {
            if (node) { //Verifica que exista algun nodo seleccionado
                if (node.isLeaf() || node.attributes.idproyectoconcepto == null) {
                    this.btnAdd.disable();
                } else {
                    this.btnAdd.enable();
                }

                if (node == this.getRootNode()) {
                    this.btnDel.disable();
                } else {
                    this.btnDel.enable();
                }
            } else {
                this.btnDel.disable();
            }
        }, this);

        this.on('expandnode', this.clearNode);

        this.menuAdd = new Ext.menu.Item({
            text: 'Ad<u>i</u>cionar',
            iconCls: 'adicionar',
            scope: this,
            handler: this.addNodeHandler
        });

        this.menuDel = new Ext.menu.Item({
            text: 'Eliminar',
            iconCls: 'eliminar',
            scope: this,
            handler: this.delNodeHandler
        });

        this.menuReload = new Ext.menu.Item({
            text: 'Actualizar',
            iconCls: 'actualizar',
            scope: this,
            handler: function () {
                this.getLoader().load(this.onNode);
                this.expandNode();
            }
        });

        this.menuExpand = new Ext.menu.Item({
            text: 'Expandir',
            iconCls: 'expandir',
            scope: this,
            handler: this.expandNode
        });

        this.menuContrac = new Ext.menu.Item({
            text: 'Contraer',
            iconCls: 'contraer',
            scope: this,
            handler: function () {
                this.onNode.collapse();
            }
        });

//----------------------Grid de Conceptos Base------------------------------------------------------------------------//

        this.btnAddConceptBase = new Ext.Button({
            text: 'Ad<u>i</u>cionar',
            iconCls: 'adicionar',
            disabled: true,
            scope: this,
            handler: this.addConceptBase
        });

        this.btnCancelConceptBase = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            scope: this,
            handler: function () {
                this.winConceptBase.hide();
            }
        });

        this.btnImport = new Ext.Button({
            id: 'administrador  ',
            iconCls: 'importar',
            tooltip: 'Importar concepto base',
            text: 'Imporar',
            scope: this,
            handler: function () {
                this.importHandler();
            }
        });

        this.stConceptBase = new Ext.data.Store({
            url: 'getCenceptsBase',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
            }, [
                {name: 'denominacion', type: 'string'},
                {name: 'descripcion', type: 'string'},
                {name: 'idconcepto', type: 'int'},
                {name: 'lft', type: 'int'},
                {name: 'rgt', type: 'int'}
            ]),
            listeners: {
                load: function () {
                    duplicatedConcept = [];
                }
            }
        })

        this.smConceptBase = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                selectionchange: function (sm) {
                    this.btnAddConceptBase.setDisabled(sm.getCount() > 0
                        ? (duplicatedConcept.length > 0) ? true : false
                        : true);
                }.createDelegate(this),
                rowselect: function (sm, rowIndex, rec) {
                    this.onNode.eachChild(function (ch) {
                        if (ch.text == rec.get('denominacion')) {
                            Ext.Notification.show({
                                title: 'Informaci&oacute;n',
                                msg: 'El concepto seleccionado ya es parte del proyecto.',
                                icon: 'warning'
                            });
                            duplicatedConcept.push(rec.get('idconcepto'));
                            return false;
                        }
                    });
                }.createDelegate(this),
                rowdeselect: function (sm, rowIndex, rec) {
                    duplicatedConcept.remove(rec.get('idconcepto'));
                }.createDelegate(this)
            }
        });

        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;margin-left:50px;width:300px"><b>Descripci&oacute;n</b>:</b>&nbsp;{descripcion}</p></div>'
            ),
            enableCaching: false
        });

        this.cmConceptBase = [this.smConceptBase, this.expander,
            {header: 'Concepto', dataIndex: 'denominacion', sortable: true}
        ];

        this.gpConceptBase = new Ext.grid.GridPanel({
            sm: this.smConceptBase,
            store: this.stConceptBase,
            columns: this.cmConceptBase,
            margins: '5 5 5 5',
            border: false,
            plugins: this.expander,
            viewConfig: {
                forceFit: true
            },
            tbar: [this.btnImport],
            bbar: new Ext.PagingToolbar({
                store: this.stConceptBase,
                displayInfo: true,
                pageSize: 15
            }),
            loadMask: {
                store: this.stConceptBase
            }
        });

        this.winConceptBase = new Ext.Window({
            title: 'Adicionar conceptos base',
            modal: true,
            closeAction: 'hide',
            width: 478,
            resizable: false,
            height: 300,
            bodyStyle: 'padding 5 5 5 5',
            buttons: [this.btnCancelConceptBase, this.btnAddConceptBase],
            layout: 'fit',
            items: [this.gpConceptBase],
            listeners: {
                show: function () {
                    this.stConceptBase.load();
                }.createDelegate(this)
            }
        });

        this.menuAddConcept = new Ext.menu.Item({
            text: 'Conceptos base',
            iconCls: 'adicionar',
            scope: this,
            hidden: true,
            handler: function () {
                this.winConceptBase.show();
            }
        });

//------------------Registrar conceptos al nomenclador----------------------------------------------------------------//

        this.tfConceptName = new Ext.form.TextField({
            fieldLabel: 'Nombre del concepto',
            maxLength: 255,
            width: 180,
            allowBlank: false,
        });

        this.btnSave = new Ext.Button({
            text: 'Guardar',
            iconCls: 'guardar',
            scope: this,
            handler: this.regNodeHandler
        });

        this.btnCancel = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            scope: this,
            handler: function () {
                this.winRegConcetp.hide();
            }
        });

        this.winRegConcetp = new Ext.Window({
            title: 'Registrar concepto',
            modal: true,
            closeAction: 'hide',
            width: 250,
            resizable: false,
            autoHeight: true,
            buttons: [this.btnCancel, this.btnSave],
            layout: 'fit',
            items: [
                {
                    xtype: 'form',
                    frame: true,
                    bodyStyle: 'padding-left:20px',
                    border: false,
                    autoHeight: true,
                    labelAlign: 'top',
                    items: [this.tfConceptName]
                }
            ]
        });

        this.menuRegConcept = new Ext.menu.Item({
            text: 'Registrar',
            tooltip: 'Registrar concepto como base',
            iconCls: 'registro',
            scope: this,
            hidden: true,
            handler: function () {
                this.winRegConcetp.show();
                this.tfConceptName.setValue(this.onNode.text);
                this.expandNode(this.onNode, true);
            }
        });

        this.on('contextmenu', this.onContextMenu, this);

    },
    expandNode: function (node, deep) {
        (node || this.onNode).expand(deep || false, true);
    },
    clearNode: function (n) {
        delete n.attributes.children;
    },
    addNodeHandler: function () {
        var parentNode = this.getSelectionModel().getSelectedNode() || this.getRootNode();
        if (!parentNode.isLeaf()) {
            var tipo = 0;
            var iconCls = '';
            if (parentNode == this.getRootNode()) {
                tipo = 0;
                iconCls = 'folder_table';
            } else if (parentNode.attributes.tipo == 0) {
                tipo = 1;
                iconCls = 'package';
            } else {
                tipo = 2;
                iconCls = 'agrupador';
            }

            var node = parentNode.appendChild(new Ext.tree.TreeNode({
                text: 'Concepto',
                leaf: false,
                iconCls: iconCls,
                propiedades: Ext.encode({}), //Crea un concepto nuevo con las propiedades vacias
                tipo: tipo,
                idpadre: parentNode.attributes.idproyectoconcepto
            }));
            this.getSelectionModel().select(node);
        }
    },
    delNodeHandler: function () {
        var node = this.getSelectionModel().getSelectedNode();
        if (node && node != this.getRootNode()) {
            mostrarMensaje(2, 'Est&aacute; seguro que quiere eliminar el concepto o campo seleccionado', function (btn) {
                if (btn == 'ok') {
                    if (node.attributes.idproyectoconcepto) {
                        PVD.mostrarMascara('mskaddfield', 'Por favor espere...', 'Eliminando datos');
                        Ext.Ajax.request({
                            url: 'deleteConcept',
                            method: 'POST',
                            params: {
                                idproyectoconcepto: node.attributes.idproyectoconcepto
                            },
                            callback: function (options, success, resp) {
                                PVD.ocultarMascara('mskaddfield');
                                var responseData = Ext.decode(resp.responseText);
                                switch (responseData.codigo) {
                                    case 1:
                                        Ext.Notification.show({
                                            title: 'Informaci&oacute;n',
                                            msg: 'El concepto se ha eliminado satisfactoriamente.',
                                            icon: 'ok'
                                        });
                                        var parentNode = node.attributes.idpadre != node.id
                                            ? this.getNodeById(node.attributes.idpadre)
                                            : this.getRootNode();
                                        this.getLoader().load(parentNode);
                                        parentNode.expand(false, true);
                                        break;
                                    case 3:
                                        Ext.Notification.show({
                                            title: 'Informaci&oacute;n',
                                            msg: 'Ya existe un concepto registrado con esa denominación',
                                            icon: 'error'
                                        });
                                        break;
                                    default :
                                        Ext.Notification.show({
                                            title: 'Informaci&oacute;n',
                                            msg: 'Ha ocurrido un error interno del sistema.Contacte al administrador.',
                                            icon: 'error'
                                        });
                                        break;
                                }
                            }.createDelegate(this)
                        });
                    } else {
                        node.remove();
                    }
                }
            }.createDelegate(this));
        }
    },
    onContextMenu: function (node, e) {
        e.stopEvent();
        this.onNode = node;
        this.getSelectionModel().select(node);
        if (node == this.getRootNode()) {
            this.menuDel.disable();
        } else {
            this.menuDel.enable();
        }

        this.menuAddConcept.setVisible(node.attributes.tipo == '0' ? true : false);
        this.menuRegConcept.setVisible(node.attributes.tipo == '1' ? true : false);
        var expandOrCollapse = node.isExpanded();

        this.menuExpand.setVisible(!node.isLeaf());
        this.menuContrac.setVisible(!node.isLeaf());
        this.menuExpand.setDisabled(expandOrCollapse);
        this.menuContrac.setDisabled(!expandOrCollapse);

        if (!this.menu) { // create context menu on first right click
            this.menu = new Ext.menu.Menu({
                items: [
                    this.menuAdd,
                    this.menuDel,
                    this.menuReload,
                    this.menuExpand,
                    this.menuContrac,
                    '-',
                    this.menuAddConcept,
                    this.menuRegConcept
                ]
            });
        }
        this.menu.showAt(e.getXY());

    },
    regNodeHandler: function () {
        var params = {};
        PVD.mostrarMascara('regNode', 'Por favor espere...', 'Registrando concepto');
        var concetp = this.getConceptToSaveAsBase(this.onNode);
        concetp.attr.denominacion = this.tfConceptName.getValue();
        params = Ext.apply(params, {
            data: Ext.encode([concetp])
        });
        Ext.Ajax.request({
            url: 'registerConceptBase',
            method: 'POST',
            params: {data: Ext.encode([concetp])},
            success: function (resp) {
                PVD.ocultarMascara('regNode');
                var responseData = Ext.decode(resp.responseText);
                switch (responseData.codigo) {
                    case 1:
                        Ext.Notification.show({
                            title: 'Informaci&oacute;n',
                            msg: 'El concepto se ha registrado satisfactoriamente.',
                            icon: 'ok'
                        });
                        this.btnCancel.handler.call(this);
                        window.open('/pvd/persona/index.php/configurarproyecto/exportConcept' + '?' + Ext.urlEncode(params));
                        break;
                    case 3:
                        Ext.Notification.show({
                            title: 'Informaci&oacute;n',
                            msg: 'Ya existe un concepto registrado con esa denominación',
                            icon: 'error'
                        });
                        window.open('/pvd/persona/index.php/configurarproyecto/exportConcept' + '?' + Ext.urlEncode(params));
                        break;
                    default :
                        Ext.Notification.show({
                            title: 'Informaci&oacute;n',
                            msg: 'Ha ocurrido un error interno del sistema.Contacte al administrador.',
                            icon: 'error'
                        });
                        break;
                }
            }.createDelegate(this)
        });
    },
    getConceptToSaveAsBase: function (n) {
        var concept = {
            attr: {
                denominacion: n.text,
                descripcion: n.attributes.qtip,
                tipo: n.attributes.tipo,
                propiedades: n.attributes.propiedades,
                iconcls: n.attributes.iconCls,
                orden: n.attributes.orden,
                codigo: n.attributes.codigo,
                cmpempleado: n.attributes.cmpempleado
            },
            child: []
        };
        n.eachChild(function (ch) {
            concept.child.push(this.getConceptToSaveAsBase(ch));
        }, this);

        return concept;
    },
    addConceptBase: function () {
        var arrConcept = [];
        Ext.each(this.smConceptBase.getSelections(), function (rec) {
            arrConcept.push({
                lft: rec.get('lft'),
                rgt: rec.get('rgt')
            });
        }, this);
        PVD.mostrarMascara('mskaddfield', 'Por favor espere...', 'Guardano datos');
        Ext.Ajax.request({
            url: 'addConceptBaseToProject',
            method: 'POST',
            params: {
                idproyecto: this.idproyecto,
                idpadre: this.onNode.attributes.idproyectoconcepto,
                arrConcept: Ext.encode(arrConcept)
            },
            success: function (resp) {
                PVD.ocultarMascara('mskaddfield');
                var responseData = Ext.decode(resp.responseText);
                switch (responseData.codigo) {
                    case 1:
                        Ext.Notification.show({
                            title: 'Informaci&oacute;n',
                            msg: 'El(Los) concepto(s) se ha(n) guardado satisfactoriamente.',
                            icon: 'ok'
                        });
                        this.getLoader().load(this.onNode);
                        this.onNode.expand(false, true);
                        this.btnCancelConceptBase.handler.call(this);
                        break;
                    default :
                        Ext.Notification.show({
                            title: 'Informaci&oacute;n',
                            msg: 'Ha ocurrido un error interno del sistema.Contacte al administrador.',
                            icon: 'error'
                        });
                        break;
                }
            }.createDelegate(this)
        });
    },
    /**
     * Adiciona campos al arbol de conceptos
     * @param newNode
     * @param parentNode
     * @param propertys
     * @param position Indica la posicion del nodo respecto a otro
     */
    addField: function (newNode, parentNode, position) {
        if (parentNode) {
            var self = this;
            //Pregunta por quien pueda ser el padre del nodo
            var parent = position != 'append' ? parentNode.parentNode : parentNode;
            PVD.mostrarMascara('mskaddfield', 'Por favor espere...', 'Guardano datos');
            Ext.Ajax.request({
                url: 'addConcept',
                method: 'POST',
                params: {
                    idproyecto: this.idproyecto,
                    idproyectoconcepto: newNode.attributes.idproyectoconcepto,
                    idpadre: parent.attributes.idproyectoconcepto,
                    iconCls: newNode.attributes.iconCls,
                    denominacion: newNode.text,
                    tipo: newNode.attributes.tipo,
                    position: position,
                    orden: parentNode.attributes.orden
                },
                success: function (resp) {
                    PVD.ocultarMascara('mskaddfield');
                    var responseData = Ext.decode(resp.responseText);
                    switch (responseData.codigo) {
                        case 1:
                            Ext.Notification.show({
                                title: 'Informaci&oacute;n',
                                msg: 'El concepto se ha guardado satisfactoriamente.',
                                icon: 'ok'
                            });
                            this.getLoader().load(parent);
                            parent.expand(false, true);
                            this.btnCancel.handler.call(this);
                            break;
                        case 3:
                            Ext.Notification.show({
                                title: 'Error',
                                msg: 'Ya existe un concepto registrado con esa denominacion',
                                icon: 'error'
                            });
                            break;
                        default :
                            Ext.Notification.show({
                                title: 'Informaci&oacute;n',
                                msg: 'Ha ocurrido un error interno del sistema.Contacte al administrador.',
                                icon: 'error'
                            });
                            break;
                    }
                }.createDelegate(this)
            });
        }
    },

    importHandler: function () {
        if (!this.winImportFile) {
            this.winImportFile = new Ext.Person.WinImportarPersona();

            this.winImportFile.btnCancel.on('click', function () {
                this.winImportFile.hide();
            }, this);

            this.winImportFile.btnAccept.on('click', function () {
                var me = this, maskId = me.id + 'mask';
                this.winImportFile.form.getForm().submit({
                    url: 'importConcept',
                    waitMsg: 'Importado datos...',
                    success: function (formpanel, opt) {
                        if (!opt.result.success) {
                            mostrarMensaje(6, 'Ocurrió algun error al importar datos');
                            me.winImportFile.form.getForm().reset();
                            me.winImportFile.hide();
                        } else {
                            mostrarMensaje(7, 'Los datos del concepto han sido importados satisfactoriamente.');
                            me.winImportFile.form.getForm().reset();
                            me.winImportFile.hide();
                            me.gpConceptBase.getStore().reload();
                        }
                    },
                    failure: function (a) {
                        PVD.ocultarMascara(maskId);
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        me.winImportFile.form.getForm().reset();
                    },
                    scope: me
                });
            }, this);
        }

        this.winImportFile.show();
        this.winImportFile.form.getForm().reset();
    }

});