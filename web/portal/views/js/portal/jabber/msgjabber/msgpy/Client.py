# To change this template, choose Tools | Templates
# and open the template in the editor.
#############################
####### client module #######
#############################

########## INFO #############
#
# program: PyCoCha
#    file: client.py
#  python: version 2.4 is required
#     use: python2.4 -i client.py
#   autor: aciddata
# version: 1.3.0
#  update: 14.04.06
#

# import all needed modules
from socket import *
from sys import *
from Help import *
from threading import *
from time import *
from getpass import *
from md5 import *
import socket
import sys
import Help
import threading
import time
import getpass
import md5

# the needed global variables
global host, port, LOGGING, log, status

# switch logging on / off
# default is ON
LOGGING = "ON"
# the default client logfile
# it will be created if it doesnt exist
log = "client_log.txt"

# default settings
# the server / host and the port to connect ( edit for your need )
HOST, PORT = gethostbyname(gethostname()), 6000
# HOST, PORT = server_host / server_IP, your_port
# a list to manage the nicknames
nicks = ["pmorell"]
# for the connection status
status = ["DISCONNECTED"]
# the standart close message for the client
close_msg = "See you later."

# LOGGING function
def logging(text):
	# doc
	"""logging the in and output"""
	# open or create a logfile
	logg = open(log, "a+")
	# write date and text to the logfile
	logg.write(asctime()+": "+text+"\n")
	# close the logfile
	logg.close()

# CONNECT to a server
def connect():
	# doc
	"""connect to the standart or customer server / host"""
	# are you already connected?
	if status[-1] == "CONNECTED":
		print "you are already connected"
	else:
		# some global variables
		global new_connect, my_nick, nicks, host, port
		if nicks[-1] == "":
			# got a nick name ?
			my_nick = raw_input("enter your nickname first: ")
			# add the new nickname to the list
			nicks.append(my_nick)
			# use the prompt as your nickname
			sys.ps1 = nicks[-1]+": "
			host=raw_input("enter your host/IP: ")
			port=input("enter your port: ")
		# create a socket
 		new_connect = socket.socket(AF_INET, SOCK_STREAM)
		try:
			# connect the socket to host and port
			new_connect.connect((host,port))
			# logging
			if LOGGING == "ON":
				print "connection established, logging: on\n"
			else:
				print "connection established, logging: off\n"
			# send the nickname to the server
			new_connect.send(nicks[-1]+"\n")
			# for checking the nickname
			check = new_connect.recv(1024)
		except socket.error, detail:
			print "socket.error", detail
		# checking if the nickname is already in use (AIU)
		if check == "AIU":
			print "The nickname is already in use.\nPlease use another one and connect again."
			# unset nick
			nicks = [""]
			# close the connection
			new_connect.close()
		# checking for some false signs (SFS)
		if check == "SFS":
			print "the signs @ and + are not allowed as first sign, connect again please."
			# unset nick
			nicks = [""]
			# close the connection
			new_connect.close()
		else:
			print check
			# set the status
			status.append("CONNECTED")
			# listening for incoming data
			# using threading for background work
			class Listen(Thread):
				def __init__(self):
					Thread.__init__(self)
				# background job
				def run(self):
					while 1:
						# wait one second
#						sleep(1)
						# get and print the data
						try:
							data = new_connect.recv(1024)
							# logging
							if LOGGING == "ON":
								logging(data)
						except AttributeError, detail:
							print detail
							break
						except socket.error, detail:
							# print detail ?
							break
						# if no data comes or the connection is broken
						if not data: break
						else: print data
			# the needed instance for threading
			l = Listen()
			# start the background job
			l.start()

# SEND a message
def send(msg = ""):
	# doc
	"""send a message to the chatserver"""
	# are you connected?
	if status[-1] == "DISCONNECTED":
		print "you are not connected"
	else:
		if msg == "":
			# enter the message
			msg = raw_input("enter your message: ")
			try:
				# send the message
				new_connect.send(msg)
			except socket.error, detail:
				print detail
			except NameError, detail:
				print detail
		else:
			try:
				# send the message
				new_connect.send(msg)
			except socket.error, detail:
				print detail
			except NameError, detail:
				print detail

# CLOSE the client
def close(msg = ""):
	# doc
	"""close the connection to the server and send a quit message"""
	# are you connected?
	if status[-1] == "DISCONNECTED":
		print "you are not connected"
	else:
		if msg != "":
			try:
				# send your own close message
				new_connect.send(msg+"\n")
				# logging
				if LOGGING == "ON":
					logging(msg)
			except socket.error, detail:
				print detail
			except NameError, detail:
				print detail
			# close the connection
			new_connect.close()
			# set the status
			status.append("DISCONNECTED")
			sleep(1)
			# for a clean exit we raise a KeyboardInterrupt
			try:
				raise KeyboardInterrupt
			except KeyboardInterrupt:
				pass
		else:
			try:
				# send default close message & log
				new_connect.send(close_msg+"\n")
				# logging
				if LOGGING == "ON":
					logging(close_msg)
			except socket.error, detail:
				print detail
			except NameError, detail:
				print detail
			# close the connection
			new_connect.close()
			# set the status
			status.append("DISCONNECTED")
			sleep(1)
			# for a clean exit we raise a KeyboardInterrupt
			try:
				raise KeyboardInterrupt
			except KeyboardInterrupt:
				pass

# NICK - enter / change nickname
def nick(default = "user"):
	# doc
	"""change your actual nickname to another one"""
	# are you connected?
	if status[-1] == "DISCONNECTED":
		print "you are not connected"
	else:
		# define a nickname
		if default == "user":
			my_nick = raw_input("enter your nickname: ")
			# manage nicknames
			nicks.append(my_nick)
			# show your nickname
			sys.ps1 = nicks[-1]+": "
			try:
				# send the command
				new_connect.send("#change"+nicks[-1]+"\n")
			except socket.error, detail:
				print detail
			except NameError, detail:
				print detail
			sleep(1)
		else:
			my_nick = default
			# manage nicknames
			nicks.append(my_nick)
			# show your nickname
			sys.ps1 = nicks[-1]+": "
			try:
				# send the command
				new_connect.send("#change"+nicks[-1]+"\n")
			except socket.error, detail:
				print detail
			except NameError, detail:
				print detail
			sleep(1)

# SHOW all user in the chat
def show():
	# doc
	"""show all online user on the chat server"""
	# are you connected?
	if status[-1] == "DISCONNECTED":
		print "you are not connected"
	else:
		try:
			# send the command
			new_connect.send("#show"+nicks[-1])
		except socket.error, detail:
			print detail
		except NameError, detail:
			print detail

# PM - send a private message
def pm(nick = "", msg = ""):
	# doc
	"""send a private message to a person on the server"""
	# are you connected?
	if status[-1] == "DISCONNECTED":
		print "you are not connected"
	else:
		if nick  == "":
			# enter a nick
			nick = raw_input("enter recipients nick: ")
		if msg == "":
			# enter a message
			msg = raw_input("enter a message: ")
		nick2 = "*"+nick+"*"
		# make string
		pmsg = str("#pm"+"pm from "+nicks[-1]+" to "+nick2+" : "+msg)
		try:
			# send the private message
			new_connect.send(pmsg)
		except socket.error, detail:
			print detail

# REGISTER the nickname
def register():
	# doc
	"""register your nickname on the database (user_db)
	   with a password with md5 encryption"""
	# are you connected?
	if status[-1] == "DISCONNECTED":
		print "you are not connected"
	else:
		# while the 2 passwords are different
		while 1:
			# get two identical passwords
			pw = getpass.getpass("enter your password to register your nick: ")
			pw2 = getpass.getpass("enter your password again: ")
			if pw != pw2:
				print "the passwords are different, try again\n"
				continue
			else:
				break
		# make a md5 checksum with 32 signs
		passw = new(pw)
		passw2 = passw.hexdigest()
		# make a string
		s = str("#register"+nicks[-1]+passw2)
		# delete the stored passwords
		del pw, pw2
		try:
			# send the data
			new_connect.send(s)
		except socket.error, detail:
			print detail

# LOGIN / AUTH yourself with your private nick & password
def auth():
	# doc
	"""authenticate yourself with your private nickname & password"""
	# are you connected ?
	if status[-1] == "DISCONNECTED":
		print "you are not connected"
	else:
		# get nick
		nn = raw_input("enter your nick: ")
		# get password
		auth2 = getpass.getpass("enter your password: ")
		# make a md5 checksum with 32 signs
		passw = new(auth2)
		passw2 = passw.hexdigest()
		# make a string
		authme = str("#auth"+nn+passw2)
		# try to send the data
		try:
			new_connect.send(authme)
		except socket.error, detail:
			print detail

# CHANGE your password
def change():
	# doc
	"""change your password"""
	# are you connected ?
	if status[-1] == "DISCONNECTED":
		print "you are not connected"
	else:
		# get nick
		nn = raw_input("enter your nick: ")
		# get old password
		auth2 = getpass.getpass("enter your old password: ")
		# while the 2 passwords are different
		while 1:
			# get two identical passwords, the new password
			pw = getpass.getpass("enter your new password: ")
			pw2 = getpass.getpass("enter your new password again: ")
			if pw != pw2:
				print "the passwords are different, try again\n"
				continue
			else:
				break
		# make a md5 checksum with 32 signs
		passw = new(auth2)
		passw2 = passw.hexdigest()
		passw3 = new(pw)
		passw4 = passw3.hexdigest()
		# make a string
		ch = str("#passch"+nn+":"+passw2+passw4)
		# try to send the data
		try:
			new_connect.send(ch)
		except socket.error, detail:
			print detail

# EOF - End Of File