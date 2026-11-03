<?php

/**
 * @author    Nestor Bernal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpcalendarioModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function CargarElementosCal() {
        $actividades = DatElementos::DameActividades();
        return $actividades;
    }

    public function CargarElCalendarioActividades($parametros) {
        $arraynom = array();
        $arrayestados = $this->pIntegrator->workflow->EstadosVerDoc($parametros->idusuariosession, $idtipodoc = 3);
        $cero = 0;
        $uno = 1;
        $parametros->nolimit = 1;
        //if(!isset($parametros->actual));
        //$parametros->actual = 1;
        //print_r($parametros);die;  
        $parametros->idusuario = $parametros->idusuariosession;
        $arraycalendarios = $this->pIntegrator->configuracionpdo->listarCalendariosConfigurados($parametros);
        if (isset($arraycalendarios[0])) {
            $involucrados = explode(',', trim($arraycalendarios[0]['involucrados'], '{}'));
            foreach ($involucrados as $id) {
                $arrayinvolact[]['llaveinvolucrado'] = $id . $cero;
                $arrayinvolact[]['llaveinvolucrado'] = $id . $uno;
            }
            if (isset($arraycalendarios[0]['idcategoriaactividad'])) {
                $arraynom[]['idnomenclador'] = $arraycalendarios[0]['idcategoriaactividad'];
            }
            if (isset($arraycalendarios[0]['idtipoactividad'])) {
                $arraynom[]['idnomenclador'] = $arraycalendarios[0]['idtipoactividad'];
            }
            if (isset($arraycalendarios[0]['estadoaprobacion'])) {
                $parametros->estadoaprobacion = $arraycalendarios[0]['estadoaprobacion'];
            }
        }
        //temporal
        //$parametros->personal = 1;
        //solo se visualizan las actividades donde el usuario en session esta involucrado
        if ($parametros->personal) {

            $arrayinvolact[]['llaveinvolucrado'] = $parametros->idusuariosession . $cero;
            $arrayinvolact[]['llaveinvolucrado'] = $parametros->idusuariosession . $uno;
            $arraygrupos = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario($parametros->idusuariosession);
            if (isset($arraygrupos[0])) {
                foreach ($arraygrupos as $grupo) {
                    $arrayinvolact[]['llaveinvolucrado'] = $grupo['idgrupo'] . $cero;
                    $arrayinvolact[]['llaveinvolucrado'] = $grupo['idgrupo'] . $uno;
                }
            }
        } else {
            // se visualizan las actividades con autores e involucrados deseados
            if ($parametros->busqueda) {
                if (isset($parametros->arrayinvolucrados[0])) {
                    foreach ($parametros->arrayinvolucrados as $involucrado) {
                        $id = $involucrado->idusuario;
                        if ($involucrado->tipo == 0) {
                            $id = $involucrado->idgrupo;
                        }
                        $arrayinvolact[]['llaveinvolucrado'] = $id . $cero;
                        $arrayinvolact[]['llaveinvolucrado'] = $id . $uno;
                        if ($involucrado->tipo == 1) {
                            $arraygrupos = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario($id);
                            if (isset($arraygrupos[0])) {
                                foreach ($arraygrupos as $grupo) {
                                    $arrayinvolact[]['llaveinvolucrado'] = $grupo['idgrupo'] . $cero;
                                    $arrayinvolact[]['llaveinvolucrado'] = $grupo['idgrupo'] . $uno;
                                }
                            }
                        }
                    }
                }
            } else {
                $arrayinvolact[]['llaveinvolucrado'] = $parametros->idcalendario . $cero;
                $arrayinvolact[]['llaveinvolucrado'] = $parametros->idcalendario . $uno;
                $arraygrupos = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario($parametros->idcalendario);
                if (isset($arraygrupos[0])) {
                    foreach ($arraygrupos as $grupo) {
                        $arrayinvolact[]['llaveinvolucrado'] = $grupo['idgrupo'] . $cero;
                        $arrayinvolact[]['llaveinvolucrado'] = $grupo['idgrupo'] . $uno;
                    }
                }
            }
        }
        if (isset($parametros->arrayautores[0])) {
            foreach ($parametros->arrayautores as $autor) {
                $arrayautoresact[]['idusuariocrea'] = $autor->idautor;
            }
        }
        if (isset($parametros->arraycategoriasact[0])) {
            foreach ($parametros->arraycategoriasact as $categ) {
                $arraynom[]['idnomenclador'] = $categ->idcategoria;
            }
        }
        if (isset($parametros->arraytipoact[0])) {
            foreach ($parametros->arraytipoact as $tipo) {
                $arraynom[]['idnomenclador'] = $tipo->idtipoactividad;
            }
        }
        $arrayactividadescalendario = DatElementos::DameActivdiadesCalendario(
                        $parametros->fechainicio, $parametros->fechafin, $arrayinvolact, $arrayautoresact, $arraynom, $arrayestados, $parametros->arrayelementostributa, $parametros
        );
        //print_r($arrayactividadescalendario);die();
        $contact = 0;
        if (isset($arrayactividadescalendario[0])) {
            $arrayactcalendario = array();
            foreach ($arrayactividadescalendario as $actividad) {
                $colorcategoria = '';
                $nomactegoriaact = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom($actividad['idelemento'], $tiponomenclador = 2);
                $color = $this->pIntegrator->configuracionpdo->DameColorCategoriaActividad($nomactegoriaact[0]['idnomenclador']);
                if ($color) {
                    $colorcategoria = "#" . $color;
                } else {
                    $colorcategoria = "#000000";
                }
                $objnomcategact = Doctrine::getTable('NomNomenclador')->find($nomactegoriaact[0]['idnomenclador']);

                $nomtipoact = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom($actividad['idelemento'], $tiponomenclador = 3);
                $objnomtipoact = Doctrine::getTable('NomNomenclador')->find($nomtipoact[0]['idnomenclador']);
                $nomestadocump = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom($actividad['idelemento'], $tiponomenclador = 6);
                $objnomestadocump = Doctrine::getTable('NomNomenclador')->find($nomestadocump[0]['idnomenclador']);
                $fechainicio = explode('/', $actividad['fechainicio']);
                $fechafin = explode('/', $actividad['fechafin']);
                $startdatelegible = $fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0];
                $enddatelegible = $fechafin[2] . '-' . $fechafin[1] . '-' . $fechafin[0];
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                if ($actividad['idusuariocrea'] != $parametros->idusuariosession) {
                    $superior = 1;
                    $permisomodificacion = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre($parametros->idusuariosession, $actividad['idusuariocrea']);
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                    }
                    $subordinado = $this->pIntegrator->configuracionpdo->existeSubordinacion($parametros->idusuariosession, $actividad['idusuariocrea']);
                }
                $nombreestadoapro = '';
                if ($actividad['idestadoaprob'] != null) {
                    $arrayestadosaprob = $this->pIntegrator->workflow->DenomEstado($actividad['idestadoaprob']);
                    if (isset($arrayestadosaprob[0])) {
                        $nombreestadoapro = $arrayestadosaprob[0]->denominacion;
                    }
                }

                $arrayactcalendario[$contact]['idactividad'] = $actividad['idelemento'];
                $arrayactcalendario[$contact]['title'] = $actividad['denelemento'];
                $arrayactcalendario[$contact]['description'] = $actividad['descelemento'];
                $horainicio = $this->ConvertirHora('militar', $actividad['horainicio']);
                $horafin = $this->ConvertirHora('militar', $actividad['horafin']);
                $arrayactcalendario[$contact]['idestadoaprob'] = $actividad['idestadoaprob'];
                $arrayactcalendario[$contact]['nombreestadoaprob'] = $nombreestadoapro;
                $arrayactcalendario[$contact]['start'] = $startdatelegible . ' ' . $horainicio;
                $arrayactcalendario[$contact]['end'] = $enddatelegible . ' ' . $horafin;
                $arrayactcalendario[$contact]['color'] = $colorcategoria;
                $arrayactcalendario[$contact]['cid'] = 1;
                $arrayactcalendario[$contact]['idelemento'] = $actividad['idelemento'];
                $arrayactcalendario[$contact]['categoria'] = $objnomcategact->dennomenclador;
                $arrayactcalendario[$contact]['tipoact'] = $objnomtipoact->dennomenclador;
                $arrayactcalendario[$contact]['lugar'] = $actividad['lugar'];
                $arrayactcalendario[$contact]['participan'] = $actividad['participante'];
                $arrayactcalendario[$contact]['modificar'] = $modificar;
                $arrayactcalendario[$contact]['eliminar'] = $eliminar;
                $arrayactcalendario[$contact]['activo'] = $actividad['activo'];
                $arrayactcalendario[$contact]['estadocump'] = $objnomestadocump->dennomenclador;
                $arrayactcalendario[$contact]['gradocump'] = $actividad['gradocumplimiento'];
                $arrayactcalendario[$contact]['superior'] = $superior;
                $arrayactcalendario[$contact]['subordinado'] = $subordinado;
                $arrayactcalendario[$contact]['idautor'] = $actividad['idusuariocrea'];
                $contact++;
            }
        }
        return $arrayactcalendario;
    }

    public function CargarElCalendario($parametros) {
        $arraynom = array();
        $cero = 0;
        $uno = 1;
        $parametros->nolimit = 1;

        $parametros->idusuario = $parametros->idusuariosession;

        // se visualizan las actividades con autores e involucrados deseados           
        if (isset($parametros->arrayinvolucrados[0])) {
            foreach ($parametros->arrayinvolucrados as $involucrado) {
                $arrayinvolact[] = $involucrado->idusuario;
            }
            $parametros->arrayinvolucrados = implode(',', $arrayinvolact);
        }

        if (isset($parametros->arrayautores[0])) {
            foreach ($parametros->arrayautores as $autor) {
                $arrayautoresact[] = $autor->idautor;
            }
            $parametros->arrayautores = implode(',', $arrayautoresact);
        }

        $model = new CmpgestionarplantillaModel();
        $arrayactividadescalendario = array();

        if ($parametros->idhito != 0) {
            $arrayactividadescalendario = DatProyecto::obtenerTareasCalendarioDadoHito($parametros);
        } else if ($parametros->idproyecto != 0) {
            $arrayactividadescalendario = DatProyecto::obtenerTareasCalendarioDadoProyecto($parametros);
            //$model->getTareasProyecto($parametros->idproyecto, $arrayactividadescalendario);
        } else {
            $arrayactividadescalendario = DatProyecto::obtenerTareasCalendarioDadaEstructura($parametros);

        }
        //print_r($arrayactividadescalendario);die();

        $contact = 0;
        if (isset($arrayactividadescalendario[0])) {

            $arrayactcalendario = array();
            foreach ($arrayactividadescalendario as $actividad) {

                $colorcategoria = '#000000';
                if ($actividad['gradocumplimiento'] == 100)
                    $colorcategoria = "#008000";
                else if ($actividad['gradocumplimiento'] < 100 && $this->EsAtrasada($actividad))
                    $colorcategoria = "#FF0000";
                else if ($actividad['gradocumplimiento'] < 100 && $actividad['gradocumplimiento'] > 0)
                    $colorcategoria = "#FF9900";

                $fechainicio = explode('/', $actividad['fechainicio']);
                $fechafin = explode('/', $actividad['fechafin']);
                $startdatelegible = $fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0];
                $enddatelegible = $fechafin[2] . '-' . $fechafin[1] . '-' . $fechafin[0];
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;

                if ($actividad['idusuariocrea'] != $parametros->idusuariosession) {
                    $superior = 1;
                    $permisomodificacion = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre($parametros->idusuariosession, $actividad['idusuariocrea']);

                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                    }
                    $subordinado = $this->pIntegrator->configuracionpdo->existeSubordinacion($parametros->idusuariosession, $actividad['idusuariocrea']);
                }

                $arrayactcalendario[$contact]['idactividad'] = $actividad['idelemento'];
                $arrayactcalendario[$contact]['title'] = $actividad['denelemento'];
                $arrayactcalendario[$contact]['description'] = $actividad['descelemento'];
                $horainicio = $this->ConvertirHora('militar', $actividad['horainicio']);
                $horafin = $this->ConvertirHora('militar', $actividad['horafin']);
                $arrayactcalendario[$contact]['start'] = $startdatelegible . ' ' . $horainicio;
                $arrayactcalendario[$contact]['end'] = $enddatelegible . ' ' . $horafin;
                $arrayactcalendario[$contact]['color'] = $colorcategoria;
                $arrayactcalendario[$contact]['cid'] = 1;
                $arrayactcalendario[$contact]['idelemento'] = $actividad['idelemento'];
                $arrayactcalendario[$contact]['modificar'] = $modificar;
                $arrayactcalendario[$contact]['eliminar'] = $eliminar;
                $arrayactcalendario[$contact]['gradocump'] = $actividad['gradocumplimiento'];
                $arrayactcalendario[$contact]['superior'] = $superior;
                $arrayactcalendario[$contact]['subordinado'] = $subordinado;
                $arrayactcalendario[$contact]['idhito'] = $actividad['idhito'];
                $arrayactcalendario[$contact]['denomhito'] = $actividad['denomhito'];
                $arrayactcalendario[$contact]['idproyecto'] = $actividad['idproyecto'];
                $arrayactcalendario[$contact]['denomproyecto'] = $actividad['denomproyecto'];
                $arrayactcalendario[$contact]['idautor'] = $actividad['idusuariocrea'];
                $arrayactcalendario[$contact]['nombreautor'] = $this->integrator->seguridad->nombreUsuario($actividad['idusuariocrea']);
                //$arrayactcalendario[$contact]['nombreautor'] = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario($actividad['idusuariocrea'], 'usuario', null);
                $contact++;
            }
        }
        return $arrayactcalendario;
    }

    public function CargarElementosCalendario($parametros) {
        $arraynom = array();
        $arrayestados = $this->pIntegrator->workflow->EstadosVerDoc(
                $parametros->idusuariosession, $idtipodoc = 3
        );
        $cero = 0;
        $uno = 1;

        //solo se visualizan las actividades donde el usuario en session esta involucrado
        if ($parametros->personal) {

            $arrayinvolact[]['llaveinvolucrado']
                    = $parametros->idusuariosession . $cero;
            $arrayinvolact[]['llaveinvolucrado']
                    = $parametros->idusuariosession . $uno;
            $arraygrupos
                    = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                    $parametros->idusuariosession
            );
            if (isset($arraygrupos[0])) {
                foreach ($arraygrupos as $grupo) {
                    $arrayinvolact[]['llaveinvolucrado']
                            = $grupo['idgrupo'] . $cero;
                    $arrayinvolact[]['llaveinvolucrado']
                            = $grupo['idgrupo'] . $uno;
                }
            }
        } else {

            // se visualizan las actividades con autores e involucrados deseados
            if ($parametros->busqueda) {
                if (isset($parametros->arrayinvolucrados[0])) {
                    foreach ($parametros->arrayinvolucrados as $involucrado) {
                        $id = $involucrado->idusuario;
                        if ($involucrado->tipo == 0) {
                            $id = $involucrado->idgrupo;
                        }
                        $arrayinvolact[]['llaveinvolucrado'] = $id . $cero;
                        $arrayinvolact[]['llaveinvolucrado'] = $id . $uno;
                        if ($involucrado->tipo == 1) {
                            $arraygrupos
                                    = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                                    $id
                            );
                            if (isset($arraygrupos[0])) {
                                foreach ($arraygrupos as $grupo) {
                                    $arrayinvolact[]['llaveinvolucrado']
                                            = $grupo['idgrupo'] . $cero;
                                    $arrayinvolact[]['llaveinvolucrado']
                                            = $grupo['idgrupo'] . $uno;
                                }
                            }
                        }
                    }
                }

                /* if(isset($parametros->arrayautores[0]))
                  {
                  foreach($parametros->arrayautores as $autor)
                  {
                  $arrayautoresact[]['idusuariocrea'] = $autor->idusuario;
                  }
                  } */
            } else {
                //print_r($parametros->idcalendario);die();
                $arrayinvolact[]['llaveinvolucrado']
                        = $parametros->idcalendario . $cero;
                $arrayinvolact[]['llaveinvolucrado']
                        = $parametros->idcalendario . $uno;
                $arraygrupos
                        = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                        $parametros->idcalendario
                );
                if (isset($arraygrupos[0])) {
                    foreach ($arraygrupos as $grupo) {
                        $arrayinvolact[]['llaveinvolucrado']
                                = $grupo['idgrupo'] . $cero;
                        $arrayinvolact[]['llaveinvolucrado']
                                = $grupo['idgrupo'] . $uno;
                    }
                }
            }
        }

        if (isset($parametros->arrayautores[0])) {
            foreach ($parametros->arrayautores as $autor) {
                $arrayautoresact[]['idusuariocrea'] = $autor->idusuario;
            }
        }


        if (isset($parametros->arraycategoriasact[0])) {
            foreach ($parametros->arraycategoriasact as $categ) {
                $arraynom[]['idnomenclador'] = $categ->idcategoria;
            }
        }
        if (isset($parametros->arraytipoact[0])) {
            foreach ($parametros->arraytipoact as $tipo) {
                $arraynom[]['idnomenclador'] = $tipo->idtipoactividad;
            }
        }


        $arrayactividadescalendario = DatElementos::DameActivdiadesCalendario(
                        $parametros->fechainicio, $parametros->fechafin, $arrayinvolact, $arrayautoresact, $arraynom, $arrayestados, $parametros->arrayelementostributa
        );
        //print_r($arrayactividadescalendario);die();
        $contact = 0;
        if (isset($arrayactividadescalendario[0])) {
            $arrayactcalendario = array();
            foreach ($arrayactividadescalendario as $actividad) {
                $colorcategoria = '';
                $nomactegoriaact
                        = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom(
                                $actividad['idelemento'], $tiponomenclador = 2
                );
                $color
                        = $this->pIntegrator->configuracionpdo->DameColorCategoriaActividad(
                        $nomactegoriaact[0]['idnomenclador']
                );
                if ($color) {
                    $colorcategoria = "#" . $color;
                } else {
                    $colorcategoria = "#FFFFFF";
                }
                $objnomcategact = Doctrine::getTable('NomNomenclador')->find(
                        $nomactegoriaact[0]['idnomenclador']
                );

                $nomtipoact
                        = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom(
                                $actividad['idelemento'], $tiponomenclador = 3
                );
                $objnomtipoact = Doctrine::getTable('NomNomenclador')->find(
                        $nomtipoact[0]['idnomenclador']
                );
                $nomestadocump
                        = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom(
                                $actividad['idelemento'], $tiponomenclador = 6
                );
                $objnomestadocump = Doctrine::getTable('NomNomenclador')->find(
                        $nomestadocump[0]['idnomenclador']
                );

                $fechainicio = explode('-', $actividad['fechainicio']);
                $fechafin = explode('-', $actividad['fechafin']);
                $startdatelegible
                        = $fechainicio[1] . '/' . $fechainicio[2] . '/'
                        . $fechainicio[0];
                $enddatelegible
                        = $fechafin[1] . '/' . $fechafin[2] . '/' . $fechafin[0];


                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                if ($actividad['idusuariocrea'] != $parametros->idusuariosession
                ) {
                    $superior = 1;
                    $permisomodificacion
                            = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                            $parametros->idusuariosession, $actividad['idusuariocrea']
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                    }
                }


                $arrayactcalendario[$contact]['id'] = $actividad['idelemento'];
                $arrayactcalendario[$contact]['subject']
                        = $actividad['denelemento'];
                $arrayactcalendario[$contact]['description']
                        = $actividad['descelemento'];
                $horainicio = $this->ConvertirHora(
                        'militar', $actividad['horainicio']
                );
                $horafin = $this->ConvertirHora(
                        'militar', $actividad['horafin']
                );
                $arrayactcalendario[$contact]['startdate']
                        = $startdatelegible . ' ' . $horainicio;
                $arrayactcalendario[$contact]['enddate']
                        = $enddatelegible . ' ' . $horafin;
                $arrayactcalendario[$contact]['color'] = $colorcategoria;

                $arrayactcalendario[$contact]['idelemento']
                        = $actividad['idelemento'];
                $arrayactcalendario[$contact]['categoria']
                        = $objnomcategact->dennomenclador;
                $arrayactcalendario[$contact]['tipoact']
                        = $objnomtipoact->dennomenclador;
                $arrayactcalendario[$contact]['lugar'] = $actividad['lugar'];
                $arrayactcalendario[$contact]['participan']
                        = $actividad['participante'];
                $arrayactcalendario[$contact]['modificar'] = $modificar;
                $arrayactcalendario[$contact]['eliminar'] = $eliminar;
                $arrayactcalendario[$contact]['activo'] = $actividad['activo'];
                $arrayactcalendario[$contact]['estadocump']
                        = $objnomestadocump->dennomenclador;
                $arrayactcalendario[$contact]['gradocump']
                        = $actividad['gradocumplimiento'];
                $arrayactcalendario[$contact]['superior'] = $superior;
                $arrayactcalendario[$contact]['idautor']
                        = $actividad['idusuariocrea'];
                $contact++;
            }
        }
        return $arrayactcalendario;
    }

    function ConvertirHora($convertirtipohora, $hora) {
        if ($convertirtipohora == 'militar') {
            $cadenahora = explode(' A', $hora);
            if ($cadenahora[1]) {

                $caden = explode(':', $cadenahora[0]);

                if (($caden[0] * 1) < 10) {
                    $hora = '0' . $cadenahora[0];
                } else {
                    if (($caden[0] * 1) == 12) {
                        $hora = '00' . $caden[1];
                    }
                }
                //print_r($hora);die();
            } else {
                $cadenahor = explode(' P', $hora);
                if ($cadenahor[1]) {
                    //print_r($cadenahor);die();
                    $cadenahoraini = explode(':', $cadenahor[0]);
                    switch ($cadenahoraini[0]) {
                        case '01':
                            $hora = '13:' . $cadenahoraini[1];
                            break;
                        case '02':
                            $hora = '14:' . $cadenahoraini[1];
                            break;
                        case '03':
                            $hora = '15:' . $cadenahoraini[1];
                            break;
                        case '04':
                            $hora = '16:' . $cadenahoraini[1];
                            break;
                        case '05':
                            $hora = '17:' . $cadenahoraini[1];
                            break;
                        case '06':
                            $hora = '18:' . $cadenahoraini[1];
                            break;
                        case '07':
                            $hora = '19:' . $cadenahoraini[1];
                            break;
                        case '08':
                            $hora = '20:' . $cadenahoraini[1];
                            break;
                        case '09':
                            $hora = '21:' . $cadenahoraini[1];
                            break;
                        case '10':
                            $hora = '22:' . $cadenahoraini[1];
                            break;
                        case '11':
                            $hora = '23:' . $cadenahoraini[1];
                            break;
                        case '12':
                            $hora = '00:' . $cadenahoraini[1];
                            break;
                    }
                    //print_r($hora);die();
                }
            }
        } else {
            $cadenahora = explode(':', $hora);
            if (($cadenahora[0] * 1) < 13) {
                $hora = $cadenahora[0] . ':' . $cadenahora[1] . 'am';
            } else {
                switch ($cadenahora[0]) {
                    case '13':
                        $hora = '01:' . $cadenahora[1] . 'pm';
                        break;
                    case '14':
                        $hora = '02:' . $cadenahora[1] . 'pm';
                        break;
                    case '15':
                        $hora = '03:' . $cadenahora[1] . 'pm';
                        break;
                    case '16':
                        $hora = '04:' . $cadenahora[1] . 'pm';
                        break;
                    case '17':
                        $hora = '05:' . $cadenahora[1] . 'pm';
                        break;
                    case '18':
                        $hora = '06:' . $cadenahora[1] . 'pm';
                        break;
                    case '19':
                        $hora = '07:' . $cadenahora[1] . 'pm';
                        break;
                    case '20':
                        $hora = '08:' . $cadenahora[1] . 'pm';
                        break;
                    case '21':
                        $hora = '09:' . $cadenahora[1] . 'pm';
                        break;
                    case '22':
                        $hora = '10:' . $cadenahora[1] . 'pm';
                        break;
                    case '23':
                        $hora = '11:' . $cadenahora[1] . 'pm';
                        break;
                    case '00':
                        $hora = '12:' . $cadenahora[1] . 'pm';
                        break;
                }
            }
        }
        return $hora;
    }

    /**
     * Funcion para cargar las actividades
     */
    public function CargarActividades(
    $idactividad, $idusuario, $iddominio, $certificado, $idelementotributa, $denominacion, $fechainicio, $fechafin, $enaprobacion, $estadoaprob, $arrayautores, $arrayinvolucrados, $categact, $tipoact, $car, $start, $limit, $idtipoelementotributa, $idtipoelementotributasuperior, $busqueda, $arrayelementosrelacionados
    ) {
        if ($estadoaprob != null) {
            $arrayestados['data'][0]['idestado'] = $estadoaprob;
        } else {
            $arrayestados = $this->pIntegrator->workflow->EstadosVerDoc(
                    $idusuario, $idtipodoc = 3
            );
        }
        $cero = 0;
        $uno = 1;
        if (isset($arrayinvolucrados[0])) {
            foreach ($arrayinvolucrados as $involucrado) {
                $id = $involucrado->idusuario;
                if ($involucrado->tipo == 0) {
                    $id = $involucrado->idgrupo;
                }
                $arrayinvolact[]['llaveinvolucrado'] = $id . $cero;
                $arrayinvolact[]['llaveinvolucrado'] = $id . $uno;
                if ($involucrado->tipo == 1) {
                    $arraygrupos
                            = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                            $id
                    );
                    if (isset($arraygrupos[0])) {
                        foreach ($arraygrupos as $grupo) {
                            $arrayinvolact[]['llaveinvolucrado']
                                    = $grupo['idgrupo'] . $cero;
                            $arrayinvolact[]['llaveinvolucrado']
                                    = $grupo['idgrupo'] . $uno;
                        }
                    }
                }
            }
        }

        if (isset($arrayautores[0])) {
            foreach ($arrayautores as $autor) {
                $arrayautoresact[]['idusuariocrea'] = $autor->idusuario;
            }
        }
        //aqui empiezo a definir las posibles cmbinaciones para obtener 
        //arreglo de inv y autores cuanod estos no vienen del client
        if (!isset($arrayautores[0]) && !isset($arrayinvolucrados[0])) {
            if ($enaprobacion == 0) {
                /* if($idelementotributa == null)
                  { */
                $arrayautoresact[]['idusuariocrea'] = $idusuario;
                $arrayinvolact[]['llaveinvolucrado'] = $idusuario . $cero;
                $arrayinvolact[]['llaveinvolucrado'] = $idusuario . $uno;
                $arraygrupos
                        = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                        $idusuario
                );
                if (isset($arraygrupos[0])) {
                    foreach ($arraygrupos as $grupo) {
                        $arrayinvolact[]['llaveinvolucrado']
                                = $grupo['idgrupo'] . $cero;
                        $arrayinvolact[]['llaveinvolucrado']
                                = $grupo['idgrupo'] . $uno;
                    }
                }
                /* }
                  else
                  {
                  switch($idtipoelementotributa)
                  {
                  case 0:
                  $arrayinvolact = $arrayautoresact = array();//pido todo lo que cuelga de mi plan
                  break;
                  default:
                  if($idtipoelementotributasuperior)
                  {
                  $arrayautoresact[]['idusuariocrea'] = $idusuariosession;
                  }
                  else
                  {
                  $arrayinvolact = $arrayautoresact = array();
                  }
                  }
                  } */
            } else {
                $arrayautoresact[]['idusuariocrea'] = $idusuario;
                $permisosubordinados
                        = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
                        $idusuario
                );
                if (isset($permisosubordinados[0])) {
                    foreach ($permisosubordinados as $subordinado) {
                        $arrayautoresact[]['idusuariocrea']
                                = $subordinado['idpsobre'];
                    }
                }
            }
        }

        $objdatelementos = new DatElementos();
        $arrayactividades = $objdatelementos->CargarActividades(
                $idactividad, $idusuario, $idelementotributa, $denominacion, $fechainicio, $fechafin, $arrayautoresact, $arrayinvolact, $categact, $tipoact, $car, $start, $limit, $idtipoelementotributa, $idtipoelementotributasuperior, $arrayestados, $busqueda, $arrayelementosrelacionados
        );
        if (isset($arrayactividades['resultado'])) {
            foreach ($arrayactividades['resultado'] as $key => $actividad) {
                $parent = null;
                if ($idactividad) {
                    $parent = $idactividad;
                }
                $leaf = true;
                $tienehijos = $objdatelementos->CargarActividades(
                        $actividad['idelemento'], $idusuario, $idelementotributa, $denominacion, $fechainicio, $fechafin, $arrayautoresact, $arrayinvolact, $categact, $tipoact, $car, $start, $limit, $idtipoelementotributa, $idtipoelementotributasuperior, $arrayestados, $busqueda, $arrayelementosrelacionados
                );
                if ($tienehijos['total'] > 0) {
                    $leaf = false;
                }

                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                if ($actividad['idautor'] != $idusuario) {
                    $superior = 1;
                    $permisomodificacion
                            = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                            $idusuario, $actividad['idautor']
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

                if ($actividad['idestadoaprob'] != null) {
                    $arrayestadosaprob
                            = $this->pIntegrator->workflow->DenomEstado(
                            $actividad['idestadoaprob']
                    );
                }
                $nombreestadoapro = '';
                if (isset($arrayestadosaprob[0])) {
                    $nombreestadoapro = $arrayestadosaprob[0]->denominacion;
                }

                $arrayactividades['resultado'][$key]['nombreautor']
                        = $this->integrator->seguridad->nombreUsuario(
                        $actividad['idautor']
                );
                $arrayactividades['resultado'][$key]['_is_leaf'] = $leaf;
                $arrayactividades['resultado'][$key]['_parent'] = $parent;
                $arrayactividades['resultado'][$key]['superior'] = $superior;
                $arrayactividades['resultado'][$key]['subordinado']
                        = $subordinado;
                $arrayactividades['resultado'][$key]['modificar'] = $modificar;
                $arrayactividades['resultado'][$key]['eliminar'] = $eliminar;
                $arrayactividades['resultado'][$key]['estadocumplimiento']
                        = $actividad['estadocumplimiento'] . "("
                        . $actividad['gradocumplimiento'] . "%)";
                $arrayactividades['resultado'][$key]['nombreestadoaprob']
                        = $nombreestadoapro;
                $arrayactividades['resultado'][$key]['observaciones']
                        = $actividad['observaciones'];
            }
        }
        return $arrayactividades;
    }

    /**
     * Funcion para adicionar las actividades
     */
    public function AdicionarActividad($parametros) {
        $procede = 1;
        if ($parametros->eshija == 1) {
            $elementopadre = Doctrine::getTable('DatElementos')->find(
                    $parametros->idactividadpadre
            );
            if (!isset($elementopadre->idelemento)) {
                $procede = 0;
            }
        }
        if ($procede == 1) {
            $objelemmodel = new CmpgestionarelementoModel();
            $estadoaprobpordefcto = $objelemmodel->ObtenerEstadoAprobPorDefecto(
                    $parametros->idusuariocrea, $idtipodocumento = 3
            );

            //validar si retorna null....
            $estadocumplimiento = $objelemmodel->actualizarEstadoCumplimiento(
                    $estadocumplimiento, $parametros->gradocumplimiento
            );
            //se crea el objeto 'elemento' y se registra
            $objCmpgestionarelementomodel = new Cmpgestionarelementomodel();
            $datelemento = $objCmpgestionarelementomodel->AdicionarElemento(
                    $parametros->denelemento, $parametros->descelemento, $parametros->gradocumplimiento, $parametros->idtipoelemento, $activo = 1, $estadocumplimiento, $estadoaprobpordefcto, $parametros->idusuariocrea, $parametros->dirigentes, $parametros->participantes
            );

            //se procede a crear la relacion padre-hijo
            if ($parametros->eshija == 1) {
                $idautorelemento = $elementopadre->idusuariocrea;
                if ($parametros->idusuariocrea == $idautorelemento) {
                    $origen = 0;
                } else {
                    $origen = 3;
                }
                $objelemelem = new DatElementosDatElementos();
                $objelemelem->idelementopadre = $parametros->idactividadpadre;
                $objelemelem->idelementohijo = $datelemento->idelemento;
                $objelemelem->origen = $origen;
                $objelemelem->idautor = $parametros->idusuariocrea;
                $objelemelem->save();
            }

            //se crea el objeto 'nomenclador-elemento' y se registra
            $objelemnom = new DatElementosNomNomencladorModel();
            if ($parametros->idcategoria) {
                $elemnomcateg = $objelemnom->AdicionarRelacionNomElem(
                        $datelemento, $parametros->idcategoria, $tiponomenclador = 2
                );
            }
            if ($parametros->idtipo) {
                $elemnomtipo = $objelemnom->AdicionarRelacionNomElem(
                        $datelemento, $parametros->idtipo, $tiponomenclador = 3
                );
            }

            //se crea el objeto 'actividad' y se registra
            $datactividad = new DatActividades();
            $datactividad->idactividad = $datelemento->idelemento;
            $datactividad->fechainicio
                    = $parametros->fechainicio; //adddate($fechainicio);print_r(2);die();
            $datactividad->fechafin
                    = $parametros->fechafin; //$this->adddate($fechafin);print_r(3);die();
            $datactividad->horainicio = $parametros->hora;
            $datactividad->horafin = $parametros->horafin;
            $datactividad->lugar = $parametros->lugar;
            $datactividad->esprincipal = $parametros->principal;
            $datactividad->save();

            //se relacionan los involucrados al elemento o actividad
            $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                    $parametros->arrayinvolucrados, $datelemento->idelemento, $parametros->idtipoelemento
            );

            //se relacionan los elementos relacionados
            $objCmpgestionarelementomodel->RelacionarElementosAElementos(
                    $datelemento->idelemento, $parametros->idtipoelemento, $parametros->arrayelementosrelacionados, $parentrelacidelemento = 'hijo', $parametros->idusuariocrea
            );

            //procedo a crear las repeticiones de actividad
            if (isset($parametros->arrayrepeticiones[0])) {
                $this->AdicionarRepeticionesActividad(
                        $parametros->arrayelementosrelacionados, $datelemento, $datactividad, $parametros->arrayrepeticiones, $parametros->arrayinvolucrados, $parametros->idcategoria, $parametros->idtipo, $estadocumplimiento, $parametros->principal, $parametros->idusuariocrea
                );
            }
            if ($parametros->retornar == 1) {
                return $datactividad;
            }
        }
        return $procede;
    }

    /**
     * Funcion para modificar la actividad
     */
    public function ModificarActividad($parametros) {
        $objelemento = Doctrine::getTable('DatElementos')->find(
                $parametros->idactividad
        );
        if (isset($objelemento->idelemento)) {
            $objelemmodel = new CmpgestionarelementoModel();
            $objelementoo = $objelemmodel->ModificarElemento(
                    $objelemento->idelemento, $parametros->denelemento, $parametros->descelemento, $parametros->gradocumplimiento, $parametros->dirigentes, $parametros->participantes
            );

            $objactividad = Doctrine::getTable('DatActividades')->find(
                    $parametros->idactividad
            );
            $objactividad->fechainicio = $parametros->fechainicio;
            $objactividad->fechafin = $parametros->fechafin;
            $objactividad->horainicio = $parametros->hora;
            $objactividad->horafin = $parametros->horafin;
            $objactividad->lugar = $parametros->lugar;
            $objactividad->esprincipal = $parametros->principal;
            $objactividad->save();

            //obtengo relacion con nomencladores y modifico
            $objelemnom = new DatElementosNomNomencladorModel();
            if ($parametros->idcategoria) {
                $elemnomcateg = $objelemnom->ModificarRelacionNomElem(
                        $objelementoo, $parametros->idcategoria, $tiponomenclador = 2
                );
            }
            if ($parametros->idtipo) {
                $elemnomtipo = $objelemnom->ModificarRelacionNomElem(
                        $objelementoo, $parametros->idtipo, $tiponomenclador = 3
                );
            }

            //obtengo todas las repticiones
            $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
                    $idsubsistema = 15, $parametros->idusuariocrea, $idtipodoc = 3
            );
            $arrayestados = array();
            if (isset($arrayestadosverdoc['data'][0])) {
                foreach ($arrayestadosverdoc['data'] as $key => $estado) {
                    $arrayestados[]['idestado'] = $estado['idestado'];
                }
            }
            $arrayrepeticiones = DatElementos::ObtenerRepeticiones(
                            $parametros->idactividad, $arrayestados
            );
            if (isset($arrayrepeticiones[0])) {
                foreach ($arrayrepeticiones as $key => $repeticion) {
                    $objelementorep = Doctrine::getTable('DatElementos')->find(
                            $repeticion['idelemento']
                    );
                    if (isset($objelementorep->idelemento)) {
                        $objelementorep->denelemento = $parametros->denelemento;
                        $objelementorep->descelemento
                                = $parametros->descelemento;
                        $objelementorep->dirigente = $parametros->dirigentes;
                        $objelementorep->participante
                                = $parametros->participantes;
                        $objelementorep->save();

                        //obtengo relacion con nomencladores y modifico
                        $objelemnomrep = new DatElementosNomNomencladorModel();
                        if ($parametros->idcategoria) {
                            $elemnomcategrep
                                    = $objelemnom->ModificarRelacionNomElem(
                                    $objelementorep, $parametros->idcategoria, $tiponomenclador = 2
                            );
                        }
                        if ($parametros->idtipo) {
                            $elemnomtiporep
                                    = $objelemnom->ModificarRelacionNomElem(
                                    $objelementorep, $parametros->idtipo, $tiponomenclador = 3
                            );
                        }

                        $objactrep = Doctrine::getTable('DatActividades')->find(
                                $repeticion['idelemento']
                        );
                        $objactrep->esprincipal = $parametros->esprincipal;
                        if ($repeticion['tiporepeticion'] == 1) {
                            $objactrep->lugar = $parametros->lugar;
                            $objactrep->horainicio = $parametros->hora;
                            $objactrep->horafin = $parametros->horafin;
                            $objactrep->save();
                        }
                    }
                }
            }

            //actualizo las asignaciones
            $this->ActualizarReasignaciones(
                    $objelementoo, $objactividad, $parametros->idcategoria, $parametros->idtipo
            );

            $respuesta = 1;
        } else {
            $respuesta = 3;
        }
        return $respuesta;
    }

    /**
     * Funcion para eliminar las actividades
     */
    public function EliminarActividades($arrayidactividades, $idusuariosession) {
        foreach ($arrayidactividades as $idactividad) {
            $noeliminados = 0;
            $respuesta = 1;
            $objelemento = Doctrine::getTable('DatElementos')->find(
                    $idactividad
            );
            if (isset($objelemento->idelemento)) {
                $arrayrepeticiones
                        = DatElementosDatElementos::ObtenerRepeticiones(
                                $idactividad
                );
                if (isset($arrayrepeticiones[0])) {
                    foreach ($arrayrepeticiones as $repeticion) {
                        $objelementorep = Doctrine::getTable('DatElementos')
                                ->find($repeticion['idelementohijo']);
                        if (isset($objelementorep->idelemento)) {
                            $objelementorep->delete();
                        }
                    }
                }

                //obtengo y elimino las asignaciones
                $this->EliminarReasignaciones($objelemento, $idusuariosession);

                $objcmpelementosmodel = new CmpgestionarelementoModel();
                $mensaje = $objcmpelementosmodel->EliminarElementos(
                        $arrayidactividades
                );
            } else {
                $noeliminados++;
            }
        }
        if ($noeliminados > 0 && $noeliminados == count($arrayidactividades)) {
            $respuesta = 0;
        }
        return $respuesta;
    }

    /**
     * Funcion de trabajo con fecha para el plan
     */
    function adddate($fecha) {
        $data = explode("/", $fecha);
        $date = new DateTime();
        $date->setDate($data[2], $data[1], $data[0]);
        $format = $this->global->Formato->fecha;
        $day = $date->format("$format");
        return $day;
    }

    /**
     * Funcion para eliminar las repeticiones de una determinada actividad
     */
    public function EliminarRepeticiones($idactividad, $arrayrepeticiones) {
        $existeactividad = Doctrine::getTable('DatActividades')->find(
                $idactividad
        );
        if (isset($existeactividad->idactividad)) {
            if (isset($arrayrepeticiones[0])) {
                $contrepnoexistentes = 0;
                foreach ($arrayrepeticiones as $key => $repeticion) {
                    $objrepeticion = Doctrine::getTable('DatElementos')->find(
                            $repeticion->idactividad
                    );
                    if (isset($objrepeticion->idelemento)) {
                        $objrepeticion->delete();
                    } else {
                        $contrepnoexistentes++;
                    }
                }
                $totalrepeticiones = $key + 1;
                $respuesta = 1; //relaciones eliminadas correctamentes
                if ($contrepnoexistentes > 0) {
                    if ($totalrepeticiones == 1) {
                        $respuesta = 3;
                    }//no existe la repeticion
                }
            }
        } else {
            $respuesta = 0;
        }
        return $respuesta;
    }

    public function AdicionarRepeticionesActividad(
    $arrayrelaciones, $elemento, $actividad, $arrayrepeticiones, $arrayinvolucrados, $categoriaactividad, $tipoactividad, $estadocumplimiento, $esprincipal, $idautorrelacion
    ) {
        if (isset($arrayrepeticiones[0])) {
            foreach ($arrayrepeticiones as $repeticion) {
                //se crea el objeto 'elemento' y se registra
                $objCmpgestionarelementomodel = new Cmpgestionarelementomodel();
                $datelemento = $objCmpgestionarelementomodel->AdicionarElemento(
                        $elemento->denelemento, $elemento->descelemento, $elemento->gradocumplimiento, $elemento->idtipoelemento, $activo = 1, $estadocumplimiento, $elemento->idestadoaprob, $elemento->idusuariocrea, $elemento->dirigente, $elemento->participante
                );
                //se crea el objeto 'nomenclador-elemento' y se registra
                $objelemnom = new DatElementosNomNomencladorModel();
                if ($categoriaactividad) {
                    $elemnomcateg = $objelemnom->AdicionarRelacionNomElem(
                            $datelemento, $categoriaactividad, $tiponomenclador = 2
                    );
                }
                if ($tipoactividad) {
                    $elemnomtipo = $objelemnom->AdicionarRelacionNomElem(
                            $datelemento, $tipoactividad, $tiponomenclador = 3
                    );
                }

                $horainicio = $repeticion->hora;
                $horafin = $repeticion->horafin;
                $lugar = $repeticion->lugar;

                //se relacionan los involucrados al elemento o actividad
                if ($repeticion->tiporepeticion == 1) {
                    $horainicio = $actividad->horainicio;
                    $horafin = $actividad->horafin;
                    $lugar = $actividad->lugar;
                    $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                            $arrayinvolucrados, $datelemento->idelemento, $datelemento->idtipoelemento
                    );
                } else {
                    $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                            $repeticion->involucrados, $datelemento->idelemento, $datelemento->idtipoelemento
                    );
                }

                //se crea el objeto 'actividad' y se registra
                $datactividad = new DatActividades();
                $datactividad->idactividad = $datelemento->idelemento;
                $datactividad->fechainicio
                        = $repeticion->fechainicio; //adddate($fechainicio);print_r(2);die();
                $datactividad->fechafin
                        = $repeticion->fechafin; //$this->adddate($fechafin);print_r(3);die();
                $datactividad->horainicio = $horainicio; //$repeticion->hora;
                $datactividad->horafin = $horafin; //$repeticion->horafin;
                $datactividad->lugar = $lugar; //$repeticion->lugar;
                $datactividad->tiporepeticion = $repeticion->tiporepeticion;
                $datactividad->esprincipal = $actividad->esprincipal;
                $datactividad->save();

                //se relacionan los elementos relacionados
                $objCmpgestionarelementomodel->RelacionarElementosAElementos(
                        $datelemento->idelemento, $datelemento->idtipoelemento, $arrayrelaciones, $parentrelacidelemento = 'hijo', $datelemento->idusuariocrea
                );

                $objelemelemmodel = new DatElementosDatElementos();
                $objelemelemmodel->idelementopadre = $elemento->idelemento;
                $objelemelemmodel->idelementohijo = $datelemento->idelemento;
                $objelemelemmodel->origen = 4;
                $objelemelemmodel->idautor = $elemento->idusuariocrea;
                $objelemelemmodel->save();

                //$pepe = 'ok';
            }
        }
    }

    public function ModificarRepeticion(
    $fechainicio, $fechafin, $horainicio, $horafin, $lugar, $tiporepeticion, $idactividad, $idactrepeticion, $arrayinvolucrados
    ) {
        $objactividad = Doctrine::getTable('DatActividades')->find(
                $idactividad
        );
        if (isset($objactividad->idactividad)) {
            $objactrepeticion = Doctrine::getTable('DatActividades')->find(
                    $idactrepeticion
            );
            if (isset($objactrepeticion->idactividad)) {
                $objactrepeticion->fechainicio = $fechainicio;
                $objactrepeticion->fechafin = $fechafin;
                $objactrepeticion->horainicio = $horainicio;
                $objactrepeticion->horafin = $horafin;
                $objactrepeticion->lugar = $lugar;
                $objactrepeticion->tiporepeticion = $tiporepeticion;
                $objactrepeticion->save();

                $respuesta = 1;
            } else {
                $respuesta = 3;
            }
        } else {
            $respuesta = 0;
        }
        return $respuesta;
    }

    public function ObtenerRepeticionesActividad($idactividad, $idusuariosession) {
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
                            $idsubsistema = 15, $idusuariosession, $idtipodocumento = 3
                    );
                    if ($estadoaprobpordefcto == $act['idestadoaprob']) {
                        $entrada = 0;
                    }
                    $permisomodificacion
                            = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                            $idusuariosession, $act['idusuariocrea']
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
                    //  no sea el estado por defecto para las actividades de otras personas
                    $arrayact[$key]['identificador'] = $act['identificador'];
                    $arrayact[$key]['idactividad'] = $act['identificador'];
                    $arrayact[$key]['estadocumplimiento']
                            = $act['estadocumplimiento'] . '('
                            . $act['gradocumplimiento'] . '%)';
                    $arrayact[$key]['nombreautor']
                            = $this->integrator->seguridad->nombreUsuario(
                            $act['idusuariocrea']
                    );
                    $arrayact[$key]['idautor'] = $act['idusuariocrea'];

                    $separador = '-';
                    $fechainicio = $act['fechai'];
                    $fechaI = $this->ConvertirFecha($fechainicio, $separador);
                    $fechafin = $act['fechaf'];
                    $fechaF = $this->ConvertirFecha($fechafin, $separador);

                    $arrayact[$key]['fechainicio'] = $fechaI;
                    $arrayact[$key]['fechafin'] = $fechaF;
                    $arrayact[$key]['hora'] = $act['hora'];
                    $arrayact[$key]['horafin'] = $act['horafin'];
                    $arrayact[$key]['lugar'] = $act['lugar'];
                    $arrayact[$key]['superior'] = $superior;
                    $arrayact[$key]['subordinado'] = $subordinado;
                    $arrayact[$key]['modificar'] = $modificar;
                    $arrayact[$key]['eliminar'] = $eliminar;

                    //$objelemmodel = new DatElementosDatInvolucradosModel();
                    $objclasificadorinvolmodel = new ClasificadorinvolModel();
                    $arrayact[$key]['involucrados']
                            = $objclasificadorinvolmodel->MostrarInvolucrados(
                            $act['identificador'], $idtipoelemento = 3
                    ); //ObtenerInvolucradosPorElementos($act['identificador']);
                    $arraydatosmes = $this->ObtenerDatosMes($act['fechai']);
                    $arrayact[$key]['mes'] = $arraydatosmes['nombremes'];
                    $arrayact[$key]['numeroMes'] = $arraydatosmes['numeromes'];
                    $arrayact[$key]['tipoDeRep'] = 2;
                }
            }
        }
        return $arrayact;
    }

    public function ConvertirFecha($fecha, $tiposeparador) {
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

    public function ObtenerDatosMes($fecha) {
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

    public function ActualizarReasignaciones($objelemento, $objact, $idcategoria, $idtipo) {
        $tienereasignaciones
                = DatElementosDatElementos::ObtenerReasignacionesDadoActividad(
                        $objelemento->idelemento
        );
        if (isset($tienereasignaciones[0])) {
            foreach ($tienereasignaciones as $key => $reasignacion) {
                $existe = 0;
                $objelemreasig = Doctrine::getTable('DatElementos')->find(
                        $reasignacion['idelementohijo']
                );
                if (isset($objelemreasig->idelemento)) {
                    $existe = 1;
                    $objelemreasig->denelemento = $objelemento->denelemento;
                    $objelemreasig->descelemento = $objelemento->descelemento;
                    $objelemreasig->participante = $objelemento->participante;
                    $objelemreasig->dirigente = $objelemento->dirigente;
                    $objelemreasig->save();
                    //actualizo los  nomencladores relacionados a la actividad
                    $objelemnomreasig = new DatElementosNomNomencladorModel();
                    if ($idcategoria) {
                        $elemnomcategreasig
                                = $objelemnomreasig->ModificarRelacionNomElem(
                                $objelemreasig, $idcategoria, $tiponomenclador = 2
                        );
                    }
                    if ($idtipo) {
                        $elemnomtiporeasig
                                = $objelemnomreasig->ModificarRelacionNomElem(
                                $objelemreasig, $idtipo, $tiponomenclador = 3
                        );
                    }
                }
                $objactreasig = Doctrine::getTable('DatActividades')->find(
                        $reasignacion['idelementohijo']
                );
                if (isset($objactreasig->idactividad)) {
                    $existe = 1;
                    $objactreasig->fechainicio = $objact->fechainicio;
                    $objactreasig->fechafin = $objact->fechafin;
                    $objactreasig->lugar = $objact->lugar;
                    $objactreasig->horainicio = $objact->horainicio;
                    $objactreasig->horafin = $objact->horafin;
                    $objactreasig->esprincipal = $objact->esprincipal;
                    $objactreasig->save();
                }
                if ($existe == 1) {
                    $this->ActualizarReasignaciones(
                            $objelemreasig, $objactreasig, $idcategoria, $idtipo
                    );
                }
            }
        }
    }

    public function EliminarReasignaciones($objelemento, $idusuariosession) {
        $tienereasignaciones
                = DatElementosDatElementos::ObtenerReasignacionesDadoActividad(
                        $objelemento->idelemento
        );
        if (isset($tienereasignaciones[0])) {
            foreach ($tienereasignaciones as $key => $reasignacion) {
                $arrayidactividades[] = $reasignacion['idelementohijo'];
            }
            $this->EliminarActividades($arrayidactividades, $idusuariosession);
        }
    }

    public function EsAtrasada($tarea) {
        $fechaf = explode('/', $tarea['fechafin']);
        $datetimeFin = new DateTime($fechaf[2] . $fechaf[1] . $fechaf[0] . ' ' . $tarea['horafin']);
        $datetimeHoy = new DateTime();
        $tiempoFin = $datetimeFin->getTimestamp();
        $tiempoHoy = $datetimeHoy->getTimestamp();
        if ($tiempoFin > $tiempoHoy) {
            return false;
        } else {
            return true;
        }
    }

    public function ObtenerReporte($datos) {

        switch ($datos->idtiporeporte) {
            case 5:
                $datos->arraypartesreporte = DatProyecto::ObtenerPartesVersionReporteParaRecuperaciones($datos->versionadoSelecionado);
                $datos->arraycamposreporte = DatProyecto::ObtenerCamposVersionReporteParaRecuperaciones($datos->idversionreporte);
                $cuerporeporte = $this->GenerarPlanMensual($datos);
                break;
        }

        $tituloreporte = str_replace(" ", "_", $datos->tituloreporte . '(' . rand() . ')');
        $nombrearchivo = $tituloreporte . $datos->idopcion;

        $register = Zend_Registry::getInstance();
        $dirarchivo = $register->config->modulo_path . 'resources/descargas/' . $nombrearchivo;
        $dirarchivo = str_replace("apps", "web", $dirarchivo);

        $variable = "<html><head><meta http-equiv=\"Content-Type\"
                content=\"text/html; charset=UTF-8\"></head><body>"
                . $cuerporeporte . "</body></html>";

        switch ($datos->idopcion) {
            case 'vp':
                return $variable;
                break;
            case '.pdf':
                include("MPDF56/mpdf.php");
                $mpdf = new mPDF('utf-8');
                $mpdf->WriteHTML($variable);
                $mpdf->Output($dirarchivo, 'F');
                exit;
                return $nombrearchivo;
                break;
            default:
                $fp = fopen($dirarchivo, 'w+');
                fwrite($fp, $variable);
                fclose($fp);
                return $nombrearchivo;
        }
    }

    public function GenerarPlanMensual($datos) {

        $altohoja = $datos->altohoja - 2;
        $altohojainicial = $datos->altohoja - 2;
        $anchohoja = $datos->anchohoja - 2;
        $orientacionhoja = "portrait";

        if ($datos->orientacionhoja == 1) {
            $orientacionhoja = "landscape";
        }

        $tablareport
                = "<style type='text/css'>
                .Estilo1 {font-family:" . $datos->tipoletra . "; font-size: "
                . $datos->tamanoletra . ";}
                .  {border: 1px; border-color: #000000; border-radius: 5px; overflow: hidden;
                padding: 2px 1px 2px 5px; text-overflow: ellipsis; white-space: nowrap;}
                @page{height:" . $datos->altohoja . " cm; width:"
                . $datos->anchohoja . " cm;
                size:" . $orientacionhoja . ";}</style>";

        $tablareport .= "<div style='margin:auto;width:" . $anchohoja .
                "cm;background-color:white;padding:1cm 1cm 1cm 1cm;'>";

        if (isset($datos->arraypartesreporte[0])) {

            $existeprincp = 0;
            $contadorhojas = 1;
            //$configuracionfirma = Doctrine::getTable('ConfFirma')->find($datos->idusuariosession);
            $datos->arraydatosreporte = $this->DatosReporte($datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin);

            foreach ($datos->arraypartesreporte as $partereporte) {
                switch ($partereporte['idpartereporte']) {
                    case 1: //clasificacion
                        /* $tablareport
                          .= "<table class='Estilo1' width='100%' border='0'>
                          <tr><td width='10'>&nbsp;</td><td width='400'><div align='center'>"
                          . $configuracionfirma->cargoaprueba . "</div></td>
                          <td ><div align='right'>" . $datos->confidencialidad
                          . "</div></td></tr>";
                          $altohoja = $altohoja - 0.25; */
                        break;
                    case 2: //aprobado por
                        /* $tablareport
                          .= "<tr><td>APROBADO:&nbsp;&nbsp;</td><td><div align='center'>"
                          . $configuracionfirma->gradoaprueba . "
                          </div></td><td>&nbsp;</td></tr><tr><td>&nbsp;</td>
                          <td><div align='center'>"
                          . $configuracionfirma->nombreaprueba
                          . "</div></td><td>&nbsp;</td></tr></table>";
                          $altohoja = $altohoja - 5.25; */
                        break;
                    case 3: //titulo
                        $tablareport
                                .= "<table class ='Estilo1' width= '100%'border='0' align='center'><tr>
                                <td><div align='center'><p><strong>"
                                . $datos->tituloreporte . ' '
                                . 'del mes ' . ' ' . $datos->textomeses
                                . "</strong></p></div></td></tr></table>";
                        $altohoja = $altohoja - 4;
                        break;
                    case 4: //elaborado por
                        /* $tablareport
                          .= "<table class='Estilo1' width='100%' border='0'>
                          <tr> <td>&nbsp;</td>
                          <td width='250'><div align='right'>" .
                          $configuracionfirma->cargoelabora
                          . "</div></td></tr>";
                          $tablareport
                          .= "<tr><td><div align='right'>ELABORADO:</td>
                          <td width='250'><div align='right'>"
                          . $configuracionfirma->gradoelabora . "</div></td></tr>
                          <tr><td>&nbsp;</td>
                          <td width='250'><div align='right'>"
                          . $configuracionfirma->nombrelabora . "</td>
                          </tr></table>";
                          $tablareport
                          .= "</div>"; */
                        break;
                    case 5: //actividades principales
                        /* $arraydat = $this->ConstruirHojaActivPrinicpales(
                          $tablareport, $datos, 2, $anchohoja, $altohojainicial, $contadorhojas
                          );
                          $tablareport = $arraydat["tablareport"];
                          $contadorhojas = $arraydat["contadorhojas"];
                          $existeprincp = $arraydat["principales"]; */
                        break;
                    case 7:
                        for (
                        $i = 0; $i <= $datos->arraydatosreporte['cantdiasmes']; $i++
                        ) {
                            if ($i < 10) {
                                $day = '0' . $i;
                                $arrayfechas[$i] = $day;
                            }
                            if ($i >= 10) {
                                $day = $i;
                                $arrayfechas[$i] = $day;
                            }

                            if (isset($datos->arrayinvolucrados[0])) {
                                foreach ($datos->arrayinvolucrados as $involucrado) {
                                    $arrayinvolact[] = $involucrado->idusuario;
                                }
                                $datos->arrayinvolucrados = implode(',', $arrayinvolact);
                            }

                            if (isset($datos->arrayautores[0])) {
                                foreach ($datos->arrayautores as $autor) {
                                    $arrayautoresact[] = $autor->idautor;
                                }
                                $datos->arrayautores = implode(',', $arrayautoresact);
                            }

                            $arrayactividadespordia = DatProyecto::obtenerTareasCalendarioDadaEstructura($datos);

                            $datos->fechainicio = $datos->fechafin = date('d-m-Y', mktime(00, 00, 00, $datos->valuemeses, $i, $datos->valueanno));
                            $datos->arraydatosreportes['fechainicioD'] = $datos->arraydatosreportes['fechainicioD'] = null;
                            $datos->repeticiones = 1;

                            if (isset($arrayactividadespordia[0]['idelemento'])) {

                                foreach ($arrayactividadespordia as $p => $actividad) {
                                    $horainicio = $this->ConvertirHora('civil', $actividad['horainicio']);

                                    $actividades[$i - 1][$p]['hora'] = '<strong>' . $horainicio . '</strong>';
                                    $actividades[$i - 1][$p]['fechainicio'] = $actividad['fechainicio'];
                                    $actividades[$i - 1][$p]['fechafin'] = $actividad['fechafin'];
                                    $actividades[$i - 1][$p]['titulo'] = $actividad['denelemento'];
                                    $color = '#FFFFFF';
                                    $actividades[$i - 1][$p]['color'] = $color;
                                }
                            }
                        }
                        for ($index = 0; $index < count($actividades); $index++) {
                            for ($indexA = 1; $indexA < count($actividades[$index]); $indexA++) {
                                for ($indexE = 0; $indexE < (count($actividades[$index]) - $indexA); $indexE++) {
                                    if (count($actividades[$index]) == 1) {
                                        break;
                                    } else {
                                        $horaAct = split(':', $actividades[$index][$indexE]['hora']);
                                        $horaSolo = (int) $horaAct[0];
                                        $minSolo = (int) $horaAct[1];
                                        $horaActA = split(':', $actividades[$index][($indexE + 1)]['hora']);
                                        $horaSoloB = (int) $horaActA[0];
                                        $minSoloQ = (int) $horaActA[1];
                                        if ($horaSolo > $horaSoloB) {
                                            $temp = $actividades[$index][$indexE];
                                            $actividades[$index][$indexE] = $actividades[$index][($indexE + 1)];
                                            $actividades[$index][($indexE + 1)] = $temp;
                                        } else {
                                            if ($horaSolo == $horaSoloB) {
                                                if ($minSolo > $minSoloQ) {
                                                    $temp = $actividades[$index][$indexE];
                                                    $actividades[$index][$indexE] = $actividades[$index][($indexE + 1)];
                                                    $actividades[$index][($indexE + 1)] = $temp;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        $contador = 1;
                        $fecha = '';
                        $fechaconcurrente = date('w', mktime(00, 00, 00, $datos->valuemeses, 01, $datos->valueanno));
                        $tablareport
                                .= "<table class='Estilo1' width='100%'
                                bordercolor='black' aling = 'center' 
                                style='margin-top:1cm;table-layout:fixed;' cellspacing='0' >"
                                . "<thead>" . "<tr style='text-align:center;'>" .
                                "<td width='14.2%' bgcolor='#CCCCCC'  
                                style='border-bottom:1px solid #000000;
                                border-left:1px solid #000000;border-top:1px 
                                solid #000000;'><strong>Lunes</strong></td>"
                                . "<td width='14.2%' bgcolor='#CCCCCC'
                                style='border-bottom:1px solid #000000;
                                border-left:1px solid #000000;border-top:1px 
                                solid #000000;'><strong>Martes</strong></td>"
                                . "<td width='14.2%' bgcolor='#CCCCCC'
                                style='border-bottom:1px solid #000000;
                                border-left:1px solid #000000;border-top:1px 
                                solid #000000;'><strong>Mi&eacute;rcoles</strong></td>"
                                . "<td width='14.2%' bgcolor='#CCCCCC'
                                style='border-bottom:1px solid #000000;
                                border-left:1px solid #000000;border-top:1px 
                                solid #000000;'><strong>Jueves</strong></td>"
                                . "<td width='14.2%' bgcolor='#CCCCCC'
                                style='border-bottom:1px solid #000000;
                                border-left:1px solid #000000;border-top:1px 
                                solid #000000;'><strong>Viernes</strong></td>"
                                . "<td width='14.2%' bgcolor='#CCCCCC'
                                style='border-bottom:1px solid #000000;
                                border-left:1px solid #000000;border-top:1px 
                                solid #000000;'><strong>S&aacute;bado</strong></td>"
                                . "<td width='14.2%' bgcolor='#CCCCCC'
                                style='border-bottom:1px solid #000000;
                                border-left:1px solid #000000;border-right:1px 
                                solid #000000;border-top:1px 
                                solid #000000;'><strong>Domingo</strong></td>"
                                . "</tr>" . "</thead><tbody>";
                        ////******  1RA fila   ******///
                        /* 1 */
                        $tablareport .= "<tr>" . "<td class='Estilo1' align='left'
                        valign='top' width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px
                        solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 1) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfilaD[1] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 1 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfilaD[1] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 1) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= "<p align='right' style='margin:0px' ><b>" . $fecha . "</b></p>";

                        if (($fecha != '') && (count($actividades[$arraycontfilaD[1]]) > 0)) {

                            $val = count($actividades[$arraycontfilaD[1]]);
                            for ($i = 0; $i < $val; $i++) {

                                $tablareport .= "<div class='Estilo1' style='background:"
                                        . $actividades[$arraycontfilaD[2]][$i]['color']
                                        . "; color:#000000;'>"
                                        . str_replace(':', '', $actividades[$arraycontfilaD[1]][$i]['hora'])
                                        . " " . $actividades[$arraycontfilaD[1]][$i]['titulo'] . "</div>";
                            }
                        }
                        if (($fecha == '') || (count($actividades[$arraycontfilaD[1]]) == 0)) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 2 */
                        $tablareport
                                .= "<td class='Estilo1' align='left'
                        valign='top' width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px
                        solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 2) {
                            $fecha = $arrayfechas[1];
                            $arraycontfilaD[2] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 2 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfilaD[2] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 2) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= "<p align='right' style='margin:0px' ><b>" . $fecha . "</b></p>";
                        if (($fecha != '') && (count($actividades[$arraycontfilaD[2]]) > 0)) {
                            $val = count($actividades[$arraycontfilaD[2]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arraycontfilaD[2]][$i]['color']
                                        . "; color:#000000;'>"
                                        . $actividades[$arraycontfilaD[2]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfilaD[2]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count($actividades[$arraycontfilaD[2]]) == 0)) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 3 */
                        $tablareport
                                .= "<td class='Estilo1' align='left'
                        valign='top' width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px
                        solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = '&nbsp;';

                        if ($fechaconcurrente == 3) {
                            $fecha = $arrayfechas[1];
                            $arraycontfilaD[3] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 3 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfilaD[3] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 3) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        if (($fecha != '') && (count($actividades[$arraycontfilaD[3]]) > 0)) {
                            $val = count($actividades[$arraycontfilaD[3]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arraycontfilaD[3]][$i]['color']
                                        . "; color:#000000;'>"
                                        . $actividades[$arraycontfilaD[3]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfilaD[3]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count($actividades[$arraycontfilaD[3]]) == 0)) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 4 */
                        $tablareport
                                .= "<td class='Estilo1' align='left'
                        valign='top' width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px
                        solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 4) {
                            $fecha = $arrayfechas[1];
                            $arraycontfilaD[4] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 4 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfilaD[4] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 4) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        if (($fecha != '') && (count($actividades[$arraycontfilaD[4]]) > 0)) {
                            $val = count($actividades[$arraycontfilaD[4]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arraycontfilaD[4]][$i]['color']
                                        . "; color:#000000;'>"
                                        . $actividades[$arraycontfilaD[4]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfilaD[4]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count($actividades[$arraycontfilaD[4]]) == 0)) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 5 */
                        $tablareport
                                .= "<td class='Estilo1' align='left'
                        valign='top' width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px
                        solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 5) {
                            $fecha = $arrayfechas[1];
                            $arraycontfilaD[5] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 5 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfilaD[5] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 5) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        if (($fecha != '') && (count($actividades[$arraycontfilaD[5]]) > 0)) {
                            $val = count($actividades[$arraycontfilaD[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arraycontfilaD[5]][$i]['color']
                                        . "; color:#000000;'>"
                                        . $actividades[$arraycontfilaD[5]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfilaD[5]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count($actividades[$arraycontfilaD[5]]) == 0)) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 6 */
                        $tablareport
                                .= "<td class='Estilo1' align='left'
                        valign='top' width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px
                        solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 6) {
                            $fecha = $arrayfechas[1];
                            $arraycontfilaD[6] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 6 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfilaD[6] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 6) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        if (($fecha != '') && (count($actividades[$arraycontfilaD[6]]) > 0)) {
                            $val = count($actividades[$arraycontfilaD[6]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arraycontfilaD[6]][$i]['color']
                                        . "; color:#000000;'>"
                                        . $actividades[$arraycontfilaD[6]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfilaD[6]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count($actividades[$arraycontfilaD[6]]) == 0)) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 7 */
                        $tablareport
                                .= "<td class='Estilo1' align='left'
                        valign='top' width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px
                        solid #000000;border-right:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 0) {
                            $fecha = $arrayfechas[1];
                            $arraycontfilaD[7] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfilaD[7] = $contador;
                            $contador++;
                        }
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        if (($fecha != '') && (count($actividades[$arraycontfilaD[7]]) > 0)) {
                            $val = count($actividades[$arraycontfilaD[7]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arraycontfilaD[7]][$i]['color']
                                        . "; color:#000000;'>"
                                        . $actividades[$arraycontfilaD[7]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfilaD[7]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count($actividades[$arraycontfilaD[7]]) == 0)) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>" . "</tr>";
                        ////******  2DA fila   ******///
                        /* 1 */
                        $tablareport
                                .= "<tr><td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaA[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaA[1];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaA[1]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaA[1]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaA[1]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaA[1]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaA[1]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaA[1]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 2 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaA[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaA[2];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaA[2]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaA[2]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaA[2]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaA[2]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaA[2]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaA[2]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 3 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaA[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaA[3];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaA[3]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaA[3]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaA[3]][$i]['color']
                                        . "; color:#000000;'>"
                                        . $actividades[$arrayfechasfilaA[3]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaA[3]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaA[3]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 4 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaA[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaA[4];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaA[4]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaA[4]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaA[4]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaA[4]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaA[4]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaA[4]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 5 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaA[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaA[5];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaA[5]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaA[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaA[5]][$i]['color']
                                        . "; color:#000000;'>"
                                        . $actividades[$arrayfechasfilaA[5]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaA[5]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaA[5]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 6 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaA[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaA[6];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaA[6]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaA[6]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaA[6]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaA[6]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaA[6]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaA[6]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 7 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-right:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaA[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaA[7];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaA[7]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaA[7]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class=' Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaA[7]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaA[7]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaA[7]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaA[7]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>" . "</tr>";
                        ////******  3RA fila   ******///
                        /* 1 */
                        $tablareport
                                .= "<tr><td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaH[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaH[1];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaH[1]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaH[1]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaH[1]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaH[1]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaH[1]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaH[1]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 2 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaH[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaH[2];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaH[2]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaH[2]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaH[2]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaH[2]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaH[2]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaH[2]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 3 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaH[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaH[3];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaH[3]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaH[3]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaH[3]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaH[3]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaH[3]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaH[3]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 4 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaH[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaH[4];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaH[4]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaH[4]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaH[4]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaH[4]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaH[4]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaH[4]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 5 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaH[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaH[5];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaH[5]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaH[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaH[5]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaH[5]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaH[5]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaH[5]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 6 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaH[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaH[6];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaH[6]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaH[6]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaH[6]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaH[6]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaH[6]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaH[6]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 7 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-right:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaH[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaH[7];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaH[7]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaH[7]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaH[7]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaH[7]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaH[7]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaH[7]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td></tr>";
                        ////******  4TA fila   ******///
                        /* 1 */
                        $tablareport
                                .= "<tr><td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaT[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaT[1];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaT[1]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaT[1]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaT[1]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaT[1]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaT[1]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaT[1]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 2 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaT[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaT[2];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaT[2]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaT[2]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaT[2]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaT[2]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaT[2]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaT[2]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 3 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                                width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                                border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaT[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaT[3];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaT[3]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaT[3]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaT[3]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaT[3]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaT[3]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaT[3]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 4 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                                width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                                border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaT[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaT[4];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaT[4]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaT[4]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaT[4]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaT[4]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaT[4]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaT[4]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 5 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                                width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                                border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaT[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaT[5];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaT[5]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaT[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaT[5]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaT[5]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaT[5]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaT[5]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 6 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                                width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                                border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaT[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaT[6]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaT[6]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaT[6]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaT[6]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaT[6]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaT[6]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 7 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                                width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                                border-right:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaT[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaT[7]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaT[7]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaT[7]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaT[7]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaT[7]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaT[7]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td></tr>";
                        ////******  5TA fila   ******///
                        /* 1 */
                        $tablareport
                                .= "<tr><td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaR[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaR[1];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaR[1]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaR[1]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaR[1]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaR[1]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaR[1]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaR[1]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 2 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaR[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaR[2];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaR[2]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaR[2]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaR[2]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaR[2]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaR[2]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaR[2]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 3 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaR[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaR[3];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaR[3]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaR[3]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaR[3]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaR[3]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaR[3]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaR[3]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 4 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaR[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaR[4];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaR[4]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaR[4]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaR[4]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaR[4]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaR[4]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaR[4]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 5 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaR[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaR[5];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaR[5]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaR[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaR[5]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaR[5]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaR[5]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaR[5]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 6 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaR[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaR[6];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaR[6]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaR[6]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1'style='background:"
                                        . $actividades[$arrayfechasfilaR[6]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaR[6]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaR[6]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaR[6]]
                                ) == 0)
                        ) {
                            $tablareport .= " &nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 7 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-right:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaR[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaR[7];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaR[7]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaR[7]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaR[7]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaR[7]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaR[7]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaR[7]]
                                ) == 0)
                        ) {
                            $tablareport .= " &nbsp;";
                        }
                        $tablareport .= "</td></tr>";
                        ////******  6TA fila   ******///
                        /* 1 */
                        $tablareport
                                .= "<tr><td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaW[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaW[1];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaW[1]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaW[1]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaW[1]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaW[1]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaW[1]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaW[1]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 2 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaW[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaW[2];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaW[2]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaW[2]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaW[2]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaW[2]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaW[2]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaW[2]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 3 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaW[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaW[3];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaW[3]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaW[3]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaW[3]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaW[3]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaW[3]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaW[3]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 4 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaW[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaW[4];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaW[4]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaW[4]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaW[4]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaW[4]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaW[4]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaW[4]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 5 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaW[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaW[5];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaW[5]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaW[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaW[5]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaW[5]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaW[5]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaW[5]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 6 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaW[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaW[6];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaW[6]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaW[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaW[6]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaW[6]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaW[6]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaW[5]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 7 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-right:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaW[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $tablareport .= "</tr>";
                        $fecha = $arrayfechasfilaW[7];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaW[7]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaW[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaW[7]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaW[7]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaW[7]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaW[7]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td><tr></tbody></table>";
                        //$tablareport.= "</div>";
                        break;
                }
            }
        }
        $tablareport .= "</div>";
        $tablareport .= "</div>";
        return $tablareport;
    }

    public function DatosReporte($idtiporeporte, $valuemeses, $valueanno, $fechainicio, $fechafin) {
        $fechainicioD = null;
        $fechafinD = null;
        if ($idtiporeporte != 5) {
            if ($valuemeses) {
                $desde = "1/" . $valuemeses . "/" . $valueanno;
                $cantdiasmes = $this->getMonthDays($valuemeses, $valueanno);
                $hasta = $cantdiasmes . "/" . $valuemeses . "/" . $valueanno;
                $fechainicioD = date(
                        'd-m-Y', mktime(00, 00, 00, $valuemeses, 01, $valueanno)
                );
                $fechafinD = date(
                        'd-m-Y', mktime(00, 00, 00, $valuemeses, $cantdiasmes, $valueanno)
                );
            } else {
                if (!$valuemeses && $valueanno) {
                    $desde = "1/01" . "/" . $valueanno;
                    $hasta = "31/12" . "/" . $valueanno;
                    $fechainicioD = date(
                            'd-m-Y', mktime(00, 00, 00, 01, 01, $valueanno)
                    );
                    $fechafinD = date(
                            'd-m-Y', mktime(00, 00, 00, 12, 31, $valueanno)
                    );
                } else {
                    $desde = $fechainicio;
                    $hasta = $fechafin;
                    $fechainicioD = $fechainicio;
                    ;
                    $fechafinD = $fechafin;
                }
            }
        } else {
            $desde = "1/" . $valuemeses . "/" . $valueanno;
            $cantdiasmes = $this->getMonthDays($valuemeses, $valueanno);
            $hasta = $cantdiasmes . "/" . $valuemeses . "/" . $valueanno;
            $fechainicioD = date(
                    'd-m-Y', mktime(00, 00, 00, $valuemeses, 01, $valueanno)
            );
            $fechafinD = date(
                    'd-m-Y', mktime(00, 00, 00, $valuemeses, $cantdiasmes, $valueanno)
            );
        }
        $arraydatosreportes['fechainicioD'] = $fechainicioD;
        $arraydatosreportes['fechafinD'] = $fechafinD;
        $arraydatosreportes['desde'] = $desde;
        $arraydatosreportes['hasta'] = $hasta;
        $arraydatosreportes['cantdiasmes'] = $cantdiasmes;
        return $arraydatosreportes;
    }

    public function getMonthDays($month, $year) {
        //Lo hacemos a mi manera.
        return date("d", mktime(00, 00, 00, $month + 1, 00, $year));
    }

}
