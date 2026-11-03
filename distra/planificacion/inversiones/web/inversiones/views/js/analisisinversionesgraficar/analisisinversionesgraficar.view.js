/*analisisinversiones.view.js
 * Vista para analisis
 * @author: Yanila Morfa
 * @package: Plataforma Integral de Planificacion
 * @subpackage:
 * @copyright: 
 * @version: 1.0-0
 */
Utilidades.Cmp.CmpGrafica = function (opciones) {

    var _this = this;
//    this.idioma = opciones.idioma;
    this.identidad = opciones.nodeEntidad;
    this.idejercicio = opciones.idejercicio;
    this.ejercicio = opciones.ejercicio;
    this.mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });
    Ext.ns('Ext.ux.layout');
    Ext.ux.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
        monitorResize: true,
        isValidParent: function (c, target) {
            return c.getEl().dom.parentNode == this.innerCt.dom;
        },
        onLayout: function (ct, target) {
            var rs = ct.items.items, len = rs.length, r, i;
            if (!this.innerCt) {
                target.addClass('ux-row-layout-ct');
                this.innerCt = target.createChild({cls: 'x-row-inner'});
            }
            this.renderAll(ct, this.innerCt);
            var size = target.getViewSize();
            if (size.width < 1 && size.height < 1) {
                return;
            }
            var h = size.height - target.getPadding('tb'),
                ph = h;
            this.innerCt.setSize({height: h});
            for (i = 0; i < len; i++) {
                r = rs[i];
                if (!r.rowHeight) {
                    ph -= (r.getSize().height + r.getEl().getMargins('tb'));
                }
            }
            ph = ph < 0 ? 0 : ph;
            for (i = 0; i < len; i++) {
                r = rs[i];
                if (r.rowHeight) {
                    r.setSize({height: Math.floor(r.rowHeight * ph) - r.getEl().getMargins('tb')});
                }
            }
        }
    });
    Ext.Container.LAYOUTS['ux.row'] = Ext.ux.layout.RowLayout;
    Ext.QuickTips.init();

//Paneles de las graficas control de la ejecucion
    this.controlejecucion_p1 = new Ext.Panel({
        id: 'controlejecucion_p1',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idcontrolejecucion_p1" margin: 0 auto"></div>'
    });
    this.controlejecucion_p2 = new Ext.Panel({
        id: 'controlejecucion_p2',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        height: '80%',
        region: 'center',
        html: '<div id="idcontrolejecucion_p2" margin: 0 auto"></div>'
    });

//Paneles de las graficas de plan de preparacion
    this.planprepracion_norte_p1 = new Ext.Panel({
        id: 'masequipos_norte_p1',
        layout: 'fit',
        region: 'center',
        bodyBorder: false,
        height: '100%',
        width: '100%',
        html: '<div id="idplanprepracion_norte_p1" margin: 0 auto"></div>'
    });

//Paneles de las graficas segun la forma de propiedad
    this.formapropiedad_p1 = new Ext.Panel({
        id: 'fomapropiedad_p1',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        height: '50%',
        region: 'west',
        html: '<div id="idfomapropiedad_p1" margin: 0 auto"></div>'
    });
    this.formapropiedad_p2 = new Ext.Panel({
        id: 'fomapropiedad_p2',
        layout: 'fit',
        width: '100%',
        bodyBorder: false,
        height: '40%',
        region: 'center',
        html: '<div id="idfomapropiedad_p2" margin: 0 auto"></div>'
    });
    this.formapropiedad_p3 = new Ext.Panel({
        id: 'fomapropiedad_p3',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        height: '50%',
        region: 'center',
        html: '<div id="idfomapropiedad_p3" margin: 0 auto"></div>'
    });
    this.formapropiedad_pn = new Ext.Panel({
        id: 'fomapropiedad_p2',
        layout: 'border',
        width: '100%',
        bodyBorder: false,
        height: '60%',
        region: 'center',
        items: [this.formapropiedad_p1, this.formapropiedad_p3]
    });
    this.panelGeneral = new Ext.Panel({
        id: 'panelGeneral',
        border: false,
        height: '100%',
        layout: 'ux.row',
        items: [{
            rowHeight: .95,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [this.formapropiedad_pn]
        }/*, {
         rowHeight: .50,
         width: '100%',
         border: false,
         layout: 'fit',
         items: [this.formapropiedad_p2]
         }*/]
    });

//Paneles de las graficas de tipo credito
    /*this.credito_p1 = new Ext.Panel({
     id: 'credito_p1',
     layout: 'fit',
     region: 'west',
     bodyBorder: false,
     height: '80%',
     width: '50%',
     html: '<div id="idcredito_p1" margin: 0 auto"></div>'
     });
     this.credito_p2 = new Ext.Panel({
     id: 'credito_p2',
     layout: 'fit',
     width: '50%',
     bodyBorder: false,
     height: '80%',
     region: 'center',
     html: '<div id="idcredito_p2" margin: 0 auto"></div>'
     });

     this.credito_p3 = new Ext.Panel({
     id: 'credito_p3',
     layout: 'fit',
     region: 'south',
     bodyBorder: false,
     height: '100%',
     width: '100%',
     html: '<div id="idcredito_p3" margin: 0 auto"></div>'
     });

     this.credito_panelGeneral = new Ext.Panel({
     id: 'credito_panelGeneral',
     border: false,
     height: '100%',
     layout: 'ux.row',
     items: [{
     rowHeight: .50,
     width: '100%',
     border: false,
     layout: 'border',
     items: [this.credito_p2, this.credito_p1]
     }, {
     rowHeight: .50,
     width: '100%',
     border: false,
     layout: 'fit',
     items: [this.credito_p3]
     }]
     });*/


    //
    this.credito_p1 = new Ext.Panel({
        id: 'credito_p1',
        layout: 'fit',
        region: 'center',
        bodyBorder: false,
        height: '100%',
        width: '50%',
        html: '<div id="idcredito_p1" margin: 0 auto"></div>'
    });

    this.credito_p2 = new Ext.Panel({
        id: 'credito_p2',
        layout: 'fit',
        region: 'east',
        bodyBorder: false,
        height: '100%',
        width: '50%',
        html: '<div id="idcredito_p2" margin: 0 auto"></div>'
    });

    this.credito_p3 = new Ext.Panel({
        id: 'credito_p3',
        layout: 'fit',
        region: 'south',
        bodyBorder: false,
        height: '100%',
        width: '100%',
        html: '<div id="idcredito_p3" margin: 0 auto"></div>'
    });

    this.credito_panelGeneral = new Ext.Panel({
        id: 'credito_panelGeneral',
        border: false,
        height: '100%',
        layout: 'ux.row',
        items: [{
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'border',
            items: [this.credito_p2, this.credito_p1]
        }, {
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [this.credito_p3]
        }]
    });

//Paneles de las graficaas de inversiones mas costosas
    this.costoinversion_p1 = new Ext.Panel({
        id: 'costoinversion_p1',
        layout: 'fit',
        region: 'center',
        bodyBorder: false,
        height: '100%',
        width: '100%',
        html: '<div id="idcostoinversion_p1" margin: 0 auto"></div>'
    });


//Paneles de las graficaas de equipos
    this.equipos_norte_p1 = new Ext.Panel({
        id: 'equipos_norte_p1',
        layout: 'fit',
        region: 'center',
        bodyBorder: false,
        height: '100%',
        width: '50%',
        html: '<div id="idequipos_norte_p1" margin: 0 auto"></div>'
    });

    this.equipos_norte_p2 = new Ext.Panel({
        id: 'equipos_norte_p2',
        layout: 'fit',
        region: 'east',
        bodyBorder: false,
        height: '100%',
        width: '50%',
        html: '<div id="idequipos_norte_p2" margin: 0 auto"></div>'
    });


    this.equipos_sur_p1 = new Ext.Panel({
        id: 'equipos_sur_p1',
        layout: 'fit',
        region: 'south',
        bodyBorder: false,
        height: '100%',
        width: '100%',
        html: '<div id="idequipos_sur_p1" margin: 0 auto"></div>'
    });

    this.equipos_norte = new Ext.Panel({
        id: 'equipos_norte',
        layout: 'border',
        width: '100%',
        bodyBorder: false,
        height: '100%',
        region: 'center',
        items: [this.equipos_norte_p1, this.equipos_norte_p2]
    });

    this.equipos_panelGeneral = new Ext.Panel({
        id: 'equipos_panelGeneral',
        border: false,
        height: '100%',
        layout: 'ux.row',
        items: [{
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [this.equipos_norte]
        }, {
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [this.equipos_sur_p1]
        }]
    });

//Paneles de las graficaas de inversiones con mas equipos
    this.masequipos_norte_p1 = new Ext.Panel({
        id: 'masequipos_norte_p1',
        layout: 'fit',
        region: 'center',
        bodyBorder: false,
        height: '100%',
        width: '100%',
        html: '<div id="idmasequipos_norte_p1" margin: 0 auto"></div>'
    });
    this.masequipos_norte_p2 = new Ext.Panel({
        id: 'masequipos_norte_p2',
        layout: 'fit',
        region: 'center',
        bodyBorder: false,
        height: '100%',
        width: '100%',
        html: '<div id="idmasequipos_norte_p2" margin: 0 auto"></div>'
    });
    this.masequipos_sur_p1 = new Ext.Panel({
        id: 'masequipos_sur_p1',
        layout: 'fit',
        region: 'south',
        bodyBorder: false,
        height: '100%',
        width: '100%',
        html: '<div id="idmasequipos_sur_p1" margin: 0 auto"></div>'
    });

    this.masequipos_norte = new Ext.Panel({
        id: 'masequipos_norte',
        layout: 'border',
        width: '100%',
        bodyBorder: false,
        height: '60%',
        region: 'center',
        items: [this.masequipos_norte_p1, this.masequipos_norte_p2]
    });

    this.masequipos_panelGeneral = new Ext.Panel({
        id: 'masequipos_panelGeneral',
        border: false,
        height: '100%',
        layout: 'ux.row',
        items: [{
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [this.masequipos_norte]
        }, {
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [this.masequipos_sur_p1]
        }]
    });

//Paneles de las graficas de equipo-centro de balance
    this.equipoCentrobalance_norte_p1 = new Ext.Panel({
        id: 'equipoCentrobalance_norte_p1',
        layout: 'fit',
        region: 'center',
        bodyBorder: false,
        height: '100%',
        width: '100%',
        html: '<div id="idequipoCentrobalance_norte_p1" margin: 0 auto"></div>'
    });

    //Paneles de las graficas de equipo - organo - centro de balance
    this.equipoOrganoSector = new Ext.Panel({
        id: 'equipoOrganoSector',
        layout: 'fit',
        region: 'center',
        bodyBorder: false,
        height: '100%',
        width: '100%',
        html: '<div id="idequipoOrganoSector" margin: 0 auto"></div>'
    });

//paneles de equipos sector estrategico
    this.equiposSector_norte_p1 = new Ext.Panel({
        id: 'equiposSector_norte_p1',
        layout: 'fit',
        region: 'center',
        bodyBorder: false,
        height: '100%',
        width: '50%',
        html: '<div id="idequiposSector_norte_p1" margin: 0 auto"></div>'
    });

    this.equiposSector_norte_p2 = new Ext.Panel({
        id: 'equiposSector_norte_p2',
        layout: 'fit',
        region: 'east',
        bodyBorder: false,
        height: '100%',
        width: '50%',
        html: '<div id="idequiposSector_norte_p2" margin: 0 auto"></div>'
    });

    /*this.equiposSector_sur_p1 = new Ext.Panel({
     id: 'equiposSector_sur_p1',
     layout: 'fit',
     region: 'south',
     bodyBorder: false,
     height: '100%',
     width: '100%',
     html: '<div id="idequiposSector_sur_p1" margin: 0 auto"></div>'
     });*/

    this.equiposSector_norte = new Ext.Panel({
        id: 'equiposSector_norte',
        layout: 'border',
        width: '100%',
        bodyBorder: false,
        height: '100%',
        region: 'center',
        items: [this.equiposSector_norte_p1, this.equiposSector_norte_p2]
    });

    this.equiposSector_panelGeneral = new Ext.Panel({
        id: 'equiposSector_panelGeneral',
        border: false,
        height: '100%',
        layout: 'ux.row',
        items: [{
            rowHeight: 1,
            width: '100%',
            border: false,
            layout: 'border',
            items: [this.equiposSector_norte_p1, this.equiposSector_norte_p2]
        }]
    });

    //Paneles de las graficas tipo de inversion
    this.tipoinversion_p1 = new Ext.Panel({
        id: 'tipoinversion_p1',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idtipoinversion_p1" margin: 0 auto"></div>'
    });

    this.tipoinversion_p2 = new Ext.Panel({
        id: 'tipoinversion_p2',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        height: '80%',
        region: 'center',
        html: '<div id="idtipoinversion_p2" margin: 0 auto"></div>'
    });

    //Paneles de las graficas inversiones - objetivos
    this.inversionesobjetivos_p1 = new Ext.Panel({
        id: 'inversionesobjetivos_p1',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idinversionesobjetivos_p1" margin: 0 auto"></div>'
    });

    this.inversionesobjetivos_p2 = new Ext.Panel({
        id: 'inversionesobjetivos_p2',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        height: '80%',
        region: 'center',
        html: '<div id="idinversionesobjetivos_p2" margin: 0 auto"></div>'
    });

    //Paneles de las graficas inversiones - efectos
    this.inversionesefectos_p1 = new Ext.Panel({
        id: 'inversionesefectos_p1',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idinversionesefectos_p1" margin: 0 auto"></div>'
    });

    this.inversionesefectos_p2 = new Ext.Panel({
        id: 'inversionesefectos_p2',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        height: '80%',
        region: 'center',
        html: '<div id="idinversionesefectos_p2" margin: 0 auto"></div>'
    });

    //Paneles de las graficas inversiones - sectores - cuencas
    this.inversionessectorescuencas_p1 = new Ext.Panel({
        id: 'inversionessectorescuencas_p1',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        region: 'center',
        html: '<div id="idinversionessectorescuencas_p1" margin: 0 auto"></div>'
    });
    this.inversionessectorescuencas_p2 = new Ext.Panel({
        id: 'inversionessectorescuencas_p2',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        region: 'east',
        html: '<div id="idinversionessectorescuencas_p2" margin: 0 auto"></div>'
    });
    this.panelContenedorArriba = new Ext.Panel({
        layout: 'border',
        width: '100%',
        bodyBorder: false,
        region: 'north',
        items: [_this.inversionessectorescuencas_p1, _this.inversionessectorescuencas_p2]
    });
    this.inversionessectorescuencas_p3 = new Ext.Panel({
        id: 'inversionessectorescuencas_p3',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        region: 'center',
        html: '<div id="idinversionessectorescuencas_p3" margin: 0 auto"></div>'
    });
    this.inversionessectorescuencas_p4 = new Ext.Panel({
        id: 'inversionessectorescuencas_p4',
        layout: 'fit',
        width: '50%',
        region: 'east',
        bodyBorder: false,
        html: '<div id="idinversionessectorescuencas_p4" margin: 0 auto"></div>'
    });
    this.panelContenedorCentro = new Ext.Panel({
        layout: 'border',
        region: 'center',
        bodyBorder: false,
        width: '100%',
        items: [_this.inversionessectorescuencas_p3, _this.inversionessectorescuencas_p4]
    });

    this.panelGeneralSectores = new Ext.Panel({
        id: 'panelGeneralSectores',
        border: false,
        height: '100%',
        layout: 'ux.row',
        items: [{
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [_this.panelContenedorArriba]
        }, {
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [_this.panelContenedorCentro]
        }]
    });


//Componente con todas las graficas por tabs
    this.tabsanalisisinversiones = new Ext.TabPanel({
        activeTab: 0,
        id: 'tabsanalisisinversiones',
        region: 'center',
        enableTabScroll: true,
        items: [{
            title: 'Control de la ejecuci\xF3n',
            id: 'controlejecucion',
            activeTab: 0,
            layout: 'border',
            html: "<div id = 'controlejecucion_contenedor' ></div>",
            items: [this.controlejecucion_p1, this.controlejecucion_p2],
            listeners: {
                activate: function () {
                    _this.fnPintar(_this.identidad, _this.idejercicio, _this.ejercicio);
                }
            }
        }, {
            title: 'Plan-Forma de Propiedad',
            id: 'formapropiedad',
            activeTab: 1,
            layout: 'fit',
            html: "<div id = 'formapropiedad_contenedor' ></div>",
            items: [this.panelGeneral],
            listeners: {
                activate: function (p) {
                    _this.fnPintar(_this.identidad, _this.idejercicio, _this.ejercicio);
                }
            }
        }, {
            title: 'Inversiones por tipo de finaciamiento',
            id: 'tipocredito',
            activeTab: 2,
            layout: 'fit',
            html: "<div id = 'tipocredito_contenedor' ></div>",
            //items: [this.credito_p1, this.credito_p2],
            items: [this.credito_panelGeneral],
            listeners: {
                activate: function (p) {
                    _this.fnPintar(_this.identidad, _this.idejercicio, _this.ejercicio);
                }
            }
        }, {
            title: 'Inversiones m\xE1s costosas',
            id: 'costoinversion',
            activeTab: 3,
            layout: 'border',
            html: "<div id = 'costoinversion_contenedor' ></div>",
            items: [this.costoinversion_p1],
            listeners: {
                activate: function (p) {
                    _this.fnPintar(_this.identidad, _this.idejercicio, _this.ejercicio);
                }
            }
        }, {
            title: 'Equipos',
            id: 'equipos',
            activeTab: 4,
            layout: 'fit',
            html: "<div id = 'equipos_contenedor' ></div>",
            items: [this.equipos_panelGeneral],
            listeners: {
                activate: function (p) {
                    _this.fnPintar(_this.identidad, _this.idejercicio, _this.ejercicio);
                }
            }
        }, {
            title: 'Inversiones con m\xE1s equipos',
            id: 'masequipos',
            activeTab: 5,
            layout: 'fit',
            html: "<div id = 'masequipos_contenedor' ></div>",
            items: [this.masequipos_norte_p1],
            listeners: {
                activate: function (p) {
                    _this.fnPintar(_this.identidad, _this.idejercicio, _this.ejercicio);
                }
            }
        }, {
            title: 'Resumen por tipo de inversi\xF3n',
            id: 'tipoinversion',
            activeTab: 6,
            layout: 'border',
            html: "<div id = 'tipoinversion_contenedor' ></div>",
            items: [this.tipoinversion_p1, this.tipoinversion_p2],
            listeners: {
                activate: function (p) {
                    _this.fnPintar(_this.identidad, _this.idejercicio, _this.ejercicio);
                }
            }
        }, {
            title: 'Plan de preparaci\xF3n',
            id: 'planprepracion',
            activeTab: 7,
            layout: 'fit',
            html: "<div id = 'planprepracion_contenedor' ></div>",
            items: [this.planprepracion_norte_p1],
            listeners: {
                activate: function (p) {
                    _this.fnPintar(_this.identidad, _this.idejercicio, _this.ejercicio);
                }
            }
        }, {
            title: 'Equipos-\xF3rgano satisface',
            id: 'equipos-centrob',
            activeTab: 8,
            layout: 'fit',
            html: "<div id = 'equipocentrob_contenedor' ></div>",
            items: [this.equipoCentrobalance_norte_p1],
            listeners: {
                activate: function (p) {
                    _this.fnPintar(_this.identidad, _this.idejercicio, _this.ejercicio);
                }
            }
        }, {
            title: 'Equipos-sector estrat\xE9gico',
            id: 'equipos-sector',
            activeTab: 9,
            layout: 'fit',
            html: "<div id = 'equiposector_contenedor' ></div>",
            items: [this.equiposSector_panelGeneral],
            listeners: {
                activate: function (p) {
                    _this.fnPintar(_this.identidad, _this.idejercicio, _this.ejercicio);
                }
            }
        }, /*{
         title: 'Equipos-\xF3rgano-sector estrat\xE9gico',
         id: 'equipos-organo-sector',
         activeTab: 10,
         layout: 'fit',
         html: "<div id = 'equipoorganosector_contenedor' ></div>",
         items: [this.equipoOrganoSector],
         listeners: {
         activate: function(p) {
         _this.fnPintar(_this.identidad, _this.idejercicio, _this.ejercicio);
         }
         }
         },*/ {
            title: 'Inversiones-objetivos',
            id: 'inversiones-objetivos',
            activeTab: 11,
            layout: 'border',
            html: "<div id = 'inversionesobjetivos_contenedor' ></div>",
            items: [this.inversionesobjetivos_p1, this.inversionesobjetivos_p2],
            listeners: {
                activate: function (p) {
                    _this.fnPintar(_this.identidad, _this.idejercicio, _this.ejercicio);
                }
            }
        }, {
            title: 'Inversiones-efectos',
            id: 'inversiones-efectos',
            activeTab: 12,
            layout: 'border',
            html: "<div id = 'inversionesefectos_contenedor' ></div>",
            items: [this.inversionesefectos_p1, this.inversionesefectos_p2],
            listeners: {
                activate: function (p) {
                    _this.fnPintar(_this.identidad, _this.idejercicio, _this.ejercicio);
                }
            }
        }, {
            title: 'Inversiones-sectores-cuencas',
            id: 'inversiones-sectores-cuencas',
            activeTab: 13,
            layout: 'fit',
            html: "<div id = 'inversionessectorescuencas_contenedor' ></div>",
            items: [_this.panelGeneralSectores],
            listeners: {
                activate: function (p) {
                    _this.fnPintar(_this.identidad, _this.idejercicio, _this.ejercicio);
                }
            }
        }]
    });


    this.panelGraficas = function () {
        return this.tabsanalisisinversiones;
    };

    this.actualizarParametros = function (nodeEntidad, idejercicio, ejercicio) {
        this.identidad = nodeEntidad;
        this.idejercicio = idejercicio;
        this.ejercicio = ejercicio;
    };

    this.fnPintar = function (nodeEntidad, idejercicio, ejercicio) {
        var tab = this.tabsanalisisinversiones.getActiveTab();
        switch (tab.activeTab) {
            case 0:
                this.fnControlEjecucion(nodeEntidad, idejercicio, ejercicio);
                break;
            case 1:
                this.fnFormaPropiedad(nodeEntidad, idejercicio, ejercicio);
                break;
            case 2:
                this.fnTipoCreditos(nodeEntidad, idejercicio, ejercicio);
                break;
            case 3:
                this.fnCostoInversion(nodeEntidad, idejercicio, ejercicio);
                break;
            case 4:
                this.fnEquipos(nodeEntidad, idejercicio, ejercicio);
                break;
            case 5:
                this.fnMasEquipos(nodeEntidad, idejercicio, ejercicio);
                break;
            case 6:
                this.fnTipoInversion(nodeEntidad, idejercicio, ejercicio);
                break;
            case 7:
                this.fnPlanPreparacion(nodeEntidad, idejercicio, ejercicio);
                break;
            case 8:
                this.fnEquiposCentrobalance(nodeEntidad, idejercicio, ejercicio);
                break;
            case 9:
                this.fnEquiposSectorestrategico(nodeEntidad, idejercicio, ejercicio);
                break;
            case 10:
                this.fnEquiposOrganoSectorestrategico(nodeEntidad, idejercicio, ejercicio);
                break;
            case 11:
                this.fnInversionesObjetivo(nodeEntidad, idejercicio, ejercicio);
                break;
            case 12:
                this.fnInversionesEfecto(nodeEntidad, idejercicio, ejercicio);
                break;
            case 13:
                this.fnInversionesMedioambiente(nodeEntidad, idejercicio, ejercicio);
                break;
        }

    };

    this.fnControlEjecucion = function (nodeEntidad, idejercicio, ejercicio) {
        //console.info(nodeEntidad);
        if (nodeEntidad != null) {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/inversiones/index.php/analisisinversiones/graficarControlEjecucion',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: idejercicio,
                    ejercicio: ejercicio
                },
                callback: function (options, success, response) {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $(function () {
                        $('#idcontrolejecucion_p1').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.controlejecucion_p1.getInnerHeight()
                            },
                            title: {
                                text: 'Control de la ejecuci\xF3n respecto al \xFAltimo ejercicio'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text,
                            },
                            xAxis: {
                                categories: resp.etapas,
                                crosshair: true
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: 'Miles de pesos'
                                }
                            },
                            tooltip: {
                                shared: true

                            },
                            plotOptions: {
                                column: {
                                    pointPadding: 0.2,
                                    borderWidth: 0
                                },
                                series: {
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            series: resp.columna,
                            exporting: {
                                enabled: true,
                                filename: 'Control de la ejecuci\xF3n respecto al \xFAltimo ejercicio',
                                url: "exportarGraficos"
                            }
                        });
                    });
                    $(function () {
                        $('#idcontrolejecucion_p2').highcharts({
                            title: {
                                text: 'Ejecuci\xF3n hist\xF3rica',
                                x: -20 //center
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text,
                            },
                            chart: {
                                type: 'spline',
                                height: _this.controlejecucion_p1.getInnerHeight()
                            },
                            xAxis: {
                                categories: resp.annos
                            },
                            yAxis: {
                                title: {
                                    text: 'Miles de pesos'
                                },
                                plotLines: [{
                                    value: 0,
                                    width: 1,
                                    color: '#808080'
                                }]
                            },
                            tooltip: {
                                valueSuffix: ' MP'
                            },
                            series: resp.puntos,
                            exporting: {
                                enabled: true,
                                filename: 'Ejecuci\xF3n hist\xF3rica',
                                url: "exportarGraficos"
                            }
                        });

                    });
                }
            });
        }

    };

    this.fnFormaPropiedad = function (nodeEntidad, idejercicio, ejercicio) {
        if (nodeEntidad != null) {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/inversiones/index.php/analisisinversiones/graficarFormaPropiedadYMonedas',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: idejercicio,
                    ejercicio: ejercicio
                },
                callback: function (options, success, response) {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $(function () {
                        $('#idfomapropiedad_p1').highcharts({
                            chart: {
                                plotBackgroundColor: null,
                                plotBorderWidth: null,
                                plotShadow: false,
                                type: 'pie',
                                height: _this.formapropiedad_p1.getInnerHeight()
                            },
                            title: {
                                text: 'Cantidad de inversiones(%) por forma de propiedad'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text,
                            },
                            tooltip: {
                                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> del total<br/>'
                            },
                            plotOptions: {
                                pie: {
                                    series: {
                                        dataLabels: {
                                            enabled: true,
                                            format: '{point.name}: {point.y:.1f}%'
                                        },
                                        shadow: true
                                    },
                                }
                            },
                            series: [{
                                name: 'Forma de propiedad',
                                colorByPoint: true,
                                data: resp.pastel
                            }]

                        });
                    });
                    //sustituir esta por Yanila
                    /* $(function() {
                     $('#idfomapropiedad_p3').highcharts({
                     chart: {
                     type: 'column',
                     height: _this.formapropiedad_p3.getInnerHeight()
                     },
                     title: {
                     text: 'Forma de propiedad - Tipo de moneda'
                     },
                     subtitle: {
                     text: 'Entidad: '+ nodeEntidad.text,
                     },
                     xAxis: {
                     categories: resp.columnas.formasPropiedad
                     },
                     yAxis: {
                     min: 0,
                     title: {
                     text: 'Miles de pesos'
                     },
                     stackLabels: {
                     enabled: true,
                     style: {
                     fontWeight: 'bold',
                     color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                     },
                     formatter: function () {
                     return this.total + " Moneda Total";
                     }
                     }
                     },
                     legend: {
                     align: 'right',
                     x: -30,
                     verticalAlign: 'top',
                     y: 25,
                     floating: true,
                     backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                     borderColor: '#CCC',
                     borderWidth: 0,
                     shadow: false
                     },
                     tooltip: {
                     //shared: true,
                     formatter: function() {
                     return '<b>' + this.x + '</b><br/>' +
                     this.series.name + ': ' + this.y + '<br/>' +
                     'Moneda Total: ' + this.point.stackTotal;
                     }
                     },
                     plotOptions: {
                     column: {
                     stacking: 'normal',
                     dataLabels: {
                     enabled: true,
                     color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                     style: {
                     textShadow: '0 0 3px black'
                     }
                     },
                     series:{
                     shadow: true
                     }
                     }
                     },
                     series: resp.columnas.datosgrafica
                     });

                     });*/
                    $(function () {
                        $('#idfomapropiedad_p3').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.formapropiedad_p3.getInnerHeight()
                            },
                            title: {
                                text: 'Inversiones por Forma de propiedad - Tipo de moneda'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text,
                            },
                            xAxis: {
                                categories: resp.columnas.formasPropiedad,
                                crosshair: true
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: 'Miles de pesos'
                                }
                            },
                            tooltip: {
                                shared: true

                            },
                            plotOptions: {
                                column: {
                                    pointPadding: 0.2,
                                    borderWidth: 0
                                },
                                series: {
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            series: resp.columnas.datosgrafica
                        });
                    });
                }
            });
        }

    };

    this.fnTipoCreditos = function (nodeEntidad, idejercicio, ejercicio) {
        if (nodeEntidad != null) {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/inversiones/index.php/analisisinversiones/graficarFinanciamiento',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: idejercicio,
                    ejercicio: ejercicio
                },
                callback: function (options, success, response) {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $(function () {
                        $('#idcredito_p1').highcharts({
                            chart: {
                                plotBackgroundColor: null,
                                plotBorderWidth: null,
                                plotShadow: false,
                                type: 'pie',
                                height: _this.credito_p1.getInnerHeight()
                            },
                            title: {
                                text: 'Cantidad de inversiones(%) por c\xF3mo se financia'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text,
                            },
                            tooltip: {
                                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> del total<br/>'
                            },
                            plotOptions: {
                                pie: {
                                    series: {
                                        dataLabels: {
                                            enabled: true,
                                            format: '{point.name}: {point.y:.1f}%'
                                        },
                                        shadow: true
                                    }
                                }
                            },
                            series: [{
                                name: 'C\xF3mo se financia',
                                colorByPoint: true,
                                data: resp.pastel
                            }]
                        });
                    });
                    /*$(function () {
                     $('#idcredito_p2').highcharts({
                     data: {
                     table: 'datatable'
                     },
                     chart: {
                     type: 'column',
                     height: _this.credito_p2.getInnerHeight()
                     },
                     title: {
                     text: 'Inversiones qui\xE9n financia'
                     },
                     subtitle: {
                     text: 'Entidad: '+ nodeEntidad.text,
                     },
                     xAxis: {
                     //                              categories: resp.columnas.denominacion
                     },
                     yAxis: {
                     min: 0,
                     title: {
                     text: 'Miles de pesos'
                     },
                     stackLabels: {
                     enabled: true,
                     style: {
                     fontWeight: 'bold',
                     color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                     }
                     }
                     },
                     legend: {
                     align: 'right',
                     x: -30,
                     verticalAlign: 'top',
                     y: 25,
                     floating: true,
                     backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                     borderColor: '#CCC',
                     borderWidth: 0,
                     shadow: false
                     },
                     tooltip: {
                     //shared: true,
                     formatter: function() {
                     return '<b>' + this.x + '</b><br/>' +
                     this.series.name + ': ' + this.y + '<br/>' +
                     'Moneda Total: ' + this.point.stackTotal;
                     }
                     },
                     plotOptions: {
                     column: {
                     stacking: 'normal',
                     dataLabels: {
                     enabled: true,
                     color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                     style: {
                     textShadow: '0 0 3px black'
                     }
                     }
                     },
                     series:{
                     shadow: true
                     }
                     },
                     series: resp.columnas.datosGr
                     });
                     });*/
                    $(function () {
                        $('#idcredito_p2').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.credito_p2.getInnerHeight()
                            },
                            title: {
                                text: 'Inversiones qui\xE9n financia - Tipo de moneda'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text,
                            },
                            xAxis: {
                                categories: resp.columnas.denominacion,
                                crosshair: true
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: 'Miles de pesos'
                                }
                            },
                            tooltip: {
                                shared: true

                            },
                            plotOptions: {
                                column: {
                                    pointPadding: 0.2,
                                    borderWidth: 0
                                },
                                series: {
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            series: resp.columnas.datosGr
                        });
                    });

                    $(function () {
                        $('#idcredito_p3').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.credito_p2.getInnerHeight()
                            },
                            title: {
                                text: 'Inversiones c\xF3mo se financia - Tipo de moneda'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text,
                            },
                            xAxis: {
                                categories: resp.grComoMonedas.categorias,
                                crosshair: true
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: 'Miles de pesos'
                                }
                            },
                            tooltip: {
                                shared: true

                            },
                            plotOptions: {
                                column: {
                                    pointPadding: 0.2,
                                    borderWidth: 0
                                },
                                series: {
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            series: resp.grComoMonedas.datosgrafica
                        });
                    });
                }
            });
        }
    };

    this.fnCostoInversion = function (nodeEntidad, idejercicio, ejercicio) {
        if (nodeEntidad != null) {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/inversiones/index.php/analisisinversiones/graficarMasCostosas',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: idejercicio,
                    ejercicio: ejercicio
                },
                callback: function (options, success, response) {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $(function () {
                        $('#idcostoinversion_p1').highcharts({
                            data: {
                                table: 'datatable'
                            },
                            chart: {
                                type: 'column',
                                zoomType: 'xy',
                                height: _this.costoinversion_p1.getInnerHeight()
                            },
                            title: {
                                text: 'Inversiones m\xE1s costosas seg\xFAn el presupuesto'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text,
                            },
                            xAxis: {
                                categories: resp.columnas.denominacionInversiones,
                                type: 'category',
                                labels: {
                                    //rotation: -20,
                                    style: {
                                        fontSize: '10px',
                                        //fontFamily: 'Verdana, sans-serif'
                                    }
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Miles de pesos'
                                }

                            },
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y:.1f}'
                                    },
                                    shadow: true
                                }
                            },
                            series: resp.columnas.datosgrafica
                        });
                    });
                }
            });
        }

    };

    this.fnEquipos = function (nodeEntidad, idejercicio, ejercicio) {
        if (nodeEntidad != null) {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/inversiones/index.php/analisisinversiones/graficarEquipos',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: idejercicio,
                    ejercicio: ejercicio
                },
                callback: function (options, success, response) {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $(function () {
                        $('#idequipos_norte_p1').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.equipos_norte_p1.getInnerHeight()
                            },
                            title: {
                                text: 'Cantidad de equipos por equipos gen\xE9ricos'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text,
                            },
                            xAxis: {
                                type: 'category',
                                labels: {
                                    //rotation: -20,
                                    style: {
                                        fontSize: '10px',
                                    }
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Cantidad'
                                }
                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true

                                }
                            },
                            tooltip: {
                                //headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
                            },
                            series: [{
                                colorByPoint: true,
                                data: resp.columnasGenerico.datosgrafica
                            }]
                        });
                    });

                    $(function () {
                        $('#idequipos_norte_p2').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.equipos_norte_p2.getInnerHeight()
                            },
                            title: {
                                text: 'Cantidad de equipos por plan'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text,
                            },
                            xAxis: {
                                type: 'category',
                                labels: {
                                    //rotation: -20,
                                    style: {
                                        fontSize: '10px',
                                        //fontFamily: 'Verdana, sans-serif'
                                    }
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Cantidad'
                                }

                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            tooltip: {
                                //headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
                            },
                            series: [{
                                colorByPoint: true,
                                data: resp.columnasPlan.datosgrafica
                            }]
                        });
                    });
                    $(function () {
                        $('#idequipos_sur_p1').highcharts({
                            chart: {
                                type: 'bar',
                                height: _this.equipos_sur_p1.getInnerHeight()
                            },
                            title: {
                                text: 'Cantidad de equipos por forma de adquisici\xF3n'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text,
                            },
                            xAxis: {
                                categories: resp.barras.denomVias,
                                title: {
                                    text: null
                                }
                            },
                            yAxis: {
                                min: 0,
                                /* title: {
                                 text: 'Population (millions)',
                                 align: 'high'
                                 },
                                 labels: {
                                 overflow: 'justify'
                                 }*/
                                title: {
                                    text: ' '
                                }
                            },
                            tooltip: {
                                valueSuffix: ' '
                            },
                            plotOptions: {
                                bar: {
                                    dataLabels: {
                                        enabled: true
                                    }
                                },
                                series: {
                                    shadow: true
                                }
                            },
                            legend: {
                                layout: 'vertical',
                                align: 'right',
                                verticalAlign: 'top',
                                x: -40,
                                y: 80,
                                floating: true,
                                borderWidth: 1,
                                backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                                shadow: true
                            },
                            credits: {
                                enabled: false
                            },
                            series: [resp.barras.datosgrafica]
                        });
                    });
                }
            });
        }

    };

    this.fnMasEquipos = function (nodeEntidad, idejercicio, ejercicio) {
        if (nodeEntidad != null) {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/inversiones/index.php/analisisinversiones/graficarMasEquipos',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: idejercicio,
                    ejercicio: ejercicio
                },
                callback: function (options, success, response) {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $(function () {
                        $('#idmasequipos_norte_p1').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.masequipos_norte_p1.getInnerHeight()
                            },
                            title: {
                                text: 'Inversiones con m\xE1s equipos'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text,
                            },
                            xAxis: {
                                type: 'category',
                                labels: {
                                    //rotation: -20,
                                    style: {
                                        fontSize: '10px',
                                        //fontFamily: 'Verdana, sans-serif'
                                    }
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Cantidad de equipos'
                                }
                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            tooltip: {
                                //headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
                            },
                            series: [{
                                //name: "Brands",
                                colorByPoint: true,
                                data: resp.columnas.datosgrafica
                            }]
                        });
                    });


                }
            });
        }

    };


    this.fnTipoInversion = function (nodeEntidad, idejercicio, ejercicio) {
        if (nodeEntidad != null) {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/inversiones/index.php/analisisinversiones/graficarTipoInversion',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: idejercicio,
                    ejercicio: ejercicio
                },
                callback: function (options, success, response) {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $(function () {
                        $('#idtipoinversion_p1').highcharts({
                            chart: {
                                plotBackgroundColor: null,
                                plotBorderWidth: null,
                                plotShadow: false,
                                type: 'pie',
                                height: _this.tipoinversion_p1.getInnerHeight()
                            },
                            title: {
                                text: 'Cantidad de inversiones por tipo'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text,
                            },
                            tooltip: {
                                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> del total<br/>'
                            },
                            plotOptions: {
                                pie: {
                                    series: {
                                        dataLabels: {
                                            enabled: true,
                                            format: '{point.name}: {point.y:.1f}%'
                                        },
                                        shadow: true
                                    },
                                }
                            },
                            series: [{
                                name: 'Forma de propiedad',
                                colorByPoint: true,
                                data: resp.pastel
                            }]

                        });
                    });

                    /*$(function() {
                     $('#idtipoinversion_p2').highcharts({
                     chart: {
                     type: 'column',
                     height: _this.tipoinversion_p2.getInnerHeight()
                     },
                     title: {
                     text: 'Tipo de inversi\xF3n - Tipo de moneda'
                     },
                     subtitle: {
                     text: 'Entidad: '+ nodeEntidad.text,
                     },
                     xAxis: {
                     categories: resp.columnas.denominacionTipoInversiones
                     },
                     yAxis: {
                     min: 0,
                     title: {
                     text: 'Miles de pesos'
                     },
                     stackLabels: {
                     enabled: true,
                     style: {
                     fontWeight: 'bold',
                     color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                     },
                     formatter: function () {
                     return this.total + " Moneda Total";
                     }
                     }
                     },
                     legend: {
                     align: 'right',
                     x: -30,
                     verticalAlign: 'top',
                     y: 25,
                     floating: true,
                     backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                     borderColor: '#CCC',
                     borderWidth: 0,
                     shadow: false
                     },
                     tooltip: {
                     //shared: true,
                     formatter: function() {
                     return '<b>' + this.x + '</b><br/>' +
                     this.series.name + ': ' + this.y + '<br/>' +
                     'Moneda Total: ' + this.point.stackTotal;
                     }
                     },
                     plotOptions: {
                     column: {
                     stacking: 'normal',
                     dataLabels: {
                     enabled: true,
                     color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                     style: {
                     textShadow: '0 0 3px black'
                     }
                     },
                     series:{
                     shadow: true
                     }
                     }
                     },
                     series: resp.columnas.datosgrafica
                     });

                     });*/
                    $(function () {
                        $('#idtipoinversion_p2').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.tipoinversion_p2.getInnerHeight()
                            },
                            title: {
                                text: 'Tipo de inversi\xF3n - Tipo de moneda'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text,
                            },
                            xAxis: {
                                categories: resp.columnas.denominacionTipoInversiones,
                                crosshair: true
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: 'Miles de pesos'
                                }
                            },
                            tooltip: {
                                shared: true

                            },
                            plotOptions: {
                                column: {
                                    pointPadding: 0.2,
                                    borderWidth: 0
                                },
                                series: {
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            series: resp.columnas.datosgrafica
                        });
                    });
                }
            });
        }

    };

    this.fnPlanPreparacion = function (nodeEntidad, idejercicio, ejercicio) {
        if (nodeEntidad != null) {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/inversiones/index.php/analisisinversiones/graficarPlanPreparacion',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: idejercicio,
                    ejercicio: ejercicio
                },
                callback: function (options, success, response) {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();

                    $(function () {
                        $('#idplanprepracion_norte_p1').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.planprepracion_norte_p1.getInnerHeight()
                            },
                            title: {
                                text: 'Plan de preparaci\xF3n por monedas'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text,
                            },
                            xAxis: {
                                type: 'category',
                                labels: {
                                    //rotation: -20,
                                    style: {
                                        fontSize: '10px',
                                        //fontFamily: 'Verdana, sans-serif'
                                    }
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Monto en Miles de Pesos'
                                }

                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            tooltip: {
                                //headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
                            },
                            series: [{
                                colorByPoint: true,
                                data: resp.columnasPlanP.datosgrafica
                            }]
                        });
                    });

                }
            });
        }
    };

    this.fnEquiposCentrobalance = function (nodeEntidad, idejercicio, ejercicio) {
        if (nodeEntidad != null) {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/inversiones/index.php/analisisinversiones/graficarEquiposOrganoSatisface',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: idejercicio,
                    ejercicio: ejercicio
                },
                callback: function (options, success, response) {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();

                    $(function () {
                        $('#idequipoCentrobalance_norte_p1').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.equipoCentrobalance_norte_p1.getInnerHeight()
                            },
                            title: {
                                text: 'Equipos por \xD3rgano que satisface'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text,
                            },
                            xAxis: {
                                type: 'category',
                                labels: {
                                    //rotation: -20,
                                    style: {
                                        fontSize: '10px',
                                        //fontFamily: 'Verdana, sans-serif'
                                    }
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Cantidad de eqipos'
                                }

                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            tooltip: {
                                //headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
                            },
                            series: [{
                                colorByPoint: true,
                                data: resp.columnasPlanP.datosgrafica
                            }]
                        });
                    });

                }
            });
        }
    };

    this.fnEquiposSectorestrategico = function (nodeEntidad, idejercicio, ejercicio) {
        if (nodeEntidad != null) {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/inversiones/index.php/analisisinversiones/graficarEquiposSectorEstrategico',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: idejercicio,
                    ejercicio: ejercicio
                },
                callback: function (options, success, response) {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $(function () {
                        $('#idequiposSector_norte_p1').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.equiposSector_norte_p1.getInnerHeight()
                            },
                            title: {
                                text: 'Cantidad de Equipos por sector estrat\xE9gico'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text,
                            },
                            xAxis: {
                                type: 'category',
                                labels: {
                                    rotation: -30,
                                    style: {
                                        fontSize: '10px',
                                        //fontFamily: 'Verdana, sans-serif'
                                    }
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Cantidad de equipos'
                                }

                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            tooltip: {
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
                            },
                            series: [{
                                colorByPoint: true,
                                data: resp.grEquiposSF.datosgrafica
                            }]
                        });

                        $('#idequiposSector_norte_p2').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.equiposSector_norte_p2.getInnerHeight()
                            },
                            title: {
                                text: 'Monto de Equipos por tipo de moneda'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text
                            },
                            xAxis: {
                                categories: resp.grEquiposM.categorias,
                                crosshair: true,
                                labels: {
                                    rotation: -30,
                                    style: {
                                        fontSize: '10px',
                                        //fontFamily: 'Verdana, sans-serif'
                                    }
                                }
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: 'Miles de pesos'
                                }
                            },
                            tooltip: {
                                shared: true

                            },
                            plotOptions: {
                                column: {
                                    pointPadding: 0.2,
                                    borderWidth: 0
                                },
                                series: {
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            series: resp.grEquiposM.datosgrafica
                        });


                    });

                }
            });
        }
    };


    this.fnEquiposOrganoSectorestrategico = function (nodeEntidad, idejercicio, ejercicio) {
        if (nodeEntidad != null) {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/inversiones/index.php/analisisinversiones/graficarEquiposOrganoSectorEstrategico',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: idejercicio,
                    ejercicio: ejercicio
                },
                callback: function (options, success, response) {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $(function () {
                        $('#idequipoOrganoSector').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.equipoOrganoSector.getInnerHeight()
                            },
                            title: {
                                text: ''
                            },
                            xAxis: {
                                categories: resp.grEquiposOrg.categorias
                            },
                            yAxis: [{
                                min: 0,
                                title: {
                                    text: 'Cantidad de equipos'
                                }
                            }, {
                                title: {
                                    text: ' '
                                },
                                opposite: true
                            }],
                            legend: {
                                shadow: false
                            },
                            tooltip: {
                                shared: true
                            },
                            plotOptions: {
                                column: {
                                    grouping: false,
                                    shadow: false,
                                    borderWidth: 0
                                }
                            },
                            series: resp.grEquiposOrg.datosgrafica/*[{
                             name: 'Employees',
                             color: 'rgba(165,170,217,1)',
                             data: [150, 73, 20],
                             pointPadding: 0.3,
                             pointPlacement: -0.2
                             }, {
                             name: 'Employees Optimized',
                             color: 'rgba(126,86,134,.9)',
                             data: [140, 90, 40],
                             pointPadding: 0.4,
                             pointPlacement: -0.2
                             }, {
                             name: 'Profit',
                             color: 'rgba(248,161,63,1)',
                             data: [183.6, 178.8, 198.5],
                             tooltip: {
                             valuePrefix: '$',
                             valueSuffix: ' M'
                             },
                             pointPadding: 0.3,
                             pointPlacement: 0.2,
                             yAxis: 1
                             }, {
                             name: 'Profit Optimized',
                             color: 'rgba(186,60,61,.9)',
                             data: [203.6, 198.8, 208.5],
                             tooltip: {
                             valuePrefix: '$',
                             valueSuffix: ' M'
                             },
                             pointPadding: 0.4,
                             pointPlacement: 0.2,
                             yAxis: 1
                             }]*/
                        });


                    });

                }
            });
        }
    };

    this.fnInversionesObjetivo = function (nodeEntidad, idejercicio, ejercicio) {

        if (nodeEntidad != null) {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/inversiones/index.php/analisisinversiones/graficarInversionesObjetivos',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: idejercicio,
                    ejercicio: ejercicio
                },
                callback: function (options, success, response) {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $(function () {

                        $('#idinversionesobjetivos_p1').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.inversionesobjetivos_p1.getInnerHeight()
                            },
                            title: {
                                text: 'Cantidad de inversiones por objetivo'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text
                            },
                            xAxis: {
                                type: 'category',
                                labels: {
                                    style: {
                                        fontSize: '10px'
                                    }
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Cantidad de inversiones'
                                }
                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            tooltip: {
                                //headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
                            },
                            series: [{
                                colorByPoint: true,
                                data: resp.datosgrafica
                            }]
                        });

                        $('#idinversionesobjetivos_p2').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.inversionesobjetivos_p2.getInnerHeight()
                            },
                            title: {
                                text: 'Objetivos - Tipo de moneda'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text
                            },
                            xAxis: {
                                categories: resp.objetivos,
                                crosshair: true
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: 'Miles de pesos'
                                }
                            },
                            tooltip: {
                                shared: true

                            },
                            plotOptions: {
                                column: {
                                    pointPadding: 0.2,
                                    borderWidth: 0
                                },
                                series: {
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            series: resp.datosgraficaI
                        });

                    });

                }
            });
        }

    };

    this.fnInversionesEfecto = function (nodeEntidad, idejercicio, ejercicio) {

        if (nodeEntidad != null) {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/inversiones/index.php/analisisinversiones/graficarInversionesEfectos',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: idejercicio,
                    ejercicio: ejercicio
                },
                callback: function (options, success, response) {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $(function () {

                        $('#idinversionesefectos_p1').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.inversionesefectos_p1.getInnerHeight()
                            },
                            title: {
                                text: 'Cantidad de inversiones por efecto'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text
                            },
                            xAxis: {
                                type: 'category',
                                labels: {
                                    style: {
                                        fontSize: '10px'
                                    }
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Cantidad de inversiones'
                                }
                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            tooltip: {
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
                            },
                            series: [{
                                colorByPoint: true,
                                data: resp.datosgrafica
                            }]
                        });

                        $('#idinversionesefectos_p2').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.inversionesefectos_p2.getInnerHeight()
                            },
                            title: {
                                text: 'Efectos - Tipo de moneda'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text
                            },
                            xAxis: {
                                categories: resp.objetivos,
                                crosshair: true
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: 'Miles de pesos'
                                }
                            },
                            tooltip: {
                                shared: true

                            },
                            plotOptions: {
                                column: {
                                    pointPadding: 0.2,
                                    borderWidth: 0
                                },
                                series: {
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            series: resp.datosgraficaI
                        });

                    });

                }
            });
        }

    };

    this.fnInversionesMedioambiente = function (nodeEntidad, idejercicio, ejercicio) {

        if (nodeEntidad != null) {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/inversiones/index.php/analisisinversiones/graficarInversionesSectoresCuencas',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: idejercicio,
                    ejercicio: ejercicio
                },
                callback: function (options, success, response) {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $(function () {

                        $('#idinversionessectorescuencas_p1').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.inversionessectorescuencas_p1.getInnerHeight()
                            },
                            title: {
                                text: 'Cantidad de inversiones por sector'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text
                            },
                            xAxis: {
                                type: 'category',
                                labels: {
                                    style: {
                                        fontSize: '10px'
                                    }
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Cantidad de inversiones'
                                }
                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            tooltip: {
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
                            },
                            series: [{
                                colorByPoint: true,
                                data: resp.datosgrafica
                            }]
                        });

                        $('#idinversionessectorescuencas_p2').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.inversionessectorescuencas_p2.getInnerHeight()
                            },
                            title: {
                                text: 'Sectores - Tipo de moneda'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text
                            },
                            xAxis: {
                                categories: resp.objetivos,
                                crosshair: true
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: 'Miles de pesos'
                                }
                            },
                            tooltip: {
                                shared: true

                            },
                            plotOptions: {
                                column: {
                                    pointPadding: 0.2,
                                    borderWidth: 0
                                },
                                series: {
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            series: resp.datosgraficaI
                        });

                        $('#idinversionessectorescuencas_p3').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.inversionessectorescuencas_p3.getInnerHeight()
                            },
                            title: {
                                text: 'Cantidad de inversiones por cuenca'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text
                            },
                            xAxis: {
                                type: 'category',
                                labels: {
                                    style: {
                                        fontSize: '10px'
                                    }
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Cantidad de inversiones'
                                }
                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            tooltip: {
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
                            },
                            series: [{
                                colorByPoint: true,
                                data: resp.datosgraficaC
                            }]
                        });

                        $('#idinversionessectorescuencas_p4').highcharts({
                            chart: {
                                type: 'column',
                                height: _this.inversionessectorescuencas_p4.getInnerHeight()
                            },
                            title: {
                                text: 'Cuencas - Tipo de moneda'
                            },
                            subtitle: {
                                text: 'Entidad: ' + nodeEntidad.text
                            },
                            xAxis: {
                                categories: resp.objetivosC,
                                crosshair: true
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: 'Miles de pesos'
                                }
                            },
                            tooltip: {
                                shared: true

                            },
                            plotOptions: {
                                column: {
                                    pointPadding: 0.2,
                                    borderWidth: 0
                                },
                                series: {
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    },
                                    shadow: true
                                }
                            },
                            series: resp.datosgraficaIC
                        });

                    });

                }
            });
        }

    };

};
