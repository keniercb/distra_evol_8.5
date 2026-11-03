<?php

/**
 * Description of ImagenController
 *
 * @author kenier
 */
class ImagenController extends BaseController
{
    private $imagenModel;

    public function init()
    {
        parent::init();
        $this->_objHelper = LogisticaObjectHelper::__init();
        $this->imagenModel = new ImagenModel();
    }

    public function salvarImagenAction()
    {
//        $this->objectHelper->synchronize($this, $this->imagenModel->salvarImagen($_FILES['photo']['tmp_name']));
        $this->objectHelper->synchronize($this, $this->imagenModel->salvarImagen($this->uiParams['imagen']));
    }

    public function getImagenAction()
    {
        $this->autoShow = false;
        $this->imagenModel->obtenerImagen($this->uiParams['idimagen']);
    }

    public function eliminarImagenAction()
    {
        $this->uiParams['arrayImgDeleted'] =Zend_Json::decode($this->uiParams['arrayImagenesEliminadas']);
        $this->imagenModel->eliminarImagen($this->uiParams['arrayImgDeleted']['arrayData'],$this->uiParams['idindicador']);
    }

}
