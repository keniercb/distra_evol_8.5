Ext.ns('Pvd.ControlAsistencia.PromedioTrabajadores');
//Controlador de la vista del componente
Pvd.ControlAsistencia.PromedioTrabajadores.Controlador = {

    init: function (idioma, vista, modelo) {
        var self = this;
        this.fecha = new Date();
        this.idestructura = perfil.idestructuracomun;

        cargandopromediotrabajadores();
        cargardatos(vista.desde.getRawValue(), vista.hasta.getRawValue(), self.idestructura);

        vista.EstructuraTree.on('dameseleccion', function (obj, data) {
            if (data == false)
                this.idestructura = vista.EstructuraTree.inicial;
            else {
                this.idestructura = data.id;
            }
            modelo.store.removeAll();
            cargandopromediotrabajadores();
            cargardatos(vista.desde.getRawValue(), vista.hasta.getRawValue(), self.idestructura);
        }, this);

        function formatDate(date) {
            var explodeDate = date.split('/');
            return parseInt(explodeDate[2] + explodeDate[1] + explodeDate[0]);
        }

        function Estilo(val, meta, rec, row, col, store) {
            if (rec.data.concepto == 'Total de Trabajadores' || rec.data.concepto == 'Total de Deducciones'
                || rec.data.concepto == 'Promedio de Trabajadores') {
                meta.css = 'weekend';
                return '<p><b>' + val + '</b></p>';
            }
            return val;
        }

        function EstiloPromedio(val, meta, rec, row, col, store) {
            if (row == 4 || row == 19 || row == 20 || row == 21) {
                meta.css = 'weekend';
                return '<p><b>' + val + '</b></p>';
            }
            return val;
        }

        function cargandopromediotrabajadores() {
            var data = {
                promediotrabajadores: 'Cargando...'
            };
            vista.plantillapromedio.overwrite(vista.pPromediotrabajadores.body, data);
        }

        function cargardatos(fdesde, fhasta, idestructura) {
            Ext.Ajax.timeout = 90000000;
            vista.Maskara.show();
            Ext.Ajax.request({
                url: 'getdatos',
                method: 'POST',
                params: {
                    idestructura: idestructura,
                    fdesde: fdesde,
                    fhasta: fhasta
                },
                callback: function (options, success, response) {
                    vista.Maskara.hide();
                    var responseData = Ext.decode(response.responseText);
                    var columnas = new Array();
                    var indices = new Array();
                    columnas.push(new Ext.grid.RowNumberer());
                    columnas.push({
                        dataIndex: 'concepto',
                        sortable: true,
                        header: 'Concepto/Días',
                        hiddeable: false,
                        width: 200,
                        summaryType: 'sum',
                        renderer: Estilo
                    });
                    indices.push({name: 'concepto'});

                    Ext.each(responseData.columnas, function (col) {
                        columnas.push({
                            dataIndex: col,
                            sortable: false,
                            header: col,
                            width: 40,
                            summaryType: 'sum',
                            renderer: Estilo
                        });
                        indices.push({
                            name: col
                        });
                    });

                    var cmPersonasausen = new Ext.grid.ColumnModel(columnas);
                    var plantilla = new Ext.data.Record.create(indices);

                    var myReader = new Ext.data.JsonReader({
                        totalProperty: "cantidad",
                        root: "datos"
                    }, plantilla);

                    self.store = new Ext.data.GroupingStore({
                        url: 'getdatos',
                        baseParams: {
                            idestructura: idestructura,
                            fdesde: vista.desde.getRawValue(),
                            fhasta: vista.hasta.getRawValue()
                        },
                        reader: myReader,
                        sortInfo: {field: 'concepto', direction: "ASC"},
                        groupField: 'concepto',
                        remoteGroup: true,
                        remoteSort: true,
                    });

                    var summary = new Ext.grid.GroupSummary();

                    var data = {
                        promediotrabajadores: responseData.promediototal
                    };
                    vista.plantillapromedio.overwrite(vista.pPromediotrabajadores.body, data);

                    vista.Listado.getBottomToolbar().bind(self.store);
                    vista.Listado.reconfigure(self.store, cmPersonasausen);
                    vista.Listado.doLayout();

                    self.store.loadData({
                        datos: responseData.datos,
                        cantidad: responseData.cantidad
                    }, true);
                }
            });
        }

        vista.btnBuscar.on('click', function () {
            cargandopromediotrabajadores();
            cargardatos(vista.desde.getRawValue(), vista.hasta.getRawValue(), self.idestructura);
        }.createDelegate(this));

        vista.btnConfiguracion.on('click', function () {
            modelo.storeCausas.load();
            modelo.storeTipocontrato.load();
            modelo.storeSituacion.load();
            vista.winConfiguracion.show();
            //vista.listadoConcept.getSelectionModel().clearSelections();
        }, this);

        vista.smgridConcept.on('selectionchange', function (th) {
            modelo.storeTipocontrato.load(
                {params: {idconcepto: vista.listadoConcept.getSelectionModel().getSelected().data.idconcepto}}
            );
            modelo.storeSituacion.load(
                {params: {idconcepto: vista.listadoConcept.getSelectionModel().getSelected().data.idconcepto}}
            );
        });

        vista.smgridConcept.on('rowdeselect', function (sm, numb, rec) {
            vista.listadoTipocontrato.selModel.clearSelections();
            vista.listadoSituacion.selModel.clearSelections();
        }, this);

        vista.btnCancelar.on('click', function () {
            vista.winConfiguracion.hide();
        }, this);

        vista.btnAceptar.on('click', function () {
            guardar();
            vista.winConfiguracion.hide();
        }, this);

        vista.btnAplicar.on('click', function () {
            guardar();
        }, this);

        function guardar() {
            var causas = new Array();
            if (vista.smgridCausas.getCount() > 0) {
                Ext.each(vista.listadoCausas.getSelectionModel().getSelections(), function (rec) {
                    causas.push(rec.data.idcausa);
                });
            }
            var tiposcontratos = new Array();
            if (vista.smgridTipocontrato.getCount() > 0) {
                Ext.each(vista.listadoTipocontrato.getSelectionModel().getSelections(), function (rec) {
                    tiposcontratos.push(rec.data.idtipocontrato);
                });
            }
            var situaciones = new Array();
            if (vista.smgridSituacion.getCount() > 0) {
                Ext.each(vista.listadoSituacion.getSelectionModel().getSelections(), function (rec) {
                    situaciones.push(rec.data.idsituacion);
                });
            }
            if (vista.smgridConcept.getCount() > 0)
                var concepto = vista.listadoConcept.getSelectionModel().getSelected().data.idconcepto;
            Ext.getBody().mask(idioma.lbMsgmaskGuardar);
            Ext.Ajax.request({
                url: 'setConceptoCausas',
                params: {
                    causas: Ext.encode(causas),
                    concepto: concepto,
                    tiposcontratos: Ext.encode(tiposcontratos),
                    situaciones: Ext.encode(situaciones)
                },
                method: "POST",
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function () {
                    mostrarMensaje(1, idioma.lbMsgGuardarExito);
                    cargandopromediotrabajadores();
                    cargardatos(vista.desde.getRawValue(), vista.hasta.getRawValue(), self.idestructura);
                }
            });
        }

        modelo.storeCausas.on('load', function (_this, records, opt) {
            var seleccion = new Array();
            Ext.each(records, function (rec) {
                if (rec.data.check == 1) {
                    seleccion.push(rec);
                }
            });
            vista.listadoCausas.selModel.selectRecords(seleccion);
        });

        modelo.storeTipocontrato.on('load', function (_this, records, opt) {
            var seleccion = new Array();
            Ext.each(records, function (rec) {
                if (rec.data.check == 1) {
                    seleccion.push(rec);
                }
            });
            vista.listadoTipocontrato.selModel.selectRecords(seleccion);
        });

        modelo.storeSituacion.on('load', function (_this, records, opt) {
            var seleccion = new Array();
            Ext.each(records, function (rec) {
                if (rec.data.check == 1) {
                    seleccion.push(rec);
                }
            });
            vista.listadoSituacion.selModel.selectRecords(seleccion);
        });

        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'ble',
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 66: { //b para buscar
                        cargandopromediotrabajadores();
                        cargardatos(vista.desde.getRawValue(), vista.hasta.getRawValue(), self.idestructura);
                        break;
                    }
                    case 76: { //l para limpiar
                        Limpiar()
                        break;
                    }
                    case 69: { //e para exportar
                        break;
                    }
                }
            }
        }, {
            key: 13,//Enter para buscar
            fn: function () {
                cargardatos(vista.desde.getRawValue(), vista.hasta.getRawValue(), self.idestructura);
            }
        }]);
    }
}