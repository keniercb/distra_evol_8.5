<?php

/*
 * @utor: Adrian Fernandez Martinez
 * fech@: 25-01-2013
 */

class CfgUsuarioespecialidad extends BaseCfgUsuarioespecialidad
{
    public function setUp()
    {
        parent::setUp();
    }

    public function devolverConfiguracionEspecialidad($idusuario, $idespecialidad)
    {
        if ($idusuario && $idespecialidad) {
            $confEspecialidad = Doctrine::getTable('CfgUsuarioespecialidad')
                ->findByDql('idusuario = ? AND idespecialidad = ?', array(
                        $idusuario, $idespecialidad
                    )
                )->getFirst();
        }
        return $confEspecialidad;
    }
}
