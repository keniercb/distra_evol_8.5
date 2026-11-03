Ext.ns('Ext.Person');

Ext.Person.Compartimentacion = Ext.extend(Ext.Panel, {
    title: 'Compartimentaci&oacute;n',
    layout: 'fit',

    initComponent: function ()
    {

        this.TreeConcept = new Ext.Person.CompartimentacionConceptos({
            idproyecto: this.idproyecto
        });

        this.items = [this.TreeConcept];

        Ext.Person.Compartimentacion.superclass.initComponent.call(this);
    }
});