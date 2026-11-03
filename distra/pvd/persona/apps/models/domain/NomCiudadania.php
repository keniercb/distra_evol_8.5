<?php

class NomCiudadania extends BaseNomCiudadania
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idciudadania
     *
     * @return Doctrine_Record
     */
    public function getById($idciudadania)
    {
        return Doctrine::getTable('NomCiudadania')->find($idciudadania);
    }

    /**
     * Funcion para obtener la ciudadania activos
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getActiveCitizenship($filtro = null, $limit = null, $start = 0,$value)
    {

        try {
            $query = Doctrine_Query::create()->select(
                'idciudadania,idciudadania as idnomenclador, denominacion, fdesde, fhasta, 
                descripcion, bandera, abreviatura'
            )->from('NomCiudadania')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('denominacion');
            if($value){
                $query->limit(200)->offset($start);
            }else{
                if ($limit) {
                    $query->limit($limit)->offset($start);
                } else {
                    $query->limit(15)->offset(0);
                }
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
     * Funcion para obtener la cantidad de colores de pelo activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantActiveCitizenship($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomCiudadania')->where(
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
     * Funcion para maodificar la ciudadania
     *
     * @param $idciudadania
     * @param $denominacion
     * @param $descripcion
     * @param $bandera
     * @param $fdesde
     * @param $fhasta
     *
     * @return bool
     */
    public function modCitizenship($idciudadania, $denominacion, $abr, $descripcion, $bandera, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomCiudadania')->where('idciudadania= ? ', $idciudadania);
            if ($denominacion != '') {
                $query->set('denominacion', '?', $denominacion);
            }
            if ($abr != '') {
                $query->set('abreviatura', '?', $abr);
            } else {
                $query->set('abreviatura', 'null');
            }
            if ($descripcion != '') {
                $query->set('descripcion', '?', $descripcion);
            } else {
                $query->set('descripcion', 'null');
            }
            if ($bandera != '') {
                $query->set('bandera', '?', $bandera);
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
     * @param $idciudadania
     */
    public function findByIdOrDenom($denom, $idciudadania)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCiudadania')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idciudadania)) {
                $query->andWhere("idciudadania <> ?", $idciudadania);
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

    public function findByIdOrDenomadd($denom, $idciudadania = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCiudadania')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
//            if (!empty($idcolorojos)) {
//                $query->andWhere("idciudadania <> ?", $idciudadania);
//            }
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

