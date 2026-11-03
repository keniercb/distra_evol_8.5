<?php

class NomMarcamodelo extends BaseNomMarcamodelo
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatMarcamodeloEntidad', array('local' => 'idmarcamodelo', 'foreign' => 'idmarcamodelo'));
        $this->hasMany('NomMarcamodelo', array('local' => 'idpadre', 'foreign' => 'idmarcamodelo'));
    }

    public function getMarcamodeloPorIdPadre($post)
    {
        $query = new Doctrine_Query();

        $query->select(
            'idmarcamodelo as id, denominacion as text, idpadre, (Case When (idmarcamodelo <> idpadre) Then true Else false End) as leaf'
        )->from('NomMarcamodelo');

        if ($post['node'] == 0) {
            $query->addWhere('idmarcamodelo = idpadre');
        } else {
            $query->addWhere('idpadre = ? and idmarcamodelo <> idpadre', array($post['node']));
        }

        if ($post['params']) {
            $parametros = json_decode(stripslashes($post['params']));
            if ($parametros->idnaturaleza) {
                $query->addWhere('idnaturaleza = ?', array($parametros->idnaturaleza));
            }
        }

        return $query->fetchArray();
    }
}