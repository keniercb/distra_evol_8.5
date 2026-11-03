Utilidades.Cmp.Cmpgestionargraficas = function () {
    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.BarraProgreso = new BarraEstado();
		this.arrayautores      =[];
		this.arrayinvolucrados =[];

    Ext.ns('Ext.ux.layout');
    Ext.ux.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
        // private
        monitorResize: true,
        // private
        isValidParent: function (c, target) {
            return c.getEl().dom.parentNode == this.innerCt.dom;
        },
        // private
        onLayout: function (ct, target) {
            var rs = ct.items.items, len = rs.length, r, i;

            if (!this.innerCt) {
                target.addClass('ux-row-layout-ct');
                this.innerCt = target.createChild({cls: 'x-row-inner'});
            }
            this.renderAll(ct, this.innerCt);

            var size = target.getViewSize();

            if (size.width < 1 && size.height < 1) { // display none?
                return;
            }

            var h = size.height - target.getPadding('tb'),
                ph = h;

            this.innerCt.setSize({height: h});

            // some rows can be percentages while others are fixed
            // so we need to make 2 passes

            for (i = 0; i < len; i++) {
                r = rs[i];
                if (!r.rowHeight) {
                    ph -= (r.getSize().height + r.getEl().getMargins('tb'));
                }
            }

            ph = ph < 0 ? 0 : ph;

            for (i = 0; i < len; i++) {
                r = rs[i];
                if (r.rowHeight) {
                    r.setSize({height: Math.floor(r.rowHeight * ph) - r.getEl().getMargins('tb')});
                }
            }
        }

        /**
         * @property activeItem
         * @hide
         */
    });
    Ext.Container.LAYOUTS['ux.row'] = Ext.ux.layout.RowLayout;
    Ext.QuickTips.init();


    /**********************************
     * Inicio Opciones de busqueda por involucrados
     * ************************************************/

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    this.btnBusquedaSimple = new Ext.Button({
		    handler: function () {
				    _this.btnBusquedaSimple.focus();
				    _this.arrayautores      = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
				    _this.arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();

				     var tabseleccionado=_this.tpGraficas.getActiveTab();

				    if (tabseleccionado == _this.tipoActividad) {
						    _this.cargarTipoActividades();
						    _this.cbPlanes.enable();

				    } else if (tabseleccionado == _this.panelContenedor) {
						    _this.cargarGraficasAct();
						    _this.cbPlanes.enable();

				    } else if (tabseleccionado == _this.criterioMedida) {
						    _this.cbPlanes.disable();
						    _this.cargarCriterioObj();

				    } else if (tabseleccionado == _this.tipoFip) {
						    _this.cargarTipoFip();
						    _this.cbPlanes.disable();

				    } else if (tabseleccionado == _this.panelTiempoP) {
						    _this.cargarTiepoPlanificado();
						    _this.cbPlanes.enable();

				    } else if (tabseleccionado == _this.eficiencia) {
						    _this.cargarEficienciaPlan();
						    _this.cbPlanes.enable();

				    } else if (tabseleccionado == _this.desviaciones) {
						    _this.cargarDesviaciones();
						    _this.cbPlanes.enable();

				    } else if (tabseleccionado == _this.panelPostAprobNuevo) {
						    _this.cargarPostAprob();
						    _this.cbPlanes.enable();

				    } else if (tabseleccionado == _this.panelCalidad) {
						    _this.cargarCalidad();
						    _this.cbPlanes.enable();
				    }

				},
		    text: 'Buscar',
		    iconCls: 'buscar',
		    tooltip: 'Buscar por autor(es) o involucrado(s)',
		    key: {
				    alt: true,
				    key: 'B'
		    },
		    scope: this
    });

		this.tpAutoresInvolucrados = _this.objclasificadorinvol.CrearClasificadorInvolBusqueda(tipoelemento = 3, 2);

    this.fpBuscarInvolucrados = new Ext.form.FormPanel({
		    id: 'fpbusqueda',
		    frame: true,
		    layout: 'fit',
		    items: [_this.tpAutoresInvolucrados],
		    buttons: [_this.btnBusquedaSimple],
		    listeners: {
				    clientvalidation: function (form, valid) {
						    (_this.objclasificadorinvol.verificarAutoresInvolBusqueda) ? _this.btnBusquedaSimple.enable() : _this.btnBusquedaSimple.disable();
				    }
		    }
    });

    //panel donde se muestran las opciones de busqueda de actividades
    this.pBuscarInvolucrados = new Ext.Panel({
		    title: 'Opciones de b&uacute;squeda',
		    layout: 'fit',
		    width: 300,
		    collapsible: true,
		    collapsed: true,
		    //autoScroll: true,
		    margins: '3 3 3 3',
		    region: 'east',
		    items: [_this.fpBuscarInvolucrados],
		    usarKeymap: true,
		    botonesKeymap: [_this.btnBusquedaSimple],
		    //buttons: [_this.btnBusquedaSimple],
		    listeners: {
				    expand: function (p) {
						    p.doLayout();
				    }
		    }
    });


		/****************************************
     * Fin Opciones de busqueda por involucrados
     * ******************************************************/


    this.fechaInicio = new Ext.form.DateField({
        fieldLabel: 'Fecha de inicio',
        format: 'd/m/Y',
        name: 'fechainipareto',
        id: 'fechainipareto',
        //value: new Date().format('d/m/Y'),
        emptyText: 'Seleccione',
        endDateField: 'fechafinpareto',
        allowBlank: true,
        vtype: 'daterange',
        anchor: '90%',
        width: 100,
        menuListeners: {
            select: function (df, date) {
                _this.fechaInicio.setValue(date);
                if(_this.fechaFin.getValue() == '') {
                    fechaFin = '';
                } else {
                    fechaFin = _this.fechaFin.getValue().format('Y/m/d');
                }
                if(_this.fechaInicio.getValue() == '') {
                    fechaInicio = '';
                } else {
                    fechaInicio = _this.fechaInicio.getValue().format('Y/m/d');
                }
                if(_this.tpGraficas.getActiveTab().id == 'panelPostAprobNuevo') {
                    _this.cargarPostAprob(_this.cbPlanes.getValue(), fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'panelCalidad') {
                    _this.cargarCalidad(_this.cbPlanes.getValue(), fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'panelTiempoP') {
                    _this.cargarTiepoPlanificado(_this.cbPlanes.getValue(), fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'panelContenedor') {
                    _this.cargarGraficasAct(_this.cbPlanes.getValue(), fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'tipoActividad') {
                    _this.cargarTipoActividades(_this.cbPlanes.getValue(), fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'criterioMedida') {
                    _this.cargarCriterioObj(fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'tipoFip') {
                    _this.cargarTipoFip(fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'eficiencia') {
                    _this.cargarEficienciaPlan(_this.cbPlanes.getValue(), fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'desviaciones') {
                    _this.cargarDesviaciones(_this.cbPlanes.getValue(), fechaInicio, fechaFin);

                }
            }
        }
    });
    this.fechaFin = new Ext.form.DateField({
        fieldLabel: 'Fecha de fin',
        disabled: false,
        format: 'd/m/Y',
        name: 'fechafinpareto',
        id: 'fechafinpareto',
        //value: new Date().format('d/m/Y'),
        emptyText: 'Seleccione',
        vtype: 'daterange',
        anchor: '90%',
        width: 100,
        menuListeners: {
            select: function (df, date) {
                _this.fechaFin.setValue(date);
                if(_this.fechaFin.getValue() == '') {
                    fechaFin = '';
                } else {
                    fechaFin = _this.fechaFin.getValue().format('Y/m/d');
                }
                if(_this.fechaInicio.getValue() == '') {
                    fechaInicio = '';
                } else {
                    fechaInicio = _this.fechaInicio.getValue().format('Y/m/d');
                }
                if(_this.tpGraficas.getActiveTab().id == 'panelPostAprobNuevo') {
                    _this.cargarPostAprob(_this.cbPlanes.getValue(), fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'panelCalidad') {
                    _this.cargarCalidad(_this.cbPlanes.getValue(), fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'panelTiempoP') {
                    _this.cargarTiepoPlanificado(_this.cbPlanes.getValue(), fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'panelContenedor') {
                    _this.cargarGraficasAct(_this.cbPlanes.getValue(), fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'tipoActividad') {
                    _this.cargarTipoActividades(_this.cbPlanes.getValue(), fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'criterioMedida') {
                    _this.cargarCriterioObj(fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'tipoFip') {
                    _this.cargarTipoFip(fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'eficiencia') {
                    _this.cargarEficienciaPlan(_this.cbPlanes.getValue(), fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'desviaciones') {
                    _this.cargarDesviaciones(_this.cbPlanes.getValue(), fechaInicio, fechaFin);

                }

            }
        }
    });

    this.btnLimpiar = new Ext.Button({
        iconCls: 'limpiar',
        disabled: false,
        handler: function () {
            _this.cbPlanes.reset();
            _this.fechaInicio.reset();
            _this.fechaFin.reset();
            _this.arrayautores=[];
            _this.arrayinvolucrados=[];
            if(_this.tpGraficas.getActiveTab().id == 'panelPostAprobNuevo') {
                _this.cargarPostAprob();
            } else if(_this.tpGraficas.getActiveTab().id == 'panelCalidad') {
                _this.cargarCalidad();
            } else if(_this.tpGraficas.getActiveTab().id == 'panelTiempoP') {
                _this.cargarTiepoPlanificado();
            } else if(_this.tpGraficas.getActiveTab().id == 'panelContenedor') {
                _this.cargarGraficasAct();
            } else if(_this.tpGraficas.getActiveTab().id == 'tipoActividad') {
                _this.cargarTipoActividades();
            } else if(_this.tpGraficas.getActiveTab().id == 'criterioMedida') {
                _this.cargarCriterioObj();
            } else if(_this.tpGraficas.getActiveTab().id == 'tipoFip') {
                _this.cargarTipoFip();
            } else if(_this.tpGraficas.getActiveTab().id == 'eficiencia') {
                _this.cargarEficienciaPlan();
            } else if(_this.tpGraficas.getActiveTab().id == 'desviaciones') {
                _this.cargarDesviaciones();
            }
        },
        tooltip: 'Limpiar filtros',
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });

    /*this.btnGenerarPareto = new Ext.Button({
     iconCls: 'graficar',
     disabled: false,
     handler: function () {
     _this.CargarCmpGraficas();
     },
     tooltip: 'Generar diagrama',
     key: {
     ctrl: true ,
     key: 'G'
     },
     scope: this
     });*/
    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaGraficas',
        text: 'Ayuda',
        iconCls: 'ayuda',
        disabled: false,
        key: {
            alt: true,
            key: 'H'
        },
        scope: this
    });
    this.stcbcbPlanes = new Ext.data.Store({
        url: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/cargarComboPlanes',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            id: 'idplan',
            root: "data"
        }, [{
            name: 'idplan'
        }, {
            name: 'denominacion'
        }])
    });
    this.cbPlanes = new Ext.form.ComboBox({
        store: _this.stcbcbPlanes,
        displayField: 'denominacion',
        valueField: 'idplan',
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        width: 100,
        emptyText: 'Seleccione',
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        listeners: {
            expand: function (combo) {
                _this.stcbcbPlanes.reload();
            },
            select: function (cb, record, index) {
                if(_this.fechaFin.getValue() == ''){
                    fechaFin = '';
                } else {
                    fechaFin = _this.fechaFin.getValue().format('Y/m/d');
                }
                if(_this.fechaInicio.getValue() == ''){
                    fechaInicio = '';
                } else {
                    fechaInicio = _this.fechaInicio.getValue().format('Y/m/d');
                }
                if(_this.tpGraficas.getActiveTab().id == 'panelPostAprobNuevo') {
                    _this.cargarPostAprob(cb.value, fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'panelCalidad') {
                    _this.cargarCalidad(cb.value, fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'panelTiempoP') {
                    _this.cargarTiepoPlanificado(cb.value, fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'panelContenedor') {
                    _this.cargarGraficasAct(cb.value, fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'tipoActividad') {
                    _this.cargarTipoActividades(cb.value, fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'criterioMedida') {
                    _this.cargarCriterioObj(fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'eficiencia') {
                    _this.cargarEficienciaPlan(cb.value, fechaInicio, fechaFin);

                } else if(_this.tpGraficas.getActiveTab().id == 'desviaciones') {
                    _this.cargarDesviaciones(cb.value, fechaInicio, fechaFin);
                }
            }
        }
    });

    //*******calidad de la planificacion ********
    this.panelCantidadCalidad = new Ext.Panel({
        id: 'panelCantidadCalidad',
        layout: 'fit',
        region: 'west',
        width: '50%',
        border: false,
        html: '<div id = "containerCantidadCalidad" ></div>'
    });
    this.panelPorcientoCalidad = new Ext.Panel({
        id: 'panelPorcientoCalidad',
        layout: 'fit',
        region: 'center',
        width: '50%',
        border: false,
        html: "<div id = 'containerPorcientoCalidad' ></div>"
    });
    this.panelTrimestreCalidad = new Ext.Panel({
        id: 'panelTrimestreCalidad',
        layout: 'fit',
        region: 'center',
        //width: '50%',
        border: false,
        html: "<div id = 'containerTrimestreCalidad' ></div>"
    });
    this.panelUp = new Ext.Panel({
        id: 'panelUp',
        layout: 'border',
        region: 'center',
        border: false,
        width: '100%',
        height: '50%',
        bodyStyle: 'background: white',
        items: [_this.panelCantidadCalidad, _this.panelPorcientoCalidad]
    });
    this.panelDown = new Ext.Panel({
        id: 'panelDown',
        layout: 'border',
        region: '.67+',
        border: false,
        height: '50%',
        bodyStyle: 'background: white',
        items: [_this.panelTrimestreCalidad]
    });
    this.panelCalidad = new Ext.Panel({
        id: 'panelCalidad',
        title: 'Calidad de la planificaci\xf3n',
        border: false,
        height: '100%',
        layout: 'ux.row',
        items: [{
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [_this.panelUp]
        }, {
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [_this.panelDown]
        }]
    });

    //*******Post-Aprobacion ********
    this.panelComport = new Ext.Panel({
        id: 'containerComport',
        layout: 'fit',
        region: 'west',
        width: '50%',
        border: false,
        html: '<div id = "containerComportamiento" ></div>'
    });
    this.panelComportTri = new Ext.Panel({
        id: 'panelComportTri',
        layout: 'fit',
        region: 'center',
        width: '50%',
        border: false,
        html: "<div id = 'containerComportTri' ></div>"
    });
    this.panelPostAprobNuevo = new Ext.Panel({
        id: 'panelPostAprobNuevo',
        title: 'Post-aprobaci\xf3n',
        layout: 'border',
        region: 'center',
        border: false,
        bodyStyle: 'background: white',
        items: [_this.panelComport, _this.panelComportTri]
    });

    //*******Tiempo planificado ********
    this.panelTiepoPlanificado = new Ext.Panel({
        id: 'panelTiepoPlanificado',
        layout: 'fit',
        region: 'west',
        width: '50%',
        border: false,
        html: '<div id = "containerTiempoPlan" ></div>'
    });
    this.panelVistaEjecucion = new Ext.Panel({
        id: 'panelVistaEjecucion',
        layout: 'fit',
        region: 'center',
        width: '50%',
        border: false,
        html: "<div id = 'containerVistaEje' ></div>"
    });
    this.panelEvolMes = new Ext.Panel({
        id: 'panelEvolMes',
        layout: 'fit',
        region: 'west',
        width: '50%',
        border: false,
        html: "<div id = 'containerEvolucionMes' ></div>"
    });
    this.panelEvolTri = new Ext.Panel({
        id: 'panelEvolTri',
        layout: 'fit',
        region: 'center',
        width: '50%',
        border: false,
        html: "<div id = 'containerEvolucionTri' ></div>"
    });
    this.panelAlto = new Ext.Panel({
        id: 'panelAlto',
        layout: 'border',
        region: 'center',
        border: false,
        width: '100%',
        height: '50%',
        bodyStyle: 'background: white',
        items: [_this.panelTiepoPlanificado, _this.panelVistaEjecucion]
    });
    this.panelBajo = new Ext.Panel({
        id: 'panelBajo',
        layout: 'border',
        region: '.67+',
        border: false,
        height: '50%',
        bodyStyle: 'background: white',
        items: [_this.panelEvolMes, _this.panelEvolTri]
    });
    this.panelTiempoP = new Ext.Panel({
        id: 'panelTiempoP',
        title: 'Tiempo planificado',
        border: false,
        height: '100%',
        layout: 'ux.row',
        items: [{
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [_this.panelAlto]
        }, {
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [_this.panelBajo]
        }]
    });

    //******* Cumplimiento de actividad ********
    this.panelDisciplina = new Ext.Panel({
        id: 'containerDisciplina',
        layout: 'fit',
        region: 'west',
        width: '50%',
        border: false,
        html: '<div id = "containerDisciplina" ></div>'
    });
    this.panelValorizacion = new Ext.Panel({
        id: 'containerValorizacion',
        layout: 'fit',
        region: 'center',
        width: '50%',
        border: false,
        html: "<div id = 'containerValorizacion' ></div>"
    });
    this.panelBalance = new Ext.Panel({
        id: 'containerBalance',
        layout: 'fit',
        region: 'west',
        width: '50%',
        border: false,
        html: "<div id = 'containerBalance' ></div>"
    });
    this.panelPesoBalance = new Ext.Panel({
        id: 'containerPesoBalance',
        layout: 'fit',
        region: 'center',
        width: '50%',
        border: false,
        html: "<div id = 'containerPesoBalance' ></div>"
    });
    this.panelNorte = new Ext.Panel({
        id: 'panelNorte',
        layout: 'border',
        region: 'center',
        border: false,
        width: '100%',
        height: '50%',
        bodyStyle: 'background: white',
        items: [_this.panelDisciplina, _this.panelValorizacion]
    });
    this.panelSur = new Ext.Panel({
        id: 'panelSur',
        layout: 'border',
        region: '.67+',
        border: false,
        height: '50%',
        bodyStyle: 'background: white',
        items: [_this.panelBalance, _this.panelPesoBalance]
    });
    this.panelContenedor = new Ext.Panel({
        id: 'panelContenedor',
        title: 'Cumplimiento de actividades',
        border: false,
        height: '100%',
        layout: 'ux.row',
        items: [{
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [_this.panelNorte]
        }, {
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [_this.panelSur]
        }]
    });
    // ****** Tipo de catividad  ********
    this.panelTipoAct = new Ext.Panel({
        id: 'containerTipoAct',
        layout: 'fit',
        region: 'west',
        width: '50%',
        border: false,
        html: "<div id = 'containerTipoAct' ></div>"
    });
    this.panelPesoAct = new Ext.Panel({
        id: 'containerPesoAct',
        layout: 'fit',
        region: 'center',
        width: '50%',
        border: false,
        html: "<div id = 'containerPesoAct' ></div>"
    });
    this.tipoActividad = new Ext.Panel({
        id: 'tipoActividad',
        title: 'Tipos de actividades',
        layout: 'border',
        region: 'center',
        border: false,
        bodyStyle: 'background: white',
        items: [_this.panelTipoAct, _this.panelPesoAct]
    });
    // ****** Criterios de medida por objetivos ********
    this.panelCriterio = new Ext.Panel({
        id: 'containerCriterio',
        layout: 'fit',
        region: 'west',
        width: '50%',
        border: false,
        html: "<div id = 'containerCriterio' ></div>"
    });
    this.panelEficiencia = new Ext.Panel({
        id: 'containerEficiencia',
        layout: 'fit',
        region: 'center',
        width: '50%',
        border: false,
        html: "<div id = 'containerEficiencia' ></div>"
    });
    this.criterioMedida = new Ext.Panel({
        id: 'criterioMedida',
        title: 'Criterios de medida',
        layout: 'border',
        region: 'center',
        border: false,
        bodyStyle: 'background: white',
        items: [_this.panelCriterio, _this.panelEficiencia]
    });
    //******* FIP ********
    this.panelCumplimientoFip = new Ext.Panel({
        id: 'panelCumplimientoFip',
        layout: 'fit',
        region: 'center',
        width: '50%',
        border: false,
        html: '<div id = "containerCumplimientoFip" ></div>'
    });
    this.panelAtrazoFip = new Ext.Panel({
        id: 'panelAtrazoFip',
        layout: 'fit',
        region: 'west',
        width: '50%',
        border: false,
        html: "<div id = 'containerAtrazoFip' ></div>"
    });
    this.panelCantFip = new Ext.Panel({
        id: 'cantFip',
        layout: 'fit',
        region: 'west',
        width: '50%',
        border: false,
        html: "<div id = 'containerCantFip' ></div>"
    });
    this.panelCumplFip = new Ext.Panel({
        id: 'cumplFip',
        layout: 'fit',
        region: 'center',
        width: '50%',
        border: false,
        html: "<div id = 'containerCumplFip' ></div>"
    });
    this.panelArriba = new Ext.Panel({
        id: 'panelArriba',
        layout: 'border',
        region: 'center',
        border: false,
        width: '100%',
        height: '50%',
        bodyStyle: 'background: white',
        items: [_this.panelAtrazoFip, _this.panelCumplimientoFip]
    });
    this.panelAbajo = new Ext.Panel({
        id: 'panelAbajo',
        layout: 'border',
        region: '.67+',
        border: false,
        height: '50%',
        bodyStyle: 'background: white',
        items: [_this.panelCantFip, _this.panelCumplFip]
    });
    this.tipoFip = new Ext.Panel({
        id: 'tipoFip',
        title: 'Tipos de FIP',
        border: false,
        height: '100%',
        layout: 'ux.row',
        items: [{
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [_this.panelArriba]
        }, {
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [_this.panelAbajo]
        }]
    });
    // ***** Ineficiencia en el cumplimiento ******
    this.eficiencia = new Ext.Panel({
        id: 'eficiencia',
        title: 'Eficiencia',
        layout: 'fit',
        region: 'center',
        width: '50%',
        border: false,
        html: "<div id = 'containerEficienciaPlan' ></div>"
    });
    // ****** DESVIACIONES ********
    this.panelDesvTotal = new Ext.Panel({
        id: 'desvTotal',
        layout: 'fit',
        region: 'west',
        width: '50%',
        border: false,
        html: "<div id = 'containerDesvTotal' ></div>"
    });
    this.panelDesvCant = new Ext.Panel({
        id: 'desvCant',
        layout: 'fit',
        region: 'center',
        width: '50%',
        border: false,
        html: "<div id = 'containerDesvCant' ></div>"
    });
    this.desviaciones = new Ext.Panel({
        id: 'desviaciones',
        title: 'Desviaciones',
        layout: 'border',
        region: 'center',
        border: false,
        bodyStyle: 'background: white',
        items: [_this.panelDesvTotal, _this.panelDesvCant]
    });

    //tabpanel donde muestro los tipos de graficos
    this.tpGraficas = new Ext.TabPanel({
        activeTab: 0,
        frame: true,
		    region: 'center',
        items: [_this.panelContenedor, _this.panelTiempoP, _this.panelCalidad, _this.tipoActividad,
            _this.criterioMedida, _this.tipoFip, _this.eficiencia, _this.desviaciones,
            _this.panelPostAprobNuevo],
        listeners: {
            tabchange: function (tabpanel, tabseleccionado) {
                if (tabseleccionado == _this.tipoActividad) {
                    _this.cargarTipoActividades();
                    _this.cbPlanes.enable();

                } else if (tabseleccionado == _this.panelContenedor) {
                    _this.cargarGraficasAct();
                    _this.cbPlanes.enable();

                } else if (tabseleccionado == _this.criterioMedida) {
                    _this.cbPlanes.disable();
                    _this.cargarCriterioObj();

                } else if (tabseleccionado == _this.tipoFip) {
                    _this.cargarTipoFip();
                    _this.cbPlanes.disable();

                } else if (tabseleccionado == _this.panelTiempoP) {
                    _this.cargarTiepoPlanificado();
                    _this.cbPlanes.enable();

                } else if (tabseleccionado == _this.eficiencia) {
                    _this.cargarEficienciaPlan();
                    _this.cbPlanes.enable();

                } else if (tabseleccionado == _this.desviaciones) {
                    _this.cargarDesviaciones();
                    _this.cbPlanes.enable();

                } else if (tabseleccionado == _this.panelPostAprobNuevo) {
                    _this.cargarPostAprob();
                    _this.cbPlanes.enable();

                } else if (tabseleccionado == _this.panelCalidad) {
                    _this.cargarCalidad();
                    _this.cbPlanes.enable();
                }
            }
        }
    });

		//panel principal de la vista
		this.PanelInvolucrados = new Ext.Panel({
				layout: 'border',
				region: 'center',
				usarKeymap: true,
				items: [
						_this.tpGraficas, _this.pBuscarInvolucrados
        ]})


    this.WinPrincipal = new Ext.Window({
		    layout: 'border',
        closable: false,
        graggable: false,
        maximized: true,
        noTitle:true,
        modal: true,
        tbar: ['Planes :', _this.cbPlanes, '-', 'Fecha de inicio : ', _this.fechaInicio,
            '-', 'Fecha de fin : ', _this.fechaFin, '-', _this.btnLimpiar,
            '->', _this.btnAyuda],
        usarKeymap: true,
        botonesKeymap: [_this.btnLimpiar, _this.btnAyuda],
        items: [_this.PanelInvolucrados]
    });
    //funcion donde se procede a cargar la plantilla
    this.CargarCmpGraficas = function () {
        _this.WinPrincipal.show();
        _this.cargarGraficasAct();
    };
    this.cargarGraficasAct = function (idplan, fechaI, fechaF) {
        _this.BarraProgreso.show('Cargando diagrama');
        _this.cargarDisciplina(idplan, fechaI, fechaF);
        _this.cargarValorizacion(idplan, fechaI, fechaF);
        _this.cargarBalance(idplan, fechaI, fechaF);
        _this.cargarPesoBalance(idplan, fechaI, fechaF);
    };
    this.cargarPostAprob = function (idplan, fechaI, fechaF) {
        _this.BarraProgreso.show('Cargando diagrama');
        _this.cargarComportamiento(idplan, fechaI, fechaF);
        _this.cargarCompTri(idplan, fechaI, fechaF);
    };

    this.cargarTiepoPlanificado = function (idplan, fechaI, fechaF) {
        _this.BarraProgreso.show('Cargando diagrama');
        _this.cargarTiempoPlan(idplan, fechaI, fechaF);
        _this.cargarVistaEje(idplan, fechaI, fechaF);
        _this.cargarEvolucionMes(idplan, fechaI, fechaF);
        _this.cargarEvolucionTri(idplan, fechaI, fechaF);
    };

    this.cargarCalidad = function (idplan, fechaI, fechaF) {
        _this.BarraProgreso.show('Cargando diagrama');
        _this.cargarCantidadCalidad(idplan, fechaI, fechaF);
        _this.cargarPorcientoCalidad(idplan, fechaI, fechaF);
       // _this.cargarPesoCalidad();
        _this.cargarTrimestreCalidad(idplan, fechaI, fechaF);
    };

    //funcion donde retorno el panel
    this.obtenerPanelGraficasDAct = function () {
        _this.cargarDisciplina();
        _this.cargarValorizacion();
        _this.cargarBalance();
        _this.cargarPesoBalance();
        return _this.panelContenedor;
    };
    //funcion donde retorno el panel
    this.obtenerPanelGraficasCriterio = function () {
        _this.cargarCriterio();
        _this.cargarEficienciaCriterio();
        return _this.criterioMedida;
    };
    this.cargarTipoActividades = function (idplan, fechaI, fechaF) {
        _this.BarraProgreso.show('Cargando diagrama');
        _this.cargarPesoAct(idplan, fechaI, fechaF);
        _this.cargarTipoAct(idplan, fechaI, fechaF);
    };
    this.cargarCriterioObj = function (fechaI, fechaF) {
        _this.BarraProgreso.show('Cargando diagrama');
        _this.cargarCriterio(fechaI, fechaF);
        _this.cargarEficienciaCriterio(fechaI, fechaF);
    };
    this.cargarTipoFip = function (fechaI, fechaF) {
        _this.BarraProgreso.show('Cargando diagrama');
        _this.cargarCantFip(fechaI, fechaF);
        _this.cargarCumplFip(fechaI, fechaF);
        _this.cargarCumplimientoFip(fechaI, fechaF);
        _this.cargarAtrazoFip(fechaI, fechaF);
    };
    this.cargarDesviaciones = function (idplan, fechaI, fechaF) {
        _this.BarraProgreso.show('Cargando diagrama');
        _this.cargarDesvTotal(idplan, fechaI, fechaF);
        _this.cargarDesvCant(idplan, fechaI, fechaF);
    };

    //************* Cumplimiento de actividades ******************
    this.cargarDisciplina = function (idplan, fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarDisciplina',
            params: {
                idplan: idplan,
                fechainicio: fechaI,
                fechafin: fechaF,
                peso: 0,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                $(function () {
                    $('#containerDisciplina').highcharts({
                        chart: {
                            type: 'pie',
                            zoomType: 'xy',
                            height: _this.panelDisciplina.getInnerHeight()
                        },
                        title: {
                            text: 'Disciplina en el cumplimiento'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}: {point.y:.1f} %'
                                },
                                shadow: true
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.cant}</b> actividad(es)</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span> ' +
                            '<span style="font-size: 12px"><b> {point.y:.2f} %</b> del total</span><br/>'
                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };
    this.cargarValorizacion = function (idplan, fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarDisciplina',
            params: {
                idplan: idplan,
                fechainicio: fechaI,
                fechafin: fechaF,
                peso: 1,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerValorizacion').highcharts({
                        chart: {
                            type: 'pie',
                            zoomType: 'xy',
                            height: _this.panelValorizacion.getInnerHeight()
                        },
                        title: {
                            text: 'Valorizaci\xf3n del cumplimiento'
                        },
                        plotOptions: {
                            pie: {
                                innerSize: 200,
                                allowPointSelect: true
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}: {point.y:.1f} %'
                                },
                                shadow: true
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> Peso:</b> {point.cant}</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span> ' +
                            '<span style="font-size: 12px"><b> {point.y:.2f} %</b> del total</span><br/>'
                        },
                        series: [{
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };
    this.cargarBalance = function (idplan, fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarBalance',
            params: {
                idplan: idplan,
                fechainicio: fechaI,
                fechafin: fechaF,
                peso: 0,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerBalance').highcharts({
                        chart: {
                            type: 'column',
                            zoomType: 'xy',
                            height: _this.panelBalance.getInnerHeight()
                        },
                        title: {
                            text: 'Balance de actividades activas'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        yAxis: {
                            title: {
                                text: ''
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y}'
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"> {point.text}</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.y}</b> actividad(es)</span><br/>'
                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };
    this.cargarPesoBalance = function (idplan, fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarBalance',
            params: {
                idplan: idplan,
                fechainicio: fechaI,
                fechafin: fechaF,
                peso: 1,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerPesoBalance').highcharts({
                        chart: {
                            type: 'column',
                            zoomType: 'xy',
                            height: _this.panelPesoBalance.getInnerHeight()
                        },
                        title: {
                            text: 'Peso del balance de actividades activas'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        yAxis: {
                            title: {
                                text: ''
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y}'
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"> {point.text}</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> Peso:</b> {point.y}</span><br/>'

                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };
    //************* Tipos de actividad ******************
    this.cargarPesoAct = function (idplan, fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarTipoAct',
            params: {
                idplan: idplan,
                fechainicio: fechaI,
                fechafin: fechaF,
                peso: 1,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                $(function () {
                    $('#containerPesoAct').highcharts({
                        chart: {
                            type: 'pie',
                            zoomType: 'xy',
                            height: _this.panelPesoAct.getInnerHeight()
                        },
                        title: {
                            text: 'Valor (peso) del tiempo invertido'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}: {point.y:.1f} %'
                                },
                                shadow: true
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> Peso:</b> {point.cant}</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span> ' +
                            '<span style="font-size: 12px"><b> {point.y:.2f} %</b> del total</span><br/>'+
                            '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.act}</b> actividad(es)</span><br/>'
                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };
    this.cargarTipoAct = function (idplan, fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarTipoAct',
            params: {
                idplan: idplan,
                fechainicio: fechaI,
                fechafin: fechaF,
                peso: 0,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerTipoAct').highcharts({
                        chart: {
                            type: 'column',
                            zoomType: 'xy',
                            height: _this.panelTipoAct.getInnerHeight()
                        },
                        title: {
                            text: 'Tiempo total invertido por tipo de actividad (hora(s))'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        yAxis: {
                            title: {
                                text: ''
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y}'
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.y}</b> hora(s)</span><br/>'+
                            '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.act}</b> actividad(es)</span><br/>'
                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };
    //************* Criterios de medida ******************
    this.cargarCriterio = function (fechaI, fechaF, idobjetivo) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarCriterio',
            params: {
                idobjetivo: idobjetivo,
                fechainicio: fechaI,
                fechafin: fechaF,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                $(function () {
                    $('#containerCriterio').highcharts({
                        chart: {
                            type: 'column',
                            zoomType: 'xy',
                            height: _this.panelCriterio.getInnerHeight()
                        },
                        title: {
                            text: 'Valorizaci\xf3n de los criterios de medida por objetivo'
                        },
                        xAxis: {
                            categories: respuesta.categories
                        },
                        yAxis: {
                            title: {
                                text: ''
                            }
                        },
                        tooltip: {
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y}'
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        series: respuesta.data
                    });
                });
            }
        });
    };
    this.cargarEficienciaCriterio = function (fechaI, fechaF, idobjetivo) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarCriterio',
            params: {
                idobjetivo: idobjetivo,
                fechainicio: fechaI,
                fechafin: fechaF,
                eficiencia: 1,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerEficiencia').highcharts({
                        chart: {
                            type: 'column',
                            zoomType: 'xy',
                            height: _this.panelEficiencia.getInnerHeight()
                        },
                        title: {
                            text: 'Eficiencia global'
                        },
                        xAxis: {
                            categories: respuesta.categories
                        },
                        yAxis: {
                            title: {
                                text: ''
                            }
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y}'
                                },
                                shadow: true
                            }
                        },
                        series: respuesta.data
                    });
                });
            }
        });
    };

    //************* Tipos de FIP ******************
    this.cargarCantFip = function (fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarTipoFip',
            params: {
                fechainicio: fechaI,
                fechafin: fechaF,
                cumplimiento: 0,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                $(function () {
                    $('#containerCantFip').highcharts({
                        chart: {
                            type: 'pie',
                            zoomType: 'xy',
                            height: _this.panelCantFip.getInnerHeight()
                        },
                        title: {
                            text: 'Cantidad de FIPs por tipos'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}: {point.cant} FIP(s)'
                                },
                                shadow: true
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.cant}</b> FIP(s)</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span> ' +
                            '<span style="font-size: 12px"><b> {point.y} %</b> del total</span><br/>'
                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };


    //containerCumplimientoFip

    this.cargarCumplimientoFip = function (fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarCumplFip',
            params: {
                fechainicio: fechaI,
                fechafin: fechaF,
                cumplimiento: 1,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                $(function () {
                    $('#containerCumplimientoFip').highcharts({
                        chart: {
                            type: 'pie',
                            zoomType: 'xy',
                            height: _this.panelCumplimientoFip.getInnerHeight()
                        },
                        title: {
                            text: 'Cumplimiento de los FIP'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}: {point.cant} FIP(s)'
                                },
                                shadow: true
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.cant}</b> FIP(s)</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span> ' +
                            '<span style="font-size: 12px"><b> {point.y} %</b> del total</span><br/>'
                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };


    //containerAtrazoFip

    this.cargarAtrazoFip = function (fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarCumplFip',
            params: {
                fechainicio: fechaI,
                fechafin: fechaF,
                cumplimiento: 0,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                $(function () {
                    $('#containerAtrazoFip').highcharts({
                        chart: {
                            type: 'bar',
                            zoomType: 'xy',
                            height: _this.panelAtrazoFip.getInnerHeight()
                        },
                        title: {
                            text: 'Cantidad de FIPs atrasados'
                        },
                        xAxis: {
                            categories: ['En tiempo', 'Atrasados'],
                            title: {
                                text: null
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: ''
                            },
                            allowDecimals: false
                        },
                        plotOptions: {
                            bar: {
                                dataLabels: {
                                    enabled: true
                                }
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y} FIP(s)'
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.y}</b> FIP(s)</span><br/>'
                        },
                        series: [{
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };



    this.cargarCumplFip = function (fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarTipoFip',
            params: {
                fechainicio: fechaI,
                fechafin: fechaF,
                cumplimiento: 1,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerCumplFip').highcharts({
                        chart: {
                            type: 'column',
                            zoomType: 'xy',
                            height: _this.panelCumplFip.getInnerHeight()
                        },
                        title: {
                            text: 'Cumplimiento de los FIPs por tipos'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        yAxis: {
                            title: {
                                text: ''
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y} %'
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.cant}</b> FIP(s)</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"> Cumplimiento<b> {point.y}</b> %</span><br/>'
                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };

    //************* Tiempo planificado ******************
    this.cargarTiempoPlan = function (idplan, fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarTiempoPlan',
            params: {
                idplan: idplan,
                fechainicio: fechaI,
                fechafin: fechaF,
                cumplimiento: 0,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerTiempoPlan').highcharts({
                        chart: {
                            type: 'pie',
                            zoomType: 'xy',
                            height: _this.panelTiepoPlanificado.getInnerHeight()
                        },
                        title: {
                            text: 'Tiempo planificado vs tiempo disponible'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}: {point.cant} hora(s)'
                                },
                                shadow: true
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.cant}</b> hora(s)</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span> ' +
                            '<span style="font-size: 12px"><b> {point.y} %</b> del total</span><br/>'
                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };
    this.cargarVistaEje = function (idplan, fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarEjecucion',
            params: {
                idplan: idplan,
                fechainicio: fechaI,
                fechafin: fechaF,
                ejecucion: 1,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                $(function () {
                    $('#containerVistaEje').highcharts({
                        chart: {
                            type: 'column',
                            zoomType: 'xy',
                            height: _this.panelVistaEjecucion.getInnerHeight()
                        },
                        title: {
                            text: 'Vista detalle de ejecuci\xf3n: total / mes / semana'
                        },
                        xAxis: {
                            categories: ['Total de actividades', 'Este mes', 'Esta semana']
                        },
                        yAxis: {
                            title: {
                                text: ''
                            }
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y}'
                                },
                                shadow: true
                            }
                        },
                        series: respuesta.data
                    });
                });
            }
        });
    };

    this.cargarEvolucionMes = function (idplan, fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarEjecucion',
            params: {
                idplan: idplan,
                fechainicio: fechaI,
                fechafin: fechaF,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerEvolucionMes').highcharts({
                        chart: {
                            zoomType: 'xy',
                            height: _this.panelEvolMes.getInnerHeight()
                        },
                        title: {
                            text: 'Evoluci\xf3n del cumplimiento de las actividades por meses'
                        },
                        xAxis: {
                            categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                                'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: ''
                            }
                        },
                        series: respuesta.data
                    });
                });
            }
        });
    };
    this.cargarEvolucionTri = function (idplan, fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarEjecucion',
            params: {
                idplan: idplan,
                fechainicio: fechaI,
                fechafin: fechaF,
                trimestre: 1,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerEvolucionTri').highcharts({
                        chart: {
                            zoomType: 'xy',
                            height: _this.panelEvolTri.getInnerHeight()
                        },
                        title: {
                            text: 'Evoluci\xf3n del cumplimiento de las actividades por trimestres'
                        },
                        xAxis: {
                            categories: ['Ene-Mar', 'Abr-Jun', 'Jul-Sep', 'Oct-Dic']
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: ''
                            }
                        },
                        series: respuesta.data
                    });
                });
            }
        });
    };

    //************* Tiempo planificado ******************
    this.cargarEficienciaPlan = function (idplan, fechaI, fechaF) {
        _this.BarraProgreso.show('Cargando diagrama');
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarEficiencia',
            params: {
                idplan: idplan,
                fechainicio: fechaI,
                fechafin: fechaF,
                cumplimiento: 0,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                $(function () {
                    $('#containerEficienciaPlan').highcharts({
                        chart: {
                            type: 'bar',
                            zoomType: 'xy',
                            height: _this.eficiencia.getInnerHeight()
                        },
                        title: {
                            text: 'Eficiencia en el cumplimiento de actividades por plan'
                        },
                        xAxis: {
                            categories: ['Tardanza m\xe1xima', 'Tardanza promedio', 'Diferencia'],
                            title: {
                                text: null
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: ''
                            },
                            labels: {
                                overflow: 'justify'
                            }
                        },
                        tooltip: {
                            valueSuffix: ' d\xeda(s)'
                        },
                        plotOptions: {
                            bar: {
                                dataLabels: {
                                    enabled: true
                                }
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y}'
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'top',
                            x: -40,
                            y: 80,
                            floating: true,
                            borderWidth: 1,
                            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                            shadow: true
                        },
                        credits: {
                            enabled: false
                        },
                        series: respuesta.data
                    });
                });
            }
        });
    };


    //********** Desviaciones *************
    this.cargarDesvTotal = function (idplan, fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarDesviaciones',
            params: {
                idplan: idplan,
                fechainicio: fechaI,
                fechafin: fechaF,
                cant: 0,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                $(function () {
                    $('#containerDesvTotal').highcharts({
                        chart: {
                            type: 'pie',
                            zoomType: 'xy',
                            height: _this.panelDesvTotal.getInnerHeight()
                        },
                        title: {
                            text: 'Porciento de desviaciones respecto al total de desviaciones'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}: {point.y} %'
                                },
                                shadow: true
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.cant}</b> {point.deno}</span><br/>' +
                            ' <span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.desv}</b> desviaci\xf3n(es)</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span> ' +
                            '<span style="font-size: 12px"><b> {point.y} %</b> del total</span><br/>'
                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };

    this.cargarDesvCant = function (idplan, fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarDesviaciones',
            params: {
                idplan: idplan,
                fechainicio: fechaI,
                fechafin: fechaF,
                cant: 1,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerDesvCant').highcharts({
                        chart: {
                            type: 'column',
                            zoomType: 'xy',
                            height: _this.panelDesvCant.getInnerHeight()
                        },
                        title: {
                            text: 'Porciento de desviaciones respecto a la cantidad de elementos'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        yAxis: {
                            title: {
                                text: ''
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y} %'
                                },
                                shadow: true
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.cant}</b> {point.deno}</span><br/>' +

                            ' <span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.desv}</b> desviaci\xf3n(es)</span><br/>' +

                            '<span style="color:{point.color}">\u25CF</span> ' +
                            '<span style="font-size: 12px"><b> {point.y} %</b> del total</span><br/>'
                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };

    //************* Post-Aprobacion ******************
    this.cargarComportamiento = function (idplan, fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarComportamiento',
            params: {
                idplan: idplan,
                fechainicio: fechaI,
                fechafin: fechaF,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                if (respuesta.data == 1) {
                    mostrarMensaje(1, 'Debe seleccionar un plan aprobado.');
                    $(function () {
                        $('#containerComportamiento').highcharts({
                            chart: {
                                type: 'column',
                                zoomType: 'xy',
                                height: _this.panelComport.getInnerHeight()
                            },
                            title: {
                                text: 'Comportamiento de las actividades del plan post aprobaci\xf3n'
                            }
                        });
                    });
                    _this.BarraProgreso.hide();
                } else if (respuesta.data == 2) {
                    mostrarMensaje(1, 'El plan seleccionado no est\xe1 aprobado.');
                    _this.BarraProgreso.hide();
                    $(function () {
                        $('#containerComportamiento').highcharts({
                            chart: {
                                type: 'column',
                                zoomType: 'xy',
                                height: _this.panelComport.getInnerHeight()
                            },
                            title: {
                                text: 'Comportamiento de las actividades del plan post aprobaci\xf3n'
                            }
                        });
                    });
                } else {
                    _this.BarraProgreso.hide();
                    $(function () {
                        $('#containerComportamiento').highcharts({
                            chart: {
                                type: 'column',
                                zoomType: 'xy',
                                height: _this.panelComport.getInnerHeight()
                            },
                            title: {
                                text: 'Comportamiento de las actividades del plan post aprobaci\xf3n'
                            },
                            xAxis: {
                                categories: respuesta.categories
                            },
                            yAxis: {
                                title: {
                                    text: ''
                                }
                            },
                            plotOptions: {
                                column: {
                                    pointPadding: 0.2
                                },
                                series: {
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            series: respuesta.data
                        });
                    });
                }
            }
        });
    };

    this.cargarCompTri = function (idplan, fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarComportamiento',
            params: {
                idplan: idplan,
                fechainicio: fechaI,
                fechafin: fechaF,
                trimestre: 1,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerComportTri').highcharts({
                        chart: {
                            zoomType: 'xy',
                            height: _this.panelComportTri.getInnerHeight()
                        },
                        title: {
                            text: 'Comportamiento de las actividades del plan post aprobaci\xf3n por trimestre'
                        },
                        xAxis: {
                            categories: ['Ene-Mar', 'Abr-Jun', 'Jul-Sep', 'Oct-Dic']
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: ''
                            }
                        },
                        series: respuesta.data
                    });
                });
            }
        });
    };

    //************* Calidad de la planificacion ******************
    this.cargarCantidadCalidad = function (idplan, fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarCalidad',
            params: {
                idplan: idplan,
                fechainicio: fechaI,
                fechafin: fechaF,
                peso: 0,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                $(function () {
                    $('#containerCantidadCalidad').highcharts({
                        chart: {
                            type: 'pie',
                            zoomType: 'xy',
                            height: _this.panelCantidadCalidad.getInnerHeight()
                        },
                        title: {
                            text: 'Cantidad de actividades por criterio de evaluaci\xf3n'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}: {point.y:.1f} %'
                                },
                                shadow: true
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.cant}</b> actividad(es)</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span> ' +
                            '<span style="font-size: 12px"><b> {point.y:.2f} %</b> del total</span><br/>'
                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };

    this.cargarPorcientoCalidad = function (idplan, fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarCalidad',
            params: {
                idplan: idplan,
                fechainicio: fechaI,
                fechafin: fechaF,
                peso: 1,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerPorcientoCalidad').highcharts({
                        chart: {
                            type: 'pie',
                            zoomType: 'xy',
                            height: _this.panelPorcientoCalidad.getInnerHeight()
                        },
                        title: {
                            text: 'Peso de las actividades por criterio de evaluaci\xf3n'
                        },
                        plotOptions: {
                            pie: {
                                innerSize: 200,
                                allowPointSelect: true
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}: {point.y:.1f} %'
                                },
                                shadow: true
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> Peso:</b> {point.cant}</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span> ' +
                            '<span style="font-size: 12px"><b> {point.y:.2f} %</b> del total</span><br/>'
                        },
                        series: [{
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };

    this.cargarTrimestreCalidad = function (idplan, fechaI, fechaF) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgraficas/cargarCalidadTri',
            params: {
                idplan: idplan,
                fechainicio: fechaI,
                fechafin: fechaF,
                trimestre: 1,
		            arrayautores:Ext.encode(_this.arrayautores),
		            arrayinvolucrados:Ext.encode(_this.arrayinvolucrados)
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);

                $(function () {
                    $('#containerTrimestreCalidad').highcharts({
                        chart: {
                            type: 'spline',
                            zoomType: 'xy',
                            height: _this.panelTrimestreCalidad.getInnerHeight()
                        },
                        title: {
                            text: 'Cantidad de actividades por criterio de evaluaci\xf3n por trimestres'
                        },
                        xAxis: {
                            categories: ['Ene-Mar', 'Abr-Jun', 'Jul-Sep', 'Oct-Dic']
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: ''
                            }
                        },
                        series: respuesta.data
                    });
                });
            }
        });
    };

};





