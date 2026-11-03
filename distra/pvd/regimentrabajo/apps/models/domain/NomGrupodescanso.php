<?php

/**
 * Class NomGrupodescanso
 */
class NomGrupodescanso extends BaseNomGrupodescanso
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomRegimentrabajo', array('local'=>'idregimentrabajo','foreign'=>'idregimentrabajo'));
    }

    /**
     * Devuelve un objeto de la clase
     *
     * @param $idgrupodescanso
     * @return Doctrine_Record
     */
    public function getById($idgrupodescanso)
    {
        return Doctrine::getTable('NomGrupodescanso')->find($idgrupodescanso);
    }

    public function getGrupoDescansoByEntidad($criterio, $limit = null, $start = 0,$identidades)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('x.*,y.denominacion as denregimentrabajo,y.horastrabajo as horastrabajo,y.tipofondotiempo as tipofondotiempo,y.fondotiempo as fondotiempo, x.predeterminado')
                ->from('NomGrupodescanso x')
                ->leftJoin('x.NomRegimentrabajo y')
                ->where("x.fdesde <= now() and (now() <= x.fhasta or x.fhasta is null)")
                ->andWhere("x.idestructura in (" . implode(',', $identidades) . ") or x.idestructura is null");
            if ($limit) {
                $query->limit($limit)
                    ->offset($start);
            }
            if($criterio != -1)
                $query->andWhere('y.idregimentrabajo = '.$criterio);
            // print_r($query->getSqlQuery());die;
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantGrupoDescansoByEntidad($criterio,$identidades)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('NomGrupodescanso x')
                ->leftJoin('x.NomRegimentrabajo y')
                ->where('x.fdesde <= now() and (now() <= x.fhasta or x.fhasta is null)')
                ->andWhere("x.idestructura in (" . implode(',', $identidades) . ")  or x.idestructura is null");
            if($criterio != -1)
                $query->andWhere('y.idregimentrabajo = '.$criterio);
            // and y.idestructura = '. $entidad
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idregimentrabajo
     * @param null $filtro
     * @param null $limit
     * @param int $start
     * @throws Doctrine_Exception
     * @throws Exception
     */
        public static function getGrupoDescansoActive($idregimentrabajo, $filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('x.idgrupodescanso,x.denominacion, x.fdesde, x.fhasta, x.descripcion,x.idestructura')
                ->from('NomGrupodescanso x')
				->innerJoin('x.NomRegimentrabajo y')
                ->where('x.idregimentrabajo = '.$idregimentrabajo);
				
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

    public static function getAllGrupoDescansoActive()
    {
        try {
            $query = Doctrine_Query::create()
                ->select('x.idgrupodescanso,x.denominacion, x.fdesde, x.fhasta, x.descripcion,x.idestructura')
                ->from('NomGrupodescanso x')
                ->innerJoin('x.NomRegimentrabajo y');
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

     public static function getGrupoDescansoByRegimenActive($idregimentrabajo, $filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('ng.idgrupodescanso,ng.denominacion, ng.fdesde, ng.fhasta, ng.descripcion,ng.idregimentrabajo,ng.idestructura,ng.predeterminado')
                ->from('NomGrupodescanso ng')
               ->where("ng.idregimentrabajo = ".$idregimentrabajo." ")
                ->andWhere("(ng.fdesde <= CURRENT_DATE and (CURRENT_DATE <= ng.fhasta or ng.fhasta is null))");
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

     /**
     * @param null $limit
     * @param int $start
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getGrupoDescansoRegimenActive($criterio, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('x.*,y.denominacion as denregimentrabajo,y.horastrabajo as horastrabajo,y.tipofondotiempo as tipofondotiempo,y.fondotiempo as fondotiempo')
                ->from('NomGrupodescanso x')
                ->innerJoin('x.NomRegimentrabajo y')
                ->where('x.fdesde <= now() and (now() <= x.fhasta or x.fhasta is null)');
            if($criterio != -1)
                $query->andWhere('y.idregimentrabajo = '.$criterio);
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**

     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantGrupoDescansoRegimenActive($criterio)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('NomGrupodescanso')
                ->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
            if($criterio != -1)
                $query->andWhere('y.idregimentrabajo = '.$criterio);
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

   /**
    * * @param null $filtro
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantGrupoDescansoActive($idregimentrabajo, $filtro = null)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('NomGrupodescanso')
                ->where('idregimentrabajo = ? and fdesde <= now() and (now() <= fhasta or fhasta is null)', $idregimentrabajo);
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%'");
            }
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idgrupodescanso
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     */
    public function modGrupoDescanso($idgrupodescanso, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()
                ->update('NomGrupodescanso')
                ->where('idgrupodescanso= ? ', $idgrupodescanso);
            if ($denominacion != '') {
                $query->set('denominacion', '?', $denominacion);
            }
            if ($descripcion != '') {
                $query->set('descripcion', '?', $descripcion);
            } else {
                $query->set('descripcion', 'null');
            }
            if ($fdesde != '') {
                $query->set('fdesde', '?', $fdesde);
            }
            if ($fhasta != '') {
                $query->set('fhasta', '?', $fhasta);
            } else {
                $query->set('fhasta', 'null');
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
            $query->from('NomGrupodescanso')
                ->Where("denominacion = '$denom'");
            if (!empty($idregimentrabajo)) {
			
                $query->andWhere("idregimentrabajo = ?", $idregimentrabajo);
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
     *
     * @param array $ids
     * @param bool $in True para buscar solo por el array de ids y false para buscar todos los que no esten en el array
     * @param null $limit
     * @param int $start
     * @throws Doctrine_Exception
     * @return array
     */
    public function getGrupoDescansoActivaByParams(array $ids, $in = true, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('idgrupodescanso,idgrupodescanso as idnomenclador, denominacion, fdesde, fhasta, descripcion')
                ->from('NomGrupodescanso')
                ->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
            if ($limit) {
                $query->limit($limit)
                    ->offset($start);
            }
            if (count($ids) > 0) {
                if ($in) {
                    $query->andWhereIn('idgrupodescanso', $ids);
                } else {
                    $query->andWhereNotIn('idgrupodescanso', $ids);
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
    public function getCantGrupoDescansoActivaByParams(array $ids, $in = true)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('NomGrupodescanso')
                ->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
            if (count($ids) > 0) {
                if ($in) {
                    $query->andWhereIn('idgrupodescanso', $ids);
                } else {
                    $query->andWhereNotIn('idgrupodescanso', $ids);
                }
                return $query->count();
            }
            return 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getGrupoById($idgrupodescanso)
    {
        $query = Doctrine_Query::create()
            ->select('g.denominacion')
            ->from('NomGrupodescanso g')
            ->where("g.idgrupodescanso = '$idgrupodescanso'");
        return $query->execute()->toArray();
    }

    public function getGrupoByRegimen($idregimentrabajo)
    {
        $query = Doctrine_Query::create()
            ->select('g.*')
            ->from('NomGrupodescanso g')
            ->where("g.idregimentrabajo = '$idregimentrabajo'");
        return $query->execute()->toArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('NomGrupodescanso')->execute ();
        return $result->toArray();
    }

    public function getpersonasByIdGrupoDescanso($idgrupodescanso,$filtro)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql= "SELECT rt.idpersona
                FROM mod_personaext.dat_regimentrabajo rt
                WHERE rt.idgrupodescanso = ".$idgrupodescanso." and rt.actual = 1";
        return $conn->fetchAll($sql);
    }

    public function getpersonas($idgrupodescanso,$filtro)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql= "SELECT rt.idpersona
                FROM mod_personaext.dat_regimentrabajo rt
                WHERE rt.idgrupodescanso = ".$idgrupodescanso." and rt.actual = 1";
        return $conn->fetchAll($sql);
    }

    public function getpersonasByIdsGrupoDescanso($idsgrupodescanso,$filtro)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql= "SELECT rt.idpersona
                FROM mod_personaext.dat_regimentrabajo rt
                WHERE rt.idgrupodescanso in (".implode(',',$idsgrupodescanso).") and rt.actual = 1";
        return $conn->fetchAll($sql);
    }

    public function getGrupoPredeterminado()
    {
        $query = Doctrine_Query::create()
            ->select('g.denominacion')
            ->from('NomGrupodescanso g')
            ->where("g.predeterminado = 1");
        return $query->execute()->toArray();
    }
 


}

