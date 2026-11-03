Utilidades.Cmp.botonGrafica = function (opciones) {
    var _this = this;
    this.idioma = opciones.idioma;
    this.entidad = opciones.nodeEntidad;
    this.componente = opciones.componente;

    this.winGraficas = null;
    this.Graficas = null;
    this.pGraficas = null;

    if (_this.componente == 'NA') {
        this.mbGrafica = new Ext.Toolbar.MenuButton({
            id: 'btnGraficasPlanificacion',
            disabled: true,
            tooltip: "Graficar",
            iconCls: 'graficar',
            scope: this,
            menu: {
                items: [{
                    id: 'actnivact',
                    itemCls: 'x-menu-item icondistra-reportegrafico',
                    iconCls: 'imagen-none',
                    text: 'Actividades-Niveles de actividad',
                    handler: function () {

                        _this.mostrarVentanaGraficas(_this.entidad, 0);

                    }
                }, {
                    id: 'nivact',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'Niveles de actividad',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 1);
                    }
                }, {
                    id: 'RNA',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'Resumen de gr\xE1ficas',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 2);
                    }
                }]
            }
        });
    }
    if (_this.componente == 'Calculo') {
        this.mbGrafica = new Ext.Toolbar.MenuButton({
            id: 'btnGraficasPlanificacion',
            disabled: true,
            tooltip: "Graficar",
            iconCls: 'graficar',
            scope: this,
            menu: {
                items: [{
                    id: 'calculoing',
                    itemCls: 'x-menu-item icondistra-reportegrafico',
                    iconCls: 'imagen-none',
                    text: 'Relación ingresos-gastos',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 0);
                    }
                }, {
                    id: 'calculoncadenamiento',
                    itemCls: 'x-menu-item icondistra-reportegrafico',
                    iconCls: 'imagen-none',
                    text: 'Encadenamiento',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 1);
                    }
                }, {
                    id: 'cargacapacidad',
                    itemCls: 'x-menu-item icondistra-reportegrafico',
                    iconCls: 'imagen-none',
                    text: 'Carga-capacidad',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 2);
                    }
                }, {
                    id: 'calculoplan',
                    itemCls: 'x-menu-item icondistra-reportegrafico',
                    iconCls: 'imagen-none',
                    text: 'Planes por entidad',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 3);
                    }
                }]
            }
        });
    }
    if (_this.componente == 'Plan') {
        this.mbGrafica = new Ext.Toolbar.MenuButton({
            id: 'btnGraficasPlanificacion',
            disabled: true,
            tooltip: "Graficar",
            iconCls: 'graficar',
            scope: this,
            menu: {
                items: [{
                    id: 'plannordir',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'Plan-Normados y directos',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 0);
                    }
                }, {
                    id: 'planbf',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'Plan Ingresos-gastos',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 1);
                    }
                }, {
                    id: 'planmd',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'Plan-Indicador-v\xEDa',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 2);
                    }
                }, {
                    id: 'planmv',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'Plan Indicador-importe',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 3);
                    }
                }, {
                    id: 'planCB',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'Plan-Resumen por CB',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, _this.idejercicio, _this.ejercicio, 4);
                    }
                }, {
                    id: 'RBP',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'Resumen de gr\xE1ficas',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 4);
                    }
                }]
            }
        });
    }
    if (_this.componente == 'BM') {
        this.mbGrafica = new Ext.Toolbar.MenuButton({
            id: 'btnGraficasPlanificacion',
            disabled: true,
            tooltip: "Graficar",
            iconCls: 'graficar',
            scope: this,
            menu: {
                items: [{
                    id: 'BMCTEnec',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'BM-Relaci\xF3n CTE-necesidad',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 0);
                    }
                }, {
                    id: 'BMCPEdem',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'BM-Relaci\xF3n CPE-demanda',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 1);
                    }
                }, {
                    id: 'RBM',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'Resumen de gr\xE1ficas',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 2);
                    }
                }]
            }
        });
    }
    if (_this.componente == 'CEP') {
        this.mbGrafica = new Ext.Toolbar.MenuButton({
            id: 'btnGraficasPlanificacion',
            disabled: true,
            tooltip: "Graficar",
            iconCls: 'graficar',
            scope: this,
            menu: {
                items: [{
                    id: 'CEPGlobalEntidad',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'CE-Plan-Global por entidad',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 0);
                    }
                }, {
                    id: 'CEPGlobalEntidadIG',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'CE-Plan-Global por entidad (Ingresos/Gastos)',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 1);
                    }
                }, {
                    id: 'CEPTrimestre',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'CE-Plan-Trimestre',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 2);
                    }
                }, {
                    id: 'CEPMesI',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'CE-Plan-Mes-gastos',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 3);
                    }
                }, {
                    id: 'CEPMesG',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'CE-Plan-Mes-ingresos',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 4);
                    }
                }, {
                    id: 'CEPIV',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'CE-Plan-Indicadores valiosos',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 5);
                    }
                }, {
                    id: 'CEPIVFP',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'CE-Plan-Indicadores valiosos fuera de plan',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 6);
                    }
                }, {
                    id: 'CEPIME',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'CE-Plan-Indicadores m\xE1s ejecutados',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 7);
                    }
                }, {
                    id: 'CEPVA',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'CE-Plan-VA',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 8);
                    }
                }]
            }
        });
    }
    if (_this.componente == 'CENA') {
        this.mbGrafica = new Ext.Toolbar.MenuButton({
            id: 'btnGraficasPlanificacionNA',
            disabled: true,
            tooltip: "Graficar",
            iconCls: 'graficar',
            scope: this,
            menu: {
                items: [{
                    id: 'CENAEE',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'CE-NA-Ejecuci\xF3n por entidad',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 0);
                    }
                }, {
                    id: 'CENAEEMesG',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'CE-NA-Mes',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 1);
                    }
                }, {
                    id: 'CENAEEMV',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'CE-NA-Actividades valiosas',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 2);
                    }
                }, {
                    id: 'CENAEEME',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'CE-NA-Actividades ejecutadas',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 3);
                    }
                }, {
                    id: 'CENATotal',
                    itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                    iconCls: 'imagen-none',
                    text: 'CE-NA-Total',
                    handler: function () {
                        _this.mostrarVentanaGraficas(_this.entidad, 4);
                    }
                }]
            }
        });
    }

    this.botonMenuGrafica = function () {
        return this.mbGrafica;
    };

    this.actualizarParametros = function (nodeEntidad, componente) {
        _this.entidad = nodeEntidad;
        _this.componente = componente;

        graficas = _this.getGraficas();
        graficas.actualizarParametros(nodeEntidad, componente);
    };

    this.mostrarVentanaGraficas = function (nodeEntidad, tabActivo) {
        _this.crearVentana();
        _this.actualizarParametros(_this.entidad, _this.componente);
        _this.winGraficas.setTitle(_this.entidad.text);
        _this.winGraficas.show();
        _this.pGraficas.activate(tabActivo);
    };

    this.getGraficas = function () {
        if (_this.Graficas == null)
            _this.Graficas = new Utilidades.Cmp.CmpGrafica({
                idioma: this.idioma,
                nodeEntidad: this.entidad,
                componente: this.componente,
                disabledTabAnalisis: false
            });

        return _this.Graficas;
    }

    this.crearVentana = function () {

        if (_this.Graficas == null)
            _this.Graficas = new Utilidades.Cmp.CmpGrafica({
                idioma: this.idioma,
                nodeEntidad: this.entidad,
                componente: this.componente,
                disabledTabAnalisis: false
            });

        _this.pGraficas = _this.Graficas.panelGraficas();

        this.winGraficas = new Ext.Window({
            title: '',
            closable: true,
            graggable: false,
            maximized: true,
            modal: true,
            border: false,
            layout: 'border',
            closeAction: 'destroy',
            items: [_this.pGraficas],
            listeners: {
                beforedestroy: function (w) {
                    _this.Graficas = null;
                }
            }
        });
    }
}
