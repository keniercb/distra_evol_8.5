<?php

/**
 * Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class DatGraficaUsuario extends BaseDatGraficaUsuario
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatGrafica', array('local' => 'idgrafica', 'foreign' => 'idgrafica'));
    }

    /**
     * Inserta una nueva grafica por defecto por cada usuario.
     *
     * @param $idgrafica
     * @param $idusuario
     *
     * @return bool
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($idgrafica, $idusuario)
    {
        $defecto = new DatGraficaUsuario();
        $defecto->idgrafica = $idgrafica;
        $defecto->idusuario = $idusuario;
        $defecto->save();
        return TRUE;
    }

    /**
     * Elimina las graficas insertadas por defecto.
     *
     * @param $idusuario
     *
     * @return bool
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     * @copyright Copyright (c) 2013 xetid
     */
    public function eliminar($idusuario)
    {
        $query = Doctrine_Query::create();
        $result = $query->delete('DatGraficaUsuario')->where("idusuario = $idusuario")->execute();
        return $result;
    }

    /**
     * @param $idGrafica
     * @param $idUsuario
     *
     * @return int
     */
    public static function porDefecto($idGrafica, $idUsuario)
    {
        $obj = Doctrine::getTable('DatGraficaUsuario')->find(array($idGrafica, $idUsuario));
        return is_object($obj) ? 1 : 0;
    }
}