<?php

class DatEvalprocesoevaluados extends BaseDatEvalprocesoevaluados
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatEvalpreprocesoevaluativo', array('local' => 'idpreprocesoevaluativo', 'foreign' => 'idpreprocesoevaluativo'));
        $this->hasOne('DatEvaldefprocesoplanillas', array('local' => 'idprocesoplanilla', 'foreign' => 'idprocesoplanilla'));
        $this->hasMany('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatEvalpersonaevaluacion', array('local' => 'idprocesoevaluados', 'foreign' => 'idprocesoevaluados'));
        $this->hasMany('DatPermisoevaluacion', array('local' => 'idprocesoevaluados', 'foreign' => 'idevaluado'));
    }

    public function Buscar($idprocesoevaluados)
    {
        $temp = $this->conn->getTable('DatEvalprocesoevaluados')->find($idprocesoevaluados);
        return $temp->toArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalprocesoevaluados')->execute();
        return $result->toArray();
    }

    public function getEvaluados($idpreprocesoevaluativo, $idEvaluador, $limit = null, $start = null, $filtro = null, $autoevaluacion = null)
    {
        $queryObj = Doctrine_Query::create()
            ->select("pe.idprocesoevaluados,dp.permiso as permiso, (p.nombre ||' '|| p.papel ||' '|| p.sapel) as fullname")
            ->from('DatEvalprocesoevaluados pe')
            ->innerJoin('pe.DatPermisoevaluacion dp');
        if ($autoevaluacion == 1) {
            $queryObj->addWhere("pe.idpreprocesoevaluativo={$idpreprocesoevaluativo}");
        } else {
            $queryObj->addWhere("dp.idevaluador={$idEvaluador}");
        }
        if (!empty($filtro)) {
            $queryObj->addWhere("p.numid ILIKE '%$filtro%' OR p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%' OR p.sapel ILIKE '%$filtro%'");
        }
        //Agregando a la consulta de usuarios las sentencias DQL que devuelve los datos de la persona.
        $queryObj = ZendExt_IoC_Inter::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'pe', 'p', true);
        if ($limit) {
            $queryObj->limit($limit)->offset($start);
        }
        return $queryObj->fetchArray();
    }

    public function getCantEvaluados($idpreprocesoevaluativo, $idEvaluador, $filtro = null, $autoevaluacion = null)
    {
        $queryObj = Doctrine_Query::create()
            ->select('COUNT(pe.idprocesoevaluados) AS cantidad')
            ->from('DatEvalprocesoevaluados pe')
            ->innerJoin('pe.DatPermisoevaluacion dp');
        if ($autoevaluacion == 1) {
            $queryObj->addWhere("pe.idpreprocesoevaluativo={$idpreprocesoevaluativo}");
        } else {
            $queryObj->addWhere("dp.idevaluador={$idEvaluador}");
        }
        if (!empty($filtro)) {
            $queryObj->addWhere("p.numid ILIKE '%$filtro%' OR p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%' OR p.sapel ILIKE '%$filtro%'");
        }

        //Agregando a la consulta de usuarios las sentencias DQL que devuelve los datos de la persona.
        $queryObj = ZendExt_IoC_Inter::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'pe', 'p', false);

        return $queryObj->fetchOne()->cantidad;
    }

    /**
     * Devuelve todos los evaluados por evaluador
     * @param      $idpreprocesoevaluativo
     * @param      $idPersonaEvaluador
     * @param null $limit
     * @param null $start
     * @param null $filtro
     *
     * @return array
     */
    public function getEvaluadosEvaluacion($idpreprocesoevaluativo, $idPersonaEvaluador, $limit = null, $start = null, $filtro = null)
    {

        $queryObj = Doctrine_Query::create()
            ->select("pe.idprocesoevaluados,ed.denominacion AS estadodesarrollo,dp.permiso as permiso,
                dpp.idplanilla as idplanilla, dpp.idmodelo as idmodelo, (p.nombre ||' '|| p.papel ||' '|| p.sapel) as fullname,
                pev.idpersonaevaluacion as idpersonaevaluacion, pev.estado as estado, pev.valor as valor, pev.idescala as idescala,
                pev.deacuerdo as deacuerdo, foto.extension as extension, oact.idcargo as idcargo")
            ->from('DatEvalprocesoevaluados pe')
            ->innerJoin('pe.DatPermisoevaluacion dp')
            ->innerJoin('pe.DatEvaldefprocesoplanillas dpp')
            ->innerJoin('dp.DatEvalprocesoevaluadores ev')
            ->leftJoin('pe.DatEvalpersonaevaluacion pev')
            ->leftJoin('pev.NomEstadodesarrollo ed')
            ->where('ev.idpreprocesoevaluativo = ? AND ev.idpersona=? AND oact.cargooficial=1', array($idpreprocesoevaluativo, $idPersonaEvaluador))
            ->orderBy('pev.estado');

        if (!empty($filtro)) {
            $queryObj->addWhere("p.numid ILIKE '%$filtro%' OR p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%' OR p.sapel ILIKE '%$filtro%'");
        }

        //Agregando a la consulta de usuarios las sentencias DQL que devuelve los datos de la persona.
        $queryObj = ZendExt_IoC_Inter::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'pe', 'p', true,
            array(array('tabla' => 'DatFoto', 'alia' => 'foto', 'relacion' => 'leftjoin'),
                array('tabla' => 'DatOcupacionActual', 'alia' => 'oact', 'relacion' => 'leftjoin')));
        if ($limit) {
            $queryObj->limit($limit)->offset($start);
        }
        return $queryObj->fetchArray();
    }


    public function cantEvaluadosEvaluacion($idpreprocesoevaluativo, $idPersonaEvaluador, $filtro = null)
    {
        $queryObj = Doctrine_Query::create()
            ->select('COUNT(pe.idprocesoevaluados) AS cantidad')
            ->from('DatEvalprocesoevaluados pe')
            ->innerJoin('pe.DatPermisoevaluacion dp')
            ->innerJoin('pe.DatEvaldefprocesoplanillas dpp')
            ->innerJoin('dp.DatEvalprocesoevaluadores ev')
            ->where('ev.idpreprocesoevaluativo = ? AND ev.idpersona=?', array($idpreprocesoevaluativo, $idPersonaEvaluador));

        //Agregando a la consulta de usuarios las sentencias DQL que devuelve los datos de la persona.
        $queryObj = ZendExt_IoC_Inter::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'pe', 'p', false);

        if (!empty($filtro)) {
            $queryObj->addWhere("p.numid ILIKE '%$filtro%' OR p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%' OR p.sapel ILIKE '%$filtro%'");
        }

        return $queryObj->fetchOne()->cantidad;
    }

    public function GetPersonas($idproceso, $strIdPersonas)
    {

        $query = new Doctrine_Query ();
        return $query->select('idpersona')
            ->from('DatEvalprocesoevaluados')
            ->WhereNotIn('idpersona', $strIdPersonas)
            ->orWhere('idpersona in ($strIdPersonas) and idpreprocesoevaluativo <> $idproceso')
            ->fetchArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0, $idevaluadores)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalprocesoevaluados edos')->where('edos.idprocesoevaluadores = ?', $idevaluadores)->limit($limite = 10)->offset($inicio = 0)->execute();
        return $result->toArray();
    }

    public function CantTotal($idevaluadores)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalprocesoevaluados edos')->where('edos.idprocesoevaluadores = ?', $idevaluadores)->execute();
        return count($result->toArray());
    }

    public function getEvaluadosProcesoEvaluador($idpreprocesoevaluativo, $idprocesoevaluadores, $limit, $start)
    {
        $q = Doctrine_Query::create()
            ->select('pe.idprocesoevaluados, pe.idpersona')
            ->from('DatEvalprocesoevaluados pe')
            ->innerJoin('pe.DatPermisoevaluacion p')
            ->where("pe.idpreprocesoevaluativo = {$idpreprocesoevaluativo}")
            ->limit($limit)
            ->offset($start);

        if ($idprocesoevaluadores != '') {
            $q->addWhere("p.idevaluador = {$idprocesoevaluadores}");
        }
        return $q->fetchArray();
    }

    public function cantEvaluadosProcesoEvaluador($idpreprocesoevaluativo, $idprocesoevaluadores)
    {
        $q = Doctrine_Query::create()
            ->select('COUNT(pe.idprocesoevaluados) AS cantidad')
            ->from('DatEvalprocesoevaluados pe')
            ->innerJoin('pe.DatPermisoevaluacion p')
            ->where("pe.idpreprocesoevaluativo = {$idpreprocesoevaluativo}");

        if ($idprocesoevaluadores != '') {
            $q->addWhere("p.idevaluador = {$idprocesoevaluadores}");
        }
        return $q->fetchOne()->cantidad;
    }

    public function existeEvaluadoAutoevaluacion($idpersona, $idpreprocesoevaluativo)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalprocesoevaluados pe')
            ->where("pe.idpersona = {$idpersona} and pe.idpreprocesoevaluativo = {$idpreprocesoevaluativo}")
            ->execute()->toArray();
        if ($result)
            return true;
        return false;
    }

    public function existeEvaluadoEvaldoresEvaldos($idpersona, $idpreprocesoevaluativo, $idprocesoevaluadores)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalprocesoevaluados pe')
            ->where("pe.idpersona = {$idpersona} and pe.idpreprocesoevaluativo = {$idpreprocesoevaluativo} and pe.idprocesoevaluadores = {$idprocesoevaluadores}")
            ->execute()->toArray();
        if ($result)
            return true;
        return false;
    }

    /**
     * Devuelve el resultado de los indicadores por persona para el perfil de indicadores
     * @param $arrIdpersonaevaluacion
     * @param $arrIndPlanilla
     *
     * @return mixed
     */
    public function getResultIndicadoresPersona($arrIdpersonaevaluacion, $arrIndPlanilla)
    {
        $queryObj = Doctrine_Query::create()
            ->select('pev.idpersonaevaluacion, pev.valor as valor, pev.nopersona as nopersona, pev.idpersonaevaluado,
                indev.idindicadorevaluacion, indev.valor, indev.idescala as idescala, indpla.idindicadorplanilla, indpla.idpadre,
                indtext.denom, foto.foto as extension, ev.nombre as nombre, ev.snombre as snombre, ev.papel as papel,
                ev.sapel as sapel, ev.sexo as sexo')
            ->from('DatEvalpersonaevaluacion pev')
            ->innerJoin('pev.DatEvalindicadoresevaluacion indev')
            ->innerJoin('indev.DatEvalindicadoresplanilla indpla')
            ->innerJoin('indpla.NomEvalindicadortexto indtext')
            ->leftjoin('pev.DatPersona ev ON (ev.idpersona = pev.idpersonaevaluado)')
            ->whereIn('pev.idpersonaevaluacion', $arrIdpersonaevaluacion)
            ->whereIn('indpla.idindicadorplanilla', $arrIndPlanilla)
            ->orderBy('pev.idpersonaevaluacion, indpla.idpadre, indpla.idindicadorplanilla');

        $queryObj = ZendExt_IoC::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'pev', 'p', false,
            array(array('tabla' => 'DatFoto', 'alia' => 'foto', 'relacion' => 'leftjoin')));

        return $queryObj->fetchArray();
    }

    /**********************Graficar por periodos**************************************/
    public function getResultPersona($arrIndicadores, $arrIdperiodo, $idpersona)
    {
        $queryObj = Doctrine_Query::create()
            ->select('pev.idpersonaevaluacion, pev.valor as valor, pev.nopersona as nopersona, pev.idpersonaevaluado,
                indev.idindicadorevaluacion, indev.valor, indev.idescala as idescala, indpla.idindicadorplanilla, indpla.idpadre,
                indtext.denom,pe.idperiodoproceso, pe.denominacion')
            ->from('DatEvalpersonaevaluacion pev')
            ->innerJoin('pev.DatPeriodoproceso pe')
            ->innerJoin('pev.DatEvalindicadoresevaluacion indev')
            ->innerJoin('indev.DatEvalindicadoresplanilla indpla')
            ->innerJoin('indpla.NomEvalindicadortexto indtext')
            ->where('pev.idpersonaevaluado = ?', $idpersona)
            ->whereIn('pe.idperiodoproceso', $arrIdperiodo)
            ->whereIn('indpla.idindicadorplanilla', $arrIndicadores)
            ->orderBy('pev.idpersonaevaluacion, indpla.idpadre, indpla.idindicadorplanilla');

        return $queryObj->fetchArray();
    }
    /**************************************************************************************/

    public function getResultPeriodoPersona($arrIdpersonaevaluacion, $arrPeriodo)
    {
        /*$strIdpersona = '-1';
        foreach ($arrIdpersonaevaluacion as $idpersona) {
            if ($idpersona) {
                $strIdpersona .= ',' . $idpersona;
            }
        }
        $strIdperiodo = '-1';
        foreach ($arrPeriodo as $idperiodo) {
            if ($idperiodo) {
                $strIdperiodo .= ',' .$idperiodo;
            }
        }*/
        /* $sql = "SELECT pev.idpersonaevaluacion, pev.valor as valor, pev.idpersonaevaluado as idpersonaevaluado, pev.nopersona as nopersona,
                        indev.idperiodoproceso, indev.denominacion as denom, pre.idpreprocesoevaluativo as idproceso, def.denom as denomproceso, idpersonaevaluado
                        from mod_evaluaciones.dat_evalpersonaevaluacion pev
                        INNER JOIN mod_evaluaciones.dat_periodoproceso indev ON(pev.idperiodoproceso = indev.idperiodoproceso)
                        INNER JOIN mod_evaluaciones.dat_evalpreprocesoevaluativo pre ON (pre.idpreprocesoevaluativo = indev.idpreprocesoevaluativo)
                        INNER JOIN mod_evaluaciones.dat_evaldefprocesoevaluativo def ON (def.iddefprocesoevaluativo = pre.idpdefprocesoevaluativo)
                        WHERE pev.idpersonaevaluado IN ($strIdpersona) AND indev.idperiodoproceso IN ($strIdperiodo)";

                $sql .= ' GROUP BY pev.idpersonaevaluacion, pre.idpreprocesoevaluativo, indev.idperiodoproceso';
                $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);*/

        $queryObj = Doctrine_Query::create()
            ->select('pev.idpersonaevaluacion, pev.valor as valor, pev.idpersonaevaluado as idpersonaevaluado, pev.nopersona as nopersona,
                indev.idperiodoproceso, indev.denominacion as denom, pre.idpreprocesoevaluativo as idproceso, def.denom as denomproceso, pev.idpersonaevaluado')
            ->from('DatEvalpersonaevaluacion pev')
            ->innerJoin('pev.DatPeriodoproceso indev ON (pev.idperiodoproceso = indev.idperiodoproceso)')
            ->innerJoin('indev.DatEvalpreprocesoevaluativo pre')
            ->innerJoin('pre.DatEvaldefprocesoevaluativo def')
            ->whereIn('pev.idpersonaevaluado', $arrIdpersonaevaluacion)
            ->whereIn('indev.idperiodoproceso', $arrPeriodo)
            ->orderBy('pev.idpersonaevaluacion, pre.idpreprocesoevaluativo, indev.idperiodoproceso');

         // ZendExt_IoC_Inter::getInstance()->persona->addDQLPersona($queryObj, 'pev', 'p', 'leftjoin', true);
        $result =  $queryObj->fetchArray();

        $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($arrIdpersonaevaluacion, null, null, 0, null,null,null);
        $p = 0;
        $i = 0;
        $arrayresult = array();

            foreach($persona->data as $pers){
                foreach($arrIdpersonaevaluacion as $r){
                if($r == $pers['idpersona'] ){
                    $arrayresult[$p]['nombreapellidos'] = $pers['nombreapellidos'];
                    $arrayresult[$p]['idpersona'] = $pers['idpersona'];
                    $p++;
                }
            }
        }

        $resultfinal = array();
        $i = 0;
        foreach($arrayresult as $per){
            $resultfinal[$i]['idpersona'] = $per['idpersona'];
            $resultfinal[$i]['nombreapellidos'] = $per['nombreapellidos'];

            $k = 0;

            foreach($result as $r){
                    if($r['idpersonaevaluado'] == $per['idpersona'] ){
                        $resultfinal[$i]['DatEvalpersonaevaluacion'][$k]['DatPeriodoproceso']['denom'] = $r['DatPeriodoproceso']['denom'];
                        $resultfinal[$i]['DatEvalpersonaevaluacion'][$k]['DatPeriodoproceso']['idperiodoproceso'] = $r['DatPeriodoproceso']['idperiodoproceso'];
                        $resultfinal[$i]['DatEvalpersonaevaluacion'][$k]['DatPeriodoproceso']['valor'] = $r['valor'];
                        $k++;

                    }

            }
            $i++;
        }

       return $resultfinal;


    }

    public function getResultPersonadispersion($idperiodoproceso, $arrpersona)
    {

        $queryObj = Doctrine_Query::create()
            ->select('pev.idpersonaevaluacion, pev.valor as valor, pev.idpersonaevaluado as idpersonaevaluado, pev.nopersona as nopersona,
                indev.idperiodoproceso, indev.denominacion as denom, pre.idpreprocesoevaluativo as idproceso, def.denom as denomproceso, pev.idpersonaevaluado')
            ->from('DatEvalpersonaevaluacion pev')
            ->innerJoin('pev.DatPeriodoproceso indev ON (pev.idperiodoproceso = indev.idperiodoproceso)')
            ->innerJoin('indev.DatEvalpreprocesoevaluativo pre')
            ->innerJoin('pre.DatEvaldefprocesoevaluativo def')
            ->whereIn('indev.idperiodoproceso ', $idperiodoproceso)
            ->whereIn('pev.idpersonaevaluado', $arrpersona)
            ->orderBy('pev.idpersonaevaluacion, pre.idpreprocesoevaluativo, indev.idperiodoproceso');


        $result =  $queryObj->fetchArray();

        $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($arrpersona, null, null, 0, null,null,null);
        $p = 0;
        $i = 0;
        $arrayresult = array();

        foreach($persona->data as $pers){
            foreach($arrpersona as $r){
                if($r == $pers['idpersona'] ){
                    $arrayresult[$p]['nombreapellidos'] = $pers['nombreapellidos'];
                    $arrayresult[$p]['idpersona'] = $pers['idpersona'];
                    $p++;
                }
            }
        }

        $resultfinal = array();
        $i = 0;
        foreach($arrayresult as $per){
            $resultfinal[$i]['idpersona'] = $per['idpersona'];
            $resultfinal[$i]['nombreapellidos'] = $per['nombreapellidos'];

            $k = 0;

            foreach($result as $r){
                if($r['idpersonaevaluado'] == $per['idpersona'] ){
                    $resultfinal[$i]['DatEvalpersonaevaluacion'][$k]['DatPeriodoproceso']['denom'] = $r['DatPeriodoproceso']['denom'];
                    $resultfinal[$i]['DatEvalpersonaevaluacion'][$k]['DatPeriodoproceso']['idperiodoproceso'] = $r['DatPeriodoproceso']['idperiodoproceso'];
                    $resultfinal[$i]['DatEvalpersonaevaluacion'][$k]['DatPeriodoproceso']['valor'] = $r['valor'];
                    $k++;

                }

            }
            $i++;
        }

        return $resultfinal;


    }

}
