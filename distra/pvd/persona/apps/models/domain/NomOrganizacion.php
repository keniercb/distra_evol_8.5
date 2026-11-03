<?php

class NomOrganizacion extends BaseNomOrganizacion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomTipoorganizacion', array('local' => 'idtipoorganizacion', 'foreign' => 'idtipoorganizacion'));
        $this->hasMany('DatAfiliacion', array('local' => 'idorganizacion', 'foreign' => 'idorganizacion'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $fhasta
     *
     * @return Doctrine_Record
     */
    public function getById($idorganizacion)
    {
        return Doctrine::getTable('NomOrganizacion')->find($idorganizacion);
    }

    /**
     * Funcion para obtener los Organization
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getOrganizationActive($filtro = null, $limit = null, $start = 0, $idtipoorganizacion,$value)
    {
        try {
            $select
                = 'no.idorganizacion,no.idorganizacion as idnomenclador, no.denominacion, no.fdesde, no.fhasta,
                 no.descripcion, no.idtipoorganizacion, nto.denominacion as denomtipoorganizacion, abreviatura';
            $query = Doctrine_Query::create()->select($select)->from('NomOrganizacion no')->innerJoin(
                'no.NomTipoorganizacion nto'
            )->where('no.fdesde <= now() and (now() <= no.fhasta or no.fhasta is null)')
                ->orderBy('no.denominacion');
            if($value){
                $query->limit(500)->offset(0);

            }else{
                if ($limit) {
                    $query->limit($limit)->offset($start);
                }
            }
            if ($filtro != null) {
                $query->andWhere("no.denominacion ilike '%$filtro%' or no.descripcion ilike '%$filtro%'");
            }
            if (!empty($idtipoorganizacion)) {
                $query->andWhere("no.idtipoorganizacion = ?", $idtipoorganizacion);
            }
            return $query->execute()->toArray();

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para obtener la cantidad de Organization
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantOrganizationActive($filtro = null, $idtipoorganizacion)
    {
        try {
            $query = Doctrine_Query::create()->from('NomOrganizacion no')->innerJoin('no.NomTipoorganizacion nto')->where(
                'no.fdesde <= now() and (now() <= no.fhasta or no.fhasta is null)'
            );
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%'");
            }
            if (!empty($idtipoorganizacion)) {
                $query->andWhere("no.idtipoorganizacion = ?", $idtipoorganizacion);
            }

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para maodificar Organization
     *
     * @param numeric $idcolorpiel
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modOrganization($idorganizacion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtipoorganizacion)
    {
        try {
            $query = Doctrine_Query::create()->update('NomOrganizacion')->where('idorganizacion= ? ', $idorganizacion);
            $this->setValues($denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtipoorganizacion, $query);
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
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     * @param $idtipoorganizacion
     * @param $query
     */
    private function setValues($denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtipoorganizacion, $query)
    {
        if ($denominacion != '') {
            $query->set('denominacion', '?', $denominacion);
        }
        if ($idtipoorganizacion != '') {
            $query->set('idtipoorganizacion', '?', $idtipoorganizacion);
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
    }

    /**
     * Funcion para verificar si existe Organization
     *
     * @param $denom
     * @param $idorganizacion
     */
    public function findByIdOrDenom($denom, $idtipoorganizacion, $idorganizacion = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomOrganizacion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                'idtipoorganizacion = ?', $idtipoorganizacion
            )->andWhere("denominacion ilike '$denom'");
//            if (!empty($idcolorojos)) {
//                $query->andWhere("idorganizacion <> ?", $idorganizacion);
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
    public function getOrganizaciones()
    {
        try {
            $select
                = 'no.idorganizacion,no.idorganizacion as idnomenclador, no.denominacion, no.fdesde, no.fhasta,
                 no.descripcion, no.idtipoorganizacion';
            $query = Doctrine_Query::create()->select($select)->from('NomOrganizacion no')
                ->orderBy('no.denominacion');

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }


}

