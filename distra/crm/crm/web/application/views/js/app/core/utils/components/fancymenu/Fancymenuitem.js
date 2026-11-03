/**
 * @class CRM.ux.Fancymenuitem
 * @extends Ext.menu.Item
 * Componente que crea un MenuItem utilizando CSS3
 * @constructor
 * Crea un nuevo Objeto.
 * @param {Object} cfg Opciones de configuracion
 * @category Componente
 * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @version 1.0
 */

Ext.define('CRM.ux.fancymenu.Fancymenuitem', {
    extend: 'Ext.menu.Item',
    alias: 'widget.fancymenuitem',

	defaultComponentLayoutType: false,

	autoEl: {
		tag: 'li',
		cls: ' '
	},
	
	renderTpl: [
		'<a href="#">',
			'<span class="ca-icon {iconCls}"></span>',
			'<div class="ca-content">',
				'<h2 class="ca-main" unselectable="on">{text}</h2>',
				'<h3 class="ca-sub" unselectable="on">{description}</h3>',
			'</div>',
            '<span class="ca-pin" id="pin-container-{id}"></span>',
		'</a>',
	],
	
	beforeRender: function() {
        var me = this,
            blank = Ext.BLANK_IMAGE_URL,
            glyph = me.glyph,
            glyphFontFamily = Ext._glyphFontFamily,
            glyphParts, iconCls, arrowCls;

        me.callParent();

        if (me.iconAlign === 'right') {
            iconCls = me.checkChangeDisabled ? me.disabledCls : '';
            arrowCls = Ext.baseCSSPrefix + 'menu-item-icon-right ' + me.iconCls;
        } else {
            iconCls = (me.iconCls || '') + (me.checkChangeDisabled ? ' ' + me.disabledCls : '');
            arrowCls = me.menu ? me.arrowCls : '';
        }

        if (typeof glyph === 'string') {
            glyphParts = glyph.split('@');
            glyph = glyphParts[0];
            glyphFontFamily = glyphParts[1];
        }

        Ext.applyIf(me.renderData, {
            href: me.href || '#',
            hrefTarget: me.hrefTarget,
            icon: me.icon,
            iconCls: iconCls,
            glyph: glyph,
            glyphCls: glyph ? Ext.baseCSSPrefix + 'menu-item-glyph' : undefined,
            glyphFontFamily: glyphFontFamily,
            hasIcon: !!(me.icon || me.iconCls || glyph),
            iconAlign: me.iconAlign,
            plain: me.plain,
            text: me.text,
			id: me.id,
            description: me.description || null,
            arrowCls: arrowCls,
            blank: blank,
            tabIndex: me.tabIndex
        });
    },
	
	constructor: function(cfg){
	
		this.callParent(arguments);
		
		if(!cfg.description){
			this.renderTpl = [
				'<a href="#">',
					'<span class="ca-icon {iconCls}"></span>',
					'<div class="ca-content">',
						'<h2 class="ca-main" unselectable="on">{text}</h2>',
					'</div>',
                    '<span class="ca-pin greycolor" id="pin-container-{id}"></span>',
				'</a>',
			]
		}
	}
});
