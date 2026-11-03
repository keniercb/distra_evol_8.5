/**
 * @name analisisft.CmpResumen - Componente Principales Indicadores.
 * @package Pvd.SST.Gestionaraccidentes.Analisis
 * @uses Pvd.SST.Gestionaraccidentes.Analisis
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *
 * @version 1.0
 */
Ext.ns('Pvd.SST.Gestionaraccidentes.Analisis');


//Definiendo panel del componente
Pvd.SST.Gestionaraccidentes.Analisis.Cmp = Ext.extend(Ext.Panel, {
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
                    idestructura: this.tcbEstructuraOrganizativa.getValue(),
                    trimestre: this.cbtrimestre.getValue()
                });

                var idIframe = Ext.id();

                new Ext.Window({
                    title: 'Reporte',
                    width: 800,
                    height: 500,
                    id: 'winregistro',
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
                            '/pvd/sst/accidente/index.php/analisis/obtenerReporte?' + params
                        }
                    }
                }).show();
                Ext.getCmp('winregistro').maximize();
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

        this.stcbtrimestre = new Ext.data.SimpleStore({
            fields: ['id', 'denominacion'],
            data: [
                [1, ' Marzo'],
                [2, ' Junio'],
                [3, 'Septiembre'],
                [4, 'Diciembre'],
            ]
        });

        this.cbtrimestre = new Ext.form.ComboBox({
            store: this.stcbtrimestre,
            width: 100,
            displayField: 'denominacion',
            valueField: 'id',
            hiddenName: 'id',
            typeAhead: true,
            mode: 'local',
            readOnly: true,
            emptyText: 'Seleccione...',
            forceSelection: true,
            triggerAction: 'all',
            allowBlank:'false',
            listeners: {
                select: function (num) {
                    this.btnBuscar.enable();

                }.createDelegate(this)
            }
        });


        this.btnBuscar = new Ext.Button({
            text: 'Buscar',
            iconCls: 'buscar',
            handler: function () {
                self.stgpIndicadores.load({
                    params: {
                        idestructura: self.tcbEstructuraOrganizativa.getValue(),
                        trimestre: self.cbtrimestre.getValue()
                    }
                });
            }.createDelegate(this),
            disabled:true
        });

        this.btnLimpiar = new Ext.Button({
            text: 'Limpiar',
            iconCls: 'limpiar',
            handler: function () {
                self.tcbEstructuraOrganizativa.setRawValue('');
                self.cbtrimestre.setValue('');
                self.stgpIndicadores.removeAll();
                self.btnBuscar.setDisabled(true);
            }.createDelegate(this)

        });

        /*** Resumen estadístico ***/
        //Store
        self.stgpIndicadores = new Ext.data.GroupingStore({
            url: 'getPrincipalesIndicadores',
            reader: new Ext.data.JsonReader(
                {root: "", id: ""},
                [{name: 'agrupador'}, {name: 'no'}, {name: 'indicadores'}, {name: 'cant'}, {name: 'encabezado'}, {name: 'orden'}]
            ),
            sortInfo: {
                field: 'orden',
                direction: "ASC"
            },
            groupField: 'agrupador'
        });
       // self.stgpIndicadores.load(); //Cargando datos

        self.gpIndicadores = new Ext.grid.GridPanel({
            tbar: ['Estructura organizativa:', this.tcbEstructuraOrganizativa, 'Trimestre:', this.cbtrimestre, this.btnBuscar, this.btnLimpiar, self.btnExportar],
            store: self.stgpIndicadores,
            loadMask: {msg: 'Cargando...'},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group}'
            }),
            columns: [
                {dataIndex: 'agrupador', hidden: true},
                {dataIndex: 'orden', hidden: true},
                {dataIndex: 'no', header: 'No.indicador', width: 40, renderer: pintarNegrita},
                {dataIndex: 'indicadores', header: 'Indicadores', width: 150, renderer: pintarNegrita},
                {dataIndex: 'cant', header: 'Cantidad', width: 100, renderer: pintarNegrita},
            ]
        });

        function pintarNegrita(val, metaData, record, rowIndex, colIndex, store) {
            if (record.data.encabezado == 1) {
                return "<b>" + val + "</b>";
            }
            return val;
        }

        self.items = [self.gpIndicadores];
        Pvd.SST.Gestionaraccidentes.Analisis.Cmp.superclass.initComponent.call(this);
    }
});
