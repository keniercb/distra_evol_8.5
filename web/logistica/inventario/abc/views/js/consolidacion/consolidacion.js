/**
 Uso:Componente para la consolidacion de los productos parametrizados en cada agencia

 * ---------------------------------------------

 * 5 de mayo de 2020 |   ABC
 *

 * @extends Ext.Panel
 * @xtype
 * @autor   Centro Logistica - Ing. Yadir Martinez Vergara
 * @version 1.0.0
 */

Ext.ns('Ext.log.abc');
Ext.QuickTips.init();
mostrarTipNaturalezas = function(){
    Ext.MessageBox.buttonText.ok = "Aceptar";
    Ext.Msg.show
    ({
        title:'Informaci&oacute;n',
        buttons: Ext.Msg.OK,
        msg: 'Naturalezas: ' + periodoclasificacion.naturalezas
    });
}
Ext.log.abc.Consolidacion = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        var _this = this;
        _this.idioma = this.idioma;
        config.dirController = '/logistica/inventario/abc/index.php/consolidacion';
        config.urlBusquedaGridPrincipal = 'obtenerconsolidacion';
        config.modoSeleccion = 1;
        config.bbarVisible = false;
        config.busquedaBasica = true;
        config.formaVisualizacion = 'panel';
        config.gridEditable = true;
        config.roweditor = false;
        config.autoShow = true;
        config.autoLoad = true;
        config.busquedaAvanzada = true;
        config.idioma = {};
        config.baseParams = {idestructura :idestructura, idconf : periodoclasificacion.idconfperiodosclasificacionabc};
        Ext.log.abc.Consolidacion.superclass.constructor.call(this, config);
        _this.textBusquedaSimple = 'Codigo del producto';

    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: 'Naturaleza',
            sortable : false,
            width: 80,
            dataIndex: 'lineaproducto',
            default: true,
            hidden: false
        });
        this.addGridColumn({
            header: 'C&oacute;digo',
            dataIndex: 'codigo',
            sortable : false,
            width: 140,
            default: true,
            hidden: false
        });
        this.addGridColumn({
            header: 'Producto',
            sortable : false,
            width: 300,
            dataIndex: 'producto',
            default: true,
            hidden: false
        });

        this.addGridColumn({
            header: 'Planificado',
            sortable : false,
            width: 100,
            dataIndex: 'presupuestoplanificado',
            default: true,
            align: 'center',
            hidden: false
        });

        this.addGridColumn({
            header: 'Real',
            sortable : false,
            width: 100,
            dataIndex: 'presupuestoreal',
            default: true,
            align: 'center',
            hidden: false,
            renderer: function (val) {
                if(val <= 0){
                    return '<span style="color: red">'+val+'</span>';
                }else{
                    return val;
                }
            }
        });


        for(var i = 0; i < parametros.length; i++) {
            var toolT = "";
            if(parametros[i].formacalculo == 1){
                toolT = parametros[i].denominacion + "<br><b>"+ parametros[i].formulavalorsistema+"</b>";
            }else if(parametros[i].formacalculo == 2){
                toolT = parametros[i].denominacion + "<br><b>Definido por el usuario = "+ parametros[i].formulavalorsistema+"</b>";
            }else {
                toolT = parametros[i].denominacion + " - Obtenido del sistema";
            }
            this.addGridColumn({
                header: parametros[i].abreviatura,
                width: 80,
                dataIndex: 'p-' + parametros[i].idparametrosinventario,
                default: false,
                hideable: true,
                sortable : false,
                align: 'center',
                hidden: false,
                tooltip: toolT
            });

        }
        this.addGridPlugin(chgParametros);
       // this.addGridPlugin(summary);

    },
    initDefaultButtons: function () {
        var self = this;
        this.addToolbarButton("Per&iacute;odo de clasificaci&oacute;n: ");

        this.addToolbarButton("<a href='#' onclick=mostrarTipNaturalezas()><b>"+periodoclasificacion.periodo+"</b></a>");

        this.addToolbarButton(" ");
        this.addToolbarButton("-");

        this.addToolbarButton(new Ext.Button({
                id: 'btnConsolidar',
                iconCls: 'desagrupar',
                text: 'Consolidar parametrizaci&oacute;n',
                tooltip: 'Consolidar parametrizaci&oacute;n de productos',
                handler: function () {
                    mostrarMensaje(2, '¿Desea realizar la consolidaci&oacute;n de las par&aacute;metros de los productos del per&iacute;odo seleccionado?', function(btn) {
                        if (btn == 'ok') {
                            var mascara = new Ext.LoadMask(Ext.getBody(), {
                                msg: 'Consolidando par&aacute;metros. Por favor espere...'
                            });
                            mascara.show();
                            Ext.Ajax.request({
                                url: 'consolidarParametrizacion',
                                method: 'POST',
                                timeout: 3000000,
                                params: {
                                    idconf: periodoclasificacion.idconfperiodosclasificacionabc
                                },
                                callback: function (options, success, response) {
                                    mascara.hide();
                                    var obj = Ext.decode(response.responseText);
                                    self.storePrincipal.initBaseParams.idestructura = idestructura;
                                    self.storePrincipal.initBaseParams.idconf = periodoclasificacion.idconfperiodosclasificacionabc;
                                    var nf = self.panelBotones.getTopToolbar().items.items[10];
                                    if (obj.codigo == 1) {
                                        mostrarMensaje(1, 'La consolidaci&oacute;n han sido realizada satisfactoriamente.');
                                        nf.setValue(obj.presupuesto);
                                        self.reiniciarBusqueda({params:{idestructura: idestructura, idconf: periodoclasificacion.idconfperiodosclasificacionabc}});
                                    }else if (obj.codigo == 2) {
                                        mostrarMensaje(1, obj.mensaje);
                                        nf.setValue(obj.presupuesto);
                                        self.reiniciarBusqueda({params:{idestructura: idestructura, idconf: periodoclasificacion.idconfperiodosclasificacionabc}});
                                    }  else {
                                        mostrarMensaje(3, obj.mensaje);
                                    }
                                }.createDelegate(this)
                            });
                        }
                    });

                }

            })
        );

        this.addToolbarButton('');
        this.addToolbarButton("-");
        this.addToolbarButton('');
        this.addToolbarButton("Presupuesto: ");
        this.addToolbarButton(new Ext.form.NumberField({
            id:'nfPresupuesto',
            allowBlank: true,
            width: 100,
            allowDecimals: true,
            allowNegative: false,
            maxValue: 999999999,
            minValue: 0,
            readOnly: true,
            value: periodoclasificacion.presupuesto,
            decimalPrecision: 2,
            emptyText: 'Presupuesto...',
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.'
        }));

        this.addToolbarButton(new Ext.Button({
                id: 'btnRecalcularPresupuesto',
                iconCls: 'calcular',
                text: 'Recalcular presupuesto',
                tooltip: 'Recalcular presupuesto de productos',
                handler: function () {
                    var nf = self.panelBotones.getTopToolbar().items.items[10];
                    var objRP = new Ext.log.abc.RecalcularPresupuesto({
                        idconf: periodoclasificacion.idconfperiodosclasificacionabc,
                        presupuesto: nf.getValue()
                    });
                    objRP.show();
                    objRP.on('recalcular', function (obj) {
                        if(obj.codigo == 1){
                            self.storePrincipal.initBaseParams.idestructura = idestructura;
                            self.storePrincipal.initBaseParams.idconf = periodoclasificacion.idconfperiodosclasificacionabc;
                            self.reiniciarBusqueda({params:{idestructura: idestructura, idconf: periodoclasificacion.idconfperiodosclasificacionabc}});
                            nf.setValue(obj.presupuesto);
                        }else{
                            mostrarMensaje(3, obj.mensaje);
                        }

                    });
                }

            })
        );


        this.addToolbarButton("-");

        this.addToolbarButton(new Ext.Button({
                id: 'btnReparametrizarInventarios',
                iconCls: 'cerrar',
                text: 'Reparametrizar y cerrar',
                tooltip: 'Reparametrizar inventarios de productos y cerrar el per&iacute;odo',
                handler: function () {
                    mostrarMensaje(2, 'Est&aacute; seguro que desea reparametrizar los inventarios de productos y cerrar el per&iacute;odo a analizar?', function(b){
                        if(b == "ok"){
                            Ext.Ajax.request({
                                url: 'reparametrizarycerrar',
                                method: 'POST',
                                timeout: 3000000,
                                params: {
                                    idconf: periodoclasificacion.idconfperiodosclasificacionabc,
                                    idestructura: idestructura
                                },
                                callback: function (options, success, response) {

                                    var obj = Ext.decode(response.responseText);
                                    self.storePrincipal.initBaseParams.idestructura = idestructura;
                                    self.storePrincipal.initBaseParams.idconf = periodoclasificacion.idconfperiodosclasificacionabc;
                                    if (obj.codigo == 1) {
                                        mostrarMensaje(1, 'La reparametrizaci&oacute;n ha sido realizada satisfactoriamente y el per&iacute;odo a sido cerrado.');
                                        self.reiniciarBusqueda({params:{idestructura: idestructura, idconf: periodoclasificacion.idconfperiodosclasificacionabc}});
                                    }else {
                                        mostrarMensaje(3, obj.mensaje);
                                    }
                                }.createDelegate(this)
                            });
                        }
                    });
                }

            })
        );


        this.addToolbarButton("-");
        this.addToolbarButton("->");
        self.addToolbarButton(estructura);
    },
    view:function() {
        this.getPanelBusqueda().setColumns(1);
        var fpDatosBusqueda = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        var cbNaturalezas = new LOG.util.ComboBox({
            fieldLabel: 'Naturaleza',
            editable: true,
            url: '/logistica/inventario/abc/index.php/clasificacionabc/obtenerlineasproducto',
            hiddenName: 'idlineaproducto',
            valueField: 'idlineaproducto',
            displayField: 'lineaproducto',
            loadingText: 'Cargando...',
            hideTrigger: false,
            readOnly: false,
            triggerAction: 'all',
            enableQtip: true,
            pageSize: 10,
            emptyText: 'Seleccione...',
            minChars: 0,
            mode: 'local'
        });
        cbNaturalezas.store.baseParams.idconf = periodoclasificacion.idconfperiodosclasificacionabc;

        var cbCentrosLogisticos = new LOG.util.ComboBox({
            fieldLabel: 'Centros log&iacute;sticos',
            editable: true,
            url: '/logistica/inventario/abc/index.php/consolidacion/obtenercentroslogisticos',
            hiddenName: 'idcentrologistico',
            valueField: 'idcentrologistico',
            displayField: 'denominacion',
            loadingText: 'Cargando...',
            hideTrigger: false,
            readOnly: false,
            triggerAction: 'all',
            enableQtip: true,
            pageSize: 10,
            emptyText: 'Seleccione...',
            minChars: 0,
            mode: 'local'
        });


        fpDatosBusqueda.addComponent(cbNaturalezas);
        fpDatosBusqueda.addComponent(cbCentrosLogisticos);



         fpDatosBusqueda.getColumn(0).columnWidth = 1;
        fpDatosBusqueda.getColumn(0).getComponent(0).anchor = '99%';


        this.addFilterComponent(fpDatosBusqueda);

        return Ext.log.abc.Consolidacion.superclass.view.call(this);
    }
});


Ext.log.abc.ConsolidacionBase = {

    init: function (idioma, perfil) {
        var _this = this;
        this.p = new Ext.log.abc.Consolidacion({});
        this.p.init();

        this.vista = this.p.view();

        this.vp =  new Ext.Viewport({
            layout: 'border',
            items: [this.vista]
        });
    }
};
var estructura = null;
var idestructura = null;
var tipoestructura = null;
var periodoclasificacion = null;
var parametros = null;
var arrParametros = new Array();
arrParametros.push({header: ' ', align: 'center', colspan: 4});

var chgParametros = new Ext.ux.grid.ColumnHeaderGroup({rows: [arrParametros]});

Ext.onReady(function() {
    UCID.portal.cargarEtiquetas('consolidacion', function (perfil, idioma) {
        perfil = arguments[0];
        idioma = arguments[1];
        var mascara = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Cargando...'
        });
        mascara.show();
        Ext.Ajax.request({
            url: 'obtenerPeriodoAnalizaryParametros',
            method: 'POST',
            timeout: 3000000,
            params: {
            },
            callback: function (options, success, response) {
                mascara.hide();
                var obj = Ext.decode(response.responseText);
                if(obj.codigo == 1){
                    tipoestructura = obj.tipo;
                    estructura = obj.estructura;
                    idestructura = obj.idestructura;
                    periodoclasificacion = obj.periodo;
                    parametros = obj.parametros;

                    if(periodoclasificacion.length <= 0){
                        mostrarMensaje(3, 'No existe un per&iacute;odo de clasificaci&oacute;n a analizar.');
                        return;
                    }

                    arrParametros.push({header: 'Presupuesto', align: 'center', colspan: 2});
                    arrParametros.push({header: 'Par&aacute;metros', align: 'center', colspan: parametros.length});

                    var interfaz = Ext.log.abc.ConsolidacionBase;
                    interfaz.init(idioma, perfil);
                }else{
                    Ext.MessageBox.buttonText.ok = "Aceptar";
                    Ext.Msg.show
                    ({
                        title:'Informaci&oacute;n',
                        buttons: Ext.Msg.OK,
                        msg: obj.mensaje
                    });
                    mostrarMensaje(3, obj.mensaje);
                }
            }
        });

    });
},true);


