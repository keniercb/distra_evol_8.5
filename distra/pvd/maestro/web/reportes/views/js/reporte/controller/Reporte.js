Ext.ns('Maestro.Reporte.controller');

Maestro.Reporte.controller.Reporte = Ext.extend( Maestro.ConfigurarReporte.base.Controller,{
    reportInfo : {},
    jasperUrl: '/pvd/maestro/reportes/index.php/reportes/getReporteData',
    init: function(){
    		this.registerEvents({
            'container': {
                render: this.onRenderContainer,
            },
            'tbarreporte menuFormats':{
                 itemclick : this.exportReport
            },
            'panelfilters btnSearch':{
                click: this.reloadReportData
            },
            'panelfilters btnClean':{
                click: this.cleanReporteData
            }
        }, this);
    },
    onRenderContainer: function(comp){
    	var me = this,
    		mask = new Ext.LoadMask(comp.el, {msg:Maestro.Reporte.idiom.lbMaskGenerateViewReport});
    		
    	setTimeout(function(){  
    		me.loadReporteInfo(mask);
        }, 100);
    },
    loadReporteInfo: function(mask){
    	var me = this,
    		idmodule = (me.application.initConfig)?me.application.initConfig.idmodule: '',
    		idreporte = (me.application.initConfig)?me.application.initConfig.idreporte: '';
		
		mask.show();
    	Ext.Ajax.request({
            url : '/pvd/maestro/reportes/index.php/reportes/getReporteEstructura',
            params : {moduleidentificador: idmodule, reporteidentificador:idreporte},
            method : 'POST',
            callback : function(opts, success, response){
                mask.hide();
                var responseData = Ext.decode(response.responseText);
                me.reportInfo = responseData.datos;
                me.factoryReportContentByType();
                me.updatePanelFilters(me.reportInfo.filtros);
                if (me.reportInfo.otroformato == 1) {
                    me.getView('panelfilters').checkbFormatoExcel.setVisible(true);
                } else {
                    me.getView('panelfilters').checkbFormatoExcel.setVisible(false);
                }
                //me.reloadReportData();
            },
            scope: me
        });
    },
    factoryReportContentByType: function(){
        var me = this;
        
        switch(me.reportInfo['tipocontenido']){
            case '2':
                me.getView('reportedata').getTopToolbar().show();
                break;
            case '3':
                var comp = me.getApplication().createClass(me.reportInfo['nombrecomponente']);
                me.addView('reportcomponent', comp)
                me.getView('reportedata').add(comp);
                me.getView('container').doLayout();
                break;
        }
    },
    reloadReportData: function(){
        var me = this,
            filterParams, comp, url;

        if( me.getView('panelfilters').isVisible() )
            filterParams = this.getFiltersValues();

        switch(me.reportInfo['tipocontenido']){
            case '1':
                url = me.buildUrl(me.reportInfo['url'], {filters: (filterParams)?Ext.encode(filterParams): null});
                me.loadIframeReportData(url);
                break;
            case '2':
                url = me.buildUrl( me.jasperUrl, me.getReportJasperParams('PDF', filterParams) );
                me.loadIframeReportData(url);
                break;
            case '3':
                comp = me.getView('reportcomponent')
                if(comp['reloadComponentInfo'])
                    comp.reloadComponentInfo(filterParams);
                break;
        }
    },
    buildUrl: function(dir, params){
        return document.location.protocol + '//' + document.location.host+dir+'?'+Ext.urlEncode(params);
    },
    loadIframeReportData: function(url){
        var me = this,
            reportData = me.getView('reportedata'),
            iframe = document.getElementById(reportData.iframeId);;

        reportData.showLoadMask();

        iframe.src = url;

        iframe.onload = function () {
            this.getView('reportedata').hideLoadMask();
        }.createDelegate(me);
    },
    cleanReporteData: function(){
        this.getView('panelfilters').cascade(function(elem){
            if(elem['reset']){
                if( elem.isXType('treecombobox') && elem.tree){
                    elem.tree.getSelectionModel().clearSelections() ;
                    elem.valueNotFoundText= Maestro.Reporte.idiom.emptyFieldText;
                }
                elem.reset();
            }
        });

        this.reloadReportData();
    },
    exportReport: function(itemclick){
        var me = this,
            filterParams, url;

        if( me.getView('panelfilters').isVisible() )
            filterParams = this.getFiltersValues();

        url = me.buildUrl( me.jasperUrl, me.getReportJasperParams(itemclick.format, filterParams) );

        window.open(url);
    },
    getReportJasperParams: function(format, filters){
        var me = this;

        return {
            formato: format,
            recurso: me.reportInfo['recurso'],
            filters: (filters)?Ext.encode(filters): null
        };
    },
    getFiltersValues: function(){
        var me = this,
            filterStruct = me.reportInfo.filtros,
            lg = filterStruct.length,
            formFilters = me.getView('panelfilters'),
            filtersValues = new Array(),
            filterComp, paramName, filterValue;

        for (var i = 0; i < lg; i++) {
            paramName = filterStruct[i]['nombreparametro'];
            filterComp = formFilters.find('name', paramName);

            if( !Ext.isEmpty(filterComp) && filterComp[0].isValid() ){
                filtersValues.push({
                    name : paramName,
                    value : filterComp[0].getValue()
                    //datatype : filterStruct[i]['javatype']
                });
            }
        };
        
        if(me.getView('panelfilters').checkbFormatoExcel.isVisible()){
            filtersValues.push({
                name : 'otroformato',
                value : me.getView('panelfilters').checkbFormatoExcel.getValue()
                //datatype : 'java.lang.Number'
            });
        }

        return filtersValues;
    },
    updatePanelFilters: function(filters){
    	var me = this,
    		lg = filters.length,
    		panelfilter = me.getView('panelfilters');

    	if(Ext.isArray(filters) && filters.length){
    		for (var i = 0; i < lg; i++)
    			panelfilter.insert(i, me.factoryFilter(filters[i]));
    		panelfilter.show();
            me.getView('container').doLayout();
    	}
    },
    factoryFilter: function(filter){
    	var comp;
    	
    	switch(filter['tipo']){
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

		return { 
			border:false, 
			style:'margin-right: 10px;', 
            bodyStyle : {background: '#DFE8F6'},
			layout:'form', 
			labelAlign: 'top',
			width: parseInt(filter['anchocolumna']), 
			items: [Ext.applyIf(comp, this.getBaseConfig(filter))] 
		};
    },
    getBaseConfig: function(filter){
		return {
    		fieldLabel: filter['denominacion'],  
			name: filter['nombreparametro'],  
			width: parseInt(filter['anchocolumna']),
    	};
    },
    getTextFilter: function(filterConfig){
		var minlength = (filterConfig['longitudminima'])?filterConfig['longitudminima']:0,
			minPluralText = (minlength>1)?'es':'',
			maxLength = filterConfig['longitudmaxima'],
			maxPluralText = (maxLength>1)?'es':'';
                
    	return {
    		xtype: 'textfield',
    		minLength: (minlength)? minlength: 0,
    		minLengthText: 'El tama&ntilde;o m&iacute;nimo requerido es '+minlength+' caracter'+minPluralText+'.',
    		maxLength: maxLength,
    		maxLengthText: 'El tama&ntilde;o m&aacute;ximo requerido es '+maxLength+' caracter'+maxPluralText+'.',
    	};
    },
    getDateFilter: function(filterConfig){
		return {
    		xtype: 'datefield',
            format:'d/m/Y',
    	};
    },
    getNumericFilter: function(filterConfig){
    	var minValue = (Ext.isEmpty(filterConfig['valorminimo']))?0:filterConfig['valorminimo'],
    		maxValue = filterConfig['valormaximo'],
    		invalidMsg = 'Solo admite n&uacute;meros enteros entre '+minValue+' y '+maxValue+'.';
		
		return {
    		xtype: 'numberfield',
    		allowNegative : false,
			minValue: minValue,
			minText: invalidMsg,
			maxValue: maxValue,
			maxText: invalidMsg,
			invalidText: invalidMsg,
    	};
    },
    getNomencladorFilter: function(filterConfig){
        var store = new Ext.data.Store({
                url: '/pvd/maestro/reportes/index.php/reportes/getFilterNomencladorData',
                baseParams: {idfiltro: filterConfig['idfiltro']},
                reader:new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    root: "datos",
                    id: filterConfig['nomidentificador']
                    },[ {name: filterConfig['nomidentificador']},
                        {name: filterConfig['nomdenominacion']}]
                )
            });

        store.load();
       
		return {
    		xtype: 'combo',
            store: store,
            valueField: filterConfig['nomidentificador'], 
            displayField: filterConfig['nomdenominacion'], 
            hiddenName: filterConfig['nomidentificador'],
            triggerAction: 'all',
            mode: 'local', 
            emptyText: Maestro.Reporte.idiom.emptyFieldText,
    	};
    },
    getEstructuraFilter: function(filterConfig){

		return new Ext.components.TreeComboBox({
            triggerAction: 'all',
            mode: 'local', 
            emptyText: Maestro.Reporte.idiom.emptyFieldText,
            treeConfig: {
                rootVisible: false,
                loader: new Ext.tree.TreeLoader({
                    dataUrl: '/pvd/maestro/reportes/index.php/reportes/getFilterEstructuraData',
                    preloadChildren: false
                }),
                border: false,
                autoScroll: true,
                root: new Ext.tree.AsyncTreeNode({
                    id: 'root',
                }),
            }
        });
    },
});