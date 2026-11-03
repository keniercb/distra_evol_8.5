#!/usr/bin/python
# To change this template, choose Tools | Templates
# and open the template in the editor.
from  msgpy.__init__ import *
#instance.Send("pmorell@jabber.ucid.uci.cu","Hola mundo...titan probando componente de Alerta y Aviso. ")
def index():
	instance=XMPPServer.CXMPPServer("titan@jabber.ucid.uci.cu","titan","jabber.ucid.uci.cu")
	return "pepe"





