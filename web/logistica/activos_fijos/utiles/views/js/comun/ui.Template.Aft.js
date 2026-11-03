Ext.ns('LOG.util.aft');
Ext.ns('Log.AF.Utiles');
Ext.ns('LOG.lb.plugin');
/**
 * Plantilla para la cracion de IU de gestion de logistica
 * Contiene un panel con los botones, un grid general y panel con busqueda
 * avanzada
 * @type @exp;Ext@call;extend
 */
LOG.util.aft.UITemplate = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        var _this = this;
        Ext.apply(this, config);
// Variables que definen el nivel estructural seleccionado por el usuario
        _this.idNodoSeleccionado = null;
        _this.denomNodoSeleccionado = null;
        _this.caminoNodoSeleccionado = null;
        _this.idPadreNodoSeleccionado = null;
        _this.denomPadreNodoSeleccionado = null;
        config.doAction = function (nodo) {
            //Ext.getBody().mask(_this.idioma.lbMsgCargandoDatos, 'x-mask-loading');
            _this.idNodoSeleccionado = nodo.attributes.id;
            _this.denomNodoSeleccionado = nodo.attributes.text;
            _this.caminoNodoSeleccionado = nodo.attributes.caminoDenominacion;

            _this.comboDeposito.setValue(_this.idNodoSeleccionado);
            _this.comboDeposito.setRawValue(_this.caminoNodoSeleccionado);

            var nodoPadre = _this.arbolEstructura.dameNodoEntidadPertenece(nodo.attributes.id);

            _this.idPadreNodoSeleccionado = nodoPadre.attributes.id;
            _this.denomPadreNodoSeleccionado = nodoPadre.attributes.text;
            if (config.doActionEstructura) {
                config.doActionEstructura.call();
            }
        };
        if (_this.conEstructura) {
            _this.arbolEstructura = new Log.AF.Utiles.ArbolAreaResp({
                bodyStyle: 'background: white',
                entidad: _this.denomPadreNodoSeleccionado,
                identidad: _this.idPadreNodoSeleccionado,
                region: 'center',
                border: false,
                autoHeight: true,
                bodyBorder: false,
                urlParams: 'cargarcomboarea',
                check: {
                    conCheck: -1,
                    chequeados: new Array()
                }
            });

            _this.arbolEstructura.initEventos(config);

        }
        _this.cargarEntidadComboArea(config);

        LOG.util.aft.UITemplate.superclass.constructor.call(this, config);
    },
    init: function () {
        LOG.util.aft.UITemplate.superclass.init.call(this);


    },
    /**
     *
     * @returns {void}
     */
    render: function (config) {
        var _this = this;
        this.smGridPrincipal = LOG.util.UIManager.initSelectionModel(this.modoSeleccion, this.singleSelect || undefined);

        var cls = LOG.util.UIManager.proccessColumns(this.listaColumnas, (this.modoSeleccion == 3 ? this.smGridPrincipal : null));

        var objCfg = {
            _plugins: this.gridPlugins.getArray()
        };

        if (this.rowexpander != '') {
            var expander = new Ext.ux.grid.RowExpander({
                tpl: new Ext.Template(_this.rowexpander)
            });
            cls.columns.push(expander);
            objCfg._plugins.push(expander);
        }
        if (cls.filtros.length > 0) {
            var gridFilter = new Ext.ux.grid.GridFilters({
                local: false,
                encode: true,
                filters: cls.filtros
            });
            objCfg._plugins.push(gridFilter);
        }
        this.cmGridPrincipal = new Ext.grid.ColumnModel(cls.columns);
        if (cls.bloquear) {
            this.cmGridPrincipal = new Ext.ux.grid.LockingColumnModel(cls.columns);
            objCfg.view = new Ext.ux.grid.LockingGridView();
        }
        this.recStGridPrincipal = Ext.data.Record.create(cls.fields);
        var cfgStore = {
            url: this.urlBusquedaGridPrincipal,
            remoteSort: true,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                idProperty: this.idGridPrincipal
            }, this.recStGridPrincipal)
        };

        if (cls.groupField != false) {
            cfgStore = LOG.util.UIManager.apply(cfgStore, {
                sortInfo: {field: this.orderField || this.idGridPrincipal, direction: "ASC"},
                groupField: cls.groupField,
                remoteSort: true
            });
        }
        this.stDepositos = new Ext.data.SimpleStore({
            fields: ['id', 'descripcion'],
            data: [],
            autoLoad: false
        });

        this.comboDeposito = new LOG.util.ComboBox({
            width: 450,
            disabled: true,
            //id: 'itemx',
            forceSelection: false,
            mode: 'local',
            allowBlank: false,
            emptyText: '',
            displayField: 'descripcion',
            valueField: 'id',
            hiddenName: 'id',
            readOnly: true,
            store: this.stDepositos,
            editable: false,
            listeners: {
                'render': function (p) {
                    var theTip = null;
                    p.getEl().on('mouseover', function () {
                        theTip = new Ext.Tip({
                            margin: '0 0 0 200',
                            shadow: false
                        });
                        var pos = _this.comboDeposito.getPosition();
                        var x = pos[0];
                        var y = pos[1] + 20;
                        var text = (_this.idNodoSeleccionado == _this.comboDeposito.getValue()) ? _this.idioma.lbEntidad : _this.idioma.lbCbDeposito;
                        theTip.html = '<b>' + text + ':</b>' + ' <br/>' + _this.comboDeposito.getRawValue();
                        theTip.showAt([x, y]);
                    });

                    p.getEl().on('mouseleave', function () {
                        if (theTip)
                            theTip.hide();
                    });
                },
                'focus': function (combo) {
                    if (_this.arbolEstructura) {
                        _this.panelDerecho.expand();
                    }
                }
            }
        });

        this.storePrincipal = (cls.groupField == false) ? new Ext.data.Store(cfgStore) : new Ext.data.GroupingStore(cfgStore);
        objCfg.expanded = cls.expanded || false;
        objCfg.nobbar = !this.bbarVisible;
        objCfg.showMsgCargar = this.showMsgCargar;
        this.gpPrincipal = (this.gridEditable) ? LOG.util.UIManager.initEditableGridPanel(this.cmGridPrincipal, this.storePrincipal, this.smGridPrincipal, objCfg) : LOG.util.UIManager.initGrid(this.cmGridPrincipal, this.storePrincipal, this.smGridPrincipal, objCfg);
        if (cls.groupField != false) {
            LOG.util.UIManager.apply(this.gpPrincipal, {
                view: new Ext.grid.GroupingView({
                    forceFit: true,
                    groupTextTpl: '{text} : {[values.rs.length]} ' + LOG.util.Idioma.lbItems
                })
            });

            var _id = Ext.id();
            this.gpPrincipal.getBottomToolbar().add(['->',
                {
                    iconCls: 'agupar-desagrupar',
                    menu: [
                        {
                            text: LOG.util.Idioma.lbBtnAgrupar,
                            iconCls: 'agrupar-flecha',
                            disabled: true,
                            handler: function () {
                                _this.storePrincipal.groupBy(cls.groupField);
                                this.disable();
                                Ext.getCmp(_id + '-agrupar').enable();
                            },
                            id: _id + '-desagrupar'
                        }, {
                            text: LOG.util.Idioma.lbBtnDesagrupar,
                            iconCls: 'desagrupar-flecha',
                            handler: function () {
                                _this.storePrincipal.clearGrouping();
                                this.disable();
                                Ext.getCmp(_id + '-desagrupar').enable();
                            },
                            id: _id + '-agrupar'
                        }]
                },
                '-']);
        }
        this.gpPrincipal.on({
            'rowdblclick': function () {
                if (typeof _this.onGridDobleClick == 'function') {
                    _this.onGridDobleClick.call(_this);
                }
            }
        });

        this.storePrincipal.fireEvent = this.storePrincipal.fireEvent.createSequence(function (e) {
            if (e == 'load' && _this.autoSelect) {
                if (_this.storePrincipal.getTotalCount() > 0) {
                    if (_this.smGridPrincipal.hasSelection()) {
                        _this.smGridPrincipal.clearSelections();
                        _this.smGridPrincipal.fireEvent('rowdeselect');
                    }
                    _this.smGridPrincipal.selectFirstRow();
                }
            }
        });
        LOG.util.UIManager.initGridContexMenu(this.gpPrincipal, this.listaMenu);
        if (this.modelo) {
            this.modelo.bindGridPanel(this.gpPrincipal);
        }
        this.gpPrincipal.concepto = this.concepto;
        if (this.busquedaBasica) {
            this.gridFilter = LOG.util.UIManager.initFilterGrid(this.gpPrincipal, this.textBusquedaSimple);
        }
        //Panel de botones principales
        if (this.listaBotones.count()) {
            this.panelBotones.getTopToolbar().add('-');
            this.panelBotones.getTopToolbar().add(this.listaBotones.getArray());
        } else {
            this.panelBotones.getTopToolbar().setVisible(false);
        }
        this.panelPrincipal.add(this.panelBotones);

        this.panelDerecho = LOG.util.UIManager.initPanel({
            region: 'east',
            width: '25%',
            frame: true,
            hideCollapseTool: false,
            bodyStyle: 'background: white',
            titleCollapse: true,
            layout: 'form',
            autoScroll: true,
            collapsible: true,
            collapseMode: 'mini',
            animCollapse: false,
            animate: true,
            collapsed: true,
            //items: [_this.arbolEstructura],
            listeners: {
                'render': function () {

                },
                'collapse': function () {
                    this.hide();
                    if (_this.busquedaAvanzada) {
                        _this.panelBusquedaAvanzada.collapse();
                    }
                    this.doLayout();
                },
                'beforeexpand': function () {
                    this.show();
                    //_this.bntBusquedaAvanzada.hide();
                    this.doLayout();
                }
            }
        });


        this.panelGrid.add(this.gpPrincipal);
        this.panelGrid.add(this.panelDerecho);

        this.panelCentralCmp = LOG.util.UIManager.initPanel({
            region: 'center',
            tbar: ['-', {html: '', id: 'idHTMLcantidad'}, '->', {
                xtype: 'label',
                text: "Entidad / \xc1rea de responsabilidad" + ':'
            }, '', _this.comboDeposito],
            layout: 'border',

            items: [_this.panelGrid]
        });

        if (typeof this.getPanelContenido == 'function') {
            this.panelPrincipal.add(this.getPanelContenido());
        } else {
            this.panelPrincipal.add(this.panelCentralCmp);
        }
        if (this.busquedaAvanzada) {
            this.panelBusquedaAvanzada.setContainer(this.panelDerecho);
            this.panelBusquedaAvanzada.setKeyContainer(this.panelGrid);
            this.panelBusquedaAvanzada.setGrid(this.gpPrincipal);
            this.panelBusquedaAvanzada.init();
            this.panelBusquedaAvanzada.on({
                'show': function () {
                    _this.panelDerecho.expand(false);
                }
            });
        }

        /*if (this.busquedaAvanzada) {
         this.panelBusquedaAvanzada.setContainer(this.panelPrincipal);
         this.panelBusquedaAvanzada.setKeyContainer(this.panelGrid);
         this.panelBusquedaAvanzada.setGrid(this.gpPrincipal);
         this.panelBusquedaAvanzada.init();
         }*/
        this.setTemplateView(config || {});
        this.enableHotKeys(this.panelGrid);
        if (this.autoShow && this.formaVisualizacion == 'ventana') {
            this.vistaPrincipal.show();
            this.vistaPrincipal.doLayout();
        }
        if (_this.conEstructura) {
            this.panelDerecho.add(this.arbolEstructura);
        }

        return this.vistaPrincipal;
    },
    cargarEntidadComboArea: function (conf) {
        var _this = this;

        Ext.Ajax.request({
            url: 'getentidad',
            method: 'POST',
            callback: function (options, success, response) {
                var rd = Ext.decode(response.responseText);
                _this.idNodoSeleccionado = rd.identidad;
                _this.denomNodoSeleccionado = rd.entidad;

                _this.idPadreNodoSeleccionado = rd.identidad;
                _this.denomPadreNodoSeleccionado = rd.entidad;
                if (_this.conEstructura) {
                    _this.arbolEstructura.asignarNodoPadre(_this.denomPadreNodoSeleccionado, _this.idPadreNodoSeleccionado);
                }


                _this.comboDeposito.setRawValue(rd.entidad);
                _this.comboDeposito.enable();
                if (_this.autoLoad) {
                    _this.storePrincipal.load();
                }
                if (typeof conf.fnEntidad == 'function') {
                    conf.fnEntidad.call(_this);
                }
            }
        });
    }


});
