<?php

/**
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class GestionarActividadesModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /*
       *funcion para adicionar actividades
       */
    public function AdicionarActividades(
        $idusuariocrea, $estamodificando, $idact, $denelemento,
        $categoriaactividad,
        $tipoactividad, $estadocumplimiento, $gradocumplimiento,
        $descelemento, $participantes, $dirigentes, $privado, $idtipoelemento,
        $fechainicio, $fechafin, $lugar, $hora, $horafin, $arrayinvolucrados,
        $arrayrelaciones, $arrayinvolinsertar, $arrayinvoleliminar, $esacthija,
        $esprincipal,
        $arrayrepeticiones
    ) {
        if ($estamodificando == 0 || $estamodificando == 2) {
            $objelemmodel = new DatElementosModel();
            $idaprob = $objelemmodel->ObtenerEstadoAprobPorDefecto(
                $idsubsistema = 15, $idusuariocrea, $idtipodocumento = 3
            );
            $elemento = new DatElementos();
            $elemento->idtipoelemento = $idtipoelemento;
            $elemento->denelemento = $denelemento;
            $elemento->descelemento = $descelemento;
            $elemento->idusuariocrea = $idusuariocrea;
            $elemento->llevahistorial = 0;
            $elemento->activo = 1;
            $elemento->gradocumplimiento = $gradocumplimiento;
            $elemento->privado = $privado;
            $elemento->participante = $participantes;
            $elemento->dirigente = $dirigentes;
            $elemento->estadocumplimiento = $estadocumplimiento;
            $elemento->idestadoaprob = $idaprob;
            $elemento->save();
            $idelemento = $elemento->idelemento;
            $this->CrearRelacionActividadNomenclador(
                $estamodificando, $idelemento, $categoriaactividad,
                $tipoactividad
            );
            if ($idact != 0 && $esacthija == 1) {
                $elementopadre = Doctrine::getTable('DatElementos')->find(
                    $idact
                );
                $idautorelemento = $elementopadre->idusuariocrea;
                if ($idusuariocrea == $idautorelemento) {
                    $origen = 0;
                } else {
                    $origen = 3;
                }
                $objelemelem = new DatElementosDatElementos();
                $objelemelem->idelementopadre = $idact;
                $objelemelem->idelementohijo = $idelemento;
                $objelemelem->origen = $origen;
                $objelemelem->idautor = $idusuariocrea;
                $objelemelem->save();
            }
            $actividad = new DatActividades();
            $actividad->idactividad = $idelemento;
            $actividad->tiporepeticion = $tiporepeticion;
            $actividad->fechainicio = $fechainicio;
            $actividad->fechafin = $fechafin;
            $actividad->horainicio = $hora;
            $actividad->horafin = $horafin;
            $actividad->lugar = $lugar;
            $actividad->esprincipal = $esprincipal;
            $actividad->save();
            if (isset($arrayrelaciones[0]->idelemento)) {
                $this->AdicionarRelaciones(
                    $arrayrelaciones, $idelemento, $idusuariocrea
                );
            }
            if (isset($arrayinvolucrados[0])) {
                foreach ($arrayinvolucrados as $involucrado) {
                    $this->Involucrar(
                        $involucrado, $idelemento, $estamodificando
                    );
                }
            }
            if (isset($arrayrepeticiones[0])) {
                $this->AdicionarInstancias(
                    $estamodificando, $arrayrelaciones, $elemento, $actividad,
                    $arrayrepeticiones, $arrayinvolucrados, $categoriaactividad,
                    $tipoactividad, $estadocumplimiento, $esprincipal,
                    $elemento->idusuariocrea
                );
            }
        }
        if ($estamodificando == 1) {
            $elemento = Doctrine::getTable('DatElementos')->find($idact);
            $elemento->denelemento = $denelemento;
            $elemento->descelemento = $descelemento;
            $elemento->llevahistorial = 0;
            $elemento->gradocumplimiento = $gradocumplimiento;
            $elemento->privado = $privado;
            $elemento->participante = $participantes;
            $elemento->dirigente = $dirigentes;
            $elemento->estadocumplimiento = $estadocumplimiento;
            $elemento->save();
            $idelemento = $elemento->idelemento;
            $this->CrearRelacionActividadNomenclador(
                $estamodificando, $idelemento, $categoriaactividad,
                $tipoactividad
            );
            if (isset($arrayrelaciones[0])) {
                $objrelacionaeliminar = Doctrine::getTable(
                    'DatElementosDatElementos'
                )->findByDql("idelementohijo = $idact AND origen = '1'");
                $objrelacionaeliminar->delete();
                $this->AdicionarRelaciones(
                    $arrayrelaciones, $idelemento, $idusuariocrea
                );
            }
            if (isset($arrayinvoleliminar[0])) {
                foreach ($arrayinvoleliminar as $involucrado) {
                    $this->EliminarInvolucrado($involucrado, $idelemento);
                }
            }
            if (isset($arrayinvolinsertar[0])) {
                foreach ($arrayinvolinsertar as $involucrado) {
                    $this->Involucrar(
                        $involucrado, $idelemento, $estamodificando
                    );
                }
            }
            $objact = Doctrine::getTable('DatActividades')->find($idact);
            $objact->fechainicio = $fechainicio;
            $objact->fechafin = $fechafin;
            $objact->horainicio = $hora;
            $objact->horafin = $horafin;
            $objact->lugar = $lugar;
            $objact->esprincipal = $esprincipal;
            $objact->save();
        }
    }

    public function EliminarActividad($idactividad)
    {
        $cont = 0;
        $sepuedeeliminar
            = 1;//inicalmente estara en 0, hasta ke el workflow  trabaje
        $existe = 0;
        $objact = Doctrine::getTable('DatElementos')->find($idactividad);
        if ($objact->idelemento) {
            $existe = 1;
            $arrayrelacionesconact = DatElementosDatElementos::BuscarElementos(
                $idactividad
            );
            if ($arrayrelacionesconact) {
                foreach ($arrayrelacionesconact as $relacion) {
                    $idelementopadre = $relacion['idelementopadre'];
                    $idelementohijo = $relacion['idelementohijo'];
                    $origen = $relacion['origen'];
                    if ($idelementopadre == $idactividad
                        && ($origen == 0
                            || $origen == 4)
                    ) {
                        $arrayidacthijas[$cont]['idelemento'] = $idelementohijo;
                        $cont++;
                    }
                    $objrelacion = Doctrine::getTable(
                        'DatElementosDatElementos'
                    )->findByDql(
                        "idelementopadre = $idelementopadre AND idelementohijo = $idelementohijo"
                    );
                    $objrelacion->delete();
                }
                if ($sepuedeeliminar == 1) {
                    $objact->delete();
                }
                if ($arrayidacthijas) {
                    foreach ($arrayidacthijas as $acthija) {
                        $this->EliminarActividad($acthija['idelemento']);
                    }
                }
            }
            if (!$arrayrelacionesconact) {
                if ($sepuedeeliminar == 1) {
                    $objact->delete();
                }
            }
        }
        return $existe;
    }


    public function CambiarActivo($idactividad, $activo)
    {
        $respuesta = 0;
        $objelemento = Doctrine::getTable('DatElementos')->find($idactividad);
        if ($objelemento->idelemento) {
            $respuesta = 1;
            $cont = 0;
            $arrayrelacionesconact = DatElementosDatElementos::BuscarElementos(
                $idactividad
            );
            if ($arrayrelacionesconact) {
                foreach ($arrayrelacionesconact as $relacion) {
                    $idelementopadre = $relacion['idelementopadre'];
                    $idelementohijo = $relacion['idelementohijo'];
                    $origen = $relacion['origen'];
                    if ($idelementopadre == $idactividad
                        && ($origen == 0
                            || $origen == 4)
                    ) {
                        $arrayidacthijas[$cont]['idelemento'] = $idelementohijo;
                        $cont++;
                    }
                }
                $objelemento = Doctrine::getTable('DatElementos')->find(
                    $idactividad
                );
                $objelemento->activo = $activo;
                $objelemento->save();

                if ($arrayidacthijas) {
                    foreach ($arrayidacthijas as $acthija) {
                        $this->CambiarActivo($acthija['idelemento'], $activo);
                    }
                }
            }
            if (!$arrayrelacionesconact) {
                $objelemento = Doctrine::getTable('DatElementos')->find(
                    $idactividad
                );
                $objelemento->activo = $activo;
                $objelemento->save();
            }
        }
        return $respuesta;
    }

    public function VerificarExistencia($idactividad)
    {
        $respuesta = 0;
        $objelemento = Doctrine::getTable('DatElementos')->find($idactividad);
        if ($objelemento->idelemento) {
            $respuesta = 1;
        }
        return $respuesta;
    }

    /**
     *funcion para involucrar usuarios y grupos
     */
    public function Involucrar($involucrado, $idelemento, $estamodificando)
    {
        $tipoinvolucrado = $involucrado->tipo;
        $idnivelinvolucrado = $involucrado->nivelinvolucrado;
        if ($estamodificando == 1) {
            $idnivelinvolucrado = $involucrado->tipoinvol;
        }
        if ($tipoinvolucrado == 0) {
            $idgrupo = $involucrado->idgrupo;
            $idusuario = null;
            $idinvolucrado = $idgrupo . $idnivelinvolucrado;
        }
        if ($tipoinvolucrado == 1) {
            $idgrupo = null;
            $idusuario = $involucrado->idusuario;
            $idinvolucrado = $idusuario . $idnivelinvolucrado;
        }
        $existeinvolucrado = Doctrine::getTable('DatInvolucrados')->find(
            $idinvolucrado
        );
        if (!$existeinvolucrado->idinvolucrado) {
            $newobjinvol = new DatInvolucrados();
            $newobjinvol->idinvolucrado = $idinvolucrado;
            $newobjinvol->idgrupo = $idgrupo;
            $newobjinvol->idusuario = $idusuario;
            $newobjinvol->tipoinvolucrado = $tipoinvolucrado;
            $newobjinvol->idnivelinvolucrado = $idnivelinvolucrado;
            $newobjinvol->save();
        }
        $newobjinvolel = new DatElementosDatInvolucrados();
        $newobjinvolel->idelemento = $idelemento;
        $newobjinvolel->idinvolucrado = $idinvolucrado;
        $newobjinvolel->save();
    }

    /**
     * Funcion para convertir valores boleanos que representan un permiso a numero
     */
    public function ConvertirDiasBoleanosANumero($arrayelementosboleanos)
    {
        $numerodias = 0;
        $totalelementosboleanos = count($arrayelementosboleanos);
        for ($i = 0; $i < $totalelementosboleanos; $i++) {
            if ($arrayelementosboleanos[$i] == 1) {
                $numerodias = $numerodias + pow(2, $i);
            }
        }
        return $numerodias;
    }

    /**
     * Funcion para calcular las instancias  de una actividad cuando tiene repeticion periodica
     */
    public function CalcularInstancias(
        $periodicidad, $fechainicio, $fechafin, $hora, $horafin, $cantdias,
        /*$numerodias, $cantsemanas,*/
        $nuncaacaba, $acabaxrepet, $fechafinrepet,
        $lugar
    ) {
        $incrementa = $this->VerificarIncremento($fechainicio, $fechafin);
        switch ($periodicidad) {
            case 1:
                if ($nuncaacaba == 1) {
                    $rangoendias = 365;
                    //rango de 5 annos
                    $cantidaddias = 0;
                    $cont = 0;
                    $i = $cantdias;
                    while ($i <= $rangoendias) {
                        $cantidaddias = $cantidaddias + $cantdias;
                        $arrayinstancias = $this->CalcularFecha(
                            $fechainicio, $fechafin, $hora, $horafin,
                            $cantidaddias
                        );
                        if ($cont == 0 && $incrementa['incognita'] == 1) {
                            $cantdias = $cantdias + $incrementa['diferencia'];
                        }
                        $arrayfechasinstancias[$cont]['fechainicio']
                            = $arrayinstancias['fechainicioinstancia'];
                        $arrayfechasinstancias[$cont]['fechafin']
                            = $arrayinstancias['fechafininstancia'];
                        $arrayfechasinstancias[$cont]['hora'] = $hora;
                        $arrayfechasinstancias[$cont]['horafin'] = $horafin;
                        $arrayfechasinstancias[$cont]['lugar'] = $lugar;
                        $cont++;
                        $i = $i + $cantdias;
                    }
                    return $arrayfechasinstancias;
                }
                if ($nuncaacaba == 0 && $acabaxrepet != 0) {
                    if ($acabaxrepet > 365) {
                        $acabaxrepet = 365;
                    }
                    $totalrepeticiones = $acabaxrepet;
                    $cantidaddias = 0;
                    $contrepet = 0;
                    while ($contrepet < $totalrepeticiones) {
                        $cantidaddias = $cantidaddias + $cantdias;
                        $arrayinstancias = $this->CalcularFecha(
                            $fechainicio, $fechafin, $hora, $horafin,
                            $cantidaddias
                        );
                        if ($contrepet == 0 && $incrementa['incognita'] == 1) {
                            $cantdias = $cantdias + $incrementa['diferencia'];
                        }
                        $arrayfechasinstancias[$contrepet]['fechainicio']
                            = $arrayinstancias['fechainicioinstancia'];
                        $arrayfechasinstancias[$contrepet]['fechafin']
                            = $arrayinstancias['fechafininstancia'];
                        $arrayfechasinstancias[$contrepet]['hora'] = $hora;
                        $arrayfechasinstancias[$contrepet]['horafin']
                            = $horafin;
                        $arrayfechasinstancias[$contrepet]['lugar'] = $lugar;
                        $contrepet++;
                    }
                    return $arrayfechasinstancias;
                }
                if ($nuncaacaba == 0 && $acabaxrepet == 0) {
                    $fechafinrepet = explode('T', $fechafinrepet);
                    $fechafinrepet = explode('-', $fechafinrepet[0]);
                    $numfechafinrepet = $fechafinrepet[0] . $fechafinrepet[1]
                        . $fechafinrepet[2];
                    $cantidaddias = 0;
                    $cont = 0;
                    while ($cont <= $numfechafinrepet) {
                        $cantidaddias = $cantidaddias + $cantdias;
                        $arrayinstancias = $this->CalcularFecha(
                            $fechainicio, $fechafin, $hora, $horafin,
                            $cantidaddias
                        );
                        $fechafininstancia
                            = $arrayinstancias['fechafininstancia'];
                        $fechafininstancia = explode('-', $fechafininstancia);
                        $numfechafininstancia
                            = $fechafininstancia[0] . $fechafininstancia[1]
                            . $fechafininstancia[2];
                        if ($numfechafininstancia <= $numfechafinrepet) {
                            if ($cont == 0 && $incrementa['incognita'] == 1) {
                                $cantdias
                                    = $cantdias + $incrementa['diferencia'];
                            }
                            $arrayfechasinstancias[$cont]['fechainicio']
                                = $arrayinstancias['fechainicioinstancia'];
                            $arrayfechasinstancias[$cont]['fechafin']
                                = $arrayinstancias['fechafininstancia'];
                            $arrayfechasinstancias[$cont]['hora'] = $hora;
                            $arrayfechasinstancias[$cont]['horafin'] = $horafin;
                            $arrayfechasinstancias[$cont]['lugar'] = $lugar;
                            $cont++;
                        }
                        if ($numfechafininstancia > $numfechafinrepet) {
                            return $arrayfechasinstancias;
                        }
                    }
                }
                break;

            case 2:

                break;
        }
    }

    public function CalcularFecha(
        $fechainicio, $fechafin, /*$hora, $horafin,*/
        $cantidaddias
    ) {
        $fechainicio = explode('T', $fechainicio);
        list($annoinicio, $mesinicio, $diainicio) = explode(
            '-', $fechainicio[0]
        );
        $numfechainicio = mktime(0, 0, 0, $mesinicio, $diainicio, $annoinicio);
        $fechafin = explode('T', $fechafin);
        list($annofin, $mesfin, $diafin) = explode('-', $fechafin[0]);
        $numfechafin = mktime(0, 0, 0, $mesfin, $diafin, $annofin);
        $numdiferenciafiFf
            = $numfechafin - $numfechainicio;//cant segundos de diferencia
        $cantsegcantdias = (60 * 60 * 24) * $cantidaddias;
        $nummktimefechainicio = $numfechafin + $cantsegcantdias;
        $nummktimefechafin = $nummktimefechainicio + $numdiferenciafiFf;
        $fechainicioinstancia = date('d-m-Y', $nummktimefechainicio);
        $fechafininstancia = date('d-m-Y', $nummktimefechafin);
        $arrayinstancias['fechainicioinstancia'] = $fechainicioinstancia;
        $arrayinstancias['fechafininstancia'] = $fechafininstancia;
        return $arrayinstancias;
    }

    public function VerificarIncremento($fechainicio, $fechafin)
    {
        $incrementa['incognita'] = 0;
        $fechainicio = explode('T', $fechainicio);
        list($annoinicio, $mesinicio, $diainicio) = explode(
            '-', $fechainicio[0]
        );
        $numfechainicio = mktime(0, 0, 0, $mesinicio, $diainicio, $annoinicio);
        $fechafin = explode('T', $fechafin);
        list($annofin, $mesfin, $diafin) = explode('-', $fechafin[0]);
        $numfechafin = mktime(0, 0, 0, $mesfin, $diafin, $annofin);
        $resta = $numfechafin - $numfechainicio;
        $incrementa['diferencia'] = round(($resta) / (60 * 60 * 24));
        $cantsegdia = 60 * 60 * 24;
        if ($resta >= $cantsegdia) {
            $incrementa['incognita'] = 1;
        }
        return $incrementa;
    }

    public function AdicionarInstancias(
        $estamodificando, $arrayrelaciones, $elemento, $actividad,
        $arrayrepeticiones, $arrayinvolucrados, $categoriaactividad,
        $tipoactividad, /*$estadocumplimiento,*/
        $esprincipal/*, $idautorrelacion*/
    )
    {
        if (isset($arrayrepeticiones[0])) {
            foreach ($arrayrepeticiones as $repeticion) {
                $element = new DatElementos();
                $element->idtipoelemento = $elemento->idtipoelemento;
                $element->denelemento = $elemento->denelemento;
                $element->descelemento = $elemento->descelemento;
                $element->idusuariocrea = $elemento->idusuariocrea;
                $element->llevahistorial = $elemento->llevahistorial;
                $element->activo = 1;
                $element->gradocumplimiento = $elemento->gradocumplimiento;
                $element->privado = $elemento->privado;
                $element->participante = $elemento->participante;
                $element->dirigente = $elemento->dirigente;
                $element->estadocumplimiento = $elemento->estadocumplimiento;
                $element->idestadoaprob = $elemento->idestadoaprob;
                $element->save();
                $idelemento = $element->idelemento;
                $this->CrearRelacionActividadNomenclador(
                    $estamodificando, $idelemento, $categoriaactividad,
                    $tipoactividad
                );
                if ($arrayrelaciones) {
                    $this->AdicionarRelaciones(
                        $arrayrelaciones, $idelemento, $elemento->idusuariocrea
                    );
                }
                $actividadnueva = new DatActividades();
                $actividadnueva->idactividad = $idelemento;
                $actividadnueva->tiporepeticion = $actividad->tiporepeticion;
                $separador = 'T';
                $fechainicio = $this->ConvertirFecha(
                    $repeticion->fechainicioRe, $separador
                );
                $fechafin = $this->ConvertirFecha(
                    $repeticion->fechafinRe, $separador
                );
                $actividadnueva->fechainicio = $fechainicio;
                $actividadnueva->fechafin = $fechafin;
                if ($repeticion->tipoDeRep == 1) {
                    $actividadnueva->horainicio = $actividad->horainicio;
                    $actividadnueva->horafin = $actividad->horafin;
                    $lugar = $actividad->lugar;
                    if ($arrayinvolucrados) {
                        foreach ($arrayinvolucrados as $involucrado) {
                            $this->Involucrar(
                                $involucrado, $idelemento, $estamodificando
                            );
                        }
                    }
                } else {
                    $arrayinvolucrados = $repeticion->involucrados;
                    $actividadnueva->horainicio = $repeticion->horaRe;
                    $actividadnueva->horafin = $repeticion->horafinRe;
                    $lugar = $repeticion->lugar;
                    if (isset($arrayinvolucrados[0]->id)) {
                        foreach ($arrayinvolucrados as $involucrado) {
                            $this->Involucrar(
                                $involucrado, $idelemento, $estamodificando
                            );
                        }
                    }
                }
                $actividadnueva->lugar = $lugar;
                $actividadnueva->esprincipal = $esprincipal;
                $actividadnueva->save();
                $objelemelemmodel = new DatElementosDatElementos();
                $objelemelemmodel->idelementopadre = $elemento->idelemento;
                $objelemelemmodel->idelementohijo = $idelemento;
                $objelemelemmodel->origen = 4;
                $objelemelemmodel->idautor = $elemento->idusuariocrea;
                $objelemelemmodel->save();
            }
        }
    }

    public function CargarActividades(
        $idusuariosession, $fechainiciob, $fechafinb,
        $denominacionb, $arrayautoresact, $arrayinvolact, $idtipoelemento,
        $certificado,
        $iddominio, $idtipoelementopadre, $idelementopadre,
        $fechainicioelemento,
        $fechafinelemento, $estaaprobando, $idestadoaprobacion, $limit, $offset,
        $operloggeneral, $operlogautinvol, $tfcar
    ) {
        if ($idestadoaprobacion != null) {
            $arrayestados['data'][0]['idestado'] = $idestadoaprobacion;
        } else {
            $arrayestados = $this->pIntegrator->workflow->EstadosVerDoc(
                $idsubsistema = 15, $idusuariosession, $idtipodoc = 3
            );
        }
        $objelemento = new DatElementos();
        $arrayactivid = $objelemento->ObtenerActividadesGrid(
            $idusuariosession, $fechainiciob, $fechafinb, $denominacionb,
            $arrayautoresact,
            $arrayinvolact, $idtipoelemento, $idtipoelementopadre,
            $idelementopadre,
            $fechainicioelemento, $fechafinelemento, $arrayestados,
            $estaaprobando, $limit,
            $offset, $operloggeneral, $operlogautinvol, $tfcar
        );
        $arrayactividades = $arrayactivid[1];
        if (isset($arrayactividades[0]['idelemento'])) {
            foreach ($arrayactividades as $key => $actividad) {
                $leaf = true;
                $tieneacthijas = DatElementosDatElementos::EsElementoP(
                    $actividad['idelemento']
                );
                if (isset($tieneacthijas[0])) {
                    foreach ($tieneacthijas as $hija) {
                        $idelementohijo = $hija['idelementohijo'];
                        foreach ($arrayactividades as $act) {
                            if ($act['idelemento'] == $idelementohijo) {
                                $leaf = false;
                            }
                        }
                    }
                }
                $parent = null;
                $tieneactpadre = DatElementosDatElementos::EsElementoHijo(
                    $actividad['idelemento']
                );
                if (isset($tieneactpadre[0])) {
                    foreach ($tieneactpadre as $padre) {
                        $idpadre = $padre['idelementopadre'];
                        foreach ($arrayactividades as $act) {
                            if ($act['idelemento'] == $idpadre) {
                                $parent = $idpadre;
                            }
                        }
                    }
                }
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                $entrada = 1;
                $objelemmodel = new DatElementosModel();
                $estadoaprobpordefcto
                    = $objelemmodel->ObtenerEstadoAprobPorDefecto(
                    $idsubsistema = 15, $idusuariosession, $idtipodocumento = 3
                );
                if ($actividad['idautor'] != $idusuariosession) {
                    $superior = 1;
                    if ($estadoaprobpordefcto == $actividad['idestadoaprob']) {
                        $entrada = 0;
                    } else {
                        //$permisomodificacion = 0;
                        $permisomodificacion
                            = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                            $idusuariosession, $actividad['idautor'],
                            $certificado, $iddominio
                        );
                        if ($permisomodificacion) {
                            $modificar = $permisomodificacion[2];
                            $eliminar = $permisomodificacion[3];
                            $subordinado = $permisomodificacion[4];
                        } else {
                            $modificar = 0;
                            $eliminar = 0;
                            $subordinado = 0;
                        }
                    }
                }
                /*if($entrada == 1) {*/
                $estadoparobacion = '';
                if ($actividad['idestadoaprob'] != null) {
                    $arrayestadosaprob
                        = $this->pIntegrator->workflow->DenomEstado(
                        $actividad['idestadoaprob']
                    );
                    $estadoparobacion = $arrayestadosaprob[0]->denominacion;
                }
                $arrayactividades[$key]['nombreautor']
                    = $this->integrator->seguridad->nombreUsuario(
                    $actividad['idautor']
                );
                $arrayactividades[$key]['estadocumplimiento']
                    = $actividad['estadocumplimiento'] . "("
                    . $actividad['gradocumplimiento'] . "%)";
                $arrayactividades[$key]['estadoaprobacion'] = $estadoparobacion;
                $arrayactividades[$key]['_is_leaf'] = $leaf;
                $arrayactividades[$key]['_parent'] = $parent;
                $arrayactividades[$key]['superior'] = $superior;
                $arrayactividades[$key]['subordinado'] = $subordinado;
                $arrayactividades[$key]['modificar'] = $modificar;
                $arrayactividades[$key]['eliminar'] = $eliminar;
                //}
            }
            $arrayactivid[1] = $arrayactividades;
        }
        return $arrayactivid;
    }

    public function CargarActividadModificar($idactividad)
    {
        $objelemento = Doctrine::getTable('DatElementos')->find($idactividad);
        $objacttividad = Doctrine::getTable('DatActividades')->find(
            $idactividad
        );
        $idtipoactividad = null;
        $tipoactividad = null;
        $idcategactividad = null;
        $categactividad = null;
        $nomencladortipoact
            = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom(
            $objelemento->idelemento, $tiponomenclador = 3
        );
        if ($nomencladortipoact) {
            $idtipoactividad = $nomencladortipoact[0]['idnomenclador'];
            $objnom
                = $this->pIntegrator->configuracionpdo->DameDatosNomenclador(
                $idtipoactividad
            );
            $tipoactividad = $objnom->dennomenclador;
        }
        $nomencladorcategact
            = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom(
            $objelemento->idelemento, $tiponomenclador = 2
        );
        if ($nomencladorcategact) {
            $idcategactividad = $nomencladorcategact[0]['idnomenclador'];
            $objnom
                = $this->pIntegrator->configuracionpdo->DameDatosNomenclador(
                $idcategactividad
            );
            $categactividad = $objnom->dennomenclador;
        }
        $datosact['mensaje'] = 1;
        $datosact['idelemento'] = $objelemento->idelemento;
        $datosact['denelemento'] = $objelemento->denelemento;
        $datosact['descelemento'] = $objelemento->descelemento;
        $datosact['grado'] = $objelemento->gradocumplimiento;
        $datosact['participantes'] = $objelemento->participante;
        $datosact['dirigente'] = $objelemento->dirigente;
        $datosact['hora1'] = $objacttividad->horainicio;
        $datosact['horafin1'] = $objacttividad->horafin;
        $datosact['lugar1'] = $objacttividad->lugar;
        $datosact['esprincipal'] = $objacttividad->esprincipal;
        $datosact['fechainicio1'] = $objacttividad->fechainicio;
        $datosact['fechafin1'] = $objacttividad->fechafin;
        $datosact['idprivado'] = $objelemento->privado;
        $datosact['tipoactividad']
            = array('idtipoactividad' => $idtipoactividad,
                    'tipoactividad'   => $tipoactividad);
        $datosact['categoriaactividad']
            = array('idcategoriaactividad' => $idcategactividad,
                    'categoriaactividad'   => $categactividad);
        $datosact['estadocumplimiento'] = $objelemento->estadocumplimiento;
        return $datosact;
    }

    public function CargarGridRelaciones($idactividad, $idusuariosession)
    {
        $cont = 0;
        $arrayrelaciones = DatElementosDatElementos::CargarGridRelaciones(
            $idactividad
        );
        if (isset($arrayrelaciones[0])) {
            foreach ($arrayrelaciones as $relacion) {
                $idautorrelacion = $relacion['idautor'];
                $idelementopadre = $relacion['idelementopadre'];
                $objelemento = Doctrine::getTable('DatElementos')->find(
                    $idelementopadre
                );
                $idtipoelemento = $objelemento->idtipoelemento;
                switch ($idtipoelemento) {
                    case 0:
                        $tipoelemento = 'Plan';
                        $objele = Doctrine::getTable('DatPlanPdo')->find(
                            $objelemento->idelemento
                        );
                        $fechainicio = $objele->fechainicio;
                        $fechafin = $objele->fechafin;
                        break;
                    case 1:
                        $tipoelemento = 'Objetivo';
                        $objele = Doctrine::getTable('DatObjetivo')->find(
                            $objelemento->idelemento
                        );
                        $fechainicio = $objele->fechainicio;
                        $fechafin = $objele->fechafin;
                        break;
                    case 2:
                        $tipoelemento = 'FIP';
                        $objele = Doctrine::getTable('DatFip')->find(
                            $objelemento->idelemento
                        );
                        $fechainicio = $objele->fechaemision;
                        $fechafin = $objele->fechacumplimiento;
                        break;
                }
                $eliminar = 1;
                if ($idusuariosession != $idautorrelacion) {
                    $eliminar = 0;
                }
                $nombreautor = $this->integrator->seguridad->nombreUsuario(
                    $objelemento->idusuariocrea
                );
                $arrayrelacionesgrid[$cont]['id'] = $objelemento->idelemento;
                $arrayrelacionesgrid[$cont]['idelemento']
                    = $objelemento->idelemento;
                $arrayrelacionesgrid[$cont]['actividad'] = null;
                $arrayrelacionesgrid[$cont]['idplan'] = null;
                $arrayrelacionesgrid[$cont]['denominacion']
                    = $objelemento->denelemento;
                $arrayrelacionesgrid[$cont]['tipoelemento'] = $tipoelemento;
                $arrayrelacionesgrid[$cont]['idautor']
                    = $objelemento->idusuariocrea;
                $arrayrelacionesgrid[$cont]['nombreautor'] = $nombreautor;
                $arrayrelacionesgrid[$cont]['fechainicio'] = $fechainicio;
                $arrayrelacionesgrid[$cont]['fechafin'] = $fechafin;
                $arrayrelacionesgrid[$cont]['eliminar'] = $eliminar;
                $arrayrelacionesgrid[$cont]['idautorrelacion']
                    = $idautorrelacion;
                $arrayrelacionesgrid[$cont]['nombreautorrelacion']
                    = $this->integrator->seguridad->nombreUsuario(
                    $idautorrelacion
                );
                $arrayrelacionesgrid[$cont]['idarc'] = null;
                $arrayrelacionesgrid[$cont]['elemento']
                    = $objelemento->denelemento . "(creado por " . $nombreautor
                    . ")";
                $cont++;
            }
        }
        $arrayrelplanarcact
            = DatArcDatPlanActividades::ObtenerRelacionPlanArcActByAct(
            $idactividad
        );
        if (isset($arrayrelplanarcact[0])) {
            foreach ($arrayrelplanarcact as $planactarc) {
                $eliminar = 1;
                if ($idusuariosession != $planactarc['idautor']) {
                    $eliminar = 0;
                }
                $nombreautorrelacion
                    = $this->integrator->seguridad->nombreUsuario(
                    $planactarc['idautor']
                );
                $objarc = Doctrine::getTable('DatArc')->find(
                    $planactarc['idarc']
                );
                $denominacion = $objarc->denarc;
                $nombreautorarc = $this->integrator->seguridad->nombreUsuario(
                    $objarc->idusuariocrea
                );
                $objelemento = Doctrine::getTable('DatElementos')->find(
                    $planactarc['idplan']
                );
                $denominacionplan = $objelemento->denelemento;
                $nombreautorplan = $this->integrator->seguridad->nombreUsuario(
                    $objelemento->idusuariocrea
                );
                $arrayrelacionesgrid[$cont]['id']
                    = $planactarc['idarc'] . $planactarc['idactividad']
                    . $planactarc['idplan'];
                $arrayrelacionesgrid[$cont]['idelemento']
                    = $planactarc['idarc'];
                $arrayrelacionesgrid[$cont]['actividad']
                    = $planactarc['idactividad'];
                $arrayrelacionesgrid[$cont]['idplan'] = $planactarc['idplan'];
                $arrayrelacionesgrid[$cont]['denominacion'] = $denominacion;
                $arrayrelacionesgrid[$cont]['tipoelemento'] = " ARC";
                $arrayrelacionesgrid[$cont]['idautor'] = $objarc->idusuariocrea;
                $arrayrelacionesgrid[$cont]['nombreautor'] = $nombreautorarc;
                $arrayrelacionesgrid[$cont]['fechainicio'] = '';
                $arrayrelacionesgrid[$cont]['fechafin'] = '';
                $arrayrelacionesgrid[$cont]['eliminar'] = $eliminar;
                $arrayrelacionesgrid[$cont]['idautorrelacion']
                    = $planactarc['idautor'];
                $arrayrelacionesgrid[$cont]['nombreautorrelacion']
                    = $nombreautorrelacion;
                $arrayrelacionesgrid[$cont]['idarc'] = $planactarc['idarc'];
                $arrayrelacionesgrid[$cont]['elemento']
                    = "Relacionada con el plan '" . $denominacionplan
                    . "'(creado por " . $nombreautorplan . ")";
                $cont++;
            }
        }
        return $arrayrelacionesgrid;
    }

    public function AdicionarRelaciones(
        $arrayrelaciones, $idelemento, $idusuariocrea
    ) {
        $objelementomodel = new DatElementosModel();
        $objelementomodel->AdicionarRelaciones(
            $arrayrelaciones, $idelemento, $idusuariocrea
        );
    }

    public function CrearRelacionActividadNomenclador(
        $estamodificando, $idelemento, $categoriaactividad, $tipoactividad
    ) {
        if ($categoriaactividad != null) {
            if ($estamodificando == 0) {
                $objelementonomencladorcategact
                    = new DatElementosNomNomenclador();
                $objelementonomencladorcategact->idelemento = $idelemento;
                $objelementonomencladorcategact->idnomenclador
                    = $categoriaactividad;
                $objelementonomencladorcategact->tiponomenclador = 2;
                $objelementonomencladorcategact->save();
            }
            if ($estamodificando == 1) {
                $tiponomenclador = 2;
                $objelemnom = Doctrine::getTable('DatElementosNomNomenclador')
                    ->findByDql(
                        "idelemento = $idelemento AND tiponomenclador = $tiponomenclador"
                    );
                if ($objelemnom->idnomenclador) {
                    $objelemnom->delete();
                }
                $objelementonomencladorcategact
                    = new DatElementosNomNomenclador();
                $objelementonomencladorcategact->idelemento = $idelemento;
                $objelementonomencladorcategact->idnomenclador
                    = $categoriaactividad;
                $objelementonomencladorcategact->tiponomenclador = 2;
                $objelementonomencladorcategact->save();
            }
        }
        if ($tipoactividad != null) {
            if ($estamodificando == 0) {
                $objelementonomencladortipoact = new DatElementosNomNomenclador(
                );
                $objelementonomencladortipoact->idelemento = $idelemento;
                $objelementonomencladortipoact->idnomenclador = $tipoactividad;
                $objelementonomencladortipoact->tiponomenclador = 3;
                $objelementonomencladortipoact->save();
            }
            if ($estamodificando == 1) {
                $tiponomenclador = 3;
                $objelemnom = Doctrine::getTable('DatElementosNomNomenclador')
                    ->findByDql(
                        "idelemento = $idelemento AND tiponomenclador = $tiponomenclador"
                    );
                if ($objelemnom->idnomenclador) {
                    $objelemnom->delete();
                }
                $objelementonomencladortipoact = new DatElementosNomNomenclador(
                );
                $objelementonomencladortipoact->idelemento = $idelemento;
                $objelementonomencladortipoact->idnomenclador = $tipoactividad;
                $objelementonomencladortipoact->tiponomenclador = 3;
                $objelementonomencladortipoact->save();
            }
        }
    }

    public function EliminarInvolucrado($involucrado, $idelemento)
    {
        $tipoinvolucrado = $involucrado->tipo;
        $idnivelinvolucrado = $involucrado->tipoinvol;
        if ($tipoinvolucrado == 0) {
            $idgrupo = $involucrado->idgrupo;
            $idusuario = null;
            $idinvolucrado = $idgrupo . $idnivelinvolucrado;
        }
        if ($tipoinvolucrado == 1) {
            $idgrupo = null;
            $idusuario = $involucrado->idusuario;
            $idinvolucrado = $idusuario . $idnivelinvolucrado;
        }
        $existeinvolucradoelemento = Doctrine::getTable(
            'DatElementosDatInvolucrados'
        )
            ->findByDql(
                "idelemento = $idelemento AND idinvolucrado = $idinvolucrado"
            );
        if (isset($existeinvolucradoelemento->idelemento)) {
            $existeinvolucradoelemento->delete();
        }
    }

    public function VerificarAtributosActHijas($elementosunicos, $tieneacthijas)
    {
        $leaf = true;
        foreach ($elementosunicos as $elemento) {
            foreach ($tieneacthijas as $hija) {
                if ($elemento['idelemento'] == $hija['idelementohijo']) {
                    $leaf = false;
                }
            }
        }
        return $leaf;
    }

    public function obtenerEstadosAprobacion(
        $idsubsistema, $idusuariosession, $idtipodocumento, $idelemento,
        $idestadoinicial
    ) {
        $objelemento = Doctrine::getTable('DatElementos')->find($idelemento);
        if ($idestadoinicial == $objelemento->idestadoaprob) {
            $objelementosmodel = new DatElementosModel();
            $estados = $objelementosmodel->ObtenerEstadosAModificarDoc(
                $idsubsistema, $idusuariosession, $idtipodocumento,
                $idestadoinicial
            );
        } else {
            $estados = array('codigo'  => 3,
                             'mensaje' => 'El estado de esta actividad ha sido 
                                 cambiado y no es el mismo que se le muestra en 
                                 el registro.Por favor actualice el registro de 
                                 actividades.');
        }
        return $estados;
    }

    public function CambiarEstadoAprob(
        $idelem, $idusuariosession, $idestadoinicial, $idestadofinal,
        $idtipodoc, $obj, $idsubsistema
    ) {
        $objelementosmodel = new DatElementosModel();
        $respuesta = $objelementosmodel->CambiarEstadoAprobacion(
            $idelem, $idusuariosession, $idestadoinicial, $idestadofinal,
            $idtipodoc, $obj, $idsubsistema
        );
        return $respuesta;
    }

    public function CargarGridRepeticionesAct(
        $idactividad, $idusuariosession, $certificado, $iddominio
    ) {
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
            $idsubsistema = 15, $idusuariosession, $idtipodoc = 3
        );
        $arrayestados = array();
        if (isset($arrayestadosverdoc['data'][0])) {
            foreach ($arrayestadosverdoc['data'] as $key => $estado) {
                $arrayestados[]['idestado'] = $estado['idestado'];
            }
        }
        $arrayactiv = DatElementos::ObtenerRepeticiones(
            $idactividad, $arrayestados
        );
        $arrayact = array();
        if (isset($arrayactiv[0]['idelemento'])) {
            foreach ($arrayactiv as $key => $act) {
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                $entrada = 1;
                if ($act['idusuariocrea'] != $idusuariosession) {
                    $superior = 1;
                    $objelemmodel = new DatElementosModel();
                    $estadoaprobpordefcto
                        = $objelemmodel->ObtenerEstadoAprobPorDefecto(
                        $idsubsistema = 15, $idusuariosession,
                        $idtipodocumento = 3
                    );
                    if ($estadoaprobpordefcto == $act['idestadoaprob']) {
                        $entrada = 0;
                    }
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $idusuariosession, $act['idusuariocrea'], $certificado,
                        $iddominio
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                        $subordinado = $permisomodificacion[4];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                        $subordinado = 0;
                    }
                }
                if ($entrada == 1) {//verificando que el estado de aprobacion 
                    // no sea el estado por defecto para los planes de otras personas
                    $arrayact[$key]['identificador'] = $act['identificador'];
                    $arrayact[$key]['estadocumplimiento']
                        = $act['estadocumplimiento'] . '('
                        . $act['gradocumplimiento'] . '%)';
                    $arrayact[$key]['nombreautor']
                        = $this->integrator->seguridad->nombreUsuario(
                        $act['idusuariocrea']
                    );
                    $separador = '-';
                    $fechainicio = $act['fechai'];
                    $fechaI = $this->ConvertirFecha($fechainicio, $separador);
                    $fechafin = $act['fechaf'];
                    $fechaF = $this->ConvertirFecha($fechafin, $separador);
                    $arrayact[$key]['fechaI'] = $fechaI;
                    $arrayact[$key]['fechaF'] = $fechaF;
                    $arrayact[$key]['hora'] = $act['hora'];
                    $arrayact[$key]['horafin'] = $act['horafin'];
                    $arrayact[$key]['lugar'] = $act['lugar'];
                    $arrayact[$key]['superior'] = $superior;
                    $arrayact[$key]['subordinado'] = $subordinado;
                    $arrayact[$key]['modificar'] = $modificar;
                    $arrayact[$key]['eliminar'] = $eliminar;
                    $objelemmodel = new DatElementosDatInvolucradosModel();
                    $arrayact[$key]['involucrados']
                        = $objelemmodel->ObtenerInvolucradosPorElementos(
                        $act['identificador']
                    );
                    $arraydatosmes = $this->ObtenerDatosMes($act['fechai']);
                    $arrayact[$key]['mes'] = $arraydatosmes['nombremes'];
                    $arrayact[$key]['numeroMes'] = $arraydatosmes['numeromes'];
                    $arrayact[$key]['tipoDeRep'] = 2;
                }
            }
        }
        return $arrayact;
    }

    public function ConvertirFecha($fecha, $tiposeparador)
    {
        switch ($tiposeparador) {
            case 'T':
                $fecha = explode('T', $fecha);
                list($annoinicio, $mesinicio, $diainicio) = explode(
                    '-', $fecha[0]
                );
                $numfecha = mktime(
                    0, 0, 0, $mesinicio, $diainicio, $annoinicio
                );
                $fechainstancia = date('d-m-Y', $numfecha);
                break;
            case '-':
                list($annoinicio, $mesinicio, $diainicio) = explode(
                    '-', $fecha
                );
                $numfecha = mktime(
                    0, 0, 0, $mesinicio, $diainicio, $annoinicio
                );
                $fechainstancia = date('d/m/Y', $numfecha);
                break;
        }
        return $fechainstancia;
    }

    public function ObtenerDatosMes($fecha)
    {
        $fecha = explode('-', $fecha);
        $numeromes = $fecha[1] * 1;
        $arraydatosmes['numeromes'] = $numeromes;
        switch ($numeromes) {
            case 1:
                $nombremes = 'Enero';
                break;
            case 2:
                $nombremes = 'Febrero';
                break;
            case 3:
                $nombremes = 'Marzo';
                break;
            case 4:
                $nombremes = 'Abril';
                break;
            case 5:
                $nombremes = 'Mayo';
                break;
            case 6:
                $nombremes = 'Junio';
                break;
            case 7:
                $nombremes = 'Julio';
                break;
            case 8:
                $nombremes = 'Agosto';
                break;
            case 9:
                $nombremes = 'Septiembre';
                break;
            case 10:
                $nombremes = 'Octubre';
                break;
            case 11:
                $nombremes = 'Noviembre';
                break;
            case 12:
                $nombremes = 'Diciembre';
                break;
        }
        $arraydatosmes['nombremes'] = $nombremes;
        return $arraydatosmes;
    }

    public function ModificarRepeticion($arrayrepeticiones/*, $idautorrelacion*/
    )
    {
        if (isset($arrayrepeticiones[0]->identificador)) {
            $objact = Doctrine::getTable('DatActividades')->find(
                $arrayrepeticiones[0]->identificador
            );
            if (isset($objact)) {
                $separador = 'T';
                $fechainicio = $this->ConvertirFecha(
                    $arrayrepeticiones[0]->fechainicioRe, $separador
                );
                $fechafin = $this->ConvertirFecha(
                    $arrayrepeticiones[0]->fechafinRe, $separador
                );
                $objact->fechainicio = $fechainicio;
                $objact->fechafin = $fechafin;
                $objact->lugar = $arrayrepeticiones[0]->lugar;
                $objact->horainicio = $arrayrepeticiones[0]->horaRe;
                $objact->horafin = $arrayrepeticiones[0]->horafinRe;
                $objact->save();
                $idact = $objact->idactividad;
                $arrayinvolucradosact
                    = DatElementosDatInvolucrados::ObtenerInvolucradosPorElemento(
                    $idact
                );
                if (isset($arrayinvolucradosact[0])) {
                    foreach ($arrayinvolucradosact as $key => $invol) {
                        $idinvol = $invol['idinvolucrado'];
                        $objinvolelemen = Doctrine::getTable(
                            'DatElementosDatInvolucrados'
                        )->findByDql(
                            "idinvolucrado = $idinvol AND idelemento = $idact"
                        );
                        if (isset($objinvolelemen)) {
                            $objinvolelemen->delete();
                        }
                    }
                }
                if ($arrayrepeticiones[0]->involucrados) {
                    $newarrayinvolucrados = $arrayrepeticiones[0]->involucrados;
                    foreach ($newarrayinvolucrados as $key => $newinvol) {
                        $this->Involucrar(
                            $newinvol, $idact, $estamodificando = 0
                        );
                    }
                }
                $mensaje = 1;
            } else {
                $mensaje = 3;
            }
        }
        //else{$mensaje = 3;}
        return $mensaje;
    }

}

