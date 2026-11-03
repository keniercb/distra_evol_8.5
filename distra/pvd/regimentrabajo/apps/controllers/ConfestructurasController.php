<?php
class ConfestructurasController extends ZendExt_Controller_Secure
{
	function init() {
		parent::init();
	}

	function confestructurasAction() {
	
		$this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();	
        $this->view->idioma = $this->global->Perfil->idioma;
        //Mostrando la vista.
        $this->render('confestructuras');
	}

    function getConfigEstructurasAction()
    {
        $modeloNegocio = new ConfEstructurasModel();
        $arr = $modeloNegocio->getConfigEstructuras();
        echo Zend_Json::encode($arr);
    }

    function getEstructurasAction()
    {
        try {
            if ($this->_getParam('node') == 0 && $this->_getParam('idestructura') != 0) {
                $id = $this->_getParam('idestructura');
            } else {
                $id = $this->_getParam('node');
            }

            $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($id);

            $datos = Array();
            $pos = 0;
            foreach ($r as $t => $est) {
                if ($est->idconcepto != 7) {
                    $datos[$pos] = $est;
                    if ($this->_getParam('idestructura')) {
                        if ($this->_getParam('check') == 1) {
                            $obj = new ConfEstructuras();
                            $existe = $obj->existeEntidadByPadre($this->_getParam('idestructura'), $est->id);
                            if (count($existe) > 0) {
                                $datos[$pos]->checked = true;
                            } else {
                                $datos[$pos]->checked = false;
                            }
                        } else {
                            $datos[$pos]->checked = false;
                        }

                    }
                    $pos++;
                }
            }

            echo json_encode($datos);
        } catch (Exception $e) {
            echo json_encode(Array());
        }
    }

    public function addEstructurasAction()
    {
        $estructuras = json_decode(stripslashes($this->_request->getPost('arrayidestructuras')));

        $obj = new ConfEstructurasModel();
        $r = $obj->addEstructuras($this->_getParam('identidad'),$estructuras);
        echo Zend_Json::encode($r);
    }

    public function updateEstructurasAction()
    {
        $estructuras = json_decode(stripslashes($this->_request->getPost('arrayidestructuras')));
        $obj = new ConfEstructurasModel();
        $r = $obj->updateEstructuras($this->_getParam('identidad'),$estructuras);
        echo Zend_Json::encode($r);
    }

    public function deleteEstructurasAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('arrayids')));
        $respuesta = true;
        $obj = new ConfEstructurasModel();
        foreach ($arrayids as $p) {
            $r = $obj->deleteEstructuras($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
    
}
?>