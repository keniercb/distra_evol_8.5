# To change this template, choose Tools | Templates
# and open the template in the editor.
from threading import *
import threading
from Jabber import *

class CXMPPServer (CJabber):

    def __init__(self,user,password,server):
            CJabber.__init__(self,user,password,server)
            #self.autoLoad=autoLoad
            #if autoLoad==1:
            self.Conect()
            self.Authentication()
            self.listener=CXMPPServer.Listen_for_connections(self)
            
    class Listen_for_connections(Thread):

        def __init__(self,server):
            Thread.__init__(self)
            self.server=server
            #self.runTask()
	# start background job
	def run(self):
            while self.server.isconected and self.server.authenticated:
                self.server.Send("pmorell@localhost", "prueba")

        def stop(self):
            if self.isconected:
                self.conn.disconnect()
                self.isconected=False
                self.authenticated=False

    
    #listener.runTask()
    