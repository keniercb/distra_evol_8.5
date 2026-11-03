<?php
class NomjefefacultadoController extends ZendExt_Controller_Secure
{

    /**
     * Inicializa las variables necesarias
     */
    public function init()
    {
        parent::init();
    }

    public function nomjefefacultadoAction()
    {

    }

    public function getFormEnteringJefeAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $query = $this->_request->getPost('query');
        $objModel = new NomJefefacultadoModel();
        if ($query != '') {
            $result = $objModel->getFormEnteringFarActive($query, $limit, $start);
        } else {
            $result = $objModel->getFormEnteringFarActive(null, $limit, $start);
        }
        $this->request->data = $result->data;
        $this->request->quantity = $result->quantity;
        $this->returnRequest();
    }

    function returnRequest()
    {
        echo json_encode($this->request);
    }

    function addFormEnteringJefeAction()
    {
        try {
            $obj->idcargopropuesto=$this->_request->getPost('idcargopropuesto');
            $obj->fdesde=$this->_request->getPost('fdesde');
            $obj->fhasta=$this->_request->getPost('fhasta');
            $obj->descripcion=$this->_request->getPost('descripcion');
            $obj->abreviatura = $this->_request->getPost('abreviatura');
            $objModel = new NomJefefacultadoModel();
            if ($objModel->addFormEnteringJefe($obj)) {
                $this->request->success = true;
                $this->request->mensaje = "El jefe facultado ha sido adicionado satisfactoriamente.";
                $this->returnRequest();
            } else {
                $this->request->success = false;
                $this->request->mensaje = "El jefe facultado que quiere adicionar ya existe.";
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
    }

    function modFormEnteringJefeAction()
    {
        $idnomenclador = $this->_request->getPost('idnomenclador');
        $idcargopropuesto=$this->_request->getPost('idcargopropuesto');
        $fdesde=$this->_request->getPost('fdesde');
        $fhasta=$this->_request->getPost('fhasta');
        $descripcion=$this->_request->getPost('descripcion');
        $abreviatura = $this->_request->getPost('abreviatura');
        try {
            $objModel = new NomJefefacultadoModel();
            $result = $objModel->modFormEnteringJefe(
                $idnomenclador,$idcargopropuesto, $abreviatura,$descripcion, $fdesde, $fhasta
            );
            if ($result) {
                $this->request->success = true;
                $this->request->mensaje = "El jefe facultado ha sido modifcado satisfactoriamente.";
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
    }

    function delFormEnteringJefeAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            if (!empty($arrIds) && is_array($arrIds)) {
                $obj->idnomenclador = $arrIds;
            } else {
                throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
            }
            $objModel = new NomJefefacultadoModel();
            foreach ($arrIds as $value) {
                $result = $objModel->delFormEnteringJefe($value);
            }
            if ($result) {
                $this->request->success = true;
                $this->request->mensaje = "El jefe facultado ha sido eliminado satisfactoriamente.";
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
    }

    function showReportAction()
    {
        $formato = $this->_request->getParam('formato');
        $titulo = $this->_request->getParam('titulo');
        $usuario = json_decode($this->_request->getParam('usuario'));
        $fecha = json_decode($this->_request->getParam('fecha'));
        $params = json_decode($this->_request->getParam('params'));
        $header = json_decode($this->_request->getParam('header'));
        $tiporeporte = $this->_request->getParam('tiporeporte');
        if ($usuario == '1') {
            $usuario = $this->global->Perfil->usuario;
        }
        if ($fecha == '1') {
            //$fecha = gmdate("d/m/Y H:i:s");
            $fecha = date("F j, Y, g:i a");
        }
        $nomecladores = NomJefefacultado::getFormEnteringFarActive();
        $datos = array();
        foreach ($nomecladores as $key => $value) {
            $datos[$key]['numero'] = $key + 1;
            $datos[$key]['denominacion'] = $value['denominacion'];
            $datos[$key]['abreviatura'] = $value['abreviatura'];
            $datos[$key]['fdesde'] = $value['fdesde'];
            $datos[$key]['fhasta'] = $value['fhasta'];
            $datos[$key]['descripcion'] = $value['descripcion'];
        }
        if ($tiporeporte == 'listado') {
            ZendExt_IoC_Inter::getInstance()->comun->ExportarReporte(
                $formato, $titulo, $datos, $header, $usuario, $fecha, null
            );
        }
    }
}