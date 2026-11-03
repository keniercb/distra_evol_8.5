/**
 * Fichero que contiene el objeto del TabPanel para gestionar el diagrama causa - efecto.
 *
 * @author ohgonzalez
 * @version 1.0
 */

Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.CausaefectoTabPanel = ExtExtend.Class({
    $extend: Ext.Panel,
    layout: 'border',
    region: 'center',
    id: this.id ? this.id : Ext.id(),
    initComponent: function() {
        var _this = this;

        _this.controller = (_this.controller) ? _this.controller : new Planificacion.Integracion.CausaefectoController();
        _this.idioma = (_this.idioma) ? _this.idioma : _this.controller._getLabel('Causaefecto');
        _this.extendCmp = (_this.extendCmp) ? _this.extendCmp : ExtExtend.Components;
        _this.widthWest = (_this.widthWest) ? _this.widthWest : 435;

        _this.treePanel = new Planificacion.Integracion.CausaefectoTreePanel({
            idioma: _this.idioma,
            extendCmp: _this.extendCmp,
            idproyecto: _this.idproyecto,
            controller: _this.controller,
            instanceParent: _this
        });

        _this.formPanel = new Planificacion.Integracion.CausaefectoFormPanel({
            idioma: _this.idioma,
            extendCmp: _this.extendCmp,
            instanceTreePanel: _this.treePanel,
            controller: _this.controller,
            instanceParent: _this
        });

        _this.items = [
            {
                layout: 'border',
                region: 'west',
                border: false,
                split: true,
                margins: '3 0 3 3',
                width: _this.widthWest,
                minSize: 365,
                maxSize: 600,
                items: [_this.treePanel]
            },
            {
                layout: 'border',
                region: 'center',
                border: false,
                margins: '3 3 3 0',
                items: [_this.formPanel]
            }
        ];

        _this.btnAyuda = new _this.extendCmp.buttons.btnAyuda({
            tooltip: 'Mostrar ayuda de la funcionalidad',
            handler: function() {
                _this.controller.mostrarAyuda('causa_efecto');
            }
        });

        _this.btnExportar = new _this.extendCmp.buttons.btnExportar({
            handler: function() {
			var objEfecto = _this.treePanel.objDatEfecto;
			
                 params = {
                         idefecto: objEfecto.get('idefecto'),
                         idestudiocausaefecto: objEfecto.get('idestudiocausaefecto'),
                         denominacion: _this.title,
                         denominacioncausa: objEfecto.get('denominacion')
                     }
                    _this.controller.obtenerReporte(params);
            }
        });

        var btnGenerarDiagrama = new _this.extendCmp.buttons.btnGraficar({
            tooltip: 'Gráficar diagrama de causas',
            text: _this.idioma.textBtnDiagram,
            handler: function() {

                var objEfecto = _this.treePanel.objDatEfecto.get();
                var aa = new Planificacion.Integracion.WindowOrganigrama({
                    controller: _this.controller,
                    objefecto: objEfecto,
                    width: _this.ancho,
                    height: _this.altura + 30

                });
                aa.show();
                //_this.handlerGenerarDiagrama();
            }
        });

        var btnListarCausas = new _this.extendCmp.buttons.btnImportar({
            tooltip: 'Listar causas',
            text: _this.idioma.textBtnListarCausas,
            handler: function() {
                _this.formPanel.checkListarCausa = true;
                _this.handlerListarCausa('');
            }
        });

        _this.keys = [
            {
                key: 'i',
                ctrl: true,
                alt: true,
                scope: _this,
                stopEvent: true,
                fn: function() {
                    btnListarCausas.handler.call();
                }
            },{
                key: 'm',
                ctrl: true,
                alt: true,
                scope: _this,
                stopEvent: true,
                fn: function() {
                    btnGenerarDiagrama.handler.call();
                }
            },{
                key: 'h',
                alt: true,
                scope: _this,
                stopEvent: true,
                fn: function() {
                    _this.btnAyuda.handler.call();
                }
            },{
                key: 'e',
                alt: true,
                scope: _this,
                stopEvent: true,
                fn: function() {
                    _this.btnExportar.handler.call();
                }
            }
        ];

        _this.tbar = ["->", btnListarCausas, btnGenerarDiagrama, _this.btnExportar, _this.btnAyuda];

        this.on('resize', function (obj, adjWidth, adjHeight, rawWidth, rawHeight) {
            _this.altura = adjHeight;
            _this.ancho = adjWidth;
        });

        Planificacion.Integracion.CausaefectoTabPanel.superclass.initComponent.call(Ext.apply(_this, arguments));
    },
    handlerGenerarDiagrama: function() {
        var _this = this;

        var btnCerrarDiagrama = new _this.extendCmp.buttons.btnCerrar({
            tooltip: _this.idioma.tooltipCerrarDiagrama,
            handler: function(btn) {
                btn.ownerCt.close();
            }
        });

        var btnGuardarDiagrama = new _this.extendCmp.buttons.btnGuardar({
            tooltip: _this.idioma.tooltipGuardarDiagrama,
            handler: function() {
                var idDiagram = this.ownerCt.body.dom.id;
                var causaEfectoExport = new Planificacion.Integracion.CausaefectoExport({
                    controller: _this.controller,
                    idioma: _this.idioma,
                    extendCmp: _this.extendCmp,
                    idDiagram: idDiagram
                });
                causaEfectoExport.show();
            }
        });

        _this.winDiagrama = new Ext.Window({
            title: _this.idioma.titleGenerarDiagrama,
            maximizable: true,
            constrain: true,
            width: 950,
            height: 600,
            modal: true,
            bodyStyle: 'background: url(/planificacion/herramientasintegracion/comun/recursos/images/leyenda1.png)no-repeat;background-position:top right; background-size: 300px; background-color:#fff;position: relative;',
            buttons: [btnCerrarDiagrama, btnGuardarDiagrama],
            listeners: {
                show: function(win) {
                    _this.maskDiagrama = new Ext.LoadMask(win.body, {
                        msg: "Generando diagrama ..."
                    });
                    _this.maskDiagrama.show();
                    var objEfecto = _this.treePanel.objDatEfecto.get();
                    _this.controller._insertItem('causaefectoTabPanel', _this);
                    _this.controller.generarDiagrama(objEfecto);
                }
            }, keys: [
                {
                    key: 'g',
                    alt: true,
                    scope: _this.winDiagrama,
                    stopEvent: true,
                    fn: function() {
                        btnCerrarDiagrama.handler.call();
                    }
                },{
                    key: 'x',
                    alt: true,
                    scope: _this,
                    stopEvent: true,
                    fn: function() {
                        btnCerrarDiagrama.handler.call();
                    }
                }
            ]
        });
        _this.winDiagrama.show();
    },
    handlerListarCausa: function(msg) {
        var _this = this;
        Secodena.mostrarMascara('listarCausas', '', 'Listando causas ...');
        var objEfecto = _this.treePanel.objDatEfecto.get();
        _this.controller._insertItem('causaefectoTabPanel', _this);
        _this.controller.listarCausas(objEfecto, msg);
    },
    fishbone: function(data) {
        var _this = this;
        var objEfecto = _this.treePanel.objDatEfecto.get();
        var json = {
            name: objEfecto.denominacion,
            children: []
        };

        var collectionCategoria = new Ext.util.MixedCollection(false, function(item) {
            return item.idcategoria;
        });

        collectionCategoria.addAll(data);
        var flag = true;

        collectionCategoria.each(function(itemCategoria, index, length) {
            itemCategoria.name = itemCategoria.denominacion;
            itemCategoria.children = [];

            var collectionCausa = new Ext.util.MixedCollection(false, function(item) {
                return item.idcausa;
            });

            collectionCausa.addAll(itemCategoria.DatCausa);

            if (collectionCausa.getCount() !== 4) {
                flag = false;
            }

            collectionCausa.each(function(itemCausa, index, length) {
                itemCausa.name = itemCausa.denominacion;
                itemCausa.children = [];

                if (itemCausa.rgt - itemCausa.lft > 1) {

                    this.each(function(object, key) {
                        if (itemCausa.idcausa !== object.idcausa && itemCausa.idcausa === object.idpadre) {
                            itemCausa.children.push(object);
                        }
                    });

                }

                if (itemCausa.idcausa === itemCausa.idpadre) {
                    itemCategoria.children.push(itemCausa);
                }

            }, collectionCausa);

            json.children.push(itemCategoria);

        });

        var d3fishbone = function() {

            var dom = _this.winDiagrama.body.dom;
            _this.winDiagrama.fishbone = d3.fishbone();
            var svg = d3.select('div#' + dom.id).append("svg")
                    .attr({width: _this.winDiagrama.getInnerWidth(), height: _this.winDiagrama.getInnerHeight()})
                    .datum(json)
                    .call(_this.winDiagrama.fishbone.defaultArrow)
                    .call(_this.winDiagrama.fishbone);

            _this.winDiagrama.fishbone.force().size([_this.winDiagrama.getInnerWidth(), _this.winDiagrama.getInnerHeight()]).start();

            _this.winDiagrama.on('resize', function(win) {
                win.fishbone.force().size([win.getInnerWidth(), win.getInnerHeight()]).start();
                svg.attr({width: win.getInnerWidth(), height: win.getInnerHeight()});
            });
        };

        if (!flag || json.children.length === 0) {
            Ext.MessageBox.confirm(_this.idioma.confirm, _this.idioma.confirmGenerarDiagrama, function(btn) {
                if (btn === 'yes') {
                    d3fishbone();
                } else {
                    _this.winDiagrama.close();
                }
            });
        } else {
            d3fishbone();
        }
        _this.maskDiagrama.hide();

    },
    listarCausas: function(data, type, idcausa) {
        var _this = this;
        var containerPanel = _this.formPanel.items.items[0];
        var objPanel = containerPanel.layout.activeItem;
        var xtype = objPanel.getXType();
        var panelTree = containerPanel.items.items[1];

        if (xtype === 'Planificacion.Integracion.CausaefectoGridPanel') {
            containerPanel.layout.setActiveItem(panelTree.getId());
        }

        function removeNodes(callback) {
            var childNodes = panelTree.getRootNode().childNodes;
            while (panelTree.getRootNode().hasChildNodes()) {
                panelTree.getRootNode().removeChild(childNodes[0]);
            }
            callback(data, type, idcausa);
        }

        function appendChild(data, type, idcausa) {
            Ext.each(data, function(array, index) {
                var collectionCausa = new Ext.util.MixedCollection(false, function(item) {
                    return item.idcausa;
                });
                collectionCausa.addAll(array);
                collectionCausa.each(function(itemCausa, index, length) {
                    if (itemCausa.node === undefined || itemCausa.node === null) {
                        itemCausa.node = new Ext.tree.TreeNode({
                            text: itemCausa.denominacion,
                            idcausa: itemCausa.idcausa,
                            idpadre: itemCausa.idpadre,
                            idcategoria: itemCausa.idcategoria,
                            denominacion: itemCausa.denominacion,
                            leaf: itemCausa.leaf,
                            iconCls: 'causa',
                            type: 'causa'
                        });
                    }

                    if (!itemCausa.leaf) {
                        this.each(function(object, key) {
                            if (itemCausa.idcausa !== object.idcausa && itemCausa.idcausa === object.idpadre) {
                                if (object.node === undefined || object.node === null) {
                                    object.node = new Ext.tree.TreeNode({
                                        text: object.denominacion,
                                        idcausa: object.idcausa,
                                        idpadre: object.idpadre,
                                        idcategoria: object.idcategoria,
                                        denominacion: object.denominacion,
                                        leaf: object.leaf,
                                        iconCls: 'causa',
                                        type: 'causa'
                                    });
                                }
                                itemCausa.node.appendChild(object.node);
                            }
                        });
                    }

                    if (type === 'causa' && itemCausa.idpadre === idcausa) {
                        panelTree.getRootNode().appendChild(itemCausa.node);
                    } else {
                        if (itemCausa.idcausa === itemCausa.idpadre) {
                            panelTree.getRootNode().appendChild(itemCausa.node);
                        }
                    }

                }, collectionCausa);

            });

            if (_this.formPanel.checkListarCausa) {
                Secodena.ocultarMascara('listarCausas');
            } else {
                Secodena.ocultarMascara('cargarArbolCategoria');
            }
            panelTree.expandAll();
        }
        removeNodes(appendChild);
    }
});
Ext.reg('Planificacion.Integracion.CausaefectoTabPanel', Planificacion.Integracion.CausaefectoTabPanel);
