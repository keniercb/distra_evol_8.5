<?php

/**
 * Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class DatUsuarioConcepto extends BaseDatUsuarioConcepto
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomConcepto', array('local' => 'idconcepto', 'foreign' => 'idconcepto'));
    }

    /**
     * Inserta una nueva grafica por defecto por cada usuario.
     *
     * @param $conceptos
     * @param $idusuario
     *
     * @return bool
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($idusuario, $conceptos)
    {
        foreach ($conceptos as $value) {
            $objeto = new DatUsuarioConcepto();
            $objeto->idusuario = $idusuario;
            $objeto->idconcepto = $value->idconcepto;
            $objeto->ver = $value->ver;
            $objeto->adicionar = $value->adicionar;
            $objeto->modificar = $value->modificar;
            $objeto->eliminar = $value->eliminar;
            $objeto->editar = $value->editar;
            $objeto->deshacer = $value->deshacer;
            if ($value->tipos != "") {
                $objeto->tipo = implode(',', $value->tipos);
            }
            $objeto->save();
        }

        return true;
    }

    /**
     * @param $idusuario
     *
     * @return bool
     */
    public function eliminar($idusuario)
    {
        $query = Doctrine_Query::create();
        $permisos = $query->delete('DatUsuarioConcepto')->where("idusuario = $idusuario")->execute();
        if ($permisos) {
            return true;
        }

        return false;
    }

    /**
     * @return bool
     */
    static function tieneRestricciones()
    {
        $perfil = Util::getPerfilGlobal();
        $idusuario = $perfil->idusuario;
        $query = Doctrine_Query::create();
        $haveRestriction = $query->from('DatUsuarioConcepto')->where("idusuario = $idusuario")->execute()->count();

        return $haveRestriction > 0;
    }

    /**
     * @return bool
     */
    static function tieneRestriccionesTipos($idconcepto)
    {
        $perfil = Util::getPerfilGlobal();
        $idusuario = $perfil->idusuario;
        $query = Doctrine_Query::create();
        $haveRestriction = $query->select('tipo')->from('DatUsuarioConcepto')->where(
                                 "idusuario = ? and idconcepto = ?", array($idusuario, $idconcepto)
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $haveRestriction;
    }

    /**
     * @param $idconcepto
     *
     * @return Doctrine_Collection|null
     */
    public function obtenerPermisosByConcepto($idconcepto)
    {
        $perfil = Util::getPerfilGlobal();
        $idusuario = $perfil->idusuario;
        $haveRestriction = self::tieneRestricciones();
        if ($haveRestriction) {
            $query = Doctrine_Query::create();
            $permisos = $query->from('DatUsuarioConcepto')->where(
                              "idusuario = $idusuario AND idconcepto = " . $idconcepto['idconcepto']
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

            return $permisos;
        } else {
            return null;
        }
    }

    /**
     * @param $idusuario
     *
     * @return array
     */
    public function dameTodos($idusuario)
    {
        $modelConceptos = new NomConcepto();
        $conceptos = $modelConceptos->dameTodos('c.idconcepto <> 0');
        foreach ($conceptos as $index => $concepto) {
            $query = Doctrine_Query::create();
            $permisos = $query->select('*,tipo as idtipos ')->from('DatUsuarioConcepto')->where(
                              "idusuario = $idusuario AND idconcepto = " . $concepto['idconcepto']
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            $idPermiso = 0;
            $ver = 0;
            $adicionar = 0;
            $modificar = 0;
            $eliminar = 0;
            $editar = 0;
            $deshacer = 0;
            $todo = 0;
            $idtipos = "";
            $tipos = "";
            if (count($permisos)) {
                $idPermiso = (int) $permisos[0]['idusuarioconcepto'];
                $ver = (int) $permisos[0]['ver'];
                $adicionar = (int) $permisos[0]['adicionar'];
                $modificar = (int) $permisos[0]['modificar'];
                $eliminar = (int) $permisos[0]['eliminar'];
                $editar = (int) $permisos[0]['editar'];
                $idtipos = $permisos[0]['idtipos'];
                $tipos = $permisos[0]['tipos'];
                $deshacer = (int) $permisos[0]['deshacer'];
                $todo = ((int) $ver && (int) $adicionar && (int) $modificar && (int) $eliminar &&
                    (int) $editar) ? 1 : 0;
            }
            $conceptos[$index]['idusuarioconcepto'] = $idPermiso;
            $conceptos[$index]['todo'] = $todo;
            $conceptos[$index]['ver'] = $ver;
            $conceptos[$index]['adicionar'] = $adicionar;
            $conceptos[$index]['modificar'] = $modificar;
            $conceptos[$index]['eliminar'] = $eliminar;
            $conceptos[$index]['editar'] = $editar;
            $conceptos[$index]['deshacer'] = $deshacer;
            $conceptos[$index]['idtipos'] = ($idtipos != "") ? $arrayIdTipos = explode(',', $idtipos) : $idtipos;;
            $conceptos[$index]['tipos'] = ($idtipos != "") ? $this->switchConceptos(
                                                                  $concepto['idconcepto'], $arrayIdTipos
            ) : $tipos;
        }

        return $conceptos;
    }

    function switchConceptos($idconcepto, $tipos)
    {
        switch ($idconcepto){
            case 9:
                return $this->obtenerDenominacionesTipos($tipos);
                break;
            default:
                return $this->obtenerDenominacionesTipos($tipos, $idconcepto);
                break;
        }
        return "";
    }

    private function obtenerDenominacionesTipos($tipos, $idConcepto = false)
    {
        $organo = new NomOrgano();
        $nomTipo = new NomTipomedio();
        $denominacion = "";
        foreach ($tipos as $index => $id) {
            if ($idConcepto) {
                if ($index == 0) {
                    $denominacion = $organo->getDenominacionByConcepto($idConcepto, $id)[0]['denominacion'];
                } else {
                    $denominacion .= ', ' . $organo->getDenominacionByConcepto($idConcepto, $id)[0]['denominacion'];
                }
            } else {
                if ($index == 0) {
                    $denominacion = $nomTipo->getDenominacion($id)[0]['denominacion'];
                } else {
                    $denominacion .= ', ' . $nomTipo->getDenominacion($id)[0]['denominacion'];
                }
            }
        }

        return $denominacion;
    }
}