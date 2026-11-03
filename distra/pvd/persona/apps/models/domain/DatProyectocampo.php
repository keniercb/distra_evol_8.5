<?php

class DatProyectocampo extends BaseDatProyectocampo
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomCampo', array('local' => 'idcampo', 'foreign' => 'idcampo'));
        $this->hasOne('DatProyectoconcepto', array('local' => 'idproyectoconcepto', 'foreign' => 'idproyectoconcepto'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idproyectocampo
     *
     * @return Doctrine_Record
     */
    public function getById($idproyectocampo)
    {
        return Doctrine::getTable('DatProyectocampo')->find($idproyectocampo);
    }

    public function existeByIdconcepto($idconcepto)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->select('p.idproyectocampo')->from('DatProyectocampo p')->where(
                "$idconcepto=?", array($idconcepto)
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            if (count($result)) {
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            return $e;
        }

    }

    public function getTodosCamposByIdConcepto($idconcepto)
    {
        $queryObj = Doctrine_Query::create()->select(
            'pc.idproyectocampo,pc.orden,pc.idproyectoconcepto,pc.idcampo,nc.denominacion as campo,
                (CASE WHEN pc.obligatorio = 1 THEN true ELSE false END) obligatorio,
                (CASE WHEN pc.historico = 1 THEN true ELSE false END) historico,
                (CASE WHEN pc.activo =1 THEN true ELSE false END) activo'
        )->from('DatProyectocampo pc')->innerJoin('pc.NomCampo nc')->innerJoin('nc.NomConcepto n')->where(
            'n.idconcepto=?', $idconcepto
        )->orderBy('pc.orden ASC');

        return $queryObj->fetchArray();
    }

}

