<?php
/**
 * @name ConfEstructuraconcepto - Clase del dominio para la configuracion de de estructuras por conceptos.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ConfEstructuraconcepto extends BaseConfEstructuraconcepto
{
    public function setUp()
    {
        parent:: setUp();
    }
    public function obtenerConfEstructuraConcepto()
    {
        $query = new Doctrine_Query();
        $result = $query->select('c.*')->from('ConfEstructuraconcepto c')->execute();
        return $result->toArray();
    }
    public function obtenerPorId($idestructconcepto)
    {
        return Doctrine::getTable('ConfEstructuraconcepto')->find($idestructconcepto);
    }
}