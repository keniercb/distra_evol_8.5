<?php

class DatPeriodoproceso extends BaseDatPeriodoproceso
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatEvalpreprocesoevaluativo',
            array('local' => 'idpreprocesoevaluativo', 'foreign' => 'idpreprocesoevaluativo')
        );
        $this->hasMany(
            'DatEvalpersonaevaluacion',
            array('local' => 'idperiodoproceso', 'foreign' => 'idperiodoproceso')
        );
    }

    public function Buscar($idperiodoproceso)
    {
        return Doctrine::getTable('DatPeriodoproceso')->find($idperiodoproceso);
    }

    public function changeRange($idperiodoproceso, $denominacion, $fechainicio, $fechafin, $fechainicioeval, $fechafineval,$planilla)
    {
        try {
            $query = Doctrine_Query::create()
                ->update('DatPeriodoproceso')
                ->where('idperiodoproceso= ? ', $idperiodoproceso);
            if ($denominacion != '') {
                $query->set('denominacion', '?', $denominacion);
            }
            if ($fechainicio != '') {
                $query->set('fdesde', '?', $fechainicio);
            }
            if ($fechafin != '') {
                $query->set('fhasta', '?', $fechafin);
            }
            if ($fechainicioeval != '') {
                $query->set('finicioeval', '?', $fechainicioeval);
            }
            if ($fechafineval != '') {
                $query->set('ffineval', '?', $fechafineval);
            }
            if ($planilla != '') {
                $query->set('planilla', '?', $planilla);
            }
            $result = $query->execute();
            if ($result) {
                return true;
            } else {
                return false;
            }
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    public function findByIdOrDenom($denom, $idpreprocesoevaluativo = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('DatPeriodoproceso')
                ->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere("denominacion ilike '$denom'");
            if (!empty($idperiodoproceso)) {
                $query->andWhere("idpreprocesoevaluativo = ?", $idpreprocesoevaluativo);
            }
            $result = $query->count();
            if ($result > 0) {
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function removeRange($idperiodoproceso)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('DatPeriodoproceso')
                ->where('idperiodoproceso=?', $idperiodoproceso);
            $result = $query->execute();
            if ($result->delete()) {
                return true;
            }
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r->exception = 1;
                return $r;
            } else {
                return (json_encode($e->getMessage()));
            }
        }
    }

    /**
     * Modifica el estado de un periodo evaluativo
     * @param $idperiodoproceso
     * @param int $estado Por defecto le pone el estado de cerrado
     */
    public function ModificarEstado($idperiodoproceso, $estado = 2)
    {
        try {
            $query = Doctrine_Query::create()
                ->update('DatPeriodoproceso')
                ->where('idperiodoproceso= ? ', $idperiodoproceso);
            $query->set('estado', $estado);
            $query->execute();
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    public function getGestionarpersonas($idpersona, $idperiodoproceso, $limit = null, $start = null, $filtro = null)
    {
        try {
            $sql = "SELECT p.nombre, p.papel, p.sapel, p.idpersona
					FROM mod_evaluaciones.dat_estructurapersona as ep
					LEFT JOIN mod_evaluaciones.dat_evalpersonaevaluacion AS ev ON (ev.idestructurapersona = ep.idestructurapersona) 
					LEFT JOIN mod_persona.dat_persona as p ON (p.idpersona = ep.idpersona)					  
					WHERE ev.idperiodoproceso = '{$idperiodoproceso}' AND p.idpersona !='{$idpersona}'";

            if (!empty($filtro)) {
                $sql .= " AND p.idpersona ilike '%$filtro%'";
            }

            if ($limit && $start) {
                $sql .= "LIMIT $limit";
                $sql .= "OFFSET $start";
            }

            $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

            return $result;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantGestionarpersonas($idpersona, $idperiodoproceso, $filtro = null)
    {
        try {
            $sql = "SELECT p.nombre, p.papel, p.sapel, p.idpersona
					FROM mod_evaluaciones.dat_estructurapersona as ep
					LEFT JOIN mod_evaluaciones.dat_evalpersonaevaluacion AS ev ON (ev.idestructurapersona = ep.idestructurapersona) 
					LEFT JOIN mod_persona.dat_persona as p ON (p.idpersona = ep.idpersona)					  
					WHERE ev.idperiodoproceso = '{$idperiodoproceso}' AND p.idpersona !='{$idpersona}'";
            if (!empty($filtro)) {
                $sql .= "AND p.idpersona ilike '%$filtro%'";
            }

            return $sql .= "COUNT";
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
   public function Existe($idperiodoproceso)
   {
       try {
           $sql = "SELECT ep.idperiodoproceso
					FROM mod_evaluaciones.dat_periodoproceso as ep
					WHERE ep.idperiodoproceso = '{$idperiodoproceso}'";

           $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

           return $result;

       } catch (Doctrine_Exception $e) {
           throw $e;
       }
   }

    public function getPeriodosConcluidos($identidad, $idplanilla, $idmodelo, $idpersonaevaluado)
    {
        $sql = "SELECT dpp.idperiodoproceso, dpp.denominacion as periodo, dpp.fdesde, dpp.fhasta,
                      ddpe.denom as proceso, dpe.idpersonaevaluacion
				FROM mod_evaluaciones.dat_periodoproceso as dpp
				INNER JOIN mod_evaluaciones.dat_evalpreprocesoevaluativo AS dppe ON (dpp.idpreprocesoevaluativo = dppe.idpreprocesoevaluativo)
				INNER JOIN mod_evaluaciones.dat_evaldefprocesoevaluativo as ddpe ON (dppe.iddefprocesoevaluativo = ddpe.iddefprocesoevaluativo)
				INNER JOIN mod_evaluaciones.dat_evalpersonaevaluacion AS dpe ON (dpp.idperiodoproceso = dpe.idperiodoproceso)
				WHERE dppe.identidad = '{$identidad}' AND dpe.idpersonaevaluado = '{$idpersonaevaluado}' AND dpe.idplanilla = '{$idplanilla}'
                    AND dpe.estado = 1 AND dpe.idmodelo = '{$idmodelo}' AND dpe.valor IS NOT NULL AND dpp.fhasta < now()";
        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
        return $result;
    }

    public function getPeriodos($identidad)
    {
        $sql = "SELECT distinct(p.idplanilla) as idplanilla, dpp.idperiodoproceso, dpp.denominacion as periodo, dpp.fdesde, dpp.fhasta,
                      p.denom, pr.idprocesoplanilla
				FROM mod_evaluaciones.dat_evalplanillasevaluativas as p
				INNER JOIN mod_evaluaciones.dat_evaldefprocesoplanillas AS pr ON (pr.idplanilla = p.idplanilla)
				INNER JOIN mod_evaluaciones.dat_evalpersonaevaluacion AS pe ON (pe.idplanilla = p.idplanilla)
				INNER JOIN mod_evaluaciones.dat_periodoproceso AS dpp ON (dpp.idperiodoproceso = pe.idperiodoproceso)
				";
        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
        return $result;
    }
}
