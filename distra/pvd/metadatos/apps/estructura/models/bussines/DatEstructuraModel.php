<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class DatEstructuraModel extends ZendExt_Model
{
    /**
     * CONSTRUCTOR
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->estructura = new EstructuraModel();
    }

    public function damePlantillasPorProyecto($idProyecto = FALSE)
    {
        $query   = Doctrine_Query::create();
        $whereIn = 'e.idestado = 0';
        if (is_numeric($idProyecto)) {
            $whereIn = " ((e.idestado = 0 and e.modificado [$idProyecto]= 0) " .
                "OR ( e.idproyecto = $idProyecto AND e.idestado<>3))";
        }
        $result = $query->select('e.idestructura, e.idtipoescala')->from('DatEstructura e')->where($whereIn)->andWhere(
                        "e.idconcepto = 3 OR e.idconcepto = 4"
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    private function buscarDatosEstructura($estructura, $proyecto = FALSE)
    {
        $organos = array();
        foreach ($estructura as $valor) {
            if ($valor['idconcepto'] <= 6) {
                $cargos          = $this->dameCargosInEstructura($valor['id'], $proyecto);
                $cargosDirectos  = $cargos['directos'];
                $cargosGenerales = $cargos['general'];
                $medios          = $this->dameMediosInEstructura($valor['id'], $proyecto);
                foreach ($medios as $index => $medio) {
                    $medios[$index] = $this->estructura->obtenerDatos($medio['idmedio'], 9, $proyecto);
                }
                if ($this->verificaCantidades($cargosDirectos, $medios)) {
                    $organos[] = array(
                        'denominacion' => $valor['denominacion'], 'id' => $valor['id'], 'idpadre' => $valor['_parent'],
                        'cargos'       => $cargosDirectos, 'medios' => $medios);
                } else {
                    if ($this->verificaCantidades($cargosGenerales, $medios)) {
                        $organos[] = array(
                            'denominacion' => $valor['denominacion'], 'id' => $valor['id'],
                            'idpadre'      => $valor['_parent'], 'cargos' => $cargosGenerales, 'medios' => $medios);
                    }
                }
                $estructuraInterna = $this->estructura->dameHijosEstructura($valor['id'], FALSE, 0, $proyecto);
                $organos           = $this->consArrayOrganos($proyecto, $estructuraInterna, $organos);
            }
        }
        return $organos;
    }

    public function damePadresEntidades($idestructura, $idproyecto = FALSE, $isEntidad = FALSE)
    {
        $where          = "nfe.idfila = {$idestructura}";
        $select         = "nfe.parent_path";
        $iddominio      = $this->global->Perfil->iddominio;
        $query          = Doctrine_Query::create();
        $r              = $query->select($select)->from('NomFilaestruc nfe ')->where($where)->setHydrationMode(
                                Doctrine::HYDRATE_ARRAY
        )->execute();
        $whereCondicion = "fila.idfila  = $idestructura";
        if ($isEntidad) {
            $whereCondicion = "(fila.idconcepto = 3 OR fila.idconcepto = 4)";
        }
        if (count($r) > 0) {
            $parent_path = $r[0]['parent_path'];
            $whereWith = '1=1';
            if (is_numeric($idproyecto)) {
                $whereWith = "((de.idproyecto = $idproyecto AND de.idestado <> 3)";
                $whereWith .= " OR (de.idproyecto=0 AND de.modificado [$idproyecto]=0))";
            }
            $resultado = $query->select(
                               "(
                                   SELECT f2.nivel
                                   FROM NomFilaestruc f2
                                   WHERE f2.idfila = fila.idpadre
                               ) as nivelPadre,
                               fila.idfila,o.denominacion as tipo, de.iddpt as iddpt,
                               de.idestructura as idestructura,
                               de.denominacion as denominacion,
                               de.codigo as codigo,
                               ((  SELECT COUNT(filaCargos.idfila)
                               FROM NomFilaestruc filaCargos
                               WHERE   filaCargos.idconcepto = 7 AND
                               filaCargos.parent_path operator (public.<@) fila.parent_path AND
                               (
                               SELECT filaPlantilla.idfila
                               FROM NomFilaestruc filaPlantilla
                               WHERE   (filaPlantilla.idconcepto = 3 OR filaPlantilla.idconcepto = 4) AND
                               filaPlantilla.parent_path operator (public.@>) filaCargos.parent_path
                               ORDER BY filaPlantilla.parent_path DESC
                               LIMIT 1
                               ) = fila.idfila)>0
                               ) AS tieneCargos,
                               (   SELECT filaIdPlantilla.idfila
                               FROM NomFilaestruc filaIdPlantilla
                               WHERE   (filaIdPlantilla.idconcepto = 3 OR filaIdPlantilla.idconcepto = 4) AND
                                filaIdPlantilla.parent_path operator (public.@>) fila.parent_path
                                 ORDER BY filaIdPlantilla.parent_path DESC
                               LIMIT 1
                               ) AS plantillaPadre"
            )->from('NomFilaestruc fila')->innerJoin('fila.DatEstructura de')->innerJoin(
                               'de.NomOrgano o WITH o.idconcepto = de.idconcepto AND o.idorgano = de.idorgano'
                )->where("fila.fechafin is null AND fila.parent_path operator (public.<@) '$parent_path'")->andWhere(
                               $whereCondicion
                )->andWhere("fila.dominiofila [$iddominio] = '1'")->andWhere($whereWith)->orderBy(
                               'nivelPadre,fila.nivel'
                )->execute();
            foreach ($resultado as $index => $datos) {
                $dpa              = MetadatosServices::getInstance()->dameRutaDPT($datos['iddpt'], TRUE);
                $divisionPolitica = array();
                foreach ($dpa as $value) {
                    $divisionPolitica[$value['concepto']] = $value['denominacion'];
                }
                $resultado[$index]['dpa'] = $divisionPolitica;
            }
            return $resultado;
        } else {
            return array();
        }
    }

    public function dameMediosInEstructura($idEstructura, $idProyecto = FALSE)
    {
        $iddominio = $this->global->Perfil->iddominio;
        $mg        = Doctrine_Manager::getInstance();
        $conn      = $mg->getCurrentConnection();
        $query     = Doctrine_Query::create($conn);
        $r         = $query->select('nfe.lft, nfe.rgt')->from('NomFilaestruc nfe ')->where(
                           "nfe.fechafin is null AND nfe.idfila = {$idEstructura}"
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        if (count($r) > 0) {
            $izq       = $r[0]['lft'];
            $der       = $r[0]['rgt'];
            $whereWith = 'medio.idestado = 0';
            if (is_numeric($idProyecto) && $idProyecto != 0) {
                $whereWith = "(medio.idproyecto = $idProyecto AND medio.idestado<>0 AND medio.idestado<>3)";
            }
            $sql       = "
                      SELECT medio.idmedio
                      FROM mod_estructuracomp.nom_filaestruc nfe
						          INNER JOIN mod_estructuracomp.dat_medio medio on (medio.idmedio = nfe.idfila)
						          WHERE nfe.fechafin is null AND (nfe.idpadre = {$idEstructura} OR (nfe.lft > {$izq}
						          AND nfe.rgt < {$der})) AND nfe.dominiofila[$iddominio] = '1' AND $whereWith";
            $resultado = $conn->fetchAll($sql);
            return $resultado;
        } else {
            return array();
        }
    }

    public function dameCargosInEstructuraOld($idEstructura, $idProyecto = FALSE, $nomilitares = FALSE)
    {

        $iddom            = $this->global->Perfil->iddominio;
        $mg               = Doctrine_Manager::getInstance();
        $conn             = $mg->getCurrentConnection();
        $query            = Doctrine_Query::create();
        $wWith            = 'cargo.idestado = 0';
        $whereWithEntidad = 'e.idestado = 0';
        if ($this->validaIdProyecto($idProyecto)) {
            $wWith
                = "((cargo.idestado = 0 AND cargo.modificado [$idProyecto]=0) " .
                "OR (cargo.idproyecto = $idProyecto AND (cargo.idestado<>0 AND cargo.idestado<>3)))";
            $whereWithEntidad
                = "((e.idestado = 0 AND e.modificado [$idProyecto]=0) " .
                "OR (e.idproyecto = $idProyecto AND (e.idestado<>0 AND e.idestado<>3)))";
        }
        $where = '1=1';
        $where = $this->excluirMilitares($nomilitares, $where);
        $sqlOrdenPadre
               = "
        (SELECT filap.nivel
        FROM mod_estructuracomp.nom_filaestruc filap
        WHERE filap.idfila = nfe.idpadre) AS nivelPadre";
        $wWith .= (is_numeric($idProyecto)) ? ' AND cargo.temporal = 0' : '';
        $sql    = "
                               SELECT
                                  cargo.idcargo,
                                  cargo.idcargo as id,
                                  cargo.idnomcargo,
                                  nomcargo.denominacion AS denominacion,
                                  norma.denominacion AS normajuridica,

                                  cargo.cantidad,
                                  cargo.cantidadreal as cantidad_real,

                                  cargo.idpreparacion,
                                  preparacion.denominacion AS preparacion,
                                  preparacion.abreviatura AS abrev_preparacion,

                                  cargo.idespecialidadpreparacion as idespecialidad_preparacion,
                                  cargo.idespecialidadempleo as idespecialidad_empleo,
                                  cargo.idespecialidadempleo as idespecialidad_empleo,

                                  cc.idcategocup as idcategocup,
                                  categocup.denominacion AS categocup,
                                  categocup.abreviatura AS abrev_categocup,

                                  categoria.denominacion AS categoria,
                                  categoria.abreviatura AS abrev_categoria,

                                  grupocomplejidad.denominacion AS grupocomplejidad,
                                  grupocomplejidad.idgrupocomplejidad AS idgrupocomplejidad,

                                  salario.salario AS salario,
                                  CONCAT(grupocomplejidad.denominacion,CONCAT(' - ',salario.salario)) AS grupo_salario,

                                  cm.idgrado as idgrado,
                                  grado.denominacion as grado,
                                  grado.abreviatura as abrev_grado,

                                  (SELECT e.idtipoescala
                                   FROM mod_estructuracomp.nom_filaestruc fila
                                   INNER JOIN mod_estructuracomp.dat_estructura e
                                      ON (e.idestructura = fila.idfila AND $whereWithEntidad)
                                   WHERE fila.fechafin is null AND (fila.idconcepto = 3 OR fila.idconcepto = 4) AND
                                     (fila.parent_path operator (public.@>) nfe.parent_path)
                                   LIMIT 1
                                  ) as idtipoescala,
                                  $sqlOrdenPadre
                               FROM mod_estructuracomp.nom_filaestruc nfe
                               INNER JOIN mod_estructuracomp.dat_cargo cargo
                                  on (cargo.idcargo = nfe.idfila)
                               LEFT JOIN mod_estructuracomp.nom_cargo nomcargo
                                  on (cargo.idnomcargo = nomcargo.idnomcargo)

                               LEFT JOIN mod_estructuracomp.nom_normajuridica norma
                                  on (norma.idnormajuridica = nomcargo.idnormajuridica)

                               LEFT JOIN mod_estructuracomp.nom_preparacion preparacion
                                  on (cargo.idpreparacion = preparacion.idpreparacion)
                               LEFT JOIN mod_estructuracomp.nom_salario salario
                                  on (cargo.idsalario = salario.idsalario)
                               LEFT JOIN mod_estructuracomp.nom_grupocomplejidad grupocomplejidad
                                  on (salario.idgrupocomplejidad = grupocomplejidad.idgrupocomplejidad)
                               LEFT JOIN mod_estructuracomp.dat_cargocivil cc
                                  ON (cargo.idcargo = cc.idcargo AND cargo.idproyecto = cc.idproyecto)
                               LEFT JOIN mod_estructuracomp.nom_categocup categocup
                                  ON (cc.idcategocup = categocup.idcategocup)
                               LEFT JOIN mod_estructuracomp.nom_categoria categoria
                                  ON (categocup.idcategoria = categoria.idcategoria)
                               LEFT JOIN mod_estructuracomp.dat_cargomilitar cm
                                  ON (cargo.idcargo = cm.idcargo AND cargo.idproyecto = cm.idproyecto)
                               LEFT JOIN mod_estructuracomp.nom_grado grado
                                  ON (cm.idgrado = grado.idgrado)
                               ";
      // die($sql);
        $cargos = array();
        $sqlNF
                    = "
        (
          (
            SELECT count(fila.idfila)
            FROM mod_estructuracomp.nom_filaestruc fila
            WHERE (fila.idconcepto = 8) AND (fila.parent_path operator (public.@>) nfe.parent_path)
          ) = 0
        )
      ";
        $wDirecto   = $where . " AND nfe.idpadre = $idEstructura";
        $sqlDirecto = $sql .
            " WHERE $wDirecto AND nfe.fechafin is null AND nfe.dominiofila [$iddom] = 1::bit AND $wWith AND $sqlNF";
        $sqlDirecto .= " ORDER BY nivelPadre, nfe.nivel";
        $resultado          = $conn->fetchAll($sqlDirecto);
        $cargos['directos'] = $resultado;
        $r                  = $query->select('nfe.parent_path')->from('NomFilaestruc nfe ')->where(
                                    "nfe.idfila = {$idEstructura}"
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        if (count($r) > 0) {
            $parent_path = $r[0]['parent_path'];
            $wGen       = $where . " AND (nfe.idpadre = $idEstructura OR (nfe.parent_path operator (public.<@) '$parent_path'))";
            $sqlGeneral = $sql .
                " WHERE $wGen AND nfe.fechafin is null AND  nfe.dominiofila [$iddom] = 1::bit AND $wWith AND $sqlNF";
            $sqlGeneral .= " ORDER BY nivelPadre, nfe.nivel";
            $resultado        = $conn->fetchAll($sqlGeneral);
            $cargosResultados = array();
            if (count($resultado) > 0) {
                foreach ($resultado as $cargo) {
                    if (is_numeric($cargo['idtipoescala'])) {
                        $cargosResultados[] = $cargo;
                    }
                }
            }
            $cargos['general'] = $cargosResultados;
        } else {
            $cargos['general'] = array();
        }

        return $cargos;
    }

    public function dameCargosInEstructura(
        $idEstructura, $idProyecto = false, $nomilitares = false, $dominio = false
    )
    { 
        $iddominio = $this->global->Perfil->iddominio;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = Doctrine_Query::create();
        $whereWith = 'cargo.idestado = 0';
        $whereWithEntidad = 'e.idestado = 0';
        if (is_numeric($idProyecto) && $idProyecto != 0) {
            $whereWith
                = "((cargo.idestado = 0 AND cargo.modificado [$idProyecto]=0) " .
                "OR (cargo.idproyecto = $idProyecto AND (cargo.idestado<>0 AND cargo.idestado<>3)))";
            $whereWithEntidad
                = "((e.idestado = 0 AND e.modificado [$idProyecto]=0) " .
                "OR (e.idproyecto = $idProyecto AND (e.idestado<>0 AND e.idestado<>3)))";
        }
        $where = '1=1';
        if ($nomilitares) {
            $where
                = 'cargo.idcargo NOT IN(
                SELECT cargom.idcargo
                FROM mod_estructuracomp.dat_cargomilitar cargom
            )';
        }

        $sqlOrdenPadre = "
        (SELECT filap.nivel
        FROM mod_estructuracomp.nom_filaestruc filap
        WHERE filap.idfila = nfe.idpadre) AS nivelPadre
      ";
        $whereWith .= (is_numeric($idProyecto)) ? ' AND cargo.temporal = 0' : '';
        $sql = "
                               SELECT DISTINCT nfe.nivel,
                                  cargo.idcargo,
                                  cargo.idcargo as id,
                                  cargo.idnomcargo,
                                  nomcargo.denominacion AS denominacion,

                                  cargo.cantidad,
                                  cargo.cantidadreal as cantidad_real,

                                  cargo.idpreparacion,
                                  preparacion.denominacion AS preparacion,
                                  preparacion.abreviatura AS abrev_preparacion,

                                  cargo.idespecialidadpreparacion as idespecialidad_preparacion,
                                  cargo.idespecialidadempleo as idespecialidad_empleo,
                                  cargo.idespecialidadempleo as idespecialidad_empleo,

                                  cc.idcategocup as idcategocup,
				                  categocup.orden as ordencatg,
                                  categocup.denominacion AS categocup,
                                  categocup.abreviatura AS abrev_categocup,

                                  categoria.denominacion AS categoria,
                                  categoria.abreviatura AS abrev_categoria,

                                  grupocomplejidad.denominacion AS grupocomplejidad,
                                  grupocomplejidad.idgrupocomplejidad AS idgrupocomplejidad,

                                  salario.salario AS salario,
                                  CONCAT(grupocomplejidad.denominacion,CONCAT(' - ',salario.salario)) AS grupo_salario,

                                  cm.idgrado as idgrado,
                                  grado.denominacion as grado,
                                  grado.abreviatura as abrev_grado,

                                  (SELECT e.idtipoescala
                                   FROM mod_estructuracomp.nom_filaestruc fila
                                   INNER JOIN mod_estructuracomp.dat_estructura e
                                      ON (e.idestructura = fila.idfila AND $whereWithEntidad)
                                   WHERE fila.fechafin is null AND (fila.idconcepto = 3 OR fila.idconcepto = 4) AND
                                      (fila.parent_path operator (public.@>) nfe.parent_path)
                                   LIMIT 1
                                  ) as idtipoescala,
                                  $sqlOrdenPadre
                               FROM mod_estructuracomp.nom_filaestruc nfe
                               INNER JOIN mod_estructuracomp.dat_cargo cargo
                                  on (cargo.idcargo = nfe.idfila)
                               LEFT JOIN mod_estructuracomp.nom_cargo nomcargo
                                  on (cargo.idnomcargo = nomcargo.idnomcargo)
                               LEFT JOIN mod_estructuracomp.nom_preparacion preparacion
                                  on (cargo.idpreparacion = preparacion.idpreparacion)
                               LEFT JOIN mod_estructuracomp.nom_salario salario
                                  on (cargo.idsalario = salario.idsalario)
                               LEFT JOIN mod_estructuracomp.nom_grupocomplejidad grupocomplejidad
                                  on (salario.idgrupocomplejidad = grupocomplejidad.idgrupocomplejidad)
                               LEFT JOIN mod_estructuracomp.dat_cargocivil cc
                                  ON (cargo.idcargo = cc.idcargo AND cargo.idproyecto = cc.idproyecto)
                               LEFT JOIN mod_estructuracomp.nom_categocup categocup
                                  ON (cc.idcategocup = categocup.idcategocup)
                               LEFT JOIN mod_estructuracomp.nom_categoria categoria
                                  ON (categocup.idcategoria = categoria.idcategoria)
                               LEFT JOIN mod_estructuracomp.dat_cargomilitar cm
                                  ON (cargo.idcargo = cm.idcargo AND cargo.idproyecto = cm.idproyecto)
                               LEFT JOIN mod_estructuracomp.nom_grado grado
                                  ON (cm.idgrado = grado.idgrado)
                               ";
        $cargos = array();
        $sqlNoFormales = "
        (
          (
            SELECT count(fila.idfila)
            FROM mod_estructuracomp.nom_filaestruc fila
            WHERE (fila.idconcepto = 8) AND (fila.parent_path operator (public.@>) nfe.parent_path)
          ) = 0
        )
      ";
        $whereDirecto = "";
        $whereGeneral = "";

        if(is_array($idEstructura)) {
            foreach ($idEstructura as $index => $idrow) {
                $r = $query->select('nfe.parent_path')->from('NomFilaestruc nfe ')->where(
                    "nfe.idfila = {$idrow}"
                )->addWhere("nfe.fechafin IS NULL")->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
                if (count($r) > 0) {
                    $parent_path = $r[0]['parent_path'];
                    if ($index != 0){
                        $whereGeneral .= " OR ";
                        $whereDirecto .= " OR ";
                    }

                    $whereGeneral .= "(nfe.parent_path operator (public.<@) '$parent_path')";
                    $whereDirecto .= "(nfe.idpadre =  $idrow)";

                }
            }

            $whereGeneral = $where . " AND ($whereGeneral)";
            $whereDirecto = $where . " AND ($whereDirecto)";
        }else{
            $r = $query->select('nfe.parent_path')->from('NomFilaestruc nfe ')->where(
                "nfe.idfila = {$idEstructura}"
            )->addWhere("nfe.fechafin IS NULL")->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            if (count($r) > 0) {
                $parent_path = $r[0]['parent_path'];
                if ($index != 0){
                    $whereDirecto .= " OR ";
                    $whereGeneral .= " OR ";
                }

                $whereGeneral .= "(nfe.parent_path operator (public.<@) '$parent_path')";
                $whereDirecto .= "(nfe.idpadre =  $idEstructura)";
            }
            $whereGeneral = $where . " AND ($whereGeneral)";
            $whereDirecto = $where . " AND ($whereDirecto)";
        }
        $sqlDirecto = $sql . " WHERE $whereDirecto AND nfe.fechafin is null AND nfe.dominiofila [$iddominio] = 1::bit AND $whereWith AND $sqlNoFormales";
        $sqlDirecto .= " ORDER BY nivelPadre, nfe.nivel";

        $resultado = $conn->fetchAll($sqlDirecto);
        $cargos['directos'] = $resultado;

        //if ($whereDirecto!="") {
        if ($whereGeneral!="") {
            $sqlGeneral = $sql . " WHERE $whereGeneral AND nfe.fechafin is null AND  nfe.dominiofila [$iddominio] = 1::bit AND $whereWith AND $sqlNoFormales";
            $sqlGeneral .= " ORDER BY denominacion,nivelPadre, nfe.nivel";

            $resultado = $conn->fetchAll($sqlGeneral);
            $cargosResultados = array();
            if (count($resultado) > 0) {
                foreach ($resultado as $cargo) {
                    if (is_numeric($cargo['idtipoescala'])) {
                        $cargosResultados[] = $cargo;
                    }
                }
            }
            $cargos['general'] = $cargosResultados;
        } else {
            $cargos['general'] = array();
        }

        return $cargos;
    }

    public function dameCargosResumenPersonal($arrayIdEstructura, $config)
    {
        $idProyecto  = $config['idproyecto'];
        $nomilitares = $config['militares'];
        $cargos      = array();
        foreach ($arrayIdEstructura as $ids) {
            $cargosTemp = $this->dameCargosInEstructura($ids, $idProyecto, $nomilitares);
            $cargos     = array_merge($cargos, $cargosTemp['general']);
        }
        $resultado = array(
            'resumen' => Util::construirTablaCategoria($cargos),
            'tabla'   => Util::arrayTablaCargos($cargos, $nomilitares));
        return $resultado;
    }

    public function dameDatosReporteCargos($idestructuras, $proyecto)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $conn->commit();
        $conn->beginTransaction();
        $estructuraModel     = new EstructuraModel();
        $categoriasGenerales = array();
        $gradosGenerales     = array();
        $datosPlantilla      = array();
        $plantillas          = $this->damePadresEntidades($idestructuras, $proyecto);
        foreach ($plantillas as $value) {
            if ($value['tieneCargos']) {
                $arrayCategorias = array();
                $arrayGrados     = array();
                $datos           = $this->dameCargosInEstructura($value['idestructura'], $proyecto);
                $datos           = $datos['general'];
                foreach ($datos as $index => $cargo) {
                    $datos[$index] = $estructuraModel->obtenerDatos($cargo['idcargo'], 7, $proyecto);
                }
                foreach ($datos as $categoGrados) {
                    if ($categoGrados['idgrado']) {
                        $pos = Util::buscarExistencia($gradosGenerales, $categoGrados['abrev_grado']);
                        if (is_bool($pos)) {
                            $gradosGenerales[] = array('denominacion' => $categoGrados['abrev_grado']);
                        }
                        $posGrado = Util::buscarExistencia($arrayGrados, $categoGrados['abrev_grado']);
                        if (!is_numeric($posGrado)) {
                            $arrayGrados[] = array('denominacion' => $categoGrados['abrev_grado'], 'cantidad' => 1);
                        } else {
                            $arrayGrados[$posGrado]['cantidad'] += 1;
                        }
                    } else {
                        $pos = Util::buscarExistencia($categoriasGenerales, $categoGrados['abrev_categocup']);
                        if (is_bool($pos)) {
                            $categoriasGenerales[] = array('denominacion' => $categoGrados['abrev_categocup']);
                        }
                        $posCategoria = Util::buscarExistencia($arrayCategorias, $categoGrados['abrev_categocup']);
                        if (!is_numeric($posCategoria)) {
                            $arrayCategorias[] = array(
                                'denominacion' => $categoGrados['abrev_categocup'], 'cantidad' => 1);
                        } else {
                            $arrayCategorias[$posCategoria]['cantidad'] += 1;
                        }
                    }
                }
                $resumen          = array(
                    'entidad' => $value['denominacion'], 'categorias' => $arrayCategorias, 'grados' => $arrayGrados);
                $datosPlantilla[] = $resumen;
            }
        }
        $widthCategoria = 0;
        $widthGrados    = 0;
        foreach ($categoriasGenerales as $categoria) {
            if (strlen($categoria['denominacion']) > $widthCategoria) {
                $widthCategoria = strlen($categoria['denominacion']);
            }
        }
        foreach ($gradosGenerales as $grados) {
            if (strlen($grados['denominacion']) > $widthGrados) {
                $widthGrados = strlen($grados['denominacion']);
            }
        }
        $datosPlantilla['datos']          = array(
            'categorias' => $categoriasGenerales, 'grados' => $gradosGenerales);
        $datosPlantilla['datos']['width'] = array('categorias' => $widthCategoria * 3, 'grados' => $widthGrados * 3);
        if ($proyecto) {
            $dataProyecto               = Doctrine::getTable('DatProyecto')->find($proyecto);
            $datosPlantilla['proyecto'] = $dataProyecto->denominacion;
        }
        return $datosPlantilla;
    }

    public function construirDatosCargosPlantilla($value, $proyecto, $config = array())
    {
        $notMilitar       = $config['militar'];
        $datosPlantilla   = array();
        $datos            = $this->dameCargosInEstructura($value['idestructura'], $proyecto, $notMilitar);
        $cargosInmediatos = $datos['directos'];
        $datos            = $datos['general'];
        $resumen          = array('cargos' => $datos);
        $estructura       = $this->estructura->dameHijosEstructura($value['idestructura'], $proyecto);
        $organos          = array();
        $resultado        = array();
        if (count($estructura) > 0) {
            $organosInternos = $this->buscarDatosEstructura($estructura, $proyecto);
            if (count($organosInternos) > 0) {
                $organos = array_merge($organos, $organosInternos);
            }
        }
        if (count($resumen['cargos']) > 0 || (count($organos['cargos']) > 0 || count($organos['medios']) > 0)
        ) {
            $resultado[]      = array(
                'plantilla' => array(
                    'denominacion' => $value['denominacion'], 'tipo' => $value['tipo'], 'codigo' => $value['codigo']),
                'datos'     => $resumen, 'organo' => array(
                    'cargos' => $cargosInmediatos, 'estructuras' => $organos));
            $datosPlantilla[] = $resultado;
        }
        return $datosPlantilla;
    }

    public function dameDatosOrganigrama($proyecto, $config)
    {
        $organigrama = self::dameDatosReporteOrganigrama($config['anexoOrganigrama'], $proyecto);
        return $organigrama;
    }

    public function dameDatosReportePlantilla($idestructuras, $proyecto, $config)
    {
        $datosPlantilla        = array();
        $idsEntidades          = array();
        $plantillaIdsEntidades = array();
        $idsRestante           = array();
        $organigrama           = array();
        if ($config['anexoOrganigrama']) {
            $organigrama = self::dameDatosReporteOrganigrama($config['anexoOrganigrama'], $proyecto);
        }
        if ($config['anexoResumen'] || $config['anexoPlantilla']) {
            foreach ($idestructuras as $id) {
                $plantillas = $this->damePadresEntidades(array($id), $proyecto);
                if (count($plantillas)) {
                    $idsEntidades[]          = $id;
                    $plantillaIdsEntidades[] = $plantillas;
                } else {
                    $idsRestante[] = $id;
                }
            }
            $plantillaIdsEntidades = $plantillaIdsEntidades[0];
            if (count($idsEntidades)) {
                foreach ($plantillaIdsEntidades as $value) {
                    $result = self::construirDatosCargosPlantilla($value, $proyecto, $config);
                    if (count($result) > 0) {
                        $datosPlantilla [] = $result[0];
                    }
                }
            }
            if (count($idsRestante)) {
                $modelEstructura = new EstructuraModel();
                foreach ($idsRestante as $id) {
                    $datos                 = $modelEstructura->dameDatosEstructura($id, $proyecto);
                    $datos                 = $datos[0];
                    $datos['denominacion'] = strtoupper($datos['organo']) . ': ' . $datos['denominacion'];
                    $result                = self::construirDatosCargosPlantilla($datos, $proyecto, $config);
                    if (count($result) > 0) {
                        $datosPlantilla [] = $result[0];
                    }
                }
            }
        }
        if ($proyecto) {
            $dataProyecto               = Doctrine::getTable('DatProyecto')->find($proyecto);
            $datosPlantilla['proyecto'] = $dataProyecto->denominacion;
        }
        $datosPlantilla['organigrama'] = $organigrama;
        return $datosPlantilla;
    }

    public function getMaxWordSize($text, $size, $indexVal = 1.63)
    {
        $words = explode(' ', $text);
        foreach ($words as $word) {
            $count = strlen($word) * $indexVal;
            $size  = ($count > $size) ? $count : $size;
        }
        return $size;
    }

    public function dameOrganoSuperior($idestructura, $idproyecto = FALSE)
    {
        $where     = "idfila = {$idestructura}";
        $iddominio = $this->global->Perfil->iddominio;
        $query     = Doctrine_Query::create();
        $record    = $query->from('NomFilaestruc')->where($where)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
			//print_r($record);die;
        if (count($record) > 0) {
            $parent_path       = $record[0]['parent_path'].'';
		
            //$der       = $record[0]['rgt'];
            $whereWith = 'de.idestado = 0';
            if ($idproyecto) {
                $whereWith = "((de.idproyecto = $idproyecto AND de.idestado <> 3) " .
                    "OR (de.idproyecto=0 AND de.modificado [$idproyecto]=0))";
            }
            $resultado = $query->select(
                               '
                                         de.denominacion as denominacion,
                                         o.denominacion as tipo,
                                         o.idorgano as idorgano,
                                         fila.idpadre as idpadre,
                                         fila.idconcepto as idconcepto'
            )->from('NomFilaestruc fila')->innerJoin('fila.DatEstructura de')->innerJoin(
                               'de.NomOrgano o WITH o.idconcepto = de.idconcepto'
                )->where("fila.fechafin is null AND (fila.parent_path operator (public.@>) '$parent_path')")->andWhere(  /*fila.lft <= {$izq} AND fila.rgt >= {$der}*/
                               "fila.idconcepto = 1"
                )->andWhere("fila.dominiofila [$iddominio] = '1'")->andWhere($whereWith)->limit(1)->orderBy(
                               'fila.parent_path DESC'
                )->execute();
            return $resultado;
        } else {
            return array();
        }
    }

    public function dameDatosReporteOrganigrama($arrayIdEstructura, $proyecto)
    {
        $modelEstructura = new EstructuraModel();
        $estructuras     = array();
        $minWidth        = 0;

        foreach ($arrayIdEstructura as $index => $id) {
            $datos    = $modelEstructura->dameDatosEstructura($id, $proyecto);
            $datos    = array(
                'denominacion' => $datos[0]['text'], 'tipo' => $datos[0]['idorgano'] ? $datos[0]['organo'] : '',
                'idtipo'       => $datos[0]['idorgano'], 'id' => $datos[0]['id'], 'idpadre' => $datos[0]['idpadre'],
                'idconcepto'   => $datos[0]['idtipo'], 'hijos' => array());
            $minWidth = self::getMaxWordSize($datos['denominacion'], $minWidth);
            if ($index == 0) {
                $estructuras [] = $datos;
                if ($estructuras[$index]['idconcepto'] == 1) {
                    $plantilla = $datos;
                } else {
                    $organo         = self::dameOrganoSuperior($datos['id'], $proyecto);
                    $organo         = $organo[0];
                    $organo['tipo'] = $organo['idorgano'] ? $organo['tipo'] : '';
                    $plantilla      = $organo;
                }
            } else {
                foreach ($estructuras as $pos => $est) {
                    $hijos = $est['hijos'];
                    if ($est['id'] == $datos['idpadre']) {
                        $estructuras[$pos]['hijos'][] = $datos;
                        break;
                    } else {
                        if (count($hijos) > 0) {
                            foreach ($hijos as $posHijo => $hijo) {
                                if ($hijo['id'] == $datos['idpadre']) {
                                    $estructuras[$pos]['hijos'][$posHijo]['hijos'][] = $datos;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        $organigramas [] = array(
            'organo' => $plantilla, 'total' => count($estructuras[0]['hijos']), 'min' => $minWidth, 'nivel' => 3,
            'datos'  => $estructuras[0]);
        return $organigramas;
    }

    public function dameEstructurasPorProyectoOld($idProyecto)
    {
        $query          = Doctrine_Query::create();
        $datos          = $query->select(
                                'fila.idfila as id, fila.idconcepto,
                                (
                                  CASE
                                    WHEN estructura.idestructura IS NOT NULL THEN estructura.idestado
                                    WHEN estructuraop.idestructuraop IS NOT NULL THEN estructuraop.idestado
                                    WHEN medio.idmedio IS NOT NULL THEN medio.idestado
                                    WHEN cargo.idcargo IS NOT NULL THEN cargo.idestado
                                END) AS idestado'
        )->from("NomFilaestruc fila WITH fila.fechafin is null")->innerJoin("fila.NomConcepto concepto")->leftJoin(
                                "fila.DatEstructura estructura WITH estructura.idproyecto = $idProyecto"
            )->leftJoin(
                                "fila.DatEstructuraop estructuraop WITH estructuraop.idproyecto = $idProyecto"
            )->leftJoin("fila.DatMedio medio WITH medio.idproyecto = $idProyecto")->leftJoin(
                                "fila.DatCargo cargo WITH cargo.idproyecto = $idProyecto"
            )->where('estructura.idestructura IS NOT NULL')->orWhere('estructuraop.idestructuraop IS NOT NULL')
                                ->orWhere('medio.idmedio IS NOT NULL')->orWhere('cargo.idcargo IS NOT NULL')->orderBy(
                                'fila.idfila ASC, idestado ASC'
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        $addEstructuras = array();
        $modEstructuras = array();
        $delEstructuras = array();
        /**
         * CONFORMACION DE LOS ARREGLOS SEGUN LOS ESTADOS SE LAS ESTRUCTURAS Y LOS CONCEPTOS A LOS QUE
         * PERTENECEN
         */
        foreach ($datos as $estructura) {
            $concepto       = $estructura['idconcepto'];
            $estado         = $estructura['idestado'];
            $data           = $this->estructura->obtenerDatos($estructura['id'], $concepto, $idProyecto);
            $ruta           = $this->estructura->dameRutaEstructura(array($data['id']), FALSE, $idProyecto);
            //print_r($ruta);die;
            $data['ruta']   = $ruta[0]['rutaDenominacion'];
            $conform        = self::incluirEnArregloPorEstadoConcepto(
                                  array($addEstructuras, $modEstructuras, $delEstructuras), $data, $concepto, $estado
            );
            $addEstructuras = $conform[0];
            $modEstructuras = $conform[1];
            $delEstructuras = $conform[2];
        }
        return array('add' => $addEstructuras, 'mod' => $modEstructuras, 'del' => $delEstructuras);
    }

    public function dameEstructurasPorProyecto($idProyecto)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'fila.idfila as id, fila.idconcepto, fila.parent_path, fila.ordenunico,
                              (
                                CASE
                                  WHEN estructura.idestructura IS NOT NULL THEN estructura.idestado
                                  WHEN estructuraop.idestructuraop IS NOT NULL THEN estructuraop.idestado
                                  WHEN medio.idmedio IS NOT NULL THEN medio.idestado
                                  WHEN cargo.idcargo IS NOT NULL THEN cargo.idestado
                              END) AS idestado'
        )->from("NomFilaestruc fila WITH fila.fechafin is null")->innerJoin("fila.NomConcepto concepto")->leftJoin(
            "fila.DatEstructura estructura WITH estructura.idproyecto = $idProyecto"
        )->leftJoin(
            "fila.DatEstructuraop estructuraop WITH estructuraop.idproyecto = $idProyecto"
        )->leftJoin("fila.DatMedio medio WITH medio.idproyecto = $idProyecto")->leftJoin(
            "fila.DatCargo cargo WITH cargo.idproyecto = $idProyecto"
        )->where('estructura.idestructura IS NOT NULL')
            ->orWhere('estructuraop.idestructuraop IS NOT NULL')
            ->orWhere('medio.idmedio IS NOT NULL')->orWhere('cargo.idcargo IS NOT NULL')
            ->orderBy(
                'fila.ordenunico,fila.idfila ASC, idestado ASC'
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        $addEstructuras = array();
        $modEstructuras = array();
        $delEstructuras = array();
        /**
         * CONFORMACION DE LOS ARREGLOS SEGUN LOS ESTADOS SE LAS ESTRUCTURAS Y LOS CONCEPTOS A LOS QUE
         * PERTENECEN
         */
        foreach ($datos as $estructura) {
            $concepto = $estructura['idconcepto'];
            $estado = $estructura['idestado'];
            $data = $this->estructura->obtenerDatos($estructura['id'], $concepto, $idProyecto);

            $ruta = $this->estructura->dameRutaEstructura(array($data['id']), false, $idProyecto,false);

            $data['ruta'] = $ruta[0]['rutaDenominacion'];
            $data['rutaId'] = $ruta[0]['rutaId'];
            $conform = self::incluirEnArregloPorEstadoConcepto(
                array($addEstructuras, $modEstructuras, $delEstructuras), $data, $concepto, $estado
            );
            $addEstructuras = $conform[0];
            $modEstructuras = $conform[1];
            $delEstructuras = $conform[2];

        }
        $addEstructurasNew=array();
        foreach ($addEstructuras as $idconcepto => $addEstructura) {
            foreach ($addEstructura as $clave=> $item) {
                $addEstructurasNew[$idconcepto][$item['rutaId']][]=$item;
            }

        }
        $delEstructurasNew=array();
        foreach ($delEstructuras as $idconcepto => $delEstructura) {
            foreach ($delEstructura as $clave=> $item) {
                $delEstructurasNew[$idconcepto][$item['rutaId']][]=$item;
            }

        }
       // print_r($addEstructurasNew);die;
        return array('add' => $addEstructurasNew, 'mod' => $modEstructuras, 'del' => $delEstructurasNew);
    }

    private function incluirEnArregloPorEstadoConcepto($arrays, $ajuste, $tipoConcepto, $estado)
    {
        switch ($estado){
            case 1:
                $arrays[0][$tipoConcepto][] = $ajuste;
                break;
            case 2:
                $dataMod                    = $this->estructura->obtenerDatos($ajuste['id'], $ajuste['idconcepto'], 0);
                $arrays[1][$tipoConcepto][] = array('aprobado' => $dataMod, 'ajuste' => $ajuste);
                break;
            case 3:
                $arrays[2][$tipoConcepto][] = $ajuste;
                break;
        }
        return $arrays;
    }

    public function dameEscalasPorProyecto($idProyecto, $idestructuras = array())
    {
        $datEstructuraModel   = new DatEstructuraModel();
        $estructuraModel      = new EstructuraModel();
        $domainEscala         = new NomEscalaSalarial();
        $modelEscala          = new NomEscalaSalarialModel();
        $escalas              = $modelEscala->buscar(array(0, 0), 'esc.idtipoescala <> 0', TRUE);
        $salariosInEstructura = array();
        $estructuras = array();
        $hijosest = array();
        if(!empty($idestructuras)){
            foreach ($idestructuras as $est){
                $hijos = ZendExt_IoC::getInstance()->metadatos->BuscarArrIdsEstructurasHijasArbolCompleto($est);
                $hijosest = array_merge($hijosest,$hijos);
            }
        }else{
            $hijosest = ZendExt_IoC::getInstance()->metadatos->BuscarArrIdsEstructurasHijasArbolCompleto($_SESSION['Zeolides']['entidad']->idestructura);
            array_push($hijosest,$_SESSION['Zeolides']['entidad']->idestructura);            
        }
        $estructuras = $this->getEstructurasTipoEscalaByIds($hijosest);

        /**
         * BUSQUEDA DE LOS SALARIOS EN LA estructura
         */
        $plantillas = $datEstructuraModel->damePlantillasPorProyecto($idProyecto);
        foreach ($plantillas as $i => $plantilla) {
                $cargos = $estructuraModel->dameCargosPorEstructura($plantilla['idestructura'], $idProyecto);
                foreach ($cargos as $cargo) {
                    $tipoescala = $plantilla['idtipoescala'];
                    $existe     = $domainEscala->existeEscala($tipoescala, $cargo['idsalario']);
                    if ($existe) {
                        $salariosInEstructura[$tipoescala][] = array(
                            'grupocomplejidad' => $existe[0]['grupocomplejidad'], 'idsalario' => $cargo['idsalario'],
                            'salario'          => $cargo['salario']);
                    }
                }
        }
        $resultado      = array();
        $tiposDeEscalas = array();
        /*foreach ($escalas as $escala) {
                $pos = Util::buscarExistencia($tiposDeEscalas, $escala['tipoescala']);
                if (is_bool($pos)) {
                    $tiposDeEscalas [$escala['idtipoescala']] = array('denominacion' => $escala['tipoescala']);
                }
        }*/

        foreach ($escalas as $escala) {
            foreach ($estructuras as $est) {
                if($est['idtipoescala'] == $escala['idtipoescala']){

                    $pos = Util::buscarExistencia($tiposDeEscalas, $escala['tipoescala']);
                    if (is_bool($pos)) {
                        $tiposDeEscalas [$escala['idtipoescala']] = array('denominacion' => $escala['tipoescala']);
                    }

                    $grupo = $escala['grupocomplejidad'];
                    $tipo  = $escala['idtipoescala'];
                    if (!is_array($resultado[$grupo])) {
                        $resultado[$grupo] = $tiposDeEscalas;
                    }
                    foreach ($tiposDeEscalas as $indexTipo => $tipos) {
                        if (!is_array($resultado[$grupo][$indexTipo]['salarios'])) {
                            $resultado[$grupo][$indexTipo]['salarios'] = array();
                        }
                    }
                    $resultado[$grupo][$tipo]['salarios'][$escala['idsalario']] = array(
                        'salario' => $escala['salario'], 'existe' => FALSE);
                }
            }

        }
        foreach ($salariosInEstructura as $indexTipoEscala => $tipoEscala) {
            foreach ($tipoEscala as $salario) {
                $grupocomplejidad                                                                            = $salario['grupocomplejidad'];
                $resultado[$grupocomplejidad][$indexTipoEscala]['salarios'][$salario['idsalario']]['existe'] = TRUE;
            }
        }
        $datos = array('escalas' => $tiposDeEscalas, 'datos' => $resultado);
        return $datos;
    }

    static function getEstructurasTipoEscalaByIds($ids)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql  = "SELECT 
                      idestructura,
                      idtipoescala
                    FROM 
                      mod_estructuracomp.dat_estructura 
                      where idestructura in (" . implode(',', $ids) . ");";
        return $conn->fetchAll($sql);
    }

    static function copiarEstructura($id, $idPadre, $proyecto)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql  = "SELECT mod_estructuracomp.f_copiar_estructura($id, $idPadre, $proyecto, false);";
        $conn->fetchAll($sql);
        return TRUE;
    }

    static function cortarEstructura($id, $idPadre, $proyecto)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql  = "SELECT mod_estructuracomp.f_cortar_estructura($id, $idPadre, $proyecto);";
        $conn->fetchAll($sql);
        return TRUE;
    }

    /**
     * @param $cargosDirectos
     * @param $medios
     *
     * @return bool
     */
    private function verificaCantidades($cargosDirectos, $medios)
    {
        return count($cargosDirectos) > 0 || count($medios) > 0;
    }

    /**
     * @param $idProyecto
     *
     * @return bool
     */
    private function validaIdProyecto($idProyecto)
    {
        return is_numeric($idProyecto) && $idProyecto != 0;
    }

    /**
     * @param $proyecto
     * @param $estructuraInterna
     * @param $organos
     *
     * @return array
     */
    private function consArrayOrganos($proyecto, $estructuraInterna, $organos)
    {
        if (count($estructuraInterna) > 0) {
            $organosInternos = $this->buscarDatosEstructura($estructuraInterna, $proyecto);
            if (count($organosInternos) > 0) {
                $organos = array_merge($organos, $organosInternos);
                return $organos;
            }
            return $organos;
        }
        return $organos;
    }

    /**
     * @param $nomilitares
     * @param $where
     *
     * @return string
     */
    private function excluirMilitares($nomilitares, $where)
    {
        if ($nomilitares) {
            $where
                = 'cargo.idcargo NOT IN(
                SELECT cargom.idcargo
                FROM mod_estructuracomp.dat_cargomilitar cargom
            )';
            return $where;
        }
        return $where;
    }

    public function obtenerNomCargoByIdEstructura($idestructura)
    {
        $iddominio = $this->global->Perfil->iddominio;
        $conn      = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql       = "SELECT cargo.idnomcargo,nc.denominacion
        FROM mod_estructuracomp.nom_filaestruc fila
        INNER JOIN mod_estructuracomp.dat_cargo cargo ON(cargo.idcargo=fila.idfila AND cargo.idproyecto = 0)
        INNER JOIN mod_estructuracomp.nom_cargo nc ON(cargo.idnomcargo=nc.idnomcargo)
        WHERE fila.idconcepto = 7 AND fila.fechafin is null AND fila.dominiofila[$iddominio]=1::bit AND 
        (fila.parent_path operator (public.<@) 
        (SELECT nf.parent_path FROM mod_estructuracomp.nom_filaestruc nf
        WHERE nf.idfila = $idestructura) )
        GROUP BY cargo.idnomcargo,nc.denominacion
        ORDER BY cargo.idnomcargo";
                return $conn->fetchAll($sql);
            }


    public function getEstructurasByTipoescala($tipoescalasalarial)
    {
        $iddominio = $this->global->Perfil->iddominio;
        $conn      = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql       = "SELECT *
                                FROM 
                                  mod_estructuracomp.dat_estructura 
                                  where idtipoescala = $tipoescalasalarial;";
        return $conn->fetchAll($sql);
    }
}

