Ext.ns('Pvd.ControlAsistencia.PartePorFecha');
//Controlador de la vista del componente
Pvd.ControlAsistencia.PartePorFecha.Controlador = {

    init: function (idioma, vista, modelo) {
        this.limite = 15;
        var scope = this;
        this.idestructura = perfil.idestructuracomun;

        vista.EstructuraTree.tree.root.on('expand', function (nodo) {
            vista.EstructuraTree.tree.getSelectionModel().select(nodo.childNodes[0]);
        });
        modelo.stListado.on('beforeload', function (st, opt) {
            modelo.stListado.baseParams.idcausa = vista.cbCausa.getValue();
        });
        modelo.storeCausasAusencia.load();
        modelo.storeTurnoTrabajo.load({
                callback: function (rec, opt, suc) {
                    modelo.stListado.removeAll();
                    modelo.stListado.baseParams.idestructura = perfil.idestructuracomun;
                    modelo.stListado.baseParams.fecha = vista.fechaBuscar.getRawValue();
                    modelo.stListado.baseParams.agrupador = vista.agrupador.value;
                    modelo.stListado.load({
                        params: {
                            idturnotrabajo: vista.cbTurnoTrabajo.getValue(),
                            start: 0,
                            limit: 15,
                            filtro: vista.filtro.getRawValue()
                        }, callback: function (rec, opt, suc) {
                            vista.Maskara.hide();
                        }
                    });
                }
            }
        );

        vista.EstructuraTree.on('dameseleccion', function (obj, data) {
            if (data == false)
                this.idestructura = vista.EstructuraTree.inicial;
            else {
                this.denomestructura = data.attributes.denominacion;
                this.idestructura = data.id;
            }
            modelo.stListado.removeAll();
            modelo.stListado.baseParams.idestructura = this.idestructura;
            modelo.stListado.baseParams.fecha = vista.fechaBuscar.getRawValue();
            modelo.stListado.baseParams.agrupador = vista.agrupador.value;
            modelo.stListado.load({
                params: {
                    idturnotrabajo: vista.cbTurnoTrabajo.getValue(),
                    start: 0,
                    limit: 15,
                    filtro: vista.filtro.getRawValue()
                }, callback: function (rec, opt, suc) {
                    vista.Maskara.hide();
                }
            });
        }, this);

        modelo.stListado.on('beforeload', function (th, opt) {
            scope.limite = opt.params.limit;
        });

        vista.fechaBuscar.on('setValue', function (th, gv, v) {
            if (formatDate(gv.dateFormat('d/m/Y')) != formatDate(v.dateFormat('d/m/Y'))) {
                modelo.stListado.removeAll();
                modelo.stListado.baseParams.fecha = v.dateFormat('d/m/Y');
                modelo.stListado.baseParams.agrupador = vista.agrupador.value;
                modelo.stListado.load({
                    params: {
                        idcausa: vista.cbCausa.getValue(),
                        idturnotrabajo: vista.cbTurnoTrabajo.getValue(),
                        start: 0,
                        limit: scope.limite,
                        filtro: vista.filtro.getRawValue()
                    }, callback: function (rec, opt, suc) {
                        vista.Maskara.hide();
                    }
                });
            }
        });

        function formatDate(date) {
            var explodeDate = date.split('/');
            return parseInt(explodeDate[2] + explodeDate[1] + explodeDate[0]);
        }

        modelo.stListado.on('load', function (th, recs, opt) {
            if (recs.length > 0) {
                vista.grafica.chartType = 'column';
                vista.grafica.chartDatas = modelo.stListado.reader.jsonData.resumen;
                vista.grafica.chartTitle = 'Resumen de la asistencia'
                vista.grafica.chartDataElement = 'Cantidad de personas'
                vista.grafica.renderChart();
                vista.grafica.enable();
            }
            else {
                vista.grafica.chartType = 'column';
                vista.grafica.chartDatas = [{name: 'Cantidad', data: [['No exiten datos.', 0]]}];
                vista.grafica.chartTitle = 'Resumen de la asistencia'
                vista.grafica.chartDataElement = 'Cantidad de personas'
                vista.grafica.renderChart();
                mostrarMensaje(1, idioma.MsgNoDataAsistencia);
                vista.grafica.disable();
            }
        });

        vista.btnGrafica.on('click', function () {
            vista.wingrafica.show();
        }, this);

        vista.agrupador.on('select', function (cb,r,i) {
            modelo.stListado.removeAll();
            modelo.stListado.baseParams.fecha = vista.fechaBuscar.getRawValue();
            modelo.stListado.baseParams.agrupador = vista.agrupador.value;
            modelo.stListado.load({
                params: {
                    idcausa: vista.cbCausa.getValue(),
                    idturnotrabajo: vista.cbTurnoTrabajo.getValue(),
                    start: 0,
                    limit: scope.limite,
                    filtro: vista.filtro.getRawValue()
                }, callback: function (rec, opt, suc) {
                    vista.Maskara.hide();
                }
            });
        });

        vista.btnBuscar.on('click', function () {
            Buscar();
        }, this);

        function Buscar() {
            modelo.stListado.removeAll();
            modelo.stListado.baseParams.fecha = vista.fechaBuscar.getRawValue();
            modelo.stListado.baseParams.agrupador = vista.agrupador.value;
            modelo.stListado.load({
                params: {
                    idcausa: vista.cbCausa.getValue(),
                    idturnotrabajo: vista.cbTurnoTrabajo.getValue(),
                    start: 0,
                    limit: scope.limite,
                    filtro: vista.filtro.getRawValue()
                }, callback: function (rec, opt, suc) {
                    vista.Maskara.hide();
                }
            });
        }

        vista.btnLimpiar.on('click', function () {
            Limpiar();
        }, this);

        function Limpiar() {
            vista.cbCausa.reset();
            vista.cbTurnoTrabajo.reset();
            vista.filtro.reset();
            modelo.stListado.removeAll();
            modelo.stListado.baseParams.idestructura = scope.idestructura;
            modelo.stListado.baseParams.fecha = vista.fechaBuscar.getRawValue();
            modelo.stListado.baseParams.agrupador = vista.agrupador.value;
            modelo.stListado.load({
                params: {
                    idturnotrabajo: vista.cbTurnoTrabajo.getValue(),
                    start: 0,
                    limit: 15,
                    filtro: vista.filtro.getRawValue()
                }, callback: function (rec, opt, suc) {
                    vista.Maskara.hide();
                }
            });
        }

        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'lben',
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 76: { //l para limpiar
                        Limpiar();
                        break;
                    }
                    case 66: { //b para buscar
                        Buscar();
                        break;
                    }
                    case 69: { //e para exportar
                        break;
                    }
                    case 78: { //n para exportar
                        break;
                    }
                }
            }
        }, {
            key: 13,//Enter para buscar
            fn: function () {
                Buscar();
            }
        }]);

    }
}