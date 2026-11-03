Ext.ns('LOG.util');
LOG.util.Report = Ext.extend(Ext.Window, {
    reports: [],
    prevTimeId: 0,
    prevUniqueId: 0,
    name: 'jasperreport',
    frame: true,
    modal: true,
    constrain: true,
    closable: true,
    maximizable: true,
    title: '<b>Visor de reportes</b>',
    resizable: false,
    draggable: true,
    closeAction: 'close',
    y: 0,
    // defaults: {autoScroll: false},
    layout: 'border',
    listButtons: undefined,
    listItems: undefined,
    constructor: function (config) {
        var _this = this;    
        Ext.apply(this, config);        
        this.typeRequest = config.typeRequest ? config.typeRequest : 'auto';
        this.typeFormat = config.typeFormat ? config.typeFormat : 'HTML';
        this.content = config.content ? config.content : 'text/HTML';
        this.paginated = config.paginated ? config.paginated : true;
        this.isAttachment= config.isAttachment ? config.isAttachment : false;
        this.idioma = Ext.apply(this, {});
        this.listButtons = new Array();
        this.listItems = new Array();
        this.height = (window.frameElement.contentWindow.document.body.scrollHeight / 2) + (window.frameElement.contentWindow.document.body.scrollHeight / 4) - 2;
        this.width = window.frameElement.contentWindow.document.body.scrollWidth * 85 / 100;
        this.tbar = this.buildMenus();
        LOG.util.Report.superclass.constructor.call(this);
    },
    buildMenus: function () {
        var _this = this;
        this.menuControls = {
            text: 'Controles',
            hidden: true,
            itemId: 'btnControl',
            iconCls: 'bmenu',
            menu: new Ext.menu.Menu({
                style: {
                    overflow: 'visible'
                },
                items: [
                    this.pages = new Ext.form.TextField({
                        width: 135,
                        iconCls: 'no-icon',
                        enableKeyEvents: true
                    }),
                    this.attachmentsPrefix = {
                        text: 'AttachmentsPrefix',
                        checked: false,
                        hidden: true,
                        handler: Ext.emptyFn
                    }, this.interactive = {
                        text: 'Interactive',
                        checked: false,
                        hidden: true,
                        handler: Ext.emptyFn
                    }, this.freshData = {
                        text: 'FreshData',
                        checked: false,
                        hidden: true,
                        handler: Ext.emptyFn
                    }, this.saveDataSnapshot = {
                        text: 'SaveDataSnapshot',
                        checked: false,
                        hidden: true,
                        handler: Ext.emptyFn
                    }, this.transformerKey = {
                        text: 'TransformerKey',
                        checked: false,
                        hidden: true,
                        handler: Ext.emptyFn
                    }
                ]
            })
        };
        this.menuLoad = {
            text: 'Actualizar',
            itemId: 'btnLoad',
            tooltip: 'Actualizar reporte',
            iconCls: 'icondistra-actualizar',
            handler: this.viewReport.createDelegate(this, [{
                typeRequest: 'auto',
                typeFormat: 'PDF',
                content: 'application/pdf',
                paginated: false,
                isAttachment: false
            }])
        };
        this.menuExport = {
            text: 'Exportar a',
            tooltip: 'Exportar a',
            itemId: 'btnExportar',
            key: {
                alt: true,
                key: 'E'
            },
            iconCls: 'exportar',
            menu: new Ext.menu.Menu({
                style: {
                    overflow: 'visible'
                },
                items: [
                    {
                        text: 'PDF',
                        group: 'theme', //SO:All
                        handler: this.viewReport.createDelegate(this, [{
                            typeFormat: 'PDF',
                            content: 'application/pdf',
                            paginated: false,
                            isAttachment: true
                        }])
                    }, {
                        text: 'RTF',
                        group: 'theme',
                        hidden: Ext.isWindows,//SO:All
                        handler: this.viewReport.createDelegate(this, [{
                            typeFormat: 'RTF',
                            content: 'application/rtf',
                            paginated: false,
                            isAttachment: true
                        }])
                    }, {
                        text: 'DOCX',
                        group: 'theme', //hidden: true,//SO:All
                        handler: this.viewReport.createDelegate(this, [{
                            typeFormat: 'DOCX',
                            content: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            paginated: false,
                            isAttachment: true
                        }])
                    }, {
                        text: 'ODT',
                        group: 'theme', // hidden: true,//SO:All
                        hidden: Ext.isWindows,//SO:All
                        handler: this.viewReport.createDelegate(this, [{
                            typeFormat: 'ODT',
                            content: 'application/vnd.oasis.opendocument.text',
                            paginated: false,
                            isAttachment: true
                        }])
                    }, {
                        text: 'ODS',
                        group: 'theme', // hidden: true,
                        hidden: Ext.isWindows,//SO:All
                        handler: this.viewReport.createDelegate(this, [{
                            typeFormat: 'ODS',
                            content: 'application/vnd.oasis.opendocument.spreadsheet',
                            paginated: false,
                            isAttachment: true
                        }])
                    }, {
                        text: 'CSV',
                        group: 'theme', //hidden: true,
                        hidden: true,
                        handler: this.viewReport.createDelegate(this, [{
                            typeFormat: 'CSV',
                            content: 'application/csv',
                            paginated: false,
                            isAttachment: true
                        }])
                    }, {
                        text: 'XLS',
                        group: 'theme', // hidden: false,
                        handler: this.viewReport.createDelegate(this, [{
                            typeFormat: 'XLS',
                            content: 'application/vnd.ms-excel',
                            paginated: false,
                            isAttachment: true
                        }])
                    }, {
                        text: 'XLSX',
                        group: 'theme', // hidden: false,
                        handler: this.viewReport.createDelegate(this, [{
                            typeFormat: 'XLSX',
                            content: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            paginated: false,
                            isAttachment: true
                        }])
                    }
                ]
            })
        };
        this.menuPrint = {
            text: 'Imprimir',
            group: 'theme',
            iconCls: 'imprimir',
            itemId: 'btnImprimir',
            hidden: this.typeFormat == 'PDF'? true : false,
            tooltip: 'Imprimir reporte',
            key: {
                alt: true,
                key: 'i'
            },
            handler: this.viewReport.createDelegate(this, [{typeRequest: 'print', typeFormat: 'print'}])
        };
        return new Ext.Toolbar(['->', this.menuControls, this.menuLoad, this.menuExport, this.menuPrint]);
    },
    buildItems: function () {
        var _this = this;
        this.listItems = [];
        if (this.reports.length !== 0) {
            if (this.reports.length === 1) {
                var item = this.reports[0];
                item.title = false;
                item.idioma = _this.idioma;
                item.idframe = this.uuid() + "-1";
                this.proxyView = _this.createItem(item);
                this.proxyView.on({
                    'afterlayout': _this.onAfterLayout.createDelegate(_this),
                    'activate': _this.onActiveViewReport.createDelegate(_this)
                });
                this.onActiveViewReport(this.proxyView);
            } else {
                this.proxyView = new Ext.TabPanel({
                    minTabWidth: 115,
                    activeTab: 0,
                    tabWidth: 135,
                    frame: true,
                    resizable: false,
                    draggable: false,
                    region: 'center',
                    bodyStyle: 'border:2px solid #c3daf9;margin-left: 0px;',
                    enableTabScroll: true,
                    defaults: {autoScroll: true}
                });
                this.reports.forEach(function (item, index) {
                    item.closable = true;
                    item.idioma = _this.idioma;
                    item.title = item.name;
                    item.idframe = _this.uuid() + "-" + index;
                    _this.proxyView.add(this.viewItemReport = _this.createItem(item));
                    this.viewItemReport.on({
                        'close': _this.onCloseReport.createDelegate(_this),
                        'afterlayout': _this.onAfterLayout.createDelegate(_this),
                        'activate': _this.onActiveViewReport.createDelegate(_this)
                    });
                });
            }
            this.listItems.push(this.proxyView);
        }
        return this.listItems;
    },
    createItem: function (config) {
        return new LOG.util.ReportItem(config)
    },
    onAfterLayout: function (p) {
        var _this = this;
        if ((!p.isLayout)) {
            this.viewReport({
                typeRequest: 'auto',
                typeFormat: 'PDF',
                content: 'application/pdf',
                paginated: true,
                isAttachment: false
            });
            p.isLayout = true;
        }
    },
    onCloseReport: function (p) {
        if (this.proxyView.items.length === 1) {
            this.close();
        }
    },
    onActiveViewReport: function (p) {
        if ((!p.isList))
            this.setTitle((this.reports.length === 1) ? this.title + " : [ " + ( p.description || p.name) + " ] " : this.title);
    },
    uuid: function () {
        var _this = this;
        try {
            var d = new Date();
            var newUniqueId = d.getTime();
            if (newUniqueId == _this.prevTimeId) {
                _this.prevUniqueId++;
            } else {
                _this.prevTimeId = newUniqueId;
                _this.prevUniqueId = 0;
            }
            newUniqueId = newUniqueId + '' + _this.prevUniqueId;
            return "uuid-" + newUniqueId;
        }
        catch (e) {
            console.error('uuid error:' + e.message + '.');
        }
    },
    initDisabledItems: function (p) {
        var _this = this;
        if ((!p.isList)) {
            this.getTopToolbar().getComponent('btnControl').setVisible(false);
            this.getTopToolbar().getComponent('btnLoad').setVisible(true);
            this.getTopToolbar().getComponent('btnExportar').setVisible(true);
            this.getTopToolbar().getComponent('btnImprimir').setVisible(true);
        }
    },
    view: function () {
        this.items = this.buildItems();
        LOG.util.Report.superclass.initComponent.call(this);
        this.show();
        // if (Ext.version == '2.2') {
        //     this.getTopToolbar().items.get('btnLoad').handler.call()
        // }
    },
    getActiveReport: function () {
        return (this.reports.length > 1) ? this.proxyView.getActiveTab() : this.proxyView;
    },
    getItem: function () {
        return this.getActiveReport();
    },
    viewReport: function (c) {
       this.getItem().viewReport({
            typeRequest: c.typeRequest || 'open', //auto,open,ajax
            typeFormat: c.typeFormat,
            content: c.content,
            paginated: c.paginated,
            isAttachment: c.isAttachment,
            pages: (this.pages && this.pages.getValue()) ? this.pages.getValue() : null,
            attachmentsPrefix: (this.attachmentsPrefix && this.attachmentsPrefix.checked) ? this.attachmentsPrefix.checked : null,
            interactive: (this.interactive && this.interactive.checked) ? this.interactive.checked : false,
            freshData: (this.freshData && this.freshData.checked) ? this.freshData.checked : false,
            saveDataSnapshot: (this.saveDataSnapshot && this.saveDataSnapshot.checked) ? this.saveDataSnapshot.checked : false,
            transformerKey: (this.transformerKey && this.transformerKey.checked) ? this.transformerKey.checked : false
        });
    }
});
LOG.util.ReportItem = Ext.extend(Ext.Panel, {
    params: new Object(),
    dirReport: '',
    urlExport: '/logistica/utiles/reportes/index.php?', //
    closable: true,
    resizable: false,
    draggable: false,
    frame: true,
    isRendered: false,
    padding: 2,
    // defaults: {autoScroll: false},
    border: false,
    layout: 'border',
    region: 'center',
    cls: 'x-panel-report',
    constructor: function (config) {
        var _this = this;
        Ext.apply(this, config);
        LOG.util.ReportItem.superclass.constructor.call(this);
    },
    initComponent: function () {
        var _this = this;
        this.items = this.buildItems();
        LOG.util.ReportItem.superclass.initComponent.call(this);
        // this.doLayout();
    },
    set: function (k, v) {
        this[k] = v;
    },
    get: function (k) {
        return this[k];
    },
    getTypeView: function () {
        return this.typeView;
    },
    initSearch: function () {
        if (this.hasSearch())
            this.items.push(this.buildSearch());
    },
    getViewIFrame: function () {
        return document.getElementById(this.idframe);
    },
    elReport: function () {
        return Ext.get(this.idframe);
    },
    loadReport: function (config) {
        var _this = this,value = Ext.encode(config);
        this.loadMask = new Ext.LoadMask(this.getEl(), {msg: 'Cargando...', removeMask: true});
        this.loadMask.show();
        this.panelReport.getForm().getEl().dom.action = this.urlExport;
        this.panelReport.getForm().getEl().dom.method = "POST";
        this.panelReport.getForm().getEl().dom.target = this.idframe;
        this.panelReport.getForm().getEl().dom.enctype = "multipart/form-data";
        this.panelReport.getForm().setValues({
            datas: value.trim()
        });
        // this.panelReport.getForm().getEl().child("input."+ this.cls + "-datas").dom.value = value.trim();
        this.panelReport.getForm().submit();
    },
    merge: function (a, b) {
        if (Ext.isArray(a) && Ext.isArray(b)) {
            return a.concat(b);
        } else if (a instanceof Object && b instanceof Object) {
            return Ext.apply(a, b);
        }
        return a;
    },
    buildItems: function () {
        if (!this.panelReport)
            this.items = [this.buildReport()];
        this.initSearch();
        return this.items;
    }, //Existe la propiedad record en el panel
    hasSearch: function () {
        return (this.isList && this.uiSearch && this.uiSearch.items) ? true : false;
    },
    buildReport: function () {
        var _this = this;
        this.cls = "x-panel-report-" + this.idframe;
        this.htmlFrame = '<iframe id="' + this.idframe + '" name="' + this.idframe + '" frameborder="0" style="background-color: #ffffff;box-shadow: 0 3px 15px #a0a0a0;padding: 4px;border:1px solid #ffffff;width:100%;height:100%;" onload="LOG.util.ReportItem.prototype.onLoadReport(this.id);"></iframe>';
        var tfDatas = new Ext.form.TextField({
            fieldLabel: 'Importe',
            // disabled: true,
            name: 'datas',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            cls: _this.cls + '-datas',
            id: 'datass',
            width: 85
        });
        return this.panelReport = new Ext.form.FormPanel({
            standardSubmit: true,
            region: 'center',
            layout: 'fit',
            resizable: false,
            draggable: false,
            monitorResize: true,
            // defaults: {autoScroll: true},
            margins: '0 0 0 0',
            border: false,
            id: this.idframe + "1",
            items: [
                {
                    columnWidth: 0,
                    layout: 'form',
                    labelAlign: 'top',
                    hidden: true,
                    items: [tfDatas]
                }
            ],
            bodyBorder: false,
            html: this.htmlFrame,
            listeners: {
                render: function (panel) {
                    // panel.getForm().getEl().createChild("<input id='datass' name='datas' type='text' class='" + _this.cls + "-datas' style='display:none' hidden='true' value='{0}'/>");
                  //s  _this.fireEvent('afterrenderitem', _this);
                }
            }
        });
    },
    buildSearch: function () {
        var _this = this;
        this.listaBotones = new LOG.util.List();
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonCancelar({
            handler: this.onHidden.createDelegate(this),
            scope: this,
            tooltip: LOG.util.Idioma.ttBtnOcultar
        }, true)));
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonLimpiar({
            handler: this.onReset.createDelegate(this),
            scope: this
        })));
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonBuscar({
            handler: this.onAccept.createDelegate(this),
            scope: this
        })));
        return this.panelSearch = new Ext.form.FormPanel({
            layout: 'fit',
            region: 'east',
            collapsible: true,
            collapseMode: 'mini',
            collapsed: true,
            width: this.uiSearch.panelBusqueda.width,
            split: true,
            title: 'Busqueda Avanzada',
            frame: true,
            defaults: {autoScroll: true},
            margins: '0 0 0 0',
            cmargins: '0 0 0 0',
            items: this.uiSearch.panelBusqueda,
            border: false,
            bodyBorder: true,
            buttons: this.listaBotones.getArray(),
            listeners: {
                collapse: function (p) {
                    _this.panelReport.setWidth(_this.panelReport.getWidth() + p.getWidth());
                    //_this.doLayout();
                },
                expand: function (p) {
                    _this.panelReport.setWidth(_this.panelReport.getWidth() - p.getWidth());
                    //  _this.doLayout();
                }
            }
        });
    },
    onHidden: function () {
        this.panelSearch.collapse();
    },
    onReset: function () {
        this.panelSearch.getForm().reset();
        this.onAccept();
    },
    onAccept: function () {
        this.viewReport.call(this, Ext.apply(this.config, {
            typeRequest: 'auto',
            typeFormat: 'HTML',
            content: 'text/HTML',
            paginated: true,
            isAttachment: false
        }));
    },
    viewReport: function (config) {
        var _this = this;
        _this.params.typeFormat = config.typeFormat;
        this.config  = Ext.apply(config, {
            name: this.name,
            dirReport: '/reports' + _this.dirReport,
            params: this.merge(_this.params,{idestructura : window.idEntidad || null })//(this.hasSearch()) ? this.merge(_this.params, this.uiSearch.getForm().getValues()) : _this.params
        });
        console.log(config);
        this.fireEvent('beforeExport', this, config);
        if (config.typeRequest == 'auto') {
            this.loadReport(config);
        } else if (config.typeRequest == 'open') {
            this.openReport(config);
        } else if (config.typeRequest == 'print') {
            this.print();
            return false;
        }
    },
    print: function () {
        var pnl = this;
        var contentWindow = this.elReport().dom.contentWindow;
        contentWindow.focus();
        contentWindow.print();
    },
    openReport: function (config) {
        window.open(this.urlExport + "datas=" + Ext.encode(config), '');
    },
    onLoadReport: function (id) {
        Ext.select(".x-panel-report-" + id + " .ext-el-mask").remove();
        Ext.select(".x-panel-report-" + id + " .ext-el-mask-msg").remove();
        Ext.select(".x-panel-report-" + id + " .x-mask-loading").remove();
        document.getElementById(id).style = "width:100%; height:100%; border:0;";
    }
});