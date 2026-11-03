<?php

class NomCampo extends BaseNomCampo
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomConcepto', array('local' => 'idconcepto', 'foreign' => 'idconcepto'));
        $this->hasOne('NomTipodedato', array('local' => 'idtipodedato', 'foreign' => 'idtipodedato'));
        $this->hasMany('DatProyectocampo', array('local' => 'idcampo', 'foreign' => 'idcampo'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idcampo
     *
     * @return Doctrine_Record
     */
    public function getById($idcampo)
    {
        return Doctrine::getTable('NomCampo')->find($idcampo);
    }

    public function existe($denominacion, $cambio)
    {
        if ($cambio) {
            $query = new Doctrine_Query ();
            $result = $query->select('denominacion')->from('NomCampo')->where('denominacion = ? ', $denominacion)->execute();
            if (count($result->toArray()) > 0) {
                return true;
            }

            return false;
        }

        return false;
    }

    public function getPorLimite($idconcepto, $filtro, $limit = 15, $start = 0)
    {
        if (empty($filtro)) {
            $queryObj = Doctrine_Query::create()->select('nc.*,ntd.denominacion AS denom')->from('NomCampo nc')->innerJoin(
                "nc.NomTipodedato ntd"
            )->where('idconcepto = ?', $idconcepto)->orderBy('nc.idcampo DESC')->limit($limit)->offset($start);

            return $queryObj->fetchArray();
        } else {
            $queryObj = Doctrine_Query::create()->from('NomCampo')->where(
                "idconcepto = ? AND denominacion ilike '%$filtro%'", $idconcepto
            )->orderBy('idcampo DESC')->limit($limit)->offset($start);

            return $queryObj->fetchArray();

        }
    }

    public function getCantTotal($idconcepto, $denominacion)
    {
        try {
            $query = Doctrine_Query::create()->select('COUNT(idacciones)')->from('NomCampo')->where(
                'idconcepto=?', $idconcepto
            );
            if (!empty($denominacion)) {
                $query->addWhere("denominacion ILIKE '%$denominacion%'");
            }
            $arr = $query->fetchArray();

            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function getTodosCamposByIdConcepto($idconcepto)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('NomCampo')->where('idconcepto = ?', $idconcepto)->execute();

        return $result->toArray();

    }

}

