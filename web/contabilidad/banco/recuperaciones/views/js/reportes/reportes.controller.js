/* 
 * @autor Alejandro Mengana Perez
 * Grupo de desarrolladores de CONFIN
 */

Ext.namespace('Banco.Recuperaciones.Reportes');

Banco.Recuperaciones.Reportes.Controller = {
    inicio: function(idioma, vista, modelo) {

        this.cadenaListado = '';
        this.idOldreporteSeleccionado = '';
        
        //Reimplementacion de los validators de los campos fecha        
        vista.dfFechainicio.validator = function(value) {
            if (vista.dfFechainicio.getValue() && vista.dfFechafin.getValue()) {
                if (vista.dfFechainicio.getValue() > vista.dfFechafin.getValue()) {
                    return idioma.lbfechaminMayor;//mensaje inválido
                }
            }
            return true;
        };

        vista.dfFechafin.validator = function(value) {
            if (vista.dfFechafin.getValue() && vista.dfFechainicio.getValue()) {
                if (vista.dfFechafin.getValue() < vista.dfFechainicio.getValue()) {
                    return idioma.lbfechamaxMenor;//mensaje inválido
                }
            }
            return true;
        };
        
        //********************Carga del componente***********************************		
        vista.MostrarEtiquetas(Ext.getBody(), idioma.msgCargando);

        Ext.Ajax.request({
            url: 'loadDataIni',
            method: 'POST',
            callback: function(options, success, response) {

                responseData = Ext.decode(response.responseText);

                //Carga el combo tipo cuenta
                modelo.sttipocuenta.loadData(responseData.tiposcuentas);

                //Carga el combo de ejercicios
                modelo.stejercicio.loadData(responseData.ejercicios);

                //Cargar el combo tree grid                
                Ext.getCmp('gpEntidad').getStore().loadData(responseData.estructurae);
                if (responseData.estructurae.datos[0].idestructurae && responseData.estructurae.datos[0].descripcion)
                    vista.cbxEntidad.enable();

                //carga el store de la cuentas bancarias
                modelo.stCuentaBancaria.loadData(responseData.cuentasbancarias);

                //darle el foco al combo del tipo de reporte
                vista.cbtipoReporte.focus();

                vista.lMask.hide();
            }
        });

        //*******************************************************************************

        //***********Funcionalidades y Eventos ********************************

        vista.cbEjercicio.on('select', function(combo, record) {
            vista.MostrarEtiquetas(vista.panelFiltros.getEl(), idioma.msgCargando);

            modelo.stperiodo.load({
                params: {
                    idejercicio: combo.getValue()
                },
                scope: this,
                callback: function(record, options, success) {
                    vista.cbPeriodo.setDisabled(false);
                    vista.dfFechainicio.setDisabled(false);
                    vista.dfFechafin.setDisabled(false);

                    vista.cbPeriodo.focus();
                    vista.cbPeriodo.setValue(record[0].data.idperiodo);

                    fechamin = new Date(record[0].data.inicio);
                    fechamax = new Date(record[0].data.fin);
                    vista.dfFechainicio.setMinValue(fechamin);
                    vista.dfFechainicio.setMaxValue(fechamax);
                    vista.dfFechafin.setMinValue(fechamin);
                    vista.dfFechafin.setMaxValue(fechamax);
                    vista.dfFechainicio.setValue(fechamin);
                    vista.dfFechafin.setValue(fechamax);

                    vista.lMask.hide();
                }
            });
        }, this);

        vista.cbPeriodo.on('select', function(combo, record) {
            fechamin = new Date(record.data.inicio);
            fechamax = new Date(record.data.fin);
            vista.dfFechainicio.setMinValue(fechamin);
            vista.dfFechainicio.setMaxValue(fechamax);
            vista.dfFechafin.setMinValue(fechamin);
            vista.dfFechafin.setMaxValue(fechamax);
            vista.dfFechainicio.setValue(fechamin);
            vista.dfFechafin.setValue(fechamax);
        }, this);

        vista.cbtipoReporte.on('select', function(combo, record) {
            if (this.idOldreporteSeleccionado !== record.data.idReporte) {
                vista.btnVistaReporte.disable();
                //Para usar el setTitle, si en el componente no esta la propiedad title
                //hay que ponerle la propiedad ***header:true****
                vista.gpReporte.setTitle('');
                vista.gpReporte.autoExpandColumn = false;
                vista.gpReporte.reconfigure(
                    new Ext.data.GroupingStore({
                            groupField: 'agrupador',
                            reader: new Ext.data.JsonReader({
                                id: 'readerIni1'
                            },
                            [{name: 'agrupador'}])
                    }),
                    new Ext.grid.ColumnModel([])
                );

                this.cadenaListado = record.data.nombreReporte;
                if (record.data.identificador === 'tipocuenta') {
                    if (!Ext.getCmp('pdinamico').getComponent(0)) {
                        Ext.getCmp('pdinamico').add(vista.componentTipoCuenta());
                        Ext.getCmp('pdinamico1').add(vista.componentCuentaTipo());
                    } else {
                        Ext.getCmp('pdinamico').remove(Ext.getCmp('pdinamico').getComponent(0), true);
                        Ext.getCmp('pdinamico').purgeListeners();
                        Ext.getCmp('pdinamico1').remove(Ext.getCmp('pdinamico1').getComponent(0), true);
                        Ext.getCmp('pdinamico1').purgeListeners();
                        Ext.getCmp('pdinamico').add(vista.componentTipoCuenta());
                        Ext.getCmp('pdinamico1').add(vista.componentCuentaTipo());
                    }
                } else {
                    if (!Ext.getCmp('pdinamico').getComponent(0)) {
                        Ext.getCmp('pdinamico').add(vista.componentCuentaBancaria());
                    } else {
                        Ext.getCmp('pdinamico').remove(Ext.getCmp('pdinamico').getComponent(0), true);
                        Ext.getCmp('pdinamico').purgeListeners();
                        Ext.getCmp('pdinamico1').remove(Ext.getCmp('pdinamico1').getComponent(0), true);
                        Ext.getCmp('pdinamico1').purgeListeners();
                        Ext.getCmp('pdinamico').add(vista.componentCuentaBancaria());
                    }
                }
                vista.panelFiltros.setHeight(217);
                Ext.getCmp('viewport').doLayout();
            }
        }, this);

        vista.cbtipoReporte.on('beforeselect', function(combo, record, index) {
            this.idOldreporteSeleccionado = combo.getValue();
        }, this);

        vista.btnAyuda.on('click', function() {
            help.show(idioma.lbtextTitleHelp, 'confin/banco/reportes/conciliacion');
        }, this);

        vista.btnAceptar.on('click', function() {
            if (vista.panelFiltros.getForm().isValid()) {
                var indice = modelo.sttipoReporte.find('idReporte', vista.cbtipoReporte.getValue());
                this.reporteSeleccionado = modelo.sttipoReporte.getAt(indice).data.identificador;
                
                if (this.reporteSeleccionado === 'tipocuenta' && vista.cbtipocuenta.isValid() && vista.dfFechafin.isValid()) {
                    modelo.streporteConciliacion.removeAll();
                    if (vista.cbtipoReporte.getValue() === '3')
                        modelo.streporteConciliacion.loadData(modelo.arrsaldoBanco);
                    else if (vista.cbtipoReporte.getValue() === '4')
                        modelo.streporteConciliacion.loadData(modelo.arrsaldoLibro);
                    else
                        modelo.streporteConciliacion.loadData(modelo.arrsaldoAjustado);

                    //Para usar el setTitle, si en el componente no esta la propiedad title
                    //hay que ponerle la propiedad ***header:true****
                    vista.gpReporte.setTitle(this.cadenaListado);
                    vista.gpReporte.autoExpandColumn = 'expandir';
                    vista.gpReporte.reconfigure(modelo.streporteConciliacion, vista.columnasReporteConciliacion());

                } else if (this.reporteSeleccionado === 'cuenta' && vista.cbCuentaBancaria.isValid() && vista.dfFechafin.isValid()) {
                    var indiceCuentaSeleccionada = modelo.stCuentaBancaria.find('idcuentabancaria', vista.cbCuentaBancaria.getValue());
                    this.nombCuenta = modelo.stCuentaBancaria.getAt(indiceCuentaSeleccionada).data.text;
                    var cadenaListado1 = 'Cuenta bancaria: ' + this.nombCuenta;
                    var titulogpCheques = this.cadenaListado + ' - ' + cadenaListado1;

                    //Para usar el setTitle, si en el componente no esta la propiedad title
                    //hay que ponerle la propiedad ***header:true****
                    vista.gpReporte.setTitle(titulogpCheques);
                    vista.gpReporte.autoExpandColumn = 'expandir';
                    vista.gpReporte.reconfigure(modelo.stCargarChequesReporte, vista.columnasCargarChequesReporte());
                    modelo.stCargarChequesReporte.removeAll();
                    this.cargarChequesReporte();                
                }
                vista.panelAbajo.doLayout();
                Ext.getCmp('viewport').doLayout();
                //vista.panelFiltros.collapse();
            }
        }, this);
        
        //Evento click para el boton de la vista reporte
        vista.btnVistaReporte.on('click', function(){
            var datosReporte = new Array();
            if(this.reporteSeleccionado === 'cuenta'){
                datosReporte = this.fArrReporteCheques();
            }
            var printView = vista.crearPrintView(datosReporte, {paperSize: "A4", orientation: "Vertical", reportType: "HTML"});
            printView.show();
        }, this);

        //funcion que llena el arreglo de entidades seleccionadas
        this.arrEntidades = function() {
            var sm = Ext.getCmp('gpEntidad').getSelectionModel();
            var cant = sm.getCount();
            var seleccionados = sm.getSelections();
            var arrentidades = new Array();
            for (i = 0; i < cant; i++) {
                arrentidades.push(seleccionados[i].data.idestructuracomun);
            }
            return arrentidades;
        };
        
        //Funcion para cargar el arreglo del reporte de los cheques
        this.fArrReporteCheques = function() {
            var arrdatosCheques = modelo.stCargarChequesReporte.data.items;
            var arrReporte = new Array();
            if (arrdatosCheques.length === 1) {
                arrdatosCheques[0].data['cabecera'] = '1';
                arrReporte.push(arrdatosCheques[0].data);
            } else {
                for (var i = 0; i < arrdatosCheques.length; i++) {
                    if (i === 0){
                        arrdatosCheques[i].data['cabecera'] = '1';
                        arrReporte.push(arrdatosCheques[i].data);
                    }
                    else if (arrdatosCheques[i].data.agrupador === arrdatosCheques[i - 1].data.agrupador) {
                        arrdatosCheques[i].data['cabecera'] = '0';
                        arrReporte.push(arrdatosCheques[i].data);
                    } else {
                        arrReporte.push({beneficiario: 'salto'});
                        arrdatosCheques[i].data['cabecera'] = '1';
                        arrReporte.push(arrdatosCheques[i].data);
                    }
                }
            }

            var datosGenerales = {
                titulo: this.cadenaListado,
                nombancaria: this.nombCuenta
            };

            var datosReporte = new Array({
                datoGeneral: datosGenerales,
                datoCuerpo: arrReporte,
                datoPie: null,
                reporte: '120003'
            });
            
            return datosReporte;
        };

        //Funcion para cargar el store del grid gpCargarChequesReporte y agregarlo en la vista
        this.cargarChequesReporte = function() {
            vista.MostrarEtiquetas(Ext.getBody(), idioma.msgCargando);
            modelo.stCargarChequesReporte.load({
                scope: this,
                params: {},
                callback: function(record, options, success) {
                    if(record.length > 0)
                        vista.btnVistaReporte.enable();                    
                    else {
                        //Para usar el setTitle, si en el componente no esta la propiedad title
                        //hay que ponerle la propiedad ***header:true****
                        vista.gpReporte.setTitle('');
                        vista.gpReporte.autoExpandColumn = false;
                        vista.gpReporte.reconfigure(
                            new Ext.data.GroupingStore({
                                groupField: 'agrupador',
                                reader: new Ext.data.JsonReader({
                                    id: 'readerIni1'
                                },
                                [{name: 'agrupador'}])
                            }),
                            new Ext.grid.ColumnModel([])
                        );
                        mostrarMensaje(1, idioma.msgNoRecuperacion, function(){});
                    }
                    vista.lMask.hide();
                }
            });
        };

    }
};