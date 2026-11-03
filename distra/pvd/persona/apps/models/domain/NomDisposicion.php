<?php

class NomDisposicion extends BaseNomDisposicion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        //$this->hasMany('DatCaracteristicasocial', array('local' => 'iddisposicion', 'foreign' => 'iddisposicion'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $iddisposicion
     *
     * @return Doctrine_Record
     */
    public function getById($iddisposicion)
    {
        return Doctrine::getTable('NomDisposicion')->find($iddisposicion);
    }

    /**
     * Funcion para obtener las disposiciones
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getDisposicionActive($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'iddisposicion,iddisposicion as idnomenclador, denominacion, fdesde, fhasta, descripcion, 
                gestion, abreviatura'
            )->from('NomDisposicion')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
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
     * Funcion para obtener la cantidad de Disposicion
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantDisposicionActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomDisposicion')->where(
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
     * Funcion para maodificar Disposicion
     *
     * @param numeric $iddisposicion
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modDisposicion($iddisposicion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomDisposicion')->where(
                'iddisposicion= ? ', $iddisposicion
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
     * Funcion para verificar si existe Disposicion
     *
     * @param $denom
     * @param $iddisposicion
     */
    public function findByIdOrDenom($denom, $iddisposicion)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomDisposicion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($iddisposicion)) {
                $query->andWhere("iddisposicion <> ?", $iddisposicion);
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

