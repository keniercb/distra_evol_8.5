/**
 * @name analisisft.CmpResumen - Componente Partes del cuerpo afectadas
 * @package Pvd.SST.Gestionaraccidentes.Analisis
 * @uses Pvd.SST.Gestionaraccidentes.Analisis
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *
 * @version 1.0
 */
Ext.ns('Pvd.SST.Gestionaraccidentes.Analisis');

//Definiendo panel del componente
Pvd.SST.Gestionaraccidentes.Analisis.CmpComportamientoAccidentes = Ext.extend(Ext.Panel, {
    layout: 'fit',
    region: 'center',
    height: '100%',
    closable: true,
    initComponent: function () {
        var self = this;
        var annos = new Array();
        var stgpComportamiento='';
        fnLlenarArregloAnnos();

        this.btnExportarC = new Ext.Button({
            text: 'Exportar',
            tooltip: 'Exportar datos<b>(Alt+E)</b>',
            iconCls: 'exportar',
            disabled: true,
            handler: function () {
                if (this.cbannoiniA.getRawValue() == '' || this.cbannofinA.getRawValue() == '') {
                    mostrarMensaje(8, 'Debe seleccionar los años a mostrar.');
                    return;
                }
                if (this.cbannoiniA.getRawValue() > this.cbannofinA.getRawValue()) {
                    mostrarMensaje(8, 'El año inicio debe ser menor que el año fin .');
                    return;
                }
                else {
                    var params = Ext.urlEncode({
                        idestructura: this.tcbEstructuraOrganizativaComportamiento.getValue(),
                        annoini: this.cbannoiniA.getRawValue(),
                        annofin: this.cbannofinA.getRawValue()
                    });
                    var idIframe = Ext.id();
                    new Ext.Window({
                        title: 'Reporte',
                        width: 800,
                        height: 500,
                        id: 'wincomportamiento',
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
                                '/pvd/sst/accidente/index.php/analisis/obtenerReporteComportamiento?' + params
                            }
                        }
                    }).show();
                    Ext.getCmp('wincomportamiento').maximize();
                }
            }.createDelegate(this)
        });

        /*** Filtros del Reporte ***/
        this.tlEstructura = new Ext.tree.TreeLoader({
            dataUrl: 'obtenerEstructura',
            preloadChildren: false
        });
        this.tcbEstructuraOrganizativaComportamiento = new Ext.components.TreeComboBox({
            allowBlank: true,
            anchor: '100%',
            fieldLabel: 'idioma.lbCargo',
            id: 'tcbEstructuraOrganizativaComportamiento',
            treeConfig: {
                autoScroll: true,
                border: false,
                loader: this.tlEstructura,
                rootVisible: false
            },
            width: 300
        });


        this.stcbannoiniA = new Ext.data.SimpleStore({
            fields: ['idini', 'denominacion'],
            data: annos
        });

        this.cbannoiniA = new Ext.form.ComboBox({
            store: this.stcbannoiniA,
            width: 100,
            displayField: 'denominacion',
            valueField: 'idini',
            hiddenName: 'idini',
            typeAhead: true,
            mode: 'local',
            readOnly: true,
            emptyText: 'Seleccione...',
            forceSelection: true,
            triggerAction: 'all',
            allowBlank: 'false',
            listeners: {
                select: function (num) {
                    this.btnBuscarC.enable();
                    this.btnExportarC.enable();

                }.createDelegate(this)
            }
        });

        this.stcbannofinA = new Ext.data.SimpleStore({
            fields: ['idfin', 'denominacion'],
            data: annos
        });

        this.cbannofinA = new Ext.form.ComboBox({
            store: this.stcbannofinA,
            width: 100,
            displayField: 'denominacion',
            valueField: 'idfin',
            hiddenName: 'idfin',
            typeAhead: true,
            mode: 'local',
            readOnly: true,
            emptyText: 'Seleccione...',
            forceSelection: true,
            triggerAction: 'all',
            allowBlank: 'false',
            listeners: {
                select: function (num) {
                    // this.btnBuscar.enable();

                }.createDelegate(this)
            }
        });


        this.btnBuscarC = new Ext.Button({
            text: 'Buscar',
            tooltip: 'Buscar datos <b>(Alt+B)</b>',
            iconCls: 'buscar',
            disabled: true,
            handler: function () {
                if (this.cbannoiniA.getRawValue() == '' || this.cbannofinA.getRawValue() == '') {
                    mostrarMensaje(8, 'Debe seleccionar los años a mostrar.');
                    return;
                }
                if (this.cbannoiniA.getRawValue() > this.cbannofinA.getRawValue()) {
                    mostrarMensaje(8, 'El año inicio debe ser menor que el año fin .');
                    return;
                }
                else {
                    Ext.Ajax.request({
                        url: 'getDatosComportamiento',
                        params: {
                            idestructura: self.tcbEstructuraOrganizativaComportamiento.getValue(),
                            annoini: this.cbannoiniA.getRawValue(),
                            annofin: this.cbannofinA.getRawValue()
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);

                            if (responseData.cant == 0) {
                                mostrarMensaje(8, 'No hay datos a mostrar en este período .');
                            } else {
                                var field = new Array();
                                var colums = new Array();

                                for (var r in responseData.data[0]) {
                                    if (r == 'Edad') {
                                        field.push({name: r});
                                        colums.push({
                                            header: r, width: 130, dataIndex: r, menuDisabled: true
                                        })
                                    }
                                }

                                for (var r in responseData.data[0]) {
                                    if (r != 'Edad') {
                                        field.push({name: r});   //campos del stores
                                        colums.push({
                                            header: r, width: 50, dataIndex: r, menuDisabled: true, align: 'center'
                                        })
                                    }
                                }
                                var record = new Ext.data.Record.create(field);

                                stgpComportamiento = new Ext.data.Store({
                                    url: 'getDatosComportamiento',
                                    autoLoad: true,
                                    reader: new Ext.data.JsonReader(
                                        {totalProperty: "cant", root: "data"},
                                        field),
                                    baseParams: {
                                        idestructura: self.tcbEstructuraOrganizativaComportamiento.getValue(),
                                        annoini: self.cbannoiniA.getRawValue(),
                                        annofin: self.cbannofinA.getRawValue()
                                    }
                                });

                                var colModel = new Ext.grid.ColumnModel(colums);

                                self.gpComportamiento.reconfigure(stgpComportamiento, colModel);
                                self.gpComportamiento.doLayout();
                            }
                        }
                    });

                }
            }.createDelegate(this)
        });

        this.btnLimpiarC = new Ext.Button({
            text: 'Limpiar',
            tooltip: 'Limpiar filtros <b>(Alt+L)</b>',
            iconCls: 'limpiar',
            handler: function () {
                self.tcbEstructuraOrganizativaComportamiento.setValue('');
                self.tcbEstructuraOrganizativaComportamiento.setRawValue('Seleccione...');
                self.cbannoiniA.setValue('Seleccione...');
                self.cbannofinA.setValue('Seleccione...');
                stgpComportamiento.removeAll();
            }.createDelegate(this)
        });

        /*** Resumen estadístico ***/
        //Store
        stgpComportamiento = new Ext.data.Store({
            url: 'getDatosComportamiento',
            reader: new Ext.data.JsonReader(
                {root: "", id: ""},
                [{name: 'denominacion'}, {name: 'cantidad'}]
            )

        });

        self.gpComportamiento = new Ext.grid.GridPanel({
            tbar: ['Estructura organizativa:', this.tcbEstructuraOrganizativaComportamiento, 'Año inicial:', this.cbannoiniA, 'Año final:', this.cbannofinA, this.btnBuscarC, this.btnLimpiarC, self.btnExportarC],
            store: stgpComportamiento,
            loadMask: {msg: 'Cargando...'},
            columns: [
                {dataIndex: 'denominacion', header: 'Denominación', width: 200},
                {dataIndex: 'cantidad', header: 'Cantidad', width: 100},
            ],
            keys:[
                {
                    key: 'b',
                    alt: true,
                    // stopEvent: true,
                    fn: function () {
                        if (!self.btnBuscarC.disabled) {
                            self.btnBuscarC.handler();
                        }
                    }
                },
                {
                    key: 'l',
                    alt: true,
                    // stopEvent: true,
                    fn: function () {
                        if (!self.btnLimpiarC.disabled) {
                            self.btnLimpiarC.handler();
                        }
                    }
                },
                {
                    key: 'e',
                    alt: true,
                    // stopEvent: true,
                    fn: function () {
                        if (!self.btnExportarC.disabled) {
                            self.btnExportarC.handler();
                        }
                    }
                }
            ]
        });

        function fnLlenarArregloAnnos() {
            for (var i = 0; i <= 100; i++) {
                annos.push([i, i + 2000]);
            }
        }

        /*    function pintarNegrita(val, metaData, record, rowIndex, colIndex, store) {
                if (record.data.encabezado == 1) {
                    return "<b>" + val + "</b>";
                }
                return val;
            }*/

        self.items = [self.gpComportamiento];
        Pvd.SST.Gestionaraccidentes.Analisis.CmpComportamientoAccidentes.superclass.initComponent.call(this);
    }
});
