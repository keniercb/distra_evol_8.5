#!/usr/bin/python
# To change this template, choose Tools | Templates
# and open the template in the editor.
from  msgpy.__init__ import *

instance=XMPPServer.CXMPPServer("titan@jabber.ucid.uci.cu","titan","localhost")
#Server.start()
#instance=Jabber("titan","titan","localhost")
#instance.Conect()
#instance.Authentication()
#instance.getContacts()
#instance.Send("pmorell@localhost","Hola mundo...titan probando componente de Alerta y Aviso. ")
instance.SendByTime("pmorell@jabber.ucid.uci.cu/web","Hola mundo...titan probando componente de Alerta y Aviso. ",5)
#instance.getSubscription("aabiague@localhost")
#raw_input()




