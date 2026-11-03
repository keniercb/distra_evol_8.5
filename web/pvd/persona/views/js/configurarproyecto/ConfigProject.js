Ext.ns('Ext.Person');

/**
 * Componente para gestionar la configuracion del proyecto de persona
 * @type {extend|*|void|extend|extend|extend}
 * @author Ing. Javier Rodriguez Lopez
 */
Ext.Person.ConfigProject = Ext.extend(Ext.Window, {
    //modal: true,
    width: '50%',
    height: 550,
    layout: 'fit',
    maximizable: true,
    initComponent: function ()
    {
        var self = this;
        var idproyecto = this.project.get('idproyecto');

        /**
         * Boton cerrar ventana de configuracion
         * @type {Button}
         */
        this.btnClose = new Ext.Button({
            iconCls: 'cancelar',
            text: this.lang.lbBtnClose,
            tooltip: this.lang.ttpBtnClose,
            handler: function ()
            {
                self.hide();
            }
        });

        /**
         * Boton para generar el proyecto
         * @type {Button}
         */
        this.btnGenerateProject = new Ext.Button({
            iconCls: 'generadorreportes',
            text: this.lang.lbBtnGenerate,
            tooltip: this.lang.ttpBtnGenerate,
            scope: this,
            handler: function ()
            {
                PVD.mostrarMascara('mskaddproj', this.lang.lbMsgWait, this.lang.msgGeneratingProject);
                Ext.Ajax.request({
                    url: 'generateProject',
                    params: {'idproyecto': idproyecto},
                    callback: function (options, success, response)
                    {
                        PVD.ocultarMascara('mskaddproj');
                        responseData = Ext.decode(response.responseText);
                        mostrarMensaje(1, this.lang.msgAddedProj);
                    }.createDelegate(this)
                });
            }
        });

        /**
         * Arbol del metadato
         * @type {CmpMetadato}
         */
        this.tpMetadato = new Ext.reccomplejas.CmpMetadato({
            title: this.lang.lbMetadata,
            region: 'west',
            config: this.project,
            collapsible: true,
            margins: '5 0 5 5',
            cmargins: '5 5 5 5',
            parent: this,
            ddGroup: 'tree2tree',
            enableDrag: true,
            dragConfig: {}
        });

        /**
         * Arbol de conceptos
         * @type {TreeConcept}
         */
        this.tpConcept = new Ext.Person.TreeConcept({
            title: this.lang.lbConcept,
            lang: this.lang,
            region: 'center',
            margins: '5 0 5 0',
            enableDD: true,
            idproyecto: idproyecto,
            dropConfig: {
                //allowContainerDrop: true,
                onNodeDrop: function (n, ddSource, e, data)
                {
                    //Verifica que el nodo al cual se mueve no sea la raiz
                    if (n.node.attributes.idproyectoconcepto == n.node.attributes.idpadre) {
                        return false;
                    }

                    //Obtiene la accion que se esta realizando cuando se mueve el nodo
                    var position = self.tpConcept.dropZone.getDropPoint(e, n, ddSource);
                    //Comprueba que el nodo es un nuevo elemento para adicionar y se es hoja o que
                    if (ddSource.dragData.node.attributes.table && ddSource.dragData.node.isLeaf()) {
                        ddSource.dragData.node.attributes.tipo = 3; //Nodo de tipo campo
                        ddSource.dragData.node.attributes.iconCls = 'tag_blue'; //Nodo de tipo campo

//                        var propertys = self.pPropertys.sourceCampo;
                        var propertys = {};
                        propertys.campo = ddSource.dragData.node.text;
                        propertys.tabla = ddSource.dragData.node.attributes.table;
                        propertys.esquema = ddSource.dragData.node.attributes.schema;

                        self.tpConcept.addField(ddSource.dragData.node, n.node, position);

                        return true;
                    }
                    else
                        if (ddSource.dragData.node.attributes.idproyectoconcepto &&
                            ddSource.dragData.node.attributes.idproyectoconcepto != ddSource.dragData.node.attributes.idpadre &&
                            n.node.attributes.idproyectoconcepto != ddSource.dragData.node.attributes.idproyectoconcepto &&
                            n.node.attributes.idproyectoconcepto != ddSource.dragData.node.attributes.idpadre) {
                            var propertys = ddSource.dragData.node.attributes.referenciabd;
                            //Elimina el elemento
                            ddSource.dragData.node.remove();
                            self.tpConcept.addField(ddSource.dragData.node, n.node, position);
                            return true;
                        } else {
                            return false;
                        }
                }
            }
        });

        /**
         * Panel donde se muestran las propiedades de los conceptos
         * @type {ConceptProperty}
         */
        this.pPropertys = new Ext.Person.ConceptProperty({
            title: this.lang.lbPropertys,
            lang: this.lang,
            idproyecto: this.project.get('idproyecto'),
            width: 380,
            minSize: 200,
            maxSize: 500,
            collapsible: true,
            split: true,
            region: 'east',
            margins: '5 5 5 0',
            cmargins: '5 5 5 5',
            listeners: {
                propertySaved: function ()
                {
                    var node = self.tpConcept.getSelectionModel().getSelectedNode();
                    var parentNode = node.parentNode;
                    self.tpConcept.getLoader().load(parentNode);
                    parentNode.expand(false, true);
                }
            }
        });

        this.buttons = [this.btnGenerateProject, this.btnClose];

        this.tpConcept.getSelectionModel().on('selectionchange', function (sm, node)
        {
            this.pPropertys.updateConceptConfig(node);
        }, this);

        this.pConfiguracion = new Ext.Panel({
            title: 'Configuraci&oacute;n',
            layout: 'border',
            items: [this.tpMetadato, this.tpConcept, this.pPropertys]
        });

        this.pCompartimentacion = new Ext.Person.Compartimentacion({
            idproyecto: this.project.get('idproyecto'),
            config: this.project
        });

        /**
         * Contenedor del portal de conceptos
         * @type {TabPanel}
         */
        this.tbpConfiguracion = new Ext.TabPanel({
            margins: '5 5 5 0',
            activeTab: 0,
            enableTabScroll: true,
            border: false,
            deferredRender: true,
            items: [this.pConfiguracion, this.pCompartimentacion]
        });

        this.items = [this.tbpConfiguracion];
        this.on('restore', function ()
        {
            this.tpMetadato.collapse();
            this.pPropertys.collapse();
            this.pConfiguracion.doLayout();
        }, this);
        this.on('maximize', function ()
        {
            this.tpMetadato.expand();
            this.pPropertys.expand();
            this.pConfiguracion.doLayout();

        }, this);
        this.on('show', function (c)
        {
            Ext.apply(c.dd, {
                onDrag: function (e)
                {
                    if (e.getPageY() < 15) {
                        return;
                    }
                    this.alignElWithMouse(this.proxy, e.getPageX(), e.getPageY());
                },
                endDrag: function (e)
                {
                    this.win.unghost();
                    var vs = self.container.getViewSize();
                    var lasPostX = vs.width - 1;
                    switch (e.getPageX()) {
                        case 0:
                            c.setPosition(0, 0);
                            c.setSize('50%', vs.height);
                            break;
                        case lasPostX:
                            var posX = vs.width / 2;
                            c.setPosition(posX, 0);
                            c.setSize('50%', vs.height);
                            break;
                    }
                    this.win.saveState();
                }
            })
        }, this);

        Ext.Person.ConfigProject.superclass.initComponent.call(this);
    }
});