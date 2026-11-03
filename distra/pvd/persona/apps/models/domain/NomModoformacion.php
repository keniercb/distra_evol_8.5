<?php

class NomModoformacion extends BaseNomModoformacion
{

    /**
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public static function getModoFormacionActive($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idmodoformacion,idmodoformacion as idnomenclador, denominacion, fdesde, fhasta, descripcion'
            )->from('NomModoformacion')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
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
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatEducacion', array('local' => 'idmodoformacion', 'foreign' => 'idmodoformacion'));
        $this->hasMany('NomModoformacion', array('local' => 'idmodoformacion', 'foreign' => 'idpadre'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idmodoformacion
     *
     * @return Doctrine_Record
     */
    public function getById($idmodoformacion)
    {
        $modo = Utiles::reflectArray($idmodoformacion);
        if (count($modo) > 0) {
            $query = Doctrine_Query::create()->from('NomModoformacion')->whereIn('idmodoformacion', $modo);

            return $query->execute();
        }
    }

    /**
     * @param null $filtro
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantModoFormacionActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomModoformacion')->where(
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
     * @param $idmodoformacion
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     */
    public function modModoFormacion($idmodoformacion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomModoformacion')->where('idmodoformacion= ? ', $idmodoformacion);
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
     * @param null $idmodoformacion
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function findByIdOrDenom($denom, $idmodoformacion = null, $idpadre)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomModoformacion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idmodoformacion)) {
                $query->andWhere("idmodoformacion <> ?", $idmodoformacion);
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
        $query = Doctrine_Query::create()->from('NomModoformacion')->where("denominacion ILIKE '$denom'");
        if ($id) {
            $query->andWhere('idmodoformacion <> ?', $id);
        }

        return ($query->count() > 0) ? true : false;
    }

    public function getAllModoformacion($activo = true)
    {
        try {
            $queryObj = Doctrine_Query::create();
            $queryObj->select(
                'idmodoformacion as id, denominacion as text, *'
            )->from('NomModoformacion')->orderBy('idmodoformacion ASC');
            if ($activo === true) {
                $queryObj->andWhere('fdesde <= now() AND (fhasta >= now() OR fhasta IS NULL)');
            }

            return $queryObj->fetchArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function deleteModoformacion($id)
    {
        try {
            Doctrine_Query::create()->delete('NomModoformacion')->whereIn('idmodoformacion', Utiles::reflectArray($id))
                ->execute();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}
