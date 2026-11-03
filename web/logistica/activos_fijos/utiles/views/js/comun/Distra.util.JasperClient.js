Ext.ux.TabCloseMenu = Ext.extend(Object, {
    /**
     * @cfg {String} closeTabText
     * The text for closing the current tab. Defaults to <tt>'Close Tab'</tt>.
     */
    closeTabText: 'Close Tab',
    /**
     * @cfg {String} closeOtherTabsText
     * The text for closing all tabs except the current one. Defaults to <tt>'Close Other Tabs'</tt>.
     */
    closeOtherTabsText: 'Close Other Tabs',
    /**
     * @cfg {Boolean} showCloseAll
     * Indicates whether to show the 'Close All' option. Defaults to <tt>true</tt>. 
     */
    showCloseAll: true,
    /**
     * @cfg {String} closeAllTabsText
     * <p>The text for closing all tabs. Defaults to <tt>'Close All Tabs'</tt>.
     */
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
});
Ext.preg('tabclosemenu', Ext.ux.TabCloseMenu);
Ext.ns('Distra','Distra.util');
Distra.util.JasperClient = Ext.extend(Ext.Window, {
    uiFilters: false,
    reports: [],
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, {
            closable: true,
            title: "<center aling='center' style='height:18px;padding:2px;background-color: #cedff5;'>JasperClient: Componente de recuperaciones</center>",
            resizable: false,
            draggable: false,
            closeAction: 'close',
            width: 1200,
            height: 800,
            tbar: this.buildMenus(),
            frame: true,
            modal: true,
            baseCls: 'pcomponente',
            layout: 'border',
            items: this.buildItems(config)
        });
        Distra.util.JasperClient.superclass.constructor.call(this, config);
    },
    buildMenus: function() {
        var _this = this;
        this.menuFisrt = {
            text: 'Controles',
            iconCls: 'bmenu',
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
            text: 'Exportar',
            iconCls: 'bmenu',
            menu: new Ext.menu.Menu({
                style: {
                    overflow: 'visible'
                },
                items: [
                    {
                        text: 'a PDF',
                        type: 'PDF',
                        group: 'theme',
                        content: 'application/pdf',
                        isAttachment: true,
                        scope: this,
                        handler: this.onItemCheck
                    }, {
                        text: 'a XLS ( Paginado )',
                        type: 'XLS',
                        group: 'theme',
                        content: 'application/vnd.ms-excel',
                        paginated: true,
                        isAttachment: true,
                        scope: this,
                        handler: this.onItemCheck
                    }, {
                        text: 'a XLS',
                        group: 'theme',
                        type: 'XLS',
                        content: 'application/vnd.ms-excel',
                        isAttachment: true,
                        scope: this,
                        handler: this.onItemCheck
                    }, {
                        text: 'a CSV',
                        group: 'theme',
                        type: 'CSV',
                        content: 'text/csv',
                        isAttachment: true,
                        scope: this,
                        handler: this.onItemCheck
                    }, {
                        text: 'a DOCX',
                        group: 'theme',
                        type: 'DOCX',
                        content: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        isAttachment: true,
                        scope: this,
                        handler: this.onItemCheck
                    }, {
                        text: 'a RTF',
                        group: 'theme',
                        type: 'RTF',
                        content: 'text/rtf',
                        isAttachment: true,
                        scope: this,
                        handler: this.onItemCheck
                    }, {
                        text: 'a ODT',
                        group: 'theme',
                        type: 'ODT',
                        content: 'application/vnd.oasis.opendocument.text',
                        isAttachment: true,
                        scope: this,
                        handler: this.onItemCheck
                    }, {
                        text: 'a ODS',
                        group: 'theme',
                        type: 'ODS',
                        content: 'application/vnd.oasis.opendocument.spreadsheet',
                        isAttachment: true,
                        scope: this,
                        handler: this.onItemCheck
                    }, {
                        text: 'a XLSX ( Paginado )',
                        group: 'theme',
                        content: 'application/vnd.ms-excel',
                        paginated: true,
                        isAttachment: true,
                        scope: this,
                        handler: this.onItemCheck
                    }, {
                        text: 'a XLSX',
                        group: 'theme',
                        type: 'XLSX',
                        content: 'application/vnd.ms-excel',
                        isAttachment: true,
                        scope: this,
                        handler: this.onItemCheck
                    }
                ]
            })
        };
        return ['->', this.menuFisrt, '-', this.menuSeconds];
    },
    buildItems: function(config) {
        var _this = this;
        this.listItems = [];
        if (config.reports.length === 0) {
            Ext.MessageBox.show({
                title: 'Informacion',
                msg: '"¿Por favor agrege los reportes?',
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
                config.reports[0]._parent = this;
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
                    defaults: {autoScroll: true},
                    plugins: new Ext.ux.TabCloseMenu()
                });
                config.reports.forEach(function(item, index) {
                    item.closable = true;
                    item._parent = _this;
                    item.title = item.name;
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
    onEmpty: function(item) {
        ///item.parentMenu.showAt(item.parentMenu.getPosition());
        alert('Empty');
    },
    view: function() {
        console.info(this);
        this.show();
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
    dirAction: '/logistica/utiles/reportes/index.php/jasperclient/runReport?',
    idFrame: 'idFrameReporte-',
    constructor: function(config) {
        var _this = this;
        var d = new Date();
        Ext.apply(this, {
            closable: false,
            resizable: false,
            draggable: false,
            frame: true,
            modal: true,
            region: 'center',
            baseCls: 'pcomponente',
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
            }
        });
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
                    type: item.type,
                    pages: (item.scope.pages) ? item.scope.pages.getValue() : null,
                    attachmentsPrefix: (item.scope.attachmentsPrefix) ? item.scope.attachmentsPrefix.checked : null,
                    inputControls: this.params,
                    interactive: (item.scope.interactive) ? item.scope.interactive.checked : false,
                    paginated: item.paginated,
                    freshData: (item.scope.freshData) ? item.scope.freshData.checked : false,
                    saveDataSnapshot: (item.scope.saveDataSnapshot) ? item.scope.saveDataSnapshot.checked : false,
                    transformerKey: (item.scope.transformerKey) ? item.scope.transformerKey.checked : false,
                    name: _this.dirReport.split('/')[_this.dirReport.split('/').length - 1]
                }
            };
            if (typeof _this.beforeLoading == 'function') {
                _this.beforeLoading(data);
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
                content_type: "text/HTML",
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
                freshData: (this._parent.freshData) ? this._parent.freshData.checked : false,
                saveDataSnapshot: (this._parent.saveDataSnapshot) ? this._parent.saveDataSnapshot.checked : false,
                transformerKey: (this._parent.transformerKey) ? this._parent.transformerKey.checked : false,
                name: config.dirReport.split('/')[config.dirReport.split('/').length - 1]
            }
        };
        if (typeof _this.beforeLoading == 'function') {
            _this.beforeLoading(data);
        }
        return 'datas=' + btoa(Ext.encode(data));
    },
    doLoading: function() {
        document.getElementById(this.bodyCfg.id).src = this.dirAction + this.getParams(this);
    }
});
function autoResize(id, parent) {
    var newheight;
    var newwidth;
    if (document.getElementById) {
        newheight = document.getElementById(id).contentWindow.document.body.scrollHeight;
        newwidth = document.getElementById(id).contentWindow.document.body.scrollWidth;
        for (var i = 0; i < document.getElementsByClassName('pcomponente').length; i++) {
            document.getElementById(id).height = (newheight + 30) + "px";
            document.getElementById(id).width = (newwidth + 30) + "px";
        }
    }
}
