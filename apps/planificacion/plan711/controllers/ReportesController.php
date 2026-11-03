<?php

/**
 * Controlador para gestionar actividades
 *
 * @author    FERNANDO CHINETE FLACUCHO
 * @version   1.0.0
 * @copyright XETID
 */
class ReportesController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    public function reportesAction()
    {
        $this->view->jsreportes = $this->pIntegrator->reportes->devolverJS();
        $this->render();
    }

    public function obtenerReporteAction()
    {
        ini_set("max_execution_time", 6000000);
        ini_set("memory_limit", "1024M");
        //($this->_request->getPost('node')) ? $this->_request->getPost('node') : 0
        $parametros['idejercicio'] = $this->_request->getParam('plan');
        $parametros['idejer'] = $this->_request->getParam('idejercicio');
        $parametros['idplan711'] = $this->_request->getParam('idpl');
        $parametros['anno'] = $this->_request->getParam('anno');
        $parametros['tiposalida'] = ($this->_request->getParam('tiposalida')!=" ") ? $this->_request->getParam('tiposalida'):NULL;;
        $parametros['entidad'] = ($this->_request->getParam('entidad')!=" ") ? $this->_request->getParam('entidad'):NULL;
        $parametros['idcc'] = ($this->_request->getParam('cc')!=" ") ? $this->_request->getParam('cc'):NULL;
        $parametros['idff'] = ($this->_request->getParam('ff')!=" ") ? $this->_request->getParam('ff'):NULL;
        $parametros['idempimp'] = ($this->_request->getParam('empimp')!=" ") ? $this->_request->getParam('empimp'):NULL;
        $parametros['idreporte'] = $this->_request->getParam('idreporte');
        //var_dump($parametros);die;
        $modelreporte= new ReportesModel();
        switch ($parametros['idreporte']){
            case 1:
                $parametros['tipoplan']=1254;
                $modelreporte->TotalImportacionesF1($parametros);
            break;    
            case 2:
                $parametros['tipoplan']=1254;
                $modelreporte->TotalImportacionesF2($parametros);
            break;    
            case 3:
                $parametros['tipoplan']=1254;
                $modelreporte->TotalImportacionesF1($parametros);
            break;    
            case 4:
                $parametros['tipoplan']=1254;
                $modelreporte->TotalImportacionesA1($parametros);
            break;    
            case 5:
                $parametros['tipoplan']=1254;
                $modelreporte->ResumenImportacionesA2($parametros);
            break;    
            case 6:
                $parametros['tipoplan']=1254;
                $modelreporte->InformacionGAEA3($parametros);
            break;    
            case 7:
                $parametros['tipoplan']=1255;
                $modelreporte->ValoresGeneralesFAR($parametros);
            break;    
            case 8:
                $parametros['tipoplan']=1255;
                $modelreporte->ValoresPorCyEFAR($parametros);
            break;
            case 9:
                $parametros['tipoplan']=1255;
                $modelreporte->DesgloseConsolidado($parametros);
            break;
            case 10:
                $parametros['tipoplan']=1255;
                $modelreporte->SolicitudesRealizadas($parametros);
            break;			
        }
    }

    public function listarDatosAction(){
        $uri= $this->_request->getPost('uri');
        $modelPlan = new DatPlan711Model();
        $data = $modelPlan->listarDatos($uri);
        $resul = array();
		if($uri==4){
			$aux=count($data);
			$data[$aux]['iddatos'] = 'p';
		    $data[$aux]['denominacion'] = 'Presentado';
		}
        echo json_encode(array("data" => $data));
    }
    
    public function getEjerciciosAction() 
    {
        $data = null;
        
        $parametros['tipoplan'] = $this->_request->getPost('tipo');

        ini_set("max_execution_time", 3600); //1hora
        //Creando el modelo de negocio de gestion de usuarios.
        $modeloplan = new DatPlan711Model();
        $data->data = $modeloplan->listarPlanes711($parametros);
        echo json_encode($data);
    }
    
    public function listarEntidadesAction() {
        $idEstructura = $this->_request->getPost('node');
        $dominios = $this->integrator->metadatos->DameHijosEstructura(100000532);
        $data=array();
        $cont=0;
        foreach ($dominios as $value){
            $data[$cont]['identidad']=$value->id;
            $data[$cont]['nombreentidad']=$value->text;
            $cont++;
        }
        echo json_encode(array("data" => $data));
    }    

    public function SolicitudesConsolidadasAction() {
        $parametros['idplan711'] = $this->_request->getParam('idplan711');
		$modelSolicitudes = new DatSolicitud711Model();
        $data = $modelSolicitudes->listarConsolidadas($parametros);
        echo json_encode(array("data" => $data));
    }  	
}
