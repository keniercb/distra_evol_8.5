<?php

class DatEvalpersonaevaluacion extends BaseDatEvalpersonaevaluacion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatEstructurapersona', array('local' => 'idestructurapersona', 'foreign' => 'idestructurapersona')
        );
        $this->hasMany(
            'DatEvalindicadoresevaluacion', array('local' => 'idpersonaevaluacion', 'foreign' => 'idpersonaevaluacion')
        );
        $this->hasOne(
            'DatEvalescalavalorescualitativos',
            array('local' => 'idestadodesarrollo', 'foreign' => 'idescalavalorescualitativos')
        );
        $this->hasOne(
            'DatPeriodoproceso',
            array('local' => 'idperiodoproceso', 'foreign' => 'idperiodoproceso')
        );
        $this->hasMany('DatPersona', array('local' => 'idpersonaevaluado', 'foreign' => 'idpersona'));
        $this->hasMany('DatPersona', array('local' => 'idpersonaevaluador', 'foreign' => 'idpersona'));

        $this->hasOne('NomCausanoevaluado', array('local' => 'idcausanoevaluado', 'foreign' => 'idcausanoevaluado'));
        $this->hasOne(
            'DatReclamacion',
            array('local' => 'idpersonaevaluacion', 'foreign' => 'idpersonaevaluacion')
        );
    }

    public function Buscar($idpersonaevaluacion)
    {
        return Doctrine::getTable('DatEvalpersonaevaluacion')->find($idpersonaevaluacion);
    }

    /**
     * Devuelve los evaluados de un proceso evaluativo
     *
     * @param      $idperiodoproceso        Identificador del periodo evaluativo
     * @param null $idpersonaEvaluador Identificador de persona del evaluador
     * @param null $filtro
     * @param null $limit
     * @param null $start
     * @param null $showEvaluador
     *
     * @return Array Listado de evaluados
     */

    public function getEvaluadosProceso(
        $idperiodoproceso, $idpersonaEvaluador = null, $filtro = null, $limit = null, $start = null,
        $showEvaluador = false
    )
    {
        $sql = "SELECT pev.idestructurapersona,
 				 p.idpersona, p.nombre, p.snombre, p.papel, p.sapel,doc.numero,
				(p.nombre ||' '|| p.papel ||' '|| p.sapel) as fullname,
				pev.valor as evaluacion, pev.valor as valor, pev.idescala as idescala, encode(foto.foto, 'escape') as foto, p1.idpersona as idpersonaevaluador,
				(p1.nombre ||' '|| p1.papel ||' '|| p1.sapel) as evaluador
				FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
				left JOIN mod_persona.dat_persona p ON (p.idpersona = pev.idpersonaevaluado)
				LEFT JOIN mod_persona.dat_foto foto ON (p.idpersona = foto.idpersona)
				left JOIN mod_persona.dat_docidentidad doc ON (p.idpersona = doc.idpersona)
				left JOIN mod_persona.dat_persona p1 ON (p1.idpersona = pev.idpersonaevaluador)
                WHERE pev.idperiodoproceso={$idperiodoproceso}";

        if (!empty($idpersonaEvaluador)) {
            $sql .= " AND pev.idpersonaevaluador = {$idpersonaEvaluador}";
        }

        if (!empty($filtro)) {
            $sql .= " AND (p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%' OR p.sapel ILIKE '%$filtro%')";
        }

        if ($limit) {
            $sql .= " LIMIT $limit";
        }

        if ($start) {
            $sql .= " OFFSET $start";
        }

        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

        return $result;
    }


    /**
     * Devuelve la cantidad de personas a evaluadar en un periodo evaluativo
     *
     * @param      $idperiodoproceso
     * @param      $idpersonaEvaluador
     * @param null $filtro
     *
     * @return mixed
     */
    public function getCantEvaluadosPeriodo($idperiodoproceso, $idpersonaEvaluador = null, $filtro = null)
    {
        $queryObj = Doctrine_Query::create()
            ->select('COUNT(pev.idpersonaevaluacion) AS cantidad')
            ->from('DatEvalpersonaevaluacion pev')
            ->where('pev.idperiodoproceso = ?', $idperiodoproceso);

        if (!empty($idpersonaEvaluador)) {
            $queryObj->addWhere('pev.idpersonaevaluador = ?', $idpersonaEvaluador);
        }

        if (!empty($filtro)) {
            $queryObj->addWhere(
                "p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%' OR p.sapel ILIKE '%$filtro%'"
            );
        }

        //Agregando a la consulta de evaluados las sentencias DQL que devuelve los datos de la persona.
        $queryObj = ZendExt_IoC::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'pev', 'p', false, array());

        return $queryObj->fetchOne()->cantidad;
    }

    //******************Evaluadores para la estructura del periodo************//

    public function getEvaluadoresEstructura(
        $idperiodoproceso, $filtro = null, $limit = null, $start = null

    )
    {
        $sql = "SELECT DISTINCT(pev.idpersonaevaluador) ,
				(p.nombre ||' '|| p.papel ||' '|| p.sapel) as evaluador
				FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
				left JOIN mod_persona.dat_persona p ON (p.idpersona = pev.idpersonaevaluador)
				LEFT JOIN mod_persona.dat_foto foto ON (p.idpersona = foto.idpersona)
				left JOIN mod_persona.dat_docidentidad doc ON (p.idpersona = doc.idpersona)				
               ";

        if (!empty($filtro)) {
            $sql .= " where (p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%' OR p.sapel ILIKE '%$filtro%')";
        }

        if ($limit) {
            $sql .= " LIMIT $limit";
        }

        if ($start) {
            $sql .= " OFFSET $start";
        }

        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

        return $result;
    }

     //**************cant evaluadores*************//

    public function getCantEvaluadoresEstructura($idperiodoproceso, $filtro = null)
    {
        $queryObj = Doctrine_Query::create()
            ->select('COUNT(pev.idpersonaevaluacion) AS cantidad')
            ->from('DatEvalpersonaevaluacion pev')
            ->where('pev.idperiodoproceso = ?', $idperiodoproceso);

        if (!empty($filtro)) {
            $queryObj->addWhere(
                "p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%' OR p.sapel ILIKE '%$filtro%'"
            );
        }

        //Agregando a la consulta de evaluados las sentencias DQL que devuelve los datos de la persona.
        $queryObj = ZendExt_IoC::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'pev', 'p', false, array());

        return $queryObj->fetchOne()->cantidad;
    }

    public function getEvaluadosPersona($idpreprocesoevaluativo, $idpersonaEvaluador)
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                "pe.idestructurapersona, (p.nombre ||' '|| p.papel ||' '|| p.sapel) as fullname, (CASE WHEN pev.resultado is null THEN '' ELSE pev.resultado END) AS evaluacion"
            )
            ->from('DatEstructurapersona pe')
            ->innerJoin('pe.DatPermisoevaluacion pso')
            ->innerJoin('pso.DatEvalprocesoevaluadores edor')
            ->leftJoin('pe.DatEvalpersonaevaluacion pev')
            ->where("edor.idpreprocesoevaluativo={$idpreprocesoevaluativo} and edor.idpersona={$idpersonaEvaluador}");

        //Agregando a la consulta de usuarios las sentencias DQL que devuelve los datos de la persona.
        $queryObj = ZendExt_IoC::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'pe', 'p', true, array());

        return $queryObj->fetchArray();
    }

//*************************************estructura evaluativa************************************************//
    public function resumenProcesoEval($idperiodoproceso, $strIdCargo)
    {
        $idp = implode(',', $strIdCargo);

        $sqlnopersona = "SELECT eval.nopersona, eval.idpersonaevaluado
                FROM  mod_evaluaciones.dat_evalpersonaevaluacion eval
                where eval.idperiodoproceso = {$idperiodoproceso} and (eval.idpersonaevaluador IN ($idp) OR eval.idpersonaevaluado IN ($idp))
                ";
        $resultnopersona = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlnopersona);

        if($resultnopersona[0]['nopersona']==0){
            $sqlTotal = "SELECT ROUND((SELECT SUM(ie.valor) from mod_evaluaciones.dat_evalpersonaevaluacion eval
                INNER JOIN mod_evaluaciones.dat_evalindicadoresevaluacion ie ON (ie.idpersonaevaluacion = eval.idpersonaevaluacion)
                WHERE eval.idperiodoproceso = {$idperiodoproceso})/(CASE WHEN COUNT(ev.idpersonaevaluacion)=0 THEN 1 ELSE COUNT(ev.idpersonaevaluacion) END),2) as promindicador,
                COUNT(ev.idpersonaevaluacion) as total,
                SUM(CASE WHEN ev.estado=0 THEN 1 ELSE 0 END) AS porevaluar,
                SUM(CASE WHEN ev.estado=1 OR ev.estado=2 THEN 1 ELSE 0 END) AS evaluado,
                SUM(CASE WHEN ev.estado=3 THEN 1 ELSE 0 END) AS noevaluado,
                SUM(CASE WHEN ev.estado=2 THEN 1 ELSE 0 END) AS reclamacion,
                SUM(CASE WHEN ev.deacuerdo=2 THEN 1 ELSE 0 END) AS desacuerdo,
                'total' AS idestadodesarrollo, 'Total' AS estadodesarrollo,
                round(avg(ev.valor), 2) as promedio
            from mod_evaluaciones.dat_evalpersonaevaluacion ev
            where ev.idperiodoproceso = {$idperiodoproceso}";
            if (count($strIdCargo) > 0) {
                $sqlTotal .= ' AND (ev.idpersonaevaluador IN (' . $idp . ') OR ev.idpersonaevaluado IN (' . $idp . '))';
            }

            $sql = "SELECT ev.idestadodesarrollo,  ROUND((SELECT SUM(ie.valor) from mod_evaluaciones.dat_evalpersonaevaluacion eval
                    INNER JOIN mod_evaluaciones.dat_evalindicadoresevaluacion ie ON (ie.idpersonaevaluacion = eval.idpersonaevaluacion)
                    WHERE eval.idperiodoproceso = {$idperiodoproceso} AND (eval.idestadodesarrollo = ev.idestadodesarrollo OR (eval.idestadodesarrollo IS NULL AND ev.idestadodesarrollo IS NULL)))/(CASE WHEN COUNT(ev.idpersonaevaluacion)=0 THEN 1 ELSE COUNT(ev.idpersonaevaluacion) END),2) as promindicador,
                    COUNT(ev.idpersonaevaluacion) as total,
                    SUM(CASE WHEN ev.estado=0 THEN 1 ELSE 0 END) AS porevaluar,
                    SUM(CASE WHEN ev.estado=1 OR ev.estado=2 THEN 1 ELSE 0 END) AS evaluado,
                    SUM(CASE WHEN ev.estado=3 THEN 1 ELSE 0 END) AS noevaluado,
                    SUM(CASE WHEN ev.estado=2 THEN 1 ELSE 0 END) AS reclamacion,
                    SUM(CASE WHEN ev.deacuerdo=2 THEN 1 ELSE 0 END) AS desacuerdo,
                    nvc.denom as estadodesarrollo,
                    round(avg(valor), 2) as promedio
                from mod_evaluaciones.dat_evalpersonaevaluacion ev
                LEFT JOIN mod_evaluaciones.dat_evalescalavalorescualitativos ed
                    ON (ev.idestadodesarrollo = ed.idescalavalorescualitativos)
                LEFT JOIN mod_evaluaciones.nom_evalvalorescualitativos nvc
                    ON (ed.idvalorescualitativos = nvc.idvalorescualitativos)
                WHERE ev.idperiodoproceso = {$idperiodoproceso}";

            if (count($strIdCargo) > 0) {
                $sql .= ' AND (ev.idpersonaevaluador IN (' . $idp . ') OR ev.idpersonaevaluado IN (' . $idp . '))';
            }
            $sql .= 'GROUP BY ev.idestadodesarrollo, nvc.denom ORDER BY ev.idestadodesarrollo DESC;';
            $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
            $filaTotales = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlTotal);

            //Adiciona al resultado la fila de totales
            $result[] = $filaTotales[0];

            foreach ($result as $key => &$r) {
                if (empty($filaTotales[0]['total'])) {
                    $r['porcientototal'] = 0;
                } else {
                    //Calcula el porciento
                    $r['porcientototal'] = round($r['total'] * 100 / $filaTotales[0]['total'], 2);
                }
            }
            return $result;
        }
        else
        {

            $arraypersonacargo = array();
            foreach($resultnopersona as $r){
                    $id = 0;
                    $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, 0, null,null,$r['idpersonaevaluado']);
                    foreach($persona->data as $p){
                        $arraypersonacargo[$id]['idpersona'] =$p['idpersona'];
                        $id++;
                    }
            $cant = count($arraypersonacargo);
            $idestructura = $r['idpersonaevaluado'];

            $sqlTotal = "SELECT ROUND((SELECT SUM(ie.valor) from mod_evaluaciones.dat_evalpersonaevaluacion eval
                INNER JOIN mod_evaluaciones.dat_evalindicadoresevaluacion ie ON (ie.idpersonaevaluacion = eval.idpersonaevaluacion)
                WHERE eval.idperiodoproceso = {$idperiodoproceso})/(CASE WHEN COUNT(ev.idpersonaevaluacion)=0 THEN $cant ELSE COUNT(ev.idpersonaevaluacion) END),2) as promindicador,
                COUNT(ev.idpersonaevaluacion) as total,
                SUM(CASE WHEN ev.estado=0 THEN $cant ELSE 0 END) AS porevaluar,
                SUM(CASE WHEN ev.estado=1 OR ev.estado=2 THEN $cant ELSE 0 END) AS evaluado,
                SUM(CASE WHEN ev.estado=3 THEN $cant ELSE 0 END) AS noevaluado,
                SUM(CASE WHEN ev.estado=2 THEN $cant ELSE 0 END) AS reclamacion,
                SUM(CASE WHEN ev.deacuerdo=2 THEN $cant ELSE 0 END) AS desacuerdo,
                'total' AS idestadodesarrollo, 'Total' AS estadodesarrollo,
                round(avg(ev.valor), 2) as promedio
            from mod_evaluaciones.dat_evalpersonaevaluacion ev
            where ev.idperiodoproceso = {$idperiodoproceso} AND (ev.idpersonaevaluador ={$idestructura} OR ev.idpersonaevaluado = {$idestructura})";


                $sql = "SELECT ev.idestadodesarrollo,  ROUND((SELECT SUM(ie.valor) from mod_evaluaciones.dat_evalpersonaevaluacion eval
                    INNER JOIN mod_evaluaciones.dat_evalindicadoresevaluacion ie ON (ie.idpersonaevaluacion = eval.idpersonaevaluacion)
                    WHERE eval.idperiodoproceso = {$idperiodoproceso} AND (eval.idestadodesarrollo = ev.idestadodesarrollo OR (eval.idestadodesarrollo IS NULL AND ev.idestadodesarrollo IS NULL)))/(CASE WHEN COUNT(ev.idpersonaevaluacion)=0 THEN $cant ELSE COUNT(ev.idpersonaevaluacion) END),2) as promindicador,
                    COUNT(ev.idpersonaevaluacion) as total,
                    SUM(CASE WHEN ev.estado=0 THEN $cant ELSE 0 END) AS porevaluar,
                    SUM(CASE WHEN ev.estado=1 OR ev.estado=2 THEN $cant ELSE 0 END) AS evaluado,
                    SUM(CASE WHEN ev.estado=3 THEN $cant ELSE 0 END) AS noevaluado,
                    SUM(CASE WHEN ev.estado=2 THEN $cant ELSE 0 END) AS reclamacion,
                    SUM(CASE WHEN ev.deacuerdo=2 THEN $cant ELSE 0 END) AS desacuerdo,
                    nvc.denom as estadodesarrollo,
                    round(avg(valor * $cant), 2) as promedio
                from mod_evaluaciones.dat_evalpersonaevaluacion ev
                LEFT JOIN mod_evaluaciones.dat_evalescalavalorescualitativos ed
                    ON (ev.idestadodesarrollo = ed.idescalavalorescualitativos)
                LEFT JOIN mod_evaluaciones.nom_evalvalorescualitativos nvc
                    ON (ed.idvalorescualitativos = nvc.idvalorescualitativos)
                WHERE ev.idperiodoproceso = {$idperiodoproceso} AND (ev.idpersonaevaluador ={$idestructura} OR ev.idpersonaevaluado = {$idestructura})";

                $sql .= 'GROUP BY ev.idestadodesarrollo, nvc.denom ORDER BY ev.idestadodesarrollo DESC;';
                $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
                $result[0]['total']  = $cant;
                $filaTotales = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlTotal);
                $filaTotales[0]['total'] = $cant;
                $filaTotales[0]['promedio'] =  $filaTotales[0]['promedio'] * $cant ;
                //Adiciona al resultado la fila de totales
                $result[] = $filaTotales[0];

                foreach ($result as $key => &$r) {
                    if (empty($filaTotales[0]['total'])) {
                        $r['porcientototal'] = 0;
                    } else {
                        //Calcula el porciento
                        $r['porcientototal'] = round($r['total'] * 100 / $filaTotales[0]['total'], 2);
                    }
                }


            }
            return $result;
        }

    }

    public function cantPersonasEvaluacion($idperiodo, $strIdCargo = array())
    {       
        $ids = implode(',', $strIdCargo);

            $query = Doctrine_Query::create()
                ->select('count(eval.idpersonaevaluacion) as cantidad, eval.valor as valor, eval.valor as idescala')
                ->from('DatEvalpersonaevaluacion eval')
                ->where('eval.idperiodoproceso = ? AND (eval.estado = 1 OR eval.estado = 2)', $idperiodo)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->groupBy('eval.valor')
                ->orderBy('eval.valor, cantidad');
            if (count($strIdCargo) > 0) {
                $query->andWhere("(eval.idpersonaevaluador IN ($ids) OR eval.idpersonaevaluado IN ($ids))");
            }
            return $query->execute();

    }

    function evalByPerson($idperiodo, $strIdCargo)
    {
        $ids = implode(',', $strIdCargo);

        $sqlnopersona = "SELECT eval.nopersona, eval.idpersonaevaluado
                FROM  mod_evaluaciones.dat_evalpersonaevaluacion eval
                where eval.idperiodoproceso = {$idperiodo} and (eval.idpersonaevaluador IN ($ids) OR eval.idpersonaevaluado IN ($ids))
                ";
        $resultnopersona = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlnopersona);

        if($resultnopersona[0]['nopersona']==0){

        $query = Doctrine_Query::create()
            ->select('eval.valor, eval.idescala as idescala')
            ->from('DatEvalpersonaevaluacion eval')
            ->where('eval.idperiodoproceso = ? AND (eval.estado = 1 OR eval.estado = 2)', $idperiodo)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        if (count($strIdCargo) > 0) {
            $query->andWhere("(eval.idpersonaevaluador IN ($ids) OR eval.idpersonaevaluado IN ($ids))");
        }
        ZendExt_IoC_Inter::getInstance()->persona->addDQLPersona($query, 'eval', 'dp', 'innerjoin', true);
        return $query->execute();
        }
        else{
            $arraypersonacargo = array();

            foreach($resultnopersona as $r){
                $id = 0;
                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, 0, null,null,$r['idpersonaevaluado']);
                foreach($persona->data as $p){
                    $arraypersonacargo[$id]['idpersona'] =$p['idpersona'];
                    $id++;
                }
                $cant = count($arraypersonacargo);
                $idestructura = $r['idpersonaevaluado'];

                $sql = "SELECT ev.valor, ev.idescala as idescala
                        from mod_evaluaciones.dat_evalpersonaevaluacion ev
                WHERE ev.idperiodoproceso = {$idperiodo} AND (ev.idpersonaevaluador ={$idestructura} OR ev.idpersonaevaluado = {$idestructura}) AND (ev.estado = 1 OR ev.estado = 2)";

                $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
               foreach($result as $r){
                   $valor['valor'] = $r['valor'] * $cant;
                   $valor['idescala'] = $r['idescala'];
               }

            }
            return $valor;
        }
    }

/**********************************estructura dominio*******************************************************/

    public function resumenProcesoEvald($idperiodoproceso, $strIdCargo, $idestructuranodo)
    {
       if($idestructuranodo){
           $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($idestructuranodo);
       }
        $p = 1;
        $array[0]['idestructura']=$idestructuranodo;
       foreach($r as $i){
           $array[$p]['idestructura'] = $i->id;
           $p++;
       }

        $strId = '-1';
        foreach ($array as $cargo) {
            if ($cargo['idestructura']) {
                $strId .= ',' . $cargo['idestructura'];
            }
        }

        $sqlnopersona = "SELECT eval.nopersona, eval.idpersonaevaluado
                FROM  mod_evaluaciones.dat_evalpersonaevaluacion eval
                where eval.idperiodoproceso = {$idperiodoproceso} and (eval.idpersonaevaluador IN ($strId) OR eval.idpersonaevaluado IN ($strId))
                ";
        $resultnopersona = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlnopersona);

        if($resultnopersona[0]['nopersona']==0){

        /*$sqlTotal = "SELECT ROUND((SELECT SUM(ie.valor) from mod_evaluaciones.dat_evalpersonaevaluacion eval
                INNER JOIN mod_evaluaciones.dat_evalindicadoresevaluacion ie ON (ie.idpersonaevaluacion = eval.idpersonaevaluacion)
                WHERE eval.idperiodoproceso = {$idperiodoproceso})/(CASE WHEN COUNT(ev.idpersonaevaluacion)=0 THEN 1 ELSE COUNT(ev.idpersonaevaluacion) END),2) as promindicador,
                 COUNT(ev.idpersonaevaluacion) as total,
                SUM(CASE WHEN ev.estado=0 THEN 1 ELSE 0 END) AS porevaluar,
                SUM(CASE WHEN ev.estado=1 OR ev.estado=2 THEN 1 ELSE 0 END) AS evaluado,
                SUM(CASE WHEN ev.estado=3 THEN 1 ELSE 0 END) AS noevaluado,
                SUM(CASE WHEN ev.estado=2 THEN 1 ELSE 0 END) AS reclamacion,
                SUM(CASE WHEN ev.deacuerdo=1 THEN 1 ELSE 0 END) AS desacuerdo,
                'total' AS idestadodesarrollo, 'Total' AS estadodesarrollo,
                round(avg(ev.valor), 2) as promedio
            from mod_evaluaciones.dat_evalpersonaevaluacion ev
            INNER JOIN mod_persona.dat_persona p ON (ev.idpersonaevaluado = p.idpersona)
            INNER JOIN mod_persona.dat_personaentidad e ON (p.idpersona = e.idpersona)
            INNER JOIN mod_persona.dat_situacionlaboral oact ON (e.idpersonaentidad = oact.idpersonaentidad  AND oact.idcargo IN ({$strIdCargo}))
            where ev.idperiodoproceso = {$idperiodoproceso}";

        $sql = "SELECT ev.idestadodesarrollo, ROUND((SELECT SUM(ie.valor) from mod_evaluaciones.dat_evalpersonaevaluacion eval
                INNER JOIN mod_evaluaciones.dat_evalindicadoresevaluacion ie ON (ie.idpersonaevaluacion = eval.idpersonaevaluacion)
                WHERE eval.idperiodoproceso = {$idperiodoproceso} AND (eval.idestadodesarrollo = ev.idestadodesarrollo OR (eval.idestadodesarrollo IS NULL AND ev.idestadodesarrollo IS NULL)))/(CASE WHEN COUNT(ev.idpersonaevaluacion)=0 THEN 1 ELSE COUNT(ev.idpersonaevaluacion) END),2) as promindicador,
                COUNT(ev.idpersonaevaluacion) as total,
                SUM(CASE WHEN ev.estado=0 THEN 1 ELSE 0 END) AS porevaluar,
                SUM(CASE WHEN ev.estado=1 OR ev.estado=2 THEN 1 ELSE 0 END) AS evaluado,
                SUM(CASE WHEN ev.estado=3 THEN 1 ELSE 0 END) AS noevaluado,
                SUM(CASE WHEN ev.estado=2 THEN 1 ELSE 0 END) AS reclamacion,
                SUM(CASE WHEN ev.deacuerdo=2 THEN 1 ELSE 0 END) AS desacuerdo,
                nvc.denom as estadodesarrollo,round(avg(ev.valor), 2) as promedio
                from mod_evaluaciones.dat_evalpersonaevaluacion ev
                INNER JOIN mod_persona.dat_persona p ON (ev.idpersonaevaluado = p.idpersona)
                INNER JOIN mod_persona.dat_personaentidad e ON (p.idpersona = e.idpersona)
                INNER JOIN mod_persona.dat_situacionlaboral oact ON (e.idpersonaentidad = oact.idpersonaentidad  AND oact.idcargo IN ({$strIdCargo}))
                LEFT JOIN mod_evaluaciones.dat_evalescalavalorescualitativos ed ON (ev.idestadodesarrollo = ed.idescalavalorescualitativos)
                LEFT JOIN mod_evaluaciones.nom_evalvalorescualitativos nvc ON (ed.idvalorescualitativos = nvc.idvalorescualitativos)
                where ev.idperiodoproceso = {$idperiodoproceso}
                GROUP BY ev.idestadodesarrollo, nvc.denom
                ORDER BY ev.idestadodesarrollo DESC;";*/

            $sqlTotal = "SELECT ROUND((SELECT SUM(ie.valor) from mod_evaluaciones.dat_evalpersonaevaluacion eval
           INNER JOIN mod_evaluaciones.dat_evalindicadoresevaluacion ie ON (ie.idpersonaevaluacion = eval.idpersonaevaluacion)
           WHERE eval.idperiodoproceso = {$idperiodoproceso})/(CASE WHEN COUNT(ev.idpersonaevaluacion)=0 THEN 1 ELSE COUNT(ev.idpersonaevaluacion) END),2) as promindicador,
         COUNT(ev.idpersonaevaluacion )as total,
          SUM(CASE WHEN ev.estado=0 THEN 1 ELSE 0 END) AS porevaluar,
          SUM(CASE WHEN ev.estado=1 OR ev.estado=2 THEN 1 ELSE 0 END) AS evaluado,
          SUM(CASE WHEN ev.estado=3 THEN 1 ELSE 0 END) AS noevaluado,
          SUM(CASE WHEN ev.estado=2 THEN 1 ELSE 0 END) AS reclamacion,
          SUM(CASE WHEN ev.deacuerdo=2 THEN 1 ELSE 0 END) AS desacuerdo,
          'total' AS idestadodesarrollo, 'Total' AS estadodesarrollo,
          round(avg(ev.valor), 2) as promedio
          from mod_evaluaciones.dat_evalpersonaevaluacion ev
          where ev.idperiodoproceso = {$idperiodoproceso} AND (ev.idpersonaevaluado IN ($strIdCargo))";

            $sql = "SELECT ev.idestadodesarrollo, ROUND((SELECT SUM(ie.valor) from mod_evaluaciones.dat_evalpersonaevaluacion eval
                INNER JOIN mod_evaluaciones.dat_evalindicadoresevaluacion ie ON (ie.idpersonaevaluacion = eval.idpersonaevaluacion)
                WHERE eval.idperiodoproceso = {$idperiodoproceso} AND (eval.idestadodesarrollo = ev.idestadodesarrollo OR (eval.idestadodesarrollo IS NULL AND ev.idestadodesarrollo IS NULL)))/(CASE WHEN COUNT(ev.idpersonaevaluacion)=0 THEN 1 ELSE COUNT(ev.idpersonaevaluacion) END),2) as promindicador,
                COUNT(ev.idpersonaevaluacion) as total,
                SUM(CASE WHEN ev.estado=0 THEN 1 ELSE 0 END) AS porevaluar,
                SUM(CASE WHEN ev.estado=1 OR ev.estado=2 THEN 1 ELSE 0 END) AS evaluado,
                SUM(CASE WHEN ev.estado=3 THEN 1 ELSE 0 END) AS noevaluado,
                SUM(CASE WHEN ev.estado=2 THEN 1 ELSE 0 END) AS reclamacion,
                SUM(CASE WHEN ev.deacuerdo=2 THEN 1 ELSE 0 END) AS desacuerdo,
                nvc.denom as estadodesarrollo,round(avg(ev.valor), 2) as promedio
                from mod_evaluaciones.dat_evalpersonaevaluacion ev
                LEFT JOIN mod_evaluaciones.dat_evalescalavalorescualitativos ed ON (ev.idestadodesarrollo = ed.idescalavalorescualitativos)
                LEFT JOIN mod_evaluaciones.nom_evalvalorescualitativos nvc ON (ed.idvalorescualitativos = nvc.idvalorescualitativos)
                where ev.idperiodoproceso = {$idperiodoproceso} AND (ev.idpersonaevaluado IN ($strIdCargo))
                GROUP BY ev.idestadodesarrollo, nvc.denom
                ORDER BY ev.idestadodesarrollo DESC;";

        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
        $filaTotales = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlTotal);

        //Adiciona al resultado la fila de totales
        $result[] = $filaTotales[0];

        foreach ($result as $key => &$r) {
            //Calcula el porciento
            $r['porcientototal'] = round($r['total'] * 100 / $filaTotales[0]['total'], 2);
        }

        return $result;
        }
        else
        {
            $arraypersonacargo = array();
            foreach($resultnopersona as $r){
                $id = 0;
                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, 0, null,null,$r['idpersonaevaluado'],0);

                foreach($persona->data as $p){
                    $arraypersonacargo[$id]['idpersona'] =$p['idpersona'];
                    $id++;
                }
                $cant = count($arraypersonacargo);
                $idestructura = $r['idpersonaevaluado'];

                $sqlTotal = "SELECT ROUND((SELECT SUM(ie.valor) from mod_evaluaciones.dat_evalpersonaevaluacion eval
                INNER JOIN mod_evaluaciones.dat_evalindicadoresevaluacion ie ON (ie.idpersonaevaluacion = eval.idpersonaevaluacion)
                WHERE eval.idperiodoproceso = {$idperiodoproceso})/(CASE WHEN COUNT(ev.idpersonaevaluacion)=0 THEN 1 ELSE COUNT(ev.idpersonaevaluacion) END),2) as promindicador,
                COUNT(ev.idpersonaevaluacion) as total,
                SUM(CASE WHEN ev.estado=0 THEN $cant ELSE 0 END) AS porevaluar,
                SUM(CASE WHEN ev.estado=1 OR ev.estado=2 THEN $cant ELSE 0 END) AS evaluado,
                SUM(CASE WHEN ev.estado=3 THEN $cant ELSE 0 END) AS noevaluado,
                SUM(CASE WHEN ev.estado=2 THEN $cant ELSE 0 END) AS reclamacion,
                SUM(CASE WHEN ev.deacuerdo=2 THEN $cant ELSE 0 END) AS desacuerdo,
                'total' AS idestadodesarrollo, 'Total' AS estadodesarrollo,
                round(avg(ev.valor), 2) as promedio
            from mod_evaluaciones.dat_evalpersonaevaluacion ev
            where ev.idperiodoproceso = {$idperiodoproceso} AND (ev.idpersonaevaluador ={$idestructura} OR ev.idpersonaevaluado = {$idestructura})";

                $sql = "SELECT ev.idestadodesarrollo,  ROUND((SELECT SUM(ie.valor) from mod_evaluaciones.dat_evalpersonaevaluacion eval
                    INNER JOIN mod_evaluaciones.dat_evalindicadoresevaluacion ie ON (ie.idpersonaevaluacion = eval.idpersonaevaluacion)
                    WHERE eval.idperiodoproceso = {$idperiodoproceso} AND (eval.idestadodesarrollo = ev.idestadodesarrollo OR (eval.idestadodesarrollo IS NULL AND ev.idestadodesarrollo IS NULL)))/(CASE WHEN COUNT(ev.idpersonaevaluacion)=0 THEN $cant ELSE COUNT(ev.idpersonaevaluacion) END),2) as promindicador,
                    COUNT(ev.idpersonaevaluacion) as total,
                    SUM(CASE WHEN ev.estado=0 THEN $cant ELSE 0 END) AS porevaluar,
                    SUM(CASE WHEN ev.estado=1 OR ev.estado=2 THEN $cant ELSE 0 END) AS evaluado,
                    SUM(CASE WHEN ev.estado=3 THEN $cant ELSE 0 END) AS noevaluado,
                    SUM(CASE WHEN ev.estado=2 THEN $cant ELSE 0 END) AS reclamacion,
                    SUM(CASE WHEN ev.deacuerdo=2 THEN $cant ELSE 0 END) AS desacuerdo,
                    nvc.denom as estadodesarrollo,
                    round(avg(valor * $cant), 2) as promedio
                from mod_evaluaciones.dat_evalpersonaevaluacion ev
                LEFT JOIN mod_evaluaciones.dat_evalescalavalorescualitativos ed
                    ON (ev.idestadodesarrollo = ed.idescalavalorescualitativos)
                LEFT JOIN mod_evaluaciones.nom_evalvalorescualitativos nvc
                    ON (ed.idvalorescualitativos = nvc.idvalorescualitativos)
                WHERE ev.idperiodoproceso = {$idperiodoproceso} AND (ev.idpersonaevaluador ={$idestructura} OR ev.idpersonaevaluado = {$idestructura})";

                $sql .= 'GROUP BY ev.idestadodesarrollo, nvc.denom ORDER BY ev.idestadodesarrollo DESC;';
                $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
                $result[0]['total']  = $cant;

                $filaTotales = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlTotal);
                $filaTotales[0]['total'] = $cant;
                $filaTotales[0]['promedio'] =  $filaTotales[0]['promedio'] * $cant ;

                $result[] = $filaTotales[0];

                foreach ($result as $key => &$r) {
                    if (empty($filaTotales[0]['total'])) {
                        $r['porcientototal'] = 0;
                    } else {
                        //Calcula el porciento
                        $r['porcientototal'] = round($r['total'] * 100 / $filaTotales[0]['total'], 2);
                    }
                }

            }
            return $result;
        }
    }

    public function cantPersonasEvaluaciond($idperiodo, $strIdCargo, $idestructuranodo)
    {
        $sql = "SELECT count(eval.idpersonaevaluacion) as cantidad, eval.valor as valor, eval.valor as idescala
            FROM mod_evaluaciones.dat_evalpersonaevaluacion eval           
            INNER JOIN mod_persona.dat_persona p
		    ON eval.idpersonaevaluado = p.idpersona
		    INNER JOIN mod_persona.dat_personaentidad e
            ON (p.idpersona = e.idpersona)
            INNER JOIN mod_persona.dat_situacionlaboral oact
            ON (e.idpersonaentidad = oact.idpersonaentidad  AND oact.idcargo IN ({$strIdCargo}))
            WHERE eval.idperiodoproceso={$idperiodo} AND (eval.estado = 1 OR eval.estado = 2)
            GROUP BY eval.valor
            ORDER BY eval.valor, cantidad;";

        $datos = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

        return $datos;
    }
    public function cantPersonasDispersiond($idperiodoproceso, $strIdCargo,$idestructuranodo,$idpersonaevaluador)
    {
        $sql = "SELECT count(eval.idpersonaevaluacion) as cantidad, eval.valor as valor, eval.valor as idescala
            FROM mod_evaluaciones.dat_evalpersonaevaluacion eval
            INNER JOIN mod_persona.dat_persona p
		    ON eval.idpersonaevaluado = p.idpersona
		    INNER JOIN mod_persona.dat_personaentidad e
            ON (p.idpersona = e.idpersona)
            INNER JOIN mod_persona.dat_situacionlaboral oact
            ON (e.idpersonaentidad = oact.idpersonaentidad  AND oact.idcargo IN ({$strIdCargo}))
            WHERE eval.idperiodoproceso={$idperiodoproceso} AND (eval.estado = 1 OR eval.estado = 2) AND eval.idpersonaevaluador = $idpersonaevaluador
            GROUP BY eval.valor
            ORDER BY eval.valor, cantidad;";

        $datos = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

        return $datos;
    }

    function evalByPersond($idperiodo, $strIdCargo, $idestructuranodo)
    {
        if($idestructuranodo){
            $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($idestructuranodo);
        }
        $p = 1;

        $array[0]['idestructura']=$idestructuranodo;
        foreach($r as $i){
            $array[$p]['idestructura'] = $i->id;
            $p++;
        }
       /* foreach($array as $a){
            $q =  ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($a['idestructura']);
            foreach($q as $s){
                $array[$p]['idestructura'] = $s->id;
                $p++;
            }
        }*/
        $strId = '-1';
        foreach ($array as $cargo) {
            if ($cargo['idestructura']) {
                $strId .= ',' . $cargo['idestructura'];
            }
        }

        $sqlnopersona = "SELECT eval.nopersona, eval.idpersonaevaluado
                FROM  mod_evaluaciones.dat_evalpersonaevaluacion eval
                where eval.idperiodoproceso = {$idperiodo} and (eval.idpersonaevaluador IN ($strId) OR eval.idpersonaevaluado IN ($strId))
                ";
        $resultnopersona = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlnopersona);


        if($resultnopersona[0]['nopersona']==0){

        $sql = "SELECT p.idpersona, p.nombre, p.papel, p.sapel, eval.valor, eval.idescala as idescala,f.foto
                    FROM mod_evaluaciones.dat_evalpersonaevaluacion eval                
                INNER JOIN mod_persona.dat_persona p
                  ON eval.idpersonaevaluado = p.idpersona
                INNER JOIN mod_persona.dat_personaentidad e
            ON (p.idpersona = e.idpersona)
            INNER JOIN mod_persona.dat_situacionlaboral oact
            ON (e.idpersonaentidad = oact.idpersonaentidad AND oact.idcargo IN ({$strIdCargo}))
                LEFT JOIN mod_persona.dat_foto f
                  ON (f.idpersona = p.idpersona AND f.principal = 1)
                WHERE eval.idperiodoproceso={$idperiodo}  AND (eval.estado = 1 OR eval.estado = 2);";
				
        $datos = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

        return $datos;
        }
        else
        {
            $arraypersonacargo = array();

            foreach($resultnopersona as $r){
                $id = 0;
                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, 0, null,null,$r['idpersonaevaluado']);
                foreach($persona->data as $p){
                    $arraypersonacargo[$id]['idpersona'] =$p['idpersona'];
                    $id++;
                }
                $cant = count($arraypersonacargo);
                $idestructura = $r['idpersonaevaluado'];

                $sql = "SELECT ev.valor, ev.idescala as idescala
                        from mod_evaluaciones.dat_evalpersonaevaluacion ev
                WHERE ev.idperiodoproceso = {$idperiodo} AND (ev.idpersonaevaluador ={$idestructura} OR ev.idpersonaevaluado = {$idestructura}) AND (ev.estado = 1 OR ev.estado = 2)";

                $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
                foreach($result as $r){
                    $valor['valor'] = $r['valor'] * $cant;
                    $valor['idescala'] = $r['idescala'];
                }

            }
            return $valor;
        }
    }

    function evalByPersonDispersiond($idperiodo, $strIdCargo,$idestructuranodo,$idpersonaevaluador)
    {
        if($idestructuranodo){
            $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($idestructuranodo);
        }
        $p = 1;

        $array[0]['idestructura']=$idestructuranodo;
        foreach($r as $i){
            $array[$p]['idestructura'] = $i->id;
            $p++;
        }
        $strId = '-1';
        foreach ($array as $cargo) {
            if ($cargo['idestructura']) {
                $strId .= ',' . $cargo['idestructura'];
            }
        }

        $sqlnopersona = "SELECT eval.nopersona, eval.idpersonaevaluado
                FROM  mod_evaluaciones.dat_evalpersonaevaluacion eval
                where eval.idperiodoproceso = {$idperiodo} and (eval.idpersonaevaluador = $idpersonaevaluador)
                ";
        $resultnopersona = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlnopersona);


        if($resultnopersona[0]['nopersona']==0){

            $sql = "SELECT p.idpersona, p.nombre, p.papel, p.sapel, eval.valor, eval.idescala as idescala,encode(f.foto, 'escape') as foto,p.sexo
                    FROM mod_evaluaciones.dat_evalpersonaevaluacion eval
                INNER JOIN mod_persona.dat_persona p
                  ON eval.idpersonaevaluado = p.idpersona
                INNER JOIN mod_persona.dat_personaentidad e
            ON (p.idpersona = e.idpersona)
                LEFT JOIN mod_persona.dat_foto f
                  ON (f.idpersona = p.idpersona AND f.principal = 1)
                WHERE eval.idperiodoproceso={$idperiodo} AND eval.idpersonaevaluador = {$idpersonaevaluador} AND (eval.estado = 1 OR eval.estado = 2);";

            $datos = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

            return $datos;
        }
        else
        {
            $arraypersonacargo = array();

            foreach($resultnopersona as $r){
                $id = 0;
                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, 0, null,null,$r['idpersonaevaluado']);
                foreach($persona->data as $p){
                    $arraypersonacargo[$id]['idpersona'] =$p['idpersona'];
                    $id++;
                }
                $cant = count($arraypersonacargo);
                $idestructura = $r['idpersonaevaluado'];

                $sql = "SELECT ev.valor, ev.idescala as idescala
                        from mod_evaluaciones.dat_evalpersonaevaluacion ev
                WHERE ev.idperiodoproceso = {$idperiodo} AND (ev.idpersonaevaluador ={$idestructura} OR ev.idpersonaevaluado = {$idestructura}) AND (ev.estado = 1 OR ev.estado = 2)";

                $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
                foreach($result as $r){
                    $valor['valor'] = $r['valor'] * $cant;
                    $valor['idescala'] = $r['idescala'];
                }

            }
            return $valor;
        }
    }

//**********************************************************************************************************//

   public function CambiarEstadoDesarrollo($idestadodesarrollo, $idpersonaevaluacion)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sqlValoresCualitativos = "select idescalavalorescualitativos as idvalor
                                from mod_evaluaciones.dat_evalescalavalorescualitativos
                                where idvalorescualitativos ='{$idestadodesarrollo}'";
        $arrValoresCualitativos = $conn->fetchAll($sqlValoresCualitativos);
        $idvalor = $arrValoresCualitativos[0]['idvalor'];

        $PersonaEval = Doctrine::getTable('DatEvalpersonaevaluacion')->find($idpersonaevaluacion);
        $PersonaEval->idestadodesarrollo = $idvalor;
        $DatEvalPerEvaluacion = new DatEvalpersonaevaluacionModel();
        $DatEvalPerEvaluacion->Actualizar($PersonaEval);
    }

    public function CambiarEvaluacion($idpersonaevaluacion, $idcausa, $estado)
    {
        $queryObj = Doctrine_Query::create()
            ->update('DatEvalpersonaevaluacion')
            ->set('idcausanoevaluado', $idcausa)
            ->set('estado', $estado)
            ->set('resultado', 'null')
            ->set('valor', 'null')
            ->set('idescala', 'null')
            ->where('idpersonaevaluacion = ?', $idpersonaevaluacion)
            ->execute();

        $queryObj = Doctrine_Query::create()
            ->delete('DatEvalindicadoresevaluacion')
            ->from('DatEvalindicadoresevaluacion')
            ->where('idpersonaevaluacion = ?', $idpersonaevaluacion)
            ->execute();
    }

    public function obtenerDatosPlanilla($idrecurso)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql = "select epe.idpersonaevaluacion as idpersonaevaluacion, epe.idplanilla as idplanilla, epe.idmodelo as idmodelo
            from mod_evaluaciones.dat_evalpersonaevaluacion epe
            where epe.idpersonaevaluado = '{$idrecurso}'";
        $arr = $conn->fetchAll($sql);

        return $arr;
    }

    public function Reclamar($idpersonaevaluacion)
    {
        $PersonaEval = Doctrine::getTable('DatEvalpersonaevaluacion')->find($idpersonaevaluacion);
        $PersonaEval->hareclamado = 1; // si se realiza la reclamacion

        $DatEvalPerEvaluacion = new DatEvalpersonaevaluacionModel();
        $DatEvalPerEvaluacion->Actualizar($PersonaEval);
    }

    /**
     * Devuelve los evaluados por periodos evaluativos
     *
     * @param mixed $idperiodoproceso
     * @param null $estado 0- No Evaluado, 1- Evaluado, 2- En reclamacion, 3- No evaluado
     * @param null $limit
     * @param null $start
     *
     * @return array|mixed
     */
    public function getEvaluadosByPeriodo($idperiodoproceso, $estado = null, $limit = null, $start = null, $idpersonaevaluador = null, $root = false)
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                'pev.idpersonaevaluacion, pev.idpersonaevaluador, pev.idpersonaevaluado, pev.idpersonaevaluado as idpersona,
                pev.valor as evaluacion, pev.valor as valor, pev.idescala as idescala, pev.nopersona as nopersona,pev.idplanilla,
                pev.estado as estado, cne.denominacion as causanoevaluado'
            )
            ->from('DatEvalpersonaevaluacion pev')
            ->leftJoin('pev.NomCausanoevaluado cne')
            ->where('pev.idperiodoproceso = ?', $idperiodoproceso);

        if ($estado) {
            $queryObj->andWhere('pev.estado = ?', $estado);
        }

        if ($root === true) {
            $c = Doctrine_Query::create()->from('DatEvalpersonascomision p')
                ->leftJoin('p.DatEvalcomisionevaluacion c')
                ->leftJoin('c.DatEvalpreprocesoevaluativo prp')
                ->leftJoin('prp.DatPeriodoproceso pd')
                ->where("pd.idperiodoproceso = $idperiodoproceso AND p.idpersona = $idpersonaevaluador")
                ->count();
            if ($c > 0) {
                $queryObj->andWhere("pev.idpersonaevaluador NOT IN (SELECT pev0.idpersonaevaluado
                FROM DatEvalpersonaevaluacion pev0
                WHERE pev0.idperiodoproceso = $idperiodoproceso)");
            } else {
                $queryObj->andWhere('pev.idpersonaevaluador = ?', $idpersonaevaluador);
            }

        } elseif ($idpersonaevaluador) {
            $queryObj->andWhere('pev.idpersonaevaluador = ?', $idpersonaevaluador);
        }

        if (!empty($limit)) {
            $queryObj->limit($limit);
        }

        if (!empty($start)) {
            $queryObj->offset($start);
        }

        return $queryObj->fetchArray();
    }

    public function getEvaluadosByPeriodoNomina($idperiodoproceso, $estado = null, $limit = null, $start = null, $idpersonaevaluador = null, $root = false)
    {

        $queryObj = Doctrine_Query::create()
            ->select(
                'pev.idpersonaevaluacion, pev.idpersonaevaluador, pev.idpersonaevaluado, pev.idpersonaevaluado as idpersona,
                pev.valor as evaluacion, pev.valor as valor, pev.idescala as idescala, pev.nopersona as nopersona,
                pev.estado as estado, cne.denominacion as causanoevaluado'
            )
            ->from('DatEvalpersonaevaluacion pev')
            ->leftJoin('pev.NomCausanoevaluado cne')
            ->where('pev.idperiodoproceso = ?', $idperiodoproceso);

        if ($estado) {
            $queryObj->andWhere('pev.estado = ?', $estado);
        }

        if ($root === true) {
            $c = Doctrine_Query::create()->from('DatEvalpersonascomision p')
                ->leftJoin('p.DatEvalcomisionevaluacion c')
                ->leftJoin('c.DatEvalpreprocesoevaluativo prp')
                ->leftJoin('prp.DatPeriodoproceso pd')
                ->where("pd.idperiodoproceso = $idperiodoproceso AND p.idpersona = $idpersonaevaluador")
                ->count();
            if ($c > 0) {
                $queryObj->andWhere("pev.idpersonaevaluador NOT IN (SELECT pev0.idpersonaevaluado
                FROM DatEvalpersonaevaluacion pev0
                WHERE pev0.idperiodoproceso = $idperiodoproceso)");
            } else {
                $queryObj->andWhere('pev.idpersonaevaluador = ?', $idpersonaevaluador);
            }

        } else if ($idpersonaevaluador) {
            $queryObj->andWhere('pev.idpersonaevaluador = ?', $idpersonaevaluador);
        }

        if (!empty($limit)) {
            $queryObj->limit($limit);
        }

        if (!empty($start)) {
            $queryObj->offset($start);
        }

        $result = $queryObj->fetchArray();

       for($i = 0;$i<count($result);$i++){
            $s= ResumenprocesoevaluativoModel::sumaIndicadoresEvalTextByPersona($result[$i]['idpersonaevaluacion']);
            $suma[$i]['suma'] = $s['suma'];
        }
        for($i = 0;$i<count($result);$i++){
            $resultfinal[$i]['idpersonaevaluacion'] = $result[$i]['idpersonaevaluacion'];
            $resultfinal[$i]['idpersonaevaluador'] = $result[$i]['idpersonaevaluador'];
            $resultfinal[$i]['idpersonaevaluado'] = $result[$i]['idpersonaevaluado'];
            $resultfinal[$i]['idpersona'] = $result[$i]['idpersona'];
            $resultfinal[$i]['evaluacion'] = $suma[$i]['suma'];
            $resultfinal[$i]['valor'] = $suma[$i]['suma'];
            $resultfinal[$i]['idescala'] = $result[$i]['idescala'];
            $resultfinal[$i]['nopersona'] = $result[$i]['nopersona'];
            $resultfinal[$i]['estado'] = $result[$i]['estado'];
            $resultfinal[$i]['causanoevaluado'] = $result[$i]['causanoevaluado'];
        }

        return $result;//$resultfinal;
    }

    public function getEvaluacionToPrint($idperiodoproceso, $idPersonaEvaluador, $arrIdPersona, $cargos = null)
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                'pev.idpersonaevaluacion,pev.idperiodoproceso as idperiodoproceso, pev.idpersonaevaluado as idpersona, pev.idpersonaevaluador,  pev.deacuerdo,
                nevc.denom AS estadodesarrollo, pev.estado, pev.valor as valor, pev.idescala, pev.hareclamado,
                pev.idpersonaevaluacion, indev.idindicadorevaluacion, indev.valor, indpla.idindicadorplanilla,
                indpla.idpadre, indtext.denom,indev.complementotextual,pev.idmodelo,pev.idcaso,pp.fdesde, pp.denominacion as periodo'
            )
            ->from('DatEvalpersonaevaluacion pev')
            ->leftJoin('pev.DatEvalindicadoresevaluacion indev')
            ->leftJoin('indev.DatEvalindicadoresplanilla indpla')
            ->leftJoin('indpla.NomEvalindicadortexto indtext')
            ->leftJoin('pev.DatPeriodoproceso pp')
            ->where(
                'pev.idperiodoproceso = ? AND (pev.estado=1 OR pev.estado=2)', $idperiodoproceso
            )
            ->orderBy('pev.idpersonaevaluacion, indpla.idpadre, indpla.idindicadorplanilla');

        //Dql para mostrar el estado de desarrollo
        $queryObj = ZendExt_IoC_Inter::getInstance()->evaluaciones->agregarDqlDatosEscala(
            $queryObj, 'pev', 'de', false
        );

        if (is_array($arrIdPersona) && !empty($arrIdPersona)) {
            $queryObj->whereIn('pev.idpersonaevaluado', $arrIdPersona);
        }

        $evaluados = $queryObj->fetchArray();
        $id = 1;
        for($i = 0;$i<count($evaluados);$i++){
            for($j=0;$j<count($evaluados[$i]['DatEvalindicadoresevaluacion']);$j++){
                if($evaluados[$i]['DatEvalindicadoresevaluacion'][$j]['DatEvalindicadoresplanilla']['idindicadorplanilla'] ==$id){
                    unset($evaluados[$i]['DatEvalindicadoresevaluacion'][$j]);
                }else
                {
                    $id =$evaluados[$i]['DatEvalindicadoresevaluacion'][$j]['DatEvalindicadoresplanilla']['idindicadorplanilla'];
                }
            }
            $evaluados[$i]['DatEvalindicadoresevaluacion'] = array_values($evaluados[$i]['DatEvalindicadoresevaluacion']);
        }


        for($i = 0;$i<count($evaluados);$i++){
            $idindicadorevaluacion = '';
            $valorComplementotextual = '';
            $valorMostrar = '';
            $valor = '';

            if (!empty($evaluados[$i]['idpersonaevaluacion'])) {

                for($j=0;$j<count($evaluados[$i]['DatEvalindicadoresevaluacion']);$j++){
                    $valorMostrar = '';
                    $idindicadorplanilla = $evaluados[$i]['DatEvalindicadoresevaluacion'][$j]['DatEvalindicadoresplanilla']['idindicadorplanilla'];

                    $objIndEval = new DatEvalindicadoresevaluacion();
                    $objIndicadorEvaluacion = $objIndEval->getIndicadorEvaluacion(
                        $evaluados[$i]['idpersonaevaluacion'], $idindicadorplanilla
                    );

                    $valor = $objIndicadorEvaluacion[0]['valor'];
                    $idindicadorevaluacion = $objIndicadorEvaluacion[0]['idindicadorevaluacion'];

                    $sqlescala = "SELECT  indeval.idescala as idescalaevaluar
                                FROM mod_evaluaciones.dat_evalindicadoresevaluar indeval
                                WHERE indeval.idindicadorplanilla = $idindicadorplanilla";
                    $escala = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlescala);

                    if (!empty($escala[0]['idescalaevaluar'])) {
                        $idescala = $escala[0]['idescalaevaluar'];
                        $query = Doctrine_Manager::getInstance();
                        $sql = "SELECT e.idescala, e.tipoescala,
                            (CASE
                              WHEN e.tipoescala = 0 THEN vn.idvaloresnumericos
                              WHEN e.tipoescala = 1 THEN vc.idvalorescualitativos
                            END) as idvalor,
                            (CASE
                              WHEN e.tipoescala = 0 THEN vn.denom::varchar
                              WHEN e.tipoescala = 1 THEN vc.denom
                            END) as denom,
                            (CASE
                              WHEN e.tipoescala = 0 THEN vn.denom
                              WHEN e.tipoescala = 1 THEN evc.peso
                            END) as valor,
                             (CASE
                              WHEN e.tipoescala = 0 THEN '#000000'
                              WHEN e.tipoescala = 1 THEN evc.color
                            END) as color
                            FROM mod_evaluaciones.dat_evalescala e
                            --Valores numericos
                            LEFT JOIN mod_evaluaciones.dat_evalescalarangonumerico ern ON (e.idescala = ern.idescala AND e.tipoescala = 0)
                            LEFT JOIN mod_evaluaciones.nom_evalvaloresnumericos vn ON (vn.idescalarangonumerico = ern.idescalarangonumerico)
                            --Valores vualitivos
                            LEFT JOIN mod_evaluaciones.dat_evalescalavalorescualitativos evc ON (e.idescala = evc.idescala AND e.tipoescala = 1)
                            LEFT JOIN mod_evaluaciones.nom_evalvalorescualitativos vc ON (vc.idvalorescualitativos = evc.idvalorescualitativos)
                            WHERE e.idescala = {$idescala};";
                        $valoresEscala = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

                        foreach ($valoresEscala as $valorEscala) {
                            if ($valorEscala['valor'] == $valor) {
                                $valorMostrar = $valorEscala['denom'];
                                break;
                            }
                        }
                    }
                    $escalaNumerica = null;
                    if($escala[0]['idescalaevaluar']) {
                        $query = new Doctrine_Query ();
                        $temp = $query->from('DatEvalescalarangonumerico')
                            ->where("idescala = ?", $idescala)
                            ->execute()
                            ->toArray();
                        $escala = $temp;
                        if(!empty($escala)){
                            $escalaNumerica = $escala[0];
                        }
                    }

                    if($valorMostrar){
                        $evaluados[$i]['DatEvalindicadoresevaluacion'][$j]['valorMostrar'] = $valorMostrar;
                    }else{
                        $evaluados[$i]['DatEvalindicadoresevaluacion'][$j]['valorMostrar'] = $valor;
                    }

                }

            }
        }

        $idevaluadorp = $evaluados[0]['idpersonaevaluador'];
        $sqlevaluador = "SELECT  pev.idpersonaevaluador
            FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
            WHERE pev.idpersonaevaluado = $idevaluadorp and pev.idperiodoproceso = $idperiodoproceso";
        $resultevaluadorp = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlevaluador);

        $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($resultevaluadorp[0]['idpersonaevaluador']);
        $nombrejefearea = $persona->data[0]['nombreapellidos'];

        //Recorre los evaluados para agregar los datos personales y de su persona
        foreach ($evaluados as &$evaluado) {
            $id = $evaluado['idpersona'];
            $sql = "SELECT  pev.valor
            FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
            WHERE pev.idpersonaevaluado = {$id}";
            $resultvalor = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

            $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($evaluado['idpersona']);
            $evaluado['foto'] = $persona->data[0]['foto'];
            $evaluado['numid'] = $persona->data[0]['numid'];
            $evaluado['nombre'] = $persona->data[0]['nombre'];
            $evaluado['nombrecompleto'] = $persona->data[0]['nombre'].' '.$persona->data[0]['snombre'].' '.$persona->data[0]['papel'].' '.$persona->data[0]['sapel'];
            if($resultvalor[count($resultvalor)-1]['valor'] == $resultvalor[count($resultvalor)-2]['valor']){
                $evaluado['conclusioned'] = 'Ratificada';
            }else if ($resultvalor[count($resultvalor)-2]['valor']=='' || $resultvalor[count($resultvalor)-2]['valor']==null){
                $evaluado['conclusioned'] = 'Nueva';
            }else{
                $evaluado['conclusioned'] = 'Modificada';
            }
            $evaluado['firma'] = '';
            $evaluado['jefearea'] = $nombrejefearea;
            $evaluado['snombre'] = $persona->data[0]['snombre'];
            $evaluado['papel'] = $persona->data[0]['papel'];
            $evaluado['sapel'] = $persona->data[0]['sapel'];
            $evaluado['sexo'] = $persona->data[0]['sexo'] == 0 ? 'Fememino' : 'Masculino';

            $sqlevaluadorcargo = "SELECT  ca.idcargo, c.contacto AS correo, sl.idarea,
                                  CASE 
                                    WHEN co.idcategoria = 1 THEN 'Cuadro'
                                    ELSE co.denominacion
                                  END as categoriaocup
            FROM mod_persona.dat_persona p
            INNER JOIN mod_persona.dat_personaentidad pe on(pe.idpersona = p.idpersona)
            INNER JOIN mod_persona.dat_situacionlaboral sl on(sl.idpersonaentidad = pe.idpersonaentidad)
            INNER JOIN mod_estructuracomp.dat_cargo ca on(ca.idcargo = sl.idcargo)
            INNER JOIN mod_estructuracomp.dat_cargocivil cc ON cc.idcargo = ca.idcargo
            INNER JOIN mod_estructuracomp.nom_categocup co ON co.idcategocup = cc.idcategocup
            INNER JOIN mod_estructuracomp.nom_categoria cat ON co.idcategoria = cat.idcategoria
            LEFT JOIN mod_persona.dat_contacto c ON p.idpersona = c.idpersona AND (c.oficial = 1) AND (c.idtipomediocontacto = 2)
            WHERE p.idpersona = $id AND sl.estado = 0 AND (sl.fhasta > now() OR sl.fhasta IS NULL)";
            $resultcargoeval = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlevaluadorcargo);
            $evaluado['correo'] = $resultcargoeval[0]['correo'];
            $evaluado['categoriaocup'] = $resultcargoeval[0]['categoriaocup'];

            if (!empty($resultcargoeval[0]['idcargo'])) {
                $datosCargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($resultcargoeval[0]['idcargo'],false,true);
                $evaluado['cargo'] = $datosCargo[0]['denominacion'];
                $datosEstructura = ZendExt_IoC::getInstance()->metadatos->getRutaEstructura(array($datosCargo[0]['idestructura']));

                $estructura = explode('/', $datosEstructura[0]['rutaDenominacion']);
                $evaluado['idarea'] = $resultcargoeval[0]['idarea'];
                $evaluado['area'] = $estructura[count($estructura)-3] . '/' . $estructura[count($estructura)-2];//$datosEstructura[0]['rutaDenominacion'];

            }

            if (!empty($evaluado['idpersonaevaluador'])) {
                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($evaluado['idpersonaevaluador']);
                $evaluado['evaluador']['numid'] = $persona->data[0]['numid'];
                $evaluado['evaluador']['nombre'] = $persona->data[0]['nombre'];
                $evaluado['evaluador']['snombre'] = $persona->data[0]['snombre'];
                $evaluado['evaluador']['papel'] = $persona->data[0]['papel'];
                $evaluado['evaluador']['sapel'] = $persona->data[0]['sapel'];
                if (!empty($persona->data[0]['idcargo'])) {
                    $datosCargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($persona->data[0]['idcargo'],false,true);
                    $evaluado['evaluador']['cargo'] = $datosCargo[0]['denominacion'];
                }
            }
        }
        return $evaluados;
    }

    public function deleteCaso($idspersonasevaluacion){

        try {
            $sql = "UPDATE 
                      mod_evaluaciones.dat_evalpersonaevaluacion 
                    SET   
                      idcaso = null
                    WHERE 
                      idpersonaevaluacion in (" . implode(',', $idspersonasevaluacion) . ")
                    ;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $r = $conn->fetchAll($sql);
            return true;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    //**********************imprimir en el resumen*********//
    public function getEvaluacionToPrintResumen($idperiodoproceso, $idPersonaEvaluador = null, $arrIdPersona, $idestructura)
    {

        $queryObj = Doctrine_Query::create()
            ->select(
                'pev.idpersonaevaluacion, pev.idpersonaevaluado as idpersona, pev.idpersonaevaluador,  pev.deacuerdo,
                nevc.denom AS estadodesarrollo, pev.estado, pev.valor as valor, pev.idescala, pev.hareclamado,
                pev.idpersonaevaluacion, indev.idindicadorevaluacion, indev.valor, indpla.idindicadorplanilla,
                indpla.idpadre, indtext.denom, pev.idperiodoproceso'
            )
            ->from('DatEvalpersonaevaluacion pev')
            ->leftJoin('pev.DatEvalindicadoresevaluacion indev')
            ->leftJoin('indev.DatEvalindicadoresplanilla indpla')
            ->leftJoin('indpla.NomEvalindicadortexto indtext')
            ->where(
                'pev.idperiodoproceso = ?', $idperiodoproceso
            )
            ->orderBy('pev.idpersonaevaluacion, indpla.idpadre, indpla.idindicadorplanilla');

        //Dql para mostrar el estado de desarrollo
        $queryObj = ZendExt_IoC_Inter::getInstance()->evaluaciones->agregarDqlDatosEscala(
            $queryObj, 'pev', 'de', false
        );

        if (is_array($arrIdPersona) && !empty($arrIdPersona)) {
            $queryObj->whereIn('pev.idpersonaevaluado', $arrIdPersona);
        }

        $evaluados = $queryObj->fetchArray();

        //Recorre los evaluados para agregar los datos personales y de su persona
        foreach ($evaluados as &$evaluado) {
            $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($evaluado['idpersona']);

            $evaluado['foto'] = $persona->data[0]['foto'];
            $evaluado['numid'] = $persona->data[0]['numid'];
            $evaluado['nombre'] = $persona->data[0]['nombre'];
            $evaluado['snombre'] = $persona->data[0]['snombre'];
            $evaluado['papel'] = $persona->data[0]['papel'];
            $evaluado['sapel'] = $persona->data[0]['sapel'];
            $evaluado['sexo'] = $persona->data[0]['sexo'] == 0 ? 'Fememino' : 'Masculino';
            if (!empty($persona->data[0]['idcargo'])) {
                $datosCargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($persona->data[0]['idcargo'],false,true);
                $evaluado['cargo'] = $datosCargo[0]['denominacion'];
                $datosEstructura = ZendExt_IoC::getInstance()->metadatos->getRutaEstructura(array($datosCargo[0]['idestructura']));
                $estructura = explode('/', $datosEstructura[0]['rutaDenominacion']);
                $evaluado['area'] = $estructura[0] . '/' . $estructura[3];//$datosEstructura[0]['rutaDenominacion'];

            }

            if (!empty($evaluado['idpersonaevaluador'])) {
                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($evaluado['idpersonaevaluador']);
                $evaluado['evaluador']['numid'] = $persona->data[0]['numid'];
                $evaluado['evaluador']['nombre'] = $persona->data[0]['nombre'];
                $evaluado['evaluador']['snombre'] = $persona->data[0]['snombre'];
                $evaluado['evaluador']['papel'] = $persona->data[0]['papel'];
                $evaluado['evaluador']['sapel'] = $persona->data[0]['sapel'];
                if (!empty($persona->data[0]['idcargo'])) {
                    $datosCargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($persona->data[0]['idcargo'],false,true);
                    $evaluado['evaluador']['cargo'] = $datosCargo[0]['denominacion'];
                }
            }
        }

        return $evaluados;
    }

    /////////////////////////////////////////////////////////

    public function cambiarEvaluador($idpersona_eval, $idpersona)
    {
        try {
            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $sql = "UPDATE mod_evaluaciones.dat_evalpersonaevaluacion
					SET idpersonaevaluador = {$idpersona_eval}
					WHERE idpersonaevaluado = {$idpersona};";

            return $conn->fetchAll($sql);
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    /**
     * Devuelve todas las evaluaciones que se le han realizado a una persona
     *
     * @param     $idpersona
     * @param int $limit
     * @param int $start
     * @param     $idprocesoevaluativo
     *
     * @return array Listado de evaluaciones
     * @throws Doctrine_Connection_Exception
     */
    public function getEvaluacionesPersona($idpersona, $limit = 25, $start = 0, $idprocesoevaluativo = null)
    {
        $sql = "SELECT prep.idpreprocesoevaluativo, defp.denom as proceso, perp.idperiodoproceso, perp.denominacion, perp.fdesde as fiperiodo, perp.fhasta as ffperiodo,
                pev.idpersonaevaluacion, pev.estado, pev.valor, pev.idmodelo, pev.idplanilla, pev.idpersonaevaluador, nevc.denom AS estadodesarrollo,
                evc.color AS colorestadodesarrollo
            FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
            LEFT JOIN  mod_evaluaciones.dat_evalescalavalorescualitativos evc ON(evc.idescalavalorescualitativos = pev.idestadodesarrollo)
            LEFT JOIN  mod_evaluaciones.nom_evalvalorescualitativos nevc ON(nevc.idvalorescualitativos = evc.idvalorescualitativos)
            INNER JOIN mod_evaluaciones.dat_periodoproceso perp ON(perp.idperiodoproceso = pev.idperiodoproceso)
            INNER JOIN mod_evaluaciones.dat_evalpreprocesoevaluativo prep ON (prep.idpreprocesoevaluativo = perp.idpreprocesoevaluativo)
            INNER JOIN mod_evaluaciones.dat_evaldefprocesoevaluativo defp ON(defp.iddefprocesoevaluativo = prep.iddefprocesoevaluativo)
            WHERE pev.idpersonaevaluado = {$idpersona}";

        if (!empty($idprocesoevaluativo)) {
            $sql .= " AND prep.idpreprocesoevaluativo = {$idprocesoevaluativo}";
        }

        if ($limit) {
            $sql .= " LIMIT {$limit}";
        }
        if ($start) {
            $sql .= " OFFSET {$start}";
        }
        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

        return $result;
    }

    /**
     * Devuelve la cantidad de evaluaciones que se le han realizado a una persona
     *
     * @param     $idpersona
     * @param int $limit
     * @param int $start
     * @param     $idprocesoevaluativo
     *
     * @return array Listado de evaluaciones
     * @throws Doctrine_Connection_Exception
     */
    public function getCantEvaluacionesPersona($idpersona, $idprocesoevaluativo = null)
    {
        $sql = " SELECT COUNT(prep.idpreprocesoevaluativo)
            FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
            LEFT JOIN  mod_evaluaciones.dat_evalescalavalorescualitativos evc ON(evc.idescalavalorescualitativos = pev.idestadodesarrollo)
            LEFT JOIN  mod_evaluaciones.nom_evalvalorescualitativos nevc ON(nevc.idvalorescualitativos = evc.idvalorescualitativos)
            INNER JOIN mod_evaluaciones.dat_periodoproceso perp ON(perp.idperiodoproceso = pev.idperiodoproceso)
            INNER JOIN mod_evaluaciones.dat_evalpreprocesoevaluativo prep ON (prep.idpreprocesoevaluativo = perp.idpreprocesoevaluativo)
            INNER JOIN mod_evaluaciones.dat_evaldefprocesoevaluativo defp ON(defp.iddefprocesoevaluativo = prep.iddefprocesoevaluativo)
            WHERE pev.idpersonaevaluado = {$idpersona}";

        if (!empty($idprocesoevaluativo)) {
            $sql .= " AND prep.idpreprocesoevaluativo = {$idprocesoevaluativo}";
        }

        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchOne($sql);

        return $result;
    }

    public static function getEvaluadorRaiz($idperiodoproceso, $idpersonaevaluador)
    {
        $queryObj = Doctrine_Query::create()
            ->select('pev.idpersonaevaluador')
            ->from('DatEvalpersonaevaluacion pev')
            ->where('pev.idperiodoproceso = ?', $idperiodoproceso)
            ->andWhere("pev.idpersonaevaluador = {$idpersonaevaluador} AND pev.idpersonaevaluado <> {$idpersonaevaluador}")//Cambio idpersona con idpersonaevaluador
            ->groupBy('pev.idpersonaevaluador')
            ->setHydrationMode(Doctrine::HYDRATE_NONE);       

        return $queryObj->execute();
    }

    public function Evaluadorsuperior($idpersonaEvaluado, $idperiodo)
    {
        $sql = " SELECT
				  eval.idpersonaevaluador
				FROM
				  mod_evaluaciones.dat_evalpersonaevaluacion eval
			   WHERE eval.idpersonaevaluado = {$idpersonaEvaluado}";

        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchOne($sql);

        return $result;
    }

    //*****************Datos para adicionar persona a la estrcutura del periodo*******************//

    public function getDatos($idperiodoproceso, $idpersonaEvaluador)
    {
        $sql = "SELECT pev.idestructurapersona, pev.idmodelo as idmodelo, pev.idescala as idescala, pev.idestadodesarrollo as idestadodesarrollo, pev.idestructurapersona, pev.hareclamado, pev.deacuerdo
				FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
                WHERE pev.idperiodoproceso={$idperiodoproceso}";

        if (!empty($idpersonaEvaluador)) {
            $sql .= " AND pev.idpersonaevaluador = {$idpersonaEvaluador}";
        }

        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

        return $result;
    }

    public function getidEstructurapersona()
    {
       $sql = "SELECT  max(pev.idestructurapersona)
				FROM mod_evaluaciones.dat_evalpersonaevaluacion pev";       

        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
		
        return $result;
    }

    public function DameRootEvaluadores($idperiodoproceso)
    {
        $sql = "SELECT  distinct(pev.idpersonaevaluador),pe.denom
				FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
				LEFT JOIN mod_evaluaciones.dat_evalplanillasevaluativas pe ON(pe.idplanilla = pev.idplanilla)
				where pev.idperiodoproceso = $idperiodoproceso";

        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

        return $result;
    }

    public function DameEvaluados($idpersonaevaluador,$idperiodoproceso)
    {
        $sql = "SELECT  pev.idpersonaevaluado,pev.idpersonaevaluador,pev.nopersona,pe.denom
				FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
				LEFT JOIN mod_evaluaciones.dat_evalplanillasevaluativas pe ON(pe.idplanilla = pev.idplanilla)
				where pev.idpersonaevaluador = $idpersonaevaluador and pev.idperiodoproceso = $idperiodoproceso ";

        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

        return $result;
    }
    public function obtenerPlantillaModelo($idperiodoproceso,$idprocesoplanillaf)
    {
        $sql = "SELECT  ppla.idplanilla,ppla.idmodelo
				FROM mod_evaluaciones.dat_periodoproceso p
				INNER JOIN mod_evaluaciones.dat_evalpreprocesoevaluativo prep ON (p.idpreprocesoevaluativo = prep.idpreprocesoevaluativo)
                INNER JOIN mod_evaluaciones.dat_evaldefprocesoevaluativo defp ON(defp.iddefprocesoevaluativo = prep.iddefprocesoevaluativo)
                INNER JOIN mod_evaluaciones.dat_evaldefprocesoplanillas ppla ON(ppla.iddefprocesoevaluativo = ppla.iddefprocesoevaluativo)
				where ppla.idprocesoplanilla = $idprocesoplanillaf and p.idperiodoproceso = $idperiodoproceso ";

        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

        return $result;
    }
    public function modificar($arrIdpersona, $idperiodoproceso,$idplanilla,$idmodelo)
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql = "SELECT m.idmodelo, m.idescala
			FROM mod_evaluaciones.dat_evalmodelo m
            where m.idmodelo = '$idmodelo'";
        $escala = ZendExt_ClassStandard::ArrayObject($conn->fetchAll($sql));
        $idescala = (empty($escala[0]->idescala))?null:$escala[0]->idescala;

        foreach($arrIdpersona as $id){
            $queryObj = Doctrine_Query::create()
                ->update('DatEvalpersonaevaluacion')
                ->set('idplanilla', $idplanilla)
                ->set('idmodelo', $idmodelo)
                ->where('idperiodoproceso = ?', $idperiodoproceso)
                ->andWhere('idpersonaevaluado =?',$id->id);

            if (!empty($escala[0]->idescala)) {
                $queryObj->set('idescala', $idescala);
            }
            $queryObj->execute();
        }
    }
    public function modificartodo($idperiodoproceso,$idplanilla,$idmodelo)
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql = "SELECT m.idmodelo, m.idescala
			FROM mod_evaluaciones.dat_evalmodelo m
            where m.idmodelo = '$idmodelo'";
        $escala = ZendExt_ClassStandard::ArrayObject($conn->fetchAll($sql));
        $idescala = (empty($escala[0]->idescala))?null:$escala[0]->idescala;

            $queryObj = Doctrine_Query::create()
                ->update('DatEvalpersonaevaluacion')
                ->set('idplanilla', $idplanilla)
                ->set('idmodelo', $idmodelo)
                ->where('idperiodoproceso = ?', $idperiodoproceso);

            if (!empty($escala[0]->idescala)) {
                $queryObj->set('idescala', $idescala);
            }
            $queryObj->execute();

    }

    /*********************************Metodo de las recuperaciones por periodos a la persona*********************************************/
    public function gettodosperiodos($idpreprocesoevaluativo, $idplanilla,$idmodelo,$filtro,$limit, $start) {
        try {
            $sql = "SELECT distinct p.idperiodoproceso, p.denominacion, p.fdesde, p.fhasta
                 FROM mod_evaluaciones.dat_periodoproceso p
                 INNER JOIN mod_evaluaciones.dat_evalpersonaevaluacion ev ON(ev.idperiodoproceso = p.idperiodoproceso)
                 WHERE ev.idplanilla = {$idplanilla} AND ev.idmodelo = {$idmodelo} AND p.idpreprocesoevaluativo = {$idpreprocesoevaluativo}";

            if (!empty($filtro)) {
                $sql .= " AND (p.denominacion ILIKE '%$filtro%')";
            }

            if ($limit) {
                $sql .= " LIMIT $limit";
            }
            if ($start) {
                $sql .= " OFFSET $start";
            }

            $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetCantTotal($filtro = '') {//Devuelve la cantidad total que tiene la tabla
        try {

            $query = Doctrine_Query::create()
                ->select('COUNT(p.idperiodoproceso) as cantidad')->from('Dat_periodoproceso p');
            if (!empty($filtro)) {
                $query->addWhere("denominacion ILIKE '%$filtro%' ");
            }

            return $query->fetchOne()->cantidad;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /*****************************************************GRAFICO DE DISPERSION*************************************************************/

    public function getPersona( $arrInd ,$idpersona/*$strIdpersona*/)
    {
        $strId = '-1';
        foreach ($arrInd as $idperiodo) {
            if ($idperiodo) {
                $strId .= ',' . $idperiodo;
            }
        }

        $sql = "SELECT p.idpersona, p.nombre, p.snombre, p.papel, p.sapel,
				(p.nombre ||' '|| p.papel ||' '|| p.sapel) as fullname,
				pev.valor as evaluacion, pev.valor as valor, pev.idescala as idescala
				FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
				left JOIN mod_persona.dat_persona p ON (p.idpersona = pev.idpersonaevaluado)
                WHERE pev.idperiodoproceso IN ($strId) AND pev.idpersonaevaluador = {$idpersona}";

        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

        return $result;
    }

     /*********************************************************SINCRONIZAR ESTRUCTURA*****************************************************************/
            public function sincronizarestructura($idperiodoproceso,$idestructura)
           {
               try {

                   set_time_limit(36000);
                   ini_set('memory_limit', '2048M');
                   $resultanterior = array();
                   $sqlnopersona = "SELECT eval.nopersona
                       FROM  mod_evaluaciones.dat_evalpersonaevaluacion eval
                       where eval.idperiodoproceso = {$idperiodoproceso} ";
                   $resultnopersona = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlnopersona);

                   $sqlp = "SELECT eval.idescala,eval.valor,eval.idpersonaevaluador,eval.idpersonaevaluado,eval.idperiodoproceso,eval.idplanilla,eval.idmodelo,eval.idpersonaevaluacion,eval.idestadodesarrollo,eval.estado
                       FROM  mod_evaluaciones.dat_evalpersonaevaluacion eval
                       where eval.idperiodoproceso = {$idperiodoproceso} ";
                   $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlp);

                   $idplanillafunction = 0;

                   foreach($result as $r){
                       if($r['idplanilla']!=null){
                           $idplanillafunction = $r['idplanilla'];
                       }

                   }

                   $con=0;
                   foreach($result as $r){
                       $resultanterior[$con]['valor'] =  $r['valor'];
                       $resultanterior[$con]['idpersonaevaluado'] =  $r['idpersonaevaluado'];
                       $resultanterior[$con]['idplanilla'] =  $r['idplanilla'];
                       $resultanterior[$con]['idmodelo'] =  $r['idmodelo'];
                       $resultanterior[$con]['idpersonaevaluacion'] =  $r['idpersonaevaluacion'];
                       $resultanterior[$con]['idestadodesarrollo'] =  $r['idestadodesarrollo'];
                       $resultanterior[$con]['idescala'] =  $r['idescala'];
                       $resultanterior[$con]['estado'] =  $r['estado'];
                       $con++;
                   }

                   $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
                   $sql = "DELETE FROM mod_evaluaciones.dat_evalpersonaevaluacion as ev
                             WHERE ev.idperiodoproceso = {$idperiodoproceso} ";
                   $conn->fetchAll($sql);
                   $idtipoestructura = 1;
                   if($resultnopersona[0]['nopersona']==0){
                      $idtipoestructura = 1;
                   }else
                   {
                       $idtipoestructura = 3;
                   }

                   $arrEstPersona = ZendExt_IoC_Inter::getInstance()->maestro->getEstructurascontrolEvaluaciones($idtipoestructura, $idestructura);
                   $functionarray = array();
                   $function = "'{";
                   $count = 0;
                   $contador = 1;
                   $countultimo = count($arrEstPersona);

                   foreach($arrEstPersona as $r){
                       if($count==0){
                           $functionarray[$count] = $function.$r['idcontrolador'];
                       }
                       else if($contador==$countultimo){
                           $functionarray[$count] = $r['idcontrolador']."}'";
                       }
                       else{
                           $functionarray[$count] = $r['idcontrolador'];}
                       $count++;
                       $contador++;                   }
                   if(count($functionarray)==1){
                       $functionarray[0] = $functionarray[0]."}'";
                   }

                   $arrayfunction = implode(',',$functionarray);

                   Doctrine_Manager::connection()->execute("Select mod_evaluaciones.f_personaevaluacion_insert($arrayfunction,$idperiodoproceso,$idtipoestructura)");

                  /* if($resultnopersona[0]['nopersona']==0){
                       $arrEstPersona = ZendExt_IoC_Inter::getInstance()->maestro->getEstructurasControlByDominioyEstructura(1, $idestructura);

                   }
                   else
                   {
                       $arrEstPersona = ZendExt_IoC_Inter::getInstance()->maestro->getEstructurasControlByDominioyEstructura(3, $idestructura);
                   }

                   foreach ($arrEstPersona as $estPersona) {
                       foreach ($estPersona['Controlados'] as $est) {
                           $obj = new DatEvalpersonaevaluacion();
                           $obj->idpersonaevaluador = $estPersona['idpersona'];
                           if($est['idpersona']!= null){
                               $obj->idpersonaevaluado = $est['idpersona'];
                               $obj->nopersona = 0;

                           }
                           else
                           {
                               $obj->idpersonaevaluado = $est['idarea'];
                               $obj->nopersona = 1;
                           }
                           $obj->idperiodoproceso = $idperiodoproceso;
                           $obj->save();

                       }
                   }*/

                   foreach($resultanterior as $re)
                   {
                    $valor = $re['valor'];
                    $estado = $re['estado'];
                    $idestadodesarrollo = $re['idestadodesarrollo'];
                    $idpersonaevaluado = $re['idpersonaevaluado'];
                    $idplanilla = $re['idplanilla'];
                    $idescala = $re['idescala'];
                    $idmodelo = $re['idmodelo'];

                                if($valor!= null ){
                                    $query = Doctrine_Query::create()
                                        ->update('DatEvalpersonaevaluacion')
                                        ->set('valor', '?', $valor)
                                        ->where('idperiodoproceso = ?', $idperiodoproceso)
                                        ->andWhere('idpersonaevaluado = ?', $idpersonaevaluado);
                                    $result = $query->fetchArray();
                                }
                       if($idplanilla!= null && $idmodelo!=null){
                           $query = Doctrine_Query::create()
                               ->update('DatEvalpersonaevaluacion')
                               ->set('idplanilla', '?', $idplanilla)
                               ->set('idmodelo', '?', $idmodelo)
                               ->where('idperiodoproceso = ?', $idperiodoproceso)
                               ->andWhere('idpersonaevaluado = ?', $idpersonaevaluado);
                           $result = $query->fetchArray();
                       }
                       if($estado!=null){
                           $query = Doctrine_Query::create()
                               ->update('DatEvalpersonaevaluacion')
                               ->set('estado', '?', $estado)
                               ->where('idperiodoproceso = ?', $idperiodoproceso)
                               ->andWhere('idpersonaevaluado = ?', $idpersonaevaluado);
                           $result = $query->fetchArray();
                       }
                       if($idestadodesarrollo!=null){
                           $query = Doctrine_Query::create()
                               ->update('DatEvalpersonaevaluacion')
                               ->set('idestadodesarrollo', '?', $idestadodesarrollo)
                               ->where('idperiodoproceso = ?', $idperiodoproceso)
                               ->andWhere('idpersonaevaluado = ?', $idpersonaevaluado);
                           $result = $query->fetchArray();
                       }
                       if($idescala!=null){
                           $query = Doctrine_Query::create()
                               ->update('DatEvalpersonaevaluacion')
                               ->set('idescala', '?', $idescala)
                               ->where('idperiodoproceso = ?', $idperiodoproceso)
                               ->andWhere('idpersonaevaluado = ?', $idpersonaevaluado);
                           $result = $query->fetchArray();
                       }
                   }

                   $arraynuevo = array();
                   $connuevo=0;
                   foreach($resultanterior as $re){
                       $idpersonaevaluado = $re['idpersonaevaluado'];

                       $sqlpenuevo = "SELECT eval.idpersonaevaluacion,eval.idpersonaevaluado
                       FROM  mod_evaluaciones.dat_evalpersonaevaluacion eval
                       where eval.idperiodoproceso = {$idperiodoproceso} and eval.idpersonaevaluado = {$idpersonaevaluado}";
                       $resultnuevo = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlpenuevo);

                           $arraynuevo[$connuevo]['idpersonaevaluacion'] =  $resultnuevo[0]['idpersonaevaluacion'];
                           $arraynuevo[$connuevo]['idpersonaevaluado'] =  $resultnuevo[0]['idpersonaevaluado'];
                           $connuevo++;
                   }

                   $arrayfinal = array();
                   $contr=0;
                   foreach($resultanterior as $res){
                       foreach($arraynuevo as $re)
                       {
                           if($res['idpersonaevaluado']==$re['idpersonaevaluado']){
                               $arrayfinal[$contr]['idpersonaevaluado'] = $re['idpersonaevaluado'];
                               $arrayfinal[$contr]['idpersonaevaluacionvieja'] = $res['idpersonaevaluacion'];
                               $arrayfinal[$contr]['idpersonaevaluacionnueva'] = $re['idpersonaevaluacion'];
                           }
                       }
                       $contr++;
                   }
                   $arraypersonaevaluacionviejo = array();
                   $arraypersonaevaluacionnuevo = array();
                   $function = "'{";
                   $contadorr = 1;
                   $countultimo = count($arrayfinal);
                   $contador = 0;

                   foreach($arrayfinal as $a){
                       if($contador==0){
                           $arraypersonaevaluacionviejo[$contador]=$function.$a['idpersonaevaluacionvieja'];
                           $arraypersonaevaluacionnuevo[$contador]=$function.$a['idpersonaevaluacionnueva'];
                       }
                       else if($contadorr==$countultimo){
                           $arraypersonaevaluacionviejo[$contador]=$a['idpersonaevaluacionvieja']."}'";
                           $arraypersonaevaluacionnuevo[$contador]=$a['idpersonaevaluacionnueva']."}'";
                       }
                       else{
                           $arraypersonaevaluacionviejo[$contador]=$a['idpersonaevaluacionvieja'];
                           $arraypersonaevaluacionnuevo[$contador]=$a['idpersonaevaluacionnueva'];
                       }

                       $contador++;
                       $contadorr++;
                   }

                   $arrayviejo = implode(',',$arraypersonaevaluacionviejo);
                   $arraynuevo = implode(',',$arraypersonaevaluacionnuevo);

                   Doctrine_Manager::connection()->execute("SELECT mod_evaluaciones.f_indicadoresevaluacion_update($arrayviejo,$arraynuevo,$idplanillafunction)");

                  /* foreach($arrayfinal as $r)
                   {
                       $idpersonaevaluacionvieja = $r['idpersonaevaluacionvieja'];
                       $idpersonaevaluacionnueva = $r['idpersonaevaluacionnueva'];

                         $query = Doctrine_Query::create()
                                           ->update('DatEvalindicadoresevaluacion')
                                           ->set('idpersonaevaluacion', '?', $idpersonaevaluacionnueva)
                                           ->where('idpersonaevaluacion = ?', $idpersonaevaluacionvieja);
                                       $result = $query->fetchArray();


                   }*/
        return true;


        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }
    /*public function sincronizarestructura($idperiodoproceso,$idestructura)
    {
        try {
            set_time_limit(36000);
            ini_set('memory_limit', '2048M');
            $resultanterior = array();
            $sqlnopersona = "SELECT eval.nopersona
                FROM  mod_evaluaciones.dat_evalpersonaevaluacion eval
                where eval.idperiodoproceso = {$idperiodoproceso} ";
            $resultnopersona = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlnopersona);

            $sqlp = "SELECT eval.valor,eval.idpersonaevaluador,eval.idpersonaevaluado,eval.idperiodoproceso,eval.idplanilla,eval.idmodelo
                FROM  mod_evaluaciones.dat_evalpersonaevaluacion eval
                where eval.idperiodoproceso = {$idperiodoproceso} ";
            $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlp);

            $con=0;
            foreach($result as $r){
                $resultanterior[$con]['valor'] =  $r['valor'];
                $resultanterior[$con]['idpersonaevaluado'] =  $r['idpersonaevaluado'];
                $resultanterior[$con]['idplanilla'] =  $r['idplanilla'];
                $resultanterior[$con]['idmodelo'] =  $r['idmodelo'];
                $con++;
            }

            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $sql = "DELETE FROM mod_evaluaciones.dat_evalpersonaevaluacion as ev
                      WHERE ev.idperiodoproceso = {$idperiodoproceso} ";
            $conn->fetchAll($sql);


            if($resultnopersona[0]['nopersona']==0){
                $arrEstPersona = ZendExt_IoC_Inter::getInstance()->maestro->getEstructurasControlByDominioyEstructura(1, $idestructura);

            }
            else
            {
                $arrEstPersona = ZendExt_IoC_Inter::getInstance()->maestro->getEstructurasControlByDominioyEstructura(3, $idestructura);
            }

            foreach ($arrEstPersona as $estPersona) {
                foreach ($estPersona['Controlados'] as $est) {
                    $obj = new DatEvalpersonaevaluacion();
                    $obj->idpersonaevaluador = $estPersona['idpersona'];
                    if($est['idpersona']!= null){
                        $obj->idpersonaevaluado = $est['idpersona'];
                        $obj->nopersona = 0;

                    }
                    else
                    {
                        $obj->idpersonaevaluado = $est['idarea'];
                        $obj->nopersona = 1;
                    }
                    $obj->idperiodoproceso = $idperiodoproceso;
                    $obj->save();

                }
            }

            foreach($resultanterior as $re)
            {
             $valor = $re['valor'];
             $idpersonaevaluado = $re['idpersonaevaluado'];
             $idplanilla = $re['idplanilla'];
             $idmodelo = $re['idmodelo'];

                         if($valor!= null ){
                             $query = Doctrine_Query::create()
                                 ->update('DatEvalpersonaevaluacion')
                                 ->set('valor', '?', $valor)
                                 ->where('idperiodoproceso = ?', $idperiodoproceso)
                                 ->andWhere('idpersonaevaluado = ?', $idpersonaevaluado);
                             $result = $query->fetchArray();
                         }
                if($idplanilla!= null && $idmodelo!=null ){
                    $query = Doctrine_Query::create()
                        ->update('DatEvalpersonaevaluacion')
                        ->set('idplanilla', '?', $idplanilla)
                        ->set('idmodelo', '?', $idmodelo)
                        ->where('idperiodoproceso = ?', $idperiodoproceso)
                        ->andWhere('idpersonaevaluado = ?', $idpersonaevaluado);
                    $result = $query->fetchArray();
                }

            }

            return true;


        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }*/
    public function ObtenerTodosPersona($idperiodoproceso)
    {
        $sql = "SELECT p.idpersona, p.nombre, p.snombre, p.papel, p.sapel,
				(p.nombre ||' '|| p.papel ||' '|| p.sapel) as fullname,
				pev.valor as evaluacion, pev.valor as valor, pev.idescala as idescala
				FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
				left JOIN mod_persona.dat_persona p ON (p.idpersona = pev.idpersonaevaluador)
                WHERE pev.idperiodoproceso = {$idperiodoproceso}";

        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

        return $result;
    }
    public function ObtenerTodosPersonasEvaluador($idpersona,$idperiodoproceso)
    {

        $sql = "SELECT p.idpersona, p.nombre, p.snombre, p.papel, p.sapel,
				(p.nombre ||' '|| p.papel ||' '|| p.sapel) as fullname,
				pev.valor as evaluacion, pev.valor as valor, pev.idescala as idescala,pev.idperiodoproceso,pev.idpersonaevaluacion, pev.idpersonaevaluador as _parent, true as _is_leaf
				FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
				left JOIN mod_persona.dat_persona p ON (p.idpersona = pev.idpersonaevaluado)
                WHERE pev.idperiodoproceso = {$idperiodoproceso} AND pev.idpersonaevaluador = {$idpersona}";

        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

        return $result;
    }

    /*public function updValorfinal($idpersonaevaluacion,$idpersona,$valor)
    {
        if($idpersonaevaluacion){

            if($valor!=null || $valor!=''){
                $q = Doctrine_Query::create()
                    ->update('DatEvalpersonaevaluacion')
                    ->set('valor', '?', $valor)
                    ->set('estado', '?', 1)
                    ->where('idpersonaevaluacion=?', $idpersonaevaluacion)
                    ->andWhere('idpersonaevaluado=?', $idpersona);
                $result = $q->execute();
                return true;
            }
            else
            {
                return false;
            }

        }


    }*/
    public function updValorfinal($persona,$valor)
    {
        $bandera =true;
        if(count($persona)>0){
              foreach($persona as $r){
                  if($valor!=null || $valor!=''){
                      $q = Doctrine_Query::create()
                          ->update('DatEvalpersonaevaluacion')
                          ->set('valor', '?', $valor)
                          ->set('estado', '?', 1)
                          ->where('idpersonaevaluacion=?', $r->idpersonaevaluacion)
                          ->andWhere('idpersonaevaluado=?', $r->idpersona);
                      $result = $q->execute();

                  }
                  else
                  {
                      $bandera =false;
                  }
              }


        }
        if($bandera){
            return true;
        }else{
            return false;
        }


    }
    public function updOpinionEval($opinion,$idpersonaevaluacion)
    {
        $bandera =true;

                if($opinion!=null && $idpersonaevaluacion!=null ){
                    $q = Doctrine_Query::create()
                        ->update('DatEvalpersonaevaluacion')
                        ->set('deacuerdo', '?', $opinion)
                        ->where('idpersonaevaluacion=?', $idpersonaevaluacion)
                       ;
                    $result = $q->execute();

                }
                else
                {
                    $bandera =false;
                }

        if($bandera){
            return true;
        }else{
            return false;
        }


    }

    public function ImportarEvaluaciones($array_datos){
        unset($array_datos[1]);

        if(!empty($array_datos)){
            $periodo = $array_datos[2]['C'];

            $sql = "SELECT p.idperiodoproceso
				 FROM mod_evaluaciones.dat_periodoproceso AS p
				 WHERE p.denominacion LIKE '$periodo'";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $result = $conn->fetchAll($sql);
            $idperiodoproceso = $result[0]['idperiodoproceso'];

            foreach($array_datos as $r){
                $numero = $r['A'];
                $valor = $r['B'];

                $sql = "SELECT p.idpersona
				 FROM mod_persona.dat_persona AS p
				 INNER JOIN mod_persona.dat_docidentidad AS doc ON (p.idpersona = doc.idpersona)
				 WHERE doc.numero ILIKE '%$numero%'";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $result = $conn->fetchAll($sql);

                if(count($result)>0){
                    if(!empty($result[0]['idpersona'])){
                        $idpersona = $result[0]['idpersona'];
                    }
              }
                $q = Doctrine_Query::create()
                    ->update('DatEvalpersonaevaluacion')
                    ->set('valor', '?', $valor)
                    ->set('estado', '?', 1)
                    ->where('idpersonaevaluado=?', $idpersona)
                    ->andWhere('idperiodoproceso=?', $idperiodoproceso);
                $result = $q->execute();

            }
        }

        return true;
    }
	
	/******************Funcion para pintar encabezado de un excel exportando*************************/

    public function fnPintarEncabezado(&$objPHPExcel,$result)
    {
        $fecha = Date('d/m/Y');
        $arrayfecha = explode('/',$fecha);

        //CODIGO DE PHP EXEL
        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('CERTIFICADO DE LAS ED MENSUALES');
        $count = 1;

        $objPHPExcel->getActiveSheet()->mergeCells('C4:F4');
        $objPHPExcel->getActiveSheet()->setCellValue('C' . '4', 'Certificación de las Evaluaciones del Desempeño Mensual');
        $objPHPExcel->getActiveSheet()->getStyle('C' . '4')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('C' . '4')->getFill()->getStartColor()->setRGB('DCDCDC');
        $this->fnAlinearTexto($objPHPExcel, 'C' . '4', 'center', 'center', 0);
        $this->fnFuenteTexto($objPHPExcel, 'C' . '4', 'Arial', 12, true);
        $this->fnPintarBordes($objPHPExcel, 'C' . '4', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . '4', 'left', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . '4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . '4', 'top', PHPExcel_Style_Border::BORDER_THIN);

        $this->fnPintarBordes($objPHPExcel, 'D' . '4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'D' . '4', 'top', PHPExcel_Style_Border::BORDER_THIN);

        $this->fnPintarBordes($objPHPExcel, 'E' . '4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E' . '4', 'top', PHPExcel_Style_Border::BORDER_THIN);

        $this->fnPintarBordes($objPHPExcel, 'F' . '4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'F' . '4', 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'F' . '4', 'right', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->setCellValue('C' . '5', 'Fecha de Certificación');
        $objPHPExcel->getActiveSheet()->getStyle('C' . '5')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $this->fnFuenteTexto($objPHPExcel, 'C' . '5', 'Arial', 12, true);
        $this->fnPintarBordes($objPHPExcel, 'C' . '5', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . '5', 'left', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . '5', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . '5', 'top', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->setCellValue('D' . '5', 'D:'.'  '.$arrayfecha[0]);
        $objPHPExcel->getActiveSheet()->getStyle('D' . '5')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $this->fnFuenteTexto($objPHPExcel, 'D' . '5', 'Arial', 12, true);
        $this->fnPintarBordes($objPHPExcel, 'D' . '5', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'D' . '5', 'left', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'D' . '5', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'D' . '5', 'top', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->setCellValue('E' . '5', 'M:'.'  '.$arrayfecha[1]);
        $objPHPExcel->getActiveSheet()->getStyle('E' . '5')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $this->fnFuenteTexto($objPHPExcel, 'E' . '5', 'Arial', 12, true);
        $this->fnPintarBordes($objPHPExcel, 'E' . '5', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E' . '5', 'left', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E' . '5', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E' . '5', 'top', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->setCellValue('F' . '5', 'A:'.'  '.$arrayfecha[2]);
        $objPHPExcel->getActiveSheet()->getStyle('F' . '5')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $this->fnFuenteTexto($objPHPExcel, 'F' . '5', 'Arial', 12, true);
        $this->fnPintarBordes($objPHPExcel, 'F' . '5', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'F' . '5', 'left', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'F' . '5', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'F' . '5', 'top', PHPExcel_Style_Border::BORDER_THIN);

        $area = explode('/',$result[0]['area']);

        $objPHPExcel->getActiveSheet()->setCellValue('C' . '6', 'Area:');
        $objPHPExcel->getActiveSheet()->getStyle('C' . '6')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);

        $this->fnFuenteTexto($objPHPExcel, 'C' . '6', 'Arial', 12, true);
        $this->fnPintarBordes($objPHPExcel, 'C' . '6', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . '6', 'left', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . '6', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . '6', 'top', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->mergeCells('D6:F6');
        $objPHPExcel->getActiveSheet()->setCellValue('D' . '6', $area[1]);
        $objPHPExcel->getActiveSheet()->getStyle('D' . '6')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);

        $this->fnPintarBordes($objPHPExcel, 'F' . '6', 'right', PHPExcel_Style_Border::BORDER_THIN);

        //Cambiandole la dimensión a las filas
        $objPHPExcel->getActiveSheet()->getRowDimension(4)->setRowHeight(35);
        //Cambiandole la dimensión a las columnas
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(40);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(25);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(25);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(25);

        /*****************************Cuerpo de las columnas************************/
        $objPHPExcel->getActiveSheet()->setCellValue('C' . '7', 'Nombre y apellido del trabajador');
        $objPHPExcel->getActiveSheet()->getStyle('C' . '7')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $this->fnFuenteTexto($objPHPExcel, 'C' . '7', 'Arial', 12, true);
        $this->fnPintarBordes($objPHPExcel, 'C' . '7', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . '7', 'left', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . '7', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . '7', 'top', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->setCellValue('D' . '7', 'ED');
        $this->fnAlinearTexto($objPHPExcel, 'C' . '4', 'center', 'center', 0);
        $objPHPExcel->getActiveSheet()->getStyle('D' . '7')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $this->fnFuenteTexto($objPHPExcel, 'D' . '7', 'Arial', 12, true);
        $this->fnPintarBordes($objPHPExcel, 'D' . '7', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'D' . '7', 'left', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'D' . '7', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'D' . '7', 'top', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->setCellValue('E' . '7', 'Conclusión de la ED');
        $objPHPExcel->getActiveSheet()->getStyle('E' . '7')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $this->fnFuenteTexto($objPHPExcel, 'E' . '7', 'Arial', 12, true);
        $this->fnPintarBordes($objPHPExcel, 'E' . '7', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E' . '7', 'left', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E' . '7', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E' . '7', 'top', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->setCellValue('F' . '7', 'Firma del trabajador');
        $objPHPExcel->getActiveSheet()->getStyle('F' . '7')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $this->fnFuenteTexto($objPHPExcel, 'F' . '7', 'Arial', 12, true);
        $this->fnPintarBordes($objPHPExcel, 'F' . '7', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'F' . '7', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'F' . '7', 'top', PHPExcel_Style_Border::BORDER_THIN);


    }

    /*********************Funcion para pintar el cuerpo del excel***************************/

    public function fnPintarCuerpo(&$objPHPExcel, $result, $modo)
    {
        $campo = ['nombrecompleto','valor','conclusioned','firma'];

        $count = 1;
        foreach ($campo as $c)
        {
            $numerocelda = 8;
            $letra = chr($count + 66);
            foreach ($result as $r)
            {

               // if($r['DatEvalindicadoresevaluacion'][0]['DatEvalindicadoresplanilla']['NomEvalindicadortexto']['denom']=='Conclusiones'){
                if($c=='valor'){
                    //$objPHPExcel->getActiveSheet()->setCellValue($letra . $numerocelda,$r['DatEvalindicadoresevaluacion'][0][$c].'-'.$r[$c]);
                    $objPHPExcel->getActiveSheet()->setCellValue($letra . $numerocelda, $r[$c].'-'.$r['valorMostrar']);
                }else{
                    $objPHPExcel->getActiveSheet()->setCellValue($letra . $numerocelda, $r[$c]);
                }

                $this->fnAlinearTexto($objPHPExcel, $letra . $numerocelda, 'center', 'center', 0);
                $this->fnFuenteTexto($objPHPExcel, $letra . $numerocelda, 'Arial', 12);
                $this->fnPintarBordes($objPHPExcel, $letra . $numerocelda, 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letra . $numerocelda, 'left', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letra . $numerocelda, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letra . $numerocelda, 'top', PHPExcel_Style_Border::BORDER_THIN);
                $numerocelda++;
            }
            $count++;
        }
        $numerofila = 8+count($result);

        $objPHPExcel->getActiveSheet()->setCellValue('C' . $numerofila, 'Certificado por:');
        $objPHPExcel->getActiveSheet()->getStyle('C' . $numerofila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('C' . $numerofila)->getFill()->getStartColor()->setRGB('DCDCDC');
        $this->fnAlinearTexto($objPHPExcel, 'C' .$numerofila , 'center', 'center', 0);
        $this->fnFuenteTexto($objPHPExcel, 'C' . $numerofila, 'Arial', 12, true);
        $this->fnPintarBordes($objPHPExcel, 'C' . $numerofila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . $numerofila, 'left', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . $numerofila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . $numerofila, 'top', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->mergeCells('D'.$numerofila.':F'.$numerofila);

        if($modo==1){
            $objPHPExcel->getActiveSheet()->setCellValue('D' . $numerofila, 'Aprobado por:');
            $objPHPExcel->getActiveSheet()->getStyle('D' . $numerofila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle('D' . $numerofila)->getFill()->getStartColor()->setRGB('DCDCDC');
            $this->fnAlinearTexto($objPHPExcel, 'D' .$numerofila , 'center', 'center', 0);
            $this->fnFuenteTexto($objPHPExcel, 'D' . $numerofila, 'Arial', 12, true);
            $this->fnPintarBordes($objPHPExcel, 'D' . $numerofila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'D' . $numerofila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'D' . $numerofila, 'top', PHPExcel_Style_Border::BORDER_THIN);


            $this->fnPintarBordes($objPHPExcel, 'E' . $numerofila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'E' . $numerofila, 'top', PHPExcel_Style_Border::BORDER_THIN);

            $this->fnPintarBordes($objPHPExcel, 'F' . $numerofila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'F' . $numerofila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'F' . $numerofila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        }



        $numerofila = $numerofila+1;

        $objPHPExcel->getActiveSheet()->setCellValue('C' . $numerofila, 'Evaluador');
        $objPHPExcel->getActiveSheet()->getStyle('C' . $numerofila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('C' . $numerofila)->getFill()->getStartColor()->setRGB('DCDCDC');
        $this->fnAlinearTexto($objPHPExcel, 'C' .$numerofila , 'center', 'center', 0);
        $this->fnFuenteTexto($objPHPExcel, 'C' . $numerofila, 'Arial', 12, true);
        $this->fnPintarBordes($objPHPExcel, 'C' . $numerofila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . $numerofila, 'left', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . $numerofila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . $numerofila, 'top', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->mergeCells('D'.$numerofila.':F'.$numerofila);
        if($modo==1){
            $objPHPExcel->getActiveSheet()->setCellValue('D' . $numerofila, 'Director del Area');
            $objPHPExcel->getActiveSheet()->getStyle('D' . $numerofila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle('D' . $numerofila)->getFill()->getStartColor()->setRGB('DCDCDC');
            $this->fnAlinearTexto($objPHPExcel, 'D' .$numerofila , 'center', 'center', 0);
            $this->fnFuenteTexto($objPHPExcel, 'D' . $numerofila, 'Arial', 12, true);
            $this->fnPintarBordes($objPHPExcel, 'D' . $numerofila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'D' . $numerofila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'D' . $numerofila, 'top', PHPExcel_Style_Border::BORDER_THIN);


            $this->fnPintarBordes($objPHPExcel, 'E' . $numerofila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'E' . $numerofila, 'top', PHPExcel_Style_Border::BORDER_THIN);

            $this->fnPintarBordes($objPHPExcel, 'F' . $numerofila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'F' . $numerofila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'F' . $numerofila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        }

        $numerofila = $numerofila+1;

        $objPHPExcel->getActiveSheet()->setCellValue('C' . $numerofila, $result[0]['evaluador']['nombre'].' '.$result[0]['evaluador']['papel'].' '.$result[0]['evaluador']['sapel']);

        $this->fnPintarBordes($objPHPExcel, 'C' . $numerofila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . $numerofila, 'left', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . $numerofila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . $numerofila, 'top', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->mergeCells('D'.$numerofila.':F'.$numerofila);
        if($modo==1){
            $objPHPExcel->getActiveSheet()->setCellValue('D' . $numerofila, $result[0]['jefearea']);
            $this->fnPintarBordes($objPHPExcel, 'D' . $numerofila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'D' . $numerofila, 'top', PHPExcel_Style_Border::BORDER_THIN);

            $this->fnPintarBordes($objPHPExcel, 'E' . $numerofila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'E' . $numerofila, 'top', PHPExcel_Style_Border::BORDER_THIN);

            $this->fnPintarBordes($objPHPExcel, 'F' . $numerofila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'F' . $numerofila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'F' . $numerofila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        }
        $numerofila = $numerofila+1;

        $objPHPExcel->getActiveSheet()->setCellValue('C' . $numerofila,'Firma');

        $this->fnPintarBordes($objPHPExcel, 'C' . $numerofila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . $numerofila, 'left', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . $numerofila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . $numerofila, 'top', PHPExcel_Style_Border::BORDER_THIN);

        if($modo==1){
            $objPHPExcel->getActiveSheet()->mergeCells('D'.$numerofila.':F'.$numerofila);
            $objPHPExcel->getActiveSheet()->setCellValue('D' . $numerofila,'Firma');
            $this->fnPintarBordes($objPHPExcel, 'D' . $numerofila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'D' . $numerofila, 'top', PHPExcel_Style_Border::BORDER_THIN);

            $this->fnPintarBordes($objPHPExcel, 'E' . $numerofila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'E' . $numerofila, 'top', PHPExcel_Style_Border::BORDER_THIN);

            $this->fnPintarBordes($objPHPExcel, 'F' . $numerofila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'F' . $numerofila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'F' . $numerofila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        }
    }

    /** Funcionalidad para alinear los textos de las celdas
     */
    public function fnAlinearTexto(&$objPHPExcel, $celda, $hor, $ver, $rot)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getAlignment()->applyFromArray(
            array(
                'horizontal' => $hor,
                'vertical' => $ver,
                'rotation' => $rot, //0 ó 90
                'wrap' => TRUE
            )
        );
    }

    /** Funcionalidad para dar la fuente a los textos
     */
    public function fnFuenteTexto(&$objPHPExcel, $celda, $name, $size, $bold = false)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFont()->applyFromArray(
            array(
                'name' => $name,
                'bold' => $bold,
                'italic' => FALSE,
                'strike' => FALSE,
                'size' => $size,
                'color' => array(
                    'rgb' => '000000'
                )
            )
        );
    }

    /** Funcionalidad para el formato numérico
     */
    public function fnFormatoNumeros(&$objPHPExcel, $celda)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getNumberFormat()->applyFromArray(
            array(
                'code' => PHPExcel_Style_NumberFormat::FORMAT_NUMBER_00
            )
        );
    }

    /** Funcionalidad para crear los bordes de las celdas
     */
    public function fnPintarBordes(&$objPHPExcel, $celda, $lado, $tipoborde)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getBorders()->applyFromArray(
            array(
                $lado => array(
                    'style' => $tipoborde,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
    }

    /*****************************Servicio para nomina************************************/

    public function getPlanillasByPeriodo()
    {
        $sql = "SELECT p.idplanilla,p.denom as planilla
				 FROM mod_evaluaciones.dat_evalplanillasevaluativas AS p
				";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);

        for($i = 0;$i<count($result);$i++){
            $idplanilla = $result[$i]['idplanilla'];

            $sql = "SELECT i.idindicadortexto,i.denom as indicador,p.idpadre
				 FROM mod_evaluaciones.dat_evalindicadoresplanilla AS p
				 inner join mod_evaluaciones.nom_evalindicadortexto i on (i.idindicadortexto = p.idindicador)
				where p.idplanilla = $idplanilla";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $resultindicadores = $conn->fetchAll($sql);

            $contador = 0;
            for($j = 0;$j<count($resultindicadores);$j++){
                $idpadre = $resultindicadores[$j]['idpadre'];

                $sql = "SELECT p.idindicador
				 FROM mod_evaluaciones.dat_evalindicadoresplanilla AS p
				 where p.idindicadorplanilla = $idpadre";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $resultpadre = $conn->fetchAll($sql);

                $idindicador = $resultpadre[0]['idindicador'];

                $sql = "SELECT i.denom
				 FROM mod_evaluaciones.nom_evalindicadortexto AS i
				 where i.idindicadortexto = $idindicador";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $resultdenompadre = $conn->fetchAll($sql);

                $result[$i]['indicadores'][$contador]['idindicador'] = $resultindicadores[$j]['idindicadortexto'];
                $result[$i]['indicadores'][$contador]['indicador']= $resultindicadores[$j]['indicador'];

                if($result[$i]['indicadores'][$contador]['indicador']!=$resultdenompadre[0]['denom']){
                    $result[$i]['indicadores'][$contador]['denompadre']= $resultdenompadre[0]['denom'];
                }
                $contador++;
            }
        }

        return $result;
    }


    /*public function getEvaluacionAnual($params,$idevaluador)
    {
        foreach($params as $k=>$r){
           $idevaluado = $r->idpersona;

            $sql = "SELECT pev.valor,p.denominacion,p.idperiodoproceso
				 FROM mod_evaluaciones.dat_evalpersonaevaluacion AS pev
				 inner join mod_evaluaciones.dat_periodoproceso as p on (p.idperiodoproceso = pev.idperiodoproceso)
				 where pev.idpersonaevaluador = $idevaluador AND pev.idpersonaevaluado = $idevaluado";

            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $result = $conn->fetchAll($sql);

            foreach($result as $f=>$l){
                $params[$k]->evaluaciones[$f]['valor'] = $l['valor'];
                $params[$k]->evaluaciones[$f]['periodo'] = $l['denominacion'];
                $params[$k]->evaluaciones[$f]['idperiodoproceso'] = $l['idperiodoproceso'];
            }
        }

        return $params;
    }*/
      public function getEvaluacionAnual($params){

          $idpersonaevaluacion = $params[0]->idpersonaevaluacion;
            $queryObj = Doctrine_Query::create()
            ->select(
            'pev.idpersonaevaluacion,pev.idperiodoproceso as idperiodoproceso, pev.idpersonaevaluado as idpersona, pev.idpersonaevaluador,  pev.deacuerdo,
            nevc.denom AS estadodesarrollo, pev.estado, pev.valor as valor, pev.idescala, pev.hareclamado,
            pev.idpersonaevaluacion, indev.idindicadorevaluacion, indev.valor, indpla.idindicadorplanilla,
            indpla.idpadre, indtext.denom,indev.complementotextual,pev.idmodelo'
            )
            ->from('DatEvalpersonaevaluacion pev')
            ->leftJoin('pev.DatEvalindicadoresevaluacion indev')
            ->leftJoin('indev.DatEvalindicadoresplanilla indpla')
            ->leftJoin('indpla.NomEvalindicadortexto indtext')
            ->where(
            'pev.idpersonaevaluacion = ? AND (pev.estado=1 OR pev.estado=2)', $idpersonaevaluacion
            )
            ->orderBy('pev.idpersonaevaluacion, indpla.idpadre, indpla.idindicadorplanilla');

                //Dql para mostrar el estado de desarrollo
            $queryObj = ZendExt_IoC_Inter::getInstance()->evaluaciones->agregarDqlDatosEscala(
            $queryObj, 'pev', 'de', false
            );

            $evaluados = $queryObj->fetchArray();
            $id = 1;
            for($i = 0;$i<count($evaluados);$i++){
                for($j=0;$j<count($evaluados[$i]['DatEvalindicadoresevaluacion']);$j++){
                    if($evaluados[$i]['DatEvalindicadoresevaluacion'][$j]['DatEvalindicadoresplanilla']['idindicadorplanilla'] ==$id){
                        unset($evaluados[$i]['DatEvalindicadoresevaluacion'][$j]);
                    }else
                    {
                        $id =$evaluados[$i]['DatEvalindicadoresevaluacion'][$j]['DatEvalindicadoresplanilla']['idindicadorplanilla'];
                    }
                }
                $evaluados[$i]['DatEvalindicadoresevaluacion'] = array_values($evaluados[$i]['DatEvalindicadoresevaluacion']);
            }


            for($i = 0;$i<count($evaluados);$i++){
                $idindicadorevaluacion = '';
                $valorComplementotextual = '';
                $valorMostrar = '';
                $valor = '';

                if (!empty($evaluados[$i]['idpersonaevaluacion'])) {

                    for($j=0;$j<count($evaluados[$i]['DatEvalindicadoresevaluacion']);$j++){
                        $valorMostrar = '';
                        $idindicadorplanilla = $evaluados[$i]['DatEvalindicadoresevaluacion'][$j]['DatEvalindicadoresplanilla']['idindicadorplanilla'];

                        $objIndEval = new DatEvalindicadoresevaluacion();
                        $objIndicadorEvaluacion = $objIndEval->getIndicadorEvaluacion(
                            $evaluados[$i]['idpersonaevaluacion'], $idindicadorplanilla
                        );

                        $valor = $objIndicadorEvaluacion[0]['valor'];
                        $idindicadorevaluacion = $objIndicadorEvaluacion[0]['idindicadorevaluacion'];

                        $sqlescala = "SELECT  indeval.idescala as idescalaevaluar
                                            FROM mod_evaluaciones.dat_evalindicadoresevaluar indeval
                                            WHERE indeval.idindicadorplanilla = $idindicadorplanilla";
                        $escala = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlescala);

                        if (!empty($escala[0]['idescalaevaluar'])) {
                            $idescala = $escala[0]['idescalaevaluar'];
                            $query = Doctrine_Manager::getInstance();
                            $sql = "SELECT e.idescala, e.tipoescala,
                                        (CASE
                                          WHEN e.tipoescala = 0 THEN vn.idvaloresnumericos
                                          WHEN e.tipoescala = 1 THEN vc.idvalorescualitativos
                                        END) as idvalor,
                                        (CASE
                                          WHEN e.tipoescala = 0 THEN vn.denom::varchar
                                          WHEN e.tipoescala = 1 THEN vc.denom
                                        END) as denom,
                                        (CASE
                                          WHEN e.tipoescala = 0 THEN vn.denom
                                          WHEN e.tipoescala = 1 THEN evc.peso
                                        END) as valor,
                                         (CASE
                                          WHEN e.tipoescala = 0 THEN '#000000'
                                          WHEN e.tipoescala = 1 THEN evc.color
                                        END) as color
                                        FROM mod_evaluaciones.dat_evalescala e
                                        --Valores numericos
                                        LEFT JOIN mod_evaluaciones.dat_evalescalarangonumerico ern ON (e.idescala = ern.idescala AND e.tipoescala = 0)
                                        LEFT JOIN mod_evaluaciones.nom_evalvaloresnumericos vn ON (vn.idescalarangonumerico = ern.idescalarangonumerico)
                                        --Valores vualitivos
                                        LEFT JOIN mod_evaluaciones.dat_evalescalavalorescualitativos evc ON (e.idescala = evc.idescala AND e.tipoescala = 1)
                                        LEFT JOIN mod_evaluaciones.nom_evalvalorescualitativos vc ON (vc.idvalorescualitativos = evc.idvalorescualitativos)
                                        WHERE e.idescala = {$idescala};";
                            $valoresEscala = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

                            foreach ($valoresEscala as $valorEscala) {
                                if ($valorEscala['valor'] == $valor) {
                                    $valorMostrar = $valorEscala['denom'];
                                    break;
                                }
                            }
                        }
                        $escalaNumerica = null;
                        if($escala[0]['idescalaevaluar']) {
                            $query = new Doctrine_Query ();
                            $temp = $query->from('DatEvalescalarangonumerico')
                                ->where("idescala = ?", $idescala)
                                ->execute()
                                ->toArray();
                            $escala = $temp;
                            if(!empty($escala)){
                                $escalaNumerica = $escala[0];
                            }
                        }

                        if($valorMostrar){
                            $evaluados[$i]['DatEvalindicadoresevaluacion'][$j]['valorMostrar'] = $valorMostrar;
                        }else{
                            $evaluados[$i]['DatEvalindicadoresevaluacion'][$j]['valorMostrar'] = $valor;
                        }

                    }

                }
            }

            //Recorre los evaluados para agregar los datos personales y de su persona
            foreach ($evaluados as &$evaluado) {
                $id = $evaluado['idpersona'];
                $sql = "SELECT  pev.valor
                        FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
                        WHERE pev.idpersonaevaluado = {$id}";
                $resultvalor = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($evaluado['idpersona']);

                $evaluado['numid'] = $persona->data[0]['numid'];
                $evaluado['nombre'] = $persona->data[0]['nombre'];
                $evaluado['nombrecompleto'] = $persona->data[0]['nombre'].' '.$persona->data[0]['snombre'].' '.$persona->data[0]['papel'].' '.$persona->data[0]['sapel'];
                if($resultvalor[count($resultvalor)-1]['valor'] == $resultvalor[count($resultvalor)-2]['valor']){
                    $evaluado['conclusioned'] = 'Ratificada';
                }else if ($resultvalor[count($resultvalor)-2]['valor']=='' || $resultvalor[count($resultvalor)-2]['valor']==null){
                    $evaluado['conclusioned'] = 'Nueva';
                }else{
                    $evaluado['conclusioned'] = 'Modificada';
                }
                $evaluado['firma'] = '';
                $evaluado['snombre'] = $persona->data[0]['snombre'];
                $evaluado['papel'] = $persona->data[0]['papel'];
                $evaluado['sapel'] = $persona->data[0]['sapel'];
                $evaluado['sexo'] = $persona->data[0]['sexo'] == 0 ? 'Fememino' : 'Masculino';

                $sqlevaluadorcargo = "SELECT  ca.idcargo
                        FROM mod_persona.dat_persona p
                        INNER JOIN mod_persona.dat_personaentidad pe on(pe.idpersona = p.idpersona)
                        INNER JOIN mod_persona.dat_situacionlaboral sl on(sl.idpersonaentidad = pe.idpersonaentidad)
                        INNER JOIN mod_estructuracomp.dat_cargo ca on(ca.idcargo = sl.idcargo)
                        WHERE p.idpersona = $id AND sl.estado = 0 AND (sl.fhasta > now() OR sl.fhasta IS NULL)";
                $resultcargoeval = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlevaluadorcargo);

                if (!empty($resultcargoeval[0]['idcargo'])) {
                    $datosCargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($resultcargoeval[0]['idcargo'],false,true);
                    $evaluado['cargo'] = $datosCargo[0]['denominacion'];
                    $datosEstructura = ZendExt_IoC::getInstance()->metadatos->getRutaEstructura(array($datosCargo[0]['idestructura']));

                    $estructura = explode('/', $datosEstructura[0]['rutaDenominacion']);

                    $evaluado['area'] = $estructura[count($estructura)-3] . '/' . $estructura[count($estructura)-2];//$datosEstructura[0]['rutaDenominacion'];

                }

                if (!empty($evaluado['idpersonaevaluador'])) {
                    $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($evaluado['idpersonaevaluador']);
                    $evaluado['evaluador']['numid'] = $persona->data[0]['numid'];
                    $evaluado['evaluador']['nombre'] = $persona->data[0]['nombre'];
                    $evaluado['evaluador']['snombre'] = $persona->data[0]['snombre'];
                    $evaluado['evaluador']['papel'] = $persona->data[0]['papel'];
                    $evaluado['evaluador']['sapel'] = $persona->data[0]['sapel'];
                    if (!empty($persona->data[0]['idcargo'])) {
                        $datosCargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($persona->data[0]['idcargo'],false,true);
                        $evaluado['evaluador']['cargo'] = $datosCargo[0]['denominacion'];
                    }
                }
            }

            return $evaluados;
         }

    public function getEvaluacionCert($idperiodoproceso, $idPersonaEvaluador, $arrIdPersona, $cargos = null)
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                'pev.idpersonaevaluacion,pev.idperiodoproceso as idperiodoproceso, pev.idpersonaevaluado as idpersona, pev.idpersonaevaluador,  pev.deacuerdo,
                nevc.denom AS estadodesarrollo, pev.estado, pev.valor as valor, pev.idescala, pev.hareclamado,
                pev.idpersonaevaluacion, indev.idindicadorevaluacion, indev.valor, indpla.idindicadorplanilla,
                indpla.idpadre, indtext.denom,indev.complementotextual,pev.idmodelo'
            )
            ->from('DatEvalpersonaevaluacion pev')
            ->leftJoin('pev.DatEvalindicadoresevaluacion indev')
            ->leftJoin('indev.DatEvalindicadoresplanilla indpla')
            ->leftJoin('indpla.NomEvalindicadortexto indtext')
            ->where(
                'pev.idperiodoproceso = ? AND (pev.estado=1 OR pev.estado=2)', $idperiodoproceso
            )
            ->orderBy('pev.idpersonaevaluacion, indpla.idpadre, indpla.idindicadorplanilla');

        //Dql para mostrar el estado de desarrollo
        $queryObj = ZendExt_IoC_Inter::getInstance()->evaluaciones->agregarDqlDatosEscala(
            $queryObj, 'pev', 'de', false
        );

        if (is_array($arrIdPersona) && !empty($arrIdPersona)) {
            $queryObj->whereIn('pev.idpersonaevaluado', $arrIdPersona);
        }

        $evaluados = $queryObj->fetchArray();
        $id = 1;
        for($i = 0;$i<count($evaluados);$i++){
            for($j=0;$j<count($evaluados[$i]['DatEvalindicadoresevaluacion']);$j++){
                if($evaluados[$i]['DatEvalindicadoresevaluacion'][$j]['DatEvalindicadoresplanilla']['idindicadorplanilla'] ==$id){
                    unset($evaluados[$i]['DatEvalindicadoresevaluacion'][$j]);
                }else
                {
                    $id =$evaluados[$i]['DatEvalindicadoresevaluacion'][$j]['DatEvalindicadoresplanilla']['idindicadorplanilla'];
                }
            }
            $evaluados[$i]['DatEvalindicadoresevaluacion'] = array_values($evaluados[$i]['DatEvalindicadoresevaluacion']);
        }


        for($i = 0;$i<count($evaluados);$i++){
            $idindicadorevaluacion = '';
            $valorComplementotextual = '';
            $valorMostrar = '';
            $valor = '';

            if (!empty($evaluados[$i]['idpersonaevaluacion'])) {

                for($j=0;$j<count($evaluados[$i]['DatEvalindicadoresevaluacion']);$j++){
                    $valorMostrar = '';
                    $idindicadorplanilla = $evaluados[$i]['DatEvalindicadoresevaluacion'][$j]['DatEvalindicadoresplanilla']['idindicadorplanilla'];

                    $objIndEval = new DatEvalindicadoresevaluacion();
                    $objIndicadorEvaluacion = $objIndEval->getIndicadorEvaluacion(
                        $evaluados[$i]['idpersonaevaluacion'], $idindicadorplanilla
                    );

                    $valor = $objIndicadorEvaluacion[0]['valor'];
                    $idindicadorevaluacion = $objIndicadorEvaluacion[0]['idindicadorevaluacion'];

                    $sqlescala = "SELECT  indeval.idescala as idescalaevaluar
                                FROM mod_evaluaciones.dat_evalindicadoresevaluar indeval
                                WHERE indeval.idindicadorplanilla = $idindicadorplanilla";
                    $escala = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlescala);

                    if (!empty($escala[0]['idescalaevaluar'])) {
                        $idescala = $escala[0]['idescalaevaluar'];
                        $query = Doctrine_Manager::getInstance();
                        $sql = "SELECT e.idescala, e.tipoescala,
                            (CASE
                              WHEN e.tipoescala = 0 THEN vn.idvaloresnumericos
                              WHEN e.tipoescala = 1 THEN vc.idvalorescualitativos
                            END) as idvalor,
                            (CASE
                              WHEN e.tipoescala = 0 THEN vn.denom::varchar
                              WHEN e.tipoescala = 1 THEN vc.denom
                            END) as denom,
                            (CASE
                              WHEN e.tipoescala = 0 THEN vn.denom
                              WHEN e.tipoescala = 1 THEN evc.peso
                            END) as valor,
                             (CASE
                              WHEN e.tipoescala = 0 THEN '#000000'
                              WHEN e.tipoescala = 1 THEN evc.color
                            END) as color
                            FROM mod_evaluaciones.dat_evalescala e
                            --Valores numericos
                            LEFT JOIN mod_evaluaciones.dat_evalescalarangonumerico ern ON (e.idescala = ern.idescala AND e.tipoescala = 0)
                            LEFT JOIN mod_evaluaciones.nom_evalvaloresnumericos vn ON (vn.idescalarangonumerico = ern.idescalarangonumerico)
                            --Valores vualitivos
                            LEFT JOIN mod_evaluaciones.dat_evalescalavalorescualitativos evc ON (e.idescala = evc.idescala AND e.tipoescala = 1)
                            LEFT JOIN mod_evaluaciones.nom_evalvalorescualitativos vc ON (vc.idvalorescualitativos = evc.idvalorescualitativos)
                            WHERE e.idescala = {$idescala};";
                        $valoresEscala = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

                        foreach ($valoresEscala as $valorEscala) {
                            if ($valorEscala['valor'] == $valor) {
                                $valorMostrar = $valorEscala['denom'];
                                break;
                            }
                        }
                    }
                    $escalaNumerica = null;
                    if($escala[0]['idescalaevaluar']) {
                        $query = new Doctrine_Query ();
                        $temp = $query->from('DatEvalescalarangonumerico')
                            ->where("idescala = ?", $idescala)
                            ->execute()
                            ->toArray();
                        $escala = $temp;
                        if(!empty($escala)){
                            $escalaNumerica = $escala[0];
                        }
                    }

                    if($valorMostrar){
                        $evaluados[$i]['DatEvalindicadoresevaluacion'][$j]['valorMostrar'] = $valorMostrar;
                    }else{
                        $evaluados[$i]['DatEvalindicadoresevaluacion'][$j]['valorMostrar'] = $valor;
                    }

                }

            }
        }

        return $evaluados;
    }

}
