/**
 * Created by john on 15/05/15.
 */

/**
 * Script que inicializa los modilos de componentes extendidos
 * requires : [
 *      _ExtBase(dev).s
 *  ]
 */

(function(_){

    _.Components = {
        fields : {},
        buttons : {},
        txtEstandar : {

            regExps: { //Ñ  - 00D1
                //ñ  - 00F1

                /*
                 *Exp para validar cadenas con denominaciones
                 */
                denominacion: /^([A-Za-z0-9]|[,]|[.]|[:]|[/]|[;]|[_]|[-]|[(]|[)]|[\u005B]|[\u005D]|[\u00e1\u00e9\u00f3\u00ed\u00fa\u00FC\u00F1\u00C1\u00C9\u00CD\u00D3\u00DA\u00DC\u00D1])+([ ]?([A-Za-z0-9]|[,]|[.]|[:]|[/]|[;]|[_]|[-]|[(]|[)]|[\u005B]|[\u005D]|[\u00e1\u00e9\u00f3\u00ed\u00fa\u00FC\u00F1\u00C1\u00C9\u00CD\u00D3\u00DA\u00DC\u00D1]))*$/,

                /*
                 *Exp para validar cadenas de contrasennas
                 */
                passwd: /[A-Za-z0-9*.-_%$#@^()!?><:, ]/,

                /*
                 *Exp para validar cadenas servidor, admite dir ip o hostname
                 * Ej: 10.12.167.10 | localhost | hostname.domain
                 */
                servidor: /^(([1-9]|[1-9][0-9]|[1-2][0-5][0-5])\.(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-5][0-5])\.){2}([0-9]|[1-9][0-9]|[1-2][0-5][0-5]))|(localhost|(([a-zA-Z0-9_-])+(\.([a-zA-Z])+))+)$/,
                /*
                 *Exp para validar formato wkt solo POLYGON, tiene que tener mas de 4 posiciones, no evalua que la primara coord sea la última
                 * Ej: POLYGON((-2 3, 4 5, 8 9, 10 23))
                 */
                wktPOLYGON: /^POLYGON\({2}((((?:\+|-)?(([0-9]|[1-9][0-9]|1[0-7][0-9])|(([0-9]|[1-9][0-9]|1[0-7][0-9])\.\d{1,})|180))\s((?:\+|-)?(([0-9]|[1-9][0-9]|1[0-7][0-9])|(([0-9]|[1-9][0-9]|1[0-7][0-9])\.\d{1,})|180)))(,)){3,}(((?:\+|-)?(([0-9]|[1-9][0-9]|1[0-7][0-9])|(([0-9]|[1-9][0-9]|1[0-7][0-9])\.\d{1,})|180))\s((?:\+|-)?(([0-9]|[1-9][0-9]|1[0-7][0-9])|(([0-9]|[1-9][0-9]|1[0-7][0-9])\.\d{1,})|180)))+\){2}$/,
                /*
                 *Exp para validar un listado de coordenadas, tiene que tener mas de 4 posiciones.
                 * Ej: -2 3, 4 5, 8 9, 10 23
                 */
                listCoor: /^((((?:\+|-)?(([0-9]|[1-9][0-9]|1[0-7][0-9])|(([0-9]|[1-9][0-9]|1[0-7][0-9])\.\d{1,})|180))\s((?:\+|-)?(([0-9]|[1-9][0-9]|1[0-7][0-9])|(([0-9]|[1-9][0-9]|1[0-7][0-9])\.\d{1,})|180)))(,)){3,}(((?:\+|-)?(([0-9]|[1-9][0-9]|1[0-7][0-9])|(([0-9]|[1-9][0-9]|1[0-7][0-9])\.\d{1,})|180))\s((?:\+|-)?(([0-9]|[1-9][0-9]|1[0-7][0-9])|(([0-9]|[1-9][0-9]|1[0-7][0-9])\.\d{1,})|180)))$/
            },

            regexText: {
                denominacion: 'Solo admite caracteres alfanum&eacute;ricos y los caracteres especiales (_-()[].:,;/).'
            },

            maskReExps: {
                denominacion: /([A-Za-z0-9]|[,]|[.]|[:]|[/]|[;]|[_]|[-]|[(]|[)]|[ ]|[\u005B]|[\u005D]|[\u00e1\u00e9\u00f3\u00ed\u00fa\u00FC\u00F1\u00C1\u00C9\u00CD\u00D3\u00DA\u00DC\u00D1])/
            }
        },
        containers : {}
    };

    _.baseComponent = (new _.FacadeFactory({
        render : function(){}
    },{
        objects : {
            2 : {
                render : function(){
                    Ext.Component.prototype.render.apply(this,arguments);
                    this.fireEvent('afterrender',this);
                }
            },
            3 : {
                render : function(){
                    Ext.Component.prototype.render.apply(this,arguments);
                }
            }
        }
    })).getObject(_.ExtVersion);

    _.boxComponent = (new _.FacadeFactory({
        $extend : _.baseComponent,
        getWidth : function(){}
    },{
        objects: {
            2 : {
                getWidth : function(){
                    return this.getResizeEl().getWidth();
                }
            },
            3 : {
                getWidth : function(){
                    return Ext.BoxComponent.prototype.getWidth.apply(this,arguments);
                }
            }
        }
    })).getObject(_.ExtVersion);

    _.Components.containers.baseContainer = (new _.FacadeFactory({
        $extend : _.boxComponent,

        removeAll: function(){}
    },{
        objects : {
            2 : {
                removeAll : function(){
                    this.initItems();
                    var item, rem = [], items = [];
                    this.items.each(function(i){
                        rem.push(i);
                    });
                    for (var i = 0, len = rem.length; i < len; ++i){
                        item = rem[i];
                        this.remove(item, autoDestroy);
                        if(item.ownerCt !== this){
                            items.push(item);
                        }
                    }
                    return items;

                }
            },
            3 : {
                removeAll : function(){
                    return Ext.Container.prototype.removeAll.apply(this,arguments);
                }
            }
        }
    })).getObject(_.ExtVersion);

    _.Components.containers.Panel = _.Class({
        $extend : Ext.Panel,
        $implement : _.Components.containers.baseContainer,
        render : function(){
            _.Components.containers.Panel.superclass.render.apply(this,arguments);
            _.Components.containers.Panel.$implement.render.apply(this,arguments);
        }
    });

})(ExtExtend);



