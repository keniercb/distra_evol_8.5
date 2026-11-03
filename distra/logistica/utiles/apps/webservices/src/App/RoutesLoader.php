<?php

namespace App;

use Silex\Application;

class RoutesLoader
{
    private $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->instantiateProvider();

    }

    private function instantiateProvider()
    {
        $this->app['books.provider'] = function() {
            return new Provider\BookProvider();
        };

        $this->app['auth.provider'] = function() {
            return new Provider\AuthenticateProvider();
        };

        $this->app['notes.provider'] = function() {
            return new Provider\NoteProvider();
        };

        $this->app['pgm.provider'] = function() {
            return new Provider\PgmProvider();
        };
        $this->app['inventario.provider'] = function() {
            return new Provider\InventarioProvider();
        };
    }

    public function bindRoutesToControllers()
    {

        $this->app->mount($this->app['api'].'/books', $this->app['books.provider']);
        $this->app->mount($this->app['api'].'/auth', $this->app['auth.provider']);
        $this->app->mount($this->app['api'].'/notes', $this->app['notes.provider']);
        $this->app->mount($this->app['api'].'/pgm', $this->app['pgm.provider']);
        $this->app->mount($this->app['api'].'/inventario', $this->app['inventario.provider']);

        //$this->app->mount($this->app["api.endpoint"].'/'.$this->app["api.version"],  $this->app['books.provider']);
    }
}

