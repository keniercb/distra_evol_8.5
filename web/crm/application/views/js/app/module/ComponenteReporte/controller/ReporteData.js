Ext.define('ComponenteReporte.controller.ReporteData', {
    extend: 'Ext.app.Controller',
    alias: 'controller.reportedata',
    refs: [
        {ref: 'ReporteContainer', selector: 'reportecontainer'},
        {ref: 'ReporteData', selector: 'reportedata'}
    ],
    init: function () {
        var me = this;
        me.reportServerUrl = 'estadistica.xetid.cu/reportserver/reportserver/httpauthexport';
        me.listen({
            component: {
                'reportecontainer': {
                    render: this.onRenderReporte
                },
                'reportecontainer button[action=buscar]': {
                    click: this.searchFilterReporte
                },
                'reportecontainer button[action=limpiar]': {
                    click: this.cleanFilterReporte
                },
                "reportecontainer button[action=exportar] menu": {
                    click: this.exportarReporte
                }
            }
        });

    },
    onRenderReporte: function (comp) {
        this.updatePanelByTipoContenido(comp.configReporte, comp);
        this.buildFiltos(comp.configReporte.filtros, comp);
        this.reloadReportData(comp.configReporte, comp);
    },
    updatePanelByTipoContenido: function (config, comp) {
        var me = this,
            reportedata = comp.down('reportedata');

        switch (config.tipocontenido) {
            case 2:
                reportedata.down('toolbar').show();
                break;
            case 3:
                reportedata.add(Ext.create(config.nombrecomponente));
                break;


        }
    },
    buildFiltos: function (filtros, comp) {
        var me = this,
            fpfiltros = comp.down('form[name=fpfiltros]'),
            lg = filtros.length;

        if (Ext.isArray(filtros) && lg) {

            var sortFiltros = filtros.sort(function (a, b) {
                return a.orden - b.orden
            });

            for (var i = 0; i < lg; i++) {
                // if(sortFiltros[i]['tipo']!=5)
                    fpfiltros.insert(i, me.factoryFilter(sortFiltros[i]));
            }

            fpfiltros.show();
            comp.doLayout();
        }
    },
    factoryFilter: function (filter) {
        var comp;
        // console.log('filter:', filter)
        switch (filter['tipo']) {
            case '1':
                comp = this.getTextFilter(filter);
                break;
            case '2':
                comp = this.getDateFilter(filter);
                break;
            case '3':
                comp = this.getNumericFilter(filter);
                break;
            case '4':
                comp = this.getNomencladorFilter(filter);
                break;
            case '5':
                comp = this.getEstructuraFilter(filter);
                break;
        }

        return Ext.applyIf(comp, {
            fieldLabel: filter['denominacion'],
            name: filter['nombreparametro'],
            width: parseInt(filter['anchocolumna']),
            margin: '0 10 0 0'
        });
    },
    getTextFilter: function (config) {
        var minlength = (config['longitudminima']) ? config['longitudminima'] : 0,
            minPluralText = (minlength > 1) ? 'es' : '',
            maxLength = config['longitudmaxima'],
            maxPluralText = (maxLength > 1) ? 'es' : '';

        return {
            xtype: 'textfield',
            minLength: (minlength) ? minlength : 0,
            minLengthText: 'El tama&ntilde;o m&iacute;nimo requerido es ' + minlength + ' caracter' + minPluralText + '.',
            maxLength: maxLength,
            maxLengthText: 'El tama&ntilde;o m&aacute;ximo requerido es ' + maxLength + ' caracter' + maxPluralText + '.'
        };
    },
    getDateFilter: function (config) {
        return {
            xtype: 'datefield',
            format: 'd/m/Y',
        };
    },
    getNumericFilter: function (config) {
        var minValue = (Ext.isEmpty(config['valorminimo'])) ? 0 : config['valorminimo'],
            maxValue = config['valormaximo'],
            invalidMsg = 'Solo admite n&uacute;meros enteros entre ' + minValue + ' y ' + maxValue + '.';
        console.log(minValue, maxValue)
        return {
            xtype: 'numberfield',
            allowNegative: false,
            minValue: minValue,
            minText: invalidMsg,
            maxValue: maxValue,
            maxText: invalidMsg,
            invalidText: invalidMsg
        };
    },
    getNomencladorFilter: function (config) {

        var store = Ext.create('Ext.data.Store', {
            idfiltro: config.idfiltro,
            fields: [
                {name: config['nomidentificador']},
                {name: config['nomdenominacion']}
            ],
            proxy: {
                type: 'ajax',
                url: (function () {
                    var nomModule = ModuleMgr.get('ConfiguracionGral').moduleCfg;
                    return '/' + nomModule.getBasePath() + 'index.php/componentereportes/getFilterNomencladorData';
                })(),
                actionMethods: {read: 'POST'},
                reader: {
                    root: 'datos',
                    totalProperty: 'cantidad',
                    successProperty: 'success'
                }
            },
            listeners: {
                beforeload: function (st, oper) {
                    if (!oper.params)
                        oper.params = {};
                    oper.params.idfiltro = store.idfiltro;
                }
            }

        });

        return {
            xtype: 'combobox',
            store: store,
            valueField: config['nomidentificador'],
            displayField: config['nomdenominacion'],
            hiddenName: config['nomidentificador'],
            multiSelect: config['multipleseleccion'] == '1' ? true : false,
            triggerAction: 'all',
            forceSelection: true,
            pageSize: config['paginado'] == '1' ? 25 : null,
            mode: 'local',
            emptyText: 'Selecciones...',
            listeners: {
                select: function (combo, records) {
                    if (!this.multiSelect) {
                        return;
                    }
                    this.multipleIds = '';
                    records.forEach(function (r) {
                        this.multipleIds += r.get(this.valueField) + ','
                    }, this);
                },
                change: function (combo, value) {
                    if (!this.multiSelect) {
                        return;
                    }
                    if (Ext.isEmpty(value)) {
                        this.multipleIds = '';
                    }
                }
            }
        };
    },
    getEstructuraFilter: function (filterConfig) {
        console.log('getEstructuraFilter:', filterConfig)
        return Ext.create('GestionContrato.view.SearchCmbArea', {
            fieldLabel: filterConfig['denominacion'],
            labelAlign: 'top',
            name: filterConfig['nombreparametro'],
            // name: 'estructuras',
            // hideLabel: true,
            // maxWidth: 250,
            // minWidth: 150,
            // width: 200,
            editable: false,
            anchor: '100%',
            searchTooltip: 'Buscar',
            clearTooltip: 'Limpiar filtro',
            emptyText: 'Seleccione el \xE1rea...',
            searchButton:false,
            // value: filterConfig['estructuras'],
            // idValue: filterConfig['idestructuras']?filterConfig['idestructuras'].split(','):'',
            // multipleIds: filterConfig['idestructuras']
            listeners: {
                select: function (combo, records) {
                    if (!this.multiSelect) {
                        return;
                    }
                    this.multipleIds = '';
                    records.forEach(function (r) {
                        this.multipleIds += r.get(this.valueField) + ','
                    }, this);
                },
                change: function (combo, value) {
                    if (!this.multiSelect) {
                        return;
                    }
                    if (Ext.isEmpty(value)) {
                        this.multipleIds = '';
                    }
                }
            }
        })
    },
    reloadReportData: function (config, comp) {
        var me = this,
            fpfiltros = comp.down('form[name=fpfiltros]'),
            filterParams,
            url, visualcomp;

        if (fpfiltros.isVisible()) {
            filterParams = this.getFiltersValues(config, fpfiltros);
            // console.log(filterParams);
        }
//         else{
//             filterParams = me.getFiltersCrazy(config, fpfiltros);
//         }
//         console.log('reloadReportData:', fpfiltros.isVisible(), fpfiltros, filterParams)
        switch (config.tipocontenido) {
            case 1:
                url = me.buildUrl(config.url, {filters: (filterParams) ? Ext.encode(filterParams) : null});
                me.loadIframeReportData(url, comp);
                break;
            case 2:
                url = me.buildUrl(me.getReporteJasperUrl(),
                    {
                        //principales
                        dirReport: '/reports/crm/' + config.recurso.split('.')[0], //direccion del reporte
                        params: (filterParams) ? filterParams : null,
                        name: config.text, //nombre que va a tener el archivo a guardar
                        //cambiables
                        // typeRequest: config.typeRequest ? config.typeRequest : 'auto',
                        typeFormat: 'PDF',
                        content: 'application/pdf',
                        paginated: config.paginated ? config.paginated : false,
                        pages: null,
                        interactive: false,
                        attachmentsPrefix: null,
                        isAttachment: config.isAttachment ? config.isAttachment : false,
                    }
                    // formato: 'PDF',
                    // recurso: config.recurso,
                    // filters: (filterParams)?Ext.encode(filterParams): null
                );
                me.loadIframeReportData(url, comp);
                break;
            case 3:
                visualcomp = comp.down('reportedata').items.first();
                if (visualcomp['reloadComponentInfo'])
                    visualcomp.reloadComponentInfo(filterParams);
                break;

            case 4:
                //var filterParams=fpfiltros;
                //console.log('CONFIG:', config);
                me.config = config;
                if (filterParams) {
                    if (filterParams['format'] == 'LD') {
						
						
                       url = 'https://estadistica.xetid.cu/reportserver/ReportServer.html#inlinereport/&id:' + config['identificadorreporte'] + '&type:preview';  ;
                       //url = me.reportServerUrl + '/ReportServer.html#inlinereport/id:' + config['identificadorreporte'] + '&type:preview';  
                       //console.log('asdasdasdas');					   
                       window.open(url);
                    } else {


                        url = me.buildUrlReportServer(me.reportServerUrl, me.getReportReportServerParams('PDF', filterParams));
                        window.open(url);
                    }
                }

                break;
        }
    }, 
    buildUrl: function (dir, params) {
        return document.location.protocol + '//' + document.location.host + dir + '?datas=' + Ext.encode(params);
        // return document.location.protocol + '//' + document.location.host+dir+'?'+Ext.encode(params);
    },
    buildUrlReportServer: function (dir, params) {
        return 'https:' + '//' + dir + '?' + Ext.urlEncode(params);
        //return document.location.protocol + '//' + dir + '?' + Ext.urlEncode(params);
    },
    loadIframeReportData: function (url, comp) {
        var me = this,
            reportData = comp.down('reportedata'),
            iframe = document.getElementById(reportData.iframeId);

        reportData.showLoadMask();
        iframe.src = url;
        iframe.onload = function () {
            reportData.hideLoadMask();
        }.bind(me);
    },
    getReportReportServerParams: function (format, filters) {
        var me = this;

        var result = {
            user: 'exportuser',
            apikey: '123edcxzasdf',
            format: format,
            download: 'false',
            id: me.config['identificadorreporte']
        };

        for (var propiedad in filters) {
            if (propiedad != 'format') {
                result['p_' + propiedad] = filters[propiedad];
            } else {
                result[propiedad] = filters[propiedad];
            }
        }

        return result;
    },
    getReporteJasperUrl: function () {
        return (function () {
            var nomModule = ModuleMgr.get('ConfiguracionGral').moduleCfg;
            // return '/crm/componentereporte/index.php/';
            return '/logistica/utiles/reportes/index.php/';
            // return '/' + nomModule.getBasePath() + 'index.php/componentereportes/getReporteJasper';
            // return '/logistica/utiles/reportes/index.php/jasperclient/runReport';
            // return '/' + nomModule.getBasePath() + 'index.php/componentereportes/getReporteJasperData';
        })();
    },
    searchFilterReporte: function (btn) {
        var me = this,
            comp = btn.findParentByType('reportecontainer');

        me.reloadReportData(comp.configReporte, comp);
    },
    cleanFilterReporte: function (btn) {
        var me = this,
            comp = btn.findParentByType('reportecontainer');

        btn.findParentByType('form').getForm().reset();

        me.reloadReportData(comp.configReporte, comp);
    },
    exportarReporte: function (menu, item) {
        var me = this,
            comp = menu.findParentByType('reportecontainer'),
            fpfiltros = comp.down('form[name=fpfiltros]'),
            filterParams, url;

        if (fpfiltros.isVisible())
            filterParams = this.getFiltersValues(comp.configReporte, fpfiltros);

        url = me.buildUrl(me.getReporteJasperUrl(), {
            dirReport: '/reports/crm/' + comp.configReporte.recurso.split('.')[0], //direccion del reporte
            params: (filterParams) ? Ext.encode(filterParams) : null,
            name: 'Exportar', //nombre que va a tener el archivo a guardar
            typeFormat: item.format,
            isAttachment: true

            // formato: item.format,
            // recurso: comp.configReporte.recurso,
            // filters: (filterParams)?Ext.encode(filterParams): null
        });

        window.open(url);
    },
    getFiltersValues: function (config, form) {
        var me = this,
            filtrosConfig = config.filtros,
            lg = filtrosConfig.length,
            result = {};
        console.log('AQUI FILTROS:', filtrosConfig)
        for (var i = 0; i < lg; i++) {
            var filterField = form.down('field[name=' + filtrosConfig[i]['nombreparametro'] + ']');

            if (!Ext.isEmpty(filterField.getValue()) && filterField.isValid()) {
                if (filterField.multiSelect) {
                    var temp = filterField.multipleIds;
                    if (temp != '')
                        temp = temp.substring(0, temp.length - 1);
                    result[filterField.name] = temp;
                } else {
                    result[filterField.name] = filterField.getValue();
                }
            }
        }
        console.log('filtros:', result)
        return result;
    },
    getFiltersValuesOld: function (config, form) {
        var filtrosConfig = config.filtros,
            lg = filtrosConfig.length,
            result = new Array(),
            filterField;

        for (var i = 0; i < lg; i++) {
            filterField = form.down('field[name=' + filtrosConfig[i]['nombreparametro'] + ']');

            if (!Ext.isEmpty(filterField.getValue()) && filterField.isValid()) {
                if (filterField.multiSelect) {
                    var temp = filterField.multipleIds;
                    if (temp != '')
                        temp = temp.substring(0, temp.length - 1);
                    result.push({
                        name: filterField.name,
                        value: temp,
                        datatype: 'java.lang.String'
                    });
                } else {
                    result.push({
                        name: filterField.name,
                        value: filterField.getValue(),
                        datatype: filtrosConfig[i]['javatype']
                    });
                }
            }
        }

        return result;
    },
    getFiltersCrazy: function (config, form) {
        var filtrosConfig = config.filtros,
            result = new Array();
        filtrosConfig.forEach(function (x) {
            if (x['multipleseleccion']) {
                result.push({
                    name: x['nombreparametro'],
                    value: '-1',
                    datatype: 'java.lang.String'
                });
            } else {
                result.push({
                    name: x['nombreparametro'],
                    value: x['javatype'] == 'java.lang.String' ? '-1-1-1' : -1,
                    datatype: x['javatype']
                });
            }
        });
        return result;
    }
});
