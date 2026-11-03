<?php

class modelosService extends ZendExt_Model {

    public function BuscarModelosPorPlanilla($idplanilla, $inicio, $limite) {
        $result = DatEvalmodelo::getModelosPorPlanilla($idplanilla, $inicio, $limite);
        return ZendExt_ClassStandard::ArrayObject($result);
    }

    public function CantidadModelosPorPlanilla($idplanilla) {
        $result = DatEvalmodelo::getCantidadModelosPorPlanilla($idplanilla);
        return $result;
    }

    public function BuscarModelosByPlanilla($idplanilla) {
        $result = DatEvalmodelo::ObtenerModeloByPlanilla($idplanilla);
        return ZendExt_ClassStandard::ArrayObject($result);
    }

    public function getModelosActivosPorPlanilla($idplanilla) {
        $result = DatEvalmodelo::getModelosActivosPorPlanilla($idplanilla);
        return $result;
    }

    public function getHechosByModelo($idmodelo) {
        $DatEvalhecho = new DatEvalhecho();
        return $DatEvalhecho->getAllHechosByModelo($idmodelo);
    }

    public function getModeloById($idmodelo) {
        $DatEvalmodelo = new DatEvalmodelo();
        return ZendExt_ClassStandard::ArrayObject($DatEvalmodelo->getModeloById($idmodelo));
    }
	public function getAllModelos($limit, $start) {
        $DatEvalmodelo = new DatEvalmodelo();
		$r['datos'] = $DatEvalmodelo->GetByLimite($limit, $start);
		$r['cantidad'] = $DatEvalmodelo->GetCantTotal();
        return $r;//ZendExt_ClassStandard::ArrayObject();
    }

}

?>