<?php

namespace App\Provider\Interfaces;

use Silex\Application;


use Silex\ControllerCollection;

/**
 * Interface for controller providers.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
interface BaseProviderInterface
{
    /**
     * to initializing to the given controllers.
     *
     * @param null
     *
     * @return null
     */

    public function initControllers();
    /**
     * Returns routes to routing to the given application.
     *
     * @param ControllerCollection $app An ControllerCollection instance
     *
     * @return null
     */
    public function routing($api);
}