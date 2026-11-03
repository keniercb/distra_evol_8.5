<?php

/**
 * gestionarcondicionController
 *
 * @author  Ing. Rodain Terrer Molina
 * @version 1.0
 */
class GestionarterminopagoController extends ZendExt_Controller_Secure
{

    public function init()
    {
        parent::init();
    }

    public function gestionarterminopagoAction()
    {
        /*$this->view->dirComun_css = $this->pIntegrator->comun->dirComun_css();
        $this->view->dirComun_PagingToolbar = $this->pIntegrator->comun->dirComun_PagingToolbar();
        $this->view->dirComun_PagingToolbarSelections = $this->pIntegrator->comun->dirComun_PagingToolbarSelections();
        $this->view->dir_CmpNotification = $this->pIntegrator->comun->dir_CmpNotification();*/
        $this->render();
    }

    public function cargarCondcionPagoAction()
    {
        $post = $this->_request->getPost();
        $model = new terminopagoModel();
        $condiciones = $model->GetCondiciones($post);

        echo json_encode($condiciones);
    }

    public function cargarCondcionPagoComboAction()
    {
        $model = new terminopagoModel();
        $condiciones = $model->GetCondicionesCombo();

        echo json_encode($condiciones);
    }

    public function loadDataModAction()
    {
        $idterminodepago = $this->_request->getPost('idterminodepago');
        $model = new terminopagoModel();

        $condiciones = $model->loadDataMod($idterminodepago);
        echo json_encode($condiciones);
    }

    public function registrarCondicionAction()
    {
        $post = $this->_request->getPost();
        $mora = json_decode(stripslashes($this->_request->getPost('mora')));
        $dpp = json_decode(stripslashes($this->_request->getPost('dpp')));
        $descuentos = json_decode(stripslashes($this->_request->getPost('descuentos')));
        $plazoCuotas = json_decode(stripslashes($this->_request->getPost('plazoCuotas')));

        $delmora = json_decode(stripslashes($this->_request->getPost('delMora')));
        $deldpp = json_decode(stripslashes($this->_request->getPost('delDPP')));
        $deldescuentos = json_decode(stripslashes($this->_request->getPost('delDescVenta')));
        $delplazo = json_decode(stripslashes($this->_request->getPost('delPlazo')));

        $modelBussines = new terminopagoModel();
        if ($modelBussines->registrarCondicion(
            $post, $mora, $dpp, $descuentos, $plazoCuotas, $delmora, $deldpp, $deldescuentos, $delplazo
        )
        ) {
            echo("{'codM':1}");
        }
    }

    public function deletePayConditionAction()
    {
        $post = json_decode(stripslashes($this->_request->getPost('condiciones')));
        $modelBussines = new terminopagoModel();
        $code = $modelBussines->deletePayCondition($post);
        echo("{'codM':$code}");

    }

    public function activePayConditionAction()
    {
        $post = $this->_request->getPost();
        $modelBussines = new terminopagoModel();
        $response = $modelBussines->activeCondition($post);
        echo json_encode($response);
    }

    public function cargarcondicionAction()
    {
        $objCargar = new DatCondicionpago();
        $arrCond = $objCargar->damecondiciones();
        echo json_encode(array('datos' => $arrCond));
    }

    public function cargarCondicionesPagoAction()
    {
        $post = $this->_request->getPost();
        $modelBussines = new condicionpagoModel();
        $data = $modelBussines->cargarCondiciones($post);
        echo json_encode($data);
    }

    public function registerPayConditionAction()
    {
        $post = $this->_request->getPost();
        $modelBussines = new condicionpagoModel();
        $response = $modelBussines->registerPayCondition($post);
        echo json_encode($response);
    }

    public function adicionarcondicionAction()
    {
        $model = new condicionpagoModel();
        $objEnt = new DatCondicionpago();

        if (DatCondicionpago::is_empty() == 0) {
            $objEnt->idcondicionpago = $objEnt->genID();
            $objEnt->plazo = $this->_request->getPost('plazo');
            $objEnt->dpp = $this->_request->getPost('descuento');
            $objEnt->mora = $this->_request->getPost('mora');
            $objEnt->activo = 1;
            $objEnt->cambio = $objEnt->idcondicionpago;
            $objEnt->idestructuracomun
                = $this->global->Estructura->idestructura;

            $model->adicionarcondicion($objEnt);
            $this->showMessage(
                'Los datos han sido guardados satisfactoriamente.'
            );
        } else {
            $objMod = Doctrine::getTable('DatCondicionpago')->find(
                $this->_request->getPost('idcondicionpago')
            );
            $objMod->plazo = $this->_request->getPost('plazo');
            $objMod->dpp = $this->_request->getPost('descuento');
            $objMod->mora = $this->_request->getPost('mora');
            $model->adicionarcondicion($objMod);
            $this->showMessage(
                'Los datos han sido guardados satisfactoriamente.'
            );
        }
    }

    public function gestionarUsoAction(){
        $model = new terminopagoModel();
        $response=$model->gestionarUso($this->_request->getPost());
        echo json_encode($response);
    }


}
