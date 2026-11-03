<?php

class NomCausaaccidente extends BaseNomCausaaccidente
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
    }

    public function getCausaAct()
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                'v.idcausaaccidente,
                v.idcausaaccidente as id,
                v.denominacion,
                v.denominacion as text,
                v.fdesde, v.fhasta,
                v.descripcion,
                v.idpadre'
            )
            ->from('NomCausaaccidente v')
            ->where('v.fdesde <= now() and (now() <= v.fhasta or v.fhasta is null)');
        return $queryObj->fetchArray();
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idcausaaccidente
     *
     * @return Doctrine_Record
     */
    public function getById($idcausaaccidente)
    {
        return Doctrine::getTable('NomCausaaccidente')->find($idcausaaccidente);
    }

    public function getCausaPadres($denom, $fdesde, $fhasta)
    {
        $queryObj = Doctrine_Query::create()
            ->select('v.idcausaaccidente as id, v.denominacion as text, v.*')
            ->from('NomCausaaccidente v')
            ->where("v.idcausaaccidente = v.idpadre");
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

    public function getCausaHijos($idpadre)
    {
        $queryObj = Doctrine_Query::create()
            ->select('v.idcausaaccidente as id, v.denominacion as text, v.*')
            ->from('NomCausaaccidente v')
            ->where("v.idcausaaccidente <> v.idpadre and v.idpadre = '$idpadre'");
        return $queryObj->fetchArray();
    }

    /**
     * Funcion para modifcar la causa de accidente
     *
     * @param type $idcausaaccidente
     * @param type $denominacion
     * @param type $descripcion
     * @param type $fdesde
     * @param type $fhasta
     *
     * @return boolean
     */
    public function modCausa($idcausaaccidente, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomCausaaccidente')->where(
                'idcausaaccidente= ? ', $idcausaaccidente
            );
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
     * Funcion para verificar si existe la causa
     *
     * @param $denom
     * @param $idcausaaccidente
     */
    public function findByIdOrDenom($denom, $idcausaaccidente)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCausaaccidente')
                ->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idcausaaccidente)) {
                $query->andWhere("idcausaaccidente <> ?", $idcausaaccidente);
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

    public function findByIdOrDenomadd($denom, $idcausaaccidente = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCausaaccidente')
                ->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idcausaaccidente)) {
                $query->andWhere("idcausaaccidente <> ?", $idcausaaccidente);
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

