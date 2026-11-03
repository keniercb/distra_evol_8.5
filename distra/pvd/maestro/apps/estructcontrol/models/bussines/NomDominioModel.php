<?php 
class NomDominioModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getDominiosSinEstructurasdecontrol($idestructura, $idestructuracontrol)
    {
        return NomDominio::getDominiosSinEstructurasdecontrol($idestructura, $idestructuracontrol);
    }
}