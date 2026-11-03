<?php

class NomTipocondecoracion extends BaseNomTipocondecoracion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('NomCondecoracion', array('local' => 'idtipocondecoracion', 'foreign' => 'idtipocondecoracion'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idtipocondecoracion
     *
     * @return Doctrine_Record
     */
    public function getById($idtipocondecoracion)
    {
        return Doctrine::getTable('NomTipocondecoracion')->find($idtipocondecoracion);
    }

    /**
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getTipoCondecoracionActivos($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idtipocondecoracion,idtipocondecoracion as idnomenclador,' . ' denominacion, fdesde, 
                fhasta, descripcion, abreviatura'
            )->from('NomTipocondecoracion')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('denominacion');
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
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantTipoCondecoracionActivos($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomTipocondecoracion')->where(
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

    public function modTipoCondecoracion($idtipocondecoracion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomTipocondecoracion')->where(
                'idtipocondecoracion= ? ', $idtipocondecoracion
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
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para verificar si existe el color
     *
     * @param      $denom
     * @param null $idtipocondecoracion
     *
     * @return bool
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function findByIdOrDenom($denom, $idtipocondecoracion = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipocondecoracion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idtipocondecoracion)) {
                $query->andWhere("idtipocondecoracion <> ?", $idtipocondecoracion);
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

