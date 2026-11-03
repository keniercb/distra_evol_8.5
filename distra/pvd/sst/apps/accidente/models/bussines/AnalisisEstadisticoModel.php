<?php
class AnalisisEstadisticoModel extends ZendExt_Model
{
    public function AnalisisEstadisticoModel()
    {
        parent::ZendExt_Model();
    }

    public function getDatosDashboard($id)
    {
        $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
        if (!empty($id)) {
            $idestructura = $id;
        }
        $idcargosArray = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura);
        $cargos = array();
        foreach ($idcargosArray as $value) {
            array_push($cargos, $value['idcargo']);
        }
        $res['tipoaccidente'] = $this->obtenerTotalTipoAccidente($cargos);
        $res['formaaccidente'] = $this->obtenerTotalFormaAccidente($cargos);
        $res['costoaccidente'] = $this->obtenerCostosPorAccidente($cargos);
        $res['implicadosaccidente'] = $this->obtenerCantImplicadosPorAccidente($cargos);
        $res['accidenteyear'] = $this->obtenerCantAccidentePorYear($cargos);
        $res['fallecidosyear'] = $this->obtenerCantFallecidosPorYear($cargos);
        return $res;
    }

    private function obtenerTotalTipoAccidente($idestructura)
    {
        $datos = DatAccidente::obtenerTotalTipoAccidente($idestructura);
        $res = Array();
        foreach ($datos as $v) {
            array_push($res, array('index' => $v['denominacion'], 'valor' => $v['cantidad']));
        }
        return $res;
    }

    private function obtenerTotalFormaAccidente($idestructura)
    {
        $datos = DatAccidente::obtenerTotalFormaAccidente($idestructura);
        $res = Array();
        foreach ($datos as $v) {
            array_push($res, array('index' => $v['denominacion'], 'valor' => $v['cantidad']));
        }
        return $res;
    }

    private function obtenerCostosPorAccidente($idestructura)
    {
        $datos = DatAccidentecosto::obtenerCostosPorAccidente($idestructura);
        $res = Array();
        foreach ($datos as $v) {
            array_push($res, array('index' => $v['denominacion'], 'valor' => $v['total']));
        }
        return $res;
    }

    private function obtenerCantImplicadosPorAccidente($arrEstructura) {
        $datos = DatAccidenteimplicado::obtenerCantImplicadosPorAccidente($arrEstructura);
        $res = Array();
        foreach ($datos as $v) {
            array_push($res, array('index' => $v['denominacion'], 'valor' => $v['cantidad']));
        }
        return $res;
    }

    private function obtenerCantAccidentePorYear($arrEstructura)
    {
        $datos = DatAccidente::obtenerCantAccidentePorYear($arrEstructura);
        $res = Array();
        foreach ($datos as $v) {
            array_push($res, array('index' => $v['denominacion'], 'valor' => $v['cantidad']));
        }
        return $res;
    }

    private function obtenerCantFallecidosPorYear($arrEstructura)
    {
        $datos = DatAccidenteimplicado::obtenerCantFallecidosPorYear($arrEstructura);
        $res = Array();
        foreach ($datos as $v) {
            array_push($res, array('index' => $v['denominacion'], 'valor' => $v['cantidad']));
        }
        return $res;
    }
}