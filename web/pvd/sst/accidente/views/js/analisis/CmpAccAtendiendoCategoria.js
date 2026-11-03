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
Pvd.SST.Gestionaraccidentes.Analisis.CmpAccAtendiendoCategoria = Ext.extend(Ext.Panel, {
    layout: 'fit',
    region: 'center',
    height: '100%',
    closable: true,
    initComponent: function () {
        var self = this;
        var annos = new Array();
        fnLlenarArregloAnnos();

        this.btnExportarCat = new Ext.Button({
            text: 'Exportar',
            tooltip: 'Exportar datos<b>(Alt+E)</b>',
            iconCls: 'exportar',
            disabled: true,
            handler: function () {
                if (this.cbannoiniCat.getRawValue() == '' || this.cbannofinCat.getRawValue() == '') {
                    mostrarMensaje(8, 'Debe seleccionar los años a mostrar.');
                } else {
                    var params = Ext.urlEncode({
                        idestructura: this.tcbEstructuraOrganizativaCategoria.getValue(),
                        categoria:this.cbcategoria.getValue(),
                        annoini: this.cbannoiniCat.getRawValue(),
                        annofin: this.cbannofinCat.getRawValue()
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
                                '/pvd/sst/accidente/index.php/analisis/obtenerReporteCategoria?' + params
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

        this.tcbEstructuraOrganizativaCategoria = new Ext.components.TreeComboBox({
            allowBlank: true,
            anchor: '100%',
            fieldLabel: 'idioma.lbCargo',
            id: 'tcbEstructuraOrganizativaCategoria',
            treeConfig: {
                autoScroll: true,
                border: false,
                loader: this.tlEstructura,
                rootVisible: false
            },
            width: 300
        });

        this.stcbincapacidad = new Ext.data.Store({
            url: 'getCategoriasActivas',
            reader: new Ext.data.JsonReader(
                {root: "", id: ""},
                [{name: 'idcategocup'}, {name: 'denominacion'}]
            )
        });
        this.stcbincapacidad.load();

        this.cbcategoria = new Ext.form.MultiComboSelect({
            //  id: 'cbcategoria',
            store: this.stcbincapacidad,
            width: 150,
            displayField: 'denominacion',
            valueField: 'idcategocup',
            hiddenName: 'idcategocup',
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


        this.stcbannoiniCat = new Ext.data.SimpleStore({
            fields: ['idini', 'denominacion'],
            data: annos
        });

        this.cbannoiniCat = new Ext.form.ComboBox({
            store: this.stcbannoiniCat,
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
                    this.btnBuscarCat.enable();
                    this.btnExportarCat.enable();

                }.createDelegate(this)
            }
        });

        this.stcbannofinCat = new Ext.data.SimpleStore({
            fields: ['idfin', 'denominacion'],
            data: annos
        });

        this.cbannofinCat = new Ext.form.ComboBox({
            store: this.stcbannofinCat,
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


        this.btnBuscarCat = new Ext.Button({
            text: 'Buscar',
            tooltip: 'Buscar datos <b>(Alt+B)</b>',
            iconCls: 'buscar',
            disabled: true,
            handler: function () {
                if (this.cbannoiniCat.getRawValue() == '' || this.cbannofinCat.getRawValue() == '') {
                    mostrarMensaje(8, 'Debe seleccionar los años a mostrar.');
                }
                if (this.cbannoiniCat.getRawValue() > this.cbannofinCat.getRawValue()) {
                    mostrarMensaje(8, 'El año inicio debe ser mayor que el año fin .');
                }
                else {
                    Ext.Ajax.request({
                        url: 'getDatosCategoria',
                        params: {
                            idestructura: self.tcbEstructuraOrganizativaCategoria.getValue(),
                            categoria:this.cbcategoria.getValue(),
                            annoini: this.cbannoiniCat.getRawValue(),
                            annofin: this.cbannofinCat.getRawValue()
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);

                            if (responseData.cant == 0) {
                                mostrarMensaje(8, 'No hay datos a mostrar en este período .');
                            } else {
                                var field = new Array();
                                var colums = new Array();

                                for (var r in responseData.data[0]) {
                                    if (r == 'Categoría del personal') {
                                        field.push({name: r});
                                        colums.push({
                                            header: r, width: 130, dataIndex: r, menuDisabled: true
                                        })
                                    }
                                }

                                for (var r in responseData.data[0]) {
                                    if (r != 'Categoría del personal') {
                                        field.push({name: r});   //campos del stores
                                        colums.push({
                                            header: r, width: 50, dataIndex: r, menuDisabled: true, align: 'center'
                                        })
                                    }
                                }
                                var record = new Ext.data.Record.create(field);

                                var stgpCategoria = new Ext.data.Store({
                                    url: 'getDatosCategoria',
                                    autoLoad: true,
                                    reader: new Ext.data.JsonReader(
                                        {totalProperty: "cant", root: "data"},
                                        field),
                                    baseParams: {
                                        idestructura: self.tcbEstructuraOrganizativaCategoria.getValue(),
                                        categoria:self.cbcategoria.getValue(),
                                        annoini: self.cbannoiniCat.getRawValue(),
                                        annofin: self.cbannofinCat.getRawValue()
                                    }
                                });

                                var colModel = new Ext.grid.ColumnModel(colums);

                                self.gpCategoria.reconfigure(stgpCategoria, colModel);
                                self.gpCategoria.doLayout();
                            }
                        }
                    });

                }
            }.createDelegate(this)
        });

        this.btnLimpiarCat = new Ext.Button({
            text: 'Limpiar',
            tooltip: 'Limpiar filtros <b>(Alt+L)</b>',
            iconCls: 'limpiar',
            handler: function () {
                self.tcbEstructuraOrganizativaCategoria.setValue('');
                self.tcbEstructuraOrganizativaCategoria.setRawValue('Seleccione...');
                self.cbcategoria.clearValue();
                self.cbannoiniCat.setValue('Seleccione...');
                self.cbannofinCat.setValue('Seleccione...');
            }.createDelegate(this)
        });

        /*** Resumen estadístico ***/
        //Store
        self.stgpCategoria = new Ext.data.Store({
            url: 'getDatosIncapacidad',
            reader: new Ext.data.JsonReader(
                {root: "", id: ""},
                [{name: 'denominacion'}, {name: 'cantidad'}]
            )

        });

        self.gpCategoria = new Ext.grid.GridPanel({
            tbar: ['Estructura organizativa:', this.tcbEstructuraOrganizativaCategoria,'Categoría:',this.cbcategoria, 'Año inicial:', this.cbannoiniCat, 'Año final:', this.cbannofinCat, this.btnBuscarCat, this.btnLimpiarCat, self.btnExportarCat],
            store: self.stgpCategoria,
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
                        if (!self.btnBuscarCat.disabled) {
                            self.btnBuscarCat.handler();
                        }
                    }
                },
                {
                    key: 'l',
                    alt: true,
                    // stopEvent: true,
                    fn: function () {
                        if (!self.btnLimpiarCat.disabled) {
                            self.btnLimpiarCat.handler();
                        }
                    }
                },
                {
                    key: 'e',
                    alt: true,
                    // stopEvent: true,
                    fn: function () {
                        if (!self.btnExportarCat.disabled) {
                            self.btnExportarCat.handler();
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

        self.items = [self.gpCategoria];
        Pvd.SST.Gestionaraccidentes.Analisis.CmpAccAtendiendoCategoria.superclass.initComponent.call(this);
    }
});
