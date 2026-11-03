<?php

class DatConceptoespecialidad extends BaseDatConceptoespecialidad
{

    public function setUp()
    {
        parent::setUp();
    }

    public function obtenerConceptoEspecialidadDadoIdConceptoIdEntidad($idconcepto,
        $identidad
    ) 
    {
        $integrator = ZendExt_IoC::getInstance();
        $estructura = $integrator->metadatos->DameEstructura($identidad);
        $idespecialidad = $estructura[0]->idespecialidad;
        $query = Doctrine_Query::create();
        $query->from('DatConceptoespecialidad ce')
            ->where(
                'ce.idconcepto = ? and ce.idespecialidad = ?',
                array($idconcepto, $idespecialidad)
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

}
