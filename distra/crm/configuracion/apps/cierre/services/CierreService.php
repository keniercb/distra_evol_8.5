<?php

class CierreService extends ZendExt_Model
{

    public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function periodoActualSubsistema($identidad, $idsubsistema,$instancia=0)
    {
        try{
            $integrator = ZendExt_IoC::getInstance();
            $estructurasubsist = $integrator->datosmaestros->buscarInstancia($identidad, $idsubsistema);
            if (!$estructurasubsist->idestructurasubsist) {
                return 0;
            }
            $result = DatCierre::BuscarCierreSubsistema($estructurasubsist->idestructurasubsist);
            if($instancia==1){
                return $result;
            }
            return ($result[0]['idperiodoactual']) ? $result[0]['idperiodoactual'] : 0;
        }catch (Exception $e){
            throw $e;
        }
    }

    public function ejercicioActualSubsistema($identidad, $idsubsistema)
    {
        $integrator = ZendExt_IoC::getInstance();
        $estructurasubsist = $integrator->datosmaestros->buscarInstancia($identidad, $idsubsistema);
        if (!$estructurasubsist->idestructurasubsist) {
            return 0;
        }
        $result = DatCierre::BuscarCierreSubsistema($estructurasubsist->idestructurasubsist);
        return ($result[0]['idejercicioactual']) ? $result[0]['idejercicioactual'] : 0;
    }

    public function cierreActualSubsistema($identidad, $idsubsistema)
    {
        $integrator = ZendExt_IoC::getInstance();
        $estructurasubsist = $integrator->datosmaestros->buscarInstancia($identidad, $idsubsistema);
        $result = DatCierre::BuscarCierreSubsistema($estructurasubsist->idestructurasubsist);
        $standard = new ZendExt_ClassStandard();
        return $standard->Object($result);
    }

    public function subsistemasPeriodo($identidad, $idperiodo)
    {
        $aux = new CierreModel();
        $result = $aux->subsistemasPeriodo($identidad, $idperiodo);
        return $result;
    }

    /**
     * Obtener los subsistemas activos de un per&iacute;odo determinado que contabilizan y no han cerrado.
     * @param enteropos $identidad Id estructura com&uacute;n.
     * @param enteropos $idperiodo Id per&iacute;odo.
     * @return array Subsistemas contables de la entidad en un per&iacute;odo dado que cierran.
     */
    public function subsistemasPeriodoSinCerrarContab($identidad, $idperiodo,$idsubsistema)
    {
        $aux = new CierreModel();
        $result = $aux->subsistemasPeriodoSinCerrarContab($identidad, $idperiodo ,$idsubsistema);
        return $result;
    }

    public function subsistemasCierreEntidad($identidad)
    {
        $aux = new CierreModel();
        return $aux->subsistemasCierreEntidad($identidad);
    }

    public function subsistemasEjercicio($identidad, $idejercicio)
    {
        $aux = new CierreModel();
        return $aux->subsistemasEjercicio($identidad, $idejercicio);
    }

    public function cerrarPeriodo($identidad, $idsubsistema)
    {
        $aux = new CierreModel();
        return $aux->cerrarPeriodo($identidad, $idsubsistema);
    }

    public function aperturarPeriodo($identidad, $idsubsistema)
    {
        $aux = new CierreModel();
        $aux->aperturarPeriodo($identidad, $idsubsistema);
    }

    public function cerrarEjercicio($identidad, $idsubsistema)
    {
        $aux = new CierreModel();
        return $aux->cerrarEjercicio($identidad, $idsubsistema);
    }

    public function adicionarCierre($idestructurasubsist, $periodo, $ejercicio)
    {
        try {
            $cierre = new DatCierre();
            $cierre->idestructurasubsist = $idestructurasubsist;
            $cierre->idperiodoactual = $periodo;
            $cierre->idejercicioactual = $ejercicio;
            $cierre->save();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modificarCierre($idestructurasubsist, $periodo, $ejercicio)
    {
        try {
            $cierre = Doctrine::getTable('DatCierre')->findBy('idestructurasubsist', $idestructurasubsist);
            $cierre[0]->idperiodoactual = $periodo;
            $cierre[0]->idejercicioactual = $ejercicio;
            $cierre[0]->save();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function eliminarCierre($idestructurasubsist)
    {
        try {
            $idcierre = DatCierre::BuscarCierreSubsistema($idestructurasubsist);
            $cierre = new DatCierre();
            $iddcierre = $idcierre[0]['idcierre'];
            $cierre = Doctrine::getTable('DatCierre')->find($iddcierre);
            $cierre->idcierre = $idcierre;
            $cierre->delete();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function buscarCierre($idestructurasubsist)
    {
        $cierre = DatCierre::BuscarCierreSubsistema($idestructurasubsist);
        if ($cierre) {
            return 1;
        }
        return 0;
    }

    public function buscarObjCierre($idestructurasubsist)
    {
        $cierre = DatCierre::BuscarCierreSubsistema($idestructurasubsist);
        $stdClass = new ZendExt_ClassStandard();
        return $stdClass->Object($cierre);
    }

    public function tieneCierreDiario($idestructura, $idsubsistema)
    {
        $integrator = ZendExt_IoC::getInstance();
        $idestructurasubsist = $integrator->datosmaestros->encuentraIdestructurasubsistByIdestructura($idsubsistema, $idestructura);
        $tiene_cd = DatCierre::tieneCierreDiario($idestructurasubsist);
        if ($tiene_cd)
            return $tiene_cd;
        return 2;
    }

    public function cierreDiario($idestructura, $idsubsistema, $es_cierrediario)
    {
        $aux = new CierreModel();
        return $aux->cierreDiario($idestructura, $idsubsistema, $es_cierrediario);
    }

    public function asignarEjercicioPeriodo($identidad, $idsubsistema, $ejercicio, $periodo)
    {
        $aux = new CierreModel();
        return $aux->asignarEjercicioPeriodo($identidad, $idsubsistema, $ejercicio, $periodo);
    }

    public function obtenerCierrePeriodoSubsistema($idestructurasubsist,$idperiodo){
        try{
            return DatCierreperiodo::ObtenerCierre($idestructurasubsist, $idperiodo);
        }catch (Exception $e){
            return array();
        }
    }

}

?>
