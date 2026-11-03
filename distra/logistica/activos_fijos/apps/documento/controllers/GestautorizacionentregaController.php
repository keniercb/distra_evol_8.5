<?php

/**
 *
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication.'/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path().PATH_SEPARATOR.$config['include_path']);
}

/**
 *
 */
class GestautorizacionentregaController extends BaseController
{
    protected $_mComunAFT;
    protected $_idestructura;
    protected $_sConfGeneral;
    protected $_logistEstrucUbica;
    protected $_autorizacionModel;
    protected $_arrayData;

    public function init($strComponent = 'log.aft.autorizacionentrega')
    {
        $this->_arrayData = array(
            'isPrincipal' => true, 'alias' => 'entregaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_AFT
        );
        parent:: init($strComponent);
        $this->_mComunAFT = ComunAFTModel::getInstance();
        $cEstructura = 'Estructura';
        $this->_idestructura = ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;
        $this->_sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->_logistEstrucUbica = LogisticaEstructuraUbicHelper::__init();
        $this->_autorizacionModel = new AutorizacionEntregaModel($this->_arrayData);
    }

    /**
     *
     */
    public function gestautorizacionentregaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.autorizacionentrega');
        $this->renderTemplate();
    }

    public function getCargarComboDepositoAction()
    {        
        $this->uiParams['arrayIdDepositoNotIn'] = implode(',',
            json_decode(
                stripcslashes($this->uiParams['arrayIdDepositoNotIn'])
        ));

        $depositos = $this->_autorizacionModel->getDepositoNotInEntidad($this->uiParams/* $dominios, $this->uiParams */);
        $this->datos = $depositos['datos'];
        $this->cantidad = $depositos['total'];
        // }
    }

    public function getCargarRegNumericosAction()
    {
        $objRegNumerico = new RegNumericoActivoModel();
        $sEstrComposicion = ServiciosEstructuraComposicionHelper::__init();
        //---$this->uiParams['idarearesp'] = $this->_mComunAFT->getIdEstructurasHijas($this->uiParams['iddestino'], true, true);
        if ($this->uiParams['add']) {
            $datos = $this->_autorizacionModel->getCargarRegNumericosAdd($this->uiParams);
        } else {
            $this->uiParams['DatRegAutorizo'] = true;
            $datos = $this->_autorizacionModel->getCargarRegNumericosAdd($this->uiParams);
        }
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['total'];

        /* foreach ($datos['datos'] as $index => $dat) {
          if ($dat['iddestino']) {
          $regnum = $objRegNumerico->getMediosDisponibles($dat);

          $datos['datos'][$index]['marcamodelo'] = $regnum['datos'][0]['marcamodelo'];
          $datos['datos'][$index]['nroinventario'] = $regnum['datos'][0]['nroinventario'];
          $datos['datos'][$index]['nroserie'] = $regnum['datos'][0]['nroserie'];
          $datos['datos'][$index]['idarearesp'] = $regnum['datos'][0]['idarearesp'];
          }
          $result = $sEstrComposicion->getEstructura(($dat['idarearesp']) ? $dat['idarearesp'] : $regnum['datos'][0]['idarearesp']);
          $datos['datos'][$index]['arearesp'] = $result[0]->text;
          }
          $this->datos = $datos['datos'];
          $this->total = $datos['total']; */
    }

    public function getCargarEntidadAreaDestinoAction()
    {
        // if ($this->uiParams['codigooperacion'] == 'OPER_TRASLADO_EXTER') {
        $datos = $this->_autorizacionModel->getCargarEntidadDestino($this->uiParams);
        //  } else {
        //$datos = $this->_autorizacionModel->getCargarAreaDestino($this->uiParams);
        // }

        $this->datos = $datos['datos'];
        $this->cantidad = $datos['total'];
    }

    public function getGuardarAreaEntidadDestinoAction()
    {
        try {
            $this->uiParams['arrayIdDeposito'] = json_decode(stripcslashes($this->uiParams['arrayIdDeposito']));

            /* $this->uiParams['arrayIdDepositoNotIn'] = json_decode(
              stripcslashes($this->uiParams['arrayIdDepositoNotIn'])
              ); */
            $this->_autorizacionModel->getGuardarAreaEntidadDestino($this->uiParams);
        } catch (Doctrine_Exception $e) {
            echo $e->getMessage();
        }
    }

    public function getEliminarAreaEntidadDestinoAction()
    {
        try {
            $this->uiParams['arrayid'] = json_decode(stripcslashes($this->uiParams['arrayid']));
            $this->_autorizacionModel->getEliminarAreaEntidadDestino($this->uiParams);
        } catch (Doctrine_Exception $e) {
            echo $e->getMessage();
        }
    }

    public function getAddRegNumericoAction()
    {
        try {
            $this->uiParams['arrayregNumerico'] = json_decode(stripcslashes($this->uiParams['arrayregNumerico']));
            $this->_autorizacionModel->getAddRegNumerico($this->uiParams);
        } catch (Doctrine_Exception $e) {
            echo $e->getMessage();
        }
    }

    public function getDelRegNumericoAction()
    {
        
    }

    public function getAdicionarDocAction()
    {
        try {
            $this->uiParams['arrayIddestino'] = json_decode(stripcslashes($this->uiParams['arrayIddestino']));
            $this->iddocumento = $this->_autorizacionModel->getAdicionarDoc($this->uiParams);
        } catch (Doctrine_Exception $e) {
            echo $e->getMessage();
        }
    }

    public function cargardocumentosAction()
    {
        $datos = $this->_autorizacionModel->cargardocumentos($this->uiParams);
        $this->datos = $datos['datos'];
        $this->total = $datos['total'];
    }

    public function getAceptarDocAction()
    {
        try {
            $this->_autorizacionModel->getAceptarDoc($this->uiParams);
            $this->msg = 1;
        } catch (Doctrine_Exception $e) {
            echo $e->getMessage();
        }
    }

    public function getEliminarDocAction()
    {
        try {
            $this->uiParams['iddocumento'] = json_decode(stripcslashes($this->uiParams['iddocumento']));
            $this->_autorizacionModel->getEliminarDoc($this->uiParams);
            $this->msg = 1;
        } catch (Doctrine_Exception $e) {
            echo $e->getMessage();
        }
    }

    public function getConfirmarDocAction()
    {
        try {
            $this->uiParams['iddocumento'] = json_decode(stripcslashes($this->uiParams['iddocumento']));
            $datos = $this->_autorizacionModel->getConfirmarDoc($this->uiParams);
            if (!$datos) {
                $this->msg = 3;
            } else
                $this->msg = 1;
        } catch (Doctrine_Exception $e) {
            echo $e->getMessage();
        }
    }

    public function getAprobarDocAction()
    {
        try {
            $this->uiParams['iddocumento'] = json_decode(stripcslashes($this->uiParams['iddocumento']));
            $this->_autorizacionModel->getAprobarDoc($this->uiParams/*, 'aprobar'*/);
            $this->msg = 1;
         } catch (Doctrine_Exception $e) {
            echo $e->getMessage();
        }
    }

    public function getAnularDocAction()
    {
        try {
            $this->uiParams['iddocumento'] = json_decode(stripcslashes($this->uiParams['iddocumento']));
            $this->_autorizacionModel->getAnularDoc($this->uiParams);
            $this->msg = 1;
        } catch (Doctrine_Exception $e) {
            echo $e->getMessage();
        }
    }

}
