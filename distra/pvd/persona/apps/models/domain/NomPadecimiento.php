<?php

/**
 * Clase del dominio del nomenclador de tipo de padecimento
 * Class NomPadecimiento
 */
class NomPadecimiento extends BaseNomPadecimiento
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatAfeccion', array('local' => 'idpadecimiento', 'foreign' => 'idpadecimiento'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idpadecimiento
     *
     * @return Doctrine_Record
     */
    public function getById($idpadecimiento)
    {
        return Doctrine::getTable('NomPadecimiento')->find($idpadecimiento);
    }

    /**
     * Funcion para obtener los padecimiento activos
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getActiveSuffering($filtro = null, $limit = null, $start = 0,$value)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idpadecimiento,idpadecimiento as idnomenclador, denominacion, fdesde, fhasta, descripcion, abreviatura'
            )->from('NomPadecimiento')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('denominacion');
            if ($limit) {
                $query->limit($limit)->offset($start);
            } else {
                $query->limit(15)->offset(0);
            }
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%' or descripcion ilike '%$filtro%'");
            }
            if($value){
                $query->limit(500)->offset(0);

            }else{
                if ($limit) {
                    $query->limit($limit)->offset($start);
                } else {
                    $query->limit(15)->offset(0);
                }
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }



    /**
     * Funcion para obtener la cantidad de padecimiento activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantActiveSuffering($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomPadecimiento')->where(
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
     * Funcion para modifcar el tipo de padecimiento
     *
     * @param type $idpadecimiento
     * @param type $denominacion
     * @param type $descripcion
     * @param type $fdesde
     * @param type $fhasta
     *
     * @return boolean
     */
    public function modSuffering($idpadecimiento, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomPadecimiento')->where('idpadecimiento= ? ', $idpadecimiento);
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
     * Funcion para verificar si existe el color
     *
     * @param $denom
     * @param $idpadecimiento
     */
    public function findByIdOrDenom($denom, $idpadecimiento)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomPadecimiento')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idpadecimiento)) {
                $query->andWhere("idpadecimiento <> ?", $idpadecimiento);
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

    public function findByIdOrDenomadd($denom, $idpadecimiento = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomPadecimiento')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idpadecimiento)) {
                $query->andWhere("idpadecimiento <> ?", $idpadecimiento);
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
