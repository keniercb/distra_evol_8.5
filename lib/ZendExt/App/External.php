<?php

/**
 * ZendExt_App_External
 *
 * Gestor de la aplicacion para aplicaciones externas al MT.
 *
 * @author    Yoandry Morejon Borbon
 * @package   ZendExt
 * @copyright UCID-ERP Cuba
 * @version   1.0-0
 */
class ZendExt_App_External extends ZendExt_App
{

    /**
     * Inicializa la aplicacion
     *
     * @param array $config - arreglo con la configuracion de la aplicacion
     *
     * @throws ZendExt_Exception - dispara las excepciones no controladas en tiempo de desarrollo.
     * @return void
     */
    protected function initApp($config)
    {
        try {
            //Se inicializa el registro
            $this->initRegister();
            //Se inicializa la configuracion de la aplicacion
            $this->initConfig($config);
            //Se inicializa la configuracion de la session
            $this->initSession(); //Aspect OKP
            //Se chequea la seguridad de la aplicacion
            $this->checkSecurity(); //Aspect OKP
            //Se inicializa el perfil del usuario
            $this->initPerfil(); //Aspect OKP
            //Se actualiza el registro
            $this->updateRegister();
        } catch (Exception $e) { //Si se captura una excepcion
            //Si la excepcion capturada es de ZendExt
            if ($e instanceof ZendExt_Exception) {
                $e->handle();//Se dispara la excepcion
            } else { //Si es una excepcion no controlada
                $e = new ZendExt_Exception('NOCONTROLLED', $e); //Se dispara una excepcion controlada
                $aspectxml = ZendExt_FastResponse::getXML('aspect');
                if ($aspectxml->failedTraceAction['active'] == 'true') {
                    ZendExt_Aspect_Trace::getInstance()->failedTraceAction($e);
                }
                throw $e;
            }
        }
    }

}