Ext.define('PRT.controller.CtrProrrateo', {
    extend: 'Ext.app.Controller',

    views: [
        'PanelProrrateo@PRT.view',
        'GridPanelProrrateo@PRT.view',
        'WindowConfProrrateo@PRT.view',
        'WindowAddModProrrateo@PRT.view',
        'WindowHojaDistributiva@PRT.view'
    ],
    stores: [
        'StProrrateo@PRT.store'
    ],
    models: [
        'MdProrrateo@PRT.model'
    ],

    refs: [
        {
            ref: 'gridProrrateo',
            selector: 'gridpanelprorrateo'
        },
        {
            ref: 'comboNivelProrrateo',
            selector: 'gridpanelprorrateo toolbar combobox[name=nivelprorrateo]'
        },
        {
            ref: 'toolbarPanelProrrateo',
            selector: 'panelprorrateo toolbar'
        },
        {
            ref: 'panelDetalleProrrateo',
            selector: 'panelprorrateo panel[itemId=panelDetalleProrrateo]'
        }
    ],

    init: function () {
        this.fechaContableObj = null;
        //this.idioma = eval('PRT.language.' + lang);
        this.idioma = PRT.language[lang];
        this.numberformat = CostoComun.NumberFormat;
        this.saldoGastoAsociados();
        //Ext.FocusManager.enable(true);
        this.listen({
            global: {},
            controller: {},
            store: {
                '#stNivelProrrateo': {
                    load: function (store, records, successful, eOpts) {
                        this.fechaContableObj = store.getProxy().getReader().rawData.fecha;
                        this.validateNivelProrrateo(records);
                    }
                },
                '#stProrrateo': {}
            },
            component: {}
        });

        this.control({
            /*Botón Configuración*/
            'panelprorrateo toolbar button[itemId=btnconfiguracionprorrateo]': {
                click: this.showWindowConfigurarProrrateo
            },
            /*Botón Hoja de distribución*/
            'panelprorrateo toolbar button[itemId=btnhojadistribucion]': {
                click: this.showWindowHojaDsitribucion
            },
            /*Botón Adicionar prorrateo*/
            'panelprorrateo toolbar button[itemId=btnadicionarprorrateo]': {
                click: function (button, event, eOpts) {
                    this.showWindowAddModProrrateo('add');
                }
            },
            /*Botón Modificar prorrateo*/
            'panelprorrateo toolbar button[itemId=btnmodificarprorrateo]': {
                click: function (button, event, eOpts) {
                    this.showWindowAddModProrrateo('mod');
                }
            },
            /*Botón Eliminar prorrateo*/
            'panelprorrateo toolbar button[itemId=btneliminarprorrateo]': {
                click: function () {
                    this.eliminarProrrateo();
                }
            },
            /*Botón Ejecutar prorrateo*/
            'panelprorrateo toolbar button[itemId=btnejecutarprorrateo]': {
                click: function () {
                    this.loadDataComprobante(1);
                }
            },
            /*Botón Cancelar prorrateo*/
            'panelprorrateo toolbar button[itemId=btncancelarprorrateo]': {
                click: function () {
                    this.loadDataComprobante(2);
                }
            },
            /*Botón Actualizar saldo*/
            'panelprorrateo toolbar button[itemId=btnActualizarSaldo]': {
                click: function () {
                    this.saldoGastoAsociados();
                }
            },
            /*Botón Actualizar saldo*/
            'panelprorrateo toolbar button[itemId=btnvercomprobante]': {
                click: function () {
                    this.verComprobante();
                }
            },
            /*Action column*/
            'gridpanelprorrateo actioncolumn[itemId=actioncolumngridprorrateo]': {
                afterrender: this.initActionColumnProrrateo
                // afterrender: function () {
                // }
            },
            /*ComboBox Nivel del prorrateo*/
            'gridpanelprorrateo toolbar combobox[name=nivelprorrateo]': {
                change: function (field, newValue, oldValue, eOpts) {
                    this.changeValueComboNivelProrrateo(newValue, oldValue);
                }
            },
            /*Grid panel prorrateo*/
            'gridpanelprorrateo': {
                selectionchange: function (selmodel, selected, eOpts) {
                    this.activateDesactivateBtns(selected);
                    this.showDetailProrrateo(selected);

                },
                select: function (rowsel, record, index, eOpts) {
                    this.getGridProrrateo().getView().addRowCls(index, "negrita");
                },
                deselect: function (rowsel, record, index, eOpts) {
                    this.getGridProrrateo().getView().removeRowCls(index, "negrita");
                }
            }
        });

        /*this.nav = Ext.create('Ext.util.KeyNav', Ext.getBody(), {
            "left" : function(){
                var el = Ext.FocusManager.focusedCmp;
                if (el.previousSibling()) el.previousSibling().focus();
            },
            "right" : function(){
                var el = Ext.FocusManager.focusedCmp;
                if (el.nextSibling()) el.nextSibling().focus();
            },
            "up" : function() {
                var el = Ext.FocusManager.focusedCmp;
                if (el.up()) el.up().focus();
            },
            "down" : function() {
                var el = Ext.FocusManager.focusedCmp;
                if (el.items) el.items.items[0].focus();
            },
            scope : this
        });*/

        // map multiple keys to multiple actions by strings and array of codes
        /*this.map = Ext.create('Ext.util.KeyMap', {
            target: Ext.getBody(),
            binding: [{
                key: [10, 13],
                fn: function () {
                    alert("Return was pressed");
                }
            }, {
                key: "abc",
                scope: this,
                fn: function () {
                }
            }, {
                key: Ext.EventObject.T,
                ctrl: true,
                shift: true,
                fn: function () {
                    alert('Control + shift + t was pressed.');
                }
            }]
        });*/
    },
    /*
    * Función que se utiliza para mostrar la ventana de configuración de prorrateo
    * */
    showWindowConfigurarProrrateo: function () {
        Ext.widget('windowconfprorrateo').on({
            scope: this,
            close: function () {
                Ext.Msg.wait('Por favor espere...', 'Cargando');
                this.getComboNivelProrrateo().store.load({
                    callback: function () {
                        Ext.MessageBox.hide();
                    }
                });
            }
        });
    },
    /*
    * Función que se utiliza para mostrar la ventana de la hoja de distribución
    * */
    showWindowHojaDsitribucion: function () {
        Ext.widget('windowhojadistributiva');
    },
    /*
    * Función que se utiliza para mostrar la ventana de adicionar o modificar prorrateo
    * */
    showWindowAddModProrrateo: function (action) {
        var idnivelprorrateo = this.getComboNivelProrrateo().getValue();
        var storenivelprorrateo = this.getComboNivelProrrateo().store;
        var index = storenivelprorrateo.find('idnivelprorrateo', idnivelprorrateo);
        var recordnivelprorrateo = storenivelprorrateo.getAt(index);

        var objmodprorrateo = null;
        if (action == 'mod') {
            var selected = this.getGridProrrateo().getSelectionModel().getLastSelected().data;
            var arrreceptores = [];
            selected.receptores.forEach(function (item, index, AllItems) {
                arrreceptores.push({
                    id: item.idcuentareceptor
                });
            }, this);

            objmodprorrateo = {
                idprorrateo: selected.idprorrateo,
                nomnivelprorrateo: selected.nomnivelprorrateo,
                idnivelprorrateo: selected.idnivelprorrateo,
                descripcion: selected.descripcion,
                fecha: selected.fecha,
                emisor: [{id: selected.idcuentaemisor, value: selected.cuentaemisor}],
                elementogastotraspaso: [{id: selected.idelementogastotraspaso, value: selected.elementogastotraspaso}],
                idorigenBD: selected.idorigenBD,
                idinductor: selected.idinductor,
                elementogastoaprorratear: [{
                    id: selected.idelementogastoaprorratear,
                    value: selected.elementogastoaprorratear
                }],
                cuentaanalisis: [{
                    id: selected.idcuentaanalisis,
                    value: selected.cuentaanalisis
                }],
                porcientotraspasar: selected.porcientotraspasar,
                receptores: arrreceptores
            };
        }

        Ext.widget('windowaddmodprorrateo', {
            action: action,
            // nivel: {
            //     idnivelprorrateo: idnivelprorrateo,
            //     nomnivelprorrateo: recordnivelprorrateo.data.textnivelprorrateo,
            //     idparteformatoorigen: recordnivelprorrateo.data.idparteformatoorigen,
            //     idparteformatodestino: recordnivelprorrateo.data.idparteformatodestino
            // },
            fechaObj: this.fechaContableObj,
            objmodprorrateo: objmodprorrateo,
            comboNivel: this.getComboNivelProrrateo().cloneConfig({
                name: 'addNivel',
                trigger2Cls: '',
                trigger2tip: '',
                onTrigger2Click: '',
                listeners: '',
                // width: '100%',
                anchor: '100%',
                enforceMaxLength: false,
                fieldLabel: 'Nivel',
                id: 'ahh'
            })
        }).on({
            scope: this,
            addprorrateo: function (window, datos, aplicar) {
                this.addmodProrrateo(action, datos, window, aplicar);
            }
        });
    },
    /*
    * Activar o desactivar los botones según los elemento seleccionados
    * */
    activateDesactivateBtns: function (selected) {
        var toolbarPanelProrrateo = this.getToolbarPanelProrrateo();
        if (selected.length === 1) {
            // if (this.getComboNivelProrrateo().getValue())
            toolbarPanelProrrateo.down('button[itemId=btnmodificarprorrateo]').setDisabled(false);
            toolbarPanelProrrateo.down('button[itemId=btnejecutarprorrateo]').setDisabled(false);
            toolbarPanelProrrateo.down('button[itemId=btncancelarprorrateo]').setDisabled(false);
            if (selected[0].data.idcomprobante) {
                toolbarPanelProrrateo.down('button[itemId=btneliminarprorrateo]').setDisabled(true);
                // toolbarPanelProrrateo.down('button[itemId=btnvercomprobante]').setDisabled(false);
            } else toolbarPanelProrrateo.down('button[itemId=btneliminarprorrateo]').setDisabled(false);
            // } else toolbarPanelProrrateo.down('button[itemId=btnvercomprobante]').setDisabled(true);
        } else if (selected.length > 1) {
            toolbarPanelProrrateo.down('button[itemId=btnmodificarprorrateo]').setDisabled(true);
            toolbarPanelProrrateo.down('button[itemId=btneliminarprorrateo]').setDisabled(false);
            toolbarPanelProrrateo.down('button[itemId=btnejecutarprorrateo]').setDisabled(false);
            toolbarPanelProrrateo.down('button[itemId=btncancelarprorrateo]').setDisabled(false);
            // toolbarPanelProrrateo.down('button[itemId=btnvercomprobante]').setDisabled(true);
        } else {
            toolbarPanelProrrateo.down('button[itemId=btnmodificarprorrateo]').setDisabled(true);
            toolbarPanelProrrateo.down('button[itemId=btneliminarprorrateo]').setDisabled(true);
            toolbarPanelProrrateo.down('button[itemId=btnejecutarprorrateo]').setDisabled(true);
            toolbarPanelProrrateo.down('button[itemId=btncancelarprorrateo]').setDisabled(true);
            // toolbarPanelProrrateo.down('button[itemId=btnvercomprobante]').setDisabled(true);
        }

        selected.forEach(function (item, index, arraySelect) {
            // if (item.data.idestado != 1) {//Elaborado
            //     toolbarPanelProrrateo.down('button[itemId=btnejecutarprorrateo]').setDisabled(true);
            //     toolbarPanelProrrateo.down('button[itemId=btnmodificarprorrateo]').setDisabled(true);
            //     toolbarPanelProrrateo.down('button[itemId=btneliminarprorrateo]').setDisabled(true);
            // }
            if (!item.data.idcomprobante) {//Ejecutado
                toolbarPanelProrrateo.down('button[itemId=btncancelarprorrateo]').setDisabled(true);
            }
            if (item.data.idnivelprorrateo != arraySelect[0].data.idnivelprorrateo) {
                toolbarPanelProrrateo.down('button[itemId=btnejecutarprorrateo]').setDisabled(true);
                toolbarPanelProrrateo.down('button[itemId=btncancelarprorrateo]').setDisabled(true);
            }
        }, this);
    },
    /*
    * Función necesariap ara mostrar los detalles del prorrateo seleccioando
    * */
    showDetailProrrateo: function (selected) {
        var tplTemp = new Ext.XTemplate();
        tplTemp.overwrite(this.getPanelDetalleProrrateo().body, {});

        if (selected.length == 1) {
            if (this.getPanelDetalleProrrateo().collapsed) {
                this.getPanelDetalleProrrateo().expand();
            }

            var arrCtaParams = [];
            selected[0].data.receptores.forEach(function (item, index, allItems) {
                arrCtaParams.push({
                    id: item.idcuentareceptor
                });
            }, this);

            var myMask = new Ext.LoadMask(this.getPanelDetalleProrrateo().getEl(), {msg: this.idioma.msgCargando});
            myMask.show();

            Ext.Ajax.request({
                scope: this,
                url: 'loadDataReceptores',
                params: {
                    ctareceptores: Ext.encode(arrCtaParams),
                    idinductor: selected[0].data.idinductor
                },
                callback: function (options, success, response) {
                    myMask.hide();
                    var responseobj = Ext.decode(response.responseText);

                    var basedistributiva = '';
                    if (selected[0].data.idorigenBD == 1) {
                        basedistributiva = 'Unidades físicas';
                    } else if (selected[0].data.idorigenBD == 2) {
                        basedistributiva = 'Monto total';
                    } else {
                        basedistributiva = 'Elemento de gasto';
                    }

                    var data = {
                        idorigenBD: selected[0].data.idorigenBD,
                        basedistributiva: basedistributiva,
                        idinductor: selected[0].data.idinductor,
                        inductor: selected[0].data.inductor,
                        idelementogastoaprorratear: selected[0].data.idelementogastoaprorratear,
                        elementogastoaprorratear: selected[0].data.elementogastoaprorratear,
                        receptores: responseobj.datos
                    };

                    var tpl = new Ext.XTemplate(
                        '<div class="det-general">',
                        '<h3>Origen de base distributiva:</h3>',
                        '<h2>{basedistributiva}</h2>',
                        '</div>',
                        '<div class="det-general">',
                        '<tpl if="idorigenBD == 1">',
                        '<h3>Base distributiva:</h3>',
                        '<h2>{inductor}</h2>',
                        '<tpl elseif="idorigenBD == 3">',
                        '<h3>Elemento de gasto a prorratear:</h3>',
                        '<h2>{elementogastoaprorratear}</h2>',
                        '</tpl>',
                        '</div>',
                        '<hr class="det-hr" />',
                        '<div>',
                        '<tpl for="receptores">',
                        '<tpl if="idinductor">',
                        '<div class="det-card">',
                        // '<p>Receptor:</p>',
                        '<p>{receptor}</p>',
                        '<p>Valor: {valorinductor}</p>',
                        '</div>',
                        '<tpl else>',
                        '<div class="det-card">',
                        // '<p>Receptor:</p>',
                        '<p>{receptor}</p>',
                        '</div>',
                        '</tpl>',
                        '</tpl>',
                        '</div>',
                        {
                            disableFormats: true,
                        }
                    );
                    tpl.overwrite(this.getPanelDetalleProrrateo().body, data);
                }
            });
        } else {
            this.getPanelDetalleProrrateo().collapse();
        }
    },
    /*
* Función que se utiliza para cargar el comprobante del prorrateo seleccionado
* */
    loadDataComprobante: function (tipoContabilizacion) {//tipoContabilizacion: 1-Posteando, 2-Cancelando,
        window.UCID = window.parent.UCID;
        var arrayProrrateo = [];
        var arraySelections = this.getGridProrrateo().getSelectionModel().getSelection();
        Ext.each(arraySelections, function (record, index) {
            arrayProrrateo.push(record.data);
        });
        var idNivel = arraySelections[0].data.idnivelprorrateo;
        var nomNivel = arraySelections[0].data.nomnivelprorrateo;
        var idComprobante = arraySelections[0].data.idcomprobante;
        Ext.Msg.wait(this.idioma.lbCargandoCmp, this.idioma.lbEspere);
        Ext.Ajax.request({
            url: 'loadDataComprobante',
            method: 'POST',
            scope: this,
            timeout: 999999,
            params: {
                arrayProrrateo: Ext.encode(arrayProrrateo),
                tipoContabilizacion: tipoContabilizacion,
                nomNivel: nomNivel,
                idNivel: idNivel,
                idComprobante: idComprobante
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData.codMg == -1) {
                    mostrarMensaje(1, this.idioma.msgVerificarEjecucion);
                    Ext.MessageBox.hide();
                    return;
                }
                if (responseData.codMg == -2) {
                    mostrarMensaje(1, this.idioma.msgVerificarCancelacion);
                    Ext.MessageBox.hide();
                    return;
                }
                if (responseData.codMg == -3) {
                    mostrarMensaje(1, this.idioma.msgNoOperacion);
                    Ext.MessageBox.hide();
                    return;
                }

                if (responseData.codMg == -4) {
                    mostrarMensaje(1, this.idioma.lbNoSaldoEmisor);
                    Ext.MessageBox.hide();
                    return;
                }

                if (responseData.codMg == -5) {
                    mostrarMensaje(1, this.idioma.lbNoSaldoReceptorEG);
                    Ext.MessageBox.hide();
                    return;
                }

                if (responseData.codMg == -6) {
                    mostrarMensaje(1, this.idioma.lbNoSaldoReceptorEG);
                    Ext.MessageBox.hide();
                    return;
                }

                if (responseData.codMg == -7) {
                    mostrarMensaje(1, this.idioma.lbNoSaldoReceptorCC);
                    Ext.MessageBox.hide();
                    return;
                }
                if (responseData.analisisNoEncontrados) {
                    var msgAnalisisNoEncontrados = this.idioma.lbAperturasNoExisten + responseData.analisisNoEncontrados.join('<br>');
                    mostrarMensaje(3, msgAnalisisNoEncontrados);
                    return;
                }
                if (responseData.dataComprobante.length == 0) {
                    mostrarMensaje(3, this.idioma.lbReviseConfiguracion);
                    return;
                }
                window.dataComprobante = responseData.dataComprobante;
                window.fechaComp = responseData.fechaComp;
                if (tipoContabilizacion == 1) {
                    window.descripcionCmp = responseData.descripcion.join('. ');
                    window.detalleCmp = responseData.detalle.join('. ');
                } else {
                    window.descripcionCmp = responseData.descripcion;
                    window.detalleCmp = responseData.detalle;
                }
                window.tipoContabilizacion = tipoContabilizacion;
                window.idCmp = null;
                window.winCmp = new Ext.Window({
                    // title : "iframe",
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    closable: false,
                    border: false,
                    frame: false,
                    constrain: true,
                    modal: false,
                    resizable: false,
                    //html: '<iframe style="border: none;" src= "/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/mostrarcomprobante/mostrarcomprobanteExt4" width="100%" height="100%"></iframe>'
                    items: [{
                        xtype: "component",
                        autoEl: {
                            //tag : "iframe style='border: none;'",
                            tag: "iframe",
                            style: 'height: 100%; width: 100%; border: none',
                            src: "/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/mostrarcomprobante/mostrarcomprobanteExt4"
                        }
                    }],
                    listeners: {
                        scope: this,
                        close: function () {
                            if (window.winCmp.dataComprobanteResult)
                                this.cambiarEstadoProrrateo(window.winCmp.dataComprobanteResult, tipoContabilizacion, responseData.arrayProrrateoEjecutados);
                        }
                    }
                }).show();
                Ext.MessageBox.hide();
            }.bind(this)
        });
    },
    /*
   * Función que se utiliza para cambiar estado a el o los prorrateos seleccionados
   * */
    cambiarEstadoProrrateo: function (dataComprobanteResult, tipoContabilizacion, arrayProrrateoEjecutados) {
        var arrseleccionados = this.getGridProrrateo().getSelectionModel().getSelection();

        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: this.idioma.msgCambiandoEstadoProrrateo});
        myMask.show();

        /*var arrids = [];
        arrseleccionados.forEach(function (item, index, AllItems) {
            arrids.push(item.data.idprorrateo);
        }, this);*/

        Ext.Ajax.request({
            scope: this,
            url: 'cambiarEstadoProrrateo',
            params: {
                // arridprorrateos: Ext.encode(arrids),
                arridprorrateos: Ext.encode(arrayProrrateoEjecutados),
                idComprobante: dataComprobanteResult.idComprobante,
                estado: tipoContabilizacion
            },
            callback: function (options, success, response) {
                myMask.hide();
                var responseobj = Ext.decode(response.responseText);

                if (responseobj.code == 1) {
                    if (tipoContabilizacion == 1) {//Posteando
                        mostrarMensaje(1, this.idioma.lbPosteoSatifactorio + dataComprobanteResult.numComprobante);
                    }
                    if (tipoContabilizacion == 2) {//Cancelando
                        mostrarMensaje(1, this.idioma.lbCancelacionSatifactorio + dataComprobanteResult.numComprobante);
                    }
                    arrseleccionados.forEach(function (item, index, AllItems) {
                        // item.set('idestado', tipoContabilizacion == 1 ? 2 : 1);
                        if (item.get('nocomprobante')) {
                            item.set('nocomprobante', item.get('nocomprobante') + ', ' + dataComprobanteResult.numComprobante);
                        } else {
                            item.set('nocomprobante', dataComprobanteResult.numComprobante);
                        }
                        item.set('idcomprobante', dataComprobanteResult.idComprobante);
                        var arridcom = item.get('arridcomprobante') ? Ext.decode(item.get('arridcomprobante')) : [];
                        arridcom.push({
                            idcomprobante: dataComprobanteResult.idComprobante,
                            tipo: tipoContabilizacion
                        });
                        item.set('arridcomprobante', Ext.encode(arridcom));
                        item.commit();
                    }, this);
                    this.getGridProrrateo().getSelectionModel().deselectAll();
                    this.getGridProrrateo().getStore().reload();
                }
            }.bind(this)
        });
    },
    /*
   * Función que se utiliza para obtener el saldo de las cuentas de gasto asociadas a los servicios 731,732
   * */
    saldoGastoAsociados: function () {
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: this.idioma.msgActualizandoSaldo});
        myMask.show();
        Ext.Ajax.request({
            url: 'saldoGastoAsociados',
            scope: this,
            // params: {
            // },
            callback: function (options, success, response) {
                var responseobj = Ext.decode(response.responseText);
                //Saldo Gasto
                var toolbarPanelProrrateo = this.getToolbarPanelProrrateo();
                var labelSaldoGasto = toolbarPanelProrrateo.down('label[itemId=labelSaldoGasto]');
                labelSaldoGasto.show();
                labelSaldoGasto.setText('Total de gastos: ' + responseobj.arraySaldo.join(' | '));
                if (responseobj.saldoTotal > 0)
                    labelSaldoGasto.getEl().setStyle("color", "blue");
                else labelSaldoGasto.getEl().setStyle("color", "black");
                myMask.hide();
            }
        });
    },
    /*
   * Función que se utiliza mostrar el comprobante
   * */
    verComprobante: function () {
        // Ext.Msg.wait(this.idioma.lbCargandoCmp, this.idioma.lbEspere);
        Ext.Msg.wait('Cargando...', 'Espere');
        var arraySelections = this.getGridProrrateo().getSelectionModel().getSelection();
        var idComprobante = arraySelections[0].data.idcomprobante;
        var arridComprobante = Ext.decode(arraySelections[0].data.arridcomprobante);

        var arrayIdCmp = [];
        var arrayId = arridComprobante;
        for (var i = 0; i < arrayId.length; i++) {
            arrayIdCmp.push({
                idcomprobante: arrayId[i].idcomprobante,
                // iddocucomprobante: this.gpGestionarDuo.getSelectionModel().getSelected().json.iddoc
            });
        }

        Ext.Ajax.request({
            url: "/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/registrodecomprobantes/" + 'obtenerDatosImprimirReporte',
            timeout: 600000000,
            params: {
                reporteParams: Ext.encode(arrayIdCmp)
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData.dataSources.length > 0) {
                    var datosreporte = {
                        datoGeneral: {
                            reporte: '100',
                            titulo: 'Comprobante de operaciones',
                        },
                        datoCuerpo: responseData.dataSources
                    };

                    var defaultComponentsValue = {
                        paperSize: "A4",
                        orientation: "Horizontal",
                        reportType: "HTML"
                    };
                    var printView = new SCFPrintView(datosreporte, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
                    printView.win.show();

                }
                Ext.MessageBox.hide();
            }
        });

        // Ext.Ajax.request({
        //     url: 'verComprobante',
        //     method: 'POST',
        //     params: {
        //         idComprobante: idComprobante,
        //         arridComprobante: arridComprobante
        //     },
        //     callback: function (options, success, response) {
        //         var responseData = Ext.decode(response.responseText);
        //         window.UCID = window.parent.UCID;
        //         window.dataComprobante = responseData;
        //         window.fechaComp = responseData[0].fechaemision;
        //         window.descripcionCmp = responseData[0].descripcion;
        //         window.detalleCmp = responseData[0].detalle;
        //         window.idCmp = idComprobante;
        //         window.tipoContabilizacion = null;
        //         window.winCmp = new Ext.Window({
        //             // title : "iframe",
        //             width: '100%',
        //             height: '100%',
        //             layout: 'fit',
        //             closable: false,
        //             border: false,
        //             frame: false,
        //             constrain: true,
        //             modal: false,
        //             resizable: false,
        //             items: [{
        //                 xtype: "component",
        //                 autoEl: {
        //                     tag: "iframe",
        //                     style: 'height: 100%; width: 100%; border: none',
        //                     src: "/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/mostrarcomprobante/mostrarcomprobanteExt4"
        //                 }
        //             }]
        //         }).show();
        //         Ext.MessageBox.hide();
        //     }.bind(this)
        // });
    },
    /*
    * Función que se utiliza para eliminar el o los prorrateos seleccionados
    * */
    eliminarProrrateo: function () {
        var arrseleccionados = this.getGridProrrateo().getSelectionModel().getSelection();

        var msgPregunta = (arrseleccionados.length > 1) ? this.idioma.msgPreguntaEliminarProrrateMany : this.idioma.msgPreguntaEliminarProrrateOne;
        mostrarMensaje(2, msgPregunta, function (btn) {
            if (btn == 'ok') {
                var msgEliminando = (arrseleccionados.length > 1) ? this.idioma.msgEliminandoProrrateoMany : this.idioma.msgEliminandoProrrateoOne;
                var myMask = new Ext.LoadMask(Ext.getBody(), {msg: msgEliminando});
                myMask.show();

                var arrids = [];
                arrseleccionados.forEach(function (item, index, AllItems) {
                    arrids.push(item.data.idprorrateo);
                }, this);

                Ext.Ajax.request({
                    scope: this,
                    url: 'delProrrateo',
                    params: {
                        arridprorrateos: Ext.encode(arrids)
                    },
                    callback: function (options, success, response) {
                        myMask.hide();
                        var responseobj = Ext.decode(response.responseText);

                        if (responseobj.code == 1) {
                            var msgSuccessEliminado = (arrseleccionados.length > 1) ? this.idioma.msgSuccessEliminadoProrrateoMany : this.idioma.msgSuccessEliminadoProrrateoOne;
                            mostrarMensaje(1, msgSuccessEliminado);
                            this.getStProrrateoStore().remove(arrseleccionados);
                            this.getStProrrateoStore().commitChanges();
                        }
                    }
                });
            }
        }.bind(this));
    },
    /*
    * Función que se utiliza para adicionar el prorrateo
    * */
    addmodProrrateo: function (action, datos, window, aplicar) {
        var msgMask = (action == 'add') ? this.idioma.msgAdicionandoProrrateo : this.idioma.msgModificandoProrrateo
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: msgMask});
        myMask.show();

        var recordprorrateo = null;
        if (action == 'add') {
            var mdprorrateo = Ext.create('PRT.model.MdProrrateo', {
                idprorrateo: datos.idprorrateo,
                descripcion: datos.descripcion,
                idelementogastotraspaso: datos.idelementogastotraspaso,
                elementogastotraspaso: datos.elementogastotraspaso,
                // idestado: datos.idestado,
                fecha: datos.fecha,
                idcuentaemisor: datos.idcuentaemisor,
                cuentaemisor: datos.cuentaemisor,
                idinductor: datos.idinductor,
                inductor: datos.inductor,
                idorigenBD: datos.idorigenBD,
                nocomprobante: datos.nocomprobante,
                idcomprobante: datos.idcomprobante,
                porcientotraspasar: datos.porcientotraspasar,
                idelementogastoaprorratear: datos.idelementogastoaprorratear,
                elementogastoaprorratear: datos.elementogastoaprorratear,
                idnivelprorrateo: datos.idnivelprorrateo,
                idcuentaanalisis: datos.idcuentaanalisis,
                cuentaanalisis: datos.cuentaanalisis,
                receptores: datos.receptores,
                nomnivelprorrateo: datos.nomnivelprorrateo
            });

            recordprorrateo = mdprorrateo;
            this.getStProrrateoStore().add(recordprorrateo);
        } else {
            //Modificar
            var index = this.getStProrrateoStore().find('idprorrateo', datos.idprorrateo);
            if (index > -1) {
                var recordprorrateo = this.getStProrrateoStore().getAt(index);
                var objmodprorrateo = {
                    idprorrateo: datos.idprorrateo,
                    descripcion: datos.descripcion,
                    idelementogastotraspaso: datos.idelementogastotraspaso,
                    elementogastotraspaso: datos.elementogastotraspaso,
                    // idestado: datos.idestado,
                    fecha: datos.fecha,
                    idcuentaemisor: datos.idcuentaemisor,
                    cuentaemisor: datos.cuentaemisor,
                    idinductor: datos.idinductor,
                    inductor: datos.inductor,
                    idorigenBD: datos.idorigenBD,
                    nocomprobante: datos.nocomprobante,
                    idcomprobante: datos.idcomprobante,
                    porcientotraspasar: datos.porcientotraspasar,
                    idelementogastoaprorratear: datos.idelementogastoaprorratear,
                    elementogastoaprorratear: datos.elementogastoaprorratear,
                    idnivelprorrateo: datos.idnivelprorrateo,
                    idcuentaanalisis: datos.idcuentaanalisis,
                    cuentaanalisis: datos.cuentaanalisis,
                    receptores: datos.receptores,
                    nomnivelprorrateo: datos.nomnivelprorrateo
                };
                recordprorrateo.set(objmodprorrateo);
            }
        }

        this.getStProrrateoStore().sync({
            scope: this,
            callback: function (batch, options) {
                myMask.hide();
                var rawData = batch.proxy.getReader().rawData;
                if (rawData.code == 1) {
                    recordprorrateo.set('idprorrateo', rawData.idprorrateo);
                    recordprorrateo.commit();

                    this.getGridProrrateo().getSelectionModel().select([recordprorrateo]);
                    //this.showDetailProrrateo([recordprorrateo]);

                    var msg = (action == 'add') ? this.idioma.msgSuccessAddProrrateo : this.idioma.msgSuccessModProrrateo;
                    mostrarMensaje(1, msg);
                } else if (rawData.code == 2) {
                    mostrarMensaje(1, this.idioma.msgErrorAddProrrateo);
                } else if (rawData.code == 3) {
                    mostrarMensaje(1, this.idioma.msgErrorAddReceptores);
                }
            }
        });

        //También se puede hacer así, lo que en el modelo en cuestión tiene que estar el proxy configurado
        /*mdprorrateo.save({
            scope: this,
            callback: function (records, operation, success) {
            }
        });*/
    },
    /*
    * Función que se utiliza para adicionar las funcionalidades del action column
    * */
    initActionColumnProrrateo: function (actioncolumn, eOpts) {

        actioncolumn.items[0].scope = this;
        // actioncolumn.items[1].scope = this;
        // actioncolumn.items[2].scope = this;

        //Funcionalidad del Ver comprobante
        actioncolumn.items[0].handler = function (viewgrid, rowIndex, colIndex, item, e, record) {
            viewgrid.getSelectionModel().select(record);
            this.verComprobante();
        };

        // //Funcionalidad del Modificar
        // actioncolumn.items[1].handler = function (viewgrid, rowIndex, colIndex, item, e, record) {
        //     viewgrid.getSelectionModel().select(record);
        // };
        //
        // //Funcionalidad del Eliminar
        // actioncolumn.items[2].handler = function (viewgrid, rowIndex, colIndex, item, e, record) {
        //     grid.getSelectionModel().select(record);
        // };
    },
    /*
    * Función necesaria para validar la cantidad de niveles de prorrateos cargados
    * EL botón de Configurar esta activo siempre
    * */
    validateNivelProrrateo: function (records) {
        var toolbarPanelProrrateo = this.getToolbarPanelProrrateo();
        //Setear la fecha contable del subsistema
        var textfecha = this.idioma.lbFechaContable + this.fechaContableObj.fecha;
        var labelfechacont = toolbarPanelProrrateo.down('label[itemId=labelfechacontable]');
        labelfechacont.show();
        labelfechacont.setText(textfecha);

        if (records.length == 1) {
            //Cargar el primer valor del combo nivel del prorrateo
            this.getComboNivelProrrateo().setValue(records[0].data.idnivelprorrateo);
        } else if (records.length > 0) {
            this.getStProrrateoStore().load();
        } else {
            mostrarMensaje(1, this.idioma.msgNivelesNoLoad);
        }
    },
    /*
    * Función necesaria para cuando se cambie le valor del combo nivel del prorrateo
    * se activen los botones corespondientes
    * */
    changeValueComboNivelProrrateo: function (newValue, oldValue) {
        if (newValue != oldValue) {
            var toolbarPanelProrrateo = this.getToolbarPanelProrrateo();
            toolbarPanelProrrateo.down('button[itemId=btnhojadistribucion]').setDisabled(true);
            toolbarPanelProrrateo.down('button[itemId=btnadicionarprorrateo]').setDisabled(false);
            toolbarPanelProrrateo.down('button[itemId=btnmodificarprorrateo]').setDisabled(true);
            toolbarPanelProrrateo.down('button[itemId=btneliminarprorrateo]').setDisabled(true);
            toolbarPanelProrrateo.down('button[itemId=btnejecutarprorrateo]').setDisabled(true);
            toolbarPanelProrrateo.down('button[itemId=btncancelarprorrateo]').setDisabled(true);
            this.getStProrrateoStore().load({
                scope: this,
                params: {
                    idnivelprorrateo: newValue
                },
                callback: function (records, operation, success) {
                    toolbarPanelProrrateo.down('button[itemId=btnhojadistribucion]').setDisabled(false);
                    if (newValue)
                        toolbarPanelProrrateo.down('button[itemId=btnadicionarprorrateo]').setDisabled(false);
                    toolbarPanelProrrateo.down('button[itemId=btnmodificarprorrateo]').setDisabled(true);
                    toolbarPanelProrrateo.down('button[itemId=btneliminarprorrateo]').setDisabled(true);
                    toolbarPanelProrrateo.down('button[itemId=btnejecutarprorrateo]').setDisabled(true);
                    toolbarPanelProrrateo.down('button[itemId=btncancelarprorrateo]').setDisabled(true);
                }
            });
        }
    }
});