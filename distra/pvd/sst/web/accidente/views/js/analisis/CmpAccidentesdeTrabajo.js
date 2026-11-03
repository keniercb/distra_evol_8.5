/**
 * @name analisisft.CmpResumen - Componente Datos accidentes.
 * @package Pvd.SST.Gestionaraccidentes.Analisis
 * @uses Pvd.SST.Gestionaraccidentes.Analisis
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *
 * @version 1.0
 */
Ext.ns('Pvd.SST.Gestionaraccidentes.Analisis');

//Definiendo panel del componente
Pvd.SST.Gestionaraccidentes.Analisis.CmpAccidentes = Ext.extend(Ext.Panel, {
    // id: 'panelResumen',
    layout: 'fit',
    region: 'center',
    height: '100%',
    closable: true,
    initComponent: function () {
        var self = this;
      this.btnExportar = new Ext.Button({
            text: 'Exportar',
            iconCls: 'exportar',
            handler: function () {
                var params = Ext.urlEncode({
                    idestructura: this.tcbEstructuraOrganizativaAcci.getValue()
                });

                var idIframe = Ext.id();
                new Ext.Window({
                    title: 'Reporte',
                    width: 800,
                    height: 500,
                    id: 'winaccidentes',
                    maskDisabled: false,
                    animCollapse: false,
                    maximizable: true,
                    constrain: true,
                    border: false,
                    modal: true,
                    items: {
                        xtype: 'component',
                        autoEl: {
                            tag: 'iframe',
                            id: idIframe,
                            style: 'height: 100%; width: 100%; border: none',
                            src: document.location.protocol + '//' + document.location.host +
                            '/pvd/sst/accidente/index.php/analisis/obtenerReporteAccidentes?' + params
                        }
                    }
                }).show();
                Ext.getCmp('winaccidentes').maximize();
             /*   PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte');
                document.getElementById(idIframe).onload = function () {
                    PVD.ocultarMascara('rep01');
                }*/
            }.createDelegate(this)
        });

        /*** Filtros del Reporte ***/
       this.tlEstructura = new Ext.tree.TreeLoader({
            dataUrl: 'obtenerEstructura',
            preloadChildren: false
        });
        this.tcbEstructuraOrganizativaAcci = new Ext.components.TreeComboBox({
            allowBlank: true,
            anchor: '100%',
            fieldLabel: 'idioma.lbCargo',
            id: 'tcbEstructuraOrganizativaAcci',
            treeConfig: {
                autoScroll: true,
                border: false,
                loader: this.tlEstructura,
                rootVisible: false
            },
            width: 400
        });

        this.btnBuscarD = new Ext.Button({
            text: 'Buscar',
            iconCls: 'buscar',
           handler: function () {
                self.stgpAccidentes.load({
                    params: {
                        idestructura: self.tcbEstructuraOrganizativaAcci.getValue()
                    }
                });
            }.createDelegate(this)
        });

     this.btnLimpiarD = new Ext.Button({
            text: 'Limpiar',
            iconCls: 'limpiar',
            handler: function () {
                self.tcbEstructuraOrganizativaAcci.setRawValue('');
                self.stgpAccidentes.load();
            }.createDelegate(this)
        });

        /*** Resumen estadístico ***/
        //Store
        self.stgpAccidentes = new Ext.data.GroupingStore({
            url: 'getDatosAccidentes',
            reader: new Ext.data.JsonReader(
                {root: "", id: ""},
                [{name: 'padre'}, {name: 'denominacion'}, {name: 'cantidad'}]
            ),
            sortInfo: {
                field: 'padre',
                direction: "ASC"
            },
            groupField: 'padre'
        });
          self.stgpAccidentes.load(); //Cargando datos

        self.gpAccidentes = new Ext.grid.GridPanel({
            tbar: ['Estructura organizativa:', this.tcbEstructuraOrganizativaAcci, this.btnBuscarD, this.btnLimpiarD, self.btnExportar],
            store: self.stgpAccidentes,
            loadMask: {msg: 'Cargando...'},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group}'
            }),
            columns: [
                {dataIndex: 'padre', hidden: true},
                {dataIndex: 'denominacion', header: 'Denominación', width: 200},
                {dataIndex: 'cantidad', header: 'Cantidad', width: 100},
            ]
        });

        /*    function pintarNegrita(val, metaData, record, rowIndex, colIndex, store) {
                if (record.data.encabezado == 1) {
                    return "<b>" + val + "</b>";
                }
                return val;
            }*/

        self.items = [self.gpAccidentes];
        Pvd.SST.Gestionaraccidentes.Analisis.CmpAccidentes.superclass.initComponent.call(this);
    }
});
