<?php

class PlanServices extends ZendExt_Model
{

    public function VerificarGrupoInvolucradoArc($idgrupo, $idarc, $nivelinvol)
    {
        $cero = 0;
        $uno = 1;
        $idinvolucradoresp = $idgrupo . $cero;
        $idinvolucradoejec = $idgrupo . $uno;
        $existe = DatArcDatInvolucrados::ExisteElemento(
            $idarc, $idinvolucradoresp
        );
        if ($existe) {
            $nivelinvol = 0;
            return $nivelinvol;
        }
        $existe = DatArcDatInvolucrados::ExisteElemento(
            $idarc, $idinvolucradoejec
        );
        if ($existe) {
            $nivelinvol = 1;
            return $nivelinvol;
        }
    }


    public function VerificarUsuarioInvolucradoArc(
        $idusuario, $idarc, $nivelinvol
    ) {
        $cero = 0;
        $uno = 1;
        $idinvolucradoresp = $idusuario . $cero;
        $idinvolucradoejec = $idusuario . $uno;
        $existe = DatArcDatInvolucrados::ExisteElemento(
            $idarc, $idinvolucradoresp
        );
        if ($existe) {
            $nivelinvol = 0;
            return $nivelinvol;
        }
        $existe = DatArcDatInvolucrados::ExisteElemento(
            $idarc, $idinvolucradoejec
        );
        if ($existe) {
            $nivelinvol = 1;
            return $nivelinvol;
        }
    }


    public function DameDatosActividad($idelemento)
    {
        $objactividad = Doctrine::getTable('DatActividades')->find($idelemento);
        return $objactividad;
    }


    public function VerificarInvolucradoAct($idinvolucrado, $idvariable)
    {
        $objactividadinvol = Doctrine::getTable('DatVariableDatInvolucrados')
            ->findByDql(
                "idinvolucrado = $idinvolucrado AND idvariable = $idvariable "
            );
        return $objactividadinvol;
    }


    public function VerificarInvolucrado($idinvolucrado, $idelemento)
    {
        $objelementoinvol = Doctrine::getTable('DatElementosDatInvolucrados')
            ->findByDql(
                "idinvolucrado = $idinvolucrado AND idelemento = $idelemento "
            );
        return $objelementoinvol;
    }


    public function DameActividadesPorInvolucrados(
        $idusuariocrea, $arrayinvolucrados, $fechainicio, $fechafin,
        $arraycategoriasact, $arraytipoact, $arrayautoresact
    ) {
        if (!$arrayinvolucrados[0]->tipo) {
            //es la carga inicial,como grupo,como persona, y privadas
            $cont = 0;
            //primero busco las actividades como grupo
            $arraygrupos
                = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                $idusuariocrea
            );
            if ($arraygrupos) {
                foreach ($arraygrupos as $grupo) {
                    $idgrupo = $grupo['idgrupo'];
                    $existegrupoinvol
                        = DatInvolucrados::DameDatosInvolucradosDadoIdGrupo(
                        $idgrupo
                    );
                    if ($existegrupoinvol) {
                        foreach ($existegrupoinvol as $grupoinvol) {
                            $idvariable = $grupoinvol['idvariable'];
                            $idinvolucrado = $grupoinvol['idinvolucrado'];
                            $arrayactividadescal
                                = $this->ArmarArregloDeActividades(
                                $idvariable, $fechainicio, $fechafin, $cont
                            );
                        }
                    }
                }
            }
            //ahora busco las actividades como usuario
            $existeusuarioinvol
                = DatVariableDatInvolucrados::DameDatosInvolucradosDadoIdusuario(
                $idusuariocrea
            );
            $arrayactividadescal = array();
            if ($existeusuarioinvol) {
                foreach ($existeusuarioinvol as $usuarioinvol) {
                    $idvariable = $usuarioinvol['idvariable'];
                    $idinvolucrado = $usuarioinvol['idinvolucrado'];
                    $arrayactividadescal = $this->ArmarArregloDeActividades(
                        $idvariable, $fechainicio, $fechafin, $cont
                    );
                }
            }
            //ahora busco las actividades privadas
            $arrayactividades
                = DatElementos::DameElementosActividadDadoIdusuariocrea(
                $idusuariocrea
            );
            if ($arrayactividades) {
                foreach ($arrayactividades as $actividad) {
                    $idactividad = $actividad['idelemento'];
                    $arrayvariables = DatVariable::DameVariablesPorIdactividad(
                        $idactividad
                    );
                    foreach ($arrayvariables as $variable) {
                        $fechainiciovariable = $variable['fechainicio'];
                        $fechafinvariable = $variable['fechafin'];
                        $arrayfechaslegibles = $this->DameFechaLegible(
                            $fechainiciovariable, $fechafinvariable
                        );

                        $arrayfechasvariable = $this->DameNumFechaVariable(
                            $fechainiciovariable, $fechafinvariable
                        );
                        $arrayfechasbusqueda = $this->DameNumFecha(
                            $fechainicio, $fechafin
                        );

                        $estaenrango = $this->DimeSiEstaEnRango(
                            $arrayfechasvariable, $arrayfechasbusqueda
                        );
                        if ($estaenrango == 1) {//esta en rango
                            $idnomencladorcategact = $this->DameIdNomenclador(
                                $idactividad, $tiponomenclador = 2
                            );
                            $coloractividad
                                = $this->pIntegrator->configuracionpdo->DameColorCategoriaActividad(
                                $idnomencladorcategact
                            );
                            $idnomencladortipoact = $this->DameIdNomenclador(
                                $idactividad, $tiponomenclador = 3
                            );
                            $arrayactividadescal[$cont]['id']
                                = $variable['idvariable'];
                            $arrayactividadescal[$cont]['subject']
                                = $actividad['denelemento'];
                            $arrayactividadescal[$cont]['description']
                                = $actividad['descelemento'];
                            $arrayactividadescal[$cont]['startdate']
                                = $arrayfechaslegibles['fechainicio'] . ' '
                                . $variable['hora'];
                            $arrayactividadescal[$cont]['enddate']
                                = $arrayfechaslegibles['fechafin'] . ' '
                                . $variable['horafin'];
                            $arrayactividadescal[$cont]['color'] = "";
                            $arrayactividadescal[$cont]['idcat'] = 0;
                            $arrayactividadescal[$cont]['caducidad'] = 5;
                            $arrayactividadescal[$cont]['categoria'] = 'cat1';
                            $arrayactividadescal[$cont]['tipoact'] = 'oficial';
                            $arrayactividadescal[$cont]['lugar'] = 'UCID';
                            $arrayactividadescal[$cont]['participan']
                                = 'lideres de linea';
                            $arrayactividadescal[$cont]['estado_cump'] = 'bajo';
                            $arrayactividadescal[$cont]['grado_cump'] = 'alto';
                            $cont++;
                        }
                    }
                }
            }
        }
        if ($arrayinvolucrados[0]->tipo) {
            foreach ($arrayinvolucrados as $involucrado) {
                $tipo = $involucrado->tipo;
                if (tipo == 0) {
                    $idgrupo = $involucrado->idgrupo;
                    $existegrupoinvol
                        = DatInvolucrados::DameDatosInvolucradosDadoIdGrupo(
                        $idgrupo
                    );
                    if ($existegrupoinvol) {
                        foreach ($existegrupoinvol as $grupoinvol) {
                            $idvariable = $grupoinvol['idvariable'];
                            $idinvolucrado = $grupoinvol['idinvolucrado'];
                            $arrayactividadescal
                                = $this->ArmarArregloDeActividades(
                                $idvariable, $fechainicio, $fechafin
                            );
                        }
                    }
                }
                if (tipo == 1) {
                    //primero busco donde el usuario esta involucrado
                    $idusuario = $involucrado->idusuario;
                    $existeusuarioinvol
                        = DatInvolucrados::DameDatosInvolucradosDadoIdusuario(
                        $idusuario
                    );
                    if ($existeusuarioinvol) {
                        foreach ($existeusuarioinvol as $usuarioinvol) {
                            $idvariable = $usuarioinvol['idvariable'];
                            $idinvolucrado = $usuarioinvol['idinvolucrado'];
                            $arrayactividadescal
                                = $this->ArmarArregloDeActividades(
                                $idvariable, $fechainicio, $fechafin
                            );
                        }
                    }
                    //ahora busco como involucrado por sus grupos
                    $arraygrupos
                        = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                        $idusuario
                    );
                    if ($arraygrupos) {
                        foreach ($arraygrupos as $grupo) {
                            $idgrupo = $grupo['idgrupo'];
                            $existegrupoinvol
                                = DatInvolucrados::DameDatosInvolucradosDadoIdGrupo(
                                $idgrupo
                            );
                            if ($existegrupoinvol) {
                                foreach ($existegrupoinvol as $grupoinvol) {
                                    $idvariable = $grupoinvol['idvariable'];
                                    $idinvolucrado
                                        = $grupoinvol['idinvolucrado'];
                                    $arrayactividadescal
                                        = $this->ArmarArregloDeActividades(
                                        $idvariable, $fechainicio, $fechafin
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }
        return $arrayactividadescal;
    }


    public function DameNumFecha($fechainicio, $fechafin)
    {
        $fechainicio = explode('/', $fechainicio);
        krsort($fechainicio);
        $fechainicio = implode($fechainicio);
        $fechafin = explode('/', $fechafin);
        krsort($fechafin);
        $fechafin = implode($fechafin);
        $arrayfechas['fechainicio'] = $fechainicio;
        $arrayfechas['fechafin'] = $fechafin;
        return $arrayfechas;
    }


    public function DameFechaLegible($fechainicio, $fechafin)
    {
        $fechainicio = explode('-', $fechainicio);
        $fechainicio
            = $fechainicio[1] . '/' . $fechainicio[2] . '/' . $fechainicio[0];
        $fechafin = explode('-', $fechafin);
        $fechafin = $fechafin[1] . '/' . $fechafin[2] . '/' . $fechafin[0];
        $arrayfechas['fechainicio'] = $fechainicio;
        $arrayfechas['fechafin'] = $fechafin;
        return $arrayfechas;
    }


    public function DameNumFechaVariable($fechainicio, $fechafin)
    {
        $fechainicio = explode('-', $fechainicio);
        $fechainicio = implode($fechainicio);
        $fechafin = explode('-', $fechafin);
        $fechafin = implode($fechafin);
        $arrayfechas['fechainicio'] = $fechainicio;
        $arrayfechas['fechafin'] = $fechafin;
        return $arrayfechas;
    }


    public function DameRangoDeTiempo($diainicio, $diafin)
    {
        $diferenciadias = $diafin - $diainicio;
        if ($diferenciadias == 0) {
            $rangodetiempo = 'dia';
        }
        if ($diferenciadias == 6) {
            $rangodetiempo = 'semana';
        }
        if ($diferenciadias >= 27) {
            $rangodetiempo = 'mes';
        }
        return $rangodetiempo;
    }


    public function DimeSiEstaEnRango(
        $arraynumfechasvariable, $arraynumfechasbusqueda
    ) {
        $numerofechainiciovariable = $arraynumfechasvariable['fechainicio'];
        $numerofechafinvariable = $arraynumfechasvariable['fechafin'];
        $numerofechainiciobusqueda = $arraynumfechasbusqueda['fechainicio'];
        $numerofechafinbusqueda = $arraynumfechasbusqueda['fechafin'];
        $result = 0;
        if (($numerofechainiciovariable >= $numerofechainiciobusqueda)) {
            $result = 1;
        }
        if ($numerofechafinvariable >= $numerofechainiciobusqueda
            && $numerofechafinvariable <= $numerofechafinbusqueda
        ) {
            $result = 1;
        }
        if ($numerofechainiciovariable <= $numerofechainiciobusqueda
            && $numerofechafinvariable >= $numerofechafinbusqueda
        ) {
            $result = 1;
        }
        return $result;
    }


    public function DameIdNomenclador($idelemento, $tiponomenclador)
    {
        $nomenclador = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom(
            $idelemento, $tiponomenclador
        );
        $idnomenclador = $nomcategoriaact[0]['idnomenclador'];
        return $idnomenclador;
    }


    public function ArmarArregloDeActividades(
        $idvariable, $fechainicio, $fechafin
    ) {
        $variable = Doctrine::getTable('DatVariable')->find($idvariable);
        $fechainiciovariable = $variable->fechainicio;
        $fechafinvariable = $variable->fechafin;
        $arrayfechaslegibles = $this->DameFechaLegible(
            $fechainiciovariable, $fechafinvariable
        );
        $arraynumfechasvariable = $this->DameNumFechaVariable(
            $fechainiciovariable, $fechafinvariable
        );
        $arraynumfechasbusqueda = $this->DameNumFecha($fechainicio, $fechafin);
        $estaenrango = $this->DimeSiEstaEnRango(
            $arraynumfechasvariable, $arraynumfechasbusqueda
        );
        if ($estaenrango == 1) {//esta en rango
            $variable = Doctrine::getTable('DatVariable')->find($idvariable);
            $idactividad = $variable->idactividad;
            $arraydatosactividad
                = DatElementos::DameDatosActividadDadoIdactividad($idactividad);
            $idnomencladorcategact = $this->DameIdNomenclador(
                $idactividad, $tiponomenclador = 2
            );
            $coloractividad
                = $this->pIntegrator->configuracionpdo->DameColorCategoriaActividad(
                $idnomencladorcategact
            );
            $idnomencladortipoact = $this->DameIdNomenclador(
                $idactividad, $tiponomenclador = 3
            );
            $arrayactividadescal[$cont]['id'] = $variable->idvariable;
            $arrayactividadescal[$cont]['subject']
                = $arraydatosactividad[0]['denelemento'];
            $arrayactividadescal[$cont]['description']
                = $arraydatosactividad[0]['descelemento'];
            $arrayactividadescal[$cont]['startdate']
                = $arrayfechaslegibles['fechainicio'] . ' ' . $variable->hora;
            $arrayactividadescal[$cont]['enddate']
                = $arrayfechaslegibles['fechafin'] . ' ' . $variable->horafin;
            $arrayactividadescal[$cont]['color'] = "";
            $arrayactividadescal[$cont]['idcat'] = 0;
            $arrayactividadescal[$cont]['caducidad'] = 5;
            $arrayactividadescal[$cont]['categoria'] = 'cat1';
            $arrayactividadescal[$cont]['tipoact'] = 'oficial';
            $arrayactividadescal[$cont]['lugar'] = 'UCID';
            $arrayactividadescal[$cont]['participan'] = 'lideres de linea';
            $arrayactividadescal[$cont]['estado_cump'] = 'bajo';
            $arrayactividadescal[$cont]['grado_cump'] = 'alto';
            $cont++;
        }
    }


    public function DameActvPorUsuarioTipoNomenclador(
        $idusuariocrea, $tiponom, $fechainicio, $fechafin
    ) {
        $arrayactv = DatElementos::GetActvPorUsuarioTipoNomenclador(
            $idusuariocrea, $tiponom, $fechainicio, $fechafin
        );
        return $arrayactv;
    }


    public function DameRelacionElementoNomencladorByTipoNom(
        $idelemento, $tiponomenclador
    ) {
        $relacion = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom(
            $idelemento, $tiponomenclador
        );
        return $relacion;
    }


    public function ExisteGrupoInvolucradoARC($idgrupo)
    {
        $cero = 0;
        $uno = 1;
        $idinvolucradoresponsable = $idgrupo . $cero;
        $idinvolucradoejecutor = $idgrupo . $uno;
        $existegrupoinvolresp
            = DatArcDatInvolucrados::dameIdARCDadoIdInvolucrado(
            $idinvolucradoresponsable
        );
        if ($existegrupoinvolresp) {
            $existeinvol['responsable'] = $existegrupoinvolresp;
        }
        $existegrupoinvolejec
            = DatArcDatInvolucrados::dameIdARCDadoIdInvolucrado(
            $idinvolucradoejecutor
        );
        if ($existegrupoinvolejec) {
            $existeinvol['ejecutor'] = $existegrupoinvolejec;
        }
        return $existeinvol;
    }


    public function ExisteGrupoInvolucradoObjFIP($idgrupo)
    {
        $cero = 0;
        $uno = 1;
        $idinvolucradoresponsable = $idgrupo . $cero;
        $idinvolucradoejecutor = $idgrupo . $uno;
        $existegrupoinvolresp
            = DatElementosDatInvolucrados::ExisteInvolucradoConElementos(
            $idinvolucradoresponsable
        );
        if ($existegrupoinvolresp) {
            $existeinvol['responsable'] = $existegrupoinvolresp;
        }
        $existegrupoinvolejec
            = DatElementosDatInvolucrados::ExisteInvolucradoConElementos(
            $idinvolucradoejecutor
        );
        if ($existegrupoinvolejec) {
            $existeinvol['ejecutor'] = $existegrupoinvolejec;
        }
        return $existeinvol;
    }


    public function ExisteGrupoInvolucradoAct($idgrupo)
    {
        $cero = 0;
        $uno = 1;
        $idinvolucradoresponsable = $idgrupo . $cero;
        $idinvolucradoejecutor = $idgrupo . $uno;
        $existegrupoinvolresp = DatVariableDatInvolucrados::BuscarInvolucrado(
            $idinvolucradoresponsable
        );
        if ($existegrupoinvolresp) {
            $existeinvol['responsable'] = $existegrupoinvolresp;
        }
        $existegrupoinvolejec = DatVariableDatInvolucrados::BuscarInvolucrado(
            $idinvolucradoejecutor
        );
        if ($existegrupoinvolejec) {
            $existeinvol['ejecutor'] = $existegrupoinvolejec;
        }
        return $existeinvol;
    }

    public function EliminarActividad($idvariable)
    {
        $idact = DatVariable::DameIdActividad($idvariable);
        $result = DatElementos::EliminarActividad($idact[0]['idactividad']);
        return $result;
    }

    public function setActivaActividad($idvariable, $activo)
    {
        $idact = DatVariable::DameIdActividad($idvariable);
        $result = DatElementos::setActivaActividad(
            $idact[0]['idactividad'], $activo
        );
        return $result;
    }

    public function setHoraActividad($idvariable, $horaI, $horaF)
    {
        $result = DatVariable::setHoraActividad($idvariable, $horaI, $horaF);
        return $result;
    }

}


