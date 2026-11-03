<?php

class PersonaSOAPService extends ZendExt_Model
{

    /**
     * Los tipos de medios de contacto
     *
     * @param $limit
     * @param $start
     * @param $denom
     *
     * @return array Lista de tipo de medios de contacto
     */
    public function getTipoMedioContacto($limit = 20, $start = 0, $denom)
    {
        $obj = new NomTipomediocontactoModel();

        return $obj->getActiveTypeContactMedium($denom, $limit, $start);
    }

    /**
     * @param type $limit
     * @param type $start
     * @param type $arrUsers
     * @param type $idtipomediocontacto
     * @param type $filter
     *
     * @return type
     */
    public function getPersonsByMedioContacto(
    $limit = 20, $start = 0, $arrUsers = array(), $idtipomediocontacto = 0, $filter = null
    )
    {
        $obj = new OsimModel();

        return $obj->getPersonsByMedioContacto($limit, $start, $arrUsers, $idtipomediocontacto, $filter);
    }

    /**
     * Listado paginado de persona asociadas a los usuarios del sistema que cumplan con determinados criterios
     * de busqueda.
     *
     * @param $limit
     * @param $start
     * @param $arrUsers
     * @param $filter
     *
     * @return array
     */
    public function getDatosAuxPersona($limit = 20, $start = 0, $arrUsers = array(), $filter = null)
    {
        $obj = new OsimModel();

        return $obj->getDatosAuxPersona($limit, $start, $arrUsers, $filter);
    }

    public function getDatospersonaWeb($params)
    {
        try
        {
            if ($params['parametros']['provincia'] == 1)
            {
                $sql = "SELECT p.iddpt, p.denominacion
				FROM mod_datosmaestros.nom_dpt as p
				INNER JOIN mod_datosmaestros.nom_nivelestructural ON(mod_datosmaestros.nom_nivelestructural.idnivelestructural = p.idnivelestructural)
				INNER JOIN mod_datosmaestros.nom_conceptonivel ON(mod_datosmaestros.nom_conceptonivel.idconceptonivel = mod_datosmaestros.nom_nivelestructural.idconceptonivel)
                WHERE p.idpais = 1 AND mod_datosmaestros.nom_conceptonivel.idconceptonivel = 16 ";
                $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
                return $result;
            }
            if ($params['parametros']['municipio'] == 1 && $params['parametros']['idprovincia'] != null)
            {
                $idprovincia = $params['parametros']['idprovincia'];
                $sql = "SELECT p.iddpt, p.denominacion
				FROM mod_datosmaestros.nom_dpt as p
				INNER JOIN mod_datosmaestros.nom_nivelestructural ON(mod_datosmaestros.nom_nivelestructural.idnivelestructural = p.idnivelestructural)
				INNER JOIN mod_datosmaestros.nom_conceptonivel ON(mod_datosmaestros.nom_conceptonivel.idconceptonivel = mod_datosmaestros.nom_nivelestructural.idconceptonivel)
                WHERE p.idpais = 1 AND mod_datosmaestros.nom_conceptonivel.idconceptonivel = 14 AND p.idpadre ={$idprovincia} AND p.idnivelestructural = 17";
                $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

                return $result;
            }
            if ($params['parametros']['nivel'] == 1)
            {
                $sql = "SELECT p.idniveleducacional, p.denominacion
				FROM mod_personaext.nom_niveleducacional as p";
                $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

                return $result;
            }
            if ($params['parametros']['area'] == 1)
            {
                $sql = "SELECT *
				FROM mod_personaext.nom_areatematicaempresa as p";
                $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
                return $result;
            }
            /* if(count($params['parametros']['insertar'])==1){
              $nombre = $params['parametros'][0]['nombre'];
              $snombre = $params['parametros'][0]['snombre'];
              $papel = $params['parametros'][0]['papel'];
              $sapel = $params['parametros'][0]['sapel'];
              $fregistro = date('d-m-Y');
              $sexo = $params['parametros'][0]['sexo'];
              $numero = $params['parametros'][0]['numero'];
              $idprovincia = $params['parametros']['idprovincia'];
              $idmunicipio= $params['parametros'][0]['idmunicipio'];
              $lugar= $params['parametros'][0]['lugar'];
              $contacto= $params['parametros'][0]['contacto'];
              $lugarprocedencia = $params['parametros'][0]['lugarprocedencia'];
              $anno= $params['parametros'][0]['anno'];
              $area=$params['parametros'][0]['idarea'];

              if($nombre!=null && $papel!=null && $sapel!=null && $fregistro!=null && $sexo!=null && $numero!=null && $idprovincia!=null && $idmunicipio!=null && $lugar!=null && $lugarprocedencia!=null && $anno!=null && $area!=null)
              {
              $dmInstance = Doctrine_Manager::getInstance();
              $module = Zend_Registry::get('config')->bd;

              // $dsn = "pgsql:dbname=distra-ch;host=10.12.170.102";
              $dsn = $module->persona->gestor.":dbname=".$module->persona->bd.";host=".$module->persona->host;
              //$con = new PDO($dsn, 'zeolides', 'zeolides*2012.,');
              $con = new PDO($dsn, $module->persona->usuario, $module->persona->password);
              $sentencia = $con->prepare("INSERT INTO mod_persona.dat_persona(nombre, snombre, papel, sapel, sexo,fregistro) VALUES (:nombre, :snombre, :papel, :sapel,:sexo,:fregistro)");
              $sentencia->bindParam(':nombre', $nombre);
              $sentencia->bindParam(':snombre', $snombre);
              $sentencia->bindParam(':papel', $papel);
              $sentencia->bindParam(':sapel', $sapel);
              $sentencia->bindParam(':sexo', $sexo);
              $sentencia->bindParam(':sexo', $fregistro);

              $sentencia->execute();

              $con = null;

              $sql = "SELECT p.idpersona
              FROM  mod_persona.dat_persona p
              ORDER BY p.idpersona DESC";
              $resultid = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

              $idpersona = $resultid[0]['idpersona'];

              return($idpersona);

              $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
              $sqldoc = "INSERT INTO mod_persona.dat_docidentidad(
              idpersona, idtipodocidentidad, numero, fdesde, principal)
              VALUES ($idpersona,1 ,$numero,$fregistro,1);";
              $conn->fetchAll($sqldoc);

              $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
              $sqldireccion = "INSERT INTO mod_persona.dat_direccion(
              idprovincia, idmunicipio,direccion,oficial,fdesde,idpersona,idpais)
              VALUES ($idprovincia,$idmunicipio,$lugar,1,$fregistro,$idpersona,1);";
              $conn->fetchAll($sqldireccion);

              if($contacto!=null){
              $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
              $sqlcontacto = "INSERT INTO mod_persona.dat_contacto(
              contacto, oficial,idtipomediocontacto,idtipocontacto,idpersona)
              VALUES ($contacto,1,4,1,$idpersona);";
              $conn->fetchAll($sqlcontacto);
              }
              $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
              $sqlnivel = "INSERT INTO mod_personaext.dat_niveleducacional(
              fdesde, idniveleducacional,idpersona)
              VALUES ($fregistro,$anno,$idpersona);";
              $conn->fetchAll($sqlnivel);

              $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
              $sqlarea = "INSERT INTO mod_personaext.dat_personaareatematicaempresa(
              fdesde,idpersona,idareatematicaempresa,lugarprocedencia)
              VALUES ($fregistro,$idpersona,$area,$lugarprocedencia);";
              $conn->fetchAll($sqlarea);
              return 'La persona se ha adicionado satisfactoriamente.';
              }
              else
              {
              return 'Faltan datos de la persona por enviar.';
              }


              } */
        } catch (Doctrine_Exception $e)
        {
            return $e;
        }
    }

    /*servicio que convierte la entrada y salida de los datos provenientes de la aplicacion android
        -Este servicio recive la variable $params en formato json y el resultado es devuelto en
        el mismo formato.
    */
    public function apkasistencia($params)
    {
        $parametros =json_decode($params,true);
        $respuesta = $this->servicios($parametros);
        if($respuesta->respuesta === true)
            $respuesta->respuesta = NULL;
        else
        {
            if(is_array($respuesta->respuesta))
            {
                $result = array();
                foreach($respuesta->respuesta as $resp)
                    $result[] = $resp;
                $respuesta->respuesta = $result;
            }
            else
                if($respuesta->respuesta != NULL)
                {
                    $respuesta->error = $respuesta->respuesta;
                    $respuesta->respuesta = NULL;
                }
        }

        return json_encode($respuesta);
    }



    /* Servicios publicos para intercambios con el sistema */

    public function servicios($params)
    {
        $respuesta = new stdClass();
        $respuesta->codigo = "";
        $respuesta->error = "";
        $respuesta->respuesta = NULL;
	$params = (array)$params;
        if (array_key_exists('operacion', $params))
        {

            switch ($params['operacion'])
            {
                case 'datosPersona':
                    {
                        $this->buscarDatosPersona($params, $respuesta);
                        break;
                    }

                case 'registrarAsistencia':
                    {
                        $this->registrarAsistencia($params, $respuesta);
                        break;
                    }

                case 'getEstadoAsistencia':
                    {
                        $this->getEstadoAsistencia($params, $respuesta);
                        break;
                    }

                case 'generarReporteAsistencia':
                {
                    $this->generarReporteAsistencia($params, $respuesta);
                    break;
                }

                case 'getDatosFichaBasicaPersona':
                {
                    $this->getDatosFichaBasicaPersona($params, $respuesta);
                    break;
                }

				case 'ultimasNominasEntidad':
                {
                    $this->buscarUltimasNominasEntidad($params, $respuesta);
                    break;
                }

                case 'getEstadosSeleccion':
                {
                    $this->getEstadosSeleccion($params, $respuesta);
                    break;
                }

                case 'getMediosContacto':
                    {
                        $this->getMediosContacto($params, $respuesta);
                        break;
                    }

                case 'getPlanVacaciones':
                    {
                        $this->getPlanVacaciones($params, $respuesta);
                        break;
                    }

                default :
                    {
                        $respuesta->codigo = "ERROR";
                        $respuesta->error = "No existe la operacion.";
                    }
            }
        } else
        {
            $respuesta->codigo = "ERROR";
            $respuesta->error = "El formato de los parametros es incorrecto.(operacion)";
            $respuesta->respuesta = $params['operacion'];
        }

        session_destroy();
        return $respuesta;
    }


    /*Servicio para obtener el estado de un arreglo de personas en los procesos de seleccion en los que estan implicados*/
    public function getEstadosSeleccion($params,&$respuesta)
    {

        if(array_key_exists('parametros', $params))
        {

            if (array_key_exists('idpersonas', $params['parametros']))
            {

                $idpersonas = (is_array($params['parametros']['idpersonas']) && count($params['parametros']['idpersonas']) > 0)? $params['parametros']['idpersonas']:array();
                if(count($idpersonas) > 0)
                {

                    $start = $params['parametros']['start'];
                    $limit = $params['parametros']['limit'];
                    $filtro = $params['parametros']['filtro'];

                    $result = ZendExt_IoC_Inter::getInstance()->seleccion->getEstadoCandidatos($start, $limit, $filtro, $idpersonas);

                    $respuesta->codigo = "OK";
                    $respuesta->respuesta = $result;
                }
                else
                {
                    $respuesta->codigo = "ERROR";
                    $respuesta->error = "El arreglo de idpersonas esta vacío.";
                }

            }
            else
            {
                $respuesta->codigo = "ERROR";
                $respuesta->error = "La posición idpersonas no exixte en el arreglo de parámetros.";
            }

        }
        else
        {
            $respuesta->codigo = "ERROR";
            $respuesta->error = "La posición parametros del arreglo de datos de entrada no existe.";
        }

    }

    /*Servicio para cargar los ultimos pagos desde nomina*/
    public function cargarultimospagos($identidad)
    {
        if(is_numeric($identidad))
            $result = ZendExt_IoC_Inter::getInstance()->nomina->obtenerUltimoCierreSalarioEntidad($identidad);
        else
            $result = false;
        return $result;
    }

    public function getDatosFichaBasicaPersona($params,&$respuesta)
    {
        if (array_key_exists('parametros', $params) )
        {
            $personaModel = new DatPersonaModel();
            $error = false;
            if(array_key_exists('numid', $params['parametros']) && !empty($params['parametros']['numid']))
            {
                $res = $personaModel->getDatosFichaBasicaPersona($params['parametros']['numid'],'');
            }
            else
            {
                if(array_key_exists('idsuin', $params['parametros']) && !empty($params['parametros']['idsuin']))
                {
                    $res = $personaModel->getDatosFichaBasicaPersona('',$params['parametros']['idsuin']);
                }
                else
                {
                    $error = true;
                    $respuesta->codigo = 'ERROR';
                    $respuesta->error = 'Los parámetros enviados no son correctos.';
                }
            }
            if(!$error)
            {
                $respuesta->codigo = 'OK';
                $respuesta->respuesta = $res;
            }
        }
        else
        {
            $respuesta->codigo = $params['operacion'];
            $respuesta->error = 'El formato de los parametros es incorrecto.(parametros)';
        }
    }


	public function buscarUltimasNominasEntidad($identidad)
    {
        $respuesta = new stdClass();
        $respuesta->codigo = "";
        $respuesta->error = "";
        $respuesta->respuesta = NULL;
        if (isset($identidad)) {
            $ioc = ZendExt_IoC::getInstance();
            $respuesta = $ioc->pvd->obtenerUltimoCierreSalarioEntidad($identidad);
        } else {
            $respuesta->codigo = 'ERROR';
            $respuesta->error = 'El formato de los parametros es incorrecto.(identidad)';
        }
        return json_encode($respuesta);
    }

    public function buscarDatosPersona($p, &$respuesta)
    {
        if (array_key_exists('parametros', $p))
        {
//            $p['parametros'] = (array)$p['parametros'];
            $parametros = (array)$p['parametros'];
            $personaModel = new DatPersonaModel();
			$respuesta->codigo = "OK";
            $respuesta->respuesta = $personaModel->getDatosPersonaService($parametros);
        } else
        {
            $respuesta->codigo = 'ERROR';
            $respuesta->error = 'El formato de los parametros es incorrecto.(parametros)';
        }
    }

    public function getEstadoAsistencia($params,&$respuesta)
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $parametros = (array)$params['parametros'];
        $Asistencia = "SELECT 
                          idasistencia,
                          fechahoraentrada,
                          fechahorasalida
                        FROM 
                          mod_regimentrabajo.dat_asistencia 
                        WHERE
                          idpersona = ".$parametros['idpersona']."
                          and fecharegistro =  cast('".date('d/m/Y')."' as date)
                       ";

        $rAsistencia = $conn->fetchAll($Asistencia);

        if(empty($rAsistencia[0]['fechahoraentrada']) && empty($rAsistencia[0]['fechahorasalida']))
            $respuesta->estado = -1;
        if(!empty($rAsistencia[0]['fechahoraentrada']) && empty($rAsistencia[0]['fechahorasalida']))
        {
            $respuesta->estado = 0;
            $a = explode('.', $rAsistencia[0]['fechahoraentrada']);
            $respuesta->fechahoraentrada = $a[0];
        }

        if(!empty($rAsistencia[0]['fechahoraentrada']) && !empty($rAsistencia[0]['fechahorasalida']))
        {
            $respuesta->estado = 1;
			$a = explode('.', $rAsistencia[0]['fechahoraentrada']);
            $respuesta->fechahoraentrada = $a[0];
			$b = explode('.', $rAsistencia[0]['fechahorasalida']);
            $respuesta->fechahorasalida = $b[0];
        }

    }

    public function registrarAsistencia($p, &$respuesta)
    {
        $p = (array)$p;
        if (array_key_exists('parametros', $p))
        {
            $w = "";
            $arrP = array();
            $parametros = (array)$p['parametros'];
            if (array_key_exists('idpersona', $parametros))
            {
                if (!empty($parametros['idpersona']))
                {
                    $resultado = ZendExt_IoC_Inter::getInstance()->regimentrabajo->registrarAsistencia($parametros['idpersona'],$parametros['estado']);
                    $respuesta->res = $resultado;
                    $respuesta->codigo = $resultado['codigo'];
                    if(array_key_exists('error',$resultado))
                        $respuesta->error = $resultado['error'];
                    if(array_key_exists('estado',$resultado))
                        $respuesta->estado = $resultado['estado'];

//                    $w = " AND dp.idpersona = ? ";
//                    $arrP[] = $p['parametros']['idpersona'];
//                    $r = array();
//                    $dm = Doctrine_Manager::getInstance();
//                    $conn = $dm->getCurrentConnection();
//
//                    $regimen = "SELECT
//                              drt.idregimentrabajop,drt.idgrupodescanso,
//                              drt.idregimentrabajo,drt.idturnotrabajo,
//                              tt.horainicio,tt.horafin,tt.tiempodescanso,
//                              tt.horarioalmuerzo
//                             FROM
//                              mod_personaext.dat_regimentrabajo drt
//                             INNER JOIN mod_regimentrabajo.nom_turnotrabajo tt on tt.idturnotrabajo = drt.idturnotrabajo
//                             WHERE
//                             idpersona = ".$p['parametros']['idpersona']." and actual = 1;";
//                    $rRegimen = $conn->fetchAll($regimen);
//
//                    if(count($rRegimen) > 0)
//                    {
//                        $Calendario = "SELECT
//                                          idcalendario,
//                                          horas
//                                        FROM
//                                          mod_regimentrabajo.conf_calendario
//                                        WHERE
//                                            idgrupodescanso = ".$rRegimen[0]['idgrupodescanso']." and fecha = cast('".date('d/m/Y')."' as date) and horas > 0
//                                          ;";
////                        $respuesta->respuesta = $Calendario;
//                        $rCalendario = $conn->fetchAll($Calendario);
//                        if(count($rCalendario) > 0)
//                        {
//							$p['parametros']['calendario'] = array();
//							$p['parametros']['calendario'] = $rCalendario;
//                            $Controlado = "SELECT
//                                          idcontrolado,
//                                          idcargo,
//                                          idcontrolador,
//                                          idarea
//                                        FROM
//                                          mod_rrhhmaestro.dat_controlado
//                                        WHERE
//                                          idcargo = (SELECT
//                                                        idcargo
//                                                      FROM
//                                                        mod_persona.dat_situacionlaboral sl
//                                                       INNER JOIN mod_persona.dat_personaentidad pe ON (pe.idpersonaentidad = sl.idpersonaentidad)
//                                                      WHERE
//                                                        pe.idpersona = ".$p['parametros']['idpersona']." and sl.estado = 0 and principal = 1
//                                                        and (sl.fhasta is NULL or sl.fhasta > cast('".date('d/m/Y')."' as date)))
//                                        ;";
//                            $rControlado = $conn->fetchAll($Controlado);
//
//                            if(count($rControlado) > 0)
//                            {
//                                $result = $this->AddUpdAsistencia($p['parametros'],$respuesta,$rRegimen[0]);
//                                $respuesta->codigo = "OK";
//                                $respuesta->respuesta = $result;
//                            }
//                            else
//                            {
//                                $Controlador = "SELECT
//                                                  idcontrolador,
//                                                  idcargo,
//                                                  idpersona,
//                                                  idestructuracontrol
//                                                FROM
//                                                  mod_rrhhmaestro.dat_controlador
//                                                WHERE
//                                                  idpersona = ".$p['parametros']['idpersona']." OR
//                                                  idcargo = (SELECT
//                                                                idcargo
//                                                              FROM
//                                                                mod_persona.dat_situacionlaboral sl
//                                                               INNER JOIN mod_persona.dat_personaentidad pe ON (pe.idpersonaentidad = sl.idpersonaentidad)
//                                                              WHERE
//                                                                pe.idpersona = ".$p['parametros']['idpersona']." and sl.estado = 0 and principal = 1
//                                                                and (sl.fhasta is NULL or sl.fhasta > cast('".date('d/m/Y')."' as date)))
//
//                                                ;";
//                                $rControlador = $conn->fetchAll($Controlador);
//                                if(count($rControlador) > 0)
//                                {
//                                    $result = $this->AddUpdAsistencia($p['parametros'],$respuesta,$rRegimen[0]);
//                                    $respuesta->codigo = "OK";
//                                    $respuesta->respuesta = $result;
//                                }
//                                else
//                                {
//                                    $Movimiento = "SELECT
//                                                      idmovimiento,
//                                                      idpersona,
//                                                      accion,
//                                                      idcontrolador
//                                                    FROM
//                                                      mod_rrhhmaestro.dat_movimientos
//                                                    WHERE
//                                                      idpersona = ".$p['parametros']['idpersona']." and accion = 1
//                                                    ;";
//                                    $rMovimiento = $conn->fetchAll($Movimiento);
//                                    if(count($rMovimiento) > 0)
//                                    {
//                                        $result = $this->AddUpdAsistencia($p['parametros'],$respuesta,$rRegimen[0]);
//                                        $respuesta->codigo = "OK";
//                                        $respuesta->respuesta = $result;
//                                    }
//                                    else
//                                    {
//                                        $respuesta->codigo = 'ERROR';
//                                        $respuesta->error = "La persona no se encuentra en la estructura de control de asistencia.";
//                                    }
//                                }
//                            }
//                        }
//                        else
//                        {
//                            $respuesta->codigo = 'ERROR';
//                            $respuesta->error = "La persona no tiene trabajo planificado hoy o la cantidad de horas a trabajar no se especificó en la planificación.";
//                        }
//                    }
//                    else
//                    {
//                        $respuesta->codigo = 'ERROR';
//                        $respuesta->error = "La persona no tiene régimen de trabajo configurado.";
//                    }
                } else
                {
                    $respuesta->codigo = 'ERROR';
                    $respuesta->error = "No existe valor en la posición 'idpersona' del arreglo de parámetros pasados al servicio.";
                }
            } else
            {
                $respuesta->codigo = 'ERROR';
                $respuesta->error = "No existe la posición 'idpersona' en el arreglo de parámetros pasados al servicio.";
            }

        } else
        {
            $respuesta->codigo = 'ERROR';
            $respuesta->error = 'El formato de los parametros es incorrecto.';
        }
    }

    private function AddUpdAsistencia($params,&$respuesta,$rRegimen)
    {
        $rAsistencia = array();
        try{
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            $Asistencia = "SELECT
                          idasistencia,idcausa,fechahoraentrada,fechahorasalida
                        FROM
                          mod_regimentrabajo.dat_asistencia
                        WHERE
                          idpersona = ".$params['idpersona']."
                          and fecharegistro =  cast('".date('Y-m-d')."' as date)
                       ";
            $datetime = date('Y-m-d H:i:s');
            $respuesta->fechahora = $datetime;
            $rAsistencia = $conn->fetchAll($Asistencia);

            ////////////////Cuando tienes causa y entras por el sistema y le quitas la causa en el dia////////////////////////////////////////////////////////////////////////////////////////////////////////////

             $qconcausa = "select idasistencia, fhasta, fdesde, idpersonacontrola, idcausa FROM 
                          mod_regimentrabajo.dat_asistencia 
                        WHERE
                          idpersona = ".$params['idpersona']." 
                          and idcausa is not null
                          and fdesde <=  cast('".date('Y-m-d')."' as date) 
                          and fhasta >= cast('".date('Y-m-d')."' as date)
                       ";
            $concausa = $conn->fetchAll($qconcausa);

            //Si tiene causa de periodo, y esta causa no es puesta hoy, se le modifica la causa
            if(count($concausa) > 0)
            {

                $fdesde = DateTime::createFromFormat("d/m/Y", $concausa[0]['fdesde']);
                $hoy = DateTime::createFromFormat("d/m/Y", date("d/m/Y"));

				$horas = $params['calendario'][0]['horas'];				
                if($fdesde < $hoy)
                {				
					$hoycopiah = DateTime::createFromFormat("d/m/Y", $hoy->format('d/m/Y'));
			
					$fhastanew = $hoycopiah->modify("-1 day");					
					$interval = $fdesde->diff($fhastanew);
					$dias = $interval->format('%a') + 1;
					$descontadas = $horas * $dias.':00';
					
                    $AsistenciaUpdate = "UPDATE
                                      mod_regimentrabajo.dat_asistencia
                                    SET
                                      fhasta = now() - CAST('1 days' as interval) ,
									  hrsdescontadas = ".$descontadas." 
									  WHERE 
                                      idasistencia = ".$concausa[0]['idasistencia'];
                    $resultado = $conn->prepare($AsistenciaUpdate);
                    $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'],$resultado->getConnection()->getOptions()['username'],$resultado->getConnection()->getOptions()['password']);
                    $res = $DBC->prepare($AsistenciaUpdate);
                    $res->execute();
                }

                if($fdesde == $hoy)
                {
                    $AsistenciaUpdate = "UPDATE
                                      mod_regimentrabajo.dat_asistencia
                                    SET
                                       idcausa = NULL,
                                      fdesde = NULL,
                                      fhasta = NULL,                                                                       
									  idpersonacontrola = NULL,
									  hrsdescontadas = NULL 
                                    WHERE
                                      idasistencia = ".$concausa[0]['idasistencia'];
                    $resultado = $conn->prepare($AsistenciaUpdate);
                    $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'],$resultado->getConnection()->getOptions()['username'],$resultado->getConnection()->getOptions()['password']);
                    $res = $DBC->prepare($AsistenciaUpdate);
                    $res->execute();
                }

                $fhasta = DateTime::createFromFormat("d/m/Y", $concausa[0]['fhasta']);

                //Si es una causa que el fhasta es mayor que el dia de hoy, creo la misma causa a partir de mannana
                if($fhasta > $hoy)
                {
					$hoycopia = DateTime::createFromFormat("d/m/Y", $hoy->format('d/m/Y'));
					
					$fdesdenew = $hoycopia->add(new DateInterval('P1D'));					
					$interval = $fdesdenew->diff($fhasta);
					$dias = $interval->format('%a') + 1;
					$descontadas = $horas * $dias.':00';
					
                    $AsistenciaInsert = "INSERT INTO
                                      mod_regimentrabajo.dat_asistencia
                                    (
                                      idcausa,
                                      fdesde,
                                      fhasta,
									  hrsdescontadas,
                                      idpersona,
                                      fecharegistro,
									  idpersonacontrola
                                    )
                                    VALUES (".$concausa[0]['idcausa'].",now() + CAST('1 days' as interval),   cast('".date_format($fhasta, 'Y-m-d')."' as date),".$descontadas.",".$params['idpersona'].", now() + CAST('1 days' as interval), ".$concausa[0]['idpersonacontrola'].");";

                    $resultado = $conn->prepare($AsistenciaInsert);
                    $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'],$resultado->getConnection()->getOptions()['username'],$resultado->getConnection()->getOptions()['password']);
                    $res = $DBC->prepare($AsistenciaInsert);
                    $res->execute();
                }
            }

            //Buscando si tiene una causa el dia de hoy que no es de rango
            $qcausahoy = "select idasistencia FROM 
                          mod_regimentrabajo.dat_asistencia 
                        WHERE
                          idpersona = ".$params['idpersona']." 
                          and idcausa is not null
                          and fecharegistro =  cast('".date('Y-m-d')."' as date)";
            $causahoy = $conn->fetchAll($qcausahoy);

            if(count($causahoy) > 0)
            {
                $AsistenciaUpdate = "UPDATE
                                      mod_regimentrabajo.dat_asistencia
                                    SET
                                       idcausa = NULL,  
									  idpersonacontrola = NULL,
									  hrsdescontadas = NULL
                                    WHERE
                                      idasistencia = ".$causahoy[0]['idasistencia'];
                $resultado = $conn->prepare($AsistenciaUpdate);
                $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'],$resultado->getConnection()->getOptions()['username'],$resultado->getConnection()->getOptions()['password']);
                $res = $DBC->prepare($AsistenciaUpdate);
                $res->execute();
            }
            ///////////////////////////Cuando tienes causa y entras por el sistema y le quitas la causa en el dia/////////////////////////////////////////////////////////////////////////////////////////////////

            $causasdefecto = $this->getHabilitarcausa();
            $ausencia = false;
            $tarde = false;
            $salidaantes = false;
            $tardesalidaantes = false;
            if($causasdefecto[0]['habilitado'] == 1){
                $ausencia = true;
            }
            if($causasdefecto[1]['habilitado'] == 1){
                $tarde = true;
            }
            if($causasdefecto[2]['habilitado'] == 1){
                $salidaantes = true;
            }
            if($causasdefecto[3]['habilitado'] == 1){
                $tardesalidaantes = true;
            }
            //date_default_timezone_set("America/Guyana");
            $horatt = $this->getHorarioByPersona($params['idpersona']);

            $hitt = explode(':', $horatt['horainicio']);
            $hftt = explode(':', $horatt['horafin']);
            $hdiftt = explode(':', $horatt['hlab']);

            $horainitt = new DateTime(date('H:i', mktime($hitt[0], $hitt[1], 0, 1, 1, 2000))); //Construccion del DateTime de la hora inicial
            $horafintt = new DateTime(date('H:i', mktime($hftt[0], $hftt[1], 0, 1, 1, 2000))); //Construccion del DateTime de la hora final
            $horadiftt = new DateTime(date('H:i', mktime($hdiftt[0], $hdiftt[1], 0, 1, 1, 2000)));

            $nowtime = new DateTime(date('H:i'));
            $idcausa = "NULL";

            if(count($rAsistencia) == 0 )
            {

                if($nowtime > $horainitt && $tarde)
                    $idcausa = 3;

                $AsistenciaInsert = "INSERT INTO
                                      mod_regimentrabajo.dat_asistencia
                                    (
                                      fechahoraentrada,
                                      idpersona,
                                      fecharegistro,
									  idpersonacontrola,
									  idcausa
                                    )
                                    VALUES (now(),".$params['idpersona'].", now(), ".$params['idpersona'].",".$idcausa.");";


                $resultado = $conn->prepare($AsistenciaInsert);

                $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'],$resultado->getConnection()->getOptions()['username'],$resultado->getConnection()->getOptions()['password']);
                $res = $DBC->prepare($AsistenciaInsert);
                 $res->execute();
                $respuesta->estado = 0;

            }
            else
            {
                if(array_key_exists('acceso',$params) && is_numeric($params['acceso']))
                {
                    if($params['acceso'] == 0)
                    {
                        if($nowtime > $horainitt && $tarde)
                            $idcausa = 3;
                        $AsistenciaUpdate = "UPDATE
                                      mod_regimentrabajo.dat_asistencia
                                    SET
                                      fechahoraentrada = now(),
									  idpersonacontrola = ".$params['idpersona'].",
									  idcausa = ".$idcausa."
                                    WHERE
                                      idasistencia = (SELECT
                                                        idasistencia
                                                      FROM
                                                        mod_regimentrabajo.dat_asistencia
                                                      WHERE
                                                        idpersona = ".$params['idpersona']." and fecharegistro = cast('".date('Y-m-d')."' as date))
                                    ;";

                        $resultado = $conn->prepare($AsistenciaUpdate);
                        $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'],$resultado->getConnection()->getOptions()['username'],$resultado->getConnection()->getOptions()['password']);
                        $res = $DBC->prepare($AsistenciaUpdate);
                        $res->execute();
                        $respuesta->estado = 0;
                    }
                    else
                    {
                        if($nowtime < $horafintt && $salidaantes){
                            if($rAsistencia[0]['idcausa'] == 3 && $tardesalidaantes)
                                $idcausa = 6;
                            else
                                $idcausa = 5;
                        }else
                            $idcausa = $rAsistencia[0]['idcausa'] == null ? "NULL":$rAsistencia[0]['idcausa'];

                        $AsistenciaUpdate = "UPDATE
                                      mod_regimentrabajo.dat_asistencia
                                    SET
                                      fechahorasalida = now(),
                                      idcausa = ".$idcausa."
                                    WHERE
                                      idasistencia = (SELECT
                                                        idasistencia
                                                      FROM
                                                        mod_regimentrabajo.dat_asistencia
                                                      WHERE
                                                        idpersona = ".$params['idpersona']." and fecharegistro = cast('".date('Y-m-d')."' as date))
                                    ;";

                        $resultado = $conn->prepare($AsistenciaUpdate);
                        $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'],$resultado->getConnection()->getOptions()['username'],$resultado->getConnection()->getOptions()['password']);
                        $res = $DBC->prepare($AsistenciaUpdate);
                        $res->execute();
                        $respuesta->estado = 1;
                    }
                }
                else
                {
                    if(empty($rAsistencia[0]->fechahoraentrada) && empty($rAsistencia[0]['fechahoraentrada']))
                    {
                        if($nowtime > $horainitt && $tarde)
                            $idcausa = 3;
                        $AsistenciaUpdate = "UPDATE
                                      mod_regimentrabajo.dat_asistencia
                                    SET
                                      fechahoraentrada = now(),
                                      idcausa = ".$idcausa."
                                    WHERE
                                      idasistencia = (SELECT
                                                        idasistencia
                                                      FROM
                                                        mod_regimentrabajo.dat_asistencia
                                                      WHERE
                                                        idpersona = ".$params['idpersona']." and fecharegistro = cast('".date('Y-m-d')."' as date))
                                    ;";

                        $resultado = $conn->prepare($AsistenciaUpdate);
                        $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'],$resultado->getConnection()->getOptions()['username'],$resultado->getConnection()->getOptions()['password']);
                        $res = $DBC->prepare($AsistenciaUpdate);
                        $res->execute();
                        $respuesta->estado = 0;
                    }
                    else
                    {
                        if($nowtime < $horafintt && $salidaantes){
                            if($rAsistencia[0]['idcausa'] == 3 && $tardesalidaantes)
                                $idcausa = 6;
                            else
                                $idcausa = 5;
                        }else
                            $idcausa = $rAsistencia[0]['idcausa'] == null ? "NULL":$rAsistencia[0]['idcausa'];
                        $AsistenciaUpdate = "UPDATE
                                      mod_regimentrabajo.dat_asistencia
                                    SET
                                      fechahorasalida = now(),
                                      idcausa = ".$idcausa."
                                    WHERE
                                      idasistencia = (SELECT
                                                        idasistencia
                                                      FROM
                                                        mod_regimentrabajo.dat_asistencia
                                                      WHERE
                                                        idpersona = ".$params['idpersona']." and fecharegistro = cast('".date('Y-m-d')."' as date))
                                    ;";

                        $resultado = $conn->prepare($AsistenciaUpdate);
                        $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'],$resultado->getConnection()->getOptions()['username'],$resultado->getConnection()->getOptions()['password']);
                        $res = $DBC->prepare($AsistenciaUpdate);
                        $res->execute();
                        $respuesta->estado = 1;

                    }

                }

                //////////////////////////////////////////////////Horas perdidas y horas extras/////////////////////////////////////////////////////////////////////////////////////////////////////////
                $sqlHET = "select CASE
                WHEN
                    CAST(asis.fechahoraentrada as TIMESTAMP) < CAST(asis.fecharegistro||' ".$rRegimen['horarioalmuerzo']."' as TIMESTAMP)
                THEN
                    (CAST(asis.fecharegistro||' ".$rRegimen['horainicio']."' as TIMESTAMP) - (select da.fechahoraentrada from mod_regimentrabajo.dat_asistencia da
                     where da.fecharegistro = asis.fecharegistro and da.idpersona = asis.idpersona))
                ELSE
                    (CASE
                     WHEN
                         (CAST(asis.fechahoraentrada as TIMESTAMP) >= CAST(asis.fecharegistro||' ".$rRegimen['horarioalmuerzo']."' as TIMESTAMP) and asis.fechahoraentrada <=
                          CAST(asis.fecharegistro||' '||(CAST('".$rRegimen['horarioalmuerzo']."' as INTERVAL)+CAST('".$rRegimen['tiempodescanso']."' as INTERVAL)) as timestamp))
                    THEN
                         (CAST(asis.fecharegistro||' ".$rRegimen['horainicio']."' as TIMESTAMP) - CAST(asis.fecharegistro||' ".$rRegimen['horarioalmuerzo']."' as TIMESTAMP))
                    ELSE
                          (CAST(asis.fecharegistro||' ".$rRegimen['horainicio']."' as TIMESTAMP) - ((select da.fechahoraentrada from mod_regimentrabajo.dat_asistencia da
                          where da.fecharegistro = asis.fecharegistro and da.idpersona = asis.idpersona) - CAST('".$rRegimen['tiempodescanso']."' as INTERVAL)))
                    END)
                END
        as diferenciaentrada
        ,
        CASE
        WHEN
            CAST(asis.fechahorasalida as TIMESTAMP) > CAST(asis.fecharegistro||' '||(CAST('".$rRegimen['horarioalmuerzo']."' as INTERVAL)+CAST('".$rRegimen['tiempodescanso']."' as INTERVAL)) as timestamp)
        THEN
            ((select da.fechahorasalida from mod_regimentrabajo.dat_asistencia da
            where da.fecharegistro = asis.fecharegistro and da.idpersona = asis.idpersona)- CAST(asis.fecharegistro||' ".$rRegimen['horafin']."' as TIMESTAMP) )
        ELSE
            (CASE
             WHEN
                (CAST(asis.fechahorasalida as TIMESTAMP) >= CAST(asis.fecharegistro||' ".$rRegimen['horarioalmuerzo']."' as TIMESTAMP) and asis.fechahorasalida <=
                 CAST(asis.fecharegistro||' '||(CAST('".$rRegimen['horarioalmuerzo']."' as INTERVAL)+CAST('".$rRegimen['tiempodescanso']."' as INTERVAL)) as timestamp))
             THEN
                (CAST(asis.fecharegistro||' '||(CAST('".$rRegimen['horarioalmuerzo']."' as INTERVAL)+CAST('".$rRegimen['tiempodescanso']."' as INTERVAL)) as timestamp) - CAST(asis.fecharegistro||' ".$rRegimen['horafin']."' as TIMESTAMP))
             ELSE
                ((select da.fechahorasalida from mod_regimentrabajo.dat_asistencia da
                where da.fecharegistro = asis.fecharegistro and da.idpersona = asis.idpersona)- (CAST(asis.fecharegistro||' ".$rRegimen['horafin']."' as TIMESTAMP) -
                CAST('".$rRegimen['tiempodescanso']."' as INTERVAL)))
             END)
        END as diferenciasalida,
        asis.idpersona,
        asis.fecharegistro,
        asis.fechahoraentrada,
        asis.fechahorasalida

        from mod_regimentrabajo.dat_asistencia asis
        where asis.fecharegistro = current_date and asis.idpersona = ".$params['idpersona'].";";

                $HEP = $conn->fetchAll($sqlHET);
                $HE = $HEP[0]['diferenciaentrada'];
                $HS = $HEP[0]['diferenciasalida'];
                $horasE = substr($HE,0,1);
                $horasS = substr($HS,0,1);

                $set = "";

                if(is_numeric($horasE) && is_numeric($horasS))
                {
                    $henm = explode('.',$HE);
                    $hsnm = explode('.',$HS);
                    $heInter = $this->time_to_interval($henm[0]);
                    $hsInter = $this->time_to_interval($hsnm[0]);
                    $intervResult = $this->add_intervals($heInter,$hsInter);
                    $formattedInterv = $this->format_interval_hhmmss($intervResult);
                    $res = explode(':',$formattedInterv);
                    if(count($res) > 1)
                        $set = (strlen($res[0]) == 1)?"horasextras = '0".$res[0].":".$res[1]."'":"horasextras = '".$res[0].":".$res[1]."'";
                    else
                        $set = "horasextras = null";
                }
                else
                {
                    if((!is_numeric($horasE) && !is_numeric($horasS)))
                    {
                        $henm = explode('.',$HE);
                        $hsnm = explode('.',$HS);
                        $hent = explode('-',$henm[0]);
                        $hsal = explode('-',$hsnm[0]);
                        $heInter = $this->time_to_interval($hent[1]);
                        $hsInter = $this->time_to_interval($hsal[1]);
                        $intervResult = $this->add_intervals($heInter,$hsInter);
                        $formattedInterv = $this->format_interval_hhmmss($intervResult);
                        $res = explode(':',$formattedInterv);
                        if(count($res) > 1)
                            $set = (strlen($res[0]) == 1)?"hrsdescontadas = '0".$res[0].":".$res[1]."'":"hrsdescontadas = '".$res[0].":".$res[1]."'";
                        else
                            $set = "hrsdescontadas = null";
                    }
                    else
                    {
                        if((is_numeric($horasE) && !is_numeric($horasS)))
                        {
                            $henm = explode('.',$HE);
                            $hsnm = explode('.',$HS);

                            $hsal = explode('-',$hsnm[0]);
                            $hdesc = explode(':',$hsal[1]);
                            $hext = explode(':',$henm[0]);

                            $setHE = (strlen($hext[0]) == 1)?"horasextras = '0".$hext[0].":".$hext[1]."'":"horasextras = '".$hext[0].":".$hext[1]."'";
                            if(count($hdesc) > 1)
                                $setHD = (strlen($hdesc[0]) == 1)?"hrsdescontadas = '0".$hdesc[0].":".$hdesc[1]."'":"hrsdescontadas = '".$hdesc[0].":".$hdesc[1]."'";
                            else
                                $setHD = " null ";
                            $set = $setHE.",".$setHD;
                        }
                        else
                        {
                            $henm = explode('.',$HE);
                            $hsnm = explode('.',$HS);

                            $hent = explode('-',$henm[0]);
                            $hdesc = explode(':',$hent[1]);
                            $hext = explode(':',$hsnm[0]);

                            $setHE = (strlen($hext[0]) == 1)?"horasextras = '0".$hext[0].":".$hext[1]."'":"horasextras = '".$hext[0].":".$hext[1]."'";
                            if(count($hdesc) > 1)
                                $setHD = (strlen($hdesc[0]) == 1)?"hrsdescontadas = '0".$hdesc[0].":".$hdesc[1]."'":"hrsdescontadas = '".$hdesc[0].":".$hdesc[1]."'";
                            else
                                $setHD = " null ";
                            $set = $setHE.",".$setHD;
                        }
                    }
                }

                $UpdateHEP = "UPDATE
                                      mod_regimentrabajo.dat_asistencia
                                    SET
                                       ".$set." 
                                    WHERE
                                      idasistencia = (SELECT
                                                        idasistencia
                                                      FROM
                                                        mod_regimentrabajo.dat_asistencia
                                                      WHERE
                                                        idpersona = ".$params['idpersona']." and fecharegistro = cast('".date('Y-m-d')."' as date))
                                    ;";
//return $UpdateHEP;
                $resultado = $conn->prepare($UpdateHEP);
                $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'],$resultado->getConnection()->getOptions()['username'],$resultado->getConnection()->getOptions()['password']);
                $res = $DBC->prepare($UpdateHEP);
                $res->execute();

                //////////////////////////////////////////////////Horas perdidas y horas extras/////////////////////////////////////////////////////////////////////////////////////////////////////////
            }

            return true;

        }
        catch(Exception $h){
            return $h->getMessage();
        }
    }

    private function getHorarioByPersona($idpersona){
        $horario = '';
        try{
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            $sql = "SELECT tt.horainicio, tt.horafin, (tt.horafin - tt.horainicio) as hlab, tt.tiempodescanso as tdescanso, rt.idgrupodescanso, rt.idregimentrabajo, nrt.tipofondotiempo, nrt.fondotiempo
            FROM mod_personaext.dat_regimentrabajo rt
            INNER JOIN mod_regimentrabajo.nom_turnotrabajo tt ON (rt.idturnotrabajo = tt.idturnotrabajo)
            INNER JOIN mod_regimentrabajo.nom_regimentrabajo nrt ON(rt.idregimentrabajo = nrt.idregimentrabajo)
            WHERE rt.actual = 1
            AND rt.idpersona = $idpersona";
            $horario = $conn->fetchAll($sql)[0];
        }
        catch(Exception $h){
            return $h->getMessage();
        }
        return $horario;
    }

    public function getHabilitarcausa()
    {
        $result = '';
        try{
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();

            $sql = "select conf.* from mod_regimentrabajo.conf_habcausa conf";

            $result = $conn->fetchAll($sql);
            foreach ($result as $v){
                if($v['habilitado'] == 1){
                    $result[$v]['habilitado'] = true;
                }
            }
        }
        catch(Exception $h){
            return $h->getMessage();
        }
        return $result;
    }

    private function time_to_interval($time) {
        $parts = explode(':',$time);
        return new DateInterval('PT'.$parts[0].'H'.$parts[1].'M'.$parts[2].'S');
    }

    private function add_intervals($a,$b) {
        $zerodate = new DateTime('0000-01-01 00:00:00');
        $dt = clone $zerodate;
        $dt->add($a);
        $dt->add($b);
        return $zerodate->diff($dt);
    }

    private function format_interval_hhmmss($interval){
        $totalhours = $interval->h + ($interval->d * 24);
        return $totalhours.$interval->format(':%I:%S');
    }

    public function generarReporteAsistencia($p,&$respuesta){
        try {
            $p['parametros'] = (array)$p['parametros'];
           if(isset($p['parametros']['idpersona']))
           {
               if(!isset($p['parametros']['fdesde']) || !isset($p['parametros']['fhasta']) ||
                   empty($p['parametros']['fdesde']) || empty($p['parametros']['fhasta']))
               {
                   list($d,$m,$a) = explode('/',date('d/m/Y'));
                   $mesSiguiente = $m + 1;
                   $yearSiguiente = $a;
                   if($m == 12)
                   {
                       $mesSiguiente = 1;
                       $yearSiguiente += 1;
                   }
                   $fd = new DateTime( $a .'-'.$m.'-'. 1 );
                   $fh = new DateTime( $yearSiguiente .'-'.$mesSiguiente.'-'. 1 );
                   date_sub($fh,date_interval_create_from_date_string('1 days'));
                   $fdesde = $fd->format('d/m/Y');
                   $fhasta = $fh->format('d/m/Y');
               }
               else
               {
                   $fdesde = $p['parametros']['fdesde'];
                   $fhasta = $p['parametros']['fhasta'];
               }
               $result = ZendExt_IoC_Inter::getInstance()->regimentrabajo->generarReporteAsistencia($fdesde, $fhasta, $p['parametros']['idpersona']);
               $respuesta->codigo = "OK";
               $respuesta->respuesta = $result;
           }
           else
           {
               $respuesta->codigo = "ERROR";
               $respuesta->error = "No existe valor en la posición 'idpersona' del arreglo de parámetros pasados al servicio.";
           }
        }catch(Exception $h){
            return $h->getMessage();
        }
    }

    private function getMediosContacto($param, &$respuesta) {
        $objmedio = new NomTipomediocontacto();
        $respuesta->codigo = "OK";
        $respuesta->respuesta = $objmedio->getActiveTypeContactMedium($param['parametros']['filtro']);
    }

    public function getProvinciasMunicipios()
    {
        $objper = new DatPersona();
        $datos = $objper->getProvMunPersonas();
        return json_encode($datos);
    }

    public function getPersonasByMultiplesParametros($numid, $idprovincia, $idmunicipio, $idestructura, $idcargo, $fnacimiento, $contacto)
    {
        $objper = new DatPersona();
        $idcargos = Array();
        if (!empty($idcargo)) {
            array_push($idcargos, $idcargo);
            $idestructura = null;
        } else if (!empty($idestructura)) {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            if (count($cargos) > 0) {
                foreach ($cargos as $h => $carg) {
                    $idcargos[$h] = $carg['idcargo'];
                }
            }
        }
        $datos = $objper->getPersonasByMultiplesParametros($numid, $idprovincia, $idmunicipio, $idcargos, $fnacimiento, $contacto);

        foreach ($datos as $a => $d) {
            $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($d['identidad']);
            $datos[$a]['entidad'] = $entidad[0]->denominacion;
            $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($d['idarea']);
            $datos[$a]['area'] = $area[0]->denominacion;
        }
        return json_encode($datos);
    }
    
    public function getPersonasCumplenAnnos($fdesde, $fhasta)
    {
        $objper = new DatPersona();
        $datos = $objper->getPersonasCumplenAnnos($fdesde, $fhasta);
        
        foreach ($datos as $a => $d) {
            $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($d['identidad']);
            $datos[$a]['entidad'] = $entidad[0]->denominacion;
            $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($d['idarea']);
            $datos[$a]['area'] = $area[0]->denominacion;
        }
        
        return json_encode($datos);
    }
    
    public function obtenerFechasCierresPeriodos($idpersona)
    {
        $ioc = ZendExt_IoC::getInstance();
        $datos = $ioc->pvd->obtenerFechasCierresPeriodos($idpersona);
        
        return json_encode($datos);
    }
    
    public function obtenerSalarioFechaCierrePeriodosPersona($arrayidfechascierre, $arraypersonas)
    {
        $ioc = ZendExt_IoC::getInstance();
        $datos = $ioc->pvd->obtenerSalarioFechaCierrePeriodosPersona($arrayidfechascierre, $arraypersonas);
        
        return json_encode($datos);
    }

    public function getIngresosByNumid($numid)
    {
        $objper = new DatIngresoModel();
        $datos = $objper->getIngresosByNumid($numid);
        return json_encode($datos);
    }

    public function getCargosByNumid($numid)
    {
        $objper = new DatPersona();
        $datos = $objper->getCargosByNumid($numid);
        foreach ($datos as $a => $d) {
            $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($d['identidad']);
            $datos[$a]['entidad'] = $entidad[0]->denominacion;
            $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($d['idarea']);
            $datos[$a]['area'] = $area[0]->denominacion;
        }

        return json_encode($datos);
    }

    public function getPlanVacaciones($params, &$respuesta)
    {
        try {
            if(isset($params['parametros']))
            {
                if(!isset($params['parametros']['anno']))
                {
                    $idestructura = (isset($params['parametros']['idestructura'])) ? $params['parametros']['idestructura'] : '';
                    $filtro = (isset($params['parametros']['filtro'])) ? $params['parametros']['filtro'] : '';
                    $start = (isset($params['parametros']['start'])) ? $params['parametros']['start'] : '';
                    $limit = (isset($params['parametros']['limit'])) ? $params['parametros']['limit'] : '';
                    $anno = $params['parametros']['anno'];

                    $result = ZendExt_IoC_Inter::getInstance()->regimentrabajo->getPlanVacaiones($idestructura, $filtro, $limit, $start, $anno);
                    $respuesta->codigo = "OK";
                    $respuesta->respuesta = $result;
                }
                else
                {
                    $respuesta->codigo = "ERROR";
                    $respuesta->error = "Debe al menos especificar el año del cual quiere obtener el plan de vacaciones.";
                }

            }
            else
            {
                $respuesta->codigo = "ERROR";
                $respuesta->error = "Debe enviar parámetros al servicio.";
            }
        }catch(Exception $h){
            return $h->getMessage();
        }
    }
}
