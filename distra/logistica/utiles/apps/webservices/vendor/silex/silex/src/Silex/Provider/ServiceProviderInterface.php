<?php
/**
 * Created by PhpStorm.
 * User: alejo
 * Date: 09/03/2017
 * Time: 17:25
 */

namespace Silex\Provider;

use Silex\Application;

/**
 * Silex service provider interface.
 *
 * @author  Drago
 */
interface ServiceProviderInterface
{
    /**
     * Registers services on the given container.
     *
     * This method should only be used to configure services and parameters.
     * It should not get services.
     *
     * @param Application $app A container instance
     */
    public function register(Application $app);

    /**
     * Bootstraps the application.
     *
     * This method is called after all services are registered and should be used for "dynamic" configuration (whenever a service must be requested).
     *
     * @param Application $app A container instance
     */
    public function  boot(Application $app);
}
