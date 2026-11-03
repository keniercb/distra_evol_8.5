Ext.ns('Distra', 'Distra.util');
Ext.ns('Distra.util', 'Distra.util.report');
Distra.util.Idioma = {
};
Distra.util.report.ReportView = Ext.extend(Ext.Window, {
    reportList: [],
    idframe: 'idframeReporte-',
    prevTimeId: 0,
    prevUniqueId: 0,
    name: 'window.jasper',
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
    defaults: {autoScroll: true},
    layout: 'border',
    listButtons: undefined,
    listItems: undefined,
    constructor: function(config) {
        var _this = this;
        this.idioma = Ext.apply(this, Distra.util.Idioma);
        this.listButtons = new Array();
        this.listItems = new Array();
        this.height = (window.frameElement.contentWindow.document.body.scrollHeight / 2) + (window.frameElement.contentWindow.document.body.scrollHeight / 4) - 2;
        this.width = window.frameElement.contentWindow.document.body.scrollWidth * 85 / 100;
        this.tbar = this.buildMenus();
        Distra.util.report.ReportView.superclass.constructor.call(this, config);
    },
    buildMenus: function() {
        var _this = this;
        this.menuGrafica = {
            text: 'Grafica(s)',
            hidden: true,
            itemId: 'btnGrafica',
            iconCls: 'bmenu',
            handler: this.proxyViewReport.createDelegate(this, [{typeFormat: 'HTML',
                    content: 'text/HTML',
                    paginated: false,
                    isAttachment: true}])
        };
        this.menuFisrt = {
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
            handler: this.proxyViewReport.createDelegate(this, [{
                    typeRequest:'auto',
                    typeFormat: 'HTML',
                    content: 'text/HTML',
                    paginated: false,
                    isAttachment: false}])
        };
        this.menuSeconds = {
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
                        handler: this.proxyViewReport.createDelegate(this, [{typeFormat: 'PDF',
                                content: 'application/pdf',
                                paginated: false,
                                isAttachment: true}])
                    }, {
                        text: 'RTF',
                        group: 'theme',
                        hidden: Ext.isWindows,//SO:All
                        handler: this.proxyViewReport.createDelegate(this, [{typeFormat: 'RTF',
                                content: 'application/rtf',
                                paginated: false,
                                isAttachment: true}])
                    }, {
                        text: 'DOCX',
                        group: 'theme', //hidden: true,//SO:All
                        handler: this.proxyViewReport.createDelegate(this, [{typeFormat: 'DOCX',
                                content: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                paginated: false,
                                isAttachment: true}])
                    }, {
                        text: 'ODT',
                        group: 'theme', // hidden: true,//SO:All
                        handler: this.proxyViewReport.createDelegate(this, [{typeFormat: 'ODT',
                                content: 'application/vnd.oasis.opendocument.text',
                                paginated: false,
                                isAttachment: true}])
                    }, {
                        text: 'ODS',
                        group: 'theme', // hidden: true,
                        handler: this.proxyViewReport.createDelegate(this, [{typeFormat: 'ODS',
                                content: 'application/vnd.oasis.opendocument.spreadsheet',
                                paginated: false,
                                isAttachment: true}])
                    }, {
                        text: 'CSV',
                        group: 'theme', //hidden: true,
                        handler: this.proxyViewReport.createDelegate(this, [{typeFormat: 'CSV',
                                content: 'application/csv',
                                paginated: false,
                                isAttachment: true}])
                    }, {
                        text: 'XLS',
                        group: 'theme', // hidden: false,
                        handler: this.proxyViewReport.createDelegate(this, [{typeFormat: 'XLS',
                                content: 'application/xls',
                                paginated: true,
                                isAttachment: true}])
                    }, {
                        text: 'XLSX',
                        group: 'theme', // hidden: false,
                        handler: this.proxyViewReport.createDelegate(this, [{typeFormat: 'XLSX',
                                content: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                paginated: true,
                                isAttachment: true}])
                    }
                ]
            })
        };
        this.menuImprimir = {
            text: 'Imprimir',
            group: 'theme',
            iconCls: 'imprimir',
            itemId: 'btnImprimir',
            tooltip: 'Imprimir reporte',
            key: {
                alt: true,
                key: 'i'
            },
            handler: this.proxyViewReport.createDelegate(this, [{typeFormat: 'print', mode: 'print'}])
        };
        return new Ext.Toolbar(['->', this.menuFisrt, this.menuLoad,this.menuSeconds, this.menuImprimir]);
    },
    buildItems: function() {
        var _this = this;
        this.listItems = [];
        if (this.reportList.length !== 0) {
            if (this.reportList.length === 1) {
                var item = this.reportList[0];
                item.title = false;
                item.useFirma = false;
                item.idioma = _this.idioma;
                item.idframe = this.idframe + this.generateUniqueNumber() + '-' + 1;
                this.proxyView = new Distra.util.report.ReportItemView(item);
                this.proxyView.on({
                    'beforerenderitem': _this.onBeforeRenderReport.createDelegate(_this),
                    'afterrenderitem': _this.onAfterRenderReport.createDelegate(_this),
                    'activate': _this.onActiveViewReport.createDelegate(_this),
                    'render':function(){
                        setTimeout(function(){
                            _this.menuLoad.handler.call(_this);
                        });

                    }
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
                this.reportList.forEach(function(item, index) {
                    item.closable = true;
                    item.useFirma = false;
                    item.idioma = _this.idioma;
                    item.title = item.name;
                    item.idframe = _this.idframe + _this.generateUniqueNumber() + '-' + index;
                    _this.proxyView.add(this.viewItemReport = new Distra.util.report.ReportItemView(item));
                    this.viewItemReport.on({
                        'close': _this.onCloseReport.createDelegate(_this),
                        'beforerenderitem': _this.onBeforeRenderReport.createDelegate(_this),
                        'afterrenderitem': _this.onAfterRenderReport.createDelegate(_this),
                        'activate': _this.onActiveViewReport.createDelegate(_this)
                    });
                });
            }
            this.listItems.push(this.proxyView);
        }
        return this.listItems;
    },
    onBeforeRenderReport: function(p) {
    },
    onAfterRenderReport: function(p) {
        var _this = this;
            this.viewReport({
                typeRequest: 'auto' ,
                typeFormat: 'HTML',
                content: 'text/HTML',
                paginated: true,
                isAttachment: false
            });
    },
    onCloseReport: function(p) {
        if (this.proxyView.items.length === 1) {
            this.close();
        }
    },
    onActiveViewReport: function(p) {
        if ((!p.isList) && (p.hasRecord()))
            this.setTitle((this.reportList.length === 1) ? this.title + " : [ " + p.name + " # " + p.record.get('nrodoc') + " del " + p.record.get('fechacontable') + " en " + [p.status[p.record.get('estado')]] + " ] " : this.title);
    },
    generateUniqueNumber: function() {
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
            return newUniqueId;
        }
        catch (e) {
            console.error('Distra.util.JasperClient.generateUniqueNumber error:' + e.message + '.');
        }
    },
    view: function() {

        this.items = this.buildItems();
        Distra.util.report.ReportView.superclass.initComponent.call(this);
        this.show();
    },
    getActiveReport: function() {
        return (this.reportList.length > 1) ? this.proxyView.getActiveTab() : this.proxyView;
    },
    proxyViewReport: function(c) {
        this.viewReport({
            typeRequest: c.isFirma ? 'ajax' : c.typeRequest ||  'open', //auto,open,ajax
            mode: c.mode,
            typeFormat: c.isFirma ? 'PDF' : c.typeFormat,
            content: c.isFirma ? 'application/pdf' : c.content,
            paginated: c.paginated,
            useFirma: c.isFirma ? true : false,
            isAttachment: c.isFirma ? false : true
        });
    },
    viewReport: function(c) {
        var _this = this;
        _this.getActiveReport().viewReport((c.typeFormat == 'print') ? {
            typeRequest: 'print',
            mode: c.mode
        } : {
            typeRequest: c.typeRequest, //auto,window,ajax
            typeFormat: c.typeFormat,
            content: c.content,
            paginated: c.paginated,
            isAttachment: c.isAttachment,
            pages: (_this.pages && _this.pages.getValue()) ? _this.pages.getValue() : null,
            attachmentsPrefix: (_this.attachmentsPrefix && _this.attachmentsPrefix.checked) ? _this.attachmentsPrefix.checked : null,
            interactive: (_this.interactive && _this.interactive.checked) ? _this.interactive.checked : false,
            freshData: (_this.freshData && _this.freshData.checked) ? _this.freshData.checked : false,
            saveDataSnapshot: (_this.saveDataSnapshot && _this.saveDataSnapshot.checked) ? _this.saveDataSnapshot.checked : false,
            transformerKey: (_this.transformerKey && _this.transformerKey.checked) ? _this.transformerKey.checked : false
        });
    }
});
Distra.util.report.ReportItemView = Ext.extend(Ext.Panel, {
    params: new Object(),
    dirReports: '',
    dirAction: '/logistica/utiles/reportes/index.php/jasperclient/runReport?', //
    closable: true,
    resizable: false,
    draggable: false,
    frame: true,
    isRendered: false,
    padding: 2,
    defaults: {autoScroll: true},
    border: false,
    useFirma: false,
    layout: 'border',
    region: 'center',
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        Distra.util.report.ReportItemView.superclass.constructor.call(this);
    },
    initComponent: function() {
        var _this = this;
        this.items = this.buildItems();
        Distra.util.report.ReportItemView.superclass.initComponent.call(this);
    },
    set: function(k, v) {
        this[k] = v;
    },
    get: function(k) {
        return this[k];
    },
    initFind: function() {
        if (this.hasBrowserAdvanz())
            this.items.push(this.buildFind());
    },
    getParams: function(config) {
        return 'datas=' + btoa(Ext.encode(config));
    },
    getViewIFrame: function() {
        return document.getElementById(this.idframe);
    }, 
    elReport: function() {
        return Ext.get(this.idframe);
    },
    loadReport: function(url) {
        var _this = this;
       var left = (this.el.dom.scrollWidth / 2) - 6 - ((this.el.dom.scrollWidth / 2) * 100) / this.el.dom.scrollWidth; //x
        var top = ((document.body.scrollHeight - 96)/2)/2;//y
        this.indicatorText = '<div class="ext-el-mask"></div><div class="ext-el-mask-msg x-mask-loading" style="left: ' + left + 'px; top: ' + top + 'px;"><div>Cargando...</div></div>';
        Ext.apply(Ext.Updater.defaults, {
               indicatorText : this.indicatorText
        });
        this.panelReport.el.mask('Cargando...', 'x-mask-loading');

        document.getElementById(this.idframe).src = url;
        document.getElementById(this.idframe).onload = function(){
            _this.autoResize.call(_this,_this.idframe);
        };
    },
    callbackReport: function(t,s,r){
       var _this = this;       
       t.dom.contentWindow.document.open('text/html','replace');
       t.dom.contentWindow.document.write("<iframe>" + r.responseText + "</iframe>");
       t.dom.contentWindow.document.close();
       this.panelReport.el.unmask(true);
       return false;
    },
    merge: function(a, b) {
        if (Ext.isArray(a) && Ext.isArray(b)) {
            return a.concat(b);
        } else if (Ext.isObject(a) && Ext.isObject(b)) {
            return Ext.apply(a, b);
        }
        return a;
    },
    buildItems: function() {
        if(!this.panelReport)
        this.items = [this.buildReport()];
        this.initFind();
        return this.items;
    }, //Existe la propiedad record en el panel
    hasBrowserAdvanz: function() {
        return (this.isList && this.browserAdvanz && this.browserAdvanz.items && this.browserAdvanz.xtype == 'form') ? true : false;
    },
    buildReport: function() {
        var _this = this;
        this.htmlFrame = '<iframe id="' + this.idframe + '" name="' + this.idframe + '" frameborder="0" style="background-color: #ffffff;box-shadow: 0 3px 15px #a0a0a0;padding: 4px;border:1px solid #ffffff;width:100%;height:100%;"></iframe>';

        return  this.panelReport = new Ext.Panel({
            region: 'center',
            layout: 'fit',
            frame: true,
            padding: 2,
            resizable: false,
            draggable: false,
            monitorResize: true,
            defaults: {autoScroll: true},
            margins: '0 0 0 0',
            border: false,
            bodyBorder: true,
            html: this.htmlFrame,
            listeners: {
                beforerender: function(p) {
                    _this.fireEvent('beforerenderitem', _this);
                },
                afterrender: function(p) {
                    _this.fireEvent('afterrenderitem', _this);
                }
            }
        });
    },
    buildFind: function() {
        var _this = this;
        return this.panelFind = new Ext.Panel({
            layout: 'fit',
            region: 'east',
            width: 300,
            collapsible: true,
            collapseMode: 'mini',
            collapsed: true,
            split: true,
            title: 'Busqueda Avanzada',
            frame: true,
            defaults: {autoScroll: true},
            margins: '0 0 0 0',
            items: [this.browserAdvanz],
            border: false,
            bodyBorder: true,
            listeners: {
                collapse: function(p) {
                    _this.panelReport.setWidth(_this.panelReport.getWidth() + p.getWidth());
                    //_this.doLayout();
                },
                expand: function(p) {
                    _this.panelReport.setWidth(_this.panelReport.getWidth() - p.getWidth());
                  //  _this.doLayout();
                }
            }
        });
    },
    viewReport: function(config) {
        var _this = this;
        Ext.apply(config, {
            name: _this.dirReports.split('/')[_this.dirReports.split('/').length - 1],
            dirReports: '/reports' + _this.dirReports,
            params: (this.hasBrowserAdvanz()) ? this.merge(_this.params, this.browserAdvanz.getForm().getValues()) : _this.params
        });
        if (config.typeRequest == 'auto') {
            this.loadReport(this.dirAction + this.getParams(config));
        } else if (config.typeRequest == 'open') {
            window.open(this.dirAction + this.getParams(config), '');
        } else if (config.typeRequest == 'print') {
            window.frames[this.idframe].focus();
            window.frames[this.idframe].print(true);
        }
    },
    autoResize: function(id) {
        this.panelReport.el.unmask();
        var scrollHeight = document.getElementById(id).contentWindow.document.body.scrollHeight;
        var scrollWidth = document.getElementById(id).contentWindow.document.body.scrollWidth;
        document.getElementById(id).height = (scrollHeight) + "px";
        document.getElementById(id).width = (scrollWidth) + "px";
        document.getElementById(id).style = "width :" + (scrollWidth) + "px;height :" + (scrollHeight) + "px;";
    },
    setDirAction: function(c) {
        this.dirAction = c;
    }
});