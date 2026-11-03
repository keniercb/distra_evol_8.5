<?php 
class CompartimentacionTodasPersonaModel extends ZendExt_Model implements ITipoCompartimentacion
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getSqlCompartimentacion()
    {
        return "";//ab0.idpersona = 1000001111327
    }

    public function getFromSqlCompartimentacion()
    {
        return '';
    }
}
