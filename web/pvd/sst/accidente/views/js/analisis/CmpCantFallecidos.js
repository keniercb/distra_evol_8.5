/**
 * @name analisisft.CmpResumen - Componente accidentes del cuerpo afectadas
 * @package Pvd.SST.Gestionaraccidentes.Analisis
 * @uses Pvd.SST.Gestionaraccidentes.Analisis
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *
 * @version 1.0
 */
Ext.ns('Pvd.SST.Gestionaraccidentes.Analisis');

//Definiendo panel del componente
Pvd.SST.Gestionaraccidentes.Analisis.CmpCantFallecidos = Ext.extend(Ext.Panel, {
    // id: 'panelResumen',
    layout: 'fit',
    region: 'center',
    height: '100%',
    closable: true,
    autoScroll: true,
    initComponent: function () {
        var self = this;
        var annos = new Array();
        var stgpfallecidos='';
        fnLlenarArregloAnnos();

        this.btnExportarD = new Ext.Button({
            text: 'Exportar',
            tooltip: 'Exportar datos<b>(Alt+E)</b>',
            disabled: true,
            iconCls: 'exportar',
            handler: function () {
                if (this.cbannoiniF.getRawValue() == '' || this.cbannofinF.getRawValue() == '') {
                    mostrarMensaje(8, 'Debe seleccionar los años a mostrar.');
                    return;
                }
                if (this.cbannoiniF.getRawValue() > this.cbannofinF.getRawValue()) {
                    mostrarMensaje(8, 'El año inicio debe ser menor que el año fin .');
                    return;
                }
                else {
                    var params = Ext.urlEncode({
                        idestructura: this.tcbEstructuraOrganizativaFallecidos.getValue(),
                        accidentes: this.cbtipoacc.getValue(),
                        annoini: this.cbannoiniF.getRawValue(),
                        annofin: this.cbannofinF.getRawValue()
                    });

                    var idIframe = Ext.id();
                    new Ext.Window({
                        title: 'Reporte',
                        width: 800,
                        height: 500,
                        id: 'winfallecidos',
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
                                '/pvd/sst/accidente/index.php/analisis/obtenerReporteCantFallecidos?' + params
                            }
                        }
                    }).show();
                    this.cbtipoacc.setValue('');
                    Ext.getCmp('winfallecidos').maximize();
                }
            }.createDelegate(this)
        });

        /*** Filtros del Reporte ***/
        this.tlEstructura = new Ext.tree.TreeLoader({
            dataUrl: 'obtenerEstructura',
            preloadChildren: false
        });
        this.tcbEstructuraOrganizativaFallecidos = new Ext.components.TreeComboBox({
            allowBlank: true,
            anchor: '100%',
            emptyText: 'Seleccione...',
            fieldLabel: 'idioma.lbCargo',
            id: 'tcbEstructuraOrganizativaFallecidos',
            treeConfig: {
                autoScroll: true,
                border: false,
                loader: this.tlEstructura,
                rootVisible: false
            },
            width: 200
        });

        this.stcbtipoacc = new Ext.data.Store({
            url: 'getTipoAccidente',
            reader: new Ext.data.JsonReader(
                {root: "", id: ""},
                [{name: 'idtipoaccidente'}, {name: 'denominacion'}]
            )
        });
        this.stcbtipoacc.load();

        this.cbtipoacc = new Ext.form.MultiComboSelect({
            //  id: 'cbtipoacc',
            store: this.stcbtipoacc,
            width: 150,
            displayField: 'denominacion',
            valueField: 'idtipoaccidente',
            hiddenName: 'idtipoaccidente',
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

        this.stcbannoiniF = new Ext.data.SimpleStore({
            fields: ['idini', 'denominacion'],
            data: annos
        });

        this.cbannoiniF = new Ext.form.ComboBox({
            store: this.stcbannoiniF,
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
                    this.btnBuscarF.enable();
                    this.btnExportarD.enable();
                }.createDelegate(this)
            }
        });

        this.stcbannofinF = new Ext.data.SimpleStore({
            fields: ['idfin', 'denominacion'],
            data: annos
        });

        this.cbannofinF = new Ext.form.ComboBox({
            store: this.stcbannofinF,
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


        this.btnBuscarF = new Ext.Button({
            text: 'Buscar',
            tooltip: 'Buscar datos <b>(Alt+B)</b>',
            iconCls: 'buscar',
            disabled: true,
            handler: function () {
                if (this.cbannoiniF.getRawValue() == '' || this.cbannofinF.getRawValue() == '') {
                    mostrarMensaje(8, 'Debe seleccionar los años a mostrar.');
                    return;
                }
                if (this.cbannoiniF.getRawValue() > this.cbannofinF.getRawValue()) {
                    mostrarMensaje(8, 'El año inicio debe ser menor que el año fin .');
                    return;
                }
                else {
                    Ext.Ajax.request({
                        url: 'getDatosCantFallecidos',
                        params: {
                            idestructura: self.tcbEstructuraOrganizativaFallecidos.getValue(),
                            accidentes: this.cbtipoacc.getValue(),
                            annoini: this.cbannoiniF.getRawValue(),
                            annofin: this.cbannofinF.getRawValue()
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);

                            if (responseData.cant == 0) {
                                mostrarMensaje(8, 'No hay datos a mostrar en este período .');
                            } else {
                                var field = new Array();
                                var colums = new Array();

                                for (var r in responseData.data[0]) {
                                    if (r == 'Accidentes del trabajo') {
                                        field.push({name: r});
                                        colums.push({
                                            header: r, width: 350, dataIndex: r, menuDisabled: true
                                        })
                                    }
                                }

                                for (var r in responseData.data[0]) {
                                    if (r != 'Accidentes del trabajo') {
                                        field.push({name: r});   //campos del stores
                                        colums.push({
                                            header: r, width: 50, dataIndex: r, menuDisabled: true, align: 'center'
                                        })
                                    }
                                }

                                var record = new Ext.data.Record.create(field);

                                stgpfallecidos = new Ext.data.Store({
                                    url: 'getDatosCantFallecidos',
                                    autoLoad: true,
                                    reader: new Ext.data.JsonReader(
                                        {totalProperty: "cant", root: "data"},
                                        field),
                                    baseParams: {
                                        idestructura: self.tcbEstructuraOrganizativaFallecidos.getValue(),
                                        accidentes: self.cbtipoacc.getValue(),
                                        annoini: self.cbannoiniF.getRawValue(),
                                        annofin: self.cbannofinF.getRawValue()
                                    }
                                });

                                var colModel = new Ext.grid.ColumnModel(colums);

                                self.gpfallecidos.reconfigure(stgpfallecidos, colModel);
                                self.gpfallecidos.doLayout();
                            }
                        }
                    });

                }

            }.createDelegate(this)
        });

        this.btnLimpiarF = new Ext.Button({
            text: 'Limpiar',
            tooltip: 'Limpiar filtros <b>(Alt+L)</b>',
            iconCls: 'limpiar',
            handler: function () {
                stgpfallecidos.removeAll();
                self.tcbEstructuraOrganizativaFallecidos.setValue('');
                self.tcbEstructuraOrganizativaFallecidos.setRawValue('Seleccione...');
                self.cbtipoacc.clearValue();
                self.cbannoiniF.setValue('Seleccione...');
                self.cbannofinF.setValue('Seleccione...');

            }.createDelegate(this)
        });

        /*** Resumen estadístico ***/
        //Store
        stgpfallecidos = new Ext.data.Store({
            url: 'getDatosCantFallecidos',
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

        self.gpfallecidos = new Ext.grid.GridPanel({
            tbar: ['Estructura organizativa:', this.tcbEstructuraOrganizativaFallecidos, 'Tipo de accidente:', this.cbtipoacc, 'Año inicial:', this.cbannoiniF, 'Año final:', this.cbannofinF, this.btnBuscarF, this.btnLimpiarF, self.btnExportarD],
            store: stgpfallecidos,
            sm: this.sm,
            loadMask: {msg: 'Cargando...'},
            columns: [],
            keys:[
                {
                    key: 'b',
                    alt: true,
                    // stopEvent: true,
                    fn: function () {
                        if (!self.btnBuscarF.disabled) {
                            self.btnBuscarF.handler();
                        }
                    }
                },
                {
                    key: 'l',
                    alt: true,
                    // stopEvent: true,
                    fn: function () {
                        if (!self.btnLimpiarF.disabled) {
                            self.btnLimpiarF.handler();
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

        self.items = [self.gpfallecidos];
        Pvd.SST.Gestionaraccidentes.Analisis.CmpCantFallecidos.superclass.initComponent.call(this);
    }
});
