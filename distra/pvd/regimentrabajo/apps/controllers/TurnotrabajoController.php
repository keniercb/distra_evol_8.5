<?php

class TurnotrabajoController extends ZendExt_Controller_Secure
{
    protected $configSesiones;

    function init()
    {
        parent::init();
        $habSesiones = new ConfHabilitarsesiones();
        $confSesion = $habSesiones->getHabilitarsesiones();

        $this->configSesiones = $confSesion[0]['habsesion'];
    }

    function turnotrabajoAction()
    {
        $this->render('turnotrabajo');
    }

    function getTurnoTrabajoAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        echo(json_encode($r));
    }

    public function getEstructuraAction()
    {
       // try {
            $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($this->_getParam('node'));
            $datos = Array();
            $pos = 0;
            foreach ($r as $est) {
                if ($est->idconcepto != 7) {
                    $datos[$pos] = $est;
                    $pos++;
                }
            }
            echo json_encode($datos);
//        } catch (Exception $e) {
//            echo json_encode(Array());
//        }
    }
	
	/**
     * Accion utilizada para listar los datos
     */
    public function listarTurnoTrabajoAction() {
        //Creando el modelo de negocio de gestion
        $modeloNegocioTurnoTrabajo = new NomTurnotrabajoModel();
        $identidad = $_SESSION['Zeolides']['entidad']->idestructura;
        //$identidad = $this->_getParam('idestructura');
        $identidades = ZendExt_IoC::getInstance()->metadatos->BuscarArrIdsEstructurasHijasArbolCompleto($identidad);
        //Obteniendo el listado
       $arrTurnoTrabajo = $modeloNegocioTurnoTrabajo->obtenerListadoTurnoTrabajo(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 15),
			$this->_getParam('denominacion'),
			$this->_getParam('fdesde'),
			$this->_getParam('fhasta'),$identidades,
           $this->_getParam('toleranciaentrada'),
           $this->_getParam('toleranciasalida'),
           $this->_getParam('horarioalmuerzo'),
           $this->_getParam('tiempodescanso'),
           $this->_getParam('otro'),
           $this->_getParam('horas')
        );
        //Obteniendo la cantidad total
        $cantTotalTurnoTrabajo = $modeloNegocioTurnoTrabajo->obtenerCantidadTotalTurnoTrabajo($identidades);

        //Imprimiendo el listado
        echo Zend_Json::encode(array('datos' => $arrTurnoTrabajo, 'cantidad' => $cantTotalTurnoTrabajo,'sesiones' => $this->configSesiones));
        
    }

    function addTurnoTrabajoAction()
    {
		//Creando el modelo de negocio
        $modeloNegocioTurnoTrabajo = new NomTurnotrabajoModel(); 
		
		if($modeloNegocioTurnoTrabajo->existeTurnoTrabajo($this->_getParam('denominacion'),null,'add') == null){

			//Insertando los datos
			$modeloNegocioTurnoTrabajo->InsertarTurnoTrabajo(
				$this->_getParam('denominacion'),
				$this->_getParam('descripcion'),
				$this->_getParam('fdesde'),
				$this->_getParam('fhasta'),
				$this->_getParam('horainicio'),
				$this->_getParam('horafin'),
                $this->_getParam('toleranciaentrada'),
                $this->_getParam('toleranciasalida'),
                $this->_getParam('horarioalmuerzo'),
                $this->_getParam('tiempodescanso'),
                $this->_getParam('otro'),
                $this->configSesiones,
                $this->_getParam('idestructura')
			);			
			//Devolviendo una notificación de que todo ocurrió correctamente
			$this->_enviarNotificacionCorrecta();
		}
		else			
			echo "{success: 'true',existe:'3'}"; //Error 3, Denominacion ya existe
    }

    function modTurnoTrabajoAction()
    {
        //Creando el modelo de negocio
        $modeloNegocioTurnoTrabajo = new NomTurnotrabajoModel();

        if ($modeloNegocioTurnoTrabajo->existeTurnoTrabajo($this->_getParam('denominacion'), $this->_getParam('idturnotrabajo'), 'upd') == null) {

            //Insertando los datos
            $modeloNegocioTurnoTrabajo->ModificarTurnoTrabajo(
                $this->_getParam('idturnotrabajo'),
                $this->_getParam('denominacion'),
                $this->_getParam('descripcion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta'),
                $this->_getParam('horainicio'),
                $this->_getParam('horafin'),
                $this->_getParam('toleranciaentrada'),
                $this->_getParam('toleranciasalida'),
                $this->_getParam('horarioalmuerzo'),
                $this->_getParam('tiempodescanso'),
                $this->_getParam('otrodia'),
                $this->configSesiones,
                $this->_getParam('idestructura')
            );
            //Devolviendo una notificación de que todo ocurrió correctamente
            $this->_enviarNotificacionCorrecta();
            //}
            //else
            //echo "{success: 'true',existe:'3'}"; //Error 3, Denominacion ya existe
        }
    }
    
    function delTurnoTrabajoAction()
    {
        $modeloNegocioTurnoTrabajo = new NomTurnotrabajoModel();
        $resp =  $modeloNegocioTurnoTrabajo->EliminarTurnoTrabajo($this->_getParam('idturnotrabajo'));
        if ($resp == false) {
            $m->codMsg = 3;
            echo json_encode($m);
        } else {
            $m->codMsg = 1;
            echo json_encode($m);
        }
    }
	
	private function _enviarNotificacionCorrecta() {
        echo "{success: 'true'}";
    }

}