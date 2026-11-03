Ax.ns('Ax.Charts.Views');
if (Ext.BLANK_IMAGE_URL && Ext.BLANK_IMAGE_URL.replace('extjs.com', '') != Ext.BLANK_IMAGE_URL) {
    Ext.BLANK_IMAGE_URL = Ax.servicesLocation + 'lib/images/s.gif';
}
Ax.Charts.Views.ChartPanel = Ext.extend(Ext.Panel, {
    layout: 'fit',
    region: 'center',
    constructor: function (config) {
        Ax.Charts.Views.ChartPanel.superclass.constructor.call(this, config);
    },
    initComponent: function (config) {
        this.htmlChartElementId = this.htmlChartElementId ? this.htmlChartElementId : "chart-container-ax-" + this.id;
        this.title = !this.hideTitle ? this.getLabel('panelTitle') : undefined;
        this.html = this.html ? this.html : '<div style="height:98%;" id="' + this.htmlChartElementId + '"></div>';
        if (!this.chartObjectContainer) {
            this.initChartOptions(this.chartOptions);
            this.chartObjectContainer = new Ax.Charts.Views.Chart(this.chartOptions);
        }
        var self = this;
        this.on('afterlayout', function () {

            setTimeout(function () {
                if (!self.busy) {
                    self.renderChart();
                }
            }, 100)

        });
        Ax.Charts.Views.ChartPanel.superclass.initComponent.call(this);
    },
    createTypesToolBar: function (availableTypes) {
        if (availableTypes) {

        }
    },
    initChartOptions: function (options) {
        this.chartOptions = options ? options : {
            config: {},
            data: undefined
        };
        this.chartOptions.config.renderTo = this.htmlChartElementId;
        return this.chartOptions;
    },
    renderChart: function () {
        this.busy = true;
        this.chartObjectContainer.render();
    },
    createChart: function (opt) {
        var chartOpt = this.controller.generateChartOpt();
    },
    setChartData: function (data) {
        this.chartObjectContainer.setData(data);
    },
    setChartType: function (type) {
        this.chartObjectContainer.changeChartType(type);
    },
    addChartSerie: function (serie) {
        this.chartObjectContainer.addSerie(serie);
    },
    addSerieFromStore: function (store) {
        if (store) {
            var i = 0;
            var serie = [];
            while (store.getAt(i)) {
                var record = store.getAt(i);
                var xSource = this.chartObjectContainer.getXSource();
                var ySource = this.chartObjectContainer.getYSource();
                serie.push([record.get(xSource), record.get(ySource)])
            }
            this.addChartSerie(serie);
            i++;
        }
    },
    getLabel: function (label, lang) {
        return this.chartObjectContainer.getLabel(label, lang);
    },
    setXaxisTitle: function (title) {
        this.chartObjectContainer.setXaxisTitle(title);
    },
    setYayisTitle: function (title) {
        this.chartObjectContainer.setYayisTitle(title);
    },
    redraw: function () {
        this.chartObjectContainer.redraw();
    }
});

Ax.Charts.Views.DashboardPanel = Ext.extend(Ext.Panel, {
    region: 'center',
    //autoScroll: true,
    layout: 'border',
    /*layoutConfig: {
        columns: 2
    },*/
    defaults: {
        anchor: '100%'
    },
    //baseCls: 'dashboard-panel x-panel',
    chartsPanels: [],
    chartsData: [],
    constructor: function (config) {
        Ax.Charts.Views.DashboardPanel.superclass.constructor.call(this, config);
    },
    initComponent: function (config) {
        this.layout = 'fit';
        this.chartWith = '98%';
        this.htmlChartElementId = this.htmlChartElementId ? this.htmlChartElementId : "chart-container-ax-" + this.id;
        this.title = this.title ? this.title : this.getLabel('panelTitle');
        var self = this;
        this.isRendered = false;
        this.on('afterlayout', function () {
            if (self.data && !self.isRendered) {
                self.isRendered = true;
                for (var i = 0; i < self.data.length; i++) {
                    setTimeout(function () {
                        self.addChart(config, self.data[i]);
                    }, 100);
                }
            }
        });
        Ax.Charts.Views.ChartPanel.superclass.initComponent.call(this);
    },
    addChart: function (config, data, reader, serializeBy, filters, serializationTypes, query) {
        if (data && typeof data == 'object' && data.sql) {
            this.renderSqlChart(config, data, reader, serializeBy, filters, serializationTypes);
        } else if (data && typeof data == 'object') {
            this.renderArrayChart(config, data, reader, serializeBy, filters, serializationTypes, query);
        }
    },
    renderSqlChart: function (config, sql, reader, serializeBy, filters, serializationTypes) {
        var self = this;
        this.executeQuery(sql, function (conf, data) {
            var dataObj = [{
                name: conf.name,
                data: data
            }];
            self.addChart(conf.config, dataObj, conf.reader, conf.serializeBy, conf.filters, conf.serializationTypes, sql);
        }, {
            config: config,
            reader: reader,
            serializeBy: serializeBy,
            filters: filters,
            serializationTypes: serializationTypes
        });
    },
    executeQuery: function (query, fn, params) {
        params = params ? params : {};
        params['name'] = query.name;
        Ext.Ajax.request({
            url: '/logistica/utiles/plugin/index.php/axchart/loadSqlQuery',
            fnParams: params,
            success: function (response, opts) {
                var data = Ext.decode(response.responseText);
                if (data && data[0]) {
                    fn(opts.fnParams, data);
                } else {
                    fn(opts.fnParams, []);
                }
            },
            params: {
                sqlQuery: query.sql
            }
        });
    },
    renderArrayChart: function (config, data, reader, serializeBy, filters, serializationTypes, query) {
        var id = this.htmlChartElementId + (this.chartsPanels.length);
        var chartOpt = {};
        var readerObj = {
            x: {
                source: typeof reader.x == 'object' ? reader.x.source : reader.x,
                label: typeof reader.x == 'object' ? reader.x.label : reader.x
            },
            y: {
                source: typeof reader.y == 'object' ? reader.y.source : reader.y,
                label: typeof reader.y == 'object' ? reader.y.label : reader.y
            }
        }
        Ax.apply(chartOpt, readerObj);
        Ax.apply(chartOpt, config);
        var chartOptions = null;
        if (serializeBy) {
            var chartOptions = this.initChartOptions({
                config: chartOpt
            }, id);

        } else {
            var chartOptions = this.initChartOptions({
                config: chartOpt,
                data: data
            }, id);
        }
        var chartObject = new Ax.Charts.Views.Chart(chartOptions);
        //console.info(chartObject)
        if (config.title) {
            chartObject.defaultTitle = config.title;
        }
        if (serializeBy && data && data[0]) {
            var dataObj = chartObject.buildSeriesBy(data[0].data, chartOpt.x, chartOpt.y, serializeBy);//Todo
            chartObject.setData(dataObj, reader, true);
        }
        if (data) {
            this.chartsData.push(data);
            config.dataBag = data[0].data;
            config.filters = filters ? filters : undefined;
            config.reader = readerObj;
            config.serializeBy = serializeBy;
            config.serializationTypes = serializationTypes;
            config.query = query ? query : undefined;
        }
        var chartPanel = new Ax.Charts.Views.ChartPanel({
            htmlChartElementId: id,
            hideTitle: true,
            chartOptions: chartOptions,
            width: this.chartWith,
            height: this.chartHeight,
            style: {float: "left"},
            //baseCls: 'dashboard-item-panel x-panel',
            tbar: this.getToolbar(chartObject, config, filters),
            chartObjectContainer: chartObject,
            dataBag: data
        });
        this.chartsPanels.push(chartPanel);
        this.add(chartPanel);
        this.doLayout();
    },
    adjustMenu: function (menu) {
        var divHeight = $(menu.el.dom).height();
        var ulHeight = $(menu.ul.dom).height();
        if (ulHeight > divHeight) {
            $(menu.el.dom).addClass('over-scroll');
        }
    },
    getLabel: function (label, lang) {
        return Ax.Charts.chartDefaultOptions.getLabel(label, lang);
    },
    getToolbar: function (object, config) {
        var types = config && config.allowTypes ? config.allowTypes : [];
        var tbar = undefined;
        for (var i = 0; i < types.length; i++) {
            var type = Ax.Charts.findType(types[i]);
            if (type) {
                if (!tbar) {
                    tbar = [];
                }
                var btnToolBar = new Ext.Toolbar.Button({
                    iconCls: type.icon,
                    tooltip: type.text,
                    tooltipType: 'title',
                    chartType: type.name,
                    handler: function () {
                        object.changeChartType(this.chartType);
                    }
                });
                tbar.push(btnToolBar);
            }
        }
        if (tbar) {
            var btnChartConfig = new Ext.Toolbar.Button({
                iconCls: 'icondistra-configuracion',
                tooltip: this.getLabel('config'),
                tooltipType: 'title',
                menu: new Ext.menu.Menu({
                    defaultAlign: 'tr-br',
                    items: this.buildOptionMenu(object, Ext.id())
                })
            });
            var id = Ext.id();
            if (config.query) {
                object.query = config.query;
            }

            if (config.dataBag) {
                object.filters = {
                    dataBag: config.dataBag,
                    filters: {},
                    reader: config.reader,
                    serializeBy: config.serializeBy,
                    currentFilter: {},
                    currentSerieType: config.serializeBy,
                    currentSerieTitle: object.getChartTitle()
                };
                var self = this;
                var btnReload = new Ext.Toolbar.Button({
                    iconCls: 'icondistra-actualizar',
                    tooltip: this.getLabel('refresh'),
                    tooltipType: 'title',
                    object: object,
                    objectId: 'object-' + id,
                    handler: function (btn) {
                        var objId = btn.objectId;
                        self.refresh(objId, {});
                    }
                });
                tbar.push('-');
                tbar.push(btnReload);
                if (config.filters) {
                    var filters = object.buildFilters(config.dataBag, config.filters);
                    if (typeof filters == 'object') {
                        object.filters.filters = filters;
                        var btnChartFilter = new Ext.Toolbar.Button({
                            iconCls: 'icondistra-buscaravanzada',
                            tooltip: this.getLabel('filter'),
                            tooltipType: 'title',
                            id: 'filter-menu-global-' + id,
                            menu: new Ext.menu.Menu({
                                defaultAlign: 'tr-br',
                                items: this.buildFiltersMenu(object, filters, id)
                            })
                        });
                        tbar.push('->');
                        tbar.push(btnChartFilter);
                    }
                }
                if (config.serializationTypes) {
                    object.filters.serializationTypes = config.serializationTypes;
                    var btnChartSerieUpdate = new Ext.Toolbar.Button({
                        iconCls: 'icondistra-monitoreo',
                        tooltip: this.getLabel('serialization'),
                        tooltipType: 'title',
                        menu: new Ext.menu.Menu({
                            defaultAlign: 'tr-br',
                            items: this.buildSerializationMenu(object, object.filters.serializationTypes, id)
                        })
                    });
                    tbar.push('->');
                    tbar.push(btnChartSerieUpdate);
                }
            }
            tbar.push('->');
            tbar.push(btnChartConfig);
        }
        return tbar;
    },
    setCurrentSerieType: function (serializeBy, title) {
        if (Ax.handlerInput && typeof Ax.handlerInput == 'object') {
            for (var i in Ax.handlerInput) {
                if (typeof Ax.handlerInput[i] == 'object' && Ax.handlerInput[i].filters && typeof Ax.handlerInput[i].filters == 'object') {
                    Ax.handlerInput[i].filters.currentSerieType = serializeBy ? serializeBy : Ax.handlerInput[i].filters.serializeBy;
                    Ax.handlerInput[i].filters.currentSerieTitle = title ? title : Ax.handlerInput[i].filters.currentSerieTitle;
                }
            }
        }
        return true;
    },
    buildSerializationMenu: function (object, serializationType, id) {
        var serializationMenu = [];
        var self = this;
        for (var i in serializationType) {
            var fnId = 'serialization-' + i + '-' + id;
            this.buildFunctions(object, id, fnId);
            serializationMenu.push(
                new Ext.menu.Item({
                    text: i,
                    iconCls: 'icondistra-filtro',
                    icon: null,
                    object: object,
                    objectId: 'object-' + id,
                    serializationType: serializationType[i],
                    handler: function (btn) {
                        var objId = btn.objectId;
                        self.reload(objId, {}, btn.serializationType, btn.text);
                    }
                })
            );
        }
        serializationMenu.push(
            new Ext.menu.Item({
                text: this.getLabel('iniView'),
                iconCls: 'icondistra-filtro',
                icon: null,
                object: object,
                objectId: 'object-' + id,
                serializationType: object.filters.serializeBy,
                handler: function (btn) {
                    var chartObj = btn.object;
                    var objId = btn.objectId;
                    self.reload(objId, {}, btn.serializationType, chartObj.defaultTitle);
                }
            })
        );
        return serializationMenu;
    },
    buildFunctions: function (object, id, fnId) {
        var self = this;
        Ax.handlerInput['object-' + id] = object;
        Ax.handlerInput[fnId] = function (evt) {
            var val = $(evt.target).val();
            var objId = $(evt.target).attr('data-object');
            var filterName = $(evt.target).attr('data-filter');
            var serieName = $(evt.target).attr('data-serie');
            if (Ax.handlerInput[objId] && Ax.handlerInput[objId].filters) {
                var filter = {};
                if (filterName) {
                    filter[filterName] = val;
                }
                if (serieName) {
                    Ax.handlerInput[objId].filters.currentSerieType = Ax.handlerInput[objId].serializationTypes[serieName] ? Ax.handlerInput[objId].serializationTypes[serieName] : Ax.handlerInput[objId].filters.currentSerieType;
                }
                self.reload(objId, filter);
            }
        };
        Ax.handlerCheckInput[fnId] = function (item, clear) {
            var val = -1;
            if (!clear) {
                val = item.text;
            }
            var objId = item.dataObject;
            var filterName = item.dataFilter;
            var serieName = item.dataSerie;
            if (Ax.handlerInput[objId] && Ax.handlerInput[objId].filters) {
                var filter = Ax.handlerInput[objId].filters.currentFilter ? Ax.handlerInput[objId].filters.currentFilter : {};
                if (filterName) {
                    filter[filterName] = filter[filterName] ? filter[filterName] : [];
                    if (val === -1) {
                        delete filter[filterName];
                    } else {
                        if (item.checked) {
                            filter[filterName].push(val);
                        } else {
                            var tmpFilter = [];
                            for (var i = 0; i < filter[filterName].length; i++) {
                                if (filter[filterName][i] != val) {
                                    tmpFilter.push(filter[filterName][i])
                                }
                            }
                            filter[filterName] = tmpFilter;
                        }
                    }

                }
                if (filter[filterName] && filter[filterName].length == 0) {
                    delete filter[filterName];
                }
                if (serieName) {
                    Ax.handlerInput[objId].filters.currentSerieType = Ax.handlerInput[objId].serializationTypes[serieName] ? Ax.handlerInput[objId].serializationTypes[serieName] : Ax.handlerInput[objId].filters.currentSerieType;
                }
                self.reload(objId, filter);
            }
        };
    },
    refresh: function (objId) {
        var self = this;
        if (Ax.handlerInput[objId].query) {
            this.executeQuery(Ax.handlerInput[objId].query, function (pr, data) {
                //TODO: SEt databag in object
                var objId = pr.objectId;
                Ax.handlerInput[objId].filters.dataBag = data;
                self.reload(objId, {});
            }, {objectId: objId})
        }
    },
    reload: function (objId, filter, serializationType, title) {
        var data = Ax.handlerInput[objId].transformData(Ax.handlerInput[objId].filters, filter);
        if (serializationType && title) {
            this.setCurrentSerieType(serializationType, title);
        }
        if (typeof data == 'object') {
            var reader = Ax.clone({}, Ax.handlerInput[objId].filters.reader);
            reader.x = Ax.handlerInput[objId].filters.currentSerieType.x && typeof Ax.handlerInput[objId].filters.currentSerieType.x == 'object' ? {
                label: Ax.handlerInput[objId].filters.currentSerieType.x.name,
                source: Ax.handlerInput[objId].filters.currentSerieType.x.source
            } : reader.x;
            var dataObj = Ax.handlerInput[objId].buildSeriesBy(data.data, reader.x, reader.y, Ax.handlerInput[objId].filters.currentSerieType, Ax.handlerInput[objId].filters.currentFilter, Ax.handlerInput[objId].filters);
            Ax.handlerInput[objId].setFilteredTitle(Ax.handlerInput[objId].filters.currentSerieTitle, Ax.handlerInput[objId].filters.currentFilter);
            Ax.handlerInput[objId].setXaxisTitle(reader.x.label);
            Ax.handlerInput[objId].setData(dataObj, reader);
            return true;
        }
        return false;
    },
    buildFiltersMenu: function (object, filters, id) {
        var self = this;
        var filtersMenu = [];
        for (var i in filters) {
            var fnId = 'filter-' + filters[i].name + '-' + id;
            this.buildFunctions(object, id, fnId);
            var options = '';
            var checkEl = [];
            for (var j = 0; j < filters[i].values.length; j++) {
                options += '<option value="' + filters[i].values[j][0] + '">' + filters[i].values[j][1] + '</option>';
                if (filters[i].values[j][0] != 'none') {
                    checkEl.push({
                        text: filters[i].values[j][1],
                        checked: false,
                        dataFilter: filters[i].name,
                        dataObject: 'object-' + id,
                        hideOnClick: false,
                        checkHandler: function (item, e) {
                            Ax.handlerCheckInput[fnId](item);
                        }
                    });
                } else {
                    checkEl.push({
                        text: filters[i].values[j][1],
                        dataFilter: filters[i].name,
                        dataObject: 'object-' + id,
                        handler: function (item) {
                            Ax.handlerCheckInput[fnId](item, true);
                            var filterM = Ext.getCmp('filter-menu-' + filters[i].name);
                            if (filterM && filterM.menu.items) {
                                for (var k = 0; k < filterM.menu.items.items.length; k++) {
                                    if (filterM.menu.items.items[k].checked) {
                                        filterM.menu.items.items[k].setChecked(false);
                                    }
                                }
                            }
                        }
                    });
                }
            }
            var filterMenu = {
                text: filters[i].name,
                menu: {
                    items: [
                        '<select id="data" onchange="Ax.handlerInput[' + "'" + fnId + "'](event)" + '" data-object="object-' + id + '" data-filter="' + filters[i].name + '">' + options + '</select>'
                    ]
                }
            };
            if (filters[i].multiselect) {
                filterMenu = {
                    text: filters[i].name,
                    id: 'filter-menu-' + filters[i].name,
                    menu: {
                        items: checkEl,
                        listeners: {
                            show: function (item) {
                                self.adjustMenu(item)
                            }
                        }
                    }
                };
            }
            filtersMenu.push(filterMenu);
        }
        if (filtersMenu.length) {
            filtersMenu.push(
                new Ext.menu.Item({
                    text: this.getLabel('clearFilter'),
                    iconCls: 'icondistra-cancelar',
                    icon: null,
                    object: object,
                    objectId: 'object-' + id,
                    handler: function (btn) {
                        var objId = btn.objectId;
                        if (self.reload(objId, -1)) {
                            var filterM = Ext.getCmp('filter-menu-global-' + id);
                            if (filterM && filterM.menu.items) {
                                for (var k = 0; k < filterM.menu.items.items.length; k++) {
                                    if (filterM.menu.items.items[k].menu) {
                                        for (var h = 0; h < filterM.menu.items.items[k].menu.items.items.length; h++) {
                                            if (filterM.menu.items.items[k].menu.items.items[h].checked) {
                                                filterM.menu.items.items[k].menu.items.items[h].setChecked(false);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
            );
        }
        return filtersMenu;
    },
    buildOptionMenu: function (object, id) {
        var self = this;
        /*var chartTitle = {
         text: this.getLabel('chartTitle'),
         handler: function(){
         Ext.Msg.prompt(self.getLabel('edit'), self.getLabel('chartTitle') + ':', function(btn, text){
         if(btn == 'ok' && text){
         object.setChartTitle(text);
         object.redraw();
         }
         });
         }
         };*/
        Ax.handlerInput['title-' + id] = function (evt) {
            if (evt.keyCode == Ext.EventObject.ENTER) {
                object.setChartTitle(evt.target.value);
                object.redraw();
            }
        };
        var chartTitle = {
            text: this.getLabel('chartTitle'),
            menu: {
                items: [
                    '<input type="text" onkeydown="Ax.handlerInput[' + "'title-" + id + "'" + '](event)"/>'
                ]
            }
        };
        var axisMenu = {
            text: this.getLabel('axis'),
            menu: {        // <-- submenu by nested config object
                items: this.buildAxisMenu(object, id)
            }
        };
        var dashStyleMenu = {
            text: this.getLabel('dashStyle'),
            menu: {        // <-- submenu by nested config object
                items: this.buildDashStyleMenu(object, id)
            }
        };
        var themeMenu = {
            text: this.getLabel('theme'),
            menu: {        // <-- submenu by nested config object
                items: this.buildThemeMenu(object, id)
            }
        };

        var backgroundMenu = {
            text: this.getLabel('backgroundColor'),
            menu: new Ext.menu.ColorMenu({
                handler: function (cm, color) {
                    if (typeof color == 'string')
                        object.setTheme('#' + color);
                }
            })
        };
        return [chartTitle, '-', axisMenu, '-', dashStyleMenu, '-', themeMenu, backgroundMenu]
    },
    buildAxisMenu: function (object, id) {
        var self = this;
        Ax.handlerInput['xaxis-title-' + id] = function (evt) {
            if (evt.keyCode == Ext.EventObject.ENTER) {
                object.setXaxisTitle(evt.target.value);
                object.redraw();
            }
        };
        Ax.handlerInput['xaxis-rotation-' + id] = function (evt) {
            if (evt.keyCode == Ext.EventObject.ENTER) {
                if (!object.rotation) {
                    object.rotation = {
                        x: 0,
                        y: 0,
                        deep: 0
                    }
                }
                object.rotation.x = evt.target.value;
                object.rotateChart(object.rotation);
            }
        };
        Ax.handlerInput['yayis-title-' + id] = function (evt) {
            if (evt.keyCode == Ext.EventObject.ENTER) {
                object.setYayisTitle(evt.target.value);
                object.redraw();
            }
        };
        Ax.handlerInput['yayis-rotation-' + id] = function (evt) {
            if (evt.keyCode == Ext.EventObject.ENTER) {
                if (!object.rotation) {
                    object.rotation = {
                        x: 0,
                        y: 0,
                        deep: 0
                    }
                }
                object.rotation.y = evt.target.value;
                object.rotateChart(object.rotation);
            }
        };
        var axisMenu = [{
            text: this.getLabel('xAxis'),
            menu: {
                items: [{
                    text: this.getLabel('chartXTitle'),
                    menu: {
                        items: ['<input type="text" onkeydown="Ax.handlerInput[' + "'xaxis-title-" + id + "'" + '](event)"/>']
                    }
                }, {
                    text: this.getLabel('rotationX'),
                    menu: {
                        items: ['<input type="number" min="0" max="100" step="5" onkeydown="Ax.handlerInput[' + "'xaxis-rotation-" + id + "'" + '](event)"/>']
                    }
                }]
            }
        }, {
            text: this.getLabel('yAyis'),
            menu: {
                items: [{
                    text: this.getLabel('chartYTitle'),
                    menu: {
                        items: ['<input type="text" onkeydown="Ax.handlerInput[' + "'yayis-title-" + id + "'" + '](event)"/>']
                    }
                }, {
                    text: this.getLabel('rotationY'),
                    menu: {
                        items: ['<input type="number" min="0" max="100" step="5" onkeydown="Ax.handlerInput[' + "'yayis-rotation-" + id + "'" + '](event)"/>']
                    }
                }]
            }
        }];
        return axisMenu;
    },
    buildDashStyleMenu: function (object, id) {
        var menu = [];
        for (var i = 0; i < Ax.Charts.chartDefaultOptions.dashStyles.length; i++) {
            menu.push({
                text: Ax.Charts.chartDefaultOptions.dashStyles[i].text,
                dashStyle: Ax.Charts.chartDefaultOptions.dashStyles[i].name,
                checked: false,
                group: 'dashStyle' + id,
                checkHandler: function () {
                    object.setSeriesPropertyValue('dashStyle', this.dashStyle);
                    object.redraw();
                }
            })
        }
        return menu;
    },
    buildThemeMenu: function (object, id) {
        var menu = [];
        for (var i in Ax.Charts.chartDefaultOptions.themes) {
            menu.push({
                text: Ax.Charts.chartDefaultOptions.themes[i].text,
                theme: i,
                checked: false,
                group: 'theme' + id,
                checkHandler: function (m, checked) {
                    if (checked) {
                        object.setTheme(this.theme);
                    }
                }
            })
        }
        return menu;
    },
    initChartOptions: function (options, renderTo) {
        var chartOptions = options ? options : {
            config: {},
            data: undefined
        };
        chartOptions.config.renderTo = renderTo;
        return chartOptions;
    },
});

Ax.handlerInput = {};

Ax.handlerCheckInput = {};

Ax.Charts.Views.BaseChartProperties = {
    autoRefresh: undefined,
    enable3D: undefined,
    chartRotation: {
        x: 0,
        y: 0,
        deep: 0
    },
    chartTitle: '',
    chartXTitle: '',
    chartYTitle: '',
    currentType: undefined,
    currentSource: undefined,
    currentTheme: undefined,
    currentData: undefined,
    currentReader: undefined,
    enableBackground: undefined,
    dashStyle: undefined,
    areaFillColorGradient: 0,
    colorPicker: undefined,
    sourceStore: new Ext.data.SimpleStore({
        data: [],
        fields: ['name', 'data', 'reader', 'serializeBy']
    }),
    addSourceStore: function (name, store, reader, type, serializeBy) {
        var record = new Ext.data.Record({
            name: name,
            data: store,
            reader: reader,
            serializeBy: serializeBy
        });
        this.sourceStore.add(record);
        this.currentType = type ? type : 'line';
        this.currentData = store;
        this.currentReader = reader;
        this.currentSource = name;
        this.chartRotation = {
            x: 0,
            y: 0,
            deep: 0
        };
        this.loadDefaults();
        this.reconfigureChart(this.currentType, this.currentData, this.currentReader, this.chartRotation, serializeBy);
    },
    clearSourceStore: function () {
        this.sourceStore.removeAll();
    },
    addStore: function (name, store, reader, type, show) {
        var record = new Ext.data.Record({
            name: name,
            data: store,
            reader: reader
        });
        this.sourceStore.add(record);
        this.currentType = type ? type : 'line';
        this.currentData = store;
        this.currentReader = reader;
        this.currentSource = name;
        this.chartRotation = {
            x: 0,
            y: 0,
            deep: 0
        };
        this.loadDefaults();
        this.reconfigureChart(this.currentType, this.currentData, this.currentReader, this.chartRotation);
    },
    getLabel: function (label, lang) {
        return this.chartObjectContainer.getLabel(label, lang);
    },
    loadDefaults: function () {
        this.chartTitle = this.getChartTitle();
        this.chartXTitle = this.getXaxisTitle();
        this.chartYTitle = this.getYayisTitle();
        if (this.tfChartTitle) {
            this.tfChartTitle.setValue(this.chartTitle);
        }
        this.cbChartType.setValue(this.currentType)
        this.cbChartSource.setValue(this.currentSource)
        this.nf3DRotation.setValue(this.chartRotation.x)
    },
    showColorPicker: function (checked, noPadding) {
        var self = this;
        if ($('input#color-picker-' + self.id).get(0) && typeof $('input#color-picker-' + self.id).data('spectrum.id') == 'undefined') {
            if (this.colorPicker) {
                this.colorPicker.remove();
                this.colorPicker = null;
            }

            if (!noPadding) {
                $('input#color-picker-' + self.id).parent().css('padding-left', 50);
            }
            if ($.fn.spectrum) {
                $.fn.spectrum.defaults.cancelText = this.getLabel('cancel');
                $.fn.spectrum.defaults.chooseText = this.getLabel('choose');
                $.fn.spectrum.defaults.clearText = this.getLabel('clearText');
                $.fn.spectrum.defaults.noColorSelectedText = this.getLabel('noColorSelectedText');
                this.colorPicker = $('input#color-picker-' + self.id).spectrum({
                    flat: true,
                    showInput: true,
                    allowEmpty: true,
                    choose: function (color) {
                        if (color) {
                            self.currentTheme = color.toHexString();
                            if (self.chbChangeTheme) {
                                self.chbChangeTheme.setValue(true);
                            }
                        } else {
                            self.currentTheme = 'default';
                            if (self.chbChangeTheme) {
                                self.chbChangeTheme.setValue(false);
                            }
                        }
                        if (self.autoRefresh) {
                            self.setChartTheme(self.currentTheme);
                        }
                        self.fireEvent('backgroundColorSelected', color);
                    }
                });
            }

        }
        this.tfBackground.setVisible(true);
        if (checked) {
            this.tfBackground.enable();
        } else {
            this.tfBackground.disable();
        }
    },
    initChartOptions: function (options) {
        this.chartOptions = options ? options : {
            config: {},
            data: undefined
        };
        this.chartOptions.config.renderTo = this.htmlChartElementId;
        return this.chartOptions;
    },
    setChartData: function (data, reader, serializeBy) {
        if (data && data.getAt && typeof data.getAt == 'function') {
            this.chartObjectContainer.setData(this.parseStoreData(data, reader), reader);
        } else {
            this.chartObjectContainer.setData(data, reader);
        }
    },
    getThemeList: function () {
        return this.chartObjectContainer.getThemeList();
    },
    setChartTheme: function (theme) {
        if (theme) {
            this.chartObjectContainer.setTheme(theme);
        }
    },
    getChartTitle: function () {
        return this.chartObjectContainer.getChartTitle();
    },
    setChartTitle: function (title) {
        this.chartObjectContainer.setChartTitle(title);
    },
    getXaxisTitle: function () {
        return this.chartObjectContainer.getXaxisTitle();
    },
    getYayisTitle: function () {
        return this.chartObjectContainer.getYayisTitle();
    },
    setXaxisTitle: function (title) {
        this.chartObjectContainer.setXaxisTitle(title);
    },
    setYayisTitle: function (title) {
        this.chartObjectContainer.setYayisTitle(title);
    },
    setChartType: function (type) {
        return this.chartObjectContainer.changeChartType(type);
    },
    reconfigureChart: function (type, data, reader, rotation, serializeBy) {
        if (data && data.getAt && typeof data.getAt == 'function') {
            data = this.parseStoreData(data, reader);
        }
        if (data) {
            if (serializeBy) {
                data = this.chartObjectContainer.buildSeriesBy(data, reader.x, reader.y, serializeBy);
            }
            if (this.fillOpacity) {
                this.setFillOpacity(this.fillOpacity);
            }
            this.setDashStyleOpt(this.dashStyle);
            if (this.chartTitle) {
                this.setChartTitle(this.chartTitle);
            }
            if (this.chartXTitle) {
                this.setXaxisTitle(this.chartXTitle);
            }
            if (this.chartYTitle) {
                this.setYayisTitle(this.chartYTitle);
            }
            this.chartObjectContainer.reconfigure({
                data: data,
                reader: reader,
                type: type,
                rotation: rotation,
                fillOpacity: this.fillOpacity ? this.fillOpacity : 1
            });
            if (this.currentTheme) {
                this.setChartTheme(this.currentTheme);
            }
        }
    },
    addSerie: function (serie) {
        this.chartObjectContainer.addSerie(serie);
    },
    rotationEnabled: function (type) {
        if (!this.chartObjectContainer.rotationEnabled(type)) {
            this.chb3DEnabled.setValue(false);
            this.chb3DEnabled.disable();
            this.chartRotation = {
                x: 0,
                y: 0,
                deep: 0
            };
            this.nf3DRotation.setValue(0);
            this.nf3DRotation.disable();
        } else {
            this.chb3DEnabled.enable();
            if (this.chb3DEnabled.getValue()) {
                this.nf3DRotation.enable();
            }
        }
    },
    rotateChart: function (rotation) {
        this.chartObjectContainer.rotateChart(rotation);
    },
    setFillOpacity: function (opacity) {
        this.chartObjectContainer.setFillOpacity(opacity);
    },
    setDashStyle: function (dashStyle) {
        this.setDashStyleOpt(dashStyle);
        this.redraw();
    },
    setDashStyleOpt: function (dashStyle) {
        this.dashStyle = dashStyle;
        this.chartObjectContainer.setSeriesPropertyValue('dashStyle', this.dashStyle);
    },
    setAreaGradient: function (gradient) {
        this.setAreaGradientOpt(gradient);
        this.redraw();
    },
    setAreaGradientOpt: function (gradient) {
        this.areaFillColorGradient = gradient;
        this.chartObjectContainer.setChartOption('plotOptions.series.fillColor.linearGradient', [0, 0, 0, this.areaFillColorGradient]);
    },
    parseStoreData: function (store, reader) {
        var data = [];
        if (store) {
            if (store.getAt(0)) {
                var i = 0;
                var serie = [];
                while (store.getAt(i)) {
                    var record = store.getAt(i);
                    var xSource = this.chartObjectContainer.getXSource();
                    var ySource = this.chartObjectContainer.getYSource();
                    if (reader) {
                        if (reader.x && typeof reader.x == 'string') {
                            xSource = reader.x;
                        } else if (reader.x && typeof reader.x == 'object') {
                            xSource = reader.x.source;
                        }
                        if (reader.y && typeof reader.y == 'string') {
                            ySource = reader.y;
                        } else if (reader.y && typeof reader.y == 'object') {
                            ySource = reader.y.source;
                        }
                    }
                    var obj = {};
                    obj[xSource] = record.get(xSource);
                    obj[ySource] = record.get(ySource);
                    serie.push(obj);
                    i++;
                }
                data.push({
                    data: serie
                });
                return data;
            } else {
                var self = this;
                if (!store.subscribe) {
                    store.on('load', function (st) {
                        if (!st.loaded) {
                            if (self.currentData == st) {
                                self.reconfigureChart(self.currentType, self.currentData, self.currentReader, self.chartRotation);
                            }
                        }
                        st.loaded = true;
                    });
                    store.subscribe = true;
                }
                return null;
            }

        }
    },
    extractStoreData: function (store) {
        var data = [];
        if (store && store.getAt && typeof store.getAt == 'function') {
            if (store.getAt(0)) {
                var i = 0;
                while (store.getAt(i)) {
                    var row = store.getAt(i);
                    var rowData = {};
                    for (var j in row.data) {
                        rowData[j] = row.data[j];
                    }
                    data.push(rowData);
                    i++;
                }
            }
        }
        return data;
    },
    redraw: function () {
        this.chartObjectContainer.redraw();
    }
}

Ax.Charts.Views.PropertyGrid = Ext.extend(Ext.grid.PropertyGrid, {
    layout: 'fit',
    region: 'west',
    autoHeight: true,
    autoWidth: true,
    autoShow: true,
    width: 350,
    constructor: function (config) {
        Ax.Charts.Views.PropertyGrid.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        Ext.apply(this, Ax.Charts.Views.BaseChartProperties);
        this.loadDefaults = this.loadDefaultsOverride;
        this.rotationEnabled = this.rotationEnabledOverride;
        this.htmlChartElementId = this.htmlChartElementId ? this.htmlChartElementId : "chart-container-ax-" + this.id;
        if (!this.chartObjectContainer) {
            this.initChartOptions(this.chartOptions);
            this.chartObjectContainer = new Ax.Charts.Views.Chart(this.chartOptions);
        }
        var self = this;
        this.autoRefresh = typeof this.autoRefresh != 'undefined' ? this.autoRefresh : true;
        this.enable3D = this.enable3D ? this.enable3D : false;
        this.frame = true;
        this.title = this.getLabel('formTitle');
        this.customEditors = {};
        this.source = {};

        this.tfTitle = new Ext.form.TextField({
            hideLabel: false,
            value: this.chartTitle,
            enableKeyEvents: true
        });
        this.customEditors[this.getLabel('chartTitle')] = new Ext.grid.GridEditor(this.tfTitle, {
            listeners: {
                complete: function (ed, val, oldVal) {
                    self.chartTitle = val ? val : 0;
                    if (self.autoRefresh) {
                        self.setChartTitle(self.chartTitle);
                        self.redraw();
                    }
                }
            }
        });
        this.source[this.getLabel('chartTitle')] = '';
        this.cbChartType = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                data: this.chartObjectContainer.getChartTypes(true),
                fields: ['name', 'text', 'allowMultiSeries', 'support3D']
            }),
            valueField: 'name',
            displayField: 'text',
            forceSelection: true,
            mode: 'local',
            triggerAction: 'all',
            listeners: {
                select: function (cb, rec, ind) {
                    self.currentType = rec.get('name');
                    self.rotationEnabled(self.currentType);
                    if (self.autoRefresh) {
                        self.setChartType(rec.get('name'));
                    }
                    self.loadDefaultsOverride();
                }
            },
            getValue: function () {
                return this.getRawValue();
            }
        });
        this.customEditors[this.getLabel('chartType')] = new Ext.grid.GridEditor(this.cbChartType);
        this.source[this.getLabel('chartType')] = '';

        this.cbChartSource = new Ext.form.ComboBox({
            valueField: 'name',
            displayField: 'name',
            forceSelection: true,
            mode: 'local',
            triggerAction: 'all',
            store: this.sourceStore,
            listeners: {
                select: function (cb, rec, ind) {
                    self.currentData = rec.get('data');
                    self.currentReader = rec.get('reader');
                    if (self.autoRefresh) {
                        self.setChartData(rec.get('data'), rec.get('reader'));
                    }
                }
            }

        });
        this.customEditors[this.getLabel('chartSource')] = new Ext.grid.GridEditor(this.cbChartSource);
        this.source[this.getLabel('chartSource')] = '';

        this.cbChartDashStyle = new Ext.form.ComboBox({
            valueField: 'name',
            displayField: 'text',
            forceSelection: true,
            mode: 'local',
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
                data: Ax.Charts.chartDefaultOptions.getDashStyles(),
                fields: ['name', 'text']
            }),
            listeners: {
                select: function (cb, rec, ind) {
                    self.dashStyle = rec.get('name');
                    if (self.autoRefresh) {
                        self.setDashStyle(rec.get('name'));
                    }
                }
            },
            getValue: function () {
                return this.getRawValue();
            }

        });
        this.customEditors[this.getLabel('dashStyle')] = new Ext.grid.GridEditor(this.cbChartDashStyle);

        this.cbChartTheme = new Ext.form.ComboBox({
            valueField: 'name',
            displayField: 'text',
            forceSelection: true,
            mode: 'local',
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
                data: self.getThemeList(),
                fields: ['name', 'text', 'object']
            }),
            listeners: {
                select: function (cb, rec, ind) {
                    self.currentTheme = rec.get('name');
                    if (self.autoRefresh) {
                        self.setChartTheme(rec.get('name'));
                    }
                }
            },
            getValue: function () {
                return this.getRawValue();
            }

        });
        this.customEditors[this.getLabel('theme')] = new Ext.grid.GridEditor(this.cbChartTheme);
        this.source[this.getLabel('theme')] = '';

        this.tfXTitle = new Ext.form.TextField({
            hideLabel: false,
            value: this.chartXTitle,
            enableKeyEvents: true
        });
        this.customEditors[this.getLabel('chartXTitle')] = new Ext.grid.GridEditor(this.tfXTitle, {
            listeners: {
                complete: function (ed, val, oldVal) {
                    self.chartXTitle = val ? val : 0;
                    if (self.autoRefresh) {
                        self.setXaxisTitle(self.chartXTitle);
                        self.redraw();
                    }
                }
            }
        });
        this.source[this.getLabel('chartXTitle')] = '';

        this.nf3DRotationX = new Ext.form.NumberField({
            hideLabel: false,
            allowDecimals: true,
            disabled: !this.enable3D,
            maxValue: 80,
            minValue: 0,
            value: this.chartRotation.x,
            enableKeyEvents: true
        });
        this.customEditors[this.getLabel('rotationX')] = new Ext.grid.GridEditor(this.nf3DRotationX, {
            listeners: {
                complete: function (ed, val, oldVal) {
                    self.chartRotation.x = val ? val : 0;
                    if (self.autoRefresh) {
                        self.rotateChart(self.chartRotation);
                    }
                }
            }
        });
        this.source[this.getLabel('rotationX')] = '';

        this.tfYTitle = new Ext.form.TextField({
            hideLabel: false,
            value: this.chartYTitle,
            enableKeyEvents: true
        });
        this.customEditors[this.getLabel('chartYTitle')] = new Ext.grid.GridEditor(this.tfYTitle, {
            listeners: {
                complete: function (ed, val, oldVal) {
                    self.chartYTitle = val ? val : 0;
                    if (self.autoRefresh) {
                        self.setYayisTitle(self.chartYTitle);
                        self.redraw();
                    }
                }
            }
        });
        this.source[this.getLabel('chartYTitle')] = '';

        this.nf3DRotationY = new Ext.form.NumberField({
            hideLabel: false,
            allowDecimals: true,
            disabled: !this.enable3D,
            maxValue: 80,
            minValue: 0,
            value: this.chartRotation.y,
            enableKeyEvents: true
        });
        this.customEditors[this.getLabel('rotationY')] = new Ext.grid.GridEditor(this.nf3DRotationY, {
            listeners: {
                complete: function (ed, val, oldVal) {
                    self.chartRotation.y = val ? val : 0;
                    if (self.autoRefresh) {
                        self.rotateChart(self.chartRotation);
                    }
                }
            }
        });
        this.source[this.getLabel('rotationY')] = '';

        this.nfAreaGradient = new Ext.form.NumberField({
            hideLabel: false,
            allowDecimals: true,
            maxValue: 1000,
            minValue: 0,
            value: this.areaFillColorGradient,
            enableKeyEvents: true
        });

        this.customEditors[this.getLabel('areaFillColorGradient')] = new Ext.grid.GridEditor(this.nfAreaGradient, {
            listeners: {
                complete: function (ed, val, oldVal) {
                    self.areaFillColorGradient = val ? val : 0;
                    if (self.autoRefresh) {
                        self.setAreaGradient(self.areaFillColorGradient);
                    }
                }
            }
        });

        this.nf3DDeep = new Ext.form.NumberField({
            hideLabel: false,
            allowDecimals: true,
            disabled: !this.enable3D,
            maxValue: 80,
            minValue: 0,
            value: this.chartRotation.deep,
            enableKeyEvents: true
        });
        this.customEditors[this.getLabel('rotationDeep')] = new Ext.grid.GridEditor(this.nf3DDeep, {
            listeners: {
                complete: function (ed, val, oldVal) {
                    self.chartRotation.deep = val ? val : 0;
                    if (self.autoRefresh) {
                        self.rotateChart(self.chartRotation);
                    }
                }
            }
        });
        this.source[this.getLabel('rotationDeep')] = '';

        self.fillOpacity = 1;
        this.nfFillOpacity = new Ext.form.NumberField({
            hideLabel: false,
            allowDecimals: true,
            maxValue: 1,
            minValue: 0,
            value: this.fillOpacity,
            enableKeyEvents: true
        });
        this.customEditors[this.getLabel('fillOpacity')] = new Ext.grid.GridEditor(this.nfFillOpacity, {
            listeners: {
                complete: function (ed, val, oldVal) {
                    self.fillOpacity = val ? val : 1;
                    if (self.autoRefresh) {
                        self.setFillOpacity(self.fillOpacity);
                    }
                }
            }
        });


        this.tfBackground = new Ext.form.ComboBox({
            tpl: new Ext.Template('<div><input id="color-picker-' + self.id + '"/></div>'),
            editable: false,
            listWidth: 200,
            valueField: 'name',
            displayField: 'color',
            mode: 'local',
            store: new Ext.data.SimpleStore({
                data: [['#FFFFFF', '#FFFFFF']],
                fields: ['name', 'color']
            }),
            listeners: {
                expand: function () {
                    self.showColorPicker(true, true);
                }
            }
        });
        this.customEditors[this.getLabel('backgroundColor')] = new Ext.grid.GridEditor(this.tfBackground);
        this.source[this.getLabel('backgroundColor')] = '';

        this.chbAutoRfresh = new Ext.form.Checkbox({
            boxLabel: this.getLabel('autoRefresh'),
            checked: this.autoRefresh,
            hideLabel: true,
            listeners: {
                check: function (cb, checked) {
                    self.autoRefresh = checked;
                }
            }
        });

        this.loadAditionalProperties(this.source);
        this.bbar = [/*this.chbAutoRfresh, '->', new Ext.Button({
            text: this.getLabel('refresh'),
            iconCls: 'actualizar',
            handler: function () {
                if (self.currentType && self.currentData) {
                    self.reconfigureChart(self.currentType, self.currentData, self.currentReader, self.chartRotation);
                }
            }
        })*/];
        this.on('afterlayout', function () {
            self.loadDefaults();
        });
        this.on('backgroundColorSelected', function (color) {
            if (color) {
                if (color.toHexString() != self.tfBackground.getRawValue()) {
                    self.tfBackground.collapse();
                    var ColorRecord = Ext.data.Record.create([
                        {name: 'color'},
                        {name: 'name'}
                    ]);
                    self.tfBackground.store.removeAll();
                    self.tfBackground.store.add(new ColorRecord({
                        color: color.toHexString(),
                        name: color.toHexString()
                    }));
                    self.tfBackground.setValue(color.toHexString());
                    self.tfBackground.setRawValue(color.toHexString());
                }
            } else {
                self.tfBackground.collapse();
                self.tfBackground.setValue('');
                self.tfBackground.setRawValue('');
            }
        })
        Ax.Charts.Views.PropertyGrid.superclass.initComponent.call(this);
        this.colModel.setConfig([
            {
                dataIndex: "name",
                header: this.getLabel('name'),
                id: "name",
                menuDisabled: true,
                sortable: false,
                width: 80
            }, {
                dataIndex: "value",
                header: this.getLabel('value'),
                id: "value",
                menuDisabled: true,
                resizable: false
            },
        ]);
        this.store.sortInfo = undefined;
        this.store.sortToggle = undefined;
    },
    applySource: function (baseSource) {
        baseSource[this.getLabel('chartTitle')] = this.chartTitle;
        baseSource[this.getLabel('chartXTitle')] = this.chartXTitle;
        baseSource[this.getLabel('chartYTitle')] = this.chartYTitle;
        baseSource[this.getLabel('chartType')] = this.currentType;
        baseSource[this.getLabel('chartSource')] = this.currentSource;
        baseSource[this.getLabel('rotation')] = this.chartRotation.x;
        var source = this.getSource();
        for (var i in source) {
            if (typeof baseSource[i] != 'undefined') {
                if (this.getLabel('chartType') == i) {
                    source[i] = this.getLabel(baseSource[i]);
                } else {
                    source[i] = baseSource[i];
                }
            }
        }
        this.loadAditionalProperties(source);
        this.setSource(source);
        //}
    },
    loadDefaultsOverride: function () {
        var source = {
            '3D': this.chartRotation ? true : false,
        };
        this.chartTitle = this.getChartTitle();

        this.chartXTitle = this.getXaxisTitle();
        this.chartYTitle = this.getYayisTitle();
        source[this.getLabel('chartTitle')] = this.chartTitle;
        source[this.getLabel('chartXTitle')] = this.chartXTitle;
        source[this.getLabel('chartYTitle')] = this.chartYTitle;
        source[this.getLabel('chartType')] = this.currentType;
        source[this.getLabel('chartSource')] = this.currentSource;
        source[this.getLabel('rotationX')] = this.chartRotation.x;
        source[this.getLabel('rotationY')] = this.chartRotation.y;
        source[this.getLabel('rotationDeep')] = this.chartRotation.deep;

        this.rotationEnabled(this.currentType);
        this.loadAditionalProperties(source);
        this.applySource(source);
    },
    loadAditionalProperties: function (source) {
        var override = source ? false : true;
        var source = source ? source : this.getSource();
        if (this.currentType && this.currentType.replace('area', '') != this.currentType) {
            source[this.getLabel('fillOpacity')] = this.fillOpacity;
            //source[this.getLabel('areaFillColorGradient')] = this.areaFillColorGradient;
        } else {
            delete source[this.getLabel('fillOpacity')];
            //delete source[this.getLabel('areaFillColorGradient')];
            //this.areaFillColorGradient = 0;
        }
        //this.setAreaGradientOpt(this.areaFillColorGradient);
        if (this.currentType && (this.currentType.replace('line', '') != this.currentType || this.currentType.replace('area', '') != this.currentType)) {
            this.source[this.getLabel('dashStyle')] = this.dashStyle;
        } else {
            delete source[this.getLabel('dashStyle')];
            this.dashStyle = undefined;
        }
        this.setDashStyleOpt(this.dashStyle);
        if (override) {
            this.setSource(source);
        }
    },
    rotationEnabledOverride: function (type) {
        if (!this.chartObjectContainer.rotationEnabled(type)) {
            var source = {
                '3D': false,
            };
            source[this.getLabel('rotation')] = 0;
            this.applySource(source);
            this.enable3D = true;
            this.chartRotation = {
                x: 0,
                y: 0,
                deep: 0
            };
            this.nf3DRotationX.disable();
            this.nf3DRotationY.disable();
            this.nf3DDeep.disable();
        } else {
            this.enable3D = true;
            this.nf3DRotationX.enable();
            this.nf3DRotationY.enable();
            this.nf3DDeep.enable();
        }
    },
})

Ax.Charts.Views.Form = Ext.extend(Ext.form.FormPanel, {
    layout: 'form',
    region: 'west',
    autoHeight: true,
    autoWidth: true,
    autoShow: true,
    constructor: function (config) {
        Ax.Charts.Views.Form.superclass.constructor.call(this, config);
    },
    initComponent: function (config) {
        Ext.apply(this, Ax.Charts.Views.BaseChartProperties);

        this.htmlChartElementId = this.htmlChartElementId ? this.htmlChartElementId : "chart-container-ax-" + this.id;
        if (!this.chartObjectContainer) {
            this.initChartOptions(this.chartOptions);
            this.chartObjectContainer = new Ax.Charts.Views.Chart(this.chartOptions);
        }
        var self = this;
        this.autoRefresh = this.autoRefresh ? this.autoRefresh : false;
        this.enable3D = this.enable3D ? this.enable3D : false;

        this.frame = true;
        this.title = this.getLabel('formTitle');
        this.cbChartType = new Ext.form.ComboBox({
            fieldLabel: this.getLabel('chartType'),
            store: new Ext.data.SimpleStore({
                data: this.chartObjectContainer.getChartTypes(true),
                fields: ['name', 'text', 'allowMultiSeries', 'support3D']
            }),
            valueField: 'name',
            displayField: 'text',
            forceSelection: true,
            mode: 'local',
            triggerAction: 'all',
            listeners: {
                select: function (cb, rec, ind) {
                    self.currentType = rec.get('name');
                    self.rotationEnabled(self.currentType);
                    if (self.autoRefresh) {
                        self.setChartType(rec.get('name'));
                    }
                }
            }
        });
        this.cbChartSource = new Ext.form.ComboBox({
            fieldLabel: this.getLabel('chartSource'),
            valueField: 'name',
            displayField: 'name',
            forceSelection: true,
            mode: 'local',
            triggerAction: 'all',
            store: this.sourceStore,
            listeners: {
                select: function (cb, rec, ind) {
                    self.currentData = rec.get('data');
                    self.currentReader = rec.get('reader');
                    if (self.autoRefresh) {
                        self.setChartData(rec.get('data'), rec.get('reader'));
                    }

                }
            }

        });
        this.cbChartTheme = new Ext.form.ComboBox({
            fieldLabel: this.getLabel('theme'),
            valueField: 'name',
            displayField: 'text',
            forceSelection: true,
            mode: 'local',
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
                data: self.getThemeList(),
                fields: ['name', 'text', 'object']
            }),
            listeners: {
                select: function (cb, rec, ind) {
                    self.currentTheme = rec.get('name');
                    if (self.autoRefresh) {
                        self.setChartTheme(rec.get('name'));
                    }
                }
            }

        });
        this.chbAutoRfresh = new Ext.form.Checkbox({
            boxLabel: this.getLabel('autoRefresh'),
            checked: this.autoRefresh,
            hideLabel: true,
            listeners: {
                check: function (cb, checked) {
                    self.autoRefresh = checked;
                }
            }
        });
        this.chbChangeTheme = new Ext.form.Checkbox({
            boxLabel: this.getLabel('changeBackground'),
            checked: this.enableBackground,
            hideLabel: true,
            listeners: {
                check: function (cb, checked) {
                    self.cbChartTheme.clearValue();
                    if (checked) {
                        self.cbChartTheme.disable();
                        if (self.colorPicker) {
                            self.colorPicker.attr('disabled', '');
                        }
                    } else {
                        self.cbChartTheme.enable();
                        if (self.colorPicker) {
                            self.colorPicker.attr('disabled', true);
                            self.colorPicker.spectrum("set", '');
                        }
                    }
                    self.enableBackground = checked;
                    self.showColorPicker();
                }
            }
        });
        this.chb3DEnabled = new Ext.form.Checkbox({
            boxLabel: '3D',
            checked: this.enable3D,
            hideLabel: true,
            listeners: {
                check: function (cb, checked) {
                    self.enable3D = checked;
                    if (checked) {
                        self.nf3DRotation.enable();
                    } else {
                        self.chartRotation.x = 0;
                        self.nf3DRotation.setValue(0);
                        self.nf3DRotation.disable();
                    }
                }
            }
        });
        this.nf3DRotation = new Ext.form.NumberField({
            fieldLabel: this.getLabel('rotation'),
            hideLabel: false,
            allowDecimals: true,
            disabled: !this.enable3D,
            labelStyle: 'width: auto !important;',
            style: 'padding-left:0;width:155%;margin-left:-50px;',
            maxValue: 80,
            minValue: 0,
            value: this.chartRotation.x,
            enableKeyEvents: true,
            listeners: {
                change: function (nf, val) {
                    self.chartRotation.x = val;
                },
                keypress: function (tf, evt) {
                    var key = evt.getKey();
                    if (self.autoRefresh && key == Ext.EventObject.ENTER) {
                        self.chartRotation.x = tf.getValue() ? tf.getValue() : 0;
                        self.rotateChart(self.chartRotation);
                    }
                }
            }
        })
        this.tfBackground = new Ext.form.TextField({
            hideLabel: true,
            id: 'color-picker-' + self.id,
            hideLabel: false,
            labelStyle: 'visibility: hidden;display:none;',
            allowDecimals: true,
            disabled: !this.enableBackground,
            hidden: !this.enableBackground,
            style: 'padding-left:0;width:155%;margin-left:-100px;',
            listeners: {}
        })
        this.items = [
            this.cbChartType,
            this.cbChartSource,
            this.chbAutoRfresh,
            {
                layout: 'column',
                items: [{
                    columnWidth: .4,
                    layout: 'form',
                    items: [this.chb3DEnabled]
                }, {
                    columnWidth: .6,
                    layout: 'form',
                    items: [this.nf3DRotation]
                }]
            },
            this.cbChartTheme,
            this.chbChangeTheme,
            this.tfBackground
        ];
        this.buttons = [new Ext.Button({
            text: this.getLabel('refresh'),
            handler: function () {
                if (self.currentType && self.currentData) {
                    self.reconfigureChart(self.currentType, self.currentData, self.currentReader, self.chartRotation);
                }
            }
        })];
        this.on('afterlayout', function () {
            self.showColorPicker();
            self.loadDefaults();
        })
        Ax.Charts.Views.Form.superclass.initComponent.call(this);
    }
});

Ax.Charts.Views.Panel = Ext.extend(Ext.Panel, {
    region: 'center',
    layout: 'border',
    constructor: function (config) {
        Ax.Charts.Views.Panel.superclass.constructor.call(this, config);
    },
    addSourceStore: function (name, data, reader, type, serializeBy) {
        this.chartManagerFormPanel.addSourceStore(name, data, reader, type, serializeBy);
    },
    clearSourceStore: function () {
        this.chartManagerFormPanel.clearSourceStore();
    },
    initComponent: function (config) {
        var self = this;
        this.htmlChartElementId = this.htmlChartElementId ? this.htmlChartElementId : "chart-container-ax-" + this.id;
        if (!this.chartObjectContainer) {
            this.initChartOptions(this.chartOptions);
            this.chartObjectContainer = new Ax.Charts.Views.Chart(this.chartOptions);
        }
        this.chartPanel = new Ax.Charts.Views.ChartPanel({
            chartObjectContainer: this.chartObjectContainer,
            htmlChartElementId: this.htmlChartElementId
        });
        if (this.showForm) {
            this.chartManagerFormPanel = new Ax.Charts.Views.Form({
                chartObjectContainer: this.chartObjectContainer,
                htmlChartElementId: this.htmlChartElementId,
                collapsible: true,
                collapsed: false,
                border: false,
                listeners: {
                    collapse: function () {
                        self.chartObjectContainer.resizeChart();
                    },
                    expand: function () {
                        setTimeout(function () {
                            self.chartObjectContainer.resizeChart();
                        }, 200);
                    }
                }
            });
        } else {
            this.chartManagerFormPanel = new Ax.Charts.Views.PropertyGrid({
                chartObjectContainer: this.chartObjectContainer,
                htmlChartElementId: this.htmlChartElementId,
                collapsible: true,
                collapsed: false,
                border: false,
                listeners: {
                    collapse: function () {
                        self.chartObjectContainer.resizeChart();
                    },
                    expand: function () {
                        setTimeout(function () {
                            self.chartObjectContainer.resizeChart();
                        }, 200);
                    }
                }
            });
        }
        this.items = [
            this.chartPanel,
            this.chartManagerFormPanel
        ]
        Ax.Charts.Views.Panel.superclass.initComponent.call(this);
    },
    setXaxisTitle: function (title) {
        this.chartObjectContainer.setXaxisTitle(title);
    },
    setYayisTitle: function (title) {
        this.chartObjectContainer.setYayisTitle(title);
    },
    initChartOptions: function (options) {
        this.chartOptions = options ? options : {
            config: {},
            data: undefined
        };
        this.chartOptions.config.renderTo = this.htmlChartElementId;
        return this.chartOptions;
    },
    createSerieStore: function (sql, source, reader) {
        var xSource = this.chartObjectContainer.getXSource();
        var ySource = this.chartObjectContainer.getYSource();
        var data = source ? [] : null;
        if (reader) {
            if (reader.x && typeof reader.x == 'string') {
                xSource = reader.x;
            } else if (reader.x && typeof reader.x == 'object') {
                xSource = reader.x.source;
            }
            if (reader.y && typeof reader.y == 'string') {
                ySource = reader.y;
            } else if (reader.y && typeof reader.y == 'object') {
                ySource = reader.y.source;
            }
        }
        if (source && typeof source == 'object' && source.length) {
            for (var i = 0; i < source.length; i++) {
                var x = source[i][xSource] ? source[i][xSource] : source[i][0];
                var y = source[i][ySource] ? source[i][ySource] : source[i][1];
                data.push([x, y]);
            }
        } else if (source && typeof source == 'object' && source.data && source.getAt && typeof source.getAt == 'function') {
            var i = 0;
            while (source.getAt(i)) {
                var record = source.getAt(i)
                var x = record.get(xSource) ? record.get(xSource) : record.json[xSource];
                var y = record.get(ySource) ? record.get(ySource) : record.json[ySource];
                data.push([x, y]);
                i++;
            }
        }
        var store = new Ext.data.SimpleStore({
            url: data ? undefined : '/logistica/utiles/plugin/index.php/axchart/loadSqlQuery',
            baseParams: {
                sqlQuery: sql
            },
            fields: [xSource, ySource]
        });
        if (data) {
            store.loadData(data);
        } else {
            store.on('load', function (st, data) {
                st.removeAll();
                for (var i = 0; i < data.length; i++) {
                    if (data[i].json && typeof data[i].json[xSource] != undefined && typeof data[i].json[ySource] != undefined) {
                        data[i].data[xSource] = data[i].json[xSource];
                        data[i].data[ySource] = data[i].json[ySource];
                    }
                }
                st.add(data)
            });
            store.load();
        }
        return store;
    },
    addSerieStore: function (name, store, sql, reader, type) {
        this.chartManagerFormPanel.addSourceStore(name, this.createSerieStore(sql, store, reader), reader, type);
    },
    addSqlQuery: function (name, sql, reader) {
        this.addSerieStore(name, null, sql, reader);
    },
    clearSerieStore: function () {
        this.chartManagerFormPanel.clearSourceStore();
    }
});

Ax.Charts.Views.Window = Ext.extend(Ext.Window, {
    autoDestroy: true,
    modal: true,
    constrain: true,
    autoShow: true,
    plain: true,
    layout: 'border',
    width: '80%',
    height: 475,
    minHeight: 485,
    minWidth: 750,
    sourcesStores: {},
    sourceSeries: {},
    queryHash: {},
    sqlQuery: {},
    customHeaders: undefined,
    constructor: function (config) {
        Ax.Charts.Views.Window.superclass.constructor.call(this, config);
    },
    initComponent: function (config) {
        this.centerPanel = new Ext.Panel({
            region: 'center',
            layout: 'fit'
        });
        var self = this;
        this.addListener('show', function () {
            self.chartPanel = new Ax.Charts.Views.Panel({
                chartOptions: self.chartOptions,
                autoShow: true
            });
            self.centerPanel.add(self.chartPanel).show();
            this.centerPanel.doLayout();
            self.loadChartData();
        });
        this.items = [this.centerPanel];
        this.on('resize', function (win, width, height) {
            if (width < 800) {
                self.chartPanel.chartManagerFormPanel.collapse();
            } else {
                setTimeout(function () {
                    self.chartPanel.chartObjectContainer.resizeChart();
                }, 200);
            }
        });
        Ax.Charts.Views.Window.superclass.initComponent.call(this);
    },
    setXaxisTitle: function (title) {
        this.chartPanel.setXaxisTitle(title);
    },
    setYayisTitle: function (title) {
        this.chartPanel.setYayisTitle(title);
    },
    clearSources: function () {
        this.chartPanel.clearSerieStore();
        this.chartPanel.clearSourceStore();
    },
    addSqlQuery: function (name, sql, reader) {
        if (this.chartPanel) {
            this.chartPanel.addSerieStore(name, null, sql, reader);
        } else {
            this.sourceSeries[name] = {
                query: sql,
                added: false
            };
        }
    },
    addQueryHash: function (name, hash, record) {
        this.queryHash[name] = {
            hash: hash,
            fields: record
        };
        return this.queryHash[name];
    },
    addSourceStore: function (name, data, reader, type, show, serializeBy) {
        if (this.chartPanel) {
            this.chartPanel.addSourceStore(name, data, reader, type, serializeBy);
        } else {
            this.sourcesStores[name] = {
                data: data,
                added: false,
                reader: reader,
                serializeBy: serializeBy
            };
        }

    },
    addSerieStore: function (name, store, reader, serializeBy) {
        if (this.chartPanel) {
            this.chartPanel.addSerieStore(name, store, null, reader, serializeBy);
        } else {
            this.sourceSeries[name] = {
                store: store,
                added: false,
                reader: reader,
                serializeBy: serializeBy
            };
        }
    },
    loadChartData: function () {
        if (this.chartPanel) {
            for (var i in this.sourceSeries) {
                if (!this.sourceSeries[i].added) {
                    this.chartPanel.addSourceStore(i, this.sourceSeries[i].data, this.sourceSeries[i].reader);
                }
            }
            for (var j in this.sourcesStores) {
                if (!this.sourcesStores[j].added) {
                    if (this.sourcesStores[j].store)
                        this.chartPanel.addSerieStore(i, this.sourcesStores[j].store, null, this.sourcesStores[i].reader);
                    else if (this.sourcesStores[j].query) {
                        this.chartPanel.addSerieStore(i, null, this.sourcesStores[j].query, this.sourcesStores[i].reader);
                    }
                }
            }
        }
    }
});

Ax.Charts.Views.QuryResultWindow = Ext.extend(Ext.Window, {
    autoDestroy: true,
    autoShow: true,
    plain: true,
    modal: true,
    constrain: true,
    layout: 'border',
    width: 400,
    height: 250,
    minHeight: 250,
    minWidth: 400,
    sqlQuery: {},
    constructor: function (config) {
        Ax.Charts.Views.QuryResultWindow.superclass.constructor.call(this, config);
    },
    initComponent: function (config) {
        var self = this;
        this.winTitle = this.winTitle ? this.winTitle : Ax.Charts.chartDefaultOptions.getLabel('panelTitle');
        this.queryXStore = new Ext.data.SimpleStore({
            data: [],
            fields: ['field', 'alias']
        });
        var smX = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function () {
                    self.buildAxisConfig();
                }
            }
        });
        this.QueryResultGridX = new Ext.grid.EditorGridPanel({
            region: 'center',
            layout: 'fit',
            autoShow: true,
            store: this.queryXStore,
            title: Ax.Charts.chartDefaultOptions.getLabel('xConfig'),
            autoExpandColumn: 'columnXData',
            sm: smX,
            cm: new Ext.grid.ColumnModel([
                smX,
                {
                    header: Ax.Charts.chartDefaultOptions.getLabel('column'),
                    id: 'columnXData',
                    sortable: true,
                    editor: new Ext.form.TextField({
                        name: 'field'
                    }),
                    dataIndex: 'field'
                }, {
                    header: Ax.Charts.chartDefaultOptions.getLabel('alias'),
                    width: 180,
                    sortable: true,
                    editor: new Ext.form.TextField({
                        name: 'alias'
                    }),
                    dataIndex: 'alias'
                }
            ])
        });


        this.queryYStore = new Ext.data.SimpleStore({
            data: [],
            fields: ['field', 'alias']
        });
        var smY = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function () {
                    self.buildAxisConfig();
                }
            }
        });
        this.QueryResultGridY = new Ext.grid.EditorGridPanel({
            region: 'center',
            layout: 'fit',
            autoShow: true,
            store: this.queryYStore,
            autoExpandColumn: 'columnYData',
            title: Ax.Charts.chartDefaultOptions.getLabel('yConfig'),
            sm: smY,
            cm: new Ext.grid.ColumnModel([
                smY,
                {
                    header: Ax.Charts.chartDefaultOptions.getLabel('column'),
                    id: 'columnYData',
                    sortable: true,
                    editor: new Ext.form.TextField({
                        name: 'field'
                    }),
                    dataIndex: 'field'
                }, {
                    header: Ax.Charts.chartDefaultOptions.getLabel('alias'),
                    width: 180,
                    sortable: true,
                    editor: new Ext.form.TextField({
                        name: 'alias'
                    }),
                    dataIndex: 'alias'
                }
            ])
        });
        this.tabsAxisConfig = new Ext.TabPanel({
            activeTab: 0,
            region: 'center',
            items: [self.QueryResultGridX, self.QueryResultGridY]
        });
        this.items = [this.tabsAxisConfig];
        this.buttons = [new Ext.Button({
            text: Ax.Charts.chartDefaultOptions.getLabel('showChart'),
            iconCls: 'icondistra-graficar',
            disabled: true,
            handler: function () {
                self.buildAxisConfig();
                if (self.axisConfig) {
                    var title = self.chartTitle ? self.chartTitle : Ax.Charts.chartDefaultOptions.getLabel('panelTitle');
                    var chartType = self.chartType ? self.chartType : null;
                    self.showChartWindow(title, self.sqlQuery, chartType, self.axisConfig);
                }
            }
        })]
        if (this.sqlQuery) {
            this.executeQuery(this.sqlQuery);
        }
        Ax.Charts.Views.QuryResultWindow.superclass.initComponent.call(this);
    },
    buildAxisConfig: function () {
        this.axisConfig = null;
        if (this.QueryResultGridX.getSelectionModel().hasSelection() && this.QueryResultGridY.getSelectionModel().hasSelection()) {

            var recX = this.QueryResultGridX.getSelectionModel().getSelected();
            var xAxisConfig = {
                label: recX.get('alias') ? recX.get('alias') : recX.get('field'),
                source: recX.get('field')
            }
            var recY = this.QueryResultGridY.getSelectionModel().getSelected();
            var yAxisConfig = {
                label: recY.get('alias') ? recY.get('alias') : recY.get('field'),
                source: recY.get('field')
            }
            this.axisConfig = {
                x: xAxisConfig,
                y: yAxisConfig
            };
            this.buttons[0].enable();
        } else {
            this.buttons[0].disable();
        }
    },
    executeQuery: function (query) {
        var self = this;
        this.sqlQuery = query;
        Ext.Ajax.request({
            url: '/logistica/utiles/plugin/index.php/axchart/loadSqlQuery',
            success: function (response, opts) {
                var data = Ext.decode(response.responseText);
                var reader = [['x', ''], ['y', '']];
                if (data && data[0]) {
                    reader = [];
                    var firstColumn = data[0];
                    for (var i in firstColumn) {
                        if (i != 'length' && i != '_proto') {
                            reader.push([i, '']);
                        }
                    }
                }
                self.buildGrid(reader);
            },
            params: {
                sqlQuery: self.sqlQuery
            }
        });
    },
    buildGrid: function (data) {
        this.queryXStore.loadData(data);
        this.queryYStore.loadData(data);
    },
    getLabel: function (label, lang) {
        return Ax.Charts.chartDefaultOptions.getLabel(label, lang);
    },
    showChartWindow: function (title, source, chartType, axisConfig) {
        chartType = chartType ? chartType : 'line';
        this.chartWindow = new Ax.Charts.Views.Window({
            region: 'center',
            title: this.winTitle,
            chartOptions: {
                config: {
                    chartType: chartType,
                    x: {
                        label: axisConfig.x.label,
                        source: axisConfig.x.source
                    },
                    y: {
                        label: axisConfig.y.label,
                        source: axisConfig.y.source
                    },
                    title: title
                }
            }
        });
        this.chartWindow.show();
        if (typeof source == 'string') {
            this.chartWindow.clearSources();
            this.chartWindow.addSqlQuery(title, source, {x: axisConfig.x.source, y: axisConfig.y.source});
        }
        this.close();
    }
});

Ax.Charts.Views.notify = function (title, msg, severity) {
    var icon = Ext.MessageBox.WARNING;
    if (severity == 'error') {
        icon = Ext.MessageBox.ERROR;
    }
    Ext.MessageBox.show({
        title: title,
        msg: msg,
        width: 320,
        buttons: Ext.MessageBox.OK,
        icon: icon
    });
}

Ax.Charts.Views.ChartButton = Ext.extend(Ext.Button, {
    sourceSeries: undefined,
    updateSourceStores: undefined,
    updateQuery: undefined,
    constructor: function (config) {
        var self = this;
        this.chartType = this.chartType ? this.chartType : 'line';
        this.iconCls = this.iconCls ? this.iconCls : 'icondistra-graficar';
        this.text = this.text ? this.text : Ax.Charts.chartDefaultOptions.getLabel('showChart');
        this.winTitle = this.winTitle ? this.winTitle : Ax.Charts.chartDefaultOptions.getLabel('panelTitle');
        this.queryWinTitle = this.queryWinTitle ? this.queryWinTitle : Ax.Charts.chartDefaultOptions.getLabel('selectSource');
        this.waiting = false;
        this.running = false;

        this.handler = function () {
            if (self.chartWindow) {
                if (self.chartWindow.destroy && typeof self.chartWindow.destroy == 'function') {
                    self.chartWindow.destroy();
                }
                self.chartWindow = undefined;
            }
            if (self.waitFn && typeof self.waitFn == 'function' && !this.waiting) {
                self.wait();
                return self.waitFn(self);
            }
            if (self.updateQuery && typeof self.updateQuery == 'function') {
                var tmpQuery = self.updateQuery();
                if (typeof tmpQuery == 'string') {
                    self.sqlQuery = tmpQuery;
                }
            }
            if (self.updateSourceStores && typeof self.updateSourceStores == 'function') {
                self.updateSourceStores();
            }
            if (self.sqlQuery && self.axisConfig) {
                self.showChartWindow(self.text, self.sqlQuery, this.chartType, self.axisConfig)
            } else if (self.sqlQuery) {
                self.showQueryResultWindow(self.sqlQuery);
            } else if (this.sourceSeries) {
                self.showChartWindow(self.text, self.sourceSeries, this.chartType, self.axisConfig);
                if (self.updateSourceStores && typeof self.updateSourceStores == 'function') {
                    self.sourceSeries = undefined;
                }
            } else {
                Ax.Charts.Views.notify(Ax.Charts.chartDefaultOptions.getLabel('warning'), Ax.Charts.chartDefaultOptions.getLabel('noSql'), 'warning');
            }

        };
        Ax.Charts.Views.ChartButton.superclass.constructor.call(this, config);
    },
    wait: function () {
        this.waiting = true;
        this.disable();
    },
    run: function () {
        this.enable();
        this.handler();
        this.waiting = false;
    },
    addSqlQuery: function (sqlQuery, axisConfig) {
        this.sqlQuery = sqlQuery;
        if (axisConfig) {
            this.setAxisConfig(axisConfig);
        }
    },
    setAxisConfig: function (axisConfig) {
        this.axisConfig = axisConfig;
    },
    initComponent: function (config) {
        this.updateQuery = this.updateQuery ? this.updateQuery : undefined;
        Ax.Charts.Views.ChartButton.superclass.initComponent.call(this);
    },
    addSerieStore: function (name, store, reader, serializeBy) {
        if (serializeBy) {
            var storeData = Ax.Charts.Views.BaseChartProperties.extractStoreData(store);
            if (this.chartWindow) {
                this.chartWindow.addSourceStore(name, storeData, reader, this.chartType, null, serializeBy);
            } else {
                if (!this.sourceSeries) {
                    this.sourceSeries = {};
                }
                this.sourceSeries[name] = {
                    data: storeData,
                    added: false,
                    reader: reader,
                    serializeBy: serializeBy
                };
            }
        } else {
            if (this.chartWindow) {
                this.chartWindow.addSerieStore(name, store, null, reader);
            } else {
                if (!this.sourceSeries) {
                    this.sourceSeries = {};
                }
                this.sourceSeries[name] = {
                    store: store,
                    added: false,
                    reader: reader
                };
            }
        }
        this.setAxisConfig(reader);
    },
    showChartWindow: function (title, source, chartType, axisConfig) {
        chartType = chartType ? chartType : 'line';
        if (this.chartWindow) {
            if (this.chartWindow.destroy && typeof this.chartWindow.destroy == 'function') {
                this.chartWindow.destroy();
            }
            this.chartWindow = undefined;
        }
        this.chartWindow = new Ax.Charts.Views.Window({
            region: 'center',
            title: this.winTitle,
            chartOptions: {
                config: {
                    chartType: chartType,
                    x: {
                        label: axisConfig.x.label,
                        source: axisConfig.x.source
                    },
                    y: {
                        label: axisConfig.y.label,
                        source: axisConfig.y.source
                    },
                    title: title
                }
            }
        });
        this.chartWindow.show();
        if (typeof source == 'string') {
            this.chartWindow.addSqlQuery(title, source, {x: axisConfig.x.source, y: axisConfig.y.source});
        } else if (typeof source == 'object') {
            for (var i in source) {
                if (i != 'length') {
                    if (source[i].store) {
                        this.chartWindow.addSerieStore(i, source[i].store, source[i].reader);
                    } else if (source[i].data) {
                        this.chartWindow.addSourceStore(i, source[i].data, source[i].reader, this.chartType, null, source[i].serializeBy);
                    }
                }
            }
        }
    },
    showQueryResultWindow: function (sqlQuery) {
        this.chartWindow = new Ax.Charts.Views.QuryResultWindow({
            sqlQuery: sqlQuery,
            winTitle: this.winTitle,
            title: this.queryWinTitle
        });
        this.chartWindow.show();
    }
});
