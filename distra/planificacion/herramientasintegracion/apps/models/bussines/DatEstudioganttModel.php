<?php

class DatEstudioganttModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtiene los datos de un estudio de curva de conflicto seleccionado
     *
     * @param $idproyecto
     *
     * @author    Ing. Frank David Corona Prendes
     * @copyrigth XETID Cuba
     * @return Doctrine_Collection
     */
    public function getProyectoGantt($idproyecto)
    {
        return DatEstudiogantt::getProyectogantt($idproyecto);
    }

}

