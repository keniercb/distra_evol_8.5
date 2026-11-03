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
Pvd.SST.Gestionaraccidentes.Analisis.CmpAccAtendiendoIncapacidad = Ext.extend(Ext.Panel, {
    layout: 'fit',
    region: 'center',
    height: '100%',
    closable: true,
    initComponent: function () {
        var self = this;
        var annos = new Array();
        fnLlenarArregloAnnos();

        this.btnExportarC = new Ext.Button({
            text: 'Exportar',
            tooltip: 'Exportar datos<b>(Alt+E)</b>',
            iconCls: 'exportar',
            disabled: true,
            handler: function () {
                if (this.cbannoiniI.getRawValue() == '' || this.cbannofinI.getRawValue() == '') {
                    mostrarMensaje(8, 'Debe seleccionar los años a mostrar.');
                } else {
                    var params = Ext.urlEncode({
                        idestructura: this.tcbEstructuraOrganizativaIncapacidad.getValue(),
                        incapacidad:this.cbincapacidad.getValue(),
                        annoini: this.cbannoiniI.getRawValue(),
                        annofin: this.cbannofinI.getRawValue()
                    });
                    var idIframe = Ext.id();
                    new Ext.Window({
                        title: 'Reporte',
                        width: 800,
                        height: 500,
                        id: 'winincapacidad',
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
                                '/pvd/sst/accidente/index.php/analisis/obtenerReporteClaseIncapacidad?' + params
                            }
                        }
                    }).show();
                    Ext.getCmp('winincapacidad').maximize();
                }
            }.createDelegate(this)
        });

        /*** Filtros del Reporte ***/
        this.tlEstructura = new Ext.tree.TreeLoader({
            dataUrl: 'obtenerEstructura',
            preloadChildren: false
        });
        
        this.tcbEstructuraOrganizativaIncapacidad = new Ext.components.TreeComboBox({
            allowBlank: true,
            anchor: '100%',
            fieldLabel: 'idioma.lbCargo',
            id: 'tcbEstructuraOrganizativaIncapacidad',
            treeConfig: {
                autoScroll: true,
                border: false,
                loader: this.tlEstructura,
                rootVisible: false
            },
            width: 300
        });

        this.stcbincapacidad = new Ext.data.Store({
            url: 'getIncapacidadesActivas',
            reader: new Ext.data.JsonReader(
                {root: "", id: ""},
                [{name: 'idtipoinvalidez'}, {name: 'denominacion'}]
            )
        });
        this.stcbincapacidad.load();

        this.cbincapacidad = new Ext.form.MultiComboSelect({
            //  id: 'cbincapacidad',
            store: this.stcbincapacidad,
            width: 150,
            displayField: 'denominacion',
            valueField: 'idtipoinvalidez',
            hiddenName: 'idtipoinvalidez',
            typeAhead: true,
            mode: 'local',
            //hideOnSelect: false,
            readOnly: false,
            emptyText: 'Seleccione...',
            // forceSelection: true,
            triggerAction: 'all',
            allowBlank: 'false',
            editable: false,
            listeners: {
                select: function (num) {

                }.createDelegate(this)
            }
        });


        this.stcbannoiniI = new Ext.data.SimpleStore({
            fields: ['idini', 'denominacion'],
            data: annos
        });

        this.cbannoiniI = new Ext.form.ComboBox({
            store: this.stcbannoiniI,
            width: 60,
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

        this.stcbannofinI = new Ext.data.SimpleStore({
            fields: ['idfin', 'denominacion'],
            data: annos
        });

        this.cbannofinI = new Ext.form.ComboBox({
            store: this.stcbannofinI,
            width: 60,
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
                if (this.cbannoiniI.getRawValue() == '' || this.cbannofinI.getRawValue() == '') {
                    mostrarMensaje(8, 'Debe seleccionar los años a mostrar.');
                }
                if (this.cbannoiniI.getRawValue() > this.cbannofinI.getRawValue()) {
                    mostrarMensaje(8, 'El año inicio debe ser mayor que el año fin .');
                }
                else {
                    Ext.Ajax.request({
                        url: 'getDatosIncapacidad',
                        params: {
                            idestructura: self.tcbEstructuraOrganizativaIncapacidad.getValue(),
                            incapacidad:this.cbincapacidad.getValue(),
                            annoini: this.cbannoiniI.getRawValue(),
                            annofin: this.cbannofinI.getRawValue()
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);

                            if (responseData.cant == 0) {
                                mostrarMensaje(8, 'No hay datos a mostrar en este período .');
                            } else {
                                var field = new Array();
                                var colums = new Array();

                                for (var r in responseData.data[0]) {
                                    if (r == 'Clase de incapacidad') {
                                        field.push({name: r});
                                        colums.push({
                                            header: r, width: 130, dataIndex: r, menuDisabled: true
                                        })
                                    }
                                }

                                for (var r in responseData.data[0]) {
                                    if (r != 'Clase de incapacidad') {
                                        field.push({name: r});   //campos del stores
                                        colums.push({
                                            header: r, width: 50, dataIndex: r, menuDisabled: true, align: 'center'
                                        })
                                    }
                                }
                                var record = new Ext.data.Record.create(field);

                                var stgpIncapacidad = new Ext.data.Store({
                                    url: 'getDatosIncapacidad',
                                    autoLoad: true,
                                    reader: new Ext.data.JsonReader(
                                        {totalProperty: "cant", root: "data"},
                                        field),
                                    baseParams: {
                                        idestructura: self.tcbEstructuraOrganizativaIncapacidad.getValue(),
                                        incapacidad:self.cbincapacidad.getValue(),
                                        annoini: self.cbannoiniI.getRawValue(),
                                        annofin: self.cbannofinI.getRawValue()
                                    }
                                });

                                var colModel = new Ext.grid.ColumnModel(colums);

                                self.gpIncapacidad.reconfigure(stgpIncapacidad, colModel);
                                self.gpIncapacidad.doLayout();
                            }
                        }
                    });

                }
            }.createDelegate(this)
        });

        this.btnLimpiarInc = new Ext.Button({
            text: 'Limpiar',
            tooltip: 'Limpiar filtros <b>(Alt+L)</b>',
            iconCls: 'limpiar',
            handler: function () {
                self.tcbEstructuraOrganizativaIncapacidad.setValue('');
                self.tcbEstructuraOrganizativaIncapacidad.setRawValue('Seleccione...');
                self.cbincapacidad.clearValue();
                self.cbannoiniI.setValue('Seleccione...');
                self.cbannofinI.setValue('Seleccione...');
            }.createDelegate(this)
        });

        /*** Resumen estadístico ***/
        //Store
        self.stgpIncapacidad = new Ext.data.Store({
            url: 'getDatosIncapacidad',
            reader: new Ext.data.JsonReader(
                {root: "", id: ""},
                [{name: 'denominacion'}, {name: 'cantidad'}]
            )

        });

        self.gpIncapacidad = new Ext.grid.GridPanel({
            tbar: ['Estructura organizativa:', this.tcbEstructuraOrganizativaIncapacidad,'Incapacidad:',this.cbincapacidad, 'Año inicial:', this.cbannoiniI, 'Año final:', this.cbannofinI, this.btnBuscarC, this.btnLimpiarInc, self.btnExportarC],
            store: self.stgpIncapacidad,
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
                        if (!self.btnLimpiarInc.disabled) {
                            self.btnLimpiarInc.handler();
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

        self.items = [self.gpIncapacidad];
        Pvd.SST.Gestionaraccidentes.Analisis.CmpAccAtendiendoIncapacidad.superclass.initComponent.call(this);
    }
});
