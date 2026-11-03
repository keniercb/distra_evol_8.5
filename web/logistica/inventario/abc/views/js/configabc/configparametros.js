/**
 Uso:Componente para la configuracion de los parametros para el calculo de la demanda de importacion.

 * ---------------------------------------------

 * 24 de Abril 2020 |   ABC
 *

 * @extends Ext.Panel
 * @xtype
 * @autor   Centro Logistica - Ing. Yadir Martinez Vergara
 * @version 1.0.0
 */
Ext.ns('Ext.log.abc.config');
Ext.QuickTips.init();

Ext.log.abc.config.Parametros = Ext.extend(Ext.Panel, {
    id: 'Parametros-1',
    title: 'Par&aacute;metros de reaprovisionamiento',
    region: (this.region ? this.region : 'center'),
    layout: (this.layout ? this.layout : 'fit'),
    frame: false,
    border: false,
    perfil: this.perfil,
    closable: true,
    initComponent: function () {
        var self = this;
        var arrFormaCalculo = new Array();
        arrFormaCalculo.push('Formula');
        arrFormaCalculo.push('Definida por el usuario');
        arrFormaCalculo.push('Obtenida del sistema');

        this.nfvalor = new Ext.form.NumberField({
            allowBlank: false,
            anchor: '100%',
            allowDecimals: true,
            allowNegative: false,
            maxValue: 1000,
            minValue: 0,
            decimalPrecision: 4,
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.'
        });
        this.nfLugaresdecimales = new Ext.form.NumberField({
            allowBlank: false,
            anchor: '100%',
            allowDecimals: false,
            allowNegative: false,
            maxValue: 10,
            minValue: 0,
            //decimalPrecision: 4,
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.'
        });

        this.cbPorcentual = new Ext.form.ComboBox({
            valueField: 'id',
            displayField: 'denominacion',
            hiddenName: 'id',
            allowBlank: false,
            mode: 'local',
            anchor: '100%',
            store: new Ext.data.SimpleStore({
                fields:['id','denominacion'],
                data: [[0,'No'],[1,'Si']]
            }),
            blankText: 'Este campo es obligatorio',
            readOnly: false,
            triggerAction: 'all'
        })

        this.btnGuardar = new Ext.Button({
            id: 'btnGuardarParametros',
            iconCls: 'guardar',
            text: 'Guardar',
            tooltip: 'Guardar configuraci&oacute;n de los par&aacute;metros',
            handler: function () {
                var arrDatos = new Array();
                this.stParametros.each(function(r){
                    if(r.data.formacalculo != 3) {
                        var d = {
                            idconfparametrosinventario: r.data.idconfparametrosinventario,
                            idformulaovalorsistema: r.data.idformulaovalorsistema,
                            formulavalorsistema: r.data.formulavalorsistema,
                            formulacalcular: r.data.formulacalcular,
                            formacalculo: r.data.formacalculo,
                            porcentual: r.data.porcentual,
                            lugaresdecimales: r.data.lugaresdecimales
                        }
                        arrDatos.push(d);
                    }
                }.createDelegate(this));

                if (arrDatos.length > 0) {
                    self.mascara = new Ext.LoadMask(self.el, {
                        msg: "Guardando datos..."
                    });
                    self.mascara.show();
                    Ext.Ajax.request({
                        url: '/logistica/inventario/abc/index.php/configabc/salvarConfiguracion',
                        method: 'POST',
                        params: {
                            tipo: 4,
                            datos: Ext.encode(arrDatos)
                        },
                        callback: function (options, success, response) {
                            self.mascara.hide();
                            var respuesta = Ext.decode(response.responseText);
                            if(respuesta.codigo == 1){
                                self.stParametros.commitChanges();
                                mostrarMensaje(1,'Las datos se han guardado satisfactoriamente.');
                            }else{
                                mostrarMensaje(3,respuesta.mensaje);
                                return;
                            }
                        }.createDelegate(this)
                    });
                } else {
                    return;
                }
            }.createDelegate(this)

        })
        ;

        this.cmParametros = new Ext.grid.ColumnModel([
            {
                header: "idconfparametrosinventario",
                dataIndex: 'idconfparametrosinventario',
                hidden: true,
                hideable: false,
                width: 50
            },{
                header: "idparametrosinventario",
                dataIndex: 'idparametrosinventario',
                hidden: true,
                hideable: false,
                width: 50
            },{
                header: "idformulaovalorsistema",
                dataIndex: 'idformulaovalorsistema',
                hidden: true,
                hideable: false,
                width: 50
            },{
                header: "formulacalcular",
                dataIndex: 'formulacalcular',
                hidden: true,
                hideable: false,
                width: 50
            },{
                header: "tipoparametrosinventario",
                dataIndex: 'tipoparametrosinventario',
                hidden: true,
                hideable: false,
                width: 50
            },{
                header: "orden",
                dataIndex: 'orden',
                hidden: true,
                hideable: false,
                width: 50
            }, {
                header: "Abreviatura",
                dataIndex: 'abreviatura',
                width: 70
            }, {
                header: "Par&aacute;metro",
                dataIndex: 'denominacion',
                width: 200
            }, {
                header: "Forma de c&aacute;lculo",
                dataIndex: 'formacalculo',
                width: 70,
                renderer: function(val){
                    return arrFormaCalculo[val-1];
                }
            }, {
                header: "F&oacute;rmula/Valor/Sistema",
                dataIndex: 'formulavalorsistema',
                width: 300,
                editor: this.nfvalor
            }, {
                header: "Es porcentual",
                dataIndex: 'porcentual',
                width: 70,
                editor: this.cbPorcentual,
                renderer: function(val){
                    if(val == 1){
                        return 'Si';
                    }else {
                        return 'No';
                    }
                }
            }, {
                header: "Lugares decimales",
                dataIndex: 'lugaresdecimales',
                width: 70,
                editor: this.nfLugaresdecimales
            }
        ]);

        this.stParametros = new Ext.data.GroupingStore({
            url: '/logistica/inventario/abc/index.php/configabc/obtenerConfiguracionParametros',
            groupField:'tipoparametrosinventario',
            sortInfo:{field: 'orden', direction: "ASC"},
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idconfparametrosinventario"},
                [
                    {name: 'idconfparametrosinventario'},
                    {name: 'idparametrosinventario'},
                    {name: 'idformulaovalorsistema'},
                    {name: 'tipoparametrosinventario'},
                    {name: 'abreviatura'},
                    {name: 'denominacion'},
                    {name: 'formacalculo'},
                    {name: 'formulavalorsistema'},
                    {name: 'orden'},
                    {name: 'porcentual'},
                    {name: 'lugaresdecimales'},
                    {name: 'formulacalcular'}
                ])
        });

        this.egpParametros = new Ext.grid.EditorGridPanel({
            layout: 'fit',
            store: this.stParametros,
            autoScroll: true,
            stripeRows: true,
            cm: this.cmParametros,
            width: 350,
            height: 250,
            border: false,
            hideBorders: true,
            forceFit: true,
            view: new Ext.grid.GroupingView({
                forceFit    : true,
                groupTextTpl: '{gvalue}'
            }),
            loadMask: {msg: 'Cargando...'}
        });
        this.egpParametros.on('beforeedit', function(o){

            if(o.record.data.formacalculo == 1 && o.column == 9){
                var arrIndicadores = new Array();
                this.stParametros.each(function (r) {
                    var a = new Array();
                    a[0] = r.data.idparametrosinventario;
                    a[1] = r.data.denominacion + ' ('+r.data.abreviatura+')';
                    a[2] = r.data.tipoparametrosinventario;
                    arrIndicadores.push(a);
                });
                this.egpParametros.stopEditing(false);
                var idformula = (o.record.data.idformulaovalorsistema != null ? o.record.data.idformulaovalorsistema: -1);
                this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                    title: 'Editor de expresiones matem&aacute;ticas',
                    idexpresionmatematica: idformula,
                    indicadores: arrIndicadores,
                    agrupado: 1,
                    mostrarCondicionales: true,
                    campoagrupar: 'Tipo',
                    mostrarFunciones: 1,
                    operadoresMostrar: ['/','*','-','+', 's', 'p', 'pa', 'pc'],
                    mostrarDenominacion: false
                });
                this.objExpMat.on('expresionsalvada', function (arr) {
                    o.record.data.formulavalorsistema = arr.elementosMostrar;
                    o.record.data.idformulaovalorsistema = arr.idexpresionmatematica;
                    this.stParametros.getAt(o.row).set('formulavalorsistema', arr.elementosMostrar);
                    this.stParametros.getAt(o.row).set('idformulaovalorsistema', arr.idexpresionmatematica);
                    this.egpParametros.getView().refresh(true);
                    this.objExpMat.close();
                  }.createDelegate(this));

                this.objExpMat.show();
                return false;
            }

        }.createDelegate(this));

        this.stParametros.load();

        this.tbar = [this.btnGuardar];

        this.items = [this.egpParametros];
        Ext.log.abc.config.Parametros.superclass.initComponent.call(this);
    }
});
