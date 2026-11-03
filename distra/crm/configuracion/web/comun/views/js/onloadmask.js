
function onloadMask(message) {
		message ? (lMask = new Ext.LoadMask(Ext.getBody(), {
					msg : message
				}), lMask.show()) : lMask.hide();
	}
