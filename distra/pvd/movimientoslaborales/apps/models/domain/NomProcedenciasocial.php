<?php

class NomProcedenciasocial extends BaseNomProcedenciasocial
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany(
            'DatPersonaentidad',
            array('local' => 'idprocedenciasocial', 'foreign' => 'idprocedenciasocial')
        );
    }

    public function getProcedenciaAct()
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                'v.idprocedenciasocial,
                v.idprocedenciasocial as id,
                v.denominacion,
                v.denominacion as text,
                v.fdesde, v.fhasta,
                v.descripcion,
                v.idpadre'
            )
            ->from('NomProcedenciasocial v')
            ->where('v.fdesde <= now() and (now() <= v.fhasta or v.fhasta is null)');
        return $queryObj->fetchArray();
    }

    /**
     * Devuelve un objeto de la clase
     * @params $fhasta
     *
     * @return Doctrine_Record
     */
    public function getById($fhasta)
    {
        return Doctrine::getTable('NomProcedenciasocial')->find($fhasta);
    }

    public function getProcedenciaPadres($denom, $fdesde, $fhasta)
    {
        $queryObj = Doctrine_Query::create()
            ->select('v.idprocedenciasocial as id, v.denominacion as text, v.*')
            ->from('NomProcedenciasocial v')
            ->where("v.idprocedenciasocial = v.idpadre");
        if ($denom) {
            $queryObj->addWhere("v.denominacion ilike '%$denom%'");
        }
        if ($fdesde) {
            $queryObj->addWhere("v.fdesde = '$fdesde'");
        }
        if ($fhasta) {
            $queryObj->addWhere("v.fhasta = '$fhasta'");
        }
        return $queryObj->fetchArray();
    }

    public function getProcedenciaHijos($idpadre)
    {
        $queryObj = Doctrine_Query::create()
            ->select('v.idprocedenciasocial as id, v.denominacion as text, v.*')
            ->from('NomProcedenciasocial v')
            ->where("v.idprocedenciasocial <> v.idpadre and v.idpadre = '$idpadre'");
        return $queryObj->fetchArray();
    }

    /**
     * Funcion para modifcar el tipo de procedencia social
     *
     * @param type $idprocedenciasocial
     * @param type $denominacion
     * @param type $descripcion
     * @param type $fdesde
     * @param type $fhasta
     *
     * @return boolean
     */
    public function modSocialOrigin(
        $idpsocial,
        $denominacion,
        $descripcion,
        $fdesde,
        $fhasta
    )
    {
        try {
            $query = Doctrine_Query::create()
                ->update('NomProcedenciasocial')
                ->where('idprocedenciasocial= ? ', $idpsocial);
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
     * Funcion para verificar si existe la procedencia
     *
     * @param $denom
     * @param $idprocedenciasocial
     */
    public function findByIdOrDenom($denom, $idprocedenciasocial)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomProcedenciasocial')
                ->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere("denominacion ilike '$denom'");
            if (!empty($idprocedenciasocial)) {
                $query->andWhere("idprocedenciasocial <> ?", $idprocedenciasocial);
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

    public function findByIdOrDenomadd($denom, $idprocedenciasocial = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomProcedenciasocial')
                ->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere("denominacion ilike '$denom'");
            if (!empty($idprocedenciasocial)) {
                $query->andWhere("idprocedenciasocial <> ?", $idprocedenciasocial);
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

