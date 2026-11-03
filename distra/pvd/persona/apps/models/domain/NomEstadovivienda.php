<?php
class NomEstadovivienda extends BaseNomEstadovivienda
{
    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatEstadovivienda', array('local' => 'idestadovivienda', 'foreign' => 'idestadovivienda'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $ididioma
     *
     * @return Doctrine_Record
     */
    public function getById($idestadovivienda)
    {
        //print_r(Doctrine::getTable('NomEstadovivienda')->find($idestadovivienda));die;
        return Doctrine::getTable('NomEstadovivienda')->find($idestadovivienda);
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
    public function getEstadoVivienda($filtro, $limit, $start)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'ne.*,ne.denominacion as denomestado')->from('NomEstadovivienda ne');
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
                $result[$k]['idnomenclador'] = $v['idestadovivienda'];
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
    public function getCantEstadoVivienda()
    {
        try {
            $query = Doctrine_Query::create()->from('NomEstadovivienda');

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function buscarDenominacionId($denom, $idestadovivienda = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomEstadovivienda')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idestadovivienda)) {
                $query->andWhere("idestadovivienda <> ?", $idestadovivienda);
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
    public function modEstadoVivienda($idestadovivienda, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            //$estado = $this->getById($idestadovivienda);
            $query = Doctrine_Query::create()
                ->update('NomEstadovivienda')
                ->where('idestadovivienda = ?', $idestadovivienda);
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

    public function buscarPorDenom($denom, $idestadovivienda)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomEstadovivienda')
                ->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere("denominacion ilike '$denom'");
            if (!empty($idestadovivienda)) {
                $query->andWhere("idestadovivienda <> ?", $idestadovivienda);
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