<?php

/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 3/28/2016
 * Time: 8:33 AM
 */
class ConfidentificadormedioController extends ZendExt_Controller_Secure
{

    protected $_mIndentificadorMedio;
    protected $serviciosConfiguracion;
    protected $metadataModel;

    /**
     *
     */
    function init()
    {
        parent:: init();
        $this->_mIndentificadorMedio = new ConfiguracionidentificadormedioModel();
        $this->metadataModel = ZendExt_Metadata:: getInstance()->Metadata();
        $this->serviciosConfiguracion
            = ServiciosConfiguracionGeneralHelper::__init();
    }

    /**
     *
     */
    function ConfidentificadormedioAction()
    {
        $this->render();
    }

    function cargarIndicadoresAction()
    {
        $datos = $this->_mIndentificadorMedio->obtenerIndicadores($this->_request->getPost());
        echo json_encode($datos);

    }

    function cargarAtributosIndicadorAction()
    {
        $params = $this->_request->getPost();
        $datos = $this->_mTipoMedio->obtenerAtributosIndicador($params);
        echo json_encode(array('datos' => $datos, 'cantidad' => count($datos)));

    }
    /*
     *
     * */
    public function adicionarRelacionAction()
    {
        try {
            $params = $this->_request->getPost();
            $this->_mIndentificadorMedio->adicionarRelacion($params);
            echo json_encode(array('CodMsg' => 1));
        } catch (Exception $e) {
            echo json_encode(array('CodMsg' => 3, 'mensaje'=>$e->getMessage()));
        }

    }

    public function eliminarRelacionAction()
    {
        try {
            $this->_mIndentificadorMedio->eliminarRelacion($this->_request->getPost('idindicador'));
            echo json_encode(array('CodMsg' => 1));
        } catch (Exception $e) {
            echo json_encode(array('CodMsg' => 3, 'mensaje' => $e->getMessage()));
        }
    }

    /**
     *
     */
    public function obtenerConfigIndicadorAction()
    {
        $service = new ConfiguracionActivosService();
        $parametros = $this->_request->getPost();
        $configuracion = $service->findTipoMedioByIdTrans($parametros['idnaturaleza']);

        $arreglo['idtabla'] = $parametros['idtabla'];
        $arreglo['idindicador'] = $parametros['idindicador'];
        $arreglo['idtablageneral'] = $parametros['idtablageneral'];


        $dinamicos = $this->_mIndentificadorMedio->obtenerAtributosIndicador($arreglo, $parametros);


        echo json_encode(array('configuracion' => $configuracion[0], 'dinamicos'=>$dinamicos));
    }

} 