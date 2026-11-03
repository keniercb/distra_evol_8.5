<?php

/**
 *
 */
class NomestatusController extends NomencladoresgeneralesaftController
{

    private $_sConfGeneral, $_mEstatus;

    /**
     *
     */
    public function init()
    {
        parent:: init();

        $this->_sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();

        $this->sAyuda = ServiciosAyudaHelper::__init();
        $this->view->jsnomgen = $this->_sConfGeneral->mostrarNomencladoresGenerales();
        $this->_mEstatus = new EstatusModel();
    }

    /**
     *
     */
    public function nomestatusAction()
    {
        $this->render();
    }

    /**
     *
     */
    public function cargarnomencladorAction()
    {
        $classEstructura = 'Estructura';

        $parametros = $this->_request->getPost();
        $parametros['idestructura'] = $this->global->$classEstructura->idestructura;
        $parametros['incluirvencidas'] = 2;
        if ($parametros['operativo']) {
            $resultado = $this->_mEstatus->getEstatusOperativos($parametros);
        } else {
            $resultado = $this->_mEstatus->getEstatusTecnicos($parametros);
        }

        echo(json_encode($resultado));
    }

    /**
     *
     */
    public function insertarnomencladorAction()
    {
        $parametros = $this->_request->getPost();

        if (!$parametros['deprecia']) {
            $parametros['deprecia'] = 0;
        }
        $res = $this->_mEstatus->insertarNomenclador($parametros);

        if ($res == 1) {
            echo "{success: 'true'}";
        } elseif ($res == -2) {
            echo("{'etiqueta':'msjAddDescexist'}");
        }
    }

    /**
     *
     */
    public function modificarnomencladorAction()
    {
        $parametros = $this->_request->getPost();

        if (!$parametros['deprecia']) {
            $parametros['deprecia'] = 0;
        }

        $res = $this->_mEstatus->modificarNomenclador($this->_request->getPost());
        if ($res == 1) {
            echo "{'cod':1, success: 'true'}";
        } elseif ($res == -2) {
            echo("{'cod':3,'etiqueta':'msjModDescexist'}");
        }
    }

    /**
     *
     */
    public function eliminarnomencladorAction()
    {
        $parametros = $this->_request->getPost();

        if ($parametros['modelo'] == 'NomEstatusoperativo') {
            $res = $this->_mEstatus->eliminarEstatusOperativo($parametros);
        } else {

            $parametros = array(json_decode(stripcslashes($parametros['idnom'])));
            $res = $this->_mEstatus->eliminarEstatusTecnicos($parametros);
        }

        if ($res == true) {
            echo "{'cod':1, success: 'true'}";
        } else {
            echo("{'cod':3,'mensaje':'No se puede eliminar.'}");
        }
    }

    /**
     *
     */
    public function activarnomencladorAction()
    {
        $res = $this->_mEstatus->activarNomenclador($this->_request->getParams());
        if ($res) {
            echo "{success: 'true'}";
        } else {
            echo "{success: 'false'}";
        }
    }

    /**
     *
     */
    public function insertarEstatusOperativoAction()
    {
        try {
            $idestatusoperativo = $this->_mEstatus->insertarEstatusOperativo($this->_request->getPost());

            if ($idestatusoperativo == 1) {
                echo json_encode(array('cod' => 1, 'success' => true));
            } elseif ($idestatusoperativo == 2) {
                echo json_encode(array('cod' => 1, 'etiqueta' => 'msjAddDescexist'));
            } else {
                echo json_encode(
                    array('cod' => 2,
                        'idestatusoperativodup' => $idestatusoperativo)
                );
            }
        } catch (Exception $e) {
            echo json_encode(
                array('cod' => 3, 'etiqueta' => 'msjAddError',
                    'error' => $e->getMessage())
            );
        }
    }

    /**
     *
     */
    public function modificarEstatusOperativoAction()
    {
        $res = $this->_mEstatus->modificarEstatusOperativo($this->_request->getPost());

        if ($res == 1) {
            echo "{success: 'true'}";
        } elseif ($res == 2) {
            echo("{'etiqueta':'msjModDescexist'}");
        }
    }

}
