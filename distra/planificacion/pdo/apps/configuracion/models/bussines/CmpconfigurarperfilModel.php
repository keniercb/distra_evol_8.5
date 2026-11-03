<?php

/**
 * @author    Jesus Ariel Guerra Lopez
 * @version   3.0.0
 * @copyright XETID, ERP-CUBA
 */
class CmpconfigurarperfilModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function adicionarPerfilCargaxDefecto($params)
    {
        if ($params->accion == 'Modificar') {            
            if (ConfPerfilcargasxdefecto::comprobardenominacion($params, 1)) {
                return 0;
            }
        } else {
            if (ConfPerfilcargasxdefecto::comprobardenominacion($params, 1)) {
                return 0;
            }
        }
        if ($params->accion == 'Modificar') {
            $obj = Doctrine::getTable('ConfPerfil')->find(
                $params->idconfiguracionperfil
            );
        } else {
            $obj = new ConfPerfil();
        }
        $obj->denominacion = $params->denominacion;
        $obj->actual = $params->actual;
        if (isset($params->estadoaprob) && $params->estadoaprob != '') {
            $obj->estadoaprobacion = $params->estadoaprob;
        } else {
            $obj->estadoaprobacion = null;
        }
        if (isset($params->porcientocump) && $params->porcientocump != '') {
            $obj->porcientocumplimiento = $params->porcientocump;
            $objCondicion = new NomComparacion();
            $objCondicion->igual = $params->igual;
            $objCondicion->mayor = $params->mayor;
            $objCondicion->menor = $params->menor;
            $objCondicion->save();
            $obj->idcomparacion = $objCondicion->idcomparacion;
        }
        if (isset($params->estadocump) && $params->estadocump != '') {
            $obj->estadocumplimiento = $params->estadocump;
        } else {
            $obj->estadocumplimiento = null;
        }
        if (isset($params->descripcion) && $params->descripcion != '') {
            $obj->descripcion = $params->descripcion;
        }
        $obj->fechacreacion = date("d/m/Y");
        $obj->idautor = $params->idusuario;
        $obj->save();
        if ($params->accion != 'Modificar') {
            foreach ($params->tipoelemento as $value) {
                if ($params->actual == 1) {
                    ConfPerfilcargasxdefecto::comprobarConfigActualCargaxDefecto(
                        $value
                    );
                }
                $objcargaxdefecto = new ConfPerfilcargasxdefecto();
                $objcargaxdefecto->idconfiguracionperfil
                    = $obj->idconfiguracionperfil;
                if (isset($params->fechainicio) && $params->fechainicio != '') {
                    $objcargaxdefecto->fechainicio = $params->fechainicio;
                }
                if (isset($params->fechafin) && $params->fechafin != '') {
                    $objcargaxdefecto->fechafin = $params->fechafin;
                }
                $objcargaxdefecto->idtipoelemento = $value;
                $objcargaxdefecto->actual = $params->actual;
                $objcargaxdefecto->save();
            }
        } else {
            foreach ($params->tipoelemento as $value) {
                if ($params->actual == 1) {
                    ConfPerfilcargasxdefecto::comprobarConfigActualCargaxDefecto(
                        $value
                    );
                }
                $objcargaxdefecto = Doctrine::getTable(
                    'ConfPerfilcargasxdefecto'
                )->findByDql(
                    "idconfiguracionperfil = $params->idconfiguracionperfil AND idtipoelemento = $value"
                );
                $objcargaxdefecto[0]->idconfiguracionperfil
                    = $params->idconfiguracionperfil;
                if (isset($params->fechainicio) && $params->fechainicio != '') {
                    $objcargaxdefecto[0]->fechainicio = $params->fechainicio;
                }
                if (isset($params->fechafin) && $params->fechafin != '') {
                    $objcargaxdefecto[0]->fechafin = $params->fechafin;
                }
                $objcargaxdefecto[0]->idtipoelemento = $value;
                $objcargaxdefecto[0]->actual = $params->actual;
                $objcargaxdefecto[0]->save();
            }
            foreach ($params->tipoelementodelete as $value) {
                $objcargaxdefecto = Doctrine::getTable(
                    'ConfPerfilcargasxdefecto'
                )->findByDql(
                    "idconfiguracionperfil = $params->idconfiguracionperfil and idtipoelemento = $value"
                );
                if ($objcargaxdefecto[0]->idconfiguracionperfil != null) {
                    $objcargaxdefecto[0]->delete();
                }
            }
        }
        return 1;
    }

    public function adicionarPerfilCalendario($params)
    {
        if ($params->accion == 'Modificar') {           
            if (ConfPerfilcargasxdefecto::comprobardenominacion($params, 2)) {
                return 0;
            }
        } else {
            if (ConfPerfilcargasxdefecto::comprobardenominacion($params, 2)) {
                return 0;
            }
        }
        if ($params->accion == 'Modificar') {
            $obj = Doctrine::getTable('ConfPerfil')->find(
                $params->idconfiguracionperfil
            );
        } else {
            $obj = new ConfPerfil();
        }
        $obj->denominacion = $params->denominacion;
        if ($params->actual == 1 && $params->accion == 'Modificar') {
            ConfPerfilcalendario::actualizarActualCalendarA(
                $params->idconfiguracionperfil
            );
        } else {
            if ($params->actual == 1 && $params->accion == 'Adicionar') {
                ConfPerfilcalendario::actualizarActualCalendar(
                    $params->idconfiguracionperfil
                );
            }
        }
        $obj->actual = $params->actual;
        if (isset($params->estadoaprob) && $params->estadoaprob != '') {
            $obj->estadoaprobacion = $params->estadoaprob;
        } else {
            $obj->estadoaprobacion = null;
        }
        if (isset($params->porcientocump) && $params->porcientocump != '') {
            $obj->porcientocumplimiento = $params->porcientocump;
            $objCondicion = new NomComparacion();
            $objCondicion->igual = $params->igual;
            $objCondicion->mayor = $params->mayor;
            $objCondicion->menor = $params->menor;
            $objCondicion->save();
            $obj->idcomparacion = $objCondicion->idcomparacion;
        }
        if (isset($params->estadocump) && $params->estadocump != '') {
            $obj->estadocumplimiento = $params->estadocump;
        } else {
            $obj->estadocumplimiento = null;
        }
        if (isset($params->descripcion) && $params->descripcion != '') {
            $obj->descripcion = $params->descripcion;
        }
        $obj->fechacreacion = date("d/m/Y");
        $obj->idautor = $params->idusuario;
        $obj->save();
        if ($params->accion == 'Modificar') {
            $objcalendario = Doctrine::getTable('ConfPerfilcalendario')
                ->findByDql(
                    "idconfiguracionperfil = $params->idconfiguracionperfil"
                );
            /*$objcalendarioinv = Doctrine::getTable('DatConfperfilcalendarioUsuariosinvolucrados')->
            findByDql("idconfiguracionperfil = $obj->idconfiguracionperfil");*/
            if ($objcalendario[0]->idconfiguracionperfil != null) {
                //$objcalendario[0]->idconfiguracionperfil = $obj->idconfiguracionperfil;
                if (isset($params->tipoactividad)
                    && $params->tipoactividad != ''
                ) {
                    $objcalendario[0]->idtipoactividad = $params->tipoactividad;
                } else {
                    $objcalendario[0]->idtipoactividad = null;
                }
                if (isset($params->cateactividad)
                    && $params->cateactividad != ''
                ) {
                    $objcalendario[0]->idcategoriaactividad
                        = $params->cateactividad;
                } else {
                    $objcalendario[0]->idcategoriaactividad = null;
                }
                if (isset($params->vista) && $params->vista != '') {
                    $objcalendario[0]->idvistaxdefecto = $params->vista;
                } else {
                    $objcalendario[0]->idvistaxdefecto = null;
                }
                $model = new ConfPerfilModel();
                if (isset($params->usuarioseliminar[0])) {
                    $model->EliminarInvolucradosAConfiguracion(
                        $params->usuarioseliminar,
                        $params->idconfiguracionperfil, 'calendario'
                    );
                }
                $objcalendario[0]->save();
                if (isset($params->usuariosinv[0])) {
                    foreach ($params->usuariosinv as $value) {
                        $idinvolucrado = ($value->tipo != 0) ? $value->idusuario
                            : $value->idgrupo;
                        $existe = Doctrine::getTable(
                            'DatConfperfilcalendarioUsuariosinvolucrados'
                        )->findByDql(
                            "idconfiguracionperfil = $params->idconfiguracionperfil AND idinvolucrado = $idinvolucrado",
                            null,
                            Doctrine::HYDRATE_ARRAY
                        );
                        if (count($existe) == 0) {
                            $objcalendarioinv
                                = new DatConfperfilcalendarioUsuariosinvolucrados(
                            );
                            $objcalendarioinv->idconfiguracionperfil
                                = $objcalendario[0]->idconfiguracionperfil;
                            $objcalendarioinv->idinvolucrado = $idinvolucrado;
                            $objcalendarioinv->idtipo = $value->tipo;
                            $objcalendarioinv->save();
                        }
                    }
                }
            }
        } else {
            $objcalendario = new ConfPerfilcalendario();
            $objcalendario->idconfiguracionperfil = $obj->idconfiguracionperfil;
            if (isset($params->tipoactividad) && $params->tipoactividad != '') {
                $objcalendario->idtipoactividad = $params->tipoactividad;
            }
            if (isset($params->cateactividad) && $params->cateactividad != '') {
                $objcalendario->idcategoriaactividad = $params->cateactividad;
            }
            if (isset($params->vista) && $params->vista != '') {
                $objcalendario->idvistaxdefecto = $params->vista;
            }
            $objcalendario->save();           
            if (isset($params->usuariosinv[0])) {
                foreach ($params->usuariosinv as $value) {
                    $objcalendarioinv
                        = new DatConfperfilcalendarioUsuariosinvolucrados();
                    $objcalendarioinv->idconfiguracionperfil
                        = $obj->idconfiguracionperfil;
                    $objcalendarioinv->idinvolucrado = ($value->tipo != 0)
                        ? $value->idusuario : $value->idgrupo;
                    $objcalendarioinv->idtipo = $value->tipo;
                    $objcalendarioinv->save();
                }
            }
        }
        return 1;
    }

    public function adicionarPerfilComportamiento($params)
    {
        if ($params->accion == 'Modificar') {           
            if (ConfPerfilcargasxdefecto::comprobardenominacion($params, 0)) {
                return 0;
            }
        } else {
            if (ConfPerfilcargasxdefecto::comprobardenominacion($params, 0)) {
                return 0;
            }
        }
        if ($params->accion == 'Modificar') {
            $obj = Doctrine::getTable('ConfPerfil')->find(
                $params->idconfiguracionperfil
            );
        } else {
            $obj = new ConfPerfil();
        }
        $obj->denominacion = $params->denominacion;
        if (isset($params->actual) && $params->actual != '') {
            $obj->actual = $params->actual;
        }
        if (isset($params->descripcion) && $params->descripcion != '') {
            $obj->descripcion = $params->descripcion;
        }
        $obj->fechacreacion = date("d/m/Y");
        $obj->idautor = $params->idusuario;
        $obj->save();
        if ($params->accion == 'Modificar') {
            foreach ($params->tipoelemento as $value) {
                $objcomportamiento = Doctrine::getTable(
                    'ConfPerfilcargasxdefectoinvolucrado'
                )->findByDql(
                    "idconfiguracionperfil = $params->idconfiguracionperfil 
                        and idtipoelemento = $value"
                );
                if ($objcomportamiento[0]->idconfiguracionperfil != null) {
                    if ($params->actual == 1) {
                        ConfPerfilcargasxdefectoinvolucrado::comprobarConfigActualComportamiento(
                            $value
                        );
                    }
                    //$objcomportamiento[0]->idtipoelemento = $value;
                    $objcomportamiento[0]->actual = $params->actual;
                    $objcomportamiento[0]->save();
                    $model = new ConfPerfilModel();
                    if (isset($params->usuarioseliminar[0])) {
                        $model->EliminarInvolucradosAConfiguracion(
                            $params->usuarioseliminar,
                            $params->idconfiguracionperfil, 'comportamiento'
                        );
                    }
                    $objcomportamiento[0]->save();
                    if (isset($params->usuariosinv[0])) {
                        foreach ($params->usuariosinv as $value) {
                            $idinvolucrado = ($value->tipo != 0)
                                ? $value->idusuario : $value->idgrupo;
                            $existe = Doctrine::getTable(
                                'DatPerfilinvolucradoUsuariosinvolucrados'
                            )->findByDql(
                                "idconfiguracionperfil = $params->idconfiguracionperfil 
                                    AND idinvolucrado = $idinvolucrado",
                                null,
                                Doctrine::HYDRATE_ARRAY
                            );
                            if (count($existe) == 0) {
                                $objcomportinv
                                    = new DatPerfilinvolucradoUsuariosinvolucrados(
                                );
                                $objcomportinv->idconfiguracionperfil
                                    = $objcomportamiento[0]->idconfiguracionperfil;
                                $objcomportinv->idinvolucrado = $idinvolucrado;
                                $objcomportinv->idtipoelemento
                                    = $objcomportamiento[0]->idtipoelemento;
                                $objcomportinv->idtipo = $value->tipo;
                                $objcomportinv->idtipoinvolucrado
                                    = $value->idtipoinvolucrado;
                                $objcomportinv->save();
                            }
                        }
                    }
                } else {
                    if ($params->actual == 1) {
                        ConfPerfilcargasxdefectoinvolucrado::comprobarConfigActualComportamiento(
                            $value
                        );
                    }
                    $objcomportamiento
                        = new ConfPerfilcargasxdefectoinvolucrado();
                    $objcomportamiento->idconfiguracionperfil
                        = $obj->idconfiguracionperfil;
                    $objcomportamiento->idtipoelemento = $value;
                    $objcomportamiento->actual = $params->actual;
                    $objcomportamiento->save();
                    $model = new ConfPerfilModel();
                    if (isset($params->usuarioseliminar[0])) {
                        $model->EliminarInvolucradosAConfiguracion(
                            $params->usuarioseliminar,
                            $params->idconfiguracionperfil, 'comportamiento'
                        );
                    }
                    $objcomportamiento->save();
                    if (isset($params->usuariosinv[0])) {
                        foreach ($params->usuariosinv as $value) {
                            $idinvolucrado = ($value->tipo != 0)
                                ? $value->idusuario : $value->idgrupo;
                            $existe = Doctrine::getTable(
                                'DatPerfilinvolucradoUsuariosinvolucrados'
                            )->findByDql(
                                "idconfiguracionperfil = $params->idconfiguracionperfil 
                                    AND idinvolucrado = $idinvolucrado",
                                null,
                                Doctrine::HYDRATE_ARRAY
                            );
                            if (count($existe) == 0) {
                                $objcomportinv
                                    = new DatPerfilinvolucradoUsuariosinvolucrados(
                                );
                                $objcomportinv->idconfiguracionperfil
                                    = $objcomportamiento->idconfiguracionperfil;
                                $objcomportinv->idinvolucrado = $idinvolucrado;
                                $objcomportinv->idtipoelemento
                                    = $objcomportamiento->idtipoelemento;
                                $objcomportinv->idtipo = $value->tipo;
                                $objcomportinv->idtipoinvolucrado
                                    = $value->idtipoinvolucrado;
                                $objcomportinv->save();
                            }
                        }
                    }
                }
            }
            foreach ($params->tipoelementodelete as $value) {
                $objcomportamiento = Doctrine::getTable(
                    'ConfPerfilcargasxdefectoinvolucrado'
                )->findByDql(
                    "idconfiguracionperfil = $params->idconfiguracionperfil 
                        and idtipoelemento = $value"
                );
                if ($objcomportamiento[0]->idconfiguracionperfil != null) {
                    $objcomportamiento[0]->delete();
                }
            }
        } else {
            foreach ($params->tipoelemento as $value) {
                $objcomportamiento = new ConfPerfilcargasxdefectoinvolucrado();
                if ($params->actual == 1) {
                    ConfPerfilcargasxdefectoinvolucrado::comprobarConfigActualComportamiento(
                        $value
                    );
                }
                $objcomportamiento->idconfiguracionperfil
                    = $obj->idconfiguracionperfil;
                $objcomportamiento->idtipoelemento = $value;
                $objcomportamiento->actual = $params->actual;
                $objcomportamiento->save();
                if (isset($params->usuariosinv[0])) {
                    foreach ($params->usuariosinv as $value) {
                        $idinvolucrado = ($value->tipo != 0) ? $value->idusuario
                            : $value->idgrupo;
                        $objcomportinv
                            = new DatPerfilinvolucradoUsuariosinvolucrados();
                        $objcomportinv->idconfiguracionperfil
                            = $objcomportamiento->idconfiguracionperfil;
                        $objcomportinv->idinvolucrado = $idinvolucrado;
                        $objcomportinv->idtipoelemento
                            = $objcomportamiento->idtipoelemento;
                        $objcomportinv->idtipo = $value->tipo;
                        $objcomportinv->idtipoinvolucrado
                            = $value->idtipoinvolucrado;
                        $objcomportinv->save();
                    }
                }
            }
        }
        return 1;
    }

    public function listarCargasxdefecto($parametros)
    {
        $result = ConfPerfilcargasxdefecto::listar($parametros);
        foreach ($result->data as $key => $value) {
            $tipoelementos
                = ConfPerfilcargasxdefecto::getTipoelementosdadoidconfperfil(
                $value['idconfiguracionperfil']
            );
            foreach ($tipoelementos as $tipo) {
                if ($tipo['idtipoelemento'] == 3) {
                    $result->data[$key]['actividad'] = 1;
                }
                if ($tipo['idtipoelemento'] == 0) {
                    $result->data[$key]['plan'] = 1;
                }
                if ($tipo['idtipoelemento'] == 1) {
                    $result->data[$key]['objetivo'] = 1;
                }
                if ($tipo['idtipoelemento'] == 2) {
                    $result->data[$key]['fip'] = 1;
                }
            }
        }
        return $result;
    }

    public function listarCalendario($parametros)
    {
        $result = ConfPerfilcalendario::listar($parametros);
        return $result;
    }

    public function getConfdadotipoelementoyautor($parametros)
    {
        $result = ConfPerfilcargasxdefecto::getConfdadotipoelementoyautor(
            $parametros
        );
        return $result;
    }

    public function eliminarConfPerfilCxD($params)
    {
        $arrayconfperfil = array();
        foreach ($params->arrayidconfiguracionperfil as $idconfperfil) {
            $arrayconfperfil[] = $idconfperfil->idcconfperfil;
        }
        $query = new Doctrine_Query();
        $result = $query->delete('ConfPerfilcargasxdefecto')->from(
            'ConfPerfilcargasxdefecto'
        )->whereIn('idconfiguracionperfil', $arrayconfperfil)->execute();
        $query = new Doctrine_Query();
        $result = $query->delete('ConfPerfil')->from('ConfPerfil')->whereIn(
            'idconfiguracionperfil',
            $arrayconfperfil
        )->execute();
        return 1;
    }

    public function eliminarConfPerfilCalendar($params)
    {
        $arrayconfperfil = array();
        foreach ($params->arrayidconfiguracionperfil as $idconfperfil) {
            $arrayconfperfil[] = $idconfperfil->idcconfperfil;
        }
        $query = new Doctrine_Query();
        $result = $query->delete('ConfPerfilcalendario')->from(
            'ConfPerfilcalendario'
        )->whereIn('idconfiguracionperfil', $arrayconfperfil)->execute();
        $query = new Doctrine_Query();
        $result = $query->delete('ConfPerfil')->from('ConfPerfil')->whereIn(
            'idconfiguracionperfil',
            $arrayconfperfil
        )->execute();
        return 1;
    }

    public function eliminarConfPerfilComportamiento($params)
    {
        /*$array_confperfil = array();
        foreach ($params->arrayidconfiguracionperfil as $idconfperfil)
        {
            $array_confperfil[] = $idconfperfil->idcconfperfil;
        }
        $query = new Doctrine_Query();
        $result = $query->delete('ConfPerfilcalendario')->from('ConfPerfilcalendario')->
            whereIn('idconfiguracionperfil', $array_confperfil)->execute();
        */
        $query = new Doctrine_Query();
        /*$result = */$query->delete('ConfPerfil')->from('ConfPerfil')->whereIn(
            'idconfiguracionperfil',
            $params->arrayidconfiguracionperfil
        )->execute();
        return 1;
    }

    public function definirActual($parametros)
    {
        $resp = 0;
        switch ($parametros->tipoconf) {
            case 1:
                ConfPerfilcalendario::actualizarActualCalendar(
                    $params->idconfiguracionperfil//al parecer no se usa
                );
                $objetoconf = Doctrine::getTable('ConfPerfil')->find(
                    $parametros->idconfiguracionperfil
                );
                if ($objetoconf) {
                    $objetoconf->actual = 1;
                    $objetoconf->save();
                    $resp = 1;
                }
                break;
            case 2:
                if (isset($parametros->arraytipoelemento[0])) {
                    foreach ($parametros->arraytipoelemento as $tipoelemento) {
                        ConfPerfilcargasxdefecto::comprobarConfigActualCargaxDefecto(
                            $tipoelemento
                        );
                        $objetoconf = Doctrine::getTable(
                            'ConfPerfilcargasxdefecto'
                        )->findByDql(
                            "idconfiguracionperfil = $parametros->idconfiguracionperfil
                                AND idtipoelemento = $tipoelemento"
                        );
                        if ($objetoconf[0]->idconfiguracionperfil != null) {
                            $objetoconf[0]->actual = 1;
                            $objetoconf[0]->save();
                        }
                    }
                    $resp = 1;
                }
                break;
            case 3:
                if (isset($parametros->arraytipoelemento[0])) {
                    foreach ($parametros->arraytipoelemento as $tipoelemento) {
                        ConfPerfilcargasxdefectoinvolucrado::comprobarConfigActualComportamiento(
                            $tipoelemento
                        );
                        $objetoconf = Doctrine::getTable(
                            'ConfPerfilcargasxdefectoinvolucrado'
                        )->findByDql(
                            "idconfiguracionperfil = $parametros->idconfiguracionperfil
                             AND idtipoelemento = $tipoelemento"
                        );
                        if ($objetoconf[0]->idconfiguracionperfil != null) {
                            $objetoconf[0]->actual = 1;
                            $objetoconf[0]->save();
                        }
                    }
                    $resp = 1;
                }
                break;
        }
        return $resp;
    }

    public function listarComportamientos($parametros)
    {
        $result = ConfPerfil::listarComportamientos($parametros);
        foreach ($result->data as $key => $value) {
            $tipoelementos
                = ConfPerfilcargasxdefecto::getTipoelementosdadoidconfperfil(
                $value['idconfiguracionperfil'], 3
            );
            foreach ($tipoelementos as $tipo) {
                if ($tipo['idtipoelemento'] == 3) {
                    $result->data[$key]['actividad'] = 1;
                }
                if ($tipo['idtipoelemento'] == 4) {
                    $result->data[$key]['arc'] = 1;
                }
                if ($tipo['idtipoelemento'] == 1) {
                    $result->data[$key]['objetivo'] = 1;
                }
                if ($tipo['idtipoelemento'] == 2) {
                    $result->data[$key]['fip'] = 1;
                }
            }
        }
        return $result;
    }

    public function organizarSalidaArreglo($array, $tipo)
    {
        $cont = 0;
        foreach ($array->data as /*$key => */$value) {
            if ($tipo == 3 && $value['actividad'] == 1) {
                $resultado->data[$cont++] = $value;
            } elseif ($tipo == 0 && $value['plan'] == 1) {
                $resultado->data[$cont++] = $value;
            } elseif ($tipo == 1 && $value['objetivo'] == 1) {
                $resultado->data[$cont++] = $value;
            } elseif ($tipo == 2 && $value['fip'] == 1) {
                $resultado->data[$cont++] = $value;
            }
        }
        return $resultado;
    }

}
