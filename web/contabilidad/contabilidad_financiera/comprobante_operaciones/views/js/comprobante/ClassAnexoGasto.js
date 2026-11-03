Ext.namespace('Ext.ClassAnexoGasto');
Ext.ClassAnexoGasto = Ext.extend(Ext.Component, {
    perfil: window.parent.perfil,
    //'', true, this.opTipoCuenta, idCuenta, 'asdasd',
    constructor: function(animTarget, editable, gasto, idcuenta, text, partida, credito, porciento, cantHombres, importeOriginal, creditoOriginal, params)
    {
        var scope = this;
        scope.animTarget = animTarget;
        scope.params = params;
        scope.editable = editable;
        scope.idcuenta = idcuenta;
        scope.gasto = gasto;
        scope.text = text;
        scope.partida = partida;
        scope.credito = credito;
        scope.porciento = porciento;
        scope.cantHombres = cantHombres;
        scope.importeOriginal = importeOriginal;
        scope.creditoOriginal = creditoOriginal;
        if (!document.getElementById('Notification'))
            scope.loadJs("/contabilidad/contabilidad_financiera/componentes/Notification/js/Ext.Cont.Notification", 'Notification');
		if (!document.getElementById('MessageBox'))
            scope.loadJs("/contabilidad/comun/componentes/MessageBox/MessageBox", 'MessageBox');
		scope.loadJs("/contabilidad/contabilidad_financiera/comprobante_operaciones/views/js/comprobante/UIAnexoGasto", 'UIAnexoGasto');
        scope.url = '/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/anexogasto/';
        scope.cargarPerfil(scope);
        return Ext.ClassAnexoGasto.superclass.constructor.call(scope, params);
    },
    loadJs: function(jsSrc, id)
    {
        if (jsSrc != null)
        {
            var tagScript = document.createElement("script");
            tagScript.setAttribute("type", "text/javascript");
            tagScript.setAttribute("id", id);
            tagScript.setAttribute("src", jsSrc + ".js");
            document.getElementsByTagName("body")[0].appendChild(tagScript);
        }
    },
    cargarPerfil: function(scope)
    {
        Ext.CONT.Componentes.MessageBox('msgbIniciando');
        Ext.Ajax.request({
            method: "POST",
            url: scope.url + "cargaretiquetas",
            callback: function(options, success, response)
            {
                scope.etiquetas = Ext.decode(response.responseText);
                scope.loadData(scope);
            }
        });
    },
    loadData: function(scope)
    {
        Ext.Ajax.request({
            method: "POST",
            params: (scope.params.idpase != undefined) ? scope.params : {
                idcuenta: scope.idcuenta
            },
            url: scope.url + "loadDataComponent",
            callback: function(options, success, response)
            {
                responseData = Ext.decode(response.responseText);
                // if (responseData.Centros.cantidad > 0)
                if (responseData.Centros.length > 0)
                    scope.loadDataComponent(responseData, scope);
                else
                {
                    if(Ext.getCmp('msgbIniciando'))
                        Ext.getCmp('msgbIniciando').hideBox();
                    if (scope.gasto == 8032)
                    {
                        mostrarMensaje(1, scope.text + " " + scope.etiquetas.msgErrorInicioAnexoGasto);
                        scope.fireEvent('close');
                    }
                    else
                    {
                        scope.fireEvent('sendingData', new Array(), 0, false, 0, null);
                        scope.fireEvent('close');
                    }
                }
            }
        });
    },
    loadDataComponent: function(data, scope)
    {
        // if (data.Centros.datos[0].tipo == '1') {
        //     scope.fieldLabel1 = scope.etiquetas.lbComboGasto1;
        //     scope.fieldLabel2 = scope.etiquetas.lbComboGasto2;
        // } else {
        //     scope.fieldLabel1 = scope.etiquetas.lbComboGasto3;
        //     scope.fieldLabel2 = scope.etiquetas.lbComboGasto4;
        // }

        scope.fieldLabel1 = scope.etiquetas.lbComboGasto3;
        scope.fieldLabel2 = scope.etiquetas.lbComboGasto4;
        
        scope.sumaControl = 0;
        scope.wRegistroGastoAnexo = new Ext.UIAnexoGasto.wRegistroGastoAnexo(scope, {
            title: scope.etiquetas.titleWindowGasto + " " + scope.text
        });

        scope.initializeEvents(scope);
        scope.initializeFunctions(scope);
		
        scope.totalCount = 0;
        if (scope.idpase != undefined)
            scope.stGasto.load({
                params: {
                    idPase: scope.idpase
                }
            });
        else
        if (scope.dataStore != undefined)
            scope.stGasto.loadData(scope.dataStore);

        if (!scope.editable)
            //scope.wRegistroGastoAnexo.show();
            scope.wRegistroGastoAnexo.show(Ext.getBody(), function() {
                 scope.wRegistroGastoAnexo.maximize();
            });
        else
            scope.stObjetoGasto.loadData(data.Centros.datos);
	   if(Ext.getCmp('msgbIniciando'))
		Ext.getCmp('msgbIniciando').hideBox();
    },
    initializeEvents: function(scope)
    {
        
        scope.addEvents('sendingData');
        scope.addEvents('close');

        scope.btnCancelar.on('click', function()
        {
            scope.fCancelarWindow();
        });

        scope.btnAceptarGasto.on('click', function()
        {
            scope.fAceptoWindow();
        });

        scope.wRegistroGastoAnexo.on('close', function()
        {
		    if(Ext.getCmp('msgbIniciando'))
                Ext.getCmp('msgbIniciando').hideBox();
            scope.fireEvent('close');
        });

        scope.wRegistroGastoAnexo.on('resize', function(window, width, height)
        {
            if(Ext.getCmp('msgbIniciando'))
                Ext.getCmp('msgbIniciando').hideBox();
            window.doLayout();
        });

        scope.stObjetoGasto.on('load', function(store, records, options) {
            scope.wRegistroGastoAnexo.show(Ext.getBody(), function() {
                this.maximize();
            });
        });

        scope.stElementoGasto.on('load', function(store, records, options) {
            scope.lMask.hide();
            scope.cbxElementoGasto.clearInvalid();
            if (records.length > 0)
            {
                scope.cbxElementoGasto.clearValue();
                scope.cbxElementoGasto.enable();
                scope.cbxElementoGasto.focus();
            } else {
                scope.cbxElementoGasto.reset();
                scope.cbxElementoGasto.disable();
                scope.nfImporteGasto.focus(true);
            }

        });

        scope.cbxCentroGasto.on({
            'select': function(combo, record, index) {
                scope.lMask.show();
                scope.stElementoGasto.load({
                    params: {
                        idObjetoGasto: record.data.idcentrogrupo,
                        idcuenta: scope.idcuenta
                    }
                });
            },
            'keypress': function(t, e) {
                if (e.getKey() == 13) {
                    scope.cbxElementoGasto.focus(true, 10);
                }
            }
        });

        scope.cbxElementoGasto.on('keypress', function(t, e) {
            if (e.getKey() == 13) {
                scope.nfImporteGasto.focus(true, 10);
            }
        });

        scope.nfCantHombres.on('blur', function() {
            if (this.getValue() < 1)
                this.setValue(0);
        });

        scope.nfImporteGasto.on('blur', function() {
            if (this.getValue() == 0)
                this.setValue(0);
        });

        scope.nfImporteGasto.on('keypress', function(component, event) {
            if (event.getKey() == 13)
                scope.btnAdicionarGasto.fireEvent('click', scope.btnAdicionarGasto);
        });

        scope.stGasto.on('remove', function(store, record, index) {
            count = store.getCount();
            if (count > 0)
                scope.smGasto.selectRow(count - 1);
            else
                scope.tbGasto.hide();
        });

        scope.stGasto.on('beforeload', function(store, options) {
            scope.lMask.show();
        });

        scope.stGasto.on('load', function(store, options) {
            scope.totalCount = store.getCount();
            scope.lMask.hide();
            scope.fSetSumaControl();
        });

        scope.stGasto.on('add', function(store, records, index) {
            scope.fSetSumaControl();
        });

        scope.smGasto.on('rowselect', function(SelectionModel, rowIndex, record) {
            if (scope.editable)
                scope.tbGasto.show();
        });

        scope.smGasto.on('rowdeselect', function(SelectionModel, rowIndex, record) {
            if (!scope.tbGasto.hidden)
                scope.tbGasto.hide();
        });

        scope.tbGasto.on('hide', function() {
            scope.gpGasto.syncSize();
            scope.wRegistroGastoAnexo.doLayout(true);
        });

        scope.tbGasto.on('show', function() {
            scope.gpGasto.syncSize();
            scope.wRegistroGastoAnexo.doLayout(true);
        });

        scope.btnAdicionarGasto.on('click', function()
        {
            scope.fAdicionarDesglose();
        });

        scope.btnEliminarPaseGasto.on('click', function()
        {
            scope.fEliminoDesglose();
        });

        scope.btnModificarPaseGasto.on('click', function()
        {
            scope.fModificarDesglose();
        });

        scope.btnCancelarModificacion.on('click', function()
        {
            scope.fCancelarModificacion(true);
        });

    },
    initializeFunctions: function(scope) {
        scope.fAdicionarDesglose = function() {
            if ((scope.cbxCentroGasto.getValue().toString().length > 0 && (scope.cbxElementoGasto.getValue().toString().length > 0 && scope.cbxElementoGasto.disabled != true || scope.cbxElementoGasto.getValue().toString().length == 0 && scope.cbxElementoGasto.disabled == true)) && scope.pnlRegionNorthGasto.getForm().isValid(true)) {
                if (scope.nfImporteGasto.getValue() > 0) {
                    if (scope.btnCancelarModificacion.hidden)
                        scope.fAceptoDesglose();
                    else
                        scope.fAceptoModificacionDesglose();
                } else
                    scope.nfImporteGasto.markInvalid();
                scope.nfImporteGasto.focus(true);
            } else {
                if (!scope.cbxCentroGasto.getValue())
                    scope.cbxCentroGasto.markInvalid();
                if (!scope.cbxElementoGasto.disabled)
                    scope.cbxElementoGasto.markInvalid();
            }
        };

        scope.fAceptoDesglose = function()
        {
            var recordValue = scope.findBy(scope.cbxCentroGasto.getValue(), scope.cbxElementoGasto.getValue());
            if (recordValue == undefined)
            {
                scope.stGasto.loadData(new Array({
                    idregistroanexo: undefined,
                    col1: scope.cbxCentroGasto.getRawValue(),
                    idCol1: scope.cbxCentroGasto.getValue(),
                    col2: scope.cbxElementoGasto.getRawValue(),
                    idCol2: scope.cbxElementoGasto.getValue(),
                    cantHombres: (scope.cantHombres) ? scope.nfCantHombres.getValue() : null,
                    importe: scope.nfImporteGasto.getValue(),
                    importeFormat: scope.nfImporteGasto.getValue()
                }), true);
                scope.smGasto.selectRow(scope.stGasto.getCount() - 1);
            } else { 
                var index = scope.stGasto.indexOf(recordValue);
                scope.stGasto.remove(recordValue);
                if (scope.cantHombres)
                    recordValue.data.cantHombres += scope.nfCantHombres.getValue();
                recordValue.data.importe += scope.nfImporteGasto.getValue();
                recordValue.data.importeFormat = recordValue.data.importe;
                recordValue.data.idregistroanexo = undefined;
                scope.stGasto.insert(index, recordValue);
                scope.smGasto.selectRow(index);
            }
            scope.fLimpiarSeleccionEnPanel();
        };

        scope.fAceptoModificacionDesglose = function()
        {
            scope.stGasto.remove(scope.smGasto.getSelected());
            scope.fAceptoDesglose();
            scope.fCancelarModificacion(false);
        };

        scope.findBy = function(idCol1, idCol2)
        {
            count = scope.stGasto.getCount();
            for (var i = 0; i < count; i ++)
                if (scope.stGasto.getAt(i).data.idCol1 == idCol1 && scope.stGasto.getAt(i).data.idCol2 == idCol2)
                    return scope.stGasto.getAt(i);
            return undefined;
        };

        scope.fSetSumaControl = function()
        {
            scope.sumaControl = scope.fRedondear(scope.stGasto.sum('importe'), 2);
            return scope.nfImporteTotal.setText('<b>' + formatoMonedaABS(scope.sumaControl) + '</b>', false);
        };

        scope.fEliminoDesglose = function()
        {
            scope.stGasto.remove(scope.smGasto.getSelected());
            scope.fSetSumaControl();
            scope.fLimpiarSeleccionEnPanel();
        };

        scope.fModificarDesglose = function()
        {
            scope.btnAdicionarGasto.setIconClass(scope.perfil.dirImg + 'aceptar.png');
            scope.btnAdicionarGasto.setText(scope.etiquetas.btnAceptar);
            var record = scope.smGasto.getSelected();
            scope.cbxCentroGasto.setValue(record.data.idCol1);
            scope.lMask.show();
            scope.stElementoGasto.load({
                params: {
                    idObjetoGasto: record.data.idCol1,
                    idcuenta: scope.idcuenta
                },
                callback: function()
                {
                    scope.cbxElementoGasto.enable();
                    scope.cbxElementoGasto.setValue(record.data.idCol2);
                    if (scope.cantHombres)
                        scope.nfCantHombres.setValue(record.data.cantHombres);
                    scope.nfImporteGasto.setValue(record.data.importe);
                    scope.btnCancelarModificacion.show(true);
                    scope.tbGasto.hide();
                    scope.fGetButtonsSetVisible(scope.wRegistroGastoAnexo.buttons, false);
                }
            });
        };

        scope.fCancelarModificacion = function(flag)
        {
            scope.btnAdicionarGasto.setIconClass(scope.perfil.dirImg + 'adicionar.png');
            scope.btnAdicionarGasto.setText(scope.etiquetas.btnAdicionar);
            scope.btnCancelarModificacion.hide();
            scope.tbGasto.show();
            scope.fGetButtonsSetVisible(scope.wRegistroGastoAnexo.buttons, true);
            if (flag)
                scope.fLimpiarSeleccionEnPanel();
        };

        scope.fGetButtonsSetVisible = function(listButtons, flag)
        {
            for (i = 0; i < listButtons.length; i ++)
                listButtons[i].setVisible(flag);
        };

        scope.fLimpiarSeleccionEnPanel = function()
        {
            scope.nfImporteGasto.reset();
            if (scope.cantHombres)
                scope.nfCantHombres.reset();
            scope.cbxElementoGasto.reset();
            scope.cbxElementoGasto.disable();
            scope.cbxCentroGasto.reset();
            scope.cbxCentroGasto.focus(false, true);
        };

        scope.fCancelarWindow = function()
        {
            scope.fCancelar = function(btn)
            {
                if (btn == 'ok')
                {
                    scope.wRegistroGastoAnexo.close();
                    document.getElementsByTagName("body")[0].removeChild(document.getElementById('UIAnexoGasto'));
                }
            };
            mostrarMensaje(2, scope.etiquetas.msgCancelar, scope.fCancelar);
        };

        scope.fAceptoWindow = function()
        {
            count = scope.stGasto.getCount();
            flag = false;
            if (count > 0)
            {
                if (scope.fGetTotalRecordCommit(count) > 0 || scope.totalCount != count)
                {
                    var msgImporteOriginal = scope.etiquetas.lbImporteOriginal + ((scope.creditoOriginal == true) ? scope.etiquetas.lbCredito : scope.etiquetas.lbDebito);
                    if (scope.partida > 0)
                    {
                        var importe = scope.fRedondear((scope.importeOriginal * parseFloat(scope.porciento)) / 100, 2);
                        if (importe == scope.sumaControl)
                            scope.fRegistrarDesglose(flag, count);
                        else
                            mostrarMensaje(1, scope.etiquetas.msgLaSumaControl + formatoMonedaABS(importe) + scope.etiquetas.msgConstituye + '<b>' + scope.porciento + "%" + '</b>' + scope.etiquetas.msgDel + msgImporteOriginal + "<b>" + formatoMonedaABS(scope.importeOriginal) + "</b>");
                    } else
{
                        if (scope.importeOriginal != scope.sumaControl && scope.idpase == undefined)
                        {
                            msgCambiarImporte = (scope.credito == true) ? scope.etiquetas.msgCambiarImporteCredito : scope.etiquetas.msgCambiarImporteDebito;
                            fAcepto = function(btn)
                            {
                                if (btn == 'ok')
                                    flag = true;
                                scope.fRegistrarDesglose(flag, count);
                            };
                            mostrarMensaje(2, scope.etiquetas.msgDiferenciasImportes + msgImporteOriginal + "<b>" + formatoMonedaABS(scope.importeOriginal) + "</b>" + scope.etiquetas.msgAnd + scope.etiquetas.lbSumaControl + "<b>" + formatoMonedaABS(scope.sumaControl) + "</b>" + '.' + "<br><b>" + msgCambiarImporte + "</b>", fAcepto);
                        } else
                            scope.fRegistrarDesglose(flag, count);
                    }
                } else
                    scope.wRegistroGastoAnexo.close();
            } else
                 mostrarMensaje(1, scope.etiquetas.msgErrorAceptar);
        };

        scope.fGetTotalRecordCommit = function(count)
        {
            countResult = 0;
            for (i = 0; i < count; i ++)
                if (scope.stGasto.getAt(i).data.idregistroanexo.length == 0)
                    countResult++;
            return countResult;
        };

        scope.fRegistrarDesglose = function(updateImporte, count)
        {
            Ext.CONT.Componentes.MessageBox('msgbIniciando');
            var arrayDesglose = new Array();
            for (var i = 0; i < count; i ++)
                arrayDesglose.push(scope.stGasto.getAt(i).data);

            scope.fireEvent('sendingData', arrayDesglose, scope.sumaControl, updateImporte, scope.credito, scope.idpase);
            scope.wRegistroGastoAnexo.close();
        };

        scope.wRegistroGastoAnexo.on('show', function() {
            scope.cbxCentroGasto.focus(true, 10);
        });
		
		scope.fRedondear = function(numero, decimales)
			{
				var flotante = parseFloat(numero);
				var resultado = Math.round(flotante*Math.pow(10,decimales))/Math.pow(10,decimales);
				return resultado;	
			}

    }
});