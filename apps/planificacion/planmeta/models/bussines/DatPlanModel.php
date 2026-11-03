<?php

class DatPlanModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(
            $idplan, $codigo, $denominacion, $descripcion, $version, $identidad
    ) {

        if ($idplan == "") {
            $objPlanDocColl = new DatPlan();

            $objPlanDocColl->identidad = $identidad;
            $objPlanDocColl->codigo = $codigo;
            $objPlanDocColl->denominacion = $denominacion;
            $objPlanDocColl->descripcion = $descripcion;
            $objPlanDocColl->version = $version;

            $objPlanDocColl->save();
        } else {
            $plan = Doctrine::getTable('DatPlan')->find($idplan);
            $plan->denominacion = $denominacion;
            $plan->descripcion = $descripcion;
            //$plan->descripcion = $descripcion;
            $plan->save();
        }
    }

    public function Actualizar(DatPlan $datPlan) {
        $datPlan->save();
    }

    public function eliminarAjuste($params) {
        $query = new Doctrine_Query();
        $query->update('DatPlanificacion p')
                ->set('ajuste', 0)
                ->whereIN('p.idplanificacion ', $params['arrayidplanificacion'])
                ->addwhere('p.idaprobaciondemanda = 4');
        $query->execute();
        $result = '1';
        return $result;
    }

    public function Eliminar($idplan, $identidad) {

        $plan = new DatPlan();
        $dat = null;

        $plan = Doctrine::getTable('DatPlan')->find($idplan);
        $modelos = DatModelo::getModelosPlan(
                        $plan['idplan'], $plan['identidad'], null, null, false
        );
        if ($identidad == $plan['identidad']) {
            if ($modelos) {
                foreach ($modelos as $m) {
                    DatModeloModel::Eliminar(
                            $m['DatEntidadmodelo'][0]['identidadmodelo'], $m['idmodelo']
                    );
                }
            }
            $plan->delete();
            $dat->codMsgE = 1;
        } else {
            $dat->codMsgE = 3;
        }
        return $dat;
    }

    public function ListarPlanesDesglose($identidad, $tipo, $node, $parametros) {
        /*
         * si tipo == 0 : devuelvo los planes por la entidad que esta logueada
         * si tipo == 1 : devuelvo los modelos del plan
         */

        switch ($tipo) {
            case 0:
                $arrayagrupaciones = DatPlan::getPlanesEntidadDesglose(
                                $node, $identidad, $parametros
                );
                if (isset($arrayagrupaciones[0])) {
                    foreach ($arrayagrupaciones as $i => $agrupacion) {
                        $arrayagrupaciones[$i]['text'] = $agrupacion['denominacion'] . ' - ' . 'Cod: '
                                . $agrupacion['codigo'];
                        $arrayagrupaciones[$i]['icon'] = '/lib/ExtJS/temas/default/images/tree/folder.gif';
                        $codigo = $agrupacion['codigo'];
                        $denominacion = $agrupacion['denominacion'];
                        $descripcion = $agrupacion['descripcion'];
                        $arrayagrupaciones[$i]['qtip'] = "<p><b>Código:</b>"
                                . $codigo . "</p>" .
                                "<p><b>Denominación:</b>" . $denominacion . "</p>" .
                                "<p><b>Descripción:</b>" . $descripcion . "</p>";
                        $arrayplanes = DatModelo::getModelosPlanDesglose(
                                        $identidad, $parametros
                        );
                        if (isset($arrayplanes[0])) {
                            $arrayagrupaciones[$i]['leaf'] = false;
                        }
                    }
                }
                $elementos = $arrayagrupaciones;

                break;
            case 1:
                $arrayplanes = DatModelo::getModelosPlanDesglose(
                                $identidad, $parametros
                );
                if (isset($arrayplanes[0])) {
                    foreach ($arrayplanes as $i => $plan) {
                        //$fechaentrega = $plan[fechaentrega];
                        $denominacion = $plan[denominacion];
                        $descripcion = $plan[descripcion];
                        $tipomodelo = NomTipomodelo::getDenominacionDadoIdTipoModelo(
                                        $plan['idtipomodelo']
                        );
                        $denomtipomodelo = $tipomodelo[0]['denominacion'];
                        if ($arrayplanes[$i]['ruta']) {
                            $ruta = explode('*', $arrayplanes[$i]['ruta']);
                            $arrayplanes[$i]['ruta'] = $ruta[1];
                            $arrayplanes[$i]['rutaids'] = $ruta[0];
                        }
                        $arrayplanes[$i]['qtip'] = "<p><b>Denominación:</b> &nbsp;&nbsp;"
                                . $denominacion . "</p>" .
                                "<p><b>Descripción:</b> &nbsp;&nbsp;" . $descripcion
                                . "</p>" .
                                "<p><b>Tipo de Modelo:</b> &nbsp;&nbsp;"
                                . $denomtipomodelo . "</p>" .
                                "<p><b>Tipo de plan:</b> &nbsp;&nbsp;" . $ruta[1]
                                . "</p>";
                    }
                }
                $elementos = $arrayplanes;
                break;
        }
        return $elementos;
    }

    public function Listar($identidad, $tipo, $node, $idejercicio, $identidades, $niveles = false) {


        /*
         * si tipo == 0 : devuelvo las agrupaciones
         * si tipo == 1 : devuelvo los planes
         */
        switch ($tipo) {
            case 0:
                if ($niveles == false)
                    $arrayagrupaciones = DatPlan::getPlanesEntidad($identidad, $idejercicio, $identidades);
                if ($niveles == true)
                    $arrayagrupaciones = DatPlan::getPlanesEntidadNiv($identidad, $idejercicio, $identidades);

                if (isset($arrayagrupaciones[0])) {
                    foreach ($arrayagrupaciones as $i => $agrupacion) {
                        $arrayagrupaciones[$i]['icon'] = '/lib/ExtJS/temas/default/images/tree/folder.gif';
                        $arrayagrupaciones[$i]['qtip'] = "<p><b>Código: </b>" . $agrupacion['codigo'] . "</p>" .
                                "<p><b>Denominación: </b>" . $agrupacion['denominacion'] . "</p>" .
                                "<p><b>Descripción: </b>" . $agrupacion['descripcion'] . "</p>";
                        if ($niveles == false) {
                            if ($arrayagrupaciones[$i]['planif'] == 0) {
                                $arrayagrupaciones[$i]['text'] = $agrupacion['denominacion'] . ' - ' . 'Cod: ' . $agrupacion['codigo'];
                            } else {
                                $arrayagrupaciones[$i]['text'] = "<b> " . $agrupacion['denominacion'] . ' - ' . 'Cod: ' . $agrupacion['codigo'] . "</b>";
                            }
                        }
                        if ($niveles == true) {
                            if ($arrayagrupaciones[$i]['desglosada'] == 1)
                                $arrayagrupaciones[$i]['text'] = "<b> " . $agrupacion['denominacion'] . ' - ' . 'Cod: ' . $agrupacion['codigo'] . "</b>";
                            else
                                $arrayagrupaciones[$i]['text'] = $agrupacion['denominacion'] . ' - ' . 'Cod: ' . $agrupacion['codigo'];
                        }
                    }
                }
                $elementos = $arrayagrupaciones;
                break;
            case 1:
                $arrayplanes = DatModelo::getModelosPlan($node, $identidad, $idejercicio, $identidades);
                if (isset($arrayplanes[0])) {
                    foreach ($arrayplanes as $i => $plan) {
                        if ($arrayplanes[$i]['ruta']) {
                            $ruta = explode('*', $arrayplanes[$i]['ruta']);
                            $arrayplanes[$i]['ruta'] = $ruta[1];
                            $arrayplanes[$i]['rutaids'] = $ruta[0];
                        }
                        if ($niveles == false) {
                            if ($arrayplanes[$i]['planif'] == 0)
                                $arrayplanes[$i]['text'] = $plan['denominacion'];
                            else
                                $arrayplanes[$i]['text'] = "<b> " . $plan['denominacion'] . "</b>";
                        }
                        if ($niveles == true) {
                            if ($arrayplanes[$i]['desglosada'] == 1) {
                                $arrayplanes[$i]['text'] = "<b> " . $plan['denominacion'] . "</b>";
                                $arrayplanes[$i]['menu'] = 1;
                            } else {
                                $arrayplanes[$i]['text'] = $plan['denominacion'];
                                $arrayplanes[$i]['menu'] = 0;
                            }
                        }

                        $arrayplanes[$i]['qtip'] = "<p><b>Denominación:</b> &nbsp;&nbsp;" . $plan[denominacion] . "</p>" .
                                "<p><b>Descripción:</b> &nbsp;&nbsp;" . $plan[descripcion] . "</p>" .
                                "<p><b>Tipo de Modelo:</b> &nbsp;&nbsp;" . $plan['tipomodelo'] . "</p>" .
                                "<p><b>Tipo de plan:</b> &nbsp;&nbsp;" . $ruta[1] . "</p>";
                    }
                }
                $elementos = $arrayplanes;
                break;
        }

        return $elementos;
    }

    public function listarArbolPlanesBaseCalculo($identidad, $tipo, $node, $idejercicio, $tipocalc) {

        /*
         * si tipo == 0 : devuelvo las agrupaciones
         * si tipo == 1 : devuelvo los planes
         */
        switch ($tipo) {
            case 0:
                $arrayagrupaciones = DatModelo::getPlanesEntidad($identidad, $idejercicio, $tipocalc);
                if (isset($arrayagrupaciones[0])) {
                    foreach ($arrayagrupaciones as $i => $agrupacion) {
                        $arrayagrupaciones[$i]['icon'] = '/lib/ExtJS/temas/default/images/tree/folder.gif';
                        $arrayagrupaciones[$i]['qtip'] = "<p><b>Código: </b>" . $agrupacion['codigo'] . "</p>" .
                                "<p><b>Denominación: </b>" . $agrupacion['denominacion'] . "</p>" .
                                "<p><b>Descripción: </b>" . $agrupacion['descripcion'] . "</p>";
                        $arrayagrupaciones[$i]['text'] = $agrupacion['denominacion'] . ' - ' . 'Cod: ' . $agrupacion['codigo'];
                    }
                }
                $elementos = $arrayagrupaciones;
                break;
            case 1:
                $arrayplanes = DatModelo::listarModelosBaseCalculo($identidad, $node, $idejercicio, $tipocalc);
                if (isset($arrayplanes[0])) {
                    foreach ($arrayplanes as $i => $plan) {
                        if ($arrayplanes[$i]['ruta']) {
                            $ruta = explode('*', $arrayplanes[$i]['ruta']);
                            $arrayplanes[$i]['ruta'] = $ruta[1];
                            $arrayplanes[$i]['rutaids'] = $ruta[0];
                        }
                        $arrayplanes[$i]['text'] = $plan['denominacion'];

                        $arrayplanes[$i]['qtip'] = "<p><b>Denominación:</b> &nbsp;&nbsp;" . $plan[denominacion] . "</p>" .
                                "<p><b>Descripción:</b> &nbsp;&nbsp;" . $plan[descripcion] . "</p>" .
                                "<p><b>Tipo de Modelo:</b> &nbsp;&nbsp;" . $plan['tipomodelo'] . "</p>" .
                                "<p><b>Tipo de plan:</b> &nbsp;&nbsp;" . $ruta[1] . "</p>";
                    }
                }
                $elementos = $arrayplanes;
                break;
        }

        return $elementos;
    }

    public function listarArbolPlanesNivelesActividad($identidad, $tipo, $node, $idejercicio) {
        /*
         * si tipo == 0 : devuelvo las agrupaciones
         * si tipo == 1 : devuelvo los planes
         */
        switch ($tipo) {
            case 0:
                $arrayagrupaciones = DatModelo::getPlanesNivAct($identidad, $idejercicio);
                if (isset($arrayagrupaciones[0])) {
                    foreach ($arrayagrupaciones as $i => $agrupacion) {
                        $arrayagrupaciones[$i]['icon'] = '/lib/ExtJS/temas/default/images/tree/folder.gif';
                        $arrayagrupaciones[$i]['qtip'] = "<p><b>Código: </b>" . $agrupacion['codigo'] . "</p>" .
                                "<p><b>Denominación: </b>" . $agrupacion['denominacion'] . "</p>" .
                                "<p><b>Descripción: </b>" . $agrupacion['descripcion'] . "</p>";
                        $arrayagrupaciones[$i]['text'] = $agrupacion['denominacion'] . ' - ' . 'Cod: ' . $agrupacion['codigo'];
                    }
                }
                $elementos = $arrayagrupaciones;
                break;
            case 1:
                $arrayplanes = DatModelo::getModelosNivActividad($identidad, $node, $idejercicio);
                if (isset($arrayplanes[0])) {
                    foreach ($arrayplanes as $i => $plan) {
                        if ($arrayplanes[$i]['ruta']) {
                            $ruta = explode('*', $arrayplanes[$i]['ruta']);
                            $arrayplanes[$i]['ruta'] = $ruta[1];
                            $arrayplanes[$i]['rutaids'] = $ruta[0];
                        }
                        if ($arrayplanes[$i]['desglosada'] == 1) {
                            $arrayplanes[$i]['text'] = "<b> " . $plan['denominacion'] . "</b>";
                            $arrayplanes[$i]['menu'] = 1;
                        } else {
                            $arrayplanes[$i]['text'] = $plan['denominacion'];
                            $arrayplanes[$i]['menu'] = 0;
                        }
                        $arrayplanes[$i]['qtip'] = "<p><b>Denominación:</b> &nbsp;&nbsp;" . $plan[denominacion] . "</p>" .
                                "<p><b>Descripción:</b> &nbsp;&nbsp;" . $plan[descripcion] . "</p>" .
                                "<p><b>Tipo de Modelo:</b> &nbsp;&nbsp;" . $plan['tipomodelo'] . "</p>" .
                                "<p><b>Tipo de plan:</b> &nbsp;&nbsp;" . $ruta[1] . "</p>";
                    }
                }
                $elementos = $arrayplanes;
                break;
        }

        return $elementos;
    }

    public function ListarModPorTipoModelo($identidad, $tipo, $node, $parametros, $idtipomodelo, $idmodelo
    ) {
        /*
         * si tipo == 0 : devuelvo los planes por la entidad que esta logueada
         * si tipo == 1 : devuelvo los modelos del plan
         */
        switch ($tipo) {
            case 0:
                if ($parametros['codigo'] || $parametros['denominacion'] || $parametros['idejercicio']
                ) {
                    $elementos = DatPlan::BuscarPlanes($parametros);
                } else {
                    $elementos = DatPlan::getPlanesEntidad($identidad);
                }

                for ($i = 0; $i < count($elementos); $i++) {
                    $elementos[$i]['text'] = $elementos[$i]['denominacion']
                            . ' - ' . 'Cod: ' . $elementos[$i]['codigo'];
                }
                break;
            case 1:
                $elementos = DatModelo::getModelosPlanDeUnTipoModelo(
                                $node, $idtipomodelo, $idmodelo
                );
                break;
        }
        return $elementos;
    }

    public function AdicionarIndicadores($idindicadores, $parametros, $identidadmodelo, $idejercicio, $idmodelo, $tipoplan, $cant, $idusuario) {
        //recorro todos los indicadores y los voy insertando
        $identidad = $this->global->Estructura->idestructura;

        foreach ($idindicadores as $i) {
            //buscando los cb
            $cbind = NomIndicador::getCbIndicador($i);
            $dcb = '';
            $varc = count($cbind);
            foreach ($cbind as $key => $cb) {
                $cbind = DatEntidaddatosnomenclador::getEntidadDadoIdDatos(
                                $cb['identidaddatosnomenclador']
                );
                $datosentidad = $this->integrator->metadatos->DameEstructura(
                        $cbind[0]['identidad']
                );
                if ($key < $varc - 1) {
                    $dcb .= $datosentidad[0]->denominacion . ', ';
                } else {
                    $dcb .= $datosentidad[0]->denominacion;
                }
            }

            //buscando las va
            $vaind = DatIndicadorviaadquisicion::ObtenerViasAdquisIndicadorAsociado(
                            $i
            );
            $dva = '';
            $varc = count($vaind);
            foreach ($vaind as $key => $va) {
                if ($key < $varc - 1) {
                    $dva .= $va['NomViaadquisicion']['denominacion'] . ', ';
                } else {
                    $dva .= $va['NomViaadquisicion']['denominacion'];
                }
            }

            //buscando las os
            $osind = DatIndicadorviaadquisicionorganosatisface::obtenerOrganoSatisfIndicadorAsociado(
                            $i
            );
            $dos = '';
            $varc = count($osind);
            foreach ($osind as $key => $os) {
                if ($key < $varc - 1) {
                    $dos .= $os['NomOrganosatisface']['denominacion'] . ', ';
                } else {
                    $dos .= $os['NomOrganosatisface']['denominacion'];
                }
            }


            $this->_meta = ZendExt_Metadata::getInstance();
            //busco el tipo de modelo para saber en que tabla de metadatos insertar
            $datos = DatEntidadmodelo::buscartm($identidadmodelo);
            //busco todos los datos de indicadores
            $indicador = NomIndicador::BuscarIndicadoryMaterial($i);
            $planif = new DatPlanificacion();
            $planifmodel = new DatPlanificacionModel();

            //seteo los valores para insertar en DatPlanificacion los atributos de esa tabla
            $planif->idindicador = $i;
            $planif->centrosbalance = $dcb;
            $planif->viasadquisicion = $dva;
            $planif->organossatisface = $dos;
            $planif->identidadmodelo = $identidadmodelo;
            if ($tipoplan == 0)
                $planif->precio = $indicador[0]['NomIndicadorplanif']['precio'];
            else
                $planif->precio = $indicador[0]['NomIndicadorplanif']['precioventa'];

            $planif->preciodivisa = $indicador[0]['NomIndicadorplanif']['preciodivisa'];
            $planif->idunidadmedida = $indicador[0]['idumedida'];
            $planif->idcentrobalance = $indicador[0]['DatIndicadorcentrobalance'][0]
                    ['DatEntidaddatosnomenclador']['identidaddatosnomenclador'];

            $planif->cantidad = 0;
            $planif->idusuario = $idusuario;
            $planif->fecha = null;
            if ($cant > 0) {
                $planif->cantidad = $cant;
                $planif->generadobasesplan = 3;
            }

            $planif->importe = 0;

            $planif->idejercicio = $idejercicio;
            $planif->idaprobaciondemanda = 1;

            $planifmodel->Insertar($planif);

            $this->conn->beginTransaction(
            ); //mando a adicionar y luego empiezo la transaccion de nuevo
            $id = $planif->idplanificacion;

            $identidad = $this->global->Estructura->idestructura;

            $campos = $this->_meta->Metadata()->obtenerConfigFormulario(
                    $datos[0]['DatModelo']['NomTipomodelo']['idtabla']
            );

            //solo obtengo las nomencladas para poder introducirles un valor por defecto sino no funciona
            foreach ($campos->items as $c) {
                if ($c['xtype'] == 'combo') {

                    $array[] = $c['hiddenName'];
                }
            }

            if (isset($array)) {
                //selecciono el primer valor del nomenclador que sea y se lo pongo
                foreach ($array as $a) {

                    $explode = explode('_', $a);

                    //cojo el arreglo 4 que es el que me dice que tipo de nomenclador es
                    $data = ereg_replace("[^0-9]", "", $explode[4]);
                    //busco en mi tabla que valor es ese nomenclador para adicionarle el primer valor
                    $dn = NomDatosnomenclador::obtenerDatosPrimero(
                                    $data
                    ); //poner una excpcion para cuando no este el nomenclador (-)
                    $parametros[$a] = $dn->iddatosnomenclador;
                }
            }
            //mando a insertar ese indicador en metadatos y asi con el arreglo entero
            $insertaok = $this->_meta->Metadata()->insertarEnMetadatos(
                    $datos[0]['DatModelo']['NomTipomodelo']['idtabla'], $parametros, array('idplanificacion' => $id)
            );
            if ($insertaok != true) {
                $this->conn->rollback();
            }
        }

        /* actualizar balance material
          $conn = Doctrine_Manager::connection();
          $query = "select * from mod_planificacion.f_actualizar_balancematerial_insertarplanif(?, ?, ?, ?, ?)";
          $arrayIndic = implode(",", $idindicadores);
          $identidad = Doctrine::getTable('DatEntidadmodelo')->find(
          $identidadmodelo
          )->identidad;
          $paramsQuery = array($identidad, $idmodelo, $identidadmodelo,
          $idejercicio, "{" . $arrayIndic . "}");
          $conn->execute($query, $paramsQuery)->fetchAll(); */
    }

    //despues que estan adicionados los indicadores, esto les adiciona el valor a las columnas
    public function adicionarvalores($parametros, $idmodelo, $idusuario) {
        /* Lo que esta comentariado en este metodo es pa el MINFAR */
        $m = json_decode(stripslashes($parametros['filas']));
        $arrayIndic = array();
        $idejercicio = null;
        //$contInvalidos = 0;
        if ($m != null) {
            $tabla = NomTipomodelo::ObtenerIdTipoModelo($idmodelo);

            //esto es pa el minfar
            /* $params['codigotm'] = $tabla[0]['codigo'];
              $params['idmodelo'] = $idmodelo;
              $params['idtabla'] = $tabla[0]['idtabla'];
              $params['columnasDinamicas'] = DatPlan::obtenerColumnasDinamicas($params); */
            //hasta aki
            foreach ($m as $key => $std) {

                //esto es pa el minfar
                //$result = DatPlan::comprobarColumnasDinamicas($params);
                //hasta aki
                //la condicion del result tambien es pa el MINFAR
                //if (count($result)==1) {
                //si tengo que insertar em metadatos me lo mandan de la interfaz
                if ($std->insertarenmeta == 1) {
                    $this->_meta = ZendExt_Metadata::getInstance();
                    $this->_meta->Metadata()->modificarEnMetadatos(
                            $tabla[0]['idtabla'], (array) $std
                    );
                    $planif[$key] = Doctrine::getTable('DatPlanificacion')
                            ->find($std->idplanificacion);
                    $planif[$key]->idusuario = $idusuario;
                    $planif[$key]->fecha = null;
                    DatPlanificacionModel::InsertarParaModelo($planif[$key]);
                }
                if (isset($std->cantidad)) {
                    //esto es sino hay que insertar en metadatos, sino aqui porque es cantidad
                    $planif[$key] = Doctrine::getTable('DatPlanificacion')
                            ->find($std->idplanificacion);
                    $planif[$key]->cantidad = $std->cantidad;
                    $planif[$key]->idusuario = $idusuario;
                    $planif[$key]->fecha = null;
                    if ($planif[$key]->generadobasesplan != 0) {
                        $planif[$key]->generadobasesplan = 2;
                    }
                    $arrayIndic[] = $planif[$key]->idindicador;
                    $idejercicio = $planif[$key]->idejercicio;
                    DatPlanificacionModel::InsertarParaModelo($planif[$key]);
                }

                if (isset($std->ajuste)) {
                    $planif[$key] = Doctrine::getTable('DatPlanificacion')
                            ->find($std->idplanificacion);
                    $planif[$key]->ajuste = $std->ajuste;
                    $planif[$key]->idusuario = $idusuario;
                    $planif[$key]->fecha = null;
                    $arrayIndic[] = $planif[$key]->idindicador;
                    $idejercicio = $planif[$key]->idejercicio;
                    DatPlanificacionModel::InsertarParaModelo($planif[$key]);
                }
                /* } else {
                  $contInvalidos++;
                  } */
            }
        }

        //return $contInvalidos;
    }

    public function ObtenerInterfazUsuario($idmodelo) {
        $this->_meta = ZendExt_Metadata::getInstance();
        $tipomod = new NomTipomodelo();
        $tipomodelo = $tipomod->ObtenerIdTipoModelo($idmodelo);
        $result = $this->_meta->Metadata()->obtenerConfigFormulario(
                $tipomodelo[0]['idtabla']
        );
        return $result;
    }

    //Utilizado como servicio
    public function GetGridInterfaces($idtipomodelo) {
        $this->_meta = ZendExt_Metadata::getInstance();
        $tipomod = new NomTipomodelo();
        $tipomodelo = $tipomod->Buscar($idtipomodelo);
        //para pintar la interfaz los campos que son con los tipos que son, combo,label,etc.
        $result = $this->_meta->Metadata()->obtenerConfigGridPanel(
                $tipomodelo[0]['idtabla']
        );

        $array = array();
        $i = 0;
        $j = 1;


        foreach ($result->cm as $r) {
            //para quitar las cadenas largas que vienen y dejarlo en algo corto
            if (substr_count($r['dataIndex'], '.') == 2) {
                $explode = explode('.', $r['dataIndex'], 2);
                $replace = str_replace('.', '', $explode[1]);
                $array['cm'][$i]['dataIndex'] = $replace;
                $array['cm'][$i]['header'] = $r['header'];
                $i++;
            } else {
                $replace = str_replace('.', '_', $r['dataIndex']);
                $array['cm'][$i]['dataIndex'] = $replace;
                $array['cm'][$i]['header'] = $r['header'];
                $i++;
            }
        }

        $array['rd'][0]['name'] = 'iddatosnomenclador';
        foreach ($result->rd as $r) {

            if (substr_count($r['name'], '.') == 2) {
                $explode = explode('.', $r['name'], 2);
                $replace = str_replace('.', '', $explode[1]);
                $array['rd'][$j]['name'] = $replace;
                $j++;
            } else {
                $replace = str_replace('.', '_', $r['name']);
                $array['rd'][$j]['name'] = $replace;
                $j++;
            }
        }

        $editors = $this->_meta->Metadata()->obtenerConfigFormulario(
                $tipomodelo[0]['idtabla']
        );


        foreach ($array['cm'] as $col) {
            foreach ($editors->items as $j => $editor) {
                if ($editor['xtype'] == 'combo') {
                    $explode = explode('_', $editor['hiddenName']);
                    $data = ereg_replace("[^0-9]", "", $explode[4]);
                    $tipoNom = NomTiponomenclador::obtenerUriTipoNom($data);
                    if ($tipoNom[0]['uritiponomenclador'] != 'mes')
                        $valores = NomDatosnomenclador::ObtenerDatosNomenclador($data, $editor['displayField'], true);
                    else
                        $valores = NomDatosnomenclador::ObtenerDatosNomenclador($data, $editor['displayField'], false);
                    $editor['store'] = $valores;
                    $array['cm'][$j]['edit'] = $editor;
                } elseif ($col['dataIndex'] == $editor['name'] || $col['dataIndex'] == $editor['displayField']
                ) {
                    $array['cm'][$j]['edit'] = $editor;
                }
            }
        }


        $primero['iddatosnomenclador'] = 0;
        $primero['nom_datosnomenclador_denominacion'] = 'Ninguno';
        array_unshift($array['cm'][0]['edit']['store'], $primero);
        array_unshift($array['cm'][1]['edit']['store'], $primero);
        return $array;
    }

    public function camposdadoTabla($idtabla) {
        $this->_meta = ZendExt_Metadata::getInstance();
        $data = $this->_meta->Attribute()->cargarCampos($idtabla);

        $x = 0;
        foreach ($data->data as $d) {
            //Para poder excluir el id planificacion que no tiene representacion visual y nunca se modifica
            if (!($d['denominacion'] == 'idplanificacion')) {
                $array [$x] ['denomcampo'] = $d['denominacion'];
                $array [$x] ['idcampo'] = $d['idcampo'];
                $aux = self::obtenerDenomTipoCol($d['idtipodatogestor']);
                $array [$x] ['tipoDato'] = $aux[0];
            }
            $x++;
        }
        return $array;
    }

    public function camposNumericosDadoTabla($idtabla) {

        $objtipodato = DatPlanModel::obtenerTipoDatoNum('Numérico');
        $this->_meta = ZendExt_Metadata::getInstance();
        $data = $this->_meta->Attribute()->cargarCampos($idtabla);
        $x = 0;
        foreach ($data->data as $d) {
            //selecciona solo los campos que son numericos
            if ($d['idtipodatogestor'] == $objtipodato[0]) {
                //Para poder excluir todos los ID              
                if (!(strpos($d['denominacion'], 'id') !== false)) {
                    $array [$x] ['denomcampo'] = $d['denominacion'];
                    $array [$x] ['idcampo'] = $d['idcampo'];
                    $array [$x] ['tipoDato'] = $objtipodato[0];
                }
            }
            $x++;
        }
//        print_r($array);die;
        return $array;
    }

    function obtenerDenomTipoCol($idtipodatogestor) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT td.denominacion as denomtipocolumna
                        FROM mod_metadata.nom_tipodato td 
                        WHERE td.idtipodato = $idtipodatogestor";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        return $res;
    }

    function obtenerTipoDatoNum($denominacion) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT td.idtipodato  
                        FROM mod_metadata.nom_tipodato td 
                        WHERE  td.denominacion = '$denominacion'";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        return $res;
    }

    public function getdatosdeelementoplanificado($idtipomodelo, $idtabla, $idmodelo, $idplanificacion
    ) {

        $ciar = new ActiveRecordFactory();
        $this->ciar = $ciar->Factory();
        $dat = DatPlanModel::camposdadoTabla($idtabla);

        foreach ($dat as $d) {
            $temp = $d['denomcampo'];
            $campo = $d['idcampo'];
            $this->ciar->select("meta.$temp as c$campo");
        }
        $this->ciar->select(
                'ind.codigo,pla.idplanificacion,pla.idindicador,pla.idmodelo,pla.idaprobacion,ind.denominacion'
        );
        $this->ciar->from("mod_planificacionmeta.nom_$idtipomodelo meta");
        $this->ciar->join(
                'mod_planificacion.dat_planificacion pla', 'pla.idplanificacion =	meta.idplanificacion'
        );
        $this->ciar->join(
                'mod_planificacion.nom_indicador ind', 'pla.idindicador =	ind.idindicador'
        );
        $this->ciar->where('pla.idmodelo', $idmodelo);
        $this->ciar->where('meta.idplanificacion', $idplanificacion);
        $query = $this->ciar->get()->result_array();

        return $query;
    }

    public function getfila($idtipomodelo, $idplanificacion) {

        $ciar = new ActiveRecordFactory();
        $this->ciar = $ciar->Factory();

        $this->ciar->from("mod_planificacionmeta.nom_$idtipomodelo metadato");
        $this->ciar->where("metadato.idplanificacion", $idplanificacion);
        $query = $this->ciar->get()->result_array();

        return $query;
    }

    public function getDatos($idtipomodelo, $idtabla, $x, $identidadmodelo, $idejercicio, $filtros, $start, $limit, $ajustar, $arryhijos, $idmodelo, $filtroDin, $columnasamostrar) {
        if ($idejercicio == null) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            $idejercicio = $arrayIdejercicio[0]['idejercicio'];
        }
        $dat = DatPlanModel::camposdadoTabla($idtabla);
      
        foreach ($dat as $d) {
            $temp = $d['denomcampo'];
            $x->select("meta.$temp as dat_$idtipomodelo$temp");
        }

        if ($filtros) {
            foreach ($filtros as $p => $f) {
                if ($p == 'precio_condicion1') {
                    $x->where('pla.precio >', $f['precio']);
                }
                if ($p == 'precio_condicion2') {
                    $x->where('pla.precio <', $f['precio']);
                }
                if ($p == 'precio_condicion3') {
                    $x->where('pla.precio', $f['precio']);
                }

                if ($p == 'preciodivisa1') {
                    $x->where('pla.preciodivisa >', $f['preciodivisa']);
                }
                if ($p == 'preciodivisa2') {
                    $x->where('pla.preciodivisa <', $f['preciodivisa']);
                }
                if ($p == 'preciodivisa3') {
                    $x->where('pla.preciodivisa', $f['preciodivisa']);
                }

                if ($p == 'flete_condicion1') {
                    $x->where('((pla.precio*(pla.cantidad+pla.ajuste)*indpl.flete)/100)>', $f['flete']);
                }
                if ($p == 'flete_condicion2') {
                    $x->where('((pla.precio*(pla.cantidad+pla.ajuste)*indpl.flete)/100)<', $f['flete']);
                }
                if ($p == 'flete_condicion3') {
                    $x->where('((pla.precio*(pla.cantidad+pla.ajuste)*indpl.flete)/100)', $f['flete']);
                }

                if ($p == 'contingencia_condicion1') {
                    $x->where('((pla.precio*(pla.cantidad+pla.ajuste)*indpl.contingencia)/100) >', $f['contingencia']);
                }
                if ($p == 'contingencia_condicion2') {
                    $x->where('((pla.precio*(pla.cantidad+pla.ajuste)*indpl.contingencia)/100) <', $f['contingencia']);
                }
                if ($p == 'contingencia_condicion3') {
                    $x->where('((pla.precio*(pla.cantidad+pla.ajuste)*indpl.contingencia)/100)', $f['contingencia']);
                }
                if ($p == 'cantidad_condicion1') {
                    $x->where('pla.cantidad >', $f['cantidad']);
                }
                if ($p == 'cantidad_condicion2') {
                    $x->where('pla.cantidad <', $f['cantidad']);
                }
                if ($p == 'cantidad_condicion3') {
                    $x->where('pla.cantidad', $f['cantidad']);
                }
                if ($p == 'ajuste_condicion1') {
                    $x->where('pla.ajuste >', $f['ajuste']);
                }
                if ($p == 'ajuste_condicion2') {
                    $x->where('pla.ajuste <', $f['ajuste']);
                }
                if ($p == 'ajuste_condicion3') {
                    $x->where('pla.ajuste', $f['ajuste']);
                }
                if ($p == 'cantidadfinal_condicion1') {
                    $x->where('(pla.cantidad-pla.ajuste) >', $f['cantidadfinal']);
                }
                if ($p == 'cantidadfinal_condicion2') {
                    $x->where('(pla.cantidad-pla.ajuste) <', $f['cantidadfinal']);
                }
                if ($p == 'cantidadfinal_condicion3') {
                    $x->where('(pla.cantidad-pla.ajuste)', $f['cantidadfinal']);
                }
                if ($ajustar != 1) {
                    if ($p == 'importeajustado_condicion1') {
                        $x->where('(pla.precio*pla.ajuste) + (((pla.precio*pla.ajuste)'
                                . '*indpl.flete)/100) + (((pla.precio*pla.ajuste)'
                                . '*indpl.contingencia)/100) >', $f['importeajustado']);
                    }
                    if ($p == 'importeajustado_condicion2') {
                        $x->where('(pla.precio*pla.ajuste) + (((pla.precio*pla.ajuste)'
                                . '*indpl.flete)/100) + (((pla.precio*pla.ajuste)'
                                . '*indpl.contingencia)/100) <', $f['importeajustado']);
                    }
                    if ($p == 'importeajustado_condicion3') {
                        $x->where("(pla.precio*pla.ajuste) + (((pla.precio*pla.ajuste)"
                                . "*indpl.flete)/100) + (((pla.precio*pla.ajuste)"
                                . "*indpl.contingencia)/100) = "
                                . $f['importeajustado'] . "", null, false);
                    }
                } else {
                    if ($p == 'importeajustado_condicion1') {
                        $x->having('(SUM(pla.ajuste)*pla.precio) + (((SUM(pla.ajuste)*'
                                . 'pla.precio)*indpl.flete)/100) + '
                                . '(((SUM(pla.ajuste)*pla.precio)*'
                                . 'indpl.contingencia)/100) >', $f['importeajustado']);
                    }
                    if ($p == 'importeajustado_condicion2') {
                        $x->having('(SUM(pla.ajuste)*pla.precio) + '
                                . '(((SUM(pla.ajuste)*pla.precio)*'
                                . 'indpl.flete)/100) + (((SUM(pla.ajuste)'
                                . '*pla.precio)*indpl.contingencia)/100) <', $f['importeajustado']);
                    }
                    if ($p == 'importeajustado_condicion3') {
                        $x->having("(SUM(pla.ajuste)*pla.precio) + "
                                . "(((SUM(pla.ajuste)*pla.precio)*"
                                . "indpl.flete)/100) + (((SUM(pla.ajuste)*"
                                . "pla.precio)*indpl.contingencia)/100)= "
                                . $f['importeajustado'] . "", null, false);
                    }
                }
                if ($ajustar != 1) {
                    if ($p == 'importefinal_condicion1') {
                        $x->where('(pla.precio*(pla.cantidad+pla.ajuste)) +'
                                . ' (((pla.precio*(pla.cantidad+pla.ajuste))'
                                . '*indpl.flete)/100) + (((pla.precio*'
                                . '(pla.cantidad+pla.ajuste))*'
                                . 'indpl.contingencia)/100) >', $f['importefinal']);
                    }
                    if ($p == 'importefinal_condicion2') {
                        $x->where('(pla.precio*(pla.cantidad+pla.ajuste)) + '
                                . '(((pla.precio*(pla.cantidad+pla.ajuste))'
                                . '*indpl.flete)/100) + (((pla.precio*'
                                . '(pla.cantidad+pla.ajuste))*'
                                . 'indpl.contingencia)/100) <', $f['importefinal']);
                    }
                    if ($p == 'importefinal_condicion3') {
                        $x->where("(pla.precio*(pla.cantidad+pla.ajuste)) +"
                                . " (((pla.precio*(pla.cantidad+pla.ajuste))*"
                                . "indpl.flete)/100) + (((pla.precio*"
                                . "(pla.cantidad+pla.ajuste))*"
                                . "indpl.contingencia)/100)= "
                                . $f['importefinal'] . "", null, false);
                    }
                } else {
                    if ($p == 'importefinal_condicion1') {
                        $x->having('(pla.precio*SUM((pla.cantidad+pla.ajuste))) + '
                                . '(((pla.precio*SUM((pla.cantidad+pla.ajuste)))'
                                . '*indpl.flete)/100) + (((pla.precio*'
                                . 'SUM((pla.cantidad+pla.ajuste)))*'
                                . 'indpl.contingencia)/100) >', $f['importefinal']);
                    }
                    if ($p == 'importefinal_condicion2') {
                        $x->having('(pla.precio*SUM((pla.cantidad+pla.ajuste))) +'
                                . ' (((pla.precio*SUM((pla.cantidad+pla.ajuste)'
                                . '))*indpl.flete)/100) + (((pla.precio*'
                                . 'SUM((pla.cantidad+pla.ajuste)))*'
                                . 'indpl.contingencia)/100) <', $f['importefinal']);
                    }
                    if ($p == 'importefinal_condicion3') {
                        $x->having("(pla.precio*SUM((pla.cantidad+pla.ajuste))) + "
                                . "(((pla.precio*SUM((pla.cantidad+pla.ajuste)))"
                                . "*indpl.flete)/100) + (((pla.precio*"
                                . "SUM((pla.cantidad+pla.ajuste)))*i"
                                . "ndpl.contingencia)/100) = "
                                . $f['importefinal'] . "", null, false);
                    }
                }
                if ($ajustar != 1) {
                    if ($p == 'importe_condicion1') {
                        $x->where('(pla.importe + ((pla.importe*indpl.flete)/100)'
                                . ' + ((pla.importe*indpl.contingencia)/100)) >', $f['importe']);
                    }
                    if ($p == 'importe_condicion2') {
                        $x->where('(pla.importe + ((pla.importe*indpl.flete)/100)'
                                . ' + ((pla.importe*indpl.contingencia)/100)) <', $f['importe']);
                    }
                    if ($p == 'importe_condicion3') {
                        $x->where("(pla.importe + ((pla.importe*indpl.flete)/100) "
                                . "+ ((pla.importe*indpl.contingencia)/100))= "
                                . $f['importe'] . "");
                    }
                } else {
                    if ($p == 'importe_condicion1') {
                        $x->having('sum(pla.importe) + ((sum(pla.importe)*'
                                . 'indpl.flete)/100) + ((sum(pla.importe)*'
                                . 'indpl.contingencia)/100) >', $f['importe']);
                    }
                    if ($p == 'importe_condicion2') {
                        $x->having('sum(pla.importe) + ((sum(pla.importe)*'
                                . 'indpl.flete)/100) + ((sum(pla.importe)*'
                                . 'indpl.contingencia)/100) <', $f['importe']);
                    }
                    if ($p == 'importe_condicion3') {
                        $x->having("sum(pla.importe) + ((sum(pla.importe)*"
                                . "indpl.flete)/100) + ((sum(pla.importe)"
                                . "*indpl.contingencia)/100)= "
                                . $f['importe'] . "", null, false);
                    }
                }
                if ($p == 'generadobasesplan') {
                    $x->where('pla.generadobasesplan', $f[0]);
                }
                if ($p == 'idaprobaciondemanda') {
                    if ($f == 2) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    } elseif ($f == 1) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    } elseif ($f == 3) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    } elseif ($f == 4) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    } elseif ($f == 5) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    }
                }
                if ($p == 'codigo') {
                    $x->where("upper(ind.$p) LIKE '" . strtoupper($f) . "%'");
                }
                if ($p == 'numeropieza') {
                    $x->where("upper(ind.$p) LIKE '%" . strtoupper($f) . "%'");
                }
                if ($p == 'denominacion') {
                    $x->where("upper(ind.denominacion) LIKE '%" . strtoupper($f)
                            . "%'");
                }if ($p == 'descripcion') {
                    $x->where("upper(ind.descripcion) LIKE '%" . strtoupper($f)
                            . "%'");
                }
                if ($p == 'centrobalance') {
                    $x->where(
                            "upper(pla.centrosbalance) LIKE '%" . strtoupper($f)
                            . "%'"
                    );
                }
                if ($p == 'idumedida') {
                    $x->where('ind.idumedida', $f);
                }
                if ($p == 'viaadquisicion') {
                    $x->where(
                            "upper(pla.viasadquisicion) LIKE '%" . strtoupper($f) . "%'"
                    );
                }
                if ($p == 'organosatisface') {
                    $x->where(
                            "upper(pla.organossatisface) LIKE '%" . strtoupper($f) . "%'"
                    );
                }
                if ($p == 'idusuario') {
                    $x->where('pla.idusuario', $f);
                }
                if ($p == 'fecha') {
                    $fecha = explode('/', $f);
                    $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhereFiltros .= "AND pla.fecha::date<'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhereFiltros .= "AND r.fecha::date>'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhereFiltros .= "AND r.fecha::date='{$fecha}'";
                    }
                }
            }
        }

        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $x->where('ind.estado', 1);
            }
        }
        if ($ajustar != 1) {
            $selecimporte = '';
            $x->select(
                    "pla.idplanificacion,pla.idaprobaciondemanda,pla.cantidad,
                   pla.ajuste,(pla.cantidad+pla.ajuste) as cantidadfinal,pla.generadobasesplan,
                   pla.importedivisa,pla.idindicador,ind.codigo,ind.denominacion,
                   ind.idpais,ind.idformato,ind.estado,ind.nivel,ind.descripcion,
                   ind.idnaturaleza,pla.precio,pla.preciodivisa,ind.idumedida,
                   pla.importe + ((pla.importe*indpl.flete)/100)
                 + ((pla.importe*indpl.contingencia)/100) as importe,
                 (pla.precio*pla.ajuste) + (((pla.precio*pla.ajuste)*indpl.flete)/100) + (((pla.precio*
                 pla.ajuste)*indpl.contingencia)/100) as importeajustado,
                   ind.numeropieza,((pla.precio*(pla.cantidad+pla.ajuste)*
                   indpl.flete)/100) as flete,
                   (pla.precio*(pla.cantidad+pla.ajuste)) +
                   (((pla.precio*(pla.cantidad+pla.ajuste))*indpl.flete)/100)
                   + (((pla.precio*(pla.cantidad+pla.ajuste))*indpl.contingencia)
                   /100) as importefinal,((pla.precio*(pla.cantidad+pla.ajuste)*
                   indpl.contingencia)/100) as contingencia,(contingencia + flete) as importet,
                   pla.importedivisa as importemlc,pla.viasadquisicion as viaadquisicion,
                   pla.organossatisface as organosatisface,pla.centrosbalance,pla.idusuario,pla.fecha"
            );

            $x->join('mod_planificacion.dat_planificacion pla', 'pla.idplanificacion = meta.idplanificacion');
            $x->join('mod_datosmaestros.nom_indicador ind', 'pla.idindicador = ind.idindicador');
            $x->join('mod_datosmaestros.nom_indicadorplanif indpl', 'indpl.idindicador = ind.idindicador');

            $x->where('pla.identidadmodelo', $identidadmodelo);
            $x->where('pla.idejercicio', $idejercicio);
            $x->where('indpl.nivelplanif', 1);
            $x->where('indpl.idaprobacion = 4');

            if ($filtroDin) {
                foreach ($filtroDin as $f) {
                    if ($f['tipo'] == "nomenclador")
                        $x->where("meta." . $f['campo'] . ' =', $f['value']);
                    else {
                        if ($f['tipo'] == "cadena")
                            $x->where("upper(meta. {$f['campo']}) LIKE '%" . mb_convert_case($f['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                        else {
                            if ($f['tipo'] == "numero" || $f['tipo'] == "fecha")
                                if ($f['operador'] == "mayor")
                                    $x->where("meta." . $f['campo'] . ' >', $f['value']);
                            if ($f['operador'] == "menor")
                                $x->where("meta." . $f['campo'] . ' <', $f['value']);
                            if ($f['operador'] == "igual")
                                $x->where("meta." . $f['campo'] . ' =', $f['value']);
                        }
                    }
                }
            }
            if ($start && $limit) {
                $x->offset($start);
                $x->limit($limit);
            }
            $x->orderby('ind.codigo, pla.idplanificacion asc');             
            $query = $x->get()->result_array();
        } else {
            $cadena = '';
            foreach ($x->ar_select as $key => $value) {
                $alias = explode(" as ", $value);
                if (strpos($alias[1], 'id') === false) {
                    $v = $alias[0];
                    $cadena = $cadena . ',' . $v;
                }
            }
            $cadena = $cadena . ',';

            foreach ($x->ar_select as $key => $value) {
                $alias = explode(" as ", $value);
                if (strpos($alias[1], 'id') !== false || $alias[1] == 'id') {
                    unset($x->ar_select[$key]);
                }
            }

            $identmod = DatEntidadmodelo::obtenerIdEtidadModlo(
                            $idmodelo, $arryhijos
            );
            $array = Array();
            foreach ($identmod as $key => $value) {

                $array[$key] = $value['identidadmodelo'];
            }
            $selecimporte = '';

            $x->select(
                    "pla.idindicador,pla.idaprobaciondemanda,SUM(pla.cantidad) as cantidad,
                 SUM(pla.ajuste) as ajuste,(SUM(pla.cantidad)+SUM(pla.ajuste)) as cantidadfinal,
                 sum(pla.importedivisa) as importedivisa,ind.codigo,ind.denominacion,
                 ind.idpais,ind.idformato,ind.estado,ind.nivel,ind.descripcion,
                 pla.generadobasesplan,sum(pla.importe + ((pla.importe*indpl.flete)/100)
                 + ((pla.importe*indpl.contingencia)/100)) as importe,
                 (SUM(pla.ajuste)*pla.precio) +(((SUM(pla.ajuste)*pla.precio)*indpl.flete)/100)
                                  + (((SUM(pla.ajuste)*pla.precio)*indpl.contingencia)/100) as importeajustado,
                 ind.idnaturaleza,pla.precio,pla.preciodivisa,ind.idumedida,
                 ind.numeropieza,((sum(pla.precio*(pla.cantidad+pla.ajuste))
                 *indpl.flete)/100) as flete,((sum(pla.precio*(pla.cantidad+pla.ajuste))
                 *indpl.contingencia)/100) as contingencia,
                 (pla.precio*SUM((pla.cantidad+pla.ajuste))) +
                 (((pla.precio*SUM((pla.cantidad+pla.ajuste)))*indpl.flete)/100) + (((pla.precio*
                 SUM((pla.cantidad+pla.ajuste)))*indpl.contingencia)/100) as importefinal,
                 sum(pla.importedivisa) as importemlc,pla.viasadquisicion as viaadquisicion,
                 pla.organossatisface as organosatisface,pla.centrosbalance"
            );

            $x->join(
                    'mod_planificacion.dat_planificacion pla', 'pla.idplanificacion = meta.idplanificacion'
            );
            $x->join(
                    'mod_datosmaestros.nom_indicador ind', 'pla.idindicador = ind.idindicador'
            );
            $x->join(
                    'mod_datosmaestros.nom_indicadorplanif indpl', 'indpl.idindicador = ind.idindicador'
            );
            $x->where_in('pla.identidadmodelo', $array);
            $x->where('pla.idejercicio', $idejercicio);
            $x->where('indpl.nivelplanif', 1);
            $x->where('indpl.idaprobacion = 4');
            if ($filtroDin) {
                foreach ($filtroDin as $f) {
                    if ($f['tipo'] == "nomenclador")
                        $x->where("meta." . $f['campo'] . ' =', $f['value']);
                    else {
                        if ($f['tipo'] == "cadena")
                            $x->where("upper(meta. {$f['campo']}) LIKE '%" . mb_convert_case($f['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                        else {
                            if ($f['tipo'] == "numero" || $f['tipo'] == "fecha")
                                if ($f['operador'] == "mayor")
                                    $x->where("meta." . $f['campo'] . ' >', $f['value']);
                            if ($f['operador'] == "menor")
                                $x->where("meta." . $f['campo'] . ' <', $f['value']);
                            if ($f['operador'] == "igual")
                                $x->where("meta." . $f['campo'] . ' =', $f['value']);
                        }
                    }
                }
            }
            if ($start && $limit) {
                $x->offset($start)->limit($limit);
            }
            $x->groupby(
                    'pla.idindicador ' . $cadena . 'pla.idaprobaciondemanda,pla.generadobasesplan,
                        ind.codigo,ind.denominacion,ind.idpais,ind.idformato,ind.estado,
                        ind.nivel,ind.descripcion,ind.idnaturaleza,pla.precio,
                        pla.preciodivisa,ind.idumedida,ind.numeropieza,
                        indpl.flete, indpl.contingencia,pla.viasadquisicion,
                        pla.organossatisface,pla.centrosbalance'
            );

            $x->orderby('ind.codigo asc');               
            $query = $x->get()->result_array();
        }

        return $query;
    }

    public function getDatosCount($idtipomodelo, $idtabla, $x, $identidadmodelo, $idejercicio, $filtros, $start, $limit, $ajustar, $arryhijos, $idmodelo, $filtroDin, $columnasamostrar
    ) {
        if ($idejercicio == null) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            $idejercicio = $arrayIdejercicio[0]['idejercicio'];
        }
        $dat = DatPlanModel::camposdadoTabla($idtabla);
        foreach ($dat as $d) {
            $temp = $d['denomcampo'];
            $x->select("meta.$temp as dat_$idtipomodelo$temp");
        }


        if ($filtros) {
            foreach ($filtros as $p => $f) {
                if ($p == 'precio_condicion1') {
                    $x->where('pla.precio >', $f['precio']);
                }
                if ($p == 'precio_condicion2') {
                    $x->where('pla.precio <', $f['precio']);
                }
                if ($p == 'precio_condicion3') {
                    $x->where('pla.precio', $f['precio']);
                }

                if ($p == 'flete_condicion1') {
                    $x->where(
                            '((pla.precio*(pla.cantidad+pla.ajuste)*indpl.flete)/100)>', $f['flete']
                    );
                }
                if ($p == 'flete_condicion2') {
                    $x->where(
                            '((pla.precio*(pla.cantidad+pla.ajuste)*indpl.flete)/100)<', $f['flete']
                    );
                }
                if ($p == 'flete_condicion3') {
                    $x->where(
                            '((pla.precio*(pla.cantidad+pla.ajuste)*indpl.flete)/100)', $f['flete']
                    );
                }

                if ($p == 'contingencia_condicion1') {
                    $x->where(
                            '((pla.precio*(pla.cantidad+pla.ajuste)*'
                            . 'indpl.contingencia)/100) >', $f['contingencia']
                    );
                }
                if ($p == 'contingencia_condicion2') {
                    $x->where(
                            '((pla.precio*(pla.cantidad+pla.ajuste)*'
                            . 'indpl.contingencia)/100) <', $f['contingencia']
                    );
                }
                if ($p == 'contingencia_condicion3') {
                    $x->where(
                            '((pla.precio*(pla.cantidad+pla.ajuste)*'
                            . 'indpl.contingencia)/100)', $f['contingencia']
                    );
                }
                if ($p == 'cantidad_condicion1') {
                    $x->where('pla.cantidad >', $f['cantidad']);
                }
                if ($p == 'cantidad_condicion2') {
                    $x->where('pla.cantidad <', $f['cantidad']);
                }
                if ($p == 'cantidad_condicion3') {
                    $x->where('pla.cantidad', $f['cantidad']);
                }
                if ($p == 'ajuste_condicion1') {
                    $x->where('pla.ajuste >', $f['ajuste']);
                }
                if ($p == 'ajuste_condicion2') {
                    $x->where('pla.ajuste <', $f['ajuste']);
                }
                if ($p == 'ajuste_condicion3') {
                    $x->where('pla.ajuste', $f['ajuste']);
                }
                if ($p == 'cantidadfinal_condicion1') {
                    $x->where(
                            '(pla.cantidad-pla.ajuste) >', $f['cantidadfinal']
                    );
                }
                if ($p == 'cantidadfinal_condicion2') {
                    $x->where(
                            '(pla.cantidad-pla.ajuste) <', $f['cantidadfinal']
                    );
                }
                if ($p == 'cantidadfinal_condicion3') {
                    $x->where('(pla.cantidad-pla.ajuste)', $f['cantidadfinal']);
                }

                if ($p == 'preciodivisa1') {
                    $x->where(
                            '(pla.preciodivisa) >', $f['preciodivisa']
                    );
                }
                if ($p == 'preciodivisa2') {
                    $x->where(
                            '(pla.preciodivisa) <', $f['preciodivisa']
                    );
                }
                if ($p == 'preciodivisa3') {
                    $x->where('(pla.preciodivisa)', $f['preciodivisa']);
                }

                if ($ajustar != 1) {
                    if ($p == 'importeajustado_condicion1') {
                        $x->where(
                                '(pla.precio*pla.ajuste) + (((pla.precio*pla.ajuste)'
                                . '*indpl.flete)/100) + (((pla.precio*pla.ajuste)'
                                . '*indpl.contingencia)/100) >', $f['importeajustado']
                        );
                    }
                    if ($p == 'importeajustado_condicion2') {
                        $x->where(
                                '(pla.precio*pla.ajuste) + (((pla.precio*pla.ajuste)'
                                . '*indpl.flete)/100) + (((pla.precio*pla.ajuste)'
                                . '*indpl.contingencia)/100) <', $f['importeajustado']
                        );
                    }
                    if ($p == 'importeajustado_condicion3') {
                        $x->where(
                                "(pla.precio*pla.ajuste) + (((pla.precio*pla.ajuste)"
                                . "*indpl.flete)/100) + (((pla.precio*pla.ajuste)"
                                . "*indpl.contingencia)/100) = "
                                . $f['importeajustado'] . "", null, false
                        );
                    }
                } else {
                    if ($p == 'importeajustado_condicion1') {
                        $x->having(
                                '(SUM(pla.ajuste)*pla.precio) + (((SUM(pla.ajuste)*'
                                . 'pla.precio)*indpl.flete)/100) + '
                                . '(((SUM(pla.ajuste)*pla.precio)*'
                                . 'indpl.contingencia)/100) >', $f['importeajustado']
                        );
                    }
                    if ($p == 'importeajustado_condicion2') {
                        $x->having(
                                '(SUM(pla.ajuste)*pla.precio) + '
                                . '(((SUM(pla.ajuste)*pla.precio)*'
                                . 'indpl.flete)/100) + (((SUM(pla.ajuste)'
                                . '*pla.precio)*indpl.contingencia)/100) <', $f['importeajustado']
                        );
                    }
                    if ($p == 'importeajustado_condicion3') {
                        $x->having(
                                "(SUM(pla.ajuste)*pla.precio) + "
                                . "(((SUM(pla.ajuste)*pla.precio)*"
                                . "indpl.flete)/100) + (((SUM(pla.ajuste)*"
                                . "pla.precio)*indpl.contingencia)/100)= "
                                . $f['importeajustado'] . "", null, false
                        );
                    }
                }
                if ($ajustar != 1) {
                    if ($p == 'importefinal_condicion1') {
                        $x->where(
                                '(pla.precio*(pla.cantidad+pla.ajuste)) +'
                                . ' (((pla.precio*(pla.cantidad+pla.ajuste))'
                                . '*indpl.flete)/100) + (((pla.precio*'
                                . '(pla.cantidad+pla.ajuste))*'
                                . 'indpl.contingencia)/100) >', $f['importefinal']
                        );
                    }
                    if ($p == 'importefinal_condicion2') {
                        $x->where(
                                '(pla.precio*(pla.cantidad+pla.ajuste)) + '
                                . '(((pla.precio*(pla.cantidad+pla.ajuste))'
                                . '*indpl.flete)/100) + (((pla.precio*'
                                . '(pla.cantidad+pla.ajuste))*'
                                . 'indpl.contingencia)/100) <', $f['importefinal']
                        );
                    }
                    if ($p == 'importefinal_condicion3') {
                        $x->where(
                                "(pla.precio*(pla.cantidad+pla.ajuste)) +"
                                . " (((pla.precio*(pla.cantidad+pla.ajuste))*"
                                . "indpl.flete)/100) + (((pla.precio*"
                                . "(pla.cantidad+pla.ajuste))*"
                                . "indpl.contingencia)/100)= "
                                . $f['importefinal'] . "", null, false
                        );
                    }
                } else {
                    if ($p == 'importefinal_condicion1') {
                        $x->having(
                                '(pla.precio*SUM((pla.cantidad+pla.ajuste))) + '
                                . '(((pla.precio*SUM((pla.cantidad+pla.ajuste)))'
                                . '*indpl.flete)/100) + (((pla.precio*'
                                . 'SUM((pla.cantidad+pla.ajuste)))*'
                                . 'indpl.contingencia)/100) >', $f['importefinal']
                        );
                    }
                    if ($p == 'importefinal_condicion2') {
                        $x->having(
                                '(pla.precio*SUM((pla.cantidad+pla.ajuste))) +'
                                . ' (((pla.precio*SUM((pla.cantidad+pla.ajuste)'
                                . '))*indpl.flete)/100) + (((pla.precio*'
                                . 'SUM((pla.cantidad+pla.ajuste)))*'
                                . 'indpl.contingencia)/100) <', $f['importefinal']
                        );
                    }
                    if ($p == 'importefinal_condicion3') {
                        $x->having(
                                "(pla.precio*SUM((pla.cantidad+pla.ajuste))) + "
                                . "(((pla.precio*SUM((pla.cantidad+pla.ajuste)))"
                                . "*indpl.flete)/100) + (((pla.precio*"
                                . "SUM((pla.cantidad+pla.ajuste)))*i"
                                . "ndpl.contingencia)/100) = "
                                . $f['importefinal'] . "", null, false
                        );
                    }
                }
                if ($ajustar != 1) {
                    if ($p == 'importe_condicion1') {
                        $x->where(
                                '(pla.importe + ((pla.importe*indpl.flete)/100)'
                                . ' + ((pla.importe*indpl.contingencia)/100)) >', $f['importe']
                        );
                    }
                    if ($p == 'importe_condicion2') {
                        $x->where(
                                '(pla.importe + ((pla.importe*indpl.flete)/100)'
                                . ' + ((pla.importe*indpl.contingencia)/100)) <', $f['importe']
                        );
                    }
                    if ($p == 'importe_condicion3') {
                        $x->where(
                                "(pla.importe + ((pla.importe*indpl.flete)/100) "
                                . "+ ((pla.importe*indpl.contingencia)/100))= "
                                . $f['importe'] . ""
                        );
                    }
                } else {
                    if ($p == 'importe_condicion1') {
                        $x->having(
                                'sum(pla.importe) + ((sum(pla.importe)*'
                                . 'indpl.flete)/100) + ((sum(pla.importe)*'
                                . 'indpl.contingencia)/100) >', $f['importe']
                        );
                    }
                    if ($p == 'importe_condicion2') {
                        $x->having(
                                'sum(pla.importe) + ((sum(pla.importe)*'
                                . 'indpl.flete)/100) + ((sum(pla.importe)*'
                                . 'indpl.contingencia)/100) <', $f['importe']
                        );
                    }
                    if ($p == 'importe_condicion3') {
                        $x->having(
                                "sum(pla.importe) + ((sum(pla.importe)*"
                                . "indpl.flete)/100) + ((sum(pla.importe)"
                                . "*indpl.contingencia)/100)= "
                                . $f['importe'] . "", null, false
                        );
                    }
                }
                if ($p == 'generadobasesplan') {
                    //if ($f == 1) {
                    $x->where('pla.generadobasesplan', $f[0]);
                    /* } elseif ($f == 0) {
                      $x->where('pla.generadobasesplan', $f);
                      } */
                }
                if ($p == 'idaprobaciondemanda') {
                    if ($f == 2) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    } elseif ($f == 1) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    } elseif ($f == 4) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    } elseif ($f == 5) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    }
                }
                if ($p == 'codigo') {
                    $x->where("upper(ind.$p) LIKE '" . strtoupper($f) . "%'");
                }
                if ($p == 'numeropieza') {
                    $x->where("upper(ind.$p) LIKE '%" . strtoupper($f) . "%'");
                }
                if ($p == 'denominacion') {
                    $x->where(
                            "upper(ind.denominacion) LIKE '%" . strtoupper($f)
                            . "%'"
                    );
                }
                if ($p == 'descripcion') {
                    $x->where(
                            "upper(ind.descripcion) LIKE '%" . strtoupper($f)
                            . "%'"
                    );
                }
                if ($p == 'centrobalance') {
                    $x->where(
                            "upper(pla.centrosbalance) LIKE '%" . strtoupper($f)
                            . "%'"
                    );
                }
                if ($p == 'idumedida') {
                    $x->where('ind.idumedida', $f);
                }
                if ($p == 'viaadquisicion') {
                    $x->where(
                            "upper(pla.viasadquisicion) LIKE '%" . strtoupper($f)
                            . "%'"
                    );
                }
                if ($p == 'organosatisface') {
                    $x->where(
                            "upper(pla.organossatisface) LIKE '%" . strtoupper($f)
                            . "%'"
                    );
                }
            }
        }
        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $x->where('ind.estado', 1);
            }
        }
        if ($ajustar != 1) {
            $selecimporte = '';
            $x->select(
                    "pla.idplanificacion"
            );
            $x->join(
                    'mod_planificacion.dat_planificacion pla', 'pla.idplanificacion = meta.idplanificacion'
            );
            $x->join(
                    'mod_datosmaestros.nom_indicador ind', 'pla.idindicador = ind.idindicador'
            );
            $x->join(
                    'mod_datosmaestros.nom_indicadorplanif indpl', 'indpl.idindicador = ind.idindicador'
            );

            $x->where('pla.identidadmodelo', $identidadmodelo);
            $x->where('pla.idejercicio', $idejercicio);
            $x->where('indpl.nivelplanif', 1);
            $x->where('indpl.idaprobacion = 4');
            if ($filtroDin) {
                foreach ($filtroDin as $f) {
                    if ($f['tipo'] == "nomenclador")
                        $x->where("meta." . $f['campo'] . ' =', $f['value']);
                    else {
                        if ($f['tipo'] == "cadena")
                            $x->where("upper(meta. {$f['campo']}) LIKE '%" . mb_convert_case($f['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                        else {
                            if ($f['tipo'] == "numero" || $f['tipo'] == "fecha")
                                if ($f['operador'] == "mayor")
                                    $x->where("meta." . $f['campo'] . ' >', $f['value']);
                            if ($f['operador'] == "menor")
                                $x->where("meta." . $f['campo'] . ' <', $f['value']);
                            if ($f['operador'] == "igual")
                                $x->where("meta." . $f['campo'] . ' =', $f['value']);
                        }
                    }
                }
            }

            $x->orderby('ind.codigo asc');
            $query = $x->get()->result_array();
        } else {
            $cadena = '';
            foreach ($x->ar_select as $key => $value) {
                $alias = explode(" as ", $value);
                if (strpos($alias[1], 'id') === false) {
                    $v = $alias[0];
                    $cadena = $cadena . ',' . $v;
                }
            }
            $cadena = $cadena . ',';

            foreach ($x->ar_select as $key => $value) {
                $alias = explode(" as ", $value);
                if (strpos($alias[1], 'id') !== false || $alias[1] == 'id') {
                    unset($x->ar_select[$key]);
                }
            }

            $identmod = DatEntidadmodelo::obtenerIdEtidadModlo(
                            $idmodelo, $arryhijos
            );
            $array = Array();
            foreach ($identmod as $key => $value) {

                $array[$key] = $value['identidadmodelo'];
            }
            $selecimporte = '';

            $x->select(
                    "pla.idindicador"
            );

            $x->join(
                    'mod_planificacion.dat_planificacion pla', 'pla.idplanificacion = meta.idplanificacion'
            );
            $x->join(
                    'mod_datosmaestros.nom_indicador ind', 'pla.idindicador = ind.idindicador'
            );
            $x->join(
                    'mod_datosmaestros.nom_indicadorplanif indpl', 'indpl.idindicador = ind.idindicador'
            );
            $x->where_in('pla.identidadmodelo', $array);
            $x->where('pla.idejercicio', $idejercicio);
            $x->where('indpl.nivelplanif', 1);
            $x->where('indpl.idaprobacion = 4');
            if ($filtroDin) {
                foreach ($filtroDin as $f) {
                    if ($f['tipo'] == "nomenclador")
                        $x->where("meta." . $f['campo'] . ' =', $f['value']);
                    else {
                        if ($f['tipo'] == "cadena")
                            $x->where("upper(meta. {$f['campo']}) LIKE '%" . mb_convert_case($f['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                        else {
                            if ($f['tipo'] == "numero" || $f['tipo'] == "fecha")
                                if ($f['operador'] == "mayor")
                                    $x->where("meta." . $f['campo'] . ' >', $f['value']);
                            if ($f['operador'] == "menor")
                                $x->where("meta." . $f['campo'] . ' <', $f['value']);
                            if ($f['operador'] == "igual")
                                $x->where("meta." . $f['campo'] . ' =', $f['value']);
                        }
                    }
                }
            }
            $x->groupby(
                    'pla.idindicador ' . $cadena . 'pla.idaprobaciondemanda,pla.generadobasesplan,
                        ind.codigo,ind.denominacion,ind.idpais,ind.idformato,ind.estado,
                        ind.nivel,ind.descripcion,ind.idnaturaleza,pla.precio,
                        pla.preciodivisa,ind.idumedida,ind.numeropieza,
                        indpl.flete, indpl.contingencia,pla.viasadquisicion,
                        pla.organossatisface,pla.centrosbalance'
            );

            $x->orderby('ind.codigo asc');
            $query = $x->get()->result_array();
        }

        return $query;
    }

    //Para devolver el importe totalteniendo en cta los filtros del listar
    public function getDatosImporte(
            $idtipomodelo, $idtabla, $x, $identidadmodelo, $idejercicio, $filtros, $ajustar, $arryhijos, $filtroDin, $idmodelo
    ) {
        if ($idejercicio == null) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            $idejercicio = $arrayIdejercicio[0]['idejercicio'];
        }

        $dat = DatPlanModel::camposdadoTabla($idtabla);

        foreach ($dat as $d) {
            $temp = $d['denomcampo'];
            $x->select("meta.$temp as nom_$idtipomodelo$temp");
        }
        if ($filtros) {

            foreach ($filtros as $p => $f) {
                if ($p == 'precio_condicion1') {
                    $x->where('pla.precio >', $f['precio']);
                }
                if ($p == 'precio_condicion2') {
                    $x->where('pla.precio <', $f['precio']);
                }
                if ($p == 'precio_condicion3') {
                    $x->where('pla.precio', $f['precio']);
                }

                if ($p == 'flete_condicion1') {
                    $x->where('((pla.importe*indpl.flete)/100)>', $f['flete']);
                }
                if ($p == 'flete_condicion2') {
                    $x->where('((pla.importe*indpl.flete)/100)<', $f['flete']);
                }
                if ($p == 'flete_condicion3') {
                    $x->where('((pla.importe*indpl.flete)/100)', $f['flete']);
                }

                if ($p == 'contingencia_condicion1') {
                    $x->where(
                            '((pla.importe*indpl.contingencia)/100) >', $f['contingencia']
                    );
                }
                if ($p == 'contingencia_condicion2') {
                    $x->where(
                            '((pla.importe*indpl.contingencia)/100) <', $f['contingencia']
                    );
                }
                if ($p == 'contingencia_condicion3') {
                    $x->where(
                            '((pla.importe*indpl.contingencia)/100)', $f['contingencia']
                    );
                }

                if ($p == 'cantidad_condicion1') {
                    $x->where('pla.cantidad >', $f['cantidad']);
                }
                if ($p == 'cantidad_condicion2') {
                    $x->where('pla.cantidad <', $f['cantidad']);
                }
                if ($p == 'cantidad_condicion3') {
                    $x->where('pla.cantidad', $f['cantidad']);
                }
                if ($p == 'ajuste_condicion1') {
                    $x->where('pla.ajuste >', $f['ajuste']);
                }
                if ($p == 'ajuste_condicion2') {
                    $x->where('pla.ajuste <', $f['ajuste']);
                }
                if ($p == 'ajuste_condicion3') {
                    $x->where('pla.ajuste', $f['ajuste']);
                }
                if ($p == 'cantidadfinal_condicion1') {
                    $x->where(
                            '(pla.cantidad-pla.ajuste) >', $f['cantidadfinal']
                    );
                }
                if ($p == 'cantidadfinal_condicion2') {
                    $x->where(
                            '(pla.cantidad-pla.ajuste) <', $f['cantidadfinal']
                    );
                }
                if ($p == 'cantidadfinal_condicion3') {
                    $x->where('(pla.cantidad-pla.ajuste)', $f['cantidadfinal']);
                }
                if ($ajustar != 1) {
                    if ($p == 'importeajustado_condicion1') {
                        $x->where(
                                '(pla.precio*pla.ajuste) + (((pla.precio*pla.ajuste)'
                                . '*indpl.flete)/100) + (((pla.precio*pla.ajuste)*'
                                . 'indpl.contingencia)/100) >', $f['importeajustado']
                        );
                    }
                    if ($p == 'importeajustado_condicion2') {
                        $x->where(
                                '(pla.precio*pla.ajuste) + (((pla.precio*pla.ajuste)'
                                . '*indpl.flete)/100) + (((pla.precio*pla.ajuste)'
                                . '*indpl.contingencia)/100) <', $f['importeajustado']
                        );
                    }
                    if ($p == 'importeajustado_condicion3') {
                        $x->where(
                                "(pla.precio*pla.ajuste) + (((pla.precio*pla.ajuste)"
                                . "*indpl.flete)/100) + (((pla.precio*pla.ajuste)"
                                . "*indpl.contingencia)/100)= "
                                . $f['importeajustado'] . "", null, false
                        );
                    }
                } else {
                    if ($p == 'importeajustado_condicion1') {
                        $x->having(
                                '(SUM(pla.ajuste)*pla.precio) + (((SUM(pla.ajuste)'
                                . '*indpl.precio)*indpl.flete)/100) + '
                                . '(((SUM(pla.ajuste)*pla.precio)*'
                                . 'indpl.contingencia)/100) >', $f['importeajustado']
                        );
                    }
                    if ($p == 'importeajustado_condicion2') {
                        $x->having(
                                '(SUM(pla.ajuste)*pla.precio) + (((SUM(pla.ajuste)*pla.precio)*indpl.flete)/100) +
                            (((SUM(pla.ajuste)*pla.precio)*indpl.contingencia)/100) <', $f['importeajustado']
                        );
                    }
                    if ($p == 'importeajustado_condicion3') {
                        $x->having(
                                "(SUM(pla.ajuste)*pla.precio) + (((SUM(pla.ajuste)*"
                                . "pla.precio)*indpl.flete)/100) + "
                                . "(((SUM(pla.ajuste)*pla.precio)*"
                                . "indpl.contingencia)/100)= "
                                . $f['importeajustado'] . "", null, false
                        );
                    }
                }
                if ($ajustar != 1) {
                    if ($p == 'importefinal_condicion1') {
                        $x->where(
                                '(pla.precio*(pla.cantidad+pla.ajuste)) + '
                                . '(((pla.precio*(pla.cantidad+pla.ajuste))'
                                . '*indpl.flete)/100) + (((pla.precio*'
                                . '(pla.cantidad+pla.ajuste))*'
                                . 'indpl.contingencia)/100) >', $f['importefinal']
                        );
                    }
                    if ($p == 'importefinal_condicion2') {
                        $x->where(
                                '(pla.precio*(pla.cantidad+pla.ajuste)) + '
                                . '(((pla.precio*(pla.cantidad+pla.ajuste))'
                                . '*indpl.flete)/100) + (((pla.precio*'
                                . '(pla.cantidad+pla.ajuste))*'
                                . 'indpl.contingencia)/100) <', $f['importefinal']
                        );
                    }
                    if ($p == 'importefinal_condicion3') {
                        $x->where(
                                "(pla.precio*(pla.cantidad+pla.ajuste)) +"
                                . " (((pla.precio*(pla.cantidad+pla.ajuste))"
                                . "*indpl.flete)/100) + (((pla.precio*"
                                . "(pla.cantidad+pla.ajuste))*"
                                . "indpl.contingencia)/100)= "
                                . $f['importefinal'] . "", null, false
                        );
                    }
                } else {
                    if ($p == 'importefinal_condicion1') {
                        $x->having(
                                '(pla.precio*SUM((pla.cantidad+pla.ajuste))) + '
                                . '(((pla.precio*SUM((pla.cantidad+pla.ajuste)))'
                                . '*indpl.flete)/100) + (((pla.precio*'
                                . 'SUM((pla.cantidad+pla.ajuste)))*'
                                . 'indpl.contingencia)/100) >', $f['importefinal']
                        );
                    }
                    if ($p == 'importefinal_condicion2') {
                        $x->having(
                                '(pla.precio*SUM((pla.cantidad+pla.ajuste))) + '
                                . '(((pla.precio*SUM((pla.cantidad+pla.ajuste)))'
                                . '*indpl.flete)/100) + (((pla.precio*SUM'
                                . '((pla.cantidad+pla.ajuste)))*'
                                . 'indpl.contingencia)/100) <', $f['importefinal']
                        );
                    }
                    if ($p == 'importefinal_condicion3') {
                        $x->having(
                                "(pla.precio*SUM((pla.cantidad+pla.ajuste))) + "
                                . "(((pla.precio*SUM((pla.cantidad+pla.ajuste)))*"
                                . "indpl.flete)/100) + "
                                . "(((pla.precio*SUM((pla.cantidad+pla.ajuste)))*"
                                . "indpl.contingencia)/100) = "
                                . $f['importefinal'] . "", null, false
                        );
                    }
                }

                if ($ajustar != 1) {
                    if ($p == 'importe_condicion1') {
                        $x->where(
                                '(pla.importe + ((pla.importe*indpl.flete)/100) + '
                                . '((pla.importe*indpl.contingencia)/100)) >', $f['importe']
                        );
                    }
                    if ($p == 'importe_condicion2') {
                        $x->where(
                                '(pla.importe + ((pla.importe*indpl.flete)/100)'
                                . ' + ((pla.importe*indpl.contingencia)/100)) <', $f['importe']
                        );
                    }
                    if ($p == 'importe_condicion3') {
                        $x->where(
                                "(pla.importe + ((pla.importe*indpl.flete)/100) "
                                . "+ ((pla.importe*indpl.contingencia)/100))= "
                                . $f['importe'] . ""
                        );
                    }
                } else {
                    if ($p == 'importe_condicion1') {
                        $x->having(
                                'sum(pla.importe) + ((sum(pla.importe)*indpl.flete)/100)'
                                . ' + ((sum(pla.importe)*indpl.contingencia)/100) >', $f['importe']
                        );
                    }
                    if ($p == 'importe_condicion2') {
                        $x->having(
                                'sum(pla.importe) + ((sum(pla.importe)*indpl.flete)'
                                . '/100) + ((sum(pla.importe)*indpl.contingencia)/100) <', $f['importe']
                        );
                    }
                    if ($p == 'importe_condicion3') {
                        $x->having(
                                "sum(pla.importe) + ((sum(pla.importe)*indpl.flete)"
                                . "/100) + ((sum(pla.importe)*indpl.contingencia)/100)= "
                                . $f['importe'] . "", null, false
                        );
                    }
                }
                if ($p == 'generadobasesplan') {
                    $x->where('pla.generadobasesplan', $f[0]);
                }
                if ($p == 'idaprobaciondemanda') {
                    if ($f == 2) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    } elseif ($f == 1) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    } elseif ($f == 4) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    } elseif ($f == 5) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    }
                }

                if ($p == 'codigo' || $p == 'numeropieza') {
                    $x->where("upper(ind.$p) LIKE '%" . strtoupper($f) . "%'");
                }
                if ($p == 'denominacion') {
                    $x->where(
                            "upper(ind.denominacion) LIKE '%" . strtoupper($f)
                            . "%'"
                    );
                }
                if ($p == 'descripcion') {
                    $x->where(
                            "upper(ind.descripcion) LIKE '%" . strtoupper($f)
                            . "%'"
                    );
                }
                if ($p == 'centrobalance') {
                    $x->where(
                            "upper(pla.centrosbalance) LIKE '%" . strtoupper($f)
                            . "%'"
                    );
                }
                if ($p == 'idumedida') {
                    $x->where('ind.idumedida', $f);
                }
                if ($p == 'viaadquisicion') {
                    $x->where(
                            "upper(pla.viasadquisicion) LIKE '%" . strtoupper($f)
                            . "%'"
                    );
                }
                if ($p == 'organosatisface') {
                    $x->where(
                            "upper(pla.organossatisface) LIKE '%" . strtoupper($f)
                            . "%'"
                    );
                }
            }
        }
        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $x->where('ind.estado', 1);
            }
        }

        $x->ar_select = array();

        if ($ajustar != 1) {
            $x->join(
                    'mod_planificacion.dat_planificacion pla', 'pla.idplanificacion = meta.idplanificacion'
            );
            $x->join(
                    'mod_datosmaestros.nom_indicador ind', 'pla.idindicador = ind.idindicador'
            );
            $x->join(
                    'mod_datosmaestros.nom_indicadorplanif indpl', 'indpl.idindicador = ind.idindicador'
            );
            $x->where('pla.identidadmodelo', $identidadmodelo);
            $x->where('pla.idejercicio', $idejercicio);
            $x->where('indpl.nivelplanif', 1);
            $x->where('indpl.idaprobacion = 4');
            if ($filtroDin) {
                foreach ($filtroDin as $f) {
                    if ($f['tipo'] == "nomenclador")
                        $x->where("meta." . $f['campo'] . ' =', $f['value']);
                    else {
                        if ($f['tipo'] == "cadena")
                            $x->where("upper(meta. {$f['campo']}) LIKE '%" . mb_convert_case($f['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                        else {
                            if ($f['tipo'] == "numero" || $f['tipo'] == "fecha")
                                if ($f['operador'] == "mayor")
                                    $x->where("meta." . $f['campo'] . ' >', $f['value']);
                            if ($f['operador'] == "menor")
                                $x->where("meta." . $f['campo'] . ' <', $f['value']);
                            if ($f['operador'] == "igual")
                                $x->where("meta." . $f['campo'] . ' =', $f['value']);
                        }
                    }
                }
            }
            $x->select(
                    'sum( pla.importe + ((pla.importe*indpl.flete)/100) +
                    ((pla.importe*indpl.contingencia)/100)) as importetotal,
                sum((pla.precio*(pla.cantidad+pla.ajuste))*
                (indpl.flete/100)) as importeflete,
                sum((pla.precio*(pla.cantidad+pla.ajuste))*
                (indpl.contingencia/100)) as importecontingencia,
                sum((pla.preciodivisa*pla.cantidad)) as importedivisa,
                sum((pla.precio*pla.ajuste) + (((pla.precio*pla.ajuste)*
                indpl.flete)/100) + (((pla.precio*pla.ajuste)*
                indpl.contingencia)/100)) as importeajustado,
                sum((pla.precio*(pla.cantidad+pla.ajuste)) +
                (((pla.precio*(pla.cantidad+pla.ajuste))*indpl.flete)/100) +
                (((pla.precio*(pla.cantidad+pla.ajuste))*
                indpl.contingencia)/100)) as importefinal'
            );
            $x->select(
                    'sum(pla.cantidad) as cantidadfinal'
            );
            $query = $x->get()->result_array();
        } else {

            $identmod = DatEntidadmodelo::obtenerIdEtidadModlo(
                            $idmodelo, $arryhijos
            );
            $array = Array();
            foreach ($identmod as $key => $value) {

                $array[$key] = $value['identidadmodelo'];
            }
            $x->select(
                    'sum(pla.importe + ((pla.importe*indpl.flete)/100) +
                    ((pla.importe*indpl.contingencia)/100)) as importetotal,
                sum((pla.precio*(pla.cantidad+pla.ajuste))*(indpl.flete/100))
                as importeflete,sum((pla.precio*(pla.cantidad+pla.ajuste))*
                (indpl.contingencia/100)) as importecontingencia,
                sum((pla.preciodivisa*pla.cantidad)) as importedivisa,
                sum((pla.precio*pla.ajuste) + ((pla.precio*pla.ajuste)
                *indpl.flete)/100 + ((pla.precio*pla.ajuste)*
                indpl.contingencia)/100 ) as importeajustado,
                sum((pla.precio*(pla.cantidad+pla.ajuste)) +
                ((pla.precio*(pla.cantidad+pla.ajuste))*indpl.flete)/100 +
                ((pla.precio*(pla.cantidad+pla.ajuste))*indpl.contingencia)/100 ) as importefinal'
            );

            $x->join(
                    'mod_planificacion.dat_planificacion pla', 'pla.idplanificacion = meta.idplanificacion'
            );
            $x->join(
                    'mod_datosmaestros.nom_indicador ind', 'pla.idindicador = ind.idindicador'
            );
            $x->join(
                    'mod_datosmaestros.nom_indicadorplanif indpl', 'indpl.idindicador = ind.idindicador'
            );

            $x->where_in('pla.identidadmodelo', $array);
            $x->where('pla.idejercicio', $idejercicio);
            $x->where('indpl.nivelplanif', 1);
            $x->where('indpl.idaprobacion = 4');
            if ($filtroDin) {
                foreach ($filtroDin as $f) {
                    if ($f['tipo'] == "nomenclador")
                        $x->where("meta." . $f['campo'] . ' =', $f['value']);
                    else {
                        if ($f['tipo'] == "cadena")
                            $x->where("upper(meta. {$f['campo']}) LIKE '%" . mb_convert_case($f['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                        else {
                            if ($f['tipo'] == "numero" || $f['tipo'] == "fecha")
                                if ($f['operador'] == "mayor")
                                    $x->where("meta." . $f['campo'] . ' >', $f['value']);
                            if ($f['operador'] == "menor")
                                $x->where("meta." . $f['campo'] . ' <', $f['value']);
                            if ($f['operador'] == "igual")
                                $x->where("meta." . $f['campo'] . ' =', $f['value']);
                        }
                    }
                }
            }
            $query = $x->get()->result_array();
        }
        return $query;


        //REVISAR SI ES NECESARIO
        $arrayind = array();
        foreach ($query as $key => $value) {
            $arrayind[] = $value['idindicador'];
        }

        if ($arrayind[0] != null) {
            $queryViaOrg = new Doctrine_Query();
            $arrayIndvia = $queryViaOrg->from('DatIndicadorviaadquisicion iva')
                            ->innerJoin('iva.NomViaadquisicion va')
                            ->innerJoin(
                                    'iva.DatIndicadorviaadquisicionorganosatisface vaos '
                                    . 'WITH iva.idindicador = vaos.idindicador AND '
                                    . 'iva.idviaadquisicion = vaos.idviaadquisicion'
                            )
                            ->innerJoin('vaos.NomOrganosatisface')
                            ->whereIn('iva.idindicador', $arrayind)
                            ->execute()->toArray();

            $arrayind = array();
            foreach ($arrayIndvia as $key => $value) {
                unset($arrayIndvia[$key]);
                $arrayIndvia['id' . $value['idindicador']][] = $value;
            }

            //el inddicador puede tener varias vias
            foreach ($query as $indice => $valorINndplan) {
                $arrayVias = $arrayIndvia['id'
                        . $valorINndplan['idindicador']];
                $vias = "";
                $organos = "";
                $separadorvias = '';
                if (is_array($arrayVias)) {
                    foreach ($arrayVias as $valorVia) {
                        $vias .= $separadorvias
                                . $valorVia['NomViaadquisicion']['denominacion'];
                        $query[$indice]['idorganos'] = '';
                        $arrayIndviaorg = $valorVia['DatIndicadorviaadquisicionorganosatisface'];
                        $coma = '';
                        if (is_array($arrayIndviaorg)) {
                            foreach ($arrayIndviaorg as $key => $viaorg) {
                                $organos .= $coma
                                        . $viaorg['NomOrganosatisface']['denominacion'];
                                $coma = ',';
                            }
                        }
                        $organos = $separadorvias . $organos;
                        $separadorvias = '/';
                    }
                }
                $query[$indice]['viaadquisicion'] = $vias;
                $query[$indice]['organosatisface'] = $organos;
            }
        }

        return $query;
    }

    //solo cuenta los elementos del grid del modelo el mismo metodo de arriba sin start o limit
    public function getDatostotal(
            $idtipomodelo, $idtabla, $x, $identidadmodelo, $idejercicio, $filtros, $ajustar, $arryhijos, $idmodelo
    ) {
        if ($idejercicio == null) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            $idejercicio = $arrayIdejercicio[0]['idejercicio'];
        }
        $dat = DatPlanModel::camposdadoTabla($idtabla);

        foreach ($dat as $d) {
            $temp = $d['denomcampo'];
            $x->select("meta.$temp as nom_$idtipomodelo$temp");
        }
        if ($filtros) {

            foreach ($filtros as $p => $f) {
                if ($p == 'precio_condicion1') {
                    $x->where('pla.precio >', $f['precio']);
                }
                if ($p == 'precio_condicion2') {
                    $x->where('pla.precio <', $f['precio']);
                }
                if ($p == 'precio_condicion3') {
                    $x->where('pla.precio', $f['precio']);
                }

                if ($p == 'cantidad_condicion1') {
                    $x->where('pla.cantidad >', $f['cantidad']);
                }
                if ($p == 'cantidad_condicion2') {
                    $x->where('pla.cantidad <', $f['cantidad']);
                }
                if ($p == 'cantidad_condicion3') {
                    $x->where('pla.cantidad', $f['cantidad']);
                }

                if ($p == 'importe_condicion1') {
                    $x->where('pla.importe >', $f['importe']);
                }
                if ($p == 'importe_condicion2') {
                    $x->where('pla.importe <', $f['importe']);
                }
                if ($p == 'importe_condicion3') {
                    $x->where('pla.importe', $f['importe']);
                }
                if ($p == 'generadobasesplan') {
                    //if ($f == 1) {
                    $x->where('pla.generadobasesplan', $f[0]);
//                    } elseif ($f == 0) {
//                        $x->where('pla.generadobasesplan', $f);
//                    }
                }
                if ($p == 'idaprobaciondemanda') {
                    if ($f == 2) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    } elseif ($f == 1) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    } elseif ($f == 4) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    }
                }

                if ($p == 'codigo' || $p == 'numeropieza' || $p == 'idumedida'
                ) {
                    $x->where("upper(ind.$p) LIKE '%" . strtoupper($f) . "%'");
                }
                if ($p == 'denominacion') {
                    $x->where(
                            "upper(ind.denominacion) LIKE '%" . strtoupper($f)
                            . "%'"
                    );
                }
                if ($p == 'centrobalance') {
                    $x->where('edn.identidad', $f);
                }
            }
        }


        if ($ajustar != 1) {
            $x->select(
                    'pla.idplanificacion,pla.idaprobaciondemanda,pla.cantidad,'
                    . 'edn.identidad,pla.importe,pla.idindicador,ind.codigo,'
                    . 'ind.denominacion,ind.idpais,ind.idformato,ind.estado,ind.nivel,'
                    . 'ind.descripcion,ind.naturaleza,pla.precio,ind.idumedida,ind.numeropieza'
            );

            $x->join(
                    'mod_planificacion.dat_planificacion pla', 'pla.idplanificacion = meta.idplanificacion'
            );

            $x->join(
                    'mod_planificacion.nom_indicador ind', 'pla.idindicador = ind.idindicador'
            );

            $x->join(
                    'mod_planificacion.dat_indicadorcentrobalance cb', 'pla.idindicador = cb.idindicador'
            );

            $x->join(
                    'mod_planificacion.dat_entidaddatosnomenclador edn', 'edn.identidaddatosnomenclador = cb.identidaddatosnomenclador'
            );


            $x->where('pla.identidadmodelo', $identidadmodelo);

            $x->where('pla.idejercicio', $idejercicio);
            $x->groupby('pla.idaprobaciondemanda');
            $x->ar_select = array();
            $x->select('COUNT(distinct("pla"."idindicador"))');
            $query = $x->get()->result_array();
            if (count($query) > 1) {
                $aux = 0;
                foreach ($query as $value) {
                    $aux += $value['count'];
                }
            } else {
                $aux = $query[0]['count'];
            }
            return $aux;
        } else {

            $identmod = DatEntidadmodelo::obtenerIdEtidadModlo(
                            $idmodelo, $arryhijos
            );

            $array = Array();
            foreach ($identmod as $key => $value) {

                $array[$key] = $value['identidadmodelo'];
            }

            $x->join(
                    'mod_planificacion.dat_planificacion pla', 'pla.idplanificacion = meta.idplanificacion'
            );

            $x->join(
                    'mod_planificacion.nom_indicador ind', 'pla.idindicador = ind.idindicador'
            );

            $x->join(
                    'mod_planificacion.dat_indicadorcentrobalance cb', 'pla.idindicador = cb.idindicador'
            );

            $x->join(
                    'mod_planificacion.dat_entidaddatosnomenclador edn', 'edn.identidaddatosnomenclador = cb.identidaddatosnomenclador'
            );

            $x->where_in('pla.identidadmodelo', $array);

            $x->where('pla.idejercicio', $idejercicio);
            $x->groupby('pla.idaprobaciondemanda');

            $x->ar_select = array();
            $x->select('COUNT(distinct("pla"."idindicador"))');

            $query = $x->get()->result_array();
            if (count($query) > 1) {
                $aux = 0;
                foreach ($query as $value) {
                    $aux += $value['count'];
                }
            } else {
                $aux = $query[0]['count'];
            }
            return $aux;
        }
    }

    //para obtener el importe total
    public function getImportetotal(
            $x, $idejercicio, $filtros, $arryhijos, $idmodelo
    ) {
        //$dat = DatPlanModel::camposdadoTabla($idtabla);

        /* foreach ($dat as $d) {
          } */
        if ($idejercicio == null) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            $idejercicio = $arrayIdejercicio[0]['idejercicio'];
        }

        if ($filtros) {

            foreach ($filtros as $p => $f) {
                if ($p == 'precio_condicion1') {
                    $x->where('pla.precio >', $f['precio']);
                }
                if ($p == 'precio_condicion2') {
                    $x->where('pla.precio <', $f['precio']);
                }
                if ($p == 'precio_condicion3') {
                    $x->where('pla.precio', $f['precio']);
                }

                if ($p == 'cantidad_condicion1') {
                    $x->where('pla.cantidad >', $f['cantidad']);
                }
                if ($p == 'cantidad_condicion2') {
                    $x->where('pla.cantidad <', $f['cantidad']);
                }
                if ($p == 'cantidad_condicion3') {
                    $x->where('pla.cantidad', $f['cantidad']);
                }

                if ($p == 'importe_condicion1') {
                    $x->where('pla.importe >', $f['importe']);
                }
                if ($p == 'importe_condicion2') {
                    $x->where('pla.importe <', $f['importe']);
                }
                if ($p == 'importe_condicion3') {
                    $x->where('pla.importe', $f['importe']);
                }
                if ($p == 'generadobasesplan') {
                    //if ($f == 1) {
                    $x->where('pla.generadobasesplan', $f[0]);
//                    } elseif ($f == 0) {
//                        $x->where('pla.generadobasesplan', $f);
//                    }
                }
                if ($p == 'idaprobaciondemanda') {
                    if ($f == 2) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    } elseif ($f == 1) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    } elseif ($f == 4) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    }
                }

                if ($p == 'codigo' || $p == 'numeropieza' || $p == 'idumedida'
                ) {
                    $x->where("upper(ind.$p) LIKE '%" . strtoupper($f) . "%'");
                }
                if ($p == 'denominacion') {
                    $x->where(
                            "upper(ind.denominacion) LIKE '%" . strtoupper($f)
                            . "%'"
                    );
                }
                if ($p == 'centrobalance') {
                    $x->where('edn.identidad', $f);
                }
            }
        }


        $identmod = DatEntidadmodelo::obtenerIdEtidadModlo(
                        $idmodelo, $arryhijos
        );

        $array = Array();
        foreach ($identmod as $key => $value) {

            $array[$key] = $value['identidadmodelo'];
        }
        //$rober = implode(',', $array);
        $x->ar_select = array();
        $x->select(
                'sum((ind.precio*pla.cantidad) + ((ind.precio*pla.cantidad)*
            ind.flete)/100 + ((ind.precio*pla.cantidad)*ind.contingencia)/100 )
            as importetotal, sum((ind.precio*pla.cantidad)*(ind.flete/100)) as
            importeflete,  sum((ind.precio*pla.cantidad)*(ind.contingencia/100))
            as importecontingencia,sum((ind.preciodivisa*pla.cantidad)) as importedivisa'
        );
        $x->join(
                'mod_planificacion.dat_planificacion pla', 'pla.idplanificacion = meta.idplanificacion'
        );

        $x->join(
                'mod_planificacion.nom_indicador ind', 'pla.idindicador = ind.idindicador'
        );

        $x->join(
                'mod_planificacion.dat_indicadorcentrobalance cb', 'pla.idindicador = cb.idindicador'
        );

        $x->join(
                'mod_planificacion.dat_entidaddatosnomenclador edn', 'edn.identidaddatosnomenclador = cb.identidaddatosnomenclador'
        );

        $x->where_in('pla.identidadmodelo', $array);

        $x->where('pla.idejercicio', $idejercicio);

        $query = $x->get()->result_array();

        $query[0]['suma'] = number_format(
                $query[0]['importetotal'], '3', '.', ','
        );
        $query[0]['importeflete'] = number_format(
                $query[0]['importeflete'], '3', '.', ','
        );
        $query[0]['importecontingencia'] = number_format(
                $query[0]['importecontingencia'], '3', '.', ','
        );
        $query[0]['importedivisa'] = number_format(
                $query[0]['importedivisa'], '3', '.', ','
        );

        return $query[0];
    }

    //para obtener el importe total en divisa
    public function getImportedivisatotal(
            $x, $idejercicio, $filtros, $arryhijos, $idmodelo
    ) {
        //$dat = DatPlanModel::camposdadoTabla($idtabla);


        if ($filtros) {

            foreach ($filtros as $p => $f) {
                if ($p == 'precio_condicion1') {
                    $x->where('pla.precio >', $f['precio']);
                }
                if ($p == 'precio_condicion2') {
                    $x->where('pla.precio <', $f['precio']);
                }
                if ($p == 'precio_condicion3') {
                    $x->where('pla.precio', $f['precio']);
                }

                if ($p == 'cantidad_condicion1') {
                    $x->where('pla.cantidad >', $f['cantidad']);
                }
                if ($p == 'cantidad_condicion2') {
                    $x->where('pla.cantidad <', $f['cantidad']);
                }
                if ($p == 'cantidad_condicion3') {
                    $x->where('pla.cantidad', $f['cantidad']);
                }

                if ($p == 'importe_condicion1') {
                    $x->where('pla.importe >', $f['importe']);
                }
                if ($p == 'importe_condicion2') {
                    $x->where('pla.importe <', $f['importe']);
                }
                if ($p == 'importe_condicion3') {
                    $x->where('pla.importe', $f['importe']);
                }
                if ($p == 'generadobasesplan') {
                    //if ($f == 1) {
                    $x->where('pla.generadobasesplan', $f[0]);
//                    } elseif ($f == 0) {
//                        $x->where('pla.generadobasesplan', $f);
//                    }
                }
                if ($p == 'idaprobaciondemanda') {
                    if ($f == 2) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    } elseif ($f == 1) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    } elseif ($f == 4) {
                        $x->where('pla.idaprobaciondemanda', $f);
                    }
                }

                if ($p == 'codigo' || $p == 'numeropieza' || $p == 'idumedida'
                ) {
                    $x->where("upper(ind.$p) LIKE '%" . strtoupper($f) . "%'");
                }
                if ($p == 'denominacion') {
                    $x->where(
                            "upper(ind.denominacion) LIKE '%" . strtoupper($f)
                            . "%'"
                    );
                }
                if ($p == 'centrobalance') {
                    $x->where('edn.identidad', $f);
                }
            }
        }


        $identmod = DatEntidadmodelo::obtenerIdEtidadModlo(
                        $idmodelo, $arryhijos
        );

        $array = Array();
        foreach ($identmod as $key => $value) {

            $array[$key] = $value['identidadmodelo'];
        }
        //$rober = implode(',', $array);
        $x->ar_select = array();
        $x->select('sum(pla.importedivisa) as importedivisatotal');
        $x->join(
                'mod_planificacion.dat_planificacion pla', 'pla.idplanificacion = meta.idplanificacion'
        );

        $x->join(
                'mod_planificacion.nom_indicador ind', 'pla.idindicador = ind.idindicador'
        );

        $x->join(
                'mod_planificacion.dat_indicadorcentrobalance cb', 'pla.idindicador = cb.idindicador'
        );

        $x->join(
                'mod_planificacion.dat_entidaddatosnomenclador edn', 'edn.identidaddatosnomenclador = cb.identidaddatosnomenclador'
        );
        $x->where_in('pla.identidadmodelo', $array);

        $x->where('pla.idejercicio', $idejercicio);

        $query = $x->get()->result_array();
        return $query[0]['importedivisatotal'];
    }

    public function CargarFormParaModificarIndModelo($idmodelo, $idplanificacion
    ) {
        $dat = null;
        $tipomod = new NomTipomodelo();
        $tipomodelo = $tipomod->ObtenerIdTipoModelo($idmodelo);
        $datos = DatPlanModel::getDatosDeElementoPlanificado(
                        $tipomodelo[0]['idtipomodelo'], $tipomodelo[0]['idtabla'], $idmodelo, $idplanificacion
        );

        // Devuelvo para la IU el elemento
        $dat->totalRec = 1;
        $dat->datos = $datos;
        return $dat;
    }

    public function CargarFuenteDeDatos($idmodelo) {
        $idtipomodelo = DatModelo::getTipoModeloDadoIdModelo($idmodelo);
        $modelos = DatModelo::ObtenerModelosTipoDistinto(
                        $idtipomodelo, $idmodelo
        );
        return $modelos;
    }

    public function listarEOD() {
        $entidades = DatEntidaddatosnomenclador::getEntidadDadoComportamiento(
                        2
        );
        $p = 0;
        foreach ($entidades as $id) {
            $datosEntidad = $this->integrator->metadatos->DameEstructura(
                    $id['identidad']
            );
            $denomentidades[$p]['denominacion'] = $datosEntidad[0]->denominacion;
            $denomentidades[$p]['identidad'] = $id['identidad'];
            $p++;
        }
        return $denomentidades;
    }

    public function listarplanes() {
        return DatPlan::listatodosplanes();
    }

    public function obtenerPlanesPriaridad($parametros) {
        $data = DatEntidadmodelo::getModeloAsocEntidadPrioridad($parametros);

        return $data;
    }

//este metodo se emple para listar el combo de los planes en el componente balance material
    public function obtenerPlanesEntidad($parametros) {
        $data = DatEntidadmodelo::obtenerPlanesBalance($parametros);

        return $data;
    }

    //este método se emplea para listar el combo de los planes en el componente Control de la ejecución
    // de la planificación
    public function obtenerPlanesEntidadPlanif($parametros) {
        $data = DatEntidadmodelo::obtenerPlanesEntidadPlanif($parametros);
        //no pueden cambiar la llamada a este metodo porque se esta usando
        //en dos componentes(Control de la ejecucion de la planificacion y desglose de indicadores por fecha)
        //$data = DatEntidadmodelo::obtenerPlanesEntidadPlanifdemanda($parametros);

        return $data;
    }

    //este metodo se emple para listar el combo de los planes en el componente recuperaciones
    public function obtenerPlanesEntidades($parametros) {
        $data = DatEntidadmodelo::obtenerPlanesRecuperacion($parametros);

        return $data;
    }

    public function obtenerPlanesEntidadesPP($parametros, $idejecicio) {
        $data = DatEntidadmodelo::servBP_getModeloAsocEntidades($parametros, $idejecicio);

        return $data;
    }

    public function obtenerPlanesEntidadesPPN($parametros, $idejecicio) {
        $data = DatEntidadmodelo::servBP_getModeloAsocEntidadesN($parametros, $idejecicio);

        return $data;
    }

    public function calcularImporteTotal($parametros) {
        $modeloActEnt = new DatActividadentidad();
        if ($parametros['componente'] == 2)
            $data = DatPlanificacion::calcularImporteTotal($parametros);
        if ($parametros['componente'] == 3)
            $data = DatPlanificacion::calcularImporteTotalB($parametros);
        if ($parametros['componente'] == 1)
            $data = DatActividadentidad::calcularImporteTotalN($parametros);

        return $data;
    }

    public function obtenerTotalPlanesPriaridad($parametros) {
        $data = DatEntidadmodelo::getTotalModeloAsocEntidadPrioridad(
                        $parametros
        );

        return $data;
    }

    public function actualizarPrioridadEntidadModelo($arrayprioridad) {

        foreach ($arrayprioridad as $value) {
            $objentidadmodelo = Doctrine::getTable('DatEntidadmodelo')->find(
                    $value->entidadmodelo
            );
            if ($objentidadmodelo->identidadmodelo != null) {
                $objentidadmodelo->prioridad = $value->prioridad;
                $objentidadmodelo->save();
                $data = 1;
            } else {
                $data = 2;
            }
        }

        return $data;
    }

    public function listarArbolTipoPlanes($parametros) {

        $result = NomDatosnomenclador:: obtenerTipoNomenclador($parametros);

        foreach ($result as $key => $value) {
            if ($value['cantdescendente'] > 0) {
                $result[$key]['leaf'] = false;

                if ($parametros['ruta'] != 'undefined') {
                    $ruta = explode('+', $parametros['ruta']);
                    foreach ($ruta as $r) {
                        $id = explode('-', $r);
                        $id = $id[0];
                        if ($value['iddatosnomenclador'] == $id) {
                            $result[$key]['expanded'] = true;
                            $result[$key]['selected'] = true;
                        }
                    }
                }
            } else {
                $result[$key]['leaf'] = true;
            }
            $result[$key]['text'] = $value['denominacion'];
            $result[$key]['id'] = ($value['iddatosnomenclador'] == 'undefined' ? 'root-' : $value['iddatosnomenclador'] . '-') . rand(
                            1, 1000000
            );
        }
        return $result;
    }

    public function listarAsociados($parametros) {

        $result = DatPlanificacion::obtenerAsociadosNAE($parametros);
        foreach ($result->data as $key => $value) {

            $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                    Array($value['idumedida'])
            );

            $result->data[$key]['denoum'] = $unidades[0]['abreviaturaunidadmedida'];

            $datosenti = $this->integrator->metadatos->DameEstructura(
                    $value['identidad']
            );

            $result->data[$key]['denocentrobalance'] = strtoupper(
                    $datosenti[0]->denominacion
            );
        }
        return $result;
    }

    public function listarTotalAsociados($parametros) {

        $result = DatPlanificacion::obtenerTotalAsociadosNAE($parametros);

        return $result;
    }

    public function listarAsociadosExportar($parametros) {
        $result = DatPlanificacion::obtenerAsociadosNAEExportar($parametros);
        foreach ($result->data as $key => $value) {

            $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                    Array($value->idumedida)
            );
            $result->data[$key]->denoum = $unidades->abreviatura;
            $datosenti = $this->integrator->metadatos->DameEstructura(
                    $value->identidad
            );
            $result->data[$key]->denocentrobalance = strtoupper(
                    $datosenti[0]->denominacion
            );
        }
        return $result;
    }

    public function actualizarDatosBalance($parametros) {

        $paramsQuery = array($parametros['identidad'], $parametros['idmodelo'],
            $parametros['identidadmodelo'],
            $parametros['idejercicio']);
        $conn = Doctrine_Manager::connection();

        switch ($parametros['paso']) {
            case '1':
                $query = "select * from mod_planificacion.f_actualizarbalancematerial(?, ?, ?, ?)";
                break;
            case '2':
                $query = "select * from mod_planificacion.f_actualizarodpadre(?, ?, ?, ?)";
                break;
            case '3':
                $paramsQuery = array($parametros['idmodelo'],
                    $parametros['idejercicio']);
                $query = "select * from mod_planificacion.f_actualizarcb(?, ?)";
                break;
            default: {
                    
                }
        }
        $res = $conn->execute($query, $paramsQuery);
        $result = $res->fetchAll();
        return $result;
    }

    public function getEtiquetasTabla($idtabla) {

        //temporal cambiar por codeniter
        $conn = Doctrine_Manager::connection();
        $sqlMeta = " SELECT c.idtabla, c.denominacion, comp.idcomponente, comp.etiqueta,comp.idcampo
            FROM mod_metadata.dat_campo c
            Inner Join mod_metadata.dat_componente comp ON( c.idcampo = comp.idcampo  )
            WHERE c.idtabla = ? ";

        $res = $conn->execute($sqlMeta, array($idtabla));
        return $res->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getEtiquetasxTipoDatoTabla($idtabla, $tipodato) {

        $conn = Doctrine_Manager::connection();
        $sqlMeta = " SELECT 
                        c.idtabla,
                        c.denominacion,
                        comp.idcomponente,
                        comp.etiqueta,
                        comp.idcampo
                      FROM
                        mod_metadata.dat_campo c
                        INNER JOIN mod_metadata.dat_componente comp ON (c.idcampo = comp.idcampo)
                        INNER JOIN mod_metadata.dat_tipodatogestor tdg ON (c.idtipodatogestor = tdg.idtipodatogestor)
                        INNER JOIN mod_metadata.nom_tipodato td ON (tdg.idtipodato = td.idtipodato)
                      WHERE
                        c.idtabla = $idtabla AND 
                        td.idtipodato = $tipodato";
        $res = $conn->execute($sqlMeta);
        return $res->fetchAll(PDO::FETCH_ASSOC);
    }

    private function addWhereConParams(&$where, &$paramsQuery, $columCond, $param
    ) {
        $where .= " AND " . $columCond;
        $paramsQuery[] = $param;
    }

    private function addWhereSinParams(&$where, $columCond) {
        $where .= " AND " . $columCond;
    }

    public function getIndCC($parametros) {
        $conn = Doctrine_Manager::connection();
        $parametros['idcentrobalance'] = ($parametros['idcentrobalance'] ? $parametros['idcentrobalance'] : 0);

        if ($parametros['hoja'] == 'true') {


            $paramsQuery = array();

            $addwhere = "";

            if ($parametros['filtros']) {
                foreach ($parametros['filtros'] as $p => $s) {
                    if ($s != null) {
                        if ($p == 'codigo') {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "ind.codigo  LIKE ? ", ("$s%")
                            );
                        } elseif ($p == 'denominacion') {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "upper(ind.denominacion)  LIKE ? ", ("%" . strtoupper($s) . "%")
                            );
                        } elseif ($p == 'numeropieza') {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "upper(ind.numeropieza)  LIKE ? ", ("%" . strtoupper($s) . "%")
                            );
                        } elseif ($p == 'precio_condicion1' || $p == 'precio_condicion2' || $p == 'precio_condicion3'
                        ) {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "ind.precio " . $s['condicion'] . " ? ", $s['precio']
                            );
                        } elseif ($p == 'denominacioncb') {
                            $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom($s);
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, 'indcb.identidaddatosnomenclador =?', $entidaddatosnom[0]['identidaddatosnomenclador']
                            );
                        } elseif ($p == 'idumedida') {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, 'ind.idumedida =?', $s
                            );
                        } elseif ($p == 'idmodelo') {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, 'm.idmodelo =?', $s
                            );
                        } elseif ($p == 'cantidad_condicion1' || $p == 'cantidad_condicion2' || $p == 'cantidad_condicion3'
                        ) {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, " pla.cantidad  " . $s['condicion'] . " ? ", $s['cantidad']
                            );
                        } elseif ($p == 'coberturaparcialestimada_condicion1' || $p == 'coberturaparcialestimada_condicion2' || $p == 'coberturaparcialestimada_condicion3'
                        ) {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "odcte.cpe " . $s['condicion'] . " ? ", $s['coberturaparcialestimada']
                            );
                        } elseif ($p == 'coberturatotalestimada_condicion1' || $p == 'coberturatotalestimada_condicion2' || $p == 'coberturatotalestimada_condicion3'
                        ) {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "ae.coberturatotalestimada " . $s['condicion']
                                    . " ? ", $s['coberturatotalestimada']
                            );
                        } elseif ($p == 'importe_condicion1' || $p == 'importe_condicion2' || $p == 'importe_condicion3'
                        ) {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "pla.importe " . $s['condicion'] . " ? ", $s['importe']
                            );
                        } elseif ($p == 'importemlc_condicion1' || $p == 'importemlc_condicion2' || $p == 'importemlc_condicion3'
                        ) {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "(odcte.demanda*ind.preciodivisa) "
                                    . $s['condicion'] . " ? ", $s['importemlc']
                            );
                        } elseif ($p == 'flete_condicion1' || $p == 'flete_condicion2' || $p == 'flete_condicion3'
                        ) {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "((odcte.demanda*ind.precio)*ind.flete/100) "
                                    . $s['condicion'] . " ? ", $s['flete']
                            );
                        } elseif ($p == 'contingencia_condicion1' || $p == 'contingencia_condicion2' || $p == 'contingencia_condicion3'
                        ) {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "((odcte.demanda*ind.precio)*ind.contingencia/100) "
                                    . $s['condicion'] . " ? ", $s['contingencia']
                            );
                        } elseif ($p == 'importefila_condicion1' || $p == 'importefila_condicion2' || $p == 'importefila_condicion3'
                        ) {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "((((odcte.demanda*ind.precio)*ind.flete)/100)+"
                                    . "(((odcte.demanda*ind.precio)*ind.contingencia)/"
                                    . "100)+(odcte.demanda*ind.precio)) "
                                    . $s['condicion'] . " ? ", $s['importefila']
                            );
                        } else {
                            if ($p == 'idaprobacionsi') {
                                self::addWhereSinParams(
                                        $addwhere, "aeod.idaprobacion > 1"
                                );
                            } else {
                                if ($p == 'idaprobacionno') {
                                    self::addWhereSinParams(
                                            $addwhere, "aeod.idaprobacion = 1 "
                                    );
                                } elseif ($p == 'demanda_condicion1' || $p == 'demanda_condicion2' || $p == 'demanda_condicion3'
                                ) {
                                    self::addWhereConParams(
                                            $addwhere, $paramsQuery, "odcte.demanda " . $s['condicion']
                                            . " ? ", $s['demanda']
                                    );
                                }
                            }
                        }
                    }
                }
            }

            $sqlMeta = "select DISTINCT(pla.idindicador), ind.denominacion, ind.numeropieza, ind.idumedida, ind.codigo
             from mod_planificacion.dat_planificacion pla
            INNER JOIN mod_planificacion.nom_indicador ind ON (pla.idindicador = ind.idindicador)
            INNER JOIN mod_planificacion.dat_entidadmodelo entm ON (pla.identidadmodelo = entm.identidadmodelo)
            INNER JOIN mod_planificacion.dat_modelo m ON (m.idmodelo = entm.idmodelo)
            WHERE (pla.identidadmodelo IN(Select entm.identidadmodelo FROM mod_planificacion.dat_entidadmodelo entm
                                          where entm.identidad = "
                    . $parametros['identidad'] . " )
			OR pla.idcentrobalance = " . $parametros['idcentrobalance']
                    . ") AND pla.idejercicio = "
                    . $parametros['idejercicio'] . "
            $addwhere

            OFFSET " . $parametros['start'] . "
            LIMIT  " . $parametros['limit'] . " ";

            $sqlmetaSegunda = "select COUNT(DISTINCT(pla.idindicador)) as total

             from mod_planificacion.dat_planificacion pla
            INNER JOIN mod_planificacion.nom_indicador ind ON (pla.idindicador = ind.idindicador)
            INNER JOIN mod_planificacion.dat_entidadmodelo entm ON (pla.identidadmodelo = entm.identidadmodelo)
            INNER JOIN mod_planificacion.dat_modelo m ON (m.idmodelo = entm.idmodelo)
            WHERE (pla.identidadmodelo IN(Select entm.identidadmodelo FROM mod_planificacion.dat_entidadmodelo entm
                                          where entm.identidad = "
                    . $parametros['identidad'] . " )
			OR pla.idcentrobalance = " . $parametros['idcentrobalance']
                    . ") AND pla.idejercicio = "
                    . $parametros['idejercicio'] . "
             $addwhere";

            $data->data = $conn->execute($sqlMeta, $paramsQuery)->fetchAll(
                    PDO::FETCH_ASSOC
            );
            $resultado = $conn->execute($sqlmetaSegunda, $paramsQuery)
                    ->fetchAll(
                    PDO::FETCH_ASSOC
            );
            $data->total = $resultado[0]['total'];
        } else {


            $paramsQuery = array();

            $addwhere = "";

            if ($parametros['filtros']) {
                foreach ($parametros['filtros'] as $p => $s) {
                    if ($s != null) {
                        if ($p == 'codigo') {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "ind.codigo  LIKE ? ", ("$s%")
                            );
                        } elseif ($p == 'denominacion') {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "upper(ind.denominacion)  LIKE ? ", ("%" . strtoupper($s) . "%")
                            );
                        } elseif ($p == 'numeropieza') {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "upper(ind.numeropieza)  LIKE ? ", ("%" . strtoupper($s) . "%")
                            );
                        } elseif ($p == 'precio_condicion1' || $p == 'precio_condicion2' || $p == 'precio_condicion3'
                        ) {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "ind.precio " . $s['condicion'] . " ? ", $s['precio']
                            );
                        } elseif ($p == 'denominacioncb') {
                            $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom($s);
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, 'indcb.identidaddatosnomenclador =?', $entidaddatosnom[0]['identidaddatosnomenclador']
                            );
                        } elseif ($p == 'idumedida') {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, 'ind.idumedida =?', $s
                            );
                        } elseif ($p == 'idmodelo') {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, 'm.idmodelo =?', $s
                            );
                        } elseif ($p == 'cantidad_condicion1' || $p == 'cantidad_condicion2' || $p == 'cantidad_condicion3'
                        ) {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, " pla.cantidad  " . $s['condicion'] . " ? ", $s['cantidad']
                            );
                        } elseif ($p == 'coberturaparcialestimada_condicion1' || $p == 'coberturaparcialestimada_condicion2' || $p == 'coberturaparcialestimada_condicion3'
                        ) {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "odcte.cpe " . $s['condicion'] . " ? ", $s['coberturaparcialestimada']
                            );
                        } elseif ($p == 'coberturatotalestimada_condicion1' || $p == 'coberturatotalestimada_condicion2' || $p == 'coberturatotalestimada_condicion3'
                        ) {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "ae.coberturatotalestimada " . $s['condicion']
                                    . " ? ", $s['coberturatotalestimada']
                            );
                        } elseif ($p == 'importe_condicion1' || $p == 'importe_condicion2' || $p == 'importe_condicion3'
                        ) {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "pla.importe " . $s['condicion'] . " ? ", $s['importe']
                            );
                        } elseif ($p == 'importemlc_condicion1' || $p == 'importemlc_condicion2' || $p == 'importemlc_condicion3'
                        ) {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "(odcte.demanda*ind.preciodivisa) "
                                    . $s['condicion'] . " ? ", $s['importemlc']
                            );
                        } elseif ($p == 'flete_condicion1' || $p == 'flete_condicion2' || $p == 'flete_condicion3'
                        ) {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "((odcte.demanda*ind.precio)*ind.flete/100) "
                                    . $s['condicion'] . " ? ", $s['flete']
                            );
                        } elseif ($p == 'contingencia_condicion1' || $p == 'contingencia_condicion2' || $p == 'contingencia_condicion3'
                        ) {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "((odcte.demanda*ind.precio)*ind.contingencia/100) "
                                    . $s['condicion'] . " ? ", $s['contingencia']
                            );
                        } elseif ($p == 'importefila_condicion1' || $p == 'importefila_condicion2' || $p == 'importefila_condicion3'
                        ) {
                            self::addWhereConParams(
                                    $addwhere, $paramsQuery, "((((odcte.demanda*ind.precio)*ind.flete)/100)+"
                                    . "(((odcte.demanda*ind.precio)*ind.contingencia)"
                                    . "/100)+(odcte.demanda*ind.precio)) "
                                    . $s['condicion'] . " ? ", $s['importefila']
                            );
                        } else {
                            if ($p == 'idaprobacionsi') {
                                self::addWhereSinParams(
                                        $addwhere, "aeod.idaprobacion > 1"
                                );
                            } else {
                                if ($p == 'idaprobacionno') {
                                    self::addWhereSinParams(
                                            $addwhere, "aeod.idaprobacion = 1 "
                                    );
                                } elseif ($p == 'demanda_condicion1' || $p == 'demanda_condicion2' || $p == 'demanda_condicion3'
                                ) {
                                    self::addWhereConParams(
                                            $addwhere, $paramsQuery, "odcte.demanda " . $s['condicion']
                                            . " ? ", $s['demanda']
                                    );
                                }
                            }
                        }
                    }
                }
            }

            $sqlMetatercera = "SELECT DISTINCT(pla.idindicador),ind.denominacion,ind.numeropieza,
    ind.idumedida,ind.codigo from mod_planificacion.dat_planificacion pla
    INNER JOIN mod_planificacion.nom_indicador ind ON (pla.idindicador = ind.idindicador)
    INNER JOIN mod_planificacion.dat_entidadmodelo entm ON (pla.identidadmodelo = entm.identidadmodelo)
    INNER JOIN mod_planificacion.dat_modelo m ON (m.idmodelo = entm.idmodelo)
    WHERE (pla.identidadmodelo IN(Select entm.identidadmodelo 
    FROM mod_planificacion.dat_entidadmodelo entm
    where entm.identidad IN( " . implode(",", $parametros['entidadeshijas']) . "))
    OR pla.idcentrobalance = " . $parametros['idcentrobalance']
                    . ")AND pla.idejercicio = "
                    . $parametros['idejercicio'] . "$addwhere OFFSET "
                    . $parametros['start'] . "
            LIMIT  " . $parametros['limit'] . " ";

            $sqlMetacuarta = "SELECT COUNT(DISTINCT(pla.idindicador)) as total
        from mod_planificacion.dat_planificacion pla
        INNER JOIN mod_planificacion.nom_indicador ind ON(pla.idindicador = ind.idindicador)
        INNER JOIN mod_planificacion.dat_entidadmodelo entm ON (pla.identidadmodelo = entm.identidadmodelo)
        INNER JOIN mod_planificacion.dat_modelo m ON (m.idmodelo = entm.idmodelo)
        WHERE (pla.identidadmodelo IN(Select entm.identidadmodelo FROM mod_planificacion.dat_entidadmodelo entm
        where entm.identidad IN(" . implode(",", $parametros['entidadeshijas'])
                    . "))
	R pla.idcentrobalance = " . $parametros['idcentrobalance'] . ")"
                    . " AND pla.idejercicio = " . $parametros['idejercicio']
                    . "$addwhere";
            $data->data = $conn->execute($sqlMetatercera, $paramsQuery)
                    ->fetchAll(
                    PDO::FETCH_ASSOC
            );
            $resultado = $conn->execute($sqlMetacuarta, $paramsQuery)->fetchAll(
                    PDO::FETCH_ASSOC
            );
            $data->total = $resultado[0]['total'];
        }

        return $data;
    }

    public function verificarEjercicioActual_Elaboracion($idejercicio) {
        $query = new Doctrine_Query();
        $query->select('ejer.idejercicio')
                ->from('NomEjercicioplanificacion ejer')
                ->innerjoin('ejer.NomDatosnomenclador in')
                ->where(
                        "ejer.idejercicio=? AND ejer.actual=1 AND in.uridatosnomenclador='elaboracion'", $idejercicio
        );
        if ($query->count() > 0) {
            return true;
        }
        return false;
    }

    public function cargarImporteInicial($parametros) {

        if (isset($parametros['arrayidplanificacion'][0])) {
            $res = implode(",", $parametros['arrayidplanificacion']);
            $paramsQuery = array("{" . $res . "}", null, null);
        } else {
            $paramsQuery = array(null, $parametros['identidadmodelo'],
                $parametros['idejercicio']);
        }
        $query = "select * from mod_planificacion.f_calcimporteinicialplan(?,?,?);";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($query, $paramsQuery);
        $result = $result->fetchAll(PDO::FETCH_ASSOC);

        if ($result) {
            return $result[0]['f_calcimporteinicialplan'];
        } else {
            return '23';
        }
    }

    public function calcularAjuste($parametros) {
        if ($parametros['idejercicio']) {
            $idejercicio = $parametros['idejercicio'];
        } else {
            $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            $idejercicio = $idejercicio[0]['idejercicio'];
        }

        if (isset($parametros['arrayidplanificacion'][0])) {
            $res = implode(",", $parametros['arrayidplanificacion']);
            $paramsquery = array("{" . $res . "}", null,
                $parametros['porciento'], null);
        } else {
            $paramsquery = array(null, $parametros['identidadmodelo'],
                $parametros['porciento'],
                $parametros['idejercicio']);
        }
        $query = "select * from mod_planificacion.f_calcajusteplan(?,?,?,?);";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($query, $paramsquery);
        $result = $result->fetchAll(PDO::FETCH_ASSOC);

        if ($result) {
            return $result[0]['f_calcajusteplan'];
        } else {
            return '23';
        }
    }

    public function insertarAjuste($parametros) {
        if ($parametros['idejercicio']) {
            $idejercicio = $parametros['idejercicio'];
        } else {
            $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            $idejercicio = $idejercicio[0]['idejercicio'];
        }

        if (isset($parametros['arrayidplanificacion'][0])) {
            $res = implode(",", $parametros['arrayidplanificacion']);
            $paramsQuery = array("{" . $res . "}", null, null);
        } else {
            $paramsQuery = array(null, $parametros['identidadmodelo'],
                $parametros['idejercicio']);
        }

        $query = "select * from mod_planificacion.f_insertarajusteplan(?,?,?);";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($query, $paramsQuery);
        $result = $result->fetchAll(PDO::FETCH_ASSOC);
        ;
        if ($result) {
            if ($result[0]['f_insertarajusteplan'] == 1) {
                return '1';
            } else {
                return '23';
            }
        }
    }

    public function listarVerActXInd($params) {
        $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        $identidades = implode(',', $entidades);
        $addWhereFiltros = "";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $addWhereFiltros .= " AND na.codigo LIKE '" . $datos['data']['value'] . "%'";
                } elseif ($datos['field'] == 'denominacion') {
                    $addWhereFiltros .= " AND upper(na.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['field'] == 'nivel') {
                    $cond = "=";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $addWhereFiltros .= " AND COALESCE(aea.nivelactividadautomatico, 0) + COALESCE(
                          aem.nivelactividadmanual, 0) + COALESCE(aep.nivelactividadproduccion, 0
                          ) + COALESCE(ae.ajuste, 0) $cond {$datos['data']['value'] }";
                }
            }
        }
        $params['limit'] = ($params['limit'] != null) ? $params['limit'] : 20;
        $conn = Doctrine_Manager::connection();
        $query = "SELECT na.codigo,
                        count(*) OVER() as total,
                        na.idactividad,
                        na.denominacion,
                        COALESCE(aea.nivelactividadautomatico, 0) + COALESCE(
                          aem.nivelactividadmanual, 0) + COALESCE(aep.nivelactividadproduccion, 0
                          ) + COALESCE(ae.ajuste, 0) as nivel,
                        na.idespecialidad,
                        ae.identidad
                 FROM mod_datosmaestros.nom_indicador i
                      INNER JOIN mod_planificacion.dat_norma n ON i.idindicador = n.idindicador
                        AND n.idejercicio = {$params['idejercicio']}
                      INNER JOIN mod_planificacion.nom_actividad na ON n.idactividad =
                        na.idactividad
                      INNER JOIN mod_planificacion.dat_actividadentidad ae ON na.idactividad =
                        ae.idactividad AND ae.idejercicio = {$params['idejercicio']}
                      LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
                        aem.idactividadentidad = ae.idactividadentidad)
                      LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
                        aea.idactividadentidad = ae.idactividadentidad)
                      LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
                        aep.idactividadentidad = ae.idactividadentidad)
                 WHERE ae.identidad in($identidades) AND
                       i.idindicador = {$params['idindicador']}
                    $addWhereFiltros
                    OFFSET {$params['start']}
                    LIMIT {$params['limit']}";
        $data->data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);


        $data->total = $data->data[0] ['total'];
        $integrator = ZendExt_IoC::getInstance();


        $arrayDenespecialidaddes = array();

        foreach ($data->data as $indice => $valor) {
            if ($arrayDenespecialidaddes["cod_" . $valor['idespecialidad']] == null
            ) {
                $integrator = ZendExt_IoC::getInstance();

                $especialidades = $integrator->datosmaestros->obtenerEspecialidadPorId(
                        $valor['idespecialidad']
                );
                $arrayDenespecialidaddes["den_" . $valor['idespecialidad']] = $especialidades[0]->denespecialidad;
                $arrayDenespecialidaddes["cod_" . $valor['idespecialidad']] = $especialidades[0]->codespecialidad;
            }
            $data->data[$indice]['denespecialidad'] = $arrayDenespecialidaddes["den_" . $valor['idespecialidad']];
            $data->data[$indice]['codespecialidad'] = $arrayDenespecialidaddes["cod_" . $valor['idespecialidad']];
            $datosentidad = $integrator->metadatos->DameEstructura($valor['identidad']);
            $data->data[$indice]['denentidad'] = $datosentidad[0]->denominacion;
        }

        return $data;
    }

    public function insertarIndAlImportar($value, $indicador, $identidadmodelo, $idejercicio, $idmodelo, $int
    ) {
        //Capturo una instancia de Doctrine_Manager para manejar la conexion
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        //buscando los cb
        $cbind = NomIndicador::getCbIndicador($indicador[0]['idindicador']);
        $dcb = '';
        $varc = count($cbind);
        foreach ($cbind as $key => $cb) {
            $objt = new DatEntidaddatosnomenclador();
            $cbind = $objt->getEntidadDadoIdDatos(
                    $cb['identidaddatosnomenclador']
            );
            $datosentidad = $int->metadatos->DameEstructura(
                    $cbind[0]['identidad']
            );
            if ($key < $varc - 1) {
                $dcb .= $datosentidad[0]->denominacion . ', ';
            } else {
                $dcb .= $datosentidad[0]->denominacion;
            }
        }

        //buscando las va
        $vaind = DatIndicadorviaadquisicion::ObtenerViasAdquisIndicadorAsociado(
                        $indicador[0]['idindicador']
        );
        $dva = '';
        $varc = count($vaind);
        foreach ($vaind as $key => $va) {
            if ($key < $varc - 1) {
                $dva .= $va['NomViaadquisicion']['denominacion'] . ', ';
            } else {
                $dva .= $va['NomViaadquisicion']['denominacion'];
            }
        }

        //buscando las os
        $osind = DatIndicadorviaadquisicionorganosatisface::obtenerOrganoSatisfIndicadorAsociadoPlanif(
                        $indicador[0]['idindicador']
        );

        $dos = '';
        $varc = count($osind);
        foreach ($osind as $key => $os) {
            if ($key < $varc - 1) {
                $dos .= $os['denominacion'] . ', ';
            } else {
                $dos .= $os['denominacion'];
            }
        }
        $this->_meta = ZendExt_Metadata::getInstance();

        //$planifmodel = new DatPlanificacionModel();
        $obj = new DatPlanificacion();
        $obj->idindicador = $indicador[0]['idindicador'];
        $obj->identidadmodelo = $identidadmodelo;
        $obj->idejercicio = $idejercicio;
        $obj->precio = $indicador[0]['NomIndicadorplanif']['precio'];
        $obj->idunidadmedida = $indicador[0]['idumedida'];
        $obj->idcentrobalance = $indicador[0]['DatIndicadorcentrobalance'][0]['identidaddatosnomenclador'];
        $obj->cantidad = $value->cantindicadores;
        $obj->generadobasesplan = 0;
        $obj->centrosbalance = $dcb;
        $obj->viasadquisicion = $dva;
        $obj->organossatisface = $dos;
        $obj->preciodivisa = $indicador[0]['NomIndicadorplanif']['preciodivisa'];
        $obj->ajuste = 0;
        $obj->save();
        //Ejecuto la transaccion de doctrine para poder insertar el meta correspondiente a la tupla
        $con->commit();
        //Habro una nueva transaccion de doctrine para la proxima ejecucion
        $con->beginTransaction();
        //insertando en metadatos
        $id = $obj->idplanificacion;
        $idtabla = NomTipomodelo::dameIdtabla($idmodelo[0]['idmodelo']);

        $parametros['controller'] = 'gestplanes';
        $parametros['action'] = 'adicionarindicadores';
        $parametros['module'] = 'default';
        $parametros['idmodelo'] = $idmodelo[0]['idmodelo'];
        $arrayind[] = $indicador[0]['idindicador'];
        $parametros['indicadores'] = json_encode($arrayind);
        $parametros['identidadmodelo'] = $identidadmodelo;
        $parametros['idejercicio'] = $idejercicio;

        $campos = $this->_meta->Metadata()->obtenerConfigFormulario(
                $idtabla[0]['idtabla']
        );

        //solo obtengo las nomencladas para poder introducirles un valor por defecto sino no funciona
        foreach ($campos->items as $c) {


            if ($c['xtype'] == 'combo') {

                $array[] = $c['hiddenName'];
            }
        }


        if (isset($array)) {
            //selecciono el primer valor del nomenclador que sea y se lo pongo
            foreach ($array as $a) {

                $explode = explode('_', $a);

                //cojo el arreglo 4 que es el que me dice que tipo de nomenclador es
                $data = ereg_replace("[^0-9]", "", $explode[4]);

                //busco en mi tabla que valor es ese nomenclador para adicionarle el primer valor
                $dn = NomDatosnomenclador::obtenerDatosPrimero(
                                $data
                );
                // //poner una excpcion para cuando no este el nomenclador (-)
                $parametros[$a] = $dn->iddatosnomenclador;
                //$parametros[$a] = $iddatosnomdenact;
            }
        }


        $insertaok = $this->_meta->Metadata()->insertarEnMetadatos(
                $idtabla[0]['idtabla'], $parametros, array('idplanificacion' => $id)
        );
        if ($insertaok != true) {
            $this->conn->rollback();
        }
    }

    public function getModelosIngresosgastos($parametros) {
        $result = DatModelo::listarModelosIngresosGastos($parametros);
        return $result;
    }

    public function listarModelosIngresosGastosReales($parametros) {
        $result = DatModelo::listarModelosIngresosGastosReales($parametros);
        return $result;
    }

    public function getDatosServicio($idtipomodelo, $idtabla, $x, $identidadmodelo, $idejercicio, $start, $limit, $ajustar, $arryhijos, $idmodelo
    ) {

        $dat = DatPlanModel::camposdadoTabla($idtabla);
        foreach ($dat as $d) {
            $temp = $d['denomcampo'];
            $x->select("meta.$temp as dat_$idtipomodelo$temp");
        }

        $x->where('ind.estado', 1);

        if ($ajustar != 1) {
            $selecimporte = '';

            $x->select(
                    "pla.idplanificacion,pla.idaprobaciondemanda,pla.cantidad,
                   pla.ajuste,(pla.cantidad+pla.ajuste) as cantidadfinal,pla.generadobasesplan,
                   pla.importedivisa,pla.idindicador,ind.codigo,ind.denominacion,
                   ind.idpais,ind.idformato,ind.estado,ind.nivel,ind.descripcion,
                   ind.idnaturaleza,pla.precio,pla.preciodivisa,ind.idumedida,
                   pla.importe + ((pla.importe*indpl.flete)/100)
                 + ((pla.importe*indpl.contingencia)/100) as importe,
                 (pla.precio*pla.ajuste) + (((pla.precio*pla.ajuste)*indpl.flete)/100) + (((pla.precio*
                 pla.ajuste)*indpl.contingencia)/100) as importeajustado,
                   ind.numeropieza,((pla.precio*(pla.cantidad+pla.ajuste)*
                   indpl.flete)/100) as flete,
                   (pla.precio*(pla.cantidad+pla.ajuste)) +
                   (((pla.precio*(pla.cantidad+pla.ajuste))*indpl.flete)/100)
                   + (((pla.precio*(pla.cantidad+pla.ajuste))*indpl.contingencia)
                   /100) as importefinal,((pla.precio*(pla.cantidad+pla.ajuste)*
                   indpl.contingencia)/100) as contingencia,(contingencia + flete) as importet,
                   pla.importedivisa as importemlc,pla.viasadquisicion as viaadquisicion,
                   pla.organossatisface as organosatisface,pla.centrosbalance"
            );
            //este importefila no se esta utilizando

            $x->join(
                    'mod_planificacion.dat_planificacion pla', 'pla.idplanificacion = meta.idplanificacion'
            );
            $x->join(
                    'mod_datosmaestros.nom_indicador ind', 'pla.idindicador = ind.idindicador'
            );
            $x->join(
                    'mod_datosmaestros.nom_indicadorplanif indpl', 'indpl.idindicador = ind.idindicador'
            );

            $x->where('pla.identidadmodelo', $identidadmodelo);
            $x->where('pla.idejercicio', $idejercicio);
            $x->where('indpl.nivelplanif', 1);
            $x->where('indpl.idaprobacion = 4');
            if ($limit) {
                $x->offset($start);
                $x->limit($limit);
            }

            $x->orderby('ind.codigo asc');
            $query = $x->get()->result_array();
        } else {
            $cadena = '';

            foreach ($x->ar_select as $key => $value) {
                $alias = explode(" as ", $value);
                if (strpos($alias[1], 'id') === false) {
                    $v = $alias[0];
                    $cadena = $cadena . ',' . $v;
                }
            }
            $tem = '';
            $p = '';
            foreach ($x->ar_join as $key => $value) {
                $expresion = explode(" = ", $value);
                $expresionUno = split('"', $expresion[1]);
                foreach ($expresionUno as $v) {
                    $tem = $tem . $v;
                }
                $tem = $tem . ',';
            }

            $cadena = $cadena . ',' . $tem;

            foreach ($x->ar_select as $key => $value) {
                $alias = explode(" as ", $value);
                if (strpos($alias[1], 'id') !== false || $alias[1] == 'id') {
                    unset($x->ar_select[$key]);
                }
            }


            $identmod = DatEntidadmodelo::obtenerIdEtidadModlo(
                            $idmodelo, $arryhijos
            );
            $array = Array();
            foreach ($identmod as $key => $value) {

                $array[$key] = $value['identidadmodelo'];
            }
            $selecimporte = '';

            //$rober = implode(',', $array);

            $x->select(
                    "pla.idindicador,pla.idaprobaciondemanda,SUM(pla.cantidad) as cantidad,
                 SUM(pla.ajuste) as ajuste,(SUM(pla.cantidad)+SUM(pla.ajuste)) as cantidadfinal,
                 sum(pla.importedivisa) as importedivisa,ind.codigo,ind.denominacion,
                 ind.idpais,ind.idformato,ind.estado,ind.nivel,ind.descripcion,
                 pla.generadobasesplan,sum(pla.importe + ((pla.importe*indpl.flete)/100)
                 + ((pla.importe*indpl.contingencia)/100)) as importe,
                 (SUM(pla.ajuste)*pla.precio) +(((SUM(pla.ajuste)*pla.precio)*indpl.flete)/100)
                                  + (((SUM(pla.ajuste)*pla.precio)*indpl.contingencia)/100) as importeajustado,
                 ind.idnaturaleza,pla.precio,pla.preciodivisa,ind.idumedida,
                 ind.numeropieza,((sum(pla.precio*(pla.cantidad+pla.ajuste))
                 *indpl.flete)/100) as flete,((sum(pla.precio*(pla.cantidad+pla.ajuste))
                 *indpl.contingencia)/100) as contingencia,
                 (pla.precio*SUM((pla.cantidad+pla.ajuste))) +
                 (((pla.precio*SUM((pla.cantidad+pla.ajuste)))*indpl.flete)/100) + (((pla.precio*
                 SUM((pla.cantidad+pla.ajuste)))*indpl.contingencia)/100) as importefinal,
                 sum(pla.importedivisa) as importemlc,pla.viasadquisicion as viaadquisicion,
                 pla.organossatisface as organosatisface,pla.centrosbalance"
            );

            $x->join(
                    'mod_planificacion.dat_planificacion pla', 'pla.idplanificacion = meta.idplanificacion'
            );
            $x->join(
                    'mod_datosmaestros.nom_indicador ind', 'pla.idindicador = ind.idindicador'
            );
            $x->join(
                    'mod_datosmaestros.nom_indicadorplanif indpl', 'indpl.idindicador = ind.idindicador'
            );
            $x->where_in('pla.identidadmodelo', $array);
            $x->where('pla.idejercicio', $idejercicio);
            $x->where('indpl.nivelplanif', 1);
            $x->where('indpl.idaprobacion = 4');
            $x->offset($start)->limit($limit);
            $x->groupby(
                    'pla.idindicador ' . $cadena . 'pla.idaprobaciondemanda,pla.generadobasesplan,
                        ind.codigo,ind.denominacion,ind.idpais,ind.idformato,ind.estado,
                        ind.nivel,ind.descripcion,ind.idnaturaleza,pla.precio,
                        pla.preciodivisa,ind.idumedida,ind.numeropieza,
                        indpl.flete, indpl.contingencia,pla.viasadquisicion,
                        pla.organossatisface,pla.centrosbalance'
            );

            $x->orderby('ind.codigo asc');
            $query = $x->get()->result_array();
        }

        return $query;
    }

}
