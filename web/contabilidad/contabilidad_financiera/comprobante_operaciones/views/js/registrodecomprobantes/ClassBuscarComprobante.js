Ext.namespace('Ext.ClassBuscarComprobante');
Ext.ClassBuscarComprobante = Ext.extend(Ext.Component,
{
    etiquetas : undefined,
    constructor : function(etiquetas)
    {
        var scope = this;
        scope.etiquetas = etiquetas;
        scope.cbxEntidad = new Ext.CONT.UIXCombo({
            tabIndex:400,
            emptyText: scope.etiquetas.emptyText,
            allowBlank: false
        }, {
            identificador:'Entidad',
            displayText: scope.etiquetas.cbxEntidad,
            url:'obtenerEntidadesParaBusqueda',
            autoLoad: false,
            singleSelect : false,
            reader: scope.jrEntidad = new Ext.data.JsonReader({
                id:'idestructurae',
                root: 'datos'
            },[{
                name:'_parent',
                mapping:'idestructuraepadre'
            }, {
                name:'_is_leaf',
                mapping:'leaf'
            },{
                name: 'codigo',
                mapping: 'text'
            }, {
                name: "text"
            },{
                name:'idestructurae'
            }, {
                name:'idestructuraepadre'
            }, {
                name: 'codigoestructura'
            }, {
                name:'ordenizq'
            }, {
                name:'ordender'
            }])
        });
        scope.cbxEjercicio = new Ext.CONT.UIXCombo({
            tabIndex:401,
            emptyText: scope.etiquetas.emptyText,
            hiddenTbar: true,
            allowBlank: false
        }, {
            identificador:'Ejercicio',
            displayText: scope.etiquetas.cbxEjercicio,
            url:'obtenerEjerciciosParaBusqueda',
            autoLoad: false,
            singleSelect : true,
            reader: scope.jrEjercicio = new Ext.data.JsonReader({
                id:'idejercicio',
                root: 'datos'
            },[{
                name:'_parent'
            }, {
                name:'_is_leaf'
            },{
                name:'text'
            }, {
                name:'idejercicio'
            }, {
                name:'nombre'
            }, {
                name:'codigo',
                mapping:'nombre'
            }, {
                name:'inicio'
            }, {
                name:'fin'
            }])
        });
        scope.cbxPeriodo = new Ext.CONT.UIXCombo({
            tabIndex:402,
            emptyText: scope.etiquetas.emptyText
        }, {
            identificador:'Periodo',
            displayText: scope.etiquetas.cbxPeriodo,
            url:'obtenerPeriodosParaBusqueda',
            autoLoad: false,
            singleSelect : false,
            reader: scope.jrPeriodo = new Ext.data.JsonReader({
                id:'idperiodo',
                root: 'datos'
            },[{
                name:'_parent'
            }, {
                name:'_is_leaf'
            },{
                name:'text'
            }, {
                name:'idperiodo'
            }, {
                name:'nombre'
            }, {
                name:'codigo',
                mapping:'nombre'
            }, {
            }, {
                name:'idejercicio'
            }, {
            }, {
                name:'inicio'
            }, {
                name:'fin'
            }, {
                name:'apertura'
            }])
        });

        scope.cbxSubsistema = new Ext.CONT.UIXCombo({
            tabIndex:405,
            emptyText: scope.etiquetas.emptyText
        }, {
            identificador:'Subsistema',
            displayText: scope.etiquetas.cbxSubsistema,
            url:'obtenerSubSistemasParaBusqueda',
            autoLoad: false,
            singleSelect : false,
            reader: scope.jrSubsistema = new Ext.data.JsonReader({
                id:'idSubsistema',
                root: 'datos'
            },[{
                name:'_parent'
            }, {
                name:'_is_leaf'
            },  {
                name:'codigo'
            }, {
                name:'text'
            }])
        });

        scope.cbxEstado = new Ext.CONT.UIXCombo({
            tabIndex:406,
            emptyText: scope.etiquetas.emptyText
        }, {
            identificador:'Estado',
            displayText: scope.etiquetas.cbxEstado,
            url:'obtenerEstadosComprobantesParaBusqueda',
            autoLoad: false,
            singleSelect : false,
            reader: scope.jrEstado = new Ext.data.JsonReader({
                id:'idEstadoComprobante',
                root: 'datos'
            },[{
                name:'_parent'
            }, {
                name:'_is_leaf'
            },{
                name:'text'
            }, {
                name:'idEstadoComprobante'
            }, {
                name:'codigo'
            }])
        });
        scope.cbxNumero = new Ext.CONT.UIXCombo({
            tabIndex:407,
            emptyText: scope.etiquetas.emptyText
        }, {
            identificador:'Numero',
            displayText: scope.etiquetas.cbxNumero,
            url:'obtenerNumerosComprobantesParaBusqueda',
            autoLoad: false,
            singleSelect : false,
            reader:  scope.jrNumero = new Ext.data.JsonReader({
                id:'numerocomprobante',
                root: 'datos'
            },[{
                name:'_parent'
            }, {
                name:'_is_leaf'
            },{
                name:'text'
            }, {
                name:'codigo'
            }])
        });
        scope.wBuscarComprobante = new Ext.UIBuscarComprobante(scope);
        scope.initializeEvents(scope);
        scope.initializeFunctions(scope);
        scope.initWindow(scope);
        return Ext.ClassBuscarComprobante.superclass.constructor.call(scope);
    },
    initWindow : function(scope)
    {
        Ext.Ajax.request({
            method : "POST",
            url : "loadDataBuscarComponents",
            callback : function(options, success, response)
            {
                scope.responseText = Ext.decode(response.responseText);
                if(scope.responseText.Entidades.datos.length > 0)
                    Ext.getCmp('gpEntidad').getStore().loadData(scope.responseText.Entidades);

                if(scope.responseText.Ejercicios.datos.length > 0)
                    Ext.getCmp('gpEjercicio').getStore().loadData(scope.responseText.Ejercicios);

                if(scope.responseText.Periodos.datos.length > 0)
                    Ext.getCmp('gpPeriodo').getStore().loadData(scope.responseText.Periodos);

                if(scope.responseText.Subsistemas.datos.length > 0)
                    Ext.getCmp('gpSubsistema').getStore().loadData(scope.responseText.Subsistemas);

                if(scope.responseText.Estados.datos.length > 0)
                    Ext.getCmp('gpEstado').getStore().loadData(scope.responseText.Estados);

                if(scope.responseText.Numeros.datos.length > 0)
                    Ext.getCmp('gpNumero').getStore().loadData(scope.responseText.Numeros);
                scope.fShowWindow();
            }
        })
    },
    initializeFunctions : function(scope)
    {
        this.fShowWindow = function()
        {
            scope.wBuscarComprobante.show(Ext.getBody(), function()
            {
                scope.wBuscarComprobante.doLayout(true);
                if(Ext.getCmp('msgbIniciando'))
                    Ext.getCmp('msgbIniciando').hideBox();
            });
        }

        this.fValorActual = function(store, identificador, identificadorAntecesor, idActual)
        {
            cbxComponente = Ext.getCmp('cbx'+identificador);
            if(idActual && cbxComponente.fSelect.values.length == 0)
            {
                for(i = 0; i < store.getCount(); i++)
                    if(store.getAt(i).id == idActual)
                    {
                        cbxComponente.fSelect.display.push(store.getAt(i).data.codigo);
                        cbxComponente.fSelect.values.push(store.getAt(i).id);
                        cbxComponente.fSelect.valuesLoaded = Ext.getCmp('cbx'+identificadorAntecesor).fSelect.values;
                        cbxComponente.fSelect.index.push(i);
                    }
                cbxComponente.setValue(cbxComponente.fSelect.display.join(", "));
            }
        }

        this.fResetValues = function(component)
        {
            component.clearValue();
            component.fSelect.values = new Array();
            component.fSelect.display = new Array();
            component.fSelect.index = new Array();
        }

        this.fFechaMayor = function(fechaUno, fechaDos)
        {
            xMes = fechaUno.substring(3, 5);
            xDia = fechaUno.substring(0, 2);
            xAnio = fechaUno.substring(6,10);
            yMes = fechaDos.substring(3, 5);
            yDia = fechaDos.substring(0, 2);
            yAnio = fechaDos.substring(6,10);
            return (xAnio > yAnio) ? true : ((xAnio == yAnio) ? ((xMes > yMes) ? true : ((xMes == yMes) ? ((xDia > yDia) ? true : false) : false)) : false);
        }
        this.fFechaIguales = function(fechaUno, fechaDos)
        {
            xMes = fechaUno.substring(3, 5);
            xDia = fechaUno.substring(0, 2);
            xAnio = fechaUno.substring(6,10);
            yMes = fechaDos.substring(3, 5);
            yDia = fechaDos.substring(0, 2);
            yAnio = fechaDos.substring(6,10);
            return (xAnio == yAnio) ? ((xMes == yMes) ? ((xDia == yDia) ? true : false) : false) : false;
        }

        this.fOrdenaFechasMenores = function(valores)
        {
            for(i = 0; i < valores.length - 1; i ++)
                for(j = i + 1; j < valores.length; j ++)
                    if(this.fFechaMayor(valores[i].data.inicio, valores[j].data.inicio))
                    {
                        valor = valores[i];
                        valores[i] = valores[j];
                        valores[j] = valor;
                    }else
                    if(this.fFechaIguales(valores[i].data.inicio, valores[j].data.inicio))
                        if(this.fFechaMayor(valores[i].data.fin, valores[j].data.fin))
                        {
                            valor = valores[i];
                            valores[i] = valores[j];
                            valores[j] = valor;
                        }

            return valores;
        }

        this.fOrdenaFechasMayores = function(valores)
        {
            for(i = 0; i < valores.length - 1; i ++)
                for(j = i + 1; j < valores.length; j ++)
                    if(!this.fFechaMayor(valores[i].data.inicio, valores[j].data.inicio))
                    {
                        valor = valores[i];
                        valores[i] = valores[j];
                        valores[j] = valor;
                    }
            return valores;
        }

        this.fSetearFechas = function(recordsSelection)
        {
            recordsLength = recordsSelection.length;
            if(recordsLength > 1)
            {
                recordsMenores = scope.fOrdenaFechasMenores(recordsSelection);
                scope.fSetValuesFechas(/*(recordsMenores[0].data.apertura == 1) ? null : */recordsMenores[0].data.inicio, scope.fOrdenaFechasMayores(recordsSelection)[0].data.fin);
            }else    
            if(recordsLength == 1)
                scope.fSetValuesFechas(/*(recordsSelection[0].data.apertura == 1) ? null : */recordsSelection[0].data.inicio, recordsSelection[0].data.fin);
            else
                scope.fResetValuesFecha();
            scope.fResetValues(scope.cbxSubsistema);
            scope.fResetValues(scope.cbxEstado);
            scope.fResetValues(scope.cbxNumero);
        }

        this.fSetValuesFechas = function(fechaInicio, fechaFin)
        {
            scope.dfDesde.setDisabled(false);
            scope.dfHasta.setDisabled(false);
            scope.dfDesde.reset();
            scope.dfHasta.reset();
            scope.dfDesde.setMinValue(fechaInicio);
            scope.dfHasta.setMaxValue(fechaFin);
            scope.dfDesde.setValue(fechaInicio);
            scope.dfHasta.setValue(fechaFin);
            scope.dfDesde.clearInvalid();
            scope.dfHasta.clearInvalid();
        }

        this.fResetValuesFecha = function()
        {
            date = new Date().format('d/m/Y');
            scope.dfDesde.setDisabled(true);
            scope.dfHasta.setDisabled(true);
            scope.dfDesde.setValue(null);
            scope.dfHasta.setValue(null);
        }

        this.fAceptarBusqueda = function()
        {
            if(scope.pnlBuscar.getForm().isValid(true))
            {
                infoAgrupada = false;
                fAcepto = function(btn)
                {
                    if(btn == 'ok')
                        infoAgrupada = true;
                    scope.wBuscarComprobante.close();
                    scope.fireEvent('closeBuscar', false, infoAgrupada, {
                        arrayIdEntidades: scope.cbxEntidad.fSelect.values,
                        fechaInicio : scope.dfDesde.getRawValue(),
                        fechaFin : scope.dfHasta.getRawValue(),
                        arrayIdSubsistemas : scope.cbxSubsistema.fSelect.values,
                        arrayIdEstados : scope.cbxEstado.fSelect.values,
                        arrayIdNumeroComprobantes : scope.cbxNumero.fSelect.values
                    }, true);
                }
                mostrarMensaje(2, scope.etiquetas.msgfAceptarBusqueda, fAcepto)
            }
        }

    },
    initializeEvents : function(scope)
    {
        this.addEvents('closeBuscar');

        this.btnCerrarBusqueda.on('click', function(component)
        {
            scope.wBuscarComprobante.close();
            scope.fireEvent('closeBuscar', true);
        })

        this.btnAceptarBusqueda.on('click', function(component)
        {
            scope.fAceptarBusqueda();
        })

        this.cbxEntidad.on('collapse', function(){
            if(scope.cbxEntidad.fSelect.values.length > 1)
            {
                scope.cbxEjercicio.disable();
                scope.cbxPeriodo.disable();
            }
            else
            {
                scope.cbxEjercicio.enable();
                scope.cbxPeriodo.enable();
            }

            scope.cbxEjercicio.clearInvalid();
            scope.cbxPeriodo.clearInvalid();
            scope.dfDesde.clearInvalid();
            scope.dfHasta.clearInvalid();
            scope.cbxSubsistema.clearInvalid();
            scope.cbxEstado.clearInvalid();
            scope.cbxNumero.clearInvalid();
        })

        this.cbxEntidad.content.getComponent(0).getStore().on('load', function(store, records, options){
            scope.fValorActual(store, 'Entidad', 'Entidad', scope.responseText.Entidades.Actual);
        })

        this.cbxEntidad.content.getComponent(0).getSelectionModel().on('selectionchange', function(){
            scope.fResetValues(scope.cbxEjercicio);
            scope.fResetValues(scope.cbxPeriodo);
            scope.fResetValuesFecha();
            scope.fResetValues(scope.cbxSubsistema);
            scope.fResetValues(scope.cbxEstado);
            scope.fResetValues(scope.cbxNumero);
        })


        this.cbxEjercicio.content.getComponent(0).getStore().on('load', function(store, records, options){
            if(scope.jrEjercicio.jsonData.Actual != null)
                scope.fValorActual(store, 'Ejercicio', 'Entidad', scope.jrEjercicio.jsonData.Actual);
        })

        this.cbxEjercicio.on('expand', function(){
            if(scope.cbxEntidad.isValid())
            {
                if(scope.cbxEjercicio.fIsDirty(scope.cbxEntidad.fSelect.values))
                {
                    scope.cbxEjercicio.fSelect.valuesLoaded = scope.cbxEntidad.fSelect.values;
                    scope.cbxEjercicio.content.getComponent(0).getStore().removeAll();
                    scope.cbxEjercicio.content.getComponent(0).getStore().load({
                        params:{
                            arrayIdEstructurae : Ext.encode(scope.cbxEntidad.fSelect.values)
                        }
                    });
                }
            }else
                scope.cbxEjercicio.collapse();
        })

        this.cbxEjercicio.content.getComponent(0).getSelectionModel().on('selectionchange', function(){
            scope.fResetValues(scope.cbxPeriodo);
            scope.fResetValuesFecha();
            if(Ext.getCmp('gpEjercicio').getSelectionModel().getSelections().length > 0 || !scope.cbxEjercicio.isValid())
                scope.fSetearFechas(Ext.getCmp('gpEjercicio').getSelectionModel().getSelections());
            scope.fResetValues(scope.cbxSubsistema);
            scope.fResetValues(scope.cbxEstado);
            scope.fResetValues(scope.cbxNumero);
            scope.cbxPeriodo.fSelect.valuesLoaded = scope.cbxEjercicio.fSelect.values;
        })


        this.cbxPeriodo.on('expand', function(){
            if(scope.cbxEjercicio.isValid())
            {
                //if(scope.cbxPeriodo.fIsDirty(scope.cbxEjercicio.fSelect.values))
                //{
                    scope.cbxPeriodo.fSelect.valuesLoaded = scope.cbxEjercicio.fSelect.values;
                    store = scope.cbxPeriodo.content.getComponent(0).getStore();
                    recordsSelected = scope.cbxEjercicio.content.getComponent(0).getSelectionModel().getSelections();
                    result = new Array();
                    if(recordsSelected.length > 0) {
                        for(i = 0; i < recordsSelected.length; i++) {
                            result.push({
                                text: recordsSelected[i].data.text,
                                idEjercicio: recordsSelected[i].data.idejercicio
                            });
                        }
                    } else {
                        result.push({
                            text: '',
                            idEjercicio: scope.cbxEjercicio.fSelect.values[0]
                        });
                    }

                    store.removeAll();
                    store.load({
                        params:{
                            arrayEjercicios : Ext.encode(result)
                        }
                    });
               // }
            }else
                scope.cbxPeriodo.collapse();
        });

        this.cbxPeriodo.content.getComponent(0).getStore().on('load', function(store, records, options){
            if(scope.jrPeriodo.jsonData.Actual != null)
            {
                scope.fValorActual(store, 'Periodo', 'Ejercicio', scope.jrPeriodo.jsonData.Actual);
                scope.fSetValuesFechas(scope.responseText.Periodos.fechaInicio, scope.responseText.Periodos.fechaFin);
            }
        })

        Ext.getCmp('gpPeriodo').getSelectionModel().on('selectionchange', function(){
            selectionsPeriodo = Ext.getCmp('gpPeriodo').getSelectionModel().getSelections();
            scope.fSetearFechas((selectionsPeriodo.length > 0) ? selectionsPeriodo : Ext.getCmp('gpEjercicio').getSelectionModel().getSelections());
        })

        this.cbxSubsistema.content.getComponent(0).getStore().on('load', function(store, records, options){
            if(scope.jrSubsistema.jsonData.Actual == 'true')
            {
                cbxComponente =  scope.cbxSubsistema;
                for(i = 0; i < store.getCount(); i++)
                {
                    cbxComponente.fSelect.display.push(store.getAt(i).data.codigo);
                    cbxComponente.fSelect.values.push(store.getAt(i).id);
                    cbxComponente.fSelect.valuesLoaded = scope.cbxPeriodo.fSelect.values;
                    cbxComponente.fSelect.index.push(i);
                }
                cbxComponente.setValue(cbxComponente.fSelect.display.join(", "));
            }
        })

        this.cbxSubsistema.on('expand', function(){
            if(scope.cbxEntidad.isValid())
            {

                store = scope.cbxSubsistema.content.getComponent(0).getStore();
                store.removeAll();
                store.load({
                    params:{
                        arrayIdEstructurae : Ext.encode(scope.cbxEntidad.fSelect.values),
                        fechaInicio : scope.dfDesde.getRawValue(),
                        fechaFin : scope.dfHasta.getRawValue()
                    }
                });
            }else
            {
                scope.cbxSubsistema.collapse();
                scope.cbxEntidad.markInvalid();
            }
        })

        this.cbxSubsistema.content.getComponent(0).getSelectionModel().on('selectionchange', function(){
            scope.fResetValues(scope.cbxEstado);
            scope.fResetValues(scope.cbxNumero);
        })

        this.cbxEstado.content.getComponent(0).getStore().on('load', function(store, records, options){
            if(scope.jrEstado.jsonData.Actual == 'true')
            {
                cbxComponente =  scope.cbxEstado;
                for(i = 0; i < store.getCount(); i++)
                {
                    cbxComponente.fSelect.display.push(store.getAt(i).data.codigo);
                    cbxComponente.fSelect.values.push(store.getAt(i).id);
                    cbxComponente.fSelect.valuesLoaded = scope.cbxSubsistema.fSelect.values;
                    cbxComponente.fSelect.index.push(i);
                }
                cbxComponente.setValue(cbxComponente.fSelect.display.join(", "));
            }
        })

        this.cbxEstado.on('expand', function(){
            if(scope.cbxEntidad.isValid())
            {

                store = scope.cbxEstado.content.getComponent(0).getStore();
                store.removeAll();
                store.load({
                    params:{
                        arrayIdEstructurae : Ext.encode(scope.cbxEntidad.fSelect.values),
                        fechaInicio : scope.dfDesde.getRawValue(),
                        fechaFin : scope.dfHasta.getRawValue(),
                        arrayIdSubsistemas : Ext.encode(scope.cbxSubsistema.fSelect.values)
                    }
                });
            }else
            {
                scope.cbxEstado.collapse();
                scope.cbxEntidad.markInvalid();
            }
        })

        this.cbxEstado.content.getComponent(0).getSelectionModel().on('selectionchange', function(){
            scope.fResetValues(scope.cbxNumero);
        })

        this.cbxNumero.content.getComponent(0).getStore().on('load', function(store, records, options){
            if(scope.jrNumero.jsonData.Actual == 'true')
            {
                cbxComponente =  scope.cbxNumero;
                for(i = 0; i < store.getCount(); i++)
                {
                    cbxComponente.fSelect.display.push(store.getAt(i).data.codigo);
                    cbxComponente.fSelect.values.push(store.getAt(i).id);
                    cbxComponente.fSelect.valuesLoaded = scope.cbxEstado.fSelect.values;
                    cbxComponente.fSelect.index.push(i);
                }
                cbxComponente.setValue(cbxComponente.fSelect.display.join(", "));
            }
        })

        this.cbxNumero.on('expand', function(){
            if(scope.cbxEntidad.isValid())
            {
                store = scope.cbxNumero.content.getComponent(0).getStore();
                store.removeAll();
                store.load({
                    params:{
                        arrayIdEstructurae : Ext.encode(scope.cbxEntidad.fSelect.values),
                        fechaInicio : scope.dfDesde.getRawValue(),
                        fechaFin : scope.dfHasta.getRawValue(),
                        arrayIdSubsistemas : Ext.encode(scope.cbxSubsistema.fSelect.values),
                        arrayIdEstadoComprobantes : Ext.encode(scope.cbxEstado.fSelect.values)
                    }
                });
            }else
            {
                scope.cbxNumero.collapse();
                scope.cbxEntidad.markInvalid();
            }
        })

    }
})
