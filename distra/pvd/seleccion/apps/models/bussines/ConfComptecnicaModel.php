<?php
class ConfComptecnicaModel extends ZendExt_Model
{
    function __construct()
    {
	
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }
	
	/**
	* Función para guardar las configuraciones de las técnicas compratidas por procesos.
	* 
	* @param $idtecnica Identificador de la técnica.
	* @param $idmodelo Identificador del modelo.
	* @param $arrProceso Arreglo de procesos.
	*/
	public function saveConfig($idtecnica, $idmodelo, $arrProceso)
	{
		try {
			$arrIdDel = ConfComptecnica::getIdByTecnicaModelo($idtecnica, $idmodelo);
			foreach($arrIdDel AS $k => $v) {
				$conf = ConfComptecnica::getById($v);
				$conf->delete();
			}
			foreach($arrProceso AS $k => $v) {
				$newConf = new ConfComptecnica();
				$newConf->idtecnica = $idtecnica;
				$newConf->idmodelo = $idmodelo;
				$newConf->idproceso = $v;
				$newConf->save();
			}
			return $res['success'] = true;
		} catch (Exception $e) {
			$res['success'] = false;
			$res['data'] = $e;
			return $e;
		}
	}
	
	/**
	* Función para obtener los procesos dado una tecnica y un modelo.
	* 
	* @param $idtecnica Identificador de la técnica.
	* @param $idmodelo Identificador del modelo.
	* @return Array (Arreglo de idproceso)
	*/
	public function getIdProcesoByTecnicaModelo($idtecnica, $idmodelo)
	{
		try {
			$arrIdProceso = ConfComptecnica::getIdProcesoByTecnicaModelo($idtecnica, $idmodelo);
			$res['success'] = true;
			$res['data'] = $arrIdProceso;
			return $res;
		} catch (Exception $e) {
			$res['success'] = false;
			$res['data'] = $e;
			return $e;
		}
	}
}