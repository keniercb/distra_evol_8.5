<?php

class NomRegimentrabajo extends BaseNomRegimentrabajo
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent :: setUp();
        $this->hasMany('NomGrupodescanso', array('local' => 'idregimentrabajo', 'foreign' => 'idregimentrabajo'));
    }

    /**
     * Devuelve un objeto de la clase
     *
     * @params $fhasta
     * @return Doctrine_Record
     */
    public function getById($idregimentrabajo)
    {
        return Doctrine::getTable('NomRegimentrabajo')->find($idregimentrabajo);
    }


    public static function getTipoRegimenTrabajoActive($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('idregimentrabajo,denominacion, fdesde, fhasta, descripcion,horastrabajo,tipofondotiempo,fondotiempo')
                ->from('NomRegimentrabajo');
            if ($limit) {
                $query->limit($limit)
                    ->offset($start);
            }
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%' or descripcion ilike '%$filtro%'");
            }
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public static function getRegimenTrabajoActive($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('idregimentrabajo,denominacion, fdesde, fhasta, descripcion,horastrabajo,tipofondotiempo,fondotiempo')
                ->from('NomRegimentrabajo')
                ->where('fdesde <= current_date and (current_date <= fhasta or fhasta is null)');
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%' or descripcion ilike '%$filtro%'");
            }
            if ($limit) {
                $query->limit($limit)
                    ->offset($start);
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public static function getRegimenTrabajoByEntidadActive($filtro = null, $limit = null, $start = 0,$identidades)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('x.idregimentrabajo,x.denominacion, x.fdesde, x.fhasta, x.descripcion,x.horastrabajo,x.tipofondotiempo,x.fondotiempo,x.diaslaborables')
                ->from('NomRegimentrabajo x')
                ->leftJoin('x.NomGrupodescanso y')
                ->where('x.fdesde <= current_date and (current_date <= x.fhasta or x.fhasta is null)');
            if ($filtro != null) {
                $query->andWhere("x.denominacion ilike '%$filtro%' or x.descripcion ilike '%$filtro%'");
            }
            if ($identidades != null) {
                $query->andWhere("y.idestructura in (" . implode(',', $identidades) . ")  or y.idestructura is null");
            }
            if ($limit) {
                $query->limit($limit)
                    ->offset($start);
            }    
            //print_r($query->getSqlQuery());die;
            return $query->fetchArray();// ->andWhere("y.idestructura in (" . implode(',', $identidades) . ")  or y.idestructura is null");
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param null $filtro
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantTipoRegimenTrabajoActive($filtro = null,$identidades)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('NomRegimentrabajo x')
                ->leftJoin('x.NomGrupodescanso y')
                ->where('x.fdesde <= now() and (now() <= x.fhasta or x.fhasta is null)');
            if ($identidades != null) {
                $query->andWhere("y.idestructura in (" . implode(',', $identidades) . ")  or y.idestructura is null");
            }
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%'");
            }
            return $query->count();//->andWhere("y.idestructura in (" . implode(',', $identidades) . ")  or y.idestructura is null");
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idregimentrabajo
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     */
    public function modTipoRegimenTrabajo($idregimentrabajo, $denominacion, $descripcion, $horastrabajo, $fdesde, $fhasta,
                                          $tipofondotiempo, $fondotiempo)
    {
        try {
            $query = Doctrine_Query::create()
                ->update('NomRegimentrabajo')
                ->where('idregimentrabajo= ? ', $idregimentrabajo);
            if ($denominacion != '') {
                $query->set('denominacion', '?', $denominacion);
            }
            if ($descripcion != '') {
                $query->set('descripcion', '?', $descripcion);
            } else {
                $query->set('descripcion', 'null');
            }
            if ($horastrabajo != '') {
                $query->set('horastrabajo', '?', $horastrabajo);
            }
            if ($fdesde != '') {
                $query->set('fdesde', '?', $fdesde);
            }
            if ($fhasta != '') {
                $query->set('fhasta', '?', $fhasta);
            } else {
                $query->set('fhasta', 'null');
            }
            if ($tipofondotiempo != '') {
                $query->set('tipofondotiempo', '?', $tipofondotiempo);
            }
            if ($fondotiempo != '') {
                $query->set('fondotiempo', '?', $fondotiempo);
            } else {
                $query->set('fondotiempo', 0);
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

    /**
     * @param $denom
     * @param null $idregimentrabajo
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function findByIdOrDenom($denom, $idregimentrabajo = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomRegimentrabajo')
                ->Where("denominacion = '$denom'");
            if (!empty($idregimentrabajo)) {
                $query->andWhere("idregimentrabajo <> ?", $idregimentrabajo);
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

    /**
     * Funcion para obteners los tipos de categorias dado un array de identificadores
     *
     * @param array $ids
     * @param bool $in True para buscar solo por el array de ids y false para buscar todos los que no esten en el array
     * @param null $limit
     * @param int $start
     * @throws Doctrine_Exception
     * @return array
     */
    public function getTipoRegimenTrabajoActivaByParams(array $ids, $in = true, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('idregimentrabajo,idregimentrabajo as idnomenclador, denominacion, fdesde, fhasta, descripcion')
                ->from('NomRegimentrabajo')
                ->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
            if ($limit) {
                $query->limit($limit)
                    ->offset($start);
            }
            if (count($ids) > 0) {
                if ($in) {
                    $query->andWhereIn('idregimentrabajo', $ids);
                } else {
                    $query->andWhereNotIn('idregimentrabajo', $ids);
                }
                return $query->execute()->toArray();
            }
            return array();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para obtener la cantidad de tipos de categorias dado un array de identificadores
     *
     * @param array $ids
     * @param bool $in True para buscar solo por el array de ids y false para buscar todos los que no esten en el array
     * @throws Doctrine_Exception
     * @return int
     */
    public function getCantTipoRegimenTrabajoActivaByParams(array $ids, $in = true)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('NomRegimentrabajo')
                ->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
            if (count($ids) > 0) {
                if ($in) {
                    $query->andWhereIn('idregimentrabajo', $ids);
                } else {
                    $query->andWhereNotIn('idregimentrabajo', $ids);
                }
                return $query->count();
            }
            return 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getDenomRegimenById($idregimentrabajo)
    {
        $query = Doctrine_Query::create()
            ->select('g.denominacion, g.tipofondotiempo, g.fondotiempo,g.diaslaborables')
            ->from('NomRegimentrabajo g')
            ->where("g.idregimentrabajo = ?", array($idregimentrabajo));
        return $query->fetchArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('NomRegimentrabajo')->execute();
        return $result->toArray();
    }

    public function Getpersonas($cargos, $filtro, $start = 0, $limit = 15)
    {
        $query = new Doctrine_Query ();
        ZendExt_IoC_Inter::getInstance()->persona->addDQLPersona($query, 'pers', 'per', 'InnerJoin', true, true);
        ZendExt_IoC_Inter::getInstance()->persona->addDQLOcupacion($query, 'per', array('dpentd', 'dslab',
            'nsitu'), 'leftjoin', true, true);
        ZendExt_IoC_Inter::getInstance()->persona->addDQLRegimenTrabajo($query, 'pers', 'drt', 'leftJoin', true);
        $result = $query->select('pers.*,drt.idregimentrabajo as regimen,dpentd.*,dslab.*,drt.*,ddi.numero')
            ->from('DatPersona pers')
            ->leftJoin('pers.DatDocidentidad ddi')
            ->leftJoin('pers.DatRegimentrabajo drt')
            ->innerJoin('pers.DatPersonaentidad dpentd')
            ->leftJoin('dpentd.DatSituacionlaboral dslab')
            ->where('dslab.idcargo in (' . implode(',', $cargos) . ')')
            ->limit($limit)
            ->offset($start);
        if (!empty($filtro)) {
            $result->addWhere("ddi.numero ilike '%$filtro%' or pers.nombre ilike '%$filtro%' or pers.snombre ilike
              '%$filtro%' or pers.papel ilike '%$filtro%' or pers.sapel ilike '%$filtro%'");
        }
        return $result->execute()->toArray();
    }

    public function GetCantpersonas($cargos)
    {
        $query = new Doctrine_Query ();
        ZendExt_IoC_Inter::getInstance()->persona->addDQLPersona($query, 'pers', 'per', 'InnerJoin', true, true);
        ZendExt_IoC_Inter::getInstance()->persona->addDQLOcupacion($query, 'per', array('dpentd', 'dslab', 'nsitu'), 'leftjoin', true, true);
        ZendExt_IoC_Inter::getInstance()->persona->addDQLRegimenTrabajo($query, 'pers', 'drt', 'leftJoin', true);

        $result = $query->select('pers.*,drt.idregimentrabajo as regimen,dpentd.*,dslab.*,drt.*,ddi.numero')
            ->from('DatPersona pers')
            ->leftJoin('pers.DatDocidentidad ddi')
            ->leftJoin('pers.DatRegimentrabajo drt')
            ->innerJoin('pers.DatPersonaentidad dpentd')
            ->leftJoin('dpentd.DatSituacionlaboral dslab')
            ->where('dslab.idcargo in (' . implode(',', $cargos) . ')');
        return $result->count();
    }

    public function updRegimenByTipoFondoTiempo($fondotiempo)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "UPDATE mod_regimentrabajo.nom_regimentrabajo
               SET fondotiempo= " . $fondotiempo . "
               WHERE tipofondotiempo = 2;";
        return $conn->fetchAll($sql);
    }

    public function getCantPersonaByRegimen()
    {
        $sql = "SELECT sum(tabla.cantidadpersonas) as cantidad,
                          (select denominacion FROM mod_regimentrabajo.nom_regimentrabajo WHERE idregimentrabajo=tabla.asignacion) as regimen
                    FROM (SELECT CASE WHEN (nad.idregimentrabajo = dad.idregimentrabajo) THEN count(dad.idpersona) ELSE 0 END AS cantidadpersonas,
                           nad.idregimentrabajo as asignacion
                    FROM mod_regimentrabajo.nom_regimentrabajo as nad
                    LEFT JOIN mod_personaext.dat_regimentrabajo as dad using (idregimentrabajo)
                    GROUP BY nad.idregimentrabajo,dad.idregimentrabajo,dad.idpersona) as tabla GROUP BY tabla.asignacion ";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function getPersonasByRegimen($idregimentrabajo,$filtro)
    {
        $sql = " SELECT dr.idpersona, dr.idregimentrabajo,dr.idcargo,dsl.idarea,perent.identidad,tt.denominacion as turnodetrabajo,dr.idgrupodescanso,gd.denominacion as grupodescanso,
                    (CASE WHEN m3.snombre is not null THEN m3.nombre ||' '|| m3.snombre||' '|| m3.papel||' '||  m3.sapel
                    ELSE m3.nombre||' '|| m3.papel||' '||  m3.sapel END) AS nombreapellidos,nc.denominacion as denomcargo,(select f.ordenunico from mod_estructuracomp.nom_filaestruc f WHERE f.idfila = dsl.idcargo limit 1) as ordenunico 
                   FROM mod_personaext.dat_regimentrabajo AS dr
                   INNER JOIN mod_persona.dat_persona m3 ON dr.idpersona = m3.idpersona
                   left join mod_regimentrabajo.nom_turnotrabajo as tt on dr.idturnotrabajo=tt.idturnotrabajo
                   left join mod_regimentrabajo.nom_grupodescanso as gd on dr.idgrupodescanso=gd.idgrupodescanso
                   inner join mod_persona.dat_personaentidad perent ON m3.idpersona = perent.idpersona AND ((perent.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= perent.fhasta OR perent.fhasta is null)))
                   inner join mod_persona.dat_situacionlaboral dsl ON perent.idpersonaentidad = dsl.idpersonaentidad AND dsl.estado = 0
                   INNER JOIN mod_estructuracomp.dat_cargo dc ON dsl.idcargo = dc.idcargo AND (dc.idproyecto = 0) 
                   INNER JOIN mod_estructuracomp.nom_cargo nc ON dc.idnomcargo = nc.idnomcargo
                   WHERE dr.idregimentrabajo = $idregimentrabajo and dr.actual = 1 ";
        if (!empty($filtro))
            $sql = $sql . "and (m3.nombre ilike '%$filtro%' or m3.snombre ilike '%$filtro%' or m3.papel ilike '%$filtro%' or m3.sapel ilike '%$filtro%'
             or concat(m3.nombre,' ',m3.papel,' ',m3.sapel ) ilike '%$filtro%' or 
              concat(m3.nombre,' ',m3.snombre,' ',m3.papel,' ',m3.sapel ) ilike '%$filtro%' ) ";
        $sql = $sql . "ORDER BY ordenunico ASC";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }


}

