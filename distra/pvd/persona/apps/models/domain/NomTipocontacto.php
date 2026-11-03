<?php

class NomTipocontacto extends BaseNomTipocontacto
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatContacto', array('local' => 'idtipocontacto', 'foreign' => 'idtipocontacto'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idtipocontacto
     *
     * @return Doctrine_Record
     */
    public function getById($idtipocontacto)
    {
        return Doctrine::getTable('NomTipocontacto')->find($idtipocontacto);
    }

    /**
     * Funcion para obtener los tipo medio contacto
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getActiveTypeContact($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idtipocontacto,idtipocontacto as idnomenclador, denominacion, fdesde, fhasta, 
                descripcion, abreviatura'
            )->from('NomTipocontacto')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
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
     * Funcion para obtener la cantidad tipo medio contacto activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantActiveTypeContact($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomTipocontacto')->where(
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
     * Funcion para modifcar el tipo  contacto
     *
     * @param type $idtipocontacto
     * @param type $denominacion
     * @param type $descripcion
     * @param type $fdesde
     * @param type $fhasta
     *
     * @return boolean
     */
    public function modTypeContact($idtipocontacto, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomTipocontacto')->where('idtipocontacto= ? ', $idtipocontacto);
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
     * @param $idtipocontacto
     */
    public function findByIdOrDenom($denom, $idtipocontacto)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipocontacto')->where(
                'fdesde <= now() and (fhasta is null or fhasta > now())'
            )// ->andWhere('$idtipocontacto = ?', $idtipocontacto)
            ->andWhere("denominacion ilike '$denom'");
            if (!empty($idtipocontacto)) {
                $query->andWhere("idtipocontacto <> ?", $idtipocontacto);
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

    public function findByIdOrDenomadd($denom, $idtipocontacto = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipocontacto')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idtipocontacto)) {
                $query->andWhere("idtipocontacto <> ?", $idtipocontacto);
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

    public function addDQL(Doctrine_Query &$qObj, $aR, $inSelect = false)
    {
        $qObj->innerJoin("$aR.NomTipocontacto ntctacto");
        if ($inSelect) {
            $qObj->select('ntctacto.denominacion as denomtipocontacto');

        }
    }
}

