/**
 * Created by yoendy on 7/24/2015.
 */
/*Ext.ux.TabCloseMenu = Ext.extend(Object, {
 *//**
 * @cfg {String} closeTabText
 * The text for closing the current tab. Defaults to <tt>'Close Tab'</tt>.
 *//*
 closeTabText: 'Close Tab',
 *//**
 * @cfg {String} closeOtherTabsText
 * The text for closing all tabs except the current one. Defaults to <tt>'Close Other Tabs'</tt>.
 *//*
 closeOtherTabsText: 'Close Other Tabs',
 *//**
 * @cfg {Boolean} showCloseAll
 * Indicates whether to show the 'Close All' option. Defaults to <tt>true</tt>.
 *//*
 showCloseAll: true,
 *//**
 * @cfg {String} closeAllTabsText
 * <p>The text for closing all tabs. Defaults to <tt>'Close All Tabs'</tt>.
 *//*
 closeAllTabsText: 'Close All Tabs',
 constructor: function(config) {
 Ext.apply(this, config || {});
 },
 //public
 init: function(tabs) {
 this.tabs = tabs;
 tabs.on({
 scope: this,
 contextmenu: this.onContextMenu,
 destroy: this.destroy
 });
 },
 destroy: function() {
 Ext.destroy(this.menu);
 delete this.menu;
 delete this.tabs;
 delete this.active;
 },
 // private
 onContextMenu: function(tabs, item, e) {
 this.active = item;
 var m = this.createMenu(),
 disableAll = true,
 disableOthers = true,
 closeAll = m.getComponent('closeall');

 m.getComponent('close').setDisabled(!item.closable);
 tabs.items.each(function() {
 if (this.closable) {
 disableAll = false;
 if (this != item) {
 disableOthers = false;
 return false;
 }
 }
 });
 m.getComponent('closeothers').setDisabled(disableOthers);
 if (closeAll) {
 closeAll.setDisabled(disableAll);
 }

 e.stopEvent();
 m.showAt(e.getPoint());
 },
 createMenu: function() {
 if (!this.menu) {
 var items = [{
 itemId: 'close',
 text: this.closeTabText,
 scope: this,
 handler: this.onClose
 }];
 if (this.showCloseAll) {
 items.push('-');
 }
 items.push({
 itemId: 'closeothers',
 text: this.closeOtherTabsText,
 scope: this,
 handler: this.onCloseOthers
 });
 if (this.showCloseAll) {
 items.push({
 itemId: 'closeall',
 text: this.closeAllTabsText,
 scope: this,
 handler: this.onCloseAll
 });
 }
 this.menu = new Ext.menu.Menu({
 items: items
 });
 }
 return this.menu;
 },
 onClose: function() {
 this.tabs.remove(this.active);
 },
 onCloseOthers: function() {
 this.doClose(true);
 },
 onCloseAll: function() {
 this.doClose(false);
 },
 doClose: function(excludeActive) {
 var items = [];
 this.tabs.items.each(function(item) {
 if (item.closable) {
 if (!excludeActive || item != this.active) {
 items.push(item);
 }
 }
 }, this);
 Ext.each(items, function(item) {
 this.tabs.remove(item);
 }, this);
 }
 });*/
//Ext.preg('tabclosemenu', Ext.ux.TabCloseMenu);
/*Ext.onReady(function() {
 Ext.QuickTips.init();
 this.report = new Distra.util.JasperClient({
 uiFilters: [
 {
 fieldLabel: 'Estado',
 xtype: 'textfield',
 name: 'idestado',
 allowBlank: false
 },
 {
 fieldLabel: 'Deposito',
 xtype: 'combo',
 name: 'iddeposito'
 }
 ],
 reports: [
 {
 name: 'Modelo de Pedido',
 params: {
 },
 dirReport: '/nuevo/nuevo'
 },
 {
 name: 'Modelo de Menu',
 params: {
 estado: 'Elaborado',
 idestructura: '234'
 },
 dirReport: '/distra/logistica/inventario/alimento/MenuModelo'
 }
 ]
 }).view();
 });*/
Ext.ns('Distra.util');
Distra.util.JasperClient = Ext.extend(Ext.Window, {
    uiFilters: false,
    reports: [],
    useFirmaView: false,
    idframe: 'idframeReporte-',
    prevTimeId: 0,
    prevUniqueId: 0,
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, {
            closable: true,
            title: "<center aling='center' style='height:18px;padding:2px;background-color: #cedff5;'>Visor de reportes</center>",
            resizable: false,
            draggable: true,
            closeAction: 'close',
            height: window.frameElement.contentWindow.document.body.scrollHeight - 20,
            width: window.frameElement.contentWindow.document.body.scrollWidth * 70/100,
            tbar: this.buildMenus(config),
            frame: true,
            constrain: true,
            modal: true,
            baseCls: 'pcomponente',
            layout: 'border',
            prevTimeId: 0,
            prevUniqueId: 0,
            items: this.buildItems(config)
        });
        Distra.util.JasperClient.superclass.constructor.call(this, config);
    },
    buildMenus: function(config) {
        var _this = this;
        this.menuFirma = {
            text: 'Firma Digital',
            checked: false,
            iconCls: 'bmenu',
            scope: this,
            hidden: config.useFirmaView ? false : true,
            handler: this.onFirmaDigital
        };
        this.menuFisrt = {
            text: 'Controles',
            iconCls: 'bmenu',
            hidden: true,
            menu: new Ext.menu.Menu({
                id: 'mainMenu',
                style: {
                    overflow: 'visible'     // For the Combo popup
                },
                items: [
                    // stick any markup in a menu
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b class="menu-title" aling="center">P&aacute;gina a mostrar:</b>',
                    this.pages = new Ext.form.TextField({
                        width: 135,
                        iconCls: 'no-icon',
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function(field, e) {
                                if (e.getCharCode() == e.ENTER) {
                                    _this.onApply();
                                }
                            }
                        }
                    }),
                    this.attachmentsPrefix = {
                        text: 'AttachmentsPrefix',
                        checked: false,
                        hidden: true,
                        handler: this.onEmpty
                    }, this.interactive = {
                        text: 'Interactive',
                        checked: false,
                        hidden: true,
                        handler: this.onEmpty
                    }, this.freshData = {
                        text: 'FreshData',
                        checked: false,
                        hidden: true,
                        handler: this.onEmpty
                    }, this.saveDataSnapshot = {
                        text: 'SaveDataSnapshot',
                        checked: false,
                        hidden: true,
                        handler: this.onEmpty
                    }, this.transformerKey = {
                        text: 'TransformerKey',
                        checked: false,
                        hidden: true,
                        handler: this.onEmpty
                    }
                ]
            })
        };
        this.menuSeconds = {
            text: 'Exportar a',
            tooltip: 'Exportar a',
            key: {
                alt: true,
                key: 'E'
            },
            iconCls: 'banderaverde',
            menu: new Ext.menu.Menu({
                style: {
                    overflow: 'visible'
                },
                items: [
                    {
                        text: 'PDF',
                        group: 'theme',
                        content: 'application/pdf',
                        isAttachment: true,
                        scope: this,
                        handler: this.onItemCheck
                    }, {
                        text: 'XLS ( Paginado )',
                        group: 'theme',
                        content: 'application/vnd.ms-excel',
                        paginated: true,
                        isAttachment: true,
                        hidden: true,
                        scope: this,
                        handler: this.onItemCheck
                    }, {
                        text: 'XLS',
                        group: 'theme',
                        content: 'application/vnd.ms-excel',
                        isAttachment: true,
                        hidden: true,
                        scope: this,
                        handler: this.onItemCheck
                    }, {
                        text: 'CSV',
                        group: 'theme',
                        content: 'text/csv',
                        isAttachment: true,
                        hidden: true,
                        scope: this,
                        handler: this.onItemCheck
                    }, {
                        text: 'DOCX',
                        group: 'theme',
                        content: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        isAttachment: true,
                        scope: this,
                        handler: this.onItemCheck
                    }, {
                        text: 'RTF',
                        group: 'theme',
                        content: 'text/rtf',
                        isAttachment: true,
                        hidden: true,
                        scope: this,
                        handler: this.onItemCheck
                    }, {
                        text: 'ODT',
                        group: 'theme',
                        content: 'application/vnd.oasis.opendocument.text',
                        isAttachment: true,
                        hidden: true,
                        scope: this,
                        handler: this.onItemCheck
                    }, {
                        text: 'ODS',
                        group: 'theme',
                        hidden: true,
                        type: 'ODS',
                        content: 'application/vnd.oasis.opendocument.spreadsheet',
                        isAttachment: true,
                        scope: this,
                        handler: this.onItemCheck
                    }, {
                        text: 'XLSX ( Paginado )',
                        group: 'theme',
                        content: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        paginated: true,
                        isAttachment: true,
                        scope: this,
                        handler: this.onItemCheck
                    }, {
                        text: 'XLSX',
                        group: 'theme',
                        content: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        hidden: true,
                        isAttachment: true,
                        scope: this,
                        handler: this.onItemCheck
                    }
                ]
            })
        };
        return ['->', this.menuFirma, '-', {
            text: 'Vista Previa(HTML)',
            group: 'theme',
            content: 'text/html',
            iconCls: 'bmenu',
            hidden: config.useFirmaView ? false : true,
            scope: this,
            handler: this.onApply
        }, this.menuSeconds, '-',
            {
                text:'Imprimir',
                group: 'theme',
                iconCls: 'imprimir',
                scope: this,
                handler: this.onPrint
            }];
    },
    buildItems: function(config) {
        var _this = this;
        this.listItems = [];
        if (config.reports.length === 0) {
            Ext.MessageBox.show({
                title: 'Informacion',
                msg: '"Â¿Por favor agrege los reportes?',
                buttons: Ext.MessageBox.OK,
                //  fn: showResult,
                icon: Ext.MessageBox.ERROR
            });
            this.close();
            return this.listItems;
        } else if (config.reports.length !== 0) {
            if (Ext.isArray(config.uiFilters)) {
                this.listItems.push(this.uiFiltersForm = new Ext.FormPanel({
                    labelWidth: 75,
                    labelAlign: 'top',
                    frame: true,
                    baseCls: 'pcomponente',
                    split: true,
                    collapsible: true,
                    margins: '3 3 3 3',
                    cmargins: '3 3 3 3',
                    bodyStyle: 'padding:5px;',
                    collapsed: true,
                    hideBorders: true,
                    collapseMode: 'mini',
                    height: 150,
                    region: 'north',
                    defaults: {width: 230},
                    defaultType: 'textfield',
                    items: config.uiFilters,
                    bbar: ['->', '-', {
                        text: 'Limpiar',
                        handler: function() {
                            _this.uiFiltersForm.getForm().reset();
                        }
                    }, '-', {
                        text: 'Aplicar',
                        handler: function() {
                            _this.onApply();
                        }
                    }, '-']
                }));
            }
            if (config.reports.length === 1) {
                config.reports[0].title = false;
                config.reports[0]._parent = this;config.reports[0].idframe = this.idframe + this.generateUniqueNumber();
                config.reports[0].useFirmaView = config.useFirmaView;
                _this.reportsTab = new Distra.util.UIReports(config.reports[0]);
            } else {
                this.reportsTab = new Ext.TabPanel({
                    minTabWidth: 115,
                    activeTab: 0,
                    tabWidth: 135,
                    frame: true,
                    resizable: false,
                    draggable: false,
                    region: 'center',
                    bodyStyle: 'border:2px solid #c3daf9;margin-left: 0px;',
                    enableTabScroll: true,
                    defaults: {autoScroll: true}/*,
                     plugins: new Ext.ux.TabCloseMenu()*/
                });
                config.reports.forEach(function(item, index) {
                    item.closable = false;
                    item._parent = _this;
                    item.title = item.name;
                    item.useFirmaView = config.useFirmaView;
                    item.idframe = _this.idframe + _this.generateUniqueNumber();
                    _this.reportsTab.add(this.uiReport = new Distra.util.UIReports(item));
                    this.uiReport.on({
                        'close': function(p) {
                            if (_this.reportsTab.items.length === 1) {
                                _this.close();
                            }
                        }
                    });
                });
            }
            this.listItems.push(this.reportsTab);
        }
        return this.listItems;
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
    onFirmaDigital: function(item) {
        var _this = this;
        var params = (_this.uiFiltersForm) ? _this.uiFiltersForm.getForm().getValues() : {};
        var itemReport;
        if (_this.reports.length > 1) {
            itemReport = _this.reportsTab.getActiveTab();
        } else {
            itemReport = _this.reportsTab;
        }
        Ext.apply(itemReport.params, params);
        itemReport.onFirmaDigital();
    },
    onEmpty: function(item) {

    },
    view: function() {
        this.show();
    },
    onPrint: function() {
        var _this = this;
        var itemReport;
        if (_this.reports.length > 1) {
            itemReport = _this.reportsTab.getActiveTab();
        } else {
            itemReport = _this.reportsTab;
        }
        itemReport.onPrint();
    },
    onApply: function() {
        var _this = this;
        var params = (_this.uiFiltersForm) ? _this.uiFiltersForm.getForm().getValues() : {};
        var itemReport;
        if (_this.reports.length > 1) {
            itemReport = _this.reportsTab.getActiveTab();
        } else {
            itemReport = _this.reportsTab;
        }
        Ext.apply(itemReport.params, params);
        itemReport.doLoading();
    },
    onItemCheck: function(item, checked) {
        var _this = this;
        if (checked) {
            var itemReport;
            if (_this.reports.length > 1) {
                itemReport = _this.reportsTab.getActiveTab();
            } else {
                itemReport = _this.reportsTab;
            }
            itemReport.onItemCheck(item, checked);
        }
    }
});
Distra.util.UIReports = Ext.extend(Ext.Panel, {
    params: {},
    dirReport: '',
    loadMask: new Ext.LoadMask(Ext.getBody(), 'Cargando datos...'),
    dirAction: '/logistica/utiles/reportes/index.php/jasperclient/runReport?',
    idFrame: 'idFrameReporte-',
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        Ext.apply(this, {
            closable: false,
            resizable: false,
            draggable: false,
            frame: true,
            modal: true,
            region: 'center',
            defaults: {autoScroll: true}/*,
             listeners: {
             'render': function(p) {

             console.info("dispara");
             _this.viewReport(config);
             }
             }*/

            /*baseCls: 'pcomponente',
             bodyCfg: {
             tag: 'iframe',
             name: 'frameReporte',
             id: this.idFrame + d.getDate() + '-' + d.getDay() + '-' + d.getMonth() + '-' + d.getFullYear() + '-' + d.getHours() + '-' + d.getUTCHours() + '-' + d.getMinutes() + '-' + d.getSeconds() + '-' + d.getMilliseconds(),
             scrolling: 'yes',
             src: this.dirAction + this.getParams(config),
             onload: "javascript:parent.scrollTo(0,0);autoResize(this.id,parent);",
             allowTransparency: 'true',
             frameborder: '0',
             style: 'border:10px solid #c3daf9;margin-left: 0px;',
             cls: 'x-panel-body'
             }*/
        });
        _this.fireEvent = _this.fireEvent.createSequence(function(e) {
            if (e == 'render') {
                window.setTimeout(function(){
                    _this.viewReport(config);
                }, 20);
            }
        });
        this.inputText = '<input id="publicKey" name="publicKey" type="text" style="display:none" hidden="true" value="' + window.parent.document.getElementById('publicKey').value + '"/>';
        this.html = this.inputText + '<center><iframe id="' + this.idframe + '" name="' + this.idframe + '" frameborder="0" onload="javascript:parent.scrollTo(0,0);window.Distra.util.UIReports.prototype.autoResize(this.id);" style="background-color: #ffffff;box-shadow: 0 3px 15px #a0a0a0;padding: 4px;border:1px solid #ffffff;width:100%;height:100%;"></iframe></center>';
        Distra.util.UIReports.superclass.constructor.call(this, config);
    },
    onItemCheck: function(item, checked) {
        var _this = this;
        if (checked) {
            var data = {
                header: {
                    content_type: item.content,
                    isAttachment: item.isAttachment
                },
                report: {
                    dirReport: '/reports' + _this.dirReport,
                    type: item.text.replace(' ( Paginado )', ''),
                    pages: (item.scope.pages) ? item.scope.pages.getValue() : null,
                    attachmentsPrefix: (item.scope.attachmentsPrefix) ? item.scope.attachmentsPrefix.checked : null,
                    inputControls: this.params,
                    interactive: (item.scope.interactive) ? item.scope.interactive.checked : false,
                    paginated: item.paginated,
                    useFirma: false,
                    freshData: (item.scope.freshData) ? item.scope.freshData.checked : false,
                    saveDataSnapshot: (item.scope.saveDataSnapshot) ? item.scope.saveDataSnapshot.checked : false,
                    transformerKey: (item.scope.transformerKey) ? item.scope.transformerKey.checked : false,
                    name: _this.dirReport.split('/')[_this.dirReport.split('/').length - 1]
                }
            };
            if (typeof _this._parent.beforeLoading == 'function') {
                _this._parent.beforeLoading(data);
            }
            window.open(_this.dirAction + 'datas=' + btoa(Ext.encode(data)), '');
        }
    },
    getParams: function(config) {
        var _this = this,
            params = '';
        Ext.apply(this, config);
        var data = {
            header: {
                content_type: "text/html",
                isAttachment: false
            },
            report: {
                dirReport: '/reports' + config.dirReport,
                type: "HTML",
                pages: (this._parent.pages) ? this._parent.pages.getValue() : null,
                attachmentsPrefix: (this._parent.attachmentsPrefix) ? this._parent.attachmentsPrefix.checked : null,
                inputControls: config.params,
                interactive: (this._parent.interactive) ? this._parent.interactive.checked : false,
                paginated: false,
                useFirma: config.useFirma || false,
                freshData: (this._parent.freshData) ? this._parent.freshData.checked : false,
                saveDataSnapshot: (this._parent.saveDataSnapshot) ? this._parent.saveDataSnapshot.checked : false,
                transformerKey: (this._parent.transformerKey) ? this._parent.transformerKey.checked : false,
                name: config.dirReport.split('/')[config.dirReport.split('/').length - 1]
            }
        };
        if (typeof _this._parent.beforeLoading == 'function') {
            _this._parent.beforeLoading(data);
        }
        return 'datas=' + btoa(Ext.encode(data));
    },
    doLoading: function() {
        document.getElementById(this.bodyCfg.id).src = this.dirAction + this.getParams(this);
    },
    onPrint: function() {
        window.frames[this.idframe].print();
    },
    autoResize: function(id) {
        if (document.getElementById) {
            var scrollHeight = document.getElementById(id).contentWindow.document.body.scrollHeight;
            var scrollWidth = document.getElementById(id).contentWindow.document.body.scrollWidth;
            document.getElementById(id).height = (scrollHeight + 30) + "px";
            document.getElementById(id).width = (scrollWidth + 30) + "px";
            document.getElementById(id).style = "width :" + (scrollWidth) + "px;height :" + (scrollHeight) + "px;";
            this.loadMask.hide();
        }
    },
    viewReport: function(config) {
        this.loadMask.show();
        this.getViewFrame().src = this.dirAction + this.getParams(config);
    },
    doLoading: function() {
        this.loadMask.show();
        this.getViewFrame().src = this.dirAction + this.getParams(this);
    },
    getViewFrame: function() {
        return document.getElementById(this.idframe);
    },
    onFirmaDigital: function() {
        var _this = this;
        this.type = 'PDF';
        this.content_type = 'application/pdf';
        this.useFirma = true;
        Ext.Ajax.request({
            url: this.dirAction + this.getParams(this),
            method: 'POST',
            callback: function(opt, success, response) {
                var responseText = Ext.decode(response.responseText);
                var documentos = [];
                documentos[0] = {
                    type: "base64",
                    content: responseText.data
                };
                _this.useFirmaView.setdocumentos(documentos);
                _this.useFirmaView.on('firmadoDoc', function(o, d) {//
                    _this.getViewFrame().src = 'data:application/pdf;base64,' + d[0].base64;
                });
                _this.useFirmaView.show();
            }
        });
        delete this.type;
        delete this.useFirma;
        delete this.content_type;
    }
});

