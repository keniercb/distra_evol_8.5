Ext.ns('LOG.lb.plugin');


LOG.lb.plugin.ComboDepositos = function(config, seguridad) {
    var cfg = config || {};
    var seg = typeof seguridad != 'undefined' ? seguridad : 1;
    cfg.caso = typeof cfg.caso != 'undefined' ? cfg.caso : 1;
    cfg.tipo = typeof cfg.tipo != 'undefined' ? cfg.tipo : -1;
    function initComboDeposito(v, scope) {
        var dirUrl = '/logistica/utiles/plugin/index.php/plugincombodeposito';
        /*scope.comboDeposito = new LOG.util.ComboBox({width: 350, url: dirUrl + 'cargardepositos?idtipo=' + cfg.tipo
                    + '&seguridad=' + seg + '&caso=' + cfg.caso, valueField: 'iddeposito', displayField: 'deposito',
            listeners: {
                select: function(a, record) {
                    if (typeof (record) == 'undefined') {
                        return;
                    }
                    this.moveFocus.defer(100, this);
                },
                render: function(field) {
                    field.moveFocus = function() {
                        LOG.util.WindowMgr.activate();
                        this.triggerBlur();
                    };
                }
            },        
            tpl : '<tpl for="."><div style="color:{color}" class="x-combo-list-item"> <div><b>Denominaci\xf3n:</b> {deposito}</div><div><b>Estado:</b> {denestado}</div> </div></tpl>',
            otherFields: [{
                    name: 'codigo'
                }, {
                    name: 'estado'
                }, {
                    name: 'denestado'
                },{
                    name : 'color'
                },{
                    name : 'text'
                }]
        });
        scope.comboDeposito.getStore().on({
            'load': function(st, rd) {
                if (rd.length > 0) {
                    v.listaBotones.getItem(0).enable();
                    var datos = rd[0].data;
                    scope.comboDeposito.setValue(datos.iddeposito);
                }else{
                    scope.comboDeposito.setValue(null);
                }
            }
        });

        scope.comboDeposito.fireEvent = scope.comboDeposito.fireEvent.createSequence(function(e, args) {
            if ('valuechange' == e) {
                if (String(v.idDeposito) !== String(args)) {
                    v.getStorePrincipal().removeAll();
                    v.getStorePrincipal().initBaseParams.idestructura = args;
                    v.getStorePrincipal().load({
                        params: {
                            idestructura: args
                        }
                    });
                    v.idDeposito = args;
                    var datos = scope.comboDeposito.getStore().data.items;
                    Ext.each(datos, function(rec, index) {
                        if (rec.data.iddeposito == v.idDeposito) {
                            v.nomDeposito = rec.data.deposito;
                        }
                    });
                }
            }
        });
        */

        scope.comboDeposito = new LOG.util.SelectorTF({
            width: 350,
            fieldLabel :'Dep\xf3sitos',
            title :'Dep\xf3sitos',
            url : 'cargardepositos?idtipo=' + cfg.tipo + '&seguridad=' + seg + '&caso=' + cfg.caso,
            controller : dirUrl,
            valueField : 'iddeposito',
            displayField : 'deposito',
            hiddenName : 'iddeposito',
            columns : [
                {
                    header : 'Código',
                    dataIndex : 'codigo',
                    width : 120
                },{
                    header : 'Dep\xf3sito',
                    dataIndex : 'deposito',
                    width : 250,
                    autoExpand : true
                },{
                    header : 'Estado',
                    dataIndex : 'denestado',
                    width : 120
                },{
                    header : 'Fecha',
                    dataIndex : 'fecha',
                    width : 120
                },{
                    dataIndex : 'estado'
                },{
                    dataIndex : 'cuadrediario'
                }
            ]
        });
        scope.comboDeposito.fireEvent = scope.comboDeposito.fireEvent.createSequence(function(e, args) {
            if ('valuechange' == e) {
                if (String(v.idDeposito) !== String(args)) {
                    v.listaBotones.getItem(0).enable();
                    v.getStorePrincipal().removeAll();
                    v.getStorePrincipal().initBaseParams.idestructura = args;
                    v.getStorePrincipal().load({
                        params: {
                            idestructura: args
                        }
                    });
                    v.idDeposito = args;
                    /*var datos = scope.comboDeposito.getStore().data.items;
                    Ext.each(datos, function(rec, index) {
                        if (rec.data.iddeposito == v.idDeposito) {
                            v.nomDeposito = rec.data.deposito;
                        }
                    });*/
                }
            }
        });
        v.comboDeposito = scope.comboDeposito;
    }
    function initComboEntidad(v,scope){
        var dirUrl = '/logistica/utiles/plugin/index.php/plugincombodeposito/';
        scope.comboEntidad = new LOG.util.ComboBox({width: 250, url: dirUrl + 'cargarEntidades', valueField: 'idestructura', displayField: 'denominacion',
            listeners: {
                select: function(a, record) {
                    if (typeof (record) == 'undefined') {
                        return;
                    }
                    this.moveFocus.defer(100, this);
                },
                render: function(field) {
                    field.moveFocus = function() {
                        LOG.util.WindowMgr.activate();
                        this.triggerBlur();
                    };
                }
            },
            tpl : '<tpl for="."><div ext:qtip="{denominacion}" style="color:{color}" class="x-combo-list-item"> <div>{denominacion}</div></div></tpl>',
            otherFields: [{
                name: 'codigo'
            }, {
                name: 'estado'
            }, {
                name: 'denestado'
            },{
                name : 'color'
            },{
                name : 'text'
            }]
        });

        scope.comboEntidad.getStore().on({
            'load': function(st, rd) {
                if (rd.length > 0) {
                    scope.comboEntidad.setValue(idEntidad);
                }
            }
        });

        scope.comboEntidad.fireEvent = scope.comboEntidad.fireEvent.createSequence(function(e, args) {
            v.cambioEntidad = false;
			if ('valuechange' == e) {
                if (String(v.idEstructura) !== String(args)) {					
                    Ext.Ajax.extraParams = {
                        idEntidadComun : args
                    };
                    scope.comboDeposito.getStore().load({});
                    v.idEntidadComun = args;
                    v.cambioEntidad = true;
					if(typeof v.fnPostChangeEntidad == 'function'){
						v.fnPostChangeEntidad.createDelegate(v).call();
					}
                }
            }			
        });
        v.comboEntidad = scope.comboEntidad;
    }
    return {
        init: function(v) {
            v.autoLoad = false;
            v.getPanelSuperior().onRender = v.getPanelSuperior().onRender.createSequence(function() {
                initComboDeposito(v, this);
                //initComboEntidad(v, this);
                v.getPanelSuperior().add({
                    border: false,
                    tbar: [
                        '->', LOG.util.Idioma.lbEntidad + ':', entidad, ' ', '-', LOG.util.Idioma.lbDepositos + ':', this.comboDeposito
                    ]
                });
                v.listaBotones.getItem(0).disable();
                v.getPanelSuperior().doLayout();
                v.getStorePrincipal().initBaseParams.idestructura = -1;
            });
        }
    };
};

LOG.lb.plugin.DatosContables = function(){
    return {
        init: function(v) {
            var tpl = new Ext.Template(
                '<div style="padding-left: 5px; padding-top: 5px;">',
                '<p><b>Entidad:</b> {entity} </p>',
                '<p><b>Fecha contable:</b> {date} </p>',
                '<p><b>Moneda:</b> {currency} </p>',
                '</div>'
            );
            var wiDatos = new Ext.Window({
                closable : false,
                resizable : false,
                frame : true,
                constrain : true,
                modal : false,
                width : 250,
                height : 70,
                tpl : tpl,
                data :{
                    entity : entidad,
                    date : fecha,
                    currency : codigoContable,
                }
            });
            wiDatos.show();
            v.getPanelSuperior().onRender = v.getPanelSuperior().onRender.createSequence(function() {
                v.getStorePrincipal().fireEvent = v.getStorePrincipal().fireEvent.createSequence(function(e, args) {
                    if(e == 'load'){
                        wiDatos.update({
                            entity : entidad,
                            date : args.reader.jsonData.fecha,
                            currency : codigoContable
                        })
                    }
                });
            });

        },
        render: function (v) {

            console.info(v)
            var _this = this;
            var vista = LOG.lb.plugin.DatosContables.superclass.render.call(this);
            //this.gpPrincipal.autoExpandColumn = 'denomIndicador';
           // this.getStorePrincipal().initBaseParams.idnaturaleza = naturalezaPPA;
           // this.getStorePrincipal().on('beforeload', function (st, obj) {
            //     obj.params = {
            //         idindicador: Ext.encode(_this.idsRecuperables),
            //         idproducto: _this.idproducto,
            //         disponible: true,
            //         start: _this.getGridPrincipal().initialConfig.bbar.cursor,
            //         limit: _this.getGridPrincipal().initialConfig.bbar.pageSize
            //     };
            // });
            this.getSmPrincipal().on({
                rowselect: function (sm, index, record) {
                    console.info('jjj')
                    _this.getVistaPrincipal().listaBotones.getItem(0).enable();
                },
                rowdeselect: function () {
                    if (this.getCount() == 0)
                        _this.getVistaPrincipal().listaBotones.getItem(2).disable();
    
                }
            });
            return vista;
        }
    };
}
