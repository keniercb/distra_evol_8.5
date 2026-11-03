<?php

/**
 * Clase controladora para gestionar los datos del plugin depostio
 *
 * @author Maricet Estvez Fresnedo
 *
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class PlugincombodepositoController extends BaseController
{

    private $serviciosAyuda, $logistEstrucUbica;

    public function init()
    {
        parent::init('log.lb.combodeposito');

        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->logistEstrucUbica = LogisticaEstructuraUbicHelper::__init();
    }

    /**
     * Funcion para cargar los depositos de una entidad
     */
    public function cargardepositosAction()
    {
        $this->uiParams['idtipo'] = -1;
        $this->uiParams['seguridad'] = !$this->uiParams['lentomovtotal'];
        $depositos = $this->logistEstrucUbica->cargardepositos(null, null, $this->uiParams['criterio'], $this->uiParams['limit'], 
        $this->uiParams['start'],$this->uiParams['idtipo'], $this->uiParams['seguridad'], $this->uiParams['caso']) ;
        $this->datos = $depositos['depositos'];
    }

    public function cargarEntidadesAction(){
        $this->datos = ServiciosSeguridadHelper::__init()->getEntidadesByRolUsuario();
    }


    public function getDepositosTreeComboAction()
    {
        $depositos = $this->logistEstrucUbica->cargardepositos();
        $this->jsonResponse($depositos['depositos']);
    }

}
