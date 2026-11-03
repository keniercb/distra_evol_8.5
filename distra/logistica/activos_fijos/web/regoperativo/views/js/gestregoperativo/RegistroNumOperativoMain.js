Ext.ns('Ext.LOG.RegNumOperativo');
Ext.LOG.RegNumOperativo.RegistroNumOperativoMain = Ext.extend(Ext.Viewport, {
    tipo_area_seleccionada: 'entidad',
    id_entidad_seleccionada: null,
    constructor: function(config) {
        this.xtype = "viewport";
        Ext.apply(this, config);
        Ext.LOG.RegNumOperativo.RegistroNumOperativoMain.superclass.constructor.call(this, config);
    },
    initComponent: function() {
        var _this = this;
		this.fnBeforeLoad = null;
		/*this.setFnBeforeLoadExtern = function(fn){
		_this.fnBeforeLoad = fn;
			};*/
        var config = {
            layout: 'border'
        };
        //_this.arrayDatosDinamicos = new Array();
        //Arbol
        this.treegrid = new Ext.LOG.RegNumOperativo.TreeGridRegistroNO({
            idioma: _this.idioma,
            hideCombofiltroArea:true,
            acciones_reportes: acciones_reportes,
            url: 'cargarRegNumOperativo',
            parent: _this,
            fnHabilitarBotones: function() {
                _this.habilitarBotones(_this.treegrid);
            },
			fnBeforeLoad: function(){
				if(_this.fnBeforeLoad){
					_this.fnBeforeLoad();
				}
			},
            fnDesabilitarBotones: function() {
                _this.desabilitarBotones(_this.treegrid);
            },
            //id: 'idtreeGidPrincipal',
            scope: _this,
            enableDragDrop: true,
            ddGroup: 'firstGridDDGroup'
        });
        this.treegrid.getStore().on("beforeload", function() {
            _this.propertyGrid.setContenido();
            if (_this.panel_botones.btnAdicionar) {
                _this.panel_botones.btnAdicionar.disable();
            }
        });
        this.treegrid.getStore().on("load", function() {
            _this.panel_botones.btnAdicionar.enable();
        });
        // This will make sure we only drop to the view container
        this.treegrid.on('render', function() {
            var dragzone = this.treegrid.getView().el.dom.childNodes[0].childNodes[1];
            this.firstGridDropTarget = new Ext.dd.DropTarget(dragzone, {
                ddGroup: 'firstGridDDGroup',
                copy: false,
                notifyDrop: function(ddSodurce, e, data) {
                    var origenes = _this.treegrid.getSelectionModel().getSelections();
                    var t = Ext.lib.Event.getTarget(e);
                    var rindex = _this.treegrid.getView().findRowIndex(t);
                    /*console.info(_this.treegrid.getStore().getAt(rindex));
                    return;*/
                    mostrarMensaje(2, "\xbfEst\xe1 seguro que desea modificar el(los) registro(s) seleccionado(s)\x3f", function (btn) {
                        if (btn == 'ok') {
                            Ext.getBody().mask('Procesando', 'x-mask-loading');


                            if (rindex !== false) {
                                var id_destino = _this.treegrid.getStore().getAt(rindex).get('idregnumerico');
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

                                if (id_destino) {
                                    _this.treegrid.getStore().getAt(rindex).data._is_leaf = false;

                                    _this.treegrid.getSelectionModel().selectRow(rindex);
                                }
                                Ext.Ajax.request({
                                    url: '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/crearModuloDrgDrop',
                                    method: 'POST',
                                    params: {
                                        ids_origen: Ext.encode(ids_origen),
                                        ids_origenes_padres: Ext.encode(ids_origenes_padres),
                                        id_destino: id_destino
                                    },
                                    callback: function (options, success, response) {
                                        Ext.getBody().unmask();
                                        if (success) {
                                            mostrarMensaje(1, 'El m&oacute;dulo ha sido modificado satisfactoriamente.');
                                            if (id_destino) {
                                                var objDestino = _this.treegrid.getStore().getById(id_destino);

                                                if(id_destino != objDestino.data.idpadremodulo){
                                                    var padreDestino = _this.treegrid.getStore().getById(objDestino.data.idpadremodulo);
                                                    padreDestino.store.load({
                                                        callback:function () {
                                                            _this.treegrid.getStore().expandNode(padreDestino);
                                                            _this.treegrid.getStore().expandNode(objDestino);
                                                        }
                                                    });
                                                }else {
                                                    _this.treegrid.getStore().load({
                                                        params: {
                                                            anode: null,
                                                            _id: null
                                                        },
                                                        callback:function () {
                                                            // _this.treegrid.getSelectionModel().selectRow(rindex);
                                                            _this.treegrid.getStore().expandNode(objDestino);
                                                        }
                                                    });
                                                }


                                            } else {
                                                _this.treegrid.getStore().load({
                                                    params: {
                                                        anode: id_destino,
                                                        _id: null
                                                    },
                                                    callback:function () {
                                                        _this.treegrid.getSelectionModel().clearSelections();
                                                    }
                                                });
                                            }

                                        } else {
                                            mostrarMensaje(3, 'El m&oacute;dulo no se ha podido modificar.');
                                        }
                                    }
                                });
                            } else {
                                Ext.getBody().unmask();
                            }
                            return (true);
                        }
                    });

                }.createDelegate(this)
            });
        }, this);

        this.treegrid.getColumnModel().getColumnById('iddenominacionplantilla').hidden = true;
        this.treegrid.getColumnModel().getColumnById('iddenominacionplantilla').hideable = false;

        _this.propertyGrid = new Ext.LOG.RegNumOperativo.propertyAtriDinamicos({
            region: 'center',
            idioma: _this.idioma,
            fnExpand: function() {
                _this.panel_resumen.expand();
            },
            fnCollapse: function() {
                _this.panel_resumen.collapse();
            }
        });

        _this.panel_resumen = new Ext.Panel({
            title: _this.idioma.lbTitlePanelDatosMedio,
            layout: 'fit',
            region: 'east',
            width: 250,
            hideCollapseTool: true,
            collapsible: true,
            collapseMode: 'mini',
            titleCollapse:false,
            autoScroll: true,
            animCollapse: false,
            animate: false,
            split: true,
            collapsed: true,
            items: [_this.propertyGrid]
        });
        _this.panel_botones = new Ext.LOG.RegNumOperativo.PanelBotones({
            idioma: _this.idioma,
            treegrid: _this.treegrid,
            acciones_reportes: acciones_reportes,
            viwport: _this
        });
        _this.panel_botones.id_entidad_seleccionada = _this.id_entidad_seleccionada;

        this.treegrid.getSelectionModel().on('rowselect', function(SelectionModel, rowIndex, record) {
            if (SelectionModel.getSelections() && SelectionModel.getSelections().length == 1) {
                var idindicador = record.data.idindicador;
                var idregnumerico = record.data.idregnumerico;
                var idtabla = record.data.idtabla;
                var arridtablas = record.data.arridtablas;
                _this.propertyGrid.setContenido(idindicador, idregnumerico, idtabla, arridtablas);
            } else {
                _this.propertyGrid.setContenido();
            }
        });
        this.treegrid.getSelectionModel().on('rowdeselect', function(SelectionModel, rowIndex, record) {
            _this.propertyGrid.setContenido();
        });

        this.panelTreeGrid = new Ext.Panel({
            region: 'center',
            layout: 'fit',
            border: false,
            autoScroll: true,
            items: [_this.treegrid]
        });
        Ext.apply(config, {
            items: [_this.panel_botones, _this.panelTreeGrid, _this.panel_resumen]
        });
        Ext.apply(this, config);
        Ext.LOG.RegNumOperativo.RegistroNumOperativoMain.superclass.initComponent.call(this);
    },
    getTreegrid: function() {
        return this.treegrid;
    },
    onAyudaMedios: function() {
        alert("La Hayuda no est&aacute;!!!!");
    },
    habilitarBotones: function(tree) {
        if (tree.getSelectionModel().hasSelection()) {
            this.panel_botones.btnEliminar.enable();
            if (this.panel_botones.validarRegistroParaDoc()) {
                this.panel_botones.Documento.enable();
            }
            this.panel_botones.btnOrganigrama.enable();
            var records = tree.getSelectionModel().getSelections();
            var activModificar = true;
            for (var i = 0; i < records.length; i++) {
                if (!records[i].data.idindicador) {
                    activModificar = false;
                    break;
                }
            }
            (activModificar) ? this.panel_botones.btnModificar.enable() : this.panel_botones.btnModificar.disable();

            if (tree.getSelectionModel().getSelections().length == 1) {
                this.panel_botones.btnClonar.enable();
                this.panel_botones.btnPlantilla.enable();

            } else {
                this.panel_botones.btnClonar.disable();
                this.panel_botones.btnPlantilla.disable();
            }
            var seleccionados = this.treegrid.getSelectionModel().getSelections();
            if (seleccionados.length > 1) {
                this.panel_botones.btnAdicionar.disable();
            }
        }

    },
    desabilitarBotones: function(tree) {
        this.panel_botones.Documento.disable();
        this.panel_botones.btnEliminar.disable();
        this.panel_botones.btnModificar.disable();
        this.panel_botones.btnOrganigrama.disable();
        if (tree.getSelectionModel().getSelections().length == 1) {
            this.panel_botones.btnClonar.enable();
            this.panel_botones.btnPlantilla.enable();
        } else {
            this.panel_botones.btnClonar.disable();
            this.panel_botones.btnPlantilla.disable();
        }
        //var seleccionados = tree.getSelectionModel().getSelections();
        this.panel_botones.btnAdicionar.enable();
        if (tree.getSelectionModel().hasSelection()) {
            var records = tree.getSelectionModel().getSelections();
            this.panel_botones.Documento.enable();
            this.panel_botones.btnEliminar.enable();
            var activModificar = true;
            for (var i = 0; i < records.length; i++) {
                if (!records[i].data.idindicador) {
                    activModificar = false;
                    break;
                }
            }
            (activModificar) ? this.panel_botones.btnModificar.enable() : this.panel_botones.btnModificar.disable();
        }

    },
    habilitarBotonesPlantilla: function(tree) {
        if (tree.getSelectionModel().hasSelection()) {
            this.panel_botones.btnEliminar.enable();
            this.panel_botones.btnModificar.enable();
            var seleccionados = tree.getSelectionModel().getSelections();
            if (seleccionados.length > 1) {
                this.panel_botones.btnAdicionar.disable();
            }
        }
    },
    desabilitarBotonesPlantilla: function(tree) {
        this.panel_botones.btnEliminar.disable();
        var seleccionados = tree.getSelectionModel().getSelections();
        if (seleccionados.length == 1) {
            this.panel_botones.btnAdicionar.enable();
            this.panel_botones.btnModificar.enable();
        } else {
            this.panel_botones.btnModificar.disable();
        }
    }
});
