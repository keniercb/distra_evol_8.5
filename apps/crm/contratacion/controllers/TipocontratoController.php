<?php

/**
 * Controlador encargado de manejar lo referente a la gestion
 * de los tipos de contratos del modulo Contratacion de PCRM.
 *
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Controller
 * @author         Ing. Lisvany Alonso Martinez
 * @copyright (c)  2015, XETID
 * @version        1.0
 */

class TipocontratoController extends NomencladorCmpController
{

    function init()
    {
        parent::init();
        $this->modTC = new TipoContratoModel();
        $this->modETC = new ElementoTipoContratoModel();
        $this->datTC = new DatTipoContrato();
        $this->confETC = new ConfElementoTipoContrato();
    }

    function tipocontratoAction()
    {
        //$this->render();
    }

    function cargartipocontratoAction()
    {
        $array = $this->datTC->cargartipocontrato(
            $this->global->Estructura->idestructura,
            json_decode($this->_request->getParams()['filter'])
        );
        echo json_encode($array);
    }

    function cargarelementocontratoAction()
    {
        $params = $this->_request->getParams();
        $filter = $params['filter'];
        $array = $this->confETC->cargarElementos($filter);
        echo json_encode($array);
    }

    function guardartipocontratoAction()
    {
        $array = $this->modTC->guardarTipoContrato($this->_request->getPost());
        echo json_encode($array);
    }

    function guardarelementotipocontratoAction()
    {
        $array = $this->modETC->guardarElementoTipoContrato(
            $this->_request->getPost()
        );
        echo json_encode($array);
    }

    function getobjectAction()
    {
        $array = $this->modTC->getComponent(
            array(), 'container'
        );
        echo json_encode($this->modTC->getComponent($array, 'widget'));
    }

    function getrolusuarioAction()
    {
        $segServiceInterface = new SeguridadComunicationInterface();
        $array = $segServiceInterface->getRoles(1000);
        echo json_encode($array['datos']);
    }

    public function cargardirAction()
    {
        $data = $this->modETC->cargarDir($this->_request->getParams());
        echo json_encode($data);
    }

    public function cargarcamposAction()
    {
        $result = $this->modETC->cargarCampos($this->_request->getParams());
        echo json_encode($result);
    }

    public function guardarHerenciaTipoContratoAction()
    {
        $params = $this->_request->getParams();
        $result = $this->modETC->guardarHerenciaTipoContrato($params);
        echo json_encode($result);
    }

    public function getModelAction()
    {
//        print('/*vamo a ver*/');
        $classbase = realpath(dirname(__FILE__))
            . '/../../../configuracion/clientesyproveedores/models/domain/generated/BaseNomClienteproveedor.php';
        $class = realpath(dirname(__FILE__))
            . '/../../../configuracion/clientesyproveedores/models/domain/NomClienteproveedor.php';
        include_once $classbase;
        include_once $class;
        parent::getModelAction();
    }

    function usarEnEntidadAction()
    {
        $array = $this->modTC->usarEnEntidad($this->_request->getPost());
        echo json_encode($array);
    }
}
