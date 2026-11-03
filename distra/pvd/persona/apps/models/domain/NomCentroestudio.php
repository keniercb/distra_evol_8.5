<?php

class NomCentroestudio extends BaseNomCentroestudio
{

    /**
     * @param array $idtipocentroestudio
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public static function getCentroEstudioActivo(array $idtipocentroestudio, $filtro = null, $limit = null,
                                                  $start = 0,$value)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'nce.*, nce.idcentroestudio as idnomenclador, abreviatura
                ,ntce.denominacion as denomtipocentroestudio'
            )->from('NomCentroestudio nce')->innerJoin('nce.NomTipocentroestudio ntce')->where(
                'nce.fdesde <= now() and (now() <= nce.fhasta or nce.fhasta is null)'
            )  ->orderBy('nce.denominacion');
            if($value){
                $query->limit(500)->offset(0);

            }else{
                if ($limit) {
                    $query->limit($limit)->offset($start);
                } else {
                    $query->limit(15)->offset(0);
                }
            }
            if (count($idtipocentroestudio) > 0) {
                $query->andWhereIn('nce.idtipocentroestudio', $idtipocentroestudio);
            }
            if ($filtro != null) {
                $query->andWhere("nce.denominacion ilike '%$filtro%' or nce.descripcion ilike '%$filtro%'");
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne(
            'NomTipocentroestudio', array('local' => 'idtipocentroestudio', 'foreign' => 'idtipocentroestudio')
        );
        $this->hasMany('NomFacultadestudio', array('local' => 'idcentroestudio', 'foreign' => 'idcentroestudio'));
        $this->hasMany('DatEducacion', array('local' => 'idcentroestudio', 'foreign' => 'idcentroestudio'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idcentroestudio
     *
     * @return Doctrine_Record
     */
    public function getById($idcentroestudio)
    {
        return Doctrine::getTable('NomCentroestudio')->find($idcentroestudio);
    }

    /**
     * @param array $idtipocentroestudio
     * @param null $filtro
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantCentroEstudioActivo(array $idtipocentroestudio, $filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomCentroestudio nce')->innerJoin('nce.NomTipocentroestudio ntce')
                ->where('nce.fdesde <= now() and (now() <= nce.fhasta or nce.fhasta is null)');
            if ($filtro != null) {
                $query->andWhere("nce.denominacion ilike '%$filtro%' or nce.descripcion ilike '%$filtro%'");
            }
            if (count($idtipocentroestudio) > 0) {
                $query->andWhereIn('nce.idtipocentroestudio', $idtipocentroestudio);
            }

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idcentroestudio
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     * @param $idtipocentroestudio
     */
    public function modCentroEstudio(
        $idcentroestudio, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtipocentroestudio
    )
    {
        try {
            $query = Doctrine_Query::create()->update('NomCentroestudio')
                ->where('idcentroestudio = ? ', $idcentroestudio);
            if ($denominacion != '') {
                $query->set('denominacion', '?', $denominacion);
            }
            if ($abreviatura != '') {
                $query->set('abreviatura', '?', $abreviatura);
            } else {
                $query->set('abreviatura', 'null');
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
            if ($idtipocentroestudio != '') {
                $query->set('idtipocentroestudio', '?', $idtipocentroestudio);
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
     * @param      $denom
     * @param      $idtipocentroestudio
     * @param null $idcentroestudio
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function findByIdOrDenom($denom, $idtipocentroestudio, $idcentroestudio = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCentroestudio')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                'idtipocentroestudio = ?', $idtipocentroestudio
            )->andWhere("denominacion ilike '$denom'");
            if (!empty($idcentroestudio)) {
                $query->andWhere("idcentroestudio <> ?", $idcentroestudio);
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
}

