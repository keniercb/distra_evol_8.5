<?php

namespace App\Provider;

use Silex\Application;

class AuthenticateProvider extends BaseProvider
{

    /**
     * to initializing to the given controllers.
     *
     * @param null
     *
     * @return null
     */
    public function initControllers()
    {
        $this->app['auth.controller'] = function($app) {
            return new \App\Controllers\AuthenticateController($app,null);
        };
    }


    public function routing($api)
    {

        $api->get('/', 'auth.controller:authenticate');
        $api->get('/login/{username}/{password}', 'auth.controller:login');
    }
}
