<?php

namespace App;

use Silex\Application;

class ServicesLoader
{
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    public function bindServicesIntoContainer()
    {
        $this->app['notes.service'] = function() {
            return new Services\NotesService($this->app["db"]);
        };
        $this->app['pgm.service'] = function() {
            return new Services\PgmService($this->app["db"]);
        };
        $this->app['inventario.service'] = function() {
            return new Services\InventarioService($this->app["db"]);
        };
    }
}

