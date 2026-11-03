<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class DatConceptoCondicion extends BaseDatConceptoCondicion
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
             'DatUsuarioConcepto', array('local' => 'idusuarioconcepto', 'foreign' => 'idusuarioconcepto')
        );
        $this->hasOne('NomOrgano', array('local' => 'idorgano', 'foreign' => 'idorgano'));
        $this->hasOne('NomOrgano', array('local' => 'idconcepto', 'foreign' => 'idconcepto'));
    }

    /**
     * Inserta una nueva grafica por defecto por cada usuario.
     *
     * @param $idconceptopropiedad
     * @param $organos
     * @param $idconcepto
     *
     * @return bool
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($idconceptopropiedad, $organos, $idconcepto)
    {
        foreach ($organos as $value) {
            $objeto = new NomConceptoCondicion();
            $objeto->idconceptopropiedad = $idconceptopropiedad;
            $objeto->idorgano = $value['idorgano'];
            $objeto->idconcepto = $idconcepto;
            $objeto->save();
        }

        return true;
    }

    /**
     * @param $idusuarioconcepto
     *
     * @internal param $idusuario
     * @return bool
     */
    public function eliminar($idusuarioconcepto)
    {
        $query = Doctrine_Query::create();
        $permisos = $query->delete('DatConceptoCondicion')->where("idusuarioconcepto = $idusuarioconcepto")->execute();
        if ($permisos) {
            return true;
        }

        return false;
    }

    /**
     * @param $idusuarioconcepto
     *
     * @return bool
     */
    static function tieneCondiciones($idusuarioconcepto)
    {
        $query = Doctrine_Query::create();
        $haveRestriction = $query->from('DatConceptoCondicion')->where("idusuarioconcepto = $idusuarioconcepto")
                                 ->execute()->count();

        return $haveRestriction > 0;
    }

    /**
     * @param $idrestriccion
     * @param $idconcepto
     *
     * @return Doctrine_Collection|null
     */
    public function obtenerPermisosByConcepto($idrestriccion, $idconcepto)
    {
        $haveRestriction = self::tieneRestricciones();
        if ($haveRestriction) {
            $query = Doctrine_Query::create();
            $permisos = $query->from('DatConceptoCondicion')->where(
                              "idusuarioconcepto = $idrestriccion AND idconcepto = " . $idconcepto['idconcepto']
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

            return $permisos;
        } else {
            return null;
        }
    }

    /**
     * @param $idconcepto
     * @param $idusuarioconcepto
     *
     * @return array
     */
    public function dameTodos($idconcepto, $idusuarioconcepto)
    {
        $query = Doctrine_Query::create();
        $condiciones = $query->select("dcc.idconceptocondicion as idconceptocondicion")->addSelect(
                             "nc.denominacion as denominacion, nc,abreviatura as abreviatura"
        )->addSelect("nc.idorgano as id")->from('DatConceptoCondicion dcc')->innerJoin(
                             "dcc.NomConcepto nc WTH nc.idconcepto = $idconcepto"
            )->where("idusuarioconcepto = $idusuarioconcepto")->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $condiciones;
    }
}