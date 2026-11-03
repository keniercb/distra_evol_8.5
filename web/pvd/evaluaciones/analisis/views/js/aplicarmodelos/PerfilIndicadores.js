/**
 * Interfaz para mostrar perfil de indicadores del recurso evaluado*
 *
 * @author Ing. Javier Rodriguez Lopez*
 * @package PVD *
 * @subpackage Evaluaciones *
 */

Ext.ns("Ext.PVD.Evaluaciones.Analisis");
Ext.PVD.Evaluaciones.Analisis.PerfilIndicadores = Ext.extend(Ext.Window, {
    layout: 'border',
    title: 'Perfil de indicadores',
    initComponent: function() {
        var self = this;

        var btnExpandAllNodes = new Ext.Button({
            tooltip: 'Expandir todos los nodos',
            iconCls: 'expand',
            handler: function() {
                self.tpPlanilla.expandAll();
            }
        });
        var btnColapseAllNodes = new Ext.Button({
            tooltip: 'Recojer todos los nodos',
            iconCls: 'collapse',
            handler: function() {
                self.tpPlanilla.collapseAll();
            }
        });

        var btnGraficar = new Ext.Button({
            text: self.labels.lbBtnGraficar,
            tooltip: self.labels.ttpBtnGraficar,
            iconCls: 'chart-bar',
            handler: function() {
                graficar();
            }
        });

        var stTipoGrafica = new Ext.data.SimpleStore({
            fields: ['tipo', 'denom'],
            data: [['lines', 'Lineal'], ['bars', 'Barras']]
        });

        var cbTipoGrafica = new Ext.form.ComboBox({
            width: 90,
            store: stTipoGrafica,
            displayField: 'denom',
            valueField: 'tipo',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true
        });
        cbTipoGrafica.setValue('bars');

        var tlIndicadores = new Ext.tree.TreeLoader({
            dataUrl: 'cargarPlanilla',
            preloadChildren: true,
            baseParams: {
                idplanilla: self.idplanilla,
                idnodo: -1
            },
            listeners: {
                beforeload: function(cargadorIndicadores, node, response) {
                    if (node.id == 'raizPlanilla') {
                        cargadorIndicadores.baseParams.idnodo = node.id;
                        cargadorIndicadores.baseParams.idplanilla = self.idplanilla;
                    }
                    else {
                        cargadorIndicadores.baseParams.idplanilla = self.idplanilla;
                        cargadorIndicadores.baseParams.idnodo = node.id;
                    }
                },
                load: function(cargadorIndicadores, node, response) {
                    node.expand(true, true);
                }
            }
        });
        var kmIndicador = [{
                key: 'g',
                alt: true,
                fn: function() {
                    btnGraficar.handler();
                }
            }];

        this.tpPlanilla = new Ext.tree.TreePanel({
            region: 'west',
            title: 'Planilla evaluativa',
            animate: true,
            containerScroll: true,
            autoScroll: true,
            rootVisible: false,
            collapsible: true,
            split: true,
            minWidth: 100,
            margins: '5 0 5 5',
            cmargins: '5 0 5 5',
            width: '35%',
            layout: 'fit',
            loader: tlIndicadores,
            keys: kmIndicador,
            tbar: ['Seleccione:', cbTipoGrafica, ' ', btnGraficar, '->', btnExpandAllNodes, btnColapseAllNodes],
            root: {
                text: 'Raiz',
                id: 'raizPlanilla'
            }
        });

        this.pChart = new Ext.Panel({
            region: 'center',
            width: '68%',
            margins: '5 5 5 0',
            layout: 'fit',
            html: '<div id="container' + self.id + '" style="float:left;width:95%; height:90%;"></div>'
        });

        this.items = [this.tpPlanilla, this.pChart];
        Ext.PVD.Evaluaciones.Analisis.PerfilIndicadores.superclass.initComponent.call(this);

        function graficar() {

            var arrNodos = self.tpPlanilla.getChecked();
            if (arrNodos.length > 0) {
                var tipoGrafica = cbTipoGrafica.getValue();
                var ticks = new Array();
                var arrIds = new Array();
                //Se prepara la columna y que muestra los nombres de los indicadores
                for (var i = 0; i < arrNodos.length; i++) {
                    var aux = [i + 1, arrNodos[i].text];
                    arrIds[i] = parseInt(arrNodos[i].id);
                    ticks.push(aux)
                }
                var arrIdpersonaevaluacion = new Array();
                Ext.each(self.personas, function(record) {
                    arrIdpersonaevaluacion.push(record.get('idpersonaevaluacion'));
                }, this);

                //PVD.mostrarMascara('loadresultados', self.labels.lbMsgWait, self.labels.lbMsgLoadindResultados);
                Ext.Ajax.request({
                    url: 'getserie',
                    method: 'POST',
                    params: {
                        arrInd: Ext.encode(arrIds),
                        arrIdpersonaevaluacion: Ext.encode(arrIdpersonaevaluacion)
                    },
                    callback: function(options, success, response) {
                        var result = Ext.util.JSON.decode(response.responseText);

                        Ext.each(self.personas, function(persona) {
                            Ext.each(result, function(serie) {
                                if (persona.get('idpersonaevaluacion') == serie.idpersonaevaluacion) {
                                    serie.label = persona.get('nombre');
                                    if (persona.get('snombre')) {
                                        serie.label += ' ' + persona.get('snombre');
                                    }
                                    serie.label += ' ' + persona.get('papel') + ' ' + persona.get('sapel');
                                    serie.idpersona = persona.get('idpersona');
                                    serie.numid = persona.get('numid');
                                    serie.extensionFoto = persona.get('extension');
                                }
                            }, this);
                        }, this);
                        console.info(result);
                        console.info(ticks);
                        $.plot($('#container' + self.id), result, {
                            series: {
                                stack: false,
//                                lines: {
//                                 show: true,
//                                 fill: true,
//                                 steps: steps
//                                 },
                                bars: {
                                    show: true,
                                    barWidth: 0.6,
                                    align: 'center',
                                    horizontal: true
                                }
                            },
                            grid: {
                                hoverable: true
                            },
                            xaxis: {
                                label: 'Evaluaci&oacute;n',
                                min: 0
                            },
                            yaxis: {
                                label: 'Indicadores',
                                ticks: ticks
                            },
                            tooltip: true,
                            tooltipOpts: {
                                /*content: function(xval, yval) {
                                    return xval;
                                },*/
                                onHover: function(flotItem, $tooltipEl) {
                                    var srcFoto = '../../../../repositorio_persona/persona/personaimgs/'+flotItem.series.idpersona+flotItem.series.extensionFoto;
                                    var html = '<table width="90%" border="0" cellspacing="0" cellpadding="1" style="text-align: center; font-size: 11px">' +
                                            '<tr>' +
                                            '<td>' +
                                            '<table width="100%" border="0" cellspacing="0" cellpadding="4">' +
                                            '<tr>' +
                                            '<td width="10%" style="text-align: center; vertical-align: top">' +
                                            '<img src="' + srcFoto + '" width="90" height="90" border="0" style="padding-right: 4px;padding-bottom: 3px">' +
                                            '</td>' +
                                            '<td style="vertical-align: top; font: normal 11.5px arial, tahoma, helvetica, sans-serif;">' +
                                            'No. identidad: ' + flotItem.series.numid + '<br />' +
                                            flotItem.series.label + '<br />' +
                                            'Calificacion: ' + flotItem.datapoint[0] +
                                            '</td>' +
                                            '</tr>' +
                                            '</table>' +
                                            '</td>' +
                                            '</tr></table>';
                                    console.info(arguments);
                                    $($tooltipEl).html(html);
                                    $($tooltipEl).css('border-color', '#6593CF');
                                    $($tooltipEl).css('background-color', '#C3DAF9');
                                }
                            }
                        });

                        //PVD.ocultarMascara('loadresultados');
                    }
                });
            }
            else {
                Ext.MessageBox.show({
                    title: 'Informaci&oacute;n',
                    msg: 'Debe seleccionar al menos un indicador.',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            }
        }
    }
});
