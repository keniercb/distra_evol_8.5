<?php

class NomConvivencia extends BaseNomConvivencia
{
    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatEstadovivienda', array('local' => 'idconvivencia', 'foreign' => 'idconvivencia'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $ididioma
     *
     * @return Doctrine_Record
     */
    public function getById($idconvivencia)
    {
        return Doctrine::getTable('NomConvivencia')->find($idconvivencia);
    }

    /**
     * Funcion para obtener los nacionalidad activos
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getConvivencia($filtro, $limit, $start)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'ne.*,ne.denominacion as denomconvivencia')->from('NomConvivencia ne');
            if ($limit) {
                $query->limit($limit)->offset($start);
            } else {
                $query->limit(15)->offset(0);
            }
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%' or descripcion ilike '%$filtro%'");
            }
            $query->orderBy('denominacion');
            $result = $query->execute()->toArray();
            foreach ($result as $k => $v) {
                $result[$k]['idnomenclador'] = $v['idconvivencia'];
            }
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para obtener la cantidad de nacionalidad activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantConvivencia()
    {
        try {
            $query = Doctrine_Query::create()->from('NomConvivencia');

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function buscarDenominacionId($denom, $idconvivencia = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomConvivencia')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idconvivencia)) {
                $query->andWhere("idconvivencia <> ?", $idconvivencia);
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
    public function modConvivencia($idconvivencia, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()
                ->update('NomConvivencia')
                ->where('idconvivencia = ?', $idconvivencia);
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

    public function buscarPorDenom($denom, $idconvivencia)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomConvivencia')
                ->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere("denominacion ilike '$denom'");
            if (!empty($idconvivencia)) {
                $query->andWhere("idconvivencia <> ?", $idconvivencia);
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