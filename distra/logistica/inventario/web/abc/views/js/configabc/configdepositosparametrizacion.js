/**
 Uso:Componente para la configuracion de los depositos a parametrizar.

 * ---------------------------------------------

 * 8 de Enero 2021 |   ABC
 *

 * @extends Ext.Panel
 * @xtype
 * @autor   Centro Logistica - Ing. Yadir Martinez Vergara
 * @version 1.0.0
 */
Ext.ns('Ext.log.abc.config');
Ext.QuickTips.init();

Ext.log.abc.config.DepositosParametrizar = Ext.extend(Ext.Panel, {
    id: 'DepositosParametrizar-5',
    title: 'Dep&oacute;sitos a parametrizar',
    region: (this.region ? this.region : 'center'),
    layout: (this.layout ? this.layout : 'fit'),
    frame: false,
    border: false,
    perfil: this.perfil,
    idioma: this.idioma,
    closable: true,
    initComponent: function () {
        var self = this;
        var seleccion = null;


        this.btnGuardarDepositos = new Ext.Button({
            id: 'btnGuardarDepositos',
            iconCls: 'guardar',
            text: 'Guardar',
            tooltip: 'Guardar los dep&oacute;sitos a parametrizar',
            handler: function () {
                var arrDep = self.smchbDepositos.getSelections();

                if (arrDep.length > 0) {
                    var arrDepositos = new Array();
                    for(var i = 0; i < arrDep.length; i++){
                        arrDepositos.push(arrDep[i].data);
                    }
                    Ext.Ajax.request({
                        url: 'salvarConfiguracion',
                        method: 'POST',
                        params: {tipo: 5, datos: Ext.encode(arrDepositos)},
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, 'Los dep&oacute;sitos a parametrizar han sido guardados satisfactoriamente.');
                                self.stPeriodos.removeAll();
                                self.stPeriodos.load();
                            } else {
                                mostrarMensaje(3, responseData.mensaje);
                            }
                        }
                    });
                } else {
                    mostrarMensaje(3,'Debe seleccionar al menos un dep&oacute;sito.');
                }
            }

        });

        this.smchbDepositos = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.stDepositos = new Ext.data.GroupingStore({
            url: 'cargardepositospi',
            groupField:'ueb',
            sortInfo:{field: 'ueb', direction: "ASC"},
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "iddeposito"},
                [
                    {name: 'iddeposito'},
                    {name: 'deposito'},
                    {name: 'idueb'},
                    {name: 'ueb'},
                    {name: 'marcado'}
                ])
        });

        this.stDepositos.load({callback : function(r,o,s){
            var a = new Array();
            for(var i = 0; i < r.length; i++){
                    if(r[i].data.marcado == 1){
                        a.push(r[i]);
                    }
                }
                self.smchbDepositos.selectRecords(a, true);
            }
        });

        this.tfBuscarDepositos = new Ext.form.TextField({
            maxLength: 255,
            minLength: 2
        });

        this.btnBuscarDeposito = new Ext.Button({
            id: 'btnBuscarDepositoParametrizar',
            iconCls: 'buscar',
            handler: function () {
                if(this.tfBuscarDepositos.isValid()){
                    if(this.tfBuscarDepositos.getValue() == ''){
                        this.stDepositos.clearFilter();
                    }else{
                        this.stDepositos.filter('deposito', this.tfBuscarDepositos.getValue());
                    }

                }
            }.createDelegate(this)

        });

        this.btnLimpiarDeposito = new Ext.Button({
            id: 'btnLimpiarDeposito',
            iconCls: 'limpiar',
            handler: function () {
                this.stDepositos.clearFilter();
            }.createDelegate(this)

        });

        this.gpDepositos = new Ext.grid.GridPanel({
            id: 'gpDepositos'+self.id,
            layout: 'fit',
            height: 300,
            anchor: '98%',
            title: self.idioma.lbDepositos,
            region: 'center',
            columns: [self.smchbDepositos, {
                header: 'iddeposito',
                hidden: true,
                hideable: false,
                dataIndex: 'iddeposito'
            }
            , {header: 'Dep&oacute;sito', width: 150, sortable: true, dataIndex: 'deposito'}
            , {header: 'UEB', width: 150, sortable: true, dataIndex: 'ueb',hidden: true, hideable: false}
            , {header: 'idueb', width: 50, sortable: true, dataIndex: 'idueb',hidden: true, hideable: false}
            ],
            stripeRows: true,
            autoScroll: true,
            border: true,
            hideBorders: false,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit    : true,
                groupTextTpl: '{text}'
            }),
            store: this.stDepositos,
            sm: self.smchbDepositos,
            loadMask: {msg: self.idioma.lbCargando},
            tbar: [this.tfBuscarDepositos, '', this.btnBuscarDeposito, this.btnLimpiarDeposito]
        });



        this.tbar = [this.btnGuardarDepositos];

        this.items = [this.gpDepositos];
        Ext.log.abc.config.DepositosParametrizar.superclass.initComponent.call(this);
    }
});
