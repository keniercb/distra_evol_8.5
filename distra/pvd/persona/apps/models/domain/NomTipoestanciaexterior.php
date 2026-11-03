<?php

class NomTipoestanciaexterior extends BaseNomTipoestanciaexterior
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany(
            'DatEstanciaexterior', array(
                'local' => 'idtipoestanciaexterior', 'foreign' => 'idtipoestanciaexterior')
        );
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idtipoestanciaexterior
     *
     * @return Doctrine_Record
     */
    public function getById($idtipoestanciaexterior)
    {
        return Doctrine::getTable('NomTipoestanciaexterior')->find($idtipoestanciaexterior);
    }

    public function getTipoEstanciaExteriorActivos($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idtipoestanciaexterior, idtipoestanciaexterior as idnomenclador, '
                . 'denominacion, fdesde, fhasta, descripcion, abreviatura'
            )->from('NomTipoestanciaexterior')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('denominacion');
            if ($limit) {
                $query->limit($limit)->offset($start);
            }  else {
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
    public function getCantTipoEstanciaExteriorActivos($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomTipoestanciaexterior')->where(
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
     * @param      $denom
     * @param null $idtipomision
     *
     * @return bool
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function findByIdOrDenom($denom, $idtipoestanciaexterior)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipoestanciaexterior')->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere("denominacion ilike '$denom'");
            if (!empty($idtipoestanciaexterior)) {
                $query->andWhere("idtipoestanciaexterior <> ?", $idtipoestanciaexterior);
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

    public function findByIdOrDenomadd($denom, $idtipoestanciaexterior = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipoestanciaexterior')->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere("denominacion ilike '$denom'");
            if (!empty($idtipoestanciaexterior)) {
                $query->andWhere("idtipoestanciaexterior <> ?", $idtipoestanciaexterior);
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
     * @param $idtipoestanciaexterior
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     *
     * @return bool
     * @throws Exception
     */
    public function modTipoEstanciaExterior($idtipoestanciaexterior, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomTipoestanciaexterior')->where(
                'idtipoestanciaexterior = ? ', $idtipoestanciaexterior
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
}

