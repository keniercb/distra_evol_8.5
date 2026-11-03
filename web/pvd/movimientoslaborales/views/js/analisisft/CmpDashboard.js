/**
 * @name analisisft.Dashboard - Inicio.
 * @package Pvd.MovimientosLaborales.
 * @uses Pvd.MovimientosLaborales.Analisisft
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *         Orestes Rodríguez Lorenzo
 * @version 1.0
 */
Ext.ns('Pvd.MovimientosLaborales.Analisisft');
Pvd.MovimientosLaborales.Analisisft.Dashboard = Ext.extend(Ext.Panel,{
    layout: 'fit',
    id: 'panel_dashboard_ch_ft_analisis',
    region: 'center',
    height: '100%',
    autoScroll: true,
    closable: false,
    initComponent: function () {
        var self = this;
        /* BUSCADOR */
        this.tlEstructura = new Ext.tree.TreeLoader({
            dataUrl: 'obtenerEstructura',
            preloadChildren: false
        });
        this.tcbEstructuraOrganizativa = new Ext.components.TreeComboBox({
            allowBlank: true,
            anchor: '100%',
            fieldLabel: 'idioma.lbCargo',
            id: 'tcbEstructuraOrganizativadb',
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
        this.tbar = ['Estructura organizativa:',this.tcbEstructuraOrganizativa, this.btnBuscar,this.btnLimpiar];
        var idioma = {
            es: {
                generoMasc: 'Masculino',
                generoFem: 'Femenino',
                g1_titulo: 'Trabajadores por género',
                cantidad: 'Cantidad',
                g2_titulo: 'Trabajadores por rango de edades',
                g3_titulo: 'Trabajadores por género y rango de edades',
                g4_titulo: 'Trabajadores por tipo de contrato',
                g5_titulo: 'Trabajadores por contratos',
                g6_titulo: 'Trabajadores por categoría ocupacional',
                g7_titulo: 'Trabajadores por situación laboral',
                g8_titulo: 'Trabajadores por procedencia social',
                g9_titulo: 'Trabajadores por programa laboral',
                categEdad1: 'Menores de 15 años',
                categEdad2: 'Entre 15 y 16 años',
                categEdad3: 'Entre 17 y 19 años',
                categEdad4: 'Entre 20 y 29 años',
                categEdad5: 'Entre 30 y 39 años',
                categEdad6: 'Entre 40 y 59 años',
                categEdad7: 'Entre 60 y 64 años',
                categEdad8: 'Entre 65 y 69 años',
                categEdad9: 'Mayores de 70 años',
                categEdad10: 'Edad no conocida',
                tcontrat_ind: 'Indeterminado',
                tcontrat_det: 'Determinado',
                tcontrat_evn: 'Eventual'
            }
        };
        function cargarDatos(idestructura) {
            Ext.Ajax.request({
                url: 'getDatosGrafica',
                params: {idestructura: idestructura},
                callback : function() {Ext.getBody().unmask();},
                success  : function (r){
                    //Obteniendo la respuesta de la petición
                    var rd = Ext.decode(r.responseText)
                    var configGraficas = new Array();
                    //Cantidad por género
                    var serieGenero = new Array();
                    for (var i = 0; i < rd.genero.length; i++) {
                        var objSerie = {
                            y: Number.parseInt(rd.genero[i].valor),
                            nombre: (rd.genero[i].index == 0) ? idioma.es.generoFem : idioma.es.generoMasc,
                            color: (rd.genero[i].index == 0) ? '#ffb6f0' :'#1e96ff'
                        };
                        serieGenero.push(objSerie);
                    }
                    configGraficas.push({
                        titulo: idioma.es.g1_titulo,
                        tipo: 'pie',
                        series: [{nombre: idioma.es.cantidad, datos: serieGenero}],
                        x: {},
                        y: {}
                    });
                    if(!Ext.isEmpty(rd.serieedades)){
                        var categoriasEdades = new Array();
                        var serieEdades = new Array();
                        Ext.each(rd.serieedades, function (rec) {
                            categoriasEdades.push(rec.nombre);
                            serieEdades.push({
                                nombre:rec.nombre,
                                y:rec.y
                            })
                        });
                    }else{
                        //Cantidad por edades
                        var categoriasEdades = [idioma.es.categEdad1, idioma.es.categEdad2, idioma.es.categEdad3,
                            idioma.es.categEdad4, idioma.es.categEdad5, idioma.es.categEdad6, idioma.es.categEdad7,
                            idioma.es.categEdad8, idioma.es.categEdad9, idioma.es.categEdad10];

                        var serieEdades = new Array(
                            {y: 0, nombre: idioma.es.categEdad1},
                            {y: 0, nombre: idioma.es.categEdad2},
                            {y: 0, nombre: idioma.es.categEdad3},
                            {y: 0, nombre: idioma.es.categEdad4},
                            {y: 0, nombre: idioma.es.categEdad5},
                            {y: 0, nombre: idioma.es.categEdad6},
                            {y: 0, nombre: idioma.es.categEdad7},
                            {y: 0, nombre: idioma.es.categEdad8},
                            {y: 0, nombre: idioma.es.categEdad9},
                            {y: 0, nombre: idioma.es.categEdad10}
                        );
                        for (var i = 0; i < rd.edades.length; i++) {
                            if(rd.edades[i].index < 15 && rd.edades[i].index != null)
                                serieEdades[0].y += Number.parseInt(rd.edades[i].valor);
                            if(rd.edades[i].index == 15 || rd.edades[i].index == 16)
                                serieEdades[1].y += Number.parseInt(rd.edades[i].valor);
                            if(rd.edades[i].index >= 17 && rd.edades[i].index <= 19)
                                serieEdades[2].y += Number.parseInt(rd.edades[i].valor);
                            if(rd.edades[i].index >= 20 && rd.edades[i].index <= 29)
                                serieEdades[3].y += Number.parseInt(rd.edades[i].valor);
                            if(rd.edades[i].index >= 30 && rd.edades[i].index <= 39)
                                serieEdades[4].y += Number.parseInt(rd.edades[i].valor);
                            if(rd.edades[i].index >= 40 && rd.edades[i].index <= 59)
                                serieEdades[5].y += Number.parseInt(rd.edades[i].valor);
                            if(rd.edades[i].index >= 60 && rd.edades[i].index <= 64)
                                serieEdades[6].y += Number.parseInt(rd.edades[i].valor);
                            if(rd.edades[i].index >= 65 && rd.edades[i].index <= 69)
                                serieEdades[7].y += Number.parseInt(rd.edades[i].valor);
                            if(rd.edades[i].index >= 70)
                                serieEdades[8].y += Number.parseInt(rd.edades[i].valor);
                            if(Ext.isEmpty(rd.edades[i].index))
                                serieEdades[9].y += Number.parseInt(rd.edades[i].valor);
                        }
                    }
                    configGraficas.push({
                        titulo: idioma.es.g2_titulo,
                        tipo: 'pie',
                        series: [{nombre: idioma.es.cantidad, datos: serieEdades}],
                        x: {
                            categorias: categoriasEdades
                        },
                        y: {}
                    });

                    if(!Ext.isEmpty(rd.seriegeneroedades)){
                        var categoriasEdades = new Array();
                        var serieEdades = new Array();
                        Ext.each(rd.seriegeneroedades.fem, function (rec) {
                            categoriasEdades.push(rec.nombre);
                            serieEdades.push({
                                nombre: rec.nombre,
                                y: Math.abs(rec.y)
                            })
                        });
                    }else{
                        
                        //Cantidad femenina por edad
                        var serieEdades = new Array(
                            {y: 0, nombre: idioma.es.categEdad1},
                            {y: 0, nombre: idioma.es.categEdad2},
                            {y: 0, nombre: idioma.es.categEdad3},
                            {y: 0, nombre: idioma.es.categEdad4},
                            {y: 0, nombre: idioma.es.categEdad5},
                            {y: 0, nombre: idioma.es.categEdad6},
                            {y: 0, nombre: idioma.es.categEdad7},
                            {y: 0, nombre: idioma.es.categEdad8},
                            {y: 0, nombre: idioma.es.categEdad9},
                            {y: 0, nombre: idioma.es.categEdad10}
                        );
    
                        var edades = rd.genedad.fem;
    
                        for (var i = 0; i < edades.length; i++) {
                            if(edades[i].index < 15 && edades[i].index != null)
                                serieEdades[0].y += Number.parseInt(edades[i].valor);
                            if(edades[i].index == 15 || edades[i].index == 16)
                                serieEdades[1].y += Number.parseInt(edades[i].valor);
                            if(edades[i].index >= 17 && edades[i].index <= 19)
                                serieEdades[2].y += Number.parseInt(edades[i].valor);
                            if(edades[i].index >= 20 && edades[i].index <= 29)
                                serieEdades[3].y += Number.parseInt(edades[i].valor);
                            if(edades[i].index >= 30 && edades[i].index <= 39)
                                serieEdades[4].y += Number.parseInt(edades[i].valor);
                            if(edades[i].index >= 40 && edades[i].index <= 59)
                                serieEdades[5].y += Number.parseInt(edades[i].valor);
                            if(edades[i].index >= 60 && edades[i].index <= 64)
                                serieEdades[6].y += Number.parseInt(edades[i].valor);
                            if(edades[i].index >= 65 && edades[i].index <= 69)
                                serieEdades[7].y += Number.parseInt(edades[i].valor);
                            if(edades[i].index >= 70)
                                serieEdades[8].y += Number.parseInt(edades[i].valor);
                            if(Ext.isEmpty(edades[i].index))
                                serieEdades[9].y += Number.parseInt(edades[i].valor);
                        }
                    }
                    
                    configGraficas.push({
                        titulo: 'Trabajadores femeninos por rango de edades',
                        tipo: 'pie',
                        series: [{nombre: idioma.es.cantidad, datos: serieEdades}],
                        x: {
                            categorias: categoriasEdades
                        },
                        y: {}
                    });

                    if(!Ext.isEmpty(rd.seriegeneroedades)){
                        var categoriasEdades = new Array();
                        var serieEdades = new Array();
                        Ext.each(rd.seriegeneroedades.masc, function (rec) {
                            categoriasEdades.push(rec.nombre);
                            serieEdades.push({
                                nombre: rec.nombre,
                                y: Math.abs(rec.y)
                            })
                        });
                    } else {

                        //Cantidad masculina por edad
                        var serieEdades = new Array(
                            {y: 0, nombre: idioma.es.categEdad1},
                            {y: 0, nombre: idioma.es.categEdad2},
                            {y: 0, nombre: idioma.es.categEdad3},
                            {y: 0, nombre: idioma.es.categEdad4},
                            {y: 0, nombre: idioma.es.categEdad5},
                            {y: 0, nombre: idioma.es.categEdad6},
                            {y: 0, nombre: idioma.es.categEdad7},
                            {y: 0, nombre: idioma.es.categEdad8},
                            {y: 0, nombre: idioma.es.categEdad9},
                            {y: 0, nombre: idioma.es.categEdad10}
                        );
    
                        var edades = rd.genedad.masc;
    
                        for (var i = 0; i < edades.length; i++) {
                            if(edades[i].index < 15 && edades[i].index != null)
                                serieEdades[0].y += Number.parseInt(edades[i].valor);
                            if(edades[i].index == 15 || edades[i].index == 16)
                                serieEdades[1].y += Number.parseInt(edades[i].valor);
                            if(edades[i].index >= 17 && edades[i].index <= 19)
                                serieEdades[2].y += Number.parseInt(edades[i].valor);
                            if(edades[i].index >= 20 && edades[i].index <= 29)
                                serieEdades[3].y += Number.parseInt(edades[i].valor);
                            if(edades[i].index >= 30 && edades[i].index <= 39)
                                serieEdades[4].y += Number.parseInt(edades[i].valor);
                            if(edades[i].index >= 40 && edades[i].index <= 59)
                                serieEdades[5].y += Number.parseInt(edades[i].valor);
                            if(edades[i].index >= 60 && edades[i].index <= 64)
                                serieEdades[6].y += Number.parseInt(edades[i].valor);
                            if(edades[i].index >= 65 && edades[i].index <= 69)
                                serieEdades[7].y += Number.parseInt(edades[i].valor);
                            if(edades[i].index >= 70)
                                serieEdades[8].y += Number.parseInt(edades[i].valor);
                            if(Ext.isEmpty(edades[i].index))
                                serieEdades[9].y += Number.parseInt(edades[i].valor);
                        }
                    }

                    
                    configGraficas.push({
                        titulo: 'Trabajadores masculinos por rango de edades',
                        tipo: 'pie',
                        series: [{nombre: idioma.es.cantidad, datos: serieEdades}],
                        x: {
                            categorias: categoriasEdades
                        },
                        y: {}
                    });

                    // if(!Ext.isEmpty(rd.seriegeneroedades)){
                    //     var serieGenEdad = new Array(
                    //         {nombre: idioma.es.generoFem, datos: rd.seriegeneroedades.fem},
                    //         {nombre: idioma.es.generoMasc, datos: rd.seriegeneroedades.masc}
                    //     );
                    // }else{
                    //     //Cantidad por genero y edad
                    //     var serieGenEdad = new Array(
                    //         {nombre: idioma.es.generoFem, datos: ordenarArrEdades(rd.genedad.fem, true)},
                    //         {nombre: idioma.es.generoMasc, datos: ordenarArrEdades(rd.genedad.masc, false)}
                    //     );
                    // }

                    // configGraficas.push({
                    //     titulo: idioma.es.g3_titulo,
                    //     tipo: 'bar',
                    //     colores: ['#ffb6f0', '#1e96ff'],
                    //     series: serieGenEdad,
                    //     x: {
                    //         categorias: categoriasEdades
                    //     },
                    //     y: {
                    //         etiquetasAbs: true
                    //     },
                    //     tooltip: {
                    //         valorAbs: true
                    //     }
                    // });
		    //Cantidad por color de piel
                    var categColorPiel = new Array();
                    var serieColorPiel = new Array();
                    for (var i = 0; i < rd.colorpiel.length; i++) {
                        categColorPiel.push(rd.colorpiel[i].index);
                        serieColorPiel.push({
                            y: (rd.colorpiel[i].valor != null) ? Number.parseInt(rd.colorpiel[i].valor) : 0,
                            nombre: rd.colorpiel[i].index
                        });
                    }
                    configGraficas.push({

                        titulo: 'Trabajadores por color de piel',
                        tipo: 'pie',
                        series: [{nombre: idioma.es.cantidad, datos: serieColorPiel}],
                        x: {
                            categorias: categColorPiel
                        },
                        y: {}
                    });
                    //Cantidad por tipo de contratos
                    var categTipoContrato = [idioma.es.tcontrat_ind, idioma.es.tcontrat_det, idioma.es.tcontrat_evn];
                    var serieTipoContrato = new Array(
                        {y: 0, nombre: idioma.es.tcontrat_ind},
                        {y: 0, nombre: idioma.es.tcontrat_det},
                        {y: 0, nombre: idioma.es.tcontrat_evn},
                    );
                    for (var i = 0; i < rd.tipocontrato.length; i++) {
                        if(rd.tipocontrato[i].index == 1)
                            serieTipoContrato[1].y += Number.parseInt(rd.tipocontrato[i].valor);
                        else if (rd.tipocontrato[i].index == 0)
                            serieTipoContrato[0].y += Number.parseInt(rd.tipocontrato[i].valor);
                        else
                            serieTipoContrato[2].y += Number.parseInt(rd.tipocontrato[i].valor);
                    }
                    configGraficas.push({
                        titulo: idioma.es.g4_titulo,
                        tipo: 'pie',
                        series: [{nombre: idioma.es.cantidad, datos: serieTipoContrato}],
                        x: {
                            categorias: categTipoContrato
                        },
                        y: {}
                    });
                    //Cantidad por contratos
                    var categContrato = new Array();
                    var serieContrato = new Array();
                    for (var i = 0; i < rd.contrato.length; i++) {
                        categContrato.push(rd.contrato[i].index);
                        serieContrato.push({
                            y: (rd.contrato[i].valor != null) ? Number.parseInt(rd.contrato[i].valor) : 0,
                            nombre: rd.contrato[i].index
                        });
                    }
                    configGraficas.push({
                        titulo: idioma.es.g5_titulo,
                        tipo: 'bar',
                        series: [{nombre: idioma.es.cantidad, datos: serieContrato}],
                        x: {
                            categorias: categContrato
                        },
                        y: {}
                    });
                    //Cantidad por categoria ocupacional
                    var categCategOcup = new Array();
                    var serieCategOcup = new Array();
                    for (var i = 0; i < rd.categocup.length; i++) {
                        categCategOcup.push(rd.categocup[i].index);
                        serieCategOcup.push({
                            y: (rd.categocup[i].valor != null) ? Number.parseInt(rd.categocup[i].valor) : 0,
                            nombre: rd.categocup[i].index
                        });
                    }
                    configGraficas.push({
                        titulo: idioma.es.g6_titulo,
                        tipo: 'pie',
                        series: [{nombre: idioma.es.cantidad, datos: serieCategOcup}],
                        x: {
                            categorias: categCategOcup
                        },
                        y: {}
                    });
                    //Cantidad por situacion laboral
                    var categSitLab = new Array();
                    var serieSitLab = new Array();
                    for (var i = 0; i < rd.sitlab.length; i++) {
                        categSitLab.push(rd.sitlab[i].index);
                        serieSitLab.push({
                            y: (rd.sitlab[i].valor != null) ? Number.parseInt(rd.sitlab[i].valor) : 0,
                            nombre: rd.sitlab[i].index,
                            color: (rd.sitlab[i].color) ? rd.sitlab[i].color : '#000000'
                        });
                    }
                    configGraficas.push({
                        titulo: idioma.es.g7_titulo,
                        tipo: 'bar',
                        series: [{nombre: idioma.es.cantidad, datos: serieSitLab}],
                        x: {
                            categorias: categSitLab
                        },
                        y: {}
                    });
                    //Cantidad por procedencia
                    var categProcSocial = new Array();
                    var serieProcSocial = new Array();
                    for (var i = 0; i < rd.procsocial.length; i++) {
                        categProcSocial.push(rd.procsocial[i].index);
                        serieProcSocial.push({
                            y: (rd.procsocial[i].valor != null) ? Number.parseInt(rd.procsocial[i].valor) : 0,
                            nombre: rd.procsocial[i].index
                        });
                    }
                    configGraficas.push({
                        titulo: idioma.es.g8_titulo,
                        tipo: 'pie',
                        series: [{nombre: idioma.es.cantidad, datos: serieProcSocial}],
                        x: {
                            categorias: categProcSocial
                        },
                        y: {}
                    });
                    //Cantidad por programa laboral
                    var categProgLab = new Array();
                    var serieProgLab = new Array();
                    for (var i = 0; i < rd.proglab.length; i++) {
                        categProgLab.push(rd.proglab[i].index);
                        serieProgLab.push({
                            y: (rd.proglab[i].valor != null) ? Number.parseInt(rd.proglab[i].valor) : 0,
                            nombre: rd.proglab[i].index
                        });
                    }
                    configGraficas.push({
                        titulo: idioma.es.g9_titulo,
                        tipo: 'bar',
                        series: [{nombre: idioma.es.cantidad, datos: serieProgLab}],
                        x: {
                            categorias: categProgLab
                        },
                        y: {}
                    });
                    //Cantidad por nivel educacional
                    var categNivelEducacional = new Array();
                    var serieNivelEducacional = new Array();
                    for (var i = 0; i < rd.niveleducacional.length; i++) {
                        categNivelEducacional.push(rd.niveleducacional[i].index);
                        serieNivelEducacional.push({
                            y: (rd.niveleducacional[i].valor != null) ? Number.parseInt(rd.niveleducacional[i].valor) : 0,
                            nombre: rd.niveleducacional[i].index
                        });
                    }
                    configGraficas.push({
                        titulo: 'Trabajadores por nivel educaional',
                        tipo: 'bar',
                        series: [{nombre: idioma.es.cantidad, datos: serieNivelEducacional}],
                        x: {
                            categorias: categNivelEducacional
                        },
                        y: {}
                    });
                    //Cantidad por título
                    var categTitulo = new Array();
                    var serieTitulo = new Array();
                    for (var i = 0; i < rd.titulo.length; i++) {
                        categTitulo.push(rd.titulo[i].index);
                        serieTitulo.push({
                            y: (rd.titulo[i].valor != null) ? Number.parseInt(rd.titulo[i].valor) : 0,
                            nombre: rd.titulo[i].index
                        });
                    }
                    configGraficas.push({
                        titulo: 'Trabajadores por título',
                        tipo: 'bar',
                        series: [{nombre: idioma.es.cantidad, datos: serieTitulo}],
                        x: {
                            categorias: categTitulo
                        },
                        y: {}
                    });

                    var pChart = new PVD.Graficas.Contenedor({config: configGraficas, columnas: 2, idpanel: 'panel_dashboard_ch_ft_analisis'});

                    Ext.getCmp('panel_dashboard_ch_ft_analisis').add(pChart);
                    Ext.getCmp('panel_dashboard_ch_ft_analisis').doLayout();
                }
            });
        }
        cargarDatos();
        function ordenarArrEdades(arr, negativo) {
            var serie = new Array(0,0,0,0,0,0,0,0,0,0);
            for (var i = 0; i < arr.length; i++) {
                if(arr[i].index < 15 && arr[i].index != null)
                    serie[0] += (negativo) ? (0 - Number.parseInt(arr[i].valor)) : Number.parseInt(arr[i].valor);
                if(arr[i].index == 15 || arr[i].index == 16)
                    serie[1] += (negativo) ? (0 - Number.parseInt(arr[i].valor)) : Number.parseInt(arr[i].valor);
                if(arr[i].index >= 17 && arr[i].index <= 19)
                    serie[2] += (negativo) ? (0 - Number.parseInt(arr[i].valor)) : Number.parseInt(arr[i].valor);
                if(arr[i].index >= 20 && arr[i].index <= 29)
                    serie[3] += (negativo) ? (0 - Number.parseInt(arr[i].valor)) : Number.parseInt(arr[i].valor);
                if(arr[i].index >= 30 && arr[i].index <= 39)
                    serie[4] += (negativo) ? (0 - Number.parseInt(arr[i].valor)) : Number.parseInt(arr[i].valor);
                if(arr[i].index >= 40 && arr[i].index <= 59)
                    serie[5] += (negativo) ? (0 - Number.parseInt(arr[i].valor)) : Number.parseInt(arr[i].valor);
                if(arr[i].index >= 60 && arr[i].index <= 64)
                    serie[6] += (negativo) ? (0 - Number.parseInt(arr[i].valor)) : Number.parseInt(arr[i].valor);
                if(arr[i].index >= 65 && arr[i].index <= 69)
                    serie[7] += (negativo) ? (0 - Number.parseInt(arr[i].valor)) : Number.parseInt(arr[i].valor);
                if(arr[i].index >= 70)
                    serie[8] += (negativo) ? (0 - Number.parseInt(arr[i].valor)) : Number.parseInt(arr[i].valor);
                if(Ext.isEmpty(arr[i].index))
                    serie[9] += (negativo) ? (0 - Number.parseInt(arr[i].valor)) : Number.parseInt(arr[i].valor);
            }
            return serie;
        }
        Pvd.MovimientosLaborales.Analisisft.Dashboard.superclass.initComponent.call(this);
    }
});
