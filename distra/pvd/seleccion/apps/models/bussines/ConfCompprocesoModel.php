<?php
class ConfCompprocesoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getEntidadesByIdProceso($idproceso)
    {
         return ConfCompproceso::getEntidadesByIdProceso($idproceso);
    }

    public function getProcesosByIdEstructura($idestructura, $idprocesoactual)
    {
        $cargosProcesoActual = DatProcesocargo::getCargosByIdProceso($idprocesoactual);
        if (count($cargosProcesoActual)>0) {
            $arrayCargos = Array();
            foreach ($cargosProcesoActual as $val) {
                if ($val['homologo'] == 1) {
                    $cargo = DatProcesocargo::getCargoByIdEspecializacion($val['idcargo']);
                    if (!empty($cargo)) {
                        array_push($arrayCargos, $cargo['idcargo']);
                    }
                }
                array_push($arrayCargos, $val['idcargo']);
            }
            $procCompartidos = ConfCompproceso::getProcesosByIdEstructura($idestructura, $arrayCargos);
            $procesosPropios = DatProceso::getProcesoByEstructuraCargos($idestructura, $arrayCargos, $idprocesoactual);
            foreach ($procesosPropios as $p => $pp) {
               array_push($procCompartidos, $pp);
            }
            foreach ($procCompartidos as $f => $proc) {
                $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($proc['identidad']);
                $procCompartidos[$f]['entidad'] = $entidad[0]->denominacion;
            }
            return $procCompartidos;
        }  else {
            return Array();
        }
    }
	
	/**
	* Función para guardar las configuraciones de los procesos compartidos por entidades.
	* @param $idproceso Identificador del proceso.
	* @param $arrEntidades Arreglo de entidades.
	*/
	public function saveConfig($idproceso, $arrEntidades)
	{
		try {
			ConfCompproceso::deleteByIdProceso($idproceso);
			foreach($arrEntidades AS $k => $v) {
				$newConf = new ConfCompproceso();
				$newConf->idproceso = $idproceso;
				$newConf->idestructura = $v;
				$newConf->save();
			}
			return true;
		} catch (Exception $e) {
			return false;
		}
	}
}
