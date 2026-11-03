<?php
/**
 * @name ConfEstructuraconcepto - Clase del dominio para la configuracion de de estructuras por conceptos.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ConfCategOcupacionales extends BaseConfCategOcupacionales
{
    public function setUp()
    {
        parent:: setUp();
    }
    public function getCategoriasOcup()
    {
        $query = "SELECT cat.idcategocup, cat.denominacion,conf.idcategoriareporte,conf.idmapeocategocup, conf.idcategoriareporteresumenmov
                  FROM mod_estructuracomp.nom_categocup AS cat
                  LEFT JOIN mod_rrhhmaestro.conf_mapeocategocup AS conf ON(cat.idcategocup=conf.idcategocup)";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($query);
    }
    public function obtenerPorId($id)
    {
        return Doctrine::getTable('ConfCategOcupacionales')->find($id);
    }

}