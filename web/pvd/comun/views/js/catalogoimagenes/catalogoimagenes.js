/**
 *Componente para gestionar imagenes.
 *
 * @extends Ext.Window
 * @xtype
 * @autor   Linea Capital Humano - Ing. Yoan Uría Rodríguez
 * @version 2.0.0
 */
Ext.ns("Ext.Component.Catalogoimagenes");

Ext.Component.Catalogoimagenes.GestionarImagenes = Ext.extend(Ext.Window, {
    title: 'Catalogo de imagenes',
    closeAction: 'hide',
    width: '70%',
    height: 400,
    modal: true,
    layout: 'border',
    id: 'img-chooser-dlg',
    initComponent: function() {
        var self = this;

        this.widthImagen = (this.widthImagen) ? 'width = ' + this.widthImagen : 'width = 80px',
                this.heightImagen = (this.heightImagen) ? 'height = ' + this.heightImagen : 'height = 60px',
                /*XTemplate para el DataView*/
                this.xtDataView = new Ext.XTemplate(
                        '<tpl for=".">',
                        '<div class="thumb-wrap" id="{idimagen}">',
                        '<div class="thumb"><img src="{url}" ' + this.widthImagen + ' ' + this.heightImagen + '></div>',
                        '</div>',
                        '</tpl>'
                        );

        this.xtDetails = new Ext.XTemplate(
                '<div class="details">',
                '<tpl for=".">',
                '<img src="{url}">',
                '<div class="details-info">',
                '<b>Nombre</b>',
                '<span>{denominacion}</span>',
                '<b>Denominaci&oacute;n</b>',
                '<span>{size}</span>',
                '<b>Fecha inicio</b>',
                '<span>{fechainicio}</span>',
                '<b>Fecha fin</b>',
                '<span>{fechafin}</span>',
                '</div>',
                '</tpl>',
                '</div>'
                );

        this.xtDetails.compile();
        this.xtDataView.compile();


        /*Store del DataView*/
        this.stCatalogoImagenes = new Ext.data.Store({
            autoLoad: true,
            url: self.url,
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "idimagen"},
            [
                {name: 'idimagen'},
                {name: 'url'},
                {name: 'denominacion'},
                {name: 'fechainicio'},
                {name: 'fechafin'},
                {name: 'size'}
            ])

        });

        //paginado el visor de imagenes
        this.ptbCatalogoImagenes = new Ext.PagingToolbar({
            pageSize: 25,
            store: self.stCatalogoImagenes,
            displayInfo: true,
            displayMsg: 'Resultados de {0} - {1} de {2}',
            emptyMsg: "No hay resultados para mostrar.",
            items: ['-']
        });

        /*DataView para mostrar la imagenes*/
        this.dvCatalogoImagenes = new Ext.DataView({
            title: 'Visor de imagenes',
            singleSelect: (self.singleSelect == null) ? true : self.singleSelect,
            border: false,
            store: self.stCatalogoImagenes,
            tpl: self.xtDataView,
            style: 'overflow:auto',
            overClass: 'x-view-over',
            itemSelector: 'div.thumb-wrap',
            emptyText: '<div style="padding:10px;">No existen imagenes para mostrar</div>',
            listeners: {
                click: function(d, i, n, e) {
                    var detailEl = Ext.getCmp('img-detail-panel').body;
                    detailEl.hide();
                    this.xtDetails.overwrite(detailEl, d.getRecord(n).data);
                    detailEl.slideIn('l', {stopFx: true, duration: .2});
                }.createDelegate(this)
            }
        });

        this.bbar = this.ptbCatalogoImagenes;

        this.items = [{
                region: 'center',
                id: 'img-chooser-view',
                split: true,
                margins: '5 0 5 5',
                width: '70%',
                minWidth: 350,
                items: this.dvCatalogoImagenes
            }, {
                region: 'east',
                id: 'img-detail-panel',
                split: true,
                margins: '5 5 5 0',
                width: '30%',
                minWidth: 150
            }];

        this.title = 'Cat&aacute;logo de imagenes';

        Ext.Component.Catalogoimagenes.GestionarImagenes.superclass.initComponent.call(this);

    }.createInterceptor(function() {
        this.idioma = Ext.Component.Catalogoimagenes.idioma;
    }),
    getSelected: function() {
        return this.dvCatalogoImagenes.getSelectedRecords();
    },
    getStore: function() {
        return this.stCatalogoImagenes;
    }
});
