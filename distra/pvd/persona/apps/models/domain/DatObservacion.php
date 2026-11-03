<?php
/******************************************************************************
 * Copyright (c) 2016. Todos los derechos reservados. RRHH-XETID              *
 ******************************************************************************/

class DatObservacion extends BaseDatObservacion
{
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

    /**
     * Devuelve un objeto de la clase
     *
     * @param      $idobservacion
     * @param bool $inArray
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getById($idingreso)
    {
        return Doctrine::getTable('DatObservacion')->find($idingreso);
    }

    public function obtenerObservPorPersona($idpersona)
    {

        $query = Doctrine_Query::create()
            ->select('di.*')
            ->from('DatObservacion di')
            ->whereIn('di.idpersona', $idpersona)
            ->orderBy('di.fregistro ASC');
        return $query->execute()->toArray();
    }


}