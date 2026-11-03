/**
 * @name analisisft.Dashboard - Inicio.
 * @package Pvd.MovimientosLaborales.
 * @uses Pvd.MovimientosLaborales.Analisisft
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *         Orestes Rodríguez Lorenzo
 * @version 1.0
 */
Ext.ns('Pvd.SST.Gestionaraccidentes.Analisis');
Pvd.SST.Gestionaraccidentes.Analisis.Dashboard = Ext.extend(Ext.Panel,{
    layout: 'fit',
    id: 'panel_dashboard_ch_sstaccidente_analisis',
    region: 'center',
    height: '100%',
    autoScroll: true,
    closable: false,
    initComponent: function () {
        var self = this;
        /* BUSCADOR */
        /*this.tlEstructura = new Ext.tree.TreeLoader({
            dataUrl: 'obtenerEstructura',
            preloadChildren: false
        });
        this.tcbEstructuraOrganizativa = new Ext.components.TreeComboBox({
            allowBlank: true,
            anchor: '100%',
            fieldLabel: 'idioma.lbCargo',
            id: 'tcbEstructuraOrganizativa',
            treeConfig: {
                autoScroll: true,
                border: false,
                loader: this.tlEstructura,
                rootVisible: false
            },
            width: 400
        });
        this.btnBuscar = new Ext.Button({
            text: 'Buscar',
            iconCls: 'buscar',
            handler: function ()
            {
                Ext.getCmp('contenedorChart').destroy();
                cargarDatos(self.tcbEstructuraOrganizativa.getValue());
            }.createDelegate(this)
        });
        this.btnLimpiar = new Ext.Button({
            text: 'Limpiar',
            iconCls: 'limpiar',
            handler: function ()
            {
                self.tcbEstructuraOrganizativa.setRawValue('');
                Ext.getCmp('contenedorChart').destroy();
                cargarDatos();
            }.createDelegate(this)
        });
        this.tbar = ['Estructura organizativa:',this.tcbEstructuraOrganizativa, this.btnBuscar,this.btnLimpiar];*/
        var idioma = {
            es: {
                g1_titulo: 'Accidentes por tipo',
                g2_titulo: 'Accidentes por forma del accidente',
                g3_titulo: 'Costo total por accidentes',
                g4_titulo: 'Cantidad de implicados por accidentes',
                g5_titulo: 'Cantidad de accidentes por años',
                g6_titulo: 'Cantidad de fallecidos por años',
                g3_tooltips: 'pesos',
                cantidad: 'Cantidad',
                costo: 'Costo'
            }
        };
        function cargarDatos(idestructura) {
            Ext.Ajax.request({
                url: 'getDatosGrafica',
                params: {idestructura: idestructura},
                callback : function() {Ext.getBody().unmask();},
                success  : function (r){
                    //Obteniendo la respuesta de la petición
                    var rd = Ext.decode(r.responseText);
                    var configGraficas = new Array();
                    //Cantidad por Tipo de accidente
                    var categTipoAccidente = new Array();
                    var serieTipoAccidente = new Array();
                    for (var i = 0; i < rd.tipoaccidente.length; i++) {
                        categTipoAccidente.push(rd.tipoaccidente[i].index);
                        serieTipoAccidente.push({
                            y: (rd.tipoaccidente[i].valor != null) ? Number.parseInt(rd.tipoaccidente[i].valor) : 0,
                            nombre: rd.tipoaccidente[i].index
                        });
                    }
                    configGraficas.push({
                        titulo: idioma.es.g1_titulo,
                        tipo: 'pie',
                        series: [{nombre: idioma.es.cantidad, datos: serieTipoAccidente}],
                        x: {
                            categorias: categTipoAccidente
                        },
                        y: {}
                    });
                    //Cantidad por Forma de accidente
                    var categFormaAccidente = new Array();
                    var serieFormaAccidente = new Array();
                    for (var i = 0; i < rd.formaaccidente.length; i++) {
                        categFormaAccidente.push(rd.formaaccidente[i].index);
                        serieFormaAccidente.push({
                            y: (rd.formaaccidente[i].valor != null) ? Number.parseInt(rd.formaaccidente[i].valor) : 0,
                            nombre: rd.formaaccidente[i].index
                        });
                    }
                    configGraficas.push({
                        titulo: idioma.es.g2_titulo,
                        tipo: 'bar',
                        series: [{nombre: idioma.es.cantidad, datos: serieFormaAccidente}],
                        x: {
                            categorias: categFormaAccidente
                        },
                        y: {}
                    });
                    //Costos por accidente
                    var categCostosAccidente = new Array();
                    var serieCostosAccidente = new Array();
                    for (var i = 0; i < rd.costoaccidente.length; i++) {
                        categCostosAccidente.push(rd.costoaccidente[i].index);
                        serieCostosAccidente.push({
                            y: (rd.costoaccidente[i].valor != null) ? Number.parseInt(rd.costoaccidente[i].valor) : 0,
                            nombre: rd.costoaccidente[i].index
                        });
                    }
                    configGraficas.push({
                        titulo: idioma.es.g3_titulo,
                        tipo: 'bar',
                        tooltip: {sufijo: idioma.es.g3_tooltips},
                        series: [{nombre: idioma.es.costo, datos: serieCostosAccidente}],
                        x: {
                            categorias: categCostosAccidente
                        },
                        y: {}
                    });
                    //Cantidad de implicados por accidente
                    var categImplicadosAccidente = new Array();
                    var serieImplicadosAccidente = new Array();
                    for (var i = 0; i < rd.implicadosaccidente.length; i++) {
                        categImplicadosAccidente.push(rd.implicadosaccidente[i].index);
                        serieImplicadosAccidente.push({
                            y: (rd.implicadosaccidente[i].valor != null) ? Number.parseInt(rd.implicadosaccidente[i].valor) : 0,
                            nombre: rd.implicadosaccidente[i].index
                        });
                    }
                    configGraficas.push({
                        titulo: idioma.es.g4_titulo,
                        tipo: 'bar',
                        series: [{nombre: idioma.es.cantidad, datos: serieImplicadosAccidente}],
                        x: {
                            categorias: categImplicadosAccidente
                        },
                        y: {}
                    });
                    //Cantidad de accidentes por año
                    var categAccidenteYear = new Array();
                    var serieAccidenteYear = new Array();
                    for (var i = 0; i < rd.accidenteyear.length; i++) {
                        categAccidenteYear.push(rd.accidenteyear[i].index);
                        serieAccidenteYear.push({
                            y: (rd.accidenteyear[i].valor != null) ? Number.parseInt(rd.accidenteyear[i].valor) : 0,
                            nombre: rd.accidenteyear[i].index
                        });
                    }
                    configGraficas.push({
                        titulo: idioma.es.g5_titulo,
                        tipo: 'column',
                        series: [{nombre: idioma.es.cantidad, datos: serieAccidenteYear}],
                        x: {
                            categorias: categAccidenteYear
                        },
                        y: {}
                    });
                    //Cantidad de fallecidos por año
                    var categFallecidoYear = new Array();
                    var serieFallecidoYear = new Array();
                    for (var i = 0; i < rd.fallecidosyear.length; i++) {
                        categFallecidoYear.push(rd.fallecidosyear[i].index);
                        serieFallecidoYear.push({
                            y: (rd.fallecidosyear[i].valor != null) ? Number.parseInt(rd.fallecidosyear[i].valor) : 0,
                            nombre: rd.fallecidosyear[i].index
                        });
                    }
                    configGraficas.push({
                        titulo: idioma.es.g6_titulo,
                        tipo: 'column',
                        series: [{nombre: idioma.es.cantidad, datos: serieFallecidoYear}],
                        x: {
                            categorias: categFallecidoYear
                        },
                        y: {}
                    });

                    var pChart = new PVD.Graficas.Contenedor({config: configGraficas, columnas: 2, idpanel: 'panel_dashboard_ch_sstaccidente_analisis'});

                    Ext.getCmp('panel_dashboard_ch_sstaccidente_analisis').add(pChart);
                    Ext.getCmp('panel_dashboard_ch_sstaccidente_analisis').doLayout();
                }
            });
        }
        cargarDatos();
        Pvd.SST.Gestionaraccidentes.Analisis.Dashboard.superclass.initComponent.call(this);
    }
});
