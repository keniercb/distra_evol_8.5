/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.ns('Ext.LOG.moduloMedio');
Ext.QuickTips.init();

Ext.LOG.moduloMedio.ventanaP = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        var _this = this;
        this.idioma = config.idioma;
        this.acciones = config.acciones;
        this.busquedaBasica = false;
        this.modal = true;
        this.autoLoad = false;
        this.layout = 'border';
        Ext.LOG.moduloMedio.ventanaP.superclass.constructor.call(this, config);
        this.panelView();
    }, /*,
     render:function(){   
     var _this = this;
     var vista = Ext.LOG.moduloMedio.ventanaP.superclass.render.call(this);
     
     this.smtreegrid = new Ext.grid.CheckboxSelectionModel({
     listeners: {
     'rowselect': function(SelectionModel, rowIndex, record) {
     
     _this.habilitarBotones();
     },
     'rowdeselect': function(SelectionModel, rowIndex, record) {
     _this.desabilitarBotones();
     
     },
     'selectionchange': function(sm) {
     var selection = sm.getSelections();
     _this.btnCompletarMedios.setDisabled((selection.length == 1) ? false : true);
     
     }
     }
     });
     
     this.treegrid = new Ext.LOG.moduloMedio.CmpTreeGrid({
     id: 'idtreegrid',
     idioma: _this.idioma,
     region: 'center',
     url: 'getModulos',
     sm: this.smtreegrid,
     idarea: _this.idNodoSeleccionado, //_this.comboDeposito.getValue(),
     scope: _this
     });
     this.treegrid.on('render', function() {
     var dragzone = this.treegrid.getView().el.dom.childNodes[0].childNodes[1];
     this.firstGridDropTarget = new Ext.dd.DropTarget(dragzone, {
     ddGroup: 'firstGridDDGroup',
     copy: false,
     notifyDrop: function(ddSodurce, e, data) {
     Ext.getBody().mask('Procesando', 'x-mask-loading');
     var origenes = this.treegrid.getSelectionModel().getSelections();
     var t = Ext.lib.Event.getTarget(e);
     var rindex = this.treegrid.getView().findRowIndex(t);
     if (rindex !== false) {
     var id_destino = this.treegrid.getStore().getAt(rindex).get('idregnumerico');
     } else {
     var id_destino = null;
     }
     var ids_origen = new Array();
     var ids_origenes_padres = new Array();
     var i = 0;
     while (i < origenes.length) {
     if (origenes[i].data.idregnumerico != id_destino) {
     
     ids_origen[i] = origenes[i].data.idregnumerico;
     ids_origenes_padres[i] = origenes[i].data.idpadremodulo;
     
     }
     i += 1;
     }
     
     if (ids_origen.length > 0) {
     Ext.Ajax.request({
     url: 'crearModuloDrgDrop',
     method: 'POST',
     params: {
     ids_origen: Ext.encode(ids_origen),
     ids_origenes_padres: Ext.encode(ids_origenes_padres),
     id_destino: id_destino
     },
     callback: function(options, success, response) {
     Ext.getBody().unmask();
     if (success) {
     mostrarMensaje(1, 'El modulo ha sido modificado satisfactoriamente.');
     _this.treegrid.getStore().baseParams = {};
     _this.treegrid.getStore().load({
     params: {
     anode: null,
     _id: null,
     idarea: _this.comboDeposito.getValue(),
     start: 0,
     limit: 20
     }
     });
     } else {
     mostrarMensaje(3, 'El modulo no se ha podido modificar.');
     }
     }
     });
     } else {
     Ext.getBody().unmask();
     }
     return (true);
     }.createDelegate(this)
     });
     }, this);
     Ext.apply(vista.panelGrid,this.treegrid);
     return vista;
     }*/
    panelView: function() {
        var _this = this;
        
        _this.btnConformarexpediente = LOG.util.UIManager.createBtn({
            iconCls: 'comprobante',
            disabled: false,
            text: _this.idioma.btnConformarexpediente,
            tooltip: _this.idioma.btnTConformarexpediente,
            hidden: !_this.grantedAction('btnConformarexpedienteP'),
            handler: function() {
                _this.keyMap.stopEvent = true;
                var treegrid = _this.getTreegrid().getSelectionModel().getSelected();
                Ext.Ajax.request({
                    url: 'getContorValorInmueble',
                    method: 'POST',
                    params: {
                        ordendermodulo: treegrid.data.ordendermodulo,
                        ordenizqmodulo: treegrid.data.ordenizqmodulo,
                        idarea: _this.comboDeposito.getValue()

                    },
                    callback: function(options, success, response) {
                        var rd = Ext.decode(response.responseText);
                        if (rd.datos[0].valorcontable) {
                            var winExpediente = new Ext.LOG.moduloMedio.confExpediente({
                                idioma: _this.idioma,
                                //title: _this.idioma.lbTitleDocExpInmueble,
                                dataregnumerico: _this.getTreegrid().getSelectionModel().getSelected(),
                                identidad: Ext.LOG.moduloMedio.ventanaP.identidad,
                                valorcontable: rd.datos[0].valorcontable,
                                tree: _this.getTreegrid(),
                                idarea: _this.idPadreNodoSeleccionado,
                                scope: _this
                            });
                           
                            winExpediente.show();
                            winExpediente.maximize();
                        }
                    }
                });
            }
        });
        var panelMedioAFT = new Ext.LOG.moduloMedio.ventana({
            idioma: Ext.LOG.gestModulo.Idioma,
           // hidden: true,
            acciones_reportes: _this.acciones
        });
      
              
        //panelMedioAFT.listaBtn.insert(_this.btnConformarexpediente,3);
        
        //return panelMedioAFT;
    }
});