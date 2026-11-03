<?php
class GestionartecnicaController extends ZendExt_Controller_Secure
{
    function init()
	{
	    parent::init();
	}

	function gestionartecnicaAction()
    {
        $this->render();
    }

	/**
	* Función para obtener las planillas evaluativas que pueden ser empleadas como técnica de selección
	*/
	function getPlanillaAction()
    {
        $p = ConfTecnicaModel::getPlanilla();
        $r->data = $p['data'];
        $r->total = $p['total'];
        echo json_encode($r);
    }

    /**
	* Función para obtener las planillas evaluativas que están usadas como técnicas de selección
	*/
	function getTecnicaAction()
    {
		$pAct   = ConfTecnicaModel::getTecnica();
		$pNoAct = ConfTecnicaModel::getPlanillaNoActiva();
		foreach ($pAct['data'] AS $k => $v) {
			$pAct['data'][$k]['activo'] = 1;
		}
		if($pNoAct['success']) {
			foreach ($pNoAct['data'] AS $k => $v) {
				$pNoAct['data'][$k]['activo'] = 0;
			}
			foreach ($pNoAct['data'] AS $k => $v) {
				$pAct['data'][count($pAct['data'])] = $v;
				$pAct['total']++;
			}
		}
		echo json_encode($pAct);
    }
	
	/**
	* Función obtener las planillas evaluativas no activas que están en uso.
	*/
	function getPlanillaNoActivaAction()
    {
		$res = ConfTecnicaModel::getPlanillaNoActiva();
		echo json_encode($res['success']);
    }
	
	/**
	* Función para insertar las planillas evaluativas como técnicas de selección
	*/
	function addPlanillaTecnicaAction()
    {
		$arr = json_decode(stripslashes($this->_getParam('arrayTec')));
		echo json_encode(ConfTecnicaModel::addPlanillaTecnica($arr));
    }
	
	/**
	* Función para eliminar una planilla evaluativa como técnica de selección.
	*/
	function delPlanillaTecnicaAction()
    {
		$tec = json_decode(stripslashes($this->_request->getPost('tec')));
		$respuesta = true;
		foreach ($tec as $p) {
			$r = ConfTecnicaModel::delPlanillaTecnica($p);
			if ($r == false) {
				$respuesta = false;
			}		
		}
		echo json_encode($respuesta);
    }
	
	/**
	* Función para obtener los modelos dada una técnica de selección.
	*/
	function getModeloByTecnicaAction()
	{
		echo json_encode(ConfTecnicaModel::getModeloByTecnica($this->_getParam('idtecnica')));
	}
	
	/**
	* Función para obtener los procesos dada una técnica de selección y un modelo.
	*/
	function getProcesoByTecnicaModeloAction()
	{
		echo json_encode(ConfTecnicaModel::getProcesoByTecnicaModelo($this->_getParam('idtecnica'),
		                                                 $this->_getParam('idmodelo'),
														 $this->_getParam('start'),
														 $this->_getParam('limit')));
	}
	
	/**
	* Función para guardar la compartimentación de los resultados de las técnicas entre procesos.
	*/
	function addConfCompTecAction()
	{
		$arrProceso = json_decode(stripslashes($this->_getParam('arrProceso')));
		echo json_encode(ConfComptecnicaModel::saveConfig($this->_getParam('idtecnica'), $this->_getParam('idmodelo'), $arrProceso));
	}
	
	/**
	* Función para guardar la compartimentación de los resultados de las técnicas entre procesos.
	*/
	function getConfCompTecAction()
	{
		echo json_encode(ConfComptecnicaModel::getIdProcesoByTecnicaModelo($this->_getParam('idtecnica'), $this->_getParam('idmodelo')));
	}

    /**
     * Función obtener las planillas evaluativas no activas que están en uso.
     */
    function activarPlanillaAction()
    {
        $res = ConfTecnicaModel::activarPlanilla($this->_getParam('idplanilla'), $this->_getParam('fechafin'));
        echo json_encode($res);
    }
}