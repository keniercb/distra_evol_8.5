<?php

namespace App\Provider;

use Silex\Application;

class InventarioProvider extends BaseProvider
{
    public function initControllers()
    {
        $this->app['inventario.controller'] = function($app) {
            return new \App\Controllers\InventarioController($app,$this->app['inventario.service']);
        };

    }
    public function routing($api)
    {

        /*Inventario Services Begin*/
        $api->post('/all', "inventario.controller:getAll");
        /*Inventario Services End*/
    }
}
