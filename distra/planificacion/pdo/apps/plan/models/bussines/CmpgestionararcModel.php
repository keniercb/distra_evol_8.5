<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestionararcModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para cargar las ARC en el grid
     */
    public function CargarAreas(
        $idarc, $idusuariosession, $start, $limit, $arrayautoresact,
        $arrayinvolact, $arrayelementosrelacionados, $filtros
    )
    {
        $arrayareas = DatArc::ObtenerAreas(
            $idarc, $start, $limit, $arrayautoresact, $arrayinvolact,
            $arrayelementosrelacionados, $filtros
        );
        return $this->formarArrayARC(
            $arrayareas, $idarc, $idusuariosession, $start, $limit,
            $arrayautoresact, $arrayinvolact, $arrayelementosrelacionados,
            $filtros
        );
    }

    /**
     * Nombre de la función CargarAreasImportadas
     * Descripcion  Devuelve un conjunto de ARC dado un arreglo de idARC.
     *
     * @author * Ariadna Rendón Artola
     *
     * @param Array $arrayidARC - arreglo de idARC.
     * @param Integer $idusuario - identificador de usuario en sección.
     *
     * @return array
     */
    /* public function CargarAreasImportadas($arrayidARC, $idusuario){

      $arrayareas = DatArc::GetARCImport($arrayidARC);
      $cero = 0;
      $uno = 1;
      $arrayautoresact[]['idusuariocrea'] = $idusuario;
      $arrayinvolact[]['llaveinvolucrado'] = $idusuario. $cero;
      $arrayinvolact[]['llaveinvolucrado'] = $idusuario . $uno;
      $arraygrupos = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
      $idusuario);
      if (isset($arraygrupos[0])) {
      foreach ($arraygrupos as $grupo) {
      $arrayinvolact[]['llaveinvolucrado'] = $grupo['idgrupo'] . $cero;
      $arrayinvolact[]['llaveinvolucrado'] = $grupo['idgrupo'] . $uno;
      }
      }
      return $this->formarArrayARC($arrayareas, "", $idusuario, "", 10,
      $arrayautoresact, $arrayinvolact, "", 10, array());
      } */
    //permite formar un arreglo de ARC.
    public function formarArrayARC(
        $arrayARC, $idarc, $idusuariosession, $start, $limit, $arrayautoresact,
        $arrayinvolact, $arrayelementosrelacionados, $filtros
    )
    {
        if (isset($arrayARC['resultado'])) {
            foreach ($arrayARC['resultado'] as $key => $area) {
                $parent = null;
                if ($area['idarc'] != $area['idarcp']) {
                    $parent = $area['idarcp'];
                }
                $leaf = true;
                $tienehijos = DatArc::ObtenerAreas(
                    $area['idarc'], $start, $limit, $arrayautoresact,
                    $arrayinvolact, $arrayelementosrelacionados, $filtros
                );
                if ($tienehijos['total'] > 0) {
                    $leaf = false;
                }
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                if ($area['autor'] != $idusuariosession) {
                    $superior = 1;
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $idusuariosession, $area['autor'], $certificado,
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
                }//print_r($area);die();
                $area = $this->ActivarArea($area);
                $area = $this->DesactivarArea($area);

                //$arrayARC['resultado'][$key]['fdesde'] = $this->ConvertirFecha(
                //$area['fdesde'], '-');
                $arrayARC['resultado'][$key]['fdesde'] = $area['fdesde'];
                if ($area['fhasta']) {
                    //$arrayARC['resultado'][$key]['fhasta'] = $this->ConvertirFecha(
                    //$area['fhasta'], '-');
                    $arrayARC['resultado'][$key]['fhasta'] = $area['fhasta'];
                }
                /*$arrayARC['resultado'][$key]['autor']
                    = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                    $area['autor'], 'usuario', null);*/
                $arrayARC['resultado'][$key]['autor']= $area['denominacionautor'];

                $arrayARC['resultado'][$key]['idautor'] = $area['autor'];
                $arrayARC['resultado'][$key]['_is_leaf'] = $leaf;
                $arrayARC['resultado'][$key]['_parent'] = $parent;
                $arrayARC['resultado'][$key]['superior'] = $superior;
                $arrayARC['resultado'][$key]['subordinado'] = $subordinado;
                $arrayARC['resultado'][$key]['mod'] = $modificar;
                $arrayARC['resultado'][$key]['del'] = $eliminar;
                $arrayARC['resultado'][$key]['activo'] = $area['activo'];
                $arrayARC['resultado'][$key]['escapitulo'] = $area['escapitulo'];
            }
        }

        return $arrayARC;
    }

    public function ActivarArea($area)
    {
        $activo = $area['activo'];
        $idarc = $area['idarc'];
        // Captura la fecha de inicio en la que se activa el area		
        $fechaInicio = $area['fdesde'];
        if ($fechaInicio != null) {
            $fechaInicio = explode('-', $fechaInicio);
            $fecInicio = $fechaInicio[0] . $fechaInicio[1] . $fechaInicio[2];
            // Captura la fecha actual del servidor
            $fechaActual = date('Y/m/d');
            $fechaActual = explode('/', $fechaActual);
            $fecActual = $fechaActual[0] . $fechaActual[1] . $fechaActual[2];
            // Compara rangos de fecha
            if ($fecInicio <= $fecActual) {
                $activo = 1;
                DatArc::cambiarEstado($idarc, $activo);
            }
        }
        $area['activo'] = $activo;
        return $area;
    }

    public function DesactivarArea($area)
    {
        // Captura la fecha actual del servidor
        $fechaActual = date('Y/m/d');
        $fechaActual = explode('/', $fechaActual);
        $fecActual = $fechaActual[0] . $fechaActual[1] . $fechaActual[2];
        $activo = $area['activo'];
        $idarc = $area['idarc'];
        // Captura la fecha de inicio en la que se activa el nomenclador
        $fechaFin = $area['fhasta'];
        if ($fechaFin != null) {
            $fechaFin = explode('-', $fechaFin);
            $fecFin = $fechaFin[0] . $fechaFin[1] . $fechaFin[2];
            // Comparara rangos de fecha            
            if ($fecFin < $fecActual) {
                $activo = 0;
                DatArc::cambiarEstado($idarc, $activo);
            }
        }
        $area['activo'] = $activo;
        return $area;
    }

    /**
     * Funcion para adicionar las ARC
     */
    public function AdicionarArc(
      $parametros
    )
    {
        $temp = DatArc::ExisteArcNombre($parametros->idusuariocrea, $parametros->denarc);
        if (!isset($temp[0])) {
            $caduca = 0;
            $procede = 1;
            if ($parametros->fechafin) {
                $caduca = 1;
            }
            if ($parametros->eshija == 0) {
                $parametros->idarcp = null;
            } else {
                $existepadre = Doctrine::getTable('DatArc')->find($parametros->idarcp);
                if (!isset($existepadre)) {
                    $procede = 0;
                }
            }

            if ($procede == 1) {
                $objarc = new DatArc();
                $objarc->denarc = $parametros->denarc;
                $objarc->descrip = $parametros->descarc;
                $objarc->fechainicio = $parametros->fechainicio;
                $objarc->orden = $parametros->orden;
                if ($parametros->fechafin) {
                    $objarc->fechafin = $parametros->fechafin;
                }
                $objarc->idarcp = $parametros->idarcp;
                $objarc->idusuariocrea = $parametros->idusuariocrea;
                $objarc->fechacreacion = date('d/m/Y');
                $objarc->activo = 1;
                $objarc->caduca = $caduca;
                $objarc->escapitulo = $parametros->escapitulo;
                try{
                  $temp = $objarc->save();
                }catch (Exception $exception){
                  print_r($exception->getMessage());die;
                }


                return 1;
            } else {
                return 2;
                //en caso de que sea una actividad hija y el padre 
                //ya no exista en los registros
            }
        } else {
            //En caso de que exista un arc de igual nombre para el mismo usuario
            return 0;
        }
    }

    public function existeARCImport($denarc){
      $DatArc=new DatArc();
      return $DatArc->existeARCImport($denarc);
    }

    public function AdicionarArcImportar(
        $idusuariocrea, $denarc, $descarc, $fechainicio, $fechafin,
        $arrayinvolucrados, $idarcp, $eshija, $arrayelementosrelacionados
    )
    {
//        $conn = Zend_Registry::get('conexion');

//        if($eshija == 1){
//            $temp = DatArc::ExisteArcNombre($idusuariocrea, $denarc);
//            print_r('segunsdo caso '. $idusuariocrea. '--' . $denarc);
//            print_r($temp);die;
//        }


        $temp = DatArc::ExisteArcNombre($idusuariocrea, $denarc);
//        print_r('primer caso ' . $idusuariocrea. '--' . $denarc);
        // print_r(isset($temp));die;*/

//        if ($temp[0]==null) {
        if (!isset($temp[0])) {
            $caduca = 0;
            $procede = 1;
            if ($fechafin) {
                $caduca = 1;
            }
            if ($eshija == 0) {
                $idarcp = null;
            } else {
                $existepadre = Doctrine::getTable('DatArc')->find($idarcp);
                if (!isset($existepadre)) {
                    $procede = 0;
                }
            }
            if ($procede == 1) {
                $de = Doctrine_Manager::getInstance();
                $conn = $de->getCurrentConnection();
                $objarc = new DatArc();
                $objarc->denarc = $denarc;
                $objarc->descrip = $descarc;
                $objarc->fechainicio = $fechainicio;
                if ($fechafin) {
                    $objarc->fechafin = $fechafin;
                }
                $objarc->idarcp = $idarcp;
                $objarc->idusuariocrea = $idusuariocrea;
                $objarc->fechacreacion = date('d/m/Y');
                $objarc->activo = 1;
                $objarc->caduca = $caduca;
                $objarc->save();
                $conn->commit();
                $conn->beginTransaction();
                $id = $objarc->idarc;

                return $id;

            } else {
                return 2;
                //en caso de que sea una actividad hija y el padre
                //ya no exista en los registros
            }
        } else {
            //En caso de que exista un arc de igual nombre para el mismo usuario
            $id = $temp[0]['idarc'];
            return $id;
        }
    }

    /**
     * Funcion para modificar las arc
     */
    public function ModificarArc(
      $parametros
    )
    {
        $temp = DatArc::ExisteArcNombre($parametros->idusuariocrea, $parametros->denarc);
        if (!isset($temp[0])
            || (isset($temp[0])
                && $temp[0]['idarc'] == $parametros->idarc)
        ) {
            $objarc = Doctrine::getTable('DatArc')->find($parametros->idarc);
            if (!isset($objarc->idarc)) {
                return 3;
            } else {
                $objarc->denarc = $parametros->denarc;
                $objarc->descrip = $parametros->descarc;
                $objarc->fechainicio = $parametros->fechainicio;
                if ($parametros->fechafin) {
                    $objarc->fechafin = $parametros->fechafin;
                }
                $objarc->orden = $parametros->orden;
                $objarc->save();

                $objarcc['idarc'] = $parametros->idarc;
                $objarcc['activo'] = $objarc->activo;
                $objarcc['fdesde'] = $objarc->fechainicio;
                $objarcc['fhasta'] = $objarc->fechafin;
                $area = $this->ActivarArea($area);
                $area = $this->DesactivarArea($area);

                //se crea el objeto 'arc-involucrados' y se registra
                if (isset($parametros->arrayinvolucrados)) {

                    $objclasificadorinvolmodel = new ClasificadorinvolModel();
                    foreach ($parametros->arrayinvolucrados as $involucrado) {
                        $objclasificadorinvolmodel->Involucrar(
                            $involucrado, $parametros->idarc, $idtipoelemento = 5,
                            $estamodificando = 1
                        );
                    }
                }

                return 1;
            }
        } else {
            //En caso de que exista un elemento de igual nombre para el 
            //mismo usuario y sea diferente al que estamos modificando.
            return 0;
        }
    }

    /**
     * Funcion para eliminar los planes
     */
    public function EliminarArc($arrayidarc)
    {

        $noexiste = 0;
        $desactivados = 0;
        $activados = 0;
        $eliminados = 0;
        foreach ($arrayidarc as $idarc) {
            $objarc = Doctrine::getTable('DatArc')->find($idarc);
            if (isset($objarc)) {
                //obtenemos todas las arc que cuelgan de ella
                $familia = DatArc::buscarFamilia($idarc);

                if (isset($familia[0])) {
                    foreach ($familia as $pariente) {
                        $objarc = Doctrine::getTable('DatArc')->find(
                            $pariente['_id']
                        );
                        $planesrelacionadosarea
                            = DatArcDatPlan::ExisteAreaEnPlan($pariente['_id']);
                        // print_r($planesrelacionadosarea[0]);die;
                        if (isset($planesrelacionadosarea[0])) {
                            $fechaActual = date('d/m/Y');
                            $fechaActual = explode('/', $fechaActual);
                            $fecActual
                                = $fechaActual[2] . '-' . $fechaActual[1] . '-'
                                . $fechaActual[0];
                            $fechaActualSeg = mktime(
                                0, 0, 0, $fechaActual[1], $fechaActual[0],
                                $fechaActual[2]
                            );
                            $cantSegPorDia = (60 * 60 * 24);
                            $fechaAyer = $fechaActualSeg - $cantSegPorDia;
                            $fecAyer = date('Y-m-d', $fechaAyer);

                            if ($objarc->activo)
                                $activados += 1;

                            $objarc->activo = 0;
                            $objarc->fechainicio = $fecAyer;
                            $objarc->fechafin = $fecAyer;
                            $objarc->caduca = 1;
                            $objarc->save();

                            $desactivados = 1;
                        } else {
                            $eliminados = 1;
                            $objarc->delete();
                        }
                    }
                }
            } else {
                $noexiste = 1;
            }
        }
        if ($noexiste == 1 && count($arrayidarc) == 1) {
            //$mensaje = 0;//mensaje :el arc no existe en el registro
            $mensaje = 3;
        }
        if ($noexiste == 0) {//&& count($arrayidarc) == 1
            $mensaje = 1; //mensaje :arc eliminado correctamente
            if ($eliminados == 1 && $desactivados == 1) {
                $mensaje = 2;
            }
            if ($eliminados == 0 && $desactivados == 1 && $activados != 0) {
                $mensaje = 4;
            } else if ($eliminados == 0 && $desactivados == 1) {
                $mensaje = 5;
            }
        }
        return $mensaje;
    }

    /**
     * Funcion para activar o desactivar las ARC
     */
    public function ActivarDesactivarARC($arrayidarc, $accion)
    {
        $noexiste = 0;
        foreach ($arrayidarc as $idarc) {
            $objarc = Doctrine::getTable('DatArc')->find($idarc);
            if (isset($objarc)) {
                //obtenemos todas las arc que cuelgan de ella
                $familia = DatArc::buscarFamilia($idarc);
                if (isset($familia[0])) {
                    foreach ($familia as $pariente) {
                        $objarcc = Doctrine::getTable('DatArc')->find(
                            $pariente['_id']
                        );
                        if (isset($objarcc->idarc)) {
                            if ($accion == 0) {
                                $fechaActual = date('d/m/Y');
                                $fechaActual = explode('/', $fechaActual);
                                $fecActual
                                    = $fechaActual[2] . '-' . $fechaActual[1]
                                    . '-' . $fechaActual[0];
                                $fechaActualSeg = mktime(
                                    0, 0, 0, $fechaActual[1], $fechaActual[0],
                                    $fechaActual[2]
                                );
                                $cantSegPorDia = (60 * 60 * 24);
                                $fechaAyer = $fechaActualSeg - $cantSegPorDia;
                                $fecAyer = date('Y-m-d', $fechaAyer);

                                $objarcc->activo = 0;
                                $objarcc->fechainicio = $fecAyer;
                                $objarcc->fechafin = $fecAyer;
                                $objarcc->caduca = 1;
                            } else {
                                $fechaActual = date('d/m/Y');
                                $objarcc->fechainicio = $fechaActual;
                                $objarcc->fechafin = null;
                                $objarcc->activo = 1;
                                $objarcc->caduca = 0;
                            }
                            $objarcc->save();
                        }
                    }
                }
            } else {
                $noexiste = 1;
            }
        }
        if ($noexiste == 1 && count($arrayidarc) == 1) {
            $mensaje = 3; //mensaje :el arc no existe en el registro
        } else {
            $mensaje = 1;
        }
        return $mensaje;
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
                $fechainstancia = date('d / m /Y', $numfecha);
                break;
        }
        return $fechainstancia;
    }

}

