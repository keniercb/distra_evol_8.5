<?php

include_once(Zend_Registry::get('config')->dir_aplication . '/pvd/comun/services/SuinSoapService.php');

/**
 * Created by Netbeans.
 * User: eddy
 * Date: 08/09/2020
 * Time: 10:15
 */
class ValidarpersonaController extends ZendExt_Controller_Secure
{

    public function init()
    {
        parent::init();
    }

    function validarpersonaAction()
    {
        $this->render();
    }

    function getPersonasAction()
    {
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $numid = $this->_getParam('numid');
        $nombre = mb_strtolower($this->_getParam('nombre'));
        $papel = mb_strtolower($this->_getParam('papel'));
        $sapel = mb_strtolower($this->_getParam('sapel'));

        $modelo = new ValidarpersonaModel();
        $resp = new stdClass();
        $resp->datos = $modelo->getPersonas($numid, $nombre, $papel, $sapel, $start, $limit);
        $resp->cantidad = $modelo->getCantPersonas($numid, $nombre, $papel, $sapel);
        echo Zend_Json::encode($resp);
    }

    function buscarPersonaAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $numid = $this->_request->getPost('numid');
        $nombre = $this->_request->getPost('nombre');
        $papel = $this->_request->getPost('papel');
        $sapel = $this->_request->getPost('sapel');
        $fuente = $this->_request->getPost('fuente');

        if ($fuente == 1) {//SUIN
            $objSoap = new SuinSoapService();
            $result = $objSoap->buscarByParams($numid, $nombre, null, $papel, $sapel); //Trae los datos de la persona incluyendo la foto.
            //$result = $objSoap->buscarByParamsDatos($numid, $nombre, null, $papel, $sapel); //Usar este si solo se quieren traer los datos sin la foto.
        }
        if ($fuente == 2) {//SUINFAR
            $modelo = new ValidarpersonaModel();
            $result = $modelo->buscarPersonaSuinFarServicioWeb($numid, $nombre, $papel, $sapel, $limit, $start);
        }

        echo json_encode($result);
    }

    public function validaPersonaAction()
    {
        $indixes = array(
            'nombre' => '', 'snombre' => '', 'papel' => '', 'sapel' => '', 'idsuin' => '', 'sexo' => '', 'numid' => '');
        $valores = array();
        $datos = json_decode($this->_getParam('arrValidar'));

        $p = 0;
        foreach ($datos as $v) {
            foreach ($indixes as $i => $l) {
                switch ($i) {
                    case 'sexo':
                        if ($v->$i == 'M' || $v->$i == 'Masculino') {
                            $valores[$p][$i] = 1;
                        } else {
                            $valores[$p][$i] = 0;
                        }
                        break;

                    default:
                        $valores[$p][$i] = $v->$i;
                        break;
                }
            }
            $p++;
        }

        $modelo = new ValidarpersonaModel();
        $respuesta = $modelo->validarPersona($valores, $this->_getParam('idpersona'), $this->_getParam('idfuente'));
        
        echo json_encode($respuesta);
    }

}
