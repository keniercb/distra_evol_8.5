<?php

class NomTipoformacion extends BaseNomTipoformacion
{

    /**
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public static function getTipoFormacionActive($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idtipoformacion,idtipoformacion as idnomenclador, denominacion, fdesde, fhasta, descripcion'
            )->from('NomTipoformacion')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
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
        $this->hasMany('DatEducacion', array('local' => 'idtipoformacion', 'foreign' => 'idtipoformacion'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idtipoformacion
     *
     * @return Doctrine_Record
     */
    public function getById($idtipoformacion)
    {
        $modo = Utiles::reflectArray($idtipoformacion);
        if (count($modo) > 0) {
            $query = Doctrine_Query::create()->from('NomTipoformacion')->whereIn('idtipoformacion', $modo);

            return $query->execute();
        }
    }

    /**
     * @param null $filtro
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantTipoFormacionActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomTipoformacion')->where(
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
     * @param $idtipoformacion
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     */
    public function modTipoFormacion($idtipoformacion, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomTipoformacion')->where('idtipoformacion= ? ', $idtipoformacion);
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
     * @param      $denom
     * @param null $idtipoformacion
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function findByIdOrDenom($denom, $idtipoformacion = null, $idpadre)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipoformacion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idtipoformacion)) {
                $query->andWhere("idtipoformacion <> ?", $idtipoformacion);
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

    public function verifExiste($denom, $id = null)
    {
        $query = Doctrine_Query::create()->from('NomTipoformacion')->where("denominacion ILIKE '$denom'");
        if ($id) {
            $query->andWhere('idtipoformacion <> ?', $id);
        }

        return ($query->count() > 0) ? true : false;
    }

    public function deleteTipoformacion($id)
    {
        try {
            Doctrine_Query::create()->delete('NomTipoformacion')->whereIn('idtipoformacion', Utiles::reflectArray($id))
                ->execute();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getAllTipoformacion($activo = true)
    {
        try {
            $queryObj = Doctrine_Query::create();
            $queryObj->select(
                'idtipoformacion as id, denominacion as text, *'
            )->from('NomTipoformacion')->orderBy('idtipoformacion ASC');
            if ($activo === true) {
                $queryObj->andWhere('fdesde <= now() AND (fhasta >= now() OR fhasta IS NULL)');
            }

            return $queryObj->fetchArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }
}

