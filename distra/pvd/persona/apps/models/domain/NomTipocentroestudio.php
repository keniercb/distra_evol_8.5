<?php

class NomTipocentroestudio extends BaseNomTipocentroestudio
{

    /**
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public static function getTipoCentroEstudioActive($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idtipocentroestudio,idtipocentroestudio as idnomenclador,' . ' denominacion, fdesde, 
                fhasta, descripcion, abreviatura'
            )->from('NomTipocentroestudio')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            else {
                $query->limit(15)->offset(0);
            }
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%' or descripcion ilike '%$filtro%'");
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
        $this->hasMany('NomCentroestudio', array('local' => 'idtipocentroestudio', 'foreign' => 'idtipocentroestudio'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idtipocentroestudio
     *
     * @return Doctrine_Record
     */
    public function getById($idtipocentroestudio)
    {
        return Doctrine::getTable('NomTipocentroestudio')->find($idtipocentroestudio);
    }

    /**
     * @param null $filtro
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantTipoCentroEstudioActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomTipocentroestudio')->where(
                'fdesde <= now() and (now() <= fhasta or fhasta is null)'
            );
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%'");
            }

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idtipocentroestudio
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     */
    public function modTipoCentroEstudio($idtipocentroestudio, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomTipocentroestudio')->where(
                'idtipocentroestudio= ? ', $idtipocentroestudio
            );
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
     * @param null $idtipocentroestudio
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function findByIdOrDenom($denom, $idtipocentroestudio = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipocentroestudio')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idtipocentroestudio)) {
                $query->andWhere("idtipocentroestudio <> ?", $idtipocentroestudio);
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

