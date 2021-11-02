import socket

s = socket.socket()

port = 40674
x = input
s.connect(("192.168.1.153", port))

print(s.recv(1024))
s.sendall(b"query")
print(s.recv(1024))
s.sendall(b"close")
