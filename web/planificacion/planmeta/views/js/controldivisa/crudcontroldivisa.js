Ext.ns('PlanifMaterial.CtrlDiv')
PlanifMaterial.CtrlDiv.crudControlDivisa = function()
{
    var _this = this;
    _this.BarraProgreso = new BarraEstado();
    this.CrearVentanaCrudControlDivisa = function(accion, idseleccionado) {



        _this.btnCancelarCtrlDiv = new Ext.Button({
           // icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            id: ' _this.btnCancelarCtrlDiv',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function() {
                _this.ventanaCrud.destroy();
            }
        });
        _this.btnAplicarCtrlDiv = new Ext.Button({
          //  icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'aplicar',
            id: '_this.btnAplicarCtrlDiv',
            text: 'Aplicar',
            tooltip: 'Guardar los datos sin cerrar la ventana',
            handler: function() {
                if (_this.panelCtrlDiv.getForm().isValid()) {
                    _this.AccionAddMod(accion, idseleccionado);
                    _this.panelCtrlDiv.getForm().reset();
                } else {
                    mostrarMensaje(1, 'Existen campos obligatorios vacíos o incorrectos.');
                }
            }
        });
        _this.btnAceptarCtrlDiv = new Ext.Button({
           // icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            disabled: false,
            id: '_this.btnAceptarCtrlDiv',
            text: 'Aceptar',
            tooltip: 'Cerrar ventana y guardar los datos',
            handler: function() {
                if (_this.panelCtrlDiv.getForm().isValid()) {
                    _this.AccionAddMod(accion, idseleccionado);
                    _this.ventanaCrud.destroy();
                } else {
                    mostrarMensaje(1, 'Existen campos obligatorios vacíos o incorrectos.');
                }
            }
        });

        _this.tfdenominacionCtrlDiv = new Ext.form.TextField({
            fieldLabel: 'Denominaci&oacute;n:',
            id: 'tfdenominacionCtrlDiv',
            labelSeparator: '',
            /*regex: /^[A-Za-zá-úÁ-Ú,.]*$/,
            regexText: 'Solo admite letras',
            maskRe: /^[A-Za-zá-úÁ-Ú,.]$/,
            maskReText: 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).',*/
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres',
            allowBlank: false,
            blankText: 'Este campo es obligatorio',
            width: 70,
            anchor: '95%'
        });
        _this.tfdescripcionCtrlDiv = new Ext.form.TextArea({
            fieldLabel: 'Descripción:',
            id: 'tfdescripcionCtrlDiv',
            labelSeparator: '',
            maxLength: 255,
            allowBlank: false,
            blankText: 'Este campo es obligatorio',
            width: 70,
            heigth: 150,
            anchor: '100%'
        });
        _this.tfcodigoCtrlDiv = new Ext.form.TextField({
            fieldLabel: 'Código:',
            id: 'tfcodigoCtrlDiv',
            labelSeparator: '',
            regex: /^[0-9]{3}[.][0-9]{1}[.][0-9]{2}$/,
            regexText: 'Solo se admite este formato <b>(xxx.x.xx)</b>',
            //decimalPrecision:3,
            maskRe: /^[0-9.]$/,
            maskReText: 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).',
            maxLength: 8,
            allowBlank: false,
            blankText: 'Este campo es obligatorio',
            width: 50,
            anchor: '100%'
        });

        _this.panelCtrlDiv = new Ext.FormPanel({
            labelAlign: 'top',
            width: 380,
            height: 200,
            frame: true,
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: 0.6,
                            layout: 'form',
                            items: [_this.tfdenominacionCtrlDiv]
                        }, {
                            columnWidth: 0.4,
                            layout: 'form',
                            items: [_this.tfcodigoCtrlDiv]
                        }]
                }, {
                    layout: 'column',
                    items: [{
                            columnWidth: 1.0,
                            //columnHeigth:0.8,
                            layout: 'form',
                            items: [_this.tfdescripcionCtrlDiv]
                        }]
                }]
        });

        _this.ventanaCrud = new Ext.Window({
            title: accion + ' Indicador Control de Divisa',
            id: 'ventanaCtrlDiv',
            width: 390,
            layout: 'fit',
            constrain: true,
            height: 210,
            frame: true,
            modal: true,
            items: [_this.panelCtrlDiv],
            buttons: [_this.btnCancelarCtrlDiv, _this.btnAplicarCtrlDiv, _this.btnAceptarCtrlDiv]
        });
        _this.ventanaCrud.show();

        if (accion == 'Modificar') {
            _this.BarraProgreso.show('Cargando datos');
            Ext.Ajax.request({
                url: 'cargarDatos',
                params: {
                    idindicadorcd: idseleccionado
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje != 1)
                    {
                        _this.BarraProgreso.hide();
                        mostrarMensaje(3, 'El indicador ya no se encuentra en los registros.');
                    }
                    else
                    {
                        _this.BarraProgreso.hide();

                        _this.tfdenominacionCtrlDiv.setValue(responseData.data.denominacion);
                        _this.tfdescripcionCtrlDiv.setValue(responseData.data.descripcion);
                        _this.tfcodigoCtrlDiv.setValue(responseData.data.codigo);
                        _this.btnAplicarCtrlDiv.hide();
                    }
                }
            });
        }



    }


    this.AccionAddMod = function(accion, idseleccionado)
    {
        var id;
        var modificado = 'adicionado';
        if (accion == 'Modificar')
        {
            modificado = 'modificado';
            id = idseleccionado
        }
        Ext.Ajax.request({
            url: 'addmodificarIndCD',
            params: {
                idcontroldivisa: id,
                denominacion: _this.tfdenominacionCtrlDiv.getValue(),
                codigo: _this.tfcodigoCtrlDiv.getValue(),
                descripcion: _this.tfdescripcionCtrlDiv.getValue()
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData >= 0) {
                    mostrarMensaje(1, 'El indicador de control de divisa ha sido ' + modificado + ' satisfactoriamente.');
                    stGpIndControlDivisa.reload();
                }
                else if (responseData = 'error')
                {
                    mostrarMensaje(3, "Por favor verifique, el código ya existe.");
                }
            }
        });
    }

}


