<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class NomConcepto extends BaseNomConcepto
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomOrgano', array('local' => 'idconcepto', 'foreign' => 'idconcepto'));
        $this->hasMany('NomCampoestruc', array('local' => 'idconcepto', 'foreign' => 'idconcepto'));
        $this->hasMany('NomRelacion', array('local' => 'idconcepto', 'foreign' => 'idhijo'));
        $this->hasMany('NomRelacion', array('local' => 'idconcepto', 'foreign' => 'idpadre'));
        $this->hasMany('NomFilaestruc', array('local' => 'idconcepto', 'foreign' => 'idconcepto'));
        $this->hasMany('DatEstructura', array('local' => 'idconcepto', 'foreign' => 'idconcepto'));
        $this->hasMany('DatEstructuraop', array('local' => 'idconcepto', 'foreign' => 'idconcepto'));
        $this->hasOne('NomIcono', array('local' => 'idicono', 'foreign' => 'idicono'));
    }

    /**
     * Obtiene la lista de todos los conceptos existentes
     *
     * @author    : Ing.Osvaldo Gonzalez
     *
     * @param string $where
     *
     * @return array Retorna un arreglo con todos los datos de los conceptos
     * @copyright Copyright (c) 2013 xetid
     */
    public static function dameTodos($where = '1=1')
    {
        $query = new Doctrine_Query();
        $result = $query->select('c.denominacion as text, c.*, i.denominacion as nombre_imagen, i.icono as icon')->from(
                        'NomConcepto c'
        )->innerJoin('c.NomIcono i')->addWhere($where)->orderBy('c.orden')->setHydrationMode(
                        Doctrine :: HYDRATE_ARRAY
            )->execute();

        return $result;
    }
}