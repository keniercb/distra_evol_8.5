/**
 * Created with JetBrains PhpStorm.
 * User: Osmel Cutino
 * Date: 17/03/15
 * Time: 15:31
 * To change this template use File | Settings | File Templates.
 */

Ext.ns('Ext.LOG.winMostrar');
Ext.LOG.winMostrar.arrVisorDetalles = Array();

Ext.LOG.winMostrar.vActivos = Ext.extend(Ext.Window, {

    constructor: function (config) {

        Ext.apply(this, config);
        var _this = this;

        this.etiq = config.etiquetas;
        this.datos = config.datos;

        this.height = (_this.height) ? _this.height : 350;
        this.width = (_this.width) ? _this.width : 550;

        this.modal = true;
        this.layout = 'border';

        this.buttons = [
            {
                iconCls: 'cerrar',
                text: _this.etiq.btnCerrar,
                tooltip: _this.etiq.btnTtCerrar,
                handler: function () {
                    _this.close();
                }
            }
        ];

        _this.tfGrupo = new Ext.form.TextField({
            fieldLabel: '_this.etiq.lbGrupo'
        });

        _this.tfMarcaModelo = new Ext.form.TextField({
            fieldLabel: _this.etiq.lbCmMarcaModelo
        });

        _this.tfCodigo = new Ext.form.TextField({
            fieldLabel: _this.etiq.lbCmCodigo
        });

        _this.tfPais = new Ext.form.TextField({
            fieldLabel: _this.etiq.lbCmNacionalidad
        });

        _this.tfTipo = new Ext.form.TextField({
            fieldLabel: _this.etiq.lbCmDenominacion
        });

        var stImagenes = new Ext.data.JsonStore({
            url: 'getImagenesDetalles',
            autoLoad: true,
            root: 'data',
            fields: ['url'],
            listeners: {
                'beforeLoad': function (store) {
                    store.baseParams.idindicador = _this.datos.idprod;
                },
                'load': function (store, records) {
                    var url = '/configuracion/nomencladores/index.php/gestindicadores/getImagen?idimagen='
                    stImagenes.removeAll();

                    if(records.length > 0){
                        for (var i = 0; i < records.length; i ++) {
                            Ext.LOG.winMostrar.arrVisorDetalles.push(url + records[i].json.idimagen);
                            stImagenes.insert(0, new stImagenes.recordType({
                                url: url + records[i].json.idimagen
                            }, i));
                        }
                    }else{
                        Ext.LOG.winMostrar.arrVisorDetalles.push('/configuracion/comun/images/sin_imagen.png');
                        stImagenes.insert(0, new stImagenes.recordType({
                            url: '/configuracion/comun/images/sin_imagen.png'
                        }, 0));
                    }
                }
            }
        });

        _this.pImagenes = new Ext.Panel({
            region: 'center',
            layout: 'border',
            id: 'images-view',
            items: [new Ext.DataView({
                region: 'center',
                multiSelect: true,
                overClass: 'x-view-over',
                itemSelector: 'div.thumb-wrap',
                emptyText: '',
                store: stImagenes,
                tpl: new Ext.XTemplate('<tpl for=".">', '<div class="thumb-wrap" id="{name}">', '<div class="thumb" width=10 height=10><img onClick ="marcarImagen(this.src)" onDblClick="getVisorImagenes(this)" src="{url}" id="{url}" /></div>', '<span class="x-editable">{shortName}</span></div>', '</tpl>', '<div class="x-clear"></div>'),
                plugins: [new Ext.DataView.DragSelector(), new Ext.DataView.LabelEditor({
                    dataIndex: 'name'
                })]
            })]
        });

        _this.panelEast = new Ext.Panel({
            region: 'east',
            useSplitTips: false,
            collapsible: true,
            split: true,
            collapseMode: 'mini',
            width: 300,
            layout: 'fit'
        });

        _this.propertyGrid = new Ext.erp.PropertyGrid({
            schema: 'mod_datosmaestrosmeta',
            globalDefault: true,
            editable: false,
            listeners: {
                'show': function (propertyG) {
                    _this.panelEast.add(propertyG);
                    _this.panelEast.doLayout(true);

                    _this.propertyGrid.setContenido(_this.datos.arridtablasgenerales);
                }
            }/*,
            preOperacion: function () {

                if (_this.datos) {
                    this.llavesForaneas = Array();
                    this.llavesForaneas.push({
                        key: 'idindicador',
                        value: _this.datos.idindicador
                    });

                    this.idtabla = _this.datos.idtabla;
                    this.idtablageneral = _this.datos.idtablageneral;
                    this.ar_where = 'idindicador = ' + _this.datos.idindicador;

                } else
                    throw 'Record no seleccionado';
            }*/
        });

        this.items = [
            {
                xtype: 'panel',
                region: 'center',
                layout: 'border',
                border: false,
                bodyBorder: false,
                items: [
                    {
                        xtype: 'panel',
                        region: 'north',
                        height: 120,
                        border: false,
                        bodyBorder: false,
                        width: _this.width,
                        layout: 'column',
                        frame: true,
                        items: [
                            {
                                columnWidth: .5,
                                layout: 'form',
                                labelAlign: 'top',
                                defaults: {
                                    anchor: '95%',
                                    readOnly: true
                                },
                                items: [_this.tfCodigo, _this.tfTipo]
                            },
                            {
                                columnWidth: .5,
                                layout: 'form',
                                labelAlign: 'top',
                                defaults: {
                                    anchor: '95%',
                                    readOnly: true
                                },
                                items: [_this.tfPais, _this.tfMarcaModelo]
                            }
                        ]
                    },
                    _this.pImagenes,
                    _this.panelEast
                ]
            }
        ];

        /*
         *  Botón para cerrar la ventana
         */
        this.buttons = [
            {
                iconCls: 'cerrar',
                text: 'cerrar',
                tooltip: _this.etiq.lbTtBtnCancelar,
                handler: function () {
                    _this.close();
                }
            }
        ];

        _this.getDatosMedio(config.idactivofijo);

        Ext.LOG.winMostrar.vActivos.superclass.constructor.apply(this, arguments);
    },
    getDatosMedio: function (idactivofijo) {

        var _this = this;

        if (_this.datos) {

            var marcamodelo = '';

            if (_this.datos.marca) {
                marcamodelo += _this.datos.marca;
            }

            if (_this.datos.modelo) {
                marcamodelo += ' - ' + _this.datos.modelo;
            }

            _this.title += ' ' + marcamodelo;

            _this.tfMarcaModelo.setValue(marcamodelo);
            _this.tfCodigo.setValue(_this.datos.codigo);
            _this.tfTipo.setValue(_this.datos.denominacion);
            _this.tfPais.setValue(_this.datos.nacionalidad);
        }

        //        alert('Falta implementar esta funcionalidad');
        /*var _this = this;

         Ext.Ajax.request({
         url: 'getdatosmedio',
         params: datos.data,
         method: 'POST',
         callback: function (options, success, response) {
         var rd = Ext.decode(response.responseText);

         _this.tfGrupo.setValue(rd.grupo);
         _this.tfCodigo.setValue(rd.codigo);
         _this.tfValorInicial.setValue(rd.valor);
         _this.tfPais.setValue(rd.nacionalidad);

         switch (rd.esequipo) {
         case '1':
         _this.tfTipo.setValue(_this.etiq.lbCmEquipo);
         break;
         case '2':
         _this.tfTipo.setValue(_this.etiq.lbCmAnimal);
         break;
         case '3':
         _this.tfTipo.setValue(_this.etiq.lbCmInmueble);
         break;
         }

         document.getElementById('divEspecialidad').innerHTML = '<b>' + (_this.etiq.lbEspecialidad) + ': </b>' + rd.especialidad;
         }
         });
         }/*,
         setAtribDinamicos: function (config) {
         Ext.Ajax.request({
         url: config.urlController + 'getatributos',
         params: config.param,
         method: 'POST',
         callback: function (options, success, response) {
         var rd = Ext.decode(response.responseText);
         setContenido('atributosDinamicosService', '/logistica/activos_fijos/utiles/index.php/', rd.idtablas, - 1, - 1, config.param.idactivofijo, false, true);
         }
         });*/
    }
});

function marcarImagen(src) {
    var urlm = '/configuracion/nomencladores/index.php/gestindicadores/getImagen?idimagen='
    var srcImagenSeleccionada = src.split(urlm);
    idImagenSeleccionada = srcImagenSeleccionada[1];
}

function getVisorImagenes(imagen) {
    visorImagenes(Ext.LOG.winMostrar.arrVisorDetalles, imagen.id);
}



