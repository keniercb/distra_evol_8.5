<?php

/**
 * @name ConfRegistrounico - Clase del dominio para la configuracion de los conceptos.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ConfConceptosNomina extends BaseConfConceptosNomina
{
    public function setUp()
    {
        parent:: setUp();
    }

    public function getSelected()
    {
        $query = new Doctrine_Query();
        $result = $query->select('r.idconcepto')
            ->from('ConfConceptosNomina r');
        return $result->fetchArray();
    }

    public function deleteTabla(){
        $query = new Doctrine_Query();
        $result = $query->delete()
            ->from('ConfConceptosNomina r');
        return $result->fetchArray();
    }

    public function obtenerConceptos(){
        $query = new Doctrine_Query();
        $result = $query->select('r.idconcepto')
            ->from('ConfConceptosNomina r');
        return $result->fetchArray();
    }

}