<?php

namespace App\Provider;

use Silex\Application;

class BookProvider extends BaseProvider
{
    public function initControllers()
    {

        $this->app['books.controller'] = function($app) {
            return new \App\Controllers\BookController($app,null);
        };

    }
    public function routing($api)
    {
        $api->get('/', 'books.controller:index');

        $api->post('/', 'books.controller:store');

        $api->get('/{id}', 'books.controller:show');

        $api->get('/edit/{id}', 'books.controller:edit');

        $api->put('/{id}', 'books.controller:update');

        $api->delete('/{id}', 'books.controller:destroy');
    }
}
