<?php
/** 
 * Componente para gestionar los subsistemas
 *
 * @package    Configuración
 * @subpackage Subsistemas/Controller
 * @copyright  XETID
 * @version    1.0
 */
class BienvenidaController extends ZendExt_Controller_Secure
{
    /**
      * Constructor de la clase 
      */
    function init()
    {
        parent::init();
    }
   /**
     * Bienvenida
     * 
     */
    function bienvenidaAction()
    {
        $this->render();
    }
/**
 * Finalizar
 * 
 */
    function finalizarAction()
    {
        $this->render();
    }
/**
 * Escrbir bienvenida
 * 
 */
    public function escribirbienvenidaAction()
    {
        $this->integrator->parametros->EscribirBienvenidaCinicial($this->_request->getPost('idestructura'));
    }
/**
 * Escrbir finalizar
 * 
 */
    public function escribirfinalizarAction()
    {
        $this->integrator->parametros->EscribirFinCinicial();
    }
}