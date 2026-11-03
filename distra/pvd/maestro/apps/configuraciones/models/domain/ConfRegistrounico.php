<?php
/**
 * @name ConfRegistrounico - Clase del dominio para la configuracion del registro único.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ConfRegistrounico extends BaseConfRegistrounico
{
    public function setUp()
    {
        parent:: setUp();
    }
    public function obtenerPorId($idregistrounico)
    {
        return Doctrine::getTable('ConfRegistrounico')->find($idregistrounico);
    }
}