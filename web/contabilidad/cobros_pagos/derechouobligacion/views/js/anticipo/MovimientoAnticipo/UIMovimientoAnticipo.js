Ext.namespace('Ext.UICancelarAnticipo');

Ext.UIMovimientoAnticipo = Ext.extend(Ext.Window, {
    constructor: function(scope)
    {
        scope.btnMovimientoCerrar = new Ext.Button({
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',//scope.etiquetas.lbBtnCerrar,
            tabIndex: 409,
//            icon: perfil.dirImg + 'cerrar.png',
            iconCls: 'cerrar',
            scope: this
        });

        scope.btnMovimientoAceptar = new Ext.Button({
            id: 'btnMovimientoAceptar',
            text: scope.etiquetas.lbBtnAceptar,
            tooltip: 'Guardar datos y cerrar ventana',//scope.etiquetas.lbBtnAceptar,
            disabled: true,
            tabIndex: 408,
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            scope: this
        });

        // scope.cbCancelarMotivo = new Ext.form.ComboBox({
        //     editable: true,
        //     //width : '50',
        //     allowBlank: false,
        //     store: scope.stCancelarMotivo,
        //     valueField: 'idmotivocancelacion',
        //     displayField: 'descripcion',
        //     hiddenName: 'idmotivocancelacion',
        //     disabledClass: 'disabled-component',
        //     id: 'cbCancelarMotivo',
        //     selectOnFocus: true,
        //     resizable: true,
        //     forceSelection: true,
        //     mode: 'local',
        //     triggerAction: 'all',
        //     fieldLabel: scope.etiquetas.lbMotivoCancel,
        //     anchor: '100%',
        //     tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>',
        //     enableKeyEvents: true,
        //     listeners: {
        //         keypress: function(t, e) {
        //             if ((e.getKey() == 8) || (e.getKey() == 46)) // para el suprimir y borrar
        //             {
        //                 this.clearValue();
        //             }
        //         }
        //     }
        // });
		
		scope.tfImporteMovimiento = new Ext.form.NumberField({
            id: 'tfImporteMovimiento',
            disabled: true,
            fieldLabel: 'Importe restante',
            name: 'importecontable',
            anchor: '100%',
            allowBlank: false,
            editable: false,
			style: 'text-align: right',
            disabledClass: 'disabled-component',
            tabIndex: 9,
            selectOnFocus: true
        });

		scope.tfComentario = new Ext.form.TextField({
            id: 'tfComentario',
            // disabled: true,
            fieldLabel: 'Comentario',
            name: 'comentario',
            anchor: '100%',
            allowBlank: false,
            editable: false,
			style: 'text-align: left',
            disabledClass: 'disabled-component',
            tabIndex: 9,
            selectOnFocus: true
        });

       scope.cbMovimientoOperacion = new Ext.form.ComboBox({
           editable: false,
           store: scope.stMovimientoOperacion,
           allowBlank: false,
           valueField: 'idnomoperaciones',
           displayField: 'denominacion',
           hiddenName: 'idnomoperaciones',
           disabledClass: 'disabled-component',
           id: 'cbMovimientoOperacion',
           selectOnFocus: true,
           forceSelection: true,
           resizable: true,
           //typeAhead : true,
           mode: 'local',
           triggerAction: 'all',
           fieldLabel: 'Operaci&oacute;n contable',
           anchor: '100%',
           tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
           // enableKeyEvents: true,
           listeners: {
               keypress: function(t, e) {
                   if ((e.getKey() == 8) || (e.getKey() == 46)) // para el suprimir y borrar
                   {
                       this.clearValue();
                   }
               }
           }
       });

        scope.lMovimientoAction = new Ext.form.Label({
            text: scope.etiquetas.lbCancelNoDocDerecho,
            anchor: '100%',
            style: 'font-size:12px'
        });

        scope.lMovimientoNumeroDocumento = new Ext.form.Label({
            text: scope.numeros,
            anchor: '100%',
            style: 'font-size:12px'
        });

        scope.lMovimientoVacio = new Ext.form.Label({
            text: '',
            anchor: '100%',
            style: 'font-size:12px'
        });

        scope.fpShowNumeros = new Ext.Panel({
            id: "panelimporte",
            layout: 'form',
            frame: true,
            border: false,
            html: ((scope.tipoAnticipo == 1 || scope.tipoAnticipo == 3) ? scope.etiquetas.lbCancelNoDocDerecho : scope.etiquetas.lbCancelNoDocOblig) + '<br>' + scope.numeros + '<br><br>',
            autoScroll: true,
            items: ''
        });

        scope.dfMovimientoFecha = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            id: 'dfMovimientoFecha',
            fieldLabel: scope.etiquetas.lbFechaCancel,
            name: 'dfMovimientoFecha',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            selectOnFocus: true,
            readOnly: false,
            blankText: scope.etiquetas.lbBlankText,
            allowBlank: false,
            anchor: '100%',
            format: 'd/m/Y',
            editable: true
        });

        scope.nfImporte = new Ext.form.NumberField({
            allowBlank: false,
            allowNegative: false,
            validator: function (value) {
                if (value > 0)
                    return true;
                return 'El importe no puede ser 0.';
            }
        });

        scope.stLiquidarCuenta = new Ext.data.Store({
            url: 'loadDataCuenta',
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                name: 'idcuenta'
            },
                {
                    name: 'text'
                }
            ]),
        });

        scope.cbLiquidarCuenta = new Ext.contabilidad.util.linkedCombo({
            store: scope.stLiquidarCuenta,
            fieldLabel: 'Cuentas',
            displayField: 'text',
            valueField: 'idcuenta',
            disabled: true,
            hideTbar: true,
            listHeight: 200,
            tabIndex: 11,
            anchor: '100%',
            mode: 'local',
            loaded: true,
            id: 'cbxCuenta',
            listeners: {
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        scope.nfImporte.focus(true, 100);
                },
                select: function (cb, record) {
                    var index = scope.stLiquidar.find('idcuenta', cb.getValue());
                    if (index != -1) {
                        scope.cbLiquidarCuenta.reset();
                        mostrarMensaje(1, scope.etiquetas.lbMsgCuentaRepetida);
                    } else {
                        scope.nfImporte.focus(true, 100);
                    }
                }
            }
        });

        scope.rowaction = new Ext.grid.RowActions({
            id: 'idRowaction',
            actions: [
                {
                    id: 'eliminar',
                    tooltip: scope.etiquetas.lbToolDel,
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 20,
                    height: 16
                }
            ]
        });

        scope.roweditor = new Ext.Cont.RowEditor({
            id: 'idRoweditor',
            clicksToEdit: 2,
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
        });

        scope.recordData = Ext.data.Record.create([
            {name: 'idcuenta', type: 'int'},
            {name: 'nomcuenta', type: 'string'},
            {name: 'importemo', type: 'float'},
            {name: 'idliquidacion', type: 'int'}
        ]);

        scope.stLiquidar = new Ext.data.Store({
            reader: new Ext.data.JsonReader({}, scope.recordData),
            sortInfo: {field: 'idcuenta', direction: 'DESC'}
        });

        scope.smLiquidar = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        scope.gpLiquidarDuo = new Ext.grid.EditorGridPanel({
            height: 300,
            stripeRows: true,
            border: false,
            frame: false,
            clicksToEdit: 2,
            store: scope.stLiquidar,
            autoExpandColumn: 'idcuenta',
            columns: [
                {
                    id: 'idcuenta',
                    header: 'Cuenta',
                    dataIndex: 'idcuenta',
                    width: 200,
                    align: 'left',
                    editor: scope.cbLiquidarCuenta,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        if (record.data.nomcuenta != '')
                            return record.data.nomcuenta;
                        else return scope.cbLiquidarCuenta.displayFieldTemp;
                    }.bind(this)
                }, {
                    header: 'Importe',
                    dataIndex: 'importemo',
                    width: 80,
                    align: 'right',
                    editor: scope.nfImporte,
                    renderer: formatoMonedaABS
                },
                scope.rowaction
            ],
            plugins: [scope.roweditor, scope.rowaction],
            sm: scope.smLiquidar,
            forceFit: true,
            tbar: [{
                text: 'Adicionar',
                iconCls: 'adicionar',
                id: 'btnAdd',
                disabled: true,
                // tooltip: scope.etiquetas.lbToolAdd,
                handler: function () {
                    var record = new scope.recordData({
                        idcuenta: '',
                        importemo: '',
                        nomcuenta: ''
                    });
                    scope.roweditor.stopEditing();
                    var total = scope.stLiquidar.getCount();
                    scope.stLiquidar.insert(total, record);
                    scope.gpLiquidarDuo.getSelectionModel().selectRow(total);
                    scope.roweditor.startEditing(total);
                    scope.cbLiquidarCuenta.focus(true, 100);
                }
            }],
            // bbar: ['->', new Ext.Toolbar.TextItem('Total:'), scope.labelTotal = new Ext.form.Label({
            //     text: '0.00'
            // })]
        });
        
        // var question = scope.etiquetas.lbConfirmCancel.replace('<#artAnticipo>',
                        // (scope.arrayIdAnticipo.length > 1) ? scope.artTextoP.toLowerCase():scope.artTexto.toLowerCase()).replace('<#tipoAnticipo>',
                        // (scope.arrayIdAnticipo.length > 1) ? scope.textAnticipoP.toLowerCase():scope.textAnticipo.toLowerCase()).replace('<#sel>',
                        // (scope.tipoAnticipo ==  1 || scope.tipoAnticipo ==  2) ? ((scope.arrayIdAnticipo.length > 1) ? scope.etiquetas.lbSelFP : scope.etiquetas.lbSelF):((scope.arrayIdAnticipo.length > 1) ? scope.etiquetas.lbSelMP : scope.etiquetas.lbSelM));

        scope.fpMovimientoAnticipo = new Ext.FormPanel({
            frame: true,
            border: false,
            id: 'fpBuscarAnticipo',
            autoHeight: true,
            layout: 'form',
            labelAlign: 'top',
            items: [{
                layout: 'column',
                labelAlign: 'top',
                items: [
                    {
                        columnWidth: 0.7,
                        layout: 'form',
                        items: [scope.cbMovimientoOperacion]
                    },
                    {
                        columnWidth: 0.3,
                        style: 'margin: 0 0 0 10',
                        layout: 'form',
                        items: [scope.tfImporteMovimiento]
                    }
                ]
            },scope.tfComentario/*{
                    //html: '<div style="font-size: 10pt">' + ((scope.tipoAnticipo == 1 || scope.tipoAnticipo == 3) ? scope.etiquetas.lbCancelNoDocDerecho : scope.etiquetas.lbCancelNoDocOblig) + '<br>' + '<br>' + scope.numeros + '<br><br>' + '</div>'
                    html: '<div style="font-size: 10pt">' + 'Anticipo a cancelar:' + '<br>' + '<br>' + scope.numeros + '<br><br>' + '</div>'
                }, scope.tfImporteMovimiento, scope.cbMovimientoOperacion*//*, scope.dfMovimientoFecha*/]
        });

//        if (scope.cInicial == 1)
//            scope.fpMovimientoAnticipo.add(scope.cbMovimientoOperacion);

        Ext.apply(this, {
            modal: true,
            id: 'winCancelar',
            frame: true,
            resizable: true,
            bodyStyle: 'padding:5px 5px 5px',
            border: false,
            closable: true,
            defaultButton: 'btnMovimientoAceptar',
            title: 'Liquidación del anticipo No. ' + scope.numero,
            width: '35%',
            constrain: true,
            items: [scope.fpMovimientoAnticipo, scope.gpLiquidarDuo],
            buttons: [scope.btnMovimientoCerrar, scope.btnMovimientoAceptar]
        });

        return Ext.UIMovimientoAnticipo.superclass.constructor.call(this);
    }
});
