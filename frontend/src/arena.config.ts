import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import serveIndex from 'serve-index';
import path from 'path';
import express from 'express';

/**
 * Import your Room files
 */
import { GameRoom } from "./rooms/game-handler";

export default Arena({
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('game_handler', GameRoom).enableRealtimeListing();

    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         */
        // app.get("/", (req, res) => {
        //     res.send("It's time to kick ass and chew bubblegum!");
        // });
        // app.use('/', serveIndex(path.join(__dirname, "static"), {'icons': true}))
        // app.use('/', express.static(path.join(__dirname, "static")));
        app.use('/', express.static(__dirname));

        /**
         * Bind @colyseus/monitor
         * It is recommended to protect this route with a password.
         * Read more: https://docs.colyseus.io/tools/monitor/
         */
        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});