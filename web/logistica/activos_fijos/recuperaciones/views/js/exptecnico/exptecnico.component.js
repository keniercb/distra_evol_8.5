Ext.ns('Ext.Log.ExpTec');
Ext.Log.ExpTec.exptecnico = Ext.extend(Ext.Viewport, {
    constructor: function (config) {
        var _this = this;
        config = (config) ? config : {};
        _this.idioma = config.idioma;
        _this.perfil = config.perfil;
        _this.layout = 'border';
        _this.id = 'viewport';

        _this.btnMostrarDet = new Ext.Button({
            id: 'btnMostrarDet',
            iconCls: 'detalles',
            disabled: true,
            text: _this.idioma.btnMostrar,
            tooltip: _this.idioma.btnTtMostrar,
            handler: function () {
                var idregnumerico = _this.getTreegrid().getSelectionModel().getSelected().get('idregnumerico');
                _this.enviarDatosMostrarDetalles(idregnumerico, _this.mostrarDetalles);
            }
        });

        _this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            iconCls: 'ayuda',
            hidden: false,
            tooltip: _this.idioma.btnTtAyuda,
            text: _this.idioma.btnAyuda,
            handler: function () {
                var title = _this.idioma.lbAyudaText;
                var referencia = 'logistica/gestion de transporte/recuperaciones/expediente tecnico';//'Logística/Gestión del transporte/Gestión de documentos';              
                help.show(title, referencia);
            }
        });

        _this.btnMostrarHist = new Ext.Button({
            id: 'btnMostrarHist',
            iconCls: 'historial',
            hidden: false,
            disabled: true,
            tooltip: _this.idioma.btnTtMostrarHist,
            text: _this.idioma.btnMostrarHist,
            handler: function () {
                var idregnumerico = _this.getTreegrid().getSelectionModel().getSelected().get('idregnumerico');
                _this.mostrarHistorial(idregnumerico);
            }
        });

        _this.panelBotones = new Ext.Panel({
            region: 'north',
            tbar: [_this.btnMostrarDet, _this.btnMostrarHist, '->', _this.btnAyuda]
        });

        _this.smtreegrid = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                'rowselect': function (SelectionModel, rowIndex, record) {
                    _this.cargarMovimientos();
                    _this.habilitarBotones();
                    _this.panelSur.expand();                    
                },
                'rowdeselect': function (SelectionModel, rowIndex, record) {
                    _this.desabilitarBotones();
                }
            }
        });

        _this.panelNorte = new Ext.Log.ExpTec.PanelNorte({
            idioma: _this.idioma,
            perfil: perfil,
            region: 'center',
            sm: _this.smtreegrid,
            fn : function(){
                _this.desabilitarBotones(); 
            }
        });

        _this.panelSur = new Ext.Log.ExpTec.PanelSur({
            idioma: _this.idioma,
            perfil: _this.perfil,
            region: 'south',
            collapsed: true,
            collapsible: true
        });

        _this.items = [_this.panelBotones, _this.panelNorte, _this.panelSur];

        _this.teclasCalientes();
        Ext.Log.ExpTec.exptecnico.superclass.constructor.apply(this, arguments);
    },

    getTreegrid: function () {
        var treeGrid = this.panelNorte.treegrid;
        return treeGrid;
    },

    cargarMovimientos: function () {
        if (this.getTreegrid().getSelectionModel().hasSelection()) {
            var idregnumerico = this.getTreegrid().getSelectionModel().getSelected().get('idregnumerico');
            var idarea = this.panelNorte.comboDeposito.getValue();
            this.panelSur.cargarMovimientos(idregnumerico, idarea);
        }else {
            mostrarMensaje(1, _this.idioma.lbMsgErrorMovSelec);
            return false;
        }
    },

    mostrarDetalles: function (datos) {
        var _this = this;
        if (! this.ventanaDetalles || ! this.ventanaDetalles.isVisible()) {
            this.ventanaDetalles = new Ext.Log.ExpTec.winMostrarDetalles({
                etiquetas: _this.idioma,
                datos: datos,
                title: datos['titulo'],
                idregnumerico: datos['idactivofijo'],
                entidad: _this.panelNorte.comboDeposito.getRawValue(),
            });
            this.ventanaDetalles.show();
        }
    },

    enviarDatosMostrarDetalles: function (idregnumerico, post_Action) {
        var _this = this;
        Ext.Ajax.request({
            url: 'mostrarDetalles',
            method: 'POST',
            params: {
                idregnumerico: Ext.encode(idregnumerico)
            },
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                if (success && ! response.error) {
                    post_Action.call(_this, response);
                }
            }
        });
    },

    enviarDatosTipoMedio: function (idregnumerico) {
        var _this = this;
        Ext.Ajax.request({
            url: 'getTipoMedio',
            method: 'POST',
            params: {
                idregnumerico: Ext.encode(idregnumerico)
            },
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                if(response == 'Fisico'){
                  _this.btnMostrarDet.enable();
                } 
            }
        });
    },

    mostrarHistorial: function (idregnumerico) {
        var _this = this;
        if (! this.ventanaHistorial || ! this.ventanaHistorial.isVisible()) {
            this.ventanaHistorial = new Ext.Log.ExpTec.VentataMostrarHistorial({
                title: _this.idioma.lbTitleWInHistorial,
                idioma: _this.idioma,
                id: 'ventHist',
                closeAction: 'close',
                idregnumerico: idregnumerico
            });
            this.ventanaHistorial.show();
        }
    },

    habilitarBotones: function () {
        if (this.getTreegrid().getSelectionModel().hasSelection()) {
            var esmodulo = this.getTreegrid().getSelectionModel().getSelected().get('esmodulo');
            if(esmodulo == 2){
                this.btnMostrarHist.enable();
            }
            var idregnumerico = this.getTreegrid().getSelectionModel().getSelected().get('idregnumerico');
           this.enviarDatosTipoMedio(idregnumerico);      
        }
    },

    desabilitarBotones: function () {
        this.btnMostrarDet.disable();
        this.btnMostrarHist.disable();
    },

    teclasCalientes: function(){
        var _this = this;
        document.onkeyup = function (e) {
            if (Ext.getCmp('viewport').isVisible()){
                if (e.altKey) {
                    if(e.ctrlKey){
                        if(e.which == Ext.EventObject.H){
                            if (!_this.btnMostrarHist.disabled) {
                                if (!_this.ventanaDetalles || !_this.ventanaDetalles.isVisible()) {                                
                                    Ext.getCmp('btnMostrarHist').handler();
                                }                                  
                            }
                        }
                        else if(e.which == Ext.EventObject.D){
                            if (!_this.btnMostrarDet.disabled) {
                                if (!_this.ventanaHistorial || !_this.ventanaHistorial.isVisible()){
                                    Ext.getCmp('btnMostrarDet').handler();
                                }
                            }
                        }
                    }
                    else if(e.which == Ext.EventObject.H){
                        if (_this.ventanaDetalles) {
                            if (!_this.ventanaDetalles.isVisible()) {
                                Ext.getCmp('btnAyuda').handler();
                            } 
                        }else if (_this.ventanaHistorial) {
                            if (!_this.ventanaHistorial.isVisible()) {
                                Ext.getCmp('btnAyuda').handler();
                            } 
                        }else if (_this.winAvanzada){
                            if (!_this.winAvanzada.isVisible()) {
                                Ext.getCmp('btnAyuda').handler();
                            }
                        }else{
                            Ext.getCmp('btnAyuda').handler();
                        }  
                    }
                    else if(e.which == Ext.EventObject.B){
                        if (_this.ventanaHistorial && _this.ventanaHistorial.isVisible()){
                            Ext.getCmp('idbtnBuscarTrazas').handler();
                        }else{
                            Ext.getCmp('btnBuscar').handler();    
                        }
                    } 
                    else if(e.which == Ext.EventObject.L){
                        if (_this.ventanaHistorial && _this.ventanaHistorial.isVisible()){
                            Ext.getCmp('idbtnLimpiarTrazas').handler();
                        }else{
                            Ext.getCmp('btnLimpiar').handler(); 
                        }   
                    }  
                }
            }
        }
    }
});

UCID.portal.cargarEtiquetas('exptecnico', function (perfil, idioma) {

    UCID.portal.cargarAcciones(window.frameElement.id, function () {
    });
    var ObjExpTecnico = new Ext.Log.ExpTec.exptecnico({
        idioma: idioma,
        perfil: perfil
    });
    ObjExpTecnico.show();
    ObjExpTecnico.doLayout();

});