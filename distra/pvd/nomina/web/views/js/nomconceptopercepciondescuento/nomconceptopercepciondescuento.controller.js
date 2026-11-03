Ext.ns('Pvd.Nomina.Nomencladores.ConceptoPD');

//Controlador de la vista del componente Nomenclador de conceptos de percepciones y descuentos.
Pvd.Nomina.Nomencladores.ConceptoPD.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma            Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista             Vista general del componente Nomenclador de conceptos de percepciones y descuentos (Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.Vista)
     * @param vistaConcepto     Vista de gestionar conceptos (Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.VistaConcepto).
     * @param vistaTarifa       Vista de gestionar tarifas (Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.VistaTarifa).
     * @param vistaVarAuxiliar  Vista de gestionar variables auxiliares (Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.VistaVariableAuxiliar).
     * @param vistaEstEscalar   Vista de gestionar estructura escalar (Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.VistaEstructuraEscalar).
     * @param vistaAdyacente    Vista de gestionar estructuras adyacentes (Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.VistaAdyacente).
     * @param vistaEscala       Vista de gestionar escalas (Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.VistaEscala).
     * @param modelo            Modelo de la vista del componente Nomenclador de conceptos de percepciones y descuentos (Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.Modelo)
     */
    init: function (idioma, vista, vistaConcepto, vistaTarifa, vistaBusqdaHistorico, vistaVarAuxiliar, vistaEstEscalar, vistaAdyacente, vistaEscala, modelo) {

        /**
         * Variables generales.
         */
        var variablesGenerales = {
            accionConcepto: 'Add',
            cambioConcepto: 0,
            esdescuento: 0,
            accionTarifa: 'Add',
            cambioTarifa: 0,
            accionVariable: 'Add',
            cambioVariable: 0,
            accionEstrucEsc: 0,
            cambioEstrucEsc: 0,
            accionAdyacente: 0,
            cambioAdyacente: 0,
            accionEscala: 0,
            cambioEscala: 0,


            idconcepto: 0,
            idtarifaconcepto: 0,
            idestructescalar: 0,
            variableIdreporte: 0,
            estrucEscIdreporte: 0,

            storeTarifa: 0,
            storeVarEstrucEsc: 0,
            storeAdyacentes: 0,

            dataAdyacente: 0,
            idEscEstEsc: 0,
            idEscIdPadre: 0,
        };

        /*
         * Se deshabilitan los botones.
         */
        //Concepto.
        vistaConcepto.btnModificarConcepto.disable();
        vistaConcepto.btnEliminarConcepto.disable();

        //Tarifas.
        vistaTarifa.btnAdicionarTarifa.disable();
        vistaTarifa.btnModificarTarifa.disable();
        vistaTarifa.btnEliminarTarifa.disable();

        //Variables auxiliares.
        vistaVarAuxiliar.btnAdicionarVariable.disable();
        vistaVarAuxiliar.btnModificarVariable.disable();
        vistaVarAuxiliar.btnEliminarVariable.disable();

        //Estructuras escalares.
        vistaEstEscalar.btnAdicionarEstEsc.disable();
        vistaEstEscalar.btnModificarEstEsc.disable();
        vistaEstEscalar.btnEliminarEstEsc.disable();

        //Adyacentes.
        vistaAdyacente.btnAdicionarMatrizAdy.disable();
        vistaAdyacente.btnEliminarMatrizAdy.disable();

        //Escalas.
        vistaEscala.btnAdicionarEscala.disable();
        vistaEscala.btnModificarEscala.disable();
        vistaEscala.btnEliminarEscala.disable();

        /**
         * Se cargan los modelos iniciales.
         */
        //Concepto.
        modelo.storeConcepto.load({params:{start:0,limit:1000}});
        modelo.storeTipoConcepto.load();

        /*
         * Eventos de los stores.
         */
        //Concepto.
        modelo.storeConcepto.on('beforeload', function (store) {
            //Se deshabilitan los botones de mod/elim  y se limpia el store de conceptos.
            vistaConcepto.btnModificarConcepto.disable();
            vistaConcepto.btnEliminarConcepto.disable();
            store.removeAll();

            //Se resetea el valor del idconcepto.
            variablesGenerales.idconcepto = 0;

            //Se resetea los botones y el store de tarifas.
            resetTarifas();

            //Se resetea los botones y el store de variables auxiliares.
            resetVariables();

            //Se resetea los botones y el store de estructuras escalares.
            resetEstEscala();

            //Se resetea los botones y el store de adyacentes.
            resetAdyacente();

            //Se resetea los botones y el store de escalas.
            resetEscala();
        });

        modelo.storeConcepto.on('load', function (store) {
            //Se carga por primera vez los stores de los combos de tarifa y variables.
            if (!variablesGenerales.storeTarifa) {
                //Stores.
                modelo.storeNomTarifa.load();
                modelo.storeFormaCalculo.load();

                //Stores de variables auxiliares.
                modelo.storeFormaEntradaVariable.load();
                modelo.storeTipoReporteVariable.load();
                modelo.storeVarReporteVariable.load();

                variablesGenerales.storeTarifa = 1;
            }
        });

        //Tarifa.
        modelo.storeTarifa.on('beforeload', function (store) {
            //Se envía el id del concepto.
            store.baseParams.idconceptopd = variablesGenerales.idconcepto;

            //Se deshabilitan los botones de mod/elim  y se limpia el store de tarifa.
            vistaTarifa.btnModificarTarifa.disable();
            vistaTarifa.btnEliminarTarifa.disable();
            store.removeAll();

            //Se resetea el valor del idtarifaconcepto.
            variablesGenerales.idtarifaconcepto = 0;

            //Se resetea los botones y el store de estructuras escalares.
            resetEstEscala();

            //Se resetea los botones y el store de adyacentes.
            resetAdyacente();

            //Se resetea los botones y el store de escalas.
            resetEscala();
        });

        modelo.storeTarifa.on('load', function (store) {

            //Se carga por primera vez los stores de los combos de estructura escala y escala.
            if (!variablesGenerales.storeVarEstrucEsc) {

                //Stores de estructuras escalares.
                modelo.storeTipoCampoEstrucEsc.load();
                modelo.storeNomencladorEstrucEsc.load();
                modelo.storeFormaEntradaEstrucEsc.load();
                modelo.storeTipoReporteEstrucEsc.load();
                modelo.storeVarReporteEstrucEsc.load();

                //Stores de escalas.
                modelo.storeOperadorEscala.load();
                modelo.storeFormaCalculoEscala.load();
                variablesGenerales.storeVarEstrucEsc = 1;
            }
        });

        //busqda en historico
        /* vistaBusqdaHistorico.cbFuenteBusqda.on('select',function(cb,rec,index){

             if(rec.id == 1001)
             {
                 Ext.getCmp('idReportes').show();
                 Ext.getCmp('idNomina').hide();
                 vistaBusqdaHistorico.formularioHistorico.doLayout();
             }
             else
             {
                 Ext.getCmp('idNomina').show();
                 Ext.getCmp('idReportes').hide();
                 vistaBusqdaHistorico.formularioHistorico.doLayout();
             }
         });*/

        //Variables auxiliares.
        modelo.storeVariable.on('beforeload', function (store) {
            //Se envía el id del concepto.
            store.baseParams.idconceptopd = variablesGenerales.idconcepto;

            //Se deshabilitan los botones de mod/elim  y se limpia el store de variables auxiliares.
            vistaVarAuxiliar.btnModificarVariable.disable();
            vistaVarAuxiliar.btnEliminarVariable.disable();
            store.removeAll();
        });

        modelo.storeVarReporteVariable.on('beforeload', function (store) {
            //Se envía el id del reporte.
            store.baseParams.idreporte = variablesGenerales.variableIdreporte;
            store.removeAll();
        });

        //Estructuras escalares.
        modelo.storeEstrucEsc.on('beforeload', function (store) {
            //Se envía el id de la tarifa de concepto.
            store.baseParams.idtarifaconcepto = variablesGenerales.idtarifaconcepto;

            //Se deshabilitan los botones de mod/elim  y se limpia el store de estructura escalar.
            vistaEstEscalar.btnModificarEstEsc.disable();
            vistaEstEscalar.btnEliminarEstEsc.disable();
            store.removeAll();

            //Se resetea el valor del idestructescalar.
            variablesGenerales.idestructescalar = 0;

            //Se resetea los botones y el store de adyacentes.
            resetAdyacente();
        });

        modelo.storeEstrucEsc.on('load', function (store) {

            //Se carga por primera vez los stores de los combos de adyacentes.
            if (!variablesGenerales.storeAdyacentes) {
                variablesGenerales.storeAdyacentes = 1;
            }

            if (store.getCount()) {

                var arrayCampo = new Array();
                store.each(function (record) {
                    arrayCampo.push({
                        id: record.get('idestructuraescalar'),
                        text: record.get('denominacion'),
                        tipoentrada: record.get('idtipoentrada'),
                        nivel: record.get('nivel,'),
                        tipocampo: record.get('idtipocampo'),
                        nomenclador: record.get('idnomencladorreferencia')
                    });
                });
                construirMenuBotonesEscala(arrayCampo);
            } else {
                construirMenuBotonesEscala(new Array());
            }
        });

        modelo.storeVarReporteEstrucEsc.on('beforeload', function (store) {
            //Se envía el id del reporte.
            store.baseParams.idreporte = variablesGenerales.estrucEscIdreporte;
            store.removeAll();
        });

        //Adyacentes.
        modelo.storeMatrizAdy.on('beforeload', function (store) {
            //Se envía el id de la estructura escalar.
            store.baseParams.idestructescalar = variablesGenerales.idestructescalar;

            //Se deshabilita el botón de elim  y se limpia el store de adyacentes.
            vistaAdyacente.btnEliminarMatrizAdy.disable();
            store.removeAll();
        });

        //Escala.
        modelo.storeEscala.on('beforeload', function (store) {
            variablesGenerales.idEscIdPadre = 0;
            if (store.getCount() == 0) {
                store.baseParams.idescalatarifa = 0;
            }
            //Se envía el id de la tarifa del concepto.
            store.baseParams.idtarifaconcepto = variablesGenerales.idtarifaconcepto;
            //store.removeAll();
        });

        modelo.storeEscala.on('beforeexpandnode', function (store, record) {
            //Se envía el identificador de la escala de tarifa.
            store.baseParams.idescalatarifa = record.get('idescalatarifa');
        });


        /**
         * Función que deshabilita los botones de add/mod/elim  y se limpia el store de tarifas.
         */
        function resetTarifas() {
            vistaTarifa.btnAdicionarTarifa.disable();
            vistaTarifa.btnModificarTarifa.disable();
            vistaTarifa.btnEliminarTarifa.disable();
            modelo.storeTarifa.removeAll();
        }

        /**
         * Función que deshabilita los botones de add/mod/elim  y se limpia el store
         * de variables auxiliares.
         */
        function resetVariables() {
            vistaVarAuxiliar.btnAdicionarVariable.disable();
            vistaVarAuxiliar.btnModificarVariable.disable();
            vistaVarAuxiliar.btnEliminarVariable.disable();
            modelo.storeVariable.removeAll();
        }

        /**
         * Función que deshabilita los botones de add/mod/elim  y se limpia el store
         * de estructuras escalares.
         */
        function resetEstEscala() {
            vistaEstEscalar.btnAdicionarEstEsc.disable();
            vistaEstEscalar.btnModificarEstEsc.disable();
            vistaEstEscalar.btnEliminarEstEsc.disable();
            modelo.storeEstrucEsc.removeAll();
        }

        /**
         * Función que deshabilita los botones de add/mod/elim  y se limpia el store
         * de estructuras adyacentes.
         */
        function resetAdyacente() {
            vistaAdyacente.btnAdicionarMatrizAdy.disable();
            vistaAdyacente.btnEliminarMatrizAdy.disable();
            modelo.storeMatrizAdy.removeAll();
        }

        /**
         * Función que deshabilita los botones de add/mod/elim  y se limpia el store
         * de escalas.
         */
        function resetEscala() {
            vistaEscala.btnAdicionarEscala.disable();
            vistaEscala.btnModificarEscala.disable();
            vistaEscala.btnEliminarEscala.disable();
            modelo.storeEscala.removeAll();
        }

        /*
         * Eventos de los grids.
         */
        //Concepto.
        vistaConcepto.gpConcepto.on('rowdblclick', function (e) {
            mostrarVentanaModificarConcepto();
        });

        vistaConcepto.smConcepto.on('rowselect', function (sm, index, store) {
            //Se deshabilitan los botones de mod/elim.
            vistaConcepto.btnModificarConcepto.enable();
            vistaConcepto.btnEliminarConcepto.enable();

            //Se obtiene el id del concepto.
            variablesGenerales.idconcepto = store.get('idconceptopercepciondescuento');

            //Se habilita el adicionar y se carga el store de tarifa.
            vistaTarifa.btnAdicionarTarifa.enable();
            modelo.storeTarifa.load();

            //Se habilita el adicionar y se carga el store de variables auxiliares.
            vistaVarAuxiliar.btnAdicionarVariable.enable();
            modelo.storeVariable.load();

            obtenerIndicadoresFormula();
        });

        //Tarifa.
        vistaTarifa.gpTarifa.on('rowdblclick', function (e) {
            mostrarVentanaModificarTarifa();
        });

        //Tarifa.
        vistaTarifa.cbFormaCalculoTarifa.on('select', function (cb, sel, index) {
            if (sel.data.idformacalculo == 1 || sel.data.idformacalculo == 2) {
                vistaTarifa.nfCantidadLugaresDecimales.setValue("");
                vistaTarifa.nfCantidadLugaresDecimales.enable();
            } else {
                vistaTarifa.nfCantidadLugaresDecimales.setValue("");
                vistaTarifa.nfCantidadLugaresDecimales.disable();
            }
        });

        vistaTarifa.smTarifa.on('rowselect', function (sm, index, store) {
            //Se deshabilitan los botones de mod/elim.
            vistaTarifa.btnModificarTarifa.enable();
            vistaTarifa.btnEliminarTarifa.enable();

            //Se obtiene el id de la tarifa del concepto.
            variablesGenerales.idtarifaconcepto = store.get('idconceptopdtarifa');

            //Se verifica si la forma de cálculo es escalas de valores.
            if (store.get('idformacalculo') == '3') {
                vistaEstEscalar.btnAdicionarEstEsc.enable();
                vistaEscala.btnAdicionarEscala.enable();
                modelo.storeEscala.load();
                modelo.storeEstrucEsc.load();
            } else {
                resetEstEscala();
                resetAdyacente();
                resetEscala();
            }
        });

        //Variables auxiliares.
        vistaVarAuxiliar.gpVariable.on('rowdblclick', function (e) {
            mostrarVentanaModificarVariable();
        });

        vistaVarAuxiliar.smVariable.on('rowselect', function (sm, index, record) {
            //Se deshabilitan los botones de mod/elim.
            vistaVarAuxiliar.btnModificarVariable.enable();
            vistaVarAuxiliar.btnEliminarVariable.enable();

            //Se carga el store de variable con el valor seleccionado.
            variablesGenerales.variableIdreporte = record.get('idconfreportescertificaciones');
            modelo.storeVarReporteVariable.load();
        });

        //Estructuras escalares.
        vistaEstEscalar.gpEstrucEsc.on('rowdblclick', function (e) {
            mostrarVentanaModificarEstrucEsc();
        });

        vistaEstEscalar.smEstrucEsc.on('rowselect', function (sm, index, store) {
            //Se deshabilitan los botones de mod/elim.
            vistaEstEscalar.btnModificarEstEsc.enable();
            vistaEstEscalar.btnEliminarEstEsc.enable();

            //Se obtiene el id de la estructura escalar.
            variablesGenerales.idestructescalar = store.get('idestructuraescalar');

            //Se verifica si la estructura escalar es hoja.
            if (store.get('nivel') == '2') {
                //Se habilita el adicionar y se cargan el store de adyacentes.
                vistaAdyacente.btnAdicionarMatrizAdy.enable();
                modelo.storeMatrizAdy.load();

                //Se carga el combo de estructuras adyacentes.
                var auxData = [];

                modelo.storeEstrucEsc.each(function (record) {
                    //Se verifica si no es hoja y es distinto al seleccionado. 
                    if (record.get('idestructuraescalar') != store.get('idestructuraescalar')) {
                        auxData.push([record.get('idestructuraescalar'), record.get('denominacion')]);
                    }
                });
                modelo.storeEstrucEscAdy.removeAll();
                modelo.storeEstrucEscAdy.loadData(auxData);

            } else {
                resetAdyacente();
            }
        });

        //Adyacentes.
        vistaAdyacente.gpMatrizAdy.on('rowdblclick', function (e) {
            mostrarVentanaModificarAdyacente();
        });

        vistaAdyacente.smMatrizAdy.on('rowselect', function (sm, index, store) {
            //Se deshabilitan los botones de elim.
            vistaAdyacente.btnEliminarMatrizAdy.enable();
        });

        //Escala.
        vistaEscala.gpEscala.on('rowdblclick', function (e) {
            mostrarVentanaModificarEscala();
        });

        vistaEscala.smEscala.on('rowdeselect', function (sm, index, store) {

            vistaEscala.btnMenuAdicionarEscala.removeAll();

            variablesGenerales.idEscIdPadre = 0;

            //Se deshabilitan los botones de mod/elim.
            vistaEscala.btnModificarEscala.disable();
            vistaEscala.btnEliminarEscala.disable();

            if (modelo.storeEstrucEsc.getCount()) {
                var arrayCampo = new Array();
                modelo.storeEstrucEsc.each(function (record) {
                    arrayCampo.push({
                        id: record.get('idestructuraescalar'),
                        text: record.get('denominacion'),
                        tipoentrada: record.get('idtipoentrada'),
                        nivel: record.get('nivel,'),
                        tipocampo: record.get('idtipocampo'),
                        nomenclador: record.get('idnomencladorreferencia')
                    });
                });
                construirMenuBotonesEscala(arrayCampo);
            } else {
                construirMenuBotonesEscala(new Array());
            }
        });

        vistaEscala.smEscala.on('rowselect', function (sm, index, store) {

            vistaEscala.btnMenuAdicionarEscala.removeAll();

            variablesGenerales.idEscIdPadre = store.get('idescalatarifa');

            //Se habilitan los botones de mod/elim.
            vistaEscala.btnModificarEscala.enable();
            vistaEscala.btnEliminarEscala.enable();
            var cant = store.get('adyacentes').length;
            if (cant) {

                var arrayCampo = new Array();
                for (var val = 0; val < cant; val++) {
                    arrayCampo.push({
                        id: store.get('adyacentes')[val].idestructuraescalaradyacente,
                        text: store.get('adyacentes')[val].denomestruraescalar,
                    });
                }
                construirMenuBotonesEscala(arrayCampo);
            } else {
                construirMenuBotonesEscala(new Array());
            }
        });

        /*
         * Eventos de los botones add/mod/elim/aceptar/aplicar/cancelar.
         */
        //Concepto.
        vistaConcepto.btnAdicionarConcepto.setHandler(function () {
            mostrarVentanaAdicionarConcepto();
            variablesGenerales.esdescuento = 0;
            obtenerIndicadoresFormula();
        });

        vistaConcepto.btnModificarConcepto.setHandler(function () {
            mostrarVentanaModificarConcepto();
        });

        vistaConcepto.btnEliminarConcepto.setHandler(function () {
            eliminarConcepto();
        });

        vistaConcepto.btnCancelarConcepto.setHandler(function () {
            vistaConcepto.ventanaConcepto.hide();
        });

        vistaConcepto.btnAplicarConcepto.setHandler(function () {
            salvarFormularioConcepto(true);
        });

        vistaConcepto.btnAceptarConcepto.setHandler(function () {
            salvarFormularioConcepto(false);
        });

        vistaConcepto.checkEsDescuento.on('check', function (mismo, valor) {
            if (valor) {
                vistaConcepto.tfFormula.enable();
                variablesGenerales.esdescuento = 1;
                variablesGenerales.cambioConcepto = 1;
            } else {
                vistaConcepto.tfFormula.disable();
                variablesGenerales.idexpresionmatematica = -1;
                vistaConcepto.tfFormula.setValue('');
                variablesGenerales.esdescuento = 0;
                variablesGenerales.cambioConcepto = 1;

            }

        });

        //Tarifa.
        vistaTarifa.btnAdicionarTarifa.setHandler(function () {
            mostrarVentanaAdicionarTarifa();
        });

        vistaTarifa.btnModificarTarifa.setHandler(function () {
            mostrarVentanaModificarTarifa();
        });

        vistaTarifa.btnEliminarTarifa.setHandler(function () {
            eliminarTarifa();
        });

        vistaTarifa.btnCancelarTarifa.setHandler(function () {
            vistaTarifa.ventanaTarifa.hide();
        });

        vistaTarifa.btnAplicarTarifa.setHandler(function () {
            salvarFormularioTarifa(true);
        });

        vistaTarifa.btnAceptarTarifa.setHandler(function () {
            salvarFormularioTarifa(false);
        });

        //Variables auxiliares.
        vistaVarAuxiliar.btnAdicionarVariable.setHandler(function () {
            mostrarVentanaAdicionarVariable();
        });

        vistaVarAuxiliar.btnModificarVariable.setHandler(function () {
            mostrarVentanaModificarVariable();
        });

        vistaVarAuxiliar.btnEliminarVariable.setHandler(function () {
            eliminarVariable();
        });

        vistaVarAuxiliar.btnCancelarVariable.setHandler(function () {
            vistaVarAuxiliar.ventanaVariable.hide();
        });

        vistaVarAuxiliar.btnAplicarVariable.setHandler('click', function () {
            salvarFormularioVariable(true);
        });

        vistaVarAuxiliar.btnAceptarVariable.setHandler(function () {
            salvarFormularioVariable(false);
        });

        //Estructuras escalares.
        vistaEstEscalar.btnAdicionarEstEsc.setHandler(function () {
            mostrarVentanaAdicionarEstrucEsc();
        });

        vistaEstEscalar.btnModificarEstEsc.setHandler(function () {
            mostrarVentanaModificarEstrucEsc();
        });

        vistaEstEscalar.btnEliminarEstEsc.setHandler(function () {
            eliminarEstructuraEscalar();
        });

        vistaEstEscalar.btnCancelarEstrucEsc.setHandler(function () {
            vistaEstEscalar.ventanaEstrucEsc.hide();
        });

        vistaEstEscalar.btnAplicarEstrucEsc.setHandler(function () {
            salvarFormularioEstructaEscalar(true);
        });

        vistaEstEscalar.btnAceptarEstrucEsc.setHandler(function () {
            salvarFormularioEstructaEscalar(false);
        });

        //Adyacentes.
        vistaAdyacente.btnAdicionarMatrizAdy.setHandler(function () {
            mostrarVentanaAdicionarAdyacente();
        });

        vistaAdyacente.btnEliminarMatrizAdy.setHandler(function () {
            eliminarAdyacente();
        });

        vistaAdyacente.btnCancelarMatrizAdy.setHandler(function () {
            vistaAdyacente.ventanaMatrizAdy.hide();
        });

        vistaAdyacente.btnAplicarMatrizAdy.setHandler(function () {
            salvarFormularioAdyacente(true);
        });

        vistaAdyacente.btnAceptarMatrizAdy.setHandler(function () {
            salvarFormularioAdyacente(false);
        });

        //Escala.
        vistaEscala.btnModificarEscala.setHandler(function () {
            mostrarVentanaModificarEscala();
        });

        vistaEscala.btnEliminarEscala.setHandler(function () {
            eliminarEscala();
        });

        vistaEscala.btnCancelarEscala.setHandler(function () {
            vistaEscala.ventanaEscala.hide();
        });

        vistaEscala.btnAceptarEscala.setHandler(function () {
            salvarFormularioEscala(false);
        });
        /*
         * Eventos de los campos de los formularios.
         */
        /* Concepto. */
        //Eventos de campo de abreviatura. 
        vistaConcepto.tfAbrevConcepto.on('change', function (tf, n, o) {
            variablesGenerales.cambioConcepto = 1;
        });

        //Eventos de campo de denominacion. 
        vistaConcepto.tfDenomConcepto.on('change', function (tf, n, o) {
            variablesGenerales.cambioConcepto = 1;
        });

        //Eventos de campo de tipo de concepto. 
        vistaConcepto.cbTipoConcepto.on('change', function (tf, n, o) {
            variablesGenerales.cambioConcepto = 1;
        });

        //Eventos de campo de fecha inicio. 
        vistaConcepto.dfFInicioConcepto.on('change', function (tf, n, o) {
            variablesGenerales.cambioConcepto = 1;
        });

        //Eventos de campo de fecha fin. 
        vistaConcepto.dfFFinConcepto.on('change', function (tf, n, o) {
            variablesGenerales.cambioConcepto = 1;
        });

        //Eventos de campo de descripcion. 
        vistaConcepto.tfDescripConcepto.on('change', function (tf, n, o) {
            variablesGenerales.cambioConcepto = 1;
        });

        //Eventos de campo de descripcion.
        vistaConcepto.tfFormula.on('change', function (tf, n, o) {
            variablesGenerales.cambioConcepto = 1;
        });

        /* Tarifa. */
        //Eventos de campo de tarifas. 
        vistaTarifa.cbTarifas.on('change', function (tf, n, o) {
            variablesGenerales.cambioTarifa = 1;
        });

        vistaTarifa.nfCantidadLugaresDecimales.on('change', function (tf, n, o) {
            variablesGenerales.cambioTarifa = 1;
        });

        //Eventos de campo de forma de cálculo. 
        vistaTarifa.cbFormaCalculoTarifa.on('change', function (tf, n, o) {
            variablesGenerales.cambioTarifa = 1;
        });


        vistaTarifa.cbFormaCalculoTarifa.on('select', function (cb, rec, ind) {

            vistaTarifa.tfImporteFormula.reset();

            //Se dehabilita o habilitan los campos de tipo de reporte y variable de reporte.
            if (rec.get('idformacalculo') == '3') {

                vistaTarifa.tfImporteFormula.disable();
            } else {
                vistaTarifa.tfImporteFormula.enable();
                if (variablesGenerales.accionTarifa != 'Add') {

                    if (rec.get('idformacalculo') == vistaTarifa.smTarifa.getSelected().get('idformacalculo')) {
                        vistaTarifa.tfImporteFormula.setValue(vistaTarifa.smTarifa.getSelected().get('importeformula'));
                    }
                }
            }
        });

        //Eventos de campo de importe o fórmula. 
        vistaTarifa.tfImporteFormula.on('focus', function (elem) {
            if (vistaTarifa.cbFormaCalculoTarifa.getValue() == 2) {

                var ind = ConvertiraArreglo(variablesGenerales.indicadoresFormulaTarifa);

                this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                    title: 'Editor de expresiones matem&aacute;ticas',
                    idexpresionmatematica: ((variablesGenerales.accionTarifa != 'Add' && vistaTarifa.smTarifa.getSelected().get('idformula') ) ? vistaTarifa.smTarifa.getSelected().get('idformula') : -1),
                    indicadores: ind,
                    agrupado: 1,
                    campoagrupar: 'Tipo',
                    mostrarFunciones: 2,
                    operadoresMostrar: ['+', '-', '*', '/', 'pa', 'pc', 's', 'p'],
                    mostrarDenominacion: false
                });
                this.objExpMat.on('expresionsalvada', function (arr) {
                    console.info(arr.elementosMostrarFormato);
                    variablesGenerales.idexpresionmatematica = arr.idexpresionmatematica;
                    vistaTarifa.tfImporteFormula.setValue(arr.elementosMostrarFormato);
                    variablesGenerales.cambioTarifa = 1;
                    this.objExpMat.close();
                }.createDelegate(this));

                this.objExpMat.show();
            }
        });


        //Eventos de campo de importe o fórmula.
        vistaConcepto.tfFormula.on('focus', function (elem) {


            var ind = ConvertiraArreglo(variablesGenerales.indicadoresFormulaTarifa);

            this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                title: 'Editor de expresiones matem&aacute;ticas',
                idexpresionmatematica: (variablesGenerales.idexpresionmatematica) ? variablesGenerales.idexpresionmatematica : -1,
                indicadores: ind,
                agrupado: 1,
                campoagrupar: 'Tipo',
                mostrarFunciones: 2,
                operadoresMostrar: ['+', '-', '*', '/', 'pa', 'pc', 's', 'p'],
                mostrarDenominacion: false
            });
            this.objExpMat.on('expresionsalvada', function (arr) {
                console.info(arr.idexpresionmatematica);
                variablesGenerales.idexpresionmatematica = arr.idexpresionmatematica;
                vistaConcepto.tfFormula.setValue(arr.elementosMostrarFormato);
                variablesGenerales.cambioTarifa = 1;
                this.objExpMat.close();
            }.createDelegate(this));

            this.objExpMat.show();

        });

        vistaTarifa.tfImporteFormula.on('change', function (tf, n, o) {
            variablesGenerales.cambioTarifa = 1;
        });

        /* Variables auxiliares. */
        //Eventos del campo denominación.
        vistaVarAuxiliar.tfDenomVariable.on('change', function (tf, n, o) {
            variablesGenerales.cambioVariable = 1;
        });

        //Eventos del campo forma de entrada de variable.
        vistaVarAuxiliar.cbFormaEntradaVariable.on('change', function (tf, n, o) {
            variablesGenerales.cambioVariable = 1;
        });

        vistaVarAuxiliar.cbFormaEntradaVariable.on('select', function (cb, rec, ind) {

            //Se dehabilita o habilitan los campos de tipo de reporte y variable de reporte.
            if (rec.get('idtipoentrada') == '1') {
                vistaVarAuxiliar.cbTipoReporteVariable.enable();
                vistaVarAuxiliar.cbVarReporteVariable.enable();
            } else {
                vistaVarAuxiliar.cbTipoReporteVariable.reset();
                vistaVarAuxiliar.cbTipoReporteVariable.disable();
                vistaVarAuxiliar.cbVarReporteVariable.reset();
                vistaVarAuxiliar.cbVarReporteVariable.disable();
                variablesGenerales.variableIdreporte = 0;
            }
        });

        //Eventos del campo tipo de reporte.
        vistaVarAuxiliar.cbTipoReporteVariable.on('change', function (cb, rec, ind) {
            variablesGenerales.cambioVariable = 1;
        });

        vistaVarAuxiliar.cbTipoReporteVariable.on('select', function (cb, rec, ind) {
            //Se obtiene el identificador del reporte seleccionado.
            variablesGenerales.variableIdreporte = rec.get('idconfreportescertificaciones');

            vistaVarAuxiliar.cbVarReporteVariable.reset();
            modelo.storeVarReporteVariable.load();
        });

        //Eventos del campo variable de reporte.
        vistaVarAuxiliar.cbVarReporteVariable.on('change', function (tf, n, o) {
            variablesGenerales.cambioVariable = 1;
        });

        /* Estructuras escalares. */
        //Eventos del campo denominación.
        vistaEstEscalar.tfDenomEstrucEsc.on('change', function (tf, n, o) {
            variablesGenerales.cambioEstrucEsc = 1;
        });

        vistaEstEscalar.cbTipoCampoEstrucEsc.on('change', function (tf, n, o) {
            variablesGenerales.cambioEstrucEsc = 1;
        });

        vistaEstEscalar.cbTipoCampoEstrucEsc.on('select', function (cb, rec, ind) {

            //Se dehabilita o habilita el campo de nomenclador.
            if (rec.get('idtipocampo') == '1') {
                vistaEstEscalar.cbNomencladorEstrucEsc.enable();
                vistaEstEscalar.tfLugaresdecimales.disable();

            } else if (rec.get('idtipocampo') == '2') {
                vistaEstEscalar.tfLugaresdecimales.enable();
                vistaEstEscalar.cbNomencladorEstrucEsc.disable();
            } else {
                vistaEstEscalar.cbNomencladorEstrucEsc.reset();
                vistaEstEscalar.cbNomencladorEstrucEsc.disable();
                vistaEstEscalar.tfLugaresdecimales.disable();
            }
        });

        //Eventos del campo forma de entrada de estructura escalar.
        vistaEstEscalar.cbFormaEntradaEstrucEsc.on('change', function (tf, n, o) {
            variablesGenerales.cambioEstrucEsc = 1;
        });

        vistaEstEscalar.cbFormaEntradaEstrucEsc.on('select', function (cb, rec, ind) {

            //Se dehabilita o habilitan los campos de tipo de reporte y variable de reporte.
            if (rec.get('idtipoentrada') == '1') {
                vistaEstEscalar.cbTipoReporteEstrucEsc.enable();
                vistaEstEscalar.cbVarReporteEstrucEsc.enable();
            } else {
                vistaEstEscalar.cbTipoReporteEstrucEsc.reset();
                vistaEstEscalar.cbTipoReporteEstrucEsc.disable();
                vistaEstEscalar.cbVarReporteEstrucEsc.reset();
                vistaEstEscalar.cbVarReporteEstrucEsc.disable();
                variablesGenerales.estrucEscIdreporte = 0;
            }
        });

        //Eventos del campo tipo de reporte.
        vistaEstEscalar.cbTipoReporteEstrucEsc.on('change', function (cb, rec, ind) {
            variablesGenerales.cambioEstrucEsc = 1;
        });

        vistaEstEscalar.cbTipoReporteEstrucEsc.on('select', function (cb, rec, ind) {
            //Se obtiene el identificador del reporte seleccionado.
            variablesGenerales.estrucEscIdreporte = rec.get('idconfreportescertificaciones');

            vistaEstEscalar.cbVarReporteEstrucEsc.reset();
            modelo.storeVarReporteEstrucEsc.load();
        });

        //Eventos del campo variable de reporte.
        vistaEstEscalar.cbVarReporteEstrucEsc.on('change', function (tf, n, o) {
            variablesGenerales.cambioEstrucEsc = 1;
        });

        //Eventos del campo hoja.
        vistaEstEscalar.cbHojaEstrucEsc.on('change', function (tf, n, o) {
            variablesGenerales.cambioEstrucEsc = 1;
        });
        vistaEstEscalar.cbHojaEstrucEsc.on('select', function (cb, rec, ind) {

            //Se dehabilita o habilita el campo de nomenclador.
            if (rec.get('nivel') == '1' && rec.get('tipocampo') == '2') {

                vistaEstEscalar.tfLugaresdecimales.enable();

            } else if (rec.get('nivel') == '1' && rec.get('tipocampo') == '1') {

                vistaEstEscalar.tfLugaresdecimales.disable();


            } else if (rec.get('nivel') == '2') {

                vistaEstEscalar.tfLugaresdecimales.disable();


            }
        });


        /* Adyacentes. */
        vistaAdyacente.cbEstrucEscAdy.on('change', function (tf, n, o) {
            variablesGenerales.cambioAdyacente = 1;
        });


        /* Escalas. */
        //Eventos del campo operador de comparación.
        vistaEscala.cbOperadorEscala.on('change', function (tf, n, o) {
            variablesGenerales.cambioEscala = 1;
        });

        vistaEscala.cbOperadorEscala.on('select', function (cb, rec, ind) {

            if (rec.get('valorfinal') == '1') {
                vistaEscala.tfValFinalEscala.enable();
            } else {
                vistaEscala.tfValFinalEscala.reset();
                vistaEscala.tfValFinalEscala.disable();
            }
        });

        //Eventos del campo valor inicial.
        vistaEscala.tfValInicialEscala.on('change', function (tf, n, o) {
            variablesGenerales.cambioEscala = 1;
        });

        //Eventos del campo valor final.
        vistaEscala.tfValFinalEscala.on('change', function (tf, n, o) {
            variablesGenerales.cambioEscala = 1;
        });

        //Eventos del campo forma de cálculo.
        vistaEscala.cbFormaCalculoEscala.on('change', function (tf, n, o) {
            variablesGenerales.cambioEscala = 1;
        });

        vistaEscala.cbFormaCalculoEscala.on('select', function (cb, rec, ind) {

            vistaEscala.tfImporteFormulaEscala.reset();

            if (variablesGenerales.accionEscala != 'Add') {

                if (rec.get('idformacalculo') == vistaEscala.smEscala.getSelected().get('idformacalculo')) {
                    vistaEscala.tfImporteFormulaEscala.setValue(vistaEscala.smEscala.getSelected().get('importeformula'));
                }
            }

        });

        //Eventos del campo importe o fórmula.
        vistaEscala.tfImporteFormulaEscala.on('change', function (tf, n, o) {
            variablesGenerales.cambioEscala = 1;
        });

        vistaEscala.tfImporteFormulaEscala.on('focus', function (elem) {

            if (vistaEscala.cbFormaCalculoEscala.getValue() == 2) {

                var ind = ConvertiraArreglo(variablesGenerales.indicadoresFormulaTarifa);
                this.objExpMatEsc = new Ext.pvd.persona.formula.winEditorExpresiones({
                    title: 'Editor de expresiones matem&aacute;ticas',
                    idexpresionmatematica: ((variablesGenerales.accionEscala != 'Add' && vistaEscala.smEscala.getSelected().get('idformula') ) ? vistaEscala.smEscala.getSelected().get('idformula') : -1),
                    indicadores: ind,
                    agrupado: 1,
                    campoagrupar: 'Tipo',
                    mostrarFunciones: 2,
                    operadoresMostrar: ['+', '-', '*', '/', 'pa', 'pc', 's', 'p'],
                    mostrarDenominacion: false
                });
                this.objExpMatEsc.on('expresionsalvada', function (arr) {
                    variablesGenerales.idexpresionmatematicaEscala = arr[0];
                    vistaEscala.tfImporteFormulaEscala.setValue(arr[2]);
                    variablesGenerales.cambioEscala = 1;
                    this.objExpMatEsc.close();
                }.createDelegate(this));

                this.objExpMatEsc.show();
            }
        });

        /*
         * Eventos de las ventanas de adicionar y modificar.
         */
        vistaConcepto.ventanaConcepto.on('show', function (e) {
            if (variablesGenerales.accionConcepto == 'Mod') {
                variablesGenerales.idexpresionmatematica = vistaConcepto.smConcepto.getSelected().get('idexpresionmatematica');
            } else {
                variablesGenerales.idexpresionmatematica = -1;
            }

            //console.log(variablesGenerales.idexpresionmatematica);
        });

        /* Concepto. */
        vistaConcepto.ventanaConcepto.on('beforeshow', function (ventana) {
            vistaConcepto.formularioConcepto.getForm().reset();
            vistaConcepto.tfAbrevConcepto.focus(true, 500);
        });

        /**
         * Función de mostrar la ventana de adicionar.
         */
        function mostrarVentanaAdicionarConcepto() {
            variablesGenerales.accionConcepto = 'Add';
            vistaConcepto.ventanaConcepto.setTitle(idioma.lbTitleVentAdicionarConcepto);
            vistaConcepto.btnAplicarConcepto.show();
            vistaConcepto.ventanaConcepto.show();
            //Actualizar la tabulación deL formulario.
            vistaConcepto.btnCancelarConcepto.setNextElement('idbtnAplicarConcepto');
            vistaConcepto.btnAceptarConcepto.setPreviousElement('idbtnAplicarConcepto');

        }

        /**
         * Función de mostrar la ventana de modificar.
         */
        function mostrarVentanaModificarConcepto() {
            variablesGenerales.accionConcepto = 'Mod';
            vistaConcepto.ventanaConcepto.setTitle(idioma.lbTitleVentModificarConcepto);
            vistaConcepto.btnAplicarConcepto.hide();
            vistaConcepto.ventanaConcepto.show();
            //Actualizar la tabulación deL formulario.
            vistaConcepto.btnCancelarConcepto.setNextElement('idbtnAceptarConcepto');
            vistaConcepto.btnAceptarConcepto.setPreviousElement('idbtnCancelarConcepto');
            //console.log(vistaConcepto.smConcepto.getSelected());
            vistaConcepto.formularioConcepto.getForm().loadRecord(vistaConcepto.smConcepto.getSelected());


        }

        /* Tarifa. */
        vistaTarifa.ventanaTarifa.on('beforeshow', function (ventana) {
            vistaTarifa.formularioTarifa.getForm().reset();
            vistaTarifa.cbTarifas.focus(true, 500);
        });

        /**
         * Función de mostrar la ventana de adicionar.
         */
        function mostrarVentanaAdicionarTarifa() {

            vistaTarifa.tfImporteFormula.disable();

            vistaTarifa.ventanaTarifa.setTitle(idioma.lbTitleVentAdicionarTarifa);
            vistaTarifa.btnAplicarTarifa.show();
            vistaTarifa.ventanaTarifa.show();
            //Actualizar la tabulación deL formulario.
            vistaTarifa.btnCancelarTarifa.setNextElement('idbtnAplicarTarifa');
            vistaTarifa.btnAceptarTarifa.setPreviousElement('idbtnAplicarTarifa');
            variablesGenerales.accionTarifa = 'Add';
        }

        /**
         * Función de mostrar la ventana de modificar.
         */
        function mostrarVentanaModificarTarifa() {

            vistaTarifa.ventanaTarifa.setTitle(idioma.lbTitleVentModificarTarifa);
            vistaTarifa.btnAplicarTarifa.hide();
            vistaTarifa.ventanaTarifa.show();
            //Actualizar la tabulación deL formulario.
            vistaTarifa.btnCancelarTarifa.setNextElement('idbtnAceptarTarifa');
            vistaTarifa.btnAceptarTarifa.setPreviousElement('idbtnCancelarTarifa');

            if (vistaTarifa.smTarifa.getSelected().get('idformacalculo') == '3') {
                vistaTarifa.tfImporteFormula.disable();
                vistaTarifa.nfCantidadLugaresDecimales.disable();
            } else {
                vistaTarifa.tfImporteFormula.enable();
                vistaTarifa.nfCantidadLugaresDecimales.enable();
            }

            vistaTarifa.formularioTarifa.getForm().loadRecord(vistaTarifa.smTarifa.getSelected());
            variablesGenerales.accionTarifa = 'Mod';
        }

        /* Variables auxiliares. */
        vistaVarAuxiliar.ventanaVariable.on('beforeshow', function (ventana) {
            vistaVarAuxiliar.formularioVariable.getForm().reset();
            vistaVarAuxiliar.tfDenomVariable.focus(true, 500);
        });

        /**
         * Función de mostrar la ventana de adicionar.
         */
        function mostrarVentanaAdicionarVariable() {
            vistaVarAuxiliar.cbTipoReporteVariable.disable();
            vistaVarAuxiliar.cbVarReporteVariable.disable();

            vistaVarAuxiliar.ventanaVariable.setTitle(idioma.lbTitleVentAdicionarVariable);
            vistaVarAuxiliar.btnAplicarVariable.show();
            vistaVarAuxiliar.ventanaVariable.show();
            //Actualizar la tabulación deL formulario.
            vistaVarAuxiliar.btnCancelarVariable.setNextElement('idbtnAplicarVariable');
            vistaVarAuxiliar.btnAceptarVariable.setPreviousElement('idbtnAplicarVariable');
            variablesGenerales.accionVariable = 'Add';
        }

        /**
         * Función de mostrar la ventana de modificar.
         */
        function mostrarVentanaModificarVariable() {
            vistaVarAuxiliar.cbTipoReporteVariable.disable();
            vistaVarAuxiliar.cbVarReporteVariable.disable();

            vistaVarAuxiliar.ventanaVariable.setTitle(idioma.lbTitleVentModificarVariable);
            vistaVarAuxiliar.btnAplicarVariable.hide();
            vistaVarAuxiliar.ventanaVariable.show();
            //Actualizar la tabulación deL formulario.
            vistaVarAuxiliar.btnCancelarVariable.setNextElement('idbtnAceptarVariable');
            vistaVarAuxiliar.btnAceptarVariable.setPreviousElement('idbtnCancelarVariable');
            var rowselect = vistaVarAuxiliar.smVariable.getSelected();

            vistaVarAuxiliar.formularioVariable.getForm().loadRecord(rowselect);
//            vistaVarAuxiliar.formularioVariable.addListener('clientvalidation', function (_form, _valid) {
//                if (comparar(vistaVarAuxiliar.formularioVariable.getForm().getValues(), rowselect.data)) {
//                    vistaVarAuxiliar.btnAceptarVariable.setDisabled(true);
//                } else {
//                    vistaVarAuxiliar.btnAceptarVariable.enable()
//                }
//            });
            variablesGenerales.accionVariable = 'Mod';

            if (rowselect.get('idconfreportescertificaciones')) {
                vistaVarAuxiliar.cbTipoReporteVariable.enable();
                vistaVarAuxiliar.cbVarReporteVariable.enable();
                vistaVarAuxiliar.cbVarReporteVariable.setRawValue(rowselect.get('denomvarreporte'));
            }
        }

        /* Estructuras escalares. */
        vistaEstEscalar.ventanaEstrucEsc.on('beforeshow', function (ventana) {
            vistaEstEscalar.formularioEstrucEsc.getForm().reset();
            vistaEstEscalar.tfDenomEstrucEsc.focus(true, 500);
        });

        /**
         * Función de mostrar la ventana de adicionar.
         */
        function mostrarVentanaAdicionarEstrucEsc() {
            vistaEstEscalar.cbNomencladorEstrucEsc.disable();
            vistaEstEscalar.cbTipoReporteEstrucEsc.disable();
            vistaEstEscalar.cbVarReporteEstrucEsc.disable();

            vistaEstEscalar.ventanaEstrucEsc.setTitle(idioma.lbTitleVentAdicionarEstrucEsc);
            vistaEstEscalar.btnAplicarEstrucEsc.show();
            vistaEstEscalar.ventanaEstrucEsc.show();
            //Actualizar la tabulación deL formulario.
            vistaEstEscalar.btnCancelarEstrucEsc.setNextElement('idbtnAplicarEstrucEsc');
            vistaEstEscalar.btnAceptarEstrucEsc.setPreviousElement('idbtnAplicarEstrucEsc');
            variablesGenerales.accionEstrucEsc = 'Add';
        }

        /**
         * Función de mostrar la ventana de modificar.
         */
        function mostrarVentanaModificarEstrucEsc() {
            vistaEstEscalar.cbNomencladorEstrucEsc.disable();
            vistaEstEscalar.cbTipoReporteEstrucEsc.disable();
            vistaEstEscalar.cbVarReporteEstrucEsc.disable();

            vistaEstEscalar.ventanaEstrucEsc.setTitle(idioma.lbTitleVentModificarEstrucEsc);
            vistaEstEscalar.btnAplicarEstrucEsc.hide();
            vistaEstEscalar.ventanaEstrucEsc.show();
            //Actualizar la tabulación deL formulario.
            vistaEstEscalar.btnCancelarEstrucEsc.setNextElement('idbtnAceptarEstrucEsc');
            vistaEstEscalar.btnAceptarEstrucEsc.setPreviousElement('idbtnCancelarEstrucEsc');

            var rowselect = vistaEstEscalar.smEstrucEsc.getSelected();

            vistaEstEscalar.formularioEstrucEsc.getForm().loadRecord(rowselect);
            variablesGenerales.accionEstrucEsc = 'Mod';

            if (rowselect.get('idnomencladorreferencia')) {
                vistaEstEscalar.cbNomencladorEstrucEsc.enable();
            }

            if (rowselect.get('idconfreportescertificaciones')) {
                vistaEstEscalar.cbTipoReporteEstrucEsc.enable();
                vistaEstEscalar.cbVarReporteEstrucEsc.enable();
                vistaEstEscalar.cbVarReporteEstrucEsc.setRawValue(rowselect.get('denomvarreporte'));
            }
        }

        /* Adyacentes. */
        vistaAdyacente.ventanaMatrizAdy.on('beforeshow', function (ventana) {
            vistaAdyacente.formularioMatrizAdy.getForm().reset();
            vistaAdyacente.cbEstrucEscAdy.focus(true, 500);
        });

        /**
         * Función de mostrar la ventana de adicionar.
         */
        function mostrarVentanaAdicionarAdyacente() {

            vistaAdyacente.ventanaMatrizAdy.setTitle(idioma.lbTitleVentAdicionarMatrizAdy);
            vistaAdyacente.ventanaMatrizAdy.show();
            variablesGenerales.accionAdyacente = 'Add';
        }

        /* Escalas. */
        vistaEscala.ventanaEscala.on('beforeshow', function (ventana) {
            vistaEscala.formularioEscala.getForm().reset();
        });

        vistaEscala.ventanaEscala.on('hide', function (ventana) {
            vistaEscala.formularioEscala.remove(vistaEscala.formularioEscala.getComponent(0).getId())
        });

        /**
         * Función para mostrar la ventana de adicionar.
         */
        function mostrarVentanaAdicionarEscala(identificador) {
            Ext.getCmp('colcbOperadorEscala').hide();
            vistaEscala.cbOperadorEscala.disable();

            Ext.getCmp('coltfValInicialEscala').hide();
            vistaEscala.tfValInicialEscala.disable();

            Ext.getCmp('coltfValFinalEscala').hide();
            vistaEscala.tfValFinalEscala.disable();

            Ext.getCmp('colcbFormaCalculoEscala').hide();
            vistaEscala.cbFormaCalculoEscala.disable();

            Ext.getCmp('coltfImporteFormulaEscala').hide();
            vistaEscala.tfImporteFormulaEscala.disable();

            variablesGenerales.idEscEstEsc = identificador;

            var record = modelo.storeEstrucEsc.getById(identificador);
            var comptEscala;
            //Se contruye el componente en dependencia del tipo de campo.
            if (record.get('idtipocampo') == 1) {//Nomenclador.

                var storeComptEscala = new Ext.data.Store({
                    url: 'obtenerValoresNomencladorDadoId',
                    reader: new Ext.data.JsonReader({
                        root: "datos",
                        totalProperty: "cantidad",
                        id: "valor"
                    }, [
                        {name: 'valor'},
                        {name: 'denominacion'},
                        {name: 'descripcion'}
                    ])
                });

                storeComptEscala.load({params: {idnomenclador: record.get('idnomencladorreferencia')}});

                comptEscala = new Ext.form.ComboBox({
                    fieldLabel: record.get('denominacion'),
                    valueField: 'valor',
                    displayField: 'denominacion',
                    hiddenName: 'valor',
                    allowBlank: false,
                    mode: 'local',
                    store: storeComptEscala,
                    emptyText: 'Seleccione...',
                    blankText: idioma.lbErrorCampoVacio,
                    readOnly: true,
                    triggerAction: 'all',
                    anchor: '99%',
                    prevTab: vistaEscala.btnAceptarEscala.getId(),
                    listeners: {
                        change: function () {
                            variablesGenerales.cambioEscala = 1;
                        }
                    }
                });
            } else {//Texto.

                comptEscala = new Ext.form.TextField({
                    fieldLabel: record.get('denominacion'),
                    allowBlank: false,
                    anchor: '99%',
                    prevTab: vistaEscala.btnAceptarEscala.getId(),
                    blankText: idioma.lbErrorCampoVacio,
                    listeners: {
                        change: function () {
                            variablesGenerales.cambioEscala = 1;
                        }
                    }
                });

                //Se muestran los operadores de comparación en caso que sea texto y por reporte.
                if (record.get('idconfreportescertificaciones')) {
                    Ext.getCmp('colcbOperadorEscala').show();
                    vistaEscala.cbOperadorEscala.enable();

                    Ext.getCmp('coltfValInicialEscala').show();
                    vistaEscala.tfValInicialEscala.enable();

                    Ext.getCmp('coltfValFinalEscala').show();
                }
            }

            //Se muestran la forma de cálculo en caso que sea hoja.
            if (record.get('nivel') == 1) {//Hoja.
                Ext.getCmp('colcbFormaCalculoEscala').show();
                vistaEscala.cbFormaCalculoEscala.enable();

                Ext.getCmp('coltfImporteFormulaEscala').show();
                vistaEscala.tfImporteFormulaEscala.enable();
            }

            //Establecer tabulación del botón aceptar.
            //vistaEscala.btnAceptarEscala.setNextElement(comptEscala.getId());

            vistaEscala.formularioEscala.insert(0, comptEscala);

            vistaEscala.ventanaEscala.setTitle(idioma.lbTitleVentAdicionarEscala);
            vistaEscala.ventanaEscala.show();

            //Actualizar la tabulación deL formulario.
            comptEscala.setPreviousElement('idbtnAceptarEscala');
            comptEscala.setNextElement('idcbOperadorEscala');
            vistaEscala.btnAceptarEscala.setNextElement(comptEscala.getId());
            comptEscala.focus(true, 500);
            variablesGenerales.accionEscala = 'Add';
        }

        /**
         * Función para mostrar la ventana de modificar.
         */
        function mostrarVentanaModificarEscala() {
            Ext.getCmp('colcbOperadorEscala').hide();
            vistaEscala.cbOperadorEscala.disable();

            Ext.getCmp('coltfValInicialEscala').hide();
            vistaEscala.tfValInicialEscala.disable();

            Ext.getCmp('coltfValFinalEscala').hide();
            vistaEscala.tfValFinalEscala.disable();

            Ext.getCmp('colcbFormaCalculoEscala').hide();
            vistaEscala.cbFormaCalculoEscala.disable();

            Ext.getCmp('coltfImporteFormulaEscala').hide();
            vistaEscala.tfImporteFormulaEscala.disable();

            var record = vistaEscala.smEscala.getSelected();
            var estesc = modelo.storeEstrucEsc.getById(record.get('idestructuraescalar'));

            variablesGenerales.idEscEstEsc = record.get('idestructuraescalar');

            //Se contruye el componente en dependencia del tipo de campo.
            if (estesc.get('idtipocampo') == 1) {//Nomenclador.

                var storeComptEscala = new Ext.data.Store({
                    url: 'obtenerValoresNomencladorDadoId',
                    reader: new Ext.data.JsonReader({
                        root: "datos",
                        totalProperty: "cantidad",
                        id: "valor"
                    }, [
                        {name: 'valor'},
                        {name: 'denominacion'},
                        {name: 'descripcion'}
                    ])
                });

                comptEscala = new Ext.form.ComboBox({
                    fieldLabel: estesc.get('denominacion'),
                    valueField: 'valor',
                    displayField: 'denominacion',
                    hiddenName: 'valor',
                    allowBlank: false,
                    mode: 'local',
                    store: storeComptEscala,
                    emptyText: 'Seleccione...',
                    blankText: idioma.lbErrorCampoVacio,
                    readOnly: true,
                    triggerAction: 'all',
                    anchor: '99%',
                    prevTab: vistaEscala.btnAceptarEscala.getId(),
                    listeners: {
                        change: function () {
                            variablesGenerales.cambioEscala = 1;
                        }
                    }
                });

                storeComptEscala.load({
                    params: {idnomenclador: estesc.get('idnomencladorreferencia')},
                    callback: function () {
                        comptEscala.setValue(record.get('valorescalar'));
                    }
                });

            } else {//Texto.

                comptEscala = new Ext.form.TextField({
                    fieldLabel: estesc.get('denominacion'),
                    allowBlank: false,
                    anchor: '99%',
                    prevTab: vistaEscala.btnAceptarEscala.getId(),
                    blankText: idioma.lbErrorCampoVacio,
                    listeners: {
                        change: function () {
                            variablesGenerales.cambioEscala = 1;
                        },
                        render: function () {
                            this.setValue(record.get('valorescalar'));
                        }
                    }
                });


                //Se muestran los operadores de comparación en caso que sea texto y por reporte.
                if (estesc.get('idconfreportescertificaciones')) {
                    Ext.getCmp('colcbOperadorEscala').show();
                    vistaEscala.cbOperadorEscala.enable();

                    Ext.getCmp('coltfValInicialEscala').show();
                    vistaEscala.tfValInicialEscala.enable();

                    Ext.getCmp('coltfValFinalEscala').show();
                }
            }

            //Se muestran la forma de cálculo en caso que sea hoja.
            if (estesc.get('nivel') == 1) {//Hoja.
                Ext.getCmp('colcbFormaCalculoEscala').show();
                vistaEscala.cbFormaCalculoEscala.enable();

                Ext.getCmp('coltfImporteFormulaEscala').show();
                vistaEscala.tfImporteFormulaEscala.enable();
            }

            if (record.get('valorfinal') == null) {
                vistaEscala.tfValFinalEscala.disable();
            } else {
                vistaEscala.tfValFinalEscala.enable();
            }

            vistaEscala.formularioEscala.insert(0, comptEscala);

            vistaEscala.ventanaEscala.setTitle(idioma.lbTitleVentModificarEscala);
            vistaEscala.ventanaEscala.show();

            vistaEscala.formularioEscala.getForm().loadRecord(record);

            //Actualizar la tabulación deL formulario.
            comptEscala.setPreviousElement('idbtnAceptarEscala');
            comptEscala.setNextElement('idcbOperadorEscala');
            vistaEscala.btnAceptarEscala.setNextElement(comptEscala.getId());
            comptEscala.focus(true, 500);
            variablesGenerales.accionEscala = 'Mod';
        }

        /*
         * Funciones de adicionar, modificar y eliminar.
         */

        /* Concepto. */

        /*
         *Función para adicionar/modificar un concepto.
         */
        function salvarFormularioConcepto(boton) {
            var urlAction = 'adicionarConceptoPercepcionDescuento';
            var idconcepto = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarConcepto;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoConcepto;

            if (variablesGenerales.accionConcepto == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarConcepto;
                lbMsgExito = idioma.lbMsgCorrectoModificadoConcepto;
                urlAction = 'modificarConceptoPercepcionDescuento';
                idconcepto = vistaConcepto.smConcepto.getSelected().get('idconceptopercepciondescuento');

            }
            if (variablesGenerales.cambioConcepto == 0) {
                if (variablesGenerales.accionConcepto == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vistaConcepto.ventanaConcepto.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vistaConcepto.tfAbrevConcepto.markInvalid(idioma.lbErrorCampoVacio);
                    vistaConcepto.tfDenomConcepto.markInvalid(idioma.lbErrorCampoVacio);
                    vistaConcepto.cbTipoConcepto.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido.
                if (vistaConcepto.formularioConcepto.getForm().isValid()) {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodconcepto', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idconcepto: idconcepto,
                            abreviatura: vistaConcepto.tfAbrevConcepto.getValue(),
                            esdescuento: variablesGenerales.esdescuento,
                            idformula: (variablesGenerales.idexpresionmatematica) ? variablesGenerales.idexpresionmatematica : -1,
                            denominacion: vistaConcepto.tfDenomConcepto.getValue(),
                            idtipoconcepto: vistaConcepto.cbTipoConcepto.getValue(),
                            fechainicio: vistaConcepto.dfFInicioConcepto.getRawValue(),
                            fechafin: vistaConcepto.dfFFinConcepto.getRawValue(),
                            descripcion: vistaConcepto.tfDescripConcepto.getValue(),
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodconcepto');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vistaConcepto.ventanaConcepto.hide();

                                } else {
                                    vistaConcepto.tfAbrevConcepto.focus(true, 500);
                                }
                                vistaConcepto.formularioConcepto.getForm().reset();
                                modelo.storeConcepto.removeAll();
                                variablesGenerales.esdescuento = 0;
                                modelo.storeConcepto.load({params: {limit: 1000, start: 0}});
                                variablesGenerales.cambioConcepto = 0;


                            } else {
                                mostrarMensaje(3, responseData.msg);
                            }
                        }
                    });

                } else {
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }
        }

        /*
         *Función para eliminar un concepto.
         */
        function eliminarConcepto() {
            //Mostrando el mensaje para aceptar la eliminar un concepto.
            mostrarMensaje(2, idioma.lbTitleEliminarConcepto, function (btn) {
                if (btn == "ok") {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarconcepto', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarConcepto);

                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: 'eliminarConceptoPercepcionDescuento',
                        method: 'POST',
                        params: {idconcepto: vistaConcepto.smConcepto.getSelected().get('idconceptopercepciondescuento')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarconcepto');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha eliminado el concepto.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoConcepto);
                                //Recargando el grid de concepto.
                                modelo.storeConcepto.load({params: {limit: 1000, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, "El concepto de percepción y descuento que quiere eliminar esta siendo usado");
                            }
                        }
                    });
                }
            });
        }

        /* Tarifa. */

        /*
         *Función para adicionar/modificar una tarifa.
         */
        function salvarFormularioTarifa(boton) {
            var urlAction = 'adicionarTarifaConcepto';
            var idtarifaconcepto = 0;
            var idconcepto = vistaConcepto.smConcepto.getSelected().get('idconceptopercepciondescuento');
            var lbMsgEspera = idioma.lbMsgAdicionarTarifa;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoTarifa;

            if (variablesGenerales.accionTarifa == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarTarifa;
                lbMsgExito = idioma.lbMsgCorrectoModificadoTarifa;
                urlAction = 'modificarTarifaConcepto';
                idtarifaconcepto = vistaTarifa.smTarifa.getSelected().get('idconceptopdtarifa');
            }
            if (variablesGenerales.cambioTarifa == 0) {
                if (variablesGenerales.accionTarifa == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vistaTarifa.ventanaTarifa.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vistaTarifa.cbTarifas.markInvalid(idioma.lbErrorCampoVacio);
                    vistaTarifa.cbFormaCalculoTarifa.markInvalid(idioma.lbErrorCampoVacio);
                    vistaTarifa.tfImporteFormula.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido.
                if (vistaTarifa.formularioTarifa.getForm().isValid()) {
                    if (vistaTarifa.cbFormaCalculoTarifa.getValue() == 1 && isNaN(vistaTarifa.tfImporteFormula.getValue())) {
                        mostrarMensaje(3, "El importe debe ser num&eacute;rico");
                    } else {
                        //Se muestra la máscara de espera.
                        PVD.mostrarMascara('idmaskaddmodtarifa', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                        //Enviando datos al servidor.
                        Ext.Ajax.request({
                            url: urlAction,
                            method: 'POST',
                            params: {
                                idtarifaconcepto: idtarifaconcepto,
                                idconcepto: idconcepto,
                                idtarifa: vistaTarifa.cbTarifas.getValue(),
                                idformacalculo: vistaTarifa.cbFormaCalculoTarifa.getValue(),
                                importe: (vistaTarifa.cbFormaCalculoTarifa.getValue() == 1) ? vistaTarifa.tfImporteFormula.getValue() : null,
                                idformula: (vistaTarifa.cbFormaCalculoTarifa.getValue() == 2) ? variablesGenerales.idexpresionmatematica : null,
                                lugaresdecimales: vistaTarifa.nfCantidadLugaresDecimales.getValue()
                            },
                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);

                                //Ocultando máscara de enviar datos.
                                PVD.ocultarMascara('idmaskaddmodtarifa');

                                if (responseData.codigo == 1) {
                                    mostrarMensaje(1, lbMsgExito);
                                    if (!boton) {
                                        vistaTarifa.ventanaTarifa.hide();

                                    } else {
                                        vistaTarifa.cbTarifas.focus(true, 500);
                                        vistaTarifa.tfImporteFormula.disable();
                                    }
                                    vistaTarifa.formularioTarifa.getForm().reset();
                                    modelo.storeTarifa.removeAll();
                                    modelo.storeTarifa.load();
                                    variablesGenerales.cambioTarifa = 0;


                                } else {
                                    if (responseData.codigo)
                                        mostrarMensaje(responseData.codigo, responseData.mensaje);
                                }
                            }
                        });
                    }

                } else {
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }
        }

        /*
         *Función para aeliminar una tarifa.
         */
        function eliminarTarifa() {
            //Mostrando el mensaje para aceptar la eliminar una tarifa.
            mostrarMensaje(2, idioma.lbTitleEliminarTarifa, function (btn) {
                if (btn == "ok") {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminartarifa', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarTarifa);

                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: 'eliminarTarifaConcepto',
                        method: 'POST',
                        params: {idtarifaconcepto: vistaTarifa.smTarifa.getSelected().get('idconceptopdtarifa')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminartarifa');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha eliminado la tarifa.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoTarifa);
                                //Recargando el grid de tarifa.
                                modelo.storeTarifa.load();

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, "La tarifa que quiere eliminar esta siendo usada");
                            }
                        }
                    });
                }
            });
        }

        /* Variable auxiliares */

        /*
         *Función para adicionar/modificar una variable auxiliar.
         */
        function salvarFormularioVariable(boton) {
            var urlAction = 'adicionarVariableAuxiliarFormula';
            var idvariableauxiliar = 0;
            var idconcepto = vistaConcepto.smConcepto.getSelected().get('idconceptopercepciondescuento');
            var lbMsgEspera = idioma.lbMsgAdicionarVariable;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoVariable;

            if (variablesGenerales.accionVariable == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarVariable;
                lbMsgExito = idioma.lbMsgCorrectoModificadoVariable;
                urlAction = 'modificarVariableAuxiliarFormula';
                idvariableauxiliar = vistaVarAuxiliar.smVariable.getSelected().get('idvariableauxiliarformula');
            }
            if (variablesGenerales.cambioVariable == 0) {
                if (variablesGenerales.accionVariable == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vistaVarAuxiliar.ventanaVariable.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vistaVarAuxiliar.tfDenomVariable.markInvalid(idioma.lbErrorCampoVacio);
                    vistaVarAuxiliar.cbFormaEntradaVariable.markInvalid(idioma.lbErrorCampoVacio);
                    if (!vistaVarAuxiliar.cbTipoReporteVariable.disabled) {
                        vistaVarAuxiliar.cbTipoReporteVariable.markInvalid(idioma.lbErrorCampoVacio);
                    }
                    if (!vistaVarAuxiliar.cbVarReporteVariable.disabled) {
                        vistaVarAuxiliar.cbVarReporteVariable.markInvalid(idioma.lbErrorCampoVacio);
                    }
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido.
                if (vistaVarAuxiliar.formularioVariable.getForm().isValid()) {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodvariable', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idvariableauxiliar: idvariableauxiliar,
                            idconcepto: idconcepto,
                            denomvariable: vistaVarAuxiliar.tfDenomVariable.getValue(),
                            idformaentrada: vistaVarAuxiliar.cbFormaEntradaVariable.getValue(),
                            idtiporeporte: vistaVarAuxiliar.cbTipoReporteVariable.getValue(),
                            idvarreporte: vistaVarAuxiliar.cbVarReporteVariable.getValue(),
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodvariable');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vistaVarAuxiliar.ventanaVariable.hide();

                                } else {
                                    vistaVarAuxiliar.cbTipoReporteVariable.disable();
                                    vistaVarAuxiliar.cbVarReporteVariable.disable();
                                    vistaVarAuxiliar.tfDenomVariable.focus(true, 500);
                                }
                                vistaVarAuxiliar.formularioVariable.getForm().reset();
                                modelo.storeVariable.removeAll();
                                modelo.storeVariable.load();
                                variablesGenerales.cambioVariable = 0;


                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, responseData.mensaje);
                            }
                        }
                    });

                } else {
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }
        }

        /*
         *Función para eliminar una variable auxiliar.
         */
        function eliminarVariable() {
            //Mostrando el mensaje para aceptar la eliminar una variable auxiliar.
            mostrarMensaje(2, idioma.lbTitleEliminarVariable, function (btn) {
                if (btn == "ok") {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarvariable', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarVariable);

                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: 'eliminarVariableAuxiliarFormula',
                        method: 'POST',
                        params: {idvariableauxiliar: vistaVarAuxiliar.smVariable.getSelected().get('idvariableauxiliarformula')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarvariable');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha eliminado la variable auxiliar.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoVariable);
                                //Recargando el grid de variable auxiliar.
                                modelo.storeVariable.load();

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, "La variable auxiliar de fórmula que quiere eliminar esta siendo usada");
                            }
                        }
                    });
                }
            });
        }

        /* Estructuras escalares. */

        /*
        * Función para adicionar/modificar una estructura escalar.
        */
        function salvarFormularioEstructaEscalar(boton) {
            var urlAction = 'adicionarEstructuraEscalar';
            var idestrucesc = 0;
            var idtarifaconcepto = vistaTarifa.smTarifa.getSelected().get('idconceptopdtarifa');
            var lbMsgEspera = idioma.lbMsgAdicionarEstrucEsc;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoEstrucEsc;

            if (variablesGenerales.accionEstrucEsc == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarEstrucEsc;
                lbMsgExito = idioma.lbMsgCorrectoModificadoEstrucEsc;
                urlAction = 'modificarEstructuraEscalar';
                idestrucesc = vistaEstEscalar.smEstrucEsc.getSelected().get('idestructuraescalar');
            }
            if (variablesGenerales.cambioEstrucEsc == 0) {
                if (variablesGenerales.accionEstrucEsc == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vistaEstEscalar.ventanaEstrucEsc.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vistaEstEscalar.tfDenomEstrucEsc.markInvalid(idioma.lbErrorCampoVacio);
                    vistaEstEscalar.cbTipoCampoEstrucEsc.markInvalid(idioma.lbErrorCampoVacio);
                    if (!vistaEstEscalar.cbNomencladorEstrucEsc.disabled) {
                        vistaEstEscalar.cbNomencladorEstrucEsc.markInvalid(idioma.lbErrorCampoVacio);
                    }
                    vistaEstEscalar.cbHojaEstrucEsc.markInvalid(idioma.lbErrorCampoVacio);
                    vistaEstEscalar.cbFormaEntradaEstrucEsc.markInvalid(idioma.lbErrorCampoVacio);
                    if (!vistaEstEscalar.cbTipoReporteEstrucEsc.disabled) {
                        vistaEstEscalar.cbTipoReporteEstrucEsc.markInvalid(idioma.lbErrorCampoVacio);
                    }
                    if (!vistaEstEscalar.cbVarReporteEstrucEsc.disabled) {
                        vistaEstEscalar.cbVarReporteEstrucEsc.markInvalid(idioma.lbErrorCampoVacio);
                    }
                    if (!vistaEstEscalar.tfLugaresdecimales.disabled) {
                        vistaEstEscalar.tfLugaresdecimales.markInvalid(idioma.lbErrorCampoVacio);
                    }
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido.
                if (vistaEstEscalar.formularioEstrucEsc.getForm().isValid()) {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodestrucesc', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idestrucesc: idestrucesc,
                            idtarifaconcepto: idtarifaconcepto,
                            denomestruc: vistaEstEscalar.tfDenomEstrucEsc.getValue(),
                            idtipocampo: vistaEstEscalar.cbTipoCampoEstrucEsc.getValue(),
                            idnomenclador: vistaEstEscalar.cbNomencladorEstrucEsc.getValue(),
                            nivel: vistaEstEscalar.cbHojaEstrucEsc.getValue(),
                            idformaentrada: vistaEstEscalar.cbFormaEntradaEstrucEsc.getValue(),
                            idtiporeporte: vistaEstEscalar.cbTipoReporteEstrucEsc.getValue(),
                            idvarreporte: vistaEstEscalar.cbVarReporteEstrucEsc.getValue(),
                            lugaresdecimales: vistaEstEscalar.tfLugaresdecimales.getValue()
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodestrucesc');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vistaEstEscalar.ventanaEstrucEsc.hide();

                                } else {
                                    vistaEstEscalar.cbNomencladorEstrucEsc.disable();
                                    vistaEstEscalar.cbTipoReporteEstrucEsc.disable();
                                    vistaEstEscalar.cbVarReporteEstrucEsc.disable();
                                    vistaEstEscalar.tfDenomEstrucEsc.focus(true, 500);
                                }
                                vistaEstEscalar.formularioEstrucEsc.getForm().reset();
                                modelo.storeEstrucEsc.removeAll();
                                modelo.storeEstrucEsc.load();
                                variablesGenerales.cambioEstrucEsc = 0;


                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, responseData.mensaje);
                            }
                        }
                    });

                } else {
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }
        }

        /*
         *Función para eliminar una estructura escalar.
         */
        function eliminarEstructuraEscalar() {
            //Mostrando el mensaje para aceptar la eliminar una estructura escalar.
            mostrarMensaje(2, idioma.lbTitleEliminarEstrucEsc, function (btn) {
                if (btn == "ok") {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarestrucesc', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarEstrucEsc);

                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: 'eliminarEstructuraEscalar',
                        method: 'POST',
                        params: {idestrucesc: vistaEstEscalar.smEstrucEsc.getSelected().get('idestructuraescalar')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarestrucesc');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha eliminado la estructura escalar.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoEstrucEsc);
                                //Recargando el grid de estructura escalar.
                                modelo.storeEstrucEsc.load();

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, "La estructura escalar que quiere eliminar esta siendo usada");
                            }
                        }
                    });
                }
            });
        }

        /* Adyacente. */

        /*
        * Función para adicionar/modificar una estructura escalar adyacente.
        */
        function salvarFormularioAdyacente(boton) {

            if (variablesGenerales.cambioAdyacente == 0) {
                vistaAdyacente.cbEstrucEscAdy.markInvalid(idioma.lbErrorCampoVacio);
                mostrarMensaje(3, idioma.lbErrorFormulario);
            } else {
                //Se verifica si el formulario es válido.
                if (vistaAdyacente.formularioMatrizAdy.getForm().isValid()) {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodadyacente', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgAdicionarAdyacente);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: 'adicionarEstructuraEscalarAdyacente',
                        method: 'POST',
                        params: {
                            idestrucesc: vistaEstEscalar.smEstrucEsc.getSelected().get('idestructuraescalar'),
                            idadyacente: vistaAdyacente.cbEstrucEscAdy.getValue(),
                            idconceptopdtarifa: variablesGenerales.idtarifaconcepto
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodadyacente');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, idioma.lbMsgCorrectoAdicionadoAdyacente);

                                if (!boton) {
                                    vistaAdyacente.ventanaMatrizAdy.hide();
                                } else {
                                    vistaAdyacente.cbEstrucEscAdy.focus(true, 500);
                                }
                                vistaAdyacente.formularioMatrizAdy.getForm().reset();
                                modelo.storeMatrizAdy.removeAll();
                                modelo.storeMatrizAdy.load();
                                variablesGenerales.cambioAdyacente = 0;


                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, responseData.mensaje);
                            }
                        }
                    });

                } else {
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }
        }

        /*
         *Función para eliminar una estructura escalar adyacente.
         */
        function eliminarAdyacente() {
            //Mostrando el mensaje para aceptar la eliminar una estructura escalar adyacente.
            mostrarMensaje(2, idioma.lbTitleEliminarAdyacente, function (btn) {
                if (btn == "ok") {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminaradyacente', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarAdyacente);

                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: 'eliminarEstructuraEscalarAdyacente',
                        method: 'POST',
                        params: {idestadyacente: vistaAdyacente.smMatrizAdy.getSelected().get('iddependenciaestructuraescalar')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminaradyacente');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo) {
                                //Mostrando el mensaje de que se ha eliminado la estructura escalar adyacente.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoAdyacente);
                                //Recargando el grid de estructura escalar adyacente.
                                modelo.storeMatrizAdy.load();

                            }
                        }
                    });
                }
            });
        }

        /* Escalas. */

        /*
         * Función para crear el menú de botones.
         */
        function construirMenuBotonesEscala(campos) {

            vistaEscala.btnMenuAdicionarEscala.removeAll();
            //Longitud del arreglo.
            var longitud = campos.length;

            //Se recorre el arreglo, se construyen los items del menú y se agregan al adicionar.
            for (var i = 0; i < longitud; i++) {
                vistaEscala.btnMenuAdicionarEscala.add({
                    id: campos[i]['id'],
                    text: 'Escala de ' + campos[i]['text'].toLowerCase(),
                    handler: function () {
                        mostrarVentanaAdicionarEscala(this.getId());
                    }
                });
            }
        }

        /*
         * Función para adicionar/modificar una escala.
         */
        function salvarFormularioEscala(boton) {

            var urlAction = 'adicionarEscalaTarifa';
            var idescala = 0;
            var idtarifaconcepto = vistaTarifa.smTarifa.getSelected().get('idconceptopdtarifa');
            var lbMsgEspera = idioma.lbMsgAdicionarEscala;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoEscala;
            var comp = vistaEscala.formularioEscala.getComponent(0);

            if (variablesGenerales.accionEscala == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarEscala;
                lbMsgExito = idioma.lbMsgCorrectoModificadoEscala;
                urlAction = 'modificarEscalaTarifa';
                idescala = vistaEscala.smEscala.getSelected().get('idescalatarifa');
            }
            if (variablesGenerales.cambioEscala == 0) {

                if (variablesGenerales.accionEscala == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vistaEscala.ventanaEscala.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    comp.markInvalid(idioma.lbErrorCampoVacio);
                    if (vistaEscala.cbOperadorEscala.isVisible()) {
                        vistaEscala.cbOperadorEscala.markInvalid(idioma.lbErrorCampoVacio);
                        vistaEscala.tfValInicialEscala.markInvalid(idioma.lbErrorCampoVacio);
                    }

                    if (vistaEscala.cbFormaCalculoEscala.isVisible()) {
                        vistaEscala.cbFormaCalculoEscala.markInvalid(idioma.lbErrorCampoVacio);
                        vistaEscala.tfImporteFormulaEscala.markInvalid(idioma.lbErrorCampoVacio);
                    }

                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido.
                if (vistaEscala.formularioEscala.getForm().isValid()) {
                    if (vistaEscala.cbFormaCalculoEscala.getValue() == 1 && isNaN(vistaEscala.tfImporteFormulaEscala.getValue())) {
                        mostrarMensaje(3, "El importe debe ser num&eacute;rico");
                    } else {
                        //Se muestra la máscara de espera.
                        PVD.mostrarMascara('idmaskaddmodescala', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                        //Enviando datos al servidor.
                        Ext.Ajax.request({
                            url: urlAction,
                            method: 'POST',
                            params: {
                                idescala: idescala,
                                idestrucesc: variablesGenerales.idEscEstEsc,
                                valorescala: comp.getValue(),
                                idtarifaconcepto: idtarifaconcepto,
                                idoperador: vistaEscala.cbOperadorEscala.getValue(),
                                valorinicial: vistaEscala.tfValInicialEscala.getValue(),
                                valorfinal: vistaEscala.tfValFinalEscala.getValue(),
                                formacalculo: vistaEscala.cbFormaCalculoEscala.getValue(),
                                importe: (vistaEscala.cbFormaCalculoEscala.getValue() == 1) ? vistaEscala.tfImporteFormulaEscala.getValue() : null,
                                idformula: (vistaEscala.cbFormaCalculoEscala.getValue() == 2) ? variablesGenerales.idexpresionmatematicaEscala : null,
                                idpadre: variablesGenerales.idEscIdPadre
                            },
                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);

                                //Ocultando máscara de enviar datos.
                                PVD.ocultarMascara('idmaskaddmodescala');

                                if (responseData.codigo == 1) {
                                    mostrarMensaje(1, lbMsgExito);
                                    if (!boton) {
                                        vistaEscala.ventanaEscala.hide();

                                    } else {
                                        vistaEscala.tfValFinalEscala.disable();
                                        comp.focus(true, 500);
                                    }
                                    vistaEscala.formularioEscala.getForm().reset();

                                    vistaEscala.btnModificarEscala.disable();
                                    vistaEscala.btnEliminarEscala.disable();

                                    modelo.storeEscala.removeAll();
                                    modelo.storeEscala.load();
                                    variablesGenerales.cambioEscala = 0;


                                } else {
                                    if (responseData.codigo)
                                        mostrarMensaje(responseData.codigo, responseData.mensaje);
                                }
                            }
                        });
                    }


                } else {
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }
        }

        /*
         *Función para eliminar una estructura escalar adyacente.
         */
        function eliminarEscala() {
            //Mostrando el mensaje para aceptar la eliminar una escala.
            mostrarMensaje(2, idioma.lbTitleEliminarEscala, function (btn) {
                if (btn == "ok") {

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarescala', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarEscala);

                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: 'eliminarEscalaTarifa',
                        method: 'POST',
                        params: {idescala: vistaEscala.smEscala.getSelected().get('idescalatarifa')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarescala');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha eliminado la escala.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoEscala);
                                //Recargando el grid de escala.
                                modelo.storeEscala.removeAll();
                                modelo.storeEscala.load();

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, "La escala que quiere eliminar esta siendo usada");
                            }
                        }
                    });
                }
            });
        }

        /**
         * Función para obtener los indicadores de fórmula de tarifa.
         */
        function obtenerIndicadoresFormula() {

            Ext.Ajax.request({
                url: 'obtenerIndicadoresFormula',
                method: 'POST',
                callback: function (options, success, response) {
                    variablesGenerales.indicadoresFormulaTarifa = Ext.decode(response.responseText);
                }
            });
        }

        /**
         * Función para convertir en arreglo.
         */
        function ConvertiraArreglo(arrObj) {

            var a = new Array();
            for (var i = 0; i < arrObj.length; i++) {
                var arr = new Array();
                arr[0] = arrObj[i].idindicador;
                arr[1] = arrObj[i].indicador;
                arr[2] = arrObj[i].tipo;
                a[i] = arr;
            }

            modelo.storeVariable.each(function (record) {
                var arr = new Array();
                arr[0] = 'VAF_' + record.get('idvariableauxiliarformula');
                arr[1] = record.get('denominacion');
                arr[2] = 'Variable auxiliar';
                //a[] = arr;
                a.push(arr);
            });

            return a;
        }

        //vistaConcepto.btnBuscar.on('click', function () {
        vistaConcepto.btnBuscar.setHandler(function () {
            modelo.storeConcepto.load({params: {limit: 1000, start: 0, criterio: vistaConcepto.tfbuscar.getValue()}});
        });
    }
}
