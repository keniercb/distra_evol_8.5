<?php

class NomMotivobaja extends BaseNomMotivobaja
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatOcupacion', array('local' => 'idmotivobaja', 'foreign' => 'idmotivobaja'));
        $this->hasMany('DatPersonaentidad', array('local' => 'idmotivobaja', 'foreign' => 'idmotivobaja'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $fhasta
     *
     * @return Doctrine_Record
     */
    public function getById($idmotivobaja)
    {
        $modo = Utiles::reflectArray($idmotivobaja);
        if (count($modo) > 0) {
            $query = Doctrine_Query::create()->from('NomMotivobaja')->whereIn('idmotivobaja', $modo);

            return $query->execute();
        }
    }

    /**
     * Funcion para obtener las tallas activos
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getActiveLowMotive($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idmotivobaja,idmotivobaja as idnomenclador, denominacion, fdesde, fhasta, descripcion'
            )->from('NomMotivobaja')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
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
     * Funcion para obtener la cantidad de LowMotivea activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantActiveLowMotive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomMotivobaja')->where(
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
     * Funcion para modifcar el tipo de procedencia social
     *
     * @param type $idmotivobaja
     * @param type $denominacion
     * @param type $descripcion
     * @param type $fdesde
     * @param type $fhasta
     *
     * @return boolean
     */
    public function modLowMotive($idmotivobaja, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomMotivobaja')->where('idmotivobaja= ? ', $idmotivobaja);
            if ($denominacion != '') {
                $query->set('denominacion', '?', $denominacion);
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
     * @param $idmotivobaja
     */
    public function findByIdOrDenom($denom, $idmotivobaja = null, $idpadre)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomMotivobaja')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
//            if (!empty($idtipoformacion)) {
//                $query->andWhere("idmotivobaja <> ?", $idmotivobaja);
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

    public function verifExiste($denom, $id = null)
    {
        $query = Doctrine_Query::create()->from('NomMotivobaja')->where("denominacion ILIKE '$denom'");
        if ($id) {
            $query->andWhere('idmotivobaja <> ?', $id);
        }

        return ($query->count() > 0) ? true : false;
    }

    public function getAllMotivobaja($activo = true)
    {
        try {
            $queryObj = Doctrine_Query::create();
            $queryObj->select(
                'idmotivobaja as id, denominacion as text, *'
            )->from('NomMotivobaja')->orderBy('idpadre ASC');
            if ($activo === true) {
                $queryObj->andWhere('fdesde <= now() AND (fhasta >= now() OR fhasta IS NULL)');
            }

            return $queryObj->fetchArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function delLowMotive($id)
    {
        try {
            Doctrine_Query::create()->delete('NomMotivobaja')->whereIn('idmotivobaja', Utiles::reflectArray($id))->execute();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}

