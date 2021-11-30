function StartClient(){
    var client = new Colyseus.Client("ws://localhost:8080");
    return client;
}