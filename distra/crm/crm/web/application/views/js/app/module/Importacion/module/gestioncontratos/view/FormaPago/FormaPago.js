Ext.define('GestionContratoImportacion.view.FormaPago.FormaPago', {
    extend: 'Ext.ux.CustomForm',
    alias: 'widget.FormaPagoimportacion',
    layout: 'border',
    itemId: 'formaPago',
    id: 'formaPago',
    border: false,
    bodyStyle: 'background:#DFE9F6;border:0px !important;padding:5px;',
    autoScroll: false,
    hitoStoreId: 'hitoStoreImportacion',
    indicadorStoreId: 'indicadorStoreImportacion',
    soloMonedas: false,
    mostrarDatosAdicionalesProductos: true,
    ocultarHitoPago: false,
    ocultarIndicadores: false,
    requires: [
        'GestionContratoImportacion.view.FormaPago.Hito.GridHitoPago',
        'GestionContratoImportacion.view.FormaPago.Hito.HitoPagoWindow',
        'GestionContratoImportacion.view.FormaPago.Alternativo.PagoAlternativo',
        'Ext.ux.CmbSelectField',
        'GestionContratoImportacion.view.FormaPago.Cronograma.PanelCronograma'
    ],

    initComponent: function () {
        this.createInitialConfig();
        this.callParent();
    },
    createInitialConfig: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.title = me.context == "proveedor" ? me.etiquetas.lbPago : me.etiquetas.lbCobro;

        me.hitopago = Ext.create('GestionContratoImportacion.view.FormaPago.Hito.GridHitoPago', {
            dataMedioPago: me.dataMedioPago,
            title: me.etiquetas.lbHitosPago,
            disabled: false,
            hitoStoreId: me.hitoStoreId,
            hidden: me.ocultarHitoPago || me.tipocontrato=='contratoMarco'
        });

        var atributosProductos={
            title: me.etiquetas.lbProdServ,
            _this: me._this,
            context: me.context,
            disabled: false,
            indicadorStoreId: me.indicadorStoreId,
//             mostrarDatosAdicionales: me. mostrarDatosAdicionalesProductos,
            hidden: me.ocultarIndicadores,
            monedasentidad: me.extrafields
        }
        // console.log('me.confAdicionalGridProductos1', me.confAdicionalGridProductos)
        if(me.confAdicionalGridProductos){
            Ext.merge(atributosProductos, me.confAdicionalGridProductos)
        }

        me.indicadores = Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto',
            atributosProductos)

        // me.indicadores = Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto', {
        //     title: me.etiquetas.lbProdServ,
        //     _this: me._this,
        //     context: me.context,
        //     disabled: false,
        //     indicadorStoreId: me.indicadorStoreId,
        //     mostrarDatosAdicionales: me.mostrarDatosAdicionalesProductos
        // });
        // if(me.confAdicionalGridProductos){
        //     Ext.apply(me.indicadores, me.confAdicionalGridProductos)
        // }

        // me.mora=Ext.create('GestionContratoImportacion.view.FormaPago.GridMora',{
        //     title:'Mora'
        // });

        me.tabpanel = Ext.create('Ext.tab.Panel', {
            region: 'center',
            border: false,
            frame: false,
            margin: '10 0 0 0',
            activeTab: me.ocultarHitoPago?me.indicadores:me.hitopago,
            // activeTab: me.planificacion ? me.cronograma : (me.ocultarHitoPago?me.indicadores:me.hitopago),
            items: [
                me.hitopago,
                me.indicadores,
                me.mora
            ]
        });

        me.montoTotal = Ext.create('Ext.ux.MoneyField', {
            fieldLabel: me.etiquetas.lbTotalAmount,
            name: 'montototal',
            flex: 1,
            minValue: 0,
            decimalPrecision: 2,
            allowExponential: false,
            readOnly: true,
            margin: '0 2 0 0',
            // validator: function (value) {
            //     if (!me.comprobarVacioMontos() && me.calcularTotalMontos() != parseFloat(value.replace(',', '.'))) {
            //         me.marcarInvalidosMontos(me.etiquetas.msgNoCoincideMonto);
            //         return me.etiquetas.msgNoCoincideMonto;
            //         // Ext.each(me.up('window').extrafields, function (value, index) {
            //         //     console.info('rrrrrr', value)
            //         //     if(me.up('window').down('#montomoneda_'+value.codigoiso.toLowerCase())){
            //         //         console.info('entro', value.codigoiso)
            //         //         if(!me.up('window').down('#montomoneda_'+value.codigoiso.toLowerCase()).introducidoManual)
            //         //             console.info('entro2', value.codigoiso)
            //         //             me.up('window').down('#montomoneda_'+value.codigoiso.toLowerCase()).markInvalid(
            //         //                 me.etiquetas.msgNoCoincideMonto);
            //         //     }
            //         // })
            //     }
            //     me.desmarcarInvalidosMontos();
            //     return true;
            // },
            listeners: {
                change: function () {
                    me.comprobarValidezMontos();
                }
            }
        });

        me.calcMontoTotal = Ext.create('Ext.button.Button', {
            // enableToggle: true,
            iconCls: 'icondistra-calcular',
            // pressed: false,
            // tooltip: me.etiquetas.qtipCalcular,
            tooltip: me.etiquetas.qtipCalcularMontosContratos,
            margin: '18 0 0 0',
            handler:function(){
                var montosHitos=me.calcularTotalMontosHitosDetallados(),
                    montosIndicadores=me.calcularTotalMontosIndicadoresDetallados();
                // console.log('montosHitos', montosHitos)
                // me.montoTotal.setValue(parseFloat(montosHitos['total'])+parseFloat(montosIndicadores['total']));
                Ext.each(me.extrafields, function (field, index) {
                    var actual = me.down('#montomoneda_' + field.codigoiso.toLowerCase());
                    if (actual) {
                        var hitosMoneda = montosHitos[field.codigoiso] || 0,
                            indicadoresMoneda = montosIndicadores[field.codigoiso] || 0;
                        actual.setValue(parseFloat(hitosMoneda.toFixed(2))+parseFloat(indicadoresMoneda.toFixed(2)));
                        // actual.introducidoManual=false;
                        // actual.removeCls('introducidomanual');
                        // if(actual.tip)actual.tip.destroy();
                    }

                })
            }
        });

        me.hfMedioPago = Ext.create('Ext.form.field.Hidden', {
            name: 'idmediodepago'
        });

        me.sfMedioPago = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbMedioPago,
            name: 'mediopago',
            mapping: 'NomMedioPago.nombre',
            localIdMulti: 'idmediodepago',
            module: 'Nomencladores',
            noactions: false,
            allowBlank: true,
            columnWidth: 0.33,
            flex: 1,
            margin: '0 10 0 0',
            context: 'gestioncontratomainwindowmediopago',
            filters: {},
            controller: 'gestioncontratomainwindow',
            multiSelect: true,
            // hidden: me.soloMonedas,
            pageSize: null
        });

        me.storeCondicionPago = this.store = Ext.create('Ext.data.Store', {
            pageSize: 10,
            fields: [
                {name: 'idcondicionespago', mapping: 'idterminodepago'},
                {name: 'nombre'}
            ],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getCondicionesPago'}, ModuleMgr.get('GestionContratoImportacion')),
                reader: {
                    idProperty: 'idcondicionpago',
                    type: 'json',
                    root: 'data',
                    totalProperty: 'count'
                }
            }
        });

        me.hfCondicionPago = Ext.create('Ext.form.field.Hidden', {
            name: 'idcondicionespago'
        });

        me.condicionPago = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbCondicionPago,
            autoExpand: false,
            store: me.storeCondicionPago,
            editable: false,
            valueField: 'nombre',
            displayField: 'nombre',
            name: 'condicionespago',
            columnWidth: 0.33,
            flex: 1,
            minChars: 0,
            pageSize: 10,
            mode: 'remote',
            queryParam: 'denominacion',
            localIdMulti: 'idcondicionespago',
            // localId: 'idcondicionespago',
            hidden: me.soloMonedas,
            multiSelect: true,
            // setValue: function (value) {
            //     console.log('setvalue:', value)
            //     // this.callParent(value);
            //     this.trueValue = value;
            //     if (typeof value == 'object') {
            //         var temp = new Array(),
            //             data;
            //         for (k in value) {
            //             if (value[k].data) {
            //                 data = value[k].data['idcondicionpago'];
            //             } else {
            //                 data = value[k];
            //             }
            //             temp.push(data);
            //         }
            //         console.log('value:', temp.join(','))
            //         this.trueValue = temp.join(',');
            //         this.value =
            //         console.log('aaaaa', this)
            //     }
            // }
        });

        me.hfdirtygrids = Ext.create('Ext.form.field.Hidden', {
            name: 'dirtygrids'
        });

        me.formItems = [
            {
                xtype: 'container',
                layout: 'hbox',
                columnWidth: 1,
                items:[
                    {
                        xtype: 'container', columnWidth: 0.34, flex: 1,
                        layout: 'hbox', margin: '0 10 0 0', hidden: !me.mostrar_montototal,
                        items: [me.montoTotal, me.calcMontoTotal]
                    },
                    me.hfMedioPago, me.sfMedioPago, me.hfCondicionPago, me.condicionPago,
                    me.hfdirtygrids
                ]
            },

        ];

        if (me.extrafields && !me.hidden) {
            me.insertExtraFields();
            if(me.mora)
                me.setDatosComboMoneda();
        }

        me.topForm = Ext.create('Ext.form.Panel', {
            layout: 'column',
            bodyStyle: 'background:#DFE9F6;',
            border: false,
            region: 'north',
            height: 90,
            items: me.formItems
        });

        me.items = [me.topForm, me.tabpanel];

    },
    setDatosComboMoneda: function () {
        var self = this;
        Ext.each(this.extrafields, function (field, index) {
            // console.log(field);
            self.mora.storeComboMoneda.add({'codigoiso': field.codigoiso, 'idmonedaentidad': field.idmonedaentidad});
        });
    },
    insertExtraFields: function () {
        var pos = 0;
        Ext.each(this.extrafields, function (field, index) {
            this.formItems.splice(pos, 0, this.newHiddenField(field));
            this.formItems.splice(pos + 1, 0, this.newNumberField(field, index, this.extrafields.length));
            // if(this.addsuplemento)this.formItems.splice(pos + 1, 0, this.newIncrementoNumberField(field, index, this.extrafields.length));
            pos += 2;
        }, this);
    },
    newHiddenField: function (field) {
        return Ext.create('Ext.form.field.Hidden', {
            name: 'idmoneda_' + field.codigoiso.toLowerCase(),
            value: field.idmoneda
        });
    },
    newIncrementoNumberField: function (field, index, total) {
        var self = this,
            // number = Ext.create('Ext.form.field.Number', {
            number = Ext.create('Ext.ux.MoneyField', {
                fieldLabel: 'Valor ' + field.codigoiso.toUpperCase(),
                itemId: 'incremento_' + field.codigoiso.toLowerCase(),
                name: 'incremento_' + field.codigoiso.toLowerCase()+'_'+field.idmoneda,
                objetivo: 'montomoneda_' + field.codigoiso.toLowerCase(),
                margin: '0 0 0 5',
                maskRe: /[0-9,.]/,
                nanText: self.etiquetas.vNumDomain.replace(' <#dominio#>', ''),
                // minValue: 0,
                decimalPrecision: 2,
                allowExponential: false,
                maxWidth: 200,
                minValue: -1000000000000,
                flex: 0.5,
                value: 0,
                listeners: {
                    change: function (yo) {
                        // console.log('CHange:', self.changeIncrement, yo.itemId, self.down('#' + yo.objetivo).originalValue)
                        if(!yo.getValue())yo.setValue(0);
                        // if(self.suplemento && !self.addsuplemento && !self.down('#'+yo.objetivo).originalValue) {
                        if(!self.changeIncrement) {
                            // console.log('entra')
                            setTimeout(function(){
                                if(self.down('#' + yo.objetivo) && self.down('#' + yo.objetivo).getValue())
                                    self.down('#' + yo.objetivo).originalValue =
                                        parseFloat(self.down('#' + yo.objetivo).getValue().toFixed(2)) -
                                        (parseFloat(yo.getValue().toFixed(2)));
                            }, 500);
                        }
                        if(self.changeIncrement)
                            self.calcularIncremento(yo);
                        // console.log('yeyeyey', self.down('#' + yo.objetivo).originalValue)
                    },
                    spin: function (yo) {
                        if(self.changeIncrement)
                            self.calcularIncremento(yo);
                    }
                }
            });
        return number;
    },
    calcularIncremento: function(obj){
        var self=this;
        self.down('#'+obj.objetivo).setValue(
            parseFloat(self.down('#'+obj.objetivo).originalValue.toFixed(2))+parseFloat(obj.getValue().toFixed(2)))
    },
    newNumberField: function (field, index, total) {
        var self = this;
        var number = Ext.create('Ext.ux.MoneyField', {
            fieldLabel: field.codigoiso.toUpperCase(),
            itemId: 'montomoneda_' + field.codigoiso.toLowerCase(),
            name: 'montomoneda_' + field.codigoiso.toLowerCase()+'_'+field.idmoneda,
            //readOnly: self.addsuplemento,
            // columnWidth: total != 1 ? (100 / total) / 100 : 0.3,
            minValue: 0,
            // decimalPrecision: 2,
            allowExponential: false,
            // enableKeyEvents: true,
            maskRe: /[0-9,.]/,
            nanText: self.etiquetas.vNumDomain.replace(' <#dominio#>', ''),
            titlesito: 'Los valores de los montos han',
            maxText: 'El monto no puede ser mayor de' + ' <b>({0})</b>.',
            // maxText: self.etiquetas.msgNumeroMaximoHito + ' <b>({0})</b>.',
            flex: 1,
            listeners: {
                keyup: function (yo, e) {
                    self.introducidoManual(yo);
                }
            },
        });
        // number.validator = function (valor) {
        //     var montoshitos = self.calcularTotalMontosHitosDetallados(),
        //         montosIndicadores = self.calcularTotalMontosIndicadoresDetallados(),
        //         hitosMoneda = montoshitos[field.codigoiso] || 0,
        //         indicadoresMoneda = montosIndicadores[field.codigoiso] || 0;
        //     if (parseFloat(valor.replace(',', '.')) < (parseFloat(hitosMoneda.toFixed(2)) + parseFloat(indicadoresMoneda.toFixed(2)))) {
        //         return self.etiquetas.msgSumaServicioProductosHitos +
        //             ' <b>(' + Ext.util.Format.currency(parseFloat(hitosMoneda + indicadoresMoneda)) + ')</b>';
        //     }
        //         // return me.etiquetas.msgNoCoincideMonto;
        //     return true;
        // };
        // number.addListener('spin', function () {
        //     setTimeout(function () {
        //         self.introducidoManual(number);
        //     }, 200)
        // }, number);
        // number.addListener('keyup', this.introducidoManual, number);
        number.addListener('change', this.sumarTotalMonedas, number);

        var campos = [number];
        if (self.addsuplemento || self.suplemento) campos.push(self.newIncrementoNumberField(field, index, total));

        return Ext.create('Ext.container.Container', {
            layout: {
                type: 'hbox', align: 'stretch'
            },
            columnWidth: total != 1 ? (100 / total) / 100 : 0.3,
            margin: index == (total - 1) ? '0 0 0 0' : '0 10 0 0',
            items: campos
        });
    },
    marcarInvalidosMontos: function (error) {
        var me = this;
        Ext.each(me.up('window').extrafields, function (value, index) {
            if (me.up('window').down('#montomoneda_' + value.codigoiso.toLowerCase())) {
                me.up('window').down('#montomoneda_' + value.codigoiso.toLowerCase()).markInvalid(
                    error);
            }
        })
    },
    desmarcarInvalidosMontos: function () {
        var me = this;
        Ext.each(me.up('window').extrafields, function (value, index) {
            var number = me.up('window').down('#montomoneda_' + value.codigoiso.toLowerCase());
            if (number) {
                number.clearInvalid();
            }
        })
    },
    introducidoManual: function (campo) {
        var self = this,
            manual = !campo.up('#formaPago').comprobarVacioMontos();
        if (campo.getValue() != null) {
            campo.tip = Ext.create('Ext.tip.ToolTip', {
                target: campo.getEl(),
                html: self.etiquetas.msgHitosNoSuperarMonto,
                autoDestroy: true
            });
            campo.tip.showBy(campo.getEl());
        } else if(campo.tip){
            campo.tip.destroy();
        }

        Ext.each(campo.up('window').extrafields, function (field, index) {
            var actual = campo.up('window').down('#montomoneda_' + field.codigoiso.toLowerCase());
            if (actual) {
                actual.introducidoManual = manual;
                manual ? actual.addCls('introducidomanual') : actual.removeCls('introducidomanual');
                actual.validate();
            }
        });
        // }
    },
    sumarTotalMonedas: function (campo) {
        var formaPago = campo.up('form').up('form');
        if (!formaPago.montoTotal.readOnly) formaPago.comprobarValidezMontos();
        formaPago.montoTotal.readOnly ?
            formaPago.montoTotal.setValue(formaPago.calcularTotalMontos())
            : formaPago.montoTotal.validate();

    },
    calcularTotalMontos: function () {
        var suma = 0, self = this;
        Ext.each(this.up('window').extrafields, function (field, index) {
            if (self.down('#montomoneda_' + field.codigoiso.toLowerCase())) {
                if (self.down('#montomoneda_' + field.codigoiso.toLowerCase()).getValue()) {
                    // console.log('MONEDA:',field.codigoiso,' valor:',self.down('#montomoneda_' + field.codigoiso.toLowerCase()).getValue().toFixed(2));
                    suma += parseFloat(self.down('#montomoneda_' + field.codigoiso.toLowerCase()).getValue().toFixed(2));
                }
            }
        });
        return parseFloat(suma.toFixed(2));
    },
    comprobarVacioMontos: function () {
        var valor = false, self = this;
        Ext.each(this.up('window').extrafields, function (field, index) {
            if (self.down('#montomoneda_' + field.codigoiso.toLowerCase())) {
                if (['', undefined, null].indexOf(
                    self.down('#montomoneda_' + field.codigoiso.toLowerCase()).getValue()) == -1)
                    valor = true;
            }
        });
        // console.log('Suma comprobarVacioMontos:', !valor);
        return !valor;
    },
    calcularTotalMontosHitos: function () {
        var self = this, sumaUtilizada = 0;
        Ext.each(self.hitopago.getStore().getRange(), function (value, index) {
            for (var i in value.get('pago')) {
                sumaUtilizada += parseFloat(value.get('pago')[i]['monto'].toFixed(2));
            }
            // if(value.get('pago')['moneda']==field.codigoiso)
            //     sumaUtilizada+=parseFloat(value.get('pago')['monto']);
        });
        return parseFloat(sumaUtilizada.toFixed(2));
    },
    calcularTotalMontosHitosDetallados: function () {
        var self = this, sumaUtilizada = {'total': 0};
        Ext.each(self.hitopago.getStore().getRange(), function (value, index) {
            for (var i in value.get('pago')) {
                if(value.get('pago')[i]['monto']!=null && !isNaN(value.get('pago')[i]['monto'])){
                    if (sumaUtilizada[value.get('pago')[i]['moneda']] == undefined || sumaUtilizada[value.get('pago')[i]['moneda']] == null || isNaN(sumaUtilizada[value.get('pago')[i]['moneda']]))
                        sumaUtilizada[value.get('pago')[i]['moneda']] = 0;
                    if(!isNaN(value.get('pago')[i]['monto'])){
                        sumaUtilizada[value.get('pago')[i]['moneda']] += parseFloat(parseFloat(value.get('pago')[i]['monto']).toFixed(2));
                        sumaUtilizada['total'] += parseFloat(parseFloat(value.get('pago')[i]['monto']).toFixed(2));
                    }
                }

            }
        });
        return sumaUtilizada;
    },
    calcularTotalMontosIndicadores: function (usandoCantidad) {
        var self = this, sumaUtilizada = 0;
        if (usandoCantidad == undefined) usandoCantidad = true;
        Ext.each(self.indicadores.getStore().getRange(), function (value, index) {
            if (sumaUtilizada) {
                // if()
                sumaUtilizada += parseFloat(parseFloat(value.get('precio')).toFixed(2)) * parseFloat(value.get('cantidad'));
                sumaUtilizada += parseFloat(parseFloat(value.get('preciodivisa')).toFixed(2)) * parseFloat(value.get('cantidad'));
            } else {
                sumaUtilizada += parseFloat(parseFloat(value.get('precio')).toFixed(2));
                sumaUtilizada += parseFloat(parseFloat(value.get('preciodivisa')).toFixed(2));
            }

        });
        return parseFloat(sumaUtilizada.toFixed(2));
    },
    calcularTotalMontosIndicadoresDetallados: function (usandoCantidad) {
        var self = this, sumaUtilizada = {'total': 0};
        if (usandoCantidad == undefined) usandoCantidad = true;
        // self.indicadores.
        Ext.each(self.indicadores.getStore().getRange(), function (value, index) {
            var tipomoneda='montomoneda_';
            if(value.get('fechaconversion'))tipomoneda='montomonedaconversion_';
            self.extrafields.forEach(function(field){
                if(sumaUtilizada[field.codigoiso]==undefined || isNaN(sumaUtilizada[field.codigoiso]))
                    sumaUtilizada[field.codigoiso]=0;
                if(!isNaN(sumaUtilizada[field.codigoiso])) {
                    if(usandoCantidad){
                        sumaUtilizada[field.codigoiso] += parseFloat(value.get(tipomoneda + field.codigoiso.toLowerCase() + '_' + field.idmoneda).toFixed(2))*parseFloat(value.get('cantidad'));
                        sumaUtilizada['total'] += parseFloat(value.get(tipomoneda + field.codigoiso.toLowerCase() + '_' + field.idmoneda).toFixed(2))*parseFloat(value.get('cantidad'));
                    }else{
                        sumaUtilizada[field.codigoiso] += parseFloat(value.get(tipomoneda + field.codigoiso.toLowerCase() + '_' + field.idmoneda).toFixed(2));
                        sumaUtilizada['total'] += parseFloat(value.get(tipomoneda + field.codigoiso.toLowerCase() + '_' + field.idmoneda).toFixed(2));
                    }
                }
            })
        });
        return sumaUtilizada;
    },
    comprobarValidezMontos: function () {
        var self = this, montoshitos = self.calcularTotalMontosHitosDetallados(),
            montosIndicadores = self.calcularTotalMontosIndicadoresDetallados();
        // self.up('window').validezMontos.setValue('valido');
        // if (!self.montoTotal.readOnly) {
        //     console.log('compare:', self.calcularTotalMontos(),'->',self.montoTotal.getValue())
        //     if (!self.comprobarVacioMontos() && self.calcularTotalMontos() != self.montoTotal.getValue())
        //         self.up('window').validezMontos.setValue('');
        // }
        // self.montoTotal.readOnly ? self.montoTotal.removeCls('introducidomanual') : self.montoTotal.addCls('introducidomanual');
        // Ext.each(this.up('window').extrafields, function (field, index) {
        //     if (self.down('#montomoneda_' + field.codigoiso.toLowerCase())) {
        //         if (!montoshitos[field.codigoiso]) montoshitos[field.codigoiso] = 0;
        //         if (!montosIndicadores[field.codigoiso]) montosIndicadores[field.codigoiso] = 0;
        //
        //         if (self.down('#montomoneda_' + field.codigoiso.toLowerCase()).getValue() <
        //             (parseFloat(montoshitos[field.codigoiso].toFixet(2)) + parseFloat(montosIndicadores[field.codigoiso].toFixet(2))))
        //             self.up('window').validezMontos.setValue('');
        //     }
        // });
        if(self.montoTotal.getActiveError())
            self.up('window').validezMontos.setValue('');
        // console.info('vaaallid:', self.up('window').validezMontos.getValue())

    },
    cambiarMontosPorHitosIndicadores: function () {
        var self = this, montoshitos = self.calcularTotalMontosHitosDetallados(),
            montosIndicadores = self.calcularTotalMontosIndicadoresDetallados();
//         console.log('montosIndicadores', montosIndicadores)
//         console.log(self.extrafields)
        Ext.each(this.up('window').extrafields, function (field, index) {
            var actual = self.down('#montomoneda_' + field.codigoiso.toLowerCase());
            if (actual) {
                // if (!actual.introducidoManual) {
                    hit = montoshitos[field.codigoiso] ? montoshitos[field.codigoiso] : 0;
                    actual.setValue(hit + montosIndicadores[field.codigoiso]);
                // }
            }
        })
    }
});
