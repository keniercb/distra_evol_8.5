<?php
class PlanconteoService extends ZendExt_Model
{
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function verificarExistenciaPlanAnual($idEjercicioactual)
    {
        $planconteo = new DatPlanconteo();
        return $planconteo->verificarExistenciaPlanAnual($idEjercicioactual);
    }

    public function ObtenerIdPlanDadoAnno($idEjercicioactual, $idestructuracomun)
    {
        $planconteo = new DatPlanconteo();
        return $planconteo->obtenerIdPlanDadoAnno($idEjercicioactual, $idestructuracomun);
    }

    public function ObtenerMesesParaInventario($idplan)
    {
        $planconteom = new DatPlanconteom();
        return $planconteom->obtenerMesesParaInventario($idplan);
    }

    public function ObtenerPeriodosParaInventario($idplan)
    {
        $planconteom = new DatPlanconteom();
        return $planconteom->obtenerPeriodosParaInventario($idplan);
    }

    /**
     * Funcion para obtener el por cinto del mes actual
     *
     * @param
     *
     * @return numeric
     */
    public function obtenerPorCientoMesActual($idejerciciodelsubsistema, $idarea)
    {
        $objDatPlanConteoMes = new DatPlanconteom();
        $datos = $objDatPlanConteoMes->obtenerPorCientoMes(
            $idejerciciodelsubsistema, $idarea, LogisticaGlobal::getMesActual()
        );

        return $datos;
    }
}