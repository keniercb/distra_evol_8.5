# To change this template, choose Tools | Templates
# and open the template in the editor.
#############################
####### server module #######
#############################

########## INFO #############
#
# program: PyCoCha
#    file: server.py
#  python: version 2.4 is required
#     use: python2.4 -i server.py
#   autor: aciddata
# version: 1.3.0
#  update: 14.04.06
#

# import modules
from socket import *
from string import *
from sys import *
from threading import *
from select import *
from time import *
from Help import *
import socket
import string
import select
import sys
import threading
import Help
import time

# default globals
global HOST, PORT, LOGGING, LOG, TOPIC
# default server settings
HOST, PORT = gethostbyname(gethostname()), 6000
# default server welcome message
server_msg="welcome on the server"
# default info message
info_msg="[i] please auth yourself or the server will change your nick"
# standart topic
TOPIC = ["### WELCOME ON THE NETWORK ###"]

# switch logging on / off
# default is ON
LOGGING = "ON"
# default server logfile
LOG = "server_log.txt"

# the server logging function
# LOGGING function
def logging(text2):
	# doc
	"""this is the logging function - log what you want"""
	# open or create a logfile
	logg = open(LOG, "a+")
	# write date and text to the logfile
	logg.write(asctime()+": "+text2+"\n")
	# close the logfile
	logg.close()

# sending msg to all users
def sendmsg( msg, adr):
	# doc
	"""send a message to all user who are online"""
	# a loop to check all users
	for sock in names.keys():
		sock.send(msg)

# SERVER function
class Server:
	# listen for connections
	class Listen_for_connections(Thread):
		def __init__(self):
			Thread.__init__(self)

		# start background job
		def run(self):
			# some globals
			global names, server, read, nums
			try:
				# create server socket
				server = socket.socket(AF_INET, SOCK_STREAM)
				# bind the socket on a port
				server.bind((HOST, PORT))
				# listen for incoming connections
				server.listen(1)
				# we log when the server starts
				if LOGGING == "ON":
					print "server started successfully, logging: on"
				else:
					print "server started successfully, logging: off"
				# logging
				if LOGGING == "ON":
					logging("server started successfully")
			except socket.error, detail:
				print detail
			# dictionary of users with socket and nick
			names = {}
			# list of socket filenumbers
			nums = [""]
			# the main loop to handle the connections
			while 1:
				# EXIT the while loop after server shutdown
				if nums[-1] == "CLOSED":
					break
				# filenumber from the socket (needed for select)
				nums = [server.fileno()]
				# ADD new connections
				for sock in names.keys():
					nums.append(sock.fileno())
				# select for reading from all sockets
				try:
					read, write, error = select.select( nums, [], [], 3)
				except select.error, detail:
					print detail
					break
				# SEARCH in the select list read
				for n in read:
					# LISTEN for new connections
					if n == server.fileno():
						sock, addr = server.accept()
						# standart username is None
						names[sock] = None
					else:
						for sock in names.keys():
							if sock.fileno() == n: break
						# SET the name
						name = names[sock]
						# GET a message
						try:
							text = sock.recv(1024)
						except socket.error, detail:
							print detail
							break
						# NICK - change the nickname
						if text[:7] == "#change":
							user1 = []
							# make a list of all user
							for zuser in names.values():
								user1.append(zuser)
							# set nick
							name = string.strip(text[7:-1])
							# is the nick already in use?
							if name in user1:
								try:
									# already in use
									sock.send("The nickname is already in use, choose another one.")
									break
        							except socket.error, detail:
									print detail
									break
							else:
								# set the new nickname
								name2 = names[sock]
								names[sock] = name
								# send messages
								sendmsg("%s is known as %s" % (name2, name), sock)
								print name2+" is known as "+name
								break
						# AUTH / LOGIN - with your password
						if text[:5] == "#auth":
							# we need 2 lists for users and admins
							user2 = []
							user3 = []
							# open the files
							d = open("user_db", "r")
							e = open("admin_db", "r")
							# make a list of all user with their passwords
							for o in d.readlines():
								user2.append(o)
							# close file
							d.close()
							# make a list of all admins
							for u in e.readlines():
								user3.append(u)
							# close file
							e.close()
							# the password
							pw = text[-32:]
							# the complete string
							r = str(text[5:-32]+":"+pw+"\n")
							# admin check string
							t = str(text[5:-32]+"\n")
							name2 = names[sock]
							# is the string in the admin list?
							if t in user3:
								# set a "@" to the user
								name = str(text[5:-32])
								names[sock] = "@"+name
								# send a msg to the user
								try:
									sock.send("server gives you @ mode - welcome back on the server\n")
								except socket.error, detail:
									print detail
									break
								# send a msg to all
								sendmsg("server sets @ to %s" % (name), sock)
								print "server sets @ to "+name
								break
							# is the string in the user list?
							elif r in user2:
								# set a "+" to the user
								name = str(text[5:-32])
								names[sock] = "+"+name
								# send a msg to the user
								try:
									sock.send("server gives you + mode - welcome back on the server\n")
								except socket.error, detail:
									print detail
									break
								# send a msg to all
								sendmsg("server sets + to %s" % (name), sock)
								print "server sets + to "+name
								break
							else:
								try:
									# user not in file or false password
									sock.send("the user does not exist or the password is wrong")
									break
        							except socket.error, detail:
									print detail
									break
						# CHANGE your password
						if text[:7] == "#passch":
							# make some strings
							t = str(text[7:-32]+"\n")
							u = str(text[7:-64]+text[-32:]+"\n")
							print text[7:-32]
							print u
							# we need a list
							checkit = []
							# open the file
							d = open("user_db", "r")
							# add the lines
							for o in d.readlines():
								checkit.append(o)
							# close the file
							d.close()
							print checkit
							# check the file and change the password
							for x in range(len(checkit)):
								if checkit[x] == t:
									checkit[x] = u
							print checkit
							if u in checkit:
								# open & write a new file
								z = open("user_db", "w")
								for h in checkit:
									z.write(h)
								# close file
								z.close()
								# send message
								try:
									sock.send("password changed successfully")
									break
								except socket.error, detail:
									print detail
									break
							else:
								# send a message
								try:
									sock.send("user does not exist or wrong password")
									break
								except socket.error, detail:
									print detail
									break
						# SHOW all user online
						if text[:5] == "#show":
							user = []
							# make a list of all user
							for xuser in names.values():
								user.append(xuser)
							user2 = str(user)
							try:
								sock.send("user online: "+user2)
							except socket.error, detail:
								print detail
							break
						# PM - get & send private message
						if text[:3] == "#pm":
							# cut the "#pm"
							text2 = text[3:]
							# get all socketitems
							socks_nicks = names.items()
							# a loop to check
							for x in range(len(socks_nicks)):
								for y in range(2):
									test = str(socks_nicks[x][y])
									if str("*"+test+"*") in text2:
										socks_nicks[x][0].send(text2)
									#	sock.send(text2)
										break
							break
						# REGISTER - register a user
						if text[:9] == "#register":
							# user list
							m = []
							# cut the data
							pw = text[-32:]
							# open the user file
							d = open("user_db", "r")
							# a loop to add every registered user in the file
							for h in d.readlines():
								m.append(h[:-34])
							# close the user file
							d.close()
							# is the nick already registered?
							if text[9:-32] in m:
								# send a message
								sock.send("Sorry, the nick is already registered. Please use another one.")
								break
							# the nick is not in use
							else:
								# open the file
								e = open("user_db", "a+")
								# create a string
								r = str(text[9:-32]+":"+pw+"\n")
								# write the data to the file
								e.write(r)
								# send a message
								sock.send("Your nick was successfully registered.")
								# close the file
								e.close()
								break
						# CANCEL - the connection is broken
						if not text:
							# send a message
							sendmsg("%s has left the room" % name, sock)
							print name+" has left the room"
							# logging
							if LOGGING == "ON":
								logging(name+" has left the room")
							sleep(1)
							# close the socket
							sock.close()
							# delete user from list
							del names[sock]
						elif name is None:
							# set the nickname
							name = string.strip(text)
							# check if the nickname is already in use
							user2 = []
							for yuser in names.values():
								user2.append(yuser)
							if name in user2:
								try:
									# send AIU (already in use)
									sock.send("AIU")
									sock.close()
									del names[sock]
								except socket.error, detail:
									print detail
							else:
								# check for @ and +
								if name[0] == "@" or name[0] == "+":
									try:
										# send SFS (send false sign)
										sock.send("SFS")
										sock.close()
										del names[sock]
									except socket.error, detail:
										print detail
								else:
									# set the nick name
									names[sock] = name
									# send welcome msg to the new user
									try:
										sock.send(server_msg+" %s\n" % name)
									except socket.error, detail:
										print detail
										break
									# send actual topic
									try:
										sock.send("the topic is: "+TOPIC[-1]+"\n")
									except socket.error, detail:
										print detail
										break
									m = []
									# a loop to add every registered user in the file
									d = open("user_db", "r")
									for h in d.readlines():
										m.append(h[:-34])
									# close the user file
									d.close()
									if name in m:
										# send info msg to the new user
										try:
											sock.send(info_msg+"\n")
										except socket.error, detail:
											print detail
											break
									# msg to all
									try:
										sendmsg("%s enters the room" % name, sock)
									except socket.error, detail:
										print detail
										break
									# print msg on the server
									print name+" enters the room"
									# logging
									if LOGGING == "ON":
										logging(name+" enters the room")
						else:
							# we need a list
							m = []
							# open the user file
							d = open("user_db", "r")
							# a loop to add every registered user in the file
							for h in d.readlines():
								m.append(h[:-34])
							# close the user file
							d.close()
							# save old nick
							name2 = names[sock]
							# check the status
							if name in m:
								names[sock] = name+"GUEST"
								name = names[sock]
								# set the new nickname
								print name2+" is known as "+name
								# send info to all that the nick has changed to guest status
								try:
									# send messages
									sendmsg("automatic server msg: %s is known as %s" % (name2, name), sock)
								except socket.error, detail:
									print detail
									break
							# send msg to all
							try:
								sendmsg("%s: %s" % (name, text), sock)
							except socket.error, detail:
								print detail
								break
							# print msg to server
							print name+": "+text
							# logging
							if LOGGING == "ON":
								logging(name+": "+text)
	# make instance (needed for threading)
	lc=Listen_for_connections()

# DISCONNECT the server and client connections
def disconnect():
	# doc
	"""close the server with all connections"""
	global getout
	for sock in names.keys():
		try:
			sock.send("server closed the connection")
		except error, detail:
			print detail
		sock.close()
		del names[sock]
	sleep(1)
	# logging
	if LOGGING == "ON":
		logging("server closed the connection\n")
	print "server closed"
	# close the mainserver
	server.close()
	# for a breakout from the threading mainloop
	nums.append("CLOSED")

# make a server instance
s=Server()

# START the server
def start():
	# doc
	"""start the server"""
	# start the background job
	s.lc.start()

# ADMIN mode to a registered user
def admin():
	# doc
	"""give admin mode to a user"""
	# we need a list
	m = []
	# enter the nick you wanna give admin
	adm = raw_input("enter the nickname: ")
	# open the user file
	d = open("user_db", "r")
	# a loop to add every registered user in the file
	for h in d.readlines():
		m.append(h[:-34])
	# close the user file
	d.close()
	# is the nick already registered?
	if adm in m:
		# open admin_db
		e = open("admin_db", "a+")
		# write user to admin_db
		e.write(adm+"\n")
		# close admin_db
		e.close()
		print "added "+adm+" to the admin database"
	else:
		print "you can not add the user, he is not registered"

# TOPIC - set the topic
def topic():
	# doc
	"""set the server topic"""
	top = raw_input("enter the topic: ")
	TOPIC.append(top)


# EOF - End Of File