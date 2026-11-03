<?php
class CompartimentacionRegistroModel extends ZendExt_Model implements ITipoCompartimentacion
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getSqlCompartimentacion()
    {
        return $this->getSqlIdsPersonasRegistradasByUser();
    }

    public function getFromSqlCompartimentacion()
    {
        $sqlJoin = " inner join mod_persona.seg_accesosindominio as sasd on mod_persona.dat_persona.idpersona = sasd.idpersona";
        return $sqlJoin;
    }

    private function getSqlIdsPersonasRegistradasByUser()
    {
        $sql = "(ab0.idpersona in (select sasd.idpersona from mod_persona.seg_accesosindominio as sasd where sasd.idusuario = ";
        $sql = $sql.$this->getIdUserLogueado()."))";
        return $sql;
    }

    private function getIdUserLogueado()
    {
        $registro = Zend_Registry::getInstance();
        return $registro->session->perfil['idusuario'];
    }
}