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
    defaults: {autoScroll: false},
    layout: 'border',
    listButtons: undefined,
    listItems: undefined,
    constructor: function (config) {
        var _this = this;
        Ext.apply(this, config);
        this.idioma = LOG.util.report.Idioma;
        this.listButtons = new Array();
        this.listItems = new Array();
        this.height = (window.frameElement.contentWindow.document.body.scrollHeight / 2) + (window.frameElement.contentWindow.document.body.scrollHeight / 4) - 2;
        this.width = window.frameElement.contentWindow.document.body.scrollWidth * 85 / 100;
        this.tbar = this.buildMenus();
        LOG.util.Report.superclass.constructor.call(this, config);
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
                typeFormat: 'HTML',
                content: 'text/HTML',
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
                        typeFormat: 'PDF',
                        content: 'application/pdf',
                        paginated: false,
                        isAttachment: true/*,
                        handler: this.viewReport.createDelegate(this, [{
                            typeFormat: 'PDF',
                            content: 'application/pdf',
                            paginated: false,
                            isAttachment: true
                        }])*/
                    }, {
                        text: 'RTF',
                        group: 'theme',
                        hidden: Ext.isWindows,//SO:All
                        typeFormat: 'RTF',
                        content: 'application/rtf',
                        paginated: false,
                        isAttachment: true/*,
                        handler: this.viewReport.createDelegate(this, [{
                            typeFormat: 'RTF',
                            content: 'application/rtf',
                            paginated: false,
                            isAttachment: true
                        }])*/
                    }, {
                        text: 'DOCX',
                        group: 'theme', //hidden: true,//SO:All
                        typeFormat: 'DOCX',
                        content: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        paginated: false,
                        isAttachment: true/*,
                        handler: this.viewReport.createDelegate(this, [{
                            typeFormat: 'DOCX',
                            content: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            paginated: false,
                            isAttachment: true
                        }])*/
                    }, {
                        text: 'ODT',
                        group: 'theme', // hidden: true,//SO:All
                        hidden: Ext.isWindows,//SO:All
                        typeFormat: 'ODT',
                        content: 'application/vnd.oasis.opendocument.text',
                        paginated: false,
                        isAttachment: true/*,
                        handler: this.viewReport.createDelegate(this, [{
                            typeFormat: 'ODT',
                            content: 'application/vnd.oasis.opendocument.text',
                            paginated: false,
                            isAttachment: true
                        }])*/
                    }, {
                        text: 'ODS',
                        group: 'theme', // hidden: true,
                        hidden: Ext.isWindows,//SO:All
                        typeFormat: 'ODS',
                        content: 'application/vnd.oasis.opendocument.spreadsheet',
                        paginated: false,
                        isAttachment: true/*,
                        handler: this.viewReport.createDelegate(this, [{
                            typeFormat: 'ODS',
                            content: 'application/vnd.oasis.opendocument.spreadsheet',
                            paginated: false,
                            isAttachment: true
                        }])*/
                    }, {
                        text: 'CSV',
                        group: 'theme', //hidden: true,
                        hidden: true,
                        typeFormat: 'CSV',
                        content: 'application/csv',
                        paginated: false,
                        isAttachment: true/*,
                        handler: this.viewReport.createDelegate(this, [{
                            typeFormat: 'CSV',
                            content: 'application/csv',
                            paginated: false,
                            isAttachment: true
                        }])*/
                    }, {
                        text: 'XLS',
                        group: 'theme', // hidden: false,
                        typeFormat: 'XLS',
                        content: 'application/vnd.ms-excel',
                        paginated: false,
                        isAttachment: true/*,
                        handler: this.viewReport.createDelegate(this, [{
                            typeFormat: 'XLS',
                            content: 'application/vnd.ms-excel',
                            paginated: false,
                            isAttachment: true
                        }])*/
                    }, {
                        text: 'XLSX',
                        group: 'theme', // hidden: false,
                        typeFormat: 'XLSX',
                        content: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        paginated: false,
                        isAttachment: true/*,
                        handler: this.viewReport.createDelegate(this, [{
                            typeFormat: 'XLSX',
                            content: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            paginated: false,
                            isAttachment: true
                        }])*/
                    }
                ]
            })
        };
        this.menuPrint = {
            text: 'Imprimir',
            group: 'theme',
            iconCls: 'imprimir',
            itemId: 'btnImprimir',
            tooltip: 'Imprimir reporte',
            key: {
                alt: true,
                key: 'i'
            },
            typeRequest: 'print',
            typeFormat: 'print'/*,
            handler: this.viewReport.createDelegate(this, [{typeRequest: 'print', typeFormat: 'print'}])*/
        };
        return new Ext.Toolbar(['->', this.menuControls, /*this.menuLoad,*/ this.menuExport, this.menuPrint]);
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
                item.parent = _this;
                this.proxyView = _this.createItem(item);
                this.proxyView.on({
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
                    item.parent = _this;
                    _this.proxyView.add(this.viewItemReport = _this.createItem(item));
                    this.viewItemReport.on({
                        'close': _this.onCloseReport.createDelegate(_this),
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
        if (Ext.version == '2.2') {
            this.getTopToolbar().items.get('btnLoad').handler.call()
        }
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
    urlExport: '/logistica/utiles/reportes/index.php/jasperclient/runReport?', //
    closable: true,
    resizable: false,
    draggable: false,
    frame: true,
    isRendered: false,
    padding: 2,
    loadMask:true,
    defaults: {autoScroll: false},
    border: false,
    layout: 'border',
    region: 'center',
    cls: 'x-panel-report',
    constructor: function (config) {
        var _this = this;
        this.cls = "x-panel-report-" + this.idframe;
        Ext.apply(this, config);
        this.initOn();
        LOG.util.ReportItem.superclass.constructor.call(this);
    },
    initComponent: function () {
        var _this = this;
        this.items = this.buildItems();
        if(this.defaultFormat == 'HTML'){
            this.store = new Ext.data.Store({
                reader: new Ext.data.HtmlReader({
                    root:'data',
                    record:'a[name*=JR_PAGE_ANCHOR_]'
                }),
                proxy : new Ext.data.HttpProxy({
                    url: this.urlExport,
                    method: 'POST'
                }),
                baseParams:{
                    start:0,
                    limit:1
                },
                listeners:{
                    'beforeload':this.onBeginLoad.createDelegate(this),
                    'load':this.onEndLoad.createDelegate(this)
                }
            });

            this.bbar = new Ext.PagingToolbar({
                pageSize: 1,
                buttonAlign : 'center',
                store: this.store,
                displayInfo: false,
                doLoad : function(start){
                    var o = {}, pn = this.getParams();
                    o[pn.start] = start;
                    o[pn.limit] = start + this.pageSize;
                    if(this.fireEvent('beforechange', this, o) !== false){
                        this.store.load({params:o});
                    }
                },
                getPageData : function(){
                    var total = this.store.getTotalCount();
                    this.cbPageSize.setVisible(false);
                    return {
                        total : total,
                        activePage : Math.ceil((this.cursor + this.pageSize)/this.pageSize),
                        pages :  total < this.pageSize ? 1 : Math.ceil(total/this.pageSize)
                    };
                }
            });
        }
        LOG.util.ReportItem.superclass.initComponent.call(this);
        this.doLayout();
    },
    // private
    initEvents : function(){
        LOG.util.ReportItem.superclass.initEvents.call(this);
        if(this.loadMask){
            this.loadMask = new Ext.LoadMask(this.bwrap,
                Ext.apply({store:this.store}, this.loadMask));
        }
    },
    initOn:function(){
        this.super().on({
            'afterlayout': this.onEndLayout.createDelegate(this)
        });
        this.super().getTopToolbar().getComponent('btnControl').on({
            'click':this.viewReport.createDelegate(this)
        });/*
        this.super().getTopToolbar().getComponent('btnLoad').on({
            'click':this.viewReport.createDelegate(this)
        });*/
        this.super().getTopToolbar().getComponent('btnExportar').menu.get(0).on({
            'click':this.viewReport.createDelegate(this)
        });
        this.super().getTopToolbar().getComponent('btnExportar').menu.get(1).on({
            'click':this.viewReport.createDelegate(this)
        });
        this.super().getTopToolbar().getComponent('btnExportar').menu.get(2).on({
            'click':this.viewReport.createDelegate(this)
        });
        this.super().getTopToolbar().getComponent('btnExportar').menu.get(3).on({
            'click':this.viewReport.createDelegate(this)
        });
        this.super().getTopToolbar().getComponent('btnExportar').menu.get(4).on({
            'click':this.viewReport.createDelegate(this)
        });
        this.super().getTopToolbar().getComponent('btnExportar').menu.get(5).on({
            'click':this.viewReport.createDelegate(this)
        });
        this.super().getTopToolbar().getComponent('btnExportar').menu.get(6).on({
            'click':this.viewReport.createDelegate(this)
        });
        this.super().getTopToolbar().getComponent('btnExportar').menu.get(7).on({
            'click':this.viewReport.createDelegate(this)
        });
        this.super().getTopToolbar().getComponent('btnImprimir').on({
            'click':this.viewReport.createDelegate(this)
        });
    },
    onEndLayout:function(p){
        var _this = this;
        if ((!p.isLayout)) {
            this.viewReport({
                typeRequest: 'auto',
                typeFormat: 'HTML',
                content: 'text/HTML',
                paginated: true,
                isAttachment: false
            });
            p.isLayout = true;
        }
    },
    super: function (){
        return this.parent;
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
            this.elems.push(this.buildSearch());
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
        this.panelReport.getForm().getEl().child("input."+ this.cls + "-datas").dom.value = value.trim();
        this.panelReport.getForm().submit();
    },
    merge: function (a, b) {
        if (Ext.isArray(a) && Ext.isArray(b)) {
            return a.concat(b);
        } else if (Ext.isObject(a) && Ext.isObject(b)) {
            return Ext.apply(a, b);
        }
        return a;
    },
    buildItems: function () {
        if (!this.panelReport)
            this.elems = [this.buildReport()];
        this.initSearch();
        return this.elems;
    }, //Existe la propiedad record en el panel
    hasSearch: function () {
        return (this.isList && this.uiSearch && this.uiSearch.items) ? true : false;
    },
    buildReport: function () {
        var _this = this;
        //this.htmlFrame = '<iframe id="' + this.idframe + '" name="' + this.idframe + '" frameborder="0" style="background-color: #ffffff;box-shadow: 0 3px 15px #a0a0a0;padding: 4px;border:1px solid #ffffff;width:100%;height:100%;" onload="LOG.util.ReportItem.prototype.onLoadReport(this.id);"> + </iframe>';
        return this.panelReport = new Ext.util.FramePanel({
            standardSubmit: true,
            region: 'center',
            layout: 'fit',
            resizable: false,
            draggable: false,
            monitorResize: true,
            defaults: {autoScroll: true},
            margins: '0 0 0 0',
            border: false,
            id: this.idframe + "1",
            name: this.idframe,
            bodyBorder: false,
           // html:this.htmlFrame,
            listeners: {
                afterrender: function (panel) {
                   /// panel.getForm().getEl().createChild("<input name='datas' type='text' class='" + _this.cls + "-datas' style='display:none' hidden='true' value='{0}'/>");
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
            //items: this.uiSearch.panelBusqueda,
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
    buildRequest:function(c){
       return {
           typeRequest: c.typeRequest || 'open', //auto,open,ajax
           typeFormat: c.typeFormat,
           content: c.content,
           name: this.name,
           dirReport: '/reports' + this.dirReport,
           params: (this.hasSearch()) ? this.merge(this.params, this.uiSearch.getForm().getValues()) : this.params,
           paginated: c.paginated,
           isAttachment: c.isAttachment,
           pages: (c.pages) ? c.pages : null,//(this.parent.pages && this.parent.pages.getValue()) ? this.parent.pages.getValue() : null,
           attachmentsPrefix: (this.parent.attachmentsPrefix && this.parent.attachmentsPrefix.checked) ? this.parent.attachmentsPrefix.checked : null,
           interactive: (this.parent.interactive && this.parent.interactive.checked) ? this.parent.interactive.checked : false,
           freshData: (this.parent.freshData && this.parent.freshData.checked) ? this.parent.freshData.checked : false,
           saveDataSnapshot: (this.parent.saveDataSnapshot && this.parent.saveDataSnapshot.checked) ? this.parent.saveDataSnapshot.checked : false,
           transformerKey: (this.parent.transformerKey && this.parent.transformerKey.checked) ? this.parent.transformerKey.checked : false
       }
    },
    viewReport: function (c) {
        this.exportReport(this.buildRequest(c));
    },
    exportReport: function (config) {
        var _this = this;
        this.config  = config;
        this.fireEvent('beforeExport', this, config);
        if (config.typeRequest == 'auto') {
           // this.store.baseParams.datas = Ext.encode(config);
            this.store.load({params:{start:0,limit:1}});
          //  this.loadReport(config);
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
    onBeginLoad:function(st,opts){
        console.log(st);
        console.log(opts);
        st.baseParams.datas = Ext.encode(this.buildRequest({
            typeRequest: 'auto',
            typeFormat: 'HTML',
            content: 'text/HTML',
            paginated: true,
            pages: (opts.params.start == 0 )? opts.params.limit : opts.params.start + '-' + opts.params.limit,
            isAttachment: false
        }));
    },
    onEndLoad:function(st,records,opts){
        this.panelReport.getIframe().document.open(); // if you want to remove all the items
        this.panelReport.update(st.reader.getResponseText());
        this.panelReport.getIframe().document.close();
    },
    onLoadReport: function (id) {
        document.getElementById(id).style = "width:100%; height:100%; border:0;";
    }
});


Ext.data.HtmlReader = function(meta, recordType){
    meta = meta || {};

    // backwards compat, convert idPath or id / success
    Ext.applyIf(meta, {
        idProperty: meta.idProperty || meta.idPath || meta.id,
        successProperty: meta.successProperty || meta.success
    });

    Ext.data.HtmlReader.superclass.constructor.call(this, meta, recordType || meta.fields);
};
Ext.extend(Ext.data.HtmlReader, Ext.data.XmlReader, {
    read: function (response) {
        var parser = new DOMParser();
        response.responseHTML = parser.parseFromString(response.responseText, 'text/html');
        var doc = response.responseHTML;
        console.log(doc);
        //   var doc = response.responseXML;
        if (!doc) {
            throw {message: "HtmlReader.read: Html Document not available"};
        }
        this.responseText = response.responseText;
        this.responseHTML = response.responseHTML;
        return this.readRecords(doc);
    },
    getResponseText:function(){
      return this.responseText;
    },
    getResponseHTML:function(){
      return this.responseHTML;
    },
    readRecords: function (doc) {
        this.xmlData = doc;
        var root = doc.documentElement || doc,
            q = Ext.DomQuery,
            totalRecords = 0,
            success = true;

        var records = q.select(this.meta.record, root);// <-- true to return Ext.data.Record[]
        console.log(records);
        if (this.meta.totalProperty) {
            totalRecords = records.length;
        }
        if (this.meta.successProperty) {
            success = this.getSuccess(root);
        }
        return {
            success: success,
            records: [],
            totalRecords: Number.MAX_VALUE || records.length
        };
    }
});

Ext.ns('Ext.util');

Ext.util.FramePanel = Ext.extend(Ext.Panel, {
    name: 'iframe',
    iframe: null,
    src: Ext.isIE && Ext.isSecure ? Ext.SSL_SECURE_URL : 'about:blank',
    maskMessage: 'loading ...',
    doMask: true,
    // component build
    initComponent: function() {
        this.bodyCfg = {
            tag: 'iframe',
            frameborder: '0',
            id:this.name,
            src: this.src,
            name: this.name
        }
        Ext.apply(this, {

        });
        Ext.util.FramePanel.superclass.initComponent.apply(this, arguments);
        this.addListener = this.on;

    },

    onRender : function() {
        Ext.util.FramePanel.superclass.onRender.apply(this, arguments);
        this.iframe = Ext.isIE ? this.body.dom.contentWindow : window.frames[this.name];
        this.body.dom[Ext.isIE ? 'onreadystatechange' : 'onload'] = this.loadHandler.createDelegate(this);
    },

    loadHandler: function() {
        this.src = this.body.dom.src;
        this.removeMask();
    },

    getIframe: function() {
        return this.iframe;
    },
    getUrl: function() {
        return this.body.dom.src;
    },

    setUrl: function(source) {
        this.setMask();
        this.body.dom.src = source;
    },

    resetUrl: function() {
        this.setMask();
        this.body.dom.src = this.src;
    },

    refresh: function() {
        if (!this.isVisible()) {
            return;
        }
        this.setMask();
        this.body.dom.src = this.body.dom.src;
    },

    /** @private */
    setMask: function() {
        if (this.doMask) {
            this.el.mask(this.maskMessage);
        }
    },
    removeMask: function() {
        if (this.doMask) {
            this.el.unmask();
        }
    },
    update : function(html) {
        this.iframe.document.write(html);
        return this;
    }
});
Ext.reg('iframePanel', Ext.util.FramePanel);