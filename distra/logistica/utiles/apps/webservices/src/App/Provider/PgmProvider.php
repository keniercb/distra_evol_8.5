<?php

namespace App\Provider;

use Silex\Application;

class PgmProvider extends BaseProvider
{
    public function initControllers()
    {
        $this->app['pgm.controller'] = function($app) {
            return new \App\Controllers\PgmController($app,$this->app['pgm.service']);
        };

    }
    public function routing($api)
    {
        /*PGM Services Begin*/
        $api->match('/devolverSurtidos', "pgm.controller:devolverSurtidos")
            ->method('GET|POST');
        $api->match('/devolverMediosAlmacenados', "pgm.controller:devolverMediosAlmacenados")
            ->method('GET|POST');
        $api->match('/devolverActivos', "pgm.controller:devolverActivos")
            ->method('GET|POST');
        $api->match('/devolverEntidadesActivos', "pgm.controller:devolverEntidadesActivos")
            ->method('GET|POST');
        $api->match('/obtenerDatosMedioPorId', "pgm.controller:obtenerDatosMedioPorId")
            ->method('GET|POST');
        $api->match('/obtenerNomencladorCategorias', "pgm.controller:obtenerNomencladorCategorias")
            ->method('GET|POST');
        $api->match('/obtenerNomencladorArbol', "pgm.controller:obtenerNomencladorArbol")
            ->method('GET|POST');
        $api->match('/obtenerNomencladorDetalles', "pgm.controller:obtenerNomencladorDetalles")
            ->method('GET|POST');
        /*PGM Services End*/
    }
}
