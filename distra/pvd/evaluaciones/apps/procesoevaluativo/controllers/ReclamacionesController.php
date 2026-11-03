<?php

class ReclamacionesController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function reclamacionesAction()
    {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }
    function todospreprocesosevaluativosAction()
    {
        $filtro = $this->_request->getPost('denominacion');
        $fdesde = $this->_request->getPost('fdesde');
        $fhasta = $this->_request->getPost('hasta');
        $fhasta = $this->_request->getPost('estado');
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idestructura = $this->global->Estructura->idestructura;
        $objPreProcesos = new DatEvalpreprocesoevaluativo();
        $r->datos = $objPreProcesos->ObtenerTodosDefinirDadoPrepararR($idestructura, $limit, $start, $idpreprocesoevaluativo, $filtro, $fdesde, $fhasta);
        $r->cantidad = $objPreProcesos->GetCantTotal($idestructura);       
        $r->success = true;
        echo json_encode($r);
    }
    function getEvaluadosPEAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idPeriodoProceso = $this->_request->getPost('idperiodoproceso');
        $idPersonaEvaluador = $this->_request->getPost('idpersonaevaluador');
        $query = $this->_request->getPost('query');
        $firstParent = false;
        if (empty($idPersonaEvaluador)) {
            $idusuario = $this->global->Perfil->idusuario;
            $evaluador = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);
            $idPersonaEvaluador = $evaluador[0]['idpersona'];
            $firstParent = true;
        }

        $objModel = new DatEvalpersonaevaluacionModel();
        $r['datos'] = $objModel->getEvaluadosPeriodorec($idPeriodoProceso, $idPersonaEvaluador, $firstParent);                
        echo json_encode($r);
    }

	function respuestareclamacionAction() {
	    $procede = $this->_request->getPost('procede');		
		$respuesta = $this->_request->getPost('respuesta');		
		$idreclamacion = $this->_request->getPost('idreclamacion');
		if($procede==true)
		{
		$procedeparam = 1;
		}
		else
        {
            $procedeparam = 2;
        }

        $objRespuestaModel = new DatRespuestareclamacion();

        $objRespuestaModel->Modificar($idreclamacion,$procedeparam,$respuesta);

        $r->codResult = 1;
        $r->mensaje = "La respuesta se ha guardado satisfactoriamente.";
		
        echo(json_encode($r));
    }

}
