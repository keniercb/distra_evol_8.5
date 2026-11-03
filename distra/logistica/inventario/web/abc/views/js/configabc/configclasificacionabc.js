/**
 Uso:Componente para la configuracion de la clasificacion ABC.

 * ---------------------------------------------

 * 23 de Marzo 2020 |   ABC
 *

 * @extends Ext.Panel
 * @xtype
 * @autor   Centro Logistica - Ing. Yadir Martinez Vergara
 * @version 1.0.0
 */
Ext.ns('Ext.log.abc.config');
Ext.QuickTips.init();

Ext.log.abc.config.ClasificacionABC = Ext.extend(Ext.Panel, {
    id: 'ConfiguracionABC-1',
    title: 'Clasificaci&oacute;n ABC',
    region: (this.region ? this.region : 'center'),
    layout: (this.layout ? this.layout : 'fit'),
    frame: false,
    border: false,
    perfil: this.perfil,
    closable: true,
    initComponent: function () {
        let self = this;
        this.nfvalorinferior = new Ext.form.NumberField({
            allowBlank: false,
            anchor: '100%',
            allowDecimals: false,
            allowNegative: false,
            maxValue: 100,
            minValue: 0,
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.'
        });

        this.nfvalorinferiorpeso = new Ext.form.NumberField({
            allowBlank: false,
            anchor: '100%',
            allowDecimals: true,
            allowNegative: false,
            maxValue: 1,
            minValue: 0,
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.'
        });

        this.nfvalorsuperior = new Ext.form.NumberField({
            allowBlank: false,
            anchor: '100%',
            allowDecimals: false,
            allowNegative: false,
            maxValue: 100,
            minValue: 0,
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.'
        });

        this.nfvalorsuperiorpeso = new Ext.form.NumberField({
            allowBlank: false,
            anchor: '100%',
            allowDecimals: true,
            allowNegative: false,
            maxValue: 1,
            minValue: 0,
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.'
        });

        this.btnGuardar = new Ext.Button({
            id: 'btnGuardarConfigABC',
            //icon : this.perfil.dirImg + 'guardar.png',
            iconCls: 'guardar',
            text: 'Guardar',
            tooltip: 'Guardar clasificaci&oacute;n',
            handler: function () {
                var r = self.stClasificacionABC.getModifiedRecords();
                if (r.length > 0) {
                    var arrModificados = new Array();
                    for(var i = 0; i < r.length; i++){
                        arrModificados.push(
                            {
                                idclasificacionabc: r[i].data.idclasificacionabc,
                                limiteinferior: r[i].data.limiteinferior,
                                limitesuperior: r[i].data.limitesuperior,
                                limiteinferiorpeso: r[i].data.limiteinferiorpeso,
                                limitesuperiorpeso: r[i].data.limitesuperiorpeso
                            }
                        );
                    }
                    self.mascara = new Ext.LoadMask(self.el, {
                        msg: "Guardando datos..."
                    });
                    self.mascara.show();
                    Ext.Ajax.request({
                        url: '/logistica/inventario/abc/index.php/configabc/salvarConfiguracion',
                        method: 'POST',
                        params: {
                            tipo: 1,
                            datos: Ext.encode(arrModificados)
                        },
                        callback: function (options, success, response) {
                            self.mascara.hide();
                            var respuesta = Ext.decode(response.responseText);
                            if(respuesta.codigo == true){
                                self.stClasificacionABC.commitChanges();
                                mostrarMensaje(1,'Las datos se han guardado satisfactoriamente.');
                            }


                        }.createDelegate(this)
                    });
                } else {
                    return;
                }
            }.createDelegate(this)

        })
        ;

        this.cmClasificacionABC = new Ext.grid.ColumnModel([
            {
                header: "idclasificacionabc",
                dataIndex: 'idclasificacionabc',
                hidden: true,
                hideable: false,
                width: 50
            }, {
                header: "Denominaci&oacute;n",
                dataIndex: 'denominacion',
                width: 200
            }, {
                header: "Límite inferior",
                dataIndex: 'limiteinferior',
                width: 100,
                editor: this.nfvalorinferior
            }, {
                header: "Límite superior",
                dataIndex: 'limitesuperior',
                width: 100,
                editor: this.nfvalorsuperior
            }, {
                header: "Intervalo inferior del peso",
                dataIndex: 'limiteinferiorpeso',
                width: 150,
                editor: this.nfvalorinferiorpeso
            }, {
                header: "Intervalo superior del peso",
                dataIndex: 'limitesuperiorpeso',
                width: 150,
                editor: this.nfvalorsuperiorpeso
            }
        ]);

        this.stClasificacionABC = new Ext.data.Store({
            url: '/logistica/inventario/abc/index.php/configabc/obtenerClasificacionABC',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idclasificacionabc"},
                [
                    {name: 'idclasificacionabc'},
                    {name: 'denominacion'},
                    {name: 'limiteinferior'},
                    {name: 'limitesuperior'},
                    {name: 'limiteinferiorpeso'},
                    {name: 'limitesuperiorpeso'}
                ])
        });

        this.egpClasificacionABC = new Ext.grid.EditorGridPanel({
            layout: 'fit',
            store: this.stClasificacionABC,
            autoScroll: true,
            stripeRows: true,
            cm: this.cmClasificacionABC,
            width: 350,
            height: 250,
            border: false,
            hideBorders: true,
            loadMask: {msg: 'Cargando...'}
        });

        this.stClasificacionABC.load();

        this.tbar = [this.btnGuardar];

        this.items = [this.egpClasificacionABC];
        Ext.log.abc.config.ClasificacionABC.superclass.initComponent.call(this);

    }
});
