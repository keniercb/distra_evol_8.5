<?php 
class CompartimentacionDominioModel extends ZendExt_Model implements ITipoCompartimentacion
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getSqlCompartimentacion()
    {
        $sqle = $this->getSqlCompartimentacionEntidadCargo();
        $sql = "";
        if($sqle == ""){
            $sql = '('.$this->getSqlCompartimentacionAccesoSinDominio().')'; 
        }else{
            $sql = '('.$sqle.' OR '. $this->getSqlCompartimentacionAccesoSinDominio().')';
        }
        return $sql;
    }

    private function getSqlCompartimentacionAccesoSinDominio()
    {
        return "ab0.idpersona in (select sasd.idpersona from mod_persona.seg_accesosindominio as sasd
                where sasd.idusuario = ".$this->getIdUserLogueado().")";
    }

    public function getFromSqlCompartimentacion()
    {
        return " left join mod_persona.dat_personaentidad as dpe on mod_persona.dat_persona.idpersona = dpe.idpersona";
    }

    private function getSqlCompartimentacionEntidadCargo()
    {
        $idsString  = implode(',', $this->getIdsEstructurasDominio());
        if(!empty($idsString)){
            return "ab0.idpersona IN (SELECT dpent.idpersona FROM mod_persona.dat_situacionlaboral dpsl INNER JOIN mod_persona.dat_personaentidad dpent ON(dpent.idpersonaentidad = dpsl.idpersonaentidad and (dpent.fhasta IS NULL  or dpent.fhasta >= now()) AND dpsl.estado = 0) WHERE dpsl.idcargo IN (".$idsString."))";
        }else {
            return "";
        }    
    }

    private function getIdsEstructurasDominio()
    {
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura(
            $this->global->Estructura->idestructura,
            true,
            false
        );
        $idsCargos = array();
        foreach ($cargos as $k=>$v) {
            array_push($idsCargos, $v['idcargo']);
        }
        if(empty($idsCargos))
            return array();
        return $idsCargos;
    }

    private function getIdUserLogueado()
    {
        $registro = Zend_Registry::getInstance();
        return $registro->session->perfil['idusuario'];
    }
}