<?php

/**
 *
 */
class CfgParametrosGenerales extends BaseCfgParametrosGenerales
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
    }

    /**
     *
     */
    public function getConfiguracionPG($idEstructura = '', $tipo)
    {
        if ($idEstructura == '') {
            $global = ZendExt_GlobalConcept::getInstance();
            $estructura = 'Estructura';
            $idEstructura = $global->$estructura->idestructura;
        }
        $query = new Doctrine_Query();
        if($tipo == 1){
            $CfgParametrosGenerales = 'CfgParametrosGeneralesPatr';
        }else{
             $CfgParametrosGenerales = 'CfgParametrosGenerales';
        }
        $datos = $query->from("{$CfgParametrosGenerales} p")
                ->where('p.idestructura = ?', $idEstructura)
                ->fetchArray();
        return $datos;
    }

}
