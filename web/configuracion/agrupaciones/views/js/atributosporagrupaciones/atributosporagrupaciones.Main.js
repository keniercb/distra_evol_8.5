Ext.ns('Ext.erp');
Ext.erp.atriAgrupMain = Ext.extend(Ext.Viewport, {
    layout: 'border',
    tipo_area_seleccionada: 'entidad',
    constructor: function(config) {

        Ext.apply(this, config);
        var _this = this;
        Ext.erp.atriAgrupMain.superclass.constructor.call(this, config);
    },
    initComponent: function(config) {
        var _this = this;
        this.btnBuscar = new Ext.Button({
            iconCls: 'buscar',
            // tooltip: 'Buscar nomenclador',
            handler: function () {
                var nodoSel = _this.panelTree.getNodoSeleccionado();
                if (nodoSel && nodoSel.attributes._is_leaf) {
                    nodoSel = _this.panelTree.getPadreNodoSeleccionado();
                }

                if (nodoSel) {
                    _this.panelTree.getLoader().baseParams.alias = _this.tfBusqueda.getValue();
                    if (nodoSel.isExpanded()) {
                        _this.panelTree.getLoader().load(nodoSel);
                        nodoSel.collapse();
                        nodoSel.expand();
                    } else {
                        nodoSel.expand();
                    }

                }
            }
        });
        this.btnLimpiar = new Ext.Button({
            iconCls: 'limpiar',
            // tooltip: 'Limpiar filtro <b>(Alt+L)</b>',
            handler: function () {
                _this.tfBusqueda.setValue(null);
                _this.btnBuscar.focus();
                _this.panelTree.getLoader().baseParams = {};
                var nodoSel = _this.panelTree.getNodoSeleccionado();
                if (nodoSel && nodoSel.attributes._is_leaf) {
                    nodoSel = _this.panelTree.getPadreNodoSeleccionado();
                }
                _this.panelTree.getLoader().load(nodoSel, function(){
                    nodoSel.expand();
                });

            }
        });
        this.tfBusqueda = new Ext.form.TextField({
            width: 200,
            maxLength: 35,
            // maxLengthText: _this.idioma.lbMsgMaxLongNomNomenclador,
            enableKeyEvents: true,
            emptyText: 'Denominaci\xf3n'
        });
        this.panelTree = new Ext.erp.treedeagrupaciones({
            idioma: _this.idioma,
            border: true,
            mostrarTbar: true,
            utilizarDD:true,
            bodyBorder: false,
            tbar: [_this.tfBusqueda, _this.btnBuscar, _this.btnLimpiar],
            region: 'center',
            fn: function (nodo) {
                _this.cargarGrid(nodo);
            },
            width: 250,
            autoScroll: true,
            padre: _this
        });
        _this.btnAdicionarTree = new Ext.Button({
            iconCls: 'adicionar',
            disabled: false,
            text: _this.idioma.lbBtnAdicionar,
            //tooltip: _this.idioma.TooltbtnAdicionar,
            handler: function () {
                _this.panelTree.gestAgrupAdd('adic');
            }/*,
            listeners: {
                'render': function (p) {
                    var theTip = null;

                    p.getEl().on('mouseover', function () {
                        theTip = new Ext.Tip({
                            margin: '0 0 0 200',
                            shadow: false
                        });
                        var pos = _this.getPosition();
                        var x = pos[0] + 30;
                        var y = pos[1] + 50;
                        var text = "";
                        if (_this.getNodoSeleccionado().attributes.id == 0 || !_this.getNodoSeleccionado()) {
                            text = _this.idioma.TooltbtnAdicionar;
                        } else {
                            text = _this.idioma.TooltbtnAdicionarAtri;
                        }

                        theTip.html = text;
                        theTip.showAt([x, y]);
                    });

                    p.getEl().on('mouseout', function () {
                        if (theTip)
                            theTip.hide();
                    });
                }
            }*/
        });
        _this.btnModificarTree = new Ext.Button({
            iconCls: 'modificar',
            disabled: true,
            text: _this.idioma.lbBtnModificar,
            //tooltip: _this.idioma.TooltbtnModificar,
            handler: function () {
                _this.panelTree.gestAgrupAdd('modif');
            }/*,
            listeners: {
                'render': function (p) {
                    var theTip2 = null;
                    p.getEl().on('mouseover', function () {
                        theTip2 = new Ext.Tip({
                            margin: '0 0 0 200',
                            shadow: false
                        });
                        var pos = _this.getPosition();
                        var x = pos[0] + 120;
                        var y = pos[1] + 50;
                        var text = "";
                        if (_this.getNodoSeleccionado().attributes.id == 0 || !_this.getNodoSeleccionado()) {
                            text = _this.idioma.TooltbtnModificar;
                        } else {
                            text = _this.idioma.TooltbtnModificarAtri;
                        }

                        theTip2.html = text;
                        theTip2.showAt([x, y]);
                    });

                    p.getEl().on('mouseout', function () {
                        if (theTip2)
                            theTip2.hide();
                    });
                }
            }*/
        });
        _this.btnEliminarTree = new Ext.Button({
            iconCls: 'eliminar',
            disabled: true,
            text: _this.idioma.lbBtnEliminar,
            //tooltip: _this.idioma.TooltbtnEliminar,
            handler: function () {
                if (_this.panelTree.getNodoSeleccionado()) {
                    _this.panelTree.eliminarAgrupacion();
                } else {
                    mostrarMensaje(1, _this.idioma.lbSeleccionarDel);
                }
            }/*,
            listeners: {
                'render': function (p) {
                    var theTip3 = null;

                    p.getEl().on('mouseover', function () {
                        theTip3 = new Ext.Tip({
                            margin: '0 0 0 200',
                            shadow: false
                        });
                        var pos = _this.getPosition();
                        var x = pos[0] + 190;
                        var y = pos[1] + 50;
                        var text = "";
                        if (_this.getNodoSeleccionado().attributes.id == 0 || !_this.getNodoSeleccionado()) {
                            text = _this.idioma.TooltbtnEliminar;
                        } else {
                            text = _this.idioma.TooltbtnEliminarAtri;
                        }

                        theTip3.html = text;
                        theTip3.showAt([x, y]);
                    });

                    p.getEl().on('mouseout', function () {
                        if (theTip3)
                            theTip3.hide();
                    });
                }
            }*/
        });
        _this.panelTree.getSelectionModel().on('selectionchange', function () {
            var nodo = _this.panelTree.getNodoSeleccionado();
            if (nodo.id != 0) {
                _this.btnModificarTree.enable();
                _this.btnEliminarTree.enable();
            } else {
                _this.btnModificarTree.disable();
                _this.btnEliminarTree.disable();
            }
            _this.panelTree.fn(nodo);
        });

        _this.panelTree.getRootNode().expand();
       var panel= new Ext.Panel({
            region: 'west',
           title: 'Agrupaciones',
            width: 250,
            tbar:[_this.btnAdicionarTree, _this.btnModificarTree, _this.btnEliminarTree],
            items:[_this.panelTree],
            layout: 'fit'});
        this.panelAtributos = new Ext.erp.panelAtributos({
            title: _this.panelTree.root.text,
            bodyBorder: false,
            region: 'center',
            idioma: _this.idioma,
            panelTree: _this.panelTree,
            frame: true
        });
        this.items = [panel, _this.panelAtributos];
        var tempHotKeysDocument = [];

        function callkeydownhandler(evnt){
            var ev = (evnt) ? evnt : event;
            var code = (ev.which) ? ev.which : event.keyCode;

            //18 alt
            //17 ctrl
            //65 a
            //73 i
            //46 del
            //b del
            //76 l
            //console.info(code);
            //    console.info(tempHotKeysDocument);
            //    console.info(tempHotKeysDocument.length);
            //    console.info(tempHotKeysDocument.join('|'));

            if (code == 18 && tempHotKeysDocument.length <= 2) { // alt
                tempHotKeysDocument.push(code);

            } else if (code == 17 && tempHotKeysDocument.length <= 2) { //Ctrl
                tempHotKeysDocument.push(code);

            } else if (code == 13) { //enter
                if (!Ext.Msg.isVisible() && _this.panelTree.ventanaAgrupacion && _this.panelTree.ventanaAgrupacion.isVisible()) {
                    _this.panelTree.btnAceptarWinGestAgrupa.handler();//btn de adicionar agrupacion
                }else if (!Ext.Msg.isVisible() && _this.panelTree.padre.panelAtributos.wingestAtrib && _this.panelTree.padre.panelAtributos.wingestAtrib.isVisible()) {
                    _this.panelTree.padre.panelAtributos.wingestAtrib.btnAceptarWinGestAtri.handler();//btn de adicionar atributo
                }
            } else if (!Ext.Msg.isVisible() && code == 46 && _this.verificarWinsOpen()) { //Eliminar
                _this.panelTree.btnEliminar.handler();
            } else {
                tempHotKeysDocument.push(code);

                window.setTimeout(function() {

                    switch (tempHotKeysDocument.join('|')) {

                        case '18|77'://Modificar registro.
                            if (!Ext.Msg.isVisible() && _this.verificarWinsOpen()) {
                                _this.panelTree.btnModificar.handler();
                            }

                            tempHotKeysDocument = [];
                            break;
                        case '18|73'://Nuevo agrupacion.
                            if (!Ext.Msg.isVisible() && _this.verificarWinsOpen()) {
                                _this.panelTree.btnAdicionar.handler();
                            }

                            tempHotKeysDocument = [];
                            break;

                        case '18|88'://Cerrrar Ventanas.
                            if (!Ext.Msg.isVisible() && _this.panelTree.ventanaAgrupacion && _this.panelTree.ventanaAgrupacion.isVisible()) {
                                _this.panelTree.btnCancelarWinGestAgrupa.handler();//btn de cancelar agrupacion
                            }else if (!Ext.Msg.isVisible() && _this.panelTree.padre.panelAtributos.wingestAtrib && _this.panelTree.padre.panelAtributos.wingestAtrib.isVisible()) {
                                _this.panelTree.padre.panelAtributos.wingestAtrib.btnCancelarWinGestAtri.handler();//btn de cancelar atributo
                            }
                            tempHotKeysDocument = [];
                            break;

                        case '17|18|80'://aplicar.
                            if (!Ext.Msg.isVisible() && _this.panelTree.ventanaAgrupacion && _this.panelTree.ventanaAgrupacion.isVisible()) {
                                _this.panelTree.btnAplicarWinGestAgrupa.handler();//btn de aplicar agrupacion
                            }else if (!Ext.Msg.isVisible() && _this.panelTree.padre.panelAtributos.wingestAtrib && _this.panelTree.padre.panelAtributos.wingestAtrib.isVisible()) {
                                _this.panelTree.padre.panelAtributos.wingestAtrib.btnAplicarWinGestAtri.handler();//btn de aplicar atributo
                            }
                            tempHotKeysDocument = [];
                            break;

                        default:
                            tempHotKeysDocument = [];
                            break;
                    }

                }, 550);


            }
        }

        if (window.document.addEventListener) {
            window.document.addEventListener("keydown", callkeydownhandler, false);
        } else {
            window.document.attachEvent("onkeydown", callkeydownhandler);
        }
        Ext.erp.atriAgrupMain.superclass.initComponent.call(this);
    },
    verificarWinsOpen:function(){
        var _this = this;
        if (_this.panelTree.ventanaAgrupacion && _this.panelTree.ventanaAgrupacion.isVisible()){
            return false;
        }
         if (_this.panelTree.padre.panelAtributos.wingestAtrib && _this.panelTree.padre.panelAtributos.wingestAtrib.isVisible())
         {
             return false;
         }
        return true;
    },
    cargarGrid: function(nodo) {
        var _this = this;
        if (nodo.attributes.id != 0) {
            _this.panelAtributos.setTitle((nodo.attributes.agrup == 1)?nodo.attributes.text:nodo.parentNode.attributes.text);
            _this.panelAtributos.grid.getStore().baseParams = {};
            _this.panelAtributos.grid.getStore().baseParams.idagrupacion = (nodo.attributes.agrup == 1)?nodo.attributes.id:nodo.parentNode.attributes.id;
            _this.panelAtributos.grid.getStore().load();
        }
    }

});
UCID.portal.cargarEtiquetas('atributosporagrupaciones', function(perfil, idioma) {
    UCID.portal.cargarAcciones(window.frameElement.id, cargarInterfaz(perfil, idioma));
});

Ext.QuickTips.init();

perfil = window.parent.parent.parent.UCID.portal.perfil;
function cargarInterfaz(perfil, idioma) {

    var Viewport = new Ext.erp.atriAgrupMain({
        idioma: idioma
    });
    Viewport.doLayout();
}