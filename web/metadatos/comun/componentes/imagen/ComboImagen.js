Ext.ns('Nomenclador');
Nomenclador.ImagenCombo = Ext.extend(Ext.form.ComboBox, {
		ancho        : 16,
		height        : 16,
		fieldLabel   : 'Ícono',
		parent       : 'grado',
		type         : new Array(),
		valueField   : 'idicono',
		mode         : 'local',
		displayField : 'denominacion',
		name         : 'icono',
		triggerAction: 'all',
		anchor       : '100%',
		initComponent: function ()
		{
				if (this.parent == 'grado') {
						this.ancho = 30;
				} else {
						if (this.parent == 'logo') {
								this.ancho = 90;
								this.height = 40;
						}
				}
				Ext.apply(this, {
						tpl: '<tpl for=".">' + '<div class="x-combo-list-item ux-icon-combo-item"  ><img src="{icono}" width="' + this.ancho + 'px" height="' + this.height + 'px" align="absmiddle"/>&nbsp;&nbsp ' + '{' + this.displayField + '}' + '</div></tpl>'
				});
				Nomenclador.ImagenCombo.superclass.initComponent.call(this);
		},
		onRender     : function (ct, position)
		{
				Nomenclador.ImagenCombo.superclass.onRender.call(this, ct, position);
				this.wrap.applyStyles({position: 'relative'});
				this.el.addClass('ux-icon-combo-input');
		},
		setValue     : function (value)
		{
				Nomenclador.ImagenCombo.superclass.setValue.call(this, value);
		}
});
Ext.reg('imagencombo', Nomenclador.ImagenCombo);
