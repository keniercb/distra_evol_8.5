<?php

namespace App\Provider;

use Silex\Application;

class NoteProvider extends BaseProvider
{
    public function initControllers()
    {

        $this->app['notes.controller'] = function($app) {
            return new \App\Controllers\NotesController($app,$this->app['notes.service']);
        };

    }
    public function routing($api)
    {
        $api->get('/', "notes.controller:getAll");
        $api->get('/{id}', "notes.controller:getOne");
        $api->post('/', "notes.controller:save");
        $api->put('/{id}', "notes.controller:update");
        $api->delete('/{id}', "notes.controller:delete");
    }
}
