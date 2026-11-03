<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class EstructuraModel extends ZendExt_Model
{
    /**
     * @var object
     */
    private $perfil;
    private $consecutivo;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new DatEstructura();
        $globalConcept = ZendExt_GlobalConcept::getInstance();
        $this->perfil = $globalConcept->Perfil;
    }

    /**
     * Descripción del método: Obtiene el identificador de la estructura padre de la especificada
     *
     * @author    : Ing. Osvaldo Gonzalez
     *
     * @param $idEstructura
     *
     * @return array : Retorna un arreglo con el id del padre
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameIdPadre($idEstructura)
    {
        if (count($idEstructura) > 0) {
            $where = "fila.idfila = '$idEstructura";
            if (is_array($idEstructura)) {
                $where = "fila.idfila IN (" . implode(',', $idEstructura) . ")";
            }
            $query = Doctrine_Query::create();
            $estructura = $query->select('fila.idpadre')->from('NomFilaestruc fila')->where($where)->setHydrationMode(
                Doctrine::HYDRATE_ARRAY
            )->execute();
            if (count($estructura) > 0) {
                return $estructura;
            } else {
                return false;
            }
        }

        return false;
    }

    /**
     * Descripción del método: Obtiene la ruta de una estructura especificada
     *
     * @author    : Ing. Javier Limonta
     * @modified  : Ing. Osvaldo Gonzalez
     *
     * @param $arrayEstructura
     * @param $datos
     * @param $proyecto
     *
     * @return array, Retorna un arreglo con un texto de la ruta de la estructura y el id de la misma
     * @copyright Copyright (c) 2013 xetid
     */
    /*public function dameRutaEstructura($arrayEstructura, $datos, $proyecto = 0)
    {

        $query = Doctrine_Query::create();
        $conn = $query->getConnection();
        $rutas = array();

        foreach ($arrayEstructura AS $datosEstructura) {
            $estructura = $query->select('fila.parent_path, fila.idfila')->from(
                'NomFilaestruc fila'
            )->where(
                "fila.idfila = '$datosEstructura'"
            )->limit(1)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            $rutaId = '';
            $rutaDenom = '';
            $parent_path = $estructura [0] ['parent_path'];
            $rango = "fila.parent_path operator (public.@>) '$parent_path'";
            $sqlFiltroProyectoEstructura = " AND (idestado = 0 ) ";
            $sqlFiltroProyectoEstructuraOP = " AND (estructuraop.idestado = 0 ) ";
            $sqlFiltroProyectoCargo = " AND (cargo.idestado = 0 ) ";
            $sqlFiltroProyectoMedio = " AND (medio.idestado = 0 ) ";
            if ($estructura [0] ['parent_path']) {
                if ($proyecto != 0 && is_numeric($proyecto)) { // tratamiento del proyecto
                    $rango = "fila.parent_path operator (public.@>) '$parent_path'";
                    $sqlFiltroProyectoEstructura
                        = " AND ((estructura.idestado = 0 and estructura.modificado[$proyecto] = 0) " .
                        "OR ( estructura.idproyecto = $proyecto))";
                    $sqlFiltroProyectoEstructuraOP
                        = " AND ((estructuraop.idestado = 0 and estructuraop.modificado[$proyecto] = 0) " .
                        "OR ( estructuraop.idproyecto = $proyecto))";
                    $sqlFiltroProyectoCargo = " AND ((cargo.idestado = 0 and cargo.modificado[$proyecto] = 0) " .
                        "OR ( cargo.idproyecto = $proyecto))";
                    $sqlFiltroProyectoMedio = " AND ((medio.idestado = 0 and medio.modificado[$proyecto] = 0) " .
                        "OR ( medio.idproyecto = $proyecto))";
                }
                $rutaSQL
                    = "SELECT
                      i.icono AS icon,
           CASE
            WHEN nomcvil.denominacion <> '' THEN nomcvil.denominacion
            WHEN estructura.denominacion <> '' THEN estructura.denominacion
            WHEN estructuraop.denominacion <> '' THEN estructuraop.denominacion
            WHEN nommedio.denominacion <> '' THEN nommedio.denominacion
           END AS denominacion,  estructura.codigo,
           fila.idfila, fila.idconcepto AS idnomeav, fila.idpadre
          FROM mod_estructuracomp.nom_filaestruc fila
          INNER JOIN mod_estructuracomp.nom_concepto nomeav
              ON (fila.idconcepto = nomeav.idconcepto)
          INNER JOIN mod_estructuracomp.nom_icono i
              ON (i.idicono = nomeav.idicono)
          LEFT JOIN mod_estructuracomp.dat_estructura estructura
              ON ( estructura.idestructura = fila.idfila $sqlFiltroProyectoEstructura)
          LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop
              ON ( estructuraop.idestructuraop = fila.idfila $sqlFiltroProyectoEstructuraOP)
          LEFT JOIN mod_estructuracomp.dat_cargo cargo
              ON ( cargo.idcargo = fila.idfila $sqlFiltroProyectoCargo)
          LEFT JOIN mod_estructuracomp.dat_medio medio
              ON ( medio.idmedio = fila.idfila $sqlFiltroProyectoMedio)
          LEFT JOIN mod_datosmaestros.nom_indicador nommedio
              ON ( nommedio.idindicador = medio.idnommedio )
          LEFT JOIN mod_estructuracomp.nom_cargo nomcvil
              ON ( cargo.idnomcargo = nomcvil.idnomcargo )
          WHERE fila.fechafin IS NULL AND $rango AND (nomcvil.denominacion <> '' OR estructura.denominacion <> ''
           OR estructuraop.denominacion <> '')
          ORDER BY fila.parent_path";
                list($rutaId, $rutaDenom, $rutas) = $this->construirRuta(
                    $datos, $conn, $rutaSQL, $rutaId, $rutaDenom, $rutas
                );
            }
            if (!$datos) {
                $rutas[] = array('rutaDenominacion' => $rutaDenom, 'rutaId' => $rutaId);
            } else {
                $object = $this->dameDatosEstructura($estructura[0]['idfila']);
                $rutas[] = array(
                    'denominacion' => $object[0]['denominacion'], 'idfila' => $object[0]['idestructura'],
                    'idnomeav' => $object[0]['idtipo'], 'idpadre' => $object[0]['idpadre'],
                    'icon' => $object[0]['icon'], 'codigo' => $object[0]['codigo']);
            }
        }

        return $rutas;
    }*/

    public function dameRutaEstructura($arrayEstructura, $datos, $proyecto = 0, $incluyeEstructura = true)
    {
        $query = Doctrine_Query::create();
        $conn = $query->getConnection();
        $rutas = array();
        foreach ($arrayEstructura AS $datosEstructura) {
            $estructura = $query->select('fila.parent_path, fila.idfila')->from('NomFilaestruc fila')->where(
                "fila.idfila = '$datosEstructura'"
            )->limit(1)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            $rutaId = '';
            $rutaDenom = '';

            if ($estructura [0] ['parent_path']) {

                $parent_path = $estructura [0] ['parent_path'];
                if ($proyecto != 0 && is_numeric($proyecto)) { // tratamiento del proyecto
                    $rango = "fila.parent_path operator(public.@>) '$parent_path'";
                    $sqlFiltroProyectoEstructura
                        = " AND ((estructura.idestado = 0 and estructura.modificado[$proyecto] = 0) " .
                        "OR ( estructura.idproyecto = $proyecto))";
                    $sqlFiltroProyectoEstructuraOP
                        = " AND ((estructuraop.idestado = 0 and estructuraop.modificado[$proyecto] = 0) " .
                        "OR ( estructuraop.idproyecto = $proyecto))";
                    $sqlFiltroProyectoCargo = " AND ((cargo.idestado = 0 and cargo.modificado[$proyecto] = 0) " .
                        "OR ( cargo.idproyecto = $proyecto))";
                    $sqlFiltroProyectoMedio = " AND ((medio.idestado = 0 and medio.modificado[$proyecto] = 0) " .
                        "OR ( medio.idproyecto = $proyecto))";
                } else {
                    $rango = "fila.parent_path operator(public.@>) '$parent_path'";
                    $sqlFiltroProyectoEstructura = " AND (idestado = 0 ) ";
                    $sqlFiltroProyectoEstructuraOP = " AND (estructuraop.idestado = 0 ) ";
                    $sqlFiltroProyectoCargo = " AND (cargo.idestado = 0 ) ";
                    $sqlFiltroProyectoMedio = " AND (medio.idestado = 0 ) ";
                }
                $rutaSQL = "SELECT
                      i.icono AS icon,
           CASE
            WHEN nomcvil.denominacion <> '' THEN nomcvil.denominacion
            WHEN estructura.denominacion <> '' THEN estructura.denominacion
            WHEN estructuraop.denominacion <> '' THEN estructuraop.denominacion
            WHEN nommedio.denominacion <> '' THEN nommedio.denominacion
           END AS denominacion,
           fila.idfila, fila.idconcepto AS idnomeav, fila.idpadre
          FROM mod_estructuracomp.nom_filaestruc fila
          INNER JOIN mod_estructuracomp.nom_concepto nomeav 
              ON (fila.idconcepto = nomeav.idconcepto)
          INNER JOIN mod_estructuracomp.nom_icono i 
              ON (i.idicono = nomeav.idicono)
          LEFT JOIN mod_estructuracomp.dat_estructura estructura 
              ON ( estructura.idestructura = fila.idfila $sqlFiltroProyectoEstructura)
          LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop 
              ON ( estructuraop.idestructuraop = fila.idfila $sqlFiltroProyectoEstructuraOP)
          LEFT JOIN mod_estructuracomp.dat_cargo cargo 
              ON ( cargo.idcargo = fila.idfila $sqlFiltroProyectoCargo)
          LEFT JOIN mod_estructuracomp.dat_medio medio 
              ON ( medio.idmedio = fila.idfila $sqlFiltroProyectoMedio)
          LEFT JOIN mod_datosmaestros.nom_indicador nommedio 
              ON ( nommedio.idindicador = medio.idnommedio )
          LEFT JOIN mod_estructuracomp.nom_cargo nomcvil 
              ON ( cargo.idnomcargo = nomcvil.idnomcargo )
          WHERE fila.fechafin IS NULL AND $rango AND (nomcvil.denominacion <> '' OR estructura.denominacion <> ''
           OR estructuraop.denominacion <> '') AND (public.ltree2text(fila.parent_path) != '')
          ORDER BY fila.parent_path";
                $padres = $conn->fetchAll($rutaSQL);

                if ($padres [0] ['idfila']) {

                    if (!$datos) {

                        $i = 1;
                        foreach ($padres AS $padreValue) {
                            if ($i != 1) {//si no es el primero y es el ultimo

                                if (!$incluyeEstructura && ($i == count($padres))) {
                                    //print_r($padreValue['denominacion']);die;
                                   /* $rutaId .= '/****' ;
                                    $rutaDenom .= '/***';*/
                                } else {
                                    $rutaId .= '/' . $padreValue['idfila'];
                                    $rutaDenom .= '/' . $padreValue['denominacion'];
                                }

                            } else {
                                $rutaId .= $padreValue['idfila'];
                                $rutaDenom .= $padreValue['denominacion'];
                            }
                            $i++;
                        }
                        /*if ($arrayEstructura[0] == 100529774){
                            print_r($rutaId);
                            print_r($rutaDenom);
                            die;
                        }*/
                    } else {

                        foreach ($padres AS $padreValue) {
                            $pos = $this->existenciaEstructura($rutas, $padreValue['idfila']);
                            if (is_bool($pos)) {
                                $rutas[] = $padreValue;
                            }
                        }

                    }

                }
            }
            if (!$datos) {
                $rutas[] = array('rutaDenominacion' => $rutaDenom, 'rutaId' => $rutaId);
            } else {
                $object = $this->dameDatosEstructura($estructura[0]['idfila']);
                $rutas[] = array(
                    denominacion => $object[0][denominacion], idfila => $object[0][idestructura],
                    idnomeav => $object[0][idtipo], idpadre => $object[0][idpadre], icon => $object[0][icon]);
            }
        }


        return $rutas;
    }

    /**
     * @param $arreglo
     * @param $id
     *
     * @return bool|int|string
     */
    function existenciaEstructura($arreglo, $id)
    {
        if (count($arreglo) > 0) {
            foreach ($arreglo AS $index => $value) {
                if ($value[idfila] == $id) {
                    return $index;
                }
            }
        }

        return false;
    }

    /**
     * Descripción del método: Devuelve un arreglo con los datos de la estructura especificada
     *
     * @author    : Ing.Javier Limonta
     * @modified  : Ing.Osvaldo Gonzalez
     *
     * @param      $idEstructura
     * @param bool $idProyecto
     * @param bool $porCodigo
     * @param bool $portalRequest
     *
     * @return array, Retorna un arreglo con los datos de la estructura especificada
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameDatosEstructura($idEstructura, $idProyecto = false, $porCodigo = false, $portalRequest = false)
    {
        $iddominio = $this->perfil->iddominio;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $where
            = "((e.idestado = 0 AND e.idproyecto =0 ) OR  (eo.idestado = 0 AND eo.idproyecto =0) OR (cargo.idestado
         = 0 AND cargo.idproyecto =0))";
        $whereEntidad = "(entidad.idestado = 0)";
        if ($idProyecto) {
            $where
                = "(
          ((e.idproyecto = $idProyecto) OR (e.modificado [$idProyecto]=0 AND e.idestado = 0)) OR
          ((eo.idproyecto = $idProyecto) OR (eo.modificado [$idProyecto]=0 AND eo.idestado = 0)) OR
          ((cargo.idproyecto = $idProyecto) OR (cargo.modificado [$idProyecto]=0 AND cargo.idestado = 0))
        )";
            $whereEntidad
                = "((entidad.idproyecto = $idProyecto) OR (entidad.modificado [$idProyecto]=0 AND e.idestado = 0))";
        }
        $whereCodigo = "(f.idfila = $idEstructura)";
        if ($porCodigo) {
            $whereCodigo .= " OR (e.codigo ILIKE '$idEstructura')";
        }
        $militar
            = "
        SELECT i.icono
        FROM mod_estructuracomp.nom_icono i
        INNER JOIN mod_estructuracomp.nom_concepto c ON (c.idicono = i.idicono)
        WHERE c.idconcepto = 10
      ";
        $query
            = "
      SELECT
           CASE
                  WHEN (
                        SELECT COUNT(idfila)
                        FROM mod_estructuracomp.nom_filaestruc
                        WHERE idpadre = f.idfila AND idpadre <> idfila
                        ) = 0
                  then true else false
                END AS leaf,
            f.idfila AS idestructura,
            f.idfila AS id,f.idfila,
            f.idpadre, f.idconcepto AS idtipo,f.idconcepto AS idconcepto,
            e.idtipoescala AS idtipoescala,
            nomcvil.idnomcargo,
      CASE
          WHEN cargo.idcargo IS NOT NULL THEN cargo.idespecialidadpreparacion
          WHEN eo.idestructuraop IS NOT NULL THEN eo.idespecialidad
          WHEN e.idestructura IS NOT NULL THEN e.idespecialidad else null
      END AS idespecialidad,

      CASE
          WHEN cargo.idcargo IS NOT NULL THEN cargo.idespecialidadempleo
      END AS idespecialidad_empleo,

      CASE
          WHEN cargom.idcargo IS NOT NULL THEN ($militar) else i.icono
      END AS icon,
      nomeav.denominacion AS concepto,
      nomeav.idconcepto AS idconcepto,
     case
									WHEN e.idorgano IS NOT NULL THEN e.idorgano
									WHEN eo.idorgano IS NOT NULL THEN eo.idorgano
										end as idorgano,

      CASE
          WHEN e.idestructura IS NOT NULL THEN e.denominacion
          WHEN eo.idestructuraop IS NOT NULL THEN eo.denominacion
          WHEN nomcvil.idnomcargo IS NOT NULL THEN nomcvil.denominacion
      END AS denominacion,
      CASE
          WHEN e.idestructura IS NOT NULL THEN e.abreviatura
          WHEN eo.idestructuraop IS NOT NULL THEN eo.abreviatura
          WHEN nomcvil.idnomcargo IS NOT NULL THEN nomcvil.abreviatura
      END AS abreviatura,
      e.codigo as codigo,
      e.fax as fax,
      e.correo as correo,
      e.direccion as direccion,
      e.telefono as telefono,
      e.objetosocial as objetivo,
      e.funcioneslegales as funciones,
      CASE
          WHEN e.abreviatura <> '' THEN e.abreviatura
          WHEN eo.abreviatura <> '' THEN eo.abreviatura
          WHEN nomcvil.abreviatura <> '' THEN nomcvil.abreviatura
      END AS abreviatura,
      CASE
          WHEN e.denominacion <> '' THEN oe.denominacion
          WHEN eo.denominacion <> '' THEN oei.denominacion
      END AS organo,
                         case
                          WHEN e.denominacion <> '' THEN oe.denominacion
                          WHEN eo.denominacion <> '' THEN oei.denominacion
                        END AS tipo,
                        case
                          WHEN e.denominacion <> '' THEN oe.idorgano
                          WHEN eo.denominacion <> '' THEN oei.idorgano
                        END AS idorgano,
                         case
                          WHEN e.denominacion <> '' THEN e.codigo
                          WHEN eo.denominacion <> '' THEN eo.codigo
                        END AS codigo,
                        case
                          WHEN e.denominacion <> '' THEN e.denominacion
                          WHEN eo.denominacion <> '' THEN eo.denominacion
                          WHEN nomcvil.denominacion <> '' THEN nomcvil.denominacion
                        END AS text,e.abreviatura,e.direccion,e.fax,e.telefono,
                         CASE
                          WHEN e.idestructura IS NOT NULL THEN e.iddpt
                          else (
                             SELECT entidad.iddpt
                             FROM mod_estructuracomp.nom_filaestruc fe
                             INNER JOIN mod_estructuracomp.dat_estructura entidad ON (fe.idfila = entidad.idestructura)
                            WHERE fe.dominiofila [$iddominio]='1' AND (fe.parent_path operator (public.<@) f.parent_path)  AND (fe.idconcepto = 3 OR fe.idconcepto = 4) AND $whereEntidad
                             ORDER BY fe.parent_path DESC
                             LIMIT 1
                          )
                        END AS iddpt,
                         CASE
                  WHEN e.idicono <> 0 THEN
                  iest.icono else null
                  END AS logo

            FROM mod_estructuracomp.nom_filaestruc f
            INNER JOIN mod_estructuracomp.nom_concepto nomeav ON (f.idconcepto = nomeav.idconcepto)
            INNER JOIN mod_estructuracomp.nom_icono i ON (nomeav.idicono = i.idicono)
            LEFT JOIN mod_estructuracomp.dat_estructura e ON (e.idestructura = f.idfila)
            LEFT JOIN mod_estructuracomp.nom_organo oe ON (e.idorgano = oe.idorgano AND oe.idconcepto = e.idconcepto)
            LEFT JOIN mod_estructuracomp.dat_estructuraop eo ON (eo.idestructuraop = f.idfila)
            LEFT JOIN mod_estructuracomp.nom_icono iest ON iest.idicono = e.idicono
            LEFT JOIN mod_estructuracomp.nom_organo oei ON (eo.idorgano = oei.idorgano AND
                                                            oei.idconcepto = eo.idconcepto)
            LEFT JOIN mod_estructuracomp.dat_cargo cargo ON ( cargo.idcargo = f.idfila )
            LEFT JOIN mod_estructuracomp.dat_cargomilitar cargom ON ( cargo.idcargo = cargom.idcargo )
            LEFT JOIN mod_estructuracomp.nom_cargo nomcvil ON ( cargo.idnomcargo = nomcvil.idnomcargo )
            where f.fechafin IS NULL AND ($whereCodigo) AND $where";
        // die($query);
        $result = $conn->fetchAll($query);
        if (!$portalRequest) {
            foreach ($result AS $index => $datos) {
//                    $dpa              = MetadatosServices::getInstance()->dameRutaDPT($datos['iddpt']);
                $dpa = $this->integrator->datosmaestros->obtenerRutaDPT($datos['iddpt'], true);
//                MetadatosServices::getInstance()->dameRutaDPT($datos['iddpt']);
                $divisionPolitica = array();
                foreach ($dpa AS $value) {
                    $divisionPolitica[$value['concepto']] = $value['denominacion'];
                }
                $result[$index]['dpa'] = $divisionPolitica;
            }
        }

        return $result;
    }

    /**
     * Descripción del método : Obtiene la estructura cuyo codigo es el especificado
     *
     * @author    : Ing.Javier Limonta
     * @modified  : Ing.Osvaldo Gonzalez
     *
     * @param $codigos
     *
     * @return array Retorna un arreglo con los datos de la estructura especificada
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameEstructuraPorCodigo($codigos)
    {
        if (!$codigos) {
            return false;
        }
        if (is_array($codigos)) {
            $whereCodigo = "(";
            foreach ($codigos as $index => $codigo) {
                if ($index < count($codigos) - 1) {
                    $whereCodigo .= " (e.codigo ILIKE ('%$codigo%')) OR ";
                } else {
                    $whereCodigo .= " (e.codigo ILIKE ('%$codigo%')) ";
                }
            }
            $whereCodigo .= ")";
        } else {
            $whereCodigo = "e.codigo ILIKE ('%$codigos%')";
        }
        try {
            $q = Doctrine_Query::create();
            $consulta = $q->select(
                '         e.idestructura AS id,
                                    e.idestructura AS idfila,
                                    e.denominacion AS text,
                                    e.abreviatura AS abrev,
                                    e.idorgano,
                                    e.iddpt,
                                    e.codigo'
            )->from('DatEstructura e')->innerJoin('e.NomFilaestruc f')->where(
                "f.fechafin IS NULL AND e.idconcepto IN (3,4) AND e.idproyecto = 0 AND $whereCodigo"
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

            return $consulta;
        } catch (Doctrine_Exception $ee) {
            if (DEBUG_ERP) {
                echo(__file__ . ' ' . __line__ . ' ' . $ee->getMessage());
            }

            return false;
        }
    }

    /**
     * Descripción del método : Devuelve todas las estructuras pero de manera lineal
     *
     * @author    : Ing.Javier Limonta
     * @modified  : Ing.Osvaldo Gonzalez
     *
     * @param int $limit
     * @param int $start
     *
     * @return array|bool : array Retorna un arreglo con todas las estructuras
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameTodasEstructuras($limit = 10, $start = 0)
    {
        try {
            $q = Doctrine_Query::create();
            $result = $q->from('DatEstructura e')->innerJoin('e.NomFilaestruc f')->where(
                'f.fechafin IS NULL AND e.idestado = 0'
            )->limit($limit)->offset($start)->execute();
            $resultado = $result->toArray();

            return $resultado;
        } catch (Doctrine_Exception $ee) {
            if (DEBUG_ERP) {
                echo(__file__ . ' ' . __line__ . ' ' . $ee->getMessage());
            }

            return false;
        }
    }

    public function dameTodasEstructurasSoap($limit = 10, $start = 0)
    {
        try {
            $q = Doctrine_Query::create();
            $result = $q->select('e.idestructura')->from('DatEstructura e')->innerJoin('e.NomFilaestruc f')->where(
                'f.fechafin IS NULL AND e.idestado = 0'
            )->limit($limit)->offset($start)->execute();
            $resultado = $result->toArray();

            return $resultado;
        } catch (Doctrine_Exception $ee) {
            if (DEBUG_ERP) {
                echo(__file__ . ' ' . __line__ . ' ' . $ee->getMessage());
            }

            return false;
        }
    }

    /**
     * Descripción del método : Buscar todos los hijos de una estructura
     *
     * @author    : Ing.Javier Limonta
     * @modified  : Ing.Osvaldo Gonzalez
     *
     * @param          $idPadre
     * @param bool $organica
     * @param int $marcado
     * @param int $proyecto
     * @param int|bool $incluyeInternos
     * @param int|bool $excluirConceptos
     * @param bool $isServicio
     *
     * @return array : array Retorna un arreglo con todas las estructuras hijas
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameHijosEstructura(
        $idPadre, $organica = false, $marcado = 0,   $proyecto = 0, $incluyeInternos = true,
        $isServicio = false, $excluirConceptos = false, $disponibilidad = false
    )
    {

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        //$whereExcluir = ($excluirConceptos) ? implode(',', $excluirConceptos) : '0';
        $whereExcluir = (($excluirConceptos) && count($excluirConceptos) > 0) ? implode(',', $excluirConceptos) : '0';
        $ponerWhereExcluir = " ";
        if (!empty($whereExcluir)) {
            $ponerWhereExcluir = " fila.idconcepto NOT IN (" . $whereExcluir . ") AND ";
        }
        $sqlQhere = "";
        $sqlOrden = "";

        if ($proyecto != 0) {
            $sqlOrden = 'ORDER BY CASE WHEN ep.orden is null THEN fila.orden ELSE ep.orden END';
        } else {
            $sqlOrden = 'ORDER BY fila.ordenunico';
        }

        $whereDisponibilidad = ($disponibilidad) ? 'AND cargo.cantidad <> cargo.cantidadreal' : '';
        // si se pide el arbol completo de estructuras
        $sqlQhere .= (is_numeric($idPadre) && $idPadre != 0) ? 'fila.idpadre=' . $idPadre . '
         AND fila.idfila<>fila.idpadre' : 'fila.idfila = fila.idpadre';
        list($whereInternosFilaPadre, $sqlQhere, $marcar, $sqlFiltroProyectoCargoMilitar,
            $sqlFiltroProyectoCargoCivil, $sqlFiltroProyectoEstructura, $sqlFiltroProyectoEstructuraSQL,
            $sqlFiltroProyectoEstructuraOP, $sqlFiltroProyectoCargo, $sqlFiltroProyectoEstructuraLeaf,
            $sqlFiltroProyectoEstructuraOPLeaf, $sqlFiltroProyectoCargoLeaf, $sqlFiltroMedioLeaf, $sqlFiltroMedio)
            = $this->construirFiltros($idPadre, $organica, $marcado, $proyecto, $incluyeInternos, $sqlQhere);
        $iddominio = $this->perfil->iddominio;
        $militar
            = "
              SELECT i.icono
              FROM mod_estructuracomp.nom_icono AS i
              INNER JOIN mod_estructuracomp.nom_concepto AS con ON (con.idicono = i.idicono)
              WHERE con.idconcepto = 10
            ";
        $leafSql
            = "
            SELECT COUNT(f.idfila)
            FROM mod_estructuracomp.nom_filaestruc AS f
            LEFT JOIN mod_estructuracomp.dat_estructura e ON
                  ( e.idestructura = f.idfila $sqlFiltroProyectoEstructuraLeaf )
            LEFT JOIN mod_estructuracomp.dat_estructuraop op ON
                  ( op.idestructuraop = f.idfila $sqlFiltroProyectoEstructuraOPLeaf)
			LEFT JOIN mod_estructuracomp.dat_medio m ON
			      ( m.idmedio = f.idfila $sqlFiltroMedioLeaf)
			LEFT JOIN mod_estructuracomp.dat_cargo ca ON
			      ( ca.idcargo = f.idfila $sqlFiltroProyectoCargoLeaf)
			WHERE ( e.idestructura IS NOT NULL OR op.idestructuraop IS NOT NULL OR
                    ca.idcargo IS NOT NULL OR m.idmedio IS NOT NULL
			) AND f.idpadre = fila.idfila AND f.idpadre <> f.idfila $whereInternosFilaPadre AND f.fechafin IS NULL

            ";
        $sqlBus
            = "
        SELECT ' ' AS qtip, fila.idfila AS id,fila.idpadre AS _parent,fila.parent_path, fila.idconcepto, $marcar
                CASE WHEN ep.orden is null THEN fila.orden ELSE ep.orden END as orden,(($leafSql)=0) AS leaf,

                CASE
									WHEN estructura.denominacion <> '' THEN estructura.abreviatura
									WHEN estructuraop.denominacion <> '' THEN estructuraop.abreviatura
                                  WHEN nomcvil.denominacion <> '' THEN nomcvil.abreviatura
                                  WHEN nommedio.denominacion <> '' THEN nommedio.denominacion
								END AS abreviatura,estructura.alias,

								CASE
									WHEN estructura.idestructura IS NOT NULL THEN estructura.iddpt
									else (
									   SELECT e.iddpt
									   FROM mod_estructuracomp.nom_filaestruc fe
									   INNER JOIN mod_estructuracomp.dat_estructura e ON (fe.idfila = e.idestructura)
									   WHERE fe.dominiofila [$iddominio]='1'
									          AND (fe.parent_path operator (public.@>) fila.parent_path)
									          AND fe.idconcepto = 3 $sqlFiltroProyectoEstructuraSQL
									   ORDER BY fe.parent_path DESC
									   LIMIT 1
									)
							  END AS iddpt,

								CASE
									WHEN estructura.idestructura IS NOT NULL THEN estructura.idproyecto
									WHEN estructuraop.idestructuraop IS NOT NULL THEN estructuraop.idproyecto
									WHEN cargo.idcargo IS NOT NULL THEN cargo.idproyecto
									WHEN medio.idmedio IS NOT NULL THEN medio.idproyecto
								END AS idproyecto,

case
									WHEN estructura.idorgano IS NOT NULL THEN estructura.idorgano
									WHEN estructuraop.idorgano IS NOT NULL THEN estructuraop.idorgano
										end as idorgano,

								CASE
									WHEN cargom.idcargo IS NOT NULL THEN 1 ELSE 0
								END AS esMilitar,

								CASE
									WHEN cargom.idcargo IS NOT NULL THEN 'Cargo militar' ELSE
									 nomeav.denominacion
								END AS tipo_concepto,
								CASE
									WHEN cargom.idcargo IS NOT NULL THEN 'Cargo militar' ELSE
									 nomeav.denominacion
								END AS nombretipo,

								CASE
									WHEN estructura.denominacion <> '' THEN estructura.idestado
									WHEN estructuraop.denominacion <> '' THEN estructuraop.idestado
                                    WHEN nomcvil.denominacion <> '' THEN cargo.idestado
                                    WHEN nommedio.denominacion <> '' THEN medio.idestado
								END AS estado,

								estructura.codigo,estructura.telefono,estructura.correo,estructura.fax,estructura.direccion,
								CASE
								  WHEN estructuraop.denominacion <> '' THEN true else false
								END AS interna,

								CASE
									WHEN nomcvil.denominacion <> '' THEN nomcvil.denominacion
									WHEN estructura.denominacion <> '' THEN estructura.denominacion
									WHEN estructuraop.denominacion <> '' THEN estructuraop.denominacion
									WHEN nommedio.denominacion <> '' THEN nommedio.denominacion
								END AS text,

								CASE
									WHEN estructuraop.idespecialidad <>  null THEN especialidad.denespecialidad
									WHEN estructura.idespecialidad <>  null THEN especialidad.denespecialidad
								END AS especialidad,

 										 cargo.idespecialidadempleo as idespecialidadempleo,
 										cargo.idespecialidadpreparacion as idespecialidadpreparacion,

								CASE
									WHEN nomcvil.denominacion <> '' THEN nomcvil.denominacion
									WHEN estructura.denominacion <> '' THEN estructura.denominacion
									WHEN estructuraop.denominacion <> '' THEN estructuraop.denominacion
									WHEN nommedio.denominacion <> '' THEN nommedio.denominacion
								END AS denominacion,

								CASE
									WHEN estructura.denominacion <> '' THEN estructura.idtipoescala
								END AS idtipoescala,

								CASE
									WHEN estructura.denominacion <> '' THEN te.denominacion
								END AS tipoescala,

								CASE
									WHEN nomcvil.denominacion <> '' THEN cargo.cantidad
									WHEN nommedio.denominacion <> '' THEN medio.cantidad
								END AS cantidad,

								CASE
									WHEN nomcvil.denominacion <> '' THEN cargo.cantidadreal
									WHEN nommedio.denominacion <> '' THEN medio.cantidadreal
								END AS cantidad_real,

								CASE
									WHEN estructura.codigo <> '' THEN estructura.codigo else ''
								END AS codigo,

								CASE
									WHEN nommedio.denominacion <> '' THEN nomtipomedio.idtipomedio
								END AS idtipomedio,

                CASE
                  WHEN cargom.idcargo IS NOT NULL THEN
                    ($militar)
                  WHEN medio.idicono IS NOT NULL AND medio.idicono <> 0 THEN
                    im.icono
                  else
                    i.icono
                END AS icon,cargo.principal,cargo.jefebrigada,
                CASE
                  WHEN cargom.idcargo IS NOT NULL THEN grado.denominacion ELSE ocup.denominacion
                END AS categoria,
                CASE
                  WHEN cargom.idcargo IS NOT NULL THEN
                    ($militar)
                  WHEN medio.idicono IS NOT NULL AND medio.idicono <> 0 THEN
                    im.icono
                  else
                    i.icono
                END AS iconoorganigrama, fcr.idreferencia AS referencia, fcp.idfila AS referenciado,
                  CASE
                  WHEN estructura.idicono <> 0 THEN
                  iest.icono else null
                  END AS logo,cargo.temporal,cargo.directo

							FROM mod_estructuracomp.nom_filaestruc fila
							INNER JOIN mod_estructuracomp.nom_concepto nomeav
							    ON fila.idconcepto = nomeav.idconcepto
              INNER JOIN mod_estructuracomp.nom_icono i
                  ON i.idicono = nomeav.idicono
              LEFT JOIN mod_estructuracomp.dat_filacortada fcr
                  ON fcr.idfila = fila.idfila
              LEFT JOIN mod_estructuracomp.dat_filacortada fcp
                  ON fcp.idreferencia = fila.idfila
              LEFT JOIN mod_estructuracomp.dat_estructura estructura
                  ON ( estructura.idestructura = fila.idfila $sqlFiltroProyectoEstructura )
               LEFT JOIN mod_estructuracomp.nom_icono iest
                  ON iest.idicono = estructura.idicono
              LEFT JOIN mod_estructuracomp.nom_tipoescala te
                  ON ( estructura.idtipoescala = te.idtipoescala)
              LEFT JOIN mod_estructuracomp.nom_organo orgest
                  ON ( orgest.idorgano = estructura.idorgano AND orgest.idconcepto = fila.idconcepto  )
              LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop
                  ON ( estructuraop.idestructuraop = fila.idfila $sqlFiltroProyectoEstructuraOP)
							LEFT JOIN mod_estructuracomp.nom_organo orgestop
							    ON ( orgestop.idorgano = estructuraop.idorgano AND
							          orgestop.idconcepto = fila.idconcepto  )
              LEFT JOIN mod_estructuracomp.dat_medio medio ON ( medio.idmedio = fila.idfila $sqlFiltroMedio)
							LEFT JOIN mod_estructuracomp.nom_icono im
							    ON im.idicono = medio.idicono
							LEFT JOIN mod_estructuracomp.nom_tipomedio nomtipomedio
							    ON ( nomtipomedio.idtipomedio = medio.idtipomedio )
							LEFT JOIN mod_datosmaestros.nom_indicador nommedio
							    ON ( nommedio.idindicador = medio.idnommedio )
              LEFT JOIN mod_estructuracomp.dat_cargo cargo
                  ON ( cargo.idcargo = fila.idfila $sqlFiltroProyectoCargo $whereDisponibilidad)
							LEFT JOIN mod_estructuracomp.dat_cargocivil cargociv
							    ON (cargo.idcargo = cargociv.idcargo AND
							        cargo.idproyecto = cargociv.idproyecto $sqlFiltroProyectoCargoCivil)
							LEFT JOIN mod_estructuracomp.nom_categocup ocup on (ocup.idcategocup = cargociv.idcategocup)
							LEFT JOIN mod_estructuracomp.dat_cargomilitar cargom
							    ON (cargo.idcargo = cargom.idcargo AND
							        cargo.idproyecto = cargom.idproyecto $sqlFiltroProyectoCargoMilitar)
							LEFT JOIN mod_estructuracomp.nom_grado grado on (grado.idgrado = cargom.idgrado)
							LEFT JOIN mod_datosmaestros.nom_especialidad especialidad on (especialidad.idespecialidad= estructura.idespecialidad OR especialidad.idespecialidad= estructuraop.idespecialidad)
							LEFT JOIN mod_estructuracomp.nom_cargo nomcvil
							    ON ( cargo.idnomcargo = nomcvil.idnomcargo )
							    LEFT JOIN mod_estructuracomp.dat_elementoproyecto ep ON(ep.idfila=fila.idfila AND ep.idproyecto=$proyecto)
							where fila.fechafin IS NULL AND $ponerWhereExcluir
							(estructura.denominacion <> '' OR estructuraop.denominacion <> ''
							           OR nomcvil.denominacion <> '' OR nommedio.denominacion <> '') AND
							$sqlQhere

							AND fila.dominiofila[$iddominio] = 1 :: bit 
							$sqlOrden";

        //Util::msg($sqlBus);
        $arregloPermiso = $conn->fetchAll($sqlBus);
        /* if (!$isServicio) {
           foreach ($arregloPermiso AS $index => $datos) {
             $dpa              = MetadatosServices::getInstance()->dameRutaDPT($datos['iddpt']);
             $divisionPolitica = array();
             foreach ($dpa AS $value) {
               $divisionPolitica[0] = $value['denominacion'];
             }
             $arregloPermiso[$index]['dpa'] = $divisionPolitica;
           }
         }*/

        return $arregloPermiso;
    }

    /**
     *
     */
    public function dameHijosEstructuraArea($idPadre)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $iddominio = $this->perfil->iddominio;
        $sqlQhere = "";
        // si se pide el arbol completo de estructuras
        $sqlTrueCondition = "fila.idpadre = $idPadre AND fila.idfila <> fila.idpadre";
        $sqlFalseCondition = 'fila.idfila = fila.idpadre AND (fila.idconcepto = 3 OR fila.idconcepto = 4)';
        $sqlQhere .= ($idPadre) ? $sqlTrueCondition : $sqlFalseCondition;
        $leafSql
            = "
              SELECT COUNT(f.idfila)
              FROM mod_estructuracomp.nom_filaestruc AS f
              LEFT JOIN mod_estructuracomp.dat_estructura e ON ( e.idestructura = f.idfila AND e.idestado = 0 )
              LEFT JOIN mod_estructuracomp.dat_estructuraop op ON ( op.idestructuraop = f.idfila AND op.idestado = 0)
							WHERE f.fechafin IS NULL AND ( e.idestructura IS NOT NULL OR
							        op.idestructuraop IS NOT NULL
							      )
							      AND f.idpadre = fila.idfila
							      AND f.idpadre <> f.idfila
							      AND (f.idconcepto IN (3,4))

            ";
        $sqlBus
            = "
        SELECT ' ' AS qtip,
                fila.idfila AS id,fila.idpadre AS _parent, fila.idconcepto,
                fila.orden,
								fila.parent_path,
								(($leafSql)=0) AS leaf,

                CASE
									WHEN estructura.denominacion <> '' THEN estructura.abreviatura
									WHEN estructuraop.denominacion <> '' THEN estructuraop.abreviatura
								END AS abreviatura,

								CASE
									WHEN estructura.idestructura IS NOT NULL THEN estructura.iddpt
									else (
									   SELECT e.iddpt
									   FROM mod_estructuracomp.nom_filaestruc fe
									   INNER JOIN mod_estructuracomp.dat_estructura e ON (fe.idfila = e.idestructura)
									   WHERE fe.dominiofila [$iddominio]='1'
									          AND (fe.parent_path operator (public.@>) fila.parent_path)
									          AND fe.idconcepto = 3 AND e.idestado = 0
									   ORDER BY fe.parent_path DESC
									   LIMIT 1
									)
							  END AS iddpt,

                nomeav.denominacion as tipo_concepto,

								CASE
									WHEN estructura.denominacion <> '' THEN estructura.idestado
									WHEN estructuraop.denominacion <> '' THEN estructuraop.idestado
								END AS estado,

								estructura.codigo as codigo,
                estructura.fax as fax,
                estructura.correo as correo,
                estructura.direccion as direccion,
                estructura.telefono as telefono,
                estructura.objetosocial as objetivo,
                estructura.funcioneslegales as funciones,

								CASE
								  WHEN estructuraop.denominacion <> '' THEN true else false
								END AS interna,

								CASE
									WHEN estructura.denominacion <> '' THEN estructura.denominacion
									WHEN estructuraop.denominacion <> '' THEN estructuraop.denominacion
								END AS text,

								CASE
									WHEN estructura.denominacion <> '' THEN estructura.denominacion
									WHEN estructuraop.denominacion <> '' THEN estructuraop.denominacion
								END AS denominacion,

								CASE
									WHEN estructura.denominacion <> '' THEN estructura.idtipoescala
								END AS idtipoescala,

								CASE
									WHEN estructura.denominacion <> '' THEN te.denominacion
								END AS tipoescala,

								CASE
									WHEN estructura.codigo <> '' THEN estructura.codigo else ''
								END AS codigo,

               i.icono as icon,
               i.icono as iconoorganigrama

							FROM mod_estructuracomp.nom_filaestruc fila
							INNER JOIN mod_estructuracomp.nom_concepto nomeav ON fila.idconcepto = nomeav.idconcepto
              INNER JOIN mod_estructuracomp.nom_icono i ON i.idicono = nomeav.idicono
              LEFT JOIN mod_estructuracomp.dat_estructura estructura ON
                        ( estructura.idestructura = fila.idfila AND estructura.idestado = 0 )
              LEFT JOIN mod_estructuracomp.nom_tipoescala te ON ( estructura.idtipoescala = te.idtipoescala)
              LEFT JOIN mod_estructuracomp.nom_organo orgest ON
                        ( orgest.idorgano = estructura.idorgano AND orgest.idconcepto = fila.idconcepto  )
              LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop ON
                        ( estructuraop.idestructuraop = fila.idfila AND estructuraop.idestado = 0)
			  LEFT JOIN mod_estructuracomp.nom_organo orgestop ON
			            ( orgestop.idorgano = estructuraop.idorgano AND orgestop.idconcepto = fila.idconcepto  )
              WHERE fila.fechafin IS NULL AND (estructura.denominacion <> '' OR
             	        estructuraop.denominacion <> '') AND $sqlQhere
							AND fila.dominiofila[$iddominio] = 1 :: bit
							ORDER BY fila.ordenunico";
        $arregloPermiso = $conn->fetchAll($sqlBus);

        return $arregloPermiso;
    }

    /**
     * Descripción del método : Inserta una nueva estructura
     *
     * @author    : Ing. Javier Limonta
     * @modified  : Ing. Yoandry Borges
     *
     * @param $idfila
     * @param $idConcepto
     * @param $datos
     * @param $proyecto
     * @param $modificado
     *
     * @return bool
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertarEstructura($idfila, $idConcepto, $datos, $proyecto, $modificado = false)
    {
        $this->Instancia();
        $this->instance = new DatEstructura();
        $this->instance->idestructura = $idfila;
        $this->instance->idtipoescala = $datos['idtipoescala'];
        $this->instance->idconcepto = $idConcepto;
        $this->instance->idespecialidad = $datos['idespecialidad'];
        $this->instance->idorgano = $datos['idOrgano'];
        $this->instance->denominacion = ucfirst($datos['denominacion']);
        $this->instance->abreviatura = ucfirst($datos['abreviatura']);
        $this->instance->codigo = $datos['codigo'];
        $this->instance->idicono = $datos['icono'];
        $this->instance->alias = $datos['alias'];
        $this->instance->fax = $datos['fax'];
        $this->instance->telefono = $datos['telefono'];
        $this->instance->iddpt = $datos['idDpt'];
        $this->instance->direccion = ucfirst($datos['direccion']);
        $this->instance->correo = $datos['correo'];
        $this->instance->codigonit = $datos['codigonit'];
        $this->instance->objetosocial = ucfirst($datos['objetosocial']);
        $this->instance->funcioneslegales = ucfirst($datos['funcioneslegales']);
        $this->instance->idproyecto = $proyecto;
        $this->instance->idestado = ($proyecto != 0) ? ($modificado) ? 2 : 1 : 0;
        $this->instance->codigonirc = ($datos['codigonirc'])?$datos['codigonirc']:null;
        $this->instance->save();
//die('a');
        return true;
    }

    /**
     * Descripción del método : Borrar la instancia vieja que poseia el modelo
     *
     * @copyright Copyright (c) 2013 xetid
     */
    public function Instancia()
    {
        $this->instance = null;
        $this->instance = new DatEstructura();
    }

    /**
     * Descripción del método : Modifica una estructura especificada
     *
     * @author    : Ing. Javier Limonta
     * @modified  : Ing. Daymel Machado
     * @modified  : Ing. Yoandry Borges
     *
     * @param $idNodo
     * @param $idConcepto
     * @param $datos
     * @param $proyecto
     *
     * @return bool
     * @copyright Copyright (c) 2013 xetid
     */
    public function modificarEstructura($idNodo, $idConcepto, $datos, $proyecto)
    {
        $this->instance = Doctrine::getTable('DatEstructura')->findByDql(
            "idestructura = $idNodo AND idproyecto = $proyecto"
        )->getFirst();
        if (is_object($this->instance)) { // verificar si se encontro el objeti sino lanzar exepcion
            $this->instance->idconcepto = $idConcepto;
            $this->instance->idtipoescala = $datos['idtipoescala'];
            $this->instance->idespecialidad = $datos['idespecialidad'];
            $this->instance->idorgano = $datos['idOrgano'];
            $this->instance->denominacion = ucfirst($datos['denominacion']);
            $this->instance->abreviatura = $datos['abreviatura'];
            $this->instance->idicono = $datos['icono'];
            $this->instance->codigo = $datos['codigo'];
            $this->instance->fax = $datos['fax'];
            $this->instance->alias = $datos['alias'];
            $this->instance->telefono = $datos['telefono'];
            $this->instance->iddpt = $datos['idDpt'];
            $this->instance->direccion = ucfirst($datos['direccion']);
            $this->instance->correo = $datos['correo'];
            $this->instance->idsector = $datos['idsector'];
            $this->instance->codigonit = $datos['codigonit'];
            $this->instance->codigonirc = ($datos['codigonirc'])?$datos['codigonirc']:null;
            $this->instance->objetosocial = ucfirst($datos['objetosocial']);
            $this->instance->funcioneslegales = ucfirst($datos['funcioneslegales']);
            $this->instance->save();

            return true;
        } else {
            return $this->insertarEstructura($idNodo, $idConcepto, $datos, $proyecto, true);
        }
    }

    /**
     * Descripción del método : Devuelve si existe la estructura especificada
     *
     * @author    : Ing. Javier Limonta
     * @modified  : Ing. Yoandry Borges
     *
     * @param $idEstructura
     *
     * @return bool
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameEstructuraPorId($idEstructura)
    {
        if (!is_numeric($idEstructura) && !is_array($idEstructura)) {
            return false;
        }
        $where = "e.idestructura ='$idEstructura'";
        if (is_array($idEstructura)) {
            $where = "e.idestructura IN (" . implode(',', $idEstructura) . ")";
        }
        try {
            $q = Doctrine_Query::create();
            $consulta = $q->select('e.*,o.denominacion,o.abreviatura')->from('DatEstructura e')->innerJoin(
                'e.NomFilaestruc f'
            )->innerJoin(
                'e.NomOrgano o'
            )->where('f.fechafin IS NULL AND ' . $where)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

            return $consulta;
        } catch (Doctrine_Exception $ee) {
            if (DEBUG_ERP) {
                echo(__file__ . ' ' . __line__ . ' ' . $ee->getMessage());
            }

            return false;
        }
    }

    /**
     * Descripción del método : Devuelve los hijos de la estructura interna seleccionada
     *
     * @author    : Ing.Javier Limonta
     * @modified  : Ing.Daymel Machado
     *
     * @param      $idEstructura
     * @param bool $oi
     *
     * @return array : Retorna un arreglo cpn los hijos de la estructura interna seleccionada
     * @copyright Copyright (c) 2013 xetid
     */
    function dameEstructurasInternas($idEstructura, $oi = false)
    {
        $where = ($oi) ? "fila.idconcepto = 5" : "1 = 1";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlBuscarInternas
            = "
              SELECT fila.idfila AS id,estructuraop.denominacion AS text
              FROM

              mod_estructuracomp.nom_filaestruc      padre,
              mod_estructuracomp.nom_filaestruc      fila INNER JOIN
              mod_estructuracomp.nom_concepto eav ON (fila.idconcepto = eav.idconcepto) INNER JOIN
              mod_estructuracomp.dat_estructuraop estructuraop
                  ON (fila.idfila = estructuraop.idestructuraop and estructuraop.idproyecto = 0)
              WHERE
              fila.parent_path operator (public.<@) padre.parent_path AND 
              padre.idfila = $idEstructura AND $where
              ORDER BY fila.ordenunico";
        $result = $conn->fetchAll($sqlBuscarInternas);

        return $result;
    }

    /**
     * Descripción del método : Verifica si la estructura contiene elementos hijos
     * distintos de cargos y estructuras no formales
     *
     * @author    : Ing.Javier Limonta
     * @modified  : Ing.Daymel Machado
     *
     * @param $idEstructura
     *
     * @return bool
     * @copyright Copyright (c) 2013 xetid
     */
    function existeEstructuraInterna($idEstructura)
    {
        $iddominio = $this->perfil->iddominio;
        $object = Doctrine::getTable('NomFilaestruc')->find($idEstructura);
        if (is_object($object)) {
            $parent_path = $object->parent_path;
            $query
                = "SELECT count(f.idfila) FROM mod_estructuracomp.nom_filaestruc f
            INNER JOIN mod_estructuracomp.dat_estructuraop o ON (f.idfila = o.idestructuraop)
            where (f.parent_path operator (public.<@) '$parent_path') and f.idconcepto not in (7,8)
                      and f.dominiofila[$iddominio] = 1::bit and fechafin is null";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $resultado = $conn->fetchAll($query);

            return ($resultado[0]['count'] > 0) ? true : false;
        }

        return false;
    }

    /**
     * Descripción del método : Verifica que existan estructuras internas dado un identificador
     *
     * @author    : Ing. Javier Limonta
     * @modified  : Ing. Yoandry Borges
     *
     * @param $idEstructura
     *
     * @return bool, Retorna true en caso de que existan estructuras internas
     * @copyright Copyright (c) 2013 xetid
     */
    function verificarHojaArea($idEstructura)
    {
        $iddominio = $this->perfil->iddominio;
        $query
            = "SELECT count(f.idfila) FROM mod_estructuracomp.nom_filaestruc f
            INNER JOIN mod_estructuracomp.dat_estructuraop o ON (f.idfila = o.idestructuraop)
            where f.idpadre = $idEstructura and f.idconcepto not in (2,7,8)
               and f.dominiofila[$iddominio] = 1::bit and fechafin is null";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->fetchAll($query);

        return ($resultado[0]['count'] > 0) ? false : true;
    }

    /**
     * Descripción del método : Retorna un arreglo de estructuras
     *
     * @author    : Ing.Javier Limonta
     * @modified  : Ing.Daymel Machado
     *
     * @param $idestructura
     *
     * @return array : array
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameEstructurasinChecked($idestructura)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if ($idestructura == 0) {
            $sqlwhere = 'e.idestructura = f.idpadre';
        } else {
            $sqlwhere = "f.idpadre = $idestructura AND e.idestructura <> f.idpadre";
        }
        $sql
            = "SELECT e.idestructura AS id, e.denominacion AS text, CASE
                  WHEN (
                        SELECT COUNT(idfila)
                        FROM mod_estructuracomp.nom_filaestruc
                        WHERE idpadre = f.idfila AND idpadre <> idfila
                        ) = 0
                  then true else false
                END AS leaf,
   FROM nom_filaestruc f
			INNER JOIN dat_estructura e ON (e.idestructura = f.idfila)
			WHERE ($sqlwhere)";
        $consulta = $conn->fetchAll($sql);

        return $consulta;
    }

    /**
     * Descripción del método : Retorna un arreglo con las entidades que pertenecen a una estructura especificada
     *
     * @author    : Ing. Yadir Martinez Vergara
     * @modified  : Ing.Osvaldo M. Gonzalez
     *
     * @param $idestructura
     * @param $idproyecto
     *
     * @return array : Arreglo de entidades
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameEntidadesDeEstructura($idestructura, $idproyecto = false)
    {
        $where = "nfe.idfila = {$idestructura}";
        $select = "nfe.parent_path";
        if (is_array($idestructura)) {
            $where = "nfe.idfila IN (" . implode(',', $idestructura) . ")";
//            $select = "MAX(nfe.rgt) AS rgt";
        }
        $iddominio = $this->perfil->iddominio;
        $query = Doctrine_Query::create();
        $r = $query->select($select)->from('NomFilaestruc nfe ')->where('nfe.fechafin IS NULL AND ' . $where)
            ->setHydrationMode(
                Doctrine::HYDRATE_ARRAY
            )->execute();
        if (count($r) > 0) {
            $parent_path = $r[0]['parent_path'];
            $whereWith = '1=1';
            if (is_numeric($idproyecto)) {
                $whereWith
                    = "((de.idproyecto = $idproyecto AND de.idestado <> 3) " .
                    "OR (de.idproyecto=0 AND de.modificado [$idproyecto]=0))";
            }
            $resultado = $query->select(
                "nfe.idfila,
                               de.idestructura AS idestructura,
                               de.denominacion AS denominacion,
                               de.codigo AS codigo"
            )->from('NomFilaestruc nfe')->innerJoin('nfe.DatEstructura de')->where(
                "nfe.fechafin IS NULL AND nfe.parent_path operator (public.<@) '$parent_path'"
            )->andWhere("nfe.idconcepto = 3 OR nfe.idconcepto = 4")->andWhere(
                "nfe.dominiofila [$iddominio] = '1'"
            )->andWhere($whereWith)->execute();

            return $resultado;
        } else {
            return array();
        }
    }

    /**
     * Descripción del método :Retorna un arreglo con los id de los cargos que se encuentren dentro de una
     * estructura especificada
     *
     * @author    : Ing. Yadir Martinez Vergara
     * @modified  : Ing.Osvaldo M. Gonzalez
     *
     * @param $idEstructura
     * @param $idProyecto
     *
     * @return array : Arreglo de identificadores de cargos
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameCargosPorEstructura($idEstructura, $idProyecto = false)
    {
        $iddominio = $this->perfil->iddominio;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = Doctrine_Query::create();
        $r = $query->select('nfe.parent_path')->from('NomFilaestruc nfe ')->where(
            "nfe.idfila = {$idEstructura}"
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        if (count($r) > 0) {
            $parent_path = $r[0]['parent_path'];
            $whereWith = '1=1';
            if (is_numeric($idProyecto)) {
                $whereWith
                    = "((cargo.idproyecto = 0 AND cargo.modificado [$idProyecto]=0) " .
                    "OR (cargo.idproyecto = $idProyecto AND cargo.idestado<>0 AND cargo.idestado<>3))";
            }
            $whereWith .= (is_numeric($idProyecto)) ? 'AND cargo.temporal = 0' : '';
            $sql
                = "
                  SELECT cargo.idcargo, cargo.idsalario, salario.salario
                  FROM mod_estructuracomp.nom_filaestruc nfe
						     INNER JOIN mod_estructuracomp.dat_cargo cargo ON (cargo.idcargo = nfe.idfila)
						     INNER JOIN mod_estructuracomp.nom_salario salario ON (cargo.idsalario = salario.idsalario)
						     WHERE nfe.fechafin IS NULL AND nfe.idfila = $idEstructura OR (nfe.parent_path operator (public.<@) '$parent_path')
						                       AND nfe.dominiofila [$iddominio] = 1::bit AND $whereWith";
            $resultado = $conn->fetchAll($sql);

            return $resultado;
        } else {
            return array();
        }
    }

    /**
     * Descripción: Retorna un arreglo con los id de los medios que se encuentren dentro de una estructura especificada
     *
     * @author    : Ing.Osvaldo M. Gonzalez
     *
     * @param $idEstructura
     * @param $idProyecto
     *
     * @return array : Arreglo de identificadores de medios
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameMediosPorEstructura($idEstructura, $idProyecto = false)
    {
        $iddominio = $this->perfil->iddominio;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = Doctrine_Query::create($conn);
        $r = $query->select('nfe.parent_path')->from('NomFilaestruc nfe ')->where(
            "nfe.idfila = {$idEstructura}"
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        if (count($r) > 0) {
            $parent_path = $r[0]['parent_path'];
            $whereWith = '1=1';
            if (is_numeric($idProyecto)) {
                $whereWith
                    = "((medio.idproyecto = 0 AND medio.modificado [$idProyecto]=0) " .
                    "OR (medio.idproyecto = $idProyecto AND medio.idestado<>0 AND medio.idestado<>3))";
            }
            $sql
                = "
                      SELECT medio.idmedio
                      FROM mod_estructuracomp.nom_filaestruc nfe
						          INNER JOIN mod_estructuracomp.dat_medio medio ON (medio.idmedio = nfe.idfila)
						          WHERE nfe.fechafin IS NULL AND nfe.idfila = {$idEstructura} OR (nfe.parent_path operator (public.<@) '$parent_path')
						                                             AND nfe.dominiofila[$iddominio] = '1' AND $whereWith";
            $resultado = $conn->fetchAll($sql);

            return $resultado;
        } else {
            return array();
        }
    }

    /**
     * Descripción del método : Retorna un arreglo con la entidad padre de un cargo especificado
     *
     * @author    : Ing. Yadir Martinez Vergara
     * @modified  : Ing.Osvaldo M. Gonzalez
     *
     * @param $idCargo
     *
     * @return array : Arreglo con los datos de la entidad
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameEntidadPorCargo($idCargo)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = Doctrine_Query::create();
        $r = $query->select('nfe.parent_path')->from('NomFilaestruc nfe ')->where("nfe.idfila = {$idCargo}")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
        if (count($r) > 0) {
            $parent_path = $r[0]['parent_path'];
            $sql
                = "SELECT de.idestructura, de.denominacion
            FROM mod_estructuracomp.nom_filaestruc nfe
            INNER JOIN mod_estructuracomp.dat_estructura de ON (de.idestructura = nfe.idfila)
		    WHERE nfe.fechafin IS NULL AND (nfe.parent_path operator (public.@>) '$parent_path') AND nfe.idconcepto in (3, 4)
			ORDER BY nfe.parent_path desc";
            $resultado = $conn->fetchAll($sql);
            if (count($resultado) > 0) {
                return $resultado;
            }
        }

        return array();
    }

    /**
     * Descripción del método :Retorna un arreglo con los datos del organismo (organo principal)
     * al que pertenece o la ruta a para llegar a la misma
     *
     * @author    : Ing. Yadir Martinez Vergara
     * @modified  : Ing.Osvaldo M. Gonzalez
     *
     * @param      $idEstructura
     * @param bool $ruta
     *
     * @return array : Arreglo con los datos de la entidad
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameOrganismoRutaPorIdEstructura($idEstructura, $ruta = false)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = Doctrine_Query::create();
        $r = $query->select('nfe.parent_path')->from('NomFilaestruc nfe ')->where(
            "nfe.idfila = {$idEstructura}"
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        if (count($r) > 0) {
            $parent_path = $r[0]['parent_path'];
            $sql
                = "SELECT de.idestructura, de.denominacion
            FROM mod_estructuracomp.nom_filaestruc nfe
						      INNER JOIN mod_estructuracomp.dat_estructura de ON (de.idestructura = nfe.idfila)
						      WHERE nfe.fechafin IS NULL AND nfe.idfila = {$idEstructura} OR (nfe.parent_path operator (public.<@) '$parent_path')
						      ORDER BY nfe.parent_path";
            $resultado = $conn->fetchAll($sql);
            if (count($resultado) > 0) {
                if ($ruta) {
                    return $resultado;
                } else {
                    return $resultado[0];
                }
            }
        }

        return array();
    }

    /**
     * Descripción del método : FUNCION QUE DEVUELVE LOS DATOS DEL CARGO DADO SU ID
     *
     * @author    : Ing. Yadir Martinez Vergara
     * @modified  : Ing. Yoandry Borges
     *
     * @param $idcargo
     *
     * @return mixed, Retorna el cargo encontrado
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameCargo($idcargo)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql
            = "select dc.idcargo,
			CASE WHEN dcm.idcargo IS NOT NULL THEN ncm.dencargomilitar
			     WHEN dcc.idcargo IS NOT NULL THEN ncc.dencargociv
			END AS cargo,
			dc.ctp, dc.ctg,
			CASE WHEN dcm.idcargo IS NOT NULL THEN 'M'
			     WHEN dcc.idcargo IS NOT NULL THEN 'C'
			END AS idtipocargo,
			CASE WHEN dcm.idcargo IS NOT NULL THEN 'Cargo militar'
			     WHEN dcc.idcargo IS NOT NULL THEN 'Cargo civil'
			END AS tipo,
			CASE WHEN dcm.idcargo IS NOT NULL THEN dcm.salario
			     WHEN dcc.idcargo IS NOT NULL THEN ns.salario
			END AS salario, ne.denespecialidad AS especialidad,
			CASE WHEN dcm.idcargo IS NOT NULL THEN ngm.dengradomilit
			     WHEN dcc.idcargo IS NOT NULL THEN 'Ninguno'
			END AS grado,
			CASE WHEN dcm.idcargo IS NOT NULL THEN npm.denprepmilitar
			     WHEN dcc.idcargo IS NOT NULL THEN 'Ninguna'
			END AS preparacion,
			CASE WHEN dcm.idcargo IS NOT NULL THEN 'Militar'
			     WHEN dcc.idcargo IS NOT NULL THEN ncatciv.dencategcivil
			END AS categoriacivil
			FROM mod_estructuracomp.dat_cargo dc
			INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON (nfe.idfila = dc.idcargo)
			LEFT JOIN mod_estructuracomp.dat_cargocivil dcc ON (dcc.idcargo = dc.idcargo)
			LEFT JOIN mod_estructuracomp.dat_cargomtar dcm ON (dcm.idcargo = dc.idcargo)
			LEFT JOIN mod_estructuracomp.nom_cargocivil ncc ON (ncc.idcargociv = dcc.idcargociv)
			LEFT JOIN mod_estructuracomp.nom_cargomilitar ncm ON (ncm.idcargomilitar = dcm.idcargomilitar)
			LEFT JOIN mod_estructuracomp.nom_salario ns ON (ns.idsalario = dcc.idsalario)
			LEFT JOIN mod_nomencladores.nom_especialidad ne ON (ne.idespecialidad = dc.idespecialidad)
			LEFT JOIN mod_estructuracomp.nom_gradomilit ngm ON (ngm.idgradomilit = dcm.idgradomilit)
			LEFT JOIN mod_estructuracomp.nom_prepmilitar npm ON (npm.idprepmilitar = dcm.idprepmilitar)
			LEFT JOIN mod_estructuracomp.nom_categcivil ncatciv ON (ncatciv.idcategcivil = dcc.idcategcivil)
			where nfe.fechafin IS NULL AND dc.idcargo = {$idcargo} AND dc.idestado = 0";
        $resultado = $conn->fetchAll($sql);

        return $resultado;
    }

    /**
     * Descripción del método : Busca los datos de los cargos especificados por el arreglo de ids
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $arrIdCargos
     *
     * @return array: Arreglo con los datos de los cargos
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameCargosPorArregloIds($arrIdCargos)
    {
        $cargo = new DatCargoModel();

        return $cargo->obtenerDatosCargo($arrIdCargos);
    }

    /**
     * Descripción del método : Busca los datos de las estructuras especificadas
     *
     * @author    : Ing. Yadir Martinez Vergara
     * @modified  : Ing. Yoandry Borges
     *
     * @param $arrIdsEstructuras
     *
     * @return  array: Arreglo con los datos de las estructuras obtenidas
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameEstructurasPorArregloIds($arrIdsEstructuras)
    {
        try {
            $q = Doctrine_Query::create();
            $result = $q->select("idestructura, denominacion")->from('DatEstructura')->whereIn(
                "idestructura", $arrIdsEstructuras
            )->execute();
            $resultado = $result->toArray();

            return $resultado;
        } catch (Doctrine_Exception $ee) {
            echo(__file__ . ' ' . __line__ . ' ' . $ee->getMessage());
        }
    }

    /**
     * Descripción del método : Verifica si existen cargos en una estructura especificada
     *
     * @author    : Ing. Javier Limonta
     * @modified  : Ing. Yoandry Borges
     *
     * @param $idestructura
     * @param $idnomcargo
     *
     * @return mixed
     * @copyright Copyright (c) 2013 xetid
     */
    public function existeCargo($idestructura, $idnomcargo)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('f.idfila')->from('NomFilaestruc f')->innerJoin(
            'f.DatCargo c WITH c.idproyecto = 0'
        )->innerJoin('c.DatCargocivil cc WITH cc.idproyecto = 0')->where(
            'f.fechafin IS NULL AND idpadre = ? and cc.idcargociv = ?', array($idestructura, $idnomcargo)
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $result;
    }

    /**
     * Descripción del método :Descripción del método : Obtiene todos los identificadores de las
     * estructuras internas a la especificada
     *
     * @author    : Ing.Javier Limonta
     * @modified  : Ing.Osvaldo Gonzalez
     *
     * @param $idestructura
     *
     * @return Retorna un arreglo con los identificadores de las estructuras incluyendo y excluyendo los cargos
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameTodasEstructurasInternas($idestructura)
    {

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = Doctrine_Query::create($conn);
        $r = $query->select('nfe.parent_path')->from('NomFilaestruc nfe ')->where(
            "nfe.idfila = {$idestructura}"
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        if (count($r) > 0) {
            $parent_path = $r[0]['parent_path'];
            $sqlSinCargo
                = "SELECT idfila
                FROM mod_estructuracomp.nom_filaestruc fe
                WHERE fe.fechafin IS NULL AND fe.parent_path operator (public.<@) '$parent_path'
        and fe.idconcepto <> 7";
            $sqlConCargo
                = "SELECT idfila
                   FROM mod_estructuracomp.nom_filaestruc fe
                   WHERE fe.fechafin IS NULL AND fe.parent_path operator (public.<@) '$parent_path'
          and fe.idconcepto = 7";
            $v = null;
            $rSin = $conn->fetchAll($sqlSinCargo);
            $rCon = $conn->fetchAll($sqlConCargo);
            $arrSin = array();
            $arrCon = array();
            foreach ($rSin AS $vs) {
                $arrSin[] = $vs['idfila'];
            }
            foreach ($rCon AS $vc) {
                $arrCon[] = $vc['idfila'];
            }
            $v->resultadoSinCargo = $arrSin;
            $v->resultadoConCargo = $arrCon;

            return $v;
        } else {
            return null;
        }
    }

    /**
     * Descripción del método : Obtiene todas las denominaciones de las estructuras
     *
     * @author    : Ing.Javier Limonta
     * @modified  : Ing.Osvaldo Gonzalez
     *
     * @param $datos
     *
     * @return Retorna un arreglo con los datos de las estructura definidas
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameDenominacionPorArregloIdEstructuras($datos)
    {
        $result = array();
        if (count($datos) > 0) {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $cadena = implode(',', $datos);
            $query
                = "
          SELECT fila.idfila AS id,fila.parent_path, fila.lft, fila.rgt
            CASE
              WHEN ee.denominacion <> '' THEN ee.denominacion
              WHEN eo.denominacion <> '' THEN eo.denominacion
            END AS denominacion
					FROM mod_estructuracomp.nom_filaestruc fila
					LEFT JOIN mod_estructuracomp.dat_estructura ee
					    ON(ee.idestructura = fila.idfila AND ee.idproyecto = 0)
					LEFT JOIN mod_estructuracomp.dat_estructuraop eo
					    ON(eo.idestructuraop = fila.idfila  AND eo.idproyecto = 0)
					where fila.fechafin IS NULL AND idfila in ($cadena)";
            $result = $conn->fetchAll($query);
        }

        return $result;
    }

    /**
     * Descripción del método : Devuelve los tipos de estructuras
     *
     * @author    : Ing. Javier Limonta
     * @modified  : Ing. Yoandry Borges
     * @return mixed, Retorna las estructuras
     * @copyright Copyright (c) 2013 xetid
     */
    // no se usa
    /**
     * @return mixed
     */
    public function dameTipoEstructura()
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll(
            "SELECT idconcepto,denominacion FROM mod_estructuracomp.nom_concepto ORDER BY orden"
        );

        return $result;
    }

    /**
     * Retorna las categorias por entidades por proyecto
     *
     * @author    : Ing.Daymel Machado
     * @modified  : Ing.Osvaldo Gonzalez
     *
     * @param $aEstructuras
     * @param $idProyecto
     *
     * @return array
     */
    public function dameCategoriasPorEntidad($aEstructuras, $idProyecto)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $whereRango = "";
        foreach ($aEstructuras as $value) {
            $query = Doctrine_Query::create($conn);
            $result = $query->select('parent_path')->from('NomFilaestruc')->where(
                "fechafin IS NULL AND idfila = {$value}"
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            $parent_path = $result[0]['parent_path'];
            if ($whereRango) {
                $whereRango .= " OR (fila.parent_path operator (public.<@) '$parent_path')";
            } else {
                $whereRango .= " (fila.parent_path operator (public.<@) '$parent_path') ";
            }
        }
        $whereRango = "($whereRango)";
        $iddominio = $this->perfil->iddominio;
        if ($idProyecto == 0) {
            $whereCondicion = "dc.idestado = 0";
        } else {
            $whereCondicion = "((dc.idestado = 0 AND dc.modificado [$idProyecto] = 0) ";
            $whereCondicion .= " OR (dc.idproyecto = $idProyecto AND dc.idestado <> 3))";
        }
        $query
            = "
            SELECT (CASE
                        WHEN nc.idcategocup IS NOT NULL THEN nc.abreviatura ELSE ng.abreviatura
                    END) AS abreviatura,
                    (CASE
                        WHEN nc.idcategocup IS NOT NULL THEN nc.denominacion ELSE ng.denominacion
                    END) AS denominacion,
                    (CASE
                        WHEN nc.idcategocup IS NOT NULL THEN nc.idcategocup ELSE ng.idgrado
                    END) AS id,
                    (CASE
                        WHEN nc.idcategocup IS NOT NULL THEN 0 ELSE 1
                    END) AS esgrado
      FROM mod_estructuracomp.nom_filaestruc fila
      LEFT JOIN mod_estructuracomp.dat_cargo dc ON ((fila.idfila = dc.idcargo AND $whereCondicion))
      LEFT JOIN mod_estructuracomp.dat_cargocivil dcc ON dcc.idcargo = dc.idcargo AND (dcc.idproyecto = dc.idproyecto)
      LEFT JOIN mod_estructuracomp.nom_categocup nc ON nc.idcategocup = dcc.idcategocup
      LEFT JOIN mod_estructuracomp.dat_cargomilitar dcm ON dcm.idcargo = dc.idcargo AND (dcm.idproyecto = dc.idproyecto)
      LEFT JOIN mod_estructuracomp.nom_grado ng ON ng.idgrado = dcm.idgrado
            WHERE fila.fechafin IS NULL AND fila.dominiofila [$iddominio]=1::bit AND
                  (nc.idcategocup IS NOT NULL OR ng.idgrado IS NOT NULL)
                  AND dc.temporal = 0 AND $whereRango
            GROUP BY nc.idcategocup, ng.idgrado
            order by nc.idcategocup, ng.idgrado
        ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $valores = $conn->fetchAll($query);


        $modelDatEstructura = new DatEstructuraModel();
        $categorias = array();
        $widthCategorias = 0;
        $grados = array();
        $indice = 2.6;
        $widthGrados = 0;
        foreach ($valores as $datosValores) {
            if ($datosValores['esgrado']) {
                $widthGrados = $modelDatEstructura->getMaxWordSize(
                    $datosValores['denominacion'], $widthGrados, $indice
                );
                $grados[] = $datosValores;
            } else {
                $widthCategorias = $modelDatEstructura->getMaxWordSize(
                    $datosValores['denominacion'], $widthCategorias, $indice
                );
                $categorias[] = $datosValores;
            }
        }
        $datos ['cabecera']['categorias'] = $categorias;
        $datos ['cabecera']['width']['categorias'] = $widthCategorias;
        $datos ['cabecera']['width']['grados'] = $widthGrados;
        $datos ['cabecera']['grados'] = $grados;
        $ids = implode(',', $aEstructuras);
        $query
            = "
            SELECT *  FROM mod_estructuracomp.f_tablaorganizacion('{ $ids }',$idProyecto,$iddominio);
        ";
        $valores = $conn->fetchAll($query);
        $datos ['entidades'] = $valores;

        return $datos;
    }

    /**
     * Descripción del método : Buscar todas las estructuras que coincidan con el arreglo insertado
     *
     * @author    : Ing.Javier Limonta
     * @modified  : Ing.Osvaldo Gonzalez
     *
     * @params    : array $arreglo Arreglo de identificadores de estructuras
     * @param $arreglo
     *
     * @return mixed : array Retorna un arreglo con todas las estructuras
     * @copyright Copyright (c) 2013 xetid
     */
    private function dameEstructrurasPorArreglo($arreglo)
    {
        $cadena = implode(',', $arreglo);
        $string
            = "SELECT parent_path FROM mod_estructuracomp.nom_filaestruc where fechafin IS NULL AND idfila in ($cadena)";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($string);

        return $result;
    }

    /**
     * Descripción del método : Verifica si la estructura especificada tiene elementos hijos
     *
     * @author    : Ing. Javier Limonta
     * @modified  : Ing. Yoandry Borges
     *
     * @param $identificador
     * @param $rgt
     * @param $lft
     *
     * @return mixed, Verfica si la estructura especificada, posee hijos
     * @copyright Copyright (c) 2013 xetid
     */
    private function verificarTieneHijos($identificador, $parent_path)
    {
        $query
            = "SELECT count(ff.idfila) AS cantidad
        FROM mod_estructuracomp.nom_filaestruc ff
        where ff.fechafin IS NULL AND (ff.parent_path operator (public.<@) '$parent_path')";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($query);

        return $result[0]['cantidad'];
    }

    /**
     * Descripción del método : Buscar todas las estructuras que coincidan con el arreglo insertado
     *
     * @author    : Ing.Javier Limonta
     * @modified  : Ing.Osvaldo Gonzalez
     *
     * @params    : array $datos Arreglo de identificadores de estructuras
     * @params    : int $idEstructura Identificador de la estructura
     * @param $datos
     * @param $idEstructura
     *
     * @return array : array Retorna un arreglo con todas las estructuras
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameEstructrurasPorNodos($datos, $idEstructura)
    {
        $result = array();
        $resultNodos = $this->dameEstructrurasPorArreglo($idEstructura);
        if (count($datos) > 0) {
            foreach ($datos AS $dato) {
                $cont = 0;
                foreach ($resultNodos AS $nodo) {
                    $cont += $this->verificarTieneHijos($dato['id'], $nodo['parent_path']);
                }
                if ($cont > 0) {
                    $dato['icon']
                        = 'http://' . $_SERVER['HTTP_HOST'] . '
            /metadatos/comun/recursos/iconos/' . $dato['iconor'] . '.gif';
                    $result[] = $dato;
                }
            }
        }

        return $result;
    }

    /**
     * Descripción del método : Devuelve las organizaciones existentes, pertenecientes a una estructura determinada
     *
     * @author    : Ing. Javier Limonta
     * @modified  : Ing. Yoandry Borges
     *
     * @param $idpadre
     *
     * @return array, Retorna una arreglo con las organizaciones
     * @copyright Copyright (c) 2013 xetid
     */
    // no se usa
    /**
     * @param $idpadre
     *
     * @return array
     */
    public function getOrganizaciones($idpadre)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "";
        $where = (is_numeric($idpadre)) ? "f.idpadre = $idpadre and f.idpadre <> f.idfila" : "f.idpadre = f.idfila";
        $where .= " And f.idnomeav in (5,7)";
        $sql
            .= "SELECT f.idfila AS id, CASE
                  WHEN (
                        SELECT COUNT(idfila)
                        FROM mod_estructuracomp.nom_filaestruc
                        WHERE idpadre = f.idfila AND idpadre <> idfila
                        ) = 0
                  then true else false
                END AS leaf,
        case
        WHEN f.idnomeav = 7 THEN norg.denominacion
        WHEN f.idnomeav = 5 THEN nomcvil.dencargociv
        END AS text, i.icono AS icon,nomeav.idnomeav AS idtipo
        FROM mod_estructuracomp.nom_filaestruc f
        INNER JOIN mod_estructuracomp.nom_concepto nomeav ON (f.idconcepto = nomeav.idconcepto)
        INNER JOIN mod_estructuracomp.nom_icono i ON (nomeav.idicono = i.idicono)
        LEFT JOIN mod_estructuracomp.dat_organizacion org ON (f.idfila = org.idorganizacion)
        LEFT JOIN mod_estructuracomp.nom_organizacion norg ON (norg.idnomorganizacion = org.idnomorganizacion)
        LEFT JOIN mod_estructuracomp.dat_cargo cargo ON ( cargo.idcargo = f.idfila )
        LEFT JOIN mod_estructuracomp.dat_cargocivil cargocvil ON ( cargo.idcargo = cargocvil.idcargo )
        LEFT JOIN mod_estructuracomp.nom_cargocivil nomcvil  ON ( cargocvil.idcargociv = nomcvil.idcargociv )
        where f.fechafin IS NULL AND $where ORDER BY f.parent_path";
        $result = $conn->fetchAll($sql);

        return $result;
    }

    /**
     * Descripción del método : Devuelve los datos de una organizacion especifica
     *
     * @author    : Ing. Javier Limonta
     * @modified  : Ing. Yoandry Borges
     *
     * @param $idorganizacion
     *
     * @return array, Retorna una arreglo con los datos de las organizaciones
     * @copyright Copyright (c) 2013 xetid
     */
    // no se usa
    /**
     * @param $idorganizacion
     *
     * @return array
     */
    public function getOrganizacionData($idorganizacion)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql
            = "SELECT org.*,o.* FROM mod_estructuracomp.nom_filaestruc f
        INNER JOIN mod_estructuracomp.dat_organizacion o ON (f.idfila = o.idorganizacion)
        INNER JOIN mod_estructuracomp.nom_organizacion org ON (o.idnomorganizacion = org.idnomorganizacion)
        where f.fechafin IS NULL AND f.idfila = $idorganizacion";
        $result = $conn->fetchAll($sql);
        $resultado = array();
        $sqlcargos
            = "SELECT f.idfila AS id,nor.dencargociv AS denominacion,ff.denominacion AS funcion
            FROM mod_estructuracomp.nom_filaestruc f
            INNER JOIN mod_estructuracomp.dat_cargo o ON (f.idfila = o.idcargo)
            INNER JOIN mod_estructuracomp.dat_cargocivil org ON (o.idcargo = org.idcargo)
            INNER JOIN mod_estructuracomp.nom_cargocivil nor ON (org.idcargociv = nor.idcargociv)
            INNER JOIN mod_estructuracomp.nom_funciones ff ON (org.idfuncion = ff.idfuncion)
            where f.fechafin IS NULL AND f.idpadre = $idorganizacion ORDER BY f.ordenunico";
        $resultcargos = $conn->fetchAll($sqlcargos);
        $datoscargos = array();
        if (count($resultcargos) > 0) {
            foreach ($resultcargos AS $r) {
                $datoscargos[] = $r;
            }
        }
        $resultado['data'] = $datoscargos;
        $resultado['cantidad'] = count($datoscargos);
        $resultado['datos'] = $result;
        $resultado['success'] = true;

        return $resultado;
    }

    /**
     * Descripción del método : Buscar todas las entidades dentro de una estructura especificada
     *
     * @author    : Ing.Javier Limonta
     * @modified  : Ing.Osvaldo Gonzalez
     *
     * @params    : int $idEstructura Identificador de la estructura
     * @params    : int $idDominio Dominio de seguridad
     * @param $idEstructura
     * @param $idDominio
     * @param $proyecto
     * @param $service
     *
     * @return array : array Retorna un arreglo con todas las entidades encontradas
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscarEntidadPorEstructura($idEstructura, $idDominio, $proyecto = false, $service = false)
    {
        $resultado = array();
        if (is_numeric($idEstructura)) {
            $object = Doctrine::getTable('NomFilaestruc')->find($idEstructura);
            if (is_object($object) && !empty($object->parent_path)) {
                $parent_path = $object->parent_path;
                $query = Doctrine_Query::create();
                $whereWith = 'e.idestado = 0';
                if (is_numeric($proyecto)) {
                    if ($proyecto != 0) {
                        $whereWith
                            = "((e.idproyecto = $proyecto AND e.idestado <> 0) " .
                            "OR (e.idproyecto = 0 AND e.modificado [$proyecto]=0))";
                    }
                }
                $whereRango = "parent_path operator (public.@>) '$parent_path'";
                if ($service) {
                    $whereRango = "parent_path operator (public.<@) '$parent_path'";
                }
                $consulta
                    = "f.fechafin IS NULL AND dominiofila [$idDominio] = 1::bit AND $whereRango and (idconcepto
                 = 3 OR idconcepto = 4)";
                $query->select('f.idfila AS id,f.*,e.denominacion AS text, e.idtipoescala AS idtipoescala')->from(
                    'NomFilaestruc f'
                )->innerJoin("f.DatEstructura e WITH $whereWith")->where($consulta)->setHydrationMode(
                    Doctrine::HYDRATE_ARRAY
                );
                $query = $this->integrator->metadatos->getSqlNomTipoEscala($query);
                $resultado = $query->execute();

            }
        } else {
            $query = Doctrine_Query::create();
            $resultado = $query->select('f.idfila AS id,f.*,e.denominacion, e.idtipoescala AS idtipoescala')->from(
                'NomFilaestruc f'
            )->innerJoin('f.DatEstructura e')->where(
                'f.fechafin IS NULL AND dominiofila [?] = 1::bit and idconcepto = 3', $idDominio
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        }

        return $resultado;
    }

    /**
     * Descripción del método : Busca los hijos de una estructura determinada
     *
     * @author    : Ing. Javier Limonta
     *
     * @param      $texto
     * @param      $proyecto
     * @param      $idestructura
     * @param bool $lft
     * @param bool $rgt
     * @param bool $includeInternos
     *
     * @return array Retorna un arreglo con los hijos de la estructura deseada
     * @copyright Copyright (c) 2013 xetid
     */
    public function verificarHijosEstructura(
        $texto, $proyecto = 0, $idestructura = false, $parent_path = false, $includeInternos = true
    )
    {
        $where = "1 = 1";
        $whereInclude = "1 = 1";
        if (!$includeInternos) {
            $whereInclude = " (fila.idconcepto <7 OR fila.idconcepto = 8)";
        }
        $iddominio = $this->perfil->iddominio;
        if (!is_bool($parent_path)) {
            $where .= " AND fila.parent_path operator (public.<@) '$parent_path'";
        } else {
            $where .= " AND fila.idfila = $idestructura";
        }
        if ($proyecto != 0 && is_numeric($proyecto)) { // tratamiento del proyecto
            $sqlFiltroProyectoEstructura
                = " AND ((estructura.idestado = 0 and estructura.modificado[$proyecto] = 0) " .
                "OR ( estructura.idproyecto = $proyecto AND estructura.idestado <> 0 ))";
            $sqlFiltroProyectoEstructuraOP
                = " AND ((estructuraop.idestado = 0 and estructuraop.modificado[$proyecto] = 0) " .
                "OR ( estructuraop.idproyecto = $proyecto AND estructuraop.idestado <> 0 ))";
            $sqlFiltroProyectoCargo
                = " AND ((cargo.idestado = 0 and cargo.modificado[$proyecto] = 0) " .
                "OR ( cargo.idproyecto = $proyecto AND cargo.idestado <> 0 ))";
        } else {
            $sqlFiltroProyectoEstructura = " AND (idestado = 0 ) ";
            $sqlFiltroProyectoEstructuraOP = " AND (estructuraop.idestado = 0 ) ";
            $sqlFiltroProyectoCargo = " AND (cargo.idestado = 0 ) ";
        }
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query
            = "
        SELECT
              CASE
                WHEN nomcvil.denominacion <> '' THEN nomcvil.denominacion
                WHEN estructura.denominacion <> '' THEN estructura.denominacion
                WHEN estructuraop.denominacion <> '' THEN estructuraop.denominacion
              END AS tiene,
              CASE
                WHEN LOWER(estructura.denominacion) LIKE LOWER('%$texto%') THEN 'true'
                WHEN estructura.codigo ILIKE '$texto' THEN 'true'
                WHEN LOWER(estructuraop.denominacion) LIKE LOWER('%$texto%') THEN 'true'
                WHEN LOWER(nomcvil.denominacion) LIKE LOWER('%$texto%') THEN 'true'
              END AS es
        FROM mod_estructuracomp.nom_filaestruc fila
        LEFT JOIN mod_estructuracomp.dat_estructura estructura
            ON ( estructura.idestructura = fila.idfila $sqlFiltroProyectoEstructura)
        LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop
            ON ( estructuraop.idestructuraop = fila.idfila $sqlFiltroProyectoEstructuraOP )
        LEFT JOIN mod_estructuracomp.dat_cargo cargo
            ON ( cargo.idcargo = fila.idfila $sqlFiltroProyectoCargo)
        LEFT JOIN mod_estructuracomp.nom_cargo nomcvil
            ON ( cargo.idnomcargo = nomcvil.idnomcargo )
        WHERE fila.fechafin is null AND $whereInclude AND
            (
              (LOWER(estructura.denominacion) LIKE LOWER('%$texto%'))
              OR (estructura.codigo ILIKE '$texto')
              OR (LOWER(estructuraop.denominacion) LIKE LOWER('%$texto%'))
              OR (LOWER(nomcvil.denominacion) LIKE LOWER('%$texto%'))
            )
        and $where and dominiofila[$iddominio] = 1::BIT and fila.fechafin IS NULL
        ORDER BY fila.ordenunico";

        $resultado = $conn->fetchAll($query);

        return $resultado;
    }

    /**
     * Descripción del método : Devuelve los elementos internos de la estructura
     *
     * @author    : Ing. Javier Limonta
     * @modified  : Ing. Yoandry Borges
     *
     * @param        $idPadre
     * @param int $start
     * @param int $limit
     * @param int $codigo
     * @param int $denominacion
     * @param string $idnomeav
     * @param string $iddpa
     *
     * @return array, Retorna un arreglo con los elementos internos de la estructura
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameElementosInternos(
        $idPadre, $start = 0, $limit = 15, $codigo = 0, $denominacion = 0, $idnomeav = "", $iddpa = ""
    )
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlFiltro = $this->buildSqlFiltro($codigo, $denominacion, $idnomeav, $iddpa);
        $sqlBuscarPadre
            = 'SELECT fila.parent_path FROM mod_estructuracomp.nom_filaestruc fila
          where fila.idfila = ' . $idPadre . ' limit 1';
        $elementos = $conn->fetchAll($sqlBuscarPadre);
        $parent_path = $elementos[0]['parent_path'];
        $sqlQhere = "fila.parent_path  operator (public.<@) $parent_path  " . $sqlFiltro;
        $iddominio = $this->perfil->iddominio;
        $sqlBus
            = "select distinct(fila.idfila) AS idestructura,fila.idpadre AS _parent,
                fila.parent_path,
                ASE
                  WHEN (
                        SELECT COUNT(idfila)
                        FROM mod_estructuracomp.nom_filaestruc
                        WHERE idpadre = f.idfila AND idpadre <> idfila
                        ) = 0
                  then true else false
                END AS leaf,estructura.codigo,
                CASE
                  WHEN nomcvil.denominacion <> '' THEN nomcvil.denominacion
									WHEN estructura.denominacion <> '' THEN estructura.denominacion
									WHEN estructuraop.denominacion <> '' THEN estructuraop.denominacion
                END AS denominacion,
                CASE
                  WHEN estructura.denominacion <> '' THEN estructura.iddpt else 0
                END AS iddpt,nomeav.denominacion AS nombretipo,nomeav.idconcepto AS idconcepto,
								i.icono AS icon
              FROM
              mod_estructuracomp.nom_filaestruc fila
              INNER JOIN mod_estructuracomp.nom_concepto nomeav
                  ON fila.idconcepto = nomeav.idconcepto
              INNER JOIN mod_estructuracomp.nom_icono i
                  ON i.idicono = nomeav.idicono
              LEFT JOIN mod_estructuracomp.dat_estructura estructura
                  ON ( estructura.idestructura = fila.idfila AND estructura.idproyecto = 0)
              LEFT JOIN mod_estructuracomp.nom_organo orgest
                  ON ( orgest.idorgano = estructura.idorgano AND orgest.idconcepto = fila.idconcepto )
              LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop
                  ON ( estructuraop.idestructuraop = fila.idfila  AND estructuraop.idproyecto = 0)
              LEFT JOIN mod_estructuracomp.nom_organo orgestop
                  ON ( orgestop.idorgano = estructuraop.idorgano AND orgestop.idconcepto = fila.idconcepto  )
              LEFT JOIN mod_estructuracomp.dat_cargo cargo
                  ON ( cargo.idcargo = fila.idfila  AND cargo.idproyecto = 0 )
							LEFT JOIN mod_estructuracomp.nom_cargo nomcvil
							    ON ( cargo.idnomcargo = nomcvil.idnomcargo )
              where
      $sqlQhere AND fila.dominiofila[$iddominio] = 1 :: bit
              ORDER BY fila.parent_path
              offset $start limit $limit";
        $count
            = "select count(distinct(fila.idfila)) AS cant
            FROM
              mod_estructuracomp.nom_filaestruc fila
              INNER JOIN mod_estructuracomp.nom_concepto nomeav
                 ON fila.idconcepto = nomeav.idconcepto
              LEFT JOIN mod_estructuracomp.dat_estructura estructura
                 ON ( estructura.idestructura = fila.idfila )
              LEFT JOIN mod_estructuracomp.nom_organo orgest
                 ON ( orgest.idorgano = estructura.idorgano
                   AND orgest.idconcepto = fila.idconcepto )
              LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop
                 ON ( estructuraop.idestructuraop = fila.idfila )
              LEFT JOIN mod_estructuracomp.nom_organo orgestop
                 ON ( orgestop.idorgano = estructuraop.idorgano
                   AND orgestop.idconcepto = fila.idconcepto  )
              LEFT JOIN mod_estructuracomp.dat_cargo cargo
                 ON ( cargo.idcargo = fila.idfila )
              LEFT JOIN mod_estructuracomp.nom_cargo nomcvil
                 ON ( cargo.idnomcargo = nomcvil.idnomcargo )
              where
      $sqlQhere AND fila.dominiofila[$iddominio] = 1 :: bit AND fila.fechafin IS NULL";
        $cantidad = $conn->fetchAll($count);
        $data = $conn->fetchAll($sqlBus);

        return array('cantidad' => (($cantidad [0] ['cant']) ? $cantidad [0] ['cant'] : 0), 'datos' => $data);
    }

    /**
     * Descripción del método : Buscar todas las dentro de una especificada que cumpla con los parametros definidos
     *
     * @author    : Ing.Javier Limonta
     * @modified  : Ing.Osvaldo Gonzalez
     *
     * @params    : int $idDominio Dominio de seguridad
     * @params    : array $filtro Arreglo con los elemetos del filtro
     * @params    : array $identificadores Temporal para almacenar los filtros
     * @param $idDominio
     * @param $filtro
     * @param $identificadores
     *
     * @return mixed : array Retorna un arreglo con todas las estructuras encontradas
     * @return mixed : array Retorna un arreglo con todas las estructuras encontradas
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameEstructurasPorDenominacion($idDominio, $filtro, $identificadores = false)
    {
        $identificadors = $filter = " 1 = 1 ";
        if (is_array($identificadores) && count($identificadores) > 0) {
            $cadena = implode(',', $identificadores);
            $identificadors .= " AND fila.idfila in ($cadena)";
        } else {
            if ($identificadores) {
                $identificadors .= " AND fila.idfila = $identificadores";
            }
        }
        if (is_string($filtro)) {
            $filter .= " AND estructura.denominacion ILIKE '%$filtro%'";
        }
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query
            = "SELECT fila.idfila,estructura.denominacion
							FROM mod_estructuracomp.nom_filaestruc fila
							INNER JOIN mod_estructuracomp.nom_concepto nomeav
							    ON fila.idconcepto = nomeav.idconcepto
							INNER JOIN mod_estructuracomp.dat_estructura estructura
							    ON ( estructura.idestructura = fila.idfila AND estructura.idproyecto = 0)
							WHERE fila.fechafin IS NULL AND fila.dominiofila[$idDominio] = 1::bit and $identificadors and $filter";
        $resultado = $conn->fetchAll($query);

        return $resultado;
    }

    /**
     * Descripción del método : Devuelve los hijos de una estructura especifica
     *
     * @author    : Ing. Javier Limonta
     * @modified  : Ing. Yoandry Borges
     *
     * @param $idpadre
     *
     * @return mixed, Retorna las estructuras hijas de determinado padre
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameHijosPadre($idpadre)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlCantidad
            = "SELECT count(fila.idfila) FROM mod_estructuracomp.nom_filaestruc fila WHERE fila.idpadre =" .
            $idpadre;
        $result = $conn->fetchAll($sqlCantidad);

        return $result;
    }

    /**
     * Descripción del método: Busca todos los datos de la estructura especificada
     * para caso de modificar o vista de detalles
     *
     * @author     : Ing. Javier Limonta
     * @modified   : Ing. Osvaldo Gonzalez
     *
     * @param $identificador
     * @param $idConcepto
     * @param $idProyecto
     *
     * @return array Retorna un arreglo con todos los datos de la estructura
     * @copyright  Copyright (c) 2013 xetid
     */
    public function obtenerDatos(
        $identificador, $idConcepto, $idProyecto = 0
    )
    {

        $objectData = null;
        $isEstructura = false;
        $resultado = array();
        $resultado['id'] = $identificador;
        $resultado['idconcepto'] = $idConcepto;

        if ($idConcepto == 7 /*|| $idConcepto == 10*/) {
            $datCargo = new DatCargo();
            $objectData = $datCargo->buscar($identificador, $idProyecto);
        } elseif ($idConcepto <= 4) {
            $objectData = Doctrine::getTable('DatEstructura')->findByDql(
                "idestructura = $identificador AND idproyecto = $idProyecto"
            )->getFirst();

            $isEstructura = true;

            $resultado['idsector'] = $objectData->idsector;
            $objectSector = Doctrine::getTable('NomSector')->find($objectData->idsector);
            $resultado['sector'] = $objectSector->denominacion;
            $resultado['alias'] = $objectData->alias;

        } else {
            $objectData = Doctrine::getTable('DatEstructuraop')->findByDql(
                "idestructuraop = $identificador AND idproyecto = $idProyecto"
            )->getFirst();
        }

//print_r($objectData);die;
        if ($idConcepto == 9) {
            $modelMedio = new DatMedio();
            $objectData = $modelMedio->buscar($identificador, $idProyecto);
        }


        if ($idConcepto == 7 || $idConcepto == 10) {
            $resultado = $this->obtenerDatosCargo($identificador, $idProyecto, $objectData, $resultado);
        } else {
            if ($idConcepto == 9) {
                $resultado['idtipomedio'] = $objectData['idtipomedio'];
                $objectTipoMedio = Doctrine::getTable('NomTipomedio')->find($objectData['idtipomedio']);
                $resultado['tipomedio'] = $objectTipoMedio->denominacion;
                $resultado['idmedio'] = $objectData['idnommedio'];
                $resultado['denominacion'] = $objectData['denominacion'];
                $resultado['cantidad'] = $objectData['cantidad'];
                $resultado['cantidadreal'] = $objectData['cantidadreal'];
                $resultado['icono'] = $objectData['idicono'];
                $resultado['nombre_imagen'] = $objectData['nombre_imagen'];
            } else {

                $resultado = $this->obtenerDatosEstructuras($idConcepto, $objectData, $resultado, $isEstructura);
                //print_r($resultado);die;
            }
        }
        return $resultado;
    }

    /**
     * @param      $idestructura
     * @param bool $dominio
     *
     * @return array
     */
    public function obtenerCargosXIdestructura($idestructura, $dominio = true)
    {
        $where = " AND 1=1";
        if (!empty($dominio)) {
            if (is_int($dominio)) {
                $iddominio = $dominio;
            } else {
                if (is_bool($dominio))
                    $iddominio = $this->global->Perfil->iddominio;
                else {
                    $iddominio = $dominio;
                }
            }
            if (empty($iddominio)) {
                $iddominio = 1;
            }
            $where = " AND nfe.dominiofila[$iddominio] = '1'::bit";
        }
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = Doctrine_Query::create($conn);
        $r = $query->select('nfe.parent_path')->from('NomFilaestruc nfe ')->where(
            "nfe.idfila = {$idestructura}"
        )->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
        if (count($r) > 0) {
            $parent_path = $r[0]['parent_path'];
            $sql
                = "
                    SELECT nfe.idfila AS idcargo
                    FROM mod_estructuracomp.nom_filaestruc nfe
                    INNER JOIN mod_estructuracomp.dat_cargo cargo
                        ON (cargo.idcargo = nfe.idfila AND (cargo.idproyecto = 0 AND cargo.idestado = 0))

                    WHERE nfe.fechafin IS NULL AND (nfe.idconcepto= 7) AND nfe.parent_path operator (public.<@) '$parent_path'
                    " .
                $where . " ORDER BY nfe.ordenunico";


            $resultado = $conn->fetchAll($sql);

            return $resultado;
        } else {
            return array();
        }
    }

    /**
     * Descripción del método: Busca si la estructura seleccionada posee elementos modificados
     *
     * @author     : Ing. Osvaldo Gonzalez
     *
     * @param $identificador
     * @param $proyecto
     * @param $insertados
     *
     * @return bool Retorna TRUE en caso de tener elementos modificados, FALSE en caso contrario
     * @copyright  Copyright (c) 2013 xetid
     */
    public static function tieneModificado($identificador, $proyecto, $insertados = false)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if ($proyecto != 0) {
            $whereInsertado = ($insertados) ? "idestado = 1" : "idestado <> 0";
            $sql
                = "
        SELECT f.parent_path
        FROM mod_estructuracomp.nom_filaestruc f
        LEFT JOIN mod_estructuracomp.dat_estructura e ON (f.idfila = e.idestructura)
        LEFT JOIN mod_estructuracomp.dat_estructuraop op ON (f.idfila = op.idestructuraop)
        LEFT JOIN mod_estructuracomp.dat_medio m ON (f.idfila = m.idmedio)
        LEFT JOIN mod_estructuracomp.dat_cargo cc ON (f.idfila = cc.idcargo)
        WHERE f.fechafin IS NULL AND (f.idfila = $identificador)
      ";
            $limites = $conn->fetchAll($sql);
            $parent_path = $limites[0]['parent_path'];
            $sql
                = "
        SELECT f.idfila
        FROM mod_estructuracomp.nom_filaestruc f
        LEFT JOIN mod_estructuracomp.dat_estructura e ON (f.idfila = e.idestructura)
        LEFT JOIN mod_estructuracomp.dat_estructuraop op ON (f.idfila = op.idestructuraop)
        LEFT JOIN mod_estructuracomp.dat_medio m ON (f.idfila = m.idmedio)
        LEFT JOIN mod_estructuracomp.dat_cargo cc ON (f.idfila = cc.idcargo)
        WHERE f.fechafin IS NULL AND  f.parent_path operator (public.<@) '$parent_path' AND
            ((e.$whereInsertado AND e.idproyecto = $proyecto) OR
            (op.$whereInsertado AND op.idproyecto = $proyecto) OR
            (m.$whereInsertado AND m.idproyecto = $proyecto) OR
            (cc.$whereInsertado AND cc.idproyecto = $proyecto)
        )
      ";
            $result = $conn->fetchAll($sql);

            return (count($result) > 0);
        } else {
            return false;
        }
    }

    /**
     * @param $identificador
     *
     * @return array
     */
    public function dameArbolEstructura($identificador)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql
            = "SELECT f.parent_path
                FROM mod_estructuracomp.nom_filaestruc f
                WHERE f.idfila = $identificador
        ";
        $limites = $conn->fetchAll($sql);
        if (count($limites)) {
            $parent_path = $limites[0]['parent_path'];
            $leafSql
                = "
              SELECT COUNT(f.idfila)
              FROM mod_estructuracomp.nom_filaestruc AS f
              WHERE f.idpadre = fila.idfila AND f.idpadre <> f.idfila";
            $militar
                = "
              SELECT ic.icono
              FROM mod_estructuracomp.nom_icono AS ic
              INNER JOIN mod_estructuracomp.nom_concepto AS con ON (con.idicono = ic.idicono)
              WHERE con.idconcepto = 10
            ";
            $sql
                = "
                SELECT (($leafSql) = 0) as leaf, fila.idfila as id, fila.idpadre,
                    CASE
                        WHEN e.idestructura IS NOT NULL THEN e.denominacion
                        WHEN op.idestructuraop IS NOT NULL THEN op.denominacion
                        WHEN c.idcargo IS NOT NULL THEN nc.denominacion
                        WHEN m.idmedio IS NOT NULL THEN nm.denominacion
                    END AS denominacion,
                    CASE
                        WHEN e.idestructura IS NOT NULL THEN e.denominacion
                        WHEN op.idestructuraop IS NOT NULL THEN op.denominacion
                        WHEN c.idcargo IS NOT NULL THEN nc.denominacion
                        WHEN m.idmedio IS NOT NULL THEN nm.denominacion
                    END AS text,
                    CASE
                        WHEN e.idestructura IS NOT NULL THEN e.abreviatura
                        WHEN op.idestructuraop IS NOT NULL THEN op.abreviatura
                        WHEN c.idcargo IS NOT NULL THEN nc.abreviatura
                    END AS abreviatura,
                    CASE
                        WHEN noe.idorgano IS NOT NULL THEN noe.denominacion
                        WHEN noop.idorgano IS NOT NULL THEN noop.denominacion
                    END AS tipo,
                    e.codigo,
                    concepto.idconcepto,
                    concepto.denominacion as concepto,
                    concepto.idconcepto as idconcepto,

                 case
									WHEN e.idorgano IS NOT NULL THEN e.idorgano
									WHEN eo.idorgano IS NOT NULL THEN eo.idorgano
										end as idorgano,

                      WHEN cm.idcargo IS NOT NULL THEN
                        ($militar)
                      WHEN m.idicono IS NOT NULL THEN
                        im.icono
                      else
                        i.icono
                    END AS icon,
                    (
                        SELECT f.orden
                        FROM mod_estructuracomp.nom_filaestruc f
                        WHERE f.fechafin IS NOT NULL AND f.idfila = fila.idpadre
                    ) AS ordenSuperior
                    FROM mod_estructuracomp.nom_filaestruc fila
                    INNER JOIN mod_estructuracomp.nom_concepto concepto
                          ON (fila.idconcepto = concepto.idconcepto)
                    INNER JOIN mod_estructuracomp.nom_icono i
                          ON (concepto.idicono = i.idicono)
                    LEFT JOIN mod_estructuracomp.dat_estructura e
                          ON (fila.idfila = e.idestructura AND e.idestado = 0)
                    LEFT JOIN mod_estructuracomp.nom_organo noe
                          ON (e.idorgano = noe.idorgano AND e.idconcepto = noe.idconcepto)
                    LEFT JOIN mod_estructuracomp.dat_estructuraop op
                          ON (fila.idfila = op.idestructuraop AND op.idestado = 0)
                    LEFT JOIN mod_estructuracomp.nom_organo noop
                          ON (op.idorgano = noop.idorgano AND op.idconcepto = noop.idconcepto)
                    LEFT JOIN mod_estructuracomp.dat_medio m
                          ON (fila.idfila = m.idmedio AND m.idestado = 0)
                    LEFT JOIN mod_estructuracomp.nom_icono im
                          ON (m.idicono = im.idicono)
                    LEFT JOIN mod_datosmaestros.nom_indicador nm
                          ON (nm.idindicador = m.idnommedio)
                    LEFT JOIN mod_estructuracomp.dat_cargo c
                          ON (fila.idfila = c.idcargo AND c.idestado = 0)
                    LEFT JOIN mod_estructuracomp.dat_cargocivil cc
                          ON (fila.idfila = cc.idcargo AND c.idproyecto = cc.idproyecto)
                    LEFT JOIN mod_estructuracomp.dat_cargomilitar cm
                          ON (fila.idfila = cm.idcargo AND c.idproyecto = cm.idproyecto)
                    LEFT JOIN mod_estructuracomp.nom_cargo nc ON (c.idnomcargo = nc.idnomcargo)
                    WHERE fila.fechafin IS NULL
                        AND (e.idestructura IS NOT NULL OR
                            op.idestructuraop IS NOT NULL OR
                            c.idcargo IS NOT NULL OR
                            m.idmedio IS NOT NULL) AND (fila.parent_path operator (public.<@) '$parent_path')
                    ORDER BY fila.nivel, ordenSuperior
                ";

            $result = $conn->fetchAll($sql);

            return $result;
        }

        return array();
    }

    /**
     * @param bool $idOrgano
     * @param bool $denominacion
     *
     * @return array
     */
    public function dameEstructuraByOrgano($idOrgano = false, $denominacion = false)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $where = " de.idproyecto = 0 and de.idconcepto = 3";
        if ($denominacion) {
            $where .= " AND lower (nom.denominacion) like lower('$denominacion')";
        }
        if ($idOrgano) {
            $where .= " AND nom.idorgano = $idOrgano";
        }
        $sql
            = "SELECT DISTINCT de.idestructura,de.idespecialidad,de.denominacion,de.abreviatura,de.codigo,de.iddpt,
            de.idicono,de.idorgano,de.idconcepto,de.idproyecto,nom.denominacion AS organo
                FROM mod_estructuracomp.dat_estructura de
                INNER JOIN mod_estructuracomp.nom_organo nom ON(de.idorgano = nom.idorgano)
                WHERE $where
                ORDER BY de.idestructura";
        $result = $conn->fetchAll($sql);

        return $result;
    }

    /**
     * @param $datos
     * @param $conn
     * @param $rutaSQL
     * @param $rutaId
     * @param $rutaDenom
     * @param $rutas
     *
     * @return array
     */
    private function construirRuta($datos, $conn, $rutaSQL, $rutaId, $rutaDenom, $rutas)
    {
        $padres = $conn->fetchAll($rutaSQL);
        if ($padres[0]['idfila']) {
            if (!$datos) {
                $i = 1;
                foreach ($padres AS $padreValue) {
                    if ($this->validaCount($i, $padres)) {
                        $rutaId .= '/' . $padreValue['idfila'];
                        $rutaDenom .= '/' . $padreValue['denominacion'];
                    } else {
                        $rutaId .= $padreValue['idfila'];
                        $rutaDenom .= $padreValue['denominacion'];
                    }
                    $i++;
                }

                return array($rutaId, $rutaDenom, $rutas);
            } else {
                foreach ($padres AS $padreValue) {
                    $pos = $this->existenciaEstructura($rutas, $padreValue['idfila']);
                    if (is_bool($pos)) {
                        $rutas[] = $padreValue;
                    }
                }

                return array($rutaId, $rutaDenom, $rutas);
            }
        }

        return array($rutaId, $rutaDenom, $rutas);
    }

    /**
     * @param $idPadre
     * @param $organica
     * @param $marcado
     * @param $proyecto
     * @param $incluyeInternos
     * @param $sqlQhere
     *
     * @return array
     */
    private function construirFiltros($idPadre, $organica, $marcado, $proyecto, $incluyeInternos, $sqlQhere)
    {
        if (!$incluyeInternos) {
            $whereInternosFila = " AND (fila.idconcepto < 7 OR fila.idconcepto = 9)";
            $whereInternosFilaPadre = " AND (f.idconcepto < 7 OR f.idconcepto = 9)";
            $sqlQhere .= $whereInternosFila;
        }
        if (!is_numeric($idPadre) && $organica == true) {
            $sqlQhere .= " AND fila.idconcepto = 2";
        }
        $marcar = "";
        if ($marcado) {
            $marcar = "true AS check,";
        }
        $sqlFiltroProyectoCargoMilitar = "";
        $sqlFiltroProyectoCargoCivil = "";
        if ($proyecto != 0 && is_numeric($proyecto)) { // tratamiento del proyecto
            $sqlFiltroProyectoEstructura
                = " AND ((estructura.idestado = 0 and (estructura.modificado[$proyecto] = 0 or estructura.modificado[$proyecto] is null)) " .
                "OR ( estructura.idproyecto = $proyecto))";
            $sqlFiltroProyectoEstructuraSQL
                = " AND ((e.idestado = 0 and (e.modificado[$proyecto] = 0 or e.modificado[$proyecto] is null)) " .
                "OR ( e.idproyecto = $proyecto))";
            $sqlFiltroProyectoEstructuraOP
                = " AND ((estructuraop.idestado = 0 and (estructuraop.modificado[$proyecto] = 0 or estructuraop.modificado[$proyecto] is null)) " .
                "OR ( estructuraop.idproyecto = $proyecto))";
            $sqlFiltroProyectoCargo
                = " AND ((cargo.idestado = 0 and (cargo.modificado[$proyecto] = 0 or cargo.modificado[$proyecto] is null)) " .
                "OR ( cargo.idproyecto = $proyecto))";
            $sqlFiltroProyectoEstructuraLeaf
                = " AND ((e.idestado = 0 and (e.modificado[$proyecto] = 0 or e.modificado[$proyecto] is null)) " .
                "OR ( e.idproyecto = $proyecto))";
            $sqlFiltroProyectoEstructuraOPLeaf
                = " AND ((op.idestado = 0 and (op.modificado[$proyecto] = 0 or op.modificado[$proyecto] is null)) " .
                "OR ( op.idproyecto = $proyecto))";
            $sqlFiltroProyectoCargoLeaf
                = " AND ((ca.idestado = 0 and (ca.modificado[$proyecto] = 0 or ca.modificado[$proyecto] is null)) " .
                "OR ( ca.idproyecto = $proyecto))";
            $sqlFiltroMedioLeaf
                = " AND ((m.idestado = 0 and (m.modificado[$proyecto] = 0 or m.modificado[$proyecto] is null)) " .
                "OR ( m.idproyecto = $proyecto))";
            $sqlFiltroProyectoCargoCivil = " AND cargo.idproyecto = cargociv.idproyecto";
            $sqlFiltroProyectoCargoMilitar = " AND cargo.idproyecto = cargom.idproyecto";
            $sqlFiltroMedio
                = " AND ((medio.idestado = 0 and (medio.modificado[$proyecto] = 0 or medio.modificado[$proyecto] is null)) " .
                "OR ( medio.idproyecto = $proyecto))";

            return array(
                $whereInternosFilaPadre, $sqlQhere, $marcar, $sqlFiltroProyectoCargoMilitar,
                $sqlFiltroProyectoCargoCivil, $sqlFiltroProyectoEstructura, $sqlFiltroProyectoEstructuraSQL,
                $sqlFiltroProyectoEstructuraOP, $sqlFiltroProyectoCargo, $sqlFiltroProyectoEstructuraLeaf,
                $sqlFiltroProyectoEstructuraOPLeaf, $sqlFiltroProyectoCargoLeaf, $sqlFiltroMedioLeaf, $sqlFiltroMedio);
        } else {
            $sqlFiltroProyectoEstructura = " AND (estructura.idproyecto = 0 ) ";
            $sqlFiltroProyectoEstructuraSQL = " AND (e.idproyecto = 0 ) ";
            $sqlFiltroProyectoEstructuraOP = " AND (estructuraop.idproyecto = 0 ) ";
            $sqlFiltroProyectoCargo = " AND (cargo.idproyecto = 0 ) ";
            $sqlFiltroMedio = " AND (medio.idproyecto = 0 ) ";
            $sqlFiltroProyectoEstructuraLeaf = " AND (e.idproyecto = 0 ) ";
            $sqlFiltroProyectoEstructuraOPLeaf = " AND (op.idproyecto = 0 ) ";
            $sqlFiltroProyectoCargoLeaf = " AND (ca.idproyecto = 0 ) ";
            $sqlFiltroMedioLeaf = " AND ( m.idproyecto = 0 ) ";

            return array(
                $whereInternosFilaPadre, $sqlQhere, $marcar, $sqlFiltroProyectoCargoMilitar,
                $sqlFiltroProyectoCargoCivil, $sqlFiltroProyectoEstructura, $sqlFiltroProyectoEstructuraSQL,
                $sqlFiltroProyectoEstructuraOP, $sqlFiltroProyectoCargo, $sqlFiltroProyectoEstructuraLeaf,
                $sqlFiltroProyectoEstructuraOPLeaf, $sqlFiltroProyectoCargoLeaf, $sqlFiltroMedioLeaf, $sqlFiltroMedio);
        }
    }

    /**
     * @param $identificador
     * @param $idProyecto
     * @param $objectData
     * @param $resultado
     *
     * @return mixed
     */
    private function obtenerDatosCargo($identificador, $idProyecto, $objectData, $resultado)
    {
        $perfil = Util::getPerfilGlobal();
        $idDominio = $perfil->iddominio;
        $datos = $this->buscarEntidadPorEstructura(
            $identificador, $idDominio, $idProyecto
        );
        $tipoescala = $objectData[0]['idtipoescala'];
        $tipoescala = ($tipoescala) ? $tipoescala : 0;
        $domainEscala = new NomEscalaSalarial();
        $existeEscala = $domainEscala->existeEscala($tipoescala, $objectData[0]['idsalario']);
        $resultado['escala'] = $existeEscala[0]['idtipoescala'];
        $tcargo = "";
        $tcargo .= ($objectData[0]['temporal']) ? '1' . ',' : '0' . ',';
        $tcargo .= ($objectData[0]['directo']) ? 0 : '2';
        $resultado['tcargo'] = $tcargo;
        $resultado['cantidad'] = $objectData[0]['cantidad'];
        $resultado['cantidad_real'] = $objectData[0]['cantidadreal'];
        $resultado['idespecialidad_preparacion'] = $objectData[0]['idespecialidadpreparacion'];
        $resultado['idespecialidad_empleo'] = $objectData[0]['idespecialidadempleo'];
        $resultado['especialidad_preparacion'] = $objectData[0]['especialidad_preparacion'];
        $resultado['especialidad_empleo'] = $objectData[0]['especialidad_empleo'];

        $resultado['principal'] = $objectData[0]['principal'];
        $resultado['jefebrigada'] = $objectData[0]['jefebrigada'];

        $resultado['idcategocup'] = $objectData[0]['idcategocup'];

        if ($resultado['idcategocup'] != null) {
            $objectCategoria = Doctrine::getTable('NomCategocup')->find($objectData[0]['idcategocup']);
            $resultado['categocup'] = $objectCategoria->denominacion;
            $resultado['abrev_categocup'] = $objectCategoria->denominacion;
            $objectGrupoCategoria = Doctrine::getTable('NomCategoria')->find($objectCategoria->idcategoria);
            $resultado['categoria'] = $objectGrupoCategoria->denominacion;
            $resultado['abrev_categoria'] = $objectGrupoCategoria->abreviatura;
        }
        $resultado['idgrado'] = $objectData[0]['idgrado'];
        $resultado['icongrado'] = $objectData[0]['icongrado'];
        if ($resultado['idgrado']) {
            $objectGrado = Doctrine::getTable('NomGrado')->find($objectData[0]['idgrado']);
            $resultado['grado'] = $objectGrado->denominacion;
            $resultado['abrev_grado'] = $objectGrado->abreviatura;
        }
        $resultado['idpreparacion'] = $objectData[0]['idpreparacion'];
        $objectPreparacion = Doctrine::getTable('NomPreparacion')->find(
            $objectData[0]['idpreparacion']
        );
        $resultado['preparacion'] = $objectPreparacion->denominacion;
        $resultado['abrev_preparacion'] = $objectPreparacion->abreviatura;

        //sector,nivelcargo,facultado,decisorio
        $resultado['idsector'] = $objectData[0]['idsector'];
        $objectSector = Doctrine::getTable('NomSector')->find($objectData[0]['idsector']);
        $resultado['sector'] = $objectSector->denominacion;
        $resultado['decisorio'] = $objectData[0]['decisorio'];
        $resultado['idfacultado'] = $objectData[0]['idfacultado'];
        $objectFacultado = Doctrine::getTable('NomCargoFacultado')->find($objectData[0]['idfacultado']);
        $resultado['facultado'] = $objectFacultado->denominacion;
        $resultado['idnivelcargo'] = $objectData[0]['idnivelcargo'];
        $objectNivel = Doctrine::getTable('NomNivelCargo')->find($objectData[0]['idnivelcargo']);
        $resultado['nivelcargo'] = $objectNivel->denominacion;
        $resultado['alias'] = $objectData[0]['alias'];


        if ($existeEscala) {
            if (is_numeric($objectData[0]['idnomcargo'])) {
                $objectNomCargo = Doctrine::getTable('NomCargo')->find($objectData[0]['idnomcargo']);
                $resultado['denominacion'] = $objectNomCargo->denominacion;
                $resultado['idnomcargo'] = $objectNomCargo->idnomcargo;
            }
            $salario = $objectData[0]['idsalario'];
            $salario = $objectData = Doctrine::getTable('NomSalario')->find($salario);
            $resultado['idsalario'] = $salario->idsalario;
            $objectNomGrupoComplejidad = Doctrine::getTable('NomGrupocomplejidad')->find(
                $salario->idgrupocomplejidad
            );
            $resultado['idgrupocomplejidad'] = $salario->idgrupocomplejidad;
            $resultado['grupocomplejidad'] = $objectNomGrupoComplejidad->denominacion;
            $resultado['salario']
                = $existeEscala[0]['NomTipoEscala']['abreviatura'] . ' - ' .
                $objectNomGrupoComplejidad->denominacion . ' - ' . $salario->salario;
            $resultado['tipoescala'] = $existeEscala[0]['NomTipoEscala']['denominacion'];
            $resultado['grupo_salario'] = $resultado['salario'];

            return $resultado;
        }

        return $resultado;
    }

    /**
     * @param $idConcepto
     * @param $objectData
     * @param $resultado
     * @param $isEstructura
     *
     * @return mixed
     */
    private function obtenerDatosEstructuras($idConcepto, $objectData, $resultado, $isEstructura)
    {

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $resultado['denominacion'] = $objectData->denominacion;
        $resultado['abreviatura'] = $objectData->abreviatura;
        $resultado['codigo'] = $objectData->codigo;
        $objectOrgano = Doctrine::getTable('NomOrgano')->findByDql(
            "idorgano = $objectData->idorgano AND idconcepto = $idConcepto"
        )->getFirst();
        $resultado['organo'] = $objectOrgano->denominacion;
        $resultado['idorgano'] = $objectData->idorgano;
        $resultado['idespecialidad'] = $objectData->idespecialidad;
        $resultado['idicono'] = $objectData->idicono;
        $resultado['iddpt'] = $objectData->iddpt;
        $resultado['codigonit'] = $objectData->codigonit;
        $resultado['codigonirc'] = $objectData->codigonirc;

        $denomespecialidad = "SELECT idespecialidad, idpadre, ordenizq, ordender, abrevespecialidad,
       denespecialidad, codespecialidad, nivel, fechaini, fechafin,
       controlmaterial
  FROM mod_datosmaestros.nom_especialidad WHERE  idespecialidad= $objectData->idespecialidad";

        $especialidaddenom = $conn->fetchAll($denomespecialidad);

        $resultado['especialidad'] = $especialidaddenom[0]['denespecialidad'];
        if ($isEstructura || $idConcepto == 5) {
            if ($idConcepto != 5) {
                $resultado['idtipoescala'] = $objectData->idtipoescala;


                $objectTipoEscala = Doctrine::getTable('NomTipoEscala')->findByDql(
                    "idtipoescala = $objectData->idtipoescala"
                )->getFirst();
                $resultado['tipoescala'] = $objectTipoEscala->denominacion;
            }
            $resultado = $this->asignarValores($objectData, $resultado);

            return $resultado;
        }


        return $resultado;
    }

    /**
     * @param $codigo
     * @param $denominacion
     * @param $idnomeav
     * @param $iddpa
     *
     * @internal param $sqlFiltro
     * @return string
     */
    public function buildSqlFiltro($codigo, $denominacion, $idnomeav, $iddpa)
    {
        $sqlFiltro = "";
        $sqlFiltro .= (is_numeric($idnomeav)) ? " AND (fila.idconcepto = $idnomeav)" : ' AND 1 = 1';
        $sqlFiltro .= (is_numeric($iddpa)) ? " AND (estructura.iddpt = $iddpa" : '';
        $sqlFiltro .= ($codigo) ? " AND (estructura.codigo = $codigo" : '';
        $sqlFiltro .= (is_string($denominacion) && $denominacion != '') ? "
        AND (lower(estructura.denominacion) LIKE lower('%$denominacion%')
        or lower(estructuraop.denominacion) LIKE lower('%$denominacion%')
        or lower(nomcvil.denominacion) LIKE lower('%$denominacion%'))" : '';

        return $sqlFiltro;
    }

    /**
     * @param $objectData
     * @param $resultado
     *
     * @return mixed
     */
    private function asignarValores($objectData, $resultado)
    {
        if (!empty($objectData->direccion)) {
            $resultado['direccion'] = $objectData->direccion;
        }
        if (!empty($objectData->telefono)) {
            $resultado['telefonos'] = $objectData->telefono;
        }
        if (!empty($objectData->fax)) {
            $resultado['fax'] = $objectData->fax;
        }
        if (!empty($objectData->objetosocial)) {
            $resultado['objetosocial'] = $objectData->objetosocial;
        }
        if (!empty($objectData->funcioneslegales)) {
            $resultado['funcioneslegales'] = $objectData->funcioneslegales;
        }
        if (!empty($objectData->correo)) {
            $resultado['correo'] = $objectData->correo;
        }
        if ($objectData->codigo) {
            $resultado['codigo'] = $objectData->codigo;
        }
        if (is_numeric($objectData->idicono)) {
            $modelIcon = Doctrine::getTable('NomIcono')->find($objectData->idicono);
            $resultado['nombre_imagen'] = $modelIcon->denominacion;
            $resultado['logo'] = $modelIcon->icono;
            $resultado['icono'] = $objectData->idicono;
        }
        //poner aqui los campos que faltan pa modificar
        if ($objectData->iddpt) {
            $dpa = MetadatosServices::getInstance()->dameDPT($objectData->iddpt);
            $resultado['iddpt'] = $objectData->iddpt;
            $resultado['ubicaciondpt'] = $dpa['denominacion'];

            return $resultado;
        }

        return $resultado;
    }

    /**
     * @param $i
     * @param $padres
     *
     * @return bool
     */
    private function validaCount($i, $padres)
    {
        return $i != 1 || $i == count($padres);
    }

    /**
     *  Descripción del método: Obtener las entidades de un dominio
     */
    public function dameEntidadesByDominio($iddominio, $permisos = false, $denominacion = false)
    {
        $cadena = "";
        if (is_array($permisos)) {
            $permisos = Util::getArrayByField($permisos, 'identidad');
            foreach ($permisos as $key => $permiso) {
                $cadena .= ($key == 0) ? "accesofila[$permiso] = 1::bit" : " AND accesofila[$permiso] = 1::bit";
            }
        }
        $query = Doctrine_Query::create();
        $query->select('f.idfila as id,f.*,e.denominacion as text,true as f.leaf ')->from('NomFilaestruc f')
            ->innerJoin(
                'f.DatEstructura e WITH e.idproyecto = 0'
            )->where("dominiofila[?] = 1::bit and f.idconcepto = 3 and f.fechafin is null", $iddominio);
        if (is_array($permisos) && count($permisos) > 0) {
            $query->addWhere("$cadena");
        }
        if (!is_bool($denominacion)) {
            $query->addWhere("e.denominacion ilike '%" . $denominacion . "%'");
        }
        $result = $query->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $result;
    }


    private function dameHijasUEB($idestructura = false)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $queryEntidad = "SELECT 
CASE WHEN de.denominacion is null THEN  dop.denominacion ELSE de.denominacion END as denominacion,
CASE WHEN de.denominacion is null THEN  'UEB' ELSE 'Entidad' END as tipoestructura,
CASE WHEN de.abreviatura is null THEN  dop.abreviatura ELSE de.abreviatura END as abreviatura,
CASE WHEN de.codigo is null THEN  dop.codigo ELSE de.codigo END as codigo,
 nfe.idfila as id
FROM 
  mod_estructuracomp.nom_filaestruc nfe LEFT JOIN 
  mod_estructuracomp.dat_estructura de ON(nfe.idfila = de.idestructura AND de.idproyecto=0)LEFT JOIN 
  mod_estructuracomp.dat_estructuraop dop ON(nfe.idfila = dop.idestructuraop AND dop.idproyecto=0)
WHERE 
  (dop.idorgano = -2) AND  nfe.fechafin IS  NULL ";

        if ($idestructura) {
            $queryEntidad .= " AND  nfe.parent_path operator (public.<@) (SELECT parent_path FROM mod_estructuracomp.nom_filaestruc WHERE idfila=?);";
            $resultEntidad = $conn->fetchAll($queryEntidad, array($idestructura));

        } else {
            $resultEntidad = $conn->fetchAll($queryEntidad);
        }


        return $resultEntidad;
    }

    public function dameHijasEntidadesoUEB($idestructura = false)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $queryEntidad = "SELECT 
CASE WHEN de.denominacion is null THEN  dop.denominacion ELSE de.denominacion END as denominacion,
CASE WHEN de.denominacion is null THEN  'UEB' ELSE 'Entidad' END as tipoestructura,
CASE WHEN de.abreviatura is null THEN  dop.abreviatura ELSE de.abreviatura END as abreviatura,
CASE WHEN de.codigo is null THEN  dop.codigo ELSE de.codigo END as codigo,
 nfe.idfila as id
FROM 
  mod_estructuracomp.nom_filaestruc nfe LEFT JOIN 
  mod_estructuracomp.dat_estructura de ON(nfe.idfila = de.idestructura AND de.idproyecto=0)LEFT JOIN 
  mod_estructuracomp.dat_estructuraop dop ON(nfe.idfila = dop.idestructuraop AND dop.idproyecto=0)
WHERE 
  ( nfe.idconcepto = 3) AND  nfe.fechafin IS  NULL ";

        if ($idestructura) {
            $queryEntidad .= " AND  nfe.parent_path operator (public.<@) (SELECT parent_path FROM mod_estructuracomp.nom_filaestruc WHERE idfila=?);";
            $resultEntidad = $conn->fetchAll($queryEntidad, array($idestructura));
        } else {
            $resultEntidad = $conn->fetchAll($queryEntidad);
        }

        if (empty($resultEntidad)) {
            $resultEntidad = $this->dameHijasUEB($idestructura);
        }

        return $resultEntidad;
    }

    public function dameHijasObras($idestructura = false)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $queryObras = "SELECT 
CASE WHEN dop.denominacion is null THEN  null ELSE dop.denominacion END as denominacion,
CASE WHEN dop.abreviatura is null THEN null  ELSE dop.abreviatura END as abreviatura,
CASE WHEN dop.codigo is null THEN null ELSE  dop.codigo END as codigo,
 nfe.idfila as id
FROM 
  mod_estructuracomp.nom_filaestruc nfe INNER JOIN
  mod_estructuracomp.dat_estructuraop dop ON(nfe.idfila = dop.idestructuraop AND dop.idproyecto=0)
WHERE 
  (dop.idorgano = -4) AND  nfe.fechafin IS  NULL";

        if ($idestructura) {
            $queryObras .= " AND  nfe.parent_path operator (public.<@) (SELECT parent_path FROM mod_estructuracomp.nom_filaestruc WHERE idfila=?);";
            $resultObras = $conn->fetchAll($queryObras, array($idestructura));
        } else {
            $resultObras = $conn->fetchAll($queryObras);
        }

        return $resultObras;
    }

    /**
     * Descripción del método: Obtener la ubicación estructural del cargo
     */
    public function obtenerUbicacion($npublico, $idorgano, $idnomcargo)
    {
        $resultado = $resultEntidad = $resultArea = $resultCargo = array();
        $identidad = $idarea = $idcargo = 0;
        $denominacion = "";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
//            BUSCAR ENTIDAD POR EL NÚMERO PÚBLICO  ($NPUBLICO)
        $queryEntidad
            = "SELECT f.idfila,f.parent_path,f.idconcepto FROM mod_estructuracomp.dat_estructura e
                              INNER JOIN mod_estructuracomp.nom_filaestruc f ON (e.idestructura = f.idfila)
                            WHERE e.idproyecto = 0 AND e.idproyecto = 0 AND e.codigo = '$npublico' AND e.idconcepto = 3
                            LIMIT 1";
        $resultEntidad = $conn->fetchAll($queryEntidad);
        if (count($resultEntidad) > 0) {
            $identidad = $resultEntidad[0]['idfila'];
            $parent_path = $resultEntidad[0]['parent_path'];
//                BUSCAR ÁREA QUE TENGA AL MENOS UN CARGO CON IDENTIFICADOR DE NOMENCLADOR ($IDNOMCARGO)
            $queryArea
                = "SELECT f.idfila FROM mod_estructuracomp.dat_estructuraop e
                                INNER JOIN mod_estructuracomp.nom_filaestruc f on (e.idestructuraop = f.idfila)
                                WHERE  e.idproyecto = 0 AND e.idorgano = $idorgano
                                AND (f.parent_path operator (public.<@) '$parent_path')
                                AND e.idestructuraop IN  (SELECT f.idpadre FROM mod_estructuracomp.dat_cargo c
                                INNER JOIN mod_estructuracomp.nom_filaestruc f on (c.idcargo = f.idfila)
                                WHERE c.idproyecto = 0 AND c.idnomcargo = $idnomcargo)
                                limit 1";
            $resultArea = $conn->fetchAll($queryArea);
            if (count($resultArea) > 0) {
                $idarea = $resultArea[0]['idfila'];
            } else {
//                    BUSCAR SI ES DIRECTO A LA ENTIDAD
                $queryAreaEntidad
                    = "SELECT f.idfila FROM mod_estructuracomp.dat_estructura e
                                INNER JOIN mod_estructuracomp.nom_filaestruc f on (e.idestructura = f.idfila)
                                WHERE  e.idproyecto = 0 AND e.idestructura = $identidad
                                AND e.idestructura IN  (SELECT f.idpadre FROM mod_estructuracomp.dat_cargo c
                                INNER JOIN mod_estructuracomp.nom_filaestruc f on (c.idcargo = f.idfila)
                                WHERE c.idproyecto = 0 AND c.idnomcargo = $idnomcargo)
                                limit 1";
                $resultArea = $conn->fetchAll($queryArea);
                if (count($resultArea) > 0) {
                    $idarea = $resultArea[0]['idfila'];
                }
            }
            if ($idarea != 0) {
                $queryCargo
                    = "SELECT f.idfila,cargo.denominacion FROM mod_estructuracomp.dat_cargo c
                                    INNER JOIN mod_estructuracomp.nom_filaestruc f on (c.idcargo = f.idfila)
                                    INNER JOIN mod_estructuracomp.nom_cargo cargo on (c.idnomcargo = cargo.idnomcargo)
                                    WHERE c.idproyecto = 0 AND c.idnomcargo = $idnomcargo AND
                                    f.idpadre = $idarea  limit 1";
                $resultCargo = $conn->fetchAll($queryCargo);
                if (count($resultCargo) > 0) {
                    $idcargo = $resultCargo[0]['idfila'];
                    $denominacion = $resultCargo[0]['denominacion'];
                }
            }
        }
        $resultado['identidad'] = $identidad;
        $resultado['idarea'] = $idarea;
        $resultado['idcargo'] = $idcargo;
        $resultado['denominacion'] = $denominacion;

        return $resultado;
    }

    //FUNCION QUE DEVUELVE LAS ENTIDADES, ORGANOS Y AGRUPACIONES DADO UN IDESTRUCTURA - Ing. Yadir Martinez Vergara

    /**
     * @param $idestructura
     *
     * @return array
     */
    public function obtenerEntidadesOrgAgrupporIdestructura($idestructura)
    {
        $iddominio = $this->global->Perfil->iddominio;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getConnection('metadatos');
        $query = Doctrine_Query::create($conn);
        $r = $query->select('nfe.parent_path')->from('NomFilaestruc nfe ')->where(
            "nfe.idfila = {$idestructura}"
        )->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
        if (count($r) > 0) {
            $parent_path = $r[0]['parent_path'];

            $mg1 = Doctrine_Manager::getInstance();
            $conn1 = $mg->getConnection('metadatos');
            $sql
                = "select de.idestructura, de.denominacion from mod_estructuracomp.nom_filaestruc nfe
                inner join mod_estructuracomp.dat_estructura de on (de.idestructura = nfe.idfila)
                where (nfe.parent_path operator (public.<@) '$parent_path') and (nfe.idconcepto = 3 or nfe.idconcepto = 1 or nfe.idconcepto = 2)  AND nfe.dominiofila[$iddominio] = '1'";
            $resultado = $conn->fetchAll($sql);

            return $resultado;
        } else {
            return array();
        }
    }

    /**
     * @return array
     */
    public function CargarIconosEAV()
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getConnection('metadatos');
        /* Ya no existe nom_nomencladoreavestruc, evoluciono en nom_concepto */
        //$sql = "select * from mod_estructuracomp.nom_nomencladoreavestruc;";
        $sql = "select * from mod_estructuracomp.nom_concepto;";

        return $conn->fetchAll($sql);
    }

    /**
     * @param $pId
     *
     * @return bool|Doctrine_Collection
     */
    public function getEstructuraXPorId($pId)
    {
        if (!is_numeric($pId)) {
            return false;
        }
        try {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getConnection('metadatos');
            $q = Doctrine_Query::create($conn);
            $consulta = $q->select(
                'e.idestructura as id,e.idpadre,e.denominacion as textestruct,e.abreviatura as abrev,e.idconcepto as idtipo, nn.idicono,e.idorgano,e.idnivelestr,e.idespecialidad,e.iddpt,e.codigo,e.version, no.denominacion as text'
            )->from('DatEstructura e')->innerJoin('e.NomOrgano no ')->innerJoin('e.NomConcepto nn ')->where(
                "e.idestructura = ?", array($pId)
            )->setHydrationMode(Doctrine:: HYDRATE_ARRAY)->execute();

            return $consulta;
        } catch (Doctrine_Exception $ee) {
            if (DEBUG_ERP) {
                echo(__FILE__ . ' ' . __LINE__ . ' ' . $ee->getMessage());
            }

            return false;
        }
    }

    //DEVUELVE todas los idestructuras hijas-arbol completo DADO UN IDESTRUCTURA POR DOMINIO- Ing. Yadir Martinez Vergara

    /**
     * @param $idestructura
     *
     * @return array|Doctrine_Collection
     */
    public function obtenerArrIdsEstructurasHijasArbolCompleto($idestructura)
    {
        $iddominio = $this->global->Perfil->iddominio;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getConnection('metadatos');
        $query = Doctrine_Query::create($conn);
        $r = $query->select('nfe.parent_path')->from('NomFilaestruc nfe ')->where(
            "nfe.idfila={$idestructura}"
        )->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
        if (count($r) > 0) {
            $parent_path = $r[0]['parent_path'];
            $sql
                = "select nfe.idfila as idestructura from mod_estructuracomp.nom_filaestruc nfe
                                        where (nfe.parent_path operator (public.<@) '$parent_path') AND nfe.dominiofila[{$iddominio}]='1' 
                                        AND nfe.fechafin is null;";
            $resultado = $conn->fetchAll($sql);
            $r = array();
            foreach ($resultado as $i => $a) {
                $r[] = $a['idestructura'];
            }

            return $r;
        } else {
            return array();
        }
    }

    private function reordenarHijos($conn, $idelemento)
    {
        /*if ($idelemento != FALSE) {
          $lft = $this->consecutivo;
          $this->consecutivo++;
        }

        $sql = "idpadre = '$idelemento' AND idpadre<>idfila";
        if ($idelemento == FALSE)
          $sql = "idpadre = idfila";

        // buscar todos sus hijos
        $sqlBuscarEstructuras = "SELECT idfila FROM mod_estructuracomp.nom_filaestruc WHERE $sql order by orden";
        $result               = $conn->fetchAll($sqlBuscarEstructuras);

        foreach ($result as $fila) {
          $idestructura = $fila['idfila'];

          if ($idestructura != FALSE)
            $this->reordenarHijos($conn, $idestructura);
        }

        // mandar a hacer funcion recursiva para cada uno de sus hijos
        if ($idelemento != FALSE) {
          //  poner el numero consecutivo en su derecho
          $rgt = $this->consecutivo;
          $this->consecutivo++;
          $sqlActualizar = "UPDATE mod_estructuracomp.nom_filaestruc set lft='$lft',rgt='$rgt' where idfila='$idelemento' ";
          $conn->fetchAll($sqlActualizar);
        }*/
        $sqlActualizar = "SELECT * FROM mod_estructuracomp.f_actualizar_parent_path_completo();";
        $conn->fetchAll($sqlActualizar);
    }


    function Actualizartree()
    {
        $this->consecutivo = 1;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $this->reordenarHijos($conn, FALSE);
        return TRUE;
    }

    public function dameHijosEstructuraCompleta(
        $idPadre, $organica = FALSE, $marcado = 0, $proyecto = 0, $incluyeInternos = TRUE, $excluirConceptos = FALSE, $isServicio = FALSE
    )
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $whereExcluir = ($excluirConceptos) ? implode(',', $excluirConceptos) : '0';
        $sqlQhere = "";


        // si se pide el arbol completo de estructuras
        $sqlQhere .= (is_numeric($idPadre) && $idPadre != 0) ? "fila.parent_path operator(public.<@) 
        (SELECT parent_path FROM mod_estructuracomp.nom_filaestruc   WHERE idfila= $idPadre) 
         AND fila.idfila<>fila.idpadre" : 'fila.idfila = fila.idpadre';


        $whereInternosFilaPadre = "";
        if (!$incluyeInternos) {
            $whereInternosFila = " AND (fila.idconcepto < 7 OR fila.idconcepto = 9)";
            $whereInternosFilaPadre = " AND (f.idconcepto < 7 OR f.idconcepto = 9)";
            $sqlQhere .= $whereInternosFila;
        }
        if (!is_numeric($idPadre) && $organica == TRUE) {
            $sqlQhere .= " AND fila.idconcepto = 2";
        }
        $marcar = "";
        if ($marcado) {
            $marcar = "true AS check,";
        }
        $sqlFiltroProyectoCargoMilitar = "";
        $sqlFiltroProyectoCargoCivil = "";
        if ($proyecto != 0 && is_numeric($proyecto)) { // tratamiento del proyecto
            $sqlFiltroProyectoEstructura
                = " AND ((estructura.idestado = 0 and estructura.modificado[$proyecto] = 0) " .
                "OR ( estructura.idproyecto = $proyecto))";
            $sqlFiltroProyectoEstructuraSQL
                = " AND ((e.idestado = 0 and e.modificado[$proyecto] = 0) " . "OR ( e.idproyecto = $proyecto))";
            $sqlFiltroProyectoEstructuraOP
                = " AND ((estructuraop.idestado = 0 and estructuraop.modificado[$proyecto] = 0) " .
                "OR ( estructuraop.idproyecto = $proyecto))";
            $sqlFiltroProyectoCargo
                = " AND ((cargo.idestado = 0 and cargo.idestado <> 3 and cargo.modificado[$proyecto] = 0) " .
                "OR ( cargo.idproyecto = $proyecto and cargo.idestado <> 3))";
            $sqlFiltroProyectoEstructuraLeaf
                = " AND ((e.idestado = 0 and e.modificado[$proyecto] = 0) " . "OR ( e.idproyecto = $proyecto))";
            $sqlFiltroProyectoEstructuraOPLeaf
                = " AND ((op.idestado = 0 and op.modificado[$proyecto] = 0) " . "OR ( op.idproyecto = $proyecto))";
            $sqlFiltroProyectoCargoLeaf
                = " AND ((ca.idestado = 0 and  cargo.idestado <> 3 and ca.modificado[$proyecto] = 0) " . "OR ( ca.idproyecto = $proyecto))";
            $sqlFiltroMedioLeaf
                = " AND ((m.idestado = 0 and m.modificado[$proyecto] = 0) " . "OR ( m.idproyecto = $proyecto))";
            $sqlFiltroProyectoCargoCivil = " AND cargo.idproyecto = cargociv.idproyecto";
            $sqlFiltroProyectoCargoMilitar = " AND cargo.idproyecto = cargom.idproyecto";
            $sqlFiltroMedio
                = " AND ((medio.idestado = 0 and medio.modificado[$proyecto] = 0) " .
                "OR ( medio.idproyecto = $proyecto))";

        } else {
            $sqlFiltroProyectoEstructura = " AND (idestado = 0 ) ";
            $sqlFiltroProyectoEstructuraSQL = " AND (idestado = 0 ) ";
            $sqlFiltroProyectoEstructuraOP = " AND (estructuraop.idestado = 0 ) ";
            $sqlFiltroProyectoCargo = " AND (cargo.idestado = 0 AND cargo.idestado<>3) ";
            $sqlFiltroMedio = " AND (medio.idestado = 0 ) ";
            $sqlFiltroProyectoEstructuraLeaf = " AND (e.idestado = 0 ) ";
            $sqlFiltroProyectoEstructuraOPLeaf = " AND (op.idestado = 0 ) ";
            $sqlFiltroProyectoCargoLeaf = " AND (ca.idestado = 0 AND cargo.idestado<>3) ";
            $sqlFiltroMedioLeaf = " AND ( m.idestado = 0 ) ";
        }
        $iddominio = $this->global->Perfil->iddominio;
        $militar
            = "
              SELECT i.icono
              FROM mod_estructuracomp.nom_icono AS i
              INNER JOIN mod_estructuracomp.nom_concepto AS con ON (con.idicono = i.idicono)
              WHERE con.idconcepto = 10
            ";
        $leafSql = "
              SELECT COUNT(f.idfila)
              FROM mod_estructuracomp.nom_filaestruc AS f
              LEFT JOIN mod_estructuracomp.dat_estructura e
                  ON ( e.idestructura = f.idfila $sqlFiltroProyectoEstructuraLeaf )
              LEFT JOIN mod_estructuracomp.dat_estructuraop op
                  ON ( op.idestructuraop = f.idfila $sqlFiltroProyectoEstructuraOPLeaf)
							LEFT JOIN mod_estructuracomp.dat_medio m
							    ON ( m.idmedio = f.idfila $sqlFiltroMedioLeaf)
							LEFT JOIN mod_estructuracomp.dat_cargo ca
							    ON ( ca.idcargo = f.idfila $sqlFiltroProyectoCargoLeaf)
							WHERE ( e.idestructura IS NOT NULL OR
							        op.idestructuraop IS NOT NULL OR
							        ca.idcargo IS NOT NULL OR
							        m.idmedio IS NOT NULL
							      ) AND f.idpadre = fila.idfila AND f.idpadre <> f.idfila $whereInternosFilaPadre
							        
            ";
        $sqlBus = "
        SELECT ' ' AS qtip, fila.idfila AS id,fila.idpadre AS _parent, fila.idconcepto, $marcar
                fila.orden,(($leafSql)=0) AS leaf,

                CASE
									WHEN estructura.denominacion <> '' THEN estructura.abreviatura
									WHEN estructuraop.denominacion <> '' THEN estructuraop.abreviatura
                                  WHEN nomcvil.denominacion <> '' THEN nomcvil.abreviatura
                                  WHEN nommedio.denominacion <> '' THEN nommedio.denominacion
								END AS abreviatura,

								CASE
									WHEN estructura.idestructura IS NOT NULL THEN estructura.iddpt
									else (
									   SELECT e.iddpt
									   FROM mod_estructuracomp.nom_filaestruc fe
									   INNER JOIN mod_estructuracomp.dat_estructura e ON (fe.idfila = e.idestructura)
									   WHERE fe.dominiofila [$iddominio]='1'
									          AND (fe.parent_path operator (public.@>) fila.parent_path)
									          AND fe.idconcepto = 3 $sqlFiltroProyectoEstructuraSQL
									   ORDER BY fe.parent_path DESC
									   LIMIT 1
									)
							  END AS iddpt,estructura.idespecialidad,
								CASE
									WHEN estructura.idestructura IS NOT NULL THEN estructura.idproyecto
									WHEN estructuraop.idestructuraop IS NOT NULL THEN estructuraop.idproyecto
									WHEN cargo.idcargo IS NOT NULL THEN cargo.idproyecto
									WHEN medio.idmedio IS NOT NULL THEN medio.idproyecto
								END AS idproyecto,

								CASE
									WHEN cargom.idcargo IS NOT NULL THEN 1 ELSE 0
								END AS esMilitar,

								CASE
									WHEN cargom.idcargo IS NOT NULL THEN 'Cargo militar' ELSE
									 nomeav.denominacion
								END AS tipo_concepto,
								CASE
									WHEN cargom.idcargo IS NOT NULL THEN 'Cargo militar' ELSE
									 nomeav.denominacion
								END AS nombretipo,

								CASE
									WHEN estructura.denominacion <> '' THEN estructura.idestado
									WHEN estructuraop.denominacion <> '' THEN estructuraop.idestado
                                    WHEN nomcvil.denominacion <> '' THEN cargo.idestado
                                    WHEN nommedio.denominacion <> '' THEN medio.idestado
								END AS estado,

								estructura.codigo,
								CASE
								  WHEN estructuraop.denominacion <> '' THEN true else false
								END AS interna,

								CASE
									WHEN nomcvil.denominacion <> '' THEN concat(nomcvil.denominacion,' ' || cargo.alias )
									WHEN estructura.denominacion <> '' THEN concat(estructura.denominacion,' ' || estructura.alias)
									WHEN estructuraop.denominacion <> '' THEN estructuraop.denominacion
									WHEN nommedio.denominacion <> '' THEN nommedio.denominacion
								END AS text,

								CASE
									WHEN nomcvil.denominacion <> '' THEN concat(nomcvil.denominacion,' ' || cargo.alias )
									WHEN estructura.denominacion <> '' THEN concat(estructura.denominacion,' ' || estructura.alias)
									WHEN estructuraop.denominacion <> '' THEN estructuraop.denominacion
									WHEN nommedio.denominacion <> '' THEN nommedio.denominacion
								END AS denominacion,

								CASE
									WHEN estructura.denominacion <> '' THEN estructura.idtipoescala
								END AS idtipoescala,

								CASE
									WHEN estructura.denominacion <> '' THEN te.denominacion
								END AS tipoescala,

								CASE
									WHEN nomcvil.denominacion <> '' THEN cargo.cantidad
									WHEN nommedio.denominacion <> '' THEN medio.cantidad
								END AS cantidad,

								CASE
									WHEN nomcvil.denominacion <> '' THEN cargo.cantidadreal
									WHEN nommedio.denominacion <> '' THEN medio.cantidadreal
								END AS cantidad_real,

								CASE
									WHEN estructura.codigo <> '' THEN estructura.codigo else ''
								END AS codigo,

								CASE
									WHEN nommedio.denominacion <> '' THEN nomtipomedio.idtipomedio
								END AS idtipomedio,

                CASE
                  WHEN cargom.idcargo IS NOT NULL THEN
                    ($militar)
                  WHEN medio.idicono IS NOT NULL THEN
                    im.icono
                  else
                    i.icono
                END AS icon,

                CASE
                  WHEN cargom.idcargo IS NOT NULL THEN
                    ($militar)
                  WHEN medio.idicono IS NOT NULL THEN
                    im.icono
                  else
                    i.icono
                END AS iconoorganigrama, fcr.idreferencia AS referencia, fcp.idfila AS referenciado,
                CASE
                 WHEN fila.idconcepto <=4 THEN sect.idsector
                 WHEN fila.idconcepto = 7 THEN sectc.idsector
                END AS idsector,
                CASE
                 WHEN fila.idconcepto <=4 THEN sect.denominacion
                 WHEN fila.idconcepto = 7 THEN sectc.denominacion
                END AS sector,cargo.principal,cargo.jefebrigada,
                
                cargo.idpreparacion,
                                  preparacion.denominacion AS preparacion,
                                  preparacion.abreviatura AS abrev_preparacion,

                                  cargo.idespecialidadpreparacion as idespecialidad_preparacion,
                                  cargo.idespecialidadempleo as idespecialidad_empleo,
                                  cargo.idespecialidadempleo as idespecialidad_empleo,

                                  cargociv.idcategocup as idcategocup,
				                  categocup.orden as ordencatg,
                                  categocup.denominacion AS categocup,
                                  categocup.abreviatura AS abrev_categocup,
                                  
                                  grupocomplejidad.denominacion AS grupocomplejidad,
                                  grupocomplejidad.idgrupocomplejidad AS idgrupocomplejidad
                            
							FROM mod_estructuracomp.nom_filaestruc fila
							INNER JOIN mod_estructuracomp.nom_concepto nomeav
							    ON fila.idconcepto = nomeav.idconcepto
              INNER JOIN mod_estructuracomp.nom_icono i
                  ON i.idicono = nomeav.idicono
              LEFT JOIN mod_estructuracomp.dat_filacortada fcr
                  ON fcr.idfila = fila.idfila and fcr.idproyecto = $proyecto
              LEFT JOIN mod_estructuracomp.dat_filacortada fcp
                  ON fcp.idreferencia = fila.idfila and fcp.idproyecto = $proyecto
              LEFT JOIN mod_estructuracomp.dat_estructura estructura
                  ON ( estructura.idestructura = fila.idfila $sqlFiltroProyectoEstructura )
              LEFT JOIN mod_estructuracomp.nom_sector sect 
                  ON estructura.idsector = sect.idsector    
              LEFT JOIN mod_estructuracomp.nom_tipoescala te
                  ON ( estructura.idtipoescala = te.idtipoescala)
              LEFT JOIN mod_estructuracomp.nom_organo orgest
                  ON ( orgest.idorgano = estructura.idorgano AND orgest.idconcepto = fila.idconcepto  )
              LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop
                  ON ( estructuraop.idestructuraop = fila.idfila $sqlFiltroProyectoEstructuraOP)
							LEFT JOIN mod_estructuracomp.nom_organo orgestop
							    ON ( orgestop.idorgano = estructuraop.idorgano AND orgestop.idconcepto = fila.idconcepto  )
              LEFT JOIN mod_estructuracomp.dat_medio medio
                  ON ( medio.idmedio = fila.idfila $sqlFiltroMedio)
							LEFT JOIN mod_estructuracomp.nom_icono im
							    ON im.idicono = medio.idicono
							LEFT JOIN mod_estructuracomp.nom_tipomedio nomtipomedio
							    ON ( nomtipomedio.idtipomedio = medio.idtipomedio )
							LEFT JOIN mod_datosmaestros.nom_indicador nommedio
							    ON ( nommedio.idindicador = medio.idnommedio )
              LEFT JOIN mod_estructuracomp.dat_cargo cargo
                  ON ( cargo.idcargo = fila.idfila $sqlFiltroProyectoCargo)
                  LEFT JOIN mod_estructuracomp.nom_sector sectc 
                  ON cargo.idsector = sectc.idsector
							LEFT JOIN mod_estructuracomp.dat_cargocivil cargociv
							    ON (cargo.idcargo = cargociv.idcargo AND cargo.idproyecto = cargociv.idproyecto)
							LEFT JOIN mod_estructuracomp.dat_cargomilitar cargom
							    ON (cargo.idcargo = cargom.idcargo AND cargo.idproyecto = cargom.idproyecto)
							LEFT JOIN mod_estructuracomp.nom_cargo nomcvil
							    ON ( cargo.idnomcargo = nomcvil.idnomcargo )
							
                            LEFT JOIN mod_estructuracomp.nom_preparacion preparacion
                                  on (cargo.idpreparacion = preparacion.idpreparacion)
                            LEFT JOIN mod_estructuracomp.nom_salario salario
                                  on (cargo.idsalario = salario.idsalario)
                            LEFT JOIN mod_estructuracomp.nom_grupocomplejidad grupocomplejidad
                                  on (salario.idgrupocomplejidad = grupocomplejidad.idgrupocomplejidad)
                            
                            LEFT JOIN mod_estructuracomp.nom_categocup categocup
                                  ON (cargociv.idcategocup = categocup.idcategocup)
                            LEFT JOIN mod_estructuracomp.nom_categoria categoria
                                  ON (categocup.idcategoria = categoria.idcategoria)
                            LEFT JOIN mod_estructuracomp.dat_cargomilitar cm
                                  ON (cargo.idcargo = cm.idcargo AND cargo.idproyecto = cm.idproyecto)
                            LEFT JOIN mod_estructuracomp.nom_grado grado
                                  ON (cm.idgrado = grado.idgrado)
						     
							where fila.fechafin IS NULL AND fila.idconcepto NOT IN ($whereExcluir) AND
							(estructura.denominacion <> '' OR estructuraop.denominacion <> ''
							           OR nomcvil.denominacion <> '' OR nommedio.denominacion <> '') AND
							$sqlQhere

							AND fila.dominiofila[$iddominio] = 1 :: bit AND fila.fechafin IS NULL
							ORDER BY fila.ordenunico";

        $arregloPermiso = $conn->fetchAll($sqlBus);

        if (!$isServicio) {
            foreach ($arregloPermiso AS $index => $datos) {
                $dpa = MetadatosServices::getInstance()->dameRutaDPT($datos['iddpt']);
                if (isset($datos['idespecialidad']) && !empty($datos['idespecialidad'])) {
                    $esp = MetadatosServices::getInstance()->dameEspecialidad($datos['idespecialidad']);
                    if (count($esp[0]) > 0) {
                        $arregloPermiso[$index]['especialidad'] = $esp[0]->denespecialidad;
                    }
                }
                $division_politica = array();
                foreach ($dpa AS $value) {
                    $division_politica[0] = $value['denominacion'];

                }
                $arregloPermiso[$index]['dpa'] = $division_politica;

            }
        }
        return $arregloPermiso;
    }
}
