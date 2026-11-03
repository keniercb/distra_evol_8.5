<?php

/**
 *
 */
class CfgParametrosGeneralesPatr extends BaseCfgParametrosGeneralesPatr
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
    public function getConfiguracionPGP($idEstructura = '')
    {
        if ($idEstructura == '') {
            $global = ZendExt_GlobalConcept::getInstance();
            $estructura = 'Estructura';
            $idEstructura = $global->$estructura->idestructura;
        }
        $query = new Doctrine_Query();
        return $query->from('CfgParametrosGeneralesPatr p')
                ->where('p.idestructura = ?', $idEstructura)
                ->fetchArray();
    }

}
