import socket
import sqlite3

file = "Sqlite3.db"

try:
	conn = sqlite3.connect(file)
	cur = conn.cursor()
except Exception as e:
	print(e)

s = socket.socket()

port = 40674

s.bind(('', port))
print( "socket binded to %s" % (port) )

s.listen(5)
print("socket is listening" )

try:
	while True:
		c, addr = s.accept()
		print("Got connection from", addr)
		c.send(b'Connected')
		command = c.recv(1024).decode()
		if command.strip().lower() == "close" :
			c.close()
		if command.strip().lower() == "query":
			rows = ""
			for row in cur.execute('''SELECT * FROM categories'''):
				rows += str(row) + "\n"
			c.sendall(bytes(rows, 'utf-8'))

except Exception as e:
	print(e)
finally:
	s.close()
