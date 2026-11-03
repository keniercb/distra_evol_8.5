<?php

/**
 * @name SegGrupoModel - Clase de negocio de grupos.
 * @package seguridad
 * @copyright UCID
 * @author Darien García Tejo.
 * @version 2.0-0
 */
class SegGrupoModel extends ZendExt_Model
{

    /**
     * @method SegGrupoModel - Constructor de la clase.
     */
    public function init()
    {
        parent::ZendExt_Model();
    }

    /**
     * @method insertar - Función usada para adicionar un rol.
     * @param string $denominacion - Denominación del rol.
     * @param string $descripcion - Descripción del rol.
     * @param string $abreviatura - Abreviatura del rol.
     * @param array $sistfun - Arreglo de identificadores de funcionalidades.
     * @param array $sistemas - Arreglo de identificadores de sistemas.
     * @param array $arrayGrupos - Arreglo de identificadores de grupos.
     * @return void.
     */
    public static function insertar(
        $denominacion, $descripcion, $abreviatura, $sistfun, 
        $sistemas, $arrayGrupos
    )
    {        
        $rol = new SegRol();
        $rol->denominacion = $denominacion;
        $rol->descripcion = $descripcion;
        $rol->abreviatura = $abreviatura;
        $rol->grupo = TRUE;
        $rol->save();
        $objRolDominio = new SegRolNomDominio();
        $objRolDominio->idrol = $rol->idrol;
        $objRolDominio->iddominio = SegUtil::getPerfil()->iddominio;
        $objRolDominio->save();
        foreach ($sistemas as $valorsist) {
            $rolSist = new DatSistemaSegRol();
            $rolSist->idsistema = $valorsist;
            $rolSist->idrol = $rol->idrol;
            $rolSist->save();
        }
        foreach ($sistfun as $valorsistfun) {
            foreach ($valorsistfun[1] as $fun) {
                $sistemaRolFun = new DatSistemaSegRolDatFuncionalidad();
                $sistemaRolFun->idfuncionalidad = $fun;
                $sistemaRolFun->idrol = $rol->idrol;
                $sistemaRolFun->idsistema = $valorsistfun[0];
                $sistemaRolFun->save();
                $arrayacciones = DatAccion::cargarRecursosAdd($fun);
                if (count($arrayacciones) > 0) {
                    foreach ($arrayacciones as $accion) {
                        $objaccion = 
                            new DatSistemaSegRolDatFuncionalidadDatAccion();
                        $objaccion->idfuncionalidad = $fun;
                        $objaccion->idrol = $rol->idrol;
                        $objaccion->idsistema = $valorsistfun[0];
                        $objaccion->idaccion = 
                            $accion->DatFuncionalidadDatAccion[0]->idaccion;
                        $objaccion->idrecurso = 
                            $accion->DatFuncionalidadDatAccion[0]->idrecurso;
                        $objaccion->save();
                    }
                }
            }
        }
    }

    public static function insertarRol(
        $denominacion, $descripcion, $abreviatura, $sistfun, $sistemas, 
        $arrayGrupos, $arraypadres
    )
    {        
        $rol = new SegRol();
        $rol->denominacion = $denominacion;
        $rol->descripcion = $descripcion;
        $rol->abreviatura = $abreviatura;
        $rol->grupo = TRUE;
        $rol->save();
        $objRolDominio = new SegRolNomDominio();
        $objRolDominio->idrol = $rol->idrol;
        $objRolDominio->iddominio = SegUtil::getPerfil()->iddominio;
        $objRolDominio->save();

        self::sistemasAddConsultaConstruida(array(), $sistemas, $rol->idrol);
        self::funcionalidadesAddConsultaConstruida($sistfun, $rol->idrol);

        if (count($arraypadres))
            self::addPermisosSistemasPadres($rol->idrol, $arraypadres);
    }

    /**
     * @method modificar - Función usada para modificar un grupo.
     * @param integer $idrol - Identificador del rol.
     * @param string $denominacion - Denominación del rol.
     * @param string $abreviatura - Abreviatura del rol.
     * @param string $descripcion - Descripción del rol.
     * @param array $sistfun - Arreglo de identificadores de funcionalidades.
     * @param array $sistemas - Arreglo de identificadores de sistemas.
     * @param array $arrayeliminar - Arreglo de identificadores de sistemas 
     * a eliminar.
     * @param array $arrayGrupos - Arreglo de identificadores de grupos.
     * @param array $arrayGruposAdd - Arreglo grupos a adicionar.
     * @param array $arrayGruposDel - Arreglo grupos a eliminar.
     * @return void
     */
    public static function modificar(
        $idrol, $denominacion, $descripcion, $abreviatura, $sistfun, $sistemas, 
        $arrayeliminar, $arrayGrupos, $arrayGruposAdd, $arrayGruposDel
    )
    {
        $rolMod = Doctrine::getTable('SegRol')->find($idrol);
        $rolMod->denominacion = $denominacion;
        $rolMod->abreviatura = $abreviatura;
        $rolMod->descripcion = $descripcion;
        $rolMod->save();
        if (count($arrayeliminar) > 0) {
            foreach ($arrayeliminar as $valor) {
                $arrayPadreEliminar = SegUtil::convertToUnidimensional(
                    DatSistema::getSistemasPadres($valor), 'idsistema'
                );
                DatSistemaSegRol::eliminarRelacionRolSistema(
                    $idrol, $arrayPadreEliminar
                );
            }
        }
        if (count($sistfun) > 0)
            self::funcionalidadesElim($sistfun, $idrol);
        self::sistemasAdd(
            DatSistemaSegRol::sistemasdadorol($idrol), $sistemas, $idrol
        );
        self::funcionalidadesAdd($sistfun, $idrol);
        return;
    }

    public static function modificarRol(
    $idrol, $denominacion, $descripcion, $abreviatura, $sistfun, $sistemas,
        $arrayGruposAdd, $arrayGruposDel, $sistPadresAdd, $sistPadresElim
    )
    {
        $rolMod = Doctrine::getTable('SegRol')->find($idrol);
        $rolMod->denominacion = $denominacion;
        $rolMod->abreviatura = $abreviatura;
        $rolMod->descripcion = $descripcion;
        $rolMod->save();
        if (count($sistfun) > 0)
            self::funcionalidadesElim($sistfun, $idrol);
        self::sistemasAddConsultaConstruida(
            DatSistemaSegRol::sistemasdadorol($idrol), $sistemas, $idrol
        );
        self::funcionalidadesAddConsultaConstruida($sistfun, $idrol);
        if (count($sistPadresAdd))
            self::addPermisosSistemasPadres($idrol, $sistPadresAdd);
        if (count($sistPadresElim))
            self::elimPermisosSistemasPadres($idrol, $sistPadresElim);
        return;
    }

    private static function addPermisosSistemasPadres($idrol, $sistPadresAdd)
    {
        if (count($sistPadresAdd)) {
            self::sistemasAddConsultaConstruida(
                array(), $sistPadresAdd, $idrol
            );
            foreach ($sistPadresAdd as $sistema) {
                $funcionalidades = DatFuncionalidad::idsFuncionalidadesCompart(
                    $sistema
                );
                if (count($funcionalidades)) {
                    $funcionalidades = SegUtil::convertToUnidimensional(
                        $funcionalidades, 'idfuncionalidad'
                    );
                    $sistFun = array();
                    $sistFun[] = $sistema;
                    $sistFun[] = $funcionalidades;
                    self::funcionalidadesAddConsultaConstruida(
                        array($sistFun), $idrol
                    );
                }
                $sistemasHijos = SegUtil::convertToUnidimensional(
                    DatSistema::sistemasHijosDadoIdSistema($sistema),
                    'idsistema'
                );
                if (count($sistemasHijos)) {
                    self::addPermisosSistemasPadres($idrol, $sistemasHijos);
                }
            }
        } else {
            return;
        }
    }

    private static function elimPermisosSistemasPadres($idrol, $sistPadresElim)
    {

        foreach ($sistPadresElim as $sistema) {
            $funcionalidades = DatFuncionalidad::idsFuncionalidadesCompart(
                $sistema
            );
            if (count($funcionalidades)) {
                $funcionalidades = SegUtil::convertToUnidimensional(
                    $funcionalidades, 'idfuncionalidad'
                );
                self::funcionalidadesElim($funcionalidades, $idrol);
            }
            $sistemasHijos = SegUtil::convertToUnidimensional(
                DatSistema::sistemasHijosDadoIdSistema($sistema), 
                'idsistema'
            );
            if (count($sistemasHijos)) {
                self::elimPermisosSistemasPadres($idrol, $sistemasHijos);
            }
        }
        if (count($sistPadresElim))
            DatSistemaSegRol::eliminarRelacionRolSistema(
                $idrol, $sistPadresElim
            );
        return;
    }

    /**
     * @method eliminar - Función usada para eliminar uno o varios roles.
     * @param array $arrayDel - Listado de identificadores de roles.
     * @return string
     */
    public static function eliminar($arrayDel)
    {
        if (count($arrayDel)) {
            $arrayRolUso = SegUtil::convertToUnidimensional(
                SegRolGrupo::ObtenerGruposEnUso($arrayDel), 'idgrupo'
            );
            if (count($arrayRolUso) > 0) {
                $nodesElim = array();
                $nodesElim = array_diff($arrayDel, $arrayRolUso);
                if (count($nodesElim) > 0)
                    SegRol::eliminarArrayRoles($nodesElim);
                return '{cod: 8}';
            } else {
                SegRol::eliminarArrayRoles($arrayDel);
                return "{'cod': 1}";
            }
        }
    }

    /**
     * @method cargarGridGrupos - Función usada para cargar el grid de grupos.
     * @param integer $start - Inicio.
     * @param integer $limit - Límite.
     * @return array
     */
    public static function cargarGridGrupos($start, $limit, $idrol)
    {
        $iddominio = SegUtil::getPerfil()->iddominio;
        return array(
            'cantidad_filas' => SegRol::cantidadFilasGrupos($iddominio), 
            'datos' => SegRol::cargarGridGrupos(
                $start, $limit, $iddominio, $idrol
            )
        );
    }

    private static function sistemasAdd($arrayGeneral, $arrayNuevo, $idrol)
    {
        $result = array();
        $arraySist = SegUtil::convertToUnidimensional(
            $arrayGeneral, 'idsistema'
        );
        $arrayInsertar = array_diff($arrayNuevo, $arraySist);
        if (count($arrayInsertar) > 0) {
            foreach ($arrayInsertar as $idsistema) {
                $rolSist = new DatSistemaSegRol();
                $rolSist->idsistema = $idsistema;
                $rolSist->idrol = $idrol;
                $rolSist->save();
            }
        }
        return $result;
    }

    private static function sistemasAddConsultaConstruida(
        $arrayGeneral, $arrayNuevo, $idrol
    )
    {
        $result = array();
        $arraySist = SegUtil::convertToUnidimensional(
            $arrayGeneral, 'idsistema'
        );
        $arrayInsertar = array_diff($arrayNuevo, $arraySist);
        $sql = '';
        if (count($arrayInsertar) > 0) {
            $sql .= "INSERT INTO mod_seguridad.dat_sistemarol"
                . "(idrol, idsistema) VALUES";
            foreach ($arrayInsertar as $idsistema) {
                $sql .= "({$idrol}, {$idsistema}),";
            }
        }
        if ($sql != '') {
            $sql[strlen($sql) - 1] = ';';
            Doctrine_Manager::getInstance()->getCurrentConnection()
                ->execute($sql);
        }
        return $result;
    }

    private static function funcionalidadesAdd($arraysistfun, $idrol)
    {
        $arrayfuncionalidades = array();
        foreach ($arraysistfun as $valor) {
            $arrayfuncionalidades = SegUtil::convertToUnidimensional(
                DatSistemaSegRolDatFuncionalidad::obtenerfunrol(
                    $idrol, $valor[0]
                ), 'idfuncionalidad'
            );
            $arrayfuncionalidades =array_diff($valor[1], $arrayfuncionalidades);
            if (count($arrayfuncionalidades) > 0) {
                foreach ($arrayfuncionalidades as $idfuncionalidad) {
                    $rolSistFunc = new DatSistemaSegRolDatFuncionalidad();
                    $rolSistFunc->idsistema = $valor[0];
                    $rolSistFunc->idrol = $idrol;
                    $rolSistFunc->idfuncionalidad = $idfuncionalidad;
                    $rolSistFunc->save();
                    $arrayacciones = DatAccion::cargarRecursosAdd(
                        $idfuncionalidad
                    );
                    if (count($arrayacciones)) {
                        foreach ($arrayacciones as $accion) {
                            foreach (
                                $accion->DatFuncionalidadDatAccion as $val
                            ) {
                                $objacc = new DatSistemaSegRolDatFuncionalidadDatAccion();
                                $objacc->idfuncionalidad = $idfuncionalidad;
                                $objacc->idrol = $idrol;
                                $objacc->idsistema = $valor[0];
                                $objacc->idaccion = $val->idaccion;
                                $objacc->idrecurso = $val->idrecurso;
                                $objacc->save();
                            }
                        }
                    }
                }
            }
        }
    }

    private static function funcionalidadesAddConsultaConstruida(
        $arraysistfun, $idrol
    )
    {
        $arrayfuncionalidades = array();
        $sqlfun = "";
        $sqlacc = "";
        $tieneFun = false;
        $tieneAcc = false;
        if (count($arraysistfun) != 0) {
            $sqlfun.=" INSERT INTO mod_seguridad.dat_sistemarolfuncionalidad"
                . "(idfuncionalidad, idrol, idsistema) VALUES ";
            $sqlacc.= " INSERT INTO "
                . "mod_seguridad.dat_sistemarolfuncionalidadaccion"
                . "(idaccion, idfuncionalidad, idrol, idsistema, idrecurso) "
                . "VALUES ";
        }
        foreach ($arraysistfun as $valor) {
            $arrayfuncionalidades = SegUtil::convertToUnidimensional(
                DatSistemaSegRolDatFuncionalidad::obtenerfunrol(
                    $idrol, $valor[0]
                ), 'idfuncionalidad'
            );
            $arrayfuncionalidades = array_diff(
                $valor[1], $arrayfuncionalidades
            );
            if (count($arrayfuncionalidades) > 0) {
                foreach ($arrayfuncionalidades as $idfuncionalidad) {
                    $tieneFun = true;
                    $sqlfun.=" ({$idfuncionalidad}, {$idrol}, {$valor[0]}),";
                    $arrayacciones = DatAccion::
                        cargarRecursosAdd($idfuncionalidad);
                    if (count($arrayacciones)) {
                        foreach ($arrayacciones as $accion) {
                            foreach ($accion
                                ->DatFuncionalidadDatAccion as $values) {
                                $tieneAcc = true;
                                $sqlacc.= " ({$values->idaccion}, "
                                . "{$idfuncionalidad}, {$idrol}, "
                                . "{$valor[0]}, "
                                . "{$values->idrecurso}),";
                            }
                        }
                    }
                }
            }
        }
        $sqlfun[strlen($sqlfun) - 1] = ';';
        $sqlacc[strlen($sqlacc) - 1] = ';';
        if ($tieneFun) {
            Doctrine_Manager::getInstance()->getCurrentConnection()
                ->execute($sqlfun);
        }
        if ($tieneAcc) {
            Doctrine_Manager::getInstance()->getCurrentConnection()
                ->execute($sqlacc);
        }
        return;
    }

    private static function funcionalidadesElim($arraysistfun, $idrol)
    {        
        foreach ($arraysistfun as $valor) {
            $arrayfuncionalidades = DatSistemaSegRolDatFuncionalidad::
                obtenerfunrol($idrol, $valor[0]);
            foreach ($arrayfuncionalidades as $arrFunc) {
                if (array_search(
                    $arrFunc['idfuncionalidad'], $valor[1]
                ) === false
                ) {
                    DatSistemaSegRolDatFuncionalidad::eliminarfuncionalidad(
                        $idrol, 
                        $arrFunc['idfuncionalidad'], 
                        $arrFunc['idsistema']
                    );
                }
            }
        }
    }

}
