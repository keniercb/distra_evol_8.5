/*
 * Componente Análisis.
 *
 * @author Ing.Orestes Rodríguez Lorenzo
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Gestionarprocesoseleccion.PanelAnalisis
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Seleccion.Gestionarprocesoseleccion'); Ext.QuickTips.init();
Pvd.Seleccion.Gestionarprocesoseleccion.PanelAnalisis = Ext.extend(Ext.Panel, {
    layout        : 'fit', 
	id            : 'analisis',
	title         : 'An&aacute;lisis',
	region        : 'center',
	//height        : 800,
	width  : '100%',
	closable      : true,
	//iconCls       : 'estadistica',
    initComponent : function() {
        var self = this;
		
		this.pcharResumen = new Ext.components.HighchartPanel({
            border : true,
			layout : 'fit',
			region : 'center',
			width  : '50%',
            chartConfig : {
                chart       : {type : 'pie'},
                title       : {text : 'Resumen del proceso'},
                xAxis       : {title : {text : 'Estado'}},
                yAxis       : {title : {text : 'Cantidad de procesados'}},
                plotOptions : {
					column  : {
						stacking : 'normal',
						dataLabels : {
							enabled : true,
							color : (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
							style : {textShadow: '0 0 3px black, 0 0 3px black'}
						}
					}
				},
				series :  [{name : 'Total', data : self.serieResumen}]
            }
        });
		this.pcharExcluidos = new Ext.components.HighchartPanel({
            border : true,
			layout : 'fit',
			region : 'east',
			width  : '50%',
            chartConfig : {
                chart       : {type : 'column'},
                title       : {text : 'Candidatos excluidos'},
                xAxis       : {title : {text : 'Estado'}, categories : ['Excluidos por proceso', 'Excluidos por usuarios']},
                yAxis       : {title : {text : 'Total de excluidos'}},
                plotOptions : {
					column  : {
						stacking : 'normal',
						dataLabels : {
							enabled : true,
							color : (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
							style : {textShadow: '0 0 3px black, 0 0 3px black'}
						}
					}
				},
				series : [{name : 'Total', data : self.serieExcluido}]
            }
        });
		this.pGraficas = new Ext.Panel({
			layout : 'border',
			region : 'center',
			border : false,
			items  : [this.pcharResumen, this.pcharExcluidos]
		});
        this.items = [this.pGraficas];
        Pvd.Seleccion.Gestionarprocesoseleccion.PanelAnalisis.superclass.initComponent.call(this);
    }  
});
