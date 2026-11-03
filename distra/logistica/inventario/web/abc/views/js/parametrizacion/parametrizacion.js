/**
 Uso:Componente para la parametrizacion de los productos

 * ---------------------------------------------

 * 29 de Abril 2020 |   ABC
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
Ext.log.abc.Parametrizacion = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        var _this = this;
        _this.idioma = this.idioma;
        config.dirController = '/logistica/inventario/abc/index.php/parametrizacion';
        config.urlBusquedaGridPrincipal = 'obtenerparametrizacion';
        config.modoSeleccion = 1;
        config.busquedaBasica = true;
        config.formaVisualizacion = 'panel';
        config.gridEditable = true;
        config.roweditor = false;
        config.autoShow = true;
        config.autoLoad = true;
        config.busquedaAvanzada = true;
        config.idioma = {};
        config.baseParams = {idestructura :idestructura, idconf : periodoclasificacion.idconfperiodosclasificacionabc, limit: 30, start: 0};
        Ext.log.abc.Parametrizacion.superclass.constructor.call(this, config);
        _this.textBusquedaSimple = 'Codigo del producto';

    }, 
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: 'Naturaleza',
            width: 80,
            dataIndex: 'lineaproducto',
            default: true,
            hidden: false
        });
        this.addGridColumn({
            header: 'iddeposito',
            width: 80,
            dataIndex: 'iddeposito',
            default: true,
            hidden: true
        });
        this.addGridColumn({
            header: 'C&oacute;digo',
            dataIndex: 'codigo',
            width: 140,
            default: true,
            hidden: false
        });
        this.addGridColumn({
            header: 'Producto',
            width: 300,
            dataIndex: 'producto',
            default: true,
            hidden: false
        });
        this.addGridColumn({
            header: 'Dep&oacute;sito',
            width: 200,
            dataIndex: 'deposito',
            default: true,
            hidden: false
        });

        for(var i = 0; i < parametros.length; i++) {
            for (var j = 0; j < parametros[i].parametros.length; j++) {
                var toolT = "";
                if(parametros[i].parametros[j].formacalculo == 1){
                    toolT = parametros[i].parametros[j].denominacion + "<br><b>"+ parametros[i].parametros[j].formulavalorsistema+"</b>";
                }else if(parametros[i].parametros[j].formacalculo == 2){
                    toolT = parametros[i].parametros[j].denominacion + "<br><b>Definido por el usuario = "+ parametros[i].parametros[j].formulavalorsistema+"</b>";
                }else {
                    toolT = parametros[i].parametros[j].denominacion + " - Obtenido del sistema";
                }
                this.addGridColumn({
                    header: parametros[i].parametros[j].abreviatura,
                    width: 60,
                    dataIndex: 'p-' + parametros[i].parametros[j].idparametrosinventario,
                    default: false,
                    hideable: true,
                    align: 'center',
                    hidden: false,
                    tooltip: toolT,
                    renderer: function (val) {
                        return '<p style="text-align:right">'+val+'</p>';
                    }
                });
            }
        }
        this.addGridPlugin(chgParametros);

    },
    initDefaultButtons: function () {
        var self = this;
        this.addToolbarButton("Per&iacute;odo de clasificaci&oacute;n: ");

        this.addToolbarButton("<a href='#' onclick=mostrarTipNaturalezas()><b>"+periodoclasificacion.periodo+"</b></a>");

        this.addToolbarButton(" ");
        this.addToolbarButton("-");
        this.addToolbarButton("Dep&oacute;sitos a parametrizar: ");

        var stDepositosParametrizacion = new Ext.data.SimpleStore({
            fields :[
                {name: 'iddeposito'},
                {name: 'deposito'},
            ]
        });
        stDepositosParametrizacion.loadData(depositosparametrizacion);

        cbDepositosParametrizacion = new LOG.util.ComboBox({
            editable: true,
            hiddenName: 'iddeposito',
            valueField: 'iddeposito',
            displayField: 'deposito',
            hideTrigger: false,
            readOnly: false,
            triggerAction: 'all',
            enableQtip: true,
            emptyText: 'Seleccione...',
            minChars: 0,
            mode: 'local',
            store: stDepositosParametrizacion
        });

        this.addToolbarButton(cbDepositosParametrizacion);

        this.addToolbarButton(new Ext.Button({
                id: 'btnMovimientosDeposito',
                iconCls: 'detalles',
                text: 'Movimientos del dep&oacute;sito',
                tooltip: 'Movimientos del dep&oacute;sito a parametrizar',
                handler: function () {
                    if(cbDepositosParametrizacion.getValue() != '') {
                        var md = new Ext.log.abc.MovimientosDepositos({
                            idconf: periodoclasificacion.idconfperiodosclasificacionabc,
                            fechainicio: periodoclasificacion.fechainicio,
                            fechafin: periodoclasificacion.fechafin,
                            idestructura: idestructura,
                            iddeposito: cbDepositosParametrizacion.getValue()
                        });
                        md.show();

                    }else{
                        mostrarMensaje(3, 'Debe seleccionar un dep&oacute;sito a parametrizar.');
                    }

                }

            })
        );

        this.addToolbarButton(" ");
        this.addToolbarButton("-");
        this.addToolbarButton(new Ext.Button({
                id: 'btnParametrizarProductos',
                iconCls: 'parametros',
                text: 'Parametrizar productos',
                tooltip: 'Parametrizar productos',
                handler: function () {
                    if (periodoclasificacion.cerrado != 1) {
                        if (cbDepositosParametrizacion.getValue() != '') {
                            var mensaje = "¿Desea realizar la parametrizaci&oacute;n de los productos en el dep&oacute;sito: " + cbDepositosParametrizacion.getRawValue() + "?";
                            mostrarMensaje(2, mensaje, function (btn) {
                                if (btn == 'ok') {
                                    var mascara = new Ext.LoadMask(Ext.getBody(), {
                                        msg: 'Calculando la parametrizaci&oacute;n. Por favor espere...'
                                    });
                                    mascara.show();

                                    Ext.Ajax.request({
                                        url: 'calcularParametrizacion',
                                        method: 'POST',
                                        timeout: 300000,
                                        params: {
                                            idconf: periodoclasificacion.idconfperiodosclasificacionabc,
                                            fechainicio: periodoclasificacion.fechainicio,
                                            fechafin: periodoclasificacion.fechafin,
                                            idestructura: idestructura,
                                            iddeposito: cbDepositosParametrizacion.getValue()
                                        },
                                        callback: function (options, success, response) {
                                            mascara.hide();
                                            var obj = Ext.decode(response.responseText);
                                            if (obj.codigo == 1) {
                                                mostrarMensaje(1, 'Los productos han sido parametrizados satisfactoriamente.');
                                                self.storePrincipal.initBaseParams.idestructura = idestructura;
                                                self.storePrincipal.initBaseParams.idconf = periodoclasificacion.idconfperiodosclasificacionabc;
                                                self.reiniciarBusqueda({
                                                    params: {
                                                        idestructura: idestructura,
                                                        idconf: periodoclasificacion.idconfperiodosclasificacionabc,
                                                        limit: 30,
                                                        start: 0
                                                    }
                                                });
                                            } else {
                                                mostrarMensaje(3, obj.mensaje);
                                            }
                                        }.createDelegate(this)
                                    });
                                }
                            });
                        } else {
                            mostrarMensaje(3, 'Debe seleccionar un dep&oacute;sito a parametrizar.');
                        }

                    }else {
                        mostrarMensaje(3, 'El per&iacute;odo a analizar se encuentra cerrado.');
                    }
                }

            })
        );
        this.addToolbarButton(" ");
        this.addToolbarButton("-");

        this.addToolbarButton("-");
        this.addToolbarButton(new Ext.Button({
            //id: 'btnImprimirParametrizacion',
            iconCls: 'imprimir',
            text: 'Imprimir',
            tooltip: 'Imprimir',
            handler: function () {
               var params = Ext.apply(self.getGridPrincipal().getStore().baseParams, {idestructuras: idestructura,});
                                   
                    this.tipoReportes = new LOG.util.Report({
                        reports: [
                            {
                                dirReport: '/distra/logistica/inventario/abc/parametrizacionabc/parametrizacionabclistado',
                                isList:true,
                                params: params
                            }
                        ]
                    });
                    this.tipoReportes.view();
            }
          
        }) 
            ); 
        this.addToolbarButton("->");
        self.addToolbarButton(estructura);


        
    //     this.addToolbarButton(estructura);
    //     this.addToolbarButton("-");
    //     this.addToolbarButton("->");
        
    },
    view:function() {
        var _this = this;
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
        fpDatosBusqueda.addComponent(cbNaturalezas);

        var stDepositosParametrizacionB = new Ext.data.SimpleStore({
            fields :[
                {name: 'iddeposito'},
                {name: 'deposito'},
            ]
        });
        stDepositosParametrizacionB.loadData(depositosparametrizacion);

        cbDepositosParametrizacionB = new LOG.util.ComboBox({
            fieldLabel: 'Dep&oacute;sitos',
            editable: true,
            hiddenName: 'iddeposito',
            valueField: 'iddeposito',
            displayField: 'deposito',
            hideTrigger: false,
            readOnly: false,
            triggerAction: 'all',
            enableQtip: true,
            emptyText: 'Seleccione...',
            minChars: 0,
            mode: 'local',
            store: stDepositosParametrizacionB
        });

        fpDatosBusqueda.addComponent(cbDepositosParametrizacionB);

      

        var cbClasificacion = new LOG.util.ComboBox({
            fieldLabel: 'Clasificaci&oacute;n ABC',
            editable: true,
            url: '/logistica/inventario/abc/index.php/clasificacionabc/obtenernomclasificacionabc',
            hiddenName: 'idclasificacionabc',
            valueField: 'idclasificacionabc',
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
       // cbClasificacion.store.baseParams.idconf = periodoclasificacion.idconfperiodosclasificacionabc;
        fpDatosBusqueda.addComponent(cbClasificacion);
        fpDatosBusqueda.getColumn(0).columnWidth = 1;
        fpDatosBusqueda.getColumn(0).getComponent(0).anchor = '99%';


        this.addFilterComponent(fpDatosBusqueda);

        return Ext.log.abc.Parametrizacion.superclass.view.call(this);
    }
    
});


Ext.log.abc.ParametrizacionBase = {

    init: function (idioma, perfil) {
        var _this = this;
        this.p = new Ext.log.abc.Parametrizacion({});

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
var depositosparametrizacion = new Array();
var arrParametros = new Array();
var cbDepositosParametrizacion = null;
arrParametros.push({header: ' ', align: 'center', colspan: 6});

var chgParametros = new Ext.ux.grid.ColumnHeaderGroup({rows: [arrParametros]});
Ext.onReady(function() {
    UCID.portal.cargarEtiquetas('parametrizacion', function (perfil, idioma) {
        perfil = arguments[0];
        idioma = arguments[1];
        var mascara = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Cargando...'
        });
        mascara.show();
        Ext.Ajax.request({
            url: 'obtenerPeriodoAnalizaryParametros',
            method: 'POST',
            timeout: 300000,
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
                    for(var i = 0; i < obj.depositosparametrizacion.length; i++){
                        depositosparametrizacion.push([obj.depositosparametrizacion[i].iddeposito, obj.depositosparametrizacion[i].codigo+" "+obj.depositosparametrizacion[i].deposito]);
                    }

                    if(periodoclasificacion.length <= 0){
                        mostrarMensaje(3, 'No existe un per&iacute;odo de clasificaci&oacute;n a analizar.');
                        return;
                    }

                    for(var i = 0; i < parametros.length; i++){
                        arrParametros.push({header: parametros[i].tipoparametrosinventario, align: 'center', colspan: parametros[i].parametros.length});
                    }

                    var interfaz = Ext.log.abc.ParametrizacionBase;
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


