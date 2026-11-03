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
class PluginestadoejecucionController extends BaseController
{

    private $documentoModel;

    public function init()
    {
        parent::init('log.lb.estadoejecucion');
        $this->documentoModel = new DocumentoLogisticaModel();
    }

    public function cargarDocumentosGeneradosAction() {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->documentoModel->getDocumentosGenerados($this->uiParams));
    }
}
