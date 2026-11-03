/**
 *Componente para gestionar imagenes.
 *
 * @extends Ext.Window
 * @xtype
 * @autor   Linea Capital Humano - Ing. Yoan Uría Rodríguez
 * @version 2.0.0
 */
Ext.ns("Ext.Component.Catalogoimagenes");

/**
 * @class Ext.Component.SliderTip
 * @extends Ext.Tip
 * Simple plugin for using an Ext.Tip with a slider to show the slider value
 */
Ext.Component.SliderTip = Ext.extend(Ext.Tip, {
    minWidth: 10,
    offsets: [0, -10],
    init: function (slider)
    {
        slider.on('dragstart', this.onSlide, this);
        slider.on('drag', this.onSlide, this);
        slider.on('dragend', this.hide, this);
        slider.on('destroy', this.destroy, this);
    },

    onSlide: function (slider)
    {
        this.show();
        this.body.update(this.getText(slider));
        this.doAutoWidth();
        this.el.alignTo(slider.thumb, 'b-t?', this.offsets);
    },

    getText: function (slider)
    {
        return slider.getValue();
    }
});

Ext.Component.Catalogoimagenes.GestionarImagenes = Ext.extend(Ext.Window, {
    closeAction: 'hide',
    width: '70%',
    height: 400,
    maximizable: true,
    modal: true,
    layout: 'border',
    cls: 'img-chooser-dlg',
    initComponent: function ()
    {
        var self = this;


        /*XTemplate para el DataView*/
        this.xtDataView = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="img-chooser-view thumb-wrap">',
            '<tpl if="this.isPrincipal(principal)">',
            '<div style="position: fixed; width: {width}px; padding-left: 4px;">',
            '<div style="float: right" class="imagen">',
            '<img src="../../views/images/icons/corner.png">',
            '</div>',
            '</div>',
            '</tpl>',
            '<tpl if="this.isPrincipal(principal) == true">',
            '<div id="{idimagen} "class="thumb-p"><img src="{foto}" width="{width}px" height="{height}px"></div>',
            '</tpl>',
            '<tpl if="this.isPrincipal(principal) == false">',
            '<div id="{idimagen} "class="thumb"><img src="{foto}" width="{width}px" height="{height}px"></div>',
            '</tpl>',
            '</div>',
            '</div>',
            '</tpl>', {
                isPrincipal: function (principal)
                {
                    return principal == 1 ? 1 : 0;
                }
            }
        );

        this.xtDetails = new Ext.XTemplate(
            '<div class="img-chooser-dlg details">',
            '<tpl for=".">',
//            '<img src="data:image/jpg;base64, {foto}" width="96px" height="96px">',
            '<img src="{foto}" width="96px" height="96px">',
            '<div class="img-chooser-dlg details-info">',
            '<b>' + this.idioma.lbnombre + '</b>',
            '<span>{denominacion}</span>',
            '<b>' + this.idioma.lbtamanno + '</b>',
            '<span>{size}</span>',
            '<b>' + this.idioma.lbfechainicio + '</b>',
            '<span>{fechainicio}</span>',
            '<b>' + this.idioma.lbfechafin + '</b>',
            '<span>{fechafin}</span>',
            '</div>',
            '</tpl>',
            '</div>'
        );

        this.xtDetails.compile();
        this.xtDataView.compile();

        /*Store del DataView*/
        this.stCatalogoImagenes = new Ext.data.Store({
            autoLoad: this.autoCarga,
            url: this.url,
            reader: new Ext.data.JsonReader({
                    totalProperty: "cant",
                    root: "datos",
                    id: "idimagen" },
                [
                    {name: 'idimagen'},
                    {name: 'url'},
                    {name: 'denominacion'},
                    {name: 'fechainicio'},
                    {name: 'fechafin'},
                    {name: 'width', convert: function (arr)
                    {
                        if (!arr) {
                            return self.widthImagen || 16;
                        }
                    }},
                    {name: 'height', convert: function (arr)
                    {
                        if (!arr) {
                            return self.heightImagen || 16;
                        }
                    }},
                    {name: 'foto'},
                    {name: 'imgbase64'},
                    {name: 'descripcion'},
                    {name: 'principal', defaultValue: 0}
                ]),
            listeners: {
                beforeload: function ()
                {
                    this.sldSizeView.setValue(16);
                }.createDelegate(this)
            }
        });

        //paginado el visor de imagenes
        this.ptbCatalogoImagenes = new Ext.PagingToolbar({
            pageSize: 25,
            store: this.stCatalogoImagenes,
            displayInfo: true,
            displayMsg: 'Resultados de {0} - {1} de {2}',
            emptyMsg: "No hay resultados para mostrar.",
            items: ['-']
        });

        /*DataView para mostrar la imagenes*/
        var catalogoConfig = {
            title: this.idioma.dvCataImagenes,
            border: false,
            singleSelect: true,
            store: this.stCatalogoImagenes,
            tpl: this.xtDataView,
            autoScroll: true,
            overClass: 'x-view-over',
            itemSelector: 'div.thumb-wrap',
            emptyText: '<div style="padding:10px;">No hay imagenes</div>',
            listeners: {
                click: function (d, i, n, e)
                {
                    var detailEl = Ext.getCmp('detail' + this.id).body;
                    detailEl.hide();
                    this.xtDetails.overwrite(detailEl, d.getRecord(n).data);
                    detailEl.slideIn('l', {stopFx: true, duration: .2});
                }.createDelegate(this)
            }
        };
        catalogoConfig.multiSelect = this.multiSelect || false;

        this.dvCatalogoImagenes = new Ext.DataView(catalogoConfig);

        this.tipplugins = new Ext.Component.SliderTip({
            getText: function (slider)
            {
                return String.format('<b>{0}x{0}</b>', slider.getValue());
            }
        });

        this.sldSizeView = new Ext.Slider({
            width: 214,
            value: 16,
            increment: 16,
            minValue: 16,
            maxValue: 112,
            plugins: this.tipplugins,
            listeners: {
                beforechange: function (sl, newValue, oldValue)
                {
                    Ext.each(this.stCatalogoImagenes.getRange(), function (rec)
                    {
                        rec.set('width', newValue);
                        rec.set('height', newValue);
                    })
                    this.dvCatalogoImagenes.refresh();
                }.createDelegate(this)
            }
        })

        if (!this.tbar && this.scalable) {
            this.tbar = [this.idioma.sizeview, this.sldSizeView];
        } else
            if (this.tbar instanceof Ext.Toolbar) {
            } else
                if (this.scalable) {
                    this.tbar.push('-');
                    this.tbar.push(this.idioma.sizeview);
                    this.tbar.push(this.sldSizeView);
                }

        this.bbar = this.ptbCatalogoImagenes

        this.items = [
            {
                region: 'center',
                cls: 'img-chooser-view',
                split: true,
                margins: '5 0 5 5',
                width: '70%',
                autoScroll: true,
                minWidth: 350,
                items: this.dvCatalogoImagenes
            },
            {
                region: 'east',
                id: 'detail' + this.id,
                split: true,
                margins: '5 5 5 0',
                width: '30%',
                minWidth: 150
            }
        ]

        this.title = this.idioma.winTitulo;

        Ext.Component.Catalogoimagenes.GestionarImagenes.superclass.initComponent.call(this);
    }.createInterceptor(function ()
        {
            this.idioma = Ext.Component.Catalogoimagenes.idioma;
        }),
    getSelection: function ()
    {
        return this.dvCatalogoImagenes.getSelectedRecords();
    },
    loadImages: function (objParams)
    {
        this.stCatalogoImagenes.load({
            params: objParams || {}
        })
    },
    getStore: function ()
    {
        return this.stCatalogoImagenes;
    },
    getDataView: function ()
    {
        return this.dvCatalogoImagenes;
    },
    setEscalaValue: function (v)
    {
        this.sldSizeView.setValue(v || 16);
    }
});