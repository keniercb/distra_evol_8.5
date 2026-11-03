<?php

/**
 * ZendExt_App_Cli
 *
 * Gestor de la aplicación para aplicaciones que corren en modo CLI (Command Line Interface).
 *
 * @author    Yoandry Morejon Borbon
 * @package   ZendExt
 * @copyright UCID-ERP Cuba
 * @version   1.0-0
 */
class ZendExt_App_Cli extends ZendExt_App
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
//            //Se inicializa la configuracion de la session
//            $this->initSession(); //Aspect OKP
            //Se inicializa la conexion
            $this->initConexion(); //Aspect OKP
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

    /**
     * Actualiza el registro unico de objetos, arreglos, ...
     *
     * @return void
     */
    protected function updateRegister()
    {
        //Se guarda en el registro la conexion activa.
        $this->register->conexion = $this->conexion;
    }

    /**
     * Comete las transacciones y cierra todas las conexiones abiertas.
     *
     * @return void
     */
    public function finish()
    {
        ZendExt_Aspect_TransactionManager :: getInstance()->commitTransactions();
        $doctrineMgr = Doctrine_Manager::getInstance();
        foreach ($doctrineMgr->getConnections() as $connection) {
            $doctrineMgr->closeConnection($connection);
        }
    }

}
