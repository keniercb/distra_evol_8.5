/**
 * Fichero que contiene el objeto Panel para (add, up , del) categorias/causas.
 * 
 * @author ohgonzalez 
 * @version 1.0
 */

Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.CausaefectoFormPanel = ExtExtend.Class({
    $extend: Ext.Panel,
    region: 'center',
    layout: 'border',
    height: 100,
    initComponent: function() {
        var _this = this;

        _this.controller = (_this.controller) ? _this.controller : new Planificacion.Integracion.CausaefectoController();
        _this.checkListarCausa = false;

        _this.btnAdicionar = new _this.extendCmp.buttons.btnAdicionar({
            tooltip: 'Adicionar causa',
            disabled: true,
            handler: function() {
                _this.handlerButtonTbar('adicionar');
            }
        });

        _this.btnModificar = new _this.extendCmp.buttons.btnModificar({
            tooltip: 'Modificar causa',
            disabled: true,
            handler: function() {
                _this.handlerButtonTbar('modificar');
            }
        });

        _this.btnEliminar = new _this.extendCmp.buttons.btnEliminar({
            tooltip: 'Eliminar causa',
            disabled: true,
            handler: function() {
                _this.handlerButtonTbar('eliminar');
            }
        });

        _this.tbar = [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar];

        var gridPanel = new Planificacion.Integracion.CausaefectoGridPanel({
            idioma: _this.idioma,
            instanceTbar: _this.tbar,
            instanceTreePanel: _this.instanceTreePanel
        });

        var columnTree = new Planificacion.Integracion.CausaefectoTreeColumn({
            idioma: _this.idioma,
            instanceTbar: _this.tbar
        });

        _this.containerPanel = {
            id: 'container-panel',
            layout: 'card',
            region: 'center',
            border: false,
            activeItem: 0,
            items: [gridPanel, columnTree]
        };

        _this.items = [_this.containerPanel];

        _this.instanceTreePanel.instanceFormPanel = _this;

        _this.keys = [
            {
                key: 'i',
                alt: true,
                scope: _this,
                stopEvent: true,
                fn: function() {
                    _this.btnAdicionar.handler.call();
                }
            },
            {
                key: 'm',
                alt: true,
                scope: _this,
                stopEvent: true,
                fn: function() {
                    _this.btnModificar.handler.call();
                }
            },
            /*{
                key: 'b',
                alt: true,
                scope: _this,
                stopEvent: true,
                fn: function() {
                    _this.btnBuscar.handler.call();
                }
            },
            {
                key: 'l',
                alt: true,
                scope: _this,
                stopEvent: true,
                fn: function() {
                    _this.btnLimpiar.handler.call();
                }
            },*/
            {
                key: Ext.EventObject.DELETE,
                scope: _this,
                stopEvent: true,
                fn: function() {
                    _this.btnEliminar.handler.call();
                }
            }
        ];

        Planificacion.Integracion.CausaefectoFormPanel.superclass.initComponent.call(Ext.apply(_this, arguments));
    },
    handlerButtonTbar: function(btn) {
        var _this = this;

        var containerPanel = _this.items.items[0];
        var objPanel = containerPanel.layout.activeItem;

        var xtype = objPanel.getXType();

        var node = {};
        var item = new Ext.menu.Item({type: btn});

        var flag = true;

        if (xtype === 'Planificacion.Integracion.CausaefectoGridPanel') {

            if (btn === 'adicionar') {

                node = new Ext.tree.TreeNode({type: 'efecto'});

            } else if (btn === 'modificar' || btn === 'eliminar') {

                var selModel = objPanel.getSelectionModel();
                var record = selModel.getSelected();

                node = new Ext.tree.TreeNode({
                    type: 'categoria',
                    idcategoria: record.get('idcategoria'),
                    idefecto: record.get('idefecto'),
                    denominacion: record.get('denominacion'),
                    leaf: record.get('leaf')
                });

            }

        } else if (xtype === 'Planificacion.Integracion.CausaefectoTreeColumn') {

            var nodeTreePanel = _this.instanceTreePanel.getSelectionModel().getSelectedNode();
            var nodeTreeColumn = objPanel.getSelectionModel().getSelectedNode();

            if (nodeTreePanel === null && nodeTreeColumn !== null) {
                node = nodeTreeColumn;
            } else if (nodeTreePanel !== null && nodeTreeColumn === null && !_this.checkListarCausa) {
                node = nodeTreePanel;
            } else if (nodeTreePanel !== null && nodeTreeColumn !== null) {
                node = nodeTreeColumn;
            } else if (_this.checkListarCausa) {
                mostrarMensaje(2, _this.idioma.msgSeleccionarCausa, function() {
                }, '');
                flag = false;
            }

        }

        if (flag) {
            _this.instanceTreePanel.createAddModWindow(node, item);
        }

    },
    handlerButtonBuscar: function() {
        var _this = this;
        var value = _this.fieldDenom.getRawValue();
        var idefecto = _this.instanceTreePanel.objDatEfecto.get('idefecto');
        
        if (value !== '') {            
            _this.controller._insertItem('causaefectoFormPanel', _this);

            var containerPanel = _this.items.items[1];
            var objPanel = containerPanel.layout.activeItem;

            var xtype = objPanel.getXType();

            if (xtype === 'Planificacion.Integracion.CausaefectoTreeColumn') {
                Secodena.mostrarMascara('buscarCausa', '', '');
                var idcategoria = '';
                if(!_this.checkListarCausa) {
                    var node = _this.instanceTreePanel.getSelectionModel().getSelectedNode();
                    idcategoria = node.attributes.idcategoria;
                }                
                _this.controller.buscarCausa(value, idefecto, idcategoria); 
            } else {
                Secodena.mostrarMascara('buscarCategoria', '', '');                 
                _this.controller.buscarCategoria(value, idefecto);                
            }

        }
    },
    handlerButtonLimpiar: function() {
        var _this = this;

        if (_this.fieldDenom.getValue() !== '') {

            _this.fieldDenom.setValue('');

            var containerPanel = _this.items.items[1];
            var objPanel = containerPanel.layout.activeItem;

            var xtype = objPanel.getXType();

            if (xtype === 'Planificacion.Integracion.CausaefectoTreeColumn') {

                var nodeTreePanel = _this.instanceTreePanel.getSelectionModel().getSelectedNode();

                if (!_this.checkListarCausa) {
                    _this.instanceTreePanel.clickTreePanel(nodeTreePanel);

                } else {
                    _this.instanceParent.handlerListarCausa('');
                }

            } else {

                objPanel.getStore().load({
                    params: {
                        start: 0,
                        limit: 18,
                        objeto: Ext.encode(_this.instanceTreePanel.objDatEfecto.get())
                    }
                });

            }

        }

    },
    buscarCategoria: function(data) {
        var _this = this;

        var containerPanel = _this.items.items[1];
        var objPanel = containerPanel.layout.activeItem;

        if (data.length > 0) {

            objPanel.getStore().removeAll();

            var records = [];

            Ext.each(data, function(obj) {
                records.push(new Ext.data.Record(obj));
            });

            objPanel.getStore().add(records);            

        } else {
            mostrarMensaje(1, _this.idioma.msgBuscar, function() {
            }, '');
        }
        
        Secodena.ocultarMascara('buscarCategoria');
    },
    buscarCausa: function(data) {
        var _this = this;

        var containerPanel = _this.items.items[1];
        var objPanel = containerPanel.layout.activeItem;  
        
        _this.instanceParent.listarCausas([data], 'causa', true);
        
        Secodena.ocultarMascara('buscarCausa');
    }
});
Ext.reg('Planificacion.Integracion.CausaefectoFormPanel', Planificacion.Integracion.CausaefectoFormPanel);

