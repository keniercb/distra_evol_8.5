<?php

class DatEvalpreprocesoevaluativo extends BaseDatEvalpreprocesoevaluativo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatEvaldefprocesoevaluativo',
            array('local' => 'iddefprocesoevaluativo', 'foreign' => 'iddefprocesoevaluativo')
        );
        $this->hasOne(
            'DatEvalprocesoevaluadores',
            array('local' => 'idpreprocesoevaluativo', 'foreign' => 'idpreprocesoevaluativo')
        );
        $this->hasOne(
            'DatEvalprocesoevaluados', array('local' => 'idpreprocesoevaluativo', 'foreign' => 'idpreprocesoevaluativo')
        );
        $this->hasMany(
            'DatPeriodoproceso', array('local' => 'idpreprocesoevaluativo', 'foreign' => 'idpreprocesoevaluativo')
        );
    }

    public function Buscar($idpreprocesoevaluativo)
    {
        $temp = $this->conn->getTable('DatEvalpreprocesoevaluativo')->find($idpreprocesoevaluativo);

        return $temp->toArray();
    }

    public function getByProcesoPlanilla($iddefprocesoevaluativo)
    {
        $query = new Doctrine_Query();
        $result = $query->select('iddefprocesoevaluativo')
            ->from('DatEvalpreprocesoevaluativo')
            ->where("iddefprocesoevaluativo = $iddefprocesoevaluativo")
            ->execute();

        return $result->toArray();
    }

    public function existeProceso($iddefprocesoevaluativo)
    {
        $query = new Doctrine_Query();
        $result = $query->select('iddefprocesoevaluativo')
            ->from('DatEvalpreprocesoevaluativo')
            ->where('iddefprocesoevaluativo = ?', $iddefprocesoevaluativo)
            ->execute();

        return $result->toArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalpreprocesoevaluativo')->execute();

        return $result->toArray();
    }

    //Devuelve los procesos evaluativos preparados junto al proceso evaluativo que pertenece
    public function getProcesoEvalPreparados($limite = 15, $inicio = 0)
    {
        try {
            $arrAux = array();
            $query = new Doctrine_Query();
            $result = $query->select(
                'd.iddefprocesoevaluativo as iddefprocesoevaluativo, d.denom as denom, d.opinionevaluado as opinionevaluado, d.puedereclamar as puedereclamar, p.idpreprocesoevaluativo, p.fechainicioevalua, p.fechafinevalua, p.fechainicioproceso, p.fechafinproceso'
            )
                ->from('DatEvalpreprocesoevaluativo p')
                ->innerJoin('p.DatEvaldefprocesoevaluativo d')
                //->where('r.idplanilla = ?',$idplanilla)
                ->limit($limite)
                ->offset($inicio)
                ->setHydrationMode(Doctrine:: HYDRATE_ARRAY)
                ->execute();

            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalpreprocesoevaluativo')->limit($limite = 10)->offset($inicio = 0)->execute();

        return $result->toArray();
    }

    public function GetIdPersonaPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query ();
        $result = $query->select('d.idpersona')->from('DatEvalpreprocesoevaluativo d')->limit($limite = 10)->offset(
            $inicio = 0
        )->execute();

        return $result->toArray();
    }

    public function ObtenerTodosDefinirDadoPreparar(
        $idestructura, $limit, $start, $idpreprocesoevaluativo, $filtro = null, $fdesde = null, $fhasta = null,
        $estado = null
    )
    {
        try {
            $queryObj = Doctrine_Query::create();
            if ($idpreprocesoevaluativo) {

                $queryObj->select(
                    'per.idperiodoproceso, per.denominacion, per.estado, per.fdesde as fechainicio, per.fhasta as fechafin,per.planilla as planilla,
                    per.finicioeval as fechainicioevalua, per.ffineval as fechafinevalua, per.idpreprocesoevaluativo as _parent, true as _is_leaf,
                    (CASE when per.fhasta is null then null WHEN LOCALTIMESTAMP::DATE > per.fhasta then 0
                    ELSE per.fhasta - LOCALTIMESTAMP::DATE END) as restan, pre.iddefprocesoevaluativo as iddefprocesoevaluativo,
                    def.puedereclamar as puedereclamar, def.opinionevaluado as opinionevaluado, (CASE WHEN pev.nopersona = 1 THEN 3 ELSE 1 END) as idtipoestructura '
                )
                    ->from('DatPeriodoproceso per')
                    ->innerJoin('per.DatEvalpreprocesoevaluativo pre')
                    ->innerJoin(
                        'pre.DatEvaldefprocesoevaluativo def ON (pre.iddefprocesoevaluativo = def.iddefprocesoevaluativo)'
                    )
                    ->innerJoin(
                        'def.NomEvaltipoprocesoevaluativo tp ON (def.idtipoprocesoevaluativo = tp.idtipoprocesoevaluativo)'
                    )
                    ->innerJoin('per.DatEvalpersonaevaluacion pev ON (pev.idperiodoproceso = per.idperiodoproceso)')
                    ->where('per.idpreprocesoevaluativo = ?', $idpreprocesoevaluativo)
                    ->orderBy('per.fdesde DESC');

                if ($filtro) {
                    $queryObj->addWhere("per.denominacion ilike '%$filtro%'");
                }

                if ($fdesde) {
                    $queryObj->addWhere('per.fdesde = ?', $fdesde);
                }

                if ($fhasta) {
                    $queryObj->addWhere('per.fhasta = ?', $fhasta);
                }

                if ($estado) {
                    $queryObj->addWhere('per.estado = ?', $estado);
                }
            } else {

                $queryObj->select(
                    'def.iddefprocesoevaluativo as iddefprocesoevaluativo, def.denom as denominacion,
                    def.puedereclamar as puedereclamar, def.opinionevaluado as opinionevaluado,
                    pre.idpreprocesoevaluativo, pre.fechainicioproceso as fechainicio, pre.fechafinproceso as fechafin,
                    def.idescala as idescala, tp.idtipoprocesoevaluativo as idtipoprocesoevaluativo,
                    tp.denom as tipoproceso, tp.comisionevaluacion as comisionevaluacion,
                    tp.evaluadoresevaluados as evaluadoresevaluados,
                    tp.autoevaluacion as autoevaluacion, null as _parent, false as _is_leaf'
                )
                    ->from('DatEvalpreprocesoevaluativo pre')
                    ->innerJoin(
                        'pre.DatEvaldefprocesoevaluativo def ON (pre.iddefprocesoevaluativo = def.iddefprocesoevaluativo)'
                    )
                    ->innerJoin(
                        'def.NomEvaltipoprocesoevaluativo tp ON (def.idtipoprocesoevaluativo = tp.idtipoprocesoevaluativo)'
                    )

                    ->where('pre.identidad = ?', $idestructura)
                    ->orderBy('pre.idpreprocesoevaluativo DESC');

                if ($filtro) {
                    $queryObj->addWhere("def.denom ilike '%$filtro%'");
                }

                if ($fdesde) {
                    $queryObj->addWhere('pre.fechainicioproceso = ?', $fdesde);
                }

                if ($fhasta) {
                    $queryObj->addWhere('pre.fechafinproceso = ?', $fhasta);
                }
            }

            if ($limit && $start) {
                $queryObj->limit($limit)->offset($start);
            }

            return $queryObj->fetchArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /////////////////////////reclamacion////////////////////////////
    public function ObtenerTodosDefinirDadoPrepararR($idestructura, $limit, $start, $idpreprocesoevaluativo, $filtro = null, $fdesde = null, $fhasta = null)
    {
        try {
            $queryObj = Doctrine_Query::create();
            if ($idpreprocesoevaluativo) {
                $queryObj->select(
                    'per.idperiodoproceso, per.denominacion, per.estado, per.fdesde as fechainicio, per.fhasta as fechafin,per.planilla as planilla,
                    per.finicioeval as fechainicioevalua, per.ffineval as fechafinevalua, per.idpreprocesoevaluativo as _parent, true as _is_leaf,
                    (CASE when per.fhasta is null then null WHEN LOCALTIMESTAMP::DATE > per.fhasta then 0
                    ELSE per.fhasta - LOCALTIMESTAMP::DATE END) as restan, pre.iddefprocesoevaluativo as iddefprocesoevaluativo,
                    def.puedereclamar as puedereclamar, def.opinionevaluado as opinionevaluado'
                )
                    ->from('DatPeriodoproceso per')
                    ->innerJoin('per.DatEvalpreprocesoevaluativo pre')
                    ->innerJoin(
                        'pre.DatEvaldefprocesoevaluativo def ON (pre.iddefprocesoevaluativo = def.iddefprocesoevaluativo)'
                    )
                    ->innerJoin(
                        'def.NomEvaltipoprocesoevaluativo tp ON (def.idtipoprocesoevaluativo = tp.idtipoprocesoevaluativo)'
                    )
                    ->where('per.idpreprocesoevaluativo = ?', $idpreprocesoevaluativo)
                    ->orderBy('per.fdesde DESC');

                if ($filtro) {
                    $queryObj->addWhere("per.denominacion ilike '%$filtro%'");
                }

                if ($fdesde) {
                    $queryObj->addWhere('per.fdesde = ?', $fdesde);
                }

                if ($fhasta) {
                    $queryObj->addWhere('per.fhasta = ?', $fhasta);
                }
            } else {
                $queryObj->select(
                    'def.iddefprocesoevaluativo as iddefprocesoevaluativo, def.denom as denominacion,
                    def.puedereclamar as puedereclamar, def.opinionevaluado as opinionevaluado,
                    pre.idpreprocesoevaluativo, pre.fechainicioproceso as fechainicio, pre.fechafinproceso as fechafin,
                    def.idescala as idescala, tp.idtipoprocesoevaluativo as idtipoprocesoevaluativo,
                    tp.denom as tipoproceso, tp.comisionevaluacion as comisionevaluacion,
                    tp.evaluadoresevaluados as evaluadoresevaluados,
                    tp.autoevaluacion as autoevaluacion, null as _parent, false as _is_leaf'
                )
                    ->from('DatEvalpreprocesoevaluativo pre')
                    ->innerJoin(
                        'pre.DatEvaldefprocesoevaluativo def ON (pre.iddefprocesoevaluativo = def.iddefprocesoevaluativo)'
                    )
                    ->innerJoin(
                        'def.NomEvaltipoprocesoevaluativo tp ON (def.idtipoprocesoevaluativo = tp.idtipoprocesoevaluativo)'
                    )
                    ->where('pre.identidad = ?', $idestructura)
                    ->orderBy('pre.idpreprocesoevaluativo DESC');

                if ($filtro) {
                    $queryObj->addWhere("def.denom ilike '%$filtro%'");
                }

                if ($fdesde) {
                    $queryObj->addWhere('pre.fechainicioproceso = ?', $fdesde);
                }

                if ($fhasta) {
                    $queryObj->addWhere('pre.fechafinproceso = ?', $fhasta);
                }
            }

            if ($limit && $start) {
                $queryObj->limit($limit)->offset($start);
            }
            return $queryObj->fetchArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    //////////////////////graficar//////////////////////////////
    public function ObtenerTodosProcesos($idpreprocesoevaluativo)
    {
        try {
            $queryObj = Doctrine_Query::create();

            $sql = "SELECT
				  dat_evalpreprocesoevaluativo.idpreprocesoevaluativo, 
				  dat_evalpreprocesoevaluativo.iddefprocesoevaluativo, 
				  dat_evalpreprocesoevaluativo.fechainicioproceso, 
				  dat_evalpreprocesoevaluativo.fechafinproceso, 
				  dat_evalpreprocesoevaluativo.idorden, 
				  dat_evalpreprocesoevaluativo.identidad, 
				  dat_evalpreprocesoevaluativo.idcentrodatos, 
				  dat_evalpreprocesoevaluativo.opinante, 
				  dat_evaldefprocesoevaluativo.denom
				FROM 
				  mod_evaluaciones.dat_evalpreprocesoevaluativo, 
				  mod_evaluaciones.dat_evaldefprocesoevaluativo
				WHERE 
				  dat_evalpreprocesoevaluativo.iddefprocesoevaluativo = dat_evaldefprocesoevaluativo.iddefprocesoevaluativo AND
				  dat_evalpreprocesoevaluativo.idpreprocesoevaluativo = $idpreprocesoevaluativo";


            $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
            return $result;

        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function ObtenerTodosPeriodos($idestructura, $idpreprocesoevaluativo)
    {
        try {
            $queryObj = Doctrine_Query::create();
            if ($idpreprocesoevaluativo) {
                $queryObj->select(
                    'per.idperiodoproceso, per.denominacion, per.estado, per.fdesde as fechainicio, per.fhasta as fechafin,
                    per.finicioeval as fechainicioevalua, per.ffineval as fechafinevalua, per.idpreprocesoevaluativo as _parent, true as _is_leaf,
                    (CASE when per.fhasta is null then null WHEN LOCALTIMESTAMP::DATE > per.fhasta then 0
                    ELSE per.fhasta - LOCALTIMESTAMP::DATE END) as restan, pre.iddefprocesoevaluativo as iddefprocesoevaluativo,
                    def.puedereclamar as puedereclamar, def.opinionevaluado as opinionevaluado'
                )
                    ->from('DatPeriodoproceso per')
                    ->innerJoin('per.DatEvalpreprocesoevaluativo pre')
                    ->innerJoin(
                        'pre.DatEvaldefprocesoevaluativo def ON (pre.iddefprocesoevaluativo = def.iddefprocesoevaluativo)'
                    )
                    ->innerJoin(
                        'def.NomEvaltipoprocesoevaluativo tp ON (def.idtipoprocesoevaluativo = tp.idtipoprocesoevaluativo)'
                    )
                    ->where('per.idpreprocesoevaluativo = ?', $idpreprocesoevaluativo)
                    ->orderBy('per.fdesde ASC');


            } else {
                $queryObj->select(
                    'def.iddefprocesoevaluativo as iddefprocesoevaluativo, def.denom as denominacion,
                    def.puedereclamar as puedereclamar, def.opinionevaluado as opinionevaluado,
                    pre.idpreprocesoevaluativo, pre.fechainicioproceso as fechainicio, pre.fechafinproceso as fechafin,
                    def.idescala as idescala, tp.idtipoprocesoevaluativo as idtipoprocesoevaluativo,
                    tp.denom as tipoproceso, tp.comisionevaluacion as comisionevaluacion,
                    tp.evaluadoresevaluados as evaluadoresevaluados,
                    tp.autoevaluacion as autoevaluacion, null as _parent, false as _is_leaf'
                )
                    ->from('DatEvalpreprocesoevaluativo pre')
                    ->innerJoin(
                        'pre.DatEvaldefprocesoevaluativo def ON (pre.iddefprocesoevaluativo = def.iddefprocesoevaluativo)'
                    )
                    ->innerJoin(
                        'def.NomEvaltipoprocesoevaluativo tp ON (def.idtipoprocesoevaluativo = tp.idtipoprocesoevaluativo)'
                    )
                    ->where('pre.identidad = ?', $idestructura)
                    ->orderBy('pre.idpreprocesoevaluativo DESC');


            }
            return $queryObj->fetchArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    ///////////////////////////////////////////////////
    public function GetCantTotal($idestructua, $idpreprocesoevaluativo = null, $filtro = null, $fdesde = null, $fhasta = null, $estado = null)
    { //Devuelve la cantidad total que tiene la tabla
        try {
            $queryObj = Doctrine_Query::create();
            if ($idpreprocesoevaluativo) {
                $queryObj->select('COUNT(idpreprocesoevaluativo) as cantidad')
                    ->from('DatEvalpreprocesoevaluativo')
                    ->where('idpreprocesoevaluativo = ?', $idpreprocesoevaluativo);

                if ($filtro) {
                    $queryObj->addWhere("per.denominacion ilike '%$filtro%'");
                }

                if ($fdesde) {
                    $queryObj->addWhere('per.fdesde = ?', $fdesde);
                }

                if ($fhasta) {
                    $queryObj->addWhere('per.fhasta = ?', $fhasta);
                }

                if ($estado) {
                    $queryObj->addWhere('per.estado = ?', $estado);
                }
            } else {
                $queryObj->select('COUNT(iddefprocesoevaluativo) as cantidad')
                    ->from('DatEvalpreprocesoevaluativo')
                    ->where('identidad = ?', $idestructua);
            }

            return $queryObj->fetchOne()->cantidad;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    //Funciones para buscar solamente los procesos
    public function getProcesosEvalPlanillaActiva($idestructura, $limit, $start)
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql
            = 'SELECT
			pp.idpreprocesoevaluativo, pp.iddefprocesoevaluativo, pp.fechainicioproceso, pp.fechafinproceso,
			def.denom, def.fechacomienzo, def.idtipoprocesoevaluativo, def.opinionevaluado, def.puedereclamar,
			tp.idtipoprocesoevaluativo, tp.denom as tipoproceso, tp.comisionevaluacion, tp.evaluadoresevaluados, tp.autoevaluacion, tp.orden as orden
			FROM mod_evaluaciones.dat_evalpreprocesoevaluativo pp
			inner join mod_evaluaciones.dat_evaldefprocesoevaluativo def on(pp.iddefprocesoevaluativo = def.iddefprocesoevaluativo)
			inner join mod_evaluaciones.nom_evaltipoprocesoevaluativo tp on(def.idtipoprocesoevaluativo = tp.idtipoprocesoevaluativo)
			inner join mod_evaluaciones.dat_evaldefprocesoplanillas dpp on(def.iddefprocesoevaluativo = dpp.iddefprocesoevaluativo)'
            . 'where pp.identidad = ' . $idestructura
            . 'order by pp.idpreprocesoevaluativo DESC offset ' . $start . ' limit ' . $limit;

        return ZendExt_ClassStandard::ArrayObject($conn->fetchAll($sql));
    }

    public function getCantTotalProcesosEvalPlanillaActiva($idestructura)
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql
            = 'SELECT count(pp.idpreprocesoevaluativo) as cantidad
			FROM mod_evaluaciones.dat_evalpreprocesoevaluativo pp
			inner join mod_evaluaciones.dat_evaldefprocesoevaluativo def on(pp.iddefprocesoevaluativo = def.iddefprocesoevaluativo)
			inner join mod_evaluaciones.dat_evaldefprocesoplanillas dpp on(def.iddefprocesoevaluativo = dpp.iddefprocesoevaluativo)'
            . 'where pp.identidad = ' . $idestructura;

        $result = ZendExt_ClassStandard::ArrayObject($conn->fetchAll($sql));

        return $result[0]->cantidad;
    }

    public function ObtenerIdescala($idpreprocesoevaluativo){
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql
            = "SELECT
			pp.idpreprocesoevaluativo, def.idescala
			FROM mod_evaluaciones.dat_evalpreprocesoevaluativo pp
			inner join mod_evaluaciones.dat_evaldefprocesoevaluativo def on(pp.iddefprocesoevaluativo = def.iddefprocesoevaluativo)
            where pp.idpreprocesoevaluativo = '$idpreprocesoevaluativo'";

        return ZendExt_ClassStandard::ArrayObject($conn->fetchAll($sql));
    }
}

