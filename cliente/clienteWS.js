function ClienteWS() {
    this.socket=null;
    this.conectar=function() {
        this.socket=io.connect();
    }
}

