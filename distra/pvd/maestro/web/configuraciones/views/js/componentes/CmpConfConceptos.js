/**
 * @name componentes.CmpRegUnico - Componente para la configuración de los registros únicos.
 * @package Pvd.Maestro
 * @uses Pvd.Maestro.Configuraciones
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *         Beatriz Selema Alvarez
 * @version 1.0
 */
Ext.ns('Pvd.Maestro.Configuraciones');
Pvd.Maestro.Configuraciones.CmpConfConceptos = Ext.extend(Ext.Panel, {
    id: 'pConfconceptos',
    title: 'Configuraci&oacute;n de conceptos de n&oacute;mina',
    tabTip: 'Configuraci&oacute;n de conceptos de n&oacute;mina',
     layout: 'border',
    region: 'center',
    height: '100%',
    closable: true,
    initComponent: function () {
        var self = this;

        //Boton para mostrar la ayuda del sistema.
        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            iconCls: 'ayuda',
            text: this.idioma.btnAyudaEstCncpt_text,
            tooltip: this.idioma.btnAyudaEstCncpt_tooltip
        });

        this.btnGuardar = new Ext.Button({
            text: this.idioma.btnGuardar,
            disabled: true,
            tooltip: this.idioma.tooltbtnGuardar,
            iconCls: 'guardar',
            handler: function () {
                //
                var selecionados = '';
                var selec = self.gpConceptos.getSelectionModel().getSelections();
                var arra = new Array();
                Ext.each(selec, function (rec) {
                    arra.push(rec.data.idconceptopercepciondescuento);
                });

                Ext.Ajax.request({
                    url: '/pvd/maestro/configuraciones/index.php/conceptos/guardarConceptos',
                    params: {
                        arra: Ext.encode(arra)
                    },
                    method: "POST",
                    callback: function (opt, succ, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.codigo == 1) {
                            Ext.Ajax.request({
                                url: '/pvd/maestro/configuraciones/index.php/conceptos/getSelected',
                                params: {},
                                method: "POST",
                                callback: function (opt, succ, response) {
                                    var response = Ext.decode(response.responseText);
                                    self.stgpCon.load({
                                        callback: function (rec, opt, succes) {
                                            var seleccion = new Array();
                                            Ext.each(rec, function (rec) {
                                                Ext.each(response.datos, function (sel) {

                                                    if (rec.data.idconceptopercepciondescuento == sel.idconcepto) {
                                                        seleccion.push(rec);
                                                    }

                                                })
                                            });
                                            self.smgp.selectRecords(seleccion);
                                        }
                                    });
                                    mostrarMensaje(1, 'El (los) concepto(s) ha(n) adicionado(s) satisfactorimanete');
                                }

                            });

                        }
                    }
                });
            }
        });

//Store para el grid
        this.stgpCon = new Ext.data.GroupingStore({
            url: '/pvd/maestro/configuraciones/index.php/conceptos/getConceptos',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos"},
                [{name: 'idconceptopercepciondescuento'}
                    , {name: 'abreviatura'}
                    , {name: 'denominacion'}
                    , {name: 'descripcion'}
                    , {name: 'idtipoconceptopd'}
                    , {name: 'tipoconcepto'}
                ]),
            sortInfo: {field: 'denominacion', direction: "ASC"},
            //groupField: 'idtipoconceptopd'
        });

        this.stgpCon.load({
            callback: function (rec, opt, succes) {
                Ext.Ajax.request({
                    url: '/pvd/maestro/configuraciones/index.php/conceptos/getSelected',
                    params: {},
                    method: "POST",
                    callback: function (opt, succ, response) {
                        var response = Ext.decode(response.responseText);
                        var seleccion = new Array();
                        Ext.each(rec, function (rec) {
                            Ext.each(response.datos, function (sel) {
                                if (rec.data.idconceptopercepciondescuento == sel.idconcepto) {
                                    seleccion.push(rec);
                                }

                            })
                        });
                        self.smgp.selectRecords(seleccion);
                    }

                });
            }
        });


        this.smgp = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (selM, indexF, r) {
                    this.btnGuardar.enable();
                }.createDelegate(this)
            }
        });


        this.gpConceptos = new Ext.grid.GridPanel({
            store: this.stgpCon,
            sm: this.smgp,
            region: 'center',
            view: new Ext.grid.GroupingView({
                 forceFit: true,
                groupTextTpl: '{text}'
            }),
             loadMask: {msg: 'Cargando...'},
            columns: [this.smgp,
                {
                    header: "Abreviatura",
                    dataIndex: 'abreviatura',
                    width: 20
                }, {
                    header: "Denominaci&oacute;n",
                    dataIndex: 'denominacion',
                    width: 120
                }, {
                 dataIndex: 'idtipoconceptopd',
                 width: 50,
                 hidden: true
                 }
            ],
            tbar: [self.btnGuardar, '->', self.btnAyuda],
            keys: [
                {
                    key: 'g',
                    alt: true,
                    fn: function () {
                        if (!self.btnGuardar.disabled) {
                            self.btnGuardar.handler();
                        }

                    }
                }
            ]
        });

        this.items = [this.gpConceptos];
        Pvd.Maestro.Configuraciones.CmpConfConceptos.superclass.initComponent.call(this);
    }
})
;
