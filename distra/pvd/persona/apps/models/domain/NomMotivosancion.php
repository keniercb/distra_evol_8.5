<?php

class NomMotivosancion extends BaseNomMotivosancion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatSancion', array('local' => 'idmotivosancion', 'foreign' => 'idmotivosancion'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $fhasta
     *
     * @return Doctrine_Record
     */
    public function getById($fhasta)
    {
        return Doctrine::getTable('NomMotivosancion')->find($fhasta);
    }

    /**
     * Funcion para obtener los Sancion
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getMotiveOfSanctionActive($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idmotivosancion,idmotivosancion as idnomenclador, denominacion, fdesde, fhasta, abreviatura,
                descripcion'
            )->from('NomMotivosancion')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
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

    /**
     * Funcion para obtener la cantidad de Sancion
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantMotiveOfSanctionActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomMotivosancion')->where(
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
     * Funcion para maodificar Sancion
     *
     * @param numeric $idcolorpiel
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modMotiveOfSanction($idmotivosancion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()
                ->update('NomMotivosancion')
                ->where('idmotivosancion= ? ', $idmotivosancion);
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
     * Funcion para verificar si existe Sancion
     *
     * @param $denom
     * @param $idmotivosancion
     */
    public function findByIdOrDenom($denom, $idmotivosancion)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomMotivosancion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idmotivosancion)) {
                $query->andWhere("idmotivosancion <> ?", $idmotivosancion);
            }
            $idmotivosancion = null;
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

    public function findByIdOrDenomadd($denom, $idmotivosancion = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomMotivosancion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
//            if (!empty($idcolorojos)) {
//                $query->andWhere("idmotivosancion <> ?", $idmotivosancion);
//            }
            $idmotivosancion = null;
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

