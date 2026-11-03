################################
####### functions module #######
################################

########## INFO ################
#
# program: PyCoCha
#    file: functions.py
#  python: version 2.4 is required
#   autor: aciddata
# version: 1.3.0
#  update: 14.04.06
#

# import the modules
from sys import *
import sys

# the autor
auth="by aciddata "
# the version of PyCoCha
vers=" v.1.3.0 "
# the year
date="- 2006"

# INFO
def info():
	# doc
	"""print some info"""
	print "PyCoCha" + vers + auth + date

# HELP function
def helpme():
	# doc
	"""print the help screen"""
	print """
 c.  auth()               auth yourself
     change()             change the password
     close()              disconnect the client
     connect()            connect to a server
     nick(nick)           change your nick
     pm(nick, msg)        send a private message
     register()           register your nickname
     send(msg)            send a message
     show()               show all user online

 s.  start()              start the server
     topic()              set the topic
     admin()              set admin mode
     disconnect()         disconnect the server

 f.  helpme()             print this (help) screen
     info()               print some info
     quit(), exit()       exit pycocha\n"""

# QUIT
def quit():
	# doc
	"""quit pycocha"""
	print "Good bye.\n"
	# close pycocha and python
	sys.exit()

# EXIT
def exit():
	# doc
	"""exit pycocha - the same like quit"""
	print "Ciao.\n"
	# close pycocha and python
	sys.exit()

# start with this functions
info()
helpme()


# EOF - End Of File