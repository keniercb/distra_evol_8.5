<?php
class NomEstalimentacion extends BaseNomEstalimentacion
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatServalimentacion', array('local' => 'idestalimentacion', 'foreign' => 'idestalimentacion'));
    }

    public function getById($idestalimentacion)
    {
        return Doctrine::getTable('NomEstalimentacion')->find($idestalimentacion);
    }

    public function getEstAlimentacionActivas($filtro = null, $limit = null, $start = 0)
    {

        try {
            $query = Doctrine_Query::create()->select(
                'idestalimentacion,idestalimentacion as idnomenclador, denominacion, fdesde, fhasta, descripcion'
            )->from('NomEstalimentacion')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('denominacion');
            if ($limit) {
                $query->limit($limit)->offset($start);
            } else {
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

    public function getCantActivas($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomEstalimentacion')->where(
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

    public function modEstAlimentacion($idestalimentacion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()
                ->update('NomEstalimentacion')
                ->where('idestalimentacion= ? ', $idestalimentacion);
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
    
    public function findByIdOrDenom($denom, $idestalimentacion)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomEstalimentacion')
                ->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere("denominacion ilike '$denom'");
            if (!empty($idestalimentacion)) {
                $query->andWhere("idestalimentacion <> ?", $idestalimentacion);
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

    public function findByIdOrDenomadd($denom, $idestalimentacion = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomEstalimentacion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idestalimentacion)) {
                $query->andWhere("idestalimentacion <> ?", $idestalimentacion);
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