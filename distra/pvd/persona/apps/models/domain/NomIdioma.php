<?php

class NomIdioma extends BaseNomIdioma
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatIdioma', array('local' => 'ididioma', 'foreign' => 'ididioma'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $ididioma
     *
     * @return Doctrine_Record
     */
    public function getById($ididioma)
    {
        return Doctrine::getTable('NomIdioma')->find($ididioma);
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
    public function getActiveLanguage($filtro = null, $limit = null, $start = 0,$value)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'ididioma,ididioma as idnomenclador,denominacion,fdesde,fhasta,abreviatura,
                descripcion,bandera'
            )->from('NomIdioma')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('denominacion');
            if($value){
                $query->limit(500)->offset($start);
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
     * Funcion para obtener la cantidad de nacionalidad activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantActiveLanguage($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomIdioma')->where(
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
     * Funcion para modifcar el idioma
     *
     * @param $ididioma
     * @param $denominacion
     * @param $descripcion
     * @param $bandera
     * @param $fdesde
     * @param $fhasta
     *
     * @return bool
     */
    public function modLanguage($ididioma, $denominacion, $abreviatura, $descripcion, $bandera, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomIdioma')->where('ididioma= ? ', $ididioma);
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
     * @param $ididioma
     */
    public function findByIdOrDenom($denom, $ididioma)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomIdioma')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($ididioma)) {
                $query->andWhere("ididioma <> ?", $ididioma);
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

    public function findByIdOrDenomadd($denom, $ididioma = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomIdioma')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($ididioma)) {
                $query->andWhere("ididioma <> ?", $ididioma);
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

