<?php

/**
 * @author Jorge Luis Cuellar Mondeja
 * @date: 23/11/2012
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class GestregmatriculaController extends BaseController
{

    private $gestRegMatriculaModel;

    public function init()
    {
        parent::init('log.aft.registromatricula');
        $this->gestRegMatriculaModel = new GestRegMatriculaModel();
    }

    public function gestregmatriculaAction()
    {
        /* $this->autoShow = false;
          $this->render(); */
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        //Otros
        $this->view->arrayJs = array(
            $this->configuracionHelper->getJSAtributosDinamicos(),
            $this->rrhhHelper->mostrarIUBuscarPersona()
        );

        //Inicializar
        $this->initComponent('log.aft.registromatricula');
        $this->renderTemplate();
    }

    /* public function init()
      {
      parent::init();
      $this->gestRegMatriculaModel = new GestRegMatriculaModel();
      $this->modelReports = new ProxyReportModel();

      //  $utilesService = new UtilesService();
      // $this->view->arrayJs = array($utilesService->GetJsRegistroNumericoMedios());

      } */

    /**
     * Funcionalidad para renderizar la IU
     */
    /* public function gestregmatriculaAction()
      {
      // $this->view->jsayuda = $this->integrator->ayuda->devolverJS();

      $this->render();
      } */

    public function cargarGridCentralAction()
    {


        // $parametros = $this->_request->getPost();
        // unset($this->uiParams['idarea']);
        $this->uiParams['idestructura'] = $this->uiParams['idarea'];
        $this->uiParams['limit'] = ($this->uiParams['limit']) ? $this->uiParams['limit'] : 20;
        $this->uiParams['start'] = ($this->uiParams['start']) ? $this->uiParams['start'] : 0;
        $result = $this->gestRegMatriculaModel->cargarGridCentral($this->uiParams);
        $this->datos = $result[0];
        $this->total = $result[1];
        //echo (json_encode(array('datos' => $result[0], 'total' => $result[1])));
    }

    public function getEntidadAction()
    {

        $ent = ($idestructura) ? $this->integrator->metadatos->DameEstructura($this->uiParams['idestructura']) :
            $this->integrator->metadatos->DameEstructura($this->global->Estructura->idestructura);
        //$datos['entidad'] = $ent[0]->denominacion;       
        // $datos['identidad'] = $ent[0]->idestructura;
        // $datos['direccion'] = $ent[0]->direccion;
        $this->entidad = $ent[0]->denominacion;
        $this->identidad = $ent[0]->idestructura;
        $this->direccion = $ent[0]->direccion;
        //echo(json_encode($datos));
    }

    public function getEntidadRegistroAction()
    {
        //$parametros['idestructura'] = $this->uiParams['idestructura'];
        $ent = $this->integrator->metadatos->DameEstructura($this->uiParams['idestructura']);
        /* $datos['direccion'] = $ent[0]->direccion;
          $datos['entidad'] = $ent[0]->denominacion;
          $datos['identidad'] = $ent[0]->idestructura; */
        $this->entidad = $ent[0]->denominacion;
        $this->identidad = $ent[0]->idestructura;
        $this->direccion = $ent[0]->direccion;
        //echo(json_encode($datos));
    }

    public function getAddRegVehiculoAction()
    {
        try {
            $parametros['idestructura'] = $this->uiParams['idestructura'];
            $parametros['tipoReg'] = $this->uiParams['tipo'];
            $parametros['idregnum'] = json_decode(stripcslashes($this->uiParams['idregnum']));
            $this->gestRegMatriculaModel->getAddRegVehiculo($parametros);
            $this->msg = 1;
            // echo json_encode(array('Msg' => 1));
        } catch (Exception $e) {
            $this->msg = 3;
            $this->error = $e->getMessage();
            /* echo json_encode(
              array('Msg' => 3, 'error' => $e->Message())
              ); */
        }
    }

    public function getEliminarMedioTransAction()
    {
        try {
            $parametros['idregnum'] = json_decode(stripcslashes($this->uiParams['idregnum']));
            $this->gestRegMatriculaModel->getEliminarMedioTrans($parametros);
            $this->msg = 1;
            //echo json_encode(array('Msg' => 1));
        } catch (Exception $e) {
            $this->msg = 3;
            $this->error = $e->getMessage();
            /* echo json_encode(
              array('Msg' => 3, 'error' => $e->Message())
              ); */
        }
    }

    public function getComboTipoTramiteAction()
    {
        //$idestructura = $this->uiParams['idestructura'];//$this->_request->getPost('idestructura');
        $datos = $this->gestRegMatriculaModel->getComboTipoTramite($this->uiParams['idestructura']);
        $this->datos = $datos;
        $this->total = count($datos);
        //echo json_encode(array('datos' => $datos, 'total' => count($datos)));
    }

    public function getComboColorChapaAction()
    {
        //$idestructura = $this->_request->getPost('idestructura');
        $datos = $this->gestRegMatriculaModel->getComboColorChapa($this->uiParams['idestructura']);
        $this->datos = $datos;
        $this->total = count($datos);
        //echo json_encode(array('datos' => $datos, 'total' => count($datos)));
    }

    public function getComboTipoChapaAction()
    {
        // $idestructura = $this->_request->getPost('idestructura');
        $datos = $this->gestRegMatriculaModel->getComboTipoChapa($this->uiParams['idestructura']);
        $this->datos = $datos;
        $this->total = count($datos);
        // echo json_encode(array('datos' => $datos, 'total' => count($datos)));
    }

    public function getComboSectorAction()
    {
        //$idestructura = $this->_request->getPost('idestructura');
        $datos = $this->gestRegMatriculaModel->getComboSector($this->uiParams['idestructura']);
        $this->datos = $datos;
        $this->total = count($datos);
        //  echo json_encode(array('datos' => $datos, 'total' => count($datos)));
    }

    public function getEstatusTecnicoAction()
    {
        // $idestructura = $this->_request->getPost('idestructura');
        $datos = $this->gestRegMatriculaModel->getEstatusTecnico($this->uiParams['idestructura']);
        $this->datos = $datos;
        $this->total = count($datos);
        // echo json_encode(array('datos' => $datos, 'total' => count($datos)));
    }

    public function getComboMonedaAction()
    {
        //$parametros['idestructura'] = $this->_request->getPost('idestructura');
        $datos = $this->gestRegMatriculaModel->getComboMoneda($this->uiParams['idestructura']);
        $this->datos = $datos;
        $this->total = count($datos);
        //echo json_encode(array('datos' => $datos, 'total' => count($datos)));
    }

    public function getCompletarDatosMediosAction()
    {
        try {
            $parametros = json_decode(stripcslashes($this->uiParams['parametros']/* $this->_request->getPost('parametros') */));

            $this->gestRegMatriculaModel->getCompletarDatosMedios($parametros);
            $this->msg = 1;
            //echo json_encode(array('Msg' => 1));
        } catch (Exception $e) {
            $this->msg = 3;
            $this->error = $e->getMessage();
            /* echo json_encode(
              array('Msg' => 3, 'error' => $e->getMessage())
              ); */
        }
    }

    public function getBuscarDireccionAction()
    {
        $result = $this->gestRegMatriculaModel->getBuscarDireccion($this->uiParams['idpersona']
            /* $this->_request->getPost('idpersona') */);
        $this->direccion = $result;
        //echo json_encode(array('direccion' => $result));
    }

    public function getBuscarMediosAction()
    {

        $parametros['codigo'] = $this->uiParams['codigo']; //$this->_request->getPost('codigo');
        $parametros['descripcion'] = $this->uiParams['descripcion']; //$this->_request->getPost('descripcion');
        $parametros['matricula'] = $this->uiParams['matricula']; //$this->_request->getPost('matricula');
        $parametros['idestructura'] = $this->uiParams['idestructura']; //$this->_request->getPost('idestructura');
        $parametros['cargarcentral'] = "true";
        $parametros['limit'] = ($this->uiParams['limit']) ? $this->uiParams['limit'] : 20;
        //($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 20;
        $parametros['start'] = ($this->uiParams['start']) ? $this->uiParams['start'] : 0;
//($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $result = $this->gestRegMatriculaModel->cargarGridCentral($parametros);

        $this->datos = $result[0];
        $this->total = $result[1];
        //echo (json_encode(array('datos' => $result[0], 'total' => $result[1])));
    }

    public function getMarcasAction()
    {
        // $parametros = $this->_request->getPost();
        $datos = $this->gestRegMatriculaModel->getMarcas($this->uiParams);
        $this->datos = $datos['data'];
        $this->total = count($datos['data']);
        //echo json_encode($datos);
    }

    public function getModelosAction()
    {
        // $parametros = $this->_request->getPost();
        $datos = $this->gestRegMatriculaModel->getModelos($this->uiParams);
        $this->datos = $datos['data'];
        $this->total = count($datos['data']);
        //  echo json_encode($datos);
    }

    public function getcargarMonedaPorIdAction()
    {
        $datos = $this->gestRegMatriculaModel->getComboMoneda($this->uiParams['idestructura'], $this->uiParams);
        $this->datos = $datos;
    }

    public function getcargarColorPorIdAction()
    {
//        $parametros['idestructura'] = $this->_request->getPost('idestructura');
//        $parametros['idcolorchapa'] = $this->_request->getPost('idcolorchapa');
        $datos = $this->gestRegMatriculaModel->getcargarColorPorId($this->uiParams);
        $this->datos = $datos;
        //echo json_encode($datos);
    }

    public function getImagenesDetallesAction()
    {
        $idindicador = $this->uiParams['idindicador']; //$this->_request->getPost('idindicador');
        $result = Doctrine::getTable('DatImagenindicador')->findByDql(' idindicador = ?', array($idindicador));
        if (count($result) != 0) {
            $datos = $result->toArray();
        } else {
            $datos = array();
        }
        $this->datos = $datos;
        //echo json_encode(array('data' => $datos));
    }

    public function getCombustibleAction()
    {

        try {
            $result = $this->gestRegMatriculaModel->getCombustible();
            $this->datos = $result;
            $this->total = count($result);
            //echo json_encode(array('datos' => $result, 'total' => count($result)));
        } catch (Exception $e) {
            $this->msg = 3;
            $this->error = $e->getMessage();
            /* echo json_encode(
              array('Msg' => 3, 'error' => $e->Message())
              ); */
        }
    }

    public function getColorPrimarioAction()
    {
        try {
            //$idestructura = $this->_request->getPost('idestructura');
            $result = $this->gestRegMatriculaModel->getColorPrimario($this->uiParams['idestructura']);
            $this->datos = $result;
            $this->total = count($result);
            // echo json_encode(array('datos' => $result, 'total' => count($result)));
        } catch (Exception $e) {
            $this->msg = 3;
            $this->error = $e->getMessage();
            /* echo json_encode(
              array('Msg' => 3, 'error' => $e->Message())
              ); */
        }
    }

    public function getColorSegundarioAction()
    {

        try {
            //$idestructura = $this->_request->getPost('idestructura');
            $result = $this->gestRegMatriculaModel->getColorSegundario($this->uiParams['idestructura']);
            $this->datos = $result;
            $this->total = count($result);
            // echo json_encode(array('datos' => $result, 'total' => count($result)));
        } catch (Exception $e) {
            $this->msg = 3;
            $this->error = $e->getMessage();
            /* echo json_encode(
              array('Msg' => 3, 'error' => $e->Message())
              ); */
        }
    }

    public function getComboInspectorAction()
    {
        $result = $this->gestRegMatriculaModel->getComboInspector();
        $this->datos = $result['datos'];
        // echo json_encode($result);
    }

    /**
     * @method Metodo para mostrar los reportess
     * @params Array $data Arreglo con el parametro filters
     * @return Reporte creado
     */
    public function reporteAction()
    {

        $datas = $this->_getAllParams();
        $datas = json_decode($datas['datas']);
        $datas->fechaactual = date("d/m/Y");

//        $datas->headers = $datas;
        $datas->flags = true;

        $this->modelReports->report($datas);
    }

}
