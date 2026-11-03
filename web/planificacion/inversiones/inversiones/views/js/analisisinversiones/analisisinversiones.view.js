/*analisisinversiones.view.js
 * Vista para analisis
 * @author: Yosniel Montes de Oca González
 * @package: Plataforma Integral de Planificacion
 * @subpackage:
 * @copyright: 
 * @version: 1.0-0
 */
Ext.ns('Gestionar.analisisinversiones');
//var perfil = eval(uneval(window.parent.UCID.portal.perfil));
var perfil = window.parent.UCID.portal.perfil;

Gestionar.analisisinversiones.Vista = {
    init: function (idioma, modelo) {
        _this = this;
        _this.entidadSeleccionada = null;
        //this.idioma = idioma;
        _this.comps = ExtExtend.Components;

        _this.btnAyudaAnalisisInversion = new Ext.Button({
            text: idioma.btnAyuda,
            tooltip: 'idioma.btnAyudatoll',
            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'btn',
            id: 'btnAyudainversion'
        });

        _this.cmbEjercicio = new Ext.form.ComboBox({
            emptyText: idioma.tlSeleccione,
            width: 90,
            id: 'idejercicio',
            store: modelo.stCbejercicio,
            displayField: 'ejercicio',
            valueField: 'idejercicio',
            typeAhead: true,
            mode: 'local',
            disabled: false,
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '95%',
            loadingText: 'Cargando...',
            allowBlank: false
        });

        _this.btnExportarResultadoImagen = new _this.comps.buttons.btnExportar({
            text: '',
            iconCls: 'icondistra-exportar',
            tooltip: 'Exportar resultado',
            handler: function () {
                var html = document.getElementById('controlejecucion');
                this.GraficasB = new Utilidades.Cmp.CmpGrafica({
                    idioma: idioma,
                    ejercicio: _this.cmbEjercicio.getRawValue(),
                    idejercicio: _this.cmbEjercicio.getValue(),
                    idCmp: 'graficador',
                    nodeEntidad: _this.entidadSeleccionada
                });

                _this.pGraficasB = this.GraficasB.panelGraficas();
                _this.btnExportarResultado = new _this.comps.buttons.btnExportar({
                    text: '',
                    iconCls: 'icondistra-exportar',
                    tooltip: 'Exportar resultado',
                    handler: function () {
                        _this.exportarImagen({id: 'winGraficador'});
                    }
                });
                this.panelGraficador = new Ext.Panel({
                    //layout: 'border',
                    width: '100%',
                    bodyBorder: false,
                    id: 'panelGraficador',
                    region: 'center',
                    html: html.outerHTML,
                    tbar: ['->', _this.btnExportarResultado],
                    //items: [_this.pGraficasB]
                });
                var win = new Ext.Window({
                    id: 'winGraficador',
                    constraint: true,
                    width: 1703, height: 880,
                    maximizable: true,
                    resizable: true,
                    title: 'Graficador',
                    layout: 'border',
                    items: [this.panelGraficador],
                    collapsible: true
                });
                win.on('show', function (p) {
                    p.doLayout();
                });
                win.show();


                //_this.exportarImagen({id: _this.pGraficas.getActiveTab().id});
            }
        });
        //----------------------Tree Panel Organismos----------------------------------------
        _this.treePanelinversion = new Ext.tree.TreePanel({
            title: idioma.tlOrganismos,
            border: true,
//            region: 'center',
            region: 'west',
            split: true,
            width: 210,
            height: 300,
            collapsible: true,
            rootVisible: false,
            autoScroll: true,
            loader: modelo.loaderTreeinversiones,
            tbar: [{
                iconCls: 'icon-expand-all',
                tooltip: idioma.tlExpandir,
                icon: perfil.dirImg + 'expand-all.gif',
                handler: function () {
                    Gestionar.inversiones.Vista.treePanelinversion.root.expand(true);
                }
            }, {
                iconCls: 'icon-collapse-all',
                tooltip: idioma.tlColapsar,
                icon: perfil.dirImg + 'collapse-all.gif',
                handler: function () {
                    Gestionar.inversiones.Vista.treePanelinversion.root.collapse(true);
                }
            }, {
                iconCls: 'icon-collapse-all',
                tooltip: idioma.tlRefrescar,
                icon: perfil.dirImg + 'table_refresh.png',
                handler: function () {
                    Gestionar.inversiones.Vista.treePanelinversion.root.reload();
                }
            }, '-', {
                xtype: 'textfield',
                emptyText: 'Filtrar entidad...',
                width: 90,
                id: 'idfiltroent'
            }
            ],
            root: {
                text: 'Estructuras',
                expanded: true,
                id: '0'
            }
        });

        this.Graficas = new Utilidades.Cmp.CmpGrafica({
            idioma: idioma,
            ejercicio: _this.cmbEjercicio.getRawValue(),
            idejercicio: _this.cmbEjercicio.getValue(),
            nodeEntidad: this.entidadSeleccionada

        });

        _this.pGraficas = this.Graficas.panelGraficas();
        _this.pGeneral = new Ext.Panel({
            scope: this,
            layout: 'border',
            border: false,
            width: 200,
            tbar: ['->', 'Ejercicio:', _this.cmbEjercicio, '-', _this.btnExportarResultadoImagen, '->', _this.btnAyudaAnalisisInversion],
            items: [_this.treePanelinversion, _this.pGraficas]
        });


        _this.view = new Ext.Viewport({
            layout: 'fit',
            items: [_this.pGeneral]
        });
    },
    exportarImagen: function (obj) {
        var me = this;
        var chart = document.getElementById('highcharts-' + 0);
        var svg = [];
        var canvas = [];
        var anexos = [];
        if (chart) {
            var nodes = chart.firstChild.childNodes;
            console.log(nodes)
            Ext.each(nodes, function (n) {
                console.log(n)
                if (n.nodeName != 'CANVAS') {
                    if (n.attributes.length > 1 && n.firstChild)
                        svg.push(n.firstChild.innerHTML);
                } else canvas.push(n.toDataURL())
            });
            anexos.push({
                type: svg.length ? 'svg' : 'canvas',
                content: svg.length ? svg : canvas
            });
        }
        var windexportar = new Planificacion.Integracion.ExportarWindowImage({
            controller: me.controller,
            idImage: obj.id,
            closable: true,
            flujo: true,
            matrix: me
        });
        windexportar.show();
    }
};
