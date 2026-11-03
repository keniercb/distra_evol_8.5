Ext.ns('Gestplaninversiones.desglosePlanInversiones');


Gestplaninversiones.desglosePlanInversiones.Class = {
    init: function(ejercicio, idorganismo, idioma, inversion, componente) {
        // var obj = Gestionar.desglosePlanInversiones.Class;
        _this = this;
        this.TolPlanInv;
        function fnLevTPresupuesto() {
            _this.objPresupuestoinversion.stPresupuesoinversion.baseParams.idinversion = inversion.data.idinversion;
            _this.objPresupuestoinversion.stPresupuesoinversion.baseParams.aaejercicio = ejercicio.ejercicio - 2;
            _this.objPresupuestoinversion.stPresupuesoinversion.baseParams.aejercicio = ejercicio.ejercicio - 1;
            _this.objPresupuestoinversion.stPresupuesoinversion.baseParams.pejercicio = (parseInt(ejercicio.ejercicio) + 1);
            _this.objPresupuestoinversion.stPresupuesoinversion.baseParams.ejercicio = parseInt(ejercicio.ejercicio);
            _this.objPresupuestoinversion.stPresupuesoinversion.load({
                callback: function(st) {
                    if (st.length === 0) {
                        mostrarMensaje(1, 'No existen etapas asociadas a la inversi&oacute;n.');
                    } /*else {
                     //    _this.TolPlanInv = _this.objPresupuestoinversion.stTotales.data.items[1].data;
                     for ( i=0;i<_this.objPresupuestoinversion.stTotales.data.items.length;i++ ){
                     
                     }
                     }*/
                }
            });

            _this.objPresupuestoinversion.stTotales.baseParams.idinversion = inversion.data.idinversion;
        }
        function fnConstMA() {
            /*  
             var tolPres = new Ext.data.Record({
             vacia: '',
             _parent: 2, _is_leaf: true,
             denominacion: _this.objPresupuestoinversion.stTotales.data.items[2].data.denominacion,
             sumapresp_mp: _this.objPresupuestoinversion.stTotales.data.items[2].data.sumapresp_mp,
             sumapresp_usd: _this.objPresupuestoinversion.stTotales.data.items[2].data.sumapresp_usd,
             //
             ejecutadomp1: _this.objPresupuestoinversion.stTotales.data.items[2].data.ejecutado_mp1,
             ejecutadousd1: _this.objPresupuestoinversion.stTotales.data.items[2].data.ejecutado_usd1,
             estimadomp1: _this.objPresupuestoinversion.stTotales.data.items[2].data.estimado_mp1,
             estimadousd1: _this.objPresupuestoinversion.stTotales.data.items[2].data.estimado_usd1,
             planmp1: _this.objPresupuestoinversion.stTotales.data.items[2].data.plan_mp1,
             planusd1: _this.objPresupuestoinversion.stTotales.data.items[2].data.plan_usd1,
             proyecmp1: _this.objPresupuestoinversion.stTotales.data.items[2].data.proyec_mp1,
             proyecusd1: _this.objPresupuestoinversion.stTotales.data.items[2].data.proyec_usd1,
             //
             ejecutadomp2: _this.objPresupuestoinversion.stTotales.data.items[2].data.ejecutado_mp2,
             ejecutadousd2: _this.objPresupuestoinversion.stTotales.data.items[2].data.ejecutado_usd2,
             estimadomp2: _this.objPresupuestoinversion.stTotales.data.items[2].data.estimado_mp2,
             estimadousd2: _this.objPresupuestoinversion.stTotales.data.items[2].data.estimado_usd2,
             planmp2: _this.objPresupuestoinversion.stTotales.data.items[2].data.plan_mp2,
             planusd2: _this.objPresupuestoinversion.stTotales.data.items[2].data.plan_usd2,
             proyecmp2: _this.objPresupuestoinversion.stTotales.data.items[2].data.proyec_mp2,
             proyecusd2: _this.objPresupuestoinversion.stTotales.data.items[2].data.proyec_usd2,
             //
             ejecutadomp3: _this.objPresupuestoinversion.stTotales.data.items[2].data.ejecutado_mp3,
             ejecutadousd3: _this.objPresupuestoinversion.stTotales.data.items[2].data.ejecutado_usd3,
             estimado_mp3: _this.objPresupuestoinversion.stTotales.data.items[2].data.estimado_mp3,
             estimadosd3: _this.objPresupuestoinversion.stTotales.data.items[2].data.estimado_usd3,
             planmp3: _this.objPresupuestoinversion.stTotales.data.items[2].data.plan_mp3,
             planusd3: _this.objPresupuestoinversion.stTotales.data.items[2].data.plan_usd3,
             proyecmp3: _this.objPresupuestoinversion.stTotales.data.items[2].data.proyec_mp3,
             proyecusd3: _this.objPresupuestoinversion.stTotales.data.items[2].data.proyec_usd3,
             //
             ejecutadomp4: _this.objPresupuestoinversion.stTotales.data.items[2].data.ejecutado_mp4,
             ejecutadousd4: _this.objPresupuestoinversion.stTotales.data.items[2].data.ejecutado_usd4,
             estimadomp4: _this.objPresupuestoinversion.stTotales.data.items[2].data.estimado_mp4,
             estimadousd4: _this.objPresupuestoinversion.stTotales.data.items[2].data.estimado_usd4,
             planmp4: _this.objPresupuestoinversion.stTotales.data.items[2].data.plan_mp4,
             planusd4: _this.objPresupuestoinversion.stTotales.data.items[2].data.plan_usd4,
             proyecmp4: _this.objPresupuestoinversion.stTotales.data.items[2].data.proyec_mp4,
             proyecusd4: _this.objPresupuestoinversion.stTotales.data.items[2].data.proyec_usd4,
             //
             annospost_mp: _this.objPresupuestoinversion.stTotales.data.items[2].data.annospost_mp,
             annospost_usd: _this.objPresupuestoinversion.stTotales.data.items[2].data.annospost_usd
             });
             _this.objAmbiente.stAmbiente.add(tolPres);
             */
            var record = new Ext.data.Record({vacia: '',
                denominacion: '', sumapresp_mp: 0, sumapresp_usd: 0, ejecutadomp1: 0, ejecutadousd1: 0, ejecutadomp2: 0, ejecutadousd2: 0, ejecutadomp3: 0, ejecutadousd3: 0, ejecutadomp4: 0, ejecutadousd4: 0,
                estimadomp1: 0, estimadousd1: 0, estimadomp2: 0, estimadousd2: 0, estimadomp3: 0, estimadousd3: 0, estimadomp4: 0, estimadousd4: 0,
                planmp1: 0, planusd1: 0, planmp2: 0, planusd2: 0, planmp3: 0, planusd3: 0, planmp4: 0, planusd4: 0,
                proyecmp1: 0, proyecusd1: 0, proyecmp2: 0, proyecusd2: 0, proyecmp3: 0, proyecusd3: 0, proyecmp4: 0, proyecusd4: 0, _parent: 2, _is_leaf: true
            });
            return record;
            // _this.objAmbiente.stAmbiente.add(record);
        }
        function fnLevTfinanciamiento() {
            _this.objPresupuestofinanciero.stQuienfinancia.reload({
                params: {
                    idinversion: inversion.data.idinversion,
                    idejercicio: ejercicio.idejercicio,
                    aaejercicio: ejercicio.ejercicio - 2,
                    aejercicio: ejercicio.ejercicio - 1,
                    pejercicio: (parseInt(ejercicio.ejercicio) + 1),
                    identidad: idorganismo,
                    limit: _this.objPresupuestofinanciero.cbpaginado.getValue(),
                    start: 0
                }});
            _this.objPresupuestofinanciero.stPresupuesofinanciero.reload({
                params: {
                    idinversion: inversion.data.idinversion,
                    idejercicio: ejercicio.idejercicio,
                    aaejercicio: ejercicio.ejercicio - 2,
                    aejercicio: ejercicio.ejercicio - 1,
                    pejercicio: (parseInt(ejercicio.ejercicio) + 1),
                    identidad: idorganismo,
                    limit: _this.objPresupuestofinanciero.cbpaginado.getValue(),
                    start: 0
                }});
        }
        function fnLevTConstructores() {
            _this.objConstructor.stConstructor.baseParams.idinversion = inversion.data.idinversion;
            _this.objConstructor.stConstructor.load();
        }
        function fnLevTOtrosInd() {
            _this.objOtrosindicadores.inversion = inversion.data.idinversion;
            _this.objOtrosindicadores.identidad = idorganismo;
            _this.objOtrosindicadores.stOtrosindicadores.reload();
            _this.objOtrosindicadores.stExplotacion.reload();
        }
        function fnLevTMedioAmb() {
            // _this.objAmbiente.stSector.load();
            //  _this.objAmbiente.stCuenca.load();
            // _this.objAmbiente.stBahia.load();
            //  _this.objAmbiente.stAcciones.load();
            _this.objAmbiente.stAmbiente.load();
        }
        function fnLevTEquipos() {
            _this.objEquipo.stCmbplan.load();
            _this.objEquipo.stCmpetapa.load();
            // _this.objEquipo.CmbComponentes.setValue(_this.objEquipo.stCmpetapa.data.items[1].data.idetapa);
            //_this.objEquipo.CmbPlan.setValue(_this.objEquipo.stCmbplan.data.items[1].data.idmodelo);
        }
        this.objPresupuestoinversion = new Utilidades.Cmp.Cmppresupuestoinversion({
            ejercicio: ejercicio,
            identidad: idorganismo,
            idioma: idioma,
            idinversion: inversion.data.idinversion
        });
        this.objPresupuestofinanciero = new Utilidades.Cmp.Cmppresupuestofinanciero({
            ejercicio: ejercicio,
            identidad: idorganismo,
            idinverion: inversion.data.idinversion
        });
        this.objEquipo = new Utilidades.Cmp.CmpEquipo({
            ejercicio: ejercicio,
            identidad: idorganismo,
            idioma: idioma,
            idinversion: inversion.data.idinversion,
            componente: componente
        });

        this.objConstructor = new Utilidades.Cmp.Cmpconstructor({
            ejercicio: ejercicio,
            identidad: idorganismo
        });
        this.objAmbiente = new Utilidades.Cmp.Cmpambiente({
            ejercicio: ejercicio,
            identidad: idorganismo,
            idioma: idioma,
            idinversion: inversion.data.idinversion,
            tol: _this.TolPlanInv
        });
        this.objOtrosindicadores = new Utilidades.Cmp.Cmpotrosindicadoresinversion({
            ejercicio: ejercicio,
            identidad: idorganismo
        });
        this.tabsDesgloses = new Ext.TabPanel({
            activeTab: 0,
            id: 'tabsDesgloses',
            region: 'center',
            items: [{
                    title: 'Presupuesto',
                    id: 'idDPresupuesto',
                    activeTab: 0,
                    layout: 'border',
                    items: [_this.objPresupuestoinversion.pGeneralPresupuesoinversion],
                    listeners: {
                        activate: function() {
                            fnLevTPresupuesto();
                        }
                    }
                }, {
                    title: 'Financiamiento',
                    id: 'idDFinanciamiento',
                    activeTab: 1,
                    layout: 'border',
                    items: [_this.objPresupuestofinanciero.pContenedordeTabPanel],
                    listeners: {
                        activate: function() {
                            fnLevTfinanciamiento();
                        }
                    }
                }, {
                    title: 'Equipos',
                    id: 'idDEquipos',
                    activeTab: 2,
                    layout: 'border',
                    items: [_this.objEquipo.pEquipos],
                    listeners: {
                        activate: function() {
                            fnLevTEquipos();
                        }
                    }
                },{
                    title: 'Constructores',
                    id: 'idDConstructores',
                    activeTab: 3,
                    layout: 'border',
                    items: [_this.objConstructor.pConstructor],
                    listeners: {
                        activate: function() {
                            fnLevTConstructores();
                        }
                    }
                }, {
                    title: 'Otros indicadores',
                    id: 'idDIndicadores',
                    activeTab: 4,
                    layout: 'border',
                    items: [_this.objOtrosindicadores.pGeneral],
                    listeners: {
                        activate: function() {
                            fnLevTOtrosInd();
                        }
                    }
                }, {
                    title: 'Medio ambiente',
                    id: 'idDAmbiente',
                    activeTab: 5,
                    layout: 'border',
                    items: [_this.objAmbiente.pAmbiente],
                    listeners: {
                        activate: function() {
                            fnLevTMedioAmb();
                        }
                    }
                }]
        });
        this.winDesgloses = new Ext.Window({
            closable: true,
            title: 'Inversi&oacute;n con c&oacute;digo: <i>' + inversion.data.codigo + idioma.etDenominacion + inversion.data.denominacion + '</i>',
            // graggable: false,
            maximized: true,
            //     modal: true,
            border: false,
            layout: 'border',
            closeAction: 'destroy',
            width: 640,
            height: 450,
            buttons: [{
                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'btn',
                    text: 'Cerrar',
                    tooltip: 'Cerrar la ventana',
                    handler: function() {
                        _this.winDesgloses.destroy();
                    }
                }],
            items: [_this.tabsDesgloses]
        });
        _this.winDesgloses.show();
    }
};