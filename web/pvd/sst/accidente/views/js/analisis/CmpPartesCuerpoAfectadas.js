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
Pvd.SST.Gestionaraccidentes.Analisis.CmpPartesCuerpoAfectadas = Ext.extend(Ext.Panel, {
    // id: 'panelResumen',
    layout: 'fit',
    region: 'center',
    height: '100%',
    closable: true,
    autoScroll: true,
    initComponent: function () {
        var self = this;
        var annos = new Array();
        var stgpPartes='';
        fnLlenarArregloAnnos();

        this.btnExportarD = new Ext.Button({
            text: 'Exportar',
            tooltip: 'Exportar datos<b>(Alt+E)</b>',
            disabled: true,
            iconCls: 'exportar',
            handler: function () {
                if (this.cbannoini.getRawValue() == '' || this.cbannofin.getRawValue() == '') {
                    mostrarMensaje(8, 'Debe seleccionar los años a mostrar.');
                    return;
                }
                if (this.cbannoini.getRawValue() > this.cbannofin.getRawValue()) {
                    mostrarMensaje(8, 'El año inicio debe ser menor que el año fin .');
                    return;
                }
                else {
                    var params = Ext.urlEncode({
                        idestructura: this.tcbEstructuraOrganizativaPartes.getValue(),
                        partes: this.cbpartes.getValue(),
                        annoini: this.cbannoini.getRawValue(),
                        annofin: this.cbannofin.getRawValue()
                    });

                    var idIframe = Ext.id();
                    new Ext.Window({
                        title: 'Reporte',
                        width: 800,
                        height: 500,
                        id: 'winpartes',
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
                                '/pvd/sst/accidente/index.php/analisis/obtenerReporteParteAfectadas?' + params
                            }
                        }
                    }).show();
                    this.cbpartes.setValue('');
                    Ext.getCmp('winpartes').maximize();
                }
            }.createDelegate(this)
        });

        /*** Filtros del Reporte ***/
        this.tlEstructura = new Ext.tree.TreeLoader({
            dataUrl: 'obtenerEstructura',
            preloadChildren: false
        });
        this.tcbEstructuraOrganizativaPartes = new Ext.components.TreeComboBox({
            allowBlank: true,
            anchor: '100%',
            emptyText: 'Seleccione...',
            fieldLabel: 'idioma.lbCargo',
            id: 'tcbEstructuraOrganizativaPartes',
            treeConfig: {
                autoScroll: true,
                border: false,
                loader: this.tlEstructura,
                rootVisible: false
            },
            width: 200
        });

        this.stcbpartes = new Ext.data.Store({
            url: 'getPartesActivas',
            reader: new Ext.data.JsonReader(
                {root: "", id: ""},
                [{name: 'idpartecuerpo'}, {name: 'denominacion'}]
            )
        });
        this.stcbpartes.load();

        this.cbpartes = new Ext.form.MultiComboSelect({
            //  id: 'cbpartes',
            store: this.stcbpartes,
            width: 150,
            displayField: 'denominacion',
            valueField: 'idpartecuerpo',
            hiddenName: 'idpartecuerpo',
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

        this.stcbannoini = new Ext.data.SimpleStore({
            fields: ['idini', 'denominacion'],
            data: annos
        });

        this.cbannoini = new Ext.form.ComboBox({
            store: this.stcbannoini,
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
                    this.btnBuscarD.enable();
                    this.btnExportarD.enable();
                }.createDelegate(this)
            }
        });

        this.stcbannofin = new Ext.data.SimpleStore({
            fields: ['idfin', 'denominacion'],
            data: annos
        });

        this.cbannofin = new Ext.form.ComboBox({
            store: this.stcbannofin,
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

                }.createDelegate(this)
            }
        });


        this.btnBuscarD = new Ext.Button({
            text: 'Buscar',
            tooltip: 'Buscar datos <b>(Alt+B)</b>',
            iconCls: 'buscar',
            disabled: true,
            handler: function () {
                if (this.cbannoini.getRawValue() == '' || this.cbannofin.getRawValue() == '') {
                    mostrarMensaje(8, 'Debe seleccionar los años a mostrar.');
                    return;
                }
                if (this.cbannoini.getRawValue() > this.cbannofin.getRawValue()) {
                    mostrarMensaje(8, 'El año inicio debe ser menor que el año fin .');
                    return;
                }
                else {
                    Ext.Ajax.request({
                        url: 'getDatosPartesAfectadas',
                        params: {
                            idestructura: self.tcbEstructuraOrganizativaPartes.getValue(),
                            partes: this.cbpartes.getValue(),
                            annoini: this.cbannoini.getRawValue(),
                            annofin: this.cbannofin.getRawValue()
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);

                            if (responseData.cant == 0) {
                                mostrarMensaje(8, 'No hay datos a mostrar en este período .');
                            } else {
                                var field = new Array();
                                var colums = new Array();

                                for (var r in responseData.data[0]) {
                                    if (r == 'Denominación') {
                                        field.push({name: r});
                                        colums.push({
                                            header: r, width: 350, dataIndex: r, menuDisabled: true
                                        })
                                    }
                                }

                                for (var r in responseData.data[0]) {
                                    if (r != 'Denominación') {
                                        field.push({name: r});   //campos del stores
                                        colums.push({
                                            header: r, width: 50, dataIndex: r, menuDisabled: true, align: 'center'
                                        })
                                    }
                                }

                                var record = new Ext.data.Record.create(field);

                                stgpPartes = new Ext.data.Store({
                                    url: 'getDatosPartesAfectadas',
                                    autoLoad: true,
                                    reader: new Ext.data.JsonReader(
                                        {totalProperty: "cant", root: "data"},
                                        field),
                                    baseParams: {
                                        idestructura: self.tcbEstructuraOrganizativaPartes.getValue(),
                                        partes: self.cbpartes.getValue(),
                                        annoini: self.cbannoini.getRawValue(),
                                        annofin: self.cbannofin.getRawValue()
                                    }
                                });

                                var colModel = new Ext.grid.ColumnModel(colums);

                                self.gpPartes.reconfigure(stgpPartes, colModel);
                                self.gpPartes.doLayout();
                            }
                        }
                    });

                }

            }.createDelegate(this)
        });

        this.btnLimpiarD = new Ext.Button({
            text: 'Limpiar',
            tooltip: 'Limpiar filtros <b>(Alt+L)</b>',
            iconCls: 'limpiar',
            handler: function () {
                stgpPartes.removeAll();
                self.tcbEstructuraOrganizativaPartes.setValue('');
                self.tcbEstructuraOrganizativaPartes.setRawValue('Seleccione...');
                self.cbpartes.clearValue();
                self.cbannoini.setValue('Seleccione...');
                self.cbannofin.setValue('Seleccione...');

            }.createDelegate(this)
        });

        /*** Resumen estadístico ***/
        //Store
        stgpPartes = new Ext.data.Store({
            url: 'getDatosPartesAfectadas',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cant", root: "data"},
                [{name: 'denominacion'}]
            )
        });

        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function () {
                }
            }
        });

        self.gpPartes = new Ext.grid.GridPanel({
            tbar: ['Estructura organizativa:', this.tcbEstructuraOrganizativaPartes, 'Partes del cuerpo:', this.cbpartes, 'Año inicial:', this.cbannoini, 'Año final:', this.cbannofin, this.btnBuscarD, this.btnLimpiarD, self.btnExportarD],
            store: stgpPartes,
            sm: this.sm,
            loadMask: {msg: 'Cargando...'},
            columns: [],
            keys:[
                {
                    key: 'b',
                    alt: true,
                    // stopEvent: true,
                    fn: function () {
                        if (!self.btnBuscarD.disabled) {
                            self.btnBuscarD.handler();
                        }
                    }
                },
                {
                    key: 'l',
                    alt: true,
                    // stopEvent: true,
                    fn: function () {
                        if (!self.btnLimpiarD.disabled) {
                            self.btnLimpiarD.handler();
                        }
                    }
                },
                {
                    key: 'e',
                    alt: true,
                    // stopEvent: true,
                    fn: function () {
                        if (!self.btnExportarD.disabled) {
                            self.btnExportarD.handler();
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

        self.items = [self.gpPartes];
        Pvd.SST.Gestionaraccidentes.Analisis.CmpPartesCuerpoAfectadas.superclass.initComponent.call(this);
    }
});
