
//Empaquetando el componente tipo Reportes.
Ext.ns('Caja.Reportes');

Caja.Reportes.View = {
    init: function(idioma, etiquetas, model) {
        this.crearBtns(etiquetas);
        // this.crearCajaComponent(etiquetas);

        this.pReportes = this.crearReporteForm(etiquetas, model);
        this.pnlSouth = this.crearPanelInferior(etiquetas, model);

        this.pGeneral = new Ext.Panel({
            layout: 'fit',
            frame: false,
            border: false,
            items: [this.pReportes]
        });

        this.vpServicios = new Ext.Viewport({
            id: 'viewport',
            layout: 'fit',
            items: [this.pGeneral]
        });
    },
    crearBtns: function (etiquetas) {
        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaRecuperaciones',
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',
            tooltip: etiquetas.tooltipAyuda,
            text: etiquetas.lbAyuda
        });

        this.btnAceptar = new Ext.Button({
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            // disabled: true,
            text: etiquetas.lbAceptar,
            tooltip: 'Aceptar configuraci&oacute;n y mostrar reporte'//etiquetas.ttAceptar
        });

        this.btnVistaPreliminar = new Ext.Button({
            id: 'btnVistaPreliminar',
            hidden: true,
//            icon: perfil.dirImg + 'abrir.png',
            iconCls: 'vistareporte',
            text: etiquetas.lbVistaReporte,
            tooltip: etiquetas.lbVistaReporte
        });

        this.btnAbrirComprobante = new Ext.Button({
            id: 'btnAbrirComprobante',
            hidden: true,
//            icon: perfil.dirImg + 'comprobante.png',
            iconCls: 'comprobante',
            text: etiquetas.textAbrir,
            tooltip: etiquetas.txtAbrirOp
        });
    },
    crearCajaComponent: function (etiquetas) {
        //Para el componente wincaja
        this.btnCaja = new Ext.Button({
            text: etiquetas.lbBtnCaja,
            tooltip: etiquetas.lbToolCaja,
            iconCls: 'caja'
        });
        this.tfCaja = new Ext.form.TextField({
            name: 'tfCaja',
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 100,
            enableKeyEvents: true
        });

        this.loadWindowCaja = function () {
            //Componete de wincaja-----------
            this.winCaja = new Caja.Componentes.WindowCaja({
                idCajaOld: this.idCaja
            });
            this.winCaja.show();

            this.winCaja.on({
                scope: this,
                loadData: function (data) {
                    this.idCaja = this.winCaja.idCaja;
                    this.tfCaja.setValue(this.winCaja.idCaja);
                    this.tfCaja.setRawValue(this.winCaja.nomCaja);
                    this.gpDatosReporte.getStore().removeAll();
                }
            });
        };
        this.btnCaja.on({
            scope: this,
            click: function () {
                this.loadWindowCaja();
            }
        });

        return [this.btnCaja, this.tfCaja]
    },
    crearToolBarForm: function (etiquetas) {
        // var botonesCaja = this.crearCajaComponent(etiquetas);

        // return ['->'].concat(botonesCaja).concat(this.btnAyuda);
        return [this.btnAyuda];
    },
    crearReporteForm: function (etiquetas, model) {
        this.cbReportes = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbReportes',
            store: model.stReportes,
            fieldLabel: 'Reporte',
            allowBlank: false,
            displayField: 'denominacion',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            hiddenName: 'idreporte',
            valueField: 'idreporte',
            mode: 'local',
            triggerAction: 'all',
            forceSelection: true,
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            resizable: true,
            anchor: '100%',
            maxHeight: 420,
            editable: false
        });

        this.cbxEntidad = new Ext.CONT.UIXCombo({
            emptyText: 'Seleccione...',
            allowBlank: false,
            fieldLabel: 'Entidad',
            tabIndex: 1
        }, {
            identificador: 'Entidad',
            displayText: 'Entidad',
            url: 'obtenerEntidadesParaBusqueda',
            autoLoad: false,
            tbar: [new Ext.Button({
                iconCls: 'deshabilitar',
                text: 'scope.etiquetas.txtNoConsolidar',
                id: 'btnNoConsolidar',
                //icon: scope.perfil.dirImg + 'deshabilitar.png',
                hidden: true
            }),
                new Ext.Button({
                    iconCls: 'habilitar',
                    text: 'scope.etiquetas.txtConsolidar',
                    id: 'btnConsolidar',
                    //icon: scope.perfil.dirImg + 'habilitar.png',
                    hidden: true
                })],
            singleSelect: false,
            reader: this.jrEntidad = new Ext.data.JsonReader({
                id: 'idestructurae',
                root: 'datos'
            }, [{
                name: '_parent',
                mapping: 'idestructuraepadre'
            }, {
                name: '_is_leaf',
                mapping: 'leaf'
            }, {
                name: 'text'
            }, {
                name: 'idestructurae'
            }, {
                name: 'id',
                mapping: 'idestructuracomun'
            }, {
                name: 'idestructuraepadre'
            }, {
                name: 'codigo',
                mapping: 'text'
            }, {
                name: 'ordenizq'
            }, {
                name: 'ordender'
            }])
        });
//
        this.cbxEjercicio = new Ext.CONT.UIXCombo({
            emptyText: 'Seleccione...',
            //allowBlank: false,
            fieldLabel: 'Ejercicio',
            tabIndex: 2
        }, {
            identificador: 'Ejercicio',
            displayText: 'Ejercicio',
            url: 'obtenerEjerciciosParaBusqueda',
            autoLoad: false,
            singleSelect: true,
            reader: this.jrEjercicio = new Ext.data.JsonReader({
                id: 'idejercicio',
                root: 'datos'
            }, [{
                name: '_parent'
            }, {
                name: '_is_leaf'
            }, {
                name: 'text'
            }, {
                name: 'idejercicio'
            }, {
                name: 'nombre'
            }, {
                name: 'codigo',
                mapping: 'text'
            }, {
                name: 'inicio'
            }, {
                name: 'fin'
            }])
        });

        this.cbxPeriodo = new Ext.CONT.UIXCombo({
            emptyText: 'Seleccione...',
            fieldLabel: 'Per&iacute;odo',
            tabIndex: 3
        }, {
            identificador: 'Periodo',
            displayText: 'Per&iacute;odo',
            url: 'obtenerPeriodosParaBusqueda',
            autoLoad: false,
            singleSelect: false,
            reader: this.jrPeriodo = new Ext.data.JsonReader({
                id: 'idperiodo',
                root: 'datos'
            }, [{
                name: '_parent'
            }, {
                name: '_is_leaf'
            }, {
                name: 'text'
            }, {
                name: 'idperiodo'
            }, {
                name: 'nombre'
            }, {
                name: 'codigo',
                mapping: 'text'
            }, {
                name: 'idejercicio'
            }, {
                name: 'inicio'
            }, {
                name: 'fin'
            }, {
                name: 'apertura'
            }])
        });

        this.cbxEspecialidad = new Ext.CONT.UIXCombo({
            emptyText: 'Seleccione...',
            fieldLabel: 'Especialidad',
            tabIndex: 6
        }, {
            identificador: 'Especialidad',
            displayText: 'Especialidad',
            singleSelect: false,
            url: 'cargararbolespecialidades',
            reader: this.jrEspecialidad = new Ext.data.JsonReader({
                id: 'idespecialidad',
                root: 'datos'
            }, [{
                name: 'text',
                mapping: 'especialidad'
            }, {
                name: 'codigo',
                mapping: 'especialidad'
            }, {
                name: '_parent'
            }, {
                name: '_is_leaf'
            }])
        });

        this.cbxClienteProveedor = new Ext.CONT.UIXCombo({
            emptyText: 'Seleccione...',
            fieldLabel: 'Clientes - Proveedores',
            allowBlank: false,
            //hidden:true,
            tabIndex: 7
        }, {
            identificador: 'ClienteProveedor',
            displayText: 'Clientes - Proveedores',
            singleSelect: false,
            url: 'obtenerclientesprovedores',
            reader: this.jrClienteProveedor = new Ext.data.JsonReader({
                id: 'id',
                root: 'datos'
            }, [{
                name: 'text',
                mapping: 'nombre'
            }, {
                name: 'codigo',
                mapping: 'nombre'
            }, {
                name: 'id',
                mapping: 'id'
            }, {
                name: '_parent'
            }, {
                name: '_is_leaf'
            }])
        });

        Ext.apply(Ext.form.VTypes, {
            daterange: function(val, field) {
                var date = field.parseDate(val);
                var dispUpd = function(picker) {
                    var ad = picker.activeDate;
                    picker.activeDate = null;
                    picker.update(ad);
                };
                if (field.startDateField) {
                    var sd = Ext.getCmp(field.startDateField);
                    sd.maxValue = date;
                    if (sd.menu && sd.menu.picker) {
                        sd.menu.picker.maxDate = date;
                        dispUpd(sd.menu.picker);
                    }
                } else if (field.endDateField) {
                    var ed = Ext.getCmp(field.endDateField);
                    ed.minValue = date;
                    if (ed.menu && ed.menu.picker) {
                        ed.menu.picker.minDate = date;
                        dispUpd(ed.menu.picker);
                    }
                }
                return true;
            }
        });

        this.fechaInicio = new Ext.form.DateField({
            fieldLabel: 'Fecha inicio',
            enableKeyEvents: true,
            tabIndex: 4,
            vtype: 'daterange',
            name: 'dfDesde',
            id: 'dfDesde',
            //endDateField : 'dfHasta',
            anchor: '100%',
            readOnly: true,
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            allowBlank: false
        });

        this.fechaFin = new Ext.form.DateField({
            fieldLabel: 'Fecha fin',
            enableKeyEvents: true,
            vtype: 'daterange',
            //startDateField : 'dfDesde',
            tabIndex: 5,
            name: 'dfHasta',
            id: 'dfHasta',
            anchor: '100%',
            allowBlank: false,
            readOnly: true,
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
        });

        return new Ext.FormPanel({
            id: 'topPanel',
            autoHeight: true,
            frame: true,
            border: false,
            buttonAlign: 'right',
            layout: 'form',
            items: [{
//                    id: 'innerTop',
                labelAlign: 'top',
                layout: 'column',
                items: [{
                    columnWidth: .30,
                    style: 'margin: 0 0 0 10',
                    layout: 'form',
                    items: this.cbxEntidad
                },
                    {
                        columnWidth: .10,
                        style: 'margin: 0 0 0 10',
                        layout: 'form',
                        items: this.cbxEjercicio
                    },
                    {
                        columnWidth: .10,
                        style: 'margin: 0 0 0 10',
                        layout: 'form',
                        items: this.cbxPeriodo
                    },
                    {
                        columnWidth: .07,
                        style: 'margin: 0 0 0 10',
                        layout: 'form',
                        items: this.fechaInicio
                    },
                    {
                        columnWidth: .07,
                        style: 'margin: 0 0 0 10',
                        layout: 'form',
                        items: this.fechaFin
                    }, {
                        columnWidth: .36,
                        layout: 'form',
                        style: 'margin:0 5 0 10',
                        items: [this.cbReportes]
                    }]
            }],
            tbar: this.crearToolBarForm(etiquetas),
            bbar: [this.btnAceptar]
        });
    },
    crearPanelInferior: function (etiquetas, model) {
        return new Ext.FormPanel({
            layout: 'fit',
            region: 'center',
            frame: false,
            border: false,
            items: [this.gpDatosReporte = new Ext.grid.GridPanel({
                id: 'gpReportes',
                autoScroll: true,
                frame: false,
                layout: 'fit',
                border: false,
                sm: this.smDatosReporte = new Ext.grid.RowSelectionModel({
                    singleSelect: true
                }),
                store: this.stReportes = new Ext.data.SimpleStore({
                    fields: [],
                    data: [[]]
                }),
                columns: [],
                tbar: [this.btnVistaPreliminar, this.btnAbrirComprobante],
                view: new Ext.grid.GroupingView({
                    forceFit: true,
                    ShowGroupName: true,
                    enableRowBody: true,
                    enableNoGroup: false,
                    enableGropingMenu: true,
                    hideGroupedColumn: true,
                    groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Elementos" : "Elemento"]})'
                })
            })]
        });
    }
};

// Ext.QuickTips.init();
var perfil = window.parent.perfil
perfil.etiquetas = Object();

// Ext.Ajax.request({
//     method: "POST",
//     url: "cargaretiquetas",
//     callback: function(options, success, response)
//     {
//         var etiquetas = Ext.decode(response.responseText);
//         var model = Caja.Reportes.Model;
//         model.init();
//
//         var view = Caja.Reportes.View;
//         view.init(perfil, etiquetas, model);
//
//         var controller = Caja.Reportes.Controller;
//         controller.init(etiquetas, view, model);
//     }
// });